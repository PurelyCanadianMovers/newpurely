import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";
import { torontoVictoriaFacts, torontoVictoriaRoutes } from "./toronto-victoria-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const routeUrls = Object.keys(torontoVictoriaRoutes);
assertAllowedPostProcessor("finalize-toronto-victoria-routes.mjs", routeUrls.map((route) => route.slice(1, -1)));
const styleTag = '    <link rel="stylesheet" href="/assets/step39-toronto-victoria.css" data-pcm-step39="toronto-victoria">';
const scriptTag = '    <script defer src="/assets/step39-toronto-victoria.js" data-pcm-step39="toronto-victoria"></script>';

const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

function removeBalancedSection(html, markerIndex) {
  const start = html.lastIndexOf("<section", markerIndex);
  if (start < 0) return html;
  const tags = /<\/?section\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tags.exec(html))) {
    depth += /^<section\b/i.test(match[0]) ? 1 : -1;
    if (depth === 0) return html.slice(0, start) + html.slice(tags.lastIndex);
  }
  throw new Error("Unbalanced route section");
}

function removeSectionByHeading(html, pattern) {
  while (true) {
    const headings = [...html.matchAll(/<h[23]\b[^>]*>[\s\S]*?<\/h[23]>/gi)];
    const target = headings.find((heading) => pattern.test(heading[0].replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()));
    if (!target) return html;
    html = removeBalancedSection(html, target.index);
  }
}

function removeFaqSchemas(html) {
  return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, (script) =>
    /["']@type["']\s*:\s*["']FAQPage["']/i.test(script) ? "" : script);
}

function faqSection(config) {
  return `<section data-pcm-step39-faq="1" class="pcm-step39-faq py-16 bg-gray-50"><div class="container max-w-3xl"><h2>Frequently Asked Questions</h2><div class="space-y-4">${config.faq.map(([question, answer]) => `<article class="bg-white border border-gray-200 rounded-lg p-6"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("")}</div></div></section>`;
}

function faqSchema(config) {
  return `<script type="application/ld+json" id="pcm-step39-faq-schema">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
  }).replaceAll("<", "\\u003c")}</script>`;
}

function pricingSection(config) {
  const article = /^[AEIOU]/i.test(config.origin) ? "An" : "A";
  return `<section data-pcm-step39-pricing="1" class="pcm-lead-boost pcm-route-cost pcm-step39-pricing" aria-label="${esc(config.routeLabel)} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${esc(config.routeLabel)} moving cost</div><h2>How much does it cost to move from ${esc(config.origin)} to ${esc(config.destination)}?</h2><p>${article} ${esc(config.origin)} to ${esc(config.destination)} move typically falls within an overall planning range of <strong>${esc(torontoVictoriaFacts.overallRange)}</strong>.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${torontoVictoriaFacts.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}<td>${esc(torontoVictoriaFacts.transit)}</td></tr>`).join("")}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges in CAD, not guaranteed quotes. Final pricing depends on shipment weight or volume, pickup and delivery access, ferry logistics, packing, storage, season, specialty items, service dates, and the selected Declared Value Protection option.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full cost guide</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function setMeta(html, selector, value) {
  const valueEscaped = esc(value);
  if (selector === "title") return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${valueEscaped}">${valueEscaped}</title>`);
  const attribute = selector.startsWith("og:") ? `property="${selector}"` : `name="${selector}"`;
  return html.replace(new RegExp(`<meta\\s+${attribute}\\s+content="[^"]*"\\s*\\/?>`, "i"), `<meta ${attribute} content="${valueEscaped}">`);
}

function setStaticFormValues(html, config) {
  return html
    .replace(/(<input\b[^>]*name="from"[^>]*)(>)/i, (full, attrs, end) => `${attrs.replace(/\svalue="[^"]*"/i, "")} value="${esc(config.originValue)}"${end}`)
    .replace(/(<input\b[^>]*name="to"[^>]*)(>)/i, (full, attrs, end) => `${attrs.replace(/\svalue="[^"]*"/i, "")} value="${esc(config.destinationValue)}"${end}`);
}

function applyStaticBodyCorrections(html) {
  return html
    .replace("The Victoria–Vancouver corridor is one of Canada's busiest long-distance moving routes. Whether you're relocating for work, moving closer to family, or planning a major move between provinces, Purely Canadian Movers has the experience and infrastructure to get your belongings there safely.", "A Victoria to Toronto move begins with Vancouver Island pickup and ferry planning before the eastbound cross-country linehaul. Toronto delivery may also require advance condo, elevator, parking, or loading arrangements.")
    .replace("We also handle the reverse: Vancouver to Victoria moves are equally common, and we provide the same level of service regardless of direction.", "We also coordinate the reverse Toronto to Victoria route with the same written-estimate and route-planning process.")
    .replace(/What Makes a Victoria–Vancouver Move Unique/g, "What Makes a Victoria–Toronto Move Unique")
    .replace(/How Your Victoria–Vancouver Move Works/g, "How Your Victoria–Toronto Move Works")
    .replace("Vancouver's climate: Vancouver's mild, wet winters mean we protect electronics and wood furniture from moisture during transit. Summer moves are popular but require early scheduling. Elevator bookings and condo rules add another layer of planning.", "Seasonal corridor planning: Vancouver Island rain, mountain weather, prairie conditions, and Toronto winters can all affect the route. Protect temperature-sensitive items and allow realistic scheduling flexibility.")
    .replace(/Cross-Country Transit/g, "Interprovincial Transit")
    .replace(/<div class="pcm-estimate-bonus">[\s\S]*?(?=<div class="pcm-estimate-trust-note">)/i, "")
    .replace("Direct mover since 1991", "Family-owned since 1991");
}

function insertAfterFirstQuote(html, markup) {
  const marker = html.search(/<section\b[^>]*class="[^"]*\bpcm-lead-panel\b/i);
  if (marker < 0) return html.replace(/<\/body>/i, `${markup}\n</body>`);
  const tags = /<\/?section\b[^>]*>/gi;
  tags.lastIndex = marker;
  let depth = 0;
  let match;
  while ((match = tags.exec(html))) {
    depth += /^<section\b/i.test(match[0]) ? 1 : -1;
    if (depth === 0) return html.slice(0, tags.lastIndex) + markup + html.slice(tags.lastIndex);
  }
  throw new Error("Unbalanced quote section");
}

for (const [route, config] of Object.entries(torontoVictoriaRoutes)) {
  const file = join(root, route.slice(1), "index.html");
  const canonical = `https://purelycanadianmovers.com${route}`;
  let html = await readFile(file, "utf8");

  html = setMeta(html, "title", config.title);
  html = setMeta(html, "description", config.description);
  html = setMeta(html, "og:title", config.title);
  html = setMeta(html, "og:description", config.description);
  html = setMeta(html, "twitter:title", config.title);
  html = setMeta(html, "twitter:description", config.description);
  html = html
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<link rel="canonical"(?: id="canonical-tag")? href="[^"]*"\s*\/?>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`);

  html = removeFaqSchemas(html)
    .replace(/\s*<script type="application\/json" id="pcm-step39-config">[\s\S]*?<\/script>/i, "")
    .replace(/\s*<link rel="stylesheet" href="\/assets\/step39-toronto-victoria\.css"[^>]*>/i, "")
    .replace(/\s*<script(?: defer)? src="\/assets\/step39-toronto-victoria\.js"[^>]*><\/script>/i, "")
    .replace(/<section\b[^>]*data-pcm-step39-pricing="1"[^>]*>[\s\S]*?<\/section>\s*/gi, "")
    .replace(/<section\b[^>]*data-pcm-step39-faq="1"[^>]*>[\s\S]*?<\/section>\s*/gi, "")
    .replace(/<section\b[^>]*data-pcm-route-faq-static="1"[^>]*>[\s\S]*?<\/section>\s*/gi, "");

  // Earlier route text normalization accidentally converted negative SVG path
  // coordinates into en-dashes on these two checked-in documents.
  html = html.replaceAll("1–3.18", "1-3.18").replaceAll("1–3.06", "1-3.06");

  html = removeSectionByHeading(html, /Frequently Asked Questions/i);
  html = removeSectionByHeading(html, /^How much does it cost to move from (Toronto to Victoria|Victoria to Toronto)\?$/i);
  if (route === "/victoria-to-toronto-movers/") html = applyStaticBodyCorrections(setStaticFormValues(html, config));

  const payload = JSON.stringify({ ...config, ...torontoVictoriaFacts }).replaceAll("<", "\\u003c");
  html = html.replace("</head>", `${faqSchema(config)}\n    <script type="application/json" id="pcm-step39-config">${payload}</script>\n${styleTag}\n${scriptTag}\n</head>`);
  html = insertAfterFirstQuote(html, pricingSection(config));
  html = html.replace(/<\/body>/i, `${faqSection(config)}\n</body>`);

  const moduleBootstrap = /<script\b[^>]*type=["']module["']/i.test(html);
  if (route === "/toronto-to-victoria-movers/" && !moduleBootstrap) throw new Error(`${route}: React bootstrap missing`);
  if (route === "/victoria-to-toronto-movers/" && moduleBootstrap) throw new Error(`${route}: static route gained React bootstrap`);
  if ((html.match(/data-pcm-step39="toronto-victoria"/g) ?? []).length !== 2) throw new Error(`${route}: invalid Step 39 asset registration`);
  if ((html.match(/data-pcm-step39-pricing="1"/g) ?? []).length !== 1) throw new Error(`${route}: invalid Step 39 pricing`);
  if ((html.match(/data-pcm-step39-faq="1"/g) ?? []).length !== 1) throw new Error(`${route}: invalid Step 39 FAQ`);
  if ((html.match(/id="pcm-step39-faq-schema"/g) ?? []).length !== 1) throw new Error(`${route}: invalid Step 39 FAQ schema`);
  await writeFile(file, html, "utf8");
  console.log(`Finalized Step 39 route: ${route}`);
}
