import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { calgaryEdmontonRoutes } from "./calgary-edmonton-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const origin = "https://purelycanadianmovers.com";
const asset = '<link rel="stylesheet" href="/assets/step35-calgary-edmonton.css" data-pcm-step35="calgary-edmonton">';
const runtime = '<script defer src="/assets/step35-calgary-edmonton.js" data-pcm-step35="calgary-edmonton"></script>';
const contaminated = [
  /~?\s*4[,.]?[89]00\s*km/i,
  /7\s*[–-]\s*19\s*days/i,
  /8\s*[–-]\s*20\s*days/i,
  /\$2,600(?:\.00)?\+/i,
  /\$3,900(?:\.00)?\+/i,
  /\$6,500(?:\.00)?\+/i,
  /\$11,000(?:\.00)?\+/i,
  /\$16,000(?:\.00)?\+/i,
  /\$2,600\s*[–-]\s*\$16,000\+/i,
];

const routeCopy = {
  "/calgary-to-edmonton-movers/": {
    slug: "calgary-to-edmonton-movers",
    from: "Calgary",
    to: "Edmonton",
    eyebrow: "CALGARY → EDMONTON",
    title: "Calgary to Edmonton Movers | Purely Canadian Movers",
    description: "Plan a Calgary to Edmonton move along Alberta’s Highway 2 corridor. Review a realistic 2–4 day transit estimate, home-size pricing, and practical moving guidance.",
    intro: "Plan an intercity move from Calgary to Edmonton with a family-owned Canadian mover. We coordinate pickup access in Calgary, transportation along the Highway 2 (QEII) corridor, and delivery access in Edmonton.",
    opening: "A Calgary-to-Edmonton move stays within Alberta, but it still benefits from careful scheduling. Our team plans building access, loading windows, the QEII drive, and delivery timing around your written estimate.",
    accessA: "Calgary pickup planning",
    accessAText: "Share loading-zone, condo, elevator, stair, and parking details early so the crew can plan the right equipment and arrival window.",
    accessB: "Edmonton delivery access",
    accessBText: "Confirm destination parking, elevator reservations, loading docks, and key handover timing before delivery day.",
    reverse: "/edmonton-to-calgary-movers/",
  },
  "/edmonton-to-calgary-movers/": {
    slug: "edmonton-to-calgary-movers",
    from: "Edmonton",
    to: "Calgary",
    eyebrow: "EDMONTON → CALGARY",
    title: "Edmonton to Calgary Movers | Purely Canadian Movers",
    description: "Plan an Edmonton to Calgary move along Alberta’s Highway 2 corridor. Review a realistic 2–4 day transit estimate, home-size pricing, and practical moving guidance.",
    intro: "Plan an intercity move from Edmonton to Calgary with a family-owned Canadian mover. We coordinate pickup access in Edmonton, transportation along the Highway 2 (QEII) corridor, and delivery access in Calgary.",
    opening: "An Edmonton-to-Calgary move stays within Alberta, but dependable timing still starts with clear logistics. Our team plans building access, loading windows, the QEII drive, and delivery timing around your written estimate.",
    accessA: "Edmonton pickup planning",
    accessAText: "Provide loading-zone, condo, elevator, stair, and parking details before move day so the crew can prepare for the property.",
    accessB: "Calgary delivery access",
    accessBText: "Confirm destination parking, elevator reservations, loading docks, and possession timing before the shipment arrives.",
    reverse: "/calgary-to-edmonton-movers/",
  },
};

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function faqs(route) {
  const { from, to } = route;
  return [
    [`How long does it take to move from ${from} to ${to}?`, `A ${from}-to-${to} move typically has a 2–4 day planning window. Shipment size, access, weather, and scheduling can affect the final delivery window shown on your written estimate.`],
    [`How much does it cost to move from ${from} to ${to}?`, `Current planning estimates run from $800+ for a studio to $2,800+ for a 4+ bedroom home. Your written estimate reflects inventory, access, packing, timing, and any requested services.`],
    [`How far is the ${from}–${to} move?`, `Plan on approximately 300 km door to door. The exact distance varies with the pickup and delivery addresses along the Calgary–Edmonton corridor.`],
    [`Do you move from ${to} to ${from} as well?`, `Yes. We coordinate this intra-Alberta route in both directions with the same distance, transit, and home-size planning estimates.`],
    [`Do you provide packing services for a ${from}–${to} move?`, `Yes. Full or partial packing and unpacking can be included, including careful preparation for fragile items, artwork, electronics, and furniture.`],
    ["What protection is available for my shipment?", "Standard carrier liability applies, and additional Declared Value Protection may be available. We explain the options, limits, and costs before booking."],
    [`How should I prepare for winter conditions between ${from} and ${to}?`, "Keep walkways and loading areas cleared, protect moisture-sensitive items, and allow scheduling flexibility when snow or freezing conditions affect the Highway 2 corridor."],
    ["Can I get a written estimate?", "Yes. We prepare a written planning estimate after reviewing your inventory, access conditions, service requirements, and preferred dates. The final terms are the terms stated in that written estimate."],
    [`Can you coordinate apartment or condo access in ${from} and ${to}?`, "Yes. Tell us about elevators, loading docks, parking restrictions, stairs, and building booking windows so they can be included in the move plan."],
    [`Do you offer storage if my ${to} home is not ready?`, "Short-term and longer-term storage options may be arranged when dates do not line up. Ask about availability when requesting your estimate."],
  ];
}

function pricing(route, facts) {
  const rows = facts.pricing.map(({ homeSize, price }) => `<tr><td>${homeSize}</td><td><strong>${price}</strong></td><td>Planning estimate; inventory and access affect the written estimate</td><td>${facts.transit}</td></tr>`).join("");
  return `<section class="pcm-pricing-summary" data-pcm-step35-pricing="${route.slug}" aria-labelledby="${route.slug}-pricing-heading"><div class="pcm-pricing-summary__inner"><div class="pcm-pricing-summary__eyebrow">${route.from} → ${route.to} moving costs</div><h2 id="${route.slug}-pricing-heading">How much does it cost to move from ${route.from} to ${route.to}?</h2><p>For planning, a ${route.from}-to-${route.to} move typically ranges from <strong>${facts.range}</strong>, depending on home size, inventory, access, packing, dates, and requested services.</p><div class="pcm-pricing-summary__table-wrap" tabindex="0" aria-label="Scrollable ${route.from} to ${route.to} moving price table"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-pricing-summary__note">These figures are realistic planning estimates, not guaranteed quotes. Your written estimate accounts for shipment details, access, optional packing or storage, scheduling, and any selected Declared Value Protection.</p></div></section>`;
}

function main(route, facts) {
  const faqMarkup = faqs(route).map(([question, answer]) => `<article class="pcm-step35-faq-card"><h3>${question}</h3><p>${answer}</p></article>`).join("");
  return `<main class="pcm-step35" data-pcm-step35-route="${route.slug}">
<section class="pcm-step35-hero"><div class="pcm-step35-container pcm-step35-hero__inner"><p class="pcm-step35-eyebrow">${route.eyebrow}</p><h1>${route.from} to ${route.to} Moving Cost, Prices &amp; Transit Time</h1><p class="pcm-step35-hero__intro">${route.intro}</p><div class="pcm-step35-actions"><a class="pcm-step35-button pcm-step35-button--primary" href="/contact/">Get Your Free Estimate</a><a class="pcm-step35-button pcm-step35-button--secondary" href="tel:18774856683">1-877-485-6683</a></div><div class="pcm-step35-badges"><span>BBB Accredited</span><span>Family-owned since 1991</span><span>No moving brokers</span><span>Written estimates</span></div></div></section>
<div class="pcm-step35-trust">Trusted by Canadian families since 1991 · Great Canadian Van Lines agent · Clear written estimates</div>
<section class="pcm-step35-content"><div class="pcm-step35-container pcm-step35-container--content"><h2>Moving from ${route.from} to ${route.to}?</h2><div class="pcm-step35-prose"><p>${route.opening}</p><p>At approximately 300 km, this is an intercity Highway 2 corridor move rather than a cross-Canada relocation. We provide a realistic 2–4 day planning window and explain what can affect timing before booking.</p><p>Moving the other way? See our <a href="${route.reverse}">${route.to} to ${route.from} movers</a> page.</p></div>
<section class="pcm-step35-glance" aria-labelledby="${route.slug}-glance"><h3 id="${route.slug}-glance">${route.from}–${route.to} Route at a Glance</h3><div class="pcm-step35-glance__grid"><div><span>Distance</span><strong>~300 km</strong><small>Approximate door-to-door planning distance</small></div><div><span>Estimated transit time</span><strong>${facts.transit}</strong><small>Confirmed in your written estimate</small></div><div><span>Typical cost range</span><strong>${facts.range}</strong><small>Studio to 4+ bedroom planning estimates</small></div></div></section>
<h2>Planning the ${route.from}–${route.to} corridor</h2><div class="pcm-step35-card-grid"><article><h3>${route.accessA}</h3><p>${route.accessAText}</p></article><article><h3>Highway 2 / QEII scheduling</h3><p>Weather, construction, traffic, and shipment scheduling can affect the plan. Your coordinator will provide the applicable pickup and delivery windows.</p></article><article><h3>${route.accessB}</h3><p>${route.accessBText}</p></article><article><h3>Winter move preparation</h3><p>Clear walkways, protect floors, and keep timing flexible when snow, ice, or extreme cold affects either city or the corridor.</p></article></div>
<h2>Why choose Purely Canadian Movers?</h2><ul class="pcm-step35-proof"><li>Family-owned moving company serving Canadian families since 1991</li><li>Great Canadian Van Lines agent-network coordination</li><li>Written planning estimates with clear service details</li><li>Declared Value Protection options explained before booking</li><li>Packing, unpacking, and storage options when requested</li></ul>
<h2>How your ${route.from}–${route.to} move works</h2><div class="pcm-step35-process"><article><b>1</b><h3>Request an estimate</h3><p>Tell us about inventory, access, dates, and services.</p></article><article><b>2</b><h3>Confirm the plan</h3><p>Review the written estimate and scheduled windows.</p></article><article><b>3</b><h3>Load and transit</h3><p>The shipment is prepared and coordinated along the QEII corridor.</p></article><article><b>4</b><h3>Delivery</h3><p>We unload at your ${route.to} address according to the delivery plan.</p></article></div></div></section>
<section class="pcm-step35-faq" aria-labelledby="${route.slug}-faq"><div class="pcm-step35-container pcm-step35-container--faq"><h2 id="${route.slug}-faq">Frequently Asked Questions</h2>${faqMarkup}</div></section>
<section class="pcm-step35-related"><div class="pcm-step35-container pcm-step35-container--content"><h2>Related destinations</h2><div><a href="/${route.from.toLowerCase()}-long-distance-movers/">${route.from} movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${route.to} movers</a><a href="${route.reverse}">${route.to} to ${route.from} movers</a><a href="/long-distance-moving-cost-canada/">Moving cost guide</a></div></div></section>
<section class="pcm-step35-closing"><div class="pcm-step35-container pcm-step35-container--narrow"><h2>Ready to move from ${route.from} to ${route.to}?</h2><p>Request a free, no-obligation planning estimate for your Alberta intercity move.</p><div class="pcm-step35-actions pcm-step35-actions--center"><a class="pcm-step35-button pcm-step35-button--primary" href="/contact/">Get Free Estimate</a><a class="pcm-step35-button pcm-step35-button--secondary" href="tel:18774856683">1-877-485-6683</a></div></div></section>
</main>`;
}

function faqSchema(route) {
  return `<script type="application/ld+json" id="faq-schema">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs(route).map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) })}</script>`;
}

function replaceMeta(html, routeUrl, route) {
  const canonical = `${origin}${routeUrl}`;
  return html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(route.description)}">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(route.description)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(route.description)}">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${route.title}">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${route.title}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`);
}

function assertCanonical(html, route, facts) {
  const required = ["~300 km", facts.transit, facts.range, ...facts.pricing.map(({ price }) => price), "Declared Value Protection", "static-nav.js", "static-chat.js", "conversion-boost.js", "step35-calgary-edmonton.js"];
  for (const value of required) if (!html.includes(value)) throw new Error(`${route.slug} is missing ${value}`);
  for (const pattern of contaminated) if (pattern.test(html)) throw new Error(`${route.slug} retains contaminated route data matching ${pattern}`);
  const count = (pattern) => (html.match(pattern) ?? []).length;
  if (count(/<h1\b/gi) !== 1) throw new Error(`${route.slug} must contain one H1`);
  if (count(/data-pcm-step35-pricing=/g) !== 1 || count(/<table\b/gi) !== 1) throw new Error(`${route.slug} must contain one pricing section/table`);
  if (count(/class="pcm-step35-glance"/g) !== 1) throw new Error(`${route.slug} must contain one Route at a Glance`);
  if (count(/id="faq-schema"/g) !== 1 || count(/class="pcm-step35-faq"/g) !== 1) throw new Error(`${route.slug} must contain one FAQ and schema`);
  if (count(/class="pcm-local-seo"/g) !== 0) throw new Error(`${route.slug} retains pcm-local-seo`);
  if (/<script\b[^>]*type=["']module["']/i.test(html)) throw new Error(`${route.slug} must not load React`);
  if (/\bundefined\b/i.test(html)) throw new Error(`${route.slug} contains undefined`);
  if (/Online estimate bonus|Book before September 30/i.test(html)) throw new Error(`${route.slug} retains a dated promotion`);
}

for (const [routeUrl, authority] of Object.entries(calgaryEdmontonRoutes)) {
  const route = routeCopy[routeUrl];
  const file = join(root, route.slug, "index.html");
  let html = await readFile(file, "utf8");
  html = replaceMeta(html, routeUrl, route);
  html = html.replace(/<link rel="stylesheet" href="\/assets\/step35-calgary-edmonton\.css"[^>]*>/g, "");
  html = html.replace(/<\/head>/i, `${asset}</head>`);
  html = html.replace(/<script defer src="\/assets\/step35-calgary-edmonton\.js"[^>]*><\/script>/g, "");
  html = html.replace(/<\/body>/i, `${runtime}</body>`);
  html = html.replace(/<script\b[^>]*id="faq-schema"[^>]*>[\s\S]*?<\/script>/i, faqSchema(route));
  html = html.replace(/<main\b[^>]*(?:data-pcm-step35-route="[^"]*"|data-loc="client\/src\/components\/SiteLayout\.tsx:17")[^>]*>[\s\S]*?<\/main>/i, main(route, authority.facts));
  const priceBlock = pricing(route, authority.facts);
  if (/\s*<section class="pcm-pricing-summary" data-pcm-step35-pricing=[\s\S]*?<\/section>/.test(html)) {
    html = html.replace(/\s*<section class="pcm-pricing-summary" data-pcm-step35-pricing=[\s\S]*?<\/section>/, priceBlock);
  } else {
    const layout = '<div data-loc="client/src/components/SiteLayout.tsx:13"';
    if (!html.includes(layout)) throw new Error(`${route.slug} has no static SiteLayout boundary`);
    html = html.replace(layout, `${priceBlock}${layout}`);
  }
  html = html.replace("Get a Edmonton to Calgary quote.", "Get an Edmonton to Calgary quote.");
  html = html.replaceAll("Valuation coverage available", "Declared Value Protection available");
  html = html.replace(/<div class="pcm-estimate-bonus">[\s\S]*?<\/span><\/div><\/div>/g, "");
  assertCanonical(html, route, authority.facts);
  await writeFile(file, html, "utf8");
  console.log(`Finalized Step 35 static route: ${routeUrl}`);
}
