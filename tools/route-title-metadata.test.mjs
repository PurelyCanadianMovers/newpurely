import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeBrandTitle,
  normalizeCompiledSeoWriter,
  normalizeRouteHtml,
} from "./normalize-route-title-metadata.mjs";

test("brand normalizer handles zero, one, and repeated exact suffixes", () => {
  const base = "Montreal to Victoria & Nanaimo Movers";
  const canonical = `${base} | Purely Canadian Movers`;
  assert.equal(normalizeBrandTitle(base), canonical);
  assert.equal(normalizeBrandTitle(canonical), canonical);
  assert.equal(normalizeBrandTitle(`${canonical} | Purely Canadian Movers`), canonical);
});

test("brand normalizer preserves legitimate company wording before the suffix", () => {
  assert.equal(
    normalizeBrandTitle("Purely Canadian Movers Guide for Toronto Moves"),
    "Purely Canadian Movers Guide for Toronto Moves | Purely Canadian Movers",
  );
});

test("route HTML title fields converge and a second pass is byte-identical", () => {
  const input = '<html><head><title>Montreal to Toronto Movers</title><meta property="og:title" content="old"><meta name="twitter:title" content="old"></head><body><h1>Preserved</h1></body></html>';
  const first = normalizeRouteHtml(input, "/montreal-to-toronto-movers/").html;
  const second = normalizeRouteHtml(first, "/montreal-to-toronto-movers/").html;
  assert.equal(first, second);
  assert.match(first, /<h1>Preserved<\/h1>/);
  assert.equal((first.match(/Montreal to Toronto Movers \| Purely Canadian Movers/g) ?? []).length, 4);
});

test("compiled React SEO title writer normalization is idempotent", () => {
  const original = 'before function nt({title:e,description:t=CU,canonical:s,ogImage:r=NU,ogType:n="website",noIndex:o=!1}){const c=e?`${e} | ${d1}`:`${d1} | Professional Moving Company Vancouver BC Since 1991`; after';
  const first = normalizeCompiledSeoWriter(original);
  const second = normalizeCompiledSeoWriter(first);
  assert.equal(first, second);
  assert.match(first, /function pcmCanonicalTitle/);
});
