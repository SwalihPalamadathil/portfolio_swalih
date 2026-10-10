import React, { useState, useRef, useEffect, useCallback } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Shuffle, RotateCcw, Grid, Image as ImageIcon, ZoomIn, Layers } from 'lucide-react';
import { photos as rawPhotos, photoCollectionConfig } from '../../data/offTheClock';
import Lightbox from './Lightbox';

export const MOBILE_BREAKPOINT = 768;

const INITIAL_PHOTOS = (rawPhotos || [])
  .filter((p) => Boolean(p && p.src))
  .map((p, idx) => ({
    ...p,
    frameNum: String(idx + 1).padStart(2, '0')
  }));

// Underneath cards for the collapsed pile aesthetic on mobile
const UNDERNEATH_CARDS = [
  { rot: -6.5, x: -12, y: 7, zIndex: 1 },
  { rot: 5.8, x: 10, y: -5, zIndex: 2 },
  { rot: -3.8, x: -7, y: 4, zIndex: 3 },
  { rot: 4.2, x: 8, y: 3, zIndex: 4 }
];

export default function PhotoBooth() {
  const shouldReduceMotion = useReducedMotion();
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

  const [photosList, setPhotosList] = useState(INITIAL_PHOTOS);
  const [isShuffled, setIsShuffled] = useState(false);
  const [viewMode, setViewMode] = useState('wall'); // 'wall' | 'contact'
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  // Mobile Collection states
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('swipe'); // 'swipe' | 'contact'
  const [activeCenterIndex, setActiveCenterIndex] = useState(0);

  const coverIndex = photoCollectionConfig?.coverIndex ?? 0;
  const coverPhoto = photosList[coverIndex] || photosList[0];

  // Shuffle card order
  const handleShuffle = () => {
    setPhotosList((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setIsShuffled(true);
  };

  const handleResetOrder = () => {
    setPhotosList(INITIAL_PHOTOS);
    setIsShuffled(false);
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
    setMobileViewMode('swipe');
    setActiveCenterIndex(coverIndex);
    setTimeout(() => {
      scrollToCard(coverIndex);
    }, 60);
  };

  const collapseCollection = () => {
    setIsCollectionOpen(false);
  };

  // Keyboard navigation for swipe board
  useEffect(() => {
    if (!isMobile || !isCollectionOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(activeCenterIndex + 1, photosList.length - 1);
        scrollToCard(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(activeCenterIndex - 1, 0);
        scrollToCard(prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isCollectionOpen, activeCenterIndex, photosList.length, scrollToCard]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return (
    <div className="otc-photobooth" aria-label="Photo Booth Gallery">
      {/* =========================================================================
          MOBILE VIEW (<= 768px): Compact Collection Pile & Swipe Board
          ========================================================================= */}
      {isMobile ? (
        <div className="otc-mobile-booth-wrapper">
          <AnimatePresence mode="wait">
            {!isCollectionOpen ? (
              /* 1. COLLAPSED STATE (DEFAULT): ONE compact collection card */
              <m.div
                key="collapsed-pile"
                className="otc-collection-stage"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: shouldReduceMotion ? 0.05 : 0.3 }}
              >
                <m.div
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
                    {/* Cards peeking underneath */}
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
                    <div
                      className="otc-polaroid-card otc-pile-top-card"
                      style={{ zIndex: 10 }}
                    >
                      {coverPhoto.tape && coverPhoto.tape !== 'none' && (
                        <div
                          className={`otc-tape otc-tape-${coverPhoto.tape}`}
                          aria-hidden="true"
                        />
                      )}

                      <div className="otc-polaroid-photo-frame">
                        <img
                          src={coverPhoto.src}
                          alt={coverPhoto.alt}
                          loading="eager"
                          decoding="async"
                          width={coverPhoto.width || 800}
                          height={coverPhoto.height || 600}
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
                          <span className="otc-polaroid-num">{coverPhoto.frameNum}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Labels under the pile */}
                  <div className="otc-collection-label-group">
                    <h3 className="otc-collection-title">My little collection</h3>
                    <p className="otc-collection-caption">
                      {photosList.length} photos · tap to open
                    </p>
                  </div>

                  {/* Hand-drawn arrow doodle hint */}
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
                </m.div>
              </m.div>
            ) : (
              /* 2. OPEN MOBILE BOARD: Horizontal Swipe or Compact Grid */
              <m.div
                key="open-collection"
                className="otc-open-collection-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
              >
                {/* Header bar: Counter chip and progress bar */}
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
                  /* Horizontal Swipe Board: touch-action: pan-y preserves vertical page scroll */
                  <div
                    ref={swipeRef}
                    className="otc-horizontal-swipe-board"
                    onScroll={onScrollThrottled}
                    tabIndex={0}
                    aria-label="Swipeable photo board. Use arrow keys to navigate."
                    data-lenis-prevent="true"
                  >
                    {photosList.map((photo, index) => {
                      const isActive = index === activeCenterIndex;
                      const cardTilt = shouldReduceMotion ? 0 : (isActive ? 0 : Number(photo.rotation) || 0);

                      return (
                        <m.figure
                          key={photo.id}
                          className={`otc-polaroid-card otc-polaroid-mobile ${isActive ? 'is-centered' : ''}`}
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
                          aria-label={`Photo ${photo.frameNum}: ${photo.caption}. ${isActive ? 'Tap to view full size.' : 'Tap to center.'}`}
                        >
                          {photo.tape && photo.tape !== 'none' && (
                            <div className={`otc-tape otc-tape-${photo.tape}`} aria-hidden="true" />
                          )}

                          <div className="otc-polaroid-photo-frame">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              loading={index < 3 ? 'eager' : 'lazy'}
                              decoding="async"
                              width={photo.width || 800}
                              height={photo.height || 600}
                              className="otc-polaroid-img"
                              style={{ objectPosition: photo.objectPosition || 'center center' }}
                            />
                            {isActive && (
                              <div className="otc-polaroid-zoom-badge" aria-hidden="true">
                                <ZoomIn size={14} />
                              </div>
                            )}
                          </div>

                          <figcaption className="otc-polaroid-footer">
                            <p className="otc-polaroid-caption" title={photo.caption}>
                              {photo.caption}
                            </p>
                            <div className="otc-polaroid-meta">
                              <span className="otc-polaroid-tag">{photo.tag}</span>
                              <span className="otc-polaroid-num">{photo.frameNum}</span>
                            </div>
                          </figcaption>
                        </m.figure>
                      );
                    })}
                  </div>
                ) : (
                  /* Mobile Contact Sheet overview */
                  <div className="otc-contact-sheet otc-contact-sheet-mobile">
                    {photosList.map((photo, index) => (
                      <div
                        key={`m-contact-${photo.id}`}
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
                        aria-label={`View photo ${photo.frameNum}: ${photo.caption}`}
                      >
                        <div className="otc-contact-header">
                          <span className="otc-contact-num">🎞️ {photo.frameNum}</span>
                          <span className="otc-contact-tag-badge">{photo.tag}</span>
                        </div>
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading={index < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          width={photo.width || 800}
                          height={photo.height || 600}
                          className="otc-contact-thumb"
                          style={{ objectPosition: photo.objectPosition || 'center center' }}
                        />
                        <div className="otc-contact-caption">{photo.caption}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mobile Bottom Action Bar */}
                <div className="otc-mobile-action-bar">
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
                    aria-label="Shuffle photos order"
                  >
                    <Shuffle size={14} aria-hidden="true" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    type="button"
                    className={`otc-mobile-action-btn ${mobileViewMode === 'contact' ? 'is-active' : ''}`}
                    onClick={() => setMobileViewMode((m) => (m === 'swipe' ? 'contact' : 'swipe'))}
                    aria-label={mobileViewMode === 'contact' ? 'Switch to swipe view' : 'Open contact sheet overview'}
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
              </m.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* =========================================================================
            DESKTOP & LAPTOP VIEW (> 768px): "THE WALL"
            Strict CSS Grid, Protected Outer Cells, Zero Overlap Guaranteed
            ========================================================================= */
        <div className="otc-wall-desktop-container">
          {/* Controls Toolbar */}
          <div className="otc-booth-toolbar">
            <div className="otc-toolbar-hint">
              <span>A curated wall of polaroids. Tap any frame to enlarge.</span>
            </div>

            <div className="otc-toolbar-actions">
              {/* Shuffle button */}
              <button
                type="button"
                className="otc-icon-btn"
                onClick={handleShuffle}
                title="Shuffle photo order"
                aria-label="Shuffle photo order"
              >
                <Shuffle size={14} aria-hidden="true" />
                <span>Shuffle</span>
              </button>

              {/* Reset order button (visible after shuffle) */}
              {isShuffled && (
                <button
                  type="button"
                  className="otc-icon-btn otc-btn-reset-order"
                  onClick={handleResetOrder}
                  title="Reset to original chronological order"
                  aria-label="Reset photo order"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  <span>Reset order</span>
                </button>
              )}

              {/* View Toggle */}
              <div className="otc-view-toggle" role="group" aria-label="Layout view mode">
                <button
                  type="button"
                  className={`otc-toggle-btn ${viewMode === 'wall' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('wall')}
                  aria-pressed={viewMode === 'wall'}
                >
                  <ImageIcon size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  Wall
                </button>
                <button
                  type="button"
                  className={`otc-toggle-btn ${viewMode === 'contact' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('contact')}
                  aria-pressed={viewMode === 'contact'}
                >
                  <Grid size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  Contact sheet
                </button>
              </div>
            </div>
          </div>

          {/* Desk Surface / Dotted Grid */}
          <div className="otc-wall-surface">
            {viewMode === 'wall' ? (
              /* Wall grid — no `layout` prop (avoids expensive layout animations) */
              <div className="otc-wall-grid">
                {photosList.map((photo, index) => {
                  const cardTilt = shouldReduceMotion ? 0 : Number(photo.rotation) || 0;

                  return (
                    <m.div
                      key={photo.id}
                      className="otc-wall-cell"
                      initial={{
                        opacity: 0,
                        y: shouldReduceMotion ? 0 : 16,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{
                        duration: shouldReduceMotion ? 0.05 : 0.45,
                        delay: shouldReduceMotion ? 0 : (index % 4) * 0.06,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <m.figure
                        className="otc-polaroid-card"
                        style={{ rotate: cardTilt }}
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : {
                                rotate: 0,
                                y: -6,
                                scale: 1.02,
                                transition: { type: 'spring', stiffness: 350, damping: 25 }
                              }
                        }
                        onClick={(e) => openLightbox(index, e)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openLightbox(index, e);
                          }
                        }}
                        aria-label={`Open photo ${photo.frameNum}: ${photo.caption}`}
                      >
                        {/* Washi Tape Strip */}
                        {photo.tape && photo.tape !== 'none' && (
                          <div className={`otc-tape otc-tape-${photo.tape}`} aria-hidden="true" />
                        )}

                        {/* Fixed 4:5 Aspect Ratio Photo Container */}
                        <div className="otc-polaroid-photo-frame">
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            loading={index < 4 ? 'eager' : 'lazy'}
                            decoding="async"
                            width={photo.width || 800}
                            height={photo.height || 600}
                            className="otc-polaroid-img"
                            style={{ objectPosition: photo.objectPosition || 'center center' }}
                          />
                          <div className="otc-polaroid-zoom-badge" aria-hidden="true">
                            <ZoomIn size={15} />
                          </div>
                        </div>

                        {/* Protected Fixed-Height Caption Footer */}
                        <figcaption className="otc-polaroid-footer">
                          <p className="otc-polaroid-caption" title={photo.caption}>
                            {photo.caption}
                          </p>
                          <div className="otc-polaroid-meta">
                            <span className="otc-polaroid-tag">{photo.tag}</span>
                            <span className="otc-polaroid-num">{photo.frameNum}</span>
                          </div>
                        </figcaption>
                      </m.figure>
                    </m.div>
                  );
                })}
              </div>
            ) : (
              /* Contact Sheet Film-Strip Grid */
              <m.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="otc-contact-sheet"
              >
                {photosList.map((photo, index) => (
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
                    aria-label={`View photo ${photo.frameNum}: ${photo.caption}`}
                  >
                    <div className="otc-contact-header">
                      <span className="otc-contact-num">🎞️ {photo.frameNum}</span>
                      <span className="otc-contact-tag-badge">{photo.tag}</span>
                    </div>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      width={photo.width || 800}
                      height={photo.height || 600}
                      className="otc-contact-thumb"
                      style={{ objectPosition: photo.objectPosition || 'center center' }}
                    />
                    <div className="otc-contact-caption">{photo.caption}</div>
                  </div>
                ))}
              </m.div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Dialog */}
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
