# Step 79 — Final 56-route closeout audit

Scope: final read-only all-56 closeout audit. No route HTML, generator, template, route data, ownership/manifest file, finalizer, production asset, navigation, chatbot, conversion runtime, redirect, sitemap, shared infrastructure, Git index, commit, deployment, backup, or rollback point was changed. Browser and aggregate evidence was written outside the repository; this report is the sole Step 79 repository addition.

## 1. Final baseline

- Captured before any audit command.
- Registered route hashes: 56.
- Current asset hashes: 104.
- Branch: `codex/prerender-current-main`.
- HEAD: `8559fd4c18be9a4312c76662820faca69c60b833`.
- Initial Git status: 0 staged, 164 unstaged tracked files, 785 untracked entries (949 porcelain entries total).
- Baseline evidence: `ORIGINAL_BASELINE.json`, `GIT_BASELINE.json`, and `ROUTE_INVENTORY.json` in the isolated Step 79 temp evidence directory.

## 2. Git branch/HEAD/worktree state

The branch and HEAD remained unchanged throughout the audit. The pre-report status matched the captured baseline exactly. The working tree was already substantially dirty before Step 79; nothing was staged, committed, discarded, or cleaned. After the isolation proof, this report is the only intentional Step 79 repository addition.

## 3. Route inventory

- Registered routes: 56.
- Unique registered paths: 56.
- Declared owners: 56.
- Ownerless registered routes: 0.
- Full-page ownership collisions: 0.
- Unexpected ownership-program routes: 0.
- `/vancouver-to-victoria-movers/`: absent.
- `/washington-to-bc-movers/`: absent.

## 4. Ownership/render architecture

`node tools/validate-route-page-ownership.mjs site-copy` passed: all 56 pages have exactly one declared full-page owner and aggregate claims are collision-free. Declared static/React architecture, required route-scoped/static dependencies, bootstrap rules, owner ordering, and registered post-processors passed the current validator and ownership tests. No architecture mismatch or mutable generated-route dependency was found.

## 5. Complete 56-route A/B/C/D table

| # | Route | Owner | Render | Class | Remaining Defect |
| ---: | --- | --- | --- | --- | --- |
| 1 | `/bc-to-washington-movers/` | `generate-spa-routes.mjs` | react-spa | B — Minor cleanup | Settled FAQ questions compute to Source Sans 3, 16px/25.6px/600 instead of Playfair Display, 16px/24px/700 at desktop and mobile. |
| 2 | `/calgary-to-edmonton-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 3 | `/calgary-to-halifax-movers/` | `generate-halifax-calgary-route-pages.mjs` | static | A — Canonical | None |
| 4 | `/calgary-to-montreal-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 5 | `/calgary-to-ottawa-movers/` | `rebuild-calgary-ottawa-routes.mjs` | static | A — Canonical | None |
| 6 | `/calgary-to-toronto-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 7 | `/calgary-to-vancouver-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 8 | `/calgary-to-winnipeg-movers/` | `rebuild-calgary-winnipeg-routes.mjs` | static | A — Canonical | None |
| 9 | `/edmonton-to-calgary-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 10 | `/edmonton-to-montreal-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 11 | `/edmonton-to-ottawa-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 12 | `/edmonton-to-toronto-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 13 | `/edmonton-to-vancouver-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 14 | `/edmonton-to-winnipeg-movers/` | `rebuild-edmonton-winnipeg-routes.mjs` | static | A — Canonical | None |
| 15 | `/halifax-to-calgary-movers/` | `generate-halifax-calgary-route-pages.mjs` | static | A — Canonical | None |
| 16 | `/halifax-to-toronto-movers/` | `update-halifax-toronto-routes.mjs` | static | A — Canonical | None |
| 17 | `/halifax-to-vancouver-movers/` | `rebuild-halifax-vancouver-routes.mjs` | static | A — Canonical | None |
| 18 | `/montreal-to-calgary-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 19 | `/montreal-to-edmonton-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 20 | `/montreal-to-toronto-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 21 | `/montreal-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | static | A — Canonical | None |
| 22 | `/montreal-to-victoria-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 23 | `/montreal-to-winnipeg-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | static | A — Canonical | None |
| 24 | `/ottawa-to-calgary-movers/` | `rebuild-calgary-ottawa-routes.mjs` | static | A — Canonical | None |
| 25 | `/ottawa-to-edmonton-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 26 | `/ottawa-to-toronto-movers/` | `rebuild-ottawa-toronto-routes.mjs` | static | A — Canonical | None |
| 27 | `/ottawa-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | static | A — Canonical | None |
| 28 | `/ottawa-to-victoria-movers/` | `rebuild-victoria-ottawa-route.mjs` | static | A — Canonical | None |
| 29 | `/ottawa-to-winnipeg-movers/` | `fix-winnipeg-static-routes.mjs` | static | A — Canonical | None |
| 30 | `/seattle-to-vancouver-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 31 | `/toronto-to-calgary-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 32 | `/toronto-to-edmonton-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 33 | `/toronto-to-halifax-movers/` | `update-halifax-toronto-routes.mjs` | static | A — Canonical | None |
| 34 | `/toronto-to-montreal-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 35 | `/toronto-to-ottawa-movers/` | `rebuild-ottawa-toronto-routes.mjs` | static | A — Canonical | None |
| 36 | `/toronto-to-vancouver-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 37 | `/toronto-to-victoria-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 38 | `/toronto-to-winnipeg-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | static | A — Canonical | None |
| 39 | `/vancouver-to-calgary-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 40 | `/vancouver-to-edmonton-movers/` | `finalize-vancouver-edmonton-routes.mjs` | static | A — Canonical | None |
| 41 | `/vancouver-to-halifax-movers/` | `rebuild-halifax-vancouver-routes.mjs` | static | A — Canonical | None |
| 42 | `/vancouver-to-montreal-movers/` | `standardize-montreal-vancouver-routes.mjs` | static | A — Canonical | None |
| 43 | `/vancouver-to-ottawa-movers/` | `standardize-montreal-vancouver-routes.mjs` | static | A — Canonical | None |
| 44 | `/vancouver-to-seattle-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 45 | `/vancouver-to-toronto-movers/` | `generate-spa-routes.mjs` | react-spa | A — Canonical | None |
| 46 | `/vancouver-to-winnipeg-movers/` | `rebuild-winnipeg-modern-routes.mjs` | static | A — Canonical | None |
| 47 | `/victoria-to-montreal-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 48 | `/victoria-to-ottawa-movers/` | `rebuild-victoria-ottawa-route.mjs` | static | A — Canonical | None |
| 49 | `/victoria-to-toronto-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 50 | `/victoria-to-vancouver-movers/` | `checked-in-static-route-source` | static | A — Canonical | None |
| 51 | `/winnipeg-to-calgary-movers/` | `rebuild-calgary-winnipeg-routes.mjs` | static | A — Canonical | None |
| 52 | `/winnipeg-to-edmonton-movers/` | `rebuild-edmonton-winnipeg-routes.mjs` | static | A — Canonical | None |
| 53 | `/winnipeg-to-montreal-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | static | A — Canonical | None |
| 54 | `/winnipeg-to-ottawa-movers/` | `fix-winnipeg-static-routes.mjs` | static | A — Canonical | None |
| 55 | `/winnipeg-to-toronto-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | static | A — Canonical | None |
| 56 | `/winnipeg-to-vancouver-movers/` | `rebuild-winnipeg-modern-routes.mjs` | static | A — Canonical | None |

## 6. Final classification totals

- A — Canonical: 55.
- B — Minor cleanup: 1.
- C — Material: 0.
- D — Architecture/source: 0.

The mandatory 56 A / 0 B gate failed.

## 7. Source-durability result

Ownership order, owner/post-processor registration, static/React architecture, direct-owner temporary-tree tests, pair-owner order independence, finalizer idempotency tests, and two aggregate passes are clean. No first-run-only cleanup, route-to-route mutable source dependency, shared-finalizer contamination, or build-order defect was found. D = 0.

## 8. Raw title results

Raw title, `og:title`, `twitter:title`, description presence, self canonical, and self `og:url`: 56/56. Brand suffix appears exactly once and no generic/wrong-direction title was found.

## 9. Rendered title results

Rendered title/OG/Twitter agreement and stability: 56/56 canonical. Rendered descriptions, canonicals, and `og:url` values: 56/56 self-consistent. No page errors occurred.

## 10. Raw FAQ results

Raw FAQ section, one heading, one `FAQPage`, exact question/answer/order parity, no hidden duplicate, and zero `.pcm-local-seo`: 56/56 canonical.

## 11. Rendered FAQ results

Settled rendered FAQ singularity and visible/schema parity: 56/56 canonical. BC → Washington's FAQ content/parity is singular after settlement, but its question typography fails separately in section 16.

## 12. Component-count results

At 1280×900 and 390×844, all 56 routes retained one H1, one primary form, one pricing table, one Route at a Glance block, one FAQ section/heading/schema, and one footer. Applicable quote/pricing/closing-CTA architecture and documented BC → Washington cross-border differences were preserved. No material component-count defect was found.

## 13. Duplicate/contamination results

The 10-second settled sweep covered all 56 routes: zero `.pcm-local-seo`, visible `undefined`, `Moving Cost Breakdown`, homepage signature, soft 404, expired promotion, duplicate glance, duplicate pricing table, duplicate FAQ heading, duplicate FAQPage, or application error. Legitimate navigation/footer/related-route mentions were not treated as body contamination.

## 14. Route-fact consistency

Directional form values, route identity, pricing coverage, title direction, FAQ parity, and current chatbot pricing tests were internally consistent. A legacy raw scanner reported Ottawa ↔ Victoria because it matches the negated sentence “not guaranteed long-distance quotes” with `/guaranteed long-distance/i`; inspection confirms this is a false positive and the current wording explicitly rejects a guarantee. No genuine internal fact conflict was found.

## 15. Form-identity results

Actual settled `from`/`to` values passed on all 56 routes at desktop and mobile, including `British Columbia` → `Washington State`. No homepage default, reversed direction, unrelated city, or required blank value was found.

## 16. Typography results

- H1: 56/56 use Playfair Display at 48px/60px/700 desktop and 36px/45px/700 mobile.
- Body/forms/buttons/pricing: 56/56 use Source Sans 3 where measured.
- FAQ answers: 56/56 use Source Sans 3.
- FAQ questions: 55/56 satisfy Playfair Display, 16px/24px/700.
- Failure: `/bc-to-washington-movers/` computes FAQ questions as Source Sans 3, 16px/25.6px/600 at both exact viewports.

This is not an approved exception. `docs/ROUTE_PAGE_STANDARD.md` requires Playfair 16px/24px/700, and the BC → Washington cleanup record says headings use Playfair Display. The route is B — Minor cleanup.

## 17. Responsive QA

All 56 routes were evaluated at 1280×900 and 390×844. No page-level horizontal overflow, missing form, missing pricing/facts/FAQ/footer, or application error was found. Standard 760px pricing tables remained inside their mobile scrollers; the narrower BC → Washington cross-border table legitimately fits its container. The sole failure is the typography defect above.

## 18. Navigation QA

Representative checked-in-static, generated-static, and React routes—including Calgary ↔ Halifax, Vancouver ↔ Toronto, Vancouver ↔ Winnipeg, Victoria → Vancouver, BC → Washington, and Montreal → Edmonton—opened mobile navigation with `aria-expanded=true`, closed with Escape to `false`, supported repeated cycles, and showed no mobile trigger on desktop. Static routes returned focus to the Open menu control. React routes returned focus to their trigger button. No duplicate navigation or residual modal state causing page failure was found. Desktop dropdown content opened; desktop ARIA/Escape behavior was evaluated under the existing documented “where expected” contract.

## 19. Chatbot QA

Representative static and React routes each had one launcher, opened one chat interface, and closed successfully without duplicate initialization or page errors. Victoria → Vancouver's exact 1280×900 and 390×844 harness additionally confirmed one panel, no clipping/overlap, intact route context, and successful open/close. The custom generic panel-ancestor geometry probe was discarded because its selector chose a wrapper rather than the panel; it is not counted as a route failure.

## 20. Delayed-runtime stability

At 300ms, 1.5s, and 5.5s, the required representative set—Vancouver ↔ Toronto, Victoria → Vancouver, Calgary ↔ Halifax, Vancouver ↔ Winnipeg, BC → Washington, Montreal → Edmonton (React), and Calgary → Ottawa (checked-in/generated static family)—retained stable H1, actual form values, singular pricing/glance/FAQ, title, and route body. There was no homepage replacement, legacy recurrence, `undefined`, soft 404, or page error. BC → Washington's typography mismatch was stable at every checkpoint.

## 21. Victoria → Vancouver harness status

- Current classification: A — Canonical.
- Targeted browser status: PASS.
- Generic harness status: PASS; `DOMContentLoaded` occurred at approximately 286ms, load at 299ms, with no pending requests or page errors.
- Exact viewport QA: PASS at 1280×900 and 390×844.
- Deployment blocker: no.

The old blanket-harness stall is not present in the current route. Restricted external font/tag/SDK requests were denied by the test environment but did not block navigation or route QA.

## 22. Ownership/tests results

- Ownership/architecture validator: PASS, 56 routes, one owner each, zero collisions.
- Test files: 3.
- Tests: 36 attempted, 36 passed, 0 failed, 0 skipped, 0 cancelled, 0 todo.

## 23. Syntax results

Tool modules checked with `node --check`: 128 attempted, 128 passed, 0 failed.

## 24. Browser regression

Current deduplicated suite: 54 attempted, 54 passed, 0 failed. The suite includes BC → Washington and Victoria → Vancouver. Toronto ↔ Victoria remain outside this deduplicated list by established special handling and passed the 56-route title, FAQ, metadata, component, typography, form, and settled-state audits.

## 25. Aggregate pass 1

A fresh no-hardlink temporary Git clone was overlaid with the current `site-copy`, `tools`, and `package.json`, then hashed before the aggregate build.

- Route drift: 0/56.
- Asset drift: 0/104.
- Reconciliation/cleanup: none.

## 26. Aggregate pass 2

The complete aggregate ran a second time only after pass 1 was proven clean.

- Route drift versus pass 1: 0/56.
- Asset drift versus pass 1: 0/104.

## 27. Original-workspace isolation

Immediately before creating this report, comparison with the Step 79 baseline proved:

- Registered route changes: 0/56.
- Asset changes: 0/104.
- Branch changed: no.
- HEAD changed: no.
- Git status changed: no.

The aggregate clone used no hardlinks. Browser output and hashes were written outside the repository. This report is the only intentional Step 79 repository addition.

## 28. Deployment-scope inventory

No deployment commit is authorized while the B route remains. The exact route-program allowlist for a future isolated commit must be constructed from:

- Route HTML: the 56 `site-copy/<route>/index.html` paths corresponding exactly to section 5—no additional route page.
- Generators/source: the owners and registered post-processors in `tools/route-page-ownership.mjs` and `tools/route-writer-manifest.mjs`, plus `tools/run-owned-route-build.mjs`, `tools/route-ownership-guard.mjs`, and their imported route helpers/templates.
- Route data: `calgary-edmonton-route-data.mjs`, `calgary-winnipeg-route-data.mjs`, `edmonton-ottawa-route-data.mjs`, `halifax-toronto-route-data.mjs`, `montreal-calgary-route-data.mjs`, `seattle-vancouver-route-data.mjs`, `toronto-vancouver-route-data.mjs`, `toronto-victoria-route-data.mjs`, `vancouver-winnipeg-route-data.mjs`, `victoria-vancouver-route-data.mjs`, and `winnipeg-montreal-route-data.mjs`, together with the route-owned hub data modules and `tools/templates/` inputs referenced by those owners.
- Route-scoped assets: the CSS/JS pairs `step33` through `step47`, excluding nonexistent step48, plus `step49-seattle-vancouver.css/js` and `step50-victoria-vancouver.css/js` (34 files total).
- Shared assets legitimately changed by the program: `site-copy/assets/conversion-boost.js` and `site-copy/assets/index-CNBNs70h.js`. Static nav/chat assets must be included only if their program changes are shown in the final staged diff.
- Tests/validators: `route-page-ownership.test.mjs`, `route-title-metadata.test.mjs`, `chatbot-route-pricing.test.mjs`, `validate-route-page-ownership.mjs`, `audit-route-title-metadata.mjs`, `audit-route-faq-architecture.mjs`, `audit-step33-regressions.mjs`, and the route-specific current audit modules used by the program.
- Documentation: `docs/ROUTE_PAGE_STANDARD.md`, `docs/ROUTE_PAGE_OWNERSHIP.md`, the Step 21/28/31/32 and Step 33–79 route-program reports.
- Other: `package.json` only for the route scripts actually required by the isolated commit. Any changed hub/cost-guide/sitemap file must be included only if a clean rebuild from the final allowlist proves it is a required route-program output.

Because the workspace contains 949 pre-existing status entries and the mandatory classification gate failed, the final staged deployment file list is not yet safe to freeze. Step 80 must not start until the B defect is corrected and this closeout audit is rerun.

## 29. Unrelated files explicitly excluded

The future route deployment commit must exclude all root `STEP_*.json`, `STEP_*.log`, `STEP_*.err`, PID/path files, screenshots, temp clones, `.codex/`, `.codex-spreadsheet-work/`, `drafts/`, `outputs/`, `LOCAL_SEO_AUDIT.md`, `NAP_AUDIT.md`, `SEO_TODO.md`, `nove29`, unrelated blog/local/office/service page work, legacy `site-copy/movers-*` alias directories not in the 56-route registry, and unrelated tooling such as local-SEO, mirror, office-page, blog-catalog, sitemap-live, and patch scripts. No unregistered route page may enter the commit.

## 30. Backup/rollback readiness

`wrangler.toml` identifies Worker `newpurely`, `src/index.js`, and `site-copy` as the asset directory. A local Wrangler account cache exists, so Step 80 can safely identify production through an authenticated read-only Wrangler deployment/version listing before any deploy. No production version ID is stored in the repository or local report history, so it was intentionally not claimed or captured in Step 79.

Before deployment, Step 80 must capture the current production Cloudflare Worker version ID, determinable production Git/deployment commit, branch, pre-deploy HEAD, exact deployment commit, production smoke baseline, and tested rollback procedure. The rollback procedure should select the captured previous version using the installed Wrangler version's supported rollback command (normally `wrangler rollback <previous-version-id>`), then repeat production smoke checks. Step 80 must verify the installed CLI syntax before relying on it. No backup, deploy, or rollback occurred here.

## 31. Remaining known issues

Mandatory blocker:

- `/bc-to-washington-movers/`: FAQ questions render in Source Sans 3 at 16px/25.6px/600 rather than the required Playfair Display at 16px/24px/700 on both desktop and mobile. This is B — Minor cleanup.

Non-blocking harness note: the legacy consistency scanner's Ottawa ↔ Victoria matches are false positives caused by negated “not guaranteed” wording. The current Victoria → Vancouver generic harness is healthy and is not a blocker.

## 32. Final GO / NO-GO decision

The program does not meet the mandatory 56 A / 0 B classification gate. All ownership, source durability, metadata, FAQ parity, component, form, navigation/chatbot, tests, syntax, browser regression, aggregate, and isolation gates are otherwise clean.

Classification: 55 A / 1 B / 0 C / 0 D.

Step 79 deployment readiness: NO-GO.
