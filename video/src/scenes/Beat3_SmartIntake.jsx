import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { MinimalFrame } from '../components/MinimalFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const SHARED_FIELDS = [
  { section: 'Identity', fields: ['Full Name: Yuto Sato', 'DOB: 1994-03-15', 'Country: Japan'], formTargets: 3 },
  { section: 'Employer', fields: ['Legal Name: Helix Systems Inc.', 'FEIN: 84-2957103', 'Industry: Enterprise Software'], formTargets: 4 },
  { section: 'Role / Job', fields: ['Title: Senior Software Engineer', 'SOC: 15-1256.00', 'Salary: $165,000'], formTargets: 3 },
  { section: 'Immigration', fields: ['Status: H-1B', 'Expires: Jul 15, 2025', 'Priority Date: Apr 12, 2023'], formTargets: 5 },
];

const FORMS = [
  { code: 'ETA-9089', name: 'PERM Application', pct: 100, status: 'Certified' },
  { code: 'I-140', name: 'Immigrant Petition', pct: 100, status: 'Approved' },
  { code: 'I-485', name: 'Adjustment of Status', pct: 82, status: 'In Progress' },
  { code: 'I-765', name: 'Employment Auth', pct: 90, status: 'In Progress' },
  { code: 'I-131', name: 'Advance Parole', pct: 88, status: 'In Progress' },
  { code: 'G-28', name: 'Attorney Rep.', pct: 100, status: 'Complete' },
];

// SVG flow line positions: from each shared section to form card columns
const FLOW_LINES = [
  { fromY: 80, toForms: [0, 2, 3] },      // Identity → ETA-9089, I-485, I-765
  { fromY: 200, toForms: [0, 1, 2, 5] },   // Employer → ETA-9089, I-140, I-485, G-28
  { fromY: 320, toForms: [0, 1, 2] },       // Role/Job → ETA-9089, I-140, I-485
  { fromY: 440, toForms: [2, 3, 4] },       // Immigration → I-485, I-765, I-131
];

/**
 * Beat 3 — Smart Intake + Form Sync (12s)
 * MinimalFrame. Three-column layout with animated SVG flow lines
 * showing data flowing from shared intake to form cards.
 */
export const Beat3_SmartIntake = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEnter = spring({ frame, fps, config: { damping: 200 }, delay: 8 });
  const centerEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.6 * fps) });
  const rightEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.2 * fps) });

  // Flow line animation: starts at 2.0s, draws in over 1.5s
  const flowStart = Math.round(2.0 * fps);
  const flowProgress = spring({ frame: frame - flowStart, fps, config: { damping: 200 } });
  const showFlow = frame > flowStart;

  // Sync pulse for form cards
  const syncPhase = Math.max(0, frame - Math.round(2.5 * fps));
  const syncPulse = Math.sin((syncPhase / 50) * Math.PI * 2) * 0.5 + 0.5;
  const showSync = frame > Math.round(2.5 * fps);

  // Right column starts dimmer, then brightens
  const rightDim = interpolate(frame, [0, Math.round(3.0 * fps)], [0.45, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <MinimalFrame activeScreen="Intake">
        <div
          style={{
            display: 'flex',
            gap: 16,
            padding: '20px 24px',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* LEFT — Shared Case Data */}
          <div
            style={{
              width: 400,
              flexShrink: 0,
              opacity: interpolate(leftEnter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(leftEnter, [0, 1], [-16, 0])}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800, marginBottom: 2 }}>
              Shared Case Data
            </div>

            {SHARED_FIELDS.map((section, si) => (
              <div key={si} style={{ ...cardStyle, padding: '14px 16px' }}>
                <div
                  style={{
                    fontSize: 13, fontWeight: 600, color: C.slate400,
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
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
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '5px 0',
                        borderBottom: fi < section.fields.length - 1 ? `1px solid ${C.slate100}` : 'none',
                      }}
                    >
                      <span style={{ fontSize: 15, color: C.slate500 }}>{label}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: C.slate700 }}>{value}</span>
                    </div>
                  );
                })}
                {/* Sync indicator */}
                {showSync && (
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
                      opacity: 0.5 + syncPulse * 0.5,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green500 }} />
                    <span style={{ fontSize: 12, color: C.green600, fontWeight: 500 }}>
                      Synced to {section.formTargets} forms
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* SVG Flow Lines Overlay */}
          {showFlow && (
            <svg
              style={{
                position: 'absolute',
                top: 60, left: 400,
                width: 120, height: 900,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              {FLOW_LINES.map((line, li) => {
                const lineProgress = spring({
                  frame: frame - flowStart - li * 6,
                  fps,
                  config: { damping: 200 },
                });
                const dashOffset = interpolate(lineProgress, [0, 1], [80, 0], { extrapolateRight: 'clamp' });
                const opacity = interpolate(lineProgress, [0, 1], [0, 0.4], { extrapolateRight: 'clamp' });

                return line.toForms.map((formIdx, fi) => {
                  const toY = 40 + (formIdx < 3 ? formIdx : formIdx - 3) * 165 + (formIdx >= 3 ? 10 : 0);
                  return (
                    <path
                      key={`${li}-${fi}`}
                      d={`M 0 ${line.fromY} C 60 ${line.fromY}, 60 ${toY}, 120 ${toY}`}
                      fill="none"
                      stroke={C.accent}
                      strokeWidth={1.5}
                      opacity={opacity}
                      strokeDasharray={80}
                      strokeDashoffset={dashOffset}
                    />
                  );
                });
              })}
            </svg>
          )}

          {/* CENTER — Form Package */}
          <div
            style={{
              flex: 1,
              opacity: interpolate(centerEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(centerEnter, [0, 1], [16, 0])}px)`,
              marginLeft: 80,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800, marginBottom: 10 }}>
              Filing Package
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {FORMS.map((form, i) => {
                const formEnter = spring({
                  frame, fps,
                  config: { damping: 200 },
                  delay: Math.round(0.8 * fps) + i * 5,
                });

                const syncGlow = showSync && form.pct < 100
                  ? `0 0 0 ${1 + syncPulse * 3}px ${C.accent}${Math.round(syncPulse * 50).toString(16).padStart(2, '0')}`
                  : 'none';

                const statusColor = form.pct === 100 ? C.green600 : C.amber600;
                const statusBg = form.pct === 100 ? C.green50 : C.amber50;

                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '16px 18px',
                      opacity: interpolate(formEnter, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(formEnter, [0, 1], [12, 0])}px)`,
                      boxShadow: `0 1px 3px rgba(0,0,0,0.06), ${syncGlow}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800 }}>{form.code}</div>
                        <div style={{ fontSize: 14, color: C.slate500, marginTop: 2 }}>{form.name}</div>
                      </div>
                      <div style={badgeStyle(statusBg, statusColor)}>{form.status}</div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 12, height: 8, borderRadius: 4, background: C.slate100, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${form.pct}%`, height: '100%', borderRadius: 4,
                          background: form.pct === 100 ? C.green500 : C.blue500,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 12, color: C.slate400, marginTop: 4, textAlign: 'right' }}>
                      {form.pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Filing Readiness (starts dimmed) */}
          <div
            style={{
              width: 220,
              flexShrink: 0,
              opacity: interpolate(rightEnter, [0, 1], [0, rightDim]),
              transform: `translateX(${interpolate(rightEnter, [0, 1], [16, 0])}px)`,
            }}
          >
            <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.slate700, marginBottom: 16 }}>
                Filing Readiness
              </div>
              <ReadinessScore fromScore={72} toScore={72} size={120} label="" />
              <div style={{ fontSize: 28, fontWeight: 700, color: C.slate800, marginTop: 8 }}>72</div>
              <div style={{ fontSize: 13, color: C.slate400, marginTop: 2 }}>of 100</div>

              <div
                style={{
                  marginTop: 20,
                  background: C.navy900,
                  color: C.white,
                  padding: '12px 16px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Run Pre-Flight Validation
              </div>

              <div style={{ marginTop: 14, fontSize: 13, color: C.slate400, lineHeight: 1.4 }}>
                3 issues pending review
              </div>
            </div>
          </div>
        </div>
      </MinimalFrame>

      <Caption
        text={CAPTIONS.beat3.main}
        subtext={CAPTIONS.beat3.sub}
        delay={Math.round(1.0 * fps)}
      />
    </AbsoluteFill>
  );
};
