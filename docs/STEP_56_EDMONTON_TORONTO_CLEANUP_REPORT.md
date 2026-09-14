# Step 56 — Edmonton ↔ Toronto cleanup

Scope: repair only the Step 55 Edmonton ↔ Toronto raw FAQ/source-durability defect. No deployment occurred and Step 57 was not started.

## 1. Step 55 defect confirmed

| Route | Step 55 Class | Exact Defect | Owner | Repair Layer |
| --- | --- | --- | --- | --- |
| `/edmonton-to-toronto-movers/` | D — Architecture/source | Raw FAQ shell and one 12-entry FAQPage, but zero visible raw Q&A; rendered FAQ was canonical 12/12. Typography, metadata, form, pricing/glance, navigation, chatbot, conversion runtime, and responsive presentation had no Step 55 defect. | `generate-spa-routes.mjs` | `finalize-toronto-edmonton-routes.mjs` |
| `/toronto-to-edmonton-movers/` | D — Architecture/source | Raw FAQ shell and one 12-entry FAQPage, but zero visible raw Q&A; rendered FAQ was canonical 12/12. Typography, metadata, form, pricing/glance, navigation, chatbot, conversion runtime, and responsive presentation had no Step 55 defect. | `generate-spa-routes.mjs` | `finalize-toronto-edmonton-routes.mjs` |

The exact defect type was FAQ source durability/source durability. Raw FAQ canonical state was no for both directions; rendered FAQ canonical state was yes, 12/12 for both. The pair's typography was already canonical. Step 55 identified no metadata, form, pricing, glance, promotion, terminology, contamination, or chatbot defect on this pair.

## 2. Files changed

Durable implementation and route output:

- `tools/finalize-toronto-edmonton-routes.mjs`
- `site-copy/edmonton-to-toronto-movers/index.html`
- `site-copy/toronto-to-edmonton-movers/index.html`
- `docs/STEP_56_EDMONTON_TORONTO_CLEANUP_REPORT.md`

Validation evidence was written to the `STEP_56_*.json` artifacts in the repository root. The workspace was already materially dirty before Step 56; those pre-existing changes were preserved.

## 3. Ownership/render architecture

Both directions declare `generate-spa-routes.mjs` as their sole full-page owner and `react-spa` as their rendering architecture. Actual HTML contains the compiled `site-copy/assets/index-CNBNs70h.js` React bootstrap. Registered post-processors are `finalize-toronto-edmonton-routes.mjs`, `finalize-route-faq-architecture.mjs`, and `normalize-route-title-metadata.mjs`, in that order. Navigation and chatbot remain React-owned; `site-copy/assets/conversion-boost.js` remains the conversion runtime. Declared and actual architecture agree, so the Step B stop condition did not apply.

## 4. Durable source chain

The SPA owner preserves each existing route-specific output. The dedicated pair finalizer is the legitimate durable repair layer and already owns the exact FAQ arrays used by the schema and inline runtime. It now writes one visible static FAQ section from those same arrays before writing the matching FAQPage and idempotent runtime. No duplicate FAQ architecture was introduced.

## 5. Authoritative facts preserved

No route fact changed. Current durable project sources remain authoritative and agree across the pair finalizer, rendered pricing, Route at a Glance, FAQ, and schema:

- Distance: approximately 3,500 km.
- Transit: 7–16 days in both directions, including the previously approved Toronto → Edmonton value.
- Studio/small shipment: $2,500+.
- 1-bedroom: $4,500–$5,500+.
- 2-bedroom: $6,000–$7,000+.
- 3-bedroom: $10,000+.
- 4+ bedroom: $12,000–$15,000+.
- Overall range: $2,500–$15,000+.

The targeted browser audit confirmed the distance, transit, price bands, and overall range at initial, settled desktop, and settled mobile checkpoints. No external research was used.

## 6. Exact defect before

Each raw route had one FAQ section, one FAQ heading, zero visible Q&A cards, and one FAQPage with 12 entries. React plus the pair runtime supplied the visible cards after browser execution, leaving a mutable build-order/runtime dependency in source.

## 7. Exact correction

`finalize-toronto-edmonton-routes.mjs` now renders the visible FAQ section from the pair's existing authoritative FAQ arrays and replaces the existing FAQ shell at the durable source layer. It also uses whitespace-tolerant FAQPage detection while removing stale FAQ schemas. The repair is limited to FAQ source generation; approved content, facts, layout, and runtime behavior were not redesigned.

## 8. Raw FAQ before/after

- Edmonton → Toronto: before 0 visible / 12 schema; after 12 visible / 12 schema, exact question, answer, and order parity.
- Toronto → Edmonton: before 0 visible / 12 schema; after 12 visible / 12 schema, exact question, answer, and order parity.
- Global raw FAQ canonical count is now 51/56, up from 49/56.

Both raw documents have exactly one FAQ section, one FAQ heading, one FAQPage, and at least one visible answer.

## 9. Rendered FAQ result

At initial, 1–2 second, 5+ second, desktop, and mobile checkpoints, both directions settle to one FAQ section, one heading, 12 visible Q&A cards, and one 12-entry FAQPage with exact answer and order parity. The global rendered FAQ audit passed 56/56.

## 10. FAQ finalizer idempotency

Hash transitions after the pair repair:

- First SPA-owner run: 0/56 route changes and 0/104 asset changes.
- Second SPA-owner run: 0/56 and 0/104.
- First pair-finalizer run: only the two target routes changed; zero assets changed.
- Second pair-finalizer run: 0/56 and 0/104.
- Global FAQ finalizer: 0/56 and 0/104.
- Title normalizer: 0/56 and 0/104.

The downstream FAQ finalizer and title normalizer therefore change zero bytes after the durable pair output is canonical.

## 11. Typography result

No typography repair was required. Computed styles passed at both viewports:

- Headings/H1: Playfair Display.
- Body, paragraphs, pricing, FAQ, form controls, buttons, and CTA: Source Sans 3.
- Desktop H1: 48px / 60px / 700.
- Mobile H1: 36px / 45px / 700.

## 12. Metadata result

Both routes retain route-specific titles and descriptions, the exact ` | Purely Canadian Movers` brand suffix once, matching `og:title` and `twitter:title`, self canonicals, and correct route-specific `og:url` values. Step 55 did not identify SEO-copy defects, so copy was not rewritten. Global title audit passed 56/56.

## 13. Form result

Actual runtime values were checked at initial rendered availability, 1–2 seconds, 5+ seconds, desktop, and mobile:

- Edmonton → Toronto: `Edmonton, AB` → `Toronto, ON`.
- Toronto → Edmonton: `Toronto, ON` → `Edmonton, AB`.

The settled values, rather than placeholders, were used as proof.

## 14. Pricing/glance result

Each settled route has exactly one pricing section, one canonical five-row pricing table, and one Route at a Glance. There is no settled `Moving Cost Breakdown`, duplicate pricing block, duplicate glance, or stale value. On 390×844 the pricing table scrolls internally without page overflow. The existing React/conversion rendering architecture for these approved sections was preserved.

## 15. Contamination result

No visible `.pcm-local-seo`, `undefined`, expired promotion, guaranteed long-distance pricing claim, legacy cost block, or stale visible insurance/valuation wording was found. Winnipeg and Seattle were absent from main route content. Vancouver, Montreal, Ottawa, Halifax, and Victoria matches were legitimate related-destination/navigation/footer references, not route-body contamination. Edmonton and Toronto are the intended corridor identities.

## 16. Presentation preservation

The approved sequence remains quote panel, pricing, hero, trust strip, main content, Route at a Glance, FAQ, related destinations, closing CTA, and footer. The source change replaced only the FAQ shell with durable visible cards and did not reorder or redesign an approved section.

## 17. Desktop/mobile QA

`STEP_56_EDMONTON_TORONTO_AUDIT.json` tested both directions at 1280×900 and 390×844. Both passed: no horizontal page overflow, responsive quote panel, internally scrolling mobile pricing table, responsive glance, one FAQ, working desktop/mobile navigation including Escape closure, working chatbot open/close, zero clipped controls, no soft 404, and no application exception. One generic `ERR_NETWORK_ACCESS_DENIED` external-resource line reflects the sandboxed network environment and is not an application error.

## 18. Updated A/B/C/D classification

- Edmonton → Toronto: **A — Canonical**.
- Toronto → Edmonton: **A — Canonical**.
- Pair: **complete**.

## 19. Ownership/tests

- Ownership/architecture validator: PASS, 56 registered routes, 56 owners, zero collisions.
- Ownership, title, and chatbot-pricing tests: 35/35 PASS.
- Global FAQ browser audit: 56/56 PASS.
- Global title browser audit: 56/56 PASS.
- Syntax checks: 122/122 `.mjs` files PASS.

## 20. Browser regression

The current deduplicated regression suite passed 52/52. Both Edmonton ↔ Toronto routes are included exactly once and passed route identity, title branding, settled form values, pricing, navigation, chatbot, body integrity, `.pcm-local-seo`, and `undefined` checks.

## 21. First aggregate result

A fresh temporary Git clone was overlaid with the corrected working-tree `site-copy`, `tools`, and package manifest. The registered aggregate build then ran once in that clone.

- Route drift: **0/56**.
- Asset drift: **0/104**.

No first-pass drift appeared.

## 22. Second aggregate result

The aggregate build ran a second time in the same isolated clone.

- Route drift versus the corrected baseline: **0/56**.
- Asset drift versus the corrected baseline: **0/104**.
- Second pass versus first pass: zero route and zero asset changes.

## 23. Working-tree isolation

Comparison of `STEP_56_BEFORE.json` with `STEP_56_FINAL_WORKSPACE.json` shows exactly two registered route HTML changes:

- `/edmonton-to-toronto-movers/`
- `/toronto-to-edmonton-movers/`

All other 54 registered route HTML files are byte-identical to the pre-edit baseline. All 104 assets are byte-identical. During aggregate setup, an incorrect harness working directory started an isolated-check command against the workspace; it was stopped, the eight files touched by the interrupted second attempt were restored from the exact pre-run overlay copy, and the restored workspace hash matched the corrected baseline at 0 route and 0 asset differences before the aggregate gates were rerun correctly in the clone.

## 24. Remaining known issues

No Edmonton ↔ Toronto defect remains. The unrelated Step 55 B, C, and remaining D queue is unchanged except that these two D routes are now A. No deployment occurred. Step 57 was not started.

Step 56 is complete.
