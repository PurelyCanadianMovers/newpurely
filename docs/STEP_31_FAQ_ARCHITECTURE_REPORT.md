# Step 31 FAQ architecture report

## 1. Total routes audited

56 owned long-distance route pages.

## 2. Pre-fix FAQ classification counts

Primary, mutually exclusive route classification from the fresh raw/settled audit:

| Classification | Routes |
| --- | ---: |
| Canonical | 30 |
| Duplicate visible FAQ / heading | 14 |
| Duplicate FAQPage only | 2 |
| Missing schema question | 1 |
| Stale schema answer | 2 |
| Missing FAQPage | 4 |
| `.pcm-local-seo` residue only | 3 |
| Total | 56 |

## 3. Complete reproduced failing-route list

The 16 routes named in the Step 31 brief were reproduced. The full 56-route sweep also found ten routes that violated the same final contract through reverse-direction schema gaps, serialized generic FAQ residue, or raw-only `.pcm-local-seo` residue:

- `/bc-to-washington-movers/`
- `/calgary-to-edmonton-movers/`
- `/calgary-to-montreal-movers/`
- `/calgary-to-vancouver-movers/`
- `/calgary-to-winnipeg-movers/`
- `/edmonton-to-calgary-movers/`
- `/edmonton-to-montreal-movers/`
- `/edmonton-to-ottawa-movers/`
- `/halifax-to-vancouver-movers/`
- `/montreal-to-calgary-movers/`
- `/ottawa-to-edmonton-movers/`
- `/seattle-to-vancouver-movers/`
- `/toronto-to-vancouver-movers/`
- `/toronto-to-victoria-movers/`
- `/toronto-to-winnipeg-movers/`
- `/vancouver-to-calgary-movers/`
- `/vancouver-to-edmonton-movers/`
- `/vancouver-to-halifax-movers/`
- `/vancouver-to-seattle-movers/`
- `/vancouver-to-toronto-movers/`
- `/vancouver-to-winnipeg-movers/`
- `/victoria-to-toronto-movers/`
- `/victoria-to-vancouver-movers/`
- `/winnipeg-to-calgary-movers/`
- `/winnipeg-to-toronto-movers/`
- `/winnipeg-to-vancouver-movers/`

## 4. Root-cause groups

| Root cause | Routes | Writer responsible | Preferred fix used |
| --- | --- | --- | --- |
| Serialized homepage/generic SEO FAQ and `pcm-faq-schema` survived beside route FAQ | Calgary→Edmonton, Edmonton→Calgary, Edmonton→Montreal, Edmonton→Ottawa, Halifax→Vancouver, Victoria→Toronto, Victoria→Vancouver | Historical static serialization plus shared runtime | Remove only the explicitly marked generic block/entity; derive the surviving schema from the route FAQ |
| Generic hydrated SPA FAQ displaced or duplicated route JSON-LD | BC→Washington, Calgary→Vancouver, Montreal→Calgary, Ottawa→Edmonton, Toronto→Vancouver, Toronto→Victoria, Vancouver→Calgary, Vancouver→Toronto | SPA hydration plus shared runtime | Materialize the existing route-specific FAQ dataset as an explicitly marked static FAQ and suppress only the generic hydrated FAQ on those marked routes |
| Extra generic entity on Vancouver→Halifax | Vancouver→Halifax | Serialized generic `pcm-faq-schema` plus route `faq-schema` | Remove the generic entity and materialize the existing 8-question route entity as the visible FAQ |
| Stale or missing generator/static schema | Calgary→Montreal, Calgary↔Winnipeg, Toronto↔Winnipeg, Vancouver↔Winnipeg | Checked-in static source or pair generator output | Deterministically create/align `FAQPage.mainEntity` from visible FAQ content |
| Route-scoped content retained the obsolete class | Seattle↔Vancouver, Vancouver→Edmonton | Historical route markup | Preserve content and replace only the obsolete class token on the section |

## 5. Files changed

Shared/source files:

- `site-copy/assets/conversion-boost.js`
- `tools/faq-parity.mjs`
- `tools/finalize-route-faq-architecture.mjs`
- `tools/audit-route-faq-architecture.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`

Route HTML files: the 26 routes listed in section 3, and no other route HTML files relative to the Step 31 pre-finalizer hash snapshot.

## 6. Group A duplicate-runtime fixes

The generic serialized FAQ/entity is removed when explicitly marked. Routes whose SPA hydration supplies a generic homepage FAQ now carry an explicit route FAQ marker; the shared guard removes only competing FAQ sections on a route with that marker. The guard is bounded, idempotent, and does not apply to unmarked routes.

## 7. Vancouver → Halifax extra-entity fix

Pre-fix: two raw `FAQPage` entities; one generic visible FAQ; one separate route-specific 8-question entity. Final: one visible 8-question route FAQ, one heading, one 8-question `FAQPage`, exact order/text parity.

## 8. Group C stale/missing-schema fixes

- Calgary→Montreal: 11/11 exact parity.
- Calgary→Winnipeg: 8/8 exact parity.
- Seattle→Vancouver: 6/6 exact parity; route-scoped content preserved and obsolete class retired.
- Toronto→Winnipeg: 7/7 exact parity.

Reverse-direction gaps found by the complete sweep were also repaired: Winnipeg→Calgary 8/8, Winnipeg→Toronto 7/7, Vancouver→Winnipeg 7/7, and Winnipeg→Vancouver 7/7.

## 9. Shared runtime changes

`conversion-boost.js` now removes only explicitly marked generic FAQ remnants, retires `.pcm-local-seo` on route-scoped content, suppresses a generic hydrated FAQ only when an authoritative static route FAQ marker exists, and re-synchronizes the single `FAQPage` from the single visible FAQ. It uses a bounded retry loop and is idempotent.

## 10. Generator/template changes

A shared FAQ post-processor is registered in the ownership manifest and aggregate order. It preserves owner architecture, removes known generic remnants, creates missing schema from visible FAQ content, aligns stale schema, and is byte-stable on a second pass.

## 11. Visible FAQ wording changes

No new FAQ wording was invented. Nine SPA fallback routes materialize their already-existing route-specific JSON-LD question/answer text as visible FAQ content; all other visible FAQ wording is unchanged.

## 12. Schema changes

Duplicate generic entities were removed; stale answers were replaced from visible answers; missing entities were created from visible FAQs; route-specific fallback entities were preserved and made visible.

## 13. Final FAQ counts for every repaired route

| Route | Sections | Headings | Visible Q | FAQPage | Schema Q | Result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `/bc-to-washington-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/calgary-to-edmonton-movers/` | 1 | 1 | 11 | 1 | 11 | PASS |
| `/calgary-to-montreal-movers/` | 1 | 1 | 11 | 1 | 11 | PASS |
| `/calgary-to-vancouver-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/calgary-to-winnipeg-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/edmonton-to-calgary-movers/` | 1 | 1 | 9 | 1 | 9 | PASS |
| `/edmonton-to-montreal-movers/` | 1 | 1 | 12 | 1 | 12 | PASS |
| `/edmonton-to-ottawa-movers/` | 1 | 1 | 12 | 1 | 12 | PASS |
| `/halifax-to-vancouver-movers/` | 1 | 1 | 11 | 1 | 11 | PASS |
| `/montreal-to-calgary-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/ottawa-to-edmonton-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/seattle-to-vancouver-movers/` | 1 | 1 | 6 | 1 | 6 | PASS |
| `/toronto-to-vancouver-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/toronto-to-victoria-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/toronto-to-winnipeg-movers/` | 1 | 1 | 7 | 1 | 7 | PASS |
| `/vancouver-to-calgary-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/vancouver-to-edmonton-movers/` | 1 | 1 | 9 | 1 | 9 | PASS |
| `/vancouver-to-halifax-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/vancouver-to-seattle-movers/` | 1 | 1 | 6 | 1 | 6 | PASS |
| `/vancouver-to-toronto-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/vancouver-to-winnipeg-movers/` | 1 | 1 | 7 | 1 | 7 | PASS |
| `/victoria-to-toronto-movers/` | 1 | 1 | 9 | 1 | 9 | PASS |
| `/victoria-to-vancouver-movers/` | 1 | 1 | 9 | 1 | 9 | PASS (raw; browser timeout) |
| `/winnipeg-to-calgary-movers/` | 1 | 1 | 8 | 1 | 8 | PASS |
| `/winnipeg-to-toronto-movers/` | 1 | 1 | 7 | 1 | 7 | PASS |
| `/winnipeg-to-vancouver-movers/` | 1 | 1 | 7 | 1 | 7 | PASS |

## 14. Step 30 regression result

- Halifax→Toronto: 9/9 exact settled parity.
- Toronto→Halifax: 9/9 exact settled parity.
- Ottawa→Victoria: 12/12 exact settled parity.

## 15. Final 56-route FAQ parity sweep

56/56 contract pass: 55/56 completed settled browser verification; Victoria→Vancouver is 9/9 exact in raw static HTML but both Playwright and the in-app browser timed out before `DOMContentLoaded`.

## 16. Final duplicate FAQ/entity count

Zero in the completed settled sweep, and zero in Victoria→Vancouver raw HTML.

## 17. Title-branding regression

55/55 completed settled browser checks are canonical with exactly one brand suffix. Victoria→Vancouver raw title is canonical and its title tests pass; its browser navigation timed out. Shared title-writing logic was not changed.

## 18. Ownership validation

PASS: 56 routes, one full-page owner each, zero collisions. Ownership tests: 14/14 pass. Title tests: 4/4 pass. Relevant JavaScript syntax checks pass.

## 19. Idempotency result

The FAQ finalizer changes zero bytes on a second direct run. The complete aggregate's second run changes zero route hashes and zero shared-file hashes.

## 20. First aggregate convergence

The isolated first aggregate completed. It produced zero unexpected Step 31 route drift and zero shared-file drift. It also removed a pre-existing serialized Sonner style block from Edmonton↔Winnipeg (two expected, unrelated owner-regeneration drifts); those two unrelated files were not copied back to the working tree.

## 21. Second aggregate convergence

0 route drift; 0 shared runtime/bundle drift.

## 22. Working-tree route isolation

Exactly 26 route HTML files changed relative to the Step 31 pre-finalizer snapshot, all listed in section 3. Changes are limited to FAQ/schema cleanup, route-local FAQ fallback markers/content copied from existing route schema, and retirement of the obsolete `.pcm-local-seo` class. No unrelated aggregate output was applied.

## 23. Browser/runtime QA limitations

`/victoria-to-vancouver-movers/` times out in both browser harnesses. Its static HTML is 9/9 exact, has one FAQ heading/entity, no `.pcm-local-seo` class, and a canonical title. All other 55 routes completed browser checks; the changed routes reported no new page errors, and navigation/chat remained present wherever the pre-existing architecture supplied them.

## 24. Remaining known issues

The FAQ contract is complete. A separate pre-existing render-architecture issue remains on the nine explicitly marked SPA fallback routes: client hydration can render generic homepage body content for the route even though route metadata and route FAQ data are present. Step 31 suppresses only the conflicting generic FAQ and does not rewrite route ownership or the rest of the page. The isolated aggregate also confirms unrelated first-pass Sonner-style cleanup on Edmonton↔Winnipeg. Both items are outside this FAQ-only step and should be handled separately.

No deployment was performed. Step 32 was not started.
