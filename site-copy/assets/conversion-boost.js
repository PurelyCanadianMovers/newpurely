(function () {
  var PHONE_DISPLAY = "1-877-485-6683";
  var PHONE_LINK = "tel:18774856683";
  var CONTACT_URL = "/contact/";
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
    "/north-vancouver/": {
      eyebrow: "North Vancouver movers",
      title: "Plan your North Vancouver move with a Metro Vancouver moving team.",
      body: "Get help with North Vancouver local moves, condo towers, apartment moves, packing, storage, office moving, and long-distance relocation.",
    },
    "/port-moody/": {
      eyebrow: "Port Moody movers",
      title: "Plan your Port Moody move with a Tri-Cities moving team.",
      body: "Get help with Port Moody apartments, condos, townhomes, packing, storage, office moves, and long-distance relocation.",
    },
  };

  var TITLE_OVERRIDES = {
    "/long-distance-moving-cost-canada/": "Long-Distance Moving Costs in Canada | Pricing Guide",
    "/long-distance/": "Long-Distance Movers Across Canada | Cross-Canada Moving",
    "/toronto-to-calgary-movers/": "Toronto to Calgary Movers | Costs, Transit & Quotes",
    "/toronto-long-distance-movers/": "Toronto Long-Distance Movers | Cross-Canada Moving",
    "/vancouver-long-distance-movers/": "Vancouver Long-Distance Movers | Cross-Canada Moving",
    "/calgary-long-distance-movers/": "Calgary Long-Distance Movers | Cross-Canada Moving",
    "/port-moody/": "Port Moody Movers | Local Moving Company in Port Moody BC",
  };

  var META_DESCRIPTION_OVERRIDES = {
    "/port-moody/":
      "Port Moody movers for apartments, condos, townhomes, packing, storage, and long-distance moves. Family-owned since 1991, BBB Accredited, no subcontractors.",
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
        "Coquitlam is a core service area for Purely Canadian Movers. This page reinforces the local moving cluster for Coquitlam, Port Coquitlam, Port Moody, Burnaby, New Westminster, and nearby Metro Vancouver communities.",
      highlights: [
        ["Coquitlam move types", "Apartment moves, condo moves, detached homes, seniors moves, furniture moves, packing help, and short-notice local relocations."],
        ["Tri-Cities coverage", "Coquitlam, Port Coquitlam, Port Moody, Burke Mountain, Maillardville, Austin Heights, and nearby Lower Mainland areas."],
        ["Why this matters", "These are core local-money keywords, so the page needs clear Coquitlam language, service proof, internal links, FAQs, and trust signals."],
      ],
      links: [
        ["Coquitlam Movers", "/coquitlam-bc/"],
        ["Packing in Coquitlam", "/packing-service-in-coquitlam-bc/"],
        ["Office Movers Coquitlam", "/office-movers-coquitlam-bc/"],
        ["Corporate Relocation Coquitlam", "/corporate-moves-employee-relocation-in-coquitlam-bc/"],
        ["Port Moody Movers", "/local-movers-port-moody-bc/"],
        ["New Westminster Movers", "/local-movers-new-westminster-bc/"],
      ],
      faqs: [
        ["Do you provide local movers in Coquitlam?", "Yes. Purely Canadian Movers provides local moving services in Coquitlam for apartments, condos, houses, furniture moves, offices, and packing-supported moves."],
        ["What areas near Coquitlam do you serve?", "We serve Coquitlam, Port Coquitlam, Port Moody, Burnaby, New Westminster, Surrey, Vancouver, and the wider Lower Mainland."],
        ["How much does a local move in Coquitlam cost?", "The cost depends on the size of the move, crew size, access, elevators, stairs, packing, storage, and travel time. Request an estimate for a specific Coquitlam moving quote."],
        ["Are you a direct moving company or a broker?", "Purely Canadian Movers is a direct moving company with no subcontractors, giving customers one accountable team from estimate to moving day."],
      ],
    },
    "/coquitlam-bc/": {
      title: "Coquitlam moving company for local, packing, office, and long-distance moves",
      intro:
        "This Coquitlam hub connects the local moving, packing, office moving, corporate relocation, and long-distance services that matter most for Coquitlam searches.",
      highlights: [
        ["Local base", "Purely Canadian Movers is based in Coquitlam and has served Metro Vancouver since 1991."],
        ["Service cluster", "Local moves, packing, storage, office moves, corporate relocations, cross-border moves, and long-distance moving."],
        ["Nearby coverage", "Port Coquitlam, Port Moody, Burnaby, New Westminster, Surrey, Langley, Maple Ridge, and Vancouver."],
      ],
      links: [
        ["Local Movers in Coquitlam", "/local-movers-in-coquitlam-bc/"],
        ["Packing Service in Coquitlam", "/packing-service-in-coquitlam-bc/"],
        ["Office Movers Coquitlam", "/office-movers-coquitlam-bc/"],
        ["Corporate Moves Coquitlam", "/corporate-moves-employee-relocation-in-coquitlam-bc/"],
        ["Storage", "/storage/"],
        ["Long-Distance Moving", "/long-distance/"],
      ],
      faqs: [
        ["Is Purely Canadian Movers based in Coquitlam?", "Yes. Purely Canadian Movers is based in Coquitlam and serves Metro Vancouver, the Lower Mainland, BC, Canada, and international routes."],
        ["What moving services do you offer in Coquitlam?", "Services include local moving, long-distance moving, packing, storage, office moving, corporate relocation, cross-border moving, and valuation coverage options."],
        ["Do you serve Port Coquitlam and Port Moody?", "Yes. The Coquitlam team also serves Port Coquitlam, Port Moody, Burnaby, New Westminster, Surrey, Langley, Maple Ridge, and surrounding areas."],
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
  };

  function normalizePath() {
    var path = window.location.pathname || "/";
    if (!path.endsWith("/")) path += "/";
    return path;
  }

  function isCityOrRoutePage(path) {
    return (
      /movers|moving|coquitlam|surrey|burnaby|vancouver|calgary|edmonton|toronto|ottawa|montreal|victoria|winnipeg|halifax|langley|maple-ridge|north-vancouver|new-westminster/i.test(
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
      '<div class="pcm-local-seo__links"><h3>Related moving services</h3><div></div></div>' +
      '<div class="pcm-local-seo__faqs"><h3>Local moving questions</h3></div>' +
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

  function applyTitleOverride(path) {
    var title = TITLE_OVERRIDES[path];
    var description = META_DESCRIPTION_OVERRIDES[path];
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
