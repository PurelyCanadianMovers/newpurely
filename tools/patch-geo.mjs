#!/usr/bin/env node
// patch-geo.mjs — GEO/AI-search injector for the static site copy.
//
// What it does (idempotent — safe to re-run):
//   1. Adds a sitewide MovingCompany + Organization + WebSite JSON-LD @graph
//      (id="pcm-org-graph", @id ".../#organization") to EVERY route shell so
//      Service-schema `provider` references resolve and every page carries a
//      crawlable business entity (NAP, geo, sameAs).
//   2. For pages that are still empty React shells, injects: unique
//      title/description/OG/Twitter/geo, a visible crawlable content <section>
//      (matching the existing .pcm-local-seo pattern), plus Service +
//      BreadcrumbList + FAQPage JSON-LD.
//   3. Pages already patched (they contain data-pcm-static-local-seo) keep their
//      bespoke content and only receive the sitewide org graph.
//
// Usage:
//   node tools/patch-geo.mjs site-copy            # patch everything
//   node tools/patch-geo.mjs site-copy --dry      # report only, write nothing
//   node tools/patch-geo.mjs site-copy surrey/    # limit to matching path(s)

import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

// ---------------------------------------------------------------------------
// Business facts. VERIFY the address against the live Google Business Profile
// before deploying — sourced from the Yelp/BBB listing.
// ---------------------------------------------------------------------------
const SITE = {
  base: "https://purelycanadianmovers.com",
  orgId: "https://purelycanadianmovers.com/#organization",
  websiteId: "https://purelycanadianmovers.com/#website",
  legalName: "Purely Canadian Movers Inc.",
  name: "Purely Canadian Movers",
  phone: "+1-877-485-6683",
  localPhone: "+1-604-522-7222",
  email: "esales@pcmovers.ca",
  founded: "1991",
  street: "Unit 16, 91 Golden Drive", // VERIFY
  city: "Coquitlam",
  region: "BC",
  postalCode: "V3K 6R2", // VERIFY
  country: "CA",
  lat: 49.2827,
  lng: -122.7932,
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/pcm-logo_e56ce780.png",
  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/hero-truck_dad4e475.png",
  sameAs: [
    "https://www.bbb.org/ca/bc/coquitlam/profile/moving-companies/purely-canadian-movers-inc-0037-135934",
    "https://www.yelp.ca/biz/purely-canadian-movers-coquitlam-2",
    "https://www.homestars.com/profile/2695847-purely-canadian-movers-inc/reviews",
  ],
  // Set to e.g. { ratingValue: "4.6", reviewCount: "120" } ONLY once the matching
  // reviews are rendered on /testimonials/. Left null to avoid invented markup.
  aggregateRating: null,
};

const METRO = [
  "Coquitlam", "Port Coquitlam", "Port Moody", "Burnaby", "Vancouver", "Surrey",
  "Langley", "Maple Ridge", "New Westminster", "North Vancouver", "Richmond",
  "Delta", "White Rock", "Abbotsford",
];

function orgGraph() {
  const node = {
    "@type": "MovingCompany",
    "@id": SITE.orgId,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.base + "/",
    logo: { "@type": "ImageObject", url: SITE.logo },
    image: SITE.image,
    description:
      "Family-owned moving company serving Metro Vancouver since 1991. Local, " +
      "long-distance, cross-country, and cross-border moves with our own crews — " +
      "no subcontractors. Authorized agent of Great Canadian Van Lines. BBB Accredited.",
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: SITE.founded,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.street,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode,
      addressCountry: SITE.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.lat, longitude: SITE.lng },
    areaServed: [
      ...METRO.map((name) => ({ "@type": "City", name })),
      { "@type": "AdministrativeArea", name: "British Columbia" },
      { "@type": "Country", name: "Canada" },
    ],
    memberOf: { "@type": "Organization", name: "Great Canadian Van Lines" },
    sameAs: SITE.sameAs,
  };
  if (SITE.aggregateRating) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: SITE.aggregateRating.ratingValue,
      reviewCount: SITE.aggregateRating.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      node,
      {
        "@type": "WebSite",
        "@id": SITE.websiteId,
        url: SITE.base + "/",
        name: SITE.name,
        publisher: { "@id": SITE.orgId },
        inLanguage: "en-CA",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Route cost/transit data (CAD) — mirrors the chatbot table in src/index.js.
// ---------------------------------------------------------------------------
const COST = {
  "vancouver-toronto": ["9-22 days", "$2,500", "$4,700", "$6,500", "$10,000", "$15,000"],
  "vancouver-ottawa": ["11-22 days", "$2,500", "$4,700", "$6,500", "$10,000", "$15,000"],
  "vancouver-calgary": ["4-13 days", "$2,000", "$2,600", "$3,500", "$4,800", "$6,500"],
  "vancouver-edmonton": ["4-13 days", "$2,200", "$2,800", "$3,800", "$5,200", "$7,000"],
  "vancouver-montreal": ["10-22 days", "$2,500", "$4,700", "$6,400", "$10,000", "$15,000"],
  "vancouver-halifax": ["12-24 days", "$3,000", "$5,300", "$7,000", "$11,000", "$16,000"],
  "toronto-calgary": ["7-19 days", "$2,500", "$3,800", "$6,400", "$10,000", "$15,000"],
  "toronto-edmonton": ["7-18 days", "$2,500", "$3,800", "$6,400", "$10,000", "$15,000"],
  "toronto-montreal": ["2-5 days", "$2,300", "$3,900", "$5,200", "$8,300", "$12,000"],
  "toronto-ottawa": ["2-4 days", "$800", "$1,100", "$1,500", "$2,000", "$2,800"],
  "ottawa-calgary": ["7-19 days", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  "ottawa-edmonton": ["7-19 days", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  "montreal-calgary": ["8-20 days", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  "montreal-edmonton": ["8-20 days", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  "calgary-edmonton": ["2-4 days", "$800", "$1,100", "$1,500", "$2,000", "$2,800"],
  "halifax-toronto": ["5-12 days", "$2,200", "$2,900", "$3,900", "$5,300", "$7,000"],
  "victoria-vancouver": ["1-3 days", "$1,200", "$1,600", "$2,200", "$3,000", "$4,200"],
};
function costFor(from, to) {
  return COST[`${from}-${to}`] || COST[`${to}-${from}`] || null;
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Use a function replacer everywhere so `$`-sequences in replacement content
// (e.g. "$1,100", "$$") are never interpreted as replacement patterns.
function replaceMeta(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, () => replacement) : html;
}

function setHead(html, { title, description, geoPlace }) {
  if (title) {
    html = replaceMeta(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = replaceMeta(html, /<meta property="og:title" content="[\s\S]*?"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`);
    html = replaceMeta(html, /<meta name="twitter:title" content="[\s\S]*?"\s*\/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  }
  if (description) {
    html = replaceMeta(html, /<meta name="description" content="[\s\S]*?"\s*\/>/, `<meta name="description" content="${esc(description)}" />`);
    html = replaceMeta(html, /<meta property="og:description" content="[\s\S]*?"\s*\/>/, `<meta property="og:description" content="${esc(description)}" />`);
    html = replaceMeta(html, /<meta name="twitter:description" content="[\s\S]*?"\s*\/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  }
  if (geoPlace) {
    html = replaceMeta(html, /<meta name="geo.placename" content="[\s\S]*?"\s*\/>/, `<meta name="geo.placename" content="${esc(geoPlace)}" />`);
  }
  return html;
}

// Insert or replace a JSON-LD <script> in <head>, keyed by an id.
function upsertHeadJsonLd(html, id, obj) {
  const block = `<script type="application/ld+json" id="${id}">${JSON.stringify(obj)}</script>`;
  const existing = new RegExp(`<script type="application/ld\\+json" id="${id}">[\\s\\S]*?</script>`);
  if (existing.test(html)) return html.replace(existing, () => block);
  return html.replace(/<\/head>/, () => `  ${block}\n</head>`);
}

// Insert or replace the visible SEO content section after <div id="root"></div>.
function upsertBodySection(html, path, sectionHtml) {
  const marker = new RegExp(
    `<section class="pcm-lead-boost pcm-local-seo"[\\s\\S]*?data-pcm-static-local-seo="${path}"[\\s\\S]*?</section>`
  );
  const section = sectionHtml.trim();
  if (marker.test(html)) return html.replace(marker, () => section);
  return html.replace(/<div id="root"><\/div>/, (m) => `${m}\n${sectionHtml}`);
}

// A page counts as already-patched if it has prior structured data or an
// injected SEO section. Untouched React shells have neither. We only add the
// sitewide org graph to already-patched pages — never overwrite their work.
function hasBespokeContent(html) {
  return /application\/ld\+json/.test(html) || /data-pcm-static-local-seo=/.test(html);
}

// ---------------------------------------------------------------------------
// Content + schema builders
// ---------------------------------------------------------------------------
function serviceSchema({ path, name, serviceType, description, areaServed }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    url: SITE.base + path,
    description,
    provider: { "@id": SITE.orgId },
    areaServed: areaServed || [
      { "@type": "AdministrativeArea", name: "British Columbia" },
      { "@type": "Country", name: "Canada" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: SITE.base + "/contact/",
      servicePhone: SITE.phone,
    },
  };
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: SITE.base + t.path,
    })),
  };
}

function contentSection(path, spec) {
  const cards = (spec.cards || [])
    .map((c) => `<article><h3>${esc(c.h3)}</h3><p>${esc(c.p)}</p></article>`)
    .join("");
  const links = (spec.links || [])
    .map((l) => `<a href="${l.href}">${esc(l.label)}</a>`)
    .join("\n            ");
  const details = (spec.faqs || [])
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join("\n          ");
  return `    <section class="pcm-lead-boost pcm-local-seo" aria-label="${esc(spec.h1)}" data-pcm-static-local-seo="${path}">
      <div class="pcm-local-seo__inner">
        <h2>${esc(spec.h1)}</h2>
        <p>${esc(spec.intro)}</p>
        ${cards ? `<div class="pcm-local-seo__cards">${cards}</div>` : ""}
        ${links ? `<div class="pcm-local-seo__links">\n          <h2>${esc(spec.linksHeading || "Related moving services")}</h2>\n          <div>\n            ${links}\n          </div>\n        </div>` : ""}
        ${details ? `<div class="pcm-local-seo__faqs">\n          <h2>Frequently asked questions</h2>\n          ${details}\n        </div>` : ""}
      </div>
    </section>
`;
}

const HUB_LINKS = [
  { href: "/long-distance/", label: "Long-Distance Moving" },
  { href: "/local/", label: "Local Moving" },
  { href: "/long-distance-moving-cost-canada/", label: "Moving Cost Guide" },
  { href: "/packing/", label: "Packing Services" },
  { href: "/storage/", label: "Storage" },
  { href: "/valuation-coverage-protection/", label: "Valuation Coverage" },
  { href: "/great-canadian-vanlines-agent/", label: "Great Canadian Van Lines Agent" },
  { href: "/contact/", label: "Get a Free Estimate" },
];

const TRUST =
  "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, written estimates, and Great Canadian Van Lines agent support.";

// ---------------------------------------------------------------------------
// Spec generators per page family
// ---------------------------------------------------------------------------
function titleCase(token) {
  return token
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function routeSpec(path, fromTok, toTok) {
  const from = titleCase(fromTok);
  const to = titleCase(toTok);
  const c = costFor(fromTok, toTok);
  const priceLine = c
    ? `Typical ${from}-to-${to} estimates run about ${c[1]} for a studio, ${c[2]} for a 1-bedroom, ${c[3]} for a 2-bedroom, ${c[4]} for a 3-bedroom, and ${c[5]} for a 4+ bedroom home, with an estimated transit time of ${c[0]}.`
    : `Pricing depends on shipment weight or volume, access, packing, storage, season, and delivery timing — a written estimate is the most accurate way to price a ${from}-to-${to} move.`;
  const faqs = [
    {
      q: `How much does it cost to move from ${from} to ${to}?`,
      a: c
        ? `${from} to ${to} moves typically range from about ${c[1]} for a studio up to ${c[5]} for a 4+ bedroom home. Your written estimate depends on shipment weight, access, packing, storage, and delivery dates.`
        : `${from} to ${to} moving costs depend on shipment size and weight, access, packing, storage, and timing. Request a written estimate for an accurate, no-obligation price.`,
    },
    {
      q: `How long does a move from ${from} to ${to} take?`,
      a: c
        ? `Estimated transit time for ${from} to ${to} is ${c[0]}, depending on route, season, and your delivery window. We confirm an estimated delivery spread in writing before the move.`
        : `Transit time depends on distance, route, and season. We provide an estimated delivery window in writing before your ${from}-to-${to} move.`,
    },
    {
      q: `Do you use subcontractors for ${from} to ${to} moves?`,
      a: `No. Purely Canadian Movers keeps direct moving accountability and runs long-distance moves through the Great Canadian Van Lines network rather than handing your shipment to unknown movers.`,
    },
    {
      q: `Can packing and storage be included on a ${from} to ${to} move?`,
      a: `Yes. Full or partial packing, unpacking, short- or long-term storage, and valuation coverage options can all be added to your ${from}-to-${to} estimate.`,
    },
  ];
  return {
    title: `${from} to ${to} Movers | Cost, Transit Time & Quotes | Purely Canadian Movers`,
    description: `Long-distance movers for ${from} to ${to}: estimated costs by home size, transit times, packing, storage, and written quotes. Since 1991, BBB Accredited, no subcontractors.`,
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: `${from} to ${to} movers with written estimates`,
    intro: `Purely Canadian Movers handles long-distance moves from ${from} to ${to} with route-specific written estimates, professional packing, storage options, and valuation coverage — through the Great Canadian Van Lines network, with no broker handoff. ${priceLine}`,
    cards: [
      { h3: `${from} to ${to} cost & timing`, p: c ? `Estimated cost ${c[1]}–${c[5]} by home size; estimated transit ${c[0]}. Final pricing depends on weight or volume and services chosen.` : `Estimates are based on shipment weight or volume, access, packing, storage, and delivery timing.` },
      { h3: "Packing & access planning", p: "Full or partial packing, fragile crating, elevator and parking access, strata move windows, storage timing, and specialty items are reviewed before booking." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: `Related long-distance moving services`,
    faqs,
    service: { serviceType: "Long-Distance Moving Service", name: `${from} to ${to} Long-Distance Movers` },
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Long-Distance Moving", path: "/long-distance/" },
      { name: `${from} to ${to} Movers`, path },
    ],
  };
}

function localCitySpec(path, cityTok, kind) {
  const city = titleCase(cityTok);
  const label = kind === "office" ? "Office & commercial movers" : kind === "packing" ? "Packing services" : "Local movers";
  const svc = kind === "office" ? "Office Moving Service" : kind === "packing" ? "Packing Service" : "Local Moving Service";
  return {
    title: `${label} in ${city}, BC | Purely Canadian Movers`,
    description: `${label} in ${city}, BC from a family-owned company since 1991. ${kind === "packing" ? "Full and partial packing, fragile crating, and unpacking." : kind === "office" ? "Office, retail, and commercial relocations with minimal downtime." : "Homes, condos, and apartments with careful, accountable crews."} BBB Accredited, no subcontractors.`,
    geoPlace: `${city}, British Columbia, Canada`,
    h1: `${label} in ${city}, BC`,
    intro: `Purely Canadian Movers provides ${label.toLowerCase()} in ${city} and across Metro Vancouver with trained, accountable crews — no subcontractors. ${kind === "packing" ? "Packing, unpacking, fragile crating, and material supply can be booked on their own or added to a move." : kind === "office" ? "Office, retail, and commercial moves are planned around your schedule to minimize downtime." : "We handle houses, condos, townhomes, and apartments with written estimates and valuation coverage options."}`,
    cards: [
      { h3: `${city} ${kind === "packing" ? "packing" : "move"} planning`, p: "Condos, townhomes, detached homes, strata move windows, elevator bookings, parking, and loading access are reviewed before booking." },
      { h3: "What can be included", p: "Packing, unpacking, disassembly and reassembly, short- or long-term storage, and valuation coverage options." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: `Related ${city} moving services`,
    faqs: [
      { q: `Do you provide ${label.toLowerCase()} in ${city}, BC?`, a: `Yes. Purely Canadian Movers serves ${city} and the surrounding Metro Vancouver area with written estimates and direct accountability — no subcontractors.` },
      { q: `How much does a move in ${city} cost?`, a: `Local pricing depends on crew size, hours, access, stairs or elevators, and any packing or storage. A written estimate is the most accurate way to price your ${city} move.` },
      { q: `Can you handle packing and storage for a ${city} move?`, a: `Yes. Full or partial packing, unpacking, and short- or long-term storage can be included in your ${city} estimate.` },
      { q: `Do you use subcontractors in ${city}?`, a: `No. Your ${city} move is handled by Purely Canadian Movers' own trained crews for consistent accountability.` },
    ],
    service: { serviceType: svc, name: `${label} in ${city}, BC` },
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Local Moving", path: "/local/" },
      { name: `${city}`, path },
    ],
  };
}

function longDistanceCitySpec(path, cityTok) {
  const city = titleCase(cityTok);
  return {
    title: `Long-Distance Movers ${city} | Cross-Canada Quotes | Purely Canadian Movers`,
    description: `Long-distance movers serving ${city} for cross-Canada and Canada-USA moves: written estimates, packing, storage, and valuation coverage. Since 1991, BBB Accredited, no subcontractors.`,
    geoPlace: `${city}, Canada`,
    h1: `Long-distance movers serving ${city}`,
    intro: `Purely Canadian Movers coordinates long-distance moves to and from ${city} through the Great Canadian Van Lines network, with written estimates, packing, storage, and valuation coverage options — and no broker handoff to unknown movers.`,
    cards: [
      { h3: `${city} long-distance routes`, p: "Cross-Canada routes connecting Vancouver, Victoria, Calgary, Edmonton, Toronto, Ottawa, Montreal, Halifax, and other major cities." },
      { h3: "Cost & transit estimates", p: "Pricing and transit timing depend on shipment weight or volume, route distance, access, packing, storage, and season. See the cost guide for route ranges." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: `Related ${city} moving services`,
    faqs: [
      { q: `Do you provide long-distance movers in ${city}?`, a: `Yes. Purely Canadian Movers plans long-distance moves to and from ${city} across Canada with written estimates, packing, storage, and valuation coverage options.` },
      { q: `How much does a long-distance move from ${city} cost?`, a: `Cost depends on route, shipment size and weight, access, packing, storage, season, and delivery timing. A written estimate is the most accurate way to price the move.` },
      { q: `Do you use subcontractors for ${city} long-distance moves?`, a: `No. Long-distance moves run through the Great Canadian Van Lines national network rather than a broker handoff, keeping direct accountability.` },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: `Long-Distance Movers serving ${city}` },
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Long-Distance Moving", path: "/long-distance/" },
      { name: `${city}`, path },
    ],
  };
}

function cityHubSpec(path, cityTok) {
  const city = titleCase(cityTok);
  return {
    title: `Movers in ${city}, BC | Local & Long-Distance | Purely Canadian Movers`,
    description: `Movers in ${city}, BC for local, long-distance, and cross-country moves: written estimates, packing, storage, and valuation coverage. Family-owned since 1991, BBB Accredited, no subcontractors.`,
    geoPlace: `${city}, British Columbia, Canada`,
    h1: `Movers in ${city}, BC`,
    intro: `Purely Canadian Movers serves ${city} and the surrounding Metro Vancouver area with local moving, long-distance and cross-country moving, packing, and storage. Every ${city} move is handled by our own trained crews — no subcontractors — with written estimates and valuation coverage options.`,
    cards: [
      { h3: `${city} local moving`, p: `Homes, condos, townhomes, and apartments moved across ${city} and Metro Vancouver with careful, accountable crews.` },
      { h3: `${city} long-distance moving`, p: `Cross-Canada and Canada-USA moves from ${city} through the Great Canadian Van Lines network with route-specific estimates.` },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: `Related ${city} moving services`,
    faqs: [
      { q: `Do you provide movers in ${city}, BC?`, a: `Yes. Purely Canadian Movers serves ${city} for local moves and long-distance moves across Canada, with written estimates and direct accountability.` },
      { q: `How much does a move in ${city} cost?`, a: `Local pricing depends on crew size, hours, access, and any packing or storage; long-distance pricing depends on route and shipment size. A written estimate is the most accurate way to price your ${city} move.` },
      { q: `Do you handle long-distance moves from ${city}?`, a: `Yes. Long-distance and cross-country moves from ${city} run through the Great Canadian Van Lines network rather than a broker handoff.` },
    ],
    service: { serviceType: "Moving Service", name: `Movers in ${city}, BC` },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Local Moving", path: "/local/" }, { name: city, path }],
  };
}

const CITY_HUBS = new Set([
  "vancouver", "burnaby", "coquitlam", "delta", "langley", "maple-ridge",
  "new-westminster", "north-vancouver", "pitt-meadows", "port-coquitlam",
  "port-moody", "richmond", "surrey", "white-rock", "abbotsford",
]);

// Pages that only need a unique title/description + org graph (no SEO section).
const HEAD_ONLY = {
  "/accessibility/": { title: "Accessibility | Purely Canadian Movers", description: "Accessibility statement for Purely Canadian Movers, a family-owned Metro Vancouver moving company since 1991." },
  "/privacy-policy/": { title: "Privacy Policy | Purely Canadian Movers", description: "Privacy policy for Purely Canadian Movers, covering how estimate requests and contact information are handled." },
  "/terms/": { title: "Terms & Conditions | Purely Canadian Movers", description: "Terms and conditions for moving services provided by Purely Canadian Movers in Metro Vancouver and across Canada." },
  "/claims-support/": { title: "Claims Support | Purely Canadian Movers", description: "Claims support information for Purely Canadian Movers customers, including valuation coverage and how to start a claim." },
  "/estimate-booking-policy/": { title: "Estimate & Booking Policy | FAQs | Purely Canadian Movers", description: "How Purely Canadian Movers prepares written estimates and booking — deposits, dates, and what affects your moving price." },
};

// Bespoke specs for named info / money pages.
const CORE = {
  "/local/": {
    title: "Local Movers Metro Vancouver | Purely Canadian Movers",
    description: "Local movers across Metro Vancouver and the Lower Mainland since 1991. Homes, condos, and offices with written estimates, packing, and storage. BBB Accredited, no subcontractors.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Local movers across Metro Vancouver",
    intro: "Purely Canadian Movers provides local moving across Metro Vancouver and the Lower Mainland — Coquitlam, Burnaby, Vancouver, Surrey, Langley, Richmond, and beyond. Our own trained crews handle homes, condos, townhomes, and offices with written estimates, packing, storage, and valuation coverage options, and never subcontract your move.",
    cards: [
      { h3: "Metro Vancouver coverage", p: "Coquitlam, Port Coquitlam, Port Moody, Burnaby, Vancouver, Surrey, Langley, Maple Ridge, New Westminster, North Vancouver, Richmond, Delta, White Rock, and Abbotsford." },
      { h3: "Homes & offices", p: "Houses, condos, townhomes, apartments, and office relocations with careful, accountable crews." },
      { h3: "Direct mover, not a broker", p: "No subcontractors — your local move is handled by Purely Canadian Movers from estimate to delivery." },
    ],
    links: HUB_LINKS,
    linksHeading: "Local service areas",
    faqs: [
      { q: "What areas do you cover for local moves?", a: "We serve all of Metro Vancouver and the Lower Mainland, including Coquitlam, Burnaby, Vancouver, Surrey, Langley, Richmond, Delta, North Vancouver, New Westminster, Maple Ridge, Port Moody, Port Coquitlam, White Rock, and Abbotsford." },
      { q: "How much does a local move cost?", a: "Local moves are typically priced by crew size and hours, plus access, packing, and storage. A written estimate gives you an accurate, no-obligation price." },
      { q: "Do you use subcontractors for local moves?", a: "No. Local moves are handled by Purely Canadian Movers' own trained crews for consistent quality and accountability." },
    ],
    service: { serviceType: "Local Moving Service", name: "Local Moving in Metro Vancouver" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Local Moving", path: "/local/" }],
  },
  "/cross-country-movers/": {
    title: "Cross-Country Movers Canada | Purely Canadian Movers",
    description: "Cross-country movers from Metro Vancouver to anywhere in Canada. Written estimates, transit timing, packing, storage, and valuation coverage. Great Canadian Van Lines agent since 1991.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Cross-country movers across Canada",
    intro: "Purely Canadian Movers coordinates cross-country moves from Metro Vancouver to every province through the Great Canadian Van Lines network. You get route-specific written estimates, transit-time guidance, professional packing, storage, and valuation coverage — with direct accountability and no broker handoff.",
    cards: [
      { h3: "Coast-to-coast routes", p: "Vancouver and Victoria to Toronto, Ottawa, Montreal, Calgary, Edmonton, Halifax, and everywhere between." },
      { h3: "Cost & transit estimates", p: "Route-by-route cost ranges and estimated transit times are explained in our moving cost guide." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: "Popular cross-country routes",
    faqs: [
      { q: "How much does a cross-country move cost?", a: "Coast-to-coast moves typically range from about $2,500 for a studio to $15,000+ for a large home, depending on route, weight or volume, and services. See our cost guide for route ranges." },
      { q: "How long does a cross-country move take?", a: "Transit times range from a few days for nearby provinces to roughly 9–22 days for coast-to-coast routes, depending on distance, season, and delivery windows." },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: "Cross-Country Moving in Canada" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Long-Distance Moving", path: "/long-distance/" }, { name: "Cross-Country Movers", path: "/cross-country-movers/" }],
  },
  "/cross-country-moving-guide/": {
    title: "Cross-Country Moving Guide Canada | Purely Canadian Movers",
    description: "A practical cross-country moving guide for Canada: planning timelines, costs, transit times, packing, storage, and how written estimates work. From a family-owned mover since 1991.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Cross-country moving guide for Canada",
    intro: "Planning a cross-country move in Canada? This guide covers how moving costs and transit times work by route, when to book, how packing and storage fit in, and what a written estimate should include — so you can plan a coast-to-coast move with confidence.",
    cards: [
      { h3: "Plan your timeline", p: "Book early for summer and month-end moves; confirm delivery windows and access at both ends." },
      { h3: "Understand the cost", p: "Cross-country pricing is driven by shipment weight or volume, route distance, packing, storage, and season." },
      { h3: "Protect your belongings", p: "Valuation coverage options, professional packing, and fragile crating reduce risk on long routes." },
    ],
    links: HUB_LINKS,
    linksHeading: "Plan your move",
    faqs: [
      { q: "How far in advance should I book a cross-country move?", a: "Book several weeks ahead when possible, and earlier for summer or month-end dates, to secure your preferred pickup and delivery windows." },
      { q: "What affects the cost of a cross-country move?", a: "Shipment weight or volume, route distance, access conditions, packing, storage, season, and specialty items all affect the price; a written estimate confirms it." },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: "Cross-Country Moving Guide" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Long-Distance Moving", path: "/long-distance/" }, { name: "Cross-Country Moving Guide", path: "/cross-country-moving-guide/" }],
  },
  "/x-country/": {
    title: "Cross-Country Moving Canada | Purely Canadian Movers",
    description: "Cross-country moving from Metro Vancouver across Canada with written estimates, transit timing, packing, storage, and valuation coverage. Great Canadian Van Lines agent since 1991.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Cross-country moving across Canada",
    intro: "Purely Canadian Movers handles cross-country moves from Metro Vancouver to anywhere in Canada through the Great Canadian Van Lines network, with route-specific written estimates, packing, storage, and valuation coverage options — and no broker handoff to unknown movers.",
    cards: [
      { h3: "Nationwide routes", p: "Vancouver and Victoria to Toronto, Ottawa, Montreal, Calgary, Edmonton, Halifax, and beyond." },
      { h3: "Honest estimates", p: "Route-by-route cost ranges and transit estimates are explained in our moving cost guide." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: "Cross-country routes",
    faqs: [
      { q: "Do you handle cross-country moves?", a: "Yes. Purely Canadian Movers coordinates cross-country moves across Canada through the Great Canadian Van Lines network with written estimates and direct accountability." },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: "Cross-Country Moving" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Long-Distance Moving", path: "/long-distance/" }, { name: "Cross-Country Moving", path: "/x-country/" }],
  },
  "/overseas/": {
    title: "Overseas & International Movers | Purely Canadian Movers",
    description: "International and overseas movers: sealed container service, customs documentation, packing, storage, and insurance options. Family-owned since 1991, BBB Accredited.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Overseas & international moving",
    intro: "Purely Canadian Movers coordinates overseas and international moves with complete logistics: professional export packing, sealed container service with documentation, customs assistance, insurance options, storage, and final-destination delivery. We manage the full move so your belongings are protected from origin to destination.",
    cards: [
      { h3: "Sealed container service", p: "Secure container loading with complete documentation for international shipments." },
      { h3: "Customs & insurance", p: "Customs documentation assistance and insurance options for overseas moves." },
      { h3: "Door-to-door logistics", p: "Export packing, storage, shipping, and final-destination delivery coordinated end to end." },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "Do you handle international and overseas moves?", a: "Yes. Purely Canadian Movers coordinates overseas moves with export packing, sealed container service, customs documentation assistance, insurance options, and destination delivery." },
      { q: "How are overseas moves priced?", a: "International pricing depends on volume, destination, container service, customs, and insurance. A written estimate confirms the cost after reviewing your inventory and destination." },
    ],
    service: { serviceType: "Moving Service", name: "Overseas and International Moving" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Overseas Moving", path: "/overseas/" }],
  },
  "/great-canadian-vanlines-agent/": {
    title: "Great Canadian Van Lines Agent | Purely Canadian Movers",
    description: "Purely Canadian Movers is an authorized Great Canadian Van Lines agent — a national van line network for cross-Canada moves, not a broker handoff. Family-owned since 1991, BBB Accredited.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Authorized Great Canadian Van Lines agent",
    intro: "Purely Canadian Movers is an authorized agent of Great Canadian Van Lines, giving you a coordinated national van line network for cross-Canada moves — not a broker-style handoff to unknown movers. You keep direct accountability with a local, family-owned mover while gaining the reach of a Canada-wide network.",
    cards: [
      { h3: "National network", p: "Great Canadian Van Lines provides coordinated cross-Canada capacity, tracking, and delivery." },
      { h3: "Not a broker", p: "Your move is handled through the van line network, not auctioned off to the lowest-bid mover." },
      { h3: "Local accountability", p: "A family-owned Coquitlam mover manages your estimate, crew, and communication." },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "What does it mean that you are a Great Canadian Van Lines agent?", a: "It means cross-Canada moves run through the Great Canadian Van Lines national network with coordinated capacity and tracking, while a local family-owned mover keeps direct accountability for your move." },
      { q: "Is this different from a moving broker?", a: "Yes. Brokers resell your move to unknown carriers. As a van line agent, Purely Canadian Movers coordinates your move through an established national network with direct accountability." },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: "Great Canadian Van Lines Agent Services" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Long-Distance Moving", path: "/long-distance/" }, { name: "Great Canadian Van Lines Agent", path: "/great-canadian-vanlines-agent/" }],
  },
  "/our-network/": {
    title: "Our Moving Network | Great Canadian Van Lines | Purely Canadian Movers",
    description: "Purely Canadian Movers' national moving network through Great Canadian Van Lines connects Metro Vancouver to cross-Canada and Canada-USA routes. Family-owned since 1991, BBB Accredited.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Our national moving network",
    intro: "As a Great Canadian Van Lines agent, Purely Canadian Movers combines a local, family-owned operation with a coordinated national van line network. That network supports cross-Canada and Canada-USA moves with capacity, tracking, and delivery — while you keep direct accountability with your local mover.",
    cards: [
      { h3: "Coast-to-coast reach", p: "Coordinated routes connecting Metro Vancouver with every Canadian province and U.S. destinations." },
      { h3: "Coordinated delivery", p: "Network capacity and scheduling for reliable transit timing on long routes." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "How does your moving network work?", a: "Cross-Canada and cross-border moves run through the Great Canadian Van Lines network for capacity and tracking, while Purely Canadian Movers manages your estimate, crew, and communication locally." },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: "National Moving Network" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Our Network", path: "/our-network/" }],
  },
  "/how-to-choose-a-mover/": {
    title: "How to Choose a Mover in Canada | Checklist | Purely Canadian Movers",
    description: "How to choose a moving company in Canada: check licensing, BBB accreditation, written estimates, valuation coverage, and whether they subcontract. Tips from a family-owned mover since 1991.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "How to choose a mover in Canada",
    intro: "Choosing the right moving company protects your belongings and your budget. Look for a licensed, BBB-Accredited mover that provides written estimates, offers valuation coverage, uses its own crews rather than subcontractors, and has verifiable reviews. This checklist helps you compare movers and avoid cheap quotes that hide costs.",
    cards: [
      { h3: "Check credentials", p: "Confirm licensing, BBB accreditation, insurance, and verifiable reviews across Google, Yelp, and HomeStars." },
      { h3: "Demand a written estimate", p: "Insist on a written estimate that accounts for weight or volume, access, packing, storage, and valuation coverage." },
      { h3: "Avoid broker traps", p: "Ask whether the company uses its own crews or subcontracts; broker quotes can change after pickup." },
    ],
    links: HUB_LINKS,
    linksHeading: "Plan your move",
    faqs: [
      { q: "How do I know if a mover is legitimate?", a: "Check for licensing, BBB accreditation, a real address and phone, verifiable reviews, and a clear written estimate. Be cautious of unusually low quotes and brokers that subcontract your move." },
      { q: "Why are some moving quotes so cheap?", a: "Very low quotes often come from brokers or underestimate weight, access, and services, then add charges later. A detailed written estimate from a direct mover avoids surprises." },
    ],
    service: { serviceType: "Moving Service", name: "How to Choose a Mover" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "How to Choose a Mover", path: "/how-to-choose-a-mover/" }],
  },
  "/corporate-moves-employee-relocation-in-coquitlam-bc/": {
    title: "Corporate Moves & Employee Relocation Coquitlam, BC | Purely Canadian Movers",
    description: "Corporate moves and employee relocation in Coquitlam and Metro Vancouver. Office moves, staff relocations, and cross-Canada transfers with written estimates. Family-owned since 1991.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Corporate moves & employee relocation in Coquitlam, BC",
    intro: "Purely Canadian Movers supports corporate moves and employee relocations in Coquitlam and across Metro Vancouver — from office relocations to staff transfers across Canada. We provide written estimates, scheduling around your business, packing, storage, and valuation coverage, all handled by our own crews and the Great Canadian Van Lines network.",
    cards: [
      { h3: "Office relocation", p: "Workstations, IT, furniture, and records moved efficiently with minimal downtime." },
      { h3: "Employee relocation", p: "Local and cross-Canada staff transfers coordinated with written estimates and clear timing." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "Do you handle corporate and employee relocations?", a: "Yes. Purely Canadian Movers supports office moves and employee relocations in Coquitlam and Metro Vancouver, plus cross-Canada transfers through the Great Canadian Van Lines network." },
      { q: "Can you schedule corporate moves around business hours?", a: "Yes. Office and corporate moves can be scheduled after hours or on weekends to minimize disruption." },
    ],
    service: { serviceType: "Office Moving Service", name: "Corporate Moves and Employee Relocation" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Office Moving", path: "/office/" }, { name: "Corporate Moves & Employee Relocation", path: "/corporate-moves-employee-relocation-in-coquitlam-bc/" }],
  },
  "/bc-to-washington-movers/": {
    title: "BC to Washington Movers | Cross-Border Moving | Purely Canadian Movers",
    description: "Cross-border movers from BC to Washington State: customs documentation, packing, storage, and valuation coverage. Family-owned since 1991, BBB Accredited, Great Canadian Van Lines agent.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "BC to Washington cross-border movers",
    intro: "Purely Canadian Movers coordinates cross-border moves from British Columbia to Washington State and beyond, including customs documentation guidance, professional packing, storage, and valuation coverage options. As a Great Canadian Van Lines agent, we manage the logistics from pickup in BC to delivery in the USA.",
    cards: [
      { h3: "BC to USA routes", p: "Cross-border moves from Metro Vancouver and the Lower Mainland to Washington State and other U.S. destinations." },
      { h3: "Customs & documentation", p: "Guidance on customs paperwork and inventory required for cross-border shipments." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "Do you move from BC to Washington State?", a: "Yes. Purely Canadian Movers coordinates cross-border moves from BC to Washington and other U.S. destinations with customs documentation guidance, packing, and storage." },
      { q: "What paperwork is needed to move to the USA?", a: "Cross-border moves require customs documentation and a detailed inventory. We guide you through the paperwork and coordinate pickup and delivery." },
    ],
    service: { serviceType: "Moving Service", name: "BC to Washington Cross-Border Moving" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Canada-USA Moving", path: "/canada-usa/" }, { name: "BC to Washington Movers", path: "/bc-to-washington-movers/" }],
  },
  "/": {
    title: "Purely Canadian Movers | Professional Moving Company Vancouver BC Since 1991",
    description: "Family-owned moving company serving Metro Vancouver since 1991. Local, long-distance, cross-country, and Canada-USA moves. No subcontractors. BBB Accredited. Call 1-877-485-6683.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Family-owned movers in Metro Vancouver since 1991",
    intro: "Purely Canadian Movers is a family-owned moving company based in Coquitlam, BC, serving Metro Vancouver and the Lower Mainland with local moves, and all of Canada and Canada-USA routes with long-distance moving. Every move is handled by our own trained crews — no subcontractors — with written estimates, valuation coverage options, and Great Canadian Van Lines agent support for cross-Canada moves.",
    cards: [
      { h3: "Local moving", p: "Homes, condos, townhomes, and apartments across Coquitlam, Burnaby, Vancouver, Surrey, Langley, and Metro Vancouver." },
      { h3: "Long-distance & cross-country", p: "Cross-Canada and Canada-USA moves through the Great Canadian Van Lines network with route-specific estimates and transit timing." },
      { h3: "Packing, storage & protection", p: "Full or partial packing, fragile crating, short- and long-term storage, and valuation coverage options." },
    ],
    links: [
      { href: "/local/", label: "Local Moving" },
      { href: "/long-distance/", label: "Long-Distance Moving" },
      { href: "/long-distance-moving-cost-canada/", label: "Moving Cost Guide" },
      { href: "/packing/", label: "Packing Services" },
      { href: "/storage/", label: "Storage" },
      { href: "/canada-usa/", label: "Canada-USA Moving" },
      { href: "/testimonials/", label: "Testimonials" },
      { href: "/contact/", label: "Get a Free Estimate" },
    ],
    linksHeading: "Explore moving services",
    faqs: [
      { q: "What areas do Purely Canadian Movers serve?", a: "We serve Metro Vancouver and the Lower Mainland for local moves — including Coquitlam, Port Coquitlam, Port Moody, Burnaby, Vancouver, Surrey, Langley, Maple Ridge, New Westminster, North Vancouver, Richmond, Delta, White Rock, and Abbotsford — plus long-distance routes across Canada and to the USA." },
      { q: "Do you use subcontractors?", a: "No. Local moves are handled by our own trained crews, and long-distance moves run through the Great Canadian Van Lines network rather than a broker handoff to unknown movers." },
      { q: "How long has Purely Canadian Movers been in business?", a: "We are a family-owned company operating since 1991, BBB Accredited, based in Coquitlam, BC." },
      { q: "How do I get a moving estimate?", a: "Call 1-877-485-6683 or request a free, no-obligation written estimate on our contact page. Estimates consider your inventory, route, access, packing, and storage needs." },
    ],
    service: { serviceType: "Moving Service", name: "Residential and Long-Distance Moving" },
    breadcrumb: [{ name: "Home", path: "/" }],
  },
  "/about/": {
    title: "About Purely Canadian Movers | Family-Owned Since 1991",
    description: "Learn about Purely Canadian Movers — a family-owned Coquitlam moving company since 1991. Own crews, no subcontractors, BBB Accredited, Great Canadian Van Lines agent.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "About Purely Canadian Movers",
    intro: "Purely Canadian Movers is a family-owned moving company founded in 1991 and based in Coquitlam, British Columbia. For more than three decades we have moved households and businesses across Metro Vancouver, Canada, and to the USA — using our own trained crews rather than subcontractors, so accountability stays with us from the first estimate to final delivery.",
    cards: [
      { h3: "30+ years of experience", p: "Operating since 1991 with deep experience in local, long-distance, cross-country, and cross-border moves." },
      { h3: "Own crews, direct accountability", p: "No subcontractors and no broker handoffs — your move is handled by Purely Canadian Movers and the Great Canadian Van Lines network." },
      { h3: "Accredited & protected", p: "BBB Accredited with valuation coverage options and written estimates on every move." },
    ],
    links: HUB_LINKS,
    linksHeading: "Learn more",
    faqs: [
      { q: "Who owns Purely Canadian Movers?", a: "Purely Canadian Movers is a family-owned and operated company based in Coquitlam, BC, in business since 1991." },
      { q: "Is Purely Canadian Movers BBB Accredited?", a: "Yes. Purely Canadian Movers is BBB Accredited and maintains a strong service reputation across review platforms." },
      { q: "Does Purely Canadian Movers use subcontractors?", a: "No. Moves are handled by our own trained crews, with the Great Canadian Van Lines network supporting cross-Canada routes." },
    ],
    service: { serviceType: "Moving Service", name: "About Purely Canadian Movers" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "About", path: "/about/" }],
  },
  "/services/": {
    title: "Moving Services in Metro Vancouver | Purely Canadian Movers",
    description: "Local, long-distance, cross-country, office, packing, and storage moving services from Purely Canadian Movers. Family-owned since 1991, BBB Accredited, no subcontractors.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Moving services from Purely Canadian Movers",
    intro: "Purely Canadian Movers offers a full range of residential and commercial moving services across Metro Vancouver and Canada: local moving, long-distance and cross-country moving, Canada-USA moves, office and commercial relocation, professional packing, and secure storage — all handled by our own crews with written estimates and valuation coverage options.",
    cards: [
      { h3: "Local & long-distance", p: "Metro Vancouver local moves plus cross-Canada and Canada-USA long-distance moving through the Great Canadian Van Lines network." },
      { h3: "Office & commercial", p: "Office, retail, and corporate relocations planned around your schedule to minimize downtime." },
      { h3: "Packing & storage", p: "Full or partial packing, fragile crating, unpacking, and short- or long-term storage." },
    ],
    links: HUB_LINKS,
    linksHeading: "Browse services",
    faqs: [
      { q: "What moving services do you offer?", a: "Local moving, long-distance and cross-country moving, Canada-USA moves, office and commercial moves, packing and unpacking, fragile crating, and storage." },
      { q: "Do you offer packing and storage as add-ons?", a: "Yes. Packing, unpacking, and short- or long-term storage can be booked on their own or added to any local or long-distance move." },
      { q: "Are your services available for offices and businesses?", a: "Yes. We handle office, retail, and commercial relocations with planning to minimize downtime." },
    ],
    service: { serviceType: "Moving Service", name: "Residential and Commercial Moving Services" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }],
  },
  "/testimonials/": {
    title: "Customer Reviews & Testimonials | Purely Canadian Movers",
    description: "Read why Metro Vancouver and cross-Canada customers choose Purely Canadian Movers — careful crews, honest estimates, no subcontractors. Family-owned since 1991, BBB Accredited.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "What customers say about Purely Canadian Movers",
    intro: "For more than 30 years, Metro Vancouver and cross-Canada customers have trusted Purely Canadian Movers for careful crews, honest written estimates, and direct accountability with no subcontractors. We maintain a strong reputation across the BBB, Google, Yelp, and HomeStars.",
    cards: [
      { h3: "Honest estimates", p: "Customers frequently note moves that come in at or below the written estimate." },
      { h3: "Careful, accountable crews", p: "Our own trained crews protect furniture, floors, and walls — no subcontractors." },
      { h3: "Trusted reputation", p: "BBB Accredited since the 1990s with positive reviews across Google, Yelp, and HomeStars." },
    ],
    links: HUB_LINKS,
    linksHeading: "Ready to move?",
    faqs: [
      { q: "Where can I read Purely Canadian Movers reviews?", a: "You can find reviews on Google, Yelp, HomeStars, and the Better Business Bureau, where Purely Canadian Movers is Accredited." },
      { q: "Is Purely Canadian Movers reliable for long-distance moves?", a: "Yes. Long-distance moves run through the Great Canadian Van Lines network with written estimates and direct accountability rather than broker handoffs." },
    ],
    service: { serviceType: "Moving Service", name: "Purely Canadian Movers Customer Testimonials" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Testimonials", path: "/testimonials/" }],
  },
  "/contact/": {
    title: "Contact Purely Canadian Movers | Free Moving Estimate",
    description: "Contact Purely Canadian Movers for a free, no-obligation moving estimate. Call 1-877-485-6683 or email esales@pcmovers.ca. Family-owned Coquitlam movers since 1991.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Contact Purely Canadian Movers",
    intro: "Request a free, no-obligation moving estimate from Purely Canadian Movers. Call 1-877-485-6683 (or 604-522-7222 locally), email esales@pcmovers.ca, or use the estimate form. We serve Metro Vancouver for local moves and all of Canada and the USA for long-distance moves.",
    cards: [
      { h3: "Phone", p: "Toll-free 1-877-485-6683 or local 604-522-7222 for estimates and booking questions." },
      { h3: "Email", p: "esales@pcmovers.ca for written estimates, inventory details, and move dates." },
      { h3: "Service area", p: "Metro Vancouver and the Lower Mainland locally; cross-Canada and Canada-USA for long-distance." },
    ],
    links: HUB_LINKS,
    linksHeading: "Before you book",
    faqs: [
      { q: "How do I get a moving quote?", a: "Call 1-877-485-6683 or submit the estimate form with your move date, origin, destination, home size, and inventory details for a free written estimate." },
      { q: "What are your contact details?", a: "Phone 1-877-485-6683 (toll-free) or 604-522-7222 (local), email esales@pcmovers.ca. The office is based in Coquitlam, BC." },
    ],
    service: { serviceType: "Moving Service", name: "Free Moving Estimate" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }],
  },
  "/long-distance/": {
    title: "Long-Distance Movers Canada | Cross-Country Moving | Purely Canadian Movers",
    description: "Long-distance and cross-country movers from Metro Vancouver since 1991. Written estimates, packing, storage, valuation coverage, and Great Canadian Van Lines network. No subcontractors.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Long-distance movers across Canada",
    intro: "Purely Canadian Movers handles long-distance and cross-country moves from Metro Vancouver to anywhere in Canada — and Canada-USA routes — through the Great Canadian Van Lines national network. You get route-specific written estimates, transit-time guidance, packing, storage, and valuation coverage options, with no broker handoff to unknown movers.",
    cards: [
      { h3: "Cross-Canada routes", p: "Vancouver and Victoria to Toronto, Ottawa, Montreal, Calgary, Edmonton, Halifax, and back — plus inter-city routes nationwide." },
      { h3: "Honest cost & transit estimates", p: "See route-by-route cost ranges and estimated transit times in our moving cost guide." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: "Popular long-distance routes",
    faqs: [
      { q: "How much does a long-distance move in Canada cost?", a: "Cross-Canada costs vary widely by route and home size — roughly $2,000–$2,800 for short interprovincial moves up to $15,000+ for large cross-country shipments. See our cost guide for route ranges." },
      { q: "How long does a cross-Canada move take?", a: "Transit times range from a few days for nearby provinces to roughly 9–22 days for coast-to-coast routes, depending on distance, season, and delivery windows." },
      { q: "Do you broker long-distance moves to other companies?", a: "No. Long-distance moves run through the Great Canadian Van Lines network with direct accountability rather than a broker-style handoff." },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: "Long-Distance and Cross-Country Moving" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Long-Distance Moving", path: "/long-distance/" }],
  },
  "/long-distance-moving-cost-canada/": {
    title: "Long-Distance Moving Cost Canada | Route Price Guide | Purely Canadian Movers",
    description: "See long-distance moving cost ranges in Canada by route and home size, plus estimated transit times. Written estimates from a family-owned mover since 1991. BBB Accredited.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Long-distance moving cost guide for Canada",
    intro: "How much does a long-distance move in Canada cost? Pricing depends on the route, home size, shipment weight or volume, access, packing, storage, season, and delivery timing. The ranges below give realistic CAD estimates by route and home size — your written estimate confirms the exact price with no obligation.",
    cards: [
      { h3: "Vancouver ↔ Toronto", p: "About $2,500 (studio) to $15,000 (4+ bedroom); estimated transit 9–22 days." },
      { h3: "Vancouver ↔ Calgary", p: "About $2,000 (studio) to $6,500 (4+ bedroom); estimated transit 4–13 days." },
      { h3: "Toronto ↔ Montreal", p: "About $2,300 (studio) to $12,000 (4+ bedroom); estimated transit 2–5 days." },
    ],
    links: HUB_LINKS,
    linksHeading: "Plan your move",
    faqs: [
      { q: "How much does a long-distance move cost in Canada?", a: "Most cross-Canada moves range from about $2,000 for a small interprovincial move to $15,000+ for a large coast-to-coast shipment. Cost depends on route, home size, weight or volume, access, packing, storage, and timing." },
      { q: "What is included in a long-distance moving estimate?", a: "A written estimate accounts for shipment weight or volume, route distance, access conditions, packing, storage, valuation coverage, and specialty items — so there are no surprises on moving day." },
      { q: "Why do moving costs vary so much by route?", a: "Distance, fuel, transit time, seasonal demand, and shipment size all affect price. Short routes like Calgary–Edmonton cost far less than coast-to-coast routes like Vancouver–Halifax." },
    ],
    service: { serviceType: "Long-Distance Moving Service", name: "Long-Distance Moving Cost Estimates" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Long-Distance Moving", path: "/long-distance/" }, { name: "Moving Cost Guide", path: "/long-distance-moving-cost-canada/" }],
  },
  "/packing/": {
    title: "Professional Packing Services Vancouver | Purely Canadian Movers",
    description: "Professional packing services in Metro Vancouver: full and partial packing, fragile crating, unpacking, and materials. Family-owned since 1991, BBB Accredited, no subcontractors.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Professional packing services",
    intro: "Purely Canadian Movers offers full and partial packing, custom crating for fragile and high-value items, unpacking, and packing materials across Metro Vancouver. Packing can be booked on its own or added to any local or long-distance move, with the same trained crews and direct accountability.",
    cards: [
      { h3: "Full or partial packing", p: "Pack your whole home or just the fragile, bulky, or high-value items you want handled professionally." },
      { h3: "Fragile crating", p: "Custom crating and protection for art, glass, electronics, and specialty items." },
      { h3: "Unpacking & materials", p: "Unpacking at destination plus boxes, paper, and protective materials supplied as needed." },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "Do you offer full and partial packing?", a: "Yes. You can choose full-service packing for the whole home or partial packing for fragile, bulky, or high-value items only." },
      { q: "Can packing be added to a long-distance move?", a: "Yes. Packing, crating, and unpacking can be included in any local or long-distance moving estimate." },
    ],
    service: { serviceType: "Packing Service", name: "Professional Packing Services" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Packing", path: "/packing/" }],
  },
  "/storage/": {
    title: "Moving Storage Vancouver | Short & Long-Term | Purely Canadian Movers",
    description: "Short- and long-term moving storage in Metro Vancouver. Secure storage between moves, with packing and valuation coverage options. Family-owned since 1991, BBB Accredited.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Short- and long-term moving storage",
    intro: "Need storage between moves? Purely Canadian Movers offers secure short- and long-term storage as part of a local or long-distance move, with professional handling, inventory tracking, and valuation coverage options. Storage timing and pricing are confirmed in your written estimate.",
    cards: [
      { h3: "Short-term storage", p: "Bridge gaps between closing dates or possession days with secure short-term storage." },
      { h3: "Long-term storage", p: "Longer storage for renovations, relocations, or staged moves, with careful handling." },
      { h3: "Integrated with your move", p: "Storage pairs with packing, valuation coverage, and delivery scheduling on one estimate." },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "Do you offer short- and long-term storage?", a: "Yes. Secure short- and long-term storage can be included in a local or long-distance moving estimate." },
      { q: "How is storage priced?", a: "Storage pricing depends on volume, duration, access, and whether it is combined with packing or a move. A written estimate confirms the cost." },
    ],
    service: { serviceType: "Storage Service", name: "Moving Storage Services" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Storage", path: "/storage/" }],
  },
  "/office/": {
    title: "Office & Commercial Movers Vancouver | Purely Canadian Movers",
    description: "Office and commercial movers in Metro Vancouver. Retail, corporate, and employee relocations planned to minimize downtime. Family-owned since 1991, BBB Accredited, no subcontractors.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Office & commercial moving services",
    intro: "Purely Canadian Movers handles office, retail, and commercial relocations across Metro Vancouver with planning that minimizes downtime. From workstations and IT equipment to records and furniture, our own crews manage the move with written estimates, scheduling around your business hours, and valuation coverage options.",
    cards: [
      { h3: "Office & retail moves", p: "Workstations, furniture, IT, and records relocated efficiently with minimal disruption." },
      { h3: "Schedule-friendly", p: "After-hours and weekend moves planned to keep your business running." },
      { h3: "Corporate relocation", p: "Employee and corporate relocations supported locally and across Canada." },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "Do you move offices and businesses?", a: "Yes. We handle office, retail, and commercial relocations across Metro Vancouver, planned to minimize downtime." },
      { q: "Can you move offices after hours?", a: "Yes. Office moves can be scheduled after hours or on weekends to reduce disruption to your business." },
    ],
    service: { serviceType: "Office Moving Service", name: "Office and Commercial Moving" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Office Moving", path: "/office/" }],
  },
  "/canada-usa/": {
    // Title/description match the "Improve Canada-USA moving guide" commit on main.
    title: "Canada-USA Movers | Cross-Border Moving from Canada to the U.S.",
    description: "Canada-USA movers for cross-border household moves, customs paperwork planning, packing, storage, valuation coverage, and written estimates. Family-owned since 1991.",
    geoPlace: "Coquitlam, British Columbia, Canada",
    h1: "Canada-USA cross-border movers",
    intro: "Purely Canadian Movers coordinates cross-border moves between Canada and the United States, including customs documentation guidance, professional packing, storage, and valuation coverage options. As a Great Canadian Van Lines agent, we combine local accountability with the network needed for cross-border logistics.",
    cards: [
      { h3: "Cross-border logistics", p: "Coordinated pickup, customs documentation guidance, and delivery between Canada and the USA." },
      { h3: "Packing & protection", p: "Professional packing, crating, and valuation coverage options for cross-border shipments." },
      { h3: "Trust proof", p: TRUST },
    ],
    links: HUB_LINKS,
    linksHeading: "Related services",
    faqs: [
      { q: "Do you handle Canada-USA cross-border moves?", a: "Yes. Purely Canadian Movers coordinates Canada-USA moves with customs documentation guidance, packing, storage, and valuation coverage options." },
      { q: "What is needed for a cross-border move?", a: "Cross-border moves require customs documentation and a detailed inventory. We guide you through the paperwork and coordinate pickup and delivery." },
    ],
    service: { serviceType: "Moving Service", name: "Canada-USA Cross-Border Moving" },
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Canada-USA Moving", path: "/canada-usa/" }],
  },
};

// ---------------------------------------------------------------------------
// Route resolution: map a route path to a spec.
// ---------------------------------------------------------------------------
function specForPath(path) {
  if (CORE[path]) return CORE[path];
  if (HEAD_ONLY[path]) return { ...HEAD_ONLY[path], headOnly: true };

  const slug = path.replace(/^\/|\/$/g, "");

  if (CITY_HUBS.has(slug)) return cityHubSpec(path, slug);

  let m;
  if ((m = slug.match(/^(?:movers-)?([a-z]+)-to-([a-z]+)(?:-movers)?$/))) {
    return routeSpec(path, m[1], m[2]);
  }
  if ((m = slug.match(/^long-distance-movers-([a-z]+)$/)) || (m = slug.match(/^([a-z]+)-long-distance-movers$/))) {
    return longDistanceCitySpec(path, m[1]);
  }
  if ((m = slug.match(/^local-movers-(?:in-)?([a-z-]+?)-bc$/))) {
    return localCitySpec(path, m[1], "local");
  }
  if ((m = slug.match(/^office-movers-(?:in-)?([a-z-]+?)-bc$/))) {
    return localCitySpec(path, m[1], "office");
  }
  if ((m = slug.match(/^packing-services?-(?:in-)?([a-z-]+?)-bc$/))) {
    return localCitySpec(path, m[1], "packing");
  }
  return null; // no rich spec; org graph still applied
}

// ---------------------------------------------------------------------------
// Apply to a single file.
// ---------------------------------------------------------------------------
function patchFile(file, routePath, dry) {
  let html = readFileSync(file, "utf8");
  const before = html;

  // 1. Sitewide org graph on every page.
  html = upsertHeadJsonLd(html, "pcm-org-graph", orgGraph());

  // 2. Rich treatment only for pages that aren't already bespoke-patched.
  const spec = specForPath(routePath);
  if (spec && !hasBespokeContent(before)) {
    html = setHead(html, spec);
    if (spec.headOnly) {
      if (html !== before && !dry) writeFileSync(file, html);
      return { changed: html !== before, rich: false, head: true };
    }
    if (spec.service) {
      html = upsertHeadJsonLd(
        html,
        "pcm-service-schema",
        serviceSchema({
          path: routePath,
          name: spec.service.name,
          serviceType: spec.service.serviceType,
          description: spec.description,
          areaServed: spec.areaServed,
        })
      );
    }
    if (spec.breadcrumb) {
      html = upsertHeadJsonLd(html, "pcm-breadcrumb-schema", breadcrumbSchema(spec.breadcrumb));
    }
    if (spec.faqs && spec.faqs.length) {
      html = upsertHeadJsonLd(html, "pcm-faq-schema", faqSchema(spec.faqs));
    }
    html = upsertBodySection(html, routePath, contentSection(routePath, spec));
  }

  if (html !== before && !dry) writeFileSync(file, html);
  return { changed: html !== before, rich: Boolean(spec && !hasBespokeContent(before)) };
}

// ---------------------------------------------------------------------------
// Walk site-copy for index.html files.
// ---------------------------------------------------------------------------
function findIndexHtml(root) {
  const out = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (["assets", "external", "admin", "404"].includes(entry)) continue;
        walk(full);
      } else if (entry === "index.html") {
        out.push(full);
      }
    }
  })(root);
  return out;
}

function routePathFor(root, file) {
  const rel = relative(root, file).split(sep).slice(0, -1).join("/");
  return rel ? `/${rel}/` : "/";
}

function main() {
  const args = process.argv.slice(2);
  const root = args[0] || "site-copy";
  const dry = args.includes("--dry");
  const filters = args.slice(1).filter((a) => !a.startsWith("--"));

  const files = findIndexHtml(root).filter((f) => {
    if (!filters.length) return true;
    return filters.some((flt) => f.includes(flt));
  });

  let changed = 0, rich = 0, orgOnly = 0;
  for (const file of files) {
    const routePath = routePathFor(root, file);
    // Skip blog post pages from rich treatment but still add org graph.
    const res = patchFile(file, routePath, dry);
    if (res.changed) changed++;
    if (res.rich) rich++; else if (res.changed) orgOnly++;
    if (res.rich) console.log(`  rich  ${routePath}`);
  }
  console.log(`\n${dry ? "[dry] " : ""}Processed ${files.length} files: ${changed} changed (${rich} rich-patched, ${orgOnly} org-graph only).`);
}

main();
