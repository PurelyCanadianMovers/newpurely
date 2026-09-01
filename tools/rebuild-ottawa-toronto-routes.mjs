import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const referencePath = join(root, "calgary-to-ottawa-movers", "index.html");
const distance = "~450 km";
const transit = "2–5 days";
const prices = [
  ["Studio", "$800+", "Best for a studio or small shipment"],
  ["1 Bedroom", "$1,100+", "Depends on inventory, access, and requested services"],
  ["2 Bedroom", "$1,500+", "Common planning range for an apartment or condo move"],
  ["3 Bedroom", "$2,000+", "Larger household shipment with more labour and space"],
  ["4+ Bedroom", "$2,800+", "Final estimate depends on inventory, access, and services"],
];

const routes = [
  {
    slug: "ottawa-to-toronto-movers",
    from: "Ottawa",
    fromProvince: "ON",
    to: "Toronto",
    toProvince: "ON",
    metaDescription:
      "Plan an Ottawa to Toronto move with route-specific pricing from $800+, approximately 450 km, 2–5 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "An Ottawa-to-Toronto move stays within Ontario and covers roughly 450 km. A written estimate helps keep your inventory, pickup and delivery access, packing needs, timing, and storage requirements clear.",
      "Purely Canadian Movers coordinates your move with one accountable point of contact for route planning, documentation, packing, storage, and delivery details. Declared Value Protection options are explained before moving day.",
      "Ottawa pickup and Toronto delivery can involve condo elevator reservations, loading windows, parking or curb restrictions, stairs, and building move-in rules that should be reviewed before the route is scheduled.",
    ],
    unique: [
      ["Ontario route planning", "At approximately 450 km, this route calls for practical planning around shipment size, access, route scheduling, season, and the delivery window available at the Toronto address."],
      ["Ottawa pickup access", "Share parking, elevator, loading-zone, stair, and long-carry details early, especially for Ottawa condos, apartments, and downtown buildings."],
      ["Toronto destination access", "Toronto condos, apartments, and homes may have move-in hours, loading-zone rules, elevator reservations, parking limits, and building requirements to confirm before delivery."],
      ["One coordinated plan", "Inventory, packing, pickup access, route timing, protection choices, and destination requirements are reviewed together so the written estimate reflects the move."],
    ],
    tips: [
      ["Reserve Toronto elevator time", "Ask the building manager about elevator reservations, loading-dock windows, move-in hours, parking rules, and any building-document requirements."],
      ["Confirm Toronto loading access", "Review curb space, parking permits, street width, stairs, long carries, and whether a smaller vehicle or shuttle is needed at the destination."],
      ["Prepare both addresses", "Confirm access details at the Ottawa pickup and Toronto delivery addresses, including elevator dimensions, doorways, stairs, and protected paths."],
      ["Plan the delivery window", "Keep medication, identification, chargers, essential documents, and other first-week necessities with you rather than in the shipment."],
      ["Measure large items", "Check doorways, stairwells, elevators, and room dimensions at the Toronto address for oversized furniture or specialty items."],
    ],
    faqs: [
      ["How much does it cost to move from Ottawa to Toronto?", "Planning estimates range from $800+ for a studio to $2,800+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed move details."],
      ["How long does an Ottawa to Toronto move take?", "Typical transit is 2–5 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is an Ottawa to Toronto move coordinated?", "Purely Canadian Movers provides one accountable point of contact to review inventory, access, services, timing, and delivery requirements for the Ontario route."],
      ["Can you move Ottawa condos and Toronto apartments?", "Yes. Provide elevator reservations, loading-dock rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
      ["Can I receive a written estimate?", "Yes. Written estimates are based on your inventory, both addresses, access conditions, packing or storage needs, protection choices, and preferred moving date."],
    ],
  },
  {
    slug: "toronto-to-ottawa-movers",
    from: "Toronto",
    fromProvince: "ON",
    to: "Ottawa",
    toProvince: "ON",
    metaDescription:
      "Plan a Toronto to Ottawa move with route-specific pricing from $800+, approximately 450 km, 2–5 days transit guidance, packing, storage, and written estimates.",
    intro: [
      "A Toronto-to-Ottawa move stays within Ontario and covers roughly 450 km. A written estimate helps you plan inventory, Toronto pickup access, Ottawa delivery access, packing needs, timing, and storage requirements.",
      "Purely Canadian Movers coordinates your move with one accountable point of contact for the route, documentation, packing, storage, delivery planning, and Declared Value Protection choices.",
      "Toronto pickup and Ottawa delivery can involve condo elevator reservations, dense-building loading rules, parking limits, stairs, winter access, and move-in windows that should be confirmed early.",
    ],
    unique: [
      ["Ontario route planning", "At approximately 450 km, this route benefits from clear planning around shipment size, access, route scheduling, season, and the delivery window available at the Ottawa address."],
      ["Toronto pickup access", "Toronto condos and apartments may require elevator bookings, loading-dock reservations, parking arrangements, move-out hours, and long-carry details."],
      ["Ottawa destination access", "Ottawa homes, condos, and apartments may have move-in hours, loading-zone rules, elevator reservations, winter entry conditions, and parking requirements to review before delivery."],
      ["Delivery timing and essentials", "Keep important documents, medication, chargers, and first-week essentials with you while the shipment is scheduled for delivery."],
    ],
    tips: [
      ["Reserve Toronto pickup access", "Confirm the elevator, loading bay, parking, move-out hours, building rules, and any required certificates with Toronto property management."],
      ["Confirm Ottawa delivery access", "Review curb space, parking permits, street width, stairs, long carries, elevator dimensions, and whether a smaller vehicle or shuttle is needed."],
      ["Prepare for seasonal conditions", "Protect floors and entryways at both addresses, and keep weather-sensitive essentials accessible during pickup and delivery."],
      ["Measure large items", "Check doors, stairwells, elevators, and room dimensions at the Ottawa address for oversized furniture or specialty items."],
      ["Plan the first delivery days", "Keep identification, medication, chargers, essential documents, and items needed immediately after arrival with you rather than in the shipment."],
    ],
    faqs: [
      ["How much does it cost to move from Toronto to Ottawa?", "Planning estimates range from $800+ for a studio to $2,800+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed move details."],
      ["How long does a Toronto to Ottawa move take?", "Typical transit is 2–5 days. The confirmed delivery spread depends on route scheduling, shipment size, seasonal conditions, access, and delivery availability."],
      ["What protection is available for my shipment?", "Standard carrier liability applies, and Declared Value Protection options are available. Zero deductible may apply where applicable; the selected protection details are confirmed before moving day."],
      ["How is a Toronto to Ottawa move coordinated?", "Purely Canadian Movers provides one accountable point of contact to review Toronto pickup access, Ottawa delivery access, inventory, services, timing, and written estimate details."],
      ["Can you move Toronto condos and Ottawa apartments?", "Yes. Provide elevator reservations, loading-dock rules, parking limits, stair details, long carries, and building requirements when requesting your estimate."],
      ["Can packing and storage be included?", "Yes. Full or partial packing, unpacking, short- or long-term storage, and Declared Value Protection options can be included in your written estimate."],
      ["How is the final moving price calculated?", "Final pricing depends on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing."],
      ["Can I receive a written estimate?", "Yes. Written estimates are based on your inventory, both addresses, access conditions, packing or storage needs, protection choices, and preferred moving date."],
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
const articleFor = (route) => route.from === "Ottawa" ? "an" : "a";

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
        serviceType: "Ontario long-distance moving",
        areaServed: [
          { "@type": "City", name: route.from },
          { "@type": "City", name: route.to },
        ],
        url: routeUrl(route),
        description: `${name} moving with written estimates, route planning, packing, storage, Declared Value Protection options, ${distance} of travel, and typical transit of ${transit}. Studio pricing starts at $800+ and 4+ bedroom pricing starts at $2,800+.`,
        additionalProperty: [
          { "@type": "PropertyValue", name: "Estimated route distance", value: distance },
          { "@type": "PropertyValue", name: "Typical transit", value: transit },
          { "@type": "PropertyValue", name: "Studio starting price", value: "$800+" },
          { "@type": "PropertyValue", name: "1 Bedroom starting price", value: "$1,100+" },
          { "@type": "PropertyValue", name: "2 Bedroom starting price", value: "$1,500+" },
          { "@type": "PropertyValue", name: "3 Bedroom starting price", value: "$2,000+" },
          { "@type": "PropertyValue", name: "4+ Bedroom starting price", value: "$2,800+" },
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
  head = replaceMeta(head, 'name="keywords"', `${name} movers, moving from ${route.from} to ${route.to}, Ontario movers ${route.from} to ${route.to}, ${name} moving cost, ${name} moving quote`);
  head = replaceMeta(head, 'property="og:title"', title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', routeUrl(route));
  head = replaceMeta(head, 'name="twitter:title"', title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);
  head = head.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");
  head = head.replace("</head>", `    <script type="application/ld+json" id="route-schema">${JSON.stringify(schema(route))}</script>\n</head>`);
  return head.replace(/[ \t]+$/gm, "");
}

function quotePanel(route) {
  const name = routeName(route);
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate">
      <div class="pcm-top-estimate">
        <div class="pcm-top-estimate__intro">
          <div class="pcm-kicker">FREE MOVING ESTIMATE</div>
          <h2>Get ${articleFor(route)} ${escapeHtml(name)} quote.</h2>
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
          <div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:6045227222">604-522-7222</a> · Direct mover since 1991</div>
        </form>
      </div>
    </section>`;
}

function pricingSection(route) {
  const name = routeName(route);
  const rows = prices.map(([size, price, note]) => `<tr><td>${size}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>${transit}</td></tr>`).join("");
  return `<section class="pcm-lead-boost pcm-route-cost" aria-label="${escapeHtml(name.toUpperCase())} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(name.toUpperCase())} MOVING COST</div><h2>How much does it cost to move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>${articleFor(route)[0].toUpperCase() + articleFor(route).slice(1)} ${escapeHtml(name)} move typically ranges from about <strong>$800+</strong> for a studio to <strong>$2,800+</strong> for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed services.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__inclusion">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible where applicable.</p><p class="pcm-route-cost__note">Prices are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, protection choices, and service dates.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full moving cost guide</a><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} long-distance movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} long-distance movers</a><a href="/${route.slug === "ottawa-to-toronto-movers" ? "toronto-to-ottawa-movers" : "ottawa-to-toronto-movers"}/">${route.slug === "ottawa-to-toronto-movers" ? "Toronto to Ottawa" : "Ottawa to Toronto"} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  const name = routeName(route);
  return `<div class="pcm-static-band pcm-static-band--hero"><section class="pcm-hero pcm-static-hero"><div><div class="pcm-kicker">${escapeHtml(name)} movers</div><h1>${escapeHtml(name)} Movers</h1><p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p><p>Purely Canadian Movers coordinates your move with one accountable point of contact for route planning, access, services, and delivery timing.</p><div class="pcm-pills" aria-label="Trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Packing and storage available</span></div><div class="pcm-hero-actions"><a class="pcm-button primary" href="/contact/">Get Written Estimate</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></div>`;
}

function routeGlance(route) {
  return `<section class="pcm-section pcm-route-glance-section pcm-static-route-glance"><h2>${escapeHtml(routeDash(route))} Route at a Glance</h2><div class="pcm-route-glance"><div class="pcm-glance-item"><span class="pcm-glance-label">Distance</span><strong class="pcm-glance-value">${distance}</strong><span class="pcm-glance-support">${escapeHtml(routeName(route))}</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Est. transit time</span><strong class="pcm-glance-value">${transit}</strong><span class="pcm-glance-support">Depending on shipment size and scheduling</span></div><div class="pcm-glance-item"><span class="pcm-glance-label">Typical cost range</span><strong class="pcm-glance-value">$800+–$2,800+</strong><span class="pcm-glance-support">Studio to 4+ bedroom home</span></div></div></section>`;
}

function routeBody(route) {
  const name = routeName(route);
  const opposite = route.slug === "ottawa-to-toronto-movers" ? "Toronto to Ottawa" : "Ottawa to Toronto";
  const oppositeSlug = route.slug === "ottawa-to-toronto-movers" ? "toronto-to-ottawa-movers" : "ottawa-to-toronto-movers";
  return `<main class="pcm-static-main">
      ${hero(route)}
      <section class="pcm-section"><h2>Moving from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}</h2>${route.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>
      ${routeGlance(route)}
      <section class="pcm-section"><h2>What Makes ${articleFor(route)} ${escapeHtml(routeDash(route))} Move Unique</h2><div class="pcm-grid">${route.unique.map(card).join("")}</div></section>
      <section class="pcm-section"><h2>Tips for Moving to ${escapeHtml(route.to)}</h2><div class="pcm-grid">${route.tips.map(card).join("")}</div></section>
      <section class="pcm-section"><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-checklist"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>One accountable point of contact for route planning, documentation, and delivery coordination</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Declared Value Protection choices are explained before moving day</li><li>Full or partial packing and storage options are available</li></ul><div class="pcm-warning"><strong>Review unusually low moving quotes carefully.</strong> Ask for a written estimate and confirm fuel, access, packing, storage, protection choices, and other included services before signing.</div></section>
      <section class="pcm-section"><h2>How Your ${escapeHtml(routeDash(route))} Move Works</h2><div class="pcm-steps"><article class="pcm-card"><h3>1. Free estimate</h3><p>Tell us about the route, home size, inventory, access, services, and preferred moving date.</p></article><article class="pcm-card"><h3>2. Pack and load</h3><p>Confirm packing, loading, elevator, parking, stair, and long-carry details before pickup.</p></article><article class="pcm-card"><h3>3. Route transit</h3><p>Your shipment is scheduled for the Ontario route with the timing and services confirmed in writing.</p></article><article class="pcm-card"><h3>4. Delivery and placement</h3><p>Delivery timing and destination access are coordinated in writing; the delivery team places items in the rooms you identify.</p></article></div></section>
      <section class="pcm-section"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></section>
      <section class="pcm-section"><h2>Related Destinations and Resources</h2><div class="pcm-links"><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} Long-Distance Movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} Long-Distance Movers</a><a href="/${oppositeSlug}/">${escapeHtml(opposite)} Movers</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/great-canadian-vanlines-agent/">Great Canadian Van Lines Agent</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a Written Estimate</a></div></section>
      <section class="pcm-section pcm-closing-cta pcm-static-closing-cta"><h2>Ready to Move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>Request a free, no-obligation written estimate for your Ontario move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-local-line">Or call our local line: <a href="tel:16045227222">604-522-7222</a></p></section>
    </main>`;
}

function page(template, route) {
  const headerMatch = template.match(/<header class="pcm-site-header">[\s\S]*?<\/header>/i);
  const footerMatch = template.match(/<footer class="pcm-footer">[\s\S]*?<\/footer>/i);
  if (!headerMatch || !footerMatch) throw new Error("Reference route template has no static header or footer");
  const routeFooter = footerMatch[0]
    .replace('href="/cross-country-movers/"', 'href="/long-distance/"')
    .replace(/Cross-Country Moves/gi, "Long-Distance Moves");
  return `${buildHead(template, route)}<body class="pcm-static-route-ready">
  <div id="root" class="pcm-static-route pcm-static-route-ready">
    ${quotePanel(route)}
    ${pricingSection(route)}
    ${headerMatch[0]}
    <div class="pcm-static-page">
      ${routeBody(route)}
    </div>
    ${routeFooter}
  </div>
  <script defer src="/assets/conversion-boost.js"></script>
  <script defer src="/assets/static-nav.js"></script>
  <div class="pcm-lead-boost pcm-sticky-cta"><a class="pcm-primary-button" href="/contact/">Get Estimate</a><a class="pcm-secondary-button" href="tel:18774856683">Call</a></div>
  <button type="button" class="pcm-chat-nudge is-visible" aria-label="Ask a moving question or get a quick price quote"><strong>Not ready for an estimate?</strong><span>Ask us a moving question or get a quick price quote</span></button>
</body></html>`;
}

function ensureRoutePage(html, route) {
  const name = routeName(route);
  const main = html.match(/<main class="pcm-static-main">[\s\S]*?<\/main>/i)?.[0] ?? "";
  const exact = (needle, label) => {
    const count = html.split(needle).length - 1;
    if (count !== 1) throw new Error(`${route.slug}: ${label} expected once, found ${count}`);
  };
  exact(`<h1>${name} Movers</h1>`, "H1");
  exact("class=\"pcm-top-estimate\"", "quote panel");
  const pricingCount = (html.match(/class="[^"]*\bpcm-route-cost\b[^"]*"/g) || []).length;
  if (pricingCount !== 1) throw new Error(`${route.slug}: pricing section expected once, found ${pricingCount}`);
  exact("Route at a Glance", "route glance");
  exact("Frequently Asked Questions", "FAQ");
  if (html.includes("Moving Cost Breakdown")) throw new Error(`${route.slug}: legacy Moving Cost Breakdown remains`);
  if (/fully insured|\binsurance\b|\binsured\b|basic valuation coverage|full-value protection/i.test(main)) {
    throw new Error(`${route.slug}: legacy protection wording remains`);
  }
  if (/cross-country|interprovincial|between provinces/i.test(html)) {
    throw new Error(`${route.slug}: unsupported province/cross-country wording remains`);
  }
  if (/\ba Ottawa\b|\bA Ottawa\b/i.test(main)) throw new Error(`${route.slug}: Ottawa article grammar remains`);
  for (const value of [distance, transit, "$800+", "$1,100+", "$1,500+", "$2,000+", "$2,800+"]) {
    if (!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  }
  for (const stale of ["$2,500–$4,500", "$7,000–$14,000", "$800-$1500", "2–4 days", "2-4 days", "Toronto, ON\" placeholder=\"Calgary, AB", "value=\"Calgary, AB\""]) {
    if (html.includes(stale)) throw new Error(`${route.slug}: stale value remains: ${stale}`);
  }
  return html;
}

function appendTorontoHubRoute(html) {
  if (html.includes('href="/toronto-to-ottawa-movers/"')) return html;
  const pattern = /(<h3[^>]*>Routes From Toronto<\/h3><div[^>]*>)([\s\S]*?)(<\/div><\/div>)/i;
  const match = html.match(pattern);
  if (!match) throw new Error("Toronto hub Routes From Toronto block not found");
  const link = '<a href="/toronto-to-ottawa-movers/" class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200 hover:border-[#CC1A1A] hover:bg-red-50 transition-colors group"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right text-[#CC1A1A] shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span class="font-body text-gray-700 group-hover:text-gray-900 font-semibold">Toronto → Ottawa</span></a>';
  return html.replace(pattern, `$1${match[2]}${link}$3`);
}

function ensureOttawaHubRoute(html) {
  const count = html.split('href="/ottawa-to-toronto-movers/"').length - 1;
  if (count !== 1) throw new Error(`Ottawa hub must contain exactly one Ottawa → Toronto route link; found ${count}`);
  return html;
}

function appendCostGuidePopularRoute(html) {
  if (html.includes('href="/toronto-to-ottawa-movers/"')) return html;
  const heading = html.indexOf("Popular Moving Routes in Canada");
  if (heading < 0) throw new Error("Cost guide popular routes heading not found");
  const tableStart = html.indexOf("<table", heading);
  const bodyStart = html.indexOf("<tbody", tableStart);
  const bodyEnd = html.indexOf("</tbody>", bodyStart);
  if (tableStart < 0 || bodyStart < 0 || bodyEnd < 0) throw new Error("Cost guide popular routes table not found");
  const template = html.slice(bodyStart, bodyEnd).match(/<tr[\s\S]*?<\/tr>/i)?.[0];
  if (!template) throw new Error("Cost guide popular routes row template not found");
  const rowClass = template.match(/<tr[^>]*class="([^"]*)"/i)?.[1] ?? "border-b border-gray-200 bg-white hover:bg-red-50";
  const cellClasses = [...template.matchAll(/<td[^>]*class="([^"]*)"/gi)].map((match) => match[1]);
  const linkClass = template.match(/<a[^>]*class="([^"]*)"/i)?.[1] ?? "inline-flex items-center justify-center whitespace-nowrap text-sm h-8 rounded-md gap-1.5 px-3 bg-[#CC1A1A] text-white font-body font-semibold";
  const row = `<tr class="${rowClass}"><td class="${cellClasses[0] ?? "py-3 px-4 font-body text-gray-900 font-semibold"}">Toronto → Ottawa</td><td class="${cellClasses[1] ?? "py-3 px-4 font-body text-gray-700"}">${distance}</td><td class="${cellClasses[2] ?? "py-3 px-4 font-body text-gray-700"}">${transit}</td><td class="${cellClasses[3] ?? "py-3 px-4 text-right"}"><a href="/toronto-to-ottawa-movers/" class="${linkClass}">Get a Quote</a></td></tr>`;
  return html.slice(0, bodyEnd) + row + html.slice(bodyEnd);
}

async function ensureSitemapRoutes() {
  const sitemapPath = join(root, "sitemap.xml");
  let sitemap = await readFile(sitemapPath, "utf8");
  const missing = routes.map(routeUrl).filter((url) => !sitemap.includes(`<loc>${url}</loc>`));
  if (missing.length) {
    const entries = missing.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
    sitemap = sitemap.replace(/<\/urlset>/i, `${entries}\n</urlset>`);
    await writeFile(sitemapPath, sitemap, "utf8");
  }
}

const template = await readFile(referencePath, "utf8");
for (const route of routes) {
  const output = ensureRoutePage(page(template, route), route);
  const outputPath = join(root, route.slug, "index.html");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(outputPath, output, "utf8");
  console.log(`Wrote ${outputPath}`);
}

const torontoHubPath = join(root, "toronto-long-distance-movers", "index.html");
await writeFile(torontoHubPath, appendTorontoHubRoute(await readFile(torontoHubPath, "utf8")), "utf8");
console.log(`Checked ${torontoHubPath}`);

const ottawaHubPath = join(root, "ottawa-long-distance-movers", "index.html");
await writeFile(ottawaHubPath, ensureOttawaHubRoute(await readFile(ottawaHubPath, "utf8")), "utf8");
console.log(`Checked ${ottawaHubPath}`);

const costGuidePath = join(root, "long-distance-moving-cost-canada", "index.html");
await writeFile(costGuidePath, appendCostGuidePopularRoute(await readFile(costGuidePath, "utf8")), "utf8");
console.log(`Checked ${costGuidePath}`);

await ensureSitemapRoutes();
