import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] ?? "site-copy";
const templatePath = join(outDir, "halifax-to-toronto-movers", "index.html");
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
const oldPricing = ["$2,200+", "$2,900+", "$3,900+", "$5,300+", "$7,000+"];

function replaceAll(text, search, replacement) {
  return text.split(search).join(replacement);
}

function routeSnapshot(route) {
  let html = template;

  // Use placeholders so reverse-direction routes do not collide during swaps.
  html = replaceAll(html, "halifax-to-toronto-movers", "__ROUTE_SLUG__");
  html = replaceAll(html, "Halifax", "__ORIGIN_CITY__");
  html = replaceAll(html, "Toronto", "__DESTINATION_CITY__");
  html = replaceAll(html, "halifax", "__ORIGIN_CITY_LOWER__");
  html = replaceAll(html, "toronto", "__DESTINATION_CITY_LOWER__");

  html = replaceAll(html, "__ROUTE_SLUG__", route.slug);
  html = replaceAll(html, "__ORIGIN_CITY__", route.origin);
  html = replaceAll(html, "__DESTINATION_CITY__", route.destination);
  html = replaceAll(html, "__ORIGIN_CITY_LOWER__", route.origin.toLowerCase());
  html = replaceAll(html, "__DESTINATION_CITY_LOWER__", route.destination.toLowerCase());

  // Preserve the existing route-page structure while making its facts authoritative.
  html = replaceAll(html, "6-14", "8-20 days");
  html = replaceAll(html, "6–14", "8–20 days");
  html = replaceAll(html, "5-12 days", "8-20 days");
  html = replaceAll(html, "5–12 days", "8–20 days");
  html = replaceAll(html, "~2000 km", "~4,800 km");
  html = replaceAll(html, "roughly 2000 km", "roughly 4,800 km");
  html = replaceAll(html, "$2000-$3800–$6000-$12000", "$2,600–$16,000+");

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

  // The recovered React bundle has no route definitions for these two URLs. Keeping
  // its createRoot bootstrap would replace this complete snapshot with the app's 404.
  html = html.replace(
    /\s*<script type="module"[^>]*src="\.\.\/assets\/index-[^"]+\.js"><\/script>/,
    "",
  );

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
    [!html.includes("index-CNBNs70h.js"), "no unsupported React route bootstrap"],
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
