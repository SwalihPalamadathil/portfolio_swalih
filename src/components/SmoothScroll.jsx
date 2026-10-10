import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Disable on touch-primary devices — native momentum scroll is always smoother
    // and Lenis fighting native touch causes jank on phones
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      // Prevent Lenis from intercepting wheel inside marked containers
      // (AI chat list, mobile nav overlay, lightbox, photo swipe board)
      // achieved via data-lenis-prevent on those elements
      prevent: (node) => node.hasAttribute('data-lenis-prevent'),
    });

    let rafId;
    let lastTime = 0;
    let idle = false;

    function raf(time) {
      // Stop scheduling if idle for more than 5s (restarts on next scroll event)
      if (time - lastTime > 5000 && idle) {
        rafId = null;
        return;
      }
      lenis.raf(time);
      // Check if scrolling is truly idle
      idle = Math.abs(lenis.velocity) < 0.01;
      if (!idle) lastTime = time;
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Re-wake RAF on user input to handle the idle-stop case
    const wakeRaf = () => {
      lastTime = performance.now();
      idle = false;
      if (!rafId) {
        rafId = requestAnimationFrame(raf);
      }
    };
    window.addEventListener('wheel', wakeRaf, { passive: true });
    window.addEventListener('keydown', wakeRaf, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', wakeRaf);
      window.removeEventListener('keydown', wakeRaf);
      lenis.destroy();
    };
  }, []);

  return children;
}
