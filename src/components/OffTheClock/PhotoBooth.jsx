import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Shuffle, Grid, Image as ImageIcon, Sparkles, ZoomIn } from 'lucide-react';
import { photos as allPhotos } from '../../data/offTheClock';
import Lightbox from './Lightbox';

// Tunable constants
const SPRING_HOVER = { type: 'spring', stiffness: 350, damping: 25 };
const DEVELOP_DURATION = 0.55;
const ROTATION_RANGE = 3.6; // Clean tilt range between -3.6° and +3.6°

export default function PhotoBooth() {
  const shouldReduceMotion = useReducedMotion();
  const boardRef = useRef(null);
  const activeTriggerRef = useRef(null);

  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  });

  const [photosList, setPhotosList] = useState(allPhotos);
  const [viewMode, setViewMode] = useState('polaroid'); // 'polaroid' | 'contact'
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const topZIndexRef = useRef(10);
  const [cardZIndices, setCardZIndices] = useState({});

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
    activeTriggerRef.current = event.currentTarget;
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

  return (
    <div className="otc-photobooth" aria-label="Photo Booth Gallery">
      {/* Tidy Toolbar Controls (Filter bar removed) */}
      <div className="otc-booth-toolbar">
        {/* Left: Drag hint (desktop only) */}
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

        {/* Right: Shuffle & Mode Switch */}
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

      {/* Pinned Board Grid Surface */}
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
                  {/* Washi Tape Strip */}
                  {photo.tape === 'lime' && (
                    <div className="otc-tape otc-tape-lime" aria-hidden="true" />
                  )}
                  {photo.tape === 'cream' && (
                    <div className="otc-tape otc-tape-cream" aria-hidden="true" />
                  )}
                  {photo.tape === 'kraft' && (
                    <div className="otc-tape otc-tape-kraft" aria-hidden="true" />
                  )}

                  {/* Fixed 4:5 Aspect Ratio Photo Container */}
                  <div className="otc-polaroid-photo-frame">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="otc-polaroid-img"
                      style={{ objectPosition: photo.objectPosition || 'center center' }}
                    />
                    {/* Zoom Icon */}
                    <div className="otc-polaroid-zoom-badge" aria-hidden="true">
                      <ZoomIn size={14} />
                    </div>
                  </div>

                  {/* Fixed-Height Polaroid Caption Area */}
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
          /* Contact Sheet View (film-strip look with frame markings) */
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
                    loading="lazy"
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

      {/* Lightbox dialog */}
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
