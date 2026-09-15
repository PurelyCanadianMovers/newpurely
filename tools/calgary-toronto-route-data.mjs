export const CALGARY_TORONTO_FACTS = Object.freeze({
  distance: "approximately 3,400 km",
  transit: "7–19 days",
  range: "$2,500–$15,000+",
  pricing: Object.freeze([
    Object.freeze(["Studio or small shipment", "$2,500+"]),
    Object.freeze(["1-bedroom", "$3,800+"]),
    Object.freeze(["2-bedroom", "$6,400+"]),
    Object.freeze(["3-bedroom", "$10,000+"]),
    Object.freeze(["4+ bedroom", "$15,000+"]),
  ]),
});

export const CALGARY_TORONTO_ROUTES = Object.freeze([
  Object.freeze({ slug: "calgary-to-toronto-movers", from: "Calgary, AB", to: "Toronto, ON", title: "Calgary to Toronto Movers | Purely Canadian Movers", description: "Calgary to Toronto movers. Professional long-distance moves with Declared Value Protection options. Family-owned since 1991. GCVL agents. Free estimates.", faqCount: 11 }),
  Object.freeze({ slug: "toronto-to-calgary-movers", from: "Toronto, ON", to: "Calgary, AB", title: "Toronto to Calgary Moving Cost | Movers, Prices & Transit Time | Purely Canadian Movers", description: "Toronto to Calgary moving cost guide with estimated prices by home size, transit time, quote factors, packing, storage, valuation options, and direct movers.", faqCount: 9 }),
]);

export function assertCalgaryTorontoTemplate(html, route) {
  const required = [route.from, route.to, route.title, route.description, "3,400 km", CALGARY_TORONTO_FACTS.transit, CALGARY_TORONTO_FACTS.range, ...CALGARY_TORONTO_FACTS.pricing.map((row) => row[1])];
  for (const value of required) {
    if (!html.includes(value.replaceAll("&", "&amp;")) && !html.includes(value)) throw new Error(`${route.slug}: missing authoritative value ${value}`);
  }
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) throw new Error(`${route.slug}: expected exactly one H1`);
  if ((html.match(/<form\b/gi) ?? []).length !== 1) throw new Error(`${route.slug}: expected exactly one quote form`);
  if ((html.match(/<table\b/gi) ?? []).length !== 1) throw new Error(`${route.slug}: expected exactly one pricing table`);
  if (/index-CNBNs70h\.js|pcm-step22-calgary-toronto-runtime|toronto-calgary-relocation\.js/.test(html)) throw new Error(`${route.slug}: contains legacy React ownership`);
}
