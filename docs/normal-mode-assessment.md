# Normal-Mode Website Assessment — Teammate Script Alignment
**Date:** 2026-03-10
**Assessor:** Claude (read-only)
**Purpose:** Evaluate how well the 5 normal-mode screens visually support the teammate's 11 script claims.

---

## Scope

- **Files read:** `app/src/screens/Overview.jsx`, `Dashboard.jsx`, `Intake.jsx`, `Roles.jsx`, `Impact.jsx`
- **Supporting files:** `app/src/context/DemoContext.jsx`, `app/src/data/mockData.js`
- **Comparison basis:** Teammate's 11 script claims vs. what actually renders on each screen

---

## Screen-by-Screen Inventory

### Screen 1: Overview (`/overview`)

**Default state:** "With CaseBridge" toggle active (future state).

**What renders (future mode):**
- Hero headline: "One shared case record for the H-1B to green card journey."
- 4 capability cards with explicit metrics:
  - Smart Intake: "6 forms, 1 entry"
  - Validation Engine: "RFE rate: 25% → <5%"
  - Unified Dashboard: "Status calls: -60%"
  - Role-Based Views: "Attorney hours: 8 → 3"
- Demo case preview: Krishna — EB-2 Green Card via HPE, stage timeline
- Scope note: "This platform reduces avoidable process friction, rework, and uncertainty. It does not eliminate statutory caps, retrogression, or all legal complexity."

**What renders (current/today mode — toggled via "Today" button):**
- Hero headline: "Fragmented, opaque, and expensive to navigate."
- 6 friction cards: "4 separate portals", "1 physical mailbox", "~25% RFE rate", "Weeks of idle time", "0 dashboards", "No plain language"
- Visual: 6 boxes (DOL Portal, USCIS Portal, DOS Portal, Employer HRIS, Email Threads, Physical Mail) all labeled "Not connected"
- Caption: "5 portals + 1 mailbox + 0 dashboards = no single source of truth"

**Notable gaps:** No dollar figures on this screen. Legal costs ($15,000 / $10,000), "300 pages to 100 pages", and "applicants can quickly search for forms" are not present.

---

### Screen 2: Dashboard (`/dashboard`)

**What renders (default state, no URL params):**
- Case header: Krishna — EB-2 Green Card, with Applicant/Employer/Attorney shown
- Case Journey: full 8-step stage timeline (Eligibility → PWD → PERM → I-140 → Visa Bulletin → I-485 Prep [active] → Biometrics → Approval)
- Cross-Agency Status: DOL (PERM Certified), USCIS (I-140 Approved · I-485 Pending), DOS (Priority Date Current) — with plain-language explanations for each
- "What's Happening Now" plain-language narrative
- Alerts panel: 4 alerts (H-1B Extension, Attorney Review Pending, SOC Classification Risk, Priority Date Current)
- H-1B Extension Deadline card: "102 days remaining", auto-trigger at 90 days (March 17, 2026), "No action required yet"
- Case Team: Maya Chen (SLA: 2 business days), Rachel Torres (SLA: 3 business days)

**What renders (with `?alert=deadline`):**
- Large deadline protection block surfaces with "Est. Cost: $2,500–4,000" vs "$5,000+ rush" — this is the most explicit cost comparison on the site, though not framed as "legal costs" per se
- Auto-trigger date, responsible party (Rachel Torres, HPE HR) all visible

**Notable gaps:** No "$15,000 → $10,000" legal cost number anywhere on this screen. No "300 pages" reference. No form-search capability shown.

---

### Screen 3: Smart Intake + Validation (`/intake`)

**Default state (before running validation):**
- Header: "Smart Intake + Validation — Enter once. Sync across forms. Catch issues before filing."
- 6 tabbed intake sections: Identity, Identifiers, Immigration History, Employer, Job/Worksite, Address/Travel
- Each field shows sync targets (e.g., "→ 6 forms")
- Auto-Sync indicator: "Changes propagate to all 7 forms instantly"
- Filing Package panel: 6 forms (ETA-9089, I-140, I-485, I-765, I-131, G-28) with completion percentages and synced field counts
- Section header shows "Fields in this section populate [N] downstream forms"
- Form pills shown per section (e.g., I-129, I-140, I-485, I-765, I-131, G-28)

**After clicking "Run Pre-Submission Check":**
- 3 validation issues appear: SOC/Wage Mismatch (High), Employer Name Mismatch (Medium), Travel History Gap (Low)
- Each issue shows: plain-language description, affected forms (I-140, I-485, ETA-9089), severity badge
- Employer Name issue has a "Fix: Standardize to 'Hewlett Packard Enterprise'" button
- Clicking fix: employer name field updates across I-140, I-485, ETA-9089 with animated sync flash
- Readiness Score ring updates: starts at 72 (unresolved) → 80 (after employer fix) → 95 (all fixed)
- I-485 Filing Checklist appears below form: 15 documents, color-coded (done/flagged/missing/pending), with progress bar

**Notable gaps:** No "300 pages → 100 pages" reference. No "forms auto-renew" language. No dollar cost figures on this screen.

---

### Screen 4: Stakeholder Views (`/roles`)

**What renders (applicant role, default):**
- Role switcher tabs: Applicant, Employer/HR, Attorney
- Greeting: "Your case is on track."
- Plain-language status summary and next step
- Stage timeline (compact)
- Available Actions list
- "Your Eligibility Check" wizard: 8 yes/no questions answered in plain language (e.g., "Your MBA meets the education bar for EB-2.", "After years of waiting, your date is finally current.")
- Alerts: Work Authorization, Priority Date Current, Travel Advisory

**What renders (employer role):**
- Greeting: "Case active — deadlines approaching."
- Sponsorship Cost Breakdown table:
  - PERM: $4,000–$6,000 (Paid)
  - I-140: $3,000–$5,000 (Paid)
  - I-485: $5,000–$7,000 (Upcoming)
  - H-1B Extensions (×2): $2,500–$4,000/cycle (Recurring)
  - **Estimated Total: $15,000–$22,000** (explicitly shown)
- Alerts: H-1B Extension (102 days), Sponsorship Cost ($15,000–22,000 estimated total / $6,800 spent), Workforce Continuity

**What renders (attorney role):**
- Greeting: "Filing package: 3 items to resolve."
- Risk flags: SOC Classification Risk, Employer Name Standardization, Evidence Bundle (21 of 23)
- Next step: Resolve SOC wage discrepancy, standardize employer name, request travel records

**Notable gaps:** The "under $10,000" claim for CaseBridge-enabled legal costs is not explicitly shown — the screen shows $15,000–$22,000 as total sponsorship cost (which includes filing fees, not just legal), and shows $2,500–$4,000 for extension cost with CaseBridge vs $5,000+ without. The framing of "legal costs drop to under $10,000" does not appear verbatim anywhere.

---

### Screen 5: System Impact + Scope (`/impact`)

**What renders:**
- Header: "System Impact + Scope — What this platform changes directly — and what still requires broader reform."
- Metrics strip (6 tiles, all with before/after/change):
  - RFE Rate: ~25% → <5% (-80%)
  - Status Inquiries: 4 portals → 1 view (-60%)
  - Eligibility Review: ~8 hrs → ~3 hrs (-62%)
  - Extension Cost: $5,000+ → ~$2,500 (-50%)
  - Handoff Time: Weeks → <5 days (-75%)
  - PWD Revisions: ~15% → <3% (-80%)
- "What CaseBridge Solves" panel (6 items with CheckCircle icons):
  - Cross-form data inconsistency: "Single intake syncs across 6+ forms. RFE rate target: 25% → <5%"
  - Fragmented status visibility: "One dashboard replaces 4 portals + 1 mailbox. Status inquiry calls: -60%"
  - Missed extension deadlines: "Auto-triggered reminders at 90 days. Per-extension cost: -50%"
  - Legal language opacity: "Plain-language wizard for eligibility. Attorney basic hours: 8 → 3"
  - Dropped handoffs: "Named coordinators with SLAs. Idle time: weeks → <5 business days"
  - PWD / wage data revision cycles: "Pre-validated SOC/wage data. Revision rate: 15% → <3%"
- "Requires Broader Reform" panel (5 items): visa caps, retrogression, USCIS backlogs, political volatility, OPT pipeline
- Closing quote: "A better process, even before broader reform."
- CaseBridge Approach: 3-step summary (Enter Once → Validate Early → Stay Aligned)

**Notable gaps:** No "300 pages to under 100 pages" metric. No "applicants can quickly search for forms" claim. No explicit "$15,000 → under $10,000" legal cost figure (only extension cost shown as $5,000+ → $2,500).

---

## Claim-by-Claim Assessment

### Claim 1: "Legal counsel costs drop from $15,000 to under $10,000"
**Rating: WEAK**

The number $15,000 appears twice in the site — but only as the *lower bound of total sponsorship cost* ($15,000–$22,000), not as a legal cost figure. The closest supporting visual is on the Dashboard (with `?alert=deadline`): "$2,500–4,000" vs "$5,000+ rush" for extension cost (-50%), and on the Impact screen: "Extension Cost: $5,000+ → ~$2,500". Neither directly supports "$15,000 → under $10,000 legal counsel costs." The Roles screen / Employer view shows $15,000–$22,000 total with a breakdown, but this is framed as total sponsorship cost including USCIS filing fees — not legal counsel alone. A teammate making this claim verbally would lack a screen to point to that confirms it.

**Best available evidence:** Roles screen (employer tab) sponsorship cost table. Impact screen extension cost metric.

---

### Claim 2: "Documentation dashboard reduces RFE likelihood from 25% to under 5%"
**Rating: STRONG**

This metric is explicitly present on three screens:
- Overview (future mode): Validation Engine card — "RFE rate: 25% → <5%"
- Impact screen: metrics strip — "RFE Rate: ~25% → <5% (-80%)"
- Impact screen: "What CaseBridge Solves" — "RFE rate target: 25% → <5%"
- Intake screen header subtitle: "Catch issues before filing" (implies but does not restate the 25% → 5% figure directly)

---

### Claim 3: "One shared case carries corrections through every form"
**Rating: STRONG**

Directly demonstrated by the Intake screen:
- Every field shows "→ N forms" sync target count
- Auto-Sync indicator: "Changes propagate to all 7 forms instantly"
- When employer name is fixed, animated sync flash hits I-140, I-485, ETA-9089 simultaneously
- Filing Package panel shows all 6 forms with synced field counts (8–24 fields per form)
- Overview (future mode) headline: "One shared case record for the H-1B to green card journey"

---

### Claim 4: "Prevents redundancy and disconnected filings"
**Rating: STRONG**

Supported on multiple screens:
- Overview (current mode): 6 fragmented portals shown as "Not connected", "5 portals + 1 mailbox + 0 dashboards"
- Overview (future mode): capability card "Enter data once. Auto-populate across 6 immigration forms."
- Intake: "Enter once. Sync across forms." header
- Dashboard: Cross-Agency Status panel showing DOL, USCIS, DOS all in one view
- Impact: "Fragmented status visibility → One dashboard replaces 4 portals + 1 mailbox"

---

### Claim 5: "Resubmissions are minimized"
**Rating: PARTIAL**

The site shows pre-submission validation (3 issues caught before filing) and the RFE rate reduction (25% → <5%). But there is no explicit "resubmission" or "re-filing" terminology or visual on any screen. The concept is implied by preventing RFEs (which require response and re-adjudication), but a teammate would need to bridge this verbally. The Intake validation panel is the closest visual anchor.

---

### Claim 6: "Forms auto-renew when H-1B is expiring, lowering legal costs"
**Rating: PARTIAL**

The auto-trigger concept is present and visually prominent:
- Dashboard: H-1B Extension Window card — "Auto-trigger at 90 days (March 17, 2026). No action required yet."
- Dashboard (`?alert=deadline`): large block — "Est. Cost: $2,500–4,000 vs $5,000+ rush"
- Impact screen: "Missed extension deadlines → Auto-triggered reminders at 90 days. Per-extension cost: -50%"
- Roles (employer view): alert "Extension window approaching. Auto-trigger at 90 days."

However, "auto-renew" is slightly imprecise as a description — the site says "auto-trigger" for initiating the extension process, not that forms fill themselves automatically. And "lowering legal costs" is shown only as extension cost reduction (-50%), not broader legal cost reduction. The visual support is real but the claim uses language slightly stronger than what the screen says.

---

### Claim 7: "Instructions simplified from 300 pages to under 100"
**Rating: ABSENT**

This metric does not appear anywhere in the normal-mode website. Not in mockData.js metrics, not in any screen component. The site does show plain-language features (eligibility wizard on Roles screen, plain explanations in Dashboard) and shows "Attorney basic hours: 8 → 3" as a proxy, but the specific "300 pages → 100 pages" figure is entirely absent from the site.

A teammate making this claim would have no visual on the website to support it.

---

### Claim 8: "Language much easier to understand"
**Rating: STRONG**

Demonstrated clearly across multiple screens:
- Dashboard: Cross-Agency Status has `plainExplanation` for each agency (e.g., "The Department of Labor confirmed the job offer meets wage requirements." vs the formal explanation)
- Roles (applicant): full eligibility wizard with plain-language yes/no items (e.g., "Your MBA meets the education bar for EB-2.", "After years of waiting, your date is finally current.")
- Roles (applicant): "What's Happening Now" plain-language narrative
- Intake: validation issues show `plainDescription` (e.g., "The company name is written differently across forms.")
- Impact: "Legal language opacity → Plain-language wizard for eligibility. Attorney basic hours: 8 → 3"
- mockData.js also contains `formFieldTranslations` with gov language vs plain language for each form field — this appears accessible via the openForm modal on the Intake screen (clicking form cards), though the modal component was not read. If the form viewer is implemented, this is additional strong support.

---

### Claim 9: "Applicants can quickly search for forms online"
**Rating: ABSENT**

There is no search-for-forms functionality or visual in the normal-mode website. The Intake screen has a "Search" icon used for "Run Pre-Submission Check" (not form search). The Filing Package panel shows 6 forms that can be clicked to view, but there is no search interface. This claim is not supported by any screen.

---

### Claim 10: "Repetitive entries eliminated through single shared form"
**Rating: STRONG**

Directly and repeatedly shown:
- Intake screen: every field tagged with sync targets, "→ N forms" badges on each field
- Auto-Sync indicator: "Changes propagate to all 7 forms instantly"
- Overview capability card: "Enter data once. Auto-populate across 6 immigration forms. — 6 forms, 1 entry"
- Impact: "Cross-form data inconsistency → Single intake syncs across 6+ forms"
- Impact: CaseBridge Approach Step 1 — "Enter Once: Shared intake populates 6+ forms automatically, eliminating re-keying errors."

---

### Claim 11: "Saves USCIS review time, ensures completeness, minimizes errors, lowers RFE risk"
**Rating: STRONG (multi-part)**

Each part:
- *Saves USCIS review time*: Implied by RFE reduction and cleaner submissions. Not stated as USCIS time saved explicitly, but the logic is present.
- *Ensures completeness*: Intake shows I-485 Filing Checklist (after validation) with 15 documents, progress bar, flagged/missing items. Stage-gated checklist in mockData covers all 4 stages.
- *Minimizes errors*: Pre-submission validation catching 3 issues, Employer Name fix propagating to 3 forms, SOC/wage mismatch flagged
- *Lowers RFE risk*: "RFE rate: 25% → <5%" appears on Overview and Impact screens

The weakest sub-claim is "saves USCIS review time" — the site focuses on the applicant/employer/attorney experience, not USCIS-side efficiency. A teammate would need to make this logical inference verbally.

---

## Best Screenshot Candidates

| Screen + State | Best For Claims |
|---|---|
| Overview (future mode) | Claims 2, 4, 10 — capability cards with "RFE rate: 25% → <5%" and "6 forms, 1 entry" visible |
| Overview (current mode) | Claim 4 — fragmented portals visual |
| Intake (after validation, employer fix active) | Claims 3, 4, 5, 10 — sync flash, issues panel, fix propagation |
| Dashboard (`?alert=deadline`) | Claim 6 — "$2,500–4,000 vs $5,000+ rush" |
| Roles (employer tab) | Claim 1 nearest proxy — $15,000–$22,000 cost breakdown table |
| Roles (applicant tab) | Claim 8 — eligibility wizard plain language |
| Impact screen | Claims 2, 6, 8, 10, 11 — all metrics in one view |

---

## Gaps and Missing Visual Support

### Gap A — "$15,000 → under $10,000 legal counsel costs" (Claim 1)
The site has no screen that shows legal counsel cost dropping from $15,000 to under $10,000. The closest number is total sponsorship cost ($15,000–$22,000) on the Roles/employer screen, and extension cost reduction (-50%, from $5,000+ to $2,500) on Dashboard and Impact. If the teammate wants to cite this number, they need either: (a) a new metric added to `mockData.js` metrics or `solvesDirect`, or (b) a careful verbal framing that ties the extension cost reduction to overall legal cost reduction.

### Gap B — "300 pages to under 100 pages" (Claim 7)
This specific metric does not exist anywhere in the codebase. It is not in mockData.js `metrics`, `solvesDirect`, or any screen. The closest supporting visual is the plain-language wizard on the Roles screen and the "Attorney basic hours: 8 → 3" metric on Impact. The teammate either sourced this from a spec or team document not reflected on the site, or it was never built. Without a screen showing it, this claim is unsupported visually.

### Gap C — "Applicants can quickly search for forms online" (Claim 9)
No form search functionality exists. The Intake screen has a pre-submission check button (uses Search icon, but it scans for inconsistencies — it does not search for forms). If this claim is about the CaseBridge form viewer (click-to-expand each form on Intake), that is more of a "view" than a "search." The claim as stated is not supported.

### Gap D — "Saves USCIS review time" (sub-claim in 11)
The site is entirely applicant/employer/attorney facing. No USCIS-side efficiency metric is shown. The logic is inferential (cleaner submissions → less adjudicator time), but no screen displays this.

### Gap E — Naming discrepancy
The applicant's name in `mockData.js` is "Krishna" (a simplified single name — comment in file says "Krishna → HPE"). The CLAUDE.md memory says "Prajwal Kulkarni." The Overview/Dashboard/Roles screens all render the name from `mockData.js` (`applicant.fullName = 'Krishna'`). If the teammate's script mentions "Prajwal Kulkarni" or any full name, there is a mismatch with what renders on screen.

---

## Summary

The normal-mode website provides strong visual support for 6 of the 11 claims (claims 2, 3, 4, 8, 10, 11) and partial support for 2 more (claims 5, 6). Two claims are entirely absent from the site (claims 7 and 9), and one claim (claim 1 — the $15k → $10k legal cost figure) is not directly supported by any screen though related cost data exists. The Impact screen is the single strongest screenshot candidate for the presentation, as it consolidates the most claims into one view. The Intake screen is the best interactive demonstration screen. If the teammate plans to narrate claims 1, 7, or 9, they will need to either add new content to the site or rely entirely on verbal delivery without pointing to a screen.
