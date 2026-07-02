import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const routes = ["moving-in-abbotsford-bc", "abbotsford"];

const title = "Movers in Abbotsford BC | Local, Acreage & Long-Distance";
const description =
  "Movers in Abbotsford BC for local, acreage, condo, packing, storage, and long-distance moves. Family-owned since 1991, BBB Accredited, no subcontractors.";
const canonical = "https://purelycanadianmovers.com/moving-in-abbotsford-bc/";

const faqItems = [
  {
    question: "Do you provide movers in Abbotsford, BC?",
    answer:
      "Yes. Purely Canadian Movers provides moving services in Abbotsford for local moves, condo moves, townhomes, houses, farms, acreages, packing-supported moves, storage-supported moves, and long-distance relocations.",
  },
  {
    question: "How much do movers in Abbotsford cost?",
    answer:
      "Abbotsford moving cost depends on home size, crew size, truck time, access, stairs, elevators, acreage or rural driveway access, packing, storage, travel time, and the amount being moved. A written estimate is the best way to price the move accurately.",
  },
  {
    question: "Do you move Abbotsford acreages and rural properties?",
    answer:
      "Yes. The team helps plan Abbotsford acreage, farm, rural property, and long driveway moves, including access details, parking, loading space, and larger household shipments.",
  },
  {
    question: "Which Abbotsford neighbourhoods do you serve?",
    answer:
      "Purely Canadian Movers serves Clearbrook, East Abbotsford, West Abbotsford, Matsqui, Auguston, Bradner, Sumas Prairie, McMillan, Townline, and nearby Fraser Valley communities.",
  },
  {
    question: "Can packing and storage be added to an Abbotsford move?",
    answer:
      "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included with an Abbotsford moving estimate.",
  },
  {
    question: "Do you use subcontractors for Abbotsford moves?",
    answer:
      "No. Purely Canadian Movers is a direct moving company, family-owned since 1991, with BBB Accreditation and direct accountability from estimate to moving day.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Movers in Abbotsford, BC",
  serviceType: "Moving Service",
  url: canonical,
  description,
  provider: { "@id": "https://purelycanadianmovers.com/#organization" },
  areaServed: [
    { "@type": "City", name: "Abbotsford" },
    { "@type": "AdministrativeArea", name: "Fraser Valley" },
    { "@type": "AdministrativeArea", name: "British Columbia" },
  ],
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://purelycanadianmovers.com/contact/",
    servicePhone: "+1-877-485-6683",
  },
};

const staticSection = `<section class="pcm-lead-boost pcm-local-seo" aria-label="Abbotsford movers for local, acreage, condo, and long-distance moves" data-pcm-static-local-seo="/moving-in-abbotsford-bc/">
      <div class="pcm-local-seo__inner">
        <h2>Movers in Abbotsford BC for local, acreage, condo, and long-distance moves</h2>
        <p>Purely Canadian Movers helps Abbotsford residents plan local moves, Fraser Valley moves, and long-distance relocations from condos, townhomes, detached homes, farms, and acreage properties. The team plans around Highway 1 timing, rural access, long driveways, elevators, storage needs, packing, and valuation coverage before moving day.</p>
        <div class="pcm-local-seo__cards">
          <article><h3>Abbotsford local moving</h3><p>Moving support for Clearbrook, East Abbotsford, West Abbotsford, McMillan, Townline, Auguston, Matsqui, Bradner, Sumas Prairie, and nearby Fraser Valley communities.</p></article>
          <article><h3>Acreage and rural property moves</h3><p>Planning for farms, acreages, long driveways, larger households, limited truck access, parking, loading areas, and specialty items common in Abbotsford moves.</p></article>
          <article><h3>Direct mover trust proof</h3><p>Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, written estimates, and Great Canadian Van Lines agent support for long-distance moves.</p></article>
        </div>
        <div class="pcm-local-seo__links"><h3>Related Abbotsford moving services</h3><div>
          <a href="/local/">Local Moving</a>
          <a href="/long-distance/">Long-Distance Moving</a>
          <a href="/packing/">Packing Services</a>
          <a href="/storage/">Storage</a>
          <a href="/valuation-coverage-protection/">Valuation Coverage</a>
          <a href="/surrey/">Surrey Movers</a>
          <a href="/langley/">Langley Movers</a>
          <a href="/maple-ridge/">Maple Ridge Movers</a>
          <a href="/white-rock/">White Rock Movers</a>
          <a href="/contact/">Get an Abbotsford Moving Estimate</a>
        </div></div>
        <div class="pcm-local-seo__faqs"><h3>Abbotsford moving questions</h3>
          ${faqItems.map((item) => `<details><summary>${item.question}</summary><p>${item.answer}</p></details>`).join("\n          ")}
        </div>
      </div>
    </section>`;

function replaceMeta(html, pattern, replacement) {
  if (!pattern.test(html)) {
    return html;
  }
  return html.replace(pattern, replacement);
}

function patchHtml(html, route) {
  html = replaceMeta(html, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = replaceMeta(
    html,
    /<meta name="description" content="[^"]*" \/>/i,
    `<meta name="description" content="${description}" />`,
  );
  html = replaceMeta(
    html,
    /<meta property="og:title" content="[^"]*" \/>/i,
    `<meta property="og:title" content="${title}" />`,
  );
  html = replaceMeta(
    html,
    /<meta property="og:description" content="[^"]*" \/>/i,
    `<meta property="og:description" content="${description}" />`,
  );
  html = replaceMeta(
    html,
    /<meta property="og:url" content="[^"]*" \/>/i,
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = replaceMeta(
    html,
    /<meta name="twitter:title" content="[^"]*" \/>/i,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = replaceMeta(
    html,
    /<meta name="twitter:description" content="[^"]*" \/>/i,
    `<meta name="twitter:description" content="${description}" />`,
  );
  html = replaceMeta(
    html,
    /<link rel="canonical" id="canonical-tag" href="[^"]*" \/>/i,
    `<link rel="canonical" id="canonical-tag" href="${canonical}" />`,
  );
  html = html.replace(
    /\s*<script>\s*\(function\(\) \{\s*var canon = document\.getElementById\('canonical-tag'\);\s*if \(canon\) canon\.href = 'https:\/\/purelycanadianmovers\.com' \+ window\.location\.pathname;\s*\}\)\(\);\s*<\/script>/,
    "",
  );

  html = html.replace(
    /<script type="application\/ld\+json" id="static-service-schema">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="static-service-schema">${JSON.stringify(serviceSchema)}</script>`,
  );

  if (!html.includes('data-pcm-static-faq-schema="/moving-in-abbotsford-bc/"')) {
    html = html.replace(
      "</head>",
      `    <script type="application/ld+json" data-pcm-static-faq-schema="/moving-in-abbotsford-bc/">${JSON.stringify(faqSchema)}</script>\n  </head>`,
    );
  }

  html = html.replace(/<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*<div id="root"><\/div>/, `<div id="root"></div>`);
  html = html.replace('<div id="root"></div>', `${staticSection}\n    <div id="root"></div>`);

  if (route === "abbotsford" && !html.includes('<meta name="robots" content="noindex, follow"')) {
    html = html.replace(
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />',
      '<meta name="robots" content="noindex, follow" />',
    );
  }

  return html;
}

for (const route of routes) {
  const path = join("site-copy", route, "index.html");
  const html = await readFile(path, "utf8");
  await writeFile(path, patchHtml(html, route));
  console.log(`Patched ${path}`);
}

