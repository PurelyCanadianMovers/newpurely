import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";
import { extractVisibleFaqs, faqParityDifferences } from "./faq-parity.mjs";
import { VANCOUVER_WINNIPEG_FACTS, VANCOUVER_WINNIPEG_ROUTES } from "./vancouver-winnipeg-route-data.mjs";

const root = process.argv[2] || "site-copy";
const templates = {
  "vancouver-to-winnipeg-movers": new URL("./templates/winnipeg-routes/vancouver-to-winnipeg-movers.html", import.meta.url),
  "winnipeg-to-vancouver-movers": new URL("./templates/winnipeg-routes/winnipeg-to-vancouver-movers.html", import.meta.url),
};
const routes = VANCOUVER_WINNIPEG_ROUTES.map((route) => ({
  ...route,
  ...VANCOUVER_WINNIPEG_FACTS,
  template: templates[route.slug],
}));
assertRouteOwnership("rebuild-winnipeg-modern-routes.mjs", routes);

const prices = VANCOUVER_WINNIPEG_FACTS.prices;

function addFaqSchema(html) {
  const visible = extractVisibleFaqs(html);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: visible.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const script = `<script type="application/ld+json" id="faq-schema">${JSON.stringify(schema)}</script>`;
  if (!/<\/head>/i.test(html)) throw new Error("Missing </head>");
  return html.replace(/<\/head>/i, `  ${script}\n</head>`);
}

function canonicalizeTemplate(html, route) {
  const title = `${route.from} to ${route.to} Movers | Cost, Transit Time &amp; Estimate | Purely Canadian Movers`;
  const canonical = html
    .replace(/<title(?:\s[^>]*)?>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${title}">${title}</title>`)
    .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${title}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${title}">`)
    .replace(/<link rel="stylesheet" href="\/assets\/step40-vancouver-winnipeg\.css">/g, "")
    .replace(/<script defer src="\/assets\/step40-vancouver-winnipeg\.js"><\/script>/g, "")
    .replace(/<div id="root" class="pcm-static-route pcm-static-route-ready">/i, `<div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="${route.slug}">`)
    .replace(/<div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="[^"]+">/i, `<div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="${route.slug}">`)
    .replace(/<div class="pcm-kicker">TORONTO TO VANCOUVER MOVERS<\/div>/i, `<div class="pcm-kicker">${route.from.toUpperCase()} TO ${route.to.toUpperCase()} MOVERS</div>`)
    .replace(/<a href="\/toronto-long-distance-movers\/">(?:Winnipeg|Vancouver) Long-Distance Movers<\/a>/gi, (match) => match.includes("Winnipeg") ? '<a href="/winnipeg-long-distance-movers/">Winnipeg Long-Distance Movers</a>' : '<a href="/vancouver-long-distance-movers/">Vancouver Long-Distance Movers</a>')
    .replace(/<a href="\/vancouver-long-distance-movers\/">Winnipeg Long-Distance Movers<\/a>/gi, '<a href="/winnipeg-long-distance-movers/">Winnipeg Long-Distance Movers</a>')
    .replace(/<div class="pcm-estimate-bonus">[\s\S]*?<\/div><\/div>\s*(?=<div class="pcm-verified-details">)/i, '<div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">✓</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed.</span></div></div>\n          ')
    .replace(/<\/head>/i, '<link rel="stylesheet" href="/assets/step40-vancouver-winnipeg.css"></head>')
    .replace(/<\/body>/i, '<script defer src="/assets/step40-vancouver-winnipeg.js"></script></body>');
  return addFaqSchema(canonical);
}

function validateTemplate(html, route) {
  const routeName = `${route.from} to ${route.to}`;
  const required = [
    `<title data-pcm-authoritative-route-title="${routeName} Movers | Cost, Transit Time &amp; Estimate | Purely Canadian Movers">${routeName} Movers | Cost, Transit Time &amp; Estimate | Purely Canadian Movers</title>`,
    `<link rel="canonical" href="https://purelycanadianmovers.com/${route.slug}/">`,
    `<meta property="og:url" content="https://purelycanadianmovers.com/${route.slug}/">`,
    `<h1>${routeName} Movers</h1>`,
    `name="from" value="${route.fromFull}"`,
    `name="to" value="${route.toFull}"`,
    route.distance,
    "5–13 days",
    "Route at a Glance",
    "Related Destinations and Resources",
    ...prices,
    `data-pcm-static-route="${route.slug}"`,
    "/assets/step40-vancouver-winnipeg.css",
    "/assets/step40-vancouver-winnipeg.js",
  ];
  for (const marker of required) {
    if (!html.includes(marker)) throw new Error(`${route.slug}: explicit template missing ${marker}`);
  }
  if ((html.match(/<h1\b/gi) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one H1`);
  if ((html.match(/class="[^"]*\bpcm-route-cost\b/g) || []).length !== 1) throw new Error(`${route.slug}: expected exactly one pricing block`);
  const faq = faqParityDifferences(html);
  if (faq.differences.length) throw new Error(`${route.slug}: FAQ/schema parity mismatch`);
  if (html.includes("undefined")) throw new Error(`${route.slug}: template contains undefined`);
}

for (const route of routes) {
  const html = canonicalizeTemplate(await readFile(route.template, "utf8"), route);
  validateTemplate(html, route);
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(join(root, route.slug, "index.html"), html);
  console.log(`Rebuilt /${route.slug}/ from its explicit owned template`);
}
