import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[3] ?? "STEP_07_REGRESSION.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const routes = [
  ["/montreal-to-edmonton-movers/", "rebuild-montreal-edmonton-static-route.mjs", "Montreal, QC", "Edmonton, AB"],
  ["/edmonton-to-montreal-movers/", "generate-spa-routes.mjs", "Edmonton, AB", "Montreal, QC"],
  ["/edmonton-to-vancouver-movers/", "generate-spa-routes.mjs", "Edmonton, AB", "Vancouver, BC"],
  ["/calgary-to-winnipeg-movers/", "rebuild-calgary-winnipeg-routes.mjs", "Calgary, AB", "Winnipeg, MB"],
  ["/calgary-to-montreal-movers/", "checked-in-static-route-source", "Calgary, AB", "Montreal, QC"],
  ["/calgary-to-toronto-movers/", "rebuild-calgary-toronto-static-routes.mjs", "Calgary, AB", "Toronto, ON"],
  ["/montreal-to-calgary-movers/", "rebuild-montreal-calgary-static-routes.mjs", "Montreal, QC", "Calgary, AB"],
];
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const results = await Promise.all(routes.map(async ([path, owner, from, to]) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(5500);
  const desktop = await page.evaluate(({ from, to }) => {
    const forms = [...document.querySelectorAll("form")].filter((form) => !form.classList.contains("pcm-static-chat-form") && !form.closest("[role=dialog]"));
    const form = forms[0];
    const text = document.body.innerText;
    return { h1: document.querySelectorAll("h1").length, forms: forms.length, tables: document.querySelectorAll("table").length, faq: [...document.querySelectorAll("h2")].filter((node) => /Frequently Asked Questions/i.test(node.textContent)).length, schema: [...document.querySelectorAll('script[type="application/ld+json"]')].filter((node) => /FAQPage/.test(node.textContent)).length, from: form?.querySelector('[name="from"]')?.value, to: form?.querySelector('[name="to"]')?.value, overflow: document.documentElement.scrollWidth > innerWidth, undefined: /\bundefined\b/i.test(text), soft404: /Page Not Found/i.test(text), legacy: /Moving Cost Breakdown/i.test(text), direction: form?.querySelector('[name="from"]')?.value === from && form?.querySelector('[name="to"]')?.value === to };
  }, { from, to });
  await page.close();
  const ownership = routeOwnershipByUrl.get(path);
  const issues = [];
  if (ownership?.owner !== owner || desktop.h1 !== 1 || desktop.forms !== 1 || desktop.tables !== 1 || desktop.faq !== 1 || desktop.schema !== 1 || !desktop.direction || desktop.overflow || desktop.undefined || desktop.soft404 || desktop.legacy) issues.push("page contract");
  if (errors.length) issues.push("page errors");
  return { path, expectedOwner: owner, actualOwner: ownership?.owner, desktop, errors, issues };
}));
await browser.close();
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
for (const result of results) console.log(`${result.path}: ${result.issues.length ? result.issues.join(", ") : "PASS"}`);
process.exitCode = results.some((result) => result.issues.length) ? 1 : 0;
