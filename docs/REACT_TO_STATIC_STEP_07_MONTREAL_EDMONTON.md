# Migration Step 7 — Montreal → Edmonton

Status: local implementation and QA complete. Nothing committed or deployed.

## Final classification

`/montreal-to-edmonton-movers/` is now **A — Static Safe**. Before Step 7, the route was still declared under `generate-spa-routes.mjs`, mapped to React component `Ehe`, and processed by `finalize-montreal-edmonton-routes.mjs`. Its canonical-looking HTML was therefore only shell/reference output: the React bundle and Step 62 inline runtime could replace route content after load.

After Step 7, `rebuild-montreal-edmonton-static-route.mjs` is the sole full-page owner. The route contains its metadata, H1, hero/main content, quote panel/form, pricing, Route at a Glance, related destinations, FAQ/schema, CTA, and footer in initial static HTML. It loads only the approved static navigation/chat and conversion enhancements; React is not required for core content.

## Authoritative facts and reconciliation

The strongest current repository evidence is the Montreal–Edmonton finalizer/fact policy, the canonical cost-guide route data, the Step 62 rendered output, and the established Montreal–Calgary route-family policy. They agree on:

- Distance: approximately 3,500 km; Glance display `~3,500 km`
- Transit: 7–19 days
- Studio: `$2,500+`
- 1-bedroom: `$4,700+`
- 2-bedroom: `$6,300+`
- 3-bedroom: `$10,000+`
- 4+ bedroom: `$15,000+`
- Overall range: `$2,500–$15,000+`

The older rendered route contained stale direction-specific wording such as roughly 3,400 km, legacy tax/health-card language, and full-value/valuation terminology. Those were reconciled to the current Montreal-origin, Quebec-to-Alberta planning language and Declared Value Protection terminology. Montreal pickup logistics, westbound/interprovincial planning, Edmonton delivery logistics, metadata, related destinations, FAQ answers, and form defaults are directional.

## Exact files changed

- `site-copy/montreal-to-edmonton-movers/index.html`
- `tools/rebuild-montreal-edmonton-static-route.mjs`
- `tools/audit-step07-regressions.mjs`
- `tools/prove-step07-static-ownership.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/finalize-montreal-edmonton-routes.mjs` (reverse-route-only legacy finalizer boundary)
- `docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md`
- `docs/LONG_DISTANCE_ROUTE_EDITING_PLAYBOOK.md`
- `docs/REACT_TO_STATIC_STEP_07_MONTREAL_EDMONTON.md`
- `STEP_07_PREEDIT_MONTREAL_EDMONTON.json`
- `STEP_07_LOCAL_TARGET_AUDIT.json`
- `STEP_07_DIRECT_PROOF.json`
- `STEP_07_REGRESSION.json`
- `STEP_07_GENERATOR_DURABILITY.json`

The generator reuses the established static shell/template as structural precedent; no React bundle was edited. `/edmonton-to-montreal-movers/` was not migrated or rewritten.

## QA evidence

- Raw and initial static HTML: one H1, one quote form, one pricing table, one Glance block, one FAQ section, one FAQPage schema, and exact visible/schema FAQ parity.
- Facts, canonical/title/description/OG metadata, directional defaults, Declared Value Protection wording, no unsupported guaranteed-price language, no `.pcm-local-seo`, no `undefined`, no soft 404, and no stale promo passed.
- Desktop and mobile overflow checks passed; the pricing table scrolls inside its mobile wrapper. Playfair Display H1 sizing is 48/60 desktop and 36/45 mobile; Source Sans 3 remains the body/form family.
- Static navigation passed initial hidden state, open/close, `aria-expanded`, and Escape reset. Desktop dropdown and chatbot open/close passed; mobile chatbot open/close passed.
- Direct static-edit proof passed initial, delayed, normal reload, cache-busted reload, and hard refresh. No React bootstrap was present.
- Ownership validator: 56 routes, one collision-free owner each. Totals: **A38 / B5 / C13 / D0**.
- Full ownership test suite: **27 passed, 0 failed**.
- Scoped regression set: **7 routes passed, 0 failures** — reverse Montreal–Edmonton, remaining B, Hybrid, unrelated Static Safe, Step 1, and Step 6 precedents.
- Generator durability: two runs were byte-identical; aggregate dry-run places the generator in the authoritative order before the reverse-only legacy finalizer. The reverse route hash was unchanged.

## Unresolved issues

None for Step 7 local scope.

No other route was migrated. Nothing was committed. Nothing was deployed. Migration Step 8 was not started.
