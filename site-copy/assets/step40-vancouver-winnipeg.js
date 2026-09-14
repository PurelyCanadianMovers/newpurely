(() => {
  const facts = { distance: "2,300 km", transit: "5–13 days", range: "$2,400–$13,000+", prices: ["$2,400+", "$3,400+", "$5,500+", "$8,900+", "$13,000+"] };
  const routes = {
    "/vancouver-to-winnipeg-movers/": {
      from: "Vancouver", fromFull: "Vancouver, BC", to: "Winnipeg", toFull: "Winnipeg, MB",
      pickup: "Vancouver pickup planning should account for strata move rules, elevator reservations, loading-zone availability, parking restrictions, stairs, long carries, and building move windows.",
      delivery: "Winnipeg delivery planning should account for building access, elevators, curb and loading space, snow-route restrictions, stairs, and long carries.",
      corridor: "The eastbound route crosses the BC interior and the Prairies. Mountain and Prairie conditions can affect the working schedule, especially in winter, so delivery planning should retain reasonable flexibility.",
    },
    "/winnipeg-to-vancouver-movers/": {
      from: "Winnipeg", fromFull: "Winnipeg, MB", to: "Vancouver", toFull: "Vancouver, BC",
      pickup: "Winnipeg pickup planning should account for building access, elevators, curb and loading space, snow-route restrictions, stairs, and long carries.",
      delivery: "Vancouver delivery planning should account for strata move rules, elevator reservations, loading-zone availability, parking restrictions, stairs, long carries, and building move windows.",
      corridor: "The westbound route crosses the Prairies and the BC interior. Prairie and mountain conditions can affect the working schedule, especially in winter, so arrival planning should retain reasonable flexibility.",
    },
  };
  const path = `${location.pathname.replace(/\/+$/, "")}/`;
  const route = routes[path];
  if (!route) return;
  Object.assign(route, facts);

  const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const sectionByHeading = (pattern) => [...document.querySelectorAll("main section")]
    .find((section) => pattern.test(clean(section.querySelector("h2")?.textContent)));

  function pricing() {
    const labels = ["Studio / small shipment", "1-bedroom", "2-bedroom", "3-bedroom", "4+ bedroom"];
    const notes = ["Compact or partial shipment", "Apartment move", "Typical small household", "Larger household", "Large or complex shipment"];
    const rows = labels.map((label, index) => `<tr><td>${label}</td><td>${route.prices[index]}</td><td>${notes[index]}</td><td>${route.transit}</td></tr>`).join("");
    const section = document.createElement("section");
    section.className = "pcm-route-cost pcm-step40-pricing";
    section.setAttribute("aria-labelledby", "pcm-step40-pricing-heading");
    section.innerHTML = `<div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${route.from} to ${route.to} moving costs</div><h2 id="pcm-step40-pricing-heading">How much does it cost to move from ${route.from} to ${route.to}?</h2><p class="pcm-route-cost__intro">Planning figures for this approximately ${route.distance} interprovincial route run from ${route.prices[0]} for a studio or small shipment to ${route.prices[4]} for a 4+ bedroom home. Your written estimate is based on inventory, access, timing, packing, storage, and the protection option selected.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges in CAD, not guaranteed quotes. Final pricing depends on shipment weight or volume, origin and destination access, season, packing, storage, and requested services. Basic carrier liability applies; available <strong>Declared Value Protection</strong> options are confirmed in writing before moving day.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/valuation-coverage-protection/">Protection Options</a><a href="/contact/">Request a Written Estimate</a></div></div>`;
    return section;
  }

  function mainContent() {
    const section = document.createElement("section");
    section.className = "pcm-step40-main";
    section.innerHTML = `<div class="container"><h2>Moving from ${route.from} to ${route.to}</h2><div class="pcm-step40-intro"><p>A ${route.from}–${route.to} move is an interprovincial relocation between British Columbia and Manitoba. Purely Canadian Movers coordinates pickup, transit, delivery, access, and requested services around the actual shipment.</p><p>As an agent of <strong>Great Canadian Van Lines</strong>, we combine national network reach with accountable coordination, clear documentation, Declared Value Protection options, and no broker-style handoff to an unknown mover.</p><p>This direction keeps the planning details specific to ${route.from} pickup, the ${route.from === "Vancouver" ? "eastbound" : "westbound"} corridor, and ${route.to} delivery.</p></div><div class="pcm-step40-glance"><h3>Route at a Glance</h3><div class="pcm-step40-glance__grid"><div><span class="pcm-step40-icon" aria-hidden="true">↔</span><p><small>Distance</small><strong>${route.distance}</strong><span>${route.from} to ${route.to}</span></p></div><div><span class="pcm-step40-icon" aria-hidden="true">◷</span><p><small>Estimated transit</small><strong>${route.transit}</strong><span>Depending on shipment and schedule</span></p></div><div><span class="pcm-step40-icon" aria-hidden="true">$</span><p><small>Typical cost range</small><strong>${route.range}</strong><span>Studio through 4+ bedroom</span></p></div></div></div><h2>Planning the ${route.from}–${route.to} corridor</h2><div class="pcm-step40-card-grid"><article><h3>${route.from} pickup logistics</h3><p>${route.pickup}</p></article><article><h3>${route.to} delivery logistics</h3><p>${route.delivery}</p></article><article><h3>Seasonal corridor planning</h3><p>${route.corridor}</p></article><article><h3>Apartments, condos, and access</h3><p>Confirm elevator reservations, building move windows, parking permissions, stairs, long carries, and truck access before the written estimate is finalized.</p></article></div><h2>Why choose Purely Canadian Movers</h2><ul class="pcm-step40-proof"><li>Family-owned Canadian moving company since 1991.</li><li>Great Canadian Van Lines agent network with accountable route coordination.</li><li>Clear written estimates with pricing and requested services explained.</li><li>No moving brokers or random subcontractors.</li><li>Packing, storage, delivery planning, and Declared Value Protection options are available.</li></ul><h2>How your ${route.from}–${route.to} move works</h2><div class="pcm-step40-process"><article><b>1</b><h3>Written estimate</h3><p>Share inventory, access, services, and preferred dates.</p></article><article><b>2</b><h3>Pack and load</h3><p>We pack if requested and load carefully at your ${route.from} origin.</p></article><article><b>3</b><h3>${route.from === "Vancouver" ? "Eastbound" : "Westbound"} transit</h3><p>Your shipment is coordinated across the approximately ${route.distance} route.</p></article><article><b>4</b><h3>Delivery</h3><p>We unload at your ${route.to} destination, subject to access.</p></article></div></div>`;
    return section;
  }

  function normalize() {
    const shell = document.querySelector(`[data-pcm-static-route="${path.slice(1, -1)}"]`);
    const quote = document.querySelector(".pcm-lead-panel,.pcm-top-estimate-wrap");
    const main = shell?.querySelector("main") ?? document.querySelector("main");
    if (!shell || !quote || !main) return false;

    const trust = quote.querySelector(".pcm-trust-row,.pcm-pills");
    if (trust) {
      const values = ["Family-owned since 1991", "BBB Accredited business", "No brokers or subcontractors", "Declared Value Protection available", "Great Canadian Van Lines agent", "Written estimates and route planning"];
      trust.replaceChildren(...values.map((value) => Object.assign(document.createElement("span"), { className: trust.classList.contains("pcm-pills") ? "pcm-pill" : "", textContent: value })));
    }
    quote.querySelectorAll(".pcm-estimate-bonus").forEach((item) => { item.innerHTML = '<span class="pcm-estimate-bonus__icon" aria-hidden="true">✓</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed.</span></div>'; });
    const from = quote.querySelector('[name="from"]');
    const to = quote.querySelector('[name="to"]');
    if (from) { from.value = route.fromFull; from.defaultValue = route.fromFull; }
    if (to) { to.value = route.toFull; to.defaultValue = route.toFull; }

    document.querySelectorAll(".pcm-route-cost").forEach((node) => node.remove());
    quote.insertAdjacentElement("afterend", pricing());

    const faq = sectionByHeading(/^Frequently Asked Questions$/i);
    const related = sectionByHeading(/^Related Destinations/i);
    const closing = sectionByHeading(/^Ready to Move from /i);
    const hero = sectionByHeading(/^(?!Frequently Asked Questions|Related Destinations|Ready to Move)/i)?.closest(".pcm-static-band") ?? main.querySelector(".pcm-static-band--hero") ?? main.firstElementChild;
    [...main.children].forEach((child) => { if (![hero, faq, related, closing].includes(child)) child.remove(); });
    const strip = document.createElement("section");
    strip.className = "pcm-step40-trust";
    strip.textContent = "Family-owned since 1991 · BBB Accredited business · Great Canadian Van Lines agent · Written estimates";
    hero.insertAdjacentElement("afterend", strip);
    strip.insertAdjacentElement("afterend", mainContent());
    faq?.classList.add("pcm-route-faq-static", "pcm-step40-faq");
    related?.classList.add("pcm-step40-related");
    closing?.classList.add("pcm-step40-closing");
    document.documentElement.setAttribute("data-pcm-step40-ready", "1");

    const menuTrigger = document.querySelector('header button[aria-label="Open menu"]');
    const mobilePanel = document.querySelector(".pcm-static-mobile");
    const menuClose = mobilePanel?.querySelector('button[aria-label="Close menu"]');
    if (menuTrigger && mobilePanel && menuClose && !menuTrigger.dataset.pcmStep40Bound) {
      menuTrigger.dataset.pcmStep40Bound = "1";
      menuTrigger.setAttribute("aria-expanded", mobilePanel.classList.contains("is-open") ? "true" : "false");
      menuTrigger.addEventListener("click", () => setTimeout(() => menuTrigger.setAttribute("aria-expanded", String(mobilePanel.classList.contains("is-open"))), 0));
      menuClose.addEventListener("click", () => menuTrigger.setAttribute("aria-expanded", "false"));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobilePanel.classList.contains("is-open")) {
          menuClose.click();
          menuTrigger.setAttribute("aria-expanded", "false");
          menuTrigger.focus();
        }
      });
    }
    return true;
  }

  let attempts = 0;
  const run = () => {
    attempts += 1;
    const ready = normalize();
    if (!ready && attempts < 30) setTimeout(run, 100);
  };
  run();
  [250, 750, 1500, 3000].forEach((delay) => setTimeout(normalize, delay));
})();
