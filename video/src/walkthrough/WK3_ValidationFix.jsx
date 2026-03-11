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
 * WK3 — Validation + Fix + Propagation (24s / 720f)
 *
 * Script beats:
 *   "when the attorney corrects the problem once in the shared record,
 *    that correction carries through to every form it touches."
 *   "reactive cleanup to proactive quality control... 25% to under 5%"
 *
 * Visual: Click validate → issues appear → fix employer name → propagation → score
 */

const ISSUES = [
  {
    title: 'SOC 15-1299.08 / Wage Survey Mismatch',
    severity: 'HIGH', color: '#ef4444',
    detail: 'Q4 vs Q2 2023 wage survey discrepancy',
    forms: ['ETA-9089', 'I-140'],
    fixable: false,
  },
  {
    title: 'Employer Name Format Mismatch',
    severity: 'MEDIUM', color: '#f59e0b',
    detail: `"${CASE.employer.wrongName}" vs "${CASE.employer.name}"`,
    forms: ['I-140', 'I-485', 'ETA-9089'],
    fixable: true,
    fixLabel: `Fix: Standardize to "${CASE.employer.name}"`,
  },
  {
    title: 'Travel History Gap',
    severity: 'LOW', color: '#3b82f6',
    detail: '3-week gap in Dec 2023 travel records',
    forms: ['I-485'],
    fixable: false,
  },
];

export const WK3_ValidationFix = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase markers
  const P = {
    clickValidate: 3 * fps,
    scanStart: 4 * fps,
    scanEnd: 6 * fps,
    issuesAppear: 6.5 * fps,
    zoomToFix: 10 * fps,
    clickFix: 13 * fps,
    fixApplied: 14 * fps,
    propagation: 15 * fps,
    scoreRise: 14.5 * fps,
    kineticIn: 19.5 * fps,
    metricIn: 21 * fps,
  };

  const validationStarted = frame >= P.clickValidate;
  const isScanning = frame >= P.scanStart && frame < P.scanEnd;
  const scanProgress = isScanning ? interpolate(frame, [P.scanStart, P.scanEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : -1;
  const issuesVisible = frame >= P.issuesAppear;
  const fixClicked = frame >= P.clickFix;
  const fixApplied = frame >= P.fixApplied;
  const scoreValue = fixApplied
    ? interpolate(frame, [P.scoreRise, P.scoreRise + 45], [72, 80], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : validationStarted ? 72 : 0;

  // Propagation flash on affected forms
  const propFlash = fixApplied ? interpolate(frame - P.propagation, [0, 10, 30], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) : 0;

  // Camera
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 3, zoom: 1.3, focusX: CONTENT.width * 0.8, focusY: 300 },   // zoom to validation panel
    { t: 6, zoom: 1.3, focusX: CONTENT.width * 0.8, focusY: 300 },
    { t: 8, zoom: 1.2, focusX: CONTENT.width * 0.75, focusY: 380 },  // show issues
    { t: 10, zoom: 1.6, focusX: CONTENT.width * 0.75, focusY: 420 },  // zoom to employer issue
    { t: 14, zoom: 1.6, focusX: CONTENT.width * 0.75, focusY: 420 },  // fix applied
    { t: 16, zoom: 1.2, focusX: CONTENT.width / 2, focusY: 350 },     // zoom out to show propagation
    { t: 19, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 2.5, x: 1550, y: 370, visible: true },               // move to validate button
    { t: 3, x: 1550, y: 370, click: true, visible: true },     // click validate
    { t: 5, x: 1550, y: 370, visible: true },                  // hold during scan
    { t: 8, x: 1500, y: 480, visible: true },                  // hover over issues
    { t: 10, x: 1500, y: 450, visible: true },                 // employer issue
    { t: 12, x: 1550, y: 475, visible: true },                 // move to Fix button
    { t: 13, x: 1550, y: 475, click: true, visible: true },    // click Fix
    { t: 15, x: 800, y: 350, visible: true },                  // move to form cards
    { t: 18, x: 960, y: 400, visible: true },
    { t: 22, x: 960, y: 500, visible: false },
  ]);

  // Kinetic
  const kineticIn = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: P.kineticIn });
  const kineticExit = interpolate(frame, [P.kineticIn + 45, P.kineticIn + 60], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const metricIn = spring({ frame, fps, config: { damping: 200 }, delay: P.metricIn });

  const scoreColor = scoreValue >= 80 ? '#22c55e' : scoreValue >= 60 ? '#f59e0b' : '#94a3b8';

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
            gap: 0, paddingTop: 4,
          }}>
            {/* LEFT: Shared fields (dimmed during validation focus) */}
            <div style={{
              padding: '16px 20px', borderRight: '1px solid #e2e8f0',
              background: '#f8fafc',
              opacity: frame >= P.zoomToFix ? 0.4 : 1,
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900, marginBottom: 12 }}>
                Shared Case Data
              </div>
              {[
                { label: 'Employer Legal Name', value: fixApplied ? CASE.employer.name : CASE.employer.wrongName, highlight: fixApplied },
                { label: 'Job Title', value: CASE.applicant.title },
                { label: 'SOC Code', value: CASE.applicant.soc },
                { label: 'Annual Salary', value: CASE.applicant.salary },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: 10, padding: '6px 8px' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{f.label}</div>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: C.navy900, marginTop: 2,
                    padding: '3px 6px', borderRadius: 4,
                    background: f.highlight ? '#dcfce7' : '#ffffff',
                    border: `1px solid ${f.highlight ? '#22c55e40' : '#e2e8f0'}`,
                  }}>{f.value}</div>
                </div>
              ))}
            </div>

            {/* CENTER: Form cards */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900, marginBottom: 12 }}>Filing Package</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {['ETA-9089', 'I-140', 'I-485', 'I-765', 'I-131', 'G-28'].map((code, i) => {
                  const isAffected = fixApplied && ISSUES[1].forms.includes(code);
                  return (
                    <WebCard key={i} glow={isAffected && propFlash > 0.1} style={{
                      borderTop: `3px solid ${isAffected ? '#22c55e' : C.navy900 + '30'}`,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy900 }}>{code}</div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                        {isAffected ? `${'\u2713'} Employer name updated` : 'Auto-populated'}
                      </div>
                    </WebCard>
                  );
                })}
              </div>

              {/* Propagation notification */}
              {fixApplied && (
                <div style={{
                  marginTop: 12, padding: '8px 14px', borderRadius: 8,
                  background: '#dcfce7', border: '1px solid #22c55e40',
                  fontSize: 12, color: '#166534', fontWeight: 600,
                  textAlign: 'center',
                  opacity: interpolate(frame - P.fixApplied, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}>
                  {'\u2713'} Correction propagated to I-140, I-485, and ETA-9089
                </div>
              )}
            </div>

            {/* RIGHT: Validation panel */}
            <div style={{
              padding: '16px 20px', borderLeft: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900, marginBottom: 12 }}>
                Validation Engine
              </div>

              {/* Score */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                border: `4px solid ${validationStarted ? scoreColor : '#e2e8f0'}`,
                margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: validationStarted ? scoreColor : '#94a3b8' }}>
                  {validationStarted ? Math.round(scoreValue) : '?'}
                </span>
              </div>

              {/* Button */}
              <div style={{
                padding: '10px 16px', borderRadius: 8, textAlign: 'center', marginBottom: 16,
                background: validationStarted ? '#64748b' : C.navy900,
                color: '#ffffff', fontSize: 13, fontWeight: 700,
              }}>
                {isScanning ? 'Analyzing...' : validationStarted ? 'Validation Complete' : 'Run Pre-Submission Check'}
              </div>

              {/* Scan line indicator */}
              {isScanning && (
                <div style={{
                  height: 3, borderRadius: 2, marginBottom: 12,
                  background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
                  width: `${scanProgress * 100}%`,
                }} />
              )}

              {/* RFE Alert Banner */}
              {issuesVisible && !fixApplied && (
                <div style={{
                  marginBottom: 10, padding: '8px 12px', borderRadius: 8,
                  background: '#fef2f2', border: '1px solid #fecaca',
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: interpolate(frame - P.issuesAppear, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}>
                  <span style={{ fontSize: 14 }}>{'\u26A0\uFE0F'}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#991b1b' }}>
                      RFE Risk: 3 issues detected
                    </div>
                    <div style={{ fontSize: 9, color: '#b91c1c' }}>
                      ~25% chance of Request for Evidence. Resolve before submission.
                    </div>
                  </div>
                </div>
              )}

              {/* Issues */}
              {issuesVisible && ISSUES.map((issue, i) => {
                const iDelay = P.issuesAppear + i * 10;
                const iIn = spring({ frame, fps, config: { damping: 200 }, delay: iDelay });
                const isFixed = i === 1 && fixApplied;

                return (
                  <div key={i} style={{
                    marginBottom: 10, padding: '10px 12px', borderRadius: 8,
                    background: isFixed ? '#dcfce720' : '#ffffff',
                    borderLeft: `3px solid ${isFixed ? '#22c55e' : issue.color}`,
                    border: `1px solid ${isFixed ? '#22c55e40' : issue.color + '25'}`,
                    opacity: interpolate(iIn, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(iIn, [0, 1], [16, 0])}px)`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: isFixed ? '#22c55e' : issue.color,
                        background: `${isFixed ? '#22c55e' : issue.color}15`,
                        padding: '2px 6px', borderRadius: 3,
                      }}>
                        {isFixed ? 'RESOLVED' : issue.severity}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 600,
                        color: isFixed ? '#94a3b8' : '#334155',
                        textDecoration: isFixed ? 'line-through' : 'none',
                      }}>
                        {issue.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{issue.detail}</div>

                    {/* Fix button */}
                    {issue.fixable && !fixApplied && frame >= iDelay + 20 && (
                      <div style={{
                        marginTop: 6, padding: '5px 10px', borderRadius: 6,
                        background: C.navy900, color: '#ffffff',
                        fontSize: 11, fontWeight: 700, display: 'inline-block',
                      }}>
                        {issue.fixLabel}
                      </div>
                    )}

                    {/* Affected forms */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {issue.forms.map((f, j) => (
                        <span key={j} style={{
                          fontSize: 9, padding: '1px 6px', borderRadius: 3,
                          background: isFixed ? '#dcfce7' : '#f1f5f9',
                          color: isFixed ? '#166534' : '#64748b', fontWeight: 600,
                        }}>{isFixed ? `${'\u2713'} ${f}` : f}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* Kinetic "Caught before filing." */}
      {frame > P.kineticIn && frame < P.kineticIn + 60 && (
        <div style={{
          position: 'absolute', top: '44%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticIn, [0, 1], [0.8, 1])})`,
          zIndex: 60, opacity: interpolate(kineticIn, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 52, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 80px rgba(14,26,74,0.95), 0 0 160px rgba(14,26,74,0.9)',
          }}>
            Caught before filing.
          </div>
        </div>
      )}

      {/* Metric: 25% → <5% */}
      {frame > P.metricIn && (
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          textAlign: 'center', zIndex: 60,
          opacity: interpolate(metricIn, [0, 1], [0, 1]),
        }}>
          <span style={{
            display: 'inline-block', padding: '8px 24px', borderRadius: 10,
            background: 'rgba(248,242,182,0.1)', border: '1px solid rgba(248,242,182,0.25)',
            fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT_SANS,
          }}>
            ~25% {'\u2192'} {'<'}5% RFE rate
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
