import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { ensureDedicatedPopularRoutes } from "./cost-guide-popular-routes.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");
const html = await readFile(costGuidePath, "utf8");
let updated = ensureDedicatedPopularRoutes(html);
const popularHeadingIndex = updated.search(/<h2\b[^>]*>Popular Moving Routes in Canada<\/h2>/i);
if (popularHeadingIndex >= 0) {
  let prefix = updated.slice(0, popularHeadingIndex);
  const suffix = updated.slice(popularHeadingIndex);
  for (const label of ["Calgary → Winnipeg", "Winnipeg → Calgary"]) {
    let removed = false;
    prefix = prefix.replace(/<tr\b[\s\S]*?<\/tr>/gi, (row) => {
      if (!removed && row.includes(label)) {
        removed = true;
        return "";
      }
      return row;
    });
  }
  updated = prefix + suffix;
}
await writeFile(costGuidePath, updated, "utf8");
console.log(`Updated ${costGuidePath} popular moving routes`);
