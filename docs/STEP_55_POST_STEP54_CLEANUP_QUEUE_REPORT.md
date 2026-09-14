# Step 55 — Post-Step-54 cleanup-queue refresh

Scope: read-only audit and prioritization of the 56 registered route pages after Step 54. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, or shared runtime was modified. No deployment occurred and Step 56 was not started.

## 1. Current 56-route baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Full-page ownership: **56/56 exactly one owner each**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- The pre-audit SHA-256 baseline covered all 56 route HTML files and all 104 assets.
- The working tree was already materially dirty before Step 55. This audit preserved those pre-existing changes.

## 2. Step 54 Calgary ↔ Toronto verification

Both Step 54 directions remain **A — Canonical**.

| Route | Owner | Raw FAQ | Rendered FAQ | Typography | Forms | Pricing / glance | Metadata | Source durability | Current class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/calgary-to-toronto-movers/` | `generate-spa-routes.mjs` | 1 section, 1 heading, 11 visible Q&A, 1 FAQPage, exact 11/11 parity | Exact 11/11 parity | Playfair Display heading; Source Sans 3 body/FAQ/forms | `Calgary, AB` → `Toronto, ON` | One five-row table; one glance | Canonical title fields, self canonical and OG URL | Pair finalizer writes durable visible FAQ; global FAQ finalizer changes 0 bytes | **A — Canonical** |
| `/toronto-to-calgary-movers/` | `generate-spa-routes.mjs` | 1 section, 1 heading, 9 visible Q&A, 1 FAQPage, exact 9/9 parity | Exact 9/9 parity | Playfair Display heading; Source Sans 3 body/FAQ/forms | `Toronto, ON` → `Calgary, AB` | One five-row table; one glance | Canonical title fields, self canonical and OG URL | Pair finalizer writes durable visible FAQ; global FAQ finalizer changes 0 bytes | **A — Canonical** |

Both routes also passed desktop/mobile overflow and control checks, navigation including mobile Escape closure, chatbot open/close, route facts, contamination checks, and the deduplicated regression suite. Step 54 changed only these two route files and no asset; comparison of `STEP_54_BEFORE.json` with `STEP_54_FINAL.json` proves every other registered route and all assets remained byte-identical. No side effect or indirect improvement was found.

## 3. Remaining B routes

All eleven Step 53 B routes remain byte-identical to the Step 53 state and retain their specific defects.

| Route | Step 53 status | Current status | Remaining defect |
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

The current 52-route regression still passes because it checks route identity, title branding, settled form values, pricing presence, navigation/chat presence, body integrity, `.pcm-local-seo`, and `undefined`; the narrower B defects above remain outside that broad pass/fail contract.

## 4. Remaining C routes

| Route | Owner | Current structure | Exact material defect | Indirectly corrected? | Still material? |
| --- | --- | --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | `checked-in-static-route-source` with `finalize-montreal-calgary-routes.mjs` | Static route with otherwise canonical title, FAQ, forms, pricing, nav and chat | Duplicate Route-at-a-Glance presentation creates a material structural mismatch | No; route and assets are byte-identical to Step 53 | **Yes** |
| `/bc-to-washington-movers/` | `generate-spa-routes.mjs` | React-SPA route; rendered contracts settle correctly | Legacy pricing presentation plus raw canonical and `og:url` pointing to the homepage rather than the route | No; route and assets are byte-identical to Step 53 | **Yes** |

## 5. Remaining D routes

All seven remaining D routes are owned by `generate-spa-routes.mjs`. Each raw document has one FAQ shell and schema but no visible Q&A. Browser execution supplies the visible FAQ and reconciles parity.

| Route | Owner | Raw FAQ section / heading / visible / FAQPage entries | Raw canonical? | Rendered canonical? | Repair still needed? |
| --- | --- | --- | --- | --- | --- |
| `/edmonton-to-toronto-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×12 | No | Yes, 12/12 | **Yes** |
| `/toronto-to-edmonton-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×12 | No | Yes, 12/12 | **Yes** |
| `/edmonton-to-vancouver-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×9 | No | Yes, 9/9 | **Yes** |
| `/montreal-to-edmonton-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×8 | No | Yes, 12/12 | **Yes** |
| `/montreal-to-toronto-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×12 | No | Yes, 12/12 | **Yes** |
| `/toronto-to-montreal-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×9 | No | Yes, 9/9 | **Yes** |
| `/montreal-to-victoria-movers/` | `generate-spa-routes.mjs` | 1 / 1 / 0 / 1×12 | No | Yes, 12/12 | **Yes** |

Montreal → Edmonton additionally carries a stale raw schema count of 8 that the browser changes to 12. None of these issues was indirectly corrected.

## 6. Exact defect by route

| Route(s) | Class | Defect type(s) |
| --- | --- | --- |
| Calgary ↔ Halifax | B | responsive behavior, nav |
| Edmonton → Montreal | B | terminology, responsive behavior, nav |
| Edmonton ↔ Winnipeg | B/B | terminology |
| Halifax → Vancouver | B | metadata, source durability |
| Vancouver → Edmonton | B | terminology |
| Vancouver ↔ Winnipeg | B/B | body font, typography |
| Victoria → Montreal | B | responsive behavior, nav |
| Victoria → Ottawa | B | responsive behavior, nav |
| Calgary → Montreal | C | glance, material structural mismatch |
| BC → Washington | C | pricing presentation, metadata, source durability, material structural mismatch |
| Edmonton ↔ Toronto | D/D | FAQ source durability, source durability |
| Edmonton → Vancouver | D | FAQ source durability, source durability |
| Montreal → Edmonton | D | FAQ source durability, FAQ wording/parity, metadata, source durability |
| Montreal ↔ Toronto | D/D | FAQ source durability, source durability |
| Montreal → Victoria | D | FAQ source durability, metadata, source durability |

No remaining route is classified for form defaults, spacing/width, stale promotion, contamination, or chatbot defects. Nav defects are limited to the B routes listed above.

## 7. Raw title results

- Raw `<title>` canonical: **56/56**.
- Raw `og:title` canonical: **56/56**.
- Raw `twitter:title` canonical: **56/56**.
- The three title fields agree per route and contain the exact brand suffix once.

## 8. Rendered title results

- Browser-rendered title contracts: **56/56 canonical**.
- No title lifecycle overwrite or page error affected the result.

## 9. Raw FAQ canonical count

- One raw FAQ section: **56/56**.
- One raw FAQ heading: **56/56**.
- One raw `FAQPage`: **56/56**.
- Complete raw visible/schema parity with at least one visible Q&A: **49/56**.
- Raw-source failures: **7/56**, exactly the D routes in section 5.

## 10. Rendered FAQ canonical count

- Browser-rendered canonical FAQ: **56/56**.
- Every settled route has one FAQ section, one heading, one FAQPage, and exact visible/schema answer and order parity.

## 11. `.pcm-local-seo` / `undefined` / contamination checks

- Raw visible `.pcm-local-seo` elements: **0/56 routes affected**. String references inside scripts are not counted as visible elements.
- Rendered `.pcm-local-seo` elements: **0/56 routes affected**.
- Unintended visible `undefined`: **0/56 routes affected**.
- Soft-404 signatures: **0/56 routes affected**.
- Raw homepage canonical/OG contamination remains on exactly three routes: `/bc-to-washington-movers/`, `/montreal-to-edmonton-movers/`, and `/montreal-to-victoria-movers/`. Browser rendering corrects these URLs.
- No new homepage body contamination appeared.

## 12. Source-durability findings

The isolated direct-owner chain produced 0 route and 0 asset drift after owner run 1, owner run 2, and the global FAQ finalizer. The owner is deterministic but preserves incomplete route-specific raw output; the FAQ finalizer is ineffective for absent visible cards. The repairing browser layer is the compiled React runtime plus each route/pair inline normalizer. The durable source repair belongs in the named route post-processor.

| Route(s) | Deterministic owner? | Incomplete raw output? | Global FAQ finalizer required/effective? | Mutable/build-order dependency? | Exact durable repair location |
| --- | --- | --- | --- | --- | --- |
| Edmonton ↔ Toronto | Yes | Yes | No; 0-byte change | Yes / Yes | `finalize-toronto-edmonton-routes.mjs` |
| Montreal ↔ Toronto | Yes | Yes | No; 0-byte change | Yes / Yes | `finalize-montreal-toronto-routes.mjs` |
| Edmonton → Vancouver | Yes | Yes | No; 0-byte change | Yes / Yes | `finalize-vancouver-edmonton-routes.mjs` |
| Montreal → Edmonton | Yes | Yes, including stale 8-entry schema | No; 0-byte change | Yes / Yes | `finalize-montreal-edmonton-routes.mjs` |
| Montreal → Victoria | Yes | Yes | No; 0-byte change | Yes / Yes | `finalize-montreal-victoria-routes.mjs` |

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
| Edmonton ↔ Toronto | D | D | source repair | Raw visible FAQ absent |
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

- **A — Canonical: 36/56**.
- **B — Minor cleanup: 11/56**.
- **C — Material: 2/56**.
- **D — Architecture/source: 7/56**.
- Total: **56/56**.

The only class movement since Step 53 is Calgary → Toronto and Toronto → Calgary, each D → A. No other route improved or regressed indirectly.

## 15. Exact current pair counts

Among 27 bidirectional pairs:

- **16 complete**.
- **5 minor cleanup**.
- **1 material**.
- **5 source repair**.

Among the two legitimate unpaired directions: Victoria → Vancouver is complete and BC → Washington is material. Combined across all 29 pair/direction groups: **17 complete, 5 minor cleanup, 2 material, and 5 source repair**.

## 16. Ranked remaining queue

1. **Edmonton ↔ Toronto** — D/D; two high-value directions, one clear pair finalizer, narrow raw FAQ repair.
2. **Montreal ↔ Toronto** — D/D; two high-value directions with the same narrow source defect.
3. **Edmonton ↔ Vancouver** — D/B; repair Edmonton → Vancouver source first, then companion terminology.
4. **Edmonton ↔ Montreal** — B/D; Montreal → Edmonton also has stale raw schema and homepage metadata.
5. **Montreal ↔ Victoria** — D/B; source repair plus a separate companion mobile-nav defect.
6. **Calgary ↔ Montreal** — C/A; material duplicate-glance standardization.
7. **BC → Washington** — C unpaired; legacy pricing and raw metadata durability, with broader presentation risk.
8. **Edmonton ↔ Winnipeg** — B/B; narrow terminology cleanup.
9. **Halifax ↔ Vancouver** — B/A; direction-scoped raw canonical cleanup.
10. **Calgary ↔ Halifax** — B/B; pair-local mobile Escape behavior.
11. **Ottawa ↔ Victoria** — A/B; direction-scoped ARIA/Escape behavior.
12. **Vancouver ↔ Winnipeg** — B/B; pair-owned body-font cleanup.

Ranking prioritizes source-level durability, materiality, business importance, regression risk, route-scoped fixability, owner clarity, and likelihood of first-pass aggregate stability.

## 17. Recommended Step 56 target

**Edmonton ↔ Toronto**.

## 18. Why Step 56 target is next

- Both directions are still D, so one pair-scoped step can remove two of the seven highest-priority source issues.
- The corridor is commercially important and both directions are already registered; no route creation is needed.
- Ownership is clear and collision-free: `generate-spa-routes.mjs` with the dedicated `finalize-toronto-edmonton-routes.mjs` post-processor.
- The defect is exact and reproducible: 0 raw visible Q&A versus canonical 12/12 rendered output in each direction.
- The current browser runtime already exposes the authoritative question/answer set, enabling a narrow deterministic source repair without global infrastructure changes.
- Two direct-owner runs, the FAQ-finalizer check, and both aggregate passes are byte-stable, giving the pair a low-risk convergence baseline.

## 19. Ownership/tests

- Ownership/architecture validator: **PASS**, 56 routes, 56 owners, zero collisions.
- Ownership, title, and chatbot-pricing tests: **35/35 PASS**.
- Syntax checks: **122/122 `.mjs` files PASS**.
- Global raw/browser title contracts: **56/56 PASS**.
- Global browser FAQ contracts: **56/56 PASS**.

## 20. Browser regression

- Attempted: **52 unique registered routes/directions**.
- Passed: **52/52**.
- Failed: **0**.
- Both Calgary ↔ Toronto directions are present exactly once and passed.
- Victoria → Vancouver remains represented once as the valid unpaired direction; nonexistent Vancouver → Victoria was not added.

## 21. First aggregate result

A fresh temporary Git clone was overlaid with the current working-tree `site-copy`, `tools`, and package manifest, then the registered aggregate route build ran once.

- Route drift: **0/56**.
- Asset drift: **0/104**.

Required convergence passed. No Step 55A reconciliation is needed.

## 22. Second aggregate result

- Second pass versus first: **0/56 route drift**.
- Asset drift: **0/104**.

## 23. Read-only workspace verification

Post-audit SHA-256 comparison against `STEP_55_BASELINE.json` found:

- **0/56 route changes**.
- **0/104 asset changes**.

Only this report and Step 55 JSON evidence files were created in the working tree. All owner, finalizer, and aggregate mutations occurred in temporary clones.

## 24. Remaining known issues

- Seven SPA-owned routes remain D because raw output lacks visible FAQ Q&A and depends on browser execution plus mutable preserved output.
- Two routes remain C: Calgary → Montreal and BC → Washington.
- Eleven routes remain B with the typography, terminology, metadata, or mobile-navigation defects listed above.
- Raw homepage canonical/OG contamination remains on BC → Washington, Montreal → Edmonton, and Montreal → Victoria.
- No new ownership, collision, title, rendered FAQ, aggregate, soft-404, `.pcm-local-seo`, visible `undefined`, or contamination defect appeared.
- No deployment occurred. Step 56 was not started.

Step 55 cleanup-queue refresh is complete. No route cleanup was performed.

Recommended Step 56 target: **Edmonton ↔ Toronto**.
