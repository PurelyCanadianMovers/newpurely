import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";
import { torontoVictoriaFacts, torontoVictoriaRoutes } from "./toronto-victoria-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[4] ?? "STEP_11_TORONTO_VICTORIA_AUDIT.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE, headless: true });
const results = [];
for (const route of Object.keys(torontoVictoriaRoutes)) {
  const html = await readFile(join(root, route.slice(1), "index.html"), "utf8");
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(new URL(route, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1200);
  const dom = await page.evaluate(() => {
    const clean = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
    const faq = [...document.querySelectorAll('[data-pcm-route-faq-static="1"] article')].map((item) => clean(item.innerText));
    const text = clean(document.body.innerText);
    const h1 = document.querySelector("h1");
    const h1Style = h1 ? getComputedStyle(h1) : null;
    return { h1: clean(h1?.textContent), h1Count: document.querySelectorAll("h1").length, title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.href, from: document.querySelector('[name="from"]')?.value, to: document.querySelector('[name="to"]')?.value, faqCount: faq.length, faqSchema: [...document.querySelectorAll('script[type="application/ld+json"]')].filter((s) => /FAQPage/.test(s.textContent)).length, text, font: h1Style ? [h1Style.fontSize, h1Style.lineHeight] : null, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, chat: Boolean(document.querySelector('button[aria-label="Open chat assistant"]')) };
  });
  const target = route === "/toronto-to-victoria-movers/";
  results.push({ route, owner: routeOwnershipByUrl.get(route).owner, declaredRender: routeOwnershipByUrl.get(route).rendering, actualRender: /type=["']module["'][^>]*index-[^"']+\.js/i.test(html) ? "react-spa" : "static", reactBootstrap: /type=["']module["'][^>]*index-[^"']+\.js/i.test(html), staticRuntime: /static-nav\.js/.test(html) && /static-chat\.js/.test(html), facts: [torontoVictoriaFacts.distanceShort, torontoVictoriaFacts.transit, torontoVictoriaFacts.overallRange, ...torontoVictoriaFacts.rows.flat()].every((value) => dom.text.includes(value)), dom, consoleErrors, target });
  await page.close();
}
await browser.close();
await writeFile(output, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2) + String.fromCharCode(10));
for (const result of results) console.log(`${result.route}: ${result.actualRender} ${result.dom.h1Count === 1 && result.facts && !result.dom.overflow ? "PASS" : "FAIL"}`);
process.exitCode = results.some((result) => result.actualRender !== "static" || result.dom.h1Count !== 1 || !result.facts || result.dom.overflow) ? 1 : 0;
