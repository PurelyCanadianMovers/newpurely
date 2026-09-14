# Step 66 — Calgary ↔ Montreal cleanup

Scope was limited to `/calgary-to-montreal-movers/` and `/montreal-to-calgary-movers/`. No deployment occurred and Step 67 was not started.

## 1. Step 65 defects confirmed

| Route | Step 65 class | Exact defect | Owner | Declared / actual render | Rendered glance count |
| --- | --- | --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | C — Material | Two visible Route-at-a-Glance headings/blocks | `checked-in-static-route-source` | `static` / static | 2 |
| `/montreal-to-calgary-movers/` | A — Canonical | None | `generate-spa-routes.mjs` | `react-spa` / React SPA | 1 |

The render gate passed. Step 65 recorded canonical raw/rendered FAQ, canonical raw/rendered titles, Source Sans 3 body typography, correct forms, one pricing table, navigation, and chatbot for the pair. The Calgary direction's only current Step 65 defect was the duplicate glance.

## 2. Files changed

Production/source files changed by Step 66:

- `site-copy/calgary-to-montreal-movers/index.html`
- `tools/finalize-montreal-calgary-routes.mjs`

Audit/report support added:

- `tools/audit-step66-calgary-montreal.mjs`
- `STEP_66_HASHES.mjs`
- `docs/STEP_66_CALGARY_MONTREAL_CLEANUP_REPORT.md`
- `STEP_66_*.json` evidence files

`site-copy/montreal-to-calgary-movers/index.html` has a pre-existing dirty-worktree status relative to Git HEAD, but its Step 66 baseline and final SHA-256 are identical. No Step 66 byte change occurred there.

## 3. Ownership/render architecture

- Calgary → Montreal remains a hydration-free static document owned by `checked-in-static-route-source`. It has no module bootstrap and retains conversion, Step 36, static navigation, and static chatbot assets.
- Montreal → Calgary remains SPA-owned by `generate-spa-routes.mjs`, has a module bootstrap, and retains React navigation/chatbot plus the conversion and Step 36 runtime.
- Both retain `finalize-montreal-calgary-routes.mjs`, FAQ finalization, and title normalization. Calgary → Montreal also retains the registered bootstrap stripper.
- The ownership/architecture validator reports 56 routes, 56 owners, zero collisions, and no declared/actual rendering mismatch.

## 4. Durable source chain

- Calgary → Montreal: checked-in static route HTML → `finalize-montreal-calgary-routes.mjs` using `montreal-calgary-route-data.mjs` → bootstrap stripper → FAQ finalizer → title normalizer → conversion/Step 36/static navigation/static chat runtime.
- Montreal → Calgary: preserved SPA-owned route HTML and compiled route component → `finalize-montreal-calgary-routes.mjs` using the same frozen data → FAQ finalizer → title normalizer → React/conversion/Step 36 runtime.

The correction is in the registered pair finalizer, so a full aggregate reproduces it without changing ownership or relying on DOM position alone.

## 5. Authoritative facts preserved

The current durable authority remains `tools/montreal-calgary-route-data.mjs`:

- Distance: approximately 3,600 km (`~3,600 km` in the glance)
- Transit: 7–19 days
- Studio: $2,500+
- 1-bedroom: $4,700+
- 2-bedroom: $6,300+
- 3-bedroom: $10,000+
- 4+ bedroom: $15,000+
- Overall planning range: $2,500–$15,000+

The data module, five-row pricing table, surviving glance, body copy, FAQ/schema, form runtime, and applicable cost guidance remain consistent. No external research was used and no authoritative fact changed.

## 6. Duplicate glance root cause

The first glance was a legacy standalone section serialized in Calgary → Montreal's checked-in static HTML. Its source breadcrumbs identify `client/src/pages/services/CalgaryToMontrealMovers.tsx:197–201`, with an `h2` reading `Calgary–Montreal Route at a Glance`.

The second glance was the approved Step 36 pair card created by `glance()` in `site-copy/assets/step36-montreal-calgary.js`. It uses `.pcm-step36-glance`, the pair's canonical three-fact presentation, and the frozen facts.

The duplicate survived because the existing runtime cleanup searched only inside the `Moving from Calgary to Montreal?` intro section and only for a legacy `h3`. The old block was a separate section headed by `h2`, so it was never selected.

## 7. Glance count before

- Calgary → Montreal raw HTML: one legacy glance.
- Calgary → Montreal rendered initial, 1.5-second, and 5.5-second states: two visible glance headings/blocks.
- Montreal → Calgary rendered: one canonical Step 36 glance.

## 8. Exact correction

The registered pair finalizer now does two Calgary-only operations:

1. Removes the legacy standalone Calgary–Montreal glance section by its route-specific heading while explicitly preserving any Step 36 canonical structure.
2. Serializes the existing canonical `.pcm-step36-glance` markup into the Calgary intro section from the frozen data authority.

The runtime therefore finds the canonical structure already present and does not inject a second copy. No CSS, shared runtime, React bundle, navigation, chatbot, form, pricing, FAQ, metadata text, or reverse-route source was changed.

## 9. Glance count after

- Calgary → Montreal raw HTML: exactly one heading and one `.pcm-step36-glance`; no legacy source breadcrumb remains.
- Calgary → Montreal initial, 1.5-second, 5.5-second, desktop, and mobile DOM: exactly one visible glance and zero hidden glances.
- Montreal → Calgary: exactly one rendered glance.
- Fresh global structure audit: zero routes with a glance count other than one.

## 10. Delayed-runtime stability

Calgary → Montreal was inspected raw, at DOMContentLoaded, after approximately 1.5 seconds, and after approximately 5.5 seconds. Every state retained one glance, one pricing section/table, one FAQ/FAQPage, the correct title, stable form values, no homepage contamination, and no legacy cost block. The dedicated trace also found one visible glance at initial, 1.5-second, and 5.5-second snapshots for both directions.

## 11. Montreal → Calgary preservation result

PASS. Its Step 66 baseline and final SHA-256 are both `05c6cfd62819bffdcc1f9bf4e04566d53d1e1f1ce5917b880a4e3584c6296d9f`. It retains one settled quote, pricing section/table, glance, FAQ/FAQPage, correct form, metadata, typography, navigation, chatbot, and React architecture. No route byte or behavioral change was introduced.

## 12. Form result

- Calgary → Montreal: `Calgary, AB` → `Montreal, QC` in raw attributes/values, initial DOM, 1.5-second DOM, and 5.5-second DOM.
- Montreal → Calgary: `Montreal, QC` → `Calgary, AB` after its legitimate React/conversion mount at 1.5 seconds and at 5.5 seconds. The values and value attributes agree; placeholders were not used as proof.

## 13. Metadata result

Both settled routes have a route-specific title with `| Purely Canadian Movers` exactly once; matching `og:title` and `twitter:title`; matching route-specific meta/OG/Twitter descriptions; a self canonical; and the correct self `og:url`. Global raw and rendered title audits report 56/56 canonical.

## 14. Pricing result

Both routes settle with one `.pcm-route-cost`, one five-row table, the unchanged approved values, zero stale pricing cards, and no `Moving Cost Breakdown`. At 390×844, the 760px table scrolls inside its wrapper without causing page-level overflow.

## 15. FAQ result

The pair has one settled FAQ section, one FAQ heading, one FAQPage, exact visible/schema question-answer-order parity, and zero `.pcm-local-seo`. Calgary → Montreal also has the full canonical FAQ contract in raw HTML. Montreal → Calgary retains its approved SPA shell and finalizes the complete visible route structures after hydration; its durable raw FAQ/title contracts remain canonical. Global FAQ results are 56/56 raw and 56/56 rendered.

## 16. Typography result

Both directions compute Playfair Display for headings and Source Sans 3 for body, form, and button text. H1 is 48px / 60px / 700 at 1280×900 and 36px / 45px / 700 at 390×844. No typography declaration changed.

## 17. Contamination result

Neither route has homepage contamination, soft-404 content, `.pcm-local-seo`, visible `undefined`, expired promotion copy, legacy cost blocks, stale pricing cards, or guaranteed-pricing language. Other-city mentions are confined to legitimate navigation, footer, and related-route links. The approved shared footer link labelled `Valuation Coverage` and the React conversion proof language are not route-body contamination and were already present on the Step 65 A direction; they were not changed.

## 18. Idempotency result

- Calgary's checked-in owner is non-executable by design; its durable source is the checked-in document. The first corrected pair-finalizer run changed only Calgary → Montreal.
- Montreal's direct SPA owner ran twice with zero route or asset drift and preserved both outputs.
- Second pair-finalizer run: zero-byte change.
- FAQ finalizer: zero-byte change.
- Title normalizer: zero-byte change and reported zero normalized route documents.
- Calgary's registered bootstrap-stripper route finalizer: zero-byte change.

## 19. Desktop/mobile QA

At 1280×900 and 390×844, both routes have no horizontal page overflow, one visible glance, responsive quote layout, internal mobile pricing scroll, correct typography, one settled FAQ, working mobile navigation with `false → true → false` and Escape closure, working chatbot open/close, no clipped core controls, no soft 404, and no application/page errors. The only console message was the expected locally blocked external analytics request (`ERR_NETWORK_ACCESS_DENIED`).

## 20. Updated A/B/C/D classification

- Calgary → Montreal: C → A.
- Montreal → Calgary: A → A.
- Pair: complete.
- Updated route totals: **47 A, 8 B, 1 C, 0 D** across 56 routes.
- Updated bidirectional-pair totals: **22 complete, 5 minor cleanup, 0 material, 0 source repair** across 27 pairs.

## 21. Confirmation D remains zero

D remains **0/56**. Ownership remains explicit, render declarations match actual architecture, the finalizer is deterministic and route-scoped, and both aggregate passes converge without drift.

## 22. Global FAQ/title results

- Raw FAQ: 56/56 canonical.
- Rendered FAQ: 56/56 canonical.
- Raw titles: 56/56 canonical.
- Rendered titles: 56/56 canonical.
- Visible `.pcm-local-seo`: 0/56.
- Visible unintended `undefined`: 0/56.

## 23. Ownership/tests

- Ownership/architecture validator: PASS — 56 routes, 56 owners, zero collisions.
- Ownership, title, and chatbot-pricing tests: **35/35 PASS**.

## 24. Syntax

All current `.mjs` files under `tools`, including the new Step 66 audit harness: **127/127 PASS**, zero failures.

## 25. Browser regression

The established deduplicated browser regression attempted 53 routes and passed **53/53**, including Calgary → Montreal and Montreal → Calgary. Failures: zero.

## 26. First aggregate result

A fresh local Git clone with hardlinks disabled was overlaid with the corrected `site-copy`, `tools`, and package manifest. Its 56-route/104-asset baseline matched the corrected workspace exactly. Aggregate pass 1 produced:

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed; no reconciliation or unrelated output copy-back was performed.

## 27. Second aggregate result

Aggregate pass 2 in the same qualifying clone produced:

- **0/56 route drift**.
- **0/104 asset drift**.

## 28. Working-tree isolation

Comparing `STEP_66_FINAL_WORKSPACE.json` with the pre-edit `STEP_66_BASELINE.json`:

- Registered route HTML changes: **1/56**, only `/calgary-to-montreal-movers/`.
- `/montreal-to-calgary-movers/`: zero-byte change.
- Asset changes: **0/104**.
- The original workspace after aggregate testing matches its pre-aggregate corrected hash set exactly; aggregate work remained isolated in the temporary clone.

Pre-edit target hashes:

- Calgary → Montreal: `737685c70ef0573998690acd44bac0bfcc8669cd63ec9671b9295a030953686f`
- Montreal → Calgary: `05c6cfd62819bffdcc1f9bf4e04566d53d1e1f1ce5917b880a4e3584c6296d9f`

Final Calgary → Montreal hash: `90c254c94a335df76ee4763280a3a857c3f4c63a1872f0f63239dac12174fafe`.

## 29. Remaining known issues

The Step 65 queue now contains eight B routes and one C route: Calgary ↔ Halifax mobile Escape behavior; Edmonton ↔ Winnipeg insurance terminology; Halifax → Vancouver raw canonical; Vancouver ↔ Winnipeg body font; Victoria → Ottawa ARIA/Escape behavior; and BC → Washington legacy pricing/raw canonical and OG URL. Calgary ↔ Montreal is no longer in the cleanup queue. D remains zero.

No deployment occurred. Step 67 was not started.

Step 66 is complete.
