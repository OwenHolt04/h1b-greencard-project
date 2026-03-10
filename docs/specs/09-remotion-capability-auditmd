# Remotion Capability Audit for the MGT120 Website Demo / Presentation

## 1. Executive Summary

This document is the Remotion-side companion to the earlier forensic website motion audit.

The question here is not whether Remotion can make attractive video. It can. The real question is how to use **Remotion as a deterministic presentation engine** so the final output supports a calm, premium, high-trust workflow demo instead of turning into generic startup montage.

### Bottom line

For this project, Remotion should be treated as:

1. **A narrative compositor**, not a screen recorder.
2. **A deterministic state machine**, not a browser animation sandbox.
3. **A companion to the website**, not a replacement for the website.
4. **A scene orchestration layer** for proof-of-capability moments that are hard to guarantee in a live browser demo.

### Best role for Remotion in this project

Use Remotion for the parts of the presentation where you need:

- exact timing
- guaranteed frame-perfect playback
- polished scene-to-scene handoffs
- controlled focus hierarchy
- animated diagrams, paths, document stacks, and system maps
- consistent voiceover sync
- reliable capture of states that would be fragile in a live site

Do **not** use Remotion as the primary way to “record the website” unless the website content is rebuilt as **frame-driven Remotion scenes** or an explicitly deterministic embedded composition.

### Core recommendation

Build a **hybrid motion system**:

- **Website** handles live product-like interaction, scroll chapters, and presentation navigation.
- **Remotion** handles cinematic chapter intros, capability proof moments, before/after transformations, and any scene where timing precision matters more than live interactivity.
- Shared UI pieces, design tokens, and scene data should be reused across both so the website and video feel like one system.

### What Remotion is especially strong at for this project

- chapter sequencing
- voiceover-synced reveals
- animated text and mask work
- diagram/path propagation
- staged document and form choreography
- before/after state transformation
- dashboard walkthroughs with controlled camera emphasis
- high-confidence export for presentation playback

### What Remotion is not the best default for here

- capturing a live app that still relies on browser-side scroll triggers
- replaying complex live website animations through iframes
- replacing all website interaction with canned video
- heavy 3D spectacle for its own sake
- physics-heavy motion blur everywhere

### Recommended operating principle

If a scene needs to be:

- **interactive in the room** → keep it in the website
- **repeatable and cinematic** → move it to Remotion
- **both** → build it once as a shared React scene and give it two drivers:
  - browser-state driver for website
  - frame driver for Remotion

---

## 2. Remotion Capability Forensic Audit

---

### 2.1 Deterministic Render Model

#### Confirmed from docs

Remotion’s rendering model is built around frame determinism. The official guidance is to code animations so they run purely off `useCurrentFrame()`, treat a component as a function from frame number to image, and avoid assumptions that frames render in order. A component should show the same visual when called multiple times and should not animate while paused.

#### Why this matters for our project

This is the single most important constraint.

Your website demo/presentation needs:

- deterministic playback
- no flicker during export
- stable typography and layout during key story beats
- consistent voiceover alignment

That makes Remotion a strong fit **only when scenes are expressed as frame-driven visuals**.

#### Practical implication

Any motion system you bring into Remotion should be translated into:

- `frame -> progress`
- `progress -> transform / opacity / mask / clip / color / path length`

not into:

- scroll listeners
- timeouts
- ambient CSS keyframes that keep running while paused
- assumptions that the DOM will mount and animate the same way every render

#### Recommendation

Adopt a strict rule:

> Every Remotion scene must be expressible as a pure function of frame + props.

That means:

- no “wait for browser animation to finish” logic
- no hidden GSAP runtime inside rendered compositions by default
- no reliance on scroll position as a primary driver

#### Rebuildability assessment

- **Difficulty:** low if planned early, high if retrofitted from a live site
- **Performance risk:** low to medium
- **Remotion capture risk:** very low when respected, very high when ignored
- **Recommendation:** must-have foundation

---

### 2.2 Scene Composition: `Sequence`, `Series`, `Freeze`, `AbsoluteFill`

#### Confirmed from docs

Remotion provides `Sequence` for time-shifting parts of a composition, `Series` for stitching scenes sequentially, and `Freeze` for pinning a subtree to a chosen frame. `Sequence` also supports `premountFor`, `postmountFor`, and `styleWhilePremounted`, which are specifically useful for reducing flicker when assets need time to load. From v5.0, the default `premountFor` value changes to `fps` (one second), which is relevant for future-proofing the project.

#### What each piece is best for here

**`Sequence`**
- Use inside a scene for staggered enters, callout layering, subtitles, diagram build-up, or UI emphasis.
- This is the equivalent of micro-timeline orchestration.

**`Series`**
- Use for macro narrative chaptering.
- Ideal for: intro → current-state pain → future-state workspace → closing impact.

**`Freeze`**
- Extremely useful for this project.
- Lets you stop a UI or document state and annotate it without the underlying timeline continuing.
- Best for “pause and explain” moments.

**`AbsoluteFill`**
- Should be the default wrapper for layered scenes.
- Most of your composed motion language depends on isolated transform layers, not layout flow.

#### Recommended composition strategy

Use three timeline levels:

1. **Film level**
   - `Series` chapters
2. **Scene level**
   - `Sequence` blocks inside each chapter
3. **Element level**
   - `interpolate()` / `spring()` / masks / paths / transforms on each element

#### Suggested architecture

```tsx
<Series>
  <Series.Sequence durationInFrames={introDur}>
    <OpeningScene />
  </Series.Sequence>
  <Series.Sequence durationInFrames={chaosDur}>
    <CurrentStateChaosScene />
  </Series.Sequence>
  <Series.Sequence durationInFrames={futureDur}>
    <FutureStateWorkspaceScene />
  </Series.Sequence>
  <Series.Sequence durationInFrames={impactDur}>
    <ImpactCloseScene />
  </Series.Sequence>
</Series>
Inside each scene:

<AbsoluteFill>
  <Sequence from={0}><BackgroundLayer /></Sequence>
  <Sequence from={6}><HeadlineLayer /></Sequence>
  <Sequence from={14}><DiagramLayer /></Sequence>
  <Sequence from={28}><MetricLayer /></Sequence>
</AbsoluteFill>
Best use in this project
stage personal story first

hold on emotional or factual beats

build process complexity step-by-step instead of showing everything at once

freeze a dashboard or form and call out one issue at a time

Rebuildability assessment
Difficulty: low

Performance risk: low

Accessibility risk: low

Remotion risk: very low

Recommendation: must-have

2.3 Transition System: @remotion/transitions
Confirmed from docs
@remotion/transitions provides TransitionSeries plus timing functions such as springTiming() and linearTiming(). Built-in presentation styles include fade(), slide(), wipe(), flip(), clockWipe(), iris(), none(), and a paid cube() effect.

What this means in practice
Remotion has an official scene-transition system, but that does not mean it should drive most of your storytelling.

For this project, the danger is over-transitioning.

Your subject matter is institutional, emotionally serious, and system-heavy. Too many explicit transitions will make the video feel like templateware.

Recommended use
Use TransitionSeries selectively for:

clean chapter breaks

occasional slide/wipe between macro states

one or two deliberate perspective or iris moments if a scene genuinely benefits

Do not use it as the default for every cut.

Preferred timing choices
linearTiming() for restrained, credible handoffs

springTiming() for UI cards and panel transitions that benefit from controlled settle

Recommended transition vocabulary for this project
Use mostly:

fade()

subtle slide()

custom in-scene motion

none() when the scene itself does the transition work

Avoid or severely limit:

flip()

clockWipe()

cube()

These are too demonstrative for a calm workflow platform unless used in a very narrow sandbox or “system states rotating” metaphor.

Design principle
The best transitions here are often internal scene transitions, not formal scene transition effects.

Example:

current-state document mess compresses into a clean dashboard shell

same scene, no external transition needed

That will feel more premium than a template wipe.

Rebuildability assessment
Difficulty: low

Performance risk: low to medium

Responsiveness risk: none in final video, minor in Player if overused

Remotion risk: low

Recommendation: strong candidate, but keep disciplined

2.4 Animation Math: spring(), interpolate(), measureSpring(), Easing
Confirmed from docs
Remotion exposes spring() as a physics-based primitive, interpolate() for mapping one range to another, measureSpring() for estimating how long a spring takes to settle, and Easing functions for interpolation-based timing.

Recommended motion math policy for our project
Use two animation families only:

Interpolate + easing for most narrative motion

text reveals

panel slides

mask wipes

graph/path progression

camera crops / zooms

Springs only for contained UI elements

chips

cards

notification pills

small dashboard panel emphasis

Why
Institutional / high-trust motion should feel:

measured

guided

intentional

smooth

not:

rubbery

toy-like

overshooting everywhere

Recommended defaults
Narrative motion

duration: 12–28 frames at 30fps

easing: cubic-out / mild circ-out equivalents

opacity changes overlap transform by 4–8 frames

UI card emphasis

spring with high damping

little or no visible overshoot

settle quickly

if using durationInFrames, measure with measureSpring() and normalize around scene timing

Recommended motion ranges
translateY: 12–48px

translateX: 16–80px

scale: 0.96 → 1.00 or 1.00 → 1.04

opacity: 0 → 1

blur: use sparingly and only on reveal edges

mask/clip: driven linearly or eased, not springy

Practical warning
Do not let springs control the entire cinematic language.

They are best used for small local emphasis, not whole-scene progression.

Rebuildability assessment
Difficulty: low

Performance risk: low

Remotion risk: very low

Recommendation: must-have

2.5 Parametrization and Narrative Variants: schema, defaultProps, inputProps, calculateMetadata
Confirmed from docs
Remotion supports typed composition schemas with Zod, visual editing of props in Studio, JSON-serializable defaultProps and inputProps, and calculateMetadata() for fetching or transforming serializable data before render.

Why this is huge for our project
This project is not just “one video.”

You have multiple possible presentation contexts:

live in-class presentation

recorded promo/demo

website-embedded version

shorter teaser / opener

audience-specific variants for applicant, employer, attorney, or agency viewpoints

Remotion’s prop system is exactly what makes that manageable.

Recommended parameterization model
Define one master schema, then render variants from config.

Suggested top-level props:

{
  mode: 'class-presentation' | 'site-demo' | 'teaser',
  audienceFocus: 'mixed' | 'applicant' | 'employer' | 'attorney' | 'agency',
  showCaptions: boolean,
  showVoiceoverWave: boolean,
  intensity: 'low' | 'medium',
  includePersonalStory: boolean,
  includeLiveWebsiteSection: boolean,
  chapterDurations: {...},
  metrics: {...},
  capabilityClaims: {...},
  theme: {...}
}
Best use of calculateMetadata() here
Use it to:

derive total duration from enabled chapters

fetch or normalize stats JSON

swap between short and long cuts

inject chapter labels and callout data

Do not use it for binary asset loading logic.

Best use of schema-driven visual editing
Claude Code should build the compositions so you can:

tweak chapter durations

turn scenes on/off

switch claim labels

change metric numbers

change accent emphasis

render alternate versions without editing code everywhere

This is one of the highest-leverage Remotion features for a school/team presentation workflow.

Rebuildability assessment
Difficulty: medium if done properly

Performance risk: low

Coordination benefit: very high

Recommendation: must-have

2.6 Studio and Iteration Workflow
Confirmed from docs
If a schema is attached to a composition, props can be edited visually in Remotion Studio. Supported controls include strings, numbers, booleans, arrays, enums, color and textarea helpers from @remotion/zod-types, and JSON editing. Modified defaults can be rendered directly from the render dialog.

Why this matters for Claude Code handoff
This means Claude Code should not produce only one hardcoded timeline.

It should produce a composable video workspace:

multiple compositions

folders for organization

typed props

chapter toggles

theme toggles

scene-level controls

That way you are not trapped in source edits every time the story changes.

Recommended folder structure
<Folder name="Masters">
  <Composition id="MainPresentation" ... />
  <Composition id="WebsiteDemoCut" ... />
  <Composition id="ShortTeaser" ... />
</Folder>

<Folder name="Chapters">
  <Composition id="IntroChapter" ... />
  <Composition id="ChaosChapter" ... />
  <Composition id="DashboardChapter" ... />
  <Composition id="ImpactClose" ... />
</Folder>
Workflow recommendation
iterate scene-by-scene in isolated compositions

assemble into master cut only after chapter timings feel right

keep all claim numbers and labels in data files, not embedded in JSX strings everywhere

Rebuildability assessment
Difficulty: medium

Performance risk: none

Recommendation: must-have for maintainability

2.7 Player Integration: @remotion/player
Confirmed from docs
The Remotion Player can be embedded in any React app, can be controlled programmatically through a ref, supports events, lazy loading, looping, frame ranges, and runtime customization. The Thumbnail component can display a single frame of a composition inside a normal React app.

What this unlocks for our project
The website can contain Remotion-driven media in a way that still feels native.

Good uses:

hero preview or teaser block

embedded capability explainer video

scene selector with previews

alternate “watch the guided demo” mode inside the site

hover or static chapter thumbnails

Best use case split
Use <Player> for:

a controlled mini-film embedded in the site

chapter playback inside the demo page

optional explanatory sidecar video next to the live website

Use <Thumbnail> for:

chapter cards

slide-sized previews

feature navigation tiles

still poster frames on landing sections

Important constraint
The Player is not the same as a final render.

Build compositions so they are good in both contexts, but do not assume everything that is acceptable in a local Player is ideal for final export.

Recommended website integration pattern
main website stays normal React/Vite

one or two deliberate Remotion Player embeds

lazy load the Player so the site stays responsive

use thumbnails and poster frames in more places than full players

Recommended control UX
segment buttons for chapters

“watch guided version” CTA

play from selected scene

muted autoplay only if policy allows and visual value is strong

otherwise start paused with clean poster frame

Rebuildability assessment
Difficulty: medium

Performance risk: medium if too many players mount at once

Responsiveness risk: medium on lower-end devices

Recommendation: strong candidate, limited and deliberate use

2.8 Asset Handling: Img, Audio, Html5Video, OffthreadVideo, IFrame, staticFile
Confirmed from docs
Remotion recommends using its own media wrappers such as Img, Audio, Html5Video, OffthreadVideo, and IFrame so assets are fully loaded before frame rendering. staticFile() is the correct way to reference public assets. OffthreadVideo extracts frames outside the browser using FFmpeg and is not supported in client-side rendering. IFrame waits for the iframe to load, but the docs explicitly warn that ideally the website inside the iframe should not have its own animations, because only animations using useCurrentFrame() are supported reliably in Remotion.

Correct tool split for this project
Img

default for logos, screenshots, icons, diagrams, and UI states

use often

Html5Video

fine for preview/player situations

use for client-side preview clips when needed

OffthreadVideo

best for final render when you need to include pre-rendered clips, screen captures, or videos with precise frame extraction

do not rely on it inside the website Player

Audio / Html5Audio

for narration, stingers, subtle texture, notification sounds

treat audio as structured timeline content, not last-minute decoration

IFrame

use only if embedding a stable, mostly static site state

not the default way to show the website

staticFile()

should be mandatory for project assets

Big recommendation: do not “just iframe the website”
This is a major trap.

If the website has:

scroll-linked animation

viewport observers

CSS transitions that run independently

JS animation libraries outside Remotion’s frame model

then embedding it in Remotion will create fragility.

Better alternatives
Shared component recreation

Rebuild the dashboard/state as native Remotion components using the same styles.

Pre-rendered clip inclusion

Render a clean clip once, then use OffthreadVideo in the master film.

Controlled iframe only for static states

Use if the page is mostly frozen and serves as a screenshot-like surface.

Rebuildability assessment
Difficulty: medium

Performance risk: medium

Remotion risk: high if you overuse IFrame

Recommendation: must-have knowledge; use selectively

2.9 Buffering, Loading, and Async Reliability: useDelayRender(), useBufferState()
Confirmed from docs
useDelayRender() is the recommended scoped approach for delaying a render during asynchronous work. useBufferState() addresses playback buffering in preview environments and can be paired with delayRender()/continueRender() so preview and final render behavior are both managed correctly.

Why this matters here
Your project is likely to contain:

external JSON or config

screenshots or document assets

optional audio or caption files

chapterized playback in the Player

That means loading strategy matters.

Recommended async policy
For final renders

prefer calculateMetadata() for serializable data

use useDelayRender() only when scene-local async is necessary

For preview / Player

use useBufferState() when a scene may otherwise jump or flash while media loads

combine with premounting where appropriate

Recommended practice
precompute numbers and chapter data when possible

avoid many small async fetches deep in the component tree

centralize data loading close to composition boundaries

Rebuildability assessment
Difficulty: medium

Performance risk: medium if ignored

Recommendation: strong candidate

2.10 Captions and Audio-Synced Language: @remotion/captions, @remotion/media-utils
Confirmed from docs
Remotion provides @remotion/captions for subtitle utilities and caption transformation. It also provides audio visualization helpers through @remotion/media-utils, including loading audio data and generating per-frame spectrum values.

Best use for our project
This presentation is not a music visualizer. Do not use flashy equalizer bars for style points.

Use these tools instead for:

burned-in captions for the guided demo

phrase-level text emphasis synchronized to narration

subtle audio-reactive connector pulses or alert beats

word/phrase timing for key legal terms or milestones

Caption style recommendation
Do not use TikTok-style captions as the default aesthetic.

The package can segment caption pages, but your look should be calmer:

short phrase blocks

lower-third or side-anchored

selective highlighting of nouns / verbs / numbers

institutionally credible typography

Great applications in this project
emphasize “165+ pages”, “single dashboard”, “90% mismatch detection”, “real-time status”, “no system of record”

caption short testimonial lines from personal-story opening

sync capability labels to reveals rather than putting everything on-screen at once

Rebuildability assessment
Difficulty: medium

Performance risk: low

Narrative value: high

Recommendation: strong candidate

2.11 SVG and Connector Motion: @remotion/paths
Confirmed from docs
@remotion/paths provides utilities for SVG path length, path interpolation, points/tangents, and evolvePath() for animating a path from invisible to fully drawn.

Why this is one of the best Remotion capabilities for your project
Your product concept is full of system relationships:

applicant → employer → attorney → USCIS/DOL/DOS

field sync across forms

notifications propagating across roles

case status moving through stages

fragmented systems becoming a single record

That makes path animation a perfect fit.

Recommended uses
timeline spine across OPT → H-1B → green card

connector sweeps between duplicated forms collapsing into one source of truth

milestone propagation pulses across stakeholder nodes

line-draw overlays over maps, dashboards, or system diagrams

before/after process graphs

Motion style recommendation
Keep paths:

thin to medium weight

clean and geometric

slightly eased

not neon sci-fi

not particle-heavy

Pair line growth with:

node activation

small metric number changes

opacity lifts

minimal glow or blur if any

Rebuildability assessment
Difficulty: medium

Performance risk: low to medium

Project fit: very high

Recommendation: must-have

2.12 Motion Blur and Trails: @remotion/motion-blur
Confirmed from docs
Remotion offers higher-order motion blur and trail effects. CameraMotionBlur creates film-like blur by sampling multiple layers, but the docs warn it is destructive to colors and recommend keeping samples low. Trail lets you set layers, lag in frames, and trail opacity.

Recommendation for this project
Use motion blur as a spice, not a base layer.

Good uses:

fast connector sweep

one accent fly-through

one document scatter moment

one alert/pulse motion accent

Bad uses:

on typography

on dashboards most of the time

on charts

across many scenes

over institutional UI surfaces

Why
Your project needs clarity more than spectacle.

The docs’ warning about color degradation aligns with what we want aesthetically anyway: restrained motion, clean rendering, readable detail.

Recommended policy
default: none

only use in isolated hero or transition accents

keep samples low

visually inspect for color muddying

Rebuildability assessment
Difficulty: medium

Performance risk: medium

Color risk: medium to high

Recommendation: nice-to-have, used sparingly

2.13 3D / React Three Fiber: @remotion/three
Confirmed from docs
Remotion supports React Three Fiber through @remotion/three.

Recommendation for this project
Treat this as optional, not core.

Potential acceptable use:

one restrained hero-depth scene

one elegant spatial card environment

one abstract system map with subtle camera parallax

But the default should stay 2.5D:

layered panels

scale/translate/parallax

masks

paths

typography

controlled cards

Why
3D increases implementation complexity quickly and tends to push the visual tone away from the calm institutional style you want.

Rebuildability assessment
Difficulty: high

Performance risk: medium to high

Project fit: low unless narrowly scoped

Recommendation: avoid unless one scene truly needs it

3. Comparative Motion Pattern Matrix
Pattern / Need	Live Website	Remotion	Best Choice	Why
Pinned scroll storytelling	Strong	Not native in the same way	Hybrid, but convert to chapters in Remotion	Scroll is great live, but Remotion should translate it into timed holds rather than simulated page scroll
SVG path reveals	Good	Excellent	Remotion for narrated moments	@remotion/paths gives deterministic connector and progression motion
Text mask reveals	Good	Excellent	Remotion	Easier to control for voiceover and export
Horizontal rail walkthrough	Good	Good	Either, depending context	Live if user-driven, Remotion if narrated and timed
Dashboard stagger reveals	Good	Excellent	Shared component, dual driver	Same visuals can be used in both systems
Container expansion / zoom storytelling	Good	Excellent	Remotion for hero moments	Exact timing and scale control matter
Multi-card sequencing	Good	Excellent	Remotion	Sequence/Series make chaptered staging very reliable
Document avalanche / paper complexity	Okay	Excellent	Remotion	Easier to choreograph and freeze
Live product interaction	Excellent	Weak to medium	Website	Real interaction belongs in browser
Voiceover-synced explanation	Weak	Excellent	Remotion	Timeline control is the whole point
Captioned quote moments	Weak	Excellent	Remotion	Strong frame-level caption timing
Style-consistent previews / thumbnails	Medium	Excellent	Remotion	Thumbnail creates reusable chapter preview assets
Embedding film inside site	N/A	Strong	Player	Great for guided mode or sidecar explainer
Iframed live website capture	Fragile	Fragile	Avoid as default	Docs explicitly caution against independently animated iframes
4. Best-in-Class Moves for This Project
4.1 Current-state chaos → order transition
Best Remotion-native move:

start with stacked documents, fragmented portals, repeated identity fields, and disconnected status nodes

compress them into one structured shell

snap repeated fields into shared source tokens

let paths converge into one case spine

Why it works:

makes the problem and solution legible in one gesture

avoids a generic “before/after” crossfade

gives you proof-of-capability instead of vibe only

Remotion tools:

Sequence

interpolate()

@remotion/paths

selective Freeze

4.2 Pinned story progression equivalent
Best Remotion-native move:

Do not fake page scrolling. Instead, create chapter holds:

hold on a scene long enough for attention to settle

advance sub-elements in layered sequences

freeze a state, annotate it, then continue

This gives the same psychological effect as pinned storytelling without pretending the video is a website.

4.3 Multi-card sequencing
Best Remotion-native move:

Use a stable viewport shell with 2–4 layered cards that:

enter with small offset and scale

transfer focus by contrast and z-order

dim older cards rather than fully removing them immediately

This echoes Chronicle-style sequencing but becomes easier and cleaner in Remotion.

4.4 Data-flow / connector motion
Best Remotion-native move:

Use evolvePath() and node activation to show:

a form field propagating across forms

milestone status propagating across roles

a case moving through agencies

This is arguably the single best Remotion specialty for your subject matter.

4.5 Text mask reveals
Best Remotion-native move:

Reveal only the specific legal phrase or metric you are discussing in the voiceover.

Do not animate paragraphs. Animate:

labels
n- headline fragments

legal terms

capability names

key metrics

4.6 Horizontal rail sections
Best Remotion-native move:

Translate one long process rail through the viewport over time.

Use for:

OPT → H-1B → PERM → I-140 → I-485

milestone ladder

ownership handoff map

Use once, maybe twice. Not everywhere.

4.7 Viewport stagger systems
Best Remotion-native move:

Instead of viewport-triggered reveals, use timeline-based stagger blocks inside a stable composition.

Recommended cadence:

headline at frame 0–10

subcopy at 6–18

UI shell at 10–24

metrics/chips at 18–32

annotation at 26–42

4.8 Container expansion / zoom storytelling
Best Remotion-native move:

Reveal the product through shells:

document clutter fills frame

a bounding container forms around it

container becomes a clean dashboard surface

camera pushes slightly into the active capability

This feels product-led and premium without needing complex 3D.

5. Do / Don’t Use Guidance
Do use Remotion for
controlled capability explainers

personal-story openers with light photographic treatment

document complexity scenes

dashboard-state transitions

narrated system maps

chapter intros and closes

role-based viewpoint swaps

presentation-safe exports

embedded guided demo mode on the site

Adapt rather than copy directly
pinned scroll sections → convert into chapter holds

horizontal scroll rails → convert into timeline rails

viewport reveals → convert into sequence staggers

browser UI motion → recreate as frame-driven React motion

Avoid using Remotion as
a raw screen recorder for the website

an iframe wrapper around an animated site

a replacement for all live interaction

a place to overuse motion blur or 3D transitions

a template transition factory

Strong operational do/don’t
Do: build shared visual components with separate motion drivers.

Don’t: build the website one way, then try to “capture it into Remotion” later.

That will create avoidable brittleness.

6. Technical Spec Sheet for Claude Code
Below are the recommended Remotion effect patterns and how they should be implemented.

Pattern 1. Vertical Takeoff / Personal Stakes Cold Open
Visual Purpose

humanize the system immediately

establish that this is about lives, not just forms

Recommended Engine

Remotion core

Sequence

caption timing

Suggested DOM Architecture

full-frame photographic or scanned visual background

darkened overlay

caption block and small date/age markers

optional split image or timeline line

Motion Logic

slow opacity + slight scale settle on background

phrase-by-phrase text reveal

one restrained line/path connecting childhood to adulthood

Implementation Notes for Our Stack

keep this scene clean and mostly typographic

minimal motion, let the narration lead

one composition prop toggles whose story is used

Risks / Caveats

too much documentary treatment can mismatch product demo tone

Priority Recommendation

Must-have

Pattern 2. Document Avalanche / Process Overload
Visual Purpose

show why the current process feels impossible

translate page counts, repeated fields, and fragmentation into something instantly legible

Recommended Engine

Remotion core

Sequence

Freeze

optional low-sample trail accent

Suggested DOM Architecture

layered document cards in AbsoluteFill

repeated field chips floating over them

separate agency badges on outer ring

top annotation layer

Motion Logic

documents enter in waves

repeated fields duplicate and spread

everything compresses into clutter

freeze on peak overload

annotate one or two exact pain points

Implementation Notes for Our Stack

use real-ish but simplified forms, not dense unreadable scans only

let specific repeated labels appear as floating tokens

Risks / Caveats

too much detail becomes unreadable

too much randomness becomes chaotic rather than explanatory

Priority Recommendation

Must-have

Pattern 3. Fragmented Portals Board
Visual Purpose

show disconnected status surfaces and lack of a single system of record

Recommended Engine

Remotion core

Sequence

light path overlays

Suggested DOM Architecture

3–5 mini portal windows in a grid or loose board

each with different timestamps, labels, or missing info

one inactive mail/notices lane

Motion Logic

windows appear sequentially

status labels conflict subtly

mouse/cursor not required

one path tries and fails to connect them cleanly

Implementation Notes for Our Stack

keep portal branding generic unless necessary

emphasize inconsistency, not UI polish

Risks / Caveats

too many windows reduce readability

Priority Recommendation

Must-have

Pattern 4. Unified Dashboard Reveal
Visual Purpose

demonstrate the future-state system clearly

create the emotional “order arrives” moment

Recommended Engine

Remotion core

interpolate()

mild spring() for cards

Suggested DOM Architecture

one parent dashboard shell

left navigation / top rail / center content / right detail panel

layered notification and metric chips

Motion Logic

fragmented board collapses into a single container

shell expands to fill frame

modules populate one by one

active capability zoom receives focus

Implementation Notes for Our Stack

use the same design language as website mockup

this should feel like the canonical future-state visual

Risks / Caveats

if too dense, the viewer won’t know where to look

Priority Recommendation

Must-have

Pattern 5. One Entry, Many Forms Sync Propagation
Visual Purpose

prove the auto-population and shared-record value proposition

Recommended Engine

@remotion/paths

Sequence

interpolate()

Suggested DOM Architecture

one source form on left or center

3–6 destination forms/cards

connector lines between mirrored fields

highlighted shared data tokens

Motion Logic

user enters data once

connectors grow outward

matching fields fill in sequence

duplicates resolve into synchronized values

Implementation Notes for Our Stack

make fields big and legible

show only 2–4 field types, not every possible field

Risks / Caveats

over-literal field-by-field replay can become slow

Priority Recommendation

Must-have

Pattern 6. Validation Catch / RFE Prevention Microscope
Visual Purpose

prove mismatch detection and pre-flight validation

Recommended Engine

Remotion core

Freeze

custom masks/highlights

Suggested DOM Architecture

side-by-side forms or stacked forms

one field mismatch highlighted red

validation panel on side

calm green resolution state after fix

Motion Logic

zoom into mismatch

freeze

show rule hit and explanation

resolve mismatch

route case back into green track

Implementation Notes for Our Stack

use 1–2 mismatches only

this scene should be short and surgical

Risks / Caveats

too much code-like detail will slow the pace

Priority Recommendation

Must-have

Pattern 7. Role-Switch Re-Prioritization
Visual Purpose

show that the same system serves applicants, employers, and attorneys differently

Recommended Engine

Remotion core

Sequence

mild scale/opacity state handoff

Suggested DOM Architecture

one persistent dashboard shell

swappable emphasis panels / labels / CTA regions

role label chip at top

Motion Logic

applicant mode → employer mode → attorney mode

same surface remains, active modules and annotations shift

camera crop and highlight follow the active role

Implementation Notes for Our Stack

this is more credible than building three unrelated dashboards

Risks / Caveats

must keep enough continuity to show “same platform”

Priority Recommendation

Strong candidate

Pattern 8. Deadline Protection / Milestone Ladder
Visual Purpose

show proactive status notifications and process coordination

Recommended Engine

Remotion core

path or rail animation

audio cue optional

Suggested DOM Architecture

vertical or horizontal milestone rail

dates / stages / ownership labels

alert chips and completed checks

Motion Logic

milestone rail advances

upcoming deadline becomes active

notification fires before failure point

rail continues without interruption

Implementation Notes for Our Stack

use for risk mitigation and “no missed window” value story

Risks / Caveats

avoid overcomplicated calendar UI

Priority Recommendation

Strong candidate

Pattern 9. End-to-End Record Spine
Visual Purpose

show the single source of truth across agencies and lifecycle stages

Recommended Engine

@remotion/paths

Remotion core

Suggested DOM Architecture

one central record spine

stage nodes branching to agency interactions

document and status artifacts attach to the spine

Motion Logic

spine forms first

nodes activate in chronological order

legacy duplicate systems fade back

single record remains foregrounded

Implementation Notes for Our Stack

this is the best “architecture shot” in the whole film

Risks / Caveats

if it becomes too abstract, it loses product meaning

Priority Recommendation

Must-have

Pattern 10. Impact Close / Calm Authority Ending
Visual Purpose

conclude with confidence, not hype

leave the room with a believable future state

Recommended Engine

Remotion core

captions optional

subtle metric update

Suggested DOM Architecture

clean dashboard still / system map / concise metrics

short closing statement

optional stakeholder trio icons or labels

Motion Logic

all motion slows

metrics settle in

one final path or underline completes

hold long enough to read

Implementation Notes for Our Stack

no explosive finale

credibility > adrenaline

Risks / Caveats

a weak ending can make the rest feel like demo fragments

Priority Recommendation

Must-have

7. Recommended Motion System for Our Project
7.1 Recommended Motion Stack
Core

remotion

@remotion/player

@remotion/transitions

@remotion/paths

Strong additions

@remotion/captions

@remotion/media-utils

zod + @remotion/zod-types

Optional / constrained use

@remotion/motion-blur

@remotion/three

7.2 Recommended Project Architecture
Shared layers
Design tokens

color, spacing, radii, typography, shadows

Reusable UI components

cards, shells, stat tiles, chips, headers

Scene data/config

labels, metrics, chapter durations, role variants

Website-specific layer
live navigation

scroll sections

optional embedded Player

interactivity

Remotion-specific layer
frame driver

narration timing

scene orchestration

export-safe transitions

7.3 Recommended Motion Vocabulary
Use 5–8 repeatable patterns only.

Masked headline reveal

Layered card stagger

Container form-to-dashboard expansion

Connector/path propagation

Freeze-and-annotate focus hold

Role-based emphasis swap

Milestone rail progression

Calm metric settle

7.4 Recommended Scene Types Mapped to Your Narrative
Current-state chaos
Use:

document avalanche

fragmented portals board

repeated field chip swarm

overloaded status lane

Workspace reveal
Use:

dashboard shell formation

container expansion

progressive module population

Sync propagation
Use:

shared field source node

multi-form connectors

cross-agency record spine

Validation catch
Use:

freeze

zoomed mismatch annotation

green resolution state

Role-switch re-prioritization
Use:

one persistent shell

applicant/employer/attorney emphasis swap

Deadline protection
Use:

milestone ladder

alert pulse before deadline

ownership tag

Scope clarity
Use:

end-to-end lifecycle rail

current vs future topology map

Impact close
Use:

calm dashboard still

concise metrics

closing promise line

7.5 Recommended Intensity Level Relative to the Benchmarks
Relative to the earlier benchmark audit:

Below Chronicle in theatrical intensity

Below Lovart in reveal frequency

Near Doss in compositional restraint

Near Parloa in process-legibility discipline

Selective ReflexAI influence for path and text emphasis

In practical terms:

calmer than a startup launch film

more structured than a static deck

more cinematic than a live demo alone

less flashy than most motion-led SaaS marketing

7.6 Recommended FPS and Format Strategy
Default
30fps for most compositions

Use 60fps only if
you have fast camera sweeps

you have fast connector motion that looks choppy at 30fps

you absolutely need extra smoothness for a small number of scenes

Recommendation
Keep the master presentation at 30fps unless there is a specific proven reason not to.

That is easier to manage, easier to time against narration, and still looks polished for this style.

7.7 Recommended Build Deliverables for Claude Code
Claude Code should not output only a single video file definition.

It should output:

Master composition

Per-chapter compositions

Typed schema for props

Central narrative config

Reusable motion helpers

Shared dashboard/form components

Website embed wrappers for Player/Thumbnail where needed

Suggested file layout:

src/remotion/
  Root.tsx
  schema.ts
  config/
    narrative.ts
    metrics.ts
  components/
    Shell.tsx
    Card.tsx
    MetricChip.tsx
    Annotation.tsx
    PathConnector.tsx
  motion/
    timings.ts
    springs.ts
    reveals.ts
    masks.ts
  scenes/
    Intro/
    CurrentStateChaos/
    FragmentedSystems/
    UnifiedDashboard/
    SyncPropagation/
    ValidationCatch/
    RoleSwitch/
    DeadlineProtection/
    ImpactClose/
  compositions/
    MainPresentation.tsx
    WebsiteDemoCut.tsx
    ChapterPreviews.tsx
8. Open Questions / Unknowns / Confidence Notes
What is high confidence
Remotion is an excellent fit for the guided narrative portion of this project.

It is especially strong for document complexity, dashboard transformation, connector motion, captions, and chapter sequencing.

It should be used as a deterministic compositor, not as an attempt to replay live website motion blindly.

What should still be decided before implementation
Will the final presentation rely on a live website first, with Remotion as support, or a Remotion film first, with the website as support?

Will narration be pre-recorded, or is the video intended to run under live speaking?

Do you want real testimonial clips/images in the opener, or stylized placeholders?

Will the same codebase power both the website demo and Remotion scenes, or do you only need visual consistency?

Is there one master audience, or do you want variants for applicant/employer/attorney focus?

Recommended next step after this research pass
Do not jump straight into full implementation.

Next, Claude Code should receive a second document that converts this audit into:

chapter-by-chapter storyboard specs

per-scene timings

composition schema

component inventory

asset list

build order

That is the right bridge from research to production.

Appendix: Source Notes Used for This Audit
Official Remotion docs areas reviewed
Flickering / deterministic frame model

@remotion/player and Thumbnail

Sequence, Series, Freeze

@remotion/transitions

spring(), interpolate(), measureSpring(), Easing

schema, visual editing, inputProps, calculateMetadata

useDelayRender(), useBufferState()

Img, Audio, Html5Video, OffthreadVideo, IFrame, staticFile()

@remotion/captions

@remotion/media-utils

@remotion/paths

@remotion/motion-blur

@remotion/three

Project inputs used to shape recommendations
current presentation script and notes emphasizing:

personal stories

clips of others

animation

key USCIS phrases

document stacks

current-state to future-state flow

unified dashboard and filing capabilities

specific capability claims such as:

one entry filling many forms

real-time case tracking

milestone notifications

cross-form mismatch detection

digital archive and document management

EOF

Checking file for possible typo
I should quickly check the file, especially section 4.5, to see if there's a typo like "n-" from an accidental insertion. I'll search through the text to confirm if it's there and make a correction if necessary. Let's make sure everything is clean and ready.

Inspecting file for typos in section 4.5
bash -lc grep -n "n-\|Indiviuals\|HBE\|ability" -n /mnt/data/docs/09-remotion-capability-audit.md | head -20 && sed -n '420,560p' /mnt/data/docs/09-remotion-capability-audit.md
1:# Remotion Capability Audit for the MGT120 Website Demo / Presentation
5:This document is the Remotion-side companion to the earlier forensic website motion audit.
16:4. **A scene orchestration layer** for proof-of-capability moments that are hard to guarantee in a live browser demo.
37:- **Remotion** handles cinematic chapter intros, capability proof moments, before/after transformations, and any scene where timing precision matters more than live interactivity.
71:## 2. Remotion Capability Forensic Audit
120:#### Rebuildability assessment
202:#### Rebuildability assessment
247:- custom in-scene motion
269:#### Rebuildability assessment
283:Remotion exposes `spring()` as a physics-based primitive, `interpolate()` for mapping one range to another, `measureSpring()` for estimating how long a spring takes to settle, and `Easing` functions for interpolation-based timing.
345:#### Rebuildability assessment
366:- live in-class presentation
391:  capabilityClaims: {...},
420:#### Rebuildability assessment
473:#### Rebuildability assessment
477:- **Recommendation:** must-have for maintainability
489:The website can contain Remotion-driven media in a way that still feels native.
494:- embedded capability explainer video
533:#### Rebuildability assessment
595:#### Rebuildability assessment
#### Rebuildability assessment

- **Difficulty:** medium if done properly
- **Performance risk:** low
- **Coordination benefit:** very high
- **Recommendation:** must-have

---

### 2.6 Studio and Iteration Workflow

#### Confirmed from docs

If a schema is attached to a composition, props can be edited visually in Remotion Studio. Supported controls include strings, numbers, booleans, arrays, enums, color and textarea helpers from `@remotion/zod-types`, and JSON editing. Modified defaults can be rendered directly from the render dialog.

#### Why this matters for Claude Code handoff

This means Claude Code should not produce only one hardcoded timeline.

It should produce a **composable video workspace**:

- multiple compositions
- folders for organization
- typed props
- chapter toggles
- theme toggles
- scene-level controls

That way you are not trapped in source edits every time the story changes.

#### Recommended folder structure

```tsx
<Folder name="Masters">
  <Composition id="MainPresentation" ... />
  <Composition id="WebsiteDemoCut" ... />
  <Composition id="ShortTeaser" ... />
</Folder>

<Folder name="Chapters">
  <Composition id="IntroChapter" ... />
  <Composition id="ChaosChapter" ... />
  <Composition id="DashboardChapter" ... />
  <Composition id="ImpactClose" ... />
</Folder>
```

#### Workflow recommendation

- iterate scene-by-scene in isolated compositions
- assemble into master cut only after chapter timings feel right
- keep all claim numbers and labels in data files, not embedded in JSX strings everywhere

#### Rebuildability assessment

- **Difficulty:** medium
- **Performance risk:** none
- **Recommendation:** must-have for maintainability

---

### 2.7 Player Integration: `@remotion/player`

#### Confirmed from docs

The Remotion Player can be embedded in any React app, can be controlled programmatically through a ref, supports events, lazy loading, looping, frame ranges, and runtime customization. The `Thumbnail` component can display a single frame of a composition inside a normal React app.

#### What this unlocks for our project

The website can contain Remotion-driven media in a way that still feels native.

Good uses:

- hero preview or teaser block
- embedded capability explainer video
- scene selector with previews
- alternate “watch the guided demo” mode inside the site
- hover or static chapter thumbnails

#### Best use case split

**Use `<Player>` for:**
- a controlled mini-film embedded in the site
- chapter playback inside the demo page
- optional explanatory sidecar video next to the live website

**Use `<Thumbnail>` for:**
- chapter cards
- slide-sized previews
- feature navigation tiles
- still poster frames on landing sections

#### Important constraint

The Player is not the same as a final render.

Build compositions so they are good in both contexts, but do not assume everything that is acceptable in a local Player is ideal for final export.

#### Recommended website integration pattern

- main website stays normal React/Vite
- one or two deliberate Remotion Player embeds
- lazy load the Player so the site stays responsive
- use thumbnails and poster frames in more places than full players

#### Recommended control UX

- segment buttons for chapters
- “watch guided version” CTA
- play from selected scene
- muted autoplay only if policy allows and visual value is strong
- otherwise start paused with clean poster frame

#### Rebuildability assessment

- **Difficulty:** medium
- **Performance risk:** medium if too many players mount at once
- **Responsiveness risk:** medium on lower-end devices
- **Recommendation:** strong candidate, limited and deliberate use

---

### 2.8 Asset Handling: `Img`, `Audio`, `Html5Video`, `OffthreadVideo`, `IFrame`, `staticFile`

#### Confirmed from docs

Remotion recommends using its own media wrappers such as `Img`, `Audio`, `Html5Video`, `OffthreadVideo`, and `IFrame` so assets are fully loaded before frame rendering. `staticFile()` is the correct way to reference public assets. `OffthreadVideo` extracts frames outside the browser using FFmpeg and is not supported in client-side rendering. `IFrame` waits for the iframe to load, but the docs explicitly warn that ideally the website inside the iframe should not have its own animations, because only animations using `useCurrentFrame()` are supported reliably in Remotion.

#### Correct tool split for this project

**`Img`**
- default for logos, screenshots, icons, diagrams, and UI states
- use often

**`Html5Video`**
- fine for preview/player situations
- use for client-side preview clips when needed

**`OffthreadVideo`**
- best for final render when you need to include pre-rendered clips, screen captures, or videos with precise frame extraction
- do not rely on it inside the website Player
Checking section 4.5 for typo
I need to quickly inspect section 4.5 for any potential typos. I'll review the text there to ensure everything looks correct and that there are no mistakes. It's a small step, but I don't want to miss anything important! Let's make sure it's all neat.

Inspecting typo in section 4.5
bash -lc grep -n "n- headline\|n-\|n- headline" /mnt/data/docs/09-remotion-capability-audit.md && sed -n '690,760p' /mnt/data/docs/09-remotion-capability-audit.md
5:This document is the Remotion-side companion to the earlier forensic website motion audit.
247:- custom in-scene motion
283:Remotion exposes `spring()` as a physics-based primitive, `interpolate()` for mapping one range to another, `measureSpring()` for estimating how long a spring takes to settle, and `Easing` functions for interpolation-based timing.
366:- live in-class presentation
489:The website can contain Remotion-driven media in a way that still feels native.
677:- sync capability labels to reveals rather than putting everything on-screen at once
740:### 2.12 Motion Blur and Trails: `@remotion/motion-blur`
846:## 4. Best-in-Class Moves for This Project
850:**Best Remotion-native move:**
870:**Best Remotion-native move:**
882:**Best Remotion-native move:**
894:**Best Remotion-native move:**
906:**Best Remotion-native move:**
913:n- headline fragments
920:**Best Remotion-native move:**
934:**Best Remotion-native move:**
948:**Best Remotion-native move:**
972:- presentation-safe exports
1359:- `@remotion/motion-blur`
1380:#### Remotion-specific layer
1472:- less flashy than most motion-led SaaS marketing
1590:- `@remotion/motion-blur`
#### Confirmed from docs

`@remotion/paths` provides utilities for SVG path length, path interpolation, points/tangents, and `evolvePath()` for animating a path from invisible to fully drawn.

#### Why this is one of the best Remotion capabilities for your project

Your product concept is full of system relationships:

- applicant → employer → attorney → USCIS/DOL/DOS
- field sync across forms
- notifications propagating across roles
- case status moving through stages
- fragmented systems becoming a single record

That makes path animation a perfect fit.

#### Recommended uses

- timeline spine across OPT → H-1B → green card
- connector sweeps between duplicated forms collapsing into one source of truth
- milestone propagation pulses across stakeholder nodes
- line-draw overlays over maps, dashboards, or system diagrams
- before/after process graphs

#### Motion style recommendation

Keep paths:

- thin to medium weight
- clean and geometric
- slightly eased
- not neon sci-fi
- not particle-heavy

Pair line growth with:

- node activation
- small metric number changes
- opacity lifts
- minimal glow or blur if any

#### Rebuildability assessment

- **Difficulty:** medium
- **Performance risk:** low to medium
- **Project fit:** very high
- **Recommendation:** must-have

---

### 2.12 Motion Blur and Trails: `@remotion/motion-blur`

#### Confirmed from docs

Remotion offers higher-order motion blur and trail effects. `CameraMotionBlur` creates film-like blur by sampling multiple layers, but the docs warn it is destructive to colors and recommend keeping samples low. `Trail` lets you set layers, lag in frames, and trail opacity.

#### Recommendation for this project

Use motion blur as a spice, not a base layer.

Good uses:

- fast connector sweep
- one accent fly-through
- one document scatter moment
- one alert/pulse motion accent

Bad uses:

- on typography
- on dashboards most of the time
Fixing typo at line 913
I need to address a typo at line 913. It’s a small issue, but I want to make sure everything is perfect—especially if it could cause confusion. I’ll patch it up and double-check that everything else looks good while I’m at it!

Patching typo in document text
bash -lc python - <<'PY'
from pathlib import Path
p=Path('/mnt/data/docs/09-remotion-capability-audit.md')
text=p.read_text()
text=text.replace('\nn- headline fragments\n','\n- headline fragments\n')
p.write_text(text)
PY
Inspecting final file for corrections
I should take another look at the final file, specifically around the section I corrected. It’s better to double-check everything just to be sure, ensuring everything looks good after the changes. I want to make sure nothing else got overlooked! Let’s give it a quick review.

Inspecting specific section of file
bash -lc sed -n '900,920p' /mnt/data/docs/09-remotion-capability-audit.md
- a case moving through agencies

This is arguably the single best Remotion specialty for your subject matter.

### 4.5 Text mask reveals

**Best Remotion-native move:**

Reveal only the specific legal phrase or metric you are discussing in the voiceover.

Do not animate paragraphs. Animate:

- labels
- headline fragments
- legal terms
- capability names
- key metrics

### 4.6 Horizontal rail sections

**Best Remotion-native move:**
Clarifying approach to citations
I'm considering including web citations in the final response, since the user expects a high level of specificity around capabilities like Remotion. The final response should mention key findings, reference the user's script, and cite everything factually, including the turn1file0 citation. I'll also refer to the Remotion docs and any relevant notes.

Thought for 17m 39s
Done