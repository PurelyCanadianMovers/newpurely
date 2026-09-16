import { torontoVancouverFacts, torontoVancouverFaqs, torontoVancouverRoutes } from "./toronto-vancouver-route-data.mjs";

export { torontoVancouverFacts, torontoVancouverFaqs, torontoVancouverRoutes };

export function assertTorontoVancouverStaticTemplate(html, route) {
  const required = [
    "<h1", "pcm-lead-panel", "pcm-estimate-form", "pcm-route-cost", "<table", "Route at a Glance",
    "Frequently Asked Questions", "application/ld+json", "/assets/static-nav.css", "/assets/static-nav.js",
    "/assets/static-chat.css", "/assets/static-chat.js", "/assets/conversion-boost.js", "/assets/step38-toronto-vancouver.css",
    route.routeLabel, route.originValue, route.destinationValue, torontoVancouverFacts.distance,
    torontoVancouverFacts.transit, torontoVancouverFacts.range,
  ];
  for (const marker of required) if (!html.includes(marker)) throw new Error(`${route.slug}: missing ${marker}`);
  if (html.includes("index-CNBNs70h.js") || html.includes("step38-toronto-vancouver.js") || html.includes("pcm-step38-config")) throw new Error(`${route.slug}: React or Step 38 runtime remains`);
  if (html.includes("pcm-local-seo") || /\bundefined\b/i.test(html)) throw new Error(`${route.slug}: forbidden static marker`);
  if ((html.match(/<h1\b/gi) ?? []).length !== 1 || (html.match(/<form\b/gi) ?? []).length !== 1 || (html.match(/<table\b/gi) ?? []).length !== 1) throw new Error(`${route.slug}: singular route contract failed`);
  if ((html.match(/FAQPage/g) ?? []).length !== 1) throw new Error(`${route.slug}: FAQPage schema is not singular`);
  for (const [label, value] of torontoVancouverFacts.rows) if (!html.includes(label) || !html.includes(value)) throw new Error(`${route.slug}: missing pricing row ${label}`);
  for (const faq of torontoVancouverFaqs[`/${route.slug}/`]) if (!html.includes(faq.question) || !html.includes(faq.answer)) throw new Error(`${route.slug}: missing FAQ fact`);
}