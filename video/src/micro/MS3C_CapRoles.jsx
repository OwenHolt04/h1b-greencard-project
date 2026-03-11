import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * MS3C — Stakeholder Views + Wizard (22s/660f)
 *
 * TRUE MICRO-SCENE GRAMMAR:
 *   Phase 1 (0-1.5s): Tiny case anchor (top). Establishes shared truth.
 *   Phase 2 (1.5-10s): APPLICANT — wizard transformation
 *     2a (1.5-4s): Dense legal text wall appears, blurs, dissolves
 *     2b (4-7.5s): Fun wizard checks emerge — animated step cards
 *     2c (7.5-10s): Milestone notification cards slide in from right
 *   Phase 3 (10-14.5s): EMPLOYER — giant countdown, cost, auto-trigger
 *   Phase 4 (14.5-19s): ATTORNEY — issues dominate, score
 *   Phase 5 (19-22s): Synthesis — "Same case. Different priorities."
 */

const LEGAL_FRAGMENTS = [
  'INA § 245(a): An alien who was inspected and admitted or paroled into the United States...',
  '8 CFR § 204.5(k)(2): Petition for classification as member of the professions holding an advanced degree...',
  'INA § 203(b)(2)(A): Qualified immigrants who are members of the professions holding advanced degrees...',
  'USCIS Policy Manual, Vol. 7, Part A, Ch. 3: An applicant for adjustment of status must establish...',
  '20 CFR § 656.17(e)(1): The employer must document that it has made good faith recruitment efforts...',
];

const WIZARD_CHECKS = [
  { q: 'Do you hold a specialty occupation?', yes: true, plain: 'Your job requires specialized knowledge \u2014 it qualifies.' },
  { q: 'Is your priority date current?', yes: true, plain: 'After years of waiting, your date is finally current.' },
  { q: 'Are you in valid immigration status?', yes: true, plain: 'Your H-1B is still valid. Extension will be filed.' },
  { q: 'Are all required documents collected?', yes: false, plain: '2 documents still needed before filing.' },
];

const MILESTONES = [
  { icon: '\ud83d\udfe2', text: 'Priority date is now current', time: 'Feb 2026 bulletin' },
  { icon: '\ud83d\udce8', text: 'I-485 filing window open', time: '3 days ago' },
];

export const MS3C_CapRoles = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;

  // Phase boundaries
  const P = {
    anchorIn: Math.round(0.3 * fps),
    // Applicant wizard
    legalIn: Math.round(1.5 * fps),
    legalBlur: Math.round(3 * fps),
    wizardIn: Math.round(4 * fps),
    milestonesIn: Math.round(7.5 * fps),
    applicantExit: Math.round(9.5 * fps),
    // Employer
    employerStart: Math.round(10 * fps),
    employerExit: Math.round(14 * fps),
    // Attorney
    attorneyStart: Math.round(14.5 * fps),
    attorneyExit: Math.round(18.5 * fps),
    // Synthesis
    synthesisStart: Math.round(19 * fps),
  };

  // ── Case anchor ──
  const anchorIn = spring({ frame, fps, config: { damping: 200 }, delay: P.anchorIn });

  // ── Active role ──
  const isApplicant = frame >= P.legalIn && frame < P.employerStart;
  const isEmployer = frame >= P.employerStart && frame < P.attorneyStart;
  const isAttorney = frame >= P.attorneyStart && frame < P.synthesisStart;
  const isSynthesis = frame >= P.synthesisStart;
  const activeRole = isSynthesis ? 'All' : isAttorney ? 'Attorney' : isEmployer ? 'Employer' : isApplicant ? 'Applicant' : '';
  const roleColors = { Applicant: C.blue500, Employer: C.amber500, Attorney: C.green500, All: C.accent };
  const activeColor = roleColors[activeRole] || C.accent;

  // ── Phase 2a: Legal text wall ──
  const legalIn = spring({ frame, fps, config: { damping: 200 }, delay: P.legalIn });
  const legalBlur = interpolate(frame, [P.legalBlur, P.legalBlur + 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const legalOpacity = interpolate(frame, [P.legalBlur + 10, P.wizardIn], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 2b: Wizard checks ──
  const wizardIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.wizardIn });
  const wizardExit = interpolate(frame, [P.applicantExit, P.applicantExit + 15], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 2c: Milestones ──
  const msIn = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: P.milestonesIn });

  // ── Phase 3: Employer ──
  const empIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.employerStart });
  const empExit = interpolate(frame, [P.employerExit, P.employerExit + 15], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 4: Attorney ──
  const attIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.attorneyStart });
  const attExit = interpolate(frame, [P.attorneyExit, P.attorneyExit + 15], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 5: Synthesis ──
  const synthIn = spring({ frame, fps, config: { damping: 16, stiffness: 160 }, delay: P.synthesisStart });

  // Wizard progress dots
  const totalChecks = WIZARD_CHECKS.length;
  const activeCheck = Math.min(totalChecks - 1, Math.floor(
    interpolate(frame, [P.wizardIn + 12, P.wizardIn + 12 + totalChecks * 14], [0, totalChecks], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  ));

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* ── Minimal case anchor (top) ── */}
      <div style={{
        position: 'absolute', top: 28, left: CX, transform: 'translateX(-50%)',
        opacity: interpolate(anchorIn, [0, 1], [0, 0.7]),
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.06em' }}>
          CASE {CASE.caseId}
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
          {CASE.applicant.name} · {CASE.employer.shortName}
        </span>
        {activeRole && activeRole !== 'All' && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
            background: activeColor, color: activeRole === 'Employer' ? C.navy900 : C.white,
          }}>
            {activeRole}
          </span>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          PHASE 2: APPLICANT — Wizard Transformation
         ══════════════════════════════════════════════════════════ */}

      {/* 2a: Dense legal text wall → blur → dissolve */}
      {frame >= P.legalIn && legalOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: interpolate(legalIn, [0, 1], [0, 1]) * legalOpacity,
          filter: `blur(${legalBlur * 12}px)`,
        }}>
          <div style={{ width: 800, maxHeight: 420, overflow: 'hidden' }}>
            {LEGAL_FRAGMENTS.map((text, i) => {
              const fragIn = spring({ frame, fps, config: { damping: 200 }, delay: P.legalIn + i * 5 });
              return (
                <div key={i} style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8,
                  fontFamily: FONT_SANS, letterSpacing: '0.01em',
                  opacity: interpolate(fragIn, [0, 1], [0, 0.6]),
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  padding: '8px 0',
                }}>
                  {text}
                </div>
              );
            })}
          </div>
          <div style={{
            marginTop: 20, fontSize: 20, color: C.accent, fontWeight: 600,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2 * fps) }),
          }}>
            "What does this actually mean for my case?"
          </div>
        </div>
      )}

      {/* Shimmer transformation line (between legal dissolve and wizard emerge) */}
      {frame >= P.legalBlur && frame < P.wizardIn + 20 && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: interpolate(frame, [P.legalBlur, P.wizardIn], [0, 800], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          boxShadow: `0 0 30px ${C.accent}50`,
          opacity: interpolate(frame, [P.legalBlur, P.legalBlur + 15, P.wizardIn, P.wizardIn + 20], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          zIndex: 10,
        }} />
      )}

      {/* 2b: Wizard checks — fun animated step cards */}
      {frame >= P.wizardIn - 5 && wizardExit > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: wizardIn * wizardExit,
        }}>
          {/* Wizard header — cream focal card */}
          <div style={{
            ...CARD.focal,
            padding: '14px 32px', marginBottom: 20, textAlign: 'center',
            opacity: interpolate(wizardIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(wizardIn, [0, 1], [12, 0])}px)`,
          }}>
            <div style={{ fontSize: 11, color: C.navy900, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 3 }}>
              ELIGIBILITY CHECK
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900 }}>
              {CASE.applicant.name} — EB-2 India
            </div>
          </div>

          {/* Wizard check cards — vertical stack with animated reveal */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, width: 560,
          }}>
            {WIZARD_CHECKS.map((check, i) => {
              const cDelay = P.wizardIn + 12 + i * 14;
              const cIn = spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: cDelay });
              const answered = frame >= cDelay + 12;
              const isActive = i === activeCheck && !answered;

              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 18px', borderRadius: 12,
                  background: answered
                    ? (check.yes ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)')
                    : isActive ? 'rgba(248,242,182,0.06)' : 'rgba(255,255,255,0.02)',
                  border: answered
                    ? `1px solid ${check.yes ? 'rgba(34,197,94,0.2)' : C.amber500 + '25'}`
                    : isActive ? `1px solid rgba(248,242,182,0.15)` : '1px solid rgba(255,255,255,0.04)',
                  opacity: interpolate(cIn, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(cIn, [0, 1], [40, 0])}px)`,
                }}>
                  {/* Step number / check indicator */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: answered
                      ? (check.yes ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)')
                      : 'rgba(255,255,255,0.06)',
                    transition: 'all 0.3s',
                  }}>
                    {answered ? (
                      <span style={{
                        fontSize: 18, fontWeight: 700,
                        color: check.yes ? C.green500 : C.amber500,
                      }}>
                        {check.yes ? '\u2713' : '!'}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: 14, fontWeight: 700,
                        color: isActive ? C.accent : 'rgba(255,255,255,0.2)',
                      }}>
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Question + plain-language answer */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      color: answered ? 'rgba(255,255,255,0.7)' : isActive ? C.accent : 'rgba(255,255,255,0.4)',
                    }}>
                      {check.q}
                    </div>
                    {answered && (
                      <div style={{
                        fontSize: 13, marginTop: 3,
                        color: check.yes ? 'rgba(248,242,182,0.8)' : C.amber500,
                        fontWeight: 500,
                      }}>
                        {check.plain}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress dots */}
          <div style={{
            display: 'flex', gap: 8, marginTop: 16,
            opacity: interpolate(wizardIn, [0, 1], [0, 1]),
          }}>
            {WIZARD_CHECKS.map((_, i) => {
              const done = frame >= P.wizardIn + 12 + i * 14 + 12;
              return (
                <div key={i} style={{
                  width: done ? 24 : 8, height: 8, borderRadius: 4,
                  background: done ? C.accent : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                }} />
              );
            })}
          </div>

          {/* 2c: Milestone notifications (slide in from right) */}
          {frame >= P.milestonesIn && (
            <div style={{
              position: 'absolute', right: 60, top: '35%',
              display: 'flex', flexDirection: 'column', gap: 12,
              opacity: interpolate(msIn, [0, 1], [0, 1]),
            }}>
              {MILESTONES.map((m, i) => {
                const mDelay = P.milestonesIn + i * 12;
                const mIn = spring({ frame, fps, config: { damping: 20, stiffness: 160 }, delay: mDelay });
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px', borderRadius: 10,
                    background: 'rgba(251,253,235,0.08)',
                    border: '1px solid rgba(248,242,182,0.15)',
                    opacity: interpolate(mIn, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(mIn, [0, 1], [60, 0])}px)`,
                    width: 280,
                  }}>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>{m.text}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{m.time}</div>
                    </div>
                  </div>
                );
              })}
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginTop: 4, textAlign: 'center',
                opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.milestonesIn + 30 }),
              }}>
                Status calls: &minus;70%
              </div>
            </div>
          )}

          {/* Role label */}
          <div style={{
            position: 'absolute', bottom: 80,
            fontSize: 16, color: C.blue500, fontWeight: 700, letterSpacing: '0.06em',
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.wizardIn + 20 }),
          }}>
            APPLICANT VIEW — Plain-language guidance
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PHASE 3: EMPLOYER — Countdown dominates
         ══════════════════════════════════════════════════════════ */}
      {(frame >= P.employerStart - 5 && frame < P.attorneyStart + 5) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: empIn * empExit,
        }}>
          <div style={{
            fontSize: 180, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.amber500,
            lineHeight: 1,
            transform: `scale(${interpolate(empIn, [0, 1], [0.8, 1])})`,
          }}>
            102
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            days until H-1B expiry
          </div>

          {/* Cost + trigger row */}
          <div style={{
            display: 'flex', gap: 24, marginTop: 40,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.employerStart + 20 }),
          }}>
            <div style={{
              padding: '14px 28px', borderRadius: 12,
              background: 'rgba(245,158,11,0.06)', border: `1px solid ${C.amber500}25`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginBottom: 4 }}>EXTENSION COST</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.amber500 }}>~$2,500</div>
            </div>
            <div style={{
              padding: '14px 28px', borderRadius: 12,
              background: 'rgba(245,158,11,0.06)', border: `1px solid ${C.amber500}25`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginBottom: 4 }}>AUTO-TRIGGER</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.amber500 }}>90 days</div>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 80,
            fontSize: 16, color: C.amber500, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            EMPLOYER VIEW — Deadlines and costs
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PHASE 4: ATTORNEY — Issues dominate
         ══════════════════════════════════════════════════════════ */}
      {(frame >= P.attorneyStart - 5 && frame < P.synthesisStart + 5) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: attIn * attExit,
        }}>
          <div style={{
            fontSize: 100, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.green500,
            lineHeight: 1,
            transform: `scale(${interpolate(attIn, [0, 1], [0.8, 1])})`,
          }}>
            2
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            issues remaining
          </div>

          {/* Issue list */}
          <div style={{
            marginTop: 30, width: 500,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.attorneyStart + 15 }),
          }}>
            {[
              { sev: 'HIGH', color: C.red500, text: 'SOC / Wage Mismatch — review required' },
              { sev: 'LOW', color: C.blue500, text: 'Travel history gap — needs confirmation' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: item.color,
                  background: `${item.color}15`, padding: '3px 8px', borderRadius: 4,
                }}>{item.sev}</span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Score + evidence */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 24, alignItems: 'center',
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.attorneyStart + 25 }),
          }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Evidence: 4/6 docs</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>&middot;</span>
            <span style={{ fontSize: 14, color: C.green500, fontWeight: 700 }}>Readiness: 80</span>
          </div>

          <div style={{
            position: 'absolute', bottom: 80,
            fontSize: 16, color: C.green500, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            ATTORNEY VIEW — Filing readiness and blockers
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PHASE 5: SYNTHESIS
         ══════════════════════════════════════════════════════════ */}
      {isSynthesis && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: interpolate(synthIn, [0, 1], [0, 1]),
        }}>
          <div style={{
            fontSize: 52, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textAlign: 'center', lineHeight: 1.3,
            transform: `scale(${interpolate(synthIn, [0, 1], [0.85, 1])})`,
          }}>
            Same case.
          </div>
          <div style={{
            fontSize: 52, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.white,
            textAlign: 'center', lineHeight: 1.3, marginTop: 8,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.synthesisStart + 12 }),
          }}>
            Different priorities.
          </div>

          {/* Three role dots */}
          <div style={{
            display: 'flex', gap: 40, marginTop: 40,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.synthesisStart + 20 }),
          }}>
            {[
              { label: 'Applicant', color: C.blue500, text: 'Guidance' },
              { label: 'Employer', color: C.amber500, text: 'Deadlines' },
              { label: 'Attorney', color: C.green500, text: 'Blockers' },
            ].map((r, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', background: r.color,
                  margin: '0 auto 8px',
                }} />
                <div style={{ fontSize: 13, color: r.color, fontWeight: 700 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
