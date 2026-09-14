import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

export const BRAND = "Purely Canadian Movers";
export const BRAND_SUFFIX = ` | ${BRAND}`;

// These routes had a generic homepage shell (or, for Vancouver-Halifax, a
// client-side 404) in the raw document. The wording comes from the route's
// established React SEO title where available; Vancouver-Halifax follows its
// existing route/H1 wording because the recovered bundle has no client route.
export const provenGenericTitleFixes = Object.freeze({
  "/bc-to-washington-movers/": "BC to Washington State Movers | Overnight Service",
  "/calgary-to-vancouver-movers/": "Calgary to Vancouver Movers",
  "/montreal-to-calgary-movers/": "Montreal to Calgary Movers",
  "/montreal-to-edmonton-movers/": "Montreal to Edmonton Movers",
  "/ottawa-to-edmonton-movers/": "Ottawa to Edmonton Movers",
  "/toronto-to-vancouver-movers/": "Toronto to Vancouver Movers",
  "/toronto-to-victoria-movers/": "Toronto to Victoria & Nanaimo Movers",
  "/vancouver-to-calgary-movers/": "Vancouver to Calgary Movers",
  "/vancouver-to-halifax-movers/": "Vancouver to Halifax Movers",
  "/vancouver-to-toronto-movers/": "Vancouver to Toronto Movers",
});

// The complete pre-fix audit proved these documents and their settled runtime
// fields were already canonical. They remain byte-stable and do not need the
// authority marker used to protect corrected routes from late runtime writers.
const provenCanonicalRoutes = new Set([
  "/calgary-to-edmonton-movers/",
  "/calgary-to-montreal-movers/",
  "/edmonton-to-calgary-movers/",
  "/montreal-to-victoria-movers/",
  "/ottawa-to-victoria-movers/",
  "/vancouver-to-edmonton-movers/",
  "/victoria-to-toronto-movers/",
]);

export function normalizeBrandTitle(title) {
  let routeTitle = String(title ?? "").trim();
  while (routeTitle.toLowerCase().endsWith(BRAND_SUFFIX.toLowerCase())) {
    routeTitle = routeTitle.slice(0, -BRAND_SUFFIX.length).trimEnd();
  }
  if (!routeTitle) throw new Error("Cannot brand an empty route title.");
  return `${routeTitle}${BRAND_SUFFIX}`;
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function replaceSocialTitle(html, attribute, value, canonicalTitle) {
  let matches = 0;
  const next = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    const selector = new RegExp(`\\b${attribute}\\s*=\\s*["']${value}["']`, "i");
    if (!selector.test(tag)) return tag;
    matches += 1;
    if (/\bcontent\s*=\s*(["']).*?\1/is.test(tag)) {
      return tag.replace(/\bcontent\s*=\s*(["']).*?\1/is, `content="${escapeHtml(canonicalTitle)}"`);
    }
    return tag.replace(/\s*\/?\s*>$/, ` content="${escapeHtml(canonicalTitle)}">`);
  });
  if (matches > 0) return next;
  const meta = `<meta ${attribute}="${value}" content="${escapeHtml(canonicalTitle)}">`;
  return next.replace(/<\/head>/i, `  ${meta}\n</head>`);
}

export function normalizeRouteHtml(html, routeUrl) {
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) throw new Error(`${routeUrl} has no HTML title.`);
  const sourceTitle = provenGenericTitleFixes[routeUrl] ?? decodeHtml(titleMatch[1].replace(/\s+/g, " ").trim());
  const canonicalTitle = normalizeBrandTitle(sourceTitle);
  const titleTag = provenCanonicalRoutes.has(routeUrl)
    ? `<title>${escapeHtml(canonicalTitle)}</title>`
    : `<title data-pcm-authoritative-route-title="${escapeHtml(canonicalTitle)}">${escapeHtml(canonicalTitle)}</title>`;
  let next = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, titleTag);
  next = replaceSocialTitle(next, "property", "og:title", canonicalTitle);
  next = replaceSocialTitle(next, "name", "twitter:title", canonicalTitle);
  return { html: next, canonicalTitle };
}

export function normalizeCompiledSeoWriter(bundle) {
  const original = 'function nt({title:e,description:t=CU,canonical:s,ogImage:r=NU,ogType:n="website",noIndex:o=!1}){const c=e?`${e} | ${d1}`:`${d1} | Professional Moving Company Vancouver BC Since 1991`;';
  const replacement = 'function pcmCanonicalTitle(e){const t=` | ${d1}`;let s=String(e||"").trim();for(;s.toLowerCase().endsWith(t.toLowerCase());)s=s.slice(0,-t.length).trimEnd();return s?`${s}${t}`:""}function nt({title:e,description:t=CU,canonical:s,ogImage:r=NU,ogType:n="website",noIndex:o=!1}){const c=e?pcmCanonicalTitle(e):`${d1} | Professional Moving Company Vancouver BC Since 1991`;';
  const originalCount = bundle.split(original).length - 1;
  const replacementCount = bundle.split(replacement).length - 1;
  if (originalCount === 1 && replacementCount === 0) return bundle.replace(original, replacement);
  if (originalCount === 0 && replacementCount === 1) return bundle;
  throw new Error(`Unexpected compiled SEO title writer state (original=${originalCount}, normalized=${replacementCount}).`);
}

export function normalizeRepository(root = "site-copy") {
  const changedRoutes = [];
  for (const entry of routePageOwnership) {
    const file = join(root, entry.routeUrl.slice(1), "index.html");
    const before = readFileSync(file, "utf8");
    const { html, canonicalTitle } = normalizeRouteHtml(before, entry.routeUrl);
    if (html !== before) {
      writeFileSync(file, html, "utf8");
      changedRoutes.push({ route: entry.routeUrl, canonicalTitle });
    }
  }

  const bundleFile = join(root, "assets", "index-CNBNs70h.js");
  if (!existsSync(bundleFile)) throw new Error(`Missing compiled SPA bundle: ${bundleFile}`);
  const bundleBefore = readFileSync(bundleFile, "utf8");
  const bundleAfter = normalizeCompiledSeoWriter(bundleBefore);
  if (bundleAfter !== bundleBefore) writeFileSync(bundleFile, bundleAfter, "utf8");
  return { changedRoutes, bundleChanged: bundleAfter !== bundleBefore };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const root = resolve(process.argv[2] ?? "site-copy");
  const result = normalizeRepository(root);
  console.log(`Normalized title metadata for ${result.changedRoutes.length} route documents; SPA SEO writer changed=${result.bundleChanged}.`);
}
