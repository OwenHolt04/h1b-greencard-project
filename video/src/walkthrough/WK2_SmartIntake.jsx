import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import {
  BrowserFrame, WebNavBar, AnimatedCursor,
  getCursorState, getCameraState, cameraStyle,
  WebCard, SectionLabel, CONTENT, NAV_H,
} from './shared';

/**
 * WK2 — Smart Intake + Sync + Checklist (22s / 660f)
 *
 * Script beat:
 *   "he only needs to enter his employer's legal name, Job details,
 *    Wage data, and all the repeated fields once."
 *
 * Visual: Intake 3-panel, cursor highlights fields, sync to forms, brief checklist
 */

const SHARED_FIELDS = [
  { label: 'Employer Legal Name', value: CASE.employer.name, syncCount: 6, highlight: true },
  { label: 'Job Title', value: CASE.applicant.title, syncCount: 4 },
  { label: 'SOC Code', value: CASE.applicant.soc, syncCount: 3 },
  { label: 'Annual Salary', value: CASE.applicant.salary, syncCount: 4 },
  { label: 'Prevailing Wage', value: '$142,000', syncCount: 2 },
  { label: 'Worksite', value: 'San Jose, CA', syncCount: 2 },
];

const FORMS = [
  { code: 'ETA-9089', title: 'PERM Labor Cert', pct: 85 },
  { code: 'I-140', title: 'Immigrant Petition', pct: 80 },
  { code: 'I-485', title: 'Adjust Status', pct: 75 },
  { code: 'I-765', title: 'Work Authorization', pct: 90 },
  { code: 'I-131', title: 'Travel Document', pct: 88 },
  { code: 'G-28', title: 'Attorney Notice', pct: 95 },
];

const CHECKLIST = [
  { name: 'I-485 (signed)', s: 'done' },
  { name: 'I-765 (EAD)', s: 'done' },
  { name: 'I-131 (Advance Parole)', s: 'done' },
  { name: 'Employment verification', s: 'missing' },
  { name: 'Birth certificate', s: 'done' },
  { name: 'Medical exam (I-693)', s: 'done' },
  { name: 'Travel history (5yr)', s: 'flagged' },
  { name: 'Tax returns (3yr)', s: 'done' },
  { name: 'Passport copies', s: 'done' },
  { name: 'Degree evaluation', s: 'done' },
  { name: 'I-94 record', s: 'done' },
  { name: 'Photo (2x2)', s: 'done' },
  { name: 'Employment letter', s: 'pending' },
  { name: 'Prior H-1B approvals', s: 'done' },
  { name: 'Marriage cert (if any)', s: 'done' },
];

export const WK2_SmartIntake = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sync animation: starts at ~10s, green flash on form cards
  const syncTrigger = 10 * fps;
  const syncing = frame >= syncTrigger;
  const syncFlash = syncing ? interpolate(frame - syncTrigger, [0, 10, 30], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) : 0;

  // Checklist appears at ~17s
  const showChecklist = frame >= 17 * fps;
  const checklistIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(17 * fps) });

  // Camera: zoom into fields, then pan to forms, then to checklist
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 3, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 6, zoom: 1.5, focusX: 280, focusY: 300 },              // zoom into shared fields
    { t: 10, zoom: 1.5, focusX: 280, focusY: 300 },             // hold on fields
    { t: 13, zoom: 1.4, focusX: CONTENT.width / 2, focusY: 350 }, // pan to forms
    { t: 16, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 }, // zoom out
    { t: 17, zoom: 1.3, focusX: CONTENT.width / 2, focusY: 650 }, // zoom to checklist
    { t: 21, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 }, // zoom out
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 2, x: 520, y: 96, visible: true },                  // move to Intake tab
    { t: 2.5, x: 520, y: 96, click: true, visible: true },    // click Intake
    { t: 4, x: 300, y: 300, visible: true },                   // hover employer field
    { t: 7, x: 300, y: 300, visible: true },                   // stay on field
    { t: 8, x: 300, y: 360, visible: true },                   // move down to job title
    { t: 9, x: 300, y: 420, visible: true },                   // SOC code
    { t: 10, x: 800, y: 350, visible: true },                  // move to form cards
    { t: 14, x: 800, y: 350, visible: true },
    { t: 17, x: 700, y: 700, visible: true },                  // move to checklist
    { t: 21, x: 960, y: 500, visible: false },
  ]);

  // "Enter once" kinetic text
  const kineticFrame = 14 * fps;
  const kineticIn = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: kineticFrame });
  const kineticExit = interpolate(frame, [kineticFrame + 50, kineticFrame + 65], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS,
    }}>
      <BrowserFrame>
        <div style={cameraStyle(camera)}>
          <WebNavBar activeTab="Intake" />

          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            display: 'grid', gridTemplateColumns: '380px 1fr 360px',
            gap: 0,
          }}>
            {/* ── LEFT: Shared Case Data ── */}
            <div style={{
              padding: '16px 20px',
              borderRight: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}>
              <div style={{
                fontSize: 16, fontWeight: 700, color: C.navy900, marginBottom: 4,
              }}>Shared Case Data</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 16 }}>
                Single source of truth
              </div>

              {SHARED_FIELDS.map((f, i) => {
                const isHighlighted = f.highlight && frame >= 4 * fps && frame < 12 * fps;
                return (
                  <div key={i} style={{
                    marginBottom: 12, padding: '8px 10px', borderRadius: 8,
                    background: isHighlighted ? 'rgba(22,39,104,0.04)' : 'transparent',
                    border: isHighlighted ? '1px solid rgba(22,39,104,0.15)' : '1px solid transparent',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {f.label}
                      </div>
                      <div style={{ fontSize: 9, color: '#94a3b8' }}>
                        {'\u2192'} {f.syncCount} forms
                      </div>
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: C.navy900, marginTop: 3,
                      padding: '4px 8px', borderRadius: 4,
                      background: '#ffffff', border: '1px solid #e2e8f0',
                    }}>
                      {f.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── CENTER: Filing Package (Form Cards) ── */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 16,
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900 }}>Filing Package</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>6 forms auto-populated</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {FORMS.map((f, i) => {
                  const formSynced = syncing && frame >= syncTrigger + i * 5;
                  return (
                    <WebCard key={i} glow={formSynced && syncFlash > 0.1} style={{
                      borderTop: `3px solid ${formSynced ? '#22c55e' : C.navy900 + '30'}`,
                      transition: 'border-color 0.3s',
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy900 }}>{f.code}</span>
                        {formSynced && <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>{'\u2713'} Synced</span>}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{f.title}</div>
                      {/* Progress bar */}
                      <div style={{
                        marginTop: 8, height: 4, borderRadius: 2,
                        background: '#e2e8f0',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: `${f.pct}%`,
                          background: formSynced ? '#22c55e' : C.navy900,
                        }} />
                      </div>
                      <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 4 }}>{f.pct}% complete</div>
                    </WebCard>
                  );
                })}
              </div>

              {/* Sync count badge */}
              {syncing && (
                <div style={{
                  marginTop: 16, textAlign: 'center',
                  opacity: interpolate(frame - syncTrigger, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}>
                  <span style={{
                    display: 'inline-block', padding: '6px 18px', borderRadius: 20,
                    background: '#dcfce7', border: '1px solid #22c55e40',
                    fontSize: 13, fontWeight: 700, color: '#166534',
                  }}>
                    6 forms synced from 1 entry
                  </span>
                </div>
              )}
            </div>

            {/* ── RIGHT: Validation Panel ── */}
            <div style={{
              padding: '16px 20px',
              borderLeft: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900, marginBottom: 4 }}>
                Validation Engine
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 16 }}>
                Pre-filing quality checks
              </div>

              {/* Score placeholder */}
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                border: '4px solid #e2e8f0', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 14, color: '#94a3b8' }}>?</span>
              </div>

              {/* Validation button */}
              <div style={{
                padding: '10px 16px', borderRadius: 8, textAlign: 'center',
                background: C.navy900, color: '#ffffff',
                fontSize: 13, fontWeight: 700,
              }}>
                Run Pre-Flight Validation
              </div>

              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 12, textAlign: 'center' }}>
                Checks cross-form consistency before filing
              </div>
            </div>
          </div>

          {/* ── CHECKLIST (bottom overlay, slides up) ── */}
          {showChecklist && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: '#ffffff', borderTop: '1px solid #e2e8f0',
              padding: '16px 28px',
              transform: `translateY(${interpolate(checklistIn, [0, 1], [100, 0])}%)`,
              opacity: interpolate(checklistIn, [0, 1], [0, 1]),
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 10,
              }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.navy900 }}>I-485 Filing Checklist</span>
                  <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 12 }}>Document Readiness</span>
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: 6,
                  background: '#fef3c7', border: '1px solid #f59e0b40',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#92400e' }}>12</span>
                  <span style={{ fontSize: 12, color: '#92400e' }}> / 15</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px 12px' }}>
                {CHECKLIST.map((doc, i) => {
                  const statusIcon = doc.s === 'done' ? '\u2713' : doc.s === 'missing' ? '\u2014' : doc.s === 'flagged' ? '!' : '\u25CB';
                  const statusColor = doc.s === 'done' ? '#16a34a' : doc.s === 'missing' ? '#ef4444' : doc.s === 'flagged' ? '#f59e0b' : '#94a3b8';
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0',
                      fontSize: 11, color: doc.s === 'done' ? '#94a3b8' : '#334155', fontWeight: doc.s === 'done' ? 400 : 600,
                    }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: `${statusColor}15`, color: statusColor,
                        fontSize: 9, fontWeight: 700,
                      }}>{statusIcon}</span>
                      {doc.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* Kinetic "Enter once." text */}
      {frame > kineticFrame && frame < kineticFrame + 65 && (
        <div style={{
          position: 'absolute', top: '45%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticIn, [0, 1], [0.8, 1])})`,
          zIndex: 60, opacity: interpolate(kineticIn, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 80px rgba(14,26,74,0.95), 0 0 160px rgba(14,26,74,0.9)',
          }}>
            Enter once.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
