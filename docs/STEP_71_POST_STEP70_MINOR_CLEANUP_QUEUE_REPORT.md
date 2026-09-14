# Step 71 — Post-Step-70 minor-cleanup queue refresh

Scope: read-only re-audit of the current 56 registered route pages after Step 70. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, shared runtime, or production/source file was modified. No deployment occurred and Step 72 was not started. STEP_71_*.json and STEP_71_RENDERED_CONTAMINATION_AUDIT.mjs are audit evidence only.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Exactly one full-page owner per route: **56/56**.
- Ownership collisions: **0**.
- Current files under site-copy/assets: **104**.
- STEP_71_BASELINE.json records pre-audit SHA-256 hashes for all 56 routes and all 104 assets.
- The working tree was already materially dirty. All pre-existing changes were preserved.

## 2. Step 70 Edmonton ↔ Winnipeg verification

Both routes remain **A — Canonical**.

| Route | Owner | Render | Result |
| --- | --- | --- | --- |
| /edmonton-to-winnipeg-movers/ | rebuild-edmonton-winnipeg-routes.mjs | static | A — Canonical |
| /winnipeg-to-edmonton-movers/ | rebuild-edmonton-winnipeg-routes.mjs | static | A — Canonical |

Current verification found one H1, one quote form, one five-row pricing table, one Route at a Glance, one FAQ section/heading/FAQPage, and one footer on each route. Directional form defaults remain Edmonton, AB → Winnipeg, MB and Winnipeg, MB → Edmonton, AB. Raw and settled title/OG/Twitter titles agree; canonical and og:url are self-directional. FAQ visible/schema parity and order remain exact.

Typography remains Playfair Display for headings and Source Sans 3 for body, forms, pricing, FAQ answers, buttons, and CTA. H1 is 48px / 60px / 700 desktop and 36px / 45px / 700 mobile. Mobile pricing scroll is internal, there is no document overflow, desktop navigation and chatbot work, and mobile menu state settles false → true → false on Escape.

The Step 69 fully insured defect remains absent in raw and settled browser text. The pair runtime, FAQ finalizer, and title normalizer remain stable through the aggregate build. No source-durability, delayed-runtime, pricing, metadata, form, FAQ, navigation, chatbot, or contamination regression was found.

## 3. Remaining B routes

| Route | Step 69 Class | Current Class | Exact Remaining Defect |
| --- | --- | --- | --- |
| /calgary-to-halifax-movers/ | B — Minor cleanup | B — Minor cleanup | Mobile menu remains open after Escape and aria-expanded remains true |
| /halifax-to-calgary-movers/ | B — Minor cleanup | B — Minor cleanup | Mobile menu remains open after Escape and aria-expanded remains true |
| /halifax-to-vancouver-movers/ | B — Minor cleanup | B — Minor cleanup | Raw canonical points to /vancouver-to-halifax-movers/ although og:url and route identity are directionally correct |
| /vancouver-to-winnipeg-movers/ | B — Minor cleanup | B — Minor cleanup | Computed body font remains Inter, Arial, sans-serif |
| /winnipeg-to-vancouver-movers/ | B — Minor cleanup | B — Minor cleanup | Computed body font remains Inter, Arial, sans-serif |
| /victoria-to-ottawa-movers/ | B — Minor cleanup | B — Minor cleanup | Mobile trigger has no aria-expanded state and Escape leaves the menu open |

## 4. Any routes promoted to A

The two Step 69 B routes corrected in Step 70 are now independently confirmed as A:

- /edmonton-to-winnipeg-movers/
- /winnipeg-to-edmonton-movers/

No other prior B route improved indirectly.

## 5. Confirmation C remains zero or not

**C remains 0.** Every remaining B route has all major canonical components, one copy of each required structural section, correct route identity, working ownership, a pricing table, Route at a Glance, FAQ architecture, navigation, and chatbot. No missing or duplicate major component, material structural mismatch, broken runtime ownership, materially wrong pricing architecture, or unresolved content contamination was found.

## 6. Confirmation D remains zero or not

**D remains 0.** Raw FAQ is canonical 56/56, rendered FAQ is canonical 56/56, ownership is 56/56 with zero collisions, and no source-owner mismatch, cross-route mutable generated-page dependency, build-order-only canonicalization defect, or downstream repair needed to create missing core FAQ architecture was found. Two isolated aggregate passes were byte-stable.

## 7. Exact remaining defect by route

| Route | Exact Minor Defect | Owner | Render | Expected Fix Scope |
| --- | --- | --- | --- | --- |
| /calgary-to-halifax-movers/ | Navigation/responsive: Escape does not close the open mobile menu or reset aria-expanded | generate-halifax-calgary-route-pages.mjs | static | Pair-local keyboard/menu bridge |
| /halifax-to-calgary-movers/ | Navigation/responsive: same reproducible Escape/ARIA defect | generate-halifax-calgary-route-pages.mjs | static | Pair-local keyboard/menu bridge |
| /halifax-to-vancouver-movers/ | Metadata/minor source durability: raw canonical identifies the reverse direction | rebuild-halifax-vancouver-routes.mjs | static | Direction-scoped canonical generation match |
| /vancouver-to-winnipeg-movers/ | Body font/typography: computed body remains Inter instead of Source Sans 3 | rebuild-winnipeg-modern-routes.mjs | static | Pair template or route-scoped typography declaration |
| /winnipeg-to-vancouver-movers/ | Body font/typography: computed body remains Inter instead of Source Sans 3 | rebuild-winnipeg-modern-routes.mjs | static | Pair template or route-scoped typography declaration |
| /victoria-to-ottawa-movers/ | Navigation/responsive: trigger lacks aria-expanded and Escape leaves the mobile menu open | rebuild-victoria-ottawa-route.mjs | static | Direction-scoped menu accessibility behavior |

No remaining B route has a spacing, width, quote-panel, pricing, pricing-scroll, Route-at-a-Glance, form-default, FAQ, terminology, stale-promotion, related-destination, CTA, chatbot, contamination, or material source-architecture defect.

## 8. Typography findings

All six current B routes use Playfair Display headings and have canonical H1 metrics: **48px / 60px / 700 desktop** and **36px / 45px / 700 mobile**. Calgary ↔ Halifax, Halifax → Vancouver, and Victoria → Ottawa use Source Sans 3 for body, forms, pricing, FAQ answers, buttons, and CTA. Vancouver ↔ Winnipeg alone computes the body as **Inter, Arial, sans-serif**; its form, pricing, FAQ-answer, and button text already compute to Source Sans 3. Every mobile pricing table scrolls inside its 290px or 318px wrapper with a 760px table and no document-level overflow.

## 9. Component-count findings

The counts below were identical at desktop and mobile sizes.

| Route | H1 | Quote | Form | Pricing | Table | Glance | FAQ section | FAQ heading | FAQPage | Footer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| /calgary-to-halifax-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| /halifax-to-calgary-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| /halifax-to-vancouver-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| /vancouver-to-winnipeg-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| /winnipeg-to-vancouver-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| /victoria-to-ottawa-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

No B route requires C-level structural reclassification.

## 10. Raw title results

- Raw title: **56/56 canonical**.
- Raw og:title: **56/56 canonical and equal to title**.
- Raw twitter:title: **56/56 canonical and equal to title**.
- Exactly one terminal brand suffix: **56/56**.

The Halifax → Vancouver canonical-URL defect is separate from the title-text contract.

## 11. Rendered title results

- Settled browser title contract: **56/56 canonical**.
- Page/runtime errors: **0/56**.
- No runtime overwrite, generic title, duplicated suffix, or title-field disagreement was found.

## 12. Raw FAQ results

- One FAQ section: **56/56**.
- One FAQ heading: **56/56**.
- One FAQPage entity: **56/56**.
- Exact visible/schema question-answer parity and order: **56/56**.
- Raw .pcm-local-seo count: **0/56**.

## 13. Rendered FAQ results

- One settled FAQ section: **56/56**.
- One settled FAQ heading: **56/56**.
- One settled FAQPage entity: **56/56**.
- Exact settled visible/schema parity and order: **56/56**.
- Rendered .pcm-local-seo count: **0/56**.
- Three pages experienced an expected pre-settlement DOM normalization, but all were singular, canonical, and stable at the settled measurement; this did not produce a durable-source or build-order defect.

## 14. Global contamination/duplicate results

| Check | Raw | Rendered |
| --- | ---: | ---: |
| .pcm-local-seo present | 0/56 | 0/56 |
| Unintended visible undefined | 0/56 | 0/56 |
| Legacy Moving Cost Breakdown | 0/56 | 0/56 |
| Duplicate Route at a Glance | — | 0/56; all 56 have exactly one |
| Duplicate pricing table | — | 0/56; all 56 have exactly one |
| Duplicate FAQ heading/FAQPage | 0/56 | 0/56 |
| Homepage contamination | — | 0/56 |
| Soft-404 signature | — | 0/56 |
| Expired promotion text | 0/56 | 0/56 |

The rendered sweep also found zero page errors. No Step 70 contamination or duplicate was introduced.

## 15. Source-durability findings

| Group | Durable owner/source | Route-specific layer | Shared dependencies | Conclusion |
| --- | --- | --- | --- | --- |
| Calgary ↔ Halifax | generate-halifax-calgary-route-pages.mjs; checked-in direction-specific source plus explicit route data | Owner-emitted menu behavior | Bootstrap stripper, FAQ finalizer, title normalizer, conversion runtime | Pair-local navigation fix; no ownership change |
| Halifax ↔ Vancouver | rebuild-halifax-vancouver-routes.mjs; explicit checked-in hydration-static reference plus owner-held directional facts | step43 CSS/JS and static nav/chat | FAQ/title finalizers and conversion runtime | Narrow owner canonical match; no ownership change |
| Vancouver ↔ Winnipeg | rebuild-winnipeg-modern-routes.mjs; two explicit templates plus vancouver-winnipeg-route-data.mjs | step40 CSS/JS | FAQ/title finalizers, conversion runtime, static nav/chat | Pair-owned typography fix; no ownership change |
| Ottawa ↔ Victoria | rebuild-victoria-ottawa-route.mjs; explicit templates/data for both registered directions | Owner-emitted mobile menu behavior | FAQ/title finalizers, static nav/chat | Direction-scoped accessibility fix; no ownership change |

Every current B route has one declared full-page owner and bounded post-process/runtime dependencies. No cross-route mutable generated output is required as a source, no ownership reassignment is needed, and the fresh aggregate converged on its first pass and remained stable on its second.

## 16. Pair/unpaired rollup

| Pair / Direction | Direction 1 Class | Direction 2 Class | Overall Class | Primary Defect |
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
| Edmonton ↔ Winnipeg | A | A | complete | None; Step 70 remains stable |
| Halifax ↔ Toronto | A | A | complete | None |
| Halifax ↔ Vancouver | B | A | minor cleanup | Halifax → Vancouver raw canonical |
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

No reverse route was inferred or created.

## 17. Exact current A/B/C/D route counts

- **A — Canonical: 50/56**.
- **B — Minor cleanup: 6/56**.
- **C — Material: 0/56**.
- **D — Architecture/source: 0/56**.
- Total: **56/56**.

These counts come from the current all-route and targeted browser/source audits, not arithmetic alone.

## 18. Exact current group counts

Across 27 bidirectional pairs and two legitimate unpaired directions:

- **25 complete**.
- **4 minor cleanup**.
- **0 material**.
- **0 source repair**.

## 19. Ranked remaining cleanup queue

1. **Halifax ↔ Vancouver** — B/A. The Halifax direction emits a reverse-direction raw canonical, giving the defect direct SEO significance. Ownership and the failing generator match are clear, and the fix is direction-scoped.
2. **Calgary ↔ Halifax** — B/B. Both directions reproduce the same keyboard-accessibility and ARIA state defect; a pair-local correction can promote two routes with low shared-runtime risk.
3. **Ottawa ↔ Victoria** — A/B. Victoria → Ottawa has the same accessibility family but only one direction remains affected.
4. **Vancouver ↔ Winnipeg** — B/B. Both routes have a clear computed body-font mismatch and a dedicated pair owner, but it is less severe than metadata or broken keyboard/ARIA behavior.

The ranking applies business/SEO importance, visible severity, defect count, pair efficiency, ownership clarity, route-scoped fixability, regression risk, and likelihood of first-pass aggregate stability.

## 20. Recommended Step 72 target

**Halifax ↔ Vancouver**, with the implementation narrowly correcting the Halifax → Vancouver raw canonical. Vancouver → Halifax must remain unchanged except for validation.

## 21. Why Step 72 target is next

- Halifax → Vancouver definitely remains B in the current source audit.
- Its raw canonical points at the reverse route, a precise search-indexing and route-identity defect.
- The route already has the correct H1, form defaults, og:url, content, components, typography, responsive behavior, navigation, and chatbot, so the fix can stay narrow.
- The full-page owner is explicit: rebuild-halifax-vancouver-routes.mjs.
- No route creation, ownership change, template redesign, or shared-infrastructure work is required.
- Both fresh aggregate passes are stable, making a route-scoped owner correction low risk.

## 22. Ownership/tests

- Ownership/architecture validator: **PASS** — 56 routes, 56 owners, zero collisions.
- Test files discovered: **3**.
- Ownership, architecture, title-normalizer, chatbot/pricing, and related route tests: **36/36 passed**.
- Failures, skips, cancellations, and todos: **0**.

## 23. Syntax

- Current tool modules syntax modules: **128**.
- Passed: **128/128**.
- Failed: **0**.
- The Step 71 evidence-only contamination audit script also passed node --check and is outside the production tools count.

## 24. Browser regression

- Deduplicated routes attempted: **54**.
- Passed: **54/54**.
- Failed: **0**.

The established suite includes both Edmonton ↔ Winnipeg directions, BC → Washington, and Victoria → Vancouver. It does not inflate the count by inventing absent reverse routes.

## 25. Aggregate pass 1

A fresh no-hardlink Git clone was created under tmp/step71-aggregate-clone-20260909 and overlaid with the exact current site-copy, tools, and package.json. Its starting hashes matched the working baseline: 0/56 route differences and 0/104 asset differences.

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed. Step 71A reconciliation is not required, and the Step 72 recommendation is eligible to proceed in a later step.

## 26. Aggregate pass 2

The aggregate build ran again in the same isolated clone.

- **0/56 route drift**.
- **0/104 asset drift**.

The first and second aggregate results also match each other exactly.

## 27. Read-only workspace verification

STEP_71_FINAL_WORKSPACE.json compared with STEP_71_BASELINE.json:

- Registered route HTML changes: **0/56**.
- Asset changes: **0/104**.

Only Step 71 report/evidence files were created. No production/source file was modified and no deployment occurred.

## 28. Remaining known issues

Six B routes remain in four groups: Calgary ↔ Halifax mobile Escape/ARIA behavior; Halifax → Vancouver reverse-direction raw canonical; Vancouver ↔ Winnipeg computed body font; and Victoria → Ottawa mobile ARIA/Escape behavior. C and D remain zero. Step 70 caused the intended promotion of Edmonton ↔ Winnipeg from B/B to A/A and caused no indirect improvement or regression elsewhere.

Step 71 minor-cleanup queue refresh is complete. No route cleanup was performed.

Recommended Step 72 target: **Halifax ↔ Vancouver**.
