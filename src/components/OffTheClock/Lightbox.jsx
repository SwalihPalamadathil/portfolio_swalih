import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSelectPhoto,
  triggerElementRef
}) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const photo = photos && currentIndex != null ? photos[currentIndex] : null;
  const total = photos?.length || 0;

  // Preload neighbor images
  useEffect(() => {
    if (!isOpen || currentIndex == null || !photos) return;
    const nextIdx = (currentIndex + 1) % total;
    const prevIdx = (currentIndex - 1 + total) % total;

    if (photos[nextIdx]) {
      const imgNext = new Image();
      imgNext.src = photos[nextIdx].src;
    }
    if (photos[prevIdx]) {
      const imgPrev = new Image();
      imgPrev.src = photos[prevIdx].src;
    }
  }, [isOpen, currentIndex, total, photos]);

  // Lock body scroll and restore focus
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const triggerEl = triggerElementRef?.current;

      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        if (triggerEl) {
          triggerEl.focus();
        }
      };
    }
  }, [isOpen, triggerElementRef]);

  // Keyboard navigation & Esc to close
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        onPrev();
      } else {
        onNext();
      }
    }
  };

  if (!isOpen || !photo) return null;

  const formattedCounter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <AnimatePresence>
      <div
        className="otc-lightbox-backdrop"
        onClick={onClose}
        aria-hidden="true"
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo view: ${photo.caption}`}
          className="otc-lightbox-dialog"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            ref={closeBtnRef}
            type="button"
            className="otc-lightbox-close"
            onClick={onClose}
            aria-label="Close photo preview (Escape)"
          >
            <X size={24} />
          </button>

          {/* Navigation previous */}
          <button
            type="button"
            className="otc-lightbox-nav otc-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous photo (Left arrow)"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Navigation next */}
          <button
            type="button"
            className="otc-lightbox-nav otc-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next photo (Right arrow)"
          >
            <ChevronRight size={22} />
          </button>

          {/* Main Polaroid View */}
          <div className="otc-lightbox-card">
            <div className="otc-lightbox-photo-wrap">
              <img
                src={photo.src}
                alt={photo.alt}
                className="otc-lightbox-img"
                style={{ objectPosition: photo.objectPosition || 'center center' }}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="otc-lightbox-footer">
              <div>
                <h3 className="otc-lightbox-caption">{photo.caption}</h3>
                <div className="otc-lightbox-tag">{photo.tag}</div>
              </div>
              <div className="otc-lightbox-counter">{formattedCounter}</div>
            </div>
          </div>

          {/* Thumbnail Strip at Bottom (desktop/tablet) */}
          <div className="otc-lightbox-thumbs" aria-label="Photo thumbnails">
            {photos.map((p, idx) => (
              <button
                key={`thumb-${p.id}`}
                type="button"
                className={`otc-lightbox-thumb-btn ${idx === currentIndex ? 'is-active' : ''}`}
                onClick={() => onSelectPhoto(idx)}
                aria-label={`Jump to photo ${idx + 1}: ${p.caption}`}
              >
                <img
                  src={p.src}
                  alt=""
                  className="otc-lightbox-thumb-img"
                  style={{ objectPosition: p.objectPosition || 'center center' }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
