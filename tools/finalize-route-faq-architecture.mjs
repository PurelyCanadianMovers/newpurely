import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";
import { alignFaqSchemaToVisible, extractVisibleFaqs } from "./faq-parity.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const staticFaqFallbackRoutes = new Set([
  "/bc-to-washington-movers/",
  "/montreal-to-calgary-movers/",
  "/ottawa-to-edmonton-movers/",
  "/toronto-to-vancouver-movers/",
  "/toronto-to-victoria-movers/",
  "/vancouver-to-halifax-movers/",
  "/vancouver-to-toronto-movers/",
]);

function removeBalancedSection(html, markerIndex) {
  const start = html.lastIndexOf("<section", markerIndex);
  if (start < 0) throw new Error("Could not find the generic FAQ section start");
  const tagPattern = /<\/?section\b[^>]*>/gi;
  tagPattern.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagPattern.exec(html))) {
    depth += /^<section\b/i.test(match[0]) ? 1 : -1;
    if (depth === 0) return html.slice(0, start) + html.slice(tagPattern.lastIndex);
  }
  throw new Error("Could not find the generic FAQ section end");
}

function removeGenericLocalSeo(html) {
  let changed = false;
  let markerIndex;
  while ((markerIndex = html.indexOf('data-pcm-static-local-seo="/"')) >= 0) {
    html = removeBalancedSection(html, markerIndex);
    changed = true;
  }
  if (changed) {
    html = html.replace(/\s*<script\b(?=[^>]*\bid=["']pcm-faq-schema["'])[^>]*>[\s\S]*?<\/script>\s*/gi, "\n");
  }
  return html;
}

function retireLocalSeoClass(html) {
  return html.replace(/(<section\b[^>]*\bclass=["'][^"']*)\bpcm-local-seo\b([^"']*["'][^>]*>)/gi, "$1pcm-route-support$2");
}

function faqEntityCount(html) {
  let count = 0;
  for (const match of html.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (value) => {
        if (!value || typeof value !== "object") return;
        if (value["@type"] === "FAQPage") count += 1;
        if (Array.isArray(value)) value.forEach(walk);
        else Object.values(value).forEach(walk);
      };
      walk(JSON.parse(match[1]));
    } catch {}
  }
  return count;
}

function faqEntityEntries(html) {
  const entities = [];
  for (const match of html.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (value) => {
        if (!value || typeof value !== "object") return;
        if (value["@type"] === "FAQPage") entities.push(value.mainEntity ?? []);
        if (Array.isArray(value)) value.forEach(walk);
        else Object.values(value).forEach(walk);
      };
      walk(JSON.parse(match[1]));
    } catch {}
  }
  return entities;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function addStaticFaqFallback(html, entries) {
  const cards = entries.map((entry) =>
    `<details class="bg-white border border-gray-200 rounded-lg p-5"><summary class="font-semibold cursor-pointer">${escapeHtml(entry?.name)}</summary><p class="text-gray-700 mt-3">${escapeHtml(entry?.acceptedAnswer?.text)}</p></details>`
  ).join("");
  const section = `<section data-pcm-route-faq-static="1" class="pcm-route-faq-static py-16 px-4 bg-gray-50"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-8 text-slate-900">Frequently Asked Questions</h2><div class="space-y-4">${cards}</div></div></section>`;
  if (!/<\/body>/i.test(html)) throw new Error("Missing </body>");
  return html.replace(/<\/body>/i, `${section}\n</body>`);
}

function removeNonAuthoritativeFaqSections(html) {
  const headingPattern = /<h2\b[^>]*>[\s\S]*?(?:Frequently Asked Questions|Frequently asked questions|\bFAQ\b)[\s\S]*?<\/h2>/gi;
  while (true) {
    const headings = [...html.matchAll(headingPattern)];
    const duplicate = headings.find((heading) => {
      const start = html.lastIndexOf("<section", heading.index);
      const openEnd = html.indexOf(">", start);
      return start >= 0 && !/data-pcm-route-faq-static/i.test(html.slice(start, openEnd + 1));
    });
    if (!duplicate) return html;
    html = removeBalancedSection(html, duplicate.index);
  }
}

function addFaqSchema(html, entries) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const script = `<script type="application/ld+json" id="faq-schema">${JSON.stringify(schema)}</script>`;
  if (!/<\/head>/i.test(html)) throw new Error("Missing </head>");
  return html.replace(/<\/head>/i, `  ${script}\n</head>`);
}

for (const entry of routePageOwnership) {
  const file = join(root, entry.routeUrl.slice(1), "index.html");
  const before = readFileSync(file, "utf8");
  let html = retireLocalSeoClass(removeGenericLocalSeo(before));

  let visible;
  try { visible = extractVisibleFaqs(html); } catch { visible = null; }
  if (staticFaqFallbackRoutes.has(entry.routeUrl) && (!visible || html.includes("data-pcm-route-faq-static"))) {
    const hasFallback = html.includes("data-pcm-route-faq-static");
    html = removeNonAuthoritativeFaqSections(html);
    if (!hasFallback) {
      const entities = faqEntityEntries(html);
      if (entities.length !== 1 || !entities[0].length) throw new Error(`${entry.routeUrl}: cannot build the route FAQ fallback from exactly one FAQPage`);
      html = addStaticFaqFallback(html, entities[0]);
    }
    visible = extractVisibleFaqs(html);
  }
  if (visible?.length) {
    const entities = faqEntityCount(html);
    if (entities === 0) html = addFaqSchema(html, visible);
    else if (entities === 1) html = alignFaqSchemaToVisible(html);
    else throw new Error(`${entry.routeUrl}: ${entities} FAQPage entities remain after generic cleanup`);
  }

  if (html !== before) {
    writeFileSync(file, html);
    console.log(`FAQ architecture finalized: ${entry.routeUrl}`);
  }
}
