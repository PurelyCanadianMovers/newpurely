import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const routes = process.argv.slice(3).length ? process.argv.slice(3) : [
  "/montreal-to-victoria-movers/",
  "/victoria-to-montreal-movers/",
  "/montreal-to-edmonton-movers/",
  "/montreal-to-calgary-movers/",
];
const failures = [];
for (const route of routes) {
  const file = join(root, route.replace(/^\/+|\/+$/g, ""), "index.html");
  const html = await readFile(file, "utf8");
  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  const local = [...new Set(refs.filter((ref) => ref.startsWith("/assets/") || ref.startsWith("../assets/")))];
  const missing = [];
  for (const ref of local) {
    const cleanRef = ref.split(/[?#]/, 1)[0];
    const relative = cleanRef.startsWith("../assets/") ? cleanRef.slice(3) : cleanRef.slice(1);
    try { await readFile(join(root, relative)); } catch { missing.push(ref); }
  }
  if (missing.length) failures.push(`${route} missing: ${[...new Set(missing)].join(", ")}`);
  if (/step36-edmonton-montreal\.css/i.test(html)) failures.push(`${route} retains invalid Edmonton–Montreal stylesheet reference`);
  console.log(`${route}: ${local.length} local asset references checked`);
}
if (failures.length) throw new Error(failures.join("\n"));
