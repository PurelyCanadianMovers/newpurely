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

const badPhrases = [
  "Calgary's lower cost",
  "mountain proximity",
  "binding estimate",
  "binding estimates",
  "guaranteed pricing",
  "guaranteed final",
  "guaranteed price",
];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAll(regex, text) {
  const out = [];
  let match;
  while ((match = regex.exec(text))) out.push(match[1] || match[0]);
  return out;
}

function uniq(values) {
  return [...new Set(values)];
}

function pagePath(route) {
  return path.join(root, route.replace(/^\/|\/$/g, ""), "index.html");
}

for (const route of routes) {
  const file = pagePath(route);
  if (!fs.existsSync(file)) {
    console.log(JSON.stringify({ route, missing: true }));
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const text = stripTags(html);
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [null, ""])[1].trim();
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [null, ""])[1];
  const h1s = getAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, html).map(stripTags);
  const priceTokens = uniq(getAll(/\$[\d,]+(?:\+)?/g, text));
  const transits = uniq(getAll(/\b(?:overnight|\d+\s*-\s*\d+\s*days?)\b/gi, text).map((v) => v.replace(/\s+/g, " ")));
  const bad = {};
  for (const phrase of badPhrases) {
    const count = (text.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;
    if (count) bad[phrase] = count;
  }

  const montrealVancouverTokens = route === "/montreal-to-vancouver-movers/"
    ? {
        stalePresent: ["$3,000", "$5,300", "$7,000", "$11,000", "$16,000"].filter((v) => text.includes(v)),
        intendedPresent: ["$2,500", "$4,700", "$6,400", "$10,000", "$15,000"].filter((v) => text.includes(v)),
      }
    : undefined;

  console.log(JSON.stringify({
    route,
    title,
    canonical,
    h1Count: h1s.length,
    h1s,
    priceTokens: priceTokens.slice(0, 30),
    transits,
    bad,
    rootEmpty: /<div[^>]+id=["']root["'][^>]*>\s*<\/div>/i.test(html),
    pageNotFound: /page not found|404/i.test(text),
    montrealVancouverTokens,
  }));
}
