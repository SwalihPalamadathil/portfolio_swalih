import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Shuffle, Grid, Image as ImageIcon, Sparkles, ZoomIn, Layers } from 'lucide-react';
import { photos as allPhotos, photoCollectionConfig } from '../../data/offTheClock';
import Lightbox from './Lightbox';

/**
 * Mobile breakpoint single constant (widths <= 768px use mobile collection)
 */
export const MOBILE_BREAKPOINT = 768;

// Tunable constants
const SPRING_HOVER = { type: 'spring', stiffness: 350, damping: 25 };
const DEVELOP_DURATION = 0.55;
const ROTATION_RANGE = 3.6;

// Underneath cards for the collapsed pile aesthetic
const UNDERNEATH_CARDS = [
  { rot: -7.5, x: -14, y: 8, zIndex: 1 },
  { rot: 6.8, x: 12, y: -6, zIndex: 2 },
  { rot: -4.2, x: -8, y: 5, zIndex: 3 },
  { rot: 4.8, x: 10, y: 4, zIndex: 4 }
];

export default function PhotoBooth() {
  const shouldReduceMotion = useReducedMotion();
  const boardRef = useRef(null);
  const swipeRef = useRef(null);
  const activeTriggerRef = useRef(null);
  const scrollRafRef = useRef(null);

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

  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  });

  const [photosList, setPhotosList] = useState(allPhotos);
  const [viewMode, setViewMode] = useState('polaroid'); // 'polaroid' | 'contact' (desktop)
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const topZIndexRef = useRef(10);
  const [cardZIndices, setCardZIndices] = useState({});

  // Mobile Collection states
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('swipe'); // 'swipe' | 'contact'
  const [activeCenterIndex, setActiveCenterIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const coverIndex = photoCollectionConfig?.coverIndex ?? 0;
  const coverPhoto = photosList[coverIndex] || photosList[0];

  // Shuffle card rotations smoothly
  const handleShuffle = () => {
    setPhotosList((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (Math.random() * (ROTATION_RANGE * 2) - ROTATION_RANGE).toFixed(1)
      }))
    );
  };

  const handleCardDragStart = (id) => {
    topZIndexRef.current += 1;
    const nextZ = topZIndexRef.current;
    setCardZIndices((indices) => ({ ...indices, [id]: nextZ }));
  };

  const openLightbox = (index, event) => {
    if (event && event.currentTarget) {
      activeTriggerRef.current = event.currentTarget;
    }
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const showPrevPhoto = () => {
    setActivePhotoIndex((prev) =>
      prev > 0 ? prev - 1 : photosList.length - 1
    );
  };

  const showNextPhoto = () => {
    setActivePhotoIndex((prev) =>
      prev < photosList.length - 1 ? prev + 1 : 0
    );
  };

  const selectPhotoByIndex = (index) => {
    setActivePhotoIndex(index);
  };

  // Scroll mobile swipe board smoothly to specific index
  const scrollToCard = useCallback((index) => {
    if (!swipeRef.current) return;
    const cards = swipeRef.current.querySelectorAll('.otc-polaroid-mobile');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      setActiveCenterIndex(index);
    }
  }, []);

  // Track centered card in swipe board based on geometry
  const handleSwipeScroll = useCallback(() => {
    if (!swipeRef.current) return;
    const container = swipeRef.current;
    const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;
    const cards = container.querySelectorAll('.otc-polaroid-mobile');

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeCenterIndex) {
      setActiveCenterIndex(closestIndex);
    }
  }, [activeCenterIndex]);

  const onScrollThrottled = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      handleSwipeScroll();
      scrollRafRef.current = null;
    });
  }, [handleSwipeScroll]);

  const openCollection = () => {
    setIsCollectionOpen(true);
    setAnnouncement(`Collection opened, ${photosList.length} photos`);
    setTimeout(() => {
      scrollToCard(coverIndex);
    }, 120);
  };

  const collapseCollection = () => {
    setIsCollectionOpen(false);
    setMobileViewMode('swipe');
    setAnnouncement('Collection closed');
  };

  // Keyboard navigation on mobile open board
  useEffect(() => {
    if (!isMobile || !isCollectionOpen) return;
    const handleKeyDown = (e) => {
      if (activePhotoIndex !== null) return; // Lightbox manages its own keys
      if (e.key === 'Escape') {
        e.preventDefault();
        collapseCollection();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(photosList.length - 1, activeCenterIndex + 1);
        scrollToCard(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(0, activeCenterIndex - 1);
        scrollToCard(prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isCollectionOpen, activePhotoIndex, activeCenterIndex, photosList.length, scrollToCard]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return (
    <div className="otc-photobooth" aria-label="Photo Booth Gallery">
      {/* Live announcement region for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* =========================================================================
          MOBILE VIEW (<= 768px): Compact Collection Pile & Swipe Board
          ========================================================================= */}
      {isMobile ? (
        <div className="otc-mobile-booth-wrapper">
          <AnimatePresence mode="wait">
            {!isCollectionOpen ? (
              /* 1. COLLAPSED STATE (DEFAULT): ONE compact collection card (70-80dvh max) */
              <motion.div
                key="collapsed-pile"
                className="otc-collection-stage"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: shouldReduceMotion ? 0.05 : 0.3 }}
              >
                <motion.div
                  className="otc-pile-interactive-btn"
                  role="button"
                  tabIndex={0}
                  aria-expanded={false}
                  aria-label={`Open photo collection, ${photosList.length} photos`}
                  onClick={openCollection}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openCollection();
                    }
                  }}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          rotate: [-0.6, 0.8, -0.6],
                          scale: [1, 1.015, 1],
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }
                        }
                  }
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <div className="otc-pile-card-stack" aria-hidden="true">
                    {/* 4 Cards peeking underneath with small offsets and soft layered shadows */}
                    {UNDERNEATH_CARDS.map((item, idx) => (
                      <div
                        key={`peeking-card-${idx}`}
                        className="otc-pile-under-card"
                        style={{
                          transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rot}deg)`,
                          zIndex: item.zIndex
                        }}
                      />
                    ))}

                    {/* Top Polaroid Cover Card */}
                    <motion.div
                      layoutId={`otc-photo-${coverPhoto.id}`}
                      className="otc-polaroid otc-pile-top-card"
                      style={{ zIndex: 10 }}
                    >
                      {/* One tape strip in lime or kraft */}
                      <div
                        className={`otc-tape ${coverPhoto.tape === 'kraft' ? 'otc-tape-kraft' : 'otc-tape-lime'}`}
                        aria-hidden="true"
                      />

                      <div className="otc-polaroid-photo-frame">
                        <img
                          src={coverPhoto.src}
                          alt={coverPhoto.alt}
                          loading="eager"
                          decoding="async"
                          className="otc-polaroid-img"
                          style={{ objectPosition: coverPhoto.objectPosition || 'center center' }}
                        />
                        <div className="otc-polaroid-zoom-badge" aria-hidden="true">
                          <ZoomIn size={14} />
                        </div>
                      </div>

                      <div className="otc-polaroid-footer">
                        <p className="otc-polaroid-caption" title={coverPhoto.caption}>
                          {coverPhoto.caption}
                        </p>
                        <div className="otc-polaroid-meta">
                          <span className="otc-polaroid-tag">{coverPhoto.tag}</span>
                          <span className="otc-polaroid-num">01</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Handwritten label and mono caption under the pile */}
                  <div className="otc-collection-label-group">
                    <h3 className="otc-collection-title">My little collection</h3>
                    <p className="otc-collection-caption">
                      {photosList.length} photos · tap to open
                    </p>
                  </div>

                  {/* Hand-drawn arrow doodle with hint */}
                  <div className="otc-collection-hint-row">
                    <svg
                      className="otc-collection-arrow-svg"
                      viewBox="0 0 54 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M 6 24 C 18 28, 32 24, 42 10"
                        stroke="var(--ink-muted)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 32 10 L 42 8 L 44 18"
                        stroke="var(--ink-muted)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="otc-collection-hint-text">tap the stack</span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* 2. SCATTERED ANIMATION & OPEN BOARD (Under 100dvh) */
              <motion.div
                key="open-collection"
                className="otc-open-collection-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
              >
                {/* Header bar: Counter chip and progress line */}
                <div className="otc-mobile-board-header">
                  <div className="otc-counter-chip" aria-label={`Photo ${activeCenterIndex + 1} of ${photosList.length}`}>
                    <span>{String(activeCenterIndex + 1).padStart(2, '0')}</span>
                    <span className="otc-counter-sep">/</span>
                    <span>{String(photosList.length).padStart(2, '0')}</span>
                  </div>

                  <div className="otc-progress-track" aria-hidden="true">
                    <div
                      className="otc-progress-bar"
                      style={{
                        width: `${((activeCenterIndex + 1) / photosList.length) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {mobileViewMode === 'swipe' ? (
                  /* Horizontal Swipe Board: scroll-snap-x mandatory, hidden scrollbar, peek neighbors */
                  <div
                    ref={swipeRef}
                    className="otc-horizontal-swipe-board"
                    onScroll={onScrollThrottled}
                    tabIndex={0}
                    aria-label="Swipeable photo board. Use arrow keys to navigate."
                  >
                    {photosList.map((photo, index) => {
                      const isActive = index === activeCenterIndex;
                      const formattedNumber = String(index + 1).padStart(2, '0');
                      const cardTilt = shouldReduceMotion ? 0 : (isActive ? 0 : Number(photo.rotation) || 0);

                      return (
                        <motion.div
                          key={photo.id}
                          layoutId={`otc-photo-${photo.id}`}
                          className={`otc-polaroid otc-polaroid-mobile ${isActive ? 'is-centered' : ''}`}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: isActive ? 1 : 0.94,
                            rotate: cardTilt
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 280,
                            damping: 24,
                            delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.4)
                          }}
                          onClick={(e) => {
                            if (isActive) {
                              openLightbox(index, e);
                            } else {
                              scrollToCard(index);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openLightbox(index, e);
                            }
                          }}
                          aria-label={`Photo ${formattedNumber}: ${photo.caption}. ${isActive ? 'Tap to view full size.' : 'Tap to center.'}`}
                        >
                          {/* Tape strip */}
                          {photo.tape === 'lime' && (
                            <div className="otc-tape otc-tape-lime" aria-hidden="true" />
                          )}
                          {photo.tape === 'cream' && (
                            <div className="otc-tape otc-tape-cream" aria-hidden="true" />
                          )}
                          {photo.tape === 'kraft' && (
                            <div className="otc-tape otc-tape-kraft" aria-hidden="true" />
                          )}

                          {/* 4:5 Aspect Ratio Photo Container */}
                          <div className="otc-polaroid-photo-frame">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              loading={index < 3 ? 'eager' : 'lazy'}
                              decoding="async"
                              className="otc-polaroid-img"
                              style={{ objectPosition: photo.objectPosition || 'center center' }}
                            />
                            {isActive && (
                              <div className="otc-polaroid-zoom-badge" aria-hidden="true">
                                <ZoomIn size={14} />
                              </div>
                            )}
                          </div>

                          {/* Fixed-Height Polaroid Caption Area (Never clips or overlaps) */}
                          <div className="otc-polaroid-footer">
                            <p className="otc-polaroid-caption" title={photo.caption}>
                              {photo.caption}
                            </p>
                            <div className="otc-polaroid-meta">
                              <span className="otc-polaroid-tag">{photo.tag}</span>
                              <span className="otc-polaroid-num">{formattedNumber}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  /* Mini 4-Column Contact Sheet for quick jumping (about 3-4 rows only) */
                  <div className="otc-mobile-contact-grid" role="grid" aria-label="Thumbnail grid for photo selection">
                    {photosList.map((photo, index) => {
                      const formattedNumber = String(index + 1).padStart(2, '0');
                      const isSelected = index === activeCenterIndex;

                      return (
                        <button
                          key={`mobile-contact-${photo.id}`}
                          type="button"
                          className={`otc-mobile-contact-thumb-btn ${isSelected ? 'is-active' : ''}`}
                          onClick={() => {
                            setMobileViewMode('swipe');
                            setTimeout(() => {
                              scrollToCard(index);
                            }, 50);
                          }}
                          aria-label={`Jump to photo ${formattedNumber}: ${photo.caption}`}
                        >
                          <img
                            src={photo.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="otc-mobile-contact-img"
                            style={{ objectPosition: photo.objectPosition || 'center center' }}
                          />
                          <span className="otc-mobile-contact-num">{formattedNumber}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Mobile Controls Row: Stack back, Shuffle, Contact sheet */}
                <div className="otc-mobile-controls-row">
                  <button
                    type="button"
                    className="otc-mobile-action-btn"
                    onClick={collapseCollection}
                    aria-label="Stack photos back into collection"
                  >
                    <Layers size={14} aria-hidden="true" />
                    <span>Stack back</span>
                  </button>

                  <button
                    type="button"
                    className="otc-mobile-action-btn"
                    onClick={handleShuffle}
                    aria-label="Shuffle photo tilts"
                  >
                    <Shuffle size={14} aria-hidden="true" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    type="button"
                    className={`otc-mobile-action-btn ${mobileViewMode === 'contact' ? 'is-active' : ''}`}
                    onClick={() => setMobileViewMode((m) => (m === 'swipe' ? 'contact' : 'swipe'))}
                    aria-label={mobileViewMode === 'contact' ? 'Switch back to swipe board' : 'Open contact sheet overview'}
                  >
                    {mobileViewMode === 'contact' ? (
                      <>
                        <ImageIcon size={14} aria-hidden="true" />
                        <span>Swipe view</span>
                      </>
                    ) : (
                      <>
                        <Grid size={14} aria-hidden="true" />
                        <span>Contact sheet</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* =========================================================================
            DESKTOP / TABLET-LANDSCAPE VIEW (> 768px): Scattered Board (Unchanged)
            ========================================================================= */
        <>
          <div className="otc-booth-toolbar">
            {!isTouchDevice ? (
              <div className="otc-toolbar-hint">
                <Sparkles size={15} color="var(--ink-muted)" aria-hidden="true" />
                <span>psst, you can drag the photos around</span>
              </div>
            ) : (
              <div className="otc-toolbar-hint">
                <span>Tap any photo to view full size</span>
              </div>
            )}

            <div className="otc-toolbar-actions">
              <button
                type="button"
                className="otc-icon-btn"
                onClick={handleShuffle}
                title="Re-shuffle photo angles"
                aria-label="Shuffle photo tilts"
              >
                <Shuffle size={14} aria-hidden="true" />
                <span>Shuffle</span>
              </button>

              <div className="otc-view-toggle" role="group" aria-label="Layout mode">
                <button
                  type="button"
                  className={`otc-toggle-btn ${viewMode === 'polaroid' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('polaroid')}
                  aria-pressed={viewMode === 'polaroid'}
                >
                  <ImageIcon size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Polaroids
                </button>
                <button
                  type="button"
                  className={`otc-toggle-btn ${viewMode === 'contact' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('contact')}
                  aria-pressed={viewMode === 'contact'}
                >
                  <Grid size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Contact Sheet
                </button>
              </div>
            </div>
          </div>

          <div ref={boardRef} className="otc-board otc-board-pinned">
            {viewMode === 'polaroid' ? (
              <motion.div layout className="otc-scatter-grid">
                {photosList.map((photo, index) => {
                  const currentZ = cardZIndices[photo.id] || 1;
                  const cardRotation = shouldReduceMotion ? 0 : Number(photo.rotation) || 0;
                  const formattedNumber = String(index + 1).padStart(2, '0');

                  return (
                    <motion.div
                      key={photo.id}
                      layout
                      drag={!shouldReduceMotion && !isTouchDevice}
                      dragConstraints={boardRef}
                      dragElastic={0.08}
                      onDragStart={() => handleCardDragStart(photo.id)}
                      style={{ zIndex: currentZ }}
                      initial={{
                        opacity: 0,
                        y: shouldReduceMotion ? 0 : 16,
                        filter: shouldReduceMotion
                          ? 'none'
                          : 'grayscale(35%) sepia(20%) blur(1px)'
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        filter: 'grayscale(0%) sepia(0%) blur(0px)'
                      }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{
                        duration: shouldReduceMotion ? 0.05 : DEVELOP_DURATION,
                        delay: shouldReduceMotion ? 0 : (index % 4) * 0.06,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              rotate: 0,
                              y: -6,
                              scale: 1.02,
                              transition: SPRING_HOVER
                            }
                      }
                      whileDrag={{
                        scale: 1.05,
                        cursor: 'grabbing',
                        boxShadow: '0 20px 35px -8px rgba(22, 21, 15, 0.28)'
                      }}
                      animate={{
                        rotate: cardRotation
                      }}
                      className="otc-polaroid"
                      onClick={(e) => openLightbox(index, e)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightbox(index, e);
                        }
                      }}
                      aria-label={`Open photo ${formattedNumber}: ${photo.caption}`}
                    >
                      {photo.tape === 'lime' && (
                        <div className="otc-tape otc-tape-lime" aria-hidden="true" />
                      )}
                      {photo.tape === 'cream' && (
                        <div className="otc-tape otc-tape-cream" aria-hidden="true" />
                      )}
                      {photo.tape === 'kraft' && (
                        <div className="otc-tape otc-tape-kraft" aria-hidden="true" />
                      )}

                      <div className="otc-polaroid-photo-frame">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading={index < 3 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="otc-polaroid-img"
                          style={{ objectPosition: photo.objectPosition || 'center center' }}
                        />
                        <div className="otc-polaroid-zoom-badge" aria-hidden="true">
                          <ZoomIn size={14} />
                        </div>
                      </div>

                      <div className="otc-polaroid-footer">
                        <p className="otc-polaroid-caption" title={photo.caption}>
                          {photo.caption}
                        </p>
                        <div className="otc-polaroid-meta">
                          <span className="otc-polaroid-tag">{photo.tag}</span>
                          <span className="otc-polaroid-num">{formattedNumber}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="otc-contact-sheet"
              >
                {photosList.map((photo, index) => {
                  const formattedNumber = String(index + 1).padStart(2, '0');

                  return (
                    <div
                      key={`contact-${photo.id}`}
                      className="otc-contact-frame"
                      onClick={(e) => openLightbox(index, e)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightbox(index, e);
                        }
                      }}
                      aria-label={`View photo ${formattedNumber}: ${photo.caption}`}
                    >
                      <div className="otc-contact-header">
                        <span className="otc-contact-num">🎞️ {formattedNumber}</span>
                        <span className="otc-contact-tag-badge">{photo.tag}</span>
                      </div>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="otc-contact-thumb"
                        style={{ objectPosition: photo.objectPosition || 'center center' }}
                      />
                      <div className="otc-contact-caption">{photo.caption}</div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Existing Lightbox dialog (features preserved: swipe, prev/next, keyboard, counter, focus trap, scroll lock) */}
      <Lightbox
        isOpen={activePhotoIndex !== null}
        photos={photosList}
        currentIndex={activePhotoIndex}
        onClose={closeLightbox}
        onPrev={showPrevPhoto}
        onNext={showNextPhoto}
        onSelectPhoto={selectPhotoByIndex}
        triggerElementRef={activeTriggerRef}
      />
    </div>
  );
}
