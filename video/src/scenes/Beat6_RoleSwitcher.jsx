import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { AppFrame } from '../components/AppFrame';
import { Caption } from '../components/Caption';

const ROLES = [
  {
    id: 'applicant',
    label: 'Applicant',
    greeting: 'Welcome, Yuto',
    summary: 'Your case is on track. No action needed today — your attorney is reviewing final documentation.',
    nextStep: 'Wait for attorney to confirm job duties wording before the next filing step.',
    alerts: [
      { type: 'info', icon: '📋', text: 'I-485 package is 82% complete' },
      { type: 'info', icon: '📅', text: 'Priority date is current for EB-2 Japan' },
      { type: 'action', icon: '✈️', text: 'Confirm December 2023 travel re-entry date' },
    ],
    actions: ['View My Timeline', 'Upload Documents', 'Message Attorney'],
    accent: C.blue500,
  },
  {
    id: 'employer',
    label: 'Employer / HR',
    greeting: 'Helix Systems — Yuto Sato',
    summary: 'H-1B expires in 102 days. Extension filing should be initiated within 90 days to maintain continuity.',
    nextStep: 'Approve internal budget allocation for extension filing ($2,500 est.) and confirm job duties letter.',
    alerts: [
      { type: 'deadline', icon: '⏰', text: 'H-1B extension due in 102 days — auto-trigger at 90' },
      { type: 'cost', icon: '💰', text: 'Extension filing est. $2,500 (vs. $5,000+ avg)' },
      { type: 'action', icon: '📝', text: 'Internal approval pending — HR Director sign-off' },
    ],
    actions: ['View Extension Timeline', 'Approve Budget', 'Contact Attorney'],
    accent: C.amber500,
  },
  {
    id: 'attorney',
    label: 'Attorney',
    greeting: 'Maya Chen — Case CB-2024-001847',
    summary: '2 validation issues remain. SOC/wage mismatch requires your review before I-140 package submission.',
    nextStep: 'Review SOC code mapping against Q2 2023 wage data. Confirm or request PWD amendment.',
    alerts: [
      { type: 'high', icon: '🔴', text: 'HIGH: SOC/wage data mismatch — review required' },
      { type: 'low', icon: '🔵', text: 'LOW: Travel history gap — applicant confirmation pending' },
      { type: 'info', icon: '📄', text: 'Evidence bundle: 4/5 documents received' },
    ],
    actions: ['Review Validation Issues', 'Update Legal Notes', 'Submit Filing Package'],
    accent: C.green500,
  },
];

/**
 * Beat 6 — Role Switcher (22s)
 * Three role views shown sequentially: Applicant → Employer/HR → Attorney.
 * Same case, different priorities, different language.
 */
export const Beat6_RoleSwitcher = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing — roughly equal time per role
  const ROLE_TIMING = [
    { start: 0, end: 7 * fps },           // Applicant
    { start: 7 * fps, end: 14.5 * fps },  // Employer
    { start: 14.5 * fps, end: 22 * fps }, // Attorney
  ];

  // Determine active role
  let activeRoleIdx = 0;
  if (frame >= ROLE_TIMING[2].start) activeRoleIdx = 2;
  else if (frame >= ROLE_TIMING[1].start) activeRoleIdx = 1;

  const activeRole = ROLES[activeRoleIdx];
  const roleStart = ROLE_TIMING[activeRoleIdx].start;
  const localFrame = frame - roleStart;

  // Content entrance
  const contentEnter = spring({
    frame: localFrame,
    fps,
    config: { damping: 200 },
    delay: 8,
  });

  // Staggered alert entrance
  const alertsEnter = (i) =>
    spring({
      frame: localFrame,
      fps,
      config: { damping: 200 },
      delay: Math.round(0.6 * fps) + i * 5,
    });

  // Caption per role
  const captionText = CAPTIONS.beat6.labels[activeRole.id];

  return (
    <AbsoluteFill>
      <AppFrame activeScreen="Roles">
        <div style={{ padding: '20px 32px', height: '100%' }}>
          {/* Role Switcher Control */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              background: C.slate100,
              borderRadius: 10,
              padding: 3,
              width: 'fit-content',
              marginBottom: 24,
            }}
          >
            {ROLES.map((role, i) => {
              const isActive = i === activeRoleIdx;
              return (
                <div
                  key={role.id}
                  style={{
                    padding: '8px 24px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? C.navy900 : C.slate500,
                    background: isActive ? C.white : 'transparent',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {role.label}
                </div>
              );
            })}
          </div>

          {/* Role Content */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              opacity: interpolate(contentEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(contentEnter, [0, 1], [12, 0])}px)`,
            }}
          >
            {/* Main Content Area */}
            <div style={{ flex: 1 }}>
              {/* Greeting + Summary */}
              <div style={{ ...cardStyle, padding: '24px', marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.slate800,
                    marginBottom: 8,
                  }}
                >
                  {activeRole.greeting}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: C.slate600,
                    lineHeight: 1.6,
                    marginBottom: 16,
                    borderLeft: `3px solid ${activeRole.accent}`,
                    paddingLeft: 14,
                  }}
                >
                  {activeRole.summary}
                </div>

                {/* Next Step */}
                <div
                  style={{
                    background: C.slate50,
                    borderRadius: 8,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Next Step
                  </div>
                  <div style={{ fontSize: 13, color: C.slate700, lineHeight: 1.5 }}>
                    {activeRole.nextStep}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {activeRole.actions.map((action, i) => (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '10px 18px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: i === 0 ? C.white : C.slate700,
                      background: i === 0 ? C.navy900 : C.white,
                    }}
                  >
                    {action}
                  </div>
                ))}
              </div>

              {/* Compact Timeline */}
              <div style={{ ...cardStyle, padding: '16px 20px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  Case Timeline
                </div>
                <div style={{ display: 'flex', gap: 0 }}>
                  {['Eligibility', 'PWD', 'PERM', 'I-140', 'Bulletin', 'I-485', 'Bio', 'Approval'].map((stage, i) => {
                    const isComplete = i < 4;
                    const isCurrent = i === 5;
                    const color = isComplete ? C.green500 : isCurrent ? C.blue500 : C.slate300;

                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            background: color,
                            marginBottom: 6,
                          }}
                        />
                        <div
                          style={{
                            fontSize: 9,
                            color: isCurrent ? C.blue600 : C.slate400,
                            fontWeight: isCurrent ? 600 : 400,
                            textAlign: 'center',
                          }}
                        >
                          {stage}
                        </div>
                        {i < 7 && (
                          <div
                            style={{
                              position: 'absolute',
                              // connector line - approximate with background
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Alerts Sidebar */}
            <div style={{ width: 340, flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.slate800, marginBottom: 12 }}>
                Priority Alerts
              </div>
              {activeRole.alerts.map((alert, i) => {
                const aEnter = alertsEnter(i);
                const alertColors = {
                  high: { bg: C.red50, border: C.red500 },
                  deadline: { bg: C.amber50, border: C.amber500 },
                  cost: { bg: C.amber50, border: C.amber500 },
                  action: { bg: C.blue50, border: C.blue500 },
                  low: { bg: C.blue50, border: C.blue500 },
                  info: { bg: C.slate50, border: C.slate300 },
                };
                const colors = alertColors[alert.type] || alertColors.info;

                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '14px 16px',
                      marginBottom: 10,
                      borderLeft: `3px solid ${colors.border}`,
                      background: colors.bg,
                      opacity: interpolate(aEnter, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(aEnter, [0, 1], [16, 0])}px)`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{alert.icon}</span>
                      <div style={{ fontSize: 13, color: C.slate700, lineHeight: 1.4 }}>
                        {alert.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Readiness Score */}
              <div style={{ ...cardStyle, padding: '16px', marginTop: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Filing Readiness
                </div>
                <div style={{ fontSize: 36, fontWeight: 700, color: C.slate800 }}>80</div>
                <div style={{ fontSize: 11, color: C.slate400 }}>of 100</div>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>

      <Caption
        text={CAPTIONS.beat6.main}
        subtext={captionText}
        delay={Math.round(1.5 * fps)}
      />
    </AbsoluteFill>
  );
};
