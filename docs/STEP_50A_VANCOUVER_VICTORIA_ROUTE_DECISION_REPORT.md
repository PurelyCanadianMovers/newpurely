# Step 50A — Vancouver/Victoria route-inventory decision

Step 50A was a read-only inventory and architecture audit. It did not create `/vancouver-to-victoria-movers/`, modify `/victoria-to-vancouver-movers/`, change ownership or generators, standardize either direction, deploy, or begin Step 51.

## 1. Confirmed current 56-route state

The executable ownership registry contains 56 entries. The ownership map also contains 56 unique route URLs, and the authoritative writer manifest resolves to 56 full-page claims. `node tools/validate-route-page-ownership.mjs site-copy` passes: all 56 registered route directories have exactly one declared owner and there are zero collisions.

The inventory is intentionally described here as the **current** state. This audit found no evidence that the registry already reserves a fifty-seventh route.

## 2. Existing Victoria → Vancouver architecture

| Field | Confirmed state |
| --- | --- |
| Route | `/victoria-to-vancouver-movers/` |
| Registry owner | `checked-in-static-route-source` |
| Owner type | `checked-in-static-source` |
| Declared rendering | Static |
| Actual rendering | Static checked-in document |
| React bootstrap | Absent from the checked-in page |
| Compiled router registration | Present in the shared compiled bundle, but not used by the checked-in static page |
| Runtime enhancer | `site-copy/assets/conversion-boost.js` |
| Static navigation | Present |
| Static chatbot | Present |
| Post-processors | `finalize-route-faq-architecture.mjs`; `normalize-route-title-metadata.mjs` |

The writer manifest treats the checked-in document as the authoritative full-page source and does not assign it a generator. The aggregate build preserves that source and applies the registered shared post-processors.

## 3. Missing Vancouver → Victoria verification

`/vancouver-to-victoria-movers/` has:

- no ownership-registry entry;
- no writer-manifest claim;
- no route directory or HTML document;
- no full-page owner, generator, route-data object, or historical template;
- no exact compiled-router registration;
- no sitemap entry;
- no redirect or alias;
- no hub, navigation, related-destination, chatbot, or cost-guide link;
- no current dead internal link.

An exact-slug search returned zero matches across the worktree (excluding `.git` and dependencies). `git log --all -S'vancouver-to-victoria-movers'` and path history for `site-copy/vancouver-to-victoria-movers/**` also returned no matches. This is **No evidence**, not an explicit planned route and not an explicit exclusion.

## 4. Step 48 evidence

Step 48 classified Victoria → Vancouver as status C because of a legacy cost block, a missing canonical glance component at that audit baseline, and substantive FAQ/content defects. It explicitly called Victoria → Vancouver an **unpaired registered direction**, excluded both unpaired material routes from the 27 bidirectional-pair counts, and listed it under material work as `Unpaired: Victoria → Vancouver`.

Step 48 reported 38 canonical routes, 13 minor-cleanup routes, five material routes, 17 complete pairs, eight minor-cleanup pairs, two material pairs, and two material unpaired directions. It recommended Seattle ↔ Vancouver for Step 49. It did **not** state that Vancouver → Victoria should later be created, that the existing direction should eventually be paired, or that the omission was intentional. Its support is therefore: standardize the registered direction as unpaired; reverse-route intent remained unaddressed.

## 5. Historical/project references to Vancouver → Victoria

No durable project reference to the exact reverse slug was found in TODOs, route-creation lists, ownership notes, generators, templates, sitemap logic/output, pricing data, chatbot data, documentation, redirects, or Git history.

The existing Victoria → Vancouver page mentions the reverse move in prose and FAQ text, including that Vancouver-to-Victoria moves are handled. Those statements describe service capability; they do not name a reverse URL, supply a reverse source chain, or constitute a route-creation plan.

Classification: **No evidence** of a planned reverse route. There is also no explicit record permanently excluding one.

## 6. Current site/hub/internal-link treatment

- The Victoria long-distance hub has a deterministic `Routes From Victoria` list whose first entry is Victoria → Vancouver.
- The Vancouver long-distance hub contains no Vancouver → Victoria route link and no comparable route-list source for this direction.
- The sitemap lists Victoria → Vancouver only.
- The compiled router and conversion-title map recognize Victoria → Vancouver only.
- The general long-distance navigation leads users to service/hub pages; it does not expose a Vancouver → Victoria route.
- The current cost guide contains a popular-route row for Victoria → Vancouver only.
- The deterministic chatbot cost table contains neither Victoria → Vancouver nor Vancouver → Victoria.
- Victoria/Vancouver Island service information remains reachable through the Victoria long-distance hub and other Victoria-focused pages. Vancouver local pages cover Vancouver pickup/access services but are not a reverse-direction substitute.

Users can currently reach the corridor through Victoria → Vancouver and through Victoria/Vancouver service hubs. There is no reverse-direction page, redirect, or alias.

## 7. Directional-content distinctiveness assessment

A future Vancouver → Victoria page could be directionally distinct if it were independently authored around Vancouver pickup, strata/elevator/loading coordination, mainland ferry-departure planning, and Victoria delivery/access. The existing direction can independently focus on Victoria pickup, Vancouver Island departure, ferry logistics, and Vancouver delivery/strata/loading.

That potential is real but is not sufficient evidence to create a page. The current Victoria → Vancouver document already promotes service in both directions and answers a reverse-direction FAQ. A new page created by reversing the existing copy or facts would substantially overlap that document and Victoria/Vancouver Island service content. Meaningful differentiation would require new, independently reviewed copy and a deliberate redistribution of the existing bidirectional statements.

Assessment: a distinct page is possible, but current implementation would carry significant duplication/overlap risk and the repository does not demonstrate a present architectural need for it.

## 8. Pricing/data readiness

| Fact | Victoria → Vancouver | Vancouver → Victoria |
| --- | --- | --- |
| Distance | Checked-in route: approximately 115 km; cost-guide popular row: 110 km | No route-owned value |
| Transit | 1–3 days | No route-owned value |
| Studio | $1,200+ | No route-owned value |
| 1-bedroom | $1,600+ | No route-owned value |
| 2-bedroom | $2,200+ | No route-owned value |
| 3-bedroom | $3,000+ | No route-owned value |
| 4+ bedroom | $4,200+ | No route-owned value |
| Overall range | $1,200–$4,200 | No route-owned value |
| Durable source exists? | Partial: values are serialized in the authoritative checked-in page, but there is no frozen pair-owned data object and the cost-guide distance conflicts with the page | No |

The existing route's page and FAQ provide a usable fact set, but data durability is weaker than on pairs with a frozen route-data module. The cost guide supplies only a Victoria → Vancouver distance/transit row, not the five price rows, and its 110 km distance differs from the page's approximately 115 km. The deterministic chatbot's authoritative pricing array supplies neither direction.

No authoritative Vancouver → Victoria distance, transit, five-row pricing, range, FAQ dataset, or route-data object exists. Step 50A does not infer symmetry or copy the existing direction's numbers.

## 9. Technical scope if route #57 were created

A separately authorized new-route project would need to address at least:

1. Add a declared full-page owner and rendering class in `tools/route-page-ownership.mjs`.
2. Add an authoritative writer-manifest relationship (the manifest derives route claims from the registry, but a real owner/generator and execution ordering would still be required).
3. Create independent route data, a full-page source/template or generator, and deterministic FAQ/schema/title handling.
4. Decide static versus React architecture. The compiled router currently has no exact reverse route; a static route would need explicit discovery/preservation and declared static nav/chat dependencies.
5. Add the route intentionally to sitemap discovery/output.
6. Add a deliberate Vancouver-hub entry; review the Victoria hub and both directions' related-destination links for coherent cross-linking.
7. Add authoritative cost-guide distance/transit/pricing records and resolve the existing 110/115 km discrepancy before sharing facts.
8. Add deterministic chatbot pricing/recognition and update `tools/chatbot-route-pricing.test.mjs`.
9. Add the conversion-title/metadata mapping if that runtime remains applicable.
10. Add route-level title, FAQ, content, form-default, navigation/chat, desktop/mobile, and delayed-runtime regression coverage.
11. Update ownership-count assertions, route inventory validation, aggregate baselines, and reports that make current 56-route claims.
12. Validate internal links, route discovery, one-owner/zero-collision status, first-pass and second-pass aggregate convergence, and working-tree isolation at the intentional 57-route baseline.

Navigation dropdown changes are not automatically required because current primary navigation points to hubs rather than every route. They would require a separate product decision, not an inferred addition.

## 10. Hard-coded route-count assumptions

| Location/type | Classification | Route #57 impact |
| --- | --- | --- |
| `tools/route-page-ownership.test.mjs` title and two assertions | Test assertion; hard-coded 56 | Must intentionally change to 57 |
| `tools/validate-route-page-ownership.mjs` inventory error wording and directory-count assertion | Build/validation assumption; hard-coded 56 | Must intentionally change to 57 |
| `tools/write-step28-report.mjs` | Historical report generator; hard-coded historical 56/56 claims | Historical evidence should not be rewritten; future reporting must not reuse it as a current 57-route report |
| `routePageOwnership` consumers in hash, title, FAQ, writer-manifest, mirror, and aggregate tools | Automatically derived | Would include route #57 after correct registry/manifest ownership is added |
| Existing `STEP_*` reports and evidence JSON files | Documentation/historical baselines | Remain historical 56-route records; new reports/baselines must clearly start at 57 |
| Sitemap generation | Discovery-derived plus explicit route-discovery/exclusion lists | Requires deliberate discovery/inclusion; it is not activated by changing a count alone |

The executable hard-coded migration is concentrated but consequential: the ownership test and ownership validator enforce 56. Many other tools derive their loops from the registry, while a large body of documentation and aggregate evidence correctly records the historical 56-route baseline.

## 11. Relationship to Victoria → Vancouver harness issue

The missing reverse slug does not appear in the existing page's inline correction script, shared conversion runtime, static navigation, static chatbot, compiled router, redirects, or any DOM-wait condition found by the exact-slug search. No runtime code waits for, fetches, or links to it.

Historical project evidence instead attributes the existing limitation to the Victoria → Vancouver document's legacy body `MutationObserver`. The current page still installs a document-element subtree observer, repeatedly applies route corrections, and disconnects after five seconds. Step 50A does not test or fix that behavior.

**The missing Vancouver → Victoria route is not the cause of the Victoria → Vancouver harness limitation.**

## 12. Recommendation A or B

**RECOMMENDATION A — Keep the current 56-route inventory.**

Do not create Vancouver → Victoria as part of the current standardization sequence. Rewrite/rescope Step 50 to standardize only the registered `/victoria-to-vancouver-movers/` direction.

## 13. Reasoning for recommendation

- No current or historical project evidence establishes reverse-route intent.
- The reverse slug has no owner, source, data, sitemap/hub entry, router entry, redirect, cost-guide row, or chatbot mapping.
- Vancouver → Victoria lacks authoritative route facts and all five pricing values.
- Even the existing direction lacks a frozen route-data object and has a 110/115 km internal-source discrepancy that should be resolved during its own standardization.
- The existing page already covers both directions, creating duplication risk unless a new content strategy is separately approved.
- Step 48 explicitly treated Victoria → Vancouver as unpaired material work and did not recommend creating its reverse.
- Route #57 would be a legitimate new-route project spanning ownership, generation, data, sitemap, hubs, chatbot, tests, and baselines—not a presentation cleanup.

This recommendation does not declare that a reverse page could never be justified. It concludes only that creating it now would be speculative under the current repository evidence.

## 14. Exact proposed next step

Issue a revised **Step 50-only** authorization targeting `/victoria-to-vancouver-movers/` as one unpaired registered direction. That step should standardize its canonical presentation, establish a durable route-owned data/finalizer chain, reconcile the 110/115 km internal fact discrepancy without inventing data, and perform the already requested focused browser-harness investigation. It should preserve the 56-route ownership baseline and must not create `/vancouver-to-victoria-movers/`.

Any later desire for Vancouver → Victoria should begin with a separately authorized new-route discovery/data step, not be folded into Step 50.

## 15. Read-only verification

Before the audit, `tools/hash-route-build-state.mjs` hashed 56 registered route HTML files and 102 current assets. After creating this report, the same hash procedure again covered the same 56 routes and 102 assets. The pre/post comparison reported:

- **0/56 route changes**;
- **0/102 asset changes**;
- no route, shared asset, source, ownership, manifest, generator, test, sitemap, hub, cost-guide, chatbot, or production change.

The report is the only Step 50A workspace addition. Pre-existing working-tree modifications, including the already-modified Victoria → Vancouver HTML and other prior-step files, were preserved without alteration. No deployment occurred, Step 50 presentation work did not begin, and Step 51 did not begin.

`Step 50A recommends keeping the 56-route inventory and standardizing Victoria → Vancouver as an unpaired direction.`
