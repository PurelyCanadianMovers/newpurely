import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] ?? "site-copy";
const template = await readFile(join(outDir, "office-movers-coquitlam-bc", "index.html"), "utf8");
const route = "/office-movers-coquitlam/";
const canonical = `https://purelycanadianmovers.com${route}`;
const title = "Office Movers Coquitlam, BC | Corporate & Commercial Moving";
const description = "Professional office, corporate, commercial, and business movers in Coquitlam, BC. Purely Canadian Movers plans local Tri-Cities relocations, packing, storage, and larger corporate moves.";

const faqs = [
  ["Do you provide office movers in Coquitlam?", "Yes. Purely Canadian Movers provides office, corporate, commercial, and business relocation services in Coquitlam and throughout the Tri-Cities, with planning for furniture, equipment, access, packing, and storage."],
  ["Can you move a business within Coquitlam or the Tri-Cities?", "Yes. We coordinate business moves within Coquitlam, Port Coquitlam, and Port Moody, as well as moves to other Metro Vancouver communities. The estimate is based on your inventory, access, schedule, and destination details."],
  ["Do you move office furniture and computer equipment?", "Our crews can move desks, chairs, shelving, filing cabinets, office contents, and other business equipment. Tell us about sensitive or oversized items so the move plan can account for handling and access requirements."],
  ["Can you help with packing and labelling an office?", "Yes. Full or partial packing, labelling, and unpacking can be included in an office moving plan. We can organize the work by department, room, workstation, or destination area based on your coordination needs."],
  ["How do you help minimize business downtime during a move?", "We start with a clear inventory and access review, then coordinate the crew, sequence, packing, furniture handling, and delivery details around your business requirements. A written estimate helps your team plan the relocation."],
  ["Is storage available during a Coquitlam office relocation?", "Coquitlam storage can be included when you need a temporary place for office furniture, equipment, or packed contents between locations. Storage needs and timing should be discussed when requesting the estimate."],
  ["Do you use subcontractors for office moves?", "No. Purely Canadian Movers uses its own trained moving crews for local work and remains directly accountable for the estimate, coordination, and move. Larger long-distance corporate relocations may use the established Great Canadian Van Lines agent network."],
  ["Can you handle a corporate relocation outside Coquitlam?", "Yes. In addition to local Coquitlam and Tri-Cities moves, Purely Canadian Movers can discuss larger corporate and employee relocations elsewhere in British Columbia or Canada through its long-distance capabilities and Great Canadian Van Lines network relationship."],
  ["What is Declared Value Protection for an office move?", "Declared Value Protection refers to the protection options explained for your shipment and move type. We review the applicable choices and documentation with you before the move; it is not presented as a separate insurance policy."],
  ["How do I request a Coquitlam office moving quote?", "Request a written estimate through the quote card on this page or contact Purely Canadian Movers at 1-877-485-6683. Share your origin, destination, preferred date, inventory, access details, packing needs, and any storage requirements."],
];

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "url": canonical,
  mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
};
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Office, corporate, and commercial moving in Coquitlam",
  serviceType: "Office and corporate moving",
  url: canonical,
  description,
  provider: { "@id": "https://purelycanadianmovers.com/#organization" },
  areaServed: [{ "@type": "City", name: "Coquitlam" }, { "@type": "AdministrativeArea", name: "Tri-Cities" }],
  availableChannel: { "@type": "ServiceChannel", serviceUrl: "https://purelycanadianmovers.com/contact/", servicePhone: "+1-877-485-6683" },
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://purelycanadianmovers.com/" },
    { "@type": "ListItem", position: 2, name: "Office Movers Coquitlam", item: canonical },
  ],
};

const main = `<main class="pcm-office-page">
  <section class="pcm-office-hero"><div class="pcm-office-hero__inner"><div><div class="pcm-kicker">Coquitlam business relocation specialists</div><h1>Office &amp; Corporate Movers in Coquitlam, BC</h1><p>Purely Canadian Movers provides office, corporate, commercial, and business relocation services in Coquitlam and throughout the Tri-Cities. We plan the practical details of moving your people, furniture, equipment, and records so your team can settle into the next space with less disruption.</p><p class="pcm-office-proof"><strong>Based in Coquitlam since 1991.</strong> Our own trained moving crews handle local work directly, with packing, storage, and long-distance corporate capabilities available when your relocation extends beyond Metro Vancouver.</p><div class="pcm-buttons"><a class="pcm-button primary" href="#office-quote">Get a Coquitlam office moving quote</a><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div></div><div class="pcm-office-hero__card"><strong>Built around your move plan</strong><span>Office furniture and equipment</span><span>Packing, labelling, and coordination</span><span>Coquitlam storage options</span><span>Local, BC, and Canada-wide capability</span></div></div></section>
  <section class="pcm-office-section"><div class="pcm-office-grid"><div><div class="pcm-kicker">Office moving services</div><h2>Coquitlam Office Moving Services</h2><p>An office move has more moving parts than a household move. We help businesses plan the sequence from the current office to the new commercial space, including furniture, workstations, shelving, files, equipment, and the access details that can affect loading and delivery.</p><p>Whether you are moving within Coquitlam, across the Tri-Cities, or to another Metro Vancouver location, we build the estimate around your inventory and the practical requirements of both sites.</p></div><div class="pcm-office-list"><h3>Useful support for your team</h3><ul><li>Move planning around rooms, departments, or workstations</li><li>Furniture disassembly and reassembly where appropriate</li><li>Full or partial packing, labelling, and unpacking</li><li>Coordination for loading zones, elevators, stairs, and access</li><li>Temporary storage for contents between locations</li></ul></div></div></section>
  <section class="pcm-office-section pcm-office-section--tint"><div class="pcm-office-grid"><div><h2>Commercial &amp; Business Relocations</h2><p>Our commercial moving work is suited to businesses changing offices, expanding into a new commercial space, consolidating locations, or relocating valuable contents within the Lower Mainland. We can discuss your schedule, building requirements, inventory, and the people responsible for coordinating the move.</p><h2>How We Help Minimize Business Downtime</h2><p>Good coordination starts before moving day. We review what is moving, where it is going, how crews will access each location, and which items need extra handling. That gives your business a clearer sequence for packing, loading, delivery, and getting the new space ready.</p></div><div><h2>Office Furniture &amp; Equipment Moving</h2><p>Desks, chairs, filing cabinets, shelving, boardroom furniture, boxed files, and general office equipment all require a practical handling plan. Share details about sensitive, oversized, or difficult-to-access items when you request your estimate.</p><h2>Packing, Labelling &amp; Move Coordination</h2><p>We can pack the whole office or focus on selected rooms and departments. Labels and an agreed destination plan help your team identify contents as they arrive, while your move coordinator has a clear point of reference.</p></div></div></section>
  <section class="pcm-office-section"><div class="pcm-office-grid"><div><h2>Temporary Storage During an Office Relocation</h2><p>Some businesses need a short gap between leaving one office and occupying the next. Coquitlam storage can be part of the plan for furniture, equipment, or packed contents while you prepare the new space. Tell us the expected timing and access needs so we can discuss the appropriate arrangement.</p><h2>Employee &amp; Corporate Relocations</h2><p>Corporate moves can involve more than one household or location. Purely Canadian Movers can discuss employee relocation requirements alongside an office move, including local moves and larger corporate relocations elsewhere in BC or Canada.</p></div><div><h2>Office Moves Within Coquitlam and the Tri-Cities</h2><p>As a Coquitlam-based mover, we regularly plan local work around the realities of the Tri-Cities and Metro Vancouver: commercial building access, elevator bookings, parking and loading, traffic between locations, and the need to keep people informed.</p><h2>Why Coquitlam Businesses Choose Purely Canadian Movers</h2><p><strong>Based in Coquitlam since 1991</strong>, Purely Canadian Movers is a family-owned company with its own trained moving crews and no subcontractors. We offer local and long-distance moving, Coquitlam storage capability, and an established Great Canadian Van Lines network relationship for larger or long-distance corporate relocations.</p><p>We provide written estimates and explain Declared Value Protection options where they apply to your move.</p></div></div></section>
  <section class="pcm-office-section pcm-office-section--dark"><div class="pcm-office-grid"><div><div class="pcm-kicker">A clear moving plan</div><h2>Our Office Moving Process</h2><ol class="pcm-office-steps"><li><strong>Discuss the move.</strong> Tell us about your locations, inventory, timing, access, packing, and storage needs.</li><li><strong>Build the estimate.</strong> We use the details you provide to prepare a written estimate for the proposed work.</li><li><strong>Coordinate the sequence.</strong> Confirm building requirements, crew needs, packing responsibilities, and delivery details.</li><li><strong>Move and settle in.</strong> Our team handles the agreed work and keeps the move organized from loading through delivery.</li></ol></div><div class="pcm-office-quote" id="office-quote"><div class="pcm-kicker">Free written estimate</div><h2>Get a Coquitlam office moving quote.</h2><p>Start with your Coquitlam origin and add the destination, date, inventory, and access details that will help us understand your relocation.</p><form class="pcm-estimate pcm-lead-panel" action="/contact/" method="get"><div class="pcm-form-grid"><label>Moving from<input name="from" value="Coquitlam, BC" /></label><label>Moving to<input name="to" placeholder="City or address" /></label><label>Move date<input name="moveDate" type="date" /></label><label>Move details<input name="details" placeholder="Office size, packing, storage" /></label></div><div class="pcm-buttons"><button class="pcm-button primary" type="submit">Request Written Estimate</button><a class="pcm-button secondary" href="tel:18774856683">Call 1-877-485-6683</a></div><p class="pcm-form-note"><strong>No pressure. Just a clear starting point for your business relocation.</strong></p></form></div></div></section>
  <section class="pcm-office-section"><div class="pcm-office-faq"><div class="pcm-kicker">Questions from Coquitlam businesses</div><h2>Office Moving FAQs</h2>${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></section>
</main>`;

let html = template
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
  .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`)
  .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}">`)
  .replace(/<meta name="twitter:description" content="[^"]*"[^>]*>/, `<meta name="twitter:description" content="${esc(description)}">`)
  .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" id="canonical-tag" href="${canonical}">`)
  .replace(/<script[^>]+type="module"[^>]*><\/script>/, "")
  .replace(/<script type="module"[^>]*><\/script>/, "")
  .replace(/<script type="application\/ld\+json" id="(?:pcm-faq-schema|faq-schema|pcm-service-schema|service-schema[^\"]*|pcm-breadcrumb-schema|breadcrumb-schema)"[^>]*>[\s\S]*?<\/script>/g, "")
  .replace(/<main[\s\S]*?<\/main>/, main);

const extraHead = `<script type="application/ld+json" id="pcm-service-schema">${JSON.stringify(serviceSchema)}</script><script type="application/ld+json" id="pcm-breadcrumb-schema">${JSON.stringify(breadcrumbSchema)}</script><script type="application/ld+json" id="pcm-faq-schema">${JSON.stringify(faqSchema)}</script><style>
.pcm-office-hero{background:linear-gradient(115deg,#171717 0%,#292929 64%,#8d1212 100%);color:#fff;padding:72px 24px 64px}.pcm-office-hero__inner,.pcm-office-grid{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:48px;align-items:center}.pcm-office-hero h1{font:700 clamp(2.4rem,5vw,4.4rem)/1.08 'Playfair Display',serif;margin:10px 0 20px}.pcm-office-hero p,.pcm-office-section p{font:400 1.08rem/1.7 'Source Sans 3',sans-serif}.pcm-office-proof{border-left:4px solid #e33b3b;padding-left:18px}.pcm-office-hero__card{background:#fff;color:#222;border-radius:14px;padding:24px;display:grid;gap:14px;box-shadow:0 18px 50px #0005}.pcm-office-hero__card span{border-top:1px solid #ddd;padding-top:12px}.pcm-office-section{padding:68px 24px}.pcm-office-section--tint{background:#f6f6f4}.pcm-office-section--dark{background:#202020;color:#fff}.pcm-office-section h2{font:700 clamp(1.7rem,3vw,2.5rem)/1.15 'Playfair Display',serif;margin:0 0 14px}.pcm-office-section h3{font:700 1.25rem/1.2 'Playfair Display',serif}.pcm-office-list,.pcm-office-quote{background:#fff;color:#222;border-radius:14px;padding:26px;box-shadow:0 10px 30px #0001}.pcm-office-list ul{padding-left:20px;line-height:1.8}.pcm-office-steps{padding-left:22px;line-height:1.7}.pcm-office-steps li{margin:0 0 14px}.pcm-office-faq{max-width:900px;margin:0 auto}.pcm-office-faq details{border-bottom:1px solid #d7d7d7;padding:18px 0}.pcm-office-faq summary{cursor:pointer;font:600 1.12rem 'Source Sans 3',sans-serif}.pcm-office-faq p{margin:12px 0 0}.pcm-kicker{font:700 .8rem/1 'Source Sans 3',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#d33}.pcm-office-hero .pcm-kicker,.pcm-office-section--dark .pcm-kicker{color:#ff9a9a}.pcm-office-quote .pcm-kicker{color:#b01515}.pcm-office-quote h2{color:#222}.pcm-office-quote p{color:#555;font-size:1rem}.pcm-office-quote .pcm-estimate{box-shadow:none;padding:0}.pcm-office-quote .pcm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pcm-office-quote label{display:grid;gap:6px;color:#333;font-weight:600}.pcm-office-quote input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ccc;border-radius:6px}.pcm-office-quote .pcm-buttons{margin-top:18px;display:flex;flex-wrap:wrap;gap:10px}.pcm-button{display:inline-flex;align-items:center;justify-content:center;border-radius:6px;padding:12px 18px;text-decoration:none;font-weight:700;border:1px solid #b01515}.pcm-button.primary{background:#cc1a1a;color:#fff}.pcm-button.secondary{background:#fff;color:#a31515}.pcm-office-hero .pcm-button.secondary{background:transparent;color:#fff;border-color:#fff}.pcm-form-note{font-size:.9rem!important}.pcm-office-page{font-family:'Source Sans 3',sans-serif}@media(max-width:700px){.pcm-office-hero{padding:48px 18px}.pcm-office-hero__inner,.pcm-office-grid{grid-template-columns:1fr;gap:28px}.pcm-office-section{padding:48px 18px}.pcm-office-quote .pcm-form-grid{grid-template-columns:1fr}.pcm-button{width:100%}.pcm-office-hero h1{font-size:2.7rem}}
</style>`;
html = html.replace("</head>", `${extraHead}</head>`);
html = html.replace(/<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?<\/section>\s*<script defer="" src="https:\/\/manus-analytics\.com\/umami"[\s\S]*?<\/script>/, "");
html = html.replace(/<script defer="" src="\.\.\/assets\/index-[^"]+\.js"><\/script>/, "");
html = html.replace(/<script type="module"[^>]+src="\.\.\/assets\/index-[^"]+\.js"><\/script>/, "");
html = html.replace(/<section class="pcm-lead-boost pcm-lead-panel"[\s\S]*?<\/section>/g, "");
html = html.replace(/<input name="from"[^>]*>/g, '<input name="from" value="Coquitlam, BC" />');
html = html.replace(/<input name="to"[^>]*>/g, '<input name="to" placeholder="City or address" />');
html = html.replace("</body>", `<script>(function(){var b=document.querySelector('[aria-label="Open menu"]');if(!b)return;b.addEventListener('click',function(){var m=document.getElementById('pcm-mobile-menu');if(!m){m=document.createElement('div');m.id='pcm-mobile-menu';m.hidden=true;m.style.cssText='position:absolute;right:16px;top:112px;background:#fff;padding:18px;box-shadow:0 8px 24px #0003;display:grid;gap:12px;z-index:60';m.innerHTML='<a href="/services/">Services</a><a href="/local/">Local Moves</a><a href="/office-movers-coquitlam/">Coquitlam Office Moves</a><a href="/storage/">Storage</a><a href="/contact/">Contact</a>';document.querySelector('header').appendChild(m)}m.hidden=!m.hidden;b.setAttribute('aria-expanded',String(!m.hidden))})})();</script></body>`);

await mkdir(join(outDir, "office-movers-coquitlam"), { recursive: true });
await writeFile(join(outDir, "office-movers-coquitlam", "index.html"), html);

for (const [file, anchor] of [
  ["index.html", "Office and corporate moves in Coquitlam"],
  ["coquitlam/index.html", "Office movers in Coquitlam"],
  ["services/index.html", "Commercial movers in Coquitlam"],
  ["local-movers-in-coquitlam-bc/index.html", "Coquitlam office and corporate moving"],
]) {
  const path = join(outDir, file);
  let page = await readFile(path, "utf8");
  if (!page.includes('href="/office-movers-coquitlam/"')) {
    page = page.replace('href="/office/"', `href="/office-movers-coquitlam/" class="pcm-office-context-link">${anchor}</a><a href="/office/"`);
    await writeFile(path, page);
  }
}

console.log(`generated ${route} with ${faqs.length} visible FAQs and one FAQPage schema`);
