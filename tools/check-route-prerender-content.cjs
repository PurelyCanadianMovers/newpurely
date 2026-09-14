const fs = require("fs");
const path = require("path");

const root = process.argv[2] || "site-copy";
const routes = [
  "/montreal-to-vancouver-movers/",
  "/toronto-to-vancouver-movers/",
  "/vancouver-to-toronto-movers/",
  "/vancouver-to-calgary-movers/",
  "/calgary-to-vancouver-movers/",
  "/montreal-to-calgary-movers/",
  "/vancouver-to-halifax-movers/",
];

const suspicious = [
  "Calgary's lower cost",
  "lower cost of living",
  "mountain proximity",
  "binding estimate",
  "binding estimates",
  "Binding estimate",
  "Binding estimates",
  "guaranteed pricing",
  "guaranteed final",
  "guaranteed price",
  "guaranteed long-distance",
];

function routeFile(route) {
  return path.join(root, route.replace(/^\/|\/$/g, ""), "index.html");
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function matches(html, pattern) {
  const source = pattern.source;
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  return [...html.matchAll(new RegExp(source, flags))].map((match) => stripTags(match[1] || match[0]));
}

function countNeedles(html) {
  const counts = {};
  for (const needle of suspicious) {
    const count = html.split(needle).length - 1;
    if (count) counts[needle] = count;
  }
  return counts;
}

const report = routes.map((route) => {
  const file = routeFile(route);
  const html = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  return {
    route,
    exists: Boolean(html),
    bytes: html.length,
    title: matches(html, /<title[^>]*>([\s\S]*?)<\/title>/i)[0] || null,
    canonical: (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1] || null,
    h1: matches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi),
    prices: [...new Set(matches(html, /\$[\d,]+(?:\+)?/g))],
    transit: [...new Set(matches(html, /\b\d{1,2}\s*-\s*\d{1,2}\s*days\b|overnight/gi))],
    suspicious: countNeedles(html),
    rootEmpty: /<div id=["']root["']>\s*<\/div>/i.test(html),
    pageNotFound: /Page Not Found|>\s*404\s*</i.test(html),
  };
});

console.log(JSON.stringify(report, null, 2));
