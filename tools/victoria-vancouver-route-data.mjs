export const VICTORIA_VANCOUVER_FACTS = Object.freeze({
  distance: "approximately 110 km",
  distanceDisplay: "~110 km",
  transit: "1–3 days",
  range: "$1,200–$4,200+",
  currency: "CAD",
  pricing: Object.freeze([
    Object.freeze(["Studio / bachelor", "$1,200+", "Small apartment or limited household shipment"]),
    Object.freeze(["1-bedroom", "$1,600+", "Inventory, access, and requested services affect the estimate"]),
    Object.freeze(["2-bedroom", "$2,200+", "Typical apartment or condo planning estimate"]),
    Object.freeze(["3-bedroom", "$3,000+", "Larger household shipment with more labour and space"]),
    Object.freeze(["4+ bedroom", "$4,200+", "Final estimate depends on inventory, access, and services"]),
  ]),
});

export const VICTORIA_VANCOUVER_ROUTE = Object.freeze({
  slug: "victoria-to-vancouver-movers",
  from: "Victoria",
  fromRegion: "BC",
  to: "Vancouver",
  toRegion: "BC",
  title: "Victoria to Vancouver Movers | Purely Canadian Movers",
  metaDescription: "Victoria to Vancouver movers for an intra-BC move from Vancouver Island to the Lower Mainland, with ferry planning, five CAD estimates, packing, storage, and written quotes.",
  intro: Object.freeze([
    "Moving from Victoria on Vancouver Island to Vancouver in the Lower Mainland is an intra-BC intercity move that depends on coordinated pickup, ferry transportation, and destination access. A written estimate aligns the shipment, services, access details, and timing before moving day.",
    "Victoria pickup planning may include apartment or condo elevators, strata move windows, loading areas, parking, stairs, long carries, and the time needed to reach the ferry terminal. Share the complete origin details when requesting an estimate.",
    "Vancouver delivery planning may include elevator reservations, loading-zone restrictions, parking, building move hours, and strata requirements. Ferry availability, shipment size, weather, and access can affect the confirmed schedule, so the 1–3 day range is planning guidance rather than a guarantee.",
  ]),
  unique: Object.freeze([
    Object.freeze(["Vancouver Island departure", "Pickup and mainland transport must be coordinated with ferry availability and terminal timing without assuming a guaranteed sailing or crossing time."]),
    Object.freeze(["Victoria pickup access", "Confirm building rules, elevator bookings, loading areas, parking, stairs, long carries, and origin move windows before pickup."]),
    Object.freeze(["Vancouver delivery access", "Confirm strata or building requirements, elevator times, loading zones, parking, and destination move hours before delivery."]),
    Object.freeze(["One intra-BC move plan", "Inventory, access, ferry logistics, packing, storage, timing, and protection choices are reviewed together in the written estimate."]),
  ]),
  tips: Object.freeze([
    Object.freeze(["Reserve building access", "Book Victoria pickup and Vancouver delivery elevators or loading windows before the confirmed service date."]),
    Object.freeze(["Share a complete inventory", "Identify furniture, boxes, specialty items, stairs, long carries, packing, and storage needs for the written estimate."]),
    Object.freeze(["Keep essentials with you", "Carry identification, medication, chargers, and first-night essentials rather than placing them in the household shipment."]),
    Object.freeze(["Keep timing flexible", "Ferry capacity, terminal conditions, weather, access, and shipment requirements can affect the final pickup and delivery plan."]),
  ]),
  faqs: Object.freeze([
    Object.freeze(["How long does a Victoria to Vancouver move take?", "Typical transit planning is 1–3 days. Ferry availability, terminal conditions, shipment size, pickup and delivery access, weather, and requested services can affect the confirmed schedule."]),
    Object.freeze(["How much does it cost to move from Victoria to Vancouver?", "Current planning estimates are $1,200+ for a studio, $1,600+ for a 1-bedroom, $2,200+ for a 2-bedroom, $3,000+ for a 3-bedroom, and $4,200+ for a 4+ bedroom home. These are CAD planning estimates, not guaranteed prices."]),
    Object.freeze(["How are ferry logistics handled?", "The moving plan accounts for Vancouver Island departure, ferry transportation, and Lower Mainland arrival. Sailing availability and terminal conditions vary, so exact ferry or delivery timing is confirmed for the move rather than guaranteed on this page."]),
    Object.freeze(["What access details should I provide?", "Provide Victoria pickup and Vancouver delivery addresses, strata or building rules, elevator reservations, loading and parking restrictions, stairs, long carries, and any required move windows."]),
    Object.freeze(["Do you provide packing and unpacking services?", "Yes. Full or partial packing and unpacking can be included in the written estimate, including appropriate planning for fragile items, artwork, and electronics."]),
    Object.freeze(["Can storage be included?", "Yes. Short-term or longer-term storage can be planned when the origin and destination dates do not align. Requested storage is identified in the written estimate."]),
    Object.freeze(["What protection applies to the shipment?", "Basic carrier liability applies. Available Declared Value Protection options can be reviewed and documented with the written estimate before moving day."]),
    Object.freeze(["Who coordinates the move?", "Purely Canadian Movers coordinates the move with Great Canadian Van Lines agent-network support where applicable. Responsibilities, services, and estimate details are documented in writing rather than assigned through an unknown moving broker."]),
  ]),
});

export function assertVictoriaVancouverRouteData(route = VICTORIA_VANCOUVER_ROUTE) {
  for (const field of ["slug", "from", "fromRegion", "to", "toRegion", "title", "metaDescription"]) {
    if (typeof route[field] !== "string" || !route[field].trim()) throw new Error(`Victoria–Vancouver route: missing ${field}`);
  }
  if (VICTORIA_VANCOUVER_FACTS.pricing.length !== 5) throw new Error("Victoria–Vancouver route: expected five pricing rows");
  if (route.faqs.length !== 8) throw new Error("Victoria–Vancouver route: expected eight FAQs");
}
