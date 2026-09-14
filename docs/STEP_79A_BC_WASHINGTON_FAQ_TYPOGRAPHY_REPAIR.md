# Step 79A — BC to Washington FAQ Typography Repair

Date: 2026-09-09  
Scope: `/bc-to-washington-movers/` only  
Result: PASS

## 1. Step 79 blocker confirmed

The Step 79 evidence was reproduced at 1280×900 and 390×844. The FAQ question element is `section[data-pcm-route-faq-static] summary` (class `font-semibold cursor-pointer`). Before repair it computed to `"Source Sans 3", sans-serif`, 16px, 25.6px line-height, and weight 600 at both viewports. No font-specific selector matched the element. The required state from `docs/ROUTE_PAGE_STANDARD.md` is Playfair Display, 16px/24px/700.

## 2. Files changed

- `tools/generate-spa-routes.mjs`: added the narrow, durable BC → Washington FAQ typography source and idempotent insertion.
- `site-copy/bc-to-washington-movers/index.html`: owner-generated route-scoped style block.
- `docs/STEP_79A_BC_WASHINGTON_FAQ_TYPOGRAPHY_REPAIR.md`: this report.

No asset changed. No unrelated route HTML changed.

## 3. Ownership/render architecture

- Registered full-page owner: `generate-spa-routes.mjs`.
- Declared rendering: `react-spa`.
- Actual rendering: React SPA with preserved checked-in route HTML and the shared compiled app.
- Durable route source: the existing SPA-owned route output plus the route-specific `applyHeadOverride` owner path.
- Registered post-processors: `finalize-route-faq-architecture.mjs` and `normalize-route-title-metadata.mjs`.
- Shared dependencies preserved: `index-CNBNs70h.js`, `index-DOGLBY_X.css`, `conversion-boost.js`, and `conversion-boost.css`.
- Navigation and chatbot remain supplied by the existing React/shared runtime.
- Ownership/architecture validation: 56/56, one owner each, zero collisions.

The ownership and render architecture match Step 79. No reverse `/washington-to-bc-movers/` route was introduced.

## 4. Durable CSS/source cause

The fallback FAQ uses a `<summary class="font-semibold cursor-pointer">`. Before repair, `.font-semibold` supplied weight 600 while the remaining values inherited the Source Sans 3 body rule (`16px`, `line-height: 1.6`, or 25.6px). There was no route-specific FAQ-question rule, specificity conflict, generated CSS override, stale override, or mobile-only override.

The compatible A route `/calgary-to-vancouver-movers/` uses the same static `<summary>` pattern and a route-scoped selector that computes to Playfair Display 16px/24px/700 at desktop and mobile. The written standard specifies the same values. The fix therefore belongs in the BC → Washington owner, not shared CSS or post-render JavaScript.

## 5. FAQ question typography before

| Viewport | Family | Size | Line height | Weight |
| --- | --- | ---: | ---: | ---: |
| 1280×900 | Source Sans 3 | 16px | 25.6px | 600 |
| 390×844 | Source Sans 3 | 16px | 25.6px | 600 |

## 6. Exact correction

The owner now inserts one route-only style block:

```css
.pcm-route-faq-static summary {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}
```

The insertion removes any prior copy of its unique marker before writing the canonical block. It uses no `!important`, no JavaScript-after-render patch, no shared stylesheet change, and no mobile override.

## 7. FAQ question typography after — desktop

At 1280×900 the FAQ question computes to `"Playfair Display", Georgia, serif`, 16px, 24px line-height, and weight 700. PASS.

## 8. FAQ question typography after — mobile

At 390×844 the FAQ question computes to `"Playfair Display", Georgia, serif`, 16px, 24px line-height, and weight 700. PASS.

## 9. FAQ content/schema preservation

Raw FAQ markup SHA-256 and FAQ schema SHA-256 are identical before and after. Raw and settled audits each report one FAQ section, one FAQ heading, one `FAQPage`, exact question/answer/order parity, and zero `.pcm-local-seo`. The eight questions and eight answers did not change. Only presentation changed.

## 10. Cross-border architecture preservation

The route remains BC → Washington, with `British Columbia` → `Washington State` form values, province-to-state wording, customs/border content, one five-row cross-border pricing table headed `BC to Washington State Moving Costs`, one Route at a Glance block, one quote panel, one closing CTA, existing related navigation, and no reverse-route link. No domestic city-pair convention or new reverse route was added.

## 11. Other typography preservation

- FAQ answers remain Source Sans 3 at their existing 16px/25.6px/400 values.
- Body remains Source Sans 3 at 16px/25.6px/400.
- Form controls and buttons remain Source Sans 3.
- H1 remains Playfair Display at 48px/60px/700 desktop and 36px/45px/700 mobile.
- Pricing/body typography is unchanged.

Before/after value comparisons for these elements are identical.

## 12. Interaction preservation

The first FAQ card toggled closed → open → closed at both exact viewports. Mobile navigation opened with `aria-expanded=true`, closed with Escape to `false`, and retained focus on a button. Desktop Services navigation opened. The chatbot had one launcher, opened, and closed at both viewports. Exact chat panel bounds fit inside 1280×900 (384×298.75) and 390×844 (320×321.5). There was no clipping, horizontal overflow, overlay conflict, page error, or application console error.

## 13. Metadata/form preservation

Before/after metadata values are unchanged:

- Title, `og:title`, and `twitter:title`: `BC to Washington State Movers | Overnight Service | Purely Canadian Movers`.
- Description: `BC to Washington movers with overnight service. Specializing in Amazon and Microsoft employee relocations. Cross-border experts. Free estimates.` Raw/rendered entity normalization is unchanged.
- Canonical and `og:url`: `https://purelycanadianmovers.com/bc-to-washington-movers/`.
- Settled form values: `British Columbia` → `Washington State`.

## 14. Component preservation

Settled desktop and mobile each contain one H1, one quote panel, one primary form, one approved pricing section/table, one Route at a Glance block, one FAQ section, one FAQ heading, one `FAQPage`, one closing CTA, and one footer. Pricing contains the same five rows. No duplicate component was introduced.

## 15. Contamination audit

Zero visible `undefined`, `.pcm-local-seo`, `Moving Cost Breakdown`, duplicate FAQ, duplicate pricing, duplicate glance/facts block, homepage signature, soft-404 signature, stale promotion, reverse-route link, application error, or page-level horizontal overflow was found.

## 16. Idempotency

- Direct owner, first verification state → second owner run: 0/56 route drift, 0 asset drift.
- Dedicated route finalizer: not registered for this SPA-owned route; the route-specific owner path is the finalization authority and is covered by the two direct-owner runs.
- FAQ finalizer: 0/56 route drift, 0 asset drift.
- Title normalizer: 0/56 route drift, 0 asset drift; 0 route documents changed and the SPA SEO writer reported `changed=false`.

The owner’s insertion is byte-stable and preserves the corrected target output.

## 17. Delayed-runtime result

Raw HTML contains one FAQ section, one heading, and one `FAQPage`. At the measured initial 300ms, 1.5s, and 5.5s checkpoints, FAQ question typography remained Playfair Display 16px/24px/700; H1, title, form values, pricing, glance, FAQ singularity, and route identity remained stable. There was no homepage replacement, soft 404, legacy pricing recurrence, or application error.

## 18. Target browser QA

PASS at 1280×900 and 390×844. FAQ questions compute exactly to the canonical values; the FAQ fits horizontally; accordion interaction, navigation, and chatbot work; and there are zero page/application console errors.

## 19. BC → Washington classification

`/bc-to-washington-movers/` is **A — Canonical** under the Step 79 classification rules. The sole B-class blocker is resolved.

## 20. Final global A/B/C/D totals

Measured all-56 browser reclassification:

- A: 56
- B: 0
- C: 0
- D: 0

## 21. Title results

Raw title/OG/Twitter/description/canonical/OG URL: 56/56 canonical. Rendered and settled title metadata: 56/56 canonical. BC → Washington remained stable throughout its title history with exactly one brand suffix and zero page errors.

## 22. FAQ results

Raw FAQ contract: 56/56 canonical. Rendered/settled FAQ contract: 56/56 canonical. All routes have exact visible/schema parity at settlement and zero `.pcm-local-seo`; the repaired route’s FAQ content and schema hashes are unchanged.

## 23. Ownership/tests

- Ownership/architecture validator: PASS, 56/56, zero collisions.
- Test files: 3.
- Tests: 36 attempted, 36 passed, 0 failed, 0 skipped, 0 cancelled, 0 todo.

The suite covers ownership, architecture contradictions, owner/finalizer determinism, title normalization, route facts/contracts, FAQ-related contracts, and chatbot pricing.

## 24. Syntax

Tool modules checked with `node --check`: 128 attempted, 128 passed, 0 failed.

## 25. Browser regression

Current deduplicated browser regression: 54 attempted, 54 passed, 0 failed. BC → Washington and Victoria → Vancouver are included.

## 26. Aggregate pass 1

A fresh no-hardlink temporary Git clone was overlaid with the current `site-copy`, `tools`, and `package.json`, hashed, and run through `run-owned-route-build.mjs` once.

- Route drift: 0/56.
- Asset drift: 0.
- Result: PASS.

## 27. Aggregate pass 2

The same isolated clone was run through the full aggregate a second time only after pass 1 was clean.

- Route drift: 0/56.
- Asset drift: 0.
- Result: PASS.

## 28. Workspace isolation

The Step 79A starting snapshot contained 56 route hashes and 104 asset hashes. Final comparison shows exactly one route HTML change, `/bc-to-washington-movers/`, and zero asset changes. The target hash changed from `b873d723adf30ba1d544214242df7308e1f13fe7d46e57992a9e6d8feb2a1def` to `bc9ecfa36616f25067cd215ec606dc16cf07dfd7167b6825cebb4030950f566b`. The only durable program source edited was `tools/generate-spa-routes.mjs` (SHA-256 `0960d8c81c99465215a98897ff8faa0db5815c82c5b149ea040f36c9689ac01d` → `f9eba1549a63775c34c4d94f4b5fd69f4e36e6adec7944ac02a6be6241fec229`). Pre-existing workspace changes were preserved. Staged file count is zero.

## 29. Remaining known issues

No Step 79 deployment blocker remains. The prior generic chat ancestor probe can select the 56×56 launcher instead of the panel; the exact panel geometry check used here found the real panel fully within both viewports. No deployment, backup/rollback state, commit, staging action, or Step 80 work occurred.

## 30. Final deployment-readiness decision

All Step 79A GO conditions pass: 56 A / 0 B / 0 C / 0 D, ownership 56/56, zero collisions, canonical titles and FAQs, tests 36/36, syntax 128/128, browser regression 54/54, two zero-drift aggregate passes, clean workspace isolation, and no remaining deployment blocker.

Step 79A is complete.

Classification: 56 A / 0 B / 0 C / 0 D.

Step 79A deployment readiness: GO.
