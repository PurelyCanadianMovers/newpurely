import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] ?? "site-copy";
const writer = "finalize-montreal-victoria-routes.mjs";
const routes = [
  {
    slug: "montreal-to-victoria-movers",
    title: "Montreal to Victoria & Nanaimo Movers | Purely Canadian Movers",
    description: "Montreal to Victoria and Nanaimo movers with Vancouver Island ferry planning, transparent moving-cost ranges, packing and storage options, and free written estimates.",
    from: "Montreal, QC",
    to: "Victoria, BC",
    faqs: [
      ["How long does it take to move from Montreal to Victoria or Nanaimo?", "A Montreal to Victoria or Nanaimo move typically takes 10–22 days for delivery, depending on the size of your shipment, scheduling, and the ferry crossing to Vancouver Island. We will give you a realistic delivery window when you book your move."],
      ["How much does it cost to move from Montreal to Victoria or Nanaimo?", "The cost depends on the weight of your shipment and the distance. A studio or 1-bedroom typically starts around $3,000 to $5,300+, while a 3–4 bedroom home can range from $11,000 to $16,000+. The island surcharge reflects the BC Ferries crossing. Contact us for a free, no-obligation estimate."],
      ["Do you move from Victoria or Nanaimo to Montreal as well?", "Yes — we handle moves in both directions. Whether you are moving from Montreal to Vancouver Island or from Victoria/Nanaimo to Montreal, our team provides the same professional, fully insured service."],
      ["Why is moving to Vancouver Island more expensive than moving to Vancouver?", "Moves to Vancouver Island require a BC Ferries crossing from the Lower Mainland, which adds time, logistics complexity, and ferry costs to the shipment. This is reflected in the slightly higher pricing compared to mainland BC destinations."],
      ["Are you a direct carrier or do you use subcontractors?", "we do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, Declared Value Protection options, and no broker-style handoffs to unknown movers."],
      ["Do you provide packing services for a Montreal–Victoria/Nanaimo move?", "Yes. We offer full packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing can be added to any long-distance move quote."],
      ["Is my shipment insured during a Montreal to Victoria/Nanaimo move?", "All shipments are covered by basic Declared Value Protection. We strongly recommend discussing additional full-value protection options with our team before your move date."],
      ["What is the best time of year to move from Montreal to Vancouver Island?", "Late spring (May–June) and early fall (September–October) are ideal. Summer is peak season on Vancouver Island — book 4–6 weeks in advance. The island's mild climate means year-round moving is feasible, but summer ferry traffic can cause scheduling delays."],
      ["Can I get a written estimate for my Montreal to Victoria/Nanaimo move?", "Yes. We provide written estimates based on an in-home or virtual inventory assessment. A written estimate explains the expected price range and services included before moving day."],
      ["Do you offer storage if my Victoria or Nanaimo home isn't ready?", "Yes. We offer both short-term and long-term storage options. If your new home on Vancouver Island isn't ready on arrival day, we can hold your belongings securely on the mainland and deliver when you're ready."],
      ["Do I need to update my health card when moving from Quebec to BC?", "Yes. You'll need to cancel your Quebec RAMQ health card and apply for BC's Medical Services Plan (MSP) within 3 months of establishing residency. There is a 3-month waiting period for MSP coverage, so consider private health insurance in the interim."],
      ["What makes Purely Canadian Movers different from other long-distance movers?", "We're family-owned since 1991 with 30+ years of experience on cross-country Canadian routes. we do not operate like a moving broker or hand moves to unknown third-party movers, are BBB Accredited, offer transparent pricing with no hidden fees, and provide a dedicated point of contact throughout your move."],
    ],
  },
  {
    slug: "victoria-to-montreal-movers",
    from: "Victoria, BC",
    to: "Montreal, QC",
    faqs: [
      ["How long does it take to move from Victoria to Montreal?", "A Victoria to Montreal move typically takes 10–22 days for delivery, depending on shipment size, scheduling, the BC Ferries crossing, and cross-country transit conditions. We provide a realistic delivery window when your move is booked."],
      ["How much does it cost to move from Victoria to Montreal?", "Pricing depends on shipment size, weight or volume, access, packing, storage, season, and other services. Current planning ranges start at about $3,000+ for a studio or small shipment and increase to about $16,000+ for a larger home. A written estimate is prepared from your actual inventory and move details."],
      ["Do you also move from Montreal to Victoria?", "Yes. We handle this route in both directions. Whether you are moving from Victoria to Montreal or Montreal to Victoria, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network."],
      ["Why does a Victoria to Montreal move involve extra logistics?", "A move from Victoria begins with transportation from Vancouver Island via BC Ferries before the shipment continues across Canada. Ferry scheduling, access conditions, shipment size, and the long cross-country distance all affect planning, timing, and final pricing."],
      ["Are you a direct carrier or do you use subcontractors?", "We do not operate like a moving broker or hand moves to unknown third-party movers. As agents of Great Canadian Van Lines, your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation, valuation coverage options, and no broker-style handoffs to unknown movers."],
      ["Do you provide packing services for a Victoria to Montreal move?", "Yes. We offer packing and unpacking services, including specialty packing for fragile items, artwork, and electronics. Packing services can be included with your written long-distance moving estimate."],
      ["What valuation coverage is available for a Victoria to Montreal move?", "Long-distance shipments include basic valuation coverage, with additional valuation coverage options available. We can explain the available protection options and applicable terms when preparing your written estimate."],
      ["What is the best time of year to move from Vancouver Island to Montreal?", "Victoria to Montreal moves operate year-round. Late spring and early fall can offer more flexible scheduling, while summer is typically busier and should be booked earlier. Winter moves may require additional planning for weather conditions across Canada, while summer ferry traffic can affect Vancouver Island scheduling."],
      ["Can I get a written estimate for my Victoria to Montreal move?", "Yes. We provide written estimates based on your inventory and move requirements. An in-home or virtual assessment can be used to review the shipment, access conditions, packing needs, storage requirements, and other services before the move."],
      ["Do you offer storage if my Montreal home isn't ready?", "Yes. Short-term and long-term storage options are available. If your Montreal residence is not ready when your shipment arrives, storage and later delivery can be coordinated as part of your move plan."],
      ["Do I need to update my health coverage when moving from BC to Quebec?", "If you are establishing residency in Quebec, you should review the eligibility and registration requirements for Quebec's RAMQ health insurance plan and the requirements for ending or updating your BC Medical Services Plan coverage. Because provincial health-coverage rules and waiting periods can change, confirm the current requirements directly with the provincial health authorities before moving."],
      ["What makes Purely Canadian Movers different from other long-distance movers?", "Purely Canadian Movers has been family-owned since 1991. We are a BBB Accredited business and an agent of Great Canadian Van Lines. We focus on realistic written estimates, clear documentation, valuation coverage options, and coordinated long-distance service without broker-style handoffs to unknown movers."],
    ],
  },
];

assertAllowedPostProcessor(writer, routes.map(({ slug }) => slug));

const markerStart = "<!-- STEP23_MONTREAL_VICTORIA_START -->";
const markerEnd = "<!-- STEP23_MONTREAL_VICTORIA_END -->";
const pricingNote = "Prices are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, service dates, and the selected Declared Value Protection option.";

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

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function faqSection(faqs) {
  const cards = faqs.map(([question, answer]) => `<div class="bg-white rounded-xl p-6 border border-gray-200"><h3 class="font-heading text-base font-bold text-gray-900 mb-2">${escapeHtml(question)}</h3><p class="font-body text-sm text-gray-600 leading-relaxed">${escapeHtml(answer)}</p></div>`).join("");
  return `<section id="pcm-step64-route-faq" class="py-16 bg-gray-50 pcm-step64-faq"><div class="container max-w-3xl"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2><div class="space-y-4" data-pcm-route-faq-list>${cards}</div></div></section>`;
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

function pricingSection(config) {
  const rows = [["Studio / Bachelor", "$3,000+"], ["1-Bedroom", "$5,300+"], ["2-Bedroom", "$7,000+"], ["3-Bedroom", "$11,000+"], ["4+ Bedroom", "$16,000+"]];
  return `<section class="pcm-route-cost" aria-labelledby="pcm-step64-cost-heading-${config.slug}"><div class="pcm-route-cost__inner"><h2 id="pcm-step64-cost-heading-${config.slug}">How much does it cost to move from ${config.from.split(",")[0]} to ${config.to.split(",")[0]}?</h2><p>This route typically ranges from about <strong>$3,000+</strong> for a studio or small shipment to <strong>$16,000+</strong> for a 4+ bedroom home.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Typical transit</th></tr></thead><tbody>${rows.map(([size, cost]) => `<tr><td>${size}</td><td>${cost}</td><td>10–22 days</td></tr>`).join("")}</tbody></table></div><p class="pcm-route-cost__note">${pricingNote}</p></div></section>`;
}

function glanceSection(config) {
  const from = config.from.split(",")[0];
  const to = config.to.split(",")[0];
  return `<section class="py-16 bg-gray-50 pcm-step64-raw-glance"><div class="container"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-10 text-center">${from}–${to} Route at a Glance</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"><div><strong>Distance:</strong> approximately 4,800 km</div><div><strong>Estimated transit:</strong> 10–22 days</div><div><strong>Typical estimated cost:</strong> $3,000–$16,000+</div></div></div></section>`;
}

function ensureRawComponents(html, config) {
  let visible = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  if (!/<section\b[^>]*class="[^"]*\bpcm-route-cost\b/i.test(visible)) {
    const quoteIndex = html.indexOf("pcm-lead-panel");
    const quoteEnd = html.indexOf("</section>", quoteIndex);
    if (quoteIndex < 0 || quoteEnd < 0) throw new Error(`Could not locate quote panel for /${config.slug}/`);
    html = `${html.slice(0, quoteEnd + 10)}${pricingSection(config)}${html.slice(quoteEnd + 10)}`;
  }
  visible = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  if (!/Route at a Glance/i.test(visible)) html = html.replace('<section id="pcm-step64-route-faq"', `${glanceSection(config)}<section id="pcm-step64-route-faq"`);
  return html;
}

function isFaqSchema(script) {
  const match = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return false;
  try {
    return JSON.parse(match[1])?.["@type"] === "FAQPage";
  } catch {
    return /"@type"\s*:\s*"FAQPage"/.test(match[1]);
  }
}

function runtime(config) {
  return `${markerStart}
<script id="pcm-step23-montreal-victoria-runtime">
(function(){
  var expectedPath="/${config.slug}/";
  if((location.pathname.replace(/\\/+$/,"")+"/")!==expectedPath)return;
  var pricingNote=${JSON.stringify(pricingNote)};
  function clean(value){return(value||"").replace(/\\s+/g," ").trim()}
  function intendedFaq(){return Array.prototype.find.call(document.querySelectorAll("h2"),function(heading){var section=heading.closest("section");return clean(heading.textContent).toLowerCase()==="frequently asked questions"&&section&&section.querySelectorAll("h3").length>=10})}
  function syncFaq(){
    var heading=intendedFaq();var section=heading&&heading.closest("section");if(!section)return false;
    var entities=Array.prototype.map.call(section.querySelectorAll("h3"),function(question){var card=question.parentElement;var answer=card&&card.querySelector("p");return{"@type":"Question",name:clean(question.textContent),acceptedAnswer:{"@type":"Answer",text:clean(answer&&answer.textContent)}}});
    if(entities.length!==${config.faqs.length})return false;
    Array.prototype.forEach.call(document.querySelectorAll('script[type="application/ld+json"]'),function(script){try{var data=JSON.parse(script.textContent);if(data&&data["@type"]==="FAQPage"&&script.id!=="pcm-step23-route-faq-schema")script.remove()}catch(error){}});
    var schema=document.getElementById("pcm-step23-route-faq-schema");if(!schema){schema=document.createElement("script");schema.type="application/ld+json";schema.id="pcm-step23-route-faq-schema";document.head.appendChild(schema)}
    schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:entities});return true;
  }
  function normalizePricing(){var note=document.querySelector(".pcm-route-cost__note");if(!note)return false;note.textContent=pricingNote;return true}
  function normalizeEstimatePlanning(){var bonus=document.querySelector(".pcm-estimate-bonus");if(!bonus)return false;bonus.innerHTML='<span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Online estimate bonus: save at least $100</strong><span class="pcm-estimate-bonus__deadline">Book before September 30, 2026</span><span>Complete an online estimate and book your move with Purely Canadian Movers. Discount confirmed with your written estimate.</span></div>';return true}
  function syncStaticNavAria(){
    var menu=document.querySelector(".pcm-static-mobile");var trigger=document.querySelector('button[aria-label="Open menu"]');if(!menu||!trigger)return true;
    function sync(){trigger.setAttribute("aria-expanded",menu.classList.contains("is-open")?"true":"false")}
    sync();if(!menu.hasAttribute("data-pcm-step23-aria-sync")){menu.setAttribute("data-pcm-step23-aria-sync","");new MutationObserver(sync).observe(menu,{attributes:true,attributeFilter:["class"]})}
    if(${config.slug === "victoria-to-montreal-movers"}&&!trigger.hasAttribute("data-pcm-step64-escape")){trigger.setAttribute("data-pcm-step64-escape","");document.addEventListener("keydown",function(event){if(event.key==="Escape"&&menu.classList.contains("is-open")){menu.classList.remove("is-open");trigger.setAttribute("aria-expanded","false");trigger.focus()}})}return true;
  }
  function normalize(){var faqDone=syncFaq();var pricingDone=normalizePricing();var estimateDone=normalizeEstimatePlanning();var navDone=syncStaticNavAria();return faqDone&&pricingDone&&estimateDone&&navDone}
  var observer=new MutationObserver(function(){observer.disconnect();normalize();observer.observe(document.documentElement,{childList:true,subtree:true})});observer.observe(document.documentElement,{childList:true,subtree:true});
  var attempts=0;var timer=window.setInterval(function(){attempts+=1;var done=normalize();if((done&&attempts>=20)||attempts>40)window.clearInterval(timer)},250);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize);else normalize();
})();
</script>
${markerEnd}`;
}

for (const config of routes) {
  const file = join(outDir, config.slug, "index.html");
  let html = await readFile(file, "utf8");
  if (config.title) {
    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${config.title.replaceAll("&", "&amp;")}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/i, `$1${config.title.replaceAll("&", "&amp;")}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/i, `$1${config.title.replaceAll("&", "&amp;")}$2`);
  }
  if (config.description) {
    const canonical = `https://purelycanadianmovers.com/${config.slug}/`;
    html = html
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(config.description)}">`)
      .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${canonical}">`)
      .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`);
  }
  html = html
    .replace(new RegExp(`\\s*${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "\n")
    .replace(/<section\s+class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*/gi, "")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, (script) => isFaqSchema(script) ? "" : script)
    .replace(/(<p class="pcm-route-cost__note">)[\s\S]*?(<\/p>)/i, `$1${pricingNote}$2`)
    .replace(/<strong>Online estimate bonus: save at least \$100<\/strong><span class="pcm-estimate-bonus__deadline">Book before September 30<\/span><span>Complete an online estimate and book your move with Purely Canadian Movers\. Discount confirmed with your written estimate\.<\/span>/gi, '<strong>Online estimate bonus: save at least $100</strong><span class="pcm-estimate-bonus__deadline">Book before September 30, 2026</span><span>Complete an online estimate and book your move with Purely Canadian Movers. Discount confirmed with your written estimate.</span>');

  html = setInputIdentity(setInputIdentity(html, "from", config.from), "to", config.to);
  if (config.slug === "montreal-to-victoria-movers") html = replaceFaq(html, config.faqs, config.slug);
  html = ensureRawComponents(html, config);

  const schema = `<script type="application/ld+json" id="pcm-step23-route-faq-schema">${faqSchema(config.faqs)}</script>`;
  html = html.replace(/\s*<\/head>/i, `\n  ${schema}\n</head>`);
  html = html.replace("</body>", `${runtime(config)}\n</body>`);
  await writeFile(file, html);
  console.log(`Finalized ${file}`);
}
