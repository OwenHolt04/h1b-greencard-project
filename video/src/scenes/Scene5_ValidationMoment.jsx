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

/**
 * Scene 5 — Catch Errors Before Filing (25s / 750 frames)
 *
 * THE HERO SCENE. Centered, capability-first composition.
 *
 * Visual arc:
 *   0-2s: "Pre-Flight Validation" title + readiness ring (?) centered
 *   2-3.5s: Button pulses, then "clicked"
 *   3.5-5s: Scan line sweeps across centered area
 *   5-8.5s: Three issue cards drop in as centered stack
 *   8.5-12.5s: Hero focus — employer-name issue highlights,
 *              others dim, before/after values appear centered below,
 *              form badges cluster below values
 *   12.5-15s: Fix applied — green flash, values morph, issue resolves
 *   15-17.5s: Form badges flash green, score rises 72→80
 *   17.5-20.5s: "Caught earlier." kinetic caption
 *   20.5-25s: All issues visible, employer resolved, remaining callout
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
    valuesIn: Math.round(9.8 * fps),
    formsIn: Math.round(10.5 * fps),
    fixApplied: Math.round(12.5 * fps),
    formSync: Math.round(15 * fps),
    scoreRise: Math.round(17.5 * fps),
    kinetic: Math.round(20.5 * fps),
    remaining: Math.round(23 * fps),
  };

  /* ── Layout ── */
  const CX = 960;
  const CARD_W = 700;
  const cardLeft = CX - CARD_W / 2;

  /* ── Title + button ── */
  const titleEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.titleIn });
  const buttonActive = frame > P.buttonHighlight && frame < P.scanStart;
  const buttonPulse = buttonActive ? interpolate(Math.sin((frame - P.buttonHighlight) / 6), [-1, 1], [0, 1]) : 0;

  /* ── Scan line ── */
  const isScanning = frame >= P.scanStart && frame < P.scanEnd;
  const scanY = isScanning
    ? interpolate(frame, [P.scanStart, P.scanEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : -1;

  const showIssues = frame >= P.scanEnd;

  /* ── Focus on employer-name hero issue ── */
  const heroFocusIn = interpolate(frame, [P.focusIn, P.focusIn + 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const heroFocusOut = interpolate(frame, [P.fixApplied + 30, P.fixApplied + 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const focusAmount = Math.max(0, heroFocusIn - heroFocusOut);
  const focusMask = focusAmount * 0.8;

  /* ── Before/after values ── */
  const valuesEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.valuesIn });

  /* ── Form badges ── */
  const formsEnter = spring({ frame, fps, config: { damping: 200 }, delay: P.formsIn });

  /* ── Fix state ── */
  const fieldFixed = frame >= P.fixApplied;
  const fixFlash = interpolate(frame - P.fixApplied, [0, 8, 25], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Score animation ── */
  const scoreVisible = frame >= P.issue1;

  /* ── Kinetic caption ── */
  const kineticEnter = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: P.kinetic });
  const kineticExit = interpolate(frame, [P.kinetic + 50, P.kinetic + 65], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Issue card Y positions ── */
  const issueY = [170, 330, 480];

  /* ── During focus, hero issue shifts up and scales ── */
  const heroScale = interpolate(focusAmount, [0, 1], [1, 1.04]);
  const heroYShift = interpolate(focusAmount, [0, 1], [0, -20]);
  const nonHeroOpacity = interpolate(focusAmount, [0, 1], [1, 0.08]);

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
          position: 'absolute', inset: 0, background: 'rgba(14,26,74,0.88)',
          opacity: focusMask, zIndex: 10, pointerEvents: 'none',
        }} />
      )}

      {/* ── Title area — centered ── */}
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        opacity: interpolate(titleEnter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(titleEnter, [0, 1], [16, 0])}px)`,
        zIndex: 15,
      }}>
        <div style={{ width: CARD_W + 200, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

          {/* Score or button */}
          <div style={{ zIndex: 15 }}>
            {!showIssues && !isScanning ? (
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
            ) : scoreVisible ? (
              <ReadinessScore
                fromScore={72}
                toScore={frame >= P.scoreRise ? 80 : 72}
                animDelay={P.scoreRise}
                animDuration={Math.round(2.5 * fps)}
                size={110}
                label=""
                popOnChange={frame >= P.scoreRise}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Scan line ── */}
      {isScanning && (
        <div style={{
          position: 'absolute', left: cardLeft - 40, width: CARD_W + 80,
          top: 150 + scanY * 500, height: 3, zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          boxShadow: `0 0 20px ${C.accent}`,
          opacity: 0.7,
        }} />
      )}

      {/* ═══════ ISSUE CARDS — Centered Stack ═══════ */}
      {showIssues && ISSUES.map((issue, i) => {
        const issueDelay = [P.issue1, P.issue2, P.issue3][i];
        if (frame < issueDelay) return null;

        const iEnter = spring({ frame: frame - issueDelay, fps, config: { damping: 20, stiffness: 200 } });
        const isEmployer = issue.id === 'employer-name';
        const isResolved = isEmployer && fieldFixed;
        const isFocused = isEmployer && focusAmount > 0;

        // Position
        const baseY = issueY[i];
        const yOffset = isFocused ? heroYShift : 0;
        const scale = isFocused ? heroScale : 1;
        const opacity = isFocused || isEmployer
          ? (isResolved ? 0.5 : interpolate(iEnter, [0, 1], [0, 1]))
          : interpolate(iEnter, [0, 1], [0, 1]) * nonHeroOpacity;

        return (
          <div key={i} style={{
            position: 'absolute', left: cardLeft, top: baseY + yOffset, width: CARD_W,
            opacity,
            transform: `translateY(${interpolate(iEnter, [0, 1], [30, 0])}px) scale(${scale})`,
            transformOrigin: 'center top',
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
              {/* Severity + title row */}
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

      {/* ═══════ BEFORE/AFTER VALUE COMPARISON — Hero Focus Element ═══════ */}
      {focusAmount > 0 && (
        <div style={{
          position: 'absolute', top: 520, left: CX - 380, width: 760,
          opacity: interpolate(valuesEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(valuesEnter, [0, 1], [16, 0])}px)`,
          zIndex: 25,
        }}>
          {/* Label */}
          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600,
            letterSpacing: '0.08em', marginBottom: 14, textAlign: 'center',
          }}>
            FIELD VALUE COMPARISON
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
            {/* Wrong value */}
            <div style={{
              flex: 1, padding: '16px 20px', borderRadius: 10,
              background: fieldFixed ? 'rgba(255,255,255,0.02)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${fieldFixed ? 'rgba(255,255,255,0.06)' : 'rgba(245,158,11,0.25)'}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: fieldFixed ? 'rgba(255,255,255,0.2)' : C.amber500, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 8 }}>
                CURRENT (WRONG)
              </div>
              <div style={{
                fontSize: 20, fontWeight: 700, fontFamily: FONT_SANS,
                color: fieldFixed ? 'rgba(255,255,255,0.2)' : C.white,
                textDecoration: fieldFixed ? 'line-through' : 'none',
                letterSpacing: '0.01em',
              }}>
                {CASE.employer.wrongName}
              </div>
            </div>

            {/* Arrow */}
            <div style={{
              fontSize: 28, color: fieldFixed ? C.green500 : 'rgba(255,255,255,0.25)',
              flexShrink: 0, fontWeight: 700,
            }}>
              {'\u2192'}
            </div>

            {/* Correct value */}
            <div style={{
              flex: 1, padding: '16px 20px', borderRadius: 10,
              background: fieldFixed
                ? `rgba(34,197,94,${0.06 + fixFlash * 0.12})`
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${fieldFixed ? `rgba(34,197,94,${0.25 + fixFlash * 0.3})` : 'rgba(255,255,255,0.06)'}`,
              textAlign: 'center',
              boxShadow: fixFlash > 0 ? `0 0 ${24 * fixFlash}px rgba(34,197,94,0.2)` : 'none',
            }}>
              <div style={{ fontSize: 11, color: fieldFixed ? C.green500 : 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 8 }}>
                CORRECTED
              </div>
              <div style={{
                fontSize: 20, fontWeight: 700, fontFamily: FONT_SANS,
                color: fieldFixed ? C.green500 : 'rgba(255,255,255,0.2)',
                letterSpacing: '0.01em',
              }}>
                {CASE.employer.name}
              </div>
            </div>
          </div>

          {/* Affected form badges — centered row below */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20,
            opacity: interpolate(formsEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(formsEnter, [0, 1], [8, 0])}px)`,
          }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginRight: 4, alignSelf: 'center' }}>Synced across:</span>
            {ISSUES[1].forms.map((formCode, i) => {
              const synced = fieldFixed && frame >= P.formSync;
              const syncFlash = synced
                ? interpolate(frame - (P.formSync + i * 10), [0, 8, 22], [0, 1, 0], {
                    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                  })
                : 0;

              return (
                <div key={i} style={{
                  padding: '8px 20px', borderRadius: 10,
                  background: synced
                    ? `rgba(34,197,94,${0.06 + syncFlash * 0.12})`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${synced ? `rgba(34,197,94,${0.2 + syncFlash * 0.3})` : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: syncFlash > 0 ? `0 0 ${16 * syncFlash}px rgba(34,197,94,0.15)` : 'none',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: C.white }}>{formCode}</span>
                  {synced && (
                    <span style={{ fontSize: 14, color: C.green500, fontWeight: 700 }}>{'\u2713'}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ Score rise hero moment ═══════ */}
      {frame >= P.scoreRise && frame < P.kinetic && (() => {
        const scoreHeroEnter = spring({ frame: frame - P.scoreRise, fps, config: { damping: 18, stiffness: 120 } });
        return (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${interpolate(scoreHeroEnter, [0, 1], [0.85, 1])})`,
            zIndex: 30,
            opacity: interpolate(scoreHeroEnter, [0, 1], [0, 1]),
            textAlign: 'center',
          }}>
            <ReadinessScore
              fromScore={72}
              toScore={80}
              animDelay={0}
              animDuration={Math.round(2 * fps)}
              size={200}
              label=""
              popOnChange
            />
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginTop: 16, fontWeight: 500 }}>
              72 {'\u2192'} 80 {'\u2014'} one fix, measurable improvement
            </div>
          </div>
        );
      })()}

      {/* ═══════ Remaining callout ═══════ */}
      {frame >= P.remaining && (() => {
        const callEnter = spring({ frame: frame - P.remaining, fps, config: { damping: 200 } });
        return (
          <div style={{
            position: 'absolute', bottom: 160, left: CX - 250, width: 500,
            padding: '16px 24px', borderRadius: 12,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderLeft: `3px solid ${C.amber500}`,
            opacity: interpolate(callEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(callEnter, [0, 1], [10, 0])}px)`,
            zIndex: 25, textAlign: 'center',
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.amber500 }}>
              2 remaining issues require attorney review. Score: 80/100.
            </div>
          </div>
        );
      })()}

      {/* ═══════ Kinetic caption: "Caught earlier." ═══════ */}
      {frame >= P.kinetic && frame < P.kinetic + 65 && (
        <div style={{
          position: 'absolute', top: '45%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticEnter, [0, 1], [0.85, 1])})`,
          zIndex: 35, pointerEvents: 'none',
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
