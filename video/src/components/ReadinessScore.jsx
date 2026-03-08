import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { C } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';

/**
 * Animated circular readiness score.
 * `fromScore` → `toScore` animates over `animDuration` frames starting at `animDelay`.
 * Set `popOnChange` to add a scale-pop when the score finishes changing.
 */
export const ReadinessScore = ({
  fromScore = 72,
  toScore = 72,
  animDelay = 0,
  animDuration = 30,
  size = 110,
  label = 'Filing Readiness',
  popOnChange = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sw = Math.max(6, size * 0.045);
  const radius = (size - sw * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const score = interpolate(
    frame - animDelay,
    [0, animDuration],
    [fromScore, toScore],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const displayScore = Math.round(score);
  const progress = (score / 100) * circumference;
  const color =
    score >= 80 ? C.green500 : score >= 60 ? C.amber500 : C.red500;

  // Scale-pop when score finishes changing
  let scalePop = 1;
  if (popOnChange && fromScore !== toScore) {
    const popStart = animDelay + animDuration * 0.7;
    const pop = spring({
      frame: frame - popStart,
      fps,
      config: { damping: 12, stiffness: 200 },
    });
    scalePop = interpolate(pop, [0, 1], [1, 1.08], { extrapolateRight: 'clamp' });
    // Settle back
    const settle = spring({
      frame: frame - (popStart + 12),
      fps,
      config: { damping: 200 },
    });
    scalePop = scalePop - interpolate(settle, [0, 1], [0, 0.08], { extrapolateRight: 'clamp' });
  }

  const subFontSize = Math.max(11, size * 0.09);
  const subY = size / 2 + size * 0.16;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        transform: `scale(${scalePop})`,
      }}
    >
      <svg width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.slate200}
          strokeWidth={sw}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Score number */}
        <text
          x={size / 2}
          y={size / 2 - size * 0.04}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.3}
          fontWeight={700}
          fontFamily={FONT_SANS}
          fill={C.slate800}
        >
          {displayScore}
        </text>
        <text
          x={size / 2}
          y={subY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={subFontSize}
          fontWeight={500}
          fontFamily={FONT_SANS}
          fill={C.slate400}
        >
          / 100
        </text>
      </svg>
      {label && (
        <div
          style={{
            fontSize: Math.max(11, size * 0.08),
            fontWeight: 600,
            color: C.slate500,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
