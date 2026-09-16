import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { montrealCalgaryFacts, montrealCalgaryRoutes } from "./montreal-calgary-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const templateRoot = resolve("tools/templates/montreal-calgary-static-routes");
const faq = [
  ["How long does it take to move from Montreal to Calgary?", "A Montreal to Calgary move typically takes 7–19 days for delivery, depending on shipment size, scheduling, consolidation, weather, and access at pickup and delivery."],
  ["How much does it cost to move from Montreal to Calgary?", "Planning estimates are Studio $2,500+, 1-bedroom $4,700+, 2-bedroom $6,300+, 3-bedroom $10,000+, and 4+ bedroom $15,000+. Final pricing depends on weight or volume, access, packing, storage, season, and services."],
  ["How far is Montreal from Calgary by road?", "The Montreal–Calgary moving corridor is approximately 3,600 km by road. Exact routing can vary with pickup and delivery access, weather, and operating conditions."],
  ["Do you also move from Calgary to Montreal?", "Yes. Purely Canadian Movers coordinates this interprovincial long-distance route in both directions."],
  ["What should I plan for at my Montreal pickup?", "Confirm parking, loading access, stairs, and elevator reservations early. Dense streets and apartment access can affect crew timing and the written estimate."],
  ["What should I plan for at my Calgary delivery?", "Confirm loading access, elevator bookings, parking, and weather-sensitive delivery details before the shipment is scheduled."],
  ["What protection options are available?", "Ask the moving consultant about Declared Value Protection options and review the selected protection, inventory, access, and services in the written estimate before booking."],
  ["Can I get a written estimate for my Montreal to Calgary move?", "Yes. Written estimates are based on inventory, both addresses, access conditions, packing or storage needs, protection choices, and the preferred moving date."],
];
const esc = (value) => value.replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
const faqHtml = () => faq.map(([q, a]) => `<article class="pcm-card"><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("");
const faqSchema = () => `<script type="application/ld+json" id="pcm-step06-faq-schema">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) })}</script>`;

function swapDirection(html) {
  return html.replace(/Montreal/g, "\\u0001").replace(/Calgary/g, "Montreal").replace(/\\u0001/g, "Calgary")
    .replace(/montreal/g, "\\u0002").replace(/calgary/g, "montreal").replace(/\\u0002/g, "calgary")
    .replace(/Quebec/g, "\\u0003").replace(/Alberta/g, "Quebec").replace(/\\u0003/g, "Alberta")
    .replace(/QUEBEC/g, "\\u0004").replace(/ALBERTA/g, "QUEBEC").replace(/\\u0004/g, "ALBERTA")
    .replace(/QC/g, "\\u0005").replace(/AB/g, "QC").replace(/\\u0005/g, "AB");
}


for (const [route, config] of Object.entries(montrealCalgaryRoutes)) {
  if (route !== "/montreal-to-calgary-movers/") continue;
  const template = await readFile(join(templateRoot, "montreal-to-calgary-movers.html"), "utf8");
  let html = template;
  html = html.replace(/<!-- STEP06_DIRECTIONAL_TEMPLATE_START -->[\s\S]*?<!-- STEP06_DIRECTIONAL_TEMPLATE_END -->/, "");
  html = swapDirection(html);
  html = html.replace(/class="pcm-top-estimate-wrap"/i, `class="pcm-top-estimate-wrap pcm-lead-panel"`);
  html = html.replace(/<title[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${esc(config.title)}">${esc(config.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${esc(config.description)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${esc(config.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${esc(config.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="https:\/\/purelycanadianmovers.com${route}">`)
    .replace(/<link rel="canonical"[^>]+>/i, `<link rel="canonical" id="canonical-tag" href="https:\/\/purelycanadianmovers.com${route}">`);
  html = html.replace(/<section[^>]*>\s*<h2[^>]*>Frequently Asked Questions<\/h2>[\s\S]*?<\/section>/i, `<section class="pcm-section pcm-route-faq-static pcm-step36-faq"><div class="container"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${faqHtml()}</div></div></section>`);
  html = html.replace(/<section data-loc="client\/src\/pages\/services\/MontrealToCalgaryMovers\.tsx:334"[\s\S]*?<\/section>/i, `<section class="pcm-section pcm-route-faq-static pcm-step36-faq"><div class="container"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${faqHtml()}</div></div></section>`);
  html = html.replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?FAQPage[\s\S]*?<\/script>/i, faqSchema());
  html = html.replace(/<script[^>]*src="\/assets\/step36-montreal-calgary\.js"[^>]*>\s*<\/script>/i, "");
  html = html.replace(/<link[^>]*href="\/assets\/step36-montreal-calgary\.css"[^>]*>/i, `<link rel="stylesheet" href="/assets/step36-montreal-calgary.css">`);
  html = html.replace(/<script[^>]*src="\/assets\/static-nav\.js"[^>]*>/i, `<script defer src="/assets/static-nav.js">`)
    .replace(/<script[^>]*src="\/assets\/static-chat\.js"[^>]*>/i, `<script defer src="/assets/static-chat.js">`);
  html = html.replace(/<html\b([^>]*)>/i, `<html class="pcm-step36-montreal-calgary"$1>`);
  html = html.replace(/<link[^>]*href="\/assets\/step36-calgary-montreal\.css"[^>]*>/i, `<link rel="stylesheet" href="/assets/step36-montreal-calgary.css">`);
  html = html.replace(/<script[^>]*src="\/assets\/step36-calgary-montreal\.js"[^>]*>[\s\S]*?<\/script>/i, "");
  html = html.replace(/CALGARY TO MONTREAL MOVERS/g, "MONTREAL TO CALGARY MOVERS")
    .replace(/Montreal to Montreal Movers/g, "Montreal to Calgary Movers")
    .replace(/Calgary–Montreal Route at a Glance/g, "Montreal–Calgary Route at a Glance")
    .replace(/At roughly 3400 km/g, "At approximately 3,600 km")
    .replace(/Calgary's humid summers and cold winters/g, "Calgary's dry climate and rapid weather changes")
    .replace(/Calgary requires a parking permit for moving trucks on city streets\./g, "Confirm curb access, parking rules, loading areas, and building move-in requirements at your Calgary destination.")
    .replace(/Moving from Quebec \(no provincial sales tax\) to Alberta \(13% HST\) will increase your cost of living on taxable goods and services\./g, "Moving from Quebec to Alberta can involve different provincial rules and household costs. Include travel, storage, access, and confirmed services in your planning.")
    .replace(/review RAMQ registration requirements/g, "review Alberta health-care registration requirements")
    .replace(/Calgary neighbourhoods such as Downtown, Griffintown, the Plateau, Rosemont, and Outremont/g, "Calgary neighbourhoods such as Downtown, Beltline, Mission, Kensington, and Bridgeland")
    .replace(/additional full-value protection options/g, "Declared Value Protection options");
  html = html.replace(/<div class="pcm-step36-glance__grid">[\s\S]*?<\/div>\s*<\/div>/i, `<div class="pcm-step36-glance__grid"><div><b aria-hidden="true">↔</b><p><small>Distance</small><strong>${montrealCalgaryFacts.distanceShort}</strong><em>Montreal to Calgary</em></p></div><div><b aria-hidden="true">◷</b><p><small>Estimated transit time</small><strong>${montrealCalgaryFacts.transit}</strong><em>Depending on shipment size and scheduling</em></p></div><div><b aria-hidden="true">$</b><p><small>Typical cost range</small><strong>${montrealCalgaryFacts.overallRange}</strong><em>Studio to 4+ bedroom home</em></p></div></div></div>`);
  html = html.replace(/<form class="pcm-estimate-form"[\s\S]*?<\/form>/i, "");
  html = html.replace(/<script[^>]*type="module"[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<script[^>]*src="\/assets\/step36-montreal-calgary\.js"[^>]*>[\s\S]*?<\/script>/gi, "");
  if (/index-CNBNs70h\\.js|step36-(?:montreal|calgary)-montreal\\.js|pcm-local-seo|undefined/i.test(html)) throw new Error(`${route}: forbidden dependency or token remains`);
  await writeFile(join(root, route.slice(1), "index.html"), html, "utf8");
  console.log(`Rebuilt static Montreal–Calgary route: ${route}`);
}
