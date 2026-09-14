# Step 69 — Final minor-cleanup queue refresh

Scope: read-only refresh of the 56 registered route pages after Step 68. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, shared runtime, or production/source file was modified. No deployment occurred and Step 70 was not started. `STEP_69_*.json` and `STEP_69_B_ROUTE_AUDIT.mjs` are audit evidence only.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Exactly one full-page owner per route: **56/56**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- `STEP_69_BASELINE.json` records the pre-audit SHA-256 hashes of all 56 routes and all 104 assets.
- The working tree was already materially dirty before Step 69. All pre-existing changes were preserved.

## 2. Step 68 BC → Washington verification

`/bc-to-washington-movers/` remains **A — Canonical**.

- Owner/render: `generate-spa-routes.mjs`; declared and actual `react-spa`.
- Durable chain: preserved route HTML plus the checked-in compiled SPA route component, FAQ finalizer, title normalizer, and existing conversion runtime.
- Raw FAQ: one section, one heading, one FAQPage, exact visible/schema parity.
- Settled FAQ: one section, one heading, one FAQPage, exact parity.
- Title: raw and settled title/OG/Twitter fields agree and carry one brand suffix.
- Form: one form settling to `British Columbia` → `Washington State`.
- Pricing: one five-row USD estimate table headed `BC to Washington State Moving Costs`; no legacy breakdown or duplicate pricing.
- Facts: one route-at-a-glance block; scoped `~250 km` BC-to-Seattle/Bellevue qualifier and existing 24–48-hour/3–7-day service windows preserved.
- Typography: Playfair Display headings, Source Sans 3 body/forms/buttons; settled H1 is `48px / 60px / 700` desktop and `36px / 45px / 700` mobile.
- Navigation/chatbot: one navigation family and one chatbot; mobile menu state passes `false → true → false` and Escape closure; chatbot opens on desktop/mobile.
- No horizontal overflow, homepage replacement, soft 404, contamination, unintended `undefined`, application page error, or reverse-route link.
- `/washington-to-bc-movers/` remains absent from the registered route inventory and no reverse route was created.
- The fresh aggregate's clean first pass confirms source durability and order-independent canonicalization.

One restricted-network external-resource console message was observed, matching Step 68; it did not originate from application JavaScript or affect content, layout, or interactions.

## 3. Current B routes

| Route | Previous Class | Current Class | Exact Remaining Defect |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | B — Minor cleanup | B — Minor cleanup | Mobile menu remains open after Escape; `aria-expanded` remains `true` |
| `/halifax-to-calgary-movers/` | B — Minor cleanup | B — Minor cleanup | Mobile menu remains open after Escape; `aria-expanded` remains `true` |
| `/edmonton-to-winnipeg-movers/` | B — Minor cleanup | B — Minor cleanup | One settled visible `fully insured` claim remains |
| `/winnipeg-to-edmonton-movers/` | B — Minor cleanup | B — Minor cleanup | One settled visible `fully insured` claim remains |
| `/halifax-to-vancouver-movers/` | B — Minor cleanup | B — Minor cleanup | Raw canonical points to `/vancouver-to-halifax-movers/`; raw `og:url` and settled URLs are directionally correct |
| `/vancouver-to-winnipeg-movers/` | B — Minor cleanup | B — Minor cleanup | Computed body font remains `Inter, Arial, sans-serif` |
| `/winnipeg-to-vancouver-movers/` | B — Minor cleanup | B — Minor cleanup | Computed body font remains `Inter, Arial, sans-serif` |
| `/victoria-to-ottawa-movers/` | B — Minor cleanup | B — Minor cleanup | Mobile trigger has no `aria-expanded`; Escape leaves the menu open |

All eight prior B routes still genuinely require cleanup.

## 4. Any B routes promoted to A

None. Every prior B defect reproduced in the current source/browser state.

## 5. Any route reclassified C or D

None. No B route has a material component/structure defect, and no ownership, mutable cross-route source, or build-order-only canonicalization defect was found. Current C = **0** and D = **0**.

## 6. Exact minor defect by route

| Route | Exact Defect | Owner | Render | Expected Fix Scope |
| --- | --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | Navigation/responsive behavior: Escape does not close the opened mobile menu or reset ARIA | `generate-halifax-calgary-route-pages.mjs` | static | Pair-local mobile keyboard/menu bridge |
| `/halifax-to-calgary-movers/` | Navigation/responsive behavior: same reproducible Escape/ARIA defect | `generate-halifax-calgary-route-pages.mjs` | static | Pair-local mobile keyboard/menu bridge |
| `/edmonton-to-winnipeg-movers/` | Terminology: one visible `fully insured` occurrence | `rebuild-edmonton-winnipeg-routes.mjs` | static | Pair-template protection terminology only |
| `/winnipeg-to-edmonton-movers/` | Terminology: one visible `fully insured` occurrence | `rebuild-edmonton-winnipeg-routes.mjs` | static | Pair-template protection terminology only |
| `/halifax-to-vancouver-movers/` | Metadata/minor source durability: reverse-direction raw canonical | `rebuild-halifax-vancouver-routes.mjs` | static | Direction-scoped canonical-generation match only |
| `/vancouver-to-winnipeg-movers/` | Body font/typography: Inter instead of Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | static | Pair-owned typography declaration/template or scoped asset |
| `/winnipeg-to-vancouver-movers/` | Body font/typography: Inter instead of Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | static | Pair-owned typography declaration/template or scoped asset |
| `/victoria-to-ottawa-movers/` | Navigation/responsive behavior: missing trigger ARIA state and broken Escape closure | `rebuild-victoria-ottawa-route.mjs` | static | Direction-scoped owner-emitted menu accessibility behavior |

No pricing-scroll, spacing, width, quote-panel, glance, FAQ, form-default, CTA, chatbot, contamination, stale-promotion, or route-creation defect was found among the B routes.

## 7. Typography findings

Computed desktop/mobile values were measured after settlement for every B route.

| Route group | Headings | Body | FAQ answer / pricing / form / button | H1 desktop | H1 mobile |
| --- | --- | --- | --- | --- | --- |
| Calgary ↔ Halifax | Playfair Display | Source Sans 3 | Source Sans 3 | `48 / 60 / 700` | `36 / 45 / 700` |
| Edmonton ↔ Winnipeg | Playfair Display | Source Sans 3 | Source Sans 3 | `48 / 60 / 700` | `36 / 45 / 700` |
| Halifax → Vancouver | Playfair Display | Source Sans 3 | Source Sans 3 | `48 / 60 / 700` | `36 / 45 / 700` |
| Vancouver ↔ Winnipeg | Playfair Display | **Inter** | Source Sans 3 | `48 / 60 / 700` | `36 / 45 / 700` |
| Victoria → Ottawa | Playfair Display | Source Sans 3 | Source Sans 3 | `48 / 60 / 700` | `36 / 45 / 700` |

FAQ question headings use Playfair Display and FAQ answers use Source Sans 3. All eight pricing tables use an `overflow-x: auto` container on the 390px viewport (container width 290px or 318px; table scroll width 760px), with no document-level horizontal overflow. Vancouver ↔ Winnipeg's defect is therefore limited to the body-family declaration; forms, buttons, FAQ answers, and pricing tables already use Source Sans 3.

## 8. Component-count findings

The following counts were identical at `1280 × 900` and `390 × 844` for each B route:

| Route | H1 | Quote panel | Primary form | Pricing section | Pricing table | Glance | FAQ section | FAQ heading | FAQPage | Footer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/calgary-to-halifax-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/halifax-to-calgary-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/edmonton-to-winnipeg-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/winnipeg-to-edmonton-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/halifax-to-vancouver-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/vancouver-to-winnipeg-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/winnipeg-to-vancouver-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `/victoria-to-ottawa-movers/` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

No B route requires C-level structural reclassification.

## 9. Raw title results

- Raw `<title>` canonical: **56/56**.
- Raw `og:title` canonical and equal to title: **56/56**.
- Raw `twitter:title` canonical and equal to title: **56/56**.
- One exact brand suffix and no field disagreement: **56/56**.

The Halifax → Vancouver raw canonical-URL defect is separate from the title-text contract.

## 10. Rendered title results

- Settled browser title contract: **56/56 canonical/evaluable**.
- No runtime overwrite, generic title, duplicated brand suffix, OG/Twitter disagreement, or page error.

## 11. Raw FAQ results

- One visible FAQ section: **56/56**.
- One FAQ heading: **56/56**.
- One FAQPage: **56/56**.
- At least one visible answer and exact visible/schema question-answer-order parity: **56/56**.

## 12. Rendered FAQ results

- Settled browser FAQ contract: **56/56 canonical**.
- One section, one heading, one FAQPage, visible answers, and exact parity/order: **56/56**.
- BC → Washington retains the already documented pre-settlement React commit, then is singular and stable by the settled audit; this is not a build-order or durable-source defect.

## 13. Global contamination/duplicate results

- Visible `.pcm-local-seo`: **0/56 raw, 0/56 rendered**.
- Unintended visible `undefined`: **0/56 raw, 0/56 rendered**.
- Legacy `Moving Cost Breakdown`: **0/56 raw, 0/56 rendered**.
- Duplicate Route at a Glance: **0/56 rendered**; all routes have exactly one.
- Duplicate pricing blocks/tables: **0/56 rendered**; all routes have exactly one pricing table.
- Duplicate FAQ: **0/56 raw, 0/56 settled**.
- Homepage contamination: **0/56 rendered**.
- Soft-404 signatures: **0/56 rendered**.
- Expired-promotion text: **0/56 raw-visible** and no rendered browser finding.

## 14. Source-durability findings

| Route group | Full-page owner and durable template/data | Route-scoped layer | Shared dependencies | Conclusion |
| --- | --- | --- | --- | --- |
| Calgary ↔ Halifax | `generate-halifax-calgary-route-pages.mjs`; checked-in direction-specific outputs plus explicit route data in the owner | Owner-emitted metadata/menu bridge | Bootstrap stripper, FAQ finalizer, title normalizer, conversion runtime | First-pass stable; pair-local navigation fix is possible without ownership change |
| Edmonton ↔ Winnipeg | `rebuild-edmonton-winnipeg-routes.mjs`; two explicit templates plus `edmonton-winnipeg-route-data.mjs` | Step 34 pair CSS/JS | FAQ/title finalizers, static nav/chat | Deterministic pair owner; terminology can be fixed in the pair templates/source |
| Halifax ↔ Vancouver | `rebuild-halifax-vancouver-routes.mjs`; explicit hydration-static reference template and owner-held directional facts | Step 43 CSS/JS | FAQ/title finalizers, conversion runtime, static nav/chat | Regex misses the Halifax-direction raw canonical because an intervening attribute remains; narrow owner fix, not D |
| Vancouver ↔ Winnipeg | `rebuild-winnipeg-modern-routes.mjs`; two explicit templates plus `vancouver-winnipeg-route-data.mjs` | Step 40 CSS/JS | FAQ/title finalizers, conversion runtime, static nav/chat | Deterministic pair owner; body font can be corrected without architecture change |
| Ottawa ↔ Victoria | `rebuild-victoria-ottawa-route.mjs`; Victoria direction rendered from its owner template path and Ottawa direction from `templates/victoria-ottawa-routes` | Owner-emitted navigation behavior | FAQ/title finalizers and existing runtime | Deterministic pair owner; direction-scoped ARIA/Escape fix is possible |

Every B route has an explicit full-page owner, render declaration, FAQ/title finalizers, and bounded runtime dependencies. No owner consumes another mutable generated route as its required source, no ownership change is needed, and both isolated aggregate passes are byte-stable.

## 15. Pair/unpaired rollup

| Pair / Direction | Direction 1 | Direction 2 | Overall Class | Primary Defect |
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
| Edmonton ↔ Winnipeg | B | B | minor cleanup | `fully insured` terminology |
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
| Unpaired BC → Washington | A | — | complete | None |
| Unpaired Victoria → Vancouver | A | — | complete | None |

No reverse route was inferred or created.

## 16. Exact current A/B/C/D counts

- **A — Canonical: 48/56**.
- **B — Minor cleanup: 8/56**.
- **C — Material: 0/56**.
- **D — Architecture/source: 0/56**.
- Total: **56/56**.

## 17. Exact current pair counts

Among 27 bidirectional pairs:

- **22 complete**.
- **5 minor cleanup**.
- **0 material**.
- **0 source repair**.

Both legitimate unpaired directions are complete. Combined across all 29 pair/direction groups: **24 complete, 5 minor cleanup, 0 material, 0 source repair**.

## 18. Ranked final minor-cleanup queue

1. **Edmonton ↔ Winnipeg** — B/B; user-visible protection terminology on both directions, high pair efficiency, explicit templates/data, low-risk deterministic owner.
2. **Halifax ↔ Vancouver** — B/A; direction-scoped raw canonical error with direct SEO significance and a narrow, clear generator match.
3. **Calgary ↔ Halifax** — B/B; reproducible keyboard accessibility/navigation defect on both directions with pair-local ownership.
4. **Ottawa ↔ Victoria** — A/B; the same accessibility family but only Victoria → Ottawa remains affected.
5. **Vancouver ↔ Winnipeg** — B/B; obvious computed body-font mismatch, pair-owned and narrow, but lower semantic/SEO severity than terminology, metadata, or navigation defects.

The ranking applies business/SEO importance, visible severity, defect count, pair efficiency, owner clarity, route-scoped fixability, regression risk, aggregate stability, and the ability to promote both directions in one step.

## 19. Recommended Step 70 target

**Edmonton ↔ Winnipeg**.

## 20. Why Step 70 target is next

- Both directions definitely remain B and reproduce exactly one visible `fully insured` occurrence each.
- The wording is user-visible protection terminology and is more consequential than a cosmetic body-font mismatch.
- One pair-scoped cleanup can promote two routes to A.
- Ownership is explicit and low risk: two checked-in pair templates, frozen route data, and one dedicated deterministic generator.
- The fix requires no route creation, ownership change, or shared-infrastructure edit.
- The current source chain is clean on the first and second aggregate passes, giving a high likelihood of a clean post-fix aggregate.

## 21. Ownership/tests

- Ownership/architecture validator: **PASS** — 56 routes, 56 owners, zero collisions.
- Ownership, title-normalizer, and chatbot-pricing tests: **36/36 PASS**.
- Global title audit: **56/56 PASS**.
- Global FAQ audit: **56/56 PASS**.

## 22. Syntax

- Current `.mjs` files under `tools`: **128**.
- Syntax passes: **128/128**.
- Syntax failures: **0**.
- The audit-only root script `STEP_69_B_ROUTE_AUDIT.mjs` also passes `node --check`; it is outside the production `tools` count.

## 23. Browser regression

- Attempted: **54** deduplicated routes.
- Passed: **54/54**.
- Failed: **0**.
- Special-case handling: the current established suite omits Toronto ↔ Victoria from this deduplicated list; both directions remain covered by the 56-route global title, FAQ, contamination/structure, and queue audits. The suite includes BC → Washington and the legitimate unpaired Victoria → Vancouver direction and does not invent Washington → BC or Vancouver → Victoria.

## 24. Aggregate pass 1

A fresh no-hardlink temporary Git clone was overlaid with the exact current `site-copy`, `tools`, and package manifest before hashing and running the aggregate once.

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed. Step 69A reconciliation is not required.

## 25. Aggregate pass 2

The aggregate was run again in the same qualifying clone.

- **0/56 route drift**.
- **0/104 asset drift**.

## 26. Read-only workspace verification

`STEP_69_FINAL_WORKSPACE.json` compared with `STEP_69_BASELINE.json`:

- Registered route HTML changes: **0/56**.
- Asset changes: **0/104**.

Only Step 69 report/evidence files were created. No production/source file was modified, no deployment occurred, and Step 70 was not begun.

## 27. Remaining known issues

Eight B routes remain: Calgary ↔ Halifax mobile Escape/ARIA behavior; Edmonton ↔ Winnipeg protection terminology; Halifax → Vancouver raw canonical metadata; Vancouver ↔ Winnipeg body font; and Victoria → Ottawa mobile ARIA/Escape behavior. C and D remain zero.

Step 69 final minor-cleanup queue refresh is complete. No route cleanup was performed.

Recommended Step 70 target: **Edmonton ↔ Winnipeg**.
