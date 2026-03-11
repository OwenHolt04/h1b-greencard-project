import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { T, V3_CARD, CASE } from './theme';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * V3S3 — Plain Language + Guidance (16s/480f)
 * Script lines 6-8: "Krishna sees plain-language guidance...
 *   consolidated checklist... chatbot helps bridge language gaps."
 *
 * Phase 1 (0-4s): Dense legal text wall → blur → dissolve
 * Phase 2 (4-9s): Wizard eligibility checks emerge
 * Phase 3 (9-13s): Document checklist card
 * Phase 4 (13-16s): Chatbot mention + settle
 */

const LEGAL_FRAGMENTS = [
  'INA § 245(a): An alien who was inspected and admitted or paroled...',
  '8 CFR § 204.5(k)(2): Petition for classification as member of the professions...',
  'USCIS Policy Manual, Vol. 7, Part A, Ch. 3: An applicant for adjustment...',
];

const WIZARD_CHECKS = [
  { q: 'Do you hold a specialty occupation?', yes: true, plain: 'Your job requires specialized knowledge — it qualifies.' },
  { q: 'Is your priority date current?', yes: true, plain: 'After years of waiting, your date is finally current.' },
  { q: 'Are you in valid immigration status?', yes: true, plain: 'Your H-1B is still valid. Extension will be filed.' },
  { q: 'Are all required documents collected?', yes: false, plain: '2 documents still needed before filing.' },
];

const CL_ITEMS = [
  { name: 'I-485 (signed)', s: 'done' },
  { name: 'I-765 (EAD)', s: 'done' },
  { name: 'I-131 (Advance Parole)', s: 'done' },
  { name: 'Birth certificate', s: 'done' },
  { name: 'Medical exam (I-693)', s: 'done' },
  { name: 'Employment verification', s: 'missing' },
  { name: 'Travel history (5yr)', s: 'flagged' },
  { name: 'Tax returns (3yr)', s: 'done' },
];

export const V3S3_PlainLanguage = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;

  // Phase 1: Legal text
  const legalIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.3 * fps) });
  const legalBlur = interpolate(frame, [2 * fps, 2.8 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const legalOpacity = interpolate(frame, [2.5 * fps, 3.5 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Shimmer line
  const shimmer = interpolate(frame, [2.5 * fps, 4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shimmerOpacity = interpolate(frame, [2.5 * fps, 3 * fps, 3.8 * fps, 4.2 * fps], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 2: Wizard
  const wizardIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(4 * fps) });
  const wizardExit = interpolate(frame, [8.5 * fps, 9.2 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Wizard progress
  const activeCheck = Math.min(WIZARD_CHECKS.length - 1, Math.floor(
    interpolate(frame, [4.5 * fps, 4.5 * fps + WIZARD_CHECKS.length * 14], [0, WIZARD_CHECKS.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  ));

  // Phase 3: Checklist
  const checklistIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: Math.round(9 * fps) });
  const checklistExit = interpolate(frame, [12.5 * fps, 13 * fps], [1, 0.3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 4: Chatbot card
  const chatIn = spring({ frame, fps, config: { damping: 18, stiffness: 140 }, delay: Math.round(13 * fps) });

  return (
    <AbsoluteFill style={{
      background: T.bgGradient,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: T.navy }} />

      {/* Phase 1: Legal text wall → blur → dissolve */}
      {legalOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: interpolate(legalIn, [0, 1], [0, 1]) * legalOpacity,
          filter: `blur(${legalBlur * 10}px)`,
        }}>
          <div style={{ width: 700 }}>
            {LEGAL_FRAGMENTS.map((text, i) => {
              const fragIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.3 * fps) + i * 5 });
              return (
                <div key={i} style={{
                  fontSize: 13, color: T.textSecondary, lineHeight: 1.8,
                  opacity: interpolate(fragIn, [0, 1], [0, 0.6]),
                  borderBottom: `1px solid ${T.cardBorder}`,
                  padding: '8px 0',
                }}>
                  {text}
                </div>
              );
            })}
          </div>
          <div style={{
            marginTop: 20, fontSize: 18, color: T.navy, fontWeight: 600, fontStyle: 'italic',
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1 * fps) }),
          }}>
            "What does this actually mean for my case?"
          </div>
        </div>
      )}

      {/* Shimmer transition line */}
      {shimmerOpacity > 0 && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: shimmer * 800, height: 2,
          background: `linear-gradient(90deg, transparent, ${T.navy}, transparent)`,
          opacity: shimmerOpacity * 0.4, zIndex: 10,
        }} />
      )}

      {/* Phase 2: Wizard eligibility checks */}
      {frame >= 3.8 * fps && wizardExit > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: wizardIn * wizardExit,
        }}>
          {/* Wizard header */}
          <div style={{
            ...V3_CARD.focal,
            padding: '12px 28px', marginBottom: 16, textAlign: 'center',
            borderTop: `3px solid ${T.navy}`,
            opacity: interpolate(wizardIn, [0, 1], [0, 1]),
          }}>
            <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 2 }}>
              ELIGIBILITY CHECK
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.navy }}>
              {CASE.applicant.name} — EB-2 India
            </div>
          </div>

          {/* Wizard check cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 520 }}>
            {WIZARD_CHECKS.map((check, i) => {
              const cDelay = Math.round(4.5 * fps) + i * 14;
              const cIn = spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: cDelay });
              const answered = frame >= cDelay + 12;
              const isActive = i === activeCheck && !answered;

              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px', borderRadius: 12,
                  background: answered
                    ? (check.yes ? T.greenBg : T.amberBg)
                    : isActive ? 'rgba(22,39,104,0.03)' : T.card,
                  border: `1px solid ${answered
                    ? (check.yes ? T.greenBorder : T.amberBorder)
                    : isActive ? 'rgba(22,39,104,0.12)' : T.cardBorder}`,
                  opacity: interpolate(cIn, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(cIn, [0, 1], [30, 0])}px)`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: answered
                      ? (check.yes ? T.greenBg : T.amberBg)
                      : 'rgba(22,39,104,0.04)',
                  }}>
                    {answered ? (
                      <span style={{ fontSize: 16, fontWeight: 700, color: check.yes ? T.green : T.amber }}>
                        {check.yes ? '✓' : '!'}
                      </span>
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? T.navy : T.textMuted }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: answered ? T.textBody : isActive ? T.navy : T.textMuted,
                    }}>
                      {check.q}
                    </div>
                    {answered && (
                      <div style={{
                        fontSize: 12, marginTop: 2,
                        color: check.yes ? T.green : T.amber, fontWeight: 500,
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
          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {WIZARD_CHECKS.map((_, i) => {
              const done = frame >= Math.round(4.5 * fps) + i * 14 + 12;
              return (
                <div key={i} style={{
                  width: done ? 20 : 8, height: 8, borderRadius: 4,
                  background: done ? T.navy : T.cardBorder,
                }} />
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 3: Document checklist */}
      {frame > 8.8 * fps && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: interpolate(checklistIn, [0, 1], [0, 1]) * checklistExit,
          zIndex: 15,
        }}>
          <div style={{
            ...V3_CARD.focal,
            width: 500, padding: '20px 24px',
            transform: `scale(${interpolate(checklistIn, [0, 1], [0.95, 1])})`,
            borderTop: `3px solid ${T.navy}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, letterSpacing: '0.06em' }}>
                  I-485 PACKAGE
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.navy }}>Document Readiness</div>
              </div>
              <div style={{
                padding: '5px 12px', borderRadius: 8,
                background: T.navy, color: '#fff',
              }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>6</span>
                <span style={{ fontSize: 13, opacity: 0.7 }}> / 8</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 14px' }}>
              {CL_ITEMS.map((doc, i) => {
                const dDelay = Math.round(9.2 * fps) + i * 3;
                const dIn = spring({ frame, fps, config: { damping: 200 }, delay: dDelay });
                const statusColor = doc.s === 'done' ? T.green : doc.s === 'missing' ? T.red : T.amber;
                const statusBg = doc.s === 'done' ? T.greenBg : doc.s === 'missing' ? T.redBg : T.amberBg;
                const statusIcon = doc.s === 'done' ? '✓' : doc.s === 'missing' ? '—' : '!';
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0',
                    borderBottom: `1px solid ${T.cardBorder}`,
                    opacity: interpolate(dIn, [0, 1], [0, 1]),
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: statusBg,
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: statusColor }}>{statusIcon}</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 500,
                      color: doc.s === 'done' ? T.textMuted : T.navy,
                    }}>
                      {doc.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.cardBorder}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>
                Updates automatically at every stage
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: T.amber,
                background: T.amberBg, padding: '2px 8px', borderRadius: 4,
              }}>
                2 ACTION ITEMS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Phase 4: Chatbot mention */}
      {frame > 13 * fps && (
        <div style={{
          position: 'absolute', bottom: 80, right: 120,
          opacity: interpolate(chatIn, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(chatIn, [0, 1], [40, 0])}px)`,
          zIndex: 20,
        }}>
          <div style={{
            ...V3_CARD.standard,
            padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
            borderLeft: `4px solid ${T.blue}`,
            width: 340,
          }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Built-in AI Chatbot</div>
              <div style={{ fontSize: 11, color: T.textSecondary }}>
                Breaks down complex terminology into simple explanations
              </div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
