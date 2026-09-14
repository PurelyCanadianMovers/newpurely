# Step 64 — Montreal ↔ Victoria cleanup

Scope: `/montreal-to-victoria-movers/` and `/victoria-to-montreal-movers/` only. No deployment occurred. Step 65 was not started.

## 1. Step 63 defect confirmed

| Route | Step 63 class | Exact defect | Owner | Repair layer |
| --- | --- | --- | --- | --- |
| `/montreal-to-victoria-movers/` | D — Architecture/source | Raw output had one FAQ heading, zero visible answers, and one 12-entry FAQPage; raw canonical and `og:url` pointed to the homepage. Browser/runtime repair supplied the visible FAQ and self URLs. | `generate-spa-routes.mjs` | `finalize-montreal-victoria-routes.mjs` |
| `/victoria-to-montreal-movers/` | B — Minor cleanup | The mobile menu opened with `aria-expanded=true`, but Escape left it open. | `checked-in-static-route-source` | `finalize-montreal-victoria-routes.mjs` navigation bridge |

Before editing, `STEP_64_BASELINE.json` recorded 56 registered route hashes and 104 asset hashes. Target baselines were `ac28d505cd78b7bec6365ff830899a53e57a2e1f4cc2faa92564043b409b08b6` and `ee43207f97d7103191563cc396f3b53585d0011292a437a2a499ad1a0559b396`.

## 2. Which route was the final D issue

Montreal → Victoria was the sole remaining D route. Victoria → Montreal was B for the bounded mobile Escape defect.

## 3. Files changed

Durable implementation and output:

- `tools/finalize-montreal-victoria-routes.mjs`
- `site-copy/montreal-to-victoria-movers/index.html`
- `site-copy/victoria-to-montreal-movers/index.html`

Validation and evidence:

- `tools/audit-step64-montreal-victoria.mjs`
- `docs/STEP_64_MONTREAL_VICTORIA_CLEANUP_REPORT.md`
- Step 64 JSON hash/audit artifacts in the repository root

No asset changed.

## 4. Ownership/render architecture

Current registry truth and actual files agree. Montreal → Victoria remains owned by `generate-spa-routes.mjs`, declared `react-spa`, and actually loads the compiled React module. Victoria → Montreal remains a checked-in static, hydration-free route with `static-nav.js`, `static-chat.js`, and `conversion-boost.js`. Both retain the allowed pair post-processor, global FAQ finalizer, and title normalizer. Navigation and chatbot architecture were not changed or merged.

## 5. Durable source chain

The aggregate chain preserves the SPA owner output, then runs `finalize-montreal-victoria-routes.mjs`, the global FAQ finalizer, and the title normalizer. The pair finalizer now writes the canonical raw FAQ/schema, raw self URLs, directional form values, pricing fallback, and glance fallback before runtime. Its observer reconciles the declared React lifecycle immediately after DOM changes without consuming another route page. The reverse static route receives the same durable contracts plus its route-scoped Escape bridge.

## 6. Authoritative facts preserved

The current durable route output and pair source agree on approximately **4,800 km**, **10–22 days**, Studio **$3,000+**, 1-bedroom **$5,300+**, 2-bedroom **$7,000+**, 3-bedroom **$11,000+**, 4+ bedroom **$16,000+**, and overall **$3,000–$16,000+**. The earlier 4,400 km planning value in the task prompt was not used because current durable project source consistently contains 4,800 km. No external research was used and no current authoritative fact was changed.

## 7. Exact defect before

Montreal → Victoria preserved a mutable SPA snapshot whose raw FAQ shell exposed no answer cards and whose raw canonical/OG URL targeted the homepage. Visible FAQ cards and self URLs appeared only after browser execution. The same raw shells relied on conversion/hydration for pricing and, on Montreal → Victoria, the glance block. Victoria → Montreal's static menu lacked Escape dismissal.

## 8. Exact correction

The existing pair finalizer now writes one visible 12-card route FAQ and one matching FAQPage, self canonical/OG URL metadata, route-specific description where defective, settled directional input values, one canonical five-row pricing fallback, and one glance fallback. The runtime removes transient duplicate schema during React DOM changes. The reverse mobile bridge removes `is-open`, resets `aria-expanded=false`, and restores trigger focus on Escape.

## 9. Raw FAQ before/after

| Route | Before | After |
| --- | --- | --- |
| Montreal → Victoria | 1 section / 1 heading / 0 visible / 1×12 schema; 12 parity differences | 1 / 1 / 12 / 1×12; exact question, answer, and order parity |
| Victoria → Montreal | 1 / 1 / 12 / 1×12; exact parity | unchanged canonical 1 / 1 / 12 / 1×12 |

## 10. Rendered FAQ result

Both directions render one FAQ section, one heading, 12 visible answers, and one 12-entry FAQPage with exact parity at the tested initial, 1–2 second, 5+ second, desktop, and mobile states. `runtimeChanged=false` at settled comparison.

## 11. FAQ finalizer idempotency

After pair-finalizer run 2, `finalize-route-faq-architecture.mjs` changed 0 routes and 0 assets.

## 12. Title normalizer idempotency

`normalize-route-title-metadata.mjs` changed 0 routes and 0 assets. Pair-finalizer run 2 also changed 0 routes and 0 assets.

## 13. Typography result

Both routes compute Playfair Display headings and Source Sans 3 body, paragraph, pricing, FAQ, form, button, and CTA text. H1 is 48px / 60px / 700 at 1280×900 and 36px / 45px / 700 at 390×844. No typography change was required.

## 14. Metadata result

Both raw and rendered routes have route-specific titles, the `| Purely Canadian Movers` suffix exactly once, matching OG/Twitter titles, route-specific descriptions, self canonicals, and self `og:url` values.

## 15. Form result

Actual values pass in raw output and across the browser lifecycle:

- Montreal → Victoria: `Montreal, QC` → `Victoria, BC`
- Victoria → Montreal: `Victoria, BC` → `Montreal, QC`

## 16. Pricing/glance result

Raw and rendered checks find one pricing section, one five-row table, and one Route at a Glance per route. Mobile tables scroll internally. There is no visible `Moving Cost Breakdown`, duplicate pricing, duplicate glance, or stale value.

## 17. Directional-content preservation

Montreal → Victoria remains Montreal-origin and Victoria/Nanaimo/Vancouver-Island-destination content. Victoria → Montreal remains Victoria/Vancouver-Island-origin and Montreal/Quebec-destination content. Ferry context and province-specific language remain directional; no Vancouver → Victoria route logic was introduced.

## 18. Contamination result

Target raw and rendered output contains zero `.pcm-local-seo`, zero unintended `undefined`, zero stale promo, zero guaranteed-pricing claim, and zero legacy cost component. Other-city occurrences are confined to navigation/footer/related-route links. Existing approved FAQ protection terminology was preserved because Step 63 did not classify it as a defect.

## 19. Presentation preservation

The approved quote panel, pricing, hero, trust strip, main content, glance, FAQ, related destinations, closing CTA, footer, and each direction's navigation/chat architecture remain intact. No approved section was redesigned.

## 20. Desktop/mobile QA

The dedicated browser audit passes both routes at 1280×900 and 390×844: no horizontal overflow, responsive quote/glance, internal mobile table scrolling, correct typography, one FAQ, working navigation/chatbot, no clipped controls, no soft 404, and zero application page/console errors. Mobile menu state is `false → true → false` around open and Escape.

## 21. Updated A/B/C/D classification

- Montreal → Victoria: D → **A — Canonical**
- Victoria → Montreal: B → **A — Canonical**
- pair: **complete**
- route rollup: **46 A, 8 B, 2 C, 0 D = 56**

## 22. Whether D queue reached zero

Yes. Architecture/source queue: **0**.

## 23. Global raw/rendered FAQ results

- raw FAQ: **56/56 canonical**
- rendered FAQ: **56/56 canonical**
- target `.pcm-local-seo`: **0**
- unintended visible `undefined`: **0**

## 24. Global title results

- raw title contract: **56/56 canonical**
- rendered title contract: **56/56 canonical**

## 25. Ownership/tests

- ownership/architecture validator: PASS — 56 routes, 56 owners, zero collisions
- ownership, title, and chatbot-pricing tests: **35/35 PASS**
- pair finalizer run 2: 0 route changes, 0 asset changes
- FAQ finalizer: 0 route changes, 0 asset changes
- title normalizer: 0 route changes, 0 asset changes

## 26. Syntax

Current `.mjs` files: **126/126 PASS**, zero failures.

## 27. Browser regression

Current deduplicated browser regression: **53/53 PASS**, zero failures. Both Montreal ↔ Victoria directions are included exactly once.

## 28. First aggregate result

A fresh local Git clone with hardlinks disabled was overlaid with the corrected `site-copy`, `tools`, and package manifests. Aggregate pass 1 produced:

- **0/56 route drift**
- **0/104 asset drift**

The mandatory first-pass gate passed. No unrelated output was reconciled.

## 29. Second aggregate result

Aggregate pass 2 in the same qualifying clone produced:

- **0/56 route drift**
- **0/104 asset drift**

## 30. Working-tree isolation

Comparing `STEP_64_FINAL_WORKSPACE.json` with `STEP_64_BASELINE.json` finds exactly two changed registered route files and zero changed assets:

| Route | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `/montreal-to-victoria-movers/` | `ac28d505cd78b7bec6365ff830899a53e57a2e1f4cc2faa92564043b409b08b6` | `82944190fbef5864be35ea8758ff26417e9209dab4e0c88b7227a92529e56b36` |
| `/victoria-to-montreal-movers/` | `ee43207f97d7103191563cc396f3b53585d0011292a437a2a499ad1a0559b396` | `f938ddd3b3530bd4a189007b096388cf74c61b0c9ca036094eab1e7701ececd5` |

Unrelated registered route changes: **0**. Asset changes: **0/104**.

## 31. Remaining known issues

Outside Step 64 scope, 8 B routes and 2 C routes remain: Calgary ↔ Halifax mobile Escape behavior; Edmonton ↔ Winnipeg terminology; Halifax → Vancouver raw canonical; Vancouver ↔ Winnipeg body font; Victoria → Ottawa ARIA/Escape behavior; Calgary → Montreal duplicate glance; and BC → Washington legacy pricing/raw metadata. No D route remains. No deployment occurred, and Step 65 was not started.

Step 64 is complete.
