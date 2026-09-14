# Step 33 — Calgary ↔ Vancouver Route Standardization

## 1. Files changed

- `site-copy/calgary-to-vancouver-movers/index.html`
- `site-copy/vancouver-to-calgary-movers/index.html`
- `site-copy/assets/step33-calgary-vancouver.js`
- `site-copy/assets/step33-calgary-vancouver.css`
- `tools/standardize-calgary-vancouver-routes.mjs`
- `tools/audit-step33-calgary-vancouver.mjs`
- `tools/audit-step33-regressions.mjs`
- `tools/route-page-ownership.mjs`
- `tools/route-writer-manifest.mjs`
- `tools/route-page-ownership.test.mjs`
- `docs/STEP_33_CALGARY_VANCOUVER_REPORT.md`

No compiled React bundle, shared conversion runtime, shared navigation/chat code, or unrelated route HTML was changed by Step 33.

## 2. Calgary → Vancouver changes

The settled page now follows the canonical component order: quote panel, pricing, React header, hero, trust strip, consolidated main route content with Route at a Glance, FAQ, related routes, closing CTA, and footer. The directional quote heading, pricing block, glance card, section hierarchy, spacing, and responsive presentation were normalized while retaining Calgary pickup, Vancouver delivery, strata/elevator, climate, tax, and mountain-corridor content.

## 3. Vancouver → Calgary changes

The reverse page received the same structural and visual normalization while retaining its Vancouver pickup, Calgary delivery, elevator, climate, neighbourhood, employment-relocation, and Rocky Mountain content.

## 4. Confirmed owner/render architecture

Both routes remain `react-spa`, owned by `generate-spa-routes.mjs`. Each has one React bootstrap and an exact compiled route. Step 33 is a registered route-pair post-processor using assets referenced only by these two route shells.

## 5. Step 32 hydration repair verification

Both exact React routes mount into visible `#root`. The raw preserved SPA shell still contains its generic homepage H1 and no route-body sentinel, which is expected for this architecture; the compiled exact route replaces it immediately. Direct, hydrated, retry, and delayed-settled checks never produced a homepage body, soft 404, or wrong route.

## 6. Authoritative route facts

Both directions retain approximately 1,000 km and 4–13 days. Rows remain Studio $2,000+, 1-bedroom $2,600+, 2-bedroom $3,500+, 3-bedroom $4,800+, and 4+ bedroom $6,500+. The established overall ranges remain $1,800–$13,000+ Calgary → Vancouver and $1,800–$14,000+ Vancouver → Calgary.

## 7. Route-fact corrections

No numeric route facts were changed. The inaccurate “cross-country” description for this Alberta–British Columbia corridor was corrected to “interprovincial long-distance”; Calgary → Vancouver's process label was likewise corrected to “Interprovincial Transit.”

## 8. Directional form result

- Calgary → Vancouver: `Calgary, AB` → `Vancouver, BC`
- Vancouver → Calgary: `Vancouver, BC` → `Calgary, AB`

Values remain correct after the shared conversion retries and delayed settled state.

## 9. Title/OG/Twitter result

Both directions retain their established canonical titles with one `Purely Canadian Movers` suffix. Settled `document.title`, `og:title`, and `twitter:title` match. The proven generic raw homepage descriptions and homepage `og:url`/canonical defects were replaced with route-specific descriptions and self URLs.

## 10. FAQ/schema result

Each route settles with one visible FAQ section, one FAQ heading, one implementation, one `FAQPage`, exact question/answer/order parity, and zero `.pcm-local-seo`. FAQ content was not changed; the existing fallback was moved from after the footer into the canonical pre-related-routes position.

## 11. Typography result

Computed desktop H1 is Playfair Display 48/60/700; mobile is 36/45/700. Body, form, and button typography use Source Sans 3. Main headings, glance values, FAQ questions, and supporting type follow the canonical scale.

## 12. Quote-panel result

One canonical 1120px quote shell remains, with 1080px inner card, red accent, canonical shadow/radius, six trust pills, written-estimate and verified-company treatments, a two-column desktop layout, and a one-column 390px layout. Headings are directional.

## 13. Pricing result

One pricing section and one 5-row table appear immediately after the quote panel. The table has a 760px minimum width and scrolls inside its wrapper on mobile. The canonical heading, planning-range disclaimer, and Declared Value Protection terminology are present; the legacy Moving Cost Breakdown section was removed after hydration.

## 14. Route at a Glance result

Each direction has one glance card inside the consolidated main content, with distance, transit, and direction-specific overall range. It is three columns on desktop and one column at 390px.

## 15. Main-content/section-order result

The former stack of oversized alternating sections is consolidated into the canonical 896px main-content width and rhythm. Unique route copy, internal links, proof content, process cards, and testimonial remain directional and preserved.

## 16. Navigation result

React desktop navigation and dropdown behavior remain in place; the dropdown opens and closes on outside click. React mobile navigation opens and closes at 390×844. No static-nav assets or duplicate headers were introduced.

## 17. Chatbot result

Each route has one React launcher and one panel. Open/close passed at desktop and mobile sizes, with no static-chat duplication.

## 18. Post-footer contamination result

One footer remains. There is no post-footer FAQ, `.pcm-local-seo`, duplicate conversion block, homepage body, React 404 body, stale promotion, or visible `undefined`.

## 19. Source/generator durability result

The route-pair finalizer is registered in the ownership manifest and aggregate build. Running it twice changes zero bytes. Its JS/CSS behavior is path-gated to the two Step 33 routes. The existing compiled React and shared conversion files were not modified.

## 20. Desktop/mobile QA

Exact 1280×900 and 390×844 viewports were achieved for both routes. There is no page-level horizontal overflow or broken image. The quote and glance layouts stack correctly; the pricing table scrolls internally on mobile. Desktop dropdown, mobile sheet, and chatbot interactions pass.

## 21. Hydration lifecycle result

At direct DOMContentLoaded, both exact React bodies already have the correct directional H1 and no homepage/404 body. The quote panel is added during the bounded runtime phase. At hydrated, retry, and delayed settled snapshots, H1, route sentinel, and form defaults remain correct.

## 22. Global 56-route FAQ/title regression result

FAQ: 55/55 completed browser loads are canonical. The known Victoria → Vancouver browser navigation timeout remains; its raw page passes one FAQ section, one heading, one `FAQPage`, exact parity, and zero `.pcm-local-seo`, for a combined 56/56 contract result. Titles: raw title/OG/Twitter parity and one brand suffix pass 56/56; all 55 completed settled browser loads pass, with the same Victoria → Vancouver harness timeout.

## 23. Ownership validation

PASS: 56 routes, exactly one owner each, zero collisions. Ownership tests pass 14/14; title tests pass 4/4; route-pair scripts pass JavaScript syntax checks.

## 24. First aggregate convergence result

The Step 33 pair has zero first-run drift and both existing shared runtime files have zero drift. The full aggregate reproduced only the already documented first-pass Edmonton ↔ Winnipeg cleanup; therefore unexpected route drift is zero.

## 25. Second aggregate convergence result

PASS: 0 route drift and 0 shared runtime drift on the second full aggregate. The Step 33 route assets also remain byte-stable.

## 26. Regression result

The 24 requested regression routes pass settled route-specific H1/body, title branding, directional form defaults, pricing-table presence, navigation/chatbot presence, zero `.pcm-local-seo`, and no homepage/404 replacement.

## 27. Working-tree route isolation

Step 33 directly changed only the two target route HTML files. All 56 route hashes were compared in the history-preserving temp repository; neither target drifts under either aggregate run, and no aggregate output was copied back to the working tree.

## 28. Remaining known issues

- The pre-existing Victoria → Vancouver browser-harness timeout remains; raw FAQ/title checks pass.
- The first aggregate still reproduces the documented Edmonton ↔ Winnipeg first-pass cleanup; the second run is stable.
- The sandbox blocks one external analytics/pixel request (`ERR_NETWORK_ACCESS_DENIED`) during local browser QA. No application console error or broken route asset was found.

Step 33 is complete. No deployment was performed, and Step 34 was not started.

