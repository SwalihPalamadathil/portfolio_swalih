import React, { useState } from 'react';
import { AVATAR_SRC, ASSISTANT_NAME } from '../data/chat';

/**
 * 3D-style robot head inline SVG avatar
 * Rounded ivory shell, soft gradient shading & highlight, dark glass visor,
 * glowing lime #C6F24E eyes, small smile, antenna with lime tip, ear pods with lime rings.
 */
export function SwaiRobotSvg({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`swai-avatar-svg ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="swai-shell-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#F5F2EA" />
          <stop offset="100%" stopColor="#D5CFC0" />
        </radialGradient>
        <linearGradient id="swai-visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#262826" />
          <stop offset="100%" stopColor="#0F1110" />
        </linearGradient>
        <radialGradient id="swai-eye-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EAFFB0" />
          <stop offset="65%" stopColor="#C6F24E" />
          <stop offset="100%" stopColor="#9BD41B" />
        </radialGradient>
        <filter id="swai-shadow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#16150F" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Antenna with lime ball tip */}
      <line x1="32" y1="14" x2="32" y2="7" stroke="#7A7870" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="32" cy="6" r="3.2" fill="#C6F24E" stroke="#16150F" strokeWidth="1" />

      {/* Ear pods with lime rings */}
      <rect x="9" y="27" width="5.5" height="13" rx="2.75" fill="#DDD7C6" stroke="#16150F" strokeWidth="1" />
      <rect x="10.5" y="30.5" width="2.5" height="6" rx="1.25" fill="#C6F24E" />

      <rect x="49.5" y="27" width="5.5" height="13" rx="2.75" fill="#DDD7C6" stroke="#16150F" strokeWidth="1" />
      <rect x="51" y="30.5" width="2.5" height="6" rx="1.25" fill="#C6F24E" />

      {/* Rounded ivory shell */}
      <rect
        x="13"
        y="13"
        width="38"
        height="38"
        rx="15"
        fill="url(#swai-shell-grad)"
        stroke="#16150F"
        strokeWidth="1.2"
        filter="url(#swai-shadow)"
      />

      {/* Soft highlight arc on top of shell */}
      <path
        d="M 21 17 C 27 15, 37 15, 43 17"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Dark glass visor */}
      <rect
        x="18"
        y="24"
        width="28"
        height="17"
        rx="7"
        fill="url(#swai-visor-grad)"
        stroke="#16150F"
        strokeWidth="1"
      />

      {/* Visor specular reflection */}
      <path
        d="M 21 27 C 25 25.5, 33 25.5, 39 27"
        stroke="#FFFFFF"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Glowing lime #C6F24E eyes */}
      <circle cx="26" cy="32.5" r="2.8" fill="url(#swai-eye-glow)" />
      <circle cx="25.2" cy="31.7" r="0.8" fill="#FFFFFF" />
      <circle cx="38" cy="32.5" r="2.8" fill="url(#swai-eye-glow)" />
      <circle cx="37.2" cy="31.7" r="0.8" fill="#FFFFFF" />

      {/* Small subtle smile */}
      <path
        d="M 28.5 44 C 30.5 46, 33.5 46, 35.5 44"
        stroke="#16150F"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function SwaiAvatar({
  size = 32,
  alt = `${ASSISTANT_NAME} avatar`,
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

  const showImg = Boolean(AVATAR_SRC) && !imgError;

  return (
    <span
      className={`swai-avatar ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    >
      {showImg ? (
        <img
          src={AVATAR_SRC}
          width={size}
          height={size}
          decoding="async"
          alt={alt}
          className="swai-avatar-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <SwaiRobotSvg size={size} />
      )}
    </span>
  );
}
