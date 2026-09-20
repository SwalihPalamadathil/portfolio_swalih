import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Compass, X, ExternalLink } from 'lucide-react';
import { projectsData } from '../data/portfolioData';

export default function Work() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const previewRef = useRef(null);

  const project = projectsData[0];

  const togglePreview = () => {
    setIsPreviewOpen((prev) => {
      const next = !prev;
      if (!prev && previewRef.current) {
        setTimeout(() => {
          previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
      return next;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
        delayChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="projects" className="editorial-section work-section" aria-labelledby="work-heading">
      <div className="container work-container">
        {/* Quiet section wayfinding label */}
        <div className="work-label-wrapper">
          <h2 id="work-heading" className="work-wayfinding-label">
            Selected work
          </h2>
        </div>

        {/* The Pinned Project Sheet: Asymmetric Spread */}
        <motion.div
          className="work-editorial-spread"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {/* Left / Main Visual Column (Cols 1–7) */}
          <motion.div variants={itemVariants} className="work-visual-column">
            {/* Visual Frame Wrapper with Architectural Offset Outline */}
            <div className="work-image-frame-wrapper">
              <div className="work-image-offset-frame" aria-hidden="true" />

              <div className="work-image-box">
                <img
                  src="/cammapphoto.png"
                  alt="CamMap interface preview showing EMEA College campus navigation and route calculation"
                  className="work-screenshot-img"
                  width={1920}
                  height={868}
                  loading="lazy"
                  decoding="async"
                />

                {/* Doodle 2: Hand-drawn Loop Encircling 'Optimal BFS Walking Routes' badge */}
                <div className="work-doodle-badge-loop" aria-hidden="true">
                  <svg
                    className="work-doodle-loop-svg"
                    viewBox="0 0 170 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M 12 28 C 10 12, 50 6, 110 8 C 154 9, 164 24, 158 38 C 150 49, 90 51, 30 47 C 12 45, 6 34, 20 22 C 34 12, 68 8, 115 10"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.75,
                        delay: shouldReduceMotion ? 0 : 0.45,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    />
                  </svg>
                </div>
              </div>

              {/* Doodle 1: Pointer Squiggle with Handwritten-Style Note */}
              <div className="work-doodle-route" aria-hidden="true">
                <span className="work-doodle-caption">finds the fastest route between buildings</span>
                <svg
                  className="work-doodle-arrow-svg"
                  viewBox="0 0 95 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M 8 10 C 32 6, 52 38, 82 24"
                    stroke="var(--accent)"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.6,
                      delay: shouldReduceMotion ? 0 : 0.35,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                  <motion.path
                    d="M 70 17 L 84 24 L 75 32"
                    stroke="var(--accent)"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.3,
                      delay: shouldReduceMotion ? 0 : 0.85,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Right / Editorial Narrative Column (Cols 8–12) */}
          <motion.div variants={itemVariants} className="work-narrative-column">
            <div>
              {/* Project Title with Hand-drawn Doodle 3: Scribbled Underline */}
              <div className="work-title-wrapper">
                <h3 className="work-project-title">{project.title}</h3>
                <svg
                  className="work-title-scribble-svg"
                  viewBox="0 0 150 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 4 11 C 32 16, 68 4, 105 12 C 122 15, 136 8, 146 9.5"
                    stroke="var(--accent)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.6,
                      delay: shouldReduceMotion ? 0 : 0.25,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                </svg>
              </div>

              <p className="work-project-subtitle">{project.subtitle}</p>

              <div className="work-narrative-body">
                <p>{project.description}</p>
                <p>{project.detail}</p>
              </div>

              {/* Clean Outlined Tech Tags — Never filled pills */}
              <div className="work-tech-list" aria-label="Technologies used">
                {project.techStack.map((tech) => (
                  <span key={tech} className="work-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Two Clearly Distinct Actions */}
            <div className="work-action-group">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="work-live-link"
                aria-label="View CamMap live deployment on Vercel (opens in new tab)"
              >
                <span>View live site</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>

              <button
                type="button"
                className={`work-peek-btn ${isPreviewOpen ? 'is-active' : ''}`}
                onClick={togglePreview}
                aria-expanded={isPreviewOpen}
                aria-controls="cammap-live-preview"
              >
                <Compass size={15} aria-hidden="true" />
                <span>{isPreviewOpen ? 'Close live preview' : 'Peek inside (live preview)'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Option 1: Live Interactive Embedded Preview Panel */}
        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div
              ref={previewRef}
              id="cammap-live-preview"
              className="work-live-preview-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: {
                  duration: shouldReduceMotion ? 0.01 : 0.38,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  duration: shouldReduceMotion ? 0.01 : 0.25,
                  ease: 'easeIn'
                }
              }}
            >
              {/* Minimal Browser Chrome Top Bar */}
              <div className="work-browser-chrome">
                <div className="work-browser-dots" aria-hidden="true">
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                </div>

                <div className="work-browser-address">
                  <span className="browser-lock" aria-hidden="true">🔒</span>
                  <span className="browser-url">cammap-react.vercel.app</span>
                </div>

                <div className="work-browser-actions">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="browser-tab-link"
                    title="Open live site in new window"
                  >
                    <ExternalLink size={13} aria-hidden="true" />
                    <span>Open in tab</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(false)}
                    className="browser-close-btn"
                    aria-label="Close live preview"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Lazy-mounted Embedded Live App */}
              <div className="work-iframe-container">
                <iframe
                  src={project.liveUrl}
                  title="CamMap Live Application Preview"
                  className="work-preview-iframe"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
