import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";
import { HALIFAX_TORONTO_FACTS, HALIFAX_TORONTO_ROUTES, assertHalifaxTorontoRouteData } from "./halifax-toronto-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const templateDir = join(dirname(fileURLToPath(import.meta.url)), "templates", "halifax-toronto-routes");
const siteOrigin = "https://purelycanadianmovers.com";
const facts = HALIFAX_TORONTO_FACTS;
const routes = HALIFAX_TORONTO_ROUTES;
routes.forEach((route) => assertHalifaxTorontoRouteData(route));
assertRouteOwnership("update-halifax-toronto-routes.mjs", routes.map((route) => route.slug));

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
const name = (route) => `${route.from} to ${route.to}`;
const dash = (route) => `${route.from}–${route.to}`;
const url = (route) => `${siteOrigin}/${route.slug}/`;
const card = ([title, body]) => `<article class="pcm-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;

function routeSchema(route) {
  return { "@context":"https://schema.org", "@graph":[
    { "@type":"Service", name:`${name(route)} movers`, serviceType:"Interprovincial long-distance moving", url:url(route), provider:{"@id":`${siteOrigin}/#organization`}, areaServed:[{"@type":"City",name:route.from},{"@type":"City",name:route.to}], description:`${name(route)} long-distance moving with written estimates, ${facts.distance} of route planning, ${facts.transit} transit guidance, packing, storage, and Declared Value Protection options.` },
    { "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${siteOrigin}/`},{"@type":"ListItem",position:2,name:`${name(route)} Movers`,item:url(route)}] },
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
  if (bodyStart < 0) throw new Error(`${route.slug}: template has no body`);
  let head = template.slice(0, bodyStart)
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapeHtml(route.title)}">${escapeHtml(route.title)}</title>`)
    .replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${url(route)}">`)
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    .replace(/\s*<link[^>]+step\d+[^>]+\.css[^>]*>/gi, "")
    .replace(/\s*<link[^>]+static-(?:nav|chat)\.css[^>]*>/gi, "");
  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:title"', route.title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', url(route));
  head = replaceMeta(head, 'name="twitter:title"', route.title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);
  head = head.replace(/\s*<\/head>/i, `    <link rel="stylesheet" href="/assets/static-nav.css">\n    <link rel="stylesheet" href="/assets/static-chat.css">\n    <link rel="stylesheet" href="/assets/step47-halifax-toronto.css">\n    <script type="application/ld+json" id="route-schema">${JSON.stringify(routeSchema(route))}</script>\n</head>`);
  return head;
}

function extract(template, pattern, label, route) {
  const match = template.match(pattern);
  if (!match) throw new Error(`${route.slug}: template has no ${label}`);
  return match[0];
}

function quotePanel(route) {
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate"><div class="pcm-top-estimate"><div class="pcm-top-estimate__intro"><div class="pcm-kicker">FREE MOVING ESTIMATE</div><h2>Get a ${escapeHtml(name(route))} quote.</h2><p>Plan your ${escapeHtml(name(route))} move with realistic pricing, transit guidance, packing and storage options, protection choices, and written estimate details.</p><div class="pcm-pills" aria-label="Estimate trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">Coquitlam office</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Declared Value Protection available</span></div></div><form class="pcm-estimate pcm-lead-panel" action="/contact/" method="get"><div class="pcm-form-grid"><label>Moving from<input name="from" value="${escapeHtml(route.from)}, ${route.fromProvince}" placeholder="${escapeHtml(route.from)}, ${route.fromProvince}"></label><label>Moving to<input name="to" value="${escapeHtml(route.to)}, ${route.toProvince}" placeholder="${escapeHtml(route.to)}, ${route.toProvince}"></label><label>Home size<select name="homeSize"><option value="">Select size</option><option>Studio</option><option>1 Bedroom</option><option>2 Bedrooms</option><option>3 Bedrooms</option><option>4+ Bedrooms</option></select></label><label>Move date<input name="moveDate" type="date"></label></div><div class="pcm-buttons"><button class="pcm-button primary" type="submit">Get Written Estimate</button><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-form-note"><strong>No spam. No pressure. Just your moving estimate.</strong> Questions? Call Purely Canadian Movers: 1-877-485-6683</p><div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed in writing.</span></div></div><div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:16045227222">604-522-7222</a> · Family-owned since 1991</div></form></div></section>`;
}

function pricingSection(route) {
  const rows = facts.pricing.map(([size,price,note])=>`<tr><td>${size}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>${facts.transit}</td></tr>`).join("");
  const reverse = routes.find((candidate)=>candidate.from===route.to);
  return `<section class="pcm-lead-boost pcm-route-cost pcm-step47-pricing" aria-label="${escapeHtml(name(route))} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(name(route).toUpperCase())} MOVING COST</div><h2>How much does it cost to move from ${route.from} to ${route.to}?</h2><p class="pcm-route-cost__intro">A ${escapeHtml(name(route))} move typically ranges from about <strong>$2,200+</strong> for a studio or small shipment to <strong>$7,000+</strong> for a 4+ bedroom home. The route is ${facts.distance}, with typical transit of <strong>${facts.transit}</strong>.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges in CAD, not guaranteed quotes. Final pricing depends on shipment weight or volume, pickup and delivery access, season, packing, storage, specialty items, and requested services. Basic carrier liability applies; available <strong>Declared Value Protection</strong> options are confirmed in writing before moving day.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full moving cost guide</a><a href="/${route.from.toLowerCase()}-long-distance-movers/">${route.from} long-distance movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${route.to} long-distance movers</a><a href="/${reverse.slug}/">${name(reverse)} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  return `<section class="pcm-step47-hero"><div class="container"><p class="pcm-step47-eyebrow">${escapeHtml(name(route))} movers</p><h1>${escapeHtml(name(route))} Movers</h1><p>Professional interprovincial moving from ${route.from}, ${route.fromProvince} to ${route.to}, ${route.toProvince}, with written estimates, route planning, packing, storage, and protection options.</p><div class="pcm-step47-actions"><a href="/contact/">Get Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><div class="pcm-step47-badges"><span>Family-owned since 1991</span><span>BBB Accredited</span><span>Great Canadian Van Lines agent</span><span>Written estimates</span></div></div></section>`;
}

function glance(route) {
  return `<section class="pcm-step47-glance" aria-labelledby="${route.slug}-glance"><h3 id="${route.slug}-glance">Route at a Glance</h3><div class="pcm-step47-glance__grid"><div><b aria-hidden="true">↔</b><p><small>Distance</small><strong>${facts.distanceShort}</strong><span>${escapeHtml(name(route))}</span></p></div><div><b aria-hidden="true">◷</b><p><small>Estimated transit</small><strong>${facts.transit}</strong><span>Depending on shipment and schedule</span></p></div><div><b aria-hidden="true">$</b><p><small>Typical cost range</small><strong>${facts.range}</strong><span>Studio through 4+ bedroom</span></p></div></div></section>`;
}

function main(route) {
  const reverse = routes.find((candidate)=>candidate.from===route.to);
  return `<main class="pcm-step47-shell">${hero(route)}<section class="pcm-step47-trust">Family-owned since 1991 · BBB Accredited business · Great Canadian Van Lines agent · Written estimates</section><section class="pcm-step47-main"><div class="container"><h2>Moving from ${route.from} to ${route.to}</h2><div class="pcm-step47-intro">${route.intro.map((p)=>`<p>${escapeHtml(p)}</p>`).join("")}</div>${glance(route)}<h2>What Makes a ${escapeHtml(dash(route))} Move Unique</h2><div class="pcm-step47-cards">${route.unique.map(card).join("")}</div><h2>Tips for Moving to ${route.to}</h2><div class="pcm-step47-cards">${route.tips.map(card).join("")}</div><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-step47-proof"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>Great Canadian Van Lines agent-network support with accountable route coordination</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Basic carrier liability and available Declared Value Protection options are explained before moving day</li></ul><h2>How Your ${escapeHtml(dash(route))} Move Works</h2><div class="pcm-step47-process"><article><b>1</b><h3>Written estimate</h3><p>Confirm inventory, access, services, and timing.</p></article><article><b>2</b><h3>Pack and load</h3><p>Prepare the shipment and origin access.</p></article><article><b>3</b><h3>Corridor transit</h3><p>Coordinate the confirmed delivery spread.</p></article><article><b>4</b><h3>Delivery</h3><p>Complete destination access and unloading.</p></article></div></div></section><section class="pcm-route-faq-static pcm-step47-faq"><div class="container"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></div></section><section class="pcm-step47-related"><div class="container"><h2>Related Destinations and Resources</h2><div class="pcm-links"><a href="/${route.from.toLowerCase()}-long-distance-movers/">${route.from} Long-Distance Movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${route.to} Long-Distance Movers</a><a href="/${reverse.slug}/">${name(reverse)} Movers</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/great-canadian-vanlines-agent/">Great Canadian Van Lines Agent</a><a href="/valuation-coverage-protection/">Declared Value Protection</a></div></div></section><section class="pcm-step47-closing"><div class="container"><h2>Ready to Move from ${route.from} to ${route.to}?</h2><p>Request a free, no-obligation written estimate for your interprovincial move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></main>`;
}

function buildPage(template, route) {
  const header = extract(template, /<header\b[^>]*>[\s\S]*?<\/header>/i, "header", route);
  const footer = extract(template, /<footer\b[^>]*>[\s\S]*?<\/footer>/i, "footer", route).replace(">Valuation Coverage</a>", ">Declared Value Protection</a>");
  return `${buildHead(template,route)}<body class="pcm-static-route-ready"><div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="${route.slug}">${quotePanel(route)}${pricingSection(route)}${header}${main(route)}${footer}</div><script defer src="/assets/conversion-boost.js"></script><script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script><script defer src="/assets/step47-halifax-toronto.js"></script></body></html>`;
}

function validate(html, route) {
  const exactly=(re,label)=>{const n=(html.match(re)||[]).length;if(n!==1)throw new Error(`${route.slug}: expected one ${label}, found ${n}`)};
  exactly(/<h1\b/gi,"H1"); exactly(/class="pcm-top-estimate-wrap"/g,"quote panel"); exactly(/class="[^"]*pcm-route-cost\b/g,"pricing section"); exactly(/<table\b/gi,"pricing table"); exactly(/Route at a Glance/g,"Route at a Glance"); exactly(/Frequently Asked Questions/g,"FAQ heading"); exactly(/"@type":"FAQPage"/g,"FAQPage schema"); exactly(/<footer\b/gi,"footer");
  if ((html.match(/<form\b/gi)||[]).length!==1 || (html.match(/<tbody><tr>/g)||[]).length!==1) throw new Error(`${route.slug}: canonical form or pricing rows missing`);
  if (/<script\b[^>]*type=["']module["']/i.test(html)) throw new Error(`${route.slug}: static route contains React bootstrap`);
  if (!html.includes(`/assets/static-nav.js`) || !html.includes(`/assets/static-chat.js`) || !html.includes(`/assets/step47-halifax-toronto.js`) || !html.includes(`/assets/step47-halifax-toronto.css`)) throw new Error(`${route.slug}: static runtime assets missing`);
  if (!html.includes(`name="from" value="${route.from}, ${route.fromProvince}"`) || !html.includes(`name="to" value="${route.to}, ${route.toProvince}"`)) throw new Error(`${route.slug}: directional defaults missing`);
  if (/pcm-local-seo|\bundefined\b|Moving Cost Breakdown|pcm-cost-breakdown|>\s*Route Pricing\s*<|book before|online estimate bonus|\bvaluation coverage\b|fully insured/i.test(html)) throw new Error(`${route.slug}: legacy content remains`);
  for (const value of [facts.distanceShort,facts.transit,"$2,200+","$2,900+","$3,900+","$5,300+","$7,000+"]) if(!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  return html;
}

for (const route of routes) {
  const templatePath=join(templateDir,`${route.slug}.html`);
  const template = await readFile(templatePath, "utf8");
  const html = validate(buildPage(template, route), route);
  await mkdir(join(root,route.slug),{recursive:true});
  await writeFile(join(root,route.slug,"index.html"),html);
  await writeFile(templatePath,html);
}

const guidePath=join(root,"long-distance-moving-cost-canada","index.html");
let guide=await readFile(guidePath,"utf8");
const guideHeading=guide.indexOf("Long-Distance Moving Costs by Route");
if(guideHeading<0)throw new Error("Long-Distance Moving Costs by Route heading not found");
for(const route of routes){const arrow=`${route.from} → ${route.to}`,slug=`${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`,cells=facts.pricing.map(([,price])=>`<td class="py-3 px-4 font-body text-gray-700">${price}</td>`).join("");const row=`<tr data-route="${slug}" class="border-b border-gray-200 bg-white hover:bg-red-50 pcm-cost-guide-route"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${arrow}</td>${cells}</tr>`;const marker=guide.indexOf(arrow,guideHeading);if(marker<0)throw new Error(`${arrow} cost-guide row not found after the route-cost heading`);const start=guide.lastIndexOf("<tr",marker),end=guide.indexOf("</tr>",marker);if(start<guideHeading||end<0)throw new Error(`${arrow} cost-guide row is malformed`);guide=guide.slice(0,start)+row+guide.slice(end+5)}
await writeFile(guidePath,guide);
