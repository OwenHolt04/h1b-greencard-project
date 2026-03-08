import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * Floating form fragment — drifts across frame with rotation.
 * All animation driven by useCurrentFrame/interpolate (no CSS transitions).
 */
const FloatingFragment = ({ text, x, y, rotation, delay, frame, fps, color = C.white }) => {
  const enter = spring({ frame, fps, config: { damping: 200 }, delay });
  const drift = interpolate(frame, [delay, delay + 6 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const opacity = interpolate(enter, [0, 1], [0, 0.6], { extrapolateRight: 'clamp' });
  const driftX = interpolate(drift, [0, 1], [0, (Math.abs(x) > 400 ? -20 : 20)]);
  const driftY = interpolate(drift, [0, 1], [0, 12]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 960 + x,
        top: 540 + y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) translateX(${driftX}px) translateY(${driftY}px)`,
        opacity,
        fontSize: 16,
        fontWeight: 600,
        color,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '8px 16px',
        whiteSpace: 'nowrap',
        fontFamily: FONT_SANS,
      }}
    >
      {text}
    </div>
  );
};

const FRAGMENTS = [
  { text: 'ETA-9089', x: -520, y: -280, rotation: -4, delay: 80 },
  { text: 'I-140', x: 380, y: -200, rotation: 6, delay: 95 },
  { text: 'I-485', x: -300, y: -100, rotation: -2, delay: 110 },
  { text: 'I-765', x: 500, y: -60, rotation: 5, delay: 125 },
  { text: 'I-131', x: -450, y: 80, rotation: -7, delay: 140 },
  { text: 'G-28', x: 320, y: 140, rotation: 3, delay: 155 },
  { text: 'DOL Portal', x: -380, y: 200, rotation: -3, delay: 170, color: C.amber500 },
  { text: 'USCIS Portal', x: 420, y: 260, rotation: 4, delay: 180, color: C.amber500 },
  { text: 'DOS Portal', x: -200, y: 300, rotation: -5, delay: 190, color: C.amber500 },
  { text: 'Email chain #47', x: 250, y: -300, rotation: 7, delay: 200, color: C.slate400 },
];

/**
 * Scene 1 — Current State Chaos (12s)
 *
 * Prajwal's intro → scattered forms drift in → stat lines reveal.
 * Visual arc: identity → chaos → stark truth.
 */
export const Scene1_CurrentStateChaos = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Prajwal's identity (0-3.5s)
  const introEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const introSubEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.5 * fps) });

  // Phase 2: Form fragments drift in (2.5s-8s) — handled by FloatingFragment

  // Phase 3: Fragments fade, stat lines appear (8-12s)
  const chaosExit = interpolate(frame, [7 * fps, 8.5 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const introExit = interpolate(frame, [7 * fps, 8 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const line1Enter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(8.2 * fps) });
  const line2Enter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(9.0 * fps) });
  const line3Enter = spring({ frame, fps, config: { damping: 15, stiffness: 80, mass: 2 }, delay: Math.round(9.8 * fps) });
  const subEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(10.8 * fps) });

  // Divider between stats and subline
  const dividerProgress = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(10.5 * fps) });
  const dividerWidth = interpolate(dividerProgress, [0, 1], [0, 400], { extrapolateRight: 'clamp' });

  // Animated background gradient
  const bgAngle = interpolate(frame, [0, 12 * fps], [160, 175], { extrapolateRight: 'clamp' });

  const STAT_LINES = [
    { text: CAPTIONS.scene1.line1, enter: line1Enter, size: 88, color: C.white },
    { text: CAPTIONS.scene1.line2, enter: line2Enter, size: 88, color: C.white },
    { text: CAPTIONS.scene1.line3, enter: line3Enter, size: 110, color: C.accent },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${bgAngle}deg, #0e1a4a 0%, ${C.navy900} 50%, ${C.navy800} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_SANS,
        overflow: 'hidden',
      }}
    >
      {/* Phase 1: Prajwal intro */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          opacity: introExit,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            fontFamily: FONT_DISPLAY,
            color: C.accent,
            letterSpacing: '-0.02em',
            opacity: interpolate(introEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(introEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          {CAPTIONS.scene1.intro}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
            opacity: interpolate(introSubEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(introSubEnter, [0, 1], [12, 0])}px)`,
          }}
        >
          {CAPTIONS.scene1.introSub}
        </div>
      </div>

      {/* Phase 2: Floating form fragments */}
      <div style={{ position: 'absolute', inset: 0, opacity: chaosExit }}>
        {FRAGMENTS.map((frag, i) => (
          <FloatingFragment
            key={i}
            text={frag.text}
            x={frag.x}
            y={frag.y}
            rotation={frag.rotation}
            delay={frag.delay}
            frame={frame}
            fps={fps}
            color={frag.color || C.white}
          />
        ))}
      </div>

      {/* Phase 3: Stat lines */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 20,
        }}
      >
        {STAT_LINES.map(({ text, enter, size, color }, i) => (
          <div
            key={i}
            style={{
              fontSize: size,
              fontWeight: 700,
              fontFamily: FONT_DISPLAY,
              color,
              letterSpacing: '-0.02em',
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(enter, [0, 1], [i === 2 ? 40 : 24, 0])}px)`,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Divider with glow */}
      <div
        style={{
          width: dividerWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          marginTop: 36,
          marginBottom: 24,
          boxShadow: '0 0 16px rgba(248, 242, 182, 0.4)',
          zIndex: 20,
        }}
      />

      {/* Subline */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.01em',
          opacity: interpolate(subEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subEnter, [0, 1], [12, 0])}px)`,
          zIndex: 20,
        }}
      >
        {CAPTIONS.scene1.sub}
      </div>
    </AbsoluteFill>
  );
};
