import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";

const owner = "generate-vancouver-halifax-static-route.mjs";
const route = "vancouver-to-halifax-movers";
const root = resolve(process.argv[2] ?? "site-copy");
const template = resolve("tools/templates/hydration-static-routes/vancouver-to-halifax-movers.html");
const target = join(root, route, "index.html");
const seed = process.argv.includes("--seed-from-git");
const refreshTemplate = process.argv.includes("--refresh-template-from-output");

assertRouteOwnership(owner, [route]);

function ensureAsset(html, marker, tag) {
  if (html.includes(marker)) return html;
  if (!/<\/body>/i.test(html)) throw new Error("Vancouver to Halifax template is missing </body>");
  return html.replace(/<\/body>/i, `${tag}</body>`);
}

function normalizeStaticSource(html) {
  html = html.replace(/\s*<script type="module"[^>]*src="\.\.\/assets\/index-[^"]+\.js"><\/script>/g, "");
  html = html
    .replace(/(<input\b[^>]*\bname="from"[^>]*?)\splaceholder="Vancouver, BC"/i, '$1 value="Vancouver, BC"')
    .replace(/(<input\b[^>]*\bname="to"[^>]*?)\splaceholder="Halifax, NS"/i, '$1 value="Halifax, NS"');
  html = ensureAsset(html, "/assets/static-nav.css", '<link rel="stylesheet" href="/assets/static-nav.css">');
  html = ensureAsset(html, "/assets/static-chat.css", '<link rel="stylesheet" href="/assets/static-chat.css">');
  html = ensureAsset(html, "/assets/static-nav.js", '<script src="/assets/static-nav.js" defer></script>');
  html = ensureAsset(html, "/assets/static-chat.js", '<script src="/assets/static-chat.js" defer></script>');
  return html;
}

if (seed) {
  const historical = execFileSync("git", ["show", "3bd175f3:site-copy/vancouver-to-halifax-movers/index.html"], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  await mkdir(dirname(template), { recursive: true });
  await writeFile(template, normalizeStaticSource(historical), "utf8");
  console.log(`Seeded durable static source: ${template}`);
}

if (refreshTemplate) {
  await mkdir(dirname(template), { recursive: true });
  await writeFile(template, normalizeStaticSource(await readFile(target, "utf8")), "utf8");
  console.log(`Refreshed durable static source: ${template}`);
}

const html = normalizeStaticSource(await readFile(template, "utf8"));
await mkdir(dirname(target), { recursive: true });
await writeFile(target, html, "utf8");
console.log(`Generated static route: /${route}/`);
