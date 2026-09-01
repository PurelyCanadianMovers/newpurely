import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2] ?? "site-copy";

const routes = [
  {
    slug: "calgary-to-winnipeg-movers",
    from: "Calgary",
    fromProvince: "AB",
    to: "Winnipeg",
    toProvince: "MB",
    direction: "Calgary to Winnipeg",
    originHub: "/calgary-long-distance-movers/",
    faq: [
      ["How much does it cost to move from Calgary to Winnipeg?", "Planning figures are $2,300+ for a studio, $3,200+ for a 1-bedroom, $5,100+ for a 2-bedroom, $8,200+ for a 3-bedroom, and $12,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, timing, and Declared Value Protection."],
      ["How long does a Calgary to Winnipeg move take?", "Typical transit planning is 3–11 days. The confirmed delivery window depends on shipment size, route scheduling, weather, access, and delivery availability."],
      ["What is included in the estimated moving cost?", "These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible. A written estimate confirms the services and move details."],
      ["What affects the price of a Calgary to Winnipeg move?", "Shipment weight or volume, home size, stairs, elevators, parking, long carries, packing, storage, specialty items, season, and exact pickup and delivery addresses can affect the final quote."],
      ["Is Calgary to Winnipeg pricing based on weight or volume?", "Long-distance estimates may be based on weight or volume depending on the shipment, route, and estimate process. Inventory details are reviewed before a written quote is prepared."],
      ["Can you pack or store items during a Calgary to Winnipeg move?", "Yes. Full or partial packing, unpacking, supplies, short-term storage, and long-term storage can be included in the estimate."],
      ["How is Declared Value Protection handled?", "Declared Value Protection options are explained before moving day, including the applicable coverage details and zero-deductible terms stated in the written estimate."],
      ["How do I get a Calgary to Winnipeg moving estimate?", "Submit the route, home size, inventory, access details, services, and preferred date through the estimate form or contact Purely Canadian Movers for a written estimate."]
    ]
  },
  {
    slug: "winnipeg-to-calgary-movers",
    from: "Winnipeg",
    fromProvince: "MB",
    to: "Calgary",
    toProvince: "AB",
    direction: "Winnipeg to Calgary",
    originHub: null,
    faq: [
      ["How much does it cost to move from Winnipeg to Calgary?", "Planning figures are $2,300+ for a studio, $3,200+ for a 1-bedroom, $5,100+ for a 2-bedroom, $8,200+ for a 3-bedroom, and $12,000+ for a 4+ bedroom home. Final pricing depends on shipment weight or volume, access, packing, storage, timing, and Declared Value Protection."],
      ["How long does a Winnipeg to Calgary move take?", "Typical transit planning is 3–11 days. The confirmed delivery window depends on shipment size, route scheduling, weather, access, and delivery availability."],
      ["What is included in the estimated moving cost?", "These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible. A written estimate confirms the services and move details."],
      ["What affects the price of a Winnipeg to Calgary move?", "Shipment weight or volume, home size, stairs, elevators, parking, long carries, packing, storage, specialty items, season, and exact pickup and delivery addresses can affect the final quote."],
      ["Is Winnipeg to Calgary pricing based on weight or volume?", "Long-distance estimates may be based on weight or volume depending on the shipment, route, and estimate process. Inventory details are reviewed before a written quote is prepared."],
      ["Can you pack or store items during a Winnipeg to Calgary move?", "Yes. Full or partial packing, unpacking, supplies, short-term storage, and long-term storage can be included in the estimate."],
      ["How is Declared Value Protection handled?", "Declared Value Protection options are explained before moving day, including the applicable coverage details and zero-deductible terms stated in the written estimate."],
      ["How do I get a Winnipeg to Calgary moving estimate?", "Submit the route, home size, inventory, access details, services, and preferred date through the estimate form or contact Purely Canadian Movers for a written estimate."]
    ]
  }
];

const pricingRows = [
  ["Studio", "$2,300+"],
  ["1-bedroom", "$3,200+"],
  ["2-bedroom", "$5,100+"],
  ["3-bedroom", "$8,200+"],
  ["4+ bedroom", "$12,000+"]
];

function faqSchema(route) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": route.faq.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text }
    }))
  };
}

function section(route) {
  const routeLower = route.direction.toLowerCase();
  const rows = pricingRows.map(([size, cost]) => `<tr><td>${size}</td><td>${cost}</td><td>Planning figure; final quote depends on inventory and services</td><td>3–11 days</td></tr>`).join("");
  const faqs = route.faq.map(([q, a]) => `<article class="pcm-card"><h3>${q}</h3><p>${a}</p></article>`).join("");
  const faqLinks = route.originHub ? `<a href="${route.originHub}">Calgary Long-Distance Movers</a>` : "";
  return `
      <section class="pcm-section pcm-route-glance-section">
        <h2>${route.direction} Route at a Glance</h2>
        <div class="pcm-route-glance">
          <div class="pcm-glance-item"><span class="pcm-glance-label">Distance</span><strong class="pcm-glance-value">1,320 km</strong><span class="pcm-glance-support">${route.from}, ${route.fromProvince} to ${route.to}, ${route.toProvince}</span></div>
          <div class="pcm-glance-item"><span class="pcm-glance-label">Est. transit time</span><strong class="pcm-glance-value">3–11 days</strong><span class="pcm-glance-support">Depending on shipment size and scheduling</span></div>
          <div class="pcm-glance-item"><span class="pcm-glance-label">Typical cost range</span><strong class="pcm-glance-value">$2,300+–$12,000+</strong><span class="pcm-glance-support">Studio to 4+ bedroom home</span></div>
        </div>
      </section>
      <section class="pcm-section pcm-route-cost" aria-label="${route.direction} moving cost estimates">
        <h2>How much does it cost to move from ${route.from} to ${route.to}?</h2>
        <p>For this approximately 1,320 km corridor, planning figures range from $2,300+ for a studio to $12,000+ for a 4+ bedroom home. Final pricing depends on inventory, access, packing, storage, timing, specialty items, and the services confirmed in writing.</p>
        <div class="pcm-table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Planning note</th><th>Typical transit</th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="pcm-route-cost__inclusion">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible.</p>
      </section>
      <section class="pcm-section">
        <h2>Planning a ${route.direction} move</h2>
        <div class="pcm-grid"><article class="pcm-card"><h3>Prairie route logistics</h3><p>This route connects two Prairie cities across 1,320 km. Pickup and delivery access, shipment size, weather, and route scheduling all influence the delivery window.</p></article><article class="pcm-card"><h3>Origin access review</h3><p>Share elevator reservations, parking, stairs, long carries, loading windows, and building rules for the ${route.from} address before the estimate is finalized.</p></article><article class="pcm-card"><h3>Destination coordination</h3><p>Confirm move-in hours, curb access, elevator time, entry conditions, and room placement details for the ${route.to} delivery.</p></article></div>
      </section>
      <section class="pcm-section">
        <h2>Services and move coordination</h2>
        <p>Purely Canadian Movers provides one accountable point of contact for route planning, documentation, packing, storage, delivery coordination, and written estimate details, with support through the Great Canadian Van Lines agent network.</p>
        <div class="pcm-links"><a href="/packing/">Packing Services</a><a href="/storage/">Storage Options</a><a href="/valuation-coverage-protection/">Declared Value Protection</a><a href="/great-canadian-vanlines-agent/">Great Canadian Van Lines Agent</a></div>
      </section>
      <section class="pcm-section">
        <h2>Frequently Asked Questions</h2>
        <div class="pcm-faq-list">${faqs}</div>
      </section>
      <section class="pcm-section">
        <h2>Related Destinations and Resources</h2>
        <div class="pcm-links">${faqLinks}<a href="/long-distance-moving-cost-canada/">Moving Cost Guide</a><a href="/long-distance/">Long-Distance Moving</a><a href="/contact/">Get a Written Estimate</a></div>
      </section>
      <section class="pcm-section pcm-closing-cta"><h2>Ready to plan your ${routeLower} move?</h2><p>Request a free, no-obligation written estimate for your route.</p><div class="pcm-links"><a href="/contact/">Get a Written Estimate</a><a href="tel:18774856683">Call 1-877-485-6683</a></div></section>`;
}

for (const route of routes) {
  const path = join(root, route.slug, "index.html");
  let html = await readFile(path, "utf8");
  const canonical = `https://purelycanadianmovers.com/${route.slug}/`;
  const title = `${route.direction} Moving Cost | Movers, Distance &amp; Transit Time`;
  const description = `${route.direction} moving cost guide with estimated prices by home size, 1,320 km route distance, 3–11 day transit planning, packing, storage, and written quotes.`;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${description}">`)
    .replace(/<link rel="canonical" href="[^"]+">/i, `<link rel="canonical" href="${canonical}">`)
    .replace(/<meta property="og:url" content="[^"]+">/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${description}">`)
    .replace(/<section class="pcm-lead-boost pcm-lead-panel"[\s\S]*?<\/section>/i, "")
    .replace(/<input name="from"[^>]*>/i, `<input name="from" value="${route.from}, ${route.fromProvince}">`)
    .replace(/<input name="to"[^>]*>/i, `<input name="to" value="${route.to}, ${route.toProvince}">`)
    .replace(/<h2>Get a [^<]+ quote\.<\/h2>/i, `<h2>Get a ${route.direction} quote.</h2>`)
    .replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${route.direction} Moving Cost, Distance &amp; Transit Time</h1>`)
    .replace(/<div class="pcm-kicker">[^<]*movers<\/div>/i, `<div class="pcm-kicker">${route.direction} movers</div>`);

  html = html.replace(/\s*<link rel="stylesheet" href="\/assets\/static-nav\.css">/gi, "").replace(/\s*<link rel="stylesheet" href="\/assets\/static-chat\.css">/gi, "");
  html = html.replace(/<link rel="stylesheet" href="\/assets\/conversion-boost\.css">/i, `<link rel="stylesheet" href="/assets/conversion-boost.css"><link rel="stylesheet" href="/assets/static-nav.css"><link rel="stylesheet" href="/assets/static-chat.css">`);
  html = html.replace(/<nav class="pcm-nav" aria-label="Main navigation">[\s\S]*?<\/nav>/i, `<nav class="pcm-nav" aria-label="Main navigation"><a href="/"><img class="pcm-logo" src="/pcm-logo.png" alt="Purely Canadian Movers"></a><button type="button" class="pcm-mobile-toggle" aria-label="Open menu">Menu</button><div><button type="button">Services</button><button type="button">Local Moves</button><button type="button">Long-Distance</button><a href="/storage/">Storage</a><a href="/blog/">Blog</a><a href="/contact/">Contact</a><a class="pcm-cta" href="/contact/">Get Free Estimate</a></div></nav>`);
  html = html.replace(/\s*<style data-pcm-route-controls>[\s\S]*?<\/style>/i, "");
  html = html.replace("</head>", `<style data-pcm-route-controls>.pcm-nav button{font:inherit;cursor:pointer}.pcm-nav>div>button{border:0;background:transparent;color:#14213d;font-weight:700;padding:8px 10px}.pcm-mobile-toggle{display:none;border:1px solid #d9dee7;background:#fff;border-radius:6px;padding:8px 12px}@media(max-width:820px){.pcm-mobile-toggle{display:block}.pcm-nav>div{display:none}}</style></head>`);

  html = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?FAQPage[\s\S]*?<\/script>/gi, "");
  html = html.replace(/\s*<script type="application\/ld\+json" id="route-schema">[\s\S]*?<\/script>/i, "");
  html = html.replace("</head>", `<script type="application/ld+json" id="route-schema">${JSON.stringify(faqSchema(route))}</script></head>`);

  html = html.replace(/\binsurance\b/gi, "Declared Value Protection");
  const mainStart = html.indexOf('<main class="pcm-main">');
  const heroStart = html.indexOf('      <section class="pcm-hero">', mainStart);
  const heroEnd = html.indexOf('      </section>', heroStart) + '      </section>'.length;
  const mainEnd = html.indexOf("    </main>", heroEnd);
  if (mainStart < 0 || heroStart < 0 || heroEnd < 0 || mainEnd < 0) throw new Error(`Could not locate route layout in ${path}`);
  html = html.slice(0, heroEnd) + section(route) + "\n" + html.slice(mainEnd);
  html = html.replace(/\s*<script[^>]+src="\/assets\/static-nav\.js"[^>]*><\/script>/gi, "").replace(/\s*<script[^>]+src="\/assets\/static-chat\.js"[^>]*><\/script>/gi, "");
  html = html.replace(/<script defer="" src="\/assets\/conversion-boost\.js"><\/script>/i, `<script defer="" src="/assets/conversion-boost.js"></script><script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script>`);

  await writeFile(path, html, "utf8");
  console.log(`Rebuilt ${path}`);
}
