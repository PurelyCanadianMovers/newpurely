import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { copyFile, lstat, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, parse, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { acceptProductionBaseline, baselineApprovalPhrase } from './accept-production-baseline.mjs';
import { ACCEPTABLE_BASELINE_LIMITATIONS, validateBaselineAcceptance, readAcceptedSelection } from './owner-attested-baseline.mjs';
import { smokePolicy, validateSmoke } from './smoke-evidence.mjs';
import {readAccountBinding,validateAccountEnvironment,validatePlanAccount,validateAccountEvidence} from './account-binding.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const WORKER = 'newpurely';
export const PRODUCTION_PREFLIGHT = resolve(HERE, 'unified-preflight.mjs');
export const PRODUCTION_VERIFIER = resolve(HERE, '../deployment-verifier/Verify-Cloudflare-Production.ps1');
export const WRANGLER_ENTRY = process.env.PCM_WRANGLER_ENTRY || 'C:\\pcm-callback-deployment-tools\\node_modules\\wrangler\\bin\\wrangler.js';
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const UPLOADED_FLAGS_LIMITATION = 'uploaded-version-compatibility-flags-unavailable';
const KNOWN_GAPS = new Set([
  'Baseline asset hashes are owner-attested local records, not an independently retrieved Cloudflare asset inventory.',
  'Compatibility flags remain INCOMPLETE unless an exact-version Cloudflare response explicitly verifies them.',
  'Compatibility flags: Version compatibility flags field is missing.',
]);

function fail(message) { throw new Error(message); }
function sha(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function jsonBytes(value) { return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8'); }
function normalized(p) { return resolve(p).replace(/[\\/]+$/, '').toLocaleLowerCase('en-US'); }
function within(path, root) { const rel = relative(resolve(root), resolve(path)); return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel)); }
function safeText(value, secret = '') {
  let text = String(value ?? '');
  if (secret) text = text.split(secret).join('[REDACTED-CLOUDFLARE-TOKEN]');
  return text.replace(/\u001b\[[0-9;]*m/g, '')
    .replace(/(authorization\s*[:=]\s*)([^\s,;]+)/ig, '$1[REDACTED]')
    .replace(/(bearer\s+)[A-Za-z0-9._~+/-]+=*/ig, '$1[REDACTED]')
    .replace(/(api[_-]?token|access[_-]?token|client[_-]?secret|cookie|set-cookie)(\s*[:=]\s*)([^\r\n,;]+)/ig, '$1$2[REDACTED]')
    .replace(/\b[A-Za-z0-9_-]{40,}\b/g, '[REDACTED-LONG-TOKEN-LIKE-VALUE]');
}
function parseJson(text, label) {
  rejectDuplicateKeys(text, label);
  try { return JSON.parse(text); } catch { fail(`${label} is malformed JSON`); }
}
function rejectDuplicateKeys(text, label) {
  let i = 0;
  const ws = () => { while (i < text.length && /\s/.test(text[i])) i++; };
  function string() {
    const start = i++;
    while (i < text.length) { if (text[i] === '\\') { i += 2; continue; } if (text[i++] === '"') break; }
    if (text[i - 1] !== '"') fail(`${label} is malformed JSON`);
    try { return JSON.parse(text.slice(start, i)); } catch { fail(`${label} is malformed JSON`); }
  }
  function value() {
    ws();
    if (text[i] === '{') {
      i++; ws(); const keys = new Set(); if (text[i] === '}') { i++; return; }
      while (i < text.length) { ws(); if (text[i] !== '"') fail(`${label} is malformed JSON`); const key = string(); if (keys.has(key)) fail(`${label} contains duplicate JSON keys`); keys.add(key); ws(); if (text[i++] !== ':') fail(`${label} is malformed JSON`); value(); ws(); const c = text[i++]; if (c === '}') return; if (c !== ',') fail(`${label} is malformed JSON`); }
      fail(`${label} is malformed JSON`);
    }
    if (text[i] === '[') { i++; ws(); if (text[i] === ']') { i++; return; } while (i < text.length) { value(); ws(); const c = text[i++]; if (c === ']') return; if (c !== ',') fail(`${label} is malformed JSON`); } fail(`${label} is malformed JSON`); }
    if (text[i] === '"') { string(); return; }
    const literal = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(i));
    if (!literal) fail(`${label} is malformed JSON`); i += literal[0].length;
  }
  value(); ws(); if (i !== text.length) fail(`${label} is malformed JSON`);
}
async function readJson(path, label) { return parseJson(await readFile(path, 'utf8'), label); }
async function writeNew(path, bytes) {
  await writeFile(path, bytes, { flag: 'wx' });
}
async function requireFile(path, label) {
  const stat = await lstat(path).catch(() => null);
  if (!stat?.isFile() || stat.isSymbolicLink() || stat.isReparsePoint?.()) fail(`${label} must be an existing ordinary file`);
  return realpath(path);
}
async function requireDirectory(path, label) {
  const stat = await lstat(path).catch(() => null);
  if (!stat?.isDirectory() || stat.isSymbolicLink() || stat.isReparsePoint?.()) fail(`${label} must be an existing ordinary directory`);
  return realpath(path);
}
async function assertOutsideGit(root) {
  let cursor = resolve(root);
  while (true) {
    try { await lstat(join(cursor, '.git')); fail('deployment packages inside a Git checkout are forbidden'); } catch (error) {
      if (error instanceof Error && error.message.startsWith('deployment packages inside')) throw error;
      if (error?.code !== 'ENOENT') fail('cannot verify that the candidate is outside a Git checkout');
    }
    const parent = dirname(cursor); if (parent === cursor || cursor === parse(cursor).root) break; cursor = parent;
  }
}
export async function scanCandidate(packagePath) {
  const root = await requireDirectory(packagePath, 'candidate package');
  await assertOutsideGit(root);
  const files = [];
  const folded = new Set();
  async function walk(dir, prefix = '') {
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    for (const entry of entries) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (path.split('/').some((part) => !part || part === '.' || part === '..') || path.includes('\\') || /^[a-z]:/i.test(path)) fail(`unsafe candidate path: ${path}`);
      const lower = path.toLocaleLowerCase('en-US'); if (folded.has(lower)) fail(`case-ambiguous candidate path: ${path}`); folded.add(lower);
      const full = join(dir, entry.name); const stat = await lstat(full);
      if (stat.isSymbolicLink() || stat.isReparsePoint?.()) fail(`candidate contains a link/reparse point: ${path}`);
      if (stat.isDirectory()) await walk(full, path);
      else if (stat.isFile()) { const bytes = await readFile(full); files.push({ path, bytes: bytes.length, sha256: sha(bytes) }); }
      else fail(`candidate contains a special file: ${path}`);
    }
  }
  await walk(root);
  if (!files.some((f) => f.path === 'wrangler.toml') || !files.some((f) => f.path === 'worker/index.mjs') || !files.some((f) => f.path === 'site-copy/_redirects')) fail('candidate is missing required Worker, config, or redirects files');
  return { root, files };
}

export function validatePreflightReport(report, expectedVersion) {
  if (!report || report.worker !== WORKER || report.expectedProductionVersion !== expectedVersion) fail('preflight report Worker/version identity is missing or inconsistent');
  if (report.fileComparisonResult !== 'PASS' || report.comparisonResult !== 'PASS' || report.comparisonEvaluated !== true) fail('file comparison did not PASS');
  if (report.cloudflareVerification?.status !== 'PASS' || report.production?.observedVersion !== expectedVersion) fail('fresh production version verification did not PASS');
  const allocation = report.production?.allocations;
  if (!Array.isArray(allocation) || allocation.length !== 1 || allocation[0]?.versionId !== expectedVersion || allocation[0]?.percentage !== 100) fail('production traffic must be exactly 100% on the expected version');
  if (report.acceptanceRecord?.status !== 'ACCEPTED' || report.eligibilityForHumanDeploymentReview !== true || report.deploymentAuthorization !== 'NOT GRANTED' || report.deploymentReady !== false) fail('acceptance, human-review eligibility, or no-authorization condition failed');
  const accepted = report.acceptedLimitations;
  if (!Array.isArray(accepted) || accepted.length !== ACCEPTABLE_BASELINE_LIMITATIONS.length || ACCEPTABLE_BASELINE_LIMITATIONS.some((id) => !accepted.some((item) => item.id === id && item.status === 'INCOMPLETE' && item.accepted === true))) fail('the two accepted evidence limitations are not explicitly preserved as INCOMPLETE');
  if (report.evidenceVerificationStatus !== 'INCOMPLETE' || report.evidenceStatus !== 'INCOMPLETE' || report.compatibilityFlags?.status !== 'INCOMPLETE') fail('incomplete evidence was misreported as verified');
  if (!Array.isArray(report.missingEvidence) || report.missingEvidence.length !== KNOWN_GAPS.size || report.missingEvidence.some((gap) => !KNOWN_GAPS.has(String(gap)))) fail('preflight reports a new, malformed, or unaccepted evidence gap');
  if (!Array.isArray(report.unexpectedDifferences) || report.unexpectedDifferences.length) fail('candidate contains unexpected/unapproved changes');
  if (!Array.isArray(report.approvedChanges)) fail('preflight approved-change list is malformed');
  return true;
}

async function runUnified(input, reportPath, dependencies) {
  if (dependencies.runPreflight) {
    const result = await dependencies.runPreflight({ ...input, reportPath });
    if (result?.report) { await writeNew(reportPath, jsonBytes(result.report)); return { ...result, report: result.report }; }
    if (result && typeof result === 'object') { await writeNew(reportPath, jsonBytes(result)); return { report: result, exitCode: result.status === 'MISMATCH' ? 1 : result.status === 'PASS' ? 0 : 1, stdout: '' }; }
    return result;
  }
  const args = [PRODUCTION_PREFLIGHT, '--baseline-mode', 'owner-attested', '--baseline', input.baselinePath,
    '--acceptance', input.acceptancePath, '--package', input.packagePath, '--worker', WORKER,
    '--worker-version', input.workerVersion, '--allowlist', input.allowlistPath, '--report', reportPath];
  const res = spawnSync(process.execPath, args, { cwd: HERE, encoding: 'utf8', windowsHide: true, timeout: 180_000 });
  if (res.error) fail(`could not launch unified preflight (${res.error.name})`);
  const report = await readJson(reportPath, 'unified preflight report');
  return { report, exitCode: res.status, stdout: safeText(res.stdout), stderr: safeText(res.stderr) };
}

function canonicalManifest(files) { return jsonBytes({ schema: 'pcm-release-candidate-manifest/v1', files }); }
function compareJson(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
const APPROVAL_KEYS = ['schema', 'phase', 'status', 'worker', 'candidate_package', 'candidate_manifest_sha256', 'release_plan_sha256', 'baseline_sha256', 'allowlist_sha256', 'production_version', 'rollback_version', 'expected_active_version', 'target_version', 'traffic_percentage', 'release_state_sha256', 'accepted_limitations', 'compatibility_flags_acknowledged_for_version', 'approver', 'approver_role', 'approved_at', 'expires_at'];
const APPROVAL_PRECISION_KEYS = ['approved_at_precision', 'expires_at_precision'];
const MAX_V2_UPLOAD_APPROVAL_VALIDITY_MS = 24 * 60 * 60 * 1000;
const APPROVAL_LIMITATION_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function validateLimitationIds(value, label) {
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string' || !APPROVAL_LIMITATION_ID.test(id)) || new Set(value).size !== value.length) fail(`authorization ${label} must contain unique, well-formed limitation identifiers`);
}
function validCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function parseApprovalTime(value, precision, field) {
  if (precision === 'CALENDAR_DATE') {
    if (!validCalendarDate(value)) fail(`authorization ${field} must be a valid YYYY-MM-DD calendar date`);
    const start = Date.parse(`${value}T00:00:00.000Z`);
    return field === 'expires_at' ? start + 86_400_000 - 1 : start;
  }
  if (precision !== 'EXACT_TIMESTAMP') fail(`authorization ${field} precision is invalid`);
  const match = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) fail(`authorization ${field} must be an ISO 8601 timestamp with an explicit timezone`);
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, , zone] = match;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const hour = Number(hourText), minute = Number(minuteText), second = Number(secondText);
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (month < 1 || month > 12 || day < 1 || day > dayCount || hour > 23 || minute > 59 || second > 59) fail(`authorization ${field} timestamp is malformed`);
  if (zone !== 'Z') {
    const offsetHour = Number(zone.slice(1, 3)), offsetMinute = Number(zone.slice(4, 6));
    if (zone === '-00:00' || offsetHour > 14 || offsetMinute > 59 || (offsetHour === 14 && offsetMinute !== 0)) fail(`authorization ${field} timezone offset is malformed`);
  }
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) fail(`authorization ${field} timestamp is malformed`);
  return timestamp;
}
export function validateApprovalRecord(record, phase, expected, now = Date.now()) {
  const keys = Object.keys(record ?? {}).sort().join('|');
  const accountKeys=expected.accountId?['cloudflare_account_id']:[];
  const legacyKeys = [...APPROVAL_KEYS,...accountKeys].sort().join('|');
  const precisionKeys = [...APPROVAL_KEYS, ...APPROVAL_PRECISION_KEYS,...accountKeys].sort().join('|');
  const legacyShape = keys === legacyKeys;
  if (!record || typeof record !== 'object' || Array.isArray(record) || (!legacyShape && keys !== precisionKeys)) fail('authorization record has missing or unexpected fields');
  if (legacyShape && (!validCalendarDate(record.approved_at) || !validCalendarDate(record.expires_at))) fail('legacy authorization records require date-only approval and expiry values');
  const approvedPrecision = legacyShape ? 'CALENDAR_DATE' : record.approved_at_precision;
  const expiresPrecision = legacyShape ? 'CALENDAR_DATE' : record.expires_at_precision;
  const v2Upload = Boolean(expected.accountId) && phase === 'UPLOAD';
  if (v2Upload && (legacyShape || approvedPrecision !== 'EXACT_TIMESTAMP' || expiresPrecision !== 'EXACT_TIMESTAMP')) fail('V2 UPLOAD authorization requires explicit approval and expiration timestamps');
  const approvedAtMs = parseApprovalTime(record.approved_at, approvedPrecision, 'approved_at');
  const expiresAtMs = parseApprovalTime(record.expires_at, expiresPrecision, 'expires_at');
  if (approvedAtMs >= expiresAtMs) fail('authorization approval must precede expiration');
  if (v2Upload && expiresAtMs - approvedAtMs > MAX_V2_UPLOAD_APPROVAL_VALIDITY_MS) fail('V2 UPLOAD authorization validity exceeds 24 hours');
  if (approvedAtMs > now) fail('authorization approval time is in the future');
  if (expiresAtMs <= now) fail('authorization is expired');
  if (record.schema !== (expected.accountId?'pcm-worker-deployment-authorization/v2':'pcm-worker-deployment-authorization/v1') || record.status !== 'APPROVED' || record.phase !== phase) fail(`a separate APPROVED ${phase} authorization record is required`);
  if(expected.accountId&&record.cloudflare_account_id!==expected.accountId)fail('Authorization is for a different Cloudflare account');
  if (record.worker !== WORKER || normalized(record.candidate_package) !== normalized(expected.candidatePackage)
    || record.candidate_manifest_sha256 !== expected.candidateManifestSha256 || record.release_plan_sha256 !== expected.releasePlanSha256
    || record.baseline_sha256 !== expected.baselineSha256 || record.allowlist_sha256 !== expected.allowlistSha256
    || record.production_version !== expected.productionVersion || record.rollback_version !== expected.rollbackVersion
    || record.expected_active_version !== expected.expectedActiveVersion || record.release_state_sha256 !== expected.releaseStateSha256
    || !Array.isArray(record.accepted_limitations) || JSON.stringify(record.accepted_limitations) !== JSON.stringify(expected.acceptedLimitations)
    || record.compatibility_flags_acknowledged_for_version !== expected.compatibilityFlagsAcknowledgedForVersion) fail('authorization does not match this exact candidate, manifest, plan, baseline, allowlist, production/rollback versions, release state, or compatibility-flags acknowledgment');
  validateLimitationIds(expected.acceptedLimitations, 'expected limitations');
  validateLimitationIds(record.accepted_limitations, 'accepted limitations');
  const expectedTarget = phase === 'UPLOAD' ? null : expected.targetVersion;
  const expectedTraffic = phase === 'PROMOTE' || phase === 'ROLLBACK' ? 100 : null;
  if (record.target_version !== expectedTarget || record.traffic_percentage !== expectedTraffic) fail('authorization target version or traffic allocation is incorrect');
  if (typeof record.approver !== 'string' || record.approver.trim().length < 3 || record.approver !== record.approver.trim() || /^(unknown|n\/?a|none|test|placeholder)$/i.test(record.approver) || record.approver_role !== 'business-owner') fail('authorization approver identity/role is missing or invalid');
  return { approver: record.approver, approverRole: record.approver_role, approvedAt: record.approved_at, approvedAtPrecision: approvedPrecision, expiresAt: record.expires_at, expiresAtPrecision: expiresPrecision };
}

async function readPlan(releaseDir) {
  const planPath = join(releaseDir, 'release-plan.json'); const bytes = await readFile(planPath); const plan = parseJson(bytes.toString('utf8'), 'release plan');
  const { releasePlanSha256, ...unsignedPlan } = plan;
  if (plan.schema !== 'pcm-guarded-release-plan/v1' || plan.status !== 'READY_FOR_OWNER_REVIEW' || sha(jsonBytes(unsignedPlan)) !== releasePlanSha256) fail('release plan is invalid or has been modified');
  if(!plan.account?.id)fail('Historical plan has no account binding; prepare a new run without rewriting history');
  return { plan, planPath, releasePlanSha256 };
}
async function validateAcceptanceAndBaseline(plan, acceptancePath) {
  await validatePlanAccount(plan,await readFile(join(plan.candidatePackage,'wrangler.toml'),'utf8'));
  const [baselineBytes, acceptanceBytes] = await Promise.all([readFile(plan.baselinePath), readFile(acceptancePath)]);
  const baselineHash = sha(baselineBytes); if (baselineHash !== plan.baselineSha256) fail('baseline file changed since release plan was created');
  const acceptance = validateBaselineAcceptance({ bytes: acceptanceBytes, baselineBytes, baselineHash, workerName: WORKER, workerVersion: plan.productionVersion });
  if (acceptance.status !== 'ACCEPTED' || sha(acceptanceBytes) !== plan.acceptanceSha256) fail('controlled acceptance is invalid, expired, revoked, or changed');
  const baseline = parseJson(baselineBytes.toString('utf8'), 'baseline');
  if (baseline.worker?.previous_rollback_version !== plan.rollbackVersion) fail('rollback target no longer matches the baseline');
  if(plan.workflow){
    if(sha(await readFile(plan.workflow.selection.path))!==plan.workflow.selection.sha256)fail('Accepted baseline selection changed since preparation');
    const selected=await readAcceptedSelection(plan.workflow.selection.path);
    if(selected.workerVersion!==plan.productionVersion||resolve(selected.baselinePath)!==resolve(plan.baselinePath))fail('Selected baseline no longer matches release');
    for(const f of plan.workflow.verificationFiles)if(sha(await readFile(f.path))!==f.sha256)fail('Local test or ownership evidence changed since preparation');
  }
  return { baseline, acceptance };
}
async function checkCandidate(plan) {
  const actual = await scanCandidate(plan.candidatePackage); const manifest = canonicalManifest(actual.files);
  if (sha(manifest) !== plan.candidateManifestSha256) fail('candidate package changed after approval; refusing release');
  return { ...actual, manifest };
}
async function checkAllowlist(plan) {
  const bytes = await readFile(plan.allowlistPath); if (sha(bytes) !== plan.allowlistSha256) fail('approved-change allowlist changed after review');
  return bytes;
}
async function checkPreflight(plan, reportPath, dependencies) {
  const result = await runUnified({ packagePath: plan.candidatePackage, baselinePath: plan.baselinePath, acceptancePath: plan.acceptancePath, allowlistPath: plan.allowlistPath, workerVersion: plan.productionVersion }, reportPath, dependencies);
  validatePreflightReport(result.report, plan.productionVersion);
  await verifyFreshAccount(plan,result.report);
  const beforeChanges = JSON.stringify(plan.approvedChanges);
  if (JSON.stringify(result.report.approvedChanges) !== beforeChanges) fail('approved change list changed since human review');
  await writeNew(join(dirname(reportPath), `${relative(dirname(reportPath), reportPath).replace(/[^A-Za-z0-9.-]/g, '-')}.stdout.json`), jsonBytes({ exitCode: result.exitCode, stdout: safeText(result.stdout), stderr: safeText(result.stderr) }));
  return result.report;
}
async function verifyFreshAccount(plan,report){
  if(!report.workerVerificationEvidencePath)fail('Fresh authenticated account evidence is missing');
  const evidence=await readJson(report.workerVerificationEvidencePath,'fresh authenticated account evidence');
  return validateAccountEvidence(evidence,plan.account.id,plan.productionVersion);
}
function authorizationContext(plan, releasePlanSha256) {
  return { accountId:plan.account.id,candidatePackage: plan.candidatePackage, candidateManifestSha256: plan.candidateManifestSha256, releasePlanSha256, baselineSha256: plan.baselineSha256, allowlistSha256: plan.allowlistSha256, productionVersion: plan.productionVersion, rollbackVersion: plan.rollbackVersion };
}
// Build the same strict, hash-bound record after an owner explicitly confirms
// the displayed scope in the interactive CLI. This does not grant authority
// until the normal phase validator consumes the record.
export async function createInteractiveApprovalRecord({ releaseDir, phase, approver, now = Date.now() }) {
  if (!['UPLOAD', 'PROMOTE'].includes(phase)) fail('interactive authorization supports upload or promotion only');
  const { plan, releasePlanSha256 } = await readPlan(releaseDir);
  let expected, record;
  const approvedAt = new Date(now).toISOString();
  const expiresAt = new Date(now + 30 * 60 * 1000).toISOString();
  if (phase === 'UPLOAD') {
    expected = { ...authorizationContext(plan, releasePlanSha256), expectedActiveVersion: null, targetVersion: null, releaseStateSha256: null, acceptedLimitations: plan.acceptedLimitations, compatibilityFlagsAcknowledgedForVersion: null };
    record = { schema: 'pcm-worker-deployment-authorization/v2', cloudflare_account_id: plan.account.id, phase, status: 'APPROVED', worker: WORKER, candidate_package: plan.candidatePackage, candidate_manifest_sha256: plan.candidateManifestSha256, release_plan_sha256: releasePlanSha256, baseline_sha256: plan.baselineSha256, allowlist_sha256: plan.allowlistSha256, production_version: plan.productionVersion, rollback_version: plan.rollbackVersion, expected_active_version: null, target_version: null, traffic_percentage: null, release_state_sha256: null, accepted_limitations: plan.acceptedLimitations, compatibility_flags_acknowledged_for_version: null };
  } else {
    const loaded = await readRelease(releaseDir), state = loaded.state;
    const immediateRollbackVersion = state.productionVersionBeforeUpload;
    const incompleteFlags = state.compatibilityFlagsStatus === 'INCOMPLETE';
    expected = { ...authorizationContext(plan, releasePlanSha256), rollbackVersion: immediateRollbackVersion, expectedActiveVersion: plan.productionVersion, targetVersion: state.versionId, releaseStateSha256: loaded.releaseStateSha256, acceptedLimitations: incompleteFlags ? [UPLOADED_FLAGS_LIMITATION] : [], compatibilityFlagsAcknowledgedForVersion: incompleteFlags ? state.versionId : null };
    record = { schema: 'pcm-worker-deployment-authorization/v2', cloudflare_account_id: plan.account.id, phase, status: 'APPROVED', worker: WORKER, candidate_package: plan.candidatePackage, candidate_manifest_sha256: plan.candidateManifestSha256, release_plan_sha256: releasePlanSha256, baseline_sha256: plan.baselineSha256, allowlist_sha256: plan.allowlistSha256, production_version: plan.productionVersion, rollback_version: immediateRollbackVersion, expected_active_version: plan.productionVersion, target_version: state.versionId, traffic_percentage: 100, release_state_sha256: loaded.releaseStateSha256, accepted_limitations: expected.acceptedLimitations, compatibility_flags_acknowledged_for_version: expected.compatibilityFlagsAcknowledgedForVersion };
  }
  record.approver = approver; record.approver_role = 'business-owner'; record.approved_at = approvedAt; record.expires_at = expiresAt; record.approved_at_precision = 'EXACT_TIMESTAMP'; record.expires_at_precision = 'EXACT_TIMESTAMP';
  validateApprovalRecord(record, phase, expected, now);
  return record;
}
async function loadApproval(path, phase, expected) {
  const file = await requireFile(path, `${phase.toLowerCase()} authorization`); if (within(file, expected.candidatePackage)) fail('authorization record must be outside the candidate package');
  const bytes = await readFile(file); const label = `${phase.toLowerCase()} authorization`; rejectDuplicateKeys(bytes.toString('utf8'), label);
  return { record: parseJson(bytes.toString('utf8'), label), file, bytes, validated: null };
}
export const CREDENTIAL_HANDOFF_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
$payload = $null
$payloadBytes = $null
$ptr = [IntPtr]::Zero
$secure = $null
$secretPtr = [IntPtr]::Zero
$plain = $null
$processInfo = $null
$process = $null
$stdout = ''
$stderr = ''
$exitCode = $null
$errorType = 'Credential retrieval failure'
try {
  $payloadBytes = [Convert]::FromBase64String($env:PCM_WRANGLER_PAYLOAD)
  $payload = [Text.Encoding]::UTF8.GetString($payloadBytes) | ConvertFrom-Json
  Remove-Item Env:PCM_WRANGLER_PAYLOAD -ErrorAction SilentlyContinue
  if ($payload.useEnvironmentToken -eq $true) {
    $plain = [string]$env:PCM_WRANGLER_TOKEN
    Remove-Item Env:PCM_WRANGLER_TOKEN -ErrorAction SilentlyContinue
    if ([string]::IsNullOrWhiteSpace($plain)) { throw 'unavailable' }
  } else {
  if (-not ('PCM.WranglerCredential.Native' -as [type])) {
    $source = @'
using System;
using System.Runtime.InteropServices;
namespace PCM.WranglerCredential {
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
  public struct CREDENTIAL {
    public UInt32 Flags; public UInt32 Type; public IntPtr TargetName; public IntPtr Comment;
    public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
    public UInt32 CredentialBlobSize; public IntPtr CredentialBlob; public UInt32 Persist;
    public UInt32 AttributeCount; public IntPtr Attributes; public IntPtr TargetAlias; public IntPtr UserName;
  }
  public static class Native {
    [DllImport("Advapi32.dll", EntryPoint="CredReadW", CharSet=CharSet.Unicode, SetLastError=true)]
    [return: MarshalAs(UnmanagedType.Bool)] public static extern bool CredRead(string target, UInt32 type, UInt32 flags, out IntPtr credential);
    [DllImport("Advapi32.dll", EntryPoint="CredFree", SetLastError=false)] public static extern void CredFree(IntPtr credential);
  }
}
'@
    [void](Add-Type -TypeDefinition $source)
  }
  if (-not [PCM.WranglerCredential.Native]::CredRead('PCM-Cloudflare-API-Token', 1, 0, [ref]$ptr) -or -not $ptr) { throw 'unavailable' }
  $credential = [Runtime.InteropServices.Marshal]::PtrToStructure($ptr, [type][PCM.WranglerCredential.CREDENTIAL])
  if ($credential.CredentialBlobSize -lt 2 -or ($credential.CredentialBlobSize % 2) -ne 0 -or -not $credential.CredentialBlob) { throw 'unavailable' }
  $secure = New-Object System.Security.SecureString
  for ($offset = 0; $offset -lt $credential.CredentialBlobSize; $offset += 2) {
    $character = [Runtime.InteropServices.Marshal]::ReadInt16($credential.CredentialBlob, $offset)
    if ($character -eq 0) { break }
    $secure.AppendChar([char]([UInt16]$character))
  }
  if ($secure.Length -eq 0) { throw 'unavailable' }
  $secure.MakeReadOnly()
  $secretPtr = [Runtime.InteropServices.Marshal]::SecureStringToGlobalAllocUnicode($secure)
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringUni($secretPtr)
  if ([string]::IsNullOrWhiteSpace($plain)) { throw 'unavailable' }
  }
  $errorType = 'ProcessStartFailure'

  function Quote-WindowsArgument([string]$Value) {
    if ($Value.Length -gt 0 -and $Value -notmatch '[\s"]') { return $Value }
    $builder = New-Object System.Text.StringBuilder
    [void]$builder.Append('"'); $slashes = 0
    foreach ($character in $Value.ToCharArray()) {
      if ($character -eq [char]92) { $slashes++; continue }
      if ($character -eq [char]34) {
        [void]$builder.Append(('\' * (2 * $slashes + 1))); [void]$builder.Append('"'); $slashes = 0; continue
      }
      if ($slashes -gt 0) { [void]$builder.Append(('\' * $slashes)); $slashes = 0 }
      [void]$builder.Append($character)
    }
    if ($slashes -gt 0) { [void]$builder.Append(('\' * (2 * $slashes))) }
    [void]$builder.Append('"'); return $builder.ToString()
  }
  function Redact-Output([string]$Text, [string]$Secret) {
    if ($Secret) { $Text = $Text.Replace($Secret, '[REDACTED-CLOUDFLARE-TOKEN]') }
    return [regex]::Replace($Text, '(?i)(bearer\s+)[A-Za-z0-9._~+/-]+=*', '$1[REDACTED]')
  }

  $processInfo = New-Object System.Diagnostics.ProcessStartInfo
  $processInfo.FileName = [string]$payload.nodeExecutable
  $childArgs = @([string]$payload.wranglerEntry) + @($payload.arguments | ForEach-Object { [string]$_ })
  $processInfo.Arguments = (($childArgs | ForEach-Object { Quote-WindowsArgument $_ }) -join ' ')
  $processInfo.WorkingDirectory = [string]$payload.cwd
  $processInfo.UseShellExecute = $false
  $processInfo.CreateNoWindow = $true
  $processInfo.RedirectStandardOutput = $true
  $processInfo.RedirectStandardError = $true
  $processInfo.EnvironmentVariables['CLOUDFLARE_API_TOKEN'] = $plain
  if ($payload.accountId) { $processInfo.EnvironmentVariables['CLOUDFLARE_ACCOUNT_ID'] = [string]$payload.accountId }
  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $processInfo
  if (-not $process.Start()) { throw 'start failed' }
  [void]$processInfo.EnvironmentVariables.Remove('CLOUDFLARE_API_TOKEN')
  $stdoutTask = $process.StandardOutput.ReadToEndAsync()
  $stderrTask = $process.StandardError.ReadToEndAsync()
  $process.WaitForExit()
  $exitCode = $process.ExitCode
  $stdout = Redact-Output $stdoutTask.Result $plain
  $stderr = Redact-Output $stderrTask.Result $plain
  $versionEvidence = $null
  if ($payload.versionView -eq $true -and $exitCode -eq 0) {
    # Wrangler's JSON may contain long redirect paths that resemble tokens.
    # Hash the exact unredacted string in-process; never return raw redirects.
    $view = $stdoutTask.Result | ConvertFrom-Json
    $root = if ($view.result) { $view.result } else { $view }
    $runtime = if ($root.resources.script_runtime) { $root.resources.script_runtime } else { $root.script_runtime }
    $assets = $runtime.assets
    $redirectHash = $null
    if ($null -ne $assets -and $assets.raw_redirects -is [string]) {
      $sha = [System.Security.Cryptography.SHA256]::Create()
      try { $redirectHash = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes([string]$assets.raw_redirects)))).Replace('-', '').ToLowerInvariant() } finally { $sha.Dispose() }
    }
    $bindings = if ($root.resources.bindings) { @($root.resources.bindings | ForEach-Object { @{ name = $_.name; type = $_.type } }) } elseif ($root.bindings) { @($root.bindings | ForEach-Object { @{ name = $_.name; type = $_.type } }) } else { @() }
    $versionEvidence = @{
      id = $(if ($root.id) { $root.id } else { $root.version_id });
      compatibilityDate = $(if ($runtime.compatibility_date) { $runtime.compatibility_date } else { $root.compatibility_date });
      compatibilityFlagsPresent = ($null -ne $runtime.PSObject.Properties['compatibility_flags'] -or $null -ne $root.PSObject.Properties['compatibility_flags']);
      compatibilityFlags = $(if ($null -ne $runtime.PSObject.Properties['compatibility_flags']) { $runtime.compatibility_flags } else { $root.compatibility_flags });
      scriptEtag = $(if ($root.script_etag) { $root.script_etag } else { $root.resources.script.etag });
      bindings = $bindings;
      assets = @{ raw_redirects_sha256 = $redirectHash; raw_run_worker_first = $assets.raw_run_worker_first; html_handling = $assets.html_handling; not_found_handling = $assets.not_found_handling; base_path = $assets.base_path; serve_directly = $assets.serve_directly }
    }
  }
  $errorType = $null
} catch {
  $stdout = ''; $stderr = ''; $exitCode = $null
} finally {
  if ($processInfo) { [void]$processInfo.EnvironmentVariables.Remove('CLOUDFLARE_API_TOKEN') }
  if ($process) { try { if (-not $process.HasExited) { $process.Kill(); $process.WaitForExit() } } catch {}; try { $process.Dispose() } catch {} }
  $plain = $null
  if ($secretPtr) { [Runtime.InteropServices.Marshal]::ZeroFreeGlobalAllocUnicode($secretPtr) }
  if ($secure) { $secure.Dispose() }
  if ($ptr) { [PCM.WranglerCredential.Native]::CredFree($ptr) }
  if ($payloadBytes) { [Array]::Clear($payloadBytes, 0, $payloadBytes.Length) }
  $payload = $null
}
$response = @{ exitCode = $exitCode; stdout = $stdout; stderr = $stderr; errorType = $errorType; versionEvidence = $versionEvidence }
[Console]::Out.Write((ConvertTo-Json -InputObject $response -Compress -Depth 4))
exit 0
`;
export function runAuthenticatedWrangler(executable, args, cwd, dependencies = {}) {
  if (!isAbsolute(executable)) fail('Wrangler executable must be an explicit absolute path');
  if (!args.every((arg) => typeof arg === 'string' && !/[\0\r\n]/.test(arg))) fail('invalid Wrangler argument');
  const wrapperEnv = { ...(dependencies.baseEnv ?? process.env) };
  const useEnvironmentToken = dependencies.useEnvironmentToken === true;
  const environmentToken = useEnvironmentToken ? wrapperEnv.CLOUDFLARE_API_TOKEN : '';
  if (useEnvironmentToken && (typeof environmentToken !== 'string' || !environmentToken.trim())) fail('explicit hosted Cloudflare token is missing');
  if(dependencies.accountId){validateAccountEnvironment(dependencies.accountId,wrapperEnv,args);wrapperEnv.CLOUDFLARE_ACCOUNT_ID=dependencies.accountId;}
  delete wrapperEnv.CLOUDFLARE_API_TOKEN;
  if(useEnvironmentToken)wrapperEnv.PCM_WRANGLER_TOKEN=environmentToken;else delete wrapperEnv.PCM_WRANGLER_TOKEN;
  const versionView = dependencies.versionView === true && args.length === 6 && args[0] === 'versions' && args[1] === 'view' && UUID_RE.test(args[2]) && args[3] === '--name' && args[4] === WORKER && args[5] === '--json';
  wrapperEnv.PCM_WRANGLER_PAYLOAD = Buffer.from(JSON.stringify({ nodeExecutable: process.execPath, wranglerEntry: executable, arguments: args, cwd,accountId:dependencies.accountId, versionView, useEnvironmentToken }), 'utf8').toString('base64');
  try {
    const invoke = dependencies.spawnWrapperSync ?? spawnSync;
    const result = invoke('powershell.exe', ['-NoProfile', '-NoLogo', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(CREDENTIAL_HANDOFF_SCRIPT, 'utf16le').toString('base64')], {
      cwd, encoding: 'utf8', windowsHide: true, timeout: 180_000, env: wrapperEnv,
    });
    if (result?.error || result?.status !== 0 || typeof result?.stdout !== 'string') return { exitCode: null, stdout: '', stderr: '', errorType: 'PowerShellWrapperFailure' };
    let response;
    try { response = JSON.parse(result.stdout); } catch { return { exitCode: null, stdout: '', stderr: '', errorType: 'MalformedWrapperResponse' }; }
    if (!response || (response.exitCode !== null && !Number.isInteger(response.exitCode)) || typeof response.stdout !== 'string' || typeof response.stderr !== 'string') return { exitCode: null, stdout: '', stderr: '', errorType: 'MalformedWrapperResponse' };
    return { exitCode: response.exitCode, stdout: safeText(response.stdout), stderr: safeText(response.stderr), errorType: response.errorType ?? null, ...(response.versionEvidence ? { versionEvidence: response.versionEvidence } : {}) };
  } catch {
    return { exitCode: null, stdout: '', stderr: '', errorType: 'PowerShellWrapperFailure' };
  } finally {
    delete wrapperEnv.PCM_WRANGLER_PAYLOAD;
    delete wrapperEnv.PCM_WRANGLER_TOKEN;
    delete wrapperEnv.CLOUDFLARE_API_TOKEN;
  }
}

export async function installedWranglerIntegrity() {
  const dist = resolve(dirname(WRANGLER_ENTRY),'../wrangler-dist/cli.js');
  const wrapper = resolve(HERE,'guarded-wrangler-assets.cjs');
  return {dist,sha256:sha(await readFile(dist)),wrapper,wrapperSha256:sha(await readFile(wrapper))};
}
async function productionUpload({ stagingPath, worker = WORKER, releaseDir, plan, files }) {
  await validatePlanAccount(plan,await readFile(join(stagingPath,'wrangler.toml'),'utf8'));
  const info=plan.wranglerIntegrity;
  if (!info || sha(await readFile(info.dist))!==info.sha256 || sha(await readFile(info.wrapper))!==info.wrapperSha256) fail('Wrangler or asset guard changed since preparation');
  const cacheDir=join(releaseDir,'wrangler-state'); await mkdir(cacheDir,{recursive:false});
  const reportPath=join(releaseDir,'asset-request-verification.json');
  const guardPath=join(releaseDir,'asset-upload-guard.json');
  const inventory=Object.fromEntries(files.filter(f=>f.path.startsWith('site-copy/')&&f.path!=='site-copy/_redirects').map(f=>['/'+f.path.slice(10),{bytes:f.bytes,sha256:f.sha256}]));
  await writeNew(guardPath,jsonBytes({wranglerDist:info.dist,wranglerSha256:info.sha256,assetRoot:join(stagingPath,'site-copy'),inventory,allowedPaths:plan.approvedChanges.filter(c=>c.path.startsWith('site-copy/')).map(c=>'/'+c.path.slice(10)),candidateManifestSha256:plan.candidateManifestSha256,reportPath,cacheDir,logPath:join(cacheDir,'wrangler.log')}));
  const result=runAuthenticatedWrangler(info.wrapper, [guardPath,'versions', 'upload', '--name', worker, '--config', join(stagingPath, 'wrangler.toml'), '--cwd', stagingPath, '--no-bundle','--outdir',join(cacheDir,'build')], cacheDir,{accountId:plan.account.id,useEnvironmentToken:process.env.PCM_GITHUB_DEPLOYMENT_MODE==='true'});
  let assetGuard;try{assetGuard=await readJson(reportPath,'asset request verification');}catch{}
  return {...result,assetGuard};
}
function productionViewVersion({ versionId, worker = WORKER, wranglerEntry = WRANGLER_ENTRY,accountId }) {
  const result = runAuthenticatedWrangler(wranglerEntry, ['versions', 'view', versionId, '--name', worker, '--json'], HERE,{accountId,versionView:true,useEnvironmentToken:process.env.PCM_GITHUB_DEPLOYMENT_MODE==='true'});
  if (result.exitCode !== 0) return { ...result, version: null };
  if(!result.versionEvidence)return { ...result, version: null, errorType: 'MissingStructuredVersionEvidence' };
  return { ...result, version: result.versionEvidence };
}
function productionDeploy({ versionId, percentage, worker = WORKER, configPath, wranglerEntry = WRANGLER_ENTRY,accountId }) {
  // --yes only suppresses Wrangler's CLI prompt after an exact, separate human authorization has passed validation.
  return runAuthenticatedWrangler(wranglerEntry, ['versions', 'deploy', `${versionId}@${percentage}%`, '--name', worker, '--config', configPath, '--yes'], dirname(configPath),{accountId,useEnvironmentToken:process.env.PCM_GITHUB_DEPLOYMENT_MODE==='true'});
}
export function productionVerifyActive({ versionId, evidencePath, worker = WORKER, expectedSettings, rollbackVersion,accountId, timeoutMs = 120_000 }) {
  const args = ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', PRODUCTION_VERIFIER,
    '-ExpectedVersionId', versionId, '-WorkerName', worker, '-ExpectedTrafficPercentage', '100', '-EvidencePath', evidencePath];
  if(expectedSettings) args.push('-ExpectedConfigurationBase64',Buffer.from(JSON.stringify(expectedSettings)).toString('base64'));
  if(rollbackVersion) args.push('-ExpectedRollbackVersionId',rollbackVersion);
  if(accountId)args.push('-AccountId',accountId);
  if(process.env.PCM_GITHUB_DEPLOYMENT_MODE==='true')args.push('-UseEnvironmentToken');
  const r = spawnSync('powershell.exe', args, { encoding: 'utf8', windowsHide: true, timeout: Math.min(120_000, Math.max(1_000, timeoutMs)) });
  if (r.error) return { exitCode: null, errorType: r.error.name };
  return { exitCode: r.status, errorType: null };
}

export function parseWranglerUploadResult(stdout, exitCode, {verifiedEmptyAssetRequest=false}={}) {
  if (exitCode !== 0) fail('Wrangler upload did not exit successfully');
  const text = String(stdout ?? '');
  const versionLines = text.split(/\r?\n/).filter((line) => /^\s*Worker Version ID\s*:/i.test(line));
  if (versionLines.length !== 1) fail('Wrangler output must contain exactly one Worker Version ID field');
  const match = /^\s*Worker Version ID\s*:\s*([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\s*$/i.exec(versionLines[0]);
  if (!match) fail('Wrangler Worker Version ID field is malformed');
  const assetsSucceeded=/^\s*✨?\s*Success!\s+Uploaded\s+\d+\s+files?\b/im.test(text)
    || (verifiedEmptyAssetRequest&&/^\s*No updated asset files to upload\. Proceeding with deployment\.\.\./im.test(text));
  if (!assetsSucceeded
      || !/^\s*Uploaded\s+newpurely\s+\(/im.test(text)) fail('Wrangler output is missing explicit upload-success evidence');
  return match[1];
}
function normalizeVersionView(raw) {
  const root = raw?.result ?? raw;
  const resources = root?.resources ?? {};
  const runtime = resources.script_runtime ?? root.script_runtime ?? {};
  const bindingsRaw = resources.bindings ?? root.bindings ?? [];
  return {
    id: root?.id ?? root?.version_id ?? null,
    compatibilityDate: runtime.compatibility_date ?? root.compatibility_date ?? root.compatibilityDate ?? null,
    compatibilityFlagsPresent: root?.compatibilityFlagsPresent === true || Object.hasOwn(runtime, 'compatibility_flags') || Object.hasOwn(root, 'compatibility_flags') || Object.hasOwn(root, 'compatibilityFlags'),
    compatibilityFlags: Object.hasOwn(root ?? {}, 'compatibilityFlags') ? root.compatibilityFlags : runtime.compatibility_flags ?? root.compatibility_flags ?? null,
    scriptEtag: root?.script_etag ?? root?.scriptEtag ?? resources.script?.etag ?? null,
    bindings: Array.isArray(bindingsRaw) ? bindingsRaw.map((item) => ({ name: item?.name, type: item?.type })) : null,
  };
}
function parseExpectedConfig(text) {
  const name = /^\s*name\s*=\s*["']([^"']+)["']/m.exec(text)?.[1] ?? null;
  const date = /^\s*compatibility_date\s*=\s*["']([^"']+)["']/m.exec(text)?.[1] ?? null;
  const flagArray = /^\s*compatibility_flags\s*=\s*\[([^\]]*)\]/m.exec(text);
  if (!name || !date || !flagArray) fail('candidate Wrangler config must declare worker name, compatibility date, and explicit compatibility_flags array');
  const flags = [...flagArray[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]).sort();
  const bindings = [];
  const lines = text.split(/\r?\n/); const assetIndex = lines.findIndex((line) => line.trim() === '[assets]');
  let assetBinding = null;
  if (assetIndex >= 0) {
    for (let i = assetIndex + 1; i < lines.length && !/^\s*\[/.test(lines[i]); i++) {
      assetBinding = /^\s*binding\s*=\s*["']([^"']+)["']/.exec(lines[i])?.[1] ?? assetBinding;
    }
  }
  if (assetBinding) bindings.push({ name: assetBinding, type: 'assets' });
  for (const block of text.matchAll(/\[\[secrets_store_secrets\]\]([\s\S]*?)(?=\n\[|$)/g)) {
    const binding = /^\s*binding\s*=\s*["']([^"']+)["']/m.exec(block[1])?.[1];
    if (binding) bindings.push({ name: binding, type: 'secrets_store_secret' });
  }
  return { name, compatibilityDate: date, compatibilityFlags: flags, bindings: bindings.sort((a, b) => a.name.localeCompare(b.name)) };
}
export function verifyUploadedVersion(raw, versionId, configText, expectedResources) {
  const actual = normalizeVersionView(raw); const expected = parseExpectedConfig(configText);
  if (actual.id !== versionId) fail('uploaded Worker version identity does not match Wrangler upload result');
  if (actual.compatibilityDate !== expected.compatibilityDate) fail('uploaded version compatibility date does not match approved candidate config');
  let compatibilityFlagsStatus; const flags = actual.compatibilityFlags;
  if (!actual.compatibilityFlagsPresent || flags === null) compatibilityFlagsStatus = 'INCOMPLETE';
  else if (!Array.isArray(flags) || flags.some((flag) => typeof flag !== 'string' || !flag.trim())) fail('uploaded version compatibility flags have an unexpected type or malformed value');
  else compatibilityFlagsStatus = [...flags].sort().join('|') === expected.compatibilityFlags.join('|') ? 'PASS' : 'MISMATCH';
  const actualBindingIds = Array.isArray(actual.bindings) ? actual.bindings.map((item) => `${item.name}:${item.type}`).sort() : null;
  const expectedBindingIds = expected.bindings.map((item) => `${item.name}:${item.type}`).sort();
  if (!actualBindingIds || JSON.stringify(actualBindingIds) !== JSON.stringify(expectedBindingIds)) fail(`uploaded version binding metadata does not match candidate config (actual=${JSON.stringify(actualBindingIds)}, expected=${JSON.stringify(expectedBindingIds)})`);
  if (typeof actual.scriptEtag !== 'string' || !actual.scriptEtag) fail('uploaded version did not return a script fingerprint');
  if(expectedResources){
    const root=raw?.result??raw,assets=root?.resources?.script_runtime?.assets??root?.assets;
    if(!assets)fail('Uploaded version asset settings are unavailable');
    for(const [key,value] of Object.entries(expectedResources.assets_config))if(assets[key==='run_worker_first'?'raw_run_worker_first':key]!==value)fail('Uploaded version asset configuration mismatch: '+key);
    const redirectsHash=typeof assets.raw_redirects==='string'?sha(Buffer.from(assets.raw_redirects,'utf8')):assets.raw_redirects_sha256;
    if(typeof redirectsHash!=='string'||!/^[0-9a-f]{64}$/i.test(redirectsHash)||redirectsHash!==expectedResources.redirects_sha256)fail('Uploaded version redirects do not match approved package');
  }
  return { versionId, status: compatibilityFlagsStatus, compatibilityFlagsStatus, compatibilityFlags: compatibilityFlagsStatus === 'INCOMPLETE' ? null : flags, compatibilityFlagsPresence: !actual.compatibilityFlagsPresent ? 'missing' : flags === null ? 'null' : 'present', expectedCompatibilityFlags: expected.compatibilityFlags, compatibilityDate: actual.compatibilityDate, bindings: actual.bindings, scriptEtag: actual.scriptEtag };
}

export async function createReleasePlan(options, dependencies = {}) {
  const account=await readAccountBinding();
  validateAccountEnvironment(account.id);
  const candidatePackage = await requireDirectory(options.packagePath, 'candidate package'); await assertOutsideGit(candidatePackage);
  const baselinePath = await requireFile(options.baselinePath, 'baseline');
  const acceptancePath = await requireFile(options.acceptancePath, 'acceptance record');
  const allowlistPath = await requireFile(options.allowlistPath, 'approved-change allowlist');
  const releaseDir = resolve(options.releaseDir);
  if (!isAbsolute(options.releaseDir) || within(releaseDir, candidatePackage) || within(candidatePackage, releaseDir)) fail('release directory must be an explicit separate absolute path');
  await mkdir(releaseDir, { recursive: false });
  const baselineBytes = await readFile(baselinePath); const baselineHash = sha(baselineBytes); const baseline = parseJson(baselineBytes.toString('utf8'), 'baseline');
  if (baseline.worker?.name !== WORKER || baseline.worker?.active_version !== options.workerVersion || !UUID_RE.test(options.workerVersion)) fail('baseline Worker/version does not match requested release target');
  const acceptanceBytes = await readFile(acceptancePath);
  const acceptance = validateBaselineAcceptance({ bytes: acceptanceBytes, baselineBytes, baselineHash, workerName: WORKER, workerVersion: options.workerVersion });
  if (acceptance.status !== 'ACCEPTED') fail(`controlled acceptance did not validate (${acceptance.status})`);
  const rollbackVersion = baseline.worker?.previous_rollback_version;
  if (!UUID_RE.test(rollbackVersion ?? '') || rollbackVersion === options.workerVersion) fail('baseline rollback version is missing or invalid');
  const allowlistBytes = await readFile(allowlistPath);
  const candidate = await scanCandidate(candidatePackage); const manifestBytes = canonicalManifest(candidate.files); const candidateManifestSha256 = sha(manifestBytes);
  await validatePlanAccount({account},await readFile(join(candidatePackage,'wrangler.toml'),'utf8'));
  const manifestPath = join(releaseDir, 'candidate-manifest.json'); await writeNew(manifestPath, manifestBytes);
  const planReportPath = join(releaseDir, 'preflight-owner-review.json');
  const preflightResult = await runUnified({ packagePath: candidatePackage, baselinePath, acceptancePath, allowlistPath, workerVersion: options.workerVersion }, planReportPath, dependencies);
  validatePreflightReport(preflightResult.report, options.workerVersion);
  await verifyFreshAccount({account,productionVersion:options.workerVersion},preflightResult.report);
  const plan = {
    schema: 'pcm-guarded-release-plan/v1', status: 'READY_FOR_OWNER_REVIEW', createdAtUtc: new Date().toISOString(),
    worker: WORKER, account,candidatePackage, candidateManifestPath: manifestPath, candidateManifestSha256,
    baselinePath, baselineSha256: baselineHash, acceptancePath, acceptanceSha256: sha(acceptanceBytes),
    allowlistPath, allowlistSha256: sha(allowlistBytes), productionVersion: options.workerVersion, rollbackVersion,
    initialPreflightReportPath: planReportPath, initialPreflightReportSha256: sha(await readFile(planReportPath)),
    approvedChanges: preflightResult.report.approvedChanges, unexpectedDifferences: preflightResult.report.unexpectedDifferences,
    acceptedLimitations: ACCEPTABLE_BASELINE_LIMITATIONS, deploymentAuthorization: 'NOT GRANTED',
    smokeRequirements: options.smokeRequirements ?? smokePolicy(preflightResult.report.approvedChanges),
    wranglerIntegrity: dependencies.wranglerIntegrity ?? await installedWranglerIntegrity(),
    ...(options.workflow ? {workflow:options.workflow}:{}),
  };
  plan.releasePlanSha256 = sha(jsonBytes(plan));
  const planPath = join(releaseDir, 'release-plan.json'); await writeNew(planPath, jsonBytes(plan));
  return { plan, planPath, text: renderPlan(plan) };
}
export function renderPlan(plan) {
  const changed = plan.approvedChanges.length ? plan.approvedChanges.map((c) => `${c.category} ${c.path}: ${c.before ?? 'ABSENT'} -> ${c.after ?? 'ABSENT'}`).join('\n') : '(none)';
  return [`Worker: ${plan.worker}`, `Cloudflare account: ${plan.account.id}`, `Candidate: ${plan.candidatePackage}`, `Candidate manifest SHA-256: ${plan.candidateManifestSha256}`, `Release plan SHA-256: ${plan.releasePlanSha256}`, `Baseline SHA-256: ${plan.baselineSha256}`, `Allowlist SHA-256: ${plan.allowlistSha256}`, `Production target: ${plan.productionVersion}`, `Rollback target: ${plan.rollbackVersion}`, `Exact approved changes:\n${changed}`, 'Evidence: INCOMPLETE for the two accepted baseline limitations', 'Deployment authorization: NOT GRANTED'].join('\n');
}

function verifyArtifactPath(path, root) { if (within(path, root)) fail('authorization, report, or release artifacts cannot be stored inside the candidate package'); }
async function copyManifestToStage(candidate, files, stage) {
  await mkdir(stage, { recursive: false });
  for (const item of files) { const destination = join(stage, ...item.path.split('/')); await mkdir(dirname(destination), { recursive: true }); await copyFile(join(candidate, ...item.path.split('/')), destination); }
  const copied = await scanCandidate(stage); if (sha(canonicalManifest(copied.files)) !== sha(canonicalManifest(files))) fail('isolated upload snapshot does not match authorized candidate manifest');
}
async function savePreflight(plan, releaseDir, suffix, dependencies) { return checkPreflight(plan, join(releaseDir, `preflight-${suffix}.json`), dependencies); }
async function saveTextArtifact(path, content) { await writeNew(path, jsonBytes(content)); }
function assertUploadReportMatch(plan, report) {
  validatePreflightReport(report, plan.productionVersion);
  if (JSON.stringify(report.approvedChanges) !== JSON.stringify(plan.approvedChanges)) fail('fresh preflight approved-change list differs from owner-reviewed plan');
}

export async function uploadRelease(options, dependencies = {}) {
  const releaseDir = await requireDirectory(options.releaseDir, 'release directory'); const { plan, releasePlanSha256 } = await readPlan(releaseDir);
  const authPath = await requireFile(options.authorizationPath, 'upload authorization'); verifyArtifactPath(authPath, plan.candidatePackage);
  const auth = await loadApproval(authPath, 'UPLOAD', { candidatePackage: plan.candidatePackage });
  const expected = { ...authorizationContext(plan, releasePlanSha256), expectedActiveVersion: null, targetVersion: null, releaseStateSha256: null, acceptedLimitations: plan.acceptedLimitations, compatibilityFlagsAcknowledgedForVersion: null };
  const approver = validateApprovalRecord(auth.record, 'UPLOAD', expected);
  await saveTextArtifact(join(releaseDir, 'upload-authorization.json'), auth.record);
  const candidate = await checkCandidate(plan); await checkAllowlist(plan); await validateAcceptanceAndBaseline(plan, plan.acceptancePath);
  const fresh = await savePreflight(plan, releaseDir, 'before-upload', dependencies); assertUploadReportMatch(plan, fresh);
  const stage = join(releaseDir, 'upload-source'); await copyManifestToStage(candidate.root, candidate.files, stage);
  const uploadFn = dependencies.uploadVersion ?? ((args) => productionUpload(args));
  const finalCandidate = await checkCandidate(plan); await checkAllowlist(plan);
  if (sha(canonicalManifest(finalCandidate.files)) !== sha(canonicalManifest(candidate.files))) fail('candidate changed while preflight was running');
  const finalPreflight = await savePreflight(plan, releaseDir, 'immediately-before-upload', dependencies); assertUploadReportMatch(plan, finalPreflight);
  const stagedCheck = await scanCandidate(stage);
  if (sha(canonicalManifest(stagedCheck.files)) !== plan.candidateManifestSha256) fail('isolated upload snapshot changed before upload');
  validateApprovalRecord(auth.record, 'UPLOAD', expected);
  const uploadResult = await uploadFn({ stagingPath: stage, worker: WORKER, releaseDir, plan, files:candidate.files });
  await saveTextArtifact(join(releaseDir, 'wrangler-upload-output.json'), { exitCode: uploadResult.exitCode ?? null, stdout: safeText(uploadResult.stdout), stderr: safeText(uploadResult.stderr), errorType: uploadResult.errorType ?? null });
  if (uploadResult.exitCode !== 0 || uploadResult.errorType) {
    const failed = { schema: 'pcm-guarded-release-state/v1', stage: 'UPLOAD_FAILED', worker: WORKER, candidateManifestSha256: plan.candidateManifestSha256, deploymentAuthorization: 'NOT GRANTED', rollbackVersion: plan.rollbackVersion };
    await saveTextArtifact(join(releaseDir, 'release-state-upload-failed.json'), failed); fail('Wrangler upload failed; no promotion was attempted');
  }
  const requests=uploadResult.assetGuard;
  const allowed=plan.approvedChanges.filter(c=>c.path.startsWith('site-copy/')).map(c=>'/'+c.path.slice(10));
  if(requests?.status!=='PASS'||!Array.isArray(requests.requestedPaths)||requests.requestedPaths.some(p=>!allowed.includes(p))) fail('Actual upload requests were not verified or contain unexpected assets; promotion blocked');
  if(requests.candidateManifestSha256 && requests.candidateManifestSha256!==plan.candidateManifestSha256) fail('Asset guard belongs to another candidate');
  const assetUploadVerificationPath=join(releaseDir,'asset-upload-verification.json');
  await saveTextArtifact(assetUploadVerificationPath,{...requests,candidateManifestSha256:plan.candidateManifestSha256});
  const stageAfter=await scanCandidate(stage);
  if(sha(canonicalManifest(stageAfter.files))!==plan.candidateManifestSha256) fail('Wrangler changed immutable package; promotion blocked');
  const versionId = parseWranglerUploadResult(uploadResult.stdout, uploadResult.exitCode,{verifiedEmptyAssetRequest:requests.requestedPaths.length===0});
  if (!UUID_RE.test(versionId) || versionId === plan.productionVersion) fail('Wrangler output did not identify a new, valid Worker version');
  const viewFn = dependencies.viewVersion ?? productionViewVersion;
  const view = await viewFn({ versionId, worker: WORKER,accountId:plan.account.id });
  if (view?.exitCode !== undefined && view.exitCode !== 0) fail('could not retrieve uploaded Worker version details');
  let versionVerification;
  try { versionVerification = verifyUploadedVersion(view.version ?? view, versionId, await readFile(join(stage, 'wrangler.toml'), 'utf8'),plan.workflow?(await readJson(plan.baselinePath,'baseline')).expected_settings:null); }
  catch (error) { await saveTextArtifact(join(releaseDir, 'uploaded-version-verification.json'), { status: 'BLOCKED', versionId, detail: safeText(error.message) }); fail(`uploaded version verification blocked: ${error.message}`); }
  await saveTextArtifact(join(releaseDir, 'uploaded-version-verification.json'), { status: versionVerification.status, evidence: versionVerification });
  const releaseState = {
    schema: 'pcm-guarded-release-state/v1', stage: versionVerification.status === 'INCOMPLETE' ? 'UPLOADED_INCOMPLETE_NOT_PROMOTED' : versionVerification.status === 'MISMATCH' ? 'UPLOADED_MISMATCH_NOT_PROMOTED' : 'UPLOADED_VERIFIED_NOT_PROMOTED', worker: WORKER,
    versionId, productionVersionBeforeUpload: plan.productionVersion, rollbackVersion: plan.rollbackVersion,
    compatibilityFlagsStatus: versionVerification.compatibilityFlagsStatus,
    candidatePackage: plan.candidatePackage, candidateManifestPath: plan.candidateManifestPath, candidateManifestSha256: plan.candidateManifestSha256,
    releasePlanSha256, uploadAuthorizationSha256: sha(auth.bytes), uploadedVersionVerificationPath: join(releaseDir, 'uploaded-version-verification.json'),
    deploymentAuthorization: 'NOT GRANTED', promotionApprovalRequired: true, uploadedAtUtc: new Date().toISOString(),
    previewUrl: /Version Preview URL:\s*(https:\/\/[^\s]+)/.exec(uploadResult.stdout)?.[1] ?? null,
    uploadOutputSha256:sha(await readFile(join(releaseDir,'wrangler-upload-output.json'))),
    assetUploadVerificationPath,assetUploadVerificationSha256:sha(await readFile(assetUploadVerificationPath)),
  };
  await saveTextArtifact(join(releaseDir, 'release-state.json'), releaseState);
  if (versionVerification.status === 'MISMATCH') fail('uploaded version has conflicting compatibility flags; promotion is blocked');
  return releaseState;
}

// Recover only the local state for a version that already exists. This path
// has no upload or deploy dependency and refuses to overwrite prior evidence.
export async function recoverUploadedRelease(options, dependencies = {}) {
  const releaseDir = await requireDirectory(options.releaseDir, 'release directory');
  const { plan, releasePlanSha256 } = await readPlan(releaseDir);
  if (!UUID_RE.test(options.expectedVersionId ?? '') || options.expectedVersionId === plan.productionVersion) fail('recovery requires the exact new uploaded version ID');
  const statePath = join(releaseDir, 'release-state.json');
  const prior = await lstat(statePath).catch(e => { if (e.code !== 'ENOENT') throw e; return null; });
  if (prior) {
    const state = await readJson(statePath, 'existing release state');
    if (state.versionId !== options.expectedVersionId || state.releasePlanSha256 !== releasePlanSha256 || state.candidateManifestSha256 !== plan.candidateManifestSha256) fail('existing release state belongs to a different upload');
    return { ...state, resumedWithoutRecoveryWrite: true };
  }
  const candidate = await checkCandidate(plan); await checkAllowlist(plan); await validateAcceptanceAndBaseline(plan, plan.acceptancePath);
  const auth = await loadApproval(options.authorizationPath, 'UPLOAD', { candidatePackage: plan.candidatePackage });
  const expected = { ...authorizationContext(plan, releasePlanSha256), expectedActiveVersion: null, targetVersion: null, releaseStateSha256: null, acceptedLimitations: plan.acceptedLimitations, compatibilityFlagsAcknowledgedForVersion: null };
  validateApprovalRecord(auth.record, 'UPLOAD', expected);
  const storedAuthorization = await readJson(join(releaseDir, 'upload-authorization.json'), 'retained upload authorization');
  if (!compareJson(storedAuthorization, auth.record)) fail('retained upload authorization differs from the exact authorized record');

  const outputPath = join(releaseDir, 'wrangler-upload-output.json');
  const uploadOutputBytes = await readFile(outputPath); const uploadOutput = parseJson(uploadOutputBytes.toString('utf8'), 'retained Wrangler upload output');
  const versionId = parseWranglerUploadResult(uploadOutput.stdout, uploadOutput.exitCode);
  if (versionId !== options.expectedVersionId || uploadOutput.errorType) fail('retained upload output does not identify the authorized recovered version');
  const assetPath = join(releaseDir, 'asset-upload-verification.json');
  const assetBytes = await readFile(assetPath); const asset = parseJson(assetBytes.toString('utf8'), 'retained asset upload verification');
  const allowedPaths = plan.approvedChanges.filter(c => c.path.startsWith('site-copy/')).map(c => '/' + c.path.slice(10));
  if (asset.status !== 'PASS' || asset.candidateManifestSha256 !== plan.candidateManifestSha256 || JSON.stringify(asset.requestedPaths) !== JSON.stringify(allowedPaths) || !allowedPaths.length) fail('retained asset-upload evidence does not exactly match the approved asset list');
  const requestPath = join(releaseDir, 'asset-request-verification.json');
  const request = await readJson(requestPath, 'retained actual asset request verification');
  if (request.status !== 'PASS' || request.candidateManifestSha256 !== plan.candidateManifestSha256 || JSON.stringify(request.requestedPaths) !== JSON.stringify(allowedPaths)) fail('retained actual upload-request evidence is missing or inconsistent');
  const manifestBytes = await readFile(join(releaseDir, 'candidate-manifest.json'));
  if (!candidate.files.length || sha(manifestBytes) !== plan.candidateManifestSha256 || !manifestBytes.equals(canonicalManifest(candidate.files))) fail('retained candidate manifest does not match the complete current package inventory');

  const preflightPath = join(releaseDir, `preflight-recovery-${randomUUID()}.json`);
  const fresh = await checkPreflight(plan, preflightPath, dependencies.preflightDependencies ?? {});
  if (fresh.production.allocations.length !== 1 || fresh.production.allocations[0].versionId !== plan.productionVersion || fresh.production.allocations[0].percentage !== 100) fail('fresh production verification does not show the approved baseline at 100%');
  const baseline = await readJson(plan.baselinePath, 'accepted baseline');
  const viewFn = dependencies.viewVersion ?? productionViewVersion;
  const view = await viewFn({ versionId, worker: WORKER, accountId: plan.account.id });
  if (view?.exitCode !== undefined && view.exitCode !== 0) fail('fresh read-only lookup of the retained uploaded version failed');
  const versionVerification = verifyUploadedVersion(view?.version ?? view, versionId,
    await readFile(join(releaseDir, 'upload-source', 'wrangler.toml'), 'utf8'), baseline.expected_settings);

  const verificationPath = join(releaseDir, 'uploaded-version-verification-recovery.json');
  const verification = {
    schema: 'pcm-uploaded-version-verification-recovery/v1', status: versionVerification.status,
    source: 'fresh read-only exact-version Cloudflare lookup', versionId, evidence: versionVerification,
    productionPreflightPath: preflightPath, productionVersion: plan.productionVersion,
    productionTrafficPercentage: 100, inactiveVersionTrafficPercentage: 0,
    inactiveStatusBasis: 'Fresh deployments evidence shows the accepted production version alone at 100%; the version-specific record confirms the uploaded version exists.',
    limitations: versionVerification.status === 'INCOMPLETE' ? ['Exact-version compatibility flags are not exposed by the available version response.'] : [],
  };
  await saveTextArtifact(verificationPath, verification);
  const verificationBytes = await readFile(verificationPath), preflightBytes = await readFile(preflightPath);
  const state = {
    schema: 'pcm-guarded-release-state/v1', stage: versionVerification.status === 'INCOMPLETE' ? 'UPLOADED_INCOMPLETE_NOT_PROMOTED' : 'UPLOADED_VERIFIED_NOT_PROMOTED', worker: WORKER,
    versionId, productionVersionBeforeUpload: plan.productionVersion, rollbackVersion: plan.rollbackVersion,
    compatibilityFlagsStatus: versionVerification.compatibilityFlagsStatus,
    candidatePackage: plan.candidatePackage, candidateManifestPath: plan.candidateManifestPath, candidateManifestSha256: plan.candidateManifestSha256,
    releasePlanSha256, uploadAuthorizationSha256: sha(auth.bytes), uploadedVersionVerificationPath: verificationPath,
    deploymentAuthorization: 'NOT GRANTED', promotionApprovalRequired: true, uploadedAtUtc: null, recoveredAtUtc: new Date().toISOString(),
    uploadTimeEvidence: 'Original upload output is retained; its timestamp is not independently established.',
    previewUrl: /Version Preview URL:\s*(https:\/\/[^\s]+)/.exec(uploadOutput.stdout)?.[1] ?? null,
    uploadOutputSha256: sha(uploadOutputBytes), assetUploadVerificationPath: assetPath, assetUploadVerificationSha256: sha(assetBytes),
    recoveryEvidence: { productionPreflightPath: preflightPath, productionPreflightSha256: sha(preflightBytes), uploadedVersionVerificationPath: verificationPath, uploadedVersionVerificationSha256: sha(verificationBytes), exactVersionLookup: 'PASS', productionBaselineAt100Percent: 'PASS', noUploadOrPromotionPerformed: true },
  };
  await saveTextArtifact(statePath, state);
  return state;
}

async function readRelease(releaseDir) {
  const planState = await readPlan(releaseDir); const previewPath=join(releaseDir,'release-state-preview.json');
  const path = await lstat(previewPath).then(()=>previewPath,e=>{if(e.code!=='ENOENT')throw e;return join(releaseDir,'release-state.json');}); const state = await readJson(path, 'release state');
  if (state.schema !== 'pcm-guarded-release-state/v1' || !['UPLOADED_VERIFIED_NOT_PROMOTED', 'UPLOADED_INCOMPLETE_NOT_PROMOTED'].includes(state.stage) || !UUID_RE.test(state.versionId ?? '') || state.candidateManifestSha256 !== planState.plan.candidateManifestSha256) fail('release state is not ready for promotion');
  if ((state.stage === 'UPLOADED_INCOMPLETE_NOT_PROMOTED' && state.compatibilityFlagsStatus !== 'INCOMPLETE') || (state.stage === 'UPLOADED_VERIFIED_NOT_PROMOTED' && state.compatibilityFlagsStatus !== 'PASS')) fail('uploaded release flags status and release state are inconsistent');
  if(state.uploadOutputSha256){
    const output=await readFile(join(releaseDir,'wrangler-upload-output.json'));
    if(sha(output)!==state.uploadOutputSha256)fail('Uploaded version provenance changed');
    const preview=/Version Preview URL:\s*(https:\/\/[^\s]+)/.exec(parseJson(output.toString(),'upload output').stdout)?.[1]??null;
    if(state.previewUrl!==preview)fail('Preview URL differs from retained upload provenance');
  }
  if(state.assetUploadVerificationSha256&&sha(await readFile(state.assetUploadVerificationPath))!==state.assetUploadVerificationSha256)fail('Asset upload verification changed');
  if(state.recoveryEvidence){
    const recovery=state.recoveryEvidence;
    if(recovery.noUploadOrPromotionPerformed!==true||recovery.exactVersionLookup!=='PASS'||recovery.productionBaselineAt100Percent!=='PASS'||recovery.uploadedVersionVerificationPath!==state.uploadedVersionVerificationPath)fail('recovered release provenance is incomplete');
    const [preflightBytes,verificationBytes]=await Promise.all([readFile(recovery.productionPreflightPath),readFile(recovery.uploadedVersionVerificationPath)]);
    if((recovery.productionPreflightSha256&&sha(preflightBytes)!==recovery.productionPreflightSha256)||(recovery.uploadedVersionVerificationSha256&&sha(verificationBytes)!==recovery.uploadedVersionVerificationSha256))fail('recovery verification evidence changed');
    const preflight=parseJson(preflightBytes.toString('utf8'),'recovery production preflight');
    validatePreflightReport(preflight,planState.plan.productionVersion);
    const verification=parseJson(verificationBytes.toString('utf8'),'recovered uploaded-version verification');
    if(verification.versionId!==state.versionId||verification.status!==state.compatibilityFlagsStatus||verification.productionVersion!==planState.plan.productionVersion||verification.productionTrafficPercentage!==100)fail('recovered uploaded-version verification does not match release state');
  }
  return { ...planState, state, statePath: path, releaseStateSha256: sha(await readFile(path)) };
}
function deploymentVerifierEvidence(evidence, versionId) {
  const check = (name) => evidence?.checks?.find((item) => item.name === name)?.status === 'PASS';
  const allocations = evidence?.observed_production_allocations;
  const correctTraffic = Array.isArray(allocations) && allocations.length === 1 && allocations[0]?.version_id?.value === versionId && allocations[0]?.percentage?.value === 100;
  return evidence?.worker === WORKER && evidence?.observed_version_id === versionId && correctTraffic && check('active version and traffic') && check('version identity');
}

const PROMOTION_VERIFY_RETRY = Object.freeze({ windowMs: 150_000, requestTimeoutMs: 20_000, delaysMs: [0, 2_000, 5_000, 10_000, 15_000, 20_000, 25_000, 30_000] });
function promotionVerificationClass(evidence, versionId, verifyResult) {
  const check = (name) => evidence?.checks?.find((item) => item.name === name)?.status;
  const identity = check('version identity');
  if (identity === 'MISMATCH' || (evidence?.observed_version_id && evidence.observed_version_id !== versionId)) return 'VERSION_IDENTITY_MISMATCH';
  if (identity !== 'PASS' || evidence?.worker !== WORKER) return 'API_ERROR';
  if (evidence.checks?.some((item) => item.status === 'MISMATCH' && !['active version and traffic', 'version identity'].includes(item.name))) return 'CONFIGURATION_MISMATCH';
  const allocations = evidence?.observed_production_allocations;
  if (!Array.isArray(allocations) || allocations.length === 0) return 'API_ERROR';
  let total = 0;
  for (const allocation of allocations) {
    const id = allocation?.version_id?.value;
    const percentage = allocation?.percentage?.value;
    if (typeof id !== 'string' || !UUID_RE.test(id) || typeof percentage !== 'number' || !Number.isFinite(percentage) || percentage < 0 || percentage > 100) return 'INVALID_ALLOCATION_EVIDENCE';
    total += percentage;
  }
  if (Math.abs(total - 100) > 0.0001) return 'INVALID_ALLOCATION_EVIDENCE';
  const required = ['compatibility date', 'binding names and types', 'version source fingerprint', 'versioned configuration scope'];
  if (required.some((name) => check(name) !== 'PASS')) return 'VERIFICATION_BLOCKED';
  if (evidence.checks?.some((item) => item.status === 'BLOCKED' && item.name !== 'compatibility flags')) return 'VERIFICATION_BLOCKED';
  if (deploymentVerifierEvidence(evidence, versionId)) return 'VERIFIED';
  if (check('active version and traffic') === 'MISMATCH' || check('active version and traffic') === 'BLOCKED') return 'TRAFFIC_PENDING';
  if (verifyResult?.errorType || verifyResult?.exitCode !== 0) return 'API_ERROR';
  return 'API_ERROR';
}
function promotionApiStatuses(evidence) {
  return Array.isArray(evidence?.api_evidence) ? evidence.api_evidence.map((item) => ({ endpoint: item.endpoint ?? null, http_status: item.http_status ?? null, success: item.success ?? null })) : [];
}
export async function verifyPromotionTraffic({ releaseDir, versionId, verifyFn, policy = PROMOTION_VERIFY_RETRY, now = Date.now, sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms)) }) {
  const started = now(); const deadline = started + policy.windowMs; const attempts = []; let lastEvidence = null; let lastClass = 'API_ERROR';
  for (let index = 0; index < policy.delaysMs.length; index++) {
    if (index > 0) {
      const delay = policy.delaysMs[index];
      if (now() + delay >= deadline) break;
      await sleep(delay);
    }
    if (now() >= deadline) break;
    const attemptNumber = attempts.length + 1;
    const stamp = String(attemptNumber).padStart(2, '0');
    const evidencePath = join(releaseDir, `post-promotion-verification-attempt-${stamp}.json`);
    const attemptStarted = now(); let result = null; let evidence = null;
    try {
      const remaining = Math.max(1_000, deadline - attemptStarted);
      result = await verifyFn({ versionId, worker: WORKER, evidencePath, timeoutMs: Math.min(policy.requestTimeoutMs, remaining) });
      evidence = result?.evidence ?? await readJson(evidencePath, 'post-promotion verifier attempt evidence');
    } catch (error) {
      result = { exitCode: null, errorType: error?.name ?? 'VerifierError' };
      try { evidence = await readJson(evidencePath, 'post-promotion verifier attempt evidence'); } catch { }
    }
    const finished = now(); lastEvidence = evidence; lastClass = promotionVerificationClass(evidence, versionId, result);
    if (evidence) {
      try { await readJson(evidencePath, 'post-promotion verifier attempt evidence'); }
      catch (error) { if (error?.code === 'ENOENT') await saveTextArtifact(evidencePath, evidence); else throw error; }
    }
    const attempt = { attempt: attemptNumber, started_at_utc: new Date(attemptStarted).toISOString(), finished_at_utc: new Date(finished).toISOString(), duration_ms: Math.max(0, finished - attemptStarted), classification: lastClass, verifier_exit_code: result?.exitCode ?? null, verifier_error_type: result?.errorType ?? null, expected_version_id: versionId, observed_version_id: evidence?.observed_version_id ?? null, traffic_check: evidence?.checks?.find((item) => item.name === 'active version and traffic')?.status ?? null, version_identity_check: evidence?.checks?.find((item) => item.name === 'version identity')?.status ?? null, api_responses: promotionApiStatuses(evidence), evidence_path: evidence ? evidencePath : null, evidence_sha256: evidence ? sha(jsonBytes(evidence)) : null };
    await saveTextArtifact(join(releaseDir, `post-promotion-verification-attempt-${stamp}-audit.json`), attempt);
    attempts.push(attempt);
    if (['VERIFIED', 'VERSION_IDENTITY_MISMATCH', 'INVALID_ALLOCATION_EVIDENCE', 'CONFIGURATION_MISMATCH', 'VERIFICATION_BLOCKED'].includes(lastClass)) break;
  }
  const finalEvidencePath = join(releaseDir, 'post-promotion-verification.json');
  if (lastEvidence) await saveTextArtifact(finalEvidencePath, lastEvidence);
  const finishedAt = now();
  const exhausted = lastClass === 'TRAFFIC_PENDING' || lastClass === 'API_ERROR';
  const resultClass = lastClass === 'VERIFIED' ? 'VERIFIED' : (exhausted || attempts.length === 0) && (finishedAt >= deadline || attempts.length >= policy.delaysMs.length) ? 'RETRY_WINDOW_EXPIRED' : lastClass;
  const summary = { schema: 'pcm-promotion-verification-attempts/v1', expected_version_id: versionId, started_at_utc: new Date(started).toISOString(), finished_at_utc: new Date(finishedAt).toISOString(), retry_window_ms: policy.windowMs, elapsed_ms: Math.max(0, finishedAt - started), result: resultClass === 'VERIFIED' ? 'PASS' : 'INCOMPLETE', final_classification: resultClass, final_observation_classification: lastClass, attempt_count: attempts.length, attempts, final_evidence_path: lastEvidence ? finalEvidencePath : null };
  await saveTextArtifact(join(releaseDir, 'post-promotion-verification-attempts.json'), summary);
  return { evidence: lastEvidence, evidencePath: lastEvidence ? finalEvidencePath : null, attempts, classification: resultClass, passed: resultClass === 'VERIFIED', exitCode: attempts.at(-1)?.verifier_exit_code ?? null };
}
export async function promoteRelease(options, dependencies = {}) {
  const releaseDir = await requireDirectory(options.releaseDir, 'release directory'); const loaded = await readRelease(releaseDir); const { plan, state, releasePlanSha256 } = loaded;
  const immediateRollbackVersion = state.productionVersionBeforeUpload;
  if (!UUID_RE.test(immediateRollbackVersion ?? '') || immediateRollbackVersion !== plan.productionVersion) fail('recorded immediate rollback target does not match the release plan production version');
  const authPath = await requireFile(options.authorizationPath, 'promotion authorization'); verifyArtifactPath(authPath, plan.candidatePackage);
  const auth = await loadApproval(authPath, 'PROMOTE', { candidatePackage: plan.candidatePackage });
  const incompleteFlags = state.compatibilityFlagsStatus === 'INCOMPLETE';
  const expected = { ...authorizationContext(plan, releasePlanSha256), rollbackVersion: immediateRollbackVersion, expectedActiveVersion: plan.productionVersion, targetVersion: state.versionId, releaseStateSha256: loaded.releaseStateSha256, acceptedLimitations: incompleteFlags ? [UPLOADED_FLAGS_LIMITATION] : [], compatibilityFlagsAcknowledgedForVersion: incompleteFlags ? state.versionId : null };
  validateApprovalRecord(auth.record, 'PROMOTE', expected);
  if(!state.previewSmokeEvidencePath||!state.previewSmokeSha256) fail('Required preview smoke evidence is missing; promotion blocked');
  const smoke=await validateSmoke({evidencePath:state.previewSmokeEvidencePath,plan,state,phase:'preview',expectedHomepageTitle:state.previewSmokeExpectedHomepageTitle});
  if(smoke.sha256!==state.previewSmokeSha256) fail('Preview smoke evidence changed after review');
  await saveTextArtifact(join(releaseDir, 'promotion-authorization.json'), auth.record);
  const candidate = await checkCandidate(plan); await checkAllowlist(plan); await validateAcceptanceAndBaseline(plan, plan.acceptancePath);
  const fresh = await savePreflight(plan, releaseDir, 'before-promotion', dependencies); assertUploadReportMatch(plan, fresh);
  const viewFn = dependencies.viewVersion ?? productionViewVersion; const view = await viewFn({ versionId: state.versionId, worker: WORKER,accountId:plan.account.id });
  const currentVersionVerification = verifyUploadedVersion(view.version ?? view, state.versionId, await readFile(join(releaseDir, 'upload-source', 'wrangler.toml'), 'utf8'),plan.workflow?(await readJson(plan.baselinePath,'baseline')).expected_settings:null);
  if (currentVersionVerification.status === 'MISMATCH') fail('uploaded version compatibility flags conflict with the approved config; promotion is blocked');
  if (currentVersionVerification.status === 'INCOMPLETE' && !incompleteFlags) fail('compatibility flags became unavailable after review; a new exact-version promotion approval is required');
  const deployFn = dependencies.deployVersion ?? productionDeploy;
  await validatePlanAccount(plan,await readFile(join(releaseDir,'upload-source','wrangler.toml'),'utf8'));
  const deployResult = await deployFn({ versionId: state.versionId, percentage: 100, worker: WORKER, configPath: join(releaseDir, 'upload-source', 'wrangler.toml'),accountId:plan.account.id });
  await saveTextArtifact(join(releaseDir, 'wrangler-promotion-output.json'), { exitCode: deployResult.exitCode ?? null, stdout: safeText(deployResult.stdout), stderr: safeText(deployResult.stderr), errorType: deployResult.errorType ?? null });
  if (deployResult.exitCode !== 0 || deployResult.errorType) fail('Wrangler promotion failed; no automatic rollback was attempted');
  const verifyFn = dependencies.verifyProduction ?? productionVerifyActive;
  const verification = await verifyPromotionTraffic({ releaseDir, versionId: state.versionId, verifyFn: (request) => verifyFn({ ...request, accountId: plan.account.id }), ...(dependencies.promotionVerificationPolicy ? { policy: dependencies.promotionVerificationPolicy } : {}), ...(dependencies.verificationNow ? { now: dependencies.verificationNow } : {}), ...(dependencies.verificationSleep ? { sleep: dependencies.verificationSleep } : {}) });
  const evidence = verification.evidence; const evidencePath = verification.evidencePath ?? join(releaseDir, 'post-promotion-verification.json');
  const trafficPass = verification.passed;
  const flagsEvidence = evidence?.checks?.find((item) => item.name === 'compatibility flags')?.status;
  await saveTextArtifact(join(releaseDir, 'post-promotion-summary.json'), { status: trafficPass ? 'PASS_FOR_VERSION_AND_TRAFFIC' : 'INCOMPLETE_OR_MISMATCH', verifierExitCode: verification.exitCode, verificationClassification: verification.classification, verificationAttempts: verification.attempts.length, versionId: evidence?.observed_version_id ?? null, evidencePath, attemptsPath: join(releaseDir, 'post-promotion-verification-attempts.json'), compatibilityFlags: flagsEvidence === 'BLOCKED' ? 'INCOMPLETE' : flagsEvidence ?? 'INCOMPLETE', deploymentAuthorization: 'NOT GRANTED', rollbackVersion: immediateRollbackVersion, historicalFallbackVersion: plan.rollbackVersion });
  const promoted = { ...state, stage: trafficPass ? 'PROMOTED_VERIFIED' : 'PROMOTED_VERIFICATION_INCOMPLETE', promotionAuthorizationSha256: sha(auth.bytes), productionVersionAfterPromotion: evidence?.observed_version_id ?? null, postPromotionTrafficVerified: Boolean(trafficPass), deploymentAuthorization: 'CONSUMED_FOR_THIS_PROMOTION_ONLY', rollbackVersion: immediateRollbackVersion, historicalFallbackVersion: plan.rollbackVersion };
  await saveTextArtifact(join(releaseDir, 'release-state-post-promotion.json'), promoted);
  return promoted;
}

export async function rollbackRelease(options, dependencies = {}) {
  const releaseDir = await requireDirectory(options.releaseDir, 'release directory'); const loaded = await readRelease(releaseDir); const { plan, state, releasePlanSha256 } = loaded;
  const immediateRollbackVersion = state.productionVersionBeforeUpload;
  if (!UUID_RE.test(immediateRollbackVersion ?? '') || immediateRollbackVersion !== plan.productionVersion || immediateRollbackVersion === state.versionId) fail('recorded immediate rollback target is invalid or does not match the approved production baseline');
  const authPath = await requireFile(options.authorizationPath, 'rollback authorization'); verifyArtifactPath(authPath, plan.candidatePackage);
  const auth = await loadApproval(authPath, 'ROLLBACK', { candidatePackage: plan.candidatePackage });
  const expected = { ...authorizationContext(plan, releasePlanSha256), rollbackVersion: immediateRollbackVersion, expectedActiveVersion: state.versionId, targetVersion: immediateRollbackVersion, releaseStateSha256: loaded.releaseStateSha256, acceptedLimitations: [], compatibilityFlagsAcknowledgedForVersion: null };
  validateApprovalRecord(auth.record, 'ROLLBACK', expected);
  const verifyFn = dependencies.verifyProduction ?? productionVerifyActive;
  const beforePath = join(releaseDir, 'pre-rollback-verification.json'); const before = await verifyFn({ versionId: state.versionId, worker: WORKER, evidencePath: beforePath,accountId:plan.account.id });
  let beforeEvidence = null; try { beforeEvidence = before.evidence ?? await readJson(beforePath, 'pre-rollback verification evidence'); } catch { }
  if (!deploymentVerifierEvidence(beforeEvidence, state.versionId)) fail('active production version is not the uploaded version; rollback was not attempted');
  await saveTextArtifact(join(releaseDir, 'rollback-authorization.json'), auth.record);
  const deployFn = dependencies.deployVersion ?? productionDeploy;
  await validatePlanAccount(plan,await readFile(join(releaseDir,'upload-source','wrangler.toml'),'utf8'));
  const result = await deployFn({ versionId: immediateRollbackVersion, percentage: 100, worker: WORKER, configPath: join(releaseDir, 'upload-source', 'wrangler.toml'),accountId:plan.account.id });
  await saveTextArtifact(join(releaseDir, 'wrangler-rollback-output.json'), { exitCode: result.exitCode ?? null, stdout: safeText(result.stdout), stderr: safeText(result.stderr), errorType: result.errorType ?? null });
  if (result.exitCode !== 0 || result.errorType) fail('explicitly approved rollback command failed');
  const afterPath = join(releaseDir, 'post-rollback-verification.json'); const after = await verifyFn({ versionId: immediateRollbackVersion, worker: WORKER, evidencePath: afterPath,accountId:plan.account.id });
  let afterEvidence = null; try { afterEvidence = after.evidence ?? await readJson(afterPath, 'post-rollback verification evidence'); } catch { }
  const verified = deploymentVerifierEvidence(afterEvidence, immediateRollbackVersion);
  const stateAfter = { ...state, stage: verified ? 'ROLLED_BACK_VERIFIED' : 'ROLLED_BACK_VERIFICATION_INCOMPLETE', rollbackAuthorizationSha256: sha(auth.bytes), rollbackVersion: immediateRollbackVersion, historicalFallbackVersion: plan.rollbackVersion, postRollbackTrafficVerified: verified, deploymentAuthorization: 'CONSUMED_FOR_THIS_ROLLBACK_ONLY' };
  await saveTextArtifact(join(releaseDir, 'release-state-post-rollback.json'), stateAfter);
  return stateAfter;
}

function renderHelp() {
  const workflow = 'Workflow: node guarded-deployment-runner.mjs workflow prepare --selection ABS_JSON --changes ABS_JSON --run-dir NEW_DIR\nWorkflow stages: verify/report --run-dir DIR; upload/promote --run-dir DIR --authorization ABS_JSON (manual) or upload-approved/promote-approved --run-dir DIR (interactive); recover --run-dir DIR --authorization ABS_JSON --version-id UUID; preview/confirm --run-dir DIR --evidence ABS_JSON\nInteractive owner authorization is opt-in and still requires a protected preview before promotion. Run upload-approved/promote-approved directly in the visible Codex-attached PowerShell terminal; do not launch them in a detached exec session or type approval into a different window. See WORKFLOW.md for evidence and restart rules.\n\n';
  return workflow + `Prepare/review: node guarded-deployment-runner.mjs prepare --package ABS_DIR --baseline ABS_JSON --acceptance ABS_JSON --allowlist ABS_JSON --worker-version UUID --release-dir NEW_DIR\nAccept/select production baseline: node guarded-deployment-runner.mjs accept-baseline --draft-dir DIR --selection ABS_JSON --expected-current-version UUID --output-dir NEW_DIR --baseline-sha256 SHA256 --manifest-sha256 SHA256 --release-plan ABS_JSON --release-plan-sha256 SHA256 --release-state ABS_JSON --confirmation-evidence ABS_JSON --confirmation-sha256 SHA256 --verification-sha256 SHA256 --approver "Edward Kita" --approved-at YYYY-MM-DD --review-by YYYY-MM-DD [--baseline-adoption-profile batch2-v970-one-time]\nUpload: node guarded-deployment-runner.mjs upload --release-dir DIR --authorization ABS_JSON\nPromote: node guarded-deployment-runner.mjs promote --release-dir DIR --authorization ABS_JSON\nRollback: node guarded-deployment-runner.mjs rollback --release-dir DIR --authorization ABS_JSON\nNo command accepts --yes. Promotion internally passes Wrangler's prompt flag only after matching a separate PROMOTE authorization.`;
}
export function parseCli(argv) {
  const [action, ...rest] = argv; const allowed = new Set(['prepare', 'upload', 'promote', 'rollback', 'accept-baseline']); if (!allowed.has(action)) fail('first argument must be prepare, upload, promote, rollback, or accept-baseline');
  const args = {}; for (let i = 0; i < rest.length; i += 2) { const k = rest[i]; if (!k?.startsWith('--') || !rest[i + 1] || rest[i + 1].startsWith('--') || Object.hasOwn(args, k)) fail(`invalid or duplicate argument: ${k}`); args[k] = rest[i + 1]; }
  if (Object.hasOwn(args, '--yes')) fail('--yes is not an authorization input');
  if (action === 'prepare') { const names = ['--package','--baseline','--acceptance','--allowlist','--worker-version','--release-dir']; if (Object.keys(args).some((k) => !names.includes(k)) || names.some((k) => !args[k])) fail('prepare requires package, baseline, acceptance, allowlist, worker-version, release-dir'); return { action, options: { packagePath: args['--package'], baselinePath: args['--baseline'], acceptancePath: args['--acceptance'], allowlistPath: args['--allowlist'], workerVersion: args['--worker-version'], releaseDir: args['--release-dir'] } }; }
  if (action === 'accept-baseline') {
    const names = ['--draft-dir','--selection','--expected-current-version','--output-dir','--baseline-sha256','--manifest-sha256','--release-plan','--release-plan-sha256','--release-state','--confirmation-evidence','--confirmation-sha256','--verification-sha256','--approver','--approved-at','--review-by','--baseline-adoption-profile'];
    const required = names.filter((name) => name !== '--baseline-adoption-profile');
    if (Object.keys(args).some((k) => !names.includes(k)) || required.some((k) => !args[k])) fail('accept-baseline requires the exact draft, release policy/state, predecessor, evidence hashes, output, and owner identity/date fields');
    if (args['--baseline-adoption-profile'] && args['--baseline-adoption-profile'] !== 'batch2-v970-one-time') fail('unsupported one-time baseline-adoption profile');
    return { action, options: { draftDir: args['--draft-dir'], selectionPath: args['--selection'], expectedCurrentVersion: args['--expected-current-version'], outputDir: args['--output-dir'], baselineSha256: args['--baseline-sha256'], manifestSha256: args['--manifest-sha256'], releasePlanPath: args['--release-plan'], releasePlanSha256: args['--release-plan-sha256'], releaseStatePath: args['--release-state'], confirmationEvidencePath: args['--confirmation-evidence'], confirmationSha256: args['--confirmation-sha256'], verificationEvidenceSha256: args['--verification-sha256'], approver: args['--approver'], approverRole: 'business-owner', approvedAt: args['--approved-at'], reviewBy: args['--review-by'], baselineAdoptionProfile: args['--baseline-adoption-profile'] } };
  }
  if (Object.keys(args).some((k) => !['--release-dir','--authorization'].includes(k)) || !args['--release-dir'] || !args['--authorization']) fail(`${action} requires release-dir and a separate authorization file`);
  return { action, options: { releaseDir: args['--release-dir'], authorizationPath: args['--authorization'] } };
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
// Finish evaluating the exported runner before loading workflow, which imports
// those exports (also through the draft recorder). Awaiting here at module scope
// would make each module wait for the other to finish evaluating.
async function main() {
  if (process.argv.includes('--help')) console.log(renderHelp());
  else {
    try {
      if(process.argv[2]==='workflow'){
        const {runWorkflowCli}=await import('./deployment-workflow.mjs');
        const result=await runWorkflowCli(process.argv.slice(3));
        console.log(result.summaryText??JSON.stringify(result,null,2));
      }else{
        const { action, options } = parseCli(process.argv.slice(2));
        if (action === 'accept-baseline') {
          if (!stdin.isTTY || !stdout.isTTY) fail('accept-baseline requires an interactive terminal for explicit business-owner approval');
          const phrase = baselineApprovalPhrase({ version: JSON.parse(await readFile(join(options.draftDir, 'baseline.DRAFT.json'), 'utf8')).worker.active_version, baselineSha256: options.baselineSha256,
            adoptionProfile: options.baselineAdoptionProfile,
            adoptionEvidenceSha256: options.baselineAdoptionProfile ? options.confirmationSha256 : null });
          console.log(`Owner approval required. Review and acknowledge all documented limitations.\nType exactly:\n${phrase}`);
          const rl = createInterface({ input: stdin, output: stdout });
          try { options.approvalPhrase = await rl.question('Approval: '); } finally { rl.close(); }
          const result = await acceptProductionBaseline(options);
          console.log(JSON.stringify(result, null, 2));
        } else {
          const op = action === 'prepare' ? createReleasePlan : action === 'upload' ? uploadRelease : action === 'promote' ? promoteRelease : rollbackRelease;
          const result = await op(options); console.log(action === 'prepare' ? result.text : JSON.stringify(result, null, 2));
        }
      }
    } catch (error) { console.error(`BLOCKED: ${safeText(error instanceof Error ? error.message : 'guarded deployment operation failed')}`); process.exitCode = 1; }
  }
}
if (invoked) void main();
