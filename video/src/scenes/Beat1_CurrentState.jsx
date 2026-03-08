import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * Beat 1 — Current-State Tension (10s)
 * Dark frame. Three lines reveal with escalating spring intensity:
 *   "3 agencies." (smooth) → "4 portals." (snappy) → "0 dashboards." (heavy)
 */
export const Beat1_CurrentState = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { line1, line2, line3, sub } = CAPTIONS.beat1;

  // Staggered text reveals — tighter for 10s beat
  const line1Enter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.6 * fps) });
  const line2Enter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(2.0 * fps) });
  const line3Enter = spring({ frame, fps, config: { damping: 15, stiffness: 80, mass: 2 }, delay: Math.round(3.4 * fps) });
  const subEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(5.5 * fps) });

  // Animated background gradient angle
  const bgAngle = interpolate(frame, [0, 10 * fps], [160, 172], { extrapolateRight: 'clamp' });

  // Divider
  const dividerProgress = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(5.0 * fps) });
  const dividerWidth = interpolate(dividerProgress, [0, 1], [0, 400], { extrapolateRight: 'clamp' });

  const LINES = [
    { text: line1, enter: line1Enter, size: 88, color: C.white },
    { text: line2, enter: line2Enter, size: 88, color: C.white },
    { text: line3, enter: line3Enter, size: 110, color: C.accent },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${bgAngle}deg, #0e1a4a 0%, ${C.navy900} 50%, ${C.navy800} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_SANS,
      }}
    >
      {/* Stat lines */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {LINES.map(({ text, enter, size, color }, i) => (
          <div
            key={i}
            style={{
              fontSize: size,
              fontWeight: 700,
              fontFamily: FONT_DISPLAY,
              color,
              letterSpacing: '-0.02em',
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(enter, [0, 1], [i === 2 ? 40 : 24, 0])}px)`,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Divider with glow */}
      <div
        style={{
          width: dividerWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          marginTop: 36,
          marginBottom: 24,
          boxShadow: `0 0 16px rgba(248, 242, 182, 0.4)`,
        }}
      />

      {/* Subline */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.01em',
          opacity: interpolate(subEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subEnter, [0, 1], [12, 0])}px)`,
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};
