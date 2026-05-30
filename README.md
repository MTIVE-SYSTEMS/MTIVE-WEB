# MTIVE — Website

Marketing site for **MTIVE**: GPS-denied command & control for contested environments.

This is the hi-fi build of **Direction C — Chapter Panels**: a single-page,
seven-chapter scroll-snap experience rendered in the dark MTIVE design system
(black canvas, Big Shoulders display type, JetBrains Mono telemetry labels,
strictly monochrome with blue reserved for the secure edge-loop surface).

## Chapters

1. **Hero** — halftone field under a black scrim, parallax + exit-fade.
2. **Problem** — three telemetry-style readouts (NAV / C2 / LOOP).
3. **Capability** — four hairline-bordered capability cards.
4. **Technology** — Apple-style **pinned scroll story**: the SENSE → FUSE →
   DECIDE → ACT edge loop scrubs forward with scroll position, inside the blue
   "ON-DEVICE · EDGE" boundary. Followed by the five-row tech stack.
5. **Why MTIVE** — four differentiators with word-by-word brightening headline.
6. **Company · Team** — four portrait placeholders + NVIDIA Inception credential.
7. **Contact** — closing slogan, `operations@mtive.tech`, motion-lines.

A fixed top nav blurs in on scroll; a HUD-style right-rail tracks the active
chapter. All motion respects `prefers-reduced-motion` and the in-page Tweaks
panel (motion, scroll-snap, halftone field).

## Tech

**Vite + React 18.** JSX is compiled ahead of time (no in-browser Babel), so the
production bundle ships only the minified React runtime.

```bash
npm install      # install dependencies
npm run dev      # dev server with HMR  → http://localhost:5173
npm run build    # production build      → dist/
npm run preview  # serve the built dist/ locally
```

## Deployment (Vercel)

Zero config beyond the standard React/Vite preset:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework Preset | Vite            |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |

## Structure

```
index.html          Vite entry (loads /site/app.jsx as a module)
vite.config.js      Vite + @vitejs/plugin-react
tokens.css          design tokens (color, type, spacing, motion)
site/
  styles.css        Direction C layout + edge-loop diagram styles
  scroll.jsx        scroll-scrub engine (parallax, pin progress, scrub text)
  parts.jsx         Reveal, Nav, ChapterNav, animated EdgeLoop
  chapters.jsx      the seven chapters + footer
  app.jsx           entry module: app shell, nav state, mounts <App>, imports CSS
  tweaks-panel.jsx  floating dev-tweaks panel (hidden in production)
public/
  assets/           brand mark + halftone field  → served at /assets
  fonts/            Big Shoulders opticals        → served at /fonts
```

## Open items

- **Real team** — replace the four "Name 1–4" placeholders with real
  names / roles / headshots.
- **Template split** — if this grows into a multi-page site, the chapters map
  cleanly onto Home / Capability / Technology / Company / Contact pages.
