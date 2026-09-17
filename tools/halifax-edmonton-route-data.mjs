export const HALIFAX_EDMONTON_ROUTES = Object.freeze([
  { slug: "halifax-to-edmonton-movers", source: "halifax-to-calgary-movers", from: "Halifax", fromProvince: "NS", fromProvinceName: "Nova Scotia", to: "Edmonton", toProvince: "AB", toProvinceName: "Alberta", distance: "~4,700 km", distanceProse: "4,700 km", opposite: "Edmonton to Halifax", oppositeSlug: "edmonton-to-halifax-movers" },
  { slug: "edmonton-to-halifax-movers", source: "calgary-to-halifax-movers", from: "Edmonton", fromProvince: "AB", fromProvinceName: "Alberta", to: "Halifax", toProvince: "NS", toProvinceName: "Nova Scotia", distance: "~4,700 km", distanceProse: "4,700 km", opposite: "Halifax to Edmonton", oppositeSlug: "halifax-to-edmonton-movers" },
]);

export const HALIFAX_EDMONTON_PRICING = Object.freeze([
  ["Studio or small shipment", "$2,600+", "Best for limited furniture or a partial shipment"],
  ["1-bedroom", "$3,900–$6,500+", "Depends on inventory weight or volume, access, and packing"],
  ["2-bedroom", "$6,500+", "Common planning range for an apartment or condo move"],
  ["3-bedroom", "$11,000+", "Larger household shipment with more labour and space"],
  ["4+ bedroom", "$16,000+", "Final estimate depends on inventory, access, and services"],
]);

export const HALIFAX_EDMONTON_FACTS = Object.freeze({ transit: "8–20 days", range: "$2,600+–$16,000+" });
