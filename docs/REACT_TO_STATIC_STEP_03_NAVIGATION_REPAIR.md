# Migration Step 3 Navigation Dependency Repair

Date: 2026-09-16
Original implementation: `e1dc490a99bf0a7faf51525ac3cac769035aa70b`
Scope: `/edmonton-to-toronto-movers/` and `/toronto-to-edmonton-movers/` only.

## Root cause

The Step 3 templates loaded `conversion-boost.css`, `static-nav.js`, and `static-chat.js`, but omitted `/assets/static-nav.css` and `/assets/static-chat.css`. The Step 2 templates contain both stylesheet registrations, and `static-nav.css` supplies the critical `.pcm-static-mobile { display: none; }` and `.is-open { display: block; }` rules. The Step 3 ownership registry also declared no runtime styles for either route.

The mobile trigger additionally did not update `aria-expanded` when the static navigation enhancer opened the panel. The repair therefore adds the missing stylesheet registrations and makes the existing shared enhancer reflect the open/closed state.

## Why prior QA missed it

The original Step 3 HTML and browser audit checked for the static navigation script and counted a navigation implementation, but did not assert that `static-nav.css` was linked or loaded. Its browser interaction coverage was desktop-oriented; the mobile check did not require a hidden initial panel or an `aria-expanded` transition. The strengthened audit now checks stylesheet loading, initial hidden state, open/close state, ARIA values, and horizontal overflow at 390×844.

## Repair files

- `tools/templates/edmonton-toronto-static-routes/edmonton-to-toronto-movers.html`
- `tools/templates/edmonton-toronto-static-routes/toronto-to-edmonton-movers.html`
- `site-copy/edmonton-to-toronto-movers/index.html`
- `site-copy/toronto-to-edmonton-movers/index.html`
- `site-copy/assets/static-nav.js`
- `tools/route-page-ownership.mjs`
- `tools/edmonton-toronto-route-data.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/audit-step03-regressions.mjs`
- this repair report and Step 3 repair evidence files

No route facts, metadata, pricing, FAQ/schema, form content, Glance content, CTA content, related destinations, or React bundle were changed.

## Validation

The repaired pair was regenerated and passed the ownership validator, 26 ownership tests, direct-edit durability, generator durability, aggregate dry run, and the strengthened seven-route regression matrix. The matrix includes both Step 3 targets, a remaining React route, a hybrid route, an unrelated Static Safe route, and the completed Step 1 and Step 2 pairs.

Expected ownership remains A=32, B=11, C=13, D=0 with zero collisions. Migration Step 4 was not started.