# React-to-Static Route Migration — Step 11

Status: local implementation complete. No commit, deployment, or Step 12 work was performed.

## Scope

Step 11 converted only `/toronto-to-victoria-movers/` from React-owned rendering to static-safe rendering. `/victoria-to-toronto-movers/` remains its checked-in static reverse route. `/bc-to-washington-movers/` remains the only React-owned route in the migration sequence.

## Ownership and writer changes

- Added `tools/rebuild-toronto-victoria-static-route.mjs` as the sole full-page writer for the target.
- Added `tools/toronto-victoria-static-route-data.mjs`, sourced from the frozen Toronto/Victoria route facts.
- Updated `tools/route-page-ownership.mjs` to remove the target from `generate-spa-routes.mjs`, register the Step 11 static owner, use static navigation/chat/conversion assets, and remove the target post-processor claim.
- Updated `tools/finalize-toronto-victoria-routes.mjs` and its test so the Step 39 finalizer is reverse-route-only.
- Updated `tools/route-writer-manifest.mjs` and the ownership/editing documentation.

## Preserved route facts

- Route: Toronto to Victoria & Nanaimo
- Distance: approximately 4,400 km; display: ~4,400 km
- Transit guidance: 10–22 days
- Planning range: $3,000–$16,000+
- Pricing tiers: $3,000+, $5,300+, $7,000+, $11,000+, and $16,000+
- Toronto/Ontario origin, Victoria/Nanaimo destination, Vancouver Island ferry and terminal logistics, packing, storage, written estimates, FAQ, schema, forms, navigation, chat, trust content, typography, related routes, CTA, and responsive behavior were retained or statically encoded.
- The target has 12 authoritative FAQ entries, emitted once as visible HTML and once as one FAQPage schema.

## QA evidence

- `node tools/validate-route-page-ownership.mjs site-copy` — PASS; 56 routes, one owner each, zero collisions.
- `node --test tools/route-page-ownership.test.mjs` — PASS; 27/27 tests.
- `node tools/validate-route-local-assets.mjs site-copy toronto-to-victoria-movers` — PASS; 8 local asset references checked.
- `npm run routes:dry-run` — PASS; Step 11 generator appears in the authoritative order and no files are written.
- `node tools/prove-step11-static-ownership.mjs ...` — PASS; direct marker survived initial, delayed, reload, cache-busted, and hard-refresh states.
- `node tools/audit-step11-toronto-victoria.mjs ...` — PASS for both Toronto→Victoria and Victoria→Toronto; static render, one H1, facts, responsive overflow, and chat launcher checks passed.
- Running the Step 11 generator twice produced identical SHA-256 output: `39289A86AF299D42996EFB6C6C3E146063E6EC37F6090F73C6532BDBD268BD10`.

## Expected migration state

The documented migration classification after Step 11 is A42 / B1 / C13 / D0. The remaining B route is `/bc-to-washington-movers/`. Step 12 is intentionally not started.
