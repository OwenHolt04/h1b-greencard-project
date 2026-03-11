import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';

/**
 * Scene 4 — Enter Once, Sync Everywhere (20s / 600 frames)
 *
 * Center-first composition: source field appears centered,
 * then propagation paths draw outward to surrounding form cards.
 *
 * Visual arc:
 *   0-3s: Source field (Employer Name) appears centered with glow
 *   3-5s: Form cards appear in a tight ring around center
 *   5-9s: Connector paths draw from source outward to each form
 *         Animated pulse travels along each path
 *   9-11s: Each form card flashes green as sync completes
 *   11-13s: Source field #2 (SOC Code) appears below, same sync pulse
 *   13-16s: Second sync completes
 *   16-18s: "Entered once." kinetic caption
 *   18-20s: All synced state visible
 */

const FORMS = [
  { code: 'ETA-9089', name: 'PERM Application' },
  { code: 'I-140', name: 'Immigrant Petition' },
  { code: 'I-485', name: 'Adjustment of Status' },
  { code: 'I-765', name: 'Employment Auth' },
  { code: 'I-131', name: 'Advance Parole' },
  { code: 'G-28', name: 'Attorney Rep.' },
];

const SOURCE_FIELDS = [
  {
    label: 'Employer Legal Name',
    value: CASE.employer.name,
    highlight: C.blue500,
    destinations: [0, 1, 2, 5], // ETA-9089, I-140, I-485, G-28
  },
  {
    label: 'SOC Code',
    value: CASE.applicant.soc,
    highlight: C.accent,
    destinations: [0, 1, 2], // ETA-9089, I-140, I-485
  },
];

/* Form card positions: 2 rows of 3, centered below the source field */
const CX = 960;
const CY = 340; // source field center Y
const FORM_W = 260;
const FORM_H = 80;
const FORM_GAP_X = 20;
const FORM_GAP_Y = 16;
const ROW_W = FORM_W * 3 + FORM_GAP_X * 2;
const ROW_LEFT = CX - ROW_W / 2;

const FORM_POSITIONS = [
  { x: ROW_LEFT, y: 530 },
  { x: ROW_LEFT + FORM_W + FORM_GAP_X, y: 530 },
  { x: ROW_LEFT + (FORM_W + FORM_GAP_X) * 2, y: 530 },
  { x: ROW_LEFT, y: 530 + FORM_H + FORM_GAP_Y },
  { x: ROW_LEFT + FORM_W + FORM_GAP_X, y: 530 + FORM_H + FORM_GAP_Y },
  { x: ROW_LEFT + (FORM_W + FORM_GAP_X) * 2, y: 530 + FORM_H + FORM_GAP_Y },
];

/** SVG connector from source center to form card center */
const getConnectorPath = (sourceY, destIdx) => {
  const dest = FORM_POSITIONS[destIdx];
  const sx = CX;
  const sy = sourceY + 50; // bottom of source card
  const dx = dest.x + FORM_W / 2;
  const dy = dest.y;
  const my = sy + (dy - sy) * 0.5;
  return `M ${sx} ${sy} C ${sx} ${my}, ${dx} ${my}, ${dx} ${dy}`;
};

/** Get position on cubic bezier at parameter t */
const bezierPoint = (sourceY, destIdx, t) => {
  const dest = FORM_POSITIONS[destIdx];
  const sx = CX, sy = sourceY + 50;
  const dx = dest.x + FORM_W / 2, dy = dest.y;
  const my = sy + (dy - sy) * 0.5;
  const u = 1 - t;
  return {
    x: u * u * u * sx + 3 * u * u * t * sx + 3 * u * t * t * dx + t * t * t * dx,
    y: u * u * u * sy + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * dy,
  };
};

export const Scene4_IntakeSync = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Source field #1 ── */
  const src1Enter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(0.5 * fps) });
  const src1GlowPulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.3, 0.6]);
  const src1GlowFade = interpolate(frame, [5 * fps, 7 * fps], [1, 0.15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Form cards ── */
  const formsEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3 * fps) });

  /* ── Sync 1 ── */
  const sync1Start = Math.round(5 * fps);
  const sync1Progress = interpolate(frame, [sync1Start, sync1Start + 3 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const sync1Pulse = interpolate(frame, [sync1Start + 1 * fps, sync1Start + 3 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const sync1FlashBase = sync1Start + Math.round(2.5 * fps);

  /* ── Source field #2 ── */
  const src2Enter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(11 * fps) });
  const src2GlowPulse = interpolate(Math.sin((frame - 11 * fps) / 12), [-1, 1], [0.3, 0.6]);

  /* ── Sync 2 ── */
  const sync2Start = Math.round(12 * fps);
  const sync2Progress = interpolate(frame, [sync2Start, sync2Start + 2.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const sync2FlashBase = sync2Start + Math.round(2 * fps);

  /* ── Kinetic caption ── */
  const kineticEnter = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: Math.round(16 * fps) });
  const kineticExit = interpolate(frame, [17.5 * fps, 18.5 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Badge ── */
  const badgeEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(15 * fps) });

  /* ── Title ── */
  const titleEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.3 * fps) });

  const sourceCardW = 520;
  const sourceCardLeft = CX - sourceCardW / 2;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Section title — centered ── */}
      <div style={{
        position: 'absolute', top: 55, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(titleEnter, [0, 1], [0, 1]),
      }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em' }}>
          SHARED CASE DATA {'\u2014'} SOURCE OF TRUTH
        </div>
      </div>

      {/* ═══════ SOURCE FIELD #1: Employer Name — Centered ═══════ */}
      <div style={{
        position: 'absolute', left: sourceCardLeft, top: 110, width: sourceCardW,
        opacity: interpolate(src1Enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(src1Enter, [0, 1], [20, 0])}px) scale(${interpolate(src1Enter, [0, 1], [0.95, 1])})`,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid rgba(59,130,246,${0.15 + src1GlowPulse * src1GlowFade * 0.3})`,
          borderTop: `4px solid ${C.blue500}`,
          borderRadius: 14, padding: '24px 32px',
          boxShadow: `0 0 ${30 * src1GlowPulse * src1GlowFade}px rgba(59,130,246,${0.1 * src1GlowFade})`,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>
            EMPLOYER LEGAL NAME
          </div>
          <div style={{
            fontSize: 26, fontWeight: 700, color: C.white,
            textShadow: `0 0 ${20 * src1GlowPulse * src1GlowFade}px rgba(59,130,246,0.3)`,
          }}>
            {CASE.employer.name}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
            Synced to {SOURCE_FIELDS[0].destinations.length} forms automatically
          </div>
        </div>
      </div>

      {/* ═══════ SOURCE FIELD #2: SOC Code — Centered below ═══════ */}
      <div style={{
        position: 'absolute', left: sourceCardLeft, top: 290, width: sourceCardW,
        opacity: interpolate(src2Enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(src2Enter, [0, 1], [20, 0])}px) scale(${interpolate(src2Enter, [0, 1], [0.95, 1])})`,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid rgba(248,242,182,${0.1 + (frame > 11 * fps ? src2GlowPulse * 0.2 : 0)})`,
          borderTop: `4px solid ${C.accent}`,
          borderRadius: 14, padding: '24px 32px',
          boxShadow: frame > 11 * fps ? `0 0 ${20 * src2GlowPulse}px rgba(248,242,182,0.08)` : 'none',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>
            SOC CODE
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.white }}>
            {CASE.applicant.soc}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
            Synced to {SOURCE_FIELDS[1].destinations.length} forms
          </div>
        </div>
      </div>

      {/* ── Propagation node — pulsing accent dot between source and forms ── */}
      {frame > sync1Start && (
        <div style={{
          position: 'absolute', left: CX - 12, top: 468, width: 24, height: 24,
          borderRadius: 12, background: `rgba(59,130,246,0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4, background: C.blue500,
            transform: `scale(${1 + interpolate(Math.sin(frame / 8), [-1, 1], [0, 0.4])})`,
          }} />
        </div>
      )}

      {/* ═══════ DESTINATION FORM CARDS — 2x3 grid centered below ═══════ */}
      {FORMS.map((form, i) => {
        const fEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3 * fps) + i * 5 });
        const pos = FORM_POSITIONS[i];

        const isSrc1Target = SOURCE_FIELDS[0].destinations.includes(i);
        const src1SyncedAt = isSrc1Target ? sync1FlashBase + SOURCE_FIELDS[0].destinations.indexOf(i) * 6 : Infinity;
        const src1Synced = frame > src1SyncedAt;
        const src1Flash = src1Synced ? interpolate(frame - src1SyncedAt, [0, 6, 18], [0, 1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }) : 0;

        const isSrc2Target = SOURCE_FIELDS[1].destinations.includes(i);
        const src2SyncedAt = isSrc2Target ? sync2FlashBase + SOURCE_FIELDS[1].destinations.indexOf(i) * 6 : Infinity;
        const src2Synced = frame > src2SyncedAt;
        const src2Flash = src2Synced ? interpolate(frame - src2SyncedAt, [0, 6, 18], [0, 1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }) : 0;

        const anySynced = src1Synced || src2Synced;
        const totalFlash = Math.max(src1Flash, src2Flash);

        return (
          <div key={i} style={{
            position: 'absolute', left: pos.x, top: pos.y, width: FORM_W,
            opacity: interpolate(fEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(fEnter, [0, 1], [16, 0])}px)`,
          }}>
            <div style={{
              background: anySynced
                ? `rgba(34,197,94,${0.04 + totalFlash * 0.08})`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${anySynced ? `rgba(34,197,94,${0.15 + totalFlash * 0.3})` : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: '14px 18px',
              boxShadow: totalFlash > 0 ? `0 0 ${20 * totalFlash}px rgba(34,197,94,0.15)` : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              height: FORM_H,
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>{form.code}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{form.name}</div>
              </div>
              {anySynced && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 9999,
                  background: 'rgba(34,197,94,0.15)',
                }}>
                  <span style={{ fontSize: 13, color: C.green500, fontWeight: 700 }}>{'\u2713'}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ═══════ CONNECTOR PATHS: Source 1 → Forms (downward propagation) ═══════ */}
      {sync1Progress > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {SOURCE_FIELDS[0].destinations.map((destIdx, i) => {
            const pathData = getConnectorPath(170, destIdx);
            const stagger = i * 0.12;
            const lineProgress = interpolate(sync1Progress, [stagger, stagger + 0.5], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const dashLen = 400;
            const dashOffset = interpolate(lineProgress, [0, 1], [dashLen, 0]);

            const pulsePos = interpolate(sync1Pulse, [stagger, Math.min(stagger + 0.6, 1)], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            return (
              <React.Fragment key={i}>
                <path d={pathData} fill="none"
                  stroke={C.blue500} strokeWidth="2" opacity={0.4}
                  strokeDasharray={dashLen} strokeDashoffset={dashOffset}
                />
                {pulsePos > 0.05 && pulsePos < 0.95 && (() => {
                  const pt = bezierPoint(170, destIdx, pulsePos);
                  return (
                    <>
                      <circle cx={pt.x} cy={pt.y} r="10" fill={C.blue500} opacity={0.15} />
                      <circle cx={pt.x} cy={pt.y} r="5" fill={C.blue500} opacity={0.7} />
                    </>
                  );
                })()}
              </React.Fragment>
            );
          })}
        </svg>
      )}

      {/* ═══════ CONNECTOR PATHS: Source 2 → Forms ═══════ */}
      {sync2Progress > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {SOURCE_FIELDS[1].destinations.map((destIdx, i) => {
            const pathData = getConnectorPath(350, destIdx);
            const stagger = i * 0.15;
            const lineProgress = interpolate(sync2Progress, [stagger, stagger + 0.5], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const dashLen = 400;
            const dashOffset = interpolate(lineProgress, [0, 1], [dashLen, 0]);

            return (
              <path key={i} d={pathData} fill="none"
                stroke={C.accent} strokeWidth="2" opacity={0.4}
                strokeDasharray={dashLen} strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
      )}

      {/* ═══════ Synced badge ═══════ */}
      {frame > 15 * fps && (
        <div style={{
          position: 'absolute', bottom: 180, left: '50%', transform: 'translateX(-50%)',
          opacity: interpolate(badgeEnter, [0, 1], [0, 1]),
          zIndex: 10,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 28px', borderRadius: 9999,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
          }}>
            <span style={{ fontSize: 18, color: C.green500, fontWeight: 700 }}>{'\u2713'}</span>
            <span style={{ fontSize: 18, color: C.green500, fontWeight: 600 }}>All fields synced across 6 forms</span>
          </div>
        </div>
      )}

      {/* ═══════ Kinetic caption: "Entered once." ═══════ */}
      {frame > 16 * fps && frame < 18.5 * fps && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticEnter, [0, 1], [0.85, 1])})`,
          zIndex: 30, pointerEvents: 'none',
          opacity: interpolate(kineticEnter, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 60px rgba(22,39,104,0.95), 0 0 120px rgba(22,39,104,0.8)',
            letterSpacing: '-0.01em',
          }}>
            Entered once.
          </div>
        </div>
      )}

      <Caption
        text={CAPTIONS.scene4.main}
        subtext={CAPTIONS.scene4.sub}
        delay={Math.round(2 * fps)}
      />
    </AbsoluteFill>
  );
};
