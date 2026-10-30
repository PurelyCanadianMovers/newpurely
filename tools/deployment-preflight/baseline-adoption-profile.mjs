import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { isAbsolute } from 'node:path';
import { verifyProductionHtml } from './smoke-evidence.mjs';

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const fail = (message) => { throw new Error(message); };
const must = (condition, message) => { if (!condition) fail(message); };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const origin = 'https://purelycanadianmovers.com';

export const V970_BASELINE_ADOPTION_PROFILE = Object.freeze({
  id: 'batch2-v970-one-time',
  worker: 'newpurely',
  versionId: '66f53c94-b431-4f60-b910-801109100952',
  manifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  gitBaselineCommit: '9afdaf1b37abe44e2c79e0c6877999e9ed349dfa',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  releasePlanFileSha256: 'e9513a928cdbaa786038a524736eae9a3d3cddd1aad7e8300fcbd547cb9e954e',
  releaseStateSha256: 'ecc2997dfbf77c37691849ff6e37fc6de7fd4b9e230dc3637b23dd718716338f',
  retainedHttpSha256: 'af7e5773c543d78cc7c429708289bce3ca54f6e808ceca450666b4ac1b563582',
  historicalPreviewSha256: '10b395e4745bcb8814375428671c313336df00f6db46155533da1aa7f00d8125',
  immediateRollbackVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  historicalFallbackVersion: '8449988b-c9df-48b7-8642-4c0101349384',
  previousBaselineSha256: '5bb0fef102a482aee4eb914a941a5ae07eb05d60284e6ad0d5ae9588f331d094',
  expectedAssetCount: 363,
  retainedHttpRoutes: 37,
  freshHttpRoutes: ['/', '/local/', '/surrey/'],
  pricingRoutes: [
    '/toronto-to-halifax-movers/',
    '/halifax-to-vancouver-movers/',
    '/vancouver-to-halifax-movers/',
    '/halifax-to-calgary-movers/',
    '/calgary-to-halifax-movers/',
  ],
  browserChecks: [
    'page-title', 'page-h1', 'navigation', 'estimate-form',
    'chatbot-input', 'desktop-layout', 'mobile-layout', 'console-errors',
  ],
  historicalFailures: [
    'console-errors|/edmonton-to-vancouver-movers/',
    'desktop-layout|/calgary-to-winnipeg-movers/',
    'desktop-layout|/local/',
    'desktop-layout|/montreal-to-edmonton-movers/',
    'navigation|/halifax-to-toronto-movers/',
    'navigation|/victoria-to-montreal-movers/',
  ],
});

async function readPinnedArtifact(ref, expectedSha, label, read = readFile) {
  must(ref && typeof ref.path === 'string' && /^[a-f0-9]{64}$/i.test(ref.sha256 ?? ''), `${label} reference is incomplete`);
  must(isAbsolute(ref.path), `${label} path must be absolute`);
  if (expectedSha) must(ref.sha256.toLowerCase() === expectedSha, `${label} hash is not the pinned v970 evidence`);
  const bytes = await read(ref.path);
  must(sha(bytes) === ref.sha256.toLowerCase(), `${label} bytes do not match their SHA-256`);
  return JSON.parse(bytes.toString('utf8'));
}

function freshTimestamp(value, now) {
  const time = Date.parse(value ?? '');
  return Number.isFinite(time) && time <= now.getTime() && now.getTime() - time <= 120 * 60_000;
}

function validateRetainedHttp(doc, profile) {
  must(doc.schema === 'pcm-post-promotion-route-smoke/v2'
    && doc.worker === profile.worker && doc.candidateVersion === profile.versionId
    && doc.manifestSha256 === profile.manifestSha256
    && doc.routeCount === profile.retainedHttpRoutes && doc.passedCount === profile.retainedHttpRoutes
    && doc.failedCount === 0 && Array.isArray(doc.results)
    && doc.results.length === profile.retainedHttpRoutes,
  'retained production HTTP evidence is not the exact 37/37 v970 record');
  const seen = new Set();
  for (const row of doc.results) {
    must(typeof row.slug === 'string' && !seen.has(row.slug)
      && row.status === 200 && row.candidateHtmlMatch === true,
    'retained production HTTP evidence contains a missing, duplicate, failed, or nonmatching route');
    seen.add(row.slug);
  }
}

function validateHistoricalPreview(doc, profile) {
  must(doc.kind === 'browser'
    && doc.versionId === profile.versionId
    && doc.candidateManifestSha256 === profile.manifestSha256
    && doc.status === 'FAIL' && Array.isArray(doc.tests)
    && doc.tests.length === 320,
  'historical R6e preview evidence identity or failure state changed');
  const failures = doc.tests.filter((test) => test.status === 'FAIL')
    .map((test) => `${test.name}|${test.route}`).sort();
  must(failures.length === 6
    && JSON.stringify(failures) === JSON.stringify([...profile.historicalFailures].sort()),
  'historical R6e failures were altered or relabeled');
  must(doc.tests.filter((test) => test.status === 'PASS').length === 314,
    'historical R6e pass count changed');
}

async function validateEvidenceFiles(files, read) {
  must(Array.isArray(files) && files.length > 0, 'browser evidence files are missing');
  for (const ref of files) {
    must(ref && isAbsolute(ref.path) && /^[a-f0-9]{64}$/i.test(ref.sha256 ?? ''), 'browser evidence file reference is malformed');
    must(sha(await read(ref.path)) === ref.sha256.toLowerCase(), 'browser evidence file hash mismatch');
  }
}

async function validateFocusedBrowserArtifact(ref, profile, now, read) {
  const doc = await readPinnedArtifact(ref, null, 'focused production browser artifact', read);
  must(doc.kind === 'browser' && doc.versionId === profile.versionId
    && doc.candidateManifestSha256 === profile.manifestSha256
    && doc.origin === origin && doc.status === 'PASS'
    && doc.riskClassification === 'HIGH-RISK FUNCTIONAL'
    && doc.browserInteractionPerformed === true
    && freshTimestamp(doc.verifiedAtUtc, now)
    && Array.isArray(doc.routes)
    && JSON.stringify([...doc.routes].sort()) === JSON.stringify([...profile.pricingRoutes].sort())
    && Array.isArray(doc.tests),
  'focused production browser evidence is stale, incomplete, or bound to another version');
  await validateEvidenceFiles(doc.evidenceFiles, read);
  const browser = doc.browserEnvironment;
  must(browser?.browser && browser?.version && browser?.platform, 'focused browser environment is missing');
  for (const route of profile.pricingRoutes) {
    const tests = doc.tests.filter((test) => test.route === route);
    must(tests.length === profile.browserChecks.length, `focused browser checks are incomplete for ${route}`);
    for (const name of profile.browserChecks) {
      const rows = tests.filter((test) => test.name === name);
      must(rows.length === 1, `focused browser check ${name} is missing or duplicated for ${route}`);
      const test = rows[0];
      must(test.status === 'PASS' && test.versionId === profile.versionId
        && test.candidateManifestSha256 === profile.manifestSha256
        && test.url === origin + route && freshTimestamp(test.verifiedAtUtc, now)
        && test.browserEnvironment?.browser === browser.browser
        && test.browserEnvironment?.version === browser.version
        && test.browserEnvironment?.platform === browser.platform,
      `focused browser check ${name} failed or is not candidate-bound for ${route}`);
      await validateEvidenceFiles(test.evidenceFiles, read);
      if (name === 'page-title' || name === 'page-h1') must(typeof test.actual === 'string' && test.actual.trim(), `${name} observation is empty for ${route}`);
      if (name === 'navigation') must(test.navigationSucceeded === true && test.destinationUrl?.startsWith(origin + '/'), `navigation failed for ${route}`);
      if (name === 'estimate-form') {
        must(test.interactionPerformed === true && test.getHandoffObserved === true
          && test.handoff?.status === 'PASS' && test.handoff?.method === 'GET'
          && test.handoff?.responseStatus === 200
          && test.handoff?.actionUrl === `${origin}/contact/`
          && test.handoff?.requestUrl?.startsWith(`${origin}/contact/?`)
          && test.handoff?.responseUrl === test.handoff?.requestUrl,
        `safe estimate GET handoff is missing for ${route}`);
        const [, routeFrom, routeTo] = /\/([a-z-]+)-to-([a-z-]+)-movers\/$/.exec(route) ?? [];
        must(routeFrom && routeTo
          && test.handoff?.routeDirection === `${routeFrom}-to-${routeTo}`
          && String(test.formValues?.from).toLowerCase().startsWith(routeFrom.replaceAll('-', ' '))
          && String(test.formValues?.to).toLowerCase().startsWith(routeTo.replaceAll('-', ' ')),
        `directional estimate defaults are missing or incorrect for ${route}`);
      }
      if (name === 'chatbot-input') must(test.opened === true && test.textInputAccepted === true && test.messageSent === false, `chatbot input check is incomplete for ${route}`);
      if (name === 'desktop-layout') must(test.viewport?.width >= 1024 && Array.isArray(test.blockingDefects) && test.blockingDefects.length === 0, `desktop rendering check failed for ${route}`);
      if (name === 'mobile-layout') must(test.viewport?.width >= 1 && test.viewport?.width <= 480 && Array.isArray(test.blockingDefects) && test.blockingDefects.length === 0, `mobile rendering check failed for ${route}`);
      if (name === 'console-errors') must(Array.isArray(test.materialErrors) && test.materialErrors.length === 0, `browser errors remain for ${route}`);
    }
  }
  return doc;
}

export async function validateV970BaselineAdoptionEvidence({ evidence, baseline, manifestBytes, plan, planFileSha256, state, stateSha256, now = new Date(), read = readFile, profile = V970_BASELINE_ADOPTION_PROFILE }) {
  must(evidence?.schema === 'pcm-v970-baseline-adoption-evidence/v1'
    && evidence.profileId === profile.id && evidence.worker === profile.worker
    && evidence.versionId === profile.versionId
    && evidence.manifestSha256 === profile.manifestSha256
    && evidence.gitBaselineCommit === profile.gitBaselineCommit
    && evidence.releasePlanSha256 === profile.releasePlanSha256
    && evidence.releasePlanFileSha256 === profile.releasePlanFileSha256
    && evidence.releaseStateSha256 === profile.releaseStateSha256,
  'baseline-adoption profile is not authorized for this Worker/version/manifest/commit');
  must(baseline?.worker?.name === profile.worker && baseline.worker.active_version === profile.versionId
    && baseline.package?.linked_version_id === profile.versionId
    && plan?.worker === profile.worker && plan.candidateManifestSha256 === profile.manifestSha256
    && plan.releasePlanSha256 === profile.releasePlanSha256
    && planFileSha256 === profile.releasePlanFileSha256
    && state?.versionId === profile.versionId && state?.releasePlanSha256 === profile.releasePlanSha256
    && state?.candidateManifestSha256 === profile.manifestSha256
    && state?.productionVersionAfterPromotion === profile.versionId
    && state?.stage === 'PROMOTED_VERIFIED' && state?.postPromotionTrafficVerified === true
    && stateSha256 === profile.releaseStateSha256,
  'v970 adoption is not bound to the pinned promoted release records');
  must(plan.baselineSha256 === profile.previousBaselineSha256
    && plan.productionVersion === profile.immediateRollbackVersion
    && state.productionVersionBeforeUpload === profile.immediateRollbackVersion
    && state.rollbackVersion === profile.immediateRollbackVersion
    && state.historicalFallbackVersion === profile.historicalFallbackVersion
    && plan.rollbackVersion === profile.historicalFallbackVersion
    && baseline.worker.previous_rollback_version === profile.immediateRollbackVersion,
  'v970 predecessor or rollback linkage differs from the approved release');
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  must(sha(manifestBytes) === profile.manifestSha256
    && manifest.schema === 'pcm-release-candidate-manifest/v1'
    && manifest.files.length === profile.expectedAssetCount
    && baseline.file_hashes?.length === profile.expectedAssetCount,
  'v970 package manifest is incomplete');

  const retainedHttp = await readPinnedArtifact(evidence.retainedHttp, profile.retainedHttpSha256, 'retained production HTTP evidence', read);
  validateRetainedHttp(retainedHttp, profile);
  const historicalPreview = await readPinnedArtifact(evidence.historicalPreview, profile.historicalPreviewSha256, 'historical R6e preview evidence', read);
  validateHistoricalPreview(historicalPreview, profile);

  const focusedHttpRoutes = [...profile.freshHttpRoutes, ...profile.pricingRoutes];
  must(Array.isArray(evidence.freshHttp) && evidence.freshHttp.length === focusedHttpRoutes.length,
    'fresh HTTP evidence for /, /local/, /surrey/, and five pricing routes is missing');
  for (const path of focusedHttpRoutes) {
    const rows = evidence.freshHttp.filter((row) => row.path === path);
    must(rows.length === 1, `fresh HTTP evidence is missing or duplicated for ${path}`);
    const row = rows[0];
    must(row.status === 200 && row.origin === origin && row.url === origin + path
      && row.redirected === false && row.versionId === profile.versionId
      && row.manifestSha256 === profile.manifestSha256 && freshTimestamp(row.verifiedAtUtc, now),
    `fresh production HTTP check failed or is stale for ${path}`);
    const manifestPath = path === '/' ? 'site-copy/index.html' : `site-copy${path}index.html`;
    const record = manifest.files.find((file) => file.path === manifestPath);
    must(record, `v970 manifest lacks ${manifestPath}`);
    const raw = await read(row.bodyPath);
    must(sha(raw) === row.bodySha256, `fresh HTTP body hash mismatch for ${path}`);
    verifyProductionHtml(raw, record.sha256, true);
  }

  const browser = await validateFocusedBrowserArtifact(evidence.focusedBrowser, profile, now, read);
  const submission = await readPinnedArtifact(evidence.submissionArtifact, null, 'focused safe GET handoff artifact', read);
  must(submission.kind === 'submission' && submission.versionId === profile.versionId
    && submission.candidateManifestSha256 === profile.manifestSha256 && submission.origin === origin
    && submission.status === 'PASS' && submission.requestSubmitted === true
    && submission.expectedResponseObserved === true && Array.isArray(submission.tests)
    && submission.tests.length === profile.pricingRoutes.length,
  'safe estimate-form submission evidence is missing or bound to another version');
  await validateEvidenceFiles(submission.evidenceFiles, read);
  for (const route of profile.pricingRoutes) {
    const rows = submission.tests.filter((row) => row.route === route);
    must(rows.length === 1 && rows[0].name === 'estimate-get-handoff' && rows[0].status === 'PASS'
      && rows[0].method === 'GET' && rows[0].expectedResponseObserved === true
      && rows[0].handoff?.method === 'GET' && rows[0].handoff?.responseStatus === 200
      && rows[0].handoff?.actionUrl === `${origin}/contact/`,
    `safe estimate GET handoff evidence is incomplete for ${route}`);
    await validateEvidenceFiles(rows[0].evidenceFiles, read);
  }
  return { status: 'PASS', profileId: profile.id, versionId: profile.versionId, manifestSha256: profile.manifestSha256,
    retainedHttpRoutes: profile.retainedHttpRoutes, freshHttpRoutes: [...profile.freshHttpRoutes],
    focusedBrowserRoutes: [...browser.routes], historicalR6eFailuresPreserved: profile.historicalFailures.length,
    compatibilityFlags: 'INCOMPLETE' };
}

export function validateV970FreshCloudflareEvidence(evidence, { rollbackVersion, profile = V970_BASELINE_ADOPTION_PROFILE } = {}) {
  must(rollbackVersion === profile.immediateRollbackVersion
    && evidence?.schema === 'pcm-cloudflare-production-verification/v1'
    && evidence.worker === profile.worker
    && evidence.expected_version_id === profile.versionId
    && evidence.expected_traffic_percentage === 100
    && evidence.observed_version_id === profile.versionId
    && freshTimestamp(evidence.verified_at_utc, new Date())
    && Array.isArray(evidence.observed_production_allocations)
    && evidence.observed_production_allocations.length === 1
    && evidence.observed_production_allocations[0]?.version_id?.value === profile.versionId
    && evidence.observed_production_allocations[0]?.percentage?.value === 100,
  'fresh v970 production allocation is stale or does not show 100% traffic');
  must(Array.isArray(evidence.api_evidence)
    && evidence.api_evidence.every((row) => row.http_status === 200 && row.success === true),
  'fresh v970 Cloudflare API evidence is incomplete');
  const rollback = evidence.api_evidence.find((row) => String(row.endpoint ?? '').endsWith(`/versions/${rollbackVersion}`));
  must(rollback?.result?.id?.value === rollbackVersion
    && evidence.checks?.some((check) => check.name === 'rollback version identity' && check.status === 'PASS'),
  'fresh Cloudflare evidence does not confirm the recorded rollback version is available');
  const flags = evidence.checks?.find((check) => check.name === 'compatibility flags');
  must(flags?.status === 'BLOCKED' && /missing/i.test(flags.detail ?? ''),
    'v970 compatibility-flags limitation was not preserved as BLOCKED');
  return { worker: profile.worker, versionId: profile.versionId, trafficPercentage: 100,
    rollbackVersion, rollbackAvailable: true, compatibilityFlags: 'INCOMPLETE' };
}
