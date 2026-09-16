import { edmontonOttawaFacts, edmontonOttawaRoutes } from "./edmonton-ottawa-route-data.mjs";

export { edmontonOttawaFacts };
export const ottawaEdmontonRoute = Object.freeze({
  ...edmontonOttawaRoutes["/ottawa-to-edmonton-movers/"],
  path: "/ottawa-to-edmonton-movers/",
  slug: "ottawa-to-edmonton-movers",
  prices: Object.freeze(edmontonOttawaFacts.rows.map(([, price]) => price)),
});
