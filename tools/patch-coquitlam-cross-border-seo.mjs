import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const canadaUsaPath = path.join(root, "site-copy/canada-usa/index.html");
const coquitlamPaths = [
  path.join(root, "site-copy/coquitlam/index.html"),
  path.join(root, "site-copy/coquitlam-bc/index.html"),
];

const canadaUsaTitle =
  "Cross-Border Movers in Coquitlam BC | Canada-USA Moving";
const canadaUsaDescription =
  "Cross-border movers in Coquitlam BC for Canada-USA household moves, customs paperwork planning, packing, storage, valuation coverage, and written estimates.";

const faqs = [
  [
    "Do you provide cross-border movers in Coquitlam, BC?",
    "Yes. Purely Canadian Movers helps Coquitlam customers plan Canada-USA and U.S.-bound household moves, including packing, storage, valuation coverage options, customs-aware planning, and written estimates.",
  ],
  [
    "What paperwork is needed for a Canada to U.S. household move?",
    "Cross-border moves often require a detailed inventory, personal identification, U.S. customs paperwork, and documentation for household goods. Requirements can vary, so the team reviews the route and paperwork needs during the estimate process.",
  ],
  [
    "Can packing and storage be included with a Coquitlam cross-border move?",
    "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included with a Coquitlam cross-border moving estimate.",
  ],
  [
    "Do cross-border moving costs depend on weight or volume?",
    "Cross-border moving cost is commonly priced based on either shipment weight or volume, plus route, access, packing, storage, valuation coverage, timing, and customs-related planning details.",
  ],
  [
    "Are you a moving broker?",
    "No. Purely Canadian Movers is a direct moving company based in Coquitlam. For cross-border moves, the team provides direct estimate support, clear documentation, and coordinated moving accountability rather than broker-style handoffs to unknown movers.",
  ],
];

function replaceMeta(html, selector, content) {
  const [attr, value] = selector;
  const re = new RegExp(
    `<meta ${attr}="${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" content="[^"]*"\\s*/?>`
  );
  return html.replace(re, `<meta ${attr}="${value}" content="${content}" />`);
}

function removeDynamicCanonical(html) {
  return html.replace(
    /\s*<script>\s*\(function\(\) \{\s*var canon = document\.getElementById\('canonical-tag'\);\s*if \(canon\) canon\.href = 'https:\/\/purelycanadianmovers\.com' \+ window\.location\.pathname;\s*\}\)\(\);\s*<\/script>/,
    ""
  );
}

function faqSchema() {
  const mainEntity = faqs.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  }));
  return `<script type="application/ld+json" data-pcm-static-faq-schema="/canada-usa/">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  })}</script>`;
}

function serviceSchema() {
  return `<script type="application/ld+json" id="static-service-schema">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cross-Border Movers in Coquitlam, BC",
    serviceType: "Canada-USA Moving Service",
    url: "https://purelycanadianmovers.com/canada-usa/",
    description: canadaUsaDescription,
    provider: { "@id": "https://purelycanadianmovers.com/#organization" },
    areaServed: [
      { "@type": "City", name: "Coquitlam" },
      { "@type": "AdministrativeArea", name: "Metro Vancouver" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://purelycanadianmovers.com/contact/",
      servicePhone: "+1-877-485-6683",
    },
  })}</script>`;
}

function crossBorderSection() {
  const details = faqs
    .map(
      ([question, answer]) =>
        `<details><summary>${question}</summary><p>${answer}</p></details>`
    )
    .join("\n          ");

  return `<section class="pcm-lead-boost pcm-local-seo" aria-label="Cross-border movers in Coquitlam BC for Canada-USA moves" data-pcm-static-local-seo="/canada-usa/">
      <div class="pcm-local-seo__inner">
        <h2>Cross-border movers in Coquitlam, BC for Canada-USA household moves</h2>
        <p>Purely Canadian Movers helps Coquitlam and Metro Vancouver customers plan moves from Canada to the United States, including household inventory preparation, packing, storage, valuation coverage options, customs-aware planning, and written estimates. Based in Coquitlam since 1991, the team helps customers understand timing, access, shipment size, and documentation before moving day.</p>
        <div class="pcm-local-seo__cards">
          <article><h3>Coquitlam to U.S. moving support</h3><p>Cross-border planning for Coquitlam homes, condos, apartments, townhomes, offices, and storage-supported moves headed to U.S. destinations.</p></article>
          <article><h3>Customs-aware moving preparation</h3><p>Support with inventory details, packing lists, valuation coverage discussions, route planning, and paperwork questions before a Canada-USA move.</p></article>
          <article><h3>Direct mover accountability</h3><p>Family-owned since 1991, BBB Accredited, based in Coquitlam, with written estimates and no broker-style handoffs to unknown movers.</p></article>
        </div>
        <div class="pcm-local-seo__links"><h3>Related cross-border and Coquitlam moving services</h3><div>
          <a href="/coquitlam/">Coquitlam Movers</a>
          <a href="/coquitlam-bc/">Coquitlam Moving Company</a>
          <a href="/local-movers-in-coquitlam-bc/">Local Movers in Coquitlam</a>
          <a href="/long-distance/">Long-Distance Moving</a>
          <a href="/cross-country-movers/">Cross-Country Movers</a>
          <a href="/packing/">Packing Services</a>
          <a href="/storage/">Storage</a>
          <a href="/valuation-coverage-protection/">Valuation Coverage</a>
          <a href="/contact/">Get a Cross-Border Moving Estimate</a>
        </div></div>
        <div class="pcm-local-seo__faqs"><h3>Coquitlam cross-border moving questions</h3>
          ${details}
        </div>
      </div>
    </section>`;
}

function patchCanadaUsa() {
  let html = fs.readFileSync(canadaUsaPath, "utf8");
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${canadaUsaTitle}</title>`);
  html = replaceMeta(html, ["name", "description"], canadaUsaDescription);
  html = replaceMeta(html, ["property", "og:title"], canadaUsaTitle);
  html = replaceMeta(html, ["property", "og:description"], canadaUsaDescription);
  html = replaceMeta(html, ["name", "twitter:title"], canadaUsaTitle);
  html = replaceMeta(html, ["name", "twitter:description"], canadaUsaDescription);
  html = html.replace(
    /<link rel="canonical" id="canonical-tag" href="[^"]*" \/>/,
    '<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com/canada-usa/" />'
  );
  html = removeDynamicCanonical(html);

  if (html.includes('id="static-service-schema"')) {
    html = html.replace(
      /<script type="application\/ld\+json" id="static-service-schema">[\s\S]*?<\/script>/,
      serviceSchema()
    );
  } else {
    html = html.replace("</head>", `    ${serviceSchema()}\n  </head>`);
  }

  if (html.includes("data-pcm-static-faq-schema=")) {
    html = html.replace(
      /<script type="application\/ld\+json" data-pcm-static-faq-schema="[^"]*">[\s\S]*?<\/script>/,
      faqSchema()
    );
  } else {
    html = html.replace("</head>", `    ${faqSchema()}\n  </head>`);
  }

  const section = crossBorderSection();
  if (html.includes("data-pcm-static-local-seo=\"/canada-usa/\"")) {
    html = html.replace(
      /<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*<div id="root"><\/div>/,
      `${section}\n    <div id="root"></div>`
    );
  } else {
    html = html.replace("<div id=\"root\"></div>", `${section}\n    <div id="root"></div>`);
  }

  fs.writeFileSync(canadaUsaPath, html);
  console.log("Patched site-copy/canada-usa/index.html");
}

function patchCoquitlamHub(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  if (!html.includes('/canada-usa/">Canada-USA Moving</a>')) {
    html = html.replace(
      '<a href="/long-distance/">Long-Distance Moving</a>',
      '<a href="/long-distance/">Long-Distance Moving</a>\n          <a href="/canada-usa/">Canada-USA Moving</a>'
    );
  }
  if (!html.includes("cross-border movers in Coquitlam")) {
    html = html.replace(
      /<article><h3>Service cluster<\/h3><p>([\s\S]*?)<\/p><\/article>/,
      '<article><h3>Service cluster</h3><p>$1</p></article>\n          <article><h3>Cross-border movers in Coquitlam</h3><p>Canada-USA moving support from Coquitlam, including customs-aware planning, packing, storage, valuation coverage options, and written estimates.</p></article>'
    );
  }
  fs.writeFileSync(filePath, html);
  console.log(`Patched ${path.relative(root, filePath)}`);
}

patchCanadaUsa();
for (const filePath of coquitlamPaths) {
  patchCoquitlamHub(filePath);
}
