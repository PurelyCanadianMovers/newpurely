import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4175";
const output = process.argv[3] ? resolve(process.argv[3]) : null;
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required.");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });

const routes = [
  "/montreal-to-edmonton-movers/", "/edmonton-to-montreal-movers/",
  "/montreal-to-toronto-movers/", "/toronto-to-montreal-movers/",
  "/toronto-to-edmonton-movers/", "/edmonton-to-toronto-movers/",
  "/vancouver-to-edmonton-movers/", "/edmonton-to-vancouver-movers/",
  "/calgary-to-toronto-movers/", "/toronto-to-calgary-movers/",
  "/montreal-to-victoria-movers/", "/victoria-to-montreal-movers/",
  "/calgary-to-halifax-movers/", "/halifax-to-calgary-movers/",
  "/montreal-to-vancouver-movers/", "/vancouver-to-montreal-movers/",
  "/ottawa-to-vancouver-movers/", "/vancouver-to-ottawa-movers/",
  "/ottawa-to-winnipeg-movers/", "/winnipeg-to-ottawa-movers/",
  "/halifax-to-toronto-movers/", "/toronto-to-halifax-movers/",
  "/ottawa-to-victoria-movers/", "/victoria-to-ottawa-movers/",
  "/vancouver-to-halifax-movers/", "/halifax-to-vancouver-movers/",
  "/calgary-to-vancouver-movers/", "/vancouver-to-calgary-movers/",
  "/edmonton-to-winnipeg-movers/", "/winnipeg-to-edmonton-movers/",
  "/calgary-to-edmonton-movers/", "/edmonton-to-calgary-movers/",
  "/montreal-to-calgary-movers/", "/calgary-to-montreal-movers/",
  "/edmonton-to-ottawa-movers/", "/ottawa-to-edmonton-movers/",
  "/toronto-to-vancouver-movers/", "/vancouver-to-toronto-movers/",
  "/vancouver-to-winnipeg-movers/", "/winnipeg-to-vancouver-movers/",
  "/winnipeg-to-montreal-movers/", "/montreal-to-winnipeg-movers/",
  "/toronto-to-winnipeg-movers/", "/winnipeg-to-toronto-movers/",
  "/calgary-to-ottawa-movers/", "/ottawa-to-calgary-movers/",
  "/calgary-to-winnipeg-movers/", "/winnipeg-to-calgary-movers/",
  "/ottawa-to-toronto-movers/", "/toronto-to-ottawa-movers/",
  "/vancouver-to-seattle-movers/", "/seattle-to-vancouver-movers/",
  "/bc-to-washington-movers/",
  "/victoria-to-vancouver-movers/",
];
const locations = {
  calgary: ["Calgary", "Calgary, AB"], edmonton: ["Edmonton", "Edmonton, AB"], halifax: ["Halifax", "Halifax, NS"],
  montreal: ["Montreal", "Montreal, QC"], ottawa: ["Ottawa", "Ottawa, ON"], toronto: ["Toronto", "Toronto, ON"],
  vancouver: ["Vancouver", "Vancouver, BC"], victoria: ["Victoria", "Victoria, BC"], winnipeg: ["Winnipeg", "Winnipeg, MB"],
  seattle: ["Seattle", "Seattle, WA"],
  bc: ["BC", "British Columbia"], washington: ["Washington", "Washington State"],
};

async function inspect(route) {
  const [originSlug, destinationSlug] = route.slice(1, -1).replace(/-movers$/, "").split("-to-");
  const [origin, from] = locations[originSlug];
  const [destination, to] = locations[destinationSlug];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.goto(new URL(route, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(5000);
    return await page.evaluate(({ origin, destination, from, to }) => {
      const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
      const h1 = clean(document.querySelector("h1")?.textContent);
      const title = document.title;
      const actualFrom = document.querySelector('[name="from"]')?.value ?? null;
      const actualTo = document.querySelector('[name="to"]')?.value ?? null;
      const brandCount = (title.match(/Purely Canadian Movers/g) ?? []).length;
      const issues = [];
      if (!h1.toLowerCase().includes(origin.toLowerCase()) || !h1.toLowerCase().includes(destination.toLowerCase())) issues.push("wrong H1");
      if (actualFrom !== from || actualTo !== to) issues.push(`form ${actualFrom} -> ${actualTo}`);
      if (brandCount !== 1) issues.push("title brand count");
      if (document.querySelector('meta[property="og:title"]')?.content !== title) issues.push("OG title mismatch");
      if (document.querySelector('meta[name="twitter:title"]')?.content !== title) issues.push("Twitter title mismatch");
      if (!document.querySelector("table")) issues.push("missing pricing table");
      if (document.querySelectorAll(".pcm-local-seo").length) issues.push("pcm-local-seo");
      if (/\bundefined\b/i.test(document.body.innerText)) issues.push("undefined");
      if (!document.querySelector("header") || !document.querySelector("nav")) issues.push("navigation");
      if (![...document.querySelectorAll("button")].some((button) => /chat/i.test(button.getAttribute("aria-label") || ""))) issues.push("chatbot");
      if (/Your Move\. Our Family\. One Standard:|Page Not Found/i.test(document.body.innerText)) issues.push("wrong body");
      return { h1, title, from: actualFrom, to: actualTo, issues };
    }, { origin, destination, from, to });
  } catch (error) {
    return { issues: [error.message] };
  } finally {
    await page.close();
  }
}

const results = new Array(routes.length);
let cursor = 0;
async function worker() {
  while (cursor < routes.length) {
    const index = cursor++;
    results[index] = { route: routes[index], ...(await inspect(routes[index])) };
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
await browser.close();
const report = { generatedAt: new Date().toISOString(), results };
if (output) await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
for (const result of results) console.log(`${result.route} ${result.issues.length ? result.issues.join(", ") : "PASS"}`);
process.exitCode = results.some((result) => result.issues.length) ? 1 : 0;
