export const VANCOUVER_WINNIPEG_FACTS = Object.freeze({
  distance: "2,300 km",
  transit: "5–13 days",
  range: "$2,400–$13,000+",
  prices: Object.freeze(["$2,400+", "$3,400+", "$5,500+", "$8,900+", "$13,000+"]),
});

export const VANCOUVER_WINNIPEG_ROUTES = Object.freeze([
  Object.freeze({
    slug: "vancouver-to-winnipeg-movers",
    from: "Vancouver",
    fromFull: "Vancouver, BC",
    to: "Winnipeg",
    toFull: "Winnipeg, MB",
    pickup: "Vancouver pickup planning should account for strata move rules, elevator reservations, loading-zone availability, parking restrictions, stairs, long carries, and building move windows.",
    delivery: "Winnipeg delivery planning should account for building access, elevators, curb and loading space, snow-route restrictions, stairs, and long carries.",
    corridor: "The eastbound route crosses the BC interior and the Prairies. Mountain and Prairie conditions can affect the working schedule, especially in winter, so delivery planning should retain reasonable flexibility.",
  }),
  Object.freeze({
    slug: "winnipeg-to-vancouver-movers",
    from: "Winnipeg",
    fromFull: "Winnipeg, MB",
    to: "Vancouver",
    toFull: "Vancouver, BC",
    pickup: "Winnipeg pickup planning should account for building access, elevators, curb and loading space, snow-route restrictions, stairs, and long carries.",
    delivery: "Vancouver delivery planning should account for strata move rules, elevator reservations, loading-zone availability, parking restrictions, stairs, long carries, and building move windows.",
    corridor: "The westbound route crosses the Prairies and the BC interior. Prairie and mountain conditions can affect the working schedule, especially in winter, so arrival planning should retain reasonable flexibility.",
  }),
]);

export const VANCOUVER_WINNIPEG_BY_PATH = Object.freeze(Object.fromEntries(
  VANCOUVER_WINNIPEG_ROUTES.map((route) => [`/${route.slug}/`, Object.freeze({ ...route, ...VANCOUVER_WINNIPEG_FACTS })]),
));
