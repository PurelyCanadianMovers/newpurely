import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertTorontoVancouverStaticTemplate, torontoVancouverRoutes } from "./toronto-vancouver-static-route-data.mjs";

const writer = "rebuild-toronto-vancouver-static-routes.mjs";
const siteRoot = resolve(process.argv[2] ?? "site-copy");
const templateRoot = join(dirname(fileURLToPath(import.meta.url)), "templates", "toronto-vancouver-static-routes");

for (const [routePath, config] of Object.entries(torontoVancouverRoutes)) {
  const route = { ...config, slug: routePath.slice(1, -1) };
  const source = join(templateRoot, `${route.slug}.html`);
  const target = join(siteRoot, route.slug, "index.html");
  const html = await readFile(source, "utf8");
  assertTorontoVancouverStaticTemplate(html, route);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`${writer}: rebuilt /${route.slug}/`);
}