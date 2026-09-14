import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { torontoVancouverFacts, torontoVancouverFaqs, torontoVancouverRoutes } from "./toronto-vancouver-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const styleTag = '    <link rel="stylesheet" href="/assets/step38-toronto-vancouver.css" data-pcm-step38="toronto-vancouver">';
const scriptTag = '    <script src="/assets/step38-toronto-vancouver.js" data-pcm-step38="toronto-vancouver"></script>';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const faqMarkup = (faqs) => `<section data-pcm-route-faq-static="1" class="pcm-route-faq-static py-16 px-4 bg-gray-50"><div class="max-w-3xl mx-auto"><h2>Frequently Asked Questions</h2><div class="space-y-4">${faqs.map(({ question, answer }) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></div></section>`;
const pricingMarkup = (config) => `<section data-pcm-step38-prerender="1" class="pcm-lead-boost pcm-route-cost pcm-step38-pricing" aria-label="${escapeHtml(config.routeLabel)} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(config.routeLabel)} moving cost</div><h2>How much does it cost to move from ${escapeHtml(config.origin)} to ${escapeHtml(config.destination)}?</h2><p>A ${escapeHtml(config.routeLabel)} move uses an overall planning range of <strong>${escapeHtml(torontoVancouverFacts.range)}</strong>. Shipment size, actual weight or volume, access, packing, storage, season, and protection choices affect the written estimate.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${torontoVancouverFacts.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges, not guaranteed quotes. Final pricing depends on shipment weight or volume, access, packing, storage, season, and the selected Declared Value Protection option.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Long-Distance Moving Cost Guide</a><a href="/valuation-coverage-protection/">Declared Value Protection</a></div></div></section>`;

for (const [route, config] of Object.entries(torontoVancouverRoutes)) {
  const file = join(root, route.slice(1), "index.html");
  const canonical = `https://purelycanadianmovers.com${route}`;
  const title = `${config.routeLabel} Movers | Purely Canadian Movers`;
  const payload = JSON.stringify({ ...config, ...torontoVancouverFacts, faqs: torontoVancouverFaqs[route] }).replaceAll("<", "\\u003c");
  let html = await readFile(file, "utf8");

  html = html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapeHtml(title)}">${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(config.description)}">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(config.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(config.description)}">`)
    .replace(/<link rel="canonical" id="canonical-tag" href="[^"]*"\s*\/?>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`);

  html = html.replace(/\s*<script type="application\/json" id="pcm-step38-config">[\s\S]*?<\/script>/i, "");
  html = html.replace(/\s*<link rel="stylesheet" href="\/assets\/step38-toronto-vancouver\.css"[^>]*>/i, "");
  html = html.replace(/\s*<script(?: defer)? src="\/assets\/step38-toronto-vancouver\.js"[^>]*><\/script>/i, "");
  html = html.replace("</head>", `    <script type="application/json" id="pcm-step38-config">${payload}</script>\n${styleTag}\n${scriptTag}\n</head>`);
  html = html.replace(/\s*<section data-pcm-step38-prerender="1"[\s\S]*?<\/section>/i, "");
  html = html.replace(/<section data-pcm-route-faq-static="1"[\s\S]*?<\/section>\s*(?=<\/body>)/i, faqMarkup(torontoVancouverFaqs[route]));
  html = html.replace(/<\/body>/i, `${pricingMarkup(config)}\n</body>`);

  await writeFile(file, html, "utf8");
  console.log(`Finalized Step 38 route: ${route}`);
}
