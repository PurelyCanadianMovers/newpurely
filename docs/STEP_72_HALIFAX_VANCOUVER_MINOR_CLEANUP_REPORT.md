# Step 72 — Halifax ↔ Vancouver minor cleanup

Scope was limited to `/halifax-to-vancouver-movers/` and validation of `/vancouver-to-halifax-movers/`. No deployment occurred and Step 73 was not started.

## 1. Step 71 defect confirmed

| Route | Step 71 Class | Exact Defect | Owner | Expected Fix Scope |
| --- | --- | --- | --- | --- |
| `/halifax-to-vancouver-movers/` | B — Minor cleanup | Raw canonical pointed to `/vancouver-to-halifax-movers/` although the route identity and `og:url` were correct | `rebuild-halifax-vancouver-routes.mjs` | Direction-scoped canonical generation match |
| `/vancouver-to-halifax-movers/` | A — Canonical | None | `rebuild-halifax-vancouver-routes.mjs` | Validation only; preserve bytes |

Step 71 also recorded canonical typography, spacing/width, quote panel, pricing, Route at a Glance, FAQ, form, terminology, navigation, chatbot, and source durability for both directions. No other defect was confirmed.

## 2. Files changed

Production/source changes are limited to:

- `tools/rebuild-halifax-vancouver-routes.mjs`
- `site-copy/halifax-to-vancouver-movers/index.html`

`site-copy/vancouver-to-halifax-movers/index.html` remained byte-identical. Step 72 JSON/hash evidence, `STEP_72_STATIC_VERIFY.mjs`, this report, and the isolated clone under `tmp/step72-aggregate-clone-20260909` are non-production evidence.

## 3. Ownership/render architecture

Registry and writer manifest agree for both routes: the sole full-page owner is `rebuild-halifax-vancouver-routes.mjs`, owner type is full-page generator, declared render is static, and actual HTML is static. Neither route contains a React module bootstrap. Architecture gate: PASS.

The registered runtime chain remains `conversion-boost.js`, `step43-halifax-vancouver.js`, `static-nav.js`, and `static-chat.js`; styles remain `conversion-boost.css`, `step43-halifax-vancouver.css`, `static-nav.css`, and `static-chat.css`. Global bounded post-processors remain the FAQ finalizer and title normalizer. Navigation, chatbot, and conversion architecture were not changed.

## 4. Durable source chain

The checked-in durable chain is:

`tools/templates/hydration-static-routes/vancouver-to-halifax-movers.html` → explicit frozen facts and direction-specific route data held in `tools/rebuild-halifax-vancouver-routes.mjs` → the two static route HTML outputs → global FAQ/title post-processors.

Pair-scoped Step 43 CSS/JS remain presentation/runtime dependencies. No generated route page is used as mutable source. There is no separate pair route finalizer registered for these routes.

## 5. Authoritative facts preserved

Durable source, both pricing tables, both Route at a Glance sections, FAQ/schema, and body copy agree on the approved facts: over 3,700 km; 10–27 days; Studio $2,700+; 1-bedroom $4,400+; 2-bedroom $7,300+; 3-bedroom $12,000+; 4+ bedroom $18,000+; overall $2,700+–$18,000+.

The cost guide contains the same five prices in both directions. Deterministic pricing/chatbot tests passed. No external research was used and no fact changed.

## 6. Exact minor defect before

The durable template canonical tag is `<link rel="canonical" id="canonical-tag" href="…">`. The owner regex required `href` to immediately follow `rel="canonical"`; the intervening `id` prevented a match. Halifax → Vancouver therefore inherited the reverse template canonical while its title, description, `og:url`, H1, form, and body remained directional.

## 7. Exact correction

The owner now locates the canonical link by a lookahead for `rel="canonical"` and replaces its `href` regardless of intervening attributes. Final raw canonicals are self-directional and equal their respective `og:url` values. No SEO copy was rewritten.

## 8. Typography result

PASS, unchanged. Computed headings use Playfair Display; body/forms/pricing/FAQ/buttons/CTA use Source Sans 3. H1 is 48px / 60px / 700 at 1280×900 and 36px / 45px / 700 at 390×844.

## 9. Spacing/width result

PASS, unchanged. The quote/pricing outer treatment remains approximately 1120px (the quote inner is 1080px plus outer padding), main content 896px, FAQ 768px, and the approved constrained hero treatment remains intact. Red-accent quote/pricing presentation, responsive quote/glance stacking, and internal mobile pricing scroll remain canonical.

## 10. Form result

PASS at raw/initial, 1.2 seconds, and 5.4 seconds. Halifax → Vancouver remains `Halifax, NS` → `Vancouver, BC`; Vancouver → Halifax remains `Vancouver, BC` → `Halifax, NS`. Values did not revert to placeholders.

## 11. Metadata result

PASS. Each route has one route-specific title with `| Purely Canadian Movers` exactly once; `og:title` and `twitter:title` match it; descriptions remain route-specific; canonical and `og:url` are now self-directional. Halifax → Vancouver is `https://purelycanadianmovers.com/halifax-to-vancouver-movers/`; the reverse remains `https://purelycanadianmovers.com/vancouver-to-halifax-movers/`.

## 12. Pricing result

PASS. Each route has one pricing section, one five-row table, approved values, planning-range/written-estimate language, no duplicate or stale cards, no `Moving Cost Breakdown`, and internal scroll on the 390px mobile viewport.

## 13. Route at a Glance result

PASS. Each route has exactly one Route at a Glance with distance, transit, and cost range only. Desktop is three columns; mobile stacks to one column. No unsupported fact was added.

## 14. FAQ result

PASS. Each route has one FAQ section, one FAQ heading, one FAQPage entity, exact visible/schema question-answer parity and order, and zero `.pcm-local-seo`. Global raw/rendered FAQ audit is 56/56 canonical.

## 15. Terminology result

PASS. The pair uses Declared Value Protection, carrier-liability, planning-range, written-estimate, cross-country, and interprovincial wording. No fully-insured claim, guaranteed long-distance price, guaranteed delivery promise, or stale promotion was found.

## 16. Contamination result

PASS. Main route content contains no unintended Toronto, Calgary, Edmonton, Montreal, Ottawa, Winnipeg, Victoria, or Seattle references. Both routes contain zero visible `undefined`, zero `.pcm-local-seo`, no duplicate pricing/glance/FAQ, no homepage/soft-404 signature, no expired promotion, and no legacy cost block. The 56-route rendered sweep also found zero contamination issues and zero page errors.

## 17. Structure preservation

PASS. Static verification confirms the existing order remains quote panel, pricing, header/hero, trust strip, main content, Route at a Glance, FAQ, related destinations, closing CTA, and footer. No section was rebuilt or redesigned.

## 18. Idempotency

Baseline → first direct owner run changed only Halifax → Vancouver. Second owner run: zero route and asset changes. Pair route finalizer: not applicable because none is registered. FAQ finalizer: zero-byte change. Title normalizer: zero-byte change. Vancouver → Halifax stayed byte-identical throughout.

## 19. Delayed-runtime result

PASS at raw, initial DOM, 1.2 seconds, and 5.4 seconds. H1, title, directional form values, singular pricing/glance/FAQ counts, FAQ parity, and route identity stayed stable. No legacy component returned; no homepage replacement or soft 404 occurred.

## 20. Desktop/mobile QA

PASS at 1280×900 and 390×844. No document overflow, broken images, floating-control overlap, or clipped chat panel was found. Desktop navigation opens; mobile menu state is false → true → false after Escape. Chat opens, fits the viewport, and closes. Quote/glance responsive behavior and pricing internal scroll pass. There were zero page/application exceptions; the harness recorded only the pre-existing restricted-environment external-resource message `net::ERR_NETWORK_ACCESS_DENIED`, not an application runtime failure.

## 21. Updated A/B/C/D classification

Reapplying the Step 71 defect criteria yields Halifax → Vancouver = A and Vancouver → Halifax = A. The pair is complete. Global route counts are now A 51/56, B 5/56, C 0/56, D 0/56; group counts are 26 complete and 3 minor cleanup.

## 22. Global title/FAQ results

Titles: raw 56/56 canonical and rendered 56/56 canonical, with zero issues. FAQ: raw 56/56 canonical and rendered 56/56 canonical, with exact parity/order and zero page errors.

## 23. Confirmation C=0 and D=0

Confirmed. C remains 0 and D remains 0. The change repairs a bounded metadata/source-durability defect without altering ownership or architecture.

## 24. Ownership/tests

Ownership/architecture validator: PASS — 56 registered routes, 56 owners, zero collisions. Three test files ran 36 tests: 36 passed, 0 failed, skipped, cancelled, or todo.

## 25. Syntax

All 128 current tool modules pass `node --check`: 128/128, zero failures. The Step 72 evidence-only verifier is outside that production-tools count and also executed successfully.

## 26. Browser regression

Current deduplicated browser regression attempted 54 routes and passed 54/54 with zero failures. Both Halifax ↔ Vancouver directions are included.

## 27. Aggregate pass 1

A fresh no-hardlink clone was created at `tmp/step72-aggregate-clone-20260909` and overlaid with the exact current `site-copy`, `tools`, and `package.json`. Clone baseline matched the working baseline. First aggregate result: **0/56 route drift and 0/104 asset drift**.

## 28. Aggregate pass 2

Second aggregate result: **0/56 route drift and 0/104 asset drift**. Passes one and two match the corrected working tree.

## 29. Working-tree isolation

Final route hash comparison against the Step 72 pre-edit baseline shows exactly one changed route HTML file: `/halifax-to-vancouver-movers/`. `/vancouver-to-halifax-movers/` and the other 54 routes are unchanged. Asset drift is 0/104. The only production source change is the pair owner regex described above.

## 30. Remaining known issues

No known issue remains for Halifax ↔ Vancouver. Outside Step 72 scope, the five previously reported B routes remain: Calgary ↔ Halifax mobile Escape/ARIA behavior, Vancouver ↔ Winnipeg computed body font, and Victoria → Ottawa mobile ARIA/Escape behavior. No deployment occurred. Step 73 was not begun.

Step 72 is complete.
