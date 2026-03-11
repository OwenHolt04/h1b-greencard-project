import React from 'react';
import { Composition, Folder } from 'remotion';
import { CaseBridgeDemo } from './CaseBridgeDemo';
import { CaseBridgeDemoV2 } from './CaseBridgeDemoV2';
import { TOTAL_FRAMES, FPS, SCENE_FRAMES, MS_FRAMES, MS_TOTAL_FRAMES } from './lib/constants';

// --- V1 scenes (legacy) ---
import { Scene1_CurrentStateChaos } from './scenes/Scene1_CurrentStateChaos';
import { Scene2_PlatformReveal } from './scenes/Scene2_PlatformReveal';
import { Scene3_CaseWorkspace } from './scenes/Scene3_CaseWorkspace';
import { Scene4_IntakeSync } from './scenes/Scene4_IntakeSync';
import { Scene5_ValidationMoment } from './scenes/Scene5_ValidationMoment';
import { Scene6_RoleSwitch } from './scenes/Scene6_RoleSwitch';
import { Scene7_DeadlineProtection } from './scenes/Scene7_DeadlineProtection';
import { Scene8_ScopeClarification } from './scenes/Scene8_ScopeClarification';
import { Scene9_FinalImpact } from './scenes/Scene9_FinalImpact';

// --- V2 micro-scenes ---
import { MS1A_ProblemIntro } from './micro/MS1A_ProblemIntro';
import { MS1B_ProblemScale } from './micro/MS1B_ProblemScale';
import { MS1C_ProblemPain } from './micro/MS1C_ProblemPain';
import { MS2A_PlatformReveal } from './micro/MS2A_PlatformReveal';
import { MS3A_CapIntake } from './micro/MS3A_CapIntake';
import { MS3B_CapValidation } from './micro/MS3B_CapValidation';
import { MS3C_CapRoles } from './micro/MS3C_CapRoles';
import { MS3D_CapDeadline } from './micro/MS3D_CapDeadline';
import { MS4A_ImpactResults } from './micro/MS4A_ImpactResults';
import { MS4B_ScopeClose } from './micro/MS4B_ScopeClose';

export const RemotionRoot = () => {
  return (
    <>
      {/* V2 — Main composition (micro-scene architecture) */}
      <Composition
        id="CaseBridgeDemoV2"
        component={CaseBridgeDemoV2}
        durationInFrames={MS_TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* V2 individual micro-scenes for preview */}
      <Folder name="V2-MicroScenes">
        <Composition id="MS1A-ProblemIntro" component={MS1A_ProblemIntro} durationInFrames={MS_FRAMES.problemIntro} fps={FPS} width={1920} height={1080} />
        <Composition id="MS1B-ProblemScale" component={MS1B_ProblemScale} durationInFrames={MS_FRAMES.problemScale} fps={FPS} width={1920} height={1080} />
        <Composition id="MS1C-ProblemPain" component={MS1C_ProblemPain} durationInFrames={MS_FRAMES.problemPain} fps={FPS} width={1920} height={1080} />
        <Composition id="MS2A-PlatformReveal" component={MS2A_PlatformReveal} durationInFrames={MS_FRAMES.platformReveal} fps={FPS} width={1920} height={1080} />
        <Composition id="MS3A-CapIntake" component={MS3A_CapIntake} durationInFrames={MS_FRAMES.capIntake} fps={FPS} width={1920} height={1080} />
        <Composition id="MS3B-CapValidation" component={MS3B_CapValidation} durationInFrames={MS_FRAMES.capValidation} fps={FPS} width={1920} height={1080} />
        <Composition id="MS3C-CapRoles" component={MS3C_CapRoles} durationInFrames={MS_FRAMES.capRoles} fps={FPS} width={1920} height={1080} />
        <Composition id="MS3D-CapDeadline" component={MS3D_CapDeadline} durationInFrames={MS_FRAMES.capDeadline} fps={FPS} width={1920} height={1080} />
        <Composition id="MS4A-ImpactResults" component={MS4A_ImpactResults} durationInFrames={MS_FRAMES.impactResults} fps={FPS} width={1920} height={1080} />
        <Composition id="MS4B-ScopeClose" component={MS4B_ScopeClose} durationInFrames={MS_FRAMES.scopeClose} fps={FPS} width={1920} height={1080} />
      </Folder>

      {/* V1 — Legacy (kept for reference) */}
      <Folder name="V1-Legacy">
        <Composition id="CaseBridgeDemo" component={CaseBridgeDemo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene1-CurrentStateChaos" component={Scene1_CurrentStateChaos} durationInFrames={SCENE_FRAMES.currentStateChaos} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene2-PlatformReveal" component={Scene2_PlatformReveal} durationInFrames={SCENE_FRAMES.platformReveal} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene3-CaseWorkspace" component={Scene3_CaseWorkspace} durationInFrames={SCENE_FRAMES.caseWorkspace} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene4-IntakeSync" component={Scene4_IntakeSync} durationInFrames={SCENE_FRAMES.intakeSync} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene5-ValidationMoment" component={Scene5_ValidationMoment} durationInFrames={SCENE_FRAMES.validationMoment} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene6-RoleSwitch" component={Scene6_RoleSwitch} durationInFrames={SCENE_FRAMES.roleSwitch} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene7-DeadlineProtection" component={Scene7_DeadlineProtection} durationInFrames={SCENE_FRAMES.deadlineProtection} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene8-ScopeClarification" component={Scene8_ScopeClarification} durationInFrames={SCENE_FRAMES.scopeClarification} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene9-FinalImpact" component={Scene9_FinalImpact} durationInFrames={SCENE_FRAMES.finalImpact} fps={FPS} width={1920} height={1080} />
      </Folder>
    </>
  );
};
