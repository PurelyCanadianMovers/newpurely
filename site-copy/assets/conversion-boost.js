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
  };

  var TITLE_OVERRIDES = {
    "/long-distance-moving-cost-canada/": "Long-Distance Moving Costs in Canada | Pricing Guide",
    "/long-distance/": "Long-Distance Movers Across Canada | Cross-Canada Moving",
    "/toronto-to-calgary-movers/": "Toronto to Calgary Movers | Costs, Transit & Quotes",
    "/toronto-long-distance-movers/": "Toronto Long-Distance Movers | Cross-Canada Moving",
    "/vancouver-long-distance-movers/": "Vancouver Long-Distance Movers | Cross-Canada Moving",
    "/calgary-long-distance-movers/": "Calgary Long-Distance Movers | Cross-Canada Moving",
  };

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
    var details = {
      from: data.get("from") || "",
      to: data.get("to") || "",
      homeSize: data.get("homeSize") || "",
      moveDate: data.get("moveDate") || "",
      sourcePage: window.location.pathname,
      savedAt: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem("pcmEstimateIntent", JSON.stringify(details));
    } catch (error) {
      // Ignore storage errors; the contact page remains available.
    }
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
      '<button class="pcm-primary-button" type="submit">Start Free Estimate</button>' +
      '<a class="pcm-secondary-button" href="' +
      PHONE_LINK +
      '">Call ' +
      PHONE_DISPLAY +
      "</a>";
    form.appendChild(buttonRow);

    form.addEventListener("submit", function () {
      saveEstimateIntent(form);
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
    if (!title) return;

    document.title = title;
    setTimeout(function () {
      document.title = title;
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
    insertTrustProofBlock(normalizePath());
    insertBrokerComparison(normalizePath());
    return true;
  }

  function showContactSummary() {
    if (normalizePath() !== "/contact/") return;
    var raw = null;
    try {
      raw = sessionStorage.getItem("pcmEstimateIntent");
    } catch (error) {
      return;
    }
    if (!raw || document.querySelector(".pcm-contact-summary")) return;

    try {
      var details = JSON.parse(raw);
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
    } catch (error) {
      // Ignore malformed saved data.
    }
  }

  function init() {
    var path = normalizePath();
    var config = getConfig(path);
    applyTitleOverride(path);

    if (!config) {
      showContactSummary();
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
