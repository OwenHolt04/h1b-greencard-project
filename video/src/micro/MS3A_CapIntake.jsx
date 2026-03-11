import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { FormFragment } from '../components/FormFragment';

const FORM_TARGETS = [
  { code: 'ETA-9089', label: 'PERM Labor Cert' },
  { code: 'I-140', label: 'Immigrant Petition' },
  { code: 'I-485', label: 'Adjust Status' },
  { code: 'I-765', label: 'Work Authorization' },
  { code: 'I-131', label: 'Travel Document' },
  { code: 'G-28', label: 'Attorney Notice' },
];

/**
 * MS3A — Enter Once / Intake Sync (18s/540f)
 *
 * TRUE MICRO-SCENE GRAMMAR:
 *   Phase 1 (0-3.5s): ONE field, large, centered. Nothing else.
 *   Phase 2 (3.5-7s): That field value appears in ONE form below. Proof of sync.
 *   Phase 3 (7-12s): Field shrinks up. 5 more forms fan out. Connectors draw. All sync.
 *   Phase 4 (12-16s): "Enter once." kinetic. Brief assembled view.
 *   Phase 5 (16-18s): Settle.
 */
export const MS3A_CapIntake = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  // ── Phase 1: Single field hero (0-3.5s) ──
  const phase1End = 3.5 * fps;
  const fieldIn = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(0.3 * fps) });
  // Field label typing effect
  const labelChars = 'Employer Legal Name'.length;
  const typingProgress = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visibleLabel = 'Employer Legal Name'.slice(0, Math.floor(typingProgress * labelChars));

  const valueIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.8 * fps) });

  // Phase 1→2 transition: hero field moves up and shrinks
  const heroShrink = interpolate(frame, [phase1End, phase1End + 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const heroScale = interpolate(heroShrink, [0, 1], [1, 0.65]);
  const heroY = interpolate(heroShrink, [0, 1], [CY - 80, 100]);
  const heroX = CX;

  // ── Phase 2: First sync proof (3.5-7s) ──
  const firstFormIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(4 * fps) });
  const firstSyncFlash = interpolate(frame - 4.8 * fps, [0, 8, 25], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const connectorDraw = interpolate(frame, [3.5 * fps, 4.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 2→3 transition: first form moves into grid position
  const gridTransition = interpolate(frame, [6.5 * fps, 7.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });

  // ── Phase 3: Full form grid (8-14s) ──
  const COLS = 3;
  const formW = 180;
  const formGap = 14;
  const gridW = COLS * formW + (COLS - 1) * formGap;
  const gridLeft = CX - gridW / 2;
  const gridTop = 280;

  // ── Phase 4: Kinetic "Enter once." (12-16s) ──
  const kineticIn = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: Math.round(12.5 * fps) });
  const kineticExit = interpolate(frame, [15 * fps, 16 * fps], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Count label
  const countIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(11 * fps) });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* ── Phase 1: Hero field ── */}
      <div style={{
        position: 'absolute', left: heroX, top: heroY,
        transform: `translate(-50%, -50%) scale(${heroScale})`,
        opacity: interpolate(fieldIn, [0, 1], [0, 1]),
        zIndex: 10,
      }}>
        {/* Field label */}
        <div style={{
          fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
          textAlign: 'center',
        }}>
          {visibleLabel}<span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: C.accent }}>|</span>
        </div>

        {/* Field value — the hero */}
        <div style={{
          opacity: interpolate(valueIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(valueIn, [0, 1], [10, 0])}px)`,
        }}>
          <div style={{
            fontSize: 38, fontWeight: 700, color: C.navy900,
            padding: '18px 40px', borderRadius: 14,
            background: C.surface,
            border: `2px solid rgba(248,242,182,0.4)`,
            textAlign: 'center',
            boxShadow: `0 4px 30px rgba(0,0,0,0.15), 0 0 40px rgba(248,242,182,0.1)`,
          }}>
            {CASE.employer.name}
          </div>
        </div>

        {/* "Source record" micro-label */}
        {heroShrink < 0.5 && (
          <div style={{
            textAlign: 'center', marginTop: 16,
            fontSize: 12, color: C.accent, fontWeight: 600,
            opacity: interpolate(valueIn, [0, 1], [0, 0.7]),
          }}>
            SINGLE SOURCE OF TRUTH
          </div>
        )}
      </div>

      {/* ── Phase 2: First sync connector ── */}
      {frame > 3.5 * fps && connectorDraw > 0 && gridTransition < 1 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          <line
            x1={CX} y1={heroY + 60 * heroScale}
            x2={CX} y2={heroY + 60 * heroScale + connectorDraw * 180}
            stroke={C.blue500} strokeWidth="2" opacity={0.5} strokeDasharray="6 4"
          />
          {connectorDraw > 0.8 && (
            <circle cx={CX} cy={heroY + 60 * heroScale + connectorDraw * 140}
              r={5} fill={C.blue500} opacity={0.8}>
            </circle>
          )}
        </svg>
      )}

      {/* ── Phase 2: First form proof (centered, large) ── */}
      {frame > 3.5 * fps && gridTransition < 1 && (
        <div style={{
          position: 'absolute',
          left: interpolate(gridTransition, [0, 1], [CX - 160, gridLeft]),
          top: interpolate(gridTransition, [0, 1], [heroY + 130 * heroScale, gridTop]),
          opacity: interpolate(firstFormIn, [0, 1], [0, 1]),
          transform: `scale(${interpolate(gridTransition, [0, 1], [1.2, 1])})`,
          zIndex: 8,
        }}>
          <FormFragment
            formCode="ETA-9089"
            fieldValue={CASE.employer.name}
            highlightColor={C.green500}
            width={320}
          />
          {firstSyncFlash > 0 && (
            <div style={{
              position: 'absolute', inset: -4, borderRadius: 10,
              boxShadow: `0 0 ${25 * firstSyncFlash}px rgba(34,197,94,0.4)`,
              border: `2px solid rgba(34,197,94,${firstSyncFlash * 0.6})`,
            }} />
          )}
        </div>
      )}

      {/* ── Phase 3: Remaining forms in grid ── */}
      {gridTransition > 0 && (
        <div style={{
          position: 'absolute', top: gridTop, left: gridLeft, width: gridW,
          display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${formW}px)`,
          gap: `12px ${formGap}px`,
          opacity: gridTransition,
        }}>
          {FORM_TARGETS.map((f, i) => {
            const delay = Math.round(7.5 * fps) + i * 8;
            const fIn = spring({ frame, fps, config: { damping: 200 }, delay });
            const synced = frame >= delay + 25;
            const flash = interpolate(frame - (delay + 25), [0, 8, 25], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            return (
              <div key={i} style={{
                opacity: i === 0 ? 1 : interpolate(fIn, [0, 1], [0, 1]),
                transform: i === 0 ? 'none' : `translateY(${interpolate(fIn, [0, 1], [12, 0])}px)`,
              }}>
                <div style={{
                  background: synced ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${synced ? C.green500 + '40' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10, padding: '10px 12px', textAlign: 'center',
                  boxShadow: flash > 0 ? `0 0 ${18 * flash}px rgba(34,197,94,0.3)` : 'none',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: synced ? C.green500 : C.white }}>{f.code}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{f.label}</div>
                  {synced && <div style={{ fontSize: 10, color: C.green500, marginTop: 4, fontWeight: 600 }}>✓ Synced</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connector lines from hero to grid (phase 3) */}
      {gridTransition > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {FORM_TARGETS.map((_, i) => {
            if (i === 0) return null;
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const tx = gridLeft + col * (formW + formGap) + formW / 2;
            const ty = gridTop + row * (80 + 12);
            const lineDelay = Math.round(7.5 * fps) + i * 8;
            const lineP = interpolate(frame, [lineDelay - 10, lineDelay + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <line key={i}
                x1={heroX} y1={100 + 50}
                x2={heroX + (tx - heroX) * lineP * gridTransition}
                y2={100 + 50 + (ty - 150) * lineP * gridTransition}
                stroke={C.blue500} strokeWidth="1" opacity={0.2 * gridTransition * lineP}
                strokeDasharray="4 3"
              />
            );
          })}
        </svg>
      )}

      {/* ── Count badge ── */}
      {frame > 11 * fps && (
        <div style={{
          position: 'absolute', bottom: 140, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(countIn, [0, 1], [0, 1]),
        }}>
          <span style={{
            ...CARD.proof,
            fontSize: 18, color: C.accent, fontWeight: 700,
          }}>
            6 forms synced from 1 entry
          </span>
        </div>
      )}

      {/* ── Phase 4: Kinetic "Enter once." ── */}
      {frame > 12.5 * fps && frame < 16 * fps && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticIn, [0, 1], [0.8, 1])})`,
          zIndex: 30, opacity: interpolate(kineticIn, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 64, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 80px rgba(14,26,74,0.95), 0 0 160px rgba(14,26,74,0.9)',
          }}>
            Enter once.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
