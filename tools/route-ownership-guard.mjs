import { routeOwnershipByUrl, normalizeRouteUrl } from "./route-page-ownership.mjs";

export function assertRouteOwnership(writer, routes) {
  for (const route of routes) {
    const routeUrl = normalizeRouteUrl(typeof route === "string" ? route : route.slug);
    const entry = routeOwnershipByUrl.get(routeUrl);
    if (!entry) throw new Error(`ERROR: ${routeUrl} has no declared full-page owner.`);
    if (entry.owner !== writer) {
      throw new Error(`ERROR: ${routeUrl} is owned by ${entry.owner} but ${writer} also attempts full-page output.`);
    }
  }
}

export function assertAllowedPostProcessor(writer, routes) {
  for (const route of routes) {
    const routeUrl = normalizeRouteUrl(typeof route === "string" ? route : route.slug);
    const entry = routeOwnershipByUrl.get(routeUrl);
    if (!entry) throw new Error(`ERROR: ${routeUrl} has no declared full-page owner.`);
    if (!entry.postProcessors.includes(writer)) {
      throw new Error(`ERROR: ${writer} is not an allowed post-processor for ${routeUrl}.`);
    }
  }
}

export function requireLegacyRouteWriterOptIn(writer, routes, argv = process.argv.slice(2)) {
  if (argv.includes("--allow-legacy-route-writer")) return;
  const routeList = routes.map((route) => normalizeRouteUrl(typeof route === "string" ? route : route.slug)).join(", ");
  throw new Error(
    `ERROR: ${writer} is a non-authoritative legacy full-page writer for ${routeList}. ` +
    "Re-run with --allow-legacy-route-writer only for deliberate historical/manual work.",
  );
}
