import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE, headless: true });
const base = process.argv[2] ?? "http://127.0.0.1:4175";
const output = process.argv[3] ?? "STEP_66_CALGARY_MONTREAL_AUDIT.json";
const routes = [
  { path: "/calgary-to-montreal-movers/", from: "Calgary, AB", to: "Montreal, QC", rendering: "static" },
  { path: "/montreal-to-calgary-movers/", from: "Montreal, QC", to: "Calgary, AB", rendering: "react-spa" },
];

function pageSnapshot() {
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
    question: clean(entry?.name),
    answer: clean(entry?.acceptedAnswer?.text),
  })));
  const headings = [...document.querySelectorAll("h1,h2,h3,h4")];
  const glanceHeadings = headings.filter((node) => /Route at a Glance/i.test(clean(node.textContent)));
  const text = clean(document.body.innerText);
  const pricing = document.querySelector(".pcm-route-cost");
  const table = pricing?.querySelector("table");
  const h1 = document.querySelector("h1");
  const from = document.querySelector('[name="from"]');
  const to = document.querySelector('[name="to"]');
  const form = from?.closest("form");
  const canonical = document.querySelector('link[rel="canonical"]');
  const styles = (node) => node ? { family: getComputedStyle(node).fontFamily, size: getComputedStyle(node).fontSize, lineHeight: getComputedStyle(node).lineHeight, weight: getComputedStyle(node).fontWeight } : null;
  return {
    metadata: {
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content,
      ogDescription: document.querySelector('meta[property="og:description"]')?.content,
      twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content,
      canonical: canonical?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
    },
    form: { from: from?.value, fromAttribute: from?.getAttribute("value"), to: to?.value, toAttribute: to?.getAttribute("value"), primaryForms: form ? 1 : 0 },
    counts: {
      h1: document.querySelectorAll("h1").length,
      quote: document.querySelectorAll(".pcm-lead-panel,.pcm-top-estimate-wrap").length,
      pricing: document.querySelectorAll(".pcm-route-cost").length,
      pricingTables: document.querySelectorAll(".pcm-route-cost table").length,
      glanceHeadings: glanceHeadings.length,
      glanceStructures: glanceHeadings.length,
      hiddenGlances: glanceHeadings.filter((node) => !node.getClientRects().length || getComputedStyle(node).display === "none" || getComputedStyle(node).visibility === "hidden").length,
      faqSections: faqSections.length,
      faqHeadings: faqHeadings.length,
      faqPage: faqNodes.length,
      localSeo: document.querySelectorAll(".pcm-local-seo").length,
      moduleScripts: document.querySelectorAll('script[type="module"]').length,
      chatbotLaunchers: document.querySelectorAll('button[aria-label="Open chat assistant"]').length,
    },
    pricing: {
      rows: table ? [...table.querySelectorAll("tbody tr")].map((row) => [...row.cells].map((cell) => clean(cell.textContent))) : [],
      heading: clean(pricing?.querySelector("h2")?.textContent),
      legacy: /Moving Cost Breakdown/i.test(text),
      staleCards: document.querySelectorAll(".pcm-price-card,.pcm-cost-card,[class*='price-card'],[class*='cost-card']").length,
    },
    faqParity: schemaFaq.length === 1 && JSON.stringify(visibleFaq) === JSON.stringify(schemaFaq[0]),
    faqQuestions: visibleFaq.map((item) => item.question),
    facts: {
      distance: text.includes("3,600 km"), transit: text.includes("7–19 days"), overall: text.includes("$2,500–$15,000+"),
      studio: text.includes("$2,500+"), oneBedroom: text.includes("$4,700+"), twoBedroom: text.includes("$6,300+"), threeBedroom: text.includes("$10,000+"), fourBedroom: text.includes("$15,000+"),
    },
    typography: { h1: styles(h1), body: styles(document.body), form: styles(from), button: styles(document.querySelector("button")) },
    architecture: { root: Boolean(document.querySelector("#root")), module: Boolean(document.querySelector('script[type="module"]')) },
    contamination: {
      undefined: /\bundefined\b/i.test(text), localSeo: text.includes(".pcm-local-seo"), expiredPromo: /offer expires|limited[- ]time (?:offer|promotion)|save \d+% (?:today|now)/i.test(text),
      legacyCost: /Moving Cost Breakdown/i.test(text), staleCoverage: /valuation coverage|fully insured/i.test(text), guaranteedPricing: /guaranteed (?:price|pricing)|price guarantee/i.test(text),
    },
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
    result.openPanel = await page.locator('.pcm-static-mobile.is-open,[role="dialog"][data-state="open"]').count() > 0;
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
    result.ariaClosed = await menu.getAttribute("aria-expanded");
    result.closedPanel = await page.locator('.pcm-static-mobile.is-open,[role="dialog"][data-state="open"]').count() === 0;
  }
  const launcher = page.locator('button[aria-label="Open chat assistant"]');
  result.chatLauncher = await launcher.count() === 1 && await launcher.isVisible();
  if (result.chatLauncher) {
    await launcher.click();
    await page.waitForTimeout(200);
    const close = page.locator('button[aria-label*="Close chat"],.pcm-step36-chat-close');
    result.chatOpened = await close.count() > 0 && await close.first().isVisible();
    if (result.chatOpened) await close.first().click();
  }
  return result;
}

const results = [];
for (const route of routes) {
  const rawContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const rawPage = await rawContext.newPage();
  await rawPage.goto(new URL(route.path, base).href, { waitUntil: "domcontentloaded" });
  const raw = await rawPage.evaluate(pageSnapshot);
  await rawContext.close();

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto(new URL(route.path, base).href, { waitUntil: "domcontentloaded" });
  const initial = await page.evaluate(pageSnapshot);
  await page.waitForTimeout(1500);
  const delayed = await page.evaluate(pageSnapshot);
  await page.waitForTimeout(4000);
  const settled = await page.evaluate(pageSnapshot);
  const desktop = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, viewport: [innerWidth, innerHeight] }));
  const desktopInteractions = await interactions(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5500);
  const mobile = await page.evaluate(() => {
    const wrap = document.querySelector(".pcm-route-cost__table-wrap");
    return { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, viewport: [innerWidth, innerHeight], pricingInternalScroll: Boolean(wrap && wrap.scrollWidth > wrap.clientWidth) };
  });
  const mobileSnapshot = await page.evaluate(pageSnapshot);
  const mobileInteractions = await interactions(page);
  results.push({ route, raw, initial, delayed, settled, mobileSnapshot, desktop, mobile, interactions: { desktop: desktopInteractions, mobile: mobileInteractions }, pageErrors: [...new Set(pageErrors)], consoleErrors: [...new Set(consoleErrors)] });
  await page.close();
}
await browser.close();
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`, "utf8");
console.log(`Wrote ${output}`);
