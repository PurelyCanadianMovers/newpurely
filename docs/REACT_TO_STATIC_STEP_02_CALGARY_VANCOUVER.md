# React-to-Static Migration Step 2: Calgary ↔ Vancouver

## Scope and outcome

Migration Step 2 converted only these routes:

- `/calgary-to-vancouver-movers/`
- `/vancouver-to-calgary-movers/`

Both routes are now **A — Static Safe**. Their checked-in HTML is the complete initial route document, and `tools/rebuild-calgary-vancouver-static-routes.mjs` is the single maintained full-page owner. React controls no metadata, route copy, quote form, pricing, Route at a Glance, FAQ, schema, related destinations, CTA, or footer content.

No Migration Step 3 route was changed.

## Authoritative facts

The reconciled pair data is frozen in `tools/calgary-vancouver-route-data.mjs`.

| Fact | Calgary → Vancouver | Vancouver → Calgary |
|---|---|---|
| Distance | Approximately 1,000 km | Approximately 1,000 km |
| Transit time | 4–13 days | 4–13 days |
| Studio | $2,000+ | $2,000+ |
| 1 bedroom | $2,600+ | $2,600+ |
| 2 bedroom | $3,500+ | $3,500+ |
| 3 bedroom | $4,800+ | $4,800+ |
| 4+ bedroom | $6,500+ | $6,500+ |
| Overall range | $1,800–$13,000+ | $1,800–$14,000+ |
| Quote defaults | Calgary, AB → Vancouver, BC | Vancouver, BC → Calgary, AB |
| FAQ count | 8 | 8 |

Calgary → Vancouver retains Calgary-origin/Alberta pickup guidance and westbound BC delivery content, including rainy-season preparation, the BC driver-licence update, and the change from Alberta's tax advantage. Vancouver → Calgary retains Vancouver-origin/BC pickup guidance and eastbound Alberta delivery content, including condo-elevator booking, Calgary climate swings, and the Alberta health-card update.

### Reconciliation decision

The legacy Step 33 source contained older raw description text, while the settled production-equivalent React render exposed the route-specific descriptions users and search engines currently received. Because this migration preserves current final behavior, the settled rendered metadata was retained:

- Calgary → Vancouver: “Calgary to Vancouver movers. Professional, fully insured long-distance moves. Family-owned since 1991. GCVL agents. Free estimates.”
- Vancouver → Calgary: “Vancouver to Calgary movers. Professional, fully insured long-distance moves through the Rockies. Family-owned since 1991. GCVL agents. Free estimates — call 1-877-485-6683.”

Numeric facts agreed across the route data, Step 33 implementation/report, and captured final render. The eight visible FAQs and their FAQPage schema equivalents were preserved with exact parity. Reciprocal-route references in each page are intentional service context; no unrelated city or province contamination was found.

## Before and after architecture

Before migration, each raw page loaded `assets/index-CNBNs70h.js`, and compiled components `che` and `Zme` replaced the generic shell with the route body after mount. Direct HTML edits could therefore disappear.

After migration:

- the route HTML contains all route-critical content before JavaScript runs;
- no module bundle or Step 33 route-content runtime is loaded;
- `assets/static-nav.js`, `assets/step02-calgary-vancouver-static.js`, `assets/static-chat.js`, and `assets/conversion-boost.js` provide only approved progressive enhancement;
- the legacy Calgary/Vancouver standardizer is no longer an active writer;
- the two routes were removed from the React-era static FAQ fallback;
- the ownership registry and writer manifest declare one generator owner and zero collisions.

## Files changed

### Route output and runtime

- `site-copy/calgary-to-vancouver-movers/index.html`
- `site-copy/vancouver-to-calgary-movers/index.html`
- `site-copy/assets/step02-calgary-vancouver-static.js`

### Maintained source and ownership

- `tools/calgary-vancouver-route-data.mjs`
- `tools/rebuild-calgary-vancouver-static-routes.mjs`
- `tools/templates/calgary-vancouver-static-routes/calgary-to-vancouver-movers.html`
- `tools/templates/calgary-vancouver-static-routes/vancouver-to-calgary-movers.html`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/finalize-route-faq-architecture.mjs`
- `tools/route-page-ownership.test.mjs`

### Step 2 verification and evidence

- `tools/prove-step02-static-ownership.mjs`
- `tools/audit-step02-regressions.mjs`
- `tools/verify-step02-generator-durability.mjs`
- `STEP_02_CALGARY_VANCOUVER_BEFORE.json`
- `STEP_02_CURRENT_FINAL_RENDER.json`
- `STEP_02_CALGARY_VANCOUVER_AFTER.json`
- `STEP_02_DIRECT_EDIT_PROOF.json`
- `STEP_02_GENERATOR_DURABILITY.json`
- `STEP_02_REGRESSION.json`

### Documentation

- `docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md`
- `docs/LONG_DISTANCE_ROUTE_EDITING_PLAYBOOK.md`
- `docs/REACT_TO_STATIC_STEP_02_CALGARY_VANCOUVER.md`

## React-removal and local QA

The final browser audit passed both routes with:

- successful local HTTP-equivalent responses;
- self-canonical URLs and correct title, description, Open Graph, and Twitter metadata;
- one H1, one quote form with correct directional defaults, one pricing section/table with five rows, one Route at a Glance, one FAQ section, one FAQPage schema, one related-destinations section, one closing CTA, one footer, and one chatbot;
- exact visible FAQ/schema parity;
- zero `Moving Cost Breakdown`, stale promo, `.pcm-local-seo`, `undefined`, homepage replacement, or soft-404 output;
- approved Declared Value Protection terminology and no unsupported guaranteed-price claim;
- zero React bootstrap references in route HTML and no route-content mount.

The direct-edit proof injected a temporary marker into each static H1 and verified it survived initial load, a 5.5-second delayed render, normal reload, cache-busted reload, and hard refresh. The original files were restored afterward. Both routes passed.

## Responsive and interaction QA

Desktop and mobile viewport audits passed without horizontal overflow or console/page errors. Desktop dropdown navigation, mobile menu open/Escape-close behavior, and chatbot open/close behavior all passed. Navigation, chatbot, and footer remained single-instance.

## Regression results

The required regression matrix passed:

- remaining B route: `/edmonton-to-toronto-movers/`
- Hybrid route: `/calgary-to-winnipeg-movers/`
- Static Safe route: `/calgary-to-edmonton-movers/`
- required reference: `/montreal-to-edmonton-movers/`
- completed Step 1 route: `/calgary-to-toronto-movers/`

Each retained its declared ownership, directional form data, main route identity, pricing/table, FAQ/schema, navigation, chatbot, and footer contracts. No unrelated route was migrated.

## Generator durability and ownership validation

`tools/verify-step02-generator-durability.mjs` passed all three checks:

- direct owner second pass is byte-identical;
- aggregate second pass is byte-identical;
- aggregate output preserves the owner output and does not restore React ownership.

`tools/route-page-ownership.test.mjs` passed 26/26 tests. `tools/validate-route-page-ownership.mjs` passed all 56 route pages with exactly one declared full-page owner and zero collisions.

Final classification totals:

- A — Static Safe: 30
- B — React Owned: 13
- C — Hybrid: 13
- D — Other / Unknown: 0

## Unresolved issues and boundary

No unresolved Step 2 issue remains. Nothing was committed or deployed.
