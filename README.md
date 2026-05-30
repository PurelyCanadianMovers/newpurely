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

## Refresh From The Live Site

```bash
npm run mirror
npm run routes
```

Forms, analytics, and WordPress/admin-style backend behavior are preserved visually only. They will need a real backend or third-party form handler if you want submissions to work after publishing to GitHub Pages or another static host.
