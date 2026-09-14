import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

const BRAND = "Purely Canadian Movers";
const SUFFIX = ` | ${BRAND}`;
const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3];
const output = process.argv[4];
const settleMs = Number(process.env.PCM_TITLE_SETTLE_MS ?? 9000);
const concurrency = Number(process.env.PCM_TITLE_AUDIT_CONCURRENCY ?? 4);
const routeFilter = new Set((process.env.PCM_TITLE_AUDIT_ROUTES ?? "").split(",").filter(Boolean));
const excludedRoutes = new Set((process.env.PCM_TITLE_AUDIT_EXCLUDE ?? "").split(",").filter(Boolean));
const entries = routePageOwnership.filter((entry) =>
  (routeFilter.size === 0 || routeFilter.has(entry.routeUrl)) && !excludedRoutes.has(entry.routeUrl));

if (!baseUrl) throw new Error("Usage: node tools/audit-route-title-metadata.mjs <root> <base-url> [output.json]");

function decode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function tagAttribute(html, selectorName, selectorValue, attribute = "content") {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const attrs = Object.fromEntries(
      [...tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map((match) => [match[1].toLowerCase(), decode(match[3])]),
    );
    if (attrs[selectorName] === selectorValue) return attrs[attribute] ?? "";
  }
  return "";
}

function rawMetadata(routeUrl) {
  const html = readFileSync(join(root, routeUrl.slice(1), "index.html"), "utf8");
  const title = decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ?? "");
  return {
    title,
    ogTitle: tagAttribute(html, "property", "og:title"),
    twitterTitle: tagAttribute(html, "name", "twitter:title"),
  };
}

function terminalBrandCount(title) {
  let value = title.trim();
  let count = 0;
  while (value.toLowerCase().endsWith(SUFFIX.toLowerCase())) {
    count += 1;
    value = value.slice(0, -SUFFIX.length).trimEnd();
  }
  return count;
}

function classify(raw, early, settled) {
  const issues = [];
  const brandCount = terminalBrandCount(settled.title);
  if (brandCount === 0) issues.push("missing brand suffix");
  if (brandCount > 1) issues.push("duplicated brand suffix");
  if (/^(?:Vancouver Movers \| Local & Long-Distance Moving|Purely Canadian Movers \| Professional Moving Company Vancouver BC Since 1991)$/i.test(settled.title)) issues.push("generic title");
  if (settled.title !== raw.title || early.title !== settled.title) issues.push("runtime overwrite");
  if (settled.ogTitle !== settled.title) issues.push("OG-only mismatch");
  if (settled.twitterTitle !== settled.title) issues.push("Twitter-only mismatch");
  if (new Set([settled.title, settled.ogTitle, settled.twitterTitle]).size > 1) issues.push("title-field disagreement");
  return { status: issues[0] ?? "canonical", issues, brandCount };
}

const playwrightUrl = process.env.PLAYWRIGHT_PATH;
if (!playwrightUrl) throw new Error("PLAYWRIGHT_PATH must be the file URL for playwright/index.mjs.");
const { chromium } = await import(playwrightUrl);
const browser = await chromium.launch({
  executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined,
  headless: true,
});

async function inspect(entry) {
  const raw = rawMetadata(entry.routeUrl);
  const page = await browser.newPage();
  const auditedOrigin = new URL(baseUrl).origin;
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    const blockBundle = process.env.PCM_TITLE_AUDIT_BLOCK_BUNDLE === "1" && /\/assets\/index-[^/]+\.js$/.test(requestUrl.pathname);
    if (requestUrl.origin !== auditedOrigin || blockBundle) await route.abort();
    else await route.continue();
  });
  if (process.env.PCM_TITLE_AUDIT_DISABLE_MUTATION_OBSERVERS === "1") {
    await page.addInitScript(() => {
      window.MutationObserver = class {
        observe() {}
        disconnect() {}
        takeRecords() { return []; }
      };
    });
  }
  const titleHistory = [];
  await page.exposeFunction("pcmRecordTitle", (value) => titleHistory.push({ at: Date.now(), value }));
  await page.addInitScript(() => {
    const begin = Date.now();
    const record = () => window.pcmRecordTitle({ elapsedMs: Date.now() - begin, title: document.title });
    const observer = new MutationObserver(record);
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
      record();
    });
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const read = () => page.evaluate(() => ({
    title: document.title,
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute("content") ?? "",
  }));
  let early;
  let settled;
  try {
    await page.goto(new URL(entry.routeUrl, baseUrl).href, { waitUntil: "commit", timeout: 30000 });
    await page.waitForLoadState("domcontentloaded", { timeout: 15000 }).catch((error) => errors.push(error.message));
    await page.waitForTimeout(100);
    early = await read();
    await page.waitForTimeout(settleMs);
    settled = await read();
  } finally {
    await page.close();
  }
  return {
    route: entry.routeUrl,
    owner: entry.owner,
    architecture: entry.rendering,
    raw,
    early,
    settled,
    ...classify(raw, early, settled),
    titleHistory,
    pageErrors: [...new Set(errors)],
  };
}

const results = new Array(entries.length);
let cursor = 0;
function payload() {
  return {
    generatedAt: new Date().toISOString(),
    root,
    baseUrl,
    settleMs,
    policy: `<route-specific title>${SUFFIX}`,
    results: results.filter(Boolean),
  };
}
function save() {
  if (output) writeFileSync(resolve(output), `${JSON.stringify(payload(), null, 2)}\n`);
}
async function worker() {
  while (cursor < entries.length) {
    const index = cursor++;
    results[index] = await inspect(entries[index]);
    console.log(`${index + 1}/${entries.length} ${results[index].route} ${results[index].status}`);
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
await browser.close();

const json = `${JSON.stringify(payload(), null, 2)}\n`;
if (output) writeFileSync(resolve(output), json);
else process.stdout.write(json);
