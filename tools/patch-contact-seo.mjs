import { readFile, writeFile } from "node:fs/promises";

const bundlePath = "site-copy/assets/index-CNBNs70h.js";
let source = await readFile(bundlePath, "utf8");

const start = source.indexOf("function aG()");
const end = source.indexOf("function", start + 20);
if (start < 0 || end < 0) throw new Error("Contact component not found");

let contact = source.slice(start, end);

contact = contact.replace(
  'p=g=>{h.mutate({...g,moveType:s,homeSize:n})};return',
  'p=g=>{h.mutate({...g,moveType:s,homeSize:n})},m=[{question:"How do I get a free moving estimate?",answer:"Fill out the contact form or call 1-877-485-6683. Purely Canadian Movers reviews your move details and follows up with a no-obligation estimate."},{question:"What information should I include in my moving quote request?",answer:"Include your moving date, origin and destination, home or office size, access details, packing needs, storage needs, and any heavy, fragile, or specialty items."},{question:"Do you provide local and long-distance moving estimates?",answer:"Yes. We provide estimates for local moves in Metro Vancouver, long-distance moves across Canada, cross-country relocations, office moves, packing, storage, and Canada-USA moving."},{question:"Which areas do you serve from this contact page?",answer:"We serve Vancouver, Coquitlam, Burnaby, Surrey, Richmond, North Vancouver, Langley, New Westminster, Delta, Port Moody, White Rock, Abbotsford, Maple Ridge, Pitt Meadows, and long-distance routes across Canada."},{question:"How quickly will someone contact me?",answer:"Most estimate requests receive a response within one business day. For urgent moves, call 1-877-485-6683 or 604-522-7222."},{question:"Do you use subcontractors?",answer:"No. Purely Canadian Movers is family-owned, based in Coquitlam, and uses its own trained moving crews rather than subcontractors."}];return'
);

contact = contact.replace(
  'title:"Get a Free Moving Estimate | Contact Purely Canadian Movers",description:"Get a free moving estimate from Purely Canadian Movers. Call 1-877-485-6683 or fill out our online form. Metro Vancouver movers since 1991. No obligation.",canonical:"/contact/"',
  'title:"Free Moving Estimate in Vancouver & Metro Vancouver",description:"Request a free moving estimate from Purely Canadian Movers. Local, long-distance, packing, storage, and office moving in Vancouver, Coquitlam, Burnaby, Surrey, and Metro Vancouver. Family-owned since 1991.",canonical:"/contact/"'
);

contact = contact.replace(
  'a.jsx(ra,{"data-loc":"client/src/pages/Contact.tsx:50",items:[{name:"Contact Us",url:"/contact/"}]}),a.jsx("section"',
  'a.jsx(ra,{"data-loc":"client/src/pages/Contact.tsx:50",items:[{name:"Contact Us",url:"/contact/"}]}),a.jsx(Pt,{faqs:m}),a.jsx("section"'
);

contact = contact.replace(
  'children:"Fill out the form below and we\\\'ll get back to you with a no-obligation estimate. Or call us directly — we\\\'re happy to help."',
  'children:"Request a no-obligation estimate for local, long-distance, cross-country, office, packing, or storage moving. We serve Metro Vancouver from our Coquitlam base and coordinate moves across Canada."'
);

const answerSection = 'a.jsx("section",{className:"py-10 bg-white border-b border-gray-100",children:a.jsx("div",{className:"container",children:a.jsxs("div",{className:"max-w-4xl",children:[a.jsx("h2",{className:"font-heading text-3xl font-bold text-gray-900 mb-4",children:"Need a Moving Estimate in Metro Vancouver?"}),a.jsx("p",{className:"font-body text-lg text-gray-700 leading-relaxed mb-6",children:"Purely Canadian Movers provides free estimates for local, long-distance, cross-country, office, packing, and storage moves. We serve Vancouver, Coquitlam, Burnaby, Surrey, Richmond, North Vancouver, Langley, and nearby BC communities, with long-distance coordination across Canada."}),a.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-4",children:["Family-owned since 1991","Based in Coquitlam, BC","BBB Accredited","No subcontractors"].map(g=>a.jsxs("div",{className:"flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4",children:[a.jsx(We,{size:16,className:"text-[#CC1A1A] shrink-0"}),a.jsx("span",{className:"font-body text-sm font-semibold text-gray-800",children:g})]},g))})]})})}),';

contact = contact.replace(
  'a.jsx("section",{"data-loc":"client/src/pages/Contact.tsx:69"',
  answerSection + 'a.jsx("section",{"data-loc":"client/src/pages/Contact.tsx:69"'
);

const extraSections = ',a.jsx("section",{className:"py-16 bg-white",children:a.jsxs("div",{className:"container",children:[a.jsx("h2",{className:"font-heading text-3xl font-bold text-gray-900 mb-8 text-center",children:"Moving Services We Estimate"}),a.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-3 gap-5",children:[["Local Moving","Homes, condos, apartments, seniors moves, and small local moves in Metro Vancouver."],["Long-Distance Moving","Moves between Vancouver, Toronto, Calgary, Edmonton, Ottawa, Montreal, Victoria, Halifax, and other Canadian cities."],["Packing & Unpacking","Professional packing, fragile-item preparation, supplies, and unpacking support."],["Office Moving","Commercial, office, and employee relocation estimates for Metro Vancouver businesses."],["Storage","Short-term and longer-term storage options when your dates do not line up."],["Canada-USA Moving","Cross-border moving estimates with route planning and documentation guidance."]].map(g=>a.jsxs("div",{className:"border border-gray-200 rounded-lg p-5 bg-gray-50",children:[a.jsx("h3",{className:"font-heading text-xl font-bold text-gray-900 mb-2",children:g[0]}),a.jsx("p",{className:"font-body text-sm text-gray-700 leading-relaxed",children:g[1]})]},g[0]))})]})}),a.jsx("section",{className:"py-16 bg-gray-50",children:a.jsxs("div",{className:"container",children:[a.jsx("h2",{className:"font-heading text-3xl font-bold text-gray-900 mb-6",children:"Areas We Serve"}),a.jsx("p",{className:"font-body text-lg text-gray-700 leading-relaxed mb-6 max-w-4xl",children:"Request estimates for moves in Vancouver, Coquitlam, Burnaby, Surrey, Richmond, North Vancouver, Langley, New Westminster, Delta, Port Moody, White Rock, Abbotsford, Maple Ridge, Pitt Meadows, and long-distance routes across Canada."}),a.jsx("div",{className:"flex flex-wrap gap-2",children:["Vancouver","Coquitlam","Burnaby","Surrey","Richmond","North Vancouver","Langley","New Westminster","Delta","Port Moody","White Rock","Abbotsford","Maple Ridge","Pitt Meadows"].map(g=>a.jsx("span",{className:"rounded-full bg-white border border-gray-200 px-4 py-2 font-body text-sm font-semibold text-gray-700",children:g},g))})]})}),a.jsx("section",{className:"py-16 bg-white",children:a.jsxs("div",{className:"container max-w-4xl",children:[a.jsx("h2",{className:"font-heading text-3xl font-bold text-gray-900 mb-8 text-center",children:"Moving Estimate FAQs"}),a.jsx("div",{className:"space-y-5",children:m.map(g=>a.jsxs("div",{className:"border border-gray-200 rounded-lg p-6",children:[a.jsx("h3",{className:"font-heading text-lg font-bold text-gray-900 mb-2",children:g.question}),a.jsx("p",{className:"font-body text-gray-700 leading-relaxed",children:g.answer})]},g.question))})]})})';

if (!contact.endsWith("]})}")) throw new Error("Unexpected contact function ending");
contact = contact.slice(0, -4) + extraSections + contact.slice(-4);

source = source.slice(0, start) + contact + source.slice(end);
await writeFile(bundlePath, source);

const htmlPath = "site-copy/contact/index.html";
let html = await readFile(htmlPath, "utf8");
html = html.replace(
  /<title>.*?<\/title>/,
  "<title>Free Moving Estimate in Vancouver & Metro Vancouver | Purely Canadian Movers</title>"
);
html = html.replace(
  /<meta name="description" content=".*?" \/>/,
  '<meta name="description" content="Request a free moving estimate from Purely Canadian Movers. Local, long-distance, packing, storage, and office moving in Vancouver, Coquitlam, Burnaby, Surrey, and Metro Vancouver. Family-owned since 1991." />'
);
html = html.replace(
  /<meta property="og:title" content=".*?" \/>/,
  '<meta property="og:title" content="Free Moving Estimate in Vancouver & Metro Vancouver | Purely Canadian Movers" />'
);
html = html.replace(
  /<meta property="og:description" content=".*?" \/>/,
  '<meta property="og:description" content="Request a free moving estimate for local, long-distance, packing, storage, and office moving in Vancouver, Coquitlam, Burnaby, Surrey, and Metro Vancouver." />'
);
html = html.replace(
  /<meta property="og:url" content=".*?" \/>/,
  '<meta property="og:url" content="https://purelycanadianmovers.com/contact/" />'
);
html = html.replace(
  /<meta name="twitter:title" content=".*?" \/>/,
  '<meta name="twitter:title" content="Free Moving Estimate in Vancouver & Metro Vancouver | Purely Canadian Movers" />'
);
html = html.replace(
  /<meta name="twitter:description" content=".*?" \/>/,
  '<meta name="twitter:description" content="Request a free moving estimate from Purely Canadian Movers. Family-owned Metro Vancouver movers since 1991." />'
);
await writeFile(htmlPath, html);
