import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { ACCEPTABLE_BASELINE_LIMITATIONS, inspectOwnerBaseline, readAcceptedSelection, validateBaselineAcceptance } from './owner-attested-baseline.mjs';
import { validateV970BaselineAdoptionEvidence, validateV970FreshCloudflareEvidence, V970_BASELINE_ADOPTION_PROFILE } from './baseline-adoption-profile.mjs';
import { BROWSER_CHECKS, COST_GUIDE_OWNER_ACCEPTED_MOBILE_LAYOUT, COST_GUIDE_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT, COST_GUIDE_ALPHABETICAL_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT, validateSmoke } from './smoke-evidence.mjs';

const WORKER = 'newpurely';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const must = (condition, message) => { if (!condition) throw new Error(message); };
const APPROVAL_PREFIX = 'ACCEPT PRODUCTION BASELINE';
const POLICY_CHECKS = new Set(['http', 'browser', 'submission', 'callback', 'email']);
const HIGH_RISK_BROWSER_CHECKS = ['page-title','page-h1','navigation','estimate-form','chatbot-input','desktop-layout','mobile-layout','console-errors'];
const jsonBytes = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');

export function baselineApprovalPhrase({ version, baselineSha256, limitations = ACCEPTABLE_BASELINE_LIMITATIONS, adoptionProfile = null, adoptionEvidenceSha256 = null }) {
  const base = `${APPROVAL_PREFIX} ${WORKER} ${version} ${baselineSha256} ACKNOWLEDGE ALL DOCUMENTED LIMITATIONS ${[...limitations].sort().join(',')}`;
  return adoptionProfile ? `${base} APPLY PROFILE ${adoptionProfile} EVIDENCE ${adoptionEvidenceSha256}` : base;
}

function validateConfirmationEvidence(value, { version, manifestSha256, requiredChecks }) {
  must(value?.schema === 'pcm-release-smoke/v1' && value.phase === 'production' && value.worker === WORKER,
    'production confirmation evidence has the wrong schema, phase, or Worker');
  must(value.versionId === version && value.candidateManifestSha256 === manifestSha256,
    'production confirmation evidence version or manifest does not match the approved baseline');
  must(typeof value.verifiedAtUtc === 'string' && Number.isFinite(Date.parse(value.verifiedAtUtc)), 'production confirmation timestamp is invalid');
  must(Array.isArray(value.checks), 'production confirmation evidence checks are missing or malformed');
  const names = value.checks.map((item) => item?.name);
  must(names.every((name) => typeof name === 'string' && POLICY_CHECKS.has(name)) && new Set(names).size === names.length,
    'production confirmation evidence contains unknown or duplicate checks');
  for (const item of value.checks) must(item && item.status === 'PASS',
    `production confirmation evidence contains a non-passing ${item?.name ?? 'unnamed'} check`);
  for (const name of requiredChecks) must(value.checks.filter((item) => item.name === name && item.status === 'PASS').length === 1,
    `production confirmation evidence is missing passing ${name} evidence`);
}

export function validateProductionConfirmationSummary(value, { version, manifestSha256, baselineSha256, requiredChecks, smokeResult, plan, manifest }) {
  must(value?.status === 'PRODUCTION_CONFIRMED', 'production confirmation record has the wrong status');
  const smoke=value.smoke;
  must(smoke?.phase==='production'&&smoke.versionId===version&&smoke.candidateManifestSha256===manifestSha256
      &&smoke.origin==='https://purelycanadianmovers.com'
      &&['PASS','PASS_WITH_OWNER_ACCEPTED_CONDITIONS'].includes(smoke.status),
    'production confirmation smoke summary does not match the accepted candidate');
  must(JSON.stringify([...smoke.checks].sort())===JSON.stringify([...requiredChecks].sort()),
    'production confirmation smoke summary has missing or unexpected checks');
  if(smoke.status==='PASS_WITH_OWNER_ACCEPTED_CONDITIONS'){
    must((JSON.stringify(smoke.acceptedOwnerConditions)===JSON.stringify([COST_GUIDE_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId])
      ||JSON.stringify(smoke.acceptedOwnerConditions)===JSON.stringify([COST_GUIDE_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId])
      ||JSON.stringify(smoke.acceptedOwnerConditions)===JSON.stringify([COST_GUIDE_ALPHABETICAL_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId]))
      &&JSON.stringify(smoke.browserChecks)===JSON.stringify(BROWSER_CHECKS),
    'production confirmation owner-accepted conditions do not match the exact Cost Guide review');
  }else must(!smoke.acceptedOwnerConditions?.length,'production confirmation has unreported owner-accepted conditions');
  must(smokeResult?.status===smoke.status&&smokeResult?.sha256===smoke.sha256
      &&JSON.stringify(smokeResult?.acceptedOwnerConditions??[])===JSON.stringify(smoke.acceptedOwnerConditions??[]),
    'production confirmation smoke evidence did not revalidate');
  must(value.publicBytes?.status==='PASS'&&Array.isArray(value.publicBytes.probes)&&value.publicBytes.probes.length>0
      &&value.publicBytes.probes.every(probe=>probe.status===200&&probe.matchesRecordedBytes===true),
    'production confirmation public asset evidence is incomplete');
  const changedSiteFiles=(plan?.approvedChanges??[]).filter(change=>change.path?.startsWith('site-copy/')&&change.path!=='site-copy/_redirects');
  must(changedSiteFiles.length>0,'production confirmation plan has no changed public assets');
  for(const change of changedSiteFiles){
    const file=manifest?.files?.find(item=>item.path===change.path);
    const publicPath='/'+change.path.slice('site-copy/'.length);
    must(file&&value.publicBytes.probes.some(probe=>probe.path===publicPath&&probe.sha256===file.sha256),
      'production confirmation public bytes do not match every approved changed asset');
  }
  must(value.baselineDraft?.status==='DRAFT_NOT_ACCEPTED'
      &&value.baselineDraft?.baseline?.sha256===baselineSha256
      &&value.baselineAdopted===false&&value.automaticRollback===false,
    'production confirmation changed baseline selection or deployment state');
  return true;
}

async function validateReleasePolicy({ io, options, version, manifestSha256, predecessorBaselineSha256 }) {
  must(typeof options.releasePlanPath === 'string' && typeof options.releasePlanSha256 === 'string'
      && /^[0-9a-f]{64}$/i.test(options.releasePlanSha256) && typeof options.releaseStatePath === 'string',
    'integrity-verified release-policy inputs are required');
  const plan = JSON.parse((await io.readFile(resolve(options.releasePlanPath))).toString('utf8'));
  const { releasePlanSha256, ...unsignedPlan } = plan;
  must(plan.schema === 'pcm-guarded-release-plan/v1' && plan.status === 'READY_FOR_OWNER_REVIEW'
      && releasePlanSha256 === options.releasePlanSha256 && sha(jsonBytes(unsignedPlan)) === releasePlanSha256,
    'release policy is missing, malformed, or fails its integrity hash');
  must(plan.worker === WORKER && plan.productionVersion === options.expectedCurrentVersion
      && plan.baselineSha256 === predecessorBaselineSha256 && plan.candidateManifestSha256 === manifestSha256
      && Array.isArray(plan.approvedChanges) && plan.approvedChanges.length > 0
      && typeof plan.rollbackVersion === 'string' && /^[0-9a-f-]{36}$/i.test(plan.rollbackVersion)
      && plan.rollbackVersion !== version,
    'release policy identity or baseline/candidate binding conflicts with the acceptance request');
  const state = JSON.parse((await io.readFile(resolve(options.releaseStatePath))).toString('utf8'));
  must(state.schema === 'pcm-guarded-release-state/v1' && state.stage === 'PROMOTED_VERIFIED'
      && state.worker === WORKER && state.versionId === version
      && state.productionVersionBeforeUpload === plan.productionVersion
      && state.productionVersionAfterPromotion === version && state.postPromotionTrafficVerified === true
      // The promoted state records the immediate rollback (the pre-promotion
      // production version); the plan keeps the predecessor's historical fallback.
      && state.rollbackVersion === plan.productionVersion
      && state.historicalFallbackVersion === plan.rollbackVersion
      && state.candidateManifestSha256 === manifestSha256 && state.releasePlanSha256 === releasePlanSha256,
    'promoted release state is missing, malformed, or conflicts with the integrity-verified release policy');
  const policy = plan.smokeRequirements;
  must(policy && ['HIGH-RISK FUNCTIONAL','LOW-RISK CONTENT'].includes(policy.classification)
      && Array.isArray(policy.checks) && policy.checks.length > 0
      && policy.checks.every((name) => typeof name === 'string' && POLICY_CHECKS.has(name))
      && new Set(policy.checks).size === policy.checks.length
      && policy.checks.includes('http') && policy.checks.includes('browser')
      && (!policy.checks.some((name) => name === 'callback' || name === 'email') || policy.checks.includes('submission')),
    'release policy smoke requirements are missing, malformed, or internally conflicting');
  must(Array.isArray(policy.browserChecks) && policy.browserChecks.every((name) => typeof name === 'string')
      && new Set(policy.browserChecks).size === policy.browserChecks.length,
    'release policy browser checks are missing, malformed, or duplicated');
  if (policy.classification === 'HIGH-RISK FUNCTIONAL') {
    must(HIGH_RISK_BROWSER_CHECKS.every((name) => policy.browserChecks.includes(name)),
      'high-risk release policy omits required browser interaction checks');
  } else {
    must(policy.riskAssessment?.classification === 'LOW-RISK CONTENT' && policy.riskAssessment.verified === true
        && typeof policy.riskAssessment.owner?.sourcePath === 'string' && typeof policy.riskAssessment.content?.kind === 'string',
      'low-risk release policy lacks verified source-ownership and content-risk evidence');
  }
  return policy.checks;
}

function freshProductionTraffic(evidence, version) {
  const allocations = evidence?.observed_production_allocations;
  return evidence?.schema === 'pcm-cloudflare-production-verification/v1'
    && evidence.worker === WORKER && evidence.expected_version_id === version
    && evidence.expected_traffic_percentage === 100 && evidence.observed_version_id === version
    && Array.isArray(allocations) && allocations.length === 1
    && allocations[0]?.version_id?.value === version && allocations[0]?.percentage?.value === 100
    && evidence.api_evidence?.every((row) => row.http_status === 200 && row.success === true)
    && evidence.checks?.some((check) => check.name === 'active version and traffic' && check.status === 'PASS')
    && evidence.checks?.some((check) => check.name === 'version identity' && check.status === 'PASS')
    && evidence.provenance?.includes('Cloudflare v4 API GET responses');
}

async function atomicWrite(path, bytes, io) {
  const temp = `${path}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await io.writeFile(temp, bytes, { flag: 'wx' });
    await io.rename(temp, path);
  } finally {
    await io.rm(temp, { force: true }).catch(() => {});
  }
}

export async function acceptProductionBaseline(options, dependencies = {}) {
  const io = { mkdir, readFile, rename, rm, writeFile, ...(dependencies.fs ?? {}) };
  const draftDir = resolve(options.draftDir);
  const selectionPath = resolve(options.selectionPath);
  const outputDir = resolve(options.outputDir);
  const baselineDraftPath = join(draftDir, 'baseline.DRAFT.json');
  const manifestPath = join(draftDir, 'candidate-manifest.json');
  const confirmationPath = resolve(options.confirmationEvidencePath);
  const baselineBytes = await io.readFile(baselineDraftPath);
  must(sha(baselineBytes) === options.baselineSha256, 'approved baseline draft SHA-256 mismatch');
  const baseline = JSON.parse(baselineBytes.toString('utf8'));
  const version = baseline.worker?.active_version;
  must(baseline.schema === 'pcm-controlled-deployment-baseline/v2' && baseline.worker?.name === WORKER,
    'draft is not a retained v2 production baseline');
  must(baseline.record_status?.startsWith('INCOMPLETE:') && baseline.evidence_classifications?.unverified?.status === 'INCOMPLETE',
    'baseline verification limitations are missing or were altered');
  must(baseline.production_evidence?.verification && baseline.production_evidence?.retained_release?.manifest,
    'baseline evidence bindings are incomplete');
  const manifestBytes = await io.readFile(manifestPath);
  must(sha(manifestBytes) === options.manifestSha256
    && baseline.production_evidence.retained_release.manifest.sha256 === options.manifestSha256,
  'approved production manifest SHA-256 mismatch');
  const confirmationBytes = await io.readFile(confirmationPath);
  must(sha(confirmationBytes) === options.confirmationSha256, 'production confirmation evidence SHA-256 mismatch');
  must(baseline.production_evidence.verification.sha256 === options.verificationEvidenceSha256,
    'baseline Cloudflare verification evidence binding changed');
  const verificationBytes = await io.readFile(baseline.production_evidence.verification.path);
  must(sha(verificationBytes) === options.verificationEvidenceSha256, 'baseline Cloudflare verification evidence hash mismatch');
  const recordedVerifier = JSON.parse(verificationBytes.toString('utf8'));
  must(recordedVerifier.result === 'BLOCKED', 'recorded Cloudflare verifier result must remain BLOCKED');
  await (dependencies.inspectBaseline ?? inspectOwnerBaseline)({ baselinePath: baselineDraftPath, workerVersion: version });

  const selectionBefore = await io.readFile(selectionPath);
  const current = await (dependencies.readSelection ?? readAcceptedSelection)(selectionPath);
  must(current.workerVersion === options.expectedCurrentVersion, 'current selected baseline changed or is not the expected predecessor');
  must(current.workerVersion !== version, 'proposed baseline is already selected');
  const currentBaselineBytes = await io.readFile(current.baselinePath);
  const requiredChecks = await validateReleasePolicy({ io, options, version, manifestSha256: options.manifestSha256,
    predecessorBaselineSha256: sha(currentBaselineBytes) });
  const confirmation = JSON.parse(confirmationBytes.toString('utf8'));
  let adoptionReview = null;
  if (options.baselineAdoptionProfile) {
    must(options.baselineAdoptionProfile === V970_BASELINE_ADOPTION_PROFILE.id,
      'unknown one-time baseline-adoption profile');
    const planBytes = await io.readFile(resolve(options.releasePlanPath));
    const stateBytes = await io.readFile(resolve(options.releaseStatePath));
    adoptionReview = await validateV970BaselineAdoptionEvidence({
      evidence: confirmation, baseline, manifestBytes, plan: JSON.parse(planBytes.toString('utf8')),
      planFileSha256: sha(planBytes), state: JSON.parse(stateBytes.toString('utf8')),
      stateSha256: sha(stateBytes), now: dependencies.now ?? new Date(), read: io.readFile,
      profile: dependencies.adoptionProfile ?? V970_BASELINE_ADOPTION_PROFILE,
    });
  } else {
    if(confirmation?.schema==='pcm-release-smoke/v1'){
      validateConfirmationEvidence(confirmation,
        { version, manifestSha256: options.manifestSha256, requiredChecks });
    }else{
      const planBytes=await io.readFile(resolve(options.releasePlanPath)),stateBytes=await io.readFile(resolve(options.releaseStatePath));
      const plan=JSON.parse(planBytes.toString('utf8')),state=JSON.parse(stateBytes.toString('utf8'));
      const smokeEvidencePath=confirmation?.smoke?.evidencePath;
      must(typeof smokeEvidencePath==='string'&&isAbsolute(smokeEvidencePath),'production confirmation does not reference its reviewed smoke evidence');
      const smokeResult=await (dependencies.revalidateSmoke??validateSmoke)({evidencePath:smokeEvidencePath,plan,state,phase:'production',sourceOwners:plan.workflow?.owners,
        expectedHomepageTitle:state.previewSmokeExpectedHomepageTitle});
      validateProductionConfirmationSummary(confirmation,{version,manifestSha256:options.manifestSha256,baselineSha256:options.baselineSha256,
        requiredChecks,smokeResult,plan,manifest:JSON.parse(manifestBytes.toString('utf8'))});
    }
  }

  const evidenceOut = join(draftDir, `acceptance-cloudflare-check-${randomUUID()}.json`);
  const verify = dependencies.verifyProduction ?? (await import('./guarded-deployment-runner.mjs')).productionVerifyActive;
  let verifyResult;
  let freshEvidence;
  try {
    verifyResult = await verify({ versionId: version, evidencePath: evidenceOut, worker: WORKER,
      expectedSettings: baseline.expected_settings, rollbackVersion: baseline.worker.previous_rollback_version });
    freshEvidence = JSON.parse((await io.readFile(evidenceOut)).toString('utf8'));
  } finally {
    await io.rm(evidenceOut, { force: true }).catch(() => {});
  }
  must(freshProductionTraffic(freshEvidence, version), 'fresh authenticated Cloudflare evidence did not confirm exact version at 100% traffic');
  if (adoptionReview) validateV970FreshCloudflareEvidence(freshEvidence, {
    rollbackVersion: baseline.worker.previous_rollback_version,
    profile: dependencies.adoptionProfile ?? V970_BASELINE_ADOPTION_PROFILE,
  });
  // A verifier exit code may remain nonzero because compatibility flags are unavailable.
  // The traffic check above is intentionally independent and never upgrades BLOCKED to PASS.
  const verifierStatus = freshEvidence.result;
  must(['PASS', 'BLOCKED'].includes(verifierStatus), 'fresh Cloudflare verifier result is missing or malformed');
  const limitations = baseline.evidence_classifications?.unverified?.status === 'INCOMPLETE'
    ? [...ACCEPTABLE_BASELINE_LIMITATIONS] : [];
  must(limitations.length === ACCEPTABLE_BASELINE_LIMITATIONS.length, 'all supported baseline limitations must remain recorded');

  const phrase = baselineApprovalPhrase({ version, baselineSha256: options.baselineSha256, limitations,
    adoptionProfile: adoptionReview?.profileId, adoptionEvidenceSha256: options.confirmationSha256 });
  must(options.approver === 'Edward Kita' && options.approverRole === 'business-owner'
    && options.approvedAt && options.reviewBy, 'business-owner approval identity and dates are required');
  must(options.approvalPhrase === phrase, `exact owner approval phrase is required: ${phrase}`);

  const acceptance = {
    schema: adoptionReview ? 'pcm-controlled-baseline-acceptance/v2' : 'pcm-controlled-baseline-acceptance/v1', status: 'ACCEPTED', worker: WORKER,
    production_version: version, baseline_sha256: options.baselineSha256,
    accepted_limitations: limitations, approver: options.approver, approver_role: options.approverRole,
    approved_at: options.approvedAt, review_by: options.reviewBy,
    ...(adoptionReview ? { baseline_adoption_profile: adoptionReview.profileId,
      adoption_evidence_path: confirmationPath, adoption_evidence_sha256: options.confirmationSha256 } : {}),
  };
  const acceptanceBytes = Buffer.from(`${JSON.stringify(acceptance, null, 2)}\n`);
  const acceptanceValidation = validateBaselineAcceptance({ bytes: acceptanceBytes, baselineBytes,
    baselineHash: options.baselineSha256, workerName: WORKER, workerVersion: version,
    now: dependencies.now ?? new Date() });
  must(acceptanceValidation.status === 'ACCEPTED', `owner acceptance failed validation: ${acceptanceValidation.detail}`);
  const finalBaseline = baselineBytes;
  const acceptanceHash = sha(acceptanceBytes);
  const selection = { schema: 'pcm-baseline-selection/v1', baseline: {
    path: join(outputDir, 'baseline.json'), sha256: options.baselineSha256,
  }, acceptance: { path: join(outputDir, 'acceptance.json'), sha256: acceptanceHash } };
  const selectionBytes = Buffer.from(`${JSON.stringify(selection, null, 2)}\n`);

  let stageDir;
  let selectionLock;
  try {
    await io.mkdir(dirname(outputDir), { recursive: true });
    stageDir = `${outputDir}.${randomUUID()}.tmp`;
    await io.mkdir(stageDir, { recursive: false });
    await io.writeFile(join(stageDir, 'baseline.json'), finalBaseline, { flag: 'wx' });
    await io.writeFile(join(stageDir, 'acceptance.json'), acceptanceBytes, { flag: 'wx' });
    await io.rename(stageDir, outputDir);
    stageDir = null;
    const lockPath = `${selectionPath}.accept-baseline.lock`;
    await io.mkdir(lockPath, { recursive: false });
    selectionLock = lockPath;
    const selectionNow = await io.readFile(selectionPath);
    must(sha(selectionNow) === sha(selectionBefore), 'current selection changed concurrently; selection was not updated');
    await atomicWrite(selectionPath, selectionBytes, io);
    try {
      const readBack = await (dependencies.readSelection ?? readAcceptedSelection)(selectionPath);
      must(readBack.workerVersion === version && resolve(readBack.baselinePath) === join(outputDir, 'baseline.json')
        && resolve(readBack.acceptancePath) === join(outputDir, 'acceptance.json'), 'selected baseline read-back mismatch');
    } catch (error) {
      const selectedBytes = await io.readFile(selectionPath);
      if (sha(selectedBytes) === sha(selectionBytes)) await atomicWrite(selectionPath, selectionBefore, io);
      throw error;
    }
    return { status: 'ACCEPTED_AND_SELECTED', workerVersion: version, baselineSha256: options.baselineSha256,
      acceptanceSha256: acceptanceHash, selectionPath, predecessorVersion: current.workerVersion,
      freshProductionTraffic: 'PASS', cloudflareVerifierResult: verifierStatus,
      limitations, ...(adoptionReview ? { baselineAdoptionProfile: adoptionReview.profileId,
        adoptionEvidenceSha256: options.confirmationSha256 } : {}),
      deploymentAuthorization: 'NOT GRANTED' };
  } finally {
    if (stageDir) await io.rm(stageDir, { recursive: true, force: true }).catch(() => {});
    if (selectionLock) await io.rm(selectionLock, { recursive: true, force: true }).catch(() => {});
  }
}
