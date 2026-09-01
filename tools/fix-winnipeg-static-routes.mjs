import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const siteRoot = process.argv[2] || "site-copy";
const siteOrigin = "https://purelycanadianmovers.com";

const priceSets = {
  prairie: {
    studio: "$2,300",
    one: "$3,200",
    two: "$5,100",
    three: "$8,200",
    four: "$12,000",
    transit: "3-11 days",
  },
  westCoast: {
    studio: "$2,400",
    one: "$3,400",
    two: "$5,500",
    three: "$8,900",
    four: "$13,000",
    transit: "5-13 days",
  },
  centralShort: {
    studio: "$2,400",
    one: "$3,400",
    two: "$5,500",
    three: "$9,000",
    four: "$13,000",
    transit: "4-12 days",
  },
  coastToCentral: {
    studio: "$2,500",
    one: "$4,700",
    two: "$6,500",
    three: "$10,000",
    four: "$15,000",
    transit: "10-22 days",
  },
  coastToEast: {
    studio: "$3,000",
    one: "$5,300",
    two: "$7,000",
    three: "$11,000",
    four: "$16,000",
    transit: "10-27 days",
  },
  transCanada: {
    studio: "$2,500",
    one: "$4,700",
    two: "$6,500",
    three: "$10,000",
    four: "$15,000",
    transit: "9-22 days",
  },
};

const routes = [
  ["Winnipeg", "MB", "Calgary", "AB", "winnipeg-to-calgary-movers", "prairie", "1,320 km"],
  ["Calgary", "AB", "Winnipeg", "MB", "calgary-to-winnipeg-movers", "prairie", "1,320 km"],
  ["Winnipeg", "MB", "Edmonton", "AB", "winnipeg-to-edmonton-movers", "prairie", "1,300 km"],
  ["Edmonton", "AB", "Winnipeg", "MB", "edmonton-to-winnipeg-movers", "prairie", "1,300 km"],
  ["Winnipeg", "MB", "Vancouver", "BC", "winnipeg-to-vancouver-movers", "westCoast", "2,300 km"],
  ["Vancouver", "BC", "Winnipeg", "MB", "vancouver-to-winnipeg-movers", "westCoast", "2,300 km"],
  ["Winnipeg", "MB", "Toronto", "ON", "winnipeg-to-toronto-movers", "centralShort", "2,225 km"],
  ["Toronto", "ON", "Winnipeg", "MB", "toronto-to-winnipeg-movers", "centralShort", "2,225 km"],
  ["Winnipeg", "MB", "Ottawa", "ON", "winnipeg-to-ottawa-movers", "centralShort", "2,170 km"],
  ["Ottawa", "ON", "Winnipeg", "MB", "ottawa-to-winnipeg-movers", "centralShort", "2,170 km"],
  ["Vancouver", "BC", "Montreal", "QC", "vancouver-to-montreal-movers", "coastToEast", "4,570 km"],
  ["Vancouver", "BC", "Ottawa", "ON", "vancouver-to-ottawa-movers", "coastToCentral", "4,360 km"],
  ["Vancouver", "BC", "Halifax", "NS", "vancouver-to-halifax-movers", "coastToEast", "6,000 km"],
  ["Toronto", "ON", "Vancouver", "BC", "toronto-to-vancouver-movers", "transCanada", "4,350 km"],
  ["Vancouver", "BC", "Toronto", "ON", "vancouver-to-toronto-movers", "transCanada", "4,350 km"],
].map(([from, fromProvince, to, toProvince, slug, priceKey, distance]) => ({
  from,
  fromProvince,
  to,
  toProvince,
  slug,
  distance,
  ...priceSets[priceKey],
}));

const cityHub = {
  Calgary: "/calgary-long-distance-movers/",
  Edmonton: "/edmonton-long-distance-movers/",
  Montreal: "/montreal-long-distance-movers/",
  Ottawa: "/ottawa-long-distance-movers/",
  Halifax: "/halifax-long-distance-movers/",
  Toronto: "/toronto-long-distance-movers/",
  Vancouver: "/vancouver-long-distance-movers/",
};

const fallbackShell = await readFile(join(siteRoot, "index.html"), "utf8");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setTag(head, pattern, replacement, before = "</head>") {
  if (pattern.test(head)) {
    return head.replace(pattern, replacement);
  }
  return head.replace(before, `${replacement}\n${before}`);
}

function buildFaqs(route) {
  const { from, fromProvince, to, toProvince, transit } = route;
  return [
    {
      q: `How much does it cost to move from ${from} to ${to}?`,
      a: `Estimated ${from} to ${to} moving costs range from ${route.studio} for a small shipment to ${route.four} for a larger 4+ bedroom move. Final pricing depends on shipment weight or volume, distance, access, packing, storage, season, and services required.`,
    },
    {
      q: `How long does a ${from} to ${to} move take?`,
      a: `Typical transit time for a ${from} to ${to} long-distance move is about ${transit}. Timing depends on route scheduling, shipment size, weather, access, and delivery availability.`,
    },
    {
      q: `Can you pack and store items for a ${from} to ${to} move?`,
      a: `Yes. Packing, unpacking, valuation coverage options, and storage can be added to a ${from}, ${fromProvince} to ${to}, ${toProvince} moving estimate.`,
    },
    {
      q: `Is this handled by a broker?`,
      a: `No. Purely Canadian Movers is an authorized Great Canadian Van Lines agent. Long-distance moves are handled through an established Canadian van line network, not sold to unknown moving brokers.`,
    },
  ];
}

function buildJsonLd(route) {
  const url = `${siteOrigin}/${route.slug}/`;
  const faqs = buildFaqs(route);
  const graph = [
    {
      "@type": "MovingCompany",
      "@id": `${siteOrigin}/#organization`,
      name: "Purely Canadian Movers Inc.",
      url: siteOrigin,
      telephone: "+1-877-485-6683",
      email: "esales@pcmovers.ca",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit 16 - 91 Golden Dr.",
        addressLocality: "Coquitlam",
        addressRegion: "BC",
        postalCode: "V3K 6R2",
        addressCountry: "CA",
      },
    },
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: `${route.from} to ${route.to} movers`,
      serviceType: "Long-distance moving",
      provider: { "@id": `${siteOrigin}/#organization` },
      areaServed: [
        { "@type": "City", name: route.from },
        { "@type": "City", name: route.to },
      ],
      url,
      description: `${route.from} to ${route.to} long-distance moving service with written estimates, route planning, packing, storage, valuation coverage options, and estimated transit of ${route.transit}.`,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Long-Distance Moving", item: `${siteOrigin}/long-distance/` },
        { "@type": "ListItem", position: 3, name: `${route.from} to ${route.to} Movers`, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  })}</script>`;
}

function buildHead(route, currentHtml) {
  const url = `${siteOrigin}/${route.slug}/`;
  const title = `${route.from} to ${route.to} Movers | Cost, Transit Time & Estimate`;
  const description = `Plan a ${route.from} to ${route.to} long-distance move with estimated costs by home size, ${route.distance} route planning, ${route.transit} transit guidance, packing, storage, and written quotes.`;
  const keywords = `${route.from} to ${route.to} movers, moving from ${route.from} to ${route.to}, long distance movers ${route.from} to ${route.to}, ${route.from} ${route.to} moving company, ${route.from} to ${route.to} moving cost, ${route.from} to ${route.to} moving quote`;
  let head = currentHtml.match(/<head>[\s\S]*?<\/head>/i)?.[0] || `<head></head>`;

  head = head
    .replace(/\s*<script[^>]+src=["'][^"']*index-CNBNs70h\.js["'][^>]*><\/script>\s*/gi, "\n")
    .replace(/href="(?:\.\.?\/)+assets\//g, 'href="/assets/')
    .replace(/\s*<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, "\n");

  head = setTag(head, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  head = setTag(head, /<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}">`);
  head = setTag(head, /<meta name="keywords" content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${escapeHtml(keywords)}">`);
  head = setTag(head, /<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${url}">`);
  head = setTag(head, /<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}">`);
  head = setTag(head, /<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}">`);
  head = setTag(head, /<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}">`);
  head = setTag(head, /<meta property="og:type" content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="website">`);
  head = setTag(head, /<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
  head = setTag(head, /<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}">`);
  head = setTag(head, /<meta name="twitter:card" content="[^"]*"\s*\/?>/i, `<meta name="twitter:card" content="summary_large_image">`);

  if (!head.includes("pcm-static-winnipeg-route-css")) {
    head = head.replace(
      "</head>",
      `<style id="pcm-static-winnipeg-route-css">
        body { margin: 0; background: #f8fafc; color: #111827; font-family: Inter, Arial, sans-serif; }
        .pcm-topbar { background: #b51218; color: #fff; font-weight: 700; padding: 10px 24px; font-size: 14px; }
        .pcm-nav { background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 14px 7vw; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08); }
        .pcm-logo { height: 52px; width: auto; }
        .pcm-nav a { color: #111827; text-decoration: none; font-weight: 700; font-size: 14px; margin-left: 18px; }
        .pcm-nav .pcm-cta { background: #d71920; color: #fff; padding: 12px 18px; border-radius: 7px; }
        .pcm-main { max-width: 1120px; margin: 0 auto; padding: 42px 18px 64px; }
        .pcm-hero { background: #fff; border: 1px solid #e5e7eb; border-left: 5px solid #d71920; border-radius: 8px; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr); gap: 32px; padding: 32px; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); }
        .pcm-kicker { color: #d71920; font-size: 13px; font-weight: 900; letter-spacing: .03em; text-transform: uppercase; }
        h1, h2, h3 { font-family: Georgia, 'Times New Roman', serif; color: #0f172a; line-height: 1.08; }
        h1 { font-size: clamp(36px, 5vw, 58px); margin: 10px 0 16px; }
        h2 { font-size: clamp(28px, 3.4vw, 42px); margin: 0 0 12px; }
        h3 { font-size: 22px; margin: 0 0 8px; }
        p { color: #334155; line-height: 1.65; font-size: 17px; }
        .pcm-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
        .pcm-pill { border: 1px solid #e5e7eb; border-radius: 999px; padding: 9px 13px; font-weight: 800; background: #fff; font-size: 14px; }
        .pcm-estimate { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; }
        .pcm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        label { font-weight: 800; font-size: 13px; display: grid; gap: 6px; }
        input, select { border: 1px solid #cbd5e1; border-radius: 7px; padding: 12px; font-weight: 700; color: #334155; }
        .pcm-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
        .pcm-button { border: 1px solid #d71920; border-radius: 7px; display: inline-flex; justify-content: center; align-items: center; padding: 13px 14px; text-decoration: none; font-weight: 900; }
        .pcm-button.primary { background: #d71920; color: #fff; }
        .pcm-button.secondary { color: #d71920; background: #fff; }
        .pcm-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 24px; padding: 28px; }
        .pcm-table-wrap { overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; min-width: 620px; }
        th { background: #111827; color: #fff; text-align: left; padding: 15px; }
        td { border-top: 1px solid #e5e7eb; padding: 15px; color: #334155; font-weight: 700; }
        tr:nth-child(even) td { background: #f8fafc; }
        .pcm-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
        .pcm-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; background: #fff; }
        .pcm-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .pcm-links a { border: 1px solid #fecaca; color: #d71920; border-radius: 999px; padding: 9px 13px; text-decoration: none; font-weight: 800; }
        .pcm-footer { background: #0f172a; color: #cbd5e1; padding: 34px 7vw; }
        .pcm-footer a { color: #fff; }
        @media (max-width: 820px) {
          .pcm-hero, .pcm-grid { grid-template-columns: 1fr; }
          .pcm-nav { align-items: flex-start; flex-direction: column; }
          .pcm-nav a { margin: 0 12px 10px 0; display: inline-block; }
          .pcm-form-grid, .pcm-buttons { grid-template-columns: 1fr; }
        }
      </style>\n</head>`,
    );
  }

  return head.replace("</head>", `${buildJsonLd(route)}\n</head>`);
}

function relatedLinks(route) {
  const links = [
    ["Long-Distance Moving", "/long-distance/"],
    ["Moving Cost Guide", "/long-distance-moving-cost-canada/"],
    ["Packing Services", "/packing/"],
    ["Storage Options", "/storage/"],
    ["Get a Written Estimate", "/contact/"],
  ];

  for (const city of [route.from, route.to]) {
    if (cityHub[city]) {
      links.unshift([`${city} Long-Distance Movers`, cityHub[city]]);
    }
  }

  return links
    .map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`)
    .join("\n");
}

function bodyHtml(route) {
  const faqs = buildFaqs(route);
  const routeName = `${route.from} to ${route.to}`;
  const fromFull = `${route.from}, ${route.fromProvince}`;
  const toFull = `${route.to}, ${route.toProvince}`;

  return `<body>
  <div id="root">
    <header>
      <div class="pcm-topbar">Family-owned since 1991 - Based in Coquitlam, BC - Great Canadian Van Lines agent</div>
      <nav class="pcm-nav" aria-label="Main navigation">
        <a href="/"><img class="pcm-logo" src="/pcm-logo.png" alt="Purely Canadian Movers"></a>
        <div>
          <a href="/">Home</a>
          <a href="/long-distance/">Long-Distance</a>
          <a href="/local/">Local Moves</a>
          <a href="/long-distance-moving-cost-canada/">Pricing</a>
          <a href="/blog/">Blog</a>
          <a href="/contact/">Contact</a>
          <a class="pcm-cta" href="/contact/">Get Free Estimate</a>
        </div>
      </nav>
    </header>

    <main class="pcm-main">
      <section class="pcm-hero">
        <div>
          <div class="pcm-kicker">${escapeHtml(route.from)} to ${escapeHtml(route.to)} movers</div>
          <h1>${escapeHtml(routeName)} Movers</h1>
          <p>Planning a long-distance move from ${escapeHtml(fromFull)} to ${escapeHtml(toFull)}? Purely Canadian Movers helps customers compare realistic pricing, transit timing, packing, storage, valuation coverage options, and written estimate details before moving day.</p>
          <p>Purely Canadian Movers is an authorized Great Canadian Van Lines agent. Your ${escapeHtml(routeName)} move is supported through an established Canadian van line network, not sold to unknown moving brokers.</p>
          <div class="pcm-pills" aria-label="Trust signals">
            <span class="pcm-pill">Family-owned since 1991</span>
            <span class="pcm-pill">BBB Accredited business</span>
            <span class="pcm-pill">Great Canadian Van Lines agent</span>
            <span class="pcm-pill">Written estimates</span>
            <span class="pcm-pill">Packing and storage available</span>
          </div>
        </div>

        <form class="pcm-estimate" action="/contact/" method="get">
          <div class="pcm-kicker">Free moving estimate</div>
          <h2>Get a ${escapeHtml(routeName)} quote.</h2>
          <div class="pcm-form-grid">
            <label>Moving from
              <input name="from" value="${escapeHtml(fromFull)}">
            </label>
            <label>Moving to
              <input name="to" value="${escapeHtml(toFull)}">
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
          <p><strong>Free estimate. No obligation.</strong> We use your details to prepare a more accurate moving estimate.</p>
        </form>
      </section>

      <section class="pcm-section">
        <h2>${escapeHtml(routeName)} moving cost and transit summary</h2>
        <p>These are planning ranges in CAD. Final pricing depends on shipment weight or volume, route distance, access, stairs, elevators, season, packing, storage, valuation coverage options, and any specialty items.</p>
        <div class="pcm-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Studio</th>
                <th>1-Bedroom</th>
                <th>2-Bedroom</th>
                <th>3-Bedroom</th>
                <th>4+ Bedroom</th>
                <th>Typical transit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${escapeHtml(routeName)}</td>
                <td>${route.studio}</td>
                <td>${route.one}</td>
                <td>${route.two}</td>
                <td>${route.three}</td>
                <td>${route.four}</td>
                <td>${route.transit}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="pcm-section">
        <h2>How this long-distance move is planned</h2>
        <div class="pcm-grid">
          <article class="pcm-card">
            <h3>Route and inventory review</h3>
            <p>We review your origin, destination, home size, inventory, access, packing needs, and timing so the estimate reflects the real move rather than a teaser price.</p>
          </article>
          <article class="pcm-card">
            <h3>Van line network support</h3>
            <p>Long-distance moves are supported through the Great Canadian Van Lines network, with Purely Canadian Movers providing your estimate, documentation, and direct point of contact.</p>
          </article>
          <article class="pcm-card">
            <h3>Delivery window planning</h3>
            <p>Typical transit for this route is ${route.transit}. Weather, access, route schedules, storage, and shipment size can affect final delivery timing.</p>
          </article>
        </div>
      </section>

      <section class="pcm-section">
        <h2>${escapeHtml(routeName)} moving questions</h2>
        ${faqs
          .map(
            (faq) => `<article class="pcm-card">
          <h3>${escapeHtml(faq.q)}</h3>
          <p>${escapeHtml(faq.a)}</p>
        </article>`,
          )
          .join("\n")}
      </section>

      <section class="pcm-section">
        <h2>Related moving resources</h2>
        <div class="pcm-links">
          ${relatedLinks(route)}
        </div>
      </section>
    </main>

    <footer class="pcm-footer">
      <strong>Purely Canadian Movers Inc.</strong><br>
      Unit 16 - 91 Golden Dr., Coquitlam, BC V3K 6R2<br>
      <a href="tel:18774856683">1-877-485-6683</a> - <a href="mailto:esales@pcmovers.ca">esales@pcmovers.ca</a>
    </footer>
  </div>
</body>`;
}

for (const route of routes) {
  const file = join(siteRoot, route.slug, "index.html");
  await mkdir(join(siteRoot, route.slug), { recursive: true });
  let currentHtml = fallbackShell;
  try {
    currentHtml = await readFile(file, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
  const html = `<!doctype html>
<html lang="en">
${buildHead(route, currentHtml)}
${bodyHtml(route)}
</html>`;
  await writeFile(file, html, "utf8");
  console.log(`Fixed ${route.slug}`);
}

const sitemapPath = join(siteRoot, "sitemap.xml");
let sitemap = await readFile(sitemapPath, "utf8");
for (const route of routes) {
  const loc = `${siteOrigin}/${route.slug}/`;
  if (!sitemap.includes(loc)) {
    sitemap = sitemap.replace("</urlset>", `  <url><loc>${loc}</loc></url>\n</urlset>`);
  }
}
await writeFile(sitemapPath, sitemap, "utf8");
console.log("Updated sitemap.xml");

// The Winnipeg–Montreal pair is maintained by the standardized generator so
// this legacy repair script cannot overwrite it with the retired layout.
await import("./rebuild-winnipeg-montreal-routes.mjs");
