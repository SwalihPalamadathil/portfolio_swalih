import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { doodleHeader, doodlesList } from '../../data/offTheClock';
import './doodleStrip.css';

// SVG Doodle Path Animation variants
const drawVariant = {
  hidden: (custom) =>
    custom?.shouldReduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
  visible: (custom) => ({
    pathLength: 1,
    opacity: 1,
    transition: custom?.shouldReduce
      ? { duration: 0 }
      : {
          pathLength: { delay: custom?.delay || 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          opacity: { delay: custom?.delay || 0, duration: 0.1 }
        }
  })
};

export default function DoodleStrip() {
  const shouldReduceMotion = useReducedMotion();

  // Helper to render individual doodle SVGs with uniform 2px strokes and draw-on-scroll animation
  const renderDoodleSvg = (id, itemIndex) => {
    const baseDelay = itemIndex * 0.05;

    switch (id) {
      case 'machine':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.path
              d="M 22 25 H 78 V 62 H 22 Z"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 12 70 H 88 L 80 62 H 20 Z"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.08, shouldReduce: shouldReduceMotion }}
            />
            <m.circle
              cx="48"
              cy="44"
              r="5"
              stroke="var(--ink)"
              strokeWidth="2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.14, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 82 28 C 82 25, 85 22, 85 22 C 85 22, 88 25, 88 28 C 88 30, 85 31, 85 31 Z"
              fill="var(--accent)"
              stroke="var(--accent-ink)"
              strokeWidth="1.5"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.18, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      case 'tea':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.path
              d="M 32 30 L 38 75 H 62 L 68 30 Z"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 36 46 Q 50 49 64 46"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.08, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 44 24 Q 40 16 46 10 M 56 22 Q 60 15 54 8"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.14, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      case 'kerala':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.path
              d="M 48 85 Q 52 50 46 25"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 46 25 C 32 20, 22 26, 18 36 M 46 25 C 38 14, 28 14, 22 22 M 46 25 C 56 12, 68 14, 76 22 M 46 25 C 64 18, 76 28, 80 40 M 46 25 C 58 28, 66 36, 70 48"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.08, shouldReduce: shouldReduceMotion }}
            />
            <m.circle
              cx="44"
              cy="30"
              r="3.5"
              fill="var(--ink)"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.16, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      case 'scooter':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.circle
              cx="28"
              cy="68"
              r="11"
              stroke="var(--ink)"
              strokeWidth="2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.circle
              cx="72"
              cy="68"
              r="11"
              stroke="var(--ink)"
              strokeWidth="2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.06, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 28 68 H 54 L 64 42 H 72 M 64 42 L 56 32 H 48"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.12, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 38 52 Q 48 50 56 52"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.18, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      case 'git-branch':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.circle
              cx="34"
              cy="28"
              r="6"
              stroke="var(--ink)"
              strokeWidth="2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.circle
              cx="34"
              cy="72"
              r="6"
              stroke="var(--ink)"
              strokeWidth="2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.06, shouldReduce: shouldReduceMotion }}
            />
            <m.circle
              cx="66"
              cy="42"
              r="6"
              stroke="var(--accent-ink)"
              fill="var(--accent)"
              strokeWidth="1.5"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.12, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 34 34 V 66"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.16, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 34 56 C 34 46, 48 42, 60 42"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.22, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      case '404':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.path
              d="M 28 32 L 18 54 H 34 V 68 M 30 44 V 68"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.ellipse
              cx="50"
              cy="50"
              rx="11"
              ry="16"
              stroke="var(--ink)"
              strokeWidth="2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.08, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 74 32 L 64 54 H 80 V 68 M 76 44 V 68"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.16, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      case 'nss':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.path
              d="M 50 74 C 50 74, 24 54, 24 38 C 24 26, 34 20, 42 26 C 47 29, 50 34, 50 34 C 50 34, 53 29, 58 26 C 66 20, 76 26, 76 38 C 76 54, 50 74, 50 74 Z"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 38 46 Q 50 54 62 44 M 44 48 L 56 48"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.08, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      case 'rocket':
        return (
          <svg className="doodle-strip-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <m.path
              d="M 50 16 C 42 28, 40 48, 40 60 H 60 C 60 48, 58 28, 50 16 Z"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 40 48 L 28 62 H 40"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.06, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 60 48 L 72 62 H 60"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.06, shouldReduce: shouldReduceMotion }}
            />
            <m.circle
              cx="50"
              cy="36"
              r="5"
              fill="var(--accent)"
              stroke="var(--accent-ink)"
              strokeWidth="1.5"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.12, shouldReduce: shouldReduceMotion }}
            />
            <m.path
              d="M 45 66 Q 50 76 44 86 M 50 66 Q 54 74 50 84 M 55 66 Q 60 76 56 86"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={{ delay: baseDelay + 0.18, shouldReduce: shouldReduceMotion }}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="doodle-strip" aria-label="Margin doodles">
      <div className="doodle-strip-card">
        {/* Washi tape accent corner */}
        <div className="doodle-strip-tape" aria-hidden="true" />

        {/* Small handwritten title (one line, ~20px) */}
        <div className="doodle-strip-header">
          <h3 className="doodle-strip-title">{doodleHeader.title}</h3>
        </div>

        {/* Compact Doodle Row / Grid */}
        <div className="doodle-strip-grid">
          {doodlesList.map((doodle, index) => (
            <m.div
              key={doodle.id}
              className={`doodle-strip-item ${doodle.hideOnMobile ? 'hide-mobile' : ''}`}
              whileHover={shouldReduceMotion ? {} : { rotate: index % 2 === 0 ? -2.5 : 2.5, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              <div className="doodle-strip-svg-wrap">
                {renderDoodleSvg(doodle.id, index)}
              </div>
              <span className="doodle-strip-label" title={doodle.label}>
                <span className="doodle-label-full">{doodle.label}</span>
                <span className="doodle-label-short">{doodle.shortLabel || doodle.label}</span>
              </span>
            </m.div>
          ))}
        </div>
      </div>
    </div>
  );
}
