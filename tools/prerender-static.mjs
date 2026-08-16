import { createReadStream } from "node:fs";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const sourceRoot = resolve(process.argv[2] ?? "site-copy");
const outputRoot = resolve(process.argv[3] ?? "outputs/prerender-test");
const port = Number(process.argv[4] ?? 4191);
const limit = Number(process.env.PRERENDER_LIMIT ?? "0");

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

const excludedRouteParts = new Set(["admin", "404", "siteblog", "wp-admin", "wp-content", "wp-includes"]);
const excludedRoutes = new Set([
  "/calgary-to-edmonton-movers/",
  "/edmonton-to-calgary-movers/",
  "/movers-calgary-to-edmonton/",
  "/movers-edmonton-to-calgary/",
  "/movers-toronto-to-vancouver/",
  "/movers-vancouver-to-montreal/",
  "/movers-vancouver-to-ottawa/",
  "/movers-vancouver-to-halifax/",
  "/movers-vancouver-to-toronto/",
]);

async function exists(path) {
  try {
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
  throw new Error("Could not find Chrome or Edge. Install Chrome/Edge or add its path to chromeCandidates.");
}

function safePath(root, pathname) {
  const decoded = decodeURIComponent(pathname.split("?")[0]);
  const normalized = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return join(root, normalized);
}

function createStaticServer(root) {
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, `http://localhost:${port}`).pathname;
    let filePath = safePath(root, pathname);
    try {
      const info = await stat(filePath);
      if (info.isDirectory()) filePath = join(filePath, "index.html");
    } catch {
      filePath = join(root, "index.html");
    }

    try {
      await stat(filePath);
      response.setHeader("content-type", types[extname(filePath).toLowerCase()] ?? "application/octet-stream");
      createReadStream(filePath).pipe(response);
    } catch {
      response.statusCode = 404;
      response.end("Not found");
    }
  });

  return new Promise((resolveServer, rejectServer) => {
    server.once("error", rejectServer);
    server.listen(port, "127.0.0.1", () => resolveServer(server));
  });
}

async function walkIndexFiles(root, dir = root, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkIndexFiles(root, fullPath, files);
    } else if (entry.isFile() && entry.name === "index.html") {
      files.push(fullPath);
    }
  }
  return files;
}

function fileToRoute(root, file) {
  const relative = file.slice(root.length).split(sep).join("/");
  if (relative === "/index.html") return "/";
  return relative.replace(/\/index\.html$/, "/");
}

function isPublicRoute(route) {
  const parts = route.split("/").filter(Boolean);
  return !excludedRoutes.has(route) && !parts.some((part) => excludedRouteParts.has(part) || part.startsWith("wp-"));
}

function isEmptyShell(html) {
  return html.includes('<div id="root"></div>') && !/<main[\s>]|<h1[\s>]/i.test(html);
}

function firstMatch(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function isHomepageClone(route, html) {
  if (route === "/") return false;

  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonical = firstMatch(html, /<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || firstMatch(html, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i);
  const h1 = firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return canonical.replace(/\/$/, "") === "https://purelycanadianmovers.com"
    || title === "Vancouver Movers | Local & Long-Distance Moving"
    || h1.startsWith("Professional Movers Serving Metro Vancouver");
}

async function discoverRoutes() {
  const indexFiles = await walkIndexFiles(sourceRoot);
  const routes = [];
  for (const file of indexFiles) {
    const route = fileToRoute(sourceRoot, file);
    if (!isPublicRoute(route)) continue;
    const html = await readFile(file, "utf8");
    if (isEmptyShell(html) || isHomepageClone(route, html)) {
      routes.push({ route, sourceFile: file, outputFile: join(outputRoot, file.slice(sourceRoot.length)) });
    }
  }
  return routes.sort((a, b) => a.route.localeCompare(b.route));
}

function renderWithChrome(chromePath, route) {
  const userDataDir = join(tmpdir(), `pcm-prerender-${process.pid}-${Math.random().toString(16).slice(2)}`);
  const url = `http://127.0.0.1:${port}${route}`;
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${userDataDir}`,
    "--virtual-time-budget=8000",
    "--dump-dom",
    url,
  ];

  return new Promise((resolveRender) => {
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
      resolveRender({ code, stdout, stderr });
    });
  });
}

function validateRenderedHtml(html) {
  if (!html.includes("<html") || !html.includes("</html>")) return "missing html document";
  if (!/<div id="root">[\s\S]*?<main[\s>]/i.test(html) && !/<main[\s>]/i.test(html)) return "missing rendered main content";
  if (!/<h1[\s>]/i.test(html)) return "missing h1";
  return "";
}

async function main() {
  const chromePath = await findChrome();
  const routes = await discoverRoutes();
  const selectedRoutes = limit > 0 ? routes.slice(0, limit) : routes;

  console.log(`source=${sourceRoot}`);
  console.log(`output=${outputRoot}`);
  console.log(`chrome=${chromePath}`);
  console.log(`empty_public_routes=${routes.length}`);
  console.log(`selected_routes=${selectedRoutes.length}`);

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(dirname(outputRoot), { recursive: true });
  await cp(sourceRoot, outputRoot, { recursive: true });
  for (const route of excludedRoutes) {
    await rm(join(outputRoot, route), { recursive: true, force: true });
  }

  const server = await createStaticServer(sourceRoot);
  const results = [];
  try {
    for (const [index, item] of selectedRoutes.entries()) {
      const beforeBytes = (await stat(item.sourceFile)).size;
      const rendered = await renderWithChrome(chromePath, item.route);
      const error = validateRenderedHtml(rendered.stdout);
      if (rendered.code !== 0 || error) {
        const stderrSummary = rendered.stderr
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 3)
          .join(" | ");
        results.push({
          route: item.route,
          status: "failed",
          beforeBytes,
          afterBytes: 0,
          error: `${error || `chrome exited ${rendered.code}`} (stdout=${rendered.stdout.length}, stderr=${stderrSummary})`,
        });
        console.log(`[${index + 1}/${selectedRoutes.length}] failed ${item.route} ${error || `chrome exited ${rendered.code}`} stdout=${rendered.stdout.length}`);
        continue;
      }

      await mkdir(dirname(item.outputFile), { recursive: true });
      await writeFile(item.outputFile, rendered.stdout, "utf8");
      const afterBytes = Buffer.byteLength(rendered.stdout, "utf8");
      results.push({ route: item.route, status: "rendered", beforeBytes, afterBytes, error: "" });
      console.log(`[${index + 1}/${selectedRoutes.length}] rendered ${item.route} ${beforeBytes} -> ${afterBytes}`);
    }
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  const rendered = results.filter((result) => result.status === "rendered");
  const failed = results.filter((result) => result.status === "failed");
  await writeFile(
    join(outputRoot, "prerender-report.json"),
    JSON.stringify({ sourceRoot, outputRoot, routeCount: routes.length, selectedCount: selectedRoutes.length, renderedCount: rendered.length, failedCount: failed.length, results }, null, 2),
    "utf8",
  );

  console.log(`rendered=${rendered.length}`);
  console.log(`failed=${failed.length}`);
  if (failed.length) {
    console.log("failures:");
    for (const failure of failed) console.log(`${failure.route}: ${failure.error}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
