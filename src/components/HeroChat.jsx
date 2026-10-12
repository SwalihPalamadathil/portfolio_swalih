import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ArrowUp } from 'lucide-react';
import { ASSISTANT_NAME, ASSISTANT_SUBTITLE, HERO_CARD_TITLE } from '../data/chat';
import SwaiAvatar from './SwaiAvatar';

const REQUEST_TIMEOUT_MS = 25000; // 25 s abort timeout

const MOBILE_BREAKPOINT = 768;

const STARTER_QUESTIONS = [
  "what's CamMap?",
  "what can he build?",
  "is he looking for an internship?"
];

const ROTATING_PROMPTS = [
  "About CamMap, skills, or my experience",
  "What Swalih is currently learning",
  "Or just say hi!"
];

function ThinkingDots({ shouldReduceMotion }) {
  if (shouldReduceMotion) {
    return <span className="hero-chat-thinking-static">thinking…</span>;
  }

  return (
    <span className="hero-chat-thinking-wrap" aria-label="Thinking">
      <m.span
        className="hero-chat-dot"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      />
      <m.span
        className="hero-chat-dot"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.18 }}
      />
      <m.span
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
  const [lastQuery, setLastQuery] = useState('');

  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const scrollYRef = useRef(0);
  const idCounterRef = useRef(0);
  const isNearBottomRef = useRef(true);
  // Track the active AbortController so we can cancel on unmount or close
  const abortControllerRef = useRef(null);

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
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        const targetScroll = scrollYRef.current;
        window.scrollTo({ top: targetScroll, behavior: 'instant' });
      };
    }
  }, [isExpanded, isMobile]);

  // Focus input with preventScroll: true when panel opens
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus({ preventScroll: true });
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Scoped smooth scroll ONLY inside messages container (never scrolls window)
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

  // Auto-scroll on new messages or loading only if already near bottom (~80px)
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
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    scrollYRef.current = currentScroll;
    setHasInteracted(true);
    setIsExpanded(true);
  };

  const closeChat = () => {
    // Abort any inflight request when the panel closes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsExpanded(false);
    setIsLoading(false);
    // Verification check: ensure window.scrollY is exactly preserved
    requestAnimationFrame(() => {
      const currentScroll = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(currentScroll - scrollYRef.current) > 1) {
        window.scrollTo({ top: scrollYRef.current, behavior: 'instant' });
      }
      triggerRef.current?.focus({ preventScroll: true });
    });
  };

  // Abort inflight requests on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  // API Message Send Logic — hardened with AbortController, timeout, content-type
  // guard, response shape validation, and friendly error messages for every failure mode.
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading || isRateLimited) return;

    setLastQuery(query);
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

    // Cancel any previous inflight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Timeout: abort after REQUEST_TIMEOUT_MS
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      // Build short history payload (exclude IDs) — renamed loop var to avoid
      // shadowing the `m` import from framer-motion
      const historyPayload = messages.slice(-5).map((msg) => ({
        role: msg.role,
        text: msg.text
      }));

      let res;
      try {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, history: historyPayload }),
          signal: controller.signal
        });
      } catch (fetchErr) {
        // Network offline, timeout abort, or DNS failure
        if (fetchErr && fetchErr.name === 'AbortError') {
          // Aborted by timeout or by closing the panel — don't show error if panel closed
          if (!controller.signal.aborted || abortControllerRef.current !== controller) {
            setErrorNotice('The request timed out. Please try again.');
          }
        } else if (!navigator.onLine) {
          setErrorNotice("You're offline. Please check your connection and try again.");
        } else {
          setErrorNotice("Couldn't reach the server. Please try again.");
        }
        return;
      }

      // Guard: check Content-Type before attempting JSON parse.
      // A missing /api route returns HTML 404 — parsing that throws and crashes.
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.error('[HeroChat] Non-JSON response from /api/chat:', res.status, contentType);
        if (res.status === 404) {
          setErrorNotice('The chat endpoint was not found (404). Please contact Swalih directly at swalihpalamadathil@gmail.com.');
        } else {
          setErrorNotice(`${ASSISTANT_NAME} is having trouble connecting right now. Please feel free to email Swalih directly at swalihpalamadathil@gmail.com.`);
        }
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error('[HeroChat] JSON parse error:', parseErr);
        setErrorNotice("Received an unexpected response. Please try again.");
        return;
      }

      if (res.status === 429) {
        setIsRateLimited(true);
        setErrorNotice(
          (typeof data?.message === 'string' ? data.message : null) ||
          (typeof data?.reply === 'string' ? data.reply : null) ||
          "You've reached the conversation limit for this session. Feel free to connect directly with Swalih via email at swalihpalamadathil@gmail.com!"
        );
      } else if (res.status >= 500) {
        setErrorNotice(`${ASSISTANT_NAME} is taking a short break. Please try again soon.`);
      } else if (!res.ok) {
        setErrorNotice(
          (typeof data?.message === 'string' ? data.message : null) ||
          `${ASSISTANT_NAME} is having trouble connecting right now. Please feel free to email Swalih directly at swalihpalamadathil@gmail.com.`
        );
      } else {
        // Validate response shape: expect { reply: string }
        const replyText = typeof data?.reply === 'string' ? data.reply.trim() : '';
        if (!replyText) {
          setErrorNotice("I got an empty response. Please try asking again.");
        } else {
          idCounterRef.current += 1;
          const botMessage = {
            role: 'assistant',
            text: replyText,
            id: `bot-${idCounterRef.current}`
          };
          setMessages([...updatedMessages, botMessage]);
        }
      }
    } catch (err) {
      // Catch-all: never let any error propagate to React render
      console.error('[HeroChat] Unexpected chat error:', err);
      if (err && err.name !== 'AbortError') {
        setErrorNotice(`${ASSISTANT_NAME} couldn't get an answer just now. You can email Swalih directly at swalihpalamadathil@gmail.com.`);
      }
    } finally {
      clearTimeout(timeoutId);
      // Only clear the ref if this controller is still the active one
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
      try { textareaRef.current?.focus({ preventScroll: true }); } catch {}
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    const newHeight = Math.min(target.scrollHeight, 110);
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
          HERO INLINE TRIGGER CARD (Tactile 3D Robot Assistant Gadget Card)
          ========================================================================= */}
      <div className="hero-chat-container">
        <button
          ref={triggerRef}
          type="button"
          className={`swai-gadget-card ${isExpanded ? 'is-active-trigger' : ''}`}
          onClick={openChat}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-label={`Ask ${ASSISTANT_NAME} anything about Swalih's work — click to open chat`}
          aria-expanded={isExpanded}
          aria-haspopup="dialog"
          aria-controls="hero-ai-chat-panel"
        >
          {/* Left: 3D Robot Mascot Avatar Pod */}
          <div className="swai-gadget-avatar-pod" aria-hidden="true">
            <div className="swai-gadget-avatar-float">
              <SwaiAvatar size={62} className="swai-gadget-avatar-img" />
              <span className="swai-gadget-antenna-halo" />
            </div>
            <span className="swai-gadget-ambient-shadow" />
          </div>

          {/* Right: Copy & Interactivity */}
          <div className="swai-gadget-text-block">
            <div className="swai-gadget-header-row">
              <span className="swai-gadget-title">{HERO_CARD_TITLE}</span>
              <span className="swai-gadget-arrow" aria-hidden="true">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="swai-gadget-arrow-icon"
                >
                  <path
                    d="M 3 8 H 13 M 9 4 L 13 8 L 9 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="swai-gadget-detail-viewport">
              <AnimatePresence mode="wait">
                <m.span
                  key={promptIndex}
                  className="swai-gadget-detail-text"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -3 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.28, ease: 'easeOut' }}
                >
                  {ROTATING_PROMPTS[promptIndex]}
                </m.span>
              </AnimatePresence>
            </div>
          </div>
        </button>
      </div>

      {/* =========================================================================
          FIXED-POSITION CHAT OVERLAY VIA REACT PORTAL
          Desktop: Floating Bottom-Right (400px), Mobile: Full-screen Sheet
          Page layout and scroll position NEVER change
          ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isExpanded && (
              <div className="hero-chat-portal-wrapper">
                {/* Mobile backdrop (tapping closes sheet; desktop stays interactive without backdrop) */}
                {isMobile && (
                  <m.div
                    className="hero-chat-backdrop"
                    onClick={closeChat}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
                    aria-hidden="true"
                  />
                )}

                <m.div
                  ref={panelRef}
                  id="hero-ai-chat-panel"
                  role="dialog"
                  aria-modal={isMobile ? 'true' : 'false'}
                  aria-label={`Ask ${ASSISTANT_NAME} anything`}
                  data-lenis-prevent="true"
                  className={`hero-chat-fixed-panel ${isMobile ? 'is-mobile-sheet' : 'is-desktop-floating'}`}
                  initial={
                    isMobile
                      ? { y: '100%' }
                      : { opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: 16 }
                  }
                  animate={
                    isMobile
                      ? { y: 0 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  exit={
                    isMobile
                      ? { y: '100%' }
                      : { opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: 12 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.05 : isMobile ? 0.3 : 0.25,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {/* Header Bar */}
                  <div className="hero-chat-panel-header">
                    <div className="hero-chat-header-main">
                      <SwaiAvatar size={40} className="hero-chat-header-avatar" />
                      <div className="hero-chat-header-text">
                        <div className="hero-chat-header-title-row">
                          <span className="hero-chat-header-dot" aria-hidden="true" />
                          <h3 className="hero-chat-panel-title">{ASSISTANT_NAME}</h3>
                        </div>
                        <p className="hero-chat-panel-subtitle">
                          {ASSISTANT_SUBTITLE}
                        </p>
                      </div>
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
                    data-lenis-prevent="true"
                    aria-live="polite"
                    aria-atomic="false"
                  >
                    {/* Empty State Welcome Intro */}
                    {messages.length === 0 && (
                      <div className="hero-chat-empty-intro">
                        <div className="hero-chat-empty-icon" aria-hidden="true">
                          <SwaiAvatar size={44} />
                        </div>
                        <h4 className="hero-chat-empty-title">Hi, I&apos;m {ASSISTANT_NAME}</h4>
                        <p className="hero-chat-empty-text">
                          Swalih&apos;s AI assistant. Ask me about Swalih&apos;s projects, skills or experience.
                        </p>
                      </div>
                    )}

                    {/* Messages Stream */}
                    {/* IMPORTANT: loop var renamed `msg` to avoid shadowing the
                        framer-motion `m` import — shadowing caused m.div to be
                        undefined inside the callback, crashing the render tree */}
                    {messages.map((msg, index) => {
                      const isAssistant = msg.role === 'assistant';
                      const isFirstInAssistantGroup =
                        isAssistant && (index === 0 || messages[index - 1].role !== 'assistant');

                      return (
                        <m.div
                          key={msg.id}
                          className={`hero-chat-bubble-row is-${msg.role}`}
                          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
                        >
                          {isAssistant ? (
                            <div className="hero-chat-bubble-with-avatar">
                              <div className="hero-chat-avatar-slot" aria-hidden="true">
                                {isFirstInAssistantGroup ? (
                                  <SwaiAvatar size={32} />
                                ) : (
                                  <span className="hero-chat-avatar-spacer" />
                                )}
                              </div>
                              <div className="hero-chat-bubble-body">
                                <div className="hero-chat-bubble-label">
                                  <span className="hero-chat-assistant-name">{ASSISTANT_NAME}</span>
                                </div>
                                <div className="hero-chat-bubble-content">
                                  {typeof msg.text === 'string' ? msg.text : ''}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="hero-chat-bubble-label">You</div>
                              <div className="hero-chat-bubble-content">
                                {typeof msg.text === 'string' ? msg.text : ''}
                              </div>
                            </>
                          )}
                        </m.div>
                      );
                    })}

                    {/* Assistant Thinking Indicator */}
                    {isLoading && (
                      <div className="hero-chat-bubble-row is-assistant is-thinking-row">
                        <div className="hero-chat-bubble-with-avatar">
                          <div className="hero-chat-avatar-slot" aria-hidden="true">
                            <SwaiAvatar size={28} />
                          </div>
                          <div className="hero-chat-bubble-body">
                            <div className="hero-chat-bubble-label">
                              <span className="hero-chat-assistant-name">{ASSISTANT_NAME}</span>
                            </div>
                            <div className="hero-chat-bubble-content is-thinking-bubble">
                              <ThinkingDots shouldReduceMotion={shouldReduceMotion} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error Notice with Retry Button */}
                    {errorNotice && (
                      <div className="hero-chat-error-card" role="alert">
                        <p className="hero-chat-error-text">{errorNotice}</p>
                        {lastQuery && (
                          <button
                            type="button"
                            className="hero-chat-retry-btn"
                            onClick={() => handleSendMessage(lastQuery)}
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
                      <m.button
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
                      </m.button>
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
                          aria-label="Ask a question about Swalih"
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
                </m.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
