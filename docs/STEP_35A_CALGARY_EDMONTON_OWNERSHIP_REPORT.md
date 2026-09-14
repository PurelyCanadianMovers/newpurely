# Step 35A — Calgary ↔ Edmonton Ownership and Fact Authority

## 1. Exact current render chain

| Route | Registry owner before Step 35A | Actual render | Exact React route exists | React loaded | Durable source after Step 35A |
| --- | --- | --- | --- | --- | --- |
| Calgary → Edmonton | `generate-spa-routes.mjs` | Hydration-free checked-in HTML with serialized component markup, static navigation/chat, and conversion runtime | No | No | `site-copy/calgary-to-edmonton-movers/index.html` as `checked-in-static-route-source` |
| Edmonton → Calgary | `generate-spa-routes.mjs` | Hydration-free checked-in HTML with serialized component markup, static navigation/chat, and conversion runtime | No | No | `site-copy/edmonton-to-calgary-movers/index.html` as `checked-in-static-route-source` |

The checked-in documents contain the only complete bodies. They have no module bootstrap or compiled-bundle reference. Their runtime dependencies are `conversion-boost.js`, `static-nav.js`, and `static-chat.js`, with matching styles. FAQ and title finalizers remain aggregate post-processors.

## 2. Independent React-path test

A temporary normal SPA output was constructed from the current homepage entry and compiled bundle, then each canonical URL was loaded directly. The generator did not create either canonical route because neither path exists in the bundle's discovered router table. The static server fallback loaded the normal SPA entry, and the settled React application rendered the Vancouver homepage H1, homepage body, homepage FAQ, no route pricing/glance, and empty origin/destination values.

The bundle contains disabled legacy definitions for `/movers-calgary-to-edmonton/` and `/movers-edmonton-to-calgary/`, not exact registrations for the canonical paths. React therefore cannot reproduce the intended pages.

## 3. Architecture decision

Both routes are now static and owned by `checked-in-static-route-source`. The SPA generator explicitly includes the canonical paths in discovery, then the ownership guard skips them. Static navigation/chat remain intentional. React is not loaded.

## 4. Authoritative facts for resumed Step 35

The frozen project authority is `tools/calgary-edmonton-route-data.mjs`:

- Distance: approximately 300 km
- Transit: 2–4 days
- Studio: $800+
- 1-bedroom: $1,100+
- 2-bedroom: $1,500+
- 3-bedroom: $2,000+
- 4+ bedroom: $2,800+
- Overall displayed range: $800–$2,800+

The values are intentionally symmetric. No directional price, transit, or distance asymmetry was found.

## 5. Evidence hierarchy

1. `tools/patch-geo.mjs` supplies the pair-specific transit and five price values and documents that its COST table mirrors the chatbot table.
2. The compiled cost-guide table independently carries the same five values for both directions.
3. No valid internal PCM distance record existed. Step 35A therefore establishes the rounded practical intercity planning value of approximately 300 km. Alberta's official Highway 2 material describes the core Calgary–Edmonton highway corridor as roughly 260 km; the PCM display value allows for variable city pickup and delivery points without false precision.
4. The visible 4,900 km, 7–20 day, and $2,600–$16,000+ values are copied long-corridor contamination and are rejected.

The lower price set is a pair-specific intercity/long-distance planning table, not a local hourly-rate table: it appears beside other short long-distance routes such as Toronto ↔ Ottawa and Victoria ↔ Vancouver and is keyed by five home sizes. Taxes and access/service surcharges are not separately represented; the plus signs indicate starting estimates.

## 6. Scope

Step 35A changes ownership declarations, SPA skip behavior, tests, documentation, and the future fact source only. It does not alter either route HTML or resume visual standardization. No deployment was performed.

## 7. Validation and convergence

- Ownership registry: 56/56 routes have exactly one owner; zero collisions.
- Ownership/title test suites: 19/19 tests pass.
- Raw title contract: 56/56 routes have matching title, Open Graph title, and Twitter title with one brand suffix.
- FAQ browser audit: 55/56 routes canonical; Victoria → Vancouver retained canonical raw FAQ markup but its isolated runtime load hit the pre-existing 30-second timeout.
- Independent aggregate run in a history-preserving temporary clone: zero route drift across 56 routes and zero shared-writer drift after the first run.
- Second aggregate run: zero route drift across 56 routes and zero shared-writer drift relative to the first run.
- Both aggregate runs logged explicit ownership skips for Calgary → Edmonton and Edmonton → Calgary.
