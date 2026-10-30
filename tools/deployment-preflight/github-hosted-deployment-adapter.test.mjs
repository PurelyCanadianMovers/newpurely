import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runHostedDeploymentPhase } from './github-hosted-deployment-adapter.mjs';

const sha = (c) => c.repeat(64);
const uuid='cde7ee6c-3911-4730-8125-65ebaaf18896';
const version='c17991e2-7fb7-4cc0-9b53-120ca18215ef';
const baseEnvelope=(phase='upload')=>({schema:'pcm-github-candidate/v1',phase,candidateId:'11111111-1111-4111-8111-111111111111',candidateCommit:'a'.repeat(40),manifestSha256:sha('b'),bundleSha256:sha('c'),baselineSha256:sha('d'),acceptedBaselineVersion:uuid,worker:'newpurely',expiresAtUtc:'2026-10-30T12:45:00.000Z'});

test('credential-free full approval sequence gates separate upload and promotion actions and blocks replay',async t=>{
  const releaseDir=await mkdtemp(join(tmpdir(),'pcm-gh-adapter-'));t.after(()=>rm(releaseDir,{recursive:true,force:true}));
  const calls=[];const reviewer={state:'approved',user:{id:23,login:'owner'},environments:[]};
  const fetchImpl=async url=>{
    const path=new URL(url).pathname;
    if(path.endsWith('/approvals'))return {ok:true,status:200,json:async()=>[reviewer]};
    if(path.endsWith('/git/ref/heads/pcm-candidate/11111111-1111-4111-8111-111111111111'))return {ok:true,status:200,json:async()=>({object:{sha:'a'.repeat(40)}})};
    if(path.endsWith('/actions/runs/700')||path.endsWith('/actions/runs/701'))return {ok:true,status:200,json:async()=>({id:Number(path.split('/').at(-1)),run_attempt:1,event:'workflow_dispatch',head_branch:'main',head_sha:'f'.repeat(40),actor:{id:99},status:'in_progress'})};
    throw new Error(`unexpected mock API URL ${url}`);
  };
  const config={githubToken:'synthetic-only',expectedBotId:99,expectedOwnerId:23},workflowSha='f'.repeat(40);
  const context=(runId)=>({runId,runAttempt:1,actorId:99});
  const expected=(e,runId)=>({phase:e.phase,candidateCommit:e.candidateCommit,manifestSha256:e.manifestSha256,bundleSha256:e.bundleSha256,baselineSha256:e.baselineSha256,acceptedBaselineVersion:e.acceptedBaselineVersion,workflowRunId:runId,workflowRunAttempt:1,...(e.workerVersion?{workerVersion:e.workerVersion,originCandidateCommit:e.originCandidateCommit}:{})});
  reviewer.environments=[{name:'pcm-upload'}];
  const uploadEnvelope=baseEnvelope();uploadEnvelope.workflowRunId=700;uploadEnvelope.workflowRunAttempt=1;
  const upload=await runHostedDeploymentPhase({action:'upload',releaseDir,owner:'pcm',repo:'site',candidateRef:`refs/heads/pcm-candidate/${uploadEnvelope.candidateId}`,workflowSha,envelope:uploadEnvelope,expected:expected(uploadEnvelope,700),context:context(700),config,now:Date.parse('2026-10-30T12:00:00Z')},{dryRun:true,fetchImpl,authorizationFactory:async()=>({schema:'mock-auth/upload'}),uploadAction:async args=>{calls.push(['upload',args.authorizationPath]);return {stage:'UPLOADED_VERIFIED_NOT_PROMOTED',versionId:version};}});
  assert.equal(upload.result.stage,'UPLOADED_VERIFIED_NOT_PROMOTED');assert.equal(calls.length,1);
  const uploadAudit=JSON.parse(await readFile(upload.approvalAuditPath,'utf8'));assert.equal(uploadAudit.action,'upload');assert.equal(uploadAudit.reviewerId,'23');
  await assert.rejects(runHostedDeploymentPhase({action:'upload',releaseDir,owner:'pcm',repo:'site',candidateRef:`refs/heads/pcm-candidate/${uploadEnvelope.candidateId}`,workflowSha,envelope:uploadEnvelope,expected:expected(uploadEnvelope,700),context:context(700),config,now:Date.parse('2026-10-30T12:00:01Z')},{dryRun:true,fetchImpl,authorizationFactory:async()=>({}),uploadAction:async()=>{calls.push(['replay']);}}),/already been consumed/);
  reviewer.environments=[{name:'pcm-production'}];
  const promotionEnvelope=baseEnvelope('promote');promotionEnvelope.candidateId=uploadEnvelope.candidateId;promotionEnvelope.candidateCommit=uploadEnvelope.candidateCommit;promotionEnvelope.workflowRunId=701;promotionEnvelope.workflowRunAttempt=1;promotionEnvelope.workerVersion=version;promotionEnvelope.originCandidateCommit=uploadEnvelope.candidateCommit;
  const promote=await runHostedDeploymentPhase({action:'promote',releaseDir,owner:'pcm',repo:'site',candidateRef:`refs/heads/pcm-candidate/${promotionEnvelope.candidateId}`,workflowSha,envelope:promotionEnvelope,expected:expected(promotionEnvelope,701),context:context(701),config,now:Date.parse('2026-10-30T12:01:00Z')},{dryRun:true,fetchImpl,authorizationFactory:async()=>({schema:'mock-auth/promote'}),promoteAction:async args=>{calls.push(['promote',args.authorizationPath]);return {stage:'PROMOTED_VERIFIED',versionId:version};}});
  assert.equal(promote.result.stage,'PROMOTED_VERIFIED');assert.deepEqual(calls.map(x=>x[0]),['upload','promote']);
  await assert.rejects(runHostedDeploymentPhase({action:'promote',releaseDir,owner:'pcm',repo:'site',candidateRef:`refs/heads/pcm-candidate/${promotionEnvelope.candidateId}`,workflowSha,envelope:promotionEnvelope,expected:expected(promotionEnvelope,701),context:context(701),config,now:Date.parse('2026-10-30T12:01:01Z')},{dryRun:true,fetchImpl,authorizationFactory:async()=>({}),promoteAction:async()=>{}}),/already been consumed/);
});

test('credential-free adapter rejects missing approval or changed bundle before guarded action',async t=>{
  const releaseDir=await mkdtemp(join(tmpdir(),'pcm-gh-denied-'));t.after(()=>rm(releaseDir,{recursive:true,force:true}));
  let calls=0;
  const fetchImpl=async url=>{const path=new URL(url).pathname;if(path.endsWith('/approvals'))return {ok:true,status:200,json:async()=>[]};if(path.includes('/git/ref/'))return {ok:true,status:200,json:async()=>({object:{sha:'a'.repeat(40)}})};return {ok:true,status:200,json:async()=>({id:702,run_attempt:1,event:'workflow_dispatch',head_branch:'main',head_sha:'f'.repeat(40),actor:{id:99},status:'in_progress'})};};
  const envelope=baseEnvelope();envelope.workflowRunId=702;envelope.workflowRunAttempt=1;
  const expected={phase:envelope.phase,candidateCommit:envelope.candidateCommit,manifestSha256:envelope.manifestSha256,bundleSha256:envelope.bundleSha256,baselineSha256:envelope.baselineSha256,acceptedBaselineVersion:uuid,workflowRunId:702,workflowRunAttempt:1};
  await assert.rejects(runHostedDeploymentPhase({action:'upload',releaseDir,owner:'pcm',repo:'site',candidateRef:`refs/heads/pcm-candidate/${envelope.candidateId}`,workflowSha:'f'.repeat(40),envelope,expected,context:{runId:702,runAttempt:1,actorId:99},config:{githubToken:'synthetic',expectedBotId:99,expectedOwnerId:23},now:Date.parse('2026-10-30T12:00:00Z')},{dryRun:true,fetchImpl,uploadAction:async()=>{calls++;}}),/approval/);
  const mismatched={...envelope,bundleSha256:sha('e')};
  await assert.rejects(runHostedDeploymentPhase({action:'upload',releaseDir,owner:'pcm',repo:'site',candidateRef:`refs/heads/pcm-candidate/${envelope.candidateId}`,workflowSha:'f'.repeat(40),envelope:mismatched,expected,context:{runId:702,runAttempt:1,actorId:99},config:{githubToken:'synthetic',expectedBotId:99,expectedOwnerId:23},now:Date.parse('2026-10-30T12:00:00Z')},{dryRun:true,fetchImpl,uploadAction:async()=>{calls++;}}),/does not match/);
  assert.equal(calls,0);
});
