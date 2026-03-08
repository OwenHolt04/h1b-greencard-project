import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { AppFrame } from '../components/AppFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const ISSUES = [
  {
    id: 'soc-wage',
    severity: 'HIGH',
    sevColor: C.red600,
    sevBg: C.red50,
    title: 'SOC / Wage Data Mismatch',
    desc: 'Prevailing wage determination references Q4 2023 survey data, but current SOC code (15-1256.00) maps to Q2 2023 wage level. May trigger RFE.',
    forms: ['I-140', 'ETA-9089'],
    fix: 'Requires attorney review',
  },
  {
    id: 'employer-name',
    severity: 'MEDIUM',
    sevColor: C.amber600,
    sevBg: C.amber50,
    title: 'Employer Name Inconsistency',
    desc: '"Helix Systems Inc." in shared record vs. "Helix Systems, Inc." on I-140. Cross-form mismatch may delay adjudication.',
    forms: ['I-140', 'I-485', 'ETA-9089'],
    fix: 'Fix: Standardize to "Helix Systems, Inc."',
  },
  {
    id: 'travel-history',
    severity: 'LOW',
    sevColor: C.blue600,
    sevBg: C.blue50,
    title: 'Travel History Gap',
    desc: 'December 2023 international travel record has departure but no re-entry date logged.',
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
 * Beat 4 — Validation Catches Issues (18s)
 * The hero beat. "Check Readiness" fires → loading → 3 issues stagger in.
 * SOC/wage mismatch is highlighted as the most impactful.
 */
export const Beat4_Validation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing (in seconds → frames)
  const PHASE = {
    screenIn: 0,
    buttonHighlight: 1.5 * fps,
    loadingStart: 2.5 * fps,
    loadingEnd: 4.5 * fps,
    issue1: 5.0 * fps,
    issue2: 6.2 * fps,
    issue3: 7.4 * fps,
    highlight: 9.0 * fps,
    caption: 10.5 * fps,
  };

  const screenEnter = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  // Button highlight pulse
  const buttonPulse = frame > PHASE.buttonHighlight && frame < PHASE.loadingStart
    ? 0.5 + Math.sin((frame - PHASE.buttonHighlight) / 8) * 0.5
    : 0;

  // Loading spinner
  const isLoading = frame >= PHASE.loadingStart && frame < PHASE.loadingEnd;
  const loadingRotation = isLoading ? ((frame - PHASE.loadingStart) * 12) % 360 : 0;

  // Issues revealed
  const showResults = frame >= PHASE.loadingEnd;

  // SOC highlight — pulsing border on the SOC issue card
  const socHighlight = frame >= PHASE.highlight
    ? 0.3 + Math.sin((frame - PHASE.highlight) / 12) * 0.3
    : 0;

  return (
    <AbsoluteFill>
      <AppFrame activeScreen="Intake">
        <div
          style={{
            display: 'flex',
            gap: 20,
            padding: '20px 28px',
            height: '100%',
            opacity: interpolate(screenEnter, [0, 1], [0, 1]),
          }}
        >
          {/* LEFT — Shared Data (compact) */}
          <div style={{ width: 320, flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.slate800, marginBottom: 10 }}>
              Shared Case Data
            </div>
            <div style={{ ...cardStyle, padding: '12px 14px' }}>
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
                      padding: '6px 4px',
                      borderBottom: i < SHARED_FIELDS_COMPACT.length - 1 ? `1px solid ${C.slate100}` : 'none',
                      background: showHighlight ? highlightBg : 'transparent',
                      borderRadius: 4,
                      transition: 'none',
                    }}
                  >
                    <span style={{ fontSize: 12, color: C.slate500 }}>{f.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: showHighlight ? highlightColor : C.slate700,
                        }}
                      >
                        {f.value}
                      </span>
                      {showHighlight && (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
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
            <div style={{ fontSize: 14, fontWeight: 700, color: C.slate800, marginTop: 16, marginBottom: 8 }}>
              Affected Forms
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {FORMS_COMPACT.map((form, i) => {
                const hasIssue = showResults && form.issues > 0;
                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderColor: hasIssue ? C.amber500 : C.slate200,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.slate700 }}>{form.code}</span>
                    {hasIssue && (
                      <div style={badgeStyle(C.amber50, C.amber600)}>
                        {form.issues} {form.issues === 1 ? 'issue' : 'issues'}
                      </div>
                    )}
                    {!hasIssue && (
                      <span style={{ fontSize: 11, color: C.green600 }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Validation Results */}
          <div style={{ flex: 1 }}>
            {/* Header + Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.slate800 }}>
                  Pre-Flight Validation
                </div>
                <div style={{ fontSize: 13, color: C.slate500, marginTop: 2 }}>
                  {showResults
                    ? '3 issues found — review before filing'
                    : isLoading
                    ? 'Analyzing case data...'
                    : 'Run validation to check filing readiness'}
                </div>
              </div>
              <ReadinessScore fromScore={72} toScore={72} size={90} label="" />
            </div>

            {/* Button / Loading */}
            {!showResults && (
              <div
                style={{
                  ...cardStyle,
                  padding: '14px 20px',
                  textAlign: 'center',
                  background: isLoading ? C.slate50 : C.navy900,
                  color: isLoading ? C.slate600 : C.white,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 10,
                  boxShadow: buttonPulse > 0
                    ? `0 0 0 ${3 + buttonPulse * 4}px ${C.accent}60`
                    : cardStyle.boxShadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {isLoading && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: `2px solid ${C.slate300}`,
                      borderTopColor: C.navy700,
                      borderRadius: '50%',
                      transform: `rotate(${loadingRotation}deg)`,
                    }}
                  />
                )}
                {isLoading ? 'Analyzing case data...' : 'Run Pre-Flight Validation'}
              </div>
            )}

            {/* Issue Cards */}
            {showResults && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ISSUES.map((issue, i) => {
                  const issueDelay = [PHASE.issue1, PHASE.issue2, PHASE.issue3][i];
                  const issueEnter = spring({
                    frame: frame - issueDelay,
                    fps,
                    config: { damping: 200 },
                  });

                  const isSOC = issue.id === 'soc-wage';
                  const highlightBorder = isSOC ? `2px solid rgba(239, 68, 68, ${0.3 + socHighlight})` : `1px solid ${C.slate200}`;

                  if (frame < issueDelay) return null;

                  return (
                    <div
                      key={i}
                      style={{
                        ...cardStyle,
                        padding: '18px 20px',
                        border: highlightBorder,
                        opacity: interpolate(issueEnter, [0, 1], [0, 1]),
                        transform: `translateX(${interpolate(issueEnter, [0, 1], [24, 0])}px)`,
                        boxShadow: isSOC && socHighlight > 0
                          ? `0 0 0 ${socHighlight * 6}px rgba(239, 68, 68, 0.08), 0 1px 3px rgba(0,0,0,0.06)`
                          : cardStyle.boxShadow,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <div style={badgeStyle(issue.sevBg, issue.sevColor)}>{issue.severity}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.slate800 }}>
                              {issue.title}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: C.slate500, lineHeight: 1.5, marginBottom: 10 }}>
                            {issue.desc}
                          </div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: C.slate400 }}>Affects:</span>
                            {issue.forms.map((f, fi) => (
                              <div key={fi} style={badgeStyle(C.slate100, C.slate600)}>{f}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 12,
                          padding: '8px 14px',
                          borderRadius: 8,
                          background: issue.id === 'employer-name' ? C.accent : C.slate100,
                          color: issue.id === 'employer-name' ? C.navy900 : C.slate600,
                          fontSize: 12,
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
      </AppFrame>

      <Caption
        text={CAPTIONS.beat4.main}
        subtext={CAPTIONS.beat4.sub}
        delay={PHASE.caption}
      />
    </AbsoluteFill>
  );
};
