import { createCipheriv, createDecipheriv, createHash, privateDecrypt, publicEncrypt, randomBytes, randomUUID, constants } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync, gzipSync } from 'node:zlib';
import { scanCandidate } from './guarded-deployment-runner.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const API = 'https://api.github.com';
const MAX_PACKAGE_BYTES = 512 * 1024 * 1024;
const MAX_GIT_BLOB_BYTES = 45 * 1024 * 1024;
const fail = (message) => { throw new Error(message); };
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const within=(path,root)=>{const rel=relative(resolve(root),resolve(path));return rel===''||(!rel.startsWith(`..${sep}`)&&rel!=='..'&&!isAbsolute(rel));};
const jsonBytes = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);

async function ordinaryFile(path, label) {
  const stat = await lstat(path).catch(() => null);
  if (!stat?.isFile() || stat.isSymbolicLink() || stat.isReparsePoint?.()) fail(`${label} must be an ordinary file`);
  return readFile(path);
}

/** Build an encrypted, file-inventory-bound release bundle without reading Git status. */
export async function createCandidateBundle(runDir, { phase = 'upload' } = {}) {
  if(!['upload','promote','handoff-upload','handoff-promote'].includes(phase))fail('staging phase is invalid');
  if (!isAbsolute(runDir)) fail('run directory must be absolute');
  const planPath = join(runDir, 'release-plan.json');
  const planBytes = await ordinaryFile(planPath, 'release plan');
  const plan = JSON.parse(planBytes.toString('utf8'));
  const { releasePlanSha256, ...unsigned } = plan;
  if (plan.schema !== 'pcm-guarded-release-plan/v1' || plan.status !== 'READY_FOR_OWNER_REVIEW'
      || sha256(jsonBytes(unsigned)) !== releasePlanSha256) fail('release plan is incomplete or hash-invalid');
  if (!plan.account?.id || !plan.productionVersion || !plan.rollbackVersion) fail('release plan lacks account, production, or rollback binding');
  const dataRoot=resolve(process.env.PCM_DEPLOYMENT_DATA_ROOT??'C:/Users/HP/PCM-deployment');
  const repoRoot=resolve(HERE,'../..');
  for(const [label,path] of [['release directory',runDir],['candidate package',plan.candidatePackage],['baseline',plan.baselinePath],['acceptance',plan.acceptancePath],['allowlist',plan.allowlistPath],['candidate manifest',plan.candidateManifestPath],['initial preflight',plan.initialPreflightReportPath]])
    if(!within(path,dataRoot))fail(`${label} must be inside the configured isolated deployment data root`);
  if(plan.workflow){
    if(!within(plan.workflow.selection?.path??'',dataRoot))fail('baseline selection must be inside the isolated deployment data root');
    for(const ref of plan.workflow.verificationFiles??[])if(!within(ref.path,dataRoot)&&!within(ref.path,repoRoot))fail('verification evidence path is outside the deployment data root and trusted project');
  }

  const scanned = await scanCandidate(plan.candidatePackage);
  const manifest = jsonBytes({ schema: 'pcm-release-candidate-manifest/v1', files: scanned.files });
  if (sha256(manifest) !== plan.candidateManifestSha256) fail('candidate manifest changed after review');

  const inputFiles = new Map();
  const add = async (archivePath, sourcePath, expectedHash) => {
    if (inputFiles.has(archivePath)) return;
    const bytes = await ordinaryFile(sourcePath, archivePath);
    if (expectedHash && sha256(bytes) !== expectedHash) fail(`deployment evidence changed after review: ${archivePath}`);
    inputFiles.set(archivePath, { path: archivePath, originalPath: resolve(sourcePath), bytes, sha256: sha256(bytes) });
  };
  for (const item of scanned.files) await add(`candidate/${item.path}`, join(plan.candidatePackage, ...item.path.split('/')), item.sha256);
  await add('release/release-plan.json', planPath, releasePlanSha256);
  await add('release/candidate-manifest.json', plan.candidateManifestPath, plan.candidateManifestSha256);
  await add('release/baseline.json', plan.baselinePath, plan.baselineSha256);
  await add('release/acceptance.json', plan.acceptancePath, plan.acceptanceSha256);
  await add('release/allowlist.json', plan.allowlistPath, plan.allowlistSha256);
  await add('release/initial-preflight.json', plan.initialPreflightReportPath, plan.initialPreflightReportSha256);
  const baseline = JSON.parse((await ordinaryFile(plan.baselinePath, 'accepted baseline')).toString('utf8'));
  if(!Array.isArray(baseline.file_hashes)||!baseline.package?.root)fail('accepted baseline package inventory is incomplete');
  for(const file of baseline.file_hashes)await add(`release/baseline-package/${file.path}`,join(baseline.package.root,...file.path.split('/')),file.sha256);
  const report = JSON.parse((await ordinaryFile(plan.initialPreflightReportPath, 'preflight report')).toString('utf8'));
  if (!report.workerVerificationEvidencePath) fail('fresh account evidence reference is missing');
  await add('release/account-evidence.json', report.workerVerificationEvidencePath);
  if (plan.workflow) {
    const selection = plan.workflow.selection;
    if (!selection?.path || !selection.sha256) fail('accepted baseline selection evidence is incomplete');
    await add('release/selection.json', selection.path, selection.sha256);
    for (let i = 0; i < plan.workflow.verificationFiles.length; i++) {
      const ref = plan.workflow.verificationFiles[i];
      await add(`release/verification/${String(i).padStart(3, '0')}-${basename(ref.path)}`, ref.path, ref.sha256);
    }
    if (!Array.isArray(plan.workflow.owners) || plan.workflow.owners.length !== plan.approvedChanges.length) fail('authoritative changed-file ownership evidence is incomplete');
  }
  let uploadedVersion=null,originCandidateCommit=null;
  if(phase==='promote'){
    const statePath=join(runDir,'release-state-preview.json'),stateBytes=await ordinaryFile(statePath,'preview-approved release state');
    const state=JSON.parse(stateBytes.toString('utf8'));
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(state.versionId??'')
        ||state.candidateManifestSha256!==plan.candidateManifestSha256||!state.previewSmokeSha256||!state.previewSmokeEvidencePath)fail('promotion staging requires the exact uploaded version and complete preview evidence');
    uploadedVersion=state.versionId;
    for(const name of ['release-state.json','release-state-preview.json','upload-authorization.json','wrangler-upload-output.json','uploaded-version-verification.json','asset-upload-verification.json','asset-request-verification.json']){
      await add(`release/${name}`,join(runDir,name));
    }
    const approvalFiles=(await readdir(runDir)).filter(name=>/^github-approval-upload-\d+-.+\.json$/.test(name));
    if(!approvalFiles.length)fail('promotion staging requires the retained GitHub upload approval audit');
    for(let i=0;i<approvalFiles.length;i++){
      const auditBytes=await ordinaryFile(join(runDir,approvalFiles[i]),'upload approval audit'),audit=JSON.parse(auditBytes.toString('utf8'));
      if(audit.schema!=='pcm-github-approval-audit/v1'||audit.action!=='upload'||audit.manifestSha256!==plan.candidateManifestSha256||audit.baselineSha256!==plan.baselineSha256)fail('retained GitHub upload approval does not match this candidate and baseline');
      if(originCandidateCommit&&originCandidateCommit!==audit.candidateCommit)fail('promotion evidence contains conflicting original candidate commits');
      originCandidateCommit=audit.candidateCommit;
      await add(`release/upload-approval-audit-${String(i).padStart(2,'0')}.json`,join(runDir,approvalFiles[i]));
    }
    const uploadAuthorization=await ordinaryFile(join(runDir,'upload-authorization.json'),'retained upload authorization');
    if(sha256(uploadAuthorization)!==state.uploadAuthorizationSha256)fail('retained upload authorization hash differs from uploaded release state');
    const smokeBytes=await ordinaryFile(state.previewSmokeEvidencePath,'preview smoke evidence');
    if(sha256(smokeBytes)!==state.previewSmokeSha256)fail('preview smoke evidence changed before promotion staging');
    await add('release/preview-smoke-evidence.json',state.previewSmokeEvidencePath,state.previewSmokeSha256);
    const smoke=JSON.parse(smokeBytes.toString('utf8')),evidenceRefs=[];
    const visit=value=>{if(!value||typeof value!=='object')return;if(typeof value.path==='string'&&/^[a-f0-9]{64}$/.test(value.sha256??''))evidenceRefs.push({path:value.path,sha256:value.sha256});for(const child of Object.values(value))visit(child);};
    visit(smoke);
    for(let i=0;i<evidenceRefs.length;i++)await add(`release/preview-proof/${String(i).padStart(3,'0')}-${basename(evidenceRefs[i].path)}`,evidenceRefs[i].path,evidenceRefs[i].sha256);
  }
  if(phase==='handoff-upload'||phase==='handoff-promote'){
    const expectedState=phase==='handoff-upload'?'release-state.json':'release-state-post-promotion.json';
    const stateBytes=await ordinaryFile(join(runDir,expectedState),'completed hosted deployment state'),state=JSON.parse(stateBytes.toString('utf8'));
    if(state.candidateManifestSha256!==plan.candidateManifestSha256)fail('deployment handoff state belongs to a different candidate');
    const names=phase==='handoff-upload'
      ? ['release-state.json','upload-authorization.json','wrangler-upload-output.json','uploaded-version-verification.json','asset-upload-verification.json','asset-request-verification.json']
      : ['release-state-post-promotion.json','promotion-authorization.json','post-promotion-summary.json','post-promotion-verification.json','post-promotion-verification-attempts.json'];
    for(const name of names)await add(`release/${name}`,join(runDir,name));
    const action=phase==='handoff-upload'?'upload':'promote';
    const audits=(await readdir(runDir)).filter(name=>new RegExp(`^github-approval-${action}-\\d+-.+\\.json$`).test(name));
    if(!audits.length)fail('deployment handoff lacks its GitHub approval audit');
    for(let i=0;i<audits.length;i++)await add(`release/${action}-approval-audit-${String(i).padStart(2,'0')}.json`,join(runDir,audits[i]));
  }
  const metadata={schema:'pcm-github-stage-metadata/v1',phase,sourceDataRoot:dataRoot,sourceProjectRoot:repoRoot,sourceReleaseDir:resolve(runDir),wranglerDist:plan.wranglerIntegrity?.dist};
  inputFiles.set('release/staging-metadata.json',{path:'release/staging-metadata.json',originalPath:null,bytes:jsonBytes(metadata),sha256:sha256(jsonBytes(metadata))});
  const wranglerPackagePath=resolve(dirname(plan.wranglerIntegrity?.dist??''),'../wrangler/package.json');
  const wranglerPackage=JSON.parse((await ordinaryFile(wranglerPackagePath,'pinned Wrangler package metadata')).toString('utf8'));
  if(typeof wranglerPackage.version!=='string'||!wranglerPackage.version)fail('pinned Wrangler package version is missing');
  inputFiles.set('release/wrangler-package.json',{path:'release/wrangler-package.json',originalPath:null,bytes:jsonBytes({version:wranglerPackage.version}),sha256:sha256(jsonBytes({version:wranglerPackage.version}))});
  const toolPaths=['tools/deployment-preflight/guarded-deployment-runner.mjs','tools/deployment-preflight/deployment-workflow.mjs',
    'tools/deployment-preflight/smoke-evidence.mjs','tools/deployment-preflight/unified-preflight.mjs',
    'tools/deployment-preflight/account-binding.mjs','tools/deployment-preflight/guarded-wrangler-assets.cjs',
    'tools/deployment-verifier/Verify-Cloudflare-Production.ps1','tools/deployment-verifier/CloudflareProductionVerifier.psm1'];
  const toolchain=[];
  for(const path of toolPaths){const bytes=await ordinaryFile(join(repoRoot,...path.split('/')),`trusted deployment tool ${path}`);toolchain.push({path,sha256:sha256(bytes)});}
  inputFiles.set('release/deployment-toolchain.json',{path:'release/deployment-toolchain.json',originalPath:null,bytes:jsonBytes(toolchain),sha256:sha256(jsonBytes(toolchain))});
  const total = [...inputFiles.values()].reduce((sum, item) => sum + item.bytes.length, 0);
  if (total > MAX_PACKAGE_BYTES) fail('candidate and deployment evidence exceed the 512 MiB staging limit');
  const inventory = [...inputFiles.values()].map(({ path, originalPath, bytes, sha256: digest }) => ({ path, ...(originalPath?{originalPath}:{}), bytes: bytes.length, sha256: digest }));
  const archive = gzipSync(jsonBytes({ schema: 'pcm-github-candidate-bundle/v1', releasePlanSha256, candidateManifestSha256: plan.candidateManifestSha256, files: inventory.map(item => ({ ...item, contentBase64: inputFiles.get(item.path).bytes.toString('base64') })) }), { level: 9, mtime: 0 });
  const bundleSha256 = sha256(archive);
  if(phase==='promote'&&!originCandidateCommit)fail('promotion package is not bound to its original upload candidate commit');
  return { archive, bundleSha256, manifestSha256: plan.candidateManifestSha256, releasePlanSha256, baselineSha256: plan.baselineSha256, phase, uploadedVersion,originCandidateCommit,
    acceptedBaselineVersion: baseline.worker?.active_version, productionVersion: plan.productionVersion, rollbackVersion: plan.rollbackVersion,
    accountId: plan.account.id, worker: plan.worker, fileCount: inventory.length, totalBytes: total };
}

/** Encrypt locally with the owner's pre-provisioned public key; this function creates no keys or credentials. */
export function encryptCandidateBundle(archive, publicKeyPem) {
  if (!Buffer.isBuffer(archive) || !archive.length) fail('candidate bundle is empty');
  if (typeof publicKeyPem !== 'string' || !publicKeyPem.includes('BEGIN PUBLIC KEY')) fail('an owner-provisioned RSA public key is required');
  const contentKey = randomBytes(32), nonce = randomBytes(12);
  try {
    const cipher = createCipheriv('aes-256-gcm', contentKey, nonce);
    const ciphertext = Buffer.concat([cipher.update(archive), cipher.final()]);
    const wrappedKey = publicEncrypt({ key: publicKeyPem, oaepHash: 'sha256', padding: constants.RSA_PKCS1_OAEP_PADDING }, contentKey);
    const chunks = [];
    for (let offset = 0, index = 0; offset < ciphertext.length; offset += MAX_GIT_BLOB_BYTES, index++) {
      chunks.push({ index, bytes: ciphertext.subarray(offset, offset + MAX_GIT_BLOB_BYTES) });
    }
    return { ciphertextSha256: sha256(ciphertext), plaintextSha256: sha256(archive), nonce: nonce.toString('base64'), tag: cipher.getAuthTag().toString('base64'), wrappedKey: wrappedKey.toString('base64'), chunks };
  } finally { contentKey.fill(0); }
}

export function decryptCandidateBundle({ chunks, descriptor, privateKeyPem }) {
  if (!Array.isArray(chunks) || chunks.length !== descriptor?.payloadChunks || !chunks.length) fail('encrypted candidate chunk inventory is incomplete');
  if (typeof privateKeyPem !== 'string' || !privateKeyPem.includes('BEGIN PRIVATE KEY')) fail('protected candidate decryption key is missing');
  const ciphertext = Buffer.concat(chunks.map((chunk, index) => {
    if (!Buffer.isBuffer(chunk) || chunk.length > MAX_GIT_BLOB_BYTES || (index < chunks.length - 1 && chunk.length !== MAX_GIT_BLOB_BYTES)) fail('encrypted candidate chunk size or ordering is invalid');
    return chunk;
  }));
  if (sha256(ciphertext) !== descriptor.ciphertextSha256) fail('encrypted candidate bytes changed after staging');
  if (descriptor.bundleSha256 && descriptor.bundleSha256 !== descriptor.plaintextSha256) fail('candidate bundle digest does not match its encrypted descriptor');
  const key = privateDecrypt({ key: privateKeyPem, oaepHash: 'sha256', padding: constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(descriptor.wrappedKey, 'base64'));
  try {
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(descriptor.nonce, 'base64'));
    decipher.setAuthTag(Buffer.from(descriptor.tag, 'base64'));
    const archive = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    if (sha256(archive) !== descriptor.plaintextSha256) fail('decrypted candidate bundle digest does not match the descriptor');
    return archive;
  } catch { fail('encrypted candidate authentication failed'); }
  finally { key.fill(0); }
}

/** Extracts only the bounded candidate/evidence namespace after decrypt and full inventory verification. */
export async function unpackCandidateBundle(archive, destination) {
  if (!isAbsolute(destination)) fail('candidate extraction destination must be absolute');
  const doc = JSON.parse(gunzipSync(archive).toString('utf8'));
  if (doc.schema !== 'pcm-github-candidate-bundle/v1' || !Array.isArray(doc.files) || !doc.files.length) fail('decrypted candidate bundle shape is invalid');
  await mkdir(destination, { recursive: false });
  const seen = new Set();
  const candidateFiles=[];
  for (const item of doc.files) {
    const name = item.path;
    if (typeof name !== 'string' || name.includes('\\') || name.split('/').some(part => !part || part === '.' || part === '..')
        || !(name.startsWith('candidate/') || name.startsWith('release/')) || seen.has(name)) fail('candidate bundle contains an unsafe or duplicate path');
    seen.add(name);
    const bytes = Buffer.from(item.contentBase64 ?? '', 'base64');
    if (bytes.length !== item.bytes || sha256(bytes) !== item.sha256 || bytes.toString('base64') !== item.contentBase64) fail(`candidate bundle file failed hash/size validation: ${name}`);
    if(name.startsWith('candidate/'))candidateFiles.push({path:name.slice('candidate/'.length),bytes:item.bytes,sha256:item.sha256});
    const target = join(destination, ...name.split('/'));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes, { flag: 'wx' });
  }
  if (!seen.has('candidate/wrangler.toml') || !seen.has('candidate/worker/index.mjs') || !seen.has('candidate/site-copy/_redirects')
      || !seen.has('release/release-plan.json') || !seen.has('release/baseline.json')) fail('candidate bundle is missing required deployment files');
  candidateFiles.sort((a,b)=>a.path.localeCompare(b.path,'en'));
  if(sha256(jsonBytes({schema:'pcm-release-candidate-manifest/v1',files:candidateFiles}))!==doc.candidateManifestSha256)fail('candidate manifest hash changed after transfer');
  return { destination, fileCount: seen.size, manifestSha256: doc.candidateManifestSha256, releasePlanSha256: doc.releasePlanSha256,
    files:doc.files.map(({path,originalPath,bytes,sha256:digest})=>({path,originalPath,bytes,sha256:digest})) };
}

/** Applies encrypted hosted output to the original local run without overwriting existing evidence. */
export async function applyEncryptedCandidateHandoff({descriptor,chunks,privateKeyPem,runDir,now=Date.now()}){
  if(!descriptor||descriptor.schema!=='pcm-github-handoff/v1'||!['upload','promote'].includes(descriptor.phase))fail('hosted handoff descriptor is invalid');
  if(!Number.isFinite(Date.parse(descriptor.expiresAtUtc))||Date.parse(descriptor.expiresAtUtc)<=now||Date.parse(descriptor.expiresAtUtc)-now>120*60*1000)fail('hosted handoff is expired or exceeds the 120-minute evidence window');
  if(!Array.isArray(chunks)||sha256(Buffer.concat(chunks))!==descriptor.ciphertextSha256)fail('hosted handoff ciphertext hash does not match its descriptor');
  const plain=decryptCandidateBundle({chunks,descriptor,privateKeyPem});
  if(sha256(plain)!==descriptor.plaintextSha256)fail('hosted handoff plaintext hash does not match its descriptor');
  const temp=await mkdtemp(join(tmpdir(),'pcm-hosted-handoff-'));
  try{
    const unpacked=await unpackCandidateBundle(plain,join(temp,'unpacked'));
    const metadata=JSON.parse(await readFile(join(temp,'unpacked/release/staging-metadata.json'),'utf8'));
    if(resolve(metadata.sourceReleaseDir)!==resolve(runDir)||!within(runDir,metadata.sourceDataRoot))fail('hosted handoff belongs to a different local run');
    const plan=JSON.parse(await readFile(join(runDir,'release-plan.json'),'utf8'));
    const manifest=await readFile(plan.candidateManifestPath);
    if(plan.candidateManifestSha256!==descriptor.manifestSha256||sha256(manifest)!==descriptor.manifestSha256)fail('local candidate manifest differs from the hosted handoff');
    const baseline=await readFile(plan.baselinePath);
    if(sha256(baseline)!==descriptor.baselineSha256)fail('local accepted baseline differs from the hosted handoff');
    for(const item of unpacked.files){
      if(!item.originalPath||!within(item.originalPath,metadata.sourceDataRoot))continue;
      const destination=resolve(item.originalPath),source=join(temp,'unpacked',...item.path.split('/')),bytes=await readFile(source);
      if(within(destination,metadata.sourceProjectRoot))fail('handoff may not write into the project checkout');
      await mkdir(dirname(destination),{recursive:true});
      await writeFile(destination,bytes,{flag:'wx'}).catch(async error=>{
        if(error.code!=='EEXIST')throw error;
        if(sha256(await readFile(destination))!==item.sha256)fail(`existing local evidence differs from hosted handoff: ${item.path}`);
      });
    }
    if(descriptor.phase==='upload'){
      const state=JSON.parse(await readFile(join(runDir,'release-state.json'),'utf8'));
      if(state.candidateManifestSha256!==descriptor.manifestSha256||state.stage==='UPLOAD_FAILED')fail('hosted upload result does not match the reviewed local candidate');
    }
    if(descriptor.phase==='promote'){
      const state=JSON.parse(await readFile(join(runDir,'release-state-post-promotion.json'),'utf8'));
      if(state.candidateManifestSha256!==descriptor.manifestSha256)fail('hosted promotion result does not match the reviewed local candidate');
    }
    return {phase:descriptor.phase,runDir:resolve(runDir),manifestSha256:descriptor.manifestSha256,baselineSha256:descriptor.baselineSha256,appliedFileCount:unpacked.fileCount};
  }finally{await rm(temp,{recursive:true,force:true});}
}

async function githubRequest(token, path, method = 'GET', body, fetchImpl = fetch) {
  const response = await fetchImpl(`${API}${path}`, { method, headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${token}`, 'x-github-api-version': '2022-11-28', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  if (!response.ok) fail(`GitHub API ${method} ${path} failed with HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

/** Creates a write-once candidate ref and dispatches only from the trusted default branch. */
export async function stageGithubCandidate({ runDir, phase = 'upload', owner, repo, defaultBranch = 'main', workflowFile = 'pcm-deployment.yml', token, publicKeyPem, fetchImpl = fetch, now = Date.now() }) {
  if (!token) fail('GitHub App installation token is required');
  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo) || defaultBranch !== 'main') fail('repository or protected default-branch identity is invalid');
  const bundle = await createCandidateBundle(runDir,{phase});
  const encrypted = encryptCandidateBundle(bundle.archive, publicKeyPem);
  const candidateId = randomUUID();
  const refName = `refs/heads/pcm-candidate/${candidateId}`;
  const baseRef = await githubRequest(token, `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(defaultBranch)}`, 'GET', undefined, fetchImpl);
  const baseCommitSha = baseRef?.object?.sha;
  if (!/^[a-f0-9]{40}$/.test(baseCommitSha ?? '')) fail('protected default branch HEAD could not be verified');
  const baseCommit = await githubRequest(token, `/repos/${owner}/${repo}/git/commits/${baseCommitSha}`, 'GET', undefined, fetchImpl);
  const tree = [];
  for (const part of encrypted.chunks) {
    const blob = await githubRequest(token, `/repos/${owner}/${repo}/git/blobs`, 'POST', { content: part.bytes.toString('base64'), encoding: 'base64' }, fetchImpl);
    tree.push({ path: `.pcm-deployment-candidates/${candidateId}/payload-${String(part.index).padStart(4, '0')}.bin`, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const descriptor = { schema: 'pcm-encrypted-candidate/v1', phase:bundle.phase, candidateId, worker: bundle.worker, accountId: bundle.accountId,
    productionVersion: bundle.productionVersion, rollbackVersion: bundle.rollbackVersion, acceptedBaselineVersion: bundle.acceptedBaselineVersion,originCandidateCommit:bundle.originCandidateCommit,
    candidateManifestSha256: bundle.manifestSha256, releasePlanSha256: bundle.releasePlanSha256, baselineSha256: bundle.baselineSha256,
    bundleSha256: bundle.bundleSha256, plaintextSha256: encrypted.plaintextSha256, ciphertextSha256: encrypted.ciphertextSha256, uploadedVersion:bundle.uploadedVersion,
    wrappedKey: encrypted.wrappedKey, nonce: encrypted.nonce, tag: encrypted.tag, fileCount: bundle.fileCount, totalBytes: bundle.totalBytes,
    expiresAtUtc: new Date(now + 60 * 60 * 1000).toISOString(), sourceBaseCommit: baseCommitSha, payloadChunks: encrypted.chunks.length };
  const descriptorBlob = await githubRequest(token, `/repos/${owner}/${repo}/git/blobs`, 'POST', { content: Buffer.from(JSON.stringify(descriptor)).toString('base64'), encoding: 'base64' }, fetchImpl);
  tree.push({ path: `.pcm-deployment-candidates/${candidateId}/descriptor.json`, mode: '100644', type: 'blob', sha: descriptorBlob.sha });
  const createdTree = await githubRequest(token, `/repos/${owner}/${repo}/git/trees`, 'POST', { base_tree: baseCommit.tree.sha, tree }, fetchImpl);
  const commit = await githubRequest(token, `/repos/${owner}/${repo}/git/commits`, 'POST', { message: `Stage encrypted PCM candidate ${candidateId}`, tree: createdTree.sha, parents: [baseCommitSha] }, fetchImpl);
  await githubRequest(token, `/repos/${owner}/${repo}/git/refs`, 'POST', { ref: refName, sha: commit.sha }, fetchImpl);
  await githubRequest(token, `/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`, 'POST', { ref: defaultBranch, inputs: { phase, candidate_id: candidateId, candidate_ref: refName, candidate_commit: commit.sha, source_base_commit: baseCommitSha, descriptor_sha256: sha256(Buffer.from(JSON.stringify(descriptor))), expires_at_utc: descriptor.expiresAtUtc } }, fetchImpl);
  return { candidateId, candidateRef: refName, candidateCommit: commit.sha, sourceBaseCommit: baseCommitSha, manifestSha256: bundle.manifestSha256,
    bundleSha256: bundle.bundleSha256, baselineSha256: bundle.baselineSha256, phase:bundle.phase, uploadedVersion:bundle.uploadedVersion,originCandidateCommit:bundle.originCandidateCommit, expiresAtUtc: descriptor.expiresAtUtc, stagedEncryptedBytes: encrypted.chunks.reduce((n, chunk) => n + chunk.bytes.length, 0) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const values = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!args[i]?.startsWith('--') || !args[i + 1] || values[args[i]]) fail(`invalid or duplicate argument: ${args[i]}`);
    values[args[i]] = args[i + 1];
  }
  const runDir = values['--run-dir'];
  let result;
  if(values['--apply-handoff']==='true'){
    const handoffDir=values['--handoff-dir'],privateKeyPath=process.env.PCM_CANDIDATE_DECRYPTION_PRIVATE_KEY_FILE;
    if(!runDir||!isAbsolute(handoffDir??'')||!privateKeyPath)fail('usage: stage-github-candidate.mjs --apply-handoff true --run-dir ABS_DIR --handoff-dir ABS_DIR (set PCM_CANDIDATE_DECRYPTION_PRIVATE_KEY_FILE)');
    const descriptor=JSON.parse((await ordinaryFile(join(handoffDir,'descriptor.json'),'encrypted hosted handoff descriptor')).toString('utf8'));
    const names=(await readdir(handoffDir)).filter(name=>/^payload-\d{4}\.bin$/.test(name)).sort();
    if(names.length!==descriptor.payloadChunks||names.some((name,index)=>name!==`payload-${String(index).padStart(4,'0')}.bin`))fail('encrypted hosted handoff payload chunk inventory is incomplete');
    const chunks=await Promise.all(names.map(name=>ordinaryFile(join(handoffDir,name),'encrypted hosted handoff chunk')));
    result=await applyEncryptedCandidateHandoff({descriptor,chunks,privateKeyPem:(await ordinaryFile(privateKeyPath,'candidate decryption private key')).toString('utf8'),runDir});
  }else{
    const publicKeyPath = process.env.PCM_CANDIDATE_ENCRYPTION_PUBLIC_KEY_FILE;
    if (!runDir || !publicKeyPath) fail('usage: stage-github-candidate.mjs --run-dir ABS_DIR [--phase upload|promote] (set PCM_CANDIDATE_ENCRYPTION_PUBLIC_KEY_FILE)');
    result = await stageGithubCandidate({ runDir, phase:values['--phase']??'upload', owner: values['--owner'] ?? 'PurelyCanadianMovers', repo: values['--repo'] ?? 'newpurely', token: process.env.PCM_GITHUB_APP_INSTALLATION_TOKEN, publicKeyPem: (await ordinaryFile(publicKeyPath, 'candidate encryption public key')).toString('utf8') });
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
