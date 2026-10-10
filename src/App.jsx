import React, { Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';

// Below-the-fold sections: lazy-loaded to reduce initial JS
// Using React.lazy + Suspense with stable-height fallbacks
const About = React.lazy(() => import('./sections/About'));
const Skills = React.lazy(() => import('./sections/Skills'));
const Work = React.lazy(() => import('./sections/Work'));
const Experience = React.lazy(() => import('./sections/Experience'));
const OffTheClock = React.lazy(() => import('./components/OffTheClock/OffTheClock'));
const Contact = React.lazy(() => import('./sections/Contact'));

// Minimal skeleton to hold space during lazy section load (prevents CLS)
function SectionShell({ minHeight = '20rem' }) {
  return (
    <div
      style={{
        minHeight,
        background: 'var(--bg)',
        contain: 'layout paint',
      }}
      aria-hidden="true"
    />
  );
}

export default function App() {
  return (
    /*
     * LazyMotion with domAnimation feature set + strict:
     * - strict: throws in dev if any `motion.*` component is used (must use `m.*`)
     * - Cuts framer-motion bundle by ~30% vs full domMax
     * - Includes: animate, exit, whileInView, whileHover, scroll, spring, tween
     * - Excluded: layout animations (layoutId removed from Navbar, using CSS instead)
     * - No drag used anywhere — domAnimation is sufficient
     */
    <LazyMotion features={domAnimation} strict>
      <SmoothScroll>
        <div className="app-layout">
          <Navbar />
          <main id="main-content">
            {/* Hero is eager — it's above the fold (LCP element lives here) */}
            <Hero />

            {/* All below-fold sections are lazy with stable fallback shells */}
            <Suspense fallback={<SectionShell minHeight="40rem" />}>
              <About />
            </Suspense>
            <Suspense fallback={<SectionShell minHeight="30rem" />}>
              <Skills />
            </Suspense>
            <Suspense fallback={<SectionShell minHeight="30rem" />}>
              <Work />
            </Suspense>
            <Suspense fallback={<SectionShell minHeight="30rem" />}>
              <Experience />
            </Suspense>
            <Suspense fallback={<SectionShell minHeight="30rem" />}>
              <OffTheClock />
            </Suspense>
            <Suspense fallback={<SectionShell minHeight="20rem" />}>
              <Contact />
            </Suspense>
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </LazyMotion>
  );
}
