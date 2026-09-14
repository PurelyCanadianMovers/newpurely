# Step 49 — Seattle ↔ Vancouver canonical cross-border route standardization

Status: **Complete.** Step 50 was not started and nothing was deployed.

## 1. Files changed

Step 49 changed or added only the two target route outputs, the deterministic pair finalizer and frozen data, pair-scoped presentation assets, ownership/manifest registration, regression coverage, validation evidence, and this report:

- `site-copy/vancouver-to-seattle-movers/index.html`
- `site-copy/seattle-to-vancouver-movers/index.html`
- `site-copy/assets/step49-seattle-vancouver.css`
- `site-copy/assets/step49-seattle-vancouver.js`
- `tools/seattle-vancouver-route-data.mjs`
- `tools/finalize-seattle-vancouver-routes.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/audit-step33-regressions.mjs`
- `docs/ROUTE_PAGE_OWNERSHIP.md`
- `STEP_49_TITLE_GLOBAL.json`
- `STEP_49_FAQ_GLOBAL.json`
- `STEP_49_REGRESSION.json`
- `STEP_49_WORKTREE_AFTER.json`
- `STEP_49_AGGREGATE_BASELINE.json`
- `STEP_49_AGGREGATE_FIRST.json`
- `STEP_49_AGGREGATE_SECOND.json`
- `docs/STEP_49_SEATTLE_VANCOUVER_REPORT.md`

The pre-existing dirty working tree was preserved. No unrelated aggregate output was copied back.

## 2. Vancouver → Seattle changes

The southbound page now has one directional hero/H1, one canonical quote panel, one four-column/five-row USD pricing table, one Route at a Glance, independently authored Vancouver/BC pickup and Seattle/Washington delivery copy, one FAQ implementation/schema, cross-border resources, CTA, footer, static navigation, and static chatbot. It preserves Vancouver condo/strata/elevator/loading planning and Seattle apartment/parking/loading considerations without presenting legal advice.

## 3. Seattle → Vancouver changes

The northbound page received the same canonical structure with distinct Seattle/Puget Sound pickup and Vancouver/BC condo/strata delivery copy. The stale `VANCOUVER → SEATTLE` eyebrow and the Washington/Seattle-destination FAQ questions were corrected to the actual northbound direction.

## 4. Confirmed owner/render architecture

Ownership/render verification passed before editing; declared and actual rendering agreed.

| Route | Registry Owner | Declared Render | Actual Render | React Support | Nav | Chat |
|---|---|---|---|---|---|---|
| `/vancouver-to-seattle-movers/` | `checked-in-static-route-source` | Static | Static at raw, early, ~1.6 s, and 5.2+ s | Absent; no module bootstrap or compiled exact-route support required | Static | Static |
| `/seattle-to-vancouver-movers/` | `checked-in-static-route-source` | Static | Static at raw, early, ~1.6 s, and 5.2+ s | Absent; no module bootstrap or compiled exact-route support required | Static | Static |

Both routes retain `conversion-boost.js`. Their registered route-specific post-processors are `finalize-seattle-vancouver-routes.mjs`, the FAQ architecture finalizer, and the title normalizer. Raw and settled H1/body sentinels and actual form values remained directional.

## 5. Seattle-area canonical/redirect model

- `/vancouver-to-seattle-movers/` and `/seattle-to-vancouver-movers/` are the two indexable canonical content pages.
- `/vancouver-to-redmond-movers/` and `/vancouver-to-bellevue-movers/` are permanent aliases/redirects to `/vancouver-to-seattle-movers/` in both `src/index.js` and `site-copy/_redirects`.
- Redmond, Bellevue, Kirkland, Everett, and Tacoma remain Seattle/Puget Sound service-area references, not new route pages.
- Pair navigation and related links point to the two canonical pages or established cross-border hubs. No redirect strategy changed and no new Seattle-area route was created.

## 6. Full durable source/data chain

The durable chain is:

`checked-in static route source` → `seattle-vancouver-route-data.mjs` → registered `finalize-seattle-vancouver-routes.mjs` → pair HTML and pair-scoped CSS/JS → registered FAQ architecture finalizer → registered title normalizer.

The pair finalizer is in the aggregate build order after the checked-in source is preserved. It reads neither another route's generated HTML nor a mutable domestic route template. `generate-spa-routes.mjs` discovers the URLs but skips them because the ownership registry assigns them to the checked-in static source. The domestic cost guide has no authoritative Seattle rows, and deterministic chatbot pricing has no competing Seattle route table; therefore neither was treated as a writer or stronger fact source.

## 7. Authoritative route facts

| Fact | Vancouver → Seattle | Seattle → Vancouver | Winning Source |
|---|---:|---:|---|
| Distance | Not asserted numerically | Not asserted numerically | No durable pair source supplies a numeric distance; omitted rather than invented |
| Transit | Overnight service may be planned when scheduling and border documentation are ready; actual schedule is confirmed per move | Same | Pair-owned historical route copy, now frozen with its conditions intact |
| Studio | US$2,150 | US$2,150 | Pair-owned checked-in pricing/FAQ, now frozen |
| 1-bedroom | US$2,700 | US$2,700 | Same |
| 2-bedroom | US$3,100 | US$3,100 | Same |
| 3-bedroom | US$3,700 | US$3,700 | Same |
| 4+ bedroom | US$4,500 | US$4,500 | Same |
| Overall price range | US$2,150–US$4,500 | US$2,150–US$4,500 | Same |

The supported symmetry was preserved. No domestic CAD figures or numeric distance/transit promise was introduced.

## 8. Pricing architecture decision

The durable pair source already contained five home-size estimates, so the canonical five-row architecture is factually supported. Step 49 retained those USD figures and moved them into the canonical four-column shell with planning notes and conditional transit language. It did not borrow domestic-route prices.

## 9. Route-fact corrections, if any

Prices did not change. `4 bedrooms` was normalized to the canonical `4+ bedroom` label without changing US$4,500. Transit language now consistently says overnight service **may** be planned and that the actual schedule is confirmed for the move. No numeric distance was added because no durable internal source supports one.

## 10. Cross-border wording corrections

The pair now consistently uses `cross-border move`, `Canada–U.S.`, `U.S.–Canada`, `BC–Washington`, and `Washington–BC`. Domestic-only/interprovincial phrasing is rejected by the finalizer. Border-document wording stays shipment-specific and instructs customers to confirm current paperwork; it makes no unsupported immigration, duty/tax, brokerage, prohibited-goods, border-wait, guaranteed-delivery, or legal-document claim.

## 11. Contamination/copy errors removed

The Seattle → Vancouver eyebrow and destination-specific FAQ contamination were removed. Toronto, Calgary, Edmonton, Montreal, Ottawa, Halifax, Victoria, and Winnipeg do not appear as route-body facts; any appearances outside the pair body are legitimate global navigation/footer links. The literal trailing `` `n `` artifact from the old snapshots is gone.

## 12. Directional form result

- Vancouver → Seattle: actual values remained `Vancouver, BC` → `Seattle, WA` at initial load, ~1.6 seconds, and 5.2+ seconds.
- Seattle → Vancouver: actual values remained `Seattle, WA` → `Vancouver, BC` at the same checkpoints.

These are input values, not placeholder-only evidence. Directionality also passes in H1, hero eyebrow, quote/pricing headings, glance, FAQ, CTA, pickup/delivery copy, and reverse-route links.

## 13. Metadata/title/OG/Twitter result

For each route, raw and settled `<title>`, `og:title`, and `twitter:title` match exactly and end once with `| Purely Canadian Movers`. Each page has a route-specific cross-border description, self-canonical, matching OG URL, and no homepage metadata.

## 14. FAQ/schema result

Each page has one visible FAQ section, one FAQ heading, one implementation, one `FAQPage`, and eight directional questions. Browser comparison confirms exact question/answer/order parity. There is no hidden generic FAQ or `.pcm-local-seo`.

## 15. Protection/pricing terminology result

Pricing is explicitly planning-only and subject to a written estimate. The pages distinguish basic carrier liability from available Declared Value Protection. Stale generic valuation/insurance language, guaranteed pricing, and guaranteed border processing are absent.

## 16. Typography result

Computed typography matches the canonical contract: Playfair Display headings; Source Sans 3 body/forms/buttons; H1 at 48px/60px/700 at 1280 × 900 and 36px/45px/700 at 390 × 844. No global typography file changed.

## 17. Quote-panel result

Each route has exactly one canonical quote panel with the 1120px shell, canonical two-column desktop/one-column mobile grid, red left accent, 8px radius, canonical shadow, six trust pills, written-estimate treatment, verified company details, directional values, and canonical buttons/form. The expired `BOOK BEFORE SEPTEMBER 30` / online-estimate promotion was removed.

## 18. Pricing result

Each route has one `.pcm-route-cost` section, one table, five authoritative rows, a directional heading, US$2,150–US$4,500 overall range, 760px minimum table width, internal mobile scrolling, protection terminology, and planning disclaimer. `Moving Cost Breakdown`, duplicate pricing, stale temporary pricing, and `undefined` are absent.

## 19. Route at a Glance result

Each page has one three-card glance block: corridor, transit-planning status, and USD planning range. It intentionally does not display an unsupported numeric distance. Desktop renders three columns; mobile renders one. The values agree with pricing, body, FAQ, and schema.

## 20. Main-content result

The canonical content width, hierarchy, spacing, cards/lists, process, FAQ, related resources, and closing CTA are present. Southbound copy retains Vancouver/BC pickup and Seattle delivery details; northbound copy retains Seattle/Washington pickup and Vancouver condo/strata delivery details. The directions are not textually identical.

## 21. Related-destination/Seattle-area result

Related links use the reverse canonical route, `/bc-to-washington-movers/`, `/canada-usa/`, packing, storage, and Declared Value Protection resources. No content link targets the deprecated Redmond/Bellevue aliases and no duplicate indexable page was created.

## 22. Navigation result by architecture

Both routes use one static navigation implementation and no React bootstrap. Desktop dropdowns open and close, including Escape closure. At 390 × 844 the mobile trigger reports `aria-expanded` `false → true → false`; Escape closes the panel and returns the trigger state correctly.

## 23. Chatbot result by architecture

Both routes use one static chatbot script, one launcher, and one panel. Open, close, mobile fit, and sticky-control spacing passed. No React/static duplication appeared. The pair does not add Seattle to the Canadian deterministic city-pricing table, avoiding an incorrect province/city conversion.

## 24. Post-footer contamination result

Each route has one intended footer and zero `.pcm-local-seo`, `undefined`, post-footer FAQ, duplicate conversion block, homepage body, soft-404 body, or stale promotion.

## 25. Source/finalizer durability

The direct pair finalizer plus FAQ/title finalizers reproduced the final state. A second direct run changed zero bytes for both routes and both pair assets. Frozen-data validation, metadata, FAQ parity, form defaults, cross-border terminology, singular components, and hygiene assertions survive replay. The finalizer strips old pair/static/conversion script duplicates before writing exactly one registered instance.

## 26. Delayed-runtime stability

At raw HTML, early browser state, ~1.6 seconds, and 5.2+ seconds, both routes retain their H1/title/forms, one pricing section, one glance, one FAQ, one footer, and route-specific body. No homepage body, domestic overwrite, duplicate component, or `undefined` appears. React hydration is not applicable.

## 27. Exact desktop/mobile QA

At 1280 × 900 and 390 × 844, both pages have no page-level horizontal overflow, no broken local image, and no clipped controls. The quote panel changes from two columns to one; the glance changes from three columns to one; the 760px pricing table scrolls only inside its wrapper on mobile. Navigation and chatbot interactions pass. Browser console checks returned no application warning/error and no sandbox resource error during the final run.

## 28. Global title/FAQ/body regression result

- Raw title/OG/Twitter contract: 56/56. Browser title: 55/55 evaluable canonical.
- Raw FAQ contract: the Step 48 56/56 baseline remains intact; both changed routes pass raw and browser parity after Step 49. Browser FAQ: 55/55 evaluable canonical.
- Raw body hygiene: 56/56 with zero `.pcm-local-seo`, unintended `undefined`, homepage replacement, or soft 404.
- Victoria → Vancouver remains the sole unchanged browser-harness exclusion.

## 29. Ownership/architecture validation

The validator reports 56 routes, exactly one owner each, and zero collisions. Declared static architecture matches runtime. Syntax checks pass for pair data, finalizer, and pair JS. The automated suite passes **34/34**: the 33-test baseline plus one non-duplicative Step 49 determinism/static-identity test.

## 30. First aggregate convergence result

The complete aggregate ran in a fresh temporary Git clone after overlaying the current working-tree state for a like-for-like baseline. First pass: **0/56 route drift and 0/102 asset drift**. No unrelated drift was absorbed.

## 31. Second aggregate convergence result

The complete aggregate ran again in the same validation clone. Second pass: **0/56 route drift and 0/102 asset drift**.

## 32. Regression result

Both Seattle ↔ Vancouver directions were added exactly once to the existing 49-route regression list. The deduplicated result is **51/51 passed**, covering route identity, title branding, actual form values, pricing presence, zero `.pcm-local-seo`, zero `undefined`, navigation/chatbot presence, and body integrity. Pair-specific delayed and interaction QA additionally verifies FAQ parity, cross-border wording, exact pricing rows, responsive layout, menu state/Escape, and chatbot fit.

## 33. Working-tree route isolation

Comparing `STEP_48_AFTER.json` with `STEP_49_WORKTREE_AFTER.json` shows exactly two changed route HTML hashes:

- `/vancouver-to-seattle-movers/`
- `/seattle-to-vancouver-movers/`

No other route HTML changed. The only new route assets are the pair-scoped Step 49 CSS and JS.

## 34. Remaining known issues

The pre-existing Victoria → Vancouver browser-harness limitation remains unchanged; its raw contracts remain in the passing global baseline. The project has no durable numeric Vancouver–Seattle distance authority, so Step 49 intentionally omits a numeric distance rather than manufacturing one. No Step 49 blocker or unresolved Seattle ↔ Vancouver defect remains.

Step 49 is complete.
