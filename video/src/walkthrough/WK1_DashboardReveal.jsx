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
 * WK1 — One Source of Truth (24s / 720f)
 *
 * Script: "Everything centers on one shared case record. One workspace
 *  for Krishna's case — forms, timeline, agency progress, alerts,
 *  checklists, and next steps. Not four portals and a mailbox."
 *
 * Then tabs toggle to show applicant / employer / attorney priorities.
 * Employer tab shows portfolio ops (active cases, deadlines, costs).
 * Attorney tab shows filing readiness, issues, evidence status.
 *
 * Phases:
 *   0-3s:   Case header + timeline appear
 *   3-8s:   Agency status + alerts + checklist visible
 *   8-11s:  Cursor clicks "Applicant" tab — plain-language + checklist + chatbot
 *   11-15s: Cursor clicks "Employer" tab — portfolio ops + deadline protection
 *   15-19s: Cursor clicks "Attorney" tab — readiness, issues, evidence
 *   19-24s: Zoom out, "Same case. Same truth." badge
 */

const STAGES = [
  { label: 'PWD', status: 'done' },
  { label: 'PERM', status: 'done' },
  { label: 'I-140', status: 'done' },
  { label: 'I-485', status: 'active' },
  { label: 'Biometrics', status: 'pending' },
  { label: 'EAD/AP', status: 'pending' },
  { label: 'Interview', status: 'pending' },
  { label: 'Approval', status: 'pending' },
];

const AGENCIES = [
  { name: 'DOL', status: 'PERM Certified', color: '#16a34a', date: 'Nov 2023' },
  { name: 'USCIS', status: 'I-140 Approved · I-485 Pending', color: '#2563eb', date: 'Mar 2026' },
  { name: 'DOS', status: 'Priority Date Current', color: '#9333ea', date: 'Feb 2026' },
];

const ALERTS = [
  { title: 'H-1B Expiry', detail: '102 days remaining', severity: 'amber' },
  { title: 'Priority Date Current', detail: 'Filing window open', severity: 'green' },
];

const ROLE_TABS = ['Applicant', 'Employer', 'Attorney'];

// Applicant view content
const APPLICANT_ITEMS = [
  { icon: '\u2713', text: 'Your I-485 is being prepared. Priority date is current.', color: '#16a34a' },
  { icon: '\u25CB', text: 'Next: Upload medical exam (I-693) and travel history.', color: '#3b82f6' },
  { icon: '\u26A0', text: 'Discuss international travel plans before booking.', color: '#f59e0b' },
];

const CHECKLIST_ITEMS = [
  { name: 'I-485 (signed)', s: 'done' },
  { name: 'I-765 (EAD)', s: 'done' },
  { name: 'I-131 (AP)', s: 'done' },
  { name: 'Medical (I-693)', s: 'done' },
  { name: 'Birth certificate', s: 'done' },
  { name: 'Tax returns (3yr)', s: 'done' },
  { name: 'Passport copies', s: 'done' },
  { name: 'Degree evaluation', s: 'done' },
  { name: 'I-94 record', s: 'done' },
  { name: 'Photo (2x2)', s: 'done' },
  { name: 'Prior H-1B approvals', s: 'done' },
  { name: 'Marriage cert', s: 'done' },
  { name: 'Employment verification', s: 'missing' },
  { name: 'Travel history (5yr)', s: 'flagged' },
  { name: 'Employment letter', s: 'pending' },
];

// Employer view — portfolio metrics + active cases + deadline
const EMPLOYER_METRICS = [
  { label: 'Active Cases', value: '4', color: '#2563eb' },
  { label: 'Avg. Readiness', value: '66%', color: '#f59e0b' },
  { label: 'RFE Rate', value: '8%', color: '#16a34a' },
  { label: 'Total Spend', value: '$48K', color: '#64748b' },
];

const EMPLOYER_CASES = [
  { name: 'Krishna', role: 'Sr. PM', stage: 'I-485 Prep', readiness: 72, alert: 'H-1B 102 days', highlight: true },
  { name: 'A. Patel', role: 'Staff Eng', stage: 'I-140 Pending', readiness: 88, alert: 'Premium filed', highlight: false },
  { name: 'W. Chen', role: 'Data Sci', stage: 'PERM Audit', readiness: 45, alert: 'DOL audit due', highlight: false },
];

// Attorney view content
const ATTORNEY_ITEMS = [
  { severity: 'HIGH', title: 'SOC / Wage Mismatch', detail: 'Q4 vs Q2 survey discrepancy', color: '#ef4444' },
  { severity: 'MED', title: 'Employer Name Format', detail: '"Hewlett-Packard" vs "Hewlett Packard"', color: '#f59e0b' },
  { severity: 'LOW', title: 'Travel History Gap', detail: '3-week gap Dec 2023', color: '#3b82f6' },
];

export const WK1_DashboardReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Role tab state: applicant at 8s, employer at 11s, attorney at 15s
  const activeRole = frame >= 15 * fps ? 2 : frame >= 11 * fps ? 1 : frame >= 8 * fps ? 0 : -1;
  const showRoleTabs = frame >= 7.5 * fps;

  // Camera
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 2, zoom: 1.15, focusX: CONTENT.width / 2, focusY: 180 },    // timeline
    { t: 5, zoom: 1.1, focusX: CONTENT.width / 2, focusY: 350 },     // agencies + alerts
    { t: 7.5, zoom: 1.05, focusX: CONTENT.width / 2, focusY: 420 },  // role tabs appear
    { t: 8.5, zoom: 1.08, focusX: CONTENT.width * 0.5, focusY: 500 }, // applicant view (show all 3 cols)
    { t: 11.5, zoom: 1.08, focusX: CONTENT.width * 0.5, focusY: 500 },// employer view
    { t: 15.5, zoom: 1.08, focusX: CONTENT.width * 0.5, focusY: 500 },// attorney view
    { t: 19, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 3, x: 600, y: 200, visible: true },              // hover timeline
    { t: 5, x: 400, y: 340, visible: true },               // hover agencies
    { t: 7, x: 1500, y: 340, visible: true },              // hover alerts
    { t: 8, x: 340, y: 440, visible: true },               // move to Applicant tab
    { t: 8.3, x: 340, y: 440, click: true, visible: true },
    { t: 10, x: 500, y: 560, visible: true },              // hover applicant content
    { t: 11, x: 520, y: 440, visible: true },              // move to Employer tab
    { t: 11.3, x: 520, y: 440, click: true, visible: true },
    { t: 14, x: 500, y: 560, visible: true },              // hover employer content
    { t: 15, x: 700, y: 440, visible: true },              // move to Attorney tab
    { t: 15.3, x: 700, y: 440, click: true, visible: true },
    { t: 18, x: 500, y: 560, visible: true },              // hover attorney content
    { t: 19, x: 960, y: 500, visible: true },
    { t: 23, x: 960, y: 500, visible: false },
  ]);

  // Badge
  const badgeIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(20 * fps) });

  const alertColors = { amber: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }, green: { bg: '#dcfce7', border: '#22c55e', text: '#166534' } };

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
            padding: '16px 24px',
            overflow: 'hidden',
          }}>
            {/* ── Case Header + Timeline + Agencies — only before/during Applicant tab ── */}
            {activeRole <= 0 && (
              <>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 14,
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.06em' }}>
                      CASE {CASE.caseId}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: C.navy900 }}>
                      {CASE.applicant.name}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      {CASE.employer.name} · {CASE.attorney.firm}
                    </div>
                  </div>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    border: '4px solid #f59e0b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>72</span>
                  </div>
                </div>

                <WebCard style={{ marginBottom: 12, padding: '12px 16px' }}>
                  <SectionLabel>Case Journey</SectionLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {STAGES.map((s, i) => (
                      <React.Fragment key={i}>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%', margin: '0 auto 4px',
                            background: s.status === 'done' ? '#16a34a' : s.status === 'active' ? C.navy900 : '#e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {s.status === 'done' && <span style={{ color: '#fff', fontSize: 9 }}>{'\u2713'}</span>}
                            {s.status === 'active' && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <div style={{
                            fontSize: 9, fontWeight: 600,
                            color: s.status === 'active' ? C.navy900 : s.status === 'done' ? '#16a34a' : '#94a3b8',
                          }}>{s.label}</div>
                        </div>
                        {i < STAGES.length - 1 && (
                          <div style={{
                            flex: 1, height: 2, marginBottom: 16,
                            background: s.status === 'done' ? '#16a34a' : '#e2e8f0',
                          }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </WebCard>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 10, marginBottom: 12 }}>
                  {AGENCIES.map((a, i) => (
                    <WebCard key={i} style={{ padding: '10px 14px', borderTop: `3px solid ${a.color}` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy900 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{a.status}</div>
                      <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 4 }}>{a.date}</div>
                    </WebCard>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  {ALERTS.map((a, i) => {
                    const c = alertColors[a.severity];
                    return (
                      <WebCard key={i} style={{
                        flex: 1, padding: '8px 14px',
                        background: c.bg, borderColor: c.border, borderLeftWidth: 3,
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{a.title}</div>
                        <div style={{ fontSize: 10, color: c.text, opacity: 0.7 }}>{a.detail}</div>
                      </WebCard>
                    );
                  })}
                  <WebCard style={{ flex: 1.5, padding: '8px 14px', background: '#f8fafc' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>Next Step</div>
                    <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.4 }}>
                      Finalize I-485 package. Attorney reviewing 3 items. Extension auto-triggers at 90 days.
                    </div>
                  </WebCard>
                </div>
              </>
            )}

            {/* ── Role Tabs ── */}
            {showRoleTabs && (
              <div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                  {ROLE_TABS.map((tab, i) => (
                    <div key={tab} style={{
                      padding: '7px 18px', borderRadius: 7,
                      fontSize: 13, fontWeight: 700,
                      color: activeRole === i ? '#ffffff' : '#64748b',
                      background: activeRole === i ? C.navy900 : '#f1f5f9',
                      border: activeRole === i ? 'none' : '1px solid #e2e8f0',
                    }}>{tab}</div>
                  ))}
                  <div style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#94a3b8',
                    display: 'flex', alignItems: 'center',
                  }}>
                    Same case. Different priorities.
                  </div>
                </div>

                {/* ── APPLICANT VIEW ── */}
                {activeRole === 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 10 }}>
                    {/* Plain-language guidance */}
                    <WebCard style={{ background: '#eff6ff', borderColor: '#3b82f640' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy900, marginBottom: 8 }}>
                        Your Status — Plain Language
                      </div>
                      {APPLICANT_ITEMS.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0',
                          borderBottom: i < APPLICANT_ITEMS.length - 1 ? '1px solid #e2e8f020' : 'none',
                        }}>
                          <span style={{ fontSize: 11, color: item.color, marginTop: 1 }}>{item.icon}</span>
                          <span style={{ fontSize: 11, color: '#334155', lineHeight: 1.4 }}>{item.text}</span>
                        </div>
                      ))}
                    </WebCard>

                    {/* Checklist */}
                    <WebCard>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy900 }}>Filing Checklist</div>
                        <span style={{
                          padding: '2px 8px', borderRadius: 4,
                          background: '#fef3c7', fontSize: 11, fontWeight: 700, color: '#92400e',
                        }}>12/15</span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 5, borderRadius: 3, background: '#e2e8f0', marginBottom: 8, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', height: '100%' }}>
                          <div style={{ width: '80%', background: '#22c55e' }} />
                          <div style={{ width: '6.7%', background: '#f59e0b' }} />
                          <div style={{ width: '6.7%', background: '#ef4444' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px' }}>
                        {CHECKLIST_ITEMS.slice(0, 10).map((doc, i) => {
                          const statusIcon = doc.s === 'done' ? '\u2713' : doc.s === 'missing' ? '\u2014' : doc.s === 'flagged' ? '!' : '\u25CB';
                          const statusColor = doc.s === 'done' ? '#16a34a' : doc.s === 'missing' ? '#ef4444' : doc.s === 'flagged' ? '#f59e0b' : '#94a3b8';
                          return (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0',
                              fontSize: 9, color: doc.s === 'done' ? '#94a3b8' : '#334155',
                            }}>
                              <span style={{
                                width: 12, height: 12, borderRadius: 2, flexShrink: 0,
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                background: `${statusColor}15`, color: statusColor, fontSize: 7, fontWeight: 700,
                              }}>{statusIcon}</span>
                              {doc.name}
                            </div>
                          );
                        })}
                      </div>
                    </WebCard>

                    {/* Chatbot / Help */}
                    <WebCard style={{ background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy900, marginBottom: 8 }}>
                        {'\uD83D\uDCAC'} Immigration Help
                      </div>
                      <div style={{
                        flex: 1, background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0',
                        padding: '8px 10px', marginBottom: 8,
                      }}>
                        <div style={{
                          padding: '6px 10px', borderRadius: '10px 10px 10px 2px',
                          background: '#eff6ff', marginBottom: 6, fontSize: 10, color: '#334155', lineHeight: 1.4,
                        }}>
                          What does "priority date current" mean?
                        </div>
                        <div style={{
                          padding: '6px 10px', borderRadius: '10px 10px 2px 10px',
                          background: '#f0fdf4', fontSize: 10, color: '#334155', lineHeight: 1.4,
                          marginLeft: 20,
                        }}>
                          It means your place in line has been reached. You can now file your I-485 adjustment of status application.
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 10px', borderRadius: 6,
                        background: '#ffffff', border: '1px solid #e2e8f0',
                        fontSize: 10, color: '#94a3b8',
                      }}>
                        Ask about your case...
                      </div>
                    </WebCard>
                  </div>
                )}

                {/* ── EMPLOYER VIEW — Portfolio Ops ── */}
                {activeRole === 1 && (
                  <div>
                    {/* Metrics strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
                      {EMPLOYER_METRICS.map((m, i) => (
                        <WebCard key={i} style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{m.label}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                        </WebCard>
                      ))}
                    </div>
                    {/* Active cases + deadline */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 10 }}>
                      {/* Cases table */}
                      <WebCard style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{
                          padding: '6px 12px', background: C.navy900, color: '#fff',
                          fontSize: 11, fontWeight: 700,
                        }}>Active Cases</div>
                        {EMPLOYER_CASES.map((c, i) => (
                          <div key={i} style={{
                            display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr',
                            gap: 4, padding: '6px 12px', fontSize: 10, alignItems: 'center',
                            borderBottom: '1px solid #f1f5f9',
                            background: c.highlight ? '#eff6ff' : 'transparent',
                            borderLeft: c.highlight ? '3px solid #3b82f6' : '3px solid transparent',
                          }}>
                            <div>
                              <span style={{ fontWeight: 600, color: C.navy900 }}>{c.name}</span>
                              <div style={{ fontSize: 8, color: '#94a3b8' }}>{c.role}</div>
                            </div>
                            <span style={{ fontSize: 9, color: '#64748b' }}>{c.stage}</span>
                            <span style={{ fontSize: 9, fontWeight: 600, color: c.readiness >= 70 ? '#f59e0b' : '#ef4444' }}>{c.readiness}%</span>
                            <span style={{ fontSize: 9, color: c.highlight ? '#f59e0b' : '#64748b' }}>{c.alert}</span>
                          </div>
                        ))}
                      </WebCard>
                      {/* Deadline card */}
                      <WebCard style={{ textAlign: 'center', borderTop: '3px solid #f59e0b' }}>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>H-1B Deadline</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b', marginBottom: 2 }}>102</div>
                        <div style={{ fontSize: 9, color: '#64748b', marginBottom: 8 }}>days until expiry</div>
                        <div style={{
                          padding: '4px 8px', borderRadius: 4,
                          background: '#fef3c7', fontSize: 9, color: '#92400e',
                        }}>Auto-triggers at 90 days · $2.5K–4K</div>
                      </WebCard>
                    </div>
                  </div>
                )}

                {/* ── ATTORNEY VIEW — Readiness + Issues + Evidence ── */}
                {activeRole === 2 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 10 }}>
                    {/* Left: readiness header + issues */}
                    <div>
                      {/* Readiness header */}
                      <WebCard style={{ marginBottom: 8, padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            border: '4px solid #f59e0b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b' }}>72</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy900 }}>Filing package: 3 items to resolve</div>
                            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>I-485 concurrent filing · Est. 5–7 days to filing-ready</div>
                            <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 600, marginTop: 2 }}>Time-sensitive — EB-2 India date may retrogress</div>
                          </div>
                        </div>
                      </WebCard>
                      {/* Issues */}
                      {ATTORNEY_ITEMS.map((issue, i) => (
                        <WebCard key={i} style={{
                          padding: '8px 12px', marginBottom: 6,
                          borderLeft: `3px solid ${issue.color}`,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, color: issue.color,
                              background: `${issue.color}15`, padding: '2px 6px', borderRadius: 3,
                            }}>{issue.severity}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{issue.title}</span>
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{issue.detail}</div>
                        </WebCard>
                      ))}
                    </div>
                    {/* Right: evidence + next steps */}
                    <div>
                      <WebCard style={{ marginBottom: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Evidence Bundle</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>
                          21 <span style={{ color: '#94a3b8', fontWeight: 400 }}>/</span> 23
                        </div>
                        {[
                          { name: 'Employment verification', status: 'missing', c: '#ef4444' },
                          { name: 'Travel history (Dec 2023)', status: 'flagged', c: '#f59e0b' },
                          { name: 'Passport + stamps', status: 'done', c: '#16a34a' },
                          { name: 'Degree evaluation', status: 'done', c: '#16a34a' },
                        ].map((e, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0', fontSize: 9 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.c, flexShrink: 0 }} />
                            <span style={{ color: e.status === 'done' ? '#94a3b8' : '#334155' }}>{e.name}</span>
                          </div>
                        ))}
                      </WebCard>
                      <WebCard style={{ padding: '8px 12px', background: '#f0fdf4', borderColor: '#22c55e40' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#166534' }}>Target: file March 17–20</div>
                        <div style={{ fontSize: 9, color: '#166534', opacity: 0.7, marginTop: 2 }}>while EB-2 India date remains current</div>
                      </WebCard>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* "Same case. Same truth." badge */}
      {frame > 20 * fps && (
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          textAlign: 'center', zIndex: 60,
          opacity: interpolate(badgeIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(badgeIn, [0, 1], [10, 0])}px)`,
        }}>
          <span style={{
            display: 'inline-block',
            padding: '8px 24px', borderRadius: 10,
            background: 'rgba(248,242,182,0.1)', border: '1px solid rgba(248,242,182,0.25)',
            fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT_SANS,
          }}>
            Same case. Same truth. Different priorities.
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
