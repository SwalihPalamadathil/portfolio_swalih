import React, { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, Download, Check } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import HeroChat from '../components/HeroChat';
import { ChatErrorBoundary } from '../components/ErrorBoundary';
import resumeUrl from '../assets/MUHAMMED_SWALIH_P_FlowCV_Resume_2026-09-12 (1).pdf';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Coordinated entrance sequence
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
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const photoVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 1.03, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.8,
        delay: shouldReduceMotion ? 0 : 0.26,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="hero" className="hero-editorial" aria-label="Hero Overview">
      <div className="container hero-container">
        {/* Left / Main Content Area (58-62% on desktop) */}
        <m.div
          className="hero-text-area"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Small Eyebrow / Metadata */}
          <m.div variants={itemVariants} className="hero-eyebrow">
            <span className="eyebrow-text">{personalInfo.roleLabel}</span>
          </m.div>

          {/* 2. Main Heading: Two-line Name */}
          <m.h1 variants={itemVariants} className="hero-heading">
            <span className="hero-name-line">Muhammed</span>
            <span className="hero-name-line">Swalih P.</span>
          </m.h1>

          {/* 3. Primary Title */}
          <m.h2 variants={itemVariants} className="hero-primary-title">
            <span>Computer Science Student</span>
            <span className="title-amp"> &amp; Web Developer</span>
          </m.h2>

          {/* 4. Description */}
          <m.p variants={itemVariants} className="hero-description">
            {personalInfo.bio}
          </m.p>

          {/* 5. Action Buttons */}
          <m.div variants={itemVariants} className="hero-button-group">
            <a
              href="#projects"
              onClick={(e) => handleScroll(e, 'projects')}
              className="editorial-btn hero-btn-primary"
              aria-label="View my work"
            >
              <span>View my work</span>
              <ArrowDownRight size={17} aria-hidden="true" />
            </a>

            <a
              href={resumeUrl}
              download="Muhammed-Swalih-P-Resume.pdf"
              onClick={handleDownloadClick}
              className={`editorial-btn hero-btn-secondary hero-btn-cv ${isDownloading ? 'is-downloading' : ''}`}
              aria-label="Download CV (PDF)"
              aria-live="polite"
            >
              <span className="hero-btn-cv-label">
                <span>{isDownloading ? 'Downloading...' : 'Download CV'}</span>
                {!isDownloading && <span className="hero-btn-cv-badge" aria-hidden="true">PDF</span>}
              </span>
              {isDownloading ? (
                <Check size={18} className="hero-btn-cv-icon-check" aria-hidden="true" />
              ) : (
                <Download size={18} className="hero-btn-cv-icon" aria-hidden="true" />
              )}
            </a>
          </m.div>

          {/* 6. Grounded AI Visitor Note ("the sticky note that talks back") */}
          {/* ChatErrorBoundary: any crash shows a friendly message ONLY inside
              the chat area — Hero section and the rest of the page are unaffected */}
          <m.div variants={itemVariants} className="hero-chat-container">
            <ChatErrorBoundary>
              <HeroChat />
            </ChatErrorBoundary>
          </m.div>
        </m.div>

        {/* Right / Visual Area: Art-Directed Editorial Portrait */}
        <m.div
          className="hero-photo-area"
          variants={photoVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-portrait-composition">
            {/* Visual Portrait Frame with Architectural Offset Outline */}
            <div className="hero-portrait-frame-wrapper">
              <div className="hero-portrait-offset-frame" aria-hidden="true" />
              <div className="hero-portrait-accent-mark" aria-hidden="true" />
              
              <div className="hero-portrait-image-box">
                <img
                  srcSet="/myphoto-sm.webp 480w, /myphoto.webp 900w"
                  sizes="(max-width: 768px) 280px, 360px"
                  src="/myphoto.webp"
                  alt="Portrait of Muhammed Swalih"
                  className="hero-portrait-img"
                  width={360}
                  height={450}
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
