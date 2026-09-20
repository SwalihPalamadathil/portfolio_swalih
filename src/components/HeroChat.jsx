import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const STARTER_QUESTIONS = [
  "what's CamMap?",
  "what can he build?",
  "is he looking for an internship?"
];

// Hand-drawn doodle marks
function PenDoodle() {
  return (
    <svg
      className="hero-chat-doodle-icon"
      viewBox="0 0 20 20"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M 3 17 L 6.8 15.8 L 15.5 7.1 C 16.5 6.1, 16.5 4.5, 15.5 3.5 C 14.5 2.5, 12.9 2.5, 11.9 3.5 L 3.2 12.2 Z" />
      <path d="M 11.2 4.2 L 14.8 7.8" />
      <path d="M 3 17 L 4.2 13.8" />
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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const idCounterRef = useRef(0);

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
          /* RESTING STATE: Compact, Hand-drawn Sticky Note Prompt */
          <motion.button
            key="resting-note"
            type="button"
            className="hero-chat-resting-note"
            onClick={() => setIsExpanded(true)}
            aria-label="Ask me anything about my work — click to open chat"
            aria-expanded="false"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, y: 0 }
                : {
                    opacity: 1,
                    y: 0,
                    rotate: [-1.2, -1.2, -0.2, -1.2],
                    transition: {
                      y: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.45 },
                      rotate: {
                        repeat: Infinity,
                        repeatDelay: 8.5,
                        duration: 1.2,
                        ease: 'easeInOut'
                      }
                    }
                  }
            }
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    rotate: 0,
                    y: -2,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }
            }
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          >
            {/* Hand-drawn Irregular Border SVG Frame */}
            <svg
              className="hero-chat-frame-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 2.5 3 C 25 1.5, 75 2.2, 97.5 3 C 98.5 25, 97.8 75, 98 97 C 75 98.2, 25 97.4, 2 97 C 2.8 75, 1.6 25, 2.5 3 Z"
                vectorEffect="non-scaling-stroke"
                fill="var(--bg-raised)"
                stroke="var(--ink-muted)"
                strokeWidth="1.45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="hero-chat-resting-content">
              <span className="hero-chat-resting-icon" aria-hidden="true">
                <PenDoodle />
              </span>
              <span className="hero-chat-resting-text">
                ask me anything about my work
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
