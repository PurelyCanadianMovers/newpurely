import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";

const root = resolve(process.argv[2] || "site-copy");
const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");

const routes = [
  {
    template: new URL("./templates/winnipeg-routes/toronto-to-winnipeg-movers.html", import.meta.url),
    slug: "toronto-to-winnipeg-movers",
    from: "Toronto",
    fromProvince: "ON",
    to: "Winnipeg",
    toProvince: "MB",
    distance: "2,225 km",
    transit: "4–12 days",
    prices: ["$2,400+", "$3,400+", "$5,500+", "$9,000+", "$13,000+"],
    overallRange: "$2,400–$13,000",
  },
  {
    template: new URL("./templates/winnipeg-routes/winnipeg-to-toronto-movers.html", import.meta.url),
    slug: "winnipeg-to-toronto-movers",
    from: "Winnipeg",
    fromProvince: "MB",
    to: "Toronto",
    toProvince: "ON",
    distance: "2,225 km",
    transit: "4–12 days",
    prices: ["$2,400+", "$3,400+", "$5,500+", "$9,000+", "$13,000+"],
    overallRange: "$2,400–$13,000",
  },
];
assertRouteOwnership("rebuild-toronto-winnipeg-routes.mjs", routes);

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

function transformRoute(template, route) {
  const routeName = `${route.from} to ${route.to}`;
  const requiredFields = ["slug", "from", "fromProvince", "to", "toProvince", "distance", "transit", "overallRange"];
  for (const field of requiredFields) if (!route[field]) throw new Error(`${route.slug || "Toronto-Winnipeg route"}: missing required fact field ${field}`);
  if (!Array.isArray(route.prices) || route.prices.length !== 5 || route.prices.some((price) => !price)) throw new Error(`${route.slug}: expected five authoritative prices`);

  const title = `${routeName} Movers | Cost, Transit Time & Estimate | Purely Canadian Movers`;
  const escapedTitle = title.replaceAll("&", "&amp;");
  let html = template
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapedTitle}">${escapedTitle}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/i, `$1${escapedTitle}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/i, `$1${escapedTitle}$2`);

  html = html
    .replace(
      '<link rel="stylesheet" href="/assets/static-chat.css">',
      '<link rel="stylesheet" href="/assets/static-chat.css">\n<link rel="stylesheet" href="/assets/step46-toronto-winnipeg.css">'
    )
    .replace(
      '<script defer src="/assets/static-nav.js"></script>',
      '<script defer src="/assets/static-nav.js"></script>\n<script defer src="/assets/step46-toronto-winnipeg.js"></script>'
    );

  const faqSection = html.match(/<section class="pcm-section">\s*<h2>Frequently Asked Questions<\/h2>([\s\S]*?)<\/section>/i)?.[1];
  if (!faqSection) throw new Error(`${route.slug}: visible FAQ section not found`);
  const faq = [...faqSection.matchAll(/<article\b[^>]*>\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/article>/gi)].map((match) => ({
    "@type": "Question",
    name: match[1].replace(/<[^>]+>/g, "").replaceAll("&amp;", "&").trim(),
    acceptedAnswer: { "@type": "Answer", text: match[2].replace(/<[^>]+>/g, "").replaceAll("&amp;", "&").trim() },
  }));
  if (!faq.length) throw new Error(`${route.slug}: no visible FAQ entries found`);
  const schema = `<script type="application/ld+json" id="faq-schema">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq })}</script>`;
  html = html.replace(/\s*<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?"FAQPage"[\s\S]*?<\/script>/gi, "");
  html = html.replace("</head>", `  ${schema}\n</head>`);

  const required = [
    `<h1>${routeName} Movers</h1>`,
    `<h2>Get a ${routeName} quote.</h2>`,
    `<link rel="canonical" href="https://purelycanadianmovers.com/${route.slug}/">`,
    `<meta property="og:url" content="https://purelycanadianmovers.com/${route.slug}/">`,
    `name="from" value="${route.from}, ${route.fromProvince}"`,
    `name="to" value="${route.to}, ${route.toProvince}"`,
    `${route.from.toUpperCase()} TO ${route.to.toUpperCase()} MOVING COST`,
    route.distance,
    route.transit,
    "Route at a Glance",
    "Related Destinations and Resources",
    route.overallRange,
    ...route.prices,
  ];
  for (const marker of required) {
    if (!html.includes(marker)) throw new Error(`${route.slug}: explicit template missing ${marker}`);
  }
  if ((html.match(/<h1\b/gi) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one H1`);
  if ((html.match(/class="[^"]*\bpcm-route-cost\b/g) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one pricing block`);
  if ((html.match(/"@type":"FAQPage"/g) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one FAQPage schema`);
  if (html.includes("undefined")) throw new Error(`${route.slug}: template contains undefined`);
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
  const template = await readFile(route.template, "utf8");
  const output = transformRoute(template, route);
  const outputDir = join(root, route.slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "index.html"), output, "utf8");
  console.log(`Rebuilt /${route.slug}/ from its explicit owned template`);
}

await updateCostGuide();
console.log("Updated long-distance cost-guide route tables");
