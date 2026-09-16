# React → Static Migration Step 3: Edmonton ↔ Toronto

Date: 2026-09-16
Scope: `/edmonton-to-toronto-movers/` and `/toronto-to-edmonton-movers/` only.

## Outcome

Both reciprocal routes are now A — Static Safe. Their final route-content DOM is served from static HTML, the React bundle is no longer loaded, and direct HTML edits survive initial, delayed, normal reload, cache-busted, and hard-refresh renders.

Ownership after Step 3:

- A — Static Safe: 32
- B — React Owned: 11
- C — Hybrid: 13
- D — Other / Unknown: 0

No Step 4 route was changed. Nothing was committed or deployed.

## Pre-edit observed behavior

Before conversion, both routes loaded `/assets/index-CNBNs70h.js` and mounted the mapped React components `Rhe` (Edmonton → Toronto) and `Yme` (Toronto → Edmonton). The settled browser render had the correct directional H1, metadata, quote-form defaults, pricing, Route at a Glance, FAQ, schema, navigation, chat, and footer, but static edits were not durable after React mount.

The reconciled route facts retained in the static pair are:

- Distance: approximately 3,500 km; display: `~3,500 km`
- Transit: `7–16 days` in both directions
- Overall estimate: `$2,500–$15,000+`
- Studio/small shipment: `$2,500+`
- 1-bedroom: `$4,500–$5,500+`
- 2-bedroom: `$6,000–$7,000+`
- 3-bedroom: `$10,000+`
- 4+ bedroom: `$12,000–$15,000+`

## Authoritative implementation

- `tools/edmonton-toronto-route-data.mjs` — frozen route facts, metadata, direction-specific defaults, and FAQ contract.
- `tools/templates/edmonton-toronto-static-routes/` — maintained static templates for both directions.
- `tools/rebuild-edmonton-toronto-static-routes.mjs` — deterministic pair generator; run with `node tools/rebuild-edmonton-toronto-static-routes.mjs site-copy` or through `npm run routes`.
- `site-copy/edmonton-to-toronto-movers/index.html`
- `site-copy/toronto-to-edmonton-movers/index.html`
- `tools/route-page-ownership.mjs` — one static full-page owner and shared runtime enhancers for each target.
- `tools/route-writer-manifest.mjs` — authoritative aggregate order; the old Toronto–Edmonton finalizer is retained only as legacy evidence and no longer runs.

The static templates preserve route-specific metadata, pricing, forms and defaults, Route at a Glance, FAQ/schema, related links, CTAs, navigation, chat, footer, and responsive behavior. The maintained inline Glance style remains pair-scoped; no route-content replacement runtime was added.

## QA and evidence

Commands completed successfully:

- `node tools/rebuild-edmonton-toronto-static-routes.mjs site-copy`
- `node tools/validate-route-page-ownership.mjs site-copy`
- `node --test tools/route-page-ownership.test.mjs` — 26 passing tests
- `npm run routes:dry-run` — passed with no writes
- `node tools/prove-step03-static-ownership.mjs site-copy http://127.0.0.1:4175 STEP_03_DIRECT_EDIT_PROOF.json`
- `node tools/audit-step03-regressions.mjs http://127.0.0.1:4175 STEP_03_REGRESSION.json`

Browser regression covered both Step 3 routes plus representative React, hybrid, Static Safe, Step 1, and Step 2 routes. All had one H1, one quote form, one FAQ section/schema, one table, one navigation, one footer, one chat launcher, correct direction, no visible `undefined`, no soft-404, and no console errors.

Evidence files:

- `STEP_03_CURRENT_FINAL_RENDER.json`
- `STEP_03_DIRECT_EDIT_PROOF.json`
- `STEP_03_GENERATOR_DURABILITY.json`
- `STEP_03_REGRESSION.json`

The generator second pass produced identical SHA-256 hashes for both target outputs.

## Changed-file boundary

Step 3 changes are limited to the two target route outputs, their pair data/templates/generator, ownership and writer manifests, the two authoritative ownership documents, this migration report, and the Step 3 QA/evidence files. Existing unrelated worktree changes were preserved. No commit or deployment was performed.