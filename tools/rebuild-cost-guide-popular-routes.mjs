import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { ensureDedicatedPopularRoutes } from "./cost-guide-popular-routes.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");
const html = await readFile(costGuidePath, "utf8");
const updated = ensureDedicatedPopularRoutes(html);
await writeFile(costGuidePath, updated, "utf8");
console.log(`Updated ${costGuidePath} popular moving routes`);
