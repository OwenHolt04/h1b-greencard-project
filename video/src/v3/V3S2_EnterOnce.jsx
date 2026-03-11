import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { T, V3_CARD, CASE } from './theme';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * V3S2 — Enter Once (16s/480f)
 * Script lines 3-5: "Krishna only enters his information once."
 *
 * Phase 1 (0-3.5s): Hero input field with typing animation
 * Phase 2 (3.5-7s): First form syncs below — proof of concept
 * Phase 3 (7-12s): All 6 forms fan out in grid, each syncs
 * Phase 4 (12-14.5s): "6 forms synced from 1 entry" badge
 * Phase 5 (14.5-16s): Settle
 */

const FORM_TARGETS = [
  { code: 'ETA-9089', label: 'PERM Labor Cert' },
  { code: 'I-140', label: 'Immigrant Petition' },
  { code: 'I-485', label: 'Adjust Status' },
  { code: 'I-765', label: 'Work Authorization' },
  { code: 'I-131', label: 'Travel Document' },
  { code: 'G-28', label: 'Attorney Notice' },
];

export const V3S2_EnterOnce = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;

  // Phase 1: Hero field
  const fieldIn = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(0.3 * fps) });
  const labelChars = 'Employer Legal Name'.length;
  const typingProgress = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visibleLabel = 'Employer Legal Name'.slice(0, Math.floor(typingProgress * labelChars));
  const valueIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.8 * fps) });

  // Hero shrinks up after phase 1
  const phase1End = 3.5 * fps;
  const heroShrink = interpolate(frame, [phase1End, phase1End + 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const heroScale = interpolate(heroShrink, [0, 1], [1, 0.7]);
  const heroY = interpolate(heroShrink, [0, 1], [260, 80]);

  // Phase 2: First sync
  const firstFormIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(4 * fps) });
  const firstSyncFlash = interpolate(frame - 4.8 * fps, [0, 8, 25], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 3: Grid transition
  const gridTransition = interpolate(frame, [6.5 * fps, 7.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });

  // Phase 4: Count badge
  const countIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(12 * fps) });

  const COLS = 3;
  const formW = 200;
  const formGap = 16;
  const gridW = COLS * formW + (COLS - 1) * formGap;
  const gridLeft = CX - gridW / 2;
  const gridTop = 280;

  return (
    <AbsoluteFill style={{
      background: T.bgGradient,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: T.navy }} />

      {/* Phase 1: Hero input field */}
      <div style={{
        position: 'absolute', left: CX, top: heroY,
        transform: `translate(-50%, 0) scale(${heroScale})`,
        opacity: interpolate(fieldIn, [0, 1], [0, 1]),
        zIndex: 10, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 12, color: T.textMuted, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          {visibleLabel}<span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: T.navy }}>|</span>
        </div>

        <div style={{
          opacity: interpolate(valueIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(valueIn, [0, 1], [10, 0])}px)`,
        }}>
          <div style={{
            ...V3_CARD.focal,
            fontSize: 34, fontWeight: 700, color: T.navy,
            padding: '18px 40px',
            borderTop: `3px solid ${T.navy}`,
          }}>
            {CASE.employer.name}
          </div>
        </div>

        {heroShrink < 0.5 && (
          <div style={{
            marginTop: 16, fontSize: 11, color: T.textMuted, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            opacity: interpolate(valueIn, [0, 1], [0, 0.7]),
          }}>
            SINGLE SOURCE OF TRUTH
          </div>
        )}
      </div>

      {/* Phase 2: Connector line */}
      {frame > 3.5 * fps && gridTransition < 1 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          <line
            x1={CX} y1={heroY + 80 * heroScale}
            x2={CX} y2={heroY + 80 * heroScale + interpolate(frame, [3.5 * fps, 4.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * 140}
            stroke={T.navy} strokeWidth="1.5" opacity={0.2} strokeDasharray="6 4"
          />
        </svg>
      )}

      {/* Phase 2: First form proof */}
      {frame > 3.5 * fps && gridTransition < 1 && (
        <div style={{
          position: 'absolute', left: CX - 150, top: heroY + 140 * heroScale,
          opacity: interpolate(firstFormIn, [0, 1], [0, 1]),
          transform: `scale(${interpolate(gridTransition, [0, 1], [1.1, 1])})`,
          zIndex: 8, width: 300,
        }}>
          <div style={{
            ...V3_CARD.standard,
            borderLeft: `4px solid ${T.green}`,
            padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>ETA-9089</span>
              <span style={{ fontSize: 9, color: T.textMuted }}>PERM Labor Cert</span>
            </div>
            <div style={{ fontSize: 9, color: T.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Section H · Employer Name
            </div>
            <div style={{
              fontSize: 14, fontWeight: 700, color: T.green,
              padding: '4px 8px', borderRadius: 4,
              background: T.greenBg, borderLeft: `3px solid ${T.green}`,
            }}>
              {CASE.employer.name}
            </div>
          </div>
          {firstSyncFlash > 0 && (
            <div style={{
              position: 'absolute', inset: -3, borderRadius: 16,
              boxShadow: `0 0 ${20 * firstSyncFlash}px rgba(34,197,94,0.3)`,
              border: `2px solid rgba(34,197,94,${firstSyncFlash * 0.5})`,
            }} />
          )}
        </div>
      )}

      {/* Phase 3: Full form grid */}
      {gridTransition > 0 && (
        <div style={{
          position: 'absolute', top: gridTop, left: gridLeft, width: gridW,
          display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${formW}px)`,
          gap: `14px ${formGap}px`,
          opacity: gridTransition,
        }}>
          {FORM_TARGETS.map((f, i) => {
            const delay = Math.round(7.5 * fps) + i * 8;
            const fIn = spring({ frame, fps, config: { damping: 200 }, delay });
            const synced = frame >= delay + 20;
            const flash = interpolate(frame - (delay + 20), [0, 8, 25], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            return (
              <div key={i} style={{
                opacity: interpolate(fIn, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(fIn, [0, 1], [12, 0])}px)`,
              }}>
                <div style={{
                  ...V3_CARD.standard,
                  borderLeft: `3px solid ${synced ? T.green : T.cardBorder}`,
                  padding: '10px 14px', textAlign: 'left',
                  boxShadow: flash > 0 ? `0 0 ${14 * flash}px rgba(34,197,94,0.25)` : T.cardShadow,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: synced ? T.green : T.navy }}>{f.code}</div>
                  <div style={{ fontSize: 9, color: T.textMuted, marginTop: 2 }}>{f.label}</div>
                  {synced && <div style={{ fontSize: 10, color: T.green, marginTop: 4, fontWeight: 600 }}>✓ Synced</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connector lines from hero to grid */}
      {gridTransition > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {FORM_TARGETS.map((_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const tx = gridLeft + col * (formW + formGap) + formW / 2;
            const ty = gridTop + row * (80 + 14);
            const lineDelay = Math.round(7.5 * fps) + i * 8;
            const lineP = interpolate(frame, [lineDelay - 10, lineDelay + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <line key={i}
                x1={CX} y1={80 + 60}
                x2={CX + (tx - CX) * lineP * gridTransition}
                y2={80 + 60 + (ty - 140) * lineP * gridTransition}
                stroke={T.navy} strokeWidth="1" opacity={0.1 * gridTransition * lineP}
                strokeDasharray="4 3"
              />
            );
          })}
        </svg>
      )}

      {/* Phase 4: Count badge */}
      {frame > 12 * fps && (
        <div style={{
          position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(countIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(countIn, [0, 1], [10, 0])}px)`,
        }}>
          <span style={{
            display: 'inline-block', padding: '10px 28px', borderRadius: 10,
            background: T.navy, color: '#fff',
            fontSize: 16, fontWeight: 700,
            boxShadow: '0 4px 16px rgba(22,39,104,0.2)',
          }}>
            6 forms synced from 1 entry
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
