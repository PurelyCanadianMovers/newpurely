import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sitemapUrl = process.argv[2] ?? "https://purelycanadianmovers.com/sitemap.xml";
const outputDir = resolve(process.argv[3] ?? "outputs");
const maxRedirects = 8;

const headers = {
  "user-agent": "PCM-Sitemap-Audit/1.0 (+https://purelycanadianmovers.com/)",
  accept: "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
};

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function firstMatch(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeEntities(match[1].replace(/\s+/g, " ").trim()) : "";
}

function allMatches(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => decodeEntities(match[1].replace(/\s+/g, " ").trim()));
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function contentKindFor(url, result) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (/\.(json|md|txt|xml|csv)$/i.test(pathname)) return pathname.split(".").pop();
  if (/html/i.test(result.contentType) || /<html[\s>]/i.test(result.body ?? "")) return "html";
  return "other";
}

function isMalformedCanonical(canonical) {
  if (!canonical) return false;
  if (/https?:\/\/[^/]+\/https?:\/\//i.test(canonical)) return true;
  try {
    const parsed = new URL(canonical);
    return !parsed.protocol.startsWith("http");
  } catch {
    return true;
  }
}

async function requestWithRedirects(url) {
  const chain = [];
  let currentUrl = url;

  for (let i = 0; i <= maxRedirects; i += 1) {
    const response = await fetch(currentUrl, { headers, redirect: "manual" });
    const location = response.headers.get("location");
    chain.push({
      url: currentUrl,
      status: response.status,
      location: location ? new URL(location, currentUrl).href : "",
    });

    if (response.status >= 300 && response.status < 400 && location) {
      currentUrl = new URL(location, currentUrl).href;
      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";
    const body = await response.text();
    return {
      requestedUrl: url,
      finalUrl: currentUrl,
      status: response.status,
      contentType,
      body,
      chain,
    };
  }

  return {
    requestedUrl: url,
    finalUrl: currentUrl,
    status: 0,
    contentType: "",
    body: "",
    chain,
    error: `Redirect chain exceeded ${maxRedirects}`,
  };
}

function analyzeHtml(result) {
  const html = result.body ?? "";
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonical = firstMatch(html, /<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || firstMatch(html, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i);
  const robots = firstMatch(html, /<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const h1s = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(stripTags);
  const rootEmpty = /<div\s+id=["']root["']\s*>\s*<\/div>/i.test(html);
  const bodyText = stripTags(firstMatch(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i) || html);
  const meaningfulTextLength = bodyText.length;
  const soft404Signals = [
    /page not found/i.test(bodyText),
    /\b404\b/i.test(title),
    /\b404\b/i.test(h1s.join(" ")),
    result.status === 200 && /not found|doesn'?t exist|has been moved/i.test(bodyText),
  ].filter(Boolean).length;

  return {
    title,
    titleLength: title.length,
    canonical,
    robots,
    h1Count: h1s.length,
    h1Text: h1s.join(" | "),
    rootEmpty,
    meaningfulTextLength,
    hasSubstantialBody: meaningfulTextLength >= 1200,
    soft404Likely: result.status === 200 && soft404Signals >= 2,
    noindex: /noindex/i.test(robots),
  };
}

function buildFlags(row) {
  const issueFlags = [];
  const warningFlags = [];
  const isHtml = row.contentKind === "html";

  if (row.status !== 200) issueFlags.push(`status_${row.status}`);
  if (row.redirectCount > 0) warningFlags.push(`redirect_${row.redirectCount}`);
  if (row.redirectCount > 1) issueFlags.push("redirect_chain");

  if (!isHtml) {
    return { issueFlags, warningFlags, flags: [...issueFlags, ...warningFlags] };
  }

  if (row.soft404Likely) issueFlags.push("soft_404");
  if (!row.title) warningFlags.push("missing_title");
  if (row.titleDuplicate) warningFlags.push("duplicate_title");
  if (row.h1Count === 0) issueFlags.push("missing_h1");
  if (row.h1Count > 1) warningFlags.push("multiple_h1");
  if (!row.canonical) warningFlags.push("missing_canonical");
  if (isMalformedCanonical(row.canonical)) issueFlags.push("malformed_canonical");
  if (row.canonical && row.status === 200 && row.canonical.replace(/\/$/, "") !== row.finalUrl.replace(/\/$/, "")) {
    warningFlags.push("canonical_not_final_url");
  }
  if (row.noindex) issueFlags.push("noindex");
  if (row.rootEmpty) issueFlags.push("empty_root");
  if (!row.hasSubstantialBody) warningFlags.push("thin_raw_html");

  return { issueFlags, warningFlags, flags: [...issueFlags, ...warningFlags] };
}

const sitemapResponse = await requestWithRedirects(sitemapUrl);
if (sitemapResponse.status !== 200) {
  throw new Error(`Sitemap returned ${sitemapResponse.status}: ${sitemapUrl}`);
}

const urls = [...sitemapResponse.body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => decodeEntities(match[1].trim()));
if (!urls.length) throw new Error(`No <loc> URLs found in ${sitemapUrl}`);

console.log(`Auditing ${urls.length} sitemap URLs from ${sitemapUrl}`);

const rows = [];
for (const [index, url] of urls.entries()) {
  try {
    const result = await requestWithRedirects(url);
    const contentKind = contentKindFor(url, result);
    const html = contentKind === "html" ? analyzeHtml(result) : {};
    rows.push({
      index: index + 1,
      requestedUrl: url,
      status: result.status,
      finalUrl: result.finalUrl,
      redirectCount: Math.max(0, result.chain.length - 1),
      redirectChain: result.chain.map((item) => `${item.status}:${item.url}`).join(" -> "),
      contentKind,
      contentType: result.contentType,
      error: result.error ?? "",
      ...html,
    });
  } catch (error) {
    rows.push({
      index: index + 1,
      requestedUrl: url,
      status: 0,
      finalUrl: "",
      redirectCount: 0,
      redirectChain: "",
      contentKind: "error",
      contentType: "",
      error: error.message,
    });
  }
  if ((index + 1) % 25 === 0 || index + 1 === urls.length) console.log(`Checked ${index + 1}/${urls.length}`);
}

const titleCounts = new Map();
for (const row of rows) {
  if (row.title) titleCounts.set(row.title, (titleCounts.get(row.title) ?? 0) + 1);
}

for (const row of rows) {
  row.titleDuplicate = row.title ? titleCounts.get(row.title) > 1 : false;
  const { issueFlags, warningFlags, flags } = buildFlags(row);
  row.issueFlags = issueFlags;
  row.warningFlags = warningFlags;
  row.flags = flags;
}

await mkdir(outputDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = resolve(outputDir, `sitemap-audit-${stamp}.json`);
const csvPath = resolve(outputDir, `sitemap-audit-${stamp}.csv`);
const summaryPath = resolve(outputDir, `sitemap-audit-${stamp}.md`);

const csvColumns = [
  "index",
  "requestedUrl",
  "status",
  "finalUrl",
  "redirectCount",
  "contentKind",
  "canonical",
  "title",
  "titleLength",
  "h1Count",
  "h1Text",
  "robots",
  "noindex",
  "rootEmpty",
  "hasSubstantialBody",
  "meaningfulTextLength",
  "soft404Likely",
  "titleDuplicate",
  "issueFlags",
  "warningFlags",
  "flags",
  "error",
];

const csv = [
  csvColumns.join(","),
  ...rows.map((row) => csvColumns.map((column) => {
    if (["issueFlags", "warningFlags", "flags"].includes(column)) return csvCell(row[column].join(";"));
    return csvCell(row[column]);
  }).join(",")),
].join("\n");

const issueRows = rows.filter((row) => row.issueFlags.length || row.error);
const warningRows = rows.filter((row) => !row.issueFlags.length && !row.error && row.warningFlags.length);
const flagged = rows.filter((row) => row.flags.length || row.error);
const summary = [
  "# Live Sitemap Audit",
  "",
  `Sitemap: ${sitemapUrl}`,
  `Run: ${new Date().toISOString()}`,
  `URLs checked: ${rows.length}`,
  `Production issues: ${issueRows.length}`,
  `Warnings: ${warningRows.length}`,
  `Total flagged rows: ${flagged.length}`,
  "",
  "## Production Issue Summary",
  "",
  ...Object.entries(
    issueRows.flatMap((row) => row.issueFlags).reduce((acc, flag) => {
      acc[flag] = (acc[flag] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .map(([flag, count]) => `- ${flag}: ${count}`),
  ...(issueRows.length ? [] : ["- None"]),
  "",
  "## Warning Summary",
  "",
  ...Object.entries(
    warningRows.flatMap((row) => row.warningFlags).reduce((acc, flag) => {
      acc[flag] = (acc[flag] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .map(([flag, count]) => `- ${flag}: ${count}`),
  ...(warningRows.length ? [] : ["- None"]),
  "",
  "## Production Issue URLs",
  "",
  ...issueRows.map((row) => `- ${row.requestedUrl} - ${(row.issueFlags.length ? row.issueFlags : [row.error]).join(", ")}`),
  ...(issueRows.length ? [] : ["- None"]),
  "",
  "## Warning URLs",
  "",
  ...warningRows.map((row) => `- ${row.requestedUrl} - ${row.warningFlags.join(", ")}`),
  ...(warningRows.length ? [] : ["- None"]),
  "",
].join("\n");

await writeFile(jsonPath, JSON.stringify({ sitemapUrl, generatedAt: new Date().toISOString(), rows }, null, 2));
await writeFile(csvPath, csv);
await writeFile(summaryPath, summary);

console.log(`JSON: ${jsonPath}`);
console.log(`CSV: ${csvPath}`);
console.log(`Summary: ${summaryPath}`);
console.log(`Production issues: ${issueRows.length}/${rows.length}`);
console.log(`Warnings: ${warningRows.length}/${rows.length}`);
console.log(`Flagged: ${flagged.length}/${rows.length}`);
if (issueRows.length) process.exitCode = 1;
