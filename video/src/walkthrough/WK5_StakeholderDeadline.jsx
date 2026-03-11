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
 * WK5 — Employer + Attorney Views + Deadline (22s / 660f)
 *
 * Script beats:
 *   "employer sees deadlines, extension costs, and continuity risk
 *    — every month of delay can cause another H-1B extension at $4-10K"
 *   "attorney sees filing readiness, evidence gaps, and legal blockers
 *    — spends less time answering status questions the dashboard handles"
 *   "Problems surfaced early. Ninety days out."
 */

const COST_PHASES = [
  { phase: 'PERM', cost: '$4,000\u2013$6,000', status: 'Paid' },
  { phase: 'I-140', cost: '$3,000\u2013$5,000', status: 'Paid' },
  { phase: 'I-485', cost: '$5,000\u2013$7,000', status: 'Upcoming' },
  { phase: 'H-1B Ext', cost: '$2,500\u2013$4,000', status: 'Recurring' },
];

const ATT_ISSUES = [
  { sev: 'HIGH', color: '#ef4444', text: 'SOC / Wage Mismatch — review required' },
  { sev: 'MEDIUM', color: '#f59e0b', text: 'Employer Name — resolved (auto-fixed)' },
  { sev: 'LOW', color: '#3b82f6', text: 'Travel history gap — needs confirmation' },
];

export const WK5_StakeholderDeadline = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase: employer (0-8s), attorney (8-15s), deadline focus (15-22s)
  const isEmployer = frame < 8 * fps;
  const isAttorney = frame >= 8 * fps && frame < 15 * fps;
  const isDeadline = frame >= 15 * fps;

  const activeRole = isEmployer ? 'Employer' : isAttorney ? 'Attorney' : 'Employer';
  const roleTransition = interpolate(frame, [7.5 * fps, 8.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const deadlineTransition = interpolate(frame, [14.5 * fps, 15.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Deadline alert animation
  const alertIn = spring({ frame, fps, config: { damping: 18, stiffness: 140 }, delay: Math.round(16 * fps) });
  const managedFlip = frame >= 19 * fps;

  // Camera
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 2, zoom: 1.3, focusX: CONTENT.width * 0.6, focusY: 350 },    // zoom employer view
    { t: 7, zoom: 1.3, focusX: CONTENT.width * 0.6, focusY: 350 },
    { t: 9, zoom: 1.3, focusX: CONTENT.width * 0.6, focusY: 350 },    // attorney view (same area)
    { t: 14, zoom: 1.3, focusX: CONTENT.width * 0.6, focusY: 350 },
    { t: 16, zoom: 1.5, focusX: CONTENT.width * 0.5, focusY: 280 },   // zoom deadline card
    { t: 20, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 2, x: 450, y: 140, visible: true },               // hover Employer button
    { t: 5, x: 700, y: 400, visible: true },                // hover cost table
    { t: 7, x: 550, y: 140, visible: true },                // move to Attorney button
    { t: 8, x: 550, y: 140, click: true, visible: true },   // click Attorney
    { t: 10, x: 700, y: 350, visible: true },               // hover issues
    { t: 13, x: 700, y: 420, visible: true },
    { t: 15, x: 600, y: 250, visible: true },               // move to deadline card
    { t: 18, x: 600, y: 250, visible: true },
    { t: 21, x: 960, y: 500, visible: false },
  ]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS,
    }}>
      <BrowserFrame>
        <div style={cameraStyle(camera)}>
          <WebNavBar activeTab="Roles" />

          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            padding: '20px 28px',
          }}>
            {/* Role switcher */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {['Applicant', 'Employer', 'Attorney'].map((role, i) => {
                const isActive = (isEmployer && i === 1) || (isAttorney && i === 2) || (isDeadline && i === 1);
                const roleColor = i === 0 ? '#3b82f6' : i === 1 ? '#f59e0b' : '#22c55e';
                return (
                  <div key={role} style={{
                    padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                    background: isActive ? roleColor : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                  }}>
                    {role}
                  </div>
                );
              })}
            </div>

            {/* ═══ EMPLOYER VIEW ═══ */}
            {(isEmployer || (isAttorney && roleTransition < 1)) && (
              <div style={{ opacity: isAttorney ? 1 - roleTransition : 1 }}>
                <WebCard style={{ marginBottom: 16, background: '#fffbeb', borderColor: '#f59e0b30' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy900 }}>
                    Case active — deadlines approaching.
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                    I-485 filing in preparation. H-1B extension approaching. Budget action needed.
                  </div>
                </WebCard>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Deadline card */}
                  <WebCard style={{
                    borderTop: '3px solid #f59e0b',
                    background: isDeadline && deadlineTransition > 0 ? '#fffbeb' : '#ffffff',
                  }}>
                    <SectionLabel>H-1B Extension</SectionLabel>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 48, fontWeight: 700, color: managedFlip ? '#22c55e' : '#f59e0b' }}>
                        102
                      </span>
                      <span style={{ fontSize: 14, color: '#64748b' }}>days remaining</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
                      Auto-trigger: 90 days before expiry
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Estimated cost: ~$2,500
                    </div>

                    {/* Deadline alert (appears at 16s) */}
                    {isDeadline && (
                      <div style={{
                        marginTop: 12, padding: '8px 12px', borderRadius: 8,
                        background: managedFlip ? '#dcfce7' : '#fef3c7',
                        border: `1px solid ${managedFlip ? '#22c55e' : '#f59e0b'}30`,
                        opacity: interpolate(alertIn, [0, 1], [0, 1]),
                      }}>
                        <div style={{
                          fontSize: 12, fontWeight: 700,
                          color: managedFlip ? '#166534' : '#92400e',
                        }}>
                          {managedFlip ? '\u2713 Extension workflow initiated' : '\u26A1 Auto-triggered at 90 days'}
                        </div>
                      </div>
                    )}

                    {/* State label */}
                    {isDeadline && managedFlip && (
                      <div style={{
                        marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <span style={{
                          fontSize: 12, color: '#f59e0b', textDecoration: 'line-through', opacity: 0.5,
                        }}>At Risk</span>
                        <span style={{ color: '#94a3b8' }}>{'\u2192'}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>Managed</span>
                      </div>
                    )}
                  </WebCard>

                  {/* Sponsorship cost */}
                  <WebCard>
                    <SectionLabel>Sponsorship Cost Breakdown</SectionLabel>
                    {COST_PHASES.map((c, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 0',
                        borderBottom: i < COST_PHASES.length - 1 ? '1px solid #f1f5f9' : 'none',
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{c.phase}</span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy900 }}>{c.cost}</span>
                          <span style={{
                            display: 'block', fontSize: 10,
                            color: c.status === 'Paid' ? '#16a34a' : c.status === 'Upcoming' ? '#f59e0b' : '#3b82f6',
                            fontWeight: 600,
                          }}>{c.status}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{
                      marginTop: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0',
                      fontSize: 13, fontWeight: 700, color: C.navy900,
                    }}>
                      Total: $15,000\u2013$22,000
                    </div>
                  </WebCard>
                </div>
              </div>
            )}

            {/* ═══ ATTORNEY VIEW ═══ */}
            {isAttorney && (
              <div style={{
                opacity: roleTransition,
                transform: `translateY(${interpolate(roleTransition, [0, 1], [16, 0])}px)`,
              }}>
                <WebCard style={{ marginBottom: 16, background: '#f0fdf4', borderColor: '#22c55e30' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy900 }}>
                    Filing package: 2 items to resolve.
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                    I-485 package 80% ready. Time-sensitive filing window.
                  </div>
                </WebCard>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Issues */}
                  <WebCard>
                    <SectionLabel>Validation Issues</SectionLabel>
                    {ATT_ISSUES.map((issue, i) => {
                      const resolved = i === 1;
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 0',
                          borderBottom: i < ATT_ISSUES.length - 1 ? '1px solid #f1f5f9' : 'none',
                          opacity: resolved ? 0.5 : 1,
                        }}>
                          <span style={{
                            fontSize: 9, fontWeight: 700,
                            color: resolved ? '#22c55e' : issue.color,
                            background: `${resolved ? '#22c55e' : issue.color}15`,
                            padding: '2px 8px', borderRadius: 3,
                          }}>{resolved ? 'FIXED' : issue.sev}</span>
                          <span style={{
                            fontSize: 12, color: '#334155', fontWeight: 500,
                            textDecoration: resolved ? 'line-through' : 'none',
                          }}>{issue.text}</span>
                        </div>
                      );
                    })}
                  </WebCard>

                  {/* Readiness */}
                  <WebCard>
                    <SectionLabel>Filing Readiness</SectionLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: '4px solid #22c55e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>80</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.navy900 }}>Ready with caveats</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>2 issues need review</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Evidence: 4/6 documents</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Target filing: 5-7 business days</div>
                  </WebCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* "90 days out" metric */}
      {isDeadline && (
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          textAlign: 'center', zIndex: 60,
          opacity: interpolate(alertIn, [0, 1], [0, 1]),
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
