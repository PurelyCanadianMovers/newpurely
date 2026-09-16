import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] || "site-copy";
const writer = "finalize-montreal-edmonton-routes.mjs";
const markerStart = "<!-- STEP62_MONTREAL_EDMONTON_START -->";
const markerEnd = "<!-- STEP62_MONTREAL_EDMONTON_END -->";
const inclusion = "These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible. ";
const routes = [

  { slug: "edmonton-to-montreal-movers", from: "Edmonton", fromProvince: "AB", to: "Montreal", toProvince: "QC", title: "Edmonton to Montreal Moving Cost | Movers, Prices & Transit Time | Purely Canadian Movers", description: "Edmonton to Montreal moving costs, transit times, packing and storage options from Purely Canadian Movers. Family-owned since 1991. Free estimates." },
];
assertAllowedPostProcessor(writer, routes.map(({ slug }) => slug));

function routeFaqs({ from, to, fromProvince, toProvince }) {
  const article = from === "Edmonton" ? "An" : "A";
  const corridor = `${from}–${to}`;
  return [
    [`How long does it take to move from ${from} to ${to}?`, `${article} ${from} to ${to} move typically takes 7–19 days for delivery, depending on shipment size, scheduling, route planning, weather, and access. We will give you a realistic delivery window when you book your move.`],
    [`How much does it cost to move from ${from} to ${to}?`, "Planning estimates are Studio $2,500+, 1-bedroom $4,700+, 2-bedroom $6,300+, 3-bedroom $10,000+, and 4+ bedroom $15,000+. Final pricing depends on weight or volume, access, packing, storage, season, and services."],
    [`How far is ${from} from ${to} by road?`, `The ${corridor} moving corridor is approximately 3,500 km by road. Exact routing can vary with pickup and delivery access, weather, and operating conditions.`],
    [`Do you move from ${to} to ${from} as well?`, `Yes. We coordinate moves in both directions, with the same documented process and Declared Value Protection options for ${from} to ${to} and ${to} to ${from} moves.`],
    ["Are you a direct carrier or do you use subcontractors?", "We do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, Declared Value Protection options, and no broker-style handoffs to unknown movers."],
    [`Do you provide packing services for ${article.toLowerCase()} ${corridor} move?`, "Yes. We offer full and partial packing, specialty packing for fragile items, unpacking, and packing-material removal. Packing can be included in your written estimate."],
    [`What Declared Value Protection is available for ${article.toLowerCase()} ${from} to ${to} move?`, "We explain the basic carrier protection and any additional Declared Value Protection options available for your shipment before your move date."],
    [`What is the best time of year to move from ${from} to ${to}?`, `Late spring and early fall can provide milder conditions, but scheduling, shipment size, and weather all affect the plan. Winter moves on the ${corridor} corridor should allow flexibility for severe weather.`],
    [`Can I get a written estimate for my ${from} to ${to} move?`, "Yes. We provide written estimates based on an in-home or virtual inventory assessment, with the expected price range and included services documented before moving day."],
    [`Do you offer storage if my ${to} home is not ready?`, `Yes. Short- and long-term storage can be coordinated if your ${to} home is not ready when your shipment arrives.`],
    [`What provincial records should I review when moving from ${fromProvince} to ${toProvince}?`, `Review the official ${toProvince} requirements for health coverage, a driver's licence, vehicle registration, and other residency records before the move. Transition rules and deadlines depend on the program and your circumstances.`],
    ["What should I do before the movers arrive?", "Defrost your fridge 24 hours ahead, disconnect appliances, label boxes by room, and set aside medications, chargers, and documents to carry yourself. Reserve elevators and loading areas in advance where required."],
  ];
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function faqSchema(faqs) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) });
}

function faqSection(faqs) {
  const cards = faqs.map(([question, answer]) => `<div class="bg-white rounded-xl p-6 border border-gray-200"><h3 class="font-heading text-base font-bold text-gray-900 mb-2">${escapeHtml(question)}</h3><p class="font-body text-sm text-gray-600 leading-relaxed">${escapeHtml(answer)}</p></div>`).join("");
  return `<section id="pcm-step62-route-faq" class="py-16 bg-gray-50 pcm-step62-faq"><div class="container max-w-3xl"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2><div class="space-y-4" data-pcm-route-faq-list>${cards}</div></div></section>`;
}

function quotePanel(config) {
  const from = `${config.from}, ${config.fromProvince}`;
  const to = `${config.to}, ${config.toProvince}`;
  return `<section class="pcm-lead-boost pcm-lead-panel" aria-label="Free moving estimate"><div class="pcm-lead-panel__inner"><div><div class="pcm-lead-panel__eyebrow">Free moving estimate</div><h2>Start your move with a fast, no-obligation estimate.</h2><p>Tell us the basics and we will help price the right crew, truck, and plan for your long-distance move.</p><div class="pcm-trust-row"><span>Family-owned since 1991</span><span>BBB Accredited business</span><span>No broker-style handoffs</span><span>Declared Value Protection available</span></div></div><form class="pcm-estimate-form" action="/contact/" method="get"><label>Moving from<input name="from" type="text" value="${from}" placeholder="${from}"></label><label>Moving to<input name="to" type="text" value="${to}" placeholder="${to}"></label><label>Home size<select name="homeSize"><option value="">Select size</option><option>Studio</option><option>1 bedroom</option><option>2 bedroom</option><option>3 bedroom</option><option>4+ bedroom</option></select></label><label>Move date<input name="moveDate" type="date"></label><div class="pcm-button-row"><button class="pcm-primary-button" type="submit">Continue Estimate</button><a class="pcm-secondary-button" href="tel:18774856683">Call 1-877-485-6683</a></div><div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Online estimate bonus: save at least $100</strong><span class="pcm-estimate-bonus__deadline">Book before September 30, 2026</span><span>Complete an online estimate and book your move with Purely Canadian Movers. Discount confirmed with your written estimate.</span></div></div></form></div></section>`;
}

function pricingSection(config) {
  const rows = [["Studio","$2,500+"],["1-bedroom","$4,700+"],["2-bedroom","$6,300+"],["3-bedroom","$10,000+"],["4+ bedroom","$15,000+"]];
  return `<section class="pcm-route-cost" aria-labelledby="pcm-step62-cost-heading"><div class="pcm-route-cost__inner"><h2 id="pcm-step62-cost-heading">How much does it cost to move from ${config.from} to ${config.to}?</h2><p>${config.from === "Edmonton" ? "An" : "A"} ${config.from} to ${config.to} move typically ranges from about <strong>$2,500+</strong> for a studio to <strong>$15,000+</strong> for a 4+ bedroom home.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Typical transit</th></tr></thead><tbody>${rows.map(([size,cost])=>`<tr><td>${size}</td><td>${cost}</td><td>7–19 days</td></tr>`).join("")}</tbody></table></div><p class="pcm-route-cost__note">${inclusion}Prices are planning ranges in CAD, not guaranteed quotes. ${config.from} to ${config.to} pricing depends on inventory weight or volume, access, packing, storage, season, and services.</p></div></section>`;
}

function glanceSection(config) {
  return `<section class="py-12 pcm-step62-raw-glance"><div class="container max-w-4xl"><h2 class="font-heading text-2xl font-bold">${config.from}–${config.to} Route at a Glance</h2><div><p><strong>Distance:</strong> approximately 3,500 km</p><p><strong>Estimated transit:</strong> 7–19 days</p><p><strong>Typical cost range:</strong> $2,500–$15,000+</p></div></div></section>`;
}

function ensureRawComponents(html, config) {
  const visible = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const hasQuote = /<section\b[^>]*class="[^"]*\bpcm-lead-panel\b/i.test(visible);
  const hasPricing = /<section\b[^>]*class="[^"]*\bpcm-route-cost\b/i.test(visible);
  if (!hasQuote) {
    const pricingIndex = html.search(/<section\b[^>]*class="[^"]*\bpcm-route-cost\b/i);
    const rootIndex = html.indexOf('<div id="root">');
    const insertAt = pricingIndex >= 0 && pricingIndex < rootIndex ? pricingIndex : rootIndex;
    html = `${html.slice(0, insertAt)}${quotePanel(config)}${html.slice(insertAt)}`;
  }
  if (!hasPricing) {
    const rootIndex = html.indexOf('<div id="root">');
    html = `${html.slice(0, rootIndex)}${pricingSection(config)}${html.slice(rootIndex)}`;
  }
  const quoteMatch = html.match(/<section\b(?=[^>]*\bclass="[^"]*\bpcm-lead-panel\b)[^>]*>[\s\S]*?<\/section>/i);
  const pricingIndex = html.search(/<section\b(?=[^>]*\bclass="[^"]*\bpcm-route-cost\b)/i);
  if (quoteMatch && quoteMatch.index > pricingIndex && pricingIndex >= 0) {
    html = html.slice(0, quoteMatch.index) + html.slice(quoteMatch.index + quoteMatch[0].length);
    const updatedPricingIndex = html.search(/<section\b(?=[^>]*\bclass="[^"]*\bpcm-route-cost\b)/i);
    html = html.slice(0, updatedPricingIndex) + quoteMatch[0] + html.slice(updatedPricingIndex);
  }
  const refreshed = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  if (!/Route at a Glance/i.test(refreshed)) html = html.replace('<section id="pcm-step62-route-faq"', `${glanceSection(config)}<section id="pcm-step62-route-faq"`);
  return html;
}

function replaceFaq(html, faqs, slug) {
  const headingIndex = html.indexOf("Frequently Asked Questions");
  const sectionStart = html.lastIndexOf("<section", headingIndex);
  const sectionEnd = html.indexOf("</section>", headingIndex);
  if (headingIndex < 0 || sectionStart < 0 || sectionEnd < 0) throw new Error(`Could not locate FAQ section for /${slug}/`);
  return `${html.slice(0, sectionStart)}${faqSection(faqs)}${html.slice(sectionEnd + 10)}`;
}

function setInputIdentity(html, name, value) {
  return html.replace(new RegExp(`<input(?=[^>]*name=["']${name}["'])[^>]*>`, "i"), (tag) => tag.replace(/\svalue=["'][^"']*["']/i, "").replace(/\splaceholder=["'][^"']*["']/i, "").replace(/>$/, ` value="${value}" placeholder="${value}">`));
}

function routeRuntime(config, faqs) {
  const data = JSON.stringify(faqs).replaceAll("<", "\\u003c");
  return `${markerStart}
<script id="pcm-step62-montreal-edmonton-runtime">
(function(){var path="/${config.slug}/";if(location.pathname.replace(/\\/+$/,"/")!==path)return;var faqs=${data},quote=${JSON.stringify(quotePanel(config)).replaceAll("<", "\\u003c")};
function sync(){document.title=${JSON.stringify(config.title)};[["meta[name=description]","content",${JSON.stringify(config.description)}],["meta[property='og:title']","content",${JSON.stringify(config.title)}],["meta[name='twitter:title']","content",${JSON.stringify(config.title)}],["meta[property='og:url']","content","https://purelycanadianmovers.com/${config.slug}/"],["link[rel=canonical]","href","https://purelycanadianmovers.com/${config.slug}/"]].forEach(function(x){var n=document.querySelector(x[0]);if(n)n.setAttribute(x[1],x[2])});if(!document.querySelector(".pcm-lead-panel")){var root=document.getElementById("root");if(root)root.insertAdjacentHTML("beforebegin",quote)}var form=document.querySelector(".pcm-lead-panel form");if(form){var from=form.querySelector('[name=from]'),to=form.querySelector('[name=to]');if(from){from.value="${config.from}, ${config.fromProvince}";from.placeholder=from.value}if(to){to.value="${config.to}, ${config.toProvince}";to.placeholder=to.value}}document.querySelectorAll("main p").forEach(function(p){var next=p.innerHTML.replace(/fully insured/gi,"professionally coordinated with Declared Value Protection options").replace(/valuation coverage options/gi,"Declared Value Protection options").replace(/basic valuation coverage/gi,"basic Declared Value Protection");if(next!==p.innerHTML)p.innerHTML=next});
var hs=Array.prototype.filter.call(document.querySelectorAll("h2"),function(n){return /^Frequently Asked Questions$/i.test((n.textContent||"").trim())}),h=hs[0],section=h&&h.closest("section");if(section){for(var i=1;i<hs.length;i++){var d=hs[i].closest("section");if(d&&d!==section)d.remove()}section.id="pcm-step62-route-faq";section.className="py-16 bg-gray-50 pcm-step62-faq";h.className="font-heading text-3xl font-bold text-gray-900 mb-8 text-center";var list=h.nextElementSibling;if(!list){list=document.createElement("div");h.after(list)}list.className="space-y-4";list.setAttribute("data-pcm-route-faq-list","");list.innerHTML="";faqs.forEach(function(x){var card=document.createElement("div"),q=document.createElement("h3"),a=document.createElement("p");card.className="bg-white rounded-xl p-6 border border-gray-200";q.className="font-heading text-base font-bold text-gray-900 mb-2";a.className="font-body text-sm text-gray-600 leading-relaxed";q.textContent=x[0];a.textContent=x[1];card.append(q,a);list.appendChild(card)})}document.querySelectorAll('script[type="application/ld+json"]').forEach(function(n){try{var x=JSON.parse(n.textContent);if(x&&x["@type"]==="FAQPage"&&n.id!=="pcm-step62-route-faq-schema")n.remove()}catch(e){}});var s=document.getElementById("pcm-step62-route-faq-schema");if(!s){s=document.createElement("script");s.type="application/ld+json";s.id="pcm-step62-route-faq-schema";document.head.appendChild(s)}s.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(function(x){return{"@type":"Question",name:x[0],acceptedAnswer:{"@type":"Answer",text:x[1]}}})});
if(path==="/edmonton-to-montreal-movers/"){var trigger=document.querySelector('header button[aria-label="Open menu"]'),panel=document.querySelector(".pcm-static-mobile");if(trigger&&panel&&!trigger.dataset.step62Nav){trigger.dataset.step62Nav="ready";trigger.setAttribute("aria-expanded",panel.classList.contains("is-open")?"true":"false");trigger.addEventListener("click",function(){setTimeout(function(){trigger.setAttribute("aria-expanded",panel.classList.contains("is-open")?"true":"false")},0)});panel.addEventListener("click",function(e){if(e.target.closest('button[aria-label="Close menu"]'))setTimeout(function(){trigger.setAttribute("aria-expanded","false")},0)});document.addEventListener("keydown",function(e){if(e.key==="Escape"&&panel.classList.contains("is-open")){panel.classList.remove("is-open");trigger.setAttribute("aria-expanded","false");trigger.focus()}})}}}
var observer=new MutationObserver(function(){observer.disconnect();sync();observer.observe(document.documentElement,{childList:true,subtree:true})});observer.observe(document.documentElement,{childList:true,subtree:true});var tries=0,timer=setInterval(function(){sync();if(++tries>=24){clearInterval(timer);observer.disconnect()}},250);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync);else sync()})();
</script>
${markerEnd}`;
}

for (const config of routes) {
  const file = join(outDir, config.slug, "index.html");
  const faqs = routeFaqs(config);
  const canonical = `https://purelycanadianmovers.com/${config.slug}/`;
  let html = await readFile(file, "utf8");
  html = html.replace(new RegExp(`\\s*${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "\n")
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(config.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(config.description)}">`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:title" content="${escapeHtml(config.title)}">`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:title" content="${escapeHtml(config.title)}">`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`)
    .replaceAll("$2,800+", "$2,500+").replaceAll("$5,000+", "$4,700+").replaceAll("$6,800+", "$6,300+")
    .replaceAll("$2,800", "$2,500").replaceAll("$5,000", "$4,700").replaceAll("$6,800", "$6,300")
    .replace(/(?:7|8)[–-](?:18|20) days/g, "7–19 days")
    .replace(/\bfully insured\b/gi, "professionally coordinated with Declared Value Protection options")
    .replace(/\bvaluation coverage options\b/gi, "Declared Value Protection options")
    .replace(/\bvaluation coverage available\b/gi, "Declared Value Protection available")
    .replace("Studio or small shipment", "Studio");
  html = setInputIdentity(setInputIdentity(html, "from", `${config.from}, ${config.fromProvince}`), "to", `${config.to}, ${config.toProvince}`);
  const note = `Prices are planning ranges in CAD, not guaranteed quotes. ${config.from} to ${config.to} pricing`;
  if (!html.includes(inclusion + note)) html = html.replace(note, inclusion + note);
  const oldHeading = `${config.from} to ${config.to} Moving Cost Breakdown`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  html = html.replace(new RegExp(`<section[^>]*>[^<]*(?:<[^>]+>)*<h2[^>]*>${oldHeading}<\\/h2>[\\s\\S]*?<\\/section>`), "");
  if (config.slug === "montreal-to-edmonton-movers") html = html.replace(/\s*<section\b(?=[^>]*\bclass="[^"]*\bpcm-local-seo\b[^"]*")(?=[^>]*\bdata-pcm-static-local-seo="\/")[^>]*>[\s\S]*?<\/section>\s*/gi, "\n");
  html = replaceFaq(html, faqs, config.slug)
    .replace(/\s*<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, (script) => script.includes('"FAQPage"') ? "\n" : script)
    .replace(/\n{2,}<\/head>/i, "\n</head>")
    .replace("</head>", `<script type="application/ld+json" id="pcm-step62-route-faq-schema">${faqSchema(faqs)}</script>\n</head>`);
  html = ensureRawComponents(html, config)
    .replace("</body>", `${routeRuntime(config, faqs)}\n</body>`).replace(/^[ \t]+$/gm, "");
  await writeFile(file, html);
  console.log(`Finalized ${file}`);
}

const guideFile = join(outDir, "long-distance-moving-cost-canada", "index.html");
let guide = await readFile(guideFile, "utf8");
const headingIndex = guide.indexOf("Popular Moving Routes in Canada");
const tbodyStart = guide.indexOf("<tbody", headingIndex);
const tbodyOpenEnd = guide.indexOf(">", tbodyStart) + 1;
const tbodyEnd = guide.indexOf("</tbody>", tbodyOpenEnd);
if (headingIndex < 0 || tbodyStart < 0 || tbodyEnd < 0) throw new Error("Popular routes table not found");
let tableBody = guide.slice(tbodyOpenEnd, tbodyEnd);
const guideRoutes = [["Montreal → Edmonton", "3,500 km", "7–19 days", "/montreal-to-edmonton-movers/"], ["Edmonton → Montreal", "3,500 km", "7–19 days", "/edmonton-to-montreal-movers/"], ["Ottawa → Vancouver", "4,360 km", "11–22 days", "/ottawa-to-vancouver-movers/"], ["Vancouver → Ottawa", "4,360 km", "11–22 days", "/vancouver-to-ottawa-movers/"]];
for (const [label] of guideRoutes) tableBody = tableBody.replace(new RegExp(`<tr[^>]*>(?:(?!<\\/tr>)[\\s\\S])*?<td[^>]*>${label}<\\/td>(?:(?!<\\/tr>)[\\s\\S])*?<\\/tr>`), "");
const template = [...tableBody.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((match) => match[0]).at(-1);
if (!template || !template.includes("Get a Quote")) throw new Error("Styled popular-route template not found");
for (const [index, [label, distance, transit, href]] of guideRoutes.entries()) tableBody += template.replace(/bg-(?:white|gray-50)/, index % 2 === 0 ? "bg-gray-50" : "bg-white").replace(/>Toronto → Victoria</, `>${label}<`).replace(">4,400 km<", `>${distance}<`).replace(">10–22 days<", `>${transit}<`).replace("/toronto-to-victoria-movers/", href).replace('class="border-b', 'class="pcm-cost-guide-popular-route border-b');
guide = guide.slice(0, tbodyOpenEnd) + tableBody + guide.slice(tbodyEnd);
await writeFile(guideFile, guide);
console.log(`Finalized ${guideFile}`);
