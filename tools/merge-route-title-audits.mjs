import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

const [output, ...inputs] = process.argv.slice(2);
if (!output || inputs.length === 0) throw new Error("Usage: node tools/merge-route-title-audits.mjs <output> <input...>");

const byRoute = new Map();
let template;
for (const input of inputs) {
  const audit = JSON.parse(readFileSync(resolve(input), "utf8"));
  template ??= audit;
  for (const result of audit.results) {
    if (byRoute.has(result.route)) throw new Error(`Duplicate audit result for ${result.route}.`);
    byRoute.set(result.route, result);
  }
}

const missing = routePageOwnership.filter((entry) => !byRoute.has(entry.routeUrl));
if (missing.length || byRoute.size !== routePageOwnership.length) {
  throw new Error(`Expected ${routePageOwnership.length} unique routes; found ${byRoute.size}; missing ${missing.map((entry) => entry.routeUrl).join(", ")}.`);
}

const merged = {
  ...template,
  generatedAt: new Date().toISOString(),
  inputs,
  results: routePageOwnership.map((entry) => byRoute.get(entry.routeUrl)),
};
writeFileSync(resolve(output), `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Merged ${merged.results.length} unique route results into ${output}.`);
