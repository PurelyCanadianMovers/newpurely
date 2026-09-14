import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const referencePath = resolve("tools/templates/hydration-static-routes/vancouver-to-halifax-movers.html");
const routeFacts = Object.freeze({ distance: "Over 3,700 km", transit: "10–27 days", range: "$2,700+–$18,000+" });

const pricing = [
  ["Studio or small shipment", "$2,700+", "Best for limited furniture or a partial shipment"],
  ["1-bedroom", "$4,400+", "Depends on inventory weight or volume, access, and packing"],
  ["2-bedroom", "$7,300+", "Common planning range for an apartment or condo move"],
  ["3-bedroom", "$12,000+", "Larger household shipment with more labour and space"],
  ["4+ bedroom", "$18,000+", "Final estimate depends on inventory, access, and services"],
];

const routes = [
  {
    slug: "halifax-to-vancouver-movers",
    from: "Halifax",
    fromProvince: "NS",
    to: "Vancouver",
    toProvince: "BC",
    metaDescription:
      "Plan a Halifax to Vancouver move with route-specific pricing from $2,700+, over 3,700 km, 10–27 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "A Halifax-to-Vancouver move is a coast-to-coast interprovincial relocation. A written estimate helps set clear expectations for your inventory, Halifax pickup access, Vancouver delivery access, packing needs, timing, and any storage required between homes.",
      "Purely Canadian Movers is an agent and partner of Great Canadian Van Lines. Your move is coordinated by Purely Canadian Movers and supported through the Great Canadian Van Lines agent network. Agents are part of the van line network, not broker-style unknown movers.",
      "The westbound corridor crosses several provinces and weather systems. Vancouver arrivals can involve condo or strata move-in rules, elevator reservations, loading-zone windows, parking limits, and long carries.",
    ],
    unique: [
      ["Westbound cross-country logistics", "At over 3,700 km, the Halifax–Vancouver corridor requires coordinated shipment scheduling, seasonal planning, access review, and a realistic delivery spread."],
      ["Halifax pickup access", "Share apartment elevator times, loading access, parking, stairs, and long-carry details early, including any narrow streets or restricted curb space."],
      ["Vancouver delivery access", "Vancouver condos and strata buildings may require elevator bookings, loading-zone reservations, certificates, move-in deposits, or specific delivery hours."],
      ["Weather across Canada", "Atlantic storms, winter conditions, mountain weather, and seasonal congestion can affect route planning, so keep essential items with you."],
    ],
    tips: [
      ["Reserve Vancouver elevator time", "Ask the building or strata manager about elevator reservations, loading windows, move-in hours, parking rules, and required documents."],
      ["Confirm loading-zone access", "Review curb space, loading-zone limits, street width, stairs, long carries, and whether a smaller vehicle or shuttle may be needed."],
      ["Prepare for seasonal conditions", "Halifax and Vancouver can have very different weather while the shipment is in transit. Protect floors and keep weather-sensitive essentials accessible."],
      ["Plan British Columbia updates", "After establishing residence, review BC driver-licence, vehicle-registration, health-coverage, utility, and address-change requirements."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Vancouver address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Halifax to Vancouver?", "Planning estimates range from $2,700+ for a studio or small shipment to $18,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, services, season, and confirmed move details."],
      ["How long does a Halifax to Vancouver move take?", "Typical transit is 10–27 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is a Halifax to Vancouver move coordinated?", "Purely Canadian Movers provides one accountable point of contact, with support through the Great Canadian Van Lines agent network for westbound routing and delivery planning."],
      ["Can you move Halifax apartments and Vancouver condos?", "Yes. Provide elevator reservations, loading-zone rules, parking limits, stair details, long carries, and building or strata requirements when requesting your estimate."],
      ["What should I plan after arriving in Vancouver?", "Plan your BC address, driver-licence, vehicle-registration, health-coverage, utility, and building-access updates. Keep documents, medication, chargers, and other first-week essentials with you."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
    ],
  },
  {
    slug: "vancouver-to-halifax-movers",
    from: "Vancouver",
    fromProvince: "BC",
    to: "Halifax",
    toProvince: "NS",
    metaDescription:
      "Plan a Vancouver to Halifax move with route-specific pricing from $2,700+, over 3,700 km, 10–27 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "A Vancouver-to-Halifax move is a coast-to-coast interprovincial relocation. A written estimate helps set clear expectations for your inventory, Vancouver pickup access, Halifax delivery access, packing needs, timing, and any storage required between homes.",
      "Purely Canadian Movers is an agent and partner of Great Canadian Van Lines. Your move is coordinated by Purely Canadian Movers and supported through the Great Canadian Van Lines agent network. Agents are part of the van line network, not broker-style unknown movers.",
      "The eastbound corridor crosses several provinces and weather systems. Halifax arrivals can involve apartment elevator reservations, loading windows, parking or curb restrictions, stairs, and winter access.",
    ],
    unique: [
      ["Eastbound cross-country logistics", "At over 3,700 km, the Vancouver–Halifax corridor requires coordinated shipment scheduling, seasonal planning, access review, and a realistic delivery spread."],
      ["Vancouver pickup access", "Share strata rules, elevator times, loading-zone access, parking, stairs, and long-carry details early, especially for condos and high-rises."],
      ["Halifax delivery access", "Halifax apartments and downtown homes may have move-in hours, elevator reservations, curb restrictions, stairs, narrow access, and winter entry conditions."],
      ["Weather across Canada", "Mountain conditions, winter roads, Atlantic storms, and seasonal congestion can affect route planning, so keep essential items with you."],
    ],
    tips: [
      ["Reserve Halifax elevator time", "Ask the building manager about elevator reservations, loading windows, move-in hours, parking rules, and any building-document requirements."],
      ["Confirm Halifax loading access", "Review curb space, street width, parking restrictions, stairs, long carries, and whether a smaller vehicle or shuttle may be needed."],
      ["Prepare for seasonal conditions", "Vancouver and Halifax can have very different weather while the shipment is in transit. Protect floors and keep weather-sensitive essentials accessible."],
      ["Plan Nova Scotia updates", "After establishing residence, review Nova Scotia driver-licence, vehicle-registration, health-card, utility, and address-change requirements."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Halifax address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Vancouver to Halifax?", "Planning estimates range from $2,700+ for a studio or small shipment to $18,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, services, season, and confirmed move details."],
      ["How long does a Vancouver to Halifax move take?", "Typical transit is 10–27 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is a Vancouver to Halifax move coordinated?", "Purely Canadian Movers provides one accountable point of contact, with support through the Great Canadian Van Lines agent network for eastbound routing and delivery planning."],
      ["Can you move Vancouver condos and Halifax apartments?", "Yes. Provide strata or building rules, elevator reservations, loading-zone limits, parking, stair details, and long carries when requesting your estimate."],
      ["What should I plan after arriving in Halifax?", "Plan your Nova Scotia address, driver-licence, vehicle-registration, health-card, utility, and building-access updates. Keep documents, medication, chargers, and other first-week essentials with you."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
    ],
  },
];
function assertRouteData(route) {
  for (const field of ["slug", "from", "fromProvince", "to", "toProvince", "metaDescription"]) {
    if (typeof route[field] !== "string" || !route[field].trim()) throw new Error(`${route.slug || "Halifax–Vancouver route"}: missing required ${field}`);
  }
  for (const field of ["intro", "unique", "tips", "faqs"]) if (!Array.isArray(route[field]) || !route[field].length) throw new Error(`${route.slug}: incomplete ${field}`);
  if (pricing.length !== 5 || pricing.some((row) => row.length !== 3 || row.some((value) => typeof value !== "string" || !value.trim()))) throw new Error(`${route.slug}: expected exactly five complete authoritative pricing rows`);
  for (const field of ["distance", "transit", "range"]) if (!routeFacts[field]) throw new Error(`${route.slug}: missing authoritative ${field}`);
}
routes.forEach(assertRouteData);
assertRouteOwnership("rebuild-halifax-vancouver-routes.mjs", routes);

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
        description: `${name} long-distance moving with written estimates, route planning, packing, storage, Declared Value Protection options, over 3,700 km of travel, and typical transit of 10–27 days.`,
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
  const title = route.slug === "vancouver-to-halifax-movers"
    ? "Vancouver to Halifax Movers | Purely Canadian Movers"
    : "Halifax to Vancouver Movers | Cost, Transit Time & Estimate | Purely Canadian Movers";
  let head = template.slice(0, bodyStart)
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapeHtml(title)}">${escapeHtml(title)}</title>`)
    .replace(/(<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=")[^"]*(")/i, `$1${routeUrl(route)}$2`);

  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'name="keywords"', `${name} movers, moving from ${route.from} to ${route.to}, long distance movers ${route.from} to ${route.to}, ${route.from} ${route.to} moving company, ${name} moving cost, ${name} moving quote`);
  head = replaceMeta(head, 'property="og:title"', title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', routeUrl(route));
  head = replaceMeta(head, 'name="twitter:title"', title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);
  head = head.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");
  if (!head.includes("/assets/static-nav.css")) head = head.replace(/\s*<\/head>/i, '    <link rel="stylesheet" href="/assets/static-nav.css">\n</head>');
  if (!head.includes("/assets/static-chat.css")) head = head.replace(/\s*<\/head>/i, '    <link rel="stylesheet" href="/assets/static-chat.css">\n</head>');
  head = head.replace(/\s*<\/head>/i, `    <link rel="stylesheet" href="/assets/step43-halifax-vancouver.css">\n    <script type="application/ld+json" id="route-schema">${JSON.stringify(schema(route))}</script>\n</head>`);
  return head;
}

function extract(template, pattern, label) {
  const match = template.match(pattern);
  if (!match) throw new Error(`Reference route template has no ${label}`);
  return match[0];
}

function quotePanel(route) {
  const name = routeName(route);
  const article = "a";
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
          <div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Online estimate bonus: save at least $100</strong><span class="pcm-estimate-bonus__deadline">Book before September 30, 2026</span><span>Complete an online estimate and book your move with Purely Canadian Movers. Discount confirmed with your written estimate.</span></div></div>
          <div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:6045227222">604-522-7222</a> · Direct mover since 1991</div>
        </form>
      </div>
    </section>`;
}

function pricingSection(route) {
  const name = routeName(route);
  const upper = name.toUpperCase();
  const article = "a";
  const capitalizedArticle = article[0].toUpperCase() + article.slice(1);
  const rows = pricing.map(([size, price, note]) => `<tr><td>${escapeHtml(size)}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>${routeFacts.transit}</td></tr>`).join("");
  const reverse = route.slug === "halifax-to-vancouver-movers" ? ["vancouver-to-halifax-movers", "Vancouver to Halifax"] : ["halifax-to-vancouver-movers", "Halifax to Vancouver"];
  return `<section class="pcm-lead-boost pcm-route-cost pcm-step42-pricing" aria-label="${escapeHtml(upper)} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(upper)} MOVING COST</div><h2>How much does it cost to move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p class="pcm-route-cost__intro">${capitalizedArticle} ${escapeHtml(name)} move typically ranges from about <strong>$2,700+</strong> for a small shipment to <strong>$18,000+</strong> for a larger home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed services.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges in CAD, not guaranteed quotes. Final pricing depends on shipment weight or volume, origin and destination access, season, packing, storage, and requested services. Basic carrier liability applies; available <strong>Declared Value Protection</strong> options are confirmed in writing before moving day.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full moving cost guide</a><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} long-distance movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} long-distance movers</a><a href="/${reverse[0]}/">${reverse[1]} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  const name = routeName(route);
  return `<div class="pcm-static-band pcm-static-band--hero"><section class="pcm-hero pcm-static-hero"><div><div class="pcm-kicker">${escapeHtml(name)} movers</div><h1>${escapeHtml(name)} Movers</h1><p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p><p>Purely Canadian Movers coordinates your move with support through the Great Canadian Van Lines agent network, giving you one accountable point of contact for route planning and delivery coordination.</p><div class="pcm-pills" aria-label="Trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Packing and storage available</span></div><div class="pcm-hero-actions"><a class="pcm-button primary" href="/contact/">Get Written Estimate</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></div>`;
}

function routeGlance(route) {
  const name = routeName(route);
  return `<div class="pcm-step42-glance"><h3>Route at a Glance</h3><div class="pcm-step42-glance__grid"><div><span class="pcm-step42-icon" aria-hidden="true">↔</span><p><small>Distance</small><strong>${routeFacts.distance}</strong><span>${escapeHtml(name)}</span></p></div><div><span class="pcm-step42-icon" aria-hidden="true">◷</span><p><small>Estimated transit</small><strong>${routeFacts.transit}</strong><span>Depending on shipment and schedule</span></p></div><div><span class="pcm-step42-icon" aria-hidden="true">$</span><p><small>Typical cost range</small><strong>${routeFacts.range}</strong><span>Studio through 4+ bedroom</span></p></div></div></div>`;
}

function routeBody(route) {
  const name = routeName(route);
  const opposite = route.slug === "halifax-to-vancouver-movers" ? "Vancouver to Halifax" : "Halifax to Vancouver";
  const oppositeSlug = route.slug === "halifax-to-vancouver-movers" ? "vancouver-to-halifax-movers" : "halifax-to-vancouver-movers";
  const article = "a";
  return `<main class="pcm-static-main pcm-step42-shell">
      ${hero(route)}
      <section class="pcm-step42-trust">Family-owned since 1991 · BBB Accredited business · Great Canadian Van Lines agent · Written estimates</section>
      <section class="pcm-step42-main"><div class="container"><h2>Moving from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}</h2><div class="pcm-step42-intro">${route.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>${routeGlance(route)}<h2>What Makes ${article} ${escapeHtml(routeDash(route))} Move Unique</h2><div class="pcm-step42-card-grid">${route.unique.map(card).join("")}</div><h2>Tips for Moving to ${escapeHtml(route.to)}</h2><div class="pcm-step42-card-grid">${route.tips.map(card).join("")}</div><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-step42-proof"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>Great Canadian Van Lines agent-network support with accountable route coordination</li><li>One accountable point of contact for route planning, documentation, and delivery coordination</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Carrier liability and Declared Value Protection choices are explained before moving day</li><li>Full or partial packing and storage options are available</li></ul><h2>How Your ${escapeHtml(routeDash(route))} Move Works</h2><div class="pcm-step42-process"><article><b>1</b><h3>Written estimate</h3><p>Tell us about the route, home size, inventory, access, services, and preferred moving date.</p></article><article><b>2</b><h3>Pack and load</h3><p>Confirm packing, loading, elevator, parking, stair, and long-carry details before pickup.</p></article><article><b>3</b><h3>Cross-country transit</h3><p>Your shipment is coordinated through the Great Canadian Van Lines agent network.</p></article><article><b>4</b><h3>Delivery</h3><p>Delivery timing and destination access are coordinated in writing.</p></article></div></div></section>
      <section class="pcm-section pcm-route-faq-static pcm-step42-faq"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></section>
      <section class="pcm-section pcm-step42-related"><h2>Related Destinations and Resources</h2><div class="pcm-links"><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} Long-Distance Movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} Long-Distance Movers</a><a href="/${oppositeSlug}/">${escapeHtml(opposite)} Movers</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/great-canadian-vanlines-agent/">Great Canadian Van Lines Agent</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a Written Estimate</a></div></section>
      <section class="pcm-section pcm-closing-cta pcm-static-closing-cta pcm-step42-closing"><h2>Ready to Move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>Request a free, no-obligation written estimate for your cross-country move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-local-line">Or call our local line: <a href="tel:16045227222">604-522-7222</a></p></section>
    </main>`;
}

function page(template, route) {
  const header = extract(template, /<header\b[^>]*>[\s\S]*?<\/header>/i, "site header");
  const footer = extract(template, /<footer\b[^>]*>[\s\S]*?<\/footer>/i, "site footer")
    .replace(">Valuation Coverage</a>", ">Declared Value Protection</a>");
  return `${buildHead(template, route)}<body class="pcm-static-route-ready">
  <div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="${route.slug}">
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
  <script defer src="/assets/static-chat.js"></script>
  <script defer src="/assets/step43-halifax-vancouver.js"></script>
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
  if (!html.includes("/assets/step43-halifax-vancouver.css")) throw new Error(`${route.slug}: missing Step 43 stylesheet`);
  if (!html.includes("/assets/step43-halifax-vancouver.js")) throw new Error(`${route.slug}: missing Step 43 navigation enhancer`);
  if (html.includes("Moving Cost Breakdown")) throw new Error(`${route.slug}: legacy Moving Cost Breakdown remains`);
  const legacyProtectionMatches = html.match(/fully insured|\binsurance\b|basic valuation coverage|full-value protection/gi);
  if (legacyProtectionMatches) {
    throw new Error(`${route.slug}: legacy protection wording remains (${legacyProtectionMatches.join(", ")})`);
  }
  if (/Book before\\s+August\\s+3(?:0|1)|Book before\\s+September\\s+30(?!,\\s+2026)/i.test(html)) throw new Error(`${route.slug}: stale dated promotion remains`);
  for (const value of ["Over 3,700 km", "10–27 days", "$2,700+", "$4,400+", "$7,300+", "$12,000+", "$18,000+"]) {
    if (!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  }
  return html;
}

const template = await readFile(referencePath, "utf8");
for (const route of routes) {
  const output = ensureRoutePage(page(template, route), route);
  const outputPath = join(root, route.slug, "index.html");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(outputPath, output, "utf8");
  console.log(`Wrote ${outputPath}`);
}
