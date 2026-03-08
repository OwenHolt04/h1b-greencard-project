import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS } from '../lib/constants';
import { FONT_SANS, FONT_SERIF } from '../lib/fonts';

const METRICS = [
  { label: 'RFE Rate', before: '~25%', after: '<5%', change: '-80%' },
  { label: 'Status Portals', before: '4', after: '1', change: '-75%' },
  { label: 'Attorney Hours', before: '~8', after: '~3', change: '-62%' },
  { label: 'Extension Cost', before: '$5K+', after: '~$2.5K', change: '-50%' },
  { label: 'Handoff Idle', before: 'Weeks', after: '<5 days', change: '-75%' },
  { label: 'PWD Revisions', before: '~15%', after: '<3%', change: '-80%' },
];

/**
 * Beat 8 — Close (8s)
 * Metrics strip → closing statement → product name → fade.
 */
export const Beat8_Close = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const metricsEnter = spring({ frame, fps, config: { damping: 200 }, delay: 10 });
  const statementEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.5 * fps) });
  const logoEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2.5 * fps) });

  // Fade out at the very end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #060e1a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_SANS,
        opacity: fadeOut,
      }}
    >
      {/* Metrics Strip */}
      <div
        style={{
          display: 'flex',
          gap: 2,
          marginBottom: 56,
          opacity: interpolate(metricsEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(metricsEnter, [0, 1], [20, 0])}px)`,
        }}
      >
        {METRICS.map((m, i) => {
          const metricDelay = spring({
            frame,
            fps,
            config: { damping: 200 },
            delay: 15 + i * 4,
          });

          return (
            <div
              key={i}
              style={{
                padding: '16px 24px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: i === 0 ? '10px 0 0 10px' : i === METRICS.length - 1 ? '0 10px 10px 0' : 0,
                borderRight: i < METRICS.length - 1 ? `1px solid rgba(255,255,255,0.08)` : 'none',
                textAlign: 'center',
                minWidth: 130,
                opacity: interpolate(metricDelay, [0, 1], [0, 1]),
              }}
            >
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {m.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>
                  {m.before}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>→</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>
                  {m.after}
                </span>
              </div>
              <div style={{ fontSize: 11, color: C.green500, fontWeight: 600, marginTop: 4 }}>
                {m.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Logo */}
      <div
        style={{
          opacity: interpolate(logoEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(logoEnter, [0, 1], [12, 0])}px)`,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: C.accent,
            letterSpacing: '-0.01em',
          }}
        >
          CaseBridge
        </div>
      </div>

      {/* Closing Statement */}
      <div
        style={{
          opacity: interpolate(statementEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(statementEnter, [0, 1], [16, 0])}px)`,
          textAlign: 'center',
          maxWidth: 750,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            fontFamily: FONT_SERIF,
            color: C.white,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}
        >
          {CAPTIONS.beat8.closing}
        </div>

        {/* Accent divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: C.accent,
            margin: '24px auto',
            opacity: interpolate(statementEnter, [0, 1], [0, 0.6]),
          }}
        />

        {/* Three-line summary */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16 }}>
          {[CAPTIONS.beat8.line1, CAPTIONS.beat8.line2, CAPTIONS.beat8.line3].map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 500,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
