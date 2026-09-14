# Step 57 — Post-Step-56 cleanup-queue refresh

Scope: read-only audit and prioritization of the 56 registered route pages after Step 56. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, or shared runtime was modified. No deployment occurred and Step 58 was not started.

## 1. Current 56-route baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Full-page ownership: **56/56 exactly one owner each**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- `STEP_57_BASELINE.json` records the pre-audit SHA-256 hash of all 56 route files and all 104 assets.
- The working tree was already materially dirty before Step 57. All pre-existing changes were preserved.

## 2. Step 56 Edmonton ↔ Toronto verification

Both Step 56 directions remain **A — Canonical**.

| Route | Owner | Raw FAQ | Rendered FAQ | Typography | Forms | Pricing / glance | Metadata | Source durability | Current class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/edmonton-to-toronto-movers/` | `generate-spa-routes.mjs` | 1 section, 1 heading, 12 visible Q&A, 1 FAQPage, exact 12/12 parity | Exact 12/12 parity | Playfair Display heading; Source Sans 3 body/FAQ/forms | `Edmonton, AB` → `Toronto, ON` | One five-row table; one glance | Canonical title fields, self canonical and OG URL | Pair finalizer writes durable visible FAQ; direct owner, global FAQ finalizer, and aggregate change 0 bytes | **A — Canonical** |
| `/toronto-to-edmonton-movers/` | `generate-spa-routes.mjs` | 1 section, 1 heading, 12 visible Q&A, 1 FAQPage, exact 12/12 parity | Exact 12/12 parity | Playfair Display heading; Source Sans 3 body/FAQ/forms | `Toronto, ON` → `Edmonton, AB` | One five-row table; one glance | Canonical title fields, self canonical and OG URL | Pair finalizer writes durable visible FAQ; direct owner, global FAQ finalizer, and aggregate change 0 bytes | **A — Canonical** |

The current files are byte-identical to `STEP_56_FINAL_WORKSPACE.json`. Current global browser audits reconfirm title, FAQ, form, pricing, navigation, chatbot, body-integrity, `.pcm-local-seo`, and `undefined` contracts. The detailed Step 56 pair audit remains applicable because neither target route nor any asset changed after that audit. Comparing Step 55 with the current baseline finds exactly these two route changes and zero asset changes. Therefore Edmonton ↔ Toronto moved cleanly from D/D to A/A with no route or asset side effects, and no other route improved or regressed indirectly.

## 3. Remaining B routes

All eleven Step 55 B routes are byte-identical to their Step 55 state. Their prior defects therefore remain current.

| Route | Step 55 status | Current status | Remaining defect |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | B — Minor cleanup | **B — Minor cleanup** | Mobile menu does not close on Escape |
| `/halifax-to-calgary-movers/` | B — Minor cleanup | **B — Minor cleanup** | Mobile menu does not close on Escape |
| `/edmonton-to-montreal-movers/` | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured`; mobile open state/`aria-expanded` and Escape behavior |
| `/edmonton-to-winnipeg-movers/` | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured` terminology |
| `/winnipeg-to-edmonton-movers/` | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured` terminology |
| `/halifax-to-vancouver-movers/` | B — Minor cleanup | **B — Minor cleanup** | Raw canonical points to the reverse direction until runtime correction |
| `/vancouver-to-edmonton-movers/` | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured` terminology |
| `/vancouver-to-winnipeg-movers/` | B — Minor cleanup | **B — Minor cleanup** | Body computes to Inter rather than Source Sans 3 |
| `/winnipeg-to-vancouver-movers/` | B — Minor cleanup | **B — Minor cleanup** | Body computes to Inter rather than Source Sans 3 |
| `/victoria-to-montreal-movers/` | B — Minor cleanup | **B — Minor cleanup** | Mobile menu does not close on Escape |
| `/victoria-to-ottawa-movers/` | B — Minor cleanup | **B — Minor cleanup** | Mobile trigger lacks `aria-expanded`; Escape does not close menu |

## 4. Remaining C routes

Both Step 55 C routes are byte-identical to their Step 55 state; neither was corrected indirectly.

| Route | Full-page owner | Current structure | Exact material defect | Corrected indirectly? | Still material? |
| --- | --- | --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | `checked-in-static-route-source` with `finalize-montreal-calgary-routes.mjs` | Static route with otherwise canonical title, FAQ, forms, pricing, navigation, and chat | Duplicate Route-at-a-Glance presentation creates a material structural mismatch | No | **Yes** |
| `/bc-to-washington-movers/` | `generate-spa-routes.mjs` | React-SPA route whose rendered contracts settle correctly | Legacy pricing presentation plus raw canonical and `og:url` pointing to the homepage | No | **Yes** |

## 5. Remaining D routes

The five remaining D routes are owned by `generate-spa-routes.mjs`. Each raw document has one FAQ shell and one FAQPage but no visible Q&A. Browser execution supplies visible FAQs and reconciles the rendered result.

| Route | Owner | Raw FAQ section / heading / visible / FAQPage entries | Raw Canonical? | Rendered Canonical? | Repair Still Needed? |
| --- | --- | --- | --- | --- | --- |
| `/edmonton-to-vancouver-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×9 | No | Yes, 9/9 | **Yes** |
| `/montreal-to-edmonton-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×8 | No | Yes, 12/12 | **Yes** |
| `/montreal-to-toronto-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×12 | No | Yes, 12/12 | **Yes** |
| `/toronto-to-montreal-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×9 | No | Yes, 9/9 | **Yes** |
| `/montreal-to-victoria-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×12 | No | Yes, 12/12 | **Yes** |

Montreal → Edmonton additionally retains a stale raw eight-entry schema that the browser changes to 12. None of these five raw-source issues was corrected indirectly.

## 6. Exact defect by route

| Route(s) | Class | Defect type(s) |
| --- | --- | --- |
| Calgary ↔ Halifax | B/B | responsive behavior, nav |
| Edmonton → Montreal | B | terminology, responsive behavior, nav |
| Edmonton ↔ Winnipeg | B/B | terminology |
| Halifax → Vancouver | B | metadata, source durability |
| Vancouver → Edmonton | B | terminology |
| Vancouver ↔ Winnipeg | B/B | body font, typography |
| Victoria → Montreal | B | responsive behavior, nav |
| Victoria → Ottawa | B | responsive behavior, nav |
| Calgary → Montreal | C | glance, material structural mismatch |
| BC → Washington | C | pricing presentation, metadata, source durability, material structural mismatch |
| Edmonton → Vancouver | D | FAQ source durability, source durability |
| Montreal → Edmonton | D | FAQ source durability, FAQ wording/parity, metadata, source durability |
| Montreal ↔ Toronto | D/D | FAQ source durability, source durability |
| Montreal → Victoria | D | FAQ source durability, metadata, source durability |

No remaining route is classified for form defaults, spacing/width, stale promotion, contamination, or chatbot defects. Nav defects are limited to the B routes identified above.

## 7. Raw title results

- Raw `<title>` canonical: **56/56**.
- Raw `og:title` canonical: **56/56**.
- Raw `twitter:title` canonical: **56/56**.
- All three title fields agree per route and contain the exact brand suffix once.

## 8. Rendered title results

- Browser-rendered title contracts: **56/56 canonical**.
- No lifecycle overwrite or page error affected the settled result.

## 9. Raw FAQ canonical count

- One raw FAQ section: **56/56**.
- One raw FAQ heading: **56/56**.
- One raw `FAQPage`: **56/56**.
- Complete raw visible/schema parity with at least one visible Q&A: **51/56**.
- Raw-source failures: **5/56**, exactly the D routes in section 5.

## 10. Rendered FAQ canonical count

- Browser-rendered canonical FAQ: **56/56**.
- Every settled route has one FAQ section, one heading, one FAQPage, and exact visible/schema answer and order parity.

## 11. `.pcm-local-seo` / `undefined` / contamination checks

- Raw visible `.pcm-local-seo` elements: **0/56 routes affected**. Script-string references are not treated as visible elements.
- Rendered `.pcm-local-seo` elements: **0/56 routes affected**.
- Unintended visible `undefined`: **0/56 routes affected**.
- Soft-404 signatures: **0/56 routes affected**.
- Raw homepage canonical/OG contamination remains on exactly three routes: `/bc-to-washington-movers/`, `/montreal-to-edmonton-movers/`, and `/montreal-to-victoria-movers/`. Rendering corrects these URLs.
- Homepage-body contamination: **0/56 routes affected**.

## 12. Source-durability findings

In the isolated temporary clone, direct SPA-owner run 1, direct SPA-owner run 2, and the global FAQ finalizer each caused **0/56 route changes and 0/104 asset changes**. The owner is deterministic but deliberately preserves incomplete route-specific raw output. The global FAQ finalizer cannot synthesize absent visible cards, so the current browser runtime remains a downstream repair dependency for the five D routes.

| Route(s) | Deterministic owner? | Incomplete raw output? | Downstream repair required? | Mutable dependency? | Build-order dependency? | Exact durable repairing writer/finalizer |
| --- | --- | --- | --- | --- | --- | --- |
| Montreal ↔ Toronto | Yes | Yes | Yes | Yes | Yes | `finalize-montreal-toronto-routes.mjs` |
| Edmonton → Vancouver | Yes | Yes | Yes | Yes | Yes | `finalize-vancouver-edmonton-routes.mjs` |
| Montreal → Edmonton | Yes, with companion route preserved | Yes, including stale 8-entry schema | Yes | Yes | Yes | `finalize-montreal-edmonton-routes.mjs` |
| Montreal → Victoria | Yes, with companion route preserved | Yes | Yes | Yes | Yes | `finalize-montreal-victoria-routes.mjs` |

The exact current repairing layer is the compiled React runtime plus each route/pair inline normalizer. The named route finalizers are the correct durable source locations; the global FAQ finalizer is downstream but ineffective for these absent raw cards.

## 13. Pair/unpaired rollup

| Pair / direction | Route A class | Route B class | Overall class | Main defect |
| --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | complete | None |
| Calgary ↔ Halifax | B | B | minor cleanup | Mobile Escape closure |
| Calgary ↔ Montreal | C | A | material | Duplicate glance on Calgary → Montreal |
| Calgary ↔ Ottawa | A | A | complete | None |
| Calgary ↔ Toronto | A | A | complete | None |
| Calgary ↔ Vancouver | A | A | complete | None |
| Calgary ↔ Winnipeg | A | A | complete | None |
| Edmonton ↔ Montreal | B | D | source repair | Montreal → Edmonton raw FAQ/source; companion terminology/nav |
| Edmonton ↔ Ottawa | A | A | complete | None |
| Edmonton ↔ Toronto | A | A | complete | None |
| Edmonton ↔ Vancouver | D | B | source repair | Edmonton → Vancouver raw FAQ/source; companion terminology |
| Edmonton ↔ Winnipeg | B | B | minor cleanup | Terminology |
| Halifax ↔ Toronto | A | A | complete | None |
| Halifax ↔ Vancouver | B | A | minor cleanup | Halifax → Vancouver raw canonical |
| Montreal ↔ Toronto | D | D | source repair | Raw visible FAQ absent |
| Montreal ↔ Vancouver | A | A | complete | None |
| Montreal ↔ Victoria | D | B | source repair | Montreal → Victoria raw FAQ/source; companion mobile Escape |
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

No missing reverse route was invented.

## 14. Exact current A/B/C/D counts

- **A — Canonical: 38/56**.
- **B — Minor cleanup: 11/56**.
- **C — Material: 2/56**.
- **D — Architecture/source: 5/56**.
- Total: **56/56**.

Relative to Step 55, Edmonton → Toronto and Toronto → Edmonton each moved D → A. Every other registered route is byte-identical to the Step 55 baseline, so no other route improved or regressed indirectly.

## 15. Exact current pair counts

Among 27 bidirectional pairs:

- **17 complete**.
- **5 minor cleanup**.
- **1 material**.
- **4 source repair**.

Among the two legitimate unpaired directions, Victoria → Vancouver is complete and BC → Washington is material. Combined across all 29 pair/direction groups: **18 complete, 5 minor cleanup, 2 material, and 4 source repair**.

## 16. Ranked remaining queue

1. **Montreal ↔ Toronto** — D/D; two high-value directions, one clear pair finalizer, and the same narrow raw FAQ defect.
2. **Edmonton ↔ Vancouver** — D/B; repair the Edmonton → Vancouver source defect, with separate companion terminology cleanup.
3. **Edmonton ↔ Montreal** — B/D; Montreal → Edmonton also has stale raw schema and homepage metadata.
4. **Montreal ↔ Victoria** — D/B; source repair plus a separate companion mobile-nav defect.
5. **Calgary ↔ Montreal** — C/A; material duplicate-glance standardization.
6. **BC → Washington** — C unpaired; legacy pricing and raw metadata durability, with broader presentation risk.
7. **Edmonton ↔ Winnipeg** — B/B; narrow terminology cleanup.
8. **Halifax ↔ Vancouver** — B/A; direction-scoped raw canonical cleanup.
9. **Calgary ↔ Halifax** — B/B; pair-local mobile Escape behavior.
10. **Ottawa ↔ Victoria** — A/B; direction-scoped ARIA/Escape behavior.
11. **Vancouver ↔ Winnipeg** — B/B; pair-owned body-font cleanup.

This ranking applies source durability first, then materiality, SEO/business importance, regression risk, route-scoped fixability, owner/source clarity, and likelihood of aggregate first-pass stability. It is not based purely on step history.

## 17. Recommended Step 58 target

**Montreal ↔ Toronto**.

## 18. Why Step 58 target is next

- Both directions remain D, so one pair-scoped step can remove two of the five highest-priority source issues.
- The corridor is commercially and SEO-important, and both directions are already registered; no route creation is needed.
- Ownership is clear and collision-free: `generate-spa-routes.mjs` with the dedicated `finalize-montreal-toronto-routes.mjs` post-processor.
- The defect is narrow and reproducible: zero raw visible Q&A versus canonical rendered 12/12 and 9/9 results.
- The existing rendered output exposes the authoritative direction-specific content, permitting a deterministic source repair without shared infrastructure changes.
- Direct-owner, FAQ-finalizer, and both aggregate passes are byte-stable, providing a low-risk convergence baseline.

## 19. Ownership/tests

- Ownership/architecture validator: **PASS**, 56 registered routes, 56 owners, zero collisions.
- Ownership, title, and chatbot-pricing tests: **35/35 PASS**.
- Syntax checks: **122/122 `.mjs` files PASS**.
- Global raw/browser title contracts: **56/56 PASS**.
- Global rendered FAQ contracts: **56/56 PASS**.

## 20. Browser regression

- Attempted: **52 unique registered routes/directions**.
- Passed: **52/52**.
- Failed: **0**.
- Edmonton ↔ Toronto is included exactly once per direction and both passed.
- Victoria → Vancouver is represented once as the legitimate unpaired direction; nonexistent Vancouver → Victoria was not added.

## 21. First aggregate result

A fresh temporary Git clone was overlaid with the current working-tree `site-copy`, `tools`, and package manifest. The registered aggregate route build then ran once in that clone.

- Route drift: **0/56**.
- Asset drift: **0/104**.

Required convergence passed. No Step 57A reconciliation is needed.

## 22. Second aggregate result

- Second pass versus first: **0/56 route drift**.
- Asset drift: **0/104**.
- Second pass versus the isolated clone baseline: **0/56 route drift and 0/104 asset drift**.

## 23. Read-only workspace verification

Post-audit SHA-256 comparison of `STEP_57_FINAL_WORKSPACE.json` against `STEP_57_BASELINE.json` found:

- **0/56 route changes**.
- **0/104 asset changes**.

Only this report and Step 57 evidence/log files were created. All owner, finalizer, and aggregate mutations ran in a temporary clone. No route cleanup was performed.

## 24. Remaining known issues

- Five SPA-owned routes remain D because raw output lacks visible FAQ Q&A and depends on browser execution plus mutable preserved output.
- Two routes remain C: Calgary → Montreal and BC → Washington.
- Eleven routes remain B with the typography, terminology, metadata, or mobile-navigation defects listed above.
- Raw homepage canonical/OG contamination remains on BC → Washington, Montreal → Edmonton, and Montreal → Victoria.
- No ownership, collision, title, rendered FAQ, aggregate, soft-404, `.pcm-local-seo`, visible `undefined`, or homepage-body contamination defect appeared.
- No deployment occurred. Step 58 was not started.

Step 57 cleanup-queue refresh is complete. No route cleanup was performed.

Recommended Step 58 target: **Montreal ↔ Toronto**.
