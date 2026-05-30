import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";

const outDir = process.argv[2] ?? "site-copy";
const index = await readFile(join(outDir, "index.html"), "utf8");
const bundle = await readFile(join(outDir, "assets", "index-CNBNs70h.js"), "utf8");
const siteOrigin = "https://purelycanadianmovers.com";
const privateRoutePrefixes = ["/admin/", "/404/"];
const routeHeadOverrides = {
  "/local-movers-burnaby-bc/": {
    title: "Local Movers in Burnaby, BC | Purely Canadian Movers",
    description:
      "Local movers in Burnaby, BC for condos, townhomes, houses, and apartments. Family-owned since 1991, BBB Accredited, no subcontractors.",
    canonical: "https://purelycanadianmovers.com/local-movers-burnaby-bc/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much do local movers in Burnaby cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Local moving costs in Burnaby depend on home size, crew size, access, stairs or elevator bookings, packing, and the time required. Purely Canadian Movers provides a free estimate before booking.",
          },
        },
        {
          "@type": "Question",
          name: "Do you move Burnaby condos and high-rises?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Purely Canadian Movers handles Burnaby condo, apartment, townhouse, and house moves, including elevator booking requirements, loading zones, and building access planning.",
          },
        },
        {
          "@type": "Question",
          name: "Which Burnaby neighbourhoods do you serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Purely Canadian Movers serves Burnaby neighbourhoods including Metrotown, Brentwood, Edmonds, Lougheed, Deer Lake, Capitol Hill, South Slope, and nearby Metro Vancouver communities.",
          },
        },
        {
          "@type": "Question",
          name: "Do you use subcontractors for Burnaby local moves?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Purely Canadian Movers is family-owned and does not use subcontractors. Burnaby moves are handled by trained moving crews with local Metro Vancouver experience.",
          },
        },
      ],
    },
  },
  "/valuation-coverage-protection/": {
    title: "Moving Valuation Coverage in Vancouver & Canada",
    description:
      "Learn how moving valuation coverage works for Vancouver local, long-distance, and cross-country moves. See protection options, claims basics, and high-value item tips.",
    canonical: "https://purelycanadianmovers.com/valuation-coverage-protection/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is moving valuation coverage the same as insurance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Moving valuation coverage is not the same as a separate insurance policy. It is the carrier protection level applied to your shipment, and Purely Canadian Movers explains available options before Vancouver, local, or long-distance moves.",
          },
        },
        {
          "@type": "Question",
          name: "Is valuation coverage included with my move?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Basic carrier liability is included with moves, while higher protection levels may be available depending on the move type, shipment details, and declared value.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need extra coverage for a long-distance move across Canada?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Extra valuation coverage is worth discussing for long-distance and cross-country moves, especially when moving antiques, electronics, artwork, fragile items, or a large household shipment from Vancouver or Metro Vancouver to another province.",
          },
        },
        {
          "@type": "Question",
          name: "How do I file a moving damage claim?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Document any damage at delivery, keep packing materials, take photos, and contact Purely Canadian Movers promptly with item details and proof of value. Claims are reviewed according to the selected coverage level.",
          },
        },
      ],
    },
  },
};

const routes = new Set(["/"]);
const routePatterns = [
  /\bhref:"(\/[a-z0-9][a-z0-9/-]*\/)"/gi,
  /\bcanonical:"(\/[a-z0-9][a-z0-9/-]*\/)"/gi,
  /\bpath:"(\/[a-z0-9][a-z0-9/-]*\/?)"/gi,
];

for (const pattern of routePatterns) {
  for (const match of bundle.matchAll(pattern)) {
    if (!match[1].startsWith("/assets/")) routes.add(match[1].endsWith("/") ? match[1] : `${match[1]}/`);
  }
}

function isPrivateRoute(route) {
  return privateRoutePrefixes.some((prefix) => route.startsWith(prefix));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
}

function applyHeadOverride(html, route) {
  const override = routeHeadOverrides[route];
  if (!override) return html;

  let next = html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(override.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(override.description)}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(override.title)}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(override.description)}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${escapeHtml(override.canonical)}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(override.title)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(override.description)}" />`,
    );

  if (override.jsonLd) {
    const script = `<script type="application/ld+json">${JSON.stringify(override.jsonLd)}</script>`;
    next = next.replace("</head>", `  ${script}\n</head>`);
  }

  if (override.canonical) {
    next = next.replace(
      /<link rel="canonical" id="canonical-tag" href="[^"]*" \/>/,
      `<link rel="canonical" id="canonical-tag" href="${escapeHtml(override.canonical)}" />`,
    );
    next = next.replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escapeHtml(override.canonical)}" />`,
    );
  }

  return next;
}

function routeFile(route) {
  if (route === "/") return "index.html";
  return posix.join(route.replace(/^\/|\/$/g, ""), "index.html");
}

function depth(route) {
  return route.replace(/^\/|\/$/g, "").split("/").filter(Boolean).length;
}

for (const route of routes) {
  const file = routeFile(route);
  const prefix = depth(route) === 0 ? "." : Array(depth(route)).fill("..").join("/");
  let html = index
    .replaceAll("./assets/", `${prefix}/assets/`)
    .replaceAll("./external/", `${prefix}/external/`)
    .replaceAll('href="./index.html"', `href="${prefix}/index.html"`);

  if (isPrivateRoute(route)) {
    html = html.replace(
      /<meta name="robots" content="[^"]*" \/>/,
      '<meta name="robots" content="noindex, nofollow, noarchive" />',
    );
  }
  html = applyHeadOverride(html, route);

  const target = join(outDir, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

const publicRoutes = [...routes].filter((route) => !isPrivateRoute(route)).sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes
  .map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`)
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Disallow: /admin/
Disallow: /404/

Sitemap: ${siteOrigin}/sitemap.xml
`;

await writeFile(join(outDir, "sitemap.xml"), sitemap);
await writeFile(join(outDir, "robots.txt"), robots);

console.log(`generated ${routes.size} route entry files`);
