# Step 52 — Vancouver ↔ Winnipeg source FAQ cleanup

Scope was limited to `/vancouver-to-winnipeg-movers/` and `/winnipeg-to-vancouver-movers/`. No deployment was performed and Step 53 was not started.

## 1. Step 51 defect confirmed

Direct-owner inspection found the durable gap on **both** directions: each explicit Step 40 template already contained one visible seven-question FAQ and one FAQ heading, but `rebuild-winnipeg-modern-routes.mjs` emitted no `FAQPage`. `finalize-route-faq-architecture.mjs` subsequently synthesized the missing schema from the visible FAQ.

The Step 51 report itself did **not** classify either direction as D. It listed both as B for the independent body-level Inter-versus-Source-Sans-3 finding, while its raw FAQ audit inspected already-finalized checked-in HTML and therefore reported one FAQ section, heading, and `FAQPage`. This report preserves that historical result and separately records the direct-owner defect exposed by Step 52.

| Route | Owner | Raw FAQ | Raw FAQ Heading | Raw FAQPage | Rendered FAQ | Repairing Writer |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `/vancouver-to-winnipeg-movers/` | `rebuild-winnipeg-modern-routes.mjs` | 1 section / 7 Q&A | 1 | 0 | 1 section / 1 heading / 7 Q&A / 1 `FAQPage` | `finalize-route-faq-architecture.mjs` |
| `/winnipeg-to-vancouver-movers/` | `rebuild-winnipeg-modern-routes.mjs` | 1 section / 7 Q&A | 1 | 0 | 1 section / 1 heading / 7 Q&A / 1 `FAQPage` | `finalize-route-faq-architecture.mjs` |

This was a missing-schema defect, not a missing visible FAQ, incomplete visible shell, React/runtime repair, or stale route-data problem.

## 2. Files changed

Durable source/test changes:

- `tools/rebuild-winnipeg-modern-routes.mjs`
- `tools/route-page-ownership.test.mjs`
- `docs/STEP_52_VANCOUVER_WINNIPEG_SOURCE_FAQ_REPORT.md`

Generated Step 52 evidence files were also added at the repository root. Neither route HTML file nor any asset changed bytes.

## 3. Route ownership/source chain

Both static routes remain solely owned by `rebuild-winnipeg-modern-routes.mjs`. The owner consumes frozen facts from `vancouver-winnipeg-route-data.mjs`, visible route content from the two explicit `tools/templates/winnipeg-routes/` templates, and the path-gated Step 40 CSS/JS assets. In aggregate order, the owner runs before the global FAQ finalizer and title normalizer.

The visible FAQ source already existed in each explicit template. Step 52 makes the owner derive the matching `FAQPage` from that visible FAQ during generation, then validates exact question/answer/order parity before writing. No React code, owner change, runtime dependency, pair-specific finalizer, or generated-HTML patch was added.

## 4. Raw FAQ state before

For each direct owner output: one visible FAQ section, one FAQ heading, seven visible Q&A, zero `FAQPage`, zero `.pcm-local-seo`, and no `undefined`. The checked-in output only had a `FAQPage` because the later global finalizer had already run.

## 5. Raw FAQ state after

For each direct owner output: one visible FAQ section, one FAQ heading, seven visible Q&A, exactly one `FAQPage`, exact question/answer/order parity, zero `.pcm-local-seo`, and no `undefined`.

The complete pre-browser component contract also passes for both directions: one H1, one quote panel, one primary form, one pricing section, one pricing table, one Route at a Glance, one FAQ section/heading/implementation/`FAQPage`, and one footer.

## 6. Rendered FAQ state after

Both browser-rendered routes retain one FAQ section, one heading, seven visible Q&A, one `FAQPage`, and exact parity at initial load and after the delayed runtime checkpoints. The global rendered audit reports 56/56 canonical and zero `.pcm-local-seo` findings.

## 7. FAQ finalizer idempotency

The direct-owner chain was measured from route/asset hashes:

- First direct generation: canonical output and zero-byte difference from the checked-in baseline.
- Second direct generation: zero-byte change.
- FAQ finalizer: zero-byte change.
- Title normalizer: zero-byte change.

The global FAQ finalizer remains unchanged and continues to validate/normalize the other registered routes. Pair-specific owner tests now assert exactly one `FAQPage` and exact FAQ parity.

## 8. Approved route facts unchanged confirmation

Both directions retain approximately 2,300 km, 5–13 days, Studio `$2,400+`, 1-bedroom `$3,400+`, 2-bedroom `$5,500+`, 3-bedroom `$8,900+`, 4+ bedroom `$13,000+`, and overall `$2,400–$13,000+`. Entire route HTML hashes are unchanged, providing stronger confirmation that no route fact or wording changed.

## 9. Presentation unchanged confirmation

The route HTML and all 104 current assets are byte-identical to the pre-Step-52 baseline. H1, quote panel, pricing, Route at a Glance, main content, related destinations, CTA, footer, navigation, chatbot, typography, responsive layout, and form presentation are therefore unchanged.

## 10. Directional forms unchanged

- Vancouver → Winnipeg remains `Vancouver, BC` → `Winnipeg, MB`.
- Winnipeg → Vancouver remains `Winnipeg, MB` → `Vancouver, BC`.

Both pass at raw source and every browser lifecycle checkpoint.

## 11. Metadata/title result

Raw and rendered title, OG title, Twitter title, canonical, and OG URL remain directional and canonical. The owner now also emits the existing authoritative-title marker so the title normalizer is a zero-byte pass. The global title audit reports 56/56 canonical.

## 12. Browser desktop/mobile smoke QA

Both routes pass at 1280×900 and 390×844: no page overflow, FAQ renders correctly, mobile pricing scroll remains internal, desktop/mobile navigation works, Escape closes the mobile menu with correct `aria-expanded` state, chatbot opens/closes, controls are not clipped, images are not broken, and no application exception occurs. The only console item is the previously documented sandbox denial for an external resource.

## 13. Updated source-level classification

The pair's **direct-owner FAQ architecture is canonical** after Step 52. A D→A/B move cannot truthfully be recorded because Step 51 classified both routes as B, not D. Under the complete Step 51 rubric they remain B until the separately recorded body-level typography finding is addressed; Step 52 did not alter that presentation rule.

## 14. Updated global counts if measured

Rendered FAQ and title contracts were directly measured at 56/56 canonical. The Step 51 classification counts remain 34 A, 11 B, 2 C, and 9 D because this pair was already in B and Step 52 intentionally did not address its independent typography classification. No other route was reclassified.

## 15. Ownership/tests result

- Ownership/architecture validator: PASS, 56 routes, exactly one owner each, zero collisions.
- Ownership, title, and chatbot-pricing tests: 35/35 PASS.
- Pair owner order/idempotency and new FAQ parity assertions: PASS.
- Syntax checks across the owner, data, registry/manifest, finalizers, aggregate runner, and focused audit: PASS.
- Global FAQ audit: 56/56 canonical.
- Global title audit: 56/56 canonical.

## 16. Regression result

The current deduplicated browser regression harness contains 52 routes and passes 52/52. Both Vancouver ↔ Winnipeg directions pass route identity, title, directional form values, pricing presence, navigation, chatbot, body integrity, and zero `.pcm-local-seo`/`undefined` checks. Counts were not inflated to the 56-route ownership inventory.

## 17. First aggregate result

A fresh temporary Git clone was populated with the corrected `tools`, `site-copy`, and package source from the working tree. Its pre-run hashes matched the working-tree baseline exactly.

Required result: **0/56 route drift; 0/104 asset drift**.

## 18. Second aggregate result

The aggregate was run again in the same isolated clone.

Required result: **0/56 route drift; 0/104 asset drift**.

## 19. Working-tree isolation

Actual route HTML changes: **none**. Direct owner generation now creates the same canonical bytes that previously required the FAQ finalizer. No unrelated route HTML and no asset changed. Source changes are limited to the Vancouver ↔ Winnipeg owner, its ownership/idempotency test, this report, and Step 52 evidence files.

## 20. Remaining known issues

- The independent Step 51 body-level typography classification for Vancouver ↔ Winnipeg was not changed in this FAQ-only source cleanup.
- The nine Step 51 D routes with raw React-owned FAQ Q&A omissions remain outside Step 52.
- The two Step 51 material routes and other recorded minor-cleanup items remain outside Step 52.
- The external resource blocked by the offline browser sandbox remains non-application noise.

Step 52 is complete.
