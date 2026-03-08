import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * Caption overlay — appears at the bottom of the frame.
 * Use `delay` (in frames) to control when it enters.
 * Use `position` to place it at 'bottom' or 'top'.
 */
export const Caption = ({
  text,
  subtext = '',
  delay = 0,
  position = 'bottom',
  align = 'center',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(enter, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enter, [0, 1], [20, 0], {
    extrapolateRight: 'clamp',
  });

  const positionStyle =
    position === 'bottom'
      ? { bottom: 0, left: 0, right: 0 }
      : { top: 0, left: 0, right: 0 };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyle,
        padding: '40px 56px',
        background:
          `linear-gradient(to top, rgba(22, 39, 104, 0.92) 0%, rgba(22, 39, 104, 0.78) 60%, transparent 100%)`,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONT_SANS,
        textAlign: align,
        zIndex: 50,
        ...style,
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: 48,
          height: 2,
          background: C.accent,
          marginBottom: 14,
          ...(align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
        }}
      />
      <div
        style={{
          color: C.white,
          fontSize: 40,
          fontWeight: 700,
          fontFamily: FONT_DISPLAY,
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 24,
            fontWeight: 400,
            fontFamily: FONT_SANS,
            marginTop: 8,
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
