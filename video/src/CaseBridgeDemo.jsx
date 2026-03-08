import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import {
  BEAT_FRAMES, TOTAL_FRAMES, C,
  TR_1_2, TR_2_3, TR_3_4, TR_4_5, TR_5_6, TR_6_7, TR_7_8,
} from './lib/constants';

import { Beat1_CurrentState } from './scenes/Beat1_CurrentState';
import { Beat2_Overview } from './scenes/Beat2_Overview';
import { Beat3_SmartIntake } from './scenes/Beat3_SmartIntake';
import { Beat4_Validation } from './scenes/Beat4_Validation';
import { Beat5_Fix } from './scenes/Beat5_Fix';
import { Beat6_RoleSwitcher } from './scenes/Beat6_RoleSwitcher';
import { Beat7_ScopeClarity } from './scenes/Beat7_ScopeClarity';
import { Beat8_Close } from './scenes/Beat8_Close';

/**
 * CaseBridge Demo — Full 8-Beat Composition (~103s)
 *
 * Transitions:
 *   slide(from-right) between unrelated scenes (forward motion)
 *   quick fade between related scenes (beats 3→4→5, same screen)
 *   slow fade for closing
 */
export const CaseBridgeDemo = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.navy900 }}>
      <TransitionSeries>
        {/* Beat 1 — Current-State Tension */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.currentState}>
          <Beat1_CurrentState />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TR_1_2 })}
        />

        {/* Beat 2 — CaseBridge Overview */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.overview}>
          <Beat2_Overview />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_2_3 })}
        />

        {/* Beat 3 — Smart Intake + Form Sync */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.smartIntake}>
          <Beat3_SmartIntake />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_3_4 })}
        />

        {/* Beat 4 — Validation Catches Issues (hero beat) */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.validation}>
          <Beat4_Validation />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_4_5 })}
        />

        {/* Beat 5 — Fix + Score Improvement */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.fix}>
          <Beat5_Fix />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: TR_5_6 })}
        />

        {/* Beat 6 — Role Switcher (3 views) */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.roleSwitcher}>
          <Beat6_RoleSwitcher />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_6_7 })}
        />

        {/* Beat 7 — Scope Clarity */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.scopeClarity}>
          <Beat7_ScopeClarity />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TR_7_8 })}
        />

        {/* Beat 8 — Close */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.close}>
          <Beat8_Close />
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
