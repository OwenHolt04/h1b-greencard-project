import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * MS3B2 — Plain-Language Wizard + Checklist (14s/420f)
 *
 * TRUE MICRO-SCENE GRAMMAR:
 *   Phase 1 (0-3s): Dense legal text wall. Confusing. Overwhelming.
 *   Phase 2 (3-8s): Transforms into guided wizard. 4 yes/no checks, plain language.
 *                    Each check uses a cream-surface card (website continuity).
 *   Phase 3 (8-11s): Brief checklist/completeness moment. "21 of 23 collected."
 *   Phase 4 (11-14s): "Plain language. Zero jargon." kinetic.
 */

const LEGAL_FRAGMENTS = [
  'INA § 245(a): An alien who was inspected and admitted or paroled into the United States...',
  '8 CFR § 204.5(k)(2): Petition for classification as member of the professions holding an advanced degree...',
  'INA § 203(b)(2)(A): Qualified immigrants who are members of the professions holding advanced degrees...',
  'USCIS Policy Manual, Vol. 7, Part A, Ch. 3: An applicant for adjustment of status must establish...',
  '20 CFR § 656.17(e)(1): The employer must document that it has made good faith recruitment efforts...',
];

const WIZARD_CHECKS = [
  { question: 'Do you hold a specialty occupation?', answer: true, plain: 'Your job requires specialized knowledge — it qualifies.' },
  { question: 'Is your priority date current?', answer: true, plain: 'After years of waiting, your date is finally current.' },
  { question: 'Are you in valid immigration status?', answer: true, plain: 'Your H-1B is still valid. Extension will be filed.' },
  { question: 'Are all required documents collected?', answer: false, plain: '2 documents still needed before filing.' },
];

const CHECKLIST_ITEMS = [
  { name: 'I-485 (signed)', status: 'done' },
  { name: 'I-765 (EAD)', status: 'done' },
  { name: 'I-131 (Advance Parole)', status: 'done' },
  { name: 'Birth certificate', status: 'done' },
  { name: 'Medical exam (I-693)', status: 'done' },
  { name: 'Employment verification', status: 'missing' },
  { name: 'Travel history (5yr)', status: 'flagged' },
  { name: 'Tax returns (3yr)', status: 'done' },
];

export const MS3B2_CapWizard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  const P = {
    legalIn: Math.round(0.3 * fps),
    legalExit: Math.round(2.5 * fps),
    wizardIn: Math.round(3 * fps),
    checklistIn: Math.round(8 * fps),
    checklistExit: Math.round(10.5 * fps),
    kineticIn: Math.round(11 * fps),
  };

  // ── Phase 1: Legal text wall ──
  const legalIn = spring({ frame, fps, config: { damping: 200 }, delay: P.legalIn });
  const legalExit = interpolate(frame, [P.legalExit, P.legalExit + 20], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 2: Wizard checks ──
  const wizardIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.wizardIn });

  // Wizard title
  const wizTitleIn = spring({ frame, fps, config: { damping: 200 }, delay: P.wizardIn });

  // ── Phase 3: Checklist ──
  const checkIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: P.checklistIn });
  const checkExit = interpolate(frame, [P.checklistExit, P.checklistExit + 15], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Wizard exits as checklist enters
  const wizardExit = interpolate(frame, [P.checklistIn - 10, P.checklistIn + 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 4: Kinetic ──
  const kineticIn = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: P.kineticIn });
  const kineticExit = interpolate(frame, [P.kineticIn + 50, P.kineticIn + 65], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* ── Phase 1: Dense legal text wall ── */}
      {legalExit > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: legalIn * legalExit,
        }}>
          <div style={{
            width: 800, maxHeight: 500, overflow: 'hidden',
          }}>
            {LEGAL_FRAGMENTS.map((text, i) => {
              const fragIn = spring({ frame, fps, config: { damping: 200 }, delay: P.legalIn + i * 6 });
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
          {/* "What does this mean for me?" */}
          <div style={{
            marginTop: 24, fontSize: 20, color: C.accent, fontWeight: 600,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.5 * fps) }),
          }}>
            "What does this actually mean for my case?"
          </div>
        </div>
      )}

      {/* ── Phase 2: Wizard — guided plain-language checks ── */}
      {frame > P.wizardIn - 10 && wizardExit > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: wizardIn * wizardExit,
        }}>
          {/* Wizard header — website-style card */}
          <div style={{
            ...CARD.focal,
            padding: '16px 32px', marginBottom: 20, textAlign: 'center',
            opacity: interpolate(wizTitleIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(wizTitleIn, [0, 1], [12, 0])}px)`,
          }}>
            <div style={{ fontSize: 11, color: C.navy900, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>
              ELIGIBILITY CHECK
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.navy900 }}>
              {CASE.applicant.name} — EB-2 India
            </div>
          </div>

          {/* Wizard checks — 2x2 grid of cream cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: 14,
            opacity: interpolate(wizardIn, [0, 1], [0, 1]),
          }}>
            {WIZARD_CHECKS.map((check, i) => {
              const cDelay = P.wizardIn + 12 + i * 10;
              const cIn = spring({ frame, fps, config: { damping: 200 }, delay: cDelay });
              const answered = frame >= cDelay + 18;

              return (
                <div key={i} style={{
                  ...CARD.supporting,
                  background: answered
                    ? (check.answer ? 'rgba(251,253,235,0.1)' : 'rgba(245,158,11,0.06)')
                    : 'rgba(255,255,255,0.03)',
                  border: answered
                    ? (check.answer ? `1px solid rgba(248,242,182,0.2)` : `1px solid ${C.amber500}20`)
                    : '1px solid rgba(255,255,255,0.06)',
                  padding: '14px 18px',
                  opacity: interpolate(cIn, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(cIn, [0, 1], [10, 0])}px)`,
                }}>
                  {/* Question */}
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 8 }}>
                    {check.question}
                  </div>
                  {/* Answer + plain language */}
                  {answered && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: check.answer ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                        marginTop: 1,
                      }}>
                        <span style={{ fontSize: 12, color: check.answer ? C.green500 : C.amber500, fontWeight: 700 }}>
                          {check.answer ? '✓' : '!'}
                        </span>
                      </div>
                      <div style={{
                        fontSize: 13, color: check.answer ? C.accent : C.amber500,
                        fontWeight: 500, lineHeight: 1.4,
                      }}>
                        {check.plain}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* "APPLICANT-FACING" label */}
          <div style={{
            position: 'absolute', bottom: 80,
            fontSize: 14, color: C.accent, fontWeight: 700, letterSpacing: '0.06em',
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.wizardIn + 30 }),
          }}>
            APPLICANT VIEW — Guided eligibility in plain language
          </div>
        </div>
      )}

      {/* ── Phase 3: Brief checklist / completeness ── */}
      {frame > P.checklistIn - 10 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: checkIn * checkExit,
        }}>
          {/* Checklist card — website focal card style */}
          <div style={{
            ...CARD.focal,
            width: 520, padding: '24px 28px',
            transform: `scale(${interpolate(checkIn, [0, 1], [0.95, 1])})`,
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
              {/* Progress badge */}
              <div style={{
                padding: '6px 14px', borderRadius: 8,
                background: 'rgba(248,242,182,0.3)',
                border: '1px solid rgba(248,242,182,0.4)',
              }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.navy900 }}>21</span>
                <span style={{ fontSize: 14, color: 'rgba(22,39,104,0.5)' }}> / 23</span>
              </div>
            </div>

            {/* Document items */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {CHECKLIST_ITEMS.map((doc, i) => {
                const dDelay = P.checklistIn + 8 + i * 3;
                const dIn = spring({ frame, fps, config: { damping: 200 }, delay: dDelay });
                const statusColor = doc.status === 'done' ? C.green600
                  : doc.status === 'missing' ? C.red500
                  : C.amber600;
                const statusIcon = doc.status === 'done' ? '✓'
                  : doc.status === 'missing' ? '—'
                  : '!';

                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 0',
                    borderBottom: '1px solid rgba(22,39,104,0.06)',
                    opacity: interpolate(dIn, [0, 1], [0, 1]),
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: doc.status === 'done' ? 'rgba(34,197,94,0.12)' : doc.status === 'missing' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.12)',
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: statusColor }}>{statusIcon}</span>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 500,
                      color: doc.status === 'done' ? 'rgba(22,39,104,0.5)' : C.navy900,
                      textDecoration: doc.status === 'done' ? 'none' : 'none',
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

      {/* ── Phase 4: Kinetic "Plain language. Zero jargon." ── */}
      {frame > P.kineticIn && frame < P.kineticIn + 65 && (
        <div style={{
          position: 'absolute', top: '46%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticIn, [0, 1], [0.8, 1])})`,
          zIndex: 30, opacity: interpolate(kineticIn, [0, 1], [0, 1]) * kineticExit,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 80px rgba(14,26,74,0.95), 0 0 160px rgba(14,26,74,0.9)',
          }}>
            Plain language. Zero jargon.
          </div>
          <div style={{
            marginTop: 16,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: P.kineticIn + 15 }),
          }}>
            <span style={{
              ...CARD.proof,
              fontSize: 18, fontWeight: 700, color: C.accent,
              display: 'inline-block',
            }}>
              Attorney basic-eligibility hours: ~8 → ~3
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
