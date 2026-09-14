# Step 78 — Vancouver ↔ Winnipeg final minor cleanup

Scope was limited to `/vancouver-to-winnipeg-movers/` and `/winnipeg-to-vancouver-movers/`. No deployment occurred and Step 79 was not started.

## 1. Step 77 defects confirmed

Step 77 classified both routes B — Minor cleanup. Its computed evidence showed `Inter, Arial, sans-serif` on `body` at desktop and mobile, and `Georgia, "Times New Roman", serif` on the mobile FAQ question at 16px / 24px / 700. The required body family is `"Source Sans 3", Arial, sans-serif`; the required FAQ display family is `"Playfair Display", Georgia, serif`. A focused selector audit also confirmed the brief's mobile FAQ section-heading defect: the H2 was Georgia at the otherwise-canonical 30px / 36px / 700. No spacing defect was identified.

| Route | Step 77 Class | Body-Font Defect | Mobile FAQ-Heading Defect | Responsible Source |
| --- | --- | --- | --- | --- |
| Vancouver → Winnipeg | B — Minor cleanup | Inter rather than Source Sans 3 | FAQ H2: Georgia, 30px/36px/700; FAQ H3: Georgia, 16px/24px/700 | Explicit route template plus `step40-vancouver-winnipeg.css` |
| Winnipeg → Vancouver | B — Minor cleanup | Same | Same | Same pair-owned source |

## 2. Files changed

Production/source changes are limited to the two route HTML files, their two explicit templates, and `site-copy/assets/step40-vancouver-winnipeg.css`. This report and `STEP_78_*` evidence files were also added. The registered owner, route data, pair JavaScript, shared assets, and unrelated route HTML were not edited.

## 3. Ownership/render architecture

Both routes retain the sole full-page owner `rebuild-winnipeg-modern-routes.mjs`, owner type `full-page-generator`, declared render `static`, and actual render `static`. The durable inputs are the two explicit templates and `vancouver-winnipeg-route-data.mjs`. Route-scoped runtime is `step40-vancouver-winnipeg.css/js`; shared runtime is `conversion-boost.css/js`, `static-nav.css/js`, and `static-chat.css/js`. Post-processors remain `finalize-route-faq-architecture.mjs` and `normalize-route-title-metadata.mjs`. Declared and actual architecture agree.

## 4. Durable typography source

The legacy body declaration lived in both explicit templates. The computed FAQ defect came from the pair stylesheet's non-final heading-family cascade after runtime normalization adds `.pcm-route-faq-static`. Both routes share the same cause. The templates now declare Source Sans 3, and the route-scoped stylesheet explicitly owns the computed body, FAQ H2, and FAQ H3 families. No DOM-only patch was introduced.

## 5. Authoritative facts preserved

The frozen data source, both generated routes, pricing, Route at a Glance, visible body, FAQ, and schema retain approximately 2,300 km; 5–13 days; Studio $2,400+; 1-bedroom $3,400+; 2-bedroom $5,500+; 3-bedroom $8,900+; 4+ bedroom $13,000+; overall $2,400–$13,000+. The route HTML byte diff contains only the body-family declaration.

## 6. Body-font before

At 1280×900 and 390×844, each body computed to `Inter, Arial, sans-serif` (16px / 25.6px / 400). Main paragraphs, pricing, FAQ answers, form controls, buttons, and CTA text already computed to Source Sans 3 through narrower route rules.

## 7. Body-font correction

Each explicit template's body declaration changed from Inter to Source Sans 3. The pair stylesheet also sets Source Sans 3 on `html[data-pcm-step40-ready="1"] body`, ensuring the runtime computed body matches the canonical contract.

## 8. Body-font after

At both exact viewports on both routes, body, main paragraph, pricing cell, FAQ answer, form label, input, button, and CTA text compute to `"Source Sans 3", Arial, sans-serif`.

## 9. Mobile FAQ-heading before

At 390×844, the FAQ section H2 computed to Georgia / 30px / 36px / 700 with margin `0 0 12px`; the FAQ question H3 computed to Georgia / 16px / 24px / 700. Step 77 recorded the H3 mismatch; the focused Step 78 cascade trace also measured the H2 mismatch named by the brief.

## 10. Mobile FAQ-heading correction

The pair stylesheet now gives `.pcm-route-faq-static h2` an important Playfair family while preserving 30px / 36px and existing spacing. Its H3 rule now explicitly gives FAQ questions the important Playfair family and preserves 16px / 24px / 700.

## 11. Mobile FAQ-heading after

At 390×844 on both routes, the FAQ H2 is `"Playfair Display", Georgia, serif` / 30px / 36px / 700 and the FAQ H3 is `"Playfair Display", Georgia, serif` / 16px / 24px / 700. Existing H2 and H3 margins remain unchanged.

## 12. Desktop typography preservation

At 1280×900, H1 remains Playfair 48px / 60px / 700; headings remain Playfair; body remains Source Sans 3; FAQ H2 is Playfair 30px / 36px / 700; FAQ H3 is Playfair 16px / 24px / 700. Quote, pricing, body, and FAQ-answer size/line-height/weight values are unchanged.

## 13. Structure preservation

Exact browser counts remain one H1, quote panel, primary form, pricing section/table, Route at a Glance, FAQ section/heading/FAQPage, and footer per direction. Hero, trust strip, main content, related destinations, closing CTA, navigation, and chatbot remain present and functional.

## 14. Form preservation

After 5.2–5.5 seconds, Vancouver → Winnipeg remains `Vancouver, BC` → `Winnipeg, MB`; Winnipeg → Vancouver remains `Winnipeg, MB` → `Vancouver, BC`. One primary form remains on each route.

## 15. Metadata preservation

The HTML diff proves description, canonical, OG URL, and all title fields are byte-unchanged. The global audit reconfirmed raw and rendered title/OG/Twitter agreement and canonical branding on 56/56 routes.

## 16. Pricing/glance preservation

Each target retains one pricing section/table and one Route at a Glance with all approved values. Mobile pricing still scrolls internally (`overflow-x:auto`, 318px client width, 760px scroll width) without document overflow.

## 17. FAQ preservation

Each target retains one FAQ section, one heading, seven visible Q&A, and one FAQPage with exact question/answer/order parity. FAQ content and schema are byte-equivalent to baseline; only CSS and the unrelated body style declaration changed. Global raw and rendered FAQ architecture is canonical 56/56.

## 18. Contamination result

The settled 10-second audit reports 0/56 `.pcm-local-seo` elements, visible `undefined`, legacy Moving Cost Breakdown, homepage contamination, soft 404, or expired promotion. It reports exactly 56 glance blocks, pricing tables, FAQ headings, and FAQPage objects, with zero page errors.

## 19. Idempotency

The second direct owner run produced zero route-byte change. This pair has no separate pair route finalizer; the owner writes final static HTML. The global FAQ finalizer and title normalizer each produced zero-byte changes on both targets. The aggregate owner/post-processor chain is also stable twice.

## 20. Mobile QA

Both routes pass at 390×844: canonical body and FAQ typography, no horizontal overflow, internal pricing scroll, stacked quote and glance, unclipped FAQ, five successful nav open/Escape-close/focus-return cycles, working chatbot, and zero application errors.

## 21. Desktop QA

Both routes pass at 1280×900: Source Sans 3 body, Playfair headings, canonical H1 and FAQ metrics, no overflow/layout regression, working desktop navigation and chatbot, and zero application errors.

## 22. Updated target classification

- Vancouver → Winnipeg: A — Canonical.
- Winnipeg → Vancouver: A — Canonical.

## 23. Global 56-route A/B/C/D classification

Measured current classification: A = 56, B = 0, C = 0, D = 0. The 54 prior A routes are hash-unchanged and pass the current global title, FAQ, contamination, ownership/architecture, test, and regression gates; the two former B routes pass the focused exact-viewport typography and complete route contracts.

## 24. Confirmation whether B reached zero

Yes. B = 0/56.

## 25. Confirmation C=0 and D=0

Confirmed: C = 0/56 and D = 0/56. There are no material route defects, owner collisions, render contradictions, or source-durability failures.

## 26. Global title/FAQ results

Titles: raw 56/56 and rendered 56/56 canonical. FAQ: raw 56/56 and rendered 56/56 canonical with exact visible/schema parity and order. Rendered `.pcm-local-seo` elements and page errors are 0/56.

## 27. Ownership/tests

Ownership/architecture validator: PASS — 56 routes, 56 sole owners, zero collisions. Three test files: 36/36 passed; zero failures, skips, cancellations, or todos.

## 28. Syntax

All 128 tool modules pass `node --check`: 128/128, zero failures.

## 29. Browser regression

Final deduplicated browser regression: 54 attempted, 54 passed, zero failed. Both Vancouver ↔ Winnipeg directions are included.

## 30. Aggregate pass 1

A fresh no-hardlink temporary clone was overlaid with the exact final `site-copy`, `tools`, and `package.json`; its baseline matched the corrected workspace. Full aggregate pass 1: **0/56 route drift; 0/104 asset drift**.

## 31. Aggregate pass 2

Full aggregate pass 2: **0/56 route drift; 0/104 asset drift**. Pass 2 equals pass 1.

## 32. Working-tree isolation

Relative to `STEP_78_BASELINE.json`, changed route HTML is exactly `/vancouver-to-winnipeg-movers/` and `/winnipeg-to-vancouver-movers/`; the sole changed current asset is `assets/step40-vancouver-winnipeg.css`. No unrelated route HTML or asset changed. The isolated aggregate runs did not alter the workspace.

## 33. Remaining known issues

None in the current 56-route A/B/C/D program. Step 79 was not started and nothing was deployed.

Step 78 is complete.
