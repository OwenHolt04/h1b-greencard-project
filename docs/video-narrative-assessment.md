# Immigration System Assessment: CaseBridge Demo Video Narrative — 2026-03-08

## Mode
Audit

## Scope
- **Question**: Does the current ~105-second Remotion video tell an effective enough story to serve as the "technological solutions" centerpiece of the MGT 120 final presentation?
- **In scope**: Narrative arc, beat structure, caption text, pacing, capability communication, stakeholder framing, scope honesty, MGT 120 framework alignment, presentation integration
- **Out of scope**: Code correctness, rendering pipeline, font loading, animation math (these are implementation concerns, not narrative concerns)
- **Sources reviewed**: `docs/specs/05-demo-narrative-shot-plan.md`, `docs/specs/01-product-vision-demo-goals.md`, `docs/specs/03-data-model-mock-logic-interaction-states.md`, `.claude/CLAUDE.md`, all 8 scene files in `video/src/scenes/`, `video/src/CaseBridgeDemo.jsx`, `video/src/lib/constants.js`

---

## Foundational Analysis

### Problem Statement

The current video is structurally sound but narratively thin. The 8-beat skeleton from the spec is fully implemented, and the underlying scene data is correct. The problem is that the video **shows screens instead of telling a story.** A viewer who has just heard the current-state pain argument needs to feel the problem before they see the solution. Beat 1 delivers statistics ("3 agencies. 4 portals. 0 dashboards.") where the spec calls for emotional tension. From Beat 2 onward, the video presents a product tour — cards appearing, forms populating, scores rising — without an emotional throughline connecting each moment to the pain the audience just heard about. The result is a competent feature demonstration that will not be remembered.

The spec explicitly names the goal: the demo must prove **one central idea** — a shared case record reduces avoidable friction — rather than demonstrate many unrelated features. Currently it demonstrates all features with roughly equal emotional weight, which dilutes the central idea.

**Impact with numbers:**
- Beat 4 (validation) is designated the "most memorable beat" in Spec 05. It currently receives 18 seconds of screen time but spends the first 4.5 of those seconds in a loading state before any issue appears. At 30fps projection, that is 4.5 seconds of an audience waiting.
- Beat 6 (role switcher) runs 22 seconds — the longest beat — but the role transitions are instantaneous cuts within a single scene. There is no visual signal marking the moment the role changes, meaning the 22 seconds blur together rather than creating three distinct "same case, different world" moments.
- Beat 8 (close) runs 8 seconds and attempts to deliver 6 metrics + a product name + a closing statement + three sub-lines. That is too much for 8 seconds on a dark background. The metrics strip alone needs 3 seconds to read at projection distance; nothing else has time to land.

### Root Cause Analysis

**Domain 1 — The Empty Frame Problem (spacing and visual density)**
The user feedback flags "too much empty space throughout." Reading the scene code confirms this: every beat uses standard card padding, comfortable margins, and staggered entrances that look polished on a laptop screen but leave significant dead space at 1920x1080 projection. Beat 2 (Overview) shows a hero section + 4 capability cards occupying roughly the top 60% of the frame with nothing below. Beat 3 (Smart Intake) uses a three-column layout that is structurally correct but leaves generous vertical whitespace below the form cards. At presentation distance, whitespace reads as "not enough content" rather than "clean design."

**Root driver:** The scenes were designed at component scale (fits a laptop viewport nicely) but not audited at composition scale (fills a 1920x1080 presentation frame). The `AppFrame` component wraps content with navigation chrome, then scenes add their own padding, compressing the usable content area further.

**Domain 2 — Emotional Flatness (no tension arc)**
The spec calls for "subtle tension to clarity arc" in the audio and a visual pacing that starts fast and tense before slowing into product proof. Beat 1 achieves a strong opening (dark, serif numbers, staggered reveal, gold accent on "0 dashboards"). But the transition to Beat 2 immediately shifts to a calm, fully-lit product overview. The tension is resolved before the solution is introduced, which inverts the spec's narrative arc. The audience should feel slightly unresolved when the portal appears; instead, the portal appears after a complete tonal reset.

The issue carries through: Beats 3, 4, 5, 6, 7 are all in the same calm "product UI" register. There is no escalation, no moment that emotionally reconnects to the current-state pain before delivering the resolution.

**Root driver:** Beat 1 and Beats 2-7 are narratively disconnected. Beat 1 does not establish a specific character or story — it presents statistics. The spec suggests showing Yuto Sato's case directly in Beat 1 as the human throughline, but the current implementation uses abstract numbers instead. Without a named protagonist, the resolution in Beat 4 (fixing Yuto's case) does not carry emotional payoff.

**Domain 3 — Capability Dilution (too many proof moments, not enough depth)**
The spec lists 7 key visual proof moments that "must read instantly even without audio." The current video attempts all 7, plus it adds a metrics strip in Beat 8 that introduces 6 more numbers. The Kano-ordered demo flow (Basic → Performance → Delighter) is present in the beat structure but not emphasized visually or through captions. A viewer cannot tell that validation is being shown first because it is the highest-leverage capability; it just appears as one of several screens.

**Root driver:** The captions, which are the primary explanatory layer for a video without live voiceover, are used inconsistently. Some beats have captions that add narrative context (Beat 4: "Catch errors before filing / Pre-submission validation flags contradictions..."); others state what is already visually obvious (Beat 5: "Fix once. Update everywhere." — which is literally shown on screen). The captions need to do different work: some should explain WHY the capability matters, not just WHAT it does.

**Key Insight:** The deepest root driver is that the video was built as a product walkthrough and needs to be re-framed as a **case story**. The spec's canonical case — Yuto Sato, 102 days to H-1B expiration, Maya Chen reviewing — is present in the data but absent from the emotional narrative. Every beat should reinforce Yuto's stakes, not demonstrate a feature in the abstract.

### SIPOC (for this audit)

| | |
|---|---|
| **Suppliers** | Scene code (8 beats), constants.js (captions/timing), spec documents |
| **Inputs** | 104.6 seconds of Remotion composition, 8 scene components, caption text, timing configuration |
| **Process** | Video plays during "technological solutions" segment; professor/classmates watch after hearing current-state pain arguments |
| **Outputs** | Audience understanding of: what's broken, what CaseBridge changes, why it's credible |
| **Customers** | Professor, TA, panelists, classmates — evaluating on MGT 120 framework quality, realism, Q&A survivability |

---

## Beat-by-Beat Analysis

### Beat 1 — Current-State Tension (12s currently)

**Spec goal:** Emotionally frame the problem.

**What it does:** Three staggered serif lines — "3 agencies. / 4 portals. / 0 dashboards." — reveal over 7 seconds on a dark background. Subline: "No one sees the full picture." The "0 dashboards" line appears in gold.

**What works:**
- The typographic reveal is strong. Dark frame, serif font, staggered timing, and the gold "0 dashboards" create genuine visual tension.
- The stats are accurate and sourced from team research.
- The subline adds the human consequence without being melodramatic.
- 12 seconds is the right length to let three lines breathe.

**What fails:**
- The stats are abstract. "3 agencies" means nothing to a classmate who has not lived the process. The spec suggested showing "fragmented portal labels," "unclear status snippets," or "multiple handoffs" — the actual visual texture of the problem — not just the count.
- There is no human face. The spec's canonical case starts with Yuto Sato. Beat 1 is the one moment to make this personal before the product appears, and it misses that opportunity.
- The subline "No one sees the full picture" is passive. It describes a state rather than naming a consequence. Something like "One error can reset months of work" or "The attorney, employer, and applicant are each looking at a different version of the same case" would connect the chaos to a cost.
- After 7 seconds of reveals, there are 5 seconds where the screen holds with nothing new. This is the "empty space" problem in action — the hold is too long.

**Recommended revisions:**
- Add 2-3 visual fragments under or beside the stat lines: a placeholder that suggests a portal label (DOL FLAG / USCIS ELIS / CEAC), a handoff count ("10+ handoffs, 0 coordinators"), or a small document stack indicator. These do not need to be interactive — static graphic elements are sufficient.
- Change the subline to make it consequential: "One inconsistency. Months of delay." or "No one owns the case end to end."
- Either cut the 5-second hold or replace it with a brief transition element — a slow fade or a secondary stat — to keep the tension building.
- Optional but high-impact: Add a single line before the transition — "One case. One team. One shared record." — that introduces the solution framing without showing the product yet. This creates a narrative bridge rather than a hard cut from chaos to calm.

---

### Beat 2 — CaseBridge Overview (12s currently)

**Spec goal:** Show the portal as the technology centerpiece. Strong headline, capability cards, zoom to flagship case.

**What it does:** Full `AppFrame` renders with a hero section (headline + subtext + two CTA buttons) and 4 capability cards staggering in. Caption: "One shared case record / Connecting applicant, employer, and attorney around the same information."

**What works:**
- The hero headline is strong: "One shared case record for the H-1B to green card journey."
- The capability cards correctly show the 4 primary demo capabilities (Smart Intake, Validation Engine, Unified Dashboard, Role-Based Views) with metrics attached.
- The AppFrame navigation provides spatial orientation for all subsequent beats.
- Card stagger timing is well-paced for a 12-second beat.

**What fails:**
- The two CTA buttons ("View Demo Case" and "See What Portal Solves") appear as interactive elements but are static in the video. They create an expectation of interaction that is never fulfilled. In a video, buttons that do not do anything are visual noise.
- The 4 capability cards show metrics ("RFE rate: 25% → <5%", "−60% status calls") but these numbers appear for only 3-4 seconds of screen time. At projection distance and in motion, metric badges on cards are not legible. The key metric should appear in the caption, not only in a small badge.
- The "zoom into flagship case" shot that the spec calls for does not happen. The video cuts to Beat 3 (Smart Intake) directly. There is no establishing shot of Yuto's case on the dashboard before the deep dive into intake. The audience does not know whose case this is.
- The capability card for "Role-Based Views" shows no metric that means anything to someone unfamiliar with the research: "3 aligned perspectives" is not a benefit, it is a description.

**Recommended revisions:**
- Remove or visually de-emphasize the CTA buttons. In a video, they are clutter.
- Replace the "Role-Based Views" metric with something meaningful: "−70% applicant status calls" or "Same data, three languages."
- After the 4 cards appear, add a 2-3 second transition moment that shows the case header — "Yuto Sato | Helix Systems | I-485 Package | 102 days remaining" — as a bridge into Beat 3. This establishes the protagonist before diving into his data.
- Consider moving the RFE rate number into the caption for Beat 2 so it has screen space to be read: "Pre-submission validation targets: RFE rate 25% → <5%."

---

### Beat 3 — Smart Intake + Form Sync (12s currently)

**Spec goal:** Embody the single source of truth. Shared fields syncing to multiple forms.

**What it does:** Three-column layout: shared case data (4 sections) on the left, 6 form cards in a 2x3 grid in the center, and a readiness score on the right. A sync pulse dots appear on shared data sections at 2.5s.

**What works:**
- The three-column layout is the most information-dense beat and it reads well structurally.
- The green sync dot with "Synced to 6 forms" is a clear visual signal.
- The form card progress bars (completed forms in green, in-progress in blue) provide instant status comprehension.
- The readiness score (72/100) with "Run Pre-Flight Validation" button correctly sets up Beat 4.
- Having "Certified" / "Approved" on completed forms and "In Progress" on active ones is credible and readable.

**What fails:**
- The sync pulse is the most important visual moment in this beat — it shows that one source of truth propagates to 6 forms — but the implementation uses a small dot per section and a text label. The connection between the left column (source) and the center column (forms) is implied, not shown. The spec calls for "multiple forms syncing from one source" as a key visual proof moment that must "read instantly even without audio." Currently it does not.
- The caption appears at 3.5s delay. By the time it appears in a 12-second beat, the audience has already spent 3.5 seconds looking at the layout without knowing what they are supposed to notice. The caption should appear within 1.5 seconds.
- The right column (readiness panel) contains both the score and a "Run Pre-Flight Validation" button. The button implies an action is about to happen, but this beat's caption is about data entry and sync, not validation. The button creates conceptual noise.
- The 4 shared data sections are visually identical — same card style, same text size, same density. There is no visual hierarchy pointing the viewer to what matters most (the Employer section, which contains the inconsistency that will be flagged in Beat 4).

**Recommended revisions:**
- Add an animated connection line or flow arrow between the "Employer" section on the left and the form cards (ETA-9089, I-140, I-485) on the right to make the sync relationship spatial and obvious.
- Move caption delay to max 1.0 seconds so it frames the layout on arrival.
- Dim the right column (readiness panel) slightly or reduce its visual weight during this beat so the sync story takes center stage. The readiness score can remain but the button should not draw attention until Beat 4.
- Use a subtle amber highlight on the "Employer" shared data row to visually foreshadow the issue that Beat 4 will surface. This creates continuity without spoiling the reveal.

---

### Beat 4 — Validation Catches Issues (18s currently — the hero beat)

**Spec goal:** Demonstrate causality and problem prevention. The most memorable beat.

**What it does:** Three phases: (1) 1.5s button highlight pulse → (2) 2s loading spinner → (3) three issue cards stagger in. SOC/wage mismatch is highlighted first (HIGH), employer name second (MEDIUM), travel history third (LOW). SOC issue gets a pulsing red border.

**What works:**
- The phase structure is exactly right. Button → loading → reveal is a clear causality sequence.
- Three issues with three severity levels (HIGH/MEDIUM/LOW) demonstrates that the system has a real classification system, not just binary pass/fail.
- The affected forms badges ("I-140, ETA-9089") on each issue card connect the validation result back to the filing package — this is the strongest data linkage in the video.
- The SOC pulse and the employer name "Fix: Standardize to..." button correctly set up Beat 5.
- 18 seconds is appropriate for this beat, but the 4.5 seconds of "empty state + loading" before any issue appears is the weakest 4.5 seconds in the video.

**What fails:**
- The loading state (2 seconds of a spinner saying "Analyzing case data...") is dead time in a video. In a live demo, a spinner creates anticipation. In a pre-rendered video with no user interaction, it is just a pause. The spec says "each shot should have one takeaway" — the spinner's takeaway is "wait." Cut it to 0.5 seconds or remove it.
- The readiness score in the top right shows "72" both before and after the loading sequence. It does not change when issues are found. This is a missed moment: showing the score drop from 100 (hypothetical pre-check) to 72 when issues are revealed would be far more impactful than showing a static 72.
- The caption appears at 10.5s delay, which means the audience has watched the entire reveal sequence without caption context. For a video that may play without voiceover (or with minimal verbal context), that is too late. The caption "Catch errors before filing" should appear by 5-6s — right when the first issue card arrives.
- The issue descriptions are long and dense for 18 seconds of screen time. The SOC/wage description reads: "Prevailing wage determination references Q4 2023 survey data, but current SOC code (15-1256.00) maps to Q2 2023 wage level. May trigger RFE." At projection distance and motion speed, this paragraph will not be fully read. The visual punch should come from the badge (HIGH) and the title ("SOC / Wage Data Mismatch"), not the description.
- The employer name issue's fix button is styled in gold (`C.accent`) while the other issues have slate-colored fix buttons. This is correct logic — it signals which fix is being demonstrated next — but the visual contrast is so strong that it makes the employer name issue feel like the primary issue, even though the SOC/wage mismatch is designated HIGH. The severity hierarchy and the visual salience hierarchy are inverted.

**Recommended revisions:**
- Compress loading to 0.3-0.5 seconds (9-15 frames) or replace with a brief progress bar fill animation.
- Show readiness score dropping from a "pre-check" state (100) to 72 as issues are revealed. This makes the validation feel like it found something rather than confirming something already known.
- Move caption to appear at 5.0s (when first issue card arrives), not 10.5s.
- Reduce issue description text by 40%. The description should be one short sentence. Move the technical detail into a "learn more" visual treatment (dimmer, smaller) that reads as optional context rather than primary content.
- Make the SOC issue's visual treatment unambiguously primary: larger title, stronger red border, or an animated "priority flag" marker. The employer name fix button can remain gold but should appear only after SOC is established as the more serious issue.

---

### Beat 5 — Fix + Score Improvement (12s currently)

**Spec goal:** Payoff of the validation beat. One correction updates the shared record and every downstream form.

**What it does:** Field highlight → field value changes from "Helix Systems Inc." to "Helix Systems, Inc." → form cards glow gold → score rises from 72 to 80 with animated counter → issue resolved indicator appears.

**What works:**
- The 72 → 80 score animation is the strongest payoff moment in the entire video. The number climbing is immediately legible and emotionally satisfying.
- The form card sync glow (amber border + "✓ Updated" badge) clearly shows that one fix propagated to multiple forms.
- The resolved issue checklist at the bottom of the readiness panel (strikethrough on "Employer Name") creates a satisfying before/after state.
- The field highlighting (amber → green) with the comma-period correction is readable and concrete — a real-world example of a real filing problem.

**What fails:**
- The fix is shown only for the employer name (MEDIUM issue), not for the SOC/wage (HIGH issue). This is architecturally correct for the demo (the SOC fix requires attorney review), but the video provides no visual acknowledgment that the HIGH issue remains open. After the satisfying score rise, a viewer might incorrectly conclude the case is ready to file.
- The caption ("Fix once. Update everywhere.") appears at 6.0 seconds — the midpoint of the beat. By that point the fix has already happened. The caption is describing something the audience has already watched rather than framing what they are about to see.
- "Filing Package — Syncing Updates" in the center column header is accurate but flat. The moment the forms sync should feel like a small victory. The header could be "3 forms updated automatically" to make the propagation count explicit.
- The beat ends at 12 seconds but the most interesting visual event (score rising) happens around seconds 4-6. The remaining 6 seconds hold on the resolved state. This is the empty space problem again.

**Recommended revisions:**
- Add a persistent visual indicator for the remaining HIGH issue. After the employer name resolves, show a small callout — "SOC/wage review still required — 2 issues remain" — so the audience knows this is partial progress, not completion. This also previews Beat 6 (where the attorney handles that issue).
- Move caption to appear at 1.5 seconds, before the fix happens, so it frames the action.
- Change the center column header to "3 forms synced automatically" and add a brief glow animation on the header to celebrate the propagation.
- If 6 seconds of held state feels long, use that time to briefly transition the right panel to show the attorney alert state ("Attorney review pending for SOC/wage issue") — connecting Beat 5 to Beat 6.

---

### Beat 6 — Role Switcher (22s currently)

**Spec goal:** Show stakeholder alignment without duplication. Same case, different priorities.

**What it does:** 22 seconds split across three role views (7s / 7.5s / 7.5s). Each role has a greeting, summary paragraph, next step, priority alerts sidebar, action buttons, and compact timeline. The active tab in the role switcher control updates between roles.

**What works:**
- The role-specific data is genuinely differentiated. Applicant sees "Your case is on track. No action needed today." Employer sees the 102-day deadline and dollar cost. Attorney sees the unresolved SOC issue with legal language.
- The "Priority Alerts" sidebar correctly changes content per role — this is the key visual proof that the same case produces different priorities.
- The compact timeline at the bottom provides spatial continuity across all three role views.
- 7-7.5 seconds per role is sufficient if the visual changes are immediately obvious on role switch.

**What fails severely — the biggest structural problem in the video:**
- The role transition is a hard cut with a 0.2-0.6s fade (the quick transition between related scenes applies between Beats 4→5, not within Beat 6). Inside Beat 6 itself, the transition between roles relies on React state change (activeRoleIdx changes) which produces an instant content swap. The content fades in (`contentEnter` spring re-runs from 0) but the layout does not change. If the audience blinks during a role switch, they will not notice the switch happened.
- The role switcher control (the pill tabs) is small and positioned at the top of the content area. At 1920x1080 projection distance, a 13px pill tab is not legible. The visual signal that "we are now in Employer view" must be much larger and more obvious.
- The spec says "same case, different priorities" — but the layout structure is identical for all three roles. The greeting changes, the alerts change, the actions change, but the spatial arrangement is the same. The spec explicitly calls for role-based views that feel like "different languages" — applicant's plain-language guidance, HR's deadline/cost/risk format, attorney's legal severity. The current implementation feels like the same UI with different text.
- The caption reuses the same structure for all three roles ("Same case. Different roles." as main + the role description as sub). The main caption ("Same case. Different roles.") never changes, which means 15 of the 22 seconds show the same caption text. This is a missed storytelling opportunity.

**Recommended revisions — this beat needs the most work:**
- Make role transitions visually unmistakable. Options: (a) Use a full-color accent band at the top of the frame that changes per role (blue for applicant, amber for employer, green for attorney); (b) flash the role name at large size (48px+) as a transition between roles; (c) briefly dim the content area and show just the role label before the new content fades in.
- The role label in the pill control should be much larger — at minimum 16px with a selected state that is visually dramatic (filled background in role accent color, white text).
- Design three meaningfully different layouts:
  - Applicant: large, plain-language headline, minimal technical detail, a single clear "next step" call-to-action at comfortable reading size
  - Employer: lead with the 102-day deadline prominently (large number, countdown feel), cost, risk badge
  - Attorney: lead with issue severity list, no softening language, submission readiness score
- Change captions to be role-specific rather than static. Example: Beat 6 applicant caption: "Plain-language guidance, no legal jargon." Employer: "Deadline and cost visibility." Attorney: "Filing blockers and legal review." These should replace the static "Same case. Different roles." main line.

---

### Beat 7 — Scope Clarity (12s currently)

**Spec goal:** Keep the argument honest and strong. Credibility through acknowledged limits.

**What it does:** Two-column comparison inside AppFrame. Left: "What CaseBridge Solves Directly" (6 items, green checkmarks). Right: "Requires Broader Reform" (5 items, grey X marks). A dark navy quote box at the bottom: "This platform reduces avoidable process friction, rework, and uncertainty. It does not eliminate statutory caps, retrogression, or all legal complexity."

**What works:**
- This beat is structurally very strong. The two-column design does exactly what the spec requires: names limits explicitly, uses visual hierarchy to distinguish categories, and closes with an authoritative quote.
- The items in both columns are correctly classified. Cross-form inconsistency and fragmented status belong on the left; visa caps and retrogression belong on the right. This classification would survive Q&A.
- The dark quote box at the bottom is the right design choice — it signals "this is the official position of this product" and gives the professor something to quote back in Q&A.
- The staggered item reveals work well — each item reading in sequence creates a rhythm.

**What fails:**
- It is placed inside the AppFrame ("Impact" screen), making it feel like a product screen rather than a presentation argument. The spec suggested this beat could show "the portal nested inside a broader future-state ecosystem" — a step back from the UI, not another UI screen. Putting the scope argument inside the product interface slightly undermines the authority of the argument; it looks like the product is making claims about itself.
- The caption ("Process improvement. Not magic. / Clarify status. Align stakeholders.") is fine but arrives at 3.0 seconds into a 12-second beat. There is dead time while the header and columns load before the caption contextualizes the screen. The caption should appear at 0.5 seconds to anchor the viewer's interpretation from the start.
- "Requires Broader Reform" with grey X marks reads as slightly apologetic. The spec's goal is for this beat to "increase credibility rather than weaken the pitch." The visual treatment of the reform column should feel more like "acknowledged system constraints" and less like "things we failed to solve." Consider changing from X marks to circle-with-dash (neutral notation) and changing "Requires Broader Reform" to "Structural Constraints — Require Legislative Action." This reframes the column as systemic acknowledgment rather than product shortcoming.

**Recommended revisions:**
- Option A: Pull this beat out of the AppFrame entirely. Render it as a clean dark-background slide (matching Beat 1 and Beat 8's dark aesthetic) so it visually signals "stepping back from the product." This makes the scope argument feel like a presentation claim, not a product feature.
- Option B: If keeping the AppFrame, remove the left nav sidebar and expand the content area so the two columns fill the frame without the product chrome framing them.
- Change "Requires Broader Reform" column header + X marks to "Structural Constraints" + dash/circle marks.
- Move caption delay to 0.5 seconds.
- Extend beat to 14 seconds to give the quote box more hold time. The 12-second version has the quote appearing around second 8, leaving only 4 seconds for it to be read.

---

### Beat 8 — Close (8s currently)

**Spec goal:** End with confidence and memorability. Final metrics + clean statement + product name.

**What it does:** Dark background. 6 metrics in a horizontal strip (RFE Rate, Status Portals, Attorney Hours, Extension Cost, Handoff Idle, PWD Revisions). Product name "CaseBridge" in gold. Closing statement: "A better process starts with better coordination." Three-line subtext: "Reduce rework. / Clarify status. / Align stakeholders."

**What works:**
- The dark background bookends the video correctly — matching the opening tone.
- The metrics are accurate (traceable to team research) and all show meaningful improvement.
- The gold "CaseBridge" wordmark is clean and appropriately restrained.
- The closing statement is good. "A better process starts with better coordination" is memorable without overclaiming.

**What fails severely:**
- 8 seconds is not enough time for 6 metrics + logo + closing statement + 3 sub-lines. Reading the metrics alone requires 3-4 seconds at projection distance. By the time the logo and closing statement arrive, the audience has just finished reading the metrics and cannot register both simultaneously.
- The metrics strip has too much visual complexity per metric card: label (uppercase tiny) + before value (strikethrough) + after value (gold) + percentage change (green). Four data points per metric across 6 metrics = 24 data points in one strip. A viewer can register 3-4 key numbers in 8 seconds, not 24.
- The before values ("~25%", "4", "~8", "$5K+", "Weeks", "~15%") are in strikethrough at 14px with 35% opacity against a dark background. They are nearly invisible. If they are not readable, they carry no "before/after" meaning; they are just visual noise around the gold "after" numbers.
- The 3-line subtext at the bottom ("Reduce rework. / Clarify status. / Align stakeholders.") repeats content from earlier captions. It adds text without adding meaning. Cut it.

**Recommended revisions:**
- Reduce the metrics strip to 3-4 key metrics maximum. Choose the most legible and impactful:
  - RFE Rate: 25% → <5% (-80%)
  - Status Portals: 4 → 1 (-75%)
  - Attorney Hours: ~8 → ~3 (-62%)
  - Extension Cost: $5K+ → ~$2.5K (-50%)
  Drop PWD Revisions and Handoff Idle — they require more context than 8 seconds allows.
- Make the before/after design more readable: larger font, stronger contrast for the "after" value, remove the before value entirely or make it implicit ("Previously: 25%  →  <5% target").
- Extend Beat 8 to 12 seconds. The spec says 75-120 seconds total; this adjustment still lands within spec.
- Consider leading with the closing statement BEFORE the metrics: audience reads the statement, then sees the numbers as evidence for it. This is more memorable than numbers-first.
- The three-line subtext should be replaced with one line: "This is the process we can build now." or "Better coordination. Not magic."

---

## Structural Recommendations

### Timing Rebalance (priority changes)

| Beat | Current | Recommended | Rationale |
|------|---------|-------------|-----------|
| Beat 1 — Current state | 12s | 10s | Tighten the 5-second hold; add visual fragments instead |
| Beat 2 — Overview | 12s | 10s | Remove button noise; add case header bridge (2s saved, 2s added elsewhere) |
| Beat 3 — Smart intake | 12s | 12s | No change; fix visual hierarchy and caption timing |
| Beat 4 — Validation | 18s | 16s | Compress loading to 0.5s; reclaim 2s for richer issue reveals |
| Beat 5 — Fix | 12s | 10s | Use saved time for attorney-alert bridge to Beat 6 |
| Beat 6 — Role switcher | 22s | 24s | Add 1s per role for visual transition marker (6 + 8 + 10 = 24) |
| Beat 7 — Scope clarity | 12s | 14s | Give quote box more hold time |
| Beat 8 — Close | 8s | 12s | Fix the metrics overload problem |
| **Total** | **~105s** | **~108s** | Within the spec's 75-120s target |

### Beat Order Assessment

The current 8-beat order is correct and should not change. The spec's narrative arc (tension → introduce → proof → role shift → protect → scope → close) is well-designed. The fixes needed are within beats, not between them.

One structural addition to consider: a brief "meet the case" moment at the end of Beat 2 (2-3 seconds showing Yuto's name, employer, stage, and 102-day countdown) would dramatically improve the emotional coherence of Beats 3-6. Currently the case data exists in the scenes but the human protagonist is never introduced as a character.

### Transition Strategy Assessment

The current transition approach (standard fade 0.6s between unrelated scenes, quick crossfade 0.2s between intake-validation-fix) is correct. The one gap is within Beat 6 (role switching) — the internal role transitions need a more dramatic visual signal than the current content-swap approach.

---

## Content Gap Analysis

### Missing from the narrative that specs require:

**1. Named protagonist framing.** The spec's flagship case (Yuto Sato, Helix Systems, 102-day countdown) appears in the scene data but is never introduced as a human narrative. The video treats this as a data demonstration, not a case story. The spec's voiceover skeleton says "Here, shared intake data syncs across the filing package" — "here" implies the audience knows whose case they are watching. They do not, because no beat introduces Yuto by name.

**2. The dashboard / unified case workspace beat.** Spec Beat 3 calls for "case header, milestone timeline, DOL / USCIS / DOS status view, next-step card, alerts panel." The current Beat 3 skips directly to Smart Intake. The unified timeline view — one of the core capabilities ("Unified Dashboard, −60% status calls") — is only visible in a truncated form during Beat 6. The spec explicitly listed a "timeline focus" shot in the recommended shot order (shot 4) before the intake sync (shot 5). This shot is missing.

**3. Deadline protection / extension warning as a standalone proof moment.** The spec's Beat 6 (deadline protection) shows "extension warning, auto-trigger or reminder state, task created, risk lowered." The current video handles deadline protection via the employer view in Beat 6 (role switcher) — specifically the alert "H-1B extension due in 102 days — auto-trigger at 90." This is present but buried inside a 7-second role view that contains many other elements. The 102-day deadline is one of the most concrete, numbers-based arguments for why the portal has immediate operational value. It deserves its own visual emphasis, even 3-5 seconds of close focus, rather than being one line in an alert sidebar.

**4. Voiceover/caption strategy inconsistency.** The spec recommends using captions sparingly with short phrases: "Fragmented today," "One shared record," "Catch issues earlier." The current captions are longer and more explanatory — some beats have 2-line captions with 25-30 word subtexts. This is not wrong, but it is inconsistent. Some beats (Beat 4, Beat 7) have informative captions; others (Beat 5, Beat 6) have captions that are redundant with the visual. The team should decide: are captions explanatory (for silent viewing) or atmospheric (for context setting during live presentation)? The answer should be consistent across all 8 beats.

---

## Caption/Text Revisions

### Beat 1 — Current State

| Current | Recommended | Why |
|---------|-------------|-----|
| Line 1: "3 agencies." | "3 agencies. 0 coordination." | Adds consequence, not just count |
| Line 2: "4 portals." | "4 portals. None connected." | Same pattern, stronger claim |
| Line 3: "0 dashboards." | "0 dashboards." | Keep — the gold treatment makes this land |
| Sub: "No one sees the full picture." | "One error can reset months of work." | Consequence, not just state |

### Beat 2 — Overview

| Current | Recommended | Why |
|---------|-------------|-----|
| Main: "One shared case record" | "One shared case record" | Strong — keep |
| Sub: "Connecting applicant, employer, and attorney around the same information." | "Yuto Sato's case — one record, three stakeholders, all aligned." | Makes it personal, introduces protagonist |

### Beat 3 — Smart Intake

| Current | Recommended | Why |
|---------|-------------|-----|
| Main: "Enter once. Sync across 6 forms." | "Enter once. Sync across 6 forms." | Keep — clear and specific |
| Sub: "Shared intake data populates the entire filing package." | "One source of truth — no re-keying, no contradictions." | More benefit-focused |

### Beat 4 — Validation

| Current | Recommended | Why |
|---------|-------------|-----|
| Main: "Catch errors before filing" | "Catch errors before filing" | Keep |
| Sub: "Pre-submission validation flags contradictions that would otherwise surface months later." | "Today: ~25% of filings trigger RFEs. Target: <5%." | Quantifies the capability with research numbers |

### Beat 5 — Fix

| Current | Recommended | Why |
|---------|-------------|-----|
| Main: "Fix once. Update everywhere." | "Fix once. Three forms update automatically." | Specific count makes propagation tangible |
| Sub: "One correction updates the shared record and every downstream form." | "Score 72 → 80. One issue resolved. Two remaining for attorney review." | Shows progress and honest state of remaining work |

### Beat 6 — Role Switcher

Recommend three different captions, one per role, rather than holding "Same case. Different roles." for the full 22 seconds:

- **Applicant:** Main: "Plain-language guidance." Sub: "No legal jargon — just what to do next."
- **Employer:** Main: "Deadline visibility, not surprises." Sub: "102 days. Auto-trigger at 90. Cost: ~$2,500."
- **Attorney:** Main: "Filing blockers, not noise." Sub: "Severity-ranked issues. No manual reconciliation."

### Beat 7 — Scope Clarity

| Current | Recommended | Why |
|---------|-------------|-----|
| Main: "Process improvement. Not magic." | "What the portal changes. What still requires legislation." | More precise framing |
| Sub: "Clarify status. Align stakeholders." | Remove sub | Let the two-column visual speak |

### Beat 8 — Close

| Current | Recommended | Why |
|---------|-------------|-----|
| Closing: "A better process starts with better coordination." | "A better process starts with better coordination." | Keep — strong |
| 3 sub-lines | Remove | Redundant; closing statement is sufficient |

---

## Emotional Arc Recommendations

### Current arc:
Beat 1 (dark/tense) → immediate tonal reset → Beats 2-7 (uniform calm) → Beat 8 (dark/resolved)

### Target arc (spec-directed):
Beat 1 (dark/tense) → tension holds slightly → Beat 2 (hopeful introduction) → Beats 3-5 (building evidence, increasing confidence) → Beat 6 (human impact — emotional peak) → Beat 7 (credibility through honesty) → Beat 8 (resolved confidence)

### Four concrete changes to create the target arc:

**1. Preserve tension through the Beat 1 → Beat 2 transition.**
The current standard fade immediately clears the dark mood. Instead, let Beat 2 open with a brief half-second of the same dark background before the AppFrame fades in. This signals continuity — "we are answering the problem you just saw" — rather than a clean break.

**2. Make Beat 4 feel like a discovery, not a demonstration.**
The loading animation and sequential issue reveal already have the right structure. The problem is the flat visual tone. When the first issue appears, it should feel alarming — a brief color pulse, a score drop, something that signals "the system found something real." The current issue cards appear with a smooth fade-in, which feels expected rather than revelatory. A sharper entrance (translate-in from the right with a subtle red flash on the HIGH badge) would create the "uh-oh" moment the beat needs.

**3. Make Beat 5 feel like relief.**
The score rising from 72 to 80 is the closest the video comes to emotional payoff. Amplify it: animate the score color (slate → green as it crosses 75), briefly expand the score ring, or add a "✓ Issue resolved" green flash that fills the readiness panel for one frame before settling. The current implementation is visually correct but emotionally muted.

**4. Make the role switcher beat feel like empathy, not demonstration.**
The spec says "applicants get plain-language guidance." The applicant role view currently shows "Your case is on track. No action needed today — your attorney is reviewing final documentation." This is accurate but not empathetic. Yuto has 102 days until his H-1B expires and is waiting on a green card. His actual emotional state is anxious, not neutral. The applicant view should acknowledge that — something like "Your I-485 is being prepared. You are at the final stage. Your status is protected while this is pending." This makes the role-switch beat emotionally resonant rather than just architecturally interesting.

---

## Presentation Integration Notes

### How to introduce the video in the live presentation:

The presenter should say approximately: "Let me show you what this looks like in practice. One case — Yuto Sato, a software engineer at Helix Systems, 102 days from his H-1B expiration. Right now, his attorney, his HR team, and Yuto himself are all looking at different pieces of the same picture." Then play the video. This setup does two things the video currently cannot do for itself: names the protagonist and states the stakes.

### What to say immediately after the video:

After Beat 8, the presenter should have a single slide ready showing only the scope quote: "This platform reduces avoidable process friction, rework, and uncertainty. It does not eliminate statutory caps, retrogression, or all legal complexity." Say: "That last screen is our honest position. The portal does not solve retrogression or visa caps. Those require legislation, which we discuss separately. What the portal solves is the coordination failure inside the process we have today." This prevents Q&A from coming at the scope question before the team has framed it.

### Q&A defense notes tied to specific video moments:

| Q&A Question | Video Beat to Reference | Verbal Bridge |
|---|---|---|
| "Who would build this? What does adoption look like?" | Beat 6 (role switcher) | "The same case data serves three stakeholder groups. Each adopts the system for their own reason — the attorney for validation, HR for deadline management, the applicant for clarity." |
| "This doesn't fix the backlog." | Beat 7 (scope clarity) | "That is exactly what Beat 7 says. Backlogs require USCIS capacity and appropriations. We are not claiming otherwise." |
| "How do you know these metrics?" | Beat 4 (validation) + Beat 8 (metrics) | "The RFE rate of ~25% is from published USCIS data. The target of <5% is based on what pre-submission validation achieves in analogous legal-tech contexts. The research is in the appendix." |
| "What does it cost to build?" | Not addressed in video | "The video focuses on capability, not build cost. Our execution section addresses implementation phasing and stakeholder alignment." |

### Ideal video placement in presentation flow:

Do not play the video cold. The 2-3 sentence verbal setup described above is essential. The video works best after the team has explicitly named at least two current-state pain points (fragmented status, RFE rate). When the audience has just heard "~25% of PERM filings trigger an RFE or audit," seeing Beat 4 (validation catching a SOC/wage mismatch) creates an immediate "this solves that" connection. Without that verbal setup, Beat 4 is just a UI demonstration.

---

## Findings

### Critical

- **[MC1] Emotional disconnect between Beat 1 and the product** — Beat 1 establishes tension through abstract statistics; Beat 2 immediately resolves that tension with a calm product overview before the solution is introduced. The narrative arc requires tension to carry into the product reveal, not before it. The current transition pattern inverts the intended arc: tension-then-resolution becomes tension-then-reset-then-resolution, which weakens both beats. Fix: preserve visual tension through the Beat 1 → Beat 2 cut and introduce Yuto's case by name in Beat 2 to provide a human throughline for the remaining 75 seconds.

- **[MC2] Beat 6 role transitions are not visually distinguishable at projection scale** — The 22-second role switcher beat fails its core test: a viewer at classroom distance cannot reliably detect when the role switches. The pill control is 13px text; the content layout does not change shape between roles; the transition is a smooth React state update with no distinct visual marker. The spec requires "same case, different priorities" to be immediately obvious. Currently it is "same layout, different text." Fix: Add full-width accent band per role, larger role label (48px+), and meaningfully different layout structures for each stakeholder.

- **[MC3] Beat 8 is overloaded for its 8-second duration** — 6 metrics + product name + closing statement + 3 sub-lines cannot be processed at projection distance in 8 seconds. The metrics require 3-4 seconds to read, leaving insufficient time for the closing statement to land as a memorable ending. Fix: reduce to 3-4 metrics, extend to 12 seconds, lead with the closing statement, cut the 3-line sub-text.

### Important

- **[MI1] The unified case dashboard is absent as a standalone beat** — The spec's recommended shot order includes a "Case workspace" and "Timeline focus" shot before intake. The current video jumps from Overview (Beat 2) directly to Smart Intake (Beat 3), skipping the unified dashboard — one of the five highest-value capabilities. The timeline appears in truncated form during Beat 6 but never gets its own visual moment. Status inquiry calls −60% is a key metric that is never visually argued.

- **[MI2] Caption timing is misaligned across multiple beats** — Beats 3, 4, and 5 all delay captions past the halfway point of the beat (3.5s, 10.5s, 6.0s respectively). For a video that may play without voiceover in a classroom setting, late captions mean the audience has already formed their interpretation before the explanatory text appears. All captions should appear within 1.5 seconds of beat start to frame the audience's interpretation of what they are seeing.

- **[MI3] Loading animation in Beat 4 is dead time in a pre-rendered video** — The 2-second spinner saying "Analyzing case data..." creates anticipation in a live interactive demo but is passive waiting in a video. 4.5 seconds pass before the first issue card appears. Compress to 0.5 seconds.

- **[MI4] Beat 5 does not acknowledge the remaining HIGH issue after fixing the MEDIUM issue** — After the employer name fix and score rise from 72 to 80, the video implies completion. The SOC/wage mismatch (HIGH severity) remains unresolved but receives no visual acknowledgment. This is both a narrative gap (the attorney's role in Beat 6 is unexplained) and a credibility risk (the presentation could appear to claim the case is ready when it is not).

### Background

- **[MB1] Emoji usage in Beat 2 capability cards and Beat 6 role alerts** — Emoji icons (📋, 🛡, 📊, 👥 in Beat 2; ⏰, 💰, 📝 in Beat 6) are functional but inconsistent with the "clean and institutional, not startup-flashy" design principle in Spec 01. At projection scale they can pixelate. Consider replacing with simple SVG icon-like symbols or colored geometric indicators.

- **[MB2] Before values in Beat 8 metrics strip are effectively unreadable** — Strikethrough text at 35% opacity against a dark background is below legible contrast at projection distance. Either remove before values entirely ("→ <5%" rather than "~25% → <5%") or increase opacity to 70%.

- **[MB3] Beat 7 scope argument would be stronger outside the AppFrame chrome** — Placing the scope argument inside the product interface (as an "Impact" screen) frames it as a product claim rather than a presentation argument. A dark-background standalone treatment (matching Beat 1 and Beat 8) would signal that the team is stepping back to make an analytical claim, not continuing the product tour. This is a design decision with narrative implications.

---

## Recommendations

1. **Prioritize Beat 6 (role switcher) redesign first.** It is the longest beat, the most architecturally complex, and the most visually broken. Adding per-role accent bands, larger role labels, and distinct layout structures would require the most scene-level code changes but would produce the largest narrative improvement. Target: viewer can name the active role within 1 second of each transition.

2. **Extend Beat 8 from 8s to 12s and reduce its content by 40%.** This is the lowest-effort/highest-impact fix. Change BEAT_SECONDS.close from 8 to 12 in constants.js and remove the 3-line sub-text from the closing slide. Reduce metrics to 4. The closing statement — "A better process starts with better coordination" — deserves to be the last thing the audience reads, not a line buried under a metrics strip and three sub-lines.

3. **Add Yuto's case header as a 2-3 second bridge moment at the end of Beat 2.** Before the transition to Beat 3, briefly show: "Yuto Sato | Helix Systems | I-485 Preparation | H-1B expires in 102 days." This costs nothing in scene complexity (it is one div appended to Beat2_Overview with a delayed entrance animation) and dramatically improves the human coherence of Beats 3-6.

4. **Compress Beat 4's loading animation to 0.5 seconds (15 frames) and move the caption to appear at 5.0 seconds.** These are one-line constant changes. The issue reveal is the strongest visual sequence in the video; do not delay it behind a 2-second spinner.

5. **Redesign Beat 1's subline for consequence, not description.** Change "No one sees the full picture." to "One inconsistency can reset months of work." This costs one caption string edit and meaningfully improves the emotional setup for the solution.

6. **Add a remaining-issues callout to Beat 5.** After the score rises to 80, show a small note: "SOC/wage review still required — attorney flagged." This preserves credibility and explains why Maya Chen's role in Beat 6 matters.

---

## Decision Log

| Decision | Why (framework) | Expected Benefit | Risk | Confidence |
|----------|----------------|-----------------|------|------------|
| Do not reorder the 8 beats | Spec Beat order matches Kano sequence (Basic → Performance → Delighter) and the spec's narrative arc. The structure is sound. | Maintains pedagogical coherence that professor will evaluate. | Reordering would create new continuity problems. | High |
| Prioritize Beat 6 over Beat 1 for revision effort | Beat 6 has the largest structural gap from spec intent. Beat 1 is mostly working; it needs tuning, not redesign. | Most impactful per-beat improvement per revision effort. | Beat 6 redesign requires layout changes; Beat 1 fixes are caption/timing only. | High |
| Keep total duration within 75-120s spec range | Spec 05 is explicit: 120s maximum. Proposed rebalancing lands at ~108s. | Stays within presentation time budget. | Extending Beat 6 from 22s to 24s and Beat 8 from 8s to 12s adds 6s; savings from Beats 1, 2, 4, 5 reclaim 6s. Net zero. | High |
| Recommend dark-background treatment for Beat 7 as optional | Beat 7 inside AppFrame is functional but sub-optimal for analytical authority. However, it works as-is. | Would increase the persuasiveness of the scope argument. | Requires additional scene variant if AppFrame is removed; lower urgency than other fixes. | Medium |
| Do not add a dedicated dashboard beat | Adding a new Beat 3.5 for the unified timeline would exceed 120s. The timeline is visible in Beat 6's compact format. | Preserves timing constraint compliance. | The unified dashboard capability is underrepresented; this is a real content gap. | Medium |
