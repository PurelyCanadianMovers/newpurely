# Step 44 — Calgary ↔ Winnipeg Standardization

## 1. Files changed

Step 44 changed the two target pages and the pair-owned implementation: `site-copy/calgary-to-winnipeg-movers/index.html`, `site-copy/winnipeg-to-calgary-movers/index.html`, `site-copy/assets/step44-calgary-winnipeg.css`, `site-copy/assets/step44-calgary-winnipeg.js`, `tools/rebuild-calgary-winnipeg-routes.mjs`, `tools/calgary-winnipeg-route-data.mjs`, and `tools/templates/calgary-winnipeg-routes/canonical-static-shell.html`.

It also updated the ownership/verification surface: `tools/route-page-ownership.mjs`, `tools/route-writer-manifest.mjs`, `tools/route-page-ownership.test.mjs`, `tools/audit-step44-calgary-winnipeg.mjs`, `tools/audit-step33-regressions.mjs`, and `docs/ROUTE_PAGE_OWNERSHIP.md`. The shared `site-copy/assets/conversion-boost.js` change is explicitly limited to the Calgary ↔ Winnipeg fallback data and terminology. Step 44 evidence is stored in the `STEP_44_*.json` files beside this report.

## 2. Calgary → Winnipeg changes

The page now follows the Montreal → Edmonton canonical presentation: hero, trust strip, one canonical quote panel, one five-row pricing table, directional main content, one Route at a Glance, one FAQ, related destinations, CTA, and one footer. It retains Calgary pickup/access and Alberta-origin planning, eastbound Prairie-corridor and winter scheduling, and Winnipeg delivery, apartment, elevator, and loading considerations.

Raw inventory: title `Calgary to Winnipeg Movers | Cost, Transit Time & Estimate | Purely Canadian Movers`; H1 `Calgary to Winnipeg Movers`; one H1, quote panel, primary form, pricing section, pricing table, glance, FAQ heading, `FAQPage`, and footer; zero `.pcm-local-seo` and zero `undefined`.

## 3. Winnipeg → Calgary changes

The reverse page uses the same canonical structure while retaining distinct Winnipeg pickup/access and Manitoba-origin planning, westbound Prairie-corridor and winter scheduling, and Calgary delivery, condo, elevator, and loading considerations.

Raw inventory: title `Winnipeg to Calgary Movers | Cost, Transit Time & Estimate | Purely Canadian Movers`; H1 `Winnipeg to Calgary Movers`; one H1, quote panel, primary form, pricing section, pricing table, glance, FAQ heading, `FAQPage`, and footer; zero `.pcm-local-seo` and zero `undefined`.

## 4. Confirmed owner/render architecture

| Route | Registry Owner | Declared Render | Actual Render | React Support | Nav | Chat |
|---|---|---|---|---|---|---|
| Calgary → Winnipeg | `rebuild-calgary-winnipeg-routes.mjs` | Static | Static at raw, early, and settled states | None; bootstrap absent | `static-nav` + pair behavior | `static-chat` |
| Winnipeg → Calgary | `rebuild-calgary-winnipeg-routes.mjs` | Static | Static at raw, early, and settled states | None; bootstrap absent | `static-nav` + pair behavior | `static-chat` |

Both register `conversion-boost` plus the pair CSS/JS. The pre-edit ownership gate found no conflict, so standardization proceeded.

## 5. Full durable source/data chain

`route-page-ownership.mjs` assigns both pages to `rebuild-calgary-winnipeg-routes.mjs`. The owner validates `calgary-winnipeg-route-data.mjs`, renders it through the frozen pair-owned `canonical-static-shell.html`, writes the two HTML files, and asserts the structural, metadata, fact, FAQ, form, architecture, and contamination contracts. `route-writer-manifest.mjs` records the same owner and static architecture. Global title and FAQ normalizers remain registered aggregate post-processors; they do not own these pages.

`cost-guide-popular-routes.mjs` and the chatbot route data in `src/index.js` independently corroborate the pair facts. `conversion-boost.js` contains a pair-scoped defensive fallback using the same values. Winnipeg modern-route infrastructure does not own this pair. The former runtime dependency on a historical Git copy of another route was removed; no mutable cross-route HTML or Git-history dependency remains.

## 6. Authoritative route facts

| Fact | Calgary → Winnipeg | Winnipeg → Calgary | Winning Source |
|---|---:|---:|---|
| Distance | approximately 1,320 km | approximately 1,320 km | validated pair data; corroborated by cost guide and chatbot data |
| Transit | 3–11 days | 3–11 days | validated pair data; corroborated by cost guide and chatbot data |
| Studio | $2,300+ | $2,300+ | validated pair data; corroborated by cost guide and chatbot data |
| 1-bedroom | $3,200+ | $3,200+ | validated pair data; corroborated by cost guide and chatbot data |
| 2-bedroom | $5,100+ | $5,100+ | validated pair data; corroborated by cost guide and chatbot data |
| 3-bedroom | $8,200+ | $8,200+ | validated pair data; corroborated by cost guide and chatbot data |
| 4+ bedroom | $12,000+ | $12,000+ | validated pair data; corroborated by cost guide and chatbot data |
| Overall range | $2,300–$12,000+ | $2,300–$12,000+ | derived from the validated five-row table |

## 7. Route-fact corrections, if any

No authoritative fact changed. Current durable sources support the previously established symmetric values.

## 8. Legacy cost-block recurrence result

Both raw pages and the durable owner are free of `Moving Cost Breakdown`, old cost classes, hidden/duplicate pricing wrappers, legacy summary cards, and the temporary `Route Pricing` label. Runtime checks through 5+ seconds retained exactly one pricing section and one table. Generator assertions prevent recurrence.

## 9. Contamination/copy errors removed

The old generator’s Vancouver → Toronto historical-template dependency was removed. Target body content contains no unintended Toronto, Vancouver, Edmonton, Montreal, Ottawa, Halifax, or Victoria language; such cities appear only in legitimate navigation, related links, or the company-wide footer. No ferry, strata-specific Vancouver, Ontario, Quebec, or Atlantic-route language remains.

## 10. Directional form result

Calgary → Winnipeg settled to `Calgary, AB` / `Winnipeg, MB`; Winnipeg → Calgary settled to `Winnipeg, MB` / `Calgary, AB`. Values were correct on initial load, at approximately 1.2 seconds, and after 5+ seconds.

## 11. Metadata/title/OG/Twitter result

For each direction, raw and settled title, `og:title`, and `twitter:title` match exactly and contain the brand suffix once. Each has a route-specific description, self-canonical, and matching OG URL. No generic homepage metadata is present.

## 12. FAQ/schema result

Each page has exactly one visible FAQ section, one FAQ heading, one implementation, and one `FAQPage`. Visible questions/answers and schema have exact content and order parity. There is no hidden generic FAQ or `.pcm-local-seo`.

## 13. Terminology corrections

Pricing and FAQs consistently use `Declared Value Protection`, carrier-liability context, planning ranges, and written estimates. Pair-scoped fallback text was corrected to retain plus signs and the en dash. Stale `insurance`, old `valuation coverage`, guarantees, broker/subcontractor claims, and promotions are absent.

## 14. Typography result

Computed headings use Playfair Display and body/forms/buttons use Source Sans 3. H1 is 48/60/700 at 1280 × 900 and 36/45/700 at 390 × 844. Pair-scoped CSS applies the canonical heading, body, FAQ, and spacing treatment without a global typography change.

## 15. Quote-panel result

Each page has one 1120px-shell canonical panel with red accent, 8px radius, canonical shadow, 574px/420px desktop columns, single-column mobile layout, six trust pills, written-estimate treatment, company details, correct heading/defaults, and canonical controls. Expired promotion wording is absent.

## 16. Pricing result

Each page has one directional pricing section and one table with the five authoritative rows and $2,300–$12,000+ range. The table has a 760px minimum width and scrolls internally on mobile. Disclaimer and Declared Value Protection wording are canonical; duplicate, legacy, temporary, obsolete, and undefined content is absent.

## 17. Route at a Glance result

Each page has one glance component showing approximately 1,320 km, 3–11 days, and $2,300–$12,000+. It uses three desktop columns and one mobile column, and agrees with pricing, body copy, FAQ, and schema.

## 18. Main-content result

Widths, section order, hierarchy, spacing, cards/lists, CTA placement, and responsive structure now follow the reference. Direction-specific Alberta/Manitoba access and eastbound/westbound copy remain distinct.

## 19. Navigation result by architecture

The legitimate static architecture is preserved with no React bootstrap or duplicate nav. Desktop dropdown interaction passed. Mobile menu changed `aria-expanded` from false to true and back to false, closed with Escape, and retained focus behavior.

## 20. Chatbot result by architecture

Each page has one static launcher and one panel. Open/close passed at both viewports with no React/static duplication, clipping, or floating-control overlap. Desktop panel width was 384px; mobile geometry fit from x=16 to x=374 within the 390px viewport.

## 21. Post-footer contamination result

Each route has one intended footer, zero `.pcm-local-seo`, zero `undefined`, no post-footer FAQ, no duplicate conversion block, no homepage replacement, no soft 404, and no stale promotion. Legitimate company-wide footer links remain.

## 22. Source/finalizer durability

The direct owner reproduced the final pages, and a second direct run was byte-identical. Required data is validated before rendering and missing/invalid fields fail generation. Direct-run output retained facts, titles, FAQ parity, forms, static architecture, and all absence checks.

## 23. Delayed-runtime stability

Raw, initial, approximately 1.2-second, and 5+-second checkpoints retained the correct H1, title quartet, form values, one pricing/table/glance/FAQ, one launcher/panel, and one footer. No homepage body, soft 404, legacy pricing, `.pcm-local-seo`, or `undefined` appeared.

## 24. Exact desktop/mobile QA

At 1280 × 900 and 390 × 844, both pages had no page-level horizontal overflow, broken local images, clipped controls, or floating overlap. Quote and glance layouts changed from canonical desktop columns to one column. The 760px table scrolled inside its mobile wrapper. Navigation and chat passed, and the browser console recorded no application warnings or exceptions. The sandbox prevented some remote font/analytics requests; these did not affect the verified local layout or application behavior.

## 25. Global FAQ/title/body regression result

Raw title/OG/Twitter contracts passed 56/56 through the title tests. Browser title checks passed all 55 evaluable routes with zero issues. Raw FAQ contracts remain 56/56; browser FAQ checks passed all 55 evaluable routes with zero issues. The 45-route body regression found no homepage or soft-404 replacement. The existing Victoria → Vancouver harness exclusion is unchanged.

## 26. Ownership/architecture validation

Ownership validation passed all 56 routes with exactly one full-page owner each and zero collisions. Declared and actual architecture match for both targets. The explicit ownership, title, and chatbot-pricing test run passed 33/33. Generator/data/auditor/runtime syntax checks passed.

## 27. First aggregate convergence result

In a clean temporary Git clone, the first complete aggregate changed 0/56 route files and 0/94 relevant assets.

## 28. Second aggregate convergence result

The second complete aggregate changed 0/56 route files and 0/94 relevant assets.

## 29. Regression result

The deduplicated regression suite now covers 45 directions (the prior 43 plus both Step 44 targets). Result: 45/45 passed for identity, title, form defaults, pricing, FAQ parity, `.pcm-local-seo`, `undefined`, navigation/chat, and body integrity.

## 30. Working-tree route isolation

Comparison of all 56 route hashes against the Step 44 baseline shows that only `calgary-to-winnipeg-movers/index.html` and `winnipeg-to-calgary-movers/index.html` changed. Aggregate output from the clean clone was not copied into unrelated working-tree routes.

## 31. Remaining known issues

The pre-existing Victoria → Vancouver browser-harness limitation remains isolated and unchanged. There are no known Step 44 defects. No deployment was performed, and Step 45 was not started.

**Step 44 is complete and ready for review before selecting the next remaining route pair.**
