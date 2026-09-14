const fs = require("fs");
const path = require("path");

const root = process.argv[2] || "site-copy";
const issues = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name === "index.html") check(full);
  }
}

function routeFromFile(file) {
  const rel = path.relative(root, path.dirname(file)).replace(/\\/g, "/");
  return "/" + (rel === "." ? "" : rel + "/");
}

function isRoutePage(route) {
  return /^\/[a-z0-9]+(?:-[a-z0-9]+)*-to-[a-z0-9]+(?:-[a-z0-9]+)*-movers\/$/.test(route);
}

function extract(html, re) {
  const match = html.match(re);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function textContent(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function check(file) {
  const route = routeFromFile(file);
  if (!isRoutePage(route)) return;

  const html = fs.readFileSync(file, "utf8");
  const title = extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  );
  const bodyText = textContent(html);
  const [origin, destination] = route.slice(1, -1).replace(/-movers$/, "").split("-to-");
  const originName = origin.replace(/-/g, " ");
  const destinationName = destination.replace(/-/g, " ");
  const expectedCanonical = "https://purelycanadianmovers.com" + route;
  const routeIssues = [];

  if (/<div[^>]+id=["']root["'][^>]*>\s*<\/div>/i.test(html)) routeIssues.push("empty_root");
  if (/Page Not Found|>\s*404\s*</i.test(html)) routeIssues.push("soft_404");
  if (!title) routeIssues.push("missing_title");
  if (h1s.length !== 1) routeIssues.push(`h1_count_${h1s.length}`);
  if (!canonical) routeIssues.push("missing_canonical");
  if (canonical && canonical !== expectedCanonical) routeIssues.push(`canonical_${canonical}`);
  if (bodyText.length < 1500) routeIssues.push(`thin_raw_html_${bodyText.length}`);
  if (!new RegExp(originName, "i").test(`${title} ${h1s.join(" ")} ${bodyText}`)) routeIssues.push("missing_origin_name");
  if (!new RegExp(destinationName, "i").test(`${title} ${h1s.join(" ")} ${bodyText}`)) routeIssues.push("missing_destination_name");

  const badAlways = [
    /binding estimates?/i,
    /guaranteed pricing/i,
    /guaranteed final/i,
    /guaranteed long-distance/i,
  ];
  if (badAlways.some((re) => re.test(bodyText))) routeIssues.push("unsupported_price_guarantee_wording");

  if (!route.includes("calgary") && /Calgary's lower cost|mountain proximity/i.test(bodyText)) {
    routeIssues.push("calgary_copy_on_non_calgary_route");
  }

  if (routeIssues.length) issues.push({ route, issues: routeIssues });
}

walk(root);

console.log(`Route pages with issues: ${issues.length}`);
for (const item of issues) console.log(`${item.route} - ${item.issues.join(", ")}`);
process.exitCode = issues.length ? 1 : 0;
