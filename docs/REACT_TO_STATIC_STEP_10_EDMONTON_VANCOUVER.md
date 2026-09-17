# Migration Step 10 — Edmonton to Vancouver Static Route

Date: 2026-09-16

## Scope

Fresh Step 10 implementation for /edmonton-to-vancouver-movers/ only. No other route was migrated. Step 11 was not started.

## Result

Edmonton to Vancouver is now A - Static Safe. The final route page owns its metadata, H1, hero, quote form, pricing, Route at a Glance, directional content, trust/direct-mover content, related destinations, FAQ/schema, CTA, footer, navigation shell, and chatbot shell in static HTML. There is no React module bootstrap or route-content repair runtime.

## Authoritative facts

- Distance: ~1,160 km
- Estimated transit: 4–13 days
- Studio or small shipment: $2,200+
- 1-bedroom: $2,800+
- 2-bedroom: $3,800+
- 3-bedroom: $5,200+
- 4+ bedroom: $7,000+
- Overall planning range: $2,200–$7,000+

The route-specific finalizer, settled rendered page, pricing table, Glance, and FAQ agreed on these values. The reverse page was used for architecture comparison only; its directional content was not cloned.

## Runtime inventory and disposition

- generate-spa-routes.mjs no longer owns the target.
- finalize-vancouver-edmonton-routes.mjs remains the static owner/finalizer for Vancouver to Edmonton only; it no longer post-processes the target.
- The old Step 6 Edmonton/Vancouver runtime guard, pricing/glance/FAQ normalizers, and route-specific navigation fallback were encoded into the settled static HTML where needed and removed from the target.
- conversion-boost.js, static-nav.js, and static-chat.js remain approved shell enhancements.
- conversion-boost.css, static-nav.css, and static-chat.css are registered and referenced.
- The compiled React bundle was not edited.

## Files changed

- tools/edmonton-vancouver-static-route-data.mjs
- tools/rebuild-edmonton-vancouver-static-route.mjs
- tools/templates/edmonton-vancouver-static-route.html
- site-copy/edmonton-to-vancouver-movers/index.html
- tools/route-page-ownership.mjs
- tools/route-writer-manifest.mjs
- tools/finalize-vancouver-edmonton-routes.mjs
- tools/route-page-ownership.test.mjs
- tools/audit-step10-edmonton-vancouver.mjs
- tools/prove-step10-static-ownership.mjs
- docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md
- docs/LONG_DISTANCE_ROUTE_EDITING_PLAYBOOK.md
- STEP_10_PREEDIT_EDMONTON_VANCOUVER.json
- STEP_10_EDMONTON_VANCOUVER_AUDIT.json
- STEP_10_DIRECT_PROOF.json

## QA evidence

- Ownership validator: PASS; 56 route pages, one collision-free owner each.
- Ownership tests: PASS, 27/27.
- Local assets: PASS; 7 target references checked, zero local 404s.
- Static audit: target owner rebuild-edmonton-vancouver-static-route.mjs, rendering static, React bootstrap false, exact facts true, FAQ/schema parity true.
- Browser QA: target passed initial/delayed/desktop/mobile/reload checks; no horizontal overflow; pricing table scrolls internally on mobile; mobile menu opens/closes with ARIA state changes; desktop navigation and chatbot open/close work.
- Typography: Playfair Display H1 at 48/60 desktop and 36/45 mobile; Source Sans 3 body/forms/buttons.
- Glance: one bordered/light card, three columns desktop, one column mobile, exact distance/transit/range, no overflow.
- Trust/direct mover: retained, including family-owned since 1991, Great Canadian Van Lines agent, BBB, no brokers/random subcontractors, and Declared Value Protection.
- Generator idempotency: PASS; two consecutive runs produced byte-identical target output.
- Direct-edit durability proof: PASS across initial, delayed, normal reload, cache-busted reload, and hard refresh.
- Reverse route: remains owned by finalize-vancouver-edmonton-routes.mjs and was not migrated.

The browser audit also recorded five blocked/aborted external CDN/analytics requests; none were local asset failures or application content failures.

## Ownership totals

A = 41, B = 2, C = 13, D = 0.

## Boundary

Nothing was committed. Nothing was deployed. Migration Step 11 was not started.
