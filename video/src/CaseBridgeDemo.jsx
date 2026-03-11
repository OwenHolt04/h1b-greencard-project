import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import {
  SCENE_FRAMES, TOTAL_FRAMES, C,
  TR_1_2, TR_2_3, TR_3_4, TR_4_5, TR_5_6, TR_6_7, TR_7_8, TR_8_9,
} from './lib/constants';

import { Scene1_CurrentStateChaos } from './scenes/Scene1_CurrentStateChaos';
import { Scene2_PlatformReveal } from './scenes/Scene2_PlatformReveal';
import { Scene3_CaseWorkspace } from './scenes/Scene3_CaseWorkspace';
import { Scene4_IntakeSync } from './scenes/Scene4_IntakeSync';
import { Scene5_ValidationMoment } from './scenes/Scene5_ValidationMoment';
import { Scene6_RoleSwitch } from './scenes/Scene6_RoleSwitch';
import { Scene7_DeadlineProtection } from './scenes/Scene7_DeadlineProtection';
import { Scene8_ScopeClarification } from './scenes/Scene8_ScopeClarification';
import { Scene9_FinalImpact } from './scenes/Scene9_FinalImpact';

/**
 * CaseBridge Demo — Narrative Journey (9 Scenes, ~158s / ~2:38)
 *
 * Follows Krishna's immigration case through:
 *   1. Current-state chaos (22s)
 *   2. Platform reveal (12s)
 *   3. Shared case workspace (18s)
 *   4. Smart intake — data sync (20s)
 *   5. Validation moment — hero scene (25s)
 *   6. Role switching — 3 stakeholder views (25s)
 *   7. Deadline protection (15s)
 *   8. Scope clarification (12s)
 *   9. Final impact + close (14s)
 */
export const CaseBridgeDemo = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.navy900 }}>
      <TransitionSeries>
        {/* Scene 1 — Current-State Chaos */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.currentStateChaos}>
          <Scene1_CurrentStateChaos />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_1_2 })}
        />

        {/* Scene 2 — Platform Reveal */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.platformReveal}>
          <Scene2_PlatformReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_2_3 })}
        />

        {/* Scene 3 — Case Workspace (Dashboard) */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.caseWorkspace}>
          <Scene3_CaseWorkspace />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_3_4 })}
        />

        {/* Scene 4 — Smart Intake (Data Sync) */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.intakeSync}>
          <Scene4_IntakeSync />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_4_5 })}
        />

        {/* Scene 5 — Validation Moment (Hero Scene) */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.validationMoment}>
          <Scene5_ValidationMoment />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: TR_5_6 })}
        />

        {/* Scene 6 — Role Switch */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.roleSwitch}>
          <Scene6_RoleSwitch />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_6_7 })}
        />

        {/* Scene 7 — Deadline Protection */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.deadlineProtection}>
          <Scene7_DeadlineProtection />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_7_8 })}
        />

        {/* Scene 8 — Scope Clarification */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.scopeClarification}>
          <Scene8_ScopeClarification />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_8_9 })}
        />

        {/* Scene 9 — Final Impact */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.finalImpact}>
          <Scene9_FinalImpact />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${(frame / TOTAL_FRAMES) * 100}%`,
          height: 3,
          background: C.accent,
          zIndex: 100,
        }}
      />
    </AbsoluteFill>
  );
};
