import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";
import { VICTORIA_VANCOUVER_FACTS as facts, VICTORIA_VANCOUVER_ROUTE as route, assertVictoriaVancouverRouteData } from "./victoria-vancouver-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const origin = "https://purelycanadianmovers.com";
const routeUrl = `${origin}/${route.slug}/`;
assertVictoriaVancouverRouteData(route);
assertAllowedPostProcessor("finalize-victoria-vancouver-route.mjs", [`/${route.slug}/`]);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
const card = ([title, body]) => `<article class="pcm-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;

function routeSchema() {
  return { "@context":"https://schema.org", "@graph":[
    { "@type":"Service", name:"Victoria to Vancouver movers", serviceType:"Intra-BC intercity household moving", url:routeUrl, provider:{"@id":`${origin}/#organization`}, areaServed:[{"@type":"City",name:"Victoria"},{"@type":"City",name:"Vancouver"}], description:"Victoria to Vancouver moving with Vancouver Island ferry planning, five CAD planning estimates, packing, storage, and written quotes." },
    { "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${origin}/`},{"@type":"ListItem",position:2,name:"Victoria Long-Distance Movers",item:`${origin}/victoria-long-distance-movers/`},{"@type":"ListItem",position:3,name:"Victoria to Vancouver Movers",item:routeUrl}] },
    { "@type":"FAQPage", mainEntity:route.faqs.map(([question, answer]) => ({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}})) },
  ] };
}

function replaceMeta(head, selector, value) {
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`, "i");
  if (!pattern.test(head)) throw new Error(`Expected head metadata not found: ${selector}`);
  return head.replace(pattern, `$1${escapeHtml(value)}$2`);
}

function buildHead(source) {
  const bodyStart = source.indexOf("<body");
  if (bodyStart < 0) throw new Error(`${route.slug}: source has no body`);
  let head = source.slice(0, bodyStart)
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapeHtml(route.title)}">${escapeHtml(route.title)}</title>`)
    .replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${routeUrl}">`)
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    .replace(/\s*<script\b[^>]*src="[^"]*(?:static-nav|static-chat|conversion-boost|step50-victoria-vancouver)\.js"[^>]*><\/script>/gi, "")
    .replace(/\s*<link[^>]+step50-victoria-vancouver\.css[^>]*>/gi, "")
    .replace(/\s*<link[^>]+static-(?:nav|chat)\.css[^>]*>/gi, "");
  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'name="keywords"', "Victoria to Vancouver movers, Victoria BC movers, Vancouver BC movers, Vancouver Island moving, Lower Mainland moving, intra-BC movers, ferry moving logistics");
  head = replaceMeta(head, 'property="og:title"', route.title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', routeUrl);
  head = replaceMeta(head, 'name="twitter:title"', route.title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);
  return head.replace(/\s*<\/head>/i, `    <link rel="stylesheet" href="/assets/static-nav.css">\n    <link rel="stylesheet" href="/assets/static-chat.css">\n    <link rel="stylesheet" href="/assets/step50-victoria-vancouver.css">\n    <script type="application/ld+json" id="route-schema">${JSON.stringify(routeSchema())}</script>\n</head>`);
}

function extract(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`${route.slug}: source has no ${label}`);
  return match[0];
}

function cleanShell(shell) {
  return shell
    .replaceAll("1–3.18", "1-3.18")
    .replaceAll("1–3.06", "1-3.06")
    .replace("Coordinated through the Great Canadian Van Lines agent network — ever.", "Great Canadian Van Lines agent-network support is coordinated with clear written documentation.")
    .replace(">Valuation Coverage</a>", ">Declared Value Protection</a>");
}

function quotePanel() {
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate"><div class="pcm-top-estimate"><div class="pcm-top-estimate__intro"><div class="pcm-kicker">FREE MOVING ESTIMATE</div><h2>Get a quote for your Victoria to Vancouver move.</h2><p>Share your Victoria, BC pickup, Vancouver, BC delivery, inventory, access, ferry-planning, packing, storage, and timing details for a realistic written estimate.</p><div class="pcm-pills" aria-label="Estimate trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">Coquitlam office</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Declared Value Protection available</span></div></div><form class="pcm-estimate pcm-estimate-form pcm-lead-panel" data-pcm-step50-form="1" action="/contact/" method="get"><div class="pcm-form-grid"><label>Moving from<input name="from" value="Victoria, BC" placeholder="Victoria, BC"></label><label>Moving to<input name="to" value="Vancouver, BC" placeholder="Vancouver, BC"></label><label>Home size<select name="homeSize"><option value="">Select size</option><option>Studio</option><option>1 Bedroom</option><option>2 Bedrooms</option><option>3 Bedrooms</option><option>4+ Bedrooms</option></select></label><label>Move date<input name="moveDate" type="date"></label></div><div class="pcm-buttons"><button class="pcm-button primary" type="submit">Get Written Estimate</button><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-form-note"><strong>No spam. No pressure. Just your moving estimate.</strong> Questions? Call Purely Canadian Movers: 1-877-485-6683</p><div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Online estimate bonus: save at least $100</strong><span class="pcm-estimate-bonus__deadline">Book before September 30, 2026</span><span>Complete an online estimate and book your move with Purely Canadian Movers. Discount confirmed with your written estimate.</span></div></div><div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:16045227222">604-522-7222</a> · Family-owned since 1991</div></form></div></section>`;
}

function pricing() {
  const rows = facts.pricing.map(([size, price, note]) => `<tr><td>${escapeHtml(size)}</td><td>${escapeHtml(price)}</td><td>${escapeHtml(note)}</td><td>${facts.transit}</td></tr>`).join("");
  return `<section class="pcm-lead-boost pcm-route-cost pcm-step50-pricing" aria-label="Victoria to Vancouver moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">VICTORIA TO VANCOUVER MOVING COST</div><h2>How much does it cost to move from Victoria to Vancouver?</h2><p class="pcm-route-cost__intro">Current planning estimates range from <strong>$1,200+</strong> for a studio to <strong>$4,200+</strong> for a 4+ bedroom home. The route covers approximately 110 km and includes Vancouver Island departure and Lower Mainland delivery planning.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Planning notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning estimates in CAD, not guaranteed prices. Final pricing depends on shipment size or weight, Victoria pickup access, Vancouver delivery access, ferry logistics, packing, storage, timing, and requested services. Basic carrier liability applies; available <strong>Declared Value Protection</strong> options are confirmed in writing before moving day.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Long-distance moving cost guide</a><a href="/victoria-long-distance-movers/">Victoria long-distance movers</a><a href="/vancouver-long-distance-movers/">Vancouver long-distance movers</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero() {
  return `<section class="pcm-step50-hero"><div class="container"><p class="pcm-step50-eyebrow">VICTORIA → VANCOUVER</p><h1>Victoria to Vancouver Movers</h1><p>Professional intra-BC moving from Victoria on Vancouver Island to Vancouver in the Lower Mainland, with ferry coordination, written estimates, packing, storage, and protection options.</p><div class="pcm-step50-actions"><a href="/contact/">Get Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><div class="pcm-step50-badges"><span>Family-owned since 1991</span><span>BBB Accredited</span><span>Great Canadian Van Lines agent</span><span>Written estimates</span></div></div></section>`;
}

function glance() {
  return `<section class="pcm-step50-glance" aria-labelledby="victoria-vancouver-glance"><h3 id="victoria-vancouver-glance">Route at a Glance</h3><div class="pcm-step50-glance__grid"><div><b aria-hidden="true">↔</b><p><small>Distance</small><strong>${facts.distanceDisplay}</strong><span>Victoria to Vancouver</span></p></div><div><b aria-hidden="true">◷</b><p><small>Typical transit</small><strong>${facts.transit}</strong><span>Confirmed for the move</span></p></div><div><b aria-hidden="true">$</b><p><small>Planning estimates</small><strong>${facts.range}</strong><span>Five home-size estimates in CAD</span></p></div></div></section>`;
}

function main() {
  return `<main class="pcm-step50-shell">${hero()}<section class="pcm-step50-trust">Family-owned since 1991 · BBB Accredited business · Great Canadian Van Lines agent · Written estimates</section><section class="pcm-step50-main"><div class="container"><h2>Moving from Victoria, BC to Vancouver, BC</h2><div class="pcm-step50-intro">${route.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>${glance()}<h2>What Makes a Victoria–Vancouver Move Unique</h2><div class="pcm-step50-cards">${route.unique.map(card).join("")}</div><h2>Planning Your Vancouver Island to Lower Mainland Move</h2><div class="pcm-step50-cards">${route.tips.map(card).join("")}</div><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-step50-proof"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>Victoria pickup, ferry transportation, and Vancouver access planned as one intra-BC move</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Basic carrier liability and available Declared Value Protection options are explained before moving day</li></ul><h2>How Your Victoria–Vancouver Move Works</h2><div class="pcm-step50-process"><article><b>1</b><h3>Written estimate</h3><p>Confirm inventory, access, services, ferry planning, and timing.</p></article><article><b>2</b><h3>Victoria pickup</h3><p>Coordinate building access, loading, packing, and departure details.</p></article><article><b>3</b><h3>Ferry transport</h3><p>Follow the confirmed Vancouver Island to Lower Mainland plan.</p></article><article><b>4</b><h3>Vancouver delivery</h3><p>Complete destination access, unloading, and placement.</p></article></div></div></section><section class="pcm-route-faq-static pcm-step50-faq"><div class="container"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></div></section><section class="pcm-step50-related"><div class="container"><h2>Related Destinations and Moving Resources</h2><div class="pcm-links"><a href="/victoria-long-distance-movers/">Victoria Long-Distance Movers</a><a href="/vancouver-long-distance-movers/">Vancouver Long-Distance Movers</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/packing/">Packing Services</a><a href="/storage/">Storage Options</a><a href="/valuation-coverage-protection/">Declared Value Protection</a></div></div></section><section class="pcm-step50-closing"><div class="container"><h2>Ready to Move from Victoria to Vancouver?</h2><p>Request a free, no-obligation written estimate for your Vancouver Island to Lower Mainland move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></main>`;
}

function validate(html) {
  const exactly = (pattern, label) => { const matches = html.match(pattern) ?? []; if (matches.length !== 1) throw new Error(`${route.slug}: expected one ${label}, found ${matches.length}`); };
  const mainBody = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? "";
  const visibleRoute = `${html.match(/<section class="pcm-top-estimate-wrap"[\s\S]*?<\/section>/i)?.[0] ?? ""}${mainBody}`;
  exactly(/<h1\b/gi, "H1");
  exactly(/class="pcm-top-estimate-wrap"/g, "quote panel");
  exactly(/data-pcm-step50-form="1"/g, "primary estimate form");
  exactly(/class="[^"]*pcm-route-cost\b/g, "pricing section");
  exactly(/<table\b/gi, "pricing table");
  exactly(/Route at a Glance/g, "Route at a Glance");
  exactly(/Frequently Asked Questions/g, "FAQ heading");
  exactly(/"@type":"FAQPage"/g, "FAQPage schema");
  exactly(/<footer\b/gi, "footer");
  if ((html.match(/<tbody><tr>/g) ?? []).length !== 1 || (html.match(/<tr>/g) ?? []).length < 6) throw new Error(`${route.slug}: expected five pricing rows`);
  if (/<script\b[^>]*type=["']module["']/i.test(html)) throw new Error(`${route.slug}: static route contains React bootstrap`);
  for (const asset of ["conversion-boost.js", "static-nav.js", "static-chat.js", "step50-victoria-vancouver.js", "step50-victoria-vancouver.css"]) if (!html.includes(`/assets/${asset}`)) throw new Error(`${route.slug}: missing ${asset}`);
  if (!html.includes('name="from" value="Victoria, BC"') || !html.includes('name="to" value="Vancouver, BC"')) throw new Error(`${route.slug}: directional defaults missing`);
  if (/pcm-local-seo|\bundefined\b|Moving Cost Breakdown|pcm-cost-breakdown|>\s*Route Pricing\s*<|fully insured|interprovincial|cross-border|cross-country|Vancouver to Victoria/i.test(visibleRoute)) throw new Error(`${route.slug}: stale, inaccurate, or reverse-direction content remains`);
  if (/new MutationObserver\(applyRouteCorrections\)/.test(html)) throw new Error(`${route.slug}: legacy looping observer remains`);
  for (const value of [facts.distanceDisplay, facts.transit, "$1,200+", "$1,600+", "$2,200+", "$3,000+", "$4,200+"]) if (!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  return html;
}

const path = join(root, route.slug, "index.html");
const source = await readFile(path, "utf8");
const header = cleanShell(extract(source, /<header\b[^>]*>[\s\S]*?<\/header>/i, "header"));
const footer = cleanShell(extract(source, /<footer\b[^>]*>[\s\S]*?<\/footer>/i, "footer"));
const output = validate(`${buildHead(source)}<body class="pcm-static-route-ready"><div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="${route.slug}">${quotePanel()}${pricing()}${header}${main()}${footer}</div><script defer src="/assets/conversion-boost.js"></script><script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script><script defer src="/assets/step50-victoria-vancouver.js"></script></body></html>`);
await writeFile(path, output);
