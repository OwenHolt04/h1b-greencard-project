import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE, LABELS, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

const FRAGMENTS = [
  { text: 'ETA-9089', x: -550, y: -300, rot: -10 },
  { text: 'I-140', x: 480, y: -250, rot: 7 },
  { text: 'I-485', x: -350, y: -60, rot: -4 },
  { text: 'I-765', x: 520, y: 30, rot: 5 },
  { text: 'I-131', x: -480, y: 180, rot: -7 },
  { text: 'G-28', x: 300, y: 230, rot: 3 },
  { text: 'DOL', x: -200, y: 320, rot: -3 },
  { text: 'USCIS', x: 160, y: -340, rot: 6 },
  { text: 'DOS', x: -120, y: -200, rot: -5 },
];

const CASE_DETAILS = [
  { label: 'APPLICANT', value: CASE.applicant.name, color: C.white },
  { label: 'EMPLOYER', value: CASE.employer.shortName, color: C.white },
  { label: 'STAGE', value: CASE.stage, color: C.white },
  { label: 'H-1B', value: `${CASE.applicant.h1bDaysLeft} days`, color: C.amber500 },
];

/**
 * MS2A — Platform Reveal (14s/420f)
 * Fragments converge → merge → CaseBridge card materializes.
 */
export const MS2A_PlatformReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const converge = interpolate(frame, [1 * fps, 5 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const fragOpacity = interpolate(frame, [0, 0.3 * fps, 4.5 * fps, 6 * fps], [0, 0.6, 0.6, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const gridAlpha = interpolate(frame, [3 * fps, 4 * fps, 5.5 * fps], [0, 0.12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const glowSize = interpolate(frame, [3.5 * fps, 7 * fps], [0, 700], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });
  const glowAlpha = interpolate(frame, [3.5 * fps, 6.5 * fps, 14 * fps], [0, 0.2, 0.08], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const mergeFlash = interpolate(frame, [5 * fps, 5.5 * fps, 6 * fps], [0, 0.3, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const titleIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(5.5 * fps) });
  const cardIn = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(5 * fps) });
  const detailBase = Math.round(7.5 * fps);
  const lineIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(9 * fps) });
  const lineWidth = interpolate(lineIn, [0, 1], [0, 140]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Grid flash */}
      {gridAlpha > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: gridAlpha }}>
          <line x1="960" y1="0" x2="960" y2="1080" stroke={C.accent} strokeWidth="0.5" />
          <line x1="0" y1="540" x2="1920" y2="540" stroke={C.accent} strokeWidth="0.5" />
          <rect x="430" y="380" width="1060" height="320" fill="none" stroke={C.accent} strokeWidth="0.5" strokeDasharray="6 4" />
        </svg>
      )}

      {/* Radial glow */}
      {glowSize > 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: glowSize, height: glowSize, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)', opacity: glowAlpha, pointerEvents: 'none',
        }} />
      )}

      {/* Merge flash */}
      {mergeFlash > 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 200, height: 200, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.accent} 0%, transparent 80%)`,
          transform: 'translate(-50%, -50%)', opacity: mergeFlash, pointerEvents: 'none',
        }} />
      )}

      {/* Converging fragments */}
      {fragOpacity > 0 && FRAGMENTS.map((f, i) => {
        const x = interpolate(converge, [0, 1], [f.x, 0]);
        const y = interpolate(converge, [0, 1], [f.y, 0]);
        const rot = interpolate(converge, [0, 1], [f.rot, 0]);
        const sc = interpolate(converge, [0, 0.6, 1], [1, 1, 0.4]);
        return (
          <div key={i} style={{
            position: 'absolute', left: 960 + x, top: 530 + y,
            transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`,
            opacity: fragOpacity, fontSize: 15, fontWeight: 600, color: C.white,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '8px 18px', whiteSpace: 'nowrap',
          }}>
            {f.text}
          </div>
        );
      })}

      {/* CaseBridge title */}
      <div style={{
        position: 'absolute', top: 260, left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 5,
        opacity: interpolate(titleIn, [0, 1], [0, 1]),
      }}>
        <div style={{
          fontSize: 80, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
          letterSpacing: '-0.02em',
          transform: `translateY(${interpolate(titleIn, [0, 1], [24, 0])}px)`,
        }}>
          {LABELS.ms2a.title}
        </div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>
          {LABELS.ms2a.sub}
        </div>
        <div style={{ width: lineWidth, height: 2, background: C.accent, margin: '16px auto 0', opacity: 0.6 }} />
      </div>

      {/* Case record card */}
      <div style={{
        position: 'absolute', top: 490, left: '50%',
        transform: `translate(-50%, 0) scale(${interpolate(cardIn, [0, 1], [0.88, 1])})`,
        opacity: interpolate(cardIn, [0, 1], [0, 1]), zIndex: 4, width: 1000,
      }}>
        <div style={{
          ...CARD.focal,
          borderTop: `3px solid ${C.accent}`,
          padding: '32px 48px',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(22,39,104,0.4)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 22 }}>
            CASE {CASE.caseId}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {CASE_DETAILS.map((d, i) => {
              const dIn = spring({ frame, fps, config: { damping: 200 }, delay: detailBase + i * 10 });
              return (
                <div key={i} style={{
                  opacity: interpolate(dIn, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(dIn, [0, 1], [14, 0])}px)`,
                }}>
                  <div style={{ fontSize: 11, color: 'rgba(22,39,104,0.4)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: d.color === C.white ? C.navy900 : d.color }}>{d.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
