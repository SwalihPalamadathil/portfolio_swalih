/**
 * Doodle Kit — primitive SVG components for the sketchbook UI.
 *
 * All components:
 * - aria-hidden="true" (decorative)
 * - Accept: size, stroke, accent, className props
 * - Optional `draw` prop: if true, animate pathLength 0→1 with whileInView (once)
 * - 2px round-cap/join strokes, near-black ink by default
 */

import { m } from 'framer-motion';

const INK = 'var(--ink)';
const ACCENT = 'var(--accent)';

// Shared draw animation variant
const mkDraw = (delay = 0, duration = 0.6) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration, ease: [0.22, 1, 0.36, 1] },
      opacity: { delay, duration: 0.1 }
    }
  }
});

function DrawPath({ d, stroke, strokeWidth = 2, delay, duration, roughen, ...rest }) {
  const variant = mkDraw(delay, duration);
  return (
    <m.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      filter={roughen ? 'url(#roughen-sm)' : undefined}
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      {...rest}
    />
  );
}

/* ── Arrow (curvy, single-head) ── */
export function ArrowDoodle({ size = 60, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 0.55}
      viewBox="0 0 80 44"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 4 22 C 20 8, 50 36, 72 18"
        stroke={stroke}
        delay={delay}
        roughen
      />
      <DrawPath
        d="M 58 12 L 72 18 L 66 30"
        stroke={stroke}
        delay={delay + 0.25}
      />
    </svg>
  );
}

/* ── Arrow pointing down-right ── */
export function ArrowDownRight({ size = 48, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      <DrawPath d="M 8 8 C 14 24, 28 32, 38 40" stroke={stroke} delay={delay} roughen />
      <DrawPath d="M 26 38 L 38 40 L 36 28" stroke={stroke} delay={delay + 0.25} />
    </svg>
  );
}

/* ── Underline swoosh ── */
export function SwooshUnderline({ width = 120, stroke = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={14}
      viewBox={`0 0 ${width} 14`}
      fill="none"
      className={className}
      style={{ display: 'block' }}
    >
      <DrawPath
        d={`M 3 9 C ${width * 0.25} 4, ${width * 0.6} 12, ${width - 4} 6`}
        stroke={stroke}
        strokeWidth={2.8}
        delay={delay}
        roughen
      />
    </svg>
  );
}

/* ── Squiggle ── */
export function Squiggle({ width = 80, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={20}
      viewBox="0 0 80 20"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 2 10 C 14 3, 20 17, 32 10 C 44 3, 50 17, 62 10 C 68 6, 74 14, 78 10"
        stroke={stroke}
        delay={delay}
        roughen
      />
    </svg>
  );
}

/* ── Star ── */
export function StarDoodle({ size = 24, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 12 2 L 14.4 9.2 L 22 9.2 L 16 13.8 L 18.4 21 L 12 16.4 L 5.6 21 L 8 13.8 L 2 9.2 L 9.6 9.2 Z"
        stroke={stroke}
        strokeWidth={1.8}
        delay={delay}
      />
    </svg>
  );
}

/* ── Sparkle (4-point) ── */
export function Sparkle({ size = 20, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 10 2 L 10 18 M 2 10 L 18 10 M 4 4 L 16 16 M 16 4 L 4 16"
        stroke={stroke}
        strokeWidth={1.6}
        delay={delay}
      />
    </svg>
  );
}

/* ── Circle scribble ── */
export function CircleScribble({ size = 32, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 16 3 C 26 3, 30 10, 29 16 C 28 24, 20 29, 13 28 C 6 27, 2 21, 3 14 C 4 7, 10 2, 16 3 C 18 3, 19 4, 16 4"
        stroke={stroke}
        delay={delay}
        roughen
      />
    </svg>
  );
}

/* ── Code bracket </> ── */
export function CodeBracket({ size = 36, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 0.6}
      viewBox="0 0 48 30"
      fill="none"
      className={className}
    >
      <DrawPath d="M 14 4 L 4 15 L 14 26" stroke={stroke} delay={delay} />
      <DrawPath d="M 34 4 L 44 15 L 34 26" stroke={stroke} delay={delay + 0.12} />
      <DrawPath d="M 28 2 L 20 28" stroke={accent} strokeWidth={2.4} delay={delay + 0.24} />
    </svg>
  );
}

/* ── Laptop ── */
export function LaptopDoodle({ size = 56, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 0.75}
      viewBox="0 0 80 60"
      fill="none"
      className={className}
    >
      {/* Screen */}
      <DrawPath d="M 14 8 H 66 V 44 H 14 Z" stroke={stroke} delay={delay} roughen />
      {/* Code squiggle on screen */}
      <DrawPath d="M 22 20 L 30 16 L 22 24 M 36 18 L 58 18 M 36 26 L 50 26" stroke={accent} strokeWidth={1.8} delay={delay + 0.3} />
      {/* Base */}
      <DrawPath d="M 6 50 H 74 L 66 44 H 14 Z" stroke={stroke} delay={delay + 0.45} roughen />
    </svg>
  );
}

/* ── Coffee / Tea glass ── */
export function TeaDoodle({ size = 44, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
    >
      {/* Glass */}
      <DrawPath d="M 10 8 L 14 38 H 30 L 34 8 Z" stroke={stroke} delay={delay} roughen />
      {/* Tea color band */}
      <DrawPath d="M 11 20 Q 22 23 33 20" stroke={accent} strokeWidth={2.2} delay={delay + 0.2} />
      {/* Steam */}
      <DrawPath d="M 18 4 Q 14 0 18 -4 M 26 4 Q 30 0 26 -4" stroke={stroke} strokeWidth={1.5} delay={delay + 0.35} />
    </svg>
  );
}

/* ── Plant / Leaf ── */
export function PlantDoodle({ size = 40, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 40 44"
      fill="none"
      className={className}
    >
      {/* Pot */}
      <DrawPath d="M 10 32 L 12 42 H 28 L 30 32 Z" stroke={stroke} delay={delay} roughen />
      {/* Stem */}
      <DrawPath d="M 20 32 Q 20 18 20 10" stroke={stroke} delay={delay + 0.2} />
      {/* Leaves */}
      <DrawPath d="M 20 22 C 12 18, 8 10, 14 6 C 16 12, 18 18, 20 22 Z" stroke={accent} strokeWidth={1.8} delay={delay + 0.35} />
      <DrawPath d="M 20 18 C 28 14, 32 6, 26 2 C 24 8, 22 14, 20 18 Z" stroke={stroke} strokeWidth={1.8} delay={delay + 0.5} />
    </svg>
  );
}

/* ── Rocket ── */
export function RocketDoodle({ size = 48, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      <DrawPath d="M 24 6 C 18 16, 16 28, 16 34 H 32 C 32 28, 30 16, 24 6 Z" stroke={stroke} delay={delay} roughen />
      <DrawPath d="M 16 24 L 8 36 H 16" stroke={stroke} strokeWidth={1.8} delay={delay + 0.25} />
      <DrawPath d="M 32 24 L 40 36 H 32" stroke={stroke} strokeWidth={1.8} delay={delay + 0.25} />
      <DrawPath d="M 20 40 Q 22 46 20 50 M 24 40 Q 26 46 24 50 M 28 40 Q 30 46 28 50" stroke={accent} delay={delay + 0.4} />
      <m.circle
        cx="24" cy="20" r="4"
        stroke={accent}
        strokeWidth={1.8}
        fill="none"
        variants={mkDraw(delay + 0.5, 0.4)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      />
    </svg>
  );
}

/* ── Lightbulb ── */
export function Lightbulb({ size = 40, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 1.1}
      viewBox="0 0 40 44"
      fill="none"
      className={className}
    >
      <DrawPath d="M 20 4 C 10 4, 6 12, 8 20 C 10 26, 16 30, 16 36 H 24 C 24 30, 30 26, 32 20 C 34 12, 30 4, 20 4 Z" stroke={stroke} delay={delay} roughen />
      <DrawPath d="M 16 38 H 24 M 17 41 H 23" stroke={stroke} delay={delay + 0.4} />
      <DrawPath d="M 18 16 Q 20 12, 22 16 Q 24 20, 20 22 Q 18 24, 20 26" stroke={accent} strokeWidth={1.8} delay={delay + 0.55} />
    </svg>
  );
}

/* ── Bug ── */
export function BugDoodle({ size = 36, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
    >
      {/* Body */}
      <DrawPath d="M 18 12 C 12 12, 10 18, 10 22 C 10 28, 14 32, 18 32 C 22 32, 26 28, 26 22 C 26 18, 24 12, 18 12 Z" stroke={stroke} delay={delay} roughen />
      {/* Head */}
      <m.circle cx="18" cy="10" r="4" stroke={stroke} strokeWidth={2} fill="none"
        variants={mkDraw(delay + 0.3, 0.3)} initial="hidden" whileInView="visible" viewport={{ once: true }} />
      {/* Antennae */}
      <DrawPath d="M 16 6 L 12 2 M 20 6 L 24 2" stroke={stroke} strokeWidth={1.6} delay={delay + 0.45} />
      {/* Legs */}
      <DrawPath d="M 10 18 L 4 14 M 10 22 L 4 22 M 10 26 L 4 30 M 26 18 L 32 14 M 26 22 L 32 22 M 26 26 L 32 30" stroke={stroke} strokeWidth={1.5} delay={delay + 0.5} />
      {/* Accent stripe */}
      <DrawPath d="M 13 20 Q 18 17, 23 20" stroke={accent} strokeWidth={1.8} delay={delay + 0.65} />
    </svg>
  );
}

/* ── Pencil ── */
export function PencilDoodle({ size = 48, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 0.35}
      viewBox="0 0 80 28"
      fill="none"
      className={className}
    >
      <DrawPath d="M 6 10 L 68 6 L 74 14 L 6 18 Z" stroke={stroke} delay={delay} roughen />
      <DrawPath d="M 68 6 L 78 10 L 74 14" stroke={accent} strokeWidth={2.2} delay={delay + 0.3} />
      <DrawPath d="M 6 10 L 2 14 L 6 18" stroke={stroke} strokeWidth={1.6} delay={delay + 0.45} />
    </svg>
  );
}

/* ── Ruler ── */
export function RulerDoodle({ size = 60, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 0.3}
      viewBox="0 0 80 24"
      fill="none"
      className={className}
    >
      <DrawPath d="M 4 4 H 76 V 20 H 4 Z" stroke={stroke} delay={delay} roughen />
      <DrawPath d="M 16 4 V 12 M 28 4 V 10 M 40 4 V 14 M 52 4 V 10 M 64 4 V 12" stroke={stroke} strokeWidth={1.5} delay={delay + 0.4} />
    </svg>
  );
}

/* ── Cloud ── */
export function CloudDoodle({ size = 56, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 0.6}
      viewBox="0 0 80 48"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 16 38 C 6 38, 4 26, 14 24 C 12 14, 22 8, 30 14 C 34 6, 50 6, 52 16 C 60 14, 68 22, 64 30 C 76 30, 76 42, 66 42 H 16 Z"
        stroke={stroke}
        delay={delay}
        roughen
      />
    </svg>
  );
}

/* ── Map Pin ── */
export function MapPin({ size = 28, stroke = INK, accent = ACCENT, filled = false, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 1.3}
      viewBox="0 0 28 36"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 14 2 C 6 2, 2 8, 2 14 C 2 22, 14 34, 14 34 C 14 34, 26 22, 26 14 C 26 8, 22 2, 14 2 Z"
        stroke={stroke}
        delay={delay}
      />
      <m.circle
        cx="14" cy="13" r="4"
        stroke={stroke}
        strokeWidth={2}
        fill={filled ? accent : 'none'}
        variants={mkDraw(delay + 0.3, 0.3)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      />
    </svg>
  );
}

/* ── Tape strip (horizontal) ── */
export function TapeStrip({ width = 48, height = 14, stroke = INK, accent = ACCENT, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <rect
        x="1" y="1"
        width={width - 2}
        height={height - 2}
        rx="2"
        fill={accent}
        fillOpacity="0.72"
        stroke={stroke}
        strokeWidth="0"
      />
      {/* Dashed edge to simulate tape texture */}
      <line x1="0" y1={height / 2} x2={width} y2={height / 2}
        stroke="rgba(22,21,15,0.08)" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

/* ── Paper clip ── */
export function PaperClip({ size = 18, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 2.2}
      viewBox="0 0 18 40"
      fill="none"
      className={className}
    >
      <DrawPath
        d="M 14 6 C 14 3, 12 2, 9 2 C 6 2, 4 4, 4 7 L 4 30 C 4 35, 7 38, 11 38 C 15 38, 18 35, 18 30 L 18 10 C 18 6, 16 4, 13 4 C 10 4, 8 6, 8 9 L 8 30 C 8 32, 10 34, 12 32"
        stroke={stroke}
        strokeWidth={1.8}
        delay={delay}
        roughen
      />
    </svg>
  );
}

/* ── Speech bubble ── */
export function SpeechBubble({ width = 80, height = 48, stroke = INK, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox="0 0 80 48"
      fill="none"
      className={className}
      style={{ filter: 'url(#roughen-sm)' }}
    >
      <path
        d="M 6 4 C 4 4, 2 6, 2 8 L 2 30 C 2 32, 4 34, 6 34 L 34 34 L 28 44 L 44 34 L 74 34 C 76 34, 78 32, 78 30 L 78 8 C 78 6, 76 4, 74 4 Z"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="var(--bg-raised)"
      />
    </svg>
  );
}

/* ── Tree Doodle ── */
export function TreeDoodle({ size = 32, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 1.3}
      viewBox="0 0 32 42"
      fill="none"
      className={className}
    >
      {/* Foliage tiers */}
      <DrawPath d="M 16 4 L 9 16 H 23 Z" stroke={stroke} delay={delay} roughen />
      <DrawPath d="M 16 13 L 6 26 H 26 Z" stroke={stroke} delay={delay + 0.15} roughen />
      <DrawPath d="M 16 23 L 4 34 H 28 Z" stroke={stroke} delay={delay + 0.3} roughen />
      {/* Trunk */}
      <DrawPath d="M 14 34 V 40 H 18 V 34" stroke={stroke} strokeWidth={1.8} delay={delay + 0.45} />
      {/* Accent needles */}
      <DrawPath d="M 16 18 V 22 M 12 28 L 15 25 M 20 28 L 17 25" stroke={accent} strokeWidth={1.6} delay={delay + 0.55} />
    </svg>
  );
}

/* ── Hill Doodle ── */
export function HillDoodle({ size = 64, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size * 0.45}
      viewBox="0 0 64 28"
      fill="none"
      className={className}
    >
      <DrawPath d="M 2 26 C 14 10, 28 8, 42 26" stroke={stroke} delay={delay} roughen />
      <DrawPath d="M 28 26 C 38 16, 50 14, 62 26" stroke={stroke} strokeWidth={1.8} delay={delay + 0.2} roughen />
      <DrawPath d="M 18 18 Q 23 15 28 19" stroke={accent} strokeWidth={1.4} delay={delay + 0.4} />
    </svg>
  );
}

/* ── Footprints Doodle ── */
export function FootprintsDoodle({ size = 28, stroke = INK, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      {/* Left footprint */}
      <DrawPath d="M 7 14 C 5 11, 6 8, 8 7 C 10 6, 11 9, 10 13 Z M 8 16 C 7 16, 6 18, 7 19 C 8 20, 9 19, 9 17 Z" stroke={stroke} strokeWidth={1.4} delay={delay} />
      {/* Right footprint */}
      <DrawPath d="M 18 8 C 16 5, 17 2, 19 1 C 21 0, 22 3, 21 7 Z M 19 10 C 18 10, 17 12, 18 13 C 19 14, 20 13, 20 11 Z" stroke={stroke} strokeWidth={1.4} delay={delay + 0.2} />
    </svg>
  );
}

/* ── Compass Doodle ── */
export function CompassDoodle({ size = 44, stroke = INK, accent = ACCENT, className = '', delay = 0 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
    >
      {/* Ring */}
      <DrawPath d="M 22 4 A 18 18 0 1 1 21.9 4" stroke={stroke} strokeWidth={1.8} delay={delay} roughen />
      {/* Inner ring */}
      <DrawPath d="M 22 8 A 14 14 0 1 1 21.9 8" stroke="var(--ink-faint)" strokeWidth={1} strokeDasharray="3 3" delay={delay + 0.15} />
      {/* Needle pointing north */}
      <DrawPath d="M 22 10 L 25 22 L 22 20 L 19 22 Z" stroke={stroke} strokeWidth={1.5} fill={accent} delay={delay + 0.3} />
      <DrawPath d="M 22 34 L 19 22 L 22 24 L 25 22 Z" stroke={stroke} strokeWidth={1.5} fill="var(--bg-raised)" delay={delay + 0.4} />
      {/* Center dot */}
      <m.circle cx="22" cy="22" r="2" fill={stroke} variants={mkDraw(delay + 0.5, 0.2)} initial="hidden" whileInView="visible" viewport={{ once: true }} />
      {/* 'N' label */}
      <text x="22" y="7" textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fontWeight="700" fill={stroke}>N</text>
    </svg>
  );
}

