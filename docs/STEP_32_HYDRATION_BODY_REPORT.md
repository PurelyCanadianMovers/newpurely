# Step 32 SPA hydration/body report

## 1. Exact nine affected routes

- `/bc-to-washington-movers/`
- `/calgary-to-vancouver-movers/`
- `/montreal-to-calgary-movers/`
- `/ottawa-to-edmonton-movers/`
- `/toronto-to-vancouver-movers/`
- `/toronto-to-victoria-movers/`
- `/vancouver-to-calgary-movers/`
- `/vancouver-to-halifax-movers/`
- `/vancouver-to-toronto-movers/`

These are the nine routes marked as SPA fallbacks by Step 31. Fresh Step 32 reproduction found three active settled-body failures, not nine: the Calgary/Vancouver pair remained on the homepage shell and Vancouver/Halifax fell through to the SPA 404. The other six replaced the generic raw shell with the correct React route.

## 2. Pre-fix raw versus settled body state

All nine raw files were generic SPA entry documents: their raw source title was route-specific, the source canonical/OG URL was the homepage value with an inline path updater, the first raw H1 was the homepage H1, and the React bootstrap was present. Route identity below refers to the direct browser state after the bundle ran.

| Route | Pre-fix owner | Raw body correct? | Early/settled body | Pre-fix quote values | Result |
| --- | --- | --- | --- | --- | --- |
| BC → Washington | `generate-spa-routes.mjs` | No; generic SPA shell | Correct route | Toronto → Calgary | Route body reproduced correctly; defaults wrong |
| Calgary → Vancouver | `generate-spa-routes.mjs` | No; generic SPA shell | Homepage | Toronto → Calgary | Active body failure |
| Montreal → Calgary | `generate-spa-routes.mjs` | No; generic SPA shell | Correct route | No settled fields | Route body reproduced correctly; quote panel missing |
| Ottawa → Edmonton | `generate-spa-routes.mjs` | No; generic SPA shell | Correct route | Toronto → Calgary | Route body reproduced correctly; defaults wrong |
| Toronto → Vancouver | `generate-spa-routes.mjs` | No; generic SPA shell | Correct route | No settled fields | Route body reproduced correctly; quote panel missing |
| Toronto → Victoria | `generate-spa-routes.mjs` | No; generic SPA shell | Correct route | Toronto → Calgary | Route body reproduced correctly; destination wrong |
| Vancouver → Calgary | `generate-spa-routes.mjs` | No; generic SPA shell | Homepage | Toronto → Calgary | Active body failure |
| Vancouver → Halifax | `generate-spa-routes.mjs` | No; generic SPA shell | Soft 404 | Toronto → Calgary | Active body failure |
| Vancouver → Toronto | `generate-spa-routes.mjs` | No; generic SPA shell | Correct route | No settled fields | Route body reproduced correctly; quote panel missing |

## 3. Compiled React route coverage

| Route | Exact compiled React route exists? | Pre-fix direct visible SPA render correct? |
| --- | --- | --- |
| BC → Washington | Yes | Yes |
| Calgary → Vancouver | Yes | No; component rendered into a detached element |
| Montreal → Calgary | Yes | Yes |
| Ottawa → Edmonton | Yes | Yes |
| Toronto → Vancouver | Yes | Yes |
| Toronto → Victoria | Yes | Yes |
| Vancouver → Calgary | Yes | No; component rendered into a detached element |
| Vancouver → Halifax | No; only a route-list link exists | No; SPA 404 |
| Vancouver → Toronto | Yes | Yes |

## 4. Root-cause classification

| Route | Primary class | Evidence |
| --- | --- | --- |
| Calgary → Vancouver | C — generic SPA source overwrite | The exact route and component exist, but the compiled bootstrap explicitly mounted this path into `document.createElement("div")`; the visible `#root` therefore remained the generic shell. |
| Vancouver → Calgary | C — generic SPA source overwrite | Same detached-mount guard and visible generic shell as the reverse direction. |
| Vancouver → Halifax | A — missing compiled React route | No exact App route registration; direct navigation rendered `Page Not Found`. |
| Other six | G — no active settled-body mismatch reproduced | Generic raw shell was replaced by the correct exact React route on direct navigation. Their Step 31 fallback marker identified FAQ fallback behavior, not a current body fallback. Wrong or missing shared quote defaults were reproduced and repaired. |

## 5. Final ownership decision

Eight routes remain `react-spa`: BC/Washington, Calgary/Vancouver, Montreal/Calgary, Ottawa/Edmonton, Toronto/Vancouver, Toronto/Victoria, Vancouver/Calgary, and Vancouver/Toronto. They have exact compiled routes and now settle correctly.

Vancouver/Halifax moved to `generate-vancouver-halifax-static-route.mjs`. Its complete checked-in route source is deterministic, has no React bootstrap, and declares static navigation/chat dependencies.

## 6. Files changed

- `site-copy/assets/index-CNBNs70h.js`
- `site-copy/assets/conversion-boost.js`
- `site-copy/vancouver-to-halifax-movers/index.html`
- `tools/repair-step32-react-runtime.mjs`
- `tools/generate-vancouver-halifax-static-route.mjs`
- `tools/templates/hydration-static-routes/vancouver-to-halifax-movers.html`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`
- `docs/ROUTE_PAGE_OWNERSHIP.md`
- `docs/STEP_32_HYDRATION_BODY_REPORT.md`

## 7. SPA generator and preservation changes

The aggregate now runs the idempotent Step 32 runtime source repair immediately after SPA generation. It removes the detached Calgary/Vancouver mount, keeps the exact React router as the final writer, registers the nine directional defaults, and restores bounded quote-panel creation for Montreal/Calgary and Toronto/Vancouver. SPA discovery now records an ownership skip for Vancouver/Halifax; its static generator runs next.

## 8. Routes moved to static/dedicated ownership

Only `/vancouver-to-halifax-movers/`.

## 9. Routes remaining React

Eight of nine, listed in section 5.

## 10. Navigation/chat architecture result

The eight React routes retain one React navigation and one React chatbot. Vancouver/Halifax has no React bootstrap and uses the registered `static-nav` and `static-chat` assets; one launcher is present and the static navigation script enhances the serialized header plus creates the mobile navigation panel.

## 11. Directional form-default result

9/9 settled routes expose real values, not placeholder-only values:

| Route | Origin | Destination |
| --- | --- | --- |
| BC → Washington | British Columbia | Washington State |
| Calgary → Vancouver | Calgary, AB | Vancouver, BC |
| Montreal → Calgary | Montreal, QC | Calgary, AB |
| Ottawa → Edmonton | Ottawa, ON | Edmonton, AB |
| Toronto → Vancouver | Toronto, ON | Vancouver, BC |
| Toronto → Victoria | Toronto, ON | Victoria, BC |
| Vancouver → Calgary | Vancouver, BC | Calgary, AB |
| Vancouver → Halifax | Vancouver, BC | Halifax, NS |
| Vancouver → Toronto | Vancouver, BC | Toronto, ON |

## 12. FAQ contract for the repaired routes

9/9 settled pass: one visible FAQ section/heading, one `FAQPage`, exact visible/schema question counts and order/text parity, and zero `.pcm-local-seo`. Question counts are 8 on every audited route except Vancouver/Halifax, which has 11.

## 13. Full 56-route FAQ regression

55/55 completed settled browser checks pass exact visible/schema count and content parity with one heading/entity and zero `.pcm-local-seo`. Victoria/Vancouver timed out during browser navigation; its raw checked-in static document passes the same FAQ contract. Combined contract result: 56/56, with the browser limitation stated separately rather than counted as a settled browser pass.

## 14. Title/OG/Twitter regression

Raw title/OG/Twitter parity and one terminal brand suffix pass 56/56. Settled browser parity passes 55/55 completed routes. All nine Step 32 routes also have route-specific settled canonical and OG URLs; Vancouver/Halifax's previously generic homepage description/canonical were replaced by its proven route-specific static-source values.

## 15. Nine-route settled browser body result

9/9 route-specific H1 and main body, 9/9 route-specific quote values, 9/9 pricing/cost sentinel, 9/9 FAQ parity, no homepage body, and no soft 404. Vancouver/Halifax has zero module bootstraps; the other eight have one.

## 16. Full 56-route hydration sanity sweep

55/55 completed direct browser loads have route-specific H1/body sentinels, no homepage replacement, and no soft 404. Victoria/Vancouver timed out; its strongest alternate raw verification has the route-specific H1, no homepage sentinel, no soft-404 sentinel, canonical title, and passing raw FAQ contract. No new hydration defect was found.

## 17. Ownership validation

PASS: 56 routes, exactly one full-page owner each, zero collisions. Ownership tests: 14/14. Title tests: 4/4. JavaScript syntax checks and aggregate dry run pass.

## 18. Direct-owner idempotency

The runtime repair and Vancouver/Halifax static generator were each run twice. SHA-256 hashes for the bundle, shared conversion runtime, and Vancouver/Halifax HTML were unchanged across the two runs.

## 19. First aggregate convergence

In a temporary clone with Git history, the first aggregate produced zero unexpected route drift and zero shared-file drift. It reproduced the two previously documented unrelated first-pass Sonner cleanup drifts on Edmonton ↔ Winnipeg; those files were not copied into the working tree.

## 20. Second aggregate convergence

0 route drift and 0 shared-file drift.

## 21. Working-tree route isolation

Only `site-copy/vancouver-to-halifax-movers/index.html` changed during Step 32. Calgary/Vancouver and the directional-default repairs are durable shared bundle/runtime changes; no incidental aggregate route output was applied to the working tree.

## 22. Browser-harness limitations

`/victoria-to-vancouver-movers/` again timed out during direct browser navigation. It is reported as a raw alternate verification, not as a full browser pass. The first attempt at aggregate isolation used an empty initialized repository and correctly failed when a legacy generator requested a historical Git object; the authoritative aggregate result came from the replacement history-preserving local clone.

## 23. Additional hydration defects discovered

None. Fresh reproduction corrected the Step 31 interpretation: six of its nine FAQ-fallback-marked routes already hydrated to their intended bodies. The additional reproduced issue was directional quote fallback/missing panels on those routes, repaired by the same bounded shared route-data source.

## 24. Remaining known issues

- The pre-existing Victoria/Vancouver browser-harness timeout remains.
- The aggregate's first-pass-only Edmonton ↔ Winnipeg Sonner cleanup remains a documented unrelated convergence item; the second aggregate is byte-stable.
- No visual route standardization was performed, and no deployment was performed.

Step 32 is complete. Step 33 was not started.
