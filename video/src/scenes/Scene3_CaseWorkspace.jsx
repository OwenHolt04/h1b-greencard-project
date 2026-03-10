import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { MinimalFrame } from '../components/MinimalFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const TIMELINE_STAGES = [
  { label: 'Eligibility', status: 'complete', date: 'Jan 2022' },
  { label: 'PWD', status: 'complete', date: 'Mar 2022' },
  { label: 'PERM', status: 'complete', date: 'Feb 2023' },
  { label: 'I-140', status: 'complete', date: 'Sep 2023' },
  { label: 'Visa Bulletin', status: 'complete', date: 'Feb 2026' },
  { label: 'I-485 Prep', status: 'active', date: 'Current' },
  { label: 'Biometrics', status: 'pending', date: '\u2014' },
  { label: 'Approval', status: 'pending', date: '\u2014' },
];

const AGENCIES = [
  { name: 'DOL', status: 'PERM Certified', statusColor: C.green600, statusBg: C.green50, date: 'Feb 2023' },
  { name: 'USCIS', status: 'I-140 Approved', statusColor: C.green600, statusBg: C.green50, date: 'Sep 2023' },
  { name: 'DOS', status: 'Priority Date Current', statusColor: C.blue600, statusBg: C.blue50, date: 'Feb 2026' },
];

const ALERTS = [
  { text: 'H-1B expires in 102 days', severity: 'warning', color: C.amber600, bg: C.amber50 },
  { text: 'Priority date now current for EB-2 India', severity: 'success', color: C.green600, bg: C.green50 },
  { text: 'Attorney review pending: 3 items', severity: 'info', color: C.blue600, bg: C.blue50 },
];

/**
 * Scene 3 — Case Workspace (14s)
 *
 * The unified dashboard. Progressive disclosure:
 *   0-2s: Case header + readiness score appear
 *   2-6s: Timeline stages light up one by one
 *   6-9s: Agency status cards appear
 *   9-12s: Alerts slide in from right
 *   12-14s: Camera zooms into the active stage
 */
export const Scene3_CaseWorkspace = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: subtle zoom into timeline area
  const cameraZoom = interpolate(frame, [0, 14 * fps], [1.0, 1.08], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const cameraPanX = interpolate(frame, [6 * fps, 14 * fps], [0, -40], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const cameraPanY = interpolate(frame, [6 * fps, 14 * fps], [0, -20], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const headerEnter = spring({ frame, fps, config: { damping: 200 }, delay: 8 });

  return (
    <AbsoluteFill>
      <MinimalFrame activeScreen="Dashboard">
        <div
          style={{
            transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
            transformOrigin: '40% 35%',
            width: '100%',
            height: '100%',
            padding: '20px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Row 1: Case header + Readiness */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              opacity: interpolate(headerEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(headerEnter, [0, 1], [16, 0])}px)`,
            }}
          >
            {/* Case info card */}
            <div
              style={{
                ...cardStyle,
                flex: 1,
                padding: '20px 24px',
                borderTop: `3px solid ${C.accent}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {CASE.caseId}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.slate800, marginTop: 4 }}>
                    {CASE.applicant.name}
                  </div>
                  <div style={{ fontSize: 16, color: C.slate500, marginTop: 4 }}>
                    {CASE.applicant.title} \u2022 {CASE.employer.shortName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Attorney
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.slate700, marginTop: 4 }}>
                    {CASE.attorney.name}
                  </div>
                  <div style={{ fontSize: 14, color: C.slate400 }}>
                    {CASE.attorney.firm}
                  </div>
                </div>
              </div>
            </div>

            {/* Readiness score */}
            <div style={{ ...cardStyle, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <ReadinessScore fromScore={72} toScore={72} size={90} label="" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Filing Readiness
                </div>
                <div style={{ fontSize: 14, color: C.amber600, fontWeight: 600, marginTop: 4 }}>
                  3 issues pending
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Case Journey Timeline */}
          <div style={{ ...cardStyle, padding: '24px 28px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.slate800, marginBottom: 20 }}>
              Case Journey
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {/* Progress line */}
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 30,
                  right: 30,
                  height: 3,
                  background: C.slate200,
                  borderRadius: 2,
                }}
              />
              {/* Active progress */}
              {(() => {
                const activeIdx = TIMELINE_STAGES.findIndex(s => s.status === 'active');
                const progressWidth = interpolate(
                  frame,
                  [Math.round(2 * fps), Math.round(5 * fps)],
                  [0, ((activeIdx + 0.5) / (TIMELINE_STAGES.length - 1)) * 100],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
                return (
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 30,
                      width: `${progressWidth}%`,
                      height: 3,
                      background: C.green500,
                      borderRadius: 2,
                      zIndex: 1,
                    }}
                  />
                );
              })()}

              {TIMELINE_STAGES.map((stage, i) => {
                const stageDelay = Math.round(2.0 * fps) + i * 8;
                const stageEnter = spring({ frame, fps, config: { damping: 200 }, delay: stageDelay });

                const isComplete = stage.status === 'complete';
                const isActive = stage.status === 'active';

                let dotColor = C.slate300;
                let dotSize = 12;
                if (isComplete) { dotColor = C.green500; dotSize = 12; }
                if (isActive) { dotColor = C.blue500; dotSize = 16; }

                // Active stage pulse
                const activePulseScale = isActive
                  ? 1 + interpolate(
                      Math.sin(frame / 8),
                      [-1, 1],
                      [0, 0.15],
                    )
                  : 1;

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 2,
                      opacity: interpolate(stageEnter, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(stageEnter, [0, 1], [8, 0])}px)`,
                    }}
                  >
                    {/* Dot */}
                    <div
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: '50%',
                        background: dotColor,
                        border: isActive ? `3px solid ${C.blue500}` : 'none',
                        boxShadow: isActive ? `0 0 0 ${4 * activePulseScale}px rgba(59,130,246,0.2)` : 'none',
                        transform: `scale(${activePulseScale})`,
                      }}
                    />
                    {/* Label */}
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? C.blue600 : isComplete ? C.slate700 : C.slate400,
                        marginTop: 10,
                        textAlign: 'center',
                      }}
                    >
                      {stage.label}
                    </div>
                    {/* Date */}
                    <div
                      style={{
                        fontSize: 11,
                        color: C.slate400,
                        marginTop: 2,
                      }}
                    >
                      {stage.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 3: Agencies + Alerts */}
          <div style={{ display: 'flex', gap: 16, flex: 1 }}>
            {/* Agency Status */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.slate800 }}>
                Agency Status
              </div>
              {AGENCIES.map((agency, i) => {
                const agencyDelay = Math.round(6.0 * fps) + i * 10;
                const agencyEnter = spring({ frame, fps, config: { damping: 200 }, delay: agencyDelay });
                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      opacity: interpolate(agencyEnter, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(agencyEnter, [0, 1], [-16, 0])}px)`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800 }}>{agency.name}</div>
                      <div style={{ fontSize: 13, color: C.slate400, marginTop: 2 }}>{agency.date}</div>
                    </div>
                    <div style={badgeStyle(agency.statusBg, agency.statusColor, true)}>
                      {agency.status}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alerts */}
            <div style={{ width: 440, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.slate800 }}>
                Alerts
              </div>
              {ALERTS.map((alert, i) => {
                const alertDelay = Math.round(9.0 * fps) + i * 10;
                const alertEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: alertDelay });
                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '14px 18px',
                      borderLeft: `4px solid ${alert.color}`,
                      background: alert.bg,
                      opacity: interpolate(alertEnter, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(alertEnter, [0, 1], [24, 0])}px)`,
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 600, color: alert.color }}>
                      {alert.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </MinimalFrame>

      <Caption
        text={CAPTIONS.scene3.main}
        subtext={CAPTIONS.scene3.sub}
        delay={Math.round(1.0 * fps)}
      />
    </AbsoluteFill>
  );
};
