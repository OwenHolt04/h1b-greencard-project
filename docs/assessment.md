# CaseBridge Prototype Assessment
**Date:** March 8, 2026
**Mode:** Audit
**Assessor:** Immigration Systems Expert Agent

---

## Scope

- **Question:** How faithfully does the built CaseBridge prototype implement the five specification documents, cover the required capabilities from the team's research, and serve as an effective MGT 120 presentation tool?
- **In scope:** All five spec documents, all source files in `app/src/`, the Pain Points & Capabilities inventory (metrics layer), the demo narrative requirements from Spec 05.
- **Out of scope:** Remotion video build (not yet executed), backend infrastructure (intentionally excluded by design).
- **Sources reviewed:** Specs 01–05, `mockData.js`, `DemoContext.jsx`, `App.jsx`, all five screen components (`Overview`, `Dashboard`, `Intake`, `Roles`, `Impact`), shared components (`Navigation`, `Layout`, `StageTimeline`, `ReadinessScore`), `index.css`, build prompt `06-claude-code-app-build-prompt.md`, CLAUDE.md.

---

## A. Spec Fidelity Assessment

### Spec 01: Product Vision + Demo Goals

**Overall fidelity: HIGH**

| Requirement | Status | Notes |
|------------|--------|-------|
| Presentation-first, scenario-driven prototype | Met | App is entirely seeded-data, no backend, no auth |
| One flagship fictional case (Yuto Sato → Helix → Chen & Patel) | Met | Implemented exactly in `mockData.js` with all required fields |
| Role-based views: applicant, employer/HR, attorney | Met | Three-tab switcher in Roles screen with distinct tone per role |
| Smart intake / one source of truth | Met | Left panel of Intake screen labeled "Shared Case Data — Source of Truth" |
| Cross-form validation | Met | Pre-flight validation button, 3 issues, animated reveal |
| Unified dashboard (DOL/USCIS/DOS) | Met | Cross-agency status panel with all three agencies |
| Plain-language guidance | Met | Applicant view uses reassuring plain language; "What's Happening Now" card |
| Deadline/extension protection | Met | 102-day countdown card with auto-trigger note and progress bar |
| Honest scope note ("does not eliminate statutory caps") | Met | Present on Overview and Impact screens; Impact has full structural reform column |
| Required product statement | Met | Exact text from spec appears in `scopeNote` export and is rendered on Overview and Impact |
| 4 capability cards on Overview | Met | Smart Intake, Validation Engine, Unified Dashboard, Role-Based Views |
| Secondary capabilities (sponsorship cost, backlog visibility) | Partially met | Employer view shows sponsorship cost ("$12,000–$18,000") but no standalone cost calculator screen; backlog visibility implicit in Visa Bulletin status card |
| Success criteria (viewer understands in 60–150 seconds) | Likely met | Clean 5-screen flow with one dominant message per screen; depends on presenter pace |

**Gap:** Spec 01 lists "case coordinator handoff tracker" and "visa bulletin movement alerting" as secondary capabilities worth including if lightweight. Neither appears in the prototype. These are appropriately deprioritized given the "lightweight only" caveat, but the Priority Date Current alert in the Alerts panel on Dashboard is close to visa bulletin alerting.

---

### Spec 02: UX / Information Architecture + Screen Specs

**Overall fidelity: HIGH with minor structural deviations**

#### Navigation Model
Spec requires "Overview / Case / Intake / Roles / Impact" as preferred labels. Implemented exactly: `overview`, `dashboard` (labeled "Case"), `intake`, `roles`, `impact`. Navigation is a fixed top bar matching the "restrained top nav" requirement.

#### Screen-by-screen review:

**Screen 1 (Overview):**
- Hero headline: Met — "One shared case record for the H-1B to green card journey."
- 4 capability cards: Met — Smart Intake, Validation Engine, Unified Dashboard, Role-Based Views
- Case preview card: Met — shows Yuto Sato / Helix / Maya Chen / I-485 stage
- Scope note: Met — rendered from `scopeNote` export
- Primary CTA "View Demo Case" + secondary "See What the Portal Solves": Met exactly
- **Gap:** Spec calls for "one visual summary of the case journey" at the Overview level. The case preview card shows metadata but not a mini-journey bar. A compact timeline or stage indicator on the Overview would strengthen the first impression.

**Screen 2 (Case / Dashboard):**
- Case header with applicant/employer/attorney: Met
- Journey milestone bar (8 stages): Met via `StageTimeline` component with complete/active/upcoming states
- Alert panel: Met — 4 alerts covering H-1B deadline, attorney review, SOC risk, priority date
- Plain-language next step card: Met — "What's Happening Now" with readable prose
- Cross-agency status module (DOL/USCIS/DOS): Met — each row shows status, update date, plain-language explanation
- Filing readiness score in header: Met — `ReadinessScore` SVG ring component shown in header
- **Gap:** Spec requires "case health score OR filing readiness score" in the header. Both are present (readiness ring + "Needs Review" badge on the timeline section). This is actually stronger than the spec minimum.
- **Gap:** Spec asks for "next filing" in the case header. The header shows Stage "I-485 Preparation" but not an explicit "Next Filing: I-485 Package" field matching the `caseRecord.nextFiling` value in mockData. Minor omission.

**Screen 3 (Intake + Validation):**
- Three-panel layout (intake left, forms center, validation right): Met — 12-column grid: 4/4/4 split
- Shared intake sections (identity, employer, role, immigration, address/travel): Met — all 5 sections present
- Form package visualization (no literal PDFs, stylized cards): Met — 6 form cards with completion bars and synced field counts
- Validation issues (employer name mismatch, SOC/wage mismatch, travel history gap): Met exactly
- Readiness score visible: Met — shown both in header and prominently in the validation panel
- "Run Pre-Flight Validation" button → loading state → issues reveal: Met
- Fix employer name → field updates, form cards pulse, readiness improves: Met — `animate-form-sync` CSS animation on affected form cards
- **Gap:** Spec says "readiness score improves from 72 to 80 after employer name fix, then to 95 after all fixes." The code starts at `score = 95` minus penalties, which means the baseline is 72 (95 - 10 - 8 - 5 = 72). After fixing employer name: 72 + 8 = 80. After all: 95. This matches the build prompt exactly. However, the score starts visually at 72 only after validation is run. Before running validation, the score renders as 72 (all unresolved) even though issues haven't been "discovered" yet. This is a minor presentational inconsistency — the score should arguably display as a neutral or pre-validation state before the check is run.

**Screen 4 (Roles):**
- Segmented role switcher (Applicant / Employer HR / Attorney): Met — prominent pill switcher
- Applicant view (plain language, reassurance, self-service actions): Met — "Your case is on track" greeting, plain-language status, upload/confirm actions
- Employer view (deadlines, costs, continuity): Met — shows 102-day extension countdown, $12K–$18K total cost, HR attestations
- Attorney view (filing readiness, risk flags, evidence gaps): Met — "Filing package: 3 items to resolve", SOC risk, employer name, evidence bundle count
- Microcopy differences (reassuring vs. operational vs. compliance-focused): Met — distinct tone is clearly audible across the three views
- Role badge identifies current view: Met — colored pill badge ("Applicant View", "Employer / HR View", "Attorney View")
- **Gap:** Spec suggests showing "case coordinator ownership or assignment" in employer/attorney views. No named case coordinator appears in either view. This is listed as "optional detail" so the gap is low severity.
- **Gap:** The role switcher uses AnimatePresence with a small y-offset transition. The spec says role changes should "reorder cards" and "change available actions." Content reordering is implemented via different `roleContent` data per role, but the card layout structure is identical across roles — same three-column grid, same card positions. A more dramatic structural reorder (e.g., attorney view leading with the validation summary card rather than a greeting) would strengthen the "same case, different truth" demo beat.

**Screen 5 (Impact):**
- Two-column: "What CaseBridge Solves" vs. "Requires Broader Reform": Met — green column vs. slate column
- Metrics strip (6 KPIs with before/after): Met — all 6 metrics from the research
- Scope statement ("A better process, even before broader reform."): Met — rendered in navy hero block
- Closing summary "The CaseBridge Approach" (Enter Once, Validate Early, Stay Aligned): Present — a nice addition not in the spec but consistent with the thesis
- **Gap:** Spec says the Impact screen should feel like "a strong closing argument." The navy block with the serif closing quote achieves this well, but there is no explicit reconnection to the demo case (Yuto Sato's outcome) on this screen. A one-line callout — "For Yuto Sato, this means no missed extension, no RFE delay, and full case visibility" — would give the abstract metrics an emotional anchor.

---

### Spec 03: Data Model + Mock Logic + Interaction States

**Overall fidelity: VERY HIGH**

| Requirement | Status | Notes |
|------------|--------|-------|
| All 10 core entities present | Met | All fields from Spec 03 appear in `mockData.js` |
| Canonical demo case (Yuto Sato, Helix Systems, Maya Chen) | Met exactly | Including all subfields: A-number, FEIN pattern, bar number |
| Readiness score derived from issue penalties | Met | `computeReadiness()` in DemoContext: 95 - 10(soc) - 8(employer) - 5(travel) = 72 baseline |
| Case health derived from unresolved high-severity issues | Met | `getCaseHealth()` returns "Needs Review" when soc-wage unresolved, "On Track" otherwise |
| 5 required deterministic interactions | 4 of 5 met | See below |
| Issue A (employer name mismatch, medium): met | Met | `fixable: true`, updates intake field, syncs form cards |
| Issue B (SOC/wage mismatch, high): met | Met | Not directly fixable in UI; attorney action required — appropriate |
| Issue C (travel history gap, low): met | Met | Highlighted in intake field when validation run |
| Seeded alerts (H-1B expiry, attorney review, SOC flag, priority date): met | Met | All 4 alerts in mockData, rendered in Dashboard |
| Plain-language / technical paired fields | Met | `plainDescription` on each issue, `plainExplanation` on each agency status |
| Role-specific data transforms | Met | `roleContent` object provides distinct greeting, summary, nextStep, alerts, actions per role |
| Reset behavior | Met | "Reset" button in Navigation dispatches `RESET_DEMO` action |
| Readiness score count-up animation | Met | `ReadinessScore` uses `requestAnimationFrame` with cubic ease-out |

**Interaction gap — Interaction 4 (Advance Stage Preview):** Spec 03 requires "a controlled interaction to show what happens next" — e.g., advancing the timeline from I-485 prep to biometrics/approval. No such interaction exists in the current build. The timeline stage states are static (hardcoded in `stages` array). This is a missing demo beat that spec 05 references (Shot 4: "Timeline focus").

**Minor data gap:** The spec lists `changeHistory` on shared intake fields (for showing that a field was last edited by the attorney vs. the applicant). The data model in `intakeSections` does not include `changeHistory` or `lastEditedBy`. These would strengthen the "single source of truth" concept if shown.

**Alert count bug:** In `Dashboard.jsx`, the alert badge count shows `unresolvedCount + 1` rather than just the count. With 3 unresolved issues initially, the badge would show "4" — which is inaccurate. This is a logic error that could be noticed during a live demo.

---

### Spec 04: Visual System + Presentation Build Constraints

**Overall fidelity: HIGH**

| Requirement | Status | Notes |
|------------|--------|-------|
| Deep navy primary color | Met | `--color-navy-900: #0a1628` used for nav bar and key CTA elements |
| Warm off-white background | Met | `--color-surface: #faf9f7` (slightly warm stone tone) |
| Muted gold accent | Met | `--color-accent: #c6993e` — used for primary buttons, active nav, metric highlights |
| Green for resolved/healthy | Met | Used on completed stages, resolved issues, "On Track" badges |
| Amber for caution | Met | Used on warnings, H-1B deadline card, "Needs Review" badges |
| Red sparingly for blockers | Met | Used only on high-severity validation issues |
| Inter for body, serif font for hero | Met | `--font-sans: 'Inter'`, `--font-serif: 'Source Serif 4'`; serif used on Overview h1 and Impact header |
| Generous whitespace, clear card hierarchy | Met | Cards use `rounded-xl border border-slate-200/80 shadow-sm p-5` consistently |
| Framer Motion: fades, slides, no bounce | Met | All animations use opacity + y-offset with easeOut; no spring physics |
| Custom animations (sync pulse, form glow, score glow) | Met | Three `@keyframes` defined in `index.css` and properly applied |
| Stage timeline component | Met | Full `StageTimeline` with compact mode for Roles screen |
| Alert rail / notification panel | Met | Right-column alert section on Dashboard |
| Segmented role switcher | Met | Inline pill component on Roles screen |
| Issue cards with severity colors | Met | Left-border color coding (red/amber/blue) + severity badge |
| Scope/system impact block | Met | Impact screen with two-column comparison |
| No heavy tables | Met | Only structured card layouts |
| No modal dependencies | Met | Zero modals in the codebase |
| Screen-readable at projection distance | Likely met | Font sizes are 13–15px for body copy with clear hierarchy; some sync-indicator text at 8–9px may be marginal at projection |

**Gap:** Spec 04 mentions "query params or debug toggles for screen/role/state" for Remotion-friendliness. The current build uses React context only — there are no URL params that allow direct deep-linking to a specific screen state. A `?screen=intake&role=attorney&validationRun=true` query param system would make Remotion recording significantly easier. This is listed as "nice-to-have" in Spec 04 but explicitly required in Spec 03's "Required technical convenience" section.

**Gap:** Some sub-text in form cards (sync indicator "X fields synced") renders at 9px. At projection distance this will be invisible. Labels serving a demo proof function should be at minimum 11px.

---

### Spec 05: Demo Narrative + Shot Plan

**Overall fidelity: HIGH for content, with one missing beat**

The spec defines 8 narrative beats and 14 specific shots. Review:

| Beat | Shot | Prototype Support |
|------|------|-------------------|
| 1: Current-state tension | No dedicated screen | Not directly supported. The prototype opens on Overview, which is already future-state. No before/after contrast screen exists. |
| 2: Future-state platform intro | Overview hero + capability cards | Fully supported |
| 3: Shared case workspace | Dashboard screen | Fully supported — timeline, agencies, alerts, next step all present |
| 4: Timeline focus | Dashboard StageTimeline | Supported statically; no interaction to advance stages |
| 5: Intake sync | Intake screen, left → center panels | Fully supported — field changes implied by mismatch highlighting |
| 6: Validation issue appears | "Run Pre-Flight Validation" interaction | Fully supported with animated reveal |
| 7: Field corrected | "Fix: Standardize to Helix Systems, Inc." | Fully supported with sync animation |
| 8: Readiness score improves | ReadinessScore count-up animation | Fully supported — smooth cubic ease-out |
| 9–11: Role switcher (all three) | Roles screen, segmented switcher | Fully supported |
| 12: Deadline alert / extension | Dashboard deadline card | Fully supported — 102-day countdown with auto-trigger note |
| 13: Scope clarity | Impact screen | Fully supported |
| 14: Final impact close | Impact screen metrics strip + closing quote | Fully supported |

**Critical gap — Beat 1 (Current-State Tension):** Spec 05 dedicates the first 10–15 seconds to framing the problem emotionally before the product appears. The shot plan calls for document stacks, fragmented portal labels, unclear status snippets, and "what happens next?" uncertainty. No screen in the prototype supports this. Beat 1 would need to be handled entirely by the presenter verbally or via a separate slide deck. The optional "Screen 6: Current-State Contrast" from Spec 02 was never built.

---

## B. Capability Coverage Assessment

### Core Technology Capabilities (Portal-Appropriate)

**Capability A — Smart Intake / One Source of Truth (Proposals A, Shared Ledger)**
Coverage: STRONG. The Intake screen's left panel labeled "Shared Case Data — Source of Truth" directly embodies this. Fields show `syncTargets` as small form-code chips. The `intakeSections` data model mirrors Spec 03's shared intake field structure.

**Capability B — Pre-Filing Validation / Pre-Flight Check (Proposals B, H)**
Coverage: STRONG. This is the prototype's most interactive demo moment. The "Run Pre-Flight Validation" button, 1.2-second analyzing animation, issue reveal with severity coding, and the fixable employer-name issue all execute exactly as specified. The readiness score's count-up animation makes the impact viscerally clear.

**Capability C — Structured RFE Response (Proposal C)**
Coverage: PARTIAL. The SOC/wage issue card shows `recommendedFix: 'Attorney to confirm correct wage survey period...'` in italic text, which is directionally correct. However, there is no structured template or workflow for responding to the issue once it escalates to an actual RFE. This is appropriately scoped out for a demo prototype but should be acknowledged in Q&A if the question arises.

**Capability D — Unified Cross-Agency Dashboard (Proposals A, "Command Center")**
Coverage: STRONG. The Dashboard screen shows all three agencies (DOL, USCIS, DOS) with status, last-update timestamp, and plain-language explanation. The `StageTimeline` maps all 8 stages from eligibility through approval with agency labels. The cross-agency view is the clearest proof of the "replacing 4 portals with 1 view" claim.

**Capability E — Auto-Extension and Deadline Orchestration (Proposals D, F, "Auto-Extension")**
Coverage: STRONG. The amber H-1B deadline card on Dashboard shows 102 days remaining, auto-trigger at 90 days, and a visual progress bar. Employer view on Roles screen adds budget and continuity context. This is the strongest employer-facing demo beat.

**Capability F — Plain-Language Guidance + Wizard (Proposals N, "Plain-Language")**
Coverage: MODERATE. Plain-language is present throughout: each issue has a `plainDescription`, each agency status has a `plainExplanation`, and the applicant role view is written in accessible prose ("Your case is on track"). What is missing is a structured wizard flow — a step-by-step guided check that walks a new applicant through eligibility questions. The spec lists this as a Delighter tier capability, and the current implementation approximates it without building the full interactive wizard. For the demo, this is acceptable; for a Delighter proof moment, a single question-and-answer interaction would be more memorable.

**Capability G — Employer Sponsorship Cost Visibility (Proposals D, E)**
Coverage: PARTIAL. The Employer role view shows "Estimated total: $12,000–$18,000. Spent to date: $4,200." This is meaningful but passive — a user reads a number rather than interacting with a cost model. Spec 01 lists "sponsorship cost calculator" as a secondary capability. A simple before/after or interactive cost card would be stronger.

**Capability H — Handoff SLAs + Case Coordinator (Proposal F, "Handoff SLAs")**
Coverage: MINIMAL. The `metrics` data includes `handoffIdle: { before: 'Weeks', after: '<5 days' }` and it appears in the Impact screen metrics strip. However, no screen shows a named case coordinator, SLA clock, or handoff ownership assignment. This is the weakest capability coverage area in the prototype.

**Capability I — Tiered Adjudication / AI Triage (Proposals G, H)**
Coverage: NOT PRESENT. Correct. These are USCIS-internal process changes and are explicitly out of scope for the portal prototype. They should appear in the broader presentation as "requires broader reform" levers.

**Capabilities J, K, L — Labor System Reform (H-1B allocation, OPT, payroll tax parity)**
Coverage: NOT PRESENT. Correct. The Impact screen's "Requires Broader Reform" column should reference OPT alignment and domestic pipeline (it does: "Domestic pipeline & OPT alignment"). These are presentation-slide arguments, not portal features.

**Capabilities M, N, O — Applicant Protection (Portable priority dates, pay transparency, complaint portal)**
Coverage: NOT PRESENT (M), PARTIAL (N), NOT PRESENT (O).
- Portable priority dates: the mockData shows `priorityDate` but portability is a legislative concept not demonstrated.
- Pay transparency: the job data includes `salary: '$165,000'` and `prevailingWage: '$155,000'` visible in the intake section. This implicitly shows wage alignment — sufficient for demo purposes.
- Anonymous complaint portal: correctly excluded as a policy proposal.

### ChatGPT-Identified Top Capabilities Scorecard

| Capability | Implementation |
|-----------|---------------|
| 1. Shared Immigration Case Command Center | STRONG — Dashboard screen |
| 2. Pre-Filing Quality Gate / RFE Prevention | STRONG — Intake validation interaction |
| 3. Employer Sponsorship Compact + Early Decision Gate | PARTIAL — cost visible, no interactive gate |
| 4. Auto-Extension and Deadline Orchestration | STRONG — 102-day countdown with auto-trigger |
| 5. Plain-Language Guidance + Wizard | MODERATE — present throughout, no step-through wizard |
| 6. Handoff SLAs + Escalation Matrix | MINIMAL — metric cited, not demonstrated |
| 7. Trusted-Sponsor / Clean-File Lane | NOT PRESENT — intentionally out of scope |
| 8. Separate Structural Reform Package | MET — Impact screen "Requires Broader Reform" column |

---

## C. Pain Points & Capabilities Spreadsheet Alignment

The XLSX file is binary and cannot be parsed directly, but the metrics layer in `mockData.js` can be cross-referenced against the team's published metric targets from the project documentation.

### Metric Accuracy Review

| Metric | Research Target | mockData Implementation | Match |
|--------|----------------|------------------------|-------|
| RFE Rate | ~25% → <5% | `rfeRate: { before: '~25%', after: '<5%' }` | Exact |
| Status inquiry calls | -60% | `statusCalls: { before: '4 portals', after: '1 view', change: '-60%' }` | Exact |
| Attorney eligibility hours | ~8 → ~3 | `attorneyHours: { before: '~8 hrs', after: '~3 hrs', change: '-62%' }` | Exact |
| Extension cost | -50% | `extensionCost: { before: '$5,000+', after: '~$2,500', change: '-50%' }` | Exact |
| Handoff idle time | Weeks → <5 days | `handoffIdle: { before: 'Weeks', after: '<5 days', change: '-75%' }` | Exact |
| PWD revision cycles | ~15% → <3% | `pwdRevisions: { before: '~15%', after: '<3%', change: '-80%' }` | Exact |

All six metrics in the Impact screen trace exactly to the research targets. No invented numbers.

### Kano Classification and Demo Order

The build prompt specifies demo order: Basics first (Intake/Validation), then Performance (Dashboard/Roles with deadline), then Delighters (plain language, notifications). The navigation order is: Overview → Case → Intake → Roles → Impact.

This sequence is nearly correct but has one deviation: **Dashboard (Case) appears before Intake in the navigation.** The spec's recommended demo path (Spec 02) lists: Overview → Case Workspace → Smart Intake + Validation → Role Views → System Impact. So the order Case → Intake → Roles is correct for the Kano argument. The issue is that navigation allows free exploration, so a presenter could jump out of order. The nav bar does not enforce the demo sequence.

The **Basic tier capabilities** (validation, intake, cross-form consistency) are demonstrated in Intake. The **Performance tier capabilities** (unified dashboard, deadline management) are on Dashboard. The **Delighter tier** (plain language, notifications) are threaded throughout but most visible in the Roles screen applicant view. This ordering is defensible in a presentation context.

**What the Kano argument requires but the prototype doesn't explicitly communicate:** The demo never verbally or visually explains *why* it shows Basics first. Adding a one-line annotation on the Overview or a Kano-order label on the capability cards ("Start here: must-have") would reinforce the framework argument during Q&A.

---

## D. Specific Gaps and Recommendations

Prioritized by presentation impact:

### Priority 1 — Critical for Demo Quality

**[D1] Missing pre-validation readiness baseline display**
The readiness score shows 72 immediately when the page loads, even before the user runs validation. This breaks the "discovery" narrative — the audience should see the score as unknown or pending, then see it revealed by the validation run.
*Fix:* Show a neutral "—" or "Run check to see score" state before `validationRun` is true. Display 72 only after validation completes.

**[D2] Alert count badge bug in Dashboard**
`Dashboard.jsx` line 170: `unresolvedCount + 1` is used as the badge number. If there are 3 unresolved issues, the badge shows "4." This is incorrect and will be noticed by any Q&A panelist who pays attention.
*Fix:* Change to `unresolvedCount` or compute total alert count from the alerts array separately.

**[D3] No URL-param deep linking for Remotion**
Spec 03 explicitly requires "route or screen state can be set directly" and Spec 04 lists query params as a "nice-to-have." Without URL params, Remotion recording requires programmatic context manipulation, which adds complexity to the video phase.
*Fix:* Parse `?screen=intake&validationRun=true&role=attorney` on load and initialize DemoContext accordingly. A single `useEffect` in App.jsx reading `URLSearchParams` is sufficient.

**[D4] No current-state contrast screen (Beat 1 from shot plan)**
The demo narrative opens with 10–15 seconds of current-state tension (fragmented portals, unclear status, physical mail). The prototype has no screen for this. Presenters must handle this verbally or with slides, creating a disconnect before the portal appears.
*Fix:* Add an optional Screen 0 / pre-demo splash — a simple before-state visualization showing "5 portals, 1 mailbox, 0 dashboards" with fragmented status labels. This can be a single static screen (no interactions needed) and can be skipped if time is tight. Spec 02 explicitly reserved this as optional Screen 6.

### Priority 2 — Important for Completeness

**[D5] Stage timeline is static (Interaction 4 missing)**
Spec 03 Interaction 4 requires "advance stage preview" — showing I-485 prep advancing to biometrics. The `stages` array is hardcoded. No mechanism advances the timeline state.
*Fix:* Add an "Advance Stage" button (could be in attorney view actions or a subtle demo control) that transitions the active stage from `i485` to `biometrics`. This proves the system tracks progression, not just a snapshot.

**[D6] Employer view lacks cost calculator interaction**
The Employer role view shows a cost estimate passively. Spec 01 lists "sponsorship cost calculator" as a secondary capability. The employer-facing demo moment — showing that the platform surfaces cost before a hiring decision rather than after — is a strong argument for the employer stakeholder buy-in question.
*Fix:* Add a collapsed "View Cost Breakdown" section in the Employer role view that expands to show per-phase cost estimates (PERM: $3K–$5K, I-140: $2K–$4K, I-485: $4K–$6K, extensions: $2K–$4K/cycle). No calculation logic needed — static seeded breakdown is sufficient.

**[D7] Handoff SLA capability is invisible in the UI**
The `handoffIdle` metric appears only in the Impact screen metrics strip. No screen demonstrates what a handoff SLA looks like in practice — no named coordinator, no response-time clock, no escalation state.
*Fix:* Add a "Case Coordinator" section to the attorney view (or a small card on Dashboard): "Maya Chen — Lead. Rachel Torres — HR. Response SLA: 2 business days. Last handoff: 3 hours ago." This is seeded data, requires no logic, and proves the capability.

**[D8] Overview screen lacks a compact journey bar**
Spec 02 Screen 1 requires "one visual summary of the case journey." The case preview card shows metadata (stage name, priority date) but no visual milestone bar. A viewer landing on Overview cannot see at a glance where Yuto's case stands in the 8-stage process.
*Fix:* Add a compact read-only `StageTimeline` (already built with `compact` prop) inside the case preview card on Overview. This is a four-line code change.

**[D9] Roles screen layout does not structurally reorder across roles**
All three role views use the same card layout (greeting card → next step card → actions card → alerts column). Spec 02 says "some content blocks reorder" when roles change. The attorney view, in particular, should lead with the risk flags column rather than the greeting, since attorneys care first about what is broken.
*Fix:* Conditionally swap the two-column vs. one-column assignment based on role. For attorney, move the alerts/risk-flags panel to full-width top position with the "3 items to resolve" summary card as the dominant element.

### Priority 3 — Refinements

**[D10] 9px sync-indicator text is not projection-legible**
The "X fields synced" label under each form card renders at `text-[9px]`. At projection distance (8–15 feet), this is invisible. The sync proof — that data flows from one source to many forms — is load-bearing for the demo.
*Fix:* Increase to `text-[11px]` and consider replacing "X fields synced" with the specific count as a badge ("18 fields") that reads more like a number pill.

**[D11] Missing plain-language explainer block on Intake screen**
The applicant role has rich plain-language copy ("The company name is written two different ways..."). But the Intake screen itself is attorney-facing and uses technical descriptions. Adding a toggle or a small note that says "Applicant sees: [plain-language version]" would demonstrate the dual-language layer without requiring a separate screen.

**[D12] Impact screen has no case-level emotional anchor**
The Impact metrics (RFE rate, status calls, attorney hours) are abstract. A one-line summary at the bottom of the screen — "For Yuto Sato: no missed extension, no RFE, full case visibility from day one" — would connect the aggregate metrics back to the human story, which is where the presentation's emotional weight lives.

**[D13] No explicit Kano-order annotation for the audience**
The prototype demonstrates capabilities in Kano order (Basic → Performance → Delighter) but never signals this framework. A small "Kano tier" badge or a one-line on the Overview ("Starting with must-haves") would reinforce the analytical framework during the live demo and make the course framework visible to the professor.

---

## E. Strengths

### E1 — The Validation Interaction is the Strongest Demo Beat in the Prototype
The "Run Pre-Flight Validation" → analyzing state → issue reveal → "Fix: Standardize to Helix Systems, Inc." → form cards glow → readiness score count-up sequence is exactly what a presentation-first demo needs: one button, visible causality, immediate proof of value. The `animate-form-sync` CSS animation is restrained and legible. The `ReadinessScore` SVG ring with `requestAnimationFrame` cubic ease-out is polished. This beat would survive a live class demo and a Remotion recording without modification.

### E2 — Data Architecture is Principled and Traceable
Every metric in `mockData.js` traces to the team's research targets. The `computeReadiness()` function derives from actual issue penalties rather than hardcoded state. The `getCaseHealth()` function uses domain logic (unresolved high severity = "Needs Review"). The role content transforms apply distinct vocabulary per stakeholder without duplicating the underlying case record. This is exactly the "derived state" philosophy Spec 03 required.

### E3 — Visual System Matches the Spec's Emotional Register
The navy/gold/off-white palette, `Source Serif 4` for headlines, `Inter` for body, generous padding, and `shadow-sm` card elevation system all produce the "premium legal-tech / gov-tech" feel Spec 04 specified. The prototype avoids every anti-pattern the spec called out: no flashy animations, no consumer-app color saturation, no dense admin tables, no modals. The `bg-surface: #faf9f7` warm off-white is a particularly good choice — it reads as institutional without being sterile.

### E4 — Role Switching Microcopy is Distinctly Calibrated
Attorney: "Filing package: 3 items to resolve. SOC 15-1256 classification risk. Risk of DOL audit or RFE." Employer: "Case active — deadlines approaching. Auto-trigger at 90 days. Budget approval may be needed." Applicant: "Your case is on track. No action needed today." The tonal differentiation is sharp enough to be perceivable in a 30-second role-switch demo. The `RoleBadge` component (color-coded pill) makes the active perspective visually unambiguous.

### E5 — Cross-Agency Status is Unusually Clear
DOL / USCIS / DOS rendered with distinct status badges, dates, and plain-English explanations in a tight three-row panel is the most compact and legible implementation of the "replacing 4 portals with 1 view" proof. The paired technical/plain-language explanation on each row is a direct implementation of the spec's dual-language requirement and a genuine UX insight.

### E6 — Reset Mechanism is Properly Implemented
The `RESET_DEMO` reducer action returns exactly `{ ...initialState }`, ensuring all state (validationRun, issues, employerNameFixed, currentRole, currentScreen) returns to the baseline. The "Reset" button is placed in the nav bar where a presenter can find it between demo runs. This is a demo-readiness requirement that is often forgotten and was correctly implemented here.

### E7 — Three-Panel Intake Layout is Spec-Accurate and Visually Persuasive
The 4/4/4 grid (Shared Data | Filing Package | Validation) creates a spatial argument: one source on the left feeds many forms in the center and is checked by validation on the right. This layout communicates the entire value proposition of "enter once, sync everywhere, catch issues before filing" without a single word of explanation. It is the prototype's most persuasive purely visual moment.

---

## Decision Log

| Decision | Framework Basis | Correctness | Risk |
|----------|----------------|-------------|------|
| 5-screen structure matching spec labels | Spec 02 IA philosophy | Correct — keeps demo sequence coherent | Low |
| DemoContext with useReducer rather than Zustand | Spec 03 "React context or Zustand" | Correct — simpler for a demo prototype | Low |
| Framer Motion AnimatePresence for screen transitions | Spec 04 motion principles | Correct — fade-only transitions are Remotion-safe | Low |
| Score baseline at 95 minus penalties (not starting at 0) | Spec 03 "Suggested simple formula" | Correct per spec; but pre-validation display is misleading | Medium — D1 gap |
| Static `stages` array (no stage-advance interaction) | Not explicitly built | Gap vs. Spec 03 Interaction 4 | Medium — D5 gap |
| No URL param deep-linking | Spec 04 lists as "nice-to-have"; Spec 03 as "required" | Gap — will complicate Remotion phase | High — D3 gap |
| No current-state contrast screen | Spec 02 lists as "optional Screen 6" | Acceptable omission for core build; important for shot plan | Medium — D4 gap |
| Alert badge count `unresolvedCount + 1` | No spec basis | Bug | High — D2 gap |

---

## Summary Recommendations by Phase

### Before the Live Presentation (must-do):
1. Fix the alert count badge bug (`unresolvedCount + 1` → correct count)
2. Hide the readiness score until validation is run
3. Add compact StageTimeline to Overview case preview card
4. Add "For Yuto Sato" emotional anchor to Impact screen closing

### Before the Remotion Video (high value):
5. Add URL param deep-linking for screen/role/validationRun state
6. Add stage advance interaction (even a single button to progress to biometrics)
7. Build optional Screen 0 (current-state contrast) — static, no interactions

### If Time Permits (strengthens Q&A defense):
8. Add seeded Case Coordinator section to attorney/employer views
9. Add cost breakdown panel to employer role view
10. Add Kano-tier annotation to the Overview capability cards

---

*Sources reviewed: Specs 01–05, mockData.js, DemoContext.jsx, App.jsx, Overview.jsx, Dashboard.jsx, Intake.jsx, Roles.jsx, Impact.jsx, Navigation.jsx, Layout.jsx, StageTimeline.jsx, ReadinessScore.jsx, index.css, CLAUDE.md*
