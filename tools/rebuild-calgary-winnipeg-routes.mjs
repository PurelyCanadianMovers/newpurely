import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertRouteOwnership } from "./route-ownership-guard.mjs";
import { CALGARY_WINNIPEG_FACTS, CALGARY_WINNIPEG_ROUTES, assertCalgaryWinnipegRouteData } from "./calgary-winnipeg-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const siteOrigin = "https://purelycanadianmovers.com";
const referencePath = resolve("tools/templates/calgary-winnipeg-routes/canonical-static-shell.html");
const routeFacts = CALGARY_WINNIPEG_FACTS;
const pricing = routeFacts.pricing;
const routes = CALGARY_WINNIPEG_ROUTES;
routes.forEach((route) => assertCalgaryWinnipegRouteData({ ...route, ...routeFacts }));
assertRouteOwnership("rebuild-calgary-winnipeg-routes.mjs", routes);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const routeName = (route) => `${route.from} to ${route.to}`;
const routeDash = (route) => `${route.from}–${route.to}`;
const routeUrl = (route) => `${siteOrigin}/${route.slug}/`;

function card([title, body]) {
  return `<article class="pcm-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;
}

function schema(route) {
  const name = routeName(route);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${name} movers`,
        serviceType: "Long-distance moving",
        areaServed: [
          { "@type": "City", name: route.from },
          { "@type": "City", name: route.to },
        ],
        url: routeUrl(route),
        description: `${name} long-distance moving with written estimates, route planning, packing, storage, Declared Value Protection options, approximately 1,320 km of travel, and typical transit of 3–11 days.`,
      },
      {
        "@type": "FAQPage",
        mainEntity: route.faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
}

function replaceMeta(head, selector, value) {
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`, "i");
  if (!pattern.test(head)) throw new Error(`Expected head metadata not found: ${selector}`);
  return head.replace(pattern, (_match, prefix, suffix) => `${prefix}${escapeHtml(value)}${suffix}`);
}

function buildHead(template, route) {
  const bodyStart = template.indexOf("<body");
  if (bodyStart < 0) throw new Error("Reference route template has no body");

  const name = routeName(route);
  const title = `${name} Movers | Cost, Transit Time & Estimate | Purely Canadian Movers`;
  let head = template.slice(0, bodyStart)
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-pcm-authoritative-route-title="${escapeHtml(title)}">${escapeHtml(title)}</title>`)
    .replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="${routeUrl(route)}">`)
    .replace(/\s*<meta\s+name="(?:geo\.position|ICBM)"[^>]*>/gi, "");

  head = replaceMeta(head, 'name="description"', route.metaDescription);
  head = replaceMeta(head, 'name="keywords"', `${name} movers, moving from ${route.from} to ${route.to}, long distance movers ${route.from} to ${route.to}, ${route.from} ${route.to} moving company, ${name} moving cost, ${name} moving quote`);
  head = replaceMeta(head, 'property="og:title"', title);
  head = replaceMeta(head, 'property="og:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:url"', routeUrl(route));
  head = replaceMeta(head, 'name="twitter:title"', title);
  head = replaceMeta(head, 'name="twitter:description"', route.metaDescription);
  head = replaceMeta(head, 'property="og:image:alt"', `Purely Canadian Movers truck for ${name} long-distance moving`);
  head = head.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");
  head = head.replace(/\s*<link[^>]+step43-halifax-vancouver\.css[^>]*>/gi, "");
  if (!head.includes("/assets/static-nav.css")) head = head.replace(/\s*<\/head>/i, '    <link rel="stylesheet" href="/assets/static-nav.css">\n</head>');
  if (!head.includes("/assets/static-chat.css")) head = head.replace(/\s*<\/head>/i, '    <link rel="stylesheet" href="/assets/static-chat.css">\n</head>');
  head = head.replace(/\s*<\/head>/i, `    <link rel="stylesheet" href="/assets/step44-calgary-winnipeg.css">\n    <script type="application/ld+json" id="route-schema">${JSON.stringify(schema(route))}</script>\n</head>`);
  return head;
}

function extract(template, pattern, label) {
  const match = template.match(pattern);
  if (!match) throw new Error(`Reference route template has no ${label}`);
  return match[0];
}

function quotePanel(route) {
  const name = routeName(route);
  const article = "a";
  return `<section class="pcm-top-estimate-wrap" aria-label="Moving estimate">
      <div class="pcm-top-estimate">
        <div class="pcm-top-estimate__intro">
          <div class="pcm-kicker">FREE MOVING ESTIMATE</div>
          <h2>Get ${article} ${escapeHtml(name)} quote.</h2>
          <p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p>
          <div class="pcm-pills" aria-label="Estimate trust signals">
            <span class="pcm-pill">Family-owned since 1991</span>
            <span class="pcm-pill">Coquitlam office</span>
            <span class="pcm-pill">BBB Accredited business</span>
            <span class="pcm-pill">Great Canadian Van Lines agent</span>
            <span class="pcm-pill">Written estimates</span>
            <span class="pcm-pill">Declared Value Protection available</span>
          </div>
        </div>
        <form class="pcm-estimate pcm-lead-panel" action="/contact/" method="get">
          <div class="pcm-form-grid">
            <label>Moving from
              <input name="from" value="${escapeHtml(route.from)}, ${route.fromProvince}" placeholder="${escapeHtml(route.from)}, ${route.fromProvince}">
            </label>
            <label>Moving to
              <input name="to" value="${escapeHtml(route.to)}, ${route.toProvince}" placeholder="${escapeHtml(route.to)}, ${route.toProvince}">
            </label>
            <label>Home size
              <select name="homeSize">
                <option value="">Select size</option>
                <option>Studio</option>
                <option>1 Bedroom</option>
                <option>2 Bedrooms</option>
                <option>3 Bedrooms</option>
                <option>4+ Bedrooms</option>
              </select>
            </label>
            <label>Move date
              <input name="moveDate" type="date">
            </label>
          </div>
          <div class="pcm-buttons">
            <button class="pcm-button primary" type="submit">Get Written Estimate</button>
            <a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a>
          </div>
          <p class="pcm-form-note"><strong>No spam. No pressure. Just your moving estimate.</strong> Questions? Call Purely Canadian Movers: 1-877-485-6683</p>
          <div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>Written estimate planning</strong><span>Route, inventory, access, services, and timing are reviewed before pricing is confirmed in writing.</span></div></div>
          <div class="pcm-verified-details"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:6045222722">604-522-7222</a> · Direct mover since 1991</div>
        </form>
      </div>
    </section>`;
}

function pricingSection(route) {
  const name = routeName(route);
  const upper = name.toUpperCase();
  const article = "a";
  const capitalizedArticle = article[0].toUpperCase() + article.slice(1);
  const rows = pricing.map(([size, price, note]) => `<tr><td>${escapeHtml(size)}</td><td>${price}</td><td>${escapeHtml(note)}</td><td>3–11 days</td></tr>`).join("");
  return `<section class="pcm-lead-boost pcm-route-cost pcm-step44-pricing" aria-label="${escapeHtml(upper)} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${escapeHtml(upper)} MOVING COST</div><h2>How much does it cost to move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p class="pcm-route-cost__intro">${capitalizedArticle} ${escapeHtml(name)} move typically ranges from about <strong>$2,300+</strong> for a small shipment to <strong>$12,000+</strong> for a larger home. Final pricing depends on shipment weight or volume, access, packing, storage, season, protection choices, and confirmed services.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Notes</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div><p class="pcm-route-cost__note">These figures are planning ranges in CAD, not guaranteed quotes. Final pricing depends on shipment weight or volume, origin and destination access, season, packing, storage, and requested services. Basic carrier liability applies; available <strong>Declared Value Protection</strong> options are confirmed in writing before moving day.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full moving cost guide</a><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} long-distance movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} long-distance movers</a><a href="/${routes.find((candidate) => candidate.from === route.to && candidate.to === route.from).slug}/">${escapeHtml(routeName(routes.find((candidate) => candidate.from === route.to && candidate.to === route.from)))} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;
}

function hero(route) {
  const name = routeName(route);
  return `<div class="pcm-static-band pcm-static-band--hero"><section class="pcm-hero pcm-static-hero"><div><div class="pcm-kicker">${escapeHtml(name)} movers</div><h1>${escapeHtml(name)} Movers</h1><p>Planning a long-distance move from ${escapeHtml(route.from)}, ${route.fromProvince} to ${escapeHtml(route.to)}, ${route.toProvince}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, Declared Value Protection options, and written estimate details before moving day.</p><p>Purely Canadian Movers coordinates your move with support through the Great Canadian Van Lines agent network, giving you one accountable point of contact for route planning and delivery coordination.</p><div class="pcm-pills" aria-label="Trust signals"><span class="pcm-pill">Family-owned since 1991</span><span class="pcm-pill">BBB Accredited business</span><span class="pcm-pill">Great Canadian Van Lines agent</span><span class="pcm-pill">Written estimates</span><span class="pcm-pill">Packing and storage available</span></div><div class="pcm-hero-actions"><a class="pcm-button primary" href="/contact/">Get Written Estimate</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section></div>`;
}

function routeGlance(route) {
  const name = routeName(route);
  return `<div class="pcm-step44-glance"><h3>Route at a Glance</h3><div class="pcm-step44-glance__grid"><div><span class="pcm-step44-icon" aria-hidden="true">↔</span><p><small>Distance</small><strong>${routeFacts.distance}</strong><span>${escapeHtml(name)}</span></p></div><div><span class="pcm-step44-icon" aria-hidden="true">◷</span><p><small>Estimated transit</small><strong>${routeFacts.transit}</strong><span>Depending on shipment and schedule</span></p></div><div><span class="pcm-step44-icon" aria-hidden="true">$</span><p><small>Typical cost range</small><strong>${routeFacts.range}</strong><span>Studio through 4+ bedroom</span></p></div></div></div>`;
}

function routeBody(route) {
  const name = routeName(route);
  const reverse = routes.find((candidate) => candidate.from === route.to && candidate.to === route.from);
  const opposite = routeName(reverse);
  const oppositeSlug = reverse.slug;
  const article = "a";
  return `<main class="pcm-static-main pcm-step44-shell">
      ${hero(route)}
      <section class="pcm-step44-trust">Family-owned since 1991 · BBB Accredited business · Great Canadian Van Lines agent · Written estimates</section>
      <section class="pcm-step44-main"><div class="container"><h2>Moving from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}</h2><div class="pcm-step44-intro">${route.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>${routeGlance(route)}<h2>What Makes ${article} ${escapeHtml(routeDash(route))} Move Unique</h2><div class="pcm-step44-card-grid">${route.unique.map(card).join("")}</div><h2>Tips for Moving to ${escapeHtml(route.to)}</h2><div class="pcm-step44-card-grid">${route.tips.map(card).join("")}</div><h2>Why Choose Purely Canadian Movers</h2><ul class="pcm-step44-proof"><li>Family-owned since 1991 with more than 30 years of moving experience</li><li>Great Canadian Van Lines agent-network support with accountable route coordination</li><li>One accountable point of contact for route planning, documentation, and delivery coordination</li><li>Written estimates review inventory, access, packing, storage, timing, and protection choices</li><li>Carrier liability and Declared Value Protection choices are explained before moving day</li><li>Full or partial packing and storage options are available</li></ul><h2>How Your ${escapeHtml(routeDash(route))} Move Works</h2><div class="pcm-step44-process"><article><b>1</b><h3>Written estimate</h3><p>Tell us about the route, home size, inventory, access, services, and preferred moving date.</p></article><article><b>2</b><h3>Pack and load</h3><p>Confirm packing, loading, elevator, parking, stair, and long-carry details before pickup.</p></article><article><b>3</b><h3>Prairie corridor transit</h3><p>Your shipment is coordinated through the Great Canadian Van Lines agent network.</p></article><article><b>4</b><h3>Delivery</h3><p>Delivery timing and destination access are coordinated in writing.</p></article></div></div></section>
      <section class="pcm-section pcm-route-faq-static pcm-step44-faq"><h2>Frequently Asked Questions</h2><div class="pcm-faq-list">${route.faqs.map(card).join("")}</div></section>
      <section class="pcm-section pcm-step44-related"><h2>Related Destinations and Resources</h2><div class="pcm-links"><a href="/${route.from.toLowerCase()}-long-distance-movers/">${escapeHtml(route.from)} Long-Distance Movers</a><a href="/${route.to.toLowerCase()}-long-distance-movers/">${escapeHtml(route.to)} Long-Distance Movers</a><a href="/${oppositeSlug}/">${escapeHtml(opposite)} Movers</a><a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/great-canadian-vanlines-agent/">Great Canadian Van Lines Agent</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/contact/">Get a Written Estimate</a></div></section>
      <section class="pcm-section pcm-closing-cta pcm-static-closing-cta pcm-step44-closing"><h2>Ready to Move from ${escapeHtml(route.from)} to ${escapeHtml(route.to)}?</h2><p>Request a free, no-obligation written estimate for your interprovincial Prairie move.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-local-line">Or call our local line: <a href="tel:16045227222">604-522-7222</a></p></section>
    </main>`;
}

function page(template, route) {
  const header = extract(template, /<header\b[^>]*>[\s\S]*?<\/header>/i, "site header");
  const footer = extract(template, /<footer\b[^>]*>[\s\S]*?<\/footer>/i, "site footer")
    .replace(">Valuation Coverage</a>", ">Declared Value Protection</a>");
  return `${buildHead(template, route)}<body class="pcm-static-route-ready">
  <div id="root" class="pcm-static-route pcm-static-route-ready" data-pcm-static-route="${route.slug}">
    ${quotePanel(route)}
    ${pricingSection(route)}
    ${header}
    <div class="pcm-static-page">
      ${routeBody(route)}
    </div>
    ${footer}
  </div>
  <script defer src="/assets/conversion-boost.js"></script>
  <script defer src="/assets/static-nav.js"></script>
  <script defer src="/assets/static-chat.js"></script>
  <script defer src="/assets/step44-calgary-winnipeg.js"></script>
  <div class="pcm-lead-boost pcm-sticky-cta"><a class="pcm-primary-button" href="/contact/">Get Estimate</a><a class="pcm-secondary-button" href="tel:18774856683">Call</a></div>
  <button type="button" class="pcm-chat-nudge is-visible" aria-label="Ask a moving question or get a quick price quote"><strong>Not ready for an estimate?</strong><span>Ask us a moving question or get a quick price quote</span></button>
</body></html>`;
}

function ensureOnce(html, needle, label) {
  const count = html.split(needle).length - 1;
  if (count !== 1) throw new Error(`${label} expected once, found ${count}`);
}

function ensureRoutePage(html, route) {
  ensureOnce(html, `<h1>${routeName(route)} Movers</h1>`, `${route.slug} H1`);
  ensureOnce(html, "class=\"pcm-top-estimate\"", `${route.slug} quote panel`);
  ensureOnce(html, /class=\"[^\"]*\bpcm-route-cost\b[^\"]*\"/, `${route.slug} pricing section`);
  ensureOnce(html, "Route at a Glance", `${route.slug} route glance`);
  ensureOnce(html, "Frequently Asked Questions", `${route.slug} FAQ`);
  if ((html.match(/<form\b/gi) ?? []).length !== 1) throw new Error(`${route.slug}: expected exactly one primary form`);
  if ((html.match(/<table\b/gi) ?? []).length !== 1) throw new Error(`${route.slug}: expected exactly one pricing table`);
  if ((html.match(/"@type":"FAQPage"/g) ?? []).length !== 1) throw new Error(`${route.slug}: expected exactly one FAQPage schema`);
  if (/<script\b[^>]*type=["']module["']/i.test(html)) throw new Error(`${route.slug}: static route contains a React module bootstrap`);
  if (!html.includes(`name="from" value="${route.from}, ${route.fromProvince}"`) || !html.includes(`name="to" value="${route.to}, ${route.toProvince}"`)) throw new Error(`${route.slug}: directional form defaults are missing`);
  if (!html.includes("/assets/step44-calgary-winnipeg.css")) throw new Error(`${route.slug}: missing Step 44 stylesheet`);
  if (!html.includes("/assets/step44-calgary-winnipeg.js")) throw new Error(`${route.slug}: missing Step 44 navigation enhancer`);
  if (/Moving Cost Breakdown|pcm-cost-breakdown|>\s*Route Pricing\s*</i.test(html)) throw new Error(`${route.slug}: legacy or temporary pricing content remains`);
  if (/pcm-local-seo|\bundefined\b/i.test(html)) throw new Error(`${route.slug}: forbidden route contamination remains`);
  const legacyProtectionMatches = html.match(/fully insured|\binsurance\b|basic valuation coverage|full-value protection/gi);
  if (legacyProtectionMatches) {
    throw new Error(`${route.slug}: legacy protection wording remains (${legacyProtectionMatches.join(", ")})`);
  }
  if (/save at least \$100|Book before\\s+August\\s+3(?:0|1)/i.test(html)) throw new Error(`${route.slug}: stale dated promotion remains`);
  for (const value of ["approximately 1,320 km", "3–11 days", "$2,300+", "$3,200+", "$5,100+", "$8,200+", "$12,000+"]) {
    if (!html.includes(value)) throw new Error(`${route.slug}: missing ${value}`);
  }
  return html;
}

const template = await readFile(referencePath, "utf8");
for (const route of routes) {
  const output = ensureRoutePage(page(template, route), route);
  const outputPath = join(root, route.slug, "index.html");
  await mkdir(join(root, route.slug), { recursive: true });
  await writeFile(outputPath, output, "utf8");
  console.log(`Wrote ${outputPath}`);
}
