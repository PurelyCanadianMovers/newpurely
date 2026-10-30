import { createHash } from 'node:crypto';

const SHA256 = /^[a-f0-9]{64}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fail = (message) => { throw new Error(message); };

export function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export function validateGitHubRun({ run, workflowRunId, workflowRunAttempt, expectedBotId, expectedWorkflowSha }) {
  if (!run || String(run.id) !== String(workflowRunId) || run.run_attempt !== workflowRunAttempt
      || run.event !== 'workflow_dispatch' || run.head_branch !== 'main' || run.head_sha !== expectedWorkflowSha
      || String(run.actor?.id) !== String(expectedBotId) || !['in_progress', 'queued', 'waiting'].includes(run.status)) {
    fail('GitHub run is not the expected bot-started dispatch from the protected default branch');
  }
  return true;
}

function requireText(value, name) {
  if (typeof value !== 'string' || !value.trim()) fail(`${name} is required`);
  return value;
}

/** Validates the immutable, non-secret facts carried from candidate staging. */
export function validateCandidateEnvelope(envelope, expected, now = Date.now()) {
  if (!envelope || envelope.schema !== 'pcm-github-candidate/v1') fail('candidate envelope schema is invalid');
  for (const name of ['candidateCommit', 'manifestSha256', 'bundleSha256', 'baselineSha256']) {
    const value = requireText(envelope[name], name);
    if (name.endsWith('Sha256') && !SHA256.test(value)) fail(`${name} must be a lowercase SHA-256 digest`);
  }
  if (!/^[a-f0-9]{40}$/.test(envelope.candidateCommit)) fail('candidate commit must be a full Git SHA');
  if (!Number.isSafeInteger(envelope.workflowRunId) || envelope.workflowRunId < 1) fail('workflow run ID is invalid');
  if (!Number.isSafeInteger(envelope.workflowRunAttempt) || envelope.workflowRunAttempt !== 1) fail('workflow reruns are not valid approvals; start a new run');
  if (!Number.isFinite(Date.parse(envelope.expiresAtUtc)) || Date.parse(envelope.expiresAtUtc) <= now) fail('candidate envelope is expired or has an invalid expiry');
  if (Date.parse(envelope.expiresAtUtc) - now > 60 * 60 * 1000) fail('candidate envelope expiry exceeds the one-hour limit');
  if (envelope.worker !== 'newpurely' || !UUID.test(envelope.acceptedBaselineVersion ?? '')) fail('candidate Worker or accepted baseline version is invalid');
  if (!['upload','promote'].includes(envelope.phase)) fail('candidate envelope action is invalid');
  if (!expected || ['phase','candidateCommit', 'manifestSha256', 'bundleSha256', 'baselineSha256', 'acceptedBaselineVersion', 'workflowRunId', 'workflowRunAttempt'].some((key) => envelope[key] !== expected[key])) fail('candidate envelope does not match independently verified artifact, baseline, or workflow context');
  return true;
}

/**
 * Validates GitHub's authoritative environment approval history after a
 * protected job is released. The envelope is passed through the job unchanged.
 */
export function validateEnvironmentApproval({ envelope, expected, action, environment, approvals, actorId, expectedInitiatorId, expectedOwnerId, now = Date.now() }) {
  validateCandidateEnvelope(envelope, expected, now);
  if (!['upload', 'promote'].includes(action)) fail('approval action is invalid');
  if(envelope.phase!==action)fail('approval action does not match the staged candidate phase');
  if(action==='promote'&&(!/^[a-f0-9]{40}$/.test(envelope.originCandidateCommit??'')||envelope.originCandidateCommit!==expected?.originCandidateCommit))fail('promotion approval does not bind the original uploaded candidate commit');
  if (action === 'promote' && envelope.workerVersion !== expected?.workerVersion) fail('candidate envelope does not match the exact uploaded Worker version');
  const expectedEnvironment = action === 'upload' ? 'pcm-upload' : 'pcm-production';
  if (action === 'promote' && !UUID.test(envelope.workerVersion ?? '')) fail('promotion approval must bind the exact uploaded Worker version');
  if (action === 'upload' && envelope.workerVersion != null) fail('upload approval cannot contain a production Worker version');
  if (environment !== expectedEnvironment) fail('approval environment does not match the requested action');
  if (String(actorId) !== String(expectedInitiatorId)) fail('workflow was not initiated by the configured release bot');
  if (!Array.isArray(approvals)) fail('GitHub approval history is unavailable');
  const relevant = approvals.filter((entry) => entry?.state === 'approved'
    && Array.isArray(entry.environments)
    && entry.environments.some((item) => item?.name === expectedEnvironment));
  if (relevant.some((entry) => String(entry.user?.id) !== String(expectedOwnerId))) fail('an unauthorized reviewer approved this environment');
  const match = relevant.filter((entry) => String(entry.user?.id) === String(expectedOwnerId));
  if (match.length !== 1) fail('exactly one approval from the configured owner for this environment is required');
  if (String(match[0].user.id) === String(actorId)) fail('workflow initiator cannot approve their own deployment');
  return {
    schema: 'pcm-github-environment-approval/v1',
    action,
    environment,
    candidateCommit: envelope.candidateCommit,
    manifestSha256: envelope.manifestSha256,
    bundleSha256: envelope.bundleSha256,
    baselineSha256: envelope.baselineSha256,
    acceptedBaselineVersion: envelope.acceptedBaselineVersion,
    ...(action === 'promote' ? { workerVersion: envelope.workerVersion } : {}),
    ...(action === 'promote' ? { originCandidateCommit: envelope.originCandidateCommit } : {}),
    workflowRunId: envelope.workflowRunId,
    workflowRunAttempt: envelope.workflowRunAttempt,
    reviewerId: String(expectedOwnerId),
    verifiedAtUtc: new Date(now).toISOString(),
    expiresAtUtc: envelope.expiresAtUtc,
  };
}

export function validatePromotionVerification({ approval, workerVersion, verification, now = Date.now() }) {
  if (!approval || approval.schema !== 'pcm-github-environment-approval/v1' || approval.action !== 'promote'
    || approval.environment !== 'pcm-production' || Date.parse(approval.expiresAtUtc) <= now) fail('a current production approval is required');
  if (!UUID.test(workerVersion ?? '') || approval.workerVersion !== workerVersion) fail('production approval does not bind the exact uploaded Worker version');
  if (!verification || verification.status !== 'PASS' || verification.versionId !== workerVersion
    || verification.trafficPercentage !== 100) fail('exact-version production verification did not PASS at 100% traffic');
  return true;
}
