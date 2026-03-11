import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { T, V3_CARD } from './theme';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { C } from '../lib/constants';

/**
 * V3S6 — Close (14s/420f)
 * Script line 12: "A filing error that adds months of delay — that is avoidable.
 *   A missed extension deadline — that is avoidable.
 *   And three stakeholders finally seeing the same case — that is what better coordination looks like."
 *
 * Phase 1 (0-3s): "Avoidable" items with strikethroughs
 * Phase 2 (3-6.5s): "Better coordination" statement
 * Phase 3 (6.5-10s): 4 impact metrics (compact)
 * Phase 4 (10-14s): CaseBridge logo + closing line
 */

const AVOIDABLE = [
  'A filing error that adds months of delay',
  'A missed extension deadline',
  'Three stakeholders with three different views',
];

const METRICS = [
  { label: 'RFE Rate', before: '~25%', after: '<5%', color: T.navy },
  { label: 'Portals', before: '4', after: '1', color: T.blue },
  { label: 'Attorney Hours', before: '~8', after: '~3', color: T.green },
  { label: 'Extension Cost', before: '$5K+', after: '~$2.5K', color: T.amber },
];

export const V3S6_Close = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase 1: Avoidable items
  const avoidableDelays = AVOIDABLE.map((_, i) => Math.round(0.5 * fps) + i * 18);
  const strikeThroughDelays = avoidableDelays.map(d => d + 15);

  // Phase 2: Coordination statement
  const coordIn = spring({ frame, fps, config: { damping: 16, stiffness: 160 }, delay: Math.round(3 * fps) });
  const coordExit = interpolate(frame, [5.5 * fps, 6.5 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 1+2 dim when metrics appear
  const priorDim = interpolate(frame, [6 * fps, 6.5 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 3: Metrics
  const metricsIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(6.5 * fps) });
  const metricsDim = interpolate(frame, [9.5 * fps, 10 * fps], [1, 0.15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 4: Logo
  const logoIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(10 * fps) });
  const lineW = interpolate(logoIn, [0, 1], [0, 100]);

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const CX = 960;

  return (
    <AbsoluteFill style={{
      background: T.bgGradient,
      fontFamily: FONT_SANS, overflow: 'hidden', opacity: fadeOut,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: T.navy }} />

      {/* Phase 1: Avoidable items with strike-through */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity: priorDim,
      }}>
        {AVOIDABLE.map((text, i) => {
          const itemIn = spring({ frame, fps, config: { damping: 200 }, delay: avoidableDelays[i] });
          const strikeProgress = interpolate(frame, [strikeThroughDelays[i], strikeThroughDelays[i] + 10], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const isStruck = strikeProgress > 0;

          return (
            <div key={i} style={{
              opacity: interpolate(itemIn, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(itemIn, [0, 1], [16, 0])}px)`,
              marginBottom: 14, position: 'relative',
            }}>
              <div style={{
                fontSize: 22, fontWeight: 600,
                color: isStruck ? T.textFaint : T.navy,
              }}>
                {text}
                {isStruck && (
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: T.green,
                    marginLeft: 16,
                  }}>
                    — avoidable
                  </span>
                )}
              </div>
              {/* Strike-through line */}
              {isStruck && (
                <div style={{
                  position: 'absolute', top: '50%', left: 0,
                  width: `${strikeProgress * 100}%`,
                  height: 2, background: T.textMuted, opacity: 0.4,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase 2: Coordination statement */}
      {frame > 3 * fps && coordExit > 0 && (
        <div style={{
          position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(coordIn, [0, 1], [0, 1]) * coordExit * priorDim,
          transform: `translateY(${interpolate(coordIn, [0, 1], [12, 0])}px)`,
        }}>
          <div style={{
            fontSize: 20, color: T.textSecondary, fontWeight: 500,
          }}>
            That is what better coordination looks like.
          </div>
        </div>
      )}

      {/* Phase 3: Impact metrics */}
      {frame > 6 * fps && (
        <div style={{
          position: 'absolute', top: 260, left: CX - 440, width: 880,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          opacity: interpolate(metricsIn, [0, 1], [0, 1]) * metricsDim,
          transform: `translateY(${interpolate(metricsIn, [0, 1], [16, 0])}px)`,
        }}>
          {METRICS.map((m, i) => {
            const delay = Math.round(7 * fps) + i * 10;
            const cardIn = spring({ frame, fps, config: { damping: 200 }, delay });
            return (
              <div key={i} style={{
                opacity: interpolate(cardIn, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(cardIn, [0, 1], [12, 0])}px)`,
              }}>
                <div style={{
                  ...V3_CARD.standard,
                  borderTop: `3px solid ${m.color}`,
                  padding: '16px 18px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: 'uppercase', marginBottom: 10 }}>
                    {m.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, color: T.textFaint, textDecoration: 'line-through' }}>{m.before}</span>
                    <span style={{ fontSize: 14, color: T.textFaint }}>→</span>
                    <span style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.after}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase 4: Logo + close */}
      <div style={{
        position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(logoIn, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(logoIn, [0, 1], [12, 0])}px)`,
      }}>
        <div style={{
          fontSize: 52, fontWeight: 700, fontFamily: FONT_DISPLAY, color: T.navy,
          letterSpacing: '-0.01em',
        }}>
          CaseBridge
        </div>
        <div style={{
          width: lineW, height: 2, background: T.navy, margin: '12px auto 0', opacity: 0.3,
        }} />
        <div style={{
          fontSize: 16, color: T.textSecondary, marginTop: 14,
          opacity: spring({ frame, fps, config: { damping: 200 }, delay: Math.round(11 * fps) }),
        }}>
          Process help, not magic.
        </div>
      </div>
    </AbsoluteFill>
  );
};
