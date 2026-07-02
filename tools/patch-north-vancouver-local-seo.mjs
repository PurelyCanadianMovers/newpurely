import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const pages = [
  {
    file: "site-copy/north-vancouver/index.html",
    route: "/north-vancouver/",
    title: "Movers in North Vancouver BC | Local, Condo & Long-Distance",
    description:
      "Movers in North Vancouver BC for condos, apartments, houses, packing, storage, and long-distance moves. Family-owned since 1991, BBB Accredited, no subcontractors.",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    h2: "Movers in North Vancouver, BC for local, condo, house, and long-distance moves",
    intro:
      "Purely Canadian Movers helps North Vancouver residents plan moves from Lower Lonsdale condo towers, Central Lonsdale apartments, Lynn Valley family homes, Deep Cove properties, Edgemont houses, and North Shore townhomes. The team plans around hills, narrow streets, strata move windows, elevator bookings, loading access, parking limits, packing, storage, and valuation coverage before moving day.",
    cards: [
      [
        "North Vancouver condo and apartment moves",
        "Move planning for Lower Lonsdale, Central Lonsdale, Capilano, Norgate, Queensbury, and other North Vancouver buildings with elevators, loading zones, and strata rules.",
      ],
      [
        "North Shore house and townhouse moves",
        "Support for Lynn Valley, Deep Cove, Edgemont, Upper Lonsdale, Blueridge, Seymour, Canyon Heights, and hillside neighbourhoods with tight streets or steep access.",
      ],
      [
        "Direct mover trust proof",
        "Family-owned since 1991, BBB Accredited, no subcontractors, written estimates, valuation coverage options, and Great Canadian Van Lines agent support for long-distance moves.",
      ],
    ],
    linksHeading: "Related North Vancouver moving services",
    links: [
      ["/local-movers-north-vancouver-bc/", "Local Movers in North Vancouver"],
      ["/local/", "Local Moving"],
      ["/long-distance/", "Long-Distance Moving"],
      ["/packing/", "Packing Services"],
      ["/storage/", "Storage"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/vancouver/", "Vancouver Movers"],
      ["/burnaby/", "Burnaby Movers"],
      ["/contact/", "Get a North Vancouver Moving Estimate"],
    ],
  },
  {
    file: "site-copy/local-movers-north-vancouver-bc/index.html",
    route: "/local-movers-north-vancouver-bc/",
    title: "Movers in North Vancouver BC | Local Condo & House Movers",
    description:
      "Movers in North Vancouver BC for local condo, apartment, townhouse, house, packing, and storage moves. Since 1991, BBB Accredited, no subcontractors.",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    h2: "Local movers in North Vancouver, BC for condos, apartments, townhomes, and houses",
    intro:
      "Purely Canadian Movers helps North Vancouver residents plan local moves in condo towers, apartments, townhomes, detached homes, and offices. This page focuses on movers in North Vancouver, BC, including North Shore building access, hillside streets, elevator bookings, strata timing, parking limits, packing, storage, and quote factors that matter before moving day.",
    cards: [
      [
        "North Vancouver condo and apartment moves",
        "Move planning for elevator bookings, loading access, parking limits, strata move windows, narrow streets, and building rules.",
      ],
      [
        "North Vancouver neighbourhood coverage",
        "Lower Lonsdale, Central Lonsdale, Lynn Valley, Deep Cove, Edgemont, Capilano, Queensbury, Norgate, Upper Lonsdale, Blueridge, and Seymour.",
      ],
      [
        "Local mover trust proof",
        "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, written estimates, and direct accountability on moving day.",
      ],
    ],
    linksHeading: "Related North Vancouver local moving services",
    links: [
      ["/north-vancouver/", "North Vancouver Moving Hub"],
      ["/local/", "Local Moving"],
      ["/packing/", "Packing Services"],
      ["/storage/", "Storage"],
      ["/valuation-coverage-protection/", "Valuation Coverage"],
      ["/vancouver/", "Vancouver Movers"],
      ["/burnaby/", "Burnaby Movers"],
      ["/contact/", "Get a North Vancouver Local Moving Estimate"],
    ],
  },
];

const faqs = [
  [
    "Do you provide movers in North Vancouver, BC?",
    "Yes. Purely Canadian Movers provides movers in North Vancouver, BC for local moves, condo moves, apartment moves, townhomes, houses, packing-supported moves, storage-supported moves, and long-distance relocations.",
  ],
  [
    "How much do movers in North Vancouver cost?",
    "North Vancouver moving cost depends on home size, crew size, truck time, elevator bookings, stairs, parking, hillside or narrow-street access, packing, storage, travel time, and the amount being moved. A written estimate is the best way to price the move accurately.",
  ],
  [
    "Do you move North Vancouver condos and apartments?",
    "Yes. The team handles North Vancouver condo and apartment moves, including elevator reservations, loading-zone planning, strata move windows, parking limits, and building access requirements.",
  ],
  [
    "Which North Vancouver neighbourhoods do you serve?",
    "Purely Canadian Movers serves Lower Lonsdale, Central Lonsdale, Lynn Valley, Deep Cove, Edgemont, Capilano, Queensbury, Norgate, Upper Lonsdale, Blueridge, Seymour, and nearby North Shore communities.",
  ],
  [
    "Can packing and storage be added to a North Vancouver move?",
    "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included with a North Vancouver moving estimate.",
  ],
  [
    "Do you use subcontractors for North Vancouver moves?",
    "No. Purely Canadian Movers is a direct moving company, family-owned since 1991, with BBB Accreditation and direct accountability from estimate to moving day.",
  ],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setMeta(html, name, content) {
  const re = new RegExp(
    `<meta name="${escapeRegExp(name)}" content="[^"]*"\\s*/?>`
  );
  return html.replace(re, `<meta name="${name}" content="${content}" />`);
}

function setProperty(html, property, content) {
  const re = new RegExp(
    `<meta property="${escapeRegExp(property)}" content="[^"]*"\\s*/?>`
  );
  return html.replace(re, `<meta property="${property}" content="${content}" />`);
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
}

function setCanonical(html, route) {
  const href = `https://purelycanadianmovers.com${route}`;
  html = html.replace(
    /<link rel="canonical" id="canonical-tag" href="[^"]*" \/>/,
    `<link rel="canonical" id="canonical-tag" href="${href}" />`
  );
  return html.replace(
    /\s*<script>\s*\(function\(\) \{\s*var canon = document\.getElementById\('canonical-tag'\);\s*if \(canon\) canon\.href = 'https:\/\/purelycanadianmovers\.com' \+ window\.location\.pathname;\s*\}\)\(\);\s*<\/script>/,
    ""
  );
}

function faqSchema(route) {
  const mainEntity = faqs.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  }));

  return `<script type="application/ld+json" data-pcm-static-faq-schema="${route}">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  })}</script>`;
}

function serviceSchema(page) {
  return `<script type="application/ld+json" id="static-service-schema">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Movers in North Vancouver, BC",
    serviceType: "Moving Service",
    url: `https://purelycanadianmovers.com${page.route}`,
    description: page.description,
    provider: { "@id": "https://purelycanadianmovers.com/#organization" },
    areaServed: [
      { "@type": "City", name: "North Vancouver" },
      { "@type": "AdministrativeArea", name: "North Shore" },
      { "@type": "AdministrativeArea", name: "British Columbia" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://purelycanadianmovers.com/contact/",
      servicePhone: "+1-877-485-6683",
    },
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
        <div class="pcm-local-seo__faqs"><h3>North Vancouver moving questions</h3>
          ${details}
        </div>
      </div>
    </section>`;
}

for (const page of pages) {
  const fullPath = path.join(root, page.file);
  let html = fs.readFileSync(fullPath, "utf8");

  html = setTitle(html, page.title);
  html = setMeta(html, "description", page.description);
  html = setMeta(html, "robots", page.robots);
  html = setProperty(html, "og:title", page.title);
  html = setProperty(html, "og:description", page.description);
  html = setProperty(html, "og:url", `https://purelycanadianmovers.com${page.route}`);
  html = setMeta(html, "twitter:title", page.title);
  html = setMeta(html, "twitter:description", page.description);
  html = setCanonical(html, page.route);

  html = html.replace(
    /<script type="application\/ld\+json" id="static-service-schema">[\s\S]*?<\/script>/,
    serviceSchema(page)
  );

  if (html.includes("data-pcm-static-faq-schema=")) {
    html = html.replace(
      /<script type="application\/ld\+json" data-pcm-static-faq-schema="[^"]*">[\s\S]*?<\/script>/,
      faqSchema(page.route)
    );
  } else {
    html = html.replace("</head>", `    ${faqSchema(page.route)}\n  </head>`);
  }

  const section = staticSection(page);
  html = html.replace(
    /<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*<div id="root"><\/div>/,
    `${section}\n    <div id="root"></div>`
  );

  fs.writeFileSync(fullPath, html);
  console.log(`Patched ${page.file}`);
}
