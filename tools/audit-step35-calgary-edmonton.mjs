import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = process.argv[4] ? resolve(process.argv[4]) : null;
const screenshotRoot = process.env.PCM_STEP35_SCREENSHOT_DIR ? resolve(process.env.PCM_STEP35_SCREENSHOT_DIR) : null;
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required.");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const configs = [
  { route: "/calgary-to-edmonton-movers/", from: "Calgary, AB", to: "Edmonton, AB" },
  { route: "/edmonton-to-calgary-movers/", from: "Edmonton, AB", to: "Calgary, AB" },
];

const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

function collectFaq(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => collectFaq(item, nodes));
  else Object.values(value).forEach((item) => collectFaq(item, nodes));
  return nodes;
}

async function snapshot(page) {
  return page.evaluate(() => {
    const cleanText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const faq = document.querySelector(".pcm-step35-faq");
    const visibleFaq = [...(faq?.querySelectorAll(".pcm-step35-faq-card") ?? [])].map((card) => ({ question: cleanText(card.querySelector("h3")?.textContent), answer: cleanText(card.querySelector("p")?.textContent) }));
    const faqSchemas = [];
    const collect = (value) => { if (!value || typeof value !== "object") return; if (value["@type"] === "FAQPage") faqSchemas.push(value); if (Array.isArray(value)) value.forEach(collect); else Object.values(value).forEach(collect); };
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => { try { collect(JSON.parse(script.textContent)); } catch {} });
    const schemaFaq = faqSchemas.map((node) => (node.mainEntity ?? []).map((item) => ({ question: cleanText(item?.name), answer: cleanText(item?.acceptedAnswer?.text) })));
    const quote = document.querySelector(".pcm-lead-panel");
    const pricing = document.querySelector("[data-pcm-step35-pricing]");
    const bodyText = cleanText(document.body.innerText);
    return {
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      h1: [...document.querySelectorAll("h1")].map((node) => cleanText(node.textContent)),
      form: { from: quote?.querySelector('[name="from"]')?.value, to: quote?.querySelector('[name="to"]')?.value },
      counts: {
        quote: document.querySelectorAll(".pcm-lead-panel").length,
        form: document.querySelectorAll(".pcm-lead-panel form").length,
        trustPills: quote?.querySelectorAll(".pcm-trust-row span").length ?? 0,
        pricing: document.querySelectorAll("[data-pcm-step35-pricing]").length,
        pricingTable: pricing?.querySelectorAll("table").length ?? 0,
        pricingRows: pricing?.querySelectorAll("tbody tr").length ?? 0,
        glance: document.querySelectorAll(".pcm-step35-glance").length,
        faqSection: document.querySelectorAll(".pcm-step35-faq").length,
        faqHeading: [...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(cleanText(node.textContent))).length,
        faqSchema: faqSchemas.length,
        localSeo: document.querySelectorAll(".pcm-local-seo").length,
        footer: document.querySelectorAll("footer").length,
        chatLauncher: document.querySelectorAll('button[aria-label="Open chat assistant"]').length,
        chatPanel: document.querySelectorAll(".pcm-static-chat-panel").length,
      },
      faqParity: schemaFaq.length === 1 && JSON.stringify(visibleFaq) === JSON.stringify(schemaFaq[0]),
      facts: { distance: bodyText.includes("~300 km") && bodyText.includes("approximately 300 km"), transit: bodyText.includes("2–4 days"), range: bodyText.includes("$800–$2,800+"), prices: ["$800+", "$1,100+", "$1,500+", "$2,000+", "$2,800+"].every((value) => bodyText.includes(value)) },
      contaminated: /4[,.]?[89]00 km|7\s*[–-]\s*19 days|8\s*[–-]\s*20 days|\$2,600|\$3,900|\$6,500|\$11,000|\$16,000|OHIP|13% HST|King West|Distillery District|Scarborough|Etobicoke|North York/i.test(bodyText),
      datedPromotion: /Online estimate bonus|Book before September 30/i.test(bodyText),
      undefinedCount: (bodyText.match(/undefined/gi) ?? []).length,
      homepage: /Your Move\. Our Family\. One Standard:/i.test(bodyText),
      soft404: /Page Not Found|\b404\b/i.test(bodyText),
      reactBootstrap: Boolean(document.querySelector('script[type="module"]')),
    };
  });
}

async function responsive(page, viewport) {
  await page.setViewportSize(viewport);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  return page.evaluate(() => {
    const style = (selector) => { const node = document.querySelector(selector); if (!node) return null; const css = getComputedStyle(node); return { fontFamily: css.fontFamily, fontSize: css.fontSize, lineHeight: css.lineHeight, fontWeight: css.fontWeight, gridTemplateColumns: css.gridTemplateColumns, overflowX: css.overflowX }; };
    const wrap = document.querySelector(".pcm-pricing-summary__table-wrap");
    const launcher = document.querySelector(".pcm-step35-chat-launcher");
    const sticky = document.querySelector(".pcm-sticky-cta");
    const overlaps = (a, b) => { if (!a || !b) return false; const x = a.getBoundingClientRect(), y = b.getBoundingClientRect(); return x.left < y.right && x.right > y.left && x.top < y.bottom && x.bottom > y.top; };
    return {
      viewport: [innerWidth, innerHeight],
      documentWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      h1: style(".pcm-step35 h1"), body: style(".pcm-step35-content p"), quote: style(".pcm-lead-panel__inner"), glance: style(".pcm-step35-glance__grid"), tableWrap: style(".pcm-pricing-summary__table-wrap"),
      tableMinWidth: getComputedStyle(document.querySelector(".pcm-pricing-summary table")).minWidth,
      pricingInternalScroll: Boolean(wrap && wrap.scrollWidth > wrap.clientWidth),
      chatStickyOverlap: overlaps(launcher, sticky),
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
    };
  });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const trigger = page.locator('button[aria-label="Open menu"]');
    result.menuTrigger = await trigger.count() === 1 && await trigger.isVisible();
    result.ariaBefore = result.menuTrigger ? await trigger.getAttribute("aria-expanded") : null;
    if (result.menuTrigger) {
      await trigger.click(); await page.waitForTimeout(200); result.ariaOpen = await trigger.getAttribute("aria-expanded");
      await page.keyboard.press("Escape"); await page.waitForTimeout(200); result.ariaClosed = await trigger.getAttribute("aria-expanded");
    }
  } else {
    const trigger = page.getByRole("button", { name: "Services", exact: true });
    result.dropdownTrigger = await trigger.count() === 1 && await trigger.isVisible();
    if (result.dropdownTrigger) { await trigger.click(); await page.waitForTimeout(200); result.dropdownOpened = await page.locator(".pcm-static-dropdown:not([hidden])").count() === 1; await page.keyboard.press("Escape"); }
  }
  const chat = page.locator('button[aria-label="Open chat assistant"]');
  result.chatLauncher = await chat.count() === 1 && await chat.isVisible();
  if (result.chatLauncher) { await chat.click(); await page.waitForTimeout(200); const close = page.locator("button.pcm-static-chat-close"); result.chatOpened = await close.count() === 1 && await close.isVisible(); if (result.chatOpened) await close.click(); }
  return result;
}

const results = [];
for (const config of configs) {
  const html = await readFile(join(root, config.route.slice(1), "index.html"), "utf8");
  const ownership = routeOwnershipByUrl.get(config.route);
  const rawFaq = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => { try { return collectFaq(JSON.parse(match[1])); } catch { return []; } });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleMessages = [];
  const requestFailures = [];
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
  page.on("pageerror", (error) => consoleMessages.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => requestFailures.push(`${request.url()} :: ${request.failure()?.errorText ?? "failed"}`));
  await page.goto(new URL(config.route, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1200);
  const settled = await snapshot(page);
  const desktop = await responsive(page, { width: 1280, height: 900 });
  if (screenshotRoot) { await mkdir(screenshotRoot, { recursive: true }); await page.screenshot({ path: join(screenshotRoot, `${config.route.slice(1, -1)}-desktop.png`), fullPage: true }); }
  const desktopInteractions = await interactions(page, false);
  const mobile = await responsive(page, { width: 390, height: 844 });
  if (screenshotRoot) await page.screenshot({ path: join(screenshotRoot, `${config.route.slice(1, -1)}-mobile.png`), fullPage: true });
  const mobileInteractions = await interactions(page, true);
  results.push({ route: config.route, expected: config, ownership, raw: { faqSchema: rawFaq.length, reactBootstrap: /<script\b[^>]*type=["']module["']/i.test(html), localSeo: (html.match(/pcm-local-seo/g) ?? []).length }, settled, desktop, mobile, interactions: { desktop: desktopInteractions, mobile: mobileInteractions }, consoleMessages: [...new Set(consoleMessages)], requestFailures: [...new Set(requestFailures)] });
  await page.close();
}
await browser.close();
const report = { generatedAt: new Date().toISOString(), results };
if (output) await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
else console.log(JSON.stringify(report, null, 2));
