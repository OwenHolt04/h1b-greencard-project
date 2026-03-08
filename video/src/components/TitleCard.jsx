import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { C } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * Full-frame dark title card for section transitions.
 * Use between beats for clean visual breaks.
 */
export const TitleCard = ({
  headline,
  subline = '',
  accentText = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEnter = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 10,
  });

  const sublineEnter = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 25,
  });

  const accentEnter = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 40,
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${C.navy900} 0%, ${C.navy800} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_SANS,
        padding: 120,
      }}
    >
      {accentText && (
        <div
          style={{
            color: C.accent,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 20,
            opacity: interpolate(accentEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(accentEnter, [0, 1], [12, 0])}px)`,
          }}
        >
          {accentText}
        </div>
      )}

      <div
        style={{
          color: C.white,
          fontSize: 52,
          fontWeight: 700,
          fontFamily: FONT_DISPLAY,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          maxWidth: 1100,
          opacity: interpolate(headlineEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headlineEnter, [0, 1], [20, 0])}px)`,
        }}
      >
        {headline}
      </div>

      {subline && (
        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 20,
            fontWeight: 400,
            marginTop: 16,
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.5,
            opacity: interpolate(sublineEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(sublineEnter, [0, 1], [12, 0])}px)`,
          }}
        >
          {subline}
        </div>
      )}
    </AbsoluteFill>
  );
};
