# Step 59 — Post-Step-58 cleanup-queue refresh

Scope: read-only audit and prioritization of the current 56 registered route pages after Step 58. No route HTML, owner, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, or shared runtime was modified. No deployment occurred and Step 60 was not started.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Full-page ownership: **56/56 exactly one owner each**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- `STEP_59_BASELINE.json` records the pre-audit SHA-256 hashes of all 56 route files and all 104 assets.
- The baseline is byte-identical to `STEP_58_FINAL_WORKSPACE.json` for all 56 routes and all 104 assets.
- The working tree was already materially dirty before Step 59. All pre-existing changes were preserved.

## 2. Step 58 Montreal ↔ Toronto verification

Both Step 58 directions are now **A — Canonical**.

| Route | Owner / architecture | Raw FAQ | Rendered FAQ | Other canonical contracts | Current class |
| --- | --- | --- | --- | --- | --- |
| `/montreal-to-toronto-movers/` | `generate-spa-routes.mjs`; declared and actual `react-spa`; pair finalizer `finalize-montreal-toronto-routes.mjs` | 1 section, 1 heading, 12 visible Q&A, 1 FAQPage × 12, exact answer/order parity | 1/1/12/1×12, exact parity, `runtimeChanged=false` | Playfair Display headings and Source Sans 3 body/forms; `Montreal, QC` → `Toronto, ON`; one five-row pricing table and one glance; canonical title/metadata and self URLs; approved facts preserved | **A — Canonical** |
| `/toronto-to-montreal-movers/` | `generate-spa-routes.mjs`; declared and actual `react-spa`; pair finalizer `finalize-montreal-toronto-routes.mjs` | 1 section, 1 heading, 9 visible Q&A, 1 FAQPage × 9, exact answer/order parity | 1/1/9/1×9, exact parity, `runtimeChanged=false` | Playfair Display headings and Source Sans 3 body/forms; `Toronto, ON` → `Montreal, QC`; one five-row pricing table and one glance; canonical title/metadata and self URLs; approved facts preserved | **A — Canonical** |

Fresh global FAQ, title, and route-regression audits pass both directions. The current pair files are byte-identical to the Step 58 final snapshot. In an isolated copy, direct owner run 1, direct owner run 2, the FAQ finalizer, and title normalizer each produced zero route and asset drift. Therefore Montreal ↔ Toronto moved cleanly from D/D to A/A.

Comparing `STEP_57_FINAL_WORKSPACE.json` with the current baseline finds exactly these two changed route files and zero changed assets. Thus Step 58 improved exactly the intended pair and caused **no indirect improvement or regression** elsewhere.

## 3. Remaining B routes

Every prior B route is byte-identical to its Step 57 audited state, so each defect was re-confirmed as current rather than assumed resolved.

| Route | Previous class | Current class | Remaining defect |
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

Neither material route changed in Step 58 and neither defect was fixed indirectly.

| Route | Owner | Actual render architecture | Exact material defect | Still material? | Indirectly fixed? |
| --- | --- | --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | `checked-in-static-route-source` with `finalize-montreal-calgary-routes.mjs` | Static route; other title, FAQ, form, pricing, navigation, and chat contracts settle canonically | Duplicate Route-at-a-Glance presentation creates a material structural mismatch | **Yes** | No |
| `/bc-to-washington-movers/` | `generate-spa-routes.mjs` | React SPA; rendered contracts settle correctly | Legacy pricing presentation plus raw canonical and `og:url` pointing to the homepage | **Yes** | No |

## 5. Remaining D routes

All three remaining D routes are owned by `generate-spa-routes.mjs` and actually render through the declared React-SPA architecture. Each raw document has one FAQ shell and one FAQPage but no visible Q&A; browser execution supplies and reconciles the visible FAQ.

| Route | Owner | Raw FAQ section / heading / visible / FAQPage | Raw canonical? | Rendered canonical? | Repair still needed? |
| --- | --- | --- | --- | --- | --- |
| `/edmonton-to-vancouver-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×9; parity fails 0/9 | No | Yes, exact 9/9 | **Yes** |
| `/montreal-to-edmonton-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×8; parity fails 0/8 | No | Yes, exact 12/12 | **Yes** |
| `/montreal-to-victoria-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×12; parity fails 0/12 | No | Yes, exact 12/12 | **Yes** |

Montreal → Edmonton additionally retains a stale raw eight-entry schema that the browser changes to twelve. No portion of any remaining raw-source defect was corrected indirectly.

## 6. Exact defect by route

| Route(s) | Class | Defect type(s) |
| --- | --- | --- |
| Calgary ↔ Halifax | B/B | responsive behavior, navigation |
| Edmonton → Montreal | B | terminology, responsive behavior, navigation |
| Edmonton ↔ Winnipeg | B/B | terminology |
| Halifax → Vancouver | B | metadata, source durability |
| Vancouver → Edmonton | B | terminology |
| Vancouver ↔ Winnipeg | B/B | body font, typography |
| Victoria → Montreal | B | responsive behavior, navigation |
| Victoria → Ottawa | B | responsive behavior, navigation |
| Calgary → Montreal | C | Route at a Glance, material structural mismatch |
| BC → Washington | C | pricing presentation, metadata, source durability, material structural mismatch |
| Edmonton → Vancouver | D | FAQ source durability, source durability |
| Montreal → Edmonton | D | FAQ source durability, FAQ wording/parity, metadata, source durability |
| Montreal → Victoria | D | FAQ source durability, metadata, source durability |

No remaining route is classified for form defaults, spacing/width, stale promotion, contamination, or chatbot defects.

## 7. Raw title results

- Raw `<title>` canonical: **56/56**.
- Raw `og:title` canonical and equal to `<title>`: **56/56**.
- Raw `twitter:title` canonical and equal to `<title>`: **56/56**.
- The exact brand suffix occurs once per route.

## 8. Rendered title results

- Browser-rendered title contracts: **56/56 canonical**.
- No lifecycle overwrite or page error affected the settled result.

## 9. Raw FAQ canonical count

- One raw FAQ section: **56/56**.
- One raw FAQ heading: **56/56**.
- One raw FAQPage: **56/56**.
- Complete raw visible/schema parity with at least one visible Q&A: **53/56**.
- Raw-source failures: **3/56**, exactly the D routes in section 5.

## 10. Rendered FAQ canonical count

- Browser-rendered canonical FAQ: **56/56**.
- Every settled route has one FAQ section, one heading, one FAQPage, and exact visible/schema answer and order parity.

## 11. `.pcm-local-seo` / `undefined` / contamination checks

- Raw visible `.pcm-local-seo` elements: **0/56 routes affected**. Script-string references are not visible elements.
- Rendered `.pcm-local-seo` elements: **0/56 routes affected**.
- Unintended visible `undefined`: **0/56 routes affected**.
- Soft-404 signatures: **0/56 routes affected**.
- Homepage-body contamination: **0/56 routes affected**.
- Raw homepage canonical/OG contamination remains on exactly three routes: `/bc-to-washington-movers/`, `/montreal-to-edmonton-movers/`, and `/montreal-to-victoria-movers/`; rendering corrects these URLs.
- The legacy `Moving Cost Breakdown` token remains in raw runtime/normalizer source text on seven route documents, but is not a settled visible heading. The material legacy pricing presentation is confined to BC → Washington.

## 12. Source-durability findings

In the isolated direct-owner audit, `generate-spa-routes.mjs` run 1, owner run 2, the global FAQ finalizer, and title normalizer each caused **0/56 route changes and 0/104 asset changes**. The owner is deterministic but preserves incomplete route-specific raw output. The global FAQ finalizer cannot synthesize absent visible cards, so browser runtime remains a downstream repair dependency.

| Route | Deterministic owner? | Raw owner incomplete? | Finalizer required? | Mutable route dependency? | Build-order dependency? | Durable repair writer |
| --- | --- | --- | --- | --- | --- | --- |
| Edmonton → Vancouver | Yes | Yes: 0 visible vs 9 schema | Yes | Yes | Yes | `finalize-vancouver-edmonton-routes.mjs` |
| Montreal → Edmonton | Yes | Yes: 0 visible vs stale 8 schema, rendered 12/12 | Yes | Yes | Yes | `finalize-montreal-edmonton-routes.mjs` |
| Montreal → Victoria | Yes | Yes: 0 visible vs 12 schema | Yes | Yes | Yes | `finalize-montreal-victoria-routes.mjs` |

The named route/pair finalizers are the appropriate durable source locations. The compiled React runtime plus each route normalizer currently performs the downstream repair; the global FAQ finalizer is downstream but ineffective for absent raw cards.

## 13. Pair/unpaired rollup

| Pair / direction | Route A | Route B | Overall class | Primary defect |
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
| Montreal ↔ Toronto | A | A | complete | None |
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

No missing reverse route was created or assumed.

## 14. Exact current A/B/C/D counts

- **A — Canonical: 40/56**.
- **B — Minor cleanup: 11/56**.
- **C — Material: 2/56**.
- **D — Architecture/source: 3/56**.
- Total: **56/56**.

Relative to Step 57, Montreal → Toronto and Toronto → Montreal each moved D → A. Every other registered route is byte-identical to the Step 57 final snapshot, so no other route improved or regressed indirectly.

## 15. Exact current pair counts

Among 27 bidirectional pairs:

- **18 complete**.
- **5 minor cleanup**.
- **1 material**.
- **3 source repair**.

Among two legitimate unpaired directions, Victoria → Vancouver is complete and BC → Washington is material. Combined across all 29 pair/direction groups: **19 complete, 5 minor cleanup, 2 material, and 3 source repair**.

## 16. Ranked remaining queue

1. **Edmonton ↔ Vancouver** — D/B; repair Edmonton → Vancouver raw FAQ/source and address the companion terminology defect through the clear pair finalizer.
2. **Edmonton ↔ Montreal** — B/D; Montreal → Edmonton also has stale raw schema and homepage metadata, while the companion has terminology/nav cleanup.
3. **Montreal ↔ Victoria** — D/B; source repair plus a separate companion mobile-nav defect.
4. **Calgary ↔ Montreal** — C/A; material duplicate-glance standardization.
5. **BC → Washington** — C unpaired; legacy pricing and raw metadata durability with broader presentation risk.
6. **Edmonton ↔ Winnipeg** — B/B; narrow terminology cleanup.
7. **Halifax ↔ Vancouver** — B/A; direction-scoped raw canonical cleanup.
8. **Calgary ↔ Halifax** — B/B; pair-local mobile Escape behavior.
9. **Ottawa ↔ Victoria** — A/B; direction-scoped ARIA/Escape behavior.
10. **Vancouver ↔ Winnipeg** — B/B; pair-owned body-font cleanup.

Ranking applies route-scoped D issues first, then materiality, business/SEO importance, defect severity, owner/source clarity, regression risk, and likelihood of first-pass aggregate stability. It is not chronological.

## 17. Recommended Step 60 target

**Edmonton ↔ Vancouver**.

## 18. Why Step 60 target is next

- Edmonton → Vancouver is definitely still D: its raw FAQ has 0 visible answers versus 9 schema entries, while rendering repairs it to exact 9/9 parity.
- The corridor is a registered, commercially important bidirectional pair; no route creation is required.
- Ownership and the durable repair chain are clear: `generate-spa-routes.mjs` plus the dedicated `finalize-vancouver-edmonton-routes.mjs` writer.
- The source repair is narrow and route-scoped, with no need to alter shared infrastructure.
- The reverse direction has one small terminology defect that can be handled within the same deterministic pair step.
- Direct-owner, finalizer, and both aggregate passes are byte-stable, giving a low-risk convergence baseline.

## 19. Ownership/tests

- Ownership/architecture validator: **PASS** — 56 registered routes, 56 owners, zero collisions.
- Ownership, title, and chatbot-pricing tests: **35/35 PASS**.
- Syntax checks: **123/123 current `.mjs` files PASS**.
- Global raw/browser title contracts: **56/56 PASS**.
- Global rendered FAQ contracts: **56/56 PASS**.

## 20. Browser regression

- Attempted: **52 unique registered routes/directions**.
- Passed: **52/52**.
- Failed: **0**.
- Montreal ↔ Toronto was included exactly once per direction and both passed.
- Victoria → Vancouver was represented once as the legitimate unpaired direction; nonexistent Vancouver → Victoria was not added.

## 21. First aggregate result

A fresh temporary Git clone was overlaid with the current working-tree `site-copy`, `tools`, and package manifest. The registered aggregate route build then ran once in that clone.

- Route drift: **0/56**.
- Asset drift: **0/104**.

Required first-pass convergence passed. No Step 59A reconciliation is needed.

## 22. Second aggregate result

- Second pass versus first: **0/56 route drift** and **0/104 asset drift**.
- Second pass versus the isolated clone baseline: **0/56 route drift** and **0/104 asset drift**.

## 23. Read-only workspace verification

The final post-report `STEP_59_FINAL_WORKSPACE.json` comparison against `STEP_59_BASELINE.json` found:

- **0/56 route changes**.
- **0/104 asset changes**.

Only this report and Step 59 evidence JSON files were created. All owner, finalizer, and aggregate mutations ran in temporary clones. No production/source file was modified.

## 24. Remaining known issues

- Three SPA-owned routes remain D because raw output lacks visible FAQ Q&A and depends on browser execution plus mutable preserved output.
- Two routes remain C: Calgary → Montreal and BC → Washington.
- Eleven routes remain B with the typography, terminology, metadata, or mobile-navigation defects listed above.
- Raw homepage canonical/OG contamination remains on BC → Washington, Montreal → Edmonton, and Montreal → Victoria.
- No ownership, collision, title, rendered FAQ, aggregate, soft-404, visible `.pcm-local-seo`, visible `undefined`, or homepage-body contamination defect appeared.
- No deployment occurred. Step 60 was not started.

Step 59 cleanup-queue refresh is complete. No route cleanup was performed.

Recommended Step 60 target: **Edmonton ↔ Vancouver**.
