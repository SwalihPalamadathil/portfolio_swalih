import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ArrowUp } from 'lucide-react';

const MOBILE_BREAKPOINT = 768;

const STARTER_QUESTIONS = [
  "what's CamMap?",
  "what can he build?",
  "is he looking for an internship?"
];

const ROTATING_PROMPTS = [
  "about CamMap, skills, or experience",
  "what I'm currently learning",
  "or just say hi!"
];

// Hand-drawn speech-scribble doodle mark for the resting trigger card
function SpeechScribbleDoodle({ shouldReduceMotion }) {
  return (
    <svg
      className="hero-chat-speech-doodle"
      viewBox="0 0 26 24"
      width="22"
      height="20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 3.2 5.5 C 3 3.8, 4.4 2.4, 7.2 2.2 C 13.5 1.8, 19.2 2.1, 22.4 2.8 C 24.2 3.3, 24.8 4.8, 24.6 7.4 C 24.3 10.8, 24.4 13.5, 23 15.6 C 21.8 17.2, 19.6 17.5, 15.5 17.5 L 12.8 21.5 C 12.1 22.5, 10.8 22, 11.2 20.5 L 11.8 17.5 C 7 17.4, 4.6 16.9, 3.5 15.2 C 2.3 13.2, 2.6 9.5, 3.2 5.5 Z"
        className="hero-chat-bubble-outline"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M 6.8 9.5 C 9 7.2, 11.2 11.8, 13.8 9.2 C 15.8 7.2, 17.8 11.2, 19.5 9"
        className="hero-chat-scribble-stroke"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={
          shouldReduceMotion
            ? { pathLength: 1, opacity: 1 }
            : {
                pathLength: [0, 1, 1, 0],
                opacity: [0.35, 1, 1, 0.35],
                transition: {
                  duration: 4.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.45, 0.85, 1]
                }
              }
        }
      />
      <motion.path
        d="M 8 13.5 C 10.5 12.4, 13 14, 16 13"
        className="hero-chat-scribble-stroke-sub"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        animate={
          shouldReduceMotion
            ? { pathLength: 1, opacity: 0.85 }
            : {
                pathLength: [0, 1, 1, 0],
                opacity: [0.2, 0.85, 0.85, 0.2],
                transition: {
                  duration: 4.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0.15, 0.55, 0.85, 1]
                }
              }
        }
      />
    </svg>
  );
}

function ThinkingDots({ shouldReduceMotion }) {
  if (shouldReduceMotion) {
    return <span className="hero-chat-thinking-static">thinking…</span>;
  }

  return (
    <span className="hero-chat-thinking-wrap" aria-label="Thinking">
      <motion.span
        className="hero-chat-dot"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      />
      <motion.span
        className="hero-chat-dot"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.18 }}
      />
      <motion.span
        className="hero-chat-dot"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.36 }}
      />
    </span>
  );
}

export default function HeroChat() {
  const shouldReduceMotion = useReducedMotion();

  // Responsive breakpoint tracking without layout shifts
  const isMobile = React.useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
      if (mql.addEventListener) {
        mql.addEventListener('change', callback);
        return () => mql.removeEventListener('change', callback);
      } else {
        mql.addListener(callback);
        return () => mql.removeListener(callback);
      }
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches : false),
    () => false
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const scrollYRef = useRef(0);
  const idCounterRef = useRef(0);
  const lastQueryRef = useRef('');
  const isNearBottomRef = useRef(true);

  // Rotate micro-copy every 4.5s when idle and before first interaction
  useEffect(() => {
    if (shouldReduceMotion || isExpanded || hasInteracted || isHovered) return;
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion, isExpanded, hasInteracted, isHovered]);

  // Mobile visualViewport listener for keyboard height
  useEffect(() => {
    if (!isExpanded || !isMobile || typeof window === 'undefined' || !window.visualViewport) return;

    const updateViewportHeight = () => {
      if (window.visualViewport) {
        document.documentElement.style.setProperty(
          '--vvh',
          `${window.visualViewport.height}px`
        );
      }
    };

    updateViewportHeight();
    const vv = window.visualViewport;
    vv.addEventListener('resize', updateViewportHeight);
    vv.addEventListener('scroll', updateViewportHeight);

    return () => {
      vv.removeEventListener('resize', updateViewportHeight);
      vv.removeEventListener('scroll', updateViewportHeight);
      document.documentElement.style.removeProperty('--vvh');
    };
  }, [isExpanded, isMobile]);

  // Lock body scroll ONLY on mobile while sheet is open, restoring exact previous scroll position
  useEffect(() => {
    if (isExpanded && isMobile) {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isExpanded, isMobile]);

  // Focus input with preventScroll: true when panel opens
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus({ preventScroll: true });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Scoped smooth scroll ONLY inside messages container
  const scrollToBottom = useCallback((smooth = true) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: shouldReduceMotion || !smooth ? 'auto' : 'smooth'
    });
    setShowScrollBottomBtn(false);
    isNearBottomRef.current = true;
  }, [shouldReduceMotion]);

  // Monitor scroll in messages container to detect if user scrolled up
  const handleMessagesScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom <= 80;
    isNearBottomRef.current = nearBottom;
    if (nearBottom && showScrollBottomBtn) {
      setShowScrollBottomBtn(false);
    }
  }, [showScrollBottomBtn]);

  // Auto-scroll on new messages or loading only if already near bottom
  useEffect(() => {
    if (!isExpanded) return;
    if (isNearBottomRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom(!shouldReduceMotion);
      });
    } else {
      setShowScrollBottomBtn(true);
    }
  }, [messages, isLoading, isExpanded, shouldReduceMotion, scrollToBottom]);

  const openChat = () => {
    scrollYRef.current = window.scrollY || window.pageYOffset || 0;
    setHasInteracted(true);
    setIsExpanded(true);
  };

  const closeChat = () => {
    setIsExpanded(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  // Keyboard navigation & Esc / Focus trap
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDownGlobal = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeChat();
      } else if (e.key === 'Tab' && isMobile && panelRef.current) {
        // Focus trap on mobile sheet
        const focusable = panelRef.current.querySelectorAll(
          'button:not([disabled]), [href], textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isExpanded, isMobile]);

  // API Message Send Logic (AI logic, prompt payload and keys preserved strictly)
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading || isRateLimited) return;

    lastQueryRef.current = query;
    setErrorNotice(null);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    idCounterRef.current += 1;
    const userMessage = { role: 'user', text: query, id: `user-${idCounterRef.current}` };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build short history payload (exclude IDs)
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      const data = await res.json();

      if (res.status === 429) {
        setIsRateLimited(true);
        setErrorNotice(
          data.message ||
            "You've reached the conversation limit for this session. Feel free to connect directly with Muhammed via email at swalihpalamadathil@gmail.com!"
        );
      } else if (!res.ok) {
        setErrorNotice(
          data.message ||
            "I'm having trouble connecting right now. Please feel free to email Muhammed directly at swalihpalamadathil@gmail.com."
        );
      } else if (data.reply) {
        idCounterRef.current += 1;
        const botMessage = {
          role: 'assistant',
          text: data.reply,
          id: `bot-${idCounterRef.current}`
        };
        setMessages([...updatedMessages, botMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setErrorNotice(
        "I couldn't reach the server just now. You can email Muhammed directly at swalihpalamadathil@gmail.com."
      );
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus({ preventScroll: true });
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    const newHeight = Math.min(target.scrollHeight, 120);
    target.style.height = `${newHeight}px`;
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* =========================================================================
          HERO INLINE TRIGGER CARD (Never changes size or pushes page content)
          ========================================================================= */}
      <div className="hero-chat-container">
        <button
          ref={triggerRef}
          type="button"
          className={`hero-chat-resting-note ${isExpanded ? 'is-active-trigger' : ''}`}
          onClick={openChat}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-label="Ask me anything about my work — click to open chat"
          aria-expanded={isExpanded}
          aria-haspopup="dialog"
          aria-controls="hero-ai-chat-panel"
        >
          {/* Hand-drawn Irregular Border SVG Frame */}
          <svg
            className="hero-chat-frame-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 2 3 C 26 1.4, 74 2.2, 98 2.8 C 98.8 25, 98.2 75, 98.4 97 C 74 98.2, 26 97.4, 1.8 97.2 C 2.4 75, 1.4 25, 2 3 Z"
              vectorEffect="non-scaling-stroke"
              className="hero-chat-frame-path"
            />
          </svg>

          <span className="hero-chat-resting-content">
            <span className="hero-chat-resting-icon" aria-hidden="true">
              <SpeechScribbleDoodle shouldReduceMotion={shouldReduceMotion} />
            </span>
            <span className="hero-chat-resting-copy">
              <span className="hero-chat-invite-row">
                <span className="hero-chat-invite-title">Ask me anything</span>
                <span className="hero-chat-prompt-chevron" aria-hidden="true">›</span>
              </span>
              <span className="hero-chat-detail-viewport">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={promptIndex}
                    className="hero-chat-detail-text"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -3 }}
                    transition={{ duration: shouldReduceMotion ? 0.05 : 0.28, ease: 'easeOut' }}
                  >
                    {ROTATING_PROMPTS[promptIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </span>
        </button>
      </div>

      {/* =========================================================================
          FIXED-POSITION CHAT PANEL (Desktop: Floating Bottom-Right, Mobile: Bottom Sheet)
          ========================================================================= */}
      <AnimatePresence>
        {isExpanded && (
          <div className="hero-chat-portal-wrapper">
            {/* Mobile backdrop (tapping closes sheet; desktop stays interactive without backdrop) */}
            {isMobile && (
              <motion.div
                className="hero-chat-backdrop"
                onClick={closeChat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
                aria-hidden="true"
              />
            )}

            <motion.div
              ref={panelRef}
              id="hero-ai-chat-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Ask Swalih anything"
              className={`hero-chat-fixed-panel ${isMobile ? 'is-mobile-sheet' : 'is-desktop-floating'}`}
              initial={
                isMobile
                  ? { y: '100%', opacity: shouldReduceMotion ? 1 : 0.6 }
                  : { opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: 16 }
              }
              animate={
                isMobile
                  ? { y: 0, opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={
                isMobile
                  ? { y: '100%', opacity: shouldReduceMotion ? 1 : 0 }
                  : { opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: 12 }
              }
              transition={{
                duration: shouldReduceMotion ? 0.05 : isMobile ? 0.3 : 0.24,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {/* Header Bar */}
              <div className="hero-chat-panel-header">
                <div className="hero-chat-header-text">
                  <div className="hero-chat-header-title-row">
                    <span className="hero-chat-header-dot" aria-hidden="true" />
                    <h3 className="hero-chat-panel-title">Ask Swalih anything</h3>
                  </div>
                  <p className="hero-chat-panel-subtitle">
                    Grounded in my portfolio data &amp; projects
                  </p>
                </div>

                <button
                  type="button"
                  className="hero-chat-panel-close-btn"
                  onClick={closeChat}
                  aria-label="Close chat (Escape)"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Messages Scroll Container (Scrolled ONLY within this container) */}
              <div
                ref={messagesContainerRef}
                className="hero-chat-messages-container"
                onScroll={handleMessagesScroll}
                aria-live="polite"
                aria-atomic="false"
              >
                {/* Empty State Welcome Intro */}
                {messages.length === 0 && (
                  <div className="hero-chat-empty-intro">
                    <div className="hero-chat-empty-icon" aria-hidden="true">
                      <SpeechScribbleDoodle shouldReduceMotion={shouldReduceMotion} />
                    </div>
                    <h4 className="hero-chat-empty-title">Hi! What would you like to know?</h4>
                    <p className="hero-chat-empty-text">
                      I can tell you about CamMap, Muhammed&apos;s frontend skills, internship experience, or academic background.
                    </p>
                  </div>
                )}

                {/* Messages Stream */}
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    className={`hero-chat-bubble-row is-${m.role}`}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
                  >
                    <div className="hero-chat-bubble-label">
                      {m.role === 'user' ? 'You' : 'Swalih (Assistant)'}
                    </div>
                    <div className="hero-chat-bubble-content">
                      {m.text}
                    </div>
                  </motion.div>
                ))}

                {/* Assistant Thinking Indicator */}
                {isLoading && (
                  <div className="hero-chat-bubble-row is-assistant is-thinking-row">
                    <div className="hero-chat-bubble-label">Swalih (Assistant)</div>
                    <div className="hero-chat-bubble-content is-thinking-bubble">
                      <ThinkingDots shouldReduceMotion={shouldReduceMotion} />
                    </div>
                  </div>
                )}

                {/* Error Notice with Retry Button */}
                {errorNotice && (
                  <div className="hero-chat-error-card" role="alert">
                    <p className="hero-chat-error-text">{errorNotice}</p>
                    {lastQueryRef.current && (
                      <button
                        type="button"
                        className="hero-chat-retry-btn"
                        onClick={() => handleSendMessage(lastQueryRef.current)}
                        disabled={isLoading}
                      >
                        Try again
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Floating "New message ↓" Chip if User Scrolled Up */}
              <AnimatePresence>
                {showScrollBottomBtn && (
                  <motion.button
                    type="button"
                    className="hero-chat-scroll-bottom-btn"
                    onClick={() => scrollToBottom(true)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16 }}
                    aria-label="Scroll to newest message"
                  >
                    <span>New message ↓</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Starter Question Suggestions (Horizontal row, hidden after first message) */}
              {messages.length === 0 && (
                <div className="hero-chat-suggestions-bar" aria-label="Suggested starter questions">
                  <div className="hero-chat-suggestions-scroll">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="hero-chat-suggestion-chip"
                        onClick={() => handleSendMessage(q)}
                        disabled={isLoading}
                      >
                        <span className="hero-chat-chip-tick">›</span>
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area (Pinned at bottom of panel, never shifts page) */}
              {!isRateLimited && (
                <div className="hero-chat-input-stage">
                  <div className="hero-chat-input-wrapper">
                    <textarea
                      ref={textareaRef}
                      className="hero-chat-textarea"
                      placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
                      value={input}
                      onChange={handleTextareaChange}
                      onKeyDown={handleKeyDownInput}
                      maxLength={500}
                      rows={1}
                      disabled={isLoading}
                      aria-label="Ask a question about Muhammed"
                    />

                    <button
                      type="button"
                      className="hero-chat-send-action-btn"
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || !input.trim()}
                      aria-label="Send message"
                    >
                      <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
