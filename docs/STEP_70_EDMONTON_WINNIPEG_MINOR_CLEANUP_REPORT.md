# Step 70 — Edmonton ↔ Winnipeg minor cleanup

Scope was limited to `/edmonton-to-winnipeg-movers/` and `/winnipeg-to-edmonton-movers/`. No deployment occurred, and Step 71 was not started.

## 1. Step 69 defect confirmed

| Route | Step 69 Class | Exact Defect | Owner | Expected Fix Scope |
| --- | --- | --- | --- | --- |
| `/edmonton-to-winnipeg-movers/` | B — Minor cleanup | One settled visible `fully insured` claim | `rebuild-edmonton-winnipeg-routes.mjs` | Pair-owner protection terminology only |
| `/winnipeg-to-edmonton-movers/` | B — Minor cleanup | One settled visible `fully insured` claim | `rebuild-edmonton-winnipeg-routes.mjs` | Pair-owner protection terminology only |

Step 69 also confirmed static rendering, canonical typography, one of every required component, canonical metadata, settled directional form defaults, canonical pricing/glance/FAQ, and a deterministic durable source chain. No other defect was assigned to this pair.

## 2. Files changed

Production/source files changed by Step 70:

- `tools/rebuild-edmonton-winnipeg-routes.mjs`
- `site-copy/edmonton-to-winnipeg-movers/index.html`
- `site-copy/winnipeg-to-edmonton-movers/index.html`

No asset changed. This report and the `STEP_70_*.json` audit/hash artifacts are validation evidence only. The isolated aggregate ran in `tmp/step70-aggregate-clone-20260909`.

## 3. Ownership/render architecture

Both routes remain owned by the full-page generator `rebuild-edmonton-winnipeg-routes.mjs`. Declared render is `static`; actual HTML has the static route marker and no module/React bootstrap. The ownership/architecture validator passed with 56 registered routes, 56 owners, and zero collisions. Navigation remains `static-nav`; chatbot remains `static-chat`; no architecture exception applies.

## 4. Durable source chain

The chain remains: pair templates under `tools/templates/edmonton-winnipeg-routes` + frozen `tools/edmonton-winnipeg-route-data.mjs` → pair owner → checked-in route HTML → pair runtime `step34-edmonton-winnipeg.js`/CSS → FAQ finalizer → title normalizer. The pair owner now removes the unsupported phrase at its deterministic render boundary. The conversion form remains template-owned and is stabilized by the pair runtime; only shared `conversion-boost.css` is registered, not the shared conversion JavaScript.

## 5. Authoritative facts preserved

Both directions retain approximately **1,300 km**, **3–11 days**, Studio **$2,300+**, 1-bedroom **$3,200+**, 2-bedroom **$5,100+**, 3-bedroom **$8,200+**, 4+ bedroom **$12,000+**, and overall **$2,300–$12,000+**. Durable route data, settled pricing, Route at a Glance, FAQ/schema, and body references agree. No external research was used.

## 6. Exact minor defect before

Each settled hero contained one visible `fully insured` claim. The checked-in source templates contained the same stale wording in the hero and in a legacy main-content paragraph that the pair runtime replaces.

## 7. Exact correction

The pair owner now renders the hero as professional long-distance moving with **Declared Value Protection options** and renders the legacy reverse-direction sentence as professional service with **Declared Value Protection options**. Post-generation raw HTML and the initial, 1.5-second, and 5.5-second DOM snapshots contain zero `fully insured` occurrences in both directions.

## 8. Typography result

Unchanged and canonical: Playfair Display headings; Source Sans 3 body, FAQ answers, pricing, forms, buttons, and CTA. H1 is `48px / 60px / 700` at 1280×900 and `36px / 45px / 700` at 390×844.

## 9. Spacing/width result

Unchanged and canonical: quote/pricing shell 1120px, main content 896px, FAQ approximately 768px, hero text approximately 672px, existing red-accent pricing treatment, and responsive stacking at the existing breakpoints.

## 10. Form result

Raw and rendered values remain directional. Edmonton → Winnipeg settles to `Edmonton, AB` → `Winnipeg, MB`; Winnipeg → Edmonton settles to `Winnipeg, MB` → `Edmonton, AB`. Values were stable at initial DOM, 1.5 seconds, and 5.5 seconds.

## 11. Metadata result

Both routes retain route-specific descriptions, self canonicals, correct OG URLs, and matching title/OG/Twitter title values. `| Purely Canadian Movers` occurs exactly once. No SEO copy was rewritten.

## 12. Pricing result

Each route has exactly one pricing section and one five-row pricing table. All approved figures remain unchanged; `Moving Cost Breakdown` is absent; no duplicate pricing exists. At 390px the 760px table scrolls inside its 318px wrapper without document overflow.

## 13. Route at a Glance result

Each route has exactly one glance block with `1,300 km`, `3–11 days`, and `$2,300–$12,000+`. Presentation and responsive stacking are unchanged.

## 14. FAQ result

Raw and settled target results remain one FAQ section, one FAQ heading, one FAQPage entity, and exact visible/schema question-answer-order parity. Global raw and settled FAQ audits are 56/56 canonical. Settled `.pcm-local-seo` count is zero.

## 15. Terminology result

The confirmed `fully insured` defect is removed. Current route content uses basic carrier liability and Declared Value Protection wording, written-estimate/planning language, and accurate interprovincial long-distance terminology. No guaranteed-pricing or unsupported timing promise was introduced.

## 16. Contamination result

The settled route body, excluding legitimate related-destination/navigation/footer areas, contains zero unintended Toronto, Vancouver, Calgary, Montreal, Ottawa, Halifax, Victoria, or Seattle references. It also contains zero `undefined`, legacy cost blocks, homepage replacement, duplicate FAQ/glance/pricing, expired promotion, or soft-404 content.

## 17. Structure preservation

The approved order remains quote panel, pricing, hero, trust strip, main content, Route at a Glance, FAQ, related destinations, closing CTA, and footer. No section was redesigned or rebuilt.

## 18. Idempotency

Direct owner run 1 produced the intended two route changes. Direct owner run 2 produced 0/56 route drift and 0/104 asset drift. No separate route-specific finalizer is registered for this pair. The FAQ finalizer and title normalizer each produced 0/56 route drift and 0/104 asset drift.

## 19. Delayed-runtime result

Raw, initial DOM, 1.5-second, and 5.5-second checks were stable: one H1, correct directional form values, one pricing block, one glance, one FAQ, stable title, and zero `fully insured`. No legacy component returned, and no homepage replacement or soft 404 occurred.

## 20. Desktop/mobile QA

At 1280×900 and 390×844, both routes have no horizontal overflow, canonical fonts, responsive quote/glance layout, internal mobile pricing scroll, one FAQ, working desktop navigation, mobile menu state `false → true → false` with Escape closure, and a working chatbot. No clipped controls or application/page errors occurred. A restricted-network external-resource console message appeared in the shorter target run and did not originate from application JavaScript or affect content or interaction.

## 21. Updated A/B/C/D classification

Edmonton → Winnipeg is **A — Canonical**. Winnipeg → Edmonton is **A — Canonical**. The pair is complete. Global classification is now **50 A, 6 B, 0 C, 0 D**; group rollup is **25 complete, 4 minor cleanup, 0 material, 0 source repair**.

## 22. Global title/FAQ results

Titles: raw/rendered **56/56 canonical**. FAQ: raw/rendered **56/56 canonical**, including one section, one heading, one FAQPage, and exact parity/order. Raw-visible and rendered `.pcm-local-seo` are zero; unintended visible `undefined` is zero.

## 23. Confirmation C=0 and D=0

Confirmed: **C = 0** and **D = 0**. The six remaining B routes are the unchanged Step 69 items outside this pair.

## 24. Ownership/tests

Ownership/architecture validation: PASS — **56 routes, 56 owners, zero collisions**. Ownership, title-normalizer, and chatbot-pricing tests: **36/36 passed**.

## 25. Syntax

All current tool modules pass syntax checks: **128/128**, zero failures.

## 26. Browser regression

Current deduplicated regression: **54 attempted, 54 passed, 0 failed**. Both Edmonton ↔ Winnipeg directions are included.

## 27. Aggregate pass 1

A fresh no-hardlink Git clone was overlaid with the exact corrected `site-copy`, `tools`, and `package.json`. Its pre-run route/asset hashes matched the corrected working tree. Aggregate pass 1 produced **0/56 route drift** and **0/104 asset drift**.

## 28. Aggregate pass 2

The aggregate ran again in the same qualifying clone and produced **0/56 route drift** and **0/104 asset drift**.

## 29. Working-tree isolation

Comparing `STEP_70_BASELINE.json` with the corrected `STEP_70_AGGREGATE_BASELINE.json`, exactly two registered route HTML files changed: `/edmonton-to-winnipeg-movers/` and `/winnipeg-to-edmonton-movers/`. Asset changes: **0/104**. The narrow pair-owner source change and Step 70 report/evidence files are the only Step 70 source/report additions; pre-existing dirty-worktree changes were preserved.

## 30. Remaining known issues

Six unrelated B routes remain exactly as assigned by Step 69: Calgary ↔ Halifax mobile Escape/ARIA behavior; Halifax → Vancouver reverse raw canonical; Vancouver ↔ Winnipeg body font; and Victoria → Ottawa mobile ARIA/Escape behavior. No Edmonton ↔ Winnipeg defect remains.

Step 70 is complete.
