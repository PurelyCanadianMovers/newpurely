const DEFAULT_ROW_CLASSES = "border-b border-gray-200 bg-white hover:bg-red-50";
const BUTTON_CLASS = "inline-flex items-center justify-center whitespace-nowrap text-sm transition-all h-8 rounded-md gap-1.5 px-3 bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold";

export const DEDICATED_POPULAR_ROUTES = Object.freeze([
  {
    slug: "victoria-to-ottawa-movers",
    label: "Victoria → Ottawa",
    distance: "~4,700+ km",
    transit: "10–22 days",
  },
  {
    slug: "ottawa-to-victoria-movers",
    label: "Ottawa → Victoria",
    distance: "~4,700+ km",
    transit: "10–22 days",
  },
  {
    slug: "calgary-to-ottawa-movers",
    label: "Calgary → Ottawa",
    distance: "3,500 km",
    transit: "7–19 days",
  },
]);

function routeRowDetails(row) {
  const slug = row.match(/\bdata-route="([^"]+)"/i)?.[1] ?? "";
  const label = row.match(/<td\b[^>]*>\s*([^<]*?)\s*<\/td>/i)?.[1]?.trim() ?? "";
  return { slug, label };
}

function renderRow(route, rowClasses) {
  return `<tr data-route="${route.slug}" class="${rowClasses}"><td class="py-3 px-4 font-body text-gray-900 font-semibold">${route.label}</td><td class="py-3 px-4 font-body text-gray-700">${route.distance}</td><td class="py-3 px-4 font-body text-gray-700">${route.transit}</td><td class="py-3 px-4 text-right"><a href="/${route.slug}/" class="${BUTTON_CLASS}">Get a Quote</a></td></tr>`;
}

export function ensureDedicatedPopularRoutes(html) {
  const headingIndex = html.indexOf(">Popular Moving Routes in Canada</h2>");
  if (headingIndex < 0) throw new Error("Cost guide popular-routes heading not found");

  const tableStart = html.indexOf("<table", headingIndex);
  const tableEnd = html.indexOf("</table>", tableStart);
  if (tableStart < 0 || tableEnd < 0) throw new Error("Cost guide popular-routes table not found");

  const bodyStart = html.indexOf("<tbody", tableStart);
  const bodyOpenEnd = html.indexOf(">", bodyStart);
  const bodyEnd = html.indexOf("</tbody>", bodyOpenEnd);
  if (bodyStart < 0 || bodyOpenEnd < 0 || bodyEnd < 0 || bodyEnd > tableEnd) {
    throw new Error("Cost guide popular-routes table body not found");
  }

  const bySlug = new Map(DEDICATED_POPULAR_ROUTES.map((route) => [route.slug, route]));
  const byLabel = new Map(DEDICATED_POPULAR_ROUTES.map((route) => [route.label, route]));
  const seen = new Set();
  let keptRowCount = 0;
  let body = "";

  for (const match of html.slice(bodyOpenEnd + 1, bodyEnd).matchAll(/<tr\b[\s\S]*?<\/tr>/gi)) {
    const row = match[0];
    const { slug, label } = routeRowDetails(row);
    const route = bySlug.get(slug) ?? byLabel.get(label);
    if (!route) {
      body += row;
      keptRowCount += 1;
      continue;
    }
    if (seen.has(route.slug)) continue;
    seen.add(route.slug);
    const rowClasses = row.match(/<tr\b[^>]*\bclass="([^"]*)"/i)?.[1] ?? (keptRowCount % 2 ? "border-b border-gray-200 bg-gray-50 hover:bg-red-50" : DEFAULT_ROW_CLASSES);
    body += renderRow(route, rowClasses);
    keptRowCount += 1;
  }

  for (const route of DEDICATED_POPULAR_ROUTES) {
    if (seen.has(route.slug)) continue;
    body += renderRow(route, keptRowCount % 2 ? "border-b border-gray-200 bg-gray-50 hover:bg-red-50" : DEFAULT_ROW_CLASSES);
    seen.add(route.slug);
    keptRowCount += 1;
  }

  return html.slice(0, bodyOpenEnd + 1) + body + html.slice(bodyEnd);
}
