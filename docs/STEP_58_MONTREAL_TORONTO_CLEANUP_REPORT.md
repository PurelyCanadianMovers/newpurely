# Step 58 — Montreal ↔ Toronto Source FAQ Cleanup

## 1. Step 57 defect confirmed

| Route | Step 57 class | Exact defect | Owner | Repair layer |
| --- | --- | --- | --- | --- |
| `/montreal-to-toronto-movers/` | D | Raw FAQ/source durability: the raw FAQ shell had no visible answer paragraphs; browser output repaired it to canonical 12/12 | `generate-spa-routes.mjs` | `finalize-montreal-toronto-routes.mjs` |
| `/toronto-to-montreal-movers/` | D | Raw FAQ/source durability: the raw FAQ shell had no visible answer paragraphs; browser output repaired it to canonical 9/9 | `generate-spa-routes.mjs` | `finalize-montreal-toronto-routes.mjs` |

Step 57 identified no typography, metadata, form-default, pricing, glance, contamination, navigation, chatbot, or responsive defect for either direction.

## 2. Files changed

- `tools/finalize-montreal-toronto-routes.mjs`: emits the approved route-specific visible FAQ cards beside the matching FAQPage data.
- `site-copy/montreal-to-toronto-movers/index.html`
- `site-copy/toronto-to-montreal-movers/index.html`
- `tools/audit-step58-montreal-toronto.mjs`: route-scoped raw, lifecycle, viewport, interaction, typography, fact, metadata, and contract audit.
- `docs/STEP_58_MONTREAL_TORONTO_CLEANUP_REPORT.md`
- `STEP_58_*.json`: Step 58 hash, audit, regression, and aggregate evidence.

No deployment file or unrelated route source was changed for Step 58.

## 3. Ownership/render architecture

The registry declares `generate-spa-routes.mjs` as the sole full-page owner for both routes and `react-spa` as their render class. Actual documents load the compiled React module, the shared React navigation/chatbot, and `conversion-boost.js`. Registered post-processors are the pair finalizer, global FAQ finalizer, and title normalizer. Declared and actual architecture match.

## 4. Durable source chain

`generate-spa-routes.mjs` preserves existing registered SPA output. `finalize-montreal-toronto-routes.mjs` is the pair-scoped durable writer for metadata, FAQ/schema, and existing presentation normalization. The repair adds the already-approved visible FAQ cards at the existing FAQ position and retains one browser runtime normalizer for the declared React output. The global FAQ and title finalizers make zero subsequent byte changes.

## 5. Authoritative facts preserved

The current route source, rendered pricing, Route at a Glance, FAQ/schema, and applicable conversion/chatbot data agree on:

- approximately 540 km;
- 2–5 days;
- Studio $2,300+;
- 1-bedroom $3,900+;
- 2-bedroom $5,200+;
- 3-bedroom $8,300+;
- 4+ bedroom $12,000+;
- overall range $2,300–$12,000+.

These values were frozen. No external research or fact change was made.

## 6. Exact defect before

Each raw document had one FAQ section, one FAQ heading, and one FAQPage, but the accordion contents contained no answer paragraphs. The raw visible/schema contract therefore failed: Montreal → Toronto was 0 visible versus 12 schema entries; Toronto → Montreal was 0 visible versus 9 schema entries. Browser execution supplied the canonical visible cards downstream.

## 7. Exact correction

The pair finalizer now deterministically replaces the existing FAQ shell at its existing section position with one visible route-specific card list derived from the same `config.faqs` array used to generate FAQPage. It validates that the existing section can be located and throws instead of silently appending a duplicate.

## 8. Raw FAQ before/after

| Route | Before | After |
| --- | --- | --- |
| Montreal → Toronto | 1 section / 1 heading / 0 visible / 1 FAQPage × 12 | 1 section / 1 heading / 12 visible / 1 FAQPage × 12; exact question, answer, and order parity |
| Toronto → Montreal | 1 section / 1 heading / 0 visible / 1 FAQPage × 9 | 1 section / 1 heading / 9 visible / 1 FAQPage × 9; exact question, answer, and order parity |

## 9. Rendered FAQ result

At initial settled render, 1.5 seconds, 5.5 seconds, desktop, and mobile, Montreal → Toronto has one 12-entry FAQ and Toronto → Montreal has one 9-entry FAQ. Each has exactly one FAQPage and exact visible/schema question, answer, and order parity. The global audit reports both canonical and `runtimeChanged=false`.

## 10. FAQ finalizer idempotency

- second pair-finalizer run: 0/56 route drift and 0/104 asset drift;
- direct SPA owner run 1: 0/56 and 0/104;
- direct SPA owner run 2: 0/56 and 0/104;
- global FAQ finalizer: 0/56 and 0/104;
- title normalizer: 0/56 and 0/104.

## 11. Typography result

Computed browser styles pass at both required viewports:

- headings use Playfair Display;
- body, paragraphs, FAQ, pricing, form controls, buttons, and CTA use Source Sans 3;
- desktop H1 is 48px / 60px / 700;
- mobile H1 is 36px / 45px / 700.

No typography change was needed.

## 12. Metadata result

Both directions have route-specific titles with `| Purely Canadian Movers` exactly once. `og:title` and `twitter:title` match the document title. Descriptions are direction-specific, and canonical plus `og:url` are self-referential. Existing approved SEO copy was preserved.

## 13. Form result

The checked-in SPA shell does not hard-code input `value` attributes and the immediate DOMContentLoaded snapshot is blank; placeholders were not treated as proof. Actual input values were read from the live form. By 1.5 seconds and again after 5.5 seconds they settle to:

- Montreal → Toronto: `Montreal, QC` → `Toronto, ON`;
- Toronto → Montreal: `Toronto, ON` → `Montreal, QC`.

The same directional values pass desktop, mobile, and the 52-route regression.

## 14. Pricing/glance result

The declared React render settles to exactly one pricing section, one five-row pricing table, and one Route at a Glance in each direction. The raw SPA shell delegates these visual components to React; the settled contract is one of each with no duplicate or legacy `Moving Cost Breakdown`. All prices, distance, transit, and range match the frozen authority.

## 15. Contamination result

There is no visible `.pcm-local-seo`, `undefined`, stale promotion, unsupported guarantee, legacy cost block, or stale insurance/valuation wording. Searches for Vancouver, Calgary, Edmonton, Ottawa, Halifax, Winnipeg, Victoria, and Seattle were reviewed as navigation/footer/related-route references rather than route-body contamination. Browser body-integrity checks pass both directions.

## 16. Presentation preservation

The approved order remains quote panel, pricing, hero, trust strip, main route content, Route at a Glance, FAQ, related destinations, closing CTA, and footer. Step 58 changes only the contents of the existing FAQ source shell; it does not redesign or reorder approved sections.

## 17. Desktop/mobile QA

At 1280 × 900 and 390 × 844, both routes pass: no horizontal page overflow, responsive quote panel, internal mobile pricing-table scroll, responsive glance, correct typography, one FAQ, working desktop/mobile navigation, working chatbot open/close, zero clipped controls, no soft 404, and zero application/page errors. Six repeated third-party requests per route were denied by the offline sandbox and are recorded separately from application errors.

## 18. Updated A/B/C/D classification

| Route | Before | After | Result |
| --- | --- | --- | --- |
| Montreal → Toronto | D | A — Canonical | Raw FAQ/source durability resolved; all other contracts remain canonical |
| Toronto → Montreal | D | A — Canonical | Raw FAQ/source durability resolved; all other contracts remain canonical |

The pair is complete under the Step 57 classification logic.

## 19. Ownership/tests

- ownership/architecture validator: PASS — 56 routes, 56 owners, zero collisions;
- ownership, title, and chatbot-pricing tests: 35/35 PASS;
- syntax: 123/123 current `.mjs` files PASS (Step 58 adds one route-scoped audit to the Step 57 baseline of 122);
- global FAQ: 56/56 canonical;
- global title: 56/56 canonical.

## 20. Browser regression

The current deduplicated suite passed 52/52 with zero failures. Both Montreal ↔ Toronto directions are included exactly once.

## 21. First aggregate result

A fresh temporary Git clone was overlaid with the corrected working-tree `site-copy`, `tools`, and package manifest before running the registered aggregate once.

- route drift: 0/56;
- asset drift: 0/104.

## 22. Second aggregate result

- second pass versus first: 0/56 route drift;
- asset drift: 0/104.

## 23. Working-tree isolation

Comparison of `STEP_58_FINAL_WORKSPACE.json` with the pre-edit `STEP_58_BASELINE.json` shows exactly two changed route HTML files:

- `/montreal-to-toronto-movers/`;
- `/toronto-to-montreal-movers/`.

The other 54 registered route documents and all 104 assets are byte-identical to the Step 58 baseline. Route-scoped source, QA, evidence, and this report are the only additional Step 58 changes. Pre-existing working-tree changes were preserved.

## 24. Remaining known issues

No Montreal ↔ Toronto defect remains under the Step 57 classification. The raw SPA shell continues to delegate pricing, glance, and initial form settlement to the declared React/conversion architecture; those rendered contracts pass and were not broadened into a redesign. Broader B/C/D routes listed by Step 57 remain outside Step 58. No deployment occurred, and Step 59 was not started.

Step 58 is complete.
