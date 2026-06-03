import { execFile } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = process.argv[2] ?? "site-copy";
const baseUrl = process.argv[3] ?? "http://localhost:4175";
const outFile = process.argv[4] ?? "LOCAL_SEO_AUDIT.md";
const edgePath =
  process.env.EDGE_PATH ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const serviceWords = [
  "moving",
  "movers",
  "storage",
  "packing",
  "office",
  "long-distance",
  "local",
  "cross-country",
  "overseas",
];
const geoWords = [
  "vancouver",
  "coquitlam",
  "surrey",
  "burnaby",
  "langley",
  "richmond",
  "toronto",
  "calgary",
  "edmonton",
  "montreal",
  "ottawa",
  "victoria",
  "halifax",
  "canada",
  "bc",
  "british columbia",
];
const trustWords = [
  "since 1991",
  "bbb",
  "no subcontractors",
  "family-owned",
  "insured",
  "great canadian",
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (entry.name === "index.html") files.push(path);
  }
  return files;
}

function routeFromFile(file) {
  const rel = relative(root, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/\/index\.html$/, "/")}`;
}

function strip(html) {
  let body = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  body = body.replace(/<style[\s\S]*?<\/style>/gi, " ");
  body = body.replace(/<[^>]+>/g, " ");
  return decodeEntities(body).replace(/\s+/g, " ").trim();
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function matchFirst(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeEntities(match[1].trim()) : "";
}

function matchAll(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => strip(match[1]));
}

function hasAny(text, words) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function scorePage(page) {
  let score = 100;
  const issues = [];
  const opportunities = [];
  const titleLower = page.title.toLowerCase();
  const h1Lower = page.h1.toLowerCase();
  const metaLower = page.description.toLowerCase();
  const bodyLower = page.text.toLowerCase();

  if (!page.title) {
    score -= 12;
    issues.push("Missing title tag.");
  } else {
    if (page.title.length < 35) {
      score -= 4;
      opportunities.push("Title is short; add service + location intent.");
    }
    if (page.title.length > 65) {
      score -= 4;
      opportunities.push("Title may be too long for search snippets.");
    }
    if ((page.title.match(/Purely Canadian Movers/g) ?? []).length > 1) {
      score -= 4;
      issues.push("Title repeats the brand.");
    }
  }

  if (!page.description) {
    score -= 10;
    issues.push("Missing meta description.");
  } else {
    if (page.description.length < 90) {
      score -= 4;
      opportunities.push("Meta description is short; add service area, trust signal, and CTA.");
    }
    if (page.description.length > 165) {
      score -= 3;
      opportunities.push("Meta description may truncate.");
    }
  }

  if (!page.h1) {
    score -= 12;
    issues.push("Missing visible H1.");
  }
  if (!hasAny(`${page.title} ${page.h1} ${page.description}`, serviceWords)) {
    score -= 7;
    issues.push("Primary service intent is weak in title/H1/meta.");
  }
  if (!hasAny(`${page.title} ${page.h1} ${page.description}`, geoWords)) {
    score -= 7;
    issues.push("Local/geographic intent is weak in title/H1/meta.");
  }
  if (!hasAny(bodyLower, trustWords)) {
    score -= 5;
    opportunities.push("Add trust proof: BBB, since 1991, no subcontractors, insured, or GCVL agent.");
  }
  if (!bodyLower.includes("1-877-485-6683") && !bodyLower.includes("604-522-7222")) {
    score -= 4;
    opportunities.push("Add prominent phone/NAP details on the page body.");
  }
  if (!bodyLower.includes("quote") && !bodyLower.includes("estimate")) {
    score -= 4;
    opportunities.push("Add a quote/estimate CTA in page content.");
  }
  if (!page.schemaTypes.includes("Service")) {
    score -= 4;
    opportunities.push("Add page-specific Service schema.");
  }
  if (page.h2s.length < 3 && !page.route.includes("/admin/")) {
    score -= 4;
    opportunities.push("Add more H2 sections covering cost, process, service area, FAQs, and trust.");
  }
  if (!bodyLower.includes("frequently asked questions") && !bodyLower.includes("faq")) {
    score -= 3;
    opportunities.push("Add local SEO FAQs and FAQPage schema.");
  }
  if (page.text.length < 1200 && !page.route.includes("/admin/")) {
    score -= 5;
    opportunities.push("Page content is thin for local SEO; expand with route/service specifics.");
  }

  if (/\/(admin|404)\//.test(page.route)) {
    score = Math.min(score, 50);
    opportunities.push("Consider noindex for utility/admin/error routes.");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    opportunities,
  };
}

async function render(route) {
  const url = `${baseUrl}${route}`;
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    `--user-data-dir=${process.env.TEMP ?? "."}\\codex-local-seo-audit`,
    "--virtual-time-budget=3500",
    "--dump-dom",
    url,
  ];
  let stdout;
  try {
    ({ stdout } = await execFileAsync(edgePath, args, { maxBuffer: 20 * 1024 * 1024 }));
  } catch (error) {
    if (!error.stdout) throw error;
    stdout = error.stdout;
  }
  if (!stdout.includes("<html") && !stdout.includes("<!DOCTYPE")) {
    throw new Error(stdout.slice(0, 500) || "No HTML returned");
  }
  return stdout;
}

function parse(route, html) {
  const title = matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = matchFirst(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
  );
  const canonical = matchFirst(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i,
  );
  const h1 = matchFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2s = matchAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).slice(0, 8);
  const schemaTypes = [
    ...html.matchAll(/"@type"\s*:\s*(?:"([^"]+)"|\[([^\]]+)\])/g),
  ]
    .flatMap((match) => (match[1] ? [match[1]] : [...match[2].matchAll(/"([^"]+)"/g)].map((m) => m[1])))
    .filter(Boolean);
  const text = strip(html);
  const scored = scorePage({ route, title, description, canonical, h1, h2s, schemaTypes, text });
  return { route, title, description, canonical, h1, h2s, schemaTypes, text, ...scored };
}

function category(route) {
  if (route.includes("admin") || route.includes("404")) return "Utility";
  if (route.includes("blog") || route.includes("guide")) return "Content";
  if (route.includes("office")) return "Office";
  if (route.includes("packing")) return "Packing";
  if (route.includes("storage")) return "Storage";
  if (route.includes("local") || /\/(vancouver|coquitlam|surrey|burnaby|langley|richmond|delta|white-rock|north-vancouver|new-westminster|port-coquitlam|port-moody|maple-ridge|pitt-meadows|abbotsford)\//.test(route)) return "Local";
  if (route.includes("long-distance") || route.includes("-to-") || route.includes("movers-")) return "Long-distance";
  return "Core";
}

function md(page) {
  const allItems = [...page.issues, ...page.opportunities];
  const topItems = allItems.slice(0, 5);
  return [
    `### ${page.route}`,
    `- Score: ${page.score}/100`,
    `- Category: ${category(page.route)}`,
    `- Title: ${page.title || "(missing)"}`,
    `- H1: ${page.h1 || "(missing)"}`,
    `- Schema: ${[...new Set(page.schemaTypes)].join(", ") || "(none)"}`,
    `- Top opportunities: ${topItems.length ? topItems.join(" ") : "Looks solid; monitor rankings and conversions."}`,
  ].join("\n");
}

const files = await walk(root);
const routes = [...new Set(files.map(routeFromFile))]
  .filter((route) => !route.includes("/assets/") && !route.includes("/external/"))
  .sort();

const pages = [];
for (const [index, route] of routes.entries()) {
  console.log(`${index + 1}/${routes.length} ${route}`);
  try {
    pages.push(parse(route, await render(route)));
  } catch (error) {
    pages.push({
      route,
      title: "",
      description: "",
      canonical: "",
      h1: "",
      h2s: [],
      schemaTypes: [],
      text: "",
      score: 0,
      issues: [`Render failed: ${error.message}`],
      opportunities: ["Verify this route manually."],
    });
  }
}

const byCategory = new Map();
for (const page of pages) {
  const key = category(page.route);
  if (!byCategory.has(key)) byCategory.set(key, []);
  byCategory.get(key).push(page);
}

const avg = Math.round(pages.reduce((sum, page) => sum + page.score, 0) / pages.length);
const top = pages
  .slice()
  .sort((a, b) => a.score - b.score)
  .slice(0, 20);

const report = [
  "# Local SEO Audit",
  "",
  `Audited ${pages.length} rendered routes from ${baseUrl}.`,
  `Average local SEO score: ${avg}/100.`,
  "",
  "## Highest Priority Pages",
  "",
  ...top.map((page) => `- ${page.route} (${page.score}/100): ${[...page.issues, ...page.opportunities].slice(0, 2).join(" ")}`),
  "",
  "## Global Opportunities",
  "",
  "- Remove duplicate brand text in title tags where it appears.",
  "- Keep city + service intent in every title, H1, and meta description.",
  "- Add FAQPage schema to service, route, and cost-guide pages with visible matching FAQs.",
  "- Add route or city-specific proof: estimated cost, transit time, access notes, building/elevator considerations, and nearby service areas.",
  "- Add stronger E-E-A-T signals on each money page: since 1991, BBB, no subcontractors, Great Canadian Van Lines agent, insured/valuation coverage.",
  "- Add BreadcrumbList schema and consistent internal links between service, city, route, cost, packing, storage, and quote pages.",
  "- Consider noindexing admin/login/admin/blog and other utility pages.",
  "",
  "## Page-by-Page Notes",
  "",
  ...[...byCategory.entries()].flatMap(([key, categoryPages]) => [
    `## ${key}`,
    "",
    ...categoryPages.sort((a, b) => a.route.localeCompare(b.route)).map(md),
    "",
  ]),
].join("\n");

await writeFile(outFile, report);
console.log(`wrote ${outFile}`);
