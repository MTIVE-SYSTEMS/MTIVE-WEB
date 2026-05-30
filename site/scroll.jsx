/* MTIVE site — scroll-scrub engine (Apple-style scroll-driven animation).
   Pure scroll-event + requestAnimationFrame math (no IntersectionObserver,
   which does not fire reliably in some embed harnesses).
   Every hook degrades to a finished/neutral state under reduced-motion. */
import React from 'react';
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

const REDUCE = (typeof window !== 'undefined' && window.matchMedia)
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/* shared rAF-throttled scroll subscription */
function useRafScroll(handler) {
  const cb = useRefS(handler);
  cb.current = handler;
  useEffectS(() => {
    let raf = 0;
    const run = () => { raf = 0; cb.current(); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    cb.current();
    // settle once after fonts/layout
    const t = setTimeout(() => cb.current(), 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* progress 0..1 across a TALL pinned section (height > viewport).
   0 when the section top reaches the viewport top, 1 when its bottom
   reaches the viewport bottom. Drives pinned scroll stories. */
function usePinProgress(ref) {
  const [p, setP] = useStateS(REDUCE ? 1 : 0);
  useRafScroll(() => {
    if (REDUCE) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const total = r.height - vh;
    let prog = total > 0 ? (-r.top) / total : (r.top <= 0 ? 1 : 0);
    setP(clamp01(prog));
  });
  return p;
}

/* progress 0..1 as an element travels up through the viewport.
   Starts when the element top crosses `start`*vh, completes at `end`*vh. */
function useEnterProgress(ref, start = 0.9, end = 0.35) {
  const [p, setP] = useStateS(REDUCE ? 1 : 0);
  useRafScroll(() => {
    if (REDUCE) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const a = vh * start, b = vh * end;
    setP(clamp01((a - r.top) / (a - b)));
  });
  return p;
}

/* pixels scrolled since a section's top passed the viewport top (>=0),
   plus current viewport height. For hero parallax / exit fade. */
function useExitOffset(ref) {
  const [s, setS] = useStateS({ offset: 0, vh: typeof window !== 'undefined' ? window.innerHeight : 800 });
  useRafScroll(() => {
    if (REDUCE) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    setS({ offset: Math.max(0, -r.top), vh });
  });
  return s;
}

/* Headline whose words brighten dim→white as it scrolls through view. */
function ScrubText({ text, as = 'h2', className = '', style }) {
  const ref = useRefS(null);
  const p = useEnterProgress(ref, 0.92, 0.4);
  const words = text.split(' ');
  const n = words.length;
  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((w, i) => {
        const wp = clamp01(p * (n + 1) - i);     // staggered per word
        const c = Math.round(96 + (255 - 96) * wp);
        return (
          <span key={i} style={{ color: `rgb(${c},${c},${c})`, transition: 'color 90ms linear' }}>
            {w}{i < n - 1 ? ' ' : ''}
          </span>
        );
      })}
    </Tag>
  );
}

export { REDUCE, clamp01, usePinProgress, useEnterProgress, useExitOffset, ScrubText };
