export const edmontonOttawaFacts = Object.freeze({
  distance: "approximately 3,500 km",
  distanceShort: "~3,500 km",
  transit: "7–18 days",
  overallRange: "$2,500–$15,000+",
  rows: Object.freeze([
    Object.freeze(["Studio", "$2,500+", "Best for limited furniture or a partial shipment"]),
    Object.freeze(["1-bedroom", "$4,700+", "Depends on inventory weight or volume, access, and packing"]),
    Object.freeze(["2-bedroom", "$6,300+", "Common planning range for apartment or condo moves"]),
    Object.freeze(["3-bedroom", "$10,000+", "Larger household shipment with more labour and space"]),
    Object.freeze(["4+ bedroom", "$15,000+", "Final quote depends heavily on inventory and services"]),
  ]),
});

const sharedFaqTail = Object.freeze([
  ["Are you a direct carrier or do you use subcontractors?", "Purely Canadian Movers coordinates the move through the Great Canadian Van Lines agent network rather than operating as a broker that hands the shipment to unknown movers. The written estimate identifies the planned services and responsibilities."],
  ["What protection options are available?", "Ask the moving consultant about basic carrier liability and available Declared Value Protection options. Review the selected protection, inventory, access, and services in the written estimate before booking."],
  ["What should I do before the movers arrive?", "Defrost the refrigerator, disconnect appliances, label boxes by room, and keep medications, chargers, and documents with you. Reserve elevators and loading areas where required."],
  ["What makes Purely Canadian Movers different from other long-distance movers?", "Purely Canadian Movers is family-owned, has operated since 1991, is BBB Accredited, and coordinates interprovincial moves through the Great Canadian Van Lines agent network with clear written estimates."],
]);

function commonFaq(origin, destination) {
  const article = /^[AEIOU]/i.test(origin) ? "an" : "a";
  return [
    [`How long does it take to move from ${origin} to ${destination}?`, `${article[0].toUpperCase()}${article.slice(1)} ${origin} to ${destination} move typically takes 7–18 days. The delivery window depends on shipment size, scheduling, consolidation, weather, and access at pickup and delivery.`],
    [`How much does it cost to move from ${origin} to ${destination}?`, `Planning estimates are Studio $2,500+, 1-bedroom $4,700+, 2-bedroom $6,300+, 3-bedroom $10,000+, and 4+ bedroom $15,000+. Final pricing depends on weight or volume, access, packing, storage, season, and services.`],
    [`Do you move from ${destination} to ${origin} as well?`, `Yes. Purely Canadian Movers coordinates this interprovincial long-distance route in both directions.`],
    [`Do you provide packing services for ${article} ${origin}-${destination} move?`, "Yes. Full or partial packing, specialty packing, unpacking, and packing-material removal can be included in a written estimate."],
    [`What is the best time of year to move from ${origin} to ${destination}?`, `Late spring and early fall often provide milder conditions, but the route operates year-round. Winter moves require realistic weather allowances and protection for temperature-sensitive items.`],
    [`Can I get a written estimate for my ${origin} to ${destination} move?`, "Yes. A written estimate is prepared from the shipment inventory, route, access conditions, packing or storage needs, timing, and selected services."],
    [`Do you offer storage if my ${destination} home is not ready?`, `Yes. Short- and long-term storage can be coordinated when delivery timing and possession dates do not align.`],
  ];
}

export const edmontonOttawaRoutes = Object.freeze({
  "/edmonton-to-ottawa-movers/": Object.freeze({
    origin: "Edmonton", originValue: "Edmonton, AB", destination: "Ottawa", destinationValue: "Ottawa, ON",
    title: "Edmonton to Ottawa Movers | Long-Distance Moving | Purely Canadian Movers",
    description: "Plan your Edmonton to Ottawa move with long-distance pricing guidance, transit timing, packing, storage, and written estimate support from Purely Canadian Movers.",
    faq: Object.freeze([
      ...commonFaq("Edmonton", "Ottawa"),
      ["How do I update provincial health coverage after moving to Ontario?", "Notify Alberta Health and apply for Ontario health coverage through ServiceOntario after establishing residency. Check current eligibility and documentation requirements directly with the provincial programs."],
      ...sharedFaqTail,
    ]),
  }),
  "/ottawa-to-edmonton-movers/": Object.freeze({
    origin: "Ottawa", originValue: "Ottawa, ON", destination: "Edmonton", destinationValue: "Edmonton, AB",
    title: "Ottawa to Edmonton Movers | Purely Canadian Movers",
    description: "Ottawa to Edmonton movers. Professional interprovincial moving, route-specific pricing, 7–18 day transit guidance, packing, storage, and written estimates.",
    faq: Object.freeze([
      ...commonFaq("Ottawa", "Edmonton"),
      ["How do I update provincial health coverage after moving to Alberta?", "Notify Ontario health coverage and apply for the Alberta Health Care Insurance Plan after establishing residency. Check current eligibility and documentation requirements directly with the provincial programs."],
      ...sharedFaqTail,
    ]),
  }),
});
