import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] || "site-copy";
const writer = "finalize-montreal-toronto-routes.mjs";
const routes = [
  {
    slug: "montreal-to-toronto-movers",
    from: "Montreal",
    to: "Toronto",
    title: "Montreal to Toronto Movers | Long-Distance Moving | Purely Canadian Movers",
    description: "Montreal to Toronto movers. Professional long-distance moves with Declared Value Protection options. Family-owned since 1991. GCVL agents. Free estimates.",
    faqs: [
      ["How long does it take to move from Montreal to Toronto?", "A Montreal to Toronto move typically takes 2–5 days for delivery, depending on the size of your shipment, scheduling, and route logistics. We will give you a realistic delivery window when you book your move."],
      ["How much does it cost to move from Montreal to Toronto?", "The cost of a Montreal to Toronto move depends on the weight of your shipment and the distance. Starting prices are $2,300+ for a studio, $3,900+ for a 1-bedroom, $5,200+ for a 2-bedroom, $8,300+ for a 3-bedroom, and $12,000+ for a 4+ bedroom home. Contact us for a free, no-obligation estimate."],
      ["Do you move from Toronto to Montreal as well?", "Yes - we handle moves in both directions. Whether you are moving from Montreal to Toronto or Toronto to Montreal, our team provides the the same professional service with Declared Value Protection options."],
      ["Are you a direct carrier or do you use subcontractors?", "We do not use random brokers or subcontractors. As agents of Great Canadian Van Lines, we coordinate pickup and delivery through the agent network with clear accountability and documented handoffs."],
      ["Do you provide packing services for a Montreal-Toronto move?", "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
      ["What Declared Value Protection is included for a Montreal to Toronto move?", "We explain the Declared Value Protection included with your estimate and any additional protection options before your move date."],
      ["What is the best time of year to move from Montreal to Toronto?", "Late spring (May-June) and early fall (September-October) are ideal. Summer is peak season - book 4-6 weeks in advance. This route is shorter than many long-distance moves, but timing still matters for availability and pricing."],
      ["Can I get a written estimate for my Montreal to Toronto move?", "Yes. We provide written estimates based on an in-home or virtual inventory assessment. A written estimate explains the expected starting prices and services included before moving day."],
      ["Do you offer storage if my Toronto home isn't ready?", "Yes. We offer both short-term and long-term storage options. If your new Toronto home isn't ready on arrival day, we can hold your belongings securely and deliver when you're ready."],
      ["Do I need to update my health card when moving from Quebec to Ontario?", "Yes. You'll need to cancel your Quebec RAMQ health card and apply for Ontario OHIP within 3 months of establishing residency. Visit a ServiceOntario location with proof of identity and Ontario residency."],
      ["What should I do before the movers arrive?", "Defrost your fridge 24 hours ahead, disconnect appliances, label boxes by room, and set aside essentials (medications, chargers, documents) in a bag you'll carry yourself. If you're in a condo, book the elevator and loading dock in advance."],
      ["What makes Purely Canadian Movers different from other long-distance movers?", "We're family-owned since 1991 with 30+ years of experience on interprovincial Canadian routes. We coordinate through the Great Canadian Van Lines agent network, are BBB Accredited, offer transparent pricing with no hidden fees, and provide a dedicated point of contact throughout your move."],
    ],
  },
  {
    slug: "toronto-to-montreal-movers",
    from: "Toronto",
    to: "Montreal",
    title: "Toronto to Montreal Movers | Long-Distance Moving | Purely Canadian Movers",
    description: "Toronto to Montreal movers. Professional long-distance moves with Declared Value Protection options. Family-owned since 1991. GCVL agents. Free estimates.",
    faqs: [
      ["How long does it take to move from Toronto to Montreal?", "A Toronto to Montreal move typically takes 2–5 days for delivery, depending on the size of your shipment, scheduling, and route logistics. We will give you a realistic delivery window when you book your move."],
      ["How much does it cost to move from Toronto to Montreal?", "The cost of a Toronto to Montreal move depends on the weight of your shipment and the distance. Starting prices are $2,300+ for a studio, $3,900+ for a 1-bedroom, $5,200+ for a 2-bedroom, $8,300+ for a 3-bedroom, and $12,000+ for a 4+ bedroom home. Contact us for a free, no-obligation estimate."],
      ["Do you move from Montreal to Toronto as well?", "Yes — we handle moves in both directions. Whether you are moving from Toronto to Montreal or Montreal to Toronto, our team provides the the same professional service with Declared Value Protection options."],
      ["Are you a direct carrier or do you use subcontractors?", "We do not use random brokers or subcontractors. As agents of Great Canadian Van Lines, we coordinate pickup and delivery through the agent network with clear accountability and documented handoffs."],
      ["Do you provide packing services for a Toronto–Montreal move?", "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
      ["What Declared Value Protection is included for a Toronto to Montreal move?", "We explain the Declared Value Protection included with your estimate and any additional protection options before your move date."],
      ["Do you offer packing and unpacking services?", "Yes, we offer full packing and unpacking services for all long-distance moves. Our team carefully packs fragile items, artwork, and electronics. Packing can be added to any quote for an additional fee."],
      ["What makes Purely Canadian Movers different?", "We're family-owned since 1991 with 30+ years of experience. We coordinate through the Great Canadian Van Lines agent network with clear accountability, transparent pricing, and no broker-style handoffs. We're BBB Accredited and specialize in interprovincial long-distance moves."],
      ["Do you offer storage solutions?", "Yes, we offer flexible storage options for both short-term and long-term needs. Whether you need storage while waiting for your new home to be ready or temporary storage during your move, we can accommodate your requirements."],
    ],
  },
];

assertAllowedPostProcessor(writer, routes.map(({ slug }) => slug));

const markerStart = "<!-- STEP4_MONTREAL_TORONTO_START -->";
const markerEnd = "<!-- STEP4_MONTREAL_TORONTO_END -->";

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
<p class="font-body text-sm leading-relaxed text-gray-600">${escapeHtml(answer)}</p>
</div>`).join("");

  return `<section id="pcm-step4-route-faq" class="py-16 bg-white pcm-step4-faq">
<div class="container max-w-3xl">
<div class="text-center mb-12 reveal">
<h2 class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
<p class="font-body text-gray-600">Everything you need to know before your move.</p>
</div>
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
  return `${markerStart}
<style id="pcm-step4-montreal-toronto-styles">
body.pcm-step4-montreal-toronto .pcm-step4-glance{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:40px}
body.pcm-step4-montreal-toronto .pcm-step4-glance>h3{font-family:"Playfair Display",serif;font-size:20px;line-height:28px;font-weight:700;color:#111827;margin:0 0 16px}
body.pcm-step4-montreal-toronto .pcm-step4-glance__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
body.pcm-step4-montreal-toronto .pcm-step4-glance__item{display:flex;align-items:flex-start;gap:12px;min-width:0}
body.pcm-step4-montreal-toronto .pcm-step4-glance__icon{color:#cc1a1a;flex:0 0 auto;margin-top:2px;width:20px;height:20px}
body.pcm-step4-montreal-toronto .pcm-step4-glance__label{font:400 12px/16px "Source Sans 3",sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:0 0 2px}
body.pcm-step4-montreal-toronto .pcm-step4-glance__value{font:700 18px/28px "Playfair Display",serif;color:#111827;margin:0}
body.pcm-step4-montreal-toronto .pcm-step4-glance__qualifier{font:400 14px/20px "Source Sans 3",sans-serif;color:#6b7280;margin:0}
body.pcm-step4-montreal-toronto .pcm-step4-faq h3{font-size:16px;line-height:24px}
body.pcm-step4-montreal-toronto .pcm-step4-faq h3+p{font-size:14px;line-height:22.75px}
@media(max-width:639px){body.pcm-step4-montreal-toronto .pcm-step4-glance__grid{grid-template-columns:1fr}}
</style>
<script id="pcm-step4-montreal-toronto-runtime">
(function(){
  var expectedPath="/${config.slug}/";
  if((location.pathname.replace(/\\/+$/,"")+"/")!==expectedPath)return;
  var costRange="$2,300–$12,000+";
  var routeLabel="${config.from} to ${config.to}";
  function clean(value){return(value||"").replace(/\\s+/g," ").trim()}
  function faqSchemas(){return Array.prototype.filter.call(document.querySelectorAll('script[type="application/ld+json"]'),function(script){try{var data=JSON.parse(script.textContent);return data&&data["@type"]==="FAQPage"}catch(error){return false}})}
  function syncFaq(){
    var heading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return clean(item.textContent)==="Frequently Asked Questions"});
    var section=heading&&heading.closest("section");
    if(!section)return false;
    section.classList.add("pcm-step4-faq");
    heading.className="font-heading text-3xl font-bold text-gray-900 mb-8 text-center";
    var list=heading.nextElementSibling;if(list)list.className="space-y-4";
    Array.prototype.forEach.call(section.querySelectorAll("h3"),function(question){question.className="font-heading text-base font-bold text-gray-900 mb-2";var card=question.parentElement;if(card)card.className="bg-white rounded-xl p-6 border border-gray-200"});
    var entities=Array.prototype.map.call(section.querySelectorAll("h3"),function(question){var answer=question.parentElement&&question.parentElement.querySelector("p");return{"@type":"Question",name:clean(question.textContent),acceptedAnswer:{"@type":"Answer",text:clean(answer&&answer.textContent)}}});
    faqSchemas().forEach(function(script){if(script.id!=="pcm-step4-route-faq-schema")script.remove()});
    var schema=document.getElementById("pcm-step4-route-faq-schema");
    if(!schema){schema=document.createElement("script");schema.type="application/ld+json";schema.id="pcm-step4-route-faq-schema";document.head.appendChild(schema)}
    schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:entities});
    return entities.length>0;
  }
  function normalizeGlance(){
    if(document.querySelector(".pcm-step4-glance"))return true;
    var heading=Array.prototype.find.call(document.querySelectorAll("h2,h3"),function(item){return /Route at a Glance/i.test(clean(item.textContent))});
    var oldSection=heading&&heading.closest("section");
    var oldGrid=heading&&heading.nextElementSibling;
    var introHeading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return clean(item.textContent)==="Moving from ${config.from} to ${config.to}?"});
    var introContainer=introHeading&&introHeading.parentElement;
    if(!heading||!oldSection||!oldGrid||!introContainer)return false;
    var oldItems=oldGrid.children;var distance=oldItems[0];var transit=oldItems[1];
    if(!distance||!transit)return false;
    function itemFrom(source){
      var labels=source.querySelectorAll("div");var texts=Array.prototype.map.call(labels,function(node){return clean(node.textContent)}).filter(Boolean);
      var unique=texts.filter(function(value,index){return texts.indexOf(value)===index});
      var value=Array.prototype.find.call(unique,function(text){return /km|days/i.test(text)})||"";
      var label=/km/i.test(value)?"Distance":"Est. Transit Time";
      var qualifier=Array.prototype.find.call(unique,function(text){return text!==label&&text!==value&&!text.includes(label)&&!text.includes(value)})||(/km/i.test(value)?routeLabel:"Depending on shipment size");
      var icon=source.querySelector("svg");
      return '<div class="pcm-step4-glance__item"><span class="pcm-step4-glance__icon" aria-hidden="true">'+(icon?icon.outerHTML:"")+'</span><div><p class="pcm-step4-glance__label">'+label+'</p><p class="pcm-step4-glance__value">'+value+'</p><p class="pcm-step4-glance__qualifier">'+qualifier+'</p></div></div>';
    }
    var card=document.createElement("div");card.className="pcm-step4-glance";card.innerHTML='<h3>'+clean(heading.textContent)+'</h3><div class="pcm-step4-glance__grid">'+itemFrom(distance)+itemFrom(transit)+'<div class="pcm-step4-glance__item"><svg class="pcm-step4-glance__icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg><div><p class="pcm-step4-glance__label">Typical Cost Range</p><p class="pcm-step4-glance__value">'+costRange+'</p><p class="pcm-step4-glance__qualifier">Studio to 4+ bedroom home</p></div></div></div>';
    introContainer.appendChild(card);oldSection.remove();return true;
  }
  function normalizeMain(){
    var faqHeading=Array.prototype.find.call(document.querySelectorAll("h2"),function(item){return clean(item.textContent)==="Frequently Asked Questions"});
    var faqSection=faqHeading&&faqHeading.closest("section");
    Array.prototype.forEach.call(document.querySelectorAll("main section, #root>div>section"),function(section){
      if(section===faqSection||section.querySelector("h1")||section.classList.contains("pcm-lead-panel")||section.classList.contains("pcm-route-cost"))return;
      var h2=section.querySelector("h2");if(!h2)return;
      var text=clean(h2.textContent);
      if(/Related Destinations|Ready to Move/i.test(text))return;
      var container=section.querySelector(":scope > .container");if(container&&!/Moving from /.test(text)){container.classList.remove("max-w-3xl");container.classList.add("max-w-4xl")}
      if(!/Moving from /.test(text)){h2.classList.remove("text-3xl");h2.classList.add("text-2xl");h2.classList.remove("mb-10","mb-12");h2.classList.add("mb-6")}
      Array.prototype.forEach.call(section.querySelectorAll("h3"),function(h3){h3.classList.remove("text-lg");h3.classList.add("text-base")});
      Array.prototype.forEach.call(section.querySelectorAll(".p-6"),function(card){if(card.querySelector("h3")&&!card.closest(".pcm-step4-glance")){card.classList.remove("p-6");card.classList.add("p-5")}});
    });
  }
  function normalize(){
    document.body.classList.add("pcm-step4-montreal-toronto");
    document.title=${JSON.stringify(config.title)};
    var description=document.querySelector('meta[name="description"]');if(description)description.content=${JSON.stringify(config.description)};
    var canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href="https://purelycanadianmovers.com/${config.slug}/";
    var ogUrl=document.querySelector('meta[property="og:url"]');if(ogUrl)ogUrl.content="https://purelycanadianmovers.com/${config.slug}/";
    Array.prototype.forEach.call(document.querySelectorAll("body > .pcm-local-seo, #root > .pcm-local-seo"),function(block){block.remove()});
    var glanceDone=normalizeGlance();normalizeMain();var faqDone=syncFaq();return glanceDone&&faqDone;
  }
  var attempts=0;var timer=window.setInterval(function(){attempts+=1;var done=normalize();if((done&&attempts>=20)||attempts>40)window.clearInterval(timer)},250);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize);else normalize();
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
    .replace(/\s*<script[^>]*id="pcm-step4-route-faq-schema"[^>]*>[\s\S]*?<\/script>\s*/gi, "\n")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, (script) => script.includes('"@type":"FAQPage"') || script.includes('"@type": "FAQPage"') ? "" : script);

  html = replaceFaqSection(html, config);

  const rawSchema = `<script type="application/ld+json" id="pcm-step4-route-faq-schema">${faqSchema(config.faqs)}</script>`;
  html = html.replace("</head>", `${rawSchema}\n</head>`);
  html = html.replace("</body>", `${routeRuntime(config)}\n</body>`);
  await writeFile(file, html);
  console.log(`Finalized ${file}`);
}
