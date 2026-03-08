import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { AppFrame } from '../components/AppFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const SHARED_FIELDS = [
  { section: 'Identity', fields: ['Full Name: Yuto Sato', 'DOB: 1994-03-15', 'Country: Japan'] },
  { section: 'Employer', fields: ['Legal Name: Helix Systems Inc.', 'FEIN: 84-2957103', 'Industry: Enterprise Software'] },
  { section: 'Role / Job', fields: ['Title: Senior Software Engineer', 'SOC: 15-1256.00', 'Salary: $165,000'] },
  { section: 'Immigration', fields: ['Status: H-1B', 'Expires: Jul 15, 2025', 'Priority Date: Apr 12, 2023'] },
];

const FORMS = [
  { code: 'ETA-9089', name: 'PERM Application', pct: 100, status: 'Certified' },
  { code: 'I-140', name: 'Immigrant Petition', pct: 100, status: 'Approved' },
  { code: 'I-485', name: 'Adjustment of Status', pct: 82, status: 'In Progress' },
  { code: 'I-765', name: 'Employment Auth', pct: 90, status: 'In Progress' },
  { code: 'I-131', name: 'Advance Parole', pct: 88, status: 'In Progress' },
  { code: 'G-28', name: 'Attorney Representation', pct: 100, status: 'Complete' },
];

/**
 * Beat 3 — Smart Intake + Form Sync (12s)
 * Three-column layout: shared data → form cards → readiness panel.
 * Sync indicators pulse to show data flowing from intake to forms.
 */
export const Beat3_SmartIntake = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEnter = spring({ frame, fps, config: { damping: 200 }, delay: 8 });
  const centerEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.8 * fps) });
  const rightEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.4 * fps) });

  // Sync pulse: starts at 2.5s, cycles every 60 frames
  const syncPhase = Math.max(0, frame - Math.round(2.5 * fps));
  const syncPulse = Math.sin((syncPhase / 60) * Math.PI * 2) * 0.5 + 0.5;
  const showSync = frame > Math.round(2.5 * fps);

  return (
    <AbsoluteFill>
      <AppFrame activeScreen="Intake">
        <div
          style={{
            display: 'flex',
            gap: 20,
            padding: '20px 28px',
            height: '100%',
          }}
        >
          {/* LEFT — Shared Case Data */}
          <div
            style={{
              width: 420,
              flexShrink: 0,
              opacity: interpolate(leftEnter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(leftEnter, [0, 1], [-16, 0])}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: C.slate800, marginBottom: 4 }}>
              Shared Case Data
            </div>

            {SHARED_FIELDS.map((section, si) => (
              <div key={si} style={{ ...cardStyle, padding: '14px 16px' }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.slate400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}
                >
                  {section.section}
                </div>
                {section.fields.map((f, fi) => {
                  const [label, value] = f.split(': ');
                  return (
                    <div
                      key={fi}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 0',
                        borderBottom: fi < section.fields.length - 1 ? `1px solid ${C.slate100}` : 'none',
                      }}
                    >
                      <span style={{ fontSize: 12, color: C.slate500 }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.slate700 }}>{value}</span>
                    </div>
                  );
                })}
                {/* Sync indicator */}
                {showSync && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 8,
                      opacity: 0.4 + syncPulse * 0.6,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        background: C.green500,
                      }}
                    />
                    <span style={{ fontSize: 10, color: C.green600, fontWeight: 500 }}>
                      Synced to {FORMS.length} forms
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CENTER — Form Package */}
          <div
            style={{
              flex: 1,
              opacity: interpolate(centerEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(centerEnter, [0, 1], [16, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: C.slate800, marginBottom: 12 }}>
              Filing Package
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              {FORMS.map((form, i) => {
                const formEnter = spring({
                  frame,
                  fps,
                  config: { damping: 200 },
                  delay: Math.round(1.0 * fps) + i * 4,
                });

                const syncGlow = showSync && form.pct < 100
                  ? `0 0 0 ${1 + syncPulse * 2}px ${C.accent}${Math.round(syncPulse * 40).toString(16).padStart(2, '0')}`
                  : 'none';

                const statusColor = form.pct === 100 ? C.green600 : C.amber600;
                const statusBg = form.pct === 100 ? C.green50 : C.amber50;

                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '16px',
                      opacity: interpolate(formEnter, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(formEnter, [0, 1], [12, 0])}px)`,
                      boxShadow: `0 1px 3px rgba(0,0,0,0.06), ${syncGlow}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.slate800 }}>{form.code}</div>
                        <div style={{ fontSize: 11, color: C.slate500, marginTop: 2 }}>{form.name}</div>
                      </div>
                      <div style={badgeStyle(statusBg, statusColor)}>{form.status}</div>
                    </div>

                    {/* Progress bar */}
                    <div
                      style={{
                        marginTop: 12,
                        height: 4,
                        borderRadius: 2,
                        background: C.slate100,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${form.pct}%`,
                          height: '100%',
                          borderRadius: 2,
                          background: form.pct === 100 ? C.green500 : C.blue500,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 10, color: C.slate400, marginTop: 4, textAlign: 'right' }}>
                      {form.pct}% complete
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Filing Readiness */}
          <div
            style={{
              width: 240,
              flexShrink: 0,
              opacity: interpolate(rightEnter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(rightEnter, [0, 1], [16, 0])}px)`,
            }}
          >
            <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.slate700, marginBottom: 16 }}>
                Filing Readiness
              </div>
              <ReadinessScore fromScore={72} toScore={72} size={100} label="" />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.slate800, marginTop: 8 }}>72</div>
              <div style={{ fontSize: 11, color: C.slate400, marginTop: 2 }}>of 100</div>

              {/* Check Readiness button */}
              <div
                style={{
                  marginTop: 20,
                  background: C.navy900,
                  color: C.white,
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Run Pre-Flight Validation
              </div>

              <div
                style={{
                  marginTop: 14,
                  fontSize: 11,
                  color: C.slate400,
                  lineHeight: 1.4,
                }}
              >
                3 issues pending review
              </div>
            </div>
          </div>
        </div>
      </AppFrame>

      <Caption
        text={CAPTIONS.beat3.main}
        subtext={CAPTIONS.beat3.sub}
        delay={Math.round(3.5 * fps)}
      />
    </AbsoluteFill>
  );
};
