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

function htmlFor(route) {
  return fs.readFileSync(path.join(root, route, "index.html"), "utf8");
}

function text(html, re) {
  const match = html.match(re);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m[1] || m[0]);
}

for (const route of routes) {
  const file = path.join(root, route, "index.html");
  if (!fs.existsSync(file)) {
    console.log(JSON.stringify({ route, missing: true }));
    continue;
  }

  const html = htmlFor(route);
  const title = text(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonical = text(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((h) =>
    h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  );
  const prices = [...new Set(all(html, /\$[\d,]+(?:\+)?/g))];
  const transit = [...new Set(all(html, /\b\d{1,2}\s*-\s*\d{1,2}\s*days\b|overnight/gi))];
  const badPhrases = [
    "Calgary's lower cost",
    "lower cost of living",
    "mountain proximity",
    "binding estimate",
    "binding estimates",
    "guaranteed pricing",
    "guaranteed final",
    "guaranteed price",
    "guaranteed long-distance",
  ].filter((phrase) => html.toLowerCase().includes(phrase.toLowerCase()));
  const rootEmpty = /<div[^>]+id=["']root["'][^>]*>\s*<\/div>/i.test(html);
  const looks404 = /Page Not Found|>\s*404\s*</i.test(html);

  console.log(
    JSON.stringify({
      route,
      title,
      canonical,
      h1Count: h1s.length,
      h1s,
      prices,
      transit,
      badPhrases,
      rootEmpty,
      looks404,
      bytes: Buffer.byteLength(html),
    })
  );
}
