# Step 34 — Edmonton ↔ Winnipeg Route Standardization

## 1. Files changed

- `site-copy/edmonton-to-winnipeg-movers/index.html`
- `site-copy/winnipeg-to-edmonton-movers/index.html`
- `site-copy/assets/step34-edmonton-winnipeg.css`
- `site-copy/assets/step34-edmonton-winnipeg.js`
- `tools/templates/edmonton-winnipeg-routes/edmonton-to-winnipeg-movers.html`
- `tools/templates/edmonton-winnipeg-routes/winnipeg-to-edmonton-movers.html`
- `tools/rebuild-edmonton-winnipeg-routes.mjs`
- `tools/audit-step34-edmonton-winnipeg.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `docs/ROUTE_PAGE_OWNERSHIP.md`
- `docs/STEP_34_EDMONTON_WINNIPEG_REPORT.md`

No compiled React bundle, shared conversion runtime, shared static-navigation/chat asset, or unrelated route HTML was changed.

## 2. Edmonton → Winnipeg changes

The settled page now follows the canonical order: quote panel, pricing, static header/navigation, hero, trust strip, consolidated main route content with Route at a Glance, FAQ, related resources, closing CTA, and footer. Edmonton pickup, Alberta winter access, prairie-corridor, Winnipeg delivery, apartment/elevator, and route-specific FAQ content remain directional.

## 3. Winnipeg → Edmonton changes

The reverse route received the same presentation standard while retaining Winnipeg pickup and snow-route access, prairie/weather planning, Edmonton delivery and winter access, apartment/elevator details, and its directional FAQ wording.

## 4. Confirmed ownership/render architecture

Both routes remain static and are solely owned by `rebuild-edmonton-winnipeg-routes.mjs`. Their only aggregate post-processors are the FAQ architecture and title metadata finalizers. There is no React bootstrap. Static navigation and chatbot assets remain the legitimate architecture; Step 34 adds only path-gated pair presentation assets.

The pre-edit raw and settled baseline agreed with the registry: static render, no React bootstrap, one H1, one quote panel, one pricing section/table with five rows, one Route at a Glance, one FAQ section/heading/`FAQPage`, exact FAQ parity, zero `.pcm-local-seo`, one footer, one static chat launcher, correct directional form values, and matching raw/settled title, OG title, Twitter title, description, canonical, and OG URL. Each quote panel had five trust pills, pricing followed the hero/glance rather than the quote, and the static mobile trigger stayed `aria-expanded=false` while open and did not close on Escape; those presentation/behavior defects were corrected by the pair-scoped Step 34 assets.

## 5. Pre-fix first-pass aggregate drift reproduced

In a history-preserving temporary Git copy:

| Route | Baseline SHA-256 | First aggregate SHA-256 | Second aggregate SHA-256 |
| --- | --- | --- | --- |
| Edmonton → Winnipeg | `C43FF0A8DAE5A674D97BE890B9617F5AF0BDB3E8BD8364629FD4BA88829D4368` | `4F369D20186298D6BDE713387C98FE560F15129FD3EF47AC39CD75CF85B2F8AA` | `4F369D20186298D6BDE713387C98FE560F15129FD3EF47AC39CD75CF85B2F8AA` |
| Winnipeg → Edmonton | `234BD9FF76F2FC9FB77E1312B1EC5FF09CF77DE32253BF2FF054D3E7F0A9FE90` | `70AB2AB4169E8844FD7B784CF5269C242C9BE62C3AC26BBE0C6014C6FFDAAD0A` | `70AB2AB4169E8844FD7B784CF5269C242C9BE62C3AC26BBE0C6014C6FFDAAD0A` |

The exact baseline-to-first diff in each direction was removal of one 14,890-byte inline Sonner/toast stylesheet. File size dropped from 68,074 to 53,184 UTF-8 bytes. First-to-second diff was empty.

## 6. Exact cause of that first-pass drift

The checked-in pair contained stale browser-injected Sonner CSS. The authoritative generator did not encode that block and rebuilt both pages by consuming the mutable generated `/vancouver-to-toronto-movers/` HTML. The current upstream route no longer contained the injected style, so the first aggregate removed it and the second aggregate was stable. This was stale checked-in output combined with an unsafe cross-route source dependency, not FAQ, title, timing, or ownership drift.

## 7. Exact fix eliminating first-pass drift

The owner now reads complete explicit sources under `tools/templates/edmonton-winnipeg-routes/`, validates their title/canonical/route marker, injects only pair-scoped Step 34 assets at stable locations, and never reads another route page. The checked-in outputs were regenerated once from this authority.

## 8. Authoritative route facts

Both directions retain 1,300 km, 3–11 days, Studio $2,300+, 1-bedroom $3,200+, 2-bedroom $5,100+, 3-bedroom $8,200+, 4+ bedroom $12,000+, and the overall $2,300–$12,000+ planning range.

## 9. Route fact corrections

No numeric route facts changed. The Edmonton-origin meta description grammar was corrected from “Plan a Edmonton” to “Plan an Edmonton.” Direction-specific logistics were corrected so Winnipeg → Edmonton no longer describes its origin as an Alberta departure.

## 10. Directional form result

- Edmonton → Winnipeg: `Edmonton, AB` → `Winnipeg, MB`
- Winnipeg → Edmonton: `Winnipeg, MB` → `Edmonton, AB`

The actual values remain correct after settled runtime initialization.

## 11. Title/OG/Twitter result

Raw and settled title, `og:title`, and `twitter:title` match in each direction and contain one terminal `Purely Canadian Movers` suffix. Route-specific descriptions, self-canonicals, and self `og:url` values are retained.

## 12. FAQ/schema result

Each route has one FAQ section, one FAQ heading, one implementation, one `FAQPage`, exact visible/schema question-answer-order parity, and zero `.pcm-local-seo`. The eight established directional FAQs were preserved.

## 13. Typography result

Computed desktop H1 is Playfair Display 48/60/700; mobile is 36/45/700. Body, quote form, and buttons use Source Sans 3. Main headings, FAQ questions, glance values, and pricing use the canonical families and scale.

## 14. Quote-panel result

Each route has one canonical 1120px shell with a red left accent, 8px radius, canonical shadow, two-column desktop and one-column mobile layout, six trust pills, written-estimate treatment, verified-company details, and the correct directional heading.

## 15. Pricing result

Each route has one pricing section and one 5-row table immediately after the quote panel. The table has a 760px minimum width and internal mobile scrolling. It uses the canonical directional heading, planning-range disclaimer, and Declared Value Protection terminology; legacy pricing output is removed after normalization.

## 16. Route at a Glance result

Each direction has one card with 1,300 km, 3–11 days, and $2,300–$12,000+. It renders as three desktop columns and one mobile column.

## 17. Main-content result

The former oversized alternating section stack is consolidated to the canonical 896px content width and rhythm. Directional pickup/delivery, prairie highway and winter weather, apartment/elevator, proof, process, and testimonial content are preserved without making the two directions textually identical.

## 18. Navigation result

Static navigation remains in place with no React or duplicate header. Desktop dropdown opening passed. At 390×844 the mobile menu opens, closes with Escape, and reports `aria-expanded=false → true → false`.

## 19. Chatbot result

Each route has one static launcher and one panel. Open/close passed at desktop and mobile sizes with no React/static duplication.

## 20. Post-footer contamination result

Each route has one footer, no post-footer FAQ, zero `.pcm-local-seo`, no duplicate conversion block, no homepage body, no React 404, no stale promotion, and no visible `undefined`.

## 21. Source/generator durability

Direct owner generation reproduces both files. A second direct owner run changes zero bytes. The FAQ and metadata contracts survive, no mutable generated route is consumed, and the pair is stable on the first complete aggregate.

## 22. Desktop/mobile QA

Exact 1280×900 and 390×844 viewports were tested. There is no page-level horizontal overflow, broken image, clipped core control, or incorrect stacking. Quote and glance grids stack on mobile; pricing scrolls only inside its wrapper. The only console entry is the established sandbox-blocked external analytics/pixel request (`ERR_NETWORK_ACCESS_DENIED`).

## 23. Global FAQ/title/hydration regression result

FAQ: 55/55 completed browser loads pass; Victoria → Vancouver again timed out during navigation, while its raw document passes one section/heading/schema, exact parity, and zero `.pcm-local-seo`, for a combined 56/56 contract result. Title: raw tests pass 56/56 and all 55 completed settled loads pass; the same Victoria → Vancouver browser timeout remains. The requested 24-route settled body regression set passes route identity, directional defaults, titles, pricing, navigation/chat, zero local SEO, and no homepage/404 replacement.

## 24. Ownership validation

PASS: 56 routes, exactly one full-page owner each, zero collisions. Ownership/title tests pass 18/18 combined; JavaScript syntax and aggregate ownership validation pass.

## 25. First aggregate convergence result

PASS: 0/56 route drift, zero shared title-writer drift, and zero pair/static navigation/chat/conversion-style asset drift from the updated working-tree baseline.

## 26. Second aggregate convergence result

PASS: 0/56 route drift, zero shared title-writer drift, and zero pair/static navigation/chat/conversion-style asset drift.

## 27. Regression result

All 24 requested regression routes pass the settled regression audit. No hydration/body regression was found.

## 28. Working-tree route isolation

Only `site-copy/edmonton-to-winnipeg-movers/index.html` and `site-copy/winnipeg-to-edmonton-movers/index.html` were written among the 56 route HTML files during Step 34. The final temporary-copy aggregate changed none of the 56 route files, and no aggregate output was copied back.

## 29. Remaining known issues

- The pre-existing Victoria → Vancouver browser-harness timeout remains; raw FAQ/title contracts pass.
- Local browser QA blocks one external analytics/pixel request because network access is disabled; no application or route-asset error was found.

Step 34 is complete. No deployment was performed, and Step 35 was not started.
