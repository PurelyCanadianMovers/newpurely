# Step 53 — Post-Step-52 cleanup-queue refresh

Scope: read-only audit of the 56 registered route pages after Step 52. No route HTML, generator, template, route data, ownership/manifest file, finalizer, asset, navigation, chatbot, or shared runtime was modified. No deployment occurred and Step 54 was not started.

## 1. Current 56-route baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Full-page ownership: **56/56 exactly one owner each**.
- Ownership collisions: **0**.
- Current files under `site-copy/assets`: **104**.
- The pre-audit SHA-256 baseline covered all 56 route HTML files and all 104 assets.
- The working tree was already materially dirty before Step 53. This audit preserved those pre-existing changes.

## 2. Step 52 Vancouver ↔ Winnipeg source result

Step 52 succeeded at the source-FAQ level. Both direct-owner outputs now contain the complete visible FAQ and matching schema, and neither needs the FAQ finalizer to synthesize missing architecture.

| Route | Full-page owner | Raw FAQ section | Raw FAQ heading | Raw visible Q&A | Raw `FAQPage` | Raw parity | Rendered FAQ section / `FAQPage` | FAQ finalizer byte change | `.pcm-local-seo` | visible `undefined` | Current class |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | ---: | ---: | --- |
| `/vancouver-to-winnipeg-movers/` | `rebuild-winnipeg-modern-routes.mjs` | 1 | 1 | 7 | 1 | exact 7/7 | 1 / 1, exact 7/7 | 0 bytes | 0 | 0 | **B — Minor cleanup** |
| `/winnipeg-to-vancouver-movers/` | `rebuild-winnipeg-modern-routes.mjs` | 1 | 1 | 7 | 1 | exact 7/7 | 1 / 1, exact 7/7 | 0 bytes | 0 | 0 | **B — Minor cleanup** |

The answer to the source question is **yes**: both directions are now source-canonical for FAQ architecture. The answer to the whole-route A/B/C/D question is **no**: both remain B because the independent Step 51 body-level font defect (`Inter` rather than `Source Sans 3`) was outside Step 52.

Pair-owner verification in the temporary clone showed 0 route and 0 asset changes after the first owner run, the second owner run, and the FAQ-finalizer run. This also confirms the owner is deterministic and the finalizer is no longer required for this pair's FAQ architecture.

## 3. Step 51 D routes re-audited

All nine Step 51 D routes still have the same raw-source defect. Step 52 did not change any of them.

| Route | Step 51 status | Current raw FAQ state | Repair still required? | Current status |
| --- | --- | --- | --- | --- |
| Calgary → Toronto | D | 1 section; 1 heading; 0 visible; 1 schema with 11 entries | Yes | **D** |
| Toronto → Calgary | D | 1 section; 1 heading; 0 visible; 1 schema with 9 entries | Yes | **D** |
| Edmonton → Toronto | D | 1 section; 1 heading; 0 visible; 1 schema with 12 entries | Yes | **D** |
| Toronto → Edmonton | D | 1 section; 1 heading; 0 visible; 1 schema with 12 entries | Yes | **D** |
| Edmonton → Vancouver | D | 1 section; 1 heading; 0 visible; 1 schema with 9 entries | Yes | **D** |
| Montreal → Edmonton | D | 1 section; 1 heading; 0 visible; 1 schema with 8 entries | Yes | **D** |
| Montreal → Toronto | D | 1 section; 1 heading; 0 visible; 1 schema with 12 entries | Yes | **D** |
| Toronto → Montreal | D | 1 section; 1 heading; 0 visible; 1 schema with 9 entries | Yes | **D** |
| Montreal → Victoria | D | 1 section; 1 heading; 0 visible; 1 schema with 12 entries | Yes | **D** |

## 4. Remaining raw FAQ/source defects

The remaining raw FAQ issue count is **9/56**. Each affected page has an FAQ shell and schema but no durable visible Q&A in owner/checked-in HTML. Raw parity therefore fails even though the browser result is canonical.

No route newly entered this set. Vancouver ↔ Winnipeg is not in it.

## 5. Owner vs FAQ-finalizer behavior

For all nine remaining D routes:

- `generate-spa-routes.mjs` is the declared full-page owner.
- The owner preserves the existing SPA-owned route document and changes zero bytes.
- The raw document has one FAQ section/heading and one `FAQPage`, but zero visible Q&A.
- `finalize-route-faq-architecture.mjs` changes zero bytes because it cannot derive visible FAQ cards that are absent from raw markup.
- `normalize-route-title-metadata.mjs` changes zero bytes.
- Browser execution renders canonical visible Q&A and reconciles the final schema through the React bundle and pair-specific injected runtime normalizer.

This is the required distinction: **47/56 raw documents are FAQ-canonical; 56/56 browser-rendered documents are FAQ-canonical**.

## 6. Direct-owner idempotency findings

One isolated `generate-spa-routes.mjs` run covered all nine D routes because they share that owner.

| Stage | Route drift | Asset drift | Finding |
| --- | ---: | ---: | --- |
| Baseline → first direct-owner run | 0/56 | 0/104 | Owner is deterministic but preserves incomplete raw FAQ output |
| First → second direct-owner run | 0/56 | 0/104 | Second run changes zero bytes |
| Second owner → FAQ finalizer | 0/56 | 0/104 | FAQ finalizer changes zero bytes and does not make the raw pages canonical |
| FAQ finalizer → title normalizer | 0/56 | 0/104 | Title normalizer changes zero bytes |

Thus the owner itself is deterministic, its preserved output is incomplete, downstream browser execution is required for canonical visible FAQ architecture, and the global FAQ finalizer is not the repairing writer for these nine pages.

## 7. Step 51 minor routes re-audited

No Step 51 B route was indirectly resolved. Step 52 changed source durability for Vancouver ↔ Winnipeg but intentionally left its separate typography defect in place.

| Route | Step 51 status | Current status | Remaining minor defect |
| --- | --- | --- | --- |
| Calgary → Halifax | B | **B** | Mobile menu does not close on Escape |
| Halifax → Calgary | B | **B** | Mobile menu does not close on Escape |
| Edmonton → Montreal | B | **B** | Visible `fully insured`; mobile open state/`aria-expanded` and Escape behavior |
| Edmonton → Winnipeg | B | **B** | Visible `fully insured` terminology |
| Winnipeg → Edmonton | B | **B** | Visible `fully insured` terminology |
| Halifax → Vancouver | B | **B** | Raw canonical points to the reverse route until runtime correction |
| Vancouver → Edmonton | B | **B** | Visible `fully insured` terminology |
| Vancouver → Winnipeg | B | **B** | Body computes to Inter rather than Source Sans 3 |
| Winnipeg → Vancouver | B | **B** | Body computes to Inter rather than Source Sans 3 |
| Victoria → Montreal | B | **B** | Mobile menu does not close on Escape |
| Victoria → Ottawa | B | **B** | Mobile trigger lacks `aria-expanded`; Escape does not close menu |

## 8. Former material routes verification

The three directions standardized in Steps 49 and 50 remain **A — Canonical**:

- Vancouver → Seattle.
- Seattle → Vancouver.
- Victoria → Vancouver, retained as a legitimate unpaired direction.

All three passed the current browser regression and raw title/FAQ contracts. No `/vancouver-to-victoria-movers/` route was referenced, created, or counted.

## 9. Raw title contracts

- `<title>`: **56/56 canonical**.
- `og:title`: **56/56 canonical**.
- `twitter:title`: **56/56 canonical**.
- All three fields agree per route and contain the exact brand suffix once.
- Browser-evaluated title contracts: **56/56 canonical**.

## 10. Raw FAQ canonical count

- One raw FAQ section: **56/56**.
- One raw FAQ heading: **56/56**.
- One raw `FAQPage`: **56/56**.
- Complete raw visible/schema parity with at least one visible Q&A: **47/56**.
- Raw-source failures: **9/56**, exactly the D routes in section 3.

## 11. Final/rendered FAQ canonical count

- Browser-rendered canonical FAQ: **56/56**.
- Each route settles to one visible FAQ section, one heading, one `FAQPage`, and exact visible/schema question-answer-order parity.
- The nine D routes settle respectively to 11, 9, 12, 12, 9, 12, 12, 9, and 12 matching visible/schema entries in the section-3 order. Montreal → Edmonton changes from 8 raw schema entries to 12 rendered entries.

## 12. `.pcm-local-seo` / `undefined` results

- Raw visible `.pcm-local-seo` elements: **0/56 routes affected**.
- Rendered `.pcm-local-seo` elements: **0/56 routes affected**.
- Unintended visible `undefined`: **0/56 routes affected**.
- Soft-404 signatures: **0/56 routes affected**.
- Raw homepage-URL contamination remains on three already-known routes: BC → Washington, Montreal → Edmonton, and Montreal → Victoria. The first is part of its C defect; the latter two remain D and are corrected at runtime.

## 13. Source-durability findings

| Route(s) | Full-page owner / data source | Template/source | Post-processors | Mutable generated-route dependency |
| --- | --- | --- | --- | --- |
| Calgary ↔ Toronto | `generate-spa-routes.mjs`; compiled route data in `site-copy/assets/index-CNBNs70h.js` | Generic SPA entry plus preserved target HTML | Calgary/Toronto finalizer; FAQ finalizer; title normalizer | **Yes** — owner preserves the existing generated target HTML |
| Edmonton ↔ Toronto | Same SPA owner and compiled bundle | Generic SPA entry plus preserved target HTML | Toronto/Edmonton finalizer; FAQ finalizer; title normalizer | **Yes** |
| Montreal ↔ Toronto | Same SPA owner and compiled bundle | Generic SPA entry plus preserved target HTML | Montreal/Toronto finalizer; FAQ finalizer; title normalizer | **Yes** |
| Edmonton → Vancouver | Same SPA owner and compiled bundle | Generic SPA entry plus preserved target HTML | Vancouver/Edmonton finalizer; FAQ finalizer; title normalizer | **Yes** |
| Montreal → Edmonton | Same SPA owner and compiled bundle | Generic SPA entry plus preserved target HTML | Montreal/Edmonton finalizer; FAQ finalizer; title normalizer | **Yes** |
| Montreal → Victoria | Same SPA owner and compiled bundle | Generic SPA entry plus preserved target HTML | Montreal/Victoria finalizer; FAQ finalizer; title normalizer | **Yes** |

The companion directions Edmonton → Montreal, Vancouver → Edmonton, and Victoria → Montreal do not have this raw FAQ omission. No D route reads another direction's HTML as its template, but all nine depend on their own mutable generated output being preserved. That self-input/build-order dependency is why they remain D and high priority.

## 14. Exact source defect classification

| Route | Owner | Source defect | Repairing writer at browser time | Scope to fix |
| --- | --- | --- | --- | --- |
| Calgary → Toronto | `generate-spa-routes.mjs` | FAQ source exists but owner does not render it; build-order dependency | Compiled React runtime + Calgary/Toronto inline normalizer | Pair-scoped finalizer/owner output |
| Toronto → Calgary | same | same | same | same pair |
| Edmonton → Toronto | `generate-spa-routes.mjs` | FAQ source exists but owner does not render it; build-order dependency | Compiled React runtime + Toronto/Edmonton inline normalizer | Pair-scoped finalizer/owner output |
| Toronto → Edmonton | same | same | same | same pair |
| Edmonton → Vancouver | `generate-spa-routes.mjs` | FAQ source exists but owner does not render it; build-order dependency | Compiled React runtime + Vancouver/Edmonton inline normalizer | Direction-scoped raw output within the pair finalizer |
| Montreal → Edmonton | `generate-spa-routes.mjs` | FAQ source exists but owner does not render it; raw schema is also stale 8→12; build-order dependency | Compiled React runtime + Montreal/Edmonton finalizer | Direction-scoped raw output within the pair finalizer |
| Montreal → Toronto | `generate-spa-routes.mjs` | FAQ source exists but owner does not render it; build-order dependency | Compiled React runtime + Montreal/Toronto inline normalizer | Pair-scoped finalizer/owner output |
| Toronto → Montreal | same | same | same | same pair |
| Montreal → Victoria | `generate-spa-routes.mjs` | FAQ source exists but owner does not render it; build-order dependency | Compiled React runtime + Montreal/Victoria inline normalizer | Direction-scoped raw output within the pair finalizer |

## 15. Pair/unpaired rollup

| Pair / direction | Route A | Route B | Status | Primary remaining issue |
| --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | complete | None |
| Calgary ↔ Halifax | B | B | minor cleanup | Mobile Escape closure |
| Calgary ↔ Montreal | C | A | material | Duplicate glance on Calgary → Montreal |
| Calgary ↔ Ottawa | A | A | complete | None |
| Calgary ↔ Toronto | D | D | source repair | Raw visible FAQ absent |
| Calgary ↔ Vancouver | A | A | complete | None |
| Calgary ↔ Winnipeg | A | A | complete | None |
| Edmonton ↔ Montreal | B | D | source repair | Montreal → Edmonton raw FAQ/source; companion minor items |
| Edmonton ↔ Ottawa | A | A | complete | None |
| Edmonton ↔ Toronto | D | D | source repair | Raw visible FAQ absent |
| Edmonton ↔ Vancouver | D | B | source repair | Edmonton → Vancouver raw FAQ/source; companion terminology |
| Edmonton ↔ Winnipeg | B | B | minor cleanup | Terminology |
| Halifax ↔ Toronto | A | A | complete | None |
| Halifax ↔ Vancouver | B | A | minor cleanup | Halifax → Vancouver raw canonical |
| Montreal ↔ Toronto | D | D | source repair | Raw visible FAQ absent |
| Montreal ↔ Vancouver | A | A | complete | None |
| Montreal ↔ Victoria | D | B | source repair | Montreal → Victoria raw FAQ/source; companion mobile Escape |
| Montreal ↔ Winnipeg | A | A | complete | None |
| Ottawa ↔ Toronto | A | A | complete | None |
| Ottawa ↔ Vancouver | A | A | complete | None |
| Ottawa ↔ Victoria | A | B | minor cleanup | Victoria → Ottawa ARIA/Escape |
| Ottawa ↔ Winnipeg | A | A | complete | None |
| Seattle ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Victoria | A | A | complete | None |
| Toronto ↔ Winnipeg | A | A | complete | None |
| Vancouver ↔ Winnipeg | B | B | minor cleanup | Body font only; FAQ source is now canonical |
| Unpaired BC → Washington | C | — | material | Legacy pricing and raw metadata durability |
| Unpaired Victoria → Vancouver | A | — | complete | None |

## 16. Exact A/B/C/D route counts

- **A — Canonical: 34/56**.
- **B — Minor cleanup: 11/56**.
- **C — Material: 2/56**.
- **D — Architecture/source: 9/56**.
- Total: **56/56**.

Step 52 changed direct-owner FAQ durability but did not change the overall class of either target, so the route counts remain numerically equal to Step 51 for valid current reasons rather than by assumption.

## 17. Exact pair counts

Among 27 bidirectional pairs:

- **15 complete**.
- **5 minor cleanup**.
- **1 material**.
- **6 source repair**.

Among the two legitimate unpaired directions, Victoria → Vancouver is complete and BC → Washington is material.

## 18. Ranked remaining cleanup queue

1. Calgary ↔ Toronto — D/D raw FAQ source repair.
2. Edmonton ↔ Toronto — D/D raw FAQ source repair.
3. Montreal ↔ Toronto — D/D raw FAQ source repair.
4. Edmonton ↔ Vancouver — D/B; source repair first.
5. Edmonton ↔ Montreal — B/D; source repair first.
6. Montreal ↔ Victoria — D/B; source repair first.
7. Calgary ↔ Montreal — material one-direction standardization.
8. BC → Washington — material unpaired standardization.
9. Edmonton ↔ Winnipeg — pair-owned terminology cleanup.
10. Halifax ↔ Vancouver — direction-scoped raw canonical cleanup.
11. Calgary ↔ Halifax — mobile Escape behavior.
12. Ottawa ↔ Victoria — direction-scoped ARIA/Escape behavior.
13. Vancouver ↔ Winnipeg — body-font cleanup only.

## 19. Recommended Step 54 target

**Calgary ↔ Toronto**.

## 20. Why Step 54 target is next

- Both directions are D, so one pair-scoped repair removes two of the nine highest-priority source issues.
- Ownership is already correct and collision-free.
- The defect is exact and reproducible: zero raw visible Q&A versus 11/11 rendered entries Calgary → Toronto and 9/9 Toronto → Calgary.
- `finalize-calgary-toronto-routes.mjs` already owns explicit pair FAQ data and pair-scoped normalization, giving the repair a legitimate narrow home.
- No route creation, shared-runtime rewrite, ownership change, or cross-route template dependency is required.
- The first-pass aggregate is already convergent, so the pair can be changed against a stable baseline with manageable regression risk.

Vancouver ↔ Winnipeg is not selected because its source FAQ issue is resolved and it now has only the lower-priority B typography defect.

## 21. Ownership/tests result

- Ownership/architecture validator: **PASS**, 56 routes, exactly one full-page owner each, zero collisions.
- Ownership, title, and chatbot-pricing tests: **35/35 PASS**.
- Global FAQ browser audit: **56/56 PASS**.
- Global title browser audit: **56/56 PASS**.
- Syntax checks: **122/122 `.mjs` files PASS** during the audit run.

## 22. Browser regression result

- Existing deduplicated regression inventory attempted: **52**.
- Passed: **52/52**.
- Failed: **0**.
- Targeted handling: both Vancouver ↔ Winnipeg directions were already represented and passed; Victoria → Vancouver is represented once as the valid Step 50 unpaired direction; nonexistent Vancouver → Victoria was not added.

## 23. First aggregate result

The current working baseline was copied over a fresh temporary Git clone, then the aggregate route build ran once.

- Route drift: **0/56**.
- Asset drift: **0/104**.
- Required convergence is satisfied; no Step 53A aggregate reconciliation is needed.

## 24. Second aggregate result

- Second pass versus first: **0/56 route drift**.
- Asset drift: **0/104**.

## 25. Read-only working-tree verification and remaining known issues

Post-audit hashing of the original working tree found:

- **0/56 route changes**.
- **0/104 asset changes**.

Only this report was retained. Temporary audit evidence and clone mutations stayed outside the working tree.

Remaining known issues:

- Nine SPA-owned routes remain D because their raw owner/checked-in output has no visible FAQ Q&A and depends on browser execution plus mutable preserved output.
- Two routes remain C: Calgary → Montreal and BC → Washington.
- Eleven routes remain B with the terminology, metadata, typography, or mobile-navigation defects listed in section 7.
- Raw homepage canonical/OG contamination remains on BC → Washington, Montreal → Edmonton, and Montreal → Victoria; it is not new.
- No new source defect, ownership defect, aggregate defect, soft-404 signature, `.pcm-local-seo` element, or unintended visible `undefined` appeared.
- No deployment occurred and Step 54 was not begun.

Step 53 cleanup-queue refresh is complete. No route cleanup was performed.

Recommended Step 54 target: **Calgary ↔ Toronto**.
