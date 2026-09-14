const fs = require("fs");
const path = require("path");

const root = process.argv[2] || "outputs/prerender-route-audit-final";
const routes = [
  "/montreal-to-vancouver-movers/",
  "/toronto-to-vancouver-movers/",
  "/vancouver-to-toronto-movers/",
  "/vancouver-to-calgary-movers/",
  "/calgary-to-vancouver-movers/",
  "/montreal-to-calgary-movers/",
  "/vancouver-to-halifax-movers/",
];

function hasBadRouteCopy(route, html) {
  const unsupportedClaim =
    /binding estimates?|guaranteed pricing|guaranteed final|guaranteed long-distance/i.test(
      html,
    );
  const calgarySpecificCopyOnOtherRoute =
    !route.includes("calgary") &&
    /Calgary's lower cost|mountain proximity/i.test(html);

  return unsupportedClaim || calgarySpecificCopyOnOtherRoute;
}

for (const route of routes) {
  const html = fs.readFileSync(path.join(root, route, "index.html"), "utf8");
  const prices = [
    ...new Set([...html.matchAll(/\$[\d,]+\+?/g)].map((match) => match[0])),
  ].slice(0, 10);
  const transit = [
    ...new Set(
      [...html.matchAll(/\b\d{1,2}\s*-\s*\d{1,2}\s*days\b|overnight/gi)].map(
        (match) => match[0],
      ),
    ),
  ];
  const canonical =
    (html.match(/rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [])[1] ||
    "";
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) =>
    match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  const staleMontrealVancouver =
    route === "/montreal-to-vancouver-movers/" &&
    /\$5,300\+?|\$7,000\+?|\$11,000\+?|\$16,000\+?/.test(html);

  console.log(
    [
      route,
      `h1=${h1s.length}: ${h1s[0] || ""}`,
      `canonSelf=${canonical === `https://purelycanadianmovers.com${route}`}`,
      `prices=${prices.join(",")}`,
      `transit=${transit.join(",")}`,
      `bad=${hasBadRouteCopy(route, html)}`,
      `oldMtlVan=${staleMontrealVancouver}`,
    ].join(" | "),
  );
}
