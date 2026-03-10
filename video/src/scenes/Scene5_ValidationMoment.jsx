import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const ISSUES = [
  {
    id: 'soc-wage', severity: 'HIGH', sevColor: C.red600, sevBg: 'rgba(239,68,68,0.15)',
    title: 'SOC / Wage Data Mismatch',
    desc: 'Wage survey reference (Q4 2023) conflicts with I-140 data (Q2 2023).',
    forms: ['I-140', 'ETA-9089'],
    fix: 'Requires attorney review',
  },
  {
    id: 'employer-name', severity: 'MEDIUM', sevColor: C.amber600, sevBg: 'rgba(245,158,11,0.15)',
    title: 'Employer Name Inconsistency',
    desc: `\u201C${CASE.employer.wrongName}\u201D vs. \u201C${CASE.employer.name}\u201D`,
    forms: ['I-140', 'I-485', 'ETA-9089'],
    fix: `Standardize to \u201C${CASE.employer.name}\u201D`,
    fixable: true,
  },
  {
    id: 'travel-history', severity: 'LOW', sevColor: C.blue600, sevBg: 'rgba(59,130,246,0.15)',
    title: 'Travel History Gap',
    desc: 'December 2023 travel record missing re-entry date.',
    forms: ['I-485'],
    fix: 'Requires applicant confirmation',
  },
];

const AFFECTED_FORMS = ['ETA-9089', 'I-140', 'I-485'];

/**
 * Scene 5 — Catch Errors Before Filing (25s / 750 frames)
 *
 * THE HERO SCENE. Strongest proof moment.
 * Dark space, floating modules, focus mask, connector lines, score morph.
 *
 * Visual arc:
 *   0-2s: "Pre-Flight Validation" title + scan button appear center
 *   2-3.5s: Button pulses, then "clicked"
 *   3.5-5s: Scanning animation — horizontal scan line sweeps
 *   5-8.5s: Three issue cards drop in with stagger, severity-ranked
 *   8.5-12s: Focus mask — everything dims except employer-name issue
 *            Connector lines draw from issue → affected form badges
 *   12-15s: Fix applied — field value morphs, green flash, issue card morphs to resolved
 *   15-17.5s: Three form cards flash green sequentially — "synced"
 *   17.5-20.5s: Score rises 72→80 as a centered hero animation
 *   20.5-23s: "Caught earlier." kinetic caption
 *   23-25s: Remaining callout settles
 */
export const Scene5_ValidationMoment = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const P = {
    titleIn: Math.round(0.3 * fps),
    buttonHighlight: Math.round(2 * fps),
    scanStart: Math.round(3.5 * fps),
    scanEnd: Math.round(5 * fps),
    issue1: Math.round(5.5 * fps),
    issue2: Math.round(6.5 * fps),
    issue3: Math.round(7.5 * fps),
    focusIn: Math.round(9 * fps),
    fixApplied: Math.round(12.5 * fps),
    formSync: Math.round(15 * fps),
    scoreRise: Math.round(17.5 * fps),
    kinetic: Math.round(20.5 * fps),
    remaining: Math.round(23 * fps),
  };

  /* ── Title + button ── */
  const titleEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.titleIn });
  const buttonActive = frame > P.buttonHighlight && frame < P.scanStart;
  const buttonPulse = buttonActive ? interpolate(Math.sin((frame - P.buttonHighlight) / 6), [-1, 1], [0, 1]) : 0;

  /* ── Scan line ── */
  const isScanning = frame >= P.scanStart && frame < P.scanEnd;
  const scanY = isScanning
    ? interpolate(frame, [P.scanStart, P.scanEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : -1;

  /* ── Issue appearance ── */
  const showIssues = frame >= P.scanEnd;

  /* ── Focus mask on employer-name issue ── */
  const focusMask = interpolate(frame, [P.focusIn, P.focusIn + 20, P.fixApplied - 10, P.fixApplied], [0, 0.7, 0.7, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Connector lines from employer issue to affected forms ── */
  const connectorEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.focusIn + 15 });
  const connectorDash = interpolate(connectorEnter, [0, 1], [200, 0]);

  /* ── Fix state ── */
  const fieldFixed = frame >= P.fixApplied;
  const fixFlash = interpolate(frame - P.fixApplied, [0, 8, 25], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Form sync flashes ── */
  const syncActive = frame >= P.formSync;

  /* ── Score animation ── */
  const scoreVisible = frame >= P.issue1;
  const scoreValue = interpolate(frame - P.scoreRise, [0, 2.5 * fps], [72, 80], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Kinetic caption ── */
  const kineticEnter = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: P.kinetic });
  const kineticExit = interpolate(frame, [P.kinetic + 50, P.kinetic + 65], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Layout positions ── */
  const issueCardX = 100;
  const issueCardW = 700;
  const formAreaX = 880;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Focus mask overlay ── */}
      {focusMask > 0 && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(14,26,74,0.85)',
          opacity: focusMask, zIndex: 10, pointerEvents: 'none',
        }} />
      )}

      {/* ── Title + Button area ── */}
      <div style={{
        position: 'absolute', top: 50, left: issueCardX, right: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        opacity: interpolate(titleEnter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(titleEnter, [0, 1], [16, 0])}px)`,
        zIndex: 15,
      }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.white, fontFamily: FONT_DISPLAY }}>
            Pre-Flight Validation
          </div>
          <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
            {isScanning ? 'Analyzing case data\u2026'
              : showIssues
                ? fieldFixed ? '1 resolved. 2 remaining for attorney review.' : `${frame >= P.issue3 ? 3 : frame >= P.issue2 ? 2 : 1} issue${frame >= P.issue2 ? 's' : ''} found`
                : 'Run validation to check filing readiness'}
          </div>
        </div>

        {/* Validation button (pre-scan) */}
        {!showIssues && !isScanning && (
          <div style={{
            padding: '14px 32px', borderRadius: 10,
            background: C.accent, color: C.navy900,
            fontSize: 18, fontWeight: 700,
            boxShadow: buttonPulse > 0
              ? `0 0 0 ${6 + buttonPulse * 10}px rgba(248,242,182,${0.2 + buttonPulse * 0.3})`
              : 'none',
            transform: `scale(${1 + buttonPulse * 0.03})`,
          }}>
            Check Readiness
          </div>
        )}

        {/* Readiness score */}
        {scoreVisible && (
          <div style={{ zIndex: 15 }}>
            <ReadinessScore
              fromScore={72}
              toScore={frame >= P.scoreRise ? 80 : 72}
              animDelay={P.scoreRise}
              animDuration={Math.round(2.5 * fps)}
              size={130}
              label=""
              popOnChange={frame >= P.scoreRise}
            />
          </div>
        )}
      </div>

      {/* ── Scan line ── */}
      {isScanning && (
        <div style={{
          position: 'absolute', left: issueCardX, width: issueCardW + 400,
          top: 140 + scanY * 700, height: 3, zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          boxShadow: `0 0 20px ${C.accent}`,
          opacity: 0.7,
        }} />
      )}

      {/* ═══════ ISSUE CARDS ═══════ */}
      {showIssues && ISSUES.map((issue, i) => {
        const issueDelay = [P.issue1, P.issue2, P.issue3][i];
        if (frame < issueDelay) return null;

        const iEnter = spring({ frame: frame - issueDelay, fps, config: { damping: 20, stiffness: 200 } });
        const isEmployer = issue.id === 'employer-name';
        const isResolved = isEmployer && fieldFixed;
        const isFocused = isEmployer && focusMask > 0;

        const cardY = 160 + i * 170;

        return (
          <div key={i} style={{
            position: 'absolute', left: issueCardX, top: cardY, width: issueCardW,
            opacity: isResolved ? 0.5 : interpolate(iEnter, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(iEnter, [0, 1], [40, 0])}px)`,
            zIndex: isFocused ? 20 : 5,
          }}>
            <div style={{
              background: isResolved
                ? 'rgba(34,197,94,0.06)'
                : isFocused
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isResolved ? 'rgba(34,197,94,0.3)' : isFocused ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14, padding: '22px 28px',
              boxShadow: isResolved && fixFlash > 0
                ? `0 0 ${30 * fixFlash}px rgba(34,197,94,0.3)`
                : isFocused ? '0 0 20px rgba(245,158,11,0.1)' : 'none',
            }}>
              {/* Severity + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  padding: '3px 12px', borderRadius: 9999, fontSize: 13, fontWeight: 700,
                  background: isResolved ? 'rgba(34,197,94,0.15)' : issue.sevBg,
                  color: isResolved ? C.green500 : issue.sevColor,
                }}>
                  {isResolved ? 'RESOLVED' : issue.severity}
                </div>
                <div style={{
                  fontSize: 20, fontWeight: 700, color: C.white,
                  textDecoration: isResolved ? 'line-through' : 'none',
                  opacity: isResolved ? 0.6 : 1,
                }}>
                  {issue.title}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, marginBottom: 12 }}>
                {issue.desc}
              </div>

              {/* Affected forms */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: isResolved ? 0 : 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Affects:</span>
                {issue.forms.map((f, fi) => (
                  <span key={fi} style={{
                    padding: '2px 10px', borderRadius: 9999, fontSize: 13, fontWeight: 600,
                    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)',
                  }}>{f}</span>
                ))}
              </div>

              {/* Fix action */}
              {!isResolved && (
                <div style={{
                  display: 'inline-block', padding: '8px 18px', borderRadius: 8,
                  background: issue.fixable ? C.accent : 'rgba(255,255,255,0.06)',
                  color: issue.fixable ? C.navy900 : 'rgba(255,255,255,0.5)',
                  fontSize: 14, fontWeight: 600,
                  boxShadow: issue.fixable && isFocused
                    ? `0 0 0 3px rgba(248,242,182,0.4), 0 0 20px rgba(248,242,182,0.2)`
                    : 'none',
                }}>
                  {issue.fix}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ═══════ AFFECTED FORM CARDS (right side) ═══════ */}
      {showIssues && (
        <div style={{
          position: 'absolute', right: 120, top: 170,
          display: 'flex', flexDirection: 'column', gap: 16, zIndex: focusMask > 0 ? 20 : 5,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4 }}>
            AFFECTED FORMS
          </div>
          {AFFECTED_FORMS.map((formCode, i) => {
            const fEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.issue1 + 20 + i * 8 });
            const synced = syncActive && fieldFixed;
            const syncFlash = synced
              ? interpolate(frame - (P.formSync + i * 10), [0, 8, 22], [0, 1, 0], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                })
              : 0;

            return (
              <div key={i} style={{
                opacity: interpolate(fEnter, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(fEnter, [0, 1], [20, 0])}px)`,
              }}>
                <div style={{
                  background: synced
                    ? `rgba(34,197,94,${0.04 + syncFlash * 0.1})`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${synced ? `rgba(34,197,94,${0.2 + syncFlash * 0.3})` : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, padding: '20px 28px', width: 320,
                  boxShadow: syncFlash > 0 ? `0 0 ${20 * syncFlash}px rgba(34,197,94,0.15)` : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: C.white }}>{formCode}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {fieldFixed
                        ? `Employer: ${CASE.employer.name}`
                        : `Employer: ${CASE.employer.wrongName}`}
                    </div>
                  </div>
                  {synced && (
                    <span style={{ fontSize: 16, color: C.green500, fontWeight: 700 }}>{'\u2713'}</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Score callout after fix */}
          {frame >= P.remaining && (() => {
            const callEnter = spring({ frame: frame - P.remaining, fps, config: { damping: 200 } });
            return (
              <div style={{
                marginTop: 16, padding: '14px 20px', borderRadius: 12,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderLeft: `3px solid ${C.amber500}`,
                opacity: interpolate(callEnter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(callEnter, [0, 1], [10, 0])}px)`,
                width: 320,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.amber500 }}>
                  72 {'\u2192'} 80. SOC/wage requires attorney review.
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ═══════ CONNECTOR LINES: Issue → Affected Forms ═══════ */}
      {focusMask > 0 && connectorEnter > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
          {/* Employer issue card (index 1, y=330) → form cards on right */}
          {AFFECTED_FORMS.map((_, i) => {
            const sx = issueCardX + issueCardW;
            const sy = 330 + 80;
            const dx = 1920 - 120 - 320;
            const dy = 210 + i * (80 + 16) + 30;
            const mx = (sx + dx) / 2;
            return (
              <path key={i}
                d={`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${dy}, ${dx} ${dy}`}
                fill="none" stroke={C.amber500} strokeWidth="1.5"
                opacity={interpolate(connectorEnter, [0, 1], [0, 0.4])}
                strokeDasharray="200" strokeDashoffset={connectorDash}
              />
            );
          })}
        </svg>
      )}

      {/* ═══════ Kinetic caption: "Caught earlier." ═══════ */}
      {frame >= P.kinetic && frame < P.kinetic + 65 && (
        <div style={{
          position: 'absolute', top: '45%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticEnter, [0, 1], [0.85, 1])})`,
          zIndex: 30, pointerEvents: 'none',
          opacity: interpolate(kineticEnter, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 60px rgba(14,26,74,0.95), 0 0 120px rgba(14,26,74,0.8)',
            letterSpacing: '-0.01em',
          }}>
            Caught earlier.
          </div>
        </div>
      )}

      <Caption
        text={CAPTIONS.scene5.main}
        subtext={CAPTIONS.scene5.sub}
        delay={Math.round(6 * fps)}
      />
    </AbsoluteFill>
  );
};
