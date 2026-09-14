# Step 68 — BC to Washington cleanup

Scope: `/bc-to-washington-movers/` only. No reverse route was created, no Seattle ↔ Vancouver route was modified, no deployment occurred, and Step 69 was not started.

## 1. Step 67 material defect confirmed

| Route | Step 67 Class | Exact Material Defect | Owner | Render |
| --- | --- | --- | --- | --- |
| `/bc-to-washington-movers/` | C — Material | Rendered legacy `BC to Washington State Moving Cost Breakdown`; raw canonical and raw `og:url` pointed to the homepage | `generate-spa-routes.mjs` | Declared and actual `react-spa` |

The ownership/render gate passed before editing. Step 67 reported one pricing table, one Route-at-a-Glance heading, canonical title and FAQ contracts, correct broad form identity after runtime settlement, Source Sans 3 body typography, working navigation/chat architecture, and no ownership collision. No broader defect was inferred.

## 2. Files changed

Production/source changes:

- `site-copy/bc-to-washington-movers/index.html`
- `site-copy/assets/index-CNBNs70h.js` — one guarded BC→Washington component string only
- `tools/generate-spa-routes.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/audit-step33-regressions.mjs`
- `tools/audit-step68-bc-washington.mjs`

Evidence/report files created: `STEP_68_*.json` and this report. Among the 56 registered route HTML files, only `/bc-to-washington-movers/` changed. Among the 104 assets, only the compiled SPA bundle changed.

## 3. Ownership/render architecture

- Registry owner: `generate-spa-routes.mjs`.
- Writer manifest: authoritative full-page generator/existing-output preserver.
- Declared rendering: `react-spa`.
- Actual rendering: React SPA mounted from the existing compiled bundle.
- Declared global post-processors: FAQ finalizer, then title normalizer.
- Runtime: existing conversion runtime; no new navigation, chatbot, or shared runtime family.
- Declared and actual rendering agree. No static/React ownership confusion was introduced.

## 4. Reverse-route existence check

`/washington-to-bc-movers/` is absent from the ownership registry, route folders, sitemap, compiled router, hubs, redirects, chatbot mappings, and cost guide. It is not registered and has no owner. It was not created or linked.

## 5. Durable source chain

The durable chain is the preserved route HTML plus the checked-in compiled SPA route component, owned and normalized by `generate-spa-routes.mjs`, followed by the FAQ finalizer, title normalizer, and existing conversion/browser runtime. The owner now guards both the legacy and canonical pricing-heading source states and rejects an unexpected count. Existing target HTML receives its route-scoped head override before preservation. The change is deterministic and idempotent.

## 6. Route identity/scope

The page remains a British Columbia → Washington State, Canada → USA, province-to-state cross-border corridor/service page. It was not narrowed to Vancouver → Seattle and was not converted into a domestic or interprovincial template.

## 7. Authoritative facts

| Fact | Current Value | Durable Source | Keep/Correct |
| --- | --- | --- | --- |
| Origin scope | British Columbia, with existing Lower Mainland, Fraser Valley, and Vancouver Island coverage text | BC→Washington SPA component | Keep |
| Destination scope | Washington State, with Seattle/Bellevue examples and surrounding areas | BC→Washington SPA component | Keep |
| Distance representation | `~250 km`, explicitly qualified as BC to Seattle/Bellevue | Route facts block | Keep; no single province-wide distance invented |
| Transit | overnight `24–48 hrs`; standard `3–7 days` | Route facts, table, and existing approved copy | Keep |
| Pricing | USD planning estimates: `$2,150+`, `$2,700+`, `$3,100+`, `$3,700+`, `$4,500+` | Existing five-row route table and FAQ copy | Keep; no values invented |
| Cross-border process | Existing customs-documentation and border-procedure wording | BC→Washington SPA component | Keep; no new legal/customs claims introduced |
| Vehicle shipping | No route-specific claim | Current source | No addition |
| Protection wording | No stale protection/insurance wording in the settled visible route contract | Settled browser audit | Keep |
| Ferry/border timing | No new ferry or border-clearance guarantee | Current source | No addition |

## 8. Baseline component inventory

The JavaScript-disabled raw document had one H1, one quote panel, one primary form, no raw pricing/facts block, one FAQ section/heading/FAQPage with parity, one footer, one nav, one chatbot launcher, zero `.pcm-local-seo`, zero visible `undefined`, and no visible legacy heading. The SPA-settled baseline had one H1, quote, form, pricing table, Route-at-a-Glance heading, FAQ/schema, closing CTA, footer, nav, and chatbot. Step 67 recorded one rendered legacy pricing heading, which was the presentation defect.

## 9. Why route was C

The visible pricing table used the retired `Moving Cost Breakdown` presentation while the durable raw canonical and `og:url` identified the homepage. Correcting both the SPA-owned component and preserved route HTML source was more than a minor text/style cleanup, so Step 67 correctly retained C.

## 10. Structural correction

The existing five-row cross-border cost model and route-specific facts block were preserved. Only the section heading was normalized to `BC to Washington State Moving Costs`. No domestic template, duplicate section, new route, or unrelated page structure was introduced.

## 11. Form result

At 1.5 seconds, 5.5 seconds, desktop, and mobile, the single form defaults are `British Columbia` → `Washington State`. No city-only defaults were invented.

## 12. Metadata result

- Title, `og:title`, and `twitter:title`: `BC to Washington State Movers | Overnight Service | Purely Canadian Movers`.
- Brand suffix: exactly once.
- Raw canonical and settled canonical: `https://purelycanadianmovers.com/bc-to-washington-movers/`.
- Raw and settled `og:url`: the same self URL.
- Raw description is route-specific; the React SEO component also supplies its existing route-specific description after mount.

## 13. Cross-border terminology result

The settled route remains cross-border and Canada→USA specific. No domestic/interprovincial contamination, guaranteed price, guaranteed clearance, or new insurance terminology was introduced. The Step 68 settled audit reports zero legacy pricing and zero unintended `undefined`.

## 14. Customs/border-content result

Existing approved route copy was preserved. No new claims about forms, immigration status, prohibited goods, CBP/CBSA decisions, duties/taxes, customer-presence rules, or guaranteed border timing were added.

## 15. Pricing/cost architecture decision

The current durable source already supports a route-specific five-row USD estimate table. It remains one singular cost section with five rows, no pricing cards, no duplicate table, and no `Moving Cost Breakdown` heading. The figures remain estimates, not guaranteed prices.

## 16. Route at a Glance/facts result

Exactly one settled `BC–Washington Route at a Glance` remains. Its existing scoped distance qualifier, service windows, and cost range were preserved; no duplicate or fabricated province-wide fact was added.

## 17. Main content result

BC pickup coverage, Washington delivery context, corporate/tech relocation context, customs coordination, and the existing corridor workflow remain intact. No Toronto, Calgary, Edmonton, Montreal, Ottawa, Halifax, Winnipeg, or Victoria route contamination was introduced.

## 18. Related-destination result

The target contains no `Related Destinations` block and no link to the nonexistent reverse route. Existing global navigation/footer links were preserved. Seattle ↔ Vancouver route pages were untouched.

## 19. FAQ result

Raw and settled results each have exactly one visible FAQ section, one FAQ heading, one FAQPage schema, exact visible/schema question-answer-order parity, and zero `.pcm-local-seo`. The existing declared runtime briefly passes through its pre-settlement React commit before the route FAQ finalizer restores the canonical raw FAQ; by 1.5 seconds and through 5.5 seconds the contract is singular and stable. Global result: 56/56 canonical raw and rendered.

## 20. Typography result

- Body/forms/buttons: Source Sans 3.
- Headings: Playfair Display.
- Desktop H1: `48px / 60px / 700`.
- Mobile H1: `36px / 45px / 700`.
- No global font change was made.

## 21. Navigation result

The existing React navigation family remains singular. Mobile `aria-expanded` changes `false → true → false`, Escape closes the menu and restores state, and no duplicate navigation was introduced.

## 22. Chatbot result

Exactly one settled launcher/panel remains. Desktop and mobile open/close checks passed, with no clipping or duplicate initialization. The regression recognizes the broad BC→Washington route and form identity.

## 23. Source durability/idempotency

- Direct owner first run: expected target HTML plus one compiled asset change from the Step 67 baseline.
- Direct owner second run: 0 route changes, 0 asset changes.
- Route-specific owner normalization rerun: byte-identical; no separate target finalizer is declared.
- FAQ finalizer: 0 route changes, 0 asset changes.
- Title normalizer: 0 route changes, 0 asset changes.
- Focused owner test reconstructs the legacy state, normalizes it once, and proves a byte-identical second run.

## 24. Raw contract result

One H1, one quote panel, one primary form, one FAQ section/heading/FAQPage, exact FAQ parity, one footer/nav/chat launcher, zero `.pcm-local-seo`, zero unintended `undefined`, and zero legacy `Moving Cost Breakdown`. Pricing and Route-at-a-Glance are SPA component content and therefore appear in the rendered contract, not the JavaScript-disabled raw snapshot.

## 25. Delayed runtime result

At 1.5 seconds and 5.5 seconds the H1, broad form defaults, single pricing table, single facts block, single FAQ, title, self canonical, and self `og:url` are stable. There is no homepage replacement, soft 404, duplicate content return, or page error.

## 26. Desktop/mobile QA

Exact viewports tested: `1280 × 900` and `390 × 844`. Both have no horizontal overflow; quote, cost table, facts, FAQ, nav, and chatbot fit and work. No app page error occurred. One environment-level blocked external resource message was observed under the restricted test network; it did not originate from app JavaScript or affect layout/behavior.

## 27. Updated classification

`/bc-to-washington-movers/ = A — Canonical`.

Updated totals: A = 48, B = 8, C = 0, D = 0.

## 28. Confirmation C queue reached zero or not

Confirmed: C reached **0/56**.

## 29. Confirmation D remains zero

Confirmed: D remains **0/56**. Ownership/render declarations still agree and both aggregate passes converge from the first run.

## 30. Global FAQ/title results

- Titles: raw and rendered **56/56 canonical**, zero page errors.
- FAQ: raw and rendered **56/56 canonical**, zero page errors.
- `.pcm-local-seo`: 0/56 raw and rendered.
- Unintended visible `undefined`: 0/56 raw and rendered.
- Rendered legacy `Moving Cost Breakdown`: 0/56.

## 31. Ownership/tests

- Ownership/architecture validator: PASS — 56 routes, 56 owners, zero collisions.
- Full ownership/title/chatbot suite: **36/36 PASS** (the Step 67 baseline was 35/35; Step 68 added one focused test).

## 32. Syntax

All current tool `.mjs` files: **128/128 PASS** (one new Step 68 audit file accounts for the increase from 127).

## 33. Browser regression

Expanded deduplicated regression: **54/54 PASS**. The prior 53 routes remain covered exactly once, and BC→Washington is now explicitly covered as the 54th route with province/state expectations.

## 34. Aggregate pass 1

Fresh no-hardlink clone overlaid with the corrected `site-copy`, `tools`, and package manifest:

- **0/56 route drift**.
- **0/104 asset drift**.

The mandatory first-pass gate passed; no reconciliation was needed.

## 35. Aggregate pass 2

Second aggregate in the same qualifying clone:

- **0/56 route drift**.
- **0/104 asset drift**.

## 36. Working-tree isolation

Comparing the Step 68 pre-edit baseline with the final workspace finds exactly one registered route change (`/bc-to-washington-movers/`) and one asset change (`assets/index-CNBNs70h.js`). Comparing the original workspace immediately before and after both clone-only aggregate passes finds 0 route and 0 asset changes. Seattle ↔ Vancouver route HTML remained byte-identical.

## 37. Remaining known issues

The eight Step 67 B routes remain outside Step 68 scope. No C or D route remains. No deployment occurred, and Step 69 was not started.

Step 68 is complete.
