import test from "node:test";
import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { routePageOwnership, routeOwnershipByUrl } from "./route-page-ownership.mjs";
import { assertAllowedPostProcessor, assertRouteOwnership } from "./route-ownership-guard.mjs";
import { faqParityDifferences } from "./faq-parity.mjs";
import { ottawaHubRouteMarker, ottawaHubRoutes, updateOttawaHubRoutes } from "./ottawa-hub-routes.mjs";
import { routeWriterManifest } from "./route-writer-manifest.mjs";
import { calgaryEdmontonRouteFacts } from "./calgary-edmonton-route-data.mjs";
import { edmontonOttawaFacts } from "./edmonton-ottawa-route-data.mjs";
import { torontoVictoriaFacts } from "./toronto-victoria-route-data.mjs";
import { SEATTLE_VANCOUVER_FACTS, SEATTLE_VANCOUVER_ROUTES, assertSeattleVancouverRouteData } from "./seattle-vancouver-route-data.mjs";
import { VICTORIA_VANCOUVER_FACTS, VICTORIA_VANCOUVER_ROUTE, assertVictoriaVancouverRouteData } from "./victoria-vancouver-route-data.mjs";
import { CALGARY_WINNIPEG_BY_PATH, assertCalgaryWinnipegRouteData } from "./calgary-winnipeg-route-data.mjs";
import { torontoHubRouteMarker, torontoHubRoutes, updateTorontoHubRoutes } from "./toronto-hub-routes.mjs";
import { victoriaHubRouteMarker, victoriaHubRoutes, updateVictoriaHubRoutes } from "./victoria-hub-routes.mjs";
import {
  WINNIPEG_MONTREAL_BY_PATH,
  assertWinnipegMontrealRouteData,
} from "./winnipeg-montreal-route-data.mjs";
import { validateOwnershipModel, validateRouteArchitecture } from "./validate-route-page-ownership.mjs";
import { CALGARY_TORONTO_FACTS, CALGARY_TORONTO_ROUTES, assertCalgaryTorontoTemplate } from "./calgary-toronto-route-data.mjs";
import { CALGARY_VANCOUVER_FACTS, CALGARY_VANCOUVER_ROUTES, assertCalgaryVancouverTemplate } from "./calgary-vancouver-route-data.mjs";
import { assertTorontoVancouverStaticTemplate, torontoVancouverFacts, torontoVancouverRoutes } from "./toronto-vancouver-static-route-data.mjs";

test("all 56 routes have one collision-free owner", () => {
  assert.equal(routePageOwnership.length, 56);
  assert.equal(new Set(routePageOwnership.map((entry) => entry.routeUrl)).size, 56);
  assert.deepEqual(validateOwnershipModel(routePageOwnership, routeWriterManifest), []);
});

test("Calgary-Toronto migration facts are frozen and complete", async () => {
  assert.equal(CALGARY_TORONTO_FACTS.distance, "approximately 3,400 km");
  assert.equal(CALGARY_TORONTO_FACTS.transit, "7–19 days");
  assert.equal(CALGARY_TORONTO_FACTS.range, "$2,500–$15,000+");
  assert.deepEqual(CALGARY_TORONTO_FACTS.pricing.map((row) => row[1]), ["$2,500+", "$3,800+", "$6,400+", "$10,000+", "$15,000+"]);
  for (const route of CALGARY_TORONTO_ROUTES) {
    const html = await readFile(resolve("tools/templates/calgary-toronto-static-routes", `${route.slug}.html`), "utf8");
    assert.doesNotThrow(() => assertCalgaryTorontoTemplate(html, route));
  }
});

test("Calgary-Vancouver migration facts are frozen and complete", async () => {
  assert.equal(CALGARY_VANCOUVER_FACTS.distance, "approximately 1,000 km");
  assert.equal(CALGARY_VANCOUVER_FACTS.transit, "4–13 days");
  assert.deepEqual(CALGARY_VANCOUVER_FACTS.pricing.map((row) => row[1]), ["$2,000+", "$2,600+", "$3,500+", "$4,800+", "$6,500+"]);
  assert.deepEqual(CALGARY_VANCOUVER_ROUTES.map((route) => route.range), ["$1,800–$13,000+", "$1,800–$14,000+"]);
  for (const route of CALGARY_VANCOUVER_ROUTES) {
    const html = await readFile(resolve("tools/templates/calgary-vancouver-static-routes", `${route.slug}.html`), "utf8");
    assert.doesNotThrow(() => assertCalgaryVancouverTemplate(html, route));
  }
});

test("Calgary-Winnipeg Step 44 facts are complete, frozen, and reject missing values", () => {
  for (const path of ["/calgary-to-winnipeg-movers/", "/winnipeg-to-calgary-movers/"]) {
    const route = CALGARY_WINNIPEG_BY_PATH[path];
    assertCalgaryWinnipegRouteData(route);
    assert.equal(route.distance, "approximately 1,320 km");
    assert.equal(route.transit, "3–11 days");
    assert.equal(route.range, "$2,300–$12,000+");
    assert.deepEqual(route.pricing.map((row) => row[1]), ["$2,300+", "$3,200+", "$5,100+", "$8,200+", "$12,000+"]);
    assert.ok(Object.isFrozen(route));
  }
  assert.throws(() => assertCalgaryWinnipegRouteData({ ...CALGARY_WINNIPEG_BY_PATH["/calgary-to-winnipeg-movers/"], transit: "" }), /missing required transit/);
  assert.throws(() => assertCalgaryWinnipegRouteData({ ...CALGARY_WINNIPEG_BY_PATH["/calgary-to-winnipeg-movers/"], pricing: [] }), /exactly five authoritative pricing rows/);
});

test("Winnipeg-Montreal facts are complete, frozen, and reject missing values", () => {
  for (const path of ["/winnipeg-to-montreal-movers/", "/montreal-to-winnipeg-movers/"]) {
    const route = WINNIPEG_MONTREAL_BY_PATH[path];
    assertWinnipegMontrealRouteData(route);
    assert.equal(route.distance, "2,270 km");
    assert.equal(route.transit, "5–13 days");
    assert.equal(route.range, "$2,400–$13,000+");
    assert.deepEqual(route.priceRows.map((row) => row.price), ["$2,400+", "$3,400+", "$5,500+", "$9,000+", "$13,000+"]);
    assert.ok(Object.isFrozen(route));
  }
  assert.throws(
    () => assertWinnipegMontrealRouteData({ ...WINNIPEG_MONTREAL_BY_PATH["/winnipeg-to-montreal-movers/"], transit: "" }),
    /missing required transit/,
  );
  assert.throws(
    () => assertWinnipegMontrealRouteData({ ...WINNIPEG_MONTREAL_BY_PATH["/winnipeg-to-montreal-movers/"], priceRows: [] }),
    /exactly five authoritative pricing rows/,
  );
});

test("Toronto-Vancouver Step 5 routes are static-safe and fact-complete", async () => {
  assert.equal(torontoVancouverFacts.distance, "~4,400 km");
  assert.equal(torontoVancouverFacts.transit, "9–22 days");
  assert.equal(torontoVancouverFacts.range, "$2,500–$15,000+");
  assert.deepEqual(torontoVancouverFacts.rows.map((row) => row[1]), ["$2,500+", "$4,700+", "$6,500+", "$10,000+", "$15,000+"]);
  for (const [routePath, config] of Object.entries(torontoVancouverRoutes)) {
    const entry = routeOwnershipByUrl.get(routePath);
    assert.equal(entry.owner, "rebuild-toronto-vancouver-static-routes.mjs");
    assert.equal(entry.rendering, "static");
    assert.deepEqual(entry.runtimeEnhancers, [
      "site-copy/assets/conversion-boost.js",
      "site-copy/assets/static-nav.js",
      "site-copy/assets/static-chat.js",
    ]);
    assert.deepEqual(entry.runtimeStyles, [
      "site-copy/assets/conversion-boost.css",
      "site-copy/assets/step38-toronto-vancouver.css",
      "site-copy/assets/static-nav.css",
      "site-copy/assets/static-chat.css",
    ]);
    assert.deepEqual(entry.postProcessors, ["finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
    const html = await readFile(resolve("tools/templates/toronto-vancouver-static-routes", `${routePath.slice(1, -1)}.html`), "utf8");
    assert.doesNotThrow(() => assertTorontoVancouverStaticTemplate(html, { ...config, slug: routePath.slice(1, -1) }));
  }
});
test("representative SPA, dedicated, conflict, finalizer, and ordinary routes are classified", () => {
  assert.equal(routeOwnershipByUrl.get("/calgary-to-toronto-movers/").owner, "rebuild-calgary-toronto-static-routes.mjs");
  assert.equal(routeOwnershipByUrl.get("/calgary-to-toronto-movers/").rendering, "static");
  assert.deepEqual(routeOwnershipByUrl.get("/calgary-to-toronto-movers/").postProcessors, ["finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
  for (const route of ["/calgary-to-vancouver-movers/", "/vancouver-to-calgary-movers/"]) {
    const entry = routeOwnershipByUrl.get(route);
    assert.equal(entry.owner, "rebuild-calgary-vancouver-static-routes.mjs");
    assert.equal(entry.rendering, "static");
    assert.deepEqual(entry.postProcessors, ["finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
    assert.deepEqual(entry.runtimeEnhancers, [
      "site-copy/assets/conversion-boost.js",
      "site-copy/assets/static-nav.js",
      "site-copy/assets/step02-calgary-vancouver-static.js",
      "site-copy/assets/static-chat.js",
    ]);
    assert.deepEqual(entry.runtimeStyles, [
      "site-copy/assets/conversion-boost.css",
      "site-copy/assets/step33-calgary-vancouver.css",
      "site-copy/assets/static-nav.css",
      "site-copy/assets/static-chat.css",
    ]);
  }
  for (const route of ["/montreal-to-toronto-movers/", "/toronto-to-montreal-movers/"]) {
    const entry = routeOwnershipByUrl.get(route);
    assert.equal(entry.owner, "rebuild-montreal-toronto-static-routes.mjs");
    assert.equal(entry.rendering, "static");
    assert.deepEqual(entry.postProcessors, ["finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
    assert.deepEqual(entry.runtimeStyles, [
      "site-copy/assets/conversion-boost.css",
      "site-copy/assets/static-nav.css",
      "site-copy/assets/static-chat.css",
    ]);
  }
  for (const route of ["/edmonton-to-toronto-movers/", "/toronto-to-edmonton-movers/"]) {
    const entry = routeOwnershipByUrl.get(route);
    assert.equal(entry.owner, "rebuild-edmonton-toronto-static-routes.mjs");
    assert.equal(entry.rendering, "static");
    assert.deepEqual(entry.runtimeStyles, [
      "site-copy/assets/conversion-boost.css",
      "site-copy/assets/static-nav.css",
      "site-copy/assets/static-chat.css",
    ]);
  }

  assert.equal(routeOwnershipByUrl.get("/toronto-to-calgary-movers/").owner, "rebuild-calgary-toronto-static-routes.mjs");
  assert.equal(routeOwnershipByUrl.get("/toronto-to-calgary-movers/").rendering, "static");
  assert.deepEqual(routeOwnershipByUrl.get("/toronto-to-calgary-movers/").postProcessors, ["finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
  assert.equal(routeOwnershipByUrl.get("/montreal-to-victoria-movers/").owner, "rebuild-montreal-victoria-static-route.mjs");
  assert.equal(routeOwnershipByUrl.get("/montreal-to-victoria-movers/").rendering, "static");
  assert.deepEqual(routeOwnershipByUrl.get("/montreal-to-victoria-movers/").postProcessors, ["finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
  assert.deepEqual(routeOwnershipByUrl.get("/victoria-to-montreal-movers/").postProcessors, ["finalize-montreal-victoria-routes.mjs", "finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
  assert.deepEqual(routeOwnershipByUrl.get("/calgary-to-winnipeg-movers/").postProcessors, ["finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
  assert.equal(routeOwnershipByUrl.get("/calgary-to-winnipeg-movers/").owner, "rebuild-calgary-winnipeg-routes.mjs");
  assert.equal(routeOwnershipByUrl.get("/calgary-to-winnipeg-movers/").rendering, "static");
  assert.deepEqual(routeOwnershipByUrl.get("/calgary-to-winnipeg-movers/").runtimeEnhancers, [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step44-calgary-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ]);
  assert.equal(routeOwnershipByUrl.get("/vancouver-to-winnipeg-movers/").owner, "rebuild-winnipeg-modern-routes.mjs");
  assert.equal(routeOwnershipByUrl.get("/victoria-to-ottawa-movers/").owner, "rebuild-victoria-ottawa-route.mjs");
  assert.equal(routeOwnershipByUrl.get("/ottawa-to-victoria-movers/").owner, "rebuild-victoria-ottawa-route.mjs");
  assert.equal(routeOwnershipByUrl.get("/ottawa-to-victoria-movers/").rendering, "static");
  assert.equal(routeOwnershipByUrl.get("/vancouver-to-edmonton-movers/").owner, "finalize-vancouver-edmonton-routes.mjs");
  assert.equal(routeOwnershipByUrl.get("/vancouver-to-edmonton-movers/").ownerType, "static-finalizer");
  assert.equal(routeOwnershipByUrl.get("/vancouver-to-edmonton-movers/").rendering, "static");
  for (const route of ["/halifax-to-vancouver-movers/", "/vancouver-to-halifax-movers/"]) {
    assert.equal(routeOwnershipByUrl.get(route).owner, "rebuild-halifax-vancouver-routes.mjs");
    assert.equal(routeOwnershipByUrl.get(route).rendering, "static");
  }
  for (const route of ["/calgary-to-edmonton-movers/", "/edmonton-to-calgary-movers/"]) {
    const entry = routeOwnershipByUrl.get(route);
    assert.equal(entry.owner, "checked-in-static-route-source");
    assert.equal(entry.ownerType, "checked-in-static-source");
    assert.equal(entry.rendering, "static");
    assert.deepEqual(entry.runtimeEnhancers, [
      "site-copy/assets/conversion-boost.js",
      "site-copy/assets/step35-calgary-edmonton.js",
      "site-copy/assets/static-nav.js",
      "site-copy/assets/static-chat.js",
    ]);
    assert.deepEqual(entry.runtimeStyles, [
      "site-copy/assets/conversion-boost.css",
      "site-copy/assets/step35-calgary-edmonton.css",
      "site-copy/assets/static-nav.css",
      "site-copy/assets/static-chat.css",
    ]);
    assert.deepEqual(entry.postProcessors, ["finalize-calgary-edmonton-routes.mjs", "finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs", "normalize-route-title-metadata.mjs"]);
  }
  assert.deepEqual(routeOwnershipByUrl.get("/vancouver-to-halifax-movers/").runtimeEnhancers, [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step43-halifax-vancouver.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ]);
  assert.equal(routeOwnershipByUrl.get("/victoria-to-montreal-movers/").owner, "checked-in-static-route-source");
  assert.equal(routeOwnershipByUrl.get("/victoria-to-montreal-movers/").ownerType, "checked-in-static-source");
  assert.equal(routeOwnershipByUrl.get("/victoria-to-montreal-movers/").rendering, "static");
  assert.deepEqual(routeOwnershipByUrl.get("/victoria-to-montreal-movers/").runtimeEnhancers, [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ]);
  assert.deepEqual(routeOwnershipByUrl.get("/victoria-to-montreal-movers/").runtimeStyles, [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ]);
  const victoriaVancouver = routeOwnershipByUrl.get("/victoria-to-vancouver-movers/");
  assert.equal(victoriaVancouver.owner, "checked-in-static-route-source");
  assert.equal(victoriaVancouver.ownerType, "checked-in-static-source");
  assert.equal(victoriaVancouver.rendering, "static");
  assert.deepEqual(victoriaVancouver.runtimeEnhancers, [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step50-victoria-vancouver.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ]);
  assert.deepEqual(victoriaVancouver.runtimeStyles, [
    "site-copy/assets/step50-victoria-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ]);
  assert.deepEqual(victoriaVancouver.postProcessors, [
    "finalize-victoria-vancouver-route.mjs",
    "finalize-route-promo.mjs", "finalize-route-faq-architecture.mjs",
    "normalize-route-title-metadata.mjs",
  ]);
  assert.equal(routeOwnershipByUrl.get("/edmonton-to-vancouver-movers/").owner, "generate-spa-routes.mjs");
  const edmontonOttawa = routeOwnershipByUrl.get("/edmonton-to-ottawa-movers/");
  assert.equal(edmontonOttawa.owner, "checked-in-static-route-source");
  assert.equal(edmontonOttawa.ownerType, "checked-in-static-source");
  assert.equal(edmontonOttawa.rendering, "static");
  assert.deepEqual(edmontonOttawa.runtimeEnhancers, [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step37-edmonton-ottawa.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ]);
  assert.deepEqual(edmontonOttawa.runtimeStyles, [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step37-edmonton-ottawa.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ]);
  assert.equal(edmontonOttawa.postProcessors[0], "finalize-edmonton-ottawa-routes.mjs");
  assert.ok(!edmontonOttawa.postProcessors.includes("strip-unsupported-route-bootstrap.mjs"));
  const ottawaEdmonton = routeOwnershipByUrl.get("/ottawa-to-edmonton-movers/");
  assert.equal(ottawaEdmonton.owner, "generate-spa-routes.mjs");
  assert.equal(ottawaEdmonton.rendering, "react-spa");
  assert.deepEqual(ottawaEdmonton.runtimeEnhancers, [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step37-edmonton-ottawa.js",
  ]);
  assert.deepEqual(ottawaEdmonton.runtimeStyles, ["site-copy/assets/step37-edmonton-ottawa.css"]);
  assert.equal(ottawaEdmonton.postProcessors[0], "finalize-edmonton-ottawa-routes.mjs");
  assert.doesNotThrow(() => assertAllowedPostProcessor("finalize-edmonton-ottawa-routes.mjs", ["edmonton-to-ottawa-movers", "ottawa-to-edmonton-movers"]));
  assert.doesNotThrow(() => assertRouteOwnership("finalize-vancouver-edmonton-routes.mjs", ["vancouver-to-edmonton-movers"]));
  assert.doesNotThrow(() => assertAllowedPostProcessor("finalize-vancouver-edmonton-routes.mjs", ["edmonton-to-vancouver-movers"]));
  assert.throws(() => assertAllowedPostProcessor("finalize-vancouver-edmonton-routes.mjs", ["vancouver-to-edmonton-movers"]));
  assert.doesNotThrow(() => assertAllowedPostProcessor("finalize-montreal-edmonton-routes.mjs", ["edmonton-to-montreal-movers"]));
  assert.doesNotThrow(() => assertAllowedPostProcessor("finalize-montreal-victoria-routes.mjs", ["victoria-to-montreal-movers"]));
});

test("architecture validation rejects React/static runtime contradictions", () => {
  const react = routeOwnershipByUrl.get("/ottawa-to-edmonton-movers/");
  const staticRoute = routeOwnershipByUrl.get("/edmonton-to-ottawa-movers/");
  assert.deepEqual(validateRouteArchitecture(react, '<script type="module" src="../assets/index.js"></script>'), []);
  assert.match(validateRouteArchitecture(react, '<script defer src="/assets/static-nav.js"></script>')[0], /declared react-spa but has no module bootstrap/);
  assert.ok(validateRouteArchitecture(react, '<script type="module" src="../assets/index.js"></script><script defer src="/assets/static-chat.js"></script>').some((error) => /substitutes static navigation\/chat runtime/.test(error)));
  assert.ok(validateRouteArchitecture(staticRoute, '<script type="module" src="../assets/index.js"></script><script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script>').some((error) => /declared static but contains a module bootstrap/.test(error)));
});

test("an unauthorized full-page writer fails with an actionable collision", () => {
  assert.throws(
    () => assertRouteOwnership("generate-spa-routes.mjs", ["vancouver-to-winnipeg-movers"]),
    /owned by rebuild-winnipeg-modern-routes\.mjs but generate-spa-routes\.mjs also attempts full-page output/,
  );
});

test("the Victoria-Ottawa writer owns both route directions", () => {
  assert.doesNotThrow(() => assertRouteOwnership(
    "rebuild-victoria-ottawa-route.mjs",
    ["https://purelycanadianmovers.com/victoria-to-ottawa-movers/", "/ottawa-to-victoria-movers/"],
  ));
  assert.throws(
    () => assertRouteOwnership("rebuild-victoria-ottawa-route.mjs", [{ from: "Victoria", to: "Ottawa" }]),
    /\/undefined\/ has no declared full-page owner/,
  );
});

test("the broad mirror cannot target site-copy without explicit legacy opt-in", () => {
  const run = spawnSync(process.execPath, [resolve("tools/mirror-site.mjs"), "https://example.invalid/", "site-copy", "1"], { encoding: "utf8" });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /non-authoritative legacy full-page writer/);
});

test("prerender refuses an in-place source/output collision", () => {
  const run = spawnSync(process.execPath, [resolve("tools/prerender-static.mjs"), "site-copy", "site-copy"], { encoding: "utf8" });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /output must be separate from its source root/);
});

test("validator rejects duplicate owners and conflicting active claims", () => {
  const route = routePageOwnership[0];
  const duplicate = { ...route, owner: "other-generator.mjs" };
  const errors = validateOwnershipModel([route, duplicate], [
    { script: route.owner, mode: "authoritative", routes: [route.routeUrl] },
    { script: "other-generator.mjs", mode: "authoritative", routes: [route.routeUrl] },
  ], [route.routeUrl]);
  assert.ok(errors.some((error) => error.includes("more than one full-page owner")));
  assert.ok(errors.some((error) => error.includes("also attempts full-page output")));
});

test("SPA generation writes an owned route and preserves dedicated/static, About, Calgary, Toronto, Ottawa, and Victoria hub sentinels", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-route-owner-"));
  try {
    await mkdir(join(tempRoot, "assets"), { recursive: true });
    await copyFile(resolve("site-copy/index.html"), join(tempRoot, "index.html"));
    await copyFile(resolve("site-copy/assets/index-CNBNs70h.js"), join(tempRoot, "assets/index-CNBNs70h.js"));
    const sentinels = ["about", "calgary-long-distance-movers", "toronto-long-distance-movers", "ottawa-long-distance-movers", "victoria-long-distance-movers", "calgary-to-edmonton-movers", "calgary-to-toronto-movers", "toronto-to-calgary-movers", "edmonton-to-calgary-movers", "edmonton-to-ottawa-movers", "vancouver-to-winnipeg-movers", "victoria-to-vancouver-movers", "victoria-to-montreal-movers", "vancouver-to-edmonton-movers", "vancouver-to-halifax-movers", "ottawa-to-victoria-movers"];
    for (const slug of sentinels) {
      await mkdir(join(tempRoot, slug), { recursive: true });
      await writeFile(join(tempRoot, slug, "index.html"), `sentinel:${slug}`, "utf8");
    }
    const run = spawnSync(process.execPath, [resolve("tools/generate-spa-routes.mjs"), tempRoot], { encoding: "utf8" });
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, /Preserve existing static page: \/about\//);
    assert.match(run.stdout, /Preserve existing static\/hub page: \/calgary-long-distance-movers\//);
    assert.match(run.stdout, /Preserve existing static\/hub page: \/toronto-long-distance-movers\//);
    assert.match(run.stdout, /Preserve existing static\/hub page: \/ottawa-long-distance-movers\//);
    assert.match(run.stdout, /Preserve existing static\/hub page: \/victoria-long-distance-movers\//);
    assert.match(run.stdout, /Ownership skip: \/ottawa-to-victoria-movers\/ belongs to rebuild-victoria-ottawa-route\.mjs/);
    assert.match(run.stdout, /Ownership skip: \/victoria-to-montreal-movers\/ belongs to checked-in-static-route-source/);
    assert.match(run.stdout, /Ownership skip: \/calgary-to-edmonton-movers\/ belongs to checked-in-static-route-source/);
    assert.match(run.stdout, /Ownership skip: \/calgary-to-toronto-movers\/ belongs to rebuild-calgary-toronto-static-routes\.mjs/);
    assert.match(run.stdout, /Ownership skip: \/toronto-to-calgary-movers\/ belongs to rebuild-calgary-toronto-static-routes\.mjs/);
    assert.match(run.stdout, /Ownership skip: \/edmonton-to-calgary-movers\/ belongs to checked-in-static-route-source/);
    assert.match(run.stdout, /Ownership skip: \/edmonton-to-ottawa-movers\/ belongs to checked-in-static-route-source/);
    assert.match(run.stdout, /Ownership skip: \/vancouver-to-halifax-movers\/ belongs to rebuild-halifax-vancouver-routes\.mjs/);
    assert.match(await readFile(join(tempRoot, "bc-to-washington-movers/index.html"), "utf8"), /<html/i);
    for (const slug of sentinels) assert.equal(await readFile(join(tempRoot, slug, "index.html"), "utf8"), `sentinel:${slug}`);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("BC to Washington SPA owner normalizes only its durable pricing heading and raw route metadata", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-step68-bc-washington-"));
  try {
    await mkdir(join(tempRoot, "assets"), { recursive: true });
    await mkdir(join(tempRoot, "bc-to-washington-movers"), { recursive: true });
    await copyFile(resolve("site-copy/index.html"), join(tempRoot, "index.html"));
    const currentBundle = await readFile(resolve("site-copy/assets/index-CNBNs70h.js"), "utf8");
    await writeFile(
      join(tempRoot, "assets/index-CNBNs70h.js"),
      currentBundle.replace("BC to Washington State Moving Costs", "BC to Washington State Moving Cost Breakdown"),
      "utf8",
    );
    const currentHtml = await readFile(resolve("site-copy/bc-to-washington-movers/index.html"), "utf8");
    const legacyHtml = currentHtml
      .replaceAll("https://purelycanadianmovers.com/bc-to-washington-movers/", "https://purelycanadianmovers.com/")
      .replace(/<meta name="description" content="[^"]*"\s*\/?>/, '<meta name="description" content="generic" />');
    await writeFile(join(tempRoot, "bc-to-washington-movers/index.html"), legacyHtml, "utf8");

    const first = spawnSync(process.execPath, [resolve("tools/generate-spa-routes.mjs"), tempRoot], { encoding: "utf8" });
    assert.equal(first.status, 0, first.stderr);
    const afterFirstHtml = await readFile(join(tempRoot, "bc-to-washington-movers/index.html"), "utf8");
    const afterFirstBundle = await readFile(join(tempRoot, "assets/index-CNBNs70h.js"), "utf8");
    assert.match(afterFirstHtml, /<link rel="canonical" id="canonical-tag" href="https:\/\/purelycanadianmovers\.com\/bc-to-washington-movers\/"/);
    assert.match(afterFirstHtml, /<meta property="og:url" content="https:\/\/purelycanadianmovers\.com\/bc-to-washington-movers\/"/);
    assert.match(afterFirstHtml, /<meta name="description" content="BC to Washington movers with overnight service\./);
    assert.doesNotMatch(afterFirstBundle, /BC to Washington State Moving Cost Breakdown/);
    assert.match(afterFirstBundle, /BC to Washington State Moving Costs/);

    const second = spawnSync(process.execPath, [resolve("tools/generate-spa-routes.mjs"), tempRoot], { encoding: "utf8" });
    assert.equal(second.status, 0, second.stderr);
    assert.equal(await readFile(join(tempRoot, "bc-to-washington-movers/index.html"), "utf8"), afterFirstHtml);
    assert.equal(await readFile(join(tempRoot, "assets/index-CNBNs70h.js"), "utf8"), afterFirstBundle);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Calgary-Edmonton Step 35 facts are symmetric and frozen", () => {
  assert.equal(calgaryEdmontonRouteFacts.distance, "approximately 300 km");
  assert.equal(calgaryEdmontonRouteFacts.transit, "2–4 days");
  assert.deepEqual(calgaryEdmontonRouteFacts.pricing.map((row) => row.price), [
    "$800+", "$1,100+", "$1,500+", "$2,000+", "$2,800+",
  ]);
  assert.equal(calgaryEdmontonRouteFacts.range, "$800–$2,800+");
  assert.equal(calgaryEdmontonRouteFacts.directionalPricing, "symmetric");
});

test("Calgary-Edmonton Step 35 finalizer is pair-scoped and byte-idempotent", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-step35-calgary-edmonton-"));
  try {
    for (const slug of ["calgary-to-edmonton-movers", "edmonton-to-calgary-movers"]) {
      await mkdir(join(tempRoot, slug), { recursive: true });
      await copyFile(resolve(`site-copy/${slug}/index.html`), join(tempRoot, slug, "index.html"));
    }
    const once = spawnSync(process.execPath, [resolve("tools/finalize-calgary-edmonton-routes.mjs"), tempRoot], { encoding: "utf8" });
    assert.equal(once.status, 0, once.stderr);
    const first = await Promise.all(["calgary-to-edmonton-movers", "edmonton-to-calgary-movers"].map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    const twice = spawnSync(process.execPath, [resolve("tools/finalize-calgary-edmonton-routes.mjs"), tempRoot], { encoding: "utf8" });
    assert.equal(twice.status, 0, twice.stderr);
    const second = await Promise.all(["calgary-to-edmonton-movers", "edmonton-to-calgary-movers"].map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    assert.deepEqual(second, first);
    for (const html of second) {
      assert.match(html, /~300 km/);
      assert.match(html, /2–4 days/);
      assert.match(html, /\$800–\$2,800\+/);
      assert.doesNotMatch(html, /4,900 km|8–20 days|\$2,600–\$16,000\+/);
      assert.doesNotMatch(html, /<script\b[^>]*type=["']module["']/i);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Ottawa-Victoria has a route-specific modern template, not a legacy prose sentinel", async () => {
  const template = await readFile(resolve("tools/templates/victoria-ottawa-routes/ottawa-to-victoria-movers.html"), "utf8");
  const writer = await readFile(resolve("tools/rebuild-victoria-ottawa-route.mjs"), "utf8");
  assert.match(template, /<h1[^>]*>Ottawa to Victoria &amp; Nanaimo Movers<\/h1>/i);
  assert.match(template, /data-pcm-route="ottawa-to-victoria"/);
  assert.match(template, /Route at a Glance/);
  assert.match(template, /FAQPage/);
  assert.doesNotMatch(writer, /legacy pricing block not found/i);
  assert.doesNotMatch(writer, /Ottawa to Victoria\/Nanaimo Moving Cost Breakdown/);
});

test("the Toronto hub helper owns one marked canonical, idempotent route list", async () => {
  const original = await readFile(resolve("site-copy/toronto-long-distance-movers/index.html"), "utf8");
  const once = updateTorontoHubRoutes(original, { requireExisting: true });
  const twice = updateTorontoHubRoutes(once, { requireExisting: true });
  assert.equal(twice, once);
  assert.equal(once.split(torontoHubRouteMarker).length - 1, 1);
  for (const [href] of torontoHubRoutes) {
    assert.equal(once.split(`href="${href}"`).length - 1, 1, href);
  }
  const routeLinks = [...once.matchAll(/href="(\/toronto-to-[^"]+-movers\/)"/g)].map((match) => match[1]);
  assert.equal(routeLinks.length, torontoHubRoutes.length);
  assert.equal(new Set(routeLinks).size, torontoHubRoutes.length);
});

test("the Ottawa hub helper owns one marked canonical, idempotent route list", async () => {
  const original = await readFile(resolve("site-copy/ottawa-long-distance-movers/index.html"), "utf8");
  const once = updateOttawaHubRoutes(original, { requireExisting: true });
  const twice = updateOttawaHubRoutes(once, { requireExisting: true });
  assert.equal(twice, once);
  assert.equal(once.split(ottawaHubRouteMarker).length - 1, 1);
  for (const [href] of ottawaHubRoutes) {
    assert.equal(once.split(`href="${href}"`).length - 1, 1, href);
  }
  const routeLinks = [...once.matchAll(/href="(\/ottawa-to-[^"]+-movers\/)"/g)].map((match) => match[1]);
  assert.equal(routeLinks.length, ottawaHubRoutes.length);
  assert.equal(new Set(routeLinks).size, ottawaHubRoutes.length);
});

test("the Victoria hub helper owns one marked canonical, idempotent route list", async () => {
  const original = await readFile(resolve("site-copy/victoria-long-distance-movers/index.html"), "utf8");
  const once = updateVictoriaHubRoutes(original, { requireExisting: true });
  const twice = updateVictoriaHubRoutes(once, { requireExisting: true });
  assert.equal(twice, once);
  assert.equal(once.split(victoriaHubRouteMarker).length - 1, 1);
  for (const [href] of victoriaHubRoutes) {
    assert.equal(once.split(`href="${href}"`).length - 1, 1, href);
  }
  const routeLinks = [...once.matchAll(/href="(\/victoria-to-[^"]+-movers\/)"/g)].map((match) => match[1]);
  assert.equal(routeLinks.length, victoriaHubRoutes.length);
  assert.equal(new Set(routeLinks).size, victoriaHubRoutes.length);
});

test("the Winnipeg-pair owners use explicit templates and are order-independent", async () => {
  const modernFirstRoot = await mkdtemp(join(tmpdir(), "pcm-winnipeg-modern-first-"));
  const torontoFirstRoot = await mkdtemp(join(tmpdir(), "pcm-winnipeg-toronto-first-"));
  const outputSlugs = [
    "vancouver-to-winnipeg-movers",
    "winnipeg-to-vancouver-movers",
    "toronto-to-winnipeg-movers",
    "winnipeg-to-toronto-movers",
  ];
  const unrelatedSources = ["vancouver-to-toronto-movers", "toronto-to-vancouver-movers"];

  async function seed(root) {
    await mkdir(join(root, "long-distance-moving-cost-canada"), { recursive: true });
    await copyFile(resolve("site-copy/long-distance-moving-cost-canada/index.html"), join(root, "long-distance-moving-cost-canada/index.html"));
    for (const slug of unrelatedSources) {
      await mkdir(join(root, slug), { recursive: true });
      await writeFile(join(root, slug, "index.html"), `sentinel:${slug}`, "utf8");
    }
  }

  function run(script, root) {
    const result = spawnSync(process.execPath, [resolve("tools", script), root], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  }

  async function snapshot(root) {
    return Promise.all(outputSlugs.map((slug) => readFile(join(root, slug, "index.html"), "utf8")));
  }

  try {
    await seed(modernFirstRoot);
    await seed(torontoFirstRoot);

    run("rebuild-winnipeg-modern-routes.mjs", modernFirstRoot);
    run("rebuild-winnipeg-modern-routes.mjs", modernFirstRoot);
    run("rebuild-toronto-winnipeg-routes.mjs", modernFirstRoot);
    const modernFirstSnapshot = await snapshot(modernFirstRoot);
    run("rebuild-toronto-winnipeg-routes.mjs", modernFirstRoot);
    assert.deepEqual(await snapshot(modernFirstRoot), modernFirstSnapshot);

    run("rebuild-toronto-winnipeg-routes.mjs", torontoFirstRoot);
    run("rebuild-toronto-winnipeg-routes.mjs", torontoFirstRoot);
    run("rebuild-winnipeg-modern-routes.mjs", torontoFirstRoot);
    const torontoFirstSnapshot = await snapshot(torontoFirstRoot);
    run("rebuild-winnipeg-modern-routes.mjs", torontoFirstRoot);
    assert.deepEqual(await snapshot(torontoFirstRoot), torontoFirstSnapshot);
    assert.deepEqual(torontoFirstSnapshot, modernFirstSnapshot);

    for (const html of modernFirstSnapshot.slice(0, 2)) {
      assert.match(html, /step40-vancouver-winnipeg\.css/);
      assert.match(html, /step40-vancouver-winnipeg\.js/);
      assert.match(html, /2,300 km/);
      assert.match(html, /5–13 days/);
      for (const price of ["$2,400+", "$3,400+", "$5,500+", "$8,900+", "$13,000+"]) assert.ok(html.includes(price));
      assert.doesNotMatch(html, /TORONTO TO VANCOUVER MOVERS|toronto-long-distance-movers/i);
      assert.doesNotMatch(html, /<script\b[^>]*type=["']module["']/i);
      assert.equal((html.match(/"@type":"FAQPage"/g) ?? []).length, 1);
      assert.deepEqual(faqParityDifferences(html).differences, []);
    }

    for (const root of [modernFirstRoot, torontoFirstRoot]) {
      for (const slug of unrelatedSources) {
        assert.equal(await readFile(join(root, slug, "index.html"), "utf8"), `sentinel:${slug}`);
      }
    }
  } finally {
    await rm(modernFirstRoot, { recursive: true, force: true });
    await rm(torontoFirstRoot, { recursive: true, force: true });
  }
});

test("an allowed finalizer runs against temp copies without touching source pages", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-route-finalizer-"));
  try {
    for (const slug of ["montreal-to-edmonton-movers", "edmonton-to-montreal-movers"]) {
      await mkdir(join(tempRoot, slug), { recursive: true });
      await copyFile(resolve("site-copy", slug, "index.html"), join(tempRoot, slug, "index.html"));
    }
    await mkdir(join(tempRoot, "long-distance-moving-cost-canada"), { recursive: true });
    await copyFile(resolve("site-copy/long-distance-moving-cost-canada/index.html"), join(tempRoot, "long-distance-moving-cost-canada/index.html"));
    const run = spawnSync(process.execPath, [resolve("tools/finalize-montreal-edmonton-routes.mjs"), tempRoot], { encoding: "utf8" });
    assert.equal(run.status, 0, run.stderr);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("the Step 37 Edmonton-Ottawa finalizer is deterministic and preserves mixed rendering", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-step37-finalizer-"));
  const slugs = ["edmonton-to-ottawa-movers", "ottawa-to-edmonton-movers"];
  try {
    for (const slug of slugs) {
      await mkdir(join(tempRoot, slug), { recursive: true });
      await copyFile(resolve("site-copy", slug, "index.html"), join(tempRoot, slug, "index.html"));
    }
    const run = () => spawnSync(process.execPath, [resolve("tools/finalize-edmonton-ottawa-routes.mjs"), tempRoot], { encoding: "utf8" });
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    const once = await Promise.all(slugs.map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    const second = run();
    assert.equal(second.status, 0, second.stderr);
    const twice = await Promise.all(slugs.map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    assert.deepEqual(twice, once);
    for (const html of twice) {
      assert.equal((html.match(/data-pcm-step37-faq="1"/g) ?? []).length, 1);
      assert.equal((html.match(/id="pcm-step37-faq-schema"/g) ?? []).length, 1);
      assert.match(html, new RegExp(edmontonOttawaFacts.transit));
      for (const [, price] of edmontonOttawaFacts.rows) assert.ok(html.includes(price));
    }
    assert.doesNotMatch(twice[0], /<script\b[^>]*type=["']module["']/i);
    assert.match(twice[1], /<script\b[^>]*type=["']module["']/i);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("the Step 39 Toronto-Victoria finalizer is deterministic and preserves mixed rendering", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-step39-finalizer-"));
  const slugs = ["toronto-to-victoria-movers", "victoria-to-toronto-movers"];
  try {
    for (const slug of slugs) {
      await mkdir(join(tempRoot, slug), { recursive: true });
      await copyFile(resolve("site-copy", slug, "index.html"), join(tempRoot, slug, "index.html"));
    }
    const run = () => spawnSync(process.execPath, [resolve("tools/finalize-toronto-victoria-routes.mjs"), tempRoot], { encoding: "utf8" });
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    const once = await Promise.all(slugs.map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    const second = run();
    assert.equal(second.status, 0, second.stderr);
    const twice = await Promise.all(slugs.map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    assert.deepEqual(twice, once);
    for (const html of twice) {
      assert.equal((html.match(/data-pcm-step39-pricing="1"/g) ?? []).length, 1);
      assert.equal((html.match(/data-pcm-step39-faq="1"/g) ?? []).length, 1);
      assert.equal((html.match(/id="pcm-step39-faq-schema"/g) ?? []).length, 1);
      assert.match(html, new RegExp(torontoVictoriaFacts.transit));
      for (const [, price] of torontoVictoriaFacts.rows) assert.ok(html.includes(price));
    }
    assert.match(twice[0], /<script\b[^>]*type=["']module["']/i);
    assert.doesNotMatch(twice[1], /<script\b[^>]*type=["']module["']/i);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("the Step 49 Seattle-Vancouver finalizer is deterministic and preserves static cross-border identity", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-step49-finalizer-"));
  const slugs = ["vancouver-to-seattle-movers", "seattle-to-vancouver-movers"];
  try {
    for (const route of SEATTLE_VANCOUVER_ROUTES) {
      assertSeattleVancouverRouteData(route);
      assert.ok(Object.isFrozen(route));
    }
    assert.equal(SEATTLE_VANCOUVER_FACTS.distance, null);
    assert.deepEqual(SEATTLE_VANCOUVER_FACTS.pricing.map((row) => row[1]), ["US$2,150", "US$2,700", "US$3,100", "US$3,700", "US$4,500"]);
    for (const slug of slugs) {
      await mkdir(join(tempRoot, slug), { recursive: true });
      await copyFile(resolve("site-copy", slug, "index.html"), join(tempRoot, slug, "index.html"));
    }
    const run = () => spawnSync(process.execPath, [resolve("tools/finalize-seattle-vancouver-routes.mjs"), tempRoot], { encoding: "utf8" });
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    const once = await Promise.all(slugs.map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    const second = run();
    assert.equal(second.status, 0, second.stderr);
    const twice = await Promise.all(slugs.map((slug) => readFile(join(tempRoot, slug, "index.html"), "utf8")));
    assert.deepEqual(twice, once);
    for (const html of twice) {
      assert.doesNotMatch(html, /<script\b[^>]*type=["']module["']/i);
      assert.match(html, /step49-seattle-vancouver\.(?:css|js)/);
      assert.equal((html.match(/class="[^"]*pcm-route-cost\b/g) ?? []).length, 1);
      assert.equal((html.match(/<tbody><tr>/g) ?? []).length, 1);
      assert.equal((html.match(/<tr>/g) ?? []).length >= 6, true);
      assert.doesNotMatch(html, /pcm-local-seo|\bundefined\b|interprovincial/i);
      for (const [, price] of SEATTLE_VANCOUVER_FACTS.pricing) assert.ok(html.includes(price));
    }
    assert.match(twice[0], /VANCOUVER → SEATTLE/);
    assert.match(twice[1], /SEATTLE → VANCOUVER/);
    assert.doesNotMatch(twice[1], /What documents are needed for a move to Washington|move apartments and houses to Seattle/i);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("the Step 50 Victoria-Vancouver finalizer is deterministic, route-scoped, and preserves intra-BC identity", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "pcm-step50-victoria-vancouver-"));
  const slug = VICTORIA_VANCOUVER_ROUTE.slug;
  try {
    assertVictoriaVancouverRouteData();
    assert.ok(Object.isFrozen(VICTORIA_VANCOUVER_FACTS));
    assert.ok(Object.isFrozen(VICTORIA_VANCOUVER_ROUTE));
    assert.equal(VICTORIA_VANCOUVER_FACTS.distance, "approximately 110 km");
    assert.equal(VICTORIA_VANCOUVER_FACTS.transit, "1–3 days");
    assert.equal(VICTORIA_VANCOUVER_FACTS.range, "$1,200–$4,200+");
    assert.deepEqual(VICTORIA_VANCOUVER_FACTS.pricing.map((row) => row[1]), [
      "$1,200+", "$1,600+", "$2,200+", "$3,000+", "$4,200+",
    ]);
    await mkdir(join(tempRoot, slug), { recursive: true });
    await copyFile(resolve("site-copy", slug, "index.html"), join(tempRoot, slug, "index.html"));
    const unrelatedSlug = "victoria-to-montreal-movers";
    await mkdir(join(tempRoot, unrelatedSlug), { recursive: true });
    await writeFile(join(tempRoot, unrelatedSlug, "index.html"), "sentinel:unrelated", "utf8");
    const run = () => spawnSync(process.execPath, [resolve("tools/finalize-victoria-vancouver-route.mjs"), tempRoot], { encoding: "utf8" });
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    const once = await readFile(join(tempRoot, slug, "index.html"), "utf8");
    const second = run();
    assert.equal(second.status, 0, second.stderr);
    const twice = await readFile(join(tempRoot, slug, "index.html"), "utf8");
    assert.equal(twice, once);
    assert.equal(await readFile(join(tempRoot, unrelatedSlug, "index.html"), "utf8"), "sentinel:unrelated");
    assert.doesNotMatch(twice, /<script\b[^>]*type=["']module["']|MutationObserver|pcm-local-seo|\bundefined\b/i);
    const main = twice.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? "";
    assert.doesNotMatch(main, /interprovincial|cross-country|cross-border|Toronto|Calgary|Edmonton|Montreal|Ottawa|Halifax|Winnipeg|Seattle/i);
    assert.match(twice, /step50-victoria-vancouver\.(?:css|js)/);
    assert.match(twice, /Victoria, BC/);
    assert.match(twice, /Vancouver, BC/);
    assert.equal((twice.match(/class="[^"]*pcm-route-cost\b/g) ?? []).length, 1);
    assert.equal((twice.match(/<tbody><tr>/g) ?? []).length, 1);
    for (const [, price] of VICTORIA_VANCOUVER_FACTS.pricing) assert.ok(twice.includes(price));
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
