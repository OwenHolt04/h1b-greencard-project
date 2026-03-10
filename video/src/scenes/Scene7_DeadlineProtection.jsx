import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { MinimalFrame } from '../components/MinimalFrame';
import { Caption } from '../components/Caption';

/**
 * Scene 7 — Deadline Protection (10s)
 *
 * NEW scene (not in original 8-beat). Demonstrates auto-triggered
 * extension management for H-1B expiry.
 *
 * Visual arc:
 *   0-2s: Large countdown card appears — "102 days until H-1B expiry"
 *   2-4s: System auto-creates extension reminder card
 *   4-6s: Split view: employer task + attorney task appear side by side
 *   6-8s: Risk gauge animates from "At Risk" → "Managed"
 *   8-10s: Cost comparison + caption
 */
export const Scene7_DeadlineProtection = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing
  const P = {
    countdownAppear: Math.round(0.5 * fps),
    reminderAppear: Math.round(2.5 * fps),
    tasksAppear: Math.round(4.0 * fps),
    gaugeAnimate: Math.round(6.0 * fps),
    costAppear: Math.round(7.5 * fps),
  };

  // Countdown card
  const countdownEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.countdownAppear });

  // Countdown number animation: counts down from 102 for visual drama
  const countdownDisplay = Math.round(
    interpolate(frame, [P.countdownAppear, P.countdownAppear + 30], [102, 102], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );

  // Countdown pulse
  const countdownPulse = interpolate(
    Math.sin(frame / 12),
    [-1, 1],
    [0.95, 1.05],
  );

  // Reminder card
  const reminderEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: P.reminderAppear });

  // Task cards
  const employerTaskEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.tasksAppear });
  const attorneyTaskEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.tasksAppear + 10 });

  // Risk gauge
  const gaugeProgress = interpolate(
    frame - P.gaugeAnimate,
    [0, Math.round(1.5 * fps)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );
  const gaugeColor = gaugeProgress > 0.5 ? C.green500 : C.amber500;
  const gaugeLabel = gaugeProgress > 0.7 ? 'Managed' : 'At Risk';
  const gaugeLabelColor = gaugeProgress > 0.7 ? C.green600 : C.amber600;

  // Cost comparison
  const costEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.costAppear });

  return (
    <AbsoluteFill>
      <MinimalFrame activeScreen="Dashboard \u2022 Alerts">
        <div
          style={{
            padding: '32px 48px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            fontFamily: FONT_SANS,
          }}
        >
          {/* Row 1: Countdown + Auto-Reminder */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
            {/* Countdown Card */}
            <div
              style={{
                ...cardStyle,
                flex: 1,
                padding: '36px 40px',
                borderLeft: `5px solid ${C.amber500}`,
                background: C.amber50,
                display: 'flex',
                alignItems: 'center',
                gap: 32,
                opacity: interpolate(countdownEnter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(countdownEnter, [0, 1], [20, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 700,
                  fontFamily: FONT_DISPLAY,
                  color: C.amber600,
                  lineHeight: 1,
                  transform: `scale(${countdownPulse})`,
                }}
              >
                {countdownDisplay}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.slate800 }}>
                  Days Until H-1B Expiry
                </div>
                <div style={{ fontSize: 16, color: C.slate500, marginTop: 6 }}>
                  {CASE.applicant.name} \u2022 {CASE.employer.shortName} \u2022 Expires {CASE.applicant.h1bExpiry}
                </div>
              </div>
            </div>

            {/* Auto-Reminder Card */}
            <div
              style={{
                ...cardStyle,
                width: 380,
                padding: '28px 32px',
                borderTop: `3px solid ${C.blue500}`,
                opacity: interpolate(reminderEnter, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(reminderEnter, [0, 1], [30, 0])}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                {/* Bell icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.blue500} strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800 }}>
                  Auto-Created Reminder
                </div>
              </div>
              <div style={{ fontSize: 15, color: C.slate600, lineHeight: 1.5 }}>
                System triggered at 90-day threshold. Extension filing workflow initiated for both employer and attorney.
              </div>
              <div style={badgeStyle(C.blue50, C.blue600, true)}>
                Triggered automatically
              </div>
            </div>
          </div>

          {/* Row 2: Stakeholder Tasks (split view) */}
          <div style={{ display: 'flex', gap: 24 }}>
            {/* Employer Task */}
            <div
              style={{
                ...cardStyle,
                flex: 1,
                padding: '24px 28px',
                borderLeft: `4px solid ${C.amber500}`,
                opacity: interpolate(employerTaskEnter, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(employerTaskEnter, [0, 1], [-20, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: C.amber600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Employer / HR Task
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800, marginBottom: 8 }}>
                Approve H-1B Extension Budget
              </div>
              <div style={{ fontSize: 15, color: C.slate500, lineHeight: 1.5, marginBottom: 12 }}>
                Estimated cost: ~$2,500. Confirm job duties letter and authorize filing.
              </div>
              <div style={badgeStyle(C.amber50, C.amber600, true)}>
                Due: 12 days before expiry
              </div>
            </div>

            {/* Attorney Task */}
            <div
              style={{
                ...cardStyle,
                flex: 1,
                padding: '24px 28px',
                borderLeft: `4px solid ${C.green500}`,
                opacity: interpolate(attorneyTaskEnter, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(attorneyTaskEnter, [0, 1], [20, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: C.green600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Attorney Task
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800, marginBottom: 8 }}>
                Prepare Extension Filing Package
              </div>
              <div style={{ fontSize: 15, color: C.slate500, lineHeight: 1.5, marginBottom: 12 }}>
                Compile evidence, draft petition letter, file I-129 extension before expiry.
              </div>
              <div style={badgeStyle(C.green50, C.green600, true)}>
                SLA: 5 business days
              </div>
            </div>
          </div>

          {/* Row 3: Risk Gauge + Cost Comparison */}
          <div style={{ display: 'flex', gap: 24, flex: 1 }}>
            {/* Risk Gauge */}
            <div
              style={{
                ...cardStyle,
                flex: 1,
                padding: '28px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
                Deadline Risk
              </div>
              {/* Gauge bar */}
              <div style={{ width: '80%', height: 14, borderRadius: 7, background: C.slate100, overflow: 'hidden', marginBottom: 12 }}>
                <div
                  style={{
                    width: `${gaugeProgress * 100}%`,
                    height: '100%',
                    borderRadius: 7,
                    background: `linear-gradient(90deg, ${C.amber500}, ${gaugeColor})`,
                  }}
                />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: gaugeLabelColor }}>
                {gaugeLabel}
              </div>
              <div style={{ fontSize: 14, color: C.slate400, marginTop: 4 }}>
                {gaugeProgress > 0.7 ? 'Extension workflow activated' : 'No action taken yet'}
              </div>
            </div>

            {/* Cost Comparison */}
            <div
              style={{
                ...cardStyle,
                width: 420,
                padding: '28px 32px',
                opacity: interpolate(costEnter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(costEnter, [0, 1], [12, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                Extension Cost Impact
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.slate400, marginBottom: 4 }}>Without CaseBridge</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.slate600, textDecoration: 'line-through' }}>$5,000+</div>
                  <div style={{ fontSize: 12, color: C.red500, marginTop: 2 }}>Rush filing + missed deadlines</div>
                </div>
                <div style={{ fontSize: 20, color: C.slate300 }}>\u2192</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.slate400, marginBottom: 4 }}>With CaseBridge</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.green600 }}>~$2,500</div>
                  <div style={{ fontSize: 12, color: C.green500, marginTop: 2 }}>Proactive, on-time filing</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 16, fontWeight: 700, color: C.green600 }}>
                \u221250% extension cost
              </div>
            </div>
          </div>
        </div>
      </MinimalFrame>

      <Caption
        text={CAPTIONS.scene7.main}
        subtext={CAPTIONS.scene7.sub}
        delay={Math.round(1.5 * fps)}
      />
    </AbsoluteFill>
  );
};
