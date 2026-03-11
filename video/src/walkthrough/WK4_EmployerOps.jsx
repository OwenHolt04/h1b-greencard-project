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
 * WK4 — Employer Operations Dashboard (22s / 660f)
 *
 * Script beats:
 *   "employer sees deadlines, extension costs, and continuity risk
 *    — every month of delay can cause another H-1B extension at $4-10K"
 *   "Problems surfaced early. Ninety days out."
 *
 * Visual: Employer operations dashboard with active cases, metrics,
 * deadline protection, cost tracking, action items
 */

const ACTIVE_CASES = [
  { name: 'Krishna', role: 'Sr. Product Manager', cat: 'EB-2', stage: 'I-485 Prep', stageColor: '#3b82f6', readiness: 72, alert: 'H-1B expiry 102 days', alertColor: '#f59e0b', highlight: true },
  { name: 'Aisha Patel', role: 'Staff Engineer', cat: 'EB-1', stage: 'I-140 Pending', stageColor: '#f59e0b', readiness: 88, alert: 'Premium processing filed', alertColor: '#3b82f6', highlight: false },
  { name: 'Wei Chen', role: 'Data Scientist', cat: 'EB-2', stage: 'PERM Audit', stageColor: '#ef4444', readiness: 45, alert: 'DOL audit response due', alertColor: '#ef4444', highlight: false },
  { name: 'Maria Santos', role: 'UX Designer', cat: 'EB-3', stage: 'PWD Pending', stageColor: '#94a3b8', readiness: 60, alert: 'On track', alertColor: '#22c55e', highlight: false },
];

const PORTFOLIO_METRICS = [
  { label: 'Active Cases', value: '4', sub: '' },
  { label: 'Avg Readiness', value: '66%', sub: '' },
  { label: 'RFE Rate (YTD)', value: '8%', sub: 'vs 25% industry' },
  { label: 'Total Spend', value: '$48K', sub: 'FY 2025-26' },
];

const COST_PHASES = [
  { phase: 'PERM', cost: '$4,000\u2013$6,000', status: 'Paid', statusColor: '#16a34a' },
  { phase: 'I-140', cost: '$3,000\u2013$5,000', status: 'Paid', statusColor: '#16a34a' },
  { phase: 'I-485', cost: '$5,000\u2013$7,000', status: 'Upcoming', statusColor: '#f59e0b' },
  { phase: 'H-1B Ext', cost: '$2,500\u2013$4,000', status: 'Recurring', statusColor: '#3b82f6' },
];

const ACTION_ITEMS = [
  { urgent: true, text: 'Approve H-1B extension budget \u2014 Krishna (102 days)' },
  { urgent: true, text: 'Respond to DOL PERM audit \u2014 Chen (deadline 3/20)' },
  { urgent: false, text: 'Sign employment verification letter \u2014 Krishna' },
  { urgent: false, text: 'Review premium processing invoice \u2014 Patel' },
];

export const WK4_EmployerOps = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase markers
  const P = {
    metricsIn: 2 * fps,
    tableFocus: 5 * fps,
    deadlineFocus: 12 * fps,
    autoTrigger: 16 * fps,
    managedFlip: 18 * fps,
    metricOverlay: 20 * fps,
  };

  const managed = frame >= P.managedFlip;

  // Camera
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 3, zoom: 1.1, focusX: CONTENT.width / 2, focusY: 200 },    // metrics strip
    { t: 5, zoom: 1.15, focusX: CONTENT.width * 0.42, focusY: 400 }, // cases table
    { t: 10, zoom: 1.15, focusX: CONTENT.width * 0.42, focusY: 400 },
    { t: 12, zoom: 1.3, focusX: CONTENT.width * 0.82, focusY: 350 },  // deadline card
    { t: 18, zoom: 1.3, focusX: CONTENT.width * 0.82, focusY: 350 },
    { t: 20, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 3, x: 500, y: 180, visible: true },          // hover metrics
    { t: 5, x: 400, y: 330, visible: true },           // hover Krishna's row
    { t: 8, x: 400, y: 400, visible: true },           // hover other cases
    { t: 11, x: 1400, y: 300, visible: true },          // move to deadline card
    { t: 14, x: 1400, y: 440, visible: true },          // hover auto-trigger button
    { t: 16, x: 1400, y: 440, click: true, visible: true }, // click activate
    { t: 18, x: 1400, y: 400, visible: true },
    { t: 21, x: 960, y: 500, visible: false },
  ]);

  // Metric overlay
  const metricOverlayIn = spring({ frame, fps, config: { damping: 200 }, delay: P.metricOverlay });

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
          }}>
            {/* Title */}
            <div style={{ fontSize: 20, fontWeight: 700, color: C.navy900, marginBottom: 12 }}>
              Employer Operations {'\u2014'} {CASE.employer.shortName} Immigration Portfolio
            </div>

            {/* ═══ METRICS STRIP ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
              {PORTFOLIO_METRICS.map((m, i) => {
                const delay = Math.round(P.metricsIn) + i * 6;
                const mIn = spring({ frame, fps, config: { damping: 200 }, delay });
                return (
                  <div key={i} style={{
                    opacity: interpolate(mIn, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(mIn, [0, 1], [8, 0])}px)`,
                  }}>
                    <WebCard style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: C.navy900 }}>{m.value}</div>
                      {m.sub && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{m.sub}</div>}
                    </WebCard>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
              {/* ═══ LEFT: ACTIVE CASES TABLE ═══ */}
              <div>
                <WebCard style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{
                    background: C.navy900, color: '#ffffff', padding: '10px 16px',
                    fontSize: 14, fontWeight: 700,
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>Active Cases</span>
                    <span style={{ fontSize: 11, opacity: 0.6 }}>4 sponsored employees</span>
                  </div>

                  {/* Column headers */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '200px 80px 120px 100px 1fr',
                    gap: 8, padding: '6px 16px',
                    background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                    fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    <span>Employee</span>
                    <span>Category</span>
                    <span>Stage</span>
                    <span>Readiness</span>
                    <span>Alert</span>
                  </div>

                  {/* Rows */}
                  {ACTIVE_CASES.map((c, i) => {
                    const rowDelay = Math.round(P.tableFocus) + i * 8;
                    const rowIn = spring({ frame, fps, config: { damping: 200 }, delay: rowDelay });
                    return (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '200px 80px 120px 100px 1fr',
                        gap: 8, padding: '10px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        background: c.highlight ? '#eff6ff' : 'transparent',
                        borderLeft: c.highlight ? '3px solid #3b82f6' : '3px solid transparent',
                        opacity: interpolate(rowIn, [0, 1], [0, 1]),
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy900 }}>{c.name}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>{c.role}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', paddingTop: 4 }}>{c.cat}</div>
                        <div>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                            background: c.stageColor + '15', color: c.stageColor,
                          }}>{c.stage}</span>
                        </div>
                        <div style={{ paddingTop: 4 }}>
                          <div style={{
                            width: 60, height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${c.readiness}%`, height: '100%', borderRadius: 3,
                              background: c.readiness >= 80 ? '#22c55e' : c.readiness >= 60 ? '#f59e0b' : '#ef4444',
                            }} />
                          </div>
                          <span style={{ fontSize: 9, color: '#94a3b8' }}>{c.readiness}%</span>
                        </div>
                        <div style={{ fontSize: 11, color: c.alertColor, fontWeight: 600, paddingTop: 4 }}>{c.alert}</div>
                      </div>
                    );
                  })}
                </WebCard>

                {/* Cost summary */}
                <WebCard style={{ marginTop: 12 }}>
                  <SectionLabel>Sponsorship Cost — {CASE.applicant.name}</SectionLabel>
                  {COST_PHASES.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '5px 0',
                      borderBottom: i < COST_PHASES.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{c.phase}</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.navy900 }}>{c.cost}</span>
                        <span style={{ display: 'block', fontSize: 9, color: c.statusColor, fontWeight: 600 }}>{c.status}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, color: C.navy900 }}>
                    Total: $15,000{'\u2013'}$22,000
                  </div>
                </WebCard>
              </div>

              {/* ═══ RIGHT: DEADLINE + ACTIONS ═══ */}
              <div>
                {/* Deadline protection */}
                <WebCard style={{
                  borderTop: `3px solid ${managed ? '#22c55e' : '#f59e0b'}`,
                  marginBottom: 12,
                }}>
                  <SectionLabel>H-1B Deadline Protection</SectionLabel>

                  {/* Countdown */}
                  <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 44, fontWeight: 700, color: managed ? '#22c55e' : '#f59e0b' }}>102</span>
                    <div style={{ fontSize: 12, color: '#64748b' }}>days until expiry</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{CASE.applicant.name} · June 15, 2026</div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{
                      width: '72%', height: '100%', borderRadius: 3,
                      background: managed ? '#22c55e' : '#f59e0b',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#94a3b8', marginBottom: 10 }}>
                    <span>Today</span><span>Expiry</span>
                  </div>

                  {/* At-risk / Managed state */}
                  {!managed ? (
                    <>
                      <div style={{
                        padding: '6px 10px', borderRadius: 6,
                        background: '#fffbeb', border: '1px solid #f59e0b30',
                        fontSize: 10, color: '#92400e', marginBottom: 8,
                      }}>
                        Without CaseBridge: manual tracking, missed deadlines, rush fees ($5,000+)
                      </div>
                      <div style={{
                        padding: '8px 14px', borderRadius: 6, textAlign: 'center',
                        background: C.navy900, color: '#ffffff', fontSize: 12, fontWeight: 700,
                      }}>
                        Activate Auto-Extension
                      </div>
                    </>
                  ) : (
                    <div style={{
                      padding: '8px 10px', borderRadius: 6,
                      background: '#f0fdf4', border: '1px solid #22c55e30',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: '#22c55e' }}>{'\u2713'}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#166534' }}>Auto-triggered at 90 days</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#334155' }}>
                        Trigger: Mar 17, 2026 · Cost: $2,500–4,000 · HR: Rachel Torres
                      </div>
                    </div>
                  )}
                </WebCard>

                {/* Action items */}
                <WebCard>
                  <SectionLabel>Action Items</SectionLabel>
                  {ACTION_ITEMS.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                      padding: '6px 0',
                      borderBottom: i < ACTION_ITEMS.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 3, flexShrink: 0, marginTop: 2,
                        background: item.urgent ? '#fef2f2' : '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 8, color: item.urgent ? '#ef4444' : '#94a3b8', fontWeight: 700 }}>
                          {item.urgent ? '!' : '\u2022'}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 11, color: '#334155', fontWeight: item.urgent ? 600 : 400, lineHeight: 1.4,
                      }}>{item.text}</span>
                    </div>
                  ))}
                </WebCard>
              </div>
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* "Surfaced 90 days out" metric */}
      {frame > P.metricOverlay && (
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          textAlign: 'center', zIndex: 60,
          opacity: interpolate(metricOverlayIn, [0, 1], [0, 1]),
        }}>
          <span style={{
            display: 'inline-block', padding: '8px 24px', borderRadius: 10,
            background: 'rgba(248,242,182,0.1)', border: '1px solid rgba(248,242,182,0.25)',
            fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT_SANS,
          }}>
            Surfaced 90 days out — not discovered at expiry
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
