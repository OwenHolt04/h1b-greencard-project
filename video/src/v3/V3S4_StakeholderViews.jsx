import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { T, V3_CARD, CASE } from './theme';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * V3S4 — Stakeholder Views (18s/540f)
 * Script lines 9-10:
 *   "Krishna's employer sees deadlines, extension costs, and continuity risk."
 *   "His attorney sees filing readiness, evidence gaps, and legal blockers."
 *
 * Phase 1 (0-1.5s): Case anchor bar (shared context)
 * Phase 2 (1.5-9s): EMPLOYER view — giant countdown, costs, auto-trigger
 * Phase 3 (9-16s): ATTORNEY view — issues, readiness score
 * Phase 4 (16-18s): "Same case. Different priorities."
 */

export const V3S4_StakeholderViews = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;

  const P = {
    anchorIn: Math.round(0.3 * fps),
    employerStart: Math.round(1.5 * fps),
    employerExit: Math.round(8.5 * fps),
    attorneyStart: Math.round(9 * fps),
    attorneyExit: Math.round(15.5 * fps),
    synthesisStart: Math.round(16 * fps),
  };

  // Case anchor
  const anchorIn = spring({ frame, fps, config: { damping: 200 }, delay: P.anchorIn });

  // Role logic
  const isEmployer = frame >= P.employerStart && frame < P.attorneyStart;
  const isAttorney = frame >= P.attorneyStart && frame < P.synthesisStart;
  const isSynthesis = frame >= P.synthesisStart;
  const activeRole = isSynthesis ? 'All' : isAttorney ? 'Attorney' : isEmployer ? 'Employer' : '';
  const roleColorMap = { Employer: T.amber, Attorney: T.green, All: T.navy };
  const activeColor = roleColorMap[activeRole] || T.navy;

  // Employer animations
  const empIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.employerStart });
  const empExit = interpolate(frame, [P.employerExit, P.employerExit + 15], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Attorney animations
  const attIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.attorneyStart });
  const attExit = interpolate(frame, [P.attorneyExit, P.attorneyExit + 15], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Synthesis
  const synthIn = spring({ frame, fps, config: { damping: 16, stiffness: 160 }, delay: P.synthesisStart });

  return (
    <AbsoluteFill style={{
      background: T.bgGradient,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: T.navy }} />

      {/* Case anchor bar */}
      <div style={{
        position: 'absolute', top: 24, left: CX, transform: 'translateX(-50%)',
        opacity: interpolate(anchorIn, [0, 1], [0, 0.8]),
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, letterSpacing: '0.06em' }}>
          CASE {CASE.caseId}
        </span>
        <span style={{ fontSize: 12, color: T.textSecondary, fontWeight: 600 }}>
          {CASE.applicant.name} · {CASE.employer.shortName}
        </span>
        {activeRole && activeRole !== 'All' && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
            background: activeColor,
            color: activeRole === 'Employer' ? T.navy : '#fff',
          }}>
            {activeRole}
          </span>
        )}
      </div>

      {/* ═══ EMPLOYER VIEW ═══ */}
      {frame >= P.employerStart - 5 && frame < P.attorneyStart + 5 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: empIn * empExit,
        }}>
          {/* Giant countdown */}
          <div style={{
            fontSize: 160, fontWeight: 700, fontFamily: FONT_DISPLAY, color: T.amber,
            lineHeight: 1,
            transform: `scale(${interpolate(empIn, [0, 1], [0.8, 1])})`,
          }}>
            102
          </div>
          <div style={{ fontSize: 20, color: T.textSecondary, marginTop: 4 }}>
            days until H-1B expiry
          </div>

          {/* Cost + trigger cards */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 36,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.employerStart + 18 }),
          }}>
            <div style={{
              ...V3_CARD.standard,
              borderLeft: `4px solid ${T.amber}`,
              padding: '14px 24px', textAlign: 'center', width: 200,
            }}>
              <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, marginBottom: 4 }}>EXTENSION COST</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.amber }}>~$2,500</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>per extension cycle</div>
            </div>
            <div style={{
              ...V3_CARD.standard,
              borderLeft: `4px solid ${T.amber}`,
              padding: '14px 24px', textAlign: 'center', width: 200,
            }}>
              <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, marginBottom: 4 }}>AUTO-TRIGGER</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.amber }}>90 days</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>before expiry</div>
            </div>
          </div>

          {/* Continuity risk callout */}
          <div style={{
            marginTop: 24,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.employerStart + 28 }),
          }}>
            <div style={{
              ...V3_CARD.standard,
              borderLeft: `4px solid ${T.red}`,
              padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.red, background: T.redBg, padding: '2px 8px', borderRadius: 4 }}>RISK</span>
              <span style={{ fontSize: 13, color: T.textBody }}>
                Every month of delay = another extension at $4-10K
              </span>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 70,
            fontSize: 14, color: T.amber, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            EMPLOYER VIEW — Deadlines, costs, and continuity risk
          </div>
        </div>
      )}

      {/* ═══ ATTORNEY VIEW ═══ */}
      {frame >= P.attorneyStart - 5 && frame < P.synthesisStart + 5 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: attIn * attExit,
        }}>
          {/* Score ring */}
          <ScoreRing score={80} size={120} />
          <div style={{ fontSize: 14, color: T.textMuted, fontWeight: 600, marginTop: 8 }}>FILING READINESS</div>

          {/* Issue list */}
          <div style={{
            marginTop: 28, width: 500,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.attorneyStart + 14 }),
          }}>
            {[
              { sev: 'HIGH', color: T.red, bg: T.redBg, text: 'SOC / Wage Mismatch — review required' },
              { sev: 'LOW', color: T.blue, bg: T.blueBg, text: 'Travel history gap — needs confirmation' },
            ].map((item, i) => (
              <div key={i} style={{
                ...V3_CARD.standard,
                borderLeft: `4px solid ${item.color}`,
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                marginBottom: 10,
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: item.color,
                  background: item.bg, padding: '2px 8px', borderRadius: 4,
                }}>{item.sev}</span>
                <span style={{ fontSize: 14, color: T.textBody }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Evidence + readiness */}
          <div style={{
            display: 'flex', gap: 16, marginTop: 16, alignItems: 'center',
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.attorneyStart + 22 }),
          }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>Evidence: 4/6 docs</span>
            <span style={{ fontSize: 13, color: T.textFaint }}>·</span>
            <span style={{ fontSize: 13, color: T.green, fontWeight: 700 }}>Score: 80 / 100</span>
          </div>

          <div style={{
            position: 'absolute', bottom: 70,
            fontSize: 14, color: T.green, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            ATTORNEY VIEW — Filing readiness and evidence gaps
          </div>
        </div>
      )}

      {/* ═══ SYNTHESIS ═══ */}
      {isSynthesis && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: interpolate(synthIn, [0, 1], [0, 1]),
        }}>
          <div style={{
            fontSize: 48, fontWeight: 700, fontFamily: FONT_DISPLAY, color: T.navy,
            textAlign: 'center',
            transform: `scale(${interpolate(synthIn, [0, 1], [0.85, 1])})`,
          }}>
            Same case.
          </div>
          <div style={{
            fontSize: 48, fontWeight: 700, fontFamily: FONT_DISPLAY, color: T.textSecondary,
            textAlign: 'center', marginTop: 6,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.synthesisStart + 10 }),
          }}>
            Different priorities.
          </div>

          {/* Role dots */}
          <div style={{
            display: 'flex', gap: 36, marginTop: 36,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.synthesisStart + 18 }),
          }}>
            {[
              { label: 'Applicant', color: T.blue, text: 'Guidance' },
              { label: 'Employer', color: T.amber, text: 'Deadlines' },
              { label: 'Attorney', color: T.green, text: 'Blockers' },
            ].map((r, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%', background: r.color,
                  margin: '0 auto 6px',
                }} />
                <div style={{ fontSize: 12, color: r.color, fontWeight: 700 }}>{r.label}</div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Score ring (light theme) */
const ScoreRing = ({ score, size = 120 }) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? T.green : score >= 60 ? T.amber : T.red;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.cardBorder} strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.3, fontWeight: 700, color: T.navy,
      }}>{score}</div>
    </div>
  );
};
