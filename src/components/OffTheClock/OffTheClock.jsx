import React, { useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { sectionHeader, photos, doodlesList } from '../../data/offTheClock';
import PhotoBooth from './PhotoBooth';
import DoodleStrip from './DoodleStrip';
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
        <m.div
          className="otc-header"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="otc-header-row">
            {/* Left Column: Eyebrow, Heading with Swoosh, Handwritten Subtitle */}
            <div className="otc-header-left">
              <div className="otc-wayfinding">
                <span aria-hidden="true">■</span>
                <span>{sectionHeader.number}</span>
              </div>

              <div className="otc-title-wrapper">
                <h2 id="otc-title" className="otc-title">
                  {sectionHeader.title}
                </h2>
                {/* Hand-drawn underline swoosh that draws in on scroll */}
                <svg
                  className="otc-title-swoosh"
                  viewBox="0 0 180 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <m.path
                    d="M 4 8 C 45 4, 110 3, 176 10 C 130 9, 80 11, 40 12"
                    stroke="var(--accent)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0.05 : 0.7,
                      delay: shouldReduceMotion ? 0 : 0.2,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                </svg>
              </div>

              <p className="otc-subtitle">{sectionHeader.subtitle}</p>
            </div>

            {/* Right Column (Desktop Only): Stats Row in Mono & Downward Arrow */}
            <div className="otc-header-right">
              <div className="otc-header-stats-card">
                <span className="otc-header-stats-text">
                  {photos.length} photos · {doodlesList.length} doodles
                </span>
                <svg
                  className="otc-header-down-arrow"
                  viewBox="0 0 32 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M 16 4 Q 18 16 16 28 M 10 22 L 16 28 L 22 22"
                    stroke="var(--ink-muted)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </m.div>

        {/* 1. Photo Booth with Polaroids, Lightbox & Contact Sheet */}
        <PhotoBooth />

        {/* 2. Compact Doodle Strip */}
        <DoodleStrip />
      </div>
    </section>
  );
}
