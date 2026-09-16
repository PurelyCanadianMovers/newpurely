import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[3] ?? "STEP_04_REGRESSION.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const routes = [
  ["/montreal-to-toronto-movers/", "rebuild-montreal-toronto-static-routes.mjs", "Montreal, QC", "Toronto, ON"],
  ["/toronto-to-montreal-movers/", "rebuild-montreal-toronto-static-routes.mjs", "Toronto, ON", "Montreal, QC"],
  ["/toronto-to-vancouver-movers/", "generate-spa-routes.mjs", "Toronto, ON", "Vancouver, BC"],
  ["/calgary-to-winnipeg-movers/", "rebuild-calgary-winnipeg-routes.mjs", "Calgary, AB", "Winnipeg, MB"],
  ["/calgary-to-edmonton-movers/", "checked-in-static-route-source", "Calgary, AB", "Edmonton, AB"],
  ["/montreal-to-edmonton-movers/", "generate-spa-routes.mjs", "Montreal, QC", "Edmonton, AB"],
  ["/calgary-to-toronto-movers/", "rebuild-calgary-toronto-static-routes.mjs", "Calgary, AB", "Toronto, ON"],
  ["/calgary-to-vancouver-movers/", "rebuild-calgary-vancouver-static-routes.mjs", "Calgary, AB", "Vancouver, BC"],
  ["/edmonton-to-toronto-movers/", "rebuild-edmonton-toronto-static-routes.mjs", "Edmonton, AB", "Toronto, ON"],
];
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const results = await Promise.all(routes.map(async ([path, owner, from, to]) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(5500);
  const desktop = await page.evaluate(({ from, to }) => {
    const form = document.querySelector("form:not(.pcm-static-chat-form)");
    return { h1: document.querySelectorAll("h1").length, forms: document.querySelectorAll("form:not(.pcm-static-chat-form)").length, tables: document.querySelectorAll("table").length, faq: [...document.querySelectorAll("h2")].filter((node) => /Frequently Asked Questions/i.test(node.textContent)).length, schema: [...document.querySelectorAll('script[type="application/ld+json"]')].filter((node) => /FAQPage/.test(node.textContent)).length, from: form?.querySelector('[name="from"]')?.value, to: form?.querySelector('[name="to"]')?.value, overflow: document.documentElement.scrollWidth > innerWidth, undefined: /\bundefined\b/i.test(document.body.innerText), soft404: /Page Not Found/i.test(document.body.innerText), direction: form?.querySelector('[name="from"]')?.value === from && form?.querySelector('[name="to"]')?.value === to };
  }, { from, to });
  let mobile = null;
  if (owner === "rebuild-montreal-toronto-static-routes.mjs") {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    mobile = await page.evaluate(() => {
      const trigger = document.querySelector('header button[aria-label="Open menu"]');
      const panel = document.querySelector(".pcm-static-mobile");
      const css = [...document.styleSheets].some((sheet) => sheet.href?.includes("static-nav.css"));
      const before = panel && getComputedStyle(panel).display === "none" && trigger?.getAttribute("aria-expanded") === "false";
      trigger?.click(); const opened = panel?.classList.contains("is-open") && trigger?.getAttribute("aria-expanded") === "true";
      trigger?.click(); const toggledClosed = !panel?.classList.contains("is-open") && trigger?.getAttribute("aria-expanded") === "false";
      trigger?.click(); document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      const escaped = !panel?.classList.contains("is-open") && trigger?.getAttribute("aria-expanded") === "false";
      return { css, before, opened, toggledClosed, escaped, overflow: document.documentElement.scrollWidth > innerWidth };
    });
  }
  await page.close();
  const ownership = routeOwnershipByUrl.get(path);
  const issues = [];
  if (ownership?.owner !== owner || desktop.h1 !== 1 || desktop.forms !== 1 || desktop.tables !== 1 || desktop.faq !== 1 || desktop.schema !== 1 || !desktop.direction || desktop.overflow || desktop.undefined || desktop.soft404) issues.push("page contract");
  if (mobile && (!mobile.css || !mobile.before || !mobile.opened || !mobile.toggledClosed || !mobile.escaped || mobile.overflow)) issues.push("static mobile shell");
  if (errors.length) issues.push("page errors");
  return { path, owner, ownership, desktop, mobile, errors, issues };
}));
await browser.close();
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
for (const result of results) console.log(`${result.path}: ${result.issues.length ? result.issues.join(", ") : "PASS"}`);
process.exitCode = results.some((result) => result.issues.length) ? 1 : 0;
