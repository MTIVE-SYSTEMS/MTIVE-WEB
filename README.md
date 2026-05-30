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

Static site — no build step. React 18 + Babel Standalone are loaded from CDN and
the JSX is transpiled in the browser. Open `index.html` (serve over HTTP so the
fonts and `fetch`-loaded scripts resolve):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Structure

```
index.html          entry; loads styles + JSX modules
tokens.css          design tokens (color, type, spacing, motion)
site/
  styles.css        Direction C layout + edge-loop diagram styles
  scroll.jsx        scroll-scrub engine (parallax, pin progress, scrub text)
  parts.jsx         Reveal, Nav, ChapterNav, animated EdgeLoop
  chapters.jsx      the seven chapters + footer
  app.jsx           app shell: sticky nav, active-chapter tracking, Tweaks
  tweaks-panel.jsx  floating dev-tweaks panel (hidden in production)
assets/             brand mark + halftone field
fonts/              Big Shoulders (text + 60pt display opticals)
```

## Open items

- **Real team** — replace the four "Name 1–4" placeholders with real
  names / roles / headshots.
- **Template split** — if this grows into a multi-page site, the chapters map
  cleanly onto Home / Capability / Technology / Company / Contact pages.
