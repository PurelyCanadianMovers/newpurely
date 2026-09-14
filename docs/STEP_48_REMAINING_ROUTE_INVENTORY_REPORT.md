# Step 48 — Remaining Route Inventory

Audit date: 2026-09-06  
Scope: read-only inventory of the 56 routes registered in `tools/route-page-ownership.mjs`  
Canonical contract: `docs/ROUTE_PAGE_STANDARD.md`  
Primary rendered reference: `/montreal-to-edmonton-movers/`

## 1. Route count and ownership result

- Registered routes: **56**.
- Full-page ownership: **56/56 have exactly one owner**.
- Ownership collisions: **0**.
- Declared rendering: **18 React SPA**, **38 static**.
- Owner type: **46 full-page-generator**, **9 checked-in-static-source**, **1 static-finalizer**.
- `node tools/validate-route-page-ownership.mjs site-copy`: **PASS**.
- Ownership/title/chatbot-pricing tests: **33/33 PASS**.

The working tree was already materially dirty before Step 48. This audit preserved those changes and did not infer that they belonged to Step 48.

## 2. Complete 56-route inventory

`A/B/C/D` is the final status defined in section 13. “Counterpart” is `—` where the registry has no reverse direction.

| Route | Owner | Declared architecture | Registered post-processors | Counterpart | Status |
| --- | --- | --- | --- | --- | --- |
| `/bc-to-washington-movers/` | `generate-spa-routes.mjs` | React SPA | FAQ finalizer; title normalizer | — | **C** |
| `/calgary-to-edmonton-movers/` | checked-in static source | Static | Calgary/Edmonton finalizer; FAQ finalizer; title normalizer | `/edmonton-to-calgary-movers/` | **A** |
| `/calgary-to-halifax-movers/` | `generate-halifax-calgary-route-pages.mjs` | Static | bootstrap stripper; FAQ finalizer; title normalizer | `/halifax-to-calgary-movers/` | **B** |
| `/calgary-to-montreal-movers/` | checked-in static source | Static | Montreal/Calgary finalizer; bootstrap stripper; FAQ finalizer; title normalizer | `/montreal-to-calgary-movers/` | **C** |
| `/calgary-to-ottawa-movers/` | `rebuild-calgary-ottawa-routes.mjs` | Static | FAQ finalizer; title normalizer | `/ottawa-to-calgary-movers/` | **A** |
| `/calgary-to-toronto-movers/` | `generate-spa-routes.mjs` | React SPA | Calgary/Toronto finalizer; FAQ finalizer; title normalizer | `/toronto-to-calgary-movers/` | **A** |
| `/calgary-to-vancouver-movers/` | `generate-spa-routes.mjs` | React SPA | Calgary/Vancouver finalizer; FAQ finalizer; title normalizer | `/vancouver-to-calgary-movers/` | **A** |
| `/calgary-to-winnipeg-movers/` | `rebuild-calgary-winnipeg-routes.mjs` | Static | FAQ finalizer; title normalizer | `/winnipeg-to-calgary-movers/` | **A** |
| `/edmonton-to-calgary-movers/` | checked-in static source | Static | Calgary/Edmonton finalizer; FAQ finalizer; title normalizer | `/calgary-to-edmonton-movers/` | **A** |
| `/edmonton-to-montreal-movers/` | `generate-spa-routes.mjs` | React SPA, documented static-runtime exception | Montreal/Edmonton finalizer; bootstrap stripper; FAQ finalizer; title normalizer | `/montreal-to-edmonton-movers/` | **B** |
| `/edmonton-to-ottawa-movers/` | checked-in static source | Static | Edmonton/Ottawa finalizer; seven registered legacy route patchers; FAQ finalizer; title normalizer | `/ottawa-to-edmonton-movers/` | **A** |
| `/edmonton-to-toronto-movers/` | `generate-spa-routes.mjs` | React SPA | Toronto/Edmonton finalizer; FAQ finalizer; title normalizer | `/toronto-to-edmonton-movers/` | **A** |
| `/edmonton-to-vancouver-movers/` | `generate-spa-routes.mjs` | React SPA | Vancouver/Edmonton finalizer; FAQ finalizer; title normalizer | `/vancouver-to-edmonton-movers/` | **A** |
| `/edmonton-to-winnipeg-movers/` | `rebuild-edmonton-winnipeg-routes.mjs` | Static | FAQ finalizer; title normalizer | `/winnipeg-to-edmonton-movers/` | **B** |
| `/halifax-to-calgary-movers/` | `generate-halifax-calgary-route-pages.mjs` | Static | bootstrap stripper; FAQ finalizer; title normalizer | `/calgary-to-halifax-movers/` | **B** |
| `/halifax-to-toronto-movers/` | `update-halifax-toronto-routes.mjs` | Static | FAQ finalizer; title normalizer | `/toronto-to-halifax-movers/` | **A** |
| `/halifax-to-vancouver-movers/` | `rebuild-halifax-vancouver-routes.mjs` | Static | FAQ finalizer; title normalizer | `/vancouver-to-halifax-movers/` | **B** |
| `/montreal-to-calgary-movers/` | `generate-spa-routes.mjs` | React SPA | Montreal/Calgary finalizer; FAQ finalizer; title normalizer | `/calgary-to-montreal-movers/` | **A** |
| `/montreal-to-edmonton-movers/` | `generate-spa-routes.mjs` | React SPA | Montreal/Edmonton finalizer; FAQ finalizer; title normalizer | `/edmonton-to-montreal-movers/` | **B** |
| `/montreal-to-toronto-movers/` | `generate-spa-routes.mjs` | React SPA | Montreal/Toronto finalizer; FAQ finalizer; title normalizer | `/toronto-to-montreal-movers/` | **A** |
| `/montreal-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | Static | legacy Montreal/Vancouver fixer; FAQ finalizer; title normalizer | `/vancouver-to-montreal-movers/` | **A** |
| `/montreal-to-victoria-movers/` | `generate-spa-routes.mjs` | React SPA | Montreal/Victoria finalizer; FAQ finalizer; title normalizer | `/victoria-to-montreal-movers/` | **B** |
| `/montreal-to-winnipeg-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | Static | FAQ finalizer; title normalizer | `/winnipeg-to-montreal-movers/` | **A** |
| `/ottawa-to-calgary-movers/` | `rebuild-calgary-ottawa-routes.mjs` | Static | FAQ finalizer; title normalizer | `/calgary-to-ottawa-movers/` | **A** |
| `/ottawa-to-edmonton-movers/` | `generate-spa-routes.mjs` | React SPA | Edmonton/Ottawa finalizer; seven registered legacy route patchers; FAQ finalizer; title normalizer | `/edmonton-to-ottawa-movers/` | **A** |
| `/ottawa-to-toronto-movers/` | `rebuild-ottawa-toronto-routes.mjs` | Static | FAQ finalizer; title normalizer | `/toronto-to-ottawa-movers/` | **A** |
| `/ottawa-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | Static | FAQ finalizer; title normalizer | `/vancouver-to-ottawa-movers/` | **A** |
| `/ottawa-to-victoria-movers/` | `rebuild-victoria-ottawa-route.mjs` | Static, documented module-bootstrap exception | FAQ finalizer; title normalizer | `/victoria-to-ottawa-movers/` | **A** |
| `/ottawa-to-winnipeg-movers/` | `fix-winnipeg-static-routes.mjs` | Static | FAQ finalizer; title normalizer | `/winnipeg-to-ottawa-movers/` | **A** |
| `/seattle-to-vancouver-movers/` | checked-in static source | Static | FAQ finalizer; title normalizer | `/vancouver-to-seattle-movers/` | **C** |
| `/toronto-to-calgary-movers/` | `generate-spa-routes.mjs` | React SPA | Calgary/Toronto finalizer; FAQ finalizer; title normalizer | `/calgary-to-toronto-movers/` | **A** |
| `/toronto-to-edmonton-movers/` | `generate-spa-routes.mjs` | React SPA | Toronto/Edmonton finalizer; FAQ finalizer; title normalizer | `/edmonton-to-toronto-movers/` | **A** |
| `/toronto-to-halifax-movers/` | `update-halifax-toronto-routes.mjs` | Static | FAQ finalizer; title normalizer | `/halifax-to-toronto-movers/` | **A** |
| `/toronto-to-montreal-movers/` | `generate-spa-routes.mjs` | React SPA | Montreal/Toronto finalizer; FAQ finalizer; title normalizer | `/montreal-to-toronto-movers/` | **A** |
| `/toronto-to-ottawa-movers/` | `rebuild-ottawa-toronto-routes.mjs` | Static | FAQ finalizer; title normalizer | `/ottawa-to-toronto-movers/` | **A** |
| `/toronto-to-vancouver-movers/` | `generate-spa-routes.mjs` | React SPA | Toronto/Vancouver finalizer; FAQ finalizer; title normalizer | `/vancouver-to-toronto-movers/` | **A** |
| `/toronto-to-victoria-movers/` | `generate-spa-routes.mjs` | React SPA | Toronto/Victoria finalizer; FAQ finalizer; title normalizer | `/victoria-to-toronto-movers/` | **A** |
| `/toronto-to-winnipeg-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | Static | FAQ finalizer; title normalizer | `/winnipeg-to-toronto-movers/` | **A** |
| `/vancouver-to-calgary-movers/` | `generate-spa-routes.mjs` | React SPA | Calgary/Vancouver finalizer; FAQ finalizer; title normalizer | `/calgary-to-vancouver-movers/` | **A** |
| `/vancouver-to-edmonton-movers/` | `finalize-vancouver-edmonton-routes.mjs` | Static, documented route-local nav/chat bridge | FAQ finalizer; title normalizer | `/edmonton-to-vancouver-movers/` | **B** |
| `/vancouver-to-halifax-movers/` | `rebuild-halifax-vancouver-routes.mjs` | Static | FAQ finalizer; title normalizer | `/halifax-to-vancouver-movers/` | **A** |
| `/vancouver-to-montreal-movers/` | `standardize-montreal-vancouver-routes.mjs` | Static | FAQ finalizer; title normalizer | `/montreal-to-vancouver-movers/` | **A** |
| `/vancouver-to-ottawa-movers/` | `standardize-montreal-vancouver-routes.mjs` | Static | FAQ finalizer; title normalizer | `/ottawa-to-vancouver-movers/` | **A** |
| `/vancouver-to-seattle-movers/` | checked-in static source | Static | FAQ finalizer; title normalizer | `/seattle-to-vancouver-movers/` | **C** |
| `/vancouver-to-toronto-movers/` | `generate-spa-routes.mjs` | React SPA | Toronto/Vancouver finalizer; FAQ finalizer; title normalizer | `/toronto-to-vancouver-movers/` | **A** |
| `/vancouver-to-winnipeg-movers/` | `rebuild-winnipeg-modern-routes.mjs` | Static | FAQ finalizer; title normalizer | `/winnipeg-to-vancouver-movers/` | **B** |
| `/victoria-to-montreal-movers/` | checked-in static source | Static | Montreal/Victoria finalizer; FAQ finalizer; title normalizer | `/montreal-to-victoria-movers/` | **B** |
| `/victoria-to-ottawa-movers/` | `rebuild-victoria-ottawa-route.mjs` | Static | FAQ finalizer; title normalizer | `/ottawa-to-victoria-movers/` | **B** |
| `/victoria-to-toronto-movers/` | checked-in static source | Static | Toronto/Victoria finalizer; FAQ finalizer; title normalizer | `/toronto-to-victoria-movers/` | **A** |
| `/victoria-to-vancouver-movers/` | checked-in static source | Static | FAQ finalizer; title normalizer | — | **C** |
| `/winnipeg-to-calgary-movers/` | `rebuild-calgary-winnipeg-routes.mjs` | Static | FAQ finalizer; title normalizer | `/calgary-to-winnipeg-movers/` | **A** |
| `/winnipeg-to-edmonton-movers/` | `rebuild-edmonton-winnipeg-routes.mjs` | Static | FAQ finalizer; title normalizer | `/edmonton-to-winnipeg-movers/` | **B** |
| `/winnipeg-to-montreal-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | Static | FAQ finalizer; title normalizer | `/montreal-to-winnipeg-movers/` | **A** |
| `/winnipeg-to-ottawa-movers/` | `fix-winnipeg-static-routes.mjs` | Static | FAQ finalizer; title normalizer | `/ottawa-to-winnipeg-movers/` | **A** |
| `/winnipeg-to-toronto-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | Static | FAQ finalizer; title normalizer | `/toronto-to-winnipeg-movers/` | **A** |
| `/winnipeg-to-vancouver-movers/` | `rebuild-winnipeg-modern-routes.mjs` | Static | FAQ finalizer; title normalizer | `/vancouver-to-winnipeg-movers/` | **B** |

## 3. Architecture consistency results

The registry/markup/browser comparison found **no undocumented architecture mismatch**.

- **React — correct:** the ordinary React routes have the compiled React bootstrap, React navigation/chat, and no static duplication.
- **Static — correct:** ordinary static routes omit React bootstrap and use functioning static navigation/chat.
- **Mixed but intentionally documented:** `/edmonton-to-montreal-movers/` is declared React but intentionally has its unavailable bootstrap stripped and uses static nav/chat; `/ottawa-to-victoria-movers/` is static-owned with the documented retained module tag; `/vancouver-to-edmonton-movers/` uses its documented route-local static navigation bridge and `pcm-chatbot.js` rather than the shared static-nav/static-chat pair.
- **Architecture mismatch:** **0/56**.

Among the 55 browser-completed routes, the observed script shapes were 18 React-bootstrap/no-static-nav-chat, 36 no-React/static-nav-chat, and one documented route-local bridge. The Victoria → Vancouver timeout is not treated as an architecture failure; raw markup is static with static-nav/static-chat.

## 4. Canonical component-contract results

At settled browser state, all evaluable routes had one H1, one top-level quote panel, one primary quote form, one FAQ section/heading/schema, zero live `.pcm-local-seo`, zero visible `undefined`, and one footer.

Material exceptions:

- `/bc-to-washington-movers/`: old `Moving Cost Breakdown` three-column table rather than the canonical pricing component.
- `/calgary-to-montreal-movers/`: **two visible Route at a Glance headings/blocks**.
- Seattle ↔ Vancouver: one older two-column estimate table in `pcm-seattle-section`, not the canonical four-column `.pcm-route-cost` contract.
- `/victoria-to-vancouver-movers/`: raw output has the legacy cost block and no canonical glance block; browser settlement is unavailable because of the known harness limitation.

Calgary ↔ Edmonton uses its Step 35 pair-scoped pricing wrapper rather than the `.pcm-route-cost` class but has one semantic pricing section, one five-row table and one glance; it is not failed for a harmless class-name difference.

## 5. Legacy-block findings

- **Legacy component present:** `/bc-to-washington-movers/` and `/victoria-to-vancouver-movers/` retain `Moving Cost Breakdown`.
- **Material older component:** Seattle ↔ Vancouver retains the older two-column cross-border pricing section.
- **Duplicate component:** `/calgary-to-montreal-movers/` has duplicate glance presentation.
- **Clean:** the remaining 51 routes have no visible temporary `Route Pricing`, duplicate cost section, legacy pricing cards, duplicate FAQ shell, post-footer generic FAQ, expired promotion, homepage replacement, or soft-404 body.
- **Runtime-only recurrence risk:** none observed after settling; the route FAQ/title finalizers remained stable in the audit window.

## 6. Title/metadata results

- Raw `<title>`, raw `og:title`, and raw `twitter:title`: **56/56 route-specific, mutually equal, and branded exactly once**.
- Settled title fields: **55/55 browser-completed routes pass**; Victoria → Vancouver is the separate known harness exception and its raw title fields pass.
- Settled canonical and OG URL: **55/55 completed routes are self-referential**.
- Every route has a route-specific meta description.
- Minor raw canonical durability defects: `/bc-to-washington-movers/`, `/montreal-to-edmonton-movers/`, and `/montreal-to-victoria-movers/` serialize the site root before runtime correction; `/halifax-to-vancouver-movers/` serializes the reverse-direction canonical before runtime correction. These are reflected in status C for BC → Washington and status B for the other three.

## 7. FAQ/schema results

- Settled browser audit: **55/55 canonical** — one visible FAQ, one heading, one `FAQPage`, exact question/answer/order parity, zero live `.pcm-local-seo`.
- Victoria → Vancouver raw fallback: **1 section, 1 heading, 1 `FAQPage`, 9/9 exact parity, zero `.pcm-local-seo`**.
- Combined contract coverage: **56/56**, with the documented browser limitation clearly separated.
- The Victoria → Vancouver FAQ nevertheless contains copy defects (missing “days” after `1–3`, duplicated “professional,” repeated “clear documentation,” and conflicting direct-crew/agent-network wording); parity does not make that copy canonical.

## 8. Typography/presentation results

- H1: **55/55 browser-completed routes** compute to Playfair Display, 48/60/700 desktop and 36/45/700 mobile.
- Body: 53/55 completed routes compute to Source Sans 3 at body level. Vancouver ↔ Winnipeg computes to `Inter, Arial, sans-serif`; its route elements otherwise retain the canonical H1 scale and responsive behavior. This is minor cleanup, not structural failure.
- No page-level horizontal overflow was observed at 390 px on the 55 completed routes.
- Canonical content widths, quote stacking, glance stacking, and table-contained overflow pass on the canonical/standardized routes. The older Seattle pair and the two legacy singleton pages remain presentation outliers described above.

## 9. Navigation/chat results

- Chat launcher open/close passed on all **55 browser-completed routes**.
- Mobile fit passed on all 55 completed routes.
- React routes use React navigation/chat without static duplication, except the documented Edmonton → Montreal fallback architecture.
- Ordinary static routes use static navigation/chat; Vancouver → Edmonton’s documented route-local bridge also opened/closed correctly.
- Minor accessibility/keyboard cleanup remains on Calgary ↔ Halifax (Escape does not close the mobile menu), Edmonton → Montreal (open state does not update `aria-expanded`), Victoria → Montreal (Escape does not close), and Victoria → Ottawa (the trigger lacks the required `aria-expanded` state and Escape closure).
- Seattle ↔ Vancouver has the material version of this defect: the mobile sheet opens, but `aria-expanded` remains false and Escape does not close it.
- Victoria → Vancouver browser behavior was not reclassified because the harness cannot settle that route.

## 10. Route-fact consistency findings

Current visible pricing, glance, FAQ and FAQ schema were compared for distance, transit windows and price ranges. The structured sweep found **no route with conflicting distance values** and **no route with contradictory transit windows**. FAQ/schema parity is exact. The Victoria → Vancouver raw fallback consistently exposes 115 km and 1–3 days, but its FAQ sentence omits the word “days,” a copy defect rather than a numeric conflict.

No new web research was performed and no authoritative route fact was changed.

## 11. Terminology findings

- Stale insurance-style wording `fully insured` remains in Edmonton → Montreal, Edmonton ↔ Winnipeg, and Vancouver → Edmonton. These are status B cleanup items.
- Victoria → Vancouver contains contradictory direct-crew versus Great Canadian Van Lines agent-network language plus duplicated prose; this contributes to status C.
- No affirmative guaranteed-price claim was found. Occurrences of “not guaranteed final long-distance pricing” are compliant disclaimers, not defects.
- No visible `undefined` was found on any browser-completed route or in the Victoria raw fallback.

## 12. Source-durability findings

- Dedicated pair generators with frozen data/templates protect the recently standardized static pairs.
- Checked-in static sources are explicitly owned and preserved.
- Exact React routes are protected by their compiled registration plus registered route finalizers; aggregate generation preserves existing route output rather than cloning the homepage over it.
- Vancouver → Edmonton is protected by its deterministic static owner/finalizer.
- Shared FAQ and title finalizers are deterministic and the two-pass aggregate is byte-converged.
- No current route depends on another generated route’s mutable HTML, first-run cleanup, an unowned manual file, or undocumented runtime mutation.
- The two executable architecture exceptions are documented in ownership metadata; neither is promoted to status D.

## 13. Route-by-route A/B/C/D classification

Counts: **38 A**, **13 B**, **5 C**, **0 D**.

Status B routes and reason:

| Route(s) | Minor cleanup |
| --- | --- |
| Calgary ↔ Halifax | Mobile menu Escape closure |
| Edmonton → Montreal | `fully insured`; documented architecture has stale `aria-expanded` behavior |
| Montreal → Edmonton | Raw canonical/OG URL durability |
| Edmonton ↔ Winnipeg | `fully insured` |
| Halifax → Vancouver | Raw canonical points to reverse direction until runtime correction |
| Montreal → Victoria | Raw canonical/OG URL point to site root until runtime correction |
| Vancouver → Edmonton | `fully insured` |
| Vancouver ↔ Winnipeg | Body-level font computes to Inter rather than Source Sans 3 |
| Victoria → Montreal | Mobile menu Escape closure |
| Victoria → Ottawa | Missing mobile `aria-expanded` state/Escape closure |

Status C routes and reason:

| Route | Material issue |
| --- | --- |
| BC → Washington | Legacy three-column `Moving Cost Breakdown`; non-canonical pricing presentation; raw canonical durability |
| Calgary → Montreal | Duplicate Route at a Glance block |
| Seattle → Vancouver | Older two-column pricing plus material mobile-nav state/Escape failure |
| Vancouver → Seattle | Older two-column pricing plus material mobile-nav state/Escape failure |
| Victoria → Vancouver | Legacy cost block, missing canonical glance, and substantive FAQ/content defects |

All routes not named in the B/C tables are status A. No route is status D.

## 14. Bidirectional pair rollup

| Pair | Direction A status | Direction B status | Architecture | Main remaining problem | Pair class |
| --- | --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | Static/static | None | complete |
| Calgary ↔ Halifax | B | B | Static/static | Escape closure | minor cleanup pair |
| Calgary ↔ Montreal | C | A | Static/React | Duplicate glance on Calgary → Montreal | material standardization pair |
| Calgary ↔ Ottawa | A | A | Static/static | None | complete |
| Calgary ↔ Toronto | A | A | React/React | None | complete |
| Calgary ↔ Vancouver | A | A | React/React | None | complete |
| Calgary ↔ Winnipeg | A | A | Static/static | None | complete |
| Edmonton ↔ Montreal | B | B | documented mixed/React | terminology, raw metadata, ARIA | minor cleanup pair |
| Edmonton ↔ Ottawa | A | A | Static/React | None | complete |
| Edmonton ↔ Toronto | A | A | React/React | None | complete |
| Edmonton ↔ Vancouver | A | B | React/documented static bridge | terminology | minor cleanup pair |
| Edmonton ↔ Winnipeg | B | B | Static/static | terminology | minor cleanup pair |
| Halifax ↔ Toronto | A | A | Static/static | None | complete |
| Halifax ↔ Vancouver | B | A | Static/static | raw canonical | minor cleanup pair |
| Montreal ↔ Toronto | A | A | React/React | None | complete |
| Montreal ↔ Vancouver | A | A | Static/static | None | complete |
| Montreal ↔ Victoria | B | B | React/static | raw metadata; Escape closure | minor cleanup pair |
| Montreal ↔ Winnipeg | A | A | Static/static | None | complete |
| Ottawa ↔ Toronto | A | A | Static/static | None | complete |
| Ottawa ↔ Vancouver | A | A | Static/static | None | complete |
| Ottawa ↔ Victoria | A | B | documented static/static | ARIA/Escape cleanup | minor cleanup pair |
| Ottawa ↔ Winnipeg | A | A | Static/static | None | complete |
| Seattle ↔ Vancouver | C | C | Static/static | pricing structure and mobile navigation | material standardization pair |
| Toronto ↔ Vancouver | A | A | React/React | None | complete |
| Toronto ↔ Victoria | A | A | React/static | None | complete |
| Toronto ↔ Winnipeg | A | A | Static/static | None | complete |
| Vancouver ↔ Winnipeg | B | B | Static/static | body font | minor cleanup pair |

Unpaired registered directions: BC → Washington (C) and Victoria → Vancouver (C).

## 15. Exact remaining-route counts

- **38/56 canonical**.
- **13/56 minor cleanup**.
- **5/56 material standardization required**.
- **0/56 architecture/source issue first**.

Bidirectional pairs (27 total):

- **17 complete pairs**.
- **8 minor-cleanup pairs**.
- **2 material-standardization pairs**.
- **0 architecture/source-repair pairs**.

The two unpaired routes are both material and are excluded from pair counts.

## 16. Routes/pairs still requiring material work

- **Seattle ↔ Vancouver** — both directions.
- **Calgary ↔ Montreal** — Calgary → Montreal direction only.
- Unpaired: **BC → Washington**.
- Unpaired: **Victoria → Vancouver**.

## 17. Minor-cleanup routes/pairs

Minor pairs: Calgary ↔ Halifax, Edmonton ↔ Montreal, Edmonton ↔ Vancouver, Edmonton ↔ Winnipeg, Halifax ↔ Vancouver, Montreal ↔ Victoria, Ottawa ↔ Victoria, and Vancouver ↔ Winnipeg.

The exact affected directions and reasons are listed in section 13; unaffected reverse directions remain status A even where the pair rollup is minor.

## 18. Fully canonical routes/pairs

Complete pairs: Calgary ↔ Edmonton, Calgary ↔ Ottawa, Calgary ↔ Toronto, Calgary ↔ Vancouver, Calgary ↔ Winnipeg, Edmonton ↔ Ottawa, Edmonton ↔ Toronto, Halifax ↔ Toronto, Montreal ↔ Toronto, Montreal ↔ Vancouver, Montreal ↔ Winnipeg, Ottawa ↔ Toronto, Ottawa ↔ Vancouver, Ottawa ↔ Winnipeg, Toronto ↔ Vancouver, Toronto ↔ Victoria, and Toronto ↔ Winnipeg.

There is no unpaired status-A direction.

## 19. Recommended Step 49 pair

**Seattle ↔ Vancouver**.

## 20. Why that pair is next

- Both directions are status C, while Calgary ↔ Montreal has only one status-C direction.
- Both pages retain a materially older two-column pricing contract rather than the canonical four-column pricing table.
- Both pages fail the required mobile menu state/Escape behavior.
- It is a complete, high-value cross-border bidirectional corridor and can be standardized symmetrically.
- The pair is explicitly owned as checked-in static source, so Step 49 can address presentation without first resolving an ownership collision.

## 21. Read-only working-tree verification

- Pre-audit hash: 56 route HTML files and 100 assets.
- Post-audit hash: 56 route HTML files and 100 assets; comparison with `STEP_48_BEFORE.json` reports **0/56 route changes and 0/100 asset changes**.
- Step 48 created only this report and evidence JSON files. It did not edit route HTML, generators, assets, manifests, ownership files, or runtime.
- The pre-existing dirty tree was recorded before the audit; `git diff` still contains those earlier changes, so hash equality is the authoritative proof that Step 48 introduced no production drift.

## 22. Aggregate convergence result

The aggregate ran in a fresh temporary Git clone after its baseline was matched to the current working tree:

- First aggregate: **0/56 route drift; 0/100 asset drift**.
- Second aggregate: **0/56 route drift; 0/100 asset drift**.

No Step 48A reconciliation is required.

## 23. Remaining known issues

- Victoria → Vancouver retains the documented browser-harness timeout; raw checks, not the timeout itself, establish its status C findings.
- Raw canonical durability remains on the four routes in section 6.
- Minor insurance terminology, typography and mobile-nav accessibility items remain as listed in section 13.
- Material work remains on two bidirectional pairs and two unpaired directions.
- No deployment occurred, and Step 49 was not begun.

Evidence: `STEP_48_BEFORE.json`, `STEP_48_AFTER.json`, `STEP_48_BROWSER_REGRESSION.json`, `STEP_48_BROWSER_INVENTORY.json`, `STEP_48_FAQ_GLOBAL.json`, `STEP_48_FACT_CONSISTENCY.json`, `STEP_48_NAV_CHAT.json`, `STEP_48_AGGREGATE_BASELINE.json`, `STEP_48_AGGREGATE_FIRST.json`, and `STEP_48_AGGREGATE_SECOND.json`.

Step 48 inventory is complete. No route standardization was performed.

Recommended Step 49 pair: **Seattle ↔ Vancouver**.
