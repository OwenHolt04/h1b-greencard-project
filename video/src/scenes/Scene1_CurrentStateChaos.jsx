import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';

/**
 * Floating form fragment — drifts across frame with rotation.
 */
const FloatingFragment = ({ text, x, y, rotation, delay, frame, fps, color = C.white }) => {
  const enter = spring({ frame, fps, config: { damping: 200 }, delay });
  const drift = interpolate(frame, [delay, delay + 8 * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const opacity = interpolate(enter, [0, 1], [0, 0.6], { extrapolateRight: 'clamp' });
  const driftX = interpolate(drift, [0, 1], [0, (Math.abs(x) > 400 ? -25 : 25)]);
  const driftY = interpolate(drift, [0, 1], [0, 15]);

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

/**
 * Pain annotation — red-tinted callout that appears near form fragments.
 */
const PainAnnotation = ({ text, x, y, delay, frame, fps }) => {
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay });
  const opacity = interpolate(enter, [0, 1], [0, 0.85], { extrapolateRight: 'clamp' });
  const scale = interpolate(enter, [0, 1], [0.85, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: 960 + x,
        top: 540 + y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        fontFamily: FONT_SANS,
      }}
    >
      {/* Red dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: C.red500,
          boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: C.red500,
          letterSpacing: '0.01em',
        }}
      >
        {text}
      </span>
    </div>
  );
};

const FRAGMENTS = [
  { text: 'ETA-9089', x: -520, y: -280, rotation: -4, delay: 100 },
  { text: 'I-140', x: 380, y: -200, rotation: 6, delay: 120 },
  { text: 'I-485', x: -300, y: -100, rotation: -2, delay: 140 },
  { text: 'I-765', x: 500, y: -60, rotation: 5, delay: 160 },
  { text: 'I-131', x: -450, y: 80, rotation: -7, delay: 175 },
  { text: 'G-28', x: 320, y: 140, rotation: 3, delay: 190 },
  { text: 'DOL Portal', x: -380, y: 220, rotation: -3, delay: 210, color: C.amber500 },
  { text: 'USCIS Portal', x: 420, y: 260, rotation: 4, delay: 225, color: C.amber500 },
  { text: 'DOS Portal', x: -200, y: 310, rotation: -5, delay: 240, color: C.amber500 },
  { text: 'Email chain #47', x: 250, y: -300, rotation: 7, delay: 255, color: C.slate400 },
];

const PAIN_ANNOTATIONS = [
  { text: 'duplicate entry', x: -380, y: -170, delay: 200 },
  { text: 'unclear status', x: 460, y: -130, delay: 230 },
  { text: 'waiting on attorney', x: -250, y: 10, delay: 260 },
  { text: 'deadline risk', x: 380, y: 70, delay: 280 },
  { text: 'same case, different systems', x: -100, y: 170, delay: 310 },
  { text: 'what happens next?', x: 280, y: 350, delay: 340 },
];

/**
 * Scene 1 — Current State Chaos (22s)
 *
 * Krishna's intro → scattered forms + pain annotations → stat lines reveal.
 * Visual arc: identity → chaos → pain → stark truth.
 */
export const Scene1_CurrentStateChaos = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Krishna's identity (0-5s)
  const introEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.8 * fps) });
  const introSubEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2.0 * fps) });

  // Phase 2: Form fragments (3s-12s) + Pain annotations (6s-12s)

  // Phase 3: Everything fades, stat lines appear (13-22s)
  const chaosExit = interpolate(frame, [12 * fps, 14 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const introExit = interpolate(frame, [11 * fps, 13 * fps], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const line1Enter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(14.0 * fps) });
  const line2Enter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(15.0 * fps) });
  const line3Enter = spring({ frame, fps, config: { damping: 15, stiffness: 80, mass: 2 }, delay: Math.round(16.2 * fps) });
  const subEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(18.5 * fps) });

  // Divider
  const dividerProgress = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(18.0 * fps) });
  const dividerWidth = interpolate(dividerProgress, [0, 1], [0, 400], { extrapolateRight: 'clamp' });

  // Animated background gradient — slow drift creates unease
  const bgAngle = interpolate(frame, [0, 22 * fps], [155, 180], { extrapolateRight: 'clamp' });

  // Subtle camera instability during chaos phase
  const chaosPhase = frame < 13 * fps ? 1 : 0;
  const cameraShakeX = chaosPhase * Math.sin(frame / 15) * 3;
  const cameraShakeY = chaosPhase * Math.cos(frame / 20) * 2;

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
        transform: `translate(${cameraShakeX}px, ${cameraShakeY}px)`,
      }}
    >
      {/* Phase 1: Krishna intro */}
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
            fontSize: 64,
            fontWeight: 700,
            fontFamily: FONT_DISPLAY,
            color: C.accent,
            letterSpacing: '-0.02em',
            opacity: interpolate(introEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(introEnter, [0, 1], [24, 0])}px)`,
          }}
        >
          {CAPTIONS.scene1.intro}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 18,
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

      {/* Phase 2b: Pain annotations — red callouts near fragments */}
      <div style={{ position: 'absolute', inset: 0, opacity: chaosExit }}>
        {PAIN_ANNOTATIONS.map((pain, i) => (
          <PainAnnotation
            key={i}
            text={pain.text}
            x={pain.x}
            y={pain.y}
            delay={pain.delay}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>

      {/* Fragmented arrows that don't converge (visual chaos) */}
      {frame > 7 * fps && frame < 13 * fps && (
        <svg
          style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none', zIndex: 5,
            opacity: interpolate(frame, [7 * fps, 8 * fps, 12 * fps, 13 * fps], [0, 0.2, 0.2, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            }),
          }}
          width="1920" height="1080"
        >
          {/* Scattered lines that go nowhere — fragmentation */}
          <line x1="300" y1="200" x2="500" y2="350" stroke={C.red500} strokeWidth="1.5" opacity="0.4" strokeDasharray="8 6" />
          <line x1="1400" y1="250" x2="1100" y2="400" stroke={C.red500} strokeWidth="1.5" opacity="0.4" strokeDasharray="8 6" />
          <line x1="600" y1="600" x2="400" y2="750" stroke={C.red500} strokeWidth="1.5" opacity="0.3" strokeDasharray="8 6" />
          <line x1="1200" y1="550" x2="1500" y2="700" stroke={C.red500} strokeWidth="1.5" opacity="0.3" strokeDasharray="8 6" />
          <line x1="800" y1="300" x2="900" y2="500" stroke={C.amber500} strokeWidth="1" opacity="0.25" strokeDasharray="6 8" />
          <line x1="1000" y1="150" x2="1050" y2="380" stroke={C.amber500} strokeWidth="1" opacity="0.25" strokeDasharray="6 8" />
        </svg>
      )}

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
