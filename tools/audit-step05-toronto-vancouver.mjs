import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";
import { torontoVancouverFacts, torontoVancouverRoutes } from "./toronto-vancouver-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[4] ?? "STEP_05_TORONTO_VANCOUVER_AUDIT.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

function rawAudit(html, route, config) {
  const body = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => { try { const value = JSON.parse(match[1]); return value["@type"] === "FAQPage" ? [value] : []; } catch { return []; } });
  const faq = [...body.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => ({ question: clean(match[1]), answer: clean(match[2]) }));
  const schemaFaq = schemas[0]?.mainEntity?.map((item) => ({ question: clean(item.name), answer: clean(item.acceptedAnswer?.text) })) ?? [];
  const form = body.match(/<form\b[^>]*class="[^"]*pcm-estimate-form[^"]*"[^>]*>([\s\S]*?)<\/form>/i)?.[1] ?? "";
  const value = (name) => clean(form.match(new RegExp(`<input[^>]*name=["']${name}["'][^>]*value=["']([^"']*)`, "i"))?.[1]);
  const owner = routeOwnershipByUrl.get(route);
  return { owner: owner?.owner, rendering: owner?.rendering, postProcessors: owner?.postProcessors, reactBootstrap: /index-CNBNs70h\.js/i.test(html), step38Runtime: /step38-toronto-vancouver\.js|pcm-step38-config/i.test(html), staticDependencies: ["static-nav.css", "static-nav.js", "static-chat.css", "static-chat.js", "conversion-boost.js"].every((asset) => html.includes(asset)), title: clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]), canonical: html.match(/<link rel="canonical"[^>]*href="([^"]*)"/i)?.[1], h1: (body.match(/<h1\b/gi) ?? []).length, formCount: (body.match(/<form\b/gi) ?? []).length, pricing: (body.match(/class="[^"]*pcm-route-cost\b/gi) ?? []).length, tables: (body.match(/<table\b/gi) ?? []).length, glance: (body.match(/pcm-step38-glance\b/gi) ?? []).length, faqSection: (body.match(/data-pcm-route-faq-static/g) ?? []).length, faqPage: schemas.length, visibleFaq: faq.length, faqParity: JSON.stringify(faq) === JSON.stringify(schemaFaq), footer: (body.match(/<footer\b/gi) ?? []).length, localSeo: (body.match(/pcm-local-seo/gi) ?? []).length, legacyPricing: /Moving Cost Breakdown/i.test(body), undefined: /\bundefined\b/i.test(body), from: value("from"), to: value("to"), facts: { distance: html.includes(torontoVancouverFacts.distance), transit: html.includes(torontoVancouverFacts.transit), range: html.includes(torontoVancouverFacts.range), prices: torontoVancouverFacts.rows.every((row) => html.includes(row[0]) && html.includes(row[1])) }, relatedReverse: html.includes(config.reverseRoute), directionalCopy: html.includes(config.pickupCopy) && html.includes(config.deliveryCopy) };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const text = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
    const faqSection = [...document.querySelectorAll("h2")].find((n) => /^Frequently Asked Questions$/i.test(text(n.textContent)))?.closest("section");
    const schema = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent); } catch { return null; } }).find((v) => v?.["@type"] === "FAQPage");
    const faq = [...(faqSection?.querySelectorAll("summary") ?? [])].map((n) => ({ question: text(n.textContent), answer: text(n.parentElement?.querySelector("p")?.textContent) }));
    const form = document.querySelector(".pcm-estimate-form"); const h1 = document.querySelector("h1"); const glance = document.querySelector(".pcm-step38-glance"); const pricing = document.querySelector(".pcm-route-cost"); const h1s = h1 && getComputedStyle(h1); const gs = glance && getComputedStyle(glance); const grid = glance?.querySelector(".pcm-step38-glance__grid"); const grids = grid && getComputedStyle(grid); const resources = performance.getEntriesByType("resource").map((x) => x.name);
    return { title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.href, h1: text(h1?.textContent), h1Style: h1s ? [h1s.fontFamily, h1s.fontSize, h1s.lineHeight, h1s.fontWeight] : null, from: form?.querySelector('[name="from"]')?.value, to: form?.querySelector('[name="to"]')?.value, counts: { h1: document.querySelectorAll("h1").length, form: document.querySelectorAll(".pcm-estimate-form").length, pricing: document.querySelectorAll(".pcm-route-cost").length, tables: document.querySelectorAll(".pcm-route-cost table").length, glance: document.querySelectorAll(".pcm-step38-glance").length, faq: document.querySelectorAll(".pcm-route-faq-static").length, faqSchema: schema ? 1 : 0, visibleFaq: faq.length, footer: document.querySelectorAll("footer").length, nav: document.querySelectorAll("header nav, nav").length, chat: document.querySelectorAll('button[aria-label="Open chat assistant"]').length }, faqParity: JSON.stringify(faq) === JSON.stringify((schema?.mainEntity ?? []).map((x) => ({ question: text(x.name), answer: text(x.acceptedAnswer?.text) }))), facts: { distance: document.body.innerText.includes("~4,400 km"), transit: document.body.innerText.includes("9–22 days"), range: document.body.innerText.includes("$2,500–$15,000+") }, glanceStyle: gs ? { border: gs.borderTopWidth + " " + gs.borderTopStyle, background: gs.backgroundColor, radius: gs.borderRadius } : null, glanceGrid: grids?.gridTemplateColumns, pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, noUndefined: !/\bundefined\b/i.test(document.body.innerText), noSoft404: !/Page Not Found/i.test(document.body.innerText), routeBody: document.querySelector("main")?.innerText.includes("Moving from"), staticNavCssLoaded: resources.some((x) => x.includes("/assets/static-nav.css")), staticChatCssLoaded: resources.some((x) => x.includes("/assets/static-chat.css")), reactBundleRequested: resources.some((x) => x.includes("index-CNBNs70h.js")) };
  });
}

async function interactions(page) {
  const desktop = await page.evaluate(() => { const b = [...document.querySelectorAll("header button")].find((x) => x.textContent.trim() === "Services"); b?.click(); const menu = b?.parentElement?.querySelector(".pcm-static-dropdown"); return { dropdownOpened: Boolean(menu && !menu.hidden), aria: b?.getAttribute("aria-expanded") }; });
  const chat = await page.evaluate(() => { const launcher = document.querySelector('button[aria-label="Open chat assistant"]'); launcher?.click(); const panel = document.querySelector(".pcm-static-chat-panel"); const opened = Boolean(panel && !panel.hidden); panel?.querySelector('button[aria-label="Close"]')?.click(); return { opened, closed: Boolean(panel?.hidden) }; });
  await page.setViewportSize({ width: 390, height: 844 }); await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForTimeout(1200);
  return { desktop, chat, mobile: await page.evaluate(() => { const trigger = document.querySelector('header button[aria-label="Open menu"]'); const panel = document.querySelector(".pcm-static-mobile"); const initial = Boolean(panel && !panel.classList.contains("is-open") && trigger?.getAttribute("aria-expanded") === "false"); trigger?.click(); const opened = Boolean(panel?.classList.contains("is-open") && trigger?.getAttribute("aria-expanded") === "true"); trigger?.click(); const toggleClosed = Boolean(!panel?.classList.contains("is-open") && trigger?.getAttribute("aria-expanded") === "false"); trigger?.click(); document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); const escaped = Boolean(!panel?.classList.contains("is-open") && trigger?.getAttribute("aria-expanded") === "false"); const chat = document.querySelector('button[aria-label="Open chat assistant"]'); chat?.click(); const chatPanel = document.querySelector(".pcm-static-chat-panel"); const chatOpened = Boolean(chatPanel && !chatPanel.hidden); chatPanel?.querySelector('button[aria-label="Close"]')?.click(); return { initial, opened, toggleClosed, escaped, chatOpened, chatClosed: Boolean(chatPanel?.hidden), overflow: document.documentElement.scrollWidth <= innerWidth }; }) };
}

const results = [];
for (const [route, config] of Object.entries(torontoVancouverRoutes)) {
  const html = await readFile(join(root, route.slice(1), "index.html"), "utf8");
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); const errors = []; page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(new URL(route, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 }); await page.waitForTimeout(800); const initial = await snapshot(page); await page.waitForTimeout(1200); const delayed = await snapshot(page); await page.waitForTimeout(3500); const settled = await snapshot(page); const desktopInteractions = await interactions(page); const mobile = await snapshot(page); const result = { route, expected: { ...config, facts: torontoVancouverFacts }, raw: rawAudit(html, route, config), initial, delayed, settled, mobile, interactions: desktopInteractions, errors }; results.push(result); await page.close();
}
await browser.close(); await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
for (const result of results) console.log(`${result.route}: ${result.errors.length || result.raw.reactBootstrap || result.raw.step38Runtime || !result.raw.faqParity || !result.settled.faqParity ? "FAIL" : "PASS"}`);
console.log(`Wrote ${output}`);