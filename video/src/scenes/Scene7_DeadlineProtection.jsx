import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';

/**
 * Scene 7 — Deadline Protection (15s / 450 frames)
 *
 * Centered composition. 102-day hero first, then supporting context.
 * Before/after state swap: at-risk → managed.
 *
 * Visual arc:
 *   0-3s: Large "102" countdown centered with pulse
 *   3-5.5s: Timeline bar appears, 90-day threshold glows
 *   5.5-8s: Auto-created alert + task cards appear tight below
 *   8-11s: State swap: amber "At Risk" → green "Managed"
 *   11-13s: Cost comparison
 *   13-15s: "Deadline made visible" kinetic caption
 */
export const Scene7_DeadlineProtection = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const P = {
    countdownIn: Math.round(0.5 * fps),
    timelineIn: Math.round(3 * fps),
    thresholdGlow: Math.round(4 * fps),
    alertIn: Math.round(5.5 * fps),
    tasksIn: Math.round(6.5 * fps),
    gaugeStart: Math.round(8 * fps),
    gaugeEnd: Math.round(10.5 * fps),
    costIn: Math.round(11 * fps),
    kineticIn: Math.round(13 * fps),
  };

  /* Layout */
  const CX = 960;
  const contentW = 800;
  const contentLeft = CX - contentW / 2;

  /* ── Countdown ── */
  const countdownEnter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: P.countdownIn });
  const countdownPulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.97, 1.03]);

  /* ── Timeline bar ── */
  const timelineEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.timelineIn });
  const timelineWidth = interpolate(timelineEnter, [0, 1], [0, contentW]);

  /* ── 90-day threshold ── */
  const thresholdGlow = interpolate(frame, [P.thresholdGlow, P.thresholdGlow + fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const thresholdPulse = frame > P.thresholdGlow
    ? interpolate(Math.sin((frame - P.thresholdGlow) / 10), [-1, 1], [0.4, 1])
    : 0;

  /* ── Alert ── */
  const alertEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: P.alertIn });

  /* ── Task cards ── */
  const employerTaskEnter = spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: P.tasksIn });
  const attorneyTaskEnter = spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: P.tasksIn + 10 });

  /* ── State swap: at-risk → managed ── */
  const gaugeProgress = interpolate(frame, [P.gaugeStart, P.gaugeEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const isManaged = gaugeProgress > 0.7;
  const stateColor = isManaged ? C.green500 : C.amber500;

  /* ── Cost comparison ── */
  const costEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.costIn });

  /* ── Kinetic caption ── */
  const kineticEnter = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: P.kineticIn });
  const kineticExit = interpolate(frame, [14 * fps, 15 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Countdown color transitions with state ── */
  const countdownColor = isManaged ? C.green500 : C.amber500;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Warning/success glow behind countdown ── */}
      <div style={{
        position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, ${stateColor} 0%, transparent 70%)`,
        opacity: 0.06, pointerEvents: 'none',
      }} />

      {/* ═══════ COUNTDOWN — Centered Hero ═══════ */}
      <div style={{
        position: 'absolute', top: 60, left: 0, right: 0,
        textAlign: 'center', zIndex: 5,
        opacity: interpolate(countdownEnter, [0, 1], [0, 1]),
      }}>
        <div style={{
          fontSize: 140, fontWeight: 700, fontFamily: FONT_DISPLAY,
          color: countdownColor, lineHeight: 1,
          transform: `scale(${countdownPulse})`,
          transition: 'color 0.5s',
        }}>
          102
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 500 }}>
          Days Until H-1B Expiry
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
          {CASE.applicant.name} {'\u2022'} {CASE.employer.shortName} {'\u2022'} Expires {CASE.applicant.h1bExpiry}
        </div>
      </div>

      {/* ═══════ TIMELINE BAR — Centered below countdown ═══════ */}
      <div style={{
        position: 'absolute', top: 290, left: contentLeft, width: contentW,
        opacity: interpolate(timelineEnter, [0, 1], [0, 1]),
        zIndex: 3,
      }}>
        <div style={{
          width: timelineWidth, height: 6, borderRadius: 3, margin: '0 auto',
          background: 'rgba(255,255,255,0.08)', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: '70%', height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${C.green500}, ${stateColor})`,
          }} />
          {/* 90-day threshold */}
          <div style={{
            position: 'absolute', left: '88%', top: -10,
            width: 2, height: 26, background: C.amber500,
            opacity: thresholdGlow,
            boxShadow: `0 0 ${10 * thresholdPulse}px ${C.amber500}`,
          }} />
          {thresholdGlow > 0 && (
            <div style={{
              position: 'absolute', left: '88%', top: -28,
              transform: 'translateX(-50%)',
              fontSize: 11, fontWeight: 700, color: C.amber500,
              opacity: thresholdGlow, whiteSpace: 'nowrap',
            }}>
              90-day trigger
            </div>
          )}
          {/* Current position */}
          <div style={{
            position: 'absolute', left: '70%', top: -4,
            width: 14, height: 14, borderRadius: 7,
            background: stateColor, border: '2px solid rgba(255,255,255,0.3)',
            transform: 'translateX(-50%)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>H-1B Start</span>
          <span style={{ fontSize: 11, color: stateColor, fontWeight: 600 }}>102 days left</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Expiry</span>
        </div>
      </div>

      {/* ═══════ ALERT — Centered ═══════ */}
      <div style={{
        position: 'absolute', top: 370, left: CX - 320, width: 640, zIndex: 5,
        opacity: interpolate(alertEnter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(alertEnter, [0, 1], [16, 0])}px)`,
      }}>
        <div style={{
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 12, padding: '16px 22px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.blue500} strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>Auto-Created Reminder</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              System triggered at 90-day threshold
            </div>
          </div>
          <div style={{
            padding: '3px 12px', borderRadius: 9999,
            background: 'rgba(59,130,246,0.12)', color: C.blue500,
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            Auto
          </div>
        </div>
      </div>

      {/* ═══════ TASK CARDS — Side by side, centered ═══════ */}
      <div style={{
        position: 'absolute', top: 470, left: CX - 320, width: 640,
        display: 'flex', gap: 14, zIndex: 4,
      }}>
        <div style={{
          flex: 1,
          opacity: interpolate(employerTaskEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(employerTaskEnter, [0, 1], [12, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: `3px solid ${C.amber500}`,
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.amber500, letterSpacing: '0.06em', marginBottom: 8 }}>
              EMPLOYER TASK
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 4 }}>
              Approve Extension Budget
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Est. ~$2,500
            </div>
          </div>
        </div>

        <div style={{
          flex: 1,
          opacity: interpolate(attorneyTaskEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(attorneyTaskEnter, [0, 1], [12, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: `3px solid ${C.green500}`,
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.green500, letterSpacing: '0.06em', marginBottom: 8 }}>
              ATTORNEY TASK
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 4 }}>
              Prepare Extension Filing
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              File I-129 before expiry
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ STATE GAUGE + COST — Centered row ═══════ */}
      <div style={{
        position: 'absolute', top: 640, left: CX - 380, width: 760,
        display: 'flex', gap: 28, alignItems: 'center', zIndex: 4,
      }}>
        {/* Risk gauge */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>
            DEADLINE RISK
          </div>
          <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              width: `${gaugeProgress * 100}%`, height: '100%', borderRadius: 4,
              background: `linear-gradient(90deg, ${C.amber500}, ${stateColor})`,
            }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: stateColor, marginTop: 8 }}>
            {isManaged ? 'Managed' : 'At Risk'}
          </div>
        </div>

        {/* Cost comparison */}
        <div style={{
          opacity: interpolate(costEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(costEnter, [0, 1], [10, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '16px 28px',
            display: 'flex', alignItems: 'center', gap: 18,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Without</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', marginTop: 2 }}>$5K+</div>
              <div style={{ fontSize: 10, color: C.red500, marginTop: 2 }}>Rush</div>
            </div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)' }}>{'\u2192'}</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>CaseBridge</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.green500, marginTop: 2 }}>~$2.5K</div>
              <div style={{ fontSize: 10, color: C.green500, marginTop: 2 }}>Proactive</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.green500 }}>{'\u221250%'}</div>
          </div>
        </div>
      </div>

      {/* ═══════ Kinetic caption ═══════ */}
      {frame >= P.kineticIn && frame < 15 * fps && (
        <div style={{
          position: 'absolute', top: '42%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticEnter, [0, 1], [0.85, 1])})`,
          zIndex: 30, pointerEvents: 'none',
          opacity: interpolate(kineticEnter, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 48, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 60px rgba(14,26,74,0.95), 0 0 120px rgba(14,26,74,0.8)',
          }}>
            Deadline made visible.
          </div>
        </div>
      )}

      <Caption
        text={CAPTIONS.scene7.main}
        subtext={CAPTIONS.scene7.sub}
        delay={Math.round(2.5 * fps)}
      />
    </AbsoluteFill>
  );
};
