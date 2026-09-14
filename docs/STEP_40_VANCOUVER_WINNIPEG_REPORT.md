# Step 40 — Vancouver ↔ Winnipeg Route Standardization

Step 40 is complete. No deployment was performed and Step 41 was not started.

## 1. Files changed

Route output changed only in:

- `site-copy/vancouver-to-winnipeg-movers/index.html`
- `site-copy/winnipeg-to-vancouver-movers/index.html`

Durable Step 40 source and validation changes:

- `tools/rebuild-winnipeg-modern-routes.mjs`
- `tools/vancouver-winnipeg-route-data.mjs`
- `site-copy/assets/step40-vancouver-winnipeg.css`
- `site-copy/assets/step40-vancouver-winnipeg.js`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/audit-step40-vancouver-winnipeg.mjs`
- `tools/audit-step33-regressions.mjs`
- `tools/audit-route-faq-architecture.mjs`
- `tools/hash-step40-state.mjs`

Generated audit/hash evidence is stored in the `STEP_40_*.json` files at the repository root.

## 2. Vancouver → Winnipeg changes

The static page now uses the canonical route hierarchy and computed presentation, with Vancouver pickup/strata/loading planning, an eastbound BC/Prairie corridor description, winter flexibility, and Winnipeg delivery/building-access considerations. The expired September promotion and Toronto-contaminated related-route URL were removed.

## 3. Winnipeg → Vancouver changes

The reverse static page now uses the same canonical presentation while preserving Winnipeg pickup/Manitoba planning, a westbound Prairie/BC corridor description, seasonal conditions, and Vancouver strata/elevator/loading-zone arrival considerations. The expired September promotion and copied Toronto hero eyebrow were removed.

## 4. Confirmed owner/render architecture

| Route | Registry Owner | Declared Render | Actual Render | React Support | Nav | Chat |
|---|---|---|---|---|---|---|
| `/vancouver-to-winnipeg-movers/` | `rebuild-winnipeg-modern-routes.mjs` | Static | Static | Not applicable; no bootstrap | `static-nav.js` | `static-chat.js` |
| `/winnipeg-to-vancouver-movers/` | `rebuild-winnipeg-modern-routes.mjs` | Static | Static | Not applicable; no bootstrap | `static-nav.js` | `static-chat.js` |

Both routes use `conversion-boost.js` and the path-gated Step 40 runtime. There is no ownership/runtime mismatch. The compiled bundle contains an incidental Vancouver-route string but neither page boots React and neither depends on a compiled React route component.

## 5. Authoritative route facts

| Fact | Vancouver → Winnipeg | Winnipeg → Vancouver | Winning Source |
|---|---|---|---|
| Distance | approximately 2,300 km | approximately 2,300 km | dedicated owner + frozen pair data; corroborated by templates/runtime tables |
| Transit | 5–13 days | 5–13 days | dedicated owner + frozen pair data; corroborated by cost/chat/runtime sources |
| Studio | $2,400+ | $2,400+ | dedicated owner + frozen pair data; corroborated by cost guide/chatbot |
| 1-bedroom | $3,400+ | $3,400+ | same |
| 2-bedroom | $5,500+ | $5,500+ | same |
| 3-bedroom | $8,900+ | $8,900+ | same |
| 4+ bedroom | $13,000+ | $13,000+ | same |
| Overall range | $2,400–$13,000+ | $2,400–$13,000+ | derived from the five authoritative rows and frozen explicitly |

## 6. Route-fact corrections

No numeric fact correction was required. The previously established values still agree with the current owner, route templates, cost guide/runtime tables, chatbot pricing, and FAQ/schema.

## 7. Contamination/copy errors removed

Removed the copied `TORONTO TO VANCOUVER MOVERS` eyebrow, a Toronto long-distance URL used for Vancouver, and the expired `Online estimate bonus / Book before September 30` content. No unintended Toronto, Calgary, Edmonton, Montreal, Ottawa, Halifax, or Victoria reference remains in route body content; legitimate navigation/footer/related links remain.

## 8. Directional form result

- Vancouver → Winnipeg: `Vancouver, BC` → `Winnipeg, MB`
- Winnipeg → Vancouver: `Winnipeg, MB` → `Vancouver, BC`

The actual input values remain correct at initial normalization, ready state, about 1.2 seconds, and 5.4+ seconds.

## 9. Metadata/title/OG/Twitter result

Each route's raw and settled title, `og:title`, and `twitter:title` match exactly and contain the `| Purely Canadian Movers` suffix once. Descriptions are directional, canonicals are self-referential, and OG URLs are correct.

## 10. FAQ/schema result

Each route has one visible FAQ section, one FAQ heading, one implementation, one `FAQPage`, exact question/answer/order parity, and zero `.pcm-local-seo`. Neither route changes FAQ facts merely for style.

## 11. Terminology corrections

Canonical pricing/body copy uses `Declared Value Protection`, distinguishes basic carrier liability, and describes planning ranges rather than guaranteed pricing. No stale `valuation coverage`, `fully insured`, or obsolete broker wording remains in the settled route content.

## 12. Typography result

Computed route headings use Playfair Display and body/forms/buttons use Source Sans 3. H1 computes to 48px/60px/700 at 1280px and 36px/45px/700 at 390px; canonical content, pricing, glance, and FAQ scales are applied route-locally.

## 13. Quote-panel result

One canonical panel remains per route: 1120px shell, red accent, 8px radius, canonical shadow, two desktop columns, one mobile column, six trust pills, written-estimate planning treatment, verified company details, and correct directional values. No expired promotion remains.

## 14. Pricing result

One pricing section/table remains per route, with five authoritative rows, a 760px minimum table width, internal mobile scrolling, correct directional heading, the $2,400–$13,000+ overall range, Declared Value Protection wording, and a non-guaranteed planning disclaimer. `Moving Cost Breakdown`, temporary `Route Pricing`, duplicate tables, and obsolete protection wording are absent.

## 15. Route at a Glance result

Each route has one canonical glance card showing 2,300 km, 5–13 days, and $2,400–$13,000+. It renders in three columns on desktop and one column on mobile and agrees with pricing, body copy, FAQ, and schema.

## 16. Main-content result

Both routes use canonical section order, 896px content width, hierarchy, spacing, cards, proof list, process grid, and responsive behavior. Directional copy remains distinct and corridor-appropriate.

## 17. Navigation result by architecture

Both retain static navigation and have no React bootstrap or duplicate navigation. Desktop dropdowns pass. At 390×844 the mobile sheet opens/closes, `aria-expanded` transitions false/true/false, Escape closes the sheet, and focus returns to the trigger.

## 18. Chatbot result by architecture

Both retain exactly one static launcher/panel. Desktop and mobile open/close checks pass with no React/static duplication or sticky-control obstruction.

## 19. Post-footer contamination result

Each route finishes with one footer, zero `.pcm-local-seo`, no post-footer generic FAQ, no duplicate conversion block, no homepage replacement, no soft 404, no stale promotion, and no visible `undefined`.

## 20. Source/finalizer durability

The dedicated full-page owner consumes frozen pair facts and explicit templates, injects only the path-gated Step 40 assets, and produces the final raw architecture. Its existing order-independence test now also asserts Step 40 assets, facts, contamination absence, and static rendering. A second direct owner run is byte-identical; two complete aggregate passes are also byte-identical.

## 21. Delayed-runtime stability result

Raw, initial browser, ready state, ~1.2-second, and 5.4+-second checkpoints preserve directional H1/title/defaults, one pricing block, one glance, one FAQ/schema, and route-specific body content. No homepage/legacy pricing replacement occurs.

## 22. Exact desktop/mobile QA

Tested at exactly 1280×900 and 390×844. No page-level horizontal overflow, broken DOM images, or clipped route controls were found. Quote/glance layouts stack correctly; pricing scrolls internally on mobile; navigation and chatbot interactions pass. The only console message is sandbox `ERR_NETWORK_ACCESS_DENIED` for an external resource, not an application exception.

## 23. Global FAQ/title/body regression result

- Title contract: raw title/OG/Twitter remains 56/56; all 55 browser-testable routes are canonical.
- FAQ contract: the current Step 40 pair is raw and browser canonical with exact parity; all 55 browser-testable routes pass the global audit.
- Body: the 38-route regression has no homepage/soft-404 replacement.
- The known Victoria → Vancouver browser-harness limitation is unchanged.

## 24. Ownership/architecture validation

The validator reports 56 routes, exactly one full-page owner each, and zero collisions. Architecture matches runtime. Ownership tests pass 19/19, title tests 4/4, all Step 40 syntax checks pass, and the aggregate dry run includes the owner in the correct order.

## 25. First aggregate convergence result

First isolated aggregate: **0/56 route drift**, **0/86 asset drift**, and zero unexpected shared-writer drift.

## 26. Second aggregate convergence result

Second isolated aggregate: **0/56 route drift**, **0/86 asset drift**, and zero shared-file drift.

## 27. Regression result

The prior 36-route set plus both Step 40 routes passes **38/38** for route identity, title branding, form defaults, pricing, navigation/chatbot presence, body integrity, and zero `.pcm-local-seo`.

## 28. Working-tree route isolation

Before/after hashes show that only `/vancouver-to-winnipeg-movers/` and `/winnipeg-to-vancouver-movers/` changed among all 56 route HTML files. The two monitored shared writers did not change. Aggregate output remained isolated in the temporary clone and was not copied into the working tree.

## 29. Remaining known issues

- The existing Victoria → Vancouver browser-harness limitation remains unchanged.
- Offline QA blocks an external resource request; local DOM, computed typography, layouts, and interactions pass.
- The repository was already materially dirty before Step 40, so the route hash ledger, rather than overall Git status, is the isolation authority.
