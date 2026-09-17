import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { EDMONTON_WINNIPEG_ROUTES } from "./edmonton-winnipeg-route-data.mjs";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const toolRoot = dirname(fileURLToPath(import.meta.url));
const templateRoot = join(toolRoot, "templates", "edmonton-winnipeg-routes");
const origin = "https://purelycanadianmovers.com";

assertRouteOwnership("rebuild-edmonton-winnipeg-routes.mjs", EDMONTON_WINNIPEG_ROUTES);

function routeUrl(route) {
  return `${origin}/${route.slug}/`;
}

function render(template, route) {
  const css = '<link rel="stylesheet" href="/assets/step34-edmonton-winnipeg.css">';
  const js = '<script defer src="/assets/step34-edmonton-winnipeg.js"></script>';
  let html = template
    .replace(/<link rel="stylesheet" href="\/assets\/step34-edmonton-winnipeg\.css">/g, "")
    .replace(/<script defer src="\/assets\/step34-edmonton-winnipeg\.js"><\/script>/g, "")
    .replaceAll("Professional, fully insured long-distance moving from", "Professional long-distance moving with Declared Value Protection options from")
    .replaceAll("professional, fully insured service", "professional service with Declared Value Protection options")
    .replace(/<\/head>/i, `${css}</head>`)
    .replace(/<\/body>/i, `${js}</body>`);
  if (route.from === "Edmonton") html = html.replaceAll("Plan a Edmonton", "Plan an Edmonton");

  const expectedTitle = `${route.from} to ${route.to} Movers | Cost, Transit Time &amp; Estimate | Purely Canadian Movers`;
  if (!new RegExp(`<title\\b[^>]*>${expectedTitle.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}<\\/title>`, "i").test(html)) throw new Error(`Template title mismatch for ${route.slug}`);
  if (!html.includes(`href="${routeUrl(route)}"`)) throw new Error(`Template canonical mismatch for ${route.slug}`);
  if (!html.includes(`data-pcm-static-route="${route.slug}"`)) throw new Error(`Template route marker mismatch for ${route.slug}`);
  return html.replace(/[ \t]+(?=\r?\n)/g, "");
}

function costRows() {
  return EDMONTON_WINNIPEG_ROUTES.map((route, index) => `<tr data-route="${route.slug}" class="border-b border-gray-200 ${index % 2 ? "bg-gray-50" : "bg-white"} hover:bg-red-50"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${route.from} → ${route.to}</td>${route.prices.map((price) => `<td class="py-3 px-4 font-body text-gray-700">${price.replace("+", "")}</td>`).join("")}</tr>`).join("");
}

async function updateIntegrations() {
  const guide = join(root, "long-distance-moving-cost-canada", "index.html");
  let html = await readFile(guide, "utf8");
  const heading = html.indexOf("Long-Distance Moving Costs by Route");
  const tbody = html.indexOf("<tbody", heading);
  const open = html.indexOf(">", tbody);
  const close = html.indexOf("</tbody>", open);
  if ([heading, tbody, open, close].some((position) => position < 0)) throw new Error("Could not locate cost-guide route table.");
  let body = html.slice(open + 1, close);
  for (const route of EDMONTON_WINNIPEG_ROUTES) body = body.replace(new RegExp(`<tr\\b[^>]*data-route=["']${route.slug}["'][\\s\\S]*?<\/tr>`, "i"), "");
  await writeFile(guide, html.slice(0, open + 1) + body + costRows() + html.slice(close), "utf8");

  const hub = join(root, "edmonton-long-distance-movers", "index.html");
  html = await readFile(hub, "utf8");
  const block = "<section class=\"py-12 bg-gray-50\" data-pcm-edmonton-winnipeg-routes=\"1\"><div class=\"container max-w-4xl\"><h2 class=\"font-heading text-3xl font-bold text-gray-900 mb-6\">Routes From Edmonton</h2><div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4\"><a href=\"/edmonton-to-toronto-movers/\" class=\"text-[#CC1A1A] font-semibold\">Edmonton → Toronto</a><a href=\"/edmonton-to-vancouver-movers/\" class=\"text-[#CC1A1A] font-semibold\">Edmonton → Vancouver</a><a href=\"/edmonton-to-ottawa-movers/\" class=\"text-[#CC1A1A] font-semibold\">Edmonton → Ottawa</a><a href=\"/edmonton-to-montreal-movers/\" class=\"text-[#CC1A1A] font-semibold\">Edmonton → Montreal</a><a href=\"/edmonton-to-winnipeg-movers/\" class=\"text-[#CC1A1A] font-semibold\">Edmonton → Winnipeg</a></div></div></section>";
  const section = /<section\b[^>]*data-pcm-edmonton-winnipeg-routes="1"[\s\S]*?<\/section>/i;
  if (section.test(html)) {
    html = html.replace(section, block);
    await writeFile(hub, html, "utf8");
  } else {
    const at = html.indexOf("</main>");
    if (at < 0) throw new Error("Could not locate Edmonton hub main element.");
    await writeFile(hub, html.slice(0, at) + block + html.slice(at), "utf8");
  }

  const sitemap = join(root, "sitemap.xml");
  html = await readFile(sitemap, "utf8");
  for (const route of EDMONTON_WINNIPEG_ROUTES) {
    const loc = `<loc>${routeUrl(route)}</loc>`;
    if (!html.includes(loc)) html = html.replace("</urlset>", `  <url>${loc}</url>\n</urlset>`);
  }
  await writeFile(sitemap, html, "utf8");
}

for (const route of EDMONTON_WINNIPEG_ROUTES) {
  const template = await readFile(join(templateRoot, `${route.slug}.html`), "utf8");
  const directory = join(root, route.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), render(template, route), "utf8");
}

await updateIntegrations();
console.log(`Rebuilt ${EDMONTON_WINNIPEG_ROUTES.length} Edmonton-Winnipeg route pages from explicit pair-owned templates.`);
