# Step 50 — Victoria → Vancouver canonical route standardization

Status: **Complete.** The registered route inventory remains 56. No Vancouver → Victoria route was created, nothing was deployed, and Step 51 was not started.

## 1. Files changed

Step 50 changed or added only the existing target route, its frozen route facts and deterministic finalizer, route-scoped presentation/interaction assets, ownership/build registration, focused QA and regression coverage, validation evidence, ownership documentation, and this report:

- `site-copy/victoria-to-vancouver-movers/index.html`
- `site-copy/assets/step50-victoria-vancouver.css`
- `site-copy/assets/step50-victoria-vancouver.js`
- `tools/victoria-vancouver-route-data.mjs`
- `tools/finalize-victoria-vancouver-route.mjs`
- `tools/audit-step50-victoria-vancouver.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/audit-step33-regressions.mjs`
- `docs/ROUTE_PAGE_OWNERSHIP.md`
- `STEP_50_BEFORE.json`
- `STEP_50_HARNESS_BEFORE.json`
- `STEP_50_DIRECT_FIRST.json`
- `STEP_50_DIRECT_SECOND.json`
- `STEP_50_FAQ_TARGET_AFTER.json`
- `STEP_50_HARNESS_AFTER.json`
- `STEP_50_TITLE_GLOBAL.json`
- `STEP_50_FAQ_GLOBAL.json`
- `STEP_50_REGRESSION.json`
- `STEP_50_WORKTREE_AFTER.json`
- `STEP_50_AGGREGATE_BASELINE.json`
- `STEP_50_AGGREGATE_FIRST.json`
- `STEP_50_AGGREGATE_SECOND.json`
- `docs/STEP_50_VICTORIA_TO_VANCOUVER_REPORT.md`

The pre-existing dirty working tree was preserved. Aggregate output remained in the validation clone; no unrelated generated output was copied back.

## 2. Final owner/render architecture

| Route | Owner | Declared/actual render | React bootstrap | Navigation | Chat | Conversion |
| --- | --- | --- | --- | --- | --- | --- |
| `/victoria-to-vancouver-movers/` | `checked-in-static-route-source` | Static/static | Absent | Static | Static | Present |

The ownership gate passed before editing and after completion: the route-specific body was present, and the FAQ/title post-processors were registered. The final registered post-processors are the Step 50 route finalizer, FAQ architecture finalizer, and title normalizer, each exactly once.

## 3. Harness investigation

Before presentation work, raw HTTP returned 200 with 116,086 bytes. The generic probe committed navigation at approximately 85 ms but did not reach `DOMContentLoaded` within eight seconds. Blocking the conversion runtime, static navigation, or static chat individually did not release it. External denials included Google Fonts, Google Tag Manager, the attribution/query SDK, Manus analytics, and a remote CDN image, but they were not causal.

Disabling only the route's inline observer changed the result: `DOMContentLoaded` arrived at approximately 172 ms, `load` at 183 ms, pending requests fell to zero, and the route remained stable through five seconds. The old observer watched the entire document subtree and called `standardizeCostTable()`; that function assigned `header.textContent = "Estimated Cost"` even when the text was already identical. The assignment created another mutation, which retriggered the observer indefinitely and locked the main thread. There was no application exception.

After the fix, the unrestricted route probe reached navigation commit at approximately 69 ms, `DOMContentLoaded` at 239 ms, and `load` at 248 ms. H1, actual form values, pricing, glance, FAQ, title, and footer remained stable through five seconds. Isolated conversion/nav/chat variants also completed, with no page error or pending request.

## 4. H1/H2/H3 classification

**H2 — Route runtime defect found and fixed.** The stall was a genuine route-local recursive mutation defect. The observer-only isolation proved causality; shared conversion, nav, chat, analytics, fonts, SDK, and image requests did not. The deterministic static finalizer removes the obsolete observer because the canonical output is generated correctly at source. Both the formerly failing generic FAQ/title browser harnesses now evaluate this route normally.

## 5. Durable source chain

The durable chain is:

`checked-in-static-route-source` → `victoria-vancouver-route-data.mjs` → registered `finalize-victoria-vancouver-route.mjs` → target HTML plus route-scoped CSS/JS → registered FAQ architecture finalizer → registered title normalizer.

The finalizer is in aggregate order after checked-in static-source preservation and before the global FAQ/title finalizers. It extracts only the existing global header/footer shell; it does not consume another generated route page or mutable route template. Static nav, static chat, conversion, cost-guide facts, and route-local chat recognition are explicit dependencies. The deterministic chatbot contains no competing Victoria → Vancouver price table.

## 6. Authoritative route facts

| Fact | Victoria → Vancouver | Winning source |
| --- | ---: | --- |
| Distance | Approximately 110 km | Canonical cost guide (higher than unfrozen legacy route copy) |
| Transit | 1–3 days | Canonical cost-guide route row, corroborated by legacy route copy |
| Studio | $1,200+ CAD | Consistent existing route pricing/FAQ, now frozen |
| 1-bedroom | $1,600+ CAD | Same |
| 2-bedroom | $2,200+ CAD | Same |
| 3-bedroom | $3,000+ CAD | Same |
| 4+ bedroom | $4,200+ CAD | Same |
| Overall range | $1,200–$4,200+ CAD | Derived from the five frozen route-owned rows |

## 7. Distance conflict resolution: 115 km vs 110 km

No frozen route-owned data existed before Step 50. The canonical cost guide's Victoria → Vancouver row states 110 km and 1–3 days, while the legacy page stated approximately 115 km. Under the required hierarchy, the cost guide wins. Step 50 therefore freezes `approximately 110 km` and displays `~110 km` consistently in the route data, pricing copy, glance, body, FAQ context, and schema description. The 115 km value was retired.

## 8. Pricing architecture decision

The route's existing page and FAQ consistently supplied all five home-size figures, while neither the cost-guide master pricing table nor deterministic chatbot supplied a competing five-row Victoria → Vancouver table. Step 50 retained those factual values, froze them, and placed them in the canonical four-column/five-row CAD table. It did not infer facts from a nonexistent reverse route.

## 9. Material defects corrected

The recursive observer/main-thread lock was removed. The page now has actual form values rather than placeholder-only directionality, one canonical price block instead of the legacy `Moving Cost Breakdown`, one canonical glance, one FAQ/schema pair, route-specific metadata, fixed malformed SVG path values, and durable route-only output. Stale low/high FAQ pricing, duplicate packing questions, expired promotion wording, and contradictory crew/network phrasing were replaced with consistent written-estimate language.

## 10. Contamination removed

The main route body contains no Toronto, Calgary, Edmonton, Montreal, Ottawa, Halifax, Winnipeg, or Seattle facts. Global navigation/footer links to the wider service network remain legitimate. Reverse-direction copy, unrelated interprovincial/cross-country positioning, legacy homepage language, stale pricing, old promo language, `.pcm-local-seo`, and unintended `undefined` are absent from the route content.

## 11. Route-characterization corrections

The route is consistently described as an intra-BC intercity move from Victoria on Vancouver Island to Vancouver in the Lower Mainland. Copy covers Victoria building/loading access, island departure and ferry coordination, Vancouver strata/condo/elevator/loading access, weather and terminal conditions, and scheduling flexibility. It does not claim an exact sailing, crossing time, guaranteed delivery, interprovincial move, cross-border move, or cross-country move.

## 12. Form result

The sole primary form has actual input values `Victoria, BC` → `Vancouver, BC`. The unrestricted browser probe confirmed those values at initial DOM, approximately one second, and five seconds; desktop and mobile interaction QA confirmed them again. Placeholders match but were not used as proof.

## 13. Metadata/title/OG/Twitter

Raw and settled title, `og:title`, and `twitter:title` are exactly `Victoria to Vancouver Movers | Purely Canadian Movers`, with the brand suffix once. Description is directional and route-specific. Canonical and OG URL both equal `https://purelycanadianmovers.com/victoria-to-vancouver-movers/`.

## 14. FAQ/schema

The page has one visible FAQ section, one FAQ heading, eight directional entries, and one `FAQPage`. Raw and browser comparisons confirm exact question, answer, and order parity. There is no hidden generic FAQ and no `.pcm-local-seo`. Pricing, transit, ferry, access, packing, storage, protection, and coordination answers use the frozen facts and written-estimate constraints.

## 15. Terminology corrections

The route now distinguishes basic carrier liability from available Declared Value Protection. Prices and 1–3 day transit are explicitly planning guidance subject to a written estimate and confirmed schedule. Stale insurance/valuation wording, guaranteed price or ferry timing, interprovincial, cross-border, and cross-country route claims are absent from the body.

## 16. Typography

Computed headings use Playfair Display and body/forms/buttons use Source Sans 3. H1 is 48px/60px/700 at 1280 × 900 and 36px/45px/700 at 390 × 844. FAQ headings use the heading family. Changes are confined to the route-scoped stylesheet.

## 17. Quote panel

Exactly one quote panel uses the 1120px maximum shell, red left accent, 8px radius, canonical shadow, six trust pills, written-estimate treatment, verified company details, and directional values. It renders as two columns on desktop and one on mobile. The expired booking promotion is gone.

## 18. Pricing

Exactly one pricing section and table contain the five frozen CAD rows and $1,200–$4,200+ overall range. The table has a 760px minimum width and scrolls inside its wrapper on mobile without causing page overflow. The disclaimer covers estimate variability, access, ferry logistics, services, carrier liability, and Declared Value Protection. There is no duplicate/legacy pricing or `undefined`.

## 19. Route at a Glance

Exactly one three-card block shows only verified facts: ~110 km, 1–3 days, and $1,200–$4,200+ CAD. It renders in three columns on desktop and one on mobile and agrees with frozen data, pricing, body, FAQ, and schema.

## 20. Main content

The canonical content shell, section order, hierarchy, spacing, cards, process, proof list, FAQ, resources, and closing CTA are present. Directional copy preserves Victoria pickup/access, Vancouver Island departure, ferry planning, Lower Mainland arrival, and Vancouver strata/condo/elevator/loading considerations.

## 21. Related-destination result

Related links point to the established Victoria and Vancouver hubs, cost guide, packing, storage, Declared Value Protection, and contact page. No link targets `/vancouver-to-victoria-movers/`, and no deprecated alias is presented as canonical.

## 22. Static navigation

One static navigation implementation remains and no React bootstrap was introduced. Desktop dropdown opening and Escape closure passed. At 390 × 844, the mobile menu reports `aria-expanded` false → true → false; Escape closes it and returns focus to the open-menu trigger. No duplicate navigation was added.

## 23. Static chatbot

One static chatbot launcher and one panel remain. Open/close, mobile fit, clipping, and sticky-control spacing passed. Its initial message recognizes the Victoria → Vancouver route and offers ferry, access, packing, storage, timing, and written-estimate help. Chat initialization did not cause the old stall; shared chat code was not changed.

## 24. Source/finalizer durability

The Step 50 finalizer consumes validated frozen facts, is guarded to the one registered route, and rebuilds the canonical output deterministically. A direct run reproduced the final page; the second direct run changed zero route or asset bytes. Tests also replay it in a temporary tree, confirm byte identity, preserve an unrelated sentinel, and reject React bootstrap, observer code, contamination, legacy pricing, `.pcm-local-seo`, and `undefined`.

## 25. Delayed-runtime result

Raw, initial DOM, approximately one second, and five-second states retain one H1, quote form, pricing table, glance, FAQ/schema, and footer; canonical title and actual form values do not change. No homepage/legacy replacement, duplicate component, pending request, application exception, or `undefined` appears. After the fix the normal global harness completes, so no targeted-only qualification is needed.

## 26. Exact desktop/mobile QA

At 1280 × 900 and 390 × 844 there is no page-level horizontal overflow, broken local image, clipped control, or chat/sticky overlap. Quote and glance grids stack correctly. The 760px pricing table scrolls internally only on mobile. Navigation and chat interactions pass at both viewports, and the page remains stable through five seconds.

## 27. Global title/FAQ/content results

- Title/OG/Twitter contract: raw and browser-evaluable **56/56 canonical**.
- FAQ contract: raw and browser-evaluable **56/56 canonical**, including exact parity.
- Route HTML content scan: **56 files**, zero `.pcm-local-seo`, zero unintended `undefined`.

The prior Victoria → Vancouver browser exclusion is eliminated.

## 28. Ownership/tests

The validator reports 56 routes, exactly one owner each, and zero collisions. Static declaration and runtime agree. Syntax checks passed for data, finalizer, focused audit, and route JavaScript. The full automated suite passes **35/35**: the 34-test Step 49 baseline plus one non-duplicative Step 50 durability/scope test.

## 29. Regression result

Victoria → Vancouver was added exactly once to the existing 51-route browser regression inventory. The actual deduplicated result is **52/52 passed**, covering route identity, title branding, actual form values, pricing presence, body integrity, zero `.pcm-local-seo`, zero `undefined`, navigation, and chatbot. `/vancouver-to-victoria-movers/` is not present.

## 30. First aggregate result

The complete aggregate ran in a fresh temporary Git clone after overlaying the current working-tree source for a like-for-like baseline. First pass: **0/56 route drift and 0/104 asset drift**. No unrelated output was absorbed.

## 31. Second aggregate result

The complete aggregate ran again in the same validation clone. Second pass: **0/56 route drift and 0/104 asset drift**.

## 32. Working-tree isolation

Comparing `STEP_50_BEFORE.json` with `STEP_50_WORKTREE_AFTER.json` shows exactly one changed registered route HTML hash: `/victoria-to-vancouver-movers/`. No other registered route HTML changed. The only new route assets are `step50-victoria-vancouver.css` and `step50-victoria-vancouver.js`.

## 33. Confirmation route count remains 56

The ownership registry, validator, hash snapshots, global browser audits, and aggregate snapshots all contain exactly **56 registered routes**. No reverse route, alias, sitemap entry, writer claim, or directory for Vancouver → Victoria was created.

## 34. Remaining known issues

No Step 50 blocker or unresolved route defect remains. Sandboxed probes intentionally denied remote fonts, analytics, attribution SDK, and CDN requests; those denials produced only expected resource-load console messages and did not affect route DOM, interactions, or lifecycle completion. No deployment occurred.

Step 50 is complete.
