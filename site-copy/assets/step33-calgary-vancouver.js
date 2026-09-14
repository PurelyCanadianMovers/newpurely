(function () {
  "use strict";

  var configs = {
    "/calgary-to-vancouver-movers/": {
      origin: "Calgary",
      originValue: "Calgary, AB",
      destination: "Vancouver",
      destinationValue: "Vancouver, BC",
      routeLabel: "Calgary to Vancouver",
      pairLabel: "Calgary–Vancouver",
      range: "$1,800–$13,000+",
    },
    "/vancouver-to-calgary-movers/": {
      origin: "Vancouver",
      originValue: "Vancouver, BC",
      destination: "Calgary",
      destinationValue: "Calgary, AB",
      routeLabel: "Vancouver to Calgary",
      pairLabel: "Vancouver–Calgary",
      range: "$1,800–$14,000+",
    },
  };
  var config = configs[window.location.pathname];
  if (!config) return;

  var rows = [
    ["Studio", "$2,000+", "Typical 1,000–2,500 lb shipment", "4–13 days"],
    ["1-bedroom", "$2,600+", "Typical 2,500–4,500 lb shipment", "4–13 days"],
    ["2-bedroom", "$3,500+", "Typical 4,500–7,500 lb shipment", "4–13 days"],
    ["3-bedroom", "$4,800+", "Typical 7,500–12,000 lb shipment", "4–13 days"],
    ["4+ bedroom", "$6,500+", "Typical shipment of 12,000+ lb", "4–13 days"],
  ];
  var applying = false;

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function setText(element, value) {
    if (element && normalize(element.textContent) !== value) element.textContent = value;
  }

  function sectionByHeading(pattern) {
    return Array.prototype.find.call(document.querySelectorAll("main section"), function (section) {
      var heading = section.querySelector("h1,h2,h3");
      return heading && pattern.test(normalize(heading.textContent));
    });
  }

  function pricingMarkup() {
    var body = rows.map(function (row) {
      return "<tr>" + row.map(function (cell) { return "<td>" + cell + "</td>"; }).join("") + "</tr>";
    }).join("");
    return '<section class="pcm-lead-boost pcm-route-cost pcm-step33-pricing" aria-label="' + config.routeLabel + ' moving cost estimates">' +
      '<div class="pcm-route-cost__inner">' +
      '<div class="pcm-route-cost__eyebrow">' + config.routeLabel + ' moving cost</div>' +
      '<h2>How much does it cost to move from ' + config.origin + ' to ' + config.destination + '?</h2>' +
      '<p>A ' + config.routeLabel + ' move typically falls within an overall planning range of <strong>' + config.range + '</strong>. Shipment size, actual weight or volume, access, packing, storage, season, and protection choices affect the final written estimate.</p>' +
      '<div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<p class="pcm-route-cost__note">These figures are planning ranges, not guaranteed quotes. Final pricing depends on shipment weight or volume, access, packing, storage, season, and the selected Declared Value Protection option.</p>' +
      '<div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Long-Distance Moving Cost Guide</a><a href="/valuation-coverage-protection/">Declared Value Protection</a></div>' +
      '</div></section>';
  }

  function glanceMarkup() {
    return '<div class="pcm-step33-glance">' +
      '<h3>' + config.pairLabel + ' Route at a Glance</h3>' +
      '<div class="pcm-step33-glance__grid">' +
      '<div><span class="pcm-step33-glance__icon" aria-hidden="true">↔</span><p><small>Distance</small><strong>~1,000 km</strong><em>' + config.routeLabel + '</em></p></div>' +
      '<div><span class="pcm-step33-glance__icon" aria-hidden="true">◷</span><p><small>Estimated transit time</small><strong>4–13 days</strong><em>Depending on shipment size</em></p></div>' +
      '<div><span class="pcm-step33-glance__icon" aria-hidden="true">$</span><p><small>Typical cost range</small><strong>' + config.range + '</strong><em>Studio to 4+ bedroom home</em></p></div>' +
      '</div></div>';
  }

  function apply() {
    if (applying) return;
    applying = true;
    try {
      var h1 = document.querySelector("h1");
      var root = document.getElementById("root");
      var app = root && root.querySelector(".min-h-screen.flex.flex-col");
      var quote = root && root.querySelector(".pcm-lead-panel");
      if (!h1 || normalize(h1.textContent) !== config.routeLabel + " Movers" || !app || !quote) return;

      document.documentElement.classList.add("pcm-step33-calgary-vancouver");
      document.documentElement.setAttribute("data-pcm-step33-route", window.location.pathname);

      quote.setAttribute("aria-label", config.routeLabel + " free moving estimate");
      var quoteEyebrow = quote.querySelector(".pcm-lead-panel__eyebrow");
      var quoteHeading = quote.querySelector("h2");
      var quoteIntro = quote.querySelector("h2 + p");
      setText(quoteEyebrow, config.routeLabel + " estimate");
      setText(quoteHeading, "Request a " + config.routeLabel + " moving quote");
      setText(quoteIntro, "Share your home size, preferred date, and access details so Purely Canadian Movers can prepare a realistic written estimate for this route.");
      var from = quote.querySelector('[name="from"]');
      var to = quote.querySelector('[name="to"]');
      if (from) {
        if (from.value !== config.originValue) from.value = config.originValue;
        if (from.getAttribute("value") !== config.originValue) from.setAttribute("value", config.originValue);
        if (from.placeholder !== config.originValue) from.placeholder = config.originValue;
      }
      if (to) {
        if (to.value !== config.destinationValue) to.value = config.destinationValue;
        if (to.getAttribute("value") !== config.destinationValue) to.setAttribute("value", config.destinationValue);
        if (to.placeholder !== config.destinationValue) to.placeholder = config.destinationValue;
      }

      var pricing = root.querySelector(".pcm-step33-pricing");
      if (!pricing) {
        quote.insertAdjacentHTML("afterend", pricingMarkup());
        pricing = quote.nextElementSibling;
      }
      if (pricing && pricing.nextElementSibling !== app) root.insertBefore(pricing, app);

      var intro = sectionByHeading(new RegExp("^Moving from " + config.origin + " to " + config.destination + "\\?$", "i"));
      if (!intro) return;
      intro.className = "pcm-step33-main py-16 bg-white";
      var content = intro.querySelector(":scope > .container") || intro.firstElementChild;
      if (!content) return;
      content.className = "container max-w-4xl";

      var oldGlance = sectionByHeading(/Route at a Glance$/i);
      if (!content.querySelector(".pcm-step33-glance")) {
        var paragraphs = content.querySelectorAll(":scope > p");
        var anchor = paragraphs.length ? paragraphs[paragraphs.length - 1] : content.querySelector("h2");
        anchor.insertAdjacentHTML("afterend", glanceMarkup());
      }
      if (oldGlance && oldGlance !== intro) oldGlance.remove();

      var legacyPricing = sectionByHeading(/Moving Cost Breakdown$/i);
      if (legacyPricing) legacyPricing.remove();

      var related = sectionByHeading(/^Related Destinations$/i);
      var closing = sectionByHeading(/^Ready to Move from /i);
      var mergePatterns = [
        /^What Makes a /i,
        /^Tips for Moving to /i,
        /^Why Choose Purely Canadian Movers$/i,
        /^How Your .* Move Works$/i,
      ];
      mergePatterns.forEach(function (pattern) {
        var section = sectionByHeading(pattern);
        if (!section || section === intro) return;
        var container = section.querySelector(":scope > .container") || section.firstElementChild;
        if (container) while (container.firstChild) content.appendChild(container.firstChild);
        section.remove();
      });

      var testimonial = Array.prototype.find.call(document.querySelectorAll("main section"), function (section) {
        return !section.querySelector("h1,h2,h3") && /moved from|moving experience|recommend/i.test(normalize(section.textContent));
      });
      if (testimonial) {
        var testimonialContainer = testimonial.querySelector(":scope > .container") || testimonial.firstElementChild;
        if (testimonialContainer) {
          var testimonialCard = document.createElement("div");
          testimonialCard.className = "pcm-step33-testimonial";
          while (testimonialContainer.firstChild) testimonialCard.appendChild(testimonialContainer.firstChild);
          content.appendChild(testimonialCard);
        }
        testimonial.remove();
      }

      content.querySelectorAll("p").forEach(function (paragraph) {
        var corrected = paragraph.innerHTML
          .replace("this is a true cross-country move", "this is an interprovincial long-distance move")
          .replace("your move is coordinated", "Your move is coordinated");
        if (corrected !== paragraph.innerHTML) paragraph.innerHTML = corrected;
      });
      content.querySelectorAll("h3").forEach(function (heading) {
        if (normalize(heading.textContent) === "Cross-Country Transit") heading.textContent = "Interprovincial Transit";
      });

      var faq = document.querySelector(".pcm-route-faq-static");
      var main = app.querySelector("main");
      if (faq && main && related) {
        faq.className = "pcm-route-faq-static py-16 bg-gray-50";
        if (faq.nextElementSibling !== related || faq.parentElement !== main) main.insertBefore(faq, related);
      }
      if (main && related && related.previousElementSibling !== faq) main.insertBefore(related, closing || null);

      document.querySelectorAll(".pcm-local-seo").forEach(function (element) { element.remove(); });
      document.documentElement.setAttribute("data-pcm-step33-ready", "1");
    } finally {
      applying = false;
    }
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    window.setTimeout(function () { queued = false; apply(); }, 40);
  }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", schedule);
  window.addEventListener("load", schedule);
  [0, 250, 800, 1800, 4000, 8000].forEach(function (delay) { window.setTimeout(apply, delay); });
}());
