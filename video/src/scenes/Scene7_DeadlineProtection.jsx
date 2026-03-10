import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';

/**
 * Scene 7 — Deadline Protection (15s)
 *
 * Proves operational value: the system surfaces and manages deadline risk
 * before it becomes a crisis. No browser chrome.
 *
 * Visual arc:
 *   0-3s: Large "102" countdown dominates center with pulse
 *   3-5.5s: Timeline bar appears below — 90-day threshold marker glows
 *   5.5-8s: Alert materializes, then splits into two task cards (employer + attorney)
 *   8-11s: Risk gauge morphs from amber "At Risk" → green "Managed"
 *   11-13.5s: Cost comparison appears — "$5K+ → ~$2.5K"
 *   13.5-15s: "Deadline made visible" kinetic caption
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

  /* ── Countdown ── */
  const countdownEnter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: P.countdownIn });
  const countdownPulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.97, 1.03]);

  /* ── Timeline bar ── */
  const timelineEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.timelineIn });
  const timelineWidth = interpolate(timelineEnter, [0, 1], [0, 1000]);

  /* ── 90-day threshold marker ── */
  const thresholdGlow = interpolate(frame, [P.thresholdGlow, P.thresholdGlow + fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const thresholdPulse = frame > P.thresholdGlow
    ? interpolate(Math.sin((frame - P.thresholdGlow) / 10), [-1, 1], [0.4, 1])
    : 0;

  /* ── Alert card ── */
  const alertEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: P.alertIn });

  /* ── Task cards ── */
  const employerTaskEnter = spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: P.tasksIn });
  const attorneyTaskEnter = spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: P.tasksIn + 12 });

  /* ── Risk gauge ── */
  const gaugeProgress = interpolate(frame, [P.gaugeStart, P.gaugeEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const gaugeColor = gaugeProgress > 0.5 ? C.green500 : C.amber500;
  const gaugeLabel = gaugeProgress > 0.7 ? 'Managed' : 'At Risk';
  const gaugeLabelColor = gaugeProgress > 0.7 ? C.green500 : C.amber500;

  /* ── Cost comparison ── */
  const costEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.costIn });

  /* ── Kinetic caption ── */
  const kineticEnter = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: P.kineticIn });
  const kineticExit = interpolate(frame, [14 * fps, 15 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Warning glow behind countdown ── */}
      <div style={{
        position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.amber500} 0%, transparent 70%)`,
        opacity: 0.06, pointerEvents: 'none',
      }} />

      {/* ═══════ COUNTDOWN ═══════ */}
      <div style={{
        position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 5,
        opacity: interpolate(countdownEnter, [0, 1], [0, 1]),
      }}>
        <div style={{
          fontSize: 120, fontWeight: 700, fontFamily: FONT_DISPLAY,
          color: C.amber500, lineHeight: 1,
          transform: `scale(${countdownPulse})`,
        }}>
          102
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', marginTop: 8, fontWeight: 500 }}>
          Days Until H-1B Expiry
        </div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
          {CASE.applicant.name} {'\u2022'} {CASE.employer.shortName} {'\u2022'} Expires {CASE.applicant.h1bExpiry}
        </div>
      </div>

      {/* ═══════ TIMELINE BAR ═══════ */}
      <div style={{
        position: 'absolute', top: 310, left: '50%', transform: 'translateX(-50%)',
        width: 1000, zIndex: 3,
        opacity: interpolate(timelineEnter, [0, 1], [0, 1]),
      }}>
        {/* Track */}
        <div style={{
          width: timelineWidth, height: 6, borderRadius: 3,
          background: 'rgba(255,255,255,0.08)', position: 'relative', margin: '0 auto',
        }}>
          {/* Filled portion — representing time elapsed */}
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: '70%', height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${C.green500}, ${C.amber500})`,
          }} />

          {/* 90-day threshold marker */}
          <div style={{
            position: 'absolute', left: '88%', top: -12,
            width: 2, height: 30, background: C.amber500,
            opacity: thresholdGlow,
            boxShadow: `0 0 ${12 * thresholdPulse}px ${C.amber500}`,
          }} />
          {thresholdGlow > 0 && (
            <div style={{
              position: 'absolute', left: '88%', top: -32,
              transform: 'translateX(-50%)',
              fontSize: 12, fontWeight: 700, color: C.amber500,
              opacity: thresholdGlow, whiteSpace: 'nowrap',
            }}>
              90-day trigger
            </div>
          )}

          {/* Current position marker */}
          <div style={{
            position: 'absolute', left: '70%', top: -4,
            width: 14, height: 14, borderRadius: 7,
            background: C.amber500, border: '2px solid rgba(255,255,255,0.3)',
            transform: 'translateX(-50%)',
          }} />
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>H-1B Start</span>
          <span style={{ fontSize: 12, color: C.amber500, fontWeight: 600 }}>102 days left</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Expiry</span>
        </div>
      </div>

      {/* ═══════ ALERT CARD ═══════ */}
      <div style={{
        position: 'absolute', top: 390, left: '50%', transform: 'translateX(-50%)',
        width: 600, zIndex: 5,
        opacity: interpolate(alertEnter, [0, 1], [0, 1]),
        transform: `translateX(-50%) translateY(${interpolate(alertEnter, [0, 1], [20, 0])}px) scale(${interpolate(alertEnter, [0, 1], [0.95, 1])})`,
      }}>
        <div style={{
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 14, padding: '20px 28px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* Bell icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue500} strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>Auto-Created Reminder</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
              System triggered at 90-day threshold. Extension workflow initiated.
            </div>
          </div>
          <div style={{
            padding: '4px 14px', borderRadius: 9999,
            background: 'rgba(59,130,246,0.12)', color: C.blue500,
            fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 'auto',
          }}>
            Triggered automatically
          </div>
        </div>
      </div>

      {/* ═══════ TASK CARDS ═══════ */}
      <div style={{ position: 'absolute', top: 510, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 24, zIndex: 4 }}>
        {/* Employer task */}
        <div style={{
          width: 440,
          opacity: interpolate(employerTaskEnter, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(employerTaskEnter, [0, 1], [-30, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: `4px solid ${C.amber500}`,
            borderRadius: 14, padding: '22px 26px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.amber500, letterSpacing: '0.06em', marginBottom: 10 }}>
              EMPLOYER / HR TASK
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 8 }}>
              Approve H-1B Extension Budget
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              Estimated cost: ~$2,500. Confirm job duties letter.
            </div>
          </div>
        </div>

        {/* Attorney task */}
        <div style={{
          width: 440,
          opacity: interpolate(attorneyTaskEnter, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(attorneyTaskEnter, [0, 1], [30, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: `4px solid ${C.green500}`,
            borderRadius: 14, padding: '22px 26px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.green500, letterSpacing: '0.06em', marginBottom: 10 }}>
              ATTORNEY TASK
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 8 }}>
              Prepare Extension Filing Package
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              Compile evidence, draft petition, file I-129 before expiry.
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ RISK GAUGE + COST ═══════ */}
      <div style={{
        position: 'absolute', top: 720, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 40, alignItems: 'center', zIndex: 4,
      }}>
        {/* Risk gauge */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 14 }}>
            DEADLINE RISK
          </div>
          <div style={{ width: 300, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              width: `${gaugeProgress * 100}%`, height: '100%', borderRadius: 5,
              background: `linear-gradient(90deg, ${C.amber500}, ${gaugeColor})`,
            }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: gaugeLabelColor, marginTop: 10 }}>
            {gaugeLabel}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            {gaugeProgress > 0.7 ? 'Extension workflow activated' : 'No action taken yet'}
          </div>
        </div>

        {/* Cost comparison */}
        <div style={{
          opacity: interpolate(costEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(costEnter, [0, 1], [12, 0])}px)`,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '20px 32px',
            display: 'flex', alignItems: 'center', gap: 24,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Without</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', marginTop: 4 }}>$5,000+</div>
              <div style={{ fontSize: 11, color: C.red500, marginTop: 2 }}>Rush filing</div>
            </div>
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.2)' }}>{'\u2192'}</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>With CaseBridge</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.green500, marginTop: 4 }}>~$2,500</div>
              <div style={{ fontSize: 11, color: C.green500, marginTop: 2 }}>Proactive filing</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.green500, marginLeft: 8 }}>{'\u221250%'}</div>
          </div>
        </div>
      </div>

      {/* ═══════ Kinetic caption ═══════ */}
      {frame >= P.kineticIn && frame < 15 * fps && (
        <div style={{
          position: 'absolute', top: '45%', left: '50%',
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
