export const torontoVancouverRoutes = Object.freeze({
  "/toronto-to-vancouver-movers/": Object.freeze({
    origin: "Toronto",
    originValue: "Toronto, ON",
    destination: "Vancouver",
    destinationValue: "Vancouver, BC",
    routeLabel: "Toronto to Vancouver",
    pairLabel: "Toronto–Vancouver",
    description: "Plan a Toronto to Vancouver move with a family-owned Canadian mover. Review typical 9–22 day transit, route pricing, packing, and delivery considerations.",
    pickupCopy: "Toronto pickups require careful building-access planning, especially for downtown condos, elevator reservations, loading docks, and restricted curb space. Ontario origin details are confirmed before moving day.",
    corridorCopy: "Westbound service crosses several provinces and weather systems. Shipment scheduling, inventory accuracy, seasonal conditions, and the Great Canadian Van Lines agent network all shape the delivery window.",
    deliveryCopy: "Vancouver deliveries often involve strata rules, elevator bookings, loading-zone limits, and wet-weather protection. We coordinate access details before the shipment reaches the Lower Mainland.",
    reverseRoute: "/vancouver-to-toronto-movers/",
    reverseLabel: "Vancouver to Toronto moves",
  }),
  "/vancouver-to-toronto-movers/": Object.freeze({
    origin: "Vancouver",
    originValue: "Vancouver, BC",
    destination: "Toronto",
    destinationValue: "Toronto, ON",
    routeLabel: "Vancouver to Toronto",
    pairLabel: "Vancouver–Toronto",
    description: "Plan a Vancouver to Toronto move with a family-owned Canadian mover. Review typical 9–22 day transit, route pricing, packing, and delivery considerations.",
    pickupCopy: "Vancouver pickups often require strata approval, elevator reservations, loading-zone planning, and protection from wet weather. BC origin access details are confirmed before moving day.",
    corridorCopy: "Eastbound service crosses several provinces and weather systems. Shipment scheduling, inventory accuracy, seasonal conditions, and the Great Canadian Van Lines agent network all shape the delivery window.",
    deliveryCopy: "Toronto deliveries can involve condo elevator bookings, loading docks, tight urban access, and winter restrictions. We coordinate destination access before the shipment reaches the GTA.",
    reverseRoute: "/toronto-to-vancouver-movers/",
    reverseLabel: "Toronto to Vancouver moves",
  }),
});

export const torontoVancouverFacts = Object.freeze({
  distance: "~4,400 km",
  transit: "9–22 days",
  range: "$2,500–$15,000+",
  rows: Object.freeze([
    Object.freeze(["Studio", "$2,500+", "Typical smaller shipment", "9–22 days"]),
    Object.freeze(["1-bedroom", "$4,700+", "Typical apartment shipment", "9–22 days"]),
    Object.freeze(["2-bedroom", "$6,500+", "Typical mid-size household", "9–22 days"]),
    Object.freeze(["3-bedroom", "$10,000+", "Typical larger household", "9–22 days"]),
    Object.freeze(["4+ bedroom", "$15,000+", "Large household; estimate required", "9–22 days"]),
  ]),
});

function directionalFaq(config) {
  return Object.freeze([
    Object.freeze({ question: `How long does it take to move from ${config.origin} to ${config.destination}?`, answer: `A ${config.routeLabel} move typically takes 9–22 days for delivery, depending on shipment size, scheduling, seasonal conditions, and route logistics. Your written estimate will include a realistic delivery window.` }),
    Object.freeze({ question: `How much does it cost to move from ${config.origin} to ${config.destination}?`, answer: `Published planning rows for a ${config.routeLabel} move run from $2,500+ for a studio to $15,000+ for a 4+ bedroom home. Actual weight or volume, access, packing, storage, season, and protection choices determine the written estimate.` }),
    Object.freeze({ question: `Do you move from ${config.destination} to ${config.origin} as well?`, answer: `Yes. We handle this corridor in both directions. Whether you are moving from ${config.origin} to ${config.destination} or ${config.destination} to ${config.origin}, the move is planned with the same documented interprovincial process.` }),
    Object.freeze({ question: "Are you a direct carrier or do you use subcontractors?", answer: "Purely Canadian Movers is a direct mover and an authorized Great Canadian Van Lines agent. Your move is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network, without broker-style handoffs to unknown movers." }),
    Object.freeze({ question: `Do you provide packing services for a ${config.pairLabel} move?`, answer: "Yes. Full and partial packing and unpacking are available, including specialty packing for fragile items, artwork, and electronics. Packing can be included in the written estimate." }),
    Object.freeze({ question: `Is my shipment protected during a ${config.routeLabel} move?`, answer: "Carrier liability and available Declared Value Protection options are explained before booking. Ask the team to document the selected protection option in your written estimate." }),
    Object.freeze({ question: "Do you offer packing and unpacking services?", answer: "Yes. Full and partial packing and unpacking services are available for long-distance moves, including careful preparation of fragile items, artwork, and electronics." }),
    Object.freeze({ question: "What makes Purely Canadian Movers different?", answer: "Purely Canadian Movers is family-owned, has operated since 1991, is BBB Accredited, and coordinates interprovincial moves through its authorized Great Canadian Van Lines relationship without broker-style handoffs." }),
    Object.freeze({ question: "Do you offer storage solutions?", answer: "Yes. Flexible short-term and long-term storage can be coordinated when possession dates or delivery timing do not align." }),
  ]);
}

export const torontoVancouverFaqs = Object.freeze(Object.fromEntries(
  Object.entries(torontoVancouverRoutes).map(([route, config]) => [route, directionalFaq(config)]),
));
