# Step 60 — Edmonton ↔ Vancouver cleanup

Scope was limited to `/edmonton-to-vancouver-movers/` and `/vancouver-to-edmonton-movers/`. No deployment occurred and Step 61 was not started.

## 1. Step 59 defect confirmed

| Route | Step 59 Class | Exact Defect | Owner | Repair Layer |
| --- | --- | --- | --- | --- |
| `/edmonton-to-vancouver-movers/` | D — Architecture/source | Raw FAQ had 0 visible entries versus one FAQPage with 9 entries; browser repair supplied exact 9/9 parity | `generate-spa-routes.mjs` | Dedicated post-processor `finalize-vancouver-edmonton-routes.mjs` |
| `/vancouver-to-edmonton-movers/` | B — Minor cleanup | Visible `fully insured` terminology | `finalize-vancouver-edmonton-routes.mjs` | Same dedicated static owner |

Before editing, Step 59 also confirmed canonical rendered typography, route facts, metadata, forms, pricing, glance, navigation, chatbot, and conversion behavior for the pair.

## 2. Files changed

Material Step 60 implementation files:

- `tools/finalize-vancouver-edmonton-routes.mjs`
- `site-copy/edmonton-to-vancouver-movers/index.html`
- `site-copy/vancouver-to-edmonton-movers/index.html`
- `tools/audit-step60-edmonton-vancouver.mjs`
- `docs/STEP_60_EDMONTON_VANCOUVER_CLEANUP_REPORT.md`

`STEP_60_*.json` files contain baseline, direct-owner, FAQ/title, browser, regression, aggregate, and final-workspace evidence. No asset file changed.

## 3. Ownership/render architecture

- Edmonton → Vancouver: owner `generate-spa-routes.mjs`; declared `react-spa`; actual React SPA bootstrap present; dedicated allowed post-processor `finalize-vancouver-edmonton-routes.mjs`.
- Vancouver → Edmonton: owner `finalize-vancouver-edmonton-routes.mjs`; declared `static`; actual static document with no React SPA bootstrap.
- Both use `finalize-route-faq-architecture.mjs`, `normalize-route-title-metadata.mjs`, and `site-copy/assets/conversion-boost.js` in their declared chains.
- Navigation and chatbot remain architecture-appropriate: React navigation/chat on the SPA direction and the existing static fallback navigation/chat on the static direction.

Declared and actual architectures agree. The ownership/render gate passed.

## 4. Durable source chain

`generate-spa-routes.mjs` preserves the registered Edmonton → Vancouver SPA output. `finalize-vancouver-edmonton-routes.mjs` is the dedicated durable writer for the reverse static route and the declared pair-local post-processor for Edmonton → Vancouver. The correction was made there, not as an HTML-only patch.

The pair owner now emits the canonical visible FAQ cards and matching FAQPage directly. The global FAQ and title finalizers subsequently change zero bytes.

## 5. Authoritative facts preserved

No external research was used. Existing pair-authoritative values were frozen:

- distance: approximately 1,160 km
- transit: 4–13 days
- Studio/small shipment: $2,200+
- 1-bedroom: $2,800+
- 2-bedroom: $3,800+
- 3-bedroom: $5,200+
- 4+ bedroom: $7,000+
- overall planning range: $2,200–$7,000+

The settled pricing table, Route at a Glance, FAQ, schema, and route runtime agree on these values. The chatbot pricing tests also remained green.

## 6. Exact defect before

- Edmonton → Vancouver: one raw FAQ section and heading, zero visible Q&A cards, one FAQPage with nine entries, and 0/9 visible/schema parity. Browser execution rebuilt the visible cards.
- Vancouver → Edmonton: the route body visibly claimed `Professional, fully insured long-distance moving` and retained legacy `valuation coverage options` phrasing in the same route-body content chain.

## 7. Exact correction

- Added deterministic pair-owned FAQ-section serialization using the already-approved nine questions and answers.
- Replaced the existing FAQ section in owner output before writing the single FAQPage.
- Replaced only the confirmed route-body protection terminology with `Declared Value Protection` wording.
- Preserved the approved titles, descriptions, pricing values, section design, navigation, chatbot, conversion runtime, and route architecture.

## 8. Raw FAQ before/after

| Route | Before | After |
| --- | --- | --- |
| Edmonton → Vancouver | 1 section / 1 heading / 0 visible / 1 FAQPage × 9; parity failed | 1 / 1 / 9 / 1×9; exact question, answer, and order parity |
| Vancouver → Edmonton | 1 / 1 / 9 / 1×9; parity passed | 1 / 1 / 9 / 1×9; exact parity retained and serialized by the owner |

## 9. Rendered FAQ result

Both directions render exactly one FAQ section, one heading, nine visible entries, and one FAQPage with nine entries. Question, answer, and order parity is exact. `runtimeChanged=false` for both routes in the final targeted FAQ audit.

## 10. FAQ finalizer idempotency

- second pair-owner run versus first: 0 route changes, 0 asset changes
- global FAQ finalizer versus second owner run: 0 route changes, 0 asset changes
- title normalizer versus FAQ-finalized state: 0 route changes, 0 asset changes

The owner no longer depends on the FAQ finalizer to reconcile pair output.

## 11. Typography result

Computed desktop and mobile styles pass on both routes:

- body, paragraphs, pricing, FAQ, form fields, buttons, and CTA: Source Sans 3
- headings: Playfair Display
- desktop H1: 48px / 60px / 700
- mobile H1: 36px / 45px / 700

No global typography change was made.

## 12. Metadata result

Both routes retain route-specific titles with `| Purely Canadian Movers` exactly once. `og:title` and `twitter:title` match the title. Each retains its approved route-specific description, self-canonical, and correct route-specific `og:url`. Global title audit: 56/56 canonical.

## 13. Form result

The existing conversion runtime supplies the quote panel during initial page startup. The immediate `DOMContentLoaded` snapshot precedes that injection; actual input values are present by approximately 1.5 seconds and remain correct after 5.5+ seconds:

- Edmonton → Vancouver: `Edmonton, AB` → `Vancouver, BC`
- Vancouver → Edmonton: `Vancouver, BC` → `Edmonton, AB`

The audit reads input `.value`, not placeholders.

## 14. Pricing/glance result

Settled output for each direction has exactly one pricing section, one five-row canonical pricing table, and one Route at a Glance. There is no visible `Moving Cost Breakdown`, duplicate pricing, or stale value. At 390×844 the pricing table scrolls within its wrapper without page-level horizontal overflow.

## 15. Contamination result

Route-body checks found no unintended Toronto, Calgary, Montreal, Ottawa, Halifax, Winnipeg, Victoria, or Seattle content. Occurrences outside the route body are limited to legitimate navigation, footer, or related-destination links. Both routes have zero visible `.pcm-local-seo`, zero visible `undefined`, no stale promotion, no guaranteed-pricing claim, no legacy cost block, and no stale route-body insurance/valuation wording.

## 16. Presentation preservation

The approved presentation and order remain: quote panel, pricing, hero, trust strip, main route content, Route at a Glance, FAQ, related destinations, closing CTA, and footer. No approved section was redesigned or reordered.

## 17. Desktop/mobile QA

Playwright QA passed at 1280×900 and 390×844 for both routes:

- no horizontal overflow
- responsive quote panel and glance
- internal mobile pricing scroll
- required computed typography
- one FAQ with exact parity
- working desktop/mobile navigation
- working chatbot open/close behavior
- zero clipped controls
- no soft 404
- zero application console/page errors

## 18. Updated A/B/C/D classification

- Edmonton → Vancouver: D → **A — Canonical**
- Vancouver → Edmonton: B → **A — Canonical**
- Edmonton ↔ Vancouver pair: **complete**

Updated global rollup: 42 A, 10 B, 2 C, 2 D = 56 routes. Among bidirectional pairs, 19 are complete, 5 remain minor cleanup, 1 remains material, and 2 remain source repair.

## 19. Ownership/tests

- ownership/architecture validator: PASS — 56 routes, 56 owners, zero collisions
- ownership, title, and chatbot-pricing tests: 35/35 PASS
- syntax: 124/124 `.mjs` files PASS (one more than Step 59 because the Step 60 audit was added)
- global rendered FAQ audit: 56/56 canonical
- global title audit: 56/56 canonical

## 20. Browser regression

Current deduplicated browser regression: **52/52 PASS**, 0 failures. Both Edmonton ↔ Vancouver directions are included exactly once.

## 21. First aggregate result

A fresh temporary Git clone was overlaid with the corrected working-tree `site-copy`, `tools`, and package manifest. Aggregate pass 1 from that clone produced:

- **0/56 route drift**
- **0/104 asset drift**

An earlier nonqualifying attempt was discarded because it launched from the workspace rather than the prepared clone and encountered a transient OneDrive write error. The untouched overlay snapshot restored the workspace; a hash verification confirmed the corrected state before the qualifying fresh-clone run. No failed-attempt drift was accepted or reconciled.

## 22. Second aggregate result

Aggregate pass 2 in the qualifying clone produced:

- **0/56 route drift** versus pass 1
- **0/104 asset drift** versus pass 1

## 23. Working-tree isolation

Comparing `STEP_60_FINAL_WORKSPACE.json` with `STEP_60_BASELINE.json` finds exactly:

- changed registered route HTML: `/edmonton-to-vancouver-movers/`, `/vancouver-to-edmonton-movers/`
- unrelated registered route HTML changes: 0
- asset changes: 0/104

Target hashes:

| Route | Before | After |
| --- | --- | --- |
| Edmonton → Vancouver | `5a51b6340a6ac8c1b110fb838e1446208a02e6c38bcc81121812198de3abe10f` | `7434e398033856cf09af50edc2353281686db1e3b2dda75dee65c33bb0bd0500` |
| Vancouver → Edmonton | `ba736faa0c19210b20c42051f810e0550ff65200a8b2f8cbe5f1291581185edf` | `61ab9a4808d2d7cf244b62bc7bd1ae3e1729db270dc728df12293f6d7a825441` |

## 24. Remaining known issues

No Step 60 blocker remains for this pair. The immediate `DOMContentLoaded` snapshot occurs before the existing conversion runtime injects the quote/pricing panels; their actual directional values and canonical presentation are stable by 1.5 seconds and at 5.5+ seconds. This pre-existing lifecycle behavior was not redesigned because Step 59 did not classify it as a defect.

Outside Step 60 scope, the refreshed global queue retains 10 B routes, 2 C routes, and 2 D routes. No deployment occurred. Step 61 was not started.

Step 60 is complete.
