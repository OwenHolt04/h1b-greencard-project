import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { T, V3_CARD, CASE } from './theme';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * V3S1 — Dashboard Reveal (14s/420f)
 * Script lines 1-2: "Everything centers on one unified dashboard."
 *
 * Phase 1 (0-3s): "CaseBridge" title + subtitle rise in on cream bg
 * Phase 2 (3-7s): Case card materializes with key details
 * Phase 3 (7-10s): Journey nodes appear (H-1B → PWD → PERM → I-140 → I-485)
 * Phase 4 (10-14s): Alert cards slide in (H-1B expiry + priority date)
 */

const JOURNEY_NODES = [
  { label: 'H-1B', status: 'complete' },
  { label: 'PWD', status: 'complete' },
  { label: 'PERM', status: 'complete' },
  { label: 'I-140', status: 'complete' },
  { label: 'I-485', status: 'active' },
];

const ALERTS = [
  { icon: '⚡', title: 'H-1B Expiry', detail: '102 days remaining', color: T.amber, bg: T.amberBg, border: T.amberBorder },
  { icon: '🟢', title: 'Priority Date Current', detail: 'Feb 2026 Visa Bulletin', color: T.green, bg: T.greenBg, border: T.greenBorder },
];

export const V3S1_Dashboard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Title
  const titleIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const subIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.2 * fps) });
  const lineIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.8 * fps) });
  const lineW = interpolate(lineIn, [0, 1], [0, 120]);

  // Phase 2: Case card
  const cardIn = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(3 * fps) });

  // Phase 3: Journey
  const journeyIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(7 * fps) });

  // Phase 4: Alerts
  const alert1In = spring({ frame, fps, config: { damping: 18, stiffness: 140 }, delay: Math.round(10 * fps) });
  const alert2In = spring({ frame, fps, config: { damping: 18, stiffness: 140 }, delay: Math.round(10.8 * fps) });

  const CX = 960;

  return (
    <AbsoluteFill style={{
      background: T.bgGradient,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* Subtle navy accent at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: T.navy,
      }} />

      {/* Phase 1: CaseBridge title */}
      <div style={{
        position: 'absolute', top: 100, left: CX, transform: 'translateX(-50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 72, fontWeight: 700, fontFamily: FONT_DISPLAY, color: T.navy,
          letterSpacing: '-0.02em',
          opacity: interpolate(titleIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
        }}>
          CaseBridge
        </div>
        <div style={{
          fontSize: 20, color: T.textSecondary, marginTop: 8,
          opacity: interpolate(subIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subIn, [0, 1], [10, 0])}px)`,
        }}>
          One shared case record — three stakeholders, all aligned
        </div>
        <div style={{
          width: lineW, height: 2, background: T.navy, margin: '14px auto 0', opacity: 0.3,
        }} />
      </div>

      {/* Phase 2: Case card */}
      <div style={{
        position: 'absolute', top: 280, left: CX, transform: 'translateX(-50%)',
        width: 880,
        opacity: interpolate(cardIn, [0, 1], [0, 1]),
        transform: `translateX(-50%) scale(${interpolate(cardIn, [0, 1], [0.95, 1])})`,
      }}>
        <div style={{
          ...V3_CARD.focal,
          borderTop: `3px solid ${T.navy}`,
          padding: '28px 40px',
        }}>
          <div style={{
            fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 20,
          }}>
            CASE {CASE.caseId}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[
              { label: 'APPLICANT', value: CASE.applicant.name, color: T.navy },
              { label: 'EMPLOYER', value: CASE.employer.shortName, color: T.navy },
              { label: 'STAGE', value: CASE.stage, color: T.navy },
              { label: 'H-1B', value: `${CASE.applicant.h1bDaysLeft} days`, color: T.amber },
            ].map((d, i) => {
              const dIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3.5 * fps) + i * 8 });
              return (
                <div key={i} style={{
                  opacity: interpolate(dIn, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(dIn, [0, 1], [10, 0])}px)`,
                }}>
                  <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: d.color }}>{d.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phase 3: Journey nodes */}
      <div style={{
        position: 'absolute', top: 500, left: CX, transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 0,
        opacity: interpolate(journeyIn, [0, 1], [0, 1]),
        transform: `translateX(-50%) translateY(${interpolate(journeyIn, [0, 1], [16, 0])}px)`,
      }}>
        {JOURNEY_NODES.map((node, i) => {
          const nIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(7.2 * fps) + i * 8 });
          const isActive = node.status === 'active';
          const isComplete = node.status === 'complete';
          return (
            <React.Fragment key={i}>
              <div style={{
                opacity: interpolate(nIn, [0, 1], [0, 1]),
                transform: `scale(${interpolate(nIn, [0, 1], [0.8, 1])})`,
                textAlign: 'center',
              }}>
                <div style={{
                  width: isActive ? 52 : 44, height: isActive ? 52 : 44,
                  borderRadius: '50%',
                  background: isActive ? T.navy : isComplete ? T.greenBg : T.card,
                  border: `2px solid ${isActive ? T.navy : isComplete ? T.green : T.cardBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isActive ? '0 4px 16px rgba(22,39,104,0.25)' : 'none',
                }}>
                  {isComplete && <span style={{ fontSize: 16, color: T.green }}>✓</span>}
                  {isActive && <span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>●</span>}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600, marginTop: 8,
                  color: isActive ? T.navy : T.textMuted,
                }}>{node.label}</div>
              </div>
              {i < JOURNEY_NODES.length - 1 && (
                <div style={{
                  width: 60, height: 2, background: isComplete && JOURNEY_NODES[i + 1].status !== 'active'
                    ? T.green : T.cardBorder,
                  margin: '0 4px', marginBottom: 20,
                  opacity: interpolate(nIn, [0, 1], [0, 1]),
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Phase 4: Alert cards */}
      <div style={{
        position: 'absolute', bottom: 80, left: CX, transform: 'translateX(-50%)',
        display: 'flex', gap: 20,
      }}>
        {ALERTS.map((alert, i) => {
          const aIn = i === 0 ? alert1In : alert2In;
          return (
            <div key={i} style={{
              opacity: interpolate(aIn, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(aIn, [0, 1], [20, 0])}px)`,
            }}>
              <div style={{
                ...V3_CARD.standard,
                padding: '14px 24px',
                display: 'flex', alignItems: 'center', gap: 14,
                borderLeft: `4px solid ${alert.color}`,
                width: 320,
              }}>
                <span style={{ fontSize: 22 }}>{alert.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>{alert.title}</div>
                  <div style={{ fontSize: 12, color: T.textSecondary }}>{alert.detail}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
