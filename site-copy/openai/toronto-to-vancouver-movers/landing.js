(function () {
  "use strict";

  var form = document.getElementById("estimate-form");
  var status = document.getElementById("form-status");
  var menuButton = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-links");
  var attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "route", "from", "to", "move_type", "offer", "oppref"];
  var storageKey = "pcmOpenAiTorontoVancouverAttribution";

  function readAttribution() {
    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(storageKey) || "{}"); } catch (_) {}
    var params = new URLSearchParams(window.location.search);
    attributionKeys.forEach(function (key) {
      var value = params.get(key);
      if (value) saved[key] = value;
    });
    saved.source = "openai";
    saved.campaign = "toronto-to-vancouver";
    saved.offer = "chatgpt-min100";
    saved.route = "toronto-to-vancouver";
    saved.landing_page = "openai-toronto-vancouver";
    try { sessionStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) {}
    return saved;
  }

  var attribution = readAttribution();

  function prefillRouteFields() {
    if (!form) return;
    var from = new URLSearchParams(window.location.search).get("from");
    var to = new URLSearchParams(window.location.search).get("to");
    if (from) form.elements.movingFrom.value = from;
    if (to) form.elements.movingTo.value = to;
  }

  function preserveCampaignLinks() {
    var campaign = new URLSearchParams();
    attributionKeys.forEach(function (key) {
      if (attribution[key]) campaign.set(key, attribution[key]);
    });
    document.querySelectorAll('a[href^="/"]').forEach(function (link) {
      if (link.getAttribute("href").charAt(0) === "#") return;
      var url = new URL(link.href, window.location.origin);
      campaign.forEach(function (value, key) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      });
      link.href = url.pathname + url.search + url.hash;
    });
  }

  function attributionText() {
    var ordered = {
      source: "openai",
      campaign: "toronto-to-vancouver",
      offer: "chatgpt-min100",
      route: "toronto-to-vancouver",
      landing_page: "openai-toronto-vancouver"
    };
    attributionKeys.forEach(function (key) {
      if (attribution[key]) ordered[key] = attribution[key];
    });
    return Object.keys(ordered).map(function (key) { return key + ": " + ordered[key]; }).join("\n");
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") !== "true";
      menu.setAttribute("data-open", String(open));
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      status.textContent = "";
      status.removeAttribute("data-state");
      if (!form.reportValidity()) return;

      var button = form.querySelector('button[type="submit"]');
      var data = new FormData(form);
      var customerDetails = String(data.get("details") || "").trim();
      var payload = {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        moveType: String(data.get("moveType") || "Cross-Country"),
        homeSize: String(data.get("homeSize") || ""),
        movingFrom: String(data.get("movingFrom") || "Toronto, ON"),
        movingTo: String(data.get("movingTo") || "Vancouver, BC"),
        moveDate: String(data.get("moveDate") || ""),
        details: (customerDetails ? customerDetails + "\n\n" : "") + "[Landing page attribution]\n" + attributionText()
      };

      button.disabled = true;
      button.textContent = "Sending…";
      status.textContent = "Submitting your estimate request…";

      try {
        var response = await fetch("/api/trpc/contact.submit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ json: payload })
        });
        if (!response.ok) throw new Error("Request failed");
        status.setAttribute("data-state", "success");
        status.textContent = "Thank you. Your estimate request and promotional discount have been received. We’ll be in touch within one business day.";
        form.reset();
        form.elements.movingFrom.value = "Toronto, ON";
        form.elements.movingTo.value = "Vancouver, BC";
        button.textContent = "Estimate Request Sent";
      } catch (_) {
        status.setAttribute("data-state", "error");
        status.innerHTML = 'We could not send your request. Please call <a href="tel:18774856683">1-877-485-6683</a> or try again.';
        button.disabled = false;
        button.textContent = "Get My Free Estimate & Save $100+";
      }
    });
  }

  prefillRouteFields();
  preserveCampaignLinks();
}());
