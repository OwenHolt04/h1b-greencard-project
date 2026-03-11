import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import {
  BrowserFrame, WebNavBar, AnimatedCursor, getCursorState, getCameraState, cameraStyle,
  PCard, tileEntrance, ReadinessRing, PRES_BG, CONTENT, NAV_H,
} from './shared';

/**
 * WK3 — Validation Quick Beat (7s / 210f)
 *
 * A fast visual proof flash of the Pre-Submission Validation screen.
 * No interaction — just the full validation UI appearing quickly.
 */

const ISSUES = [
  {
    title: 'SOC / Wage Survey Mismatch',
    severity: 'HIGH',
    color: '#ef4444',
    detail: 'Q4 vs Q2 2023 wage survey discrepancy',
    forms: ['ETA-9089', 'I-140'],
  },
  {
    title: 'Employer Name Format Mismatch',
    severity: 'MEDIUM',
    color: '#f59e0b',
    detail: `"${CASE.employer.wrongName}" vs "${CASE.employer.name}"`,
    forms: ['I-140', 'I-485', 'ETA-9089'],
    hasFix: true,
  },
  {
    title: 'Travel History Gap',
    severity: 'LOW',
    color: '#3b82f6',
    detail: '3-week gap in Dec 2023 travel records',
    forms: ['I-485'],
  },
];

const CHECKLIST = [
  { label: 'I-140 Petition Letter', done: true },
  { label: 'Labor Certification (ETA-9089)', done: true },
  { label: 'Prevailing Wage Determination', done: true },
  { label: 'Employer Support Letter', done: true },
  { label: 'Educational Credentials Evaluation', done: true },
  { label: 'Birth Certificate + Translation', done: true },
  { label: 'Passport Bio Pages (all)', done: true },
  { label: 'I-94 Travel Records', done: true },
  { label: 'Tax Returns (3 years)', done: true },
  { label: 'Pay Stubs (recent 6 months)', done: true },
  { label: 'Employment Verification Letters', done: true },
  { label: 'Photographs (USCIS spec)', done: true },
  { label: 'Medical Exam (I-693)', required: true, done: false },
  { label: 'Affidavit of Support (I-864)', required: true, done: false },
  { label: 'Travel History Documentation', required: true, done: false },
];

export const WK3_ValidationQuick = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: start zoomed on readiness header, pull back to full layout
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1.04, focusX: CONTENT.width / 2, focusY: CONTENT.height * 0.35 },
    { t: 1.5, zoom: 1.04, focusX: CONTENT.width / 2, focusY: CONTENT.height * 0.35 },
    { t: 3, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 7, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor: subtle drift across issues area
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 900, y: 400, visible: false },
    { t: 2, x: 900, y: 400, visible: true },
    { t: 3.5, x: 1400, y: 420, visible: true },
    { t: 5, x: 1400, y: 520, visible: true },
    { t: 6.5, x: 1350, y: 480, visible: true },
    { t: 7, x: 1350, y: 480, visible: false },
  ]);

  const doneCount = CHECKLIST.filter(c => c.done).length;
  const totalCount = CHECKLIST.length;
  const progressPct = (doneCount / totalCount) * 100;

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
            background: PRES_BG,
            padding: '20px 28px',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              ...tileEntrance(frame, fps, 0),
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.navy900, fontFamily: FONT_SANS }}>
                Pre-Submission Validation
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Catch issues before filing, not at adjudication
              </div>
            </div>

            {/* Readiness header card */}
            <PCard style={{
              ...tileEntrance(frame, fps, 0.3),
              padding: '14px 20px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  display: 'inline-block',
                  padding: '7px 16px', borderRadius: 8,
                  background: '#94a3b8',
                  color: '#ffffff', fontSize: 13, fontWeight: 700,
                }}>
                  Validation Complete
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>
                  Scanned 6 forms &middot; 86 fields &middot; 23 cross-references
                </div>
              </div>
              <ReadinessRing score={72} size={56} />
            </PCard>

            {/* RFE Alert Banner */}
            <div style={{
              ...tileEntrance(frame, fps, 1.5),
              marginBottom: 14,
              padding: '10px 16px', borderRadius: 10,
              background: '#fef2f2', border: '1px solid #fecaca',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>{'\u26A0\uFE0F'}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>
                  RFE Risk: 3 issues detected
                </div>
                <div style={{ fontSize: 10, color: '#b91c1c' }}>
                  Current filing carries ~25% chance of Request for Evidence
                </div>
              </div>
            </div>

            {/* 5-column grid: left 3 = checklist, right 2 = issues */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '3fr 2fr',
              gap: 14,
            }}>
              {/* LEFT: I-485 Filing Checklist */}
              <PCard style={{
                ...tileEntrance(frame, fps, 3),
                padding: '14px 16px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navy900 }}>
                    I-485 Filing Checklist
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: '#64748b',
                  }}>
                    {doneCount}/{totalCount}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: 6, borderRadius: 3, background: '#e2e8f0',
                  marginBottom: 12,
                }}>
                  <div style={{
                    height: 6, borderRadius: 3,
                    width: `${progressPct}%`,
                    background: progressPct === 100 ? '#22c55e' : '#f59e0b',
                  }} />
                </div>

                {/* Checklist items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {CHECKLIST.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: 10, fontFamily: FONT_SANS,
                    }}>
                      {/* Checkbox icon */}
                      <div style={{
                        width: 14, height: 14, borderRadius: 3,
                        flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: item.done ? '#dcfce7' : 'transparent',
                        border: item.done
                          ? '1.5px solid #22c55e'
                          : item.required
                            ? '1.5px solid #f59e0b'
                            : '1.5px solid #cbd5e1',
                      }}>
                        {item.done && (
                          <span style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>{'\u2713'}</span>
                        )}
                      </div>
                      <span style={{
                        color: item.done ? '#94a3b8' : '#334155',
                        textDecoration: item.done ? 'line-through' : 'none',
                        fontWeight: item.required && !item.done ? 600 : 400,
                      }}>
                        {item.label}
                      </span>
                      {item.required && !item.done && (
                        <span style={{
                          fontSize: 8, fontWeight: 700, color: '#dc2626',
                          background: '#fef2f2', padding: '1px 5px', borderRadius: 3,
                        }}>
                          REQUIRED
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </PCard>

              {/* RIGHT: Issue cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ISSUES.map((issue, i) => (
                  <PCard key={i} style={{
                    ...tileEntrance(frame, fps, 1.8 + i * 0.3),
                    padding: '12px 14px',
                    borderLeft: `3px solid ${issue.color}`,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
                    }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: issue.color,
                        background: `${issue.color}15`,
                        padding: '2px 7px', borderRadius: 3,
                      }}>
                        {issue.severity}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        {issue.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6 }}>
                      {issue.detail}
                    </div>
                    {/* Affected forms */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {issue.forms.map((f, j) => (
                        <span key={j} style={{
                          fontSize: 9, padding: '1px 6px', borderRadius: 3,
                          background: '#f1f5f9', color: '#64748b', fontWeight: 600,
                        }}>
                          {f}
                        </span>
                      ))}
                    </div>
                    {/* Fix button on employer issue */}
                    {issue.hasFix && (
                      <div style={{
                        marginTop: 8, display: 'inline-block',
                        padding: '5px 12px', borderRadius: 6,
                        background: C.navy900, color: '#ffffff',
                        fontSize: 10, fontWeight: 700,
                      }}>
                        Fix: Standardize to &ldquo;{CASE.employer.name}&rdquo;
                      </div>
                    )}
                  </PCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />
    </AbsoluteFill>
  );
};
