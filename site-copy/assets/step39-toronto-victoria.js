(function () {
  "use strict";
  var node = document.getElementById("pcm-step39-config");
  if (!node) return;
  var config;
  try { config = JSON.parse(node.textContent); } catch (error) { return; }
  if (config.origin !== "Toronto" && config.origin !== "Victoria") return;
  var busy = false;
  function clean(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
  function sectionByHeading(pattern) {
    var heading = Array.prototype.find.call(document.querySelectorAll("h2,h3"), function (item) { return pattern.test(clean(item.textContent)); });
    return heading && heading.closest("section");
  }
  function setInput(input, value) {
    if (!input) return;
    var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.setAttribute("value", value);
    input.placeholder = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function replaceText(root, replacements) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (text) {
      if (text.parentElement && text.parentElement.closest("script,style,noscript,template")) return;
      var value = text.nodeValue;
      replacements.forEach(function (pair) { value = value.replace(pair[0], pair[1]); });
      if (value !== text.nodeValue) text.nodeValue = value;
    });
  }
  function glance() {
    return '<div class="pcm-step39-glance"><h3>' + config.origin + '–' + config.destination + ' Route at a Glance</h3><div class="pcm-step39-glance__grid"><div><b>↔</b><p><small>Distance</small><strong>~4,400 km</strong><em>' + config.origin + ' to ' + config.destination + '</em></p></div><div><b>◷</b><p><small>Estimated transit time</small><strong>10–22 days</strong><em>Depending on shipment size and route schedule</em></p></div><div><b>$</b><p><small>Typical cost range</small><strong>$3,000–$16,000+</strong><em>Studio to 4+ bedroom home</em></p></div></div></div>';
  }
  function enhanceStaticNav() {
    if (location.pathname !== "/victoria-to-toronto-movers/") return;
    var trigger = document.querySelector('header button[aria-label="Open menu"]');
    var panel = document.querySelector(".pcm-static-mobile");
    if (!trigger || !panel || trigger.dataset.pcmStep39Nav) return;
    trigger.dataset.pcmStep39Nav = "1";
    panel.id = "pcm-step39-mobile-nav";
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", String(panel.classList.contains("is-open")));
    trigger.addEventListener("click", function () { trigger.setAttribute("aria-expanded", String(panel.classList.contains("is-open"))); });
    var close = panel.querySelector('button[aria-label="Close menu"]');
    if (close) close.addEventListener("click", function () { trigger.setAttribute("aria-expanded", "false"); });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      panel.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      document.querySelectorAll(".pcm-static-dropdown").forEach(function (menu) {
        menu.hidden = true;
        if (menu._button) menu._button.setAttribute("aria-expanded", "false");
      });
      trigger.focus();
    });
  }
  function apply() {
    if (busy) return;
    busy = true;
    try {
      var root = document.getElementById("root");
      var h1 = document.querySelector("h1");
      if (!root || !h1 || clean(h1.textContent) !== config.h1) return;
      var app = h1.closest("#root > div") || root.querySelector(":scope > div");
      document.documentElement.classList.add("pcm-step39-toronto-victoria");
      document.documentElement.dataset.pcmStep39Ready = "1";
      enhanceStaticNav();

      document.title = config.title;
      var fields = [
        ['meta[property="og:title"]', "content", config.title],
        ['meta[name="twitter:title"]', "content", config.title],
        ['meta[name="description"]', "content", config.description],
        ['meta[property="og:description"]', "content", config.description],
        ['meta[name="twitter:description"]', "content", config.description],
        ['meta[property="og:url"]', "content", "https://purelycanadianmovers.com" + location.pathname],
        ['link[rel="canonical"]', "href", "https://purelycanadianmovers.com" + location.pathname]
      ];
      fields.forEach(function (entry) { var element = document.querySelector(entry[0]); if (element) element[entry[1]] = entry[2]; });

      var quote = root.querySelector(".pcm-lead-panel,.pcm-top-estimate-wrap");
      if (quote && app && quote.parentElement === root && root.firstElementChild !== quote) root.insertBefore(quote, app);
      if (quote) {
        quote.classList.add("pcm-step39-quote");
        quote.querySelectorAll(".pcm-estimate-bonus").forEach(function (item) { item.remove(); });
        var pills = quote.querySelectorAll(".pcm-trust-row span,.pcm-pills .pcm-pill");
        for (var index = pills.length - 1; index >= 6; index -= 1) pills[index].remove();
        setInput(quote.querySelector('[name="from"]'), config.originValue);
        setInput(quote.querySelector('[name="to"]'), config.destinationValue);
        var quoteHeading = quote.querySelector("h2");
        if (quoteHeading) quoteHeading.textContent = config.quoteHeading;
        replaceText(quote, [[/Direct mover since 1991/g, "Family-owned since 1991"]]);
      }

      document.querySelectorAll(".pcm-route-cost:not(.pcm-step39-pricing)").forEach(function (item) { item.remove(); });
      document.querySelectorAll("h2").forEach(function (heading) {
        if (/^How much does it cost to move from (Toronto to Victoria|Victoria to Toronto)\?$/i.test(clean(heading.textContent))) {
          var old = heading.closest("section");
          if (old && !old.classList.contains("pcm-step39-pricing")) old.remove();
        }
      });
      var pricing = document.querySelector(".pcm-step39-pricing");
      if (quote && pricing && quote.nextElementSibling !== pricing) quote.insertAdjacentElement("afterend", pricing);

      var oldGlanceHeading = Array.prototype.find.call(document.querySelectorAll("h2,h3"), function (item) { return /Route at a Glance/i.test(clean(item.textContent)) && !item.closest(".pcm-step39-glance"); });
      if (oldGlanceHeading) {
        var oldGlanceSection = oldGlanceHeading.closest("section");
        var sharesIntroSection = oldGlanceSection && oldGlanceSection.querySelectorAll("h2,h3").length > 1;
        if (sharesIntroSection && oldGlanceHeading.parentElement) oldGlanceHeading.parentElement.remove();
        else if (oldGlanceSection) oldGlanceSection.remove();
      }
      var introPattern = config.origin === "Toronto" ? /^Moving from Toronto to Vancouver Island\?$/i : /^Moving from Victoria to Toronto\?$/i;
      var intro = sectionByHeading(introPattern);
      if (intro) {
        intro.classList.add("pcm-step39-main");
        var box = intro.querySelector(":scope > .container") || intro.firstElementChild;
        if (box) {
          box.className = "container max-w-4xl";
          var legacy = Array.prototype.find.call(box.querySelectorAll("h2"), function (heading) { return /Moving Cost Breakdown|Route Pricing/i.test(clean(heading.textContent)); });
          if (legacy) {
            var sibling = legacy.nextElementSibling;
            while (sibling && sibling.tagName !== "H2") { var next = sibling.nextElementSibling; sibling.remove(); sibling = next; }
            legacy.remove();
          }
          if (!box.querySelector(".pcm-step39-glance")) {
            var anchor = box.querySelector(":scope > div") || box.querySelector("h2") || box.firstElementChild;
            if (anchor) anchor.insertAdjacentHTML("afterend", glance());
          }
        }
      }

      var main = (app && app.querySelector("main")) || document.querySelector("main") || root;
      var replacements = [[/Cross-Country Transit/g, "Interprovincial Transit"], [/Professional, fully insured long-distance moving/g, "Professional interprovincial long-distance moving"], [/fully insured service/g, "documented interprovincial service"], [/basic valuation coverage/g, "basic carrier liability"], [/valuation coverage/g, "Declared Value Protection"], [/Zero subcontractors\./g, "Coordinated through the Great Canadian Van Lines agent network."], [/no strangers, no handoffs/gi, "documented agent-network coordination"]];
      if (config.origin === "Toronto") {
        replacements.push([/Update Your BC Health Card and Driver's Licence/g, "Plan Your BC Health and Driver Documentation"], [/You have 90 days[^.]*\./g, "Check current BC residency, driver-licensing, and vehicle-registration requirements before and after arrival."], [/There is a 3-month waiting period[^.]*\./g, "Check current coverage-effective-date requirements directly with Health Insurance BC."]);
      } else {
        replacements.push([/Victoria–Vancouver/g, "Victoria–Toronto"], [/Vancouver to Victoria/g, "Toronto to Victoria"], [/Vancouver's climate/g, "Cross-country seasonal conditions"]);
      }
      replaceText(main, replacements);
      document.querySelectorAll(".pcm-local-seo").forEach(function (item) { item.remove(); });

      var chosen = document.querySelector("[data-pcm-step39-faq]");
      if (chosen) {
        document.querySelectorAll("section").forEach(function (item) {
          if (item !== chosen && /Frequently Asked Questions/i.test(clean(item.querySelector("h2") && item.querySelector("h2").textContent))) item.remove();
        });
        var related = sectionByHeading(/^Related Destinations$/i);
        if (main && chosen.parentElement !== main) main.insertBefore(chosen, related || null);
      }
      document.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
        if (script.id === "pcm-step39-faq-schema") return;
        try {
          var data = JSON.parse(script.textContent), found = false;
          (function walk(value) { if (!value || typeof value !== "object") return; if (value["@type"] === "FAQPage") found = true; if (Array.isArray(value)) value.forEach(walk); else Object.keys(value).forEach(function (key) { walk(value[key]); }); }(data));
          if (found) script.remove();
        } catch (error) {}
      });
    } finally { busy = false; }
  }
  var queued = false;
  new MutationObserver(function () { if (!queued) { queued = true; setTimeout(function () { queued = false; apply(); }, 50); } }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", apply);
  [0, 250, 800, 1800, 4000, 8000].forEach(function (delay) { setTimeout(apply, delay); });
}());
