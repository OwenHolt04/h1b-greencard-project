import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';

/**
 * Source fields that propagate to downstream forms.
 * Each source field has a list of destination form indices.
 */
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

const FORMS = [
  { code: 'ETA-9089', name: 'PERM Application' },
  { code: 'I-140', name: 'Immigrant Petition' },
  { code: 'I-485', name: 'Adjustment of Status' },
  { code: 'I-765', name: 'Employment Auth' },
  { code: 'I-131', name: 'Advance Parole' },
  { code: 'G-28', name: 'Attorney Rep.' },
];

/** Positions for form cards in a vertical stack on the right side */
const FORM_POSITIONS = [
  { x: 1340, y: 120 },
  { x: 1340, y: 240 },
  { x: 1340, y: 360 },
  { x: 1340, y: 480 },
  { x: 1340, y: 600 },
  { x: 1340, y: 720 },
];

/** SVG path from source field to destination form card */
const getConnectorPath = (sourceY, destIdx) => {
  const dest = FORM_POSITIONS[destIdx];
  const sx = 660; // right edge of source card area
  const sy = sourceY;
  const dx = dest.x - 10;
  const dy = dest.y + 40;
  const mx = (sx + dx) / 2;
  return `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${dy}, ${dx} ${dy}`;
};

/** Get position on cubic bezier at parameter t (0-1) */
const bezierPoint = (sourceY, destIdx, t) => {
  const dest = FORM_POSITIONS[destIdx];
  const sx = 660, sy = sourceY;
  const dx = dest.x - 10, dy = dest.y + 40;
  const mx = (sx + dx) / 2;
  // P0=(sx,sy), P1=(mx,sy), P2=(mx,dy), P3=(dx,dy)
  const u = 1 - t;
  return {
    x: u * u * u * sx + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * dx,
    y: u * u * u * sy + 3 * u * u * t * sy + 3 * u * t * t * dy + t * t * t * dy,
  };
};

/**
 * Scene 4 — Enter Once, Sync Everywhere (20s)
 *
 * Source field → animated connector pulse → destination form cards flash green.
 * No browser chrome. Dark space with floating modules.
 *
 * Visual arc:
 *   0-3s: Source field card #1 (Employer Name) appears center-left, value glows
 *   3-5s: Destination form cards appear in a column on the right
 *   5-9s: Connector paths draw from source to each destination form
 *         Animated pulse travels along each path
 *   9-11s: Each form card flashes green as sync completes
 *   11-13s: Source field #2 (SOC Code) appears below, same sync animation
 *   13-16s: Second sync pulse completes
 *   16-18s: "Entered once." kinetic caption
 *   18-20s: All synced state visible
 */
export const Scene4_IntakeSync = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Source field #1 (Employer Name) ── */
  const src1Enter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(0.5 * fps) });
  const src1GlowPulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.3, 0.6]);
  const src1GlowFade = interpolate(frame, [5 * fps, 7 * fps], [1, 0.15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Destination form cards ── */
  const formsEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3 * fps) });

  /* ── Sync 1: connector paths draw + pulse travel ── */
  const sync1Start = Math.round(5 * fps);
  const sync1Progress = interpolate(frame, [sync1Start, sync1Start + 3 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  // Pulse position along path (0-1, staggered per destination)
  const sync1Pulse = interpolate(frame, [sync1Start + 1 * fps, sync1Start + 3 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Form flash timing (when pulse arrives)
  const sync1FlashBase = sync1Start + Math.round(2.5 * fps);

  /* ── Source field #2 (SOC Code) ── */
  const src2Enter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(11 * fps) });
  const src2GlowPulse = interpolate(Math.sin((frame - 11 * fps) / 12), [-1, 1], [0.3, 0.6]);

  /* ── Sync 2: SOC code sync ── */
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

  /* ── Synced count badge ── */
  const badgeEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(15 * fps) });

  /* ── Title label ── */
  const titleEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.3 * fps) });

  const sourceCardX = 120;
  const sourceCard1Y = 200;
  const sourceCard2Y = 480;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Section title ── */}
      <div style={{
        position: 'absolute', top: 60, left: sourceCardX,
        opacity: interpolate(titleEnter, [0, 1], [0, 1]),
      }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em' }}>
          SHARED CASE DATA {'\u2014'} SOURCE OF TRUTH
        </div>
      </div>

      {/* ── Destination forms title ── */}
      <div style={{
        position: 'absolute', top: 60, left: FORM_POSITIONS[0].x,
        opacity: interpolate(formsEnter, [0, 1], [0, 1]),
      }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em' }}>
          FILING PACKAGE
        </div>
      </div>

      {/* ═══════ SOURCE FIELD #1: Employer Name ═══════ */}
      <div style={{
        position: 'absolute', left: sourceCardX, top: sourceCard1Y, width: 520,
        opacity: interpolate(src1Enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(src1Enter, [0, 1], [20, 0])}px) scale(${interpolate(src1Enter, [0, 1], [0.95, 1])})`,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid rgba(59,130,246,${0.15 + src1GlowPulse * src1GlowFade * 0.3})`,
          borderLeft: `4px solid ${C.blue500}`,
          borderRadius: 14, padding: '24px 32px',
          boxShadow: `0 0 ${30 * src1GlowPulse * src1GlowFade}px rgba(59,130,246,${0.1 * src1GlowFade})`,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>
            EMPLOYER LEGAL NAME
          </div>
          <div style={{
            fontSize: 28, fontWeight: 700, color: C.white,
            textShadow: `0 0 ${20 * src1GlowPulse * src1GlowFade}px rgba(59,130,246,0.3)`,
          }}>
            {CASE.employer.name}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
            Synced to {SOURCE_FIELDS[0].destinations.length} forms automatically
          </div>
        </div>
      </div>

      {/* ═══════ SOURCE FIELD #2: SOC Code ═══════ */}
      <div style={{
        position: 'absolute', left: sourceCardX, top: sourceCard2Y, width: 520,
        opacity: interpolate(src2Enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(src2Enter, [0, 1], [20, 0])}px) scale(${interpolate(src2Enter, [0, 1], [0.95, 1])})`,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid rgba(248,242,182,${0.1 + (frame > 11 * fps ? src2GlowPulse * 0.2 : 0)})`,
          borderLeft: `4px solid ${C.accent}`,
          borderRadius: 14, padding: '24px 32px',
          boxShadow: frame > 11 * fps ? `0 0 ${20 * src2GlowPulse}px rgba(248,242,182,0.08)` : 'none',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>
            SOC CODE
          </div>
          <div style={{
            fontSize: 28, fontWeight: 700, color: C.white,
          }}>
            {CASE.applicant.soc}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
            Synced to {SOURCE_FIELDS[1].destinations.length} forms
          </div>
        </div>
      </div>

      {/* ═══════ DESTINATION FORM CARDS ═══════ */}
      {FORMS.map((form, i) => {
        const fEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3 * fps) + i * 5 });
        const pos = FORM_POSITIONS[i];

        // Check if this form received sync from source 1
        const isSrc1Target = SOURCE_FIELDS[0].destinations.includes(i);
        const src1SyncedAt = isSrc1Target ? sync1FlashBase + SOURCE_FIELDS[0].destinations.indexOf(i) * 6 : Infinity;
        const src1Synced = frame > src1SyncedAt;
        const src1Flash = src1Synced ? interpolate(frame - src1SyncedAt, [0, 6, 18], [0, 1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }) : 0;

        // Check if this form received sync from source 2
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
            position: 'absolute', left: pos.x, top: pos.y, width: 420,
            opacity: interpolate(fEnter, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(fEnter, [0, 1], [30, 0])}px)`,
          }}>
            <div style={{
              background: anySynced
                ? `rgba(34,197,94,${0.04 + totalFlash * 0.08})`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${anySynced ? `rgba(34,197,94,${0.15 + totalFlash * 0.3})` : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: '16px 24px',
              boxShadow: totalFlash > 0 ? `0 0 ${20 * totalFlash}px rgba(34,197,94,0.15)` : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{form.code}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{form.name}</div>
              </div>
              {anySynced && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 9999,
                  background: 'rgba(34,197,94,0.15)',
                }}>
                  <span style={{ fontSize: 14, color: C.green500, fontWeight: 700 }}>{'\u2713'}</span>
                  <span style={{ fontSize: 13, color: C.green500, fontWeight: 600 }}>Synced</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ═══════ CONNECTOR PATHS: Source 1 → Destinations ═══════ */}
      {sync1Progress > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {SOURCE_FIELDS[0].destinations.map((destIdx, i) => {
            const pathData = getConnectorPath(sourceCard1Y + 60, destIdx);
            const stagger = i * 0.15;
            const lineProgress = interpolate(sync1Progress, [stagger, stagger + 0.6], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const dashLen = 300;
            const dashOffset = interpolate(lineProgress, [0, 1], [dashLen, 0]);
            // Traveling pulse dot
            const pulsePos = interpolate(sync1Pulse, [stagger, Math.min(stagger + 0.7, 1)], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            return (
              <React.Fragment key={i}>
                <path d={pathData} fill="none"
                  stroke={C.blue500} strokeWidth="2" opacity={0.5}
                  strokeDasharray={dashLen} strokeDashoffset={dashOffset}
                />
                {/* Glowing pulse traveling along the path */}
                {pulsePos > 0.01 && pulsePos < 0.99 && (() => {
                  const pt = bezierPoint(sourceCard1Y + 60, destIdx, pulsePos);
                  return (
                    <>
                      <circle cx={pt.x} cy={pt.y} r="12" fill={C.blue500} opacity={0.2} />
                      <circle cx={pt.x} cy={pt.y} r="6" fill={C.blue500} opacity={0.8} />
                    </>
                  );
                })()}
              </React.Fragment>
            );
          })}
        </svg>
      )}

      {/* ═══════ CONNECTOR PATHS: Source 2 → Destinations ═══════ */}
      {sync2Progress > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {SOURCE_FIELDS[1].destinations.map((destIdx, i) => {
            const pathData = getConnectorPath(sourceCard2Y + 60, destIdx);
            const stagger = i * 0.2;
            const lineProgress = interpolate(sync2Progress, [stagger, stagger + 0.6], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const dashLen = 300;
            const dashOffset = interpolate(lineProgress, [0, 1], [dashLen, 0]);

            return (
              <path key={i} d={pathData} fill="none"
                stroke={C.accent} strokeWidth="2" opacity={0.5}
                strokeDasharray={dashLen} strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
      )}

      {/* ═══════ Synced badge ═══════ */}
      {frame > 15 * fps && (
        <div style={{
          position: 'absolute', bottom: 200, left: '50%', transform: 'translateX(-50%)',
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
