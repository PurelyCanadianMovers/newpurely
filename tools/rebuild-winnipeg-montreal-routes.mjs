import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { ensureDedicatedPopularRoutes } from "./cost-guide-popular-routes.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const referencePath = join(root, "toronto-to-winnipeg-movers", "index.html");
const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");

const prices = [
  ["Studio or small shipment", "$2,400+", "Best for limited furniture or a partial shipment"],
  ["1-bedroom", "$3,400+", "Depends on inventory weight or volume, access, and packing"],
  ["2-bedroom", "$5,500+", "Common planning range for an apartment or condo move"],
  ["3-bedroom", "$9,000+", "Larger household shipment with more labour and space"],
  ["4+ bedroom", "$13,000+", "Final estimate depends on inventory, access, and services"],
];

const routes = [
  {
    slug: "winnipeg-to-montreal-movers",
    from: "Winnipeg",
    fromProvince: "MB",
    to: "Montreal",
    toProvince: "QC",
    distance: "2,270 km",
    transit: "5–13 days",
    metaDescription:
      "Plan a Winnipeg to Montreal long-distance move with route-specific pricing from $2,400+, approximately 2,270 km, 5–13 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "A Winnipeg-to-Montreal move is a major interprovincial relocation of approximately 2,270 km. A written estimate helps set clear expectations for your inventory, pickup and delivery access, packing needs, timing, and any storage required between homes.",
      "Purely Canadian Movers coordinates your move with one accountable point of contact and support through the Great Canadian Van Lines agent network. Route planning, documentation, packing, storage, delivery timing, and Declared Value Protection choices are reviewed before moving day.",
      "Winnipeg pickup and Montreal delivery can involve apartment or condo elevator reservations, loading windows, parking or curb restrictions, stairs, winter access, and building move-in rules that should be confirmed early.",
    ],
    unique: [
      ["Prairie-to-Quebec logistics", "At approximately 2,270 km, this route benefits from clear planning around shipment size, access, route scheduling, seasonal conditions, and the delivery window available at your Montreal address."],
      ["Winnipeg pickup access", "Share parking, elevator, loading-zone, stair, and long-carry details early, especially for Winnipeg apartments, condos, and homes with winter access concerns."],
      ["Montreal destination access", "Montreal apartments, condos, and homes may have move-in hours, loading-zone rules, elevator reservations, parking limits, stairs, and building requirements to confirm before delivery."],
      ["Quebec arrival planning", "Keep identity documents and essentials with you, then plan address, utility, building, healthcare, and other arrival updates for your new Montreal home."],
    ],
    tips: [
      ["Reserve Montreal elevator time", "Ask the building manager about elevator reservations, loading-dock windows, move-in hours, parking rules, and any building-document requirements."],
      ["Confirm Montreal loading access", "Review curb space, parking permits, street width, stairs, long carries, and whether a smaller vehicle or shuttle is needed at the destination."],
      ["Prepare for seasonal conditions", "Winnipeg and Montreal can have challenging winter conditions. Protect floors and entryways, and keep weather-sensitive essentials accessible."],
      ["Plan your arrival essentials", "Keep identification, medication, chargers, documents, and first-week necessities with you rather than in the shipment."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Montreal address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Winnipeg to Montreal?", "Planning estimates range from $2,400+ for a studio or small shipment to $13,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed move details."],
      ["How long does a Winnipeg to Montreal move take?", "Typical transit is 5–13 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is a Winnipeg to Montreal move coordinated?", "Purely Canadian Movers provides one accountable point of contact for route planning, documentation, packing, storage, delivery coordination, and support through the Great Canadian Van Lines agent network."],
      ["Can you move Winnipeg homes and Montreal apartments?", "Yes. Provide elevator reservations, loading-dock rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["What should I plan after arriving in Montreal?", "Plan your Montreal address, building access, utilities, healthcare, and other arrival updates. Keep identification, medication, chargers, and essential documents with you."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
    ],
  },
  {
    slug: "montreal-to-winnipeg-movers",
    from: "Montreal",
    fromProvince: "QC",
    to: "Winnipeg",
    toProvince: "MB",
    distance: "2,270 km",
    transit: "5–13 days",
    metaDescription:
      "Plan a Montreal to Winnipeg long-distance move with route-specific pricing from $2,400+, approximately 2,270 km, 5–13 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "A Montreal-to-Winnipeg move is a major interprovincial relocation of approximately 2,270 km. A written estimate helps set clear expectations for your inventory, pickup and delivery access, packing needs, timing, and any storage required between homes.",
      "Purely Canadian Movers coordinates your move with one accountable point of contact and support through the Great Canadian Van Lines agent network. Route planning, documentation, packing, storage, delivery timing, and Declared Value Protection choices are reviewed before moving day.",
      "Montreal pickup and Winnipeg delivery can involve apartment or condo elevator reservations, loading windows, parking or curb restrictions, stairs, winter access, and building move-in rules that should be confirmed early.",
    ],
    unique: [
      ["Quebec-to-Prairie logistics", "At approximately 2,270 km, this route benefits from clear planning around shipment size, access, route scheduling, seasonal conditions, and the delivery window available at your Winnipeg address."],
      ["Montreal pickup access", "Share parking, elevator, loading-zone, stair, and long-carry details early, especially for Montreal apartments, condos, and dense urban buildings."],
      ["Winnipeg destination access", "Winnipeg apartments, condos, and homes may have move-in hours, loading-zone rules, elevator reservations, parking limits, stairs, and winter entry conditions to confirm before delivery."],
      ["Manitoba arrival planning", "Keep identity documents and essentials with you, then plan address, utility, building, healthcare, and other arrival updates for your new Winnipeg home."],
    ],
    tips: [
      ["Reserve Winnipeg elevator time", "Ask the building manager about elevator reservations, loading-dock windows, move-in hours, parking rules, and any building-document requirements."],
      ["Confirm Winnipeg loading access", "Review curb space, parking permits, street width, stairs, long carries, and whether a smaller vehicle or shuttle is needed at the destination."],
      ["Prepare for seasonal conditions", "Montreal and Winnipeg can have challenging winter conditions. Protect floors and entryways, and keep weather-sensitive essentials accessible."],
      ["Plan your arrival essentials", "Keep identification, medication, chargers, documents, and first-week necessities with you rather than in the shipment."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Winnipeg address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Montreal to Winnipeg?", "Planning estimates range from $2,400+ for a studio or small shipment to $13,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed move details."],
      ["How long does a Montreal to Winnipeg move take?", "Typical transit is 5–13 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is a Montreal to Winnipeg move coordinated?", "Purely Canadian Movers provides one accountable point of contact for route planning, documentation, packing, storage, delivery coordination, and support through the Great Canadian Van Lines agent network."],
      ["Can you move Montreal apartments and Winnipeg homes?", "Yes. Provide elevator reservations, loading-dock rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["What should I plan after arriving in Winnipeg?", "Plan your Winnipeg address, building access, utilities, healthcare, and other arrival updates. Keep identification, medication, chargers, and essential documents with you."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
    ],
  },
];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const routeName = (route) => `${route.from} to ${route.to}`;
const routeDash = (route) => `${route.from}–${route.to}`;
const routeUrl = (route) => `${siteOrigin}/${route.slug}/`;

function card([title, body]) {
  return `<article class="pcm-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;
}

function schema(route) {
  const name = routeName(route);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${name} movers`,
        serviceType: "Long-distance moving",
        areaServed: [
          { "@type": "City", name: route.from },
          { "@type": "City", name: route.to },
        ],
        url: routeUrl(route),
        description: `${name} long-distance moving with written estimates, route planning, packing, storage, Declared Value Protection options, approximately ${route.distance} of travel, and typical transit of ${route.transit}.`,
        additionalProperty: [
          { "@type": "PropertyValue", name: "Estimated route distance", value: route.distance },
          { "@type": "PropertyValue", name: "Typical transit", value: route.transit },
          ...prices.map(([size, price]) => ({ "@type": "PropertyValue", name: `${size} starting price`, value: price })),
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: route.faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
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
  const title = `${name} Movers | Cost, Transit Time & Estimate`;
  let head = template.slice(0, bodyStart)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${routeUrl(route)}$2`);

  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'name="keywords"', `${name} movers, moving from ${route.from} to ${route.to}, long distance movers ${route.from} to ${route.to}, ${route.from} ${route.to} moving company, ${name} moving cost, ${name} moving quote`);
  head = replaceMeta(head, 'property="og:title"', title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', routeUrl(route));
  head = replaceMeta(head, 'name="twitter:title"', title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);
  head = head.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");
  return head.replace("</head>", `    <script type="application/ld+json" id="route-schema">${JSON.stringify(schema(route))}</script>\n</head>`);
}

function extract(template, pattern, label) {
  const match = template.match(pattern);
  if (!match) throw new Error(`Reference route template has no ${label}`);
  return match[0];
}

function quotePanel(route) {
  const name = routeName(route);
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate">
      <div class="pcm-top-estimate">
        <div class="pcm-top-estimate__intro">
          <div class="pcm-kicker">FREE MOVING ESTIMATE</div>
          <h2>Get a ${escapeHtml(name)} quote.</h2>
          <p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p>
          <div class="pcm-pills" aria-label="Estimate trust signals">
            <span class="pcm-pill">Family-owned since 1991</span>
            <span class="pcm-pill">Coquitlam office</span>
            <span class="pcm-pill">BBB Accredited business</span>
            <span class="pcm-pill">Great Canadian Van Lines agent</span>
            <span class="pcm-pill">Written estimates</span>
            <span class="pcm-pill">Declared Value Protection available</span>
          </div>
        </div>
        <form class="pcm-estimate pcm-lead-panel" action="/contact/" method="get">
          <div class="pcm-form-grid">
            <label>Moving from
              <input name="from" value="${escapeHtml(route.from)}, ${route.fromProvince}" placeholder="${escapeHtml(route.from)}, ${route.fromProvince}">
            </label>
            <label>Moving to
              <input name="to" value="${escapeHtml(route.to)}, ${route.toProvince}" placeholder="${escapeHtml(route.to)}, ${route.toProvince}">
            </label>
            <label>Home size
              <select name="homeSize"><option value="">Select size</option><option>Studio</option><option>1 Bedroom</option><option>2 Bedrooms</option><option>3 Bedrooms</option><option>4+ Bedrooms</option></select>
            </label>
            <label>Move date
              <input name="moveDate" type="date">
            </label>
          </div>
          <div class="pcm-buttons"><button class="pcm-button primary" type="submit">Get Written Estimate</button><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div>
          <p class="pcm-form-note"><strong>No spam. No pressure. Just your moving estimate.</strong> Questions? Call Purely Canadian Movers: 1-877-485-6683</p>
          <div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed in writing.</span></div></div>
          <div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:6045227222">604-522-7222</a> · Direct mover since 1991</div>
        </form>
      </div>
    </section>`;
}

function pricingSection(route) {
  const name = routeName(route);
  const rows = prices.map(([size, price, note]) => `<tr><td>${escapeHtml(size)}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>${route.transit}</td></tr>`).join("");
  return `<section class="pcm-lead-boost pcm-route-cost" aria-label="${escapeHtml(name.toUpperCase())} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(name.toUpperCase())} MOVING COST</div><h2>How much does it cost to move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>A ${escapeHtml(name)} move typically ranges from about <strong>${prices[0][1]}</strong> for a small shipment to <strong>${prices[4][1]}</strong> for a larger home. Many 1–2 bedroom moves are estimated around <strong>${prices[1][1]}–${prices[2][1]}</strong>, depending on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed services.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__inclusion">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible where applicable.</p><p class="pcm-route-cost__note">Prices are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, protection choices, and service dates.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full moving cost guide</a><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} long-distance movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} long-distance movers</a><a href="/${route.slug === "winnipeg-to-montreal-movers" ? "montreal-to-winnipeg-movers" : "winnipeg-to-montreal-movers"}/">${escapeHtml(route.slug === "winnipeg-to-montreal-movers" ? "Montreal to Winnipeg" : "Winnipeg to Montreal")} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  const name = routeName(route);
  return `<div class="pcm-static-band pcm-static-band--hero"><section class="pcm-hero pcm-static-hero"><div><div class="pcm-kicker">${escapeHtml(name)} movers</div><h1>${escapeHtml(name)} Movers</h1><p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p><p>Purely Canadian Movers coordinates your move with one accountable point of contact and support through the Great Canadian Van Lines agent network, giving you clear route planning and delivery coordination.</p><div class="pcm-pills" aria-label="Trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Packing and storage available</span></div><div class="pcm-hero-actions"><a class="pcm-button primary" href="/contact/">Get Written Estimate</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></div>`;
}

function routeGlance(route) {
  return `<section class="pcm-section pcm-route-glance-section pcm-static-route-glance"><h2>${escapeHtml(routeDash(route))} Route at a Glance</h2><div class="pcm-route-glance"><div class="pcm-glance-item"><span class="pcm-glance-label">Distance</span><strong class="pcm-glance-value">Approximately ${route.distance}</strong><span class="pcm-glance-support">${escapeHtml(routeName(route))}</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Est. transit time</span><strong class="pcm-glance-value">${route.transit}</strong><span class="pcm-glance-support">Depending on shipment size and scheduling</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Typical cost range</span><strong class="pcm-glance-value">${prices[0][1]}–${prices[4][1]}</strong><span class="pcm-glance-support">Studio to 4+ bedroom home</span></div></div></section>`;
}

function routeBody(route) {
  const name = routeName(route);
  const opposite = route.slug === "winnipeg-to-montreal-movers" ? "Montreal to Winnipeg" : "Winnipeg to Montreal";
  const oppositeSlug = route.slug === "winnipeg-to-montreal-movers" ? "montreal-to-winnipeg-movers" : "winnipeg-to-montreal-movers";
  return `<main class="pcm-static-main">
      ${hero(route)}
      <section class="pcm-section"><h2>Moving from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}</h2>${route.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>
      ${routeGlance(route)}
      <section class="pcm-section"><h2>What Makes a ${escapeHtml(routeDash(route))} Move Unique</h2><div class="pcm-grid">${route.unique.map(card).join("")}</div></section>
      <section class="pcm-section"><h2>Tips for Moving to ${escapeHtml(route.to)}</h2><div class="pcm-grid">${route.tips.map(card).join("")}</div></section>
      <section class="pcm-section"><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-checklist"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>Purely Canadian Movers coordinates your move with established Great Canadian Van Lines agent-network support</li><li>One accountable point of contact for route planning, documentation, and delivery coordination</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Declared Value Protection choices are explained before moving day</li><li>Full or partial packing and storage options are available</li></ul><div class="pcm-warning"><strong>Review unusually low long-distance quotes carefully.</strong> Ask for a written estimate and confirm fuel, access, packing, storage, protection choices, and other included services before signing.</div></section>
      <section class="pcm-section"><h2>How Your ${escapeHtml(routeDash(route))} Move Works</h2><div class="pcm-steps"><article class="pcm-card"><h3>1. Free estimate</h3><p>Tell us about the route, home size, inventory, access, services, and preferred moving date.</p></article><article class="pcm-card"><h3>2. Pack and load</h3><p>Confirm packing, loading, elevator, parking, stair, and long-carry details before pickup.</p></article><article class="pcm-card"><h3>3. Cross-country transit</h3><p>Your shipment is coordinated by Purely Canadian Movers and supported through the Great Canadian Van Lines agent network.</p></article><article class="pcm-card"><h3>4. Delivery and placement</h3><p>Delivery timing and destination access are coordinated in writing; the delivery team places items in the rooms you identify.</p></article></div></section>
      <section class="pcm-section"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></section>
      <section class="pcm-section"><h2>Related Destinations and Resources</h2><div class="pcm-links"><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} Long-Distance Movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} Long-Distance Movers</a><a href="/${oppositeSlug}/">${escapeHtml(opposite)} Movers</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/great-canadian-vanlines-agent/">Great Canadian Van Lines Agent</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a Written Estimate</a></div></section>
      <section class="pcm-section pcm-closing-cta pcm-static-closing-cta"><h2>Ready to Move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>Request a free, no-obligation written estimate for your cross-country move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-local-line">Or call our local line: <a href="tel:6045227222">604-522-7222</a></p></section>
    </main>`;
}

function page(template, route) {
  const header = extract(template, /<header class="pcm-site-header">[\s\S]*?<\/header>/i, "site header");
  const footer = extract(template, /<footer class="pcm-footer">[\s\S]*?<\/footer>/i, "site footer");
  return `${buildHead(template, route)}<body class="pcm-static-route-ready">
  <div id="root" class="pcm-static-route pcm-static-route-ready">
    ${quotePanel(route)}
    ${pricingSection(route)}
    ${header}
    <div class="pcm-static-page">${routeBody(route)}</div>
    ${footer}
  </div>
  <script defer src="/assets/conversion-boost.js"></script>
  <script defer src="/assets/static-nav.js"></script>
  <div class="pcm-lead-boost pcm-sticky-cta"><a class="pcm-primary-button" href="/contact/">Get Estimate</a><a class="pcm-secondary-button" href="tel:18774856683">Call</a></div>
  <button type="button" class="pcm-chat-nudge is-visible" aria-label="Ask a moving question or get a quick price quote"><strong>Not ready for an estimate?</strong><span>Ask us a moving question or get a quick price quote</span></button>
</body></html>`;
}

function routeRow(route, alternate) {
  const classes = alternate ? "border-b border-gray-200 bg-gray-50 hover:bg-red-50" : "border-b border-gray-200 bg-white hover:bg-red-50";
  return `<tr data-route="${route.slug}" class="${classes}"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${route.from} → ${route.to}</td>${prices.map(([size, price], index) => `<td class="py-3 px-4 font-body ${index === prices.length - 1 ? "text-[#CC1A1A] font-semibold" : "text-gray-700"}">${price.replace("+", "")}</td>`).join("")}</tr>`;
}

function updatePricingTable(html) {
  const headingMatch = html.match(/<h2\b[^>]*>Long-Distance Moving Costs by Route<\/h2>/i);
  const headingIndex = headingMatch?.index ?? -1;
  if (headingIndex < 0) throw new Error("Cost guide pricing heading not found");
  let tableStart = html.indexOf("<table", headingIndex);
  let tableEnd = -1;
  let bodyStart = -1;
  let bodyOpenEnd = -1;
  let bodyEnd = -1;
  while (tableStart >= 0) {
    tableEnd = html.indexOf("</table>", tableStart);
    bodyStart = html.indexOf("<tbody", tableStart);
    bodyOpenEnd = html.indexOf(">", bodyStart);
    bodyEnd = html.indexOf("</tbody>", bodyOpenEnd);
    if (tableEnd >= 0 && bodyStart >= 0 && bodyStart < tableEnd && bodyOpenEnd >= 0 && bodyEnd >= 0 && bodyEnd < tableEnd) break;
    tableStart = html.indexOf("<table", tableEnd + 8);
  }
  if (tableStart < 0 || tableEnd < 0 || bodyStart < 0 || bodyOpenEnd < 0 || bodyEnd < 0 || bodyEnd > tableEnd) throw new Error("Cost guide pricing table body not found");

  const bySlug = new Map(routes.map((route) => [route.slug, route]));
  const byLabel = new Map(routes.map((route) => [`${route.from} → ${route.to}`, route]));
  const seen = new Set();
  let kept = 0;
  let body = "";
  for (const match of html.slice(bodyOpenEnd + 1, bodyEnd).matchAll(/<tr\b[\s\S]*?<\/tr>/gi)) {
    const row = match[0];
    const slug = row.match(/\bdata-route="([^"]+)"/i)?.[1] ?? "";
    const label = row.match(/<td\b[^>]*>\s*([^<]*?)\s*<\/td>/i)?.[1]?.trim() ?? "";
    const route = bySlug.get(slug) ?? byLabel.get(label);
    if (!route) {
      body += row;
      kept += 1;
      continue;
    }
    if (seen.has(route.slug)) continue;
    body += routeRow(route, kept % 2 === 1);
    seen.add(route.slug);
    kept += 1;
  }
  for (const route of routes) {
    if (seen.has(route.slug)) continue;
    body += routeRow(route, kept % 2 === 1);
    kept += 1;
  }
  return html.slice(0, bodyOpenEnd + 1) + body + html.slice(bodyEnd);
}

async function ensureSitemapRoutes() {
  let lines = (await readFile(join(root, "sitemap.xml"), "utf8")).split(/\r?\n/);
  for (const route of routes) {
    const url = routeUrl(route);
    lines = lines.filter((line) => !line.includes(`<loc>${url}</loc>`));
    const closeIndex = lines.findIndex((line) => /<\/urlset>/i.test(line));
    if (closeIndex < 0) throw new Error("Sitemap urlset closing tag not found");
    lines.splice(closeIndex, 0, `  <url><loc>${url}</loc></url>`);
  }
  await writeFile(join(root, "sitemap.xml"), lines.join("\n"), "utf8");
}

function normalizeSharedCostGuideCopy(html) {
  return html
    .replace(/<strong>Online estimate bonus: save at least \$100<\/strong><span class="pcm-estimate-bonus__deadline">Book before August 31<\/span><span>Complete an online estimate and book your move with Purely Canadian Movers\. Discount confirmed with your written estimate\.<\/span>/g, "<strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed in writing.</span>")
    .replace(/valuation coverage options/gi, "Declared Value Protection options")
    .replace(/valuation coverage/gi, "Declared Value Protection")
    .replace(/insurance coverage options/gi, "Declared Value Protection options")
    .replace(/proper insurance/gi, "appropriate moving protection");
}

function ensureRoutePage(html, route) {
  if (html.includes("undefined")) throw new Error(`${route.slug}: generated page contains undefined`);
  const required = [
    `<h1>${routeName(route)} Movers</h1>`,
    `class="pcm-top-estimate"`,
    `class="pcm-estimate pcm-lead-panel"`,
    "pcm-route-cost",
    `${routeDash(route)} Route at a Glance`,
    "Frequently Asked Questions",
    route.distance,
    route.transit,
    ...prices.map(([, price]) => price),
    "Declared Value Protection",
  ];
  for (const marker of required) if (!html.includes(marker)) throw new Error(`${route.slug}: generated page missing ${marker}`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one H1`);
  if ((html.match(/<form\b/gi) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one quote form`);
  if ((html.match(/class="[^"]*\bpcm-route-cost\b/g) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one pricing block`);
  if ((html.match(/Route at a Glance/g) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one route glance`);
  if (html.match(/Book before August 31/gi)?.length) throw new Error(`${route.slug}: stale dated promotion remains`);
  if (/fully insured|\binsurance\b|basic valuation coverage|full-value protection|Moving Cost Breakdown/i.test(html)) throw new Error(`${route.slug}: legacy protection or pricing wording remains`);
  if (/Toronto, ON|Calgary, AB/.test(html)) throw new Error(`${route.slug}: generic route leakage remains`);
  return html;
}

const template = await readFile(referencePath, "utf8");
for (const route of routes) {
  const outputPath = join(root, route.slug, "index.html");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(outputPath, ensureRoutePage(page(template, route), route), "utf8");
  console.log(`Wrote ${outputPath}`);
}

let costGuide = await readFile(costGuidePath, "utf8");
costGuide = normalizeSharedCostGuideCopy(costGuide);
costGuide = updatePricingTable(costGuide);
costGuide = ensureDedicatedPopularRoutes(costGuide);
costGuide = costGuide.replace(/Estimated pricing for \d+ popular Canadian routes\./, "Estimated pricing for 46 popular Canadian routes.");
await writeFile(costGuidePath, costGuide, "utf8");
console.log(`Updated ${costGuidePath} route tables`);

await ensureSitemapRoutes();
console.log(`Updated ${join(root, "sitemap.xml")}`);
