# Step 74 — Calgary ↔ Halifax mobile navigation cleanup

Scope was limited to `/calgary-to-halifax-movers/` and `/halifax-to-calgary-movers/`. No deployment occurred and Step 75 was not started.

## 1. Step 73 defect confirmed

At 390 × 844, both routes began closed with `aria-expanded="false"`, opened visibly with `aria-expanded="true"`, then ignored Escape: the panel remained visible/open, `aria-expanded` remained `true`, and focus remained on the Close menu button.

| Route | Step 73 Class | Nav Architecture | Exact Defect | Responsible Source |
| --- | --- | --- | --- | --- |
| `/calgary-to-halifax-movers/` | B — Minor cleanup | Static shared nav plus pair-local inline controller | Escape did not close the open mobile panel or reset expanded state | `generate-halifax-calgary-route-pages.mjs` emitted `data-pcm-route-meta` controller |
| `/halifax-to-calgary-movers/` | B — Minor cleanup | Static shared nav plus pair-local inline controller | Same Escape and ARIA-state failure | Same pair owner |

Evidence: `STEP_74_NAV_BEFORE.json`.

## 2. Files changed

Production/source changes are limited to:

- `tools/generate-halifax-calgary-route-pages.mjs`
- `site-copy/calgary-to-halifax-movers/index.html`
- `site-copy/halifax-to-calgary-movers/index.html`

Step 74 also added its audit script, JSON evidence, isolated clone, and this report. No shared asset changed.

## 3. Ownership/render architecture

Registry truth declares both routes as static and gives both exactly one full-page owner: `generate-halifax-calgary-route-pages.mjs`. Actual output is also static: neither route loads the React route bootstrap. Both use `static-nav.js`/`static-nav.css`, `static-chat.js`/`static-chat.css`, and `conversion-boost.js`. The ownership validator passed with 56 routes, 56 owners, and zero collisions. Declared and actual rendering agree.

## 4. Nav source chain

The owner reads each checked-in directional route snapshot, emits the static nav asset references, then emits the pair-local `data-pcm-route-meta` controller. `static-nav.js` creates `.pcm-static-mobile`; the route-local controller synchronizes the `button[aria-label="Open menu"]` state. Both target routes share this source chain. The durable fix was made in the owner, not only in rendered HTML.

## 5. Defect reproduction before fix

Both routes reproduced `false → true → true` for initial/open/after-Escape expanded state. After Escape, `.pcm-static-mobile.is-open` was still present and visible, focus was still on `button[aria-label="Close menu"]`, body overflow remained `visible`, and there were no application errors. Normal Close did work and restored the trigger state/focus.

## 6. Canonical working comparison

Halifax ↔ Vancouver is the canonical same-architecture comparison. Its route-scoped `step43-halifax-vancouver.js` closes the same static mobile panel on Escape, synchronizes `aria-expanded`, and returns focus to the trigger. The Calgary ↔ Halifax correction follows that behavior without copying another rendering family.

## 7. Exact correction

The pair-local controller now resolves the current `.pcm-static-mobile` panel, synchronizes expanded state from `is-open`, and handles document Escape only while that panel is open. It invokes the panel's canonical Close button once; the existing close path removes `is-open` and focuses the trigger. A defensive fallback performs the same state/focus restoration if the close button is unavailable. The shared nav asset was not modified.

## 8. `aria-expanded` before/after

- Before: initial `false`; open `true`; after Escape stale `true`; normal close `false`.
- After: initial `false`; every open `true`; every Escape/normal close `false`; closed-menu Escape remains `false`.

## 9. Escape-key behavior before/after

Before, Escape was ignored on both routes. After, Escape closes exactly once only when the target mobile panel is open. Closed-menu Escape is harmless. No overlay or body lock is introduced, and the handler does not address the chatbot.

## 10. Focus-return result

Every Escape and normal close returned focus to `button[aria-label="Open menu"]`. Opening focused the canonical Close menu button.

## 11. Repeated-cycle stability

At 390 × 844, each route passed: Open → Escape; Open → Close; Open → Escape; Open → normal Close; Open → Escape. Every open/close state and expanded value was correct, body overflow stayed `visible`, a final Escape while closed was harmless, and no application error occurred.

## 12. Desktop-nav preservation

At 1280 × 900, both routes had zero visible mobile panels. The Services dropdown opened with expanded `true` and one visible dropdown, then closed with expanded `false` and zero visible dropdowns. There was no horizontal overflow, mobile leakage, layout failure, or application error.

## 13. Route-content preservation

Diffing each corrected route against the Step 73 isolated clone shows exactly one changed inline-script line per route. H1, quote panel, pricing, Route at a Glance, FAQ, metadata values, forms, route facts, typography, main content, related destinations, CTA, footer, and chatbot markup are byte-identical.

## 14. Form preservation

After 5.5 seconds on mobile and desktop:

- Calgary → Halifax: `Calgary, AB` → `Halifax, NS`.
- Halifax → Calgary: `Halifax, NS` → `Calgary, AB`.

## 15. FAQ/title preservation

Both raw and rendered titles remain canonical; OG/Twitter titles match. Each target retains one visible FAQ, one FAQ heading, one FAQPage entity, and exact visible/schema parity and order. No FAQ or title content changed.

## 16. Chatbot isolation

Each target has one launcher and one panel. Open/close passed at mobile and desktop, with no layering/overflow conflict. The nav Escape handler is conditional on the nav panel and does not change chatbot state.

## 17. Idempotency

The second direct owner run produced zero route or asset bytes. `strip-unsupported-route-bootstrap.mjs` and the FAQ finalizer produced zero bytes. No separate nav post-processor owns this pair. The title normalizer restored its existing authoritative title marker after the direct owner sequence, without changing title values; its canonical second pass changed zero bytes. In the authoritative aggregate order, both full passes are zero-drift.

## 18. Mobile QA

Both routes passed at 390 × 844: open, expanded true, Escape close, expanded false, focus return, reopen, normal close, five-cycle stability, no horizontal overflow, no stuck overlay/body state, chatbot open/close, and zero application console/page errors.

## 19. Desktop QA

Both routes passed at 1280 × 900: desktop dropdown open/close and ARIA state, zero mobile-nav leakage, no horizontal overflow/layout regression, preserved forms, working chatbot, and zero application errors.

## 20. Updated classification

- Calgary → Halifax: A — Canonical.
- Halifax → Calgary: A — Canonical.
- Calgary ↔ Halifax pair: complete.
- Updated rollup: A 53/56, B 3/56, C 0/56, D 0/56; 27 complete groups and 2 minor-cleanup groups.

## 21. Global title/FAQ result

- Raw title contract: 56/56 canonical.
- Rendered title contract: 56/56 canonical; zero application-error routes.
- Raw FAQ contract: 56/56 canonical.
- Rendered FAQ contract: 56/56 canonical; zero application-error routes.
- Raw `.pcm-local-seo` DOM blocks: 0/56.
- Rendered `.pcm-local-seo`: 0/56.
- Unintended visible `undefined`: 0/56.

## 22. Confirmation C=0 and D=0

C remains 0 and D remains 0. The correction is a bounded pair-local interaction fix with no structural, ownership, architecture, source-durability, or shared-runtime defect.

## 23. Ownership/tests

- Ownership/architecture validator: PASS — 56 routes, 56 owners, zero collisions.
- Tests: 36/36 passed; zero failures, skips, cancellations, or todos.

## 24. Syntax

Production tool modules: 128. Passed: 128/128. Failed: 0.

## 25. Browser regression

The established deduplicated suite includes both Calgary ↔ Halifax directions. Result: 54/54 passed.

## 26. Aggregate pass 1

A fresh no-hardlink clone was created under `tmp/step74-aggregate-clone-20260909` and overlaid with the exact corrected `site-copy`, `tools`, and `package.json`.

- 0/56 route drift.
- 0/104 asset drift.

The mandatory first-pass gate passed; no reconciliation was performed.

## 27. Aggregate pass 2

- 0/56 route drift.
- 0/104 asset drift.
- Pass 2 matches pass 1 exactly.

## 28. Working-tree isolation

Against `STEP_74_BASELINE.json`, exactly two registered route files changed: the two target route HTML files. Asset drift is 0/104. The shared static nav asset and every unrelated route HTML file remain byte-stable. Source changes are limited to the declared pair owner; Step 74 audit/report files are non-production evidence.

## 29. Remaining known issues

Three B routes remain from Step 73: Vancouver ↔ Winnipeg retain the computed body-font mismatch, and Victoria → Ottawa retains its mobile ARIA/Escape defect. These are outside Step 74. No C or D routes remain. No deployment occurred, and Step 75 was not started.

Step 74 is complete.
