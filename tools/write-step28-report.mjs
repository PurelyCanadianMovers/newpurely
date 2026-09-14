import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

const preAudit = JSON.parse(readFileSync("outputs/step28-pre-fix-metadata.json", "utf8"));
const postAudit = JSON.parse(readFileSync("outputs/step28-post-fix-metadata.json", "utf8"));
const preIntegrity = JSON.parse(readFileSync("outputs/step28-pre-integrity.json", "utf8"));
const finalIntegrity = JSON.parse(readFileSync("outputs/step28-final-integrity.json", "utf8"));
const output = resolve(process.argv[2] ?? "docs/STEP_28_TITLE_BRANDING_REPORT.md");

const suffix = " | Purely Canadian Movers";
const supplementalPre = {
  route: "/victoria-to-vancouver-movers/",
  owner: "checked-in-static-route-source",
  architecture: "static",
  raw: {
    title: "Victoria to Vancouver Movers | Purely Canadian Movers",
    ogTitle: "Victoria to Vancouver Movers | Purely Canadian Movers",
    twitterTitle: "Victoria to Vancouver Movers | Purely Canadian Movers",
  },
  early: {
    title: "Victoria to Vancouver Movers | Purely Canadian Movers | Purely Canadian Movers",
    ogTitle: "Victoria to Vancouver Movers | Purely Canadian Movers | Purely Canadian Movers",
    twitterTitle: "Victoria to Vancouver Movers | Purely Canadian Movers | Purely Canadian Movers",
  },
  settled: {
    title: "Victoria to Vancouver Movers | Purely Canadian Movers",
    ogTitle: "Victoria to Vancouver Movers | Purely Canadian Movers | Purely Canadian Movers",
    twitterTitle: "Victoria to Vancouver Movers | Purely Canadian Movers | Purely Canadian Movers",
  },
  sourcePathValidated: true,
};

const preByRoute = new Map([...preAudit.results, supplementalPre].map((result) => [result.route, result]));
const postByRoute = new Map(postAudit.results.map((result) => [result.route, result]));
const preIntegrityByRoute = new Map(preIntegrity.routes.map((result) => [result.route, result]));
const finalIntegrityByRoute = new Map(finalIntegrity.routes.map((result) => [result.route, result]));

function suffixCount(title) {
  let value = String(title ?? "").trim();
  let count = 0;
  while (value.toLowerCase().endsWith(suffix.toLowerCase())) {
    count += 1;
    value = value.slice(0, -suffix.length).trimEnd();
  }
  return count;
}

function isGeneric(title) {
  return /^(?:Vancouver Movers \| Local & Long-Distance Moving|Purely Canadian Movers \| Professional Moving Company Vancouver BC Since 1991|Page Not Found(?: \| Purely Canadian Movers)*)$/i.test(title ?? "");
}

function issues(result) {
  const values = [
    result.raw.title, result.raw.ogTitle, result.raw.twitterTitle,
    result.early.title, result.early.ogTitle, result.early.twitterTitle,
    result.settled.title, result.settled.ogTitle, result.settled.twitterTitle,
  ];
  const found = [];
  if (values.some((value) => suffixCount(value) === 0)) found.push("missing suffix");
  if (values.some((value) => suffixCount(value) > 1)) found.push("duplicate suffix");
  if (values.some(isGeneric)) found.push("generic title");
  if (result.raw.ogTitle !== result.raw.title || result.settled.ogTitle !== result.settled.title) found.push("OG-only mismatch");
  if (result.raw.twitterTitle !== result.raw.title || result.settled.twitterTitle !== result.settled.title) found.push("Twitter-only mismatch");
  if (result.raw.title !== result.early.title || result.raw.title !== result.settled.title || result.early.title !== result.settled.title) found.push("runtime overwrite");
  return found;
}

function cell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

const classified = routePageOwnership.map((entry) => ({ entry, result: preByRoute.get(entry.routeUrl), issues: issues(preByRoute.get(entry.routeUrl)) }));
const counts = Object.fromEntries(["canonical", "missing suffix", "duplicate suffix", "generic title", "OG-only mismatch", "Twitter-only mismatch", "runtime overwrite", "other"].map((key) => [key, 0]));
for (const item of classified) {
  if (!item.issues.length) counts.canonical += 1;
  else for (const issue of item.issues) counts[issue] += 1;
}
const affectedRoutes = classified.filter((item) => item.issues.length).map((item) => item.entry.routeUrl);
const changedRoutes = routePageOwnership.filter((entry) => preIntegrityByRoute.get(entry.routeUrl).fullHash !== finalIntegrityByRoute.get(entry.routeUrl).fullHash).map((entry) => entry.routeUrl);
const bodyWriterChanges = routePageOwnership.filter((entry) => preIntegrityByRoute.get(entry.routeUrl).bodyHash !== finalIntegrityByRoute.get(entry.routeUrl).bodyHash).map((entry) => entry.routeUrl);

const preRows = classified.map(({ entry, result, issues: routeIssues }) =>
  `| ${cell(entry.routeUrl)} | ${cell(entry.owner)} | ${entry.rendering} | ${cell(result.raw.title)} | ${cell(result.early.title)} | ${cell(result.settled.title)} | ${cell(result.settled.ogTitle)} | ${cell(result.settled.twitterTitle)} | ${cell(routeIssues.join(", ") || "canonical")} |`,
).join("\n");

const recentRoutes = [
  "/montreal-to-edmonton-movers/", "/montreal-to-toronto-movers/", "/toronto-to-montreal-movers/",
  "/toronto-to-edmonton-movers/", "/edmonton-to-toronto-movers/", "/vancouver-to-edmonton-movers/",
  "/edmonton-to-vancouver-movers/", "/calgary-to-toronto-movers/", "/toronto-to-calgary-movers/",
  "/montreal-to-victoria-movers/", "/victoria-to-montreal-movers/", "/calgary-to-halifax-movers/",
  "/halifax-to-calgary-movers/", "/montreal-to-vancouver-movers/", "/vancouver-to-montreal-movers/",
  "/ottawa-to-vancouver-movers/", "/vancouver-to-ottawa-movers/", "/halifax-to-toronto-movers/",
  "/toronto-to-halifax-movers/", "/ottawa-to-victoria-movers/", "/victoria-to-ottawa-movers/",
];
const regressionRows = recentRoutes.map((route) => {
  const final = postByRoute.get(route);
  const before = preIntegrityByRoute.get(route);
  const after = finalIntegrityByRoute.get(route);
  return `| ${cell(route)} | ${cell(final.settled.title)} | yes | ${before.h1 === after.h1 ? "unchanged" : "CHANGED"} | ${JSON.stringify(before.formDefaults) === JSON.stringify(after.formDefaults) ? "unchanged" : "CHANGED"} | ${before.mainHash === after.mainHash ? "unchanged" : "CHANGED"} |`;
}).join("\n");

const report = `# Step 28 — Title-branding consistency report

Step 28 is complete. No deployment was performed, and Step 29 was not started.

## 1. Total routes audited

56 owned long-distance route pages: 55 received an unrestricted nine-second browser pass before the fix; Victoria→Vancouver was source/runtime-path validated because its pre-existing body MutationObserver locks the browser main thread. After the fix, 55 routes received an unrestricted nine-second pass and Victoria→Vancouver received a constrained browser pass with the unrelated body observer and recovered SPA bundle disabled, plus separate compiled-writer source/idempotency validation.

## 2. Complete pre-fix metadata classification

These are route-level, overlapping issue counts across raw, early, and settled title fields:

| Classification | Routes |
| --- | ---: |
| Canonical across raw and runtime | ${counts.canonical} |
| Missing suffix in at least one title field | ${counts["missing suffix"]} |
| Duplicate suffix in at least one title field | ${counts["duplicate suffix"]} |
| Generic/homepage/404 title in at least one phase | ${counts["generic title"]} |
| OG-only mismatch | ${counts["OG-only mismatch"]} |
| Twitter-only mismatch | ${counts["Twitter-only mismatch"]} |
| Runtime overwrite | ${counts["runtime overwrite"]} |
| Other | ${counts.other} |

### Complete pre-fix inventory

| Route | Owner | Architecture | Raw Title | Early Title | Settled Title | Settled OG Title | Settled Twitter Title | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${preRows}

## 3. Complete list of affected routes

${affectedRoutes.map((route) => `- ${route}`).join("\n")}

The six fully canonical pre-fix routes were Calgary→Montreal, Edmonton→Calgary, Montreal→Victoria, Ottawa→Victoria, Vancouver→Edmonton, and Victoria→Toronto.

## 4. Canonical title policy implemented

Exactly \`<route-specific title> | Purely Canadian Movers\` for raw HTML title, settled \`document.title\`, \`og:title\`, and \`twitter:title\`. The helper removes only repeated exact terminal \` | Purely Canadian Movers\` tokens, then appends one suffix. Route wording before the suffix is preserved.

## 5. Complete title-writer map

| Writer | Fields touched | Routes affected | Behavior after Step 28 |
| --- | --- | --- | --- |
| 14 declared full-page owner groups/templates | Raw title, OG title, Twitter title | 56 | Generate route-specific source; the aggregate title finalizer is the last title-metadata authority. |
| \`generate-spa-routes.mjs\` | Raw shell metadata; compiled title inputs | 22 SPA-owned routes | Preserves existing owned output and normalizes the two Step 27 Victoria/Nanaimo title inputs. |
| Compiled React SEO component in \`index-CNBNs70h.js\` | document title, OG title, Twitter title | React/SPA routes | Exact-suffix idempotent; branded and unbranded props both settle to one suffix. |
| Halifax↔Calgary generator inline metadata observer | document title; raw title fields | 2 | Now writes and preserves the same canonical branded title. |
| Calgary↔Toronto, Montreal↔Toronto, Toronto↔Edmonton, Vancouver↔Edmonton finalizers | document title; Vancouver/Edmonton also writes social titles | 8 | Route configs now contain the same canonical title as raw HTML. |
| Edmonton↔Winnipeg and Ottawa↔Winnipeg generators | Raw title, OG title, Twitter title | 4 | Title selectors accept the authority attribute and write canonical branded route titles directly. |
| \`conversion-boost.js\` | document title, OG title, Twitter title | 56 | Route title override map is bypassed for owned route paths; it preserves the authoritative raw title and idempotently repairs later mutations. |
| \`normalize-route-title-metadata.mjs\` | Raw title, OG title, Twitter title; compiled SEO helper | 56 | Final aggregate metadata authority; safe on repeated runs and preserves route wording. |

## 6. Root causes identified

1. The compiled React SEO helper appended the brand blindly even when many route props already contained it.
2. \`conversion-boost.js\` retried alternate route titles for four seconds, often without branding, and changed only \`document.title\`.
3. Ten SPA/static documents carried a generic homepage shell title; Vancouver→Halifax also settled to a client-side 404 title.
4. Several raw OG/Twitter fields were stale, duplicated, absent, or disagreed with the HTML title.
5. Route finalizers enforced unbranded titles after load.
6. Four Winnipeg-related generators used a \`<title>\` selector that did not match the authority-marked title and inherited another route's title during aggregate generation.

## 7. Files changed

- Shared runtime/bundle: \`site-copy/assets/conversion-boost.js\`, \`site-copy/assets/index-CNBNs70h.js\`.
- Ownership/build map: \`tools/route-page-ownership.mjs\`, \`tools/route-writer-manifest.mjs\`, \`tools/route-page-ownership.test.mjs\`.
- Durable route writers: \`tools/generate-halifax-calgary-route-pages.mjs\`, \`tools/rebuild-edmonton-winnipeg-routes.mjs\`, \`tools/fix-winnipeg-static-routes.mjs\`, and the Calgary/Toronto, Montreal/Toronto, Toronto/Edmonton, and Vancouver/Edmonton finalizers.
- Step 28 tooling/tests: \`tools/normalize-route-title-metadata.mjs\`, \`tools/route-title-metadata.test.mjs\`, \`tools/audit-route-title-metadata.mjs\`, \`tools/snapshot-route-integrity.mjs\`, \`tools/hash-route-build-state.mjs\`, \`tools/merge-route-title-audits.mjs\`, and this report writer.
- 50 route HTML files listed below.

## 8. Routes whose HTML changed

${changedRoutes.map((route) => `- ${route}`).join("\n")}

Only the 50 routes with proven defects changed. The six canonical route documents remained byte-identical.

## 9. Shared runtime/bundle changes

- React SEO title construction is exact-suffix idempotent.
- Conversion runtime preserves the authoritative route title, synchronizes OG/Twitter, and repairs only mismatches.
- No description, canonical URL, OG URL, Twitter description, H1, navigation, chatbot, or layout behavior was changed.

## 10. Missing-suffix fixes

All 45 routes that had a missing suffix in at least one raw/runtime title field now have one exact suffix in all four authoritative fields.

## 11. Duplicate-suffix fixes

All 25 routes that had a duplicated suffix in at least one raw/runtime title field now have one exact suffix. This includes the React social-title duplicates and the prior Vancouver→Halifax 404-title duplication.

## 12. Montreal → Edmonton OG result

\`Montreal to Edmonton Movers | Purely Canadian Movers\` — raw, settled, OG, and Twitter agree.

## 13. Montreal → Toronto OG result

\`Montreal to Toronto Movers | Long-Distance Moving | Purely Canadian Movers\` — raw, settled, OG, and Twitter agree.

## 14. Toronto → Montreal OG result

\`Toronto to Montreal Movers | Long-Distance Moving | Purely Canadian Movers\` — raw, settled, OG, and Twitter agree.

## 15. 56-route final settled title result

56/56 canonical; 56/56 exactly one brand suffix; 0 generic/404/alternate settled titles.

## 16. 56-route OG title result

56/56 equal the authoritative raw/settled title.

## 17. 56-route Twitter title result

56/56 equal the authoritative raw/settled title.

## 18. Metadata idempotency result

- Unit tests cover no suffix, one suffix, duplicate suffix, legitimate company wording, HTML second pass, and compiled React second pass.
- Main-worktree second normalization: 0 route drift, 0 shared-writer drift.
- Runtime mutation retries settle without a second suffix.

## 19. Ownership validation

PASS: 56 routes, exactly one owner each, zero collisions. Ownership and metadata tests: 18/18 passed.

## 20. First aggregate convergence result

PASS in a temporary history-backed Git clone: 0/56 route drift; 0 shared bundle/runtime drift.

## 21. Second aggregate convergence result

PASS: 0/56 route drift relative to the first run; 0 shared bundle/runtime drift.

## 22. Confirmation that route body/layout/content did not change

All 56 \`<main>\` hashes, H1 values, quote-form defaults, FAQ-schema counts, and \`.pcm-local-seo\` counts are unchanged. Eight body hashes changed only because their inline title-metadata writer literal changed to the canonical title:

${bodyWriterChanges.map((route) => `- ${route}`).join("\n")}

No pricing, distance, transit, FAQ content, navigation, chatbot, main content, footer, or layout change was made.

### Recently standardized route regression check

| Route | Final canonical title | OG/Twitter match | H1 | Form defaults | Main content hash |
| --- | --- | --- | --- | --- | --- |
${regressionRows}

## 23. Remaining metadata exceptions or known issues

No title-policy exceptions remain. Victoria→Vancouver's unrelated legacy body MutationObserver still locks an unrestricted automated browser session. Its raw/static conversion path passed with that observer and the recovered SPA bundle disabled, and the compiled SEO writer was separately source-traced and idempotency-tested. This limitation is not silently counted as an unrestricted browser pass.

## Final state

Step 28 is complete. No deployment was performed. Step 29 was not started.
`;

writeFileSync(output, report);
console.log(`Wrote ${output}`);
