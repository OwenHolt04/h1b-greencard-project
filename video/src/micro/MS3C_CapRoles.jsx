import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from 'remotion';
import { C, CASE, CARD } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * MS3C — Role Switch (16s/480f)
 *
 * TRUE MICRO-SCENE GRAMMAR:
 * Each role OWNS THE FULL SCREEN. Not cards in a layout — full-canvas showcases.
 *
 *   Phase 1 (0-1.5s): Tiny case anchor (top, small). Establishes shared truth.
 *   Phase 2 (1.5-5.5s): APPLICANT — full-screen treatment. Big reassurance message.
 *   Phase 3 (5.5-10s): EMPLOYER — full-screen. Countdown dominates. Cost below.
 *   Phase 4 (10-14s): ATTORNEY — full-screen. Issues dominate. Score beside.
 *   Phase 5 (14-16s): Synthesis: "Same case. Different priorities."
 */
export const MS3C_CapRoles = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  // Phase boundaries
  const PHASE = {
    anchorIn: Math.round(0.3 * fps),
    applicantStart: Math.round(1.5 * fps),
    employerStart: Math.round(5.5 * fps),
    attorneyStart: Math.round(10 * fps),
    synthesisStart: Math.round(14 * fps),
  };

  // Current role
  const isApplicant = frame >= PHASE.applicantStart && frame < PHASE.employerStart;
  const isEmployer = frame >= PHASE.employerStart && frame < PHASE.attorneyStart;
  const isAttorney = frame >= PHASE.attorneyStart && frame < PHASE.synthesisStart;
  const isSynthesis = frame >= PHASE.synthesisStart;

  // Anchor
  const anchorIn = spring({ frame, fps, config: { damping: 200 }, delay: PHASE.anchorIn });

  // Role crossfade helpers
  const appIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: PHASE.applicantStart });
  const appExit = interpolate(frame, [PHASE.employerStart - 15, PHASE.employerStart], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const empIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: PHASE.employerStart });
  const empExit = interpolate(frame, [PHASE.attorneyStart - 15, PHASE.attorneyStart], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const attIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, delay: PHASE.attorneyStart });
  const attExit = interpolate(frame, [PHASE.synthesisStart - 10, PHASE.synthesisStart], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const synthIn = spring({ frame, fps, config: { damping: 16, stiffness: 160 }, delay: PHASE.synthesisStart });

  // Active role label
  const activeRole = isSynthesis ? 'All' : isAttorney ? 'Attorney' : isEmployer ? 'Employer' : isApplicant ? 'Applicant' : '';
  const roleColors = { Applicant: C.blue500, Employer: C.amber500, Attorney: C.green500, All: C.accent };
  const activeColor = roleColors[activeRole] || C.accent;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS, overflow: 'hidden',
    }}>
      {/* ── Minimal case anchor (top, small) ── */}
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

      {/* ── APPLICANT: Full-screen reassurance ── */}
      {(isApplicant || (frame >= PHASE.applicantStart - 5 && frame < PHASE.employerStart + 5)) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: appIn * appExit,
        }}>
          {/* Big reassurance */}
          <div style={{
            fontSize: 42, fontWeight: 700, color: C.white, fontFamily: FONT_DISPLAY,
            textAlign: 'center', maxWidth: 800, lineHeight: 1.3,
            transform: `translateY(${interpolate(appIn, [0, 1], [30, 0])}px)`,
          }}>
            Your case is on track, Prajwal.
          </div>
          <div style={{
            fontSize: 20, color: 'rgba(255,255,255,0.45)', marginTop: 20, textAlign: 'center', maxWidth: 600,
            opacity: interpolate(appIn, [0, 1], [0, 1]),
          }}>
            Priority date is current. I-485 package being prepared.
          </div>

          {/* Next step card */}
          <div style={{
            marginTop: 40, padding: '16px 32px', borderRadius: 12,
            background: 'rgba(251,253,235,0.08)', border: `1px solid rgba(248,242,182,0.15)`,
            maxWidth: 500, textAlign: 'center',
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: PHASE.applicantStart + 20 }),
          }}>
            <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, marginBottom: 6 }}>NEXT STEP</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)' }}>
              Wait for attorney to confirm job duties wording for filing.
            </div>
          </div>

          {/* Role label */}
          <div style={{
            position: 'absolute', bottom: 100,
            fontSize: 16, color: C.blue500, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            APPLICANT VIEW — Plain-language guidance
          </div>
        </div>
      )}

      {/* ── EMPLOYER: Countdown dominates ── */}
      {(isEmployer || (frame >= PHASE.employerStart - 5 && frame < PHASE.attorneyStart + 5)) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: empIn * empExit,
        }}>
          {/* Giant countdown */}
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
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: PHASE.employerStart + 20 }),
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
            position: 'absolute', bottom: 100,
            fontSize: 16, color: C.amber500, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            EMPLOYER VIEW — Deadlines and costs
          </div>
        </div>
      )}

      {/* ── ATTORNEY: Issues dominate ── */}
      {(isAttorney || (frame >= PHASE.attorneyStart - 5 && frame < PHASE.synthesisStart + 5)) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: attIn * attExit,
        }}>
          {/* Issue count hero */}
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
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: PHASE.attorneyStart + 15 }),
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
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: PHASE.attorneyStart + 25 }),
          }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Evidence: 4/6 docs</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span style={{ fontSize: 14, color: C.green500, fontWeight: 700 }}>Readiness: 80</span>
          </div>

          <div style={{
            position: 'absolute', bottom: 100,
            fontSize: 16, color: C.green500, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            ATTORNEY VIEW — Filing readiness and blockers
          </div>
        </div>
      )}

      {/* ── SYNTHESIS ── */}
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
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: PHASE.synthesisStart + 12 }),
          }}>
            Different priorities.
          </div>

          {/* Three role dots */}
          <div style={{
            display: 'flex', gap: 40, marginTop: 40,
            opacity: spring({ frame, fps, config: { damping: 200 }, delay: PHASE.synthesisStart + 20 }),
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
