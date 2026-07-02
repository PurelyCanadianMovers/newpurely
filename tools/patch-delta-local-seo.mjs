import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const pages = [
  {
    file: "site-copy/local-movers-delta-bc/index.html",
    route: "/local-movers-delta-bc/",
    title: "Movers in Delta BC | Local Movers for Ladner, Tsawwassen & North Delta",
    description:
      "Movers in Delta BC for Ladner, Tsawwassen, North Delta, condos, houses, townhomes, packing, and storage. Since 1991, BBB Accredited, no subcontractors.",
    h2: "Movers in Delta, BC for Ladner, Tsawwassen, and North Delta",
    intro:
      "Purely Canadian Movers helps Delta residents plan local moves in Ladner, Tsawwassen, North Delta, Sunshine Hills, Annacis Island, Beach Grove, Boundary Bay, and nearby South Fraser communities. The team plans around strata rules, elevator bookings, townhome complexes, ferry-area timing, parking access, packing, storage, and valuation coverage before moving day.",
    cards: [
      [
        "Delta local moving",
        "Local moving support for houses, condos, townhomes, apartments, seniors moves, furniture-only moves, and small office moves across Delta.",
      ],
      [
        "Ladner, Tsawwassen, and North Delta",
        "Neighbourhood-aware planning for Ladner Village, Tsawwassen, Beach Grove, Boundary Bay, Sunshine Hills, Scott Road, and North Delta access.",
      ],
      [
        "Direct mover trust proof",
        "Family-owned since 1991, BBB Accredited, no subcontractors, written estimates, packing, storage, and valuation coverage options.",
      ],
    ],
    linksHeading: "Related Delta moving services",
    links: [
      ["/delta/", "Delta Moving Hub"],
      ["/local/", "Local Moving"],
      ["/long-distance/", "Long-Distance Moving"],
      ["/packing/", "Packing Services"],
      ["/storage/", "Storage"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/surrey/", "Surrey Movers"],
      ["/richmond/", "Richmond Movers"],
      ["/white-rock/", "White Rock Movers"],
      ["/contact/", "Get a Delta Moving Estimate"],
    ],
  },
  {
    file: "site-copy/delta/index.html",
    route: "/delta/",
    title: "Delta Movers | Local, Packing & Long-Distance Moving",
    description:
      "Delta movers for local, packing, storage, office, and long-distance moves in Ladner, Tsawwassen, and North Delta. Since 1991, BBB Accredited.",
    h2: "Delta movers for local, packing, storage, and long-distance moves",
    intro:
      "Purely Canadian Movers serves Delta with local moving, packing, storage, office moving, and long-distance relocation support. This Delta hub connects customers in Ladner, Tsawwassen, North Delta, Sunshine Hills, Annacis Island, and nearby communities with the right moving service page.",
    cards: [
      [
        "Delta service hub",
        "Local moves, packing, storage, office moves, long-distance moving, valuation coverage, and written estimates for Delta customers.",
      ],
      [
        "South Fraser coverage",
        "Ladner, Tsawwassen, North Delta, Sunshine Hills, Beach Grove, Boundary Bay, Annacis Island, Tilbury, and nearby Lower Mainland areas.",
      ],
      [
        "Local and long-distance planning",
        "Support for Delta moves within Metro Vancouver and longer relocations across BC and Canada through Great Canadian Van Lines agent coordination.",
      ],
    ],
    linksHeading: "Related Delta moving services",
    links: [
      ["/local-movers-delta-bc/", "Local Movers in Delta"],
      ["/local/", "Local Moving"],
      ["/long-distance/", "Long-Distance Moving"],
      ["/packing/", "Packing Services"],
      ["/storage/", "Storage"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/surrey/", "Surrey Movers"],
      ["/richmond/", "Richmond Movers"],
      ["/white-rock/", "White Rock Movers"],
      ["/contact/", "Get a Delta Moving Estimate"],
    ],
  },
];

const faqs = [
  [
    "Do you provide movers in Delta, BC?",
    "Yes. Purely Canadian Movers provides moving services in Delta, BC for local moves, condo moves, townhomes, houses, office moves, packing-supported moves, storage-supported moves, and long-distance relocations.",
  ],
  [
    "Which Delta communities do you serve?",
    "Purely Canadian Movers serves Ladner, Tsawwassen, North Delta, Sunshine Hills, Beach Grove, Boundary Bay, Annacis Island, Tilbury, Delta Centre, and nearby South Fraser communities.",
  ],
  [
    "How much do movers in Delta cost?",
    "Delta moving cost depends on home size, crew size, truck time, access, stairs, elevators, townhome layout, packing, storage, travel time, and the amount being moved. A written estimate is the best way to price the move accurately.",
  ],
  [
    "Do you move Delta condos, townhomes, and houses?",
    "Yes. The team handles Delta condo, apartment, townhome, and detached house moves, including elevator reservations, loading-zone planning, parking limits, strata move windows, and access details.",
  ],
  [
    "Can packing and storage be added to a Delta move?",
    "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included with a Delta moving estimate.",
  ],
  [
    "Do you use subcontractors for Delta moves?",
    "No. Purely Canadian Movers is a direct moving company, family-owned since 1991, with BBB Accreditation and direct accountability from estimate to moving day.",
  ],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setMeta(html, attr, value, content) {
  const re = new RegExp(
    `<meta ${attr}="${escapeRegExp(value)}" content="[^"]*"\\s*/?>`
  );
  return html.replace(re, `<meta ${attr}="${value}" content="${content}" />`);
}

function removeDynamicCanonical(html) {
  return html.replace(
    /\s*<script>\s*\(function\(\) \{\s*var canon = document\.getElementById\('canonical-tag'\);\s*if \(canon\) canon\.href = 'https:\/\/purelycanadianmovers\.com' \+ window\.location\.pathname;\s*\}\)\(\);\s*<\/script>/,
    ""
  );
}

function serviceSchema(page) {
  return `<script type="application/ld+json" id="static-service-schema">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Movers in Delta, BC",
    serviceType: "Moving Service",
    url: `https://purelycanadianmovers.com${page.route}`,
    description: page.description,
    provider: { "@id": "https://purelycanadianmovers.com/#organization" },
    areaServed: [
      { "@type": "City", name: "Delta" },
      { "@type": "Place", name: "Ladner" },
      { "@type": "Place", name: "Tsawwassen" },
      { "@type": "Place", name: "North Delta" },
      { "@type": "AdministrativeArea", name: "British Columbia" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://purelycanadianmovers.com/contact/",
      servicePhone: "+1-877-485-6683",
    },
  })}</script>`;
}

function faqSchema(route) {
  const mainEntity = faqs.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  }));
  return `<script type="application/ld+json" data-pcm-static-faq-schema="${route}">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  })}</script>`;
}

function staticSection(page) {
  const cards = page.cards
    .map(([title, body]) => `<article><h3>${title}</h3><p>${body}</p></article>`)
    .join("\n          ");
  const links = page.links
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("\n          ");
  const details = faqs
    .map(
      ([question, answer]) =>
        `<details><summary>${question}</summary><p>${answer}</p></details>`
    )
    .join("\n          ");

  return `<section class="pcm-lead-boost pcm-local-seo" aria-label="${page.h2}" data-pcm-static-local-seo="${page.route}">
      <div class="pcm-local-seo__inner">
        <h2>${page.h2}</h2>
        <p>${page.intro}</p>
        <div class="pcm-local-seo__cards">
          ${cards}
        </div>
        <div class="pcm-local-seo__links"><h3>${page.linksHeading}</h3><div>
          ${links}
        </div></div>
        <div class="pcm-local-seo__faqs"><h3>Delta moving questions</h3>
          ${details}
        </div>
      </div>
    </section>`;
}

for (const page of pages) {
  const filePath = path.join(root, page.file);
  let html = fs.readFileSync(filePath, "utf8");

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:url", `https://purelycanadianmovers.com${page.route}`);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = html.replace(
    /<link rel="canonical" id="canonical-tag" href="[^"]*" \/>/,
    `<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com${page.route}" />`
  );
  html = removeDynamicCanonical(html);

  if (html.includes('id="static-service-schema"')) {
    html = html.replace(
      /<script type="application\/ld\+json" id="static-service-schema">[\s\S]*?<\/script>/,
      serviceSchema(page)
    );
  } else {
    html = html.replace("</head>", `    ${serviceSchema(page)}\n  </head>`);
  }

  if (html.includes("data-pcm-static-faq-schema=")) {
    html = html.replace(
      /<script type="application\/ld\+json" data-pcm-static-faq-schema="[^"]*">[\s\S]*?<\/script>/,
      faqSchema(page.route)
    );
  } else {
    html = html.replace("</head>", `    ${faqSchema(page.route)}\n  </head>`);
  }

  const section = staticSection(page);
  if (html.includes("data-pcm-static-local-seo=")) {
    html = html.replace(
      /<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*<div id="root"><\/div>/,
      `${section}\n    <div id="root"></div>`
    );
  } else {
    html = html.replace("<div id=\"root\"></div>", `${section}\n    <div id="root"></div>`);
  }

  fs.writeFileSync(filePath, html);
  console.log(`Patched ${page.file}`);
}
