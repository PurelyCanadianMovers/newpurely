import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { HALIFAX_EDMONTON_FACTS, HALIFAX_EDMONTON_PRICING, HALIFAX_EDMONTON_ROUTES } from "./halifax-edmonton-route-data.mjs";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const origin = "https://purelycanadianmovers.com";
assertRouteOwnership("rebuild-halifax-edmonton-routes.mjs", HALIFAX_EDMONTON_ROUTES);
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const routeName = (route) => `${route.from} to ${route.to}`;
const routeUrl = (route) => `${origin}/${route.slug}/`;

function faqSchema(html, route) {
  const headingIndex = html.indexOf("Frequently Asked Questions");
  const faqStart = html.lastIndexOf("<section", headingIndex);
  const faqEnd = html.indexOf("</section>", headingIndex);
  const faq = faqStart >= 0 && faqEnd >= 0 ? html.slice(faqStart, faqEnd + "</section>".length) : "";
  if (!faq) throw new Error(`${route.slug}: FAQ section missing`);
  const entities = [...faq.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => ({ "@type": "Question", name: m[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim(), acceptedAnswer: { "@type": "Answer", text: m[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim() } }));
  const schema = `<script type="application/ld+json" id="faq-schema">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entities })}</script>`;
  const matches = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi)].filter((m) => m[0].includes('"@type":"FAQPage"'));
  if (matches.length !== 1) throw new Error(`${route.slug}: expected one FAQPage schema, found ${matches.length}`);
  return html.replace(matches[0][0], schema);
}

function render(source, route) {
  const name = routeName(route);
  let html = source
    .replaceAll("Halifax to Calgary", name).replaceAll("Calgary to Halifax", name)
    .replaceAll("Halifax–Calgary", `${route.from}–${route.to}`).replaceAll("Calgary–Halifax", `${route.from}–${route.to}`)
    .replaceAll("Halifax → Calgary", `${route.from} → ${route.to}`).replaceAll("Calgary → Halifax", `${route.from} → ${route.to}`)
    .replaceAll("Calgary", route.to).replaceAll("calgary", route.to.toLowerCase())
    .replaceAll("~4,800 km", route.distance).replaceAll("4,800 km", route.distanceProse)
    .replaceAll("$3,900+", "$3,900–$6,500+").replaceAll("$3,900–$6,500+–$6,500+", "$3,900–$6,500+")
    .replaceAll("/calgary-long-distance-movers/", "/edmonton-long-distance-movers/")
    .replaceAll("/calgary-to-halifax-movers/", "/edmonton-to-halifax-movers/")
    .replaceAll("/halifax-to-calgary-movers/", "/halifax-to-edmonton-movers/")
    .replaceAll("halifax-to-halifax-movers", route.slug)
    .replaceAll("Halifax-to-Halifax", "Edmonton-to-Halifax")
    .replaceAll("HalifaxHalifax", "EdmontonHalifax");
  const title = `${name} Movers | ${route.fromProvinceName} to ${route.toProvinceName} Moving | Purely Canadian Movers`;
  const description = `${name} moving cost guide with estimated prices by home size, 8–20 day transit time, route logistics, packing, storage, Declared Value Protection, and direct movers.`;
  const originValue = `${route.from}, ${route.fromProvince}`;
  html = html.replace(/(<label>Moving from\s*<input\b[^>]*\bname="from"[^>]*)(>)/i, (_, attrs, close) => `${attrs.replace(/\bplaceholder="[^"]*"/i, `placeholder="${esc(originValue)}"`).replace(/\bvalue="[^"]*"/i, `value="${esc(originValue)}"`)}${close}`);
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${esc(title)}">${esc(title)}</title>`)
    .replace(/(<meta\b[^>]*name="description"[^>]*content=")[^"]*(")/i, `$1${esc(description)}$2`)
    .replace(/(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*(")/i, `$1${esc(title)}$2`)
    .replace(/(<meta\b[^>]*property="og:description"[^>]*content=")[^"]*(")/i, `$1${esc(description)}$2`)
    .replace(/(<meta\b[^>]*property="og:url"[^>]*content=")[^"]*(")/i, `$1${routeUrl(route)}$2`)
    .replace(/(<meta\b[^>]*name="twitter:title"[^>]*content=")[^"]*(")/i, `$1${esc(title)}$2`)
    .replace(/(<meta\b[^>]*name="twitter:description"[^>]*content=")[^"]*(")/i, `$1${esc(description)}$2`)
    .replace(/(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*(")/i, `$1${routeUrl(route)}$2`)
    .replace(/(Distance and logistics:<\/strong>\s*At roughly )[,\d]+ km/i, `$1${route.distanceProse}`)
    .replace(/(<(?:div|p)\b[^>]*>Distance<\/(?:div|p)>\s*<(?:div|p)\b[^>]*>)[^<]*/i, `$1${route.distance}`);
  if (route.slug === "halifax-to-edmonton-movers") {
    html = html.replaceAll("Chinook winds can create dramatic temperature swings in a single day. If you're moving in winter, we plan accordingly", "Edmonton's dry prairie climate brings cold winters, snow, and large temperature swings. We plan loading and delivery carefully").replaceAll("Calgary's climate", "Edmonton's climate").replaceAll("Calgary's Seasonal Weather", "Edmonton's Seasonal Weather").replaceAll("Beltline and East Village", "Downtown Edmonton and Oliver").replaceAll("Tuscany, Seton, and Mahogany", "Windermere, Terwillegar, and Clareview").replaceAll("Alberta's 13% HST", "Nova Scotia's 15% HST");
    html = html.replaceAll("the reverse: Edmonton to Halifax moves are equally common", "the reverse: Edmonton to Halifax moves are equally common");
  } else {
    html = html.replaceAll("Chinook winds can create dramatic temperature swings in a single day. If you're moving in winter, we plan accordingly", "Halifax's coastal climate includes Atlantic wind, rain, wet snow, salt air, and freeze-thaw conditions. We plan winter and shoulder-season handling carefully").replaceAll("Both Halifax and Halifax", "Both Edmonton and Halifax").replaceAll("Beltline and East Village", "Downtown Edmonton, Oliver, and the Ice District").replaceAll("Tuscany, Seton, and Mahogany", "Windermere, Terwillegar, and Clareview").replaceAll("Calgary's climate", "Edmonton's climate").replaceAll("Calgary's Seasonal Weather", "Edmonton's Seasonal Weather");
  }
  const relatedHeading = html.indexOf("Related Destinations");
  const relatedEnd = html.indexOf("</section>", relatedHeading);
  if (relatedHeading >= 0 && relatedEnd >= 0 && !html.slice(relatedHeading, relatedEnd).includes(`/${route.oppositeSlug}/`)) {
    const relatedInsert = `<a href="/${route.oppositeSlug}/" class="flex items-center gap-1.5 text-sm font-body font-semibold text-[#CC1A1A] hover:text-[#A31515] hover:underline"><span>${esc(route.opposite)}</span></a>`;
    const relatedClose = html.lastIndexOf("</div>", relatedEnd);
    html = html.slice(0, relatedClose) + relatedInsert + html.slice(relatedClose);
  }
  html = faqSchema(html, route);
  if (html.includes("Calgary") || html.includes("calgary") || html.includes("Moving Cost Breakdown")) throw new Error(`${route.slug}: contamination or obsolete section remains`);
  for (const value of [route.distance, HALIFAX_EDMONTON_FACTS.transit, ...HALIFAX_EDMONTON_PRICING.map((row) => row[1])]) if (!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  if ((html.match(/FAQPage/g) ?? []).length !== 1) throw new Error(`${route.slug}: duplicate FAQPage markup`);
  return html.replace(/[ \t]+(?=\r?\n)/g, "");
}

for (const route of HALIFAX_EDMONTON_ROUTES) {
  const source = await readFile(join(root, route.source, "index.html"), "utf8");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(join(root, route.slug, "index.html"), render(source, route), "utf8");
}

const sitemapPath = join(root, "sitemap.xml");
let sitemap = await readFile(sitemapPath, "utf8");
for (const route of HALIFAX_EDMONTON_ROUTES) if (!sitemap.includes(`<loc>${routeUrl(route)}</loc>`)) sitemap = sitemap.replace("</urlset>", `  <url><loc>${routeUrl(route)}</loc></url>\n</urlset>`);
await writeFile(sitemapPath, sitemap, "utf8");

const guidePath = join(root, "long-distance-moving-cost-canada", "index.html");
let guide = await readFile(guidePath, "utf8");
const heading = guide.indexOf("Long-Distance Moving Costs by Route");
const bodyStart = guide.indexOf("<tbody", heading); const open = guide.indexOf(">", bodyStart); const close = guide.indexOf("</tbody>", open);
if ([heading, bodyStart, open, close].some((n) => n < 0)) throw new Error("Cost guide route table not found");
let body = guide.slice(open + 1, close);
for (const route of HALIFAX_EDMONTON_ROUTES) { body = body.replace(new RegExp(`<tr\\b[^>]*data-route=["']${route.slug}["'][\\s\\S]*?<\\/tr>`, "i"), ""); body += `<tr data-route="${route.slug}" class="border-b border-gray-200 bg-white hover:bg-red-50"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${route.from} → ${route.to}<br><small>${route.distance} · ${HALIFAX_EDMONTON_FACTS.transit}</small></td><td class="py-3 px-4 font-body text-gray-700">$2,600+</td><td class="py-3 px-4 font-body text-gray-700">$3,900–$6,500+</td><td class="py-3 px-4 font-body text-gray-700">$6,500+</td><td class="py-3 px-4 font-body text-gray-700">$11,000+</td><td class="py-3 px-4 font-body text-gray-700">$16,000+</td></tr>`; }
await writeFile(guidePath, guide.slice(0, open + 1) + body + guide.slice(close), "utf8");

const hubPath = join(root, "edmonton-long-distance-movers", "index.html");
let hub = await readFile(hubPath, "utf8");
if (!hub.includes("/edmonton-to-halifax-movers/")) { const anchor = hub.indexOf("/edmonton-to-winnipeg-movers/"); const end = hub.indexOf("</a>", anchor); if (anchor < 0 || end < 0) throw new Error("Edmonton route list not found"); hub = hub.slice(0, end + 4) + `<a href="/edmonton-to-halifax-movers/" class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200 hover:border-[#CC1A1A] hover:bg-red-50 transition-colors group"><span class="font-body text-gray-700 group-hover:text-gray-900 font-semibold">Edmonton → Halifax</span></a>` + hub.slice(end + 4); await writeFile(hubPath, hub, "utf8"); }
console.log("Rebuilt Halifax–Edmonton pages and updated sitemap, cost guide, and Edmonton route list.");
