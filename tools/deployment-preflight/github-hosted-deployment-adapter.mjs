import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, lstat } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createInteractiveApprovalRecord, promoteRelease, uploadRelease } from './guarded-deployment-runner.mjs';
import { validateEnvironmentApproval, validateGitHubRun, validatePromotionVerification } from './github-environment-approval.mjs';
import { createCandidateBundle, decryptCandidateBundle, encryptCandidateBundle, unpackCandidateBundle } from './stage-github-candidate.mjs';

const fail = (message) => { throw new Error(message); };
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const jsonBytes = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const within=(path,root)=>{const rel=relative(resolve(root),resolve(path));return rel===''||(!rel.startsWith(`..${sep}`)&&rel!=='..'&&!isAbsolute(rel));};

async function githubRequest({owner,repo,path,token,fetchImpl=fetch}){
  const response=await fetchImpl(`https://api.github.com/repos/${owner}/${repo}${path}`,{headers:{accept:'application/vnd.github+json',authorization:`Bearer ${token}`,'x-github-api-version':'2022-11-28'}});
  if(!response.ok)fail(`GitHub candidate API returned HTTP ${response.status}`);
  return response.json();
}
function gitBlobSha(bytes){return createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes])).digest('hex');}

/** Fetches only encrypted blobs from the write-once candidate tree; no candidate branch is checked out or executed. */
export async function prepareHostedCandidate({owner,repo,candidateId,candidateRef,candidateCommit,sourceBaseCommit,descriptorSha256,expiresAtUtc,phase,workspaceRoot,dataRoot,stagingRoot,workflowSha,workflowRunId,workflowRunAttempt,token,privateKeyPem,fetchImpl=fetch}){
  if(!/^[0-9a-f-]{36}$/i.test(candidateId??'')||candidateRef!==`refs/heads/pcm-candidate/${candidateId}`||!/^[a-f0-9]{40}$/.test(candidateCommit??'')||!/^[a-f0-9]{64}$/.test(descriptorSha256??''))fail('candidate dispatch identifiers are malformed');
  const [mainRef,commit,tree]=await Promise.all([
    githubRequest({owner,repo,path:'/git/ref/heads/main',token,fetchImpl}),
    githubRequest({owner,repo,path:`/git/commits/${candidateCommit}`,token,fetchImpl}),
    githubRequest({owner,repo,path:`/git/trees/${candidateCommit}?recursive=1`,token,fetchImpl}),
  ]);
  if(mainRef.object?.sha!==sourceBaseCommit||commit.parents?.length!==1||commit.parents[0].sha!==sourceBaseCommit)fail('candidate is stale, rebased, or not based on the current protected default branch');
  const prefix=`.pcm-deployment-candidates/${candidateId}/`,entries=(tree.tree??[]).filter(item=>item.path?.startsWith(prefix));
  const descriptorEntry=entries.find(item=>item.path===`${prefix}descriptor.json`);
  const payloadEntries=entries.filter(item=>/^payload-\d{4}\.bin$/.test(item.path.slice(prefix.length))).sort((a,b)=>a.path.localeCompare(b.path,'en'));
  if(!descriptorEntry||!payloadEntries.length||entries.length!==payloadEntries.length+1||payloadEntries.some((item,index)=>item.path!==`${prefix}payload-${String(index).padStart(4,'0')}.bin`))fail('candidate tree contains missing, unexpected, or ambiguous deployment files');
  const getBlob=async entry=>{
    const blob=await githubRequest({owner,repo,path:`/git/blobs/${entry.sha}`,token,fetchImpl});
    if(blob.encoding!=='base64'||typeof blob.content!=='string')fail('GitHub candidate blob encoding is invalid');
    const bytes=Buffer.from(blob.content.replace(/\s/g,''),'base64');
    if(gitBlobSha(bytes)!==entry.sha)fail('candidate Git blob failed its object hash');
    return bytes;
  };
  const descriptorBytes=await getBlob(descriptorEntry);
  if(sha256(descriptorBytes)!==descriptorSha256)fail('candidate descriptor hash differs from the workflow dispatch');
  const descriptor=JSON.parse(descriptorBytes.toString('utf8'));
  if(descriptor.schema!=='pcm-encrypted-candidate/v1'||descriptor.candidateId!==candidateId||descriptor.phase!==phase
      ||descriptor.sourceBaseCommit!==sourceBaseCommit||descriptor.payloadChunks!==payloadEntries.length||descriptor.expiresAtUtc!==expiresAtUtc)fail('candidate descriptor identity, expiry, or completeness is invalid');
  const encrypted={chunks:await Promise.all(payloadEntries.map(getBlob)),descriptor,privateKeyPem};
  const archive=decryptCandidateBundle(encrypted);
  if(sha256(archive)!==descriptor.bundleSha256)fail('candidate bundle digest differs from the staged candidate envelope');
  const unpacked=await unpackCandidateBundle(archive,stagingRoot);
  const metadata=JSON.parse(await readFile(join(stagingRoot,'release/staging-metadata.json'),'utf8'));
  if(metadata.schema!=='pcm-github-stage-metadata/v1'||resolve(metadata.sourceProjectRoot)!==resolve(workspaceRoot)||resolve(metadata.sourceDataRoot)!==resolve(dataRoot))fail('staged paths do not match the configured trusted workspace and deployment data root');
  const planBytes=await readFile(join(stagingRoot,'release/release-plan.json'));
  const plan=JSON.parse(planBytes.toString('utf8'));
  const originalPlanHash=plan.releasePlanSha256;
  if(originalPlanHash!==descriptor.releasePlanSha256||sha256(jsonBytes(stripPlanHash(plan)))!==originalPlanHash)fail('staged release plan signature or descriptor hash is invalid');
  const toolchain=JSON.parse(await readFile(join(stagingRoot,'release/deployment-toolchain.json'),'utf8'));
  for(const file of toolchain){const trustedPath=join(workspaceRoot,...file.path.split('/'));if(!within(trustedPath,resolve(workspaceRoot)))fail('deployment toolchain path escapes trusted workspace');const bytes=await readFile(trustedPath);if(sha256(bytes)!==file.sha256)fail(`trusted default-branch deployment tool changed: ${file.path}`);}
  const existing=await lstat(metadata.sourceReleaseDir).catch(()=>null);if(existing)fail('target release directory already exists on the hosted runner');
  for(const entry of unpacked.files){
    if(!entry.originalPath)continue;
    const source=resolve(entry.originalPath),bytes=await readFile(join(stagingRoot,...entry.path.split('/')));
    if(!within(source,dataRoot)){
      if(!within(source,metadata.sourceProjectRoot))fail('staged original path is outside allowed deployment and trusted project roots');
      const target=join(workspaceRoot,...relative(metadata.sourceProjectRoot,source).split(/[\\/]/));
      if(sha256(await readFile(target))!==entry.sha256)fail(`trusted checkout file differs from staged evidence: ${entry.path}`);
      continue;
    }
    const destination=source;
    await mkdir(dirname(destination),{recursive:true});
    await writeFile(destination,bytes,{flag:'wx'}).catch(async error=>{
      if(error.code!=='EEXIST')throw error;
      if(sha256(await readFile(destination))!==entry.sha256)fail('preexisting hosted file differs from the staged hash');
    });
  }
  const manifestBytes=await readFile(plan.candidateManifestPath);
  if(sha256(manifestBytes)!==plan.candidateManifestSha256)fail('candidate manifest hash failed after hosted transfer');
  if(descriptor.phase==='promote'&&descriptor.uploadedVersion!==JSON.parse(await readFile(join(metadata.sourceReleaseDir,'release-state-preview.json'),'utf8')).versionId)fail('promotion bundle does not match its uploaded Worker version');
  const envelope={schema:'pcm-github-candidate/v1',phase:descriptor.phase,candidateId,candidateCommit,manifestSha256:descriptor.candidateManifestSha256,bundleSha256:descriptor.bundleSha256,
    baselineSha256:descriptor.baselineSha256,acceptedBaselineVersion:descriptor.acceptedBaselineVersion,worker:descriptor.worker,
    workflowRunId:Number(workflowRunId),workflowRunAttempt:Number(workflowRunAttempt),expiresAtUtc:descriptor.expiresAtUtc,...(descriptor.phase==='promote'?{workerVersion:descriptor.uploadedVersion,originCandidateCommit:descriptor.originCandidateCommit}:{})};
  const wranglerRoot=resolve(dirname(metadata.wranglerDist),'../..');
  if(resolve(process.env.PCM_WRANGLER_ROOT??'')!==wranglerRoot)fail('hosted Wrangler installation path does not match the approved package path');
  const installedDist=await readFile(metadata.wranglerDist);if(sha256(installedDist)!==plan.wranglerIntegrity.sha256)fail('hosted Wrangler binary hash does not match the reviewed release plan');
  return {releaseDir:metadata.sourceReleaseDir,plan,originalPlanHash,descriptor,envelope,manifestSha256:sha256(manifestBytes),candidateFileCount:unpacked.files.filter(item=>item.path.startsWith('candidate/')).length,wranglerRoot,wranglerVersion:JSON.parse(await readFile(join(stagingRoot,'release/wrangler-package.json'),'utf8')).version};
}
function stripPlanHash(plan){const {releasePlanSha256,...unsigned}=plan;return unsigned;}

export async function writeEncryptedHostedHandoff({releaseDir,phase,publicKeyPem,outputDir,now=Date.now()}){
  if(!['upload','promote'].includes(phase))fail('handoff phase must be upload or promote');
  const bundle=await createCandidateBundle(releaseDir,{phase:`handoff-${phase}`}),encrypted=encryptCandidateBundle(bundle.archive,publicKeyPem);
  const descriptor={schema:'pcm-github-handoff/v1',phase,manifestSha256:bundle.manifestSha256,baselineSha256:bundle.baselineSha256,
    bundleSha256:encrypted.plaintextSha256,plaintextSha256:encrypted.plaintextSha256,ciphertextSha256:encrypted.ciphertextSha256,
    payloadChunks:encrypted.chunks.length,wrappedKey:encrypted.wrappedKey,nonce:encrypted.nonce,tag:encrypted.tag,
    expiresAtUtc:new Date(now+120*60*1000).toISOString()};
  await mkdir(outputDir,{recursive:false});
  for(const chunk of encrypted.chunks)await writeFile(join(outputDir,`payload-${String(chunk.index).padStart(4,'0')}.bin`),chunk.bytes,{flag:'wx'});
  await writeFile(join(outputDir,'descriptor.json'),jsonBytes(descriptor),{flag:'wx'});
  return {outputDir,descriptorSha256:sha256(jsonBytes(descriptor)),ciphertextSha256:descriptor.ciphertextSha256,payloadChunks:descriptor.payloadChunks,expiresAtUtc:descriptor.expiresAtUtc};
}

export async function runFromGithubWorkflow(){
  const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8')),inputs=event.inputs??{},[owner,repo]=(process.env.GITHUB_REPOSITORY??'').split('/');
  const phase=inputs.phase,context={runId:process.env.GITHUB_RUN_ID,runAttempt:process.env.GITHUB_RUN_ATTEMPT,actorId:process.env.GITHUB_ACTOR_ID};
  const workflowSha=process.env.GITHUB_SHA,projectRoot=process.env.PCM_TRUSTED_PROJECT_ROOT,dataRoot=process.env.PCM_DEPLOYMENT_DATA_ROOT;
  const stagingRoot=join(process.env.RUNNER_TEMP,`pcm-candidate-${inputs.candidate_id}`);
  const prepared=await prepareHostedCandidate({owner,repo,candidateId:inputs.candidate_id,candidateRef:inputs.candidate_ref,candidateCommit:inputs.candidate_commit,
    sourceBaseCommit:inputs.source_base_commit,descriptorSha256:inputs.descriptor_sha256,expiresAtUtc:inputs.expires_at_utc,phase,workspaceRoot:projectRoot,dataRoot,stagingRoot,workflowSha,
    workflowRunId:context.runId,workflowRunAttempt:context.runAttempt,token:process.env.PCM_GITHUB_API_TOKEN,privateKeyPem:process.env.PCM_CANDIDATE_DECRYPTION_PRIVATE_KEY});
  if(phase==='promote'&&inputs.preview_url!==prepared.envelope.previewUrl&&prepared.envelope.previewUrl)fail('production approval preview URL differs from the verified uploaded preview');
  if(!['upload','promote'].includes(phase))fail('workflow phase input is invalid');
  const expected={phase,candidateCommit:prepared.envelope.candidateCommit,manifestSha256:prepared.envelope.manifestSha256,bundleSha256:prepared.envelope.bundleSha256,
    baselineSha256:prepared.envelope.baselineSha256,acceptedBaselineVersion:prepared.envelope.acceptedBaselineVersion,workflowRunId:Number(context.runId),workflowRunAttempt:Number(context.runAttempt),
    ...(phase==='promote'?{workerVersion:prepared.envelope.workerVersion,originCandidateCommit:prepared.envelope.originCandidateCommit}:{})};
  const config={githubToken:process.env.PCM_GITHUB_API_TOKEN,expectedBotId:process.env.PCM_RELEASE_APP_BOT_ID,expectedOwnerId:process.env.PCM_OWNER_GITHUB_ID};
  const result=await runHostedDeploymentPhase({action:phase,releaseDir:prepared.releaseDir,owner,repo,candidateRef:inputs.candidate_ref,workflowSha,envelope:prepared.envelope,expected,context,config});
  const output=join(process.env.RUNNER_TEMP,`pcm-${phase}-handoff`),key=Buffer.from(process.env.PCM_CANDIDATE_ENCRYPTION_PUBLIC_KEY_B64??'','base64').toString('utf8');
  const handoff=await writeEncryptedHostedHandoff({releaseDir:prepared.releaseDir,phase,publicKeyPem:key,outputDir:output});
  const stateName=phase==='upload'?'release-state.json':'release-state-post-promotion.json',state=JSON.parse(await readFile(join(prepared.releaseDir,stateName),'utf8'));
  process.stdout.write(`${JSON.stringify({phase,status:state.stage,workerVersion:state.versionId??state.productionVersionAfterPromotion??null,previewUrl:state.previewUrl??null,manifestSha256:prepared.manifestSha256,baselineSha256:prepared.plan.baselineSha256,handoff,approvalAuditPath:result.approvalAuditPath},null,2)}\n`);
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  runFromGithubWorkflow().catch(error=>{process.stderr.write(`BLOCKED: ${String(error?.message??'hosted deployment step failed').replace(/[\r\n]/g,' ')}\n`);process.exitCode=1;});
}

async function githubJson({ owner, repo, path, token, fetchImpl = fetch }) {
  const response = await fetchImpl(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${token}`, 'x-github-api-version': '2022-11-28' },
  });
  if (!response.ok) fail(`GitHub approval API returned HTTP ${response.status}`);
  return response.json();
}

/** Read-only, fail-closed verification of run identity, candidate ref, and reviewer. */
export async function verifyHostedEnvironmentApproval({ action, owner, repo, candidateRef, workflowSha, envelope, expected, context, config, fetchImpl = fetch, now = Date.now() }) {
  const runId = Number(context?.runId), attempt = Number(context?.runAttempt);
  const run = await githubJson({ owner, repo, path: `/actions/runs/${runId}`, token: config.githubToken, fetchImpl });
  validateGitHubRun({ run, workflowRunId: runId, workflowRunAttempt: attempt, expectedBotId: config.expectedBotId, expectedWorkflowSha: workflowSha });
  if (String(context.actorId) !== String(config.expectedBotId) || candidateRef !== `refs/heads/pcm-candidate/${envelope.candidateId}`) fail('candidate ref or workflow initiator does not match the configured release App');
  const ref = await githubJson({ owner, repo, path: `/git/ref/heads/pcm-candidate/${envelope.candidateId}`, token: config.githubToken, fetchImpl });
  if (ref?.object?.sha !== envelope.candidateCommit) fail('write-once candidate ref no longer points at its staged commit');
  const expectedFacts = { ...expected, candidateCommit: envelope.candidateCommit, workflowRunId: runId, workflowRunAttempt: attempt };
  const approvals = await githubJson({ owner, repo, path: `/actions/runs/${runId}/approvals`, token: config.githubToken, fetchImpl });
  const approval = validateEnvironmentApproval({ envelope, expected: expectedFacts, action, environment: action === 'upload' ? 'pcm-upload' : 'pcm-production', approvals,
    actorId: context.actorId, expectedInitiatorId: config.expectedBotId, expectedOwnerId: config.expectedOwnerId, now });
  const approvalEntry = approvals.find(entry => entry?.state === 'approved' && String(entry.user?.id) === String(config.expectedOwnerId)
    && entry.environments?.some(environment => environment.name === approval.environment));
  return { approval, approvalEntry, approvalRecordSha256: sha256(jsonBytes(approvalEntry)), run };
}

/**
 * Runs the existing guarded action only after GitHub's exact environment
 * approval is verified. Cloudflare calls remain inside the current guard.
 */
export async function runHostedDeploymentPhase({ action, releaseDir, owner, repo, candidateRef, workflowSha, envelope, expected, context, config, now = Date.now() }, dependencies = {}) {
  if (!['upload', 'promote'].includes(action)) fail('hosted deployment phase must be upload or promote');
  const releaseRoot = resolve(releaseDir);
  if (process.env.PCM_GITHUB_DEPLOYMENT_MODE !== 'true' && !dependencies.dryRun) fail('hosted deployment mode is not explicitly enabled');
  if (!dependencies.dryRun && (!process.env.CLOUDFLARE_API_TOKEN || !config.githubToken)) fail('protected GitHub or Cloudflare job credential is missing');
  if (dependencies.dryRun && !(action === 'upload' ? dependencies.uploadAction : dependencies.promoteAction)) fail('credential-free dry run requires a mocked guarded action');
  const verified = await verifyHostedEnvironmentApproval({ action, owner, repo, candidateRef, workflowSha, envelope, expected, context, config, fetchImpl: dependencies.fetchImpl ?? fetch, now });
  const phase = action === 'upload' ? 'UPLOAD' : 'PROMOTE';
  const replayPath = join(releaseRoot, `github-approval-consumed-${action}-${context.runId}.json`);
  await writeFile(replayPath, jsonBytes({ schema: 'pcm-github-approval-consumption/v1', action, runId: context.runId,
    reviewerId: verified.approval.reviewerId, candidateCommit: envelope.candidateCommit, manifestSha256: envelope.manifestSha256,
    baselineSha256: envelope.baselineSha256, consumedAtUtc: new Date(now).toISOString() }), { flag: 'wx' }).catch(error => {
    if (error.code === 'EEXIST') fail('GitHub environment approval has already been consumed for this action and run');
    throw error;
  });
  const auth = dependencies.authorizationFactory
    ? await dependencies.authorizationFactory({ releaseDir: releaseRoot, phase, approver: verified.approvalEntry.user.login, now })
    : await createInteractiveApprovalRecord({ releaseDir: releaseRoot, phase, approver: verified.approvalEntry.user.login, now });
  const authorizationPath = join(releaseRoot, `github-authorization-${action}-${context.runId}-${randomUUID()}.json`);
  await writeFile(authorizationPath, jsonBytes(auth), { flag: 'wx' });
  const auditPath = join(releaseRoot, `github-approval-${action}-${context.runId}-${randomUUID()}.json`);
  const audit = { schema: 'pcm-github-approval-audit/v1', ...verified.approval, reviewerLogin: verified.approvalEntry.user.login,
    approvalRecordSha256: verified.approvalRecordSha256, workflowSha, candidateRef, authorizationSha256: sha256(jsonBytes(auth)),
    status: 'APPROVED_AND_VALIDATED', createdAtUtc: new Date(now).toISOString() };
  await writeFile(auditPath, jsonBytes(audit), { flag: 'wx' });
  const actionFn = action === 'upload' ? (dependencies.uploadAction ?? uploadRelease) : (dependencies.promoteAction ?? promoteRelease);
  const result = await actionFn({ releaseDir: releaseRoot, authorizationPath }, dependencies.guardDependencies ?? {});
  if (action === 'promote' && !dependencies.dryRun) {
    const state = JSON.parse(await readFile(join(releaseRoot, 'release-state-post-promotion.json'), 'utf8'));
    const verification = JSON.parse(await readFile(join(releaseRoot, 'post-promotion-verification.json'), 'utf8'));
    const evidence = { status: state.postPromotionTrafficVerified ? 'PASS' : 'FAIL', versionId: verification.observed_version_id,
      trafficPercentage: verification.observed_production_allocations?.[0]?.percentage?.value };
    validatePromotionVerification({ approval: { ...verified.approval, workerVersion: envelope.workerVersion }, workerVersion: envelope.workerVersion, verification: evidence, now });
  }
  return { result, authorizationPath, approvalAuditPath: auditPath };
}

export function assertHostedSecretsAreNotLogged(text, token) {
  if (typeof text !== 'string' || (token && text.includes(token))) fail('Cloudflare token appeared in hosted adapter output');
  return true;
}
