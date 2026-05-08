import React from 'react';

interface AIAvatarProps {
  persona?: 'amara' | 'jabari';
  size?: number;
  className?: string;
  pulse?: boolean;
}

/**
 * Friendly cartoon-style AI avatar for Amara (female) and Jabari (male).
 * Deliberately minimal — simple shapes, no uncanny valley.
 * Uses brand navy + yellow palette throughout.
 */
const AIAvatar: React.FC<AIAvatarProps> = ({
  persona = 'amara',
  size = 48,
  className = '',
  pulse = false,
}) => {
  const isAmara = persona === 'amara';

  return (
    <div
      className={`relative flex-shrink-0 ${pulse ? 'animate-pulse' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Outer circle — yellow brand background */}
        <circle cx="50" cy="50" r="50" fill="#FFD700" />

        {isAmara ? (
          <>
            {/* ── AMARA ─────────────────────────────────────────── */}

            {/* Natural afro hair — wide and round */}
            <ellipse cx="50" cy="32" rx="30" ry="26" fill="#1C1C6E" />
            {/* Face */}
            <ellipse cx="50" cy="52" rx="22" ry="24" fill="#8B5A2B" />
            {/* Afro top dome (overlaps face top) */}
            <ellipse cx="50" cy="28" rx="28" ry="22" fill="#1C1C6E" />

            {/* Ears */}
            <ellipse cx="28" cy="52" rx="5" ry="7" fill="#7A4E25" />
            <ellipse cx="72" cy="52" rx="5" ry="7" fill="#7A4E25" />

            {/* Eyes — simple friendly dots */}
            <circle cx="41" cy="48" r="4" fill="#1C1C6E" />
            <circle cx="59" cy="48" r="4" fill="#1C1C6E" />
            {/* Eye shine */}
            <circle cx="43" cy="46" r="1.5" fill="white" />
            <circle cx="61" cy="46" r="1.5" fill="white" />

            {/* Warm smile — simple arc, no teeth */}
            <path
              d="M41 60 Q50 68 59 60"
              stroke="#1C1C6E"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Small earrings — brand yellow */}
            <circle cx="28" cy="57" r="2.5" fill="#FFD700" />
            <circle cx="72" cy="57" r="2.5" fill="#FFD700" />

            {/* Shoulders */}
            <ellipse cx="50" cy="92" rx="26" ry="14" fill="#1C1C6E" />
            {/* Collar accent */}
            <path d="M38 82 Q50 90 62 82" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* ── JABARI ────────────────────────────────────────── */}

            {/* Short fade — head shape */}
            <ellipse cx="50" cy="40" rx="26" ry="28" fill="#1C1C6E" />
            {/* Face */}
            <ellipse cx="50" cy="50" rx="22" ry="22" fill="#5C3010" />
            {/* Hair — close crop overlay */}
            <ellipse cx="50" cy="28" rx="24" ry="14" fill="#1C1C6E" />
            {/* Fade line */}
            <ellipse cx="50" cy="36" rx="22" ry="7" fill="#3D1F0A" />

            {/* Ears */}
            <ellipse cx="28" cy="50" rx="5" ry="7" fill="#4E2508" />
            <ellipse cx="72" cy="50" rx="5" ry="7" fill="#4E2508" />

            {/* Eyes — simple, confident dots */}
            <circle cx="41" cy="48" r="4" fill="#1C1C6E" />
            <circle cx="59" cy="48" r="4" fill="#1C1C6E" />
            {/* Eye shine */}
            <circle cx="43" cy="46" r="1.5" fill="white" />
            <circle cx="61" cy="46" r="1.5" fill="white" />

            {/* Confident slight smile */}
            <path
              d="M42 60 Q50 66 58 60"
              stroke="#1C1C6E"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Shoulders — broader for Jabari */}
            <ellipse cx="50" cy="93" rx="30" ry="14" fill="#1C1C6E" />
          </>
        )}

        {/* YE badge — bottom right */}
        <circle cx="80" cy="80" r="15" fill="#1C1C6E" />
        <circle cx="80" cy="80" r="13" fill="#1C1C6E" stroke="#FFD700" strokeWidth="1.5" />
        <text
          x="80"
          y="85"
          textAnchor="middle"
          fontSize="10"
          fontWeight="900"
          fill="#FFD700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-0.5"
        >
          YE
        </text>
      </svg>
    </div>
  );
};

export default AIAvatar;
