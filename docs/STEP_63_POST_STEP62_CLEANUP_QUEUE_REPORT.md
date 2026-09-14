# Step 63 — Post-Step-62 cleanup-queue refresh

Scope: read-only audit and prioritization of the current 56 registered route pages after Step 62. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, shared runtime, or production/source file was modified. No deployment occurred and Step 64 was not started.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Full-page ownership: **56/56 exactly one owner each**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- `STEP_63_BASELINE.json` records the pre-audit SHA-256 hashes of all 56 routes and all 104 assets.
- The baseline is byte-identical to `STEP_62_FINAL_WORKSPACE.json` for every registered route and asset.
- The working tree was already materially dirty before Step 63. All pre-existing changes were preserved.

## 2. Step 62 Edmonton ↔ Montreal verification

Both Step 62 routes remain **A — Canonical**.

| Route | Owner / render | Raw FAQ | Rendered FAQ | Other verified contracts | Current class |
| --- | --- | --- | --- | --- | --- |
| `/edmonton-to-montreal-movers/` | `generate-spa-routes.mjs`; declared `react-spa`; registered hydration-free/static-navigation exception remains explicit | 1 section, 1 heading, 12 visible Q&A, 1 FAQPage × 12, exact question/answer/order parity | Exact 1/1/12/1×12 parity at initial, 1–2 s, and 5+ s states | Route title/OG/Twitter, self canonical/OG URL, description, `Edmonton, AB` → `Montreal, QC` form values, Playfair Display headings, Source Sans 3 body/forms, one pricing table, one glance, navigation, chatbot, responsive layout, and source facts pass | **A — Canonical** |
| `/montreal-to-edmonton-movers/` | `generate-spa-routes.mjs`; declared and actual `react-spa` | 1 section, 1 heading, 12 visible Q&A, 1 FAQPage × 12, exact question/answer/order parity | Exact 1/1/12/1×12 parity at initial, 1–2 s, and 5+ s states | Route title/OG/Twitter, self canonical/OG URL, description, `Montreal, QC` → `Edmonton, AB` form values, Playfair Display headings, Source Sans 3 body/forms, one pricing table, one glance, navigation, chatbot, responsive layout, and source facts pass | **A — Canonical** |

The fresh Step 62 pair audit reports no page errors and no contract failures. In the isolated chain, owner pass 1, owner pass 2, the route finalizers, FAQ finalizer, and title normalizer caused zero registered-route or asset drift. Comparing the Step 61 baseline with the current baseline finds exactly the two Step 62 target routes changed and **0/104 assets changed**. Every other registered route is byte-identical. Step 62 therefore improved only Edmonton ↔ Montreal and caused **no indirect improvement or regression**.

## 3. Remaining B routes

| Route | Exact minor defect | Owner | Expected cleanup scope |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | Mobile menu opens and sets `aria-expanded=true`, but Escape leaves it open | `generate-halifax-calgary-route-pages.mjs` | Pair-local mobile navigation keyboard behavior only |
| `/halifax-to-calgary-movers/` | Mobile menu opens and sets `aria-expanded=true`, but Escape leaves it open | `generate-halifax-calgary-route-pages.mjs` | Pair-local mobile navigation keyboard behavior only |
| `/edmonton-to-winnipeg-movers/` | Visible hero/body wording still says `fully insured` | `rebuild-edmonton-winnipeg-routes.mjs` | Pair template terminology only; preserve pricing, facts, FAQ, and layout |
| `/winnipeg-to-edmonton-movers/` | Visible hero/body wording still says `fully insured` | `rebuild-edmonton-winnipeg-routes.mjs` | Pair template terminology only; preserve pricing, facts, FAQ, and layout |
| `/halifax-to-vancouver-movers/` | Raw canonical points to `/vancouver-to-halifax-movers/`; runtime corrects it | `rebuild-halifax-vancouver-routes.mjs` | Direction-scoped raw canonical generation only |
| `/vancouver-to-winnipeg-movers/` | Computed body font is `Inter, Arial, sans-serif`, not Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | Pair-owned typography declarations/assets only |
| `/winnipeg-to-vancouver-movers/` | Computed body font is `Inter, Arial, sans-serif`, not Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | Pair-owned typography declarations/assets only |
| `/victoria-to-montreal-movers/` | Mobile menu opens and sets `aria-expanded=true`, but Escape leaves it open | `checked-in-static-route-source` plus `finalize-montreal-victoria-routes.mjs` | Direction-scoped navigation bridge in the pair finalizer; preserve route presentation |
| `/victoria-to-ottawa-movers/` | Mobile trigger has no `aria-expanded`; Escape leaves the opened menu visible | `rebuild-victoria-ottawa-route.mjs` | Direction-scoped trigger ARIA and Escape handling only |

No previously B route outside Edmonton → Montreal changed bytes during Step 62. Fresh source, computed-style, raw-metadata, and mobile-interaction checks reproduce each defect above; none qualifies for promotion to A.

## 4. Remaining C routes

| Route | Owner | Declared / actual render | Source chain | Exact material mismatch | Category | Downgrade to B? |
| --- | --- | --- | --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | `checked-in-static-route-source` | `static` / static | checked-in HTML → `finalize-montreal-calgary-routes.mjs` using `montreal-calgary-route-data.mjs` → bootstrap stripper → FAQ finalizer → title normalizer | Two rendered Route-at-a-Glance headings/blocks; all title, FAQ, metadata, form, pricing-table, navigation, and chatbot checks otherwise pass | Presentation / duplicate structure | **No**; duplicate primary route-summary structure remains material |
| `/bc-to-washington-movers/` | `generate-spa-routes.mjs` | `react-spa` / React SPA | preserved SPA-owned HTML and compiled bundle → FAQ finalizer → title normalizer → browser runtime | Legacy three-column `Moving Cost Breakdown` presentation remains the route's pricing model; raw canonical and raw `og:url` point to the homepage, although rendering corrects them | Presentation plus metadata/source durability | **No**; pricing standardization and source metadata correction are broader than a minor cleanup |

Neither C route changed in Step 62, and current rendered/source evidence still supports C rather than B or D. BC → Washington preserves its own generated output; no dependency on another route HTML was found, so it remains C rather than D.

## 5. Remaining D routes

| Route | Raw Canonical? | Rendered Canonical? | Downstream Repair Required? | Current Class |
| --- | --- | --- | --- | --- |
| `/montreal-to-victoria-movers/` | **No.** 1 FAQ section, 1 heading, 0 visible answers, 1 FAQPage × 12, and 12 parity differences; raw canonical and `og:url` point to the homepage | **Yes.** 1 section, 1 heading, 12 visible answers, 1 FAQPage × 12 with exact question/answer/order parity; rendered self canonical/OG URL | **Yes.** Browser/runtime normalization supplies visible FAQ cards and repairs metadata after load | **D — Architecture/source issue** |

The full-page owner is `generate-spa-routes.mjs`. It explicitly preserves existing generated route HTML as the authoritative input when the file exists. The pair post-processor `finalize-montreal-victoria-routes.mjs` removes/replaces schema and installs a browser-time normalizer, but does not write raw visible FAQ cards or raw self canonical/OG metadata. The global FAQ finalizer and title normalizer then change zero bytes. Raw source therefore remains incomplete and build-order/runtime dependent even though the rendered route is canonical.

## 6. Whether architecture/source queue reached zero

**No. Architecture/source queue is 1 route.** Montreal → Victoria remains D. Montreal → Edmonton was measured as raw and rendered canonical and has left the architecture/source queue.

## 7. Exact defect by remaining route

| Route(s) | Class | Exact defect category |
| --- | --- | --- |
| Calgary ↔ Halifax | B/B | responsive behavior, navigation |
| Edmonton ↔ Winnipeg | B/B | terminology |
| Halifax → Vancouver | B | metadata, source durability |
| Vancouver ↔ Winnipeg | B/B | body font, typography |
| Victoria → Montreal | B | responsive behavior, navigation |
| Victoria → Ottawa | B | responsive behavior, navigation, ARIA |
| Calgary → Montreal | C | Route at a Glance, duplicate structure |
| BC → Washington | C | legacy pricing presentation, raw metadata durability |
| Montreal → Victoria | D | raw FAQ architecture/parity, raw metadata, mutable preserved source, downstream repair |

No remaining route is classified for form defaults, spacing/width, stale promotion, chatbot, visible contamination, or route-fact defects.

## 8. Raw title results

- Canonical raw `<title>`: **56/56**.
- Canonical raw `og:title`: **56/56**.
- Canonical raw `twitter:title`: **56/56**.
- All three title fields agree on every route, and the exact brand suffix occurs once.

URL metadata is tracked separately from the title contract: raw canonical/`og:url` contamination remains on BC → Washington and Montreal → Victoria; Halifax → Vancouver has only the wrong-direction raw canonical.

## 9. Rendered title results

- Browser-rendered settled title contract: **56/56 canonical**.
- No lifecycle overwrite, OG-only mismatch, Twitter-only mismatch, or page error affected the settled result.

## 10. Raw FAQ canonical count

- One raw visible FAQ section: **56/56**.
- One raw FAQ heading: **56/56**.
- One raw FAQPage: **56/56**.
- Complete raw visible/schema question, answer, and order parity with at least one visible answer: **55/56**.
- Sole raw failure: `/montreal-to-victoria-movers/` (0 visible versus 12 schema answers).

Raw FAQ architecture is not 56/56, so the statement “All 56 routes are now source-canonical for FAQ architecture” is not applicable.

## 11. Rendered FAQ canonical count

- Browser-rendered canonical FAQ: **56/56**.
- Every settled route has one FAQ section, one heading, one FAQPage, at least one visible answer, and exact question/answer/order parity.

## 12. `.pcm-local-seo` / `undefined` / legacy-content results

- Raw visible `.pcm-local-seo` elements outside scripts/styles/templates: **0/56 routes affected**.
- Rendered `.pcm-local-seo` elements: **0/56 routes affected**. Ten raw documents retain the token only inside route-runtime normalizer code.
- Unintended visible `undefined`: **0/56 routes affected**.
- Visible legacy `Moving Cost Breakdown` heading: **0/56 routes affected**. The token remains in raw runtime/normalizer text on seven routes; the material legacy three-column pricing presentation remains confined to BC → Washington.
- Homepage-body contamination: **0/56 routes affected**.
- Soft-404 signatures: **0/56 routes affected**.
- Duplicate FAQ architecture after rendering: **0/56 routes affected**.
- Duplicate rendered pricing tables: **0/56 routes affected**.
- Duplicate Route-at-a-Glance: **1/56**, Calgary → Montreal.

## 13. Source-durability findings

Every non-A route was mapped to its full-page owner, route source/template, route data, post-processors, route runtime, and aggregate order.

- Calgary ↔ Halifax: pair generator from a checked-in route-specific source and explicit data; shared conversion runtime; no cross-route mutable dependency.
- Edmonton ↔ Winnipeg: deterministic pair generator from explicit pair templates/data plus pair-scoped CSS/JS; no cross-route dependency.
- Halifax ↔ Vancouver: deterministic pair generator from `tools/templates/hydration-static-routes/vancouver-to-halifax-movers.html` and frozen route facts; its raw canonical replacement is directionally incomplete, but it does not consume mutable generated route HTML.
- Vancouver ↔ Winnipeg: deterministic pair generator from explicit templates and `vancouver-winnipeg-route-data.mjs`; no build-order dependency.
- Victoria → Ottawa: deterministic pair owner with an explicit route template; no mutable route-page dependency.
- Calgary → Montreal: checked-in static source plus route-data-backed pair finalizer; no generated-route dependency.
- BC → Washington: SPA owner preserves its own existing output and compiled route runtime; raw metadata is not source-canonical, but no other route HTML is consumed.
- Montreal ↔ Victoria: mixed SPA/static pair. Montreal → Victoria's SPA owner preserves mutable existing generated output; the pair finalizer writes schema and a runtime repair rather than raw visible cards. This is the only remaining D/source-repair route.

No non-A route was found to consume a *different* generated route page as mutable source. Montreal → Victoria nevertheless remains D because its own generated output is the mutable source of record and canonical FAQ/URL state still depends on downstream browser repair.

## 14. Direct-owner/idempotency findings

A temporary isolated clone was used for source-risk routes. The direct `generate-spa-routes.mjs` owner (Montreal → Victoria and BC → Washington) and `rebuild-halifax-vancouver-routes.mjs` owner were run, hashed, run again, and hashed. The Montreal–Victoria route finalizer, global FAQ finalizer, and title normalizer were then run and hashed separately.

| Route | Deterministic owner? | Canonical owner output? | Route finalizer changes bytes? | FAQ finalizer changes bytes? | Title normalizer changes bytes? | First-run cleanup? | Build-order/runtime dependency? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Montreal → Victoria | Yes | **No:** owner preserves 0-visible/12-schema raw FAQ and homepage canonical/OG | No | No | No | No | **Yes**; browser runtime still repairs FAQ and URLs |
| BC → Washington | Yes | Partly: stable but retains homepage raw canonical/OG and legacy pricing | n/a | No | No | No | Runtime repairs URLs; no other-route dependency |
| Halifax → Vancouver | Yes | Partly: stable but raw canonical points to reverse route | n/a | No | No | No | Runtime repairs canonical; no other-route dependency |

Across all 56 registered routes and 104 assets, owner pass 1, owner pass 2, the Montreal–Victoria route finalizer, FAQ finalizer, and title normalizer each caused **zero byte changes**.

## 15. Pair/unpaired rollup

| Pair / Direction | Direction 1 | Direction 2 | Overall Class | Primary Defect |
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
| Montreal ↔ Victoria | D | B | source repair | Montreal → Victoria raw FAQ/metadata source; companion Escape behavior |
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
| Unpaired BC → Washington | C | — | material | Legacy pricing and raw metadata durability |
| Unpaired Victoria → Vancouver | A | — | complete | None |

No reverse route was inferred or created. `/vancouver-to-victoria-movers/` remains intentionally absent.

## 16. Exact current A/B/C/D route counts

- **A — Canonical: 44/56**.
- **B — Minor cleanup: 9/56**.
- **C — Material: 2/56**.
- **D — Architecture/source: 1/56**.
- Total: **56/56**.

These counts were rebuilt from the current route inventory and the current audits above, not derived by subtracting the Step 62 pair from stale totals.

## 17. Exact current pair counts

Among 27 bidirectional pairs:

- **20 complete**.
- **5 minor cleanup**.
- **1 material**.
- **1 source repair**.

Among the two legitimate unpaired directions, Victoria → Vancouver is complete and BC → Washington is material. Combined across all 29 pair/direction groups: **21 complete, 5 minor cleanup, 2 material, and 1 source repair**.

## 18. Ranked remaining cleanup queue

1. **Montreal ↔ Victoria** — D/B; the only remaining raw FAQ/source-repair route plus a bounded companion mobile-navigation defect.
2. **Calgary ↔ Montreal** — C/A; material duplicate-glance structure with clear static/finalizer ownership.
3. **BC → Washington** — C unpaired; legacy pricing presentation and raw metadata durability, with broader React presentation risk.
4. **Edmonton ↔ Winnipeg** — B/B; narrow pair-template terminology cleanup.
5. **Halifax ↔ Vancouver** — B/A; direction-scoped raw canonical cleanup.
6. **Calgary ↔ Halifax** — B/B; pair-local Escape behavior.
7. **Ottawa ↔ Victoria** — A/B; direction-scoped ARIA/Escape behavior.
8. **Vancouver ↔ Winnipeg** — B/B; pair-owned body-font cleanup.

The ranking applies remaining D work first, then C material work, then B work, while considering business importance, severity, ownership clarity, route-scoped fixability, regression risk, and likely first-pass aggregate stability. No exception to the requested D → C → B priority was necessary.

## 19. Recommended Step 64 target

**Montreal ↔ Victoria**.

## 20. Why Step 64 target is next

- Montreal → Victoria is the only route still classified D: raw source has 0 visible FAQ answers versus a 12-entry schema and homepage canonical/OG URLs.
- Rendering repairs it to exact 12/12 FAQ parity and self URLs, precisely identifying the missing durable source work.
- Ownership and the correction layer are explicit: `generate-spa-routes.mjs` plus the pair-scoped `finalize-montreal-victoria-routes.mjs`.
- The reverse direction has one bounded mobile Escape defect that belongs to the same pair finalizer.
- No new route, shared infrastructure change, or route-fact research is required.
- The current owner, pair finalizer, FAQ/title finalizers, and full aggregate chain are byte-stable, providing a deterministic convergence baseline.

## 21. Ownership/tests

- Ownership/architecture validator: **PASS** — 56 registered routes, 56 owners, zero collisions.
- Ownership, title-normalizer, and chatbot-pricing tests: **35/35 PASS**.
- Global rendered FAQ audit: **56/56 PASS**; raw source-canonical FAQ is separately **55/56**.
- Global raw/rendered title audit: **56/56 PASS**.

## 22. Syntax results

- Current `.mjs` files checked: **125**.
- Syntax passes: **125/125**.
- Syntax failures: **0**.

## 23. Browser regression

- Deduplicated routes attempted: **53**.
- Passed: **53/53**.
- Failed: **0**.
- Both Edmonton ↔ Montreal directions and Montreal ↔ Victoria directions are represented exactly once.
- The suite intentionally contains fewer than 56 entries: it covers the deduplicated evaluable route set, includes Victoria → Vancouver as the legitimate unpaired direction, and does not invent Vancouver → Victoria. BC → Washington and the remaining registered special-case inventory continue to be covered by the separate 56-route global audits.

## 24. First aggregate result

A fresh local Git clone with hardlinks disabled was overlaid with the current working-tree `site-copy`, `tools`, and package manifest. The authoritative aggregate route build ran once in that isolated clone.

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed. No Step 63A reconciliation is required.

## 25. Second aggregate result

The authoritative aggregate ran a second time in the same qualifying isolated clone.

- **0/56 route drift** versus pass 1.
- **0/104 asset drift** versus pass 1.

## 26. Read-only workspace verification

The final registered-route/asset hash comparison against `STEP_63_BASELINE.json` found:

- **0/56 route HTML changes**.
- **0/104 asset changes**.

Only this report and Step 63 audit/hash evidence files were created. All owner, route-finalizer, FAQ/title-finalizer, and aggregate mutations ran in isolated temporary clones. No production/source file was modified.

## 27. Remaining known issues

- One route remains D: Montreal → Victoria, with incomplete raw FAQ architecture and raw homepage URL metadata.
- Two routes remain C: Calgary → Montreal and BC → Washington.
- Nine routes remain B with the exact navigation, terminology, metadata, or typography defects listed above.
- Raw URL metadata contamination remains on BC → Washington, Halifax → Vancouver, and Montreal → Victoria; rendering corrects all three.
- No ownership, collision, title, rendered FAQ, aggregate, soft-404, visible `.pcm-local-seo`, visible `undefined`, homepage-body contamination, or duplicate pricing-table defect appeared.
- No deployment occurred. Step 64 was not started.

Step 63 cleanup-queue refresh is complete. No route cleanup was performed.

Recommended Step 64 target: **Montreal ↔ Victoria**.
