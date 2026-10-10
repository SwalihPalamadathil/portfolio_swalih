import React, { useState, useEffect, useRef } from 'react';
import { m, useReducedMotion, AnimatePresence } from 'framer-motion';
import { skillsData, skillsGroups } from '../data/portfolioData';
import RoughenFilter from '../components/doodles/RoughenFilter';
import {
  CodeBracket,
  Sparkle,
  StarDoodle,
  BugDoodle,
  RocketDoodle,
  LaptopDoodle,
} from '../components/doodles/Doodles';
import CurrentlyLearning from './CurrentlyLearning';
import './skills.css';

// ─── Curated fixed shapes & tilts (never random at render) ───────────────────
const SKILL_META = {
  HTML:           { shape: 'blob',   tilt: -2,   fill: 'soft',   doodle: 'bracket' },
  CSS:            { shape: 'pill',   tilt:  1.8, fill: 'soft',   doodle: 'sparkle' },
  JavaScript:     { shape: 'burst',  tilt:  1.2, fill: 'accent', doodle: null      },
  React:          { shape: 'round',  tilt: -1.5, fill: 'accent', doodle: 'sparkle' },
  Vite:           { shape: 'ticket', tilt:  2.2, fill: 'soft',   doodle: 'rocket'  },
  Bootstrap:      { shape: 'hex',    tilt: -1.8, fill: 'soft',   doodle: null      },
  'Git & GitHub': { shape: 'blob',   tilt:  1.5, fill: 'soft',   doodle: null      },
};

function StickerDoodle({ type, size = 16 }) {
  if (type === 'bracket') return <CodeBracket size={size} />;
  if (type === 'sparkle')  return <Sparkle size={size} />;
  if (type === 'bug')      return <BugDoodle size={size} />;
  if (type === 'rocket')   return <RocketDoodle size={size} />;
  return null;
}

// ─── Single Die-Cut Sticker Chip ─────────────────────────────────────────────
function SkillSticker({
  skill,
  index,
  isOpen,
  onToggle,
  onOpen,
  onClose,
}) {
  const shouldReduceMotion = useReducedMotion();
  const meta = SKILL_META[skill.name] || { shape: 'round', tilt: 0, fill: 'soft', doodle: null };
  const noteId = `skill-note-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <m.li
      className="skill-sticker-item"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.35,
        delay: shouldReduceMotion ? 0 : index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <button
        type="button"
        id={`skill-btn-${skill.name}`}
        className={`skill-sticker-btn shape-${meta.shape} fill-${meta.fill} ${isOpen ? 'is-open' : ''}`}
        style={{ '--tilt': `${meta.tilt}deg` }}
        aria-expanded={isOpen}
        aria-controls={noteId}
        aria-describedby={isOpen ? noteId : undefined}
        onClick={() => onToggle(skill.name)}
        onMouseEnter={() => onOpen(skill.name)}
        onFocus={() => onOpen(skill.name)}
      >
        <div className="sticker-header-row">
          {meta.doodle && (
            <span className="sticker-doodle-icon" aria-hidden="true">
              <StickerDoodle type={meta.doodle} size={15} />
            </span>
          )}
          <span className="sticker-name">{skill.name}</span>
        </div>
        <span className="sticker-detail">{skill.detail}</span>
      </button>

      {/* ── Context Note Bubble in Caveat Handwriting ── */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            id={noteId}
            role="tooltip"
            className="sticker-note-bubble"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="sticker-note-close"
              aria-label={`Close note for ${skill.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              ×
            </button>
            <p className="sticker-note-text">"{skill.context}"</p>
            <span className="sticker-note-meta">{skill.name} context note</span>
          </m.div>
        )}
      </AnimatePresence>
    </m.li>
  );
}

// ─── Main Skills Component ───────────────────────────────────────────────────
export default function Skills() {
  const [activeSkill, setActiveSkill] = useState(null);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveSkill(null);
    };

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveSkill(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleSkill = (name) => {
    setActiveSkill((prev) => (prev === name ? null : name));
  };

  const openSkill = (name) => {
    setActiveSkill(name);
  };

  const closeSkill = () => {
    setActiveSkill(null);
  };

  // Combine skillsGroups.comfortable with skillsData.context strictly
  const comfortableSkills = skillsGroups.comfortable.skills.map((s) => {
    const match = skillsData.find(
      (d) => d.name.toLowerCase() === s.name.toLowerCase()
    );
    return {
      name: s.name,
      detail: s.detail,
      context: match?.context || s.detail,
    };
  });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: {
      duration: shouldReduceMotion ? 0.01 : 0.45,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  return (
    <section
      id="skills"
      className="editorial-section skills-section"
      aria-labelledby="skills-heading"
      ref={containerRef}
    >
      <RoughenFilter />

      {/* Pegboard dotgrid texture */}
      <div className="skills-dotgrid" aria-hidden="true" />

      <div className="container skills-container">
        {/* ── Section Wayfinding ── */}
        <m.div className="skills-wayfinding-row" {...fadeUp(0)}>
          <span className="skills-eyebrow-number" aria-hidden="true">03</span>
          <h2 id="skills-heading" className="skills-eyebrow-label">
            Skills &amp; toolkit
          </h2>
          <span className="skills-eyebrow-rule" aria-hidden="true" />
        </m.div>

        {/* ── Display Headline ── */}
        <m.p className="skills-display-line" {...fadeUp(0.06)}>
          What I reach for.
        </m.p>

        {/* ── Mono Interaction Hint ── */}
        <m.p className="skills-interaction-hint" {...fadeUp(0.12)}>
          <span className="skills-hint-badge" aria-hidden="true">TIP</span>
          <span>Hover or tap any skill for context</span>
        </m.p>

        {/* ── Main Skills Spread (Sticker Sheet Card + Margin Aside) ── */}
        <div className="skills-spread-layout">
          {/* Main Sticker Sheet Card */}
          <m.div className="sticker-sheet-card" {...fadeUp(0.18)}>
            <div className="sticker-sheet-perf" aria-hidden="true" />

            <div className="sticker-sheet-header">
              <h3 className="sticker-sheet-title">Comfortable with</h3>
              <span className="sticker-sheet-subtitle">
                Die-cut sticker collection • 7 core technologies
              </span>
            </div>

            <ul className="sticker-grid" aria-label="Comfortable with skills">
              {comfortableSkills.map((skill, index) => (
                <SkillSticker
                  key={skill.name}
                  skill={skill}
                  index={index}
                  isOpen={activeSkill === skill.name}
                  onToggle={toggleSkill}
                  onOpen={openSkill}
                  onClose={closeSkill}
                />
              ))}
            </ul>
          </m.div>

          {/* Margin Aside: Laptop Doodle & Sketchbook Accents (Desktop only) */}
          <aside className="skills-margin-aside" aria-label="Sketchbook doodles">
            <div className="skills-margin-laptop">
              <LaptopDoodle size={108} />
              <p className="skills-margin-caption">what's on my machine</p>
            </div>
            <div className="skills-margin-doodles" aria-hidden="true">
              <CodeBracket size={36} />
              <StarDoodle size={20} stroke="var(--ink)" />
              <Sparkle size={18} />
            </div>
          </aside>
        </div>

        {/* ── Notebook Perforated Divider to Trail Map Page ── */}
        <div className="sketchbook-page-divider" aria-hidden="true">
          <div className="sketchbook-divider-line" />
          <div className="sketchbook-divider-badge">
            <span>Sketchbook Page 3b — The Learning Trail</span>
          </div>
        </div>

        {/* ── Currently Learning: Hand-Drawn Trail Map ── */}
        <CurrentlyLearning />
      </div>
    </section>
  );
}
