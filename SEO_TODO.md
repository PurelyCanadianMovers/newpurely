# AI Search SEO To-Do

Page: https://purelycanadianmovers.com/long-distance-moving-cost-canada/

Completed:

- [x] Make cost ranges consistent across the page.
- [x] Add a visible "Last updated" note and pricing methodology context.

Remaining:

- [ ] Add concise AI-answer blocks near the top, including "How much does a long-distance move cost in Canada?"
- [ ] Add `FAQPage` JSON-LD for the visible FAQ questions and answers.
- [ ] Add route-specific mini-answer sections before the large pricing table.
- [ ] Strengthen trust and expertise signals in the pricing methodology section.
- [ ] Clean the title tag to avoid duplicate brand text.
- [ ] Add a downloadable or copy-friendly pricing table summary for route costs.

Suggested route mini-answers:

- Vancouver to Toronto moving cost
- Toronto to Vancouver moving cost
- Vancouver to Calgary moving cost
- Toronto to Calgary moving cost
- Montreal to Vancouver moving cost
- Ottawa to Vancouver moving cost
- Victoria/Nanaimo to Toronto moving cost

Notes:

- Keep all pricing in CAD.
- Use the same price ranges in title/meta, page body, FAQ answers, route tables, and schema.
- Include estimate disclaimers: final price depends on shipment weight or volume, route distance, access conditions, season, packing, storage, and specialty items.
- Prioritize clear, factual answer blocks over generic marketing copy.

## Sitewide Local SEO Audit To-Do

Source report: `LOCAL_SEO_AUDIT.md`

- [ ] Remove duplicate brand text from title tags where it appears, especially titles ending with `Purely Canadian Movers | Purely Canadian Movers`.
- [ ] Shorten long title tags that may truncate in search results.
- [ ] Keep city + service intent in every title, H1, and meta description.
- [ ] Add or standardize `FAQPage` schema on service, city, route, and cost-guide pages where visible FAQs exist.
- [ ] Add richer route/city proof sections: estimated cost, transit time, access notes, elevator/building considerations, nearby service areas, and common move scenarios.
- [ ] Strengthen E-E-A-T on money pages with proof points: since 1991, BBB Accredited, no subcontractors, insured/valuation coverage, and Great Canadian Van Lines agent.
- [ ] Add or confirm `BreadcrumbList` schema and consistent internal links between service, city, route, cost, packing, storage, testimonials, and quote pages.
- [x] Add `noindex` handling for utility pages such as `/admin/login/`, `/admin/blog/`, and `/404/`.
- [ ] Prioritize lower-scoring pages from the audit: `/local/`, `/coquitlam-bc/`, `/local-movers-in-vancouver-bc/`, `/local-movers-in-coquitlam-bc/`, `/packing-service-in-coquitlam-bc/`, and `/testimonials/`.
- [x] Improve `/contact/` with cleaner title/meta, local estimate answer content, service-area sections, trust proof, and FAQ schema.
- [ ] Re-run `npm run audit:seo` after improvements and update `LOCAL_SEO_AUDIT.md`.

Admin/blog access note:

- Keep `/admin/login/` and `/admin/blog/` available for content editing, but outside the public SEO surface.
- Static copy now adds `noindex, nofollow, noarchive`, excludes private routes from `sitemap.xml`, and disallows `/admin/` in `robots.txt`.
- On the live/CMS host, protect `/admin/` server-side with login/authentication; robots and meta tags are not security controls.
