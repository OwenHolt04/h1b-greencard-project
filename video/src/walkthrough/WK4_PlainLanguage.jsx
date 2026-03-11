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
 * WK4 — Plain Language + Chatbot (20s / 600f)
 *
 * Script beats:
 *   "the same case still serves different people"
 *   "Language differences can sometimes create gaps in understanding"
 *   "Our improved chatbot helps bridge that gap by breaking down
 *    complex immigration terminology into clear, simple explanations"
 *
 * Visual: Roles screen, applicant view, wizard checks, plain-language help panel
 */

const WIZARD_CHECKS = [
  { q: 'Do you hold a specialty occupation?', yes: true, plain: 'Your job requires specialized knowledge — it qualifies.' },
  { q: 'Does your education meet EB-2 requirements?', yes: true, plain: 'Your MBA meets the education bar for EB-2.' },
  { q: 'Has your employer committed to sponsorship?', yes: true, plain: 'HPE has already completed the sponsorship steps.' },
  { q: 'Is your priority date current?', yes: true, plain: 'After years of waiting, your date is finally current.' },
  { q: 'Are you in valid immigration status?', yes: true, plain: 'Your H-1B is still valid. Extension will be filed.' },
  { q: 'Are all required documents collected?', yes: false, plain: '2 documents still needed before filing.' },
];

const HELP_ITEMS = [
  {
    term: 'Priority Date',
    gov: 'The date established for the alien under section 203(b) of the INA...',
    plain: 'This is your place in line. Your priority date was set when your employer filed the PERM application. It becomes "current" when visa numbers are available for your category and country.',
  },
  {
    term: 'Adjustment of Status',
    gov: 'Application under INA § 245(a) for an alien inspected and admitted or paroled...',
    plain: 'This is the final step — changing your status from H-1B to permanent resident (green card) without leaving the country.',
  },
  {
    term: 'Advance Parole',
    gov: 'Authorization for an alien who has applied for adjustment under § 245...',
    plain: 'A travel permit that lets you leave and re-enter the U.S. while your green card application is pending. Without it, traveling could cancel your application.',
  },
];

export const WK4_PlainLanguage = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase: wizard (0-10s), then help/chatbot panel (10-20s)
  const showHelp = frame >= 10 * fps;
  const helpTransition = interpolate(frame, [10 * fps, 11 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Wizard check reveal progress
  const checkRevealFrame = 3 * fps;
  const checksRevealed = Math.min(WIZARD_CHECKS.length, Math.floor(
    interpolate(frame, [checkRevealFrame, checkRevealFrame + WIZARD_CHECKS.length * 15], [0, WIZARD_CHECKS.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  ));

  // Camera
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 3, zoom: 1.3, focusX: CONTENT.width * 0.4, focusY: 400 },  // zoom to wizard
    { t: 9, zoom: 1.3, focusX: CONTENT.width * 0.4, focusY: 400 },
    { t: 11, zoom: 1.4, focusX: CONTENT.width * 0.7, focusY: 350 }, // zoom to help panel
    { t: 18, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 1.5, x: 590, y: 96, visible: true },        // move to Roles tab
    { t: 2, x: 590, y: 96, click: true, visible: true },
    { t: 4, x: 450, y: 350, visible: true },           // hover wizard checks
    { t: 7, x: 450, y: 450, visible: true },
    { t: 9, x: 450, y: 500, visible: true },
    { t: 10.5, x: 1100, y: 300, visible: true },       // move to help panel
    { t: 13, x: 1100, y: 350, visible: true },
    { t: 15, x: 1100, y: 420, visible: true },         // hover over term
    { t: 18, x: 960, y: 500, visible: false },
  ]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS,
    }}>
      <BrowserFrame>
        <div style={cameraStyle(camera)}>
          <WebNavBar activeTab="Roles" />

          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            padding: '20px 28px',
          }}>
            {/* Role switcher */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {['Applicant', 'Employer', 'Attorney'].map((role, i) => (
                <div key={role} style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                  background: i === 0 ? '#3b82f6' : '#f1f5f9',
                  color: i === 0 ? '#ffffff' : '#64748b',
                }}>
                  {role}
                </div>
              ))}
            </div>

            {/* Two-column layout: wizard + help */}
            <div style={{ display: 'grid', gridTemplateColumns: showHelp ? '1fr 1fr' : '1fr', gap: 24 }}>
              {/* LEFT: Applicant view + wizard */}
              <div>
                {/* Greeting */}
                <WebCard style={{ marginBottom: 16, background: '#eff6ff', borderColor: '#3b82f640' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy900 }}>
                    Your case is on track, Krishna.
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                    Priority date is current. I-485 filing in preparation. 5 of 8 milestones complete.
                  </div>
                </WebCard>

                {/* Eligibility wizard */}
                <SectionLabel>Eligibility Check</SectionLabel>
                <WebCard style={{ padding: '14px 16px' }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: C.navy900, marginBottom: 12,
                    paddingBottom: 8, borderBottom: '1px solid #e2e8f0',
                  }}>
                    {CASE.applicant.name} — EB-2 India
                  </div>

                  {WIZARD_CHECKS.map((check, i) => {
                    const revealed = i < checksRevealed;
                    const answered = i < checksRevealed - 1 || (i === checksRevealed - 1 && frame >= checkRevealFrame + (i + 1) * 15);
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '8px 0',
                        borderBottom: i < WIZARD_CHECKS.length - 1 ? '1px solid #f1f5f9' : 'none',
                        opacity: revealed ? 1 : 0.3,
                      }}>
                        {/* Check indicator */}
                        <div style={{
                          width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: answered
                            ? (check.yes ? '#dcfce7' : '#fef3c7')
                            : '#f1f5f9',
                          marginTop: 2,
                        }}>
                          {answered ? (
                            <span style={{
                              fontSize: 12, fontWeight: 700,
                              color: check.yes ? '#16a34a' : '#f59e0b',
                            }}>
                              {check.yes ? '\u2713' : '!'}
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{i + 1}</span>
                          )}
                        </div>

                        <div>
                          <div style={{
                            fontSize: 13, fontWeight: 600,
                            color: revealed ? '#334155' : '#94a3b8',
                          }}>
                            {check.q}
                          </div>
                          {answered && (
                            <div style={{
                              fontSize: 12, color: check.yes ? '#16a34a' : '#f59e0b',
                              marginTop: 2, fontWeight: 500,
                            }}>
                              {check.plain}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Progress dots */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'center' }}>
                    {WIZARD_CHECKS.map((_, i) => (
                      <div key={i} style={{
                        width: i < checksRevealed ? 20 : 8, height: 6, borderRadius: 3,
                        background: i < checksRevealed ? '#3b82f6' : '#e2e8f0',
                      }} />
                    ))}
                  </div>
                </WebCard>
              </div>

              {/* RIGHT: Help / Chatbot panel */}
              {showHelp && (
                <div style={{
                  opacity: helpTransition,
                  transform: `translateX(${interpolate(helpTransition, [0, 1], [20, 0])}px)`,
                }}>
                  <SectionLabel>Immigration Help</SectionLabel>
                  <WebCard style={{
                    background: '#f8fafc', padding: '16px 18px',
                    borderColor: '#3b82f630',
                  }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: C.navy900, marginBottom: 4,
                    }}>
                      Understanding Your Case
                    </div>
                    <div style={{
                      fontSize: 11, color: '#64748b', marginBottom: 16,
                      paddingBottom: 10, borderBottom: '1px solid #e2e8f0',
                    }}>
                      Complex terms explained in plain language
                    </div>

                    {HELP_ITEMS.map((item, i) => {
                      const hDelay = 11 * fps + i * 20;
                      const hIn = spring({ frame, fps, config: { damping: 200 }, delay: hDelay });
                      const isExpanded = frame >= hDelay + 15;

                      return (
                        <div key={i} style={{
                          marginBottom: 12, borderRadius: 8,
                          background: '#ffffff', border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          opacity: interpolate(hIn, [0, 1], [0, 1]),
                          transform: `translateY(${interpolate(hIn, [0, 1], [10, 0])}px)`,
                        }}>
                          {/* Term header */}
                          <div style={{
                            padding: '10px 14px',
                            background: isExpanded ? '#eff6ff' : '#f8fafc',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy900 }}>{item.term}</span>
                            <span style={{ fontSize: 10, color: '#3b82f6' }}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
                          </div>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div style={{ padding: '10px 14px' }}>
                              {/* Gov language (struck through / dimmed) */}
                              <div style={{
                                fontSize: 10, color: '#94a3b8', marginBottom: 8,
                                fontStyle: 'italic', lineHeight: 1.4,
                                textDecoration: 'line-through',
                                opacity: 0.6,
                              }}>
                                {item.gov}
                              </div>

                              {/* Plain language */}
                              <div style={{
                                fontSize: 12, color: '#334155', lineHeight: 1.5,
                                padding: '8px 12px', borderRadius: 6,
                                background: '#f0fdf4', border: '1px solid #22c55e20',
                              }}>
                                {item.plain}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Chatbot hint */}
                    <div style={{
                      marginTop: 8, padding: '8px 12px', borderRadius: 8,
                      background: '#eff6ff', border: '1px solid #3b82f620',
                      display: 'flex', alignItems: 'center', gap: 8,
                      opacity: interpolate(frame, [14 * fps, 15 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    }}>
                      <span style={{ fontSize: 16 }}>{'\uD83D\uDCAC'}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1e40af' }}>Ask a question</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>Get plain-language help for any term</div>
                      </div>
                    </div>
                  </WebCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />
    </AbsoluteFill>
  );
};
