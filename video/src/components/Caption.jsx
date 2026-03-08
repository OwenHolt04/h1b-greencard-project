import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';

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
        padding: '28px 48px',
        background: 'linear-gradient(to top, rgba(10, 22, 40, 0.88) 0%, rgba(10, 22, 40, 0.65) 60%, transparent 100%)',
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONT_SANS,
        textAlign: align,
        zIndex: 50,
        ...style,
      }}
    >
      <div
        style={{
          color: C.white,
          fontSize: 26,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 16,
            fontWeight: 400,
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
