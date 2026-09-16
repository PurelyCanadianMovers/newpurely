import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const route = "/montreal-to-edmonton-movers/";
const file = join(root, "montreal-to-edmonton-movers", "index.html");
const html = await readFile(file, "utf8");
const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
const local = refs.filter((ref) => ref.startsWith("/assets/") || ref.startsWith("../assets/"));
const missing = [];
for (const ref of local) {
  const relative = ref.startsWith("../assets/") ? ref.slice(3) : ref.slice(1);
  try {
    await readFile(join(root, relative));
  } catch {
    missing.push(ref);
  }
}
if (missing.length) throw new Error(`${route} references missing local assets: ${[...new Set(missing)].join(", ")}`);
if (html.includes("/assets/step36-edmonton-montreal.css")) throw new Error(`${route} retains invalid Edmonton–Montreal stylesheet reference`);
console.log(`${route}: ${[...new Set(local)].length} local assets exist`);