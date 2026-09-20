# Panoptes — MTIVE Solutions

Standalone static marketing site for **Panoptes**, deployed separately from the
main MTIVE site at the repo root.

- `index.html` — landing page
- `report/index.html` — report page (`/report`, via `cleanUrls`)
- `assets/` — icons and Open Graph images
- `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`

No build step: plain HTML/CSS/JS served as-is.

## Deployment (Vercel)

This folder is its own Vercel project with **Root Directory = `panoptes`** and
no build command (output served directly). `vercel.json` here sets `cleanUrls`,
immutable caching for `/assets/*`, and baseline security headers.
