import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";
import { SEATTLE_VANCOUVER_FACTS as facts, SEATTLE_VANCOUVER_ROUTES as routes, assertSeattleVancouverRouteData } from "./seattle-vancouver-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const origin = "https://purelycanadianmovers.com";
routes.forEach(assertSeattleVancouverRouteData);
assertAllowedPostProcessor("finalize-seattle-vancouver-routes.mjs", routes);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
const routeName = (route) => `${route.from} to ${route.to}`;
const routeDash = (route) => `${route.from}–${route.to}`;
const routeUrl = (route) => `${origin}/${route.slug}/`;
const card = ([title, body]) => `<article class="pcm-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;

function schema(route) {
  return { "@context":"https://schema.org", "@graph":[
    { "@type":"Service", name:`${routeName(route)} movers`, serviceType:"Canada–U.S. cross-border household moving", url:routeUrl(route), provider:{"@id":`${origin}/#organization`}, areaServed:[{"@type":"City",name:route.from},{"@type":"City",name:route.to}], description:`${routeName(route)} cross-border household moving with five USD planning estimates, written scheduling, packing, storage, and protection options.` },
    { "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${origin}/`},{"@type":"ListItem",position:2,name:"Canada–USA Moving",item:`${origin}/canada-usa/`},{"@type":"ListItem",position:3,name:`${routeName(route)} Movers`,item:routeUrl(route)}] },
    { "@type":"FAQPage", mainEntity:route.faqs.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}})) },
  ] };
}

function replaceMeta(head, selector, value) {
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`, "i");
  if (!pattern.test(head)) throw new Error(`Expected head metadata not found: ${selector}`);
  return head.replace(pattern, `$1${escapeHtml(value)}$2`);
}

function buildHead(template, route) {
  const bodyStart = template.indexOf("<body");
  if (bodyStart < 0) throw new Error(`${route.slug}: source has no body`);
  let head = template.slice(0, bodyStart)
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapeHtml(route.title)}">${escapeHtml(route.title)}</title>`)
    .replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${routeUrl(route)}">`)
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    .replace(/\s*<script\b[^>]*src="[^"]*(?:static-nav|static-chat|conversion-boost|step49-seattle-vancouver)\.js"[^>]*><\/script>/gi, "")
    .replace(/\s*<link[^>]+step49-seattle-vancouver\.css[^>]*>/gi, "")
    .replace(/\s*<link[^>]+static-(?:nav|chat)\.css[^>]*>/gi, "");
  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:title"', route.title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', routeUrl(route));
  head = replaceMeta(head, 'name="twitter:title"', route.title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);
  return head.replace(/\s*<\/head>/i, `    <link rel="stylesheet" href="/assets/static-nav.css">\n    <link rel="stylesheet" href="/assets/static-chat.css">\n    <link rel="stylesheet" href="/assets/step49-seattle-vancouver.css">\n    <script type="application/ld+json" id="route-schema">${JSON.stringify(schema(route))}</script>\n</head>`);
}

function extract(template, pattern, label, route) {
  const match = template.match(pattern);
  if (!match) throw new Error(`${route.slug}: source has no ${label}`);
  return match[0];
}

function quotePanel(route) {
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate"><div class="pcm-top-estimate"><div class="pcm-top-estimate__intro"><div class="pcm-kicker">FREE MOVING ESTIMATE</div><h2>Get a quote for your ${escapeHtml(routeName(route))} move.</h2><p>Share your ${escapeHtml(routeName(route))} move details so Purely Canadian Movers can prepare a realistic written estimate for this cross-border corridor.</p><div class="pcm-pills" aria-label="Estimate trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">Coquitlam office</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Declared Value Protection available</span></div></div><form class="pcm-estimate pcm-lead-panel" action="/contact/" method="get"><div class="pcm-form-grid"><label>Moving from<input name="from" value="${route.from}, ${route.fromRegion}" placeholder="${route.from}, ${route.fromRegion}"></label><label>Moving to<input name="to" value="${route.to}, ${route.toRegion}" placeholder="${route.to}, ${route.toRegion}"></label><label>Home size<select name="homeSize"><option value="">Select size</option><option>Studio</option><option>1 Bedroom</option><option>2 Bedrooms</option><option>3 Bedrooms</option><option>4+ Bedrooms</option></select></label><label>Move date<input name="moveDate" type="date"></label></div><div class="pcm-buttons"><button class="pcm-button primary" type="submit">Get Written Estimate</button><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-form-note"><strong>No spam. No pressure. Just your moving estimate.</strong> Questions? Call Purely Canadian Movers: 1-877-485-6683</p><div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, timing, and protection choices are reviewed before pricing is confirmed in writing.</span></div></div><div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:16045227222">604-522-7222</a> · Family-owned since 1991</div></form></div></section>`;
}

function pricing(route) {
  const rows = facts.pricing.map(([size, price, note]) => `<tr><td>${size}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>${escapeHtml(facts.transit)}</td></tr>`).join("");
  const reverse = routes.find((candidate) => candidate.from === route.to);
  return `<section class="pcm-lead-boost pcm-route-cost pcm-step49-pricing" aria-label="${escapeHtml(routeName(route))} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(routeName(route).toUpperCase())} MOVING COST</div><h2>How much does it cost to move from ${route.from} to ${route.to}?</h2><p class="pcm-route-cost__intro">A ${escapeHtml(routeName(route))} move has established planning estimates from <strong>US$2,150</strong> for a studio to <strong>US$4,500</strong> for a 4+ bedroom home. Scheduling is confirmed for each cross-border shipment.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Planning notes</th><th>Transit planning</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning estimates in USD, not guaranteed prices. Final pricing depends on shipment size or weight, pickup and delivery access, packing, storage, timing, and requested services. Basic carrier liability applies; available <strong>Declared Value Protection</strong> options are confirmed in writing before moving day.</p><div class="pcm-route-cost__links"><a href="/bc-to-washington-movers/">BC–Washington moving guide</a><a href="/canada-usa/">Canada–USA moving services</a><a href="/${reverse.slug}/">${routeName(reverse)} movers</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  return `<section class="pcm-step49-hero"><div class="container"><p class="pcm-step49-eyebrow">${escapeHtml(route.from.toUpperCase())} → ${escapeHtml(route.to.toUpperCase())}</p><h1>${escapeHtml(routeName(route))} Movers</h1><p>Professional ${route.from === "Vancouver" ? "Canada–U.S." : "U.S.–Canada"} cross-border moving from ${route.from}, ${route.fromRegion} to ${route.to}, ${route.toRegion}, with written estimates, route planning, packing, storage, and protection options.</p><div class="pcm-step49-actions"><a href="/contact/">Get Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><div class="pcm-step49-badges"><span>Family-owned since 1991</span><span>BBB Accredited</span><span>Great Canadian Van Lines agent</span><span>Written estimates</span></div></div></section>`;
}

function glance(route) {
  return `<section class="pcm-step49-glance" aria-labelledby="${route.slug}-glance"><h3 id="${route.slug}-glance">Route at a Glance</h3><div class="pcm-step49-glance__grid"><div><b aria-hidden="true">↔</b><p><small>Corridor</small><strong>${escapeHtml(route.corridor)}</strong><span>${escapeHtml(routeName(route))}</span></p></div><div><b aria-hidden="true">◷</b><p><small>Transit planning</small><strong>Confirmed per move</strong><span>Overnight service may be planned when ready</span></p></div><div><b aria-hidden="true">$</b><p><small>Planning estimates</small><strong>${facts.range}</strong><span>Five home-size estimates in USD</span></p></div></div></section>`;
}

function main(route) {
  const reverse = routes.find((candidate) => candidate.from === route.to);
  const customsLabel = route.from === "Vancouver" ? "southbound Canada–U.S." : "northbound U.S.–Canada";
  return `<main class="pcm-step49-shell">${hero(route)}<section class="pcm-step49-trust">Family-owned since 1991 · BBB Accredited business · Great Canadian Van Lines agent · Written estimates</section><section class="pcm-step49-main"><div class="container"><h2>Moving from ${route.from}, ${route.fromRegion} to ${route.to}, ${route.toRegion}</h2><div class="pcm-step49-intro">${route.intro.map((p)=>`<p>${escapeHtml(p)}</p>`).join("")}</div>${glance(route)}<h2>What Makes a ${escapeHtml(routeDash(route))} Move Unique</h2><div class="pcm-step49-cards">${route.unique.map(card).join("")}</div><h2>Planning Your ${escapeHtml(customsLabel)} Move</h2><div class="pcm-step49-cards">${route.tips.map(card).join("")}</div><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-step49-proof"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>Great Canadian Van Lines agent-network support with accountable cross-border coordination</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Basic carrier liability and available Declared Value Protection options are explained before moving day</li></ul><h2>How Your ${escapeHtml(routeDash(route))} Move Works</h2><div class="pcm-step49-process"><article><b>1</b><h3>Written estimate</h3><p>Confirm inventory, access, services, and timing.</p></article><article><b>2</b><h3>Prepare the shipment</h3><p>Coordinate packing and shipment-specific paperwork.</p></article><article><b>3</b><h3>Cross-border transit</h3><p>Follow the confirmed route and delivery plan.</p></article><article><b>4</b><h3>Delivery</h3><p>Complete destination access and unloading.</p></article></div></div></section><section class="pcm-route-faq-static pcm-step49-faq"><div class="container"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></div></section><section class="pcm-step49-related"><div class="container"><h2>Related Destinations and Cross-Border Resources</h2><div class="pcm-links"><a href="/bc-to-washington-movers/">BC–Washington Moving Guide</a><a href="/canada-usa/">Canada–USA Moving Services</a><a href="/${reverse.slug}/">${routeName(reverse)} Movers</a><a href="/packing/">Packing Services</a><a href="/storage/">Storage Options</a><a href="/valuation-coverage-protection/">Declared Value Protection</a></div></div></section><section class="pcm-step49-closing"><div class="container"><h2>Ready to Move from ${route.from} to ${route.to}?</h2><p>Request a free, no-obligation written estimate for your cross-border household move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></main>`;
}

function validate(html, route) {
  const exactly = (pattern, label) => { const count = (html.match(pattern) ?? []).length; if (count !== 1) throw new Error(`${route.slug}: expected one ${label}, found ${count}`); };
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  exactly(/<h1\b/gi, "H1"); exactly(/class="pcm-top-estimate-wrap"/g, "quote panel"); exactly(/class="[^"]*pcm-route-cost\b/g, "pricing section"); exactly(/<table\b/gi, "pricing table"); exactly(/Route at a Glance/g, "Route at a Glance"); exactly(/Frequently Asked Questions/g, "FAQ heading"); exactly(/"@type":"FAQPage"/g, "FAQPage schema"); exactly(/<footer\b/gi, "footer");
  if ((body.match(/<form\b/gi) ?? []).length !== 1 || (body.match(/<tbody><tr>/g) ?? []).length !== 1) throw new Error(`${route.slug}: canonical form or price rows missing`);
  if (/<script\b[^>]*type=["']module["']/i.test(html)) throw new Error(`${route.slug}: static route contains React bootstrap`);
  for (const asset of ["static-nav.js", "static-chat.js", "step49-seattle-vancouver.js", "step49-seattle-vancouver.css"]) if (!html.includes(`/assets/${asset}`)) throw new Error(`${route.slug}: missing ${asset}`);
  if (!html.includes(`name="from" value="${route.from}, ${route.fromRegion}"`) || !html.includes(`name="to" value="${route.to}, ${route.toRegion}"`)) throw new Error(`${route.slug}: directional defaults missing`);
  if (/pcm-local-seo|\bundefined\b|Moving Cost Breakdown|pcm-cost-breakdown|>\s*Route Pricing\s*<|book before|online estimate bonus|fully insured|interprovincial|domestic Canadian|cross-country within Canada/i.test(body)) throw new Error(`${route.slug}: stale or domestic-only content remains`);
  for (const value of ["US$2,150", "US$2,700", "US$3,100", "US$3,700", "US$4,500", facts.transit]) if (!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  if (route.slug === "seattle-to-vancouver-movers" && /What documents are needed for a move to Washington|move apartments and houses to Seattle|VANCOUVER → SEATTLE/i.test(body)) throw new Error(`${route.slug}: reverse-direction contamination remains`);
  return html;
}

for (const route of routes) {
  const path = join(root, route.slug, "index.html");
  const source = await readFile(path, "utf8");
  const header = extract(source, /<header\b[^>]*>[\s\S]*?<\/header>/i, "header", route);
  const footer = extract(source, /<footer\b[^>]*>[\s\S]*?<\/footer>/i, "footer", route).replace(">Valuation Coverage</a>", ">Declared Value Protection</a>");
  const html = validate(`${buildHead(source, route)}<body class="pcm-static-route-ready"><div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="${route.slug}">${quotePanel(route)}${pricing(route)}${header}${main(route)}${footer}</div><script defer src="/assets/conversion-boost.js"></script><script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script><script defer src="/assets/step49-seattle-vancouver.js"></script></body></html>`, route);
  await writeFile(path, html);
}
