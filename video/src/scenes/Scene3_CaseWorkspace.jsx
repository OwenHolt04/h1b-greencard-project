import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const TIMELINE_STAGES = [
  { label: 'Eligibility', status: 'complete', date: 'Jan 2022' },
  { label: 'PWD', status: 'complete', date: 'Mar 2022' },
  { label: 'PERM', status: 'complete', date: 'Feb 2023' },
  { label: 'I-140', status: 'complete', date: 'Sep 2023' },
  { label: 'Visa Bulletin', status: 'complete', date: 'Feb 2026' },
  { label: 'I-485 Prep', status: 'active', date: 'Current' },
  { label: 'Biometrics', status: 'pending', date: '\u2014' },
  { label: 'Approval', status: 'pending', date: '\u2014' },
];

const AGENCIES = [
  { name: 'DOL', status: 'PERM Certified', color: C.green500 },
  { name: 'USCIS', status: 'I-140 Approved', color: C.green500 },
  { name: 'DOS', status: 'Priority Date Current', color: C.blue500 },
];

const ALERTS = [
  { text: 'H-1B expires in 102 days', color: C.amber500 },
  { text: 'Priority date now current — EB-2 India', color: C.green500 },
  { text: 'Attorney review pending: 3 items', color: C.blue500 },
];

/** Glassmorphism card for dark backgrounds */
const GlassCard = ({ children, style = {}, accentBorder = false }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    ...(accentBorder ? { borderTop: `3px solid ${C.accent}` } : {}),
    ...style,
  }}>
    {children}
  </div>
);

/**
 * Scene 3 — One Workspace, Full Journey (18s)
 *
 * Floating modules in dark space — NOT a dashboard.
 * Each module spotlights sequentially to build the "single source of truth" feeling.
 *
 * Visual arc:
 *   0-3s: Case identity module floats in center with glow
 *   2-4s: Readiness score appears to the right of case card
 *   3-8s: Timeline unfolds below — stages light up left to right
 *   7-11s: Three agency status modules float in from left
 *   10-14s: Alert modules slide in from right
 *   13-16s: Connector lines draw from case card to all modules
 *   16-18s: Everything settles, "one workspace" feeling complete
 */
export const Scene3_CaseWorkspace = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Spotlight glow follows focal area ── */
  const spotlightY = interpolate(
    frame,
    [0, 3 * fps, 7 * fps, 11 * fps, 16 * fps],
    [180, 180, 380, 560, 400],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const spotlightX = interpolate(
    frame,
    [0, 3 * fps, 7 * fps, 11 * fps],
    [960, 960, 960, 800],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  /* ── Module 1: Case Identity ── */
  const caseEnter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, delay: Math.round(0.5 * fps) });

  /* ── Module 2: Readiness Score ── */
  const scoreEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(2 * fps) });

  /* ── Module 3: Timeline ── */
  const timelineEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3.5 * fps) });
  const timelineLineProgress = interpolate(frame, [4 * fps, 7.5 * fps], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  /* ── Module 4: Agencies ── */
  const agencyBase = Math.round(7.5 * fps);

  /* ── Module 5: Alerts ── */
  const alertBase = Math.round(10.5 * fps);

  /* ── Connector lines from case card to modules ── */
  const connectorEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(13.5 * fps) });
  const connectorOpacity = interpolate(connectorEnter, [0, 1], [0, 0.25]);
  const connectorDash = interpolate(connectorEnter, [0, 1], [200, 0]);

  /* ── Dim factor: earlier modules dim slightly as new ones appear ── */
  const caseDim = interpolate(frame, [7 * fps, 9 * fps], [1, 0.7], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Spotlight glow ── */}
      <div style={{
        position: 'absolute', left: spotlightX, top: spotlightY,
        width: 800, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)', opacity: 0.07, pointerEvents: 'none',
        transition: 'all 0.3s ease-out',
      }} />

      {/* ═══════ MODULE 1: Case Identity ═══════ */}
      <div style={{
        position: 'absolute', top: 100, left: 140, width: 720,
        opacity: interpolate(caseEnter, [0, 1], [0, caseDim]),
        transform: `translateY(${interpolate(caseEnter, [0, 1], [20, 0])}px) scale(${interpolate(caseEnter, [0, 1], [0.95, 1])})`,
      }}>
        <GlassCard accentBorder style={{ padding: '28px 36px' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14 }}>
            CASE {CASE.caseId}
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.white, fontFamily: FONT_DISPLAY, marginBottom: 6 }}>
            {CASE.applicant.name}
          </div>
          <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
            {CASE.applicant.title} {'\u2022'} {CASE.employer.shortName} {'\u2022'} {CASE.stage}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em' }}>ATTORNEY</div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{CASE.attorney.name}, {CASE.attorney.firm}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em' }}>CATEGORY</div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{CASE.applicant.category} India</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ═══════ MODULE 2: Readiness Score ═══════ */}
      <div style={{
        position: 'absolute', top: 110, right: 200,
        opacity: interpolate(scoreEnter, [0, 1], [0, 1]),
        transform: `scale(${interpolate(scoreEnter, [0, 1], [0.8, 1])})`,
      }}>
        <GlassCard style={{ padding: '24px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>
            FILING READINESS
          </div>
          <ReadinessScore fromScore={72} toScore={72} size={120} label="" />
          <div style={{ fontSize: 28, fontWeight: 700, color: C.white, marginTop: 8 }}>72</div>
          <div style={{ fontSize: 13, color: C.amber500, fontWeight: 600, marginTop: 4 }}>3 issues pending</div>
        </GlassCard>
      </div>

      {/* ═══════ MODULE 3: Case Journey Timeline ═══════ */}
      <div style={{
        position: 'absolute', top: 330, left: 140, right: 140,
        opacity: interpolate(timelineEnter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(timelineEnter, [0, 1], [20, 0])}px)`,
      }}>
        <GlassCard style={{ padding: '24px 36px' }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 20 }}>
            CASE JOURNEY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Track line */}
            <div style={{ position: 'absolute', top: 10, left: 40, right: 40, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
            {/* Progress line */}
            {(() => {
              const activeIdx = TIMELINE_STAGES.findIndex(s => s.status === 'active');
              const pct = Math.min(timelineLineProgress, ((activeIdx + 0.5) / (TIMELINE_STAGES.length - 1)) * 100);
              return (
                <div style={{
                  position: 'absolute', top: 10, left: 40,
                  width: `${pct}%`, height: 2,
                  background: `linear-gradient(90deg, ${C.green500}, ${C.blue500})`,
                  borderRadius: 1, zIndex: 1,
                }} />
              );
            })()}

            {TIMELINE_STAGES.map((stage, i) => {
              const stageDelay = Math.round(4 * fps) + i * 8;
              const stageEnter = spring({ frame, fps, config: { damping: 200 }, delay: stageDelay });
              const isComplete = stage.status === 'complete';
              const isActive = stage.status === 'active';
              const dotColor = isComplete ? C.green500 : isActive ? C.blue500 : 'rgba(255,255,255,0.15)';
              const dotSize = isActive ? 14 : 10;
              const activePulse = isActive ? 1 + interpolate(Math.sin(frame / 8), [-1, 1], [0, 0.2]) : 1;

              return (
                <div key={i} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative', zIndex: 2,
                  opacity: interpolate(stageEnter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(stageEnter, [0, 1], [8, 0])}px)`,
                }}>
                  <div style={{
                    width: dotSize, height: dotSize, borderRadius: '50%', background: dotColor,
                    boxShadow: isActive ? `0 0 0 ${4 * activePulse}px rgba(59,130,246,0.2)` : 'none',
                    transform: `scale(${activePulse})`,
                  }} />
                  <div style={{
                    fontSize: 12, fontWeight: isActive ? 700 : 500, marginTop: 10, textAlign: 'center',
                    color: isActive ? C.blue500 : isComplete ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                  }}>
                    {stage.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                    {stage.date}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ═══════ MODULE 4: Agency Status ═══════ */}
      <div style={{
        position: 'absolute', top: 530, left: 140,
        display: 'flex', gap: 16,
      }}>
        {AGENCIES.map((agency, i) => {
          const aEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: agencyBase + i * 12 });
          return (
            <div key={i} style={{
              opacity: interpolate(aEnter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(aEnter, [0, 1], [-24, 0])}px)`,
            }}>
              <GlassCard style={{ padding: '20px 28px', minWidth: 220 }}>
                <div style={{
                  fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600,
                  letterSpacing: '0.08em', marginBottom: 10,
                }}>
                  {agency.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: agency.color }} />
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                    {agency.status}
                  </div>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* ═══════ MODULE 5: Alerts ═══════ */}
      <div style={{
        position: 'absolute', top: 530, right: 140,
        display: 'flex', flexDirection: 'column', gap: 10, width: 400,
      }}>
        {ALERTS.map((alert, i) => {
          const alEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: alertBase + i * 10 });
          return (
            <div key={i} style={{
              opacity: interpolate(alEnter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(alEnter, [0, 1], [30, 0])}px)`,
            }}>
              <GlassCard style={{
                padding: '14px 20px',
                borderLeft: `3px solid ${alert.color}`,
              }}>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  {alert.text}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* ═══════ Connector lines from case card to modules ═══════ */}
      {connectorOpacity > 0 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          {/* Case card → Timeline */}
          <path d="M 500 240 C 500 290, 500 310, 500 340" fill="none"
            stroke={C.accent} strokeWidth="1.5" opacity={connectorOpacity}
            strokeDasharray="200" strokeDashoffset={connectorDash} />
          {/* Case card → Score */}
          <path d="M 860 170 C 1000 170, 1200 150, 1400 170" fill="none"
            stroke={C.accent} strokeWidth="1" opacity={connectorOpacity * 0.7}
            strokeDasharray="200" strokeDashoffset={connectorDash} />
          {/* Timeline → Agencies */}
          <path d="M 400 480 C 400 510, 350 520, 350 540" fill="none"
            stroke={C.accent} strokeWidth="1" opacity={connectorOpacity * 0.7}
            strokeDasharray="200" strokeDashoffset={connectorDash} />
          {/* Timeline → Alerts */}
          <path d="M 1400 480 C 1400 510, 1500 520, 1500 540" fill="none"
            stroke={C.accent} strokeWidth="1" opacity={connectorOpacity * 0.7}
            strokeDasharray="200" strokeDashoffset={connectorDash} />
        </svg>
      )}

      <Caption
        text={CAPTIONS.scene3.main}
        subtext={CAPTIONS.scene3.sub}
        delay={Math.round(2 * fps)}
      />
    </AbsoluteFill>
  );
};
