# React to Static Route Migration — Step 5

Date: 2026-09-16
Scope: `/toronto-to-vancouver-movers/` and `/vancouver-to-toronto-movers/` only.

## Final classification

Both routes are now **A — Static Safe**. Static HTML is the final owner of metadata, hero/main content, quote form, pricing, Route at a Glance, related destinations, FAQ/schema, closing CTA, navigation shell, chatbot launcher, and footer. The other routes were not migrated.

## Reconciled authoritative facts

The existing `tools/toronto-vancouver-route-data.mjs`, Step 38 finalizer, FAQ/schema, cost-guide evidence, and settled pre-edit browser render agreed on the corrected fact set. No unresolved fact conflict remained.

| Fact | Both directions |
|---|---|
| Distance | `~4,400 km` |
| Transit | `9–22 days` |
| Studio | `$2,500+` |
| 1-bedroom | `$4,700+` |
| 2-bedroom | `$6,500+` |
| 3-bedroom | `$10,000+` |
| 4+ bedroom | `$15,000+` |
| Overall range | `$2,500–$15,000+` |

Toronto → Vancouver retains Toronto/Ontario pickup, westbound corridor, Vancouver strata/elevator/loading-zone/wet-weather delivery guidance, Toronto → Vancouver metadata, 9 directional FAQs, related reverse-route links, and `Toronto, ON` → `Vancouver, BC` form defaults.

Vancouver → Toronto retains Vancouver/BC pickup, eastbound corridor, Toronto condo/elevator/curb-access/winter delivery guidance, Vancouver → Toronto metadata, 9 directional FAQs, related reverse-route links, and `Vancouver, BC` → `Toronto, ON` form defaults.

## Before and after architecture

Before Step 5, `generate-spa-routes.mjs` produced the route shell, `index-CNBNs70h.js` mounted the React route component, and `finalize-toronto-vancouver-routes.mjs` plus `step38-toronto-vancouver.js` corrected route content after load.

After Step 5, `rebuild-toronto-vancouver-static-routes.mjs` copies maintained static templates. The pages retain `step38-toronto-vancouver.css` as presentation-only CSS for the Glance/typography treatment, but no longer load the Step 38 JavaScript, Step 38 config, React bundle, or delayed route repair.

## Step 38 runtime-removal and React proof

- Neither target HTML contains `index-CNBNs70h.js`.
- Neither target HTML contains `step38-toronto-vancouver.js` or `pcm-step38-config`.
- Both target pages contain the final route body, pricing, Glance, forms, FAQs, FAQPage schema, related destination links, CTAs, footer, and chatbot launcher in initial static HTML.
- Direct-edit proof passed for initial load, delayed render, normal reload, cache-busted reload, and hard refresh; both direct-edit markers survived and were restored afterward.
- The target audit confirmed `reactBundleRequested: false`, stable initial/delayed/settled snapshots, and no route-body replacement.

## Navigation, chatbot, and responsive QA

Both target routes contain and load `static-nav.css`, `static-nav.js`, `static-chat.css`, `static-chat.js`, and `conversion-boost.js`.

At 390×844, both routes passed initially hidden menu, open, correct `aria-expanded`, trigger toggle-close, Escape close with ARIA reset, chatbot open/close, and no horizontal overflow. At 1280×900, Services dropdowns opened correctly and chatbot open/close passed. The Glance uses the bordered light-background rounded container, red glyphs, uppercase labels, bold values, three-column desktop grid, and one-column mobile stacking.

Typography passed: Playfair Display headings with desktop H1 `48px / 60px / 700` and mobile H1 `36px / 45px / 700`; Source Sans 3 for body, forms, buttons, pricing, and CTA text.

## Local validation

- `validate-route-page-ownership.mjs`: 56 routes, one owner each, zero collisions.
- Ownership tests: 27/27 passed.
- Aggregate dry run: passed; Step 5 generator is ordered before shared postprocessors.
- Target browser audit: both routes passed all static, fact, structure, CSS, responsive, and interaction checks.
- Regression audit: 11 routes passed, including a remaining B route, Hybrid route, unrelated Static Safe routes, and Step 1–4 representatives.
- Generator durability: three consecutive pair passes were byte-identical; evidence is in `STEP_05_GENERATOR_DURABILITY.json`.
- Step 38 CSS remains used by both targets; Step 38 JavaScript is no longer used by this pair and was not deleted because unrelated historical evidence may still reference it.

## Files changed

- `site-copy/toronto-to-vancouver-movers/index.html`
- `site-copy/vancouver-to-toronto-movers/index.html`
- `tools/templates/toronto-vancouver-static-routes/toronto-to-vancouver-movers.html`
- `tools/templates/toronto-vancouver-static-routes/vancouver-to-toronto-movers.html`
- `tools/toronto-vancouver-static-route-data.mjs`
- `tools/rebuild-toronto-vancouver-static-routes.mjs`
- `tools/audit-step05-toronto-vancouver.mjs`
- `tools/audit-step05-regressions.mjs`
- `tools/prove-step05-static-ownership.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/route-writer-manifest.mjs`
- `docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md`
- `docs/LONG_DISTANCE_ROUTE_EDITING_PLAYBOOK.md`
- `docs/REACT_TO_STATIC_STEP_05_TORONTO_VANCOUVER.md`
- `STEP_05_PREEDIT_TORONTO_VANCOUVER.json`
- `STEP_05_LOCAL_TARGET_AUDIT.json`
- `STEP_05_REGRESSION.json`
- `STEP_05_DIRECT_PROOF.json`
- `STEP_05_GENERATOR_DURABILITY.json`

## Final totals and boundary

- A — Static Safe: **36**
- B — React Owned: **7**
- C — Hybrid: **13**
- D — Other / Unknown: **0**

Unresolved issues: none for the Step 5 pair. Nothing was committed. Nothing was deployed. Migration Step 6 was not started.