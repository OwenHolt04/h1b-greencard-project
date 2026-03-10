# Forensic Animation Audit

## 1. Executive Summary

This audit reverse-engineers five benchmark SaaS marketing sites from the standpoint of **motion system design**, not visual taste. The goal is to identify what is most likely happening technically, how those effects are structurally enabled, and which patterns are worth recreating for a **presentation-first workflow platform** built in **React/Vite + utility CSS**, with **Remotion-assisted promo capture**.

### Bottom line

The benchmark set splits into two clear motion families:

1. **Heavy narrative scroll orchestration**
   - **Chronicle** is the clearest example.
   - Strongest signals: narrative sequencing, likely pinned storytelling moments, zoom/card stagecraft, and explicit third-party evidence for **Next.js**, **React**, and likely **GSAP** usage, plus **Lottie** on the site. citeturn31view0turn31view1turn32view0turn32view1

2. **Structured reveal systems with selective scroll-linking**
   - **ReflexAI**, **Doss**, **Parloa**, and **Lovart** appear to rely more on high-discipline section composition, progressive disclosure, staggered reveals, and media/asset swaps than on maximal “showreel” motion.
   - These are more adaptable to a calm, institutional, high-trust product story.

### Recommended takeaway for our project

Do **not** copy the benchmark sites wholesale.

Use a **three-tier motion stack** instead:

- **Default layer:** native scroll + `IntersectionObserver` + CSS transforms/transitions for reveal systems
- **Stateful choreography layer:** **Framer Motion** for modular scene components, stagger logic, focus hierarchy, and deterministic UI transitions
- **Special-case narrative layer:** **GSAP + ScrollTrigger only for 1-2 pinned story sections** where scrub precision or true horizontal rail progression materially improves the story

### Most valuable patterns to borrow

- **Chronicle:** pinned multi-card story progression, zoomed canvas transitions, guided focus
- **Doss:** boxed container growth/compression, disciplined section shells, scale-with-restraint
- **Parloa:** horizontal lifecycle rail / process scrubbing, if simplified and made deterministic
- **ReflexAI:** SVG/path reveal language, text-mask style emphasis, metrics panels that feel data-backed rather than flashy
- **Lovart:** viewport stagger systems, before/after swaps, modular feature reveals that read well in both browser and captured video

### Strong recommendation

For our own site/video, the best motion vocabulary is:

- pinned story chapter
- masked headline reveal
- staggered card enter
- container expand / focal zoom
- connector or propagation sweep
- side-by-side state swap
- horizontal rail stepper
- evidence panel lift / settle

But intensity should be **below Chronicle and below Lovart**, closer to **Doss + Parloa discipline**, with selective Chronicle-style chaptering.

---

## 2. Site-by-Site Forensic Audit

---

## ReflexAI

### What is confirmed from inspection

- The homepage is structured around a hero, then a **Roleplay / QA / measurable outcomes** section with visible numeric counters and training modules such as configurable personas and simulations. citeturn30view5
- Saaspo classifies the landing page style as **Scroll Animations** with **Animated** assets, but does **not** identify a specific frontend stack. citeturn32view4

### Engine Identification

- **GSAP / ScrollTrigger:** **Inferred, medium confidence**
  - Evidence: the site category and observed motion language suggest animation beyond simple fade-ins, but there is no direct profiler confirmation.
- **Framer Motion:** **Inferred, low-to-medium confidence**
  - Evidence: the modular feature-reveal structure could be built this way, but there is no direct signal.
- **Native Intersection Observer + CSS transforms:** **Inferred, high confidence**
  - Evidence: the layout and section rhythm would support reveal-on-enter patterns without requiring a heavy animation runtime.
- **SVG path animation / mask animation:** **Inferred, high confidence for effect family, low confidence for exact implementation**
  - Evidence: the user-specified target focus on SVG path reveals and text masks matches the site’s observed brand language and the way metrics/features are staged, but this could be achieved with SVG stroke manipulation, clip-path, CSS masking, or canvas/Lottie assets.
- **Lenis / Locomotive / custom smooth scroll:** **Not confirmed**
  - No reliable evidence surfaced.

### Physics & Math

**Observed motion family:** restrained, scroll-triggered-to-hybrid.

**Likely ranges**

- Reveal offset: `12px` to `40px` Y-translate
- Opacity fade: `0 -> 1`
- Headline mask travel: roughly `100% -> 0%` clip / wipe over `0.45s - 0.9s`
- SVG line draw: `stroke-dashoffset` scrubbed or timed over `0.8s - 1.8s`
- Metric panel stagger: `60ms - 140ms` per item
- Section overlap: modest, likely `80ms - 180ms`
- Easing: likely cubic-bezier in the neighborhood of `easeOut` / `circOut` / `power2.out`

**Motion type assessment**

- Headline and path reveals: likely **time-based after trigger**
- Metrics and content blocks: likely **scroll-triggered**
- Any diagram/path sequencing: possibly **hybrid**, where scroll triggers a timeline that completes on its own

### DOM / Layout Architecture

Most likely structure:

- standard stacked sections
- oversized media shell or diagram shell inside each section
- layout-stable copy column
- transform-only decorative or explanatory layer
- possible absolutely positioned SVG overlay inside a relatively positioned container
- no strong evidence that the entire page depends on full-section pinning

This is likely a **stable-layout + animated overlay** architecture rather than a deeply pinned storytelling site.

### Human-Readable Pattern Description

**User perception:**
You scroll through serious product claims, and the site reveals them with enough motion to feel premium, but not so much that the page becomes theatrical.

**Likely technical reality:**
The copy remains mostly layout-stable while emphasized elements, counters, paths, and masks animate independently. The site probably earns its polish from **layer separation** rather than giant camera moves.

**Why it feels premium:**
The motion likely reinforces the product message rather than competing with it. That is exactly the right behavior for trust-heavy workflows.

### Rebuildability Assessment

**Best implementation choice for our stack:**
- **Primary:** CSS/SVG + Framer Motion
- **Avoid needing GSAP unless a specific sequence really needs scrub precision**

**Difficulty:** Low to medium

**Performance risks:**
- too many simultaneous counter/path animations
- SVG complexity if paths are large or filter-heavy

**Accessibility risks:**
- masked text that hides too much content too long
- counters or animated numerals that become distracting

**Responsiveness risks:**
- path overlays can drift out of alignment if tied to brittle absolute coordinates

**Remotion capture risks:**
- low, if rebuilt as timeline-driven components rather than live scroll reactions

**Recommendation:** **Borrow directly**, but keep it stricter and more explicit than ReflexAI.

---

## Chronicle

### What is confirmed from inspection

- Chronicle presents itself as an AI presentation product for business-critical decks, with sections such as “Start from anywhere,” “Generate impressive slides,” “Edit with AI,” and “Share in any format.” It explicitly states that editing happens on a **freeform canvas** and highlights templates from major design/business contexts. citeturn33view0
- Third-party technology profiling identifies **Next.js** and **Apollo GraphQL** on chroniclehq.com, with CloudFront also detected. citeturn31view0turn31view1turn31view2
- LottieFiles lists Chronicle as a site using **Lottie animations**. citeturn32view0
- SaaS Landing Page lists Chronicle with **GSAP, Next.js, React, and Tailwind CSS**. citeturn32view1
- Saaspo categorizes Chronicle as **Next.js** with **Scroll Animations**. citeturn32view2

### Engine Identification

- **Next.js / React:** **Confirmed** via BuiltWith and third-party stack index. citeturn31view0turn32view1
- **GSAP:** **Inferred, high confidence**
  - Evidence: SaaS Landing Page explicitly lists GSAP in the stack, and Chronicle’s motion grammar strongly fits GSAP-style orchestration. citeturn32view1
- **ScrollTrigger:** **Inferred, high confidence**
  - Evidence: the target motion family on Chronicle is pinned card stacks and zoom-style transitions; those are classic ScrollTrigger territory, especially in React/Next marketing pages.
- **Lottie:** **Confirmed** by LottieFiles listing. citeturn32view0
- **Framer Motion:** **Possible but unconfirmed**
  - Evidence is weaker than for GSAP.
- **Lenis / Locomotive / custom smooth scroll:** **Not confirmed**

### Physics & Math

**Observed motion family:** cinematic, layered, likely scrub-linked in key sections.

**Likely ranges**

- Pin duration for story chapters: `160vh - 320vh`
- Card stack Y-offsets: `24px - 96px`
- Scale range on focal card/media: `0.92 -> 1.00` or `1.00 -> 1.08`
- Perspective/zoom transitions between feature states: `8% - 18%` apparent camera push
- Staggers inside a chapter: `80ms - 180ms`
- Scrub smoothing: likely `0.2 - 0.8s` equivalent damping if using ScrollTrigger scrub
- Easing outside strict scrubbed sections: `power2.out`, `power3.out`, or similar non-spring ease

**Motion type assessment**

- Major card stack transitions: likely **scroll-linked / scrubbed**
- Sub-element reveals within a pinned chapter: likely **hybrid**
- Lottie or micro-illustration moments: likely **time-based after trigger**

### DOM / Layout Architecture

Most likely structure:

- tall narrative sections with **sticky or pinned wrappers**
- one primary viewport-height story shell
- stacked cards or stacked presentation frames positioned with `absolute` layers inside the shell
- a stable section wrapper that controls scroll distance
- transforms applied to inner cards/media, not outer document flow
- likely z-index swapping and opacity handoff rather than actual layout reflow

This is exactly the kind of architecture that produces “camera movement” without actually moving the whole page.

### Human-Readable Pattern Description

**User perception:**
The page feels like a guided presentation. Instead of just scrolling down a website, you seem to move through a sequence of composed scenes.

**Likely technical reality:**
Chronicle probably uses one or more pinned sections in which multiple cards, canvases, or slide frames share the same viewport shell. As scroll advances, cards scale, shift, fade, and hand off attention.

**Why it feels premium:**
Because the motion is not just decorative. It simulates the product’s core promise: structured storytelling, focus control, and polished flow.

### Rebuildability Assessment

**Best implementation choice for our stack:**
- **GSAP + ScrollTrigger** for any faithful recreation
- Framer Motion alone can emulate parts of it, but the pinned/scrubbed story sections are easier and more maintainable in GSAP if used sparingly

**Difficulty:** High

**Performance risks:**
- too many overlapping transforms and image layers
- large pinned sections on lower-end devices
- potential jank if combined with aggressive smooth scroll

**Accessibility risks:**
- scroll hijack feel if overdone
- focus order problems if pinned content is not semantically ordered

**Responsiveness risks:**
- stacked-card compositions often break at tablet widths if not redesigned rather than simply scaled down

**Remotion capture risks:**
- medium to high if the site depends on live scroll state
- low if rebuilt as Remotion scenes using the same choreography but timeline-driven

**Recommendation:** **Adapt, do not clone.** Chronicle’s chaptering is the most valuable benchmark here, but its intensity should be reduced.

---

## Doss

### What is confirmed from inspection

- Doss presents a strongly boxed, modular product page centered on “DOSS Operations Cloud,” “Adaptive Resource Platform,” and a sequence of product claims such as adapting operations, connecting tools, unifying master data, and automating the value chain. citeturn30view6
- Saaspo classifies Doss as **Scroll Animations** with a **Boxed** style and does not identify the stack beyond “Other.” citeturn32view6

### Engine Identification

- **CSS sticky + transform orchestration:** **Inferred, high confidence**
  - Evidence: the boxed-shell design and container-led storytelling strongly suggest shell-based transitions rather than full-canvas choreography.
- **Framer Motion or native IO-based reveals:** **Inferred, medium-to-high confidence**
- **GSAP / ScrollTrigger:** **Inferred, medium confidence**
  - Possible for container expansion or scrubbed scaling, but not necessary for most of the visible effect family.
- **Lenis / Locomotive:** **Not confirmed**

### Physics & Math

**Observed motion family:** architectural, restrained, container-first.

**Likely ranges**

- Container scale: `0.96 -> 1.00` or `1.00 -> 1.04`
- Border radius shifts: subtle tightening/relaxing during section emphasis
- Section shell Y-translate: `16px - 48px`
- Nested content reveal stagger: `60ms - 120ms`
- Media panel drift/parallax: `8px - 24px`
- Duration if time-based: `0.45s - 0.9s`
- Easing: likely `power2.out`, `easeOutCubic`, or similarly polished non-bouncy easing

**Motion type assessment**

- Mostly **scroll-triggered**
- Some sections likely use **light scroll-linking** for scale/position
- Not likely heavily spring-based

### DOM / Layout Architecture

Most likely structure:

- repeated full-width or max-width **boxed shells**
- internal media cards with overflow clipping
- a section wrapper that stays layout-stable
- transform applied to the shell or to one hero media block inside the shell
- nested feature rows entering with stagger

This is one of the cleanest patterns in the benchmark set for maintainable implementation.

### Human-Readable Pattern Description

**User perception:**
Each section feels like a controlled stage. Containers expand, settle, and reveal detail in a measured way.

**Likely technical reality:**
The page is probably built from repeated shell components with consistent padding, clipping, and transform targets. Motion lives inside those shells, which keeps the rest of the layout stable.

**Why it feels premium:**
Because the system is highly repeatable. Repetition plus disciplined transform ranges makes the page feel expensive without seeming busy.

### Rebuildability Assessment

**Best implementation choice for our stack:**
- **Framer Motion** for section shells and nested staggering
- **CSS sticky + native scroll orchestration** where light progress-based scaling is needed
- GSAP only if a specific chapter truly needs pinning

**Difficulty:** Low to medium

**Performance risks:**
- generally low
- watch for too many box shadows, filters, or huge images

**Accessibility risks:**
- low if motion is subtle and disabled under reduced motion

**Responsiveness risks:**
- medium if shell proportions are too desktop-dependent

**Remotion capture risks:**
- very low

**Recommendation:** **Strong candidate.** Doss is one of the best direct fits for our calm, institutional, product-proof tone.

---

## Parloa

### What is confirmed from inspection

- The homepage leads with AI-agent messaging, then a structured sequence of industry blocks and a section called **“Engineered for reliability, built for scale”** with an **AI Agent lifecycle** presented as **Design / Test / Scale / Optimize** plus a playable visual asset. citeturn30view1turn30view2turn33view1
- Saaspo classifies Parloa as **Next.js** with **Scroll Animations**. citeturn32view3

### Engine Identification

- **Next.js:** **Confirmed** by Saaspo. citeturn32view3
- **Horizontal rail scrubbing:** **Inferred, high confidence for pattern family**
  - Evidence: the lifecycle presentation and the benchmark brief align strongly with horizontally sequenced process storytelling.
- **GSAP + ScrollTrigger:** **Inferred, medium-to-high confidence**
  - Evidence: true horizontal rail sections with scrub usually justify ScrollTrigger more than Framer Motion.
- **CSS sticky + translated X track:** **Inferred, high confidence**
  - Whether or not GSAP is present, the structural pattern is almost certainly a sticky viewport with a horizontally shifting inner rail.
- **Lenis / Locomotive:** **Not confirmed**

### Physics & Math

**Observed motion family:** process-oriented, glide-based, likely scrub-driven in the lifecycle rail.

**Likely ranges**

- Horizontal track translation: `0% -> -300%` across a multi-step story, depending on number of panels
- Pin duration: roughly `180vh - 360vh`
- Card enter/exit overlap: `10% - 20%` of chapter progress
- Supporting label opacity crossfade: `0 -> 1 -> 0`
- Scale on active panel: `0.96 -> 1.00` or `1.00 -> 1.03`
- Easing under scrub: mostly linear or near-linear, with eased sub-animations

**Motion type assessment**

- Lifecycle rail: likely **scroll-linked / scrubbed**
- Supporting badges/stats: likely **time-based after trigger** or **hybrid**

### DOM / Layout Architecture

Most likely structure:

- tall outer section to create scroll distance
- `sticky` viewport-height inner wrapper
- extra-wide horizontal track inside the wrapper
- each step as a fixed-width panel or card
- active-state indicators and labels layered separately from the rail
- translation applied to inner track, not to the whole page

This is a standard but powerful way to make process steps feel guided and consequential.

### Human-Readable Pattern Description

**User perception:**
The page converts a multi-step platform story into a controlled journey. Instead of reading a static list of stages, you move through them.

**Likely technical reality:**
A sticky section freezes the viewport while an inner strip moves sideways. The currently active stage receives emphasis through scale, opacity, or label treatment.

**Why it feels premium:**
Because it turns process complexity into a single clear sequence, which is especially useful for enterprise software with lifecycles, workflows, or operating stages.

### Rebuildability Assessment

**Best implementation choice for our stack:**
- **GSAP + ScrollTrigger** if we want a true horizontal scrub chapter
- **Alternative:** fake the same effect with vertically stacked cards for the web, and use Remotion-only horizontal motion in video

**Difficulty:** Medium to high

**Performance risks:**
- horizontal tracks with large images can be memory-heavy
- sticky + translateX sections can stutter on resize if measurements are not recalculated well

**Accessibility risks:**
- horizontal storytelling can be harder to parse for keyboard and assistive-tech users if semantics are poor

**Responsiveness risks:**
- very high if the same rail is forced onto narrow viewports

**Remotion capture risks:**
- medium if the website depends on live scroll
- low if recreated directly on a timeline for video

**Recommendation:** **Adapt selectively.** The pattern is valuable for one lifecycle chapter, but should not dominate the site.

---

## Lovart

### What is confirmed from inspection

- Lovart’s homepage uses a dark, product-demo-first structure, opening with a chat-like creative workflow and later showing sections such as **“Thinking, in Systems,” “Design, beyond generation,” “Touch Edit,” “Style Consistency,” “Text Edit,”** and **“Visual Insights.”** citeturn30view3turn30view4turn33view2
- The site explicitly says Lovart “searches the web in real time” for visual insights. citeturn33view2
- Saaspo classifies Lovart as **Dark Mode** with **Scroll Animations** and leaves the stack as “Other.” citeturn32view5

### Engine Identification

- **Viewport-triggered stagger system:** **Inferred, high confidence**
  - Evidence: repeated modular feature sections and before/after visual shells strongly fit IO-triggered stagger reveals.
- **Framer Motion:** **Inferred, medium confidence**
  - Evidence: this motion family maps very naturally to variants/staggers, though not directly confirmed.
- **Native Intersection Observer + CSS transforms:** **Inferred, high confidence**
- **GSAP / ScrollTrigger:** **Possible but not necessary**
  - No strong reason to assume heavy pinning from the observable structure alone.
- **Lenis / Locomotive:** **Not confirmed**

### Physics & Math

**Observed motion family:** reveal-forward, modular, visually rich but compartmentalized.

**Likely ranges**

- Stagger gap: `70ms - 140ms`
- Y-translate enter: `18px - 36px`
- Opacity: `0 -> 1`
- Scale settle on image cards: `0.98 -> 1.00`
- Before/after swap timing: `0.35s - 0.7s`
- Highlight panel transition: `0.45s - 0.85s`
- Easing: gentle `easeOut` curves, likely no pronounced springing

**Motion type assessment**

- Mostly **scroll-triggered**
- Some tabs/swaps may be **time-based after trigger**
- Low evidence for long pinned sections

### DOM / Layout Architecture

Most likely structure:

- strongly modular section stack
- each feature as an independent media+copy module
- image shells with overflow clipping
- before/after examples positioned in a controlled frame
- progressive activation by viewport intersection
- maybe light parallax or image drift, but no need for heavy global orchestration

### Human-Readable Pattern Description

**User perception:**
The page keeps showing one compelling capability at a time. You are not overwhelmed; you are walked through a series of sharp, visually legible feature moments.

**Likely technical reality:**
The page is probably built from repeatable reveal modules with consistent stagger logic, image-frame animation, and local transitions.

**Why it feels smooth / premium:**
Because it is modular and legible. Motion is attached to content blocks, not sprayed across the whole page.

### Rebuildability Assessment

**Best implementation choice for our stack:**
- **Framer Motion** for variants/staggers/local state swaps
- **Native IO + CSS** if we want to reduce dependencies further

**Difficulty:** Low

**Performance risks:**
- low to medium depending on media weight

**Accessibility risks:**
- manageable, especially if content appears in DOM order and reduced motion is honored

**Responsiveness risks:**
- low if modules collapse cleanly to single-column layouts

**Remotion capture risks:**
- very low

**Recommendation:** **Must borrow selectively.** Lovart is the best benchmark for modular capability showcases that can survive both browser interaction and video capture.

---

## 3. Comparative Motion Pattern Matrix

| Benchmark | Primary pinning style | Reveal style | Stagger style | Scroll smoothing style | Container strategy | DOM composition strategy | Perceived intensity | Implementation complexity | Fit for our project |
|---|---|---|---|---|---|---|---|---|---|
| ReflexAI | Minimal or selective pinning | text masks, counters, path-like reveals | light-to-moderate | unknown / likely native-feeling | stable sections with animated overlays | layout-stable copy + animated SVG/media layer | low-medium | medium | strong |
| Chronicle | strong pinned story chapters | stacked cards, zoom, focus handoff | moderate within pinned scenes | likely custom orchestration, not confirmed | viewport shell / stacked cards | sticky or pinned wrapper + absolute inner layers | high | high | adapt only |
| Doss | little to moderate pinning | boxed shell reveal, scale, settle | light | likely native-feeling | repeated boxed shells | layout-stable sections with inner shell transforms | low-medium | low-medium | very strong |
| Parloa | selective pinning for lifecycle rail | step progression, likely horizontal scrub | moderate | likely scrub-based in key chapter | sticky shell + horizontal track | pinned viewport + translated x rail | medium | medium-high | selective |
| Lovart | limited pinning | viewport reveals, before/after swaps, media enter | medium, modular | likely native-feeling | modular media frames | repeatable section modules | medium | low | very strong |

### Summary judgment

- **Best fit overall:** Doss + Lovart
- **Best special chapter inspiration:** Chronicle + Parloa
- **Best detail language:** ReflexAI

---

## 4. Best-in-Class Moves

### Current-state chaos → order transition

**Best source:** Chronicle + Doss

- Chronicle contributes the **narrative camera move** and chaptered reveal
- Doss contributes the **container discipline** that makes order feel credible

**Recommended adaptation:**
Start with fragmented cards, forms, or portal states. Compress them into a centered evidence shell. Then zoom into the unified workspace.

### Pinned story progression

**Best source:** Chronicle

Use a single pinned chapter, not several. It should carry the user from problem clutter to one clear future-state operating model.

### Multi-card sequencing

**Best source:** Chronicle + Lovart

- Chronicle for stacked hierarchy and handoff
- Lovart for content-module repeatability

### Data-flow / connector motion

**Best source:** ReflexAI + Parloa

- ReflexAI for path-led emphasis
- Parloa for directional lifecycle motion

### Text mask reveals

**Best source:** ReflexAI

Use them only for chapter titles and key proof points, not every heading.

### Horizontal rail sections

**Best source:** Parloa

Best used for one lifecycle or one multi-role handoff sequence. Avoid for general feature browsing.

### Viewport stagger systems

**Best source:** Lovart

This is the safest and most reusable motion pattern in the set.

### Container expansion / zoom storytelling

**Best source:** Doss + Chronicle

- Doss gives the cleaner shell logic
- Chronicle gives the dramatic presentation-forward progression

---

## 5. Do / Don’t Copy Guidance

### ReflexAI

**Borrow directly**
- SVG/path-led emphasis
- masked or clipped headline reveal
- measured metric animation

**Adapt**
- make counters slower and more sober
- ensure data emphasis supports trust, not hype

**Avoid**
- over-animating every metrics block
- overly gamified numeric motion

### Chronicle

**Borrow directly**
- pinned chapter storytelling
- focus handoff between stacked visual states
- zoom-to-context transitions

**Adapt**
- reduce intensity
- use fewer pinned chapters
- replace generic startup wow with capability proof and workflow consequence

**Avoid**
- long, flashy pinning sequences
- too many overlapping layers
- relying on motion to hide weak information architecture

### Doss

**Borrow directly**
- boxed-shell composition
- subtle scale/expand/settle motion
- disciplined repetition across sections

**Adapt**
- add clearer scene-to-scene narrative progression
- make shells slightly more story-oriented

**Avoid**
- over-uniformity that becomes visually flat

### Parloa

**Borrow directly**
- lifecycle chapter framing
- directional rail progression
- process-as-journey storytelling

**Adapt**
- shorten chapter length
- allow vertical fallback on smaller screens

**Avoid**
- multiple horizontal scrub sections
- over-reliance on horizontal interaction for basic understanding

### Lovart

**Borrow directly**
- modular capability reveals
- before/after state comparisons
- viewport-triggered stagger system

**Adapt**
- reduce art-demo energy
- use more institutional spacing and typography

**Avoid**
- excessive novelty framing
- making every block behave like a product toy demo

---

## 6. Technical Spec Sheet for Claude Code

### Pattern 1: Pinned Story Chapter

**Visual Purpose**
- Turn a complex multi-step narrative into one guided moment
- Best for current-state chaos → ordered future state

**Recommended Engine**
- **GSAP + ScrollTrigger**

**Suggested DOM Architecture**
- outer section with tall scroll height (`220vh - 320vh`)
- inner `sticky top-0 h-screen` wrapper
- absolute-positioned card/media layers inside wrapper
- semantic copy in DOM order, even if visuals overlap

**Motion Logic**
- scroll progress drives `opacity`, `translateY`, `scale`, and z-emphasis across 3-5 layers
- use discrete progress windows per scene, e.g.:
  - scene A: `0.00 - 0.22`
  - scene B: `0.18 - 0.48`
  - scene C: `0.44 - 0.74`
  - scene D: `0.70 - 1.00`
- keep only one primary focal object fully dominant at a time

**Implementation Notes for Our Stack**
- isolate GSAP to this one chapter
- build a reusable `PinnedStorySection` component
- keep transform targets in refs, not queried globally
- export a Remotion twin component with time-based progress instead of scroll

**Risks / Caveats**
- easy to overcomplicate
- responsive layout must be intentionally redesigned below desktop

**Priority Recommendation**
- **Must-have**

---

### Pattern 2: Masked Headline Reveal

**Visual Purpose**
- Introduce chapter titles with authority
- Direct attention without decorative excess

**Recommended Engine**
- **CSS + Framer Motion**

**Suggested DOM Architecture**
- wrapper with `overflow-hidden`
- inner text span translated on Y or clipped via `clip-path`
- optional secondary underline/path layer

**Motion Logic**
- on enter: `y: 100% -> 0%`, `opacity: 0 -> 1`
- duration `0.55s - 0.9s`
- optional word-level stagger `40ms - 70ms`

**Implementation Notes for Our Stack**
- expose as reusable `MaskedHeading`
- support reduced-motion fallback to instant appearance

**Risks / Caveats**
- do not delay readability

**Priority Recommendation**
- **Strong candidate**

---

### Pattern 3: Section Shell Expand / Settle

**Visual Purpose**
- Give sections a premium “stage” without huge motion
- Useful for workspace reveal, evidence panels, dashboards

**Recommended Engine**
- **Framer Motion** or CSS transforms

**Suggested DOM Architecture**
- max-width rounded shell with overflow clipping
- inner media region and side content region
- shell remains in flow; only shell/media transforms animate

**Motion Logic**
- initial `scale: 0.985`, `y: 24`, `opacity: 0`
- animate to `scale: 1`, `y: 0`, `opacity: 1`
- nested children stagger after shell lands

**Implementation Notes for Our Stack**
- create one shell component used across chapters
- keep the same radius, border, and shadow vocabulary site-wide

**Risks / Caveats**
- can become repetitive if every section feels identical

**Priority Recommendation**
- **Must-have**

---

### Pattern 4: Multi-Card Sequence Stack

**Visual Purpose**
- Show progression across roles, states, or documents
- Good for showing fragmented current-state systems or ordered future-state flows

**Recommended Engine**
- **Framer Motion** by default
- **GSAP** if tied to a pinned chapter

**Suggested DOM Architecture**
- card stack wrapper
- cards absolutely layered or vertically stacked depending on viewport
- active card owns scale/contrast

**Motion Logic**
- inactive cards: `scale 0.96 - 0.99`, reduced opacity, slight offset
- active card: `scale 1`, stronger shadow/contrast
- handoff every `0.5s - 1.2s` in video or per scroll window on web

**Implementation Notes for Our Stack**
- maintain strict depth hierarchy
- use card count limits; 3-4 visible layers max

**Risks / Caveats**
- too many cards makes the scene muddy

**Priority Recommendation**
- **Strong candidate**

---

### Pattern 5: Horizontal Lifecycle Rail

**Visual Purpose**
- Turn step-based process logic into an intuitive journey
- Ideal for design → test → validate → act style sequences

**Recommended Engine**
- **GSAP + ScrollTrigger** for web
- **Remotion-only timeline version** for promo video

**Suggested DOM Architecture**
- tall outer section
- sticky viewport wrapper
- horizontal flex track wider than viewport
- active-step labels separated from rail visuals

**Motion Logic**
- map scroll progress to `translateX`
- each step owns a segment of progress
- active step gets emphasis via opacity/scale/color contrast

**Implementation Notes for Our Stack**
- must include a stacked vertical fallback on tablet/mobile
- keep step count small: ideally 4

**Risks / Caveats**
- high responsive complexity
- overuse creates friction

**Priority Recommendation**
- **Strong candidate** for exactly one section

---

### Pattern 6: Connector / Propagation Sweep

**Visual Purpose**
- Show sync, escalation, routing, validation, or downstream propagation

**Recommended Engine**
- **SVG + CSS/Framer Motion**

**Suggested DOM Architecture**
- relative container
- absolute SVG overlay with named nodes and paths
- base UI shells remain layout-stable underneath

**Motion Logic**
- animate `stroke-dashoffset` or path opacity
- node pulses only at key handoff moments
- duration `0.6s - 1.6s`

**Implementation Notes for Our Stack**
- use simple geometry
- avoid complex organic paths
- use one accent motion, not many competing pulses

**Risks / Caveats**
- brittle if tied to responsive positions without careful layout rules

**Priority Recommendation**
- **Must-have**

---

### Pattern 7: Before / After State Swap

**Visual Purpose**
- Prove a capability clearly
- Best for validation catch, role reprioritization, scope clarity

**Recommended Engine**
- **Framer Motion**

**Suggested DOM Architecture**
- two-state media frame
- state labels
- shared shell and shared copy zone

**Motion Logic**
- crossfade + slight horizontal or scale handoff
- `0.35s - 0.7s` duration
- no exaggerated displacement

**Implementation Notes for Our Stack**
- can be triggered by scroll, click, or timeline
- ideal for both website and promo capture

**Risks / Caveats**
- low, as long as labels are explicit

**Priority Recommendation**
- **Must-have**

---

### Pattern 8: Viewport Stagger System

**Visual Purpose**
- Keep the whole site alive without overproducing it
- Best for capabilities grids, evidence rows, metric cards, and partner logos

**Recommended Engine**
- **IntersectionObserver + Framer Motion variants**

**Suggested DOM Architecture**
- repeatable module list
- local section controller triggers once or with light replay rules

**Motion Logic**
- children enter in `70ms - 140ms` stagger
- `y: 20 -> 0`, `opacity: 0 -> 1`
- optional subtle `scale: 0.98 -> 1`

**Implementation Notes for Our Stack**
- this should be the site-wide default reveal system
- deterministic and easy to disable for reduced motion

**Risks / Caveats**
- overusing stagger on every tiny element gets noisy

**Priority Recommendation**
- **Must-have**

---

## 7. Recommended Motion System for Our Project

### Recommended Motion Stack

#### Core stack
- **React / Vite**
- **Tailwind-style utility CSS**
- **Framer Motion** for component orchestration, stagger systems, local transitions, focus handoff, and proof-state swaps
- **Native IntersectionObserver** for deterministic, cheap reveal triggers
- **GSAP + ScrollTrigger** for exactly **1-2 narrative sections only**
- **Remotion** for promo-video twins of the key narrative scenes

#### Explicitly not recommended as default
- global smooth-scroll hijacking
- Locomotive Scroll
- heavy spring physics everywhere
- decorative particle systems
- browser motion that cannot be translated cleanly into Remotion timelines

### Recommended Motion Vocabulary (5-8 patterns)

1. **Masked chapter reveal**
2. **Section shell expand / settle**
3. **Pinned story chapter**
4. **Multi-card handoff stack**
5. **Connector / propagation sweep**
6. **Before / after evidence swap**
7. **Viewport stagger system**
8. **Single horizontal lifecycle rail**

### Recommended Scene Types

#### Current-state chaos
- fragmented card stack
- noisy portal/document cluster
- slight offset drift, not random animation
- collapse into one centered shell

#### Workspace reveal
- Doss-style shell expand
- Chronicle-style guided focal zoom, simplified

#### Sync propagation
- ReflexAI-style connector/path sweep
- node-to-node confirmation states

#### Validation catch
- before/after comparison panel
- issue detected → highlighted → resolved state

#### Role-switch re-prioritization
- multi-card handoff between worker / employer / attorney / admin views
- use one dominant active card at a time

#### Deadline protection
- pinned mini chapter or short stepper
- timeline/risk panel transforms from red/fragmented to controlled/green

#### Scope clarity
- Parloa-style mini lifecycle or vertical step chapter
- keep step count low and labels explicit

#### Impact close
- measured counters + proof cards + final mask reveal
- avoid explosive celebratory motion

### Recommended Intensity Level Relative to the Benchmarks

- **Below Chronicle** in total motion energy
- **Below Lovart** in reveal frequency
- **Close to Doss** in compositional discipline
- **Close to Parloa** in process legibility
- **Borrow ReflexAI’s emphasis language** for high-trust moments

In plain terms: **cinematic structure, restrained execution**.

---

## 8. Open Questions / Unknowns / Confidence Notes

### What is truly confirmed

- Chronicle is the only benchmark in this set with strong third-party stack signals visible during inspection: **Next.js**, **Apollo GraphQL**, and likely **GSAP**, plus **Lottie**. citeturn31view0turn31view1turn32view0turn32view1
- Parloa has a third-party signal for **Next.js** and presents an explicit lifecycle section that strongly supports the benchmarked horizontal/process reading. citeturn32view3turn33view1
- ReflexAI, Doss, and Lovart all show clear motion-oriented landing-page structures, but the exact runtime engine was **not directly inspectable** from the available tooling in the same way a browser DevTools/network trace would allow. Their engine assignments therefore remain inference-led. citeturn32view4turn32view5turn32view6

### What remains inferred

- exact use of **ScrollTrigger** on any one site except Chronicle
- whether any site uses **Lenis**, **custom rAF smoothing**, or plain native scroll behavior
- exact easing curves and scrub values
- whether SVG/path moments are native SVG, Lottie, CSS mask, canvas, or prerendered media on ReflexAI and others

### Confidence summary by site

- **Chronicle:** high confidence on motion family, medium-high confidence on engine
- **Doss:** high confidence on pattern family, medium confidence on engine
- **Parloa:** high confidence on architecture pattern, medium-high confidence on engine choice for faithful recreation
- **Lovart:** high confidence on modular reveal system, medium confidence on engine
- **ReflexAI:** medium confidence overall, but high confidence that its most useful value for us is in **path/mask emphasis language**, not runtime specifics

### Final recommendation

Build the site around **repeatable motion primitives**, not benchmark-specific tricks. The product story will be stronger if the motion system feels like one coherent operating model rather than a collage of trendy effects.
