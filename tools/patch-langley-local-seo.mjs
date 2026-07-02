import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const pages = [
  {
    file: "site-copy/local-movers-langley-bc/index.html",
    route: "/local-movers-langley-bc/",
    title: "Movers in Langley BC | Local Movers for City & Township",
    description:
      "Movers in Langley BC for Langley City, Willoughby, Walnut Grove, Fort Langley, Aldergrove, houses, townhomes, packing, and storage. Since 1991.",
    h2: "Movers in Langley, BC for Langley City, Willoughby, Walnut Grove, and Aldergrove",
    intro:
      "Purely Canadian Movers helps Langley residents plan local moves in Langley City, Willoughby, Walnut Grove, Fort Langley, Aldergrove, Brookswood, Murrayville, Milner, and nearby Township neighbourhoods. The team plans around townhome complexes, detached homes, condos, rural driveways, elevator bookings, parking access, packing, storage, and valuation coverage before moving day.",
    cards: [
      [
        "Langley local moving",
        "Local moving support for houses, condos, townhomes, apartments, seniors moves, furniture-only moves, and small office moves across Langley.",
      ],
      [
        "City, Township, and acreage moves",
        "Move planning for Langley City, Willoughby, Walnut Grove, Fort Langley, Aldergrove, Brookswood, Murrayville, Milner, and rural properties.",
      ],
      [
        "Direct mover trust proof",
        "Family-owned since 1991, BBB Accredited, no subcontractors, written estimates, packing, storage, and valuation coverage options.",
      ],
    ],
    linksHeading: "Related Langley moving services",
    links: [
      ["/langley/", "Langley Moving Hub"],
      ["/local/", "Local Moving"],
      ["/long-distance/", "Long-Distance Moving"],
      ["/packing-services-langley-bc/", "Packing Services Langley"],
      ["/storage/", "Storage"],
      ["/office-movers-langley-bc/", "Office Movers Langley"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/surrey/", "Surrey Movers"],
      ["/maple-ridge/", "Maple Ridge Movers"],
      ["/contact/", "Get a Langley Moving Estimate"],
    ],
  },
  {
    file: "site-copy/langley/index.html",
    route: "/langley/",
    title: "Langley Movers | Local, Packing & Long-Distance Moving",
    description:
      "Langley movers for local, packing, storage, office, and long-distance moves in Langley City, Willoughby, Walnut Grove, Fort Langley, and Aldergrove.",
    h2: "Langley movers for local, packing, storage, office, and long-distance moves",
    intro:
      "Purely Canadian Movers serves Langley with local moving, packing, storage, office moving, and long-distance relocation support. This Langley hub connects customers in Langley City, Willoughby, Walnut Grove, Fort Langley, Aldergrove, Brookswood, Murrayville, Milner, and nearby communities with the right moving service page.",
    cards: [
      [
        "Langley service hub",
        "Local moves, packing, storage, office moves, long-distance moving, valuation coverage, and written estimates for Langley customers.",
      ],
      [
        "Langley neighbourhood coverage",
        "Langley City, Willoughby, Walnut Grove, Fort Langley, Aldergrove, Brookswood, Murrayville, Milner, and nearby Township areas.",
      ],
      [
        "Local and long-distance planning",
        "Support for Langley moves within the Lower Mainland and longer relocations across BC and Canada through Great Canadian Van Lines agent coordination.",
      ],
    ],
    linksHeading: "Related Langley moving services",
    links: [
      ["/local-movers-langley-bc/", "Local Movers in Langley"],
      ["/local/", "Local Moving"],
      ["/long-distance/", "Long-Distance Moving"],
      ["/packing-services-langley-bc/", "Packing Services Langley"],
      ["/storage/", "Storage"],
      ["/office-movers-langley-bc/", "Office Movers Langley"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/surrey/", "Surrey Movers"],
      ["/maple-ridge/", "Maple Ridge Movers"],
      ["/contact/", "Get a Langley Moving Estimate"],
    ],
  },
];

const faqs = [
  [
    "Do you provide movers in Langley, BC?",
    "Yes. Purely Canadian Movers provides moving services in Langley, BC for local moves, condo moves, townhomes, houses, acreage moves, office moves, packing-supported moves, storage-supported moves, and long-distance relocations.",
  ],
  [
    "Which Langley communities do you serve?",
    "Purely Canadian Movers serves Langley City, Willoughby, Walnut Grove, Fort Langley, Aldergrove, Brookswood, Murrayville, Milner, Fernridge, and nearby Township communities.",
  ],
  [
    "How much do movers in Langley cost?",
    "Langley moving cost depends on home size, crew size, truck time, access, stairs, elevators, townhome layout, rural driveway access, packing, storage, travel time, and the amount being moved. A written estimate is the best way to price the move accurately.",
  ],
  [
    "Do you move Langley townhomes, houses, and acreages?",
    "Yes. The team handles Langley condo, apartment, townhome, detached house, rural property, and acreage moves, including access planning, parking, loading areas, stairs, and specialty items.",
  ],
  [
    "Can packing and storage be added to a Langley move?",
    "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included with a Langley moving estimate.",
  ],
  [
    "Do you use subcontractors for Langley moves?",
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
    name: "Movers in Langley, BC",
    serviceType: "Moving Service",
    url: `https://purelycanadianmovers.com${page.route}`,
    description: page.description,
    provider: { "@id": "https://purelycanadianmovers.com/#organization" },
    areaServed: [
      { "@type": "City", name: "Langley" },
      { "@type": "Place", name: "Langley City" },
      { "@type": "Place", name: "Willoughby" },
      { "@type": "Place", name: "Walnut Grove" },
      { "@type": "Place", name: "Fort Langley" },
      { "@type": "Place", name: "Aldergrove" },
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
        <div class="pcm-local-seo__faqs"><h3>Langley moving questions</h3>
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
