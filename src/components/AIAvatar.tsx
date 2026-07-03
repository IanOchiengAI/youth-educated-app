import React from 'react';

interface AIAvatarProps {
  persona?: 'amara' | 'jabari';
  size?: number;
  className?: string;
  pulse?: boolean;
}

/**
 * Premium, modern vector AI assistant avatar for Amara and Jabari.
 * Custom designed with a professional, distinctively African/Kenyan aesthetic,
 * featuring beautiful warm skin gradients, traditional Maasai-inspired beaded patterns,
 * and authentic geometric hair designs.
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
        <defs>
          {/* Brand & African Accent Gradients */}
          <linearGradient id="yellowGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF066" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          <linearGradient id="navyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2A95" />
            <stop offset="100%" stopColor="#12124E" />
          </linearGradient>
          <radialGradient id="glowGrd" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>

          {/* Authentic Warm African Skin Tone Gradients */}
          <linearGradient id="skinAmara" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8C532B" />
            <stop offset="100%" stopColor="#5A2C0A" />
          </linearGradient>
          <linearGradient id="skinJabari" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5E3113" />
            <stop offset="100%" stopColor="#321603" />
          </linearGradient>

          {/* Kenyan Flag Colors for Beaded Collar */}
          <linearGradient id="kenyanRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3B30" />
            <stop offset="100%" stopColor="#C9140C" />
          </linearGradient>
          <linearGradient id="kenyanGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34C759" />
            <stop offset="100%" stopColor="#1E8237" />
          </linearGradient>
        </defs>

        {isAmara ? (
          <>
            {/* ── AMARA (Kenyan AI Assistant) ──────────────────────────────── */}
            {/* Pinned background circle */}
            <circle cx="50" cy="50" r="48" fill="url(#navyBlue)" stroke="url(#yellowGold)" strokeWidth="2" />
            <circle cx="50" cy="50" r="40" fill="url(#glowGrd)" />

            {/* Stylized high-puff afro curls (geometric clusters) */}
            <g fill="#0B0B23">
              <circle cx="50" cy="24" r="16" />
              <circle cx="38" cy="30" r="13" />
              <circle cx="62" cy="30" r="13" />
              <circle cx="44" cy="20" r="14" />
              <circle cx="56" cy="20" r="14" />
            </g>

            {/* Gold Headband */}
            <path d="M33,42 Q50,32 67,42" stroke="url(#yellowGold)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Ears */}
            <ellipse cx="28" cy="54" rx="4" ry="6" fill="#754320" />
            <ellipse cx="72" cy="54" rx="4" ry="6" fill="#754320" />

            {/* Face */}
            <ellipse cx="50" cy="55" rx="19" ry="21" fill="url(#skinAmara)" />

            {/* Beaded Maasai earrings */}
            <circle cx="28" cy="60" r="3.5" stroke="url(#kenyanRed)" strokeWidth="1.5" fill="none" />
            <circle cx="72" cy="60" r="3.5" stroke="url(#kenyanGreen)" strokeWidth="1.5" fill="none" />

            {/* Eyes & Smile */}
            <circle cx="43" cy="50" r="3" fill="#0B0B23" />
            <circle cx="57" cy="50" r="3" fill="#0B0B23" />
            <circle cx="44" cy="49" r="1" fill="#FFFFFF" />
            <circle cx="58" cy="49" r="1" fill="#FFFFFF" />
            <path d="M44,60 Q50,65 56,60" stroke="#0B0B23" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Neck & Maasai Beaded Collar */}
            <path d="M45,74 L45,84 L55,84 L55,74 Z" fill="url(#skinAmara)" opacity="0.9" />
            {/* Dashed lines representing beaded patterns (Red, Green, Gold) */}
            <path d="M33,80 Q50,88 67,80" stroke="url(#kenyanRed)" strokeWidth="2.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
            <path d="M30,84 Q50,93 70,84" stroke="url(#kenyanGreen)" strokeWidth="2.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
            <path d="M27,88 Q50,98 73,88" stroke="url(#yellowGold)" strokeWidth="2.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* ── JABARI (Kenyan AI Assistant) ──────────────────────────────── */}
            {/* Pinned background circle */}
            <circle cx="50" cy="50" r="48" fill="url(#navyBlue)" stroke="url(#yellowGold)" strokeWidth="2" />
            <circle cx="50" cy="50" r="40" fill="url(#glowGrd)" />

            {/* Close-cropped fade haircut */}
            <path d="M30,38 C30,25 40,18 50,18 C60,18 70,25 70,38 Z" fill="#0B0B23" />

            {/* Sharp razor part line (Kenyan fade accent) */}
            <path d="M34,35 Q43,38 47,34" stroke="url(#yellowGold)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Ears */}
            <ellipse cx="28" cy="52" rx="4" ry="6" fill="#4B250A" />
            <ellipse cx="72" cy="52" rx="4" ry="6" fill="#4B250A" />

            {/* Face */}
            <ellipse cx="50" cy="53" rx="19" ry="21" fill="url(#skinJabari)" />

            {/* Sharp tech visor/glasses */}
            <path d="M34,43 L66,43 L63,48 L37,48 Z" fill="#12124E" opacity="0.9" />
            <path d="M34,43 L66,43" stroke="url(#yellowGold)" strokeWidth="1.5" />

            {/* Confident Smile */}
            <path d="M44,58 Q50,63 56,58" stroke="#0B0B23" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Neck & Collar */}
            <path d="M45,72 L45,84 L55,84 L55,72 Z" fill="url(#skinJabari)" opacity="0.9" />
            {/* Dashed lines representing beaded patterns (Red, Green, Gold) */}
            <path d="M32,78 Q50,86 68,78" stroke="url(#kenyanRed)" strokeWidth="2.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
            <path d="M29,82 Q50,91 71,82" stroke="url(#kenyanGreen)" strokeWidth="2.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
            <path d="M26,86 Q50,96 74,86" stroke="url(#yellowGold)" strokeWidth="2.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* YE badge — bottom right */}
        <circle cx="80" cy="80" r="15" fill="url(#navyBlue)" />
        <circle cx="80" cy="80" r="13" fill="url(#navyBlue)" stroke="url(#yellowGold)" strokeWidth="1.5" />
        <text
          x="80"
          y="84"
          textAnchor="middle"
          fontSize="9"
          fontWeight="900"
          fill="url(#yellowGold)"
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
