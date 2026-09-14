import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertAllowedPostProcessor, assertRouteOwnership } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] || "site-copy";
const writer = "finalize-vancouver-edmonton-routes.mjs";
const priceRows = [
  ["Studio or small shipment", "$2,200+", "Best for limited furniture or a partial shipment", "4–13 days"],
  ["1-bedroom", "$2,800+", "Depends on inventory weight or volume, access, and packing", "4–13 days"],
  ["2-bedroom", "$3,800+", "Common planning range for apartment or condo moves", "4–13 days"],
  ["3-bedroom", "$5,200+", "Larger household shipment with more labour and space", "4–13 days"],
  ["4+ bedroom", "$7,000+", "Final quote depends heavily on inventory and services", "4–13 days"],
];

function routeFaqs(from, to) {
  const article = from === "Edmonton" ? "An" : "A";
  return [
    [`How long does it take to move from ${from} to ${to}?`, `${article} ${from} to ${to} move typically takes 4–13 days for delivery, depending on shipment size, scheduling, route planning, weather, and access. We will give you a realistic delivery window when you book your move.`],
    [`How much does it cost to move from ${from} to ${to}?`, `${from} to ${to} planning ranges start at $2,200+ for a studio or small shipment, $2,800+ for a 1-bedroom, $3,800+ for a 2-bedroom, $5,200+ for a 3-bedroom, and $7,000+ for a 4+ bedroom home. Contact us for a free, no-obligation estimate.`],
    [`Do you move from ${to} to ${from} as well?`, `Yes — we handle moves in both directions. Whether you are moving from ${from} to ${to} or ${to} to ${from}, our team provides the same professional service with Declared Value Protection options.`],
    ["Are you a direct carrier or do you use subcontractors?", "We do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, Declared Value Protection options, and no broker-style handoffs to unknown movers."],
    [`Do you provide packing services for ${from === "Edmonton" ? "an" : "a"} ${from}–${to} move?`, "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
    [`What Declared Value Protection is available for ${from === "Edmonton" ? "an" : "a"} ${from} to ${to} move?`, "We explain the Declared Value Protection included with your estimate and any additional protection options before your move date."],
    ["Do you offer packing and unpacking services?", "Yes. We offer full packing and unpacking services for long-distance moves. Our team carefully packs fragile items, artwork, and electronics, and packing can be added to your written estimate."],
    ["What makes Purely Canadian Movers different?", "We're family-owned since 1991 with 30+ years of experience. We coordinate long-distance moves through the Great Canadian Van Lines agent network with clear accountability, transparent pricing, and no broker-style handoffs to unknown movers. We're also BBB Accredited."],
    ["Do you offer storage solutions?", `Yes. We offer flexible short- and long-term storage. If your new ${to} home is not ready, we can arrange storage and delivery timing around your move plan.`],
  ];
}

const routes = [
  {
    slug: "vancouver-to-edmonton-movers",
    from: "Vancouver",
    fromProvince: "BC",
    to: "Edmonton",
    toProvince: "AB",
    title: "Vancouver to Edmonton Movers | Purely Canadian Movers",
    description: "Vancouver to Edmonton movers. Professional, fully insured long-distance moves. Family-owned since 1991. GCVL agents. Free estimates.",
  },
  {
    slug: "edmonton-to-vancouver-movers",
    from: "Edmonton",
    fromProvince: "AB",
    to: "Vancouver",
    toProvince: "BC",
    title: "Edmonton to Vancouver Movers | Alberta to BC Moving | Purely Canadian Movers",
    description: "Edmonton to Vancouver movers. Professional, fully insured long-distance moves. Family-owned since 1991. GCVL agents. Free estimates.",
  },
].map((route) => ({ ...route, faqs: routeFaqs(route.from, route.to) }));

const ownedStaticRoutes = routes.filter(({ slug }) => slug === "vancouver-to-edmonton-movers");
const spaPostProcessedRoutes = routes.filter(({ slug }) => slug !== "vancouver-to-edmonton-movers");

assertRouteOwnership(writer, ownedStaticRoutes.map(({ slug }) => slug));
assertAllowedPostProcessor(writer, spaPostProcessedRoutes.map(({ slug }) => slug));

const markerStart = "<!-- STEP6_VANCOUVER_EDMONTON_START -->";
const markerEnd = "<!-- STEP6_VANCOUVER_EDMONTON_END -->";

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function faqSchema(faqs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
}

function faqSection(config) {
  const cards = config.faqs.map(([question, answer]) => `
<div class="bg-white rounded-xl p-6 border border-gray-200">
<h3 class="font-heading text-base font-bold text-gray-900 mb-2">${escapeHtml(question)}</h3>
<p class="font-body text-sm text-gray-600 leading-relaxed">${escapeHtml(answer)}</p>
</div>`).join("");

  return `<section id="pcm-step6-route-faq" class="py-16 bg-gray-50 pcm-step6-faq">
<div class="container max-w-3xl">
<h2 class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
<div class="space-y-4" data-pcm-route-faq-list>${cards}
</div>
</div>
</section>`;
}

function replaceFaqSection(html, config) {
  const headingIndex = html.indexOf("Frequently Asked Questions");
  const sectionStart = html.lastIndexOf("<section", headingIndex);
  const sectionEnd = html.indexOf("</section>", headingIndex);
  if (headingIndex < 0 || sectionStart < 0 || sectionEnd < 0) {
    throw new Error(`Could not locate the existing FAQ section for /${config.slug}/`);
  }
  return `${html.slice(0, sectionStart)}${faqSection(config)}${html.slice(sectionEnd + "</section>".length)}`;
}

function routeRuntime(config) {
  const faqs = JSON.stringify(config.faqs).replaceAll("<", "\\u003c");
  const rows = JSON.stringify(priceRows).replaceAll("<", "\\u003c");
  return `${markerStart}
<style id="pcm-step6-vancouver-edmonton-styles">
body.pcm-step6-vancouver-edmonton .pcm-step6-glance{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:40px}
body.pcm-step6-vancouver-edmonton .pcm-step6-glance>h3{font-family:"Playfair Display",serif;font-size:20px;line-height:28px;font-weight:700;color:#111827;margin:0 0 16px}
body.pcm-step6-vancouver-edmonton .pcm-step6-glance__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
body.pcm-step6-vancouver-edmonton .pcm-step6-glance__item{display:flex;align-items:flex-start;gap:12px;min-width:0}
body.pcm-step6-vancouver-edmonton .pcm-step6-glance__icon{color:#cc1a1a;flex:0 0 auto;margin-top:2px;width:20px;height:20px}
body.pcm-step6-vancouver-edmonton .pcm-step6-glance__label{font:400 12px/16px "Source Sans 3",sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:0 0 2px}
body.pcm-step6-vancouver-edmonton .pcm-step6-glance__value{font:700 18px/28px "Playfair Display",serif;color:#111827;margin:0}
body.pcm-step6-vancouver-edmonton .pcm-step6-glance__qualifier{font:400 14px/20px "Source Sans 3",sans-serif;color:#6b7280;margin:0}
body.pcm-step6-vancouver-edmonton .pcm-step6-faq h3{font-size:16px;line-height:24px}
body.pcm-step6-vancouver-edmonton .pcm-step6-faq h3+p{font-size:14px;line-height:22.75px}
body.pcm-step6-vancouver-edmonton .pcm-step6-nav-menu{position:absolute;top:100%;left:0;z-index:60;width:224px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;box-shadow:0 10px 24px rgba(17,24,39,.14);padding:8px 0}
body.pcm-step6-vancouver-edmonton .pcm-step6-nav-menu a{display:block;padding:8px 16px;color:#111827;font:600 14px/20px "Source Sans 3",sans-serif;text-decoration:none}
body.pcm-step6-vancouver-edmonton .pcm-step6-nav-menu a:hover,body.pcm-step6-vancouver-edmonton .pcm-step6-nav-menu a:focus{color:#cc1a1a;background:#f9fafb}
body.pcm-step6-vancouver-edmonton .pcm-step6-sheet{position:fixed;inset:0;z-index:100}
body.pcm-step6-vancouver-edmonton .pcm-step6-sheet__overlay{position:absolute;inset:0;border:0;background:rgba(17,24,39,.55)}
body.pcm-step6-vancouver-edmonton .pcm-step6-sheet__panel{position:absolute;right:0;top:0;height:100%;width:min(320px,100vw);overflow-y:auto;background:#fff;padding:24px;box-shadow:-12px 0 30px rgba(17,24,39,.18);font-family:"Source Sans 3",sans-serif}
body.pcm-step6-vancouver-edmonton .pcm-step6-sheet__close{display:flex;margin:0 0 20px auto;width:44px;height:44px;align-items:center;justify-content:center;border:1px solid #d1d5db;border-radius:8px;background:#fff;font-size:24px}
body.pcm-step6-vancouver-edmonton .pcm-step6-sheet__group{margin:20px 0 8px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
body.pcm-step6-vancouver-edmonton .pcm-step6-sheet__panel a{display:block;padding:10px 0;color:#111827;font-size:16px;font-weight:600;text-decoration:none}
body.pcm-step6-vancouver-edmonton .pcm-step6-sheet__panel a:hover,body.pcm-step6-vancouver-edmonton .pcm-step6-sheet__panel a:focus{color:#cc1a1a}
@media(max-width:639px){body.pcm-step6-vancouver-edmonton .pcm-step6-glance__grid{grid-template-columns:1fr}}
</style>
<script id="pcm-step6-vancouver-edmonton-runtime">
(function(){
  var expectedPath="/${config.slug}/";
  if((location.pathname.replace(/\\/+$/,"/")!==expectedPath))return;
  var routeLabel="${config.from} to ${config.to}";
  var faqs=${faqs};
  var rows=${rows};
  function clean(value){return(value||"").replace(/\\s+/g," ").trim()}
  function faqSchemas(){return Array.prototype.filter.call(document.querySelectorAll('script[type="application/ld+json"]'),function(script){try{var data=JSON.parse(script.textContent);return data&&data["@type"]==="FAQPage"}catch(error){return false}})}
  function syncFaq(){
    var headings=Array.prototype.filter.call(document.querySelectorAll("h2"),function(item){return /^Frequently Asked Questions$/i.test(clean(item.textContent))});
    var heading=headings[0];var section=heading&&heading.closest("section");if(!section)return false;
    for(var i=1;i<headings.length;i++){var duplicate=headings[i].closest("section");if(duplicate&&duplicate!==section)duplicate.remove()}
    section.className="py-16 bg-gray-50 pcm-step6-faq";var container=section.querySelector(":scope > .container");if(container)container.className="container max-w-3xl";
    heading.textContent="Frequently Asked Questions";heading.className="font-heading text-3xl font-bold text-gray-900 mb-8 text-center";
    var list=heading.nextElementSibling;if(!list){list=document.createElement("div");heading.after(list)}list.className="space-y-4";list.innerHTML="";
    faqs.forEach(function(item){var card=document.createElement("div");card.className="bg-white rounded-xl p-6 border border-gray-200";var question=document.createElement("h3");question.className="font-heading text-base font-bold text-gray-900 mb-2";question.textContent=item[0];var answer=document.createElement("p");answer.className="text-sm text-gray-600 leading-relaxed";answer.textContent=item[1];card.appendChild(question);card.appendChild(answer);list.appendChild(card)});
    faqSchemas().forEach(function(script){if(script.id!=="pcm-step6-route-faq-schema")script.remove()});
    var schema=document.getElementById("pcm-step6-route-faq-schema");if(!schema){schema=document.createElement("script");schema.type="application/ld+json";schema.id="pcm-step6-route-faq-schema";document.head.appendChild(schema)}
    schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(function(item){return{"@type":"Question",name:item[0],acceptedAnswer:{"@type":"Answer",text:item[1]}}})});return true;
  }
  function removeLegacyAndDuplicateSections(){
    var seen={};Array.prototype.forEach.call(document.querySelectorAll("h2"),function(heading){var text=clean(heading.textContent);if(/Moving Cost Breakdown$|^Route Pricing$/i.test(text)){var costSection=heading.closest("section");if(costSection&&!costSection.classList.contains("pcm-route-cost"))costSection.remove();return}if(/^What Makes (?:a|an) (?:Vancouver|Edmonton).+ Move Unique$/i.test(text)){if(seen[text.replace(/^What Makes (?:a|an) /i,"")]){heading.closest("section")&&heading.closest("section").remove()}else seen[text.replace(/^What Makes (?:a|an) /i,"")]=true}});
    Array.prototype.forEach.call(document.querySelectorAll(".pcm-trust-proof,.pcm-local-seo"),function(block){block.remove()});
    return !/Moving Cost Breakdown|Route Pricing/i.test(document.body.innerText);
  }
  function normalizePricing(){
    var cost=document.querySelector(".pcm-route-cost");if(!cost)return false;
    var heading=cost.querySelector("h2");if(heading)heading.textContent="How much does it cost to move from ${config.from} to ${config.to}?";
    var intro=cost.querySelector("h2 + p");if(intro)intro.innerHTML=("${config.from}"==="Edmonton"?"An ":"A ")+routeLabel+' move typically ranges from about <strong>$2,200+</strong> for a small shipment to <strong>$7,000+</strong> for a 4+ bedroom home. Many 1–2 bedroom moves are estimated around <strong>$2,800–$3,800+</strong>, depending on weight or volume, access, packing, storage, season, and Declared Value Protection.';
    var table=cost.querySelector("table");if(table){var tbody=table.querySelector("tbody");if(tbody){tbody.innerHTML="";rows.forEach(function(row){var tr=document.createElement("tr");row.forEach(function(value){var td=document.createElement("td");td.textContent=value;tr.appendChild(td)});tbody.appendChild(tr)})}}
    var note=cost.querySelector(".pcm-route-cost__note");if(note)note.textContent="Prices are planning ranges in CAD, not guaranteed quotes. "+routeLabel+" pricing depends on inventory weight or volume, pickup and delivery access, stairs, elevators, packing, storage timing, specialty items, service dates, and the selected Declared Value Protection option.";
    return !!table;
  }
  function normalizeGlance(){
    if(document.querySelector(".pcm-step6-glance"))return true;
    var headings=Array.prototype.filter.call(document.querySelectorAll("h2,h3"),function(item){return /Route at a Glance/i.test(clean(item.textContent))});
    var introHeading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return clean(item.textContent)==="Moving from ${config.from} to ${config.to}?"});var introContainer=introHeading&&introHeading.parentElement;
    if(!headings.length||!introContainer)return false;
    headings.forEach(function(heading){var oldSection=heading.closest("section");if(oldSection&&oldSection!==introHeading.closest("section"))oldSection.remove()});
    var icon='<svg class="pcm-step6-glance__icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle></svg>';
    function item(label,value,qualifier){return '<div class="pcm-step6-glance__item">'+icon+'<div><p class="pcm-step6-glance__label">'+label+'</p><p class="pcm-step6-glance__value">'+value+'</p><p class="pcm-step6-glance__qualifier">'+qualifier+'</p></div></div>'}
    var card=document.createElement("div");card.className="pcm-step6-glance";card.innerHTML='<h3>${config.from}–${config.to} Route at a Glance</h3><div class="pcm-step6-glance__grid">'+item("Distance","~1,160 km",routeLabel)+item("Est. Transit Time","4–13 days","Depending on shipment size")+item("Typical Cost Range","$2,200–$7,000+","Studio to 4+ bedroom home")+'</div>';introContainer.appendChild(card);return true;
  }
  function normalizeLayout(){
    var root=document.getElementById("root");var main=root&&root.querySelector("main");var layout=main&&main.parentElement;var header=root&&root.querySelector("header");var footer=root&&root.querySelector("footer");var hero=root&&root.querySelector("section h1");hero=hero&&hero.closest("section");var quote=document.querySelector(".pcm-lead-panel");var pricing=document.querySelector(".pcm-route-cost");
    if(!root||!header||!footer||!hero||!quote||!pricing)return false;
    var topbar=Array.prototype.find.call(root.children,function(node){return node!==layout&&node.tagName==="DIV"&&!node.querySelector("h1")&&/Family-owned since 1991/.test(node.textContent||"")&&/1-877-485-6683/.test(node.textContent||"")});
    var trust=Array.prototype.find.call(root.children,function(node){return node.tagName==="DIV"&&/Trusted by thousands of Canadian families/.test(node.textContent||"")});
    function ensureTrust(){var existing=Array.prototype.find.call(main.children,function(node){return node.tagName==="DIV"&&/Trusted by thousands of Canadian families/.test(node.textContent||"")});if(!existing){existing=document.createElement("div");existing.className="bg-[#CC1A1A] text-white py-3";existing.innerHTML='<div class="container text-center font-body text-sm font-semibold">Trusted by thousands of Canadian families since 1991 — BBB Accredited, family-owned, with no broker-style handoffs to unknown movers.</div>'}hero.after(existing)}
    if(main&&layout){root.insertBefore(quote,layout);root.insertBefore(pricing,layout);if(topbar&&!header.contains(topbar))header.insertBefore(topbar,header.firstElementChild);ensureTrust();return true}
    var routeSections=Array.prototype.filter.call(root.children,function(node){return node.tagName==="SECTION"&&!node.classList.contains("pcm-lead-panel")&&!node.classList.contains("pcm-route-cost")});
    layout=document.createElement("div");layout.className="min-h-screen flex flex-col";main=document.createElement("main");main.className="flex-1";root.insertBefore(layout,header);if(topbar)header.insertBefore(topbar,header.firstElementChild);layout.appendChild(header);layout.appendChild(main);
    routeSections.forEach(function(section,index){main.appendChild(section);if(index===0&&trust)main.appendChild(trust)});ensureTrust();layout.appendChild(footer);root.insertBefore(quote,layout);root.insertBefore(pricing,layout);return true;
  }
  function normalizeMain(){
    var faqHeading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return /^Frequently Asked Questions$/i.test(clean(item.textContent))});var faqSection=faqHeading&&faqHeading.closest("section");
    Array.prototype.forEach.call(document.querySelectorAll("main section, #root>div>section"),function(section){if(section===faqSection||section.querySelector("h1")||section.classList.contains("pcm-lead-panel")||section.classList.contains("pcm-route-cost"))return;var h2=section.querySelector("h2");if(!h2)return;var text=clean(h2.textContent);if(/Related Destinations|Ready to Move/i.test(text))return;var container=section.querySelector(":scope > .container");if(container&&!/Moving from /.test(text)){container.classList.remove("max-w-3xl");container.classList.add("max-w-4xl")}if(!/Moving from /.test(text)){h2.classList.remove("text-3xl");h2.classList.add("text-2xl");h2.classList.remove("mb-10","mb-12");h2.classList.add("mb-6")}Array.prototype.forEach.call(section.querySelectorAll("h3"),function(h3){h3.classList.remove("text-lg");h3.classList.add("text-base")});Array.prototype.forEach.call(section.querySelectorAll(".p-6"),function(card){if(card.querySelector("h3")&&!card.closest(".pcm-step6-glance")){card.classList.remove("p-6");card.classList.add("p-5")}})});
    Array.prototype.forEach.call(document.querySelectorAll("main h2,main p"),function(node){var text=node.textContent||"";if(/What Makes a Edmonton/.test(text))node.textContent=text.replace("What Makes a Edmonton","What Makes an Edmonton");else if(/roughly 1800 km/i.test(text))node.innerHTML=node.innerHTML.replace(/roughly 1800 km/ig,"roughly 1,160 km");else if(/Edmonton's mild, wet winters/.test(text))node.innerHTML=node.innerHTML.replace(/Edmonton's mild, wet winters mean we protect electronics and wood furniture from moisture during transit\. Summer moves are popular but require early scheduling\./g,"Edmonton's cold winters require careful protection for temperature-sensitive items and flexible planning around snow and road conditions. Summer is the busiest season, so early scheduling is recommended.");else if(/Calgary's lower cost of living and mountain proximity/.test(text))node.innerHTML=node.innerHTML.replace(/Calgary's lower cost of living and mountain proximity/g,"Vancouver's coastal lifestyle and employment opportunities");else if(/deliver in Calgary/.test(text))node.innerHTML=node.innerHTML.replace(/deliver in Calgary/g,"deliver in Vancouver");else if(/fully insured long-distance moving/i.test(text))node.innerHTML=node.innerHTML.replace(/fully insured long-distance moving/ig,"professionally coordinated long-distance moving with Declared Value Protection options")});
  }
  function ensureFallbackNavigation(){
    if(expectedPath!=="/vancouver-to-edmonton-movers/")return true;
    var header=document.querySelector("header");if(!header||header.dataset.step6Navigation==="ready")return !!header;header.dataset.step6Navigation="ready";
    var groups={
      "Services":[["Services Overview","/services/"],["Local Moving","/local/"],["Long-Distance Moving","/long-distance/"],["Cross-Country Moves","/cross-country-movers/"],["Canada–USA Moves","/canada-usa/"],["Overseas Moving","/overseas/"],["Storage Solutions","/storage/"],["Office & Corporate Moves","/office/"],["Packing & Unpacking","/packing/"],["Declared Value Protection","/valuation-coverage-protection/"]],
      "Local Moves":[["Vancouver","/vancouver/"],["Coquitlam","/coquitlam/"],["Surrey","/surrey/"],["Burnaby","/burnaby/"],["Richmond","/richmond/"],["Langley","/langley/"],["Delta","/delta/"],["White Rock","/white-rock/"]],
      "Long-Distance":[["Long-Distance Overview","/long-distance/"],["Vancouver Long-Distance Movers","/vancouver-long-distance-movers/"],["Edmonton Long-Distance Movers","/edmonton-long-distance-movers/"],["Toronto Long-Distance Movers","/long-distance-movers-toronto/"],["Montreal Long-Distance Movers","/long-distance-movers-montreal/"],["Moving Cost Guide","/long-distance-moving-cost-canada/"]]
    };
    var openMenu=null;
    function closeDesktop(){if(openMenu){openMenu.remove();openMenu=null}Object.keys(groups).forEach(function(label){var button=Array.prototype.find.call(header.querySelectorAll("button"),function(item){return clean(item.textContent)===label});if(button)button.setAttribute("aria-expanded","false")})}
    Object.keys(groups).forEach(function(label){var button=Array.prototype.find.call(header.querySelectorAll("button"),function(item){return clean(item.textContent)===label});if(!button)return;button.setAttribute("aria-expanded","false");button.addEventListener("click",function(event){event.stopPropagation();var wasOpen=openMenu&&openMenu.dataset.group===label;closeDesktop();if(wasOpen)return;var menu=document.createElement("div");menu.className="pcm-step6-nav-menu";menu.dataset.group=label;menu.setAttribute("role","menu");groups[label].forEach(function(item){var link=document.createElement("a");link.href=item[1];link.textContent=item[0];link.setAttribute("role","menuitem");menu.appendChild(link)});button.parentElement.appendChild(menu);button.setAttribute("aria-expanded","true");openMenu=menu})});
    document.addEventListener("click",closeDesktop);
    var trigger=header.querySelector('button[aria-label="Open menu"]');if(trigger)trigger.addEventListener("click",function(){if(document.querySelector(".pcm-step6-sheet"))return;var sheet=document.createElement("div");sheet.className="pcm-step6-sheet";var overlay=document.createElement("button");overlay.type="button";overlay.className="pcm-step6-sheet__overlay";overlay.setAttribute("aria-label","Close menu");var panel=document.createElement("aside");panel.className="pcm-step6-sheet__panel";panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-label","Mobile navigation");var close=document.createElement("button");close.type="button";close.className="pcm-step6-sheet__close";close.setAttribute("aria-label","Close menu");close.textContent="×";panel.appendChild(close);var home=document.createElement("a");home.href="/";home.textContent="Home";panel.appendChild(home);Object.keys(groups).forEach(function(label){var heading=document.createElement("div");heading.className="pcm-step6-sheet__group";heading.textContent=label;panel.appendChild(heading);groups[label].forEach(function(item){var link=document.createElement("a");link.href=item[1];link.textContent=item[0];panel.appendChild(link)})});[["Storage","/storage/"],["Our Network","/our-network/"],["Blog","/blog/"],["Reviews","/testimonials/"],["Contact","/contact/"]].forEach(function(item){var link=document.createElement("a");link.href=item[1];link.textContent=item[0];panel.appendChild(link)});sheet.appendChild(overlay);sheet.appendChild(panel);document.body.appendChild(sheet);trigger.setAttribute("aria-expanded","true");function dismiss(){sheet.remove();trigger.setAttribute("aria-expanded","false");trigger.focus()}overlay.addEventListener("click",dismiss);close.addEventListener("click",dismiss);sheet.addEventListener("keydown",function(event){if(event.key==="Escape")dismiss()});close.focus()});
    return true;
  }
  function normalize(){
    document.body.classList.add("pcm-step6-vancouver-edmonton");document.title=${JSON.stringify(config.title)};
    var description=document.querySelector('meta[name="description"]');if(description)description.content=${JSON.stringify(config.description)};var canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href="https://purelycanadianmovers.com/${config.slug}/";var ogUrl=document.querySelector('meta[property="og:url"]');if(ogUrl)ogUrl.content="https://purelycanadianmovers.com/${config.slug}/";var ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=${JSON.stringify(config.title)};var ogDescription=document.querySelector('meta[property="og:description"]');if(ogDescription)ogDescription.content=${JSON.stringify(config.description)};var twitterTitle=document.querySelector('meta[name="twitter:title"]');if(twitterTitle)twitterTitle.content=${JSON.stringify(config.title)};var twitterDescription=document.querySelector('meta[name="twitter:description"]');if(twitterDescription)twitterDescription.content=${JSON.stringify(config.description)};
    var form=document.querySelector(".pcm-lead-panel form");if(form){var from=form.querySelector('[name="from"]');var to=form.querySelector('[name="to"]');if(from)from.placeholder="${config.from}, ${config.fromProvince}";if(to)to.placeholder="${config.to}, ${config.toProvince}"}
    var cleanDone=removeLegacyAndDuplicateSections();var pricingDone=normalizePricing();var glanceDone=normalizeGlance();var layoutDone=normalizeLayout();normalizeMain();var faqDone=syncFaq();var navigationDone=ensureFallbackNavigation();return cleanDone&&pricingDone&&glanceDone&&layoutDone&&faqDone&&navigationDone;
  }
  var attempts=0;var timer=window.setInterval(function(){attempts+=1;normalize();if(attempts>40)window.clearInterval(timer)},250);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize);else normalize();
})();
</script>
${markerEnd}`;
}

for (const config of routes) {
  const file = join(outDir, config.slug, "index.html");
  let html = await readFile(file, "utf8");
  if (config.slug === "vancouver-to-edmonton-movers") {
    if (!html.includes('<div id="root">') || !html.includes("Vancouver to Edmonton Movers")) {
      throw new Error(`ERROR: ${file} is missing its checked-in static route source.`);
    }
    if (/type=["']module["'][^>]+index-CNBNs70h\.js/i.test(html)) {
      throw new Error(`ERROR: ${file} contains the SPA bootstrap even though the React router has no Vancouver to Edmonton route.`);
    }
  }
  const canonical = `https://purelycanadianmovers.com/${config.slug}/`;
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(config.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(config.description)}">`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:title" content="${escapeHtml(config.title)}">`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:description" content="${escapeHtml(config.description)}">`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:title" content="${escapeHtml(config.title)}">`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:description" content="${escapeHtml(config.description)}">`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`)
    .replace(/<section class="pcm-lead-boost pcm-trust-proof"[\s\S]*?<\/section>\s*/gi, "")
    .replace(/<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*(?=<script defer="" src="https:\/\/manus-analytics\.com\/umami")/i, "")
    .replace(new RegExp(`\\s*${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "\n")
    .replace(/\s*<script[^>]*id="pcm-step6-route-faq-schema"[^>]*>[\s\S]*?<\/script>\s*/gi, "\n")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, (script) => script.includes('"@type":"FAQPage"') || script.includes('"@type": "FAQPage"') ? "" : script);
  html = html
    .replace(/Professional, fully insured long-distance moving/gi, "Professional long-distance moving with Declared Value Protection options")
    .replace(/valuation coverage options/gi, "Declared Value Protection options")
    .replace(/Valuation coverage available/g, "Declared Value Protection available");
  html = replaceFaqSection(html, config);
  const rawSchema = `<script type="application/ld+json" id="pcm-step6-route-faq-schema">${faqSchema(config.faqs)}</script>`;
  html = html.replace(/\s*<\/head>/i, "\n</head>").replace("</head>", `${rawSchema}\n</head>`);
  html = html.replace(/\s*<\/body>/i, "\n</body>").replace("</body>", `${routeRuntime(config)}\n</body>`);
  html = html.replace(/^[ \t]+$/gm, "");
  await writeFile(file, html);
  console.log(`Finalized ${file}`);
}
