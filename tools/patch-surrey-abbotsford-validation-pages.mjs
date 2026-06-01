import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const bundlePath = join("site-copy", "assets", "index-CNBNs70h.js");
let bundle = await readFile(bundlePath, "utf8");

function replaceOnce(source, search, replacement, label) {
  if (!source.includes(search)) {
    console.log(`${label}: already patched or not found.`);
    return source;
  }
  console.log(`${label}: patched.`);
  return source.replace(search, replacement);
}

bundle = replaceOnce(
  bundle,
  "title:`Movers in ${e}, ${t} | Purely Canadian Movers`",
  "title:`Movers in ${e}, ${t}`",
  "City page title duplicate brand",
);

bundle = replaceOnce(
  bundle,
  '{label:"Abbotsford",href:"/abbotsford/"}',
  '{label:"Abbotsford",href:"/moving-in-abbotsford-bc/"}',
  "Header Abbotsford internal link",
);

bundle = replaceOnce(
  bundle,
  'path:"/abbotsford/",component:Rge}),a.jsx(ze,{"data-loc":"client/src/App.tsx:178",path:"/maple-ridge/",component:Pge})',
  'path:"/abbotsford/",component:Rge}),a.jsx(ze,{"data-loc":"client/src/App.tsx:177a",path:"/moving-in-abbotsford-bc/",component:Rge}),a.jsx(ze,{"data-loc":"client/src/App.tsx:178",path:"/maple-ridge/",component:Pge})',
  "Abbotsford legacy route",
);

bundle = replaceOnce(
  bundle,
  'function Ege(){return a.jsx(sn,{"data-loc":"client/src/pages/cities/Surrey.tsx:5",city:"Surrey",slug:"surrey",canonicalOverride:"/surrey/",description:"Professional movers in Surrey, BC. Local & long-distance moves. BBB Accredited, family-owned since 1991. No subcontractors. Serving all of Metro Vancouver.",heroSubtitle:"Reliable moving services across Surrey — from Cloverdale to Whalley, Newton to South Surrey. Dispatched from our Coquitlam headquarters, serving Surrey since 1991.",areaDescription:"Surrey is BC\'s second-largest city and one of the fastest-growing communities in Canada. Our team is well-versed in Surrey\'s diverse neighbourhoods — from the established communities of Cloverdale to the new developments in South Surrey and the urban core of Whalley. We handle everything from single-family home moves to large commercial relocations.",whyUs:["Experienced with Surrey\'s rapidly growing neighbourhoods","Knowledgeable about new construction communities in South Surrey","No subcontractors — your crew is our own trained employees","Family-owned since 1991 — based in Coquitlam, serving all of the Lower Mainland","BBB Accredited with 5-star customer reviews","Competitive hourly rates with no hidden fees"],services:["Local Moving within Surrey","Long-Distance Moving from Surrey","New Construction Moves","Office & Commercial Moves","Packing & Unpacking Services","Storage Solutions"],localPricing:Tt.surrey.localPricing,neighborhoods:Tt.surrey.neighborhoods,localTips:Tt.surrey.localTips,faqs:Tt.surrey.faqs})}',
  'function Ege(){return a.jsx(sn,{"data-loc":"client/src/pages/cities/Surrey.tsx:5",city:"Surrey",slug:"surrey",canonicalOverride:"/surrey/",description:"Surrey movers for local, long-distance, packing, office, and storage moves. Family-owned since 1991, BBB Accredited, no subcontractors, serving Cloverdale, Newton, Fleetwood, Guildford, Whalley, and South Surrey.",heroSubtitle:"Surrey moving services for houses, condos, townhomes, apartments, and offices — from Cloverdale to Whalley, Newton to South Surrey. Dispatched from our Coquitlam headquarters, serving Surrey since 1991.",areaDescription:"Surrey is BC\'s second-largest city and one of the fastest-growing communities in Canada. Our crew plans around Surrey\'s real moving conditions: high-rise elevator bookings near Whalley and City Centre, townhouse complexes in Fleetwood, family homes in Newton, rural access around Cloverdale, and new construction in South Surrey. We handle local Surrey moves, long-distance relocations from Surrey, office moves, packing, storage, and specialty item handling with trained employees instead of subcontractors.",whyUs:["Experienced with Surrey condos, townhomes, single-family homes, offices, and rural properties","Knowledgeable about elevator bookings, loading zones, strata move rules, and new construction access","No subcontractors — your crew is our own trained employees","Family-owned since 1991 — based in Coquitlam, serving Surrey and the Lower Mainland","BBB Accredited with 5-star customer reviews","Clear local moving estimates with crew size, access, packing, and storage needs reviewed before booking"],services:["Local Moving within Surrey","Long-Distance Moving from Surrey","Surrey Condo and Apartment Moves","Office & Commercial Moves in Surrey","Packing & Unpacking Services","Short-Term and Long-Term Storage Solutions"],localPricing:Tt.surrey.localPricing,neighborhoods:Tt.surrey.neighborhoods,localTips:Tt.surrey.localTips,faqs:Tt.surrey.faqs})}',
  "Surrey page content",
);

bundle = replaceOnce(
  bundle,
  'function Rge(){return a.jsx(sn,{"data-loc":"client/src/pages/cities/Abbotsford.tsx:6",city:"Abbotsford",slug:"abbotsford",canonicalOverride:"/abbotsford/",description:"Professional movers in Abbotsford, BC. Local & long-distance moves. BBB Accredited, family-owned since 1991. No subcontractors. Serving Abbotsford and the Fraser Valley.",heroSubtitle:"Reliable moving services across Abbotsford — from Clearbrook to East Abbotsford, Matsqui to Auguston. Dispatched from our Coquitlam headquarters, serving the Fraser Valley since 1991.",areaDescription:"Abbotsford is one of British Columbia\'s fastest-growing cities, known for its family-friendly neighbourhoods, agricultural heritage, and convenient location between Vancouver and the U.S. border. Our team is experienced with everything from urban condos in the City Centre to rural acreage properties in Matsqui and Bradner. We handle every type of move with professionalism and care.",whyUs:["Experienced with Abbotsford\'s diverse neighbourhoods and rural properties","Knowledgeable about acreage and farm access moves","No subcontractors — your crew is our own trained employees","Family-owned since 1991 — based in Coquitlam, serving the Fraser Valley","BBB Accredited with 5-star customer reviews","Competitive hourly rates with no hidden fees"],services:["Local Moving within Abbotsford","Long-Distance Moving from Abbotsford","Fraser Valley Regional Moves","Acreage & Rural Property Moves","Packing & Unpacking Services","Storage Solutions"],localPricing:Tt.abbotsford.localPricing,neighborhoods:Tt.abbotsford.neighborhoods,localTips:Tt.abbotsford.localTips,faqs:Tt.abbotsford.faqs})}',
  'function Rge(){return a.jsx(sn,{"data-loc":"client/src/pages/cities/Abbotsford.tsx:6",city:"Abbotsford",slug:"moving-in-abbotsford-bc",canonicalOverride:"/moving-in-abbotsford-bc/",description:"Abbotsford movers for local, long-distance, packing, storage, acreage, condo, and Fraser Valley moves. Family-owned since 1991, BBB Accredited, no subcontractors, serving Clearbrook, East Abbotsford, Matsqui, Auguston, Bradner, and Sumas Prairie.",heroSubtitle:"Reliable moving services across Abbotsford — from Clearbrook to East Abbotsford, Matsqui to Auguston, Bradner, and Sumas Prairie. Dispatched from our Coquitlam headquarters, serving the Fraser Valley since 1991.",areaDescription:"Abbotsford is one of British Columbia\'s fastest-growing cities, with a mix of condos, family homes, townhomes, farms, acreages, and rural properties. Our team plans Abbotsford moves around Highway 1 access, strata elevator rules, long driveways, farm access, storage timing, and long-distance routes from the Fraser Valley to the rest of Canada. We handle local Abbotsford moves, long-distance relocations, packing, storage, office moves, and specialty item handling with trained employees instead of subcontractors.",whyUs:["Experienced with Abbotsford condos, townhomes, family homes, farms, and acreage properties","Knowledgeable about Fraser Valley access, rural driveways, storage timing, and Highway 1 move planning","No subcontractors — your crew is our own trained employees","Family-owned since 1991 — based in Coquitlam, serving Abbotsford and the Fraser Valley","BBB Accredited with 5-star customer reviews","Clear estimates that review crew size, access, packing, valuation coverage, and storage before booking"],services:["Local Moving within Abbotsford","Long-Distance Moving from Abbotsford","Fraser Valley Regional Moves","Acreage, Farm, and Rural Property Moves","Packing & Unpacking Services","Storage Solutions for Abbotsford Moves"],localPricing:Tt.abbotsford.localPricing,neighborhoods:Tt.abbotsford.neighborhoods,localTips:Tt.abbotsford.localTips,faqs:Tt.abbotsford.faqs})}',
  "Abbotsford page content and canonical",
);

await writeFile(bundlePath, bundle);

const pageData = {
  "surrey": {
    title: "Movers in Surrey, BC | Purely Canadian Movers",
    description:
      "Surrey movers for local, long-distance, packing, office, and storage moves. Family-owned since 1991, BBB Accredited, no subcontractors. Free estimates.",
    canonical: "https://purelycanadianmovers.com/surrey/",
    placename: "Surrey, British Columbia, Canada",
    schemaName: "Moving Services in Surrey, BC",
  },
  "abbotsford": {
    title: "Movers in Abbotsford, BC | Purely Canadian Movers",
    description:
      "Abbotsford movers for local, long-distance, packing, storage, acreage, condo, and Fraser Valley moves. Family-owned since 1991. Free estimates.",
    canonical: "https://purelycanadianmovers.com/moving-in-abbotsford-bc/",
    placename: "Abbotsford, British Columbia, Canada",
    schemaName: "Moving Services in Abbotsford, BC",
  },
  "moving-in-abbotsford-bc": {
    title: "Movers in Abbotsford, BC | Purely Canadian Movers",
    description:
      "Abbotsford movers for local, long-distance, packing, storage, acreage, condo, and Fraser Valley moves. Family-owned since 1991. Free estimates.",
    canonical: "https://purelycanadianmovers.com/moving-in-abbotsford-bc/",
    placename: "Abbotsford, British Columbia, Canada",
    schemaName: "Moving Services in Abbotsford, BC",
  },
};

function patchHead(html, data, assetPrefix = "../") {
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${data.title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/i,
    `<meta name="description" content="${data.description}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/i,
    `<meta property="og:title" content="${data.title}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/i,
    `<meta property="og:description" content="${data.description}" />`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/i,
    `<meta property="og:url" content="${data.canonical}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/i,
    `<meta name="twitter:title" content="${data.title}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/i,
    `<meta name="twitter:description" content="${data.description}" />`,
  );
  html = html.replace(
    /<meta name="geo\.placename" content="[^"]*" \/>/i,
    `<meta name="geo.placename" content="${data.placename}" />`,
  );
  html = html.replace(
    /<link rel="canonical" id="canonical-tag" href="[^"]*" \/>/i,
    `<link rel="canonical" id="canonical-tag" href="${data.canonical}" />`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/i,
    `<link rel="canonical" href="${data.canonical}" />`,
  );
  html = html.replaceAll('src="../assets/', `src="${assetPrefix}assets/`);
  html = html.replaceAll('href="../assets/', `href="${assetPrefix}assets/`);
  html = html.replaceAll('href="../external/', `href="${assetPrefix}external/`);
  html = html.replaceAll('href="https://purelycanadianmovers.com/abbotsford/"', `href="${data.canonical}"`);

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.schemaName,
    serviceType: "Moving Service",
    url: data.canonical,
    description: data.description,
    provider: { "@id": "https://purelycanadianmovers.com/#organization" },
    areaServed: [
      { "@type": "City", name: data.placename.replace(", British Columbia, Canada", "") },
      { "@type": "AdministrativeArea", name: "British Columbia" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://purelycanadianmovers.com/contact/",
      servicePhone: "+1-877-485-6683",
    },
  });

  if (!html.includes(`id="static-service-schema"`)) {
    html = html.replace(
      "</head>",
      `  <script type="application/ld+json" id="static-service-schema">${structuredData}</script>\n</head>`,
    );
  }
  return html;
}

for (const [route, data] of Object.entries(pageData)) {
  const sourceRoute = route === "moving-in-abbotsford-bc" ? "abbotsford" : route;
  const sourcePath = join("site-copy", sourceRoute, "index.html");
  const outPath = join("site-copy", route, "index.html");
  let html = await readFile(sourcePath, "utf8");
  html = patchHead(html, data);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  console.log(`Patched ${outPath}`);
}

let sitemap = await readFile(join("site-copy", "sitemap.xml"), "utf8");
sitemap = sitemap.replace(
  "https://purelycanadianmovers.com/abbotsford/",
  "https://purelycanadianmovers.com/moving-in-abbotsford-bc/",
);
if (!sitemap.includes("https://purelycanadianmovers.com/surrey/")) {
  sitemap = sitemap.replace(
    "</urlset>",
    "  <url><loc>https://purelycanadianmovers.com/surrey/</loc></url>\n</urlset>",
  );
}
await writeFile(join("site-copy", "sitemap.xml"), sitemap);
console.log("Patched sitemap.");
