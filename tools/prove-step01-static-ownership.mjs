import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const siteRoot = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[4] ?? "STEP_01_DIRECT_EDIT_PROOF.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const routes = ["calgary-to-toronto-movers", "toronto-to-calgary-movers"];
const results = [];

for (const slug of routes) {
  const file = join(siteRoot, slug, "index.html");
  const original = await readFile(file, "utf8");
  const marker = `STEP01-DIRECT-EDIT-${slug}`;
  if (!original.includes("</h1>")) throw new Error(`${slug}: H1 not found`);
  try {
    await writeFile(file, original.replace("</h1>", ` <span data-step01-direct-edit>${marker}</span></h1>`));
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${new URL(`/${slug}/`, baseUrl).href}?step01=${Date.now()}`, { waitUntil: "commit", timeout: 10000 });
    const initial = (await page.locator("h1").textContent()).includes(marker);
    await page.waitForTimeout(5500);
    const delayed = (await page.locator("h1").textContent()).includes(marker);
    await page.reload({ waitUntil: "commit", timeout: 10000 });
    await page.waitForTimeout(1200);
    const hardRefresh = (await page.locator("h1").textContent()).includes(marker);
    results.push({ route: `/${slug}/`, initial, delayed, hardRefresh, reactBootstrap: /index-CNBNs70h\.js/.test(await readFile(file, "utf8")) });
    await page.close();
  } finally {
    await writeFile(file, original);
  }
}

await browser.close();
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
for (const result of results) console.log(`${result.route}: ${result.initial && result.delayed && result.hardRefresh && !result.reactBootstrap ? "PASS" : "FAIL"}`);
process.exitCode = results.some((result) => !result.initial || !result.delayed || !result.hardRefresh || result.reactBootstrap) ? 1 : 0;
