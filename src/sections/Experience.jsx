import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { timelineData } from '../data/portfolioData';

function TimelineDoodle({ type }) {
  switch (type) {
    case 'education':
      return (
        <svg
          viewBox="0 0 40 40"
          width="36"
          height="36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Mortarboard cap diamond */}
          <path
            d="M 20 6 L 36 14 L 20 22 L 4 14 Z"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cap skull under */}
          <path
            d="M 10 17.5 V 26 C 10 26, 14 31, 20 31 C 26 31, 30 26, 30 26 V 17.5"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cap tassel with lime accent */}
          <path d="M 31 16.5 V 27" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="31" cy="28.5" r="1.5" fill="var(--accent)" />
        </svg>
      );

    case 'internship':
      return (
        <svg
          viewBox="0 0 40 40"
          width="36"
          height="36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Laptop display */}
          <path
            d="M 8 9 C 8 7.5, 9.5 6.5, 11 6.5 H 29 C 30.5 6.5, 32 7.5, 32 9 V 23 H 8 Z"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Laptop keyboard base */}
          <path
            d="M 4 28 C 4 26.5, 5.5 25.5, 7 25.5 H 33 C 34.5 25.5, 36 26.5, 36 28 H 4 Z"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Terminal prompt >_ in lime */}
          <path
            d="M 13 13 L 16 16 L 13 19"
            stroke="var(--accent)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M 19 19 H 24" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'hacking':
      return (
        <svg
          viewBox="0 0 40 40"
          width="36"
          height="36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Friendly padlock shackle */}
          <path
            d="M 13 17 V 12 C 13 8, 16 5, 20 5 C 24 5, 27 8, 27 12 V 17"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lock body */}
          <rect
            x="9"
            y="17"
            width="22"
            height="17"
            rx="3"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Keyhole with lime accent */}
          <circle cx="20" cy="24" r="2" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.2" />
          <path d="M 20 26 V 29" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'nss':
      return (
        <svg
          viewBox="0 0 40 40"
          width="36"
          height="36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Hand-drawn heart */}
          <path
            d="M 20 34 C 17 31, 6 23, 6 15 C 6 10, 10 6, 15 6 C 18 6, 20 8.5, 20 8.5 C 20 8.5, 22 6, 25 6 C 30 6, 34 10, 34 15 C 34 23, 23 31, 20 34 Z"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Warmth ray in lime */}
          <path
            d="M 15 13 C 16 11, 18 10, 20 12"
            stroke="var(--accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 40 40" width="36" height="36" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="4" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.8" />
        </svg>
      );
  }
}

export default function Experience() {
  const trailRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trailRef,
    offset: ['start 85%', 'end 70%']
  });

  const pathLengthProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const entryVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.45,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="experience" className="editorial-section experience-section" aria-labelledby="experience-heading">
      <div className="container experience-container">
        {/* Quiet section wayfinding label */}
        <div className="experience-label-wrapper">
          <h2 id="experience-heading" className="experience-wayfinding-label">
            Experience &amp; education
          </h2>
        </div>

        {/* The Hand-Drawn Journal Trail */}
        <div ref={trailRef} className="trail-wrapper">
          {/* Continuous Hand-Drawn Wobbly Connector Line */}
          <svg
            className="trail-wobbly-line-svg"
            viewBox="0 0 20 1000"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <motion.path
              d="M 10 0 C 14 60, 6 120, 10 180 C 14 240, 6 300, 10 360 C 14 420, 6 480, 10 540 C 14 600, 6 660, 10 720 C 14 780, 6 840, 10 900 C 14 960, 8 990, 10 1000"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                pathLength: shouldReduceMotion ? 1 : pathLengthProgress
              }}
            />
          </svg>

          {/* Timeline Sequence */}
          <div className="trail-list" role="list">
            {timelineData.map((item) => (
              <motion.article
                key={item.id}
                className="trail-entry"
                variants={entryVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                role="listitem"
              >
                {/* Node & Doodle Mark */}
                <div className="trail-node-col">
                  <div className="trail-doodle-wrapper">
                    <TimelineDoodle type={item.iconType} />
                  </div>
                </div>

                {/* Content */}
                <div className="trail-content-col">
                  {/* Period & Type Metadata */}
                  <div className="trail-meta">
                    <span className="trail-period">{item.period}</span>
                    {item.duration && (
                      <>
                        <span className="trail-meta-sep" aria-hidden="true">·</span>
                        <span className="trail-duration">{item.duration}</span>
                      </>
                    )}
                    <span className="trail-meta-sep" aria-hidden="true">·</span>
                    <span className="trail-type">{item.type}</span>
                  </div>

                  {/* Role / Degree Title */}
                  <h3 className="trail-title">{item.title}</h3>

                  {/* Organization & Location */}
                  <div className="trail-org">
                    <span className="trail-org-name">{item.organization}</span>
                    <span className="trail-location"> — {item.location}</span>
                  </div>

                  {/* Description */}
                  <p className="trail-desc">{item.description}</p>

                  {/* Handwritten-Style Honest Aside */}
                  {item.aside && (
                    <div className="trail-aside">
                      <span className="trail-aside-mark" aria-hidden="true">✎</span>
                      <span className="trail-aside-text">"{item.aside}"</span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
