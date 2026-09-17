import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const siteRoot = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[4] ?? "STEP_10_DIRECT_PROOF.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const slug = "edmonton-to-vancouver-movers";
const file = join(siteRoot, slug, "index.html");
const original = await readFile(file, "utf8");
const marker = "STEP10-DIRECT-EDIT-edmonton-to-vancouver-movers";
const results = [];
try {
  await writeFile(file, original.replace("</h1>", ` <span data-step10-direct-edit>${marker}</span></h1>`));
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const survives = async () => (await page.locator("h1").textContent()).includes(marker);
  const routeUrl = new URL(`/${slug}/`, baseUrl).href;
  await page.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  const initial = await survives();
  await page.waitForTimeout(5500);
  const delayed = await survives();
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
  const normalReload = await survives();
  await page.goto(`${routeUrl}?step10=${Date.now()}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  const cacheBusted = await survives();
  const client = await page.context().newCDPSession(page);
  await client.send("Network.clearBrowserCache");
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
  const hardRefresh = await survives();
  results.push({ route: `/${slug}/`, initial, delayed, normalReload, cacheBusted, hardRefresh, reactBootstrap: /<script[^>]+type=["']module["']|index-[^"']+\.js/.test(await readFile(file, "utf8")) });
  await page.close();
} finally {
  await writeFile(file, original);
  await browser.close();
}
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
for (const result of results) console.log(`${result.route}: ${result.initial && result.delayed && result.normalReload && result.cacheBusted && result.hardRefresh && !result.reactBootstrap ? "PASS" : "FAIL"}`);
process.exitCode = results.some((result) => !result.initial || !result.delayed || !result.normalReload || !result.cacheBusted || !result.hardRefresh || result.reactBootstrap) ? 1 : 0;
