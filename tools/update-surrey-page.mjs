import { readFile, writeFile } from "node:fs/promises";

const bundlePath = "site-copy/assets/index-CNBNs70h.js";
const pagePath = "site-copy/surrey/index.html";
const conversionPath = "site-copy/assets/conversion-boost.js";
const bundle = await readFile(bundlePath, "utf8");
const conversion = await readFile(conversionPath, "utf8");
const page = await readFile(pagePath, "utf8");

const faqs = [
  ["How much do movers cost in Surrey?", "Surrey moving costs depend on home size, inventory, crew size and time, stairs or elevators, parking and loading access, packing, storage, and travel distance. A written estimate is the best way to price the move accurately; we do not publish an unverified Surrey price table."],
  ["Is Purely Canadian Movers located in Surrey?", "No. Purely Canadian Movers is based in Coquitlam, BC and provides moving services throughout Surrey and the Lower Mainland. We do not claim a Surrey office."],
  ["Do you provide local moving within Surrey?", "Yes. Our own trained crews handle local Surrey moves for houses, condos, apartments, townhouses, offices, and furniture moves."],
  ["Do you move condos and high-rises in Surrey City Centre?", "Yes. We plan Surrey City Centre and Whalley condo and apartment moves around elevator reservations, strata move windows, underground parking, loading zones, long carries, protected common areas, and scheduled move times where applicable."],
  ["Can you work with elevator reservations and strata move windows?", "Yes. We coordinate the crew and loading sequence around the building information and reserved time supplied by the customer or strata. Building rules and availability vary, so they should be confirmed in advance."],
  ["Do you move houses and townhouses in Newton, Fleetwood and Cloverdale?", "Yes. We move houses, townhouses, apartments, and larger family inventories in Newton, Fleetwood, Cloverdale, Guildford, and nearby Surrey communities, with access planning for driveways, stairs, streets, and loading."],
  ["Do you handle acreage or rural-property moves in Surrey?", "Yes, where the property is accessible for the moving equipment. We review longer driveways, truck access, turnaround space, gates, detached homes, and larger inventories before moving day. Agricultural machinery is not included unless specifically approved."],
  ["Do you provide packing and storage?", "Yes. Packing and unpacking support plus short- and long-term storage can be included in a Surrey moving estimate. Declared Value Protection options can also be reviewed; this is not insurance."],
  ["Do you provide long-distance moving from Surrey?", "Yes. We plan Surrey moves to other BC destinations and across Canada through our Great Canadian Van Lines agent network, with route-specific written estimates, packing, storage, and delivery planning."],
];

const faqJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([name, text]) => ({
    "@type": "Question",
    name,
    acceptedAnswer: { "@type": "Answer", text },
  })),
});

const oldConfig = /surrey:\{localPricing:[\s\S]*?\},burnaby:\{localPricing:/;
const newConfig = `surrey:{localPricing:{studio:"",oneBed:"",twoBed:"",threeBed:""},neighborhoods:["Surrey City Centre / Whalley — High-rise condos, apartment towers, elevators and loading zones","Newton — Houses, townhouses, apartments and larger family inventories","Fleetwood — Townhouses, newer developments, detached homes and access planning","Guildford — Condos, apartments, townhouses and detached homes with building/loading planning","Cloverdale — Detached homes and some acreage properties requiring driveway and truck-access review","South Surrey — Morgan Creek, Grandview Heights, Rosemary Heights, Ocean Park and Crescent Beach homes, townhouses and condos"],localTips:["Surrey City Centre and Whalley: High-rise moves may require elevator reservations, strata move windows, underground parking clearance, loading-zone planning, concierge or building coordination where applicable, protected common areas, and long carries.","Newton, Fleetwood and Guildford: Houses, townhouses, apartments and larger household inventories benefit from advance review of stairs, driveways, residential street access, building loading areas and furniture protection.","Cloverdale and rural Surrey: Some properties have longer driveways, gates, limited truck access or limited turnaround space. We review access before moving day without assuming every Cloverdale property is rural.","South Surrey: Newer homes, townhouses, condos and larger detached homes may need driveway, gated-community, possession-transition, packing or storage planning. Restrictions vary by property and should be confirmed with the customer or building."],faqs:${JSON.stringify(faqs.map(([question, answer]) => ({ question, answer })))}}},burnaby:{localPricing:`;
if (!oldConfig.test(bundle)) throw new Error("Surrey city config was not found");
const safeConfig = newConfig.replace(")))}}},burnaby", ")))}} ,burnaby");
const nextBundle = bundle.replace(oldConfig, safeConfig).replace("]}},burnaby:{localPricing:", "]},burnaby:{localPricing:");

const routeDefaults = '"/port-moody/": ["Port Moody, BC", ""],';
const nextBundleWithForm = nextBundle.includes('"/surrey/": ["Surrey, BC", ""]')
  ? nextBundle
  : nextBundle.replace(routeDefaults, `${routeDefaults}\n      "/surrey/": ["Surrey, BC", ""],`);

let nextPage = page;
nextPage = nextPage.replace(/<title>[\s\S]*?<\/title>/i, "<title>Movers in Surrey, BC | Local &amp; Long-Distance Moving</title>");
nextPage = nextPage.replace(/<meta name="description" content="[^"]*"[^>]*>/i, '<meta name="description" content="Movers in Surrey, BC for local and long-distance moves. Family-owned since 1991, based in Coquitlam, with packing, storage, and written estimates available." />');
nextPage = nextPage.replace(/<meta property="og:title" content="[^"]*"[^>]*>/i, '<meta property="og:title" content="Movers in Surrey, BC | Local &amp; Long-Distance Moving" />');
nextPage = nextPage.replace(/<meta property="og:description" content="[^"]*"[^>]*>/i, '<meta property="og:description" content="Movers in Surrey, BC for local and long-distance moves. Family-owned since 1991, based in Coquitlam, with packing, storage, and written estimates available." />');
nextPage = nextPage.replace(/<meta property="og:url" content="[^"]*"[^>]*>/i, '<meta property="og:url" content="https://purelycanadianmovers.com/surrey/" />');
nextPage = nextPage.replace(/<meta name="twitter:title" content="[^"]*"[^>]*>/i, '<meta name="twitter:title" content="Movers in Surrey, BC | Local &amp; Long-Distance Moving" />');
nextPage = nextPage.replace(/<meta name="twitter:description" content="[^"]*"[^>]*>/i, '<meta name="twitter:description" content="Movers in Surrey, BC for local and long-distance moves. Family-owned since 1991, based in Coquitlam, with packing, storage, and written estimates available." />');
nextPage = nextPage.replace(/<link rel="canonical" id="canonical-tag" href="[^"]*"[^>]*>/i, '<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com/surrey/">');
nextPage = nextPage.replace(/<script type="application\/ld\+json" id="pcm-faq-schema">[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="pcm-faq-schema">${faqJson}</script>`);
nextPage = nextPage.replace(/<script type="application\/ld\+json" id="faq-schema">[\s\S]*?<\/script>/gi, "");
nextPage = nextPage.replace(/(<h1\b[^>]*>)Professional Movers in Vancouver &amp; the Lower Mainland Since 1991(<\/h1>)/i, "$1Movers in Surrey, BC$2");
nextPage = nextPage.replaceAll('placeholder="Toronto, ON"', 'placeholder="Surrey, BC"');
nextPage = nextPage.replaceAll('placeholder="Calgary, AB"', 'placeholder="City or province"');
nextPage = nextPage.replaceAll('Valuation coverage available', 'Declared Value Protection available');
nextPage = nextPage.replaceAll('valuation coverage options', 'Declared Value Protection options');
nextPage = nextPage.replaceAll('Valuation Coverage', 'Declared Value Protection');
nextPage = nextPage.replaceAll("Metro Vancouver's most trusted family-owned moving company.", 'a family-owned moving company serving Metro Vancouver since 1991.');
nextPage = nextPage.replace(/\s*<script id="pcm-surrey-page-guard">[\s\S]*?<\/script>/i, "");
const guard = `<script id="pcm-surrey-page-guard">(function(){function setDefaults(){document.title='Movers in Surrey, BC | Local & Long-Distance Moving';document.querySelectorAll('script#faq-schema').forEach(function(s){s.remove()});document.querySelectorAll('input[name="from"]').forEach(function(i){i.placeholder='Surrey, BC';if(!i.value||/Toronto\\s*,?\\s*ON/i.test(i.value)){var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,'Surrey, BC');i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}});document.querySelectorAll('input[name="to"]').forEach(function(i){i.placeholder='City or province';if(/Calgary\\s*,?\\s*AB/i.test(i.value)){var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,'');i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}})}window.addEventListener('DOMContentLoaded',setDefaults);window.addEventListener('load',function(){setDefaults();setTimeout(setDefaults,500)});new MutationObserver(setDefaults).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
nextPage = nextPage.replace('</head>', `${guard}\n</head>`);

const staticFaqs = faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("");
nextPage = nextPage.replace(/<div class="pcm-local-seo__faqs">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i, `<div class="pcm-local-seo__faqs"><h2>Surrey moving questions</h2>${staticFaqs}</div></div></section>`);

await writeFile(bundlePath, nextBundleWithForm);
await writeFile(pagePath, nextPage);
let nextConversion = conversion.replaceAll('    "/surrey/": "Long-Distance Movers in Surrey BC | Moving Quotes",', '    "/surrey/": "Movers in Surrey, BC | Local & Long-Distance Moving",');
if (!nextConversion.includes('    "/surrey/": "Movers in Surrey, BC | Local & Long-Distance Moving",')) {
  nextConversion = nextConversion.replace('    "/": "Vancouver Movers | Local & Long-Distance Moving",', '    "/": "Vancouver Movers | Local & Long-Distance Moving",\n    "/surrey/": "Movers in Surrey, BC | Local & Long-Distance Moving",');
}
nextConversion = nextConversion.replaceAll('Long-distance movers in Surrey, BC for cross-Canada moves, packing, storage, valuation coverage, written estimates, and no broker-style handoffs.', 'Movers in Surrey, BC for local and long-distance moves. Family-owned since 1991, based in Coquitlam, with packing, storage, and written estimates available.');
nextConversion = nextConversion.replaceAll('eyebrow: "Surrey long-distance movers"', 'eyebrow: "Surrey movers"');
nextConversion = nextConversion.replaceAll('title: "Plan a long-distance move from Surrey, BC."', 'title: "Plan your Surrey move with local and long-distance support."');
nextConversion = nextConversion.replaceAll('Get help with Surrey long-distance routes, packing, storage, valuation coverage, route timing, and a written estimate from a direct mover.', 'Get help with local Surrey moves, long-distance routes, packing, storage, access planning, and a written estimate from our Coquitlam-based team.');
nextConversion = nextConversion.replace(/\s*"\/surrey\/": \{\s*title: "Long-distance movers in Surrey, BC with direct accountability",[\s\S]*?\n\s*\},\s*"\/port-moody\/": \{/i, '\n    "\/port-moody/": {');
await writeFile(conversionPath, nextConversion);
console.log("Updated Surrey bundle and static page.");
