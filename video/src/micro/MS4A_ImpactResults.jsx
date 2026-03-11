import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { C, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { CallbackIcon } from '../components/FormFragment';

const METRICS = [
  { label: 'RFE Rate', before: '~25%', after: '<5%', change: '\u221280%', callbackType: 'validation', callbackColor: C.accent },
  { label: 'Status Portals', before: '4', after: '1', change: '\u221275%', callbackType: 'workspace', callbackColor: C.blue500 },
  { label: 'Attorney Hours', before: '~8 hrs', after: '~3 hrs', change: '\u221262%', callbackType: 'roles', callbackColor: C.green500 },
  { label: 'Extension Cost', before: '$5K+', after: '~$2.5K', change: '\u221250%', callbackType: 'deadline', callbackColor: C.amber500 },
];

/**
 * MS4A — Impact Results (16s/480f)
 * "What changes?" → 4 metric cards with capability callbacks → closing statement.
 */
export const MS4A_ImpactResults = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.3 * fps) });
  const questionExit = interpolate(frame, [2.5 * fps, 3.5 * fps], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const gridIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3 * fps) });
  const closingIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(12 * fps) });

  const CX = 960;
  const cardW = 440;
  const cardH = 170;
  const gapX = 28;
  const gapY = 24;
  const gridW = cardW * 2 + gapX;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* "What changes?" */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: interpolate(questionIn, [0, 1], [0, 1]) * questionExit,
      }}>
        <div style={{
          fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
          letterSpacing: '-0.02em',
        }}>
          What changes?
        </div>
      </div>

      {/* Metrics 2x2 grid */}
      <div style={{
        position: 'absolute', top: 200, left: CX - gridW / 2, width: gridW,
        display: 'grid', gridTemplateColumns: `repeat(2, ${cardW}px)`,
        gap: `${gapY}px ${gapX}px`,
        opacity: interpolate(gridIn, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(gridIn, [0, 1], [20, 0])}px)`,
      }}>
        {METRICS.map((m, i) => {
          const delay = Math.round(3.5 * fps) + i * 12;
          const cardIn = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay });

          return (
            <div key={i} style={{
              opacity: interpolate(cardIn, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(cardIn, [0, 1], [16, 0])}px)`,
            }}>
              <div style={{
                padding: '20px 24px',
                background: 'rgba(251,253,235,0.06)',
                border: '1px solid rgba(248,242,182,0.12)',
                borderRadius: 14,
                height: cardH,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                {/* Header with callback icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {m.label}
                  </div>
                  <CallbackIcon type={m.callbackType} size={32} color={m.callbackColor} />
                </div>

                {/* Before → After */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    fontSize: 26, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', fontWeight: 500,
                  }}>
                    {m.before}
                  </span>
                  <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.2)' }}>{'\u2192'}</span>
                  <span style={{ fontSize: 40, fontWeight: 700, color: C.accent }}>
                    {m.after}
                  </span>
                </div>

                {/* Change badge */}
                <div style={{ fontSize: 16, color: C.green500, fontWeight: 600 }}>
                  {m.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing statement */}
      <div style={{
        position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(closingIn, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(closingIn, [0, 1], [12, 0])}px)`,
      }}>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          A better process starts with better coordination.
        </div>
      </div>
    </AbsoluteFill>
  );
};
