(() => {
  const routes = {
    "/edmonton-to-winnipeg-movers/": {
      from: "Edmonton", fromFull: "Edmonton, AB", to: "Winnipeg", toFull: "Winnipeg, MB",
      distance: "1,300 km", transit: "3–11 days", range: "$2,300–$12,000+",
      prices: ["$2,300+", "$3,200+", "$5,100+", "$8,200+", "$12,000+"],
      pickup: "Edmonton pickup planning includes winter access, driveway or loading-zone clearance, apartment elevator reservations, and practical timing around Alberta weather.",
      delivery: "Winnipeg delivery planning accounts for snow-route restrictions, curb access, building loading windows, elevators, stairs, and long carries.",
    },
    "/winnipeg-to-edmonton-movers/": {
      from: "Winnipeg", fromFull: "Winnipeg, MB", to: "Edmonton", toFull: "Edmonton, AB",
      distance: "1,300 km", transit: "3–11 days", range: "$2,300–$12,000+",
      prices: ["$2,300+", "$3,200+", "$5,100+", "$8,200+", "$12,000+"],
      pickup: "Winnipeg pickup planning includes snow-route restrictions, curb access, building loading windows, elevator reservations, stairs, and long carries.",
      delivery: "Edmonton delivery planning accounts for winter access, driveway or loading-zone clearance, apartment elevators, and practical timing around Alberta weather.",
    },
  };

  const path = `${location.pathname.replace(/\/+$/, "")}/`;
  const route = routes[path];
  if (!route) return;

  const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const sectionByHeading = (pattern) => [...document.querySelectorAll("main section")]
    .find((section) => pattern.test(clean(section.querySelector("h2")?.textContent)));

  function buildPricing() {
    const labels = ["Studio / Bachelor", "1-Bedroom", "2-Bedroom", "3-Bedroom", "4+ Bedroom"];
    const notes = ["Compact shipment", "Apartment move", "Typical small household", "Larger household", "Large or complex shipment"];
    const rows = labels.map((label, index) => `<tr><td>${label}</td><td>${route.prices[index]}</td><td>${notes[index]}</td><td>${route.transit}</td></tr>`).join("");
    const section = document.createElement("section");
    section.className = "pcm-route-cost";
    section.setAttribute("aria-labelledby", "pcm-step34-pricing-heading");
    section.innerHTML = `<div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${route.from} to ${route.to} moving costs</div><h2 id="pcm-step34-pricing-heading">How much does it cost to move from ${route.from} to ${route.to}?</h2><p class="pcm-route-cost__intro">Use these established planning ranges for a ${route.distance} prairie move. Your written estimate is based on inventory, access, timing, packing, storage, and the protection option selected.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges in CAD, not guaranteed quotes. Final pricing depends on shipment weight and volume, access, season, packing, storage, and other requested services. Basic carrier liability applies; available <strong>Declared Value Protection</strong> options are confirmed in writing before moving day.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/valuation-coverage-protection/">Protection Options</a><a href="/contact/">Request a Written Estimate</a></div></div>`;
    return section;
  }

  function buildMain() {
    const section = document.createElement("section");
    section.className = "pcm-step34-main";
    section.innerHTML = `<div class="container"><h2>Moving from ${route.from} to ${route.to}</h2><div class="pcm-step34-intro"><p>The ${route.from}–${route.to} corridor is a practical interprovincial route for households relocating across the Prairies. Purely Canadian Movers coordinates pickup, transit, delivery, access, and requested services around the actual shipment.</p><p>As an agent of <strong>Great Canadian Van Lines</strong>, we combine national network reach with accountable coordination, clear documentation, Declared Value Protection options, and no broker-style handoff to an unknown mover.</p><p>The reverse direction is supported too, while this page keeps the planning details specific to ${route.from} pickup and ${route.to} delivery.</p></div><div class="pcm-step34-glance"><h3>Route at a Glance</h3><div class="pcm-step34-glance__grid"><div><span class="pcm-step34-icon" aria-hidden="true">↔</span><p><small>Distance</small><strong>${route.distance}</strong><span>${route.from} to ${route.to}</span></p></div><div><span class="pcm-step34-icon" aria-hidden="true">◷</span><p><small>Estimated transit</small><strong>${route.transit}</strong><span>Depending on shipment and schedule</span></p></div><div><span class="pcm-step34-icon" aria-hidden="true">$</span><p><small>Typical cost range</small><strong>${route.range}</strong><span>Studio through 4+ bedroom</span></p></div></div></div><h2>Planning the ${route.from}–${route.to} prairie corridor</h2><div class="pcm-step34-card-grid"><article><h3>${route.from} pickup logistics</h3><p>${route.pickup}</p></article><article><h3>${route.to} delivery logistics</h3><p>${route.delivery}</p></article><article><h3>Prairie weather and highway timing</h3><p>Highway conditions can change quickly across Alberta, Saskatchewan, and Manitoba. Build flexibility into winter dates and keep essential medication, documents, chargers, and first-night items with you.</p></article><article><h3>Apartments, condos, and access</h3><p>Confirm elevator reservations, loading windows, parking permissions, stairs, long carries, and truck access before the written estimate is finalized.</p></article></div><h2>Why choose Purely Canadian Movers</h2><ul class="pcm-step34-proof"><li>Family-owned Canadian moving company since 1991.</li><li>Great Canadian Van Lines agent network with accountable route coordination.</li><li>Clear written estimates with pricing and requested services explained.</li><li>No moving brokers or random subcontractors.</li><li>Packing, storage, delivery planning, and Declared Value Protection options are available.</li></ul><h2>How your ${route.from}–${route.to} move works</h2><div class="pcm-step34-process"><article><b>1</b><h3>Written estimate</h3><p>Share inventory, access, services, and preferred dates.</p></article><article><b>2</b><h3>Pack and load</h3><p>We pack if requested and load carefully at your ${route.from} origin.</p></article><article><b>3</b><h3>Prairie transit</h3><p>Your shipment is coordinated across the ${route.distance} route.</p></article><article><b>4</b><h3>Delivery</h3><p>We unload at your ${route.to} destination, subject to access.</p></article></div><blockquote>“The crew kept our ${route.from} pickup and ${route.to} delivery organized from start to finish.”<span>— Purely Canadian Movers customer</span></blockquote></div>`;
    return section;
  }

  function normalize() {
    const shell = document.querySelector(`[data-pcm-static-route]`);
    const quote = document.querySelector(".pcm-lead-panel");
    const main = shell?.querySelector("main");
    if (!shell || !quote || !main) return;

    const trust = quote.querySelector(".pcm-trust-row");
    if (trust) {
      const values = ["Family-owned since 1991", "BBB Accredited business", "No brokers or subcontractors", "Declared Value Protection available", "Great Canadian Van Lines agent", "Written estimates and route planning"];
      trust.replaceChildren(...values.map((value) => Object.assign(document.createElement("span"), { textContent: value })));
    }
    const from = quote.querySelector('[name="from"]');
    const to = quote.querySelector('[name="to"]');
    if (from) { from.value = route.fromFull; from.defaultValue = route.fromFull; }
    if (to) { to.value = route.toFull; to.defaultValue = route.toFull; }

    document.querySelectorAll(".pcm-route-cost").forEach((node) => node.remove());
    const legacyPricing = sectionByHeading(/^How much does it cost to move from/i);
    legacyPricing?.remove();
    quote.insertAdjacentElement("afterend", buildPricing());

    const faq = sectionByHeading(/^Frequently Asked Questions$/i);
    const related = sectionByHeading(/^Related Destinations/i);
    const closing = sectionByHeading(/^Ready to Move from /i);
    const hero = main.querySelector("section");
    const trustStrip = hero?.nextElementSibling;
    [...main.children].forEach((child) => {
      if (![hero, trustStrip, faq, related, closing].includes(child)) child.remove();
    });
    trustStrip?.insertAdjacentElement("afterend", buildMain());
    faq?.classList.add("pcm-route-faq-static");
    related?.classList.add("pcm-step34-related");
    closing?.classList.add("pcm-step34-closing");
    document.documentElement.setAttribute("data-pcm-step34-ready", "1");

    const menuTrigger = document.querySelector('header button[aria-label="Open menu"]');
    const mobilePanel = document.querySelector(".pcm-static-mobile");
    const menuClose = mobilePanel?.querySelector('button[aria-label="Close menu"]');
    if (menuTrigger && mobilePanel && menuClose) {
      menuTrigger.setAttribute("aria-expanded", mobilePanel.classList.contains("is-open") ? "true" : "false");
      menuTrigger.addEventListener("click", () => setTimeout(() => menuTrigger.setAttribute("aria-expanded", String(mobilePanel.classList.contains("is-open"))), 0));
      menuClose.addEventListener("click", () => menuTrigger.setAttribute("aria-expanded", "false"));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobilePanel.classList.contains("is-open")) {
          menuClose.click();
          menuTrigger.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", normalize, { once: true });
  else normalize();
})();
