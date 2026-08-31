import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const referencePath = join(root, "toronto-to-winnipeg-movers", "index.html");

const pricing = [
  ["Studio or small shipment", "$2,500+", "Best for limited furniture or a partial shipment"],
  ["1-bedroom", "$4,700+", "Depends on inventory weight or volume, access, and packing"],
  ["2-bedroom", "$6,300+", "Common planning range for an apartment or condo move"],
  ["3-bedroom", "$10,000+", "Larger household shipment with more labour and space"],
  ["4+ bedroom", "$15,000+", "Final estimate depends on inventory, access, and services"],
];

const routes = [
  {
    slug: "calgary-to-ottawa-movers",
    from: "Calgary",
    fromProvince: "AB",
    to: "Ottawa",
    toProvince: "ON",
    metaDescription:
      "Plan a Calgary to Ottawa long-distance move with route-specific pricing from $2,500+, approximately 3,500 km, 7–19 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "A Calgary-to-Ottawa move is a major interprovincial relocation. A written estimate helps set clear expectations for your inventory, pickup and delivery access, packing needs, timing, and any storage required between homes.",
      "Purely Canadian Movers is an agent and partner of Great Canadian Van Lines. Your move is coordinated by Purely Canadian Movers and supported through the Great Canadian Van Lines agent network. Agents are part of the van line network, not broker-style unknown movers.",
      "Ottawa arrivals can involve condo elevator reservations, loading windows, parking or curb restrictions, winter access, and Ontario vehicle or driver-licence updates.",
    ],
    unique: [
      ["Cross-country logistics", "At approximately 3,500 km, this route requires planning for shipment size, access, route scheduling, seasonal conditions, and the delivery window available at your Ottawa home."],
      ["Calgary pickup access", "Share parking, elevator, loading-bay, stair, and long-carry details early, especially for Calgary condos and high-rise buildings."],
      ["Ottawa destination access", "Ottawa condos, apartments, and downtown homes may have move-in hours, loading-zone rules, elevator reservations, and winter entry conditions to confirm before delivery."],
      ["Ontario arrival tasks", "Keep identity documents and essentials with you, then plan Ontario driver-licence, vehicle-registration, health-coverage, utility, and address updates after arrival."],
    ],
    tips: [
      ["Reserve Ottawa elevator time", "Ask the building manager about elevator reservations, loading-dock windows, move-in hours, parking rules, and any building-document requirements."],
      ["Confirm Ottawa loading access", "Review curb space, parking permits, street width, stairs, long carries, and whether a smaller vehicle or shuttle is needed for the destination."],
      ["Prepare for seasonal conditions", "Calgary and Ottawa can have very different weather on moving day. Protect floors and entryways, and keep weather-sensitive essentials accessible."],
      ["Plan Ontario updates", "After establishing residence, review Ontario driver-licence and vehicle-registration requirements along with health coverage, utilities, and address changes."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Ottawa address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Calgary to Ottawa?", "Planning estimates range from $2,500+ for a studio or small shipment to $15,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, services, season, and confirmed move details."],
      ["How long does a Calgary to Ottawa move take?", "Typical transit is 7–19 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is a Calgary to Ottawa move coordinated?", "Purely Canadian Movers coordinates the move and provides one accountable point of contact, with support through the Great Canadian Van Lines agent network for cross-country routing and delivery planning."],
      ["Can you move Calgary condos and Ottawa apartments?", "Yes. Provide elevator reservations, loading-dock rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["What should I plan after arriving in Ottawa?", "Plan your Ontario address, driver-licence, vehicle-registration, health-coverage, utility, and building-access updates. Keep documents, medication, chargers, and other first-week essentials with you."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
    ],
  },
  {
    slug: "ottawa-to-calgary-movers",
    from: "Ottawa",
    fromProvince: "ON",
    to: "Calgary",
    toProvince: "AB",
    metaDescription:
      "Plan an Ottawa to Calgary long-distance move with route-specific pricing from $2,500+, approximately 3,500 km, 7–19 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "An Ottawa-to-Calgary move is a major interprovincial relocation. A written estimate helps set clear expectations for your inventory, pickup and delivery access, packing needs, timing, and any storage required between homes.",
      "Purely Canadian Movers is an agent and partner of Great Canadian Van Lines. Your move is coordinated by Purely Canadian Movers and supported through the Great Canadian Van Lines agent network. Agents are part of the van line network, not broker-style unknown movers.",
      "Calgary arrivals can involve condo elevator reservations, loading windows, parking limits, Chinook temperature swings, and Alberta vehicle-registration or driver-licence updates.",
    ],
    unique: [
      ["Cross-country logistics", "At approximately 3,500 km, this route requires planning for shipment size, access, route scheduling, seasonal conditions, and the delivery window available at your Calgary home."],
      ["Ottawa pickup access", "Share parking, elevator, loading-zone, stair, and long-carry details early, especially for Ottawa condos, apartments, and downtown buildings."],
      ["Calgary destination access", "Calgary condos and high-rises may have move-in hours, loading-bay rules, elevator reservations, and parking restrictions to confirm before delivery."],
      ["Alberta arrival tasks", "Keep identity documents and essentials with you, then plan Alberta driver-licence, vehicle-registration, health-coverage, utility, and address updates after arrival."],
    ],
    tips: [
      ["Reserve Calgary elevator time", "Ask the building manager about elevator reservations, loading-dock windows, move-in hours, parking rules, and any building-document requirements."],
      ["Confirm Calgary loading access", "Review curb space, parking limits, street access, stairs, long carries, and whether a smaller vehicle or shuttle is needed for the destination."],
      ["Prepare for Chinook weather swings", "Calgary temperatures can change quickly during Chinook conditions. Protect temperature-sensitive items and keep suitable essentials accessible during delivery."],
      ["Plan Alberta updates", "After establishing residence, review Alberta driver-licence and vehicle-registration requirements along with health coverage, utilities, and address changes."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Calgary address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Ottawa to Calgary?", "Planning estimates range from $2,500+ for a studio or small shipment to $15,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, services, season, and confirmed move details."],
      ["How long does an Ottawa to Calgary move take?", "Typical transit is 7–19 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is an Ottawa to Calgary move coordinated?", "Purely Canadian Movers coordinates the move and provides one accountable point of contact, with support through the Great Canadian Van Lines agent network for cross-country routing and delivery planning."],
      ["Can you move Ottawa condos and Calgary apartments?", "Yes. Provide elevator reservations, loading-dock rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["What should I plan after arriving in Calgary?", "Plan your Alberta address, driver-licence, vehicle-registration, health-coverage, utility, and building-access updates. Keep documents, medication, chargers, and other first-week essentials with you."],
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
        description: `${name} long-distance moving with written estimates, route planning, packing, storage, Declared Value Protection options, approximately 3,500 km of travel, and typical transit of 7–19 days.`,
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
  head = head.replace("</head>", `    <script type="application/ld+json" id="route-schema">${JSON.stringify(schema(route))}</script>\n</head>`);
  return head;
}

function extract(template, pattern, label) {
  const match = template.match(pattern);
  if (!match) throw new Error(`Reference route template has no ${label}`);
  return match[0];
}

function quotePanel(route) {
  const name = routeName(route);
  const article = route.from === "Ottawa" ? "an" : "a";
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate">
      <div class="pcm-top-estimate">
        <div class="pcm-top-estimate__intro">
          <div class="pcm-kicker">FREE MOVING ESTIMATE</div>
          <h2>Get ${article} ${escapeHtml(name)} quote.</h2>
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
          <div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed in writing.</span></div></div>
          <div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:6045222722">604-522-7222</a> · Direct mover since 1991</div>
        </form>
      </div>
    </section>`;
}

function pricingSection(route) {
  const name = routeName(route);
  const upper = name.toUpperCase();
  const rows = pricing.map(([size, price, note]) => `<tr><td>${escapeHtml(size)}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>7–19 days</td></tr>`).join("");
  return `<section class="pcm-lead-boost pcm-route-cost" aria-label="${escapeHtml(upper)} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(upper)} MOVING COST</div><h2>How much does it cost to move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>A ${escapeHtml(name)} move typically ranges from about <strong>$2,500+</strong> for a small shipment to <strong>$15,000+</strong> for a larger home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed services.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__inclusion">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible where applicable.</p><p class="pcm-route-cost__note">Prices are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, protection choices, and service dates.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full moving cost guide</a><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} long-distance movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} long-distance movers</a><a href="/${route.slug === "calgary-to-ottawa-movers" ? "ottawa-to-calgary-movers" : "calgary-to-ottawa-movers"}/">${escapeHtml(route.slug === "calgary-to-ottawa-movers" ? "Ottawa to Calgary" : "Calgary to Ottawa")} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  const name = routeName(route);
  return `<div class="pcm-static-band pcm-static-band--hero"><section class="pcm-hero pcm-static-hero"><div><div class="pcm-kicker">${escapeHtml(name)} movers</div><h1>${escapeHtml(name)} Movers</h1><p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p><p>Purely Canadian Movers coordinates your move with support through the Great Canadian Van Lines agent network, giving you one accountable point of contact for route planning and delivery coordination.</p><div class="pcm-pills" aria-label="Trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Packing and storage available</span></div><div class="pcm-hero-actions"><a class="pcm-button primary" href="/contact/">Get Written Estimate</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></div>`;
}

function routeGlance(route) {
  const name = routeName(route);
  return `<section class="pcm-section pcm-route-glance-section pcm-static-route-glance"><h2>${escapeHtml(routeDash(route))} Route at a Glance</h2><div class="pcm-route-glance"><div class="pcm-glance-item"><span class="pcm-glance-label">Distance</span><strong class="pcm-glance-value">Approximately 3,500 km</strong><span class="pcm-glance-support">${escapeHtml(name)}</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Est. transit time</span><strong class="pcm-glance-value">7–19 days</strong><span class="pcm-glance-support">Depending on shipment size and scheduling</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Typical cost range</span><strong class="pcm-glance-value">$2,500–$15,000+</strong><span class="pcm-glance-support">Studio to 4+ bedroom home</span></div></div></section>`;
}

function routeBody(route) {
  const name = routeName(route);
  const opposite = route.slug === "calgary-to-ottawa-movers" ? "Ottawa to Calgary" : "Calgary to Ottawa";
  const oppositeSlug = route.slug === "calgary-to-ottawa-movers" ? "ottawa-to-calgary-movers" : "calgary-to-ottawa-movers";
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
      <section class="pcm-section pcm-closing-cta pcm-static-closing-cta"><h2>Ready to Move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>Request a free, no-obligation written estimate for your cross-country move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-local-line">Or call our local line: <a href="tel:16045227222">604-522-7222</a></p></section>
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
    <div class="pcm-static-page">
      ${routeBody(route)}
    </div>
    ${footer}
  </div>
  <script defer src="/assets/conversion-boost.js"></script>
  <script defer src="/assets/static-nav.js"></script>
  <div class="pcm-lead-boost pcm-sticky-cta"><a class="pcm-primary-button" href="/contact/">Get Estimate</a><a class="pcm-secondary-button" href="tel:18774856683">Call</a></div>
  <button type="button" class="pcm-chat-nudge is-visible" aria-label="Ask a moving question or get a quick price quote"><strong>Not ready for an estimate?</strong><span>Ask us a moving question or get a quick price quote</span></button>
</body></html>`;
}

function ensureOnce(html, needle, label) {
  const count = html.split(needle).length - 1;
  if (count !== 1) throw new Error(`${label} expected once, found ${count}`);
}

function ensureRoutePage(html, route) {
  ensureOnce(html, `<h1>${routeName(route)} Movers</h1>`, `${route.slug} H1`);
  ensureOnce(html, "class=\"pcm-top-estimate\"", `${route.slug} quote panel`);
  ensureOnce(html, /class=\"[^\"]*\bpcm-route-cost\b[^\"]*\"/, `${route.slug} pricing section`);
  ensureOnce(html, "Route at a Glance", `${route.slug} route glance`);
  ensureOnce(html, "Frequently Asked Questions", `${route.slug} FAQ`);
  if (html.includes("Moving Cost Breakdown")) throw new Error(`${route.slug}: legacy Moving Cost Breakdown remains`);
  const legacyProtectionMatches = html.match(/fully insured|\binsurance\b|basic valuation coverage|full-value protection/gi);
  if (legacyProtectionMatches) {
    throw new Error(`${route.slug}: legacy protection wording remains (${legacyProtectionMatches.join(", ")})`);
  }
  if (/save at least \$100|Book before August 31/i.test(html)) throw new Error(`${route.slug}: stale dated promotion remains`);
  for (const value of ["3,500 km", "7–19 days", "$2,500+", "$4,700+", "$6,300+", "$10,000+", "$15,000+"]) {
    if (!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  }
  return html;
}

function appendHubRoute(html) {
  const pattern = /(<h3[^>]*>Routes From Calgary<\/h3><div[^>]*>)([\s\S]*?)(<\/div><\/div>)/i;
  const match = html.match(pattern);
  if (!match) throw new Error("Calgary hub Routes From Calgary block not found");
  if (match[2].includes('href="/calgary-to-ottawa-movers/"')) return html;
  const link = '<a href="/calgary-to-ottawa-movers/" class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200 hover:border-[#CC1A1A] hover:bg-red-50 transition-colors group"><span class="font-body text-gray-700 group-hover:text-gray-900 font-semibold">Calgary → Ottawa</span></a>';
  return html.replace(pattern, `$1${match[2]}${link}$3`);
}

function popularRouteRow(route, alternate) {
  const classes = alternate ? "border-b border-gray-200 bg-gray-50 hover:bg-red-50" : "border-b border-gray-200 bg-white hover:bg-red-50";
  return `<tr class="${classes}"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${route.from} → ${route.to}</td><td class="py-3 px-4 font-body text-gray-700">3,500 km</td><td class="py-3 px-4 font-body text-gray-700">7–19 days</td><td class="py-3 px-4 text-right"><a href="/${route.slug}/" class="inline-flex items-center justify-center whitespace-nowrap text-sm h-8 rounded-md gap-1.5 px-3 bg-[#CC1A1A] text-white font-body font-semibold">Get a Quote</a></td></tr>`;
}

function ensureCostGuideRoutes(html) {
  const pricingHeading = html.indexOf(">Long-Distance Moving Costs by Route</h2>");
  const popularHeading = html.indexOf(">Popular Moving Routes in Canada</h2>");
  if (pricingHeading < 0 || popularHeading < 0) throw new Error("Cost guide route headings not found");
  const pricingTableStart = html.indexOf("<table", pricingHeading);
  const popularTableStart = html.indexOf("<table", popularHeading);
  if (pricingTableStart < 0 || popularTableStart < 0) throw new Error("Cost guide route tables not found");

  const priceRows = routes.map((route, index) => `<tr data-route="${route.slug}" class="border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-red-50"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${route.from} → ${route.to}</td><td class="py-3 px-4 font-body text-gray-700">$2,500</td><td class="py-3 px-4 font-body text-gray-700">$4,700</td><td class="py-3 px-4 font-body text-gray-700">$6,300</td><td class="py-3 px-4 font-body text-gray-700">$10,000</td><td class="py-3 px-4 font-body text-[#CC1A1A] font-semibold">$15,000</td></tr>`);
  for (const [index, route] of routes.entries()) {
    const pricingTableEnd = html.indexOf("</tbody>", pricingTableStart);
    if (pricingTableEnd < 0) throw new Error("Cost guide pricing table body not found");
    const table = html.slice(pricingTableStart, pricingTableEnd);
    if (!table.includes(`>${route.from} → ${route.to}</td>`)) {
      html = html.slice(0, pricingTableEnd) + priceRows[index] + html.slice(pricingTableEnd);
    }
  }

  const popularTableEnd = html.indexOf("</tbody>", popularTableStart);
  if (popularTableEnd < 0) throw new Error("Cost guide popular route table body not found");

  for (const [index, route] of routes.entries()) {
    const start = html.indexOf("<table", popularHeading);
    const end = html.indexOf("</tbody>", start);
    const table = html.slice(start, end);
    if (!table.includes(`>${route.from} → ${route.to}</td>`)) {
      html = html.slice(0, end) + popularRouteRow(route, index % 2 === 0) + html.slice(end);
    }
  }
  return html;
}

async function ensureSitemapRoutes() {
  const sitemapPath = join(root, "sitemap.xml");
  let sitemap = await readFile(sitemapPath, "utf8");
  const missing = routes
    .map((route) => `${siteOrigin}/${route.slug}/`)
    .filter((url) => !sitemap.includes(`<loc>${url}</loc>`));
  if (!missing.length) return;
  const entries = missing.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
  sitemap = sitemap.replace(/<\/urlset>/i, `${entries}\n</urlset>`);
  await writeFile(sitemapPath, sitemap, "utf8");
  console.log(`Updated ${sitemapPath}`);
}

const template = await readFile(referencePath, "utf8");
for (const route of routes) {
  const output = ensureRoutePage(page(template, route), route);
  const outputPath = join(root, route.slug, "index.html");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(outputPath, output, "utf8");
  console.log(`Wrote ${outputPath}`);
}

const hubPath = join(root, "calgary-long-distance-movers", "index.html");
await writeFile(hubPath, appendHubRoute(await readFile(hubPath, "utf8")), "utf8");
console.log(`Updated ${hubPath}`);

const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");
await writeFile(costGuidePath, ensureCostGuideRoutes(await readFile(costGuidePath, "utf8")), "utf8");
console.log(`Updated ${costGuidePath}`);

await ensureSitemapRoutes();
