import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import HeroChat from '../components/HeroChat';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

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
        <motion.div
          className="hero-text-area"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Small Eyebrow / Metadata */}
          <motion.div variants={itemVariants} className="hero-eyebrow">
            <span className="eyebrow-text">{personalInfo.roleLabel}</span>
          </motion.div>

          {/* 2. Main Heading: Two-line Name */}
          <motion.h1 variants={itemVariants} className="hero-heading">
            <span className="hero-name-line">Muhammed</span>
            <span className="hero-name-line">Swalih P.</span>
          </motion.h1>

          {/* 3. Primary Title */}
          <motion.h2 variants={itemVariants} className="hero-primary-title">
            <span>Computer Science Student</span>
            <span className="title-amp"> &amp; Web Developer</span>
          </motion.h2>

          {/* 4. Description */}
          <motion.p variants={itemVariants} className="hero-description">
            {personalInfo.bio}
          </motion.p>

          {/* 5. Action Buttons */}
          <motion.div variants={itemVariants} className="hero-button-group">
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
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
              className="editorial-btn hero-btn-secondary"
              aria-label="Let's connect"
            >
              <span>Let's connect</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </motion.div>

          {/* 6. Grounded AI Visitor Note ("the sticky note that talks back") */}
          <motion.div variants={itemVariants} className="hero-chat-container">
            <HeroChat />
          </motion.div>
        </motion.div>

        {/* Right / Visual Area: Art-Directed Editorial Portrait */}
        <motion.div
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
                  src={personalInfo.profileImage}
                  alt="Portrait of Muhammed Swalih"
                  className="hero-portrait-img"
                  width={360}
                  height={450}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
