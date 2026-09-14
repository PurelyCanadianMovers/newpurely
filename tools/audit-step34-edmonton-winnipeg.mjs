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

const configs = [
  { route: "/edmonton-to-winnipeg-movers/", h1: "Edmonton to Winnipeg Movers", from: "Edmonton, AB", to: "Winnipeg, MB", range: "$2,300–$12,000+" },
  { route: "/winnipeg-to-edmonton-movers/", h1: "Winnipeg to Edmonton Movers", from: "Winnipeg, MB", to: "Edmonton, AB", range: "$2,300–$12,000+" },
];

function faqNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => faqNodes(item, nodes));
  else Object.values(value).forEach((item) => faqNodes(item, nodes));
  return nodes;
}

function rawMetrics(html, config) {
  const ownership = routeOwnershipByUrl.get(config.route);
  const json = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => { try { return faqNodes(JSON.parse(match[1])); } catch { return []; } });
  const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/&amp;/g, "&").trim();
  return {
    owner: ownership?.owner, postProcessors: ownership?.postProcessors, rendering: ownership?.rendering,
    runtimeEnhancers: ownership?.runtimeEnhancers, runtimeStyles: ownership?.runtimeStyles,
    reactBootstrap: /index-CNBNs70h\.js/.test(html),
    title, ogTitle: html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1].replace(/&amp;/g, "&"),
    twitterTitle: html.match(/<meta name="twitter:title" content="([^"]*)"/i)?.[1].replace(/&amp;/g, "&"),
    description: html.match(/<meta name="description" content="([^"]*)"/i)?.[1],
    canonical: html.match(/<link rel="canonical"[^>]*href="([^"]*)"/i)?.[1],
    ogUrl: html.match(/<meta property="og:url" content="([^"]*)"/i)?.[1],
    h1: [...text.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => match[1].replace(/<[^>]+>/g, "").trim()),
    faqSchema: json.length, localSeo: (text.match(/pcm-local-seo/g) ?? []).length,
    footer: (text.match(/<footer\b/gi) ?? []).length,
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const byHeading = (pattern) => [...document.querySelectorAll("main section")].find((section) => pattern.test(clean(section.querySelector("h2")?.textContent)));
    const faqSection = document.querySelector(".pcm-route-faq-static") || byHeading(/^Frequently Asked Questions$/i);
    const visibleFaq = [...(faqSection?.querySelectorAll("h3") ?? [])].map((heading) => ({
      question: clean(heading.textContent), answer: clean(heading.nextElementSibling?.textContent),
    }));
    const faqSchemas = [];
    const collect = (value) => {
      if (!value || typeof value !== "object") return;
      if (value["@type"] === "FAQPage") faqSchemas.push(value);
      if (Array.isArray(value)) value.forEach(collect); else Object.values(value).forEach(collect);
    };
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => { try { collect(JSON.parse(script.textContent)); } catch {} });
    const schemaFaq = faqSchemas.map((node) => (node.mainEntity ?? []).map((item) => ({ question: clean(item?.name), answer: clean(item?.acceptedAnswer?.text) })));
    const quote = document.querySelector(".pcm-lead-panel");
    const pricing = document.querySelector(".pcm-route-cost") || byHeading(/^How much does it cost to move from/i);
    const glance = document.querySelector(".pcm-step34-glance") || byHeading(/Route at a Glance$/i);
    return {
      ready: document.documentElement.getAttribute("data-pcm-step34-ready"),
      title: document.title, ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      h1: [...document.querySelectorAll("h1")].map((element) => clean(element.textContent)),
      form: { from: quote?.querySelector('[name="from"]')?.value, to: quote?.querySelector('[name="to"]')?.value },
      counts: {
        quote: document.querySelectorAll(".pcm-lead-panel").length, trustPills: quote?.querySelectorAll(".pcm-trust-row span").length,
        pricing: pricing ? 1 : 0, pricingTable: pricing?.querySelectorAll("table").length ?? 0,
        pricingRows: pricing?.querySelectorAll("tbody tr").length ?? 0, glance: glance ? 1 : 0,
        faqSection: faqSection ? 1 : 0,
        faqHeading: [...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(clean(node.textContent))).length,
        faqSchema: faqSchemas.length, localSeo: document.querySelectorAll(".pcm-local-seo").length,
        footer: document.querySelectorAll("footer").length,
        chatLauncher: [...document.querySelectorAll("button")].filter((button) => /open chat assistant/i.test(button.getAttribute("aria-label") ?? "")).length,
      },
      componentOrder: [...document.body.children].map((node) => clean(node.querySelector?.("h1,h2")?.textContent || node.className || node.tagName)),
      mainOrder: [...(document.querySelector("main")?.children ?? [])].map((node) => clean(node.querySelector("h1,h2,h3")?.textContent || node.className)),
      pricingHeading: clean(pricing?.querySelector("h2")?.textContent), pricingText: clean(pricing?.textContent), glanceText: clean(glance?.textContent),
      faqParity: schemaFaq.length === 1 && JSON.stringify(visibleFaq) === JSON.stringify(schemaFaq[0]),
      undefinedCount: (document.body.innerText.match(/undefined/g) ?? []).length,
      homepage: /Your Move\. Our Family\. One Standard:/i.test(document.body.innerText),
      soft404: /Page Not Found|>\s*404\s*</i.test(document.body.innerHTML),
    };
  });
}

async function responsive(page, viewport) {
  await page.setViewportSize(viewport);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  return page.evaluate(() => {
    const css = (selector) => { const node = document.querySelector(selector); if (!node) return null; const s = getComputedStyle(node); return { fontFamily:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,fontWeight:s.fontWeight,gridTemplateColumns:s.gridTemplateColumns,overflowX:s.overflowX }; };
    const wrap = document.querySelector(".pcm-route-cost__table-wrap");
    return { viewport:[innerWidth,innerHeight], documentWidth:document.documentElement.scrollWidth, overflow:document.documentElement.scrollWidth > document.documentElement.clientWidth,
      h1:css("h1"), quote:css(".pcm-lead-panel__inner"), glance:css(".pcm-step34-glance__grid"), tableWrap:css(".pcm-route-cost__table-wrap"),
      tableMinWidth:document.querySelector(".pcm-route-cost table") ? getComputedStyle(document.querySelector(".pcm-route-cost table")).minWidth : null,
      pricingInternalScroll:Boolean(wrap && wrap.scrollWidth > wrap.clientWidth), brokenImages:[...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src) };
  });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const open = page.locator('button[aria-label="Open menu"]');
    result.menuTrigger = await open.count() === 1 && await open.isVisible();
    result.ariaBefore = result.menuTrigger ? await open.getAttribute("aria-expanded") : null;
    if (result.menuTrigger) { await open.click(); await page.waitForTimeout(200); result.ariaOpen = await open.getAttribute("aria-expanded"); await page.keyboard.press("Escape"); await page.waitForTimeout(200); result.ariaClosed = await open.getAttribute("aria-expanded"); result.menuClosed = !(await page.locator(".pcm-static-mobile").evaluate((node) => node.classList.contains("is-open"))); if (!result.menuClosed) { await page.locator('button[aria-label="Close menu"]').click(); await page.waitForTimeout(200); } }
  } else {
    const trigger = page.getByRole("button", { name:"Services", exact:true });
    result.dropdownTrigger = await trigger.count() === 1 && await trigger.isVisible();
    if (result.dropdownTrigger) { await trigger.click(); const links = trigger.locator("xpath=following-sibling::*[1]//a"); result.dropdownOpened = await links.count() > 0 && await links.first().isVisible(); await page.mouse.click(5,500); }
  }
  const chat = page.locator('button[aria-label="Open chat assistant"]');
  result.chatLauncher = await chat.count() === 1 && await chat.isVisible();
  if (result.chatLauncher) { await chat.click(); await page.waitForTimeout(200); const close = page.locator('button[aria-label*="Close chat"]'); result.chatOpened = await close.count() === 1 && await close.isVisible(); if (result.chatOpened) await close.click(); }
  return result;
}

const results = [];
for (const config of configs) {
  const html = await readFile(join(root, config.route.slice(1), "index.html"), "utf8");
  const page = await browser.newPage({ viewport:{ width:1280,height:900 } });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(new URL(config.route, baseUrl).href, { waitUntil:"domcontentloaded", timeout:30000 });
  await page.waitForTimeout(1500);
  const settled = await snapshot(page);
  const desktop = await responsive(page, { width:1280,height:900 });
  const desktopInteractions = await interactions(page, false);
  const mobile = await responsive(page, { width:390,height:844 });
  const mobileInteractions = await interactions(page, true);
  results.push({ route:config.route, expected:config, raw:rawMetrics(html,config), settled, desktop, mobile, interactions:{ desktop:desktopInteractions,mobile:mobileInteractions }, consoleErrors:[...new Set(consoleErrors)] });
  await page.close();
}
await browser.close();
const report = { generatedAt:new Date().toISOString(), results };
if (output) await writeFile(output, `${JSON.stringify(report,null,2)}\n`, "utf8");
else console.log(JSON.stringify(report,null,2));
