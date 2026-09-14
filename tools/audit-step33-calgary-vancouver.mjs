import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = process.argv[4] ? resolve(process.argv[4]) : null;
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required.");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const bundle = await readFile(join(root, "assets", "index-CNBNs70h.js"), "utf8");

const configs = [
  { route: "/calgary-to-vancouver-movers/", h1: "Calgary to Vancouver Movers", from: "Calgary, AB", to: "Vancouver, BC", range: "$1,800–$13,000+" },
  { route: "/vancouver-to-calgary-movers/", h1: "Vancouver to Calgary Movers", from: "Vancouver, BC", to: "Calgary, AB", range: "$1,800–$14,000+" },
];

function faqNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => faqNodes(item, nodes));
  else Object.values(value).forEach((item) => faqNodes(item, nodes));
  return nodes;
}

function rawMetrics(html, config) {
  const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const bodyText = text.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  return {
    owner: routeOwnershipByUrl.get(config.route)?.owner,
    rendering: routeOwnershipByUrl.get(config.route)?.rendering,
    reactBootstrapCount: (html.match(/index-CNBNs70h\.js/g) ?? []).length,
    exactCompiledRoute: bundle.includes(config.route),
    h1: [...text.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()),
    routeSentinel: bodyText.includes(config.h1),
    title: html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim(),
    ogTitle: html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1],
    twitterTitle: html.match(/<meta name="twitter:title" content="([^"]*)"/i)?.[1],
    description: html.match(/<meta name="description" content="([^"]*)"/i)?.[1],
    canonical: html.match(/<link rel="canonical"[^>]*href="([^"]*)"/i)?.[1],
    ogUrl: html.match(/<meta property="og:url" content="([^"]*)"/i)?.[1],
    localSeoCount: (text.match(/pcm-local-seo/g) ?? []).length,
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const visibleFaq = [...document.querySelectorAll(".pcm-route-faq-static details")].map((details) => ({
      question: clean(details.querySelector("summary")?.textContent),
      answer: clean(details.querySelector("p")?.textContent),
    }));
    const faqSchemas = [];
    const collectFaqNodes = (value) => {
      if (!value || typeof value !== "object") return;
      if (value["@type"] === "FAQPage") faqSchemas.push(value);
      if (Array.isArray(value)) value.forEach(collectFaqNodes);
      else Object.values(value).forEach(collectFaqNodes);
    };
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try {
        collectFaqNodes(JSON.parse(script.textContent));
      } catch {}
    });
    const schemaFaq = faqSchemas.map((node) => (node.mainEntity ?? []).map((entry) => ({
      question: clean(entry?.name), answer: clean(entry?.acceptedAnswer?.text),
    })));
    const quote = document.querySelector(".pcm-lead-panel");
    const pricing = document.querySelector(".pcm-route-cost");
    const glance = document.querySelector(".pcm-step33-glance");
    const from = quote?.querySelector('[name="from"]');
    const to = quote?.querySelector('[name="to"]');
    return {
      ready: document.documentElement.getAttribute("data-pcm-step33-ready"),
      h1: [...document.querySelectorAll("h1")].map((element) => clean(element.textContent)),
      routeSentinel: document.body.innerText.includes(clean(document.querySelector("h1")?.textContent)),
      form: { from: from?.value ?? null, to: to?.value ?? null },
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      componentOrder: [...document.querySelectorAll("#root > *")].map((element) => clean(element.querySelector("h1,h2")?.textContent || element.className)),
      mainOrder: [...(document.querySelector("main")?.children ?? [])].map((element) => clean(element.querySelector("h1,h2,h3")?.textContent || element.className)),
      counts: {
        h1: document.querySelectorAll("h1").length,
        quotePanel: document.querySelectorAll(".pcm-lead-panel").length,
        primaryForm: document.querySelectorAll(".pcm-estimate-form").length,
        pricing: document.querySelectorAll(".pcm-route-cost").length,
        pricingTable: document.querySelectorAll(".pcm-route-cost table").length,
        pricingRows: document.querySelectorAll(".pcm-route-cost tbody tr").length,
        glance: document.querySelectorAll(".pcm-step33-glance").length,
        faqSection: document.querySelectorAll(".pcm-route-faq-static").length,
        faqHeading: [...document.querySelectorAll("h2")].filter((heading) => /Frequently Asked Questions/i.test(clean(heading.textContent))).length,
        faqSchema: faqSchemas.length,
        related: [...document.querySelectorAll("h2")].filter((heading) => clean(heading.textContent) === "Related Destinations").length,
        closingCta: [...document.querySelectorAll("h2")].filter((heading) => /^Ready to Move from /.test(clean(heading.textContent))).length,
        footer: document.querySelectorAll("footer").length,
        localSeo: document.querySelectorAll(".pcm-local-seo").length,
        chatLauncher: [...document.querySelectorAll("button")].filter((button) => button.getAttribute("aria-label") === "Open chat assistant").length,
      },
      pricingHeading: clean(pricing?.querySelector("h2")?.textContent),
      pricingText: clean(pricing?.textContent),
      glanceText: clean(glance?.textContent),
      faqParity: schemaFaq.length === 1 && JSON.stringify(visibleFaq) === JSON.stringify(schemaFaq[0]),
      undefinedCount: (document.body.innerText.match(/undefined/g) ?? []).length,
      homepageReplacement: /Your Move\. Our Family\. One Standard:/i.test(document.body.innerText),
      soft404: /Page Not Found|>\s*404\s*</i.test(document.body.innerHTML),
    };
  });
}

async function responsive(page, viewport) {
  await page.setViewportSize(viewport);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(8500);
  return page.evaluate(() => {
    const style = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const computed = getComputedStyle(element);
      return { display: computed.display, fontFamily: computed.fontFamily, fontSize: computed.fontSize, lineHeight: computed.lineHeight, fontWeight: computed.fontWeight, gridTemplateColumns: computed.gridTemplateColumns, overflowX: computed.overflowX };
    };
    const brokenImages = [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src);
    const tableWrap = document.querySelector(".pcm-route-cost__table-wrap");
    return {
      viewport: [innerWidth, innerHeight],
      documentWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      h1: style("h1"),
      quote: style(".pcm-lead-panel__inner"),
      form: style(".pcm-estimate-form"),
      glance: style(".pcm-step33-glance__grid"),
      pricingWrap: style(".pcm-route-cost__table-wrap"),
      pricingInternalScroll: Boolean(tableWrap && tableWrap.scrollWidth > tableWrap.clientWidth),
      tableMinWidth: document.querySelector(".pcm-route-cost table") ? getComputedStyle(document.querySelector(".pcm-route-cost table")).minWidth : null,
      mainWidth: document.querySelector(".pcm-step33-main > .container")?.getBoundingClientRect().width,
      quoteWidth: document.querySelector(".pcm-lead-panel")?.getBoundingClientRect().width,
      brokenImages,
    };
  });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const open = page.locator('button[aria-label="Open menu"]');
    result.mobileTrigger = await open.count() === 1 && await open.isVisible();
    if (result.mobileTrigger) {
      await open.click();
      const dialog = page.locator('[role="dialog"][data-state="open"]');
      result.mobileOpened = await dialog.count() === 1 && await dialog.isVisible();
      if (result.mobileOpened) await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      result.mobileClosed = await dialog.count() === 0 || !(await dialog.isVisible());
    }
  } else {
    const services = page.getByRole("button", { name: "Services", exact: true });
    result.desktopServicesTrigger = await services.count() === 1 && await services.isVisible();
    if (result.desktopServicesTrigger) {
      await services.click();
      const dropdownLinks = services.locator("xpath=following-sibling::*[1]//a");
      result.desktopDropdownOpened = await dropdownLinks.count() > 0 && await dropdownLinks.first().isVisible();
      await page.mouse.click(8, 500);
      await page.waitForTimeout(300);
      result.desktopDropdownClosed = await dropdownLinks.count() === 0 || !(await dropdownLinks.first().isVisible());
    }
  }
  const launcher = page.locator('button[aria-label="Open chat assistant"]');
  result.chatLauncher = await launcher.count() === 1 && await launcher.isVisible();
  if (result.chatLauncher) {
    await launcher.click({ timeout: 5000 });
    const closeChat = page.locator('button[aria-label*="Close chat"], button[title*="Close chat"]');
    result.chatOpened = await closeChat.count() === 1 && await closeChat.isVisible();
    if (result.chatOpened) await closeChat.click();
    else await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    result.chatClosed = await closeChat.count() === 0 || !(await closeChat.isVisible());
  }
  return result;
}

const results = [];
for (const config of configs) {
  const html = await readFile(join(root, config.route.slice(1), "index.html"), "utf8");
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(new URL(config.route, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  const direct = await snapshot(page);
  await page.waitForTimeout(1000);
  const hydrated = await snapshot(page);
  await page.waitForTimeout(3500);
  const retries = await snapshot(page);
  await page.waitForTimeout(4500);
  const settled = await snapshot(page);
  const desktop = await responsive(page, { width: 1280, height: 900 });
  const desktopInteractions = await interactions(page, false);
  const mobile = await responsive(page, { width: 390, height: 844 });
  const mobileInteractions = await interactions(page, true);
  results.push({
    route: config.route,
    expected: config,
    raw: rawMetrics(html, config),
    lifecycle: { direct, hydrated, retries, settled },
    desktop,
    mobile,
    interactions: { desktop: desktopInteractions, mobile: mobileInteractions },
    consoleErrors: [...new Set(consoleErrors)],
  });
  await page.close();
}

await browser.close();
const report = { generatedAt: new Date().toISOString(), results };
if (output) {
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Wrote ${output}`);
} else {
  console.log(JSON.stringify(report, null, 2));
}
