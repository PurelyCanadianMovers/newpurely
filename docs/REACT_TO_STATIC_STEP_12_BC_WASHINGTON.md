# React-to-Static Migration Step 12: BC to Washington

Date: 2026-09-16
Route: `/bc-to-washington-movers/`
Scope: Migration Step 12 only. Local implementation and QA completed; no commit or deployment performed.

## Ownership result

The route is now A — Static Safe. Full-page ownership is `tools/rebuild-bc-washington-static-route.mjs`, with route facts in `tools/bc-washington-static-route-data.mjs` and the maintained settled template in `tools/templates/bc-washington-static-route.html`. The route no longer belongs to the SPA full-page writer. The expected repository classification is A43 / B0 / C13 / D0 across the existing 56-route inventory.

## Route implementation

The page preserves the cross-border hub rather than cloning a city-pair page. The final static HTML includes one H1, one pricing section/table, one `BC–Washington Route at a Glance` block, one visible FAQ section and matching FAQPage schema, one quote form with `British Columbia` and `Washington State` defaults, the existing navigation/chat shell, and a closing CTA.

The service-area coverage names Seattle, Bellevue, Redmond, Kirkland, Everett, and Tacoma. Route facts retain the qualified `~250 km` BC-to-Seattle/Bellevue distance, `24–48 hours` overnight service, `3–7 days` standard transit, and the five settled USD starting prices: `$2,150+`, `$2,700+`, `$3,100+`, `$3,700+`, and `$4,500+`.

Customs, documentation, and border wording remain within the settled route content. No reverse `/washington-to-bc-movers/` page was created. Bellevue/Redmond aliases remain redirect/service-area behavior and were not turned into duplicate route pages. The page links to the canonical Vancouver↔Seattle pair and related Canada–USA resources.

## Runtime and architecture

The target template is the captured settled route DOM. The target output removes the React module bootstrap and route-specific React dependency while retaining only the shared conversion, static navigation, and static chat enhancements. It contains no Step 39 target, stale Step 68/79 markers, `pcm-local-seo`, undefined text, legacy pricing-breakdown token, or reverse-route token.

## QA performed

- `node --test tools/route-page-ownership.test.mjs`: 27 passed, 0 failed.
- `node tools/rebuild-bc-washington-static-route.mjs site-copy`: passed.
- `node tools/validate-route-page-ownership.mjs site-copy`: 56 routes, exactly one owner, zero collisions.
- `node tools/validate-route-local-assets.mjs site-copy bc-to-washington-movers`: 7 local asset references checked.
- Generator was run twice in the focused test and produced byte-identical output.
- Generated HTML checks: one H1, one Step 12 FAQ section, one FAQPage schema, one canonical target URL, no module bootstrap, and required cities/facts/links present.
- Seattle↔Vancouver canonical pair files remained unchanged.

This report records local Step 12 completion only. Step 13 and repository cleanup remain out of scope.