(function () {
  "use strict";

  var root = document;
  var navGroups = {
    Services: [
      ["Services Overview", "/services/"],
      ["Local Moving", "/local/"],
      ["Long-Distance Moving", "/long-distance/"],
      ["Cross-Country Moves", "/cross-country-movers/"],
      ["Canada–USA Moves", "/canada-usa/"],
      ["BC to Washington Movers", "/bc-to-washington-movers/"],
      ["Vancouver to Seattle Movers", "/vancouver-to-seattle-movers/"],
      ["Seattle to Vancouver Movers", "/seattle-to-vancouver-movers/"],
      ["Overseas Moving", "/overseas/"],
      ["Storage Solutions", "/storage/"],
      ["Office & Corporate Moves", "/office/"],
      ["Packing Services", "/packing/"],
      ["Valuation & Declared Value Protection", "/valuation-coverage-protection/"]
    ],
    "Local Moves": [
      ["Local Moving Overview", "/local/"],
      ["Vancouver", "/vancouver/"],
      ["Coquitlam", "/coquitlam/"],
      ["Surrey", "/surrey/"],
      ["Burnaby", "/burnaby/"],
      ["North Vancouver", "/north-vancouver/"],
      ["Langley", "/langley/"],
      ["Richmond", "/richmond/"],
      ["New Westminster", "/new-westminster/"],
      ["Delta", "/delta/"],
      ["Port Moody", "/port-moody/"],
      ["White Rock", "/white-rock/"],
      ["Abbotsford", "/moving-in-abbotsford-bc/"],
      ["Maple Ridge", "/maple-ridge/"],
      ["Pitt Meadows", "/pitt-meadows/"]
    ],
    "Long-Distance": [
      ["Long-Distance Overview", "/long-distance/"],
      ["Vancouver Movers", "/vancouver-long-distance-movers/"],
      ["Toronto Movers", "/toronto-long-distance-movers/"],
      ["Montreal Movers", "/montreal-long-distance-movers/"],
      ["Ottawa Movers", "/ottawa-long-distance-movers/"],
      ["Calgary Movers", "/calgary-long-distance-movers/"],
      ["Edmonton Movers", "/edmonton-long-distance-movers/"],
      ["Victoria Movers", "/victoria-long-distance-movers/"],
      ["Halifax Movers", "/halifax-long-distance-movers/"]
    ]
  };

  function closeMenus(except) {
    root.querySelectorAll(".pcm-static-dropdown").forEach(function (menu) {
      if (menu !== except) {
        menu.hidden = true;
        if (menu._button) menu._button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function makeLink(label, href) {
    var link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    return link;
  }

  function initDesktop() {
    root.querySelectorAll("header button").forEach(function (button) {
      var label = button.textContent.trim();
      if (!navGroups[label] || button.getAttribute("aria-label")) return;
      var parent = button.parentElement;
      if (!parent || parent.querySelector(".pcm-static-dropdown")) return;
      parent.classList.add("pcm-static-nav-parent");
      var menu = document.createElement("div");
      menu.className = "pcm-static-dropdown";
      menu.hidden = true;
      menu.setAttribute("role", "menu");
      navGroups[label].forEach(function (item) { menu.appendChild(makeLink(item[0], item[1])); });
      menu._button = button;
      parent.appendChild(menu);
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        closeMenus(menu);
        menu.hidden = !menu.hidden;
        button.setAttribute("aria-expanded", String(!menu.hidden));
      });
    });
  }

  function initMobile() {
    var trigger = root.querySelector('header button[aria-label="Open menu"]');
    if (!trigger || root.querySelector(".pcm-static-mobile")) return;
    var panel = document.createElement("nav");
    panel.className = "pcm-static-mobile";
    panel.setAttribute("aria-label", "Mobile navigation");
    var close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Close menu");
    close.textContent = "Close";
    panel.appendChild(close);
    [["Home", "/"], ["Services", "/services/", navGroups.Services], ["Local Moves", "/local/", navGroups["Local Moves"]], ["Long-Distance", "/long-distance/", navGroups["Long-Distance"]], ["Storage", "/storage/"], ["Our Network", "/our-network/"], ["Blog", "/blog/"], ["Reviews", "/testimonials/"], ["Contact", "/contact/"]].forEach(function (item) {
      var group = document.createElement("div");
      var parentLink = makeLink(item[0], item[1]);
      group.appendChild(parentLink);
      if (item[2]) {
        var subnav = document.createElement("div");
        subnav.className = "pcm-static-mobile-subnav";
        item[2].slice(1).forEach(function (child) { subnav.appendChild(makeLink(child[0], child[1])); });
        group.appendChild(subnav);
      }
      panel.appendChild(group);
    });
    root.body.appendChild(panel);
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      panel.classList.add("is-open");
      close.focus();
    });
    close.addEventListener("click", function () { panel.classList.remove("is-open"); trigger.focus(); });
  }

  function init() {
    initDesktop();
    initMobile();
    root.addEventListener("click", function () { closeMenus(null); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
