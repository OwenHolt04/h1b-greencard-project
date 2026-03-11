import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import {
  BrowserFrame, WebNavBar, AnimatedCursor,
  getCursorState, getCameraState, cameraStyle,
  PCard, tileEntrance, RoleTab, ReadinessRing,
  PRES_BG, CONTENT, NAV_H,
} from './shared';

/**
 * WK4 — Role Perspectives + Close (60s / 1800f)
 *
 * The longest and most important segment.
 * Shows the SingleSource "One Source of Truth" screen with tab switching
 * through Applicant → Employer → Attorney perspectives, then closes
 * on a strong final state.
 *
 * Script beats:
 *   Phase 1 (0-22s): "The same case serves different people. Krishna sees
 *     plain-language guidance... checklist... chatbot..."
 *   Phase 2 (22-35s): "Krishna's employer sees deadlines, extension costs,
 *     continuity risk..."
 *   Phase 3 (35-46s): "His attorney sees filing readiness, evidence gaps,
 *     legal blockers..."
 *   Phase 4 (46-50s): "Same case. Same truth. Different priorities."
 *   Phase 5 (50-60s): Close — "A filing error... avoidable. A missed
 *     extension... avoidable."
 */

// ── Checklist Items ──
const CHECKLIST = [
  { label: 'I-485 Application', status: 'done' },
  { label: 'I-765 (EAD)', status: 'done' },
  { label: 'I-131 (Travel)', status: 'done' },
  { label: 'G-28 (Attorney)', status: 'done' },
  { label: 'Passport copies', status: 'done' },
  { label: 'Photos (2×2)', status: 'done' },
  { label: 'I-693 Medical', status: 'flagged' },
  { label: 'Birth certificate', status: 'done' },
  { label: 'Degree evaluation', status: 'done' },
  { label: 'Tax returns (3yr)', status: 'done' },
  { label: 'Travel history', status: 'missing' },
  { label: 'Employment letter', status: 'done' },
  { label: 'I-140 approval', status: 'done' },
  { label: 'Visa bulletin conf.', status: 'done' },
  { label: 'Filing fee payment', status: 'pending' },
];

// ── Employer Active Cases ──
const ACTIVE_CASES = [
  { name: 'Krishna', role: 'Sr. Product Manager', cat: 'EB-2', stage: 'I-485 Prep', readiness: 72, alert: 'H-1B 102 days', highlight: true },
  { name: 'Aisha Patel', role: 'Staff Engineer', cat: 'EB-1', stage: 'I-140 Pending', readiness: 88, alert: null, highlight: false },
  { name: 'Wei Chen', role: 'Data Scientist', cat: 'EB-2', stage: 'PERM Audit', readiness: 45, alert: null, highlight: false },
  { name: 'Maria Santos', role: 'UX Designer', cat: 'EB-3', stage: 'PWD Pending', readiness: 60, alert: null, highlight: false },
];

// ── Attorney Issues ──
const ATTORNEY_ISSUES = [
  { severity: 'HIGH', color: '#ef4444', bg: '#fef2f2', title: 'SOC / Wage Survey Mismatch', detail: 'Q4 vs Q2 2023 wage survey discrepancy — affects prevailing wage determination', forms: ['ETA-9089', 'I-140'] },
  { severity: 'MED', color: '#f59e0b', bg: '#fffbeb', title: 'Employer Name Format', detail: `"Hewlett-Packard Enterprise" vs "Hewlett Packard Enterprise Company"`, forms: ['I-140', 'I-485', 'ETA-9089'] },
  { severity: 'LOW', color: '#3b82f6', bg: '#eff6ff', title: 'Travel History Gap', detail: '3-week gap in Dec 2023 records — may trigger RFE on I-485', forms: ['I-485'] },
];

// ── Evidence Bundle Items ──
const EVIDENCE = [
  { label: 'I-140 Approval Notice', status: 'done' },
  { label: 'PERM Certification', status: 'done' },
  { label: 'Passport (all pages)', status: 'done' },
  { label: 'I-94 Records', status: 'done' },
  { label: 'Degree + Transcript', status: 'done' },
  { label: 'Credential Evaluation', status: 'done' },
  { label: 'Employment Verification', status: 'done' },
  { label: 'Tax Returns (3yr)', status: 'done' },
  { label: 'W-2 Forms', status: 'done' },
  { label: 'Pay Stubs (recent)', status: 'done' },
  { label: 'Birth Certificate', status: 'done' },
  { label: 'Photos (2×2)', status: 'done' },
  { label: 'G-28 Signed', status: 'done' },
  { label: 'Filing Fees Receipt', status: 'done' },
  { label: 'Civil Documents', status: 'done' },
  { label: 'Affidavit of Support', status: 'done' },
  { label: 'Prior H-1B Approvals', status: 'done' },
  { label: 'EAD/AP Photos', status: 'done' },
  { label: 'Marriage Certificate', status: 'done' },
  { label: 'Employer Financials', status: 'done' },
  { label: 'Wage Survey (Q4)', status: 'done' },
  { label: 'I-693 Medical Exam', status: 'missing' },
  { label: 'Travel Log (complete)', status: 'missing' },
];

// ── Status icon helper ──
const StatusIcon = ({ status, size = 12 }) => {
  const s = {
    done: { bg: '#dcfce7', border: '#22c55e', icon: '✓', color: '#16a34a' },
    flagged: { bg: '#fef3c7', border: '#f59e0b', icon: '!', color: '#d97706' },
    missing: { bg: '#fee2e2', border: '#ef4444', icon: '—', color: '#dc2626' },
    pending: { bg: '#f1f5f9', border: '#cbd5e1', icon: '○', color: '#94a3b8' },
  }[status] || { bg: '#f1f5f9', border: '#cbd5e1', icon: '○', color: '#94a3b8' };

  return (
    <div style={{
      width: size, height: size, borderRadius: 3,
      background: s.bg, border: `1.5px solid ${s.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.7, fontWeight: 700, color: s.color, lineHeight: 1,
    }}>
      {s.icon}
    </div>
  );
};

// ── Readiness color helper ──
const readinessColor = (v) => v >= 80 ? '#22c55e' : v >= 60 ? '#f59e0b' : '#ef4444';

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export const WK4_RolePerspectivesClose = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase boundaries ──
  const P = {
    applicantStart: 0,
    employerStart: 22 * fps,    // 660
    attorneyStart: 35 * fps,    // 1050
    badgeStart: 46 * fps,       // 1380
    closeStart: 50 * fps,       // 1500
    fadeStart: 58.5 * fps,      // last 45 frames → darken
  };

  // ── Active tab ──
  const activeTab = frame < P.employerStart ? 'applicant'
    : frame < P.attorneyStart ? 'employer'
    : frame < P.closeStart ? 'attorney'
    : 'employer';  // Close phase: return to employer tab showing the 102-day deadline

  // ── Tab cross-fade (8 frames out, 8 frames in) ──
  const tabTransitionFrames = 8;
  const getTabContentOpacity = (tabName) => {
    if (tabName !== activeTab) return 0;
    // Fade in at tab start
    let startFrame;
    if (tabName === 'applicant') startFrame = 0;
    else if (tabName === 'attorney') startFrame = P.attorneyStart;
    else startFrame = frame >= P.closeStart ? P.closeStart : P.employerStart;
    return interpolate(frame, [startFrame, startFrame + tabTransitionFrames], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };

  // ── Camera choreography ──
  const camera = getCameraState(frame, fps, [
    // Phase 1: Applicant — very gentle, keep everything visible
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 5, zoom: 1.02, focusX: CONTENT.width / 2, focusY: CONTENT.height * 0.48 },
    { t: 15, zoom: 1.02, focusX: CONTENT.width * 0.55, focusY: CONTENT.height * 0.52 },
    { t: 20, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    // Phase 2: Employer — subtle focus on content
    { t: 23, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 28, zoom: 1.03, focusX: CONTENT.width * 0.55, focusY: CONTENT.height * 0.48 },
    { t: 33, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    // Phase 3: Attorney — subtle focus
    { t: 36, zoom: 1.02, focusX: CONTENT.width * 0.48, focusY: CONTENT.height * 0.48 },
    { t: 42, zoom: 1.02, focusX: CONTENT.width * 0.52, focusY: CONTENT.height * 0.52 },
    { t: 44, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    // Phase 4-5: Hold wide
    { t: 48, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 58, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // ── Cursor choreography ──
  const cursor = getCursorState(frame, fps, [
    // Phase 1: Applicant — hover status, checklist, chatbot
    { t: 0, x: 600, y: 400, visible: false },
    { t: 1, x: 600, y: 400, visible: true },
    { t: 4, x: 500, y: 420, visible: true },
    { t: 8, x: 1350, y: 320, visible: true },
    { t: 12, x: 1400, y: 450, visible: true },
    { t: 16, x: 1350, y: 650, visible: true },
    { t: 19, x: 1350, y: 700, visible: true },
    // Move to Employer tab & click
    { t: 20.5, x: 1530, y: 105, visible: true },
    { t: 22, x: 1530, y: 105, click: true, visible: true },
    // Phase 2: Employer — metrics, table, deadline
    { t: 23.5, x: 600, y: 190, visible: true },
    { t: 26, x: 600, y: 350, visible: true },
    { t: 28, x: 450, y: 340, visible: true },
    { t: 30, x: 1400, y: 350, visible: true },
    { t: 33, x: 1400, y: 420, visible: true },
    // Move to Attorney tab & click
    { t: 33.5, x: 1620, y: 105, visible: true },
    { t: 35, x: 1620, y: 105, click: true, visible: true },
    // Phase 3: Attorney — readiness, issues, evidence
    { t: 36.5, x: 350, y: 250, visible: true },
    { t: 39, x: 450, y: 400, visible: true },
    { t: 41, x: 500, y: 550, visible: true },
    { t: 43, x: 1400, y: 350, visible: true },
    // Phase 4-5: Fade out
    { t: 45, x: 1400, y: 450, visible: true },
    { t: 46, x: 960, y: 540, visible: false },
  ]);

  // ── Badge opacity (Phase 4) ──
  const badgeOpacity = interpolate(frame,
    [P.badgeStart, P.badgeStart + 20, P.closeStart - 10, P.closeStart],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Final darken (last 45 frames) ──
  const darkenOpacity = interpolate(frame,
    [P.fadeStart, P.fadeStart + 45],
    [0, 0.35],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Header height ──
  const HEADER_H = 52;

  // ════════════════════════════════════════════════════
  // TAB CONTENT RENDERERS
  // ════════════════════════════════════════════════════

  // ── APPLICANT TAB ──
  const renderApplicant = () => {
    const o = getTabContentOpacity('applicant');
    if (o <= 0) return null;
    const baseDelay = 0.3;
    return (
      <div style={{ opacity: o, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, padding: '16px 24px', height: '100%' }}>
        {/* Left: Status Card */}
        <PCard style={{ padding: '20px 24px', ...tileEntrance(frame, fps, baseDelay) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#dbeafe', border: '2px solid #3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: '#3b82f6',
            }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#162768' }}>Welcome back, Krishna</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>EB-2 India · I-485 Preparation</div>
            </div>
          </div>

          <div style={{
            fontSize: 12, color: '#334155', lineHeight: 1.6, marginBottom: 16,
          }}>
            Your I-485 is being prepared. Your priority date became current in the February 2026 visa bulletin — filing window is open.
          </div>

          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Next Step
            </div>
            <div style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.5 }}>
              Finalize medical exam (I-693) and travel documentation for I-485 package.
            </div>
          </div>
        </PCard>

        {/* Right: Checklist + Chatbot stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Filing Checklist */}
          <PCard style={{ padding: '14px 16px', flex: '1 1 auto', ...tileEntrance(frame, fps, baseDelay + 0.15) }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#162768' }}>Filing Checklist</div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#d97706',
                background: '#fef3c7', padding: '2px 8px', borderRadius: 10,
              }}>12/15</span>
            </div>

            {/* Progress bar */}
            <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 10, gap: 1 }}>
              <div style={{ flex: 80, background: '#22c55e', borderRadius: '3px 0 0 3px' }} />
              <div style={{ flex: 7, background: '#f59e0b' }} />
              <div style={{ flex: 7, background: '#ef4444' }} />
              <div style={{ flex: 6, background: '#e2e8f0', borderRadius: '0 3px 3px 0' }} />
            </div>

            {/* Checklist grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
              {CHECKLIST.slice(0, 10).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 0' }}>
                  <StatusIcon status={item.status} size={11} />
                  <span style={{
                    fontSize: 9, color: item.status === 'done' ? '#64748b' : '#334155',
                    fontWeight: item.status === 'done' ? 400 : 600,
                    textDecoration: item.status === 'done' ? 'line-through' : 'none',
                  }}>{item.label}</span>
                </div>
              ))}
            </div>
          </PCard>

          {/* Immigration Help (Chatbot) */}
          <PCard style={{ padding: '12px 14px', flex: '0 0 auto', ...tileEntrance(frame, fps, baseDelay + 0.3) }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#162768', marginBottom: 8 }}>
              💬 Immigration Help
            </div>

            {/* Chat bubbles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {/* User question */}
              <div style={{
                alignSelf: 'flex-end', maxWidth: '85%',
                background: '#162768', color: '#ffffff',
                fontSize: 10, padding: '6px 10px', borderRadius: '8px 8px 2px 8px',
                lineHeight: 1.4,
              }}>
                What does priority date current mean?
              </div>
              {/* Bot answer */}
              <div style={{
                alignSelf: 'flex-start', maxWidth: '85%',
                background: '#f1f5f9', color: '#334155',
                fontSize: 10, padding: '6px 10px', borderRadius: '8px 8px 8px 2px',
                lineHeight: 1.4,
              }}>
                It means your place in line has been reached. You can now file your I-485 adjustment of status application.
              </div>
            </div>

            {/* Input */}
            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6,
              padding: '6px 10px', fontSize: 10, color: '#94a3b8',
            }}>
              Ask about your case...
            </div>
          </PCard>
        </div>
      </div>
    );
  };

  // ── EMPLOYER TAB ──
  const renderEmployer = () => {
    const o = getTabContentOpacity('employer');
    if (o <= 0) return null;
    const baseDelay = 22.3;
    return (
      <div style={{ opacity: o, padding: '16px 24px' }}>
        {/* Metrics strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16, ...tileEntrance(frame, fps, baseDelay) }}>
          {[
            { label: 'Active Cases', value: '4', color: '#3b82f6', sub: null },
            { label: 'Avg. Readiness', value: '66%', color: '#f59e0b', sub: null },
            { label: 'RFE Rate', value: '8%', color: '#22c55e', sub: 'Industry: 25%' },
            { label: 'Total Spend', value: '$48K', color: '#64748b', sub: 'FY 2025-26' },
          ].map((m, i) => (
            <PCard key={i} style={{ padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{m.sub}</div>}
            </PCard>
          ))}
        </div>

        {/* 3-col: table (span 2) + right column */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          {/* Active Cases Table */}
          <PCard style={{ padding: 0, overflow: 'hidden', ...tileEntrance(frame, fps, baseDelay + 0.15) }}>
            {/* Table header */}
            <div style={{
              background: '#162768', padding: '10px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>Active Cases</span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>HPE Immigration Portfolio</span>
            </div>
            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1fr 0.7fr 1.1fr',
              padding: '8px 16px', borderBottom: '1px solid #e2e8f0',
              fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              <span>Employee</span><span>Category</span><span>Stage</span><span>Readiness</span><span>Alert</span>
            </div>
            {/* Rows */}
            {ACTIVE_CASES.map((c, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1fr 0.7fr 1.1fr',
                padding: '8px 16px', alignItems: 'center',
                borderBottom: i < ACTIVE_CASES.length - 1 ? '1px solid #f1f5f9' : 'none',
                background: c.highlight ? '#eff6ff' : 'transparent',
                borderLeft: c.highlight ? '3px solid #3b82f6' : '3px solid transparent',
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#162768' }}>{c.name}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{c.role}</div>
                </div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{c.cat}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{c.stage}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 28, height: 5, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden',
                  }}>
                    <div style={{ width: `${c.readiness}%`, height: '100%', background: readinessColor(c.readiness), borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: readinessColor(c.readiness) }}>{c.readiness}%</span>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600,
                  color: c.alert ? '#d97706' : '#94a3b8',
                }}>{c.alert || '—'}</span>
              </div>
            ))}
          </PCard>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* H-1B Deadline Card */}
            <PCard style={{ padding: '16px', textAlign: 'center', border: '1px solid #fde68a', ...tileEntrance(frame, fps, baseDelay + 0.25) }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>🛡️</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>102</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 2 }}>days until expiry</div>
              <div style={{ fontSize: 10, color: '#162768', fontWeight: 600, marginTop: 8 }}>Krishna · June 15, 2026</div>
              <div style={{
                fontSize: 9, color: '#94a3b8', marginTop: 6,
                padding: '4px 8px', background: '#fffbeb', borderRadius: 4,
              }}>
                Auto-trigger: extension filed at 90 days
              </div>
            </PCard>

            {/* Action Items */}
            <PCard style={{ padding: '14px 16px', ...tileEntrance(frame, fps, baseDelay + 0.35) }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#162768', marginBottom: 8 }}>Action Items</div>
              {[
                { icon: '🔴', label: 'Resolve employer name mismatch', urgent: true },
                { icon: '🟡', label: 'Approve I-485 support letter', urgent: true },
                { icon: '🔵', label: 'Review Q1 immigration budget', urgent: false },
              ].map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
                }}>
                  <span style={{ fontSize: 10 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, color: a.urgent ? '#334155' : '#64748b', fontWeight: a.urgent ? 600 : 400 }}>{a.label}</span>
                </div>
              ))}
            </PCard>
          </div>
        </div>
      </div>
    );
  };

  // ── ATTORNEY TAB ──
  const renderAttorney = () => {
    const o = getTabContentOpacity('attorney');
    if (o <= 0) return null;
    const baseDelay = 35.3;
    return (
      <div style={{ opacity: o, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, padding: '16px 24px' }}>
        {/* Left: Readiness + Issues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Readiness header */}
          <PCard style={{ padding: '16px 20px', ...tileEntrance(frame, fps, baseDelay) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ReadinessRing score={72} size={64} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#162768' }}>Filing package: 3 items to resolve</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>I-485 concurrent filing · Est. 5-7 days to filing-ready</div>
                <div style={{
                  fontSize: 10, fontWeight: 600, color: '#d97706', marginTop: 4,
                  background: '#fffbeb', padding: '2px 8px', borderRadius: 4, display: 'inline-block',
                }}>
                  Time-sensitive — EB-2 India date may retrogress
                </div>
              </div>
            </div>
          </PCard>

          {/* Issue cards */}
          {ATTORNEY_ISSUES.map((issue, i) => (
            <PCard key={i} style={{
              padding: '12px 16px',
              borderLeft: `3px solid ${issue.color}`,
              ...tileEntrance(frame, fps, baseDelay + 0.12 + i * 0.1),
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: issue.color,
                  background: `${issue.color}15`, padding: '2px 6px', borderRadius: 3,
                }}>{issue.severity}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{issue.title}</span>
              </div>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6, lineHeight: 1.4 }}>{issue.detail}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {issue.forms.map((f, j) => (
                  <span key={j} style={{
                    fontSize: 9, padding: '1px 6px', borderRadius: 3,
                    background: '#f1f5f9', color: '#64748b', fontWeight: 600,
                  }}>{f}</span>
                ))}
              </div>
            </PCard>
          ))}
        </div>

        {/* Right: Evidence + Next Steps + Filing Target */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Evidence Bundle */}
          <PCard style={{ padding: '14px 16px', flex: '1 1 auto', ...tileEntrance(frame, fps, baseDelay + 0.15) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#162768' }}>Evidence Bundle</div>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: '#64748b', background: '#f1f5f9',
                padding: '2px 8px', borderRadius: 10,
              }}>21/23</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {EVIDENCE.slice(0, 12).map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '1px 0' }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: e.status === 'done' ? '#22c55e' : e.status === 'missing' ? '#ef4444' : '#f59e0b',
                  }} />
                  <span style={{ fontSize: 9, color: e.status === 'done' ? '#64748b' : '#334155', fontWeight: e.status === 'done' ? 400 : 600 }}>
                    {e.label}
                  </span>
                </div>
              ))}
              <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2, fontStyle: 'italic' }}>+11 more collected</div>
            </div>
          </PCard>

          {/* Attorney Next Steps */}
          <PCard style={{ padding: '12px 16px', ...tileEntrance(frame, fps, baseDelay + 0.3) }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#162768', marginBottom: 6 }}>Next Steps</div>
            {[
              'Resolve SOC / wage survey mismatch',
              'Standardize employer name across forms',
              'Confirm travel history (Dec 2023)',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '3px 0' }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: '#162768',
                  background: '#e2e8f0', borderRadius: '50%',
                  width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ fontSize: 10, color: '#334155', lineHeight: 1.4 }}>{step}</span>
              </div>
            ))}
          </PCard>

          {/* Filing Target */}
          <PCard style={{
            padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0',
            ...tileEntrance(frame, fps, baseDelay + 0.4),
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12 }}>🎯</span>
              Target: file March 17-20 while date remains current
            </div>
          </PCard>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS,
    }}>
      <BrowserFrame>
        <div style={cameraStyle(camera)}>
          <WebNavBar activeTab="Roles" />

          {/* Content area below nav */}
          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            background: PRES_BG,
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header row: title + role tabs */}
            <div style={{
              height: HEADER_H, padding: '0 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid #e2e8f0',
              background: '#ffffff',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#162768' }}>One Source of Truth</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <RoleTab label="Applicant" icon="👤" active={activeTab === 'applicant'} />
                <RoleTab label="Employer" icon="🏢" active={activeTab === 'employer'} />
                <RoleTab label="Attorney" icon="⚖️" active={activeTab === 'attorney'} />
              </div>
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {renderApplicant()}
              {renderEmployer()}
              {renderAttorney()}
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* Phase 4 badge: "Same case. Same truth. Different priorities." */}
      {badgeOpacity > 0 && (
        <div style={{
          position: 'absolute', bottom: 18, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          zIndex: 60, opacity: badgeOpacity,
        }}>
          <div style={{
            padding: '8px 28px', borderRadius: 20,
            background: 'rgba(14, 26, 74, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(248, 242, 182, 0.2)',
          }}>
            <span style={{
              fontSize: 16, fontWeight: 600,
              color: '#f8f2b6', fontFamily: FONT_SANS,
              letterSpacing: '0.02em',
            }}>
              Same case. Same truth. Different priorities.
            </span>
          </div>
        </div>
      )}

      {/* Phase 5 final darken overlay */}
      {darkenOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(14, 26, 74, ${darkenOpacity})`,
          zIndex: 55, pointerEvents: 'none',
        }} />
      )}
    </AbsoluteFill>
  );
};
