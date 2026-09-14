import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] ?? "site-copy";

const sharedFacts = Object.freeze({
  distance: "~4,800 km",
  distanceProse: "4,800 km",
  transit: "8–20 days",
  transitProse: "8 to 20 days",
  priceRange: "$2,600–$16,000+",
  pricing: Object.freeze([
    Object.freeze({ homeSize: "Studio or small shipment", price: "$2,600+" }),
    Object.freeze({ homeSize: "1-bedroom", price: "$3,900+" }),
    Object.freeze({ homeSize: "2-bedroom", price: "$6,500+" }),
    Object.freeze({ homeSize: "3-bedroom", price: "$11,000+" }),
    Object.freeze({ homeSize: "4+ bedroom", price: "$16,000+" }),
  ]),
});

const routes = [
  {
    slug: "halifax-to-calgary-movers",
    origin: "Halifax",
    destination: "Calgary",
    originProvince: "Nova Scotia",
    destinationProvince: "Alberta",
    originCode: "NS",
    destinationCode: "AB",
    ...sharedFacts,
  },
  {
    slug: "calgary-to-halifax-movers",
    origin: "Calgary",
    destination: "Halifax",
    originProvince: "Alberta",
    destinationProvince: "Nova Scotia",
    originCode: "AB",
    destinationCode: "NS",
    ...sharedFacts,
  },
];
assertRouteOwnership("generate-halifax-calgary-route-pages.mjs", routes);

const unsupportedReactBootstrap = /\s*<script\b[^>]*\btype="module"[^>]*\bsrc="(?:\.\.\/)?assets\/index-[^"]+\.js"[^>]*><\/script>/i;
const unsupportedReactBootstrapMarker = /<script\b[^>]*\bsrc="[^\"]*\/assets\/index-[^\"]+\.js"[^>]*>/i;
const staticHeadAssets = [
  '<link rel="stylesheet" href="/assets/static-nav.css">',
  '<link rel="stylesheet" href="/assets/static-chat.css">',
].join("\n");
const staticBodyAssets = [
  '<script defer src="/assets/static-nav.js"></script>',
  '<script defer src="/assets/static-chat.js"></script>',
].join("\n");

const writtenEstimatePlanning = '<div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed in writing.</span></div></div>';

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`${label}: required source anchor missing`);
  pattern.lastIndex = 0;
  return html.replace(pattern, replacement);
}

function setTagAttribute(tag, attribute, value) {
  const pattern = new RegExp(`\\b${attribute}=(['"])[\\s\\S]*?\\1`, "i");
  if (!pattern.test(tag)) throw new Error(`attribute ${attribute} missing from ${tag.slice(0, 80)}`);
  return tag.replace(pattern, `${attribute}="${value}"`);
}

function updateMatchedTag(html, pattern, attribute, value, label) {
  return replaceRequired(html, pattern, (tag) => setTagAttribute(tag, attribute, value), label);
}

function upsertTagAttribute(tag, attribute, value) {
  const pattern = new RegExp(`\\b${attribute}=(['"])[\\s\\S]*?\\1`, "i");
  if (pattern.test(tag)) return tag.replace(pattern, `${attribute}="${value}"`);
  return tag.replace(/>$/, ` ${attribute}="${value}">`);
}

function removeSectionByMarker(html, marker) {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return html;
  const start = html.lastIndexOf("<section", markerIndex);
  const end = html.indexOf("</section>", markerIndex);
  if (start < 0 || end < 0) throw new Error(`section boundaries missing for ${marker}`);
  return html.slice(0, start) + html.slice(end + "</section>".length);
}

function sectionContaining(html, marker) {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) throw new Error(`section marker missing: ${marker}`);
  const start = html.lastIndexOf("<section", markerIndex);
  const end = html.indexOf("</section>", markerIndex);
  if (start < 0 || end < 0) throw new Error(`section boundaries missing for ${marker}`);
  return { start, end: end + "</section>".length, html: html.slice(start, end + "</section>".length) };
}

function containerContent(sectionHtml) {
  const sectionOpenEnd = sectionHtml.indexOf(">");
  const sectionCloseStart = sectionHtml.lastIndexOf("</section>");
  if (sectionOpenEnd < 0 || sectionCloseStart < 0) throw new Error("invalid section HTML");
  const content = sectionHtml.slice(sectionOpenEnd + 1, sectionCloseStart).trim();
  const containerOpen = content.match(/^<div\b[^>]*\bclass="[^"]*\bcontainer\b[^"]*"[^>]*>/i);
  if (!containerOpen || !content.endsWith("</div>")) throw new Error("section container boundaries missing");
  return content.slice(containerOpen[0].length, -"</div>".length);
}

function canonicalGlance(route) {
  const icon = (name, body) => `<div class="mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name} text-[#CC1A1A]" aria-hidden="true">${body}</svg></div>`;
  const card = (iconHtml, label, value, detail) => `<div class="flex items-start gap-3">${iconHtml}<div><p class="font-body text-xs text-gray-500 uppercase tracking-wider mb-0.5">${label}</p><p class="font-heading text-lg font-bold text-gray-900">${value}</p><p class="font-body text-sm text-gray-500">${detail}</p></div></div>`;
  return `<div class="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10"><h3 class="font-heading text-xl font-bold text-gray-900 mb-4">${route.origin}–${route.destination} Route at a Glance</h3><div class="grid sm:grid-cols-3 gap-4">${card(icon("map-pin", '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>'), "Distance", route.distance, `${route.origin} to ${route.destination}`)}${card(icon("clock", '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'), "Est. Transit Time", route.transit, "Depending on shipment size")}${card(icon("dollar-sign", '<line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'), "Typical Cost Range", route.priceRange, "Studio to 4+ bedroom home")}</div></div>`;
}

function normalizeMainContent(html, route) {
  if (html.includes('data-pcm-route-main="1"')) {
    const main = sectionContaining(html, 'data-pcm-route-main="1"');
    const normalized = main.html.replaceAll('class="font-heading text-lg font-bold text-gray-900 mb-2"', 'class="font-heading text-base font-bold text-gray-900 mb-2"');
    return html.slice(0, main.start) + normalized + html.slice(main.end);
  }
  const intro = sectionContaining(html, `Moving from ${route.origin} to ${route.destination}?`);
  const glance = sectionContaining(html, "Route at a Glance");
  const unique = sectionContaining(html, `What Makes a ${route.origin}–${route.destination} Move Unique`);
  const tips = sectionContaining(html, `Tips for Moving to ${route.destination}`);
  const proof = sectionContaining(html, "Why Choose Purely Canadian Movers");
  const process = sectionContaining(html, `How Your ${route.origin}–${route.destination} Move Works`);
  const ordered = [intro, glance, unique, tips, proof, process].sort((a, b) => a.start - b.start);
  for (let index = 1; index < ordered.length; index += 1) {
    const between = html.slice(ordered[index - 1].end, ordered[index].start).trim();
    if (between) throw new Error(`${route.slug}: unexpected content between route sections`);
  }

  let introHtml = containerContent(intro.html);
  introHtml = introHtml.replace(
    /^(<h2\b[\s\S]*?<\/h2>)([\s\S]*)$/i,
    (_match, heading, body) => `${heading}<div class="space-y-4 font-body text-lg text-gray-700 leading-relaxed mb-10">${body.replace(/\sclass="font-body text-gray-700 text-lg leading-relaxed(?: mb-4)?"/g, "")}</div>`,
  );

  let uniqueHtml = containerContent(unique.html)
    .replace('class="font-heading text-3xl font-bold text-gray-900 mb-6"', 'class="font-heading text-2xl font-bold text-gray-900 mb-6"')
    .replace('class="space-y-4 font-body text-gray-700 text-lg leading-relaxed"', 'class="space-y-4 font-body text-gray-700 leading-relaxed mb-10"');

  let tipsHtml = containerContent(tips.html)
    .replace('class="font-heading text-3xl font-bold text-gray-900 mb-10 text-center"', 'class="font-heading text-2xl font-bold text-gray-900 mb-6"')
    .replace('class="grid grid-cols-1 md:grid-cols-2 gap-6"', 'class="grid sm:grid-cols-2 gap-4 mb-10"')
    .replaceAll('class="bg-gray-50 rounded-xl p-6 border border-gray-200"', 'class="bg-gray-50 rounded-xl p-5 border border-gray-200"')
    .replaceAll('class="font-heading text-xl font-bold text-gray-900 mb-2"', 'class="font-heading text-base font-bold text-gray-900 mb-2"')
    .replaceAll('class="font-heading text-lg font-bold text-gray-900 mb-2"', 'class="font-heading text-base font-bold text-gray-900 mb-2"')
    .replaceAll('class="font-body text-gray-600 leading-relaxed"', 'class="font-body text-gray-600 text-sm leading-relaxed"');

  let proofHtml = containerContent(proof.html)
    .replace('class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center"', 'class="font-heading text-2xl font-bold text-gray-900 mb-6"')
    .replace('class="space-y-3"', 'class="space-y-3 mb-6"')
    .replace('class="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-xl font-body text-sm text-amber-800 leading-relaxed"', 'class="p-5 bg-amber-50 border border-amber-200 rounded-xl font-body text-sm text-amber-800 leading-relaxed mb-10"');

  let processHtml = containerContent(process.html)
    .replace('class="font-heading text-3xl font-bold text-gray-900 mb-12 text-center"', 'class="font-heading text-2xl font-bold text-gray-900 mb-6"')
    .replace('class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"', 'class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"')
    .replaceAll('class="relative text-center"', 'class="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center"');

  const merged = `<section class="py-16 bg-white" data-pcm-route-main="1"><div class="container max-w-4xl">${introHtml}${uniqueHtml}${canonicalGlance(route)}${tipsHtml}${proofHtml}${processHtml}</div></section>`;
  return html.slice(0, ordered[0].start) + merged + html.slice(ordered.at(-1).end);
}

function normalizeFaqPresentation(html) {
  const faq = sectionContaining(html, "Frequently Asked Questions");
  const nextFaq = faq.html
    .replace('class="font-heading text-3xl font-bold text-gray-900 mb-10 text-center"', 'class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center"')
    .replace('class="space-y-6"', 'class="space-y-4"')
    .replaceAll('class="font-heading text-lg font-bold text-gray-900 mb-2"', 'class="font-heading text-base font-bold text-gray-900 mb-2"')
    .replaceAll('class="font-body text-gray-700 leading-relaxed"', 'class="font-body text-gray-600 text-sm leading-relaxed"');
  return html.slice(0, faq.start) + nextFaq + html.slice(faq.end);
}

function mergeRouteTestimonial(html) {
  const faq = sectionContaining(html, "Frequently Asked Questions");
  const related = sectionContaining(html, "Related Destinations");
  const between = html.slice(faq.end, related.start);
  const testimonialStart = between.indexOf("<section");
  if (testimonialStart < 0) return html;
  const testimonialEnd = between.indexOf("</section>", testimonialStart);
  if (testimonialEnd < 0 || between.indexOf("<section", testimonialEnd) >= 0) {
    throw new Error("unexpected sections between FAQ and related destinations");
  }
  const testimonial = between.slice(testimonialStart, testimonialEnd + "</section>".length);
  const main = sectionContaining(html, 'data-pcm-route-main="1"');
  const withTestimonial = main.html.replace(
    /<\/div><\/section>$/i,
    `<div class="max-w-3xl mx-auto mb-10">${containerContent(testimonial)}</div></div></section>`,
  );
  return (html.slice(0, main.start) + withTestimonial + html.slice(main.end)).replace(testimonial, "");
}

function removeBrokerComparison(html) {
  const marker = 'class="pcm-lead-boost pcm-broker-compare"';
  if (!html.includes(marker)) return html;
  return removeSectionByMarker(html, marker);
}

function normalizeRouteSpecificCopy(html, route) {
  if (route.slug !== "calgary-to-halifax-movers") return html;
  return html
    .replace("<strong>Halifax's climate:</strong> Chinook winds can create dramatic temperature swings in a single day. If you're moving in winter, we plan accordingly — protecting wood furniture, electronics, and temperature-sensitive items during transit.", "<strong>Halifax's coastal climate:</strong> Atlantic wind, salt air, rain, snow, and freeze-thaw conditions can all affect access and handling. We plan winter and shoulder-season moves carefully and protect wood furniture, electronics, and temperature-sensitive items during transit.")
    .replace("<strong>Energy sector relocations:</strong> Many Calgary-to-Halifax moves are corporate or employment-driven. We work with individuals and HR departments to accommodate tight timelines and provide the documentation needed for relocation reimbursement.", "<strong>Employment-driven relocations:</strong> Many Calgary-to-Halifax moves are connected to work in government, health care, education, defence, or the port economy. We work with individuals and HR departments to accommodate tight timelines and provide documentation for relocation reimbursement.")
    .replace("Beltline and East Village moves often involve high-rise loading docks, elevator bookings, and limited curb space. Suburban communities such as Tuscany, Seton, and Mahogany may offer easier truck access but longer travel between neighbourhoods.", "Downtown Halifax, the North End, and the South End often involve high-rise loading docks, elevator bookings, narrow streets, and limited curb space. Clayton Park, Bedford, and Dartmouth may offer different truck-access conditions and longer travel between neighbourhoods.")
    .replace("Nova Scotia has no provincial sales tax, so most taxable purchases are subject to 5% GST instead of Alberta’s 13% HST. Include that difference when comparing household expenses, services, and your post-move budget.", "Nova Scotia uses a harmonized sales tax, unlike Alberta's GST-only system. Include the difference when comparing household expenses, services, and your post-move budget.")
    .replace("Halifax can shift quickly between cold snaps and warmer Chinook conditions. Pack layered clothing where it is easy to reach, protect entry floors from snow and grit, and identify temperature-sensitive belongings that should not sit in an unheated space.", "Halifax weather can shift quickly between rain, wet snow, coastal wind, and freeze-thaw conditions. Pack waterproof layers where they are easy to reach, protect entry floors from moisture and grit, and identify temperature-sensitive belongings that should not sit in an unheated space.");
}

function preserveRouteMetadata(html, route) {
  const canonical = `https://purelycanadianmovers.com/${route.slug}/`;
  const title = `${route.origin} to ${route.destination} Movers | ${route.originProvince} to ${route.destinationProvince} Moving | Purely Canadian Movers`;
  const description = `${route.origin} to ${route.destination} moving cost guide with estimated prices by home size, 8–20 day transit time, quote factors, packing, storage, Declared Value Protection, and direct movers.`;
  const script = `<script data-pcm-route-meta>document.addEventListener("DOMContentLoaded",function(){var expected=${JSON.stringify({ title, description, canonical })};function apply(){if(document.title!==expected.title)document.title=expected.title;var values=[["meta[name='description']","content",expected.description],["meta[property='og:description']","content",expected.description],["meta[property='og:url']","content",expected.canonical],["link[rel='canonical']","href",expected.canonical]];values.forEach(function(item){var element=document.querySelector(item[0]);if(element&&element.getAttribute(item[1])!==item[2])element.setAttribute(item[1],item[2]);});}var menuButton=document.querySelector('button[aria-label="Open menu"]');function mobileMenu(){return document.querySelector(".pcm-static-mobile");}function syncMenu(){var menu=mobileMenu();if(menuButton)menuButton.setAttribute("aria-expanded",menu&&menu.classList.contains("is-open")?"true":"false");}document.addEventListener("keydown",function(event){var menu=mobileMenu();if(event.key!=="Escape"||!menu||!menu.classList.contains("is-open"))return;var closeButton=menu.querySelector('button[aria-label="Close menu"]');if(closeButton)closeButton.click();else{menu.classList.remove("is-open");syncMenu();if(menuButton)menuButton.focus();}});new MutationObserver(apply).observe(document.head,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["content","href"]});new MutationObserver(syncMenu).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});apply();syncMenu();});</script>`;
  if (html.includes("data-pcm-route-meta")) {
    return html.replace(/<script\b[^>]*\bdata-pcm-route-meta[^>]*>[\s\S]*?<\/script>/i, script);
  }
  return html.replace("</body>", `${script}</body>`);
}

function stripTags(value) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function updateFaqSchemaFromVisibleFaq(html) {
  const faq = sectionContaining(html, "Frequently Asked Questions");
  const mainEntity = [...faq.html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => ({
    "@type": "Question",
    name: stripTags(match[1]),
    acceptedAnswer: { "@type": "Answer", text: stripTags(match[2]) },
  }));
  if (!mainEntity.length) throw new Error("visible route FAQ questions missing");

  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity });
  const faqSchemas = [...html.matchAll(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi)]
    .map((match) => match[0])
    .filter((script) => script.includes('"@type":"FAQPage"'));
  if (faqSchemas.length !== 1) throw new Error(`expected one route FAQ schema, found ${faqSchemas.length}`);
  return html.replace(faqSchemas[0], `<script type="application/ld+json" id="faq-schema">${schema}</script>`);
}

function updatePricingTable(section, route) {
  return replaceRequired(
    section,
    /(<tbody>)([\s\S]*?)(<\/tbody>)/i,
    (_match, open, body, close) => {
      const rows = [...body.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)].map((match) => match[0]);
      if (rows.length !== route.pricing.length) {
        throw new Error(`${route.slug}: expected ${route.pricing.length} pricing rows, found ${rows.length}`);
      }
      const updatedRows = rows.map((row, index) => {
        const cells = [...row.matchAll(/<td\b[^>]*>[\s\S]*?<\/td>/gi)].map((match) => match[0]);
        if (cells.length !== 4) throw new Error(`${route.slug}: pricing row ${index + 1} has ${cells.length} cells`);
        cells[0] = cells[0].replace(/(<td\b[^>]*>)[\s\S]*?(<\/td>)/i, (_cell, openCell, closeCell) => `${openCell}${route.pricing[index].homeSize}${closeCell}`);
        cells[1] = cells[1].replace(/(<td\b[^>]*>)[\s\S]*?(<\/td>)/i, (_cell, openCell, closeCell) => `${openCell}${route.pricing[index].price}${closeCell}`);
        cells[3] = cells[3].replace(/(<td\b[^>]*>)[\s\S]*?(<\/td>)/i, (_cell, openCell, closeCell) => `${openCell}${route.transit}${closeCell}`);
        let cellIndex = 0;
        return row.replace(/<td\b[^>]*>[\s\S]*?<\/td>/gi, () => cells[cellIndex++]);
      });
      return open + updatedRows.join("") + close;
    },
    `${route.slug} pricing table`,
  );
}

function makeStandalone(html, route) {
  const withoutReactBootstrap = html.replace(unsupportedReactBootstrap, "");
  if (unsupportedReactBootstrapMarker.test(withoutReactBootstrap)) {
    throw new Error(`${route.slug}: unsupported React bootstrap could not be removed`);
  }

  let next = withoutReactBootstrap;
  if (!next.includes('href="/assets/static-nav.css"')) {
    next = next.replace("</head>", `  ${staticHeadAssets}\n</head>`);
  }
  if (!next.includes('src="/assets/static-nav.js"')) {
    const conversionScript = /(<script[^>]*src="\/assets\/conversion-boost\.js"[^>]*><\/script>)/i;
    if (!conversionScript.test(next)) {
      throw new Error(`${route.slug}: conversion script anchor missing for static assets`);
    }
    next = next.replace(conversionScript, `${staticBodyAssets}\n$1`);
  }
  return next;
}

function validateSnapshot(html, route) {
  const canonical = `https://purelycanadianmovers.com/${route.slug}/`;
  const expectedTitle = `${route.origin} to ${route.destination} Movers | ${route.originProvince} to ${route.destinationProvince} Moving | Purely Canadian Movers`;
  const expectedDescription = `${route.origin} to ${route.destination} moving cost guide with estimated prices by home size, 8–20 day transit time, quote factors, packing, storage, Declared Value Protection, and direct movers.`;
  const checks = [
    [html.includes(`<title>${expectedTitle}</title>`), "title"],
    [html.includes(`name="description" content="${expectedDescription}"`), "meta description"],
    [html.includes(`rel="canonical" id="canonical-tag" href="${canonical}"`), "self canonical"],
    [html.includes(`property="og:url" content="${canonical}"`), "OG URL"],
    [(html.match(/<h1\b/gi) ?? []).length === 1, "exactly one H1"],
    [html.includes(`${route.origin} to ${route.destination} Moving Cost, Prices &amp; Transit Time`), "directional H1"],
    [html.includes(`name="from" placeholder="${route.origin}, ${route.originCode}"`), "origin default"],
    [html.includes(`name="to" placeholder="${route.destination}, ${route.destinationCode}"`), "destination default"],
    [html.includes(route.distance), "distance"],
    [html.includes(route.transit), "transit time"],
    [route.pricing.every(({ price }) => html.includes(price)), "pricing rows"],
    [html.includes(route.priceRange), "pricing range"],
    [(html.match(/<table\b/gi) ?? []).length === 1, "one pricing table"],
    [(html.match(/Route at a Glance/gi) ?? []).length === 1, "one Route at a Glance"],
    [(html.match(/data-pcm-route-main=/gi) ?? []).length === 1, "one canonical main-content section"],
    [(html.match(/Frequently Asked Questions/gi) ?? []).length === 1, "one visible FAQ"],
    [(html.match(/"@type":"FAQPage"/g) ?? []).length === 1, "one FAQPage schema"],
    [(html.match(/class="pcm-lead-boost pcm-lead-panel"/gi) ?? []).length === 1, "one quote panel"],
    [!html.includes("pcm-broker-compare"), "no duplicate broker conversion section"],
    [!html.includes("undefined"), "no undefined"],
    [!html.includes("Page Not Found") && !html.includes("/404"), "no React 404"],
    [!html.includes("data-pcm-static-local-seo"), "no local-SEO contamination"],
    [!/<span class="pcm-estimate-bonus__deadline">/i.test(html), "no stale promotion"],
    [html.includes("Written estimate planning"), "written-estimate planning treatment"],
    [html.includes("Declared Value Protection"), "Declared Value Protection terminology"],
    [!sectionContaining(html, "pcm-route-cost").html.includes("valuation coverage"), "no legacy pricing protection terminology"],
    [!unsupportedReactBootstrapMarker.test(html), "no unsupported React route bootstrap"],
    [html.includes('href="/assets/static-nav.css"'), "static nav stylesheet"],
    [html.includes('href="/assets/static-chat.css"'), "static chat stylesheet"],
    [html.includes('src="/assets/static-nav.js"'), "static nav script"],
    [html.includes('src="/assets/static-chat.js"'), "static chat script"],
  ];
  const failed = checks.filter(([passed]) => !passed).map(([, name]) => name);
  if (failed.length) throw new Error(`${route.slug}: failed ${failed.join(", ")}`);
}

function routeSnapshot(source, route) {
  const canonical = `https://purelycanadianmovers.com/${route.slug}/`;
  const title = `${route.origin} to ${route.destination} Movers | ${route.originProvince} to ${route.destinationProvince} Moving | Purely Canadian Movers`;
  const description = `${route.origin} to ${route.destination} moving cost guide with estimated prices by home size, 8–20 day transit time, quote factors, packing, storage, Declared Value Protection, and direct movers.`;
  let html = source;

  html = replaceRequired(html, /<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${title}</title>`, `${route.slug} title`);
  html = updateMatchedTag(html, /<meta\b(?=[^>]*\bname="description")[^>]*>/i, "content", description, `${route.slug} meta description`);
  html = updateMatchedTag(html, /<meta\b(?=[^>]*\bproperty="og:description")[^>]*>/i, "content", description, `${route.slug} OG description`);
  html = updateMatchedTag(html, /<meta\b(?=[^>]*\bproperty="og:url")[^>]*>/i, "content", canonical, `${route.slug} OG URL`);
  html = updateMatchedTag(html, /<link\b(?=[^>]*\brel="canonical")[^>]*>/i, "href", canonical, `${route.slug} canonical`);
  html = replaceRequired(html, /<input\b(?=[^>]*\bname="from")[^>]*>/i, (tag) => upsertTagAttribute(upsertTagAttribute(tag, "placeholder", `${route.origin}, ${route.originCode}`), "value", `${route.origin}, ${route.originCode}`), `${route.slug} origin default`);
  html = replaceRequired(html, /<input\b(?=[^>]*\bname="to")[^>]*>/i, (tag) => upsertTagAttribute(upsertTagAttribute(tag, "placeholder", `${route.destination}, ${route.destinationCode}`), "value", `${route.destination}, ${route.destinationCode}`), `${route.slug} destination default`);

  html = html.replace(/<div class="pcm-estimate-bonus">[\s\S]*?<\/div><\/div>/i, writtenEstimatePlanning);
  html = html.replaceAll("Valuation coverage available", "Declared Value Protection available");
  html = html.replaceAll("basic valuation coverage", "basic Declared Value Protection");
  html = html.replaceAll("valuation coverage", "Declared Value Protection");

  const cost = sectionContaining(html, "pcm-route-cost");
  let costHtml = cost.html;
  costHtml = costHtml.replace(/(typically ranges from about <strong>)[^<]+(<\/strong>)/i, (_match, before, after) => `${before}${route.pricing[0].price}${after}`);
  costHtml = costHtml.replace(/(for a small shipment to <strong>)[^<]+(<\/strong>)/i, (_match, before, after) => `${before}${route.pricing.at(-1).price}${after}`);
  costHtml = costHtml.replace(/(Many 1-2 bedroom moves are estimated around <strong>)[^<]+(<\/strong>)/i, (_match, before, after) => `${before}${route.pricing[1].price.replace("+", "")}–${route.pricing[2].price}${after}`);
  costHtml = updatePricingTable(costHtml, route);
  html = html.slice(0, cost.start) + costHtml + html.slice(cost.end);

  html = replaceRequired(html, /(<(?:div|p)\b[^>]*>Distance<\/(?:div|p)>\s*<(?:div|p)\b[^>]*>)[^<]*(<\/(?:div|p)>)/i, (_match, before, after) => `${before}${route.distance}${after}`, `${route.slug} glance distance`);
  html = replaceRequired(html, /(<(?:div|p)\b[^>]*>Est\. Transit Time<\/(?:div|p)>\s*<(?:div|p)\b[^>]*>)[^<]*(<\/(?:div|p)>)/i, (_match, before, after) => `${before}${route.transit}${after}`, `${route.slug} glance transit`);
  html = replaceRequired(html, /(<(?:div|p)\b[^>]*>Typical Cost Range<\/(?:div|p)>\s*<(?:div|p)\b[^>]*>)[^<]*(<\/(?:div|p)>)/i, (_match, before, after) => `${before}${route.priceRange}${after}`, `${route.slug} glance pricing range`);
  html = replaceRequired(html, /(Distance and logistics:<\/strong>\s*At roughly )[\d,]+ km/i, `$1${route.distanceProse}`, `${route.slug} distance prose`);
  html = html.replace(/typically takes \d+ to \d+ days/g, `typically takes ${route.transitProse}`);
  html = html.replace(
    /The cost of a (Halifax to Calgary|Calgary to Halifax) move depends on the weight of your shipment and the distance\. A studio or 1-bedroom typically ranges from \$[\d,]+ to \$[\d,]+, while a 3-4 bedroom home can range from \$[\d,]+ to \$[\d,]+\+\./g,
    (_match, direction) => `Planning estimates for a ${direction} move start at ${route.pricing[0].price} for a studio, ${route.pricing[1].price} for a 1-bedroom, ${route.pricing[2].price} for a 2-bedroom, ${route.pricing[3].price} for a 3-bedroom, and ${route.pricing[4].price} for a 4+ bedroom home.`,
  );

  html = html.replace(/\s*<script\b[^>]*\bid="pcm-faq-schema"[^>]*>[\s\S]*?<\/script>/i, "");
  html = removeSectionByMarker(html, "data-pcm-static-local-seo");
  html = removeBrokerComparison(html);
  html = normalizeRouteSpecificCopy(html, route);
  html = normalizeMainContent(html, route);
  html = mergeRouteTestimonial(html);
  html = normalizeFaqPresentation(html);
  html = updateFaqSchemaFromVisibleFaq(html);
  html = makeStandalone(html, route);
  html = preserveRouteMetadata(html, route);
  html = html.replace(/[ \t]+(?=\r?$)/gm, "");
  validateSnapshot(html, route);
  return html;
}

for (const route of routes) {
  const outputPath = join(outDir, route.slug, "index.html");
  const source = await readFile(outputPath, "utf8");
  await writeFile(outputPath, routeSnapshot(source, route), "utf8");
  console.log(`Generated /${route.slug}/ from its checked-in route-specific source and explicit route data`);
}
