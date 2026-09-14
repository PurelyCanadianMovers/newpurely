(function () {
  "use strict";

  function init() {
    var chatLauncher = document.querySelector('button[aria-label="Open chat assistant"]');
    if (chatLauncher) chatLauncher.classList.add("pcm-step35-chat-launcher");
    var trigger = document.querySelector('header button[aria-label="Open menu"]');
    var panel = document.querySelector(".pcm-static-mobile");
    if (!trigger || !panel || panel.dataset.pcmStep35Enhanced) return;
    panel.dataset.pcmStep35Enhanced = "1";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Mobile navigation");
    trigger.setAttribute("aria-expanded", "false");

    var overlay = document.createElement("div");
    overlay.className = "pcm-step35-menu-overlay";
    overlay.hidden = true;
    document.body.insertBefore(overlay, panel);

    function focusables() {
      return Array.prototype.slice.call(panel.querySelectorAll('a[href],button:not([disabled])'));
    }
    function closeMenu() {
      panel.classList.remove("is-open");
      overlay.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      trigger.focus();
    }
    function sync() {
      var open = panel.classList.contains("is-open");
      trigger.setAttribute("aria-expanded", String(open));
      overlay.hidden = !open;
      document.documentElement.style.overflow = open ? "hidden" : "";
    }

    trigger.addEventListener("click", function () { window.setTimeout(sync, 0); });
    panel.querySelector('button[aria-label="Close menu"]')?.addEventListener("click", function () { window.setTimeout(sync, 0); });
    overlay.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        document.querySelectorAll(".pcm-static-dropdown").forEach(function (menu) {
          menu.hidden = true;
          if (menu._button) menu._button.setAttribute("aria-expanded", "false");
        });
        if (panel.classList.contains("is-open")) closeMenu();
      }
      if (event.key === "Tab" && panel.classList.contains("is-open")) {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}());
