# Step 65 — Post-Step-64 cleanup-queue refresh

Scope: read-only audit and prioritization of the current 56 registered route pages after Step 64. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, shared runtime, or production/source file was modified. No deployment occurred and Step 66 was not started. `STEP_65_QUEUE_AUDIT.mjs` and the Step 65 JSON files are audit evidence only.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Full-page ownership: **56/56 exactly one owner each**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- `STEP_65_BASELINE.json` records the pre-audit SHA-256 hashes of all 56 routes and all 104 assets.
- The baseline is byte-identical to `STEP_64_FINAL_WORKSPACE.json` for every registered route and asset.
- The working tree was already materially dirty before Step 65. All pre-existing changes were preserved.

## 2. Step 64 Montreal ↔ Victoria verification

Both Step 64 routes remain **A — Canonical**.

| Route | Owner / declared and actual render | Verified result | Current class |
| --- | --- | --- | --- |
| `/montreal-to-victoria-movers/` | `generate-spa-routes.mjs`; `react-spa` / React SPA | Dedicated fresh audit passes raw self canonical/OG URL, route title/OG/Twitter, route description, `Montreal, QC` → `Victoria, BC` form values, one five-row pricing table, one glance, one visible 12-answer FAQ and one 12-entry FAQPage with exact parity, Playfair Display headings, Source Sans 3 body/forms, desktop/mobile layout, navigation, chatbot, and source facts | **A — Canonical** |
| `/victoria-to-montreal-movers/` | `checked-in-static-route-source`; `static` / static | Dedicated fresh audit passes the same contracts with `Victoria, BC` → `Montreal, QC`; mobile navigation changes `aria-expanded` false → true → false around open/Escape and closes the menu | **A — Canonical** |

`STEP_65_MONTREAL_VICTORIA_AUDIT.json` reports both directions PASS with no page errors. `STEP_65_FAQ_GLOBAL.json` and `STEP_65_TITLE_GLOBAL.json` confirm the pair inside the global 56/56 results. The fresh aggregate's clean first and second passes establish pair-finalizer, FAQ-finalizer, and title-normalizer idempotency in the complete build chain.

Comparing `STEP_63_FINAL_WORKSPACE.json` with the Step 65 baseline finds exactly the two Step 64 target routes changed and **0/104 assets changed**. Comparing `STEP_64_FINAL_WORKSPACE.json` with the Step 65 baseline finds no changes. Step 64 therefore improved only Montreal ↔ Victoria; **no route improved or regressed indirectly**.

## 3. Architecture/source queue

**Architecture/source queue: 0. D remains 0.**

- Raw FAQ canonical: **56/56**.
- Every registered route has one visible FAQ section, one FAQ heading, one FAQPage, at least one visible answer, and exact visible/schema question, answer, and order parity in source.
- No route requires downstream repair to create missing core FAQ architecture.
- Ownership validator: 56 routes, 56 owners, zero collisions and no ownership mismatch.
- Registry rendering declarations match the validated architecture; no mutable *other-route* generated page is a required source.
- The isolated aggregate is clean on its first pass, so no route has a build-order-only canonicalization defect.

The remaining raw canonical URL defects on Halifax → Vancouver and BC → Washington are bounded metadata defects with deterministic owners. They do not create missing core architecture, consume another mutable route, or make the aggregate non-convergent, so the evidence supports B and C respectively rather than D.

## 4. Re-audit of every previously non-A route

| Route | Previous class | Current class | Exact remaining defect |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | B | B | Mobile menu remains open after Escape; `aria-expanded` stays `true` |
| `/halifax-to-calgary-movers/` | B | B | Mobile menu remains open after Escape; `aria-expanded` stays `true` |
| `/edmonton-to-winnipeg-movers/` | B | B | One visible `fully insured` claim remains |
| `/winnipeg-to-edmonton-movers/` | B | B | One visible `fully insured` claim remains |
| `/halifax-to-vancouver-movers/` | B | B | Raw canonical points to the reverse direction; rendered canonical is correct |
| `/vancouver-to-winnipeg-movers/` | B | B | Computed body font is `Inter, Arial, sans-serif` |
| `/winnipeg-to-vancouver-movers/` | B | B | Computed body font is `Inter, Arial, sans-serif` |
| `/victoria-to-montreal-movers/` | B | A | Step 64 added the route-scoped Escape bridge; no defect remains |
| `/victoria-to-ottawa-movers/` | B | B | Mobile trigger lacks `aria-expanded`; Escape leaves menu open |
| `/calgary-to-montreal-movers/` | C | C | Two rendered Route-at-a-Glance headings/blocks remain |
| `/bc-to-washington-movers/` | C | C | Legacy rendered `Moving Cost Breakdown` pricing presentation plus homepage raw canonical/OG URL |
| `/montreal-to-victoria-movers/` | D | A | Step 64 made raw FAQ, metadata, forms, pricing, and glance source-canonical; no defect remains |

No previously non-A route changed class except the two Step 64 targets.

## 5. Remaining B routes

| Route | Exact minor defect | Owner | Expected cleanup scope |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | Mobile menu opens with `aria-expanded=true`, but Escape leaves the `.pcm-static-mobile` menu open and the attribute true | `generate-halifax-calgary-route-pages.mjs` | Pair-local mobile-navigation keyboard behavior only |
| `/halifax-to-calgary-movers/` | Same reproducible Escape defect | `generate-halifax-calgary-route-pages.mjs` | Pair-local mobile-navigation keyboard behavior only |
| `/edmonton-to-winnipeg-movers/` | Visible hero/body wording contains one `fully insured` occurrence | `rebuild-edmonton-winnipeg-routes.mjs` | Pair-template terminology only; preserve facts, FAQ, pricing, and layout |
| `/winnipeg-to-edmonton-movers/` | Visible hero/body wording contains one `fully insured` occurrence | `rebuild-edmonton-winnipeg-routes.mjs` | Pair-template terminology only; preserve facts, FAQ, pricing, and layout |
| `/halifax-to-vancouver-movers/` | Raw canonical is `https://purelycanadianmovers.com/vancouver-to-halifax-movers/`; runtime settles to the correct direction | `rebuild-halifax-vancouver-routes.mjs` | Direction-scoped raw canonical generation only |
| `/vancouver-to-winnipeg-movers/` | Computed body font is `Inter, Arial, sans-serif`, not Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | Pair-owned typography declarations/assets only |
| `/winnipeg-to-vancouver-movers/` | Computed body font is `Inter, Arial, sans-serif`, not Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | Pair-owned typography declarations/assets only |
| `/victoria-to-ottawa-movers/` | Trigger has no `aria-expanded`; Escape leaves the opened menu visible | `rebuild-victoria-ottawa-route.mjs` | Direction-scoped trigger ARIA and Escape handling only |

## 6. Remaining C routes

| Route | Exact material defect | Owner | Can downgrade? | Reason |
| --- | --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | Static output renders **two** Route-at-a-Glance headings/blocks. Titles, FAQ, self URLs, form, one pricing table, typography, navigation, and chatbot otherwise pass. Category: structural/presentation. | `checked-in-static-route-source` plus `finalize-montreal-calgary-routes.mjs` | **No** | Duplicate primary route-summary structure remains user-visible and material, not a small wording/style adjustment |
| `/bc-to-washington-movers/` | React SPA renders the legacy `Moving Cost Breakdown` pricing presentation; raw canonical and raw `og:url` both point to the homepage, though runtime settles to self URLs. Category: visual/presentation plus metadata/source durability. | `generate-spa-routes.mjs` | **No** | Pricing-model standardization plus durable source metadata correction is broader than a minor cleanup |

Declared and actual render, owner, and source chain:

- Calgary → Montreal: `static` / static; checked-in route HTML → `finalize-montreal-calgary-routes.mjs` using `montreal-calgary-route-data.mjs` → bootstrap stripper → FAQ finalizer → title normalizer; route runtime uses the pair JS plus static navigation/chat and conversion runtime.
- BC → Washington: `react-spa` / React SPA; its own preserved SPA-owned HTML and compiled bundle → FAQ finalizer → title normalizer → conversion/browser runtime. It does not consume a different generated route page.

Neither route can be downgraded to B on current evidence, and neither has a D-level ownership or build-order defect.

## 7. Routes reclassified A

- `/montreal-to-victoria-movers/`: D → A in Step 64; remains A.
- `/victoria-to-montreal-movers/`: B → A in Step 64; remains A.

No additional route was promoted indirectly.

## 8. Routes reclassified D

None. Current D count: **0/56**.

## 9. Raw title results

- Canonical raw `<title>`: **56/56**.
- Canonical raw `og:title`: **56/56**.
- Canonical raw `twitter:title`: **56/56**.
- All three fields agree on every route and use the exact brand suffix once.

URL metadata is separate from the title contract: BC → Washington retains homepage raw canonical/`og:url`; Halifax → Vancouver retains the reverse-direction raw canonical.

## 10. Rendered title results

- Settled browser title contract: **56/56 canonical/evaluable**.
- No runtime overwrite, brand duplication, field disagreement, or page error remained at settlement.

## 11. Raw FAQ results

- One visible FAQ section: **56/56**.
- One FAQ heading: **56/56**.
- One FAQPage: **56/56**.
- At least one visible answer and exact visible/schema question, answer, and order parity: **56/56**.

## 12. Rendered FAQ results

- Browser-rendered canonical FAQ: **56/56**.
- Each route has one section, one heading, one FAQPage, visible answers, exact question/answer/order parity, and no relevant page error.

## 13. Global contamination and structure results

- Visible `.pcm-local-seo`: **0/56 raw, 0/56 rendered**. Eight raw files retain the token only inside script/runtime code.
- Unintended visible `undefined`: **0/56 raw, 0/56 rendered**.
- Visible legacy `Moving Cost Breakdown`: **0/56 raw source, 1/56 rendered** — BC → Washington, the known C defect.
- Homepage-body contamination: **0/56 rendered**.
- Soft-404 signatures: **0/56 rendered**.
- Duplicate FAQ architecture: **0/56 raw, 0/56 rendered**.
- Duplicate pricing tables: **0/56 rendered**; every route has exactly one table.
- Duplicate Route at a Glance: **1/56** — Calgary → Montreal.
- Expired promo text: **0/56 raw visible** and no rendered stale-promotion finding.

## 14. Source-durability findings for remaining non-A routes

| Route group | Full-page source / data | Route-specific layer | Shared dependencies | Durability conclusion |
| --- | --- | --- | --- | --- |
| Calgary ↔ Halifax | Pair generator from checked-in route-specific source and explicit route data | Generated route metadata/menu bridge | Bootstrap stripper, FAQ/title finalizers, conversion runtime | Deterministic; no mutable cross-route source; B only |
| Edmonton ↔ Winnipeg | Explicit pair-owned templates and `edmonton-winnipeg-route-data.mjs` | Pair CSS/JS | FAQ/title finalizers, static navigation/chat, conversion CSS | Deterministic and order-independent; B terminology only |
| Halifax → Vancouver | Explicit hydration-static template and frozen route facts in `rebuild-halifax-vancouver-routes.mjs` | `step43-halifax-vancouver.js/css` | FAQ/title finalizers, static navigation/chat, conversion runtime | Deterministic; raw canonical replacement is incomplete but not architectural; B |
| Vancouver ↔ Winnipeg | Explicit owned templates and `vancouver-winnipeg-route-data.mjs` | `step40-vancouver-winnipeg.js/css` | FAQ/title finalizers, static navigation/chat, conversion runtime | Deterministic; B typography only |
| Victoria → Ottawa | Explicit template inside the pair owner | Owner-emitted navigation behavior | FAQ/title finalizers, conversion runtime | Deterministic; B ARIA/Escape only |
| Calgary → Montreal | Checked-in static route plus `montreal-calgary-route-data.mjs` | `finalize-montreal-calgary-routes.mjs`, pair JS/CSS | Bootstrap stripper, FAQ/title finalizers, static navigation/chat, conversion runtime | Stable source chain; C duplicate structure, not D |
| BC → Washington | Its own SPA-owned HTML plus compiled React bundle | SPA/runtime URL normalization | FAQ/title finalizers, conversion runtime | Stable first-pass aggregate; C presentation/metadata, not D |

No remaining non-A route consumes a different generated route page as mutable source. The ownership tests' explicit-template/order-independence checks pass, and the full aggregate converges with zero first-pass drift.

## 15. Pair/unpaired rollup

| Pair / direction | Direction 1 class | Direction 2 class | Overall class | Primary defect |
| --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | complete | None |
| Calgary ↔ Halifax | B | B | minor cleanup | Mobile Escape closure |
| Calgary ↔ Montreal | C | A | material | Duplicate glance on Calgary → Montreal |
| Calgary ↔ Ottawa | A | A | complete | None |
| Calgary ↔ Toronto | A | A | complete | None |
| Calgary ↔ Vancouver | A | A | complete | None |
| Calgary ↔ Winnipeg | A | A | complete | None |
| Edmonton ↔ Montreal | A | A | complete | None |
| Edmonton ↔ Ottawa | A | A | complete | None |
| Edmonton ↔ Toronto | A | A | complete | None |
| Edmonton ↔ Vancouver | A | A | complete | None |
| Edmonton ↔ Winnipeg | B | B | minor cleanup | Insurance terminology |
| Halifax ↔ Toronto | A | A | complete | None |
| Halifax ↔ Vancouver | B | A | minor cleanup | Halifax → Vancouver raw canonical |
| Montreal ↔ Toronto | A | A | complete | None |
| Montreal ↔ Vancouver | A | A | complete | None |
| Montreal ↔ Victoria | A | A | complete | None |
| Montreal ↔ Winnipeg | A | A | complete | None |
| Ottawa ↔ Toronto | A | A | complete | None |
| Ottawa ↔ Vancouver | A | A | complete | None |
| Ottawa ↔ Victoria | A | B | minor cleanup | Victoria → Ottawa ARIA/Escape |
| Ottawa ↔ Winnipeg | A | A | complete | None |
| Seattle ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Victoria | A | A | complete | None |
| Toronto ↔ Winnipeg | A | A | complete | None |
| Vancouver ↔ Winnipeg | B | B | minor cleanup | Body font |
| Unpaired BC → Washington | C | — | material | Legacy pricing and raw URL metadata |
| Unpaired Victoria → Vancouver | A | — | complete | None |

No missing reverse route was inferred or created. `/vancouver-to-victoria-movers/` remains intentionally absent.

## 16. Exact current A/B/C/D route counts

- **A — Canonical: 46/56**.
- **B — Minor cleanup: 8/56**.
- **C — Material: 2/56**.
- **D — Architecture/source: 0/56**.
- Total: **56/56**.

These counts were recalculated from the current inventory and current audit evidence, not inferred only by subtracting the Step 64 pair from Step 63 totals.

## 17. Exact current pair/unpaired counts

Among 27 bidirectional pairs:

- **21 complete**.
- **5 minor cleanup**.
- **1 material**.
- **0 source repair**.

Among the two legitimate unpaired directions: Victoria → Vancouver is complete and BC → Washington is material. Combined across all 29 pair/direction groups: **22 complete, 5 minor cleanup, 2 material, and 0 source repair**.

## 18. Ranked remaining cleanup queue

1. **Calgary ↔ Montreal** — C/A; material duplicate-glance structure, explicit static/finalizer ownership, and a narrow route-scoped correction.
2. **BC → Washington** — C unpaired; legacy pricing presentation and raw URL metadata, with broader React presentation risk.
3. **Edmonton ↔ Winnipeg** — B/B; narrow deterministic pair-template terminology cleanup.
4. **Halifax ↔ Vancouver** — B/A; direction-scoped raw canonical correction.
5. **Calgary ↔ Halifax** — B/B; pair-local Escape behavior.
6. **Ottawa ↔ Victoria** — A/B; direction-scoped ARIA/Escape behavior.
7. **Vancouver ↔ Winnipeg** — B/B; pair-owned body-font cleanup.

The ranking applies C before B, then considers business/SEO importance, visible severity, owner clarity, route-scoped fixability, regression risk, first-pass aggregate stability, and whether both directions can be completed deterministically in one step.

## 19. Recommended Step 66 target

**Calgary ↔ Montreal**.

## 20. Why Calgary ↔ Montreal is next

- Calgary → Montreal definitely remains C because two primary Route-at-a-Glance structures are rendered.
- It is the highest-ranked material defect; material work takes priority over the remaining cosmetic/interaction B queue.
- Ownership is explicit: checked-in static source plus the pair-scoped `finalize-montreal-calgary-routes.mjs` and route data.
- The reverse direction is already A, so the step can preserve it while validating the entire registered pair.
- The correction requires no route creation and no broad shared-infrastructure change.
- The full source chain is first-pass and second-pass aggregate-stable, making a deterministic route-scoped cleanup practical.

## 21. Ownership and tests

- Ownership/architecture validator: **PASS** — 56 routes, 56 owners, zero collisions.
- Ownership, title-normalizer, and chatbot-pricing tests: **35/35 PASS**.
- Global raw/rendered FAQ audit: **56/56 PASS**.
- Global raw/rendered title audit: **56/56 PASS**.

## 22. Syntax results

- Current `.mjs` files checked under `tools`: **126**.
- Syntax passes: **126/126**.
- Syntax failures: **0**.

The audit-only root evidence script is outside `tools`; it executed successfully and did not alter production/source files.

## 23. Browser regression

- Deduplicated routes attempted: **53**.
- Passed: **53/53**.
- Failed: **0**.
- Special-case handling: the suite uses the established deduplicated evaluable set, includes both Montreal ↔ Victoria directions exactly once and the legitimate unpaired Victoria → Vancouver direction, and does not invent Vancouver → Victoria. BC → Washington and the remaining registered exceptions are covered by the global FAQ/title/queue audits without inflating the regression count.

## 24. First aggregate result

A fresh local Git clone with hardlinks disabled was overlaid with the current `site-copy`, `tools`, and package manifest before hashing. Full aggregate pass 1 produced:

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed. Step 65A reconciliation is not required.

## 25. Second aggregate result

Full aggregate pass 2 in the same qualifying clone produced:

- **0/56 route drift**.
- **0/104 asset drift**.

## 26. Read-only workspace verification

`STEP_65_FINAL_WORKSPACE.json` compared with `STEP_65_BASELINE.json`:

- Registered route HTML changes: **0/56**.
- Asset changes: **0/104**.

Only the requested report and Step 65 audit/evidence files were created. No route cleanup was performed.

## 27. Remaining known issues

Eight B routes and two C routes remain: Calgary ↔ Halifax mobile Escape behavior; Edmonton ↔ Winnipeg insurance terminology; Halifax → Vancouver raw canonical; Vancouver ↔ Winnipeg body font; Victoria → Ottawa ARIA/Escape behavior; Calgary → Montreal duplicate glance; and BC → Washington legacy pricing/raw canonical and OG URL. D remains zero. No deployment occurred and Step 66 was not started.

Step 65 cleanup-queue refresh is complete. No route cleanup was performed.

Recommended Step 66 target: **Calgary ↔ Montreal**.
