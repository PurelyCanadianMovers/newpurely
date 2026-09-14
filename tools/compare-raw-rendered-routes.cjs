const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const baseUrl = process.argv[2] || "http://127.0.0.1:4174";
const root = process.argv[3] || "site-copy";
const browserCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const browser = browserCandidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("Chrome or Microsoft Edge executable not found.");
  process.exit(2);
}

const routes = [
  "/montreal-to-vancouver-movers/",
  "/toronto-to-vancouver-movers/",
  "/vancouver-to-toronto-movers/",
  "/vancouver-to-calgary-movers/",
  "/calgary-to-vancouver-movers/",
  "/montreal-to-calgary-movers/",
  "/vancouver-to-halifax-movers/",
];

function details(html) {
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  );
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1] || "";
  const prices = [...new Set([...html.matchAll(/\$[\d,]+(?:\+)?/g)].map((m) => m[0]))];
  const transit = [...new Set([...html.matchAll(/\b\d{1,2}\s*-\s*\d{1,2}\s*days\b|overnight/gi)].map((m) => m[0]))];
  const bad = /Calgary's lower cost|mountain proximity|binding estimates?|guaranteed pricing|guaranteed final|guaranteed long-distance/i.test(html);
  const soft404 = /Page Not Found|>\s*404\s*</i.test(html);
  return { h1s, canonical, prices, transit, bad, soft404 };
}

let problems = 0;
for (const route of routes) {
  const rawPath = path.join(root, route, "index.html");
  const raw = fs.readFileSync(rawPath, "utf8");
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcm-render-check-"));
  const rendered = execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--disable-gpu-compositing",
    "--disable-dev-shm-usage",
    "--disable-software-rasterizer",
    "--disable-features=VizDisplayCompositor",
    "--single-process",
    "--no-zygote",
    `--user-data-dir=${userDataDir}`,
    "--virtual-time-budget=5000",
    "--dump-dom",
    baseUrl.replace(/\/$/, "") + route,
  ], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });

  const a = details(raw);
  const b = details(rendered);
  const routeProblems = [];
  if (a.h1s.join("|") !== b.h1s.join("|")) routeProblems.push("h1_diff");
  if (a.prices.join("|") !== b.prices.join("|")) routeProblems.push("price_diff");
  if (a.transit.join("|") !== b.transit.join("|")) routeProblems.push("transit_diff");
  if (a.bad || b.bad) routeProblems.push("bad_phrase");
  if (a.soft404 || b.soft404) routeProblems.push("soft_404");
  if (routeProblems.length) problems++;
  console.log(`${route} - ${routeProblems.length ? routeProblems.join(", ") : "OK"}`);
}

process.exitCode = problems ? 1 : 0;
