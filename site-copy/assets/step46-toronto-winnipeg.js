(() => {
  const path = `${location.pathname.replace(/\/+$/, "")}/`;
  if (!["/toronto-to-winnipeg-movers/", "/winnipeg-to-toronto-movers/"].includes(path)) return;

  const bind = () => {
    const trigger = document.querySelector('header button[aria-label="Open menu"]');
    const panel = document.querySelector(".pcm-static-mobile");
    const close = panel?.querySelector('button[aria-label="Close menu"]');
    if (!trigger || !panel || !close || trigger.dataset.pcmStep46Bound) return false;
    trigger.dataset.pcmStep46Bound = "1";
    const sync = () => trigger.setAttribute("aria-expanded", String(panel.classList.contains("is-open")));
    sync();
    trigger.addEventListener("click", () => setTimeout(sync, 0));
    close.addEventListener("click", () => { trigger.setAttribute("aria-expanded", "false"); trigger.focus(); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        close.click();
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });
    return true;
  };

  let attempts = 0;
  const run = () => { attempts += 1; if (!bind() && attempts < 30) setTimeout(run, 100); };
  run();
})();
