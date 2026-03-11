import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import {
  BrowserFrame, WebNavBar, AnimatedCursor,
  getCursorState, getCameraState, cameraStyle,
  WebCard, SectionLabel, MetricBadge, CONTENT, NAV_H,
} from './shared';

/**
 * WK6 — Impact + Scope + Close (24s / 720f)
 *
 * Script beats:
 *   "So what does that change?"
 *   "Validation catches mismatches... Status becomes visible... Attorney time shifts...
 *    Extension risk is managed early..."
 *   "And that does not solve everything."
 *   "visa caps, retrogression, structural backlog still remain"
 *   "attorneys and applicants can finally see the full picture
 *    with more transparency and less confusion"
 */

const METRICS = [
  { label: 'RFE Rate', before: '~25%', after: '<5%', change: '\u221280%' },
  { label: 'Status Portals', before: '4', after: '1', change: '\u221275%' },
  { label: 'Attorney Hours', before: '~8 hrs', after: '~3 hrs', change: '\u221262%' },
  { label: 'Extension Cost', before: '$5K+', after: '~$2.5K', change: '\u221250%' },
  { label: 'Handoff Time', before: 'Weeks', after: '<5 days', change: '\u221275%' },
  { label: 'PWD Revisions', before: '~15%', after: '<3%', change: '\u221280%' },
];

const SOLVES = [
  'Cross-form data consistency',
  'Fragmented status visibility',
  'Missed extension deadlines',
  'Legal language opacity',
  'Dropped handoffs',
  'PWD revision cycles',
];

const CONSTRAINTS = [
  'Visa caps & per-country limits',
  'Priority date retrogression',
  'USCIS processing capacity',
  'Policy volatility',
  'Education pipeline alignment',
];

export const WK6_ImpactClose = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase: metrics (0-10s), scope (10-18s), close (18-24s)
  const showScope = frame >= 10 * fps;
  const showClose = frame >= 18 * fps;
  const scopeTransition = interpolate(frame, [9.5 * fps, 11 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // "What does that change?" kinetic
  const questionIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const questionExit = interpolate(frame, [2.5 * fps, 3.5 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Camera
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 4, zoom: 1.08, focusX: CONTENT.width / 2, focusY: 320 },   // zoom to metrics
    { t: 9, zoom: 1.08, focusX: CONTENT.width / 2, focusY: 320 },
    { t: 11, zoom: 1.05, focusX: CONTENT.width / 2, focusY: 460 },   // pan to scope
    { t: 17, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 1.5, x: 660, y: 96, visible: true },        // move to Impact tab
    { t: 2, x: 660, y: 96, click: true, visible: true },
    { t: 5, x: 600, y: 300, visible: true },          // hover metrics
    { t: 8, x: 1200, y: 350, visible: true },
    { t: 11, x: 500, y: 550, visible: true },         // hover scope
    { t: 14, x: 1200, y: 550, visible: true },
    { t: 17, x: 960, y: 500, visible: false },
  ]);

  // Fade out at end
  const fadeOut = interpolate(frame, [durationInFrames - 40, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Logo
  const logoIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(19 * fps) });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, opacity: fadeOut,
    }}>
      {/* "What does that change?" kinetic overlay (before browser) */}
      {frame < 3.5 * fps && (
        <div style={{
          position: 'absolute', top: '42%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(questionIn, [0, 1], [0.85, 1])})`,
          zIndex: 60,
          opacity: interpolate(questionIn, [0, 1], [0, 1]) * questionExit,
        }}>
          <div style={{
            fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 80px rgba(14,26,74,0.95)',
          }}>
            What changes?
          </div>
        </div>
      )}

      <BrowserFrame>
        <div style={{
          ...cameraStyle(camera),
          opacity: interpolate(frame, [2.5 * fps, 3.5 * fps], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}>
          <WebNavBar activeTab="Impact" />

          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            padding: '20px 28px',
          }}>
            {/* ═══ METRICS GRID ═══ */}
            <div style={{ fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 16 }}>
              System Impact
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {METRICS.map((m, i) => {
                const delay = Math.round(4 * fps) + i * 8;
                const mIn = spring({ frame, fps, config: { damping: 200 }, delay });
                return (
                  <div key={i} style={{
                    opacity: interpolate(mIn, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(mIn, [0, 1], [12, 0])}px)`,
                  }}>
                    <MetricBadge {...m} />
                  </div>
                );
              })}
            </div>

            {/* ═══ SCOPE SECTION ═══ */}
            {showScope && (
              <div style={{
                marginTop: 24,
                opacity: scopeTransition,
                transform: `translateY(${interpolate(scopeTransition, [0, 1], [16, 0])}px)`,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {/* Solves */}
                  <WebCard style={{
                    borderLeft: '4px solid #22c55e',
                    background: '#f0fdf440',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a', marginBottom: 12 }}>
                      What CaseBridge Addresses
                    </div>
                    {SOLVES.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 0',
                        borderBottom: i < SOLVES.length - 1 ? '1px solid #f1f5f9' : 'none',
                      }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#dcfce7', color: '#16a34a',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, flexShrink: 0,
                        }}>{'\u2713'}</span>
                        <span style={{ fontSize: 13, color: '#334155' }}>{item}</span>
                      </div>
                    ))}
                  </WebCard>

                  {/* Constraints */}
                  <WebCard style={{
                    borderLeft: '4px solid #94a3b8',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#64748b', marginBottom: 12 }}>
                      Requires Broader Reform
                    </div>
                    {CONSTRAINTS.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 0',
                        borderBottom: i < CONSTRAINTS.length - 1 ? '1px solid #f1f5f9' : 'none',
                      }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#f1f5f9', color: '#94a3b8',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, flexShrink: 0,
                        }}>{'\u2014'}</span>
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{item}</span>
                      </div>
                    ))}
                  </WebCard>
                </div>

                {/* Scope statement */}
                <div style={{
                  marginTop: 16, textAlign: 'center', padding: '12px 20px',
                  background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: 15, color: '#334155', fontWeight: 500 }}>
                    A better process, even before broader reform.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* Close: CaseBridge logo */}
      {showClose && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(160deg, rgba(14,26,74,0.95), rgba(22,39,104,0.98))`,
          zIndex: 70,
          opacity: interpolate(logoIn, [0, 1], [0, 1]),
        }}>
          <div style={{
            fontSize: 64, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            letterSpacing: '-0.01em',
            transform: `scale(${interpolate(logoIn, [0, 1], [0.9, 1])})`,
          }}>
            CaseBridge
          </div>
          <div style={{
            width: interpolate(logoIn, [0, 1], [0, 160]),
            height: 2, background: C.accent,
            marginTop: 16,
          }} />
          <div style={{
            marginTop: 20, fontSize: 18, color: 'rgba(255,255,255,0.5)',
            fontFamily: FONT_SANS,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: Math.round(20 * fps) }),
          }}>
            More transparency. Less confusion.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
