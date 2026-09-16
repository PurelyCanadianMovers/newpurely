# React-to-Static Route Migration — Step 8

Date: 2026-09-16
Scope: `/montreal-to-victoria-movers/` only.

## Result

Montreal → Victoria is now A — Static Safe. Its authoritative full-page owner is `tools/rebuild-montreal-victoria-static-route.mjs`, backed by `tools/montreal-victoria-static-route-data.mjs` and `tools/templates/montreal-victoria-static-route.html`. The reverse `/victoria-to-montreal-movers/` route remains checked-in static and was not migrated or rewritten.

Ownership totals after this step: 56 routes, A39 / B4 / C13 / D0, with zero collisions.

## Reconciled route facts

The maintained Montreal → Victoria content and the reciprocal static page agree on approximately 4,800 km, 10–22 days estimated transit, and planning ranges of $3,000+ / $5,300+ / $7,000+ / $11,000+ / $16,000+ by home size, with an overall $3,000–$16,000+ range. Vancouver Island ferry logistics and the declared-value wording were retained or normalized in the static source.

## Architecture and assets

The generated target no longer contains the React module bootstrap or route-content runtime. It uses only the approved conversion, static navigation, and static chat assets. `tools/validate-route-local-assets.mjs` checks URL query/hash-safe local asset resolution and was run for Step 8, the reverse route, Step 7, and Step 6 routes. The invalid Step 7 stylesheet pattern is rejected by the validator.

The existing route shell, quote form defaults, CTA/phone links, related destinations, FAQ section and one FAQPage schema, Route at a Glance, pricing table, BC Ferries content, desktop/mobile navigation, chat launcher, responsive typography, and delayed runtime behavior were verified.

## QA evidence

- `node tools/validate-route-page-ownership.mjs site-copy` — PASS: 56 routes, one collision-free owner each.
- `node --test tools/route-page-ownership.test.mjs` — PASS: 27 tests.
- `npm run routes:dry-run` — PASS: Step 8 generator appears in aggregate order and no files are written.
- `tools/audit-step64-montreal-victoria.mjs` — PASS for target and reverse route.
- `tools/prove-step08-static-ownership.mjs` — PASS for initial, delayed, reload, cache-busted, and hard-refresh direct-edit persistence.
- `tools/audit-step08-regressions.mjs` — PASS for Step 8, reverse, Step 7, remaining SPA, hybrid, checked-in static, and Step 6 representatives.
- `STEP_08_GENERATOR_DURABILITY.json` — target output stable across two generator runs; reverse output unchanged.

Evidence files: `STEP_08_PREEDIT_MONTREAL_VICTORIA.json`, `STEP_08_LOCAL_AUDIT.json`, `STEP_08_DIRECT_PROOF.json`, `STEP_08_REGRESSION.json`, and `STEP_08_GENERATOR_DURABILITY.json`.

## Finalizer and regression guard

`tools/finalize-montreal-victoria-routes.mjs` is now reverse-only at execution and ownership-guard level. It does not claim or rewrite Montreal → Victoria. The Step 8 generator writes only its target route. No other route was migrated, and Step 9 work was not started.

No commit or deployment was made.