export const WINNIPEG_MONTREAL_FACTS = Object.freeze({
  distance: "2,270 km",
  transit: "5–13 days",
  range: "$2,400–$13,000+",
  priceRows: Object.freeze([
    Object.freeze({ label: "Studio or small shipment", price: "$2,400+", note: "Compact or partial shipment" }),
    Object.freeze({ label: "1-bedroom", price: "$3,400+", note: "Apartment move" }),
    Object.freeze({ label: "2-bedroom", price: "$5,500+", note: "Typical small household" }),
    Object.freeze({ label: "3-bedroom", price: "$9,000+", note: "Larger household" }),
    Object.freeze({ label: "4+ bedroom", price: "$13,000+", note: "Large or complex shipment" }),
  ]),
});

export const WINNIPEG_MONTREAL_ROUTES = Object.freeze([
  Object.freeze({
    slug: "winnipeg-to-montreal-movers",
    from: "Winnipeg",
    fromFull: "Winnipeg, MB",
    to: "Montreal",
    toFull: "Montreal, QC",
    direction: "eastbound",
    pickup: "Winnipeg pickup planning should account for building access, elevator reservations, loading space, winter conditions, stairs, long carries, and confirmed move windows.",
    delivery: "Montreal delivery planning should account for apartment or condo rules, elevator reservations, loading-zone availability, parking restrictions, stairs, long carries, and building move windows.",
    corridor: "The eastbound corridor connects Manitoba with Quebec. Prairie, Great Lakes, and winter conditions can affect the working schedule, so Montreal delivery planning should retain reasonable flexibility.",
  }),
  Object.freeze({
    slug: "montreal-to-winnipeg-movers",
    from: "Montreal",
    fromFull: "Montreal, QC",
    to: "Winnipeg",
    toFull: "Winnipeg, MB",
    direction: "westbound",
    pickup: "Montreal pickup planning should account for apartment or condo rules, elevator reservations, loading-zone availability, parking restrictions, stairs, long carries, and building move windows.",
    delivery: "Winnipeg delivery planning should account for building access, elevator reservations, loading space, winter conditions, stairs, long carries, and confirmed move windows.",
    corridor: "The westbound corridor connects Quebec with Manitoba. Great Lakes, Prairie, and winter conditions can affect the working schedule, so Winnipeg delivery planning should retain reasonable flexibility.",
  }),
]);

export const WINNIPEG_MONTREAL_BY_PATH = Object.freeze(Object.fromEntries(
  WINNIPEG_MONTREAL_ROUTES.map((route) => [
    `/${route.slug}/`,
    Object.freeze({ ...route, ...WINNIPEG_MONTREAL_FACTS }),
  ]),
));

export function assertWinnipegMontrealRouteData(route) {
  const requiredStrings = ["slug", "from", "fromFull", "to", "toFull", "direction", "distance", "transit", "range"];
  for (const field of requiredStrings) {
    if (typeof route[field] !== "string" || !route[field].trim()) {
      throw new Error(`${route.slug || "Winnipeg–Montreal route"}: missing required ${field}`);
    }
  }
  if (!Array.isArray(route.priceRows) || route.priceRows.length !== 5) {
    throw new Error(`${route.slug}: expected exactly five authoritative pricing rows`);
  }
  for (const [index, row] of route.priceRows.entries()) {
    for (const field of ["label", "price", "note"]) {
      if (typeof row?.[field] !== "string" || !row[field].trim()) {
        throw new Error(`${route.slug}: pricing row ${index + 1} is missing ${field}`);
      }
    }
  }
}
