export const CALGARY_VANCOUVER_FACTS = Object.freeze({
  distance: "approximately 1,000 km",
  displayedDistance: "~1,000 km",
  transit: "4–13 days",
  pricing: Object.freeze([
    Object.freeze(["Studio", "$2,000+", "Typical 1,000–2,500 lb shipment"]),
    Object.freeze(["1-bedroom", "$2,600+", "Typical 2,500–4,500 lb shipment"]),
    Object.freeze(["2-bedroom", "$3,500+", "Typical 4,500–7,500 lb shipment"]),
    Object.freeze(["3-bedroom", "$4,800+", "Typical 7,500–12,000 lb shipment"]),
    Object.freeze(["4+ bedroom", "$6,500+", "Typical shipment of 12,000+ lb"]),
  ]),
});

export const CALGARY_VANCOUVER_ROUTES = Object.freeze([
  Object.freeze({
    slug: "calgary-to-vancouver-movers",
    from: "Calgary, AB",
    to: "Vancouver, BC",
    title: "Calgary to Vancouver Movers | Purely Canadian Movers",
    description: "Calgary to Vancouver movers. Professional, fully insured long-distance moves. Family-owned since 1991. GCVL agents. Free estimates.",
    range: "$1,800–$13,000+",
    faqCount: 8,
    directionalSentinels: Object.freeze(["Rainy Season Preparation", "Update Your BC Driver’s Licence", "No More Alberta Tax Advantage"]),
  }),
  Object.freeze({
    slug: "vancouver-to-calgary-movers",
    from: "Vancouver, BC",
    to: "Calgary, AB",
    title: "Vancouver to Calgary Movers | Purely Canadian Movers",
    description: "Vancouver to Calgary movers. Professional, fully insured long-distance moves through the Rockies. Family-owned since 1991. GCVL agents. Free estimates — call 1-877-485-6683.",
    range: "$1,800–$14,000+",
    faqCount: 8,
    directionalSentinels: Object.freeze(["Book Your Condo Elevator Early", "Plan for Calgary's Climate Swings", "Update Your Alberta Health Card"]),
  }),
]);

export function assertCalgaryVancouverTemplate(html, route) {
  const required = [
    route.from,
    route.to,
    route.title,
    route.description,
    CALGARY_VANCOUVER_FACTS.displayedDistance,
    CALGARY_VANCOUVER_FACTS.transit,
    route.range,
    "Declared Value Protection",
    ...route.directionalSentinels,
    ...CALGARY_VANCOUVER_FACTS.pricing.flat(),
  ];
  for (const value of required) {
    if (!html.includes(value.replaceAll("&", "&amp;")) && !html.includes(value)) {
      throw new Error(`${route.slug}: missing authoritative value ${value}`);
    }
  }
  const count = (pattern) => (html.match(pattern) ?? []).length;
  if (count(/<h1\b/gi) !== 1) throw new Error(`${route.slug}: expected exactly one H1`);
  if (count(/<form\b/gi) !== 1) throw new Error(`${route.slug}: expected exactly one quote form`);
  if (count(/<table\b/gi) !== 1) throw new Error(`${route.slug}: expected exactly one pricing table`);
  if (count(/<details\b/gi) !== route.faqCount) throw new Error(`${route.slug}: expected ${route.faqCount} visible FAQs`);
  if (count(/"@type":"FAQPage"/g) !== 1) throw new Error(`${route.slug}: expected exactly one FAQPage schema`);
  if (/index-CNBNs70h\.js|step33-calgary-vancouver\.js|Moving Cost Breakdown|pcm-local-seo|\bundefined\b/.test(html)) {
    throw new Error(`${route.slug}: contains legacy ownership or prohibited content`);
  }
  for (const asset of ["static-nav.css", "static-chat.css", "static-nav.js", "step02-calgary-vancouver-static.js", "static-chat.js"]) {
    if (count(new RegExp(asset.replace(".", "\\."), "g")) !== 1) throw new Error(`${route.slug}: expected one ${asset}`);
  }
}
