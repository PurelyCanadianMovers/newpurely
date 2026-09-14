# Step 54 — Calgary ↔ Toronto source FAQ cleanup

Scope was limited to `/calgary-to-toronto-movers/` and `/toronto-to-calgary-movers/`. No deployment occurred and Step 55 was not started.

## 1. Step 53 defect confirmed

| Route | Step 53 Class | Exact Defect | Owner | Repair Layer |
| --- | --- | --- | --- | --- |
| `/calgary-to-toronto-movers/` | D — Architecture/source | Raw FAQ shell and 11-entry FAQPage existed, but raw visible Q&A count was 0; browser runtime supplied 11/11 | `generate-spa-routes.mjs` | Registered pair post-processor, `finalize-calgary-toronto-routes.mjs` |
| `/toronto-to-calgary-movers/` | D — Architecture/source | Raw FAQ shell and 9-entry FAQPage existed, but raw visible Q&A count was 0; browser runtime supplied 9/9 | `generate-spa-routes.mjs` | Registered pair post-processor, `finalize-calgary-toronto-routes.mjs` |

Step 53 did not identify a typography, metadata, form, pricing, promotion, terminology, spacing, width, contamination, or responsive defect on this pair. The exact problem was source FAQ durability and the resulting build-order dependency.

## 2. Files changed

- `tools/finalize-calgary-toronto-routes.mjs`
- `tools/audit-step54-calgary-toronto.mjs`
- `site-copy/calgary-to-toronto-movers/index.html`
- `site-copy/toronto-to-calgary-movers/index.html`
- `docs/STEP_54_CALGARY_TORONTO_CLEANUP_REPORT.md`
- Step 54 JSON evidence files (`STEP_54_*.json`)

No shared asset changed.

## 3. Ownership/render architecture

Both directions declare `generate-spa-routes.mjs` as the sole full-page owner and actually use the `react-spa` architecture with the compiled `site-copy/assets/index-CNBNs70h.js` bootstrap. The registered post-processors are, in order, the Calgary/Toronto pair finalizer, global FAQ finalizer, and title normalizer. Navigation and chatbot remain React-owned; `conversion-boost.js` remains the conversion runtime. Declared and actual architecture agree, so the Step B stop condition did not apply.

## 4. Durable source chain

The SPA owner preserves each existing route-specific generated document. `finalize-calgary-toronto-routes.mjs` is the legitimate pair-scoped durable repair layer and already owns the exact FAQ arrays used by the inline browser normalizer and FAQPage schema. It now writes one visible static FAQ section from those same arrays before writing the matching schema and runtime. The global FAQ finalizer and title normalizer remain registered but change zero bytes.

## 5. Authoritative facts preserved

No route fact changed. The existing project hierarchy remains authoritative:

- Corridor: approximately 3,400–3,500 km (`~3,400 km` in Route at a Glance; `3,500 km` in the authoritative cost-guide row).
- Transit: 7–19 days.
- Studio/small shipment: $2,500+.
- 1-bedroom: $3,800+.
- 2-bedroom: $6,400+.
- 3-bedroom: $10,000+.
- 4+ bedroom: $15,000+.
- Overall planning range: $2,500–$15,000+.

Route runtime, pricing table, Route at a Glance, FAQ, schema, cost guide, and chatbot pricing tests remain consistent with those established facts. No external research was used.

## 6. Exact defect before

- Calgary → Toronto: one FAQ section, one heading, zero raw visible answers, one FAQPage with 11 entries.
- Toronto → Calgary: one FAQ section, one heading, zero raw visible answers, one FAQPage with 9 entries.
- Both became canonical only after React and the Step 22 runtime executed.

## 7. Exact correction

The pair finalizer gained an escaped, deterministic `faqSection()` renderer and a bounded `replaceVisibleFaq()` operation. It replaces only the existing FAQ section containing the exact `Frequently Asked Questions` heading and throws if that section cannot be located. Visible cards and schema are generated from the same route-owned arrays, preventing question, answer, and order drift. No second FAQ was introduced.

## 8. Typography result

Computed styles passed on both routes:

- Heading family: Playfair Display.
- Body, FAQ: Source Sans 3.
- Form inputs and buttons: Source Sans 3.
- Desktop H1 at 1280×900: 48px / 60px / 700.
- Mobile H1 at 390×844: 36px / 45px / 700.

No global font or route typography rule changed.

## 9. Raw FAQ result

- Calgary → Toronto: one section, one heading, 11 visible Q&A, one FAQPage with 11 entries, exact answer/order parity.
- Toronto → Calgary: one section, one heading, 9 visible Q&A, one FAQPage with 9 entries, exact answer/order parity.
- Updated global raw FAQ canonical count: 49/56, up from 47/56.

## 10. Rendered FAQ result

Initial, 1–2 second, and 5+ second checkpoints settle to one FAQ section, one heading, and one FAQPage with exact visible/schema parity: 11/11 Calgary → Toronto and 9/9 Toronto → Calgary. Global rendered FAQ audit remains 56/56 canonical.

## 11. FAQ finalizer idempotency

Hash transitions after the pair source became canonical:

- First SPA-owner run: 0/56 route changes; 0/104 asset changes.
- Second SPA-owner run: 0/56; 0/104.
- Global FAQ finalizer: 0/56; 0/104.
- Title normalizer: 0/56; 0/104.
- Repeated pair-finalizer run: 0/56; 0/104.

The FAQ finalizer therefore changes zero bytes for this repaired pair.

## 12. Metadata result

Both routes retain route-specific title and description metadata, one exact ` | Purely Canadian Movers` suffix, matching `og:title` and `twitter:title`, self canonical, and correct `og:url`. Raw and global browser title audits are canonical 56/56. SEO copy was not rewritten.

## 13. Form result

Actual values passed at initial rendered availability, 1–2 seconds, 5+ seconds, desktop, and mobile:

- Calgary → Toronto: `Calgary, AB` → `Toronto, ON`.
- Toronto → Calgary: `Toronto, ON` → `Calgary, AB`.

These are values, not placeholder-only checks.

## 14. Pricing/glance result

Each settled route has exactly one pricing section, one table with the five canonical rows, and one Route at a Glance. There is no `Moving Cost Breakdown`, legacy price-card set, or duplicate pricing/glance component. The established Step 22 React/conversion rendering architecture for these approved sections was preserved; this Step did not redesign or rewrite them.

## 15. Contamination result

No `undefined`, visible `.pcm-local-seo`, expired promotion, unsupported price guarantee, legacy cost breakdown, or unintended insurance wording appears. Vancouver, Montreal, Edmonton, Ottawa, Halifax, and Victoria references found by the broad city scan are legitimate related-destination/navigation/footer links, not route-body contamination. Winnipeg and Seattle were absent from route main content.

## 16. Presentation preservation

The approved Step 22 sequence remains: quote panel, pricing, hero, trust strip, main route content, Route at a Glance, FAQ, related destinations, closing CTA, and footer. The repair replaced only the FAQ section's durable source markup and did not reorder approved sections.

## 17. Desktop/mobile QA

`tools/audit-step54-calgary-toronto.mjs` tested both directions at 1280×900 and 390×844. Results: no page overflow, responsive quote panel, mobile pricing table internal scrolling, responsive glance, one FAQ, working desktop/mobile navigation including Escape close, working chatbot open/close, zero clipped controls, and no soft 404. The targeted audit saw no page/application exception; one generic denied external-resource console line reflected the sandboxed network environment and was not an application error. Global FAQ/title audits recorded zero page errors for the pair.

## 18. Updated A/B/C/D classification

- Calgary → Toronto: **A — Canonical**.
- Toronto → Calgary: **A — Canonical**.
- Pair: **complete**.

Updated route totals: 36 A, 11 B, 2 C, and 7 D (56 total). Updated pair totals: 16 complete, 5 minor cleanup, 1 material, and 5 source repair, plus the two legitimate unpaired directions.

## 19. Ownership/tests

- Ownership/architecture validator: PASS, 56 routes, 56 owners, zero collisions.
- Ownership, title, and chatbot-pricing tests: 35/35 PASS.
- Global FAQ browser audit: 56/56 PASS.
- Global title browser audit: 56/56 PASS.
- Syntax: 122/122 `.mjs` files PASS.

## 20. Browser regression

The current deduplicated inventory passed 52/52. Both Calgary ↔ Toronto directions are present exactly once and passed route identity, title branding, settled form values, pricing, navigation, chatbot, body integrity, `.pcm-local-seo`, and `undefined` checks.

## 21. First aggregate result

A fresh temporary Git clone was overlaid with the corrected working-tree `site-copy`, `tools`, and package manifest, then the registered aggregate route build ran once.

- Route drift: **0/56**.
- Asset drift: **0/104**.

Required first-pass convergence passed. No unrelated reconciliation was performed.

## 22. Second aggregate result

The aggregate ran a second time in the same isolated clone.

- Route drift: **0/56**.
- Asset drift: **0/104**.

## 23. Working-tree isolation

The pre-edit and corrected-baseline SHA-256 inventories prove exactly two of 56 route files changed:

- `/calgary-to-toronto-movers/`: `825d3da0…` → `2af26231…`.
- `/toronto-to-calgary-movers/`: `a9197c55…` → `db667188…`.

No other route HTML changed and no asset changed. Source/test/report changes are pair-scoped. Pre-existing unrelated working-tree changes were preserved.

## 24. Remaining known issues

The seven remaining D routes, eleven B routes, and two C routes documented by Step 53 remain outside this step. No new defect was introduced. Calgary ↔ Toronto has no remaining Step 53 classification defect.

No deployment occurred. Step 55 was not started.

Step 54 is complete.
