/* MTIVE site — the 7 chapters + footer (Direction C, hi-fi) */
import React from 'react';
import content from '../content.json';
import { useExitOffset, usePinProgress, useEnterProgress, REDUCE, ScrubText } from './scroll.jsx';
import { Reveal, MotionLines, ChapterMeta, EdgeLoop, scrollToId } from './parts.jsx';
const { useRef: useRefCh } = React;

function HeroChapter() {
  const c = content.hero;
  const ref = useRefCh(null);
  const { offset, vh } = useExitOffset(ref);
  const bgY = offset * 0.22;
  const fade = Math.max(0, 1 - offset / (vh * 0.72));
  const contentY = -offset * 0.07;
  return (
    <header className="hero" id="home" data-screen-label="01 · Hero" ref={ref}>
      <div className="hero-bg" style={{ transform: `translate3d(0, ${bgY}px, 0) scale(1.12)` }} />
      <div className="wrap" style={{ opacity: fade, transform: `translate3d(0, ${contentY}px, 0)` }}>
        <Reveal as="span" className="hero-eyebrow eyebrow"><span className="dot" />{c.eyebrow}</Reveal>
        <h1>
          <Reveal className="l1" style={{ display: 'block' }}>{c.headline.line1}</Reveal>
          <Reveal className="l2" style={{ display: 'block' }} delay={90}>{c.headline.line2}</Reveal>
        </h1>
        <Reveal className="hero-lead" delay={160}>
          {c.lead}
        </Reveal>
        <Reveal className="hero-cta" delay={230}>
          <button className="btn" onClick={() => scrollToId(c.ctaPrimary.target)}>{c.ctaPrimary.label}</button>
          <button className="btn btn--ghost" onClick={() => scrollToId(c.ctaSecondary.target)}>{c.ctaSecondary.label}</button>
        </Reveal>
      </div>
      <div className="hero-scroll" style={{ opacity: fade }}><Reveal as="span" delay={400}>{c.scrollHint}</Reveal></div>
    </header>
  );
}

function ProblemChapter() {
  const c = content.problem;
  return (
    <section className="ch" id="problem" data-screen-label="02 · Problem">
      <div className="wrap">
        <ChapterMeta idx="02" label={c.metaLabel} />
        <ScrubText as="h2" className="h-sec" style={{ maxWidth: '17ch' }} text={c.headline} />
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          {c.lead}
        </Reveal>
        <div className="readouts">
          {c.readouts.map((r, k) => (
            <Reveal className="readout" key={r.idx} delay={k * 70}>
              <span className="ro-idx">{r.idx}</span>
              <div>
                <span className="ro-sys">{r.system}</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityChapter() {
  const c = content.capability;
  return (
    <section className="ch" id="capability" data-screen-label="03 · Capability">
      <div className="wrap">
        <ChapterMeta idx="03" label={c.metaLabel} />
        <Reveal as="h2" className="h-sec" style={{ maxWidth: '16ch' }}>{c.headline}</Reveal>
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          {c.lead}
        </Reveal>
        <div className="cap-grid">
          {c.cards.map((card, k) => (
            <Reveal className="cap" key={card.num} delay={k * 60}>
              <div className="cap-top">
                <span className="num">{card.num}</span>
                <span className="num">{card.category}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnologyChapter({ motion }) {
  const c = content.technology;
  const pinRef = useRefCh(null);
  const scrub = motion && !REDUCE;
  const progress = usePinProgress(pinRef);
  return (
    <section className="tech" id="technology" data-screen-label="04 · Technology">
      <div ref={pinRef} className={`tech-pin ${scrub ? 'is-pin' : 'is-flat'}`}>
        <div className="tech-stage">
          <div className="wrap">
            <ChapterMeta idx="04" label={c.metaLabel} />
            <h2 className="h-sec tech-h">{c.headline}</h2>
            <EdgeLoop progress={scrub ? progress : null} motion={motion} />
          </div>
        </div>
      </div>
      <div className="tech-after">
        <Reveal className="lead tech-lead">
          {c.lead}
        </Reveal>
        <div className="tech-stack">
          {c.stack.map((row, k) => (
            <Reveal className="tech-row" key={row.idx} delay={k * 50}>
              <span className="tr-idx">{row.idx}</span>
              <h4>{row.title}</h4>
              <p>{row.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChapter() {
  const c = content.why;
  return (
    <section className="ch" id="why" data-screen-label="05 · Why MTIVE">
      <div className="wrap">
        <ChapterMeta idx="05" label={c.metaLabel} />
        <ScrubText as="h2" className="h-sec" style={{ maxWidth: '18ch' }} text={c.headline} />
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          {c.lead}
        </Reveal>
        <div className="why-list">
          {c.differentiators.map((d, k) => (
            <Reveal className="why-row" key={k} delay={k * 60}>
              <span className="wr-idx">{`0${k + 1}`}</span>
              <div className="wr-t"><b>{d.bold}</b><span>{d.rest}</span></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanyChapter() {
  const c = content.company;
  return (
    <section className="ch" id="company" data-screen-label="06 · Company">
      <div className="wrap">
        <ChapterMeta idx="06" label={c.metaLabel} />
        <Reveal as="h2" className="h-sec" style={{ maxWidth: '14ch' }}>{c.headline}</Reveal>
        <Reveal className="lead" delay={80} style={{ marginTop: 26 }}>
          {c.lead}
        </Reveal>
        <div className="team-grid">
          {c.team.map((m, i) => (
            <Reveal className="member" key={i} delay={i * 60}>
              <div className={`portrait${m.photo ? ' has-photo' : ''}`}>
                {m.photo
                  ? <img src={m.photo} alt={m.name} />
                  : <span className="ph-l">PORTRAIT</span>}
              </div>
              <div>
                <div className="m-name">{m.name}</div>
                <div className="m-role">{m.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="credential" delay={120}>
          <span className="mt-tag">{c.credential.tag}</span>
          <span style={{ fontFamily: 'var(--mt-font-display)', fontSize: 20, fontWeight: 600 }}>{c.credential.text}</span>
        </Reveal>
      </div>
    </section>
  );
}

function ContactChapter() {
  const c = content.contact;
  const ref = useRefCh(null);
  const p = useEnterProgress(ref, 1.0, 0.2);
  const bgY = (1 - p) * 48;
  return (
    <section className="ch closing" id="contact" data-screen-label="07 · Contact" ref={ref}>
      <div className="hero-bg" style={{ transform: `translate3d(0, ${bgY}px, 0) scale(1.1)` }} />
      <div className="wrap">
        <ChapterMeta idx="07" label={c.metaLabel} />
        <Reveal as="h2">{c.headline}</Reveal>
        <Reveal className="lead" delay={90} style={{ marginTop: 26 }}>
          {c.lead}
        </Reveal>
        <Reveal className="contact-line" delay={160}>
          <a className="email" href={`mailto:${c.email}`}>{c.email}</a>
          <button className="btn" onClick={() => { window.location.href = `mailto:${c.email}`; }}>{c.ctaLabel}</button>
        </Reveal>
        <MotionLines style={{ marginTop: 56, maxWidth: 460 }} />
      </div>
    </section>
  );
}

function SiteFooter() {
  const c = content.footer;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="fb-top"><img src="/assets/mark-white.png" alt="MTIVE" /><span className="wm">{c.brand}</span></div>
            <p>{c.tagline}</p>
          </div>
          {c.columns.map((col) => (
            <div className="footer-col" key={col.heading}>
              <span className="eyebrow">{col.heading}</span>
              <ul>{col.links.map((l) => (
                <li key={l.label}><a onClick={l.target ? () => scrollToId(l.target) : undefined}>{l.label}</a></li>
              ))}</ul>
            </div>
          ))}
        </div>
        {c.compliance && (
          <div className="footer-compliance">
            <span className="eyebrow">{c.compliance.heading}</span>
            <div className="fc-grid">
              {c.compliance.groups.map((g) => (
                <div className="fc-group" key={g.heading}>
                  <span className="fc-group-head">{g.heading}</span>
                  <dl>
                    {g.items.map((it) => (
                      <div className="fc-row" key={it.label}>
                        <dt>{it.label}</dt>
                        <dd>{it.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="footer-bar">
          <span>{c.bottom.left}</span>
          <span>{c.bottom.right}</span>
        </div>
      </div>
    </footer>
  );
}

export { HeroChapter, ProblemChapter, CapabilityChapter, TechnologyChapter, WhyChapter, CompanyChapter, ContactChapter, SiteFooter };
