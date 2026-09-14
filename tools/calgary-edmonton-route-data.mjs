// Step 35A authoritative route facts for both Calgary/Edmonton directions.
//
// Pricing and transit come from the route-specific COST table in patch-geo.mjs,
// documented there as mirroring the site's chatbot price table. The compiled
// cost-guide table independently carries the same five prices in both
// directions. The prior 4,900 km / 7-20 day / $2,600-$16,000+ page values are
// copied long-corridor contamination and are not authoritative.
//
// No valid PCM repository record supplied a distance. Step 35A intentionally
// establishes the rounded practical intercity value below as the PCM page
// authority. Alberta's official Highway 2 material describes the core
// Calgary-Edmonton highway corridor as roughly 260 km; door-to-door origins and
// destinations vary, so the route-page planning value is rounded to about
// 300 km rather than claiming false precision.

export const calgaryEdmontonRouteFacts = Object.freeze({
  distance: "approximately 300 km",
  transit: "2–4 days",
  pricing: Object.freeze([
    Object.freeze({ homeSize: "Studio", price: "$800+" }),
    Object.freeze({ homeSize: "1-bedroom", price: "$1,100+" }),
    Object.freeze({ homeSize: "2-bedroom", price: "$1,500+" }),
    Object.freeze({ homeSize: "3-bedroom", price: "$2,000+" }),
    Object.freeze({ homeSize: "4+ bedroom", price: "$2,800+" }),
  ]),
  range: "$800–$2,800+",
  directionalPricing: "symmetric",
  source: Object.freeze({
    transitAndPricing: "tools/patch-geo.mjs COST['calgary-edmonton'], corroborated by the compiled cost-guide/chatbot table",
    distance: "Step 35A PCM route-page authority, externally corroborated by Alberta Highway 2 corridor material",
  }),
});

export const calgaryEdmontonRoutes = Object.freeze({
  "/calgary-to-edmonton-movers/": Object.freeze({
    origin: "Calgary, AB",
    destination: "Edmonton, AB",
    facts: calgaryEdmontonRouteFacts,
  }),
  "/edmonton-to-calgary-movers/": Object.freeze({
    origin: "Edmonton, AB",
    destination: "Calgary, AB",
    facts: calgaryEdmontonRouteFacts,
  }),
});
