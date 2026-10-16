# CaseZero implementation plan

One complete deterministic museum mystery. Isolated repository on `develop/casezero`. No external services or deployment.

| Milestone            | Acceptance criteria                                                                                                                       | Status   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1 Foundation         | Next.js App Router, typed content/rules, reference and reachability validation; install, typecheck, tests, build                          | Complete |
| 2 Core interface     | Home, case selection, briefing, navigation and responsive shell; navigation tests                                                         | Complete |
| 3 Evidence           | Four locations, sixteen clues, locks, inventory, details and board; discovery tests                                                       | Complete |
| 4 Interviews         | Four profiles, evidence/deduction branches and conversation history; condition tests                                                      | Complete |
| 5 Verdict            | Four deductions, accusation prerequisites, two outcomes and replay; journey tests                                                         | Complete |
| 6 Persistence/polish | Versioned validated save, Continue/New Game/Reset, notebook, hints, accessibility; storage tests                                          | Complete |
| 7 Final QA           | Typecheck, lint, build, unit/component and supported browser tests; correct/incorrect journeys, refresh/reset/mobile; verification report | Complete |

## Architecture and risks

Content in `src/game/content.ts`, pure rules in `engine.ts`, React UI and local storage adapter. Internal bible never rendered. Verdict evaluation module loaded upon submission; client source remains inspectable.

- Timeline contradictions: fixed timestamps and independent facts supporting every conclusion.
- Soft locks: closure-based reachability checks and executable full journey.
- Spoilers: neutral IDs; no solution in early UI, metadata, filenames or logs.
- Corrupt/storage-denied saves: validated schema/dependencies, recovery and in-memory fallback.
- Browser tooling: install and run when available; document actual limitations.
- Mobile/keyboard: native controls, focus-managed dialogs, board selection without mandatory dragging.

## Verification log

M1: npm install succeeded (Node 24.19, Next 16.4, React 19.3). Typecheck and ESLint passed; 4 integrity tests passed; production build passed. Initial sandbox build could not bind Turbopack’s worker port; rerun with permitted network access passed. ESLint upgraded to supported v10.

M2: Typecheck, lint and all 6 unit/component tests passed. Chromium installed. Both desktop and mobile Playwright navigation tests passed, including keyboard modal focus, Escape, and document overflow. Browser QA exposed blocked Next dev HMR on loopback; explicitly allowing 127.0.0.1 fixed hydration/navigation.

M3: Typecheck and lint passed; all 10 unit/component tests and all 4 desktop/mobile browser tests passed. Verified locked evidence, single discovery, inventory filtering, detail dialogs and keyboard/touch pin-and-compare board.

M4: All 21 unit/component tests and all 6 desktop/mobile Playwright tests passed; typecheck and lint passed. Every conditional branch tested with its complete requirements and each missing dependency. Both interview-driven evidence paths reach the dispatch record. Corrected an ambiguous test query that matched both the live answer and transcript.

M5: All 32 unit/component and all 10 browser tests passed, plus typecheck/lint. Full desktop/mobile journeys collect all 16 clues, interview all suspects, test an invalid combination, establish four conclusions, recover the seal and reach the correct ending. Incorrect accusation retries and replay pass. Unit tests also reject correct-suspect/wrong-method and wrong-motive accounts.

M6: Typecheck/lint and all 41 unit/component tests passed. All 16 desktop/mobile browser tests passed on a stable rerun, including ending refresh, partial restoration, notebook, New Game, Reset, unsupported saves, storage denial and two-tab synchronization. A prior browser run was interrupted by development hot reload during a replay; the unchanged stable rerun passed. Added focus handling, usable mobile evidence cards and an empty gallery display illustration.

M7: Clean final npm ci succeeded in an isolated directory. Final typecheck, lint and production build passed; 41 unit/component tests passed and all 20 Playwright tests passed against the production server (44.1s). Audited entry/guide/case/briefing/investigation screens report zero axe WCAG A/AA violations with stable reduced-motion rendering; keyboard and 320px checks pass. Source formatted and entry screens split into focused components. Fixed mobile tray obstruction and ESLint preset peer mismatch. README, verification report and PR review material completed.

## Handoff

MVP complete. No pending implementation work. See README.md to run/play and docs/VERIFICATION.md for QA scope and limits. Review the committed develop/casezero branch and docs/REVIEW.md. No remote repository is configured; a hosted PR requires a remote. No public deployment performed.

# Phase 2 — a case library and deeper investigations

## Review and priorities

Baseline on 16 October 2026: existing typecheck/lint and all 41 unit/component tests pass. The original narrative, immutable rules, version validation and accessible components are sound. Limitations: engine/UI/save key assume a single case; every discovery is a button and every deduction has three clues; the notebook's single-step hint is explicit; switching views loses pinned evidence; failed combinations discard the whole thread. A second case must vary the reasoning, not only rename museum objects.

Preserve the original case's IDs, story, outcomes, selectors where practical and saved progress. Keep content and rules separate; add no runtime services or dependencies.

| Phase 2 milestone                        | Acceptance criteria                                                                                                                                                                                                                                     | Status      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| P1 Case model and compatibility          | Typed case registry and case-aware pure rules; state v2 with validated migration of original v1 saves; graph/recipe integrity checks; old tests, new migration tests, typecheck/lint/build pass                                                         | Complete |
| P2 Case library and independent progress | Data-driven briefing/UI, per-case save/reset/replay, case progress cards and navigation; original experience works; isolation and switching tests pass                                                                                                  | Pending     |
| P3 Dead Air and interactive analysis     | Complete new radio-station case with 4 suspects, 4 locations, 14 clues, two evidence-analysis activities, variable-size deductions and coherent outcomes; reference/reachability, dialogue and full-path tests pass                                     | Pending     |
| P4 Hints and investigation flow          | Optional three-stage hints for the current obstacle, saved independently; persistent pins, targeted deduction work, useful failed-thread feedback and mobile refinement; focused regression tests pass                                                  | Pending     |
| P5 Portable saves and finish             | Validated export/import with review, case mismatch protection and no effect on other cases; case-specific artwork and updated concise instructions; backup and UI tests pass                                                                            | Pending     |
| P6 Complete QA and handoff               | Both cases complete via UI, incorrect verdicts/retry, independent refresh/reset/replay, v1 migration, hint/analysis/backup flows, desktop/mobile/keyboard/axe; clean install, typecheck/lint/unit/build/E2E; commit and update verification/review docs | Pending     |

## Design and risks

- `CaseDefinition` holds player-facing content and presentation metadata. Registry selection is explicit; no mutable global case. Outcomes and analysis answers remain separate from rendered metadata, with no claim of client-source secrecy.
- State v2 adds analysis completions, hint stages and pinned evidence. Original save namespace is retained and v1 saves normalize without losing evidence, notes, answers, deductions or endings. Each additional case has its own key. Reset affects only the selected case.
- New case: **Dead Air**, a forged coastal-radio closure bulletin. The important time is when a recording was queued, not when it aired. A clock correction and a comparison of a sponsor assurance with a contract rider produce evidence; normal searches and evidence-led interviews remain available. Two- and three-clue conclusions avoid a repeated fixed recipe.
- Verify all content by reference checks and reachability closure including analysis prerequisites, plus explicit engine/UI solution paths. There are no timers, consumables or irreversible dialogue choices.
- Progressive hints start with a direction, then a reasoning prompt, then a specific lead. Later stages require deliberate reveal and do not name the culprit prematurely. Export/import validates the same invariants as normal storage and reviews replacements before changing progress.
- Prioritize a complete second case and saved-game compatibility over audio or extra systems. Atmospheric audio is deferred; it adds less investigation value than portable saves and analysis activities.

## Phase 2 verification log

P1 complete: TypeScript, ESLint, all 45 unit/component tests and production build passed. Original 41 tests remain intact. Added v1 partial/ending migration, v2 field validation, registry integrity and ambiguous-recipe coverage.

## Phase 2 handoff

Next: P2 case-aware presentation, per-case storage and library navigation. Continue on develop/casezero; no deployment or external writes.
