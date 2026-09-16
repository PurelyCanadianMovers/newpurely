import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const route = "/montreal-to-edmonton-movers/";
const template = resolve("tools/templates/montreal-calgary-static-routes/montreal-to-calgary-movers.html");
const facts = Object.freeze({
  distance: "approximately 3,500 km",
  distanceShort: "~3,500 km",
  transit: "7–19 days",
  range: "$2,500–$15,000+",
  prices: ["$2,500+", "$4,700+", "$6,300+", "$10,000+", "$15,000+"],
});
const title = "Montreal to Edmonton Movers | Purely Canadian Movers";
const description = "Plan a Montreal to Edmonton long-distance move with route-specific pricing, approximately 3,500 km distance, 7–19 day transit guidance, packing, storage, and written estimates.";
const faqs = [
  ["How long does it take to move from Montreal to Edmonton?", "A Montreal to Edmonton move typically takes 7–19 days for delivery, depending on shipment size, scheduling, consolidation, weather, and access at pickup and delivery."],
  ["How much does it cost to move from Montreal to Edmonton?", "Planning estimates are Studio $2,500+, 1-bedroom $4,700+, 2-bedroom $6,300+, 3-bedroom $10,000+, and 4+ bedroom $15,000+. Final pricing depends on weight or volume, access, packing, storage, season, and services."],
  ["How far is Montreal from Edmonton by road?", "The Montreal–Edmonton moving corridor is approximately 3,500 km by road. Exact routing can vary with pickup and delivery access, weather, and operating conditions."],
  ["Do you also move from Edmonton to Montreal?", "Yes. Purely Canadian Movers coordinates this interprovincial long-distance route in both directions."],
  ["What should I plan for at my Montreal pickup?", "Confirm parking, loading access, stairs, and elevator reservations early. Dense streets and apartment access can affect crew timing and the written estimate."],
  ["What should I plan for at my Edmonton delivery?", "Confirm loading access, elevator bookings, parking, and weather-sensitive delivery details before the shipment is scheduled."],
  ["What protection options are available?", "Ask the moving consultant about Declared Value Protection options and review the selected protection, inventory, access, and services in the written estimate before booking."],
  ["Can I get a written estimate for my Montreal to Edmonton move?", "Yes. Written estimates are based on inventory, both addresses, access conditions, packing or storage needs, protection choices, and the preferred moving date."],
];

const esc = (value) => value.replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
const faqHtml = faqs.map(([q, a]) => `<article class="pcm-card"><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("");
const faqSchema = `<script type="application/ld+json" id="pcm-step07-faq-schema">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) })}</script>`;

function swapDirection(html) {
  return html.replace(/Montreal/g, "\u0001").replace(/Calgary/g, "Montreal").replace(/\u0001/g, "Calgary")
    .replace(/montreal/g, "\u0002").replace(/calgary/g, "montreal").replace(/\u0002/g, "calgary")
    .replace(/Quebec/g, "\u0003").replace(/Alberta/g, "Quebec").replace(/\u0003/g, "Alberta")
    .replace(/QUEBEC/g, "\u0004").replace(/ALBERTA/g, "Quebec").replace(/\u0004/g, "ALBERTA")
    .replace(/QC/g, "\u0005").replace(/AB/g, "QC").replace(/\u0005/g, "AB");
}

function replaceFaqSection(html) {
  const heading = html.search(/<h2[^>]*>Frequently Asked Questions<\/h2>/i);
  const start = html.lastIndexOf("<section", heading);
  const end = html.indexOf("</section>", heading);
  if (heading < 0 || start < 0 || end < 0) throw new Error("FAQ section not found");
  return html.slice(0, start) + `<section class="pcm-section pcm-route-faq-static pcm-step36-faq"><div class="container"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${faqHtml}</div></div></section>` + html.slice(end + 10);
}

let html = swapDirection(await readFile(template, "utf8"));
html = html.replace(/class="pcm-top-estimate-wrap"/i, `class="pcm-top-estimate-wrap pcm-lead-panel"`).replace(/<form class="pcm-estimate"/i, `<form class="pcm-estimate-form pcm-estimate"`);
html = html.replace(/<html lang="en">/i, `<html class="pcm-step36-montreal-calgary" lang="en">`).replace(/(<link rel="stylesheet" crossorigin="" href="\.\.\/assets\/index-DOGLBY_X\.css">)/i, `$1<link rel="stylesheet" href="/assets/step36-montreal-calgary.css">`);
html = html.replace(/Calgary/g, "Edmonton").replace(/calgary/g, "edmonton")
  .replace(/3,600 km/g, facts.distance).replace(/~3,600 km/g, facts.distanceShort)
  .replace(/3,400 km/g, facts.distance).replace(/~3,400 km/g, facts.distanceShort)
  .replace(/7–16 days/g, facts.transit).replace(/7-16 days/g, facts.transit)
  .replace(/\$2,800\+/g, "$2,500+").replace(/\$5,000\+/g, "$4,700+").replace(/\$6,800\+/g, "$6,300+")
  .replace(/\$2,800/g, "$2,500").replace(/\$5,000/g, "$4,700").replace(/\$6,800/g, "$6,300")
  .replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${esc(title)}">${esc(title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${esc(description)}">`)
  .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${esc(title)}">`)
  .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${esc(description)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="https://purelycanadianmovers.com${route}">`)
  .replace(/<link rel="canonical"[^>]+>/i, `<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com${route}">`)
  .replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${esc(title)}">`)
  .replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${esc(description)}">`)
  .replace(/<meta property="og:image:alt" content="[^"]*">/i, `<meta property="og:image:alt" content="Purely Canadian Movers truck for Montreal to Edmonton long-distance moving">`)
  .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?FAQPage[\s\S]*?<\/script>/i, faqSchema)
  .replace(/<script[^>]*src="\/assets\/step36-[^"]+\.js"[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<script[^>]*src="\/assets\/step36-[^"]+\.js"[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<script[^>]*type="module"[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<script[^>]*src="\.\.\/assets\/index-[^"]+\.js"[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<div class="pcm-step36-glance__grid">[\s\S]*?<\/div>\s*<\/div>/i, `<div class="pcm-step36-glance__grid"><div><b aria-hidden="true">↔</b><p><small>Distance</small><strong>${facts.distanceShort}</strong><em>Montreal to Edmonton</em></p></div><div><b aria-hidden="true">◷</b><p><small>Estimated transit time</small><strong>${facts.transit}</strong><em>Depending on shipment size and scheduling</em></p></div><div><b aria-hidden="true">$</b><p><small>Typical cost range</small><strong>${facts.range}</strong><em>Studio to 4+ bedroom home</em></p></div></div></div>`)
  .replace(/class="pcm-step36-montreal-calgary"/g, `class="pcm-step36-montreal-edmonton"`)
  .replace(/CALGARY TO MONTREAL MOVERS/g, "MONTREAL TO EDMONTON MOVERS")
  .replace(/CALGARY TO MONTREAL MOVING COST/g, "MONTREAL TO EDMONTON MOVING COST")
  .replace(/Edmonton–Montreal Route at a Glance/g, "Montreal–Edmonton Route at a Glance")
  .replace(/At roughly 3400 km/g, "At approximately 3,500 km")
  .replace(/Edmonton's humid summers and cold winters/g, "Edmonton's cold winters and changing prairie weather")
  .replace(/Moving from Quebec \(no provincial sales tax\) to Alberta \(13% HST\) will increase your cost of living on taxable goods and services\./g, "Moving from Quebec to Alberta can involve different provincial rules and household costs. Include travel, storage, access, and confirmed services in your planning.")
  .replace(/review RAMQ registration requirements/g, "review Alberta health-care registration requirements")
  .replace(/Edmonton neighbourhoods such as Downtown, Griffintown, the Plateau, Rosemont, and Outremont/g, "Edmonton neighbourhoods such as Downtown, Oliver, Strathcona, Westmount, and Windermere")
  .replace(/full-value protection options/gi, "Declared Value Protection options")
  .replace(/Montreal to Calgary/g, "Montreal to Edmonton").replace(/Montreal–Calgary/g, "Montreal–Edmonton")
  .replace(/Calgary's dry climate and rapid weather changes/g, "Edmonton's cold winters and changing prairie weather")
  .replace(/Confirm curb access, parking rules, loading areas, and building move-in requirements at your Calgary destination\./g, "Confirm curb access, parking rules, loading areas, and building move-in requirements at your Edmonton destination.")
  .replace(/Calgary neighbourhoods such as Downtown, Beltline, Mission, Kensington, and Bridgeland/g, "Edmonton neighbourhoods such as Downtown, Oliver, Strathcona, Westmount, and Windermere")
  .replace(/3,600/g, "3,500").replace(/3,400/g, "3,500")
  .replace(/\.pcm-local-seo/gi, "pcm-local-seo-retired")
  .replace(/step36-montreal-edmonton\.css/g, "step36-montreal-calgary.css")
  .replace(/class="pcm-step36-montreal-edmonton"/g, `class="pcm-step36-montreal-calgary pcm-step36-montreal-edmonton"`);

html = replaceFaqSection(html);
html = html.replace(/^[ \\t]+$/gm, "");

for (const value of [facts.distanceShort.replace("~", ""), facts.transit, ...facts.prices]) {
  if (!html.includes(value)) throw new Error(`Missing Montreal–Edmonton fact: ${value}`);
}
if (/index-CNBNs70h\.js|step36-[^"]+\.js|pcm-local-seo|undefined|Moving Cost Breakdown/i.test(html)) throw new Error("Forbidden Step 7 token remains");
await writeFile(join(root, "montreal-to-edmonton-movers", "index.html"), html, "utf8");
console.log(`Rebuilt static Montreal–Edmonton route: ${route}`);
