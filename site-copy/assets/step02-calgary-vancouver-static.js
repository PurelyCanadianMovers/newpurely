(function () {
  function init() {
    var trigger = document.querySelector('button[aria-label="Open menu"]');
    var panel = document.querySelector(".pcm-static-mobile");
    var close = panel && panel.querySelector('button[aria-label="Close menu"]');
    if (!trigger || !panel || !close || panel.dataset.pcmStep02Bound === "1") return;
    panel.dataset.pcmStep02Bound = "1";
    var overlay = document.createElement("div");
    overlay.className = "pcm-static-mobile-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.insertBefore(overlay, panel);
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("data-state", "closed");
    function setMenuState(open) {
      trigger.setAttribute("aria-expanded", String(open));
      panel.setAttribute("data-state", open ? "open" : "closed");
      overlay.classList.toggle("is-open", open);
      panel.classList.toggle("is-open", open);
      if (!open) trigger.focus();
    }
    trigger.addEventListener("click", function () { setMenuState(true); });
    close.addEventListener("click", function () { setMenuState(false); });
    overlay.addEventListener("click", function () { setMenuState(false); });
    document.addEventListener("keydown", function (event) {
      if (!panel.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuState(false);
        return;
      }
      if (event.key !== "Tab") return;
      var focusable = Array.from(panel.querySelectorAll('a[href],button:not([disabled])')).filter(function (item) { return item.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { window.setTimeout(init, 0); });
  else window.setTimeout(init, 0);
})();
