import { createHash, randomUUID } from 'node:crypto';
import { parse } from 'parse5';
import { lstat, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { type as platformName, release as platformRelease } from 'node:os';
import { pageIdentity, deriveSmokePolicy, validateSmoke, versionOrigin, browserCheckAssignments, verifyProductionHtml, expectedPageTitle } from './smoke-evidence.mjs';
import { readAcceptedSelection } from './owner-attested-baseline.mjs';
import { V970_BASELINE_ADOPTION_PROFILE } from './baseline-adoption-profile.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = message => { throw new Error(message); };
const SAFE_PATH = /^\/(?:[A-Za-z0-9._~-]+\/?)*$/;
export const ESTIMATE_FORM_ACTION_NAME = /continue estimate|get written estimate/i;

// Phase 1: assess page overflow separately from explicitly contained pricing tables.
export function assessHorizontalLayout({ viewportWidth, documentScrollWidth, pricingTableContainers = [] }) {
  const defects = [];
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0 || !Number.isFinite(documentScrollWidth)) {
    return { defects: ['Horizontal layout measurements are invalid'], documentOverflow: true };
  }
  const documentOverflow = documentScrollWidth > viewportWidth + 2;
  if (documentOverflow) defects.push('Document exceeds the viewport width');
  for (const container of pricingTableContainers) {
    if (!Number.isFinite(container?.clientWidth) || !Number.isFinite(container?.scrollWidth)
        || !Number.isFinite(container?.tableWidth) || !Number.isFinite(container?.left)
        || !Number.isFinite(container?.right)) {
      defects.push('Pricing table scroll container measurements are invalid');
      continue;
    }
    const tableOverflowsContainer = container.tableWidth > container.clientWidth + 2
      || container.scrollWidth > container.clientWidth + 2;
    if (!tableOverflowsContainer) continue;
    const scrollable = ['auto', 'scroll'].includes(container.overflowX);
    const contained = container.left >= -2 && container.right <= viewportWidth + 2;
    if (!scrollable || !contained) defects.push('Pricing table is not contained in a horizontally scrollable container');
  }
  return { defects, documentOverflow };
}

async function readHorizontalLayout(page) {
  const metrics = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const documentScrollWidth = document.documentElement.scrollWidth;
    const pricingTableContainers = [...document.querySelectorAll('div.overflow-x-auto')]
      .filter(container => container.querySelector(':scope > table'))
      .map(container => {
        const table = container.querySelector(':scope > table');
        const rect = container.getBoundingClientRect();
        return {
          clientWidth: container.clientWidth,
          scrollWidth: container.scrollWidth,
          tableWidth: table.getBoundingClientRect().width,
          overflowX: getComputedStyle(container).overflowX,
          left: rect.left,
          right: rect.right,
        };
      });
    return { width: viewportWidth, height: window.innerHeight, documentScrollWidth,
      titleVisible: Boolean(document.querySelector('h1')?.getBoundingClientRect().width), pricingTableContainers };
  });
  return { ...metrics, ...assessHorizontalLayout(metrics) };
}

// Phase 2: append-only, candidate-bound browser check records support safe resume.
const CHECKPOINT_SCHEMA = 'pcm-browser-checkpoints/v1';
const CHECKPOINT_FILE = 'browser-checkpoints.json';
const checkKey = row => `${row.route}\n${row.name}`;

export async function validateBrowserCheckpoints({ checkpoint, binding, configuration, outputDir, now = Date.now(), maxAgeMinutes = 120 }) {
  if (!checkpoint || checkpoint.schema !== CHECKPOINT_SCHEMA || JSON.stringify(checkpoint.binding) !== JSON.stringify(binding)
      || !configuration || binding.configurationSha256 !== sha256(Buffer.from(JSON.stringify(configuration)))
      || !Array.isArray(checkpoint.checks)) fail('Browser checkpoint binding or schema is invalid');
  const latest = new Map();
  for (const entry of checkpoint.checks) {
    const row = entry?.row, screenshot = entry?.screenshot;
    if (!entry || JSON.stringify(entry.binding) !== JSON.stringify(binding) || !row || typeof row.name !== 'string'
        || !['PASS', 'FAIL'].includes(row.status)
        || typeof row.route !== 'string' || !row.route || !row.viewport
        || row.versionId !== binding.candidateVersionId || row.candidateManifestSha256 !== binding.manifestSha256
        || !configuration.checksByRoute?.[row.route]?.includes(row.name)
        || !Number.isFinite(row.viewport.width) || !Number.isFinite(row.viewport.height)
        || !Array.isArray(row.evidenceFiles) || !row.evidenceFiles.length
        || typeof row.verifiedAtUtc !== 'string' || !Number.isFinite(Date.parse(row.verifiedAtUtc))
        || !screenshot || row.screenshotEvidence?.path !== screenshot.path || row.screenshotEvidence?.sha256 !== screenshot.sha256
        || !row.evidenceFiles.some(ref => ref.path === screenshot.path && ref.sha256 === screenshot.sha256)
        || (row.ownerLayoutReview && (row.ownerLayoutReview.completed !== true
          || !['PASS', 'FAIL'].includes(row.ownerLayoutReview.status) || row.ownerLayoutReview.screenshotSha256 !== screenshot.sha256))
        || typeof screenshot.path !== 'string' || !/\.png$/i.test(screenshot.path) || !/^[a-f0-9]{64}$/i.test(screenshot.sha256 ?? '')) {
      fail('Browser checkpoint contains an incomplete check or screenshot binding');
    }
    const age = now - Date.parse(row.verifiedAtUtc);
    const fresh = age >= 0 && age <= maxAgeMinutes * 60_000;
    for (const ref of row.evidenceFiles) {
      if (typeof ref?.path !== 'string' || !/^[a-f0-9]{64}$/i.test(ref.sha256 ?? '')) fail('Browser checkpoint evidence reference is malformed');
      const file = resolve(ref.path), rel = relative(resolve(outputDir), file);
      if (rel.startsWith('..') || isAbsolute(rel)) fail('Browser checkpoint evidence escapes its output directory');
      try {
        const stat = await lstat(file);
        if (!stat.isFile() || stat.isSymbolicLink() || sha256(await readFile(file)) !== ref.sha256) fail('Browser checkpoint evidence is corrupt or changed');
      } catch (error) {
        if (error.code === 'ENOENT') fail('Browser checkpoint evidence is missing');
        else throw error;
      }
    }
    latest.set(checkKey(row), { row, reusable: fresh && row.status === 'PASS' && !(row.blockingDefects?.length) && !(row.materialErrors?.length) });
  }
  return [...latest.values()].filter(entry => entry.reusable).map(entry => entry.row);
}

export function createBrowserArtifact({ versionId, candidateManifestSha256, origin, riskClassification,
  browserEnvironment, evidenceFiles, routes, tests, backgroundAnalyticsRequests = [], attributedBackgroundAnalyticsErrors = [] }) {
  const status = tests.every(test => test.passed !== false && test.status === 'PASS'
    && !(test.blockingDefects?.length) && !(test.materialErrors?.length)) ? 'PASS' : 'FAIL';
  return { kind: 'browser', versionId, candidateManifestSha256, origin, riskClassification, status,
    verifiedAtUtc: new Date().toISOString(), browserEnvironment, evidenceFiles, routes,
    browserInteractionPerformed: true, tests, backgroundAnalyticsRequests, attributedBackgroundAnalyticsErrors };
}

async function writeCheckpoint(filePath, checkpoint) {
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  const bytes = Buffer.from(JSON.stringify(checkpoint, null, 2) + '\n');
  await writeFile(temporaryPath, bytes, { flag: 'wx' });
  await rename(temporaryPath, filePath);
}

function safePath(path) {
  return SAFE_PATH.test(path) && !path.split('/').some(part => part === '.' || part === '..');
}

export function isAccessLogin(url, bodyText = '') {
  let parsed;
  try { parsed = new URL(url); } catch { return true; }
  return parsed.hostname.endsWith('.cloudflareaccess.com')
    || parsed.pathname.includes('/cdn-cgi/access/login')
    || /<title>[^<]*(?:Access|Sign in|Login)/i.test(bodyText)
    || bodyText.includes('Sign in to PCM');
}

export function validateCdpEndpoint(value) {
  let endpoint;
  try { endpoint = new URL(value); } catch { fail('CDP endpoint must be an explicit localhost URL'); }
  if (endpoint.protocol !== 'http:' || endpoint.hostname !== '127.0.0.1'
      || !endpoint.port || endpoint.username || endpoint.password || endpoint.search || endpoint.hash
      || !['', '/'].includes(endpoint.pathname)) {
    fail('CDP endpoint must be an explicit http://127.0.0.1:<port> endpoint without credentials or extra path');
  }
  const port = Number(endpoint.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) fail('CDP endpoint port is invalid');
  return `http://127.0.0.1:${port}`;
}

export function expectedBrowserTitle({ routePath, baselineTitle, expectedHomepageTitle }) {
  return expectedPageTitle(routePath, baselineTitle, expectedHomepageTitle);
}

export function findStylesheetRoute(routeHtmlEntries, stylesheetPath) {
  if (!Array.isArray(routeHtmlEntries) || !safePath(stylesheetPath)) fail('Stylesheet route evidence is invalid');
  for (const entry of routeHtmlEntries) {
    if (!entry || !safePath(entry.route) || typeof entry.html !== 'string') continue;
    const document = parse(entry.html);
    const links = [];
    const visit = node => {
      if (node.tagName === 'link') links.push(node);
      for (const child of node.childNodes ?? []) visit(child);
    };
    visit(document);
    for (const link of links) {
      const attrs = new Map((link.attrs ?? []).map(attr => [attr.name.toLowerCase(), attr.value]));
      const rel = (attrs.get('rel') ?? '').toLowerCase().split(/\s+/).filter(Boolean);
      if (!rel.includes('stylesheet') || !attrs.has('href')) continue;
      let href;
      try { href = new URL(attrs.get('href'), 'https://candidate.invalid').pathname; } catch { continue; }
      if (href === stylesheetPath) return entry.route;
    }
  }
  return null;
}

export function selectCdpTarget(browser, expectedUrl, phase = 'preview') {
  if (!['preview', 'production'].includes(phase)) fail('Evidence phase must be preview or production');
  if (!browser || typeof browser.contexts !== 'function') fail('CDP browser connection is unavailable');
  const contexts = browser.contexts();
  if (contexts.length !== 1) fail('Dedicated CDP browser must have exactly one browser context');
  const pages = contexts[0].pages();
  if (pages.length !== 1) fail('Dedicated CDP context must have exactly one tab; close unrelated tabs before testing');
  if (pages[0].url() !== expectedUrl) fail(`The only CDP tab is not the exact selected ${phase} route (expected ${safeOriginPath(expectedUrl)}; found ${safeOriginPath(pages[0].url())})`);
  return { context: contexts[0], page: pages[0] };
}

export const selectCdpPreviewTarget = (browser, expectedUrl) => selectCdpTarget(browser, expectedUrl, 'preview');

export async function connectToAuthorizedCdp(chromium, endpoint) {
  if (typeof chromium?.connectOverCDP !== 'function') fail('Playwright CDP connection is unavailable');
  return chromium.connectOverCDP(validateCdpEndpoint(endpoint));
}

export async function disconnectCdp(browser) {
  if (typeof browser?.close !== 'function') fail('CDP browser connection cannot be disconnected safely');
  // Playwright defines close() on a CDP-connected Browser as disconnecting the client.
  return browser.close();
}

export function assertPreviewPageCapabilities(page) {
  for (const method of ['url', 'goto', 'on', 'setViewportSize', 'screenshot', 'locator']) {
    if (typeof page?.[method] !== 'function') fail(`CDP tab cannot provide required browser evidence (${method})`);
  }
}

export function assertNoUnsafeEstimateActivity({ submitAttempts = 0, blockedMutationRequests = 0, blockedMutationRequestsBefore = 0 } = {}) {
  if (!Number.isSafeInteger(submitAttempts) || submitAttempts < 0
      || !Number.isSafeInteger(blockedMutationRequests) || blockedMutationRequests < 0
      || !Number.isSafeInteger(blockedMutationRequestsBefore) || blockedMutationRequestsBefore < 0
      || blockedMutationRequestsBefore > blockedMutationRequests) {
    fail('Estimate safety counters are invalid');
  }
  if (submitAttempts) fail('Estimate interaction observed a form submit event; refusing to pass the smoke check');
  if (blockedMutationRequests > blockedMutationRequestsBefore) fail('Estimate interaction generated a blocked mutating network request; refusing to pass the smoke check');
  return true;
}

function safeDiagnosticUrl(value) {
  try {
    const url = new URL(value);
    const path = url.pathname.split('/').map(segment => {
      let decoded = segment;
      try { decoded = decodeURIComponent(segment); } catch { /* keep the encoded segment for classification */ }
      if (/@|%40|\b(?:email|phone|mobile|customer|token|secret|auth|session|code)\b/i.test(decoded)
          || /\d{7,}/.test(decoded)
          || /^[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}$/.test(decoded)) return '[REDACTED]';
      return segment;
    }).join('/');
    return { origin: url.origin, path };
  } catch {
    return { origin: null, path: null };
  }
}

export function blockedRequestDiagnostic(request, { collectorAction = 'unspecified', initiatorContext = null, formSubmitEventObserved = null } = {}) {
  const target = safeDiagnosticUrl(request?.url?.());
  const initiator = initiatorContext ? safeDiagnosticUrl(initiatorContext) : null;
  return {
    method: String(request?.method?.() ?? 'UNKNOWN').toUpperCase(),
    origin: target.origin,
    path: target.path,
    resourceType: String(request?.resourceType?.() ?? 'unknown'),
    collectorAction: String(collectorAction),
    initiatorContext: initiator,
    formSubmitEventObserved: formSubmitEventObserved === true ? true : formSubmitEventObserved === false ? false : null,
  };
}

export function classifyBlockedMutationRequest({ phase, origin, method, url }) {
  let parsed;
  try { parsed = new URL(url); } catch { parsed = null; }
  const isCloudflareRum = phase === 'production'
    && String(method).toUpperCase() === 'POST'
    && parsed?.origin === origin
    && parsed?.pathname === '/cdn-cgi/rum'
    && !parsed.search && !parsed.hash;
  const isProductionGoogleAnalytics = phase === 'production'
    && String(method).toUpperCase() === 'POST'
    && ['https://analytics.google.com', 'https://www.google.com'].includes(parsed?.origin)
    && parsed?.pathname === '/g/collect'
    && !parsed.hash;
  const isProductionOpenAiAdsPixel = phase === 'production'
    && String(method).toUpperCase() === 'POST'
    && parsed?.origin === 'https://bzr.openai.com'
    && parsed?.pathname === '/v1/sdk/events'
    && !parsed.hash;
  const isProductionManusAnalytics = phase === 'production'
    && String(method).toUpperCase() === 'POST'
    && parsed?.origin === 'https://manus-analytics.com'
    && parsed?.pathname === '/api/send'
    && !parsed.search && !parsed.hash;
  const isPreviewBackgroundAnalytics = phase === 'preview'
    && String(method).toUpperCase() === 'POST'
    && (
      (['https://analytics.google.com', 'https://www.google.com'].includes(parsed?.origin) && parsed?.pathname === '/g/collect')
      || (parsed?.origin === 'https://manus-analytics.com' && parsed?.pathname === '/api/send')
      || (parsed?.origin === 'https://bzr.openai.com' && parsed?.pathname === '/v1/sdk/events')
    )
    && !parsed.hash;
  return isCloudflareRum || isProductionGoogleAnalytics || isProductionOpenAiAdsPixel || isProductionManusAnalytics || isPreviewBackgroundAnalytics
    ? { classification: 'background-analytics', countsAsEstimateBlock: false }
    : { classification: 'prohibited-mutating-request', countsAsEstimateBlock: true };
}

export function isAttributedAbortedBackgroundAnalyticsNetworkError(entry, { phase, origin, abortedNetworkRequestIds }) {
  if (entry?.source !== 'network' || entry?.level !== 'error'
      || !/net::ERR_FAILED\b/i.test(entry?.text ?? '') || !entry?.networkRequestId
      || !abortedNetworkRequestIds?.has(String(entry.networkRequestId))) return false;
  let parsed;
  try { parsed = new URL(entry.url); } catch { return false; }
  const isCloudflareRum = phase === 'production' && parsed.origin === origin
    && parsed.pathname === '/cdn-cgi/rum' && !parsed.search && !parsed.hash;
  const isProductionGoogleAnalytics = phase === 'production'
    && ['https://analytics.google.com', 'https://www.google.com'].includes(parsed.origin)
    && parsed.pathname === '/g/collect' && !parsed.hash;
  const isProductionOpenAiAdsPixel = phase === 'production'
    && parsed.origin === 'https://bzr.openai.com'
    && parsed.pathname === '/v1/sdk/events' && !parsed.hash;
  const isProductionManusAnalytics = phase === 'production'
    && parsed.origin === 'https://manus-analytics.com'
    && parsed.pathname === '/api/send' && !parsed.search && !parsed.hash;
  const isPreviewBackgroundAnalytics = phase === 'preview' && !parsed.hash && (
    (['https://analytics.google.com', 'https://www.google.com'].includes(parsed.origin) && parsed.pathname === '/g/collect')
    || (parsed.origin === 'https://manus-analytics.com' && parsed.pathname === '/api/send')
    || (parsed.origin === 'https://bzr.openai.com' && parsed.pathname === '/v1/sdk/events')
  );
  return isCloudflareRum || isProductionGoogleAnalytics || isProductionOpenAiAdsPixel || isProductionManusAnalytics || isPreviewBackgroundAnalytics;
}

export function validateEstimateInteraction({ before, after, interactions, validationObservation, urlBefore, urlAfter, submitAttempts = 0, blockedMutationRequests = 0, blockedMutationRequestsBefore = 0 }) {
  assertNoUnsafeEstimateActivity({ submitAttempts, blockedMutationRequests, blockedMutationRequestsBefore });
  if (!before || !after || !Array.isArray(before.controls) || !before.controls.length
      || !Array.isArray(after.controls) || before.controls.length !== after.controls.length) {
    fail('Estimate form fields are missing or changed during safe interaction testing');
  }
  if (before.controls.some(control => !control.visible || !control.accessibleName)) fail('Estimate form contains a hidden or inaccessible field');
  if (JSON.stringify(before.controls) !== JSON.stringify(after.controls)) fail('Estimate form values or controls did not return to their original state');
  if (urlBefore !== urlAfter) fail('Estimate interaction navigated away from the preview route');
  if (!Array.isArray(interactions) || !interactions.some(item => item?.performed && item?.valueObserved && item?.restored)) {
    fail('Estimate form did not complete a reversible, observed field interaction');
  }
  const validity = after.nativeValidity;
  if (!Array.isArray(validity) || !validity.length || validity.some(item => typeof item.valid !== 'boolean' || typeof item.required !== 'boolean' || typeof item.valueMissing !== 'boolean' || typeof item.willValidate !== 'boolean')) fail('Estimate native validity evidence is incomplete');
  if (validationObservation?.method !== 'HTMLFormElement.checkValidity' || typeof validationObservation.result !== 'boolean'
      || !Array.isArray(validationObservation.controls) || JSON.stringify(validationObservation.controls) !== JSON.stringify(validity)
      || validationObservation.result !== validity.filter(item => item.willValidate).every(item => item.valid)) fail('Estimate native validation method evidence is missing or inconsistent');
  return {
    status: 'PASS',
    interactionPerformed: interactions.some(item => item?.performed && item?.valueObserved && item?.restored),
    validationObserved: true,
    validationMethod: validationObservation.method,
    validationResult: validationObservation.result,
    formActionUrl: before.formActionUrl,
    formMethod: before.formMethod,
    formControls: after.controls,
    requiredControlCount: validity.filter(item => item.required).length,
    validationControlEvidence: validationObservation.controls,
    visibleAccessibleFieldCount: before.controls.length,
    safeInteractions: interactions.map(({ name, performed, valueObserved, restored }) => ({ name, performed, valueObserved, restored })),
    valuesPreserved: true,
    nativeValidityObserved: before.nativeValidity,
    submitActivated: false,
    submitAttempts: 0,
    blockedMutationRequests: 0,
  };
}

export function validateEstimateHandoff({origin,routePath,formAction,formMethod,from,to,homeSize,requestMethod,requestUrl,responseUrl,responseStatus}){
  const failHandoff=()=>fail('Estimate GET handoff did not preserve the candidate route and expected contact request');
  let action,request,response;try{action=new URL(formAction,origin);request=new URL(requestUrl);response=new URL(responseUrl);}catch{return failHandoff();}
  const routeMatch=/\/([a-z-]+)-to-([a-z-]+)-movers\/$/i.exec(routePath);
  if(!routeMatch||action.origin!==origin||action.pathname!=='/contact/'||String(formMethod).toUpperCase()!=='GET'
    ||requestMethod!=='GET'||request.origin!==origin||response.href!==request.href||responseStatus!==200
    ||request.pathname!=='/contact/'||request.searchParams.get('from')!==from||request.searchParams.get('to')!==to
    ||request.searchParams.get('homeSize')!==homeSize
    ||!String(from).toLowerCase().startsWith(routeMatch[1].replaceAll('-',' '))
    ||!String(to).toLowerCase().startsWith(routeMatch[2].replaceAll('-',' ')))return failHandoff();
  return {status:'PASS',routeDirection:`${routeMatch[1]}-to-${routeMatch[2]}`,method:'GET',actionUrl:action.href,requestUrl:request.href,responseUrl:response.href,responseStatus};
}

async function inspectEstimateForm(form) {
  return form.evaluate(element => {
    const visible = node => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const controls = [...element.querySelectorAll('input, select, textarea')].filter(node => !['hidden', 'submit', 'button'].includes((node.type || '').toLowerCase()));
    return {
      formActionUrl: element.action,
      formMethod: (element.method || 'get').toUpperCase(),
      controls: controls.map(node => ({
        name: node.name || node.id || node.type || node.tagName.toLowerCase(),
        type: node instanceof HTMLSelectElement ? 'select-one' : ((node.type || 'text').toLowerCase()),
        accessibleName: (node.labels ? [...node.labels].map(label => label.textContent).join(' ').trim() : '')
          || node.getAttribute('aria-label') || node.getAttribute('aria-labelledby') || node.placeholder || '',
        visible: visible(node),
        value: node.value,
        required: node.required,
        ariaRequired: node.getAttribute('aria-required'),
        checked: 'checked' in node ? node.checked : null,
        selectedIndex: node instanceof HTMLSelectElement ? node.selectedIndex : null,
      })),
    nativeValidity: controls.map(node => ({ name: node.name || node.id || node.type || node.tagName.toLowerCase(), valid: node.validity.valid, required: node.required, valueMissing: node.validity.valueMissing, willValidate: node.willValidate, customError: node.validity.customError })),
    };
  });
}

async function exerciseEstimateFormSafely(form, page, expectedUrl, getBlockedMutationRequests, getBlockedRequestDiagnostics, setCollectorAction) {
  const blockedMutationRequestsBefore = getBlockedMutationRequests();
  const blockedRequestDiagnosticsBefore = getBlockedRequestDiagnostics().length;
  const before = await inspectEstimateForm(form);
  if (!before.controls.length || before.controls.some(control => !control.visible || !control.accessibleName)) fail('Estimate form has missing, hidden, or inaccessible fields');
  const interactions = [];
  const select = form.locator('select').first();
  if (await select.count() && await select.isVisible().catch(() => false) && await select.isEnabled().catch(() => false)) {
    const options = await select.locator('option').evaluateAll(nodes => nodes.map((node, index) => ({ value: node.value, disabled: node.disabled, index })));
    const originalIndex = await select.evaluate(node => node.selectedIndex);
    const target = options.find(option => !option.disabled && option.value && option.index !== originalIndex);
    if (target) {
      let valueObserved = false;
      let restored = false;
      try {
        setCollectorAction('estimate-home-size-select');
        await select.selectOption(target.value);
        valueObserved = (await select.inputValue()) === target.value;
      } finally {
        setCollectorAction('estimate-home-size-restore');
        await select.selectOption({ index: originalIndex });
        restored = (await select.evaluate(node => node.selectedIndex)) === originalIndex;
        setCollectorAction('estimate-form-interaction-idle');
      }
      interactions.push({ name: 'home-size-selection', performed: true, valueObserved, restored });
    }
  }

  const dateInput = form.locator('input[type="date"]').first();
  if (await dateInput.count() && await dateInput.isVisible().catch(() => false) && await dateInput.isEnabled().catch(() => false)) {
    const originalValue = await dateInput.inputValue();
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 1);
    const targetValue = `${future.getUTCFullYear()}-${String(future.getUTCMonth() + 1).padStart(2, '0')}-${String(future.getUTCDate()).padStart(2, '0')}`;
    let valueObserved = false;
    let restored = false;
    try {
      setCollectorAction('estimate-move-date-fill');
      await dateInput.fill(targetValue);
      valueObserved = (await dateInput.inputValue()) === targetValue;
    } finally {
      setCollectorAction('estimate-move-date-restore');
      await dateInput.fill(originalValue);
      restored = (await dateInput.inputValue()) === originalValue;
      setCollectorAction('estimate-form-interaction-idle');
    }
    interactions.push({ name: 'move-date-selection', performed: true, valueObserved, restored });
  }

  const validationObservation = await form.evaluate(element => ({
    method: 'HTMLFormElement.checkValidity',
    result: element.checkValidity(),
    controls: [...element.querySelectorAll('input, select, textarea')]
      .filter(node => !['hidden', 'submit', 'button'].includes((node.type || '').toLowerCase()))
      .map(node => ({ name: node.name || node.id || node.type || node.tagName.toLowerCase(), valid: node.validity.valid, required: node.required, valueMissing: node.validity.valueMissing, willValidate: node.willValidate, customError: node.validity.customError })),
  }));
  const after = await inspectEstimateForm(form);
  const submitAttempts = await page.evaluate(() => window.__pcmPreviewSubmitAttempts || 0);
  const blockedMutationRequests = getBlockedMutationRequests();
  try {
    return validateEstimateInteraction({
      before, after, interactions, validationObservation, urlBefore: expectedUrl, urlAfter: page.url(), submitAttempts,
      blockedMutationRequests, blockedMutationRequestsBefore,
    });
  } catch (error) {
    const observedSubmitEvent = submitAttempts > 0;
    const diagnostics = getBlockedRequestDiagnostics().slice(blockedRequestDiagnosticsBefore).map(item => ({ ...item, formSubmitEventObserved: observedSubmitEvent }));
    fail(`${error.message}; diagnostics=${JSON.stringify({ formSubmitEventObserved: observedSubmitEvent, blockedRequestCount: diagnostics.length, blockedRequests: diagnostics })}`);
  }
}

export function beginResponseBodyCapture(response) {
  if (typeof response?.body !== 'function') return Promise.resolve({ body: null, failed: true });
  try {
    // Start reading while the response is current. Chromium may discard the
    // response body after a later navigation when connected over CDP.
    return Promise.resolve(response.body()).then(
      body => ({ body, failed: false }),
      () => ({ body: null, failed: true }),
    );
  } catch {
    return Promise.resolve({ body: null, failed: true });
  }
}

export async function resolveCapturedResponseBody(capture, path) {
  const result = await capture;
  const body = result?.body;
  if (result?.failed) fail(`HTTP response body capture failed: ${path}`);
  if (!Buffer.isBuffer(body) || !body.length) fail(`HTTP response body is missing: ${path}`);
  return body;
}

export async function responseBody(response, path) {
  if (typeof response?.body !== 'function') fail(`HTTP response body capture is unavailable: ${path}`);
  const body = await resolveCapturedResponseBody(beginResponseBodyCapture(response), path);
  if (!Buffer.isBuffer(body) || !body.length) fail(`HTTP response body is missing: ${path}`);
  return body;
}

export async function captureScreenshot(page, options) {
  try { return await page.screenshot(options); }
  catch (error) {
    const message = error?.message ?? '';
    const protocolFailure = /Protocol error \(Page\.captureScreenshot\)/i.test(message);
    const completedFontWait = /Timeout \d+ms exceeded[\s\S]*waiting for fonts to load/i.test(message);
    if (!protocolFailure && !completedFontWait) throw error;
    if (completedFontWait) {
      const fontStatus = await page.evaluate(() => document.fonts.status).catch(() => 'unavailable');
      if (fontStatus !== 'loaded') throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
    return page.screenshot(options);
  }
}

export function sanitizeConsoleMessage(value) {
  return String(value)
    .replace(/https?:\/\/[^\s"'<>]+/gi, input => {
      try { const url = new URL(input); return `${url.origin}${url.pathname}`; } catch { return '[URL REDACTED]'; }
    })
    .replace(/\bBearer\s+[^\s,;]+/gi, 'Bearer [REDACTED]')
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[TOKEN REDACTED]')
    .replace(/\b(password|passwd|token|secret|code|state)=([^&\s]+)/gi, '$1=[REDACTED]');
}

export function isBrowserExtensionDiagnostic(error) {
  const source = `${error?.url ?? ''}\n${error?.stack ?? ''}`;
  return /(?:chrome|edge|moz)-extension:\/\//i.test(source);
}

export function abortCollectorBlockedRequest(route) {
  return route.abort('aborted');
}

export function assertCandidateBinding({ plan, state, manifestBytes, manifest, expectedVersionId, expectedManifestSha256 }) {
  if (plan.schema !== 'pcm-guarded-release-plan/v1' || plan.status !== 'READY_FOR_OWNER_REVIEW') fail('Release plan is not a validated guarded plan');
  if (state.worker !== 'newpurely' || plan.worker !== 'newpurely') fail('Release does not identify Worker newpurely');
  if (state.versionId !== expectedVersionId) fail('Release state does not match the explicitly selected version');
  if (state.stage !== 'UPLOADED_INCOMPLETE_NOT_PROMOTED') fail('Release is not an inactive uploaded candidate');
  if (state.candidatePackage !== plan.candidatePackage || state.candidateManifestPath !== plan.candidateManifestPath || state.productionVersionBeforeUpload !== plan.productionVersion || state.rollbackVersion !== plan.rollbackVersion) fail('Release state does not match the reviewed release plan');
  if (state.candidateManifestSha256 !== expectedManifestSha256 || plan.candidateManifestSha256 !== expectedManifestSha256) fail('Release manifest hash does not match the explicitly selected candidate');
  if (sha256(manifestBytes) !== expectedManifestSha256) fail('Retained candidate manifest hash mismatch');
  const { releasePlanSha256, ...unsignedPlan } = plan;
  if (sha256(Buffer.from(JSON.stringify(unsignedPlan, null, 2) + '\n')) !== releasePlanSha256 || state.releasePlanSha256 !== releasePlanSha256) fail('Release plan integrity check failed');
  const origin = versionOrigin(state.previewUrl, state.versionId);
  if (manifest.schema !== 'pcm-release-candidate-manifest/v1' || !Array.isArray(manifest.files) || !Array.isArray(plan.approvedChanges) || !plan.approvedChanges.length) fail('Candidate manifest or approved change list is incomplete');
  return { origin, versionId: state.versionId, candidateManifestSha256: expectedManifestSha256 };
}

export function productionOrigin() { return 'https://purelycanadianmovers.com'; }

export function assertPromotedProductionBinding({ plan, uploadedState, promotedState, expectedVersionId, expectedManifestSha256 }) {
  if (uploadedState.schema !== 'pcm-guarded-release-state/v1'
      || !['UPLOADED_VERIFIED_NOT_PROMOTED', 'UPLOADED_INCOMPLETE_NOT_PROMOTED'].includes(uploadedState.stage)
      || uploadedState.versionId !== expectedVersionId
      || uploadedState.candidateManifestSha256 !== expectedManifestSha256
      || uploadedState.candidateManifestSha256 !== plan.candidateManifestSha256) fail('Production collection does not match the uploaded candidate state');
  if (promotedState.schema !== 'pcm-guarded-release-state/v1'
      || promotedState.stage !== 'PROMOTED_VERIFIED'
      || promotedState.worker !== 'newpurely'
      || promotedState.versionId !== expectedVersionId
      || promotedState.productionVersionAfterPromotion !== expectedVersionId
      || promotedState.candidateManifestSha256 !== expectedManifestSha256
      || promotedState.candidateManifestSha256 !== plan.candidateManifestSha256
      || promotedState.postPromotionTrafficVerified !== true
      || promotedState.deploymentAuthorization !== 'CONSUMED_FOR_THIS_PROMOTION_ONLY'
      || !/^[a-f0-9]{64}$/i.test(promotedState.promotionAuthorizationSha256 ?? '')
      || promotedState.releasePlanSha256 !== plan.releasePlanSha256
      || resolve(promotedState.candidatePackage ?? '') !== resolve(plan.candidatePackage)
      || resolve(promotedState.candidateManifestPath ?? '') !== resolve(plan.candidateManifestPath)) {
    fail('Production collection requires the exact verified promotion record for this candidate');
  }
  return productionOrigin();
}

export function checkHttpResponse({ path, origin, responseUrl, status, redirected, redirectedFrom, body, expectedSha256, phase = 'preview' }) {
  if (!safePath(path)) fail('Preview probe path is invalid');
  if (!Buffer.isBuffer(body) || !body.length) fail(`HTTP response body is missing: ${path}`);
  const exactUrl = origin + path;
  const text = body.toString('utf8');
  if (isAccessLogin(responseUrl, text)) fail(`Cloudflare Access login was returned for ${path}`);
  if (status !== 200 || responseUrl !== exactUrl || redirected || redirectedFrom) fail(`Preview response was not a direct HTTP 200 for ${path}`);
  const bodySha256 = sha256(body);
  if (phase === 'preview' && expectedSha256 && bodySha256 !== expectedSha256) fail(`Preview response bytes do not match the candidate for ${path}`);
  if (!['preview', 'production'].includes(phase)) fail('Evidence phase must be preview or production');
  const result = { path, url: exactUrl, status, redirected: false, cloudflareAccessLogin: false, bodyBase64: body.toString('base64'), bodySha256 };
  if (phase === 'production') {
    const isHtml = path.endsWith('/') || /\.html?$/i.test(path);
    const compared = expectedSha256 ? verifyProductionHtml(body, expectedSha256, isHtml) : null;
    result.rawResponseSha256 = bodySha256;
    result.comparisonBodySha256 = compared?.comparisonSha256 ?? bodySha256;
    result.cloudflareInsightsBeaconApplied = compared?.cloudflareInsightsBeaconApplied ?? false;
    if (expectedSha256 && !compared) fail(`Production response bytes do not match the candidate for ${path}`);
  }
  return result;
}

export function checkPreviewStylesheetResponse({ resourceType, ...args }) {
  if (resourceType !== 'stylesheet') fail(`Changed CSS was not captured from an actual stylesheet response: ${args.path}`);
  if (args.phase && args.phase !== 'preview') fail('Changed stylesheet response verification is preview-only');
  return { ...checkHttpResponse({ ...args, phase: 'preview' }), resourceType, captureMethod: 'rendered-stylesheet-response' };
}
export function checkProductionStylesheetResponse({ resourceType, ...args }) {
  if (resourceType !== 'stylesheet') fail(`Changed CSS was not captured from an actual stylesheet response: ${args.path}`);
  if (args.phase && args.phase !== 'production') fail('Production stylesheet response verification requires production phase');
  return { ...checkHttpResponse({ ...args, phase: 'production' }), resourceType, captureMethod: 'rendered-stylesheet-response' };
}

export function ensureOutsideCandidate(outputDir, candidatePackage) {
  const rel = relative(resolve(candidatePackage), resolve(outputDir));
  if (rel === '' || (!rel.startsWith('..' + sep) && rel !== '..' && !isAbsolute(rel))) fail('Evidence output must be outside the immutable candidate package');
}

export async function validateCandidateInventory(root, manifest) {
  if (manifest.schema !== 'pcm-release-candidate-manifest/v1' || !Array.isArray(manifest.files)) fail('Candidate manifest is incomplete or has an unknown schema');
  const expected = new Map();
  for (const record of manifest.files) {
    if (typeof record.path !== 'string' || record.path.includes('\\') || record.path.split('/').some(part => !part || part === '.' || part === '..') || !/^[a-f0-9]{64}$/i.test(record.sha256) || !Number.isSafeInteger(record.bytes) || record.bytes < 0 || expected.has(record.path)) fail('Candidate manifest contains an invalid or duplicate file record');
    expected.set(record.path, record);
  }
  const found = new Set();
  async function visit(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const stats = await lstat(absolute);
      if (stats.isSymbolicLink()) fail(`Candidate package contains a symbolic link: ${relativePath}`);
      if (stats.isDirectory()) await visit(absolute, relativePath);
      else if (stats.isFile()) {
        const record = expected.get(relativePath);
        if (!record) fail(`Candidate package contains an unmanifested file: ${relativePath}`);
        const bytes = await readFile(absolute);
        if (bytes.length !== record.bytes || sha256(bytes) !== record.sha256) fail(`Candidate package file differs from its manifest: ${relativePath}`);
        found.add(relativePath);
      } else fail(`Candidate package contains an unsupported file type: ${relativePath}`);
    }
  }
  await visit(resolve(root));
  if (found.size !== expected.size) {
    const missing = [...expected.keys()].filter(path => !found.has(path));
    fail(`Candidate package is missing manifest files: ${missing.slice(0, 5).join(', ')}`);
  }
  return { filesVerified: found.size };
}

function requiredProbePaths(plan, assignments = null, adoptionProfile = null) {
  if (adoptionProfile) return [...new Set([...adoptionProfile.freshHttpRoutes, ...adoptionProfile.pricingRoutes])];
  const paths = [...(assignments?.routes ?? plan.smokeRequirements?.routes ?? ['/'])];
  for (const change of plan.approvedChanges) {
    if (!change.path.startsWith('site-copy/') || change.path === 'site-copy/_redirects') continue;
    paths.push('/' + change.path.slice('site-copy/'.length));
  }
  const result = [...new Set(paths)];
  if (result.some(path => !safePath(path))) fail('A release route or changed asset path is unsafe');
  return result;
}

function manifestFile(manifest, path) { return manifest.files.find(file => file.path === path); }

async function loadRun(runDir, expectedVersionId, expectedManifestSha256, phase = 'preview') {
  const releaseDir = resolve(runDir, 'release');
  const plan = JSON.parse(await readFile(join(releaseDir, 'release-plan.json'), 'utf8'));
  const state = JSON.parse(await readFile(join(releaseDir, 'release-state.json'), 'utf8'));
  const workflow = JSON.parse(await readFile(join(runDir, 'workflow.json'), 'utf8'));
  if (workflow.schema !== 'pcm-guarded-workflow/v1' || !Array.isArray(workflow.verificationFiles)) fail('Prepared source ownership evidence is missing');
  if (!workflow.selection?.path || !isAbsolute(workflow.selection.path) || sha256(await readFile(workflow.selection.path)) !== workflow.selection.sha256) fail('Accepted baseline selection evidence changed');
  const selected = await readAcceptedSelection(workflow.selection.path);
  if (selected.workerVersion !== plan.productionVersion || resolve(selected.baselinePath) !== resolve(plan.baselinePath) || resolve(selected.acceptancePath) !== resolve(plan.acceptancePath)
      || sha256(await readFile(plan.baselinePath)) !== plan.baselineSha256 || sha256(await readFile(plan.acceptancePath)) !== plan.acceptanceSha256) fail('Collector plan does not match the accepted production baseline');
  for (const ref of workflow.verificationFiles) {
    if (!isAbsolute(ref.path)) fail('Prepared source/verification evidence path is invalid');
    const fileStat = await lstat(ref.path);
    if (!fileStat.isFile() || fileStat.isSymbolicLink() || sha256(await readFile(ref.path)) !== ref.sha256) fail('Prepared source/verification evidence changed');
  }
  const manifestBytes = await readFile(plan.candidateManifestPath);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  const binding = assertCandidateBinding({ plan, state, manifestBytes, manifest, expectedVersionId, expectedManifestSha256 });
  let origin = binding.origin;
  if (phase === 'production') {
    const promotedState = JSON.parse(await readFile(join(releaseDir, 'release-state-post-promotion.json'), 'utf8'));
    origin = assertPromotedProductionBinding({ plan, uploadedState: state, promotedState, expectedVersionId, expectedManifestSha256 });
    const promotionAuthorization = await readFile(join(releaseDir, 'promotion-authorization.json'));
    if (sha256(promotionAuthorization) !== promotedState.promotionAuthorizationSha256) fail('Promotion authorization does not match the verified promotion record');
  } else if (phase !== 'preview') fail('Evidence phase must be preview or production');
  const inventory = await validateCandidateInventory(plan.candidatePackage, manifest);
  for (const change of plan.approvedChanges) {
    if (!change.path.startsWith('site-copy/')) fail('This collector supports approved static-site assets only');
    if (change.path.split('/').some(part => part === '.' || part === '..' || !part)) fail('Approved asset path is unsafe');
    const record = manifestFile(manifest, change.path);
    if (!record) fail(`Approved asset is absent from the candidate manifest: ${change.path}`);
    const candidateAsset = resolve(plan.candidatePackage, ...change.path.split('/'));
    const candidateRelative = relative(resolve(plan.candidatePackage), candidateAsset);
    if (candidateRelative.startsWith('..') || isAbsolute(candidateRelative)) fail('Approved asset escapes the candidate package');
    const bytes = await readFile(candidateAsset);
    if (sha256(bytes) !== record.sha256) fail(`Retained candidate asset hash mismatch: ${change.path}`);
  }
  const smokePolicy = await deriveSmokePolicy(plan, workflow.owners);
  return { releaseDir, plan, state, workflow, smokePolicy, manifest, ...binding, origin, ...inventory };
}

function safeOriginPath(value) {
  try { const u = new URL(value); return `${u.origin}${u.pathname}`; } catch { return '[URL unavailable]'; }
}

async function writeHashed(filePath, bytes) {
  await mkdir(dirname(filePath), { recursive: true });
  const digest = sha256(bytes);
  try {
    await writeFile(filePath, bytes, { flag: 'wx' });
    return { path: resolve(filePath), sha256: digest };
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    try {
      if (sha256(await readFile(filePath)) === digest) return { path: resolve(filePath), sha256: digest };
    } catch (readError) { if (readError.code !== 'ENOENT') throw readError; }
    const alternatePath = `${filePath}.${randomUUID()}`;
    await writeFile(alternatePath, bytes, { flag: 'wx' });
    return { path: resolve(alternatePath), sha256: digest };
  }
}

async function prepareEvidenceOutputDir(outputDir) {
  const absolute = resolve(outputDir);
  try { await mkdir(absolute, { recursive: false }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const stat = await lstat(absolute);
  if (!stat.isDirectory() || stat.isSymbolicLink()) fail('Evidence output must be a real directory');
  try { await lstat(join(absolute, 'browser-artifact.json')); fail('A finalized browser artifact already exists in this evidence directory'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  return absolute;
}

async function visibleOwnerReview(rl, label, screenshotPath) {
  const response = await rl.question(`${label}: inspect the visible page and saved screenshot (${screenshotPath}). Enter PASS if no blocking layout defect, or describe a defect: `);
  return response.trim().toUpperCase() === 'PASS' ? [] : [response.trim() || 'Owner did not confirm layout'];
}

async function importPlaywright() {
  const configured = process.env.PCM_PLAYWRIGHT_MODULE;
  const moduleUrl = configured
    ? (configured.startsWith('file:') ? configured : pathToFileURL(resolve(configured)).href)
    : 'file:///C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
  return import(moduleUrl);
}

export async function collectPreviewEvidence({ runDir, outputDir, expectedVersionId, expectedManifestSha256, expectedHomepageTitle, playwright, browserExecutable, cdpEndpoint, phase = 'preview', ask = visibleOwnerReview, baselineAdoptionProfile = null, retainedHttpEvidencePath, historicalPreviewEvidencePath }) {
  if (!['preview', 'production'].includes(phase)) fail('Evidence phase must be preview or production');
  const run = await loadRun(resolve(runDir), expectedVersionId, expectedManifestSha256, phase);
  let adoptionProfile = null;
  if (baselineAdoptionProfile) {
    adoptionProfile = V970_BASELINE_ADOPTION_PROFILE;
    if (baselineAdoptionProfile !== adoptionProfile.id || phase !== 'production'
        || expectedVersionId !== adoptionProfile.versionId || expectedManifestSha256.toLowerCase() !== adoptionProfile.manifestSha256
        || run.plan.worker !== adoptionProfile.worker || run.plan.releasePlanSha256 !== adoptionProfile.releasePlanSha256
        || run.origin !== 'https://purelycanadianmovers.com'
        || !isAbsolute(retainedHttpEvidencePath ?? '') || !isAbsolute(historicalPreviewEvidencePath ?? '')) {
      fail('One-time adoption collector is restricted to the pinned production v970 run and existing historical evidence');
    }
    const planFile = await readFile(join(run.releaseDir, 'release-plan.json'));
    const promotedStateFile = await readFile(join(run.releaseDir, 'release-state-post-promotion.json'));
    if (sha256(planFile) !== adoptionProfile.releasePlanFileSha256 || sha256(promotedStateFile) !== adoptionProfile.releaseStateSha256) {
      fail('One-time adoption collector release records do not match the pinned v970 hashes');
    }
  }
  const absoluteOutputDir = resolve(outputDir);
  ensureOutsideCandidate(absoluteOutputDir, run.plan.candidatePackage);
  const requiredChecks = run.smokePolicy?.checks;
  if (!Array.isArray(requiredChecks) || !requiredChecks.includes('browser') || !requiredChecks.includes('http') || requiredChecks.some(check => !['browser', 'http', 'submission'].includes(check))) fail('Required backend delivery checks need their existing service evidence collector');
  await prepareEvidenceOutputDir(absoluteOutputDir);
  const assignments = adoptionProfile
    ? { routes: [...adoptionProfile.pricingRoutes], byRoute: Object.fromEntries(adoptionProfile.pricingRoutes.map(route => [route, [...adoptionProfile.browserChecks]])), newStaticRoutes: [], pageChecks: [] }
    : browserCheckAssignments(run.plan, run.smokePolicy, run.workflow.owners);
  const routePaths = assignments.routes;
    const testRows = [];
    const submissionRows = [];
  const evidenceFiles = [];
  const probes = [];
  const browserErrors = [];
  const timestamp = () => new Date().toISOString();
  const { chromium } = playwright;
  if (!chromium?.launch || (cdpEndpoint && !chromium.connectOverCDP)) fail('Playwright Chromium launch or CDP support is unavailable');

  const executablePath = browserExecutable ?? process.env.PCM_BROWSER_EXECUTABLE ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = cdpEndpoint
    ? await connectToAuthorizedCdp(chromium, cdpEndpoint)
    : await chromium.launch({ headless: false, executablePath });
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const firstRouteUrl = run.origin + routePaths[0];
    let context, page;
    if (cdpEndpoint) {
      ({ context, page } = selectCdpTarget(browser, firstRouteUrl, phase));
      assertPreviewPageCapabilities(page);
    } else {
      context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
      page = await context.newPage();
      // Preview requires Access authentication before guards are installed; production must
      // install the existing request/form guards before its first navigation.
      if (phase === 'preview') {
        await page.goto(firstRouteUrl, { waitUntil: 'domcontentloaded' });
        stdout.write('\nA visible browser is open at the protected preview. Complete Cloudflare Access sign-in in that browser only. Do not enter credentials in this terminal. Return here and press Enter after the exact preview route loads.\n');
        await rl.question('Press Enter after the preview page has loaded: ');
      }
    }

    // Block mutating requests and stop form submits before page handlers can advance the estimate flow.
    let blockedMutationRequests = 0;
    const blockedRequestDiagnostics = [];
    const backgroundAnalyticsRequests = [];
    const attributedBackgroundAnalyticsErrors = [];
    const pendingNetworkRumRequestIds = [];
    const rumDiagnosticsAwaitingNetworkId = [];
    const abortedRumNetworkRequestIds = new Set();
    const rumDiagnosticByNetworkRequestId = new Map();
    let collectorAction = 'page-loaded';
    let activeRoutePath = routePaths[0];
    const diagnosticSession = await context.newCDPSession(page);
    await diagnosticSession.send('Network.enable');
    await diagnosticSession.send('Log.enable');
    diagnosticSession.on('Network.requestWillBeSent', event => {
      if (!classifyBlockedMutationRequest({ phase, origin: run.origin, method: event.request.method, url: event.request.url }).countsAsEstimateBlock) {
        const diagnostic = rumDiagnosticsAwaitingNetworkId.shift();
        const requestId = String(event.requestId);
        if (diagnostic) {
          diagnostic.networkRequestId = requestId;
          abortedRumNetworkRequestIds.add(requestId);
          rumDiagnosticByNetworkRequestId.set(requestId, diagnostic);
        } else pendingNetworkRumRequestIds.push(requestId);
      }
    });
    diagnosticSession.on('Log.entryAdded', ({ entry }) => {
      if (entry.level !== 'error') return;
      if (isAttributedAbortedBackgroundAnalyticsNetworkError(entry, { phase, origin: run.origin, abortedNetworkRequestIds: abortedRumNetworkRequestIds })) {
        const diagnostic = rumDiagnosticByNetworkRequestId.get(String(entry.networkRequestId));
        attributedBackgroundAnalyticsErrors.push({
          source: entry.source,
          message: sanitizeConsoleMessage(entry.text),
          request: { method: diagnostic?.method ?? 'POST', origin: diagnostic?.origin ?? run.origin, path: diagnostic?.path ?? '/cdn-cgi/rum' },
          networkRequestId: String(entry.networkRequestId),
          route: diagnostic?.route ?? activeRoutePath,
          classification: 'expected-aborted-background-analytics',
        });
        return;
      }
      const diagnostic = { type: 'console', message: sanitizeConsoleMessage(entry.text) };
      if (!isBrowserExtensionDiagnostic({ url: entry.url })) browserErrors.push(diagnostic);
    });
    await context.route('**/*', route => {
      const request = route.request();
      if (['GET', 'HEAD'].includes(request.method())) return route.continue();
      let initiatorContext = null;
      try { initiatorContext = request.frame().url(); } catch { /* service worker or detached frame */ }
      const classification = classifyBlockedMutationRequest({ phase, origin: run.origin, method: request.method(), url: request.url() });
      const diagnostic = { ...blockedRequestDiagnostic(request, { collectorAction, initiatorContext }), ...classification, blocked: true };
      if (!classification.countsAsEstimateBlock) {
        const requestId = pendingNetworkRumRequestIds.shift();
        if (requestId) {
          diagnostic.networkRequestId = requestId;
          abortedRumNetworkRequestIds.add(requestId);
          rumDiagnosticByNetworkRequestId.set(requestId, diagnostic);
        } else rumDiagnosticsAwaitingNetworkId.push(diagnostic);
        diagnostic.route = activeRoutePath;
        backgroundAnalyticsRequests.push(diagnostic);
        return abortCollectorBlockedRequest(route);
      }
      blockedMutationRequests++;
      blockedRequestDiagnostics.push(diagnostic);
      return abortCollectorBlockedRequest(route);
    });
    const blockFormSubmit = () => {
      window.__pcmPreviewSubmitAttempts = 0;
      document.addEventListener('submit', event => {
        if (window.__pcmAllowPreviewGetSubmit === true && String(event.target?.method ?? '').toUpperCase() === 'GET') {
          window.__pcmAllowPreviewGetSubmit = false;
          return;
        }
        window.__pcmPreviewSubmitAttempts++;
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
    };
    await page.addInitScript(blockFormSubmit);
    await page.evaluate(blockFormSubmit);
    page.on('pageerror', error => {
      const diagnostic = { type: 'pageerror', message: sanitizeConsoleMessage(error.message), stack: error.stack };
      if (!isBrowserExtensionDiagnostic(diagnostic)) browserErrors.push({ type: 'pageerror', message: sanitizeConsoleMessage(error.message) });
    });

    const changedStylesheetPaths = new Set(run.plan.approvedChanges
      .map(change => change.path)
      .filter(path => path.startsWith('site-copy/') && /\.css$/i.test(path))
      .map(path => '/' + path.slice('site-copy/'.length)));
    const stylesheetResponses = new Map();
    if (changedStylesheetPaths.size) {
      page.on('response', response => {
        let path;
        try { path = new URL(response.url()).pathname; } catch { return; }
        if (changedStylesheetPaths.has(path) && response.request().resourceType() === 'stylesheet') {
          stylesheetResponses.set(path, { response, bodyCapture: beginResponseBodyCapture(response) });
        }
      });
      // Capture the approved CSS as the browser actually loads it from a route
      // whose retained candidate HTML references that stylesheet. Navigating to
      // the CSS URL as a document can change its bytes through text decoding.
      for (const path of changedStylesheetPaths) {
        const routeHtmlEntries = await Promise.all(routePaths.map(async route => {
          const candidatePath = route === '/' ? 'site-copy/index.html' : `site-copy${route}${route.endsWith('/') ? 'index.html' : ''}`;
          const htmlPath = resolve(run.plan.candidatePackage, ...candidatePath.split('/'));
          return { route, html: await readFile(htmlPath, 'utf8') };
        }));
        const sourceRoute = findStylesheetRoute(routeHtmlEntries, path);
        if (!sourceRoute) fail(`No required preview route references the changed stylesheet ${path}`);
        await page.goto(run.origin + sourceRoute, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(expected => [...document.styleSheets].some(sheet => sheet.href === expected), run.origin + path, { timeout: 15000 });
        if (!stylesheetResponses.has(path)) fail(`No actual stylesheet response was captured from the rendered route for ${path}`);
      }
      await page.goto(firstRouteUrl, { waitUntil: 'domcontentloaded' });
    }

    if (!cdpEndpoint && phase === 'production') {
      await page.goto(firstRouteUrl, { waitUntil: 'domcontentloaded' });
      stdout.write('\nA visible browser is open at the public production route. Do not enter credentials in this terminal. Return here and press Enter after the exact production route loads.\n');
      await rl.question('Press Enter after the production page has loaded: ');
    }
    if (page.url() !== firstRouteUrl) fail(`Owner authentication did not return to the exact ${phase} route (${safeOriginPath(page.url())})`);
    const firstTitle = await page.title();
    if (/sign in|access/i.test(firstTitle)) fail('Cloudflare Access sign-in page is not route evidence');

    const browserEnvironment = { browser: 'Chromium', version: browser.version(), platform: `${platformName()} ${platformRelease()} (${process.arch})` };
    const checksByRoute = Object.fromEntries(routePaths.map(route => [route, [
      ...(assignments.byRoute[route] ?? []), ...(assignments.newStaticRoutes.includes(route) ? assignments.pageChecks : []),
    ]]));
    const verificationConfiguration = {
      phase, origin: run.origin, riskClassification: run.smokePolicy.classification,
      verificationScopeSha256: run.smokePolicy.verificationScope?.scopeSha256 ?? null,
      routes: assignments.routes, checksByRoute,
      viewports: { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } },
      browserEnvironment,
    };
    const binding = {
      candidateVersionId: run.versionId, manifestSha256: run.candidateManifestSha256,
      configurationSha256: sha256(Buffer.from(JSON.stringify(verificationConfiguration))),
    };
    const checkpointPath = join(absoluteOutputDir, CHECKPOINT_FILE);
    let checkpoint = { schema: CHECKPOINT_SCHEMA, binding, checks: [] };
    try {
      const stat = await lstat(checkpointPath);
      if (!stat.isFile() || stat.isSymbolicLink()) fail('Browser checkpoint must be a regular file');
      checkpoint = JSON.parse(await readFile(checkpointPath, 'utf8'));
      if (checkpoint?.binding?.candidateVersionId !== binding.candidateVersionId
          || checkpoint?.binding?.manifestSha256 !== binding.manifestSha256) {
        fail('Browser checkpoints belong to a different candidate version or manifest');
      }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const resumedRows = await validateBrowserCheckpoints({ checkpoint, binding, configuration: verificationConfiguration, outputDir: absoluteOutputDir,
      maxAgeMinutes: run.smokePolicy.maxAgeMinutes });
    testRows.push(...resumedRows);
    for (const row of resumedRows) for (const ref of row.evidenceFiles) {
      if (!evidenceFiles.some(existing => existing.path === ref.path)) evidenceFiles.push(ref);
    }
    const hasCheck = (routePath, name) => testRows.some(row => row.route === routePath && row.name === name);
    const recordCheck = async row => {
      if (!row?.screenshotEvidence || !row.viewport || !Number.isFinite(row.viewport.width) || !Number.isFinite(row.viewport.height)) {
        fail('Completed browser check lacks a viewport or screenshot binding');
      }
      if (!row.evidenceFiles.some(ref => ref.path === row.screenshotEvidence.path && ref.sha256 === row.screenshotEvidence.sha256)) {
        fail('Completed browser check screenshot is missing from its evidence references');
      }
      testRows.push(row);
      checkpoint.checks.push({ binding, row, screenshot: row.screenshotEvidence });
      await writeCheckpoint(checkpointPath, checkpoint);
    };
    if (requiredChecks.includes('submission')) {
      for (const row of resumedRows.filter(item => item.name === 'estimate-form' && item.status === 'PASS' && item.getHandoffObserved)) {
        if (!row.submissionEvidenceFile) fail('Resumed estimate check lacks its submission screenshot evidence');
        submissionRows.push({ ...row, name: 'estimate-get-handoff', method: row.handoff?.method,
          expectedResponseObserved: true, evidenceFiles: [row.submissionEvidenceFile] });
      }
    }

    const paths = requiredProbePaths(run.plan, assignments, adoptionProfile);
    for (const path of paths) {
      const stylesheetPath = changedStylesheetPaths.has(path);
      let response, body;
      if (stylesheetPath) {
        const captured = stylesheetResponses.get(path);
        if (!captured) fail(`No actual stylesheet response was captured from the rendered route for ${path}`);
        response = captured.response;
        body = await resolveCapturedResponseBody(captured.bodyCapture, path);
      } else {
        const url = run.origin + path;
        response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        if (!response) fail(`No HTTP response was captured for ${path}`);
        body = await responseBody(response, path);
      }
      const candidatePath = path.endsWith('/') ? `site-copy${path}index.html` : `site-copy${path}`;
      const record = manifestFile(run.manifest, candidatePath);
      const responseArgs = {
        path,
        origin: run.origin,
        responseUrl: response.url(),
        status: response.status(),
        redirected: response.request().redirectedFrom() !== null,
        redirectedFrom: response.request().redirectedFrom() !== null,
        body,
        expectedSha256: record?.sha256,
        phase,
      };
      const probe = stylesheetPath
        ? phase === 'production'
          ? checkProductionStylesheetResponse({ ...responseArgs, resourceType: response.request().resourceType() })
          : checkPreviewStylesheetResponse({ ...responseArgs, resourceType: response.request().resourceType() })
        : checkHttpResponse(responseArgs);
      const bodyFile = await writeHashed(join(outputDir, `http-${sha256(Buffer.from(path)).slice(0, 12)}${stylesheetPath ? '.css' : '.html'}`), body);
      probes.push({ ...probe, bodyEvidencePath: bodyFile.path, bodyEvidenceSha256: bodyFile.sha256, verifiedAtUtc: timestamp() });
    }

    for (const routePath of routePaths) {
      activeRoutePath = routePath;
      const routeChecks = assignments.byRoute[routePath] ?? [];
      const isNewStaticPage = assignments.newStaticRoutes.includes(routePath);
      const expectedNames = [...routeChecks, ...(isNewStaticPage ? assignments.pageChecks : [])];
      if (expectedNames.length && expectedNames.every(name => hasCheck(routePath, name))) continue;
      const routeUrl = run.origin + routePath;
      const response = await page.goto(routeUrl, { waitUntil: 'domcontentloaded' });
      if (!response || response.status() !== 200 || response.url() !== routeUrl || response.request().redirectedFrom()) fail(`Browser route did not load directly: ${routePath}`);
      const savedIdentity = testRows.find(row => row.route === routePath && ['page-title', 'page-h1'].includes(row.name))?.screenshotEvidence;
      const identityPath = join(outputDir, `identity-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`);
      const identityFile = savedIdentity ?? await writeHashed(identityPath, await captureScreenshot(page, { fullPage: false }));
      if (!evidenceFiles.some(ref => ref.path === identityFile.path)) evidenceFiles.push(identityFile);
      const expectedPath = routePath === '/' ? 'site-copy/index.html' : `site-copy${routePath}${routePath.endsWith('/') ? 'index.html' : ''}`;
      const expectedBytes = await readFile(join(run.plan.candidatePackage, ...expectedPath.split('/')));
      const expected = pageIdentity(expectedBytes.toString('utf8'));
      const actualTitle = await page.title();
      const actualH1s = await page.locator('h1').allTextContents();
      const actualH1 = actualH1s.length === 1 ? actualH1s[0].replace(/\s+/g, ' ').trim() : '';
      const env = { browser: 'Chromium', version: browser.version(), platform: `${platformName()} ${platformRelease()} (${process.arch})` };
      let currentViewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
      const row = (name, extra, file = identityFile) => {
        const screenshotEvidence = /\.png$/i.test(file.path) ? file : identityFile;
        const refs = [identityFile, file, extra.submissionEvidenceFile].filter(ref => ref?.path && ref?.sha256)
          .filter((ref, index, all) => all.findIndex(item => item.path === ref.path) === index);
        return { name, route: routePath, url: routeUrl, status: 'PASS', versionId: run.versionId,
          candidateManifestSha256: run.candidateManifestSha256, verifiedAtUtc: timestamp(), browserEnvironment: env,
          viewport: extra.viewport ?? currentViewport, evidenceFiles: refs, screenshotEvidence,
          ...extra };
      };
      const expectedTitle = expectedBrowserTitle({ routePath, baselineTitle: expected.title, expectedHomepageTitle });
      const titlePassed = actualTitle === expectedTitle && Boolean(expectedTitle);
      const h1Passed = actualH1 === expected.h1 && Boolean(expected.h1);
      if (routeChecks.includes('page-title') && !hasCheck(routePath, 'page-title')) await recordCheck(row('page-title', { status: titlePassed ? 'PASS' : 'FAIL', expected: expectedTitle, actual: actualTitle, passed: titlePassed }));
      if (routeChecks.includes('page-h1') && !hasCheck(routePath, 'page-h1')) await recordCheck(row('page-h1', { status: h1Passed ? 'PASS' : 'FAIL', actual: actualH1, passed: h1Passed }));

      if (isNewStaticPage) {
        if (!hasCheck(routePath, 'illustration-rendered')) {
          const illustration = page.locator('svg[role="img"]');
          const illustrationCount = await illustration.count();
          let illustrationData = { visible: false, width: 0, height: 0, accessible: false };
          if (illustrationCount === 1) {
            illustrationData = await illustration.evaluate(element => {
              const rect = element.getBoundingClientRect();
              const labels = (element.getAttribute('aria-labelledby') ?? '').split(/\s+/).filter(Boolean);
              const accessible = labels.length > 0 && labels.every(id => document.getElementById(id)?.textContent?.trim());
              return { visible: rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden', width: rect.width, height: rect.height, accessible };
            });
          }
          const illustrationShot = await writeHashed(join(outputDir, `illustration-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(illustrationShot);
          await recordCheck(row('illustration-rendered', { ...illustrationData, status: illustrationCount === 1 && illustrationData.visible && illustrationData.accessible ? 'PASS' : 'FAIL' }, illustrationShot));
        }

        if (!hasCheck(routePath, 'charity-link')) {
          const charityLink = page.locator('a[href="https://christmasbureau.com/"]');
          const charityLinkCount = await charityLink.count();
          const linkVisible = charityLinkCount === 1 && await charityLink.isVisible().catch(() => false);
          const linkTarget = charityLinkCount === 1 ? await charityLink.getAttribute('target') : null;
          const linkRel = charityLinkCount === 1 ? (await charityLink.getAttribute('rel') ?? '').split(/\s+/) : [];
          await recordCheck(row('charity-link', { status: linkVisible && linkTarget === '_blank' && linkRel.includes('noopener') && linkRel.includes('noreferrer') ? 'PASS' : 'FAIL', href: charityLinkCount === 1 ? await charityLink.getAttribute('href') : null, visible: linkVisible, target: linkTarget, rel: linkRel }));
        }
        if (!hasCheck(routePath, 'candidate-content')) {
          const candidatePath = `site-copy${routePath}index.html`;
          const candidateFile = manifestFile(run.manifest, candidatePath);
          const routeProbe = probes.find(probe => probe.path === routePath);
          const responseBytes = routeProbe?.bodyEvidencePath ? await readFile(routeProbe.bodyEvidencePath) : Buffer.alloc(0);
          const actualSha256 = sha256(responseBytes);
          await recordCheck(row('candidate-content', { status: candidateFile && actualSha256 === candidateFile.sha256 ? 'PASS' : 'FAIL', actualSha256, expectedSha256: candidateFile?.sha256 ?? null }));
        }
      }

      let navigation = null;
      if (routeChecks.includes('navigation') && !hasCheck(routePath, 'navigation')) {
        const links = await page.locator('a[href]').all();
        for (const link of links) {
          const href = await link.getAttribute('href');
          if (!href) continue;
          if ((await link.getAttribute('target'))?.toLowerCase() === '_blank') continue;
          let destination; try { destination = new URL(href, routeUrl); } catch { continue; }
          if (destination.origin !== run.origin || destination.href === routeUrl || destination.hash) continue;
          if (!(await link.isVisible().catch(() => false))) continue;
          navigation = { link, href: destination.href }; break;
        }
      }
      if (routeChecks.includes('navigation') && !hasCheck(routePath, 'navigation')) {
        if (!navigation) fail(`No visible same-origin navigation link exists on ${routePath}`);
        await navigation.link.click();
        if (page.url() !== navigation.href) {
          await page.waitForFunction(expected => location.href === expected, navigation.href, { timeout: 15000 });
        }
        const navigationOk = page.url() === navigation.href && new URL(page.url()).origin === run.origin;
        const navScreenshot = await writeHashed(join(outputDir, `navigation-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(navScreenshot);
        await recordCheck(row('navigation', { status: navigationOk ? 'PASS' : 'FAIL', navigationSucceeded: navigationOk, destinationUrl: page.url() }, navScreenshot));
        await page.goto(routeUrl, { waitUntil: 'domcontentloaded' });
      }

      if (routeChecks.includes('changed-content') && !hasCheck(routePath, 'changed-content')) {
        const expectedChange = run.smokePolicy.riskAssessment?.content;
        let observed = {};
        if (expectedChange?.kind === 'footer-link-added') {
          const exact = page.locator(`footer a[href="${expectedChange.href}"]`);
          if (await exact.count() !== 1) fail(`Expected changed footer link is missing or duplicated on ${routePath}`);
          const actualLabel = (await exact.textContent())?.replace(/\s+/g, ' ').trim() ?? '';
          const target = await exact.getAttribute('target'), rel = (await exact.getAttribute('rel') ?? '').split(/\s+/);
          if (actualLabel !== expectedChange.label || target !== '_blank' || !rel.includes('noopener') || !rel.includes('noreferrer') || !(await exact.isVisible())) fail(`Changed footer link does not match approved destination or accessibility requirements on ${routePath}`);
          await exact.scrollIntoViewIfNeeded();
          observed = { changedContentObserved: true, observedHref: await exact.getAttribute('href'), observedLabel: actualLabel };
        } else if (expectedChange?.kind === 'static-text-updated') {
          const changes = expectedChange.changes ?? [expectedChange];
          const observedTexts = [];
          for (const change of changes) {
            const exact = page.getByText(change.after, { exact: true });
            if (await exact.count() !== 1 || !(await exact.isVisible())) fail(`Expected changed text is missing or duplicated on ${routePath}`);
            await exact.scrollIntoViewIfNeeded();
            observedTexts.push(change.after);
          }
          observed = changes.length === 1
            ? { changedContentObserved: true, observedText: observedTexts[0] }
            : { changedContentObserved: true, observedTexts };
        } else fail('Verified low-risk change has no supported content assertion');
        const contentShot = await writeHashed(join(outputDir, `changed-content-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(contentShot);
        await recordCheck(row('changed-content', observed, contentShot));
      }

      if (routeChecks.includes('estimate-form') && !hasCheck(routePath, 'estimate-form')) {
        const form = page.locator('form').filter({ has: page.getByRole('button', { name: ESTIMATE_FORM_ACTION_NAME }) }).first();
        try { await form.waitFor({ state: 'attached', timeout: 5000 }); }
        catch { fail(`Estimate form control is missing on ${routePath}`); }
        collectorAction = 'estimate-form-interaction';
        const estimateResult = await exerciseEstimateFormSafely(form, page, routeUrl, () => blockedMutationRequests, () => blockedRequestDiagnostics, action => { collectorAction = action; });
        collectorAction = 'estimate-form-interaction-complete';
        const formScreenshot = await writeHashed(join(outputDir, `estimate-form-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(formScreenshot);
        let handoffDetails = {};
        let submissionEvidence = null;
        if (requiredChecks.includes('submission')) {
          const action = await form.getAttribute('action'), method = await form.getAttribute('method') ?? 'GET';
          const from = await form.locator('[name="from"]').inputValue(), to = await form.locator('[name="to"]').inputValue();
          const homeSizeControl = form.locator('[name="homeSize"]');
          if (!(await homeSizeControl.inputValue())) await homeSizeControl.selectOption({ index: 1 });
          const homeSize = await homeSizeControl.inputValue();
          await page.evaluate(() => { window.__pcmAllowPreviewGetSubmit = true; });
          const handoffResponse = await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
            form.evaluate(element => element.requestSubmit()),
          ]).then(([response]) => response);
          if (!handoffResponse) fail(`Estimate form produced no GET response on ${routePath}`);
          const handoff = validateEstimateHandoff({ origin: run.origin, routePath, formAction: action, formMethod: method, from, to, homeSize, requestMethod: handoffResponse.request().method(), requestUrl: handoffResponse.request().url(), responseUrl: handoffResponse.url(), responseStatus: handoffResponse.status() });
          handoffDetails = { getHandoffObserved: true, formValues: { from, to, homeSize }, handoff };
          submissionEvidence = await writeHashed(join(outputDir, `submission-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(submissionEvidence);
        }
        const estimateRow = row('estimate-form', { ...estimateResult, ...handoffDetails,
          ...(submissionEvidence ? { submissionEvidenceFile: submissionEvidence } : {}) }, formScreenshot);
        await recordCheck(estimateRow);
        if (requiredChecks.includes('submission')) {
          submissionRows.push({ ...estimateRow, name: 'estimate-get-handoff', method: handoffDetails.handoff.method, expectedResponseObserved: true, evidenceFiles: [{ path: submissionEvidence.path, sha256: submissionEvidence.sha256 }] });
          await page.goto(routeUrl, { waitUntil: 'domcontentloaded' });
        }
      }

      if (routeChecks.includes('chatbot-input') && !hasCheck(routePath, 'chatbot-input')) {
        const chatButton = page.getByRole('button', { name: /open chat assistant/i });
        await page.evaluate(() => {
          const estimate = document.querySelector('#estimate');
          const targetTop = estimate
            ? estimate.getBoundingClientRect().bottom + window.scrollY + 32
            : document.body.scrollHeight;
          window.scrollTo({ top: targetTop, behavior: 'instant' });
        });
        await chatButton.waitFor({ state: 'visible', timeout: 10000 });
        await page.waitForFunction(() => {
          const button = document.querySelector('button[aria-label="Open chat assistant"]');
          if (!button) return false;
          const style = getComputedStyle(button);
          const rect = button.getBoundingClientRect();
          return !button.disabled && style.display !== 'none' && style.visibility === 'visible'
            && style.pointerEvents !== 'none' && rect.width > 0 && rect.height > 0;
        }, undefined, { timeout: 10000 });
        await chatButton.click();
        const inputCandidates = await page.locator('textarea, input[type="text"], [contenteditable="true"]').all();
        let chatInput;
        for (const candidate of inputCandidates) if (await candidate.isVisible().catch(() => false)) chatInput = candidate;
        if (!chatInput) fail(`Chatbot input did not open on ${routePath}`);
        await chatInput.fill('preview smoke test');
        const accepted = (await chatInput.getAttribute('value').catch(() => null)) === 'preview smoke test'
          || (await chatInput.textContent()) === 'preview smoke test'
          || await chatInput.evaluate(element => element.value === 'preview smoke test' || element.textContent === 'preview smoke test');
        const chatScreenshot = await writeHashed(join(outputDir, `chatbot-input-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(chatScreenshot);
        await chatInput.fill('');
        await recordCheck(row('chatbot-input', { status: accepted ? 'PASS' : 'FAIL', opened: true, textInputAccepted: Boolean(accepted), messageSent: false, requestSubmissionBlocked: true }, chatScreenshot));
      }

      if (routeChecks.includes('desktop-layout') && !hasCheck(routePath, 'desktop-layout')) {
        await page.goto(routeUrl, { waitUntil: 'domcontentloaded' });
        await page.setViewportSize({ width: 1440, height: 900 });
        currentViewport = { width: 1440, height: 900 };
        await page.evaluate(() => document.fonts.ready);
        const desktopMetrics = await readHorizontalLayout(page);
        const desktopShot = await writeHashed(join(outputDir, `desktop-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(desktopShot);
        const desktopDefects = [];
        desktopDefects.push(...desktopMetrics.defects);
        if (!desktopMetrics.titleVisible) desktopDefects.push('Missing visible page heading');
        const ownerDefects = await ask(rl, 'Desktop layout review', desktopShot.path);
        desktopDefects.push(...ownerDefects);
        await recordCheck(row('desktop-layout', { status: desktopDefects.length ? 'FAIL' : 'PASS', viewport: { width: desktopMetrics.width, height: desktopMetrics.height }, documentScrollWidth: desktopMetrics.documentScrollWidth, pricingTableContainers: desktopMetrics.pricingTableContainers, ownerLayoutReview: { completed: true, status: ownerDefects.length ? 'FAIL' : 'PASS', screenshotSha256: desktopShot.sha256 }, blockingDefects: desktopDefects }, desktopShot));
      }

      if (routeChecks.includes('mobile-layout') && !hasCheck(routePath, 'mobile-layout')) {
        await page.setViewportSize({ width: 390, height: 844 });
        currentViewport = { width: 390, height: 844 };
        await page.goto(routeUrl, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts.ready);
        const mobileMetrics = await readHorizontalLayout(page);
        const mobileShot = await writeHashed(join(outputDir, `mobile-${sha256(Buffer.from(routePath)).slice(0, 12)}.png`), await captureScreenshot(page, { fullPage: false })); evidenceFiles.push(mobileShot);
        const mobileDefects = [];
        mobileDefects.push(...mobileMetrics.defects);
        if (!mobileMetrics.titleVisible) mobileDefects.push('Missing visible page heading');
        const ownerDefects = await ask(rl, 'Mobile layout review', mobileShot.path);
        mobileDefects.push(...ownerDefects);
        await recordCheck(row('mobile-layout', { status: mobileDefects.length ? 'FAIL' : 'PASS', viewport: { width: mobileMetrics.width, height: mobileMetrics.height }, documentScrollWidth: mobileMetrics.documentScrollWidth, pricingTableContainers: mobileMetrics.pricingTableContainers, ownerLayoutReview: { completed: true, status: ownerDefects.length ? 'FAIL' : 'PASS', screenshotSha256: mobileShot.sha256 }, blockingDefects: mobileDefects }, mobileShot));
      }

      if (routeChecks.includes('console-errors') && !hasCheck(routePath, 'console-errors')) {
        // Scope this check to a fresh load of the candidate route. Earlier navigation
        // checks can visit unrelated routes in the same tab, and browser extensions
        // can inject scripts that fail independently of the candidate page.
        browserErrors.length = 0;
        // Third-party analytics can keep the network perpetually active on this
        // page. The console check needs a fresh candidate document, not network
        // quiescence; wait for DOM readiness, then observe the settled app briefly.
        await page.goto(routeUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
        const errorsPath = join(outputDir, `console-${sha256(Buffer.from(routePath)).slice(0, 12)}.json`);
        const consoleBytes = Buffer.from(JSON.stringify(browserErrors, null, 2) + '\n');
        const consoleFile = await writeHashed(errorsPath, consoleBytes); evidenceFiles.push(consoleFile);
        await recordCheck(row('console-errors', { status: browserErrors.length ? 'FAIL' : 'PASS', materialErrors: [...browserErrors], attributedBackgroundAnalyticsErrors: attributedBackgroundAnalyticsErrors.filter(item => item.route === routePath) }, consoleFile));
        browserErrors.length = 0;
      }
    }

    for (const routePath of routePaths) {
      const names = testRows.filter(row => row.route === routePath).map(row => row.name);
      const expectedNames = [...(assignments.byRoute[routePath] ?? []), ...(assignments.newStaticRoutes.includes(routePath) ? assignments.pageChecks : [])];
      if (expectedNames.some(name => names.filter(item => item === name).length !== 1)) fail(`Browser evidence is incomplete or duplicated for ${routePath}`);
    }

    const browserArtifact = createBrowserArtifact({ versionId: run.versionId, candidateManifestSha256: run.candidateManifestSha256,
      origin: run.origin, riskClassification: run.smokePolicy.classification, browserEnvironment,
      evidenceFiles, routes: routePaths, tests: testRows, backgroundAnalyticsRequests, attributedBackgroundAnalyticsErrors });
    for (const test of testRows) if (test.passed === false || (test.blockingDefects?.length ?? 0) || (test.materialErrors?.length ?? 0)) test.status = 'FAIL';
    const browserArtifactPath = join(outputDir, 'browser-artifact.json');
    const browserArtifactBytes = Buffer.from(JSON.stringify(browserArtifact, null, 2) + '\n');
    await writeFile(browserArtifactPath, browserArtifactBytes, { flag: 'wx' });
    const browserRef = { path: resolve(browserArtifactPath), sha256: sha256(browserArtifactBytes) };
    let submissionRef = null;
    if (requiredChecks.includes('submission')) {
      const requiredEstimateRoutes = routePaths.filter(route => assignments.byRoute[route]?.includes('estimate-form'));
      if (!requiredEstimateRoutes.length || submissionRows.length !== requiredEstimateRoutes.length || submissionRows.some(test => test.status !== 'PASS')) fail('Candidate estimate GET evidence is incomplete for required routes');
      const artifact = { kind: 'submission', versionId: run.versionId, candidateManifestSha256: run.candidateManifestSha256, origin: run.origin, status: 'PASS', verifiedAtUtc: timestamp(), browserEnvironment: { browser: 'Chromium', version: browser.version(), platform: `${platformName()} ${platformRelease()} (${process.arch})` }, evidenceFiles: submissionRows.flatMap(test => test.evidenceFiles), requestSubmitted: true, expectedResponseObserved: true, tests: submissionRows };
      const file = join(outputDir, 'submission-artifact.json'), bytes = Buffer.from(JSON.stringify(artifact, null, 2) + '\n');
      await writeFile(file, bytes, { flag: 'wx' }); submissionRef = { path: resolve(file), sha256: sha256(bytes) };
    }
    if (adoptionProfile) {
      const retainedHttpBytes = await readFile(retainedHttpEvidencePath);
      const historicalPreviewBytes = await readFile(historicalPreviewEvidencePath);
      const focusedPaths = new Set([...adoptionProfile.freshHttpRoutes, ...adoptionProfile.pricingRoutes]);
      const adoptionEvidence = {
        schema: 'pcm-v970-baseline-adoption-evidence/v1', profileId: adoptionProfile.id,
        worker: adoptionProfile.worker, versionId: run.versionId,
        manifestSha256: run.candidateManifestSha256, gitBaselineCommit: adoptionProfile.gitBaselineCommit,
        releasePlanSha256: run.plan.releasePlanSha256,
        releasePlanFileSha256: adoptionProfile.releasePlanFileSha256,
        releaseStateSha256: adoptionProfile.releaseStateSha256,
        createdAtUtc: timestamp(),
        retainedHttp: { path: resolve(retainedHttpEvidencePath), sha256: sha256(retainedHttpBytes) },
        historicalPreview: { path: resolve(historicalPreviewEvidencePath), sha256: sha256(historicalPreviewBytes) },
        freshHttp: probes.filter(probe => focusedPaths.has(probe.path)).map(probe => ({
          path: probe.path, status: probe.status, origin: run.origin, url: run.origin + probe.path,
          redirected: probe.redirected, versionId: run.versionId, manifestSha256: run.candidateManifestSha256,
          verifiedAtUtc: probe.verifiedAtUtc, bodyPath: probe.bodyEvidencePath, bodySha256: probe.bodyEvidenceSha256,
        })),
        focusedBrowser: browserRef, submissionArtifact: submissionRef,
      };
      const file = join(outputDir, 'baseline-adoption-evidence.json');
      const bytes = Buffer.from(JSON.stringify(adoptionEvidence, null, 2) + '\n');
      await writeFile(file, bytes, { flag: 'wx' });
      return { status: 'EVIDENCE_COLLECTED_REQUIRES_BASELINE_ACCEPTANCE', profileId: adoptionProfile.id,
        evidencePath: resolve(file), browserArtifactPath: resolve(browserArtifactPath),
        submissionArtifactPath: submissionRef?.path ?? null, verifiedAtUtc: adoptionEvidence.createdAtUtc,
        versionId: run.versionId, candidateManifestSha256: run.candidateManifestSha256,
        freshHttpPaths: adoptionEvidence.freshHttp.map(row => row.path), focusedBrowserRoutes: [...adoptionProfile.pricingRoutes] };
    }
      const smoke = {
      schema: 'pcm-release-smoke/v1', phase, worker: 'newpurely', versionId: run.versionId,
      candidateManifestSha256: run.candidateManifestSha256, riskClassification: run.smokePolicy.classification, origin: run.origin, verifiedAtUtc: timestamp(),
      probes, checks: [
        { name: 'http', status: probes.length === requiredProbePaths(run.plan, assignments).length ? 'PASS' : 'FAIL' },
        { name: 'browser', status: browserArtifact.status, artifact: browserRef },
        ...(submissionRef ? [{ name: 'submission', status: 'PASS', artifact: submissionRef }] : []),
      ],
    };
    const smokePath = join(outputDir, `${phase}-evidence.json`);
    await writeFile(smokePath, JSON.stringify(smoke, null, 2) + '\n', { flag: 'wx' });
    if (smoke.checks.some(check => check.status !== 'PASS')) return { status: 'BLOCKED', reason: 'One or more observed checks failed; evidence was preserved for review', outputDir: resolve(outputDir), smokePath: resolve(smokePath), browserArtifactPath: resolve(browserArtifactPath) };
    const checked = await validateSmoke({ evidencePath: resolve(smokePath), plan: run.plan, state: run.state, phase, policyOverride: run.smokePolicy, sourceOwners: run.workflow.owners, expectedHomepageTitle });
    return { status: 'PASS', riskClassification: checked.classification, browserChecks: checked.browserChecks, evidencePath: resolve(smokePath), browserArtifactPath: resolve(browserArtifactPath), verifiedAtUtc: checked.verifiedAtUtc, outputDir: resolve(outputDir), versionId: run.versionId, candidateManifestSha256: run.candidateManifestSha256, candidateFilesVerified: run.filesVerified, probes: probes.map(({ path, status, bodyEvidenceSha256, bodySha256, rawResponseSha256, comparisonBodySha256, cloudflareInsightsBeaconApplied }) => ({ path, status, bodyEvidenceSha256, bodySha256, ...(phase === 'production' ? { rawResponseSha256, comparisonBodySha256, cloudflareInsightsBeaconApplied } : {}) })) };
  } finally {
    rl.close();
    if (cdpEndpoint) await disconnectCdp(browser);
    else await browser.close();
  }
}

export function parseCollectorArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!['--run-dir', '--output-dir', '--version-id', '--manifest-sha256', '--cdp-endpoint', '--phase', '--expected-homepage-title', '--baseline-adoption-profile', '--retained-http-evidence', '--historical-preview-evidence'].includes(key)) fail(`Unknown argument: ${key}`);
    const value = argv[++i];
    if (!value || value.startsWith('--')) fail(`Missing value for ${key}`);
    options[key.slice(2).replaceAll('-', '')] = value;
  }
  if (!options.rundir || !options.outputdir || !options.versionid || !/^[a-f0-9]{64}$/i.test(options.manifestsha256 ?? '')) fail('Usage: node tools/deployment-preflight/collect-preview-evidence.mjs --run-dir DIR --output-dir DIR --version-id UUID --manifest-sha256 SHA256 [--phase preview|production] [--cdp-endpoint http://127.0.0.1:9222]');
  options.phase ??= 'preview';
  if (!['preview', 'production'].includes(options.phase)) fail('Evidence phase must be preview or production');
  if (!isAbsolute(options.rundir) || !isAbsolute(options.outputdir)) fail('Run and evidence output directories must be absolute paths');
  if (options.cdpendpoint) options.cdpendpoint = validateCdpEndpoint(options.cdpendpoint);
  if (options.baselineadoptionprofile && options.baselineadoptionprofile !== V970_BASELINE_ADOPTION_PROFILE.id) fail('Unsupported baseline-adoption profile');
  const adoption = Boolean(options.baselineadoptionprofile);
  if (adoption && (!options.retainedhttpevidence || !options.historicalpreviewevidence || !isAbsolute(options.retainedhttpevidence) || !isAbsolute(options.historicalpreviewevidence))) fail('The one-time profile requires absolute retained HTTP and historical preview evidence paths');
  if (adoption && (options.phase !== 'production' || options.versionid !== V970_BASELINE_ADOPTION_PROFILE.versionId
      || options.manifestsha256.toLowerCase() !== V970_BASELINE_ADOPTION_PROFILE.manifestSha256)) fail('The one-time profile is restricted to production v970 and its pinned manifest');
  return { runDir: options.rundir, outputDir: options.outputdir, expectedVersionId: options.versionid, expectedManifestSha256: options.manifestsha256.toLowerCase(), expectedHomepageTitle: options.expectedhomepagetitle, cdpEndpoint: options.cdpendpoint, phase: options.phase,
    baselineAdoptionProfile: options.baselineadoptionprofile, retainedHttpEvidencePath: options.retainedhttpevidence, historicalPreviewEvidencePath: options.historicalpreviewevidence };
}

async function main(argv) {
  const options = parseCollectorArgs(argv);
  const playwright = await importPlaywright();
  const result = await collectPreviewEvidence({ ...options, playwright });
  stdout.write(JSON.stringify(result, null, 2) + '\n');
  if (result.status !== 'PASS' && result.status !== 'EVIDENCE_COLLECTED_REQUIRES_BASELINE_ACCEPTANCE') process.exitCode = 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => {
    // Error text is sanitized by the helpers; never print headers, cookies, or auth query strings.
    console.error(error.message);
    process.exitCode = 1;
  });
}
