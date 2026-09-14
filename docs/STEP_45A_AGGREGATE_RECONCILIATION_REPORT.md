# Step 45A Aggregate Reconciliation Report

Date: 2026-09-06

Scope: reconcile only the 10 unrelated first-pass route drifts that blocked formal Step 45 completion. No deployment was performed and Step 46 was not started.

## 1. Exact 10 drifted routes reproduced

The original clean-clone procedure reproduced exactly 10 changed route files and zero changed assets.

| Route | Owner | Registered post-processors |
| --- | --- | --- |
| `/montreal-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | FAQ finalizer, title normalizer |
| `/montreal-to-winnipeg-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | FAQ finalizer, title normalizer |
| `/ottawa-to-vancouver-movers/` | `standardize-montreal-vancouver-routes.mjs` | FAQ finalizer, title normalizer |
| `/toronto-to-winnipeg-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | FAQ finalizer, title normalizer |
| `/vancouver-to-montreal-movers/` | `standardize-montreal-vancouver-routes.mjs` | FAQ finalizer, title normalizer |
| `/vancouver-to-ottawa-movers/` | `standardize-montreal-vancouver-routes.mjs` | FAQ finalizer, title normalizer |
| `/vancouver-to-winnipeg-movers/` | `rebuild-winnipeg-modern-routes.mjs` | FAQ finalizer, title normalizer |
| `/winnipeg-to-montreal-movers/` | `rebuild-winnipeg-montreal-routes.mjs` | FAQ finalizer, title normalizer |
| `/winnipeg-to-toronto-movers/` | `rebuild-toronto-winnipeg-routes.mjs` | FAQ finalizer, title normalizer |
| `/winnipeg-to-vancouver-movers/` | `rebuild-winnipeg-modern-routes.mjs` | FAQ finalizer, title normalizer |

Evidence: `STEP_45A_BEFORE.json` and `STEP_45A_FIRST_REPRO.json`.

## 2. Before/first/second hash comparison

All hashes are SHA-256. Every second-pass hash equals its first-pass hash.

| Route | Before hash | First-aggregate hash | Second-aggregate hash |
| --- | --- | --- | --- |
| Montreal→Vancouver | `eeb645d9f78399a0645ad21ab9f9fdba5eff4dd29b28e9faee7dee519177d6e3` | `b51c0331d8dcff83983d2016cb6fc2f43993e347e12a5a0646cfca697aa9f238` | `b51c0331d8dcff83983d2016cb6fc2f43993e347e12a5a0646cfca697aa9f238` |
| Montreal→Winnipeg | `2b8481e88779712cc1df5b6206f40b3bc0782bec8979714d6ef38993c4b19d1a` | `0dadfd395c8b51daa959775b484124b3f2aef13340819357050b245a874d1937` | `0dadfd395c8b51daa959775b484124b3f2aef13340819357050b245a874d1937` |
| Ottawa→Vancouver | `28df8f94ba244388bd18d5b69c3751366a2e5a493c0e94b75d64a747365c7bb3` | `4fa4ff0b1a1baab3d8faea003140a5367b5a477f90cf1adb0b724947df71dc2b` | `4fa4ff0b1a1baab3d8faea003140a5367b5a477f90cf1adb0b724947df71dc2b` |
| Toronto→Winnipeg | `7ec1d141ae74561e409a613e703c1f69faea5078f953a92040dc12176c609698` | `1eab305cb76863120a2dbc1ba9277c20ab7ad476e2e12c3bb8e1623ff3aaac2c` | `1eab305cb76863120a2dbc1ba9277c20ab7ad476e2e12c3bb8e1623ff3aaac2c` |
| Vancouver→Montreal | `0153b1e2668fd7c61ce84f1a8dc7ea4bccb8c048050b155b555ee7d99fde31dd` | `5d76e55a172bec3b261ad2c44a9eb17bd7daa163476d9ab8ba540dcb905101e9` | `5d76e55a172bec3b261ad2c44a9eb17bd7daa163476d9ab8ba540dcb905101e9` |
| Vancouver→Ottawa | `ed7c12d80770f68fe3d8bc4412c0703a52cfc4850abe163f8f0f641f5ebfccd6` | `85f9aea7c1636d55f6d63e5c6002e5b082be80541dc154808d4f44a64dffa8f9` | `85f9aea7c1636d55f6d63e5c6002e5b082be80541dc154808d4f44a64dffa8f9` |
| Vancouver→Winnipeg | `4a26a27769557873f2bb7a5d94e384c84cd434e4c07bd60625d20ce642200975` | `9a1b15700dc37ce56889732281355e7d8d2f283b5121db8780dcb752f45cfb19` | `9a1b15700dc37ce56889732281355e7d8d2f283b5121db8780dcb752f45cfb19` |
| Winnipeg→Montreal | `0d89791b76cd77ade8b360a59b6bc5cca1af3f9ade2a862bcdef0a6cd3b1854e` | `b6c7ae43e3b5345da2e9db0dff12f40c83f6e345be5cd18a27a6a8ab76da82bb` | `b6c7ae43e3b5345da2e9db0dff12f40c83f6e345be5cd18a27a6a8ab76da82bb` |
| Winnipeg→Toronto | `390373252b0ac647e2bc67d93cd0c47865a5d0a0192d1d8f9aeb41b61cfb79f9` | `7d503ce295796b7fe0630784a58ea52d9a99c5788ec06ed33d092664713c79f9` | `7d503ce295796b7fe0630784a58ea52d9a99c5788ec06ed33d092664713c79f9` |
| Winnipeg→Vancouver | `f498e582c62d3695b6b308f9257acb8040a406a580adeacfaee674a018bb139e` | `2496da191855fd98fe66447812a30dcd6c1c12567adc95a589ec6efa23e13fbd` | `2496da191855fd98fe66447812a30dcd6c1c12567adc95a589ec6efa23e13fbd` |

## 3. Root cause for each drift

The direct full-page owner pass changed zero bytes on all 10 routes. Drift was introduced by the already-registered deterministic post-processor chain.

| Route group | Drift class | Exact first differing region | Root cause |
| --- | --- | --- | --- |
| Montreal→Vancouver, Ottawa→Vancouver, Vancouver→Montreal, Vancouver→Ottawa | 3 + 7 | Head `<title>`; the title normalizer adds the authoritative marker and exact terminal brand suffix. It also aligns `og:title` and inserts/aligned `twitter:title` where absent. | Checked-in HTML predated the current title contract. |
| Montreal→Winnipeg, Winnipeg→Montreal | 3 + 7 | Head `<title>` authoritative marker; metadata fields are normalized to the already-branded title. | Checked-in HTML had not received the current authoritative-title normalization. |
| Toronto→Winnipeg, Winnipeg→Toronto | 2 + 3 + 7 | Head `<title>` first; title/OG/Twitter gain the exact suffix and authoritative marker. FAQ finalizer inserts the one visible-FAQ-matched `FAQPage` entity before `</head>`. | Checked-in HTML predated both registered finalizer outputs. |
| Vancouver→Winnipeg, Winnipeg→Vancouver | 2 + 3 + 7 | Head `<title>` first; authoritative marker is added. FAQ finalizer inserts the one visible-FAQ-matched `FAQPage` entity before `</head>`. | Checked-in HTML predated both registered finalizer outputs. |

No owner, route data, asset, presentation, or runtime mutation was responsible for the first-pass drift. Every route is Case 1: first differs from the stale working-tree snapshot and second equals first.

## 4. Shared/common causes found

The 10 routes are four owner families but one convergence pattern: checked-in HTML was stale relative to two global registered post-processors, `finalize-route-faq-architecture.mjs` and `normalize-route-title-metadata.mjs`. The FAQ finalizer affected four routes; the title normalizer affected all 10.

## 5. Whether drift was inherited or Step 45-caused

This was inherited convergence debt. The durable owners and post-processors were already capable of producing these exact outputs before Step 45. Step 45 changed none of the four owners, neither global finalizer, their relevant templates, nor the source data for these routes. Step 45 merely exposed the existing source/output divergence by running the complete deterministic aggregate chain.

## 6. Files changed

Product output changes are limited to the exact 10 reproduced HTML files listed in section 1. The only source/test change made by Step 45A is `tools/audit-step33-regressions.mjs`, which adds the previously uncovered Toronto↔Winnipeg pair to browser regression coverage.

Evidence artifacts created at the repository root:

- `STEP_45A_BEFORE.json`
- `STEP_45A_FIRST_REPRO.json`
- `STEP_45A_RECONCILED_WORKTREE.json`
- `STEP_45A_VALIDATION_BASE.json`
- `STEP_45A_AGGREGATE_FIRST.json`
- `STEP_45A_AGGREGATE_SECOND.json`
- `STEP_45A_TITLE_GLOBAL.json`
- `STEP_45A_FAQ_GLOBAL.json`
- `STEP_45A_REGRESSION.json`

## 7. Durable source fixes

No writer-code correction was needed: direct-owner and post-processor tracing proved the durable source chain was already correct, route-scoped, deterministic, and idempotent. The intended regeneration mechanism was therefore used and its canonical post-processed outputs were checked into the exact 10 owned route files. This removes the stale output layer that caused first-pass drift. Regression coverage was durably extended from 47 to 49 unique routes.

## 8. Mutable cross-route dependencies found/removed

None were found in the four responsible owners. `rebuild-toronto-winnipeg-routes.mjs` and `rebuild-winnipeg-modern-routes.mjs` use explicit immutable templates. `rebuild-winnipeg-montreal-routes.mjs` uses a frozen template under `tools/templates/winnipeg-routes`, not generated route output. `standardize-montreal-vancouver-routes.mjs` generates directly. Supporting cost-guide/sitemap reads are not mutable route-template dependencies. No dependency was added or removed.

## 9. Idempotency findings

- Direct owner chain: first run `0/56` route drift; second run `0/56` route drift for the inspected owner stage.
- Registered owner→FAQ→title pipeline: after its first canonicalizing pass, the second direct pipeline pass changed zero route bytes.
- Exact 10 routes: all Case 1; no Case 2, 3, or 4 results.
- Full aggregate: both corrected clean-clone passes changed zero route or asset bytes.

## 10. Ottawa ↔ Toronto unchanged confirmation

The approved Step 45 pair was not modified.

| Route | Step 45A current hash | Matches pre-reconciliation hash |
| --- | --- | --- |
| `/ottawa-to-toronto-movers/` | `7071510a64c078d3c77df04280f1006bc7e25606babdd4dc3bc5c26d1999fa43` | Yes |
| `/toronto-to-ottawa-movers/` | `fe23c152c6b687a87cedc560138f84ab0bcce1fc88aae9bd62a3640b9189b95d` | Yes |

The 49-route browser regression includes both routes and confirms route identity, directional forms, canonical title fields, pricing, navigation/chat, no local-SEO block, no `undefined`, and no homepage/soft-404 replacement. Pair FAQ and architecture acceptance remain canonical, and its direct owner remains byte-idempotent.

## 11. Global title/FAQ/ownership results

- Ownership: PASS — 56 routes, exactly one declared full-page owner each, zero aggregate claim collisions.
- Raw title contract: 56/56 — one exact terminal brand suffix with raw title, OG title, and Twitter title agreement.
- Runtime title audit: 55/55 audited routes canonical. Victoria→Vancouver was excluded because of the previously known browser-harness limitation.
- Raw FAQ singularity: 56/56 — one FAQ section, one FAQ heading, and one `FAQPage` entity per route.
- Runtime FAQ/parity audit: 55/55 evaluable routes canonical; Victoria→Vancouver was the one known runtime-audit-unavailable result.
- `.pcm-local-seo`: zero rendered matches on all 55 evaluable FAQ-audit routes and all 49 regression routes.
- `undefined`: zero across raw HTML for 56/56 and zero in all 49 browser regression pages.
- Tests: 33/33 passing.

## 12. Regression result

PASS: 49/49, with 49 unique routes. The count increased from 47 only because the previously absent Toronto→Winnipeg and Winnipeg→Toronto drift routes were added. All 10 Step 45A routes and both Step 45 routes are now covered.

## 13. Browser smoke-check result

PASS for all 10 reconciled routes. The 49-route browser regression checks route-specific H1 identity, directional form defaults, canonical title/OG/Twitter fields, pricing-table presence, rendered absence of `.pcm-local-seo` and `undefined`, navigation, chatbot, and homepage/404 contamination. The FAQ runtime audit additionally confirms singular visible FAQ/schema parity for all 10. No presentation/runtime source was changed, so full desktop/mobile redesign QA was not required.

## 14. First aggregate result

Corrected working tree tested in a clean temporary clone:

- `0/56` route drift
- `0/96` asset drift

Evidence: `STEP_45A_VALIDATION_BASE.json` → `STEP_45A_AGGREGATE_FIRST.json`.

## 15. Second aggregate result

Second complete aggregate in the same clean validation clone:

- `0/56` route drift
- `0/96` asset drift

Evidence: `STEP_45A_AGGREGATE_FIRST.json` → `STEP_45A_AGGREGATE_SECOND.json`.

## 16. Working-tree route accounting

Relative to the Step 45A pre-aggregate hash baseline, exactly the 10 routes in section 1 changed and no asset changed. Each file changed only because the registered post-processor chain produced its canonical metadata and, for four routes, canonical FAQ schema. No route outside the reproduced set persists as a Step 45A output change. Any interrupted diagnostic collateral was restored byte-for-byte before the final accounting snapshot.

## 17. Remaining known issues

Victoria→Vancouver still has the pre-existing browser-harness limitation that made its runtime title audit excluded and its FAQ runtime audit unavailable. It is unrelated to these 10 routes and did not drift in either corrected aggregate pass. No Step 45A convergence issue remains.

## 18. Formal Step 45 status

All Step 45 pair requirements, ownership/tests/regression requirements, and both aggregate convergence gates pass.

`Step 45 is now complete.`
