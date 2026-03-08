import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';

/**
 * Animated circular readiness score.
 * `fromScore` → `toScore` animates over `animDuration` frames starting at `animDelay`.
 */
export const ReadinessScore = ({
  fromScore = 72,
  toScore = 72,
  animDelay = 0,
  animDuration = 30,
  size = 110,
  label = 'Filing Readiness',
}) => {
  const frame = useCurrentFrame();
  const radius = (size - 10) / 2;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.slate200}
          strokeWidth={6}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Score number */}
        <text
          x={size / 2}
          y={size / 2 - 4}
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
          y={size / 2 + 18}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
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
            fontSize: 11,
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
