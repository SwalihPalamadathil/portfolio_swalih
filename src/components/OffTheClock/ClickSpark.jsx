import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const SPARK_LIFETIME = 350; // ms
const PARTICLE_COUNT = 6;

export default function ClickSpark({ targetRef }) {
  const shouldReduceMotion = useReducedMotion();
  const [sparks, setSparks] = useState([]);
  const sparkIdCounter = useRef(0);

  useEffect(() => {
    // Disable on touch devices or if reduced motion is requested
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (shouldReduceMotion || isTouch) return;

    const target = targetRef.current;
    if (!target) return;

    const handleClick = (e) => {
      // Don't trigger spark on interactive inputs, buttons, canvas, or sliders
      if (e.target.closest('button, a, input, canvas, [role="slider"], [role="button"]')) {
        return;
      }

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / PARTICLE_COUNT + (Math.random() * 0.4 - 0.2);
        const dist = 14 + Math.random() * 10;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 2 + Math.random() * 2
        };
      });

      const sparkId = ++sparkIdCounter.current;
      setSparks((prev) => [...prev, { id: sparkId, x, y, particles }]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== sparkId));
      }, SPARK_LIFETIME);
    };

    target.addEventListener('click', handleClick);
    return () => target.removeEventListener('click', handleClick);
  }, [targetRef, shouldReduceMotion]);

  if (sparks.length === 0) return null;

  return (
    <div className="otc-spark-container" aria-hidden="true">
      {sparks.map((spark) => (
        <React.Fragment key={spark.id}>
          {spark.particles.map((p) => (
            <span
              key={`${spark.id}-${p.id}`}
              className="otc-spark-dot"
              style={{
                left: `${spark.x}px`,
                top: `${spark.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                transform: `translate(${p.dx}px, ${p.dy}px)`,
                opacity: 0,
                transition: `all ${SPARK_LIFETIME}ms cubic-bezier(0.22, 1, 0.36, 1)`
              }}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
