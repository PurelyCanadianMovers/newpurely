import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const output = process.argv[3];
if (!output) throw new Error("Usage: node tools/hash-route-build-state.mjs <root> <output.json>");

function hash(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

const routes = Object.fromEntries(routePageOwnership.map((entry) => [
  entry.routeUrl,
  hash(join(root, entry.routeUrl.slice(1), "index.html")),
]));
const assets = Object.fromEntries(
  readdirSync(join(root, "assets"), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `assets/${entry.parentPath.slice(join(root, "assets").length + 1).replaceAll("\\", "/")}${entry.parentPath === join(root, "assets") ? "" : "/"}${entry.name}`)
    .sort()
    .map((file) => [file, hash(join(root, file))]),
);

writeFileSync(resolve(output), `${JSON.stringify({ routes, assets }, null, 2)}\n`);
console.log(`Hashed ${Object.keys(routes).length} routes and ${Object.keys(assets).length} assets.`);
