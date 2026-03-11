import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { MS_FRAMES, MS_TR, MS_TOTAL_FRAMES, C } from './lib/constants';

import { MS1A_ProblemIntro } from './micro/MS1A_ProblemIntro';
import { MS1B_ProblemScale } from './micro/MS1B_ProblemScale';
import { MS1C_ProblemPain } from './micro/MS1C_ProblemPain';
import { MS2A_PlatformReveal } from './micro/MS2A_PlatformReveal';
import { MS3A_CapIntake } from './micro/MS3A_CapIntake';
import { MS3B_CapValidation } from './micro/MS3B_CapValidation';
import { MS3B2_CapWizard } from './micro/MS3B2_CapWizard';
import { MS3C_CapRoles } from './micro/MS3C_CapRoles';
import { MS3D_CapDeadline } from './micro/MS3D_CapDeadline';
import { MS4A_ImpactResults } from './micro/MS4A_ImpactResults';
import { MS4B_ScopeClose } from './micro/MS4B_ScopeClose';

/**
 * CaseBridge Demo V2 — Micro-Scene Architecture
 *
 * 10 micro-scenes following capability-first grammar:
 *   ACT 1: Problem (1A intro, 1B scale, 1C pain)
 *   ACT 2: Platform (2A reveal)
 *   ACT 3: Capabilities (3A intake, 3B validation, 3B2 wizard, 3C roles, 3D deadline)
 *   ACT 4: Impact (4A results, 4B scope+close)
 *
 * Total: ~4924 frames = 2:44 at 30fps
 */
export const CaseBridgeDemoV2 = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.navy900 }}>
      <TransitionSeries>
        {/* 1A — Problem Intro */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.problemIntro}>
          <MS1A_ProblemIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['1A_1B'] })}
        />

        {/* 1B — Problem Scale */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.problemScale}>
          <MS1B_ProblemScale />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['1B_1C'] })}
        />

        {/* 1C — Problem Pain */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.problemPain}>
          <MS1C_ProblemPain />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['1C_2A'] })}
        />

        {/* 2A — Platform Reveal */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.platformReveal}>
          <MS2A_PlatformReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['2A_3A'] })}
        />

        {/* 3A — Capability: Enter Once */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.capIntake}>
          <MS3A_CapIntake />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['3A_3B'] })}
        />

        {/* 3B — Capability: Validation (HERO) */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.capValidation}>
          <MS3B_CapValidation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['3B_W'] })}
        />

        {/* 3B2 — Capability: Plain-Language Wizard */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.capWizard}>
          <MS3B2_CapWizard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['W_3C'] })}
        />

        {/* 3C — Capability: Roles */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.capRoles}>
          <MS3C_CapRoles />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['3C_3D'] })}
        />

        {/* 3D — Capability: Deadline */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.capDeadline}>
          <MS3D_CapDeadline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['3D_4A'] })}
        />

        {/* 4A — Impact Results */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.impactResults}>
          <MS4A_ImpactResults />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: MS_TR['4A_4B'] })}
        />

        {/* 4B — Scope + Close */}
        <TransitionSeries.Sequence durationInFrames={MS_FRAMES.scopeClose}>
          <MS4B_ScopeClose />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: `${(frame / MS_TOTAL_FRAMES) * 100}%`,
        height: 3, background: C.accent, zIndex: 100,
      }} />
    </AbsoluteFill>
  );
};
