# Step 47 — Halifax ↔ Toronto canonical route-page standardization

Status: **Complete.** Step 48 was not started and nothing was deployed.

## 1. Files changed

Step 47 changed or added only the pair owner/data/templates, pair-scoped assets, the two route outputs, the two route rows in the canonical cost guide, ownership/manifest documentation, the Step 47 audit, and this report:

- `tools/update-halifax-toronto-routes.mjs`
- `tools/halifax-toronto-route-data.mjs`
- `tools/templates/halifax-toronto-routes/halifax-to-toronto-movers.html`
- `tools/templates/halifax-toronto-routes/toronto-to-halifax-movers.html`
- `tools/audit-step47-halifax-toronto.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `docs/ROUTE_PAGE_OWNERSHIP.md`
- `site-copy/assets/step47-halifax-toronto.css`
- `site-copy/assets/step47-halifax-toronto.js`
- `site-copy/halifax-to-toronto-movers/index.html`
- `site-copy/toronto-to-halifax-movers/index.html`
- `site-copy/long-distance-moving-cost-canada/index.html` (only the two Halifax/Toronto corridor rows)
- `docs/STEP_47_HALIFAX_TORONTO_REPORT.md`

The pre-existing dirty working tree was preserved. No unrelated route output was copied from the aggregate clone.

## 2. Halifax → Toronto changes

The route now uses the canonical static route structure: one directional hero/H1, one quote panel and form, one five-row pricing section, one Route at a Glance, independent Nova Scotia-to-Ontario planning copy, one FAQ implementation/schema, related destinations, CTA, footer, static navigation, and static chatbot. Its durable source explicitly carries Halifax pickup/access, Nova Scotia origin planning, east/west scheduling and weather, and Toronto condo/elevator/loading considerations.

## 3. Toronto → Halifax changes

The reverse route received the same canonical structure with independently authored direction-specific copy. Its durable source explicitly carries Toronto/GTA pickup/access, Ontario-origin planning, the eastbound interprovincial corridor, seasonal/weather planning, and Halifax apartment/elevator/loading considerations.

## 4. Confirmed owner/render architecture

The ownership gate passed before standardization; declared and actual rendering agree.

| Route | Registry owner | Declared render | Actual render | React support | Nav | Chat |
|---|---|---|---|---|---|---|
| `/halifax-to-toronto-movers/` | `tools/update-halifax-toronto-routes.mjs` | Static | Static at raw, initial, 1.5 s, and 5.5 s | Absent | Static | Static |
| `/toronto-to-halifax-movers/` | `tools/update-halifax-toronto-routes.mjs` | Static | Static at raw, initial, 1.5 s, and 5.5 s | Absent | Static | Static |

Both routes retain `conversion-boost.js`. The ownership registry now explicitly registers the pair CSS/JS and the legitimate static nav/chat assets. Raw and settled H1/body sentinels and settled form defaults remained directional.

## 5. Full durable source/data chain

The final chain is:

`halifax-toronto-route-data.mjs` → each route's own explicit pair template → `update-halifax-toronto-routes.mjs` → route HTML + the two cost-guide rows → registered FAQ architecture finalizer → registered title normalizer.

The manifest and ownership registry identify the same full-page owner. The generator reads neither another route's generated HTML nor a non-pair template. The SPA generator skips the pair. The obsolete generic quote-wording patcher is no longer registered for these routes. FAQ/title post-processors are deterministic and did not become competing full-page writers. The cost guide and deterministic chatbot pricing agree with the frozen pair facts.

## 6. Authoritative route facts

| Fact | Halifax → Toronto | Toronto → Halifax | Winning source |
|---|---:|---:|---|
| Distance | approximately 1,800 km | approximately 1,800 km | Pair-owned frozen data, confirmed by route/cost-guide contract |
| Transit | 5–12 days | 5–12 days | Pair-owned frozen data |
| Studio | $2,200+ | $2,200+ | Pair-owned frozen data, cost guide, deterministic chatbot pricing |
| 1 bedroom | $2,900+ | $2,900+ | Same |
| 2 bedroom | $3,900+ | $3,900+ | Same |
| 3 bedroom | $5,300+ | $5,300+ | Same |
| 4+ bedroom | $7,000+ | $7,000+ | Same |
| Overall range | $2,200+–$7,000+ | $2,200+–$7,000+ | Same |

The symmetry is supported by all three durable pricing sources; it was not inferred from memory.

## 7. Route-fact corrections

Stale FAQ/body values of 6–14 days and $2,500–$14,000 were replaced with the established 5–12 day and $2,200+–$7,000+ contract. Distance is consistently approximately 1,800 km. Visible copy, pricing, glance cards, FAQs, schema, cost-guide rows, and chatbot inputs now agree.

## 8. Legacy-template recurrence findings

The prior pair templates were themselves stale, so the owner now deterministically rewrites each explicit pair template to the canonical structure and validates the result. Assertions reject obsolete layout markers, `Moving Cost Breakdown`, temporary/duplicate pricing, duplicate FAQ shells, `.pcm-local-seo`, promotions, and `undefined`. No later registered writer can restore the obsolete full-page layout.

## 9. Contamination/copy errors removed

Main-body checks found no unintended Vancouver, Calgary, Edmonton, Montreal, Ottawa, Victoria, or Winnipeg copy. Those cities appear only where legitimate in navigation, footer, or related-route links. The pair contains no Vancouver strata, ferry/Vancouver Island, Prairie, Quebec, or Alberta-specific language; no reversed direction, homepage copy, stale promotion, wrong facts, or `undefined` remains.

## 10. Directional form result

- Halifax → Toronto: actual values remained `Halifax, NS` → `Toronto, ON` at initial load, about 1.5 seconds, and beyond 5 seconds.
- Toronto → Halifax: actual values remained `Toronto, ON` → `Halifax, NS` at the same checkpoints.

The values are input values, not placeholder evidence. Directionality also passes in H1, quote/pricing headings, glance, FAQ, CTA, pickup/delivery content, and related-route headings.

## 11. Metadata/title/OG/Twitter result

For both routes, raw and settled `<title>`, `og:title`, and `twitter:title` are identical and contain the exact route-specific title followed once by `| Purely Canadian Movers`. Each route has a route-specific description, self-canonical, matching OG URL, and no homepage metadata.

## 12. FAQ/schema result

Each route has one visible FAQ section, one FAQ heading, one FAQ implementation, and one `FAQPage`; each contains nine direction-specific questions. Visible question/answer/order parity with JSON-LD is exact. There is no hidden generic FAQ and no `.pcm-local-seo`.

## 13. Terminology corrections

Stale insurance/valuation phrasing was replaced with accurate basic carrier liability and optional Declared Value Protection language. Price statements are planning ranges subject to a written estimate. No guaranteed-price, obsolete broker/subcontractor, or inaccurate corridor wording remains.

## 14. Typography result

Computed presentation matches the canonical pair-scoped typography: Playfair Display headings and Source Sans 3 body/forms/buttons. H1 is 48/60/700 at 1280 × 900 and 36/45/700 at 390 × 844. No global typography file was changed.

## 15. Quote-panel result

Each route has exactly one canonical quote panel: 1120 px maximum shell, canonical inner widths, red left accent, 8 px radius, canonical shadow, two desktop columns, one mobile column, six trust pills, written-estimate planning and verification treatment, correct directional heading/defaults, and canonical form/button styling. No promotion remains.

## 16. Pricing result

Each route has one pricing section/table with five authoritative rows, the correct $2,200+–$7,000+ range, directional heading, 760 px minimum table width, and internal mobile scrolling. The disclaimer uses Declared Value Protection and written-estimate planning language. There is no `Moving Cost Breakdown`, temporary `Route Pricing`, duplicate table, stale price card, stale valuation wording, or `undefined`.

## 17. Route at a Glance result

Each route has exactly one glance block showing approximately 1,800 km, 5–12 days, and $2,200+–$7,000+. It renders as three desktop columns and one mobile column with canonical spacing/card styling and agrees with pricing, body, FAQ, and schema.

## 18. Main-content result

The canonical content width, section order, hierarchy, spacing, cards/lists, CTA placement, and responsive structure are in place. The directional bodies remain independently authored; neither direction was cloned from the other or from Halifax ↔ Vancouver.

## 19. Navigation result by architecture

Both routes correctly use static navigation with no React bootstrap or duplicate nav. Desktop dropdown behavior passed. At mobile size, `aria-expanded` transitions `false → true → false`; Escape closes the menu and returns focus where supported.

## 20. Chatbot result by architecture

Both static routes have exactly one launcher and one panel. Open, close, viewport fit, and non-overlap checks passed at desktop and mobile sizes. There is no React/static chatbot duplication.

## 21. Post-footer contamination result

Each route has one intended footer and zero `.pcm-local-seo`, `undefined`, generic post-footer FAQ, duplicate conversion block, homepage body, soft-404 content, or stale promotion.

## 22. Source/finalizer durability

A direct owner/finalizer replay reproduced the final HTML and relevant assets. The second direct replay changed zero bytes: 0/56 route drift and 0/100 asset drift. Required data fields are validated. Facts, metadata, FAQ parity, form defaults, singular canonical components, and hygiene assertions survived both runs.

## 23. Delayed-runtime stability

At raw HTML, initial browser state, approximately 1.5 seconds, and approximately 5.5 seconds, both routes retained their directional H1/title/forms, one pricing section, one glance block, one FAQ, and route-specific body. No homepage/soft-404 replacement, legacy component, or `undefined` appeared. React hydration is not applicable to this static architecture.

## 24. Exact desktop/mobile QA

At 1280 × 900 and 390 × 844 there was no page-level horizontal overflow or broken local image. Desktop quote and glance layouts used two and three columns respectively; mobile used one column. The pricing table scrolled internally at mobile width. Navigation/chat controls opened and closed without clipping. The only console network item was the expected sandbox block for remote analytics (`ERR_NETWORK_ACCESS_DENIED`), not an application exception.

## 25. Global FAQ/title/body regression result

- Raw title/OG/Twitter contract: 56/56.
- Browser title audit: 55/55 evaluable routes canonical.
- Raw FAQ contract: 56/56 preserved; browser FAQ audit: 55/55 evaluable routes canonical.
- Raw body hygiene: 56/56 with no homepage/soft-404 replacement or unintended `undefined`; `.pcm-local-seo`: zero.
- Victoria → Vancouver remains the sole browser-harness stall and was not modified; its raw contracts remain passing.

## 26. Ownership/architecture validation

The ownership validator reports 56 registered routes, exactly one full-page owner each, and zero collisions. Declared and actual pair architecture match. Syntax checks passed for the owner, data module, audit, and pair JS. The complete automated test suite passed 33/33, including ownership, title, and FAQ tests.

## 27. First aggregate convergence result

The complete aggregate was run in a fresh temporary Git clone after matching the clone baseline to the working tree. First-pass result: **0/56 route drift and 0/100 asset drift**. No unrelated drift was absorbed.

## 28. Second aggregate convergence result

The complete aggregate was run again in the same validation clone. Second-pass result: **0/56 route drift and 0/100 asset drift**.

## 29. Regression result

Halifax → Toronto and Toronto → Halifax were already present in the browser regression list, so no artificial coverage entry was added. The list contains 49 unique routes and all 49/49 passed. Deterministic chatbot pricing also passed against every authoritative cost-guide row.

## 30. Working-tree route isolation

Comparing the Step 46A final route snapshot with the Step 47 working-tree snapshot shows exactly two changed route HTML files: `/halifax-to-toronto-movers/` and `/toronto-to-halifax-movers/`. The only new route assets are the pair-scoped Step 47 CSS and JS. The supporting cost-guide edit is limited to this corridor's two rows.

## 31. Remaining known issues

The pre-existing `/victoria-to-vancouver-movers/` browser-audit stall remains unchanged; its raw contracts pass. Remote analytics is blocked by the browser sandbox during QA and was documented separately from application behavior. No Step 47 blocker or unresolved Halifax ↔ Toronto issue remains.

**Step 47 is complete. No deployment occurred. Step 48 has not begun.**
