(function () {
  "use strict";

  var SECTION_ID = "toronto-calgary-relocation-resources";
  var FAQ_SELECTOR = ".pcm-step22-faq";
  var maxWaitMs = 12000;
  var startedAt = Date.now();
  var observer;
  var timer;

  function paragraph(text) {
    var node = document.createElement("p");
    node.textContent = text;
    return node;
  }

  function link(label, href) {
    var node = document.createElement("a");
    node.href = href;
    node.textContent = label;
    return node;
  }

  function linkParagraph(label, href) {
    var node = document.createElement("p");
    node.appendChild(link(label, href));
    return node;
  }

  function heading(level, text) {
    var node = document.createElement(level);
    node.textContent = text;
    return node;
  }

  function buildSection() {
    var section = document.createElement("section");
    section.id = SECTION_ID;
    section.className = "py-16 bg-white";

    var container = document.createElement("div");
    container.className = "container max-w-4xl";
    section.appendChild(container);

    container.appendChild(heading("h2", "Planning Your Move From Toronto to Calgary"));
    container.appendChild(paragraph("Moving from Toronto to Calgary involves more than transporting your household goods. Before moving day, many people also research housing, schools, neighbourhoods, travel, health coverage and day-to-day living costs in Calgary."));
    container.appendChild(paragraph("These resources can help while you plan your relocation."));

    container.appendChild(heading("h3", "Finding a Home in Calgary"));
    container.appendChild(paragraph("If you are still deciding where to live, Calgary rental listings can help you compare neighbourhoods, home sizes and current asking rents before you confirm your delivery address."));
    container.appendChild(linkParagraph("Calgary homes for rent on REALTOR.ca", "https://www.realtor.ca/ab/calgary/real-estate-for-rent"));
    container.appendChild(linkParagraph("Calgary rentals on RentFaster.ca", "https://www.rentfaster.ca/ab/calgary/"));
    container.appendChild(paragraph("You can request a Toronto-to-Calgary moving estimate even if your final Calgary address has not been confirmed yet."));

    container.appendChild(heading("h3", "Calgary Schools"));
    container.appendChild(paragraph("Families moving from Toronto may want to check school locations before choosing a Calgary neighbourhood. The Calgary Board of Education provides a school finder that allows families to research designated schools by address."));
    container.appendChild(linkParagraph("Find a Calgary school", "https://www.cbe.ab.ca/find-a-school"));

    container.appendChild(heading("h3", "Explore Calgary Neighbourhoods"));
    container.appendChild(paragraph("Where you live in Calgary can affect your commute, school options, housing type and moving-day access. Researching Calgary communities before signing a lease or purchasing a home can help you narrow down the right area for your household."));
    container.appendChild(linkParagraph("Explore Calgary communities", "https://www.calgary.ca/communities.html"));
    container.appendChild(paragraph("If you are moving into a condo, apartment or downtown building, let us know about elevator bookings, loading access or building restrictions when requesting your estimate."));

    container.appendChild(heading("h3", "Toronto to Calgary Flights"));
    container.appendChild(paragraph("Many people moving from Toronto to Calgary fly to Alberta while their household goods travel separately. Comparing flight schedules can help you coordinate your travel with your expected household-goods delivery window."));
    container.appendChild(linkParagraph("Compare Toronto to Calgary flights", "https://www.google.com/travel/flights/flights-from-toronto-to-calgary.html"));

    container.appendChild(heading("h3", "Moving From Ontario to Alberta"));
    container.appendChild(paragraph("If Calgary will become your permanent home, there are provincial requirements and administrative changes to consider after moving from Ontario to Alberta, including driver's licence, vehicle registration and other residency-related updates."));
    container.appendChild(linkParagraph("Moving to Alberta from another province", "https://www.alberta.ca/moving-to-alberta-from-within-canada"));

    container.appendChild(heading("h3", "Alberta Health Care After Your Move"));
    container.appendChild(paragraph("People relocating permanently from Ontario to Calgary should also review Alberta Health Care Insurance Plan requirements and the timing for applying after establishing Alberta residency."));
    container.appendChild(linkParagraph("Moving to Alberta - health coverage", "https://www.alberta.ca/ahcip-moving-to-alberta"));

    container.appendChild(heading("h3", "Setting Up Calgary Utilities"));
    container.appendChild(paragraph("Once you have your Calgary address, arranging utilities before delivery day can make the move-in process easier. The City of Calgary provides information for residents setting up water and utility accounts."));
    container.appendChild(linkParagraph("Set up Calgary utility services", "https://www.calgary.ca/water/water-utility/how-to-create-a-new-water-account.html"));

    container.appendChild(paragraph("Once your Calgary plans start coming together, Purely Canadian Movers can help with the household-move side of the relocation. We provide long-distance moving from Toronto to Calgary, with pickup at your current residence and delivery to your new Calgary home. You can request an estimate even if your Calgary address is not finalized yet."));
    return section;
  }

  function findFaq() {
    var reactRouteHeading = document.querySelector('h1[data-loc*="TorontoCalgaryMovers.tsx"]');
    if (!reactRouteHeading) return null;

    var faq = document.querySelector(FAQ_SELECTOR);
    if (faq) return faq;
    var headingNodes = document.querySelectorAll("h2, h3");
    for (var i = 0; i < headingNodes.length; i++) {
      if (/^Frequently Asked Questions$/i.test((headingNodes[i].textContent || "").trim())) {
        return headingNodes[i].closest("section");
      }
    }
    return null;
  }

  function stopWatching() {
    if (observer) observer.disconnect();
    if (timer) window.clearTimeout(timer);
  }

  function insertSection() {
    if (document.getElementById(SECTION_ID)) {
      stopWatching();
      return true;
    }

    var faq = findFaq();
    if (!faq || !faq.parentNode) return false;

    faq.parentNode.insertBefore(buildSection(), faq);
    stopWatching();
    return true;
  }

  function start() {
    if (insertSection()) return;

    observer = new MutationObserver(insertSection);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    timer = window.setInterval(function () {
      if (insertSection() || Date.now() - startedAt >= maxWaitMs) stopWatching();
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
