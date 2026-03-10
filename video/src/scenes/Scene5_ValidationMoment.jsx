import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { MinimalFrame } from '../components/MinimalFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const ISSUES = [
  {
    id: 'soc-wage',
    severity: 'HIGH',
    sevColor: C.red600,
    sevBg: C.red50,
    title: 'SOC / Wage Data Mismatch',
    desc: 'Wage survey reference (Q4 2023) conflicts with I-140 data (Q2 2023). May trigger RFE.',
    forms: ['I-140', 'ETA-9089'],
    fix: 'Requires attorney review',
  },
  {
    id: 'employer-name',
    severity: 'MEDIUM',
    sevColor: C.amber600,
    sevBg: C.amber50,
    title: 'Employer Name Inconsistency',
    desc: `\u201C${CASE.employer.wrongName}\u201D vs. \u201C${CASE.employer.name}\u201D \u2014 cross-form mismatch.`,
    forms: ['I-140', 'I-485', 'ETA-9089'],
    fix: `Fix: Standardize to \u201C${CASE.employer.name}\u201D`,
    fixable: true,
  },
  {
    id: 'travel-history',
    severity: 'LOW',
    sevColor: C.blue600,
    sevBg: C.blue50,
    title: 'Travel History Gap',
    desc: 'December 2023 travel record missing re-entry date.',
    forms: ['I-485'],
    fix: 'Requires applicant confirmation',
  },
];

const SHARED_FIELDS_COMPACT = [
  { label: 'Full Name', value: CASE.applicant.name, highlight: false },
  { label: 'Employer', value: CASE.employer.wrongName, highlight: 'amber' },
  { label: 'SOC Code', value: CASE.applicant.soc, highlight: 'amber' },
  { label: 'Salary', value: CASE.applicant.salary, highlight: 'amber' },
  { label: 'H-1B Expires', value: CASE.applicant.h1bExpiry, highlight: false },
  { label: 'Travel Dec 2023', value: 'Incomplete', highlight: 'blue' },
];

const FORMS_COMPACT = [
  { code: 'ETA-9089', issues: 2 },
  { code: 'I-140', issues: 2 },
  { code: 'I-485', issues: 2 },
  { code: 'I-765', issues: 0 },
  { code: 'I-131', issues: 0 },
  { code: 'G-28', issues: 0 },
];

const SYNC_FORMS = [
  { code: 'ETA-9089', syncs: true },
  { code: 'I-140', syncs: true },
  { code: 'I-485', syncs: true },
  { code: 'I-765', syncs: false },
  { code: 'I-131', syncs: false },
  { code: 'G-28', syncs: false },
];

/**
 * Scene 5 — Validation Moment (16s / 480 frames)
 *
 * The hero scene. Merges old Beat4 + Beat5 into one continuous narrative.
 *
 * Visual arc:
 *   0-1.5s: Screen enters, button visible
 *   1.5-2.5s: Button highlight pulse → "clicked"
 *   2.5-3.5s: Loading spinner
 *   3.5-6s: Issues stagger in (three cards)
 *   6-8s: Camera zooms into employer name issue
 *   8-9.5s: Fix applied — field changes, green flash
 *   9.5-11s: Forms sync animation
 *   11-14s: Score rises 72→80, scale-pop
 *   14-16s: Remaining issues callout, score settles
 */
export const Scene5_ValidationMoment = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing
  const P = {
    screenIn: 0,
    buttonHighlight: Math.round(1.0 * fps),
    loadingStart: Math.round(2.0 * fps),
    loadingEnd: Math.round(3.0 * fps),
    issue1: Math.round(3.5 * fps),
    issue2: Math.round(4.3 * fps),
    issue3: Math.round(5.1 * fps),
    zoomIn: Math.round(6.0 * fps),
    fixApplied: Math.round(8.0 * fps),
    formSync: Math.round(9.0 * fps),
    scoreRise: Math.round(10.5 * fps),
    scoreEnd: Math.round(12.5 * fps),
    remainingCallout: Math.round(13.5 * fps),
  };

  const screenEnter = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  // Camera: zoom into employer name issue at 6s, then back out at 9.5s
  const zoomInProgress = interpolate(frame, [P.zoomIn, P.zoomIn + 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const zoomOutProgress = interpolate(frame, [P.formSync, P.formSync + 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const zoomLevel = interpolate(zoomInProgress - zoomOutProgress, [-1, 0, 1], [1.0, 1.0, 1.25]);
  const panX = interpolate(zoomInProgress - zoomOutProgress, [-1, 0, 1], [0, 0, 120]);
  const panY = interpolate(zoomInProgress - zoomOutProgress, [-1, 0, 1], [0, 0, -80]);

  // Button highlight pulse
  const buttonActive = frame > P.buttonHighlight && frame < P.loadingStart;
  const buttonPulse = buttonActive
    ? interpolate(Math.sin((frame - P.buttonHighlight) / 6), [-1, 1], [0, 1])
    : 0;
  const buttonScale = buttonActive
    ? 1.0 + interpolate(Math.sin((frame - P.buttonHighlight) / 6), [-1, 1], [0, 0.03])
    : 1.0;

  // Loading spinner
  const isLoading = frame >= P.loadingStart && frame < P.loadingEnd;
  const loadingRotation = isLoading ? ((frame - P.loadingStart) * 18) % 360 : 0;

  // Issues revealed
  const showResults = frame >= P.loadingEnd;

  // Amber overlay
  const amberOverlayOpacity = showResults
    ? interpolate(
        spring({ frame: frame - P.loadingEnd, fps, config: { damping: 200 } }),
        [0, 1], [0, 0.06], { extrapolateRight: 'clamp' },
      )
    : 0;

  // Fix state
  const fieldFixed = frame >= P.fixApplied;
  const fixFlashProgress = interpolate(
    frame - P.fixApplied, [0, 6, 15], [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Form sync
  const syncActive = frame >= P.formSync;
  const syncGlow = syncActive ? Math.max(0, 1 - (frame - P.formSync) / (2.5 * fps)) : 0;

  // Score animation
  const scoreValue = interpolate(
    frame - P.scoreRise, [0, 2 * fps], [72, 80],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Issue counter
  const issueCount = frame >= P.issue3 ? 3 : frame >= P.issue2 ? 2 : frame >= P.issue1 ? 1 : 0;

  // Subheader
  const subheaderText = isLoading
    ? 'Analyzing...'
    : showResults
    ? fieldFixed
      ? '1 issue resolved. 2 remaining for attorney review.'
      : `${issueCount} issue${issueCount !== 1 ? 's' : ''} found \u2014 review before filing`
    : 'Run validation to check filing readiness';

  return (
    <AbsoluteFill>
      <MinimalFrame activeScreen="Intake \u2022 Validation">
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Amber tonal overlay */}
          {amberOverlayOpacity > 0 && (
            <div
              style={{
                position: 'absolute', inset: 0,
                background: C.amber500, opacity: amberOverlayOpacity,
                pointerEvents: 'none', zIndex: 1,
              }}
            />
          )}

          <div
            style={{
              display: 'flex',
              gap: 24,
              padding: '24px 32px',
              height: '100%',
              opacity: interpolate(screenEnter, [0, 1], [0, 1]),
              fontFamily: FONT_SANS,
              position: 'relative',
              zIndex: 2,
              transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
              transformOrigin: '65% 50%',
            }}
          >
            {/* LEFT — Shared Data Compact */}
            <div style={{ width: 340, flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800, marginBottom: 12 }}>
                Shared Case Data
              </div>
              <div style={{ ...cardStyle, padding: '14px 16px' }}>
                {SHARED_FIELDS_COMPACT.map((f, i) => {
                  const showHighlight = showResults && f.highlight;
                  const highlightColor = f.highlight === 'amber' ? C.amber500 : C.blue500;
                  const highlightBg = f.highlight === 'amber' ? C.amber50 : C.blue50;

                  // Show fixed state for employer
                  const isEmployer = f.label === 'Employer';
                  const displayValue = isEmployer && fieldFixed ? CASE.employer.name : f.value;
                  const isFixed = isEmployer && fieldFixed;

                  let bg = 'transparent';
                  if (isFixed) {
                    bg = fixFlashProgress > 0 ? `rgba(255,255,255,${fixFlashProgress * 0.6})` : C.green50;
                  } else if (showHighlight) {
                    bg = highlightBg;
                  }

                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 6px',
                        borderBottom: i < SHARED_FIELDS_COMPACT.length - 1 ? `1px solid ${C.slate100}` : 'none',
                        background: bg,
                        borderRadius: 4,
                      }}
                    >
                      <span style={{ fontSize: 15, color: C.slate500 }}>{f.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 15, fontWeight: 600,
                            color: isFixed ? C.green700 : showHighlight ? highlightColor : C.slate700,
                          }}
                        >
                          {displayValue}
                        </span>
                        {isFixed && <span style={{ fontSize: 16, color: C.green600, fontWeight: 700 }}>{'\u2713'}</span>}
                        {showHighlight && !isFixed && (
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: highlightColor }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Affected forms list */}
              <div style={{ fontSize: 16, fontWeight: 700, color: C.slate800, marginTop: 16, marginBottom: 8 }}>
                Affected Forms
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {FORMS_COMPACT.map((form, i) => {
                  const hasIssue = showResults && form.issues > 0;
                  return (
                    <div
                      key={i}
                      style={{
                        ...cardStyle, padding: '8px 12px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderColor: hasIssue ? C.amber500 : C.slate200,
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 600, color: C.slate700 }}>{form.code}</span>
                      {hasIssue && (
                        <div style={badgeStyle(C.amber50, C.amber600)}>
                          {form.issues} {form.issues === 1 ? 'issue' : 'issues'}
                        </div>
                      )}
                      {!hasIssue && (
                        <span style={{ fontSize: 15, color: C.green600, fontWeight: 600 }}>{'\u2713'}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Form sync cards (after fix) */}
              {syncActive && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.green600, marginBottom: 6 }}>
                    3 forms synced automatically
                  </div>
                  {SYNC_FORMS.filter(f => f.syncs).map((form, i) => (
                    <div
                      key={i}
                      style={{
                        ...cardStyle, padding: '6px 12px', marginBottom: 4,
                        borderColor: C.accent, borderWidth: 2,
                        boxShadow: `0 0 0 ${syncGlow * 4}px ${C.accent}25`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.slate700 }}>{form.code}</span>
                      <span style={{ fontSize: 12, color: C.green600 }}>{'\u2713'} Updated</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Validation Results + Score */}
            <div style={{ flex: 1, position: 'relative' }}>
              {/* Header + Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.slate800 }}>
                    Pre-Flight Validation
                  </div>
                  <div style={{ fontSize: 16, color: C.slate500, marginTop: 4 }}>
                    {subheaderText}
                  </div>
                </div>
                <ReadinessScore
                  fromScore={72}
                  toScore={frame >= P.scoreRise ? 80 : 72}
                  animDelay={P.scoreRise}
                  animDuration={Math.round(2 * fps)}
                  size={120}
                  label=""
                  popOnChange={frame >= P.scoreRise}
                />
              </div>

              {/* Button (pre-loading) */}
              {!showResults && !isLoading && (
                <div
                  style={{
                    ...cardStyle, padding: '18px 24px', textAlign: 'center',
                    background: C.navy900, color: C.white, fontSize: 18, fontWeight: 600,
                    borderRadius: 10,
                    boxShadow: buttonPulse > 0
                      ? `0 0 0 ${6 + buttonPulse * 8}px rgba(198,153,62,0.5)`
                      : cardStyle.boxShadow,
                    transform: `scale(${buttonScale})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  }}
                >
                  Check Readiness
                </div>
              )}

              {/* Loading spinner */}
              {isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: 16 }}>
                  <div
                    style={{
                      width: 56, height: 56,
                      border: `4px solid ${C.slate200}`, borderTopColor: C.navy700,
                      borderRadius: '50%', transform: `rotate(${loadingRotation}deg)`,
                    }}
                  />
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.slate500 }}>
                    Analyzing case data\u2026
                  </div>
                </div>
              )}

              {/* Issue cards */}
              {showResults && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {ISSUES.map((issue, i) => {
                    const issueDelay = [P.issue1, P.issue2, P.issue3][i];
                    const issueEnter = spring({
                      frame: frame - issueDelay, fps,
                      config: { damping: 20, stiffness: 200 },
                    });

                    if (frame < issueDelay) return null;

                    const isEmployerName = issue.id === 'employer-name';
                    const isResolved = isEmployerName && fieldFixed;

                    const opacity = interpolate(issueEnter, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
                    const translateX = interpolate(issueEnter, [0, 1], [40, 0], { extrapolateRight: 'clamp' });

                    return (
                      <div
                        key={i}
                        style={{
                          ...cardStyle,
                          padding: '18px 22px',
                          opacity: isResolved ? 0.6 : opacity,
                          transform: `translateX(${translateX}px)`,
                          borderColor: isResolved ? C.green500 : C.slate200,
                          background: isResolved ? C.green50 : C.white,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                              <div style={badgeStyle(
                                isResolved ? C.green50 : issue.sevBg,
                                isResolved ? C.green600 : issue.sevColor,
                                true
                              )}>
                                {isResolved ? 'RESOLVED' : issue.severity}
                              </div>
                              <div
                                style={{
                                  fontSize: 18, fontWeight: 700, color: C.slate800,
                                  textDecoration: isResolved ? 'line-through' : 'none',
                                }}
                              >
                                {issue.title}
                              </div>
                            </div>
                            <div style={{ fontSize: 15, color: C.slate500, lineHeight: 1.4, marginBottom: 10 }}>
                              {issue.desc}
                            </div>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <span style={{ fontSize: 13, color: C.slate400 }}>Affects:</span>
                              {issue.forms.map((f, fi) => (
                                <div key={fi} style={badgeStyle(C.slate100, C.slate600)}>{f}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {!isResolved && (
                          <div
                            style={{
                              marginTop: 12, padding: '8px 14px', borderRadius: 8,
                              background: issue.fixable ? C.accent : C.slate100,
                              color: issue.fixable ? C.navy900 : C.slate600,
                              fontSize: 14, fontWeight: 600, display: 'inline-block',
                              boxShadow: issue.fixable && frame >= P.zoomIn && !fieldFixed
                                ? `0 0 0 3px ${C.accent}60`
                                : 'none',
                            }}
                          >
                            {issue.fix}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Remaining issues callout */}
              {frame >= P.remainingCallout && (() => {
                const calloutEnter = spring({ frame: frame - P.remainingCallout, fps, config: { damping: 20, stiffness: 200 } });
                return (
                  <div
                    style={{
                      marginTop: 14, ...cardStyle, padding: '12px 16px',
                      borderLeft: `3px solid ${C.amber500}`, background: C.amber50,
                      opacity: interpolate(calloutEnter, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(calloutEnter, [0, 1], [10, 0])}px)`,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.amber600 }}>
                      Score: 72 \u2192 80. SOC/wage review still required \u2014 attorney flagged.
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </MinimalFrame>

      <Caption
        text={CAPTIONS.scene5.main}
        subtext={CAPTIONS.scene5.sub}
        delay={Math.round(4 * fps)}
      />
    </AbsoluteFill>
  );
};
