import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const referencePath = new URL("./templates/winnipeg-routes/toronto-to-winnipeg-movers.html", import.meta.url);
const prices = [
  ["Studio or small shipment", "$2,400", "Best for limited furniture or a partial shipment"],
  ["1-bedroom", "$3,400", "Depends on inventory weight or volume, access, and packing"],
  ["2-bedroom", "$5,500", "Common planning range for an apartment or condo move"],
  ["3-bedroom", "$9,000", "Larger household shipment with more labour and space"],
  ["4+ bedroom", "$13,000", "Final estimate depends on inventory, access, and services"],
];

const routes = [
  {
    slug: "ottawa-to-winnipeg-movers", from: "Ottawa", fromProvince: "ON", to: "Winnipeg", toProvince: "MB", distance: "2,170 km", transit: "4–12 days",
    metaDescription: "Plan an Ottawa to Winnipeg long-distance move with estimated costs by home size, 2,170 km route planning, 4–12 days transit guidance, packing, storage, and written quotes.",
    intro: [
      "An Ottawa-to-Winnipeg move is an interprovincial relocation of approximately 2,170 km. A written estimate helps set clear expectations for inventory, pickup and delivery access, packing, timing, and any storage needed between homes.",
      "Purely Canadian Movers coordinates your move with one accountable point of contact and support through the Great Canadian Van Lines agent network. Route planning, documentation, packing, storage, delivery timing, and Declared Value Protection choices are reviewed before moving day.",
      "Ottawa pickup and Winnipeg delivery can involve apartment or condo elevator reservations, loading windows, parking restrictions, stairs, winter access, and building move-in rules that should be confirmed early.",
    ],
    unique: [
      ["Ontario-to-Prairie logistics", "This approximately 2,170 km route crosses Northern Ontario before reaching Manitoba, so shipment size, route scheduling, seasonal conditions, and delivery availability all matter."],
      ["Ottawa pickup access", "Share parking, elevator, loading-zone, stair, and long-carry details early, especially for downtown apartments, condos, and streets with restricted curb access."],
      ["Winnipeg destination access", "Confirm move-in hours, elevator reservations, loading areas, parking, stairs, and winter entry conditions for the Winnipeg address before delivery."],
      ["Manitoba arrival planning", "Keep identity documents and essentials with you, then arrange utilities, address updates, building access, and other arrival details for your Winnipeg home."],
    ],
    tips: [
      ["Plan the Northern Ontario segment", "Allow for a delivery spread rather than a single guaranteed date; weather, highway conditions, shipment size, and route scheduling can affect timing."],
      ["Reserve Winnipeg elevator time", "Ask the building manager about elevator reservations, loading-dock windows, move-in hours, parking rules, and required documents."],
      ["Prepare for seasonal conditions", "Ottawa and Winnipeg both experience severe winter weather. Protect floors and entryways and keep weather-sensitive essentials accessible."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Winnipeg address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Ottawa to Winnipeg?", "Planning estimates range from $2,400 for a studio or small shipment to $13,000 for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed move details."],
      ["How long does an Ottawa to Winnipeg move take?", "Typical transit is 4–12 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; selected protection details are confirmed before moving day."],
      ["How is an Ottawa to Winnipeg move coordinated?", "Purely Canadian Movers provides one accountable point of contact for route planning, documentation, packing, storage, delivery coordination, and support through the Great Canadian Van Lines agent network."],
      ["Can you move Ottawa apartments and Winnipeg homes?", "Yes. Provide elevator reservations, loading-area rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["What should I plan after arriving in Winnipeg?", "Plan your Winnipeg address updates, building access, utilities, healthcare, and other arrival details. Keep identification, medication, chargers, and essential documents with you."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
    ],
  },
  {
    slug: "winnipeg-to-ottawa-movers", from: "Winnipeg", fromProvince: "MB", to: "Ottawa", toProvince: "ON", distance: "2,170 km", transit: "4–12 days",
    metaDescription: "Plan a Winnipeg to Ottawa long-distance move with estimated costs by home size, 2,170 km route planning, 4–12 days transit guidance, packing, storage, and written quotes.",
    intro: [
      "A Winnipeg-to-Ottawa move is an interprovincial relocation of approximately 2,170 km. A written estimate helps set clear expectations for inventory, pickup and delivery access, packing, timing, and any storage needed between homes.",
      "Purely Canadian Movers coordinates your move with one accountable point of contact and support through the Great Canadian Van Lines agent network. Route planning, documentation, packing, storage, delivery timing, and Declared Value Protection choices are reviewed before moving day.",
      "Winnipeg pickup and Ottawa delivery can involve winter access, apartment or condo elevator reservations, loading windows, parking restrictions, stairs, and building move-in rules that should be confirmed early.",
    ],
    unique: [
      ["Prairie-to-Ontario logistics", "This approximately 2,170 km route crosses from Manitoba through Northern Ontario, so shipment size, route scheduling, seasonal conditions, and delivery availability all matter."],
      ["Winnipeg pickup access", "Share parking, elevator, loading-zone, stair, long-carry, and winter-entry details early for Winnipeg houses, apartments, and condos."],
      ["Ottawa destination access", "Confirm curb access, parking restrictions, elevator reservations, loading windows, stairs, and building requirements at the Ottawa address before delivery."],
      ["Ontario arrival planning", "Keep identity documents and essentials with you, then arrange utilities, address updates, building access, and other arrival details for your Ottawa home."],
    ],
    tips: [
      ["Plan the Northern Ontario segment", "Allow for a delivery spread rather than a single guaranteed date; weather, highway conditions, shipment size, and route scheduling can affect timing."],
      ["Confirm Ottawa loading access", "Review curb space, parking rules, street width, stairs, long carries, and whether a smaller vehicle or shuttle may be needed at the destination."],
      ["Prepare for seasonal conditions", "Winnipeg and Ottawa both experience severe winter weather. Protect floors and entryways and keep weather-sensitive essentials accessible."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Ottawa address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Winnipeg to Ottawa?", "Planning estimates range from $2,400 for a studio or small shipment to $13,000 for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed move details."],
      ["How long does a Winnipeg to Ottawa move take?", "Typical transit is 4–12 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; selected protection details are confirmed before moving day."],
      ["How is a Winnipeg to Ottawa move coordinated?", "Purely Canadian Movers provides one accountable point of contact for route planning, documentation, packing, storage, delivery coordination, and support through the Great Canadian Van Lines agent network."],
      ["Can you move Winnipeg homes and Ottawa apartments?", "Yes. Provide elevator reservations, loading-area rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["What should I plan after arriving in Ottawa?", "Plan your Ottawa address updates, building access, utilities, healthcare, and other arrival details. Keep identification, medication, chargers, and essential documents with you."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
    ],
  },
];
assertRouteOwnership("fix-winnipeg-static-routes.mjs", routes);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const routeName = (route) => `${route.from} to ${route.to}`;
const routeDash = (route) => `${route.from}–${route.to}`;
const routeUrl = (route) => `${siteOrigin}/${route.slug}/`;
const opposite = (route) => routes.find((candidate) => candidate !== route);
const card = ([title, body]) => `<article class="pcm-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;

function schema(route) {
  const name = routeName(route);
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: `${name} movers`, serviceType: "Long-distance moving", areaServed: [{ "@type": "City", name: route.from }, { "@type": "City", name: route.to }], url: routeUrl(route), description: `${name} long-distance moving with written estimates, route planning, packing, storage, Declared Value Protection options, approximately ${route.distance} of travel, and typical transit of ${route.transit}.`, additionalProperty: [{ "@type": "PropertyValue", name: "Estimated route distance", value: route.distance }, { "@type": "PropertyValue", name: "Typical transit", value: route.transit }, ...prices.map(([size, price]) => ({ "@type": "PropertyValue", name: `${size} estimated price`, value: price }))] },
    { "@type": "FAQPage", mainEntity: route.faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ] };
}

function replaceMeta(head, selector, value) {
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`, "i");
  if (!pattern.test(head)) throw new Error(`Expected head metadata not found: ${selector}`);
  return head.replace(pattern, (_match, prefix, suffix) => `${prefix}${escapeHtml(value)}${suffix}`);
}

function buildHead(template, route) {
  const bodyStart = template.indexOf("<body");
  if (bodyStart < 0) throw new Error("Reference route template has no body");
  const name = routeName(route);
  const title = `${name} Movers | Cost, Transit Time & Estimate | Purely Canadian Movers`;
  let head = template.slice(0, bodyStart).replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapeHtml(title)}">${escapeHtml(title)}</title>`).replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${routeUrl(route)}$2`);
  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'name="keywords"', `${name} movers, moving from ${route.from} to ${route.to}, long distance movers ${route.from} to ${route.to}, ${route.from} ${route.to} moving company, ${name} moving cost, ${name} moving quote`);
  for (const [selector, value] of [['property="og:title"', title], ['property="og:description"', route.metaDescription], ['property="og:url"', routeUrl(route)], ['name="twitter:title"', title], ['name="twitter:description"', route.metaDescription]]) head = replaceMeta(head, selector, value);
  head = head.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");
  return head.replace("</head>", `    <style id="pcm-step29-route-css">
      .pcm-static-nav-overlay{display:none;position:fixed;inset:0;z-index:89;background:rgba(15,23,42,.55)}.pcm-static-nav-overlay.is-open{display:block}
      body.pcm-static-route-ready .pcm-top-estimate{grid-template-columns:minmax(0,1fr) minmax(320px,420px);gap:24px;padding:24px;border-left:5px solid #cc1a1a;box-shadow:0 16px 40px rgba(17,24,39,.12)}
      body.pcm-static-route-ready .pcm-static-main>.pcm-route-glance-section{background:#fff!important}
      body.pcm-static-route-ready .pcm-route-glance-card{max-width:832px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb}
      body.pcm-static-route-ready .pcm-route-glance-card>h3{margin:0 0 16px;font-family:"Playfair Display",serif;font-size:20px;font-weight:700;line-height:28px;color:#111827}
      body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-route-glance{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;max-width:none;margin:0}
      body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-item{display:flex;min-height:0;align-items:flex-start;flex-direction:row;justify-content:flex-start;gap:12px;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;text-align:left}
      body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-icon{flex:0 0 20px;color:#cc1a1a;font:700 18px/28px "Source Sans 3",sans-serif}
      body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-label{display:block;margin:0 0 2px;font-family:"Source Sans 3",sans-serif;font-size:12px;font-weight:400;line-height:16px;letter-spacing:.08em;text-transform:uppercase;color:#64748b}
      body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-value{display:block;margin:0;font-family:"Playfair Display",serif;font-size:18px;font-weight:700;line-height:28px;color:#111827}
      body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-glance-support{display:block;font-family:"Source Sans 3",sans-serif;font-size:14px;font-weight:400;line-height:20px;color:#64748b}
      @media(max-width:820px){body.pcm-static-route-ready .pcm-top-estimate{grid-template-columns:1fr;gap:24px;padding:18px}body.pcm-static-route-ready .pcm-route-glance-card{padding:24px}}
      @media(max-width:639px){body.pcm-static-route-ready .pcm-static-main .pcm-route-glance-section .pcm-route-glance{grid-template-columns:1fr}}
    </style>\n    <script type="application/ld+json" id="route-schema">${JSON.stringify(schema(route))}</script>\n</head>`);
}

function extract(template, pattern, label) {
  const match = template.match(pattern);
  if (!match) throw new Error(`Reference route template has no ${label}`);
  return match[0];
}

function quotePanel(route) {
  const name = routeName(route);
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate"><div class="pcm-top-estimate"><div class="pcm-top-estimate__intro"><div class="pcm-kicker">FREE MOVING ESTIMATE</div><h2>Request your ${escapeHtml(name)} quote.</h2><p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p><div class="pcm-pills" aria-label="Estimate trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">Coquitlam office</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Declared Value Protection available</span></div></div><form class="pcm-estimate pcm-lead-panel" action="/contact/" method="get"><div class="pcm-form-grid"><label>Moving from<input name="from" value="${escapeHtml(route.from)}, ${route.fromProvince}" placeholder="${escapeHtml(route.from)}, ${route.fromProvince}"></label><label>Moving to<input name="to" value="${escapeHtml(route.to)}, ${route.toProvince}" placeholder="${escapeHtml(route.to)}, ${route.toProvince}"></label><label>Home size<select name="homeSize"><option value="">Select size</option><option>Studio</option><option>1 Bedroom</option><option>2 Bedrooms</option><option>3 Bedrooms</option><option>4+ Bedrooms</option></select></label><label>Move date<input name="moveDate" type="date"></label></div><div class="pcm-buttons"><button class="pcm-button primary" type="submit">Get Written Estimate</button><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-form-note"><strong>No spam. No pressure. Just your moving estimate.</strong> Questions? Call Purely Canadian Movers: 1-877-485-6683</p><div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Online estimate bonus: save at least $100</strong><span class="pcm-estimate-bonus__deadline">Book before September 30, 2026</span><span>Complete an online estimate and book your move with Purely Canadian Movers. Discount confirmed with your written estimate.</span></div></div><div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:6045227222">604-522-7222</a> · Direct mover since 1991</div></form></div></section>`;
}

function pricingSection(route) {
  const name = routeName(route);
  const article = route.from === "Ottawa" ? "An" : "A";
  const rows = prices.map(([size, price, note]) => `<tr><td>${escapeHtml(size)}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>${route.transit}</td></tr>`).join("");
  return `<section class="pcm-lead-boost pcm-route-cost" aria-label="${escapeHtml(name.toUpperCase())} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(name.toUpperCase())} MOVING COST</div><h2>How much does it cost to move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>${article} ${escapeHtml(name)} move typically ranges from about <strong>${prices[0][1]}</strong> for a small shipment to <strong>${prices[4][1]}</strong> for a larger home. Many 1–2 bedroom moves are estimated around <strong>${prices[1][1]}–${prices[2][1]}</strong>, depending on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed services.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__inclusion">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible where applicable.</p><p class="pcm-route-cost__note">Prices are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, protection choices, and service dates.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full moving cost guide</a><a href="/ottawa-long-distance-movers/">Ottawa long-distance movers</a><a href="/${opposite(route).slug}/">${escapeHtml(routeName(opposite(route)))} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  const name = routeName(route);
  return `<div class="pcm-static-band pcm-static-band--hero"><section class="pcm-hero pcm-static-hero"><div><div class="pcm-kicker">${escapeHtml(name)} movers</div><h1>${escapeHtml(name)} Movers</h1><p>Professional long-distance moving from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}, with written estimates, route planning, packing, storage, and Declared Value Protection options.</p><p>Purely Canadian Movers coordinates your move with one accountable point of contact and support through the Great Canadian Van Lines agent network.</p><div class="pcm-pills" aria-label="Trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span></div><div class="pcm-hero-actions"><a class="pcm-button primary" href="/contact/">Get Written Estimate</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></div>`;
}

function routeGlance(route) {
  const item = (icon, label, value, support) => `<div class="pcm-glance-item"><span class="pcm-glance-icon" aria-hidden="true">${icon}</span><div><span class="pcm-glance-label">${label}</span><strong class="pcm-glance-value">${value}</strong><span class="pcm-glance-support">${support}</span></div></div>`;
  return `<section class="pcm-section pcm-route-glance-section pcm-static-route-glance"><div class="pcm-route-glance-card"><h3>${escapeHtml(routeDash(route))} Route at a Glance</h3><div class="pcm-route-glance">${item("↔", "Distance", `Approximately ${route.distance}`, escapeHtml(routeName(route)))}${item("◷", "Est. transit time", route.transit, "Depending on shipment size and scheduling")}${item("$", "Typical cost range", `${prices[0][1]}–${prices[4][1]}`, "Studio to 4+ bedroom home")}</div></div></section>`;
}

function routeBody(route) {
  const article = route.from === "Ottawa" ? "an" : "a";
  return `<main class="pcm-static-main">${hero(route)}<section class="pcm-section"><h2>Moving from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}</h2>${route.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>${routeGlance(route)}<section class="pcm-section"><h2>What Makes ${article} ${escapeHtml(routeDash(route))} Move Unique</h2><div class="pcm-grid">${route.unique.map(card).join("")}</div></section><section class="pcm-section"><h2>Tips for Moving to ${escapeHtml(route.to)}</h2><div class="pcm-grid">${route.tips.map(card).join("")}</div></section><section class="pcm-section"><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-checklist"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>Established Great Canadian Van Lines agent-network support</li><li>One accountable point of contact for route planning, documentation, and delivery coordination</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Declared Value Protection choices are explained before moving day</li><li>Full or partial packing and storage options are available</li></ul><div class="pcm-warning"><strong>Review unusually low long-distance quotes carefully.</strong> Ask for a written estimate and confirm fuel, access, packing, storage, protection choices, and other included services before signing.</div></section><section class="pcm-section"><h2>How Your ${escapeHtml(routeDash(route))} Move Works</h2><div class="pcm-steps"><article class="pcm-card"><h3>1. Free estimate</h3><p>Tell us about the route, home size, inventory, access, services, and preferred moving date.</p></article><article class="pcm-card"><h3>2. Pack and load</h3><p>Confirm packing, loading, elevator, parking, stair, and long-carry details before pickup.</p></article><article class="pcm-card"><h3>3. Interprovincial transit</h3><p>Your shipment is coordinated by Purely Canadian Movers with Great Canadian Van Lines agent-network support.</p></article><article class="pcm-card"><h3>4. Delivery and placement</h3><p>Delivery timing and destination access are coordinated in writing; the delivery team places items in the rooms you identify.</p></article></div></section><section class="pcm-section pcm-faq-section" aria-labelledby="faq-heading"><h2 id="faq-heading">Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></section><section class="pcm-section"><h2>Related Destinations and Resources</h2><div class="pcm-links"><a href="/ottawa-long-distance-movers/">Ottawa Long-Distance Movers</a><a href="/${opposite(route).slug}/">${escapeHtml(routeName(opposite(route)))} Movers</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/great-canadian-vanlines-agent/">Great Canadian Van Lines Agent</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a Written Estimate</a></div></section><section class="pcm-section pcm-closing-cta pcm-static-closing-cta"><h2>Ready to Move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>Request a free, no-obligation written estimate for your interprovincial move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-local-line">Or call our local line: <a href="tel:6045227222">604-522-7222</a></p></section></main>`;
}

function page(template, route) {
  const header = extract(template, /<header class="pcm-site-header">[\s\S]*?<\/header>/i, "site header");
  const footer = extract(template, /<footer class="pcm-footer">[\s\S]*?<\/footer>/i, "site footer");
  const navEnhancement = `<script>window.addEventListener("load",function(){var t=document.querySelector('.pcm-menu-toggle'),p=document.querySelector('.pcm-static-mobile'),c=p&&p.querySelector('button[aria-label="Close menu"]');if(!t||!p||!c)return;var o=document.createElement('div');o.className='pcm-static-nav-overlay';o.setAttribute('aria-hidden','true');document.body.insertBefore(o,p);p.id='pcm-static-mobile-menu';t.setAttribute('aria-controls',p.id);t.setAttribute('aria-expanded','false');function shut(){p.classList.remove('is-open');o.classList.remove('is-open');t.setAttribute('aria-expanded','false');t.focus()}t.addEventListener('click',function(){o.classList.add('is-open');t.setAttribute('aria-expanded','true')});c.addEventListener('click',function(){o.classList.remove('is-open');t.setAttribute('aria-expanded','false')});o.addEventListener('click',shut);document.addEventListener('keydown',function(e){if(!p.classList.contains('is-open'))return;if(e.key==='Escape'){e.preventDefault();shut();return}if(e.key!=='Tab')return;var f=[].slice.call(p.querySelectorAll('a,button')).filter(function(x){return !x.disabled});if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}})})</script>`;
  return `${buildHead(template, route)}<body class="pcm-static-route-ready"><div id="root" class="pcm-static-route pcm-static-route-ready">${quotePanel(route)}${pricingSection(route)}${header}<div class="pcm-static-page">${routeBody(route)}</div>${footer}</div><script defer src="/assets/conversion-boost.js"></script><script defer src="/assets/static-nav.js"></script>${navEnhancement}<div class="pcm-lead-boost pcm-sticky-cta"><a class="pcm-primary-button" href="/contact/">Get Estimate</a><a class="pcm-secondary-button" href="tel:18774856683">Call</a></div><button type="button" class="pcm-chat-nudge is-visible" aria-label="Ask a moving question or get a quick price quote"><strong>Not ready for an estimate?</strong><span>Ask us a moving question or get a quick price quote</span></button></body></html>`;
}

function ensureRoutePage(html, route) {
  const title = `${routeName(route)} Movers | Cost, Transit Time & Estimate | Purely Canadian Movers`;
  const required = [`<h1>${routeName(route)} Movers</h1>`, `value="${route.from}, ${route.fromProvince}"`, `value="${route.to}, ${route.toProvince}"`, "pcm-route-cost", `${routeDash(route)} Route at a Glance`, "Frequently Asked Questions", route.distance, route.transit, ...prices.map(([, price]) => price), "Declared Value Protection", escapeHtml(title), "static-chat.js", "static-nav.js"];
  for (const marker of required) if (!html.includes(marker)) throw new Error(`${route.slug}: generated page missing ${marker}`);
  const count = (pattern) => (html.match(pattern) || []).length;
  if (count(/<h1\b/gi) !== 1 || count(/<form\b/gi) !== 1 || count(/class="[^"]*\bpcm-route-cost\b/g) !== 1 || count(/<table\b/gi) !== 1 || count(/Route at a Glance/g) !== 1) throw new Error(`${route.slug}: structural count failed`);
  if (count(/<h2 id="faq-heading">Frequently Asked Questions<\/h2>/g) !== 1 || count(/"@type":"FAQPage"/g) !== 1) throw new Error(`${route.slug}: FAQ implementation/schema count failed`);
  if (count(/pcm-local-seo/g) !== 0) throw new Error(`${route.slug}: local SEO contamination remains`);
  if (/\b(?:a Ottawa|A Ottawa|an Winnipeg|An Winnipeg)\b/.test(html)) throw new Error(`${route.slug}: invalid city article remains`);
  if (/valuation coverage|insurance coverage|Moving Cost Breakdown|Route Pricing|Book before\s+August|Page Not Found|\bundefined\b/i.test(html)) throw new Error(`${route.slug}: legacy or contaminated wording remains`);
  return html;
}

const template = await readFile(referencePath, "utf8");
for (const route of routes) {
  const outputPath = join(root, route.slug, "index.html");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(outputPath, ensureRoutePage(page(template, route), route), "utf8");
  console.log(`Wrote ${outputPath}`);
}
