# Step 46A aggregate reconciliation report

## 1. Exact reproduced seven-route drift set

The original Step 46 failure was reproduced in a fresh temporary Git clone with the current working tree overlaid before any Step 46A repair. The first aggregate changed exactly these seven routes and no others:

- `/calgary-to-ottawa-movers/`
- `/ottawa-to-calgary-movers/`
- `/winnipeg-to-montreal-movers/`
- `/montreal-to-winnipeg-movers/`
- `/ottawa-to-winnipeg-movers/`
- `/winnipeg-to-ottawa-movers/`
- `/victoria-to-ottawa-movers/`

The reproduced result was 7/56 route drift and 0/98 asset drift on pass one, followed by 0/56 route drift and 0/98 asset drift on pass two.

## 2. Before / first / second aggregate hashes

| Route | Before hash | First aggregate hash | Second aggregate hash |
|---|---|---|---|
| Calgary → Ottawa | `d2f0040b9bba47d086ae6f130ee0407bb2908c037bd8ad7b9522ab3561bb54b8` | `a4c75e91650df02dd7d2bbc48e72f742e1d2c94ea37306ccfb277eaac6365c15` | `a4c75e91650df02dd7d2bbc48e72f742e1d2c94ea37306ccfb277eaac6365c15` |
| Ottawa → Calgary | `bd14382901f3b4c44fd8416cfb6c18fd0b4fe80a04cee3843e21f647b8496b7b` | `decbeefbe2e69ab1fa2c66b5ed21c9cb57f6f5a22ab8bef19fdec57b31bfa2bd` | `decbeefbe2e69ab1fa2c66b5ed21c9cb57f6f5a22ab8bef19fdec57b31bfa2bd` |
| Winnipeg → Montreal | `b6c7ae43e3b5345da2e9db0dff12f40c83f6e345be5cd18a27a6a8ab76da82bb` | `555d7f0f9f41efa2b0d759c3eca7d91b311b6432aa69e9256b31fd3e3a7e8f20` | `555d7f0f9f41efa2b0d759c3eca7d91b311b6432aa69e9256b31fd3e3a7e8f20` |
| Montreal → Winnipeg | `0dadfd395c8b51daa959775b484124b3f2aef13340819357050b245a874d1937` | `cddd2e944f46a5fad38de165963939504b4266003d875a25cb0c560604258192` | `cddd2e944f46a5fad38de165963939504b4266003d875a25cb0c560604258192` |
| Ottawa → Winnipeg | `f084ea70a326dc62ff9004ef23b12e4edbc05cef07ea0e84c8e56b87a0584645` | `eba742f74f23854178fe040e2805df536a184067def3d698891079ae1bc3a0e3` | `eba742f74f23854178fe040e2805df536a184067def3d698891079ae1bc3a0e3` |
| Winnipeg → Ottawa | `b8b2e352f457336d7b3fc81231068f41f97c6e2175fbc92178128a85596bf334` | `586bc6a8d0553807c9d21156c7db33e9afcbff15ec08ce8e604c71933d97672d` | `586bc6a8d0553807c9d21156c7db33e9afcbff15ec08ce8e604c71933d97672d` |
| Victoria → Ottawa | `cfde819c8b7a6e216312765a874dfbcecda90acb0ea1792c4ac5f1ac01a4590a` | `692b87dc9df59d3ba98721ac59e931caa9fa601531712db651d77ab215bbb7f2` | `692b87dc9df59d3ba98721ac59e931caa9fa601531712db651d77ab215bbb7f2` |

## 3. Root cause for each route

| Route | Owner | First differing region | Responsible writer | Drift class | Root cause |
|---|---|---|---|---|---|
| Calgary → Ottawa | `rebuild-calgary-ottawa-routes.mjs` | Head asset links near `static-chat.css` | Full-page owner | Mutable cross-route dependency; build-order dependency | The owner read generated `/toronto-to-winnipeg-movers/index.html`, after Step 46 had attached its pair-only CSS/JS. |
| Ottawa → Calgary | `rebuild-calgary-ottawa-routes.mjs` | Head asset links near `static-chat.css` | Full-page owner | Mutable cross-route dependency; build-order dependency | Same generated-route dependency as the forward direction. |
| Winnipeg → Montreal | `rebuild-winnipeg-montreal-routes.mjs` | Head asset links near `static-chat.css` | Pair generator | Cross-pair template contamination | The owner used the Toronto→Winnipeg template as a shell; Step 46 had placed pair-only CSS/JS in that reusable template. |
| Montreal → Winnipeg | `rebuild-winnipeg-montreal-routes.mjs` | Head asset links near `static-chat.css` | Pair generator | Cross-pair template contamination | Same contaminated reusable-template boundary as the forward direction. |
| Ottawa → Winnipeg | `fix-winnipeg-static-routes.mjs` | Head asset links and adjacent Step 29 style whitespace | Full-page owner | Mutable cross-route dependency; build-order dependency | The owner read generated `/toronto-to-winnipeg-movers/index.html` and copied its Step 46 pair assets. |
| Winnipeg → Ottawa | `fix-winnipeg-static-routes.mjs` | Head asset links near `static-chat.css` | Full-page owner | Mutable cross-route dependency; build-order dependency | Same generated-route dependency as the forward direction. |
| Victoria → Ottawa | `rebuild-victoria-ottawa-route.mjs` | Title/OG/Twitter head fields, then Step 46 asset links | Full-page owner plus title normalizer | Mutable cross-route dependency; build-order dependency | The owner read generated Toronto→Winnipeg HTML. Its narrow `<title>` replacement did not match Step 46's attributed authoritative title, so the Toronto title marker and pair assets were inherited. |

## 4. Common/shared cause analysis

This was not unrelated inherited convergence debt. Step 46 exposed an invalid source boundary. Pair-specific assets were placed in templates also used as shell sources by other route owners, while three owners directly read the generated Toronto→Winnipeg route. Aggregate order made the issue first-run-only: Toronto→Winnipeg was rebuilt first, later owners copied its updated head, and the second aggregate then began from that already-contaminated state.

## 5. Relationship to Step 45A stale-output issue

Step 45A was chiefly stale checked-in output relative to already-correct deterministic owners and normalizers. Step 46A differs: the checked-in pages were one pass behind only because Step 46 introduced a mutable/cross-pair dependency defect. Output regeneration alone would have made the old aggregate appear converged while retaining the contamination. Step 46A therefore required source repair followed by legitimate owner and post-processor regeneration.

## 6. Files changed

Durable source changes:

- `tools/rebuild-toronto-winnipeg-routes.mjs`
- `tools/rebuild-calgary-ottawa-routes.mjs`
- `tools/fix-winnipeg-static-routes.mjs`
- `tools/rebuild-victoria-ottawa-route.mjs`
- `tools/templates/winnipeg-routes/toronto-to-winnipeg-movers.html`
- `tools/templates/winnipeg-routes/winnipeg-to-toronto-movers.html`

Reconciled route outputs:

- `site-copy/calgary-to-ottawa-movers/index.html`
- `site-copy/ottawa-to-calgary-movers/index.html`
- `site-copy/winnipeg-to-montreal-movers/index.html`
- `site-copy/montreal-to-winnipeg-movers/index.html`
- `site-copy/ottawa-to-winnipeg-movers/index.html`
- `site-copy/winnipeg-to-ottawa-movers/index.html`
- `site-copy/victoria-to-ottawa-movers/index.html`

This report and the `STEP_46A_*.json` audit/hash artifacts are evidence outputs. No deployment files or Step 47 work were added.

## 7. Which route HTML files were regenerated

Exactly the seven reproduced routes were changed by the reconciliation chain. Their final canonical hashes are:

| Route | Final canonical hash |
|---|---|
| Calgary → Ottawa | `3db13feb206852ee5fc64934d2d49f035ddcacb5c8340e0c6d35d356ca42872b` |
| Ottawa → Calgary | `f1f7839231cca4e62c28b3ed1d77e9ee6f33e5c49e094306d5c562cb2ac274e3` |
| Winnipeg → Montreal | `3f1a6923effb0474601a255cc8bf803e7448ce1dd73b36e61cb88abf33965063` |
| Montreal → Winnipeg | `90fa4cd54a3a545f68d38c2c93f85469fc4ec8631fcf797a7938d998bb902c37` |
| Ottawa → Winnipeg | `cb46f57849fc833e2bfaf0955da56f5b0f353261427d089a94e27338f366982a` |
| Winnipeg → Ottawa | `590bf44846a6e41af0706afacc3aabb96469cd780b3ea66f488dbbfcb544cb91` |
| Victoria → Ottawa | `8c08d773dcc2237deec996b3041c6ff19f8009520f7e3833ddc5a321bb0f3ac7` |

The outputs were produced by their registered owners and aggregate-ordered post-processors, not by manual HTML edits.

## 8. Durable source changes

The Toronto↔Winnipeg templates are again reusable shell inputs: pair-only Step 46 CSS/JS references were removed from both template files. `rebuild-toronto-winnipeg-routes.mjs` now attaches those assets only while producing the two owned pair outputs.

Calgary↔Ottawa, Ottawa↔Winnipeg, and Victoria→Ottawa now read the checked-in frozen Toronto→Winnipeg template instead of generated route HTML. Victoria's title replacement was also widened to match attributed title tags safely.

## 9. Post-processor ordering findings

Direct-owner stage hashes showed:

- Calgary↔Ottawa: owner output already equals final aggregate output.
- Ottawa↔Winnipeg: owner output already equals final aggregate output.
- Winnipeg↔Montreal: owner output is deterministic, FAQ changes zero bytes, and the registered title normalizer produces the final canonical title fields.
- Victoria→Ottawa: owner output is deterministic, FAQ changes zero bytes, and the registered title normalizer adds the canonical brand suffix and aligns OG/Twitter.

The checked-in outputs are now the result of the complete aggregate-ordered chain, so those intentional downstream title canonicalizations no longer cause first-pass drift.

## 10. Mutable cross-route dependency findings

Three proven mutable reads were removed:

- `rebuild-calgary-ottawa-routes.mjs` no longer reads generated Toronto→Winnipeg HTML.
- `fix-winnipeg-static-routes.mjs` no longer reads generated Toronto→Winnipeg HTML.
- `rebuild-victoria-ottawa-route.mjs` no longer reads generated Toronto→Winnipeg HTML.

The Winnipeg↔Montreal owner already read a checked-in template, but that template incorrectly contained Step 46 pair-only assets. Pair asset attachment is now owned exclusively by the Toronto↔Winnipeg generator.

## 11. Idempotency results

Each of the four responsible owners was run twice. The second direct-owner run changed zero bytes for all seven routes. FAQ finalization changed zero bytes. Title normalization changed only the expected Winnipeg↔Montreal and Victoria→Ottawa title fields, after which the complete chain was byte-identical on its next run.

The final working-tree chain and both fresh-clone aggregate passes are fully idempotent.

## 12. Toronto ↔ Winnipeg byte-identical confirmation

The Step 46 target pair remained byte-identical before and after the Step 46A source repair and pair-owner run:

- Toronto → Winnipeg: `af36f507c3993162083d01ed2a05f95ad53612c5967aa2de996d6d78e3939d21`
- Winnipeg → Toronto: `3fb07036a7200e70634a5d90f8f3447157220acabb4170b7caff7dae85b2d667`

Pair ownership, content, metadata, FAQ, pricing, and route HTML were not changed.

## 13. Global ownership/title/FAQ results

- Ownership: PASS, 56 registered routes, exactly one full-page owner each, zero collisions.
- Automated tests: PASS, 33/33.
- Raw title/OG/Twitter contract: PASS, 56/56.
- Browser title lifecycle: PASS, 55/55 evaluable routes.
- Raw FAQ architecture: PASS, 56/56.
- Browser FAQ architecture/parity: PASS, 55/55 evaluable routes.
- Content hygiene: PASS, 56/56 with zero `.pcm-local-seo`, zero unintended `undefined`, zero homepage replacement, and zero soft 404.

## 14. Regression result

PASS: 49/49 unique browser-regression routes. The manifest was already deduplicated and already contained Toronto↔Winnipeg, so no artificial count increase was made. All seven Step 46A routes are included and passed.

## 15. Browser smoke-check result

PASS for all seven reconciliation routes. The regression and FAQ/title lifecycle audits verified route-specific H1/identity, directional form defaults, canonical title fields, one FAQ/schema architecture, pricing-table and route-glance content, navigation, chatbot, no local-SEO block, no `undefined`, and no homepage/soft-404 replacement. No layout/runtime source was changed, so additional redesign QA was not required.

The approved facts remain intact:

- Calgary↔Ottawa: 3,500 km, 7–19 days, $2,500–$15,000+.
- Winnipeg↔Montreal: 2,270 km, 5–13 days, $2,400–$13,000+.
- Ottawa↔Winnipeg: 2,170 km, 4–12 days, $2,400–$13,000.
- Victoria→Ottawa: ~4,700+ km, 10–22 days, $3,000–$16,000+.

## 16. First aggregate result

From the corrected, fully converged working tree overlaid into a fresh clean Git clone:

- Route drift: **0/56**.
- Asset drift: **0/98**.

## 17. Second aggregate result

Against the first-pass result in the same fresh clone:

- Route drift: **0/56**.
- Asset drift: **0/98**.

## 18. Working-tree route accounting

Comparing the pre-reconciliation working-tree hash set to the final canonical set shows exactly 7/56 route HTML changes: the seven routes reproduced in section 1. All other 49 registered route HTML files are byte-identical. Assets changed 0/98. Toronto↔Winnipeg changed 0/2.

## 19. Remaining known issues

The pre-existing Victoria→Vancouver browser-audit limitation remains: it can stall the full lifecycle runner, so the browser title/FAQ audits used the existing 55-route evaluable set while raw static contracts passed 56/56. This route is outside Step 46A and was not changed. No other Step 46A acceptance issue remains.

No deployment was performed, and Step 47 was not started.

## 20. Formal Step 46 status

Toronto↔Winnipeg remains canonical and byte-stable; ownership, tests, raw and browser contracts, regression, working-tree isolation, and both aggregate convergence gates pass.

Step 46 is now complete.
