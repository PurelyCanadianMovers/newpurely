// Deployment-specific ownership boundary. This intentionally stores only the
// committed route -> writer facts needed to reject unknown/SPA HTML changes.
// It does not import the repository's mutable route-generation registries.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const snapshotPath = new URL('./route-ownership-snapshot.json', import.meta.url);
const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
if (snapshot.schema !== 'pcm-deployment-route-ownership-snapshot/v1'
    || !/^[a-f0-9]{40}$/i.test(snapshot.source?.commit ?? '')
    || !/^[a-f0-9]{40}$/i.test(snapshot.source?.registryBlobObjectId ?? '')
    || snapshot.source?.registryPath !== 'tools/route-page-ownership.mjs'
    || !Array.isArray(snapshot.routes)) {
  throw new Error('Deployment route-ownership snapshot has invalid provenance or shape');
}

const entries = new Map();
for (const entry of snapshot.routes) {
  if (!entry || typeof entry.route !== 'string' || !/^\/(?:[a-z0-9-]+\/)?$/.test(entry.route)
      || typeof entry.owner !== 'string' || !entry.owner
      || !['full-page-generator', 'static-finalizer', 'checked-in-static-source'].includes(entry.ownerType)
      || entries.has(entry.route)) {
    throw new Error('Deployment route-ownership snapshot contains an invalid or duplicate assignment');
  }
  entries.set(entry.route, Object.freeze({ owner: entry.owner, ownerType: entry.ownerType }));
}

export const routeOwnershipByUrl = entries;
export const routeOwnershipSnapshotPath = fileURLToPath(snapshotPath);
export const routeOwnershipModulePath = fileURLToPath(import.meta.url);
