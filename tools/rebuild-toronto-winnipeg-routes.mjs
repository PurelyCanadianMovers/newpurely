import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] || "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const templateRoot = join(root, "vancouver-to-winnipeg-movers");
const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");

const routes = [
  {
    source: "vancouver-to-winnipeg-movers",
    slug: "toronto-to-winnipeg-movers",
    oldRoute: "Vancouver to Winnipeg",
    oldRouteDash: "Vancouver–Winnipeg",
    oldRouteSlug: "vancouver-to-winnipeg-movers",
    from: "Toronto",
    fromProvince: "ON",
    to: "Winnipeg",
    toProvince: "MB",
    distance: "2,225 km",
    transit: "4–12 days",
    transitHyphen: "4-12 days",
  },
  {
    source: "winnipeg-to-vancouver-movers",
    slug: "winnipeg-to-toronto-movers",
    oldRoute: "Winnipeg to Vancouver",
    oldRouteDash: "Winnipeg–Vancouver",
    oldRouteSlug: "winnipeg-to-vancouver-movers",
    from: "Winnipeg",
    fromProvince: "MB",
    to: "Toronto",
    toProvince: "ON",
    distance: "2,225 km",
    transit: "4–12 days",
    transitHyphen: "4-12 days",
  },
];

const prices = ["$2,400+", "$3,400+", "$5,500+", "$9,000+", "$13,000+"];
const cityHubs = {
  Toronto: "/toronto-long-distance-movers/",
};
const referenceCostGuideRoutes = [
  {
    slug: "vancouver-to-winnipeg-movers",
    from: "Vancouver",
    to: "Winnipeg",
    prices: ["$2,400", "$3,400", "$5,500", "$8,900", "$13,000"],
    distance: "2,300 km",
    transit: "5–13 days",
  },
  {
    slug: "winnipeg-to-vancouver-movers",
    from: "Winnipeg",
    to: "Vancouver",
    prices: ["$2,400", "$3,400", "$5,500", "$8,900", "$13,000"],
    distance: "2,300 km",
    transit: "5–13 days",
  },
];

const ROUTE_TYPOGRAPHY_STYLE = `<style id="pcm-route-typography-normalization">
  body.pcm-static-route-ready{font-family:"Source Sans 3",sans-serif;font-size:16px;line-height:1.6;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-static-main h1,body.pcm-static-route-ready .pcm-static-main h2,body.pcm-static-route-ready .pcm-static-main h3{font-family:"Playfair Display",serif;font-weight:700;line-height:1.2;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-static-main h1{font-size:36px;line-height:45px}
  body.pcm-static-route-ready .pcm-static-main h2{font-size:30px;line-height:36px}
  body.pcm-static-route-ready .pcm-static-main h3{font-size:18px;line-height:28px;margin-bottom:8px}
  body.pcm-static-route-ready .pcm-static-main p{font-family:"Source Sans 3",sans-serif;font-size:18px;line-height:29.25px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-static-main .pcm-card p{font-size:14px;line-height:22.75px}
  body.pcm-static-route-ready .pcm-static-main .pcm-kicker{font-family:"Source Sans 3",sans-serif;font-size:14px;font-weight:600;line-height:20px;letter-spacing:.7px}
  body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-label{font-family:"Source Sans 3",sans-serif;font-size:14px;font-weight:400;line-height:20px;letter-spacing:.7px}
  body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-value{font-family:"Source Sans 3",sans-serif;font-size:24px;font-weight:700;line-height:32px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-support{font-family:"Source Sans 3",sans-serif;font-size:14px;font-weight:400;line-height:20px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-top-estimate__intro h2{font-family:"Playfair Display",Georgia,serif;font-size:30px;font-weight:700;line-height:34.5px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-top-estimate__intro>p{font-family:"Source Sans 3",Arial,sans-serif;font-size:17px;line-height:25.5px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-top-estimate .pcm-kicker{font-family:"Source Sans 3",Arial,sans-serif;font-size:13px;font-weight:800;line-height:20.8px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-top-estimate label{font-family:"Source Sans 3",Arial,sans-serif;font-size:12px;line-height:20px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-route-cost h2,body.pcm-static-route-ready .pcm-closing-cta h2{font-family:"Playfair Display",Georgia,serif;font-size:30px;font-weight:700;line-height:36px;letter-spacing:normal}
  body.pcm-static-route-ready .pcm-closing-cta p{font-family:"Source Sans 3",sans-serif;font-size:18px;line-height:28px;letter-spacing:normal}
  @media(min-width:1024px){body.pcm-static-route-ready .pcm-static-main h1{font-size:48px;line-height:60px}}
  @media(max-width:520px){body.pcm-static-route-ready .pcm-top-estimate__intro h2{font-size:25px;line-height:28.75px}}
</style>`;

function replaceAllLiteral(value, search, replacement) {
  if (!value.includes(search)) throw new Error(`Expected template text not found: ${search}`);
  return value.split(search).join(replacement);
}

function normalizeRouteTypography(html) {
  const stylePattern = /<style id="pcm-route-typography-normalization">[\s\S]*?<\/style>/;
  if (stylePattern.test(html)) return html.replace(stylePattern, ROUTE_TYPOGRAPHY_STYLE);
  if (!html.includes("</head>")) throw new Error("Route template head closing tag not found");
  return html.replace("</head>", `${ROUTE_TYPOGRAPHY_STYLE}</head>`);
}

function relatedLinks(route) {
  const oppositeSlug = route.slug === "toronto-to-winnipeg-movers"
    ? "winnipeg-to-toronto-movers"
    : "toronto-to-winnipeg-movers";
  const oppositeLabel = route.slug === "toronto-to-winnipeg-movers"
    ? "Winnipeg to Toronto Movers"
    : "Toronto to Winnipeg Movers";

  return [
    `<a href="${cityHubs.Toronto}">Toronto Long-Distance Movers</a>`,
    `<a href="/${oppositeSlug}/">${oppositeLabel}</a>`,
    `<a href="/long-distance/">Long-Distance Moving</a>`,
    `<a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a>`,
    `<a href="/packing/">Packing Services</a>`,
    `<a href="/storage/">Storage Options</a>`,
    `<a href="/contact/">Get a Written Estimate</a>`,
  ].join("\n");
}

function replaceRelatedLinks(html, route) {
  const pattern = /(<section class="pcm-section">\s*<h2>Related Destinations and Resources<\/h2>\s*<div class="pcm-links">)[\s\S]*?(<\/div>\s*<\/section>)/i;
  if (!pattern.test(html)) throw new Error(`${route.slug}: related resources section not found`);
  return html.replace(pattern, (_, start, end) => `${start}\n${relatedLinks(route)}\n        ${end}`);
}

function transformRoute(template, route) {
  const routeName = `${route.from} to ${route.to}`;
  const routeDash = `${route.from}–${route.to}`;
  const routeSlug = `${route.from.toLowerCase()}-to-${route.to.toLowerCase()}-movers`;
  let html = template;

  html = replaceAllLiteral(html, route.oldRoute, routeName);
  html = replaceAllLiteral(html, route.oldRouteDash, routeDash);
  html = replaceAllLiteral(html, route.oldRouteSlug, routeSlug);

  const oldFrom = route.source.startsWith("vancouver") ? "Vancouver" : "Winnipeg";
  const oldFromProvince = route.source.startsWith("vancouver") ? "BC" : "MB";
  const oldTo = route.source.startsWith("vancouver") ? "Winnipeg" : "Vancouver";
  const oldToProvince = route.source.startsWith("vancouver") ? "MB" : "BC";
  html = html.replaceAll(`${oldFrom}, ${oldFromProvince}`, `${route.from}, ${route.fromProvince}`);
  html = html.replaceAll(`${oldTo}, ${oldToProvince}`, `${route.to}, ${route.toProvince}`);
  html = html.replaceAll(`${oldFrom}-to-${oldTo}`, `${route.from}-to-${route.to}`);
  html = html.replaceAll(`${oldFrom} ${oldTo} moving company`, `${route.from} ${route.to} moving company`);
  html = html.replaceAll(`${oldTo} and ${oldFrom}`, `${route.to} and ${route.from}`);
  html = html.replaceAll(`${oldFrom} and ${oldTo}`, `${route.from} and ${route.to}`);
  html = html.replaceAll(`Tips for Moving to ${oldTo}`, `Tips for Moving to ${route.to}`);
  html = html.replaceAll(`${oldTo} Long-Distance Movers`, `${route.to} Long-Distance Movers`);
  html = html.replaceAll(`${oldTo} movers`, `${route.to} movers`);
  html = html.replaceAll(`${oldTo.toUpperCase()} MOVERS`, `${route.to.toUpperCase()} MOVERS`);
  html = html.replaceAll(`${oldFrom.toUpperCase()} TO ${oldTo.toUpperCase()}`, `${route.from.toUpperCase()} TO ${route.to.toUpperCase()}`);
  html = html.replaceAll("2,300 km", route.distance);
  html = html.replaceAll("5–13 days", route.transit);
  html = html.replaceAll("5-13 days", route.transitHyphen);
  html = html.replaceAll("5–13", route.transit.replace(/ days$/, ""));
  html = html.replaceAll("5-13", route.transitHyphen.replace(/ days$/, ""));
  html = html.replaceAll("$8,900+", "$9,000+");
  html = html.replaceAll("$8,900", "$9,000");
  html = html.replaceAll("FREE MOVING ESTIMATE", "FREE MOVING ESTIMATE");
  html = html.replaceAll("Free moving estimate", "FREE MOVING ESTIMATE");

  if (route.slug === "winnipeg-to-toronto-movers") {
    html = html.replaceAll("TORONTO TO VANCOUVER MOVERS", "WINNIPEG TO TORONTO MOVERS");
  }

  html = html.replaceAll("/vancouver-long-distance-movers/", cityHubs.Toronto);
  html = html.replaceAll(">Vancouver movers<", ">Toronto movers<");
  html = html.replaceAll("/winnipeg-long-distance-movers/", `/${routeSlug}/`);
  html = html.replaceAll(">Winnipeg movers<", `>${routeName} movers<`);

  html = replaceRelatedLinks(html, route);
  html = normalizeRouteTypography(html);
  html = html.replaceAll(
    `<link rel="canonical" href="${siteOrigin}/${route.oldRouteSlug}/">`,
    `<link rel="canonical" href="${siteOrigin}/${routeSlug}/">`,
  );
  html = html.replaceAll(
    `${siteOrigin}/${route.oldRouteSlug}/`,
    `${siteOrigin}/${routeSlug}/`,
  );

  const required = [
    `<h1>${routeName} Movers</h1>`,
    `<h2>Get a ${routeName} quote.</h2>`,
    `name="from" value="${route.from}, ${route.fromProvince}"`,
    `name="to" value="${route.to}, ${route.toProvince}"`,
    `${route.from.toUpperCase()} TO ${route.to.toUpperCase()} MOVING COST`,
    route.distance,
    route.transit,
    ...prices,
  ];
  for (const marker of required) {
    if (!html.includes(marker)) throw new Error(`${route.slug}: generated page missing ${marker}`);
  }
  if ((html.match(/<h1\b/gi) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one H1`);
  if ((html.match(/class="[^"]*\bpcm-route-cost\b/g) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one pricing block`);
  if (html.includes("5–13") || html.includes("5-13")) throw new Error(`${route.slug}: stale 5–13 transit value remains`);
  return html;
}

function costRow(route, alternate) {
  const classes = alternate ? "border-b border-gray-200 bg-gray-50 hover:bg-red-50" : "border-b border-gray-200 bg-white hover:bg-red-50";
  const label = `${route.from} → ${route.to}`;
  const prices = route.prices || ["$2,400", "$3,400", "$5,500", "$9,000", "$13,000"];
  return `<tr data-route="${route.slug}" class="${classes}"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${label}</td>${prices.slice(0, 4).map((price) => `<td class="py-3 px-4 font-body text-gray-700">${price}</td>`).join("")}<td class="py-3 px-4 font-body text-[#CC1A1A] font-semibold">${prices[4]}</td></tr>`;
}

function popularRow(route, alternate) {
  const classes = alternate ? "border-b border-gray-200 bg-gray-50 hover:bg-red-50" : "border-b border-gray-200 bg-white hover:bg-red-50";
  const label = `${route.from} → ${route.to}`;
  const buttonClass = "inline-flex items-center justify-center whitespace-nowrap text-sm h-8 rounded-md gap-1.5 px-3 bg-[#CC1A1A] text-white font-body font-semibold";
  return `<tr data-route="${route.slug}" class="${classes}"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${label}</td><td class="py-3 px-4 font-body text-gray-700">${route.distance || "2,225 km"}</td><td class="py-3 px-4 font-body text-gray-700">${route.transit || "4–12 days"}</td><td class="py-3 px-4 text-right"><a href="/${route.slug}/" class="${buttonClass}">Get a Quote</a></td></tr>`;
}

function insertRowsIntoTable(html, heading, rows) {
  const headingIndex = html.indexOf(`>${heading}</h2>`);
  if (headingIndex < 0) throw new Error(`Cost guide heading not found: ${heading}`);
  let tableStart = html.indexOf("<table", headingIndex);
  let tableEnd = -1;
  let table = "";
  let bodyEnd = -1;
  while (tableStart >= 0) {
    tableEnd = html.indexOf("</table>", tableStart);
    if (tableEnd < 0) break;
    table = html.slice(tableStart, tableEnd + "</table>".length);
    bodyEnd = table.lastIndexOf("</tbody>");
    if (bodyEnd >= 0) break;
    tableStart = html.indexOf("<table", tableEnd + "</table>".length);
  }
  if (tableStart < 0 || tableEnd < 0 || bodyEnd < 0) throw new Error(`Cost guide table body not found after: ${heading}`);
  const missing = rows.filter((row) => !table.includes(`data-route="${row.slug}"`) && !table.includes(`>${row.from} → ${row.to}<`));
  if (!missing.length) return html;
  const updated = `${table.slice(0, bodyEnd)}${missing.map((row, index) => row.render(index % 2 === 0)).join("")}${table.slice(bodyEnd)}`;
  return html.slice(0, tableStart) + updated + html.slice(tableEnd + "</table>".length);
}

function updateCostGuide() {
  return (async () => {
    let html = await readFile(costGuidePath, "utf8");
    const costGuideRoutes = [...referenceCostGuideRoutes, ...routes];
    const pricingRoutes = costGuideRoutes.map((route) => ({ ...route, render: (alternate) => costRow(route, alternate) }));
    const popularRoutes = costGuideRoutes.map((route) => ({ ...route, render: (alternate) => popularRow(route, alternate) }));
    html = insertRowsIntoTable(html, "Long-Distance Moving Costs by Route", pricingRoutes);
    html = insertRowsIntoTable(html, "Popular Moving Routes in Canada", popularRoutes);
    html = html.replace(/Estimated pricing for \d+ popular Canadian routes\./, "Estimated pricing for 44 popular Canadian routes.");
    await writeFile(costGuidePath, html, "utf8");
  })();
}

for (const route of routes) {
  const template = await readFile(join(root, route.source, "index.html"), "utf8");
  const output = transformRoute(template, route);
  const outputDir = join(root, route.slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "index.html"), output, "utf8");
  console.log(`Rebuilt /${route.slug}/ from the current static route template`);
}

await updateCostGuide();
console.log("Updated long-distance cost-guide route tables");
