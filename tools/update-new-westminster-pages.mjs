import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { execFileSync } from "node:child_process";

const pagePath = "site-copy/new-westminster/index.html";
const duplicatePath = "site-copy/local-movers-new-westminster-bc/index.html";
const bundlePath = "site-copy/assets/index-CNBNs70h.js";
const sitemapPath = "site-copy/sitemap.xml";
const redirectsPath = "site-copy/_redirects";

const title = "Movers in New Westminster, BC | Purely Canadian Movers";
const description = "Purely Canadian Movers provides local and long-distance moving services in New Westminster, BC from our nearby Coquitlam home base. Family-owned since 1991, with condo, house, office, packing, and storage support.";
const quickAnswer = "Purely Canadian Movers provides local and long-distance moving services throughout New Westminster, BC from our nearby Coquitlam home base. Family-owned since 1991, we move condos, apartments, townhouses, houses and offices, with packing and storage available.";

const faqs = [
  ["Do you provide movers in New Westminster?", "Yes. Purely Canadian Movers provides local and long-distance moving services throughout New Westminster, including Downtown, the Quay, Uptown, Sapperton, Queensborough, Victoria Hill, Glenbrooke North, Connaught Heights, and the West End."],
  ["How much does a New Westminster move cost?", "New Westminster moving costs depend on crew size, truck size, hours, stairs, elevator access, walking distance, parking, travel time, packing, storage, move date, and inventory. A written estimate is the best way to price the move accurately."],
  ["Is Purely Canadian Movers located in New Westminster?", "Purely Canadian Movers is based nearby in Coquitlam, BC and provides moving services throughout New Westminster and Metro Vancouver. We do not claim a New Westminster office."],
  ["Do you handle condo and apartment moves in New Westminster?", "Yes. We move condos and apartments in New Westminster, including high-rise and older apartment buildings. We can plan around elevator reservations, loading docks, underground parking clearance, stairs, long carries, and strata move windows where applicable."],
  ["Can you work with elevator reservations and strata move windows?", "Yes. Share the building's confirmed elevator reservation, loading instructions, move window, parking details, and access restrictions so the crew and timing can be planned around the information provided by the customer or strata."],
  ["Do you move houses and townhouses in Queensborough and other New Westminster neighbourhoods?", "Yes. We move houses and townhouses in Queensborough and across New Westminster. Queensborough moves may need practical planning for truck access, storage, and departure or arrival timing when the Queensborough Bridge is part of the route."],
  ["Do you provide office moving in New Westminster?", "Yes. We provide office and commercial moving support in New Westminster for furniture, boxed files, and equipment, with building access and timing reviewed in advance."],
  ["Do you provide packing and storage?", "Yes. Full or partial packing, unpacking, and short- or long-term storage can be included in a New Westminster moving plan."],
  ["Do you provide long-distance moving from New Westminster?", "Yes. We coordinate long-distance and cross-Canada moves from New Westminster with route planning, written estimates, packing, storage, and Great Canadian Van Lines agent-network support."],
];

const neighborhoods = [
  "Quay / Downtown — Waterfront high-rises, condos, elevators, loading zones, underground access, and scheduled move windows",
  "Uptown — Apartments and older buildings where stairs, loading access, and high-density residential planning may matter",
  "Sapperton — Apartments, condos, residential access, busy streets, and hospital-area traffic where relevant",
  "Queensborough — Houses, townhouses, newer developments, truck access, bridge timing, and storage planning",
  "Victoria Hill — Condos and townhouses with strata access and elevator scheduling where applicable",
  "Glenbrooke North, Connaught Heights, and West End — Established homes, townhouses, and residential street access",
];

const localTips = [
  "Quay and Downtown: High-rise and waterfront moves may require elevator reservations, loading-zone coordination, underground parking clearance, long-carry planning, and scheduled strata move windows.",
  "Uptown: Older apartments and dense residential streets can involve stairs, limited loading areas, elevator access, and hallway or elevator protection.",
  "Sapperton: Apartments and condos may need access planning around busy streets, loading areas, elevators, and hospital-area traffic where relevant.",
  "Queensborough and Victoria Hill: Houses, townhouses, condos, and newer developments benefit from advance review of truck access, strata requirements, storage, and timing. Planning departure and arrival timing can be helpful for moves that use the Queensborough Bridge.",
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "Moving services in New Westminster, BC", serviceType: "Local and Long-Distance Moving Service", url: "https://purelycanadianmovers.com/new-westminster/", description,
  provider: { "@id": "https://purelycanadianmovers.com/#organization" }, areaServed: { "@type": "City", name: "New Westminster" },
  availableChannel: { "@type": "ServiceChannel", serviceUrl: "https://purelycanadianmovers.com/contact/", servicePhone: "+1-877-485-6683" },
};
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://purelycanadianmovers.com/" }, { "@type": "ListItem", position: 2, name: "New Westminster", item: "https://purelycanadianmovers.com/new-westminster/" }] };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const atomicWrite = (path, contents) => { const temp = path + ".tmp"; writeFileSync(temp, contents); renameSync(temp, path); };
const faqHtml = faqs.map(([question, answer]) => `<details class="border border-gray-200 rounded-lg p-4"><summary class="font-body font-semibold text-gray-900">${esc(question)}</summary><p class="font-body text-gray-700 mt-3 leading-relaxed">${esc(answer)}</p></details>`).join("");
const listHtml = (items) => items.map((item) => `<li>${item}</li>`).join("");

const main = `<main class="flex-1"><section class="relative py-20 bg-gray-900 overflow-hidden"><div class="relative container"><div class="max-w-3xl"><div class="font-body text-sm text-gray-400 mb-4"><a href="/">Home</a> / New Westminster</div><h1 class="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Movers in New Westminster, BC</h1><p class="font-body text-lg text-gray-300 mb-8 leading-relaxed">${quickAnswer}</p><a href="/contact/" class="inline-flex bg-[#CC1A1A] text-white font-body font-semibold px-6 py-3 rounded">Get a Free Estimate</a></div></div></section><section class="py-16 bg-white"><div class="container"><div class="max-w-4xl"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-4">Moving services for New Westminster homes, buildings, and businesses</h2><p class="font-body text-gray-600 mb-4 leading-relaxed">New Westminster combines waterfront towers, older apartment buildings, heritage homes, townhouses, and newer residential areas. Our own trained crews plan local residential moves, condo and apartment moves, house and townhouse moves, and office or commercial moves from our nearby Coquitlam base.</p><p class="font-body text-gray-600 leading-relaxed">For long-distance and cross-Canada moves from New Westminster, we coordinate route planning and written estimates through our Great Canadian Van Lines agent network. Packing, unpacking, storage, and <a class="text-[#CC1A1A] font-semibold" href="/valuation-coverage-protection/">Declared Value Protection</a> options can be discussed with your estimate.</p></div></div></section><section class="py-16 bg-gray-50"><div class="container"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8">Planning a New Westminster move</h2><div class="grid md:grid-cols-2 gap-6">${localTips.map((tip) => `<article class="bg-white rounded-lg p-6 border-l-4 border-[#CC1A1A]"><p class="font-body text-gray-700 leading-relaxed">${tip}</p></article>`).join("")}</div></div></section><section class="py-16 bg-white"><div class="container"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8">New Westminster moving services</h2><ul class="space-y-3 font-body text-gray-700"><li><strong>Local residential moving:</strong> Moves within New Westminster and Metro Vancouver.</li><li><strong>Condo and apartment moving:</strong> High-rise, older-building, elevator, loading, stairs, and protection planning.</li><li><strong>Townhouse and house moving:</strong> Queensborough, Victoria Hill, Glenbrooke North, Connaught Heights, West End, and other neighbourhoods.</li><li><strong>Office and commercial moving:</strong> Furniture, files, equipment, building access, and timing planning.</li><li><strong>Packing and unpacking:</strong> Full or partial support through our <a class="text-[#CC1A1A] font-semibold" href="/packing/">packing service</a>.</li><li><strong>Storage:</strong> Short- and long-term options through our <a class="text-[#CC1A1A] font-semibold" href="/storage/">storage solutions</a>.</li><li><strong>Long-distance and cross-Canada moving:</strong> Route planning and written estimates through <a class="text-[#CC1A1A] font-semibold" href="/long-distance/">long-distance moving</a>.</li></ul></div></section><section class="py-16 bg-gray-50"><div class="container"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8">Neighbourhoods we serve in New Westminster</h2><ul class="grid md:grid-cols-2 gap-4 font-body text-gray-700">${listHtml(neighborhoods)}</ul></div></section><section class="py-16 bg-white"><div class="container max-w-3xl"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8">New Westminster moving FAQ</h2><div class="space-y-4">${faqHtml}</div></div></section><section class="py-16 bg-[#CC1A1A] text-white"><div class="container text-center"><h2 class="font-heading text-3xl font-bold mb-4">Ready to plan your New Westminster move?</h2><p class="font-body text-red-100 mb-8">Get a free, no-obligation estimate from a family-owned mover serving Metro Vancouver since 1991.</p><a href="/contact/" class="inline-flex bg-white text-[#CC1A1A] font-body font-semibold px-6 py-3 rounded">Get a Free Estimate</a></div></section></main>`;

const formGuard = `<script id="pcm-new-westminster-form-defaults">(function(){function setDefaults(){document.querySelectorAll('input[name="from"]').forEach(function(input){input.placeholder='New Westminster, BC';if(!input.value||input.value!=='New Westminster, BC'){var setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'New Westminster, BC');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}});document.querySelectorAll('input[name="to"]').forEach(function(input){input.placeholder='City or province';if(input.value&&/^[A-Za-z .'-]+,\\s*[A-Z]{2}$/.test(input.value)){var setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}})}window.addEventListener('DOMContentLoaded',setDefaults);window.addEventListener('load',function(){setDefaults();setTimeout(setDefaults,500)})})();</script>`;

function updatePage() {
  let html = execFileSync("git", ["show", "HEAD:" + pagePath], { encoding: "utf8" });
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`).replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`).replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`).replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${description}">`).replace(/<meta property="og:url" content=".*?">/, '<meta property="og:url" content="https://purelycanadianmovers.com/new-westminster/">').replace(/<meta name="twitter:title" content=".*?">/, `<meta name="twitter:title" content="${title}">`).replace(/<meta name="twitter:description" content=".*?">/, `<meta name="twitter:description" content="${description}">`).replace(/<link rel="canonical" id="canonical-tag" href=".*?">/, '<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com/new-westminster/">').replace(/<input name="from"[^>]*>/g, '<input name="from" value="New Westminster, BC" type="text">').replace(/<input name="to"[^>]*>/g, '<input name="to" placeholder="City or province" type="text">').replace(/<main[\s\S]*?<\/main>/, main).replace(/<script type="application\/ld\+json" id="pcm-service-schema">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="pcm-service-schema">${JSON.stringify(serviceSchema)}</script>`).replace(/<script type="application\/ld\+json" id="pcm-breadcrumb-schema">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="pcm-breadcrumb-schema">${JSON.stringify(breadcrumbSchema)}</script>`).replace(/<script type="application\/ld\+json" id="pcm-faq-schema">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="pcm-faq-schema">${JSON.stringify(faqSchema)}</script>`).replace(/<script[^>]+id="(?:local-business-schema|website-schema|aggregate-rating-schema|faq-schema|service-schema--new-westminster-|breadcrumb-schema)"[\s\S]*?<\/script>/g, "").replace(/<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>/, "").replace(/<script id="pcm-new-westminster-form-defaults">[\s\S]*?<\/script>/, "");
  html = html.replace("</body></html>", `${formGuard}</body></html>`);
  atomicWrite(pagePath, html);
}

function updateBundle() {
  let bundle = readFileSync(bundlePath, "utf8");
  const config = `newWestminster:{localPricing:null,neighborhoods:${JSON.stringify(neighborhoods)},localTips:${JSON.stringify(localTips)},faqs:${JSON.stringify(faqs.map(([question, answer]) => ({ question, answer })))}},abbotsford:`;
  bundle = bundle.replace(/newWestminster:\{localPricing:\{[^}]*\},neighborhoods:\[[^\]]*\],localTips:\[[^\]]*\],faqs:\[[\s\S]*?\]\},abbotsford:/, config);
  const component = `function _ge(){return a.jsx(sn,{"data-loc":"client/src/pages/cities/NewWestminster.tsx:5",city:"New Westminster",slug:"new-westminster",canonicalOverride:"/new-westminster/",description:${JSON.stringify(description)},heroSubtitle:${JSON.stringify(quickAnswer)},areaDescription:${JSON.stringify("New Westminster combines waterfront towers, older apartment buildings, heritage homes, townhouses, and newer residential areas. From our nearby Coquitlam base, our own trained crews plan building access, elevators, loading, stairs, parking, packing, and storage requirements for each move." )},whyUs:["Experienced with New Westminster condos, apartments, houses, and townhouses","Practical planning for elevators, strata move windows, loading docks, parking clearance, stairs, and long carries","Own trained crews for local moves — no brokers or subcontractors","Family-owned and operating since 1991 from nearby Coquitlam","BBB Accredited with factual company and network information"],services:["Local residential moving","Condo and high-rise moving","Apartment moving","Townhouse moving","House moving","Office and commercial moving","Packing and unpacking","Storage","Long-distance and cross-Canada moving"],localPricing:Tt.newWestminster.localPricing,neighborhoods:Tt.newWestminster.neighborhoods,localTips:Tt.newWestminster.localTips,faqs:Tt.newWestminster.faqs})}`;
  bundle = bundle.replace(/function _ge\(\)\{return a\.jsx\(sn,[\s\S]*?\}\)\}function Dge\(\)/, component + "function Dge()");
  const tempBundlePath = bundlePath + ".tmp";
  writeFileSync(tempBundlePath, bundle);
  renameSync(tempBundlePath, bundlePath);
}

function updateDuplicateSignals() {
  atomicWrite(duplicatePath, execFileSync("git", ["show", "HEAD:" + duplicatePath], { encoding: "utf8" }));
  let redirects = readFileSync(redirectsPath, "utf8");
  if (!redirects.includes("/local-movers-new-westminster-bc/  /new-westminster/  301")) redirects += "\n/local-movers-new-westminster-bc/  /new-westminster/  301\n";
  atomicWrite(redirectsPath, redirects);
  let sitemap = readFileSync(sitemapPath, "utf8");
  sitemap = sitemap.replace(/\s*<url><loc>https:\/\/purelycanadianmovers\.com\/local-movers-new-westminster-bc\/<\/loc><\/url>/, "");
  if (!sitemap.includes("https://purelycanadianmovers.com/new-westminster/")) sitemap = sitemap.replace("</urlset>", "  <url><loc>https://purelycanadianmovers.com/new-westminster/</loc></url>\n</urlset>");
  atomicWrite(sitemapPath, sitemap);
}

updatePage();
updateBundle();
updateDuplicateSignals();
console.log("Updated New Westminster hub, hydration config, redirect, and sitemap signals.");
