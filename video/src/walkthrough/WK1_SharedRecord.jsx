import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import {
  BrowserFrame, WebNavBar, AnimatedCursor,
  getCursorState, getCameraState, cameraStyle,
  PCard, tileEntrance, RoleTab, PRES_BG, CONTENT, NAV_H,
} from './shared';

/**
 * WK1 — One Source of Truth / Shared Record Overview (14s / 420f)
 *
 * Shows the applicant-facing dashboard: case journey timeline,
 * welcome card, eligibility check, and alert cards.
 */

const JOURNEY_STAGES = [
  { label: 'PWD', status: 'done' },
  { label: 'PERM', status: 'done' },
  { label: 'I-140', status: 'done' },
  { label: 'I-485', status: 'active' },
  { label: 'Biometrics', status: 'pending' },
  { label: 'EAD/AP', status: 'pending' },
  { label: 'Interview', status: 'pending' },
  { label: 'Approval', status: 'pending' },
];

const ELIGIBILITY_ITEMS = [
  { text: 'Valid H-1B status', met: true },
  { text: 'Approved I-140', met: true },
  { text: 'Priority date current', met: true },
  { text: 'Medical exam (I-693)', met: true },
  { text: 'Passport valid 6+ months', met: true },
  { text: 'Employment letter on file', met: true },
  { text: 'Tax returns (3 years)', met: true },
  { text: 'Travel history complete', met: false },
];

const JourneyNode = ({ stage, index, totalWidth }) => {
  const nodeSize = 28;
  const isDone = stage.status === 'done';
  const isActive = stage.status === 'active';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', zIndex: 2,
    }}>
      {/* Node circle */}
      <div style={{
        width: nodeSize, height: nodeSize, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDone ? '#22c55e' : isActive ? '#162768' : '#e2e8f0',
        border: isActive ? '3px solid #3b82f6' : 'none',
        boxShadow: isActive ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none',
      }}>
        {isDone && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7L6 10L11 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isActive && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }} />
        )}
      </div>
      {/* Label */}
      <div style={{
        fontSize: 9, fontWeight: 600, fontFamily: FONT_SANS,
        color: isDone ? '#16a34a' : isActive ? '#162768' : '#94a3b8',
        marginTop: 6, textAlign: 'center', whiteSpace: 'nowrap',
      }}>
        {stage.label}
      </div>
    </div>
  );
};

export const WK1_SharedRecord = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera choreography
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 2, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 4, zoom: 1.04, focusX: CONTENT.width / 2, focusY: CONTENT.height * 0.35 },
    { t: 7, zoom: 1.04, focusX: CONTENT.width / 2, focusY: CONTENT.height * 0.35 },
    { t: 9, zoom: 1.03, focusX: CONTENT.width / 2, focusY: CONTENT.height * 0.55 },
    { t: 11, zoom: 1.03, focusX: CONTENT.width / 2, focusY: CONTENT.height * 0.55 },
    { t: 13, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 14, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor choreography — subtle overview highlighting
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 900, y: 400, visible: false },
    { t: 1.5, x: 900, y: 400, visible: true },
    { t: 3, x: 700, y: 240, visible: true },      // journey area (I-485 node)
    { t: 5, x: 950, y: 240, visible: true },       // slide along journey
    { t: 7, x: 500, y: 480, visible: true },       // status card
    { t: 9, x: 1400, y: 450, visible: true },      // eligibility card
    { t: 11, x: 700, y: 620, visible: true },      // alerts
    { t: 13, x: 900, y: 400, visible: true },
    { t: 14, x: 900, y: 400, visible: false },
  ]);

  const metCount = ELIGIBILITY_ITEMS.filter(e => e.met).length;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS,
    }}>
      <BrowserFrame>
        <div style={cameraStyle(camera)}>
          <WebNavBar activeTab="Dashboard" />

          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            background: PRES_BG,
            padding: '20px 32px',
            overflow: 'hidden',
          }}>
            {/* Header row: title + role tabs */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20,
              ...tileEntrance(frame, fps, 0.2),
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#162768' }}>
                One Source of Truth
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <RoleTab label="Applicant" active icon="\uD83D\uDC64" />
                <RoleTab label="Employer" active={false} icon="\uD83C\uDFE2" />
                <RoleTab label="Attorney" active={false} icon="\u2696\uFE0F" />
              </div>
            </div>

            {/* Case Journey Card */}
            <PCard focal style={{
              padding: '16px 24px', marginBottom: 16,
              ...tileEntrance(frame, fps, 0.4),
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                Case Journey
              </div>
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                position: 'relative', padding: '0 12px',
              }}>
                {/* Connecting lines (behind nodes) */}
                <div style={{
                  position: 'absolute', top: 14, left: 12, right: 12,
                  height: 2, zIndex: 1,
                  display: 'flex',
                }}>
                  {JOURNEY_STAGES.slice(0, -1).map((stage, i) => {
                    const next = JOURNEY_STAGES[i + 1];
                    const isGreen = stage.status === 'done' && (next.status === 'done' || next.status === 'active');
                    return (
                      <div key={i} style={{
                        flex: 1, height: 2,
                        background: isGreen ? '#22c55e' : '#e2e8f0',
                      }} />
                    );
                  })}
                </div>
                {/* Nodes */}
                {JOURNEY_STAGES.map((stage, i) => (
                  <JourneyNode key={i} stage={stage} index={i} />
                ))}
              </div>
            </PCard>

            {/* 3-column grid: status (span 2) + eligibility */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr',
              gap: 16, marginBottom: 16,
            }}>
              {/* Status card */}
              <PCard style={{
                padding: '16px 20px',
                ...tileEntrance(frame, fps, 0.8),
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#162768', marginBottom: 6 }}>
                  Welcome back, {CASE.applicant.name}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14, lineHeight: 1.5 }}>
                  Your {CASE.stage} case is progressing. Priority date {CASE.applicant.priorityDate} is now current for {CASE.applicant.category} {CASE.applicant.country}.
                </div>

                {/* Next Step box */}
                <div style={{
                  padding: '12px 14px', borderRadius: 8,
                  background: '#eff6ff', border: '1px solid #bfdbfe',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    Next Step
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e3a5f' }}>
                    Complete I-485 supporting documents and schedule biometrics appointment
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                    Attorney review pending — estimated filing window: April 2026
                  </div>
                </div>

                {/* Quick stats row */}
                <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                  {[
                    { label: 'Case ID', value: CASE.caseId },
                    { label: 'Category', value: `${CASE.applicant.category} ${CASE.applicant.country}` },
                    { label: 'Attorney', value: CASE.attorney.name },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#162768', marginTop: 2 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </PCard>

              {/* Eligibility check card */}
              <PCard style={{
                padding: '16px 20px',
                ...tileEntrance(frame, fps, 1.0),
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#162768' }}>
                    Eligibility Check
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: '#22c55e',
                    background: '#f0fdf4', padding: '2px 8px', borderRadius: 10,
                  }}>
                    {metCount}/{ELIGIBILITY_ITEMS.length} met
                  </div>
                </div>
                {ELIGIBILITY_ITEMS.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 0',
                    borderBottom: i < ELIGIBILITY_ITEMS.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 3,
                      background: item.met ? '#22c55e' : '#fffbeb',
                      border: item.met ? 'none' : '1.5px solid #f59e0b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {item.met ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4.5 7.5L8 3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>!</span>
                      )}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 500,
                      color: item.met ? '#334155' : '#92400e',
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </PCard>
            </div>

            {/* Alert cards row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 16,
              ...tileEntrance(frame, fps, 1.4),
            }}>
              {/* H-1B Expiry Warning */}
              <PCard style={{
                padding: '14px 18px',
                borderLeft: '4px solid #f59e0b',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: '#92400e',
                    background: '#fef3c7', padding: '2px 8px', borderRadius: 10,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    Action Needed
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#162768', marginBottom: 4 }}>
                  H-1B Expires in {CASE.applicant.h1bDaysLeft} Days
                </div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                  Current H-1B status expires {CASE.applicant.h1bExpiry}. Extension filing should begin 90 days prior. Employer and attorney have been notified.
                </div>
              </PCard>

              {/* Priority Date Current */}
              <PCard style={{
                padding: '14px 18px',
                borderLeft: '4px solid #22c55e',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: '#166534',
                    background: '#dcfce7', padding: '2px 8px', borderRadius: 10,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    Good News
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#162768', marginBottom: 4 }}>
                  Priority Date Now Current
                </div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                  Per the February 2026 Visa Bulletin, {CASE.applicant.category} {CASE.applicant.country} priority dates through March 2022 are current. Your date ({CASE.applicant.priorityDate}) qualifies.
                </div>
              </PCard>
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />
    </AbsoluteFill>
  );
};
