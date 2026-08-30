import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2] || "site-copy";
const referenceRoot = join(root, "vancouver-to-toronto-movers");
const routes = [
  {
    source: "vancouver-to-toronto-movers",
    slug: "vancouver-to-winnipeg-movers",
    from: "Vancouver",
    fromProvince: "BC",
    to: "Winnipeg",
    toProvince: "MB",
    distance: "2,300 km",
    lowerDistance: "2,300 km",
    routeText: "Vancouver to Winnipeg",
    tip: "Winnipeg",
  },
  {
    source: "toronto-to-vancouver-movers",
    slug: "winnipeg-to-vancouver-movers",
    from: "Winnipeg",
    fromProvince: "MB",
    to: "Vancouver",
    toProvince: "BC",
    distance: "2,300 km",
    lowerDistance: "2,300 km",
    routeText: "Winnipeg to Vancouver",
    tip: "Vancouver",
  },
];

const pricing = `<section class="pcm-lead-boost pcm-route-cost" aria-label="ROUTE_UPPER moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">ROUTE_UPPER MOVING COST</div><h2>How much does it cost to move from ROUTE?</h2><p>A ROUTE move typically ranges from about <strong>$2,400+</strong> for a small shipment to <strong>$13,000+</strong> for a larger home. Many 1–2 bedroom moves are estimated around <strong>$3,400–$5,500+</strong>, depending on shipment weight or volume, access, packing, storage, season, and Declared Value Protection.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody><tr><td>Studio or small shipment</td><td>$2,400+</td><td>Best for limited furniture or a partial shipment</td><td>5–13 days</td></tr><tr><td>1-bedroom</td><td>$3,400+</td><td>Depends on inventory weight or volume, access, and packing</td><td>5–13 days</td></tr><tr><td>2-bedroom</td><td>$5,500+</td><td>Common planning range for apartment or condo moves</td><td>5–13 days</td></tr><tr><td>3-bedroom</td><td>$8,900+</td><td>Larger household shipment with more labour and space</td><td>5–13 days</td></tr><tr><td>4+ bedroom</td><td>$13,000+</td><td>Final quote depends heavily on inventory and services</td><td>5–13 days</td></tr></tbody></table></div><p class="pcm-route-cost__note">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible. Prices are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, and service dates.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full cost guide</a><a href="/FROM-HUB/">FROM movers</a><a href="/TO-HUB/">TO movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;

for (const route of routes) {
  let html = await readFile(join(root, route.source, "index.html"), "utf8");
  const oldFrom = route.source.startsWith("vancouver") ? "Vancouver" : "Toronto";
  const oldTo = route.source.startsWith("vancouver") ? "Toronto" : "Vancouver";
  const oldFromProvince = route.source.startsWith("vancouver") ? "BC" : "ON";
  const oldToProvince = route.source.startsWith("vancouver") ? "ON" : "BC";
  const oldRoute = `${oldFrom} to ${oldTo}`;
  const newRoute = `${route.from} to ${route.to}`;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${newRoute} Movers | Cost, Transit Time &amp; Estimate</title>`)
    .replaceAll(oldRoute, newRoute)
    .replaceAll(`${oldFrom}, ${oldFromProvince}`, `${route.from}, ${route.fromProvince}`)
    .replaceAll(`${oldTo}, ${oldToProvince}`, `${route.to}, ${route.toProvince}`)
    .replaceAll(`${oldFrom}-${oldTo}`, `${route.from}-${route.to}`)
    .replaceAll(`${oldFrom}–${oldTo}`, `${route.from}–${route.to}`)
    .replaceAll(`${oldFrom} Long-Distance`, `${route.from} Long-Distance`)
    .replaceAll(`${oldTo} Long-Distance`, `${route.to} Long-Distance`)
    .replaceAll("4,400 km", route.distance)
    .replaceAll("4,350 km", route.distance)
    .replaceAll("9-22 days", "5–13 days")
    .replaceAll("9–22 days", "5–13 days")
    .replaceAll("$2,500+", "$2,400+")
    .replaceAll("$4,700+", "$3,400+")
    .replaceAll("$6,500+", "$5,500+")
    .replaceAll("$10,000+", "$8,900+")
    .replaceAll("$15,000+", "$13,000+")
    .replaceAll("$2,500", "$2,400")
    .replaceAll("$4,700", "$3,400")
    .replaceAll("$6,500", "$5,500")
    .replaceAll("$10,000", "$8,900")
    .replaceAll("$15,000", "$13,000")
    .replaceAll("Vancouver-to-Toronto", "Vancouver-to-Winnipeg")
    .replaceAll("Toronto-to-Vancouver", "Winnipeg-to-Vancouver")
    .replaceAll("Tips for Moving to Toronto", "Tips for Moving to Winnipeg")
    .replaceAll("Vancouver and Toronto", "Vancouver and Winnipeg")
    .replaceAll("Vancouver Toronto moving company", "Vancouver Winnipeg moving company")
    .replaceAll("Toronto Vancouver moving company", "Winnipeg Vancouver moving company")
    .replaceAll("Metro Toronto", "Metro Vancouver");

  const costBlock = pricing
    .replaceAll("ROUTE_UPPER", "XXUPPERXX")
    .replaceAll("ROUTE", newRoute)
    .replaceAll("VANCOUVER", route.from.toUpperCase())
    .replaceAll("WINNIPEG", route.to.toUpperCase())
    .replace("/FROM-HUB/", `/${route.from.toLowerCase()}-long-distance-movers/`)
    .replace("/TO-HUB/", `/${route.to.toLowerCase()}-long-distance-movers/`)
    .replace("FROM movers", `${route.from} movers`)
    .replace("TO movers", `${route.to} movers`)
    .replaceAll("XXUPPERXX", newRoute.toUpperCase());
  html = html.replace(/<section class="pcm-lead-boost pcm-route-cost"[\s\S]*?<\/section>/i, costBlock);
  html = html.replaceAll("9–22", "5–13").replaceAll("9-22", "5–13");
  html = html.replace(/<link rel="canonical" href="[^"]+">/i, `<link rel="canonical" href="https://purelycanadianmovers.com/${route.slug}/">`)
    .replace(/<meta property="og:url" content="[^"]+">/i, `<meta property="og:url" content="https://purelycanadianmovers.com/${route.slug}/">`)
    .replace(/<meta name="keywords" content="[^"]+">/i, `<meta name="keywords" content="${newRoute} movers, moving from ${route.from} to ${route.to}, long distance movers ${route.from} to ${route.to}, ${route.from} ${route.to} moving company, ${newRoute} moving cost, ${newRoute} moving quote">`)
    .replace(/<meta property="og:image:alt" content="[^"]+">/i, `<meta property="og:image:alt" content="Purely Canadian Movers truck — professional moving services across Canada">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(join(root, route.slug, "index.html"), html);
}
