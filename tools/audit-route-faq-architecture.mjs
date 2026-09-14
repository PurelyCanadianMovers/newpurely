import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";
import { normalizeFaqText } from "./faq-parity.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3];
const output = resolve(process.argv[4] ?? "outputs/step31-faq-audit.json");
const settleMs = Number(process.env.PCM_FAQ_SETTLE_MS ?? 9000);
const concurrency = Number(process.env.PCM_FAQ_AUDIT_CONCURRENCY ?? 4);
const routeFilter = new Set((process.env.PCM_FAQ_AUDIT_ROUTES ?? "").split(",").filter(Boolean));
const excludedRoutes = new Set((process.env.PCM_FAQ_AUDIT_EXCLUDE ?? "").split(",").filter(Boolean));
const entriesToAudit = routePageOwnership.filter((entry) =>
  (!routeFilter.size || routeFilter.has(entry.routeUrl)) && !excludedRoutes.has(entry.routeUrl));
if (!baseUrl) throw new Error("Usage: node tools/audit-route-faq-architecture.mjs <root> <base-url> [output.json]");

function faqNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => faqNodes(item, nodes));
  else Object.values(value).forEach((item) => faqNodes(item, nodes));
  return nodes;
}

function schemaEntriesFromHtml(html) {
  const entities = [];
  for (const match of html.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      for (const node of faqNodes(data)) {
        entities.push((node.mainEntity ?? []).map((entry) => ({
          question: normalizeFaqText(entry?.name),
          answer: normalizeFaqText(entry?.acceptedAnswer?.text),
        })));
      }
    } catch {}
  }
  return entities;
}

function rawMetrics(html) {
  const withoutHiddenContainers = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const headings = [...withoutHiddenContainers.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
    .filter((match) => /Frequently Asked Questions|Frequently asked questions|\bFAQ\b/i.test(normalizeFaqText(match[1])));
  const sections = new Set();
  const visibleEntries = [];
  for (const heading of headings) {
    const start = withoutHiddenContainers.lastIndexOf("<section", heading.index);
    const end = withoutHiddenContainers.indexOf("</section>", heading.index);
    if (start < 0 || end < 0) continue;
    sections.add(`${start}:${end}`);
    const section = withoutHiddenContainers.slice(start, end + 10);
    for (const match of section.matchAll(/<(h3|h4|summary)\b[^>]*>([\s\S]*?)<\/\1>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
      visibleEntries.push({ question: normalizeFaqText(match[2]), answer: normalizeFaqText(match[3]) });
    }
  }
  return {
    faqSectionCount: sections.size,
    faqHeadingCount: headings.length,
    visibleEntries,
    schemaEntities: schemaEntriesFromHtml(html),
    localSeoCount: (html.match(/\bpcm-local-seo\b/g) ?? []).length,
  };
}

function compare(visible, entities) {
  const schema = entities.length === 1 ? entities[0] : [];
  const differences = [];
  for (let index = 0; index < Math.max(visible.length, schema.length); index += 1) {
    if (visible[index]?.question !== schema[index]?.question || visible[index]?.answer !== schema[index]?.answer) {
      differences.push({ index, visible: visible[index] ?? null, schema: schema[index] ?? null });
    }
  }
  return differences;
}

const playwrightUrl = process.env.PLAYWRIGHT_PATH;
if (!playwrightUrl) throw new Error("PLAYWRIGHT_PATH must be the file URL for playwright/index.mjs");
const { chromium } = await import(playwrightUrl);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });

async function inspect(entry) {
  const html = readFileSync(join(root, entry.routeUrl.slice(1), "index.html"), "utf8");
  const raw = rawMetrics(html);
  const page = await browser.newPage();
  const origin = new URL(baseUrl).origin;
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) await route.abort();
    else await route.continue();
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let early;
  let settled;
  async function read() {
    return page.evaluate(() => {
      const normal = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
      const visible = (element) => {
        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden" && !element.hidden;
      };
      const headings = [...document.querySelectorAll("h2")].filter((heading) =>
        visible(heading) && /Frequently Asked Questions|Frequently asked questions|\bFAQ\b/i.test(normal(heading.textContent)));
      const sections = [...new Set(headings.map((heading) => heading.closest("section")).filter(Boolean))];
      const entries = headings.flatMap((heading) => [...((heading.closest("section"))?.querySelectorAll("h3,h4,summary") ?? [])].flatMap((question) => {
        if (!(heading.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING)) return [];
        const card = question.parentElement;
        const answer = card?.querySelector("p");
        return answer && visible(question) && visible(answer)
          ? [{ question: normal(question.textContent), answer: normal(answer.textContent) }]
          : [];
      }));
      const schemaEntities = [];
      const walk = (value) => {
        if (!value || typeof value !== "object") return;
        if (value["@type"] === "FAQPage") {
          schemaEntities.push((value.mainEntity ?? []).map((entry) => ({
            question: normal(entry?.name), answer: normal(entry?.acceptedAnswer?.text),
          })));
        }
        if (Array.isArray(value)) value.forEach(walk);
        else Object.values(value).forEach(walk);
      };
      document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
        try { walk(JSON.parse(script.textContent)); } catch {}
      });
      return {
        faqSectionCount: sections.length,
        faqHeadingCount: headings.length,
        visibleEntries: entries,
        schemaEntities,
        localSeoCount: document.querySelectorAll(".pcm-local-seo").length,
        h1Count: document.querySelectorAll("h1").length,
        quoteFormCount: document.querySelectorAll("form").length,
        pricingTableCount: document.querySelectorAll(".pcm-route-cost table, section table").length,
        glanceCount: [...document.querySelectorAll("h2")].filter((h) => /Route at a Glance/i.test(normal(h.textContent))).length,
        navPresent: Boolean(document.querySelector("nav")),
        chatbotPresent: Boolean(document.querySelector('#pcm-chat, .pcm-chat, [data-pcm-chat], [class*="chat"]')),
        title: document.title,
      };
    });
  }
  try {
    await page.goto(new URL(entry.routeUrl, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(100);
    early = await read();
    await page.waitForTimeout(settleMs);
    settled = await read();
  } catch (error) {
    errors.push(error.message);
    early ??= { unavailable: true };
    settled ??= { unavailable: true };
  } finally {
    await page.close();
  }
  if (settled.unavailable) return { route: entry.routeUrl, owner: entry.owner, rendering: entry.rendering, raw, early, settled, issues: ["runtime audit unavailable"], status: "runtime audit unavailable", pageErrors: [...new Set(errors)] };
  raw.differences = compare(raw.visibleEntries, raw.schemaEntities);
  settled.differences = compare(settled.visibleEntries, settled.schemaEntities);
  const issues = [];
  if (settled.faqSectionCount !== 1) issues.push(settled.faqSectionCount > 1 ? "duplicate visible FAQ" : "missing visible FAQ");
  if (settled.faqHeadingCount !== 1) issues.push(settled.faqHeadingCount > 1 ? "duplicate FAQ heading" : "missing FAQ heading");
  if (settled.schemaEntities.length !== 1) issues.push(settled.schemaEntities.length > 1 ? "duplicate schema entity" : "missing FAQPage");
  if (settled.differences.length) {
    const visibleCount = settled.visibleEntries.length;
    const schemaCount = settled.schemaEntities.length === 1 ? settled.schemaEntities[0].length : 0;
    if (schemaCount < visibleCount) issues.push("missing schema question");
    else if (schemaCount > visibleCount) issues.push("extra schema question");
    else issues.push("stale schema answer");
  }
  const runtimeChanged = raw.faqHeadingCount !== settled.faqHeadingCount || raw.schemaEntities.length !== settled.schemaEntities.length ||
      JSON.stringify(raw.visibleEntries) !== JSON.stringify(settled.visibleEntries) || JSON.stringify(raw.schemaEntities) !== JSON.stringify(settled.schemaEntities);
  if (settled.localSeoCount) issues.push("pcm-local-seo");
  return { route: entry.routeUrl, owner: entry.owner, rendering: entry.rendering, raw, early, settled, runtimeChanged, issues: [...new Set(issues)], status: issues.length ? issues[0] : "canonical", pageErrors: [...new Set(errors)] };
}

const results = new Array(entriesToAudit.length);
let cursor = 0;
async function worker() {
  while (cursor < entriesToAudit.length) {
    const index = cursor++;
    results[index] = await inspect(entriesToAudit[index]);
    console.log(`${index + 1}/${entriesToAudit.length} ${results[index].route} ${results[index].issues.join(", ") || "canonical"}`);
    writeFileSync(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), root, baseUrl, settleMs, results: results.filter(Boolean) }, null, 2)}\n`);
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, results.length) }, worker));
await browser.close();
writeFileSync(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), root, baseUrl, settleMs, results }, null, 2)}\n`);
console.log(`Wrote ${output}`);
