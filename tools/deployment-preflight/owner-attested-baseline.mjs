import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';

const BASELINE_SCHEMA = 'pcm-controlled-deployment-baseline/v1';
const RETAINED_SCHEMA = 'pcm-controlled-deployment-baseline/v2';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HEX256 = /^[0-9a-f]{64}$/i;
const REQUIRED_FILES = ['site-copy/_redirects', 'worker/index.mjs', 'wrangler.toml'];

function fail(message) { throw new Error(message); }
function plainObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null); }
function hash(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function fingerprint(record) { return record ? `${record.size}:${record.sha256}` : null; }

function validRelativePath(value, label) {
  if (typeof value !== 'string' || value.length === 0 || value.includes('\\') || value.startsWith('/') || /^[a-z]:/i.test(value) || value.split('/').some((part) => !part || part === '.' || part === '..')) fail(`${label} must be a normalized relative POSIX path`);
  return value;
}

function rejectDuplicateJsonKeys(text, label) {
  let i = 0;
  const ws = () => { while (i < text.length && /\s/.test(text[i])) i++; };
  function readString() {
    const start = i++;
    while (i < text.length) {
      if (text[i] === '\\') { i += 2; continue; }
      if (text[i++] === '"') break;
    }
    if (text[i - 1] !== '"') fail(`${label} contains malformed JSON`);
    try { return JSON.parse(text.slice(start, i)); } catch { fail(`${label} contains malformed JSON`); }
  }
  function value() {
    ws();
    if (text[i] === '{') {
      i++; ws(); const keys = new Set();
      if (text[i] === '}') { i++; return; }
      while (i < text.length) {
        ws(); if (text[i] !== '"') fail(`${label} contains malformed JSON`);
        const key = readString(); if (keys.has(key)) fail(`${label} contains duplicate JSON keys`); keys.add(key);
        ws(); if (text[i++] !== ':') fail(`${label} contains malformed JSON`);
        value(); ws(); const c = text[i++]; if (c === '}') return; if (c !== ',') fail(`${label} contains malformed JSON`);
      }
      fail(`${label} contains malformed JSON`);
    }
    if (text[i] === '[') {
      i++; ws(); if (text[i] === ']') { i++; return; }
      while (i < text.length) { value(); ws(); const c = text[i++]; if (c === ']') return; if (c !== ',') fail(`${label} contains malformed JSON`); }
      fail(`${label} contains malformed JSON`);
    }
    if (text[i] === '"') { readString(); return; }
    const match = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(i));
    if (!match) fail(`${label} contains malformed JSON`);
    i += match[0].length;
  }
  value(); ws(); if (i !== text.length) fail(`${label} contains trailing JSON data`);
}

async function readJson(path, label) {
  let bytes;
  try { bytes = await readFile(path); } catch { fail(`${label} is missing or unreadable`); }
  const text = bytes.toString('utf8');
  rejectDuplicateJsonKeys(text, label);
  try { return { bytes, value: JSON.parse(text) }; } catch { fail(`${label} is malformed JSON`); }
}

async function walkFiles(root) {
  const files = new Map();
  async function walk(folder, prefix = '') {
    let entries;
    try { entries = await readdir(folder, { withFileTypes: true }); } catch { fail(`baseline or candidate directory is unreadable: ${prefix || root}`); }
    entries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    for (const entry of entries) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      validRelativePath(path, 'package file path');
      const full = join(folder, entry.name);
      const st = await lstat(full);
      if (st.isSymbolicLink() || st.isReparsePoint?.()) fail(`package contains a link or reparse point: ${path}`);
      if (st.isDirectory()) await walk(full, path);
      else if (st.isFile()) {
        const folded = path.toLocaleLowerCase('en-US');
        if ([...files.keys()].some((existing) => existing.toLocaleLowerCase('en-US') === folded)) fail(`package has a case-ambiguous path: ${path}`);
        const bytes = await readFile(full);
        files.set(path, { size: bytes.length, sha256: hash(bytes) });
      } else fail(`package contains a special file: ${path}`);
    }
  }
  await walk(root);
  return files;
}

async function assertOutsideGitCheckout(root) {
  let cursor = resolve(root);
  while (true) {
    try { await lstat(join(cursor, '.git')); fail('owner-attested baseline package is inside a Git checkout'); } catch (error) {
      if (error instanceof Error && error.message.startsWith('owner-attested baseline package is inside')) throw error;
      if (error?.code !== 'ENOENT') fail('cannot establish that baseline package is outside Git');
    }
    const parent = dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
}

function checkedHashRecord(record, label) {
  if (!plainObject(record) || !Number.isSafeInteger(record.bytes) || record.bytes < 0 || typeof record.sha256 !== 'string' || !HEX256.test(record.sha256)) fail(`${label} has an invalid size or SHA-256`);
  return { size: record.bytes, sha256: record.sha256.toLowerCase() };
}

async function verifyHashedReference(path, expectedHash, label) {
  if (typeof path !== 'string' || !isAbsolute(path) || typeof expectedHash !== 'string' || !HEX256.test(expectedHash)) fail(`${label} reference is incomplete`);
  let bytes;
  try { bytes = await readFile(path); } catch { fail(`${label} is missing or unreadable`); }
  if (hash(bytes) !== expectedHash.toLowerCase()) fail(`${label} hash does not match the baseline record`);
  return bytes;
}

function checkAllowlist(doc) {
  if (!plainObject(doc) || doc.schema !== 'pcm-approved-changes/v1' || !Array.isArray(doc.changes)) fail('allowlist schema or changes list is invalid');
  const approvals = new Map();
  for (const item of doc.changes) {
    if (!plainObject(item) || typeof item.path !== 'string' || typeof item.reason !== 'string' || !item.reason.trim() || !Object.hasOwn(item, 'before') || !Object.hasOwn(item, 'after')) fail('each allowlist entry needs path, before, after, and a reason');
    if (Object.keys(item).some((key) => !['path', 'reason', 'before', 'after'].includes(key))) fail('allowlist entries may contain only path, reason, before, and after');
    validRelativePath(item.path, 'allowlist path');
    for (const side of ['before', 'after']) if (item[side] !== null && (typeof item[side] !== 'string' || !/^\d+:[0-9a-f]{64}$/i.test(item[side]))) fail(`allowlist ${side} fingerprint is invalid for ${item.path}`);
    const folded = item.path.toLocaleLowerCase('en-US');
    if (approvals.has(folded)) fail(`allowlist contains a duplicate or case-ambiguous path: ${item.path}`);
    approvals.set(folded, { ...item });
  }
  return approvals;
}

function categoryFor(path) {
  if (path === 'worker/index.mjs') return 'Worker source';
  if (path === 'wrangler.toml') return 'Worker configuration';
  if (path === 'site-copy/_redirects') return 'redirects';
  if (path.startsWith('site-copy/')) return 'asset';
  return 'unexpected file';
}

async function validateBaseline(baselinePath, expectedVersion) {
  if (!UUID.test(expectedVersion ?? '')) fail('expected Worker version must be a valid UUID');
  const { value: baseline } = await readJson(baselinePath, 'owner-attested baseline');
  if (!plainObject(baseline) || ![BASELINE_SCHEMA, RETAINED_SCHEMA].includes(baseline.schema)) fail('unsupported controlled baseline schema');
  const retained = baseline.schema === RETAINED_SCHEMA;
  if (baseline.record_status?.startsWith('INCOMPLETE:') !== true) fail('baseline must preserve its INCOMPLETE evidence status');
  if (baseline.worker?.name !== 'newpurely' || baseline.worker?.active_version !== expectedVersion) fail('baseline Worker or expected version does not match the requested production version');
  if (baseline.package?.linked_version_id !== expectedVersion) fail('baseline package is linked to a different version');
  if (!UUID.test(baseline.worker?.previous_rollback_version ?? '') || baseline.worker.previous_rollback_version === expectedVersion) fail('baseline rollback reference is missing or invalid');
  if (!retained) {
  if (baseline.package?.association_classification?.startsWith('owner-attested') !== true) fail('baseline does not declare owner-attested linkage to the expected version');
  const owner = baseline.production_evidence?.owner_attested_deployment;
  if (owner?.classification !== 'owner-attested, not independently retained Wrangler output' || owner?.wrangler_reported_version_id !== expectedVersion || owner?.upload_exit_code !== 0) fail('owner-attested upload provenance is missing or inconsistent');
  if (baseline.evidence_classifications?.owner_attested_deployment?.status !== 'OWNER_ATTESTED' || baseline.evidence_classifications?.unverified?.status !== 'INCOMPLETE') fail('baseline evidence classifications are missing or inconsistent');
  }
  if (baseline.evidence_classifications?.unverified?.status !== 'INCOMPLETE') fail('local historical inventory must remain INCOMPLETE');
  if (baseline.evidence_classifications.unverified.never_interpret_missing_flags_as_empty !== true) fail('baseline must explicitly keep omitted compatibility flags incomplete');
  if (typeof baseline.package?.root !== 'string' || !isAbsolute(baseline.package.root) || !Array.isArray(baseline.file_hashes) || !baseline.file_hashes.length) fail('baseline package path or file hash inventory is missing');

  const baselineRootStat = await lstat(resolve(baseline.package.root)).catch(() => null);
  if (!baselineRootStat?.isDirectory() || baselineRootStat.isSymbolicLink() || baselineRootStat.isReparsePoint?.()) fail('baseline package root must be an existing, ordinary directory');
  const baselineRoot = await realpath(resolve(baseline.package.root)).catch(() => fail('baseline package directory is missing or unreadable'));
  await assertOutsideGitCheckout(baselineRoot);
  const declared = new Map();
  for (const item of baseline.file_hashes) {
    validRelativePath(item?.path, 'baseline file path');
    const folded = item.path.toLocaleLowerCase('en-US');
    if (declared.has(folded)) fail(`baseline file inventory has duplicate or case-ambiguous path: ${item.path}`);
    declared.set(folded, { path: item.path, record: checkedHashRecord(item, `baseline file ${item.path}`) });
  }
  for (const required of REQUIRED_FILES) if (!declared.has(required.toLocaleLowerCase('en-US'))) fail(`baseline is missing required file record: ${required}`);

  const actualBaseline = await walkFiles(baselineRoot);
  if (actualBaseline.size !== declared.size) fail('baseline package file count does not match its recorded inventory');
  for (const [folded, item] of declared) {
    const actual = actualBaseline.get(item.path);
    if (!actual) fail(`baseline package file is missing: ${item.path}`);
    if (actual.size !== item.record.size || actual.sha256 !== item.record.sha256) fail(`baseline package hash or size mismatch: ${item.path}`);
    if (![...actualBaseline.keys()].some((path) => path === item.path && path.toLocaleLowerCase('en-US') === folded)) fail(`baseline package path casing is inconsistent: ${item.path}`);
  }

  const manifest = baseline.asset_manifest;
  if (!plainObject(manifest) || !Number.isSafeInteger(manifest.entry_count) || manifest.entry_count < 1 || !/PASS:/i.test(manifest.local_package_comparison ?? '')) fail('baseline local asset manifest record is incomplete');
  const manifestBytes = await verifyHashedReference(manifest.path, manifest.sha256, 'local asset manifest');
  const { value: assetMap } = await readJsonBytes(manifestBytes, 'local asset manifest');
  if (!plainObject(assetMap) || Object.keys(assetMap).length !== manifest.entry_count) fail('local asset manifest entry count is inconsistent');
  const assetRecords = new Map();
  for (const [rawPath, item] of Object.entries(assetMap)) {
    if (typeof rawPath !== 'string' || !rawPath.startsWith('/') || rawPath.includes('\\')) fail('local asset manifest has an invalid path');
    const path = `site-copy/${rawPath.replace(/^\/+/, '')}`;
    validRelativePath(path, 'local asset manifest path');
    const folded = path.toLocaleLowerCase('en-US');
    if (assetRecords.has(folded) || !Number.isSafeInteger(item?.size) || item.size < 0 || typeof item.sha256 !== 'string' || !HEX256.test(item.sha256)) fail(`local asset manifest entry is invalid: ${rawPath}`);
    assetRecords.set(folded, { path, record: { size: item.size, sha256: item.sha256.toLowerCase() } });
  }
  const recordedAssets = [...declared.values()].filter((x) => x.path.startsWith('site-copy/') && x.path !== 'site-copy/_redirects');
  if (recordedAssets.length !== manifest.entry_count || assetRecords.size !== recordedAssets.length) fail('baseline asset file inventory and manifest count disagree');
  for (const asset of recordedAssets) {
    const manifestAsset = assetRecords.get(asset.path.toLocaleLowerCase('en-US'));
    if (!manifestAsset || manifestAsset.path !== asset.path || manifestAsset.record.size !== asset.record.size || manifestAsset.record.sha256 !== asset.record.sha256) fail(`baseline asset record disagrees with local manifest: ${asset.path}`);
  }

  if (retained) return validateRetainedEvidence(baseline, expectedVersion, { baselineRoot, declared, assetCount: manifest.entry_count });

  const step15 = baseline.production_evidence?.step15;
  if (!step15 || step15.result !== 'BLOCKED' || step15.cloudflare_confirmed?.version_id !== expectedVersion || step15.cloudflare_confirmed?.traffic_allocation_percent !== 100) fail('baseline Step 15 production evidence is missing or inconsistent');
  const step15Record = baseline.retained_deployment_records?.find((entry) => entry.path === step15.path);
  if (!step15Record || step15Record.sha256 !== step15.sha256) fail('baseline Step 15 evidence reference is inconsistent');
  const step15Bytes = await verifyHashedReference(step15.path, step15.sha256, 'Step 15 Cloudflare verification evidence');
  const { value: step15Doc } = await readJsonBytes(step15Bytes, 'Step 15 Cloudflare verification evidence');
  if (step15Doc.observed_version_id !== expectedVersion || step15Doc.worker !== 'newpurely') fail('Step 15 evidence does not identify the expected Worker version');
  const traffic = step15Doc.observed_production_allocations;
  if (!Array.isArray(traffic) || traffic.length !== 1 || traffic[0]?.version_id?.value !== expectedVersion || traffic[0]?.percentage?.value !== 100) fail('Step 15 traffic evidence is inconsistent');
  if (step15Doc.checks?.find((check) => check.name === 'compatibility flags')?.status !== 'BLOCKED') fail('Step 15 compatibility-flags limitation is not preserved');
  if (typeof step15Doc.provenance !== 'string' || !step15Doc.provenance.includes('Cloudflare v4 API GET') || !Array.isArray(step15Doc.api_evidence)) fail('Step 15 Cloudflare API provenance is missing');
  const versionApi = step15Doc.api_evidence.find((item) => typeof item.endpoint === 'string' && item.endpoint.includes(`/workers/scripts/newpurely/versions/${expectedVersion}`));
  const deploymentApi = step15Doc.api_evidence.find((item) => typeof item.endpoint === 'string' && item.endpoint.includes('/workers/scripts/newpurely/deployments'));
  if (![versionApi, deploymentApi].every((item) => item?.endpoint?.startsWith('https://api.cloudflare.com/client/v4/accounts/') && item.http_status === 200 && item.success === true)) fail('Step 15 API evidence does not contain successful version and deployment GET responses');
  const versionResult = versionApi.result;
  const expectedSettings = baseline.expected_settings;
  if (versionResult?.id?.value !== expectedVersion || versionResult?.compatibility_date?.value !== expectedSettings?.compatibility_date) fail('Step 15 version identity or compatibility date disagrees with the baseline settings');
  const expectedEtag = step15.cloudflare_confirmed?.version_script_etag;
  if (!HEX256.test(expectedEtag ?? '') || versionResult?.script_etag?.value !== expectedEtag) fail('Step 15 script fingerprint is missing or inconsistent');
  const expectedBindings = [expectedSettings?.asset_binding, ...(expectedSettings?.secret_binding_names_types ?? [])].sort();
  const actualBindings = Array.isArray(versionResult?.bindings) ? versionResult.bindings.map((item) => `${item?.name?.value}:${item?.type?.value}`).sort() : [];
  if (!expectedBindings.length || actualBindings.length !== expectedBindings.length || actualBindings.some((item, index) => item !== expectedBindings[index])) fail('Step 15 binding metadata disagrees with the baseline settings');
  for (const entry of baseline.retained_deployment_records) await verifyHashedReference(entry.path, entry.sha256, 'retained deployment evidence');
  if (baseline.related_v950_source_hash) await verifyHashedReference(baseline.related_v950_source_hash.path, baseline.related_v950_source_hash.sha256, 'retained v950 source reference');

  const localWorker = declared.get('worker/index.mjs'.toLocaleLowerCase('en-US'))?.record.sha256;
  if (localWorker !== baseline.evidence_classifications?.locally_verified?.corrected_worker_sha256 || baseline.evidence_classifications.locally_verified.matches_expected_hash !== true) fail('owner-attested corrected Worker hash is inconsistent with the local package inventory');
  const step19 = baseline.production_evidence?.step19;
  if (step19?.requested_version !== expectedVersion || step19?.response_version_match !== true || step19?.compatibility_flags_presence !== 'missing') fail('Step 19 exact-version evidence or flags limitation is inconsistent');

  return { baseline, baselineRoot, declared, assetCount: manifest.entry_count, step15Doc, step15VersionResult: versionResult, expectedSettings };
}

async function readJsonBytes(bytes, label) {
  const text = bytes.toString('utf8');
  rejectDuplicateJsonKeys(text, label);
  try { return { value: JSON.parse(text) }; } catch { fail(`${label} is malformed JSON`); }
}

function parseAllowlistText(text) {
  rejectDuplicateJsonKeys(text, 'allowlist');
  let value;
  try { value = JSON.parse(text); } catch { fail('allowlist is malformed JSON'); }
  return checkAllowlist(value);
}

export async function compareOwnerAttestedBaseline({ candidatePath, baselinePath, allowlistPath, workerVersion }) {
  const { baseline, baselineRoot, declared, assetCount } = await validateBaseline(baselinePath, workerVersion);
  let allowlistText;
  try { allowlistText = await readFile(allowlistPath, 'utf8'); } catch { fail('allowlist is missing or unreadable'); }
  const approvals = parseAllowlistText(allowlistText);
  const candidateRoot = resolve(candidatePath);
  const candidateFiles = await walkFiles(candidateRoot);

  const allPaths = new Set([...declared.values()].map((item) => item.path));
  for (const path of candidateFiles.keys()) allPaths.add(path);
  const differences = [];
  const usedApprovals = new Set();
  for (const path of [...allPaths].sort((a, b) => a.localeCompare(b, 'en'))) {
    const baselineEntry = declared.get(path.toLocaleLowerCase('en-US'));
    const beforeRecord = baselineEntry?.record ?? null;
    const afterRecord = candidateFiles.get(path) ?? null;
    const before = fingerprint(beforeRecord); const after = fingerprint(afterRecord);
    if (before === after) continue;
    const category = categoryFor(path);
    const eligible = category !== 'unexpected file' && !((REQUIRED_FILES.includes(path)) && afterRecord === null);
    const key = path.toLocaleLowerCase('en-US');
    const approval = approvals.get(key);
    const exact = eligible && approval && approval.path === path && approval.before === before && approval.after === after;
    if (exact) usedApprovals.add(key);
    differences.push({ path, category, before, after, approved: Boolean(exact), allowlistEligible: eligible, reason: exact ? approval.reason : null });
  }
  const staleApprovals = [...approvals.values()].filter((item) => !usedApprovals.has(item.path.toLocaleLowerCase('en-US'))).map((item) => item.path);
  const unexpected = differences.filter((item) => !item.approved);
  const result = differences.every((item) => item.approved) && staleApprovals.length === 0 ? 'PASS' : 'MISMATCH';
  return {
    result,
    evaluated: true,
    detail: result === 'PASS' ? `All ${differences.length} observed differences match the exact allowlist.` : 'One or more changes are unapproved, structurally unexpected, or the allowlist contains stale entries.',
    differences,
    unexpected,
    staleAllowlistPaths: staleApprovals,
    approvedChanges: differences.filter((item) => item.approved).map(({ path, category, before, after, reason }) => ({ path, category, before, after, reason })),
    baseline: { classification: 'OWNER-ATTESTED', workerVersion, packageRoot: baselineRoot, filesVerified: declared.size, assetsVerifiedAgainstLocalManifest: assetCount },
  };
}

export async function inspectOwnerBaseline({ baselinePath, workerVersion }) {
  const result = await validateBaseline(baselinePath, workerVersion);
  return { classification: 'OWNER-ATTESTED', workerVersion, packageRoot: result.baselineRoot, filesVerified: result.declared.size, assetsVerifiedAgainstLocalManifest: result.assetCount, step15VersionResult: result.step15VersionResult, expectedSettings: result.expectedSettings, rollbackVersion: result.baseline.worker.previous_rollback_version, retained: result.baseline.schema === RETAINED_SCHEMA };
}

// Version-neutral retained evidence. These are local, hash-bound records, never
// a native Cloudflare asset inventory or a replacement for owner acceptance.
async function validateRetainedEvidence(baseline, version, common) {
  const load = async (ref, label) => {
    const bytes = await verifyHashedReference(ref?.path, ref?.sha256, label);
    return (await readJsonBytes(bytes, label)).value;
  };
  const observed = await load(baseline.production_evidence?.verification, 'production verification');
  const expected = baseline.expected_settings;
  const configText = await readFile(join(common.baselineRoot, 'wrangler.toml'), 'utf8');
  const rootText = configText.split(/^\s*\[/m)[0];
  const stringSetting = (text, key) => {
    const matches = [...text.matchAll(new RegExp(`^\\s*${key}\\s*=\\s*["']([^"']+)["']\\s*$`, 'gm'))];
    return matches.length === 1 ? matches[0][1] : null;
  };
  const assetText = /^\[assets\]\s*\r?\n([\s\S]*?)(?=^\[|$(?![\s\S]))/m.exec(configText)?.[1];
  if (stringSetting(rootText, 'name') !== 'newpurely' || !['./worker/index.mjs', 'worker/index.mjs'].includes(stringSetting(rootText, 'main'))
    || stringSetting(rootText, 'compatibility_date') !== expected?.compatibility_date || !assetText
    || !['./site-copy','site-copy'].includes(stringSetting(assetText, 'directory')) || stringSetting(assetText, 'binding') !== 'ASSETS') fail('local Wrangler configuration does not match baseline expectations');
  for (const [key, value] of Object.entries(expected.assets_config ?? {})) {
    if (typeof value === 'boolean') {
      const found = [...assetText.matchAll(new RegExp(`^\\s*${key}\\s*=\\s*(true|false)\\s*$`, 'gm'))];
      if (found.length !== 1 || (found[0][1] === 'true') !== value) fail(`local asset setting mismatch: ${key}`);
    } else if (stringSetting(assetText, key) !== value) fail(`local asset setting mismatch: ${key}`);
  }
  const flagLines = [...rootText.matchAll(/^\s*compatibility_flags\s*=\s*(\[[^\r\n]*\])\s*$/gm)];
  let localFlags;
  try { localFlags = flagLines.length === 1 ? JSON.parse(flagLines[0][1]) : null; } catch { fail('unsupported local compatibility flags syntax'); }
  if (!Array.isArray(localFlags) || !Array.isArray(expected?.compatibility_flags) || JSON.stringify([...localFlags].sort()) !== JSON.stringify([...expected.compatibility_flags].sort())) fail('local compatibility flags differ from intended baseline');
  const localBindings = ['ASSETS:assets', ...[...configText.matchAll(/^\[\[secrets_store_secrets\]\]\s*\r?\n([\s\S]*?)(?=^\[|$(?![\s\S]))/gm)].map((m) => `${stringSetting(m[1], 'binding')}:secrets_store_secret`)].sort();
  if (JSON.stringify(localBindings) !== JSON.stringify([expected.asset_binding, ...(expected.secret_binding_names_types ?? [])].sort())) fail('local binding configuration mismatch');
  const api = observed.api_evidence?.find((e) => e.endpoint?.endsWith(`/workers/scripts/newpurely/versions/${version}`));
  const deployment = observed.api_evidence?.find((e) => e.endpoint?.includes('/workers/scripts/newpurely/deployments'));
  if (observed.worker !== 'newpurely' || observed.observed_version_id !== version || observed.expected_version_id !== version
    || !['BLOCKED', 'PASS'].includes(observed.result) || !Number.isFinite(Date.parse(observed.verified_at_utc))
    || !observed.provenance?.includes('Cloudflare v4 API GET')
    || ![api, deployment].every((e) => e?.endpoint?.startsWith('https://api.cloudflare.com/client/v4/accounts/') && e.http_status === 200 && e.success === true)) fail('retained production verification is incomplete or inconsistent');
  const allocations = observed.observed_production_allocations;
  if (!Array.isArray(allocations) || allocations.length !== 1 || allocations[0]?.version_id?.value !== version || allocations[0]?.percentage?.value !== 100) fail('retained production allocation is inconsistent');
  const required = ['active version and traffic', 'version identity', 'compatibility date', 'binding names and types', 'version source fingerprint', 'versioned configuration scope'];
  if (required.some((n) => observed.checks?.find((c) => c.name === n)?.status !== 'PASS')
    || observed.checks?.some((c) => c.status === 'MISMATCH' || (c.status === 'BLOCKED' && c.name !== 'compatibility flags'))) fail('retained production checks did not pass');
  const result = api.result;
  const bindings = [expected?.asset_binding, ...(expected?.secret_binding_names_types ?? [])].sort();
  const actual = result?.bindings?.map((b) => `${b.name?.value}:${b.type?.value}`).sort();
  if (result?.id?.value !== version || result?.compatibility_date?.value !== expected?.compatibility_date
    || !HEX256.test(expected?.script_etag ?? '') || result?.script_etag?.value !== expected.script_etag
    || !actual || JSON.stringify(bindings) !== JSON.stringify(actual)) fail('retained configuration or Worker fingerprint is inconsistent');
  if (!Array.isArray(expected.compatibility_flags) || expected.compatibility_flags.some((f) => typeof f !== 'string' || !f)) fail('expected flags are malformed');
  const flags = result.compatibility_flags;
  if (flags?.presence === 'present' && flags.type === 'array') {
    if (!Array.isArray(flags.value) || JSON.stringify([...flags.value].sort()) !== JSON.stringify([...expected.compatibility_flags].sort())) fail('retained compatibility flags mismatch');
  } else if (flags?.presence !== 'missing' || flags.path !== 'resources.script_runtime.compatibility_flags'
    || observed.checks?.find((c) => c.name === 'compatibility flags')?.status !== 'BLOCKED') fail('retained flags evidence is incomplete or malformed');

  const config = await load(baseline.production_evidence?.configuration, 'configuration and rollback evidence');
  const current = config.versions?.find((v) => v.id === version);
  const rollback = config.versions?.find((v) => v.id === baseline.worker.previous_rollback_version);
  if (!current || current.http_status !== 200 || current.script_etag !== expected.script_etag
    || !rollback || rollback.http_status !== 200 || rollback.requested_id !== rollback.id) fail('retained configuration/rollback reference is inconsistent');
  for (const [key, value] of Object.entries(expected.assets_config ?? {})) {
    if (current.assets?.[key === 'run_worker_first' ? 'raw_run_worker_first' : key] !== value) fail(`retained asset setting mismatch: ${key}`);
  }
  const redirects = await load(baseline.production_evidence?.redirects, 'redirect evidence');
  const redirectHash = common.declared.get('site-copy/_redirects').record.sha256;
  if (redirects.version !== version || redirects.http_status !== 200 || redirects.exact_match !== true
    || redirects.api_sha256 !== redirectHash || redirects.local_sha256 !== redirectHash) fail('retained redirect evidence is inconsistent');
  if (!expected.assets_config || !['html_handling','not_found_handling','run_worker_first','base_path'].every((k) => Object.hasOwn(expected.assets_config, k))) fail('asset configuration is incomplete');

  const release = baseline.production_evidence?.retained_release;
  const manifest = await load(release?.manifest, 'retained candidate manifest');
  if (manifest.schema !== 'pcm-release-candidate-manifest/v1' || !Array.isArray(manifest.files)
    || manifest.files.length !== common.declared.size) fail('retained release inventory is incomplete');
  const seen = new Set();
  for (const file of manifest.files) {
    if (seen.has(file.path)) fail('duplicate release manifest path'); seen.add(file.path);
    const recorded = common.declared.get(file.path?.toLowerCase());
    if (!recorded || recorded.path !== file.path || recorded.record.size !== file.bytes || recorded.record.sha256 !== file.sha256) fail('release manifest and package hashes disagree');
  }
  const upload = await load(release?.upload_output, 'retained upload output');
  const promotion = await load(release?.promotion_output, 'retained promotion output');
  if (upload.exitCode !== 0 || promotion.exitCode !== 0
    || !upload.stdout?.includes(`Worker Version ID: ${version}`)
    || !promotion.stdout?.includes(`Deployed newpurely version ${version} at 100%`)) fail('retained upload/promotion output does not identify this release');
  const linkage = await load(release?.linkage, 'sanitized release linkage');
  if (linkage.worker !== 'newpurely' || linkage.version !== version || linkage.previous_version !== baseline.worker.previous_rollback_version
    || linkage.candidate_manifest_sha256 !== release.manifest.sha256 || linkage.approval_hash_bindings_verified !== true
    || linkage.classification !== 'LOCAL_RETAINED_RELEASE_METADATA_NOT_AUTHORIZATION') fail('retained release linkage or rollback mismatch');
  const paths = [...upload.stdout.matchAll(/^\+ (\/[^\r\n]+)/gm)].map((m) => m[1]).sort();
  if (!Array.isArray(linkage.uploaded_paths) || JSON.stringify(paths) !== JSON.stringify([...linkage.uploaded_paths].sort())) fail('retained uploaded paths disagree');
  for (const ref of baseline.retained_deployment_records ?? []) await verifyHashedReference(ref.path, ref.sha256, 'retained evidence');
  if (expected.worker_source_sha256 !== common.declared.get('worker/index.mjs').record.sha256) fail('retained Worker source hash mismatch');
  return { baseline, ...common, step15VersionResult: result, expectedSettings: expected };
}

export async function readBaselineIdentity(baselinePath) {
  const { value: baseline, bytes } = await readJson(baselinePath, 'selected baseline');
  if (!UUID.test(baseline.worker?.active_version ?? '') || baseline.worker.name !== 'newpurely') fail('selected baseline Worker/version is invalid');
  return { version: baseline.worker.active_version, hash: hash(bytes), rollbackVersion: baseline.worker.previous_rollback_version };
}

export async function readAcceptedSelection(selectionPath) {
  const { value: selection } = await readJson(selectionPath, 'explicit baseline selection');
  if (selection.schema !== 'pcm-baseline-selection/v1') fail('unsupported baseline selection');
  for (const [label, ref] of [['baseline', selection.baseline], ['acceptance', selection.acceptance]]) await verifyHashedReference(ref?.path, ref?.sha256, `selected ${label}`);
  const baselineBytes = await readFile(selection.baseline.path);
  const identity = await readBaselineIdentity(selection.baseline.path);
  const acceptance = validateBaselineAcceptance({ bytes: await readFile(selection.acceptance.path), baselineBytes, baselineHash: identity.hash, workerName: 'newpurely', workerVersion: identity.version });
  if (acceptance.status !== 'ACCEPTED') fail(`selected baseline acceptance is ${acceptance.status}`);
  if (acceptance.baselineAdoptionProfile) await verifyHashedReference(acceptance.adoptionEvidencePath, acceptance.adoptionEvidenceSha256, 'selected baseline-adoption evidence');
  return { baselinePath: selection.baseline.path, acceptancePath: selection.acceptance.path, workerVersion: identity.version };
}

export const ACCEPTABLE_BASELINE_LIMITATIONS = Object.freeze([
  'historical-asset-inventory-owner-attested',
  'compatibility-flags-unavailable',
]);

function validatePublicHtmlEvidence(value, baselineBytes) {
  const invalid = (detail) => ({ status: 'INVALID', detail: `Public HTML evidence is invalid: ${detail}` });
  const exact = (object, keys) => plainObject(object) && Object.keys(object).sort().join('|') === [...keys].sort().join('|');
  if (!exact(value, ['schema', 'status', 'verified_at_utc', 'request', 'samples', 'historical_mismatches'])) return invalid('fields do not match pcm-public-html-evidence/v1.');
  if (value.schema !== 'pcm-public-html-evidence/v1' || value.status !== 'PARTIAL_VERIFICATION') return invalid('schema or status is unsupported.');
  if (typeof value.verified_at_utc !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value.verified_at_utc) || !Number.isFinite(Date.parse(value.verified_at_utc))) return invalid('verification timestamp must be an ISO UTC timestamp.');
  if (!exact(value.request, ['accept_encoding', 'cache_control']) || value.request.accept_encoding !== 'identity' || value.request.cache_control !== 'no-cache') return invalid('the recorded sample request must use identity encoding and no-cache.');
  if (!Array.isArray(value.samples) || value.samples.length < 1) return invalid('at least one response sample is required.');
  let baseline;
  try { baseline = JSON.parse(Buffer.from(baselineBytes ?? []).toString('utf8')); } catch { return invalid('a parseable matching baseline is required when this field is present.'); }
  if (!Array.isArray(baseline.file_hashes)) return invalid('the matching baseline has no file hash inventory.');
  const baselineFiles = new Map(baseline.file_hashes.map((item) => [item.path, item]));
  const seen = new Set();
  let historicalSampleCount = 0;
  let currentMatches = 0;
  for (const sample of value.samples) {
    if (!exact(sample, ['url', 'package_path', 'http_status', 'content_type', 'content_encoding', 'cf_cache_status', 'response_bytes', 'package_sha256', 'response_sha256', 'historical_response_sha256'])) return invalid('sample fields are incomplete or unsupported.');
    let url;
    try { url = new URL(sample.url); } catch { return invalid('sample URL is invalid.'); }
    if (url.protocol !== 'https:' || url.hostname !== 'purelycanadianmovers.com' || url.search || url.hash || !url.pathname.endsWith('/')) return invalid('sample URL must be a canonical HTTPS public page URL.');
    const expectedPath = `site-copy${url.pathname}index.html`;
    if (sample.package_path !== expectedPath || seen.has(sample.package_path)) return invalid('sample path must map uniquely to its canonical package HTML asset.');
    seen.add(sample.package_path);
    const packageRecord = baselineFiles.get(sample.package_path);
    if (!packageRecord || !Number.isSafeInteger(packageRecord.bytes) || packageRecord.bytes < 0 || !HEX256.test(packageRecord.sha256 ?? '')) return invalid('sample package asset is absent from the selected baseline.');
    if (sample.http_status !== 200 || typeof sample.content_type !== 'string' || sample.content_type.split(';')[0].trim().toLowerCase() !== 'text/html') return invalid('sample must be a successful HTML response.');
    if (sample.content_encoding !== null) return invalid('encoded response bytes are not accepted as raw-byte comparison evidence.');
    if (typeof sample.cf_cache_status !== 'string' || !sample.cf_cache_status.trim()) return invalid('Cloudflare cache status must be recorded.');
    if (!Number.isSafeInteger(sample.response_bytes) || sample.response_bytes < 0 || !HEX256.test(sample.package_sha256 ?? '') || !HEX256.test(sample.response_sha256 ?? '') || !HEX256.test(sample.historical_response_sha256 ?? '')) return invalid('sample sizes and SHA-256 values are malformed.');
    if (sample.package_sha256.toLowerCase() !== packageRecord.sha256.toLowerCase() || sample.response_bytes !== packageRecord.bytes) return invalid('sample package hash or byte count does not match the selected baseline.');
    const currentlyMatches = sample.response_sha256.toLowerCase() === sample.package_sha256.toLowerCase() && sample.response_bytes === packageRecord.bytes;
    if (sample.historical_response_sha256.toLowerCase() !== sample.package_sha256.toLowerCase()) historicalSampleCount++;
    if (currentlyMatches) currentMatches++;
  }
  const history = value.historical_mismatches;
  if (!exact(history, ['status', 'source_path', 'source_sha256', 'reported_count', 'sampled_prior_mismatch_count', 'sampled_now_matching_count', 'unexamined_count'])) return invalid('historical mismatch fields are incomplete or unsupported.');
  if (history.status !== 'UNRESOLVED' || typeof history.source_path !== 'string' || !history.source_path.startsWith('docs/audit/') || !HEX256.test(history.source_sha256 ?? '')) return invalid('historical mismatches must cite a hashed audit source and remain UNRESOLVED.');
  if (![history.reported_count, history.sampled_prior_mismatch_count, history.sampled_now_matching_count, history.unexamined_count].every(Number.isSafeInteger) || history.reported_count < 1 || history.sampled_prior_mismatch_count !== historicalSampleCount || history.sampled_now_matching_count !== currentMatches || history.unexamined_count !== history.reported_count - history.sampled_prior_mismatch_count) return invalid('historical counts do not reconcile with the sample evidence.');
  if (history.sampled_prior_mismatch_count > value.samples.length) return invalid('historical sample count exceeds the supplied samples.');
  return { status: 'ACCEPTED' };
}

export function validateBaselineAcceptance({ bytes, baselineBytes, baselineHash, workerName, workerVersion, now = new Date() }) {
  let record;
  try { rejectDuplicateJsonKeys(bytes.toString('utf8'), 'baseline acceptance record'); record = JSON.parse(bytes.toString('utf8')); } catch { return { status: 'INVALID', detail: 'Acceptance record is malformed JSON or contains duplicate keys.', acceptedLimitations: [] }; }
  const commonKeys = ['schema', 'status', 'worker', 'production_version', 'baseline_sha256', 'accepted_limitations', 'approver', 'approver_role', 'approved_at', 'review_by'];
  const adoptionKeys = ['baseline_adoption_profile', 'adoption_evidence_path', 'adoption_evidence_sha256'];
  const isAdoption = record?.schema === 'pcm-controlled-baseline-acceptance/v2';
  const exactKeys = isAdoption ? [...commonKeys, ...adoptionKeys] : commonKeys;
  const recordKeys = plainObject(record) ? Object.keys(record) : [];
  if (!plainObject(record) || recordKeys.some((key) => !exactKeys.includes(key) && key !== 'public_html_evidence') || exactKeys.some((key) => !recordKeys.includes(key))) return { status: 'INVALID', detail: 'Acceptance record has missing or unexpected fields.', acceptedLimitations: [] };
  if (record.schema !== 'pcm-controlled-baseline-acceptance/v1' && !isAdoption) return { status: 'INVALID', detail: 'Acceptance record schema is unsupported.', acceptedLimitations: [] };
  if (isAdoption && (record.baseline_adoption_profile !== 'batch2-v970-one-time'
      || typeof record.adoption_evidence_path !== 'string' || !record.adoption_evidence_path
      || typeof record.adoption_evidence_sha256 !== 'string' || !HEX256.test(record.adoption_evidence_sha256))) return { status: 'INVALID', detail: 'One-time baseline-adoption evidence binding is missing or malformed.', acceptedLimitations: [] };
  if (record.status === 'REVOKED') return { status: 'REVOKED', detail: 'Acceptance record has been revoked.', acceptedLimitations: [] };
  if (record.status !== 'ACCEPTED') return { status: 'INVALID', detail: 'Acceptance status must be ACCEPTED or REVOKED.', acceptedLimitations: [] };
  if (record.worker !== workerName || record.production_version !== workerVersion || record.baseline_sha256 !== baselineHash) return { status: 'MISMATCH', detail: 'Acceptance record does not match the exact Worker, production version, and baseline file hash.', acceptedLimitations: [] };
  if (typeof record.approver !== 'string' || record.approver.trim().length < 3 || record.approver !== record.approver.trim() || /^(unknown|n\/?a|none|test|placeholder)$/i.test(record.approver)) return { status: 'INVALID', detail: 'Acceptance record approver is missing or invalid.', acceptedLimitations: [] };
  if (record.approver_role !== 'business-owner') return { status: 'INVALID', detail: 'Acceptance approver role must be business-owner.', acceptedLimitations: [] };
  if (!Array.isArray(record.accepted_limitations) || record.accepted_limitations.length !== ACCEPTABLE_BASELINE_LIMITATIONS.length
    || new Set(record.accepted_limitations).size !== record.accepted_limitations.length
    || ACCEPTABLE_BASELINE_LIMITATIONS.some((item) => !record.accepted_limitations.includes(item))) return { status: 'INVALID', detail: 'Acceptance must list exactly the two supported limitation identifiers.', acceptedLimitations: [] };
  if (Object.hasOwn(record, 'public_html_evidence')) {
    const evidence = validatePublicHtmlEvidence(record.public_html_evidence, baselineBytes);
    if (evidence.status !== 'ACCEPTED') return { ...evidence, acceptedLimitations: [] };
  }
  const validDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  if (!validDate(record.approved_at) || !validDate(record.review_by) || record.review_by < record.approved_at) return { status: 'INVALID', detail: 'Approval and review dates must be valid ISO dates in chronological order.', acceptedLimitations: [] };
  const today = now.toISOString().slice(0, 10);
  if (record.approved_at > today) return { status: 'INVALID', detail: 'Acceptance approval date is in the future.', acceptedLimitations: [] };
  if (record.review_by < today) return { status: 'EXPIRED', detail: 'Acceptance record has passed its review-by date.', acceptedLimitations: [] };
  return { status: 'ACCEPTED', detail: 'Declared business-owner acceptance matches this exact baseline and is within its review period.', acceptedLimitations: [...record.accepted_limitations], approver: record.approver, approverRole: record.approver_role, approvedAt: record.approved_at, reviewBy: record.review_by, ...(isAdoption ? { baselineAdoptionProfile: record.baseline_adoption_profile, adoptionEvidencePath: record.adoption_evidence_path, adoptionEvidenceSha256: record.adoption_evidence_sha256 } : {}) };
}
