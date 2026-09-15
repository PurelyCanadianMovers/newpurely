import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2] || "site-copy";
const sourcePath = join(root, "toronto-long-distance-movers", "index.html");
const outputDir = join(root, "winnipeg-long-distance-movers");
const outputPath = join(outputDir, "index.html");
const origin = "https://purelycanadianmovers.com";
const pageUrl = `${origin}/winnipeg-long-distance-movers/`;
const title = "Winnipeg Long-Distance Movers | Purely Canadian Movers";
const description = "Long-distance movers to and from Winnipeg, Manitoba. Plan cross-Canada moves with written estimates, packing, storage, route coordination, and Great Canadian Van Lines agent support.";

const routes = [
  ["/winnipeg-to-calgary-movers/", "Winnipeg → Calgary"],
  ["/winnipeg-to-edmonton-movers/", "Winnipeg → Edmonton"],
  ["/winnipeg-to-montreal-movers/", "Winnipeg → Montreal"],
  ["/winnipeg-to-ottawa-movers/", "Winnipeg → Ottawa"],
  ["/winnipeg-to-toronto-movers/", "Winnipeg → Toronto"],
  ["/winnipeg-to-vancouver-movers/", "Winnipeg → Vancouver"],
];

const faqs = [
  ["How much does a long-distance move from Winnipeg cost?", "Moving costs depend on shipment weight or volume, origin and destination access, packing, storage, timing, specialty items, protection choices, and the services confirmed in writing. Use the moving cost guide for planning context and request a written estimate for your move."],
  ["How long does a move to or from Winnipeg take?", "Transit timing depends on route scheduling, shipment size, weather, access, and delivery availability. Your written estimate and moving documents should set out the confirmed delivery spread rather than promise a guaranteed date."],
  ["How are Winnipeg long-distance estimates calculated?", "Estimates consider your inventory, shipment weight or volume, pickup and delivery addresses, access conditions, requested services, packing, storage, timing, and protection choices."],
  ["Can you pack or store items for a Winnipeg move?", "Yes. Full or partial packing, unpacking, and short- or long-term storage can be included when those services are requested and confirmed in the written estimate."],
  ["What pickup and delivery details should I plan?", "Share elevator reservations, loading windows, parking restrictions, stairs, long carries, building rules, truck access, and seasonal conditions for both the Winnipeg origin and destination."],
  ["Which long-distance routes are available from Winnipeg?", "Dedicated Winnipeg-origin pages currently cover Calgary, Edmonton, Montreal, Ottawa, Toronto, and Vancouver. Route availability and service details should be confirmed for your specific shipment."],
  ["Is Declared Value Protection available?", "Standard carrier liability applies, and available Declared Value Protection options are explained and confirmed before moving day. Coverage details are not the same as guaranteed protection for every circumstance."],
];

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

function routeCards() {
  return routes.map(([href, label]) => `<a class="pcm-route-link" href="${href}">${label}</a>`).join("");
}

function faqCards() {
  return faqs.map(([question, answer]) => `<article class="pcm-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("");
}

function pageMain() {
  return `<main class="pcm-winnipeg-hub">
  <section class="pcm-lead-boost pcm-lead-panel" aria-label="Free Winnipeg moving estimate"><div class="pcm-lead-panel__inner"><div><div class="pcm-lead-panel__eyebrow">Free moving estimate</div><h2>Get a quote for your Winnipeg move.</h2><p>Share your origin, destination, home size, and preferred date so Purely Canadian Movers can help plan a realistic long-distance estimate.</p><div class="pcm-trust-row"><span>Family-owned since 1991</span><span>Coquitlam office</span><span>BBB Accredited business</span><span>No brokers or subcontractors</span><span>Declared Value Protection available</span><span>Great Canadian Van Lines agent</span></div></div><form class="pcm-estimate-form" action="/contact/" method="get"><div class="pcm-mobile-form-start">Begin here</div><label>Moving from<input name="from" value="Winnipeg, MB" placeholder="Winnipeg, MB" type="text"></label><label>Moving to<input name="to" placeholder="City, Province" type="text"></label><label>Home size<select name="homeSize"><option value="">Select size</option><option value="Studio / small apartment">Studio / small apartment</option><option value="1 bedroom">1 bedroom</option><option value="2 bedroom">2 bedroom</option><option value="3 bedroom">3 bedroom</option><option value="4+ bedroom">4+ bedroom</option><option value="Office / commercial">Office / commercial</option></select></label><label>Move date<input name="moveDate" type="date"></label><div class="pcm-button-row"><button class="pcm-primary-button" type="submit">Continue Estimate</button><a class="pcm-secondary-button" href="tel:18774856683">Call 1-877-485-6683</a></div><div class="pcm-estimate-reassurance">No spam. No pressure. Just your moving estimate. Questions? Call Purely Canadian Movers: 1-877-485-6683</div><div class="pcm-estimate-trust-note"><strong>Verified company details:</strong> Unit 16-91 Golden Dr., Coquitlam, BC · Local phone <a href="tel:16045227222">604-522-7222</a> · Direct mover since 1991</div></form></div></section>
  <section class="pcm-winnipeg-hero"><div class="container"><div class="pcm-breadcrumb"><a href="/">Home</a><span>/</span><a href="/long-distance/">Long-Distance</a><span>/</span><span>Winnipeg</span></div><p class="pcm-kicker">Winnipeg, MB ↔ Canada-wide routes</p><h1>Winnipeg Long-Distance Movers</h1><p class="pcm-hero-copy">Professional long-distance moving to and from Winnipeg, Manitoba, with written estimates, route planning, packing, storage, and Declared Value Protection options.</p><div class="pcm-hero-actions"><a class="pcm-primary-button" href="/contact/">Get a Free Quote</a><a class="pcm-secondary-button" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section>
  <section class="pcm-winnipeg-section"><div class="container"><h2>Moving To or From Winnipeg</h2><p>Winnipeg is a central Canadian starting point for long-distance moves between Manitoba, Western Canada, Ontario, Quebec, and destinations across the country. A written estimate helps set clear expectations for shipment details, access, packing, storage, timing, and delivery coordination.</p><p>Purely Canadian Movers coordinates long-distance moves through the Great Canadian Van Lines agent network, with one accountable point of contact for route planning and moving-day details. Winnipeg houses, apartments, condos, and businesses may require elevator reservations, loading windows, parking planning, stairs, long carries, and winter access planning.</p></div></section>
  <section class="pcm-winnipeg-section pcm-winnipeg-alt"><div class="container"><h2>Popular Winnipeg Long-Distance Services and Routes</h2><div class="pcm-grid"><article class="pcm-card"><h3>Cross-Canada household moves</h3><p>Plan Manitoba moves to or from Western Canada, Ontario, Quebec, and other Canadian destinations with route-specific details confirmed in writing.</p></article><article class="pcm-card"><h3>Packing and unpacking</h3><p>Full or partial packing can be included for household goods, fragile items, electronics, and other moving needs.</p></article><article class="pcm-card"><h3>Storage between homes</h3><p>Short- or long-term storage can be discussed when pickup and delivery timing does not line up.</p></article><article class="pcm-card"><h3>Route and access planning</h3><p>Review inventory, shipment weight or volume, building access, parking, stairs, loading areas, timing, and delivery requirements before moving day.</p></article></div></div></section>
  <section class="pcm-winnipeg-section" aria-labelledby="winnipeg-routes-heading"><div class="container"><h2 id="winnipeg-routes-heading">Routes From Winnipeg</h2><p>Explore the dedicated Winnipeg-origin routes currently represented in the repository:</p><div class="pcm-route-grid">${routeCards()}</div></div></section>
  <section class="pcm-winnipeg-section pcm-winnipeg-alt"><div class="container"><h2>Moving From Other Canadian Cities?</h2><p>Winnipeg is also a destination for long-distance moves from other Canadian cities. Share both addresses, your inventory, access details, preferred date, and any packing or storage needs so the route can be assessed accurately.</p><div class="pcm-inline-links"><a href="/long-distance-moving-cost-canada/">Moving cost guide</a><a href="/packing/">Packing services</a><a href="/storage/">Storage options</a><a href="/valuation-coverage-protection/">Declared Value Protection</a></div></div></section>
  <section class="pcm-winnipeg-section"><div class="container"><h2>Winnipeg Long-Distance Moving Logistics</h2><div class="pcm-grid"><article class="pcm-card"><h3>Pickup and delivery access</h3><p>Confirm elevators, loading docks, parking, stairs, long carries, move-in rules, and truck access at both ends of the move.</p></article><article class="pcm-card"><h3>Realistic timing</h3><p>Transit depends on route scheduling, shipment size, weather, access, and delivery availability. Plan around a delivery spread rather than an assumed guaranteed date.</p></article><article class="pcm-card"><h3>Weight-based estimates</h3><p>Long-distance pricing may depend on shipment weight or volume, services requested, access conditions, timing, and protection choices.</p></article><article class="pcm-card"><h3>Coordinated support</h3><p>Purely Canadian Movers provides written estimate guidance and route coordination with Great Canadian Van Lines agent-network support.</p></article></div></div></section>
  <section class="pcm-winnipeg-section pcm-winnipeg-alt"><div class="container"><h2>How Much Does a Winnipeg Long-Distance Move Cost?</h2><p>There is no single guaranteed price for a Winnipeg long-distance move. Final pricing depends on the shipment, route, pickup and delivery access, packing, storage, timing, specialty items, protection choices, and confirmed services.</p><p>Use the <a href="/long-distance-moving-cost-canada/">long-distance moving cost guide</a> for general planning guidance, then request a written estimate based on your inventory and addresses. Do not treat a route-specific estimate as a generic Winnipeg price.</p></div></section>
  <section class="pcm-winnipeg-section"><div class="container"><h2>Our Long-Distance Moving Process</h2><div class="pcm-process-grid"><article class="pcm-card"><strong>1</strong><h3>Request an estimate</h3><p>Share your route, inventory, home size, access, services, and preferred date.</p></article><article class="pcm-card"><strong>2</strong><h3>Confirm the plan</h3><p>Review the written estimate, packing, storage, timing, access, and protection choices.</p></article><article class="pcm-card"><strong>3</strong><h3>Pack and load</h3><p>Prepare the shipment and coordinate Winnipeg pickup details with the moving team.</p></article><article class="pcm-card"><strong>4</strong><h3>Transit and delivery</h3><p>Coordinate the confirmed delivery spread and destination access through the route plan.</p></article></div></div></section>
  <section class="pcm-winnipeg-section pcm-winnipeg-faq" aria-labelledby="faq-heading"><div class="container"><h2 id="faq-heading">Frequently Asked Questions</h2><div class="pcm-faq-list">${faqCards()}</div></div></section>
  <section class="pcm-winnipeg-cta"><div class="container"><h2>Ready to Plan Your Winnipeg Move?</h2><p>Request a free, no-obligation written estimate for your move to or from Winnipeg.</p><div class="pcm-hero-actions"><a class="pcm-primary-button" href="/contact/">Request a Free Quote</a><a class="pcm-secondary-button" href="tel:18774856683">Call 1-877-485-6683</a></div></div></section>
  </main>`;
}

function buildHead() {
  const schema = `<script type="application/ld+json" id="pcm-winnipeg-schema">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "name": "Winnipeg Long-Distance Moving", "serviceType": "Long-distance moving", "url": pageUrl, "description": description, "provider": { "@id": `${origin}/#organization` }, "areaServed": [{ "@type": "City", "name": "Winnipeg" }, { "@type": "AdministrativeArea", "name": "Manitoba" }, { "@type": "Country", "name": "Canada" }] },
      { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": `${origin}/` }, { "@type": "ListItem", "position": 2, "name": "Long-Distance", "item": `${origin}/long-distance/` }, { "@type": "ListItem", "position": 3, "name": "Winnipeg Long-Distance Movers", "item": pageUrl }] },
    ],
  })}</script><script type="application/ld+json" id="faq-schema">${JSON.stringify(faqSchema)}</script>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="theme-color" content="#CC1A1A"><meta property="og:type" content="website"><meta property="og:site_name" content="Purely Canadian Movers"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${pageUrl}"><meta property="og:locale" content="en_CA"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><link rel="canonical" href="${pageUrl}"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="stylesheet" href="/assets/index-DOGLBY_X.css"><link rel="stylesheet" href="/assets/static-nav.css"><link rel="stylesheet" href="/assets/static-chat.css"><link rel="stylesheet" href="/assets/conversion-boost.css">${schema}<style>${customCss()}</style></head>`;
}

function customCss() {
  return `.pcm-winnipeg-hero{background:#1f2937;color:#fff;padding:5rem 0}.pcm-winnipeg-hero .container,.pcm-winnipeg-section .container,.pcm-winnipeg-cta .container{max-width:1100px;margin:0 auto;padding:0 1.25rem}.pcm-breadcrumb{display:flex;gap:.6rem;color:#9ca3af;font-size:.9rem;margin-bottom:1.5rem}.pcm-breadcrumb a{color:#d1d5db}.pcm-kicker{color:#fca5a5;text-transform:uppercase;letter-spacing:.08em;font-weight:700;font-size:.85rem}.pcm-winnipeg-hero h1{font-size:clamp(2.5rem,5vw,4rem);margin:.75rem 0 1rem}.pcm-hero-copy{max-width:700px;color:#d1d5db;font-size:1.2rem;line-height:1.6}.pcm-hero-actions{display:flex;flex-wrap:wrap;gap:1rem;margin-top:1.5rem}.pcm-primary-button,.pcm-secondary-button{display:inline-flex;align-items:center;justify-content:center;border-radius:.375rem;padding:.7rem 1.25rem;font-weight:700;text-decoration:none}.pcm-primary-button{background:#cc1a1a;color:#fff}.pcm-secondary-button{border:1px solid #fff;color:inherit}.pcm-winnipeg-section{padding:4rem 0;background:#fff}.pcm-winnipeg-alt{background:#f9fafb}.pcm-winnipeg-section h2{font-size:clamp(1.8rem,3vw,2.5rem);margin:0 0 1rem;color:#111827}.pcm-winnipeg-section p{color:#374151;line-height:1.7}.pcm-grid,.pcm-process-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.pcm-card{background:#fff;border:1px solid #e5e7eb;border-radius:.75rem;padding:1.25rem}.pcm-winnipeg-alt .pcm-card{background:#fff}.pcm-card h3{margin:.25rem 0 .5rem;color:#111827}.pcm-card strong{color:#cc1a1a;font-size:1.5rem}.pcm-route-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;margin-top:1.5rem}.pcm-route-link{display:block;border:1px solid #e5e7eb;border-radius:.5rem;padding:1rem;color:#b31313;font-weight:700;text-decoration:none;background:#fff}.pcm-inline-links{display:flex;flex-wrap:wrap;gap:1rem;margin-top:1.25rem}.pcm-inline-links a{color:#b31313;font-weight:700}.pcm-winnipeg-faq .pcm-faq-list{display:grid;gap:1rem}.pcm-winnipeg-cta{background:#cc1a1a;color:#fff;padding:4rem 0;text-align:center}.pcm-winnipeg-cta h2{color:#fff}.pcm-winnipeg-cta p{color:#fee2e2}.pcm-winnipeg-cta .pcm-secondary-button{color:#fff}@media(max-width:700px){.pcm-winnipeg-hero{padding:3.5rem 0}.pcm-winnipeg-section{padding:3rem 0}}`;
}

const toronto = await readFile(sourcePath, "utf8");
const header = toronto.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
const footer = toronto.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0];
if (!header || !footer) throw new Error("Toronto hub shell is missing header or footer");

const html = `${buildHead()}<body>${header}${pageMain()}${footer}<script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script></body></html>`;
if ((html.match(/<h1\b/gi) || []).length !== 1) throw new Error("Expected exactly one H1");
if (routes.some(([href]) => !html.includes(`href="${href}"`))) throw new Error("Missing Winnipeg route link");
if ((html.match(/id="faq-schema"/gi) || []).length !== 1) throw new Error("Expected exactly one FAQ schema");
if (html.includes("Long Distance Movers To &amp; From Toronto") || html.includes("Professional Movers in Vancouver &amp; the Lower Mainland Since 1991")) throw new Error("Inherited city content detected");
if (html.includes("undefined")) throw new Error("Generated HTML contains undefined");

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, html);
console.log(`Built ${outputPath} from the Toronto hub shell`);
