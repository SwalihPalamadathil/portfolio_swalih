import React, { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { skillsData, skillsGroups } from '../data/portfolioData';
import {
  MapPin,
  CloudDoodle,
  TreeDoodle,
  HillDoodle,
  FootprintsDoodle,
  CompassDoodle,
} from '../components/doodles/Doodles';

export default function CurrentlyLearning() {
  const shouldReduceMotion = useReducedMotion();
  const mapRef = useRef(null);

  // Scroll-linked trail drawing
  const { scrollYProgress } = useScroll({
    target: mapRef,
    offset: ['start 80%', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const trailLength = useTransform(smoothProgress, [0, 1], [0.15, 1]);

  // Retrieve existing data strictly without modification
  const pythonGroup = skillsGroups.learning.skills.find(
    (s) => s.name.toLowerCase() === 'python'
  ) || { name: 'Python', detail: 'Core programming fundamentals & backend concepts' };

  const pythonContext = skillsData.find(
    (s) => s.name.toLowerCase() === 'python'
  )?.context || 'picked up during a Python full-stack internship, still building on it';

  const hackingGroup = skillsGroups.learning.skills.find(
    (s) => s.name.toLowerCase().includes('ethical')
  ) || { name: 'Ethical Hacking', detail: 'Foundational coursework at Offenso Hackers Academy' };

  const hackingContext = skillsData.find(
    (s) => s.name.toLowerCase().includes('ethical')
  )?.context || 'an Offenso Hackers Academy course, in progress';

  const items = [
    {
      id: 'python',
      name: pythonGroup.name,
      context: pythonContext,
      detail: pythonGroup.detail,
      isCurrent: true,
      pinNum: 1,
    },
    {
      id: 'hacking',
      name: hackingGroup.name,
      context: hackingContext,
      detail: hackingGroup.detail,
      isCurrent: false,
      pinNum: 2,
    },
  ];

  return (
    <div className="learning-map-section" ref={mapRef}>
      {/* ── Section Title in Handwriting & Sans ── */}
      <div className="learning-map-header">
        <h3 className="learning-map-title">
          <span>Currently learning</span>
          <span className="skills-hint-badge" style={{ fontSize: '0.65rem' }}>trail map</span>
        </h3>
        <p className="learning-map-subtitle">
          The next paths on the map — topics actively explored through coursework and focused project builds.
        </p>
      </div>

      {/* ── Trail Map Card / Canvas ── */}
      <div className="learning-map-card">
        {/* Faint contour / topographic styling */}
        <div className="learning-map-contours" aria-hidden="true" />

        {/* Compass Rose in top corner */}
        <div className="learning-compass-corner" aria-hidden="true">
          <CompassDoodle size={48} />
        </div>

        {/* ── DESKTOP S-CURVE TRAIL (Width > 768px) ── */}
        <div className="learning-map-desktop" aria-hidden="true">
          {/* Decorative Scenery Doodles */}
          <div className="map-scenery-item scenery-cloud">
            <CloudDoodle size={56} />
          </div>
          <div className="map-scenery-item scenery-tree-1">
            <TreeDoodle size={30} delay={0.2} />
          </div>
          <div className="map-scenery-item scenery-tree-2">
            <TreeDoodle size={26} delay={0.3} />
          </div>
          <div className="map-scenery-item scenery-hills">
            <HillDoodle size={76} delay={0.4} />
          </div>

          {/* SVG S-Curve Trail */}
          <svg
            className="learning-trail-svg"
            viewBox="0 0 920 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            {/* Faint guide shadow of the trail */}
            <path
              d="M 60 200 C 140 130, 200 90, 280 90 C 380 90, 480 280, 580 280 C 680 280, 740 180, 840 180"
              stroke="rgba(22, 21, 15, 0.08)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Animated dotted ink trail — no roughen filter (filter on animated path = per-frame rasterization) */}
            <m.path
              d="M 60 200 C 140 130, 200 90, 280 90 C 380 90, 480 280, 580 280 C 680 280, 740 180, 840 180"
              stroke="var(--ink)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              fill="none"
              style={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: trailLength, opacity: 1 }
              }
            />

            {/* Tiny footprints walking from start toward Station 1 */}
            <g transform="translate(130, 150) rotate(-25)">
              <FootprintsDoodle size={22} />
            </g>
          </svg>

          {/* ── STATION 1: Python (Top Curve) ── */}
          <div className="trail-station-desktop station-python">
            {/* "You are here" badge */}
            <div className="you-are-here-tag">
              <span className="pulse-dot" aria-hidden="true" />
              <span>YOU ARE HERE</span>
            </div>

            {/* Pin flag */}
            <div className="trail-pin-btn">
              <MapPin size={22} filled={true} accent="var(--accent)" />
              <span className="trail-pin-badge">{items[0].name}</span>
            </div>

            {/* Paper note card below pin */}
            <m.div
              className="trail-station-card"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <div className="trail-card-title">
                <span>{items[0].name}</span>
                <span className="trail-card-status">in progress</span>
              </div>
              <p className="trail-card-context">"{items[0].context}"</p>
              <p className="trail-card-detail">{items[0].detail}</p>
            </m.div>
          </div>

          {/* ── STATION 2: Ethical Hacking (Bottom Curve) ── */}
          <div className="trail-station-desktop station-hacking">
            {/* Paper note card above pin */}
            <m.div
              className="trail-station-card"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="trail-card-title">
                <span>{items[1].name}</span>
                <span className="trail-card-status">in progress</span>
              </div>
              <p className="trail-card-context">"{items[1].context}"</p>
              <p className="trail-card-detail">{items[1].detail}</p>
            </m.div>

            {/* Pin flag */}
            <div className="trail-pin-btn">
              <MapPin size={22} filled={false} />
              <span className="trail-pin-badge">{items[1].name}</span>
            </div>
          </div>

          {/* ── STATION 3: Trail End (next: ???) ── */}
          <div className="trail-station-desktop station-next">
            <div className="trail-next-card">
              <span className="trail-next-text">next: ???</span>
            </div>
          </div>
        </div>

        {/* ── MOBILE VERTICAL TRAIL (Width <= 768px) ── */}
        <div className="learning-map-mobile">
          <ol className="learning-mobile-timeline" aria-label="Currently learning roadmap">
            {items.map((item) => (
              <li
                key={item.id}
                className={`learning-mobile-node ${item.isCurrent ? 'is-current' : ''}`}
              >
                {/* Node pin dot */}
                <div className="learning-mobile-dot" aria-hidden="true">
                  {item.isCurrent && <div className="learning-mobile-dot-inner" />}
                </div>

                {/* Card */}
                <div className="learning-mobile-card">
                  <div className="learning-mobile-header">
                    <span className="learning-mobile-name">{item.name}</span>
                    {item.isCurrent ? (
                      <span className="learning-mobile-badge">YOU ARE HERE</span>
                    ) : (
                      <span className="skills-hint-badge">IN PROGRESS</span>
                    )}
                  </div>
                  <p className="learning-mobile-context">"{item.context}"</p>
                  <p className="learning-mobile-detail">{item.detail}</p>
                </div>
              </li>
            ))}

            {/* Trail end node */}
            <li className="learning-mobile-node">
              <div className="learning-mobile-dot" aria-hidden="true" />
              <div className="learning-mobile-next">
                <span className="learning-mobile-next-text">next: ???</span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
