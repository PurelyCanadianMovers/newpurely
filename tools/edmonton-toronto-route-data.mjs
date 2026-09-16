export const EDMONTON_TORONTO_FACTS = Object.freeze({
  distance: "approximately 3,500 km", displayedDistance: "~3,500 km", transit: "7–16 days", range: "$2,500–$15,000+",
  pricing: Object.freeze([
    Object.freeze(["Studio or small shipment", "$2,500+"]), Object.freeze(["1-bedroom", "$4,500–$5,500+"]), Object.freeze(["2-bedroom", "$6,000–$7,000+"]), Object.freeze(["3-bedroom", "$10,000+"]), Object.freeze(["4+ bedroom", "$12,000–$15,000+"]),
  ]),
});
export const EDMONTON_TORONTO_ROUTES = Object.freeze([
  Object.freeze({ slug: "edmonton-to-toronto-movers", from: "Edmonton, AB", to: "Toronto, ON", title: "Edmonton to Toronto Moving Cost | Movers, Prices & Transit Time | Purely Canadian Movers", description: "Edmonton to Toronto moving cost guide with estimated prices by home size, transit time, quote factors, packing, storage, valuation options, and direct movers.", faqCount: 12 }),
  Object.freeze({ slug: "toronto-to-edmonton-movers", from: "Toronto, ON", to: "Edmonton, AB", title: "Toronto to Edmonton Movers | Long-Distance Moving | Purely Canadian Movers", description: "Toronto to Edmonton movers. Professional, fully insured long-distance moves. Family-owned since 1991. GCVL agents. Free estimates.", faqCount: 12 }),
]);
export function assertEdmontonTorontoTemplate(html, route) {
  const required = [route.from, route.to, route.title, route.description, EDMONTON_TORONTO_FACTS.displayedDistance, EDMONTON_TORONTO_FACTS.transit, EDMONTON_TORONTO_FACTS.range, "Declared Value Protection", ...EDMONTON_TORONTO_FACTS.pricing.flat()];
  for (const value of required) if (!html.includes(value.replaceAll("&", "&amp;")) && !html.includes(value)) throw new Error(route.slug + ": missing authoritative value " + value);
  const count = (pattern) => (html.match(pattern) ?? []).length;
  if (count(/<h1\b/gi) !== 1) throw new Error(route.slug + ": expected one H1");
  if (count(/<form\b/gi) !== 1) throw new Error(route.slug + ": expected one quote form");
  if (count(/<table\b/gi) !== 1) throw new Error(route.slug + ": expected one pricing table");
  if (count(/font-heading text-base font-bold text-gray-900 mb-2/g) !== route.faqCount) throw new Error(route.slug + ": expected " + route.faqCount + " visible FAQs");
  if (count(/\"@type\":\"FAQPage\"/g) !== 1) throw new Error(route.slug + ": expected one FAQPage schema");
  if (/index-CNBNs70h\.js|STEP5_TORONTO_EDMONTON|Moving Cost Breakdown|\bundefined\b|pcm-local-seo/.test(html)) throw new Error(route.slug + ": legacy ownership/prohibited content remains");
}
