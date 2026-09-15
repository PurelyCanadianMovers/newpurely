import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CALGARY_TORONTO_ROUTES, assertCalgaryTorontoTemplate } from "./calgary-toronto-route-data.mjs";

const writer = "rebuild-calgary-toronto-static-routes.mjs";
const siteRoot = resolve(process.argv[2] ?? "site-copy");
const toolRoot = dirname(fileURLToPath(import.meta.url));
const templateRoot = join(toolRoot, "templates", "calgary-toronto-static-routes");

for (const route of CALGARY_TORONTO_ROUTES) {
  const source = join(templateRoot, `${route.slug}.html`);
  const target = join(siteRoot, route.slug, "index.html");
  const html = await readFile(source, "utf8");
  assertCalgaryTorontoTemplate(html, route);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`${writer}: rebuilt /${route.slug}/`);
}
