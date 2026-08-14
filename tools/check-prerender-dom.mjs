import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const pages = process.argv.slice(2);
const defaultPages = [
  "/",
  "/local/",
  "/toronto-to-calgary-movers/",
  "/vancouver/",
  "/long-distance-moving-cost-canada/",
  "/halifax-to-calgary-movers/",
];

async function exists(path) {
  try {
    const { stat } = await import("node:fs/promises");
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function findChrome() {
  for (const candidate of chromeCandidates) {
    if (await exists(candidate)) return candidate;
  }
  throw new Error("Could not find Chrome or Edge.");
}

function count(text, pattern) {
  return (text.match(pattern) ?? []).length;
}

async function render(chromePath, path) {
  const userDataDir = join(tmpdir(), `pcm-dom-check-${process.pid}-${Math.random().toString(16).slice(2)}`);
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${userDataDir}`,
    "--virtual-time-budget=5000",
    "--dump-dom",
    `http://127.0.0.1:4195${path}`,
  ];

  return new Promise((resolve) => {
    const child = spawn(chromePath, args, { windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", async (code) => {
      await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
      resolve({ code, stdout, stderr });
    });
  });
}

const chromePath = await findChrome();
const rows = [];
for (const page of pages.length ? pages : defaultPages) {
  const { code, stdout, stderr } = await render(chromePath, page);
  rows.push({
    page,
    code,
    bytes: stdout.length,
    hasMain: /<main[\s>]/i.test(stdout),
    hasH1: /<h1[\s>]/i.test(stdout),
    hasHeader: /<header[\s>]/i.test(stdout),
    hasFooter: /<footer[\s>]/i.test(stdout),
    visible404: />\s*404\s*</.test(stdout) || /Page Not Found/.test(stdout),
    gtagScript: count(stdout, /googletagmanager\.com\/gtag\/js\?id=G-V391NLDX70/g),
    gtagConfig: count(stdout, /gtag\(["']config["'],\s*["']G-V391NLDX70["']/g),
    oldGaProperty: count(stdout, /G-6Y6544NHEQ/g),
    openAiScript: count(stdout, /bzrcdn\.openai\.com\/sdk\/oaiq\.min\.js/g),
    jsonLd: count(stdout, /<script type="application\/ld\+json"/g),
    canonical: count(stdout, /rel="canonical"/g),
    stderrFirstLine: stderr.split(/\r?\n/).find(Boolean) ?? "",
  });
}

console.table(rows);
