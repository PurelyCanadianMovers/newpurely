# Step 39 — Toronto ↔ Victoria Route Standardization

Status: **Complete. Not deployed. Step 40 not started.**

## 1. Files changed

- Route output: `site-copy/toronto-to-victoria-movers/index.html`, `site-copy/victoria-to-toronto-movers/index.html`
- Pair runtime/presentation: `site-copy/assets/step39-toronto-victoria.js`, `site-copy/assets/step39-toronto-victoria.css`
- Durable source/build: `tools/toronto-victoria-route-data.mjs`, `tools/finalize-toronto-victoria-routes.mjs`, `tools/route-page-ownership.mjs`, `tools/route-writer-manifest.mjs`
- Validation: `tools/audit-step39-toronto-victoria.mjs`, `tools/route-page-ownership.test.mjs`
- Evidence: `STEP_39_TORONTO_VICTORIA_AUDIT.json`, `STEP_39_FAQ_GLOBAL.json`, `STEP_39_TITLE_GLOBAL.json`, `STEP_39_REGRESSION.json`, `STEP_39_WORKTREE_HASH.json`, and the three `STEP_39_AGGREGATE_*.json` snapshots.

No shared compiled bundle, global CSS, `conversion-boost.js`, `static-nav.js`, or `static-chat.js` was changed by Step 39.

## 2. Toronto → Victoria changes

Added the missing canonical pricing table; replaced the legacy cost block at runtime; normalized the quote panel, main-content width, Route at a Glance, FAQ/schema, typography, metadata, and delayed runtime behavior; retained Toronto pickup, westbound corridor, Vancouver Island, ferry, Victoria, Nanaimo, access, and storage content.

## 3. Victoria → Toronto changes

Corrected empty actual form values, stale pricing/transit FAQ facts, Victoria–Vancouver copy leaks, duplicated wording, stale promotion, obsolete protection wording, SVG path corruption, and process headings. Retained Victoria pickup, island/ferry planning, eastbound corridor, Toronto/GTA access, inventory, and seasonal content.

## 4. Confirmed owner/render architecture

| Route | Registry owner | Declared render | Actual render | Exact React support | Navigation | Chat |
| --- | --- | --- | --- | --- | --- | --- |
| `/toronto-to-victoria-movers/` | `generate-spa-routes.mjs` | React SPA | React SPA | Present | React | React |
| `/victoria-to-toronto-movers/` | checked-in static route source | Static | Static | Absent | `static-nav.js` | `static-chat.js` |

Both use `conversion-boost.js` plus the registered Step 39 route-scoped finalizer/runtime. No ownership conflict was found.

The React route's checked-in shell retains the documented shared-home raw H1 (`Professional Movers in Vancouver & the Lower Mainland Since 1991`) before the exact compiled route mounts; its settled H1 is `Toronto to Victoria & Nanaimo Movers`. The static route's raw and settled H1 are both `Victoria to Toronto Movers`.

| Raw component count | Toronto → Victoria | Victoria → Toronto |
| --- | ---: | ---: |
| H1 | 1 | 1 |
| Quote/form | 0/0 (React runtime-owned) | 1/1 |
| Pricing section/table | 1/1 | 1/1 |
| Route at a Glance | 0 (React runtime-owned) | 1 |
| FAQ section/heading/FAQPage | 1/1/1 | 1/1/1 |
| `.pcm-local-seo` | 0 | 0 |
| Footer | 1 | 1 |

## 5. Authoritative route facts

| Fact | Toronto → Victoria | Victoria → Toronto | Winning source |
| --- | --- | --- | --- |
| Distance | approximately 4,400 km | approximately 4,400 km | Established route copy and pair record |
| Transit | 10–22 days | 10–22 days | Cost guide and current Victoria-route pricing data |
| Studio | $3,000+ | $3,000+ | Cost guide/current route data |
| 1-bedroom | $5,300+ | $5,300+ | Cost guide/current route data |
| 2-bedroom | $7,000+ | $7,000+ | Cost guide/current route data |
| 3-bedroom | $11,000+ | $11,000+ | Cost guide/current route data |
| 4+ bedroom | $16,000+ | $16,000+ | Cost guide/current route data |
| Overall range | $3,000–$16,000+ | $3,000–$16,000+ | Derived from the authoritative five rows |

## 6. Victoria/Nanaimo naming policy

- Toronto → Victoria preserves `Victoria & Nanaimo` in the authoritative title/H1 and `Victoria and Nanaimo` in the meta description. Its quote heading and route-specific FAQ/main coverage retain Nanaimo where the service area is intentional. The pricing heading, form destination, and glance direction remain Victoria-specific.
- Victoria → Toronto remains Victoria-only in title, H1, metadata, quote/pricing headings, form, glance, FAQ/schema, and CTA. Nanaimo is not promoted into that route's identity.
- Related links and company/footer navigation retain their legitimate destination labels.

## 7. Route-fact corrections

Victoria → Toronto's `1–3`-day FAQ defect and `$2,200–$14,000+` legacy FAQ range were replaced by 10–22 days and the five authoritative price rows. Toronto → Victoria now has the same verified range and a singular canonical table.

## 8. Contamination/copy errors removed

Removed Victoria–Vancouver corridor, reverse-direction, packing, uniqueness, climate, and process references from the Victoria → Toronto body/FAQ. Vancouver references that remain are legitimate Vancouver Island/ferry or related-navigation context.

## 9. Directional form result

- Toronto → Victoria: actual settled values `Toronto, ON` → `Victoria, BC`.
- Victoria → Toronto: actual settled values `Victoria, BC` → `Toronto, ON`.

Values remained correct through the 5+ second checkpoint and are real control values, not placeholders.

## 10. Metadata/title/OG/Twitter result

Raw and settled title, OG title, and Twitter title match exactly with one ` | Purely Canadian Movers` suffix. Both routes have route-specific descriptions, self-canonicals, and correct OG URLs.

## 11. FAQ/schema result

Each route has one visible FAQ section, one FAQ heading, one implementation, one `FAQPage`, zero hidden generic FAQ, zero `.pcm-local-seo`, and exact question/answer/order parity. Toronto → Victoria retains 12 corrected route FAQs; Victoria → Toronto retains 9 corrected route FAQs.

## 12. Terminology corrections

Replaced insured/valuation language with basic carrier liability and Declared Value Protection, broker absolutes with documented Great Canadian Van Lines agent-network language, guaranteed-price implications with planning/written-estimate wording, and route-general ferry claims with address/schedule-specific planning language.

## 13. Typography result

Computed desktop H1 is Playfair Display 48/60/700; mobile is 36/45/700. Body/forms/buttons compute to Source Sans 3. FAQ, glance, pricing, and main-content headings use route-scoped canonical sizing.

## 14. Quote-panel result

One panel per route, 1120px shell behavior, 420px desktop form column, red accent, canonical card styling, six trust pills, two-column desktop layout, one-column mobile stack, corrected heading/defaults, and no expired promotion.

## 15. Pricing result

One section/table, five rows, correct directional heading, 760px table minimum, internal mobile scrolling, Declared Value Protection wording, planning disclaimer, and no `Moving Cost Breakdown`, `Route Pricing`, or duplicate cost cards.

## 16. Route at a Glance result

One block per route with `~4,400 km`, `10–22 days`, and `$3,000–$16,000+`; three desktop columns and one mobile column.

## 17. Main-content result

Directional Toronto-origin and Victoria-origin content remains distinct. Only hierarchy, width, spacing, legacy blocks, terminology, fact consistency, and copied-route errors were normalized.

## 18. Navigation result by architecture

React navigation remains on Toronto → Victoria; desktop dropdown and mobile sheet pass. Static navigation remains on Victoria → Toronto with no React bootstrap; desktop dropdown, mobile open/close, `aria-expanded`, and Escape close pass.

## 19. Chatbot result by architecture

Each route has one launcher/panel. React chat is retained on Toronto → Victoria; static chat is retained on Victoria → Toronto. Both open/close at desktop and mobile without clipping or duplicate launchers.

## 20. Post-footer contamination result

One footer, zero `.pcm-local-seo`, no generic post-footer FAQ, no duplicate conversion block, no homepage replacement, no soft 404, no stale promotion, and no visible `undefined` on either route.

## 21. Source/finalizer durability

Facts and FAQs are frozen in `toronto-victoria-route-data.mjs`; `finalize-toronto-victoria-routes.mjs` is registered after both legitimate owners and before global FAQ/title finalizers. Its dedicated test proves a second direct run is byte-identical and preserves the React/static split.

## 22. Delayed-runtime stability result

Initial, post-ready/hydration, ~1.2-second, and 5.4+-second checkpoints retained the correct H1, title, form values, one price table, one glance, one FAQ/schema, and route body. No homepage or 404 replacement occurred.

## 23. Exact desktop/mobile QA

Tested exactly 1280×900 and 390×844. No page-level horizontal overflow, clipped controls, broken DOM images, or failed interactions. Pricing scrolls internally on mobile; quote/glance stack correctly. Browser console had no application exceptions or warnings. The sandbox blocked remote font, analytics, OpenAI ad-pixel, and CDN-image requests; those external network errors are recorded in the audit.

## 24. Global FAQ/title/body regression result

- Raw title/OG/Twitter: 56/56 exact.
- FAQ browser audit: 55/56 canonical; `/victoria-to-vancouver-movers/` reproduced the documented runtime-harness limitation. Both Step 39 routes are raw and runtime canonical with exact FAQ/schema parity.
- No new homepage/soft-404 body replacement was found. The legacy generic body checker still reports five unrelated, pre-existing canonical/wording findings and none on the Step 39 routes.

## 25. Ownership/architecture validation

56 routes, exactly one full-page owner each, zero collisions. Ownership tests 19/19; title tests 4/4; Step 39 syntax checks pass; dry run includes the finalizer in the correct order.

## 26. First aggregate convergence result

0/56 route drift, zero shared-writer drift, and zero drift across all files in `site-copy/assets`.

## 27. Second aggregate convergence result

0/56 route drift, zero shared-writer drift, and zero drift across all files in `site-copy/assets`.

## 28. Regression result

The 36-route regression set covering every route/direction listed in Step Z passed 36/36 for identity, title branding, actual form defaults, pricing, navigation/chat presence, body ownership, and zero `.pcm-local-seo`. Both Step 39 routes additionally pass their deeper route audit.

## 29. Working-tree route isolation

The Step 39 finalizer is explicitly scoped to only the two target route files. Aggregate hashes prove all 56 route artifacts were already converged before both passes. The repository was materially dirty before Step 39, so Git's overall modified-file list cannot be used as a clean before/after ledger; no non-target route HTML was intentionally edited or copied back from the temporary clone.

## 30. Remaining known issues

- The existing `/victoria-to-vancouver-movers/` browser-harness limitation remains unchanged and was not expanded into Step 39.
- Offline QA blocks external Google Fonts, analytics/ad-pixel, and CDN requests. Computed font stacks, DOM image integrity, layouts, and route scripts still pass locally.
- Pre-existing unrelated findings from `audit-route-consistency.cjs` remain outside Step 39.

Step 39 is complete. No deployment was performed, and Step 40 was not started.
