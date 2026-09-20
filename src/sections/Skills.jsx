import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { skillsData } from '../data/portfolioData';

function SkillWord({
  skill,
  isActive,
  onActivate,
  onDeactivate,
  onToggle,
  shouldReduceMotion,
  wordVariants
}) {
  const wordRef = useRef(null);
  const [isNearRight, setIsNearRight] = useState(false);

  useEffect(() => {
    if (isActive && wordRef.current) {
      const rect = wordRef.current.getBoundingClientRect();
      setIsNearRight(rect.left + 320 > window.innerWidth);
    }
  }, [isActive]);

  const isLearning = skill.tier === 'learning';

  return (
    <motion.div
      ref={wordRef}
      className={`skills-word-wrapper ${isLearning ? 'skills-word-wrapper--learning' : ''}`}
      variants={wordVariants}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(skill.name);
      }}
      onMouseEnter={() => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
          onActivate(skill.name);
        }
      }}
      onMouseLeave={() => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
          onDeactivate(skill.name);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onToggle(skill.name);
        } else if (e.key === 'Escape') {
          onDeactivate(skill.name);
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
      aria-label={`${skill.name}: ${skill.context}`}
    >
      <span className={`skills-word ${isLearning ? 'skills-word--learning' : ''} ${isActive ? 'is-active' : ''}`}>
        {skill.name}
      </span>

      {/* Lime underline draws in on hover/active state */}
      <motion.span
        className={`skills-word-underline ${isLearning ? 'skills-word-underline--learning' : ''}`}
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.25,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{ originX: 0 }}
        aria-hidden="true"
      />

      {/* Honest context reveal line */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            className={`skills-word-context ${isLearning ? 'skills-word-context--learning' : ''} ${isNearRight ? 'is-near-right' : ''}`}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -2 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.15,
              ease: 'easeOut'
            }}
            aria-live="polite"
          >
            {skill.context}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const coreSkills = skillsData.filter((s) => s.tier === 'core');
  const learningSkills = skillsData.filter((s) => s.tier === 'learning');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.35,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section
      id="skills"
      className="editorial-section skills-section"
      aria-labelledby="skills-heading"
      onClick={() => setActiveSkill(null)}
    >
      <div className="container skills-container">
        {/* Section wayfinding heading — small, quiet, consistent */}
        <div className="skills-label-wrapper">
          <h2 id="skills-heading" className="skills-wayfinding-label">
            Skills &amp; toolkit
          </h2>
        </div>

        {/* Tier 1: Comfortable with — flowing display-weight sentence */}
        <motion.div
          className="skills-words-flowing"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {coreSkills.map((skill) => (
            <SkillWord
              key={skill.name}
              skill={skill}
              isActive={activeSkill === skill.name}
              onActivate={(name) => setActiveSkill(name)}
              onDeactivate={(name) => setActiveSkill((curr) => (curr === name ? null : curr))}
              onToggle={(name) => setActiveSkill((curr) => (curr === name ? null : name))}
              shouldReduceMotion={shouldReduceMotion}
              wordVariants={wordVariants}
            />
          ))}
        </motion.div>

        {/* Hairline tier divider */}
        <div className="skills-divider-wrapper" aria-hidden="true">
          <hr className="skills-tier-divider" />
        </div>

        {/* Tier 2 label: Currently learning */}
        <div className="skills-learning-label-wrapper">
          <span className="skills-learning-label">Currently learning</span>
        </div>

        {/* Tier 2: Currently learning — visually quieter sub-block */}
        <motion.div
          className="skills-words-flowing skills-words-flowing--learning"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {learningSkills.map((skill) => (
            <SkillWord
              key={skill.name}
              skill={skill}
              isActive={activeSkill === skill.name}
              onActivate={(name) => setActiveSkill(name)}
              onDeactivate={(name) => setActiveSkill((curr) => (curr === name ? null : curr))}
              onToggle={(name) => setActiveSkill((curr) => (curr === name ? null : name))}
              shouldReduceMotion={shouldReduceMotion}
              wordVariants={wordVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
