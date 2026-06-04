(function () {
  var PHONE_DISPLAY = "1-877-485-6683";
  var PHONE_LINK = "tel:18774856683";
  var CONTACT_URL = "/contact/";
  var GOOGLE_MAPS_ADDRESS_URL =
    "https://www.google.com/maps/search/?api=1&query=Unit%2016%2091%20Golden%20Dr%20Coquitlam%20BC%20V3K%206R2";
  var TARGETS = {
    "/": {
      eyebrow: "Free moving estimate",
      title: "Start your move with a fast, no-obligation estimate.",
      body: "Tell us the basics and we will help price the right crew, truck, and plan for your local or long-distance move.",
    },
    "/long-distance/": {
      eyebrow: "Long-distance moving estimate",
      title: "Planning a move across Canada? Start your estimate here.",
      body: "Get help with route timing, shipment size, packing, valuation coverage, and realistic long-distance pricing.",
    },
    "/long-distance-moving-cost-canada/": {
      eyebrow: "Cost guide to quote",
      title: "Use the cost guide, then request a route-specific quote.",
      body: "Long-distance pricing depends on route, weight, access, season, packing, and storage. Send us your move details for a clearer range.",
    },
    "/local/": {
      eyebrow: "Metro Vancouver local move",
      title: "Get a local moving estimate for Metro Vancouver.",
      body: "Book a direct mover with no subcontractors for apartments, condos, houses, offices, and furniture moves.",
    },
    "/maple-ridge/": {
      eyebrow: "Maple Ridge movers",
      title: "Get a Maple Ridge moving estimate from a direct local mover.",
      body: "Plan a house, condo, apartment, or long-distance move in Maple Ridge with a family-owned mover serving the Lower Mainland since 1991.",
    },
    "/local-movers-in-coquitlam-bc/": {
      eyebrow: "Coquitlam local movers",
      title: "Get a local moving estimate in Coquitlam.",
      body: "Move within Coquitlam, Port Coquitlam, Port Moody, Burnaby, New Westminster, or the Tri-Cities with no subcontractors and direct accountability.",
    },
    "/coquitlam-bc/": {
      eyebrow: "Coquitlam movers",
      title: "Get a Coquitlam moving estimate from a local team.",
      body: "Purely Canadian Movers is based in Coquitlam and helps with local, packing, office, storage, and long-distance moves.",
    },
    "/coquitlam/": {
      eyebrow: "Coquitlam movers",
      title: "Plan your Coquitlam move with a local moving company.",
      body: "Get help with Coquitlam apartments, condos, houses, office moves, packing, storage, and long-distance relocation.",
    },
    "/packing-service-in-coquitlam-bc/": {
      eyebrow: "Coquitlam packing services",
      title: "Get packing help for a Coquitlam move.",
      body: "Plan full packing, partial packing, fragile-only packing, unpacking, supplies, storage timing, and moving day access with a direct Coquitlam mover.",
    },
    "/testimonials/": {
      eyebrow: "Customer trust",
      title: "Compare our moving company before you request an estimate.",
      body: "Review the proof behind Purely Canadian Movers: family-owned since 1991, BBB Accredited, no subcontractors, and local service from Coquitlam across Metro Vancouver.",
    },
    "/local-movers-in-vancouver-bc/": {
      eyebrow: "Vancouver local movers",
      title: "Get a Vancouver local moving estimate from a direct mover.",
      body: "Plan a condo, apartment, house, office, packing, or storage-supported move in Vancouver with no subcontractors and clear valuation options.",
    },
    "/port-coquitlam/": {
      eyebrow: "Port Coquitlam movers",
      title: "Plan a Port Coquitlam move with a Tri-Cities moving team.",
      body: "Get help with Port Coquitlam homes, condos, townhomes, packing, storage, and long-distance moves from a Coquitlam-based mover.",
    },
    "/storage/": {
      eyebrow: "Moving and storage",
      title: "Add storage to your local or long-distance move.",
      body: "Coordinate packing, pickup, storage timing, delivery, valuation coverage, and moving logistics with one accountable team.",
    },
    "/packing/": {
      eyebrow: "Packing services",
      title: "Get packing help for a local or long-distance move.",
      body: "Plan full packing, partial packing, fragile-only packing, supplies, unpacking, storage timing, and moving day access.",
    },
    "/canada-usa/": {
      eyebrow: "Canada-USA movers",
      title: "Plan a cross-border move with direct moving accountability.",
      body: "Get help with Canada-USA moving logistics, packing, valuation coverage, route timing, and customs-aware planning.",
    },
    "/cross-country-movers/": {
      eyebrow: "Cross-country movers",
      title: "Plan a coast-to-coast move with a trusted Canadian mover.",
      body: "Compare route timing, shipment size, valuation coverage, packing, storage, and written estimate details before booking.",
    },
    "/long-distance/": {
      eyebrow: "Long-distance moving estimate",
      title: "Planning a move across Canada? Start your estimate here.",
      body: "Get help with route timing, shipment size, packing, valuation coverage, and realistic long-distance pricing.",
    },
    "/overseas/": {
      eyebrow: "Overseas moving",
      title: "Plan an international move with careful packing and coordination.",
      body: "Get help with overseas moving preparation, packing, documentation planning, valuation options, and destination coordination.",
    },
    "/x-country/": {
      eyebrow: "Cross-country moving cost",
      title: "Use the cost guide, then request a cross-country estimate.",
      body: "Plan long-distance moving costs with better detail on route timing, shipment size, packing, storage, and valuation coverage.",
    },
    "/office/": {
      eyebrow: "Office movers",
      title: "Plan an office move with a direct Metro Vancouver mover.",
      body: "Coordinate desks, equipment, files, elevators, building access, after-hours timing, storage, and valuation coverage.",
    },
    "/office-movers-in-vancouver-bc/": {
      eyebrow: "Vancouver office movers",
      title: "Plan a Vancouver office move with direct accountability.",
      body: "Coordinate commercial moving, elevators, loading access, phased timing, furniture, equipment, storage, and valuation coverage.",
    },
    "/corporate-moves-employee-relocation-in-coquitlam-bc/": {
      eyebrow: "Corporate relocation",
      title: "Plan Coquitlam employee relocation with a direct moving company.",
      body: "Support employee moves, office relocation, packing, storage, long-distance coordination, and clear accountability from one team.",
    },
    "/local-movers-burnaby-bc/": {
      eyebrow: "Burnaby local movers",
      title: "Get a Burnaby moving estimate for condos, apartments, and houses.",
      body: "Plan a Burnaby move with a direct moving company experienced with elevator bookings, loading zones, strata rules, and Metro Vancouver building access.",
    },
    "/burnaby/": {
      eyebrow: "Burnaby movers",
      title: "Plan your Burnaby move with a Metro Vancouver moving team.",
      body: "Get help with Burnaby local moves, condo towers, apartment moves, packing, storage, office moving, and long-distance relocation.",
    },
    "/local-movers-north-vancouver-bc/": {
      eyebrow: "North Vancouver local movers",
      title: "Get a North Vancouver moving estimate for condos, apartments, and houses.",
      body: "Plan a North Shore move with a direct moving company experienced with elevator bookings, loading access, strata rules, and Metro Vancouver routes.",
    },
    "/local-movers-white-rock-bc/": {
      eyebrow: "White Rock local movers",
      title: "Get a White Rock moving estimate for condos, houses, and seniors moves.",
      body: "Plan a White Rock move with help for beach-area access, condo elevators, parking, packing, storage, and Lower Mainland routes.",
    },
    "/north-vancouver/": {
      eyebrow: "North Vancouver movers",
      title: "Plan your North Vancouver move with a Metro Vancouver moving team.",
      body: "Get help with North Vancouver local moves, condo towers, apartment moves, packing, storage, office moving, and long-distance relocation.",
    },
    "/white-rock/": {
      eyebrow: "White Rock movers",
      title: "Plan your White Rock move with a Lower Mainland moving team.",
      body: "Get help with White Rock local moves, condos, seniors moves, packing, storage, office moving, and long-distance relocation.",
    },
    "/port-moody/": {
      eyebrow: "Port Moody movers",
      title: "Plan your Port Moody move with a Tri-Cities moving team.",
      body: "Get help with Port Moody apartments, condos, townhomes, packing, storage, office moves, and long-distance relocation.",
    },
  };

  var TITLE_OVERRIDES = {
    "/": "Vancouver Movers | Local & Long-Distance Moving",
    "/about/": "About Purely Canadian Movers | Coquitlam Moving Company",
    "/admin/blog/": "Blog Admin | Purely Canadian Movers",
    "/admin/login/": "Admin Login | Purely Canadian Movers",
    "/bc-to-washington-movers/": "BC to Washington Movers | Cross-Border Moving",
    "/blog/": "Moving Tips Blog | Purely Canadian Movers",
    "/canada-usa/": "Canada-USA Movers | Cross-Border Moving Services",
    "/contact/": "Free Moving Estimate | Metro Vancouver Movers",
    "/corporate-moves-employee-relocation-in-coquitlam-bc/": "Corporate Movers Coquitlam BC | Employee Relocation",
    "/cross-country-movers/": "Cross-Country Movers Canada | Coast-to-Coast Moving",
    "/cross-country-moving-guide/": "Cross-Country Moving Guide | Canada Moving Tips",
    "/distance/": "Long-Distance Moving Services Canada | Free Estimates",
    "/great-canadian-vanlines-agent/": "Great Canadian Van Lines Agent | Coquitlam Movers",
    "/how-to-choose-a-mover/": "How to Choose a Mover in Canada | Moving Guide",
    "/local-movers-in-coquitlam-bc/": "Local Movers Coquitlam BC | Direct Moving Company",
    "/local-movers-in-vancouver-bc/": "Local Movers Vancouver BC | Homes, Condos & Apartments",
    "/long-distance-moving-cost-canada/": "Moving Cost Guide Canada",
    "/long-distance/": "Long-Distance Movers Canada | Cross-Country Moving",
    "/calgary-long-distance-movers/": "Calgary Long-Distance Movers",
    "/calgary-to-toronto-movers/": "Calgary to Toronto Movers | Cross-Canada Moving",
    "/calgary-to-vancouver-movers/": "Calgary to Vancouver Movers | Alberta to BC Moving",
    "/edmonton-long-distance-movers/": "Edmonton Long-Distance Movers | Cross-Canada Moving",
    "/edmonton-to-toronto-movers/": "Edmonton to Toronto Movers | Long-Distance Moving",
    "/edmonton-to-vancouver-movers/": "Edmonton to Vancouver Movers | Alberta to BC Moving",
    "/halifax-long-distance-movers/": "Halifax Long-Distance Movers | Cross-Canada Moving",
    "/halifax-to-toronto-movers/": "Halifax to Toronto Movers | Long-Distance Moving",
    "/long-distance-movers-montreal/": "Montreal Long-Distance Movers | Cross-Canada Moving",
    "/montreal-to-calgary-movers/": "Montreal to Calgary Movers | Cross-Canada Moving",
    "/montreal-to-edmonton-movers/": "Montreal to Edmonton Movers | Long-Distance Moving",
    "/montreal-to-toronto-movers/": "Montreal to Toronto Movers | Long-Distance Moving",
    "/montreal-to-vancouver-movers/": "Montreal to Vancouver Movers | Cross-Canada Moving",
    "/montreal-to-victoria-movers/": "Montreal to Victoria Movers | Long-Distance Moving",
    "/movers-calgary-to-edmonton/": "Calgary to Edmonton Movers | Alberta Moving Route",
    "/movers-edmonton-to-calgary/": "Edmonton to Calgary Movers | Alberta Moving Route",
    "/movers-vancouver-to-halifax/": "Vancouver to Halifax Movers | Coast-to-Coast Moving",
    "/office-movers-in-vancouver-bc/": "Office Movers Vancouver BC | Corporate Moving",
    "/office/": "Office Movers Metro Vancouver | Corporate Moving",
    "/ottawa-long-distance-movers/": "Ottawa Long-Distance Movers | Cross-Canada Moving",
    "/ottawa-to-calgary-movers/": "Ottawa to Calgary Movers | Cross-Canada Moving",
    "/ottawa-to-edmonton-movers/": "Ottawa to Edmonton Movers | Long-Distance Moving",
    "/ottawa-to-toronto-movers/": "Ottawa to Toronto Movers | Long-Distance Moving",
    "/ottawa-to-vancouver-movers/": "Ottawa to Vancouver Movers | Cross-Canada Moving",
    "/ottawa-to-victoria-movers/": "Ottawa to Victoria Movers | Long-Distance Moving",
    "/our-network/": "Moving Network Across Canada | Purely Canadian Movers",
    "/overseas/": "Overseas Moving Services | International Movers Vancouver",
    "/packing-service-in-coquitlam-bc/": "Packing Services Coquitlam BC | Moving & Unpacking",
    "/packing/": "Packing Services Metro Vancouver | Moving & Unpacking",
    "/port-moody/": "Port Moody Movers | Local Moving Company in Port Moody BC",
    "/testimonials/": "Customer Reviews | Purely Canadian Movers",
    "/toronto-long-distance-movers/": "Toronto Long-Distance Movers",
    "/toronto-to-calgary-movers/": "Toronto to Calgary Movers",
    "/toronto-to-edmonton-movers/": "Toronto to Edmonton Movers | Long-Distance Moving",
    "/toronto-to-montreal-movers/": "Toronto to Montreal Movers | Long-Distance Moving",
    "/toronto-to-vancouver-movers/": "Toronto to Vancouver Movers | Cross-Canada Moving",
    "/toronto-to-victoria-movers/": "Toronto to Victoria Movers | Long-Distance Moving",
    "/valuation-coverage-protection/": "Moving Valuation Coverage | Protection Options",
    "/vancouver-long-distance-movers/": "Vancouver Long-Distance Movers",
    "/vancouver-to-calgary-movers/": "Vancouver to Calgary Movers | Costs, Transit & Quotes",
    "/vancouver-to-toronto-movers/": "Vancouver to Toronto Movers | Cross-Canada Moving",
    "/victoria-long-distance-movers/": "Victoria Long-Distance Movers | Cross-Canada Moving",
    "/victoria-to-vancouver-movers/": "Victoria to Vancouver Movers | Island to Mainland Moving",
    "/white-rock/": "White Rock Movers | Local Moving Company in White Rock BC",
    "/x-country/": "Cross-Country Moving Cost Guide | Canada Routes",
  };

  var META_DESCRIPTION_OVERRIDES = {
    "/canada-usa/":
      "Canada-USA movers for cross-border relocation, packing, valuation coverage, route planning, and written estimates. Since 1991, BBB Accredited, no subcontractors.",
    "/corporate-moves-employee-relocation-in-coquitlam-bc/":
      "Corporate movers in Coquitlam for employee relocation, office moves, packing, storage, and long-distance support. Since 1991, BBB Accredited, no subcontractors.",
    "/cross-country-movers/":
      "Cross-country movers across Canada with packing, storage, valuation coverage, route planning, and written estimates. Since 1991, BBB Accredited, no subcontractors.",
    "/local-movers-in-vancouver-bc/":
      "Vancouver local movers for condos, apartments, houses, packing, storage, and office moves. Family-owned since 1991, BBB Accredited, no subcontractors.",
    "/long-distance/":
      "Long-distance movers across Canada with direct accountability, valuation coverage, packing, storage, and GCVL agent support. Since 1991, BBB Accredited.",
    "/movers-calgary-to-edmonton/":
      "Calgary to Edmonton movers with route planning, packing, storage, valuation coverage, and direct moving accountability. Since 1991, BBB Accredited.",
    "/movers-edmonton-to-calgary/":
      "Edmonton to Calgary movers with route planning, packing, storage, valuation coverage, and direct moving accountability. Since 1991, BBB Accredited.",
    "/movers-vancouver-to-halifax/":
      "Vancouver to Halifax movers for coast-to-coast relocation, packing, storage, valuation coverage, and written estimates. Since 1991, BBB Accredited.",
    "/office/":
      "Office movers in Metro Vancouver for commercial moves, packing, storage, after-hours planning, and valuation coverage. Since 1991, BBB Accredited.",
    "/office-movers-in-vancouver-bc/":
      "Vancouver office movers for commercial relocation, packing, storage, equipment moves, and after-hours planning. Since 1991, BBB Accredited.",
    "/overseas/":
      "Overseas moving services from Vancouver with careful packing, planning, valuation options, and international coordination. Since 1991, BBB Accredited.",
    "/packing-service-in-coquitlam-bc/":
      "Coquitlam packing services for local and long-distance moves, fragile items, supplies, unpacking, and storage timing. Since 1991, BBB Accredited, no subcontractors.",
    "/packing/":
      "Packing services in Metro Vancouver for local and long-distance moves, fragile items, supplies, unpacking, and storage timing. Since 1991, BBB Accredited.",
    "/port-moody/":
      "Port Moody movers for apartments, condos, townhomes, packing, storage, and long-distance moves. Family-owned since 1991, BBB Accredited, no subcontractors.",
    "/port-coquitlam/":
      "Port Coquitlam movers for condos, houses, packing, storage, and long-distance moves. Family-owned since 1991, BBB Accredited, no subcontractors.",
    "/storage/":
      "Moving storage in Coquitlam and Metro Vancouver with packing, pickup, delivery, valuation options, and direct accountability. Since 1991, BBB Accredited.",
    "/testimonials/":
      "Read Purely Canadian Movers trust signals, service areas, and review guidance before booking a Metro Vancouver or long-distance move. Since 1991, BBB Accredited.",
    "/white-rock/":
      "White Rock movers for condos, houses, seniors moves, packing, storage, and long-distance moves. Family-owned since 1991, BBB Accredited, no subcontractors.",
    "/x-country/":
      "Cross-country moving cost guide for Canada routes with packing, storage, valuation coverage, and written estimate planning. Since 1991, BBB Accredited.",
  };

  var PRICING_SUMMARY_ROWS = [
    ["Vancouver to Toronto", "$2,500+", "$4,700-$6,500+", "$10,000-$15,000+", "9-22 days"],
    ["Toronto to Vancouver", "$2,500+", "$4,700-$6,500+", "$10,000-$15,000+", "9-22 days"],
    ["Vancouver to Calgary", "$1,100+", "$1,500-$2,000+", "$2,800+", "2-5 days"],
    ["Toronto to Calgary", "$2,500+", "$4,500-$7,000+", "$10,000+", "7-14 days"],
    ["Montreal to Vancouver", "$3,000+", "$5,300-$7,000+", "$11,000-$16,000+", "10-22 days"],
    ["Ottawa to Vancouver", "$3,000+", "$5,300-$7,000+", "$11,000-$16,000+", "10-22 days"],
    ["Victoria/Nanaimo to Toronto", "$3,000+", "$5,300-$7,000+", "$11,000-$16,000+", "10-22 days"],
  ];

  var TRUST_PROOF_BLOCKS = {
    "/long-distance-moving-cost-canada/": {
      title: "Why these long-distance moving cost ranges are reliable",
      intro:
        "Long-distance moving prices can vary widely, so the guide explains the factors behind each range instead of promising a one-size-fits-all price. Use it as a planning range, then request a written estimate based on your route, shipment size, access, and service needs.",
      proof: [
        ["Experience since 1991", "Purely Canadian Movers has helped Canadian families and businesses plan local and long-distance moves for more than three decades."],
        ["Direct moving accountability", "No subcontractors. Your estimate, planning, pickup, and delivery are handled through one accountable moving team."],
        ["National network support", "As a Great Canadian Van Lines agent, we combine local service with cross-Canada route support and long-distance coordination."],
        ["BBB Accredited", "Trust signals matter on pricing pages. BBB accreditation, written estimates, and clear terms help customers compare movers more safely."],
        ["Valuation options", "Basic valuation coverage is included, and additional protection options can be reviewed before booking."],
        ["Pricing variables shown", "Final cost depends on weight or volume, distance, access, stairs, elevators, season, packing, storage, and specialty items."],
      ],
      links: [
        ["Get a written estimate", "/contact/"],
        ["Valuation coverage", "/valuation-coverage-protection/"],
        ["Packing services", "/packing/"],
        ["Storage options", "/storage/"],
        ["Long-distance movers", "/long-distance/"],
        ["Great Canadian Van Lines agent", "/great-canadian-vanlines-agent/"],
      ],
    },
  };

  var LOCAL_SEO_BLOCKS = {
    "/maple-ridge/": {
      title: "Maple Ridge movers for local and long-distance moves",
      intro:
        "Purely Canadian Movers helps Maple Ridge families and businesses move within the Lower Mainland, across BC, and across Canada. The page now gives Google and customers clearer Maple Ridge intent, nearby service links, and quote-focused answers.",
      highlights: [
        ["Local move scenarios", "Apartments, townhomes, detached homes, seniors moves, furniture moves, and storage-assisted moves in Maple Ridge."],
        ["Nearby areas", "Pitt Meadows, Port Coquitlam, Coquitlam, Langley, Mission, and the rest of Metro Vancouver."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and Great Canadian Van Lines agent support."],
      ],
      links: [
        ["Local Moving", "/local/"],
        ["Pitt Meadows Movers", "/pitt-meadows/"],
        ["Port Coquitlam Movers", "/port-coquitlam/"],
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Langley Movers", "/local-movers-langley-bc/"],
        ["Long-Distance Moving", "/long-distance/"],
      ],
      faqs: [
        ["Do you move homes within Maple Ridge?", "Yes. Purely Canadian Movers handles local Maple Ridge moves for apartments, condos, townhomes, detached homes, seniors moves, and furniture-only moves."],
        ["Do you serve Pitt Meadows and nearby communities?", "Yes. We serve Maple Ridge, Pitt Meadows, Port Coquitlam, Coquitlam, Langley, Mission, and surrounding Lower Mainland communities."],
        ["How much do Maple Ridge movers cost?", "Local moving cost depends on crew size, truck time, access, stairs, elevators, packing, storage, and the amount being moved. A written estimate is the best way to price the move accurately."],
        ["Do you use subcontractors for Maple Ridge moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
      ],
    },
    "/local-movers-in-coquitlam-bc/": {
      title: "Local movers in Coquitlam with direct accountability",
      intro:
        "Coquitlam is a core service area for Purely Canadian Movers. This page reinforces the local moving cluster for Coquitlam, Port Coquitlam, Port Moody, Burnaby, New Westminster, and nearby Metro Vancouver communities with clearer cost, access, and direct-mover proof.",
      highlights: [
        ["Coquitlam move types", "Apartment moves, condo moves, detached homes, seniors moves, furniture moves, packing help, and short-notice local relocations."],
        ["Access planning", "Elevator bookings, strata rules, loading zones, stairs, steep driveways, storage timing, and parking are reviewed before moving day."],
        ["Tri-Cities coverage", "Coquitlam, Port Coquitlam, Port Moody, Burke Mountain, Maillardville, Austin Heights, Westwood Plateau, and nearby Lower Mainland areas."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and Great Canadian Van Lines agent support."],
      ],
      links: [
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Packing in Coquitlam", "/packing-service-in-coquitlam-bc/"],
        ["Office Movers Coquitlam", "/office-movers-coquitlam-bc/"],
        ["Corporate Relocation Coquitlam", "/corporate-moves-employee-relocation-in-coquitlam-bc/"],
        ["Port Coquitlam Movers", "/port-coquitlam/"],
        ["Port Moody Movers", "/local-movers-port-moody-bc/"],
        ["Burnaby Movers", "/local-movers-burnaby-bc/"],
        ["New Westminster Movers", "/local-movers-new-westminster-bc/"],
      ],
      faqs: [
        ["Do you provide local movers in Coquitlam?", "Yes. Purely Canadian Movers provides local moving services in Coquitlam for apartments, condos, houses, furniture moves, offices, and packing-supported moves."],
        ["What areas near Coquitlam do you serve?", "We serve Coquitlam, Port Coquitlam, Port Moody, Burnaby, New Westminster, Surrey, Vancouver, and the wider Lower Mainland."],
        ["How much does a local move in Coquitlam cost?", "The cost depends on the size of the move, crew size, access, elevators, stairs, packing, storage, and travel time. Request an estimate for a specific Coquitlam moving quote."],
        ["Can you help with Coquitlam condo and strata moves?", "Yes. We help plan elevator bookings, loading zones, strata move windows, parking, and access for Coquitlam condo and apartment moves."],
        ["Do you offer packing or storage for Coquitlam local moves?", "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included in a Coquitlam moving estimate."],
        ["Are you a direct moving company or a broker?", "Purely Canadian Movers is a direct moving company with no subcontractors, giving customers one accountable team from estimate to moving day."],
      ],
    },
    "/coquitlam-bc/": {
      title: "Coquitlam moving company for local, packing, office, and long-distance moves",
      intro:
        "This Coquitlam hub connects the local moving, packing, office moving, corporate relocation, storage, and long-distance services that matter most for Coquitlam searches. It also gives customers a clearer path to the most relevant Coquitlam moving quote.",
      highlights: [
        ["Local base", "Purely Canadian Movers is based in Coquitlam and has served Metro Vancouver since 1991."],
        ["Service cluster", "Local moves, packing, storage, office moves, corporate relocations, cross-border moves, valuation coverage, and long-distance moving."],
        ["Neighbourhood notes", "Crews plan around Coquitlam condos, townhomes, detached homes, strata rules, elevator bookings, steep driveways, and routes through Burke Mountain, Maillardville, Austin Heights, and Westwood Plateau."],
        ["Nearby coverage", "Port Coquitlam, Port Moody, Burnaby, New Westminster, Surrey, Langley, Maple Ridge, Pitt Meadows, and Vancouver."],
      ],
      links: [
        ["Local Movers in Coquitlam", "/local-movers-in-coquitlam-bc/"],
        ["Packing Service in Coquitlam", "/packing-service-in-coquitlam-bc/"],
        ["Office Movers Coquitlam", "/office-movers-coquitlam-bc/"],
        ["Corporate Moves Coquitlam", "/corporate-moves-employee-relocation-in-coquitlam-bc/"],
        ["Port Coquitlam Movers", "/port-coquitlam/"],
        ["Port Moody Movers", "/port-moody/"],
        ["Storage", "/storage/"],
        ["Long-Distance Moving", "/long-distance/"],
      ],
      faqs: [
        ["Is Purely Canadian Movers based in Coquitlam?", "Yes. Purely Canadian Movers is based in Coquitlam and serves Metro Vancouver, the Lower Mainland, BC, Canada, and international routes."],
        ["What moving services do you offer in Coquitlam?", "Services include local moving, long-distance moving, packing, storage, office moving, corporate relocation, cross-border moving, and valuation coverage options."],
        ["Do you serve Port Coquitlam and Port Moody?", "Yes. The Coquitlam team also serves Port Coquitlam, Port Moody, Burnaby, New Westminster, Surrey, Langley, Maple Ridge, and surrounding areas."],
        ["Which Coquitlam page should I use for a local household move?", "Use the local movers in Coquitlam page for apartment, condo, house, furniture-only, seniors, and short-distance moves within Coquitlam and nearby Tri-Cities communities."],
        ["Can you help with Coquitlam packing, storage, and long-distance moves?", "Yes. Packing, storage, valuation coverage, and long-distance moving can be included in a Coquitlam estimate when the move needs more than local transportation."],
        ["What should I tell you before a Coquitlam estimate?", "Share your origin, destination, home size, access conditions, elevator or strata requirements, packing needs, storage timing, specialty items, and preferred move date."],
      ],
    },
    "/coquitlam/": {
      title: "Coquitlam movers and nearby Tri-Cities moving services",
      intro:
        "This page supports the broader Coquitlam moving cluster and points customers toward the most relevant service pages for local, packing, office, storage, and long-distance moves.",
      highlights: [
        ["Best next page", "Customers looking for a local move should visit the local movers in Coquitlam page for the strongest match."],
        ["Service proof", "Family-owned since 1991, BBB Accredited, no subcontractors, and direct moving support."],
        ["Internal cluster", "Coquitlam service pages should link together so Google understands the full local moving topic."],
      ],
      links: [
        ["Local Movers in Coquitlam", "/local-movers-in-coquitlam-bc/"],
        ["Coquitlam BC Moving Page", "/coquitlam-bc/"],
        ["Packing Service in Coquitlam", "/packing-service-in-coquitlam-bc/"],
        ["Office Movers Coquitlam", "/office-movers-coquitlam-bc/"],
        ["Contact for Estimate", "/contact/"],
      ],
      faqs: [
        ["Which Coquitlam moving page should I use?", "For a local household move, use the local movers in Coquitlam page. For a broader overview, use the Coquitlam BC moving page."],
        ["Can I get packing and storage with my Coquitlam move?", "Yes. Packing support and storage options can be included with a Coquitlam moving estimate."],
      ],
    },
    "/packing-service-in-coquitlam-bc/": {
      title: "Coquitlam packing services for local, storage, and long-distance moves",
      intro:
        "Purely Canadian Movers helps Coquitlam customers prepare for moving day with full packing, partial packing, fragile-only packing, unpacking, supplies, and storage coordination. This page now gives clearer local intent for Coquitlam packing searches and links into the broader Coquitlam moving cluster.",
      highlights: [
        ["Packing options", "Full-home packing, kitchen packing, fragile-only packing, wardrobe boxes, unpacking, and packing support before local or long-distance moves."],
        ["Coquitlam access planning", "Crews plan around condo elevators, strata rules, loading zones, stairs, parking, storage dates, and neighbourhood access in Burke Mountain, Maillardville, Austin Heights, and Westwood Plateau."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct accountability from packing plan to moving day."],
      ],
      links: [
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Local Movers in Coquitlam", "/local-movers-in-coquitlam-bc/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Port Coquitlam Movers", "/port-coquitlam/"],
        ["Port Moody Movers", "/port-moody/"],
        ["Get a Packing Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you provide packing services in Coquitlam?", "Yes. Purely Canadian Movers provides packing services in Coquitlam for apartments, condos, houses, offices, local moves, storage-supported moves, and long-distance moves."],
        ["Can I book partial packing instead of full packing?", "Yes. Customers can request full packing, partial packing, kitchen packing, fragile-only packing, wardrobe boxes, unpacking, or packing supplies depending on the move."],
        ["Do you pack fragile items for Coquitlam moves?", "Yes. Fragile items can be packed with appropriate materials, labelling, and handling instructions. Valuation coverage options can also be reviewed before moving day."],
        ["Can packing be combined with storage?", "Yes. Packing can be coordinated with short-term storage, long-term storage, delivery timing, and access requirements for Coquitlam and Metro Vancouver moves."],
        ["How much do Coquitlam packing services cost?", "Packing cost depends on the number of rooms, amount of fragile items, supplies needed, crew time, unpacking needs, and whether storage or long-distance moving is included."],
        ["Do you use subcontractors for packing?", "No. Purely Canadian Movers focuses on direct moving accountability and does not subcontract packing or moving work."],
      ],
    },
    "/local-movers-in-vancouver-bc/": {
      title: "Vancouver local movers with direct accountability and trust proof",
      intro:
        "Purely Canadian Movers serves Vancouver apartments, condos, detached homes, offices, and furniture moves with clearer local proof: family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and Great Canadian Van Lines agent support for longer routes.",
      highlights: [
        ["Vancouver move types", "Apartment moves, condo moves, houses, seniors moves, furniture-only moves, office moves, packing-supported moves, and storage-assisted moves."],
        ["Access planning", "Elevator bookings, loading zones, strata rules, parking, downtown access, laneways, stairs, and building move windows are reviewed before moving day."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct accountability from estimate to moving day."],
      ],
      links: [
        ["Local Moving", "/local/"],
        ["Vancouver Movers", "/vancouver/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Office Movers Vancouver", "/office-movers-in-vancouver-bc/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Vancouver Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you provide local movers in Vancouver?", "Yes. Purely Canadian Movers handles Vancouver local moves for apartments, condos, detached homes, seniors moves, offices, furniture moves, and packing-supported moves."],
        ["Can you help with Vancouver condo and apartment moves?", "Yes. We help plan elevator bookings, loading zones, strata move windows, parking, stairs, and access for Vancouver condo and apartment moves."],
        ["How much do Vancouver local movers cost?", "Cost depends on crew size, truck time, access, stairs, elevators, packing, storage, travel time, and the amount being moved. A written estimate is the best way to price the move accurately."],
        ["Do you use subcontractors for Vancouver moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
        ["Can packing, storage, or valuation coverage be added?", "Yes. Packing, unpacking, storage, and valuation coverage options can be included in a Vancouver moving estimate."],
      ],
    },
    "/port-coquitlam/": {
      title: "Port Coquitlam movers for local, packing, storage, and long-distance moves",
      intro:
        "Purely Canadian Movers supports Port Coquitlam customers as part of the Tri-Cities moving cluster. This page now adds stronger service proof, nearby-area links, and trust signals for Port Coquitlam local moves, packing, storage, and long-distance relocation.",
      highlights: [
        ["Port Coquitlam move types", "Condos, townhomes, detached homes, apartments, seniors moves, packing-supported moves, office moves, and storage-assisted moves."],
        ["Tri-Cities coverage", "Port Coquitlam, Coquitlam, Port Moody, Burke Mountain, Maillardville, Pitt Meadows, Maple Ridge, Burnaby, and New Westminster."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and Great Canadian Van Lines agent support."],
      ],
      links: [
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Local Movers in Coquitlam", "/local-movers-in-coquitlam-bc/"],
        ["Port Moody Movers", "/port-moody/"],
        ["Pitt Meadows Movers", "/pitt-meadows/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Get an Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you provide movers in Port Coquitlam?", "Yes. Purely Canadian Movers provides Port Coquitlam moving services for apartments, condos, townhomes, houses, offices, packing, storage, and long-distance moves."],
        ["Do you serve the wider Tri-Cities area?", "Yes. We serve Port Coquitlam, Coquitlam, Port Moody, Pitt Meadows, Maple Ridge, Burnaby, New Westminster, and nearby Lower Mainland areas."],
        ["Can you help with packing and storage in Port Coquitlam?", "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included with a Port Coquitlam estimate."],
        ["How much do Port Coquitlam movers cost?", "Cost depends on crew size, truck time, access, stairs, elevators, packing, storage, travel time, and the amount being moved. Request a written estimate for accurate pricing."],
        ["Do you use subcontractors for Port Coquitlam moves?", "No. Purely Canadian Movers focuses on direct moving accountability and does not subcontract moves."],
      ],
    },
    "/storage/": {
      title: "Moving storage with packing, pickup, delivery, and valuation options",
      intro:
        "Storage is a trust-heavy part of a move. Purely Canadian Movers helps coordinate storage timing, packing, pickup, delivery, access, and valuation coverage options with one accountable team serving Coquitlam, Metro Vancouver, and long-distance routes.",
      highlights: [
        ["Storage scenarios", "Short-term storage, long-term storage, downsizing, delayed possession dates, renovations, estate moves, office moves, and long-distance delivery timing."],
        ["Handled with the move", "Packing, inventory notes, pickup access, delivery timing, valuation coverage options, and communication are planned with the same moving team."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct accountability from pickup to delivery."],
      ],
      links: [
        ["Packing Services", "/packing/"],
        ["Local Moving", "/local/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Get a Storage Estimate", "/contact/"],
      ],
      faqs: [
        ["Can storage be added to a moving estimate?", "Yes. Storage can be coordinated with local moves, long-distance moves, packing, delayed possession dates, renovations, downsizing, and office moves."],
        ["Do you help pack items before storage?", "Yes. Packing, labelling, fragile-item preparation, and supplies can be included before items go into storage."],
        ["How much does moving storage cost?", "Storage cost depends on volume, storage duration, pickup and delivery access, packing needs, and whether the move is local or long-distance."],
        ["Are valuation coverage options available for storage-supported moves?", "Yes. Valuation coverage options can be reviewed before booking so customers understand protection choices for eligible moves."],
        ["Do you use subcontractors for storage-supported moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moving work."],
      ],
    },
    "/packing/": {
      title: "Metro Vancouver packing services with careful handling and trust proof",
      intro:
        "Purely Canadian Movers provides full packing, partial packing, fragile-only packing, unpacking, supplies, and storage coordination for Metro Vancouver and long-distance moves. This page now makes the trust proof clearer for customers comparing packing help.",
      highlights: [
        ["Packing options", "Full-home packing, kitchen packing, fragile-only packing, wardrobe boxes, unpacking, supplies, and packing support before storage or long-distance moving."],
        ["Care planning", "Fragile items, artwork, dishes, electronics, office equipment, elevators, parking, storage timing, and delivery needs are reviewed before packing begins."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct accountability from packing plan to moving day."],
      ],
      links: [
        ["Coquitlam Packing", "/packing-service-in-coquitlam-bc/"],
        ["Storage Services", "/storage/"],
        ["Local Moving", "/local/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Packing Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you provide packing services in Metro Vancouver?", "Yes. Purely Canadian Movers provides packing services for apartments, condos, houses, offices, local moves, storage-supported moves, and long-distance moves."],
        ["Can I book partial packing?", "Yes. Customers can request full packing, partial packing, kitchen packing, fragile-only packing, wardrobe boxes, unpacking, or supplies."],
        ["Can packing be combined with storage?", "Yes. Packing can be coordinated with short-term storage, long-term storage, delivery timing, and access requirements."],
        ["How much do packing services cost?", "Packing cost depends on rooms, fragile items, supplies, crew time, unpacking needs, storage timing, and whether the move is local or long-distance."],
        ["Do you use subcontractors for packing?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract packing or moving work."],
      ],
    },
    "/long-distance/": {
      title: "Long-distance movers in Canada with direct accountability",
      intro:
        "Long-distance moves carry more risk than short local moves, so customers need clear proof. Purely Canadian Movers supports cross-Canada moves with written estimates, packing, storage, valuation coverage options, no subcontractors, and Great Canadian Van Lines agent support.",
      highlights: [
        ["Long-distance planning", "Route timing, shipment size, access, stairs, elevators, packing, storage, seasonal timing, and specialty items are reviewed before booking."],
        ["Direct accountability", "No subcontractors. Customers work with one accountable team for estimate details, planning, pickup, and delivery coordination."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, valuation coverage options, and Great Canadian Van Lines agent support for national moves."],
      ],
      links: [
        ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
        ["Cross-Country Movers", "/cross-country-movers/"],
        ["Great Canadian Van Lines Agent", "/great-canadian-vanlines-agent/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Long-Distance Estimate", "/contact/"],
      ],
      faqs: [
        ["What makes a long-distance moving estimate accurate?", "An accurate estimate should consider route, shipment size, access, stairs, elevators, packing, storage, season, specialty items, and valuation coverage options."],
        ["Do you use subcontractors for long-distance moves?", "No. Purely Canadian Movers focuses on direct moving accountability and does not subcontract moves."],
        ["Can packing and storage be added to a long-distance move?", "Yes. Packing, unpacking, short-term storage, long-term storage, and valuation coverage options can be included in a long-distance estimate."],
        ["Are you connected to a national moving network?", "Yes. Purely Canadian Movers is a Great Canadian Van Lines agent, combining local service with cross-Canada route support."],
        ["How do I compare long-distance movers safely?", "Compare written estimates, years in business, BBB accreditation, direct accountability, valuation coverage options, service areas, and whether the mover uses brokers or subcontractors."],
      ],
    },
    "/cross-country-movers/": {
      title: "Cross-country movers with route planning, valuation options, and national support",
      intro:
        "Cross-country moving across Canada needs stronger proof than a generic quote page. Purely Canadian Movers combines local accountability with Great Canadian Van Lines agent support, valuation coverage options, packing, storage, and route-specific planning.",
      highlights: [
        ["Coast-to-coast planning", "Shipment size, access, route timing, packing, storage, specialty items, and delivery windows are reviewed before the estimate is finalized."],
        ["National support", "Great Canadian Van Lines agent support helps with cross-Canada coordination while keeping Purely Canadian Movers directly accountable."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, written estimates, and valuation coverage options."],
      ],
      links: [
        ["Long-Distance Moving", "/long-distance/"],
        ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
        ["Great Canadian Van Lines Agent", "/great-canadian-vanlines-agent/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Cross-Country Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you handle cross-country moves across Canada?", "Yes. Purely Canadian Movers supports cross-country moves across Canada with route planning, packing, storage, and valuation coverage options."],
        ["How much does a cross-country move cost?", "Cost depends on route, shipment size, access, weight or volume, season, packing, storage, specialty items, and delivery timing."],
        ["Do you use subcontractors for cross-country moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
        ["Can storage be included in a cross-country move?", "Yes. Storage can be coordinated when pickup and delivery dates do not line up or when customers need temporary holding."],
        ["What trust signals should I check before booking?", "Check years in business, BBB accreditation, written estimates, valuation coverage options, a real local address, and whether the mover uses brokers or subcontractors."],
      ],
    },
    "/canada-usa/": {
      title: "Canada-USA movers with cross-border planning and direct accountability",
      intro:
        "Cross-border moving requires careful planning, clear paperwork expectations, packing, route timing, and trust proof. Purely Canadian Movers supports Canada-USA moves with written estimates, valuation coverage options, no subcontractors, and experienced coordination.",
      highlights: [
        ["Cross-border planning", "Origin and destination access, shipment size, packing, inventory notes, documentation expectations, route timing, and delivery coordination are reviewed before booking."],
        ["Risk reduction", "Written estimates, valuation coverage options, direct communication, and no subcontractors help customers avoid broker confusion."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and international moving experience."],
      ],
      links: [
        ["Long-Distance Moving", "/long-distance/"],
        ["Overseas Moving", "/overseas/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Cross-Border Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you handle moves between Canada and the United States?", "Yes. Purely Canadian Movers helps customers plan Canada-USA moves with route planning, packing, valuation coverage options, and cross-border coordination."],
        ["What information is needed for a Canada-USA moving estimate?", "Share the origin, destination, home size, access conditions, preferred date, packing needs, storage timing, specialty items, and any documentation questions."],
        ["Can packing and storage be included?", "Yes. Packing, unpacking, storage, and valuation coverage options can be included in a Canada-USA moving estimate."],
        ["Do you use subcontractors for cross-border moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
        ["How do I reduce risk on a cross-border move?", "Start with a written estimate, confirm valuation coverage options, provide clear inventory details, and work with a direct mover rather than a broker."],
      ],
    },
    "/overseas/": {
      title: "Overseas moving services with packing, planning, and trust proof",
      intro:
        "Overseas moves require more preparation than a standard local move. Purely Canadian Movers supports international moving preparation with careful packing, inventory planning, documentation expectations, valuation coverage options, storage timing, and direct accountability.",
      highlights: [
        ["International preparation", "Packing, fragile items, inventory notes, timing, access, storage, documentation expectations, and destination coordination are discussed before booking."],
        ["Trust and handling", "International moves benefit from clear written estimates, careful packing, valuation coverage options, and one accountable moving team."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, international moving experience, and valuation coverage options."],
      ],
      links: [
        ["Canada-USA Moving", "/canada-usa/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get an Overseas Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you help with overseas moves?", "Yes. Purely Canadian Movers helps customers prepare for overseas moves with packing, inventory planning, storage timing, valuation coverage options, and moving coordination."],
        ["What should I prepare for an international moving estimate?", "Share origin, destination, shipment size, access details, packing needs, storage timing, preferred dates, and any specialty items."],
        ["Can packing be included for overseas moves?", "Yes. Packing, fragile-item preparation, supplies, and unpacking support can be discussed as part of the estimate."],
        ["Are valuation coverage options available?", "Yes. Valuation coverage options can be reviewed before booking so customers understand available protection choices."],
        ["Do you use subcontractors?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moving work."],
      ],
    },
    "/x-country/": {
      title: "Cross-country moving cost guide with trust proof and quote planning",
      intro:
        "A cross-country moving cost guide should explain more than a price range. Purely Canadian Movers helps customers compare route, shipment size, packing, storage, access, valuation coverage, and written estimate details before booking.",
      highlights: [
        ["Cost factors", "Route distance, shipment weight or volume, home size, access, stairs, elevators, season, packing, storage, specialty items, and delivery timing."],
        ["Estimate proof", "Written estimates, direct accountability, no subcontractors, and valuation coverage options help customers compare cross-country movers safely."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, Great Canadian Van Lines agent support, and cross-Canada moving experience."],
      ],
      links: [
        ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
        ["Cross-Country Movers", "/cross-country-movers/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Written Estimate", "/contact/"],
      ],
      faqs: [
        ["What affects cross-country moving cost?", "Cost depends on route, shipment size, access, weight or volume, season, packing, storage, specialty items, and delivery timing."],
        ["Are cross-country cost ranges guaranteed?", "No. Cost ranges are planning estimates. A written quote should be based on the specific route, inventory, access, dates, and services needed."],
        ["Can packing and storage change the cost?", "Yes. Packing, unpacking, supplies, storage duration, pickup access, delivery access, and specialty items can affect the final estimate."],
        ["Do you use subcontractors for cross-country moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
        ["What trust proof should I look for?", "Look for years in business, BBB accreditation, written estimates, valuation coverage options, direct accountability, and national route support."],
      ],
    },
    "/office/": {
      title: "Metro Vancouver office movers with business trust proof",
      intro:
        "Office moves need timing, access, and accountability. Purely Canadian Movers helps Metro Vancouver businesses plan desks, equipment, files, elevators, loading access, after-hours moves, storage, packing, and valuation coverage options.",
      highlights: [
        ["Office move planning", "Desks, chairs, files, equipment, meeting rooms, elevator bookings, loading zones, building rules, after-hours timing, and phased moves."],
        ["Business continuity", "Clear planning, direct communication, packing support, storage timing, and valuation coverage options help reduce disruption."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct accountability for commercial moves."],
      ],
      links: [
        ["Office Movers Vancouver", "/office-movers-in-vancouver-bc/"],
        ["Office Movers Coquitlam", "/office-movers-coquitlam-bc/"],
        ["Corporate Relocation", "/corporate-moves-employee-relocation-in-coquitlam-bc/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get an Office Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you provide office movers in Metro Vancouver?", "Yes. Purely Canadian Movers helps with office moves, equipment moves, furniture moves, packing, storage, and phased commercial relocation."],
        ["Can you move offices after hours?", "After-hours or phased timing can be discussed during the estimate so the move plan fits building rules and business needs."],
        ["Can packing and storage be included?", "Yes. Packing, labelling, storage, delivery timing, and valuation coverage options can be included in an office moving estimate."],
        ["Do you use subcontractors for office moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moving work."],
        ["What affects office moving cost?", "Cost depends on inventory, crew size, access, elevators, stairs, packing, storage, distance, timing, and equipment or specialty items."],
      ],
    },
    "/office-movers-in-vancouver-bc/": {
      title: "Vancouver office movers for commercial moves, access planning, and storage",
      intro:
        "Purely Canadian Movers helps Vancouver businesses plan office moves with stronger trust proof: family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct communication from estimate to move day.",
      highlights: [
        ["Vancouver office access", "Downtown loading zones, elevators, building move windows, parking, strata or property rules, stairs, and phased timing are reviewed before moving day."],
        ["Commercial move support", "Desks, furniture, files, equipment, packing, labelling, storage, delivery timing, and after-hours planning can be included."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct accountability for business moves."],
      ],
      links: [
        ["Office Moving", "/office/"],
        ["Corporate Relocation", "/corporate-moves-employee-relocation-in-coquitlam-bc/"],
        ["Local Movers Vancouver", "/local-movers-in-vancouver-bc/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Vancouver Office Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you provide office movers in Vancouver?", "Yes. Purely Canadian Movers provides Vancouver office moving support for furniture, files, equipment, packing, storage, and commercial relocation."],
        ["Can you plan around building move windows?", "Yes. Elevator bookings, loading zones, parking, property rules, and after-hours timing can be reviewed before moving day."],
        ["Can storage be included with a Vancouver office move?", "Yes. Storage can be coordinated for phased moves, renovations, delayed possession dates, or equipment that cannot move immediately."],
        ["Do you use subcontractors for office moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moving work."],
        ["How much does a Vancouver office move cost?", "Cost depends on inventory, crew size, access, elevators, stairs, packing, storage, distance, timing, and equipment or specialty items."],
      ],
    },
    "/corporate-moves-employee-relocation-in-coquitlam-bc/": {
      title: "Coquitlam corporate relocation with employee moving support and trust proof",
      intro:
        "Corporate and employee relocation needs clear accountability. Purely Canadian Movers supports Coquitlam businesses with employee moves, office relocation, packing, storage, long-distance coordination, valuation coverage options, and direct moving communication.",
      highlights: [
        ["Relocation support", "Employee household moves, office moves, packing, storage, long-distance routes, move timing, access planning, and valuation coverage options."],
        ["Business trust", "Written estimates, direct communication, no subcontractors, and clear service links help HR teams and employees compare moving support."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, Great Canadian Van Lines agent support, valuation coverage options, and Coquitlam-based accountability."],
      ],
      links: [
        ["Office Moving", "/office/"],
        ["Office Movers Coquitlam", "/office-movers-coquitlam-bc/"],
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Get a Corporate Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you help with corporate employee relocation in Coquitlam?", "Yes. Purely Canadian Movers supports employee household moves, office relocation, packing, storage, and long-distance coordination for Coquitlam businesses."],
        ["Can employee moves include packing and storage?", "Yes. Packing, unpacking, storage, valuation coverage options, and route planning can be included depending on employee needs."],
        ["Do you support long-distance employee relocation?", "Yes. Long-distance routes can be planned with Great Canadian Van Lines agent support and direct communication from Purely Canadian Movers."],
        ["Do you use subcontractors for corporate moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moving work."],
        ["What should a business provide for an estimate?", "Share origin and destination details, employee move dates, home size, access conditions, packing needs, storage timing, and any office or HR requirements."],
      ],
    },
    "/movers-calgary-to-edmonton/": {
      title: "Calgary to Edmonton movers with Alberta route planning and trust proof",
      intro:
        "A Calgary to Edmonton move still needs a clear written plan. Purely Canadian Movers helps customers compare route timing, shipment size, access, packing, storage, valuation coverage options, and direct accountability before booking.",
      highlights: [
        ["Route details", "Calgary pickup access, Edmonton delivery access, stairs, elevators, packing, storage timing, season, shipment size, and specialty items affect the estimate."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and long-distance moving experience."],
        ["Estimate clarity", "Written estimates and direct communication help customers compare Alberta movers and avoid broker confusion."],
      ],
      links: [
        ["Long-Distance Moving", "/long-distance/"],
        ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Route Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you move from Calgary to Edmonton?", "Yes. Purely Canadian Movers can help plan Calgary to Edmonton moves with route planning, packing, storage, and valuation coverage options."],
        ["How much does a Calgary to Edmonton move cost?", "Cost depends on shipment size, access, stairs, elevators, packing, storage, season, and the amount being moved."],
        ["Can packing or storage be included?", "Yes. Packing, unpacking, storage, and valuation coverage options can be included in the estimate."],
        ["Do you use subcontractors?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
      ],
    },
    "/movers-edmonton-to-calgary/": {
      title: "Edmonton to Calgary movers with Alberta route planning and direct accountability",
      intro:
        "An Edmonton to Calgary move should include more than a basic price. Purely Canadian Movers helps plan access, shipment size, packing, storage, valuation coverage options, and route timing with direct moving accountability.",
      highlights: [
        ["Route details", "Edmonton pickup access, Calgary delivery access, stairs, elevators, parking, packing, storage timing, season, shipment size, and specialty items affect the estimate."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and long-distance moving experience."],
        ["Estimate clarity", "Written estimates and one accountable moving team help customers compare movers safely."],
      ],
      links: [
        ["Long-Distance Moving", "/long-distance/"],
        ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Route Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you move from Edmonton to Calgary?", "Yes. Purely Canadian Movers can help plan Edmonton to Calgary moves with route planning, packing, storage, and valuation coverage options."],
        ["How much does an Edmonton to Calgary move cost?", "Cost depends on shipment size, access, stairs, elevators, packing, storage, season, and the amount being moved."],
        ["Can storage be included if dates do not line up?", "Yes. Storage can be coordinated when pickup and delivery dates do not align."],
        ["Do you use subcontractors?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
      ],
    },
    "/movers-vancouver-to-halifax/": {
      title: "Vancouver to Halifax movers with coast-to-coast planning and trust proof",
      intro:
        "A Vancouver to Halifax move is a major coast-to-coast relocation. Purely Canadian Movers helps plan shipment size, packing, storage, route timing, valuation coverage options, and written estimates with direct accountability.",
      highlights: [
        ["Coast-to-coast details", "Route distance, pickup and delivery access, shipment weight or volume, stairs, elevators, packing, storage, season, and specialty items affect the estimate."],
        ["National support", "Great Canadian Van Lines agent support helps with cross-Canada coordination while Purely Canadian Movers remains directly accountable."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and written estimate planning."],
      ],
      links: [
        ["Long-Distance Moving", "/long-distance/"],
        ["Cross-Country Movers", "/cross-country-movers/"],
        ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Get a Vancouver to Halifax Estimate", "/contact/"],
      ],
      faqs: [
        ["Do you move from Vancouver to Halifax?", "Yes. Purely Canadian Movers helps plan Vancouver to Halifax and other coast-to-coast moves across Canada."],
        ["How much does a Vancouver to Halifax move cost?", "Cost depends on shipment size, route distance, access, stairs, elevators, packing, storage, season, and specialty items."],
        ["Can packing and storage be included?", "Yes. Packing, unpacking, storage, and valuation coverage options can be included in the estimate."],
        ["Do you use subcontractors for coast-to-coast moves?", "No. Purely Canadian Movers focuses on direct accountability and does not subcontract moves."],
        ["What should I compare before booking?", "Compare written estimates, years in business, BBB accreditation, valuation coverage options, direct accountability, and whether the mover is a broker or direct mover."],
      ],
    },
    "/port-moody/": {
      title: "Port Moody movers for condos, apartments, townhomes, and long-distance moves",
      intro:
        "Purely Canadian Movers serves Port Moody as part of the Tri-Cities and Metro Vancouver moving network. This Port Moody hub supports customers comparing local movers, packing, storage, and long-distance relocation help.",
      highlights: [
        ["Port Moody move scenarios", "Apartment moves, condo moves, townhomes, detached homes, seniors moves, office moves, furniture moves, and packing-supported moves."],
        ["Neighbourhood and access notes", "Moody Centre, Newport Village, Suter Brook, Heritage Mountain, Ioco, Anmore, Belcarra, and nearby Tri-Cities communities often require elevator bookings, loading access planning, and strata coordination."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and Great Canadian Van Lines agent support."],
      ],
      links: [
        ["Local Movers in Port Moody", "/local-movers-port-moody-bc/"],
        ["Coquitlam Movers", "/local-movers-in-coquitlam-bc/"],
        ["Port Coquitlam Movers", "/port-coquitlam/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Long-Distance Moving", "/long-distance/"],
      ],
      faqs: [
        ["Do you provide local movers in Port Moody?", "Yes. Purely Canadian Movers handles local Port Moody moves for apartments, condos, townhomes, detached homes, offices, seniors moves, and furniture-only moves."],
        ["What areas near Port Moody do you serve?", "We serve Port Moody, Coquitlam, Port Coquitlam, Anmore, Belcarra, Burnaby, New Westminster, and the wider Metro Vancouver area."],
        ["Can you help with Port Moody condo and strata moves?", "Yes. We help plan elevator bookings, loading access, parking, strata requirements, and timing for Port Moody condo and apartment moves."],
        ["How much do Port Moody movers cost?", "The cost depends on crew size, truck time, access, stairs, elevators, packing, storage, travel time, and the amount being moved. A written estimate is the best way to price the move accurately."],
        ["Do you use subcontractors for Port Moody moves?", "No. Purely Canadian Movers focuses on direct moving accountability and does not subcontract moves."],
      ],
    },
    "/local-movers-white-rock-bc/": {
      title: "White Rock local movers for condos, houses, seniors moves, and careful access planning",
      intro:
        "Purely Canadian Movers helps White Rock residents plan local moves, seniors moves, condo moves, packing, storage, and long-distance relocation. This page reinforces White Rock intent with service details, nearby-area links, and quote-focused answers.",
      highlights: [
        ["White Rock move scenarios", "Condos, apartments, detached homes, seniors downsizing moves, furniture-only moves, packing-supported moves, and storage-assisted moves."],
        ["Access and neighbourhood notes", "White Rock beach-area streets, hills, parking limits, condo elevators, strata rules, Marine Drive access, and nearby South Surrey communities often need advance planning."],
        ["Trust proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and Great Canadian Van Lines agent support."],
      ],
      links: [
        ["White Rock Movers", "/white-rock/"],
        ["Surrey Movers", "/surrey/"],
        ["Local Moving", "/local/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Long-Distance Moving", "/long-distance/"],
      ],
      faqs: [
        ["Do you provide local movers in White Rock?", "Yes. Purely Canadian Movers handles local White Rock moves for condos, apartments, detached homes, seniors moves, office moves, and furniture-only moves."],
        ["Can you help with White Rock condo and strata moves?", "Yes. We help plan elevator bookings, loading access, parking, strata requirements, and timing for White Rock condo and apartment moves."],
        ["Do you serve South Surrey and nearby areas?", "Yes. We serve White Rock, South Surrey, Surrey, Delta, Langley, and the wider Lower Mainland."],
        ["How much do White Rock movers cost?", "Local moving cost depends on crew size, truck time, access, stairs, elevators, packing, storage, travel time, and the amount being moved. A written estimate is the best way to price the move accurately."],
        ["Do you use subcontractors for White Rock moves?", "No. Purely Canadian Movers focuses on direct moving accountability and does not subcontract moves."],
      ],
    },
    "/white-rock/": {
      title: "White Rock movers and nearby South Surrey moving services",
      intro:
        "This White Rock hub supports the local moving page and points customers toward the most relevant services for condos, homes, seniors moves, packing, storage, and long-distance relocation.",
      highlights: [
        ["Best next page", "Customers looking for a local household move should visit the local movers in White Rock page for the strongest service match."],
        ["Nearby coverage", "White Rock, South Surrey, Ocean Park, Crescent Beach, Morgan Creek, Surrey, Delta, and Langley."],
        ["Service proof", "Family-owned since 1991, BBB Accredited, no subcontractors, valuation coverage options, and direct moving support."],
      ],
      links: [
        ["Local Movers in White Rock", "/local-movers-white-rock-bc/"],
        ["Surrey Movers", "/surrey/"],
        ["Packing Services", "/packing/"],
        ["Storage Services", "/storage/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Contact for Estimate", "/contact/"],
      ],
      faqs: [
        ["Which White Rock moving page should I use?", "For a local household move, use the local movers in White Rock page. For a broader overview, use this White Rock city hub."],
        ["Can I get packing and storage with my White Rock move?", "Yes. Packing support and storage options can be included with a White Rock moving estimate."],
        ["Do you handle seniors moves in White Rock?", "Yes. Purely Canadian Movers can help with White Rock seniors moves, downsizing, packing, furniture moves, and storage-supported transitions."],
      ],
    },
    "/testimonials/": {
      title: "Customer reviews and trust signals for Metro Vancouver movers",
      intro:
        "Customer feedback is useful, but it should be supported by verifiable trust signals. This page now helps visitors evaluate Purely Canadian Movers through service-area proof, direct accountability, and clear next steps before requesting a moving estimate.",
      highlights: [
        ["How to compare reviews", "Look for details about route, crew communication, access challenges, estimate clarity, pickup timing, delivery, and how issues were handled."],
        ["Service-area proof", "Based in Coquitlam and serving Metro Vancouver, the Lower Mainland, BC, Canada-wide routes, and international moves since 1991."],
        ["Trust proof", "Family-owned, BBB Accredited, no subcontractors, Great Canadian Van Lines agent support, and valuation coverage options for eligible moves."],
      ],
      links: [
        ["Get a Moving Estimate", "/contact/"],
        ["About the Company", "/about/"],
        ["Local Moving", "/local/"],
        ["Long-Distance Moving", "/long-distance/"],
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Valuation Coverage", "/valuation-coverage-protection/"],
        ["Great Canadian Van Lines Agent", "/great-canadian-vanlines-agent/"],
      ],
      faqs: [
        ["Can I use testimonials to choose a mover?", "Yes, but reviews should be one part of the decision. Compare licensing, insurance, valuation coverage, written estimates, direct accountability, service area, and how the company handles communication."],
        ["Why does direct accountability matter when reading moving reviews?", "If a mover uses subcontractors or brokers, the company in the review may not be the same crew handling your move. Purely Canadian Movers focuses on direct accountability and no subcontractors."],
        ["What trust signals should I check before booking movers?", "Look for years in business, BBB accreditation, a real local address, clear contact details, valuation coverage options, written estimates, and service pages that match your move type."],
        ["Do you serve customers outside Coquitlam?", "Yes. Purely Canadian Movers serves Coquitlam, Metro Vancouver, the Lower Mainland, BC, Canada-wide routes, cross-border routes, and international moves."],
        ["Where should I go after reading customer reviews?", "Use the contact page to request a written estimate, or compare the local moving, long-distance moving, packing, storage, and valuation coverage pages for the service that fits your move."],
      ],
    },
  };

  function normalizePath() {
    var path = window.location.pathname || "/";
    if (!path.endsWith("/")) path += "/";
    return path;
  }

  function isCityOrRoutePage(path) {
    return (
      /movers|moving|coquitlam|surrey|burnaby|vancouver|calgary|edmonton|toronto|ottawa|montreal|victoria|winnipeg|halifax|langley|maple-ridge|north-vancouver|new-westminster|white-rock|port-coquitlam/i.test(
        path
      ) && !path.startsWith("/admin/")
    );
  }

  function getConfig(path) {
    if (TARGETS[path]) return TARGETS[path];
    if (isCityOrRoutePage(path)) {
      return {
        eyebrow: "Free moving estimate",
        title: "Get a quote for this moving route.",
        body: "Share your origin, destination, home size, and preferred date so Purely Canadian Movers can help with a realistic estimate.",
      };
    }
    return null;
  }

  function createField(labelText, element) {
    var label = document.createElement("label");
    label.textContent = labelText;
    label.appendChild(element);
    return label;
  }

  function createInput(name, placeholder, type) {
    var input = document.createElement("input");
    input.name = name;
    input.placeholder = placeholder;
    input.type = type || "text";
    return input;
  }

  function cleanEstimateDetails(details) {
    var cleaned = {};
    ["from", "to", "homeSize", "moveDate", "sourcePage", "savedAt"].forEach(function (key) {
      if (details && typeof details[key] === "string" && details[key].trim()) {
        cleaned[key] = details[key].trim();
      }
    });
    return cleaned;
  }

  function hasEstimateDetails(details) {
    return !!(details && (details.from || details.to || details.homeSize || details.moveDate));
  }

  function getEstimateDetailsFromUrl() {
    var params = new URLSearchParams(window.location.search || "");
    return cleanEstimateDetails({
      from: params.get("from") || "",
      to: params.get("to") || "",
      homeSize: params.get("homeSize") || "",
      moveDate: params.get("moveDate") || "",
    });
  }

  function getSavedEstimateDetails() {
    var saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem("pcmEstimateIntent") || "{}");
    } catch (error) {
      saved = {};
    }

    return cleanEstimateDetails(Object.assign({}, saved, getEstimateDetailsFromUrl()));
  }

  function setNativeValue(field, value) {
    if (!field || !value || field.value === value) return false;

    var proto = field.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    if (field.tagName === "SELECT") proto = window.HTMLSelectElement.prototype;
    var descriptor = Object.getOwnPropertyDescriptor(proto, "value");

    if (descriptor && descriptor.set) {
      descriptor.set.call(field, value);
    } else {
      field.value = value;
    }

    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function labelTextFor(field) {
    var parts = [field.name, field.id, field.placeholder, field.getAttribute("aria-label")];
    var label = field.closest("label");
    if (label) parts.push(label.textContent);
    if (field.id) {
      var explicit = document.querySelector('label[for="' + CSS.escape(field.id) + '"]');
      if (explicit) parts.push(explicit.textContent);
    }
    return parts.filter(Boolean).join(" ").toLowerCase();
  }

  function findContactField(patterns, tagName) {
    var selector = tagName || "input, textarea, select";
    return Array.prototype.find.call(document.querySelectorAll(selector), function (field) {
      if (field.type === "hidden" || field.disabled || field.readOnly) return false;
      var text = labelTextFor(field);
      return patterns.some(function (pattern) {
        return pattern.test(text);
      });
    });
  }

  function estimateDetailsText(details) {
    return [
      details.from && "Moving from: " + details.from,
      details.to && "Moving to: " + details.to,
      details.homeSize && "Home size: " + details.homeSize,
      details.moveDate && "Move date: " + details.moveDate,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function prefillContactForm(details) {
    if (normalizePath() !== "/contact/" || !hasEstimateDetails(details)) return false;

    var changed = false;
    var fromField = findContactField([/\bfrom\b/, /moving from/, /origin/, /pickup/, /current address/], "input, textarea");
    var toField = findContactField([/\bto\b/, /moving to/, /destination/, /delivery/, /new address/], "input, textarea");
    var sizeField = findContactField([/home size/, /move size/, /shipment size/, /\bsize\b/, /bedroom/]);
    var dateField = findContactField([/move date/, /moving date/, /preferred date/, /\bdate\b/], "input");
    var messageField = findContactField([/message/, /comments?/, /details?/, /notes?/, /tell us/], "textarea");

    changed = setNativeValue(fromField, details.from) || changed;
    changed = setNativeValue(toField, details.to) || changed;
    changed = setNativeValue(sizeField, details.homeSize) || changed;
    changed = setNativeValue(dateField, details.moveDate) || changed;

    if (messageField) {
      var summaryText = estimateDetailsText(details);
      if (summaryText && !messageField.value.includes(summaryText)) {
        var nextValue = messageField.value ? messageField.value + "\n\n" + summaryText : summaryText;
        changed = setNativeValue(messageField, nextValue) || changed;
      }
    }

    var form = (fromField || toField || sizeField || dateField || messageField || document.querySelector("form"))?.closest("form") || document.querySelector("form");
    if (form && !form.querySelector('input[name="estimateDetails"]')) {
      var hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "estimateDetails";
      hidden.value = estimateDetailsText(details);
      form.appendChild(hidden);
      changed = true;
    }

    return changed;
  }

  function createSizeSelect() {
    var select = document.createElement("select");
    select.name = "homeSize";
    [
      ["", "Select size"],
      ["Studio / small apartment", "Studio / small apartment"],
      ["1 bedroom", "1 bedroom"],
      ["2 bedroom", "2 bedroom"],
      ["3 bedroom", "3 bedroom"],
      ["4+ bedroom", "4+ bedroom"],
      ["Office / commercial", "Office / commercial"],
    ].forEach(function (optionData) {
      var option = document.createElement("option");
      option.value = optionData[0];
      option.textContent = optionData[1];
      select.appendChild(option);
    });
    return select;
  }

  function saveEstimateIntent(form) {
    var data = new FormData(form);
    var details = cleanEstimateDetails({
      from: data.get("from") || "",
      to: data.get("to") || "",
      homeSize: data.get("homeSize") || "",
      moveDate: data.get("moveDate") || "",
      sourcePage: window.location.pathname,
      savedAt: new Date().toISOString(),
    });
    try {
      sessionStorage.setItem("pcmEstimateIntent", JSON.stringify(details));
    } catch (error) {
      // Ignore storage errors; the contact page remains available.
    }
  }

  function removeBlankEstimateFields(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, select"), function (field) {
      if (!field.value || !field.value.trim()) {
        field.disabled = true;
      }
    });
  }

  function createLeadPanel(config) {
    var section = document.createElement("section");
    section.className = "pcm-lead-boost pcm-lead-panel";
    section.setAttribute("aria-label", "Free moving estimate");

    section.innerHTML =
      '<div class="pcm-lead-panel__inner">' +
      '<div>' +
      '<div class="pcm-lead-panel__eyebrow"></div>' +
      "<h2></h2>" +
      "<p></p>" +
      '<div class="pcm-trust-row">' +
      "<span>Family-owned since 1991</span>" +
      "<span>BBB Accredited</span>" +
      "<span>No subcontractors</span>" +
      "<span>Canada-wide moving</span>" +
      "</div>" +
      "</div>" +
      '<form class="pcm-estimate-form" action="' +
      CONTACT_URL +
      '" method="get">' +
      "</form>" +
      "</div>";

    section.querySelector(".pcm-lead-panel__eyebrow").textContent = config.eyebrow;
    section.querySelector("h2").textContent = config.title;
    section.querySelector("p").textContent = config.body;

    var form = section.querySelector("form");
    form.appendChild(createField("Moving from", createInput("from", "Toronto, ON")));
    form.appendChild(createField("Moving to", createInput("to", "Calgary, AB")));
    form.appendChild(createField("Home size", createSizeSelect()));
    form.appendChild(createField("Move date", createInput("moveDate", "", "date")));

    var buttonRow = document.createElement("div");
    buttonRow.className = "pcm-button-row";
    buttonRow.innerHTML =
      '<button class="pcm-primary-button" type="submit">Continue Estimate</button>' +
      '<a class="pcm-secondary-button" href="' +
      PHONE_LINK +
      '">Call ' +
      PHONE_DISPLAY +
      "</a>";
    form.appendChild(buttonRow);

    form.addEventListener("submit", function () {
      saveEstimateIntent(form);
      removeBlankEstimateFields(form);
    });

    return section;
  }

  function createStickyCta() {
    if (document.querySelector(".pcm-sticky-cta")) return;
    var bar = document.createElement("div");
    bar.className = "pcm-lead-boost pcm-sticky-cta";
    bar.innerHTML =
      '<a class="pcm-primary-button" href="' +
      CONTACT_URL +
      '">Get Estimate</a>' +
      '<a class="pcm-secondary-button" href="' +
      PHONE_LINK +
      '">Call</a>';
    document.body.appendChild(bar);
  }

  function createBrokerComparison() {
    var section = document.createElement("section");
    section.className = "pcm-lead-boost pcm-broker-compare";
    section.setAttribute("aria-label", "Direct mover versus broker comparison");
    section.innerHTML =
      '<div class="pcm-broker-compare__inner">' +
      "<h2>Direct Toronto to Calgary mover, not a moving broker</h2>" +
      "<p>For a long-distance move from Ontario to Alberta, who handles your shipment matters. Purely Canadian Movers gives you direct accountability from estimate to delivery.</p>" +
      '<div class="pcm-compare-grid">' +
      '<div class="pcm-compare-column">' +
      "<h3>Purely Canadian Movers</h3>" +
      "<ul>" +
      "<li>Direct moving team with no subcontractors</li>" +
      "<li>Family-owned since 1991</li>" +
      "<li>Agents of Great Canadian Van Lines</li>" +
      "<li>Clear estimate process and route-specific planning</li>" +
      "</ul>" +
      "</div>" +
      '<div class="pcm-compare-column">' +
      "<h3>Typical moving broker</h3>" +
      "<ul>" +
      "<li>May sell the job to another carrier</li>" +
      "<li>Pickup and delivery crews may change</li>" +
      "<li>Accountability can be split between companies</li>" +
      "<li>Low upfront quotes can turn into added charges</li>" +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</div>";
    return section;
  }

  function createLocalSeoBlock(config, path) {
    var section = document.createElement("section");
    section.className = "pcm-lead-boost pcm-local-seo";
    section.setAttribute("aria-label", config.title);

    section.innerHTML =
      '<div class="pcm-local-seo__inner">' +
      "<h2></h2>" +
      "<p></p>" +
      '<div class="pcm-local-seo__cards"></div>' +
      '<div class="pcm-local-seo__links"><h2>Related moving services</h2><div></div></div>' +
      '<div class="pcm-local-seo__faqs"><h2>Frequently asked questions</h2></div>' +
      "</div>";

    section.querySelector("h2").textContent = config.title;
    section.querySelector("p").textContent = config.intro;

    var cards = section.querySelector(".pcm-local-seo__cards");
    config.highlights.forEach(function (item) {
      var card = document.createElement("article");
      card.innerHTML = "<h3></h3><p></p>";
      card.querySelector("h3").textContent = item[0];
      card.querySelector("p").textContent = item[1];
      cards.appendChild(card);
    });

    var links = section.querySelector(".pcm-local-seo__links div");
    config.links.forEach(function (item) {
      var link = document.createElement("a");
      link.href = item[1];
      link.textContent = item[0];
      links.appendChild(link);
    });

    var faqs = section.querySelector(".pcm-local-seo__faqs");
    config.faqs.forEach(function (item) {
      var detail = document.createElement("details");
      detail.innerHTML = "<summary></summary><p></p>";
      detail.querySelector("summary").textContent = item[0];
      detail.querySelector("p").textContent = item[1];
      faqs.appendChild(detail);
    });

    addFaqSchema(config, path);
    addServiceSchema(config, path);
    return section;
  }

  function addFaqSchema(config, path) {
    if (document.querySelector('script[data-pcm-faq-schema="' + path + '"]')) return;
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-pcm-faq-schema", path);
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map(function (item) {
        return {
          "@type": "Question",
          name: item[0],
          acceptedAnswer: {
            "@type": "Answer",
            text: item[1],
          },
        };
      }),
    });
    document.head.appendChild(script);
  }

  function addServiceSchema(config, path) {
    if (document.querySelector('script[data-pcm-service-schema="' + path + '"]')) return;
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-pcm-service-schema", path);
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: config.title,
      serviceType: config.title,
      url: "https://purelycanadianmovers.com" + path,
      description: config.intro,
      provider: {
        "@type": "MovingCompany",
        name: "Purely Canadian Movers",
        telephone: "+1-877-485-6683",
        url: "https://purelycanadianmovers.com/",
      },
      areaServed: [
        {
          "@type": "AdministrativeArea",
          name: "British Columbia",
        },
        {
          "@type": "Country",
          name: "Canada",
        },
      ],
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://purelycanadianmovers.com/contact/",
        servicePhone: "+1-877-485-6683",
      },
    });
    document.head.appendChild(script);
  }

  function cleanupTitle(title) {
    if (!title) return "";
    return title
      .replace(/\s*\|\s*Purely Canadian Movers\s*\|\s*Purely Canadian Movers\s*$/i, " | Purely Canadian Movers")
      .replace(/^Purely Canadian Movers\s*\|\s*Professional Moving Company Vancouver BC Since 1991$/i, "Vancouver Movers | Local & Long-Distance Moving")
      .replace(/\s+/g, " ")
      .trim();
  }

  function applyTitleOverride(path) {
    var title = TITLE_OVERRIDES[path] || cleanupTitle(document.title);
    var description = META_DESCRIPTION_OVERRIDES[path];
    if (title === document.title) title = "";
    if (!title && !description) return;

    if (title) document.title = title;
    if (description) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", description);
      var ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute("content", description);
      var twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) twitterDescription.setAttribute("content", description);
    }
    setTimeout(function () {
      if (title) document.title = title;
      if (description) {
        var delayedMeta = document.querySelector('meta[name="description"]');
        if (delayedMeta) delayedMeta.setAttribute("content", description);
      }
    }, 800);
    if (title) {
      var attempts = 0;
      var titleTimer = window.setInterval(function () {
        attempts += 1;
        document.title = title;
        if (attempts >= 8) window.clearInterval(titleTimer);
      }, 500);
    }
  }

  function createTrustProofBlock(config) {
    var section = document.createElement("section");
    section.className = "pcm-lead-boost pcm-trust-proof";
    section.innerHTML =
      '<div class="pcm-trust-proof__inner">' +
      "<h2></h2>" +
      "<p></p>" +
      '<div class="pcm-trust-proof__grid"></div>' +
      '<div class="pcm-trust-proof__links"><h3>Estimate support and related resources</h3><div></div></div>' +
      "</div>";

    section.querySelector("h2").textContent = config.title;
    section.querySelector("p").textContent = config.intro;

    var grid = section.querySelector(".pcm-trust-proof__grid");
    config.proof.forEach(function (item) {
      var article = document.createElement("article");
      article.innerHTML = "<h3></h3><p></p>";
      article.querySelector("h3").textContent = item[0];
      article.querySelector("p").textContent = item[1];
      grid.appendChild(article);
    });

    var links = section.querySelector(".pcm-trust-proof__links div");
    config.links.forEach(function (item) {
      var link = document.createElement("a");
      link.href = item[1];
      link.textContent = item[0];
      links.appendChild(link);
    });

    return section;
  }

  function pricingSummaryText() {
    return [
      "Long-Distance Moving Cost Summary (CAD)",
      "Route | Small Move | 1-2 Bedroom | 3+ Bedroom | Typical Transit",
    ]
      .concat(
        PRICING_SUMMARY_ROWS.map(function (row) {
          return row.join(" | ");
        })
      )
      .concat(["Prices are estimates in CAD. Final cost depends on shipment weight or volume, route distance, access, stairs, elevators, season, packing, storage, and specialty items."])
      .join("\n");
  }

  function pricingSummaryCsv() {
    return ["Route,Small Move,1-2 Bedroom,3+ Bedroom,Typical Transit"]
      .concat(
        PRICING_SUMMARY_ROWS.map(function (row) {
          return row
            .map(function (cell) {
              return '"' + String(cell).replace(/"/g, '""') + '"';
            })
            .join(",");
        })
      )
      .join("\n");
  }

  function createPricingSummaryBlock() {
    var section = document.createElement("section");
    section.className = "pcm-lead-boost pcm-pricing-summary";
    section.setAttribute("aria-label", "Downloadable long-distance moving cost summary");
    section.innerHTML =
      '<div class="pcm-pricing-summary__inner">' +
      '<div class="pcm-pricing-summary__header">' +
      '<div><div class="pcm-pricing-summary__eyebrow">Copy-friendly pricing summary</div><h2>Long-distance moving cost summary</h2><p>Use this quick table to compare common Canadian moving routes. Copy it for planning or download it as a CSV.</p></div>' +
      '<div class="pcm-pricing-summary__actions"><button type="button" data-action="copy">Copy summary</button><button type="button" data-action="csv">Download CSV</button></div>' +
      "</div>" +
      '<div class="pcm-pricing-summary__table-wrap"><table><thead><tr><th>Route</th><th>Small move</th><th>1-2 bedroom</th><th>3+ bedroom</th><th>Typical transit</th></tr></thead><tbody></tbody></table></div>' +
      '<p class="pcm-pricing-summary__note">Prices are estimates in CAD. Final cost depends on shipment weight or volume, route distance, access, stairs, elevators, season, packing, storage, and specialty items.</p>' +
      "</div>";

    var body = section.querySelector("tbody");
    PRICING_SUMMARY_ROWS.forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (cell) {
        var td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    var copyButton = section.querySelector('[data-action="copy"]');
    copyButton.addEventListener("click", function () {
      navigator.clipboard.writeText(pricingSummaryText()).then(
        function () {
          copyButton.textContent = "Copied";
          window.setTimeout(function () {
            copyButton.textContent = "Copy summary";
          }, 1800);
        },
        function () {
          copyButton.textContent = "Copy failed";
          window.setTimeout(function () {
            copyButton.textContent = "Copy summary";
          }, 1800);
        }
      );
    });

    section.querySelector('[data-action="csv"]').addEventListener("click", function () {
      var blob = new Blob([pricingSummaryCsv()], { type: "text/csv;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "purely-canadian-movers-long-distance-cost-summary.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });

    return section;
  }

  function insertPricingSummaryBlock(path) {
    if (path !== "/long-distance-moving-cost-canada/" || document.querySelector(".pcm-pricing-summary")) {
      return;
    }

    var leadPanel = document.querySelector(".pcm-lead-panel");
    if (!leadPanel || !leadPanel.parentNode) return;

    leadPanel.parentNode.insertBefore(createPricingSummaryBlock(), leadPanel.nextSibling);
  }

  function insertTrustProofBlock(path) {
    var config = TRUST_PROOF_BLOCKS[path];
    if (!config || document.querySelector(".pcm-trust-proof")) return;

    var leadPanel = document.querySelector(".pcm-lead-panel");
    var root = document.getElementById("root");
    var anchor = leadPanel || (root && root.querySelector("section"));
    if (!anchor || !anchor.parentNode) return;

    anchor.parentNode.insertBefore(createTrustProofBlock(config), anchor.nextSibling);
  }

  function insertLocalSeoBlock(path) {
    var config = LOCAL_SEO_BLOCKS[path];
    if (!config || document.querySelector(".pcm-local-seo")) return;
    var leadPanel = document.querySelector(".pcm-lead-panel");
    if (!leadPanel || !leadPanel.parentNode) return;
    leadPanel.parentNode.insertBefore(createLocalSeoBlock(config, path), leadPanel.nextSibling);
  }

  function insertBrokerComparison(path) {
    if (path !== "/toronto-to-calgary-movers/" || document.querySelector(".pcm-broker-compare")) {
      return;
    }

    var leadPanel = document.querySelector(".pcm-lead-panel");
    if (!leadPanel || !leadPanel.parentNode) return;

    leadPanel.parentNode.insertBefore(createBrokerComparison(), leadPanel.nextSibling);
  }

  function insertLeadPanel(config) {
    if (document.querySelector(".pcm-lead-panel")) return true;
    var root = document.getElementById("root");
    if (!root || !root.children.length) return false;

    var panel = createLeadPanel(config);
    var hero = root.querySelector("section");
    if (hero && hero.parentNode) {
      hero.parentNode.insertBefore(panel, hero.nextSibling);
    } else {
      root.insertBefore(panel, root.firstChild);
    }
    insertLocalSeoBlock(normalizePath());
    insertPricingSummaryBlock(normalizePath());
    insertTrustProofBlock(normalizePath());
    insertBrokerComparison(normalizePath());
    return true;
  }

  function enhanceFooterAddress() {
    if (document.querySelector(".pcm-footer-map-link")) return true;

    var addressSpan = Array.prototype.find.call(document.querySelectorAll("footer span"), function (span) {
      return /91\s+Golden\s+Dr/i.test(span.textContent || "");
    });

    if (!addressSpan) return false;

    var link = document.createElement("a");
    link.className = "pcm-footer-map-link";
    link.href = GOOGLE_MAPS_ADDRESS_URL;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Open Purely Canadian Movers address in Google Maps");
    link.innerHTML = "Unit 16-91 Golden Dr.<br>Coquitlam, BC V3K 6R2";

    addressSpan.textContent = "";
    addressSpan.appendChild(link);
    return true;
  }

  function showContactSummary() {
    if (normalizePath() !== "/contact/") return;
    var details = getSavedEstimateDetails();
    if (!hasEstimateDetails(details)) return;

    try {
      if (!document.querySelector(".pcm-contact-summary")) {
        var summary = document.createElement("div");
        summary.className = "pcm-contact-summary";
        summary.innerHTML =
          "<strong>Estimate details saved</strong>" +
          "<div>" +
          [details.from && "From: " + details.from, details.to && "To: " + details.to, details.homeSize && "Size: " + details.homeSize, details.moveDate && "Date: " + details.moveDate]
            .filter(Boolean)
            .join(" | ") +
          "</div>";

        var root = document.getElementById("root");
        if (root && root.firstChild) root.insertBefore(summary, root.firstChild);
      }

      prefillContactForm(details);
    } catch (error) {
      // Ignore malformed saved data.
    }
  }

  function init() {
    var path = normalizePath();
    var config = getConfig(path);
    applyTitleOverride(path);

    var footerAttempts = 0;
    var footerTimer = window.setInterval(function () {
      footerAttempts += 1;
      if (enhanceFooterAddress() || footerAttempts > 30) {
        window.clearInterval(footerTimer);
      }
    }, 250);

    if (!config) {
      if (path === "/contact/") {
        var contactAttempts = 0;
        var contactTimer = window.setInterval(function () {
          contactAttempts += 1;
          showContactSummary();
          if (contactAttempts > 30) {
            window.clearInterval(contactTimer);
          }
        }, 250);
      } else {
        showContactSummary();
      }
      return;
    }

    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (insertLeadPanel(config) || attempts > 30) {
        window.clearInterval(timer);
      }
    }, 250);

    createStickyCta();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
