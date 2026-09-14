export const HALIFAX_TORONTO_FACTS = Object.freeze({
  distance: "approximately 1,800 km",
  distanceShort: "~1,800 km",
  transit: "5–12 days",
  range: "$2,200+–$7,000+",
  pricing: Object.freeze([
    Object.freeze(["Studio", "$2,200+", "Best for a studio or small shipment"]),
    Object.freeze(["1-bedroom", "$2,900+", "Depends on inventory, access, and requested services"]),
    Object.freeze(["2-bedroom", "$3,900+", "Common planning range for an apartment or condo move"]),
    Object.freeze(["3-bedroom", "$5,300+", "Larger household shipment with more labour and space"]),
    Object.freeze(["4+ bedroom", "$7,000+", "Final estimate depends on inventory, access, and services"]),
  ]),
});

const sharedFaq = Object.freeze([
  Object.freeze(["Are you a direct carrier or do you use subcontractors?", "Purely Canadian Movers coordinates the move through the Great Canadian Van Lines agent network rather than acting as a broker that hands the shipment to an unknown mover. The written estimate identifies the planned services and responsibilities."]),
  Object.freeze(["What protection options are available for my shipment?", "Basic carrier liability applies, and available Declared Value Protection options can be reviewed before booking. The selected protection, inventory, access details, and services are documented in the written estimate."]),
  Object.freeze(["Do you offer packing and unpacking services?", "Yes. Full or partial packing, specialty packing, unpacking, and packing-material removal can be included in the written estimate."]),
  Object.freeze(["What makes Purely Canadian Movers different?", "Purely Canadian Movers is family-owned, has operated since 1991, is BBB Accredited, and coordinates interprovincial moves through the Great Canadian Van Lines agent network with clear written estimates."]),
  Object.freeze(["Do you offer storage solutions?", "Yes. Short- and long-term storage can be coordinated when pickup, possession, and delivery dates do not align."]),
]);

export const HALIFAX_TORONTO_ROUTES = Object.freeze([
  Object.freeze({
    slug: "halifax-to-toronto-movers", from: "Halifax", fromProvince: "NS", to: "Toronto", toProvince: "ON",
    title: "Halifax to Toronto Movers | Purely Canadian Movers",
    metaDescription: "Halifax to Toronto movers with approximately 1,800 km of route planning, 5–12 day transit guidance, packing, storage, protection options, and written estimates.",
    intro: Object.freeze([
      "Moving from Halifax, Nova Scotia to Toronto, Ontario is an interprovincial long-distance move of approximately 1,800 km. A written estimate helps set expectations for inventory, access, packing, storage, timing, and protection choices before pickup.",
      "Halifax pickup planning may include downtown loading restrictions, apartment elevators, stairs, long carries, or limited curb space. Share the complete Nova Scotia origin details so labour and vehicle access can be planned accurately.",
      "The westbound corridor can be affected by Atlantic, Quebec, and Ontario weather and seasonal demand. Toronto condo and apartment deliveries may also require elevator reservations, loading-dock bookings, parking arrangements, and restricted move-in windows.",
    ]),
    unique: Object.freeze([
      Object.freeze(["Westbound Atlantic–Ontario corridor", "The approximately 1,800 km route requires a realistic delivery spread, weather planning, and coordination across several provinces."]),
      Object.freeze(["Halifax pickup access", "Confirm elevators, loading zones, parking, stairs, long carries, building rules, and any downtown access limits before pickup."]),
      Object.freeze(["Toronto delivery access", "Toronto condos and apartments may require elevator bookings, loading-dock reservations, parking permits, certificates, or restricted move-in hours."]),
      Object.freeze(["Weather and seasonal planning", "Atlantic storms, winter road conditions, summer demand, and holiday schedules can affect routing and delivery timing."]),
    ]),
    tips: Object.freeze([
      Object.freeze(["Reserve Toronto elevator time", "Ask the building manager about elevator reservations, loading-dock windows, deposits, and required moving documents."]),
      Object.freeze(["Confirm Toronto parking", "Review curb access, truck restrictions, loading permits, stairs, long carries, and whether a shuttle may be needed."]),
      Object.freeze(["Keep corridor essentials with you", "Carry medication, identification, chargers, weather-ready clothing, and first-night essentials during the delivery window."]),
      Object.freeze(["Plan Ontario updates", "After establishing residence, review Ontario driver-licence, vehicle-registration, health-card, utility, and address-change requirements."]),
    ]),
    faqs: Object.freeze([
      Object.freeze(["How long does it take to move from Halifax to Toronto?", "Typical transit is 5–12 days. The confirmed delivery spread depends on shipment size, route scheduling, consolidation, weather, and access at pickup and delivery."]),
      Object.freeze(["How much does it cost to move from Halifax to Toronto?", "Planning estimates range from $2,200+ for a studio to $7,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, timing, protection choices, and confirmed services."]),
      Object.freeze(["Do you move from Toronto to Halifax as well?", "Yes. Purely Canadian Movers coordinates this interprovincial long-distance corridor in both directions, with planning based on the actual pickup and delivery addresses."]),
      Object.freeze(["Do you provide packing services for a Halifax–Toronto move?", "Yes. Full or partial packing, specialty packing, and unpacking can be included for a Halifax to Toronto move and documented in the written estimate."]),
      ...sharedFaq,
    ]),
  }),
  Object.freeze({
    slug: "toronto-to-halifax-movers", from: "Toronto", fromProvince: "ON", to: "Halifax", toProvince: "NS",
    title: "Toronto to Halifax Movers | Purely Canadian Movers",
    metaDescription: "Toronto to Halifax movers with approximately 1,800 km of route planning, 5–12 day transit guidance, packing, storage, protection options, and written estimates.",
    intro: Object.freeze([
      "Moving from Toronto, Ontario to Halifax, Nova Scotia is an interprovincial long-distance move of approximately 1,800 km. A written estimate helps set expectations for inventory, GTA pickup access, packing, storage, timing, and protection choices before moving day.",
      "Toronto pickup planning may include condo elevator bookings, loading docks, parking restrictions, stairs, long carries, or narrow service windows. Share the complete Ontario origin details so labour and vehicle access can be planned accurately.",
      "The eastbound corridor can be affected by Ontario, Quebec, and Atlantic weather and seasonal demand. Halifax apartment and downtown deliveries may also require elevator reservations, loading access, parking arrangements, and restricted move-in windows.",
    ]),
    unique: Object.freeze([
      Object.freeze(["Eastbound Ontario–Atlantic corridor", "The approximately 1,800 km route requires a realistic delivery spread, weather planning, and coordination across several provinces."]),
      Object.freeze(["Toronto and GTA pickup access", "Confirm elevators, loading docks, parking, stairs, long carries, building rules, and municipal access limits before pickup."]),
      Object.freeze(["Halifax delivery access", "Halifax apartments and downtown properties may require elevator bookings, loading-zone planning, parking arrangements, or restricted move-in hours."]),
      Object.freeze(["Seasonal Atlantic planning", "Atlantic storms, winter road conditions, summer demand, and holiday schedules can affect routing and delivery timing."]),
    ]),
    tips: Object.freeze([
      Object.freeze(["Confirm Halifax building access", "Ask about elevator reservations, loading areas, move-in hours, parking rules, stairs, and long carries at the destination."]),
      Object.freeze(["Plan downtown loading", "Review curb space, loading-zone restrictions, truck access, and whether a smaller vehicle or shuttle may be needed."]),
      Object.freeze(["Prepare for changing weather", "Conditions can differ across Ontario, Quebec, New Brunswick, and Nova Scotia, so keep weather-ready essentials accessible."]),
      Object.freeze(["Plan Nova Scotia updates", "After establishing residence, review Nova Scotia driver-licence, vehicle-registration, health-card, utility, and address-change requirements."]),
    ]),
    faqs: Object.freeze([
      Object.freeze(["How long does it take to move from Toronto to Halifax?", "Typical transit is 5–12 days. The confirmed delivery spread depends on shipment size, route scheduling, consolidation, weather, and access at pickup and delivery."]),
      Object.freeze(["How much does it cost to move from Toronto to Halifax?", "Planning estimates range from $2,200+ for a studio to $7,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, timing, protection choices, and confirmed services."]),
      Object.freeze(["Do you move from Halifax to Toronto as well?", "Yes. Purely Canadian Movers coordinates this interprovincial long-distance corridor in both directions, with planning based on the actual pickup and delivery addresses."]),
      Object.freeze(["Do you provide packing services for a Toronto–Halifax move?", "Yes. Full or partial packing, specialty packing, and unpacking can be included for a Toronto to Halifax move and documented in the written estimate."]),
      ...sharedFaq,
    ]),
  }),
]);

export function assertHalifaxTorontoRouteData(route) {
  for (const field of ["slug", "from", "fromProvince", "to", "toProvince", "title", "metaDescription"]) {
    if (typeof route?.[field] !== "string" || !route[field].trim()) throw new Error(`${route?.slug || "Halifax–Toronto route"}: missing required ${field}`);
  }
  for (const field of ["intro", "unique", "tips", "faqs"]) if (!Array.isArray(route[field]) || !route[field].length) throw new Error(`${route.slug}: incomplete ${field}`);
  if (route.faqs.length !== 9) throw new Error(`${route.slug}: expected exactly nine FAQs`);
  if (HALIFAX_TORONTO_FACTS.pricing.length !== 5) throw new Error(`${route.slug}: expected exactly five authoritative pricing rows`);
}
