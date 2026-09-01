import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const pagePath = "site-copy/port-moody/index.html";
const bundlePath = "site-copy/assets/index-CNBNs70h.js";

const title = "Movers in Port Moody, BC | Local & Long-Distance Moving";
const description =
  "Movers in Port Moody, BC for local and long-distance moves from our nearby Coquitlam base. Family-owned since 1991, with packing, storage, and trained crews.";
const quickAnswer =
  "Purely Canadian Movers provides local and long-distance moving services in Port Moody, BC from our nearby Coquitlam home base. Family-owned since 1991, we move apartments, condos, townhouses, and houses throughout Port Moody and the Tri-Cities, with packing and storage available.";

const faqs = [
  ["How much do movers cost in Port Moody?", "Port Moody local moving prices are quoted based on crew size, time, home size, access, stairs or elevators, packing, storage, and the amount being moved. A written estimate is the best way to price your move accurately."],
  ["Is Purely Canadian Movers located in Port Moody?", "Purely Canadian Movers is based nearby in Coquitlam, BC. Port Moody is part of our core Tri-Cities local moving service area."],
  ["Do you provide local moving within Port Moody?", "Yes. We provide local moving within Port Moody and between Port Moody, Coquitlam, Port Coquitlam, and nearby Lower Mainland communities."],
  ["Do you move condos and apartments in Port Moody?", "Yes. We move condos and apartments in Port Moody, including planning for elevator bookings, underground parking, loading access, and building move windows where applicable."],
  ["Do you handle townhouses and houses in Heritage Woods and Heritage Mountain?", "Yes. We handle townhouse and house moves in Heritage Woods and Heritage Mountain, with access planning for hills, driveways, and larger household moves."],
  ["Do you move between Port Moody and Coquitlam or Port Coquitlam?", "Yes. Port Moody to Coquitlam and Port Coquitlam moves are common local Tri-Cities moves, and we can plan the crew, timing, access, and household size for the route."],
  ["Do you provide packing and storage?", "Yes. Packing, unpacking, and short- or long-term storage can be included in a Port Moody moving plan when needed."],
  ["Do you provide long-distance moving from Port Moody?", "Yes. We coordinate long-distance and cross-Canada moves from Port Moody with route planning, written estimates, packing, storage, and Great Canadian Van Lines agent-network support."],
  ["Do you use subcontractors?", "No. Local Port Moody moves are handled by Purely Canadian Movers’ own trained crews. Long-distance moves are coordinated through our Great Canadian Van Lines agent network, with direct accountability and no broker-style handoff to unknown movers."],
];

function replaceIfPresent(source, pattern, replacement, label) {
  const matches = source.match(pattern);
  if (!matches) return source;
  if (matches.length !== 1) throw new Error(label + ": expected one match, found " + matches.length);
  return source.replace(pattern, replacement);
}

function faqHtml() {
  return faqs.map(function (item) {
    return "<details><summary>" + item[0] + "</summary><p>" + item[1] + "</p></details>";
  }).join("");
}

function updateBundle() {
  let bundle = readFileSync(bundlePath, "utf8");
  const replacements = [
    [
      'title:"Local Movers in Port Moody, BC | Purely Canadian Movers",description:"Professional movers in Port Moody, BC. Tri-Cities specialists. Local & long-distance moves. BBB Accredited, family-owned since 1991. No subcontractors."',
      "title:" + JSON.stringify(title) + ",description:" + JSON.stringify(description),
    ],
    ['children:"Local Movers in Port Moody, BC"', 'children:"Movers in Port Moody, BC"'],
    [
      'children:"Professional moving services for Port Moody residents. Whether you\'re relocating within the community or moving to Port Moody, Purely Canadian Movers delivers reliable, affordable service."',
      "children:" + JSON.stringify(quickAnswer),
    ],
    ['children:"Moving in Port Moody"', 'children:"Moving services for Port Moody homes and buildings"'],
    [
      'children:"Port Moody is a vibrant waterfront community known for its natural beauty, outdoor recreation, and family-friendly neighborhoods. Whether you\'re moving to enjoy the Burrard Inlet lifestyle or relocating within this desirable community, Purely Canadian Movers understands the unique needs of Port Moody residents."',
      'children:"Port Moody is part of Purely Canadian Movers’ core Tri-Cities service area. From our Coquitlam base, our own trained crews plan condo and apartment moves in Port Moody Centre, Suter Brook Village, and Newport Village, including elevator bookings, underground parking, loading access, and reserved move-in or move-out windows where applicable."',
    ],
    [
      'children:"From townhomes in the downtown core to family homes in the hillside neighborhoods, we handle every type of move with professionalism and care. Our team is familiar with Port Moody\'s streets, parking restrictions, and building requirements."',
      'children:"For houses and townhomes in Heritage Mountain and Heritage Woods, we plan around hills, driveways, and larger household access. We also handle established residential homes and townhouse moves in College Park and Glenayre, plus residential moves in Pleasantside and the Ioco/north-shore Port Moody area. Our team is familiar with Port Moody’s parking restrictions and building requirements."',
    ],
    ['children:"Why Choose Purely Canadian Movers?"', 'children:"Why choose Purely Canadian Movers for Port Moody?"'],
    [
      'children:"Serving Port Moody and Tri-Cities area for over 30 years with deep knowledge of the community."',
      'children:"Port Moody is part of our core Tri-Cities service area. PCM has operated since 1991 from nearby Coquitlam, with practical local access planning for homes and buildings."',
    ],
    [
      'children:"Our own trained crew handles every move — no outsourcing, no surprises."',
      'children:"Our own trained crew handles every local move — no outsourcing, no surprises."',
    ],
    [
      'children:"Transparent pricing with no hidden fees. Get an accurate quote before you commit."',
      'children:"Local moving quotes account for crew size, time, home size, access, packing, and storage. We explain the estimate before you book."',
    ],
    ['children:"Services We Offer"', 'children:"Port Moody moving services"'],
  ];
  for (const [oldText, newText] of replacements) {
    bundle = replaceIfPresent(bundle, oldText, newText, oldText.slice(0, 60));
  }
  writeFileSync(bundlePath, bundle);
}

function updatePage() {
  let html = process.argv.includes("--restore-head-route")
    ? execFileSync("git", ["show", "HEAD:" + pagePath], { encoding: "utf8" })
    : readFileSync(pagePath, "utf8");
  html = html.replace(/<title>.*?<\/title>/, "<title>" + title + " | Purely Canadian Movers</title>");
  html = html.replace(/<meta name="description" content=".*?">/, '<meta name="description" content="' + description + '">');
  html = html.replace(/<meta property="og:title" content=".*?">/, '<meta property="og:title" content="' + title + ' | Purely Canadian Movers">');
  html = html.replace(/<meta property="og:description" content=".*?">/, '<meta property="og:description" content="' + description + '">');
  html = html.replace(/<meta property="og:url" content=".*?">/, '<meta property="og:url" content="https://purelycanadianmovers.com/port-moody/">');
  html = html.replace(/<meta name="twitter:title" content=".*?">/, '<meta name="twitter:title" content="' + title + ' | Purely Canadian Movers">');
  html = html.replace(/<meta name="twitter:description" content=".*?">/, '<meta name="twitter:description" content="' + description + '">');
  html = html.replace(/<link rel="canonical" id="canonical-tag" href=".*?">/, '<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com/port-moody/">');
  html = html.replace(
    '<input name="from" placeholder="Toronto, ON" type="text">',
    '<input name="from" value="Port Moody, BC" type="text">',
  );
  html = html.replace(
    '<input name="to" placeholder="Calgary, AB" type="text">',
    '<input name="to" placeholder="City or province" type="text">',
  );

  html = replaceIfPresent(
    html,
    /<section data-loc="client\/src\/pages\/cities\/PortMoody\.tsx:14"[\s\S]*?<\/section>/,
    '<section data-loc="client/src/pages/cities/PortMoody.tsx:14" class="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 pt-32 pb-20 px-4"><div data-loc="client/src/pages/cities/PortMoody.tsx:15" class="max-w-5xl mx-auto"><h1 data-loc="client/src/pages/cities/PortMoody.tsx:16" class="text-5xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in">Movers in Port Moody, BC</h1><p data-loc="client/src/pages/cities/PortMoody.tsx:19" class="text-xl text-gray-200 mb-8 max-w-2xl animate-fade-in-delay-1">' + quickAnswer + '</p><div data-loc="client/src/pages/cities/PortMoody.tsx:22" class="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2"><a data-loc="client/src/pages/cities/PortMoody.tsx:23" href="/contact/" class="inline-block bg-[#CC1A1A] hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-colors">Get Free Estimate</a><a data-loc="client/src/pages/cities/PortMoody.tsx:26" href="/services/" class="inline-block border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold py-3 px-8 rounded transition-colors">Explore Services</a></div></div></section>',
    "static Port Moody hero",
  );
  html = replaceIfPresent(
    html,
    /<section data-loc="client\/src\/pages\/cities\/PortMoody\.tsx:34"[\s\S]*?<\/section>/,
    '<section data-loc="client/src/pages/cities/PortMoody.tsx:34" class="py-16 px-4 bg-white"><div data-loc="client/src/pages/cities/PortMoody.tsx:35" class="max-w-3xl mx-auto"><h2 data-loc="client/src/pages/cities/PortMoody.tsx:36" class="text-4xl font-serif font-bold mb-6 text-slate-900">Moving services for Port Moody homes and buildings</h2><p data-loc="client/src/pages/cities/PortMoody.tsx:37" class="text-lg text-gray-700 mb-4">Port Moody is part of Purely Canadian Movers’ core Tri-Cities service area. From our Coquitlam base, our own trained crews plan condo and apartment moves in Port Moody Centre, Suter Brook Village, and Newport Village, including elevator bookings, underground parking, loading access, and reserved move-in or move-out windows where applicable.</p><p data-loc="client/src/pages/cities/PortMoody.tsx:40" class="text-lg text-gray-700 mb-4">For houses and townhomes in Heritage Mountain and Heritage Woods, we plan around hills, driveways, and larger household access. We also handle established residential homes and townhouse moves in College Park and Glenayre, plus residential moves in Pleasantside and the Ioco/north-shore Port Moody area. Our team is familiar with Port Moody’s parking restrictions and building requirements.</p></div></section>',
    "static Port Moody moving section",
  );
  html = replaceIfPresent(
    html,
    /<section data-loc="client\/src\/pages\/cities\/PortMoody\.tsx:47"[\s\S]*?<\/section>/,
    '<section data-loc="client/src/pages/cities/PortMoody.tsx:47" class="py-16 px-4 bg-gray-50"><div data-loc="client/src/pages/cities/PortMoody.tsx:48" class="max-w-3xl mx-auto"><h2 data-loc="client/src/pages/cities/PortMoody.tsx:49" class="text-4xl font-serif font-bold mb-12 text-slate-900">Why choose Purely Canadian Movers for Port Moody?</h2><div data-loc="client/src/pages/cities/PortMoody.tsx:50" class="grid md:grid-cols-2 gap-8"><div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#CC1A1A]"><h3 class="text-xl font-bold text-slate-900 mb-3">Local expertise</h3><p class="text-gray-700">Port Moody is part of our core Tri-Cities service area. PCM has operated since 1991 from nearby Coquitlam, with practical local access planning for homes and buildings.</p></div><div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#CC1A1A]"><h3 class="text-xl font-bold text-slate-900 mb-3">No subcontractors</h3><p class="text-gray-700">Our own trained crew handles every local move — no outsourcing, no surprises.</p></div><div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#CC1A1A]"><h3 class="text-xl font-bold text-slate-900 mb-3">BBB Accredited</h3><p class="text-gray-700">Trusted by thousands of families. BBB Accredited with an excellent track record.</p></div><div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#CC1A1A]"><h3 class="text-xl font-bold text-slate-900 mb-3">Free estimates</h3><p class="text-gray-700">Local moving quotes account for crew size, time, home size, access, packing, and storage. We explain the estimate before you book.</p></div></div></div></section>',
    "static Port Moody proof section",
  );
  html = replaceIfPresent(
    html,
    /<section data-loc="client\/src\/pages\/cities\/PortMoody\.tsx:72"[\s\S]*?<\/section>/,
    '<section data-loc="client/src/pages/cities/PortMoody.tsx:72" class="py-16 px-4 bg-white"><div data-loc="client/src/pages/cities/PortMoody.tsx:73" class="max-w-3xl mx-auto"><h2 data-loc="client/src/pages/cities/PortMoody.tsx:74" class="text-4xl font-serif font-bold mb-12 text-slate-900">Port Moody moving services</h2><ul data-loc="client/src/pages/cities/PortMoody.tsx:75" class="space-y-4 text-lg text-gray-700"><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Local residential moving:</strong> <a href="/local/">Within Port Moody</a> and surrounding Tri-Cities areas.</span></li><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Condo and apartment moving:</strong> Elevator bookings, underground parking, loading access, and building move windows where applicable.</span></li><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Townhouse and house moving:</strong> Hillside, driveway, and larger household access planning.</span></li><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Office and commercial moving:</strong> Move planning for offices, equipment, and building access with <a href="/office/">commercial moving support</a>.</span></li><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Packing and unpacking:</strong> Full or partial packing support through our <a href="/packing/">packing service</a>.</span></li><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Storage:</strong> Short- and long-term storage options; see our <a href="/storage/">storage solutions</a>.</span></li><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Long-distance moving:</strong> Route planning and written estimates for moves from Port Moody across Canada through <a href="/long-distance/">long-distance moving</a> support.</span></li><li class="flex items-start gap-3"><span class="text-[#CC1A1A] font-bold">✓</span><span><strong>Senior moves:</strong> Careful planning for seniors and their families.</span></li></ul></div></section>',
    "static Port Moody services section",
  );

  const extraSections = '<section data-pcm-port-moody-supporting="1" class="py-16 px-4 bg-gray-50"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-6 text-slate-900">Common Port Moody moves</h2><p class="text-lg text-gray-700 mb-5">We help Port Moody customers move locally across the Tri-Cities and Lower Mainland, or plan a long-distance move across Canada.</p><ul class="space-y-3 text-lg text-gray-700"><li><a href="/coquitlam/" class="font-semibold text-[#CC1A1A]">Port Moody → Coquitlam</a> — a common Tri-Cities move from one nearby community to another.</li><li><a href="/port-coquitlam/" class="font-semibold text-[#CC1A1A]">Port Moody → Port Coquitlam</a> — local household moves with crew and access planning.</li><li><a href="/burnaby/" class="font-semibold text-[#CC1A1A]">Port Moody → Burnaby</a> — apartments, condos, townhouses, and houses across the Lower Mainland.</li><li><a href="/vancouver/" class="font-semibold text-[#CC1A1A]">Port Moody → Vancouver</a> — local residential moves with building or street access reviewed in advance.</li><li><a href="/maple-ridge/" class="font-semibold text-[#CC1A1A]">Port Moody → Maple Ridge</a> or <a href="/pitt-meadows/" class="font-semibold text-[#CC1A1A]">Pitt Meadows</a> — household moves between Tri-Cities and nearby eastern communities.</li><li><a href="/long-distance/" class="font-semibold text-[#CC1A1A]">Port Moody → destinations across Canada</a> — long-distance planning, packing, storage, and written estimates.</li></ul></div></section><section class="py-16 px-4 bg-white"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-6 text-slate-900">How much do movers cost in Port Moody?</h2><p class="text-lg text-gray-700">Port Moody local moving prices are quoted based on crew size, time, home size, access, stairs or elevators, packing, storage, and the amount being moved. We do not use long-distance route pricing for local Port Moody work.</p><p class="text-lg text-gray-700 mt-4"><a href="/contact/" class="font-semibold text-[#CC1A1A]">Request a written estimate</a> or read the <a href="/long-distance-moving-cost-canada/" class="font-semibold text-[#CC1A1A]">moving cost guide</a> for general planning and long-distance route ranges.</p></div></section><section data-pcm-port-moody-faq="1" class="py-16 px-4 bg-gray-50"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-6 text-slate-900">Port Moody moving FAQ</h2><div class="space-y-4">' + faqHtml() + '</div></div></section>';
  html = replaceIfPresent(
    html,
    /<section data-loc="client\/src\/pages\/cities\/PortMoody\.tsx:97"[\s\S]*?<\/section>/,
    extraSections + '<section data-loc="client/src/pages/cities/PortMoody.tsx:97" class="py-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800"><div data-loc="client/src/pages/cities/PortMoody.tsx:98" class="max-w-3xl mx-auto text-center"><h2 data-loc="client/src/pages/cities/PortMoody.tsx:99" class="text-4xl font-serif font-bold text-white mb-6">Ready to move?</h2><p data-loc="client/src/pages/cities/PortMoody.tsx:100" class="text-xl text-gray-200 mb-8">Get your free moving estimate today. Call us or fill out our online form.</p><div data-loc="client/src/pages/cities/PortMoody.tsx:101" class="flex flex-col sm:flex-row gap-4 justify-center"><a data-loc="client/src/pages/cities/PortMoody.tsx:102" href="tel:18774856683" class="inline-block bg-[#CC1A1A] hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-colors">Call 1-877-485-6683</a><a data-loc="client/src/pages/cities/PortMoody.tsx:105" href="/contact/" class="inline-block border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold py-3 px-8 rounded transition-colors">Get Free Estimate</a></div></div></section>',
    "static Port Moody supporting sections",
  );

  const seoPattern = /<section class="pcm-lead-boost pcm-local-seo"[\s\S]*?data-pcm-static-local-seo="\/">[\s\S]*?<\/section>/;
  const seo = '<section class="pcm-lead-boost pcm-local-seo" aria-label="Port Moody moving resources" data-pcm-static-local-seo="/port-moody/"><div class="pcm-local-seo__inner"><h2>Port Moody moving resources</h2><p>Purely Canadian Movers serves Port Moody from our nearby Coquitlam home base with local Tri-Cities moving, long-distance planning across Canada, packing, and storage.</p><div class="pcm-local-seo__cards"><article><h3>Building and neighbourhood planning</h3><p>We plan condo, apartment, townhouse, and house moves around building access and the practical details of each Port Moody neighbourhood.</p></article><article><h3>Local and long-distance options</h3><p>Local Port Moody work stays with our own trained crews; long-distance moves can be planned across Canada through our Great Canadian Van Lines agent network.</p></article><article><h3>Customer proof</h3><p>Family-owned since 1991, based in Coquitlam, BBB Accredited, and trusted by thousands of families.</p></article></div><div class="pcm-local-seo__links"><h2>Plan your Port Moody move</h2><div><a href="/coquitlam/">Coquitlam Movers</a><a href="/port-coquitlam/">Port Coquitlam Movers</a><a href="/local/">Local Moving</a><a href="/long-distance/">Long-Distance Moving</a><a href="/testimonials/">Testimonials</a><a href="/company-proof/">Company Proof</a><a href="/contact/">Get a Free Estimate</a></div></div></div></section>';
  html = replaceIfPresent(html, seoPattern, seo, "static Port Moody supplemental section");

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Moving services in Port Moody, BC",
    serviceType: "Local and Long-Distance Moving Service",
    url: "https://purelycanadianmovers.com/port-moody/",
    description: quickAnswer,
    provider: { "@id": "https://purelycanadianmovers.com/#organization" },
    areaServed: [
      { "@type": "City", name: "Port Moody" },
      { "@type": "AdministrativeArea", name: "Tri-Cities" },
      { "@type": "AdministrativeArea", name: "British Columbia" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://purelycanadianmovers.com/contact/",
      servicePhone: "+1-877-485-6683",
    },
  };
  html = replaceIfPresent(html, /<script type="application\/ld\+json" id="pcm-service-schema">[\s\S]*?<\/script>/, '<script type="application/ld+json" id="pcm-service-schema">' + JSON.stringify(service) + "</script>", "static Port Moody service schema");
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://purelycanadianmovers.com/" },
      { "@type": "ListItem", position: 2, name: "Local Moving", item: "https://purelycanadianmovers.com/local/" },
      { "@type": "ListItem", position: 3, name: "Port Moody", item: "https://purelycanadianmovers.com/port-moody/" },
    ],
  };
  html = replaceIfPresent(html, /<script type="application\/ld\+json" id="pcm-breadcrumb-schema">[\s\S]*?<\/script>/, '<script type="application/ld+json" id="pcm-breadcrumb-schema">' + JSON.stringify(breadcrumb) + "</script>", "static Port Moody breadcrumb schema");
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(function (item) {
      return {
        "@type": "Question",
        name: item[0],
        acceptedAnswer: { "@type": "Answer", text: item[1] },
      };
    }),
  };
  html = replaceIfPresent(html, /<script type="application\/ld\+json" id="pcm-faq-schema">[\s\S]*?<\/script>/, '<script type="application/ld+json" id="pcm-faq-schema">' + JSON.stringify(faq) + "</script>", "static Port Moody FAQ schema");
  html = html.replace(/<script type="application\/ld\+json" id="faq-schema">[\s\S]*?<\/script>/, "");
  writeFileSync(pagePath, html);
}

updateBundle();
updatePage();
console.log("Updated the Port Moody hydration bundle and static route source.");
