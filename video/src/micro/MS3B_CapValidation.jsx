import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { FormFragment } from '../components/FormFragment';

/**
 * MS3B — Validation + Completeness (28s/840f) — HERO SCENE
 *
 * TRUE MICRO-SCENE GRAMMAR:
 *   Phase 1 (0-3s): A visible form (I-140) appears centered, large. THE TARGET.
 *   Phase 2 (3-5.5s): Scan line sweeps the form. Detecting.
 *   Phase 3 (5.5-10s): Form dims/shrinks. ONE issue EXTRACTED and enlarged center.
 *   Phase 4 (10-14s): Before/after comparison. Full-screen hero focus on the fix.
 *   Phase 5 (14-17s): Fix applied. Green propagation to affected form badges.
 *   Phase 6 (17-20s): Score rises. Other issues briefly appear at small scale.
 *   Phase 7 (20-23s): "Caught before filing." + "~25% → <5%"
 *   Phase 8 (23.5-28s): Completeness checklist — cream focal card, "21 of 23", done/missing/flagged.
 */
export const MS3B_CapValidation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  const P = {
    formIn: Math.round(0.5 * fps),
    scanStart: Math.round(3 * fps),
    scanEnd: Math.round(5.5 * fps),
    extractStart: Math.round(5.5 * fps),
    extractEnd: Math.round(7 * fps),
    beforeAfterIn: Math.round(8 * fps),
    fixApplied: Math.round(12 * fps),
    formBadgesIn: Math.round(13 * fps),
    scoreRise: Math.round(15.5 * fps),
    otherIssues: Math.round(17 * fps),
    kineticIn: Math.round(20 * fps),
    metricIn: Math.round(21.5 * fps),
    checklistIn: Math.round(23.5 * fps),
    checklistExit: Math.round(27 * fps),
  };

  // ── Phase 1: Target form ──
  const formIn = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: P.formIn });
  // Form shrinks away during extraction
  const formShrink = interpolate(frame, [P.extractStart, P.extractEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const formScale = interpolate(formShrink, [0, 1], [1.3, 0.5]);
  const formY = interpolate(formShrink, [0, 1], [CY - 60, 80]);
  const formOpacity = interpolate(formShrink, [0, 1], [1, 0.15]);

  // ── Phase 2: Scan ──
  const isScanning = frame >= P.scanStart && frame < P.scanEnd;
  const scanProgress = isScanning ? interpolate(frame, [P.scanStart, P.scanEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : -1;

  // ── Phase 3: Issue extraction ──
  const issueExtract = interpolate(frame, [P.extractStart + 15, P.extractEnd + 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const issueScale = interpolate(issueExtract, [0, 1], [0.5, 1]);
  const issueY = interpolate(issueExtract, [0, 1], [formY + 50, CY - 120]);

  // ── Phase 4: Before/after ──
  const baIn = spring({ frame, fps, config: { damping: 200 }, delay: P.beforeAfterIn });

  // ── Phase 5: Fix ──
  const isFixed = frame >= P.fixApplied;
  const fixFlash = interpolate(frame - P.fixApplied, [0, 10, 30], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Form badges
  const badgesIn = spring({ frame, fps, config: { damping: 200 }, delay: P.formBadgesIn });
  const AFFECTED_FORMS = ['I-140', 'I-485', 'ETA-9089'];

  // ── Phase 6: Score ──
  const scoreIn = spring({ frame, fps, config: { damping: 200 }, delay: P.scoreRise });
  const scoreValue = interpolate(frame, [P.scoreRise, P.scoreRise + 60], [72, 80], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Other issues (small, at edges)
  const othersIn = spring({ frame, fps, config: { damping: 200 }, delay: P.otherIssues });

  // ── Phase 7: Kinetic ──
  const kineticIn = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: P.kineticIn });
  const kineticExit = interpolate(frame, [P.kineticIn + 50, P.kineticIn + 65], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const metricIn = spring({ frame, fps, config: { damping: 200 }, delay: P.metricIn });

  // ── Phase 8: Completeness checklist ──
  const checklistIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.checklistIn });
  const checklistExit = interpolate(frame, [P.checklistExit, P.checklistExit + 15], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Dim everything else when checklist appears
  const priorDim = interpolate(frame, [P.checklistIn - 10, P.checklistIn + 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const CL_ITEMS = [
    { name: 'I-485 (signed)', s: 'done' }, { name: 'I-765 (EAD)', s: 'done' },
    { name: 'I-131 (Advance Parole)', s: 'done' }, { name: 'Birth certificate', s: 'done' },
    { name: 'Medical exam (I-693)', s: 'done' }, { name: 'Employment verification', s: 'missing' },
    { name: 'Travel history (5yr)', s: 'flagged' }, { name: 'Tax returns (3yr)', s: 'done' },
  ];

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* ── Phase 1: Target form (I-140), centered, large ── */}
      <div style={{
        position: 'absolute', left: CX, top: formY,
        transform: `translate(-50%, -50%) scale(${formScale})`,
        opacity: formOpacity * interpolate(formIn, [0, 1], [0, 1]),
        zIndex: 5,
      }}>
        <FormFragment
          formCode="I-140"
          fieldValue={CASE.employer.wrongName}
          isError={isScanning || issueExtract > 0}
          width={420}
        />
        {/* "Scanning..." label */}
        {isScanning && (
          <div style={{
            textAlign: 'center', marginTop: 16,
            fontSize: 13, color: C.accent, fontWeight: 600, letterSpacing: '0.06em',
          }}>
            ANALYZING CASE DATA...
          </div>
        )}
      </div>

      {/* ── Phase 2: Scan line ── */}
      {isScanning && (
        <div style={{
          position: 'absolute',
          left: CX - 250, width: 500,
          top: formY - 160 + scanProgress * 320,
          height: 3,
          background: `linear-gradient(90deg, transparent 0%, ${C.accent} 20%, ${C.accent} 80%, transparent 100%)`,
          boxShadow: `0 0 24px ${C.accent}60`,
          zIndex: 15,
        }} />
      )}

      {/* ── Phase 3-5: Extracted issue (hero) ── */}
      {issueExtract > 0 && (
        <div style={{
          position: 'absolute', left: CX, top: issueY,
          transform: `translate(-50%, -50%) scale(${issueScale})`,
          opacity: issueExtract * priorDim, zIndex: 20,
          width: 700,
        }}>
          {/* Issue card */}
          <div style={{
            background: isFixed ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isFixed ? C.green500 + '40' : C.amber500 + '30'}`,
            borderLeft: `5px solid ${isFixed ? C.green500 : C.amber600}`,
            borderRadius: 14, padding: '20px 28px',
            boxShadow: fixFlash > 0 ? `0 0 ${40 * fixFlash}px rgba(34,197,94,0.5)` : `0 4px 30px rgba(0,0,0,0.3)`,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: isFixed ? C.green500 : C.amber600,
                background: isFixed ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                padding: '3px 10px', borderRadius: 4,
              }}>
                {isFixed ? 'RESOLVED' : 'MEDIUM'}
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.white }}>
                Employer Name Inconsistency
              </span>
            </div>

            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
              "{CASE.employer.wrongName}" vs. "{CASE.employer.name}"
            </div>

            {/* ── Phase 4: Before / After (full-width comparison) ── */}
            <div style={{
              display: 'flex', gap: 20, alignItems: 'stretch',
              opacity: interpolate(baIn, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(baIn, [0, 1], [10, 0])}px)`,
            }}>
              {/* Before */}
              <div style={{
                flex: 1, padding: '14px 18px', borderRadius: 10,
                background: isFixed ? 'rgba(255,255,255,0.02)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${isFixed ? 'rgba(255,255,255,0.04)' : C.amber500 + '25'}`,
              }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 6 }}>BEFORE</div>
                <div style={{
                  fontSize: 18, fontWeight: 700,
                  color: isFixed ? 'rgba(255,255,255,0.2)' : C.amber500,
                  textDecoration: isFixed ? 'line-through' : 'none',
                }}>
                  {CASE.employer.wrongName}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: 'rgba(255,255,255,0.15)' }}>→</div>

              {/* After */}
              <div style={{
                flex: 1, padding: '14px 18px', borderRadius: 10,
                background: isFixed ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isFixed ? C.green500 + '30' : 'rgba(255,255,255,0.04)'}`,
              }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 6 }}>AFTER</div>
                <div style={{
                  fontSize: 18, fontWeight: 700,
                  color: isFixed ? C.green500 : 'rgba(255,255,255,0.25)',
                }}>
                  {CASE.employer.name}
                </div>
              </div>
            </div>

            {/* ── Phase 5: Form badges showing propagation ── */}
            {frame > P.formBadgesIn && (
              <div style={{
                display: 'flex', gap: 8, marginTop: 16,
                opacity: interpolate(badgesIn, [0, 1], [0, 1]),
              }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, paddingTop: 3 }}>
                  Corrected in:
                </span>
                {AFFECTED_FORMS.map((f, i) => {
                  const badgeDelay = P.formBadgesIn + i * 6;
                  const bIn = spring({ frame, fps, config: { damping: 200 }, delay: badgeDelay });
                  const bSynced = frame >= badgeDelay + 15;
                  return (
                    <span key={f} style={{
                      fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                      background: bSynced ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                      color: bSynced ? C.green500 : 'rgba(255,255,255,0.4)',
                      opacity: interpolate(bIn, [0, 1], [0, 1]),
                      boxShadow: bSynced && interpolate(frame - (badgeDelay + 15), [0, 8, 20], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) > 0.1
                        ? `0 0 12px rgba(34,197,94,0.3)` : 'none',
                    }}>
                      {bSynced ? `✓ ${f}` : f}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Phase 6: Score (centered below issue) ── */}
      {frame > P.scoreRise && (
        <div style={{
          position: 'absolute', left: CX, bottom: 200,
          transform: 'translateX(-50%)',
          opacity: interpolate(scoreIn, [0, 1], [0, 1]) * priorDim,
          zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <ScoreRing score={Math.round(scoreValue)} size={90} />
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>FILING READINESS</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.accent }}>72 → 80</div>
          </div>
        </div>
      )}

      {/* ── Phase 6b: Other issues at small scale (edges) ── */}
      {frame > P.otherIssues && (
        <div style={{
          position: 'absolute', left: 80, top: 200,
          opacity: interpolate(othersIn, [0, 1], [0, 0.5]) * priorDim,
          transform: `scale(0.7) translateX(${interpolate(othersIn, [0, 1], [-20, 0])}px)`,
        }}>
          {[
            { sev: 'HIGH', color: C.red500, title: 'SOC / Wage Mismatch' },
            { sev: 'LOW', color: C.blue500, title: 'Travel History Gap' },
          ].map((issue, i) => (
            <div key={i} style={{
              padding: '8px 14px', marginBottom: 8, borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              borderLeft: `3px solid ${issue.color}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: issue.color, background: `${issue.color}15`, padding: '1px 6px', borderRadius: 3 }}>{issue.sev}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{issue.title}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>2 remaining — attorney review</div>
        </div>
      )}

      {/* ── Phase 7: Kinetic "Caught before filing." ── */}
      {frame > P.kineticIn && frame < P.kineticIn + 65 && (
        <div style={{
          position: 'absolute', top: '46%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticIn, [0, 1], [0.8, 1])})`,
          zIndex: 30, opacity: interpolate(kineticIn, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 80px rgba(14,26,74,0.95), 0 0 160px rgba(14,26,74,0.9)',
          }}>
            Caught before filing.
          </div>
        </div>
      )}

      {/* ── Phase 7b: Metric ── */}
      {frame > P.metricIn && (
        <div style={{
          position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(metricIn, [0, 1], [0, 1]) * priorDim,
          zIndex: 25,
        }}>
          <span style={{
            ...CARD.proof,
            fontSize: 22, fontWeight: 700, color: C.accent,
          }}>
            ~25% → {'<'}5% RFE rate
          </span>
        </div>
      )}

      {/* ── Phase 8: Completeness checklist (centered focal card) ── */}
      {frame > P.checklistIn - 10 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: interpolate(checklistIn, [0, 1], [0, 1]) * checklistExit,
          zIndex: 35,
        }}>
          <div style={{
            ...CARD.focal,
            width: 540, padding: '24px 28px',
            transform: `scale(${interpolate(checklistIn, [0, 1], [0.95, 1])})`,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: C.navy900, fontWeight: 700, letterSpacing: '0.06em', opacity: 0.5 }}>
                  I-485 PACKAGE
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.navy900 }}>
                  Document Readiness
                </div>
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: 8,
                background: 'rgba(248,242,182,0.3)', border: '1px solid rgba(248,242,182,0.4)',
              }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.navy900 }}>21</span>
                <span style={{ fontSize: 14, color: 'rgba(22,39,104,0.5)' }}> / 23</span>
              </div>
            </div>

            {/* Document items 2-col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {CL_ITEMS.map((doc, i) => {
                const dDelay = P.checklistIn + 8 + i * 3;
                const dIn = spring({ frame, fps, config: { damping: 200 }, delay: dDelay });
                const statusColor = doc.s === 'done' ? C.green600 : doc.s === 'missing' ? C.red500 : C.amber600;
                const statusIcon = doc.s === 'done' ? '\u2713' : doc.s === 'missing' ? '\u2014' : '!';
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0',
                    borderBottom: '1px solid rgba(22,39,104,0.06)',
                    opacity: interpolate(dIn, [0, 1], [0, 1]),
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: doc.s === 'done' ? 'rgba(34,197,94,0.12)' : doc.s === 'missing' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.12)',
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: statusColor }}>{statusIcon}</span>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 500,
                      color: doc.s === 'done' ? 'rgba(22,39,104,0.5)' : C.navy900,
                    }}>
                      {doc.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(22,39,104,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, color: 'rgba(22,39,104,0.45)', fontWeight: 500 }}>
                Completeness visible at every stage
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: C.amber600,
                background: 'rgba(245,158,11,0.1)', padding: '3px 10px', borderRadius: 4,
              }}>
                2 ACTION ITEMS
              </span>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Inline score ring */
const ScoreRing = ({ score, size = 90 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? C.green500 : score >= 60 ? C.amber500 : C.red500;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.3, fontWeight: 700, color,
      }}>{score}</div>
    </div>
  );
};
