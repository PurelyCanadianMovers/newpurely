import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { injectOpenAiAdsPixel } from "./openai-ads-pixel.mjs";
import { isLongDistanceRouteUrl, routeOwnershipByUrl } from "./route-page-ownership.mjs";

const outDir = process.argv[2] ?? "site-copy";
const index = await readFile(join(outDir, "index.html"), "utf8");
const bundlePath = join(outDir, "assets", "index-CNBNs70h.js");
let bundle = await readFile(bundlePath, "utf8");
const routeTitleInputFixes = [
  [
    'title:"Montreal to Victoria & Nanaimo Movers | Purely Canadian Movers"',
    'title:"Montreal to Victoria & Nanaimo Movers"',
  ],
  [
    'title:"Ottawa to Victoria & Nanaimo Movers | Purely Canadian Movers"',
    'title:"Ottawa to Victoria & Nanaimo Movers"',
  ],
];

let normalizedBundle = bundle;
for (const [duplicatingInput, normalizedInput] of routeTitleInputFixes) {
  const duplicatingCount = normalizedBundle.split(duplicatingInput).length - 1;
  const normalizedCount = normalizedBundle.split(normalizedInput).length - 1;
  if (duplicatingCount === 1 && normalizedCount === 0) {
    normalizedBundle = normalizedBundle.replace(duplicatingInput, normalizedInput);
  } else if (duplicatingCount !== 0 || normalizedCount !== 1) {
    throw new Error(`Unexpected route title input state for ${normalizedInput}`);
  }
}
const bcWashingtonLegacyPricingHeading = "BC to Washington State Moving Cost Breakdown";
const bcWashingtonCanonicalPricingHeading = "BC to Washington State Moving Costs";
const bcWashingtonFaqTypographyStyle = `  <style data-pcm-bc-washington-faq-typography>
    .pcm-route-faq-static summary {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
    }
  </style>`;
const bcWashingtonLegacyPricingCount = normalizedBundle.split(bcWashingtonLegacyPricingHeading).length - 1;
const bcWashingtonCanonicalPricingCount = normalizedBundle.split(bcWashingtonCanonicalPricingHeading).length - 1;
if (bcWashingtonLegacyPricingCount === 1 && bcWashingtonCanonicalPricingCount === 0) {
  normalizedBundle = normalizedBundle.replace(
    bcWashingtonLegacyPricingHeading,
    bcWashingtonCanonicalPricingHeading,
  );
} else if (bcWashingtonLegacyPricingCount !== 0 || bcWashingtonCanonicalPricingCount !== 1) {
  throw new Error("Unexpected BC to Washington pricing-heading source state");
}
if (normalizedBundle !== bundle) {
  await writeFile(bundlePath, normalizedBundle, "utf8");
  bundle = normalizedBundle;
}
const siteOrigin = "https://purelycanadianmovers.com";
const privateRoutePrefixes = ["/admin/", "/404/"];
const sitemapExcludedRoutes = new Set([
  "/calgary-to-edmonton-movers/",
  "/edmonton-to-calgary-movers/",
  "/movers-calgary-to-edmonton/",
  "/movers-edmonton-to-calgary/",
  "/movers-toronto-to-vancouver/",
  "/movers-vancouver-to-montreal/",
  "/movers-vancouver-to-ottawa/",
  "/movers-vancouver-to-halifax/",
  "/movers-vancouver-to-toronto/",
]);
const manualPublicRoutes = [
  // Step 35A: these canonical routes are hydration-free checked-in static
  // sources. Keep them discoverable so the ownership guard records an explicit
  // skip; the compiled router has no exact canonical registration for either.
  "/calgary-to-edmonton-movers/",
  "/edmonton-to-calgary-movers/",
  // Step 37A: the exact compiled route falls back to the Vancouver homepage.
  // Discovery must reach the ownership guard so the complete checked-in static
  // document is preserved instead of receiving a generic SPA entry document.
  "/edmonton-to-ottawa-movers/",
  // This route is served by a standalone static page because the recovered React
  // bundle has no matching client route and would otherwise replace it with /404.
  "/port-coquitlam/",
  "/halifax-to-calgary-movers/",
  "/calgary-to-halifax-movers/",
  "/halifax-to-vancouver-movers/",
  "/calgary-to-montreal-movers/",
  "/vancouver-to-seattle-movers/",
  "/seattle-to-vancouver-movers/",
  "/toronto-to-vancouver-movers/",
  // Dedicated static route: include it in discovery/sitemap, then let the
  // ownership guard below skip SPA output because the bundle has no route.
  "/vancouver-to-edmonton-movers/",
  "/victoria-to-vancouver-movers/",
  "/victoria-to-toronto-movers/",
  // Checked-in hydration-free route. The compiled SPA bundle does not register
  // this path, so route discovery records an ownership skip and preserves it.
  "/victoria-to-montreal-movers/",
  "/vancouver-to-montreal-movers/",
  "/vancouver-to-ottawa-movers/",
  "/vancouver-to-halifax-movers/",
  "/vancouver-to-toronto-movers/",
  "/toronto-to-winnipeg-movers/",
  "/winnipeg-to-toronto-movers/",
  "/winnipeg-to-montreal-movers/",
  "/montreal-to-winnipeg-movers/",
  "/calgary-to-ottawa-movers/",
  "/ottawa-to-calgary-movers/",
  "/victoria-to-ottawa-movers/",
  "/ottawa-to-toronto-movers/",
  "/toronto-to-ottawa-movers/",
  "/office-movers-coquitlam/",
];
const aggregatePreservedRoutes = new Map([
  // Preserve the checked-in About document. Rebuilding it from the generic SPA
  // entry shell discards its route-specific metadata/content and needlessly
  // opens the OneDrive-backed file during every aggregate route build.
  ["/about/", "static page"],
  // The checked-in Calgary hub is the authoritative document. Calgary-specific
  // writers below the SPA stage own only its route-list block.
  ["/calgary-long-distance-movers/", "static/hub page"],
  // Preserve the checked-in Edmonton hub. Its route writer owns only the
  // marked route-list block; unrelated shared-footer content must survive.
  ["/edmonton-long-distance-movers/", "static/hub page"],
  // The checked-in Toronto hub is also authoritative. Its route writer owns
  // only the marked Routes From Toronto block.
  ["/toronto-long-distance-movers/", "static/hub page"],
  // The checked-in Winnipeg hub is owned by build-winnipeg-hub.mjs.
  ["/winnipeg-long-distance-movers/", "static/hub page"],
  // The checked-in Ottawa hub is also authoritative. Ottawa-specific writers
  // own only its marked canonical route-list block.
  ["/ottawa-long-distance-movers/", "static/hub page"],
  // The checked-in Victoria hub is also authoritative. The Victoria/Ottawa
  // writer owns only its marked canonical route-list block.
  ["/victoria-long-distance-movers/", "static/hub page"],
]);
const standaloneStaticRoutes = new Set([
  "/calgary-to-edmonton-movers/",
  "/edmonton-to-calgary-movers/",
  "/port-coquitlam/",
  "/long-distance-moving-cost-canada/",
  "/halifax-to-calgary-movers/",
  "/calgary-to-halifax-movers/",
  "/halifax-to-vancouver-movers/",
  "/calgary-to-montreal-movers/",
  "/vancouver-to-seattle-movers/",
  "/seattle-to-vancouver-movers/",
  "/victoria-to-vancouver-movers/",
  "/victoria-to-toronto-movers/",
  "/toronto-to-winnipeg-movers/",
  "/winnipeg-to-toronto-movers/",
  "/winnipeg-to-montreal-movers/",
  "/montreal-to-winnipeg-movers/",
  "/calgary-to-ottawa-movers/",
  "/ottawa-to-calgary-movers/",
  "/victoria-to-ottawa-movers/",
  "/ottawa-to-toronto-movers/",
  "/toronto-to-ottawa-movers/",
  "/office-movers-coquitlam/",
]);
const routeHeadOverrides = {
  "/bc-to-washington-movers/": {
    title: "BC to Washington State Movers | Overnight Service | Purely Canadian Movers",
    description:
      "BC to Washington movers with overnight service. Specializing in Amazon and Microsoft employee relocations. Cross-border experts. Free estimates.",
    canonical: "https://purelycanadianmovers.com/bc-to-washington-movers/",
  },
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

const routeTitleOverrides = {
  "/montreal-to-victoria-movers/": "Montreal to Victoria & Nanaimo Movers | Purely Canadian Movers",
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
for (const route of manualPublicRoutes) {
  routes.add(route);
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
  const titleOverride = routeTitleOverrides[route];
  if (titleOverride) {
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(titleOverride)}</title>`)
      .replace(
        /<meta property="og:title" content="[^"]*" \/>/,
        `<meta property="og:title" content="${escapeHtml(titleOverride)}" />`,
      )
      .replace(
        /<meta name="twitter:title" content="[^"]*" \/>/,
        `<meta name="twitter:title" content="${escapeHtml(titleOverride)}" />`,
      );
  }
  const override = routeHeadOverrides[route];
  if (!override) return html;

  let next = html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(override.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(override.description)}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtml(override.title)}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtml(override.description)}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${escapeHtml(override.canonical)}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtml(override.title)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtml(override.description)}" />`,
    );

  if (override.jsonLd) {
    const script = `<script type="application/ld+json">${JSON.stringify(override.jsonLd)}</script>`;
    next = next.replace("</head>", `  ${script}\n</head>`);
  }

  if (override.canonical) {
    next = next.replace(
      /<link rel="canonical" id="canonical-tag" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" id="canonical-tag" href="${escapeHtml(override.canonical)}" />`,
    );
    next = next.replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${escapeHtml(override.canonical)}" />`,
    );
  }

  if (route === "/bc-to-washington-movers/") {
    next = next
      .replace(/[ \t]*<style data-pcm-bc-washington-faq-typography>[\s\S]*?<\/style>\r?\n?/g, "")
      .replace("</head>", `${bcWashingtonFaqTypographyStyle}\n</head>`);
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
  const target = join(outDir, file);
  const ownership = routeOwnershipByUrl.get(route);
  if (ownership && ownership.owner !== "generate-spa-routes.mjs" && !isLongDistanceRouteUrl(route)) {
    console.log(`Ownership skip: ${route} belongs to ${ownership.owner}.`);
    continue;
  }
  if (isLongDistanceRouteUrl(route)) {
    const ownership = routeOwnershipByUrl.get(route);
    if (!ownership) throw new Error(`ERROR: ${route} has no declared full-page owner.`);
    if (ownership.owner !== "generate-spa-routes.mjs") {
      console.log(`Ownership skip: ${route} belongs to ${ownership.owner}.`);
      continue;
    }
    // The recovered SPA has no server renderer: cloning the homepage entry
    // document here overwrites route-specific raw HTML whenever unrelated
    // homepage markup changes. Existing owned route outputs are therefore the
    // authoritative static inputs to their registered, route-scoped
    // finalizers. Generate the generic entry document only for a missing route.
    if (existsSync(target)) {
      if (route === "/bc-to-washington-movers/") {
        const existingHtml = await readFile(target, "utf8");
        const normalizedHtml = applyHeadOverride(existingHtml, route);
        if (normalizedHtml !== existingHtml) await writeFile(target, normalizedHtml, "utf8");
      }
      console.log(`Preserve existing SPA-owned route output: ${route}`);
      continue;
    }
  }
  if (aggregatePreservedRoutes.has(route)) {
    console.log(`Preserve existing ${aggregatePreservedRoutes.get(route)}: ${route}`);
    continue;
  }
  if (standaloneStaticRoutes.has(route)) continue;
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
  html = injectOpenAiAdsPixel(html);

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

const publicRoutes = [...routes]
  .filter((route) => !isPrivateRoute(route) && !sitemapExcludedRoutes.has(route))
  .sort();
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
