/* MTIVE site — the 7 chapters + footer (Direction C, hi-fi) */
import React from 'react';
import { useExitOffset, usePinProgress, useEnterProgress, REDUCE, ScrubText } from './scroll.jsx';
import { Reveal, MotionLines, ChapterMeta, EdgeLoop, scrollToId } from './parts.jsx';
const { useRef: useRefCh } = React;

function HeroChapter() {
  const ref = useRefCh(null);
  const { offset, vh } = useExitOffset(ref);
  const bgY = offset * 0.22;
  const fade = Math.max(0, 1 - offset / (vh * 0.72));
  const contentY = -offset * 0.07;
  return (
    <header className="hero" id="home" data-screen-label="01 · Hero" ref={ref}>
      <div className="hero-bg" style={{ transform: `translate3d(0, ${bgY}px, 0) scale(1.12)` }} />
      <div className="wrap" style={{ opacity: fade, transform: `translate3d(0, ${contentY}px, 0)` }}>
        <Reveal as="span" className="hero-eyebrow eyebrow"><span className="dot" />GPS-Denied Command &amp; Control</Reveal>
        <h1>
          <Reveal className="l1" style={{ display: 'block' }}>Blind the satellites.</Reveal>
          <Reveal className="l2" style={{ display: 'block' }} delay={90}>We still fight.</Reveal>
        </h1>
        <Reveal className="hero-lead" delay={160}>
          When jamming starts and the satellites go dark, most autonomous systems become flying liabilities. MTIVE is the command and control layer that keeps allied assets coordinated, navigating, and operational when GPS is denied, spoofed, or gone.
        </Reveal>
        <Reveal className="hero-cta" delay={230}>
          <button className="btn" onClick={() => scrollToId('capability')}>See the capability</button>
          <button className="btn btn--ghost" onClick={() => scrollToId('contact')}>Contact</button>
        </Reveal>
      </div>
      <div className="hero-scroll" style={{ opacity: fade }}><Reveal as="span" delay={400}>Scroll · 06 below</Reveal></div>
    </header>
  );
}

function ProblemChapter() {
  const rows = [
    ['01', 'NAV — GNSS DEPENDENT', 'Navigation dies with the signal.', 'Conventional autonomy is tethered to GNSS. Deny the satellite, and the asset is blind.'],
    ['02', 'C2 — FRAGMENTED', 'Command breaks at the seams.', 'National systems do not interoperate. In a coalition operation, a commander stares at six screens that do not share a picture.'],
    ['03', 'LOOP — DELAYED', 'Latency kills the loop.', 'Cloud-dependent decision-making introduces delay between detection and action — delay the adversary exploits.'],
  ];
  return (
    <section className="ch" id="problem" data-screen-label="02 · Problem">
      <div className="wrap">
        <ChapterMeta idx="02" label="The Problem" />
        <ScrubText as="h2" className="h-sec" style={{ maxWidth: '17ch' }} text="Modern autonomy has a single point of failure." />
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          Across the Baltic, the eastern flank, and every contested theatre, GPS jamming has moved from rare event to daily condition. The problem is not a lack of hardware — it is that hardware was designed to trust a signal the adversary controls, and cannot talk to each other when it is taken away.
        </Reveal>
        <div className="readouts">
          {rows.map(([i, sys, t, d], k) => (
            <Reveal className="readout" key={i} delay={k * 70}>
              <span className="ro-idx">{i}</span>
              <div>
                <span className="ro-sys">{sys}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityChapter() {
  const caps = [
    ['01', 'NAV', 'GPS-Denied Navigation', 'SLAM and sensor-fusion based positioning. Assets navigate by what they see and sense, not by a satellite the adversary can switch off.'],
    ['02', 'COMPUTE', 'Edge-Native Decision Loop', 'Inference and coordination happen on-device, at the operational edge. Sub-10ms response, no dependence on a cloud that may not be reachable.'],
    ['03', 'C2', 'Resilient Command Layer', 'A coordination layer that binds heterogeneous assets into one picture — and survives the loss of any single node, including the central one.'],
    ['04', 'COMMS', 'Multi-Layer Comms Resilience', 'Frequency hopping, multi-band fallback, and optical links engineered to hold a command path open through active electronic warfare.'],
  ];
  return (
    <section className="ch" id="capability" data-screen-label="03 · Capability">
      <div className="wrap">
        <ChapterMeta idx="03" label="The Capability" />
        <Reveal as="h2" className="h-sec" style={{ maxWidth: '16ch' }}>Command that does not depend on the sky.</Reveal>
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          MTIVE binds disconnected sensors and assets into one coordinated, sovereign system. It does not replace existing platforms — it keeps them fighting when the network does not.
        </Reveal>
        <div className="cap-grid">
          {caps.map(([n, cat, t, d], k) => (
            <Reveal className="cap" key={n} delay={k * 60}>
              <div className="cap-top">
                <span className="num">{n}</span>
                <span className="num">{cat}</span>
              </div>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnologyChapter({ motion }) {
  const pinRef = useRefCh(null);
  const scrub = motion && !REDUCE;
  const progress = usePinProgress(pinRef);
  const stack = [
    ['01', 'Edge Compute', 'NVIDIA Jetson-class processing for on-device inference and sensor fusion. No round-trip to a server that may not be there.'],
    ['02', 'Sensor Fusion', 'LiDAR, thermal, RGB, mmWave, and UWB fused into a single spatial picture — redundant by design.'],
    ['03', 'Resilient Comms', 'Frequency-hopping RF, multi-band fallback, free-space optical, and fiber backbone — a path held open under jamming.'],
    ['04', 'Hardened Software', 'Encrypted, authenticated middleware. Every node is treated as critical infrastructure, not a trusted endpoint.'],
    ['05', 'Digital Twin Validation', 'Fault injection and denied-signal conditions validated in a virtual theatre before anything flies.'],
  ];
  return (
    <section className="tech" id="technology" data-screen-label="04 · Technology">
      <div ref={pinRef} className={`tech-pin ${scrub ? 'is-pin' : 'is-flat'}`}>
        <div className="tech-stage">
          <div className="wrap">
            <ChapterMeta idx="04" label="Technology · The Edge Loop" />
            <h2 className="h-sec tech-h">Built for the environment, not the demo.</h2>
            <EdgeLoop progress={scrub ? progress : null} motion={motion} />
          </div>
        </div>
      </div>
      <div className="tech-after">
        <Reveal className="lead tech-lead">
          The stack is engineered around one assumption: the signal will be taken away. Every layer degrades gracefully and keeps operating when conditions are hostile.
        </Reveal>
        <div className="tech-stack">
          {stack.map(([i, t, d], k) => (
            <Reveal className="tech-row" key={i} delay={k * 50}>
              <span className="tr-idx">{i}</span>
              <h4>{t}</h4>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChapter() {
  const diff = [
    ['Engineered for GPS-denied operation', ' as the default condition, not an edge case.'],
    ['Edge-native', ' — no dependence on cloud or rear connectivity.'],
    ['Sovereign and ITAR-free', ' — accessible to allied markets locked out of US systems.'],
    ['Interoperable', ' — binds existing assets rather than demanding replacement.'],
  ];
  return (
    <section className="ch" id="why" data-screen-label="05 · Why MTIVE">
      <div className="wrap">
        <ChapterMeta idx="05" label="Why MTIVE" />
        <ScrubText as="h2" className="h-sec" style={{ maxWidth: '18ch' }} text="Sovereign by design. Independent by necessity." />
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          Europe is rearming, but the systems it depends on are not its own. MTIVE is the alternative: a sovereign, ITAR-free command and control layer engineered for the one condition that defines the modern battlefield — the loss of the signal.
        </Reveal>
        <div className="why-list">
          {diff.map(([b, s], k) => (
            <Reveal className="why-row" key={k} delay={k * 60}>
              <span className="wr-idx">{`0${k + 1}`}</span>
              <div className="wr-t"><b>{b}</b><span>{s}</span></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanyChapter() {
  return (
    <section className="ch" id="company" data-screen-label="06 · Company">
      <div className="wrap">
        <ChapterMeta idx="06" label="Company · Team" />
        <Reveal as="h2" className="h-sec" style={{ maxWidth: '14ch' }}>Engineers, not slideware.</Reveal>
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          MTIVE works at the intersection of edge AI, autonomous systems, and cyber-physical security — and ships systems built to operate, not to demo.
        </Reveal>
        <div className="team-grid">
          {[1, 2, 3, 4].map((i) => (
            <Reveal className="member" key={i} delay={(i - 1) * 60}>
              <div className="portrait"><span className="ph-l">PORTRAIT</span></div>
              <div>
                <div className="m-name">Name {i}</div>
                <div className="m-role">Role · Discipline</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="credential" delay={120}>
          <span className="mt-tag">Credential</span>
          <span style={{ fontFamily: 'var(--mt-font-display)', fontSize: 20, fontWeight: 600 }}>Member, NVIDIA Inception Program</span>
        </Reveal>
      </div>
    </section>
  );
}

function ContactChapter() {
  const ref = useRefCh(null);
  const p = useEnterProgress(ref, 1.0, 0.2);
  const bgY = (1 - p) * 48;
  return (
    <section className="ch closing" id="contact" data-screen-label="07 · Contact" ref={ref}>
      <div className="hero-bg" style={{ transform: `translate3d(0, ${bgY}px, 0) scale(1.1)` }} />
      <div className="wrap">
        <ChapterMeta idx="07" label="Contact" />
        <Reveal as="h2">The grid goes down. Command stays up.</Reveal>
        <Reveal className="lead" delay={90} style={{ marginTop: 26 }}>
          If you are building for contested environments — or investing in those who do — let us talk.
        </Reveal>
        <Reveal className="contact-line" delay={160}>
          <a className="email" href="mailto:operations@mtive.tech">operations@mtive.tech</a>
          <button className="btn" onClick={() => { window.location.href = 'mailto:operations@mtive.tech'; }}>Contact operations</button>
        </Reveal>
        <MotionLines style={{ marginTop: 56, maxWidth: 460 }} />
      </div>
    </section>
  );
}

function SiteFooter() {
  const nav = ['Home', 'Capability', 'Technology', 'Company', 'Contact'];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="fb-top"><img src="/assets/mark-white.png" alt="MTIVE" /><span className="wm">MTIVE</span></div>
            <p>GPS-denied command and control for contested environments.</p>
          </div>
          <div className="footer-col">
            <span className="eyebrow">Navigate</span>
            <ul>{nav.map((n) => <li key={n}><a onClick={() => scrollToId(n === 'Home' ? 'home' : n.toLowerCase())}>{n}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <span className="eyebrow">Partnerships</span>
            <ul><li><a>NVIDIA Inception Program</a></li></ul>
          </div>
        </div>
        <div className="footer-bar">
          <span>MTIVE · 2026</span>
          <span>Autonomous. Resilient. Sovereign.</span>
        </div>
      </div>
    </footer>
  );
}

export { HeroChapter, ProblemChapter, CapabilityChapter, TechnologyChapter, WhyChapter, CompanyChapter, ContactChapter, SiteFooter };
