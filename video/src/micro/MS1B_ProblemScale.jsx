import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { C, LABELS } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * MS1B — Problem Scale (14s/420f)
 * "3 agencies. 6 forms. 165+ pages. 0 dashboards."
 * Big kinetic type, each line slams in.
 */
export const MS1B_ProblemScale = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = LABELS.ms1b.lines;
  const delays = [
    Math.round(0.8 * fps),
    Math.round(2.2 * fps),
    Math.round(3.8 * fps),
    Math.round(5.5 * fps),
  ];
  const sizes = [88, 88, 88, 110];
  const colors = [C.white, C.white, C.white, C.accent];
  const configs = [
    { damping: 200 },
    { damping: 200 },
    { damping: 200 },
    { damping: 15, stiffness: 80, mass: 2 },
  ];

  // Divider
  const divIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(7 * fps) });
  const divW = interpolate(divIn, [0, 1], [0, 400]);

  // Subline
  const subIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(8 * fps) });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(165deg, #0e1a4a 0%, ${C.navy900} 50%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Stat lines */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {lines.map((text, i) => {
          const enter = spring({ frame, fps, config: configs[i], delay: delays[i] });
          return (
            <div key={i} style={{
              fontSize: sizes[i], fontWeight: 700, fontFamily: FONT_DISPLAY,
              color: colors[i], letterSpacing: '-0.02em',
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(enter, [0, 1], [i === 3 ? 40 : 24, 0])}px)`,
            }}>
              {text}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{
        width: divW, height: 3, marginTop: 36, marginBottom: 20,
        background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
        boxShadow: '0 0 16px rgba(248,242,182,0.4)',
      }} />

      {/* Subline */}
      <div style={{
        fontSize: 26, color: 'rgba(255,255,255,0.6)', fontWeight: 400,
        opacity: interpolate(subIn, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(subIn, [0, 1], [12, 0])}px)`,
      }}>
        One inconsistency can reset months of progress.
      </div>
    </AbsoluteFill>
  );
};
