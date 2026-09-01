import { readFile, writeFile } from "node:fs/promises";

const bundlePath = "site-copy/assets/index-CNBNs70h.js";
const canonicalPath = "site-copy/moving-in-abbotsford-bc/index.html";
const legacyPath = "site-copy/abbotsford/index.html";

async function writeIfChanged(path, next) {
  let current = "";
  try { current = await readFile(path, "utf8"); } catch {}
  if (current !== next) await writeFile(path, next);
}

const title = "Movers in Abbotsford, BC | Purely Canadian Movers";
const description = "Abbotsford movers for local and long-distance moves from our Coquitlam base, including houses, condos, townhouses, acreage properties, packing, and storage. Family-owned since 1991.";
const canonical = "https://purelycanadianmovers.com/moving-in-abbotsford-bc/";

const faqs = [
  ["How much do movers cost in Abbotsford?", "Local Abbotsford moves start around $850+ for a studio, $1,050+ for a 1-bedroom, $1,500+ for a 2-bedroom, and $2,000+ for a 3-bedroom. Final cost depends on home size, inventory, crew and time, access, stairs or elevators, packing, distance, storage, and rural-property access where applicable."],
  ["Is Purely Canadian Movers located in Abbotsford?", "Purely Canadian Movers is based in Coquitlam, BC and provides moving services throughout Abbotsford and the Fraser Valley. We do not claim an Abbotsford office."],
  ["Do you provide local moving within Abbotsford?", "Yes. Our own trained crews handle local residential moves within Abbotsford, including houses, condos, apartments, townhouses, and moves between Abbotsford neighbourhoods."],
  ["Do you move houses and townhouses in East Abbotsford?", "Yes. We plan house and townhouse moves in East Abbotsford, Auguston, Clayburn, and nearby areas around driveways, hills, access, inventory, and loading conditions where relevant."],
  ["Do you handle acreage and rural moves in Matsqui, Bradner or Mount Lehman?", "Yes. We plan acreage and rural-property moves in Matsqui, Bradner, Mount Lehman, Sumas Prairie, and nearby rural areas. We review longer driveways, gate or access width, turnaround space, truck positioning, larger inventories, detached buildings, and loading logistics. This means planning truck access at farms and acreage properties; it does not imply moving farm machinery."],
  ["Do you move condos and apartments in Abbotsford?", "Yes. We move condos and apartments in Clearbrook, Mill Lake, Central Abbotsford, and other areas, with advance planning for loading access, elevator scheduling, stairs, and building move windows where applicable."],
  ["Do you provide packing and storage?", "Yes. Packing, unpacking, and short- or long-term storage are available and can be included in your Abbotsford moving plan."],
  ["Do you provide long-distance moving from Abbotsford?", "Yes. We coordinate long-distance and cross-Canada moves from Abbotsford through our Great Canadian Van Lines agent network, with route-specific written estimates, packing, and storage planning where needed."],
  ["Do you use subcontractors?", "No. Local Abbotsford moves are handled by Purely Canadian Movers' own trained crews. Long-distance moves are coordinated through our established Great Canadian Van Lines agent network; Great Canadian Van Lines agents are not described as subcontractors."],
];

const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
const serviceSchema = { "@context": "https://schema.org", "@type": "Service", name: "Moving services in Abbotsford, BC", serviceType: "Local and Long-Distance Moving Service", url: canonical, description, provider: { "@id": "https://purelycanadianmovers.com/#organization" }, areaServed: [{ "@type": "City", name: "Abbotsford" }, { "@type": "AdministrativeArea", name: "Fraser Valley" }], availableChannel: { "@type": "ServiceChannel", serviceUrl: "https://purelycanadianmovers.com/contact/", servicePhone: "+1-877-485-6683" } };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://purelycanadianmovers.com/" }, { "@type": "ListItem", position: 2, name: "Local Moving", item: "https://purelycanadianmovers.com/local/" }, { "@type": "ListItem", position: 3, name: "Abbotsford", item: canonical }] };

const quickAnswer = "Purely Canadian Movers provides local and long-distance moving services in Abbotsford, BC from our Coquitlam home base. Family-owned since 1991, we move houses, condos, townhouses, apartments, and rural properties throughout Abbotsford, with packing and storage available.";
const main = `<main class="flex-1"><section class="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 pt-32 pb-20 px-4"><div class="max-w-5xl mx-auto"><p class="text-sm uppercase tracking-widest text-red-200 mb-4">Local and long-distance moving</p><h1 class="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Movers in Abbotsford, BC</h1><p class="text-xl text-gray-200 mb-8 max-w-3xl">${quickAnswer}</p><a href="/contact/" class="inline-block bg-[#CC1A1A] text-white font-bold py-3 px-8 rounded">Get a Free Estimate</a></div></section><section class="py-16 px-4 bg-white"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-6 text-slate-900">Moving services for Abbotsford homes and businesses</h2><p class="text-lg text-gray-700 mb-4">From our Coquitlam headquarters, our own trained crews handle local residential moving, apartment and condo moving, townhouse moving, house moving, acreage and rural-property moving, packing and unpacking, storage, and office or commercial moving where supported.</p><p class="text-lg text-gray-700">We also coordinate long-distance moving from Abbotsford across Canada through our Great Canadian Van Lines agent network. Local moves stay with our own crews, with no brokers or subcontractors.</p></div></section><section class="py-16 px-4 bg-gray-50"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-8 text-slate-900">Planning a move in Abbotsford</h2><div class="grid md:grid-cols-2 gap-6"><article class="bg-white p-6 rounded-lg shadow-sm"><h3 class="text-xl font-bold mb-3">Clearbrook, Mill Lake and Central Abbotsford</h3><p class="text-gray-700">Apartment, condo, and townhouse moves benefit from advance review of loading access, elevator scheduling, stairs, and building move windows where applicable.</p></article><article class="bg-white p-6 rounded-lg shadow-sm"><h3 class="text-xl font-bold mb-3">East Abbotsford, Auguston and Clayburn</h3><p class="text-gray-700">For detached homes and townhouses, we plan around hills, driveways, residential street access, and larger family inventories where relevant.</p></article><article class="bg-white p-6 rounded-lg shadow-sm"><h3 class="text-xl font-bold mb-3">Matsqui, Bradner, Mount Lehman and Sumas Prairie</h3><p class="text-gray-700">Acreage and rural moves need practical planning for longer driveways, gate or access width, turnaround space, truck positioning, larger inventories, detached buildings, and loading.</p></article><article class="bg-white p-6 rounded-lg shadow-sm"><h3 class="text-xl font-bold mb-3">Access and protection</h3><p class="text-gray-700">We assess driveways, residential street access, condo loading areas, and rural-property access before moving day. Estimates can include packing, storage, and Declared Value Protection options.</p></article></div></div></section><section class="py-16 px-4 bg-white"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-6 text-slate-900">Typical local moving costs in Abbotsford</h2><div class="grid sm:grid-cols-2 gap-4 text-lg"><div class="border rounded p-4">Studio <strong>$850+</strong></div><div class="border rounded p-4">1-bedroom <strong>$1,050+</strong></div><div class="border rounded p-4">2-bedroom <strong>$1,500+</strong></div><div class="border rounded p-4">3-bedroom <strong>$2,000+</strong></div></div><p class="text-gray-700 mt-5">These are planning starting points for local moves. Final pricing depends on inventory, crew and time, access, stairs or elevators, packing, distance, storage, and other move requirements. <a class="text-[#CC1A1A] font-semibold" href="/contact/">Request a written estimate</a> or review our <a class="text-[#CC1A1A] font-semibold" href="/long-distance-moving-cost-canada/">moving cost guide</a>.</p></div></section><section class="py-16 px-4 bg-gray-50"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-6 text-slate-900">Common Abbotsford moves</h2><p class="text-lg text-gray-700">We plan Abbotsford moves to Chilliwack, Langley, Surrey, Maple Ridge, Coquitlam, Burnaby, Vancouver, and long-distance destinations across Canada. See our <a class="text-[#CC1A1A] font-semibold" href="/long-distance/">long-distance moving service</a> or <a class="text-[#CC1A1A] font-semibold" href="/contact/">contact us</a> for route planning.</p></div></section><section class="py-16 px-4 bg-white"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-8 text-slate-900">Abbotsford moving FAQ</h2><div class="space-y-4">${faqs.map(([q, a]) => `<details class="border border-gray-200 rounded-lg bg-white p-5"><summary class="cursor-pointer font-semibold text-lg text-slate-900">${q}</summary><p class="mt-3 text-gray-700 leading-relaxed">${a}</p></details>`).join("")}</div></div></section><section class="py-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800"><div class="max-w-3xl mx-auto text-center"><h2 class="text-4xl font-serif font-bold text-white mb-6">Ready to plan your Abbotsford move?</h2><p class="text-xl text-gray-200 mb-8">Get your free, no-obligation estimate from a family-owned mover serving the Fraser Valley since 1991.</p><a href="/contact/" class="inline-block bg-[#CC1A1A] text-white font-bold py-3 px-8 rounded">Get a Free Estimate</a></div></section></main>`;

function replaceOnce(source, pattern, replacement, label) {
  const matches = source.match(pattern);
  if (!matches) return source;
  if (matches.length !== 1) throw new Error(`${label}: expected one match, found ${matches.length}`);
  return source.replace(pattern, replacement);
}

let bundle = await readFile(bundlePath, "utf8");
const newConfig = `abbotsford:{localPricing:{studio:"$850+",oneBed:"$1,050+",twoBed:"$1,500+",threeBed:"$2,000+"},neighborhoods:["Clearbrook — Apartments, condos, and loading access","Mill Lake — Condos, apartments, and elevator planning","East Abbotsford — Detached homes, townhouses, and driveways","Auguston — Family homes and residential access","Clayburn — Houses, townhouses, and hillside access","West Abbotsford — Residential homes and local moves","Townline Hill — Homes and townhouses","Matsqui — Acreage and rural-property access","Bradner — Rural homes and longer driveways","Mount Lehman — Acreage access and truck positioning","Sumas Prairie — Rural homes and loading planning"],localTips:["Clearbrook, Mill Lake and Central Abbotsford: Condo and apartment moves may require elevator bookings, loading access, stairs, and scheduled move windows where applicable.","East Abbotsford, Auguston and Clayburn: House and townhouse moves can involve hills, driveways, residential street access, and larger family inventories.","Matsqui, Bradner, Mount Lehman and Sumas Prairie: Acreage and rural moves require advance review of longer driveways, gate or access width, turnaround space, truck positioning, larger inventories, detached buildings, and loading logistics where relevant.","Access planning: We assess driveways, residential street access, condo loading areas, and rural-property access before moving day. We do not make blanket parking claims."],faqs:${JSON.stringify(faqs.map(([question, answer]) => ({ question, answer })))}},mapleRidge:`;
bundle = replaceOnce(bundle, /abbotsford:\{localPricing:\{[^}]*\},neighborhoods:\[[^\]]*\],localTips:\[[^\]]*\],faqs:\[[\s\S]*?\]\},mapleRidge:/, newConfig, "Abbotsford city config");
bundle = replaceOnce(bundle, /function Rge\(\)\{return a\.jsx\(sn,\{[\s\S]*?faqs:Tt\.abbotsford\.faqs\}\)\}/, `function Rge(){return a.jsx(sn,{"data-loc":"client/src/pages/cities/Abbotsford.tsx:6",city:"Abbotsford",slug:"moving-in-abbotsford-bc",canonicalOverride:"/moving-in-abbotsford-bc/",description:${JSON.stringify(description)},heroSubtitle:${JSON.stringify(quickAnswer)},areaDescription:"Abbotsford moves include condos, apartments, townhouses, houses, acreage properties, and rural homes. From our Coquitlam base, our own trained crews plan building access, elevators, driveways, truck positioning, packing, storage, and long-distance routes from the Fraser Valley.",whyUs:["Serving Abbotsford from our Coquitlam headquarters","Own trained crews for local moves — no brokers or subcontractors","Family-owned since 1991","BBB Accredited","Practical planning for urban, townhouse, and rural properties","Declared Value Protection options discussed during estimates"],services:["Local residential moving","Apartment and condo moving","Townhouse moving","House moving","Acreage and rural-property moving","Packing and unpacking","Storage","Office and commercial moving","Long-distance moving from Abbotsford"],localPricing:Tt.abbotsford.localPricing,neighborhoods:Tt.abbotsford.neighborhoods,localTips:Tt.abbotsford.localTips,faqs:Tt.abbotsford.faqs})}`, "Abbotsford route component");
bundle = bundle.replaceAll('href:"/valuation-coverage-protection/",children:"Valuation Coverage"', 'href:"/valuation-coverage-protection/",children:"Declared Value Protection"');
bundle = bundle.replaceAll("valuation coverage options", "Declared Value Protection options");
await writeIfChanged(bundlePath, bundle);

const runtimeGuard = `<script id="pcm-abbotsford-form-defaults">(function(){function setDefaults(){document.querySelectorAll('script#pcm-faq-schema').forEach(function(script){script.remove()});document.querySelectorAll('input[name="from"]').forEach(function(input){input.placeholder='Abbotsford, BC';if(!input.value||/Toronto\\s*,?\\s*ON/i.test(input.value)){var setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'Abbotsford, BC');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}});document.querySelectorAll('input[name="to"]').forEach(function(input){input.placeholder='City or province';if(/Calgary\\s*,?\\s*AB/i.test(input.value)){var setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}})}window.addEventListener('DOMContentLoaded',setDefaults);window.addEventListener('load',function(){setDefaults();setTimeout(setDefaults,500)});new MutationObserver(setDefaults).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;

function patchPage(path, isCanonical) {
  return readFile(path, "utf8").then(async (html) => {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/?>(?=\s*<)/i, `<meta name="description" content="${description}">`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/?>(?=\s*<)/i, `<meta property="og:title" content="${title}">`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/?>(?=\s*<)/i, `<meta property="og:description" content="${description}">`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/?>(?=\s*<)/i, `<meta property="og:url" content="${canonical}">`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>(?=\s*<)/i, `<meta name="twitter:title" content="${title}">`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>(?=\s*<)/i, `<meta name="twitter:description" content="${description}">`)
      .replace(/<link rel="canonical" id="canonical-tag" href="[^"]*"\s*\/?>(?=\s*<)/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`)
      .replace(/Valuation coverage available/gi, "Declared Value Protection available")
      .replace(/Valuation Coverage/gi, "Declared Value Protection")
      .replace(/<input name="from"[^>]*>/g, '<input name="from" value="Abbotsford, BC" placeholder="Abbotsford, BC" type="text">')
      .replace(/<input name="to"[^>]*>/g, '<input name="to" placeholder="City or province" type="text">')
      .replace(/<main[\s\S]*?<\/main>/i, main)
      .replace(/<script type="application\/ld\+json" id="pcm-service-schema">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="pcm-service-schema">${JSON.stringify(serviceSchema)}</script>`)
      .replace(/<script type="application\/ld\+json" id="pcm-breadcrumb-schema">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="pcm-breadcrumb-schema">${JSON.stringify(breadcrumbSchema)}</script>`)
      .replace(/<script type="application\/ld\+json" id="pcm-faq-schema">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="pcm-faq-schema">${JSON.stringify(faqSchema)}</script>`)
      .replace(/<script type="application\/ld\+json" id="faq-schema">[\s\S]*?<\/script>/i, "")
      .replace(/<script id="pcm-abbotsford-form-defaults">[\s\S]*?<\/script>/i, "");
    if (isCanonical) html = html.replace("</body>", `${runtimeGuard}</body>`);
    else {
      html = html.replace(/\s*<meta name="robots" content="noindex, follow">/gi, "");
      html = html.replace("</head>", '<meta name="robots" content="noindex, follow">\n</head>');
    }
    await writeIfChanged(path, html);
  });
}

await patchPage(canonicalPath, true);
await patchPage(legacyPath, false);

let redirects = await readFile("site-copy/_redirects", "utf8");
redirects = redirects.replace(/^\/moving-in-abbotsford-bc\/?\s+\/abbotsford\/\s+301$/gm, "");
redirects = redirects.replace(/^\/moving-in-abbotsford-bc\/?\s+\/moving-in-abbotsford-bc\/\s+200$/gm, "");
redirects = redirects.replace(/^\/abbotsford\/?\s+\/moving-in-abbotsford-bc\/\s+301$/gm, "");
redirects = redirects.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n/abbotsford/  /moving-in-abbotsford-bc/  301\n";
await writeIfChanged("site-copy/_redirects", redirects);

let sitemap = await readFile("site-copy/sitemap.xml", "utf8");
sitemap = sitemap.replaceAll("https://purelycanadianmovers.com/abbotsford/", canonical);
while ((sitemap.match(new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length > 1) sitemap = sitemap.replace(canonical, "");
await writeIfChanged("site-copy/sitemap.xml", sitemap);
console.log("Updated Abbotsford bundle, prerendered routes, redirect, and sitemap.");
