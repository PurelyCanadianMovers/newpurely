import fs from "node:fs";

const bundlePath = "site-copy/assets/index-CNBNs70h.js";
let bundle = fs.readFileSync(bundlePath, "utf8");

const replacements = [
  [
    'data-loc":"client/src/pages/services/MontrealToVancouverMovers.tsx:186",className:"font-body text-gray-700 text-lg leading-relaxed mb-4",children:["As agents of ",a.jsx("strong",{"data-loc":"client/src/pages/services/MontrealToVancouverMovers.tsx:187",children:"Great Canadian Van Lines"}),", we combine the reach of a national carrier with the personal accountability of a family-owned business. Your move is handled by our own crew — not a subcontractor — from the moment we arrive at your Montreal home to the moment we deliver in Calgary.',
    'data-loc":"client/src/pages/services/MontrealToVancouverMovers.tsx:186",className:"font-body text-gray-700 text-lg leading-relaxed mb-4",children:["As agents of ",a.jsx("strong",{"data-loc":"client/src/pages/services/MontrealToVancouverMovers.tsx:187",children:"Great Canadian Van Lines"}),", we combine the reach of a national carrier with the personal accountability of a family-owned business. Your move is handled by our own crew — not a subcontractor — from the moment we arrive at your Montreal home to the moment we deliver in Vancouver.',
  ],
  [
    'value:"~4,400 km",sub:"Montreal to Vancouver"',
    'value:"Over 3,700 km",sub:"Montreal to Vancouver"',
  ],
  [
    "At roughly 5500 km, this is a true cross-country move.",
    "At over 3,700 km, this is a true cross-country move.",
  ],
];

for (const [from, to] of replacements) {
  const matches = bundle.split(from).length - 1;
  const correctedMatches = bundle.split(to).length - 1;
  if (matches === 0 && correctedMatches === 1) continue;
  if (matches !== 1) {
    throw new Error(`Expected one match, found ${matches}: ${from}`);
  }
  bundle = bundle.replace(from, to);
}

fs.writeFileSync(bundlePath, bundle);

const pagePath = "site-copy/montreal-to-vancouver-movers/index.html";
let page = fs.readFileSync(pagePath, "utf8");
const pageReplacements = [
  ["~4,400 km", "Over 3,700 km"],
  ["At roughly 5500 km, this is a true cross-country move.", "At over 3,700 km, this is a true cross-country move."],
];

for (const [from, to] of pageReplacements) {
  const matches = page.split(from).length - 1;
  const correctedMatches = page.split(to).length - 1;
  if (matches === 0 && correctedMatches === 1) continue;
  if (matches !== 1) {
    throw new Error(`Expected one page match, found ${matches}: ${from}`);
  }
  page = page.replace(from, to);
}

fs.writeFileSync(pagePath, page);
