import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { FormFragment } from '../components/FormFragment';

/**
 * MS1C — Problem Pain (10s/300f)
 * Two form fragments showing the SAME field with different values.
 * Visual proof: this is how contradictions happen.
 */
export const MS1C_ProblemPain = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(0.5 * fps) });
  const rightIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(1.2 * fps) });
  const warningIn = interpolate(frame, [2 * fps, 3 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const labelIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(4 * fps) });
  const subIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(5.5 * fps) });

  const CX = 960;
  const cardW = 400;
  const gap = 100;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* Label: "Same field. Different forms." */}
      <div style={{
        position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(labelIn, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(labelIn, [0, 1], [10, 0])}px)`,
      }}>
        <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Same field. Different forms.
        </span>
      </div>

      {/* Left form fragment */}
      <div style={{
        position: 'absolute', left: CX - cardW - gap / 2, top: 320,
        opacity: interpolate(leftIn, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(leftIn, [0, 1], [-30, 0])}px)`,
      }}>
        <FormFragment
          formCode="ETA-9089"
          fieldValue={CASE.employer.wrongName}
          isError
          width={cardW}
        />
      </div>

      {/* Right form fragment */}
      <div style={{
        position: 'absolute', left: CX + gap / 2, top: 320,
        opacity: interpolate(rightIn, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(rightIn, [0, 1], [30, 0])}px)`,
      }}>
        <FormFragment
          formCode="I-140"
          fieldValue={CASE.employer.name}
          isError
          width={cardW}
        />
      </div>

      {/* Warning connector */}
      <svg style={{
        position: 'absolute', left: CX - gap / 2, top: 400, width: gap, height: 60,
        pointerEvents: 'none',
      }}>
        <line x1="0" y1="30" x2={gap} y2="30"
          stroke={C.red500} strokeWidth="2.5" strokeDasharray="8 5"
          opacity={warningIn * 0.7}
          strokeDashoffset={-frame * 0.5}
        />
        <circle cx={gap / 2} cy="30" r={7 * warningIn}
          fill={C.red500} opacity={warningIn * 0.9} />
        <circle cx={gap / 2} cy="30" r={14 * warningIn}
          fill="none" stroke={C.red500} strokeWidth="1.5"
          opacity={warningIn * 0.3 * (0.5 + 0.5 * Math.sin(frame / 8))} />
      </svg>

      {/* Contradiction label */}
      <div style={{
        position: 'absolute', top: 660, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(subIn, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(subIn, [0, 1], [12, 0])}px)`,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '10px 24px', borderRadius: 10,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.red500 }} />
          <span style={{ fontSize: 18, color: C.red500, fontWeight: 600 }}>
            Contradiction
          </span>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>
            — triggers RFE, adds 2-4 months
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
