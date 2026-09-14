# Step 51 — Remaining minor-cleanup refresh

Scope: read-only refresh of the 56 registered route pages after Steps 49 and 50. No route cleanup, source repair, ownership change, shared-runtime change, deployment, or Step 52 work was performed.

## 1. Current ownership baseline

- Registered route HTML files: **56**.
- Current assets: **104**.
- Ownership entries: **56**.
- Full-page owners: **56/56 exactly one each**.
- Ownership collisions: **0**.
- `node tools/validate-route-page-ownership.mjs site-copy`: **PASS**.
- Ownership/title/chatbot-pricing tests: **35/35 PASS**.
- Declared rendering versus checked-in markup: **56/56 valid**, including the three documented architecture exceptions.

`STEP_51_BEFORE.json` preserves the pre-audit SHA-256 baseline. The working tree was already materially dirty; Step 51 did not attribute or overwrite those earlier changes.

## 2. Step 48 minor routes re-audited

The Step 48 status-B route files are byte-identical to their Step 48 post-audit hashes. The only route HTML changes since Step 48 are the two Step 49 Seattle directions and the Step 50 Victoria → Vancouver direction.

| Route | Step 48 status | Current status | Remaining defect |
| --- | --- | --- | --- |
| Calgary → Halifax | B — Minor cleanup | **B — Minor cleanup** | Mobile menu does not close on Escape |
| Halifax → Calgary | B — Minor cleanup | **B — Minor cleanup** | Mobile menu does not close on Escape |
| Edmonton → Montreal | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured`; mobile menu open state does not update `aria-expanded` and Escape does not close it |
| Montreal → Edmonton | B — Minor cleanup | **D — Architecture/source issue** | Raw shell has an FAQ heading/schema but no raw visible Q&A; runtime supplies 12 canonical Q&A. Raw canonical/OG URL also serializes the site root |
| Edmonton → Winnipeg | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured` terminology |
| Winnipeg → Edmonton | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured` terminology |
| Halifax → Vancouver | B — Minor cleanup | **B — Minor cleanup** | Raw canonical points to Vancouver → Halifax until runtime correction |
| Montreal → Victoria | B — Minor cleanup | **D — Architecture/source issue** | Raw shell has an FAQ heading/schema but no raw visible Q&A; runtime supplies 12 canonical Q&A. Raw canonical/OG URL also serializes the site root |
| Vancouver → Edmonton | B — Minor cleanup | **B — Minor cleanup** | Visible `fully insured` terminology |
| Vancouver → Winnipeg | B — Minor cleanup | **B — Minor cleanup** | Body-level computed font is Inter instead of Source Sans 3 |
| Winnipeg → Vancouver | B — Minor cleanup | **B — Minor cleanup** | Body-level computed font is Inter instead of Source Sans 3 |
| Victoria → Montreal | B — Minor cleanup | **B — Minor cleanup** | Mobile menu does not close on Escape |
| Victoria → Ottawa | B — Minor cleanup | **B — Minor cleanup** | Mobile trigger lacks `aria-expanded`; Escape does not close the menu |

No Step 48 minor route became canonical indirectly. Two are now separated as D because Step 51 explicitly requires raw FAQ canonicality; the same raw condition is present in the Step 48 evidence, so it is a newly recognized classification issue, not post-Step-48 drift.

## 3. Routes that became canonical since Step 48

The three routes directly completed by Steps 49 and 50 are now **A — Canonical**:

- Vancouver → Seattle.
- Seattle → Vancouver.
- Victoria → Vancouver, retained as a legitimate unpaired registered direction.

Each has one H1, quote panel/form, pricing section/table, glance, FAQ section/heading/`FAQPage`, and footer; zero `.pcm-local-seo` and `undefined`; correct directional form values; canonical desktop/mobile H1 typography; Source Sans 3 body typography; contained mobile pricing; working menu Escape state; and self-referential raw canonical/OG URLs. `/vancouver-to-victoria-movers/` does not exist and was not included.

## 4. Routes still classified B — Minor cleanup

**11 routes** remain B:

- Calgary → Halifax; Halifax → Calgary.
- Edmonton → Montreal.
- Edmonton → Winnipeg; Winnipeg → Edmonton.
- Halifax → Vancouver.
- Vancouver → Edmonton.
- Vancouver → Winnipeg; Winnipeg → Vancouver.
- Victoria → Montreal.
- Victoria → Ottawa.

### Component contract for current B routes

Columns are H1 / quote panel / primary form / pricing section / pricing table / Route at a Glance / FAQ section / FAQ heading / `FAQPage` / `.pcm-local-seo` / `undefined` / footer.

| Route | H1 | Quote | Form | Pricing | Table | Glance | FAQ sec. | FAQ H2 | FAQPage | Local SEO | Undefined | Footer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Calgary → Halifax | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Halifax → Calgary | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Edmonton → Montreal | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Edmonton → Winnipeg | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Winnipeg → Edmonton | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Halifax → Vancouver | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Vancouver → Edmonton | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Vancouver → Winnipeg | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Winnipeg → Vancouver | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Victoria → Montreal | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| Victoria → Ottawa | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |

These are structurally close to canonical; none is understated as minor despite missing a major rendered component.

## 5. Routes reclassified C — Material

No route moved from A or B to C. Two Step 48 material routes remain C because Steps 49–50 did not target them:

| Route | Current material defect |
| --- | --- |
| BC → Washington | Legacy three-column `Moving Cost Breakdown`, non-canonical pricing presentation, and raw canonical durability |
| Calgary → Montreal | Duplicate Route at a Glance presentation |

## 6. Routes reclassified D — Architecture/source issue

The ownership and declared-rendering architecture has no new mismatch. The stricter Step 51 raw FAQ contract does, however, expose a persistent source-durability issue on nine React-owned routes: raw HTML contains one FAQ section/heading and one schema object but **zero raw visible Q&A**, while the browser runtime renders and aligns the Q&A/schema. These same raw results existed in Step 48; they did not newly appear after Steps 49–50.

| Route | Raw visible Q&A | Raw schema entries | Settled visible/schema | Current status |
| --- | ---: | ---: | ---: | --- |
| Calgary → Toronto | 0 | 11 | 11/11 | **D** |
| Toronto → Calgary | 0 | 9 | 9/9 | **D** |
| Edmonton → Toronto | 0 | 12 | 12/12 | **D** |
| Toronto → Edmonton | 0 | 12 | 12/12 | **D** |
| Edmonton → Vancouver | 0 | 9 | 9/9 | **D** |
| Montreal → Edmonton | 0 | 8 | 12/12 | **D** |
| Montreal → Toronto | 0 | 12 | 12/12 | **D** |
| Toronto → Montreal | 0 | 9 | 9/9 | **D** |
| Montreal → Victoria | 0 | 12 | 12/12 | **D** |

This is not a duplicate FAQ and the rendered experience is canonical, but it fails the required raw invariant and should not be folded into an ordinary wording cleanup. Step 51 does not repair it.

## 7. Defect type by remaining route

| Route | Defect type | Severity | Expected scope |
| --- | --- | --- | --- |
| Calgary → Halifax | nav behavior; responsive behavior | Low–medium | Pair-scoped mobile Escape handling |
| Halifax → Calgary | nav behavior; responsive behavior | Low–medium | Pair-scoped mobile Escape handling |
| Edmonton → Montreal | terminology; nav behavior | Medium | Route-scoped copy plus documented fallback-nav state/Escape handling |
| Edmonton → Winnipeg | terminology | Low | Pair-owned source copy |
| Winnipeg → Edmonton | terminology | Low | Pair-owned source copy |
| Halifax → Vancouver | metadata; source durability | Medium | Direction-scoped raw canonical correction in the owned generator |
| Vancouver → Edmonton | terminology | Low | Route-owned finalizer/data copy |
| Vancouver → Winnipeg | typography only | Low | Pair-scoped body font rule |
| Winnipeg → Vancouver | typography only | Low | Pair-scoped body font rule |
| Victoria → Montreal | nav behavior; responsive behavior | Low–medium | Direction-scoped static mobile Escape handling |
| Victoria → Ottawa | nav behavior; responsive behavior | Medium | Direction-scoped `aria-expanded` and Escape handling |

No current B route has a metadata or FAQ defect unless listed above. The nine D routes have `source durability` and `FAQ wording/parity` at raw-source level.

## 8. Route-fact consistency findings

Pricing, glance, FAQ, schema, and rendered body were re-compared for the remaining candidates. Route files are byte-identical to the Step 48 fact-audit baseline, current form defaults are directional, and the rendered FAQ/schema audit is exact.

- No candidate contains conflicting distance values.
- No candidate contains contradictory transit windows.
- Pricing rows/ranges remain internally compatible with glance and FAQ summaries.
- Visible FAQ and settled schema remain one-to-one.
- No new external research was performed and no authoritative fact was changed.

## 9. Metadata/title/FAQ results

### Titles

- Raw title, `og:title`, and `twitter:title`: **56/56 canonical**, mutually equal, and branded once.
- Browser-evaluated titles: **56/56 canonical**.

### FAQ

- Browser-evaluated FAQ: **56/56 canonical** — one section, heading and `FAQPage`, with exact visible/schema parity.
- Raw FAQ shell counts: **56/56 have one section, heading and `FAQPage`**.
- Raw visible Q&A/schema parity: **47/56 canonical; 9/56 fail** because raw visible Q&A are absent. The nine are classified D in section 6.

Therefore the requested raw FAQ expectation is not met, even though the browser contract passes globally.

## 10. Typography/responsive findings

- All current B routes use Playfair Display headings and compute H1 at 48/60/700 desktop and 36/45/700 mobile.
- Nine of the 11 current B routes compute Source Sans 3 at body level. Vancouver ↔ Winnipeg computes `Inter, Arial, sans-serif` at body level; route content has a narrower pair-scoped Source Sans rule, but the documented body contract remains unmet.
- All 11 have one-column mobile quote/form flow, contained pricing overflow, stacked glance presentation, correct form defaults, and no page-level horizontal overflow at 390 px.
- Mobile menu defects remain only where listed in section 7. Other current B candidates close on Escape and expose correct open state.

## 11. Source-durability findings

| Route(s) | Full-page owner | Route facts/source data | Route-scoped finalizer | Other post-processors |
| --- | --- | --- | --- | --- |
| Calgary ↔ Halifax | `generate-halifax-calgary-route-pages.mjs` | Frozen inline shared facts and explicit direction records in the owner | None | bootstrap stripper; FAQ finalizer; title normalizer |
| Edmonton → Montreal | `generate-spa-routes.mjs` | Compiled route output plus deterministic values in `finalize-montreal-edmonton-routes.mjs` | Montreal/Edmonton finalizer | bootstrap stripper; FAQ finalizer; title normalizer |
| Edmonton ↔ Winnipeg | `rebuild-edmonton-winnipeg-routes.mjs` | `edmonton-winnipeg-route-data.mjs` and explicit pair templates | None | FAQ finalizer; title normalizer |
| Halifax → Vancouver | `rebuild-halifax-vancouver-routes.mjs` | Explicit route facts/pricing/direction records plus the hydration-static reference template | None | FAQ finalizer; title normalizer |
| Vancouver → Edmonton | `finalize-vancouver-edmonton-routes.mjs` | Explicit route records, price rows and FAQ data in the owner | Owner is the route-specific static finalizer | FAQ finalizer; title normalizer |
| Vancouver ↔ Winnipeg | `rebuild-winnipeg-modern-routes.mjs` | Explicit owned templates and pair-scoped Step 40 assets | None | FAQ finalizer; title normalizer |
| Victoria → Montreal | checked-in static route source | Checked-in page plus explicit Montreal/Victoria finalizer FAQ data | Montreal/Victoria finalizer | FAQ finalizer; title normalizer |
| Victoria → Ottawa | `rebuild-victoria-ottawa-route.mjs` | Explicit direction record and owned Victoria/Ottawa templates | None | FAQ finalizer; title normalizer |

No current B route consumes another route's mutable generated HTML. Ownership validation and both aggregate passes confirm deterministic source chains. The nine D routes remain browser-correct but depend on runtime rendering for raw-missing FAQ Q&A and therefore require a separate source-level reconciliation.

## 12. Pair/unpaired rollup

| Pair / direction | Route A | Route B | Main defect | Estimated cleanup scope | Group class |
| --- | --- | --- | --- | --- | --- |
| Calgary ↔ Edmonton | A | A | None | None | complete |
| Calgary ↔ Halifax | B | B | Mobile Escape closure | Small pair-scoped interaction change | minor cleanup |
| Calgary ↔ Montreal | C | A | Duplicate glance on Calgary → Montreal | Material one-direction standardization | material |
| Calgary ↔ Ottawa | A | A | None | None | complete |
| Calgary ↔ Toronto | D | D | Raw FAQ Q&A absent | Pair source reconciliation | architecture/source issue |
| Calgary ↔ Vancouver | A | A | None | None | complete |
| Calgary ↔ Winnipeg | A | A | None | None | complete |
| Edmonton ↔ Montreal | B | D | Terminology/nav plus raw FAQ source | Source issue first | architecture/source issue |
| Edmonton ↔ Ottawa | A | A | None | None | complete |
| Edmonton ↔ Toronto | D | D | Raw FAQ Q&A absent | Pair source reconciliation | architecture/source issue |
| Edmonton ↔ Vancouver | D | B | Raw FAQ source plus terminology | Source issue first | architecture/source issue |
| Edmonton ↔ Winnipeg | B | B | Terminology | Small pair-owned copy change | minor cleanup |
| Halifax ↔ Toronto | A | A | None | None | complete |
| Halifax ↔ Vancouver | B | A | Reverse raw canonical on Halifax → Vancouver | Small direction-scoped metadata change | minor cleanup |
| Montreal ↔ Toronto | D | D | Raw FAQ Q&A absent | Pair source reconciliation | architecture/source issue |
| Montreal ↔ Vancouver | A | A | None | None | complete |
| Montreal ↔ Victoria | D | B | Raw FAQ source plus Escape closure | Source issue first | architecture/source issue |
| Montreal ↔ Winnipeg | A | A | None | None | complete |
| Ottawa ↔ Toronto | A | A | None | None | complete |
| Ottawa ↔ Vancouver | A | A | None | None | complete |
| Ottawa ↔ Victoria | A | B | Victoria → Ottawa ARIA/Escape | Small direction-scoped interaction change | minor cleanup |
| Ottawa ↔ Winnipeg | A | A | None | None | complete |
| Seattle ↔ Vancouver | A | A | None | None | complete |
| Toronto ↔ Vancouver | A | A | None | None | complete |
| Toronto ↔ Victoria | A | A | None | None | complete |
| Toronto ↔ Winnipeg | A | A | None | None | complete |
| Vancouver ↔ Winnipeg | B | B | Body font | Small pair-scoped CSS/source change | minor cleanup |
| Unpaired BC → Washington | C | — | Legacy pricing/raw metadata | Material direction standardization | material |
| Unpaired Victoria → Vancouver | A | — | None | None | complete |

## 13. Current exact counts

- **34/56 A — Canonical**.
- **11/56 B — Minor cleanup**.
- **2/56 C — Material standardization**.
- **9/56 D — Architecture/source issue**.

## 14. Current pair counts

Among 27 bidirectional pairs:

- **15 complete pairs**.
- **5 minor-cleanup pairs**.
- **1 material pair**.
- **6 architecture/source-issue pairs**.

Among two legitimate unpaired registered directions: Victoria → Vancouver is complete and BC → Washington is material.

## 15. Ranked minor-cleanup queue

Pair groups containing a D route are held out until their source issue is reconciled.

1. **Vancouver ↔ Winnipeg** — high-value corridor, both directions share one narrow typography defect, deterministic pair owner/assets, very low regression surface.
2. **Edmonton ↔ Winnipeg** — both directions share one terminology defect in a frozen, pair-owned generator/data/template chain.
3. **Halifax ↔ Vancouver** — high-value coast-to-coast corridor; one direction needs a narrow raw-canonical correction in its explicit owner.
4. **Calgary ↔ Halifax** — both directions share one mobile Escape defect; scope is pair-local but interaction regression risk is higher than copy/metadata.
5. **Ottawa ↔ Victoria** — one direction needs mobile ARIA/Escape cleanup; deterministic ownership, but keyboard/focus behavior requires focused responsive QA.

## 16. Recommended Step 52 target

**Vancouver ↔ Winnipeg**.

## 17. Reason for Step 52 selection

- Both registered directions genuinely remain B and have no D prerequisite.
- The corridor is commercially and SEO-relevant.
- The defect is one exact, measurable typography mismatch: body-level Inter versus Source Sans 3.
- Both directions share the same deterministic owner and pair-scoped Step 40 stylesheet/runtime.
- The cleanup can be route-pair scoped without new routes, ownership changes, or shared infrastructure.
- Regression risk is low and verification is straightforward at desktop/mobile breakpoints.

## 18. Read-only working-tree verification

- Pre-audit: **56 route hashes and 104 asset hashes**.
- Post-audit: **56 route hashes and 104 asset hashes**.
- Comparison: **0/56 route changes; 0/104 asset changes**.
- Only this report and Step 51 evidence JSON files were created. No production/source file was changed.

## 19. First aggregate result

The current working baseline was copied into a fresh temporary Git clone before generation.

- Baseline: 56 routes; 104 assets.
- First aggregate: **0/56 route drift; 0/104 asset drift**.

## 20. Second aggregate result

- Second aggregate versus first: **0/56 route drift; 0/104 asset drift**.
- No Step 51A aggregate reconciliation is required.

## 21. Remaining known issues

- Nine React-owned routes fail raw FAQ Q&A presence/parity while passing after runtime; they are classified D and need source reconciliation outside Step 51.
- BC → Washington and Calgary → Montreal remain material C work.
- Eleven route directions retain the minor metadata, terminology, typography, or mobile-nav defects in section 7.
- The aggregate is deterministic and ownership remains collision-free.
- No deployment occurred and Step 52 did not begin.

Evidence: `STEP_51_BEFORE.json`, `STEP_51_AFTER.json`, `STEP_51_TITLE_GLOBAL.json`, `STEP_51_FAQ_GLOBAL.json`, `STEP_51_MINOR_CANDIDATE_AUDIT.json`, `STEP_51_AGGREGATE_BASELINE.json`, `STEP_51_AGGREGATE_FIRST.json`, and `STEP_51_AGGREGATE_SECOND.json`.

Step 51 minor-cleanup refresh is complete. No route cleanup was performed.

Recommended Step 52 target: **Vancouver ↔ Winnipeg**.
