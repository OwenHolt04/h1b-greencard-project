import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { MinimalFrame } from '../components/MinimalFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const SHARED_FIELDS = [
  { section: 'Identity', fields: [`Full Name: ${CASE.applicant.name}`, `Country: ${CASE.applicant.country}`, `DOB: 1996-07-22`], formTargets: 3 },
  { section: 'Employer', fields: [`Legal Name: ${CASE.employer.name}`, `FEIN: ${CASE.employer.fein}`, `Location: ${CASE.employer.location}`], formTargets: 4 },
  { section: 'Role / Job', fields: [`Title: ${CASE.applicant.title}`, `SOC: ${CASE.applicant.soc}`, `Salary: ${CASE.applicant.salary}`], formTargets: 3 },
  { section: 'Immigration', fields: [`Status: H-1B`, `Expires: ${CASE.applicant.h1bExpiry}`, `Priority Date: ${CASE.applicant.priorityDate}`], formTargets: 5 },
];

const FORMS = [
  { code: 'ETA-9089', name: 'PERM Application', pct: 100, status: 'Certified' },
  { code: 'I-140', name: 'Immigrant Petition', pct: 100, status: 'Approved' },
  { code: 'I-485', name: 'Adjustment of Status', pct: 82, status: 'In Progress' },
  { code: 'I-765', name: 'Employment Auth', pct: 90, status: 'In Progress' },
  { code: 'I-131', name: 'Advance Parole', pct: 88, status: 'In Progress' },
  { code: 'G-28', name: 'Attorney Rep.', pct: 100, status: 'Complete' },
];

const FLOW_LINES = [
  { fromY: 80, toForms: [0, 2, 3] },
  { fromY: 200, toForms: [0, 1, 2, 5] },
  { fromY: 320, toForms: [0, 1, 2] },
  { fromY: 440, toForms: [2, 3, 4] },
];

/**
 * Scene 4 — Intake Sync (12s)
 *
 * Camera choreography: starts zoomed into the employer name field,
 * then pulls back to reveal the full sync visualization.
 *
 * Visual arc:
 *   0-3s: Zoomed into a single field — "Employer Legal Name"
 *   3-5s: Camera pulls back, shared data panel reveals
 *   5-8s: SVG flow lines animate to form cards
 *   8-12s: Form cards light up with sync indicators
 */
export const Scene4_IntakeSync = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: zoomed in initially, pulls back
  const cameraProgress = interpolate(frame, [0, Math.round(4 * fps)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const cameraZoom = interpolate(cameraProgress, [0, 1], [1.8, 1.0]);
  const cameraPanX = interpolate(cameraProgress, [0, 1], [-350, 0]);
  const cameraPanY = interpolate(cameraProgress, [0, 1], [-80, 0]);

  // Shared data panel enter
  const leftEnter = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  // Flow line animation: starts at 4.5s
  const flowStart = Math.round(4.5 * fps);
  const showFlow = frame > flowStart;

  // Sync indicator on forms: starts at 5.5s
  const syncStart = Math.round(5.5 * fps);
  const showSync = frame > syncStart;
  const syncPhase = Math.max(0, frame - syncStart);
  const syncPulse = interpolate(
    Math.sin((syncPhase / 50) * Math.PI * 2),
    [-1, 1],
    [0.5, 1],
  );

  // Field highlight: employer name glows initially
  const highlightOpacity = interpolate(frame, [0, Math.round(1.5 * fps), Math.round(3.5 * fps)], [0, 1, 0.3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Right column opacity ramp
  const rightEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.5 * fps) });
  const rightDim = interpolate(frame, [0, Math.round(5 * fps)], [0.4, 1], {
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
            transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
            transformOrigin: '22% 40%',
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
              Shared Case Data \u2014 Source of Truth
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
                  const isEmployerName = label === 'Legal Name' && si === 1;

                  return (
                    <div
                      key={fi}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '5px 4px',
                        borderBottom: fi < section.fields.length - 1 ? `1px solid ${C.slate100}` : 'none',
                        background: isEmployerName ? `rgba(59, 130, 246, ${highlightOpacity * 0.1})` : 'transparent',
                        borderRadius: 4,
                        boxShadow: isEmployerName && highlightOpacity > 0.3
                          ? `0 0 0 2px rgba(59, 130, 246, ${highlightOpacity * 0.3})`
                          : 'none',
                      }}
                    >
                      <span style={{ fontSize: 15, color: C.slate500 }}>{label}</span>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: isEmployerName && highlightOpacity > 0.3 ? C.blue600 : C.slate700,
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  );
                })}
                {/* Sync indicator */}
                {showSync && (
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
                      opacity: syncPulse,
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

          {/* RIGHT — Form Package */}
          <div
            style={{
              flex: 1,
              opacity: interpolate(rightEnter, [0, 1], [0, rightDim]),
              transform: `translateY(${interpolate(rightEnter, [0, 1], [16, 0])}px)`,
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
                  delay: Math.round(2.0 * fps) + i * 5,
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

          {/* FAR RIGHT — Filing Readiness */}
          <div
            style={{
              width: 200,
              flexShrink: 0,
              opacity: interpolate(rightEnter, [0, 1], [0, rightDim]),
            }}
          >
            <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.slate700, marginBottom: 12 }}>
                Filing Readiness
              </div>
              <ReadinessScore fromScore={72} toScore={72} size={100} label="" />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.slate800, marginTop: 8 }}>72</div>
              <div style={{ fontSize: 12, color: C.slate400, marginTop: 2 }}>of 100</div>
            </div>
          </div>
        </div>
      </MinimalFrame>

      <Caption
        text={CAPTIONS.scene4.main}
        subtext={CAPTIONS.scene4.sub}
        delay={Math.round(1.5 * fps)}
      />
    </AbsoluteFill>
  );
};
