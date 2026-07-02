import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const pages = [
  {
    file: "site-copy/office-movers-in-vancouver-bc/index.html",
    route: "/office-movers-in-vancouver-bc/",
    title: "Office Movers in Vancouver BC | Commercial Moving Since 1991",
    description:
      "Office movers in Vancouver BC for commercial relocations, desks, files, equipment, packing, storage, after-hours moves, and written estimates. BBB Accredited.",
    h2: "Office movers in Vancouver, BC for commercial relocations, furniture, files, and equipment",
    intro:
      "Purely Canadian Movers helps Vancouver businesses plan office moves with clear access planning, elevator bookings, loading zones, building move windows, packing, storage, furniture disassembly, equipment handling, and phased timing. We serve downtown Vancouver, Yaletown, Gastown, Mount Pleasant, Kitsilano, False Creek, Railtown, Strathcona, South Vancouver, and nearby Metro Vancouver business areas.",
    cards: [
      [
        "Downtown Vancouver office moves",
        "Planning for loading zones, service elevators, building rules, after-hours access, security requirements, parking limits, and phased office relocations.",
      ],
      [
        "Commercial furniture and equipment",
        "Office desks, chairs, filing cabinets, boardroom furniture, shelving, packed files, supplies, small equipment, and storage-supported business moves.",
      ],
      [
        "Direct business accountability",
        "Family-owned since 1991, BBB Accredited, no subcontractors, written estimates, valuation coverage options, and a clear move plan before moving day.",
      ],
    ],
    links: [
      ["/office-movers-vancouver-bc/", "Vancouver Office Moving Hub"],
      ["/office/", "Office Moving"],
      ["/packing/", "Packing Services"],
      ["/storage/", "Storage"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/vancouver/", "Vancouver Movers"],
      ["/local/", "Local Moving"],
      ["/contact/", "Get a Vancouver Office Moving Estimate"],
    ],
  },
  {
    file: "site-copy/office-movers-vancouver-bc/index.html",
    route: "/office-movers-vancouver-bc/",
    title: "Vancouver Office Movers | Commercial Moving, Packing & Storage",
    description:
      "Vancouver office movers for commercial moving, packing, storage, equipment moves, after-hours planning, and written estimates. Family-owned since 1991.",
    h2: "Vancouver office movers for commercial moves, packing, storage, and access planning",
    intro:
      "Purely Canadian Movers provides office moving support across Vancouver and Metro Vancouver, including commercial relocations, small office moves, file moves, furniture moves, packing, storage, and after-hours planning. This hub connects Vancouver businesses to the dedicated office movers in Vancouver, BC page and related commercial moving services.",
    cards: [
      [
        "Commercial moving hub",
        "Office moves, employee relocations, packing, storage, furniture disassembly, equipment handling, and phased relocation planning.",
      ],
      [
        "Metro Vancouver business areas",
        "Downtown Vancouver, Yaletown, Gastown, Mount Pleasant, False Creek, Kitsilano, Railtown, South Vancouver, Burnaby, Richmond, and nearby business districts.",
      ],
      [
        "Business move planning",
        "Written estimates, access review, elevator bookings, loading-zone planning, valuation coverage options, and direct accountability from estimate to move day.",
      ],
    ],
    links: [
      ["/office-movers-in-vancouver-bc/", "Office Movers in Vancouver BC"],
      ["/office/", "Office Moving"],
      ["/packing/", "Packing Services"],
      ["/storage/", "Storage"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/vancouver/", "Vancouver Movers"],
      ["/local/", "Local Moving"],
      ["/contact/", "Get an Office Moving Estimate"],
    ],
  },
];

const faqs = [
  [
    "Do you provide office movers in Vancouver, BC?",
    "Yes. Purely Canadian Movers provides office movers in Vancouver, BC for commercial relocations, small office moves, furniture moves, file moves, equipment moves, packing-supported moves, storage-supported moves, and phased business moves.",
  ],
  [
    "Can you move offices after hours or on weekends?",
    "Yes. Office moves can be planned around after-hours access, weekend timing, elevator bookings, loading-zone rules, building move windows, and business continuity needs.",
  ],
  [
    "What Vancouver office areas do you serve?",
    "Purely Canadian Movers serves downtown Vancouver, Yaletown, Gastown, Mount Pleasant, False Creek, Kitsilano, Railtown, Strathcona, South Vancouver, and nearby Metro Vancouver business districts.",
  ],
  [
    "How much do office movers in Vancouver cost?",
    "Vancouver office moving cost depends on office size, inventory, crew size, access, elevators, stairs, packing, storage, distance, timing, furniture disassembly, equipment handling, and specialty items. A written estimate is the best way to price the move accurately.",
  ],
  [
    "Can packing and storage be included with a Vancouver office move?",
    "Yes. Packing, unpacking, file packing, short-term storage, long-term storage, and valuation coverage options can be included with a Vancouver office moving estimate.",
  ],
  [
    "Do you use subcontractors for Vancouver office moves?",
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
    name: "Office Movers in Vancouver, BC",
    serviceType: "Office Moving Service",
    url: `https://purelycanadianmovers.com${page.route}`,
    description: page.description,
    provider: { "@id": "https://purelycanadianmovers.com/#organization" },
    areaServed: [
      { "@type": "City", name: "Vancouver" },
      { "@type": "Place", name: "Downtown Vancouver" },
      { "@type": "Place", name: "Yaletown" },
      { "@type": "Place", name: "Gastown" },
      { "@type": "Place", name: "Mount Pleasant" },
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
        <div class="pcm-local-seo__links"><h3>Related Vancouver office moving services</h3><div>
          ${links}
        </div></div>
        <div class="pcm-local-seo__faqs"><h3>Vancouver office moving questions</h3>
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
