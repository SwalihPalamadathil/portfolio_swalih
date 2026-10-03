import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Eraser,
  PenTool,
  Star,
  Heart,
  Bug,
  Coffee
} from 'lucide-react';
import { doodleHeader, doodlesList } from '../../data/offTheClock';

// SVG Doodle Path Animation variants
const drawVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (customDelay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: customDelay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      opacity: { delay: customDelay, duration: 0.15 }
    }
  })
};

const COLOR_PALETTE = [
  { name: 'Dark Ink', value: '#16150F' },
  { name: 'Lime Accent', value: '#C6F24E' },
  { name: 'Pencil Graphite', value: '#5B584E' },
  { name: 'Warm Kraft', value: '#C49A6C' }
];

const BRUSH_SIZES = [
  { label: 'Fine', value: 2 },
  { label: 'Med', value: 5 },
  { label: 'Bold', value: 10 }
];

export default function DoodleCorner() {
  const shouldReduceMotion = useReducedMotion();

  // Canvas state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeColor, setActiveColor] = useState('#16150F');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const historyRef = useRef([]);
  const redoRef = useRef([]);

  // Setup canvas with devicePixelRatio
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    let tempCanvas = null;
    if (canvas.width > 0 && canvas.height > 0) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tempCanvas) {
      ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(imageData);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
    redoRef.current = [];
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    saveState();
    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isEraser) {
      ctx.strokeStyle = '#FAF8F3';
      ctx.lineWidth = brushSize * 3;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
  };

  const handleUndo = () => {
    if (historyRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoRef.current.push(currentState);
    const previousState = historyRef.current.pop();
    ctx.putImageData(previousState, 0, 0);
  };

  const handleRedo = () => {
    if (redoRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(currentState);
    const nextState = redoRef.current.pop();
    ctx.putImageData(nextState, 0, 0);
  };

  const handleClear = () => {
    saveState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');

    expCtx.fillStyle = '#FAF8F3';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    expCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'swalih-doodle-sketch.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const addStamp = (stampType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveState();
    setHasDrawn(true);

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = rect.width / 2 + (Math.random() * 80 - 40);
    const y = rect.height / 2 + (Math.random() * 40 - 20);

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = activeColor === '#FAF8F3' ? '#16150F' : activeColor;
    ctx.fillStyle = activeColor === '#FAF8F3' ? '#16150F' : activeColor;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stampType === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * 16,
          -Math.sin(((18 + i * 72) * Math.PI) / 180) * 16
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * 7,
          -Math.sin(((54 + i * 72) * Math.PI) / 180) * 7
        );
      }
      ctx.closePath();
      ctx.stroke();
    } else if (stampType === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-14, -12, -22, 6, 0, 20);
      ctx.bezierCurveTo(22, 6, 14, -12, 0, 5);
      ctx.fill();
    } else if (stampType === 'bug') {
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.moveTo(-12, -6);
      ctx.lineTo(-6, -2);
      ctx.moveTo(12, -6);
      ctx.lineTo(6, -2);
      ctx.moveTo(-12, 6);
      ctx.lineTo(-6, 2);
      ctx.moveTo(12, 6);
      ctx.lineTo(6, 2);
      ctx.stroke();
    } else if (stampType === 'coffee') {
      ctx.beginPath();
      ctx.rect(-8, -4, 16, 14);
      ctx.stroke();
      ctx.moveTo(8, -1);
      ctx.arc(8, 3, 4, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.moveTo(-4, -10);
      ctx.bezierCurveTo(-6, -14, -2, -18, -4, -20);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Helper to render individual doodle SVGs with draw-on-scroll animation
  const renderDoodleSvg = (id) => {
    switch (id) {
      case 'machine':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.path
              d="M 22 25 H 78 V 62 H 22 Z"
              stroke="var(--ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
            />
            <motion.path
              d="M 12 70 H 88 L 80 62 H 20 Z"
              stroke="var(--ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
            />
            <motion.circle
              cx="48"
              cy="44"
              r="5"
              stroke="var(--ink)"
              strokeWidth="2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.25}
            />
            <motion.path
              d="M 82 28 C 82 25, 85 22, 85 22 C 85 22, 88 25, 88 28 C 88 30, 85 31, 85 31 Z"
              fill="var(--accent)"
              stroke="var(--accent-ink)"
              strokeWidth="1.2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
            />
          </svg>
        );
      case 'tea':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.path
              d="M 32 30 L 38 75 H 62 L 68 30 Z"
              stroke="var(--ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            />
            <motion.path
              d="M 36 46 Q 50 49 64 46"
              stroke="var(--accent)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            />
            <motion.path
              d="M 44 24 Q 40 16 46 10 M 56 22 Q 60 15 54 8"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
            />
          </svg>
        );
      case 'kerala':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.path
              d="M 50 78 Q 44 50 56 28"
              stroke="var(--ink)"
              strokeWidth="2.6"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.12}
            />
            <motion.path
              d="M 56 28 Q 30 20 20 32 M 56 28 Q 75 16 84 28 M 56 28 Q 40 10 52 4 M 56 28 Q 68 12 76 8"
              stroke="var(--ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.22}
            />
            <motion.circle
              cx="52"
              cy="31"
              r="3.5"
              fill="var(--accent)"
              stroke="var(--accent-ink)"
              strokeWidth="1.2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.32}
            />
          </svg>
        );
      case 'scooter':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.circle
              cx="28"
              cy="68"
              r="8"
              stroke="var(--ink)"
              strokeWidth="2.4"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
            />
            <motion.circle
              cx="72"
              cy="68"
              r="8"
              stroke="var(--ink)"
              strokeWidth="2.4"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.22}
            />
            <motion.path
              d="M 28 68 H 48 L 56 46 H 70 L 64 32 H 58"
              stroke="var(--ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
            />
            <motion.circle
              cx="67"
              cy="33"
              r="2.5"
              fill="var(--accent)"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.38}
            />
          </svg>
        );
      case 'git-branch':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.path
              d="M 32 20 V 78"
              stroke="var(--ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.16}
            />
            <motion.path
              d="M 32 54 Q 52 50 66 36"
              stroke="var(--ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.25}
            />
            <motion.circle cx="32" cy="28" r="4" fill="var(--ink)" />
            <motion.circle cx="32" cy="70" r="4" fill="var(--ink)" />
            <motion.circle
              cx="66"
              cy="36"
              r="4"
              fill="var(--accent)"
              stroke="var(--accent-ink)"
              strokeWidth="1.2"
            />
            <motion.path
              d="M 78 26 L 78 34 M 78 38 L 78 40"
              stroke="var(--accent-ink)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.35}
            />
          </svg>
        );
      case '404':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.path
              d="M 28 32 L 18 54 H 34 V 68 M 30 44 V 68"
              stroke="var(--ink)"
              strokeWidth="2.5"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.18}
            />
            <motion.ellipse
              cx="50"
              cy="50"
              rx="11"
              ry="16"
              stroke="var(--ink)"
              strokeWidth="2.4"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.28}
            />
            <motion.path
              d="M 74 32 L 64 54 H 80 V 68 M 76 44 V 68"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.38}
            />
          </svg>
        );
      case 'nss':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.path
              d="M 50 74 C 50 74, 24 54, 24 38 C 24 26, 34 20, 42 26 C 47 29, 50 34, 50 34 C 50 34, 53 29, 58 26 C 66 20, 76 26, 76 38 C 76 54, 50 74, 50 74 Z"
              stroke="var(--ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            />
            <motion.path
              d="M 38 46 Q 50 54 62 44 M 44 48 L 56 48"
              stroke="var(--accent)"
              strokeWidth="2.2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.32}
            />
          </svg>
        );
      case 'rocket':
        return (
          <svg className="otc-doodle-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.path
              d="M 50 16 C 42 28, 40 48, 40 60 H 60 C 60 48, 58 28, 50 16 Z"
              stroke="var(--ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.22}
            />
            <motion.path
              d="M 40 48 L 28 62 H 40"
              stroke="var(--ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
            />
            <motion.path
              d="M 60 48 L 72 62 H 60"
              stroke="var(--ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
            />
            <motion.circle
              cx="50"
              cy="36"
              r="5"
              fill="var(--accent)"
              stroke="var(--accent-ink)"
              strokeWidth="1.2"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.38}
            />
            <motion.path
              d="M 45 66 Q 50 76 44 86 M 50 66 Q 54 74 50 84 M 55 66 Q 60 76 56 86"
              stroke="var(--accent)"
              strokeWidth="2.2"
              strokeLinecap="round"
              variants={drawVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.48}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="otc-doodle-corner otc-notebook-ruled" aria-label="Doodle Corner">
      {/* Section Head */}
      <div className="otc-doodle-head">
        <h3 className="otc-doodle-title">{doodleHeader.title}</h3>
        <p className="otc-doodle-subtitle">{doodleHeader.subtitle}</p>
      </div>

      {/* Curated Story Doodles (8 on desktop, 6 on mobile <= 640px via hideOnMobile flag) */}
      <div className="otc-doodles-grid">
        {doodlesList.map((doodle, index) => {
          const isTiltedOdd = index % 2 !== 0;

          return (
            <motion.div
              key={doodle.id}
              className={`otc-doodle-card ${doodle.hideOnMobile ? 'otc-doodle-hide-mobile' : ''}`}
              whileHover={shouldReduceMotion ? {} : { rotate: isTiltedOdd ? 2 : -2, y: -4 }}
              whileTap={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 0.94,
                      rotate: [-2, 2, -1, 0],
                      transition: { duration: 0.25 }
                    }
              }
            >
              {renderDoodleSvg(doodle.id)}
              <span className="otc-doodle-label">
                <span className="otc-doodle-text">{doodle.label}</span>
                <span className="otc-doodle-emoji" aria-hidden="true">
                  {doodle.emoji}
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky note tape reminders */}
      <div className="otc-sticky-row">
        <div className="otc-sticky-note otc-sticky-tilt-left">
          <div className="otc-tape otc-tape-cream" aria-hidden="true" />
          <p className="otc-sticky-text">“debugging is just detective work where you are also the criminal.”</p>
        </div>
        <div className="otc-sticky-note otc-sticky-tilt-right">
          <div className="otc-tape otc-tape-lime" aria-hidden="true" />
          <p className="otc-sticky-text">“it worked yesterday, so today it is a feature.”</p>
        </div>
      </div>

      {/* Interactive Sketchpad (stays below, full width, min height 260px, touch-action: none ONLY on canvas) */}
      <div className="otc-sketchpad-section">
        <div className="otc-sketchpad-header">
          <h4 className="otc-sketchpad-title">
            <PenTool size={18} aria-hidden="true" />
            <span>Interactive Sketchpad</span>
          </h4>

          {/* Controls: Colors, Sizes, Eraser, Undo, Redo, Clear, Download */}
          <div className="otc-sketchpad-toolbar" role="toolbar" aria-label="Drawing tools">
            {/* Color Swatches */}
            <div className="otc-swatches-group">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`otc-color-pill ${!isEraser && activeColor === c.value ? 'is-active' : ''}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => {
                    setActiveColor(c.value);
                    setIsEraser(false);
                  }}
                  aria-label={`Ink color: ${c.name}`}
                  title={c.name}
                />
              ))}
            </div>

            {/* Brush sizes */}
            <div className="otc-sizes-group">
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  className={`otc-size-btn ${brushSize === b.value ? 'is-active' : ''}`}
                  onClick={() => setBrushSize(b.value)}
                  aria-label={`${b.label} brush size (${b.value}px)`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Eraser */}
            <button
              type="button"
              className={`otc-icon-btn ${isEraser ? 'is-active' : ''}`}
              onClick={() => setIsEraser((prev) => !prev)}
              aria-label="Eraser tool"
              title="Eraser"
            >
              <Eraser size={14} aria-hidden="true" />
              <span>Eraser</span>
            </button>

            {/* Undo */}
            <button
              type="button"
              className="otc-icon-btn"
              onClick={handleUndo}
              aria-label="Undo last stroke"
              title="Undo"
            >
              <RotateCcw size={14} aria-hidden="true" />
            </button>

            {/* Redo */}
            <button
              type="button"
              className="otc-icon-btn"
              onClick={handleRedo}
              aria-label="Redo stroke"
              title="Redo"
            >
              <RotateCw size={14} aria-hidden="true" />
            </button>

            {/* Clear */}
            <button
              type="button"
              className="otc-icon-btn"
              onClick={handleClear}
              aria-label="Clear sketchpad"
              title="Clear"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>

            {/* Save PNG */}
            <button
              type="button"
              className="otc-icon-btn otc-btn-save"
              onClick={handleDownload}
              aria-label="Download sketch as PNG"
              title="Save PNG"
            >
              <Download size={14} aria-hidden="true" />
              <span>Save PNG</span>
            </button>
          </div>
        </div>

        {/* Quick Doodle Stamps Row */}
        <div className="otc-stamps-bar" aria-label="Stamp stickers onto canvas">
          <span className="otc-stamps-label">Tap to stamp:</span>
          <button
            type="button"
            className="otc-stamp-btn"
            onClick={() => addStamp('star')}
            title="Stamp a Star"
            aria-label="Stamp a Star"
          >
            <Star size={14} /> Star
          </button>
          <button
            type="button"
            className="otc-stamp-btn"
            onClick={() => addStamp('heart')}
            title="Stamp a Heart"
            aria-label="Stamp a Heart"
          >
            <Heart size={14} /> Heart
          </button>
          <button
            type="button"
            className="otc-stamp-btn"
            onClick={() => addStamp('bug')}
            title="Stamp a Bug"
            aria-label="Stamp a Bug"
          >
            <Bug size={14} /> Bug
          </button>
          <button
            type="button"
            className="otc-stamp-btn"
            onClick={() => addStamp('coffee')}
            title="Stamp a Tea Cup"
            aria-label="Stamp a Tea Cup"
          >
            <Coffee size={14} /> Tea
          </button>
        </div>

        {/* Canvas Area */}
        <div className="otc-canvas-wrap">
          {!hasDrawn && (
            <div className="otc-canvas-hint" aria-hidden="true">
              ✏️ draw something here...
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="otc-drawing-canvas"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            aria-label="Freehand doodle drawing canvas. Draw with mouse, touch or stylus."
            tabIndex={0}
          />
        </div>
      </div>
    </div>
  );
}
