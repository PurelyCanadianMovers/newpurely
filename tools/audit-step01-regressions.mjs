import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[3] ?? "STEP_01_REGRESSION.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const routes = [
  { path: "/edmonton-to-toronto-movers/", from: "Edmonton, AB", to: "Toronto, ON", expectedRendering: "react-spa" },
  { path: "/calgary-to-winnipeg-movers/", from: "Calgary, AB", to: "Winnipeg, MB", expectedRendering: "static" },
  { path: "/calgary-to-edmonton-movers/", from: "Calgary, AB", to: "Edmonton, AB", expectedRendering: "static" },
  { path: "/montreal-to-edmonton-movers/", from: "Montreal, QC", to: "Edmonton, AB", expectedRendering: "react-spa" },
];

async function inspect(route) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(new URL(route.path, baseUrl).href, { waitUntil: "commit", timeout: 10000 });
  await page.waitForTimeout(5500);
  const state = await page.evaluate(({ from, to }) => {
    const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const faqHeadings = [...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(clean(node.textContent)));
    const form = document.querySelector("form");
    return {
      h1: clean(document.querySelector("h1")?.textContent), title: document.title,
      from: form?.querySelector('[name="from"]')?.value, to: form?.querySelector('[name="to"]')?.value,
      h1Count: document.querySelectorAll("h1").length, formCount: document.querySelectorAll("form").length,
      pricingCount: document.querySelectorAll(".pcm-route-cost").length, tableCount: document.querySelectorAll("table").length,
      faqCount: faqHeadings.length, faqSchemaCount: [...document.querySelectorAll('script[type="application/ld+json"]')].reduce((count, script) => { try { let found = 0; const walk = (value) => { if (!value || typeof value !== "object") return; if (value["@type"] === "FAQPage") found += 1; if (Array.isArray(value)) value.forEach(walk); else Object.values(value).forEach(walk); }; walk(JSON.parse(script.textContent)); return count + found; } catch { return count; } }, 0),
      nav: Boolean(document.querySelector("header") && document.querySelector("nav")),
      chat: document.querySelectorAll('button[aria-label="Open chat assistant"]').length,
      undefinedVisible: /\bundefined\b/i.test(document.body.innerText), soft404: /Page Not Found/i.test(document.body.innerText),
      directionCorrect: (form?.querySelector('[name="from"]')?.value === from) && (form?.querySelector('[name="to"]')?.value === to),
    };
  }, route);
  const ownership = routeOwnershipByUrl.get(route.path);
  const issues = [];
  if (ownership?.rendering !== route.expectedRendering) issues.push(`ownership ${ownership?.rendering}`);
  if (state.h1Count !== 1 || state.formCount < 1 || !state.directionCorrect || !state.nav || state.chat !== 1 || state.faqCount !== 1 || state.faqSchemaCount !== 1 || state.tableCount !== 1 || state.undefinedVisible || state.soft404) issues.push("page contract");
  await page.close();
  return { route: route.path, ownership, state, consoleErrors, issues };
}

const results = await Promise.all(routes.map(inspect));
await browser.close();
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
for (const result of results) console.log(`${result.route}: ${result.issues.length ? result.issues.join(", ") : "PASS"}`);
process.exitCode = results.some((result) => result.issues.length) ? 1 : 0;
