import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * NotFound Component (404 Page)
 *
 * HOW TO HOOK UP:
 * If your project introduces routing in the future (e.g. `react-router-dom` or Next.js / TanStack Router):
 *
 *   import NotFound from './components/OffTheClock/NotFound';
 *   <Route path="*" element={<NotFound />} />
 *
 * For now, this standalone component can also be rendered conditionally or on error states.
 */
export default function NotFound({ onGoHome }) {
  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'var(--bg, #F5F2EA)',
        color: 'var(--ink, #16150F)',
        textAlign: 'center'
      }}
    >
      {/* Hand-drawn broken-chain / link doodle */}
      <svg
        viewBox="0 0 120 120"
        width="110"
        height="110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: '1.5rem' }}
        aria-hidden="true"
      >
        {/* Left link loop */}
        <path
          d="M 35 45 C 22 45, 16 55, 16 68 C 16 80, 26 88, 38 88 H 50 C 62 88, 70 80, 70 68"
          stroke="var(--ink, #16150F)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Right link loop snapped apart */}
        <path
          d="M 52 52 C 52 40, 60 32, 72 32 H 84 C 96 32, 104 40, 104 52 C 104 65, 96 74, 84 74"
          stroke="var(--ink, #16150F)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Break zap in lime */}
        <path
          d="M 48 42 L 56 32 L 62 48 L 72 38"
          stroke="var(--accent, #C6F24E)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span
        style={{
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: '0.85rem',
          color: 'var(--ink-muted, #5B584E)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}
      >
        404 / Missing Page
      </span>

      <h1
        style={{
          fontFamily: "var(--font-serif, 'Newsreader', serif)",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 400,
          margin: '0 0 0.5rem 0'
        }}
      >
        Lost off the grid.
      </h1>

      <p
        style={{
          fontFamily: "var(--font-handwriting, 'Caveat', cursive)",
          fontSize: '1.45rem',
          color: 'var(--ink-muted, #5B584E)',
          margin: '0 0 2rem 0'
        }}
      >
        Something went wrong. It&apos;s not you, it&apos;s me.
      </p>

      <button
        type="button"
        onClick={handleHomeClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--ink, #16150F)',
          color: '#FFFFFF',
          borderRadius: '4px',
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          fontSize: '0.875rem',
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Portfolio</span>
      </button>
    </div>
  );
}
