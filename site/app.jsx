/* MTIVE site — app shell: nav state, active-chapter tracking, Tweaks */
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles.css';
import { useTweaks, TweaksPanel, TweakSection, TweakToggle } from './tweaks-panel.jsx';
import { CHAPTERS, Nav, ChapterNav } from './parts.jsx';
import {
  HeroChapter, ProblemChapter, CapabilityChapter, TechnologyChapter,
  WhyChapter, CompanyChapter, ContactChapter, SiteFooter,
} from './chapters.jsx';
const { useState: useS, useEffect: useE, useRef: useR } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "motion": true,
  "field": true,
  "snap": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stuck, setStuck] = useS(false);
  const [activeId, setActiveId] = useS('home');

  // sticky nav
  useE(() => {
    const onScroll = () => setStuck(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // active chapter via scroll position (works without IntersectionObserver)
  useE(() => {
    const ids = CHAPTERS.map(c => c.id);
    const onScroll = () => {
      const probe = window.innerHeight * 0.4;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  // snapping toggle on <html>
  useE(() => {
    document.documentElement.style.scrollSnapType = t.snap ? 'y proximity' : 'none';
  }, [t.snap]);

  const rootCls = ['mt-site', t.motion ? '' : 'no-motion', t.field ? '' : 'no-field'].join(' ').trim();

  return (
    <div className={rootCls}>
      <Nav stuck={stuck} activeId={activeId} />
      <ChapterNav activeId={activeId} />
      <main>
        <HeroChapter />
        <ProblemChapter />
        <CapabilityChapter />
        <TechnologyChapter motion={t.motion} />
        <WhyChapter />
        <CompanyChapter />
        <ContactChapter />
        <SiteFooter />
      </main>

      <TweaksPanel>
        <TweakSection label="Motion" />
        <TweakToggle label="Reveals & loop animation" value={t.motion} onChange={(v) => setTweak('motion', v)} />
        <TweakToggle label="Scroll snapping" value={t.snap} onChange={(v) => setTweak('snap', v)} />
        <TweakSection label="Surface" />
        <TweakToggle label="Halftone field" value={t.field} onChange={(v) => setTweak('field', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
