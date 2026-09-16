# Long-Distance Route Editing Playbook

Permanent operating guide derived from `docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md` (2026-09-15).

This playbook covers the 56 canonical route pages registered by `tools/route-page-ownership.mjs`. It is an editing guide, not a route-content specification. The route's ownership class must be checked before any copy, pricing, FAQ, form, navigation, chatbot, or CTA change.

## Operating rules

- **A — Static Safe:** edit the authoritative static source or its owner generator. Direct site-copy HTML edits survive final render.
- **B — React Owned:** edit the upstream React source for the mapped component, then rebuild the bundle through the site's normal React build outside this repository. Never treat the visible prerendered `site-copy` HTML or compiled bundle as the primary editable source.
- **C — Hybrid:** identify the exact static and JavaScript-owned sections first. Edit only the controlling layer for the requested section, then verify the final browser DOM.
- The compiled bundle is generated output. `site-copy/assets/index-CNBNs70h.js` may be inspected for route/component mapping but must not be edited directly.
- The repository currently contains no checked-in React page source for the mapped B components; only the compiled bundle and a minimal `src/index.js` are present. For B changes, the upstream React application/source must be located before editing. If it cannot be located, stop and report that blocker.

## Route editing matrix

Legend: **Owner** is the authoritative full-page owner. **QA** means run the ownership validator plus the change-type checks in the QA sections below. For generated static pages, edit the owner/template/data file and regenerate; do not hand-edit generated output as the durable fix.

| Route | Class | Primary source of truth | Edit normally | Do not edit directly | Rebuild / overwrite risk | React mount | Inline visible JS | Shared / special handling | Mandatory QA |
|---|---|---|---|---|---|---|---|---|---|
| `/bc-to-washington-movers/` | B | React component `gge` in compiled route map | Upstream React source for BC/Washington page | Static HTML; compiled bundle | React build required | Yes | Route presentation follows React | Cross-border component | B + content/render |
| `/calgary-to-edmonton-movers/` | A | Checked-in static HTML | `site-copy/calgary-to-edmonton-movers/index.html` | Bundle; unrelated generators | No; aggregate preserves checked-in source | No | No meaningful route replacement | Checked-in static source; Step 35 facts/finalizer | A + content |
| `/calgary-to-halifax-movers/` | A | `tools/generate-halifax-calgary-route-pages.mjs` and its templates/data | Generator/template/data | Route HTML output | `node tools/generate-halifax-calgary-route-pages.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/calgary-to-montreal-movers/` | A | Checked-in static HTML plus registered finalizer | `site-copy/calgary-to-montreal-movers/index.html`; pair facts in `tools/montreal-calgary-route-data.mjs` when applicable | Bundle; generated output from unrelated owner | Run `npm run routes` if finalizers must be reapplied | No | No meaningful route replacement | Static side of mixed pair; Step 36 finalizer | A + content |
| `/calgary-to-ottawa-movers/` | A | `tools/rebuild-calgary-ottawa-routes.mjs` | Rebuild script, `tools/calgary-hub-routes.mjs`, route data/template | Route HTML output | `node tools/rebuild-calgary-ottawa-routes.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Updates Calgary/Ottawa hub block | A + related routes |
| `/calgary-to-toronto-movers/` | A | `tools/rebuild-calgary-toronto-static-routes.mjs` | Pair generator, `tools/calgary-toronto-route-data.mjs`, and pair templates | Compiled bundle; legacy finalizer | `node tools/rebuild-calgary-toronto-static-routes.mjs site-copy` or `npm run routes` | No | Static navigation/chat only; no route-content replacement | Migration Step 1 static pair owner | A + content/render |
| `/calgary-to-vancouver-movers/` | A | `tools/rebuild-calgary-vancouver-static-routes.mjs` | Pair generator, `tools/calgary-vancouver-route-data.mjs`, and pair templates | Compiled bundle; legacy Step 33 finalizer | `node tools/rebuild-calgary-vancouver-static-routes.mjs site-copy` or `npm run routes` | No | Static navigation/chat only; no route-content replacement | Migration Step 2 static pair owner | A + content/render |
| `/calgary-to-winnipeg-movers/` | C | `tools/rebuild-calgary-winnipeg-routes.mjs` and pair template/data | Rebuild script/template/data | Route HTML output | `node tools/rebuild-calgary-winnipeg-routes.mjs site-copy` or `npm run routes` | No | Step 44/static shell modifies presentation; React-style header/footer remains | Hybrid static content with shared nav/chat | C + content/render |
| `/edmonton-to-calgary-movers/` | A | Checked-in static HTML | `site-copy/edmonton-to-calgary-movers/index.html` | Bundle; unrelated generators | No; aggregate preserves checked-in source | No | No meaningful route replacement | Step 35 checked-in static pair | A + content |
| `/edmonton-to-montreal-movers/` | C | Static HTML plus inline Step 62 route runtime | `site-copy/edmonton-to-montreal-movers/index.html`; inline runtime only when the controlled section requires it | React bundle assumption; generated bundle | Run `npm run routes` only when registered finalizers are intentionally reapplied | No bundle mount | Yes: pricing, glance, FAQ, metadata, and static chat/presentation | Documented mixed exception | C + content/render |
| `/edmonton-to-ottawa-movers/` | A | Checked-in static HTML and `tools/edmonton-ottawa-route-data.mjs` | Static HTML for copy; route data for fact changes | React bundle; patch scripts as durable source | No for direct copy; run registered owner/finalizers for data changes | No | No meaningful route replacement | Mixed pair: Ottawa→Edmonton is B | A + pair regression |
| `/edmonton-to-toronto-movers/` | A | `tools/rebuild-edmonton-toronto-static-routes.mjs` | Pair generator, `tools/edmonton-toronto-route-data.mjs`, and pair templates | Compiled bundle; legacy finalizer | `node tools/rebuild-edmonton-toronto-static-routes.mjs site-copy` or `npm run routes` | No | Static navigation/chat only; no route-content replacement | Migration Step 3 static pair owner | A + content/render |
| `/edmonton-to-vancouver-movers/` | B | React component `Vhe` in compiled route map | Upstream React source for Edmonton/Vancouver page | Static HTML; compiled bundle | React build required | Yes | React owns main content | Reverse pair has documented static-owner handling | B + content/render |
| `/edmonton-to-winnipeg-movers/` | C | `tools/rebuild-edmonton-winnipeg-routes.mjs` and explicit templates | Rebuild script/template/data | Route HTML output | `node tools/rebuild-edmonton-winnipeg-routes.mjs site-copy` or `npm run routes` | No | Static prairie content plus route-specific runtime/presentation | Shared static nav/chat and Step 34 assets | C + content/render |
| `/halifax-to-calgary-movers/` | A | `tools/generate-halifax-calgary-route-pages.mjs` | Generator/template/data | Route HTML output | `node tools/generate-halifax-calgary-route-pages.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/halifax-to-toronto-movers/` | C | `tools/update-halifax-toronto-routes.mjs` and pair templates/data | Pair owner/template/data | Route HTML output; bundle | `node tools/update-halifax-toronto-routes.mjs site-copy` or `npm run routes` | No | Static estimate/content/chat with route presentation runtime | Step 47 hybrid family | C + content/render |
| `/halifax-to-vancouver-movers/` | C | `tools/rebuild-halifax-vancouver-routes.mjs` and route source | Rebuild script/template/data | Route HTML output | `npm run routes` | No | Static route content with React-style shell/runtime | Static pair owner | C + content/render |
| `/montreal-to-calgary-movers/` | B | React component `whe` in compiled route map | Upstream React source for Montreal/Calgary page | Static HTML; compiled bundle | React build required | Yes | React owns main content | Step 36 pair finalizer | B + content/render |
| `/montreal-to-edmonton-movers/` | B | React component `Ehe` in compiled route map | Upstream React source for Montreal/Edmonton page | Static HTML; compiled bundle | React build required | Yes | React owns main content | Step 62 pair finalizer | B + content/render |
| `/montreal-to-toronto-movers/` | B | React component `mhe` in compiled route map | Upstream React source for Montreal/Toronto page | Static HTML; compiled bundle | React build required | Yes | React owns main content | React route finalizer | B + content/render |
| `/montreal-to-vancouver-movers/` | A | `tools/standardize-montreal-vancouver-routes.mjs` and pair data/templates | Standardizer, pair data/template | Route HTML output; bundle | `npm run routes` | No | No meaningful route replacement | Static side of four-route owner | A + pair regression |
| `/montreal-to-victoria-movers/` | B | React component `_he` in compiled route map | Upstream React source for Montreal/Victoria page | Static HTML; compiled bundle | React build required | Yes | React owns main content | Reverse pair is static/hybrid | B + content/render |
| `/montreal-to-winnipeg-movers/` | A | `tools/rebuild-winnipeg-montreal-routes.mjs` and pair data/template | Rebuild script/data/template | Route HTML output | `node tools/rebuild-winnipeg-montreal-routes.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/ottawa-to-calgary-movers/` | A | `tools/rebuild-calgary-ottawa-routes.mjs` | Rebuild script, data/template, hub block | Route HTML output | `node tools/rebuild-calgary-ottawa-routes.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Bundle maps it but page does not load bundle | A + pair regression |
| `/ottawa-to-edmonton-movers/` | B | React component `Whe` in compiled route map | Upstream React source for Ottawa/Edmonton page | Static HTML; compiled bundle | React build required | Yes | React owns main content | Mixed pair with static Edmonton→Ottawa | B + content/render |
| `/ottawa-to-toronto-movers/` | A | `tools/rebuild-ottawa-toronto-routes.mjs` | Rebuild script, data/template, hub block | Route HTML output | `node tools/rebuild-ottawa-toronto-routes.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Toronto/Ottawa hub block | A + related routes |
| `/ottawa-to-vancouver-movers/` | A | `tools/standardize-montreal-vancouver-routes.mjs` and pair data/templates | Standardizer, pair data/template | Route HTML output; bundle | `npm run routes` | No | No meaningful route replacement | Bundle maps it but page does not load bundle | A + pair regression |
| `/ottawa-to-victoria-movers/` | C | `tools/rebuild-victoria-ottawa-route.mjs` and dedicated template | Dedicated rebuild/template | Route HTML; compiled bundle as generated output | `node tools/rebuild-victoria-ottawa-route.mjs site-copy` or `npm run routes` | Module loads/maps, but static shell remains final | Documented exception; module coexists with static shell | Do not convert to B based on bundle alone | C + content/render |
| `/ottawa-to-winnipeg-movers/` | A | `tools/fix-winnipeg-static-routes.mjs` | Guarded owner script and route data/template | Route HTML output; unguarded legacy writer | `npm run routes`; use legacy flag only if explicitly required | No | No meaningful route replacement | Ottawa↔Winnipeg guarded legacy scope | A + ownership |
| `/seattle-to-vancouver-movers/` | C | Checked-in static HTML plus `tools/finalize-seattle-vancouver-routes.mjs` and route data | Static source, pair data, finalizer | Route HTML; bundle | `npm run routes` | No | Step 49 presentation runtime and static chat/nav alter shell | Cross-border static family | C + content/render |
| `/toronto-to-calgary-movers/` | A | `tools/rebuild-calgary-toronto-static-routes.mjs` | Pair generator, `tools/calgary-toronto-route-data.mjs`, and pair templates | Compiled bundle; legacy finalizer | `node tools/rebuild-calgary-toronto-static-routes.mjs site-copy` or `npm run routes` | No | Static navigation/chat only; no route-content replacement | Migration Step 1 static pair owner | A + content/render |
| `/toronto-to-edmonton-movers/` | A | `tools/rebuild-edmonton-toronto-static-routes.mjs` | Pair generator, `tools/edmonton-toronto-route-data.mjs`, and pair templates | Compiled bundle; legacy finalizer | `node tools/rebuild-edmonton-toronto-static-routes.mjs site-copy` or `npm run routes` | No | Static navigation/chat only; no route-content replacement | Migration Step 3 static pair owner | A + content/render |
| `/toronto-to-halifax-movers/` | C | `tools/update-halifax-toronto-routes.mjs` and pair templates/data | Pair owner/template/data | Route HTML output; bundle | `npm run routes` | No | Static estimate/content/chat with Step 47 presentation | Hybrid pair | C + content/render |
| `/toronto-to-montreal-movers/` | B | React component `$me` in compiled route map | Upstream React source for Toronto/Montreal page | Static HTML; compiled bundle | React build required | Yes | React owns main content | React route finalizer | B + content/render |
| `/toronto-to-ottawa-movers/` | A | `tools/rebuild-ottawa-toronto-routes.mjs` | Rebuild script, data/template, hub block | Route HTML output | `npm run routes` | No | No meaningful route replacement | Static pair owner | A + related routes |
| `/toronto-to-vancouver-movers/` | B | React component `Fme` in compiled route map | Upstream React source for Toronto/Vancouver page | Static HTML; compiled bundle | React build required | Yes | React owns main content | React route finalizer | B + content/render |
| `/toronto-to-victoria-movers/` | B | React component `uge` in compiled route map | Upstream React source for Toronto/Victoria page | Static HTML; compiled bundle | React build required | Yes | React owns main content | React route finalizer | React/static pair | B + content/render |
| `/toronto-to-winnipeg-movers/` | A | `tools/rebuild-toronto-winnipeg-routes.mjs` and explicit templates | Rebuild script/template/data | Route HTML output | `node tools/rebuild-toronto-winnipeg-routes.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/vancouver-to-calgary-movers/` | A | `tools/rebuild-calgary-vancouver-static-routes.mjs` | Pair generator, `tools/calgary-vancouver-route-data.mjs`, and pair templates | Compiled bundle; legacy Step 33 finalizer | `node tools/rebuild-calgary-vancouver-static-routes.mjs site-copy` or `npm run routes` | No | Static navigation/chat only; no route-content replacement | Migration Step 2 static pair owner | A + content/render |
| `/vancouver-to-edmonton-movers/` | A | `tools/finalize-vancouver-edmonton-routes.mjs` plus checked-in static source | Static HTML and finalizer inputs | Bundle; generated output from other routes | `npm run routes` | No exact bundle route registration | No meaningful route replacement | Dedicated static owner; reverse direction is B | A + pair regression |
| `/vancouver-to-halifax-movers/` | C | `tools/rebuild-halifax-vancouver-routes.mjs` and route source | Rebuild script/template/data | Route HTML output | `npm run routes` | No | Static content with React-style shell/runtime | Hybrid static family | C + content/render |
| `/vancouver-to-montreal-movers/` | A | `tools/standardize-montreal-vancouver-routes.mjs` and pair data/templates | Standardizer, pair data/template | Route HTML output | `npm run routes` | No | No meaningful route replacement | Four-route static owner | A + pair regression |
| `/vancouver-to-ottawa-movers/` | A | `tools/standardize-montreal-vancouver-routes.mjs` and pair data/templates | Standardizer, pair data/template | Route HTML output | `npm run routes` | No | No meaningful route replacement | Four-route static owner | A + pair regression |
| `/vancouver-to-seattle-movers/` | C | Checked-in static HTML plus `tools/finalize-seattle-vancouver-routes.mjs` and route data | Static source, pair data, finalizer | Route HTML; bundle | `npm run routes` | No | Step 49 presentation runtime and static chat/nav alter shell | Cross-border static family | C + content/render |
| `/vancouver-to-toronto-movers/` | B | React component `ehe` in compiled route map | Upstream React source for Vancouver/Toronto page | Static HTML; compiled bundle | React build required | Yes | React owns main content | React route finalizer | B + content/render |
| `/vancouver-to-winnipeg-movers/` | A | `tools/rebuild-winnipeg-modern-routes.mjs` and explicit templates | Rebuild script/template/data | Route HTML output | `node tools/rebuild-winnipeg-modern-routes.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/victoria-to-montreal-movers/` | A | Checked-in static HTML plus registered pair finalizer | Static HTML; pair data/finalizer for fact/structure changes | Bundle; generated output | `npm run routes` when finalizer is needed | No | No meaningful route replacement | Static side of mixed Montreal/Victoria pair | A + pair regression |
| `/victoria-to-ottawa-movers/` | A | `tools/rebuild-victoria-ottawa-route.mjs` and dedicated template | Dedicated rebuild/template | Route HTML output | `node tools/rebuild-victoria-ottawa-route.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/victoria-to-toronto-movers/` | A | Checked-in static HTML plus registered pair finalizer | Static HTML; pair data/finalizer when needed | Bundle; generated output | `npm run routes` when finalizer is needed | No | No meaningful route replacement | Static side of React/static pair | A + pair regression |
| `/victoria-to-vancouver-movers/` | C | Checked-in static HTML plus `tools/finalize-victoria-vancouver-route.mjs` and `step50-victoria-vancouver.js` | Static source, frozen route data, finalizer | Bundle; generated output | `npm run routes` | No full React replacement | Step 50 runtime changes route presentation; static nav/chat enhance it | Dedicated static special case | C + content/render |
| `/winnipeg-to-calgary-movers/` | C | `tools/rebuild-calgary-winnipeg-routes.mjs` and pair template/data | Rebuild script/template/data | Route HTML output | `npm run routes` | No | Step 44/static shell and React-style header/footer presentation | Hybrid static family | C + content/render |
| `/winnipeg-to-edmonton-movers/` | C | `tools/rebuild-edmonton-winnipeg-routes.mjs` and explicit templates | Rebuild script/template/data | Route HTML output | `npm run routes` | No | Static prairie content plus route-specific runtime/presentation | Hybrid static family | C + content/render |
| `/winnipeg-to-montreal-movers/` | A | `tools/rebuild-winnipeg-montreal-routes.mjs` and pair data/template | Rebuild script/data/template | Route HTML output | `node tools/rebuild-winnipeg-montreal-routes.mjs site-copy` or `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/winnipeg-to-ottawa-movers/` | A | `tools/fix-winnipeg-static-routes.mjs` | Guarded owner script and route data/template | Route HTML output; unguarded legacy writer | `npm run routes` | No | No meaningful route replacement | Ottawa↔Winnipeg guarded legacy scope | A + ownership |
| `/winnipeg-to-toronto-movers/` | A | `tools/rebuild-toronto-winnipeg-routes.mjs` and explicit templates | Rebuild script/template/data | Route HTML output | `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |
| `/winnipeg-to-vancouver-movers/` | A | `tools/rebuild-winnipeg-modern-routes.mjs` and explicit templates | Rebuild script/template/data | Route HTML output | `npm run routes` | No | No meaningful route replacement | Static pair owner | A + content |

## Mandatory Pre-Edit Decision Process

Before Codex edits any long-distance route page:

1. Look up the route in this playbook.
2. Confirm A, B, or C ownership.
3. Confirm the source-of-truth file, data, generator, component, inline script, or post-processor.
4. Determine whether the requested component is static-owned, React-owned, inline-JS-owned, or shared.
5. Edit only the authoritative source.
6. Regenerate only through the documented owner when required.
7. Run ownership-specific QA.
8. Check for unintended changes to other routes.
9. Report exactly which authoritative source changed.

If this playbook and the current repository architecture disagree, stop before editing. Report the discrepancy and update the audit/playbook rather than guessing.

## A — Static Safe procedure

1. Confirm the route is A and identify whether its primary source is checked-in HTML or an owner generator/template/data file.
2. For a checked-in source, edit only the route's HTML (and the documented route data/finalizer when the requested facts are generated). For a generated route, edit the owner script/template/data, never the generated output as the durable fix.
3. Run the exact owner command or `npm run routes` when the aggregate build is the documented path.
4. Run `node tools/validate-route-page-ownership.mjs site-copy`.
5. Inspect raw HTML and run a browser render check. Confirm one H1, correct title/meta, main route content, one pricing section, Route at a Glance, FAQ and FAQPage schema, quote form, navigation, chatbot, related routes, and CTA.
6. Check `git diff` for only the intended route/asset changes and confirm no other route changed unexpectedly.

Static-safe does not mean “skip QA”; it means **Direct site-copy HTML edits survive final render.**

## B — React Owned procedure

1. Confirm the exact compiled route mapping and component name in `site-copy/assets/index-CNBNs70h.js`, then locate the upstream React source. The bundle is evidence and generated output, not the editable source.
2. If the upstream React source/build is not available, stop and report the blocker. Do not patch the static prerender or bundle as a substitute.
3. Edit the React component/data/source that owns the requested section. Rebuild the React application and bundle through the upstream project's documented build process.
4. Regenerate the route output only through the documented route owner/finalizer if the repository workflow requires it.
5. Run the ownership validator and a JavaScript-enabled browser/render check after React mount. Compare raw HTML with final DOM and verify the changed H1/main content/pricing/glance/FAQ/form/CTA survives mount.
6. Check for route contamination, wrong-direction content, duplicate sections, and unintended bundle or route changes.

For every B route: **Direct site-copy HTML edits can be overwritten after React mount.**

## C — Hybrid procedure

1. Identify the exact section requested and trace it to static HTML, a generator/template, the inline route runtime, a route-specific asset, React markup, or a shared script.
2. Do not classify the whole page from bundle loading. Loading the React bundle alone does not establish React ownership.
3. Edit the controlling layer for that section. Preserve the other layer and do not replace a hybrid shell with a generic SPA page.
4. Run the documented owner/finalizer if the static source or generated data changed.
5. Run the ownership validator and a browser/render check after all JavaScript execution. Verify raw and final H1, main content, pricing, Route at a Glance, FAQ/schema, form, navigation, chatbot, related routes, and CTA.
6. Check delayed runtime behavior and inspect the final DOM for duplicate or removed sections, wrong-direction content, homepage fallback, and unintended changes to other routes.

## Mandatory QA by Change Type

- **H1/title/meta:** compare raw and final H1, `<title>`, description, canonical, `og:url`, and Twitter metadata; React/hybrid routes require post-mount verification.
- **Pricing table:** verify one pricing section/table, every home-size row, currency, route direction, transit range, disclaimer, and mobile scroller.
- **Route at a Glance:** verify one block, correct route, distance, transit, and planning range after all route scripts run.
- **FAQ and FAQPage schema:** verify one visible FAQ heading/section, exact question-answer order, one `FAQPage`, and visible/schema parity.
- **Quote form:** verify origin, destination, home size, date, labels, action, CTA, and route defaults in the final DOM.
- **Chatbot:** verify one launcher and one panel, correct route context, open/close behavior, and no duplicate initialization.
- **Navigation:** verify desktop/mobile nav, route links, menu state, Escape closure, and no duplicate header/footer.
- **Related routes/destinations:** verify links remain route-correct and no unrelated or reverse-direction route was introduced.
- **CTA sections:** verify estimate/call links, route direction, pricing language, and final rendered placement.
- **Inline JavaScript:** inspect every changed selector and mutation; run it in a browser and confirm it does not delete, duplicate, or overwrite the requested content unexpectedly.
- **React-rendered sections:** check raw HTML, post-mount DOM, delayed DOM (at least after initial load and a delayed checkpoint), and browser console/page errors.
- **Shared scripts/components:** inspect all consumers, run representative static, React, and hybrid pages, and check the full route inventory for unintended changes.

For React and hybrid routes, source inspection alone is insufficient: QA must include a JavaScript-enabled final render after React mount or route JavaScript execution.

## Audit findings encoded as rules

- Loading the React bundle alone does **not** establish React ownership.
- Edmonton → Montreal is hybrid even though it is React-related because it does not load the React bundle and inline JavaScript affects the page.
- Ottawa → Victoria is hybrid because it loads/maps React while retaining its dedicated static shell.
- The completed ownership audit covered 56 routes: **32 Static Safe, 11 React Owned, 13 Hybrid, 0 Unknown**.
- The ownership validator passed with 56 routes and zero collisions.

## Future Codex Rule

When the user asks to fix a long-distance route page, Codex must not ask whether the page is static, React, or hybrid when that information exists here. Codex must consult this playbook first and choose the correct editing path automatically.

If the playbook and current repository architecture ever disagree, stop before editing, report the discrepancy, and update the audit/playbook rather than guessing.

## Coverage and limitations

The route table contains exactly one row for each route in the completed 56-route audit. The exact final owner is established for every route. After Migration Step 3, 11 routes remain B-owned. Their exact upstream editable React source is not present in this repository; the compiled component mapping is known, but the upstream React source/build location must be resolved before a B-route edit. No ownership collision or contradiction was discovered by the completed audit or validator.

## Verified B-route source trace

The React source investigation is recorded in `docs/REACT_ROUTE_SOURCE_TRACE_AUDIT.md`. The compiled bundle's `data-loc` markers and historical project files verify one historical React/Vite source system, but none of the 17 route-specific source modules is present in the current tree or reachable Git history. The paths below are verified historical source-location markers, not currently editable files.

| B route | Bundle component | Verified source-location marker | Current editing instruction |
|---|---|---|---|
| `/bc-to-washington-movers/` | `gge` | `client/src/pages/services/BCToWashingtonMovers.tsx` | Locate the upstream checkout containing this file; do not edit generated HTML/bundle. |
| `/edmonton-to-vancouver-movers/` | `Vhe` | `client/src/pages/services/EdmontonToVancouverMovers.tsx` | Locate upstream source before editing. |
| `/montreal-to-calgary-movers/` | `whe` | `client/src/pages/services/MontrealToCalgaryMovers.tsx` | Locate upstream source before editing. |
| `/montreal-to-edmonton-movers/` | `Ehe` | `client/src/pages/services/MontrealToEdmontonMovers.tsx` | Locate upstream source before editing. |
| `/montreal-to-toronto-movers/` | `mhe` | `client/src/pages/services/MontrealToTorontoMovers.tsx` | Locate upstream source before editing. |
| `/montreal-to-victoria-movers/` | `_he` | `client/src/pages/services/MontrealToVictoriaMovers.tsx` | Locate upstream source before editing. |
| `/ottawa-to-edmonton-movers/` | `Whe` | `client/src/pages/services/OttawaToEdmontonMovers.tsx` | Locate upstream source before editing. |
| `/toronto-to-montreal-movers/` | `$me` | `client/src/pages/services/TorontoToMontrealMovers.tsx` | Locate upstream source before editing. |
| `/toronto-to-vancouver-movers/` | `Fme` | `client/src/pages/services/TorontoToVancouverMovers.tsx` | Locate upstream source before editing. |
| `/toronto-to-victoria-movers/` | `uge` | `client/src/pages/services/TorontoToVictoriaMovers.tsx` | Locate upstream source before editing. |
| `/vancouver-to-toronto-movers/` | `ehe` | `client/src/pages/services/VancouverToTorontoMovers.tsx` | Locate upstream source before editing. |

The verified historical rebuild path is the root React project's `npm run build` / `pnpm build`, using its historical `vite.config.ts` (`client` root, `dist/public` output). That React project is not present in the current repository checkout. Until the upstream checkout is located, the B-route stop rule remains mandatory.
