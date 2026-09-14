import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";
import { torontoVancouverFacts, torontoVancouverRoutes } from "./toronto-vancouver-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4174";
const output = resolve(process.argv[4] ?? "STEP_38_TORONTO_VANCOUVER_AUDIT.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE, headless: true });
const bundle = await readFile(join(root, "assets", "index-CNBNs70h.js"), "utf8");

function raw(html, route, config) {
  const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  return {
    owner: routeOwnershipByUrl.get(route)?.owner,
    rendering: routeOwnershipByUrl.get(route)?.rendering,
    postProcessors: routeOwnershipByUrl.get(route)?.postProcessors,
    reactBootstrap: (html.match(/index-CNBNs70h\.js/g) ?? []).length,
    exactReactSupport: bundle.includes(route),
    staticNav: (html.match(/static-nav\.js/g) ?? []).length,
    staticChat: (html.match(/static-chat\.js/g) ?? []).length,
    title: html.match(/<title\b[^>]*>(.*?)<\/title>/i)?.[1],
    ogTitle: html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1],
    twitterTitle: html.match(/<meta name="twitter:title" content="([^"]*)"/i)?.[1],
    description: html.match(/<meta name="description" content="([^"]*)"/i)?.[1],
    canonical: html.match(/<link rel="canonical"[^>]*href="([^"]*)"/i)?.[1],
    ogUrl: html.match(/<meta property="og:url" content="([^"]*)"/i)?.[1],
    h1Count: (withoutScripts.match(/<h1\b/gi) ?? []).length,
    quotePanelCount: (withoutScripts.match(/pcm-lead-panel/g) ?? []).length,
    pricingCount: (withoutScripts.match(/pcm-step38-pricing/g) ?? []).length,
    pricingTableCount: (withoutScripts.match(/<table\b/gi) ?? []).length,
    glanceCount: (withoutScripts.match(/pcm-step38-glance/g) ?? []).length,
    faqSectionCount: (withoutScripts.match(/data-pcm-route-faq-static/g) ?? []).length,
    faqHeadingCount: (withoutScripts.match(/Frequently Asked Questions/g) ?? []).length,
    faqPageCount: (html.match(/"@type":"FAQPage"/g) ?? []).length,
    localSeoCount: (withoutScripts.match(/pcm-local-seo/g) ?? []).length,
    footerCount: (withoutScripts.match(/<footer\b/gi) ?? []).length,
    legacyCount: (withoutScripts.match(/Moving Cost Breakdown/g) ?? []).length,
    routeConfig: html.includes(`"routeLabel":"${config.routeLabel}"`),
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const faq = [...document.querySelectorAll(".pcm-route-faq-static details")].map((item) => ({ question: clean(item.querySelector("summary")?.textContent), answer: clean(item.querySelector("p")?.textContent) }));
    const schema = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => { try { const value = JSON.parse(script.textContent); if (value["@type"] === "FAQPage") schema.push((value.mainEntity ?? []).map((item) => ({ question: clean(item.name), answer: clean(item.acceptedAnswer?.text) }))); } catch {} });
    const quote = document.querySelector(".pcm-lead-panel");
    const h1 = document.querySelector("h1");
    const hs = h1 && getComputedStyle(h1);
    return {
      ready: document.documentElement.dataset.pcmStep38Ready,
      h1: clean(h1?.textContent), h1Count: document.querySelectorAll("h1").length,
      h1Style: hs ? [hs.fontFamily, hs.fontSize, hs.lineHeight, hs.fontWeight] : null,
      from: quote?.querySelector('[name="from"]')?.value, to: quote?.querySelector('[name="to"]')?.value,
      title: document.title, ogTitle: document.querySelector('meta[property="og:title"]')?.content, twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content, canonical: document.querySelector('link[rel="canonical"]')?.href, ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      counts: { quote: document.querySelectorAll(".pcm-lead-panel").length, form: document.querySelectorAll(".pcm-estimate-form").length, pricing: document.querySelectorAll(".pcm-step38-pricing").length, table: document.querySelectorAll(".pcm-step38-pricing table").length, rows: document.querySelectorAll(".pcm-step38-pricing tbody tr").length, glance: document.querySelectorAll(".pcm-step38-glance").length, faq: document.querySelectorAll(".pcm-route-faq-static").length, faqHeading: [...document.querySelectorAll("h2")].filter((item) => /Frequently Asked Questions/i.test(clean(item.textContent))).length, faqSchema: schema.length, footer: document.querySelectorAll("footer").length, localSeo: document.querySelectorAll(".pcm-local-seo").length, legacy: (document.body.innerText.match(/Moving Cost Breakdown/g) ?? []).length, chat: [...document.querySelectorAll("button")].filter((item) => item.getAttribute("aria-label") === "Open chat assistant").length },
      faqParity: schema.length === 1 && JSON.stringify(faq) === JSON.stringify(schema[0]),
      facts: { distance: document.body.innerText.includes("~4,400 km"), transit: document.body.innerText.includes("9–22 days"), range: document.body.innerText.includes("$2,500–$15,000+") },
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      undefined: /\bundefined\b/i.test(document.body.innerText), homepage: /Your Move\. Our Family\. One Standard:/i.test(document.body.innerText), soft404: /Page Not Found/i.test(document.body.innerText),
    };
  });
}

async function responsive(page, viewport) {
  await page.setViewportSize(viewport); await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('html[data-pcm-step38-ready="1"]'); await page.waitForTimeout(250);
  return page.evaluate(() => { const style = (selector) => { const element = document.querySelector(selector); const value = element && getComputedStyle(element); return value ? { display: value.display, columns: value.gridTemplateColumns, overflowX: value.overflowX } : null; }; const wrap = document.querySelector(".pcm-route-cost__table-wrap"); const h1 = getComputedStyle(document.querySelector("h1")); return { viewport: [innerWidth, innerHeight], pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, h1: [h1.fontSize, h1.lineHeight, h1.fontWeight], quote: style(".pcm-lead-panel__inner"), form: style(".pcm-estimate-form"), glance: style(".pcm-step38-glance__grid"), pricing: style(".pcm-route-cost__table-wrap"), tableMinWidth: getComputedStyle(document.querySelector(".pcm-route-cost table")).minWidth, pricingInternalScroll: Boolean(wrap && wrap.scrollWidth > wrap.clientWidth), brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src) }; });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const open = page.locator('button[aria-label="Open menu"]'); result.menuTrigger = await open.count() === 1 && await open.isVisible(); result.expandedBefore = await open.getAttribute("aria-expanded"); if (result.menuTrigger) { await open.click(); result.expandedAfter = await open.getAttribute("aria-expanded"); const dialog = page.locator('[role="dialog"]'); result.menuOpened = await dialog.count() === 1 && await dialog.isVisible(); await page.keyboard.press("Escape"); await page.waitForTimeout(800); result.menuClosed = await dialog.count() === 0 || !(await dialog.isVisible()); result.expandedClosed = await open.getAttribute("aria-expanded"); }
  } else {
    const services = page.getByRole("button", { name: "Services", exact: true }); result.servicesTrigger = await services.count() === 1 && await services.isVisible(); if (result.servicesTrigger) { await services.click(); result.dropdownOpened = await page.locator("header a", { hasText: "Local Moving" }).first().isVisible(); await page.keyboard.press("Escape"); }
  }
  const launcher = page.locator('button[aria-label="Open chat assistant"]'); result.chatLauncher = await launcher.count() === 1 && await launcher.isVisible(); if (result.chatLauncher) { await launcher.click(); const close = page.locator('button[aria-label*="Close chat"],button[title*="Close chat"]'); result.chatOpened = await close.count() === 1 && await close.isVisible(); if (result.chatOpened) await close.click(); else await page.keyboard.press("Escape"); result.chatClosed = await close.count() === 0 || !(await close.isVisible()); }
  return result;
}

const results = [];
for (const [route, config] of Object.entries(torontoVancouverRoutes)) {
  const html = await readFile(join(root, route.slice(1), "index.html"), "utf8");
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); const messages = [];
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}${message.location().url ? ` [${message.location().url}]` : ""}`); }); page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  await page.goto(new URL(route, baseUrl).href, { waitUntil: "domcontentloaded" }); await page.waitForSelector('html[data-pcm-step38-ready="1"]');
  const hydrated = await snapshot(page); await page.waitForTimeout(1200); const oneSecond = await snapshot(page); await page.waitForTimeout(4200); const fiveSeconds = await snapshot(page);
  const desktop = await responsive(page, { width: 1280, height: 900 }); const desktopInteractions = await interactions(page, false);
  const mobile = await responsive(page, { width: 390, height: 844 }); const mobileInteractions = await interactions(page, true);
  results.push({ route, expected: { ...config, ...torontoVancouverFacts }, raw: raw(html, route, config), lifecycle: { hydrated, oneSecond, fiveSeconds }, responsive: { desktop, mobile }, interactions: { desktop: desktopInteractions, mobile: mobileInteractions }, consoleMessages: [...new Set(messages)] }); await page.close();
}
await browser.close(); await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`); console.log(`Wrote ${output}`);
