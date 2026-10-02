import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { sectionHeader } from '../../data/offTheClock';
import PhotoBooth from './PhotoBooth';
import DoodleCorner from './DoodleCorner';
import ClickSpark from './ClickSpark';
import './offTheClock.css';

export default function OffTheClock() {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="off-the-clock"
      className="otc-section editorial-section"
      aria-labelledby="otc-title"
    >
      {/* Paper Grain Texture (scoped strictly to this section) */}
      <div className="otc-grain-texture" aria-hidden="true" />

      {/* Subtle ink click-spark effect for desktop pointer */}
      <ClickSpark targetRef={sectionRef} />

      <div className="container otc-container">
        {/* Section Header */}
        <motion.div
          className="otc-header"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="otc-wayfinding">
            <span aria-hidden="true">■</span>
            <span>{sectionHeader.number}</span>
          </div>

          <div className="otc-title-wrapper">
            <h2 id="otc-title" className="otc-title">
              {sectionHeader.title}
            </h2>
            {/* Hand-drawn underline swoosh */}
            <svg
              className="otc-title-swoosh"
              viewBox="0 0 180 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                d="M 4 8 C 45 4, 110 3, 176 10 C 130 9, 80 11, 40 12"
                stroke="var(--accent)"
                strokeWidth="2.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </div>

          <p className="otc-subtitle">{sectionHeader.subtitle}</p>

          {sectionHeader.description && (
            <p className="otc-lead-note">{sectionHeader.description}</p>
          )}
        </motion.div>

        {/* 1. Photo Booth with Polaroids, Lightbox & Contact Sheet */}
        <PhotoBooth />

        {/* Subtle Hand-Drawn Dashed Divider */}
        <div className="otc-section-divider" aria-hidden="true">
          <svg viewBox="0 0 600 12" preserveAspectRatio="none" className="otc-divider-svg">
            <path
              d="M 0 6 Q 150 10, 300 6 Q 450 2, 600 6"
              stroke="var(--border-medium)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
            />
          </svg>
        </div>

        {/* 2. Doodle Corner & Interactive Notebook Sketchpad */}
        <DoodleCorner />
      </div>
    </section>
  );
}
