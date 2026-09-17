import { torontoVictoriaFacts, torontoVictoriaRoutes } from "./toronto-victoria-route-data.mjs";

const source = torontoVictoriaRoutes["/toronto-to-victoria-movers/"];

export const torontoVictoriaStaticRoute = Object.freeze({
  ...source,
  ...torontoVictoriaFacts,
  path: "/toronto-to-victoria-movers/",
  slug: "toronto-to-victoria-movers",
});
