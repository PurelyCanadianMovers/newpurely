import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";
import { montrealCalgaryFacts, montrealCalgaryRoutes } from "./montreal-calgary-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const routeUrls = Object.keys(montrealCalgaryRoutes);
assertAllowedPostProcessor("finalize-montreal-calgary-routes.mjs", routeUrls.map((route) => route.slice(1, -1)));
const styleTag = '    <link rel="stylesheet" href="/assets/step36-montreal-calgary.css" data-pcm-step36="montreal-calgary">';
const scriptTag = '    <script defer src="/assets/step36-montreal-calgary.js" data-pcm-step36="montreal-calgary"></script>';

const faq = [
  ["How long does it take to move from Montreal to Calgary?", "A Montreal to Calgary move typically takes 7–19 days. The delivery window depends on shipment size, scheduling, consolidation, weather, and access at pickup and delivery."],
  ["How much does it cost to move from Montreal to Calgary?", "Planning estimates are Studio $2,500+, 1-bedroom $4,700+, 2-bedroom $6,300+, 3-bedroom $10,000+, and 4+ bedroom $15,000+. Final pricing depends on weight or volume, access, packing, storage, season, and services."],
  ["How far is Montreal from Calgary by road?", "The Montreal–Calgary moving corridor is approximately 3,600 km by road. Exact routing can vary with pickup and delivery access, weather, and operating conditions."],
  ["Do you also move from Calgary to Montreal?", "Yes. Purely Canadian Movers coordinates this interprovincial long-distance route in both directions."],
  ["Can you help with packing for a Montreal to Calgary move?", "Yes. Full and partial packing, specialty packing, unpacking, and packing-material removal can be included in a written estimate."],
  ["What should I plan for at my Montreal pickup?", "Confirm parking, loading access, stairs, and elevator reservations early. Dense streets and apartment access can affect crew timing and the written estimate."],
  ["What should I plan for at my Calgary delivery?", "Confirm loading access and elevator bookings, and plan for rapid weather changes. Share access restrictions before the move so delivery can be scheduled realistically."],
  ["What protection options are available?", "Ask the moving consultant about Declared Value Protection options and review the selected protection, inventory, access, and services in the written estimate before booking."],
];

function esc(value) { return value.replace(/[&<>"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]); }
function faqSection() {
  return `<section data-pcm-route-faq-static="1" class="pcm-route-faq-static py-16 bg-gray-50"><div class="container max-w-3xl"><h2>Frequently Asked Questions</h2><div class="space-y-4">${faq.map(([q,a]) => `<article class="pcm-step36-faq-card bg-white border border-gray-200 rounded-lg p-6"><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}</div></div></section>`;
}
function faqSchema() {
  return `<script type="application/ld+json" id="pcm-step36-faq-schema">${JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))})}</script>`;
}
function glance(config) {
  return `<div class="pcm-step36-glance"><h3>Montreal–Calgary Route at a Glance</h3><div class="pcm-step36-glance__grid"><div><b>↔</b><p><small>Distance</small><strong>${montrealCalgaryFacts.distanceShort}</strong><em>${config.origin} to ${config.destination}</em></p></div><div><b>◷</b><p><small>Estimated transit time</small><strong>${montrealCalgaryFacts.transit}</strong><em>Depending on shipment size</em></p></div><div><b>$</b><p><small>Typical cost range</small><strong>${montrealCalgaryFacts.overallRange}</strong><em>Studio to 4+ bedroom home</em></p></div></div></div>`;
}
function setMeta(html, selector, value) {
  const escaped = esc(value);
  if (selector === "title") return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escaped}">${escaped}</title>`);
  const attr = selector.startsWith("og:") ? `property="${selector}"` : `name="${selector}"`;
  const re = new RegExp(`<meta\\s+${attr}\\s+content="[^"]*"\\s*\\/?>`, "i");
  return html.replace(re, `<meta ${attr} content="${escaped}">`);
}

function removeCalgaryLegacyGlance(html) {
  return html.replace(/\s*<section\b[^>]*>[\s\S]*?<\/section>/gi, (section) => {
    if (!/Calgary(?:–|&ndash;|-)Montreal Route at a Glance/i.test(section)) return section;
    if (/pcm-step36-glance/.test(section)) return section;
    return "";
  });
}

function ensureCalgaryCanonicalGlance(html, config) {
  if (html.includes('class="pcm-step36-glance"')) return html;
  return html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/gi, (section) => {
    if (!/Moving from Calgary to Montreal\?/i.test(section)) return section;
    return section.replace(/<\/div>\s*<\/section>$/i, `${glance(config)}</div></section>`);
  });
}

for (const [route, config] of Object.entries(montrealCalgaryRoutes)) {
  const file = join(root, route.slice(1), "index.html");
  let html = await readFile(file, "utf8");
  html = setMeta(html, "title", config.title);
  if (route === "/calgary-to-montreal-movers/") html = html.replace(/<title\b[^>]*>/i, "<title>");
  html = setMeta(html, "description", config.description);
  html = setMeta(html, "og:title", config.title);
  html = setMeta(html, "og:description", config.description);
  html = setMeta(html, "twitter:title", config.title);
  html = setMeta(html, "twitter:description", config.description);
  const canonical = `https://purelycanadianmovers.com${route}`;
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<link rel="canonical" id="canonical-tag" href="[^"]*"\s*\/?>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`)
    .replace(/(?:~|approximately |roughly )?3[,.][47]00 km/gi, montrealCalgaryFacts.distance)
    .replace(/\$6,400\+/g, "$6,300+")
    .replace(/valuation coverage options/gi, "Declared Value Protection options")
    .replace(/basic valuation coverage/gi, "basic carrier liability")
    .replace(/Is my shipment insured during/gi, "What protection is available during");

  if (route === "/calgary-to-montreal-movers/") {
    html = removeCalgaryLegacyGlance(html);
    html = ensureCalgaryCanonicalGlance(html, config);
  }

  if (route === "/montreal-to-calgary-movers/") {
    if (!html.includes('id="pcm-step36-faq-schema"')) {
      html = html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?"FAQPage"[\s\S]*?<\/script>\s*/gi, "");
      html = html.replace("</head>", `${faqSchema()}\n</head>`);
    }
    if (!html.includes('class="pcm-step36-faq-card')) {
      html = html.replace(/<section data-pcm-route-faq-static="1"[\s\S]*?<\/section>\s*(?=<\/body>)/i, "");
      html = html.replace("</body>", `${faqSection()}\n</body>`);
    }
    if (!html.includes('data-pcm-step36="montreal-calgary"')) html = html.replace("</head>", `${styleTag}\n${scriptTag}\n</head>`);
  } else if (!html.includes('data-pcm-step36="montreal-calgary"')) {
    html = html.replace("</head>", `${styleTag}\n${scriptTag}\n</head>`);
  }
  if ((html.match(/data-pcm-step36="montreal-calgary"/g) ?? []).length !== 2) throw new Error(`${route}: invalid Step 36 asset registration`);
  await writeFile(file, html, "utf8");
  console.log(`Finalized Step 36 route: ${route}`);
}
