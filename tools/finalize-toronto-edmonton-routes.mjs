import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] || "site-copy";
const writer = "finalize-toronto-edmonton-routes.mjs";
const sharedFaqs = {
  toronto: [
    ["How long does it take to move from Toronto to Edmonton?", "A Toronto to Edmonton move typically takes 7–16 days for delivery, depending on shipment size, scheduling, route planning, weather, and access. We will give you a realistic delivery window when you book your move."],
    ["How much does it cost to move from Toronto to Edmonton?", "Toronto to Edmonton planning ranges start at $2,500+ for a studio or small shipment, $4,500–$5,500+ for a 1-bedroom, $6,000–$7,000+ for a 2-bedroom, $10,000+ for a 3-bedroom, and $12,000–$15,000+ for a 4+ bedroom home. Contact us for a free, no-obligation estimate."],
    ["Do you move from Edmonton to Toronto as well?", "Yes — we handle moves in both directions. Whether you are moving from Toronto to Edmonton or Edmonton to Toronto, our team provides the same professional service with Declared Value Protection options."],
    ["Are you a direct carrier or do you use subcontractors?", "We do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, Declared Value Protection options, and no broker-style handoffs to unknown movers."],
    ["Do you provide packing services for a Toronto–Edmonton move?", "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
    ["What Declared Value Protection is available for a Toronto to Edmonton move?", "We explain the Declared Value Protection included with your estimate and any additional protection options before your move date."],
    ["What is the best time of year to move from Toronto to Edmonton?", "Late spring (May–June) and early fall (September–October) are ideal. Summer is peak season — book 6–8 weeks in advance. Edmonton winters are cold and long; if moving November through March, plan for extra protection of temperature-sensitive items."],
    ["Can I get a written estimate for my Toronto to Edmonton move?", "Yes. We provide written estimates based on an in-home or virtual inventory assessment. A written estimate explains the expected price range and services included before moving day."],
    ["Do you offer storage if my Edmonton home isn't ready?", "Yes. We offer both short-term and long-term storage options. If your new Edmonton home isn't ready on arrival day, we can hold your belongings securely and deliver when you're ready."],
    ["What should I know about Edmonton before moving there?", "Edmonton is Canada's northernmost major city and the gateway to the North. It has a lower cost of living than Toronto, no provincial sales tax in Alberta, and a vibrant arts and food scene. Its river valley park system is an important part of the city."],
    ["What should I do before the movers arrive?", "Defrost your fridge 24 hours ahead, disconnect appliances, label boxes by room, and set aside essentials such as medications, chargers, and documents in a bag you'll carry yourself. If you're in a condo, book the elevator and loading dock in advance."],
    ["What makes Purely Canadian Movers different from other long-distance movers?", "We're family-owned since 1991 with 30+ years of experience on cross-country Canadian routes. We coordinate through the Great Canadian Van Lines agent network, are BBB Accredited, offer transparent pricing with no hidden fees, and provide a dedicated point of contact throughout your move."],
  ],
  edmonton: [
    ["How long does it take to move from Edmonton to Toronto?", "An Edmonton to Toronto move typically takes 7–16 days for delivery, depending on shipment size, scheduling, route planning, weather, and access. We will give you a realistic delivery window when you book your move."],
    ["How much does it cost to move from Edmonton to Toronto?", "Edmonton to Toronto planning ranges start at $2,500+ for a studio or small shipment, $4,500–$5,500+ for a 1-bedroom, $6,000–$7,000+ for a 2-bedroom, $10,000+ for a 3-bedroom, and $12,000–$15,000+ for a 4+ bedroom home. Contact us for a free, no-obligation estimate."],
    ["Do you move from Toronto to Edmonton as well?", "Yes — we handle moves in both directions. Whether you are moving from Edmonton to Toronto or Toronto to Edmonton, our team provides the same professional service with Declared Value Protection options."],
    ["Are you a direct carrier or do you use subcontractors?", "We do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, Declared Value Protection options, and no broker-style handoffs to unknown movers."],
    ["Do you provide packing services for an Edmonton–Toronto move?", "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
    ["What Declared Value Protection is available for an Edmonton to Toronto move?", "We explain the Declared Value Protection included with your estimate and any additional protection options before your move date."],
    ["What is the best time of year to move from Edmonton to Toronto?", "Late spring (May–June) and early fall (September–October) are ideal. Summer is peak season — book 6–8 weeks in advance. Winter moves are possible but require extra planning for Edmonton's extreme cold at the origin end."],
    ["Can I get a written estimate for my Edmonton to Toronto move?", "Yes. We provide written estimates based on an in-home or virtual inventory assessment. A written estimate explains the expected price range and services included before moving day."],
    ["Do you offer storage if my Toronto home isn't ready?", "Yes. We offer both short-term and long-term storage options. If your new Toronto home isn't ready on arrival day, we can hold your belongings securely and deliver when you're ready."],
    ["What should I know about Toronto before moving there?", "Toronto is Canada's largest city and a major financial and cultural hub. It has a higher cost of living than Edmonton, along with diverse job opportunities, extensive transit, and a vibrant multicultural community. Be prepared for higher housing costs and traffic."],
    ["What should I do before the movers arrive?", "Defrost your fridge 24 hours ahead, disconnect appliances, label boxes by room, and set aside essentials such as medications, chargers, and documents in a bag you'll carry yourself. If you're in a condo, book the elevator and loading dock in advance."],
    ["What makes Purely Canadian Movers different from other long-distance movers?", "We're family-owned since 1991 with 30+ years of experience on cross-country Canadian routes. We coordinate through the Great Canadian Van Lines agent network, are BBB Accredited, offer transparent pricing with no hidden fees, and provide a dedicated point of contact throughout your move."],
  ],
};

const routes = [
  {
    slug: "toronto-to-edmonton-movers",
    from: "Toronto",
    to: "Edmonton",
    title: "Toronto to Edmonton Movers | Long-Distance Moving | Purely Canadian Movers",
    description: "Toronto to Edmonton movers. Professional, fully insured long-distance moves. Family-owned since 1991. GCVL agents. Free estimates.",
    faqs: sharedFaqs.toronto,
  },
  {
    slug: "edmonton-to-toronto-movers",
    from: "Edmonton",
    to: "Toronto",
    title: "Edmonton to Toronto Moving Cost | Movers, Prices & Transit Time | Purely Canadian Movers",
    description: "Edmonton to Toronto moving cost guide with estimated prices by home size, transit time, quote factors, packing, storage, valuation options, and direct movers.",
    faqs: sharedFaqs.edmonton,
  },
];

assertAllowedPostProcessor(writer, routes.map(({ slug }) => slug));

const markerStart = "<!-- STEP5_TORONTO_EDMONTON_START -->";
const markerEnd = "<!-- STEP5_TORONTO_EDMONTON_END -->";

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

function faqSection(faqs) {
  const cards = faqs.map(([question, answer]) => `<div class="bg-white rounded-xl p-6 border border-gray-200"><h3 class="font-heading text-base font-bold text-gray-900 mb-2">${escapeHtml(question)}</h3><p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(answer)}</p></div>`).join("");
  return `<section class="py-16 bg-gray-50 pcm-step5-faq" data-pcm-step56-source-faq><div class="container max-w-3xl"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2><div class="space-y-4">${cards}</div></div></section>`;
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
  return `${markerStart}
<style id="pcm-step5-toronto-edmonton-styles">
body.pcm-step5-toronto-edmonton .pcm-step5-glance{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:40px}
body.pcm-step5-toronto-edmonton .pcm-step5-glance>h3{font-family:"Playfair Display",serif;font-size:20px;line-height:28px;font-weight:700;color:#111827;margin:0 0 16px}
body.pcm-step5-toronto-edmonton .pcm-step5-glance__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
body.pcm-step5-toronto-edmonton .pcm-step5-glance__item{display:flex;align-items:flex-start;gap:12px;min-width:0}
body.pcm-step5-toronto-edmonton .pcm-step5-glance__icon{color:#cc1a1a;flex:0 0 auto;margin-top:2px;width:20px;height:20px}
body.pcm-step5-toronto-edmonton .pcm-step5-glance__label{font:400 12px/16px "Source Sans 3",sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:0 0 2px}
body.pcm-step5-toronto-edmonton .pcm-step5-glance__value{font:700 18px/28px "Playfair Display",serif;color:#111827;margin:0}
body.pcm-step5-toronto-edmonton .pcm-step5-glance__qualifier{font:400 14px/20px "Source Sans 3",sans-serif;color:#6b7280;margin:0}
body.pcm-step5-toronto-edmonton .pcm-step5-faq h3{font-size:16px;line-height:24px}
body.pcm-step5-toronto-edmonton .pcm-step5-faq h3+p{font-size:14px;line-height:22.75px}
@media(max-width:639px){body.pcm-step5-toronto-edmonton .pcm-step5-glance__grid{grid-template-columns:1fr}}
</style>
<script id="pcm-step5-toronto-edmonton-runtime">
(function(){
  var expectedPath="/${config.slug}/";
  if((location.pathname.replace(/\\/+$/,"/")!==expectedPath))return;
  var routeLabel="${config.from} to ${config.to}";
  var faqs=${faqs};
  function clean(value){return(value||"").replace(/\\s+/g," ").trim()}
  function faqSchemas(){return Array.prototype.filter.call(document.querySelectorAll('script[type="application/ld+json"]'),function(script){try{var data=JSON.parse(script.textContent);return data&&data["@type"]==="FAQPage"}catch(error){return false}})}
  function syncFaq(){
    var headings=Array.prototype.filter.call(document.querySelectorAll("h2"),function(item){return /^Frequently Asked Questions$/i.test(clean(item.textContent))});
    var heading=headings[0];var section=heading&&heading.closest("section");if(!section)return false;
    for(var i=1;i<headings.length;i++){var duplicate=headings[i].closest("section");if(duplicate&&duplicate!==section)duplicate.remove()}
    section.classList.add("pcm-step5-faq");heading.textContent="Frequently Asked Questions";heading.className="font-heading text-3xl font-bold text-gray-900 mb-8 text-center";
    var list=heading.nextElementSibling;if(!list){list=document.createElement("div");heading.after(list)}list.className="space-y-4";list.innerHTML="";
    faqs.forEach(function(item){var card=document.createElement("div");card.className="bg-white rounded-xl p-6 border border-gray-200";var question=document.createElement("h3");question.className="font-heading text-base font-bold text-gray-900 mb-2";question.textContent=item[0];var answer=document.createElement("p");answer.className="text-sm text-gray-600 leading-relaxed";answer.textContent=item[1];card.appendChild(question);card.appendChild(answer);list.appendChild(card)});
    faqSchemas().forEach(function(script){if(script.id!=="pcm-step5-route-faq-schema")script.remove()});
    var schema=document.getElementById("pcm-step5-route-faq-schema");if(!schema){schema=document.createElement("script");schema.type="application/ld+json";schema.id="pcm-step5-route-faq-schema";document.head.appendChild(schema)}
    schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(function(item){return{"@type":"Question",name:item[0],acceptedAnswer:{"@type":"Answer",text:item[1]}}})});return true;
  }
  function removeLegacyPricing(){
    var heading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return /Moving Cost Breakdown$/i.test(clean(item.textContent))});
    if(!heading)return !/Moving Cost Breakdown/i.test(document.body.innerText);
    var section=heading.closest("section");if(section&&!section.classList.contains("pcm-route-cost"))section.remove();return true;
  }
  function normalizePricing(){
    var cost=document.querySelector(".pcm-route-cost");if(!cost)return false;
    var intro=cost.querySelector("h2 + p");if(intro)intro.innerHTML=("${config.from}"==="Edmonton"?"An ":"A ")+routeLabel+' move typically ranges from about <strong>$2,500+</strong> for a small shipment to <strong>$15,000+</strong> for a 4+ bedroom home. Many 1–2 bedroom moves are estimated around <strong>$4,500–$7,000+</strong>, depending on weight or volume, access, packing, storage, season, and Declared Value Protection.';
    var note=cost.querySelector(".pcm-route-cost__note");if(note)note.textContent="Prices are planning ranges in CAD, not guaranteed quotes. "+routeLabel+" pricing depends on inventory weight or volume, pickup and delivery access, stairs, elevators, packing, storage timing, specialty items, service dates, and the selected Declared Value Protection option.";
    return true;
  }
  function normalizeGlance(){
    if(document.querySelector(".pcm-step5-glance"))return true;
    var heading=Array.prototype.find.call(document.querySelectorAll("h2,h3"),function(item){return /Route at a Glance/i.test(clean(item.textContent))});
    var oldSection=heading&&heading.closest("section");var introHeading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return clean(item.textContent)==="Moving from ${config.from} to ${config.to}?"});var introContainer=introHeading&&introHeading.parentElement;
    if(!heading||!oldSection||!introContainer)return false;
    var icon='<svg class="pcm-step5-glance__icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle></svg>';
    function item(label,value,qualifier){return '<div class="pcm-step5-glance__item">'+icon+'<div><p class="pcm-step5-glance__label">'+label+'</p><p class="pcm-step5-glance__value">'+value+'</p><p class="pcm-step5-glance__qualifier">'+qualifier+'</p></div></div>'}
    var card=document.createElement("div");card.className="pcm-step5-glance";card.innerHTML='<h3>'+clean(heading.textContent)+'</h3><div class="pcm-step5-glance__grid">'+item("Distance","~3,500 km",routeLabel)+item("Est. Transit Time","7–16 days","Depending on shipment size")+item("Typical Cost Range","$2,500–$15,000+","Studio to 4+ bedroom home")+'</div>';
    introContainer.appendChild(card);oldSection.remove();return true;
  }
  function normalizeMain(){
    var faqHeading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return /^Frequently Asked Questions$/i.test(clean(item.textContent))});var faqSection=faqHeading&&faqHeading.closest("section");
    Array.prototype.forEach.call(document.querySelectorAll("main section, #root>div>section"),function(section){
      if(section===faqSection||section.querySelector("h1")||section.classList.contains("pcm-lead-panel")||section.classList.contains("pcm-route-cost"))return;
      var h2=section.querySelector("h2");if(!h2)return;var text=clean(h2.textContent);if(/Related Destinations|Ready to Move/i.test(text))return;
      var container=section.querySelector(":scope > .container");if(container&&!/Moving from /.test(text)){container.classList.remove("max-w-3xl");container.classList.add("max-w-4xl")}
      if(!/Moving from /.test(text)){h2.classList.remove("text-3xl");h2.classList.add("text-2xl");h2.classList.remove("mb-10","mb-12");h2.classList.add("mb-6")}
      Array.prototype.forEach.call(section.querySelectorAll("h3"),function(h3){h3.classList.remove("text-lg");h3.classList.add("text-base")});Array.prototype.forEach.call(section.querySelectorAll(".p-6"),function(card){if(card.querySelector("h3")&&!card.closest(".pcm-step5-glance")){card.classList.remove("p-6");card.classList.add("p-5")}});
    });
    Array.prototype.forEach.call(document.querySelectorAll("main p"),function(paragraph){if(/roughly 2800 km/i.test(paragraph.textContent||""))paragraph.innerHTML=paragraph.innerHTML.replace(/roughly 2800 km/ig,"roughly 3,500 km")});
  }
  function normalize(){
    document.body.classList.add("pcm-step5-toronto-edmonton");document.title=${JSON.stringify(config.title)};
    var description=document.querySelector('meta[name="description"]');if(description)description.content=${JSON.stringify(config.description)};
    var canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href="https://purelycanadianmovers.com/${config.slug}/";var ogUrl=document.querySelector('meta[property="og:url"]');if(ogUrl)ogUrl.content="https://purelycanadianmovers.com/${config.slug}/";
    Array.prototype.forEach.call(document.querySelectorAll(".pcm-local-seo"),function(block){block.remove()});var pricingDone=normalizePricing();var legacyDone=removeLegacyPricing();var glanceDone=normalizeGlance();normalizeMain();var faqDone=syncFaq();return pricingDone&&legacyDone&&glanceDone&&faqDone;
  }
  var attempts=0;var timer=window.setInterval(function(){attempts+=1;var done=normalize();if((done&&attempts>=20)||attempts>40)window.clearInterval(timer)},250);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize);else normalize();
})();
</script>
${markerEnd}`;
}

for (const config of routes) {
  const file = join(outDir, config.slug, "index.html");
  let html = await readFile(file, "utf8");
  const canonical = `https://purelycanadianmovers.com/${config.slug}/`;

  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(config.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(config.description)}">`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`)
    .replace(/<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*(?=<script defer="" src="https:\/\/manus-analytics\.com\/umami")/i, "")
    .replace(new RegExp(`\\s*${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "\n")
    .replace(/\s*<script[^>]*id="pcm-step5-route-faq-schema"[^>]*>[\s\S]*?<\/script>\s*/gi, "\n")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, (script) => /"@type"\s*:\s*"FAQPage"/.test(script) ? "" : script);

  html = replaceVisibleFaq(html, config);
  const rawSchema = `<script type="application/ld+json" id="pcm-step5-route-faq-schema">${faqSchema(config.faqs)}</script>`;
  html = html.replace(/\s*<\/head>/i, "\n</head>");
  html = html.replace("</head>", `${rawSchema}\n</head>`);
  html = html.replace(/\s*<\/body>/i, "\n</body>");
  html = html.replace("</body>", `${routeRuntime(config)}\n</body>`);
  await writeFile(file, html);
  console.log(`Finalized ${file}`);
}
