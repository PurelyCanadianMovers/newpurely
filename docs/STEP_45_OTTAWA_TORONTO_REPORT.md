# Step 45 — Ottawa ↔ Toronto canonical route report

## 1. Files changed

- `site-copy/ottawa-to-toronto-movers/index.html`
- `site-copy/toronto-to-ottawa-movers/index.html`
- `site-copy/assets/step45-ottawa-toronto.css`
- `site-copy/assets/step45-ottawa-toronto.js`
- `tools/templates/ottawa-toronto-routes/canonical-static-shell.html`
- `tools/rebuild-ottawa-toronto-routes.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/audit-step45-ottawa-toronto.mjs`
- `tools/audit-step33-regressions.mjs`
- Step 45 JSON audit/hash artifacts and this report.

No deployment was performed.

## 2. Ottawa → Toronto changes

Retained the route-specific Ottawa pickup and Toronto delivery copy, normalized the main content to the canonical 896px/832px content width, added the canonical trust strip and three-column glance card, normalized card/process/FAQ/related/CTA layout, and retained the correct Ottawa → Toronto form values.

## 3. Toronto → Ottawa changes

Retained the distinct Toronto pickup and Ottawa delivery copy, normalized the same shared presentation, and retained eastbound Toronto/GTA access and Ottawa delivery concerns. The two directions were not made textually identical.

## 4. Confirmed owner/render architecture

| Route | Registry owner | Declared render | Actual render | React support | Nav | Chat |
|---|---|---|---|---|---|---|
| Ottawa → Toronto | `rebuild-ottawa-toronto-routes.mjs` | Static | Static | Not applicable; no module bootstrap | Static | Static |
| Toronto → Ottawa | `rebuild-ottawa-toronto-routes.mjs` | Static | Static | Not applicable; no module bootstrap | Static | Static |

Both use `conversion-boost.js`, `static-nav.js`, `static-chat.js`, and the path-gated Step 45 navigation enhancer. Raw, early, and settled H1s match the route identity.

## 5. Full durable source/data chain

The ownership registry maps both routes to `rebuild-ottawa-toronto-routes.mjs`. The owner contains frozen pair facts/copy, reads `tools/templates/ottawa-toronto-routes/canonical-static-shell.html`, renders the two pages, and validates singular components, metadata inputs, route facts, forms, architecture, and contamination. The aggregate then runs the global FAQ and title normalizers. The generator's guarded supporting writes continue to use the Ottawa/Toronto hub helpers, cost-guide helper, and sitemap guard.

## 6. Calgary → Ottawa dependency

Confirmed removed. Neither the generator nor its pair-owned shell reads Calgary → Ottawa HTML or any generated route file. Repository search found no Calgary dependency in the Ottawa/Toronto owner chain.

## 7. Authoritative route facts

| Fact | Ottawa → Toronto | Toronto → Ottawa | Winning source |
|---|---:|---:|---|
| Distance | ~450 km | ~450 km | Frozen owner data |
| Transit | 2–5 days | 2–5 days | Frozen owner data |
| Studio | $800+ | $800+ | Frozen owner data |
| 1 bedroom | $1,100+ | $1,100+ | Frozen owner data |
| 2 bedroom | $1,500+ | $1,500+ | Frozen owner data |
| 3 bedroom | $2,000+ | $2,000+ | Frozen owner data |
| 4+ bedroom | $2,800+ | $2,800+ | Frozen owner data |
| Overall range | $800+–$2,800+ | $800+–$2,800+ | Frozen owner data |

## 8. Route-fact corrections

No numerical fact changes were required. Existing durable pair facts were consistent.

## 9. Contamination/copy errors removed

The route main bodies contain no Vancouver, Calgary, Edmonton, Montreal, Halifax, Victoria, or Winnipeg references. Company-wide footer/navigation links remain legitimate. No reverse-direction copy, homepage body, soft 404, dated promotion, legacy pricing block, or `undefined` remains.

## 10. Directional form result

Ottawa → Toronto remains `Ottawa, ON` → `Toronto, ON`; Toronto → Ottawa remains `Toronto, ON` → `Ottawa, ON`. Actual values remained correct at initial, ~1.2-second, and 5+-second checkpoints.

## 11. Ottawa grammar result

No malformed `a Ottawa`, `A Ottawa`, or `an Toronto` usage remains in visible route content or FAQ data.

## 12. Metadata/title/OG/Twitter result

Both raw and settled pages use exactly one terminal `| Purely Canadian Movers` suffix. Raw title, settled title, OG title, and Twitter title match exactly; each description is directional, and canonical/OG URLs are self-referential.

## 13. FAQ/schema result

Each direction has one visible FAQ section, one heading, one implementation, one `FAQPage`, and exact question/answer/order parity. There is no hidden generic FAQ and no `.pcm-local-seo`.

## 14. Terminology corrections

The pricing disclaimer now distinguishes basic carrier liability from optional Declared Value Protection and explicitly treats figures as non-guaranteed CAD planning ranges. Inaccurate interprovincial/cross-country/Prairie wording is absent.

## 15. Typography result

Computed desktop H1 is Playfair Display 48/60/700; mobile is 36/45/700. Body/forms/buttons compute to Source Sans 3. Main H2/H3, FAQ, glance, quote, and pricing scales follow the canonical contract through the pair-scoped stylesheet.

## 16. Quote-panel result

Exactly one panel per route; 1120px shell, 420px-capped form column, red accent, 8px radius, canonical shadow, six trust pills, written-estimate treatment, verified-company details, and correct directional defaults. It stacks to one column at 390px.

## 17. Pricing result

Exactly one pricing section and one internally scrollable 760px-minimum table with five authoritative rows. No `Moving Cost Breakdown`, temporary `Route Pricing`, duplicate pricing, stale pricing cards, or obsolete protection wording remains.

## 18. Route at a Glance result

Exactly one card per route with ~450 km, 2–5 days, and $800+–$2,800+. It uses three desktop columns and one mobile column.

## 19. Main-content result

Canonical width, hierarchy, spacing, cards, lists, process grid, FAQ placement, related resources, and closing CTA are in place while retaining directional Ontario route content. Highway 401 planning appears once in each direction.

## 20. Navigation result by architecture

Static navigation is preserved with no React duplication. Desktop dropdown interaction passed. Mobile menu opened and closed, and `aria-expanded` changed `false` → `true` → `false`; Escape closed the menu and restored focus through the Step 45 enhancer.

## 21. Chatbot result by architecture

Each route has one static launcher and one static panel. Open/close passed at both viewports. Desktop geometry fits 1280×900; mobile geometry fits 390×844 with no sticky-control overlap.

## 22. Post-footer contamination result

One intended footer, zero `.pcm-local-seo`, zero `undefined`, no generic post-footer FAQ, no duplicate conversion block, no homepage body, no soft 404, and no stale promotion.

## 23. Source/finalizer durability

The direct owner reproduced the final pair. A second direct run changed zero hashed bytes across all 56 routes and shared title writers. Facts, title contract, FAQ parity, forms, singular pricing, and contamination guards survived.

## 24. Delayed-runtime stability

Initial, ~1.2-second, and 5+-second snapshots were identical for H1, title fields, form values, component counts, FAQ parity, body identity, and contamination checks.

## 25. Exact desktop/mobile QA

At 1280×900 and 390×844: no page-level horizontal overflow, no broken local images, correct quote/glance stacking, internal-only mobile pricing scroll, working navigation/chat, and no clipped floating controls. The only console message was a sandbox-blocked external resource (`ERR_NETWORK_ACCESS_DENIED`), recorded separately from application errors.

## 26. Global FAQ/title/body regression result

FAQ browser audit: 55/55 evaluable routes canonical; Victoria → Vancouver remains the documented harness limitation. The title audit confirmed both Step 45 routes canonical. Its full 55-route run also exposed six unrelated existing delayed runtime-overwrite classifications; no Step 45 target is among them. The 47-route body regression passed 47/47.

## 27. Ownership/architecture validation

Ownership validation passed 56 routes with one owner each and zero collisions. Declared and actual Step 45 architecture match. The explicit ownership/title/chatbot-pricing suite passed 33/33. Relevant generator, manifest, runtime, and auditor syntax checks passed.

## 28. First aggregate convergence result

The Step 45 target pair changed 0/2 and assets changed 0/96. The complete first aggregate changed 10/56 unrelated route files, all already different from the recorded Step 44 converged hashes before Step 45 began. They are Montreal/Vancouver (both directions), Ottawa/Vancouver (both), Toronto/Winnipeg (both), Vancouver/Winnipeg (both), and Winnipeg/Montreal (both). Per the isolation rule, none of that aggregate output was copied into the working tree.

This does not meet the requested global 0/56 first-pass acceptance threshold.

## 29. Second aggregate convergence result

Second run in the copy-based clean validation workspace: 0/56 route drift and 0/96 asset drift.

## 30. Regression result

The deduplicated regression list now contains 47 unique directions and passes 47/47 for identity, title branding, form defaults, pricing, FAQ parity, `.pcm-local-seo`, `undefined`, navigation/chat, and body integrity.

## 31. Working-tree route isolation

Step 45 before/after route hashes show only `/ottawa-to-toronto-movers/` and `/toronto-to-ottawa-movers/` changed. No unrelated aggregate-generated route output was copied back.

## 32. Remaining known issues

- The first complete aggregate is not globally clean because of the 10 unrelated inherited route-output differences listed in section 28. Correcting them would violate Step 45's explicit route isolation without separate authorization.
- Six unrelated routes retain pre-existing delayed title-runtime overwrite classifications in the current 55-route title audit.
- Victoria → Vancouver remains the known browser-harness limitation.
- External analytics/font resources may be sandbox-blocked during local QA.

Because the mandatory first-aggregate threshold is not met, Step 45 is not formally complete despite the Ottawa ↔ Toronto pair itself passing every scoped gate.
