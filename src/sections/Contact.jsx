import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { personalInfo } from '../data/portfolioData';

const EMAIL_UNDERLINE =
  'M 4 11 C 28 4, 52 16, 78 9 C 104 3, 128 15, 156 8 C 184 2, 210 14, 238 9 C 266 4, 292 15, 320 8 C 348 3, 372 13, 396 10';

const EMAIL_CHECK = 'M 8 12 L 20 20 L 48 5';

function PaperPlaneMark({ flying, shouldReduceMotion }) {
  return (
    <motion.svg
      className="contact-plane-svg"
      viewBox="0 0 40 32"
      width="28"
      height="22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      initial={{ x: 0, y: 0, rotate: -16, opacity: 1 }}
      animate={
        flying && !shouldReduceMotion
          ? {
              x: [0, 70, 180, 310, 420],
              y: [0, -42, -18, 48, 110],
              rotate: [-16, -38, 8, 28, 48],
              opacity: [1, 1, 1, 0.55, 0]
            }
          : { x: 0, y: 0, rotate: -16, opacity: 1 }
      }
      transition={
        flying && !shouldReduceMotion
          ? {
              duration: 1.05,
              times: [0, 0.22, 0.48, 0.76, 1],
              ease: [0.22, 1, 0.36, 1]
            }
          : { duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <path
        d="M 3.5 16.5 L 36.5 4.2 L 18.2 21.8 L 15.4 16.2 Z"
        stroke="var(--ink-muted)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 18.2 21.8 L 15.8 28.4"
        stroke="var(--ink-muted)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M 3.5 16.5 L 18.2 21.8"
        stroke="var(--ink-muted)"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

function LinkAccent() {
  return (
    <svg
      className="contact-link-accent"
      viewBox="0 0 12 12"
      width="11"
      height="11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 6 1.2 L 6.7 4.6 L 10.6 5.1 L 7.4 7.3 L 8.4 10.8 L 6 8.9 L 3.6 10.8 L 4.6 7.3 L 1.4 5.1 L 5.3 4.6 Z"
        stroke="var(--ink-muted)"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ size = 13 }) {
  return (
    <svg
      className="contact-link-accent"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="var(--ink-muted)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function DoodleLink({ href, ariaLabel, icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="contact-text-link"
    >
      {icon || <LinkAccent />}
      <span className="contact-text-link-label">{children}</span>
      <svg
        className="contact-link-underline"
        viewBox="0 0 72 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M 2 6.2 C 14 2.4, 28 8, 40 4.8 C 52 1.8, 62 7.2, 70 5"
          stroke="var(--accent)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </a>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [planeFlying, setPlaneFlying] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const revertTimer = useRef(null);

  const [localPart, domainPart] = personalInfo.email.split('@');

  useEffect(() => {
    return () => {
      if (revertTimer.current) clearTimeout(revertTimer.current);
    };
  }, []);

  const announceCopy = () => {
    setCopied(true);
    if (!shouldReduceMotion) {
      setPlaneFlying(true);
    }
    if (revertTimer.current) clearTimeout(revertTimer.current);
    revertTimer.current = setTimeout(() => {
      setCopied(false);
      setPlaneFlying(false);
    }, 1500);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      announceCopy();
      return true;
    } catch {
      try {
        const field = document.createElement('textarea');
        field.value = personalInfo.email;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.left = '-9999px';
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(field);
        if (!ok) return false;
        announceCopy();
        return true;
      } catch {
        return false;
      }
    }
  };

  const handleEmailClick = async (event) => {
    const copiedOk = await copyEmail();
    if (copiedOk) {
      event.preventDefault();
    }
  };

  const handleCopyButton = async (event) => {
    event.preventDefault();
    const copiedOk = await copyEmail();
    if (!copiedOk) {
      window.location.href = `mailto:${personalInfo.email}`;
    }
  };

  return (
    <section
      id="contact"
      className="editorial-section contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="container contact-note">
        <div className="contact-heading-row">
          <h2 id="contact-heading" className="contact-heading">
            Let&apos;s talk
          </h2>
          <span className="contact-plane-slot">
            <PaperPlaneMark
              key={planeFlying ? 'airborne' : 'perched'}
              flying={planeFlying}
              shouldReduceMotion={shouldReduceMotion}
            />
          </span>
        </div>

        <div className="contact-email-stage">
          <a
            href={`mailto:${personalInfo.email}`}
            className="contact-display-email"
            onClick={handleEmailClick}
            aria-label={`Email ${personalInfo.email}. Click to copy, or open in your mail app if copying is unavailable.`}
          >
            {localPart}
            <wbr />
            @{domainPart}
          </a>

          {copied ? (
            <svg
              className="contact-email-check"
              viewBox="0 0 56 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                d={EMAIL_CHECK}
                stroke="var(--accent)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            </svg>
          ) : (
            <svg
              className="contact-email-underline"
              viewBox="0 0 400 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <motion.path
                d={EMAIL_UNDERLINE}
                stroke="var(--accent)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            </svg>
          )}

          <div className="contact-email-actions">
            <button
              type="button"
              className="contact-copy-mark"
              onClick={handleCopyButton}
              aria-label={copied ? 'Email copied to clipboard' : 'Copy email address'}
            >
              <svg
                viewBox="0 0 28 28"
                width="22"
                height="22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="8.2"
                  y="4.4"
                  width="14.2"
                  height="16.4"
                  rx="1.6"
                  stroke="currentColor"
                  strokeWidth="1.55"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(4 15 12)"
                />
                <rect
                  x="4.4"
                  y="8.2"
                  width="14.2"
                  height="16.4"
                  rx="1.6"
                  stroke="currentColor"
                  strokeWidth="1.55"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(-3 11 16)"
                />
              </svg>
            </button>

            <AnimatePresence>
              {copied && (
                <motion.span
                  className="contact-copied-caption"
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: shouldReduceMotion ? 0 : 0, y: shouldReduceMotion ? 0 : -2 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
                >
                  copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="contact-availability-note">{personalInfo.availabilityLine}</p>

        <nav className="contact-plain-links" aria-label="Profiles">
          <DoodleLink
            href={personalInfo.instagram}
            ariaLabel="Instagram profile (opens in new tab)"
            icon={<InstagramIcon />}
          >
            Instagram
          </DoodleLink>
          <DoodleLink
            href={personalInfo.linkedin}
            ariaLabel="LinkedIn profile (opens in new tab)"
          >
            LinkedIn
          </DoodleLink>
        </nav>

        <div className="contact-live" aria-live="polite" aria-atomic="true">
          {copied ? 'Email copied' : ''}
        </div>
      </div>
    </section>
  );
}
