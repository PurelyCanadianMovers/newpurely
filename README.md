# Purely Canadian Movers static copy

This repository contains an editable static copy of https://purelycanadianmovers.com/.

## Edit

- Main editable site files are in `site-copy/`.
- Start with `site-copy/index.html` for the homepage shell.
- Styling and app code are in `site-copy/assets/`.
- Downloaded images are in `site-copy/external/`.

The original site is a bundled React app, so much of the page content lives inside `site-copy/assets/index-CNBNs70h.js`. It is editable, but because it is bundled/minified, deeper content changes are easier if we rebuild the site into a cleaner source project later.

## Preview

```bash
npm run serve
```

Then open http://127.0.0.1:4174/.

## Private Admin Routes

The static copy keeps `/admin/login/` and `/admin/blog/` available for blog/content access, but treats them as private utility routes:

- Admin routes get `noindex, nofollow, noarchive` meta tags.
- The local preview server sends an `X-Robots-Tag` header for `/admin/` and `/404/`.
- Generated `sitemap.xml` excludes `/admin/` and `/404/`.
- Generated `robots.txt` disallows `/admin/` and `/404/`.

For a live/CMS deployment, protect `/admin/` with real server-side authentication. `robots.txt` and `noindex` help SEO, but they do not secure an admin area.

## Refresh From The Live Site

```bash
npm run mirror
npm run routes
```

Forms, analytics, and WordPress/admin-style backend behavior are preserved visually only. They will need a real backend or third-party form handler if you want submissions to work after publishing to GitHub Pages or another static host.

## Chatbot Lead Notifications

The Cloudflare Worker can send notifications for lead-intent chatbot questions only, such as quote, cost, route, phone, email, or booking questions.

Configure one of these options in Cloudflare Worker variables/secrets:

- `CHAT_LEAD_WEBHOOK_URL`: posts a JSON payload to Zapier, Make, or another webhook.
- `RESEND_API_KEY`, `CHAT_LEAD_NOTIFY_TO`, and `CHAT_LEAD_NOTIFY_FROM`: sends an email through Resend.

Do not put API keys directly in the repository.
