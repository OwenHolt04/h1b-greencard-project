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
 * WK1 — Dashboard Reveal (24s / 720f)
 *
 * Script beats:
 *   (0-5s) "fragmented and overly complex" — Overview "Today" state
 *   (5-8s) "so here is what the unified system looks like" — cursor clicks toggle
 *   (8-12s) "one shared case record, one workspace" — Dashboard appears
 *   (12-20s) "timeline, agency progress, alerts, checklists" — camera tours dashboard
 *   (20-24s) "cutting status calls by 70%" — metric badge
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
  { title: 'Attorney Review', detail: '3 items pending', severity: 'blue' },
  { title: 'Priority Date Current', detail: 'Filing window open', severity: 'green' },
];

const CURRENT_PROBLEMS = [
  '4 separate portals',
  '1 physical mailbox',
  '~25% RFE rate',
  'Weeks of idle time',
  '0 dashboards',
  'No plain language',
];

export const WK1_DashboardReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase transitions
  const showDashboard = frame >= 6 * fps;
  const dashTransition = interpolate(frame, [6 * fps, 7.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Camera keyframes
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 8, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 12, zoom: 1.4, focusX: CONTENT.width / 2, focusY: 200 },  // zoom timeline
    { t: 16, zoom: 1.4, focusX: CONTENT.width / 2, focusY: 380 },  // pan to agencies
    { t: 19, zoom: 1.3, focusX: CONTENT.width * 0.7, focusY: 450 }, // pan to alerts
    { t: 22, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 }, // zoom out
  ]);

  // Cursor waypoints
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 700, visible: false },
    { t: 2, x: 960, y: 700, visible: true },
    { t: 4, x: 680, y: 280, visible: true },            // move to toggle
    { t: 5, x: 680, y: 280, click: true, visible: true }, // click toggle
    { t: 6, x: 680, y: 280, visible: true },
    { t: 7, x: 440, y: 96, visible: true },              // move to Dashboard tab
    { t: 7.5, x: 440, y: 96, click: true, visible: true },// click Dashboard
    { t: 9, x: 440, y: 96, visible: true },
    { t: 12, x: 700, y: 240, visible: true },             // hover timeline
    { t: 15, x: 500, y: 400, visible: true },              // hover agency cards
    { t: 18, x: 1400, y: 400, visible: true },             // hover alerts
    { t: 21, x: 960, y: 500, visible: true },
    { t: 23, x: 960, y: 500, visible: false },
  ]);

  // Metric badge
  const metricIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(20 * fps) });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS,
    }}>
      <BrowserFrame>
        <div style={cameraStyle(camera)}>
          {/* Website nav */}
          <WebNavBar activeTab={showDashboard ? 'Dashboard' : 'Overview'} />

          {/* ═══ CONTENT AREA ═══ */}
          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            padding: '20px 28px',
            overflow: 'hidden',
          }}>
            {/* ── CURRENT STATE (fades out) ── */}
            {!showDashboard && (
              <div style={{ opacity: 1 - dashTransition }}>
                {/* Toggle */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                  <div style={{
                    padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                    background: C.navy900, color: '#ffffff',
                  }}>Today</div>
                  <div style={{
                    padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    background: '#f1f5f9', color: '#64748b',
                  }}>With CaseBridge</div>
                </div>

                {/* Problem grid */}
                <div style={{ fontSize: 28, fontWeight: 700, color: C.navy900, marginBottom: 20 }}>
                  Current Process
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {CURRENT_PROBLEMS.map((prob, i) => (
                    <WebCard key={i} style={{ borderLeft: '3px solid #ef4444' }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#334155' }}>{prob}</div>
                    </WebCard>
                  ))}
                </div>
              </div>
            )}

            {/* ── DASHBOARD (fades in) ── */}
            {frame > 5.5 * fps && (
              <div style={{ opacity: dashTransition }}>
                {/* Case header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.06em' }}>
                      CASE {CASE.caseId}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: C.navy900 }}>
                      {CASE.applicant.name}
                    </div>
                    <div style={{ fontSize: 14, color: '#64748b' }}>
                      {CASE.employer.name} · {CASE.attorney.firm}
                    </div>
                  </div>
                  {/* Readiness score */}
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    border: '4px solid #f59e0b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>72</span>
                  </div>
                </div>

                {/* Stage timeline */}
                <WebCard style={{ marginBottom: 16, padding: '16px 20px' }}>
                  <SectionLabel>Case Journey</SectionLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {STAGES.map((s, i) => (
                      <React.Fragment key={i}>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', margin: '0 auto 6px',
                            background: s.status === 'done' ? '#16a34a' : s.status === 'active' ? C.navy900 : '#e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {s.status === 'done' && <span style={{ color: '#fff', fontSize: 10 }}>{'\u2713'}</span>}
                            {s.status === 'active' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <div style={{
                            fontSize: 10, fontWeight: 600,
                            color: s.status === 'active' ? C.navy900 : s.status === 'done' ? '#16a34a' : '#94a3b8',
                          }}>{s.label}</div>
                        </div>
                        {i < STAGES.length - 1 && (
                          <div style={{
                            flex: 1, height: 2, marginBottom: 20,
                            background: s.status === 'done' ? '#16a34a' : '#e2e8f0',
                          }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </WebCard>

                {/* Main content: agencies + alerts */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                  {/* Agency cards */}
                  <div>
                    <SectionLabel>Cross-Agency Status</SectionLabel>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {AGENCIES.map((a, i) => (
                        <WebCard key={i} style={{
                          flex: 1,
                          borderTop: `3px solid ${a.color}`,
                        }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900 }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{a.status}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>{a.date}</div>
                        </WebCard>
                      ))}
                    </div>

                    {/* Case team */}
                    <div style={{ marginTop: 16 }}>
                      <SectionLabel>Case Team</SectionLabel>
                      <WebCard>
                        <div style={{ display: 'flex', gap: 24 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy900 }}>{CASE.attorney.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Lead Counsel · SLA: 2 days</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy900 }}>Rachel Torres</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>HR Manager · SLA: 3 days</div>
                          </div>
                        </div>
                      </WebCard>
                    </div>
                  </div>

                  {/* Alerts */}
                  <div>
                    <SectionLabel>Alerts</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {ALERTS.map((a, i) => {
                        const colors = { amber: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }, blue: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }, green: { bg: '#dcfce7', border: '#22c55e', text: '#166534' } };
                        const c = colors[a.severity];
                        return (
                          <WebCard key={i} style={{
                            background: c.bg, borderColor: c.border, borderLeftWidth: 3,
                            padding: '10px 14px',
                          }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{a.title}</div>
                            <div style={{ fontSize: 11, color: c.text, opacity: 0.7 }}>{a.detail}</div>
                          </WebCard>
                        );
                      })}
                    </div>

                    {/* What's happening now */}
                    <div style={{ marginTop: 16 }}>
                      <SectionLabel>What{'\u2019'}s Happening Now</SectionLabel>
                      <WebCard style={{ background: '#f8fafc' }}>
                        <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                          Your I-485 package is being finalized. Priority date is current.
                          Attorney is reviewing 3 items. H-1B extension will auto-trigger at 90 days.
                        </div>
                      </WebCard>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </BrowserFrame>

      {/* Cursor */}
      <AnimatedCursor {...cursor} />

      {/* Metric badge overlay */}
      {frame > 20 * fps && (
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          textAlign: 'center', zIndex: 60,
          opacity: interpolate(metricIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(metricIn, [0, 1], [10, 0])}px)`,
        }}>
          <span style={{
            display: 'inline-block',
            padding: '8px 24px', borderRadius: 10,
            background: 'rgba(248,242,182,0.1)', border: '1px solid rgba(248,242,182,0.25)',
            fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT_SANS,
          }}>
            Status calls: &minus;70%
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
