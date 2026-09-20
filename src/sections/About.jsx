import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const factCards = [
  {
    id: 'kerala',
    title: 'Kerala, India',
    detail: 'EMEA College CS undergraduate',
    rotation: -3,
    delay: 0.12
  },
  {
    id: 'hacking',
    title: 'Ethical Hacking',
    detail: 'Offenso Hackers Academy course',
    rotation: 2.2,
    delay: 0.2
  },
  {
    id: 'cammap',
    title: 'Building CamMap',
    detail: 'Interactive campus navigation app',
    rotation: -2,
    delay: 0.28
  },
  {
    id: 'nss',
    title: 'NSS Volunteer',
    detail: 'Active student community service',
    rotation: 3.5,
    delay: 0.36
  }
];

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.45,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const cardClusterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.18
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
      rotate: 0
    },
    visible: (customRotation) => ({
      opacity: 1,
      y: 0,
      rotate: shouldReduceMotion ? 0 : customRotation,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.55,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <section id="about" className="editorial-section about-section" aria-labelledby="about-wayfinding-label">
      {/* Paper Grain Texture (Scoped only to About section) */}
      <div className="about-grain-texture" aria-hidden="true" />

      <div className="container about-container">
        {/* Quiet wayfinding section label */}
        <div className="about-label-wrapper">
          <span id="about-wayfinding-label" className="about-wayfinding-label">
            About
          </span>
        </div>

        {/* Asymmetric Composition: Voice Column & Pinned Notes Scatter */}
        <div className="about-editorial-grid">
          {/* Left Column (Cols 1–7): Lede Line & Narrative Voice */}
          <motion.div
            className="about-voice-column"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Lede Line with Hand-drawn SVG Accent Mark */}
            <motion.h2 variants={itemVariants} className="about-lede-line">
              Computer Science student learning to{' '}
              <span className="about-mark-wrapper">
                build
                <svg
                  className="about-hand-drawn-svg"
                  viewBox="0 0 76 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 3 10 C 18 5, 38 13, 56 7 C 63 4.5, 70 9, 73 7.5"
                    stroke="var(--accent)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.7,
                      delay: shouldReduceMotion ? 0 : 0.25,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                </svg>
              </span>{' '}
              things people actually want to use.
            </motion.h2>

            {/* Supporting First-Person Body Paragraphs */}
            <motion.div variants={itemVariants} className="about-paragraphs">
              <p className="about-body-p">
                I'm an undergraduate based in Kerala, India, focusing on frontend development with React, JavaScript, and modern CSS. Rather than collecting frameworks, I care about understanding web fundamentals and building functional, responsive interfaces that hold up on real devices.
              </p>
              <p className="about-body-p">
                My primary project right now is CamMap, an interactive campus navigation web app. Alongside college coursework, I recently completed a 60-hour Python full-stack internship at Sysbreeze Technologies, study ethical hacking essentials through an online course, and contribute as an active NSS volunteer.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Rotated Pinned Fact Notes (Paper-toned, slightly overlapping) */}
          <motion.aside
            className="about-notes-area"
            aria-label="Personal background notes"
            variants={cardClusterVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="about-notes-cluster">
              {factCards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`about-pinned-card about-card-${card.id}`}
                  custom={card.rotation}
                  variants={cardVariants}
                  drag={!shouldReduceMotion}
                  dragConstraints={{ left: -14, right: 14, top: -14, bottom: 14 }}
                  dragElastic={0.12}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          rotate: 0,
                          y: -3,
                          boxShadow: '3px 4px 0px rgba(22, 21, 15, 0.1)',
                          transition: { duration: 0.18, ease: 'easeOut' }
                        }
                  }
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                >
                  <div className="about-card-pin" aria-hidden="true" />
                  <div className="about-card-title">{card.title}</div>
                  <div className="about-card-detail">{card.detail}</div>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
