import React, { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { aboutData } from '../data/portfolioData';
import RoughenFilter from '../components/doodles/RoughenFilter';
import './about.css';

// ─── Data: annotation callouts linked to doodle part IDs ───────────────────
const CALLOUTS = [
  {
    id: 'education',
    label: 'EDUCATION',
    text: 'B.Sc. Computer Science, EMEA College',
    targetId: 'doodle-desk',
    notePos: { top: '4%', left: '2%' },
  },
  {
    id: 'location',
    label: 'LOCATION',
    text: 'Kerala, India',
    targetId: 'doodle-plant',
    notePos: { top: '4%', right: '2%' },
  },
  {
    id: 'project',
    label: 'CURRENT PROJECT',
    text: 'CamMap — interactive campus navigation',
    targetId: 'doodle-screen',
    notePos: { bottom: '8%', left: '2%' },
  },
  {
    id: 'community',
    label: 'COMMUNITY',
    text: 'Active NSS Volunteer',
    targetId: 'doodle-mug',
    notePos: { bottom: '8%', right: '2%' },
  },
];

// ─── The main developer scene SVG ──────────────────────────────────────────
function DevSceneSVG({ activeId }) {
  const shouldReduceMotion = useReducedMotion();

  const drawV = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (d) => ({
      pathLength: 1,
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            pathLength: { delay: d || 0, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            opacity: { delay: d || 0, duration: 0.15 },
          },
    }),
  };

  const isActive = (id) => activeId === id;

  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="about-scene-svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* roughen-scene filter removed: SVG filters on animated m.path elements
          force per-frame GPU rasterization. The hand-drawn look is preserved by
          curved/slightly-imperfect path data. Static doodles use #roughen via RoughenFilter. */}

      {/* ── Desk surface ── */}
      <m.path
        id="doodle-desk"
        d="M 40 200 H 280 V 210 Q 280 216, 274 216 H 46 Q 40 216, 40 210 Z"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--bg-raised)"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.05}
        style={{
          stroke: isActive('education') ? 'var(--accent-ink)' : 'var(--ink)',
          transition: 'stroke 0.25s',
        }}
      />

      {/* ── Desk legs ── */}
      <m.path
        d="M 72 216 L 68 260 M 248 216 L 252 260"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.12}
      />

      {/* ── Chair ── */}
      <m.path
        d="M 80 200 H 158 V 190 Q 158 180, 152 180 H 86 Q 80 180, 80 190 Z"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--bg-raised)"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.15}
      />
      <m.path
        d="M 92 180 L 90 220 M 146 180 L 148 220"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.2}
      />

      {/* ── Laptop base ── */}
      <m.path
        d="M 120 200 H 240 L 244 196 H 116 Z"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--bg-raised)"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.22}
      />

      {/* ── Laptop screen ── */}
      <m.path
        id="doodle-screen"
        d="M 130 196 L 136 130 H 234 L 240 196 Z"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isActive('project') ? 'rgba(198,242,78,0.12)' : 'var(--bg-raised)'}
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.28}
        style={{ transition: 'fill 0.25s' }}
      />

      {/* ── Code lines on screen ── */}
      <m.path
        d="M 148 152 L 160 148 L 148 158 M 168 150 H 220 M 168 160 H 210 M 168 170 H 216 M 148 172 L 156 168"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.42}
      />
      <m.path
        d="M 148 180 H 180 M 186 180 H 205"
        stroke="var(--ink-faint)"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.5}
      />

      {/* ── Developer character (simple) ── */}
      {/* Head */}
      <m.circle
        cx="119"
        cy="162"
        r="18"
        stroke="var(--ink)"
        strokeWidth="2"
        fill="var(--bg-raised)"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.32}
      />
      {/* Hair */}
      <m.path
        d="M 102 156 C 104 146, 112 142, 120 143 C 128 142, 135 146, 136 156"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="var(--ink)"
        fillOpacity="0.08"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.38}
      />
      {/* Face: eyes */}
      <m.circle cx="114" cy="162" r="2" fill="var(--ink)"
        variants={drawV} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.44} />
      <m.circle cx="124" cy="162" r="2" fill="var(--ink)"
        variants={drawV} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.44} />
      {/* Face: smile */}
      <m.path
        d="M 113 168 Q 119 174, 125 168"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.48}
      />
      {/* Body */}
      <m.path
        d="M 102 178 Q 100 194, 100 200 M 136 178 Q 138 194, 138 200"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.36}
      />
      {/* Arms on keyboard */}
      <m.path
        d="M 102 188 Q 118 198, 138 196 M 136 188 Q 148 198, 168 196"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.42}
      />

      {/* ── Mug / Tea ── */}
      <m.path
        id="doodle-mug"
        d="M 62 188 L 66 204 H 84 L 88 188 Z"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isActive('community') ? 'rgba(198,242,78,0.15)' : 'var(--bg-raised)'}
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.55}
        style={{ transition: 'fill 0.25s' }}
      />
      {/* Mug handle */}
      <m.path
        d="M 88 192 Q 96 192, 96 196 Q 96 202, 88 202"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.6}
      />
      {/* Tea color */}
      <m.path
        d="M 64 196 Q 75 199, 86 196"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.65}
      />
      {/* Steam */}
      <m.path
        d="M 70 186 Q 67 180, 70 174 M 78 184 Q 82 178, 78 172"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.7}
      />

      {/* ── Plant ── */}
      <m.path
        id="doodle-plant"
        d="M 268 198 L 272 210 H 286 L 290 198 Z"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isActive('location') ? 'rgba(198,242,78,0.15)' : 'var(--bg-raised)'}
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.58}
        style={{ transition: 'fill 0.25s' }}
      />
      {/* Stem */}
      <m.path
        d="M 279 198 Q 279 176, 279 160"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.62}
      />
      {/* Leaves */}
      <m.path
        d="M 279 180 C 268 172, 262 162, 268 156 C 272 163, 276 172, 279 180 Z"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="rgba(198,242,78,0.18)"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.67}
      />
      <m.path
        d="M 279 170 C 290 162, 296 152, 290 146 C 286 153, 282 162, 279 170 Z"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="rgba(22,21,15,0.06)"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.72}
      />

      {/* ── Speech bubble from character ── */}
      <m.path
        d="M 142 147 C 142 139, 147 134, 156 134 L 216 134 C 225 134, 230 139, 230 147 L 230 167 C 230 175, 225 180, 216 180 L 164 180 L 150 188 L 157 180 L 156 180 C 147 180, 142 175, 142 167 Z"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--bg)"
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.76}
      />

      {/* ── Speech text inside bubble (centered with at least 12px padding on every side) ── */}
      <m.text
        x="186"
        y="157"
        textAnchor="middle"
        fontFamily="var(--font-handwriting)"
        fontSize="11"
        fontWeight="600"
        fill="var(--ink)"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        variants={drawV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.82}
      >
        <tspan x="186" dy="0">let's build</tspan>
        <tspan x="186" dy="12">something!</tspan>
      </m.text>

      {/* ── Subtle lime highlight dot on doodle when callout is hovered (no numbers) ── */}
      {CALLOUTS.map((c) => {
        const pos = {
          education: { cx: 160, cy: 208 },
          location: { cx: 279, cy: 162 },
          project: { cx: 185, cy: 164 },
          community: { cx: 75, cy: 196 },
        }[c.id];
        if (!pos) return null;
        const active = isActive(c.id);
        return (
          <circle
            key={c.id}
            cx={pos.cx}
            cy={pos.cy}
            r={active ? 4 : 0}
            fill="var(--accent)"
            stroke="var(--accent-ink)"
            strokeWidth="1.5"
            style={{
              transition: 'r 0.2s ease, opacity 0.2s ease',
              opacity: active ? 1 : 0,
            }}
            aria-hidden="true"
          />
        );
      })}
    </svg>
  );
}

// ─── Callout note card ──────────────────────────────────────────────────────
function CalloutNote({ callout, isActive, onHover, index }) {
  return (
    <m.div
      className={`about-callout-note ${isActive ? 'is-active' : ''}`}
      onMouseEnter={() => onHover(callout.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(callout.id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      role="note"
      aria-label={`${callout.label}: ${callout.text}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.08 * (index + 1), ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="about-callout-header">
        <span className="about-callout-dot" aria-hidden="true" />
        <span className="about-callout-label">{callout.label}</span>
      </div>
      <span className="about-callout-text">{callout.text}</span>
    </m.div>
  );
}

// ─── Main About component ───────────────────────────────────────────────────
export default function About() {
  const [activeCallout, setActiveCallout] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: shouldReduceMotion ? 0.01 : 0.45, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="about" className="editorial-section about-section" aria-labelledby="about-heading">
      {/* Shared roughen filter */}
      <RoughenFilter />

      {/* Paper grain */}
      <div className="about-grain-texture" aria-hidden="true" />

      <div className="container about-container">

        {/* ── Wayfinding ── */}
        <m.div className="about-wayfinding-row" {...fadeUp(0)}>
          <span className="about-eyebrow-number" aria-hidden="true">02</span>
          <h2 id="about-heading" className="about-eyebrow-label">About</h2>
          <span className="about-eyebrow-rule" aria-hidden="true" />
        </m.div>

        {/* ── Two-column: text left, sketch right ── */}
        <div className="about-editorial-grid">

          {/* LEFT: text column */}
          <div className="about-voice-column">

            {/* Big lede with lime marker highlights */}
            <m.p className="about-lede-line" {...fadeUp(0.06)}>
              CS student learning to{' '}
              <span className="about-highlight">build</span>
              {' '}things people{' '}
              <span className="about-highlight-dim">actually want to use.</span>
            </m.p>

            {/* Body paragraphs */}
            <m.div className="about-paragraphs" {...fadeUp(0.14)}>
              <p className="about-body-p">
                I'm an undergraduate based in Kerala, India, focusing on frontend development with React, JavaScript, and modern CSS. Rather than collecting frameworks, I care about understanding web fundamentals and building functional, responsive interfaces that hold up on real devices.
              </p>
              <p className="about-body-p">
                My primary project right now is CamMap, an interactive campus navigation web app. Alongside college coursework, I recently completed a 60-hour Python full-stack internship at Sysbreeze Technologies, study ethical hacking essentials through an online course, and contribute as an active NSS volunteer.
              </p>
            </m.div>

            {/* Context rail */}
            <m.dl
              className="about-context-rail"
              aria-label="Background context"
              {...fadeUp(0.22)}
            >
              {aboutData.contextRail.map((item) => (
                <div key={item.label} className="about-rail-row">
                  <dt className="about-rail-label">{item.label}</dt>
                  <dd className="about-rail-value">{item.value}</dd>
                </div>
              ))}
            </m.dl>

            {/* Corner doodles — pencil + ruler */}
            <div className="about-corner-doodles" aria-hidden="true">
              <svg viewBox="0 0 100 32" fill="none" className="about-pencil-svg">
                <path d="M 6 12 L 78 8 L 84 16 L 6 20 Z" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#roughen)" />
                <path d="M 78 8 L 90 12 L 84 16" fill="var(--accent)" stroke="var(--accent-ink)" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 6 12 L 2 16 L 6 20" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* RIGHT: sketch + callouts */}
          <div className="about-sketch-column">

            {/* Callout notes — top row */}
            <div className="about-callouts-top">
              {CALLOUTS.filter((_, i) => i < 2).map((c, i) => (
                <CalloutNote
                  key={c.id}
                  callout={c}
                  index={i}
                  isActive={activeCallout === c.id}
                  onHover={setActiveCallout}
                />
              ))}
            </div>

            {/* SVG scene */}
            <div className="about-scene-wrap">
              <DevSceneSVG activeId={activeCallout} />

              {/* Speech bubble text inside SVG is decorative; text version for a11y */}
              <p className="about-scene-caption sr-only">
                Hand-drawn illustration of a developer at a desk with a laptop, tea mug, and plant. Speech bubble reads: "let's build something!"
              </p>
            </div>

            {/* Callout notes — bottom row */}
            <div className="about-callouts-bottom">
              {CALLOUTS.filter((_, i) => i >= 2).map((c, i) => (
                <CalloutNote
                  key={c.id}
                  callout={c}
                  index={i + 2}
                  isActive={activeCallout === c.id}
                  onHover={setActiveCallout}
                />
              ))}
            </div>

            {/* Mobile: list of callouts with interactive highlight (plain lime dots, no digits) */}
            <ul className="about-callouts-mobile-list" aria-label="Background facts">
              {CALLOUTS.map((c) => {
                const isActive = activeCallout === c.id;
                return (
                  <li
                    key={c.id}
                    className={`about-callout-mobile-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveCallout((prev) => (prev === c.id ? null : c.id))}
                    onMouseEnter={() => setActiveCallout(c.id)}
                    onMouseLeave={() => setActiveCallout(null)}
                    onFocus={() => setActiveCallout(c.id)}
                    onBlur={() => setActiveCallout(null)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    aria-label={`${c.label}: ${c.text}`}
                  >
                    <span className="about-callout-dot" aria-hidden="true" />
                    <span>
                      <strong className="about-callout-label">{c.label}</strong>
                      {' — '}{c.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
