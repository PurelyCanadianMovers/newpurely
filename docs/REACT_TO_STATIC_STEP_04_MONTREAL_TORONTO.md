# React → Static Migration Step 4: Montreal ↔ Toronto

Date: 2026-09-16
Scope: `/montreal-to-toronto-movers/` and `/toronto-to-montreal-movers/` only.

## Final classification

Both routes are now **A — Static Safe**. `rebuild-montreal-toronto-static-routes.mjs` is their maintained full-page owner. React controls no metadata, H1, route body, quote form, pricing, Route at a Glance, related destinations, FAQ/schema, CTA, or footer.

No other route was migrated. Nothing was committed or deployed.

## Authoritative facts

Repository route data, the existing pair finalizer, the canonical Step 58 audit, checked-in HTML, and the settled pre-edit browser render agreed; no fact conflict required escalation.

| Fact | Montreal → Toronto | Toronto → Montreal |
|---|---|---|
| Distance | 540 km | 540 km |
| Transit | 2–5 days | 2–5 days |
| Studio | $2,300+ | $2,300+ |
| 1-bedroom | $3,900+ | $3,900+ |
| 2-bedroom | $5,200+ | $5,200+ |
| 3-bedroom | $8,300+ | $8,300+ |
| 4+ bedroom | $12,000+ | $12,000+ |
| Overall planning range | $2,300–$12,000+ | $2,300–$12,000+ |
| Quote defaults | Montreal, QC → Toronto, ON | Toronto, ON → Montreal, QC |
| Visible FAQ count | 12 | 9 |

The pages retain directional Quebec/Ontario pickup and delivery guidance, distinct metadata, form defaults, body copy, FAQs, related destinations, and CTA wording. Pricing is presented as planning guidance, not guaranteed pricing, with Declared Value Protection terminology preserved.

## Before and after architecture

Before, both pages loaded the compiled React bundle and the `mhe`/`$me` route components replaced the route body after mount. The existing `finalize-montreal-toronto-routes.mjs` normalized metadata, FAQ, and Glance presentation after React rendering but was not a static owner.

After, the settled route renders were materialized into maintained templates under `tools/templates/montreal-toronto-static-routes/`. The pair generator copies those templates to `site-copy/`. The React bootstrap and Step 4 normalizer were removed from the templates. Approved `conversion-boost`, static navigation, and static chat enhancement remain, with `static-nav.css`, `static-nav.js`, `static-chat.css`, and `static-chat.js` explicitly loaded.

The shared static navigation handler now supports trigger toggle-close, explicit Close, Escape-close, focus return, and correct `aria-expanded` transitions. This was required to satisfy the Step 4 shell contract and was regression-tested against the completed Step 3 routes.

## Route at a Glance

The captured final Glance treatment is now static and retained in both templates: bordered light background, rounded container, three-column desktop grid, red SVG glyphs, uppercase labels, bold values, supporting text, and one-column mobile stacking. The local 390×844 audit found no page-level horizontal overflow.

## React-removal evidence

- Both routes contain final content in initial static HTML and no `index-CNBNs70h.js` bootstrap.
- The direct-edit proof marker survived initial load, delayed render, normal reload, cache-busted reload, and hard refresh for both routes.
- The second generator pass was byte-identical for both outputs.
- `validate-route-page-ownership.mjs` reports 56 routes, one owner per route, and zero collisions.
- The nine-route regression matrix passed, including both targets, remaining B routes, Hybrid, Static Safe, the Step 4 reference, and Steps 1–3 representatives.

## Local browser QA

The target audit passed at 1280×900 and 390×844 with one H1, one quote form, one pricing table, one Glance, one FAQ section, one FAQPage schema, FAQ/schema parity, correct directional defaults, no `Moving Cost Breakdown`, no `.pcm-local-seo`, no `undefined`, no soft 404, and no page-level overflow.

Static shell checks confirmed that `static-nav.css` is actually loaded; the mobile menu is hidden initially, opens, toggles/closes, Escape-closes, updates ARIA state, and does not leave a permanent overlay. Desktop dropdown navigation and chatbot open/close also passed.

Evidence files:

- `STEP_04_PREEDIT_MONTREAL_TORONTO.json`
- `STEP_04_LOCAL_AUDIT.json`
- `STEP_04_DIRECT_EDIT_PROOF.json`
- `STEP_04_GENERATOR_DURABILITY.json`
- `STEP_04_REGRESSION.json`

## Files changed

- `site-copy/montreal-to-toronto-movers/index.html`
- `site-copy/toronto-to-montreal-movers/index.html`
- `site-copy/assets/static-nav.js`
- `tools/templates/montreal-toronto-static-routes/montreal-to-toronto-movers.html`
- `tools/templates/montreal-toronto-static-routes/toronto-to-montreal-movers.html`
- `tools/montreal-toronto-route-data.mjs`
- `tools/rebuild-montreal-toronto-static-routes.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/prove-step04-static-ownership.mjs`
- `tools/audit-step04-regressions.mjs`
- `docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md`
- `docs/LONG_DISTANCE_ROUTE_EDITING_PLAYBOOK.md`
- this report and the Step 4 evidence files

## Final totals and boundary

- A — Static Safe: **34**
- B — React Owned: **9**
- C — Hybrid: **13**
- D — Other / Unknown: **0**

Unresolved issues: none for the Step 4 pair. Nothing was committed. Nothing was deployed. Migration Step 5 was not started.
