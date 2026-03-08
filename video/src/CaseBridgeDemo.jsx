import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import {
  BEAT_FRAMES,
  TRANSITION_STANDARD,
  TRANSITION_QUICK,
} from './lib/constants';

import { Beat1_CurrentState } from './scenes/Beat1_CurrentState';
import { Beat2_Overview } from './scenes/Beat2_Overview';
import { Beat3_SmartIntake } from './scenes/Beat3_SmartIntake';
import { Beat4_Validation } from './scenes/Beat4_Validation';
import { Beat5_Fix } from './scenes/Beat5_Fix';
import { Beat6_RoleSwitcher } from './scenes/Beat6_RoleSwitcher';
import { Beat7_ScopeClarity } from './scenes/Beat7_ScopeClarity';
import { Beat8_Close } from './scenes/Beat8_Close';

const stdTransition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_STANDARD })}
  />
);

const quickTransition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_QUICK })}
  />
);

/**
 * CaseBridge Demo — Full 8-Beat Composition (~105s)
 *
 * Transition strategy:
 *   Standard fade (0.6s) between unrelated scenes.
 *   Quick crossfade (0.2s) between beats 3→4→5 (same screen, different states).
 */
export const CaseBridgeDemo = () => {
  return (
    <AbsoluteFill style={{ background: '#0a1628' }}>
      <TransitionSeries>
        {/* Beat 1 — Current-State Tension */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.currentState}>
          <Beat1_CurrentState />
        </TransitionSeries.Sequence>

        {stdTransition}

        {/* Beat 2 — CaseBridge Overview */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.overview}>
          <Beat2_Overview />
        </TransitionSeries.Sequence>

        {stdTransition}

        {/* Beat 3 — Smart Intake + Form Sync */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.smartIntake}>
          <Beat3_SmartIntake />
        </TransitionSeries.Sequence>

        {quickTransition}

        {/* Beat 4 — Validation Catches Issues (hero beat) */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.validation}>
          <Beat4_Validation />
        </TransitionSeries.Sequence>

        {quickTransition}

        {/* Beat 5 — Fix + Score Improvement */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.fix}>
          <Beat5_Fix />
        </TransitionSeries.Sequence>

        {stdTransition}

        {/* Beat 6 — Role Switcher (3 views) */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.roleSwitcher}>
          <Beat6_RoleSwitcher />
        </TransitionSeries.Sequence>

        {stdTransition}

        {/* Beat 7 — Scope Clarity */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.scopeClarity}>
          <Beat7_ScopeClarity />
        </TransitionSeries.Sequence>

        {stdTransition}

        {/* Beat 8 — Close */}
        <TransitionSeries.Sequence durationInFrames={BEAT_FRAMES.close}>
          <Beat8_Close />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
