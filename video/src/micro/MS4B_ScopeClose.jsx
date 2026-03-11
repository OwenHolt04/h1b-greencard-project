import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { C } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

const SOLVES = [
  'Cross-form data inconsistency',
  'Fragmented status across 4 portals',
  'Missed extension deadlines',
  'Redundant data entry across 6+ forms',
];

const CONSTRAINTS = [
  'Visa caps and per-country limits',
  'Priority date retrogression',
  'USCIS processing capacity',
];

/** Animated SVG checkmark */
const AnimatedCheck = ({ progress, size = 24, color = C.green500 }) => {
  const pathLen = 24;
  const offset = interpolate(progress, [0, 1], [pathLen, 0], { extrapolateRight: 'clamp' });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke={`${color}30`} strokeWidth="1.5" fill={`${color}10`} />
      <path d="M7 12.5l3 3 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={pathLen} strokeDashoffset={offset} />
    </svg>
  );
};

/**
 * MS4B — Scope + Close (16s/480f)
 * What CaseBridge solves vs structural constraints → "Process help, not magic" → logo.
 */
export const MS4B_ScopeClose = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headerIn = spring({ frame, fps, config: { damping: 200 }, delay: 8 });
  const leftIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const rightIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.5 * fps) });

  // Columns dim out as kinetic takes over
  const columnsDim = interpolate(frame, [5.5 * fps, 6.5 * fps], [1, 0.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Kinetic: "Process help, not magic."
  const kineticIn = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: Math.round(6 * fps) });
  const kineticExit = interpolate(frame, [8 * fps, 9 * fps], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Logo
  const logoIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(10 * fps) });
  const lineWidth = interpolate(logoIn, [0, 1], [0, 140]);

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 40, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const CX = 960;
  const colW = 460;
  const gap = 48;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden', opacity: fadeOut,
    }}>
      {/* Two columns */}
      <div style={{
        position: 'absolute', top: 180, left: CX - (colW * 2 + gap) / 2,
        display: 'flex', gap, opacity: columnsDim,
      }}>
        {/* LEFT — Solves */}
        <div style={{
          width: colW,
          opacity: interpolate(leftIn, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(leftIn, [0, 1], [-16, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)',
            borderLeft: `4px solid ${C.green500}`, borderRadius: 14, padding: '24px 28px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.green500, marginBottom: 20 }}>
              What CaseBridge Addresses
            </div>
            {SOLVES.map((item, i) => {
              const itemP = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.2 * fps) + i * 10 });
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                  borderBottom: i < SOLVES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  opacity: interpolate(itemP, [0, 1], [0, 1]),
                }}>
                  <AnimatedCheck progress={itemP} />
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Constraints */}
        <div style={{
          width: colW,
          opacity: interpolate(rightIn, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(rightIn, [0, 1], [16, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderLeft: '4px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '24px 28px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
              Structural — Requires Reform
            </div>
            {CONSTRAINTS.map((item, i) => {
              const itemP = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2 * fps) + i * 10 });
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                  borderBottom: i < CONSTRAINTS.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  opacity: interpolate(itemP, [0, 1], [0, 1]),
                }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
                    <line x1="8" y1="12" x2="16" y2="12" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kinetic: "Process help, not magic." */}
      {frame > 6 * fps && frame < 9 * fps && (
        <div style={{
          position: 'absolute', top: '42%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticIn, [0, 1], [0.85, 1])})`,
          zIndex: 30, opacity: interpolate(kineticIn, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 52, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 60px rgba(14,26,74,0.95), 0 0 120px rgba(14,26,74,0.8)',
          }}>
            Process help, not magic.
          </div>
        </div>
      )}

      {/* Logo + close */}
      <div style={{
        position: 'absolute', bottom: 140, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(logoIn, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(logoIn, [0, 1], [12, 0])}px)`,
      }}>
        <div style={{ fontSize: 52, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent, letterSpacing: '-0.01em' }}>
          CaseBridge
        </div>
        <div style={{ width: lineWidth, height: 2, background: C.accent, margin: '14px auto 0' }} />
      </div>
    </AbsoluteFill>
  );
};
