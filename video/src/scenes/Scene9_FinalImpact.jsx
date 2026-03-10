import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

const METRICS = [
  { label: 'RFE Rate', before: '~25%', after: '<5%', change: '\u221280%' },
  { label: 'Status Portals', before: '4', after: '1', change: '\u221275%' },
  { label: 'Attorney Hours', before: '~8 hrs', after: '~3 hrs', change: '\u221262%' },
  { label: 'Extension Cost', before: '$5K+', after: '~$2.5K', change: '\u221250%' },
];

/**
 * Scene 9 — Final Impact (10s)
 *
 * Closing scene. Zoom out from Prajwal's case to systemic impact.
 *
 * Visual arc:
 *   0-2s: Closing statement fades in
 *   2-5s: Prajwal's case summary — one line
 *   5-8s: Metrics grid appears
 *   8-10s: CaseBridge logo + fade out
 */
export const Scene9_FinalImpact = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const statementEnter = spring({ frame, fps, config: { damping: 200 }, delay: 10 });
  const caseLineEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2.0 * fps) });
  const metricsEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(4.0 * fps) });
  const logoEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(7.0 * fps) });

  // Fade out at the very end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 45, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_SANS,
        opacity: fadeOut,
      }}
    >
      {/* Closing Statement */}
      <div
        style={{
          opacity: interpolate(statementEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(statementEnter, [0, 1], [20, 0])}px)`,
          textAlign: 'center',
          maxWidth: 900,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            fontFamily: FONT_DISPLAY,
            color: C.white,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          {CAPTIONS.scene9.closing}
        </div>
      </div>

      {/* Prajwal's case summary line */}
      <div
        style={{
          opacity: interpolate(caseLineEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(caseLineEnter, [0, 1], [10, 0])}px)`,
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          {CASE.applicant.name} \u2022 {CASE.employer.shortName} \u2022 {CASE.attorney.firm} \u2022 {CASE.stage}
        </div>
      </div>

      {/* Metrics — 2x2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3,
          opacity: interpolate(metricsEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(metricsEnter, [0, 1], [16, 0])}px)`,
          marginBottom: 48,
        }}
      >
        {METRICS.map((m, i) => {
          const metricDelay = spring({
            frame, fps,
            config: { damping: 20, stiffness: 200 },
            delay: Math.round(4.3 * fps) + i * 5,
          });

          return (
            <div
              key={i}
              style={{
                padding: '20px 40px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius:
                  i === 0 ? '12px 0 0 0' :
                  i === 1 ? '0 12px 0 0' :
                  i === 2 ? '0 0 0 12px' :
                  '0 0 12px 0',
                textAlign: 'center',
                minWidth: 260,
                opacity: interpolate(metricDelay, [0, 1], [0, 1]),
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.45)',
                  fontWeight: 600,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {m.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'line-through',
                    fontWeight: 500,
                  }}
                >
                  {m.before}
                </span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.25)' }}>\u2192</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: C.accent }}>
                  {m.after}
                </span>
              </div>
              <div style={{ fontSize: 14, color: C.green500, fontWeight: 600, marginTop: 6 }}>
                {m.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Logo + accent line */}
      <div
        style={{
          opacity: interpolate(logoEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(logoEnter, [0, 1], [12, 0])}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            fontFamily: FONT_DISPLAY,
            color: C.accent,
            letterSpacing: '-0.01em',
          }}
        >
          CaseBridge
        </div>
        <div
          style={{
            width: interpolate(logoEnter, [0, 1], [0, 120], { extrapolateRight: 'clamp' }),
            height: 2,
            background: C.accent,
            marginTop: 12,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
