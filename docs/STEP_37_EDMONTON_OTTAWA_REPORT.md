# Step 37 — Edmonton ↔ Ottawa route standardization

## 1. Files changed

- Route output: `site-copy/edmonton-to-ottawa-movers/index.html`, `site-copy/ottawa-to-edmonton-movers/index.html`.
- Pair assets: `site-copy/assets/step37-edmonton-ottawa.css`, `site-copy/assets/step37-edmonton-ottawa.js`.
- Durable source/build path: `tools/edmonton-ottawa-route-data.mjs`, `tools/finalize-edmonton-ottawa-routes.mjs`, `tools/route-page-ownership.mjs`, `tools/route-writer-manifest.mjs`, `tools/route-page-ownership.test.mjs`.
- QA/evidence: `tools/audit-step37-edmonton-ottawa.mjs`, `STEP_37_EDMONTON_OTTAWA_AUDIT.json`, `STEP_37_BODY_REGRESSION.json`.
- Documentation: `docs/ROUTE_PAGE_OWNERSHIP.md`, this report.

No shared runtime bundle, shared conversion asset, or static navigation/chat asset was changed.

## 2. Edmonton → Ottawa changes

The hydration-free route now settles to the canonical quote, five-row pricing, glance, 12-question FAQ, metadata, typography, and directional form contract. Incorrect Ontario tax, Ottawa river-valley, Ontario vehicle-registry, westbound/energy-sector, stale promotion, and legacy pricing language were removed or corrected.

## 3. Ottawa → Edmonton changes

The React route now settles to the same presentation contract while retaining westbound Edmonton-specific content. It gained one canonical pricing section/table, canonical glance, a route-specific 12-question FAQ, corrected broker/network wording, correct metadata, and stable Ottawa → Edmonton defaults.

## 4. Final owner/render architecture

- Edmonton → Ottawa: `checked-in-static-route-source`, hydration-free static, finalized by `finalize-edmonton-ottawa-routes.mjs`.
- Ottawa → Edmonton: `generate-spa-routes.mjs`, React SPA, finalized by the same pair-scoped finalizer.

## 5. Confirmation of static/React split

Confirmed. Edmonton → Ottawa has zero module bootstraps and one static-nav/static-chat dependency each. Ottawa → Edmonton has one React module bootstrap and zero static-nav/static-chat dependencies.

## 6. Authoritative route facts

Both directions use approximately 3,500 km, 7–18 days, and planning prices of Studio $2,500+, 1-bedroom $4,700+, 2-bedroom $6,300+, 3-bedroom $10,000+, and 4+ bedroom $15,000+, giving an overall $2,500–$15,000+ range.

## 7. Route-fact corrections, if any

The durable cost guide and exact Ottawa → Edmonton component agree on the five symmetric prices and approximately 3,500 km. The static Edmonton → Ottawa snapshot's 7–19-day value conflicted with the exact React component, its FAQ, and its table; the route-specific React authority won, so both directions are 7–18 days. No directional price asymmetry was found.

## 8. Contamination/copy errors removed

Edmonton → Ottawa no longer claims an Ontario energy-sector/Western Canada destination, Ontario has no PST, Ottawa lies on Edmonton's North Saskatchewan River park system, or that an Ontario vehicle transfer uses an Alberta-style registry agent. Legacy cost headings and the expired September promotion no longer survive in the settled page.

## 9. Directional form result

Settled actual values are Edmonton, AB → Ottawa, ON and Ottawa, ON → Edmonton, AB. Values remained correct after all scheduled retries.

## 10. Ottawa grammar corrections

Visible and schema copy now uses “an Ottawa to Edmonton move” and “an Ottawa-Edmonton move.” The quote heading likewise uses “Request an Ottawa to Edmonton moving quote.” No malformed `a Ottawa`, `A Ottawa`, or `What Makes a Ottawa` survives.

## 11. Metadata/title/OG/Twitter result

Each route has one route-specific canonical title with exactly one `| Purely Canadian Movers` suffix. Raw title, settled title, Open Graph title, and Twitter title match. Descriptions are route-specific; canonical and Open Graph URLs are self-referential.

## 12. FAQ/schema result

Each route has one visible FAQ section, one heading, 12 directional questions, and one `FAQPage`. Visible questions/answers exactly match schema in content and order. There is no hidden generic FAQ and zero `.pcm-local-seo`.

## 13. Terminology corrections

Canonical copy uses Declared Value Protection, planning ranges, written estimates, interprovincial transit, Great Canadian Van Lines agent-network coordination, and no broker-style handoff. Stale insurance/valuation, guaranteed-price, direct-crew, and random-subcontractor claims were removed from pair content.

## 14. Typography result

Computed headings use Playfair Display and body/forms/buttons use Source Sans 3. H1 computes to 48px/60px/700 at 1280px and 36px/45px/700 at 390px on both routes.

## 15. Quote-panel result

Both routes settle with one quote panel and one form, a maximum 1120px shell, canonical card/accent/radius/shadow treatment, six trust pills, written-estimate and verified-company treatment, directional heading/defaults, two desktop columns, and one mobile column. The expired promotion is absent.

## 16. Pricing result

Both routes settle with one `.pcm-route-cost`, one table, five authoritative rows, canonical “How much does it cost…” heading, $2,500–$15,000+ range, planning disclaimer, and Declared Value Protection link. The table has a 760px minimum width and scrolls inside its container at 390px.

## 17. Route at a Glance result

Each route has exactly one canonical glance component showing ~3,500 km, 7–18 days, and $2,500–$15,000+. It uses three desktop columns and one mobile column.

## 18. Main-content result

Directional content remains distinct. Edmonton → Ottawa retains Alberta-origin/eastbound/Ottawa-access planning; Ottawa → Edmonton retains Ontario-origin/westbound/Edmonton-arrival, winter, registry, river-valley, elevator, and delivery content. Only structure, contaminated claims, terminology, and presentation were normalized.

## 19. Navigation result by architecture

Edmonton → Ottawa retains static navigation; desktop dropdown, mobile sheet, `aria-expanded` false → true → false, Escape close, and focus return pass. Ottawa → Edmonton retains React navigation; desktop dropdown and mobile menu pass with `aria-expanded` false → true → false. Neither route has duplicate navigation.

## 20. Chatbot result by architecture

Edmonton → Ottawa retains static chat and Ottawa → Edmonton retains React chat. Each has one launcher and one panel; desktop/mobile open and close interactions pass without clipping or duplication.

## 21. Post-footer contamination result

Each route has one footer, no generic post-footer FAQ, no duplicate conversion block, no homepage/soft-404 body, no stale promotion, no `undefined`, and zero `.pcm-local-seo`.

## 22. Source/finalizer durability

The pair facts are frozen in `edmonton-ottawa-route-data.mjs`. The registered finalizer is ownership-guarded, pair-scoped, preserves both rendering classes, emits the authoritative title marker, FAQ/schema, and asset registration, and is byte-idempotent. Two direct runs produce identical hashes; the 18 ownership tests include a dedicated mixed-rendering/idempotence test.

## 23. Exact desktop/mobile QA

Exact 1280×900 and 390×844 viewports pass on both routes: zero page-level overflow, zero broken images, no clipped core controls, two-column/one-column quote behavior, three-column/one-column glance behavior, and internal mobile pricing scroll. Pair-local application errors were zero.

## 24. Global FAQ/title/body regression result

- FAQ: the 54 untouched routes retain their previously established raw contracts, both changed routes pass exact raw and settled parity, and 55 completed browser checks were canonical. Victoria → Vancouver retained its documented harness hang and canonical raw fallback, giving 56/56 combined coverage.
- Titles: an independent raw sweep passed 56/56; all 55 completed browser checks were canonical before the same known Victoria hang.
- Body: the required 28-route hydration/body regression passed 28/28 with no homepage or soft-404 replacement.

## 25. Ownership/architecture validation

PASS: 56 routes, one owner each, zero collisions. Ownership/architecture validation, 18 ownership tests, four title-normalizer tests, syntax checks, and aggregate dry run all pass. Edmonton → Ottawa remains static; Ottawa → Edmonton remains React.

## 26. First aggregate convergence result

PASS in a fresh history-preserving temporary Git repository copy: 0/56 route drift and zero shared-file drift.

## 27. Second aggregate convergence result

PASS: 0/56 route drift and zero shared-file drift.

## 28. Regression result

The mandated 28-route set passed route identity, title branding, form defaults, pricing presence, zero local SEO, navigation/chat presence, and no homepage/404 replacement. The two Step 37 routes additionally passed full FAQ, facts, layout, and mixed-architecture interaction checks.

## 29. Working-tree route isolation

Before/after hashes show that only `/edmonton-to-ottawa-movers/` and `/ottawa-to-edmonton-movers/` changed among all 56 route HTML files. The two monitored shared writers, `assets/index-CNBNs70h.js` and `assets/conversion-boost.js`, did not change. No aggregate output was copied back.

## 30. Remaining known issues

- Victoria → Vancouver still hangs the unrestricted browser harness; its raw title and FAQ contracts remain canonical. This is pre-existing and outside Step 37.
- Local QA reports the expected sandbox-blocked external analytics/pixel request.
- Opening the existing React mobile navigation emits its pre-existing Radix warning about a missing dialog description; Step 37 did not change the compiled React navigation.

Step 37 is complete. No deployment was performed, and Step 38 was not started.
