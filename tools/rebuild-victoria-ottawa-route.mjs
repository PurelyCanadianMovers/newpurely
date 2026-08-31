import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const slug = "victoria-to-ottawa-movers";
const routeUrl = `${siteOrigin}/${slug}/`;
const templatePath = join(root, "toronto-to-winnipeg-movers", "index.html");
const reverseRoutePath = join(root, "ottawa-to-victoria-movers", "index.html");
const victoriaHubPath = join(root, "victoria-long-distance-movers", "index.html");
const ottawaHubPath = join(root, "ottawa-long-distance-movers", "index.html");
const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");
const sitemapPath = join(root, "sitemap.xml");

const route = {
  from: "Victoria",
  fromProvince: "BC",
  to: "Ottawa",
  toProvince: "ON",
  distance: "~4,700+ km",
  transit: "10–22 days",
  prices: ["$3,000+", "$5,300+", "$7,000+", "$11,000+", "$16,000+"],
  metaDescription:
    "Victoria to Ottawa movers for long-distance relocations from Victoria, BC to Ottawa, ON. Compare ferry logistics, estimated costs, 10–22 day transit guidance, packing, storage, and written estimates from a direct moving company.",
};

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const routeName = `${route.from} to ${route.to}`;
const routeDash = `${route.from} → ${route.to}`;
const routeProvincePair = `${route.from}, ${route.fromProvince} to ${route.to}, ${route.toProvince}`;

const faqs = [
  [
    "How long does it take to move from Victoria to Ottawa?",
    "Typical transit is 10–22 days. The confirmed delivery spread depends on route scheduling, shipment size, ferry timing, seasonal conditions, access, and delivery availability.",
  ],
  [
    "How much does it cost to move from Victoria to Ottawa?",
    "Planning estimates range from $3,000+ for a studio or small shipment to $16,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, Vancouver Island access, ferry logistics, packing, storage, season, and confirmed services.",
  ],
  [
    "How does the BC Ferries crossing affect my move?",
    "The shipment must be coordinated around the Vancouver Island ferry crossing. Sailing availability, seasonal congestion, pickup timing, vehicle scheduling, and the delivery window can all affect the plan, so flexibility is helpful.",
  ],
  [
    "Do you also move from Ottawa to Victoria?",
    "Yes. Purely Canadian Movers also coordinates Ottawa to Victoria and Nanaimo moves through the established Great Canadian Van Lines agent network. See the Ottawa to Victoria route page for that direction.",
  ],
  [
    "Can I get a written estimate?",
    "Yes. A written estimate is prepared after reviewing your inventory, Victoria pickup address, Ottawa delivery address, access conditions, packing, storage, timing, and Declared Value Protection choices.",
  ],
  [
    "Do you offer packing services?",
    "Yes. Full or partial packing, fragile-item preparation, and unpacking can be included when the services are confirmed in your written estimate.",
  ],
  [
    "Can you provide storage?",
    "Yes. Short- or long-term storage can be coordinated when your Victoria pickup and Ottawa delivery dates do not align. Storage timing and access requirements are included in the estimate.",
  ],
  [
    "How is my shipment coordinated across Canada?",
    "Purely Canadian Movers coordinates the move from Victoria pickup through the ferry crossing, cross-country transit, and Ottawa delivery, with support through the Great Canadian Van Lines agent network and one accountable point of contact.",
  ],
  [
    "What makes Purely Canadian Movers different from a moving broker?",
    "Purely Canadian Movers is family-owned, BBB Accredited, and an authorized Great Canadian Van Lines agent. We provide written route planning and direct accountability rather than selling your move to an unknown broker or random subcontractor.",
  ],
  [
    "What Declared Value Protection is available for my shipment?",
    "Declared Value Protection options are explained before moving day. The selected protection details, including zero deductible where applicable, are confirmed in the moving documentation.",
  ],
];

function card([title, body]) {
  return `<article class="pcm-card"><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`;
}

function schema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${routeName} movers`,
        serviceType: "Long-distance moving",
        areaServed: [
          { "@type": "City", name: route.from },
          { "@type": "City", name: route.to },
        ],
        url: routeUrl,
        description: `${routeName} long-distance moving from Vancouver Island with ferry logistics, written estimates, packing, storage, Declared Value Protection options, a route distance of ${route.distance}, and typical transit of ${route.transit}.`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
    ],
  };
}

function replaceMeta(head, selector, value) {
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`, "i");
  if (!pattern.test(head)) throw new Error(`Missing metadata field: ${selector}`);
  return head.replace(pattern, (_match, prefix, suffix) => `${prefix}${esc(value)}${suffix}`);
}

function buildHead(template) {
  const bodyStart = template.indexOf("<body");
  if (bodyStart < 0) throw new Error("Standardized route template has no body");

  const title = "Victoria to Ottawa Movers | Long-Distance Moving";
  let head = template.slice(0, bodyStart)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]+">/i, `<link rel="canonical" href="${routeUrl}">`)
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");

  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'name="keywords"', `${routeName} movers, moving from Victoria to Ottawa, Victoria BC to Ottawa ON moving company, Victoria Ottawa moving cost, Victoria Ottawa moving quote`);
  head = replaceMeta(head, 'property="og:title"', title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', routeUrl);
  head = replaceMeta(head, 'name="twitter:title"', title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);

  const schemaScript = `<script type="application/ld+json" id="route-schema">${JSON.stringify(schema())}</script>`;
  return head.replace("</head>", `${schemaScript}\n</head>`);
}

function quotePanel() {
  return `<section class="pcm-top-estimate-wrap pcm-lead-boost" aria-label="Moving estimate">
  <div class="pcm-top-estimate">
    <div class="pcm-top-estimate__intro">
      <div class="pcm-kicker">FREE MOVING ESTIMATE</div>
      <h2>Get a Victoria to Ottawa quote.</h2>
      <p>Planning a long-distance move from Victoria, BC to Ottawa, ON? Purely Canadian Movers can help you compare realistic pricing, transit timing, ferry logistics, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p>
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
          <input name="from" value="Victoria, BC">
        </label>
        <label>Moving to
          <input name="to" value="Ottawa, ON">
        </label>
        <label>Home size
          <select name="homeSize">
            <option value="">Select size</option>
            <option>Studio</option>
            <option>1 Bedroom</option>
            <option>2 Bedrooms</option>
            <option>3 Bedrooms</option>
            <option>4+ Bedrooms</option>
          </select>
        </label>
        <label>Move date
          <input name="moveDate" type="date">
        </label>
      </div>
      <div class="pcm-buttons">
        <button class="pcm-button primary" type="submit">Get Written Estimate</button>
        <a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a>
      </div>
      <p class="pcm-form-note"><strong>No spam. No pressure. Just your moving estimate.</strong> Questions? Call Purely Canadian Movers: 1-877-485-6683</p>
      <div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, ferry logistics, services, and timing are reviewed before pricing is confirmed in writing.</span></div></div>
      <div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:6045227222">604-522-7222</a> · Direct mover since 1991</div>
    </form>
  </div>
</section>`;
}

function pricingSection() {
  const rows = [
    ["Studio / small shipment", route.prices[0], "Best for limited furniture or a partial shipment"],
    ["1-bedroom", route.prices[1], "Depends on inventory weight or volume, access, and packing"],
    ["2-bedroom", route.prices[2], "Common planning range for an apartment or condo move"],
    ["3-bedroom", route.prices[3], "Larger household shipment with more labour and space"],
    ["4+ bedroom", route.prices[4], "Final estimate depends on inventory, access, and services"],
  ].map(([size, price, note]) => `<tr><td class="pcm-home-size">${size}</td><td class="pcm-cost-value">${price}</td><td>${esc(note)}</td><td>${route.transit}</td></tr>`).join("");

  return `<section class="pcm-lead-boost pcm-route-cost" aria-label="Victoria to Ottawa moving cost estimates"><div class="pcm-route-cost__inner">
  <div class="pcm-route-cost__eyebrow">VICTORIA TO OTTAWA MOVING COST</div>
  <h2>How much does it cost to move from Victoria to Ottawa?</h2>
  <p>A Victoria to Ottawa move typically ranges from about <strong>$3,000+</strong> for a small shipment to <strong>$16,000+</strong> for a larger home. Many 1–2 bedroom moves are estimated around <strong>$5,300–$7,000+</strong>, depending on shipment weight or volume, access, packing, storage, ferry logistics, season, and requested services.</p>
  <div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="pcm-route-cost__note">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible. Then: Prices are planning estimates in CAD, not guaranteed long-distance quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, ferry logistics, packing needs, storage timing, protection choices, and service dates.</p>
  <div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full cost guide</a><a href="/victoria-long-distance-movers/">Victoria long-distance movers</a><a href="/long-distance-movers-ottawa/">Ottawa long-distance movers</a><a href="/ottawa-to-victoria-movers/">Ottawa to Victoria movers</a><a href="/contact/">Get a written estimate</a></div>
  </div></section>`;
}

function ottawaVictoriaPricingSection() {
  const rows = [
    ["Studio / small shipment", "$3,000+", "Best for limited furniture or a partial shipment"],
    ["1-bedroom", "$5,300+", "Depends on inventory weight or volume, access, and packing"],
    ["2-bedroom", "$7,000+", "Common planning range for an apartment or condo move"],
    ["3-bedroom", "$11,000+", "Larger household shipment with more labour and space"],
    ["4+ bedroom", "$16,000+", "Final estimate depends on inventory, access, and services"],
  ].map(([size, price, note]) => `<tr><td>${size}</td><td>${price}</td><td>${esc(note)}</td><td>10–22 days</td></tr>`).join("");

  return `<section class="pcm-lead-boost pcm-route-cost" data-pcm-route="ottawa-to-victoria" aria-label="Ottawa to Victoria moving cost estimates"><div class="pcm-route-cost__inner">
  <div class="pcm-route-cost__eyebrow">OTTAWA TO VICTORIA MOVING COST</div>
  <h2>How much does it cost to move from Ottawa to Victoria?</h2>
  <p>An Ottawa to Victoria move typically ranges from about <strong>$3,000+</strong> for a small shipment to <strong>$16,000+</strong> for a larger home. Many 1–2 bedroom moves are estimated around <strong>$5,300–$7,000+</strong>, depending on shipment weight or volume, access, packing, storage, ferry logistics, season, and requested services.</p>
  <div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="pcm-route-cost__note">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible. Then: Prices are planning estimates in CAD, not guaranteed long-distance quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, ferry logistics, packing needs, storage timing, protection choices, and service dates.</p>
  <div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full cost guide</a><a href="/long-distance-movers-ottawa/">Ottawa long-distance movers</a><a href="/victoria-long-distance-movers/">Victoria long-distance movers</a><a href="/contact/">Get a written estimate</a></div>
  </div></section>`;
}

function routeBody() {
  const unique = [
    ["Vancouver Island pickup and ferry planning", "Your Victoria pickup must be coordinated with the BC Ferries crossing. Sailing availability, seasonal congestion, vehicle scheduling, and the time needed to reach the terminal are part of the route plan."],
    ["Victoria condo and loading access", "Tell us about elevator reservations, loading-bay windows, street access, stairs, long carries, parking limits, and strata rules before the pickup date is confirmed."],
    ["Prepare before the shipment leaves the Island", "Keep identification, medication, chargers, valuables, and first-week essentials with you. Label cartons and separate anything you will need before the shipment reaches Ottawa."],
    ["Ottawa destination access", "Ottawa condos, apartments, and houses may require elevator bookings, loading permits, move-in windows, winter entry planning, or a smaller vehicle for restricted access."],
    ["Weather changes across Canada", "A coastal BC pickup can be followed by Prairie conditions and an Ottawa winter delivery. Protect floors and entryways, and keep weather-sensitive essentials accessible."],
    ["Nanaimo service area", "Nanaimo is an additional Vancouver Island service area. This page’s primary route, H1, quote defaults, metadata, and pricing are Victoria to Ottawa."],
  ];
  const tips = [
    ["Build ferry flexibility into the schedule", "Avoid planning the Victoria pickup around one narrow sailing. We review terminal timing, seasonal congestion, and the delivery window together."],
    ["Confirm building and curb rules", "Reserve the Victoria elevator and loading area, then send Ottawa building rules, parking details, stairs, long carries, and move-in hours before delivery."],
    ["Keep an Island departure kit", "Travel with documents, medication, valuables, electronics, chargers, seasonal clothing, and the essentials you need before your shipment arrives."],
    ["Plan for Ottawa winter access", "For a cold-weather delivery, arrange clear paths, protect floors, and keep boots, warm clothing, and weather-sensitive items out of the shipment."],
    ["Review Ontario updates after arrival", "After establishing Ontario residence, check current provincial requirements for driver licensing, vehicle registration, health coverage, address changes, utilities, and schools."],
    ["Measure the Ottawa destination", "Check doorways, stairwells, elevators, loading bays, and room dimensions for large furniture or specialty items before delivery is scheduled."],
  ];
  const process = [
    ["1. Free estimate", "Share your Victoria inventory, Ottawa addresses, access conditions, ferry considerations, services, and preferred moving date."],
    ["2. Plan pickup", "Confirm packing, elevator, parking, loading, stairs, long carries, and the Vancouver Island schedule before pickup."],
    ["3. Ferry and cross-country transit", "Your shipment is coordinated across the Island crossing and Canada-wide route through the established Great Canadian Van Lines agent network."],
    ["4. Ottawa delivery", "The crew delivers and places items in the rooms you identify, subject to building access, weather, and the confirmed delivery window."],
  ];

  return `<main class="pcm-static-main">
  <div class="pcm-static-band pcm-static-band--hero"><section class="pcm-hero pcm-static-hero"><div><div class="pcm-kicker">${routeDash} movers</div><h1>Victoria to Ottawa Movers</h1><p>Planning a long-distance move from Victoria, BC to Ottawa, ON? Purely Canadian Movers helps you plan a ~4,700+ km relocation with ferry coordination, realistic pricing, 10–22 days of transit guidance, packing, storage, Declared Value Protection options, and written estimate details.</p><p>Family-owned since 1991 and an authorized Great Canadian Van Lines agent. Your Victoria pickup, BC Ferries crossing, cross-country transit, and Ottawa delivery are coordinated through an established Canadian network with one accountable point of contact.</p><div class="pcm-pills"><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">No broker handoff</span><span class="pcm-pill">Written estimates</span></div><div class="pcm-hero-actions"><a class="pcm-button primary" href="/contact/">Get Written Estimate</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></div>
  <section class="pcm-section"><h2>Moving from Victoria to Ottawa</h2><p>Leaving Vancouver Island for Ottawa is a major interprovincial relocation. The move covers approximately ${route.distance.replace("~", "")} and includes a BC Ferries crossing, so pickup timing, terminal scheduling, shipment size, access, and delivery availability should be reviewed together.</p><p>Purely Canadian Movers coordinates Victoria-origin moves with support through the Great Canadian Van Lines agent network. We help you compare realistic costs, transit timing, packing, storage, ferry logistics, Declared Value Protection options, and written estimate details before moving day.</p><p>Nanaimo can also be discussed as an additional Vancouver Island pickup area, but this dedicated page is focused on the ${routeName} route.</p></section>
  <section class="pcm-section pcm-route-glance-section"><h2>${routeDash} Route at a Glance</h2><div class="pcm-route-glance"><div class="pcm-glance-item"><span class="pcm-glance-label">Distance</span><strong class="pcm-glance-value">${route.distance}</strong><span class="pcm-glance-support">Victoria, BC to Ottawa, ON</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Est. Transit Time</span><strong class="pcm-glance-value">${route.transit}</strong><span class="pcm-glance-support">Depending on shipment size and scheduling</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Typical Cost Range</span><strong class="pcm-glance-value">$3,000–$16,000+</strong><span class="pcm-glance-support">Studio to 4+ bedroom home</span></div></div></section>
  ${pricingSection()}
  <section class="pcm-section"><h2>What makes a Victoria to Ottawa move different?</h2><div class="pcm-grid">${unique.map(card).join("")}</div></section>
  <section class="pcm-section"><h2>Tips for moving from Victoria to Ottawa</h2><div class="pcm-grid">${tips.map(card).join("")}</div></section>
  <section class="pcm-section"><h2>Why choose Purely Canadian Movers?</h2><ul class="pcm-checklist"><li>Family-owned since 1991 with long-distance moving experience</li><li>Authorized Great Canadian Van Lines agent with established Canadian network support</li><li>No broker handoff to unknown movers or random subcontractors</li><li>Written estimates that review route, inventory, access, ferry timing, packing, storage, and delivery</li><li>Declared Value Protection choices explained before moving day, with zero deductible where applicable</li><li>Full or partial packing and short- or long-term storage options available</li></ul><div class="pcm-warning"><strong>Be cautious with unusually low cross-country quotes.</strong> Confirm fuel, ferry logistics, access, packing, storage, protection choices, and other included services in writing before signing.</div></section>
  <section class="pcm-section"><h2>How your Victoria → Ottawa move works</h2><div class="pcm-steps">${process.map(card).join("")}</div></section>
  <section class="pcm-section"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${faqs.map(card).join("")}</div></section>
  <section class="pcm-section"><h2>Related destinations and resources</h2><div class="pcm-links"><a href="/victoria-long-distance-movers/">Victoria Long-Distance Movers</a><a href="/long-distance-movers-ottawa/">Ottawa Long-Distance Movers</a><a href="/ottawa-to-victoria-movers/">Ottawa to Victoria Movers</a><a href="/long-distance/">Long-Distance Moving</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/packing/">Packing Services</a><a href="/storage/">Storage Options</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a Written Estimate</a></div></section>
  <section class="pcm-section pcm-closing-cta pcm-static-closing-cta"><h2>Ready to Move from Victoria to Ottawa?</h2><p>Request a free, no-obligation written estimate for your Vancouver Island to Ontario move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-local-line">Or call our local line: <a href="tel:16045227222">604-522-7222</a></p></section>
</main>`;
}

function extract(template, pattern, label) {
  const match = template.match(pattern);
  if (!match) throw new Error(`Standardized route template has no ${label}`);
  return match[0];
}

function page(template) {
  const header = extract(template, /<header class="pcm-site-header">[\s\S]*?<\/header>/i, "site header");
  const footer = extract(template, /<footer class="pcm-footer">[\s\S]*?<\/footer>/i, "site footer");
  return `<!DOCTYPE html>
<html lang="en">
${buildHead(template)}
<body class="pcm-static-route-ready">
  <div id="root" class="pcm-static-route pcm-static-route-ready">
    ${quotePanel()}
    ${header}
    <div class="pcm-static-page">
      ${routeBody()}
    </div>
    ${footer}
  </div>
  <script defer src="/assets/conversion-boost.js"></script>
  <script defer src="/assets/static-nav.js"></script>
</body>
</html>`;
}

function ensureQuality(html) {
  const checks = [
    [/<title>Victoria to Ottawa Movers \| Long-Distance Moving<\/title>/, "unique title"],
    [new RegExp(`<meta name="description" content="${route.metaDescription.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}">`), "unique description"],
    [html.includes(`rel="canonical" href="${routeUrl}"`), "self-referencing canonical"],
    [html.includes("<h1>Victoria to Ottawa Movers</h1>"), "route H1"],
    [(html.match(/<h1\b/gi) || []).length === 1, "exactly one H1"],
    [(html.match(/<div class="pcm-top-estimate">/g) || []).length === 1, "exactly one quote panel"],
    [(html.match(/<section[^>]+class="[^"]*pcm-route-cost[^"]*"/gi) || []).length === 1, "exactly one pricing section"],
    [(html.match(/<table\b/gi) || []).length === 1, "exactly one pricing table"],
    [html.includes("FAQPage"), "FAQ schema"],
    [html.includes('name="from" value="Victoria, BC"'), "Victoria quote default"],
    [html.includes('name="to" value="Ottawa, ON"'), "Ottawa quote default"],
    ...[route.distance, route.transit, ...route.prices, "$3,000–$16,000+"].map((value) => [html.includes(value), value]),
  ];
  for (const [passed, label] of checks) if (!passed) throw new Error(`Generated route failed ${label}`);
  if (/Moving Cost Breakdown|fully insured|basic valuation coverage|full-value protection|\binsurance\b/i.test(html)) {
    throw new Error("Generated route contains legacy protection or pricing wording");
  }
  if (/Page Not Found|>\s*404\s*</i.test(html)) throw new Error("Generated route contains visible 404 content");
}

function appendOnce(html, marker, addition, label) {
  if (html.includes(addition)) return html;
  const index = html.indexOf(marker);
  if (index < 0) throw new Error(`Cannot find ${label} marker`);
  return html.slice(0, index) + addition + html.slice(index);
}

async function updateReverseRouteLink() {
  let html = await readFile(reverseRoutePath, "utf8");
  const modernPattern = /<section[^>]+data-pcm-route="ottawa-to-victoria"[\s\S]*?<\/section>/i;
  if (modernPattern.test(html)) {
    html = html.replace(modernPattern, ottawaVictoriaPricingSection());
  } else {
    const legacyPattern = /<h2[^>]*>Ottawa to Victoria\/Nanaimo Moving Cost Breakdown<\/h2>[\s\S]*?(?=<h2[^>]*>Moving Tips for Your Vancouver Island Arrival<\/h2>)/i;
    if (!legacyPattern.test(html)) throw new Error("Ottawa to Victoria legacy pricing block not found");
    html = html.replace(legacyPattern, `${ottawaVictoriaPricingSection()}\n`);
  }
  html = html
    .replace(/Professional, fully insured long-distance moves to Vancouver Island\./gi, "Professional long-distance moves to Vancouver Island with Declared Value Protection options.")
    .replace(/Professional, fully insured long-distance moving from Ottawa to Vancouver Island/gi, "Professional long-distance moving from Ottawa to Vancouver Island with Declared Value Protection options")
    .replace(/same professional, fully insured service/gi, "the same professional service with Declared Value Protection options")
    .replace(/basic valuation coverage/gi, "standard carrier liability")
    .replace(/full-value protection options/gi, "Declared Value Protection options")
    .replace(/full-value protection/gi, "Declared Value Protection")
    .replace(/private health insurance/gi, "private health coverage");
  const addition = '<p class="pcm-reverse-route-link"><a href="/victoria-to-ottawa-movers/">Moving from Victoria to Ottawa?</a> See the dedicated Victoria to Ottawa route page for current pricing, ferry planning, and estimate details.</p>';
  const relatedHeading = ">Related Destinations</h2>";
  const relatedIndex = html.indexOf(relatedHeading);
  if (relatedIndex < 0) throw new Error("Ottawa to Victoria related-destinations section not found");
  const sectionEnd = html.indexOf("</section>", relatedIndex);
  if (sectionEnd < 0) throw new Error("Ottawa to Victoria related-destinations section end not found");
  if (!html.includes("/victoria-to-ottawa-movers/")) html = html.slice(0, sectionEnd) + addition + html.slice(sectionEnd);
  const hydratedAddition = '<p class="pcm-reverse-route-link-after-hydration"><a href="/victoria-to-ottawa-movers/">Moving from Victoria to Ottawa?</a> See the dedicated Victoria to Ottawa route page for current pricing, ferry planning, and estimate details.</p>';
  if (!html.includes("pcm-reverse-route-link-after-hydration")) {
    const scriptsMarker = '    <script defer="" src="https://manus-analytics.com/umami"';
    const scriptsIndex = html.lastIndexOf(scriptsMarker);
    if (scriptsIndex < 0) throw new Error("Ottawa to Victoria analytics script marker not found");
    html = html.slice(0, scriptsIndex) + `</div>\n    ${hydratedAddition}\n\n` + html.slice(scriptsIndex);
  }
  html = html.replace(/\s*<script defer src="\/assets\/victoria-ottawa-reverse-link\.js"><\/script>/g, "");
  await writeFile(reverseRoutePath, html, "utf8");
}

async function updateVictoriaHub() {
  let html = await readFile(victoriaHubPath, "utf8");
  if (!html.includes("/victoria-to-ottawa-movers/")) {
    const marker = "Moving From Other Canadian Cities?";
    const markerIndex = html.indexOf(marker);
    if (markerIndex < 0) throw new Error("Victoria hub route-links section not found");
    const close = html.lastIndexOf("</div></div>", markerIndex);
    if (close < 0) throw new Error("Victoria hub route-links container not found");
    const link = '<a href="/victoria-to-ottawa-movers/" class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200 hover:border-[#CC1A1A] hover:bg-red-50 transition-colors group"><span class="font-body text-gray-700 group-hover:text-gray-900 font-semibold">Victoria → Ottawa</span></a>';
    html = html.slice(0, close) + link + html.slice(close);
  }
  await writeFile(victoriaHubPath, html, "utf8");
}

async function updateOttawaHub() {
  let html = await readFile(ottawaHubPath, "utf8");
  const addition = '<a href="/victoria-to-ottawa-movers/" class="text-[#CC1A1A] hover:underline font-semibold">Victoria to Ottawa Movers</a>';
  html = appendOnce(html, "Ottawa → Victoria / Nanaimo", ` · ${addition}`, "Ottawa hub route list");
  await writeFile(ottawaHubPath, html, "utf8");
}

async function updateCostGuide() {
  let html = await readFile(costGuidePath, "utf8");
  if (!html.includes('data-route="victoria-to-ottawa-movers"') && !html.includes(">Victoria → Ottawa</td>")) {
    const headingIndex = html.indexOf(">Popular Moving Routes in Canada</h2>");
    if (headingIndex < 0) throw new Error("Cost guide popular-routes heading not found");
    const tableStart = html.indexOf("<table", headingIndex);
    const bodyEnd = html.indexOf("</tbody>", tableStart);
    if (tableStart < 0 || bodyEnd < 0) throw new Error("Cost guide popular-routes table not found");
    const row = '<tr data-route="victoria-to-ottawa-movers" class="border-b border-gray-200 bg-white hover:bg-red-50"><td class="py-3 px-4 font-body text-gray-900 font-semibold">Victoria → Ottawa</td><td class="py-3 px-4 font-body text-gray-700">~4,700+ km</td><td class="py-3 px-4 font-body text-gray-700">10–22 days</td><td class="py-3 px-4 text-right"><a href="/victoria-to-ottawa-movers/" class="inline-flex items-center justify-center whitespace-nowrap text-sm h-8 rounded-md gap-1.5 px-3 bg-[#CC1A1A] text-white font-body font-semibold">Get a Quote</a></td></tr>';
    html = html.slice(0, bodyEnd) + row + html.slice(bodyEnd);
  }
  await writeFile(costGuidePath, html, "utf8");
}

async function updateSitemap() {
  let sitemap = await readFile(sitemapPath, "utf8");
  if (!sitemap.includes(`<loc>${routeUrl}</loc>`)) {
    sitemap = sitemap.replace("</urlset>", `  <url><loc>${routeUrl}</loc></url>\n</urlset>`);
    await writeFile(sitemapPath, sitemap, "utf8");
  }
}

const template = await readFile(templatePath, "utf8");
const output = page(template);
ensureQuality(output);
await mkdir(join(root, slug), { recursive: true });
await writeFile(join(root, slug, "index.html"), output, "utf8");
await updateReverseRouteLink();
await updateVictoriaHub();
await updateOttawaHub();
await updateCostGuide();
await updateSitemap();
console.log(`Rebuilt /${slug}/ from the current standardized route template`);
console.log("Updated reverse-route, Victoria, Ottawa, cost-guide, and sitemap links");
