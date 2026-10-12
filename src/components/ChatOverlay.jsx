/**
 * ChatOverlay — lazy-loaded chat panel portal.
 *
 * Extracted from HeroChat.jsx so it only lands in the initial bundle when
 * isExpanded becomes true. The resting swAI gadget card stays in the main
 * bundle and is always immediately interactive.
 *
 * Props mirror the state/handlers managed by HeroChat:
 *   isMobile, isExpanded, shouldReduceMotion,
 *   messages, isLoading, errorNotice, isRateLimited,
 *   input, showScrollBottomBtn,
 *   ASSISTANT_NAME,
 *   closeChat, handleSendMessage, handleTextareaChange,
 *   handleKeyDownInput, handleMessagesScroll, scrollToBottom,
 *   messagesContainerRef, textareaRef, panelRef,
 *   STARTER_QUESTIONS, lastQuery
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ArrowUp } from 'lucide-react';
import SwaiAvatar from './SwaiAvatar';
import { ASSISTANT_NAME, ASSISTANT_SUBTITLE } from '../data/chat';

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

export default function ChatOverlay({
  isMobile,
  isExpanded,
  messages,
  isLoading,
  errorNotice,
  isRateLimited,
  input,
  showScrollBottomBtn,
  closeChat,
  handleSendMessage,
  handleTextareaChange,
  handleKeyDownInput,
  handleMessagesScroll,
  scrollToBottom,
  messagesContainerRef,
  textareaRef,
  panelRef,
  STARTER_QUESTIONS,
  lastQuery,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isExpanded && (
        <div className="hero-chat-portal-wrapper">
          {/* Mobile backdrop (tapping closes sheet) */}
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

            {/* Messages Scroll Container */}
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

            {/* Floating "New message ↓" chip */}
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

            {/* Starter Suggestions */}
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

            {/* Input Area */}
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
  );
}
