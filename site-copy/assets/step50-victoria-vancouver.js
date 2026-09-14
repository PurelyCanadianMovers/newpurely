(function () {
  "use strict";
  if (window.location.pathname.replace(/\/+$/, "") + "/" !== "/victoria-to-vancouver-movers/") return;

  function init() {
    var trigger = document.querySelector('header button[aria-label="Open menu"]');
    var panel = document.querySelector(".pcm-static-mobile");
    var close = panel && panel.querySelector('button[aria-label="Close menu"]');
    if (trigger && panel && close) {
      trigger.setAttribute("aria-expanded", String(panel.classList.contains("is-open")));
      trigger.addEventListener("click", function () {
        window.setTimeout(function () { trigger.setAttribute("aria-expanded", String(panel.classList.contains("is-open"))); }, 0);
      });
      close.addEventListener("click", function () { trigger.setAttribute("aria-expanded", "false"); });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".pcm-static-dropdown").forEach(function (menu) {
        menu.hidden = true;
        if (menu._button) menu._button.setAttribute("aria-expanded", "false");
      });
      if (panel && panel.classList.contains("is-open")) {
        panel.classList.remove("is-open");
        if (trigger) { trigger.setAttribute("aria-expanded", "false"); trigger.focus(); }
      }
    });

    var firstChatMessage = document.querySelector(".pcm-static-chat-bubble");
    if (firstChatMessage && !firstChatMessage.hasAttribute("data-pcm-step50-context")) {
      firstChatMessage.textContent = "Hi! You’re viewing our Victoria to Vancouver moving route. Ask about ferry planning, access, packing, storage, timing, or written estimates. 🍁";
      firstChatMessage.setAttribute("data-pcm-step50-context", "victoria-to-vancouver");
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
}());
