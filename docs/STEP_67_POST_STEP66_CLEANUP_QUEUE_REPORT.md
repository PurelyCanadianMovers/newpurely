# Step 67 — Post-Step-66 cleanup-queue refresh

Scope: read-only audit and prioritization of the current 56 registered route pages after Step 66. No route HTML, generator, template, route data, ownership/manifest file, FAQ/title finalizer, CSS/JS asset, navigation, chatbot, shared runtime, or production/source file was modified. No deployment occurred and Step 68 was not started. The `STEP_67_*.json` files are audit evidence only.

## 1. Current route/owner/asset baseline

- Registered route HTML files: **56**.
- Ownership entries: **56**.
- Full-page ownership: **56/56 exactly one owner each**.
- Ownership collisions: **0**.
- Files under `site-copy/assets`: **104**.
- `STEP_67_BASELINE.json` records the pre-audit SHA-256 hashes of all 56 routes and all 104 assets.
- The Step 67 baseline is byte-identical to `STEP_66_FINAL_WORKSPACE.json`: **0/56 route differences and 0/104 asset differences**.
- The working tree was already materially dirty before Step 67. All pre-existing changes were preserved.

## 2. Step 66 Calgary ↔ Montreal verification

Both directions are **A — Canonical**.

| Route | Owner / render | Current verification | Class |
| --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | `checked-in-static-route-source`; static | Exactly one raw, initial, delayed, settled, desktop, and mobile Route-at-a-Glance structure; zero hidden glances; one five-row canonical pricing table; canonical FAQ; correct `Calgary, AB` → `Montreal, QC` form; self canonical/OG URL; canonical title/OG/Twitter metadata; Source Sans 3 body and Playfair Display headings; no overflow, contamination, page error, or delayed duplicate | **A** |
| `/montreal-to-calgary-movers/` | `generate-spa-routes.mjs`; React SPA | Exactly one delayed/settled/desktop/mobile glance, one canonical pricing table, canonical FAQ, correct `Montreal, QC` → `Calgary, AB` form, self metadata, canonical typography, and no page error or side effect | **A** |

Calgary → Montreal's current SHA-256 is `c73aa0fe9105a59f027576c1540dde509adddb2ec9be1aa2c2d5c17b0412b46e`. Montreal → Calgary's current SHA-256 is `05c6cfd62819bffdcc1f9bf4e04566d53d1e1f1ce5917b880a4e3584c6296d9f`, identical to its Step 66 baseline and final evidence. `STEP_67_CALGARY_MONTREAL_AUDIT.json` contains the raw and timed browser snapshots.

Comparing the Step 65 baseline with the current Step 67 baseline finds exactly one changed route, Calgary → Montreal, and **0/104 changed assets**. Comparing `STEP_66_FINAL_WORKSPACE.json` with Step 67 finds no differences. Therefore Step 66 improved only Calgary → Montreal, preserved Montreal → Calgary, and neither improved nor regressed any other route indirectly.

## 3. Confirmation D remains zero

**D remains 0/56.**

- Raw FAQ canonical: **56/56**.
- Rendered FAQ canonical: **56/56**.
- Raw and rendered title contract: **56/56**.
- Ownership: 56 routes, 56 owners, zero collisions and no declared/actual architecture mismatch.
- No non-A route consumes another mutable generated route page as source.
- The full registered aggregate is clean on its first pass and second pass, so there is no build-order-only convergence defect.
- The three direct-owner first-run differences described in section 14 are resolved by declared post-processors and the registered chain returns byte-for-byte to baseline. They are deterministic pipeline boundaries, not an ownership collision or undeclared source repair.

## 4. Remaining B routes

| Route | Exact Minor Defect | Owner | Expected Cleanup Scope |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | Mobile menu remains open after Escape and `aria-expanded` remains `true` | `generate-halifax-calgary-route-pages.mjs` | Pair-local keyboard/menu behavior |
| `/halifax-to-calgary-movers/` | Same reproducible Escape defect | `generate-halifax-calgary-route-pages.mjs` | Pair-local keyboard/menu behavior |
| `/edmonton-to-winnipeg-movers/` | One visible `fully insured` claim remains | `rebuild-edmonton-winnipeg-routes.mjs` | Pair-template terminology |
| `/winnipeg-to-edmonton-movers/` | One visible `fully insured` claim remains | `rebuild-edmonton-winnipeg-routes.mjs` | Pair-template terminology |
| `/halifax-to-vancouver-movers/` | Raw canonical points to the reverse direction; settled canonical and `og:url` are self-canonical | `rebuild-halifax-vancouver-routes.mjs` | Direction-scoped raw canonical generation |
| `/vancouver-to-winnipeg-movers/` | Computed body font is `Inter, Arial, sans-serif`, not Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | Pair-owned typography declarations/assets |
| `/winnipeg-to-vancouver-movers/` | Computed body font is `Inter, Arial, sans-serif`, not Source Sans 3 | `rebuild-winnipeg-modern-routes.mjs` | Pair-owned typography declarations/assets |
| `/victoria-to-ottawa-movers/` | Mobile trigger lacks `aria-expanded`; Escape leaves the menu open | `rebuild-victoria-ottawa-route.mjs` | Direction-scoped ARIA and Escape handling |

## 5. Remaining C routes

Exactly one C route remains. It has not become A indirectly and cannot be downgraded to B on current evidence.

| Route | Owner | Exact Material Defect | Why Still C | Step Scope |
| --- | --- | --- | --- | --- |
| `/bc-to-washington-movers/` | `generate-spa-routes.mjs` | React renders the legacy `Moving Cost Breakdown` presentation; raw canonical and raw `og:url` point to the homepage, although runtime settles both to the route URL | Canonical pricing presentation is missing and durable source URL metadata remains wrong; correcting both the SPA-owned presentation and raw metadata is broader than a minor wording/style adjustment | One legitimate unpaired direction; route-scoped SPA output/configuration and generated HTML, preserving FAQ/title/forms/navigation/chatbot |

Render architecture: declared and actual `react-spa`. Source chain: its own preserved SPA-owned route HTML and compiled route component/bundle → FAQ finalizer → title normalizer → conversion/browser runtime. It does not consume another generated route page. Missing/non-canonical components are the canonical pricing presentation and durable self canonical/OG URL. Estimated cleanup is one focused Step 68 with no route creation and no shared-infrastructure redesign.

## 6. Routes promoted to A

| Route | Previous class | Current class | Reason |
| --- | --- | --- | --- |
| `/calgary-to-montreal-movers/` | C | A | Step 66 durably removed the duplicate glance; the current raw and timed rendered audits show exactly one glance and all other contracts pass |

No other route was promoted indirectly.

## 7. Routes reclassified D

None. Current D count: **0/56**.

## 8. Re-audit of every remaining previously non-A route

| Route | Previous Class | Current Class | Exact Remaining Defect |
| --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | B | B | Escape does not close the mobile menu or reset `aria-expanded` |
| `/halifax-to-calgary-movers/` | B | B | Escape does not close the mobile menu or reset `aria-expanded` |
| `/edmonton-to-winnipeg-movers/` | B | B | One visible `fully insured` claim |
| `/winnipeg-to-edmonton-movers/` | B | B | One visible `fully insured` claim |
| `/halifax-to-vancouver-movers/` | B | B | Reverse-direction raw canonical; runtime self-canonicalizes |
| `/vancouver-to-winnipeg-movers/` | B | B | Inter body font |
| `/winnipeg-to-vancouver-movers/` | B | B | Inter body font |
| `/victoria-to-ottawa-movers/` | B | B | Missing trigger ARIA state and broken Escape closure |
| `/bc-to-washington-movers/` | C | C | Legacy rendered pricing presentation plus homepage raw canonical/`og:url` |

No prior classification changed except Calgary → Montreal, listed in section 6.

## 9. Raw title results

- `<title>`: **56/56 canonical**.
- `og:title`: **56/56 canonical**.
- `twitter:title`: **56/56 canonical**.
- All three raw fields agree and have the exact terminal brand suffix once on every route.

Raw URL metadata is a separate contract: BC → Washington retains homepage canonical/`og:url`, and Halifax → Vancouver retains a reverse-direction canonical.

## 10. Rendered title results

- Routes attempted: **56**.
- Settled canonical title/OG/Twitter contract: **56/56**.
- Runtime-unavailable routes: **0**.
- Page errors affecting the contract: **0**.

## 11. Raw FAQ results

- One visible FAQ section: **56/56**.
- One FAQ heading: **56/56**.
- One FAQPage: **56/56**.
- At least one visible answer and exact visible/schema question, answer, and order parity: **56/56**.

## 12. Rendered FAQ results

- Routes attempted: **56**.
- Canonical settled FAQ contract: **56/56**.
- Runtime-unavailable routes: **0**.
- Every route has one section, one heading, one FAQPage, visible answers, exact question/answer/order parity, and no `.pcm-local-seo` node.

## 13. Global contamination/duplicate-component results

- Visible `.pcm-local-seo`: **0/56 raw, 0/56 rendered**.
- Unintended visible `undefined`: **0/56 raw, 0/56 rendered**.
- Legacy `Moving Cost Breakdown`: **0/56 raw visible, 1/56 rendered** — BC → Washington.
- Homepage-body contamination: **0/56 rendered**.
- Soft-404 signatures: **0/56 rendered**.
- Duplicate FAQ: **0/56 raw, 0/56 rendered**.
- Duplicate pricing tables: **0/56 rendered**; all routes settle with one table.
- Duplicate Route at a Glance: **0/56 rendered**; all routes settle with one heading.
- Expired promotion text: **0/56 raw visible** and no rendered finding.
- Stale pricing cards: **0/56 rendered**.

## 14. Source-durability findings

| Route group | Full-page source / route data | Route-scoped runtime/finalizer | FAQ/title finalizers and shared dependencies | Conclusion |
| --- | --- | --- | --- | --- |
| Calgary ↔ Halifax | Pair generator using checked-in route-specific source and explicit route data | Owner-emitted static mobile navigation | Bootstrap stripper, FAQ/title finalizers, conversion runtime | Deterministic; B interaction defect only |
| Edmonton ↔ Winnipeg | Pair-owned explicit templates and `edmonton-winnipeg-route-data.mjs` | `step34-edmonton-winnipeg.js/css` | FAQ/title finalizers, static navigation/chat | Deterministic; B terminology only |
| Halifax → Vancouver | Hydration-static template and frozen facts in `rebuild-halifax-vancouver-routes.mjs` | `step43-halifax-vancouver.js/css` | FAQ/title finalizers, static navigation/chat, conversion runtime | Deterministic; B raw canonical defect only |
| Vancouver ↔ Winnipeg | Explicit owned templates and `vancouver-winnipeg-route-data.mjs` | `step40-vancouver-winnipeg.js/css` | FAQ/title finalizers, static navigation/chat | Deterministic; B typography only |
| Victoria → Ottawa | Explicit template in the pair owner | Owner-emitted mobile navigation | FAQ/title finalizers and conversion runtime | Deterministic registered chain; B interaction defect only |
| BC → Washington | Own SPA-owned HTML and compiled React bundle | SPA/runtime URL normalization | FAQ/title finalizers and conversion runtime | Stable aggregate; C presentation/metadata, not D |

None uses a mutable other-route output as source. Ownership tests confirm explicit-template and order-independence protections where applicable.

## 15. Direct-owner/idempotency findings

Testing used a fresh temporary local clone overlaid with the current `site-copy`, `tools`, and package manifest. The owners for every current C route and every B route with source/runtime implications were run, then run a second time, followed by the applicable route finalizer, FAQ finalizer, and title normalizer.

| Route/group | Deterministic owner? | Canonical owner output? | First-run cleanup | Delayed repair / build-order finding |
| --- | --- | --- | --- | --- |
| BC → Washington | Yes; SPA owner preserves the owned page byte-for-byte | No; the known C pricing/raw-URL defects remain | None | No undeclared repair; defects persist through the chain |
| Calgary ↔ Halifax | Yes; second owner run is stable | Core content/title values are canonical; owner omits the authoritative-title marker | Two route-byte differences on first owner run | Declared title normalizer restores exact baseline; no aggregate drift |
| Edmonton ↔ Winnipeg | Yes | Canonical except the known B terminology | None | No delayed repair |
| Halifax ↔ Vancouver | Yes | Canonical except Halifax → Vancouver raw canonical | None | Runtime self-canonicalization does not fix raw source; B remains |
| Vancouver ↔ Winnipeg | Yes | Canonical except known Inter body font | None | No delayed repair |
| Ottawa ↔ Victoria | Yes; second owner run is stable | Victoria → Ottawa owner output omits the title brand suffix and retains the B menu defect | One route-byte difference on first owner run | Declared title normalizer restores exact baseline; no aggregate drift |

Combined stage comparisons: owners first run **3/56 route changes, 0/104 assets**; owners second run **0/56, 0/104**; route finalizer **0/56, 0/104**; FAQ finalizer **0/56, 0/104**; title normalizer **3/56, 0/104**, restoring those three routes. The final registered chain equals its temporary baseline at **0/56 route differences and 0/104 asset differences**. The declared post-processor dependency is deterministic and validated by both clean aggregate passes, so no route is reclassified D.

## 16. Pair/unpaired rollup

| Pair / Direction | Route A Class | Route B Class | Overall Class | Primary Defect |
| --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | complete | None |
| Calgary ↔ Halifax | B | B | minor cleanup | Mobile Escape closure |
| Calgary ↔ Montreal | A | A | complete | None |
| Calgary ↔ Ottawa | A | A | complete | None |
| Calgary ↔ Toronto | A | A | complete | None |
| Calgary ↔ Vancouver | A | A | complete | None |
| Calgary ↔ Winnipeg | A | A | complete | None |
| Edmonton ↔ Montreal | A | A | complete | None |
| Edmonton ↔ Ottawa | A | A | complete | None |
| Edmonton ↔ Toronto | A | A | complete | None |
| Edmonton ↔ Vancouver | A | A | complete | None |
| Edmonton ↔ Winnipeg | B | B | minor cleanup | Insurance terminology |
| Halifax ↔ Toronto | A | A | complete | None |
| Halifax ↔ Vancouver | B | A | minor cleanup | Halifax → Vancouver raw canonical |
| Montreal ↔ Toronto | A | A | complete | None |
| Montreal ↔ Vancouver | A | A | complete | None |
| Montreal ↔ Victoria | A | A | complete | None |
| Montreal ↔ Winnipeg | A | A | complete | None |
| Ottawa ↔ Toronto | A | A | complete | None |
| Ottawa ↔ Vancouver | A | A | complete | None |
| Ottawa ↔ Victoria | A | B | minor cleanup | Victoria → Ottawa ARIA/Escape |
| Ottawa ↔ Winnipeg | A | A | complete | None |
| Seattle ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Vancouver | A | A | complete | None |
| Toronto ↔ Victoria | A | A | complete | None |
| Toronto ↔ Winnipeg | A | A | complete | None |
| Vancouver ↔ Winnipeg | B | B | minor cleanup | Body font |
| Unpaired BC → Washington | C | — | material | Legacy pricing and raw URL metadata |
| Unpaired Victoria → Vancouver | A | — | complete | None |

No reverse route was inferred or created.

## 17. Exact current A/B/C/D counts

- **A — Canonical: 47/56**.
- **B — Minor cleanup: 8/56**.
- **C — Material: 1/56**.
- **D — Architecture/source: 0/56**.
- Total: **56/56**.

These counts were recalculated from the current project and current browser/source evidence, not inferred only by arithmetic from Step 65.

## 18. Exact current pair/unpaired counts

Among 27 bidirectional pairs:

- **22 complete**.
- **5 minor cleanup**.
- **0 material**.
- **0 source repair**.

Among two legitimate unpaired directions: Victoria → Vancouver is complete and BC → Washington is material. Combined across all 29 pair/direction groups: **23 complete, 5 minor cleanup, 1 material, and 0 source repair**.

## 19. Ranked remaining cleanup queue

1. **BC → Washington** — C; legacy user-visible pricing presentation plus wrong durable raw URL metadata; legitimate unpaired direction with clear SPA ownership.
2. **Edmonton ↔ Winnipeg** — B/B; narrow deterministic pair-template terminology cleanup.
3. **Halifax ↔ Vancouver** — B/A; direction-scoped raw canonical correction with high SEO relevance.
4. **Calgary ↔ Halifax** — B/B; pair-local Escape behavior.
5. **Ottawa ↔ Victoria** — A/B; direction-scoped ARIA/Escape behavior.
6. **Vancouver ↔ Winnipeg** — B/B; pair-owned body typography cleanup.

The ranking applies material before minor cleanup, then considers business/SEO importance, visible severity, ownership clarity, route-scoped fixability, regression risk, clean-aggregate likelihood, and the ability to finish both directions together.

## 20. Recommended Step 68 target

**Legitimate unpaired direction: `/bc-to-washington-movers/`.**

## 21. Why Step 68 target is next

- It is the only route that still qualifies as C — Material.
- The legacy pricing presentation is user-visible, and the homepage raw canonical/`og:url` is an SEO/source-durability defect.
- It has explicit ownership under `generate-spa-routes.mjs` and a known React SPA architecture.
- It is a legitimate registered unpaired direction; no reverse route needs to be inferred or created.
- The current full aggregate is clean twice, providing a stable baseline for deterministic route-scoped work.
- The work can avoid navigation, chatbot, shared runtime, and broad infrastructure changes.

## 22. Ownership/tests

- Ownership/architecture validator: **PASS — 56 routes, 56 owners, zero collisions**.
- Ownership, title-normalizer, and chatbot-pricing tests: **35/35 PASS**.
- Ownership mismatches or declared/actual render contradictions: **0**.

## 23. Syntax

- Current `.mjs` files checked recursively under `tools`: **127**.
- Syntax passes: **127/127**.
- Syntax failures: **0**.

## 24. Browser regression

- Deduplicated registered routes attempted: **53**.
- Passed: **53/53**.
- Failed: **0**.

The established suite includes both Calgary ↔ Montreal directions exactly once and does not inflate the attempted count.

## 25. Aggregate pass 1

A fresh local Git clone with hardlinks disabled was overlaid with the current `site-copy`, `tools`, and package manifest before hashing. Full aggregate pass 1 produced:

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed. Step 67A reconciliation is not required.

## 26. Aggregate pass 2

Full aggregate pass 2 in the same qualifying clone produced:

- **0/56 route drift**.
- **0/104 asset drift**.

## 27. Read-only workspace verification

The original workspace was hashed before any audit. Aggregate and direct-owner work ran only in fresh temporary clones. After report and evidence creation, `STEP_67_FINAL_WORKSPACE.json` compared with `STEP_67_BASELINE.json` showed:

- Registered route HTML changes: **0/56**.
- Asset changes: **0/104**.

Only Step 67 report/evidence files were created. No route cleanup was performed.

## 28. Remaining known issues

Eight B routes and one C route remain: Calgary ↔ Halifax mobile Escape behavior; Edmonton ↔ Winnipeg insurance terminology; Halifax → Vancouver raw canonical; Vancouver ↔ Winnipeg body font; Victoria → Ottawa ARIA/Escape behavior; and BC → Washington legacy pricing plus raw canonical/`og:url`. Calgary ↔ Montreal remains A/A. D remains zero.

No deployment occurred. Step 68 was not started.

Step 67 cleanup-queue refresh is complete. No route cleanup was performed.

Recommended Step 68 target: **`/bc-to-washington-movers/`**.
