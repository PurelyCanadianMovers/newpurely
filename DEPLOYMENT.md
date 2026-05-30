# Static Deployment

This branch prepares the public Purely Canadian Movers site for static hosting outside Manus.

## Cloudflare Pages

- Build command: `corepack pnpm build`
- Build output directory: `dist/public`
- Node version: 20 or newer

Cloudflare Pages will use `client/public/_redirects` to serve the React app for preserved URL paths and `client/public/_headers` for basic security and asset caching headers.

## Vercel

Vercel can use the included `vercel.json`.

- Build command: `corepack pnpm build`
- Output directory: `dist/public`

## Contact Form

The contact form posts to `/api/contact` by default. On Vercel, that route is handled by `api/contact.ts` and sends an email through SMTP.

Recommendations:

- Vercel: use the included `/api/contact` serverless function with SMTP environment variables. This keeps the form in-repo and avoids relying on the old Manus backend.
- Cloudflare Pages: use a trusted hosted form service such as Formspree, Basin, or Getform and set `VITE_CONTACT_FORM_ENDPOINT`. This is safer than trying to send SMTP directly from a static Cloudflare Pages deployment.

Set these environment variables in Vercel:

```bash
SMTP_USER=your-sending-address@example.com
SMTP_PASS=your-smtp-app-password
CONTACT_TO_EMAIL=esales@pcmovers.ca
```

Optional SMTP overrides:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

If the API endpoint is unavailable or email delivery is not configured, the form falls back to opening a prefilled email to `esales@pcmovers.ca`.

For Cloudflare Pages static hosting without a Pages Function, use a trusted form endpoint such as Formspree, Basin, or Getform and set:

```bash
VITE_CONTACT_FORM_ENDPOINT=https://your-form-endpoint.example.com
```

The endpoint should accept a JSON `POST`. Without that variable, Cloudflare will reject `/api/*` requests and the form will use the email fallback.

## Before Launch

- Confirm all live URLs in `client/public/sitemap.xml` return the intended page.
- Connect a production form endpoint if email fallback is not enough.
- Optimize the production bundle size before launch.
