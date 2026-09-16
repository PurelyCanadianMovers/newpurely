import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[3] ?? "STEP_02_REGRESSION.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const routes = [
  { path: "/edmonton-to-toronto-movers/", class: "B — React Owned", from: "Edmonton, AB", to: "Toronto, ON", owner: "generate-spa-routes.mjs" },
  { path: "/calgary-to-winnipeg-movers/", class: "C — Hybrid", from: "Calgary, AB", to: "Winnipeg, MB", owner: "rebuild-calgary-winnipeg-routes.mjs" },
  { path: "/calgary-to-edmonton-movers/", class: "A — Static Safe", from: "Calgary, AB", to: "Edmonton, AB", owner: "checked-in-static-route-source" },
  { path: "/montreal-to-edmonton-movers/", class: "B — React Owned reference", from: "Montreal, QC", to: "Edmonton, AB", owner: "generate-spa-routes.mjs" },
  { path: "/calgary-to-toronto-movers/", class: "A — Migration Step 1", from: "Calgary, AB", to: "Toronto, ON", owner: "rebuild-calgary-toronto-static-routes.mjs" },
];

async function inspect(route) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(new URL(route.path, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(5500);
  const state = await page.evaluate(({ from, to }) => {
    const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const faqHeadings = [...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(clean(node.textContent)));
    const form = document.querySelector("form:not(.pcm-static-chat-form)");
    const faqSchemaCount = [...document.querySelectorAll('script[type="application/ld+json"]')].reduce((count, script) => {
      try {
        let found = 0;
        const walk = (value) => {
          if (!value || typeof value !== "object") return;
          if (value["@type"] === "FAQPage") found += 1;
          if (Array.isArray(value)) value.forEach(walk);
          else Object.values(value).forEach(walk);
        };
        walk(JSON.parse(script.textContent));
        return count + found;
      } catch { return count; }
    }, 0);
    return {
      h1: clean(document.querySelector("h1")?.textContent),
      title: document.title,
      from: form?.querySelector('[name="from"]')?.value,
      to: form?.querySelector('[name="to"]')?.value,
      h1Count: document.querySelectorAll("h1").length,
      quoteFormCount: document.querySelectorAll("form:not(.pcm-static-chat-form)").length,
      pricingCount: document.querySelectorAll(".pcm-route-cost").length,
      tableCount: document.querySelectorAll("table").length,
      faqCount: faqHeadings.length,
      faqSchemaCount,
      navCount: document.querySelectorAll("header nav").length,
      footerCount: document.querySelectorAll("footer").length,
      chatCount: document.querySelectorAll('button[aria-label="Open chat assistant"]').length,
      undefinedVisible: /\bundefined\b/i.test(document.body.innerText),
      soft404: /Page Not Found/i.test(document.body.innerText),
      directionCorrect: form?.querySelector('[name="from"]')?.value === from && form?.querySelector('[name="to"]')?.value === to,
    };
  }, route);
  const ownership = routeOwnershipByUrl.get(route.path);
  const issues = [];
  if (ownership?.owner !== route.owner) issues.push(`owner ${ownership?.owner}`);
  if (state.h1Count !== 1 || state.quoteFormCount !== 1 || !state.directionCorrect || state.navCount !== 1 || state.footerCount !== 1 || state.chatCount !== 1 || state.faqCount !== 1 || state.faqSchemaCount !== 1 || state.tableCount !== 1 || state.undefinedVisible || state.soft404) issues.push("page contract");
  if (consoleErrors.length) issues.push("console errors");
  await page.close();
  return { route: route.path, classification: route.class, ownership, state, consoleErrors, issues };
}

const results = await Promise.all(routes.map(inspect));
await browser.close();
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
for (const result of results) console.log(`${result.route}: ${result.issues.length ? result.issues.join(", ") : "PASS"}`);
process.exitCode = results.some((result) => result.issues.length) ? 1 : 0;
