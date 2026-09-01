import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2] || "site-copy";

// The working-tree Vancouver -> Toronto file is a pre-existing contaminated
// edit. Use the last committed version of the approved route family.
const reference = execFileSync(
  "git",
  ["show", "08e5e7e^:site-copy/vancouver-to-toronto-movers/index.html"],
  { encoding: "utf8" },
);

const routes = [
  { slug: "calgary-to-winnipeg-movers", from: "Calgary", fromProvince: "AB", to: "Winnipeg", toProvince: "MB" },
  { slug: "winnipeg-to-calgary-movers", from: "Winnipeg", fromProvince: "MB", to: "Calgary", toProvince: "AB" },
];

const prices = [
  ["Studio or small shipment", "$2,300+", "Best for limited furniture or a partial shipment"],
  ["1-bedroom", "$3,200+", "Depends on inventory weight or volume, access, and packing"],
  ["2-bedroom", "$5,100+", "Common planning range for apartment or condo moves"],
  ["3-bedroom", "$8,200+", "Larger household shipment with more labour and space"],
  ["4+ bedroom", "$12,000+", "Final quote depends heavily on inventory and services"],
];

function pricing(route) {
  const rows = prices.map(([size, price, note]) =>
    `<tr><td>${size}</td><td>${price}</td><td>${note}</td><td>3–11 days</td></tr>`).join("");
  return `<section class="pcm-lead-boost pcm-route-cost" aria-label="${route.from.toUpperCase()} TO ${route.to.toUpperCase()} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${route.from.toUpperCase()} TO ${route.to.toUpperCase()} MOVING COST</div><h2>How much does it cost to move from ${route.from} to ${route.to}?</h2><p>A ${route.from} to ${route.to} move typically ranges from about <strong>$2,300+</strong> for a small shipment to <strong>$12,000+</strong> for a larger home. Many 1–2 bedroom moves are estimated around <strong>$3,200–$5,100+</strong>, depending on shipment weight or volume, access, packing, storage, season, and Declared Value Protection.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These estimated moving costs are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, and service dates.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full cost guide</a><a href="/${route.from.toLowerCase()}-long-distance-movers/">${route.from} movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${route.to} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function extraFaq(route) {
  return `<article class="pcm-card"><h3>What cities do you serve on this route?</h3><p>We coordinate ${route.from}, ${route.fromProvince} to ${route.to}, ${route.toProvince} moves through our established Canadian moving network. Your written estimate confirms the exact pickup and delivery details.</p></article>`;
}

function schema(route) {
  const q = [
    [`How much does it cost to move from ${route.from} to ${route.to}?`, `Estimated ${route.from}-to-${route.to} moving costs range from $2,300 for a small shipment to $12,000 for a larger 4+ bedroom move.`],
    [`How long does a ${route.from} to ${route.to} move take?`, "Typical transit time is about 3–11 days."],
    [`Can you pack and store items for a ${route.from} to ${route.to} move?`, "Yes. Packing, unpacking, and storage can be added to a written moving estimate."],
    ["What protection is available for my shipment?", "Declared Value Protection options can be reviewed before the move."],
    ["Is this handled by a broker?", "No. The move is coordinated through an established Canadian van line network."],
    ["Can you move condos and apartments?", "Yes. Tell us about elevator reservations, loading docks, parking, stairs, and building requirements."],
    ["How is the final moving price calculated?", "Final pricing depends on shipment size or weight, services, access, packing, storage, timing, and confirmed move details."],
    ["What cities do you serve on this route?", `We coordinate ${route.from}, ${route.fromProvince} to ${route.to}, ${route.toProvince} moves through our established Canadian moving network.`],
  ];
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: q.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) })}</script>`;
}

for (const route of routes) {
  const routeText = `${route.from} to ${route.to}`;
  let html = reference
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${routeText} Movers | Cost, Transit Time &amp; Estimate</title>`)
    .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="Plan a ${routeText} long-distance move with estimated costs by home size, 1,320 km route planning, 3–11 days transit guidance, packing, storage, and written quotes.">`)
    .replace(/<meta name="keywords" content="[^"]*">/i, `<meta name="keywords" content="${routeText} movers, moving from ${route.from} to ${route.to}, long distance movers ${route.from} to ${route.to}, ${route.from} ${route.to} moving company, ${routeText} moving cost, ${routeText} moving quote">`)
    .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${routeText} Movers | Cost, Transit Time &amp; Estimate">`)
    .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="Plan a ${routeText} long-distance move with estimated costs by home size, 1,320 km route planning, 3–11 days transit guidance, packing, storage, and written quotes.">`)
    .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="https://purelycanadianmovers.com/${route.slug}/">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${routeText} Movers | Cost, Transit Time &amp; Estimate">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="Plan a ${routeText} long-distance move with estimated costs by home size, 1,320 km route planning, 3–11 days transit guidance, packing, storage, and written quotes.">`)
    .replace(/<link rel="canonical" href="[^"]+">/i, `<link rel="canonical" href="https://purelycanadianmovers.com/${route.slug}/">`)
    .replaceAll("Vancouver to Toronto", routeText)
    .replaceAll("Vancouver–Toronto", `${route.from}–${route.to}`)
    .replaceAll("Vancouver-to-Toronto", `${route.from}-to-${route.to}`)
    .replaceAll("Vancouver, BC", `${route.from}, ${route.fromProvince}`)
    .replaceAll("Toronto, ON", `${route.to}, ${route.toProvince}`)
    .replaceAll("Vancouver and Toronto", `${route.from} and ${route.to}`)
    .replaceAll("Toronto Movers", `${route.to} Movers`)
    .replaceAll("Metro Toronto", "across Canada")
    .replaceAll("Book before August 31", "Book before September 30")
    .replaceAll("4,400 km", "1,320 km")
    .replaceAll("9-22 days", "3–11 days")
    .replaceAll("9–22 days", "3–11 days")
    .replaceAll("$2,500", "$2,300")
    .replaceAll("$4,700", "$3,200")
    .replaceAll("$6,500", "$5,100")
    .replaceAll("$10,000", "$8,200")
    .replaceAll("$15,000", "$12,000")
    .replace("Tips for Moving to Toronto", `Tips for Moving to ${route.to}`)
    .replace("Toronto Long-Distance Movers", `${route.to} Long-Distance Movers`)
    .replace("Vancouver Long-Distance Movers", `${route.from} Long-Distance Movers`)
    .replaceAll("/vancouver-long-distance-movers/", `/${route.from.toLowerCase()}-long-distance-movers/`)
    .replaceAll("/toronto-long-distance-movers/", `/${route.to.toLowerCase()}-long-distance-movers/`)
    .replace(/<section class="pcm-lead-boost pcm-route-cost"[\s\S]*?<\/section>/i, pricing(route));

  html = html.replace(/<article class="pcm-card"><h3>How is the final moving price calculated\?<\/h3>[\s\S]*?<\/article>/i, (match) => match + extraFaq(route));
  html = html.replace(/<\/head>/i, schema(route) + "</head>");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(join(root, route.slug, "index.html"), html);
}
