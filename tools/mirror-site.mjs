import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, posix } from "node:path";

const startUrl = new URL(process.argv[2] ?? "https://purelycanadianmovers.com/");
const outDir = process.argv[3] ?? "site-copy";
const maxPages = Number(process.argv[4] ?? 80);
const origin = startUrl.origin;

const pageQueue = [normalizePageUrl(startUrl.href)];
const seenPages = new Set();
const seenAssets = new Set();
const assetExtensions = new Set([
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".ico",
  ".avif",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
  ".mp4",
  ".webm",
  ".pdf",
]);

function normalizePageUrl(raw) {
  const url = new URL(raw, startUrl);
  url.hash = "";
  if (url.hostname !== startUrl.hostname) return null;
  if (url.pathname.endsWith("/index.html")) url.pathname = url.pathname.slice(0, -10);
  return url.href;
}

function localPagePath(raw) {
  const url = new URL(raw);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") return "index.html";
  if (pathname.endsWith("/")) return posix.join(pathname.slice(1), "index.html");
  const ext = extname(pathname);
  return ext ? pathname.slice(1) : posix.join(pathname.slice(1), "index.html");
}

function localAssetPath(raw) {
  const url = new URL(raw, startUrl);
  const prefix = url.origin === origin ? "" : `external/${url.hostname}/`;
  let pathname = prefix + decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!pathname || pathname.endsWith("/")) pathname = posix.join(pathname, "index");
  return pathname;
}

function toRelative(fromFile, toFile) {
  let rel = posix.relative(posix.dirname(fromFile), toFile).replaceAll("\\", "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel || "./index.html";
}

function shouldSkip(raw) {
  return /^(mailto:|tel:|sms:|javascript:|#)/i.test(raw.trim());
}

function isAssetUrl(url) {
  return assetExtensions.has(extname(url.pathname).toLowerCase());
}

function collectUrls(text) {
  const urls = [];
  const attrRe = /\b(?:href|src|poster|data-src|data-bg|data-background-image)=["']([^"']+)["']/gi;
  const srcsetRe = /\b(?:srcset|data-srcset)=["']([^"']+)["']/gi;
  const cssRe = /url\((?!['"]?data:)(['"]?)([^)'"]+)\1\)/gi;

  for (const match of text.matchAll(attrRe)) urls.push(match[1]);
  for (const match of text.matchAll(cssRe)) urls.push(match[2]);
  for (const match of text.matchAll(srcsetRe)) {
    for (const part of match[1].split(",")) {
      const candidate = part.trim().split(/\s+/)[0];
      if (candidate) urls.push(candidate);
    }
  }
  return urls;
}

function rewriteText(text, currentFile, currentUrl) {
  const replaceOne = (raw) => {
    if (!raw || shouldSkip(raw)) return raw;
    let url;
    try {
      url = new URL(raw, currentUrl);
    } catch {
      return raw;
    }
    if (url.origin !== origin && !isAssetUrl(url)) return raw;
    url.hash = "";
    const local = url.origin === origin && isLikelyPage(url) ? localPagePath(url.href) : localAssetPath(url.href);
    return toRelative(currentFile, local);
  };

  text = text.replace(/\b(href|src|poster|data-src|data-bg|data-background-image)=["']([^"']+)["']/gi, (all, attr, raw) => {
    return `${attr}="${replaceOne(raw)}"`;
  });

  text = text.replace(/\b(srcset|data-srcset)=["']([^"']+)["']/gi, (all, attr, raw) => {
    const rewritten = raw
      .split(",")
      .map((part) => {
        const bits = part.trim().split(/\s+/);
        if (!bits[0]) return part;
        bits[0] = replaceOne(bits[0]);
        return bits.join(" ");
      })
      .join(", ");
    return `${attr}="${rewritten}"`;
  });

  return text.replace(/url\((?!['"]?data:)(['"]?)([^)'"]+)\1\)/gi, (all, quote, raw) => {
    return `url(${quote}${replaceOne(raw)}${quote})`;
  });
}

function isLikelyPage(url) {
  if (url.pathname.startsWith("/assets/")) return false;
  const ext = extname(url.pathname).toLowerCase();
  if (!ext || url.pathname.endsWith("/")) return true;
  return [".html", ".htm", ".php"].includes(ext);
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; Codex static mirror)",
      "accept": "*/*",
      "referer": startUrl.href,
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return {
    contentType: response.headers.get("content-type") ?? "",
    buffer: Buffer.from(await response.arrayBuffer()),
  };
}

async function saveFile(localPath, data) {
  const target = join(outDir, localPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, data);
}

async function mirrorAsset(raw, currentUrl) {
  if (!raw || shouldSkip(raw)) return;
  let url;
  try {
    url = new URL(raw, currentUrl);
  } catch {
    return;
  }
  if (url.origin !== origin && !isAssetUrl(url)) return;
  url.hash = "";
  if (url.origin === origin && isLikelyPage(url)) {
    const page = normalizePageUrl(url.href);
    if (page && !seenPages.has(page) && pageQueue.length + seenPages.size < maxPages) pageQueue.push(page);
    return;
  }
  if (!isAssetUrl(url)) return;
  const href = url.href;
  if (seenAssets.has(href)) return;
  seenAssets.add(href);
  try {
    const { contentType, buffer } = await fetchBuffer(href);
    let body = buffer;
    const localPath = localAssetPath(href);
    if (/text\/css|xml|svg|html/i.test(contentType)) {
      body = Buffer.from(rewriteText(buffer.toString("utf8"), localPath, href));
      for (const nested of collectUrls(body.toString("utf8"))) await mirrorAsset(nested, href);
    } else if (/javascript|json/i.test(contentType)) {
      body = Buffer.from(rewriteText(buffer.toString("utf8"), localPath, href));
      for (const nested of buffer.toString("utf8").matchAll(/https?:\/\/[^"' )]+/gi)) {
        await mirrorAsset(nested[0], href);
      }
    }
    await saveFile(localPath, body);
    console.log(`asset ${href}`);
  } catch (error) {
    console.warn(`skip asset ${href}: ${error.message}`);
  }
}

await mkdir(outDir, { recursive: true });

while (pageQueue.length && seenPages.size < maxPages) {
  const pageUrl = pageQueue.shift();
  if (!pageUrl || seenPages.has(pageUrl)) continue;
  seenPages.add(pageUrl);
  try {
    const { buffer } = await fetchBuffer(pageUrl);
    const localPath = localPagePath(pageUrl);
    let html = buffer.toString("utf8");
    for (const raw of collectUrls(html)) await mirrorAsset(raw, pageUrl);
    html = rewriteText(html, localPath, pageUrl);
    await saveFile(localPath, html);
    console.log(`page ${pageUrl}`);
  } catch (error) {
    console.warn(`skip page ${pageUrl}: ${error.message}`);
  }
}

const readme = `# Purely Canadian Movers static copy

This folder is a local static copy of ${startUrl.href}.

- Edit HTML files directly, starting with \`index.html\`.
- Shared styles and scripts live under \`wp-content/\`, \`wp-includes/\`, and copied asset folders.
- Forms and WordPress admin features are preserved visually, but they will not submit to WordPress from this static copy without custom backend work.

Generated on ${new Date().toISOString()}.
`;

await writeFile(join(outDir, "README.md"), readme);
console.log(`done pages=${seenPages.size} assets=${seenAssets.size} out=${outDir}`);
