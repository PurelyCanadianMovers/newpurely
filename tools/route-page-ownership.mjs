const SPA_GENERATOR = "generate-spa-routes.mjs";
const CHECKED_IN_STATIC_SOURCE = "checked-in-static-route-source";
const VANCOUVER_EDMONTON_STATIC_FINALIZER = "finalize-vancouver-edmonton-routes.mjs";
const TITLE_METADATA_NORMALIZER = "normalize-route-title-metadata.mjs";
const FAQ_ARCHITECTURE_FINALIZER = "finalize-route-faq-architecture.mjs";
const ROUTE_PROMO_FINALIZER = "finalize-route-promo.mjs";
const VICTORIA_VANCOUVER_FINALIZER = "finalize-victoria-vancouver-route.mjs";
const HALIFAX_VANCOUVER_STATIC_GENERATOR = "rebuild-halifax-vancouver-routes.mjs";
const CALGARY_TORONTO_STATIC_GENERATOR = "rebuild-calgary-toronto-static-routes.mjs";
const CALGARY_VANCOUVER_STATIC_GENERATOR = "rebuild-calgary-vancouver-static-routes.mjs";

const ownerGroups = {
  [SPA_GENERATOR]: [
    "bc-to-washington-movers",
    "edmonton-to-montreal-movers",
    "edmonton-to-toronto-movers",
    "edmonton-to-vancouver-movers",
    "montreal-to-calgary-movers",
    "montreal-to-edmonton-movers",
    "montreal-to-toronto-movers",
    "montreal-to-victoria-movers",
    "ottawa-to-edmonton-movers",
    "toronto-to-edmonton-movers",
    "toronto-to-montreal-movers",
    "toronto-to-vancouver-movers",
    "toronto-to-victoria-movers",
    "vancouver-to-toronto-movers",
  ],
  [CALGARY_TORONTO_STATIC_GENERATOR]: [
    "calgary-to-toronto-movers",
    "toronto-to-calgary-movers",
  ],
  [CALGARY_VANCOUVER_STATIC_GENERATOR]: [
    "calgary-to-vancouver-movers",
    "vancouver-to-calgary-movers",
  ],
  "generate-halifax-calgary-route-pages.mjs": [
    "calgary-to-halifax-movers",
    "halifax-to-calgary-movers",
  ],
  "fix-winnipeg-static-routes.mjs": [
    "ottawa-to-winnipeg-movers",
    "winnipeg-to-ottawa-movers",
  ],
  "rebuild-calgary-ottawa-routes.mjs": [
    "calgary-to-ottawa-movers",
    "ottawa-to-calgary-movers",
  ],
  "rebuild-calgary-winnipeg-routes.mjs": [
    "calgary-to-winnipeg-movers",
    "winnipeg-to-calgary-movers",
  ],
  "rebuild-edmonton-winnipeg-routes.mjs": [
    "edmonton-to-winnipeg-movers",
    "winnipeg-to-edmonton-movers",
  ],
  "rebuild-ottawa-toronto-routes.mjs": [
    "ottawa-to-toronto-movers",
    "toronto-to-ottawa-movers",
  ],
  "rebuild-toronto-winnipeg-routes.mjs": [
    "toronto-to-winnipeg-movers",
    "winnipeg-to-toronto-movers",
  ],
  "rebuild-victoria-ottawa-route.mjs": [
    "ottawa-to-victoria-movers",
    "victoria-to-ottawa-movers",
  ],
  "rebuild-winnipeg-modern-routes.mjs": [
    "vancouver-to-winnipeg-movers",
    "winnipeg-to-vancouver-movers",
  ],
  "rebuild-winnipeg-montreal-routes.mjs": [
    "montreal-to-winnipeg-movers",
    "winnipeg-to-montreal-movers",
  ],
  "standardize-montreal-vancouver-routes.mjs": [
    "montreal-to-vancouver-movers",
    "ottawa-to-vancouver-movers",
    "vancouver-to-montreal-movers",
    "vancouver-to-ottawa-movers",
  ],
  "update-halifax-toronto-routes.mjs": [
    "halifax-to-toronto-movers",
    "toronto-to-halifax-movers",
  ],
  [VANCOUVER_EDMONTON_STATIC_FINALIZER]: [
    "vancouver-to-edmonton-movers",
  ],
  [HALIFAX_VANCOUVER_STATIC_GENERATOR]: [
    "halifax-to-vancouver-movers",
    "vancouver-to-halifax-movers",
  ],
  [CHECKED_IN_STATIC_SOURCE]: [
    "calgary-to-edmonton-movers",
    "calgary-to-montreal-movers",
    "edmonton-to-calgary-movers",
    "edmonton-to-ottawa-movers",
    "seattle-to-vancouver-movers",
    "vancouver-to-seattle-movers",
    "victoria-to-toronto-movers",
    "victoria-to-vancouver-movers",
    "victoria-to-montreal-movers",
  ],
};

const routeRuntimeEnhancers = {
  "calgary-to-toronto-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/step01-calgary-toronto-static.js",
    "site-copy/assets/static-chat.js",
  ],
  "toronto-to-calgary-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/step01-calgary-toronto-static.js",
    "site-copy/assets/static-chat.js",
  ],
  "victoria-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step50-victoria-vancouver.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "seattle-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step49-seattle-vancouver.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "vancouver-to-seattle-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step49-seattle-vancouver.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "halifax-to-toronto-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step47-halifax-toronto.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "toronto-to-halifax-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step47-halifax-toronto.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "toronto-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step46-toronto-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "winnipeg-to-toronto-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step46-toronto-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "calgary-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step44-calgary-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "winnipeg-to-calgary-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step44-calgary-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "calgary-to-ottawa-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step42-calgary-ottawa.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "ottawa-to-calgary-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step42-calgary-ottawa.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "winnipeg-to-montreal-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step41-winnipeg-montreal.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "montreal-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step41-winnipeg-montreal.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "vancouver-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step40-vancouver-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "winnipeg-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step40-vancouver-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "toronto-to-victoria-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step39-toronto-victoria.js",
  ],
  "victoria-to-toronto-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step39-toronto-victoria.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "calgary-to-edmonton-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step35-calgary-edmonton.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "edmonton-to-winnipeg-movers": [
    "site-copy/assets/step34-edmonton-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "edmonton-to-calgary-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step35-calgary-edmonton.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "edmonton-to-ottawa-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step37-edmonton-ottawa.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "ottawa-to-edmonton-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step37-edmonton-ottawa.js",
  ],
  "calgary-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/step02-calgary-vancouver-static.js",
    "site-copy/assets/static-chat.js",
  ],
  "calgary-to-montreal-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step36-montreal-calgary.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "vancouver-to-halifax-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step43-halifax-vancouver.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "halifax-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step43-halifax-vancouver.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "victoria-to-montreal-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
  "vancouver-to-calgary-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/step02-calgary-vancouver-static.js",
    "site-copy/assets/static-chat.js",
  ],
  "montreal-to-calgary-movers": [
    "site-copy/assets/conversion-boost.js",
    "site-copy/assets/step36-montreal-calgary.js",
  ],
  "winnipeg-to-edmonton-movers": [
    "site-copy/assets/step34-edmonton-winnipeg.js",
    "site-copy/assets/static-nav.js",
    "site-copy/assets/static-chat.js",
  ],
};

const routeRuntimeStyles = {
  "calgary-to-toronto-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step01-calgary-toronto-static.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "toronto-to-calgary-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step01-calgary-toronto-static.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "victoria-to-vancouver-movers": [
    "site-copy/assets/step50-victoria-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "seattle-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step49-seattle-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "vancouver-to-seattle-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step49-seattle-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "halifax-to-toronto-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step47-halifax-toronto.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "toronto-to-halifax-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step47-halifax-toronto.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "toronto-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step46-toronto-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "winnipeg-to-toronto-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step46-toronto-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "calgary-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step44-calgary-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "winnipeg-to-calgary-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step44-calgary-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "calgary-to-ottawa-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step42-calgary-ottawa.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "ottawa-to-calgary-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step42-calgary-ottawa.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "winnipeg-to-montreal-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step41-winnipeg-montreal.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "montreal-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step41-winnipeg-montreal.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "vancouver-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step40-vancouver-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "winnipeg-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step40-vancouver-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "toronto-to-victoria-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step39-toronto-victoria.css",
  ],
  "victoria-to-toronto-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step39-toronto-victoria.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "calgary-to-edmonton-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step35-calgary-edmonton.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "edmonton-to-winnipeg-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step34-edmonton-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "edmonton-to-calgary-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step35-calgary-edmonton.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "edmonton-to-ottawa-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step37-edmonton-ottawa.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "ottawa-to-edmonton-movers": [
    "site-copy/assets/step37-edmonton-ottawa.css",
  ],
  "calgary-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step33-calgary-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "calgary-to-montreal-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step36-montreal-calgary.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "vancouver-to-halifax-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step43-halifax-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "halifax-to-vancouver-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step43-halifax-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "victoria-to-montreal-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "vancouver-to-calgary-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step33-calgary-vancouver.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
  "montreal-to-calgary-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step36-montreal-calgary.css",
  ],
  "winnipeg-to-edmonton-movers": [
    "site-copy/assets/conversion-boost.css",
    "site-copy/assets/step34-edmonton-winnipeg.css",
    "site-copy/assets/static-nav.css",
    "site-copy/assets/static-chat.css",
  ],
};

const routePostProcessors = {
  "victoria-to-vancouver-movers": [VICTORIA_VANCOUVER_FINALIZER],
  "seattle-to-vancouver-movers": ["finalize-seattle-vancouver-routes.mjs"],
  "vancouver-to-seattle-movers": ["finalize-seattle-vancouver-routes.mjs"],
  "calgary-to-edmonton-movers": ["finalize-calgary-edmonton-routes.mjs"],
  "edmonton-to-toronto-movers": ["finalize-toronto-edmonton-routes.mjs"],
  "edmonton-to-calgary-movers": ["finalize-calgary-edmonton-routes.mjs"],
  "edmonton-to-vancouver-movers": ["finalize-vancouver-edmonton-routes.mjs"],
  "montreal-to-toronto-movers": ["finalize-montreal-toronto-routes.mjs"],
  "montreal-to-victoria-movers": ["finalize-montreal-victoria-routes.mjs"],
  "toronto-to-montreal-movers": ["finalize-montreal-toronto-routes.mjs"],
  "toronto-to-edmonton-movers": ["finalize-toronto-edmonton-routes.mjs"],
  "toronto-to-vancouver-movers": ["finalize-toronto-vancouver-routes.mjs"],
  "toronto-to-victoria-movers": ["finalize-toronto-victoria-routes.mjs"],
  "victoria-to-montreal-movers": ["finalize-montreal-victoria-routes.mjs"],
  "victoria-to-toronto-movers": ["finalize-toronto-victoria-routes.mjs"],
  "edmonton-to-montreal-movers": ["finalize-montreal-edmonton-routes.mjs", "strip-unsupported-route-bootstrap.mjs"],
  "montreal-to-edmonton-movers": ["finalize-montreal-edmonton-routes.mjs"],
  "edmonton-to-ottawa-movers": [
    "finalize-edmonton-ottawa-routes.mjs",
    "add-route-defaults.mjs",
    "add-route-cost-outer-class.mjs",
    "extend-route-normalizer-retry.mjs",
    "fix-route-cost-width.mjs",
    "fix-route-normalizer-existing-block.mjs",
    "fix-shell-guard-layout-target.mjs",
    "move-route-pricing-after-quote.mjs",
  ],
  "ottawa-to-edmonton-movers": [
    "finalize-edmonton-ottawa-routes.mjs",
    "add-route-defaults.mjs",
    "add-route-cost-outer-class.mjs",
    "extend-route-normalizer-retry.mjs",
    "fix-route-cost-width.mjs",
    "fix-route-normalizer-existing-block.mjs",
    "fix-shell-guard-layout-target.mjs",
    "move-route-pricing-after-quote.mjs",
  ],
  "calgary-to-halifax-movers": ["strip-unsupported-route-bootstrap.mjs"],
  "calgary-to-montreal-movers": ["finalize-montreal-calgary-routes.mjs", "strip-unsupported-route-bootstrap.mjs"],
  "montreal-to-calgary-movers": ["finalize-montreal-calgary-routes.mjs"],
  "halifax-to-calgary-movers": ["strip-unsupported-route-bootstrap.mjs"],
  "vancouver-to-toronto-movers": ["finalize-toronto-vancouver-routes.mjs"],
  "montreal-to-vancouver-movers": ["fix-montreal-vancouver-route.mjs"],
};

// Explicit legacy exceptions keep architecture validation strict for new
// contradictions without silently broadening Step 37A into unrelated repairs.
const routeArchitectureExceptions = {
  "edmonton-to-montreal-movers": ["missing-react-bootstrap", "static-nav-chat-on-react"],
  "ottawa-to-victoria-movers": ["module-bootstrap-on-static"],
};

const staticOwners = new Set([
  CHECKED_IN_STATIC_SOURCE,
  "generate-halifax-calgary-route-pages.mjs",
  HALIFAX_VANCOUVER_STATIC_GENERATOR,
  CALGARY_TORONTO_STATIC_GENERATOR,
  CALGARY_VANCOUVER_STATIC_GENERATOR,
  VANCOUVER_EDMONTON_STATIC_FINALIZER,
  "fix-winnipeg-static-routes.mjs",
  "rebuild-calgary-ottawa-routes.mjs",
  "rebuild-calgary-winnipeg-routes.mjs",
  "rebuild-edmonton-winnipeg-routes.mjs",
  "rebuild-ottawa-toronto-routes.mjs",
  "rebuild-toronto-winnipeg-routes.mjs",
  "rebuild-victoria-ottawa-route.mjs",
  "rebuild-winnipeg-modern-routes.mjs",
  "rebuild-winnipeg-montreal-routes.mjs",
  "standardize-montreal-vancouver-routes.mjs",
  "update-halifax-toronto-routes.mjs",
]);

export const routePageOwnership = Object.freeze(
  Object.entries(ownerGroups)
    .flatMap(([owner, slugs]) => slugs.map((slug) => Object.freeze({
      routeUrl: `/${slug}/`,
      owner,
      ownerType: owner === CHECKED_IN_STATIC_SOURCE
        ? "checked-in-static-source"
        : owner === VANCOUVER_EDMONTON_STATIC_FINALIZER
          ? "static-finalizer"
          : "full-page-generator",
      postProcessors: Object.freeze([...(routePostProcessors[slug] ?? []), ROUTE_PROMO_FINALIZER, FAQ_ARCHITECTURE_FINALIZER, TITLE_METADATA_NORMALIZER]),
      runtimeEnhancers: Object.freeze(routeRuntimeEnhancers[slug] ?? ["site-copy/assets/conversion-boost.js"]),
      runtimeStyles: Object.freeze(routeRuntimeStyles[slug] ?? []),
      architectureExceptions: Object.freeze(routeArchitectureExceptions[slug] ?? []),
      rendering: staticOwners.has(owner) ? "static" : "react-spa",
      status: "active",
    })))
    .sort((a, b) => a.routeUrl.localeCompare(b.routeUrl)),
);

export const routeOwnershipByUrl = new Map(routePageOwnership.map((entry) => [entry.routeUrl, entry]));
export const routeOwnerGroups = Object.freeze(ownerGroups);
export const spaGenerator = SPA_GENERATOR;
export const checkedInStaticSource = CHECKED_IN_STATIC_SOURCE;

export function normalizeRouteUrl(route) {
  const value = String(route).replaceAll("\\", "/");
  const slug = value.replace(/^.*?\/?([a-z0-9-]+-to-[a-z0-9-]+-movers)\/?(?:index\.html)?$/, "$1");
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

export function routesOwnedBy(owner) {
  return routePageOwnership.filter((entry) => entry.owner === owner).map((entry) => entry.routeUrl);
}

export function isLongDistanceRouteUrl(route) {
  return /^\/[a-z0-9]+(?:-[a-z0-9]+)*-to-[a-z0-9]+(?:-[a-z0-9]+)*-movers\/$/.test(normalizeRouteUrl(route));
}
