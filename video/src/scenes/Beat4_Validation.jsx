import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle, badgeStyle } from '../lib/constants';
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
    desc: 'Wage survey data mismatch between SOC code and prevailing wage. May trigger RFE.',
    forms: ['I-140', 'ETA-9089'],
    fix: 'Requires attorney review',
  },
  {
    id: 'employer-name',
    severity: 'MEDIUM',
    sevColor: C.amber600,
    sevBg: C.amber50,
    title: 'Employer Name Inconsistency',
    desc: '\u201CHelix Systems Inc.\u201D vs. \u201CHelix Systems, Inc.\u201D \u2014 cross-form mismatch.',
    forms: ['I-140', 'I-485', 'ETA-9089'],
    fix: 'Fix: Standardize to \u201CHelix Systems, Inc.\u201D',
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
  { label: 'Full Name', value: 'Yuto Sato', highlight: false },
  { label: 'Employer', value: 'Helix Systems Inc.', highlight: 'amber' },
  { label: 'SOC Code', value: '15-1256.00', highlight: 'amber' },
  { label: 'Salary', value: '$165,000', highlight: 'amber' },
  { label: 'H-1B Expires', value: 'Jul 15, 2025', highlight: false },
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

/**
 * Beat 4 — Validation Catches Issues (16s / 480 frames)
 * The hero beat. "Check Readiness" fires -> loading -> 3 issues stagger in.
 * SOC/wage mismatch is spotlighted as the most impactful.
 */
export const Beat4_Validation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing (seconds -> frames)
  const PHASE = {
    screenIn: 0,
    buttonHighlight: 0.8 * fps,   // 24
    loadingStart: 1.5 * fps,      // 45
    loadingEnd: 2.0 * fps,        // 60
    issue1: 2.5 * fps,            // 75
    issue2: 3.7 * fps,            // 111
    issue3: 4.9 * fps,            // 147
    caption: 4.5 * fps,           // 135
    highlight: 6.5 * fps,         // 195
  };

  const screenEnter = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  // Button highlight pulse — stronger with scale
  const buttonActive = frame > PHASE.buttonHighlight && frame < PHASE.loadingStart;
  const buttonPulse = buttonActive
    ? 0.5 + Math.sin((frame - PHASE.buttonHighlight) / 6) * 0.5
    : 0;
  const buttonScale = buttonActive
    ? 1.0 + interpolate(
        Math.sin((frame - PHASE.buttonHighlight) / 6),
        [-1, 1],
        [0, 0.03],
      )
    : 1.0;

  // Loading spinner
  const isLoading = frame >= PHASE.loadingStart && frame < PHASE.loadingEnd;
  const loadingRotation = isLoading ? ((frame - PHASE.loadingStart) * 18) % 360 : 0;

  // Issues revealed
  const showResults = frame >= PHASE.loadingEnd;

  // Animated issue counter
  const issueCount = frame >= PHASE.issue3
    ? 3
    : frame >= PHASE.issue2
    ? 2
    : frame >= PHASE.issue1
    ? 1
    : 0;

  // Subtle amber overlay when issues start appearing
  const amberOverlayOpacity = showResults
    ? interpolate(
        spring({ frame: frame - PHASE.loadingEnd, fps, config: { damping: 200 } }),
        [0, 1],
        [0, 0.06],
        { extrapolateRight: 'clamp' },
      )
    : 0;

  // SOC spotlight — dark overlay + glow
  const spotlightActive = frame >= PHASE.highlight;
  const spotlightOpacity = spotlightActive
    ? interpolate(
        spring({ frame: frame - PHASE.highlight, fps, config: { damping: 200 } }),
        [0, 1],
        [0, 0.35],
        { extrapolateRight: 'clamp' },
      )
    : 0;

  // SOC glow ring pulsation
  const socGlow = spotlightActive
    ? 0.3 + Math.sin((frame - PHASE.highlight) / 10) * 0.3
    : 0;

  // Subheader text
  const subheaderText = isLoading
    ? 'Analyzing...'
    : showResults
    ? `${issueCount} issue${issueCount !== 1 ? 's' : ''} found \u2014 review before filing`
    : 'Run validation to check filing readiness';

  return (
    <AbsoluteFill>
      <MinimalFrame activeScreen="Intake">
        {/* Content wrapper — position:relative so spotlight overlay + cards share stacking context */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Amber tonal overlay when issues detected */}
          {amberOverlayOpacity > 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: C.amber500,
                opacity: amberOverlayOpacity,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}

          {/* SOC Spotlight — dark overlay, rendered inside content so z-index works with cards */}
          {spotlightOpacity > 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(22, 39, 104, ${spotlightOpacity})`,
                pointerEvents: 'none',
                zIndex: 10,
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
            }}
          >
            {/* LEFT — Shared Data (compact) */}
            <div style={{ width: 360, flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800, marginBottom: 12 }}>
                Shared Case Data
              </div>
              <div style={{ ...cardStyle, padding: '14px 16px' }}>
                {SHARED_FIELDS_COMPACT.map((f, i) => {
                  const showHighlight = showResults && f.highlight;
                  const highlightColor = f.highlight === 'amber' ? C.amber500 : C.blue500;
                  const highlightBg = f.highlight === 'amber' ? C.amber50 : C.blue50;

                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 6px',
                        borderBottom: i < SHARED_FIELDS_COMPACT.length - 1
                          ? `1px solid ${C.slate100}`
                          : 'none',
                        background: showHighlight ? highlightBg : 'transparent',
                        borderRadius: 4,
                      }}
                    >
                      <span style={{ fontSize: 16, color: C.slate500 }}>{f.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: showHighlight ? highlightColor : C.slate700,
                          }}
                        >
                          {f.value}
                        </span>
                        {showHighlight && (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              background: highlightColor,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compact form list */}
              <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800, marginTop: 20, marginBottom: 10 }}>
                Affected Forms
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FORMS_COMPACT.map((form, i) => {
                  const hasIssue = showResults && form.issues > 0;
                  return (
                    <div
                      key={i}
                      style={{
                        ...cardStyle,
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderColor: hasIssue ? C.amber500 : C.slate200,
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600, color: C.slate700 }}>{form.code}</span>
                      {hasIssue && (
                        <div style={badgeStyle(C.amber50, C.amber600, true)}>
                          {form.issues} {form.issues === 1 ? 'issue' : 'issues'}
                        </div>
                      )}
                      {!hasIssue && (
                        <span style={{ fontSize: 16, color: C.green600, fontWeight: 600 }}>&#10003;</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — Validation Results */}
            <div style={{ flex: 1, position: 'relative' }}>
              {/* Header + Score */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.slate800 }}>
                    Pre-Flight Validation
                  </div>
                  <div style={{ fontSize: 17, color: C.slate500, marginTop: 4 }}>
                    {subheaderText}
                  </div>
                </div>
                <ReadinessScore fromScore={72} toScore={72} size={110} label="" />
              </div>

              {/* Button (pre-loading) */}
              {!showResults && !isLoading && (
                <div
                  style={{
                    ...cardStyle,
                    padding: '18px 24px',
                    textAlign: 'center',
                    background: C.navy900,
                    color: C.white,
                    fontSize: 18,
                    fontWeight: 600,
                    borderRadius: 10,
                    boxShadow: buttonPulse > 0
                      ? `0 0 0 ${6 + buttonPulse * 8}px rgba(198,153,62,0.5)`
                      : cardStyle.boxShadow,
                    transform: `scale(${buttonScale})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  Run Pre-Flight Validation
                </div>
              )}

              {/* Centered loading spinner (64px) */}
              {isLoading && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 0',
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      border: `4px solid ${C.slate200}`,
                      borderTopColor: C.navy700,
                      borderRadius: '50%',
                      transform: `rotate(${loadingRotation}deg)`,
                    }}
                  />
                  <div style={{ fontSize: 17, fontWeight: 600, color: C.slate500 }}>
                    Analyzing case data...
                  </div>
                </div>
              )}

              {/* Issue Cards */}
              {showResults && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {ISSUES.map((issue, i) => {
                    const issueDelay = [PHASE.issue1, PHASE.issue2, PHASE.issue3][i];
                    const issueEnter = spring({
                      frame: frame - issueDelay,
                      fps,
                      config: { damping: 20, stiffness: 200 },
                    });

                    const isSOC = issue.id === 'soc-wage';

                    const translateX = interpolate(issueEnter, [0, 1], [40, 0], {
                      extrapolateRight: 'clamp',
                    });
                    const scale = interpolate(issueEnter, [0, 1], [0.92, 1.0], {
                      extrapolateRight: 'clamp',
                    });
                    const opacity = interpolate(issueEnter, [0, 1], [0, 1], {
                      extrapolateRight: 'clamp',
                    });

                    if (frame < issueDelay) return null;

                    // SOC card border — pulsing red when spotlighted
                    const borderStyle = isSOC && spotlightActive
                      ? `2px solid rgba(239, 68, 68, ${0.5 + socGlow})`
                      : `1px solid ${C.slate200}`;

                    // SOC card glow ring + elevated shadow when spotlighted
                    const cardShadow = isSOC && spotlightActive
                      ? `0 0 0 ${4 + socGlow * 8}px rgba(239, 68, 68, 0.12), 0 4px 20px rgba(0,0,0,0.10)`
                      : cardStyle.boxShadow;

                    return (
                      <div
                        key={i}
                        style={{
                          ...cardStyle,
                          padding: '20px 24px',
                          border: borderStyle,
                          opacity,
                          transform: `translateX(${translateX}px) scale(${scale})`,
                          boxShadow: cardShadow,
                          position: 'relative',
                          zIndex: isSOC && spotlightActive ? 20 : 5,
                          background: C.white,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                              <div style={badgeStyle(issue.sevBg, issue.sevColor, true)}>
                                {issue.severity}
                              </div>
                              <div style={{ fontSize: 20, fontWeight: 700, color: C.slate800 }}>
                                {issue.title}
                              </div>
                            </div>
                            <div style={{ fontSize: 16, color: C.slate500, lineHeight: 1.5, marginBottom: 12 }}>
                              {issue.desc}
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <span style={{ fontSize: 14, color: C.slate400 }}>Affects:</span>
                              {issue.forms.map((f, fi) => (
                                <div key={fi} style={badgeStyle(C.slate100, C.slate600, true)}>{f}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 14,
                            padding: '10px 16px',
                            borderRadius: 8,
                            background: issue.id === 'employer-name' ? C.accent : C.slate100,
                            color: issue.id === 'employer-name' ? C.navy900 : C.slate600,
                            fontSize: 15,
                            fontWeight: 600,
                            display: 'inline-block',
                          }}
                        >
                          {issue.fix}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </MinimalFrame>

      <Caption
        text={CAPTIONS.beat4.main}
        subtext={CAPTIONS.beat4.sub}
        delay={PHASE.caption}
      />
    </AbsoluteFill>
  );
};
