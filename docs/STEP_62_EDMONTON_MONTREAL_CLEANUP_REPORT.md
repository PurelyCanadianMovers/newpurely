# Step 62 — Edmonton ↔ Montreal cleanup

Scope: `/edmonton-to-montreal-movers/` and `/montreal-to-edmonton-movers/` only. No deployment occurred. Step 63 was not started.

## 1. Step 61 defect confirmed

| Route | Step 61 class | Exact defect | Owner | Repair layer |
| --- | --- | --- | --- | --- |
| `/edmonton-to-montreal-movers/` | B — Minor cleanup | Visible `fully insured`; mobile open state/`aria-expanded` and Escape behavior | `generate-spa-routes.mjs` | `finalize-montreal-edmonton-routes.mjs` route-scoped output/runtime |
| `/montreal-to-edmonton-movers/` | D — Architecture/source | Raw FAQ had 0 visible answers versus a stale eight-entry FAQPage; raw canonical and `og:url` pointed to the homepage | `generate-spa-routes.mjs` | `finalize-montreal-edmonton-routes.mjs` durable pair finalizer |

Before editing, `STEP_62_BASELINE.json` recorded 56 registered route hashes and 104 asset hashes. Target baselines were `4ff7a0a3f7c6e3c35959a2412262ea6eea0fbfcf0fcc1b6e9079ef18c74b0cde` and `cb842a6b24be6ce2744cda65a1c2771923de1b5ee57907fe36215bbcda77fe73` respectively.

## 2. Files changed

Durable implementation and route output:

- `tools/finalize-montreal-edmonton-routes.mjs`
- `site-copy/edmonton-to-montreal-movers/index.html`
- `site-copy/montreal-to-edmonton-movers/index.html`

Validation coverage and report:

- `tools/audit-step62-edmonton-montreal.mjs`
- `tools/audit-step33-regressions.mjs` (added the missing Edmonton → Montreal direction to the deduplicated inventory)
- `docs/STEP_62_EDMONTON_MONTREAL_CLEANUP_REPORT.md`
- Step 62 JSON hash/audit artifacts in the repository root

The cost-guide writer ran but its existing Edmonton/Montreal rows were already canonical; no registered non-target route or asset changed.

## 3. Ownership/render architecture

Both routes retain the registered full-page owner `generate-spa-routes.mjs`, declared rendering `react-spa`, and the allowed pair post-processor `finalize-montreal-edmonton-routes.mjs`. Montreal → Edmonton retains the compiled React module and hydrates normally.

Edmonton → Montreal remains the known, registered `missing-react-bootstrap` / `static-nav-chat-on-react` exception: its DOM is a preserved React-produced route snapshot served hydration-free with the registered static navigation and chatbot bridges. This exception existed before Step 62, is explicit in `route-page-ownership.mjs`, was not broadened, and passes the ownership/architecture validator. Navigation, chatbot, conversion runtime, FAQ finalizer, and title normalizer all remain in their declared chains.

## 4. Durable source chain

The aggregate chain is:

1. `generate-spa-routes.mjs` preserves the existing SPA-owned route output.
2. `finalize-montreal-edmonton-routes.mjs` supplies canonical pair FAQ/schema, raw metadata, directional form identity, canonical raw fallbacks, terminology, and the route-scoped Edmonton mobile-navigation bridge.
3. `strip-unsupported-route-bootstrap.mjs` preserves the registered Edmonton hydration exception and refreshes its directional placeholders.
4. `finalize-route-faq-architecture.mjs` and `normalize-route-title-metadata.mjs` validate as zero-byte post-processors.

The finalizer has no mutable dependency on another route page. Its output is deterministic and aggregate-convergent.

## 5. Authoritative facts preserved

The current durable project source, rather than the older planning note in the Step 62 prompt, establishes the corridor as approximately **3,500 km**. That value already agreed between the current route and pair finalizer and was frozen. The following values agree across pricing, Route at a Glance, FAQ/schema, route runtime, and applicable cost-guide data:

- distance: approximately 3,500 km
- transit: 7–19 days
- Studio: $2,500+
- 1-bedroom: $4,700+
- 2-bedroom: $6,300+
- 3-bedroom: $10,000+
- 4+ bedroom: $15,000+
- overall range: $2,500–$15,000+

No external research was used and no authoritative corridor fact was changed.

## 6. Exact defect before

Edmonton → Montreal exposed stale `fully insured`/generic valuation wording in its route FAQ and used the static mobile navigation without complete open-state ARIA or Escape dismissal.

Montreal → Edmonton's raw document contained one FAQ shell with zero visible cards and one unrelated eight-entry homepage FAQPage. Browser execution replaced that mismatch with 12 route entries. Its raw canonical and `og:url` also targeted the homepage, so raw source correctness depended on downstream execution.

## 7. Exact correction

The pair finalizer now writes 12 direction-specific FAQ cards and exactly one matching FAQPage for each route, writes self canonical/OG URLs and route-specific descriptions, writes actual form values in the raw source, supplies canonical quote/pricing/glance fallbacks when absent, and maintains the same result through the React lifecycle. It replaces stale route-body insurance terminology with Declared Value Protection wording.

The Edmonton-only mobile bridge now starts with `aria-expanded="false"`, changes to `true` on open, returns to `false` on close or Escape, closes the panel on Escape, and restores focus to the trigger.

## 8. Raw FAQ before/after

| Route | Before | After |
| --- | --- | --- |
| Edmonton → Montreal | 1 section / 1 heading / 12 visible / 1×12 schema; parity present but stale wording | 1 / 1 / 12 / 1×12; exact question, answer, and order parity |
| Montreal → Edmonton | 1 section / 1 heading / 0 visible / stale 1×8 schema; parity failed | 1 / 1 / 12 / 1×12; exact question, answer, and order parity |

## 9. Rendered FAQ result

At initial render, 1–2 seconds, and 5+ seconds, both directions render exactly one FAQ section, one heading, 12 visible entries, and one 12-entry FAQPage with exact question/answer/order parity. The route-specific audit and global FAQ audit both pass; global result is **56/56 canonical**.

## 10. FAQ finalizer idempotency

After the second pair-finalizer run, `finalize-route-faq-architecture.mjs` changed **0 routes and 0 assets**. It is a zero-byte validator for the corrected pair output.

## 11. Typography result

Computed desktop styles for both routes are Playfair Display headings and Source Sans 3 body/forms/buttons. Body, paragraphs, pricing cells, FAQ answers, form inputs, buttons, and CTA all compute to Source Sans 3. H1 computes to:

- desktop 1280×900: 48px / 60px / 700
- mobile 390×844: 36px / 45px / 700

No global font change was made.

## 12. Metadata result

Both raw and rendered documents have route-specific titles, the exact `| Purely Canadian Movers` suffix once, matching `og:title` and `twitter:title`, route-specific descriptions, self canonicals, and correct self `og:url` values. The title normalizer changed **0 routes and 0 assets**. The global raw/rendered title audit passes **56/56**.

## 13. Form result

Actual input values, not placeholders, were verified in raw HTML, initial browser render, 1–2 seconds, 5+ seconds, desktop, and mobile:

- Edmonton → Montreal: `Edmonton, AB` → `Montreal, QC`
- Montreal → Edmonton: `Montreal, QC` → `Edmonton, AB`

Each route has exactly one quote panel and one primary form at every audited state.

## 14. Pricing/glance result

Raw and rendered checks find exactly one pricing section, one five-row canonical pricing table, and one Route at a Glance per route. Both routes show the frozen 3,500 km, 7–19 day, five-tier pricing, and $2,500–$15,000+ range. No visible `Moving Cost Breakdown`, duplicate pricing, duplicate glance, or stale value remains.

## 15. Contamination result

There is no visible `.pcm-local-seo`, `undefined`, expired promotion, guaranteed-pricing claim, legacy cost block, or stale route-body insurance/valuation wording. Raw token matches for old terminology are confined to non-visible route-runtime normalization patterns or legitimate navigation/footer labels. Toronto, Vancouver, Calgary, Ottawa, and Victoria occurrences seen in rendered documents are legitimate navigation/footer/related-route references; Halifax, Winnipeg, and Seattle are absent. The intended Edmonton and Montreal identities are correct.

## 16. Presentation preservation

The settled presentation remains in the approved order: quote panel, pricing, hero, trust strip, main route content, Route at a Glance, FAQ, related destinations, closing CTA, and footer. Existing approved sections were not redesigned or reordered.

## 17. Desktop/mobile QA

The dedicated Playwright audit passed both routes at 1280×900 and 390×844:

- no horizontal overflow
- responsive quote and glance
- pricing table scrolls internally on mobile
- required computed typography
- one FAQ with exact parity
- desktop and mobile navigation work
- Edmonton mobile ARIA state and Escape close pass (`false` → `true` → `false`)
- chatbot opens on both viewports
- zero clipped controls
- no soft 404
- zero application console/page errors

## 18. Updated A/B/C/D classification

- Edmonton → Montreal: B → **A — Canonical**
- Montreal → Edmonton: D → **A — Canonical**
- Edmonton ↔ Montreal pair: **complete**

Updated route rollup: **44 A, 9 B, 2 C, 1 D = 56**. Among 27 bidirectional pairs: 20 complete, 5 minor cleanup, 1 material, and 1 source repair. Including the two legitimate unpaired directions: 21 complete, 5 minor cleanup, 2 material, and 1 source repair.

## 19. Ownership/tests

- ownership/architecture validator: PASS — 56 routes, 56 owners, zero collisions
- ownership, title, and chatbot-pricing tests: **35/35 PASS**
- syntax: **125/125 current `.mjs` files PASS**
- global FAQ audit: **56/56 canonical**
- global title audit: **56/56 canonical**
- pair finalizer run 2: **0 route changes, 0 asset changes**
- FAQ finalizer: **0 route changes, 0 asset changes**
- title normalizer: **0 route changes, 0 asset changes**

## 20. Browser regression

The deduplicated regression inventory was corrected to include the previously omitted Edmonton → Montreal direction. Actual Step 62 result: **53/53 PASS**, zero failures. Both Edmonton ↔ Montreal directions are included exactly once.

## 21. First aggregate result

A fresh local Git clone, created with local hardlinks disabled, was overlaid with the corrected working-tree `site-copy`, `tools`, and package manifest. Aggregate pass 1 produced:

- **0/56 route drift**
- **0/104 asset drift**

The mandatory first-pass convergence gate passed; no unrelated reconciliation was performed.

## 22. Second aggregate result

Aggregate pass 2 in the same qualifying clone produced:

- **0/56 route drift** versus pass 1
- **0/104 asset drift** versus pass 1

## 23. Working-tree isolation

Comparing `STEP_62_FINAL_WORKSPACE.json` with `STEP_62_BASELINE.json` finds exactly two changed registered route HTML files and zero changed assets:

| Route | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `/edmonton-to-montreal-movers/` | `4ff7a0a3f7c6e3c35959a2412262ea6eea0fbfcf0fcc1b6e9079ef18c74b0cde` | `b5eb8ea18ae3fdbcaa00b02d1e3c29b628028bc507419c796b964271d423716d` |
| `/montreal-to-edmonton-movers/` | `cb842a6b24be6ce2744cda65a1c2771923de1b5ee57907fe36215bbcda77fe73` | `dbf0264af25c60a7d477ed355feb39406c05df79c48a65adc0c22872faf0e010` |

Unrelated registered route changes: **0**. Asset changes: **0/104**.

## 24. Remaining known issues

Outside Step 62 scope, one route remains D (Montreal → Victoria), two routes remain C (Calgary → Montreal and BC → Washington), and nine routes remain B with the Step 61 typography, terminology, metadata, or mobile-navigation defects. The registered Edmonton hydration-free React-snapshot exception remains documented and unchanged. No deployment occurred. Step 63 was not started.

Step 62 is complete.
