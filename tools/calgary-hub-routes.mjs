export const calgaryHubRouteMarker = "<!-- pcm-calgary-route-list -->";

export const calgaryHubRouteBlock = `${calgaryHubRouteMarker}<section class="pcm-section" aria-labelledby="calgary-route-list-heading"><h2 id="calgary-route-list-heading">Popular Calgary Moving Routes</h2><div class="pcm-links"><a href="/calgary-to-edmonton-movers/">Calgary to Edmonton Movers</a><a href="/calgary-to-vancouver-movers/">Calgary to Vancouver Movers</a><a href="/calgary-to-toronto-movers/">Calgary to Toronto Movers</a><a href="/calgary-to-montreal-movers/">Calgary to Montreal Movers</a><a href="/calgary-to-halifax-movers/">Calgary to Halifax Movers</a><a href="/calgary-to-winnipeg-movers/">Calgary to Winnipeg Movers</a><a href="/calgary-to-ottawa-movers/">Calgary to Ottawa Movers</a></div></section>`;

const markedRouteSection = /<!-- pcm-calgary-route-list -->\s*<section\b[\s\S]*?<\/section>/i;

export function updateCalgaryHubRoutes(html, { requireExisting = false } = {}) {
  if (markedRouteSection.test(html)) {
    return html.replace(markedRouteSection, calgaryHubRouteBlock);
  }
  if (requireExisting) {
    throw new Error("Calgary hub route-list marker not found");
  }
  if (!html.includes("</main>")) {
    throw new Error("Calgary hub main element not found");
  }
  return html.replace("</main>", `${calgaryHubRouteBlock}</main>`);
}
