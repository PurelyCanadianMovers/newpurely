# Step 46 — Toronto ↔ Winnipeg Route Standardization

Status: **STOPPED at the mandatory first-aggregate convergence gate. Step 46 is not complete.**

## 1. Files changed

- `site-copy/toronto-to-winnipeg-movers/index.html`
- `site-copy/winnipeg-to-toronto-movers/index.html`
- `tools/templates/winnipeg-routes/toronto-to-winnipeg-movers.html`
- `tools/templates/winnipeg-routes/winnipeg-to-toronto-movers.html`
- `tools/rebuild-toronto-winnipeg-routes.mjs`
- `tools/route-page-ownership.mjs`
- `site-copy/assets/step46-toronto-winnipeg.css`
- `site-copy/assets/step46-toronto-winnipeg.js`
- `tools/audit-step46-toronto-winnipeg.mjs`
- `tools/hash-route-build-state.mjs`
- Step 46 JSON audit/hash evidence files in the repository root

No deployment occurred.

## 2. Toronto → Winnipeg changes

- Added explicit Toronto/GTA pickup and building-access planning.
- Added westbound Ontario-to-Manitoba corridor, Prairie weather, Winnipeg delivery, elevator, loading, and parking guidance.
- Added the canonical red trust strip.
- Added route-scoped mobile navigation accessibility and floating-control collision fixes.

## 3. Winnipeg → Toronto changes

- Corrected the contaminated hero eyebrow `TORONTO TO TORONTO MOVERS` to `Winnipeg to Toronto movers`.
- Removed the extra `No brokers or subcontractors` quote pill and replaced the hero's absolute `No Subcontractors` claim with `Packing and storage available`.
- Added explicit Winnipeg pickup, eastbound Manitoba-to-Ontario corridor, seasonal weather, Ontario arrival, and Toronto condo/elevator/loading guidance.
- Added the canonical red trust strip and the same route-scoped interaction fixes.

## 4. Confirmed owner/render architecture

| Route | Registry Owner | Declared Render | Actual Render | React Support | Nav | Chat |
| --- | --- | --- | --- | --- | --- | --- |
| `/toronto-to-winnipeg-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | static | static | none; no module bootstrap and no exact React route | `static-nav.js` + Step 46 accessibility enhancer | `static-chat.js` |
| `/winnipeg-to-toronto-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | static | static | none; no module bootstrap and no exact React route | `static-nav.js` + Step 46 accessibility enhancer | `static-chat.js` |

Both routes use `conversion-boost.js`. Registered post-processors remain `finalize-route-faq-architecture.mjs` and `normalize-route-title-metadata.mjs`. Raw and settled H1s match the direction. The settled directional body sentinels are the westbound Ontario-to-Manitoba and eastbound Manitoba-to-Ontario planning paragraphs. Declared and actual architecture agree.

## 5. Full durable source/data chain

`route-page-ownership.mjs` → `route-writer-manifest.mjs` → `rebuild-toronto-winnipeg-routes.mjs` → the two explicit pair-owned templates → the two checked-in route outputs → global FAQ finalizer → global title normalizer. The cost guide is maintained by the pair owner and `rebuild-cost-guide-popular-routes.mjs`; deterministic chatbot values live in `conversion-boost.js` and are enforced by `chatbot-route-pricing.test.mjs`.

The old broad `fix-winnipeg-static-routes.mjs` claims are legacy-only for this pair and are not active ownership. `generate-spa-routes.mjs` skips both routes through the ownership registry. Neither direction reads another generated route HTML file or a mutable cross-route template. The pair generator now validates required fact fields, five prices, and the overall range before writing; it also produces canonical title fields and FAQ schema directly.

## 6. Authoritative route facts

| Fact | Toronto → Winnipeg | Winnipeg → Toronto | Winning Source |
| --- | --- | --- | --- |
| Distance | 2,225 km | 2,225 km | pair-owned generator; confirmed by cost guide/chatbot |
| Transit | 4–12 days | 4–12 days | pair-owned generator; confirmed by cost guide/chatbot |
| Studio | $2,400+ | $2,400+ | pair-owned generator; confirmed by cost guide/chatbot |
| 1-bedroom | $3,400+ | $3,400+ | pair-owned generator; confirmed by cost guide/chatbot |
| 2-bedroom | $5,500+ | $5,500+ | pair-owned generator; confirmed by cost guide/chatbot |
| 3-bedroom | $9,000+ | $9,000+ | pair-owned generator; confirmed by cost guide/chatbot |
| 4+ bedroom | $13,000+ | $13,000+ | pair-owned generator; confirmed by cost guide/chatbot |
| Overall range | $2,400–$13,000 | $2,400–$13,000 | pair-owned generator; confirmed by route body/FAQ |

## 7. Route-fact corrections

None. Current durable sources agree, so the existing 2,225 km, 4–12 day, and five-row pricing values were retained.

## 8. Contamination/copy errors removed

Removed the reverse-route `TORONTO TO TORONTO MOVERS` contamination and the two absolute subcontractor claims. Vancouver references remaining in raw body text are confined to the legitimate company footer/service-area navigation. No Calgary, Edmonton, Montreal, Ottawa, Halifax, or Victoria route-body contamination was found.

## 9. Directional form result

- Toronto → Winnipeg: `Toronto, ON` → `Winnipeg, MB`
- Winnipeg → Toronto: `Winnipeg, MB` → `Toronto, ON`

Values remain correct at initial load, approximately 1.5 seconds, and beyond 5 seconds.

## 10. Metadata/title/OG/Twitter result

Both routes have route-specific raw and settled titles ending in exactly one `| Purely Canadian Movers`; raw title, settled title, OG title, and Twitter title match exactly. Meta descriptions are route-specific. Canonical and OG URLs are self-referential and correct.

Global raw normalization changed 0/56 route documents. The runtime title audit passed 55/55 evaluable routes; Victoria → Vancouver remains excluded under the known browser limitation.

## 11. FAQ/schema result

Each target has one visible FAQ section, one heading, seven ordered Q&A entries, one `FAQPage`, exact visible/schema parity, zero hidden generic FAQ, and zero `.pcm-local-seo`. The generator derives the single schema from the visible pair-owned FAQ so direct output is consistent. Global FAQ audit: 55/55 evaluable canonical; Victoria → Vancouver runtime unavailable as previously documented.

## 12. Terminology corrections

Removed absolute `No brokers or subcontractors` / `No Subcontractors` pills. Retained accurate agent-network language, carrier liability, Declared Value Protection, planning-range, and written-estimate wording. No stale insurance, valuation-coverage, or guaranteed-price wording remains in target route content.

## 13. Typography result

Computed desktop H1 is Playfair Display, 48px/60px/700; mobile is Playfair Display, 36px/45px/700. Body/forms use Source Sans 3. No global typography file changed.

## 14. Quote-panel result

Each route has one 1120px canonical shell, red accent, 8px radius, canonical shadow, two desktop columns/one mobile column, six quote trust pills, verified-company details, written-estimate treatment, and correct directional defaults. The September 30 offer was current on the September 6 audit date and was not expired.

## 15. Pricing result

One pricing section/table per route, five authoritative rows, directional heading, 760px minimum table width, internal mobile scrolling, Declared Value Protection wording, and planning-range disclaimer. No `Moving Cost Breakdown`, temporary `Route Pricing`, duplicate cost block, or `undefined` remains.

## 16. Route at a Glance result

One three-column desktop/one-column mobile glance block per route, consistently showing 2,225 km, 4–12 days, and $2,400–$13,000.

## 17. Main-content result

Directional copy was retained and strengthened. The two pages are not textually identical: Toronto → Winnipeg is westbound and emphasizes Toronto/GTA pickup plus Winnipeg delivery; Winnipeg → Toronto is eastbound and emphasizes Winnipeg pickup plus Toronto arrival/condo logistics.

## 18. Navigation result by architecture

Static navigation is retained with no React bootstrap or duplicate nav. Desktop dropdowns open. Mobile menu opens/closes, reports `aria-expanded=false → true → false`, closes on Escape, and restores focus through the existing close control.

## 19. Chatbot result by architecture

Static chatbot retained: one launcher, one panel, opens/closes, fits desktop/mobile viewports, and has no React/static duplication.

## 20. Post-footer contamination result

One footer, zero `.pcm-local-seo`, zero `undefined`, no post-footer FAQ, no duplicate conversion block, no homepage body, no soft 404, and no stale route dependency.

## 21. Source/finalizer durability

The pair owner uses explicit pair-owned templates, validates all required facts, emits canonical metadata/schema, and is byte-idempotent. A second direct owner run produced 0/56 route drift and 0/98 asset drift.

## 22. Delayed-runtime stability

Raw, initial, ~1.5-second, and >5-second checks retain directional H1s/forms, singular pricing/glance/FAQ, exact titles, route-specific body, zero homepage replacement, zero legacy pricing, and zero `undefined`.

## 23. Exact desktop/mobile QA

At 1280×900 and 390×844: no page-level horizontal overflow; pricing scrolls internally on mobile; quote and glance blocks stack; no broken local images; nav/chat interactions pass; chatbot stays inside the viewport; floating-control overlap is resolved. The only console item was a sandbox-blocked remote-resource load (`ERR_NETWORK_ACCESS_DENIED`), not an application exception.

## 24. Global FAQ/title/body regression result

Raw title normalization is stable across 56 routes. Runtime title and FAQ checks are canonical on all 55 evaluable routes. No homepage/soft-404 replacement occurred in the target pair. Victoria → Vancouver remains the known global browser exception.

## 25. Ownership/architecture validation

PASS: 56 routes, exactly one owner each, zero collisions, declared static architecture matching runtime. Syntax checks pass. Automated tests: 33/33.

## 26. First aggregate convergence result

**FAIL — mandatory stop condition.** The clean-clone first aggregate changed 7/56 non-target route files and 0/98 assets:

- `/calgary-to-ottawa-movers/`
- `/montreal-to-winnipeg-movers/`
- `/ottawa-to-calgary-movers/`
- `/ottawa-to-winnipeg-movers/`
- `/victoria-to-ottawa-movers/`
- `/winnipeg-to-montreal-movers/`
- `/winnipeg-to-ottawa-movers/`

The clone baseline hashes exactly matched the current Step 45A reconciled working-tree hashes for all seven, so this is not a clone-overlay artifact. It is inherited first-pass convergence debt in non-target durable writers/templates. Step 46 requires 0/56 and explicitly requires stopping here.

## 27. Second aggregate convergence result

Diagnostic only: 0/56 route drift and 0/98 asset drift. This does not waive the failed first-pass gate.

## 28. Regression result

Not rerun after the aggregate failure because Step 46 requires an immediate stop. The regression manifest already contains both Toronto ↔ Winnipeg directions and remains deduplicated at 49 unique routes; no count-inflating edit was made.

## 29. Working-tree route isolation

PASS: comparing all 56 route hashes before/after Step 46, exactly two changed: Toronto → Winnipeg and Winnipeg → Toronto.

## 30. Remaining known issues

1. First-pass aggregate drift on the seven non-target routes listed in section 26 blocks Step 46 completion.
2. Victoria → Vancouver retains the pre-existing browser-harness limitation.

The temporary validation clone was removed after its baseline/first/second hash evidence was copied to the workspace. Step 47 was not started.
