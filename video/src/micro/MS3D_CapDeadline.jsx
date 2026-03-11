import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * MS3D — Deadline Protection (12s/360f)
 *
 * TRUE MICRO-SCENE GRAMMAR:
 *   Phase 1 (0-4s): JUST the countdown. "102" owns the entire screen. Nothing else.
 *   Phase 2 (4-7s): Auto-trigger fires. Alert appears. Countdown recedes slightly.
 *   Phase 3 (7-9.5s): Tasks generated. Employer + attorney both see it.
 *   Phase 4 (9.5-12s): State flip: "At Risk" → "Managed". Color transition. Brief assembled.
 */
export const MS3D_CapDeadline = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  const P = {
    countIn: Math.round(0.5 * fps),
    triggerFire: Math.round(4 * fps),
    tasksIn: Math.round(5.5 * fps),
    stateFlip: Math.round(8 * fps),
    stateComplete: Math.round(9.5 * fps),
  };

  // ── Phase 1: Countdown hero ──
  const countIn = spring({ frame, fps, config: { damping: 16, stiffness: 80, mass: 1.5 }, delay: P.countIn });

  // Countdown recedes after trigger
  const countRecede = interpolate(frame, [P.triggerFire, P.triggerFire + 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const countScale = interpolate(countRecede, [0, 1], [1, 0.55]);
  const countY = interpolate(countRecede, [0, 1], [CY - 80, 100]);

  // State flip
  const flipProgress = interpolate(frame, [P.stateFlip, P.stateComplete], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const isManaged = flipProgress > 0.6;
  const stateColor = isManaged ? C.green500 : C.amber500;

  // Trigger flash
  const triggerFlash = interpolate(frame - P.triggerFire, [0, 8, 25], [0, 0.5, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Alert
  const alertIn = spring({ frame, fps, config: { damping: 18, stiffness: 140 }, delay: P.triggerFire + 10 });

  // Tasks
  const task1In = spring({ frame, fps, config: { damping: 200 }, delay: P.tasksIn });
  const task2In = spring({ frame, fps, config: { damping: 200 }, delay: P.tasksIn + 10 });

  // State label
  const stateIn = spring({ frame, fps, config: { damping: 200 }, delay: P.stateFlip });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* Trigger flash ring */}
      {triggerFlash > 0 && (
        <div style={{
          position: 'absolute', left: CX, top: countY,
          transform: 'translate(-50%, -50%)',
          width: 300, height: 300, borderRadius: '50%',
          border: `3px solid ${C.amber500}`,
          opacity: triggerFlash,
          boxShadow: `0 0 60px rgba(245,158,11,${triggerFlash * 0.5})`,
        }} />
      )}

      {/* ── Phase 1: Giant countdown ── */}
      <div style={{
        position: 'absolute', left: CX, top: countY,
        transform: `translate(-50%, -50%) scale(${countScale * interpolate(countIn, [0, 1], [0.7, 1])})`,
        opacity: interpolate(countIn, [0, 1], [0, 1]),
        textAlign: 'center', zIndex: 10,
      }}>
        <div style={{
          fontSize: 220, fontWeight: 700, fontFamily: FONT_DISPLAY,
          color: stateColor, lineHeight: 0.85,
          textShadow: isManaged ? `0 0 40px rgba(34,197,94,0.3)` : `0 0 40px rgba(245,158,11,0.2)`,
        }}>
          {CASE.applicant.h1bDaysLeft}
        </div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
          days until H-1B expiry
        </div>
      </div>

      {/* ── Phase 2: Auto-trigger alert ── */}
      {frame > P.triggerFire && (
        <div style={{
          position: 'absolute', top: 220, left: CX, transform: 'translateX(-50%)',
          opacity: interpolate(alertIn, [0, 1], [0, 1]),
          width: 480, zIndex: 15,
        }}>
          <div style={{
            background: 'rgba(245,158,11,0.06)', border: `1px solid ${C.amber500}25`,
            borderRadius: 12, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>Auto-Triggered at 90 Days</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Extension workflow initiated automatically</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Phase 3: Tasks ── */}
      {frame > P.tasksIn && (
        <div style={{
          position: 'absolute', top: 320, left: CX - 260, width: 520,
          display: 'flex', gap: 16, zIndex: 15,
        }}>
          <div style={{
            flex: 1, padding: '14px 16px', borderRadius: 10,
            background: isManaged ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isManaged ? C.green500 + '20' : 'rgba(255,255,255,0.06)'}`,
            opacity: interpolate(task1In, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(task1In, [0, 1], [14, 0])}px)`,
          }}>
            <div style={{ fontSize: 9, color: C.amber500, fontWeight: 700, marginBottom: 5 }}>EMPLOYER</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>Approve Extension Budget</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>~$2,500</div>
          </div>
          <div style={{
            flex: 1, padding: '14px 16px', borderRadius: 10,
            background: isManaged ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isManaged ? C.green500 + '20' : 'rgba(255,255,255,0.06)'}`,
            opacity: interpolate(task2In, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(task2In, [0, 1], [14, 0])}px)`,
          }}>
            <div style={{ fontSize: 9, color: C.green500, fontWeight: 700, marginBottom: 5 }}>ATTORNEY</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>Prepare Extension Filing</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>I-129 packet</div>
          </div>
        </div>
      )}

      {/* ── Phase 4: State flip ── */}
      {frame > P.stateFlip && (
        <div style={{
          position: 'absolute', bottom: 160, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(stateIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(stateIn, [0, 1], [16, 0])}px)`,
          zIndex: 15,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            padding: '12px 28px', borderRadius: 12,
            background: isManaged ? 'rgba(34,197,94,0.06)' : 'rgba(245,158,11,0.06)',
            border: `1px solid ${isManaged ? C.green500 + '25' : C.amber500 + '25'}`,
          }}>
            <span style={{
              fontSize: 18, fontWeight: 700,
              color: C.amber500,
              textDecoration: isManaged ? 'line-through' : 'none',
              opacity: isManaged ? 0.4 : 1,
            }}>
              At Risk
            </span>
            {isManaged && (
              <>
                <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)' }}>→</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: C.green500 }}>
                  Managed
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
