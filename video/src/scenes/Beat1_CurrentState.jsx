import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS } from '../lib/constants';
import { FONT_SANS, FONT_SERIF } from '../lib/fonts';

/**
 * Beat 1 — Current-State Tension (12s)
 * Dark frame. Three lines reveal one at a time:
 *   "3 agencies." → "4 portals." → "0 dashboards."
 * Then a subline: "No one sees the full picture."
 */
export const Beat1_CurrentState = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { line1, line2, line3, sub } = CAPTIONS.beat1;

  // Staggered text reveals
  const line1Enter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.0 * fps) });
  const line2Enter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2.8 * fps) });
  const line3Enter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(4.6 * fps) });
  const subEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(7.0 * fps) });

  // Subtle background pulse on "0 dashboards"
  const bgBrightness = interpolate(line3Enter, [0, 1], [0.95, 1]);

  // Divider line between stats and subline
  const dividerWidth = interpolate(subEnter, [0, 1], [0, 200], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #060e1a 0%, ${C.navy900} 50%, #0d1f3a 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_SANS,
        filter: `brightness(${bgBrightness})`,
      }}
    >
      {/* Stat lines */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {[
          { text: line1, enter: line1Enter },
          { text: line2, enter: line2Enter },
          { text: line3, enter: line3Enter },
        ].map(({ text, enter }, i) => (
          <div
            key={i}
            style={{
              fontSize: i === 2 ? 72 : 60,
              fontWeight: 700,
              fontFamily: FONT_SERIF,
              color: i === 2 ? C.accent : C.white,
              letterSpacing: '-0.02em',
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          width: dividerWidth,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          marginTop: 40,
          marginBottom: 24,
        }}
      />

      {/* Subline */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.02em',
          opacity: interpolate(subEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subEnter, [0, 1], [12, 0])}px)`,
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};
