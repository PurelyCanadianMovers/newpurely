# React-to-Static Migration Step 1: Calgary ↔ Toronto

Date: 2026-09-15  
Scope: `/calgary-to-toronto-movers/` and `/toronto-to-calgary-movers/` only  
Deployment: not deployed  
Commit: not committed

## Final ownership

Both routes are now **A — Static Safe**. `tools/rebuild-calgary-toronto-static-routes.mjs` is the sole full-page owner for the reciprocal pair. Static, route-specific HTML owns metadata, H1, quote form, pricing, Route at a Glance, directional main content, related destinations, FAQ, FAQPage schema, closing CTA, and footer. The pages do not load `assets/index-CNBNs70h.js`; dormant route mappings `rhe` and `zme` remain in the untouched compiled bundle but cannot mount on these pages.

## Authoritative facts

The existing pair finalizer, checked-in route output, cost-guide evidence, and pre-edit final browser render agreed with the established values. No conflict required escalation.

- Distance: approximately 3,400 km
- Transit: 7–19 days
- Studio or small shipment: $2,500+
- 1-bedroom: $3,800+
- 2-bedroom: $6,400+
- 3-bedroom: $10,000+
- 4+ bedroom: $15,000+
- Overall planning range: $2,500–$15,000+
- Currency: CAD; planning ranges, not guaranteed quotes
- Protection terminology: Declared Value Protection

These values are frozen in `tools/calgary-toronto-route-data.mjs` and validated against both templates on every pair rebuild.

## Architecture before and after

Before: `generate-spa-routes.mjs` owned both pages, the module bootstrap loaded `index-CNBNs70h.js`, React components replaced the route body, and `finalize-calgary-toronto-routes.mjs` normalized important facts after mount.

After: pair-owned static templates generate the final route HTML. Only shared conversion behavior, the approved static navigation/chat layers, and a pair-scoped navigation keyboard helper run. No route-critical section depends on React, hydration, delayed mutation, or route-component selection. The legacy finalizer remains as historical evidence but is removed from the active build chain.

## Directional preservation

- Calgary → Toronto retains Calgary/Alberta origin language, eastbound pickup and cross-country logistics, Calgary-origin form defaults, route-specific FAQ wording, Toronto delivery considerations, related destinations, metadata, and CTA wording.
- Toronto → Calgary retains Toronto/Ontario origin language, westbound logistics, Toronto-origin form defaults, Calgary delivery and Alberta arrival considerations, route-specific FAQ wording, related destinations, metadata, and CTA wording.

The two pages are not duplicate directional copy.

## React-removal evidence

- Raw HTML has one final route H1, quote form, pricing table, Route at a Glance, FAQ section, and FAQPage schema.
- Neither raw page contains the React module bootstrap, legacy Step 22 mutation runtime, or Toronto/Calgary relocation runtime.
- Initial, 1.2-second, and 5.2-second browser snapshots retain the same route identity, facts, form defaults, section counts, and FAQ/schema parity.
- A temporary visible direct-H1 edit survived initial render, a five-second delayed check, a cache-busted request, and hard refresh on both routes; the proof script restored the original files in `finally`.
- The aggregate SPA generator explicitly skips both routes because they belong to `rebuild-calgary-toronto-static-routes.mjs`.
- Two isolated aggregate builds retained identical target hashes and did not restore the React bootstrap.

Evidence: `STEP_01_CALGARY_TORONTO_BEFORE.json`, `STEP_01_CALGARY_TO_TORONTO_AFTER.json`, `STEP_01_TORONTO_TO_CALGARY_AFTER.json`, and `STEP_01_DIRECT_EDIT_PROOF.json`.

## Local browser and responsive QA

Both routes passed at 1280×900 and 390×844. Verified: correct title/description/canonical/OG URL, one H1, one quote form, directional defaults, one pricing section/table with five rows, one Route at a Glance, one FAQ section, one FAQPage schema, visible/schema FAQ parity, no `Moving Cost Breakdown`, no `.pcm-local-seo`, no `undefined`, no soft 404, no page-level horizontal overflow, no clipped controls, and pricing confined to its narrow-screen horizontal scroller.

Desktop dropdown navigation, mobile menu open/Escape-close state, focus behavior, and chatbot open/close passed. The final audits recorded no console errors.

## Regression results

`STEP_01_REGRESSION.json` passed all four required representatives after a five-second settled render:

- React-owned: `/edmonton-to-toronto-movers/`
- Hybrid: `/calgary-to-winnipeg-movers/`
- Static Safe: `/calgary-to-edmonton-movers/`
- Required reference: `/montreal-to-edmonton-movers/`

Route identity, declared ownership, directional form defaults, pricing table, FAQ/schema, navigation, chatbot, and non-404 rendering remained intact.

## Generator durability and ownership validation

The dedicated pair generator produced byte-identical SHA-256 hashes on consecutive runs:

- Calgary → Toronto: `7EA651330C0FB031F5924F8FB4C4DD7366F5BF8F0DE9795AC24B7B4C69B5483D`
- Toronto → Calgary: `884376374BC8EE8FD8F12401CFDF9ACE23D84D7E6421940E6BB56A43E6D87292`

The same hashes remained stable across two full aggregate builds in an isolated temporary copy. `validate-route-page-ownership.mjs` reports 56 routes, exactly one full-page owner each, and zero collisions. Ownership totals are A=28, B=15, C=13, D=0. The other 15 B routes retain their previous owners.

## Files changed

Production and maintained source:

- `site-copy/calgary-to-toronto-movers/index.html`
- `site-copy/toronto-to-calgary-movers/index.html`
- `site-copy/assets/step01-calgary-toronto-static.js`
- `tools/templates/calgary-toronto-static-routes/calgary-to-toronto-movers.html`
- `tools/templates/calgary-toronto-static-routes/toronto-to-calgary-movers.html`
- `tools/calgary-toronto-route-data.mjs`
- `tools/rebuild-calgary-toronto-static-routes.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`

QA and documentation:

- `tools/audit-step54-calgary-toronto.mjs`
- `tools/audit-step01-regressions.mjs`
- `tools/prove-step01-static-ownership.mjs`
- `docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md`
- `docs/LONG_DISTANCE_ROUTE_EDITING_PLAYBOOK.md`
- `docs/REACT_TO_STATIC_STEP_01_CALGARY_TORONTO.md`
- `STEP_01_CALGARY_TORONTO_BEFORE.json`
- `STEP_01_CALGARY_TO_TORONTO_AFTER.json`
- `STEP_01_TORONTO_TO_CALGARY_AFTER.json`
- `STEP_01_DIRECT_EDIT_PROOF.json`
- `STEP_01_REGRESSION.json`

`site-copy/assets/index-CNBNs70h.js` was not edited.

## Unresolved issues

None for Migration Step 1. No other route was migrated. Nothing was deployed or committed. Migration Step 2 was not started.
