import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  assertCandidateBinding, assertPromotedProductionBinding, productionOrigin, checkHttpResponse, ensureOutsideCandidate,
  isAccessLogin, sanitizeConsoleMessage, validateCandidateInventory,
  assertPreviewPageCapabilities, connectToAuthorizedCdp, disconnectCdp, responseBody, beginResponseBodyCapture, resolveCapturedResponseBody, isBrowserExtensionDiagnostic, abortCollectorBlockedRequest, checkPreviewStylesheetResponse, checkProductionStylesheetResponse, captureScreenshot,
  selectCdpPreviewTarget, selectCdpTarget, validateCdpEndpoint, assertNoUnsafeEstimateActivity, blockedRequestDiagnostic,
  classifyBlockedMutationRequest, isAttributedAbortedBackgroundAnalyticsNetworkError, validateEstimateInteraction, validateEstimateHandoff, parseCollectorArgs, expectedBrowserTitle, findStylesheetRoute, ESTIMATE_FORM_ACTION_NAME, assessHorizontalLayout, validateBrowserCheckpoints, createBrowserArtifact,
} from './collect-preview-evidence.mjs';
import { CLOUDFLARE_INSIGHTS_BEACON, validateSmoke } from './smoke-evidence.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');

test('horizontal layout accepts contained pricing-table scrolling and rejects page or container overflow defects', async () => {
  const pricingTable = { clientWidth: 390, scrollWidth: 920, tableWidth: 920, overflowX: 'auto', left: 0, right: 390 };
  assert.deepEqual(assessHorizontalLayout({ viewportWidth: 390, documentScrollWidth: 390, pricingTableContainers: [pricingTable] }),
    { defects: [], documentOverflow: false });
  assert.match(assessHorizontalLayout({ viewportWidth: 390, documentScrollWidth: 420, pricingTableContainers: [pricingTable] }).defects.join(' '), /Document exceeds/);
  assert.match(assessHorizontalLayout({ viewportWidth: 390, documentScrollWidth: 520 }).defects.join(' '), /Document exceeds/,
    'unrelated page elements remain subject to the same strict document-width check');
  assert.match(assessHorizontalLayout({ viewportWidth: 390, documentScrollWidth: 390,
    pricingTableContainers: [{ ...pricingTable, overflowX: 'visible' }] }).defects.join(' '), /not contained/);
  assert.match(assessHorizontalLayout({ viewportWidth: 390, documentScrollWidth: 390,
    pricingTableContainers: [{ ...pricingTable, right: 430 }] }).defects.join(' '), /not contained/);
  assert.equal(assessHorizontalLayout({ viewportWidth: 1440, documentScrollWidth: 1440 }).documentOverflow, false);
  assert.equal(assessHorizontalLayout({ viewportWidth: 390, documentScrollWidth: 390 }).documentOverflow, false);

  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  assert.equal((source.match(/await readHorizontalLayout\(page\)/g) ?? []).length, 2,
    'desktop and mobile checks use the same strict assessment on every assigned route');
  assert.match(source, /documentScrollWidth: desktopMetrics\.documentScrollWidth, pricingTableContainers: desktopMetrics\.pricingTableContainers/);
  assert.match(source, /documentScrollWidth: mobileMetrics\.documentScrollWidth, pricingTableContainers: mobileMetrics\.pricingTableContainers/);
  assert.match(source, /captureScreenshot\(page, \{ fullPage: false \}\)/,
    'layout screenshots remain part of the evidence artifact');
});

test('browser checkpoints resume completed checks and preserve fresh owner layout reviews', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pcm-browser-checkpoint-resume-'));
  try {
    const versionId = '8ece0f98-ba72-46a7-8ee8-a4bc09a1c667', manifestSha256 = 'a'.repeat(64);
    const configuration = { checksByRoute: { '/one/': ['page-title', 'mobile-layout'], '/two/': ['page-title', 'mobile-layout'] } };
    const binding = { candidateVersionId: versionId, manifestSha256,
      configurationSha256: sha(Buffer.from(JSON.stringify(configuration))) };
    const createdAt = new Date('2026-10-30T18:00:00.000Z').toISOString();
    const checkpoint = { schema: 'pcm-browser-checkpoints/v1', binding, checks: [] };
    for (const [route, name, viewport, hasOwnerReview] of [
      ['/one/', 'page-title', { width: 1440, height: 900 }, false],
      ['/one/', 'mobile-layout', { width: 390, height: 844 }, true],
      ['/two/', 'page-title', { width: 1440, height: 900 }, false],
    ]) {
      const path = join(root, `${route.slice(1, -1)}-${name}.png`), bytes = Buffer.from(`${route}:${name}`);
      await writeFile(path, bytes);
      const screenshot = { path, sha256: sha(bytes) };
      const row = { name, route, status: 'PASS', versionId, candidateManifestSha256: manifestSha256,
        verifiedAtUtc: createdAt, viewport, ...(hasOwnerReview ? { ownerLayoutReview: { completed: true, status: 'PASS', screenshotSha256: screenshot.sha256 } } : {}),
        evidenceFiles: [screenshot], screenshotEvidence: screenshot };
      checkpoint.checks.push({ binding, row, screenshot });
    }
    const resumed = await validateBrowserCheckpoints({ checkpoint, binding, configuration, outputDir: root,
      now: Date.parse(createdAt) + 60_000, maxAgeMinutes: 120 });
    assert.deepEqual(resumed.map(row => `${row.route}:${row.name}`), ['/one/:page-title', '/one/:mobile-layout', '/two/:page-title']);
    assert.deepEqual(resumed[1].ownerLayoutReview, { completed: true, status: 'PASS', screenshotSha256: resumed[1].screenshotEvidence.sha256 });
    assert.ok(!resumed.some(row => row.route === '/two/' && row.name === 'mobile-layout'),
      'the collector can continue at the first missing check');
    const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
    assert.match(source, /expectedNames\.every\(name => hasCheck\(routePath, name\)\)\) continue/);
    assert.match(source, /routeChecks\.includes\('mobile-layout'\) && !hasCheck\(routePath, 'mobile-layout'\)/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('browser checkpoints reject candidate changes, expiration, corruption, and incomplete screenshot records', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pcm-browser-checkpoint-validation-'));
  try {
    const versionId = '8ece0f98-ba72-46a7-8ee8-a4bc09a1c667', manifestSha256 = 'b'.repeat(64);
    const configuration = { checksByRoute: { '/one/': ['mobile-layout'] } };
    const binding = { candidateVersionId: versionId, manifestSha256,
      configurationSha256: sha(Buffer.from(JSON.stringify(configuration))) };
    const verifiedAtUtc = '2026-10-30T18:00:00.000Z', path = join(root, 'mobile.png'), bytes = Buffer.from('verified screenshot');
    await writeFile(path, bytes);
    const screenshot = { path, sha256: sha(bytes) };
    const row = { name: 'mobile-layout', route: '/one/', status: 'PASS', versionId, candidateManifestSha256: manifestSha256,
      verifiedAtUtc, viewport: { width: 390, height: 844 }, evidenceFiles: [screenshot], screenshotEvidence: screenshot };
    const checkpoint = { schema: 'pcm-browser-checkpoints/v1', binding, checks: [{ binding, row, screenshot }] };
    await assert.rejects(() => validateBrowserCheckpoints({ checkpoint, binding: { ...binding, manifestSha256: 'c'.repeat(64) },
      configuration, outputDir: root }), /binding or schema/);
    assert.deepEqual(await validateBrowserCheckpoints({ checkpoint, binding, configuration, outputDir: root,
      now: Date.parse(verifiedAtUtc) + 121 * 60_000, maxAgeMinutes: 120 }), [], 'expired evidence is not reused');
    const incomplete = structuredClone(checkpoint); delete incomplete.checks[0].screenshot;
    await assert.rejects(() => validateBrowserCheckpoints({ checkpoint: incomplete, binding, configuration, outputDir: root }), /incomplete check or screenshot/);
    const mismatched = structuredClone(checkpoint); mismatched.checks[0].screenshot.sha256 = '0'.repeat(64);
    await assert.rejects(() => validateBrowserCheckpoints({ checkpoint: mismatched, binding, configuration, outputDir: root }), /incomplete check or screenshot|evidence is corrupt or changed/);
    await writeFile(path, Buffer.from('corrupt screenshot'));
    await assert.rejects(() => validateBrowserCheckpoints({ checkpoint, binding, configuration, outputDir: root }), /evidence is corrupt or changed/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('resumed browser artifact retains the guarded workflow format and never upgrades failed checks', () => {
  const failed = { name: 'mobile-layout', route: '/one/', status: 'FAIL', blockingDefects: ['Document exceeds the viewport width'] };
  const artifact = createBrowserArtifact({ versionId: 'candidate', candidateManifestSha256: 'd'.repeat(64),
    origin: 'https://candidate.example', riskClassification: 'HIGH-RISK FUNCTIONAL',
    browserEnvironment: { browser: 'Chromium', version: 'test', platform: 'test' }, evidenceFiles: [], routes: ['/one/'], tests: [failed] });
  assert.deepEqual(Object.keys(artifact).sort(), ['kind', 'versionId', 'candidateManifestSha256', 'origin', 'riskClassification', 'status',
    'verifiedAtUtc', 'browserEnvironment', 'evidenceFiles', 'routes', 'browserInteractionPerformed', 'tests',
    'backgroundAnalyticsRequests', 'attributedBackgroundAnalyticsErrors'].sort());
  assert.equal(artifact.kind, 'browser');
  assert.equal(artifact.browserInteractionPerformed, true);
  assert.equal(artifact.status, 'FAIL');
  assert.equal(artifact.tests[0].status, 'FAIL');
});

test('changed stylesheet route is selected from candidate HTML that actually loads the asset', () => {
  const stylesheetPath = '/assets/step46-toronto-winnipeg.css';
  const route = findStylesheetRoute([
    { route: '/', html: '<html><head><link rel="stylesheet" href="/assets/site.css"></head></html>' },
    { route: '/local/', html: '<html><head></head></html>' },
    { route: '/toronto-to-winnipeg-movers/', html: `<html><head><link rel="preload stylesheet" href="${stylesheetPath}"></head></html>` },
  ], stylesheetPath);
  assert.equal(route, '/toronto-to-winnipeg-movers/');
  assert.equal(findStylesheetRoute([{ route: '/', html: '<html><head><link rel="stylesheet" href="/assets/site.css"></head></html>' }], stylesheetPath), null);
  assert.equal(findStylesheetRoute([{ route: '/', html: `<html><head><link rel="preload" href="${stylesheetPath}"></head></html>` }], stylesheetPath), null);
});

test('estimate form lookup accepts the actual route-page CTA and the existing homepage CTA', () => {
  const routePage = '<form action="/contact/" method="get"><input name="from"><input name="to"><select name="homeSize"></select><input name="moveDate" type="date"><button type="submit">Get Written Estimate</button></form>';
  const homepage = '<form><button type="submit">Continue Estimate</button></form>';
  const labels = [...routePage.matchAll(/<button\b[^>]*>(.*?)<\/button>/gi), ...homepage.matchAll(/<button\b[^>]*>(.*?)<\/button>/gi)].map(match => match[1]);
  assert.deepEqual(labels, ['Get Written Estimate', 'Continue Estimate']);
  assert.ok(labels.every(label => ESTIMATE_FORM_ACTION_NAME.test(label)));
  assert.equal(ESTIMATE_FORM_ACTION_NAME.test('Submit customer estimate'), false);
});

test('browser console attribution filters extension failures but retains page failures', () => {
  assert.equal(isBrowserExtensionDiagnostic({ url: 'chrome-extension://abc123/injected.js' }), true);
  assert.equal(isBrowserExtensionDiagnostic({ stack: 'TypeError\n at chrome-extension://abc123/share-modal.js:1:2' }), true);
  assert.equal(isBrowserExtensionDiagnostic({ url: 'https://preview.example/assets/app.js' }), false);
  assert.equal(isBrowserExtensionDiagnostic({ message: 'Failed to load resource: net::ERR_FAILED' }), false);
});

function fixture() {
  const manifestBytes = Buffer.from('{"schema":"pcm-release-candidate-manifest/v1","files":[{"path":"site-copy/example/index.html","bytes":1,"sha256":"' + 'a'.repeat(64) + '"}]}\n');
  const manifest = JSON.parse(manifestBytes);
  const plan = {
    schema: 'pcm-guarded-release-plan/v1', status: 'READY_FOR_OWNER_REVIEW', worker: 'newpurely',
    candidatePackage: 'C:/candidate', candidateManifestPath: 'C:/release/candidate-manifest.json',
    productionVersion: 'production-version', rollbackVersion: 'rollback-version',
    candidateManifestSha256: sha(manifestBytes), approvedChanges: [{ path: 'site-copy/example/index.html' }],
  };
  plan.releasePlanSha256 = sha(Buffer.from(JSON.stringify(plan, null, 2) + '\n'));
  const state = {
    worker: 'newpurely', versionId: '8ece0f98-ba72-46a7-8ee8-a4bc09a1c667',
    stage: 'UPLOADED_INCOMPLETE_NOT_PROMOTED', previewUrl: 'https://8ece0f98-newpurely.example.workers.dev',
    candidatePackage: plan.candidatePackage, candidateManifestPath: plan.candidateManifestPath,
    productionVersionBeforeUpload: plan.productionVersion, rollbackVersion: plan.rollbackVersion,
    candidateManifestSha256: plan.candidateManifestSha256, releasePlanSha256: plan.releasePlanSha256,
  };
  return { manifestBytes, manifest, plan, state };
}

test('candidate binding accepts only the exact inactive version and manifest', () => {
  const f = fixture();
  const result = assertCandidateBinding({ ...f, expectedVersionId: f.state.versionId, expectedManifestSha256: f.plan.candidateManifestSha256 });
  assert.equal(result.versionId, f.state.versionId);
  assert.equal(result.origin, 'https://8ece0f98-newpurely.example.workers.dev');
});

test('candidate binding rejects wrong version, manifest bytes, release plan, or active stage', () => {
  const f = fixture();
  assert.throws(() => assertCandidateBinding({ ...f, expectedVersionId: 'different', expectedManifestSha256: f.plan.candidateManifestSha256 }), /explicitly selected version/);
  assert.throws(() => assertCandidateBinding({ ...f, expectedVersionId: f.state.versionId, expectedManifestSha256: '0'.repeat(64) }), /explicitly selected candidate/);
  assert.throws(() => assertCandidateBinding({ ...f, manifestBytes: Buffer.from('tampered'), expectedVersionId: f.state.versionId, expectedManifestSha256: f.plan.candidateManifestSha256 }), /manifest hash mismatch/);
  assert.throws(() => assertCandidateBinding({ ...f, state: { ...f.state, stage: 'PROMOTED' }, expectedVersionId: f.state.versionId, expectedManifestSha256: f.plan.candidateManifestSha256 }), /inactive uploaded candidate/);
});

test('production binding requires the exact successfully promoted version and approved manifest', () => {
  const f = fixture();
  const uploadedState = { ...f.state, schema: 'pcm-guarded-release-state/v1', stage: 'UPLOADED_INCOMPLETE_NOT_PROMOTED' };
  const promotedState = {
    ...uploadedState, stage: 'PROMOTED_VERIFIED', productionVersionAfterPromotion: f.state.versionId,
    postPromotionTrafficVerified: true, deploymentAuthorization: 'CONSUMED_FOR_THIS_PROMOTION_ONLY',
    promotionAuthorizationSha256: 'b'.repeat(64),
  };
  assert.equal(productionOrigin(), 'https://purelycanadianmovers.com');
  assert.equal(assertPromotedProductionBinding({ plan: f.plan, uploadedState, promotedState, expectedVersionId: f.state.versionId, expectedManifestSha256: f.plan.candidateManifestSha256 }), productionOrigin());
  assert.throws(() => assertPromotedProductionBinding({ plan: f.plan, uploadedState, promotedState, expectedVersionId: 'different', expectedManifestSha256: f.plan.candidateManifestSha256 }), /uploaded candidate state/);
  assert.throws(() => assertPromotedProductionBinding({ plan: f.plan, uploadedState, promotedState: { ...promotedState, versionId: 'different' }, expectedVersionId: f.state.versionId, expectedManifestSha256: f.plan.candidateManifestSha256 }), /exact verified promotion record/);
  assert.throws(() => assertPromotedProductionBinding({ plan: f.plan, uploadedState, promotedState: { ...promotedState, candidateManifestSha256: '0'.repeat(64) }, expectedVersionId: f.state.versionId, expectedManifestSha256: f.plan.candidateManifestSha256 }), /exact verified promotion record/);
  assert.throws(() => assertPromotedProductionBinding({ plan: f.plan, uploadedState, promotedState: { ...promotedState, postPromotionTrafficVerified: false }, expectedVersionId: f.state.versionId, expectedManifestSha256: f.plan.candidateManifestSha256 }), /exact verified promotion record/);
});

test('collector CLI keeps preview as the default and accepts production explicitly', () => {
  const base = ['--run-dir', 'C:/run', '--output-dir', 'C:/evidence', '--version-id', 'version', '--manifest-sha256', 'a'.repeat(64)];
  assert.equal(parseCollectorArgs(base).phase, 'preview');
  assert.equal(parseCollectorArgs([...base, '--phase', 'preview']).phase, 'preview');
  assert.equal(parseCollectorArgs([...base, '--phase', 'production']).phase, 'production');
  assert.throws(() => parseCollectorArgs([...base, '--phase', 'candidate']), /preview or production/);
});

test('one-time baseline-adoption collector is pinned to production and requires retained evidence inputs', () => {
  const base = ['--run-dir', 'C:/run', '--output-dir', 'C:/evidence', '--version-id', '66f53c94-b431-4f60-b910-801109100952', '--manifest-sha256', '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93'];
  const profile = '--baseline-adoption-profile';
  assert.throws(() => parseCollectorArgs([...base, profile, 'batch2-v970-one-time']), /absolute retained HTTP and historical preview/);
  const parsed = parseCollectorArgs([...base, '--phase', 'production', profile, 'batch2-v970-one-time',
    '--retained-http-evidence', 'C:/evidence/retained-http.json',
    '--historical-preview-evidence', 'C:/evidence/r6e-browser.json']);
  assert.equal(parsed.baselineAdoptionProfile, 'batch2-v970-one-time');
  assert.equal(parsed.phase, 'production');
  assert.throws(() => parseCollectorArgs([...base, profile, 'other-profile',
    '--retained-http-evidence', 'C:/evidence/retained-http.json', '--historical-preview-evidence', 'C:/evidence/r6e-browser.json']), /Unsupported baseline-adoption profile/);
});

test('approved production homepage title expectation applies only to the root page-title check', () => {
  const baselineTitle = 'Vancouver Movers | Local & Long-Distance Moving';
  const productionTitle = 'Professional Movers Vancouver BC | Purely Canadian Movers';
  assert.equal(expectedBrowserTitle({ routePath: '/', baselineTitle, expectedHomepageTitle: productionTitle }), productionTitle);
  assert.equal(expectedBrowserTitle({ routePath: '/', baselineTitle, expectedHomepageTitle: 'A different exact title' }), 'A different exact title');
  assert.equal(expectedBrowserTitle({ routePath: '/local/', baselineTitle, expectedHomepageTitle: productionTitle }), baselineTitle);
  assert.equal(expectedBrowserTitle({ routePath: '/', baselineTitle, expectedHomepageTitle: '  ' }), productionTitle);
  assert.equal(expectedBrowserTitle({ routePath: '/long-distance-moving-cost-canada/', baselineTitle: 'Moving Cost Guide Canada | Purely Canadian Movers' }), 'Moving Cost Guide Canada');
  const parsed = parseCollectorArgs(['--run-dir', 'C:/run', '--output-dir', 'C:/evidence', '--version-id', 'version', '--manifest-sha256', 'a'.repeat(64), '--expected-homepage-title', productionTitle]);
  assert.equal(parsed.expectedHomepageTitle, productionTitle);
});

test('shared smoke validator rejects wrong production version, origin, manifest hash, and expired evidence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pcm-production-smoke-'));
  try {
    const candidate = join(root, 'candidate'), evidencePath = join(root, 'production.json');
    await mkdir(candidate);
    const state = { versionId: '8ece0f98-ba72-46a7-8ee8-a4bc09a1c667', previewUrl: 'https://8ece0f98-newpurely.example.workers.dev' };
    const plan = { candidatePackage: candidate, candidateManifestSha256: 'a'.repeat(64), smokeRequirements: { maxAgeMinutes: 120 } };
    const doc = { schema: 'pcm-release-smoke/v1', phase: 'production', worker: 'newpurely', versionId: state.versionId, candidateManifestSha256: plan.candidateManifestSha256, origin: productionOrigin(), verifiedAtUtc: new Date().toISOString(), probes: [], checks: [] };
    await writeFile(evidencePath, JSON.stringify(doc));
    await assert.rejects(validateSmoke({ evidencePath, plan, state, phase: 'preview' }), /exact candidate and phase/);
    await assert.rejects(validateSmoke({ evidencePath, plan, state: { ...state, versionId: 'different' }, phase: 'production' }), /exact candidate and phase/);
    await assert.rejects(validateSmoke({ evidencePath, plan, state, phase: 'production' }));
    await writeFile(evidencePath, JSON.stringify({ ...doc, origin: 'https://wrong.example' }));
    await assert.rejects(validateSmoke({ evidencePath, plan, state, phase: 'production' }), /exact candidate and phase/);
    await writeFile(evidencePath, JSON.stringify({ ...doc, candidateManifestSha256: 'c'.repeat(64) }));
    await assert.rejects(validateSmoke({ evidencePath, plan, state, phase: 'production' }), /exact candidate and phase/);
    await writeFile(evidencePath, JSON.stringify({ ...doc, verifiedAtUtc: '2000-01-01T00:00:00.000Z' }));
    await assert.rejects(validateSmoke({ evidencePath, plan, state, phase: 'production' }), /stale|expired|fresh/i);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('HTTP evidence binds a direct 200 body to the exact preview URL and candidate hash', () => {
  const body = Buffer.from('<!doctype html><title>Candidate</title>');
  const result = checkHttpResponse({
    path: '/example/index.html', origin: 'https://8ece0f98-newpurely.example.workers.dev',
    responseUrl: 'https://8ece0f98-newpurely.example.workers.dev/example/index.html', status: 200,
    redirected: false, redirectedFrom: false, body, expectedSha256: sha(body),
  });
  assert.equal(result.bodySha256, sha(body));
  assert.deepEqual(Buffer.from(result.bodyBase64, 'base64'), body);
});

test('changed CSS verification binds exact bytes to the actual rendered stylesheet response', () => {
  const body = Buffer.from('/* UTF-8 entity */ .hero { content: "824–825px"; }', 'utf8');
  const base = {
    path: '/assets/conversion-boost.css', origin: 'https://candidate.example.workers.dev',
    responseUrl: 'https://candidate.example.workers.dev/assets/conversion-boost.css', status: 200,
    redirected: false, redirectedFrom: false, body, expectedSha256: sha(body),
  };
  const result = checkPreviewStylesheetResponse({ ...base, resourceType: 'stylesheet' });
  assert.equal(result.resourceType, 'stylesheet');
  assert.equal(result.captureMethod, 'rendered-stylesheet-response');
  assert.equal(result.bodySha256, sha(body));
  assert.deepEqual(Buffer.from(result.bodyBase64, 'base64'), body);
  assert.throws(() => checkPreviewStylesheetResponse({ ...base, resourceType: 'document' }), /actual stylesheet response/);
  assert.throws(() => checkPreviewStylesheetResponse({ ...base, resourceType: 'stylesheet', expectedSha256: '0'.repeat(64) }), /do not match the candidate/);
  const production = checkProductionStylesheetResponse({ ...base, origin: 'https://purelycanadianmovers.com', responseUrl: 'https://purelycanadianmovers.com/assets/conversion-boost.css', phase: 'production', resourceType: 'stylesheet' });
  assert.equal(production.resourceType, 'stylesheet');
  assert.equal(production.captureMethod, 'rendered-stylesheet-response');
  assert.equal(production.bodySha256, sha(body));
  assert.deepEqual(Buffer.from(production.bodyBase64, 'base64'), body);
  assert.throws(() => checkProductionStylesheetResponse({ ...base, phase: 'production', resourceType: 'document' }), /actual stylesheet response/);
  assert.throws(() => checkProductionStylesheetResponse({ ...base, origin: 'https://purelycanadianmovers.com', responseUrl: 'https://purelycanadianmovers.com/assets/conversion-boost.css', phase: 'production', resourceType: 'stylesheet', expectedSha256: '0'.repeat(64) }), /do not match the approved asset/);
});

test('rendered stylesheet response bytes are captured before a later navigation invalidates the response handle', async () => {
  const bytes = Buffer.from('body{color:#123456}', 'utf8');
  let navigatedAway = false;
  const capture = beginResponseBodyCapture({
    body: () => {
      assert.equal(navigatedAway, false, 'response body read must start during the response event');
      return Promise.resolve(bytes);
    },
  });
  navigatedAway = true;
  assert.deepEqual(await resolveCapturedResponseBody(capture, '/assets/example.css'), bytes);

  const failed = beginResponseBodyCapture({ body: async () => { throw new Error('response body expired'); } });
  await assert.rejects(resolveCapturedResponseBody(failed, '/assets/example.css'), /HTTP response body capture failed/);
});

test('production collector records raw and normalized hashes while preview remains byte exact', () => {
  const candidate = Buffer.from('<!doctype html><html><body><h1>Route</h1></body></html>');
  const close = candidate.indexOf(Buffer.from('</body>'));
  const live = Buffer.concat([candidate.subarray(0, close), CLOUDFLARE_INSIGHTS_BEACON, candidate.subarray(close)]);
  const args = { path: '/route/', origin: 'https://purelycanadianmovers.com', responseUrl: 'https://purelycanadianmovers.com/route/', status: 200, redirected: false, redirectedFrom: false, body: live, expectedSha256: sha(candidate) };
  const production = checkHttpResponse({ ...args, phase: 'production' });
  assert.equal(production.bodySha256, sha(live));
  assert.equal(production.rawResponseSha256, sha(live));
  assert.equal(production.comparisonBodySha256, sha(candidate));
  assert.equal(production.cloudflareInsightsBeaconApplied, true);
  assert.deepEqual(Buffer.from(production.bodyBase64, 'base64'), live);
  assert.throws(() => checkHttpResponse(args), /Preview response bytes do not match/);
});

test('HTTP evidence rejects login, redirect, missing body, wrong URL, and asset hash mismatch', () => {
  const body = Buffer.from('<!doctype html><title>Candidate</title>');
  const base = { path: '/example/index.html', origin: 'https://8ece0f98-newpurely.example.workers.dev', responseUrl: 'https://8ece0f98-newpurely.example.workers.dev/example/index.html', status: 200, redirected: false, redirectedFrom: false, body };
  assert.throws(() => checkHttpResponse({ ...base, responseUrl: 'https://account.cloudflareaccess.com/cdn-cgi/access/login/app' }), /Access login/);
  assert.throws(() => checkHttpResponse({ ...base, body: Buffer.from('<title>Sign in</title>') }), /Access login/);
  assert.throws(() => checkHttpResponse({ ...base, body: null }), /body is missing/);
  assert.throws(() => checkHttpResponse({ ...base, redirected: true }), /direct HTTP 200/);
  assert.throws(() => checkHttpResponse({ ...base, responseUrl: 'https://other.example/page' }), /direct HTTP 200/);
  assert.throws(() => checkHttpResponse({ ...base, expectedSha256: '0'.repeat(64) }), /do not match the candidate/);
  assert.throws(() => checkHttpResponse({ ...base, path: '/../secret' }), /path is invalid/);
});

test('console evidence redacts URL queries, bearer tokens, and JWT-shaped values', () => {
  const safe = sanitizeConsoleMessage('failed https://example.test/path?token=abc&state=xyz Bearer abc eyJabcdefgh.abcdef.abcdef');
  assert.match(safe, /https:\/\/example\.test\/path/);
  assert.doesNotMatch(safe, /token=abc|state=xyz|Bearer abc|eyJabcdefgh/);
});

test('evidence output must stay outside the candidate package', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pcm-preview-evidence-'));
  try {
    const candidate = join(root, 'candidate'); const evidence = join(root, 'evidence');
    await mkdir(candidate); await mkdir(evidence);
    ensureOutsideCandidate(evidence, candidate);
    assert.throws(() => ensureOutsideCandidate(join(candidate, 'evidence'), candidate), /outside the immutable candidate package/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('complete candidate inventory rejects missing, added, or modified package files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pcm-inventory-'));
  try {
    const file = join(root, 'site-copy', 'example', 'index.html');
    await mkdir(join(root, 'site-copy', 'example'), { recursive: true });
    const bytes = Buffer.from('x');
    await writeFile(file, bytes);
    const record = { path: 'site-copy/example/index.html', bytes: bytes.length, sha256: sha(bytes) };
    const manifest = { schema: 'pcm-release-candidate-manifest/v1', files: [record] };
    assert.deepEqual(await validateCandidateInventory(root, manifest), { filesVerified: 1 });
    await writeFile(join(root, 'unexpected.txt'), 'no');
    await assert.rejects(validateCandidateInventory(root, manifest), /unmanifested file/);
    await rm(join(root, 'unexpected.txt'));
    await writeFile(file, 'modified');
    await assert.rejects(validateCandidateInventory(root, manifest), /differs from its manifest/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('Cloudflare Access sign-in is distinguished from a candidate page', () => {
  assert.equal(isAccessLogin('https://8ece0f98-newpurely.example.workers.dev/example/'), false);
  assert.equal(isAccessLogin('https://foo.cloudflareaccess.com/cdn-cgi/access/login/example'), true);
});

test('collector does not export browser storage or inspect authentication cookies', async () => {
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /storageState\s*\(|context\.cookies\s*\(|page\.context\(\)\.cookies\s*\(/);
});

test('CDP accepts only an explicit loopback HTTP endpoint', () => {
  assert.equal(validateCdpEndpoint('http://127.0.0.1:9222'), 'http://127.0.0.1:9222');
  for (const endpoint of ['https://127.0.0.1:9222', 'http://localhost:9222', 'http://192.168.1.4:9222', 'http://user:pass@127.0.0.1:9222', 'http://127.0.0.1:9222/json']) {
    assert.throws(() => validateCdpEndpoint(endpoint), /explicit http:\/\/127\.0\.0\.1/);
  }
});

test('CDP connects only to the validated endpoint', async () => {
  const seen = [];
  const chromium = { connectOverCDP: async endpoint => { seen.push(endpoint); return { attached: true }; } };
  assert.deepEqual(await connectToAuthorizedCdp(chromium, 'http://127.0.0.1:9333'), { attached: true });
  assert.deepEqual(seen, ['http://127.0.0.1:9333']);
  await assert.rejects(connectToAuthorizedCdp(chromium, 'http://192.168.1.4:9333'), /explicit http:\/\/127\.0\.0\.1/);
});

test('CDP selects only the exact preview tab and rejects ambiguity or missing context', () => {
  const expected = 'https://8ece0f98-newpurely.edwardkita.workers.dev/calgary-to-toronto-movers/';
  const page = url => ({ url: () => url });
  const context = pages => ({ pages: () => pages });
  assert.equal(selectCdpPreviewTarget({ contexts: () => [context([page(expected)])] }, expected).page.url(), expected);
  assert.throws(() => selectCdpPreviewTarget({ contexts: () => [] }, expected), /exactly one browser context/);
  assert.throws(() => selectCdpPreviewTarget({ contexts: () => [context([])] }, expected), /exactly one tab/);
  assert.throws(() => selectCdpPreviewTarget({ contexts: () => [context([page(expected), page(expected)])] }, expected), /exactly one tab/);
  assert.throws(() => selectCdpPreviewTarget({ contexts: () => [context([page('https://example.com/')])] }, expected), /exact selected preview route/);
});

test('production CDP selection requires the exact public route and reports actual versus expected URLs', () => {
  const expected = 'https://purelycanadianmovers.com/calgary-to-montreal-movers/';
  const page = url => ({ url: () => url });
  const browser = url => ({ contexts: () => [{ pages: () => [page(url)] }] });
  assert.equal(selectCdpTarget(browser(expected), expected, 'production').page.url(), expected);
  assert.throws(
    () => selectCdpTarget(browser('https://86d23937-newpurely.edwardkita.workers.dev/montreal-to-calgary-movers/'), expected, 'production'),
    error => error.message.includes(expected) && error.message.includes('https://86d23937-newpurely.edwardkita.workers.dev/montreal-to-calgary-movers/') && error.message.includes('production route'),
  );
  assert.throws(() => selectCdpTarget(browser(expected), expected, 'invalid'), /preview or production/);
});

test('CDP preview tab must support console event and viewport evidence', () => {
  const supported = { url() {}, goto() {}, on() {}, setViewportSize() {}, screenshot() {}, locator() {} };
  assert.equal(assertPreviewPageCapabilities(supported), undefined);
  assert.throws(() => assertPreviewPageCapabilities({ ...supported, on: undefined }), /required browser evidence \(on\)/);
  assert.throws(() => assertPreviewPageCapabilities({ ...supported, setViewportSize: undefined }), /required browser evidence \(setViewportSize\)/);
});

test('HTTP body capture fails closed when CDP response bytes are unavailable', async () => {
  assert.deepEqual(await responseBody({ body: async () => Buffer.from('bytes') }, '/route/'), Buffer.from('bytes'));
  await assert.rejects(responseBody({}, '/route/'), /body capture is unavailable/);
  await assert.rejects(responseBody({ body: async () => { throw new Error('opaque transport failure'); } }, '/route/'), /body capture failed/);
  await assert.rejects(responseBody({ body: async () => Buffer.alloc(0) }, '/route/'), /body is missing/);
});

test('screenshot capture retries one CDP capture protocol failure only', async () => {
  let calls = 0;
  const page = { screenshot: async () => { calls++; if (calls === 1) throw new Error('Protocol error (Page.captureScreenshot): transient'); return Buffer.from('png'); } };
  assert.deepEqual(await captureScreenshot(page, { fullPage: true }), Buffer.from('png'));
  assert.equal(calls, 2);
  calls = 0;
  const broken = { screenshot: async () => { calls++; throw new Error('Screenshot option rejected'); } };
  await assert.rejects(captureScreenshot(broken, {}), /Screenshot option rejected/);
  assert.equal(calls, 1);
});

test('screenshot capture retries font-wait timeout only after browser confirms fonts are loaded', async () => {
  let calls = 0;
  const readyPage = {
    screenshot: async () => { calls++; if (calls === 1) throw new Error('Timeout 30000ms exceeded. Call log: waiting for fonts to load'); return Buffer.from('png'); },
    evaluate: async () => 'loaded',
  };
  assert.deepEqual(await captureScreenshot(readyPage, {}), Buffer.from('png'));
  assert.equal(calls, 2);
  calls = 0;
  const pendingPage = { ...readyPage, evaluate: async () => 'loading' };
  await assert.rejects(captureScreenshot(pendingPage, {}), /waiting for fonts to load/);
  assert.equal(calls, 1);
});

test('CDP Access redirects are rejected and disconnect closes only the client connection', async () => {
  assert.equal(isAccessLogin('https://login.cloudflareaccess.com/cdn-cgi/access/login'), true);
  let disconnected = false;
  await disconnectCdp({ close: async () => { disconnected = true; } });
  assert.equal(disconnected, true);
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  assert.match(source, /if \(cdpEndpoint\) await disconnectCdp\(browser\)/);
  assert.match(source, /Playwright defines close\(\) on a CDP-connected Browser as disconnecting the client/);
  assert.match(source, /connectToAuthorizedCdp\(chromium, cdpEndpoint\)/);
  assert.doesNotMatch(source, /storageState\s*\(|context\.cookies\s*\(/);
});

test('browser launch mode remains the default when no CDP endpoint is supplied', async () => {
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  assert.match(source, /: await chromium\.launch\(\{ headless: false, executablePath \}\)/);
  assert.match(source, /--cdp-endpoint/);
});

test('collector assigns route-specific checks and retains risk-bound evidence validation', async () => {
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  assert.match(source, /deriveSmokePolicy\(plan, workflow\.owners\)/);
  assert.match(source, /browserCheckAssignments\(run\.plan, run\.smokePolicy, run\.workflow\.owners\)/);
  assert.match(source, /routeChecks\.includes\('estimate-form'\)/);
  assert.match(source, /routeChecks\.includes\('chatbot-input'\)/);
  assert.match(source, /routeChecks\.includes\('changed-content'\)/);
  assert.match(source, /riskClassification: run\.smokePolicy\.classification/);
  assert.match(source, /policyOverride: run\.smokePolicy, sourceOwners: run\.workflow\.owners/);
});

test('chatbot collector scrolls past estimate and waits for an interactive launcher before opening and testing input', async () => {
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  const start = source.indexOf("if (routeChecks.includes('chatbot-input') && !hasCheck(routePath, 'chatbot-input')) {");
  const end = source.indexOf("if (routeChecks.includes('desktop-layout') && !hasCheck(routePath, 'desktop-layout')) {", start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const interaction = source.slice(start, end);
  const scroll = interaction.indexOf('window.scrollTo');
  const visible = interaction.indexOf("chatButton.waitFor({ state: 'visible'");
  const interactive = interaction.indexOf('await page.waitForFunction');
  const open = interaction.indexOf('await chatButton.click()');
  const input = interaction.indexOf("await chatInput.fill('preview smoke test')");
  assert.ok(scroll >= 0 && visible > scroll && interactive > visible && open > interactive && input > open);
  assert.match(interaction, /button\.disabled/);
  assert.match(interaction, /style\.pointerEvents !== 'none'/);
  assert.match(interaction, /if \(!chatInput\) fail\(/);
  assert.match(interaction, /textInputAccepted: Boolean\(accepted\)/);
});

function estimateState(values, nativeValidity) {
  const validity=nativeValidity.map(item=>({name:item.name??'field',valid:item.valid,required:item.required??false,valueMissing:item.valueMissing??false,willValidate:item.willValidate??true}));
  return {
    controls: values.map(([name, value]) => ({ name, accessibleName: name, visible: true, value, checked: null, selectedIndex: null })),
    nativeValidity:validity,
  };
}

function validationObservation(state) { return { method:'HTMLFormElement.checkValidity', result:state.nativeValidity.filter(item=>item.willValidate).every(item=>item.valid), controls:structuredClone(state.nativeValidity) }; }

test('safe estimate observation accepts empty, partially completed, and already-valid forms without submit', () => {
  const cases = [
    { name: 'empty', before: estimateState([['home-size', ''], ['move-date', '']], [{ valid: false }, { valid: false }]) },
    { name: 'partial', before: estimateState([['home-size', '2-bedroom'], ['move-date', '']], [{ valid: true }, { valid: false }]) },
    { name: 'already valid', before: estimateState([['home-size', '2-bedroom'], ['move-date', '2026-10-20']], [{ valid: true }, { valid: true }]) },
  ];
  for (const item of cases) {
    const result = validateEstimateInteraction({
      before: item.before, after: structuredClone(item.before),
      interactions: [{ name: 'home-size-selection', performed: true, valueObserved: true, restored: true }],
      validationObservation:validationObservation(item.before), urlBefore: 'https://preview.example/route/', urlAfter: 'https://preview.example/route/',
    });
    assert.equal(result.status, 'PASS', item.name);
    assert.equal(result.valuesPreserved, true, item.name);
    assert.equal(result.submitActivated, false, item.name);
  }
});

test('candidate estimate GET handoff binds values, route direction, same-origin contact path and observed response',()=>{
  const args={origin:'https://candidate-newpurely.example.workers.dev',routePath:'/calgary-to-montreal-movers/',formAction:'/contact/',formMethod:'get',from:'Calgary, AB',to:'Montreal, QC',homeSize:'2 bedroom',requestMethod:'GET',requestUrl:'https://candidate-newpurely.example.workers.dev/contact/?from=Calgary%2C+AB&to=Montreal%2C+QC&homeSize=2+bedroom',responseUrl:'https://candidate-newpurely.example.workers.dev/contact/?from=Calgary%2C+AB&to=Montreal%2C+QC&homeSize=2+bedroom',responseStatus:200};
  assert.equal(validateEstimateHandoff(args).status,'PASS');
  assert.throws(()=>validateEstimateHandoff({...args,routePath:'/montreal-to-calgary-movers/'}),/route and expected contact request/);
  assert.throws(()=>validateEstimateHandoff({...args,requestMethod:'POST'}),/route and expected contact request/);
  assert.throws(()=>validateEstimateHandoff({...args,responseStatus:500}),/route and expected contact request/);
});

test('safe estimate interaction requires an observed selection and restores every field value', () => {
  const before = estimateState([['home-size', ''], ['move-date', '']], [{ valid: true }, { valid: true }]);
  assert.equal(validateEstimateInteraction({
    before, after: structuredClone(before),
    interactions: [
      { name: 'home-size-selection', performed: true, valueObserved: true, restored: true },
      { name: 'move-date-selection', performed: true, valueObserved: true, restored: true },
    ],
    validationObservation:validationObservation(before), urlBefore: 'https://preview.example/route/', urlAfter: 'https://preview.example/route/',
  }).safeInteractions.length, 2);
  const changed = structuredClone(before); changed.controls[0].value = '3-bedroom';
  assert.throws(() => validateEstimateInteraction({ before, after: changed, validationObservation:validationObservation(changed), interactions: [{ performed: true, valueObserved: true, restored: true }], urlBefore: 'a', urlAfter: 'a' }), /did not return to their original state/);
  assert.throws(() => validateEstimateInteraction({ before, after: structuredClone(before), validationObservation:validationObservation(before), interactions: [], urlBefore: 'a', urlAfter: 'a' }), /did not complete a reversible/);
  assert.throws(() => validateEstimateInteraction({ before, after: structuredClone(before), interactions: [{ performed: true, valueObserved: true, restored: true }], urlBefore: 'a', urlAfter: 'a' }), /validation method evidence/);
  assert.throws(() => validateEstimateInteraction({ before, after: structuredClone(before), validationObservation:{...validationObservation(before),result:!validationObservation(before).result}, interactions: [{ performed: true, valueObserved: true, restored: true }], urlBefore: 'a', urlAfter: 'a' }), /validation method evidence/);
});

test('unsafe estimate submission and mutating requests are rejected before a pass', () => {
  assert.equal(assertNoUnsafeEstimateActivity(), true);
  assert.throws(() => assertNoUnsafeEstimateActivity({ submitAttempts: 1 }), /observed a form submit event/);
  assert.throws(() => assertNoUnsafeEstimateActivity({ blockedMutationRequests: 1 }), /blocked mutating network request/);
  assert.equal(assertNoUnsafeEstimateActivity({ blockedMutationRequests: 1, blockedMutationRequestsBefore: 1 }), true);
  assert.throws(() => assertNoUnsafeEstimateActivity({ blockedMutationRequests: 2, blockedMutationRequestsBefore: 1 }), /blocked mutating network request/);
  assert.throws(() => assertNoUnsafeEstimateActivity({ blockedMutationRequests: 0, blockedMutationRequestsBefore: 1 }), /counters are invalid/);
  const state = estimateState([['home-size', '']], [{ valid: true }]);
  assert.throws(() => validateEstimateInteraction({ before: state, after: structuredClone(state), validationObservation:validationObservation(state), interactions: [{ performed: true, valueObserved: true, restored: true }], urlBefore: 'a', urlAfter: 'a', submitAttempts: 1 }), /observed a form submit event/);
});

test('blocked request diagnostics retain safe request context and redact query values', () => {
  const request = {
    method: () => 'POST',
    url: () => 'https://analytics.example/collect?token=secret&email=person%40example.com',
    resourceType: () => 'fetch',
  };
  const diagnostic = blockedRequestDiagnostic(request, {
    collectorAction: 'estimate-home-size-select',
    initiatorContext: 'https://purelycanadianmovers.com/edmonton-to-ottawa-movers/?customer=private',
    formSubmitEventObserved: false,
  });
  assert.deepEqual(diagnostic, {
    method: 'POST', origin: 'https://analytics.example', path: '/collect', resourceType: 'fetch',
    collectorAction: 'estimate-home-size-select',
    initiatorContext: { origin: 'https://purelycanadianmovers.com', path: '/edmonton-to-ottawa-movers/' },
    formSubmitEventObserved: false,
  });
  assert.doesNotMatch(JSON.stringify(diagnostic), /secret|person|customer|private|token|email/i);
  const pathWithPersonalData = blockedRequestDiagnostic({
    method: () => 'POST', url: () => 'https://api.example/contact/alex%40example.com/6045551234', resourceType: () => 'fetch',
  });
  assert.equal(pathWithPersonalData.path, '/contact/[REDACTED]/[REDACTED]');
  assert.doesNotMatch(JSON.stringify(pathWithPersonalData), /alex|example\.com|6045551234/i);
  assert.throws(() => assertNoUnsafeEstimateActivity({ blockedMutationRequests: 1 }), /blocked mutating network request/);
});

test('only exact production Cloudflare, Google, OpenAI, and Manus analytics POSTs plus preview analytics are non-blocking', () => {
  const rum = classifyBlockedMutationRequest({
    phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST',
    url: 'https://purelycanadianmovers.com/cdn-cgi/rum',
  });
  assert.deepEqual(rum, { classification: 'background-analytics', countsAsEstimateBlock: false });
  for (const url of ['https://analytics.google.com/g/collect?v=2', 'https://www.google.com/g/collect?v=2']) {
    assert.deepEqual(classifyBlockedMutationRequest({ phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url }), { classification: 'background-analytics', countsAsEstimateBlock: false });
  }
  assert.deepEqual(classifyBlockedMutationRequest({ phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://bzr.openai.com/v1/sdk/events' }), { classification: 'background-analytics', countsAsEstimateBlock: false });
  assert.deepEqual(classifyBlockedMutationRequest({ phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://manus-analytics.com/api/send' }), { classification: 'background-analytics', countsAsEstimateBlock: false });
  for (const url of [
    'https://analytics.google.com/g/collect?v=2', 'https://www.google.com/g/collect?v=2',
    'https://manus-analytics.com/api/send', 'https://bzr.openai.com/v1/sdk/events',
  ]) {
    assert.deepEqual(classifyBlockedMutationRequest({ phase: 'preview', origin: 'https://candidate.example.workers.dev', method: 'POST', url }), { classification: 'background-analytics', countsAsEstimateBlock: false });
  }
  assert.equal(assertNoUnsafeEstimateActivity({ submitAttempts: 0, blockedMutationRequests: 0 }), true);
  for (const request of [
    { phase: 'preview', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://purelycanadianmovers.com/cdn-cgi/rum' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://evil.example/cdn-cgi/rum' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://purelycanadianmovers.com/cdn-cgi/rum/extra' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://purelycanadianmovers.com/cdn-cgi/rum-lookalike' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://purelycanadianmovers.com/other?path=/cdn-cgi/rum' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'PATCH', url: 'https://purelycanadianmovers.com/cdn-cgi/rum' },
    { phase: 'preview', origin: 'https://candidate.example.workers.dev', method: 'POST', url: 'https://analytics.google.com/g/collect/extra' },
    { phase: 'preview', origin: 'https://candidate.example.workers.dev', method: 'POST', url: 'https://evil.example/g/collect' },
    { phase: 'preview', origin: 'https://candidate.example.workers.dev', method: 'PATCH', url: 'https://analytics.google.com/g/collect' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://analytics.google.com/g/collect/extra' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://evil.example/g/collect' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://bzr.openai.com/v1/sdk/events-extra' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://bzr.openai.com/v1/sdk/other' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'PUT', url: 'https://bzr.openai.com/v1/sdk/events' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://manus-analytics.com/api/send/extra' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://manus-analytics.com/api/send?x=1' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'GET', url: 'https://manus-analytics.com/api/send' },
    { phase: 'production', origin: 'https://purelycanadianmovers.com', method: 'POST', url: 'https://evil.example/api/send' },
    { phase: 'preview', origin: 'https://candidate.example.workers.dev', method: 'POST', url: 'https://manus-analytics.com/api/send/extra' },
    { phase: 'preview', origin: 'https://candidate.example.workers.dev', method: 'POST', url: 'https://bzr.openai.com/v1/sdk/events-extra' },
    { phase: 'preview', origin: 'https://candidate.example.workers.dev', method: 'GET', url: 'https://manus-analytics.com/api/send' },
  ]) assert.deepEqual(classifyBlockedMutationRequest(request), { classification: 'prohibited-mutating-request', countsAsEstimateBlock: true });
  assert.throws(() => assertNoUnsafeEstimateActivity({ submitAttempts: 1, blockedMutationRequests: 0 }), /form submit event/);
});

test('only a network console error tied to an aborted exact background analytics request is attributed as expected', () => {
  const context = { phase: 'production', origin: 'https://purelycanadianmovers.com', abortedNetworkRequestIds: new Set(['rum-1']) };
  const entry = { source: 'network', level: 'error', text: 'Failed to load resource: net::ERR_FAILED', url: 'https://purelycanadianmovers.com/cdn-cgi/rum', networkRequestId: 'rum-1' };
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError(entry, context), true);
  for (const changed of [
    { ...entry, networkRequestId: 'unknown' },
    { ...entry, source: 'javascript' },
    { ...entry, level: 'warning' },
    { ...entry, text: 'Unrelated page error' },
    { ...entry, url: 'https://purelycanadianmovers.com/cdn-cgi/rum-lookalike' },
    { ...entry, url: 'https://other.example/cdn-cgi/rum' },
  ]) assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError(changed, context), false);
  const googleContext = { phase: 'preview', origin: 'https://candidate.example.workers.dev', abortedNetworkRequestIds: new Set(['ga-1']) };
  const googleEntry = { source: 'network', level: 'error', text: 'Failed to load resource: net::ERR_FAILED', url: 'https://analytics.google.com/g/collect?v=2', networkRequestId: 'ga-1' };
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError(googleEntry, googleContext), true);
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError({ ...googleEntry, networkRequestId: 'unknown' }, googleContext), false);
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError({ ...googleEntry, url: 'https://analytics.google.com/g/collect/extra' }, googleContext), false);
  const productionGoogleContext = { ...googleContext, phase: 'production', origin: 'https://purelycanadianmovers.com' };
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError(googleEntry, productionGoogleContext), true);
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError({ ...googleEntry, url: 'https://analytics.google.com/g/collect/extra' }, productionGoogleContext), false);
  const productionOpenAiEntry = { ...googleEntry, url: 'https://bzr.openai.com/v1/sdk/events', networkRequestId: 'oai-production-1' };
  const productionOpenAiContext = { ...productionGoogleContext, abortedNetworkRequestIds: new Set(['oai-production-1']) };
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError(productionOpenAiEntry, productionOpenAiContext), true);
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError({ ...productionOpenAiEntry, networkRequestId: 'unknown' }, productionOpenAiContext), false);
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError({ ...productionOpenAiEntry, url: 'https://bzr.openai.com/v1/sdk/events-extra' }, productionOpenAiContext), false);
  assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError({ ...productionOpenAiEntry, url: 'https://bzr.openai.com/v1/sdk/events', text: 'Failed to load resource: net::ERR_ABORTED' }, productionOpenAiContext), false);
  for (const [url, requestId] of [
    ['https://manus-analytics.com/api/send', 'umami-1'],
    ['https://manus-analytics.com/api/send', 'prod-umami-1'],
    ['https://bzr.openai.com/v1/sdk/events', 'oai-1'],
  ]) {
    const context = requestId === 'prod-umami-1'
      ? { ...googleContext, phase: 'production', abortedNetworkRequestIds: new Set([requestId]) }
      : { ...googleContext, abortedNetworkRequestIds: new Set([requestId]) };
    assert.equal(isAttributedAbortedBackgroundAnalyticsNetworkError({ ...googleEntry, url, networkRequestId: requestId }, context), true);
  }
});

test('estimate safety ignores earlier blocked page requests but rejects requests blocked during the interaction', () => {
  const before = estimateState([['home-size', '']], [{ valid: true }]);
  const safeArgs = {
    before, after: structuredClone(before),
    validationObservation:validationObservation(before),
    interactions: [{ name: 'home-size-selection', performed: true, valueObserved: true, restored: true }],
    urlBefore: 'https://preview.example/', urlAfter: 'https://preview.example/',
    blockedMutationRequests: 4, blockedMutationRequestsBefore: 4,
  };
  assert.equal(validateEstimateInteraction(safeArgs).status, 'PASS');
  assert.throws(() => validateEstimateInteraction({ ...safeArgs, blockedMutationRequests: 5 }), /blocked mutating network request/);
});

test('estimate collector permits only its explicitly gated same-origin GET and blocks mutating methods', async () => {
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /formButton\.click\(/);
  assert.match(source, /event\.stopImmediatePropagation\(\)/);
  assert.match(source, /__pcmAllowPreviewGetSubmit === true/);
  assert.match(source, /element\.requestSubmit\(\)/);
  assert.match(source, /validateEstimateHandoff\(/);
  assert.match(source, /blockedMutationRequests\+\+/);
  assert.match(source, /export function abortCollectorBlockedRequest\(route\)\s*\{\s*return route\.abort\('aborted'\);/);
  assert.equal((source.match(/abortCollectorBlockedRequest\(route\)/g) ?? []).length, 3, 'both deliberate block paths use CDP Abort behavior');
  assert.doesNotMatch(source, /route\.abort\(\)/, 'no deliberate block falls back to generic Failed');
  assert.match(source, /backgroundAnalyticsRequests\.push\(diagnostic\)/);
  assert.match(source, /diagnosticSession\.on\('Log\.entryAdded'/);
  assert.match(source, /isAttributedAbortedBackgroundAnalyticsNetworkError\(/);
  assert.match(source, /await select\.selectOption\(target\.value\)/);
  assert.match(source, /await dateInput\.fill\(targetValue\)/);
});

test('deliberately blocked analytics and prohibited mutations retain evidence and use explicit aborts', async () => {
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  const analyticsBranch = source.slice(source.indexOf('if (!classification.countsAsEstimateBlock)'), source.indexOf('blockedMutationRequests++'));
  const mutationBranch = source.slice(source.indexOf('blockedMutationRequests++'), source.indexOf('const blockFormSubmit'));
  assert.match(analyticsBranch, /diagnostic\.networkRequestId\s*=\s*requestId/);
  assert.match(analyticsBranch, /abortedRumNetworkRequestIds\.add\(requestId\)/);
  assert.match(analyticsBranch, /backgroundAnalyticsRequests\.push\(diagnostic\)/);
  assert.match(analyticsBranch, /return abortCollectorBlockedRequest\(route\)/);
  assert.match(mutationBranch, /blockedRequestDiagnostics\.push\(diagnostic\)/);
  assert.match(mutationBranch, /return abortCollectorBlockedRequest\(route\)/);
  assert.match(source, /if \(\['GET', 'HEAD'\]\.includes\(request\.method\(\)\)\) return route\.continue\(\)/);
  assert.match(source, /classifyBlockedMutationRequest\(\{ phase, origin: run\.origin, method: request\.method\(\), url: request\.url\(\) \}\)/);
});

test('collector abort sends no prohibited POST and Chromium reports ERR_ABORTED', async (t) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><title>Local abort test</title>');
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  t.after(() => new Promise(done => server.close(done)));
  let receivedPost = false;
  server.on('request', request => { if (request.method === 'POST') receivedPost = true; });
  const playwrightPath = process.env.PLAYWRIGHT_PATH ?? 'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
  const { chromium } = await import(pathToFileURL(playwrightPath).href);
  const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  const origin = `http://127.0.0.1:${server.address().port}`;
  await page.route('**/analytics-block-test', abortCollectorBlockedRequest);
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  const failed = page.waitForEvent('requestfailed');
  await page.evaluate(() => fetch('/analytics-block-test', { method: 'POST', body: 'must-not-reach-server' }).catch(() => undefined));
  const request = await failed;
  assert.equal(request.method(), 'POST');
  assert.equal(request.url(), `${origin}/analytics-block-test`);
  assert.match(request.failure()?.errorText ?? '', /ERR_ABORTED/);
  assert.equal(receivedPost, false, 'blocked POST never reaches the local endpoint');
});

test('isolated production navigation installs request and form guards before first route load', async () => {
  const source = await readFile(new URL('./collect-preview-evidence.mjs', import.meta.url), 'utf8');
  const productionBranch = source.indexOf("if (!cdpEndpoint && phase === 'production')");
  const productionNavigation = source.indexOf('await page.goto(firstRouteUrl, { waitUntil: \'domcontentloaded\' });', productionBranch);
  assert.notEqual(productionBranch, -1);
  assert.notEqual(productionNavigation, -1);
  assert.ok(source.indexOf("await context.route('**/*'") < productionNavigation, 'network request guard must precede production navigation');
  assert.ok(source.indexOf('await page.addInitScript(blockFormSubmit)') < productionNavigation, 'form submit guard must precede production navigation');
  assert.ok(source.indexOf('if (phase === \'preview\')') < source.indexOf("await page.goto(firstRouteUrl, { waitUntil: 'domcontentloaded' });"), 'preview authentication navigation remains supported');
});
