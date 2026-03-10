import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';

/**
 * Scene 2 — Platform Reveal (8s)
 *
 * Transition from chaos to order. CaseBridge emerges.
 * Camera: slow zoom into the interface chrome + case header.
 *
 * Visual arc:
 *   0-2s: Dark pause, glow appears
 *   2-4s: CaseBridge logo + tagline fade in
 *   4-6s: Interface chrome materializes
 *   6-8s: Case header reveals with Prajwal's data
 */
export const Scene2_PlatformReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Glow emerges from center
  const glowProgress = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const glowSize = interpolate(glowProgress, [0, 1], [0, 600]);
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.15]);

  // Phase 2: Logo + tagline
  const logoEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.0 * fps) });
  const taglineEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2.0 * fps) });

  // Phase 3: Interface chrome materializes
  const chromeEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(3.0 * fps) });

  // Phase 4: Case header reveals
  const caseHeaderEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(4.5 * fps) });

  // Camera: slow zoom in toward case header
  const zoom = interpolate(frame, [3 * fps, 8 * fps], [1.0, 1.06], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const panY = interpolate(frame, [3 * fps, 8 * fps], [0, 30], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Logo fades up as chrome appears
  const logoFade = interpolate(frame, [3.5 * fps, 4.5 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const CASE_HEADER_ITEMS = [
    { label: 'Applicant', value: CASE.applicant.name },
    { label: 'Employer', value: CASE.employer.shortName },
    { label: 'Stage', value: CASE.stage },
    { label: 'H-1B Expires', value: `${CASE.applicant.h1bDaysLeft} days`, isWarning: true },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_SANS,
        overflow: 'hidden',
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Centered logo (fades when chrome appears) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          opacity: logoFade,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontFamily: FONT_DISPLAY,
            color: C.accent,
            letterSpacing: '-0.02em',
            opacity: interpolate(logoEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(logoEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          CaseBridge
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.5)',
            marginTop: 12,
            opacity: interpolate(taglineEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(taglineEnter, [0, 1], [12, 0])}px)`,
          }}
        >
          One shared case record for the H-1B to green card journey
        </div>
      </div>

      {/* Interface chrome + case header (appears at 3s) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          opacity: interpolate(chromeEnter, [0, 1], [0, 1]),
          transform: `scale(${zoom}) translateY(${panY}px)`,
          transformOrigin: 'center 60%',
        }}
      >
        {/* Minimal nav bar */}
        <div
          style={{
            height: 48,
            background: C.navy900,
            display: 'flex',
            alignItems: 'center',
            padding: '0 32px',
            flexShrink: 0,
            borderBottom: `1px solid rgba(255,255,255,0.08)`,
          }}
        >
          <div
            style={{
              color: C.accent,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            CaseBridge
          </div>
          <div
            style={{
              width: 1,
              height: 18,
              background: 'rgba(255,255,255,0.15)',
              margin: '0 16px',
            }}
          />
          <div
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            Case Dashboard
          </div>
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            background: C.surface,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px',
          }}
        >
          {/* Case header card */}
          <div
            style={{
              background: C.navy900,
              borderRadius: 16,
              padding: '28px 48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: 1200,
              borderTop: `3px solid ${C.accent}`,
              opacity: interpolate(caseHeaderEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(caseHeaderEnter, [0, 1], [24, 0])}px)`,
            }}
          >
            {/* Case ID */}
            <div style={{ marginRight: 40 }}>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Case
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: C.accent,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {CASE.caseId}
              </div>
            </div>

            {/* Case details */}
            {CASE_HEADER_ITEMS.map((item, i) => {
              const itemDelay = Math.round(5.0 * fps) + i * 6;
              const itemEnter = spring({ frame, fps, config: { damping: 200 }, delay: itemDelay });
              return (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    opacity: interpolate(itemEnter, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(itemEnter, [0, 1], [8, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.35)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: item.isWarning ? C.amber500 : C.white,
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Caption
        text={CAPTIONS.scene2.main}
        subtext={CAPTIONS.scene2.sub}
        delay={Math.round(1.5 * fps)}
      />
    </AbsoluteFill>
  );
};
