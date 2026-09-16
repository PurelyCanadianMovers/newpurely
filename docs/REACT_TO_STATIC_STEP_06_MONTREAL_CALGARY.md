# Migration Step 6 — Montreal → Calgary

Status: local implementation and QA complete. Nothing committed or deployed.

## Scope

Only `/montreal-to-calgary-movers/` was migrated. `/calgary-to-montreal-movers/` was used as a structural and factual comparison and was not altered; its pre/post SHA-256 is identical.

## Authoritative facts

The canonical source is `tools/montreal-calgary-route-data.mjs`:

- Distance: approximately 3,600 km
- Transit: 7–19 days
- Pricing: Studio $2,500+; 1-bedroom $4,700+; 2-bedroom $6,300+; 3-bedroom $10,000+; 4+ bedroom $15,000+
- Overall range: $2,500–$15,000+

The route preserves Montreal, QC pickup defaults and logistics, westbound planning, Calgary, AB delivery defaults and logistics, route metadata, related destinations, CTAs, Declared Value Protection wording, FAQ/schema, and the single quote form. The canonical route-data module and the observed reverse-direction page agree on the core distance, transit, and pricing policy. The reverse page contained historical direction-specific copy, so the new page was rewritten for Montreal-origin and Calgary-destination details rather than copied blindly.

## Architecture change

Before Step 6, React component `whe` and `finalize-montreal-calgary-routes.mjs` were the observed ownership path for Montreal → Calgary. After Step 6, `tools/rebuild-montreal-calgary-static-routes.mjs` owns the route through `tools/templates/montreal-calgary-static-routes/montreal-to-calgary-movers.html` and the reconciled route data. Core content is present in initial static HTML; React, hydration, delayed mutation, and the Step 36 runtime are not required. The shared conversion, static navigation, and static chatbot scripts remain presentation/enhancement dependencies only.

## Exact files changed

- `site-copy/montreal-to-calgary-movers/index.html`
- `tools/templates/montreal-calgary-static-routes/montreal-to-calgary-movers.html`
- `tools/rebuild-montreal-calgary-static-routes.mjs`
- `tools/audit-step06-montreal-calgary.mjs`
- `tools/audit-step06-regressions.mjs`
- `tools/prove-step06-static-ownership.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `docs/LONG_DISTANCE_ROUTE_RENDER_OWNERSHIP_AUDIT.md`
- `docs/LONG_DISTANCE_ROUTE_EDITING_PLAYBOOK.md`
- `docs/REACT_TO_STATIC_STEP_06_MONTREAL_CALGARY.md`
- `STEP_06_PREEDIT_MONTREAL_CALGARY.json`
- `STEP_06_LOCAL_TARGET_AUDIT.json`
- `STEP_06_DIRECT_PROOF.json`
- `STEP_06_REGRESSION.json`
- `STEP_06_GENERATOR_DURABILITY.json`

`tools/montreal-calgary-route-data.mjs` was the authoritative inspected source and was not modified.

The existing reverse route, compiled React bundle, shared static shell assets, and other route pages were not edited for this migration.

## QA evidence

- Ownership validator: 56 routes, exactly one owner, zero collisions.
- Expected totals: A = 37, B = 6, C = 13, D = 0.
- Local target audit: one H1, one quote form, one pricing table, one Glance block, one FAQ section, one FAQPage schema, exact visible/schema FAQ parity, correct defaults, no `undefined`, no `.pcm-local-seo`, no soft 404, no duplicate navigation/chat/footer.
- Route at a Glance: bordered rounded container, red glyphs, three desktop columns, one-column mobile stack, canonical facts, no overflow.
- Typography: Playfair Display headings; Source Sans 3 body/forms/buttons; 48/60 desktop H1 and 36/45 mobile H1.
- Static navigation/chat: desktop dropdown and chatbot passed; mobile menu initial/open/toggle/Escape/ARIA and chatbot passed.
- React-removal proof: initial, delayed, normal reload, cache-busted reload, and hard refresh all preserved a direct HTML marker; React bootstrap was false.
- Regression audit: 13 required comparison routes passed with zero issues or browser errors.
- Generator durability: two runs produced byte-identical target output (`0179C4DD0A295B3A3C1F41AE099DCA8DAC4671841296300FEFF4638B82F62537`); reverse route hash stayed `D02B1B6A50AE45F0B8A5A15A6B87C53A143E23EA151501C978076001CBFCF5B7`.
- `node --test tools/route-page-ownership.test.mjs`: 27/27 passed.
- `npm run routes:dry-run`: passed; Step 6 generator is in aggregate order and no files were written.

## Unresolved issues

None for the Step 6 scope. Commit and deployment are intentionally deferred. Migration Step 7 was not started.
