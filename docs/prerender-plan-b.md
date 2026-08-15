# PCM Prerender Plan B

The current workspace contains the compiled Vite/React site output, not the original Manus/Vite source project. Because the app uses React `createRoot()`, crawlers that do not run JavaScript can receive an empty shell unless the rendered DOM is captured at build time.

`tools/prerender-static.mjs` prerenders the public `site-copy` routes into `outputs/prerender-test` by loading each route in a headless browser and saving the rendered HTML. The current test run rendered 138/138 intended routes.

## Static Route Workaround

Twelve route pages existed as static files and in the sitemap, but were missing from the compiled React router. During prerendering, React replaced those pages with the app 404. `site-copy/assets/conversion-boost.js` now contains a `STATIC_ROUTE_PAGES` list and a static-route renderer so those pages render their route content instead of a 404.

Keep that list in sync with real indexable static routes until the original source router is recovered or rebuilt.

## Final Validation Before Production

- Put the prerendered build on a preview or staging URL.
- Use Tag Assistant and GA4 DebugView on `/`, `/local/`, `/toronto-to-calgary-movers/`, one formerly broken route, and `/contact/`.
- Confirm exactly one `page_view` per page load.
- Start one estimate form and confirm exactly one expected start event.
- Submit one test estimate and confirm exactly one submit or conversion event.
- Test an OpenAI Ads-style URL with UTMs and confirm the parameters survive into GA4.
- Disable JavaScript and verify representative pages still show real headings, body copy, and internal links.
- Keep a backup of the current production `site-copy` before deploying prerendered output.

