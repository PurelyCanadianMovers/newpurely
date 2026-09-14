# Step 75 — Post-Step-74 minor-cleanup queue refresh

Scope: read-only re-audit of the current 56 registered route pages after Step 74. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, shared runtime, or other production/source file was modified. No deployment occurred and Step 76 was not started. STEP_75_*.json and STEP_75_*.mjs are audit evidence only.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Exactly one full-page owner per route: **56/56**.
- Ownership collisions: **0**.
- Current files under site-copy/assets: **104**.
- STEP_75_BASELINE.json records pre-audit SHA-256 hashes for all 56 routes and all 104 assets.
- The working tree was already materially dirty. All pre-existing user changes were preserved.

## 2. Step 74 Calgary ↔ Halifax verification

Both routes remain **A — Canonical**.

| Route | Owner | Render | Current class |
| --- | --- | --- | --- |
| /calgary-to-halifax-movers/ | generate-halifax-calgary-route-pages.mjs | static | A — Canonical |
| /halifax-to-calgary-movers/ | generate-halifax-calgary-route-pages.mjs | static | A — Canonical |

At 390 × 844, each direction began with aria-expanded="false", opened with aria-expanded="true", closed on Escape with aria-expanded="false", returned focus to the Open menu button, and repeated this sequence successfully for **5/5 cycles**. The panel was not left visible and body overflow returned to its initial value. At 1280 × 900, the Services dropdown toggled false → true → false and its Local Moving link changed hidden → visible → hidden; the mobile trigger did not leak into the desktop layout.

Both routes retained one H1, quote panel, primary form, pricing section/table, Route at a Glance, FAQ section/heading/FAQPage, and footer. Directional form defaults, title/FAQ contracts, Source Sans 3 body typography, Playfair Display H1 typography, desktop layout, chatbot open/close, and route identity remained stable. STEP_75_BASELINE.json and STEP_75_FINAL_WORKSPACE.json prove that neither route changed during Step 75.

## 3. Remaining B routes

| Route | Step 73 class | Current class | Exact remaining defect |
| --- | --- | --- | --- |
| /vancouver-to-winnipeg-movers/ | B — Minor cleanup | B — Minor cleanup | Body computes to Inter instead of Source Sans 3; the mobile FAQ question heading retains the legacy Georgia fallback instead of Playfair Display |
| /winnipeg-to-vancouver-movers/ | B — Minor cleanup | B — Minor cleanup | Same pair-owned body-font and mobile FAQ-question typography mismatch |
| /victoria-to-ottawa-movers/ | B — Minor cleanup | B — Minor cleanup | Mobile trigger has no aria-expanded; Escape leaves the menu open and focus on Close menu |

Calgary ↔ Halifax was excluded from this remaining-B list only after its current A/A state was independently verified.

## 4. Any routes promoted to A

The two Step 73 B routes corrected by Step 74 are independently confirmed as A:

- /calgary-to-halifax-movers/
- /halifax-to-calgary-movers/

No other Step 73 B route improved indirectly. No A route regressed.

## 5. Confirmation C remains zero or not

**C remains 0.** Every current B route has the full canonical component set, correct route identity and directional form defaults, one pricing table, one Route at a Glance, one FAQ architecture, working ownership, and no material runtime failure or contamination. No current non-A route has a missing/duplicate major component, material structural mismatch, broken identity, materially incorrect pricing architecture, serious content contamination, or runtime failure.

## 6. Confirmation D remains zero or not

**D remains 0.** Raw FAQ is canonical 56/56, rendered FAQ is canonical 56/56, ownership is 56/56 with zero collisions, every declared owner is bounded, and the ownership/architecture validator reports no source-owner contradiction. Two isolated aggregate passes are byte-stable. No mutable generated-route dependency, build-order-only canonicalization defect, or downstream repair is required to create missing core FAQ architecture.

## 7. Exact remaining defect by route

| Route | Exact minor defect | Owner | Render | Expected fix scope |
| --- | --- | --- | --- | --- |
| /vancouver-to-winnipeg-movers/ | Body font/typography: body is Inter, Arial, sans-serif instead of Source Sans 3; mobile FAQ question heading computes to Georgia rather than Playfair Display | rebuild-winnipeg-modern-routes.mjs | static | Pair templates and/or pair-scoped step40 stylesheet; no shared asset or ownership change |
| /winnipeg-to-vancouver-movers/ | Same body-font and mobile FAQ-question typography mismatch | rebuild-winnipeg-modern-routes.mjs | static | Same pair-owned typography correction |
| /victoria-to-ottawa-movers/ | Navigation/responsive: mobile menu trigger omits aria-expanded; Escape leaves the visible panel open and focus on Close menu through repeated cycles | rebuild-victoria-ottawa-route.mjs | static | Direction-scoped controller emitted by the declared owner; no shared-runtime or ownership change |

No current B route has a remaining H1-size, spacing, width, quote-panel, pricing presentation, pricing-scroll, Route-at-a-Glance, metadata, form-default, FAQ wording/parity, terminology, stale-promotion, related-destination, CTA, chatbot, contamination, or material source-durability defect.

## 8. Typography findings

All three current B routes use Playfair Display for H1 and canonical H1 metrics:

- Desktop: **48px / 60px / 700**.
- Mobile: **36px / 45px / 700**.

Victoria → Ottawa uses Source Sans 3 for body, forms, pricing, FAQ answers, buttons, and CTA, and Playfair Display for its FAQ question heading.

Vancouver ↔ Winnipeg uses Source Sans 3 for form controls, pricing, FAQ answers, buttons, and CTA. The exact remaining pair mismatch is:

- body: **Inter, Arial, sans-serif** on desktop and mobile;
- FAQ question heading: Playfair Display on desktop but **Georgia, "Times New Roman", serif** on mobile.

The second observation is consistent with the legacy Georgia declarations still present in the pair templates and a pair-scoped selector that does not retain the Playfair override for the settled mobile FAQ node.

Both Vancouver ↔ Winnipeg directions have internal mobile pricing scroll (318px client width / 760px scroll width). Victoria → Ottawa also has internal mobile pricing scroll (290px / 760px). No B route has document-level horizontal overflow.

## 9. Interaction findings

| Route/group | Mobile menu | Desktop dropdown | Chatbot | Layering/scroll |
| --- | --- | --- | --- | --- |
| Calgary ↔ Halifax verification | 5/5 cycles per route: false → true → false on Escape; focus returns | false → true → false on click; link visibility tracks state | Open/close passes | No stuck panel, overlay, body state, or nav/chat overlap |
| Vancouver ↔ Winnipeg | 5/5 cycles per route close correctly on Escape with focus return | false → true → false on click | Open/close passes | No layering conflict; body horizontal overflow guard remains stable |
| Victoria → Ottawa | Trigger aria-expanded is absent; Escape leaves panel visible and focus on Close menu in 5/5 observed cycles | false → true → false on click | Open/close passes | No document overflow or chatbot conflict; failure is isolated to mobile nav state/keyboard behavior |

Only issues actually observed are classified. Desktop Escape was not used as a canonical close requirement; click-toggle behavior was verified directly.

## 10. Component-count findings

Desktop and mobile counts are identical for the current B routes.

| Route | H1 | Quote | Form | Pricing | Table | Glance | FAQ section | FAQ heading | FAQPage | Footer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| /vancouver-to-winnipeg-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| /winnipeg-to-vancouver-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| /victoria-to-ottawa-movers/ | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

No current B route requires C-level structural reclassification.

## 11. Raw title results

- Raw title: **56/56 canonical**.
- Raw og:title: **56/56 canonical and equal to title**.
- Raw twitter:title: **56/56 canonical and equal to title**.
- Exactly one terminal brand suffix: **56/56**.

## 12. Rendered title results

- Settled browser title contract: **56/56 canonical**.
- Page/application errors: **0/56**.
- No runtime overwrite, generic title, duplicate brand suffix, or title-field disagreement was found.

## 13. Raw FAQ results

- One FAQ section: **56/56**.
- One FAQ heading: **56/56**.
- One FAQPage entity: **56/56**.
- Exact visible/schema parity and order: **56/56**.
- Raw pcm-local-seo blocks: **0/56**.

## 14. Rendered FAQ results

- One settled FAQ section: **56/56**.
- One settled FAQ heading: **56/56**.
- One settled FAQPage entity: **56/56**.
- Exact settled visible/schema parity and order: **56/56**.
- Rendered pcm-local-seo: **0/56**.
- Page/application errors: **0/56**.

The separate 5.5-second contamination probe observed transient pre-settlement duplicates on Edmonton → Toronto, Edmonton → Vancouver, and Montreal → Edmonton. The authoritative 9-second FAQ audit and a separate 10-second settled global audit both resolved all three to singular canonical state. These are expected normalization transitions, not current defects.

## 15. Global contamination/duplicate results

The settled 10-second browser sweep covered all 56 routes.

| Check | Actual |
| --- | ---: |
| pcm-local-seo present | 0/56 |
| Unintended visible undefined | 0/56 |
| Legacy Moving Cost Breakdown | 0/56 |
| Duplicate Route at a Glance | 0/56 |
| Duplicate visible pricing table | 0/56 |
| Duplicate FAQ heading | 0/56 |
| Duplicate FAQPage | 0/56 |
| Homepage contamination | 0/56 |
| Soft-404 signature | 0/56 |
| Expired promotion text | 0/56 |
| Page/application errors | 0/56 |

Step 74 caused no indirect contamination, duplicate, title, FAQ, or runtime regression.

## 16. Source-durability findings

| Group | Full-page owner and durable source | Route data | Route-scoped finalizers/runtime | Conclusion |
| --- | --- | --- | --- | --- |
| Vancouver ↔ Winnipeg | rebuild-winnipeg-modern-routes.mjs; two explicit templates under tools/templates/winnipeg-routes | vancouver-winnipeg-route-data.mjs | FAQ finalizer, title normalizer, conversion runtime, pair-scoped Step 40 assets, static nav/chat | Pair-owned typography correction; no ownership change |
| Ottawa ↔ Victoria | rebuild-victoria-ottawa-route.mjs; standardized source template plus explicit tools/templates/victoria-ottawa-routes/ottawa-to-victoria-movers.html | Explicit directional facts in the owner | FAQ finalizer, title normalizer, conversion runtime; owner-emitted static navigation | Victoria-direction accessible mobile-menu correction; no ownership change |

Each B route has one declared full-page owner and bounded dependencies. The remaining defects are narrowly fixable without route creation, ownership changes, shared-infrastructure redesign, or a new downstream repair.

## 17. Pair/unpaired rollup

| Pair / direction | Direction 1 class | Direction 2 class | Overall class | Primary defect |
| --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | complete | None |
| Calgary ↔ Halifax | A | A | complete | None; Step 74 remains stable |
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
| Halifax ↔ Vancouver | A | A | complete | None |
| Montreal ↔ Toronto | A | A | complete | None |
| Montreal ↔ Vancouver | A | A | complete | None |
| Montreal ↔ Victoria | A | A | complete | None |
| Montreal ↔ Winnipeg | A | A | complete | None |
| Ottawa ↔ Toronto | A | A | complete | None |
| Ottawa ↔ Vancouver | A | A | complete | None |
| Ottawa ↔ Victoria | A | B | minor cleanup | Victoria → Ottawa mobile ARIA/Escape behavior |
| Ottawa ↔ Winnipeg | A | A | complete | None |
| Seattle ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Victoria | A | A | complete | None |
| Toronto ↔ Winnipeg | A | A | complete | None |
| Vancouver ↔ Winnipeg | B | B | minor cleanup | Body and mobile FAQ-question typography |
| Unpaired BC → Washington | A | — | complete | None |
| Unpaired Victoria → Vancouver | A | — | complete | None |

No missing reverse route was inferred or created. All remaining non-A routes belong to two registered bidirectional groups; there are no non-A unpaired directions.

## 18. Exact current A/B/C/D route counts

- **A — Canonical: 53/56**.
- **B — Minor cleanup: 3/56**.
- **C — Material: 0/56**.
- **D — Architecture/source: 0/56**.
- Total: **56/56**.

These values come from the current all-route title, FAQ, contamination, ownership, architecture, regression, targeted component, typography, and interaction audits—not arithmetic from Step 74.

## 19. Exact current group counts

Across 27 bidirectional pairs and two legitimate unpaired directions:

- **27 complete**.
- **2 minor cleanup**.
- **0 material**.
- **0 source repair**.

## 20. Ranked remaining cleanup queue

1. **Ottawa ↔ Victoria** — A/B. Victoria → Ottawa has a reproducible keyboard-accessibility and ARIA-state failure. The pair owner is explicit and the correction can be direction-scoped without shared-runtime risk.
2. **Vancouver ↔ Winnipeg** — B/B. Both directions have a precise pair-owned typography mismatch and can likely be promoted together, but the user impact is lower than a broken mobile keyboard interaction.

The ranking applies business/SEO importance, user-visible severity, defect count, pair efficiency, owner/source clarity, route-scoped fixability, regression risk, and expected first-pass aggregate stability.

## 21. Recommended Step 76 target

**Ottawa ↔ Victoria**, specifically the remaining B direction **/victoria-to-ottawa-movers/**.

## 22. Why Step 76 target is next

- Victoria → Ottawa definitely remains B in the current 390 × 844 browser audit.
- The failure is precise and reproducible through 5/5 cycles: aria-expanded is absent and Escape leaves the menu open.
- Keyboard and ARIA behavior is a direct accessibility and interaction defect, more consequential than the remaining typography mismatch.
- Both directions have a single clear owner, rebuild-victoria-ottawa-route.mjs, and the fix can remain direction-scoped.
- No route creation, ownership change, FAQ/title repair, or shared-runtime redesign is required.
- Both aggregate passes are clean, so a narrow owner correction has a strong first-pass stability likelihood.

## 23. Ownership/tests

- Ownership/architecture validator: **PASS** — 56 routes, 56 owners, zero collisions.
- Test files discovered: **3**.
- Ownership, architecture, title, pricing/chatbot, and related route tests: **36/36 passed**.
- Failures, skips, cancellations, and todos: **0**.

## 24. Syntax

- Current production tool modules: **128**.
- Passed: **128/128**.
- Failed: **0**.
- Step 75 evidence-only scripts are outside the production-tools count.

## 25. Browser regression

- Deduplicated registered routes attempted: **54**.
- Passed: **54/54**.
- Failed: **0**.

The suite includes both Calgary ↔ Halifax directions, both Vancouver ↔ Winnipeg directions, Victoria → Ottawa, BC → Washington, and Victoria → Vancouver. It does not invent absent reverse routes.

## 26. Aggregate pass 1

A fresh no-hardlink Git clone was created at tmp/step75-aggregate-clone-20260909-090908 and overlaid with the exact current site-copy, tools, and package.json. Clone-baseline hashes matched the working baseline before generation.

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed. Step 75A reconciliation is not required, and the Step 76 recommendation is eligible for a later step.

## 27. Aggregate pass 2

- **0/56 route drift**.
- **0/104 asset drift**.
- Pass 2 matches pass 1 exactly.

## 28. Read-only workspace verification

STEP_75_FINAL_WORKSPACE.json compared with STEP_75_BASELINE.json:

- Registered route HTML changes: **0/56**.
- Asset changes: **0/104**.

Only Step 75 report/evidence files and the isolated temporary clone were created. No production/source file was modified and no deployment occurred.

## 29. Remaining known issues

Three B routes remain in two registered groups:

- Vancouver ↔ Winnipeg: body font remains Inter instead of Source Sans 3, and the settled mobile FAQ question heading retains the legacy Georgia fallback instead of Playfair Display.
- Victoria → Ottawa: mobile trigger lacks aria-expanded and Escape leaves the menu open.

C and D remain zero. Calgary ↔ Halifax remains A/A. Step 74 caused no indirect promotion beyond its intended pair and no indirect regression.

Step 75 minor-cleanup queue refresh is complete. No route cleanup was performed.

Recommended Step 76 target: **Ottawa ↔ Victoria**, specifically **/victoria-to-ottawa-movers/**.
