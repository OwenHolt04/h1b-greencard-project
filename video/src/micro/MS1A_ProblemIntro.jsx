import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { FormFragment } from '../components/FormFragment';

/**
 * MS1A — Problem Intro (14s/420f)
 *
 * TRUE MICRO-SCENE GRAMMAR:
 *   Phase 1 (0-4s): Prajwal's name, large, centered, ALONE. Human anchor.
 *   Phase 2 (4-9.5s): Real form fragments FLOOD in.
 *   Phase 3 (9.5-12s): Pain annotations appear near fragments.
 *   Phase 4 (12-14s): Everything dims. Setup for 1B.
 */
export const MS1A_ProblemIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  // Phase 1: Prajwal intro
  const nameIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const subIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.5 * fps) });

  // Name exits as forms flood in
  const nameExit = interpolate(frame, [3 * fps, 4.5 * fps], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 2: Form fragments (shifted 1s earlier)
  const FORMS = [
    { code: 'ETA-9089', val: 'Employer Name: ____', x: -420, y: -240, rot: -6, delay: 3.5 },
    { code: 'I-140', val: 'Company: ____', x: 350, y: -180, rot: 5, delay: 3.8 },
    { code: 'I-485', val: 'Family Name: ____', x: -250, y: -50, rot: -3, delay: 4.1 },
    { code: 'I-765', val: 'Employer Info: ____', x: 480, y: 20, rot: 4, delay: 4.4 },
    { code: 'I-131', val: 'Applicant Name: ____', x: -380, y: 120, rot: -5, delay: 4.7 },
    { code: 'G-28', val: 'Attorney: ____', x: 300, y: 200, rot: 3, delay: 5.0 },
  ];

  // Portal labels (additional chaos)
  const PORTALS = [
    { text: 'DOL Portal', x: -180, y: 280, delay: 5.5 },
    { text: 'USCIS Portal', x: 150, y: -300, delay: 5.8 },
    { text: 'DOS Portal', x: -400, y: 300, delay: 6.1 },
    { text: 'Email #47', x: 420, y: -280, delay: 6.4 },
    { text: 'Physical mail', x: -100, y: 340, delay: 6.7 },
    { text: 'Visa Bulletin', x: 350, y: 290, delay: 7.0 },
  ];

  // Pain annotations
  const PAINS = [
    { text: 'duplicate entry', x: -350, y: -140, delay: 8.5 },
    { text: 'unclear status', x: 400, y: -100, delay: 9 },
    { text: 'deadline risk', x: -200, y: 180, delay: 9.5 },
    { text: 'no single view', x: 300, y: 130, delay: 10 },
  ];

  // Everything dims at end
  const allExit = interpolate(frame, [11.5 * fps, 13.5 * fps], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Camera shake during chaos
  const chaosPhase = frame > 4 * fps && frame < 12 * fps ? 1 : 0;
  const shakeX = chaosPhase * Math.sin(frame / 12) * 3;
  const shakeY = chaosPhase * Math.cos(frame / 18) * 2;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 50%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
      transform: `translate(${shakeX}px, ${shakeY}px)`,
    }}>
      {/* ── Phase 1: Prajwal name (full screen, alone) ── */}
      <div style={{
        position: 'absolute', top: CY, left: CX,
        transform: 'translate(-50%, -50%)', textAlign: 'center',
        opacity: nameExit, zIndex: 20,
      }}>
        <div style={{
          fontSize: 80, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
          letterSpacing: '-0.02em',
          opacity: interpolate(nameIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(nameIn, [0, 1], [30, 0])}px)`,
        }}>
          {CASE.applicant.name}
        </div>
        <div style={{
          fontSize: 22, color: 'rgba(255,255,255,0.5)', marginTop: 16,
          opacity: interpolate(subIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subIn, [0, 1], [12, 0])}px)`,
        }}>
          Sr. Product Manager · H-1B · EB-2 India
        </div>
      </div>

      {/* ── Phase 2: Real form fragments (not just pills) ── */}
      <div style={{ position: 'absolute', inset: 0, opacity: allExit }}>
        {FORMS.map((f, i) => {
          const fIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(f.delay * fps) });
          const drift = interpolate(frame, [f.delay * fps, (f.delay + 6) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const driftX = interpolate(drift, [0, 1], [0, (f.x > 0 ? -8 : 8)]);

          return (
            <div key={i} style={{
              position: 'absolute',
              left: CX + f.x, top: CY + f.y,
              transform: `translate(-50%, -50%) rotate(${f.rot}deg) translateX(${driftX}px)`,
              opacity: interpolate(fIn, [0, 1], [0, 0.7]),
            }}>
              <FormFragment
                formCode={f.code}
                fieldValue=""
                width={200}
                scale={0.85}
              />
            </div>
          );
        })}

        {/* Portal and other chaos labels */}
        {PORTALS.map((p, i) => {
          const pIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(p.delay * fps) });
          return (
            <div key={`p${i}`} style={{
              position: 'absolute', left: CX + p.x, top: CY + p.y,
              transform: 'translate(-50%, -50%)',
              opacity: interpolate(pIn, [0, 1], [0, 0.5]),
              fontSize: 14, fontWeight: 600,
              color: p.text.includes('Portal') ? C.amber500 : C.slate400,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '6px 14px', whiteSpace: 'nowrap',
            }}>
              {p.text}
            </div>
          );
        })}
      </div>

      {/* ── Phase 3: Pain annotations ── */}
      <div style={{ position: 'absolute', inset: 0, opacity: allExit }}>
        {PAINS.map((p, i) => {
          const painIn = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(p.delay * fps) });
          return (
            <div key={`pain${i}`} style={{
              position: 'absolute', left: CX + p.x, top: CY + p.y,
              transform: `translate(-50%, -50%) scale(${interpolate(painIn, [0, 1], [0.8, 1])})`,
              opacity: interpolate(painIn, [0, 1], [0, 0.85]),
              display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.red500, boxShadow: '0 0 8px rgba(239,68,68,0.5)' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.red500 }}>{p.text}</span>
            </div>
          );
        })}
      </div>

      {/* Fragmented red lines during chaos */}
      {frame > 7 * fps && frame < 12 * fps && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, opacity: allExit * 0.2 }}>
          <line x1="300" y1="200" x2="500" y2="350" stroke={C.red500} strokeWidth="1.5" strokeDasharray="8 6" />
          <line x1="1400" y1="250" x2="1100" y2="400" stroke={C.red500} strokeWidth="1.5" strokeDasharray="8 6" />
          <line x1="600" y1="600" x2="400" y2="750" stroke={C.red500} strokeWidth="1.5" strokeDasharray="8 6" />
          <line x1="1200" y1="550" x2="1500" y2="700" stroke={C.red500} strokeWidth="1.5" strokeDasharray="8 6" />
        </svg>
      )}
    </AbsoluteFill>
  );
};
