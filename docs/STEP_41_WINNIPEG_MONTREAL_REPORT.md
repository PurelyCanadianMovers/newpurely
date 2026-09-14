# Step 41 — Winnipeg ↔ Montreal Route Standardization

Step 41 is complete for the authorized pair. No deployment was performed and Step 42 was not started.

## 1. Files changed

Route output changed only in:

- `site-copy/winnipeg-to-montreal-movers/index.html`
- `site-copy/montreal-to-winnipeg-movers/index.html`

Durable source, route-scoped presentation, registry, tests, and audit changes:

- `tools/rebuild-winnipeg-montreal-routes.mjs`
- `tools/winnipeg-montreal-route-data.mjs`
- `site-copy/assets/step41-winnipeg-montreal.css`
- `site-copy/assets/step41-winnipeg-montreal.js`
- `tools/route-page-ownership.mjs`
- `tools/route-page-ownership.test.mjs`
- `tools/audit-step41-winnipeg-montreal.mjs`
- `tools/audit-step33-regressions.mjs`
- `docs/STEP_41_WINNIPEG_MONTREAL_REPORT.md`

Generated evidence is stored in the `STEP_41_*.json` files at the repository root. The cost guide and sitemap were exercised by the owner but remained byte-idempotent from the Step 41 baseline.

## 2. Winnipeg → Montreal changes

The page now follows the canonical route hierarchy and visual contract while retaining Winnipeg pickup/building access, Manitoba-origin planning, the eastbound Manitoba–Quebec corridor, Montreal apartment/elevator/loading access, seasonal scheduling, and directional arrival content.

## 3. Montreal → Winnipeg changes

The reverse page uses the same canonical presentation while retaining Montreal pickup/access, Quebec-origin planning, the westbound Quebec–Manitoba corridor, Winnipeg delivery/building access, and Prairie/winter scheduling considerations.

## 4. Confirmed owner/render architecture

| Route | Registry Owner | Declared Render | Actual Render | React Support | Nav | Chat |
|---|---|---|---|---|---|---|
| `/winnipeg-to-montreal-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | Static | Static | No bootstrap; no exact compiled route support | `static-nav.js` | `static-chat.js` |
| `/montreal-to-winnipeg-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | Static | Static | No bootstrap; no exact compiled route support | `static-nav.js` | `static-chat.js` |

Both routes retain `conversion-boost.js`, the route-scoped Step 41 runtime, the FAQ finalizer, and the title finalizer. Declared and actual architecture agree.

## 5. Full durable source/data chain

`route-page-ownership.mjs` and `route-writer-manifest.mjs` register the pair owner and post-processors. The owner reads the checked-in explicit Winnipeg template, combines directional content with frozen `winnipeg-montreal-route-data.mjs` facts, validates all required fields, writes the route HTML/schema and embedded runtime JSON, then the registered FAQ and title finalizers run. The settled page uses `conversion-boost.js`, `static-nav.js`, `static-chat.js`, and the path-gated Step 41 asset pair. The cost guide is corroborated by `cost-guide-popular-routes.mjs`; chatbot answers are corroborated by `src/index.js` and `chatbot-route-pricing.test.mjs`.

## 6. Authoritative route facts

| Fact | Winnipeg → Montreal | Montreal → Winnipeg | Winning Source |
|---|---|---|---|
| Distance | approximately 2,270 km | approximately 2,270 km | frozen pair data; cost guide/chatbot corroboration |
| Transit | 5–13 days | 5–13 days | frozen pair data; cost guide/chatbot corroboration |
| Studio | $2,400+ | $2,400+ | frozen pair data; chatbot/current route sources agree |
| 1-bedroom | $3,400+ | $3,400+ | same |
| 2-bedroom | $5,500+ | $5,500+ | same |
| 3-bedroom | $9,000+ | $9,000+ | same |
| 4+ bedroom | $13,000+ | $13,000+ | same |
| Overall range | $2,400–$13,000+ | $2,400–$13,000+ | explicitly frozen and derived from the five rows |

## 7. `undefined` root-cause protection/result

The prior defect was reproduced: both legacy route objects lacked `route.distance` and `route.transit`, yielding seven literal `undefined` values in each page. Required facts now come from one frozen pair data module. Validation rejects missing/blank distance, transit, range, direction, form values, or any of the five pricing rows before writing. Generated HTML is also rejected if it contains `undefined`. The browser runtime reads generator-emitted JSON rather than a second fact table. Final raw and settled counts are zero.

## 8. Route-fact corrections

No numeric value changed. The repair restored the established 2,270 km and 5–13 day values to schema, table rows, and Route at a Glance.

## 9. Contamination/copy errors removed

No Toronto, Vancouver, Calgary, Edmonton, Ottawa, Halifax, or Victoria content remains in the route-specific settled body. Legitimate global navigation/footer links are preserved. The generator also no longer depends on another mutable generated route.

## 10. Directional form result

- Winnipeg → Montreal: `Winnipeg, MB` → `Montreal, QC`
- Montreal → Winnipeg: `Montreal, QC` → `Winnipeg, MB`

Actual values remain correct through the 5+ second checkpoint.

## 11. Metadata/title/OG/Twitter result

Raw and settled title, `og:title`, and `twitter:title` match exactly for each direction and contain `| Purely Canadian Movers` once. Both descriptions are directional, canonicals are self-referential, and OG URLs are correct. The owner now handles annotated `<title>` tags so a rebuild cannot inherit the template route title.

## 12. FAQ/schema result

Each target has one visible FAQ section, one heading, one implementation, one `FAQPage`, exact question/answer/order parity, zero hidden generic FAQ, and zero `.pcm-local-seo` in raw and settled states.

## 13. Terminology corrections

Settled route copy uses carrier liability, Declared Value Protection, written estimates, and planning ranges. It contains no stale insurance/valuation wording, guarantee language, or obsolete broker/subcontractor claim.

## 14. Typography result

Computed headings use Playfair Display and body/forms/buttons use Source Sans 3. H1 is 48px/60px/700 at 1280px and 36px/45px/700 at 390px; route-local H2/H3/body/FAQ presentation follows the canonical scale.

## 15. Quote-panel result

Each route has one quote panel in the 1120px outer shell, with a 420px desktop form column, red left accent, 8px radius, canonical shadow, two desktop columns, one mobile column, six trust pills, written-estimate language, verified-company details, and correct directional values.

## 16. Pricing result

Each route has one pricing section/table with five authoritative rows, the $2,400–$13,000+ range, 760px table minimum width, internal mobile scrolling, a directional heading, Declared Value Protection wording, and a non-guaranteed planning disclaimer. Legacy/temporary/duplicate pricing and `undefined` are absent.

## 17. Route at a Glance result

Each route has one canonical glance card showing 2,270 km, 5–13 days, and $2,400–$13,000+. It uses three desktop columns and one mobile column and agrees with pricing, body, FAQ, schema, cost guide, and chatbot.

## 18. Main-content result

Both routes use the canonical 896px content width, hierarchy, spacing, cards, proof list, process grid, related destinations, and closing CTA while keeping directional copy distinct.

## 19. Navigation result by architecture

Static navigation remains singular with no React bootstrap. Desktop dropdown interaction passes. At 390×844, the mobile sheet opens/closes, `aria-expanded` moves false/true/false, and Escape closes the sheet and returns focus.

## 20. Chatbot result by architecture

Each route retains one static launcher/panel. Desktop and mobile open/close checks pass with no React/static duplication or clipped controls.

## 21. Post-footer contamination result

Each route finishes with one footer, zero `.pcm-local-seo`, zero `undefined`, no post-footer FAQ, no duplicate conversion block, no homepage body, no soft 404, and no stale promotion.

## 22. Source/finalizer durability

The direct owner/finalizer sequence is byte-idempotent. Missing facts fail before output. The owner uses a checked-in explicit template, not another generated route, and emits the canonical title, schema facts, form defaults, and runtime JSON from the frozen data source.

## 23. Delayed-runtime stability

Raw, initial, ready, ~1.2-second, and 5.4+ second checkpoints preserve the correct H1/title/forms, singular pricing/glance/FAQ, FAQ parity, and directional body with no `undefined`, homepage replacement, or legacy cost block.

## 24. Exact desktop/mobile QA

At 1280×900 and 390×844 there is no page-level horizontal overflow, no broken local images, and no clipped route controls. Quote and glance stack on mobile; the 760px pricing table scrolls internally. Navigation and chatbot interactions pass. The only console message is the expected sandbox `ERR_NETWORK_ACCESS_DENIED` for an external resource, not an application exception.

## 25. Global FAQ/title/body regression result

- Raw title/OG/Twitter: 56/56.
- Completed browser title audit: 55/55 canonical; the known Victoria → Vancouver harness limitation remains excluded.
- Completed browser FAQ audit: 55/55 canonical.
- Target-pair raw FAQ/schema parity: 2/2.
- The historical global raw-shell FAQ differences on 11 browser-normalized routes and raw `.pcm-local-seo` markers on 10 of those routes are unchanged from Step 40; repairing those unrelated pages was outside Step 41 authority.
- Body regression: 40/40, with no homepage/soft-404 replacement, `.pcm-local-seo`, or `undefined` in settled pages.

## 26. Ownership/architecture validation

The validator reports 56 routes, exactly one full-page owner each, and zero collisions. Static declarations match runtime. Ownership/title/chatbot tests pass 32/32, syntax checks pass, and the aggregate dry-run/build order remains valid.

## 27. First aggregate convergence result

First isolated aggregate: **0/56 route drift** and **0/88 asset drift**.

## 28. Second aggregate convergence result

Second isolated aggregate: **0/56 route drift** and **0/88 asset drift**.

## 29. Regression result

The Step 40 38-route set plus both Step 41 directions passes **40/40** for identity, title branding, form defaults, pricing presence, navigation/chatbot presence, body integrity, zero settled `.pcm-local-seo`, and zero settled `undefined`.

## 30. Working-tree route isolation

Before/after hashes show that only `/winnipeg-to-montreal-movers/` and `/montreal-to-winnipeg-movers/` changed among all 56 route HTML files. No existing shared asset drifted; the only added assets are the two path-gated Step 41 files. Aggregate output stayed in the temporary clone.

## 31. Remaining known issues

- The known Victoria → Vancouver browser-harness limitation remains unchanged.
- External font/analytics resources are blocked during offline QA and produce one network-access console error.
- The pre-existing raw-shell FAQ/local-SEO differences listed in section 25 remain unchanged; settled browser output is canonical.
- The repository was already materially dirty before Step 41, so the route hash ledger is the isolation authority.

No deployment was performed.
