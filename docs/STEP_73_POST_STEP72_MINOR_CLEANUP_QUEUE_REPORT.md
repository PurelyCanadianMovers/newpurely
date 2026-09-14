# Step 73 — Post-Step-72 minor-cleanup queue refresh

Scope: read-only re-audit of the current 56 registered route pages after Step 72. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, shared runtime, or production/source file was modified. No deployment occurred and Step 74 was not started. `STEP_73_*.json` and `STEP_73_NAV_AUDIT.mjs` are audit evidence only.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Exactly one full-page owner per route: **56/56**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- `STEP_73_BASELINE.json` records pre-audit SHA-256 hashes for all 56 routes and all 104 assets.
- The working tree was already materially dirty; all pre-existing changes were preserved.

## 2. Step 72 Halifax ↔ Vancouver verification

Both routes remain **A — Canonical**.

| Route | Owner | Render | Current class |
| --- | --- | --- | --- |
| `/halifax-to-vancouver-movers/` | `rebuild-halifax-vancouver-routes.mjs` | static | A — Canonical |
| `/vancouver-to-halifax-movers/` | `rebuild-halifax-vancouver-routes.mjs` | static | A — Canonical |

Each direction has the correct owner output, route-specific H1, directional form defaults, raw canonical and `og:url`, canonical title/OG/Twitter title, one five-row pricing table, one Route at a Glance, one FAQ section/heading/FAQPage with exact parity/order, and no legacy terminology or contamination. Headings compute to Playfair Display; body, forms, pricing, FAQ, buttons, and CTA compute to Source Sans 3. H1 metrics are 48px / 60px / 700 desktop and 36px / 45px / 700 mobile. Mobile pricing scroll is internal and there is no document overflow.

At initial DOM, 1.2 seconds, and 5.4 seconds, identity, metadata, forms, component counts, and FAQ parity remained stable. Desktop navigation and chatbot work; mobile menu state is false → true → false on Escape. The current owner plus FAQ/title processors remained byte-idempotent through two complete aggregate passes. The only browser console entry was the expected restricted-environment external-resource error; no page/application exception occurred.

## 3. Remaining B routes

| Route | Step 71 class | Current class | Exact remaining defect |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | B — Minor cleanup | B — Minor cleanup | Open mobile menu ignores Escape and `aria-expanded` remains `true` |
| `/halifax-to-calgary-movers/` | B — Minor cleanup | B — Minor cleanup | Open mobile menu ignores Escape and `aria-expanded` remains `true` |
| `/vancouver-to-winnipeg-movers/` | B — Minor cleanup | B — Minor cleanup | Computed body font is `Inter, Arial, sans-serif` |
| `/winnipeg-to-vancouver-movers/` | B — Minor cleanup | B — Minor cleanup | Computed body font is `Inter, Arial, sans-serif` |
| `/victoria-to-ottawa-movers/` | B — Minor cleanup | B — Minor cleanup | Mobile trigger has no `aria-expanded`; Escape leaves the menu open |

## 4. Any routes promoted to A

The Step 71 B route corrected in Step 72 is independently confirmed as A:

- `/halifax-to-vancouver-movers/`

`/vancouver-to-halifax-movers/` was already A and remains A. No other Step 71 B route improved indirectly.

## 5. Confirmation C remains zero or not

**C remains 0.** Every current B route has the full canonical component set, correct route identity and forms, one pricing table, one Route at a Glance, one FAQ architecture, working ownership, and no material runtime failure or contamination. No missing/duplicate major component, material structural mismatch, broken identity, or materially wrong pricing architecture was found.

## 6. Confirmation D remains zero or not

**D remains 0.** Raw FAQ is canonical 56/56, rendered FAQ is canonical 56/56, ownership is 56/56 with zero collisions, every declared owner/dependency exists, and the ownership validator found no source-owner or build-order contradiction. The bounded owner/source models are reproducible, and two isolated aggregate passes were byte-stable. No cross-route mutable output or downstream repair is required to create missing canonical architecture.

## 7. Exact remaining defect by route

| Route | Exact minor defect | Owner | Render | Expected fix scope |
| --- | --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | Navigation/responsive: Escape does not close the visible mobile dialog and does not reset `aria-expanded` | `generate-halifax-calgary-route-pages.mjs` | static | Pair-local keyboard/menu behavior in the owner-emitted route shell |
| `/halifax-to-calgary-movers/` | Navigation/responsive: identical Escape/ARIA failure | `generate-halifax-calgary-route-pages.mjs` | static | Same pair-local owner correction |
| `/vancouver-to-winnipeg-movers/` | Body font/typography: body computes to Inter instead of Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | static | Pair template or route-scoped typography declaration |
| `/winnipeg-to-vancouver-movers/` | Body font/typography: body computes to Inter instead of Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | static | Same pair-owned typography correction |
| `/victoria-to-ottawa-movers/` | Navigation/responsive: trigger omits `aria-expanded`; Escape leaves visible menu open | `rebuild-victoria-ottawa-route.mjs` | static | Direction-scoped accessible mobile-menu state/keyboard handling |

No current B route has a remaining H1-size, spacing, width, quote-panel, pricing, pricing-scroll, Route-at-a-Glance, metadata, form-default, FAQ, terminology, stale-promotion, related-destination, CTA, chatbot, contamination, or material source-durability defect.

## 8. Typography findings

All five B routes use Playfair Display headings and canonical H1 metrics: **48px / 60px / 700 desktop** and **36px / 45px / 700 mobile**. Calgary ↔ Halifax and Victoria → Ottawa use Source Sans 3 for body, forms, pricing, FAQ answers, and buttons/CTA. Vancouver ↔ Winnipeg alone computes the body as **Inter, Arial, sans-serif** on desktop and mobile; its form controls, pricing, FAQ answers, and buttons already compute to Source Sans 3. All five routes have internal mobile pricing scroll and no document-level overflow.

## 9. Component-count findings

Desktop and mobile counts are identical.

| Route | H1 | Quote | Form | Pricing | Table | Glance | FAQ section | FAQ heading | FAQPage | Footer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/calgary-to-halifax-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/halifax-to-calgary-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/vancouver-to-winnipeg-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/winnipeg-to-vancouver-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/victoria-to-ottawa-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

No B route requires C-level structural reclassification.

## 10. Raw title results

- Raw `<title>`: **56/56 canonical**.
- Raw `og:title`: **56/56 canonical and equal to title**.
- Raw `twitter:title`: **56/56 canonical and equal to title**.
- Exactly one terminal brand suffix: **56/56**.

## 11. Rendered title results

- Settled browser title contract: **56/56 canonical**.
- Page/application errors: **0/56**.
- No runtime overwrite, generic title, duplicate brand suffix, or title-field disagreement was found.

## 12. Raw FAQ results

- One FAQ section: **56/56**.
- One FAQ heading: **56/56**.
- One FAQPage entity: **56/56**.
- Exact visible/schema parity and order: **56/56**.
- Raw `.pcm-local-seo`: **0/56**.

## 13. Rendered FAQ results

- One settled FAQ section: **56/56**.
- One settled FAQ heading: **56/56**.
- One settled FAQPage entity: **56/56**.
- Exact settled visible/schema parity and order: **56/56**.
- Rendered `.pcm-local-seo`: **0/56**.
- Three pages (`/calgary-to-vancouver-movers/`, `/ottawa-to-victoria-movers/`, and `/vancouver-to-calgary-movers/`) underwent expected pre-settlement normalization; all settled singular, canonical, and error-free. This does not create a source/build-order defect.

## 14. Global contamination/duplicate results

| Check | Raw | Rendered |
| --- | ---: | ---: |
| `.pcm-local-seo` present | 0/56 | 0/56 |
| Unintended visible `undefined` | 0/56 | 0/56 |
| Legacy `Moving Cost Breakdown` | 0/56 | 0/56 |
| Duplicate Route at a Glance | Not uniformly meaningful before runtime | 0/56; every settled route has exactly one |
| Duplicate pricing | Not uniformly meaningful before runtime | 0/56; every settled route has exactly one table |
| Duplicate FAQ heading/FAQPage | 0/56 | 0/56 |
| Homepage contamination | 0/56 visible raw | 0/56 |
| Soft-404 signature | 0/56 visible raw | 0/56 |
| Expired promotion text | 0/56 | 0/56 |

The rendered sweep recorded zero page errors. Step 72 introduced no global contamination or duplicate regression.

## 15. Source-durability findings

| Group | Full-page owner and durable source | Route data | Route-scoped runtime/finalizers | Conclusion |
| --- | --- | --- | --- | --- |
| Calgary ↔ Halifax | `generate-halifax-calgary-route-pages.mjs`; checked-in direction-specific route snapshots | Frozen shared facts plus two explicit directional records in owner | `strip-unsupported-route-bootstrap.mjs`, FAQ finalizer, title normalizer, conversion runtime | Pair-local navigation fix; no ownership change |
| Vancouver ↔ Winnipeg | `rebuild-winnipeg-modern-routes.mjs`; two explicit templates under `tools/templates/winnipeg-routes/` | `vancouver-winnipeg-route-data.mjs` | Step 40 assets, static nav/chat, FAQ finalizer, title normalizer, conversion runtime | Pair-owned typography fix; no ownership change |
| Ottawa ↔ Victoria | `rebuild-victoria-ottawa-route.mjs`; standardized source template plus explicit reverse template | Directional facts held in owner | Conversion runtime, FAQ finalizer, title normalizer | Victoria direction accessibility fix; no ownership change |

Each B route has one declared owner and bounded dependencies. The defect in every case is fixable without ownership changes or shared-infrastructure redesign.

## 16. Pair/unpaired rollup

| Pair / direction | Direction 1 class | Direction 2 class | Overall class | Primary defect |
| --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | complete | None |
| Calgary ↔ Halifax | B | B | minor cleanup | Mobile Escape/ARIA behavior |
| Calgary ↔ Montreal | A | A | complete | None |
| Calgary ↔ Ottawa | A | A | complete | None |
| Calgary ↔ Toronto | A | A | complete | None |
| Calgary ↔ Vancouver | A | A | complete | None |
| Calgary ↔ Winnipeg | A | A | complete | None |
| Edmonton ↔ Montreal | A | A | complete | None |
| Edmonton ↔ Ottawa | A | A | complete | None |
| Edmonton ↔ Toronto | A | A | complete | None |
| Edmonton ↔ Vancouver | A | A | complete | None |
| Edmonton ↔ Winnipeg | A | A | complete | None |
| Halifax ↔ Toronto | A | A | complete | None |
| Halifax ↔ Vancouver | A | A | complete | None; Step 72 remains stable |
| Montreal ↔ Toronto | A | A | complete | None |
| Montreal ↔ Vancouver | A | A | complete | None |
| Montreal ↔ Victoria | A | A | complete | None |
| Montreal ↔ Winnipeg | A | A | complete | None |
| Ottawa ↔ Toronto | A | A | complete | None |
| Ottawa ↔ Vancouver | A | A | complete | None |
| Ottawa ↔ Victoria | A | B | minor cleanup | Victoria → Ottawa ARIA/Escape behavior |
| Ottawa ↔ Winnipeg | A | A | complete | None |
| Seattle ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Victoria | A | A | complete | None |
| Toronto ↔ Winnipeg | A | A | complete | None |
| Vancouver ↔ Winnipeg | B | B | minor cleanup | Computed body font |
| Unpaired BC → Washington | A | — | complete | None |
| Unpaired Victoria → Vancouver | A | — | complete | None |

No missing reverse route was inferred or created. All remaining non-A routes belong to three registered bidirectional groups; there are no non-A unpaired directions.

## 17. Exact current A/B/C/D route counts

- **A — Canonical: 51/56**.
- **B — Minor cleanup: 5/56**.
- **C — Material: 0/56**.
- **D — Architecture/source: 0/56**.
- Total: **56/56**.

These values come from the current all-route title, FAQ, contamination, ownership, architecture, regression, and targeted component/interaction audits—not arithmetic from Step 72 alone.

## 18. Exact current group counts

Across 27 bidirectional pairs and two legitimate unpaired directions:

- **26 complete**.
- **3 minor cleanup**.
- **0 material**.
- **0 source repair**.

## 19. Ranked remaining cleanup queue

1. **Calgary ↔ Halifax** — B/B. Both directions reproduce the same user-visible keyboard-accessibility and ARIA-state failure. The pair has one clear owner and a narrow pair-local correction can promote two routes.
2. **Ottawa ↔ Victoria** — A/B. Victoria → Ottawa has the same accessibility family and a clear owner, but only one direction benefits.
3. **Vancouver ↔ Winnipeg** — B/B. Both directions have a precise body-font mismatch and explicit templates/data, but the defect is less severe than a broken keyboard interaction.

This ranking applies business/SEO importance, user-visible severity, defect count, pair efficiency, owner/source clarity, route-scoped fixability, regression risk, and expected first-pass aggregate stability.

## 20. Recommended Step 74 target

**Calgary ↔ Halifax**.

## 21. Why Step 74 target is next

- Both registered directions definitely remain B in the current browser audit.
- The failure is precise and reproducible: false → true → true after Escape, with the dialog still visible.
- Keyboard and ARIA-state behavior is a direct accessibility/user-interaction issue and is more consequential than the remaining typography mismatch.
- Both directions share the explicit owner `generate-halifax-calgary-route-pages.mjs`, so one bounded pair fix can promote two routes.
- No new route, ownership change, architecture repair, or shared-runtime redesign is required.
- Two aggregate passes are stable, making a narrow owner correction likely to preserve first-pass convergence.

## 22. Ownership/tests

- Ownership/architecture validator: **PASS** — 56 routes, 56 owners, zero collisions.
- Test files discovered: **3**.
- Ownership, architecture, title, pricing/chatbot, and related route tests: **36/36 passed**.
- Failures, skips, cancellations, and todos: **0**.

## 23. Syntax

- Current production tool modules: **128**.
- Passed: **128/128**.
- Failed: **0**.
- The Step 73 evidence-only navigation audit script is outside the production-tools count and executed successfully.

## 24. Browser regression

- Deduplicated routes attempted: **54**.
- Passed: **54/54**.
- Failed: **0**.

The established suite includes both Halifax ↔ Vancouver directions, both Vancouver ↔ Winnipeg directions, Calgary ↔ Halifax, Victoria → Ottawa, BC → Washington, and Victoria → Vancouver. It does not invent absent reverse routes.

## 25. Aggregate pass 1

A fresh no-hardlink Git clone was created at `tmp/step73-aggregate-clone-20260909-1429` and overlaid with the exact current `site-copy`, `tools`, and `package.json`. Its starting hashes matched the working baseline.

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed. Step 73A reconciliation is not required, and the Step 74 recommendation is eligible for a later step.

## 26. Aggregate pass 2

The aggregate build ran again in the same isolated clone.

- **0/56 route drift**.
- **0/104 asset drift**.
- Pass 1 and pass 2 match exactly.

## 27. Read-only workspace verification

`STEP_73_FINAL_WORKSPACE.json` compared with `STEP_73_BASELINE.json`:

- Registered route HTML changes: **0/56**.
- Asset changes: **0/104**.

Only Step 73 report/evidence files and the isolated temporary clone were created. No production/source file was modified and no deployment occurred.

## 28. Remaining known issues

Five B routes remain in three groups: Calgary ↔ Halifax mobile Escape/ARIA behavior; Vancouver ↔ Winnipeg computed body font; and Victoria → Ottawa mobile ARIA/Escape behavior. C and D remain zero. Step 72 promoted Halifax → Vancouver to A, left Vancouver → Halifax at A, caused no indirect promotion, and introduced no regression.

Step 73 minor-cleanup queue refresh is complete. No route cleanup was performed.

Recommended Step 74 target: **Calgary ↔ Halifax**.
