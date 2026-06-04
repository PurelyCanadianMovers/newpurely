# AI Search SEO To-Do

Page: https://purelycanadianmovers.com/long-distance-moving-cost-canada/

Completed:

- [x] Make cost ranges consistent across the page.
- [x] Add a visible "Last updated" note and pricing methodology context.

Remaining:

- [x] Add concise AI-answer blocks near the top, including "How much does a long-distance move cost in Canada?"
- [x] Add `FAQPage` JSON-LD for the visible FAQ questions and answers.
- [x] Add route-specific mini-answer sections before the large pricing table.
- [x] Strengthen trust and expertise signals in the pricing methodology section.
- [x] Clean the title tag to avoid duplicate brand text.
- [x] Add a downloadable or copy-friendly pricing table summary for route costs.

Checked June 2, 2026:

- `/long-distance-moving-cost-canada/` renders the quick answer content, route/cost sections, and `FAQPage` schema.
- `/long-distance/` has strong hub content, city links, quote CTA, pricing/transit language, but no `FAQPage` schema.
- Long-distance city pages such as Toronto, Calgary, Edmonton, Montreal, Ottawa, Victoria, and Halifax render cost/quote language, transit language, and `FAQPage` schema.
- Remaining priority in this cluster is title cleanup and deeper trust/proof around pricing methodology, not the first three AI-answer tasks.
- Completed title cleanup and trust/proof strengthening for the priority long-distance pages on June 2, 2026. Rendered titles were verified for `/long-distance-moving-cost-canada/`, `/long-distance/`, `/toronto-to-calgary-movers/`, `/toronto-long-distance-movers/`, `/vancouver-long-distance-movers/`, and `/calgary-long-distance-movers/`.

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

- [x] Remove duplicate brand text from title tags where it appears, especially titles ending with `Purely Canadian Movers | Purely Canadian Movers`.
- [x] Shorten long title tags that may truncate in search results.
- [ ] Keep city + service intent in every title, H1, and meta description.
- [ ] Add or standardize `FAQPage` schema on service, city, route, and cost-guide pages where visible FAQs exist.
- [ ] Add richer route/city proof sections: estimated cost, transit time, access notes, elevator/building considerations, nearby service areas, and common move scenarios.
- [ ] Strengthen E-E-A-T on money pages with proof points: since 1991, BBB Accredited, no subcontractors, insured/valuation coverage, and Great Canadian Van Lines agent.
- [ ] Add or confirm `BreadcrumbList` schema and consistent internal links between service, city, route, cost, packing, storage, testimonials, and quote pages.
- [x] Add `noindex` handling for utility pages such as `/admin/login/`, `/admin/blog/`, and `/404/`.
- [x] Prioritize remaining lower-scoring page from this audit group: `/local-movers-in-vancouver-bc/`.
- [x] Add tailored E-E-A-T proof to the suggested priority order: `/local-movers-in-vancouver-bc/`, `/port-coquitlam/`, `/storage/`, `/packing/`, `/long-distance/`, `/cross-country-movers/`, `/canada-usa/`, `/overseas/`, `/x-country/`, `/office/`, `/office-movers-in-vancouver-bc/`, `/corporate-moves-employee-relocation-in-coquitlam-bc/`, `/movers-calgary-to-edmonton/`, `/movers-edmonton-to-calgary/`, and `/movers-vancouver-to-halifax/`.
- [x] Strengthen `/surrey/` for the keyword `long distance movers in Surrey, BC` with source title/meta, long-distance content, trust proof, internal links, Service schema, and FAQPage schema.
- [x] Improve `/coquitlam-bc/` and `/local-movers-in-coquitlam-bc/` with stronger Coquitlam proof, internal links, visible FAQ wording, and expanded FAQ schema.
- [x] Improve `/packing-service-in-coquitlam-bc/` and `/testimonials/` with stronger service-area proof, internal links, visible FAQ sections, and FAQ schema.
- [x] Improve `/contact/` with cleaner title/meta, local estimate answer content, service-area sections, trust proof, and FAQ schema.
- [x] Improve `/local/` with a Metro Vancouver cost guide, expanded city links, direct mover vs broker comparison, trust CTA, and FAQ schema.
- [x] Re-strengthen `/local-movers-burnaby-bc/` because the report shows Burnaby dropped from position 22 in April to 100 in May.
- [x] Strengthen `/port-moody/` as a supporting city hub with title cleanup, Port Moody-specific content, internal links, and FAQ schema.
- [x] Strengthen `/local-movers-white-rock-bc/` after Maple Ridge and Coquitlam cluster work.
- [x] Strengthen the Port Coquitlam page/cluster after Maple Ridge and Coquitlam cluster work.
- [ ] Continue expanding city/service internal links across the local moving cluster.
- [ ] Monitor Google Search Console validation while it is still running; no new redirect/indexing changes unless Soft 404, Page with redirect, Not found 404, Redirect error, or Crawled currently not indexed shows new failed examples with recent crawl dates.
- [ ] Monitor GBP calls, website clicks, and direction clicks after each local SEO update.
- [ ] Re-run `npm run audit:seo` after improvements and update `LOCAL_SEO_AUDIT.md`.

Admin/blog access note:

- Keep `/admin/login/` and `/admin/blog/` available for content editing, but outside the public SEO surface.
- Blog page status: `/admin/blog/` is currently working for content access after the Cloudflare/Manus redirect setup.
- Static copy now adds `noindex, nofollow, noarchive`, excludes private routes from `sitemap.xml`, and disallows `/admin/` in `robots.txt`.
- On the live/CMS host, protect `/admin/` server-side with login/authentication; robots and meta tags are not security controls.

## AI Overview / Answer Engine Monitoring To-Do

- [ ] Check Search Console weekly, not daily, because AI/search visibility usually needs more than one crawl cycle.
- [ ] Watch for early movement 1-3 weeks after page changes: recrawled pages, updated titles/snippets, new long-tail impressions, and FAQ/schema recognition.
- [ ] Look for stronger evidence after 4-8 weeks: improved impressions, better CTR, more question-style queries, and occasional answer-engine pickup.
- [ ] Treat 2-4 months as the realistic window for meaningful AI Overview improvement on competitive moving searches.
- [ ] Prioritize pages that already get impressions: long-distance moving cost guide, local moving page, major city pages, and route-specific long-distance pages.
- [ ] Track indirect AI visibility signals: more impressions, better CTR, more long-tail queries, pages appearing for question searches, and pages being cited/surfaced in AI-style answers.
- [ ] Keep improving answer-first content blocks, FAQ schema, service schema, internal links, and trust proof on high-intent pages.

Reminder:

- Google does not guarantee AI Overview placement, and Search Console does not yet provide a clean AI Overview ranking report.
