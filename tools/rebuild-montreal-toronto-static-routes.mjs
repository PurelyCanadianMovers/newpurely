import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MONTREAL_TORONTO_ROUTES, assertMontrealTorontoTemplate } from "./montreal-toronto-route-data.mjs";

const writer = "rebuild-montreal-toronto-static-routes.mjs";
const siteRoot = resolve(process.argv[2] ?? "site-copy");
const templateRoot = join(dirname(fileURLToPath(import.meta.url)), "templates", "montreal-toronto-static-routes");

for (const route of MONTREAL_TORONTO_ROUTES) {
  const source = join(templateRoot, `${route.slug}.html`);
  const target = join(siteRoot, route.slug, "index.html");
  const html = await readFile(source, "utf8");
  assertMontrealTorontoTemplate(html, route);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`${writer}: rebuilt /${route.slug}/`);
}
