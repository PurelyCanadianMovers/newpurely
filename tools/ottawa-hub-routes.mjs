export const ottawaHubRouteMarker = "<!-- pcm-ottawa-route-list -->";

export const ottawaHubRoutes = Object.freeze([
  ["/ottawa-to-calgary-movers/", "Ottawa → Calgary"],
  ["/ottawa-to-edmonton-movers/", "Ottawa → Edmonton"],
  ["/ottawa-to-toronto-movers/", "Ottawa → Toronto"],
  ["/ottawa-to-vancouver-movers/", "Ottawa → Vancouver"],
  ["/ottawa-to-victoria-movers/", "Ottawa → Victoria / Nanaimo"],
  ["/ottawa-to-winnipeg-movers/", "Ottawa → Winnipeg"],
]);

const routeSectionEnd = '<div data-loc="client/src/pages/services/OttawaLongDistance.tsx:216"';
const legacyRouteSectionStart = '<div data-loc="client/src/components/RouteLinks.tsx:16"';
const markedRouteSection = /<!-- pcm-ottawa-route-list -->\s*<div\b[^>]*aria-labelledby="ottawa-route-list-heading"[^>]*>[\s\S]*?<\/div><\/div>/i;

function renderRouteLink(href, label) {
  return `<a href="${href}" class="flex items-center gap-3 p-3 bg-white rounded border border-gray-200 hover:border-[#CC1A1A] hover:bg-red-50 transition-colors group"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right text-[#CC1A1A] shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span class="font-body text-gray-700 group-hover:text-gray-900 font-semibold">${label}</span></a>`;
}

export const ottawaHubRouteBlock = `${ottawaHubRouteMarker}<div class="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200" aria-labelledby="ottawa-route-list-heading"><h3 id="ottawa-route-list-heading" class="font-heading text-xl font-bold text-gray-900 mb-4">Routes From Ottawa</h3><div class="grid sm:grid-cols-2 gap-3">${ottawaHubRoutes.map(([href, label]) => renderRouteLink(href, label)).join("")}</div></div>`;

function findRouteSection(html) {
  const start = html.indexOf(legacyRouteSectionStart);
  if (start < 0) return null;
  const end = html.indexOf(routeSectionEnd, start);
  if (end < 0) return null;
  return { start, end };
}

export function updateOttawaHubRoutes(html, { requireExisting = false } = {}) {
  if (markedRouteSection.test(html)) {
    return html.replace(markedRouteSection, ottawaHubRouteBlock);
  }
  const section = findRouteSection(html);
  if (!section) {
    if (requireExisting) throw new Error("Ottawa hub marked route-list block not found");
    return html;
  }
  return html.slice(0, section.start) + ottawaHubRouteBlock + html.slice(section.end);
}
