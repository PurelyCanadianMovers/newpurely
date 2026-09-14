export const SEATTLE_VANCOUVER_FACTS = Object.freeze({
  distance: null,
  transit: "Overnight service may be planned when scheduling and border documentation are ready",
  range: "US$2,150–US$4,500",
  currency: "USD",
  pricing: Object.freeze([
    Object.freeze(["Studio", "US$2,150", "Small apartment or limited household shipment"]),
    Object.freeze(["1-bedroom", "US$2,700", "Inventory, access, and requested services affect the estimate"]),
    Object.freeze(["2-bedroom", "US$3,100", "Typical apartment or condo planning estimate"]),
    Object.freeze(["3-bedroom", "US$3,700", "Larger household shipment with more labour and space"]),
    Object.freeze(["4+ bedroom", "US$4,500", "Final estimate depends on inventory, access, and services"]),
  ]),
});

const sharedFaqs = Object.freeze([
  Object.freeze(["Are the prices shown in Canadian or U.S. dollars?", "All prices shown on this page are planning estimates in U.S. dollars (USD), not guaranteed prices."]),
  Object.freeze(["How is the final moving price calculated?", "Final pricing depends on shipment size or weight, pickup and delivery access, packing requirements, timing, storage, and any additional services selected for the move."]),
  Object.freeze(["What paperwork should I plan for?", "A Canada–U.S. household move involves shipment and border documentation. Requirements depend on the move and the items being transported, so confirm the current paperwork for your shipment with the moving team before packing."]),
  Object.freeze(["Do you provide packing or storage?", "Yes. Packing and storage can be included when requested and will be identified in the written moving estimate."]),
  Object.freeze(["What protection applies to my shipment?", "Basic carrier liability applies. Available Declared Value Protection options can be reviewed and documented with the written estimate before moving day."]),
  Object.freeze(["Do you use moving brokers?", "Purely Canadian Movers coordinates the move directly and through the Great Canadian Van Lines agent network rather than handing it to an unknown broker-selected mover. Responsibilities and planned services are documented in writing."]),
]);

export const SEATTLE_VANCOUVER_ROUTES = Object.freeze([
  Object.freeze({
    slug: "vancouver-to-seattle-movers", from: "Vancouver", fromRegion: "BC", to: "Seattle", toRegion: "WA",
    title: "Vancouver to Seattle Movers | Cross-Border Estimates | Purely Canadian Movers",
    metaDescription: "Vancouver to Seattle movers for Canada–U.S. household moves with five USD planning estimates, written scheduling, packing, storage, and protection options.",
    corridor: "BC–Washington",
    intro: Object.freeze([
      "Moving from Vancouver, British Columbia to Seattle, Washington is a southbound Canada–U.S. household move. A written estimate helps align inventory, access, packing, storage, timing, and protection choices before pickup.",
      "Vancouver and Lower Mainland pickup planning may include condo or strata move windows, elevator reservations, loading access, parking, stairs, or long carries. Share the complete British Columbia origin details for the estimate.",
      "Seattle delivery planning may include apartment or condo elevators, loading zones, parking restrictions, and scheduled move-in windows. Border conditions and shipment documentation can affect the confirmed schedule.",
    ]),
    unique: Object.freeze([
      Object.freeze(["Southbound cross-border planning", "The route crosses from British Columbia into Washington, so shipment details, scheduling, and the applicable border paperwork are reviewed before moving day."]),
      Object.freeze(["Vancouver pickup access", "Confirm strata or building rules, elevator times, loading areas, parking, stairs, long carries, and origin access before pickup."]),
      Object.freeze(["Seattle delivery access", "Confirm apartment or condo rules, elevator bookings, loading zones, parking restrictions, and delivery windows at the destination."]),
      Object.freeze(["Puget Sound coverage", "Seattle is the canonical destination page; Bellevue, Redmond, Kirkland, Everett, Tacoma, and nearby communities are handled as service-area locations, not duplicate route pages."]),
    ]),
    tips: Object.freeze([
      Object.freeze(["Confirm building reservations", "Book Vancouver pickup and Seattle delivery elevators or loading windows before the confirmed service date."]),
      Object.freeze(["Review shipment details early", "Provide an accurate inventory and identify packing, storage, access, or specialty-item needs for the written estimate."]),
      Object.freeze(["Keep essentials with you", "Carry identification, medication, chargers, and first-night essentials rather than placing them in the household shipment."]),
      Object.freeze(["Confirm current paperwork", "Review the shipment-specific border paperwork with the moving team before packing; requirements depend on the move and its contents."]),
    ]),
    faqs: Object.freeze([
      Object.freeze(["How much does it cost to move from Vancouver to Seattle?", "Planning estimates are US$2,150 for a studio, US$2,700 for a 1-bedroom, US$3,100 for a 2-bedroom, US$3,700 for a 3-bedroom, and US$4,500 for a 4+ bedroom home. Final pricing depends on shipment size or weight, access, packing, timing, storage, and selected services."]),
      Object.freeze(["How is Vancouver to Seattle transit planned?", "Overnight service may be planned when scheduling and border documentation are ready. Border conditions, shipment size, access, and paperwork can affect the actual schedule, which is confirmed for the move."]),
      ...sharedFaqs,
    ]),
  }),
  Object.freeze({
    slug: "seattle-to-vancouver-movers", from: "Seattle", fromRegion: "WA", to: "Vancouver", toRegion: "BC",
    title: "Seattle to Vancouver Movers | Cross-Border Estimates | Purely Canadian Movers",
    metaDescription: "Seattle to Vancouver movers for U.S.–Canada household moves with five USD planning estimates, written scheduling, packing, storage, and protection options.",
    corridor: "Washington–BC",
    intro: Object.freeze([
      "Moving from Seattle, Washington to Vancouver, British Columbia is a northbound U.S.–Canada household move. A written estimate helps align inventory, access, packing, storage, timing, and protection choices before pickup.",
      "Seattle and Puget Sound pickup planning may include apartment or condo elevators, loading zones, parking restrictions, stairs, long carries, or scheduled move windows. Share the complete Washington origin details for the estimate.",
      "Vancouver delivery planning may include condo or strata move windows, elevator reservations, loading access, parking, and local building rules. Border conditions and shipment documentation can affect the confirmed schedule.",
    ]),
    unique: Object.freeze([
      Object.freeze(["Northbound cross-border planning", "The route crosses from Washington into British Columbia, so shipment details, scheduling, and the applicable border paperwork are reviewed before moving day."]),
      Object.freeze(["Seattle pickup access", "Confirm apartment or condo rules, elevator bookings, loading zones, parking restrictions, stairs, long carries, and pickup windows."]),
      Object.freeze(["Vancouver delivery access", "Confirm strata or building rules, elevator times, loading areas, parking, and destination access before delivery."]),
      Object.freeze(["Puget Sound origin coverage", "Seattle is the canonical origin page; Bellevue, Redmond, Kirkland, Everett, Tacoma, and nearby communities are service-area locations rather than duplicate route pages."]),
    ]),
    tips: Object.freeze([
      Object.freeze(["Confirm building reservations", "Book Seattle pickup and Vancouver delivery elevators or loading windows before the confirmed service date."]),
      Object.freeze(["Review shipment details early", "Provide an accurate inventory and identify packing, storage, access, or specialty-item needs for the written estimate."]),
      Object.freeze(["Keep essentials with you", "Carry identification, medication, chargers, and first-night essentials rather than placing them in the household shipment."]),
      Object.freeze(["Confirm current paperwork", "Review the shipment-specific border paperwork with the moving team before packing; requirements depend on the move and its contents."]),
    ]),
    faqs: Object.freeze([
      Object.freeze(["How much does it cost to move from Seattle to Vancouver?", "Planning estimates are US$2,150 for a studio, US$2,700 for a 1-bedroom, US$3,100 for a 2-bedroom, US$3,700 for a 3-bedroom, and US$4,500 for a 4+ bedroom home. Final pricing depends on shipment size or weight, access, packing, timing, storage, and selected services."]),
      Object.freeze(["How is Seattle to Vancouver transit planned?", "Overnight service may be planned when scheduling and border documentation are ready. Border conditions, shipment size, access, and paperwork can affect the actual schedule, which is confirmed for the move."]),
      ...sharedFaqs,
    ]),
  }),
]);

export function assertSeattleVancouverRouteData(route) {
  for (const field of ["slug", "from", "fromRegion", "to", "toRegion", "title", "metaDescription", "corridor"]) {
    if (typeof route?.[field] !== "string" || !route[field].trim()) throw new Error(`${route?.slug || "Seattle–Vancouver route"}: missing ${field}`);
  }
  for (const field of ["intro", "unique", "tips", "faqs"]) if (!Array.isArray(route[field]) || !route[field].length) throw new Error(`${route.slug}: incomplete ${field}`);
  if (route.faqs.length !== 8) throw new Error(`${route.slug}: expected exactly eight FAQs`);
  if (SEATTLE_VANCOUVER_FACTS.pricing.length !== 5) throw new Error(`${route.slug}: expected exactly five authoritative pricing rows`);
}
