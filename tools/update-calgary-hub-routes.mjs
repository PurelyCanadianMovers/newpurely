import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { updateCalgaryHubRoutes } from "./calgary-hub-routes.mjs";

const root = process.argv[2] ?? "site-copy";
const path = join(root, "calgary-long-distance-movers", "index.html");
let html = await readFile(path, "utf8");
html = updateCalgaryHubRoutes(html);
await writeFile(path, html, "utf8");
console.log(`Updated ${path}`);
