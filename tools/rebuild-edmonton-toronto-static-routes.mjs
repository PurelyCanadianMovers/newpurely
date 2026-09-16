import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { EDMONTON_TORONTO_ROUTES, assertEdmontonTorontoTemplate } from "./edmonton-toronto-route-data.mjs";
const writer = "rebuild-edmonton-toronto-static-routes.mjs";
const siteRoot = resolve(process.argv[2] ?? "site-copy");
const templateRoot = join(dirname(fileURLToPath(import.meta.url)), "templates", "edmonton-toronto-static-routes");
for (const route of EDMONTON_TORONTO_ROUTES) {
  const source = join(templateRoot, route.slug + ".html"); const target = join(siteRoot, route.slug, "index.html");
  const html = await readFile(source, "utf8"); assertEdmontonTorontoTemplate(html, route); await mkdir(dirname(target), { recursive: true }); await copyFile(source, target); console.log(writer + ": rebuilt /" + route.slug + "/");
}
