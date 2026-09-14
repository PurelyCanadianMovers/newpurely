# Step 21 aggregate route-build drift report

Step 21 only. No route migration and no deployment were performed.

## Reproduction

The current repository state contained 56 registered long-distance route pages. A clean temporary copy was hashed, built with the complete authoritative aggregate, and hashed again. Exactly 24 routes changed.

| # | Route | Owner | Before SHA-256 | After SHA-256 |
|---:|---|---|---|---|
| 1 | `/calgary-to-toronto-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 2 | `/calgary-to-vancouver-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 3 | `/edmonton-to-toronto-movers/` | `generate-spa-routes.mjs` | `e4f4b10e4613e1019f83a16cd983f1cf3b6b935af4b8881dc05cb1fbb9d1be24` | `57003daba8755cead591976908f15616b2d236010dd97e220079854bef84da4c` |
| 4 | `/edmonton-to-winnipeg-movers/` | `rebuild-edmonton-winnipeg-routes.mjs` | `0294088afb11c607ae4c6a077213af2f04d42d86b440948a838dd2cc1d060abc` | `74524afb9e31ee7a873a1314f7c96ba466ca976c49e645dcfc4cc4c2354d1d37` |
| 5 | `/montreal-to-calgary-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 6 | `/montreal-to-edmonton-movers/` | `generate-spa-routes.mjs` | `f401661fb26d6a51c78dfd35ccd86fac8f11b2b95ead8e6df8ed4093e74eaab5` | `b98bbaa5f7f17f14b431d890559643e2da746b5a86eb73672acaa80f425acbdb` |
| 7 | `/montreal-to-toronto-movers/` | `generate-spa-routes.mjs` | `142b3a3d0f30882191bab3d1cd8dbad14c8174997cda599a324dc193471d8283` | `2761af9df4fe4be9bb11778ca1c248298b20cd227b1c50626726cca42bcd784c` |
| 8 | `/montreal-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `fd541fa8654af00db2b3f55fc9189fa409b91813b11fb486d8baa022a1c8aff5` |
| 9 | `/montreal-to-victoria-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 10 | `/ottawa-to-edmonton-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 11 | `/ottawa-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `3165bbb536f7d57be4b6aeb8c39fa0774459d52586153eb7f33c9df27b610638` |
| 12 | `/ottawa-to-winnipeg-movers/` | `fix-winnipeg-static-routes.mjs` | `0ecb977e94dcb147c8ac0715ad0fe6669f5683deffd41dcc5824ea0727f2e21a` | `50bf73ac31af5a043c120415846fefcc87eca9d192cdaab13ce7baf189eab31e` |
| 13 | `/toronto-to-calgary-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 14 | `/toronto-to-edmonton-movers/` | `generate-spa-routes.mjs` | `6f13f06e7a7842f88af9238bb7a2b680c9d7a555025a93386f1bd8307ec43057` | `69701c81a9c05023e4f732d53365f6afb64bde55f04482263d76edcdf3cb4753` |
| 15 | `/toronto-to-montreal-movers/` | `generate-spa-routes.mjs` | `a1a02fce6f6f690f8b77fda5b1f4a78e1f61b32f93be280df9adaa7490621a93` | `af5f75458dcf4584a4f9c2b5eb1ecf71e7d325d93744f741aa750f13ccb160b5` |
| 16 | `/toronto-to-vancouver-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 17 | `/toronto-to-victoria-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 18 | `/vancouver-to-calgary-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 19 | `/vancouver-to-halifax-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 20 | `/vancouver-to-montreal-movers/` | `standardize-montreal-vancouver-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `3ab7eb9c228800831223f7a8e280768dbd23d9abf7d4c82e0b1b39af85876596` |
| 21 | `/vancouver-to-ottawa-movers/` | `standardize-montreal-vancouver-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `47a8a9572e0b3dae4d3f3a1737c0d0ae6af620539046713c4f99c95d30805a15` |
| 22 | `/vancouver-to-toronto-movers/` | `generate-spa-routes.mjs` | `6b101643d6fc8238d69797885daa2249180a672769b53b944fcd80f2d7699179` | `980e4af7b989e9ee24d9a3ccfef3847398b89912eab6e3a5b5915723c994a682` |
| 23 | `/winnipeg-to-edmonton-movers/` | `rebuild-edmonton-winnipeg-routes.mjs` | `5ba84a3b63254e1ece28844b7178ca623b0b6521b2d6c3bc433e2e45f408a31e` | `4bd9821c86281eb28d1cf7d0e26a266b2e62d5189b984e2b269721b526a85c7e` |
| 24 | `/winnipeg-to-ottawa-movers/` | `fix-winnipeg-static-routes.mjs` | `adaf440a4c5150b3b3b184d50d08ddcd38496088c2d1a1e91492f8d0e4b80e30` | `946592aa035d594150dd4e9a745618a32ebbf1a2dbc91c5d64df336ad1a0b996` |

## Classification

| Route(s) | Primary classification | Main difference | Correct version | Evidence |
|---|---|---|---|---|
| Calgary→Toronto, Calgary→Vancouver, Montreal→Calgary, Montreal→Victoria, Ottawa→Edmonton, Toronto→Calgary, Toronto→Vancouver, Toronto→Victoria, Vancouver→Calgary, Vancouver→Halifax, Vancouver→Toronto | B — Generator regression | The SPA owner replaced each existing route with the current homepage entry document; an unrelated homepage FAQ-heading cleanup changed every route hash. | Checked-in route | The recovered SPA has no server renderer. Generated pages were homepage shells with homepage metadata/H1/defaults/local SEO, not route-owned raw output. |
| Edmonton→Toronto, Montreal→Edmonton, Montreal→Toronto, Toronto→Edmonton, Toronto→Montreal | B — Generator regression | The SPA owner discarded approved standardized raw output before pair finalizers ran. Montreal→Edmonton also gained a second FAQ schema after regeneration. | Checked-in route | Rendered route facts were correct before the aggregate; regeneration introduced shell content and forced finalizers to repair an invalid base. |
| Edmonton→Winnipeg, Winnipeg→Edmonton | D — Ownership/source mismatch | Their owner read Vancouver→Toronto as a live template after the SPA stage had changed that unrelated page, propagating a footer link and changing both outputs. | Checked-in route | No directional facts changed. Preventing the upstream SPA overwrite restored byte identity without changing these two pages. |
| Montreal→Vancouver, Vancouver→Montreal, Ottawa→Vancouver, Vancouver→Ottawa | A — Checked-in output is stale | Checked-in files were identical homepage shells. The owner produced route-specific title, description, canonical, OG URL, H1, defaults, distance, transit, pricing, glance, FAQ, and schema. | Generated route output, after source cleanup | The generator's route data was authoritative, but its stale promo, local SEO block, and legacy fonts were fixed before the outputs were accepted. |
| Ottawa→Winnipeg, Winnipeg→Ottawa | A — Checked-in output is stale | Checked-in pages contained two quote forms, an expired September promotion, shared runtime contamination, and an extra sticky CTA. | Generated route output | The route owner emitted one directional quote form, one route table/schema, correct defaults, no local SEO, no stale promo, no React 404, and no `undefined`. |

No route required Classification C, E, or F after source and rendered inspection.

## Drift grouped by owner

| Owner/generator | Changed routes | Common cause |
|---|---:|---|
| `generate-spa-routes.mjs` | 16 | Existing route outputs were overwritten by the homepage entry document because no server-side route renderer exists. |
| `standardize-montreal-vancouver-routes.mjs` | 4 | Checked-in homepage shells were stale; the generator also encoded an expired promo, local SEO contamination, and legacy typography. |
| `rebuild-edmonton-winnipeg-routes.mjs` | 2 | Live cross-route template input observed the SPA owner's preceding homepage rewrite. |
| `fix-winnipeg-static-routes.mjs` | 2 | Checked-in outputs predated the deterministic route-owned cleanup. |

## Source corrections

- `generate-spa-routes.mjs` now preserves an existing registry-owned SPA route and writes the generic entry document only when that owned route is missing. Finalizers still run in their declared order.
- `standardize-montreal-vancouver-routes.mjs` now removes the dated promotion, omits `.pcm-local-seo`, marks the single FAQ section, and emits Playfair Display / Source Sans 3 typography.
- `rebuild-victoria-ottawa-route.mjs` now strips the homepage FAQ schema and local SEO block from the explicit Ottawa→Victoria template, and its quality gate requires exactly one FAQ heading/schema and zero local SEO contamination.
- The writer manifest and ownership documentation now describe the SPA missing-route fallback/preservation contract.

## Checked-in outputs intentionally updated

Initial drift set:

- Montreal↔Vancouver
- Ottawa↔Vancouver
- Ottawa↔Winnipeg

Protected regression repair discovered during Step M (not one of the initial 24):

- Ottawa→Victoria, to restore one FAQ implementation/schema and zero `.pcm-local-seo` after regeneration

The other 18 initially drifted routes required no checked-in HTML update after investigation; their hashes converged after the source-preservation fix.

## Montreal→Edmonton FAQ result

After aggregate generation and browser runtime:

- one visible FAQ heading/implementation
- one `FAQPage` schema
- visible FAQ/schema parity retained
- zero `.pcm-local-seo`

The regeneration-only duplicate schema was caused by the SPA owner replacing the approved route with a homepage shell before the finalizer. Preserving the existing route output removes that invalid base state.

## Convergence and ownership

- First full aggregate from the updated working tree: **0 changed route pages**.
- Second full aggregate: **0 changed route pages**.
- A subsequent repeat check: **0 changed route pages**, and the aggregate output matched the working-tree route hashes.
- Ownership validator: **56 routes, exactly one owner each, zero collisions**.
- Ownership tests: **14 passed, 0 failed**.
- Aggregate dry run: passed with the declared 22-stage order.

## Canonical route regression

The 13 requested routes were inspected after the final aggregate. Headless-browser rendering confirmed correct directional defaults, one H1, one quote implementation (chat forms excluded), one pricing table, one Route at a Glance, one FAQ/schema, self-canonical metadata, zero `.pcm-local-seo`, no React 404, no `undefined`, navigation, and chatbot availability. Typography is supplied by the shared route styles or explicit Playfair Display / Source Sans 3 links, according to route architecture.

Ottawa→Victoria was rerun after its source correction and specifically confirmed with one H1, one route quote form, one table, one glance block, one FAQ heading/schema, zero local SEO, no 404/`undefined`, and chatbot present.

## Remaining known non-build issues

- Shared mobile-menu dialog ARIA warning.
- Generic raw Calgary hub metadata/H1.

These were not changed because they do not cause aggregate route-page drift.

## Final status

Step 21 is complete. There is zero unexplained route drift. Step 22 was not started and nothing was deployed.
