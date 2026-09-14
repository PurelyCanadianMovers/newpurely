(function () {
  "use strict";
  var node = document.getElementById("pcm-step38-config");
  if (!node) return;
  var config = JSON.parse(node.textContent);
  var applying = false;
  var clean = function (value) { return String(value || "").replace(/\s+/g, " ").trim(); };
  var esc = function (value) { return String(value).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function section(pattern) {
    return Array.prototype.find.call(document.querySelectorAll("main section"), function (item) {
      var heading = item.querySelector("h1,h2,h3");
      return heading && pattern.test(clean(heading.textContent));
    });
  }
  function setValue(input, value) {
    if (!input) return;
    if (input.value !== value) input.value = value;
    if (input.getAttribute("value") !== value) input.setAttribute("value", value);
    if (input.placeholder !== value) input.placeholder = value;
  }
  function pricingMarkup() {
    var rows = config.rows.map(function (row) { return "<tr>" + row.map(function (cell) { return "<td>" + esc(cell) + "</td>"; }).join("") + "</tr>"; }).join("");
    return '<section class="pcm-lead-boost pcm-route-cost pcm-step38-pricing" aria-label="' + esc(config.routeLabel) + ' moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">' + esc(config.routeLabel) + ' moving cost</div><h2>How much does it cost to move from ' + esc(config.origin) + ' to ' + esc(config.destination) + '?</h2><p>A ' + esc(config.routeLabel) + ' move uses an overall planning range of <strong>' + esc(config.range) + '</strong>. Shipment size, actual weight or volume, access, packing, storage, season, and protection choices affect the written estimate.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges, not guaranteed quotes. Final pricing depends on shipment weight or volume, access, packing, storage, season, and the selected Declared Value Protection option.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Long-Distance Moving Cost Guide</a><a href="/valuation-coverage-protection/">Declared Value Protection</a></div></div></section>';
  }
  function mainMarkup() {
    var cards = [config.pickupCopy, config.corridorCopy, config.deliveryCopy, "Seasonal weather across the Prairies, Northern Ontario, and the mountain approaches can affect long-distance scheduling. Build flexibility into access dates and keep essentials with you."].map(function (copy, index) { return '<div class="pcm-step38-card"><h3>' + [config.origin + " pickup and access", "Interprovincial route planning", config.destination + " delivery and access", "Seasonal corridor considerations"][index] + '</h3><p>' + esc(copy) + '</p></div>'; }).join("");
    var steps = [["1","Written Estimate","We review inventory, access, services, timing, and protection choices before pricing is confirmed in writing."],["2",config.origin + " Pickup","The moving team prepares and loads the shipment around the confirmed origin access plan."],["3","Interprovincial Transit","The shipment is coordinated through Purely Canadian Movers and the Great Canadian Van Lines agent network with a documented delivery window."],["4",config.destination + " Delivery","Destination access is confirmed and belongings are placed in the requested rooms after arrival."]].map(function (step) { return '<div class="pcm-step38-process"><span>' + step[0] + '</span><h3>' + esc(step[1]) + '</h3><p>' + esc(step[2]) + '</p></div>'; }).join("");
    return '<section class="pcm-step38-main py-16 bg-white"><div class="container max-w-4xl"><h2>Moving from ' + esc(config.origin) + ' to ' + esc(config.destination) + '?</h2><p>The ' + esc(config.pairLabel) + ' corridor is one of Canada’s busiest interprovincial long-distance routes. Purely Canadian Movers plans the move around documented inventory, building access, service requirements, and realistic pickup and delivery windows.</p><p>As an authorized Great Canadian Van Lines agent, Purely Canadian Movers combines national network reach with direct local accountability. The move is coordinated without broker-style handoffs to unknown movers.</p><p>We also handle the reverse: <a href="' + esc(config.reverseRoute) + '">' + esc(config.reverseLabel) + '</a> follow the same documented planning standard while retaining their own pickup and delivery details.</p><div class="pcm-step38-glance"><h3>' + esc(config.pairLabel) + ' Route at a Glance</h3><div class="pcm-step38-glance__grid"><div><span>↔</span><p><small>Distance</small><strong>' + esc(config.distance) + '</strong><em>' + esc(config.routeLabel) + '</em></p></div><div><span>◷</span><p><small>Estimated transit time</small><strong>' + esc(config.transit) + '</strong><em>Depending on shipment and schedule</em></p></div><div><span>$</span><p><small>Typical cost range</small><strong>' + esc(config.range) + '</strong><em>Studio to 4+ bedroom home</em></p></div></div></div><h2>Planning Your ' + esc(config.pairLabel) + ' Move</h2><div class="pcm-step38-card-grid">' + cards + '</div><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-step38-proof"><li>Family-owned since 1991</li><li>Authorized Great Canadian Van Lines agent</li><li>No moving brokers or random subcontractors</li><li>BBB Accredited business</li><li>Written-estimate planning with no guaranteed-price claims</li><li>Packing, unpacking, storage, and Declared Value Protection options</li></ul><div class="pcm-step38-warning"><strong>Watch out for low-ball quotes.</strong> Ask for a written estimate that documents inventory, access, services, timing, and protection choices before signing.</div><h2>How Your ' + esc(config.pairLabel) + ' Move Works</h2><div class="pcm-step38-process-grid">' + steps + '</div></div></section>';
  }
  function replaceFaqSchema() {
    var value = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: config.faqs.map(function (faq) { return { "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } }; }) });
    var matches = Array.prototype.filter.call(document.querySelectorAll('script[type="application/ld+json"]'), function (script) { try { return JSON.parse(script.textContent)["@type"] === "FAQPage"; } catch (_) { return false; } });
    if (matches.length === 1 && matches[0].textContent === value) return;
    matches.forEach(function (script) { script.remove(); });
    var schema = document.createElement("script"); schema.type = "application/ld+json"; schema.id = "faq-schema"; schema.textContent = value; document.head.appendChild(schema);
  }
  function normalizeMetadata() {
    var title = config.routeLabel + " Movers | Purely Canadian Movers";
    if (document.title !== title) document.title = title;
    [["meta[property=\"og:title\"]", title], ["meta[name=\"twitter:title\"]", title], ["meta[name=\"description\"]", config.description], ["meta[property=\"og:description\"]", config.description], ["meta[name=\"twitter:description\"]", config.description], ["meta[property=\"og:url\"]", "https://purelycanadianmovers.com" + location.pathname]].forEach(function (entry) { var item = document.querySelector(entry[0]); if (item && item.content !== entry[1]) item.content = entry[1]; });
    var canonical = document.querySelector('link[rel="canonical"]'); var href = "https://purelycanadianmovers.com" + location.pathname; if (canonical && canonical.href !== href) canonical.href = href;
  }
  function ensureDialogDescriptions() {
    document.querySelectorAll('[role="dialog"]').forEach(function (dialog, index) {
      if (dialog.getAttribute("aria-describedby")) return;
      var id = "pcm-step38-dialog-description-" + index;
      var description = document.getElementById(id);
      if (!description) { description = document.createElement("p"); description.id = id; description.className = "pcm-step38-sr-only"; description.textContent = "Navigation or moving-assistant panel."; dialog.insertBefore(description, dialog.firstChild); }
      dialog.setAttribute("aria-describedby", id);
    });
  }
  function apply() {
    if (applying) return; applying = true;
    try {
      var root = document.getElementById("root"); var app = root && root.querySelector(".min-h-screen.flex.flex-col"); var quote = root && root.querySelector(".pcm-lead-panel"); var h1 = document.querySelector("h1");
      if (!root || !app || !quote || !h1 || clean(h1.textContent) !== config.routeLabel + " Movers") return;
      document.documentElement.classList.add("pcm-step38-toronto-vancouver");
      quote.setAttribute("aria-label", config.routeLabel + " free moving estimate");
      var eyebrow = quote.querySelector(".pcm-lead-panel__eyebrow"); if (eyebrow && clean(eyebrow.textContent) !== config.routeLabel + " estimate") eyebrow.textContent = config.routeLabel + " estimate";
      var qh = quote.querySelector("h2"); if (qh && clean(qh.textContent) !== "Request a " + config.routeLabel + " moving quote") qh.textContent = "Request a " + config.routeLabel + " moving quote";
      setValue(quote.querySelector('[name="from"]'), config.originValue); setValue(quote.querySelector('[name="to"]'), config.destinationValue);
      root.querySelectorAll(".pcm-route-cost").forEach(function (item) { if (!item.classList.contains("pcm-step38-pricing")) item.remove(); });
      var pricing = document.querySelector(".pcm-step38-pricing"); if (!pricing) { quote.insertAdjacentHTML("afterend", pricingMarkup()); pricing = quote.nextElementSibling; } if (pricing.parentElement !== root || pricing.nextElementSibling !== app) root.insertBefore(pricing, app);
      var main = app.querySelector("main"); if (!main) return;
      var hero = h1.closest("section"); var heroIntro = hero && Array.prototype.find.call(hero.querySelectorAll("p"), function (item) { return /^Professional,/i.test(clean(item.textContent)); });
      var heroCopy = "Professional interprovincial long-distance moving from " + config.origin + " to " + config.destination + ". Family-owned since 1991, with written-estimate planning and authorized Great Canadian Van Lines network support.";
      if (heroIntro && clean(heroIntro.textContent) !== heroCopy) heroIntro.textContent = heroCopy;
      var related = section(/^Related Destinations$/i); var closing = section(/^Ready to Move from /i);
      var trust = Array.prototype.find.call(main.children, function (item) { return /Trusted by thousands of Canadian families/i.test(clean(item.textContent)); });
      var currentMain = main.querySelector(".pcm-step38-main"); if (!currentMain) { if (trust) trust.insertAdjacentHTML("afterend", mainMarkup()); else if (related) related.insertAdjacentHTML("beforebegin", mainMarkup()); else main.insertAdjacentHTML("afterbegin", mainMarkup()); currentMain = main.querySelector(".pcm-step38-main"); }
      Array.prototype.slice.call(main.querySelectorAll("section")).forEach(function (item) { var isHero = Boolean(item.querySelector("h1")); var isTrust = /Trusted by thousands of Canadian families/i.test(clean(item.textContent)); if (item !== currentMain && item !== related && item !== closing && !item.classList.contains("pcm-route-faq-static") && !isHero && !isTrust) item.remove(); });
      var faq = document.querySelector(".pcm-route-faq-static"); if (faq) { faq.className = "pcm-route-faq-static py-16 bg-gray-50"; if (faq.parentElement !== main || faq.nextElementSibling !== related) main.insertBefore(faq, related || closing || null); }
      if (related && related.parentElement === main && closing && related.nextElementSibling !== closing) main.insertBefore(related, closing);
      document.querySelectorAll(".pcm-local-seo").forEach(function (item) { item.remove(); });
      replaceFaqSchema(); normalizeMetadata(); ensureDialogDescriptions(); document.documentElement.setAttribute("data-pcm-step38-ready", "1");
    } finally { applying = false; }
  }
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true }); apply(); document.addEventListener("DOMContentLoaded", apply); window.addEventListener("load", apply); [0,250,800,1800,4000,8000].forEach(function (delay) { setTimeout(apply, delay); });
}());
