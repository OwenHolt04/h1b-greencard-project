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
  { name: 'DOS', status: 'Priority Current', color: C.blue500 },
];

const ALERTS = [
  { text: 'H-1B expires in 102 days', color: C.amber500 },
  { text: 'Priority date now current', color: C.green500 },
  { text: 'Attorney review: 3 items', color: C.blue500 },
];

/** Glassmorphism card */
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
 * Scene 3 — One Workspace, Full Journey (18s / 540 frames)
 *
 * Progressive reveal composition: start tight on case identity,
 * viewport pulls back to reveal timeline, agencies, and alerts.
 *
 * Visual arc:
 *   0-3s: Case identity card centered with glow, readiness score beside it
 *   3-6s: Viewport pulls back, timeline unfolds below
 *   6-10s: Agency status badges appear as compact row below timeline
 *   10-13s: Alert modules slide in from bottom
 *   13-16s: Connector lines draw from case card to all modules
 *   16-18s: Everything settles
 */
export const Scene3_CaseWorkspace = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Viewport framing: start zoomed in, pull back ── */
  const viewportScale = interpolate(
    frame,
    [0, 0.5 * fps, 3 * fps, 6 * fps],
    [1.25, 1.25, 1.1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );
  const viewportY = interpolate(
    frame,
    [0, 3 * fps, 6 * fps],
    [-80, -40, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  /* ── Spotlight glow ── */
  const spotlightY = interpolate(
    frame,
    [0, 3 * fps, 7 * fps, 12 * fps],
    [200, 200, 400, 350],
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
  const agencyBase = Math.round(7 * fps);

  /* ── Module 5: Alerts ── */
  const alertBase = Math.round(10 * fps);

  /* ── Connectors ── */
  const connectorEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(13 * fps) });
  const connectorOpacity = interpolate(connectorEnter, [0, 1], [0, 0.2]);
  const connectorDash = interpolate(connectorEnter, [0, 1], [200, 0]);

  /* Layout: centered composition */
  const CX = 960;
  const mainW = 900;
  const mainLeft = CX - mainW / 2;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Spotlight glow ── */}
      <div style={{
        position: 'absolute', left: CX, top: spotlightY,
        width: 700, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)', opacity: 0.06, pointerEvents: 'none',
      }} />

      {/* ── Viewport frame ── */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${viewportScale}) translateY(${viewportY}px)`,
        transformOrigin: 'center 250px',
      }}>

        {/* ═══════ MODULE 1: Case Identity — Centered Hero ═══════ */}
        <div style={{
          position: 'absolute', top: 80, left: mainLeft, width: mainW,
          opacity: interpolate(caseEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(caseEnter, [0, 1], [20, 0])}px) scale(${interpolate(caseEnter, [0, 1], [0.95, 1])})`,
        }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {/* Case card */}
            <div style={{ flex: 1 }}>
              <GlassCard accentBorder style={{ padding: '28px 36px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14 }}>
                  CASE {CASE.caseId}
                </div>
                <div style={{ fontSize: 34, fontWeight: 700, color: C.white, fontFamily: FONT_DISPLAY, marginBottom: 6 }}>
                  {CASE.applicant.name}
                </div>
                <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)' }}>
                  {CASE.applicant.title} {'\u2022'} {CASE.employer.shortName} {'\u2022'} {CASE.stage}
                </div>
                <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em' }}>ATTORNEY</div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{CASE.attorney.name}, {CASE.attorney.firm}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em' }}>CATEGORY</div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{CASE.applicant.category} India</div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Readiness Score */}
            <div style={{
              opacity: interpolate(scoreEnter, [0, 1], [0, 1]),
              transform: `scale(${interpolate(scoreEnter, [0, 1], [0.8, 1])})`,
            }}>
              <GlassCard style={{ padding: '24px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>
                  FILING READINESS
                </div>
                <ReadinessScore fromScore={72} toScore={72} size={100} label="" />
                <div style={{ fontSize: 13, color: C.amber500, fontWeight: 600, marginTop: 8 }}>3 issues pending</div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* ═══════ MODULE 3: Case Journey Timeline — Below case card ═══════ */}
        <div style={{
          position: 'absolute', top: 310, left: mainLeft, width: mainW,
          opacity: interpolate(timelineEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(timelineEnter, [0, 1], [16, 0])}px)`,
        }}>
          <GlassCard style={{ padding: '22px 36px' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 18 }}>
              CASE JOURNEY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {/* Track */}
              <div style={{ position: 'absolute', top: 10, left: 30, right: 30, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
              {/* Progress */}
              {(() => {
                const activeIdx = TIMELINE_STAGES.findIndex(s => s.status === 'active');
                const pct = Math.min(timelineLineProgress, ((activeIdx + 0.5) / (TIMELINE_STAGES.length - 1)) * 100);
                return (
                  <div style={{
                    position: 'absolute', top: 10, left: 30,
                    width: `${pct}%`, height: 2,
                    background: `linear-gradient(90deg, ${C.green500}, ${C.blue500})`,
                    borderRadius: 1, zIndex: 1,
                  }} />
                );
              })()}

              {TIMELINE_STAGES.map((stage, i) => {
                const stageDelay = Math.round(4 * fps) + i * 7;
                const stageEnter = spring({ frame, fps, config: { damping: 200 }, delay: stageDelay });
                const isComplete = stage.status === 'complete';
                const isActive = stage.status === 'active';
                const dotColor = isComplete ? C.green500 : isActive ? C.blue500 : 'rgba(255,255,255,0.15)';
                const dotSize = isActive ? 12 : 8;
                const activePulse = isActive ? 1 + interpolate(Math.sin(frame / 8), [-1, 1], [0, 0.2]) : 1;

                return (
                  <div key={i} style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    position: 'relative', zIndex: 2,
                    opacity: interpolate(stageEnter, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(stageEnter, [0, 1], [6, 0])}px)`,
                  }}>
                    <div style={{
                      width: dotSize, height: dotSize, borderRadius: '50%', background: dotColor,
                      boxShadow: isActive ? `0 0 0 ${4 * activePulse}px rgba(59,130,246,0.2)` : 'none',
                      transform: `scale(${activePulse})`,
                    }} />
                    <div style={{
                      fontSize: 11, fontWeight: isActive ? 700 : 500, marginTop: 8, textAlign: 'center',
                      color: isActive ? C.blue500 : isComplete ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)',
                    }}>
                      {stage.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* ═══════ MODULE 4: Agency Status — Compact centered row ═══════ */}
        <div style={{
          position: 'absolute', top: 490, left: CX - 480, width: 960,
          display: 'flex', gap: 14, justifyContent: 'center',
        }}>
          {AGENCIES.map((agency, i) => {
            const aEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: agencyBase + i * 10 });
            return (
              <div key={i} style={{
                opacity: interpolate(aEnter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(aEnter, [0, 1], [16, 0])}px)`,
                flex: 1,
              }}>
                <GlassCard style={{ padding: '16px 22px' }}>
                  <div style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600,
                    letterSpacing: '0.08em', marginBottom: 8,
                  }}>
                    {agency.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: agency.color }} />
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                      {agency.status}
                    </div>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* ═══════ MODULE 5: Alerts — Compact centered row ═══════ */}
        <div style={{
          position: 'absolute', top: 610, left: CX - 480, width: 960,
          display: 'flex', gap: 14,
        }}>
          {ALERTS.map((alert, i) => {
            const alEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: alertBase + i * 10 });
            return (
              <div key={i} style={{
                opacity: interpolate(alEnter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(alEnter, [0, 1], [16, 0])}px)`,
                flex: 1,
              }}>
                <GlassCard style={{ padding: '14px 18px', borderLeft: `3px solid ${alert.color}` }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
                    {alert.text}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* ═══════ Connector lines ═══════ */}
        {connectorOpacity > 0 && (
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            {/* Case card → Timeline */}
            <path d={`M ${CX} 270 C ${CX} 290, ${CX} 300, ${CX} 310`} fill="none"
              stroke={C.accent} strokeWidth="1.5" opacity={connectorOpacity}
              strokeDasharray="200" strokeDashoffset={connectorDash} />
            {/* Timeline → Agencies */}
            <path d={`M ${CX} 460 C ${CX} 475, ${CX} 480, ${CX} 490`} fill="none"
              stroke={C.accent} strokeWidth="1" opacity={connectorOpacity * 0.7}
              strokeDasharray="200" strokeDashoffset={connectorDash} />
            {/* Agencies → Alerts */}
            <path d={`M ${CX} 580 C ${CX} 595, ${CX} 600, ${CX} 610`} fill="none"
              stroke={C.accent} strokeWidth="1" opacity={connectorOpacity * 0.7}
              strokeDasharray="200" strokeDashoffset={connectorDash} />
          </svg>
        )}

      </div>
      {/* End viewport frame */}

      <Caption
        text={CAPTIONS.scene3.main}
        subtext={CAPTIONS.scene3.sub}
        delay={Math.round(2 * fps)}
      />
    </AbsoluteFill>
  );
};
