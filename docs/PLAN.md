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

| Phase 2 milestone                        | Acceptance criteria                                                                                                                                                                                                                                     | Status   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| P1 Case model and compatibility          | Typed case registry and case-aware pure rules; state v2 with validated migration of original v1 saves; graph/recipe integrity checks; old tests, new migration tests, typecheck/lint/build pass                                                         | Complete |
| P2 Case library and independent progress | Data-driven briefing/UI, per-case save/reset/replay, case progress cards and navigation; original experience works; isolation and switching tests pass                                                                                                  | Complete |
| P3 Dead Air and interactive analysis     | Complete new radio-station case with 4 suspects, 4 locations, 14 clues, two evidence-analysis activities, variable-size deductions and coherent outcomes; reference/reachability, dialogue and full-path tests pass                                     | Complete |
| P4 Hints and investigation flow          | Optional three-stage hints for the current obstacle, saved independently; persistent pins, targeted deduction work, useful failed-thread feedback and mobile refinement; focused regression tests pass                                                  | Complete |
| P5 Portable saves and finish             | Validated export/import with review, case mismatch protection and no effect on other cases; case-specific artwork and updated concise instructions; backup and UI tests pass                                                                            | Complete |
| P6 Complete QA and handoff               | Both cases complete via UI, incorrect verdicts/retry, independent refresh/reset/replay, v1 migration, hint/analysis/backup flows, desktop/mobile/keyboard/axe; clean install, typecheck/lint/unit/build/E2E; commit and update verification/review docs | Complete |

## Design and risks

- `CaseDefinition` holds player-facing content and presentation metadata. Registry selection is explicit; no mutable global case. Outcomes and analysis answers remain separate from rendered metadata, with no claim of client-source secrecy.
- State v2 adds analysis completions, hint stages and pinned evidence. Original save namespace is retained and v1 saves normalize without losing evidence, notes, answers, deductions or endings. Each additional case has its own key. Reset affects only the selected case.
- New case: **Dead Air**, a forged coastal-radio closure bulletin. The important time is when a recording was queued, not when it aired. A clock correction and a comparison of a sponsor assurance with a contract rider produce evidence; normal searches and evidence-led interviews remain available. Two- and three-clue conclusions avoid a repeated fixed recipe.
- Verify all content by reference checks and reachability closure including analysis prerequisites, plus explicit engine/UI solution paths. There are no timers, consumables or irreversible dialogue choices.
- Progressive hints start with a direction, then a reasoning prompt, then a specific lead. Later stages require deliberate reveal and do not name the culprit prematurely. Export/import validates the same invariants as normal storage and reviews replacements before changing progress.
- Prioritize a complete second case and saved-game compatibility over audio or extra systems. Atmospheric audio is deferred; it adds less investigation value than portable saves and analysis activities.

## Phase 2 verification log

P1 complete: TypeScript, ESLint, all 45 unit/component tests and production build passed. Original 41 tests remain intact. Added v1 partial/ending migration, v2 field validation, registry integrity and ambiguous-recipe coverage.

P2 complete: Typecheck, lint, production build and all 48 unit/component tests passed. All 20 original production Playwright tests passed on desktop/mobile, including both original endings, refresh/reset, storage denial, cross-tab updates and accessibility. Per-case save isolation and wrong-key rejection are covered with an alternate-case fixture.

P3 complete: TypeScript, lint, production build and all 64 unit/component tests passed. Both authored cases passed the 26-test production browser suite. Narrative review then added an explicit earlier-window prerequisite to the new identity conclusion; all 6 affected radio/switching browser checks were rerun and passed. New content has 14 clues, 12 interview branches, two distinct analyses, mixed-size deductions, case-specific rooms and two supported outcomes.

P4 complete: Typecheck, lint, production build, all 71 unit/component tests and all 32 production desktop/mobile browser tests passed. Added three-stage optional hints with independent saved progress and full guided-path reachability tests. Board pins survive navigation/refresh, failed threads remain selected, and question focus/search work. Hint follow actions select the relevant interview subject.

P5 complete: Typecheck, lint, production build, all 79 unit/component tests and all 36 production desktop/mobile browser tests passed. Actual JSON downloads and file uploads restore notes, hints and pins after review; invalid, oversized, unsupported and foreign-case imports leave progress unchanged. Fixed valid long-note serialization, stale file reads and hidden/dynamic modal focus. Added radio artwork and accurate closed/review-required case badges.

P6 complete: Clean npm ci passed in an isolated directory (320 packages). Final typecheck, lint, all 81 tests in 20 files, production build and all 44 production browser tests passed (22 desktop / 22 mobile; 2.2 minutes). New analyses/import have zero axe violations on audited screens; keyboard, reduced motion, 320px, real v1 migration, independent tabs and storage-denied switching pass. Fixed denied/quota session loss on keyed case changes, with cache invalidation for incoming saves. Visually reviewed archive, radio room and narrow board; an additional desktop focus/skip-link check passed. Updated README, verification and review material. No known blocking issue remains.

## Phase 2 handoff

Phase 2 complete; all six milestones committed on develop/casezero. No pending implementation work. Run/play instructions are in README.md; actual checks and limits in VERIFICATION.md, review summary in REVIEW.md. No remote is configured, so no hosted pull request was opened. No deployment or external writes performed. Suggested next work: additional authored cases, optional audio and browser/device coverage.

# Phase 3 — reasoning, consequences and a third case

## Review and priorities

The existing three-layer design (authored content, pure rules, reusable UI) remains appropriate. Phase 2 fixed independent saves and useful guidance. Its main gameplay limit is that a correct set of cards automatically supplies the interpretation; analysis is confined to two activities in one case. The board also asks narrow-screen players to repeatedly scroll past four questions. Discovery files do not surface newly available follow-up interviews. The field guide still assumes every case recovers an object. Fixed authored solutions support fresh play rather than randomized replay; preserve that deliberate narrative consistency.

Keep the two existing cases, IDs, schema version 2 and original v1 migration unchanged. Add content and optional deduction interpretation rules without new persisted fields. Finished analysis/deductions already represent these actions. Preserve old backups and save keys. No new runtime dependencies or services. Audio is deferred in favor of stronger reasoning and clearer story feedback.

| Milestone                             | Acceptance criteria                                                                                                                                                                                                                                             | Status      |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| R1 Narrative and reasoning rules      | Author After the Flood and internal chronology; typed sequence analysis and explanation-dependent deductions; strict reference/reachability/answer validation, unique timeline solution, full pure journey and old save regressions; typecheck/lint/tests/build | Complete |
| R2 Complete playable case             | Third archive entry, local conservatory artwork, accessible sequence reconstruction and explanation selection; full UI correct/unsupported endings and retry, saved reconstruction, original-case regression; typecheck/lint/tests/build/browser checks         | In progress     |
| R3 Investigation flow and atmosphere  | Contextual discovery follow-ups, board navigation for long mobile investigations, stronger deduction presentation and natural onboarding; keyboard/reduced-motion and important interaction tests; all regression checks                                        | Pending     |
| R4 Browser compatibility and final QA | Run all three complete cases, both outcomes, case isolation/reset/replay/backups/legacy migration; production Chromium desktop/mobile plus Firefox/WebKit where supported, axe/keyboard/narrow layouts; investigate failures; clean install and final checks    | Pending     |
| R5 Review and delivery                | Review chronology, state transitions, source and screenshots; concise README/verification/review updates, complete plan and passing commits; clean working tree, no deployment                                                                                  | Pending     |

## Design and risks

**After the Flood:** a conservatory trial is deliberately waterlogged before an independent audit. A colored nutrient tracer and physical plumbing distinguish a second manual flow from an earlier legitimate test. Players reconstruct four events, then choose explanations supported by selected records. The question is how a plausible accident becomes provable sabotage and why the destroyed plants mattered.

Sequence reconstruction uses labeled native selects, source records, distinct-event validation and no timer/drag requirement. Wrong attempts have no cost. Explanation choices are optional content on new deductions; existing recipes keep their behavior. The third hint can explicitly assist with interpretation, but ordinary discovery never auto-solves it. No inference should identify opportunity before the reconstructed window. Evidence required for final proof remains reachable without optional red herrings or wrong verdicts.

Technical risks: duplicated sequence slots, premature explanations, inaccessible dynamic board content, unintended backward-save validation changes, stale progress across cases, and browser differences in focus/native controls. Cover these with pure rules, focused components and real browser journeys. Browser binaries may need installation; document actual availability and results.

## Phase 3 verification and handoff

R1 complete: Baseline typecheck/lint and all 81 tests passed. After content/rules work, typecheck/lint, all 97 tests in 21 files and production build passed. All 24 distinct timeline permutations were checked: exactly one is supported. Missing/duplicate/foreign events, wrong explanations, premature opportunity, dialogue gates, all three save/backup paths and both endings are covered. Save schema remains version 2; original migration unchanged.

Next: R2 playable sequence/explanation UI and local case artwork. Chromium, Firefox and WebKit binaries downloaded; WebKit reports missing host libraries, to investigate in R4. No deployment or external writes.
