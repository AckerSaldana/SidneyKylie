import React from 'react';

/**
 * Film grain texture overlay
 * Adds subtle noise texture to create a more analog, premium feel
 */
const GrainOverlay = ({ opacity = 0.03 }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: opacity,
        mixBlendMode: 'overlay',
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.80"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#grain)"
        />
      </svg>
      {/* Animated grain for subtle movement */}
      <style>{`
        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0%); }
          60% { transform: translate(1%, 0%); }
          70% { transform: translate(0%, 1%); }
          80% { transform: translate(0%, -1%); }
          90% { transform: translate(1%, 1%); }
        }
      `}</style>
    </div>
  );
};

export default GrainOverlay;
