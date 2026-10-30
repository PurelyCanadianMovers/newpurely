import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCandidateEnvelope, validateEnvironmentApproval, validateGitHubRun, validatePromotionVerification } from './github-environment-approval.mjs';

const now = Date.parse('2026-10-30T12:00:00.000Z');
const envelope = (phase='upload') => ({ schema: 'pcm-github-candidate/v1',phase,candidateCommit: 'a'.repeat(40), manifestSha256: 'b'.repeat(64), bundleSha256: 'c'.repeat(64), baselineSha256: 'd'.repeat(64), acceptedBaselineVersion: 'cde7ee6c-3911-4730-8125-65ebaaf18896', worker: 'newpurely', workflowRunId: 456, workflowRunAttempt: 1, expiresAtUtc: '2026-10-30T12:45:00.000Z' });
const expected = (e = envelope()) => ({ phase:e.phase,candidateCommit: e.candidateCommit, manifestSha256: e.manifestSha256, bundleSha256: e.bundleSha256, baselineSha256: e.baselineSha256, acceptedBaselineVersion: e.acceptedBaselineVersion, workflowRunId: e.workflowRunId, workflowRunAttempt: e.workflowRunAttempt, ...(e.workerVersion ? { workerVersion: e.workerVersion,originCandidateCommit:e.originCandidateCommit } : {}) });
const approval = (environment = 'pcm-upload', reviewerId = 23) => [{ state: 'approved', user: { id: reviewerId }, environments: [{ name: environment }] }];

test('validates exact envelope and owner upload review', () => {
  assert.equal(validateCandidateEnvelope(envelope(), expected(), now), true);
  const record = validateEnvironmentApproval({ envelope: envelope(), expected: expected(), action: 'upload', environment: 'pcm-upload', approvals: approval(), actorId: 99, expectedInitiatorId: 99, expectedOwnerId: 23, now });
  assert.equal(record.manifestSha256, 'b'.repeat(64));
  assert.equal(record.baselineSha256, 'd'.repeat(64));
  assert.equal(record.workflowRunId, 456);
});

test('rejects mismatched artifact, manifest, or baseline digest', () => {
  for (const field of ['bundleSha256', 'manifestSha256', 'baselineSha256']) {
    const changed = envelope(); changed[field] = 'e'.repeat(64);
    assert.throws(() => validateEnvironmentApproval({ envelope: changed, expected: expected(), action: 'upload', environment: 'pcm-upload', approvals: approval(), actorId: 99, expectedInitiatorId: 99, expectedOwnerId: 23, now }), /approval|candidate|envelope/i);
  }
  const malformed = envelope(); malformed.bundleSha256 = 'bad';
  assert.throws(() => validateCandidateEnvelope(malformed, expected(), now), /SHA-256/);
});

test('rejects replayed runs and expired approvals', () => {
  const replay = envelope(); replay.workflowRunAttempt = 2;
  assert.throws(() => validateCandidateEnvelope(replay, expected(), now), /reruns/);
  const expired = envelope(); expired.expiresAtUtc = '2026-10-30T11:59:59.000Z';
  assert.throws(() => validateCandidateEnvelope(expired, expected(), now), /expired/);
});

test('rejects unauthorized reviewer, initiator self-approval, and wrong environment', () => {
  const input = { envelope: envelope(), expected: expected(), action: 'upload', environment: 'pcm-upload', approvals: approval('pcm-upload', 77), actorId: 99, expectedInitiatorId: 99, expectedOwnerId: 23, now };
  assert.throws(() => validateEnvironmentApproval(input), /unauthorized reviewer/);
  assert.throws(() => validateEnvironmentApproval({ ...input, approvals: [...approval('pcm-upload'), ...approval('pcm-upload', 77)] }), /unauthorized reviewer/);
  assert.throws(() => validateEnvironmentApproval({ ...input, approvals: approval('pcm-upload', 99), expectedOwnerId: 99 }), /own deployment/);
  const wrongEnvironment=envelope('promote');wrongEnvironment.workerVersion='c17991e2-7fb7-4cc0-9b53-120ca18215ef';wrongEnvironment.originCandidateCommit='a'.repeat(40);
  assert.throws(() => validateEnvironmentApproval({ ...input,envelope:wrongEnvironment,expected:expected(wrongEnvironment),action:'promote',approvals:approval('pcm-upload'),environment:'pcm-upload' }), /environment/);
  assert.throws(() => validateEnvironmentApproval({ ...input, expectedInitiatorId: 55 }), /release bot/);
});

test('upload review cannot authorize promotion; production review binds version and verification', () => {
  const uploadReview = validateEnvironmentApproval({ envelope: envelope(), expected: expected(), action: 'upload', environment: 'pcm-upload', approvals: approval(), actorId: 99, expectedInitiatorId: 99, expectedOwnerId: 23, now });
  assert.throws(() => validatePromotionVerification({ approval: uploadReview, workerVersion: 'c17991e2-7fb7-4cc0-9b53-120ca18215ef', verification: { status: 'PASS', versionId: 'c17991e2-7fb7-4cc0-9b53-120ca18215ef', trafficPercentage: 100 }, now }), /production approval/);
  const promotionEnvelope = envelope('promote'); promotionEnvelope.workerVersion = 'c17991e2-7fb7-4cc0-9b53-120ca18215ef';promotionEnvelope.originCandidateCommit='a'.repeat(40);
  const promoted = validateEnvironmentApproval({ envelope: promotionEnvelope, expected: expected(promotionEnvelope), action: 'promote', environment: 'pcm-production', approvals: approval('pcm-production'), actorId: 99, expectedInitiatorId: 99, expectedOwnerId: 23, now });
  assert.equal(validatePromotionVerification({ approval: promoted, workerVersion: promoted.workerVersion, verification: { status: 'PASS', versionId: promoted.workerVersion, trafficPercentage: 100 }, now }), true);
  assert.throws(() => validatePromotionVerification({ approval: promoted, workerVersion: 'bc50ed35-d23f-4cd5-84cc-15d7d3604787', verification: { status: 'PASS', versionId: 'bc50ed35-d23f-4cd5-84cc-15d7d3604787', trafficPercentage: 100 }, now }), /exact uploaded Worker version/);
  assert.throws(() => validatePromotionVerification({ approval: promoted, workerVersion: promoted.workerVersion, verification: { status: 'FAIL', versionId: promoted.workerVersion, trafficPercentage: 100 }, now }), /did not PASS/);
});

test('rejects untrusted workflow branch, event, workflow SHA, bot, or run attempt', () => {
  const run={id:456,run_attempt:1,event:'workflow_dispatch',head_branch:'main',head_sha:'f'.repeat(40),actor:{id:99},status:'in_progress'};
  assert.equal(validateGitHubRun({run,workflowRunId:456,workflowRunAttempt:1,expectedBotId:99,expectedWorkflowSha:'f'.repeat(40)}),true);
  for(const bad of [{...run,head_branch:'pull/4/merge'},{...run,event:'pull_request'},{...run,head_sha:'e'.repeat(40)},{...run,actor:{id:23}},{...run,run_attempt:2}])
    assert.throws(()=>validateGitHubRun({run:bad,workflowRunId:456,workflowRunAttempt:1,expectedBotId:99,expectedWorkflowSha:'f'.repeat(40)}),/protected default branch/);
});
