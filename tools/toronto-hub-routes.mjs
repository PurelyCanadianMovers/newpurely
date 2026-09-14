export const torontoHubRouteMarker = "<!-- pcm-toronto-route-list -->";

export const torontoHubRoutes = Object.freeze([
  ["/toronto-to-vancouver-movers/", "Toronto → Vancouver"],
  ["/toronto-to-calgary-movers/", "Toronto → Calgary"],
  ["/toronto-to-montreal-movers/", "Toronto → Montreal"],
  ["/toronto-to-edmonton-movers/", "Toronto → Edmonton"],
  ["/toronto-to-victoria-movers/", "Toronto → Victoria / Nanaimo"],
  ["/toronto-to-halifax-movers/", "Toronto → Halifax"],
  ["/toronto-to-winnipeg-movers/", "Toronto → Winnipeg"],
  ["/toronto-to-ottawa-movers/", "Toronto → Ottawa"],
]);

const routeSectionEnd = '<div data-loc="client/src/pages/services/TorontoLongDistance.tsx:216"';
const legacyRouteSectionStart = '<div data-loc="client/src/components/RouteLinks.tsx:16"';
const routeGridPattern = /^([\s\S]*?<div\b[^>]*class="[^"]*\bgrid\b[^"]*"[^>]*>)([\s\S]*)(<\/div><\/div>\s*)$/i;
const routeLinkPattern = /<a\b[^>]*href="(\/toronto-to-[^"]+-movers\/)"[^>]*>[\s\S]*?<\/a>/gi;

function renderRouteLink(href, label) {
  return `<a href="${href}" class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200 hover:border-[#CC1A1A] hover:bg-red-50 transition-colors group"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right text-[#CC1A1A] shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span class="font-body text-gray-700 group-hover:text-gray-900 font-semibold">${label}</span></a>`;
}

function findRouteSection(html) {
  const markedStart = html.indexOf(torontoHubRouteMarker);
  const start = markedStart >= 0 ? markedStart : html.indexOf(legacyRouteSectionStart);
  if (start < 0) return null;
  const end = html.indexOf(routeSectionEnd, start);
  if (end < 0) return null;
  return { start, end, html: html.slice(start, end) };
}

export function updateTorontoHubRoutes(html, { requireExisting = false } = {}) {
  const section = findRouteSection(html);
  if (!section) {
    if (requireExisting) throw new Error("Toronto hub marked route-list block not found");
    return html;
  }

  const unmarkedSection = section.html.startsWith(torontoHubRouteMarker)
    ? section.html.slice(torontoHubRouteMarker.length)
    : section.html;
  const grid = unmarkedSection.match(routeGridPattern);
  if (!grid) throw new Error("Toronto hub route-list grid not found");

  const existingLinks = new Map();
  for (const match of grid[2].matchAll(routeLinkPattern)) {
    if (!existingLinks.has(match[1])) existingLinks.set(match[1], match[0]);
  }

  const links = torontoHubRoutes
    .map(([href, label]) => existingLinks.get(href) ?? renderRouteLink(href, label))
    .join("");
  const canonicalSection = `${torontoHubRouteMarker}${grid[1]}${links}${grid[3]}`;
  return html.slice(0, section.start) + canonicalSection + html.slice(section.end);
}
