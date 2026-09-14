import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";
import { edmontonOttawaFacts, edmontonOttawaRoutes } from "./edmonton-ottawa-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const routeUrls = Object.keys(edmontonOttawaRoutes);
assertAllowedPostProcessor("finalize-edmonton-ottawa-routes.mjs", routeUrls.map((route) => route.slice(1, -1)));
const styleTag = '    <link rel="stylesheet" href="/assets/step37-edmonton-ottawa.css" data-pcm-step37="edmonton-ottawa">';
const scriptTag = '    <script defer src="/assets/step37-edmonton-ottawa.js" data-pcm-step37="edmonton-ottawa"></script>';

function esc(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function faqSection(config) {
  return `<section data-pcm-step37-faq="1" class="pcm-step37-faq py-16 bg-gray-50"><div class="container max-w-3xl"><h2>Frequently Asked Questions</h2><div class="space-y-4">${config.faq.map(([question, answer]) => `<article class="bg-white border border-gray-200 rounded-lg p-6"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("")}</div></div></section>`;
}

function faqSchema(config) {
  return `<script type="application/ld+json" id="pcm-step37-faq-schema">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  })}</script>`;
}

function setMeta(html, selector, value) {
  const escaped = esc(value);
  if (selector === "title") return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escaped}">${escaped}</title>`);
  const attribute = selector.startsWith("og:") ? `property="${selector}"` : `name="${selector}"`;
  const pattern = new RegExp(`<meta\\s+${attribute}\\s+content="[^"]*"\\s*\\/?>`, "i");
  return html.replace(pattern, `<meta ${attribute} content="${escaped}">`);
}

function removeFaqSchemas(html) {
  return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, (script) =>
    /["']@type["']\s*:\s*["']FAQPage["']/i.test(script) ? "" : script);
}

function applyContentCorrections(html, route) {
  let next = html
    .replace(/7–19 days/g, edmontonOttawaFacts.transit)
    .replace(/\$2,500-\$15,000\+/g, edmontonOttawaFacts.overallRange)
    .replace(/Cross-Country Transit/g, "Interprovincial Transit")
    .replace(/Professional, fully insured long-distance moving/g, "Professional interprovincial moving")
    .replace(/Valuation coverage available/g, "Declared Value Protection available")
    .replace(/No brokers or subcontractors/g, "No broker-style handoffs");
  if (route === "/edmonton-to-ottawa-movers/") {
    next = next
      .replace("Whether you're relocating for work in Ontario's energy sector, moving closer to family, or seeking a fresh start in Western Canada", "Whether you are relocating for work, moving closer to family, or planning an eastbound move to the National Capital Region")
      .replace("No Provincial Sales Tax in Ontario", "Plan for Ontario Sales Tax")
      .replace("Ontario has no PST - a financial advantage when settling in. Factor this into your overall relocation budget when comparing costs between Alberta and Ontario.", "Ontario applies harmonized sales tax, while Alberta does not levy a provincial sales tax. Include that difference when planning the household transition.")
      .replace("Explore Ottawa's River Valley", "Plan for Ottawa Neighbourhood Access")
      .replace("Ottawa has the largest urban park system in North America along the North Saskatchewan River. If you're choosing a neighbourhood, proximity to the river valley is a major quality-of-life factor.", "Ottawa neighbourhoods vary from dense central streets to suburban homes. Confirm truck access, parking restrictions, elevator bookings, and loading windows before delivery.")
      .replace("You have 90 days after establishing Ontario residency to register your vehicle and get an Ontario driver's licence. Visit an Ontario registry agent to complete the transfer.", "Review Ontario vehicle-registration and driver-licensing requirements promptly after establishing residency, using current ServiceOntario guidance.")
      .replace(/>your move is coordinated/g, ">Your move is coordinated");
  } else {
    next = next.replace("Your move is handled by our own crew - not a subcontractor - from the moment we arrive at your Ottawa home to the moment we deliver in Edmonton.", "Your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, with clear documentation and no broker-style handoff to unknown movers.");
  }
  return next;
}

for (const [route, config] of Object.entries(edmontonOttawaRoutes)) {
  const file = join(root, route.slice(1), "index.html");
  let html = await readFile(file, "utf8");
  html = setMeta(html, "title", config.title);
  html = setMeta(html, "description", config.description);
  html = setMeta(html, "og:title", config.title);
  html = setMeta(html, "og:description", config.description);
  html = setMeta(html, "twitter:title", config.title);
  html = setMeta(html, "twitter:description", config.description);
  const canonical = `https://purelycanadianmovers.com${route}`;
  html = html
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<link rel="canonical"(?: id="canonical-tag")? href="[^"]*"\s*\/?>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`);
  html = applyContentCorrections(html, route);
  html = removeFaqSchemas(html);
  html = html.replace(/(?:\r?\n)+(?=<\/head>)/i, "\n");
  html = html.replace(/<section\b[^>]*data-pcm-step37-faq="1"[^>]*>[\s\S]*?<\/section>\s*/gi, "");
  if (route === "/edmonton-to-ottawa-movers/") {
    html = html.replace(/<section data-loc="client\/src\/pages\/services\/EdmontonToOttawaMovers\.tsx:298"[\s\S]*?<\/section>(?=<section data-loc="client\/src\/pages\/services\/EdmontonToOttawaMovers\.tsx:313")/i, "");
  } else {
    html = html.replace(/<section\b[^>]*data-pcm-route-faq-static="1"[^>]*>[\s\S]*?<\/section>\s*/gi, "");
  }
  html = html.replace("</head>", `${faqSchema(config)}\n</head>`);
  html = html.replace("</body>", `${faqSection(config)}\n</body>`);
  if (!html.includes('data-pcm-step37="edmonton-ottawa"')) html = html.replace("</head>", `${styleTag}\n${scriptTag}\n</head>`);
  if ((html.match(/data-pcm-step37="edmonton-ottawa"/g) ?? []).length !== 2) throw new Error(`${route}: invalid Step 37 asset registration`);
  if ((html.match(/data-pcm-step37-faq="1"/g) ?? []).length !== 1) throw new Error(`${route}: invalid Step 37 FAQ section`);
  if ((html.match(/id="pcm-step37-faq-schema"/g) ?? []).length !== 1) throw new Error(`${route}: invalid Step 37 FAQ schema`);
  if (route === "/edmonton-to-ottawa-movers/" && /<script\b[^>]*type=["']module["']/i.test(html)) throw new Error(`${route}: static route gained React bootstrap`);
  if (route === "/ottawa-to-edmonton-movers/" && !/<script\b[^>]*type=["']module["']/i.test(html)) throw new Error(`${route}: React bootstrap missing`);
  await writeFile(file, html, "utf8");
  console.log(`Finalized Step 37 route: ${route}`);
}
