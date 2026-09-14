import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] || "site-copy";
const writer = "finalize-calgary-toronto-routes.mjs";
const routes = [
  {
    slug: "calgary-to-toronto-movers", from: "Calgary", fromProvince: "AB", to: "Toronto", toProvince: "ON",
    title: "Calgary to Toronto Movers | Purely Canadian Movers",
    description: "Calgary to Toronto movers. Professional long-distance moves with Declared Value Protection options. Family-owned since 1991. GCVL agents. Free estimates.",
    faqs: [
      ["How long does it take to move from Calgary to Toronto?", "A Calgary to Toronto move typically takes 7–19 days for delivery, depending on the size of your shipment, scheduling, and route logistics. We will give you a realistic delivery window when you book your move."],
      ["How much does it cost to move from Calgary to Toronto?", "Calgary to Toronto planning ranges start at $2,500+ for a studio or small shipment, $3,800+ for a 1-bedroom, $6,400+ for a 2-bedroom, $10,000+ for a 3-bedroom, and $15,000+ for a 4+ bedroom home. Contact us for a free, no-obligation estimate."],
      ["Do you move from Toronto to Calgary as well?", "Yes — we handle moves in both directions. Whether you are moving from Calgary to Toronto or Toronto to Calgary, our team provides the same professional service with Declared Value Protection options."],
      ["Are you a direct carrier or do you use subcontractors?", "We do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, Declared Value Protection options, and no broker-style handoffs to unknown movers."],
      ["Do you provide packing services for a Calgary–Toronto move?", "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
      ["What Declared Value Protection is available for a Calgary to Toronto move?", "We explain the Declared Value Protection included with your estimate and any additional protection options before your move date."],
      ["What is the best time of year to move from Calgary to Toronto?", "Late spring (May–June) and early fall (September–October) are ideal. Summer is peak season — book 4–8 weeks in advance. Winter moves are possible but require extra planning for weather conditions."],
      ["Can I get a written estimate for my Calgary to Toronto move?", "Yes. We provide written estimates based on an in-home or virtual inventory assessment. A written estimate explains the expected planning range and services included before moving day."],
      ["Do you offer storage if my Toronto home isn’t ready?", "Yes. We offer both short-term and long-term storage options. If your new Toronto home isn’t ready on arrival day, we can hold your belongings securely and deliver when you’re ready."],
      ["What should I do before the movers arrive?", "Defrost your fridge 24 hours ahead, disconnect appliances, label boxes by room, and set aside essentials such as medications, chargers, and documents in a bag you’ll carry yourself. If you’re in a condo, book the elevator and loading dock in advance."],
      ["What makes Purely Canadian Movers different from other long-distance movers?", "We’re family-owned since 1991 with 30+ years of experience on cross-country Canadian routes. We coordinate through the Great Canadian Van Lines agent network, are BBB Accredited, offer transparent pricing with no hidden fees, and provide a dedicated point of contact throughout your move."],
    ],
  },
  {
    slug: "toronto-to-calgary-movers", from: "Toronto", fromProvince: "ON", to: "Calgary", toProvince: "AB",
    title: "Toronto to Calgary Moving Cost | Movers, Prices & Transit Time | Purely Canadian Movers",
    description: "Toronto to Calgary moving cost guide with estimated prices by home size, transit time, quote factors, packing, storage, valuation options, and direct movers.",
    faqs: [
      ["How long does it take to move from Toronto to Calgary?", "A Toronto to Calgary move typically takes 7–19 days for delivery, depending on the size of your shipment, scheduling, and route logistics. We will give you a realistic delivery window when you book your move."],
      ["How much does it cost to move from Toronto to Calgary?", "Toronto to Calgary planning ranges start at $2,500+ for a studio or small shipment, $3,800+ for a 1-bedroom, $6,400+ for a 2-bedroom, $10,000+ for a 3-bedroom, and $15,000+ for a 4+ bedroom home. Contact us for a free, no-obligation estimate."],
      ["Do you move from Calgary to Toronto as well?", "Yes — we handle moves in both directions. Whether you are moving from Toronto to Calgary or Calgary to Toronto, our team provides the same professional service with Declared Value Protection options."],
      ["Are you a direct carrier or do you use subcontractors?", "We do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, Declared Value Protection options, and no broker-style handoffs to unknown movers."],
      ["Do you provide packing services for a Toronto–Calgary move?", "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
      ["What Declared Value Protection is available for a Toronto to Calgary move?", "We explain the Declared Value Protection included with your estimate and any additional protection options before your move date."],
      ["Do you offer packing and unpacking services?", "Yes, we offer full packing and unpacking services for all long-distance moves. Our team carefully packs fragile items, artwork, and electronics. Packing can be added to any quote for an additional fee."],
      ["What makes Purely Canadian Movers different?", "We’re family-owned since 1991 with 30+ years of experience. We coordinate through the Great Canadian Van Lines agent network with clear accountability, transparent pricing, and no broker-style handoffs to unknown movers. We’re BBB Accredited and specialize in long-distance moves across Canada."],
      ["Do you offer storage solutions?", "Yes, we offer flexible storage options for both short-term and long-term needs. Whether you need storage while waiting for your new home to be ready or temporary storage during your move, we can accommodate your requirements."],
    ],
  },
];

assertAllowedPostProcessor(writer, routes.map(({ slug }) => slug));
const markerStart = "<!-- STEP22_CALGARY_TORONTO_START -->";
const markerEnd = "<!-- STEP22_CALGARY_TORONTO_END -->";
const pricingRows = [
  ["Studio or small shipment", "$2,500+", "Best for limited furniture or a partial shipment", "7–19 days"],
  ["1-bedroom", "$3,800+", "Depends on inventory weight or volume, access, and packing", "7–19 days"],
  ["2-bedroom", "$6,400+", "Common planning range for apartment or condo moves", "7–19 days"],
  ["3-bedroom", "$10,000+", "Larger household shipment with more labour and space", "7–19 days"],
  ["4+ bedroom", "$15,000+", "Final quote depends heavily on inventory and services", "7–19 days"],
];

function escapeHtml(value) { return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function faqSchema(faqs) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) });
}

function faqSection(faqs) {
  const cards = faqs.map(([question, answer]) => `<div class="bg-white rounded-xl p-6 border border-gray-200"><h3 class="font-heading text-base font-bold text-gray-900 mb-2">${escapeHtml(question)}</h3><p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(answer)}</p></div>`).join("");
  return `<section class="py-16 bg-gray-50 pcm-step22-faq" data-pcm-step54-source-faq><div class="container max-w-3xl"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2><div class="space-y-4">${cards}</div></div></section>`;
}

function replaceVisibleFaq(html, config) {
  const heading = ">Frequently Asked Questions</h2>";
  const headingIndex = html.indexOf(heading);
  if (headingIndex < 0) throw new Error(`${config.slug}: visible FAQ heading not found`);
  const sectionStart = html.lastIndexOf("<section", headingIndex);
  const sectionEnd = html.indexOf("</section>", headingIndex);
  if (sectionStart < 0 || sectionEnd < 0) throw new Error(`${config.slug}: visible FAQ section boundary not found`);
  return `${html.slice(0, sectionStart)}${faqSection(config.faqs)}${html.slice(sectionEnd + "</section>".length)}`;
}

function routeRuntime(config) {
  const faqs = JSON.stringify(config.faqs).replaceAll("<", "\\u003c");
  const rows = JSON.stringify(pricingRows).replaceAll("<", "\\u003c");
  return `${markerStart}
<style id="pcm-step22-calgary-toronto-styles">
body.pcm-step22-calgary-toronto .pcm-step22-glance{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:40px}
body.pcm-step22-calgary-toronto .pcm-step22-glance>h3{font-family:"Playfair Display",serif;font-size:20px;line-height:28px;font-weight:700;color:#111827;margin:0 0 16px}
body.pcm-step22-calgary-toronto .pcm-step22-glance__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
body.pcm-step22-calgary-toronto .pcm-step22-glance__item{display:flex;align-items:flex-start;gap:12px;min-width:0}
body.pcm-step22-calgary-toronto .pcm-step22-glance__icon{color:#cc1a1a;flex:0 0 auto;margin-top:2px;width:20px;height:20px}
body.pcm-step22-calgary-toronto .pcm-step22-glance__label{font:400 12px/16px "Source Sans 3",sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:0 0 2px}
body.pcm-step22-calgary-toronto .pcm-step22-glance__value{font:700 18px/28px "Playfair Display",serif;color:#111827;margin:0}
body.pcm-step22-calgary-toronto .pcm-step22-glance__qualifier{font:400 14px/20px "Source Sans 3",sans-serif;color:#6b7280;margin:0}
body.pcm-step22-calgary-toronto .pcm-step22-faq h3{font-size:16px;line-height:24px}
body.pcm-step22-calgary-toronto .pcm-step22-faq h3+p{font-size:14px;line-height:22.75px}
@media(max-width:639px){body.pcm-step22-calgary-toronto .pcm-step22-glance__grid{grid-template-columns:1fr}}
</style>
<script id="pcm-step22-calgary-toronto-runtime">
(function(){
  var expectedPath="/${config.slug}/";if(location.pathname.replace(/\\/+$/,"/")!==expectedPath)return;
  var routeLabel="${config.from} to ${config.to}",faqs=${faqs},rows=${rows};
  function clean(value){return(value||"").replace(/\\s+/g," ").trim()}
  function faqSchemas(){return Array.prototype.filter.call(document.querySelectorAll('script[type="application/ld+json"]'),function(script){try{return JSON.parse(script.textContent)["@type"]==="FAQPage"}catch(error){return false}})}
  function syncFaq(){
    var headings=Array.prototype.filter.call(document.querySelectorAll("h2,h3"),function(item){return /^Frequently Asked Questions$/i.test(clean(item.textContent))}),heading=headings[0],section=heading&&heading.closest("section");if(!section)return false;
    for(var i=1;i<headings.length;i++){var duplicate=headings[i].closest("section");if(duplicate&&duplicate!==section)duplicate.remove()}
    section.className="py-16 bg-gray-50 pcm-step22-faq";var container=section.querySelector(":scope > .container");if(container)container.className="container max-w-3xl";heading.className="font-heading text-3xl font-bold text-gray-900 mb-8 text-center";
    var list=heading.nextElementSibling;if(!list){list=document.createElement("div");heading.after(list)}list.className="space-y-4";list.innerHTML="";
    faqs.forEach(function(item){var card=document.createElement("div"),question=document.createElement("h3"),answer=document.createElement("p");card.className="bg-white rounded-xl p-6 border border-gray-200";question.className="font-heading text-base font-bold text-gray-900 mb-2";answer.className="text-sm text-gray-600 leading-relaxed";question.textContent=item[0];answer.textContent=item[1];card.append(question,answer);list.appendChild(card)});
    faqSchemas().forEach(function(script){if(script.id!=="pcm-step22-route-faq-schema")script.remove()});var schema=document.getElementById("pcm-step22-route-faq-schema");if(!schema){schema=document.createElement("script");schema.type="application/ld+json";schema.id="pcm-step22-route-faq-schema";document.head.appendChild(schema)}schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(function(item){return{"@type":"Question",name:item[0],acceptedAnswer:{"@type":"Answer",text:item[1]}}})});return true;
  }
  function normalizePricing(){
    var costs=Array.prototype.slice.call(document.querySelectorAll(".pcm-route-cost"));if(!costs.length)return false;for(var i=1;i<costs.length;i++)costs[i].remove();var cost=costs[0];Array.prototype.forEach.call(document.querySelectorAll("h2"),function(h){if(/Moving Cost Breakdown$|^Route Pricing$/i.test(clean(h.textContent))){var s=h.closest("section");if(s&&s!==cost)s.remove()}});
    var heading=cost.querySelector("h2");if(heading)heading.textContent="How much does it cost to move from ${config.from} to ${config.to}?";var intro=cost.querySelector("h2 + p");if(intro)intro.innerHTML='A '+routeLabel+' move typically ranges from about <strong>$2,500+</strong> for a small shipment to <strong>$15,000+</strong> for a larger home. Many 1–2 bedroom moves are estimated around <strong>$3,800–$6,400+</strong>, depending on weight or volume, access, packing, storage, season, and Declared Value Protection.';
    var table=cost.querySelector("table"),tbody=table&&table.querySelector("tbody");if(tbody){tbody.innerHTML="";rows.forEach(function(row){var tr=document.createElement("tr");row.forEach(function(value){var td=document.createElement("td");td.textContent=value;tr.appendChild(td)});tbody.appendChild(tr)})}var note=cost.querySelector(".pcm-route-cost__note");if(note)note.textContent="Prices are planning ranges in CAD, not guaranteed quotes. "+routeLabel+" pricing depends on inventory weight or volume, pickup and delivery access, stairs, elevators, packing, storage timing, specialty items, service dates, and the selected Declared Value Protection option.";return !!table;
  }
  function normalizeGlance(){
    if(document.querySelector(".pcm-step22-glance"))return true;var headings=Array.prototype.filter.call(document.querySelectorAll("h2,h3"),function(item){return /Route at a Glance/i.test(clean(item.textContent))}),introHeading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return clean(item.textContent)==="Moving from ${config.from} to ${config.to}?"}),intro=introHeading&&introHeading.parentElement;if(!headings.length||!intro)return false;
    headings.forEach(function(h){var section=h.closest("section");if(section&&section!==introHeading.closest("section"))section.remove()});var icon='<svg class="pcm-step22-glance__icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle></svg>';function item(label,value,qualifier){return '<div class="pcm-step22-glance__item">'+icon+'<div><p class="pcm-step22-glance__label">'+label+'</p><p class="pcm-step22-glance__value">'+value+'</p><p class="pcm-step22-glance__qualifier">'+qualifier+'</p></div></div>'}var card=document.createElement("div");card.className="pcm-step22-glance";card.innerHTML='<h3>${config.from}–${config.to} Route at a Glance</h3><div class="pcm-step22-glance__grid">'+item("Distance","~3,400 km",routeLabel)+item("Est. Transit Time","7–19 days","Depending on shipment size")+item("Typical Cost Range","$2,500–$15,000+","Studio to 4+ bedroom home")+'</div>';intro.appendChild(card);return true;
  }
  function normalizeMain(){var faq=document.querySelector(".pcm-step22-faq");Array.prototype.forEach.call(document.querySelectorAll("main section, #root>div>section"),function(section){if(section===faq||section.querySelector("h1")||section.classList.contains("pcm-lead-panel")||section.classList.contains("pcm-route-cost"))return;var h2=section.querySelector("h2");if(!h2)return;var text=clean(h2.textContent);if(/Related Destinations|Ready to Move|Moving from /.test(text))return;var container=section.querySelector(":scope > .container");if(container){container.classList.remove("max-w-3xl");container.classList.add("max-w-4xl")}h2.classList.remove("text-3xl","mb-10","mb-12");h2.classList.add("text-2xl","mb-6");Array.prototype.forEach.call(section.querySelectorAll("h3"),function(h3){h3.classList.remove("text-lg");h3.classList.add("text-base")})});Array.prototype.forEach.call(document.querySelectorAll("main p"),function(p){if(/Professional, fully insured long-distance moving/i.test(p.textContent||""))p.innerHTML=p.innerHTML.replace(/Professional, fully insured long-distance moving/ig,"Professionally coordinated long-distance moving with Declared Value Protection options")})}
  function normalizeQuote(){var panels=Array.prototype.slice.call(document.querySelectorAll(".pcm-lead-panel"));if(!panels.length)return false;for(var i=1;i<panels.length;i++)panels[i].remove();var form=panels[0].querySelector("form"),from=form&&form.querySelector('[name="from"]'),to=form&&form.querySelector('[name="to"]');if(!from||!to)return false;from.value=from.placeholder="${config.from}, ${config.fromProvince}";to.value=to.placeholder="${config.to}, ${config.toProvince}";from.setAttribute("value",from.value);to.setAttribute("value",to.value);return true}
  function normalize(){document.body.classList.add("pcm-step22-calgary-toronto");document.title=${JSON.stringify(config.title)};var description=document.querySelector('meta[name="description"]');if(description)description.content=${JSON.stringify(config.description)};var canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href="https://purelycanadianmovers.com/${config.slug}/";var og=document.querySelector('meta[property="og:url"]');if(og)og.content="https://purelycanadianmovers.com/${config.slug}/";Array.prototype.forEach.call(document.querySelectorAll(".pcm-local-seo,.pcm-trust-proof"),function(block){block.remove()});var done=normalizeQuote()&&normalizePricing()&&normalizeGlance();var faqDone=syncFaq();normalizeMain();return done&&faqDone}
  var attempts=0,timer=window.setInterval(function(){attempts++;var done=normalize();if((done&&attempts>=20)||attempts>40)window.clearInterval(timer)},250);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize);else normalize();
})();
</script>
${markerEnd}`;
}

for (const config of routes) {
  const file = join(outDir, config.slug, "index.html");
  const canonical = `https://purelycanadianmovers.com/${config.slug}/`;
  let html = await readFile(file, "utf8");
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(config.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(config.description)}">`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`)
    .replace(/<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*(?=<script defer="" src="https:\/\/manus-analytics\.com\/umami")/i, "")
    .replace(new RegExp(`\\s*${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "\n")
    .replace(/\s*<script[^>]*id="pcm-step22-route-faq-schema"[^>]*>[\s\S]*?<\/script>\s*/gi, "\n")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, (script) => /"@type"\s*:\s*"FAQPage"/.test(script) ? "" : script);
  html = replaceVisibleFaq(html, config);
  const rawSchema = `<script type="application/ld+json" id="pcm-step22-route-faq-schema">${faqSchema(config.faqs)}</script>`;
  html = html.replace(/\s*<\/head>/i, "\n</head>").replace("</head>", `${rawSchema}\n</head>`).replace(/\s*<\/body>/i, "\n</body>").replace("</body>", `${routeRuntime(config)}\n</body>`).replace(/^[ \t]+$/gm, "");
  await writeFile(file, html);
  console.log(`Finalized ${file}`);
}
