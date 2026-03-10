import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';

const SOLVES = [
  'Cross-form data inconsistency',
  'Fragmented status visibility across 4 portals',
  'Missed deadlines and extension risk',
  'Legal language opacity for applicants',
  'Dropped handoffs between stakeholders',
  'Redundant data entry across 6+ forms',
];

const CONSTRAINTS = [
  'Visa caps and per-country limits',
  'Priority date retrogression',
  'USCIS staffing and processing capacity',
  'Political and legislative volatility',
  'OPT-to-H-1B pipeline alignment',
];

/** Animated SVG checkmark that draws in. */
const AnimatedCheck = ({ progress, size = 26, color = C.green500 }) => {
  const pathLength = 24;
  const offset = interpolate(progress, [0, 1], [pathLength, 0], { extrapolateRight: 'clamp' });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke={`${color}30`} strokeWidth="1.5" fill={`${color}10`} />
      <path d="M7 12.5l3 3 7-7" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={pathLength} strokeDashoffset={offset} />
    </svg>
  );
};

/**
 * Scene 8 — Scope Clarification (12s)
 *
 * Two columns on dark: what CaseBridge solves (green checks) vs structural
 * constraints (muted dashes). Bottom: scope statement.
 * Consistent dark-space visual language — no MinimalFrame.
 */
export const Scene8_ScopeClarification = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerEnter = spring({ frame, fps, config: { damping: 200 }, delay: 8 });
  const leftEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const rightEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.2 * fps) });
  const quoteEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(5.0 * fps) });

  // "Process help, not magic" kinetic caption
  const kineticEnter = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: Math.round(7.0 * fps) });
  const kineticExit = interpolate(frame, [9 * fps, 10 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS,
        padding: '60px 100px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        marginBottom: 36,
        opacity: interpolate(headerEnter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(headerEnter, [0, 1], [12, 0])}px)`,
      }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.white, fontFamily: FONT_DISPLAY }}>
          System Impact &amp; Scope
        </div>
        <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
          What this platform changes directly {'\u2014'} and what requires broader reform.
        </div>
      </div>

      {/* Two-Column Grid */}
      <div style={{ display: 'flex', gap: 32, flex: 1 }}>
        {/* LEFT — Solves Directly */}
        <div style={{
          flex: 1,
          opacity: interpolate(leftEnter, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(leftEnter, [0, 1], [-16, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(34,197,94,0.04)',
            border: '1px solid rgba(34,197,94,0.15)',
            borderLeft: `4px solid ${C.green500}`,
            borderRadius: 14, padding: '28px 32px', height: '100%',
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.green500, marginBottom: 22 }}>
              What CaseBridge Solves Directly
            </div>
            {SOLVES.map((item, i) => {
              const itemProgress = spring({
                frame, fps, config: { damping: 200 },
                delay: Math.round(1.2 * fps) + i * 8,
              });
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  borderBottom: i < SOLVES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemProgress, [0, 1], [10, 0])}px)`,
                }}>
                  <AnimatedCheck progress={itemProgress} />
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Structural Constraints */}
        <div style={{
          flex: 1,
          opacity: interpolate(rightEnter, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(rightEnter, [0, 1], [16, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderLeft: '4px solid rgba(255,255,255,0.15)',
            borderRadius: 14, padding: '28px 32px', height: '100%',
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 22 }}>
              Structural Constraints {'\u2014'} Require Legislative Action
            </div>
            {CONSTRAINTS.map((item, i) => {
              const itemEnter = spring({
                frame, fps, config: { damping: 200 },
                delay: Math.round(1.8 * fps) + i * 8,
              });
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  borderBottom: i < CONSTRAINTS.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  opacity: interpolate(itemEnter, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemEnter, [0, 1], [10, 0])}px)`,
                }}>
                  <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
                    <line x1="8" y1="12" x2="16" y2="12" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scope Statement */}
      <div style={{
        marginTop: 28, borderRadius: 12, padding: '22px 32px',
        borderLeft: `4px solid ${C.accent}`,
        background: 'rgba(248,242,182,0.05)',
        opacity: interpolate(quoteEnter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(quoteEnter, [0, 1], [12, 0])}px)`,
      }}>
        <div style={{ fontSize: 20, color: C.white, fontFamily: FONT_DISPLAY, lineHeight: 1.5 }}>
          &ldquo;This platform reduces avoidable process friction, rework, and uncertainty.
          It does not eliminate statutory caps, retrogression, or all legal complexity.&rdquo;
        </div>
      </div>

      {/* Kinetic caption: "Process help, not magic." */}
      {frame > 7 * fps && frame < 10 * fps && (
        <div style={{
          position: 'absolute', top: '42%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticEnter, [0, 1], [0.85, 1])})`,
          zIndex: 30, pointerEvents: 'none',
          opacity: interpolate(kineticEnter, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 52, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 60px rgba(14,26,74,0.95), 0 0 120px rgba(14,26,74,0.8)',
          }}>
            Process help, not magic.
          </div>
        </div>
      )}

      <Caption
        text={CAPTIONS.scene8.main}
        delay={Math.round(0.8 * fps)}
      />
    </AbsoluteFill>
  );
};
