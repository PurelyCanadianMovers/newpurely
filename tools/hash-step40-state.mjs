import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const output = resolve(process.argv[3] ?? "STEP_40_STATE.json");
const digest = async (path) => createHash("sha256").update(await readFile(path)).digest("hex");

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes:true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? filesBelow(join(directory,entry.name)) : [join(directory,entry.name)]));
  return nested.flat().sort();
}

const routes = {};
for (const entry of routePageOwnership) routes[entry.routeUrl] = await digest(join(root,entry.routeUrl.slice(1),"index.html"));
const assets = {};
for (const path of await filesBelow(join(root,"assets"))) assets[relative(root,path).replaceAll("\\","/")] = await digest(path);
await writeFile(output,`${JSON.stringify({routes,assets},null,2)}\n`);
console.log(`Hashed ${Object.keys(routes).length} routes and ${Object.keys(assets).length} assets.`);
