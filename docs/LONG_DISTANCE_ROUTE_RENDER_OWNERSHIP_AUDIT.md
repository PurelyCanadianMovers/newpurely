# Long-Distance Route Render Ownership Audit

Audit date: 2026-09-15  
Scope: the repository's existing 56-route inventory in `tools/route-page-ownership.mjs` and `docs/STEP_48_REMAINING_ROUTE_INVENTORY_REPORT.md`.

## Classification rules

- **A — Static Safe:** static HTML is the final route-content DOM; direct `site-copy/<route>/index.html` edits survive final render.
- **B — React Owned:** the route-specific React component mounts into the page and replaces the route content after load; direct static edits can be overwritten after React mount.
- **C — Hybrid:** static route content remains, but route-specific JavaScript or a documented mixed architecture modifies/replaces meaningful route sections or combines React and static route layers.
- **D — Other / Unknown:** not confidently classified. None found.

`/assets/index-CNBNs70h.js` was checked both for loading in each page's markup and for exact route registrations. Final DOM checks used the local static server with JavaScript enabled and compared H1, main route content, pricing, Route at a Glance, and FAQ presence. Generic analytics, conversion, navigation, and chat enhancement scripts were not treated as route-content ownership by themselves.

## Route-by-route audit

| Route | Static file | React bundle loaded | React route mapped | Raw H1 | Final H1 | Classification | Safe to edit static HTML? | Notes |
|---|---|---:|---:|---|---|---|---|---|
| `/bc-to-washington-movers/` | `site-copy/bc-to-washington-movers/index.html` | Yes | Yes (`gge`) | Professional Movers in Vancouver & the Lower Mainland Since 1991 | BC to Washington State Movers | B — React Owned | No | Cross-border React component owns the final route body. Direct site-copy HTML edits can be overwritten after React mount. |
| `/calgary-to-edmonton-movers/` | `site-copy/calgary-to-edmonton-movers/index.html` | No | No | Calgary to Edmonton Moving Cost, Prices & Transit Time | Calgary to Edmonton Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/calgary-to-halifax-movers/` | `site-copy/calgary-to-halifax-movers/index.html` | No | No | Calgary to Halifax Moving Cost, Prices & Transit Time | Calgary to Halifax Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Only static cleanup/enhancement runtime; no route-content replacement. Direct site-copy HTML edits survive final render. |
| `/calgary-to-montreal-movers/` | `site-copy/calgary-to-montreal-movers/index.html` | No | No | Calgary to Montreal Movers | Calgary to Montreal Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/calgary-to-ottawa-movers/` | `site-copy/calgary-to-ottawa-movers/index.html` | No | No | Calgary to Ottawa Movers | Calgary to Ottawa Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/calgary-to-toronto-movers/` | `site-copy/calgary-to-toronto-movers/index.html` | No | Yes (`rhe`, dormant) | Calgary to Toronto Moving Cost, Prices & Transit Time | Calgary to Toronto Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Migration Step 1 moved final ownership to `rebuild-calgary-toronto-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, cache-busted, and hard-refresh renders. |
| `/calgary-to-vancouver-movers/` | `site-copy/calgary-to-vancouver-movers/index.html` | No | Yes (`che`, dormant) | Calgary to Vancouver Movers | Calgary to Vancouver Movers | A — Static Safe | Yes | Migration Step 2 moved final ownership to `rebuild-calgary-vancouver-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/calgary-to-winnipeg-movers/` | `site-copy/calgary-to-winnipeg-movers/index.html` | No | No | Calgary to Winnipeg Movers | Calgary to Winnipeg Movers | C — Hybrid | Case-by-case | React-style header/footer is combined with static route content; `step44-calgary-winnipeg.js` and static chat/navigation affect the rendered shell. |
| `/edmonton-to-calgary-movers/` | `site-copy/edmonton-to-calgary-movers/index.html` | No | No | Edmonton to Calgary Moving Cost, Prices & Transit Time | Edmonton to Calgary Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/edmonton-to-montreal-movers/` | `site-copy/edmonton-to-montreal-movers/index.html` | No | No | Edmonton to Montreal Moving Cost, Prices & Transit Time | Edmonton to Montreal Moving Cost, Prices & Transit Time | C — Hybrid | Case-by-case | Documented mixed exception: inline route runtime normalizes pricing/glance/FAQ and metadata while static route content remains. |
| `/edmonton-to-ottawa-movers/` | `site-copy/edmonton-to-ottawa-movers/index.html` | No | No | Edmonton to Ottawa Movers | Edmonton to Ottawa Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/edmonton-to-toronto-movers/` | `site-copy/edmonton-to-toronto-movers/index.html` | No | Yes (`Rhe`, dormant) | Edmonton to Toronto Moving Cost, Prices & Transit Time | Edmonton to Toronto Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Migration Step 3 moved final ownership to `rebuild-edmonton-toronto-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/edmonton-to-vancouver-movers/` | `site-copy/edmonton-to-vancouver-movers/index.html` | Yes | Yes (`Vhe`) | Professional Movers in Vancouver & the Lower Mainland Since 1991 | Edmonton to Vancouver Movers | B — React Owned | No | React component `Vhe` owns final route content. Direct site-copy HTML edits can be overwritten after React mount. |
| `/edmonton-to-winnipeg-movers/` | `site-copy/edmonton-to-winnipeg-movers/index.html` | No | No | Edmonton to Winnipeg Movers | Edmonton to Winnipeg Movers | C — Hybrid | Case-by-case | React-style header/footer is combined with static prairie-route content and `step34-edmonton-winnipeg.js` runtime. |
| `/halifax-to-calgary-movers/` | `site-copy/halifax-to-calgary-movers/index.html` | No | No | Halifax to Calgary Moving Cost, Prices & Transit Time | Halifax to Calgary Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/halifax-to-toronto-movers/` | `site-copy/halifax-to-toronto-movers/index.html` | No | Yes (`rge`) | Halifax to Toronto Movers | Halifax to Toronto Movers | C — Hybrid | Case-by-case | React-style header/footer plus static estimate/content/chat; `step47-halifax-toronto.js` modifies route presentation. |
| `/halifax-to-vancouver-movers/` | `site-copy/halifax-to-vancouver-movers/index.html` | No | No | Halifax to Vancouver Movers | Halifax to Vancouver Movers | C — Hybrid | Case-by-case | React-style header/footer plus static route content/chat; route-specific runtime changes the rendered shell. |
| `/montreal-to-calgary-movers/` | `site-copy/montreal-to-calgary-movers/index.html` | Yes | Yes (`whe`) | Professional Movers in Vancouver & the Lower Mainland Since 1991 | Montreal to Calgary Movers | B — React Owned | No | React component `whe` owns final route content. Direct site-copy HTML edits can be overwritten after React mount. |
| `/montreal-to-edmonton-movers/` | `site-copy/montreal-to-edmonton-movers/index.html` | Yes | Yes (`Ehe`) | Professional Movers in Vancouver & the Lower Mainland Since 1991 | Montreal to Edmonton Movers | B — React Owned | No | React component `Ehe` owns final route content. Direct site-copy HTML edits can be overwritten after React mount. |
| `/montreal-to-toronto-movers/` | `site-copy/montreal-to-toronto-movers/index.html` | No | Yes (`mhe`, dormant) | Montreal to Toronto Movers | Montreal to Toronto Movers | A — Static Safe | Yes | Migration Step 4 moved final ownership to `rebuild-montreal-toronto-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/montreal-to-vancouver-movers/` | `site-copy/montreal-to-vancouver-movers/index.html` | No | Yes (`phe`) | Montreal to Vancouver Moving Cost, Prices & Transit Time | Montreal to Vancouver Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Bundle contains a route registration, but the page does not load the React bundle. Direct site-copy HTML edits survive final render. |
| `/montreal-to-victoria-movers/` | `site-copy/montreal-to-victoria-movers/index.html` | Yes | Yes (`_he`) | Professional Movers in Vancouver & the Lower Mainland Since 1991 | Montreal to Victoria Moving Cost, Prices & Transit Time | B — React Owned | No | React component `_he` owns final route content. Direct site-copy HTML edits can be overwritten after React mount. |
| `/montreal-to-winnipeg-movers/` | `site-copy/montreal-to-winnipeg-movers/index.html` | No | No | Montreal to Winnipeg Movers | Montreal to Winnipeg Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/ottawa-to-calgary-movers/` | `site-copy/ottawa-to-calgary-movers/index.html` | No | Yes (`Khe`) | Ottawa to Calgary Movers | Ottawa to Calgary Movers | A — Static Safe | Yes | Bundle contains a route registration, but the page does not load the React bundle. Direct site-copy HTML edits survive final render. |
| `/ottawa-to-edmonton-movers/` | `site-copy/ottawa-to-edmonton-movers/index.html` | Yes | Yes (`Whe`) | Professional Movers in Vancouver & the Lower Mainland Since 1991 | Ottawa to Edmonton Movers | B — React Owned | No | React component `Whe` owns final route content. Direct site-copy HTML edits can be overwritten after React mount. |
| `/ottawa-to-toronto-movers/` | `site-copy/ottawa-to-toronto-movers/index.html` | No | Yes (`Ihe`) | Ottawa to Toronto Movers | Ottawa to Toronto Movers | A — Static Safe | Yes | Bundle contains a route registration, but the page does not load the React bundle. Direct site-copy HTML edits survive final render. |
| `/ottawa-to-vancouver-movers/` | `site-copy/ottawa-to-vancouver-movers/index.html` | No | Yes (`Hhe`) | Ottawa to Vancouver Moving Cost, Prices & Transit Time | Ottawa to Vancouver Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Bundle contains a route registration, but the page does not load the React bundle. Direct site-copy HTML edits survive final render. |
| `/ottawa-to-victoria-movers/` | `site-copy/ottawa-to-victoria-movers/index.html` | Yes | Yes (`sge`) | Ottawa to Victoria & Nanaimo Movers | Ottawa to Victoria & Nanaimo Movers | C — Hybrid | Case-by-case | Documented static-owner exception retains the module bundle and mapped route while the dedicated static shell remains final. |
| `/ottawa-to-winnipeg-movers/` | `site-copy/ottawa-to-winnipeg-movers/index.html` | No | No | Ottawa to Winnipeg Movers | Ottawa to Winnipeg Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/seattle-to-vancouver-movers/` | `site-copy/seattle-to-vancouver-movers/index.html` | No | No | Seattle to Vancouver Movers | Seattle to Vancouver Movers | C — Hybrid | Case-by-case | Cross-border static content uses React-style header/footer and static chat with `step49-seattle-vancouver.js` presentation runtime. |
| `/toronto-to-calgary-movers/` | `site-copy/toronto-to-calgary-movers/index.html` | No | Yes (`zme`, dormant) | Toronto to Calgary Moving Cost, Prices & Transit Time | Toronto to Calgary Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Migration Step 1 moved final ownership to `rebuild-calgary-toronto-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, cache-busted, and hard-refresh renders. |
| `/toronto-to-edmonton-movers/` | `site-copy/toronto-to-edmonton-movers/index.html` | No | Yes (`Yme`, dormant) | Toronto to Edmonton Moving Cost, Prices & Transit Time | Toronto to Edmonton Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Migration Step 3 moved final ownership to `rebuild-edmonton-toronto-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/toronto-to-halifax-movers/` | `site-copy/toronto-to-halifax-movers/index.html` | No | No | Toronto to Halifax Movers | Toronto to Halifax Movers | C — Hybrid | Case-by-case | React-style header/footer plus static estimate/content/chat; `step47-halifax-toronto.js` modifies route presentation. |
| `/toronto-to-montreal-movers/` | `site-copy/toronto-to-montreal-movers/index.html` | No | Yes (`$me`, dormant) | Toronto to Montreal Movers | Toronto to Montreal Movers | A — Static Safe | Yes | Migration Step 4 moved final ownership to `rebuild-montreal-toronto-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/toronto-to-ottawa-movers/` | `site-copy/toronto-to-ottawa-movers/index.html` | No | No | Toronto to Ottawa Movers | Toronto to Ottawa Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/toronto-to-vancouver-movers/` | `site-copy/toronto-to-vancouver-movers/index.html` | No | Yes (`Fme`, dormant) | Toronto to Vancouver Movers | Toronto to Vancouver Movers | A — Static Safe | Yes | Migration Step 5 moved final ownership to `rebuild-toronto-vancouver-static-routes.mjs`; the page does not load the React bundle or Step 38 runtime. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/toronto-to-victoria-movers/` | `site-copy/toronto-to-victoria-movers/index.html` | Yes | Yes (`uge`) | Professional Movers in Vancouver & the Lower Mainland Since 1991 | Toronto to Victoria & Nanaimo Movers | B — React Owned | No | React component `uge` owns final route content. Direct site-copy HTML edits can be overwritten after React mount. |
| `/toronto-to-winnipeg-movers/` | `site-copy/toronto-to-winnipeg-movers/index.html` | No | No | Toronto to Winnipeg Movers | Toronto to Winnipeg Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/vancouver-to-calgary-movers/` | `site-copy/vancouver-to-calgary-movers/index.html` | No | Yes (`Zme`, dormant) | Vancouver to Calgary Movers | Vancouver to Calgary Movers | A — Static Safe | Yes | Migration Step 2 moved final ownership to `rebuild-calgary-vancouver-static-routes.mjs`; the page does not load the React bundle. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/vancouver-to-edmonton-movers/` | `site-copy/vancouver-to-edmonton-movers/index.html` | No | No | Vancouver to Edmonton Movers | Vancouver to Edmonton Movers | A — Static Safe | Yes | Compiled bundle has no exact route registration; deterministic static owner is final. Direct site-copy HTML edits survive final render. |
| `/vancouver-to-halifax-movers/` | `site-copy/vancouver-to-halifax-movers/index.html` | No | No | Vancouver to Halifax Movers | Vancouver to Halifax Movers | C — Hybrid | Case-by-case | React-style header/footer plus static route content/chat; route-specific runtime changes the rendered shell. |
| `/vancouver-to-montreal-movers/` | `site-copy/vancouver-to-montreal-movers/index.html` | No | No | Vancouver to Montreal Moving Cost, Prices & Transit Time | Vancouver to Montreal Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/vancouver-to-ottawa-movers/` | `site-copy/vancouver-to-ottawa-movers/index.html` | No | No | Vancouver to Ottawa Moving Cost, Prices & Transit Time | Vancouver to Ottawa Moving Cost, Prices & Transit Time | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/vancouver-to-seattle-movers/` | `site-copy/vancouver-to-seattle-movers/index.html` | No | No | Vancouver to Seattle Movers | Vancouver to Seattle Movers | C — Hybrid | Case-by-case | Cross-border static content uses React-style header/footer and static chat with `step49-seattle-vancouver.js` presentation runtime. |
| `/vancouver-to-toronto-movers/` | `site-copy/vancouver-to-toronto-movers/index.html` | No | Yes (`ehe`, dormant) | Vancouver to Toronto Movers | Vancouver to Toronto Movers | A — Static Safe | Yes | Migration Step 5 moved final ownership to `rebuild-toronto-vancouver-static-routes.mjs`; the page does not load the React bundle or Step 38 runtime. Direct HTML edits survive initial, delayed, normal, cache-busted, and hard-refresh renders. |
| `/vancouver-to-winnipeg-movers/` | `site-copy/vancouver-to-winnipeg-movers/index.html` | No | No | Vancouver to Winnipeg Movers | Vancouver to Winnipeg Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/victoria-to-montreal-movers/` | `site-copy/victoria-to-montreal-movers/index.html` | No | No | Victoria to Montreal Movers | Victoria to Montreal Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/victoria-to-ottawa-movers/` | `site-copy/victoria-to-ottawa-movers/index.html` | No | No | Victoria to Ottawa Movers | Victoria to Ottawa Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/victoria-to-toronto-movers/` | `site-copy/victoria-to-toronto-movers/index.html` | No | No | Victoria to Toronto Movers | Victoria to Toronto Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/victoria-to-vancouver-movers/` | `site-copy/victoria-to-vancouver-movers/index.html` | No | Yes (`oge`) | Victoria to Vancouver Movers | Victoria to Vancouver Movers | C — Hybrid | Case-by-case | Static special-case shell remains final while `step50-victoria-vancouver.js` and static navigation/chat enhance route presentation. |
| `/winnipeg-to-calgary-movers/` | `site-copy/winnipeg-to-calgary-movers/index.html` | No | No | Winnipeg to Calgary Movers | Winnipeg to Calgary Movers | C — Hybrid | Case-by-case | React-style header/footer is combined with static route content and `step44-calgary-winnipeg.js` runtime. |
| `/winnipeg-to-edmonton-movers/` | `site-copy/winnipeg-to-edmonton-movers/index.html` | No | No | Winnipeg to Edmonton Movers | Winnipeg to Edmonton Movers | C — Hybrid | Case-by-case | React-style header/footer is combined with static prairie-route content and `step34-edmonton-winnipeg.js` runtime. |
| `/winnipeg-to-montreal-movers/` | `site-copy/winnipeg-to-montreal-movers/index.html` | No | No | Winnipeg to Montreal Movers | Winnipeg to Montreal Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/winnipeg-to-ottawa-movers/` | `site-copy/winnipeg-to-ottawa-movers/index.html` | No | No | Winnipeg to Ottawa Movers | Winnipeg to Ottawa Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/winnipeg-to-toronto-movers/` | `site-copy/winnipeg-to-toronto-movers/index.html` | No | No | Winnipeg to Toronto Movers | Winnipeg to Toronto Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |
| `/winnipeg-to-vancouver-movers/` | `site-copy/winnipeg-to-vancouver-movers/index.html` | No | No | Winnipeg to Vancouver Movers | Winnipeg to Vancouver Movers | A — Static Safe | Yes | Direct site-copy HTML edits survive final render. |

## Summary counts

- Total route pages audited: **56**
- A — Static Safe: **36**
- B — React Owned: **7**
- C — Hybrid: **13**
- D — Other / Unknown: **0**
- React-owned pages: **7**
- Static-safe pages: **36**

## STATIC SAFE PAGES

The complete A list is:

- `/calgary-to-edmonton-movers/`
- `/calgary-to-halifax-movers/`
- `/calgary-to-montreal-movers/`
- `/calgary-to-ottawa-movers/`
- `/calgary-to-toronto-movers/`
- `/calgary-to-vancouver-movers/`
- `/edmonton-to-calgary-movers/`
- `/edmonton-to-ottawa-movers/`
- `/edmonton-to-toronto-movers/`
- `/halifax-to-calgary-movers/`
- `/montreal-to-vancouver-movers/`
- `/montreal-to-toronto-movers/`
- `/toronto-to-vancouver-movers/`
- `/vancouver-to-toronto-movers/`
- `/montreal-to-winnipeg-movers/`
- `/ottawa-to-calgary-movers/`
- `/ottawa-to-toronto-movers/`
- `/ottawa-to-vancouver-movers/`
- `/ottawa-to-winnipeg-movers/`
- `/toronto-to-ottawa-movers/`
- `/toronto-to-calgary-movers/`
- `/toronto-to-edmonton-movers/`
- `/toronto-to-winnipeg-movers/`
- `/vancouver-to-calgary-movers/`
- `/vancouver-to-edmonton-movers/`
- `/vancouver-to-montreal-movers/`
- `/vancouver-to-ottawa-movers/`
- `/vancouver-to-winnipeg-movers/`
- `/victoria-to-montreal-movers/`
- `/victoria-to-ottawa-movers/`
- `/victoria-to-toronto-movers/`
- `/winnipeg-to-montreal-movers/`
- `/winnipeg-to-ottawa-movers/`
- `/winnipeg-to-toronto-movers/`
- `/winnipeg-to-vancouver-movers/`

For every page in this list: **Direct site-copy HTML edits survive final render.**

## REACT OWNED PAGES

`/bc-to-washington-movers/`, `/edmonton-to-vancouver-movers/`, `/montreal-to-calgary-movers/`, `/montreal-to-edmonton-movers/`, `/montreal-to-victoria-movers/`, `/ottawa-to-edmonton-movers/`, and `/toronto-to-victoria-movers/`.

For every page in this list: **Direct site-copy HTML edits can be overwritten after React mount.**

## HYBRID PAGES

`/calgary-to-winnipeg-movers/`, `/edmonton-to-montreal-movers/`, `/edmonton-to-winnipeg-movers/`, `/halifax-to-toronto-movers/`, `/halifax-to-vancouver-movers/`, `/ottawa-to-victoria-movers/`, `/seattle-to-vancouver-movers/`, `/toronto-to-halifax-movers/`, `/vancouver-to-halifax-movers/`, `/vancouver-to-seattle-movers/`, `/victoria-to-vancouver-movers/`, `/winnipeg-to-calgary-movers/`, and `/winnipeg-to-edmonton-movers/`.

For these pages, JavaScript changes or supplies meaningful route presentation as described in the table: static estimate/content/chat is combined with React-style header/footer layers, route-specific step scripts alter pricing/FAQ/glance/presentation, or a documented exception retains a mapped module while the static shell remains final. Direct static edits require case-by-case verification.

## UNKNOWN PAGES

None.

## Architecture findings

1. The repository's 56-route ownership registry is internally complete and collision-free, but the final DOM classification is not equivalent to the registry's `rendering` field. The two documented exceptions require inspection of actual runtime behavior.
2. `/edmonton-to-montreal-movers/` is declared in the React SPA ownership group but does not load `/assets/index-CNBNs70h.js`; its inline route runtime modifies meaningful static sections, so it is hybrid rather than React-owned under this audit's rule.
3. `/ottawa-to-victoria-movers/` loads and maps the React bundle, yet the dedicated static owner remains the final route shell; it is therefore hybrid, not React-owned.
4. Several static pages have exact route registrations in the compiled bundle but do not load the bundle. Bundle registration alone is not evidence of final React ownership.
5. Static route pages commonly contain React-generated markup (`data-loc` markers) without loading React at runtime. Those markers describe the source shape, not final render ownership.

## Evidence inspected

- `tools/route-page-ownership.mjs`
- `tools/validate-route-page-ownership.mjs`
- `docs/ROUTE_PAGE_OWNERSHIP.md`
- `docs/STEP_48_REMAINING_ROUTE_INVENTORY_REPORT.md`
- `docs/STEP_79_FINAL_56_ROUTE_CLOSEOUT_AUDIT.md`
- `docs/STEP_82_LONG_DISTANCE_VISUAL_AUDIT.md`
- `site-copy/assets/index-CNBNs70h.js`
- All 56 `site-copy/<route>/index.html` files
- JavaScript-enabled local final-DOM renders, including the full React-registered route set and representative static/hybrid routes
