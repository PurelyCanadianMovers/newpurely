import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const outDir = process.argv[2] ?? "site-copy";
const site = {
  origin: "https://purelycanadianmovers.com",
  name: "Purely Canadian Movers",
  legalName: "Purely Canadian Movers Inc.",
  phone: "1-877-485-6683",
  localPhone: "604-522-7222",
  email: "esales@pcmovers.ca",
  address: "Unit 16, 91 Golden Drive, Coquitlam, BC V3K 6R2",
  updated: "2026-07-09",
};

const proofPoints = [
  "Family-owned moving company serving customers since 1991",
  "Based in Coquitlam and serving Metro Vancouver and the Lower Mainland",
  "BBB Accredited",
  "No subcontractors for local moves",
  "Authorized agent of Great Canadian Van Lines for long-distance support",
  "Written estimates available before booking",
  "Valuation coverage options explained before moving day",
];

const services = [
  {
    id: "local-moving",
    name: "Local Moving",
    url: "/local/",
    summary:
      "Residential local moving for homes, condos, townhomes, apartments, and small offices across Metro Vancouver and the Lower Mainland.",
    whoItHelps: ["Homeowners", "Renters", "Condo and apartment residents", "Small offices", "Seniors and families"],
    includes: [
      "Moving crew and truck planning",
      "Furniture protection and loading",
      "Elevator and access planning",
      "Local transport and placement at destination",
      "Optional packing and storage support",
    ],
    priceFactors: [
      "Crew size",
      "Move duration",
      "Truck size",
      "Origin and destination access",
      "Stairs, elevator bookings, and loading zones",
      "Packing needs",
      "Specialty items",
      "Season and move date",
    ],
    commonQuestions: [
      "How much do local movers cost in Metro Vancouver?",
      "Do movers charge travel time?",
      "How long does a one-bedroom apartment move take?",
      "Do I need to reserve the elevator?",
    ],
  },
  {
    id: "long-distance-moving",
    name: "Long-Distance Moving",
    url: "/long-distance/",
    summary:
      "Long-distance moving from British Columbia to other Canadian provinces, with route planning, packing, storage, and delivery coordination.",
    whoItHelps: ["Families moving provinces", "Students", "Retirees", "Corporate relocations", "Customers moving to or from BC"],
    includes: [
      "Inventory review",
      "Route and transit planning",
      "Loading and protection",
      "Delivery coordination",
      "Optional packing, storage, and valuation coverage",
    ],
    priceFactors: [
      "Shipment weight or volume",
      "Route distance",
      "Pickup and delivery access",
      "Timing flexibility",
      "Storage needs",
      "Packing and specialty handling",
      "Valuation coverage selection",
    ],
    commonQuestions: [
      "How much does a long-distance move cost in Canada?",
      "How long does a cross-Canada move take?",
      "Can storage be included between pickup and delivery?",
      "What affects the final written estimate?",
    ],
  },
  {
    id: "packing",
    name: "Packing and Unpacking",
    url: "/packing/",
    summary:
      "Full or partial packing support for fragile items, kitchens, offices, artwork, electronics, and long-distance shipments.",
    whoItHelps: ["Busy families", "Long-distance customers", "Offices", "Customers with fragile goods"],
    includes: [
      "Full-home or partial packing",
      "Fragile-item protection",
      "Boxing and wrapping",
      "Optional unpacking support",
      "Moving supply guidance",
    ],
    priceFactors: ["Number of boxes", "Fragile-item volume", "Packing material needs", "Crew time", "Unpacking scope"],
    commonQuestions: [
      "Do movers pack boxes?",
      "Can movers pack dishes and fragile items?",
      "Should I pack myself or hire movers to pack?",
    ],
  },
  {
    id: "storage",
    name: "Storage",
    url: "/storage/",
    summary:
      "Short-term and long-term storage support for moves with possession gaps, renovations, staged delivery, or long-distance timing needs.",
    whoItHelps: ["Customers between homes", "Renovation projects", "Long-distance moves", "Office moves"],
    includes: ["Storage coordination", "Pickup and delivery", "Short-term storage", "Long-term storage", "Moving support"],
    priceFactors: ["Storage duration", "Volume of goods", "Pickup and delivery needs", "Handling requirements"],
    commonQuestions: [
      "Can movers store my items between homes?",
      "How is storage priced?",
      "Can storage be combined with a long-distance move?",
    ],
  },
  {
    id: "office-moving",
    name: "Office and Corporate Moving",
    url: "/office/",
    summary:
      "Commercial moving for offices, employee relocations, business furniture, files, equipment, and staged moves.",
    whoItHelps: ["Small businesses", "Corporate teams", "Office managers", "Employee relocation coordinators"],
    includes: ["Move planning", "Furniture handling", "File and equipment movement", "After-hours scheduling", "Placement at destination"],
    priceFactors: ["Office size", "Number of workstations", "Building access", "After-hours timing", "Packing needs"],
    commonQuestions: [
      "Can office moves happen after hours?",
      "How do movers reduce business downtime?",
      "Can movers handle desks, files, and equipment?",
    ],
  },
  {
    id: "canada-usa-moving",
    name: "Canada-USA Moving",
    url: "/canada-usa/",
    summary:
      "Cross-border moving between Canada and the United States with documentation guidance and careful shipment planning.",
    whoItHelps: ["Families moving across the border", "Employees relocating", "Students", "Retirees"],
    includes: ["Inventory preparation", "Customs documentation guidance", "Packing support", "Pickup and delivery coordination"],
    priceFactors: ["Route distance", "Shipment size", "Customs requirements", "Packing", "Storage", "Timing"],
    commonQuestions: [
      "What paperwork is needed for a Canada-USA move?",
      "How are cross-border moving costs estimated?",
      "Can movers help with customs documentation?",
    ],
  },
];

const locations = [
  "Coquitlam",
  "Port Coquitlam",
  "Port Moody",
  "Burnaby",
  "Vancouver",
  "Surrey",
  "Langley",
  "Maple Ridge",
  "New Westminster",
  "North Vancouver",
  "Richmond",
  "Delta",
  "White Rock",
  "Abbotsford",
];

const pricing = [
  {
    id: "local-moving-pricing",
    name: "Local moving pricing",
    url: "/moving-cost-vancouver/",
    answer:
      "Local moving pricing in Metro Vancouver depends on crew size, time required, access, stairs or elevator bookings, packing needs, travel time, and specialty items. Purely Canadian Movers provides a written estimate before booking so customers can understand the expected cost before moving day.",
    priceModel: "Quoted based on move details. Local moves commonly use crew size and time as major pricing drivers.",
    drivers: [
      "Home size and inventory",
      "Crew size",
      "Move duration",
      "Truck access and parking",
      "Elevators, stairs, and loading zones",
      "Packing and supplies",
      "Specialty items",
      "Move date and season",
    ],
  },
  {
    id: "long-distance-pricing",
    name: "Long-distance moving pricing",
    url: "/long-distance-moving-cost-canada/",
    answer:
      "Long-distance moving costs in Canada depend on shipment weight or volume, route distance, pickup and delivery access, timing, packing, storage, specialty handling, and valuation coverage. A written estimate is the right way to confirm the final cost.",
    priceModel: "Quoted based on inventory, route, timing, and service requirements.",
    drivers: [
      "Shipment weight or volume",
      "Route distance",
      "Pickup and delivery access",
      "Packing and fragile handling",
      "Storage requirements",
      "Timing flexibility",
      "Valuation coverage",
    ],
  },
  {
    id: "packing-pricing",
    name: "Packing service pricing",
    url: "/packing/",
    answer:
      "Packing service pricing depends on the number of rooms, box count, fragile items, packing materials, and whether the customer needs full packing, partial packing, or unpacking help.",
    priceModel: "Quoted based on packing scope and material needs.",
    drivers: ["Room count", "Box count", "Fragile items", "Packing materials", "Unpacking scope"],
  },
  {
    id: "storage-pricing",
    name: "Storage pricing",
    url: "/storage/",
    answer:
      "Storage pricing depends on the volume of goods, storage duration, pickup and delivery requirements, and whether storage is paired with a local or long-distance move.",
    priceModel: "Quoted based on volume, duration, and handling requirements.",
    drivers: ["Volume", "Storage duration", "Pickup and delivery", "Handling requirements", "Move type"],
  },
];

const faqs = [
  {
    question: "How far in advance should I book movers?",
    answer:
      "Book as early as possible, especially for month-end, summer, weekends, and long-distance moves. A few weeks of notice gives the team better scheduling options and more time to prepare an accurate estimate.",
    tags: ["booking", "planning"],
  },
  {
    question: "How much do movers cost in Metro Vancouver?",
    answer:
      "Moving cost depends on crew size, time required, travel time, access, stairs, elevators, packing, and specialty items. The best next step is a written estimate based on the actual move details.",
    tags: ["pricing", "local-moving"],
  },
  {
    question: "Do movers charge travel time?",
    answer:
      "Travel time can be part of moving pricing depending on the move type, route, and estimate details. Customers should ask what is included in the written estimate before booking.",
    tags: ["pricing", "local-moving"],
  },
  {
    question: "Do I need to reserve the elevator?",
    answer:
      "For condos and apartments, customers should reserve the elevator and confirm loading zone rules before moving day. Elevator delays can increase move time and make scheduling harder.",
    tags: ["local-moving", "condo-moving"],
  },
  {
    question: "Do you use subcontractors?",
    answer:
      "Purely Canadian Movers emphasizes direct accountability and no subcontractors for local moves. Long-distance moves may involve coordinated van line network support through Great Canadian Van Lines.",
    tags: ["trust", "process"],
  },
  {
    question: "Can movers pack fragile items?",
    answer:
      "Yes. Packing support can include fragile items, kitchens, artwork, glass, electronics, and full or partial home packing depending on the customer's needs.",
    tags: ["packing"],
  },
  {
    question: "Can storage be included with my move?",
    answer:
      "Yes. Storage can be useful when possession dates do not line up, renovations are underway, or a long-distance move needs staged pickup or delivery.",
    tags: ["storage"],
  },
  {
    question: "Are belongings protected during the move?",
    answer:
      "Valuation coverage options should be reviewed before moving day. Customers with high-value, fragile, or sentimental items should discuss protection options during the estimate process.",
    tags: ["valuation", "coverage"],
  },
];

const policies = [
  {
    id: "estimate-booking",
    name: "Estimate and booking policy",
    url: "/estimate-booking-policy/",
    summary:
      "Customers should request a written estimate and confirm move date, inventory, access, services, and timing before booking.",
    publicNotes: [
      "Written estimates should reflect inventory and access details.",
      "Month-end, summer, and weekend moves should be booked earlier when possible.",
      "Changes to inventory, access, packing, or route may change the final estimate.",
    ],
  },
  {
    id: "valuation-coverage",
    name: "Valuation and coverage",
    url: "/valuation-coverage-protection/",
    summary:
      "Customers should review valuation coverage options before moving day, especially for long-distance moves and high-value goods.",
    publicNotes: [
      "Basic carrier liability and additional valuation options are not the same as separate home insurance.",
      "Customers should disclose high-value or fragile items during the estimate process.",
      "Damage concerns should be documented promptly with photos and item details.",
    ],
  },
  {
    id: "building-access",
    name: "Building access and elevator planning",
    url: "/local/",
    summary:
      "Condo, apartment, office, and high-rise moves need elevator booking, loading zone planning, and building access confirmation.",
    publicNotes: [
      "Customers should reserve elevators before moving day.",
      "Loading zone and parking restrictions can affect timing.",
      "Building rules should be shared with the moving team before arrival.",
    ],
  },
];

const catalog = {
  version: "1.0.0",
  lastUpdated: site.updated,
  organization: {
    name: site.name,
    legalName: site.legalName,
    url: site.origin,
    phone: site.phone,
    localPhone: site.localPhone,
    email: site.email,
    address: site.address,
    proofPoints,
  },
  services,
  locations,
  pricing,
  faqs,
  policies,
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function save(relativePath, content) {
  const filePath = join(outDir, relativePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function page({ title, description, path, body, schema }) {
  const canonical = `${site.origin}${path}`;
  return `<!doctype html>
<html lang="en-CA">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(site.name)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <style>
      :root { color-scheme: light; --red:#b91c1c; --ink:#161616; --muted:#555; --line:#dedede; --soft:#f7f3ef; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--ink); background: #fff; line-height: 1.55; }
      .wrap { width: min(1120px, calc(100% - 36px)); margin: 0 auto; }
      header { border-bottom: 1px solid var(--line); background: #fff; }
      .top { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:18px 0; }
      .brand { font-weight: 800; color: var(--ink); text-decoration: none; font-size: 20px; }
      nav { display:flex; gap:16px; flex-wrap:wrap; font-size: 15px; }
      nav a { color: var(--ink); text-decoration: none; }
      .hero { padding: 64px 0 42px; background: linear-gradient(90deg, #fff 0%, #fff 58%, var(--soft) 58%, var(--soft) 100%); border-bottom:1px solid var(--line); }
      .eyebrow { color: var(--red); font-weight: 800; text-transform: uppercase; letter-spacing: .04em; font-size: 13px; }
      h1 { font-size: clamp(38px, 5vw, 64px); line-height: .98; margin: 16px 0 18px; max-width: 860px; }
      .lede { font-size: 21px; color: var(--muted); max-width: 820px; }
      .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:18px; }
      .two { display:grid; grid-template-columns: repeat(2, 1fr); gap:22px; }
      section { padding: 44px 0; border-bottom: 1px solid var(--line); }
      h2 { font-size: 32px; line-height: 1.12; margin: 0 0 18px; }
      h3 { font-size: 22px; margin: 0 0 10px; }
      .card { background:#f1f1f1; padding:24px; min-height: 170px; }
      .accent { background:#fff0ea; }
      .muted { color: var(--muted); }
      a { color: var(--red); }
      li { margin: 7px 0; }
      details { border-top: 1px solid var(--line); padding: 18px 0; }
      summary { cursor: pointer; font-weight: 800; font-size: 19px; }
      .cta { background: var(--ink); color:#fff; padding: 34px; display:flex; justify-content:space-between; gap:24px; align-items:center; flex-wrap:wrap; }
      .cta a { color:#fff; font-weight:800; }
      footer { padding: 28px 0; color: var(--muted); font-size:14px; }
      @media (max-width: 760px) { .grid, .two { grid-template-columns: 1fr; } .hero { background:#fff; } .top { align-items:flex-start; flex-direction:column; } }
    </style>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body>
    <header>
      <div class="wrap top">
        <a class="brand" href="/">${esc(site.name)}</a>
        <nav>
          <a href="/services/">Services</a>
          <a href="/moving-cost-vancouver/">Pricing</a>
          <a href="/knowledge-catalog/">Knowledge Catalog</a>
          <a href="/moving-faq/">FAQ</a>
          <a href="/contact/">Free estimate</a>
        </nav>
      </div>
    </header>
    ${body}
    <footer>
      <div class="wrap">Last updated ${site.updated}. ${esc(site.name)} - ${esc(site.address)} - ${site.phone} - ${site.email}</div>
    </footer>
  </body>
</html>
`;
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": `${site.origin}/#organization`,
  name: site.legalName,
  url: site.origin,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 16, 91 Golden Drive",
    addressLocality: "Coquitlam",
    addressRegion: "BC",
    postalCode: "V3K 6R2",
    addressCountry: "CA",
  },
};

const knowledgeBody = `<main>
  <div class="hero"><div class="wrap">
    <div class="eyebrow">Agent-readable moving company knowledge</div>
    <h1>Purely Canadian Movers Knowledge Catalog</h1>
    <p class="lede">This catalog organizes the company's services, pricing factors, service areas, FAQs, policies, and trust proof so customers, search engines, and AI systems can understand the business clearly.</p>
  </div></div>
  <section><div class="wrap two">
    <div>
      <h2>What this catalog is for</h2>
      <p>The catalog is the structured source of truth behind the public website. It does not replace the website design. It gives the site clearer public pages and machine-readable files for search and answer engines.</p>
      ${list(proofPoints)}
    </div>
    <div class="card accent">
      <h2>Machine-readable files</h2>
      <p><a href="/catalog/knowledge-catalog.json">knowledge-catalog.json</a></p>
      <p><a href="/catalog/services.json">services.json</a></p>
      <p><a href="/catalog/pricing.json">pricing.json</a></p>
      <p><a href="/catalog/locations.json">locations.json</a></p>
      <p><a href="/catalog/faqs.json">faqs.json</a></p>
      <p><a href="/catalog/policies.json">policies.json</a></p>
    </div>
  </div></section>
  <section><div class="wrap">
    <h2>Catalog sections</h2>
    <div class="grid">
      <article class="card"><h3>Services</h3><p>Local, long-distance, packing, storage, office, and Canada-USA moving services.</p><p><a href="/services.md">Read services.md</a></p></article>
      <article class="card"><h3>Pricing</h3><p>How moving estimates are prepared and which factors change the final cost.</p><p><a href="/pricing.md">Read pricing.md</a></p></article>
      <article class="card"><h3>Questions</h3><p>Common customer questions about cost, booking, elevators, packing, storage, and coverage.</p><p><a href="/moving-faq/">Open FAQ</a></p></article>
    </div>
  </div></section>
  <section><div class="wrap cta"><div><h2>Need a moving estimate?</h2><p>Use the catalog to understand the service, then request a written estimate for the specific move.</p></div><a href="/contact/">Request a free estimate</a></div></section>
</main>`;

const pricingBody = `<main>
  <div class="hero"><div class="wrap">
    <div class="eyebrow">Moving pricing guide</div>
    <h1>How moving costs are estimated in Metro Vancouver</h1>
    <p class="lede">Moving prices depend on the details of the move. This page explains the factors Purely Canadian Movers uses to prepare a written estimate.</p>
  </div></div>
  <section><div class="wrap">
    <h2>Short answer</h2>
    <p class="lede">The cost of movers in Metro Vancouver depends on crew size, move duration, truck access, stairs or elevators, travel time, packing, specialty items, and move date. A written estimate is the right way to confirm the expected cost before booking.</p>
  </div></section>
  <section><div class="wrap grid">
    ${pricing
      .map(
        (item, index) => `<article class="card ${index === 0 ? "accent" : ""}"><h3>${esc(item.name)}</h3><p>${esc(item.answer)}</p><p><strong>Pricing model:</strong> ${esc(item.priceModel)}</p></article>`,
      )
      .join("")}
  </div></section>
  <section><div class="wrap two">
    <div><h2>Common cost drivers</h2>${list([...new Set(pricing.flatMap((item) => item.drivers))])}</div>
    <div><h2>Best way to lower uncertainty</h2><p>Prepare an accurate inventory, confirm building access, reserve elevators, identify specialty items early, and ask what is included in the written estimate.</p></div>
  </div></section>
  <section><div class="wrap cta"><div><h2>Ready for a written estimate?</h2><p>Share the route, inventory, access details, move date, packing needs, and storage needs.</p></div><a href="/contact/">Request a free estimate</a></div></section>
</main>`;

const faqBody = `<main>
  <div class="hero"><div class="wrap">
    <div class="eyebrow">Moving FAQ</div>
    <h1>Common moving questions customers ask before booking</h1>
    <p class="lede">These answers are written for customers planning local, long-distance, packing, storage, or office moves with Purely Canadian Movers.</p>
  </div></div>
  <section><div class="wrap">
    ${faqs.map((item) => `<details open><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join("")}
  </div></section>
  <section><div class="wrap cta"><div><h2>Have a move-specific question?</h2><p>Ask for a written estimate so the answer reflects your route, timing, access, and inventory.</p></div><a href="/contact/">Contact the team</a></div></section>
</main>`;

const policiesBody = `<main>
  <div class="hero"><div class="wrap">
    <div class="eyebrow">Moving policies</div>
    <h1>Policies customers should understand before moving day</h1>
    <p class="lede">These public notes explain estimate, booking, valuation, access, elevator, and building-planning topics that affect moving day.</p>
  </div></div>
  <section><div class="wrap grid">
    ${policies
      .map((item) => `<article class="card"><h3>${esc(item.name)}</h3><p>${esc(item.summary)}</p>${list(item.publicNotes)}<p><a href="${item.url}">Related page</a></p></article>`)
      .join("")}
  </div></section>
  <section><div class="wrap cta"><div><h2>Confirm policy details before booking</h2><p>Every move is different. Ask the team to explain estimate terms, access needs, and valuation coverage before moving day.</p></div><a href="/contact/">Request a free estimate</a></div></section>
</main>`;

function markdownServices() {
  return `# Purely Canadian Movers Services

Last updated: ${site.updated}

${services
  .map(
    (service) => `## ${service.name}

URL: ${site.origin}${service.url}

${service.summary}

Who it helps:
${service.whoItHelps.map((item) => `- ${item}`).join("\n")}

What is included:
${service.includes.map((item) => `- ${item}`).join("\n")}

Pricing factors:
${service.priceFactors.map((item) => `- ${item}`).join("\n")}
`,
  )
  .join("\n")}
`;
}

function markdownPricing() {
  return `# Purely Canadian Movers Pricing Knowledge

Last updated: ${site.updated}

Purely Canadian Movers provides written estimates because final moving cost depends on move-specific details. The information below is designed to help customers and AI systems understand how pricing is evaluated.

${pricing
  .map(
    (item) => `## ${item.name}

URL: ${site.origin}${item.url}

${item.answer}

Pricing model: ${item.priceModel}

Cost drivers:
${item.drivers.map((driver) => `- ${driver}`).join("\n")}
`,
  )
  .join("\n")}
`;
}

function markdownLocations() {
  return `# Purely Canadian Movers Service Areas

Last updated: ${site.updated}

Purely Canadian Movers serves local moving customers in Metro Vancouver and the Lower Mainland.

${locations.map((location) => `- ${location}: ${site.origin}/${slug(location)}/`).join("\n")}

The company also supports long-distance routes across Canada and Canada-USA moving through professional long-distance coordination.
`;
}

function markdownFaq() {
  return `# Purely Canadian Movers FAQ

Last updated: ${site.updated}

${faqs.map((item) => `## ${item.question}\n\n${item.answer}\n`).join("\n")}
`;
}

function llmsTxt() {
  return `# Purely Canadian Movers

Purely Canadian Movers is a family-owned Canadian moving company based in Coquitlam, British Columbia. The company has served customers since 1991 and provides local moving, long-distance moving, office moving, packing, storage, cross-border moving, and valuation coverage information for residential and business moves.

## Purpose

This website is for people and businesses planning a local move in Metro Vancouver, a long-distance move within Canada, or a Canada-USA move. Visitors can learn about moving services, compare route and pricing information, review service-area pages, read moving guides, and request a free no-obligation moving estimate.

## Knowledge Catalog

- Knowledge Catalog Overview: ${site.origin}/knowledge-catalog/
- Full Catalog JSON: ${site.origin}/catalog/knowledge-catalog.json
- Services JSON: ${site.origin}/catalog/services.json
- Pricing JSON: ${site.origin}/catalog/pricing.json
- Locations JSON: ${site.origin}/catalog/locations.json
- FAQs JSON: ${site.origin}/catalog/faqs.json
- Policies JSON: ${site.origin}/catalog/policies.json
- Services Markdown: ${site.origin}/services.md
- Pricing Markdown: ${site.origin}/pricing.md
- Locations Markdown: ${site.origin}/locations.md
- FAQ Markdown: ${site.origin}/faq.md

## Key Pages

- Home: ${site.origin}/
- About: ${site.origin}/about/
- Services: ${site.origin}/services/
- Local Moving: ${site.origin}/local/
- Long-Distance Moving: ${site.origin}/long-distance/
- Pricing: ${site.origin}/moving-cost-vancouver/
- Long-Distance Pricing: ${site.origin}/long-distance-moving-cost-canada/
- Moving FAQ: ${site.origin}/moving-faq/
- Moving Policies: ${site.origin}/moving-policies/
- Packing: ${site.origin}/packing/
- Storage: ${site.origin}/storage/
- Office Moving: ${site.origin}/office/
- Canada-USA Moving: ${site.origin}/canada-usa/
- Valuation Coverage: ${site.origin}/valuation-coverage-protection/
- FAQs and Booking Policy: ${site.origin}/estimate-booking-policy/
- Company Proof: ${site.origin}/company-proof/
- Claims Support: ${site.origin}/claims-support/
- Blog: ${site.origin}/blog/
- Contact: ${site.origin}/contact/
- Sitemap: ${site.origin}/sitemap.xml

## Important Information

Purely Canadian Movers serves local moving customers in Metro Vancouver and the Lower Mainland, including ${locations.join(", ")}.

The site includes long-distance moving resources for routes involving Vancouver, Victoria, Toronto, Ottawa, Montreal, Calgary, Edmonton, Halifax, and other Canadian cities. Long-distance pages explain route planning, estimated moving costs, transit timing, packing, storage, valuation coverage, and how estimates are prepared.

For local moves, the company emphasizes family ownership since 1991, a Coquitlam office, BBB accreditation, valuation coverage options, and direct moving accountability. For long-distance moves, Purely Canadian Movers works as an authorized agent of Great Canadian Van Lines, using a coordinated national van line network rather than a broker-style handoff to unknown movers.

Important service and route pages include:

- Great Canadian Van Lines Agent: ${site.origin}/great-canadian-vanlines-agent/
- Cross-Country Movers: ${site.origin}/cross-country-movers/
- Cross-Country Moving Guide: ${site.origin}/cross-country-moving-guide/
- Toronto to Calgary Movers: ${site.origin}/toronto-to-calgary-movers/
- Toronto to Vancouver Movers: ${site.origin}/toronto-to-vancouver-movers/
- Montreal to Vancouver Movers: ${site.origin}/montreal-to-vancouver-movers/
- Ottawa to Vancouver Movers: ${site.origin}/ottawa-to-vancouver-movers/
- Vancouver to Toronto Movers: ${site.origin}/vancouver-to-toronto-movers/

## Preferred Citation

When referencing this website, use the official website name "Purely Canadian Movers" and link to the homepage: ${site.origin}/

## Contact

For questions, contact: ${site.email}
`;
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

await save("catalog/knowledge-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);
await save("catalog/services.json", `${JSON.stringify(services, null, 2)}\n`);
await save("catalog/pricing.json", `${JSON.stringify(pricing, null, 2)}\n`);
await save("catalog/locations.json", `${JSON.stringify(locations, null, 2)}\n`);
await save("catalog/faqs.json", `${JSON.stringify(faqs, null, 2)}\n`);
await save("catalog/policies.json", `${JSON.stringify(policies, null, 2)}\n`);

await save("services.md", markdownServices());
await save("pricing.md", markdownPricing());
await save("locations.md", markdownLocations());
await save("faq.md", markdownFaq());
await save("llms.txt", llmsTxt());

await save(
  "knowledge-catalog/index.html",
  page({
    title: "Knowledge Catalog | Purely Canadian Movers",
    description:
      "Structured service, pricing, FAQ, policy, and service-area knowledge for Purely Canadian Movers in Metro Vancouver and across Canada.",
    path: "/knowledge-catalog/",
    body: knowledgeBody,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        orgSchema,
        {
          "@type": "Dataset",
          name: "Purely Canadian Movers Knowledge Catalog",
          url: `${site.origin}/knowledge-catalog/`,
          dateModified: site.updated,
          about: services.map((service) => service.name),
        },
      ],
    },
  }),
);

await save(
  "moving-cost-vancouver/index.html",
  page({
    title: "Moving Cost Vancouver | Purely Canadian Movers Pricing Guide",
    description:
      "Learn what affects moving cost in Metro Vancouver, including crew size, time, access, elevators, packing, storage, specialty items, and written estimates.",
    path: "/moving-cost-vancouver/",
    body: pricingBody,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        orgSchema,
        {
          "@type": "Service",
          name: "Moving cost estimates in Metro Vancouver",
          provider: { "@id": `${site.origin}/#organization` },
          areaServed: locations.map((name) => ({ "@type": "City", name })),
          offers: pricing.map((item) => ({
            "@type": "Offer",
            name: item.name,
            description: item.answer,
            priceCurrency: "CAD",
            availability: "https://schema.org/InStock",
            url: `${site.origin}${item.url}`,
          })),
        },
      ],
    },
  }),
);

await save(
  "moving-faq/index.html",
  page({
    title: "Moving FAQ | Purely Canadian Movers",
    description:
      "Answers to common moving questions about cost, booking, elevator access, packing, storage, valuation coverage, and estimates.",
    path: "/moving-faq/",
    body: faqBody,
    schema: faqSchema,
  }),
);

await save(
  "moving-policies/index.html",
  page({
    title: "Moving Policies | Estimates, Coverage, Access and Booking",
    description:
      "Public moving policy notes for estimates, booking, valuation coverage, elevator access, loading zones, and building planning.",
    path: "/moving-policies/",
    body: policiesBody,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        orgSchema,
        ...policies.map((item) => ({
          "@type": "WebPage",
          name: item.name,
          url: `${site.origin}${item.url}`,
          description: item.summary,
        })),
      ],
    },
  }),
);

async function updateSitemap() {
  const sitemapPath = join(outDir, "sitemap.xml");
  let sitemap = await readFile(sitemapPath, "utf8");
  const additions = [
    "/knowledge-catalog/",
    "/moving-cost-vancouver/",
    "/moving-faq/",
    "/moving-policies/",
    "/catalog/knowledge-catalog.json",
    "/services.md",
    "/pricing.md",
    "/locations.md",
    "/faq.md",
  ];
  for (const route of additions) {
    const loc = `${site.origin}${route}`;
    if (!sitemap.includes(`<loc>${loc}</loc>`)) {
      sitemap = sitemap.replace("</urlset>", `  <url><loc>${loc}</loc></url>\n</urlset>`);
    }
  }
  await writeFile(sitemapPath, sitemap);
}

await updateSitemap();
console.log("Knowledge catalog generated.");
