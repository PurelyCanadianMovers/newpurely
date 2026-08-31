import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] ?? "site-copy";
const templatePath = join(outDir, "toronto-to-calgary-movers", "index.html");
const template = await readFile(templatePath, "utf8");

const routes = [
  {
    slug: "halifax-to-calgary-movers",
    origin: "Halifax",
    destination: "Calgary",
    originProvince: "Nova Scotia",
    destinationProvince: "Alberta",
    originCode: "NS",
    destinationCode: "AB",
  },
  {
    slug: "calgary-to-halifax-movers",
    origin: "Calgary",
    destination: "Halifax",
    originProvince: "Alberta",
    destinationProvince: "Nova Scotia",
    originCode: "AB",
    destinationCode: "NS",
  },
];

const pricing = ["$2,600+", "$3,900+", "$6,500+", "$11,000+", "$16,000+"];
const oldPricing = ["$2,500+", "$3,800+", "$6,400+", "$10,000+", "$15,000+"];
const unsupportedReactBootstrap = /\s*<script\b[^>]*\btype="module"[^>]*\bsrc="(?:\.\.\/)?assets\/index-[^"]+\.js"[^>]*><\/script>/i;
const unsupportedReactBootstrapMarker = /<script\b[^>]*\bsrc="[^\"]*\/assets\/index-[^\"]+\.js"[^>]*>/i;
const staticHeadAssets = [
  '<link rel="stylesheet" href="/assets/static-nav.css">',
  '<link rel="stylesheet" href="/assets/static-chat.css">',
].join("\n");
const staticBodyAssets = [
  '<script defer src="/assets/static-nav.js"></script>',
  '<script defer src="/assets/static-chat.js"></script>',
].join("\n");

function replaceAll(text, search, replacement) {
  return text.split(search).join(replacement);
}

function makeStandalone(html, route) {
  const withoutReactBootstrap = html.replace(unsupportedReactBootstrap, "");
  if (unsupportedReactBootstrapMarker.test(withoutReactBootstrap)) {
    throw new Error(`${route.slug}: unsupported React bootstrap could not be removed`);
  }

  let next = withoutReactBootstrap;
  if (!next.includes('href="/assets/static-nav.css"')) {
    next = next.replace("</head>", `  ${staticHeadAssets}\n</head>`);
  }
  if (!next.includes('src="/assets/static-nav.js"')) {
    const conversionScript = /(<script[^>]*src="\/assets\/conversion-boost\.js"[^>]*><\/script>)/i;
    if (!conversionScript.test(next)) {
      throw new Error(`${route.slug}: conversion script anchor missing for static assets`);
    }
    next = next.replace(conversionScript, `${staticBodyAssets}\n$1`);
  }

  return next;
}

function routeSnapshot(route) {
  let html = template;

  // Use placeholders so reverse-direction routes do not collide during swaps.
  html = replaceAll(html, "toronto-to-calgary-movers", "__ROUTE_SLUG__");
  html = replaceAll(html, "Toronto", "__ORIGIN_CITY__");
  html = replaceAll(html, "Calgary", "__DESTINATION_CITY__");
  html = replaceAll(html, "toronto", "__ORIGIN_CITY_LOWER__");
  html = replaceAll(html, "calgary", "__DESTINATION_CITY_LOWER__");

  html = replaceAll(html, "__ROUTE_SLUG__", route.slug);
  html = replaceAll(html, "__ORIGIN_CITY__", route.origin);
  html = replaceAll(html, "__DESTINATION_CITY__", route.destination);
  html = replaceAll(html, "__ORIGIN_CITY_LOWER__", route.origin.toLowerCase());
  html = replaceAll(html, "__DESTINATION_CITY_LOWER__", route.destination.toLowerCase());

  // Keep route-specific copy truthful when the destination changes from Calgary.
  html = replaceAll(html, "Alberta", "__DEST_PROV__");
  html = replaceAll(html, "AB", "__DEST_CODE__");
  html = replaceAll(html, "Ontario", "__ORIGIN_PROV__");
  html = replaceAll(html, "ON", "__ORIGIN_CODE__");
  html = replaceAll(html, "__DEST_PROV__", route.destinationProvince);
  html = replaceAll(html, "__DEST_CODE__", route.destinationCode);
  html = replaceAll(html, "__ORIGIN_PROV__", route.originProvince);
  html = replaceAll(html, "__ORIGIN_CODE__", route.originCode);
  html = replaceAll(html, "Choose a Calgary Neighbourhood with Access in Mind", `Choose a ${route.destination} Neighbourhood with Access in Mind`);
  html = replaceAll(html, "Update Your Alberta Health Coverage", `Update Your ${route.destination} Health Coverage`);
  html = replaceAll(html, "Plan for Alberta’s Tax Difference", `Plan for ${route.destinationProvince}’s Tax Difference`);
  html = replaceAll(html, "Prepare for Chinooks and Winter Weather", `Prepare for ${route.destination}'s Seasonal Weather`);
  html = replaceAll(html, "/toronto-long-distance-movers/", `/${route.origin.toLowerCase()}-long-distance-movers/`);
  html = replaceAll(html, "Confirm Condo, Parking, and Truck Access", "Confirm Condo, Parking, and Truck Access");
  html = replaceAll(html, "Is my shipment insured during a Toronto to Calgary move?", "What protection is available for this move?");
  html = replaceAll(html, "insurance", "Declared Value Protection");
  html = replaceAll(html, "insured", "protected with Declared Value Protection");
  html = replaceAll(html, "No. Local moves are handled by our own trained crews, and long-distance moves run through the Great Canadian Van Lines network rather than a broker handoff to unknown movers.", "Long-distance moves are coordinated through the Great Canadian Van Lines agent network, with route planning and service coordination handled by Purely Canadian Movers.");
  html = replaceAll(html, "no subcontractors", "no moving-broker handoff");
  html = replaceAll(html, "No subcontractors", "No moving-broker handoff");
  html = replaceAll(html, "subcontractors", "unknown third-party movers");
  html = replaceAll(html, "our own trained crew from pickup to delivery", "the Great Canadian Van Lines agent network from pickup through delivery");
  html = replaceAll(html, "our own crews", "our moving team and Great Canadian Van Lines agent network");
  html = replaceAll(html, "zero unknown third-party movers. Ever.", "coordinated agent-network service");

  // Preserve the existing route-page structure while making its facts authoritative.
  html = replaceAll(html, "6-14", "8-20 days");
  html = replaceAll(html, "6–14", "8–20 days");
  html = replaceAll(html, "5-12 days", "8-20 days");
  html = replaceAll(html, "5–12 days", "8–20 days");
  html = replaceAll(html, "7–19 days", "8–20 days");
  html = replaceAll(html, "7-19 days", "8-20 days");
  html = replaceAll(html, "~2000 km", "~4,800 km");
  html = replaceAll(html, "~3,400 km", "~4,800 km");
  html = replaceAll(html, "~3,500 km", "~4,800 km");
  html = replaceAll(html, "approximately 3,400 km", "approximately 4,800 km");
  html = replaceAll(html, "approximately 3,500 km", "approximately 4,800 km");
  html = replaceAll(html, "roughly 2000 km", "roughly 4,800 km");
  html = replaceAll(html, "$2000-$3800–$6000-$12000", "$2,600–$16,000+");

  const inclusion = "These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible.";
  html = replaceAll(html, "These estimated moving costs include in-home pickup and delivery, fuel surcharge, insurance, and zero deductible.", inclusion);
  html = html.replace(
    /(<div class="pcm-route-cost__table-wrap">[\s\S]*?<\/div>)(<p class="pcm-route-cost__note">)/i,
    `$1<p class="pcm-route-cost__inclusion">${inclusion}</p>$2`,
  );

  for (let index = 0; index < oldPricing.length; index += 1) {
    html = replaceAll(html, oldPricing[index], `__ROUTE_PRICE_${index}__`);
  }
  for (let index = 0; index < pricing.length; index += 1) {
    html = replaceAll(html, `__ROUTE_PRICE_${index}__`, pricing[index]);
  }

  html = replaceAll(html, "Toronto's humid summers and cold winters require careful climate control.",
    `${route.destination}'s seasonal weather requires careful scheduling and protection planning.`);
  html = replaceAll(html, "Both Halifax and Toronto have large condo populations", 
    `Both ${route.origin} and ${route.destination} have condo and apartment moves`);
  html = replaceAll(
    html,
    "A studio or 1-bedroom typically ranges from $2,500 to $4,500, while a 3–4 bedroom home can range from $7,000 to $14,000+.",
    "Estimated route pricing starts at $2,600 for a studio, $3,900 for a 1-bedroom, $6,500 for a 2-bedroom, $11,000 for a 3-bedroom, and $16,000 for a 4+ bedroom home.",
  );
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${route.origin} to ${route.destination} Movers | ${route.originProvince} to ${route.destinationProvince} Moving</title>`,
  );

  // The shared top estimate panel in the recovered snapshot uses generic route
  // defaults. Keep the component and field order, but make its route truthful.
  html = html.replace(
    /name="from" placeholder="[^"]+"/,
    `name="from" placeholder="${route.origin}, ${route.originCode}"`,
  );
  html = html.replace(
    /name="to" placeholder="[^"]+"/,
    `name="to" placeholder="${route.destination}, ${route.destinationCode}"`,
  );

  // These URLs are not implemented in React. Keep the prerender authoritative and
  // use the static nav/chat enhancements for the functionality those routes need.
  html = makeStandalone(html, route);

  const canonical = `https://purelycanadianmovers.com/${route.slug}/`;
  const checks = [
    [html.includes(`href="${canonical}"`), "self canonical"],
    [html.includes(`${route.origin} to ${route.destination} Movers`), "route heading"],
    [html.includes("8–20 days") || html.includes("8-20 days"), "transit time"],
    [html.includes("~4,800 km"), "distance"],
    [pricing.every((price) => html.includes(price)), "pricing"],
    [(html.match(/type="application\/ld\+json"/g) ?? []).length >= 8, "JSON-LD blocks"],
    [(html.match(/<form\b/g) ?? []).length === 1, "estimate form"],
    [!html.includes("rel=\"canonical\" href=\"https://purelycanadianmovers.com/404"), "no 404 canonical"],
    [!unsupportedReactBootstrapMarker.test(html), "no unsupported React route bootstrap"],
    [html.includes('href="/assets/static-nav.css"'), "static nav stylesheet"],
    [html.includes('href="/assets/static-chat.css"'), "static chat stylesheet"],
    [html.includes('src="/assets/static-nav.js"'), "static nav script"],
    [html.includes('src="/assets/static-chat.js"'), "static chat script"],
  ];

  const failed = checks.filter(([passed]) => !passed).map(([, name]) => name);
  if (failed.length) {
    throw new Error(`${route.slug}: failed ${failed.join(", ")}`);
  }

  return html;
}

for (const route of routes) {
  const routeDir = join(outDir, route.slug);
  await mkdir(routeDir, { recursive: true });
  await writeFile(join(routeDir, "index.html"), routeSnapshot(route), "utf8");
  console.log(`Generated /${route.slug}/ from the current route-page template`);
}
