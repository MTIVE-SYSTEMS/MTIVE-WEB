/* MTIVE site — shared parts: reveal, motion-lines, nav, chapter rail, edge-loop diagram */
import React from 'react';
import content from '../content.json';
const { useState, useEffect, useRef, useCallback } = React;

const CHAPTERS = content.chapters;
const NAV = content.nav.links;

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* reveal-on-scroll wrapper.
   Resilient: animates via IntersectionObserver when it works, reveals
   in-view elements immediately at mount, and NEVER traps content
   invisible if IO is unavailable (probe decides) or motion is reduced. */
let __ioState = null;          // null = unknown, true/false once probed
const __ioWaiters = [];
function __flushIO() { while (__ioWaiters.length) __ioWaiters.shift()(__ioState); }
function __probeIO() {
  if (__ioState !== null) return;
  try {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
    document.body.appendChild(probe);
    let fired = false;
    const io = new IntersectionObserver(() => {
      fired = true; __ioState = true; io.disconnect(); probe.remove(); __flushIO();
    });
    io.observe(probe);
    setTimeout(() => { if (!fired) { __ioState = false; io.disconnect(); probe.remove(); __flushIO(); } }, 450);
  } catch (e) { __ioState = false; __flushIO(); }
}
function __onIO(fn) {
  if (__ioState !== null) fn(__ioState);
  else { __ioWaiters.push(fn); __probeIO(); }
}

function Reveal({ children, delay = 0, as = 'div', className = '', style, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setSeen(true); return; }
    // already on screen at mount → reveal now (covers the whole first fold)
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < (window.innerHeight || 800)) setSeen(true);
    let io;
    __onIO((works) => {
      if (!works) { setSeen(true); return; }      // IO dead → never trap content
      io = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) { setSeen(true); io.unobserve(el); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      io.observe(el);
    });
    return () => { if (io) io.disconnect(); };
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ ...(delay ? { transitionDelay: `${delay}ms` } : {}), ...style }} {...rest}>
      {children}
    </Tag>
  );
}

function MotionLines({ style }) {
  return (
    <Reveal className="mlines" style={style}>
      <i /><i /><i />
    </Reveal>
  );
}

/* chapter meta header: index · drawing rule · label */
function ChapterMeta({ idx, label }) {
  return (
    <Reveal className="ch-meta in">
      <span className="idx">{idx}</span>
      <span className="bar" />
      <span className="lbl">{label}</span>
    </Reveal>
  );
}

function Nav({ stuck, activeId }) {
  return (
    <nav className={`nav ${stuck ? 'is-stuck' : ''}`}>
      <div className="wrap nav-inner">
        <a className="nav-brand" onClick={() => scrollToId('home')} style={{ cursor: 'pointer' }}>
          <img src="/assets/mark-white.png" alt="MTIVE" />
          <span className="wm">{content.nav.brand}</span>
        </a>
        <div className="nav-links">
          {NAV.map(n => (
            <a key={n.id} className={activeId === n.id ? 'is-active' : ''} onClick={() => scrollToId(n.id)}>{n.label}</a>
          ))}
        </div>
        <div className="nav-cta">
          <button className="btn" style={{ fontSize: 14, padding: '10px 18px' }} onClick={() => scrollToId('contact')}>{content.nav.cta}</button>
        </div>
      </div>
    </nav>
  );
}

function ChapterNav({ activeId }) {
  return (
    <div className="cnav">
      {CHAPTERS.map(c => (
        <button key={c.id} className={activeId === c.id ? 'is-active' : ''} onClick={() => scrollToId(c.id)} title={c.label}>
          <span className="cn-label">{c.idx} · {c.label}</span>
          <span className="cn-dot" />
        </button>
      ))}
    </div>
  );
}

/* ===== Edge decision loop — SENSE → FUSE → DECIDE → ACT ===== */
const EDGE = content.technology.edgeLoop;
const LOOP = EDGE.steps.map((s) => ({ k: s.k, t: s.t }));
const STAGE_DESC = EDGE.steps.map((s) => s.desc);

/* progress: number 0..1 → scroll-scrubbed; null → auto-timer (or static when motion off). */
function EdgeLoop({ progress = null, motion = true }) {
  const [autoActive, setAutoActive] = useState(0);
  const scrub = progress != null;
  useEffect(() => {
    if (scrub || !motion) return;
    const id = setInterval(() => setAutoActive(a => (a + 1) % 4), 1150);
    return () => clearInterval(id);
  }, [scrub, motion]);

  let seg, activeIndex, frac, baseW, started;
  if (scrub) {
    seg = Math.max(0, Math.min(1, (progress - 0.08) / 0.82));
    const af = seg * 4;
    activeIndex = Math.min(3, Math.floor(af));
    frac = Math.min(1, af - activeIndex);
    baseW = seg;
    started = progress > 0.04;
  } else if (motion) {
    activeIndex = autoActive; frac = 1; baseW = 1; started = true;
  } else {
    activeIndex = 3; frac = 1; baseW = 1; started = true;
  }
  const meterFor = (i) => (i < activeIndex ? 1 : i === activeIndex ? (scrub ? frac : 1) : 0);
  const onFor = (i) => i <= activeIndex && started;
  const complete = scrub && seg >= 0.985;
  const pulseLeft = `calc(12.5% + ${(scrub ? seg : 1) * 75}%)`;

  return (
    <div className="loop-wrap">
      <div className="loop">
        <div className="loop-top">
          <span className="lt-left"><span className="tri">▽</span> {EDGE.boundaryLabel}</span>
          <span className="lt-right">{scrub ? `STEP ${Math.min(4, activeIndex + 1)} / 4` : EDGE.noUplink}</span>
        </div>
        <div className="denied" style={{ opacity: started ? 1 : 0.25 }}>
          <span className="ds-dot" />
          <span className="ds-x">{EDGE.denied.input}</span>
          <span>{EDGE.denied.state}</span>
          <span className="ds-rule" />
          <span style={{ color: 'var(--mt-graphite)' }}>{EDGE.denied.unaffected}</span>
        </div>
        <div className="loop-track">
          <div className="loop-line"><i style={{ transform: `scaleX(${baseW})` }} /></div>
          {scrub && started && <span className="loop-pulse" style={{ left: pulseLeft }} />}
          {LOOP.map((s, i) => (
            <div key={i} className={`loop-node ${onFor(i) ? 'is-on' : ''}`}>
              <div className="ln-box">
                <span className="ln-k">{s.k}</span>
                <span className="ln-t">{s.t}</span>
                <span className="ln-meter"><i style={{ transform: `scaleX(${meterFor(i)})` }} /></span>
              </div>
              <span className="ln-arrow">→</span>
            </div>
          ))}
        </div>
        <div className="loop-foot">
          <span className="lf-ret" style={{ opacity: complete || !scrub ? 1 : 0.4 }}>{EDGE.foot.continuous}</span>
          <span>·</span>
          <span>{EDGE.foot.latency}</span>
          <span>·</span>
          <span>{EDGE.foot.note}</span>
        </div>
      </div>
      <div className="loop-desc">
        <span key={scrub ? activeIndex : 'static'} className="loop-desc-in">
          {scrub ? STAGE_DESC[Math.max(0, Math.min(3, activeIndex))]
                 : EDGE.staticDesc}
        </span>
      </div>
    </div>
  );
}

export { CHAPTERS, NAV, scrollToId, Reveal, MotionLines, ChapterMeta, Nav, ChapterNav, EdgeLoop, LOOP };
