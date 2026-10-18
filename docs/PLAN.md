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

| Milestone                             | Acceptance criteria                                                                                                                                                                                                                                             | Status   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| R1 Narrative and reasoning rules      | Author After the Flood and internal chronology; typed sequence analysis and explanation-dependent deductions; strict reference/reachability/answer validation, unique timeline solution, full pure journey and old save regressions; typecheck/lint/tests/build | Complete |
| R2 Complete playable case             | Third archive entry, local conservatory artwork, accessible sequence reconstruction and explanation selection; full UI correct/unsupported endings and retry, saved reconstruction, original-case regression; typecheck/lint/tests/build/browser checks         | Complete |
| R3 Investigation flow and atmosphere  | Contextual discovery follow-ups, board navigation for long mobile investigations, stronger deduction presentation and natural onboarding; keyboard/reduced-motion and important interaction tests; all regression checks                                        | Complete |
| R4 Browser compatibility and final QA | Run all three complete cases, both outcomes, case isolation/reset/replay/backups/legacy migration; production Chromium desktop/mobile plus Firefox/WebKit where supported, axe/keyboard/narrow layouts; investigate failures; clean install and final checks    | Complete |
| R5 Review and delivery                | Review chronology, state transitions, source and screenshots; concise README/verification/review updates, complete plan and passing commits; clean working tree, no deployment                                                                                  | Complete |

## Design and risks

**After the Flood:** a conservatory trial is deliberately waterlogged before an independent audit. A colored nutrient tracer and physical plumbing distinguish a second manual flow from an earlier legitimate test. Players reconstruct four events, then choose explanations supported by selected records. The question is how a plausible accident becomes provable sabotage and why the destroyed plants mattered.

Sequence reconstruction uses labeled native selects, source records, distinct-event validation and no timer/drag requirement. Wrong attempts have no cost. Explanation choices are optional content on new deductions; existing recipes keep their behavior. The third hint can explicitly assist with interpretation, but ordinary discovery never auto-solves it. No inference should identify opportunity before the reconstructed window. Evidence required for final proof remains reachable without optional red herrings or wrong verdicts.

Technical risks: duplicated sequence slots, premature explanations, inaccessible dynamic board content, unintended backward-save validation changes, stale progress across cases, and browser differences in focus/native controls. Cover these with pure rules, focused components and real browser journeys. Browser binaries may need installation; document actual availability and results.

## Phase 3 verification and handoff

R1 complete: Baseline typecheck/lint and all 81 tests passed. After content/rules work, typecheck/lint, all 97 tests in 21 files and production build passed. All 24 distinct timeline permutations were checked: exactly one is supported. Missing/duplicate/foreign events, wrong explanations, premature opportunity, dialogue gates, all three save/backup paths and both endings are covered. Save schema remains version 2; original migration unchanged.

R2 complete: Typecheck/lint, all 99 unit/component tests and production build passed. All 48 production Chromium desktop/mobile tests passed (2.5 minutes), including both new-case endings, unsupported explanations retaining pins, duplicate/incorrect event orders, reconstruction refresh and complete old-case journeys. Fixed an overly narrow inferred type in the new component-test harness. Added original local conservatory archive/room art.

R3 complete: Typecheck/lint, all 102 tests in 23 files, production build and all 50 Chromium desktop/mobile tests passed (2.5 minutes). Actual keyboard follow-ups select the relevant suspect, answered topics disappear, mobile board anchors focus their destinations, and established conclusions retain source links. Added concise first-room onboarding and corrected the generic field-guide/notebook wording.

R4 complete: Typecheck/lint, all 102 tests in 23 files, production build and a clean isolated npm ci (320 packages) passed. All 81 production browser tests passed in 7.8 minutes: 27 each in Chromium desktop, Chromium mobile and WebKit. Every case completed through UI with correct/unsupported endings and retry; new sequence/explanation/revelation and save review scans report zero axe violations on audited screens. Third-case replay/reset/import restores analysis, hints and pins without changing the original two saves. WebKit launches using missing Debian libraries extracted into its local /tmp bundle; its ldconfig-only check cannot see the supplied GLES library, so host validation is skipped after successful launch verification. Firefox launch fails while initializing its profile (read-only home configuration path); no Firefox gameplay tests have run. Reviewed chronology and made the report’s evaluation time and the director’s mistaken duplicate-set assumption explicit.

R5 complete: Reviewed all authored timelines, deduction prerequisites, storage boundaries, source changes and desktop/narrow screenshots. No known blocking gameplay issue remains. Updated the existing README, agent guidance, case bible, plan, verification and review summary; no extra documentation tree or runtime dependencies. Final source is the same production build verified by all 81 browser checks. Documentation-only changes checked with git diff --check.

Phase 3 complete on develop/casezero, with five passing milestone commits. No pending implementation work. Firefox gameplay, native Safari, physical devices and manual screen-reader testing remain unverified; audio and alternate proof paths are deferred. See VERIFICATION.md for actual results and README.md to run/play. No remote is configured; no hosted PR or deployment performed. Suggested Phase 4: human playtesting and difficulty tuning, broader browser/device/accessibility coverage, then authored alternate proof paths.

# Phase 4 — gameplay quality, depth and replayability

## Analysis and priorities

All three authored stories remain coherent. The main weakness is a single exact recipe for each conclusion: a logically sufficient substitute is rejected, hints insist on the canonical route, and the board displays canonical sources even if another route could establish the same fact. Many clues explain their interpretation immediately, so adding arbitrary difficulty or hiding timestamps would make play worse. Preserve the stories and source facts; improve how players test and review them.

After the Flood already requires an explanation as well as cards, but its failed-explanation feedback is generic. Interviews record claims without clearly distinguishing them from corroborated observations. Notes say “working theory” yet summaries do not show the chain of support. Endings explain the authored solution but do not review the player's actual supporting records or identify overlooked leads. “Play again” immediately discards a submitted case. The last-selected case is shared across tabs, making refresh potentially open another tab's case. These are concrete friction points; a fourth mystery, scores, random culprits, an audio system and analytics are out of scope.

| Milestone                                          | Acceptance criteria                                                                                                                                                                                                                                                                                                                                                                          | Status      |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Q1 Defensible proof paths and save compatibility   | Museum alternatives with explicit narrative justification; reusable exact proof-set rules; recorded supporting evidence; v3 migration of all valid v1/v2 investigations and completed endings, unchanged keys/backups; invalid/insufficient/ambiguous proofs rejected; typecheck/lint/unit/build                                                                                             | Complete    |
| Q2 Reasoning board, guidance and interviews        | Actual proof sources/counts shown; hints follow an attainable path without early answer reveals; contextual failure feedback; a justified physical-record alternative in Dead Air; evidence-gated statement checks in each case; pure/component/full-path regressions and browser journeys                                                                                                   | Complete    |
| Q3 Case review and intentional replay              | Endings review person/method/motive against established conclusions, show actual proof used, and optionally reveal overlooked search points only after success; reopen preserves evidence; replay requires confirmation; notebook separates working theory from proven conclusions; per-tab case restoration; save/backup/keyboard tests                                                     | Complete    |
| Q4 Human-playtest readiness and final verification | Concise practical human playtest guide with blank feedback prompts, no invented results or analytics; all three full cases/both verdicts, canonical/alternative paths, replay/reset/import/export/migration and hints; Chromium desktop/mobile, WebKit and Firefox where available; axe/reduced motion/narrow layouts; clean install/typecheck/lint/unit/build/E2E; docs and passing commits | Complete    |

## Design and boundaries

Proof alternatives are simple arrays of evidence IDs, not a new scripting engine. Exact complete sets only; adding unrelated or insufficient cards does not prove a conclusion. Existing canonical recipes remain valid. Record the actual selected proof in version 3 state; migrate old completed deductions from their former canonical requirements. Validate those older requirements before migration, so malformed old data cannot gain progress from a newly accepted route. Keep storage namespaces and backup wrapper stable.

Begin with The Quiet Hour opportunity: continuous alibis + exclusive C3 custody + timed physical access can replace the atrium attendance record. A sensor diagnostic can also replace the pedestal record in the maintenance conclusion, while its original discovery prerequisite remains intact. Then Dead Air method can use the selected-input trace + the physically spliced U4 instead of the acoustic transcript. No alternative is forced onto After the Flood; its reconstructed causal sequence remains essential. Record the reasoning in CASE_BIBLE.md and test required-path closure and both routes.

Avoid revealing undiscovered file contents in hints or end-review summaries before a successful verdict. Interview checks require both an answered topic and its supporting evidence. No scores or automatic conclusions. Human playtesting is still required to assess clarity, difficulty and enjoyment; automated and AI walkthroughs are engineering checks only.

## Verification and handoff

Started 18 October 2026, develop/casezero initially clean. Baseline typecheck/lint and all 102 tests passed.

Q1 complete: Typecheck, lint, production build and all 107 tests in 24 files passed. After adding completed-ending migration coverage, typecheck/lint and all 17 focused proof/storage/compatibility tests passed. Original and alternate museum proofs record their actual sources; insufficient, duplicate, ambiguous and circular alternatives reject. Valid v1/v2 partial and completed saves migrate to v3; malformed older proofs cannot gain progress from a new alternative. No deployment or external messages. Next: Q2 board, guidance and interviews.


Q2 complete: Typecheck/lint, all 113 tests in 25 files, production build and seven desktop Chromium browser checks passed (42.1 seconds). Both new alternative routes complete without the newly optional record; canonical journeys and both outcomes remain covered. The board reviews actual sources, hints choose an available route, four evidence-gated interview reviews distinguish conflicts/limited scope/corroboration, and wrong explanations address the specific inference. Updated the full guided-path regression to follow its suggested route instead of hard-coding canonical cards. Next: Q3 case review, replay and per-tab restoration.


Q3 complete: Typecheck/lint, all 116 tests in 26 files, production build and all 12 focused Chromium desktop/mobile browser checks passed (56.2 seconds). End review uses actual supporting records and identifies unsupported account dimensions; optional search-point summaries appear only after success. Reopen preserves progress, replay cancellation preserves the submitted case and keyboard focus, and confirmation starts fresh. Independent tabs now restore their own selected case. Zero axe violations on the new review screen. Firefox profile/cache and container namespace failures were diagnosed separately; a temporary configuration/cache plus test-only content-sandbox override now renders a page. Next: Q4 full engine matrix, review and human playtest guide.


Q4 complete: Final typecheck/lint, all 116 unit/component tests in 26 files and production build passed. Isolated clean npm ci installed 320 packages. All 128 production browser tests passed in 11.3 minutes: 32 each in Firefox, WebKit, Chromium desktop and mobile Chromium emulation; no failures, retries or skips. Zero axe violations on audited screens, including new case reviews and statement/source checks in all three cases. Keyboard, focus, reduced motion and 320px interactions pass. Every case completes through both outcomes; alternative paths, prerequisites, hint-led progression, migration, independent tabs, replay/reset and actual backup downloads/uploads pass.

Visual review covered desktop/320px reasoning review, the board and mobile statement feedback. Fixed retained bottom scroll on section navigation and added position/focus regressions. An initial matrix was intentionally interrupted after 22 Firefox passes for that fix; only the rebuilt complete 128-test run is reported as final. Firefox configuration/cache and namespace restrictions were resolved with temporary test-only environment settings; WebKit used extracted Debian libraries. Exact setup and limits are in VERIFICATION.md.

Phase 4 complete on develop/casezero with four verified milestone commits. No pending implementation work or known blocking gameplay issue. Added one practical human playtest guide; updated existing README, agent guidance, case bible, plan, review and verification. No new mystery, runtime dependency, analytics service or deployment. No remote is configured, so REVIEW.md prepares the local review handoff instead of a hosted PR. Human sessions, physical devices, native Safari and manual screen-reader use remain unverified. Next priority: real first-time playtesting and evidence-led difficulty/hint tuning, then actual device/accessibility sessions.

# Phase 5 — playtest readiness and final polish

## Product review and priorities

The three stories, exact proof alternatives, progression gates and v3 state model remain appropriate. Preserve every case, clue ID, solution, save key and migration. Baseline typecheck/lint and all 116 tests pass. The main opportunities are interaction/recovery rather than new mechanics:

- Failed writes only change a footer indicator; a player can miss it on a long board. A malformed/unreadable live storage update currently replaces the active case with a fresh state. Failed reset removal can leave old progress on disk without explaining that it may return.
- The board's thread anchor is below explanation choices, so a mobile shortcut can skip required reasoning. Pins hidden by filters cannot be removed individually from the tray. Discovering a file requires finding its inventory card again to pin it. Timeline source records and event order require repeated long scrolling; several mobile inputs use text below 16px, which can trigger Safari zoom.
- Dialog focus is trapped, but background content is not inert for assistive navigation. Import lacks an explicit reading state and focused return from review. The rejected ending describes a reopening action that is only labeled that way after success.
- Feedback requires leaving the game and creating a report manually. No deployment guide explains how workspace files reach GitHub/Vercel, which URL retains phone saves, or the approval boundary. Standard Next.js build/start already work; pin the tested Node major and ignore local hosting artifacts rather than adding hosting infrastructure.

| Milestone | Acceptance criteria | Status |
| --- | --- | --- |
| S1 Visible save recovery | Prominent write-failure warning and retry save latest in-memory state, including reset tombstones; invalid/unreadable live updates preserve current/cached progress; import reading/retry/back-focus states work; regression tests, typecheck/lint/build | Complete |
| S2 Investigation and accessible controls | Thread shortcut includes explanation; direct unpin and filter reset; pin from discovered files without changing proof rules; timeline source/order shortcuts and placement feedback; touch-size/input refinements; modal background isolation; keyboard/component/mobile regressions, typecheck/lint/build | Complete |
| S3 Tester handoff and hosting readiness | Local-only feedback form with copy/download/manual fallback and no automatic notes/evidence disclosure; recoverable production error screen and explicit boot status; tested Node pinned, hosting artifacts ignored; practical phone/GitHub/Vercel instructions and manual checklist; no external writes; tests/typecheck/lint/build | Complete |
| S4 Final product verification | All three complete mysteries and both outcomes, alternatives, hints, saves/migration/replay/backups, new recovery/feedback/touch paths; production Chromium desktop/mobile, Firefox/WebKit where supported; axe/keyboard/reduced-motion/320px checks; clean install/build and final docs/commits | In progress |

## Boundaries and risks

No fourth mystery, random solution, analytics, new runtime dependency, schema change or speculative rewrite. Keep unsubmitted analysis temporary and say so. Feedback stays on the device until the tester deliberately copies/downloads and shares it; never bundle notebook text, raw saves or discovered clue contents. A real phone, native Safari and human playtesting remain future verification, not claims from emulation. Deployment instructions must distinguish the current local branch from an existing hosted repository; creating/pushing/deploying remains explicitly unapproved. If interrupted, finish the active milestone's checks, update this log and continue in order.

## Verification log

Started 18 October 2026 on clean develop/casezero. Baseline: typecheck/lint and all 116 tests passed. S1 implementation next.

S1 complete: Typecheck/lint (no warnings), all 121 tests in 26 files and production build passed. Six focused production Chromium browser checks passed (15.8s), including real cross-tab malformed updates, quota recovery, prior save/reset and backup regressions. Failed resets preserve in-memory state through remounts and can write a fresh snapshot on retry. Pending import, same-file retry and review focus are covered. Corrected stale-element and overly broad alert selectors in the new tests; no meaningful checks removed.

S2 complete: Typecheck/lint, all 124 tests in 27 files, production build and all 12 focused desktop/mobile Chromium browser checks passed (39.1s). Discovery-file pinning, hidden-pin removal, filter reset, explanation-aware thread anchors and timeline source/order shortcuts work; narrow inputs use 16px text and touch targets are at least 44px. Dialogs isolate background branches and restore prior inertness. Browser checks verify native inertness and blocked focus directly because role queries still locate inert elements. Full third-case reconstruction/both outcomes and existing follow-up navigation remain passing; zero axe violations in the audited new thread layout.

S3 complete: Typecheck/lint, all 126 tests in 28 files, production build, isolated npm ci (320 packages) and all 10 focused desktop/mobile production checks passed (20.6s). Reports download actual text and omit private notes/evidence content; denied clipboard access opens and selects the report even if its preview was collapsed (a new failing regression identified and fixed). Blocking an ending chunk reaches the real production error boundary, and reloading restores the submitted account. Node 24.x is pinned without dependency updates; no environment variables are required. Added GitHub/Vercel/phone handoff instructions and updated the existing manual checklist. Official Vercel documentation confirmed 24.x support. No repository, remote, push or deployment was created. Next: S4 complete matrix and visual/hosting review.
