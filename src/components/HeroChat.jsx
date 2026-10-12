/**
 * HeroChat — Lean resting gadget card + lazy chat overlay.
 *
 * Split strategy:
 *   • This file (HeroChat.jsx) stays in the initial bundle — just the
 *     3D robot card, all state, and all logic. No heavy JSX DOM tree.
 *   • ChatOverlay.jsx is lazy-loaded on first open and pre-fetched on
 *     hover/focus so the chunk is in cache by the time the user clicks.
 *
 * Constraints preserved:
 *   - Opening/sending never scrolls the page (scrollYRef + restore)
 *   - Mobile sheet + keyboard height via visualViewport
 *   - Body-scroll lock on mobile only
 *   - AbortController + 25s timeout on every request
 *   - Rate-limit + error handling
 *   - Esc key / focus trap
 *   - Suggestion chips hidden after first message
 *   - React.Suspense fallback = null (portal not visible until loaded anyway)
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
  lazy
} from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ASSISTANT_NAME, HERO_CARD_TITLE } from '../data/chat';
import SwaiAvatar from './SwaiAvatar';

// Lazy-load the heavy chat overlay portal — only fetched when isExpanded → true.
// The dynamic import also pre-fetches on button hover/focus (see prefetchOverlay).
const ChatOverlay = lazy(() => import('./ChatOverlay'));

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

// Pre-fetch ChatOverlay chunk without rendering it (hover/focus hint)
let overlayPrefetched = false;
function prefetchOverlay() {
  if (overlayPrefetched) return;
  overlayPrefetched = true;
  // Dynamic import with no assignment triggers the network request so the
  // chunk is in disk-cache before the user clicks
  import('./ChatOverlay').catch(() => {});
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
      // Build short history payload (exclude IDs)
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
          Always in the initial bundle — never lazy-loaded.
          ========================================================================= */}
      <div className="hero-chat-container">
        <button
          ref={triggerRef}
          type="button"
          className={`swai-gadget-card ${isExpanded ? 'is-active-trigger' : ''}`}
          onClick={openChat}
          onMouseEnter={() => { setIsHovered(true); prefetchOverlay(); }}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => { setIsHovered(true); prefetchOverlay(); }}
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
          LAZY CHAT OVERLAY — only loaded & rendered when isExpanded becomes true.
          Suspense fallback=null: the portal is invisible until JS is ready anyway.
          ========================================================================= */}
      {isExpanded && (
        <Suspense fallback={null}>
          <ChatOverlay
            isMobile={isMobile}
            isExpanded={isExpanded}
            messages={messages}
            isLoading={isLoading}
            errorNotice={errorNotice}
            isRateLimited={isRateLimited}
            input={input}
            showScrollBottomBtn={showScrollBottomBtn}
            closeChat={closeChat}
            handleSendMessage={handleSendMessage}
            handleTextareaChange={handleTextareaChange}
            handleKeyDownInput={handleKeyDownInput}
            handleMessagesScroll={handleMessagesScroll}
            scrollToBottom={scrollToBottom}
            messagesContainerRef={messagesContainerRef}
            textareaRef={textareaRef}
            panelRef={panelRef}
            STARTER_QUESTIONS={STARTER_QUESTIONS}
            lastQuery={lastQuery}
          />
        </Suspense>
      )}
    </>
  );
}
