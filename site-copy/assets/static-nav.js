(function () {
  "use strict";

  var root = document;
  var navGroups = {
    Services: [
      ["Local Moving", "/local/"],
      ["Long-Distance Moving", "/long-distance/"],
      ["Packing Services", "/packing/"],
      ["Storage", "/storage/"]
    ],
    "Local Moves": [
      ["Local Moving Overview", "/local/"],
      ["Vancouver", "/vancouver/"],
      ["Coquitlam", "/coquitlam/"],
      ["Surrey", "/surrey/"]
    ],
    "Long-Distance": [
      ["Long-Distance Moving", "/long-distance/"],
      ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
      ["Toronto Routes", "/toronto-long-distance-movers/"],
      ["Vancouver Routes", "/vancouver-long-distance-movers/"]
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
    [["Home", "/"], ["Services", "/local/"], ["Local Moves", "/local/"], ["Long-Distance", "/long-distance/"], ["Pricing", "/long-distance-moving-cost-canada/"], ["Storage", "/storage/"], ["Blog", "/blog/"], ["Contact", "/contact/"]].forEach(function (item) {
      panel.appendChild(makeLink(item[0], item[1]));
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
