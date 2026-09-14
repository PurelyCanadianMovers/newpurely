import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";
import { torontoVictoriaFacts, torontoVictoriaRoutes } from "./toronto-victoria-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4176";
const output = resolve(process.argv[4] ?? "STEP_39_TORONTO_VICTORIA_AUDIT.json");
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE, headless: true });
const bundle = await readFile(join(root, "assets", "index-CNBNs70h.js"), "utf8");
const cleanHtml = (value) => String(value ?? "").replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replace(/\s+/g, " ").trim();

function rawAudit(html, route) {
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const ownership = routeOwnershipByUrl.get(route);
  const pick = (pattern) => cleanHtml(html.match(pattern)?.[1]);
  return {
    owner: ownership.owner,
    postProcessors: ownership.postProcessors,
    declaredRender: ownership.rendering,
    actualRender: /<script\b[^>]*type=["']module["'][^>]*index-CNBNs70h\.js/i.test(html) ? "react-spa" : "static",
    reactBootstrap: /<script\b[^>]*type=["']module["'][^>]*index-CNBNs70h\.js/i.test(html),
    exactReactSupport: bundle.includes(route),
    staticNav: /static-nav\.js/i.test(html), staticChat: /static-chat\.js/i.test(html), conversionRuntime: /conversion-boost\.js/i.test(html),
    title: pick(/<title\b[^>]*>([\s\S]*?)<\/title>/i), ogTitle: pick(/<meta property="og:title" content="([^"]*)"/i), twitterTitle: pick(/<meta name="twitter:title" content="([^"]*)"/i),
    description: pick(/<meta name="description" content="([^"]*)"/i), canonical: pick(/<link rel="canonical"[^>]*href="([^"]*)"/i), ogUrl: pick(/<meta property="og:url" content="([^"]*)"/i),
    h1: cleanHtml(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]),
    counts: { h1: (body.match(/<h1\b/gi) ?? []).length, quote: (body.match(/<section\b[^>]*\bpcm-lead-panel\b/gi) ?? []).length, form: (body.match(/<form\b/gi) ?? []).length, pricing: (body.match(/data-pcm-step39-pricing="1"/gi) ?? []).length, table: (body.match(/<table\b/gi) ?? []).length, glance: (body.match(/Route at a Glance/gi) ?? []).length, faq: (body.match(/data-pcm-step39-faq="1"/gi) ?? []).length, faqHeading: (body.match(/Frequently Asked Questions/gi) ?? []).length, faqPage: (html.match(/["']@type["']\s*:\s*["']FAQPage["']/gi) ?? []).length, localSeo: (body.match(/pcm-local-seo/gi) ?? []).length, footer: (body.match(/<footer\b/gi) ?? []).length },
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const faq = [...document.querySelectorAll(".pcm-step39-faq article")].map((item) => ({ question: clean(item.querySelector("h3")?.textContent), answer: clean(item.querySelector("p")?.textContent) }));
    const schemas = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => { try { const data = JSON.parse(script.textContent); (function walk(value) { if (!value || typeof value !== "object") return; if (value["@type"] === "FAQPage") schemas.push((value.mainEntity ?? []).map((item) => ({ question: clean(item.name), answer: clean(item.acceptedAnswer?.text) }))); if (Array.isArray(value)) value.forEach(walk); else Object.values(value).forEach(walk); }(data)); } catch {} });
    const h1 = document.querySelector("h1"), h1Style = h1 && getComputedStyle(h1), quote = document.querySelector(".pcm-lead-panel,.pcm-top-estimate-wrap"), pricing = document.querySelector(".pcm-step39-pricing"), main = document.querySelector(".pcm-step39-main");
    const relevantText = clean([main?.innerText, pricing?.innerText, document.querySelector(".pcm-step39-faq")?.innerText].join(" "));
    return {
      ready: document.documentElement.dataset.pcmStep39Ready,
      h1: clean(h1?.textContent), h1Count: document.querySelectorAll("h1").length, h1Style: h1Style ? [h1Style.fontFamily, h1Style.fontSize, h1Style.lineHeight, h1Style.fontWeight] : null,
      from: quote?.querySelector('[name="from"]')?.value, to: quote?.querySelector('[name="to"]')?.value,
      title: document.title, ogTitle: document.querySelector('meta[property="og:title"]')?.content, twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content, description: document.querySelector('meta[name="description"]')?.content, canonical: document.querySelector('link[rel="canonical"]')?.href, ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      counts: { quote: document.querySelectorAll(".pcm-lead-panel,.pcm-top-estimate-wrap").length, form: document.querySelectorAll(".pcm-estimate-form,.pcm-top-estimate-wrap form").length, trustPills: quote?.querySelectorAll(".pcm-trust-row span,.pcm-pills .pcm-pill").length ?? 0, pricing: document.querySelectorAll(".pcm-step39-pricing").length, table: document.querySelectorAll(".pcm-step39-pricing table").length, rows: document.querySelectorAll(".pcm-step39-pricing tbody tr").length, glance: document.querySelectorAll(".pcm-step39-glance").length, faq: document.querySelectorAll(".pcm-step39-faq").length, faqHeading: [...document.querySelectorAll("h2")].filter((item) => /Frequently Asked Questions/i.test(clean(item.textContent))).length, faqSchema: schemas.length, footer: document.querySelectorAll("footer").length, localSeo: document.querySelectorAll(".pcm-local-seo").length, legacyPricing: (document.body.innerText.match(/Moving Cost Breakdown|Route Pricing/g) ?? []).length, launcher: document.querySelectorAll('button[aria-label="Open chat assistant"]').length },
      faqParity: schemas.length === 1 && JSON.stringify(faq) === JSON.stringify(schemas[0]),
      facts: { distance: relevantText.includes("~4,400 km"), transit: relevantText.includes("10–22 days"), range: relevantText.includes("$3,000–$16,000+"), prices: ["$3,000+", "$5,300+", "$7,000+", "$11,000+", "$16,000+"].every((value) => relevantText.includes(value)) },
      contamination: /Victoria–Vancouver|Vancouver to Victoria moves|Do you move from Vancouver to Victoria|1–3 for delivery|\$2,200|\$14,000|professional, professional/i.test(relevantText),
      staleTerminology: /\bfully insured\b|\bvaluation coverage\b|Online estimate bonus|Book before September/i.test(relevantText + " " + clean(quote?.innerText)),
      undefined: /\bundefined\b/i.test(document.body.innerText), homepage: /Your Move\. Our Family\. One Standard:/i.test(document.body.innerText), soft404: /Page Not Found/i.test(document.body.innerText),
    };
  });
}

async function responsive(page, viewport) {
  await page.setViewportSize(viewport); await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForSelector('html[data-pcm-step39-ready="1"]'); await page.waitForTimeout(300);
  return page.evaluate(() => { const css = (selector) => { const element = document.querySelector(selector), value = element && getComputedStyle(element); return value ? { display: value.display, columns: value.gridTemplateColumns, overflowX: value.overflowX, font: value.fontFamily } : null; }; const wrap = document.querySelector(".pcm-route-cost__table-wrap"), h1 = getComputedStyle(document.querySelector("h1")); return { viewport: [innerWidth, innerHeight], pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, h1: [h1.fontSize, h1.lineHeight, h1.fontWeight], bodyFont: getComputedStyle(document.body).fontFamily, quote: css(".pcm-lead-panel__inner"), form: css(".pcm-estimate-form"), glance: css(".pcm-step39-glance__grid"), pricing: css(".pcm-route-cost__table-wrap"), tableMinWidth: getComputedStyle(document.querySelector(".pcm-step39-pricing table")).minWidth, pricingInternalScroll: Boolean(wrap && wrap.scrollWidth > wrap.clientWidth), brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src) }; });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const open = page.locator('button[aria-label="Open menu"]'); result.menuTrigger = await open.count() === 1 && await open.isVisible(); result.expandedBefore = result.menuTrigger ? await open.getAttribute("aria-expanded") : null;
    if (result.menuTrigger) { await open.click(); result.expandedAfter = await open.getAttribute("aria-expanded"); const panel = page.locator('[role="dialog"],.pcm-static-mobile.is-open'); result.menuOpened = await panel.count() === 1 && await panel.isVisible(); await page.keyboard.press("Escape"); await page.waitForTimeout(500); result.menuClosed = await panel.count() === 0 || !(await panel.isVisible()); result.expandedClosed = await open.getAttribute("aria-expanded"); }
  } else {
    const services = page.getByRole("button", { name: "Services", exact: true }).first(); result.servicesTrigger = await services.count() === 1 && await services.isVisible(); if (result.servicesTrigger) { await services.click(); const local = page.locator('header a[href="/local/"]').first(); result.dropdownOpened = await local.count() > 0 && await local.isVisible(); await page.keyboard.press("Escape"); }
  }
  const launcher = page.locator('button[aria-label="Open chat assistant"]').first(); result.chatLauncher = await launcher.count() === 1 && await launcher.isVisible(); if (result.chatLauncher) { await launcher.click(); const close = page.locator('button[aria-label*="Close chat"],button[title*="Close chat"]').first(); result.chatOpened = await close.count() === 1 && await close.isVisible(); if (result.chatOpened) await close.click(); result.chatClosed = await close.count() === 0 || !(await close.isVisible()); }
  return result;
}

const results = [];
for (const [route, config] of Object.entries(torontoVictoriaRoutes)) {
  const html = await readFile(join(root, route.slice(1), "index.html"), "utf8"), messages = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); page.on("console", (message) => { if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}${message.location().url ? ` [${message.location().url}]` : ""}`); }); page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  await page.goto(new URL(route, baseUrl).href, { waitUntil: "domcontentloaded" }); const initial = await snapshot(page); await page.waitForSelector('html[data-pcm-step39-ready="1"]'); const hydrated = await snapshot(page); await page.waitForTimeout(1200); const oneSecond = await snapshot(page); await page.waitForTimeout(4200); const fiveSeconds = await snapshot(page);
  const desktop = await responsive(page, { width: 1280, height: 900 }), desktopInteractions = await interactions(page, false); const mobile = await responsive(page, { width: 390, height: 844 }), mobileInteractions = await interactions(page, true);
  results.push({ route, expected: { ...config, ...torontoVictoriaFacts }, raw: rawAudit(html, route), lifecycle: { initial, hydrated, oneSecond, fiveSeconds }, responsive: { desktop, mobile }, interactions: { desktop: desktopInteractions, mobile: mobileInteractions }, consoleMessages: [...new Set(messages)] }); await page.close();
}
await browser.close(); await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`); console.log(`Wrote ${output}`);
