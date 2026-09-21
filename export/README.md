# MTIVE Solutions — site export

Three static pages, no build step, no server-side code:

- `index.html` — MTIVE landing page (Panoptes + SmartPatrol360)
- `report.html` — VIGIL/ARGUS detection report
- `paper.html` — technical paper viewer (embeds `argus_vigil_paper.pdf`, included alongside it)

All links between the three pages are relative, so this folder works as-is on any static host.

## Push to GitHub

```bash
cd mtive-site        # this folder
git init
git add .
git commit -m "MTIVE site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on github.com first — New repository, no README/gitignore — then use its URL above.)

## Deploy to Vercel

Easiest path, no CLI needed:

1. github.com → New repository → import this repo (or push it there first, per above).
2. vercel.com → Add New… → Project → Import the GitHub repo.
3. Framework preset: **Other** (static site, no build command, no output directory override needed — root contains the HTML files directly).
4. Deploy.

Or with the CLI, from inside this folder:

```bash
npm i -g vercel
vercel login
vercel --prod
```
