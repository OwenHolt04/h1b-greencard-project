import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { T, V3_CARD, CASE } from './theme';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * V3S5 — Deadline Alert (12s/360f)
 * Script line 11: "When Krishna's H-1B is approaching expiration,
 *   that is surfaced ninety days out — with enough lead time to act."
 *
 * Phase 1 (0-3.5s): Giant countdown "102" owns the screen
 * Phase 2 (3.5-6s): Auto-trigger fires at 90 days, alert appears
 * Phase 3 (6-9s): Tasks assigned to employer + attorney
 * Phase 4 (9-12s): "At Risk" → "Managed" state flip
 */

export const V3S5_DeadlineAlert = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  const P = {
    countIn: Math.round(0.5 * fps),
    triggerFire: Math.round(3.5 * fps),
    tasksIn: Math.round(5 * fps),
    stateFlip: Math.round(7.5 * fps),
    stateComplete: Math.round(9 * fps),
  };

  // Phase 1: Countdown hero
  const countIn = spring({ frame, fps, config: { damping: 16, stiffness: 80, mass: 1.5 }, delay: P.countIn });

  // Countdown recedes
  const countRecede = interpolate(frame, [P.triggerFire, P.triggerFire + 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const countScale = interpolate(countRecede, [0, 1], [1, 0.55]);
  const countY = interpolate(countRecede, [0, 1], [CY - 60, 120]);

  // State flip
  const flipProgress = interpolate(frame, [P.stateFlip, P.stateComplete], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const isManaged = flipProgress > 0.6;
  const stateColor = isManaged ? T.green : T.amber;

  // Trigger flash
  const triggerFlash = interpolate(frame - P.triggerFire, [0, 8, 20], [0, 0.4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Alert
  const alertIn = spring({ frame, fps, config: { damping: 18, stiffness: 140 }, delay: P.triggerFire + 8 });

  // Tasks
  const task1In = spring({ frame, fps, config: { damping: 200 }, delay: P.tasksIn });
  const task2In = spring({ frame, fps, config: { damping: 200 }, delay: P.tasksIn + 8 });

  // State label
  const stateIn = spring({ frame, fps, config: { damping: 200 }, delay: P.stateFlip });

  return (
    <AbsoluteFill style={{
      background: T.bgGradient,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: T.navy }} />

      {/* Trigger flash ring */}
      {triggerFlash > 0 && (
        <div style={{
          position: 'absolute', left: CX, top: countY,
          transform: 'translate(-50%, -50%)',
          width: 250, height: 250, borderRadius: '50%',
          border: `3px solid ${T.amber}`,
          opacity: triggerFlash,
          boxShadow: `0 0 40px rgba(245,158,11,${triggerFlash * 0.3})`,
        }} />
      )}

      {/* Phase 1: Giant countdown */}
      <div style={{
        position: 'absolute', left: CX, top: countY,
        transform: `translate(-50%, -50%) scale(${countScale * interpolate(countIn, [0, 1], [0.7, 1])})`,
        opacity: interpolate(countIn, [0, 1], [0, 1]),
        textAlign: 'center', zIndex: 10,
      }}>
        <div style={{
          fontSize: 200, fontWeight: 700, fontFamily: FONT_DISPLAY,
          color: stateColor, lineHeight: 0.85,
        }}>
          {CASE.applicant.h1bDaysLeft}
        </div>
        <div style={{ fontSize: 18, color: T.textSecondary, marginTop: 8 }}>
          days until H-1B expiry
        </div>
      </div>

      {/* Phase 2: Auto-trigger alert */}
      {frame > P.triggerFire && (
        <div style={{
          position: 'absolute', top: 220, left: CX, transform: 'translateX(-50%)',
          opacity: interpolate(alertIn, [0, 1], [0, 1]),
          width: 440, zIndex: 15,
        }}>
          <div style={{
            ...V3_CARD.standard,
            borderLeft: `4px solid ${T.amber}`,
            padding: '12px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Auto-Triggered at 90 Days</div>
              <div style={{ fontSize: 11, color: T.textSecondary }}>Extension workflow initiated automatically</div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Task cards */}
      {frame > P.tasksIn && (
        <div style={{
          position: 'absolute', top: 330, left: CX - 240, width: 480,
          display: 'flex', gap: 16, zIndex: 15,
        }}>
          <div style={{
            flex: 1,
            ...V3_CARD.standard,
            borderLeft: `4px solid ${T.amber}`,
            padding: '12px 14px',
            opacity: interpolate(task1In, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(task1In, [0, 1], [12, 0])}px)`,
            background: isManaged ? T.greenBg : T.card,
            borderLeftColor: isManaged ? T.green : T.amber,
          }}>
            <div style={{ fontSize: 9, color: T.amber, fontWeight: 700, marginBottom: 4 }}>EMPLOYER</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Approve Extension Budget</div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 3 }}>~$2,500</div>
          </div>
          <div style={{
            flex: 1,
            ...V3_CARD.standard,
            borderLeft: `4px solid ${T.green}`,
            padding: '12px 14px',
            opacity: interpolate(task2In, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(task2In, [0, 1], [12, 0])}px)`,
            background: isManaged ? T.greenBg : T.card,
          }}>
            <div style={{ fontSize: 9, color: T.green, fontWeight: 700, marginBottom: 4 }}>ATTORNEY</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Prepare Extension Filing</div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 3 }}>I-129 packet</div>
          </div>
        </div>
      )}

      {/* Phase 4: State flip */}
      {frame > P.stateFlip && (
        <div style={{
          position: 'absolute', bottom: 140, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(stateIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(stateIn, [0, 1], [14, 0])}px)`,
          zIndex: 15,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            padding: '12px 28px', borderRadius: 12,
            background: isManaged ? T.greenBg : T.amberBg,
            border: `1px solid ${isManaged ? T.greenBorder : T.amberBorder}`,
          }}>
            <span style={{
              fontSize: 18, fontWeight: 700,
              color: T.amber,
              textDecoration: isManaged ? 'line-through' : 'none',
              opacity: isManaged ? 0.4 : 1,
            }}>
              At Risk
            </span>
            {isManaged && (
              <>
                <span style={{ fontSize: 18, color: T.textFaint }}>→</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: T.green }}>
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
