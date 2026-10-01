import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

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

// Hand-drawn speech-scribble doodle mark
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
      {/* Hand-drawn irregular speech bubble contour */}
      <path
        d="M 3.2 5.5 C 3 3.8, 4.4 2.4, 7.2 2.2 C 13.5 1.8, 19.2 2.1, 22.4 2.8 C 24.2 3.3, 24.8 4.8, 24.6 7.4 C 24.3 10.8, 24.4 13.5, 23 15.6 C 21.8 17.2, 19.6 17.5, 15.5 17.5 L 12.8 21.5 C 12.1 22.5, 10.8 22, 11.2 20.5 L 11.8 17.5 C 7 17.4, 4.6 16.9, 3.5 15.2 C 2.3 13.2, 2.6 9.5, 3.2 5.5 Z"
        className="hero-chat-bubble-outline"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Living scribble thought stroke */}
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
      {/* Secondary micro-tick */}
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

function CloseDoodle() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M 3.5 3.5 L 12.5 12.5" />
      <path d="M 12.5 3.5 L 3.5 12.5" />
    </svg>
  );
}

function SendDoodle() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M 3 10 L 17 3 L 11 17 L 9 11 Z" />
      <path d="M 9 11 L 17 3" />
    </svg>
  );
}

function SeparatorTick() {
  return (
    <div className="hero-chat-tick-wrap" aria-hidden="true">
      <svg
        viewBox="0 0 44 6"
        width="34"
        height="5"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <path d="M 2 3 C 14 1.5, 28 4.5, 42 2.5" />
      </svg>
    </div>
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
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      />
      <motion.span
        className="hero-chat-dot"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.span
        className="hero-chat-dot"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
    </span>
  );
}

export default function HeroChat() {
  const shouldReduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const idCounterRef = useRef(0);

  // Rotate micro-copy every 4.5s when idle, unhovered, and before first interaction
  useEffect(() => {
    if (shouldReduceMotion || isExpanded || hasInteracted || isHovered) return;
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion, isExpanded, hasInteracted, isHovered]);

  // Auto-scroll inside message list when new messages arrive
  useEffect(() => {
    if (isExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  }, [messages, isLoading, isExpanded, shouldReduceMotion]);

  // Focus input on expand
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle keyboard shortcuts (Escape collapses)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading || isRateLimited) return;

    setErrorNotice(null);
    setInput('');

    idCounterRef.current += 1;
    const userMessage = { role: 'user', text: query, id: `user-${idCounterRef.current}` };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build short history payload (exclude IDs)
      const historyPayload = messages.slice(-5).map(m => ({
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
    }
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`hero-chat-wrapper ${isExpanded ? 'is-expanded' : 'is-resting'}`}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* RESTING STATE: Catchy, Hand-drawn Sticky Note Prompt */
          <motion.button
            key="resting-note"
            type="button"
            className="hero-chat-resting-note"
            onClick={() => {
              setHasInteracted(true);
              setIsExpanded(true);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            aria-label="Ask me anything about my work — click to open chat"
            aria-expanded="false"
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 16,
              rotate: shouldReduceMotion ? 0 : -2.8
            }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, y: 0, rotate: 0 }
                : {
                  opacity: 1,
                  y: [16, -2, 0, 0, -1.5, 0],
                  rotate: [-2.8, -0.6, -1.2, -1.2, -0.7, -1.2],
                  transition: {
                    duration: 2.2,
                    delay: 0.35,
                    times: [0, 0.22, 0.32, 0.78, 0.88, 1],
                    ease: 'easeInOut'
                  }
                }
            }
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                  rotate: 0,
                  y: -2.5,
                  transition: { duration: 0.2, ease: 'easeOut' }
                }
            }
            whileTap={shouldReduceMotion ? {} : { scale: 0.985, y: -0.5 }}
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
          </motion.button>
        ) : (
          /* ACTIVE / EXPANDED STATE: Interactive Sticky Note Panel */
          <motion.div
            key="expanded-panel"
            className="hero-chat-expanded-panel"
            initial={{
              opacity: 0,
              height: 'auto',
              scale: shouldReduceMotion ? 1 : 0.97
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: shouldReduceMotion ? 0.05 : 0.3,
                ease: [0.22, 1, 0.36, 1]
              }
            }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.96,
              transition: { duration: 0.18 }
            }}
          >
            {/* Hand-drawn Irregular Border SVG Frame */}
            <svg
              className="hero-chat-frame-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 1.5 2 C 28 1.2, 72 1.8, 98.5 2 C 99.2 26, 98.2 74, 98.5 98 C 72 98.8, 28 98.2, 1.5 98 C 1.2 74, 1.8 26, 1.5 2 Z"
                vectorEffect="non-scaling-stroke"
                fill="var(--bg-raised)"
                stroke="var(--ink-muted)"
                strokeWidth="1.45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Header: Note title & collapse button */}
            <div className="hero-chat-panel-header">
              <div className="hero-chat-panel-title">
                <span className="hero-chat-note-pin" aria-hidden="true" />
                <span className="hero-chat-title-text">portfolio assistant</span>
              </div>
              <button
                type="button"
                className="hero-chat-close-btn"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse chat note"
              >
                <CloseDoodle />
              </button>
            </div>

            {/* Conversation Stream / Messages */}
            <div
              className="hero-chat-messages-area"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.length === 0 && (
                <div className="hero-chat-starter-view">
                  <p className="hero-chat-starter-hint">
                    Ask a question about Muhammed's skills, CamMap, or experience:
                  </p>
                  <div className="hero-chat-starter-tags">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="hero-chat-tag-btn"
                        onClick={() => handleSendMessage(q)}
                        disabled={isLoading}
                      >
                        <span className="hero-chat-tag-tick">›</span>
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, idx) => (
                <React.Fragment key={m.id}>
                  {idx > 0 && <SeparatorTick />}
                  <motion.div
                    className={`hero-chat-msg hero-chat-msg-${m.role}`}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.05 : 0.22 }}
                  >
                    <div className="hero-chat-msg-role-label">
                      {m.role === 'user' ? 'you' : 'swalih (assistant)'}
                    </div>
                    <div className="hero-chat-msg-text">{m.text}</div>
                  </motion.div>
                </React.Fragment>
              ))}

              {isLoading && (
                <>
                  {messages.length > 0 && <SeparatorTick />}
                  <div className="hero-chat-msg hero-chat-msg-assistant is-thinking">
                    <div className="hero-chat-msg-role-label">swalih (assistant)</div>
                    <div className="hero-chat-msg-text">
                      <ThinkingDots shouldReduceMotion={shouldReduceMotion} />
                    </div>
                  </div>
                </>
              )}

              {errorNotice && (
                <div className="hero-chat-error-notice" role="alert">
                  <p>{errorNotice}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Row with Hand-drawn Underline */}
            {!isRateLimited && (
              <div className="hero-chat-input-row">
                <div className="hero-chat-input-box">
                  <input
                    ref={inputRef}
                    type="text"
                    className="hero-chat-input-field"
                    placeholder="ask a question… (Enter to send)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDownInput}
                    maxLength={500}
                    disabled={isLoading}
                    aria-label="Your question about Muhammed"
                  />
                  {/* Organic hand-drawn underline */}
                  <svg
                    className="hero-chat-underline-svg"
                    viewBox="0 0 200 6"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2 3 Q 50 1, 100 4 T 198 3"
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <button
                  type="button"
                  className="hero-chat-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  <SendDoodle />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
