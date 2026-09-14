import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const output = process.argv[3];

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stripTitleMetadata(head) {
  return head
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "<title-metadata>")
    .replace(/<meta\b(?=[^>]*(?:property=["']og:title["']|name=["']twitter:title["']))[^>]*>/gi, "<social-title-metadata>");
}

function text(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

const routes = routePageOwnership.map((entry) => {
  const html = readFileSync(join(root, entry.routeUrl.slice(1), "index.html"), "utf8");
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const h1 = text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const formDefaults = [...html.matchAll(/<(?:input|select)\b[^>]*\bname=["'](?:from|to)["'][^>]*>/gi)].map((match) => match[0]);
  return {
    route: entry.routeUrl,
    fullHash: hash(html),
    bodyHash: hash(body),
    mainHash: hash(main),
    headNonTitleHash: hash(stripTitleMetadata(head)),
    h1,
    formDefaults,
    faqSchemaCount: (html.match(/FAQPage/g) ?? []).length,
    localSeoCount: (html.match(/pcm-local-seo/g) ?? []).length,
  };
});

const json = `${JSON.stringify({ generatedAt: new Date().toISOString(), root, routes }, null, 2)}\n`;
if (output) writeFileSync(resolve(output), json);
else process.stdout.write(json);
