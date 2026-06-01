import { readFile, writeFile } from "node:fs/promises";

const bundlePath = "site-copy/assets/index-CNBNs70h.js";
let source = await readFile(bundlePath, "utf8");

const citiesOld = 'const Bue=[{name:"Vancouver",href:"/local-movers-in-vancouver-bc/",label:"Local Movers in Vancouver, BC",desc:"High-rise condo specialists. We know every neighbourhood from Kitsilano to East Van."},{name:"Coquitlam",href:"/local-movers-in-coquitlam-bc/",label:"Local Movers in Coquitlam, BC",desc:"Our home base since 1991. Unmatched local knowledge across the Tri-Cities."},{name:"Surrey",href:"/surrey/",label:"Movers in Surrey, BC",desc:"Serving all Surrey neighbourhoods — Cloverdale, Newton, Fleetwood, and more."},{name:"Burnaby",href:"/burnaby/",label:"Movers in Burnaby, BC",desc:"Experienced with Burnaby\'s mix of high-rises, townhomes, and single-family homes."},{name:"North Vancouver",href:"/north-vancouver/",label:"Movers in North Vancouver, BC",desc:"Navigating the North Shore\'s hills and tight streets with care and efficiency."},{name:"Langley",href:"/langley/",label:"Movers in Langley, BC",desc:"Covering Langley City and Township — acreages, townhomes, and everything in between."},{name:"Richmond",href:"/richmond/",label:"Movers in Richmond, BC",desc:"Reliable moves across Richmond\'s diverse residential and commercial areas."},{name:"New Westminster",href:"/new-westminster/",label:"Movers in New Westminster, BC",desc:"Expert moves in BC\'s oldest city — heritage homes, condos, and everything in between."}];';
const citiesNew = 'const Bue=[{name:"Vancouver",href:"/local-movers-in-vancouver-bc/",label:"Local Movers in Vancouver, BC",desc:"High-rise condo, apartment, house, and furniture movers from Kitsilano to East Vancouver."},{name:"Coquitlam",href:"/local-movers-in-coquitlam-bc/",label:"Local Movers in Coquitlam, BC",desc:"Our home base since 1991, with local moving crews serving Coquitlam and nearby Tri-Cities homes."},{name:"Port Coquitlam",href:"/port-coquitlam/",label:"Movers in Port Coquitlam, BC",desc:"Residential, townhouse, apartment, and small-office moves across Port Coquitlam."},{name:"Port Moody",href:"/port-moody/",label:"Movers in Port Moody, BC",desc:"Local moves for condos, townhomes, and family homes near the waterfront and hillside neighbourhoods."},{name:"Burnaby",href:"/burnaby/",label:"Movers in Burnaby, BC",desc:"Experienced with Burnaby high-rises, townhomes, single-family homes, and elevator moves."},{name:"New Westminster",href:"/new-westminster/",label:"Movers in New Westminster, BC",desc:"Apartment, condo, heritage home, and furniture moving in BC\'s oldest city."},{name:"Surrey",href:"/surrey/",label:"Movers in Surrey, BC",desc:"Serving Surrey neighbourhoods including Cloverdale, Newton, Fleetwood, Guildford, and South Surrey."},{name:"Langley",href:"/langley/",label:"Movers in Langley, BC",desc:"Covering Langley City and Township, from acreages to townhomes and offices."},{name:"Maple Ridge",href:"/maple-ridge/",label:"Movers in Maple Ridge, BC",desc:"House, condo, apartment, and local furniture moves across Maple Ridge."},{name:"North Vancouver",href:"/north-vancouver/",label:"Movers in North Vancouver, BC",desc:"Navigating North Shore hills, elevators, parking limits, and tight streets with care."}];';
if (!source.includes(citiesOld)) throw new Error("City list not found");
source = source.replace(citiesOld, citiesNew);

const start = source.indexOf("function k8()");
const end = source.indexOf("function", start + 20);
if (start < 0 || end < 0) throw new Error("Local page component not found");
let local = source.slice(start, end);

local = local.replace(
  "function k8(){return",
  'function k8(){const L=[{question:"How much do local movers cost in Metro Vancouver?",answer:"Local moving cost depends on crew size, number of hours, home size, stairs, elevator bookings, parking or loading access, packing, heavy items, travel time, and storage needs. Request an estimate for pricing specific to your move."},{question:"How many movers do I need for a local move?",answer:"A studio or one-bedroom move may need two movers, while larger homes, heavy furniture, stairs, or tight elevator windows may require three or more movers. We recommend the crew size after reviewing your inventory and access details."},{question:"Do you move condos and apartments?",answer:"Yes. We regularly handle condo and apartment moves across Metro Vancouver, including elevator bookings, loading zones, building rules, hallway protection, and tight access."},{question:"Do you charge travel time for local moves?",answer:"Local moves are typically billed by time, and travel time can affect the final cost. We explain the expected timing before moving day so there are no surprises."},{question:"Are moving blankets, dollies, and basic protection included?",answer:"Yes. Our local moving trucks arrive equipped with moving blankets, straps, dollies, floor protection, and door-frame protection for normal residential and office moves."},{question:"Do you use subcontractors for local moves?",answer:"No. Purely Canadian Movers uses its own trained moving crews. We are a direct mover, not a broker, and we do not hand your move to subcontractors."},{question:"How far in advance should I book local movers?",answer:"For the best availability, book at least two to four weeks ahead, especially near month-end, weekends, and summer. We also try to help with urgent local moves when crews are available."}];return'
);

local = local.replace(
  'title:"Local Moving Services Metro Vancouver | Purely Canadian Movers",description:"Local movers in Metro Vancouver, BC. Hourly rates from $179/hr. No hidden fees, no subcontractors. BBB Accredited, family-owned since 1991. Free estimates.",canonical:"/local/"',
  'title:"Local Movers in Metro Vancouver BC",description:"Local movers in Metro Vancouver for homes, condos, apartments, seniors moves, and offices. Serving Vancouver, Coquitlam, Burnaby, Surrey, Richmond, Langley, and nearby BC communities since 1991.",canonical:"/local/"'
);

local = local.replace(
  'a.jsx("section",{"data-loc":"client/src/pages/services/LocalMoving.tsx:68"',
  'a.jsx(Pt,{faqs:L}),a.jsx("section",{"data-loc":"client/src/pages/services/LocalMoving.tsx:68"'
);

local = local.replace(
  'children:"Local Moving Services in Metro Vancouver"',
  'children:"Local Movers in Metro Vancouver"'
);

local = local.replace(
  'children:"Expert local moves across the Lower Mainland. Hourly rates, professional crew, and the peace of mind that comes from 30+ years of experience."',
  'children:"Local movers for homes, condos, apartments, seniors moves, offices, furniture moves, and small moves across Vancouver, Coquitlam, Burnaby, Surrey, Richmond, Langley, and nearby BC communities."'
);

const costAndTrust = ',a.jsx("h2",{className:"font-heading text-2xl font-bold text-gray-900 mb-4 mt-10",children:"Local Moving Cost in Metro Vancouver"}),a.jsx("p",{className:"font-body text-gray-700 leading-relaxed mb-5",children:"Local moving cost depends on the size of your home or office, crew size, number of hours, stairs, elevator bookings, parking and loading access, packing, heavy items, storage, and travel time. The best estimate comes from a clear inventory and access details."}),a.jsx("div",{className:"overflow-x-auto rounded-xl border border-gray-200 mb-8",children:a.jsxs("table",{className:"w-full text-sm font-body",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"bg-[#CC1A1A] text-white",children:[a.jsx("th",{className:"px-4 py-3 text-left font-semibold",children:"Move Type"}),a.jsx("th",{className:"px-4 py-3 text-left font-semibold",children:"Typical Crew"}),a.jsx("th",{className:"px-4 py-3 text-left font-semibold",children:"Cost Factors"})]})}),a.jsx("tbody",{children:[["Studio or small apartment","2 movers","Elevator access, loading zone, boxes, furniture volume"],["1-2 bedroom condo or apartment","2-3 movers","Building rules, elevator bookings, parking, packing"],["Townhome or 3-bedroom home","3+ movers","Stairs, furniture disassembly, distance from truck to door"],["Office or commercial move","Crew size varies","Inventory, computers, desks, building access, timing"]].map((e,t)=>a.jsxs("tr",{className:t%2===0?"bg-white":"bg-gray-50",children:[a.jsx("td",{className:"px-4 py-3 font-semibold text-gray-900",children:e[0]}),a.jsx("td",{className:"px-4 py-3 text-gray-700",children:e[1]}),a.jsx("td",{className:"px-4 py-3 text-gray-700",children:e[2]})]},e[0]))})]})}),a.jsx("h2",{className:"font-heading text-2xl font-bold text-gray-900 mb-4",children:"Direct Local Mover vs Moving Broker"}),a.jsx("p",{className:"font-body text-gray-700 leading-relaxed mb-5",children:"Purely Canadian Movers is a direct local moving company. That means you work with the company responsible for your estimate, crew, truck, scheduling, and accountability, rather than a broker that may pass the job to another carrier."}),a.jsx("div",{className:"grid sm:grid-cols-2 gap-4 mb-8",children:[["Purely Canadian Movers","Own trained crews","Local Coquitlam office","No subcontractors","Family-owned since 1991"],["Typical Moving Broker","May sell or assign the job","May not have a local office","Crew may change","Accountability can be unclear"]].map(e=>a.jsxs("div",{className:"border border-gray-200 rounded-xl p-5 bg-gray-50",children:[a.jsx("h3",{className:"font-heading text-lg font-bold text-gray-900 mb-3",children:e[0]}),a.jsx("ul",{className:"space-y-2",children:e.slice(1).map(t=>a.jsxs("li",{className:"flex items-start gap-2",children:[a.jsx(We,{size:15,className:"text-[#CC1A1A] mt-0.5 shrink-0"}),a.jsx("span",{className:"font-body text-sm text-gray-700",children:t})]},t))})]},e[0]))})';

local = local.replace(
  '})]},e.href))})]}),a.jsx("div",{"data-loc":"client/src/pages/services/LocalMoving.tsx:145"',
  '})]},e.href))})' + costAndTrust + ']}),a.jsx("div",{"data-loc":"client/src/pages/services/LocalMoving.tsx:145"'
);

local = local.replace(
  'children:"Tell us about your move and we\\\'ll provide a no-obligation quote."',
  'children:"Tell us about your local move and we\\\'ll provide a no-obligation quote from a family-owned, BBB Accredited direct mover."'
);

local = local.replace(
  'a.jsx("a",{"data-loc":"client/src/pages/services/LocalMoving.tsx:152",href:"tel:18774856683",className:"block text-center font-body text-sm font-semibold text-[#CC1A1A] hover:text-[#A31515]",children:"Or call 1-877-485-6683"})',
  'a.jsx("a",{"data-loc":"client/src/pages/services/LocalMoving.tsx:152",href:"tel:18774856683",className:"block text-center font-body text-sm font-semibold text-[#CC1A1A] hover:text-[#A31515] mb-4",children:"Or call 1-877-485-6683"}),a.jsx("ul",{className:"space-y-2 border-t border-gray-200 pt-4",children:["Family-owned since 1991","BBB Accredited","No subcontractors","Based in Coquitlam, BC"].map(e=>a.jsxs("li",{className:"flex items-start gap-2",children:[a.jsx(We,{size:14,className:"text-[#CC1A1A] mt-0.5 shrink-0"}),a.jsx("span",{className:"font-body text-xs text-gray-700",children:e})]},e))})'
);

const faqSection = ',a.jsx("section",{className:"py-16 bg-gray-50",children:a.jsxs("div",{className:"container max-w-4xl",children:[a.jsx("h2",{className:"font-heading text-3xl font-bold text-gray-900 mb-8 text-center",children:"Local Moving FAQs"}),a.jsx("div",{className:"space-y-5",children:L.map(e=>a.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-6",children:[a.jsx("h3",{className:"font-heading text-lg font-bold text-gray-900 mb-2",children:e.question}),a.jsx("p",{className:"font-body text-gray-700 leading-relaxed",children:e.answer})]},e.question))})]})})';
if (!local.endsWith("]})}")) throw new Error("Unexpected local function ending");
local = local.slice(0, -4) + faqSection + local.slice(-4);

source = source.slice(0, start) + local + source.slice(end);
await writeFile(bundlePath, source);

const htmlPath = "site-copy/local/index.html";
let html = await readFile(htmlPath, "utf8");
html = html.replace(/<title>.*?<\/title>/, "<title>Local Movers in Metro Vancouver BC | Purely Canadian Movers</title>");
html = html.replace(
  /<meta name="description" content=".*?" \/>/,
  '<meta name="description" content="Local movers in Metro Vancouver for homes, condos, apartments, seniors moves, and offices. Serving Vancouver, Coquitlam, Burnaby, Surrey, Richmond, Langley, and nearby BC communities since 1991." />'
);
html = html.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="Local Movers in Metro Vancouver BC | Purely Canadian Movers" />');
html = html.replace(
  /<meta property="og:description" content=".*?" \/>/,
  '<meta property="og:description" content="Local movers for homes, condos, apartments, offices, and small moves across Vancouver, Coquitlam, Burnaby, Surrey, Richmond, Langley, and Metro Vancouver." />'
);
html = html.replace(/<meta property="og:url" content=".*?" \/>/, '<meta property="og:url" content="https://purelycanadianmovers.com/local/" />');
html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, '<meta name="twitter:title" content="Local Movers in Metro Vancouver BC | Purely Canadian Movers" />');
html = html.replace(
  /<meta name="twitter:description" content=".*?" \/>/,
  '<meta name="twitter:description" content="Local movers in Metro Vancouver for homes, condos, apartments, offices, and small moves. Family-owned since 1991." />'
);
await writeFile(htmlPath, html);
