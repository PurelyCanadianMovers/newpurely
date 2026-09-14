# Step 36 — Montreal ↔ Calgary Route Standardization

## 1. Files changed

- `site-copy/montreal-to-calgary-movers/index.html`
- `site-copy/calgary-to-montreal-movers/index.html`
- `site-copy/assets/step36-montreal-calgary.css`
- `site-copy/assets/step36-montreal-calgary.js`
- `tools/montreal-calgary-route-data.mjs`
- `tools/finalize-montreal-calgary-routes.mjs`
- `tools/audit-step36-montreal-calgary.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `docs/ROUTE_PAGE_OWNERSHIP.md`
- `docs/STEP_36_MONTREAL_CALGARY_REPORT.md`

No compiled React bundle, shared conversion runtime, unrelated route HTML, or deployment target was changed.

## 2. Montreal → Calgary changes

The React route now settles in the canonical order: quote panel, five-row pricing, React header/navigation, hero, trust strip, normalized route content with one Route at a Glance, one route FAQ, related destinations, closing CTA, and footer. The generic raw homepage description/canonical/OG URL and generic appended FAQ were replaced with route-specific durable values. Montreal/Quebec pickup, westbound logistics, Calgary delivery, weather, tax, language, and elevator guidance remain directional.

## 3. Calgary → Montreal changes

The hydration-free static route retains its direction-specific Calgary pickup, eastbound logistics, Montreal access/elevator and permit guidance. Its expired September promotion was removed; price, distance, protection terminology, typography, ordering, and responsive presentation were normalized.

## 4. Confirmed owner/render architecture

- Montreal → Calgary: `generate-spa-routes.mjs`, `react-spa`, exact compiled route present, one React navigation and one React chatbot.
- Calgary → Montreal: `checked-in-static-route-source`, static, no React bootstrap. It retains the serialized static page plus shared `static-nav.js` and `static-chat.js` behavior.
- Both run the registered pair-scoped `finalize-montreal-calgary-routes.mjs`, followed by the existing FAQ/title finalizers. Calgary → Montreal also retains the bootstrap stripper.

The registry and actual architecture agreed before editing, so the ownership stop condition was not triggered. Early browser state showed the React route-specific H1/body before its quote/pricing retry completed; settled state contained all canonical components. The static direction was complete in early and settled state.

## 5. Authoritative route facts

- Distance: approximately 3,600 km (`~3,600 km` in the glance card)
- Transit: 7–19 days
- Studio: $2,500+
- 1-bedroom: $4,700+
- 2-bedroom: $6,300+
- 3-bedroom: $10,000+
- 4+ bedroom: $15,000+
- Overall planning range: $2,500–$15,000+

These values are frozen in `tools/montreal-calgary-route-data.mjs`. The compiled Montreal route and established FAQ/schema supplied the pricing authority; the shared 7–19 day project value remains unchanged.

## 6. Route-fact corrections

The checked-in pair conflicted on distance (3,700 km westbound versus 3,400 km eastbound) and on the 2-bedroom figure ($6,300+ in the compiled route/FAQ versus $6,400+ in one reverse-direction table). Both directions now use approximately 3,600 km and $6,300+ consistently.

## 7. Contamination/copy errors removed

Removed the React shell's generic homepage metadata and appended generic company FAQ, the static route's expired September promotion, the duplicate legacy Moving Cost Breakdown, and copied $6,400+ pricing. Mentions of other cities remain only where legitimate in navigation, footer, or related-route links.

## 8. Directional form result

- Montreal → Calgary: `Montreal, QC` → `Calgary, AB`
- Calgary → Montreal: `Calgary, AB` → `Montreal, QC`

Actual values passed after all runtime retries.

## 9. Metadata/title/OG/Twitter result

Each raw and settled title, `og:title`, and `twitter:title` matches and has exactly one terminal `Purely Canadian Movers` suffix. Both descriptions are route-specific; canonical and `og:url` are self-referential.

## 10. FAQ/schema result

Each settled route has one visible FAQ section, one heading, one implementation, one `FAQPage`, exact question/answer/order parity, and zero `.pcm-local-seo`. Montreal → Calgary has eight directional questions; Calgary → Montreal preserves its eleven established questions.

## 11. Terminology corrections

Replaced obsolete insurance/basic valuation wording with carrier-liability and Declared Value Protection language, retained written-estimate/planning language, and changed the process label from Cross-Country Transit to Interprovincial Transit where applicable.

## 12. Typography result

Computed H1 is Playfair Display 48px/60px/700 at 1280×900 and 36px/45px/700 at 390×844. Body, forms, and buttons use Source Sans 3; route, FAQ, pricing, and glance headings use the canonical display family and scale.

## 13. Quote-panel result

Both routes have one canonical quote panel, a two-column desktop and one-column mobile layout, six trust pills, written-estimate and verified-company treatment, no expired promotion, and correct directional defaults.

## 14. Pricing result

Each route has one canonical pricing section and one 760px-minimum five-row table immediately after the quote panel. At mobile size only the table wrapper scrolls horizontally. The disclaimer uses planning-range and Declared Value Protection terminology.

## 15. Route at a Glance result

Each route has one card showing ~3,600 km, 7–19 days, and $2,500–$15,000+. It renders as three desktop columns and one mobile column.

## 16. Main-content result

The main route content uses the canonical 896px container, hierarchy, spacing, cards, and section rhythm. Direction-specific content was preserved and the two directions were not made textually identical.

## 17. Navigation result

The React direction retains its React desktop dropdown and Radix mobile sheet. The static direction retains shared static navigation; Step 36 adds a path-gated Escape and `aria-expanded` repair. Desktop dropdowns and mobile `false → true → false` behavior pass.

## 18. Chatbot result

Each route has one launcher and its legitimate React/static chatbot. Open and close passed for both; no duplicate implementation or sticky-bar obstruction was found.

## 19. Post-footer contamination result

Each route has one footer, no generic post-footer FAQ, zero `.pcm-local-seo`, no duplicate conversion block, no homepage body, no soft 404, no stale promotion, and no visible `undefined`.

## 20. Source/generator durability

The frozen data module and registered pair finalizer are deterministic, idempotent, ownership-aware, and limited to these two routes. Direct finalizer run two changed zero bytes. No cross-route page is consumed.

## 21. Desktop/mobile QA

Exact 1280×900 and 390×844 browser viewports passed with no page-level overflow, broken image, or clipped core control. Quote and glance layouts stack on mobile and pricing scrolls internally. The only console entry was the expected sandbox-blocked external analytics/pixel request (`ERR_NETWORK_ACCESS_DENIED`).

## 22. Global FAQ/title/body regression result

- FAQ: 55/55 completed browser checks canonical; Victoria → Vancouver retained its documented timeout and raw canonical fallback, for 56/56 combined contract coverage.
- Titles: raw title/OG/Twitter tests pass 56/56; all 55 completed browser checks reported canonical before the same Victoria timeout.
- Body/hydration: the requested regression set contains no homepage or soft-404 replacement.

## 23. Ownership validation

PASS: 56 routes, exactly one full-page owner each, zero collisions. Ownership/title tests pass 20/20 combined. JavaScript syntax checks and aggregate dry run pass.

## 24. First aggregate convergence result

PASS: 0/56 route drift and zero shared-file drift in a history-preserving temporary repository copy.

## 25. Second aggregate convergence result

PASS: 0/56 route drift and zero shared-file drift.

## 26. Regression result

The 28-route broad regression audit passes 28/28. Calgary ↔ Edmonton passes separately in both directions, including route identity, form defaults, pricing, FAQ parity, responsive overflow, and architecture checks.

## 27. Working-tree route isolation

Only `site-copy/montreal-to-calgary-movers/index.html` and `site-copy/calgary-to-montreal-movers/index.html` were written among the 56 route HTML files for Step 36. No unrelated aggregate output was copied back.

## 28. Remaining known issues

- The pre-existing Victoria → Vancouver browser-harness timeout remains; its raw FAQ/title contracts pass.
- Local QA blocks one external analytics/pixel request because network access is disabled; no route application error was found.

Step 36 is complete. No deployment was performed, and Step 37 was not started.
