export const MONTREAL_TORONTO_ROUTE_FACTS = Object.freeze({
  distance: "540 km",
  transit: "2–5 days",
  pricing: Object.freeze([
    ["Studio", "$2,300+"],
    ["1-bedroom", "$3,900+"],
    ["2-bedroom", "$5,200+"],
    ["3-bedroom", "$8,300+"],
    ["4+ bedroom", "$12,000+"],
  ]),
  range: "$2,300–$12,000+",
});

export const MONTREAL_TORONTO_ROUTES = Object.freeze([
  Object.freeze({
    slug: "montreal-to-toronto-movers",
    from: "Montreal, QC",
    to: "Toronto, ON",
    title: "Montreal to Toronto Movers | Long-Distance Moving | Purely Canadian Movers",
    description: "Montreal to Toronto movers. Professional long-distance moves with Declared Value Protection options. Family-owned since 1991. GCVL agents. Free estimates.",
  }),
  Object.freeze({
    slug: "toronto-to-montreal-movers",
    from: "Toronto, ON",
    to: "Montreal, QC",
    title: "Toronto to Montreal Movers | Long-Distance Moving | Purely Canadian Movers",
    description: "Toronto to Montreal movers. Professional long-distance moves with Declared Value Protection options. Family-owned since 1991. GCVL agents. Free estimates.",
  }),
]);

export function assertMontrealTorontoTemplate(html, route) {
  const required = [
    "<h1", "pcm-lead-panel", "pcm-estimate-form", "pcm-route-cost", "<table", "Route at a Glance",
    "Frequently Asked Questions", "application/ld+json", "/assets/static-nav.css", "/assets/static-nav.js",
    "/assets/static-chat.css", "/assets/static-chat.js", "/assets/conversion-boost.js",
  ];
  for (const marker of required) if (!html.includes(marker)) throw new Error(`${route.slug}: missing ${marker}`);
  if (html.includes("index-CNBNs70h.js") || html.includes("pcm-step4-montreal-toronto-runtime")) throw new Error(`${route.slug}: React/runtime ownership remains`);
  if (!html.includes(`value="${route.from}"`) || !html.includes(`value="${route.to}"`)) throw new Error(`${route.slug}: directional form defaults missing`);
  if (!html.includes(MONTREAL_TORONTO_ROUTE_FACTS.distance) || !html.includes(MONTREAL_TORONTO_ROUTE_FACTS.transit) || !html.includes(MONTREAL_TORONTO_ROUTE_FACTS.range)) throw new Error(`${route.slug}: authoritative facts missing`);
  if ((html.match(/<h1\b/gi) ?? []).length !== 1 || (html.match(/<form\b/gi) ?? []).length !== 1 || (html.match(/<table\b/gi) ?? []).length !== 1) throw new Error(`${route.slug}: singular route contract failed`);
}
