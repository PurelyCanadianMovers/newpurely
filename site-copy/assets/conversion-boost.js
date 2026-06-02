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
