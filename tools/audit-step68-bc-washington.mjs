import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE, headless: true });
const base = process.argv[2] ?? "http://127.0.0.1:4175";
const output = process.argv[3] ?? "STEP_68_BC_WASHINGTON_AUDIT.json";
const route = "/bc-to-washington-movers/";

function snapshot() {
  const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const faqNodes = [];
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      (function walk(value) {
        if (!value || typeof value !== "object") return;
        if (value["@type"] === "FAQPage") faqNodes.push(value);
        if (Array.isArray(value)) value.forEach(walk);
        else Object.values(value).forEach(walk);
      }(JSON.parse(script.textContent)));
    } catch {}
  });
  const faqHeadings = [...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(clean(node.textContent)));
  const faqSections = [...new Set(faqHeadings.map((node) => node.closest("section")).filter(Boolean))];
  const visibleFaq = faqSections.length === 1 ? [...faqSections[0].querySelectorAll("h3,summary")].map((question) => ({
    question: clean(question.textContent),
    answer: clean(question.parentElement?.querySelector("p")?.textContent),
  })) : [];
  const schemaFaq = faqNodes.map((node) => (node.mainEntity ?? []).map((entry) => ({
    question: clean(entry?.name), answer: clean(entry?.acceptedAnswer?.text),
  })));
  const headings = [...document.querySelectorAll("h1,h2,h3")];
  const pricingHeading = headings.find((node) => /^BC to Washington State Moving Costs$/i.test(clean(node.textContent)));
  const pricingSection = pricingHeading?.closest("section");
  const table = pricingSection?.querySelector("table");
  const glanceHeadings = headings.filter((node) => /Route at a Glance/i.test(clean(node.textContent)));
  const h1 = document.querySelector("h1");
  const from = document.querySelector('[name="from"]');
  const to = document.querySelector('[name="to"]');
  const text = clean(document.body.innerText);
  const style = (node) => node ? {
    family: getComputedStyle(node).fontFamily,
    size: getComputedStyle(node).fontSize,
    lineHeight: getComputedStyle(node).lineHeight,
    weight: getComputedStyle(node).fontWeight,
  } : null;
  return {
    metadata: {
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
    },
    form: { from: from?.value ?? null, to: to?.value ?? null },
    counts: {
      h1: document.querySelectorAll("h1").length,
      quote: document.querySelectorAll(".pcm-lead-panel,.pcm-top-estimate-wrap").length,
      primaryForm: from?.closest("form") ? 1 : 0,
      pricingSections: pricingSection ? 1 : 0,
      pricingTables: table ? 1 : 0,
      pricingRows: table?.querySelectorAll("tbody tr").length ?? 0,
      glanceHeadings: glanceHeadings.length,
      faqSections: faqSections.length,
      faqHeadings: faqHeadings.length,
      faqPage: faqNodes.length,
      relatedDestinations: headings.filter((node) => /Related Destinations/i.test(clean(node.textContent))).length,
      closingCta: headings.filter((node) => /Ready to Move to Washington State/i.test(clean(node.textContent))).length,
      footer: document.querySelectorAll("footer").length,
      localSeo: document.querySelectorAll(".pcm-local-seo").length,
      nav: document.querySelectorAll("header nav,nav").length,
      chat: document.querySelectorAll('button[aria-label="Open chat assistant"]').length,
    },
    pricing: {
      heading: clean(pricingHeading?.textContent),
      rows: table ? [...table.querySelectorAll("tbody tr")].map((row) => [...row.cells].map((cell) => clean(cell.textContent))) : [],
    },
    faqParity: schemaFaq.length === 1 && JSON.stringify(visibleFaq) === JSON.stringify(schemaFaq[0]),
    typography: { h1: style(h1), body: style(document.body), form: style(from), button: style(document.querySelector("button")) },
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    soft404: /Page Not Found/i.test(text),
    homepageReplacement: /Your Move\. Our Family\. One Standard:/i.test(text),
    legacyPricing: /Moving Cost Breakdown/i.test(text),
    undefinedVisible: /\bundefined\b/i.test(text),
    reverseRouteLinked: Boolean(document.querySelector('a[href="/washington-to-bc-movers/"]')),
  };
}

async function interactions(page) {
  const result = {};
  const menu = page.locator('button[aria-label="Open menu"]');
  result.menuPresent = await menu.count() === 1 && await menu.isVisible();
  if (result.menuPresent) {
    result.ariaBefore = await menu.getAttribute("aria-expanded");
    await menu.click();
    await page.waitForTimeout(150);
    result.ariaOpen = await menu.getAttribute("aria-expanded");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
    result.ariaClosed = await menu.getAttribute("aria-expanded");
  }
  const chat = page.locator('button[aria-label="Open chat assistant"]');
  result.chatPresent = await chat.count() === 1 && await chat.isVisible();
  if (result.chatPresent) {
    await chat.click();
    await page.waitForTimeout(150);
    const close = page.locator('button[aria-label*="Close chat"]');
    result.chatOpened = await close.count() === 1 && await close.isVisible();
    if (result.chatOpened) await close.click();
  }
  return result;
}

const rawContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
const rawPage = await rawContext.newPage();
await rawPage.goto(new URL(route, base).href, { waitUntil: "domcontentloaded" });
const raw = await rawPage.evaluate(snapshot);
await rawContext.close();

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
await page.goto(new URL(route, base).href, { waitUntil: "domcontentloaded" });
const initial = await page.evaluate(snapshot);
await page.waitForTimeout(1500);
const delayed = await page.evaluate(snapshot);
await page.waitForTimeout(4000);
const settled = await page.evaluate(snapshot);
const desktopInteractions = await interactions(page);
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(5500);
const mobile = await page.evaluate(snapshot);
const mobileInteractions = await interactions(page);
await browser.close();

const report = {
  generatedAt: new Date().toISOString(), route, viewports: { desktop: [1280, 900], mobile: [390, 844] },
  raw, initial, delayed, settled, mobile,
  interactions: { desktop: desktopInteractions, mobile: mobileInteractions },
  pageErrors: [...new Set(pageErrors)], consoleErrors: [...new Set(consoleErrors)],
};
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Wrote ${output}`);
