# Proposed pull request: Expand CaseZero with Dead Air and independent investigations

CaseZero's single-case assumptions prevented a growing archive and left players with repetitive discovery and easily lost board selections. This phase preserves The Quiet Hour and adds Dead Air: a complete coastal-radio mystery with fourteen clues, four new suspects, evidence-led interviews, clock calibration, document comparison and supported correct/incorrect outcomes.

A typed case registry now drives the reusable interface and pure rules. Cases have independent saves, reset/replay and progress cards. Original version 1 saves migrate automatically. Optional three-stage hints help with reachable leads; persistent pins, question focus, evidence search and retained failed threads make the board easier to investigate. Reviewed JSON export/import moves one case safely without affecting the others. Local artwork, case status and keyboard focus refinements complete the interface.

Validation covers content references, reachability, analysis rewards and progression invariants. The session cache preserves progress through case switching when browser storage fails and respects incoming cross-tab changes. No runtime services or dependencies were added. Ending data loads after a submitted account; client source remains inspectable.

Actual checks and limitations are recorded in [VERIFICATION.md](VERIFICATION.md). Milestone history is in PLAN.md. CASE_BIBLE.md contains both exact solutions and should be read only when ready for spoilers.

Work remains on `develop/casezero` with passing milestone commits. No remote repository is configured, so no hosted pull request was opened. No deployment was performed.
