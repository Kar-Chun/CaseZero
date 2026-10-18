# CaseZero Phase 4 verification

Verified on 18 October 2026 in Linux with Node 24.19.0, npm 11.9.0, Next.js 16.4.0 and React 19.3.0. Prior milestone results remain in PLAN.md.

| Check                    | Actual result                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Clean install            | Isolated `npm ci` succeeded with the final manifest/lockfile; 320 packages installed                            |
| TypeScript               | `npm run typecheck` passed                                                                                      |
| ESLint                   | `npm run lint` passed                                                                                           |
| Unit/component tests     | `npm test`: 116 passed in 26 files                                                                              |
| Production build         | `npm run build` passed; App Router pages prerendered                                                            |
| Production browser suite | 128 passed in 11.3 minutes: 32 each in desktop Chromium, mobile Chromium emulation, Firefox and WebKit          |
| Accessibility            | Zero axe WCAG 2/2.1 A/AA violations on audited screens; keyboard, focus, reduced motion and 320px checks passed |
| Repository               | Existing `develop/casezero` branch; four verified milestone commits; `git diff --check` passed                  |

## Gameplay and compatibility

All three cases retain their original story, solution and canonical proof. Production journeys perform searches, evidence-dependent interviews, analysis, deductions, final-proof collection and both correct/unsupported accusations with preserved retry. The museum also completes without the attendance record, using timed access, continuous alibis and credential custody; its sensor record can support the maintenance conclusion. Dead Air also completes without the acoustic transcript, using selected-input and physical-splice records. After the Flood retains its sequence and explanation requirements. There is no fourth case, score or randomized culprit.

Pure tests reject every insufficient subset of the museum opportunity proofs, duplicates, unrelated extra cards, unsupported radio connections and incorrect explanations. Proof revision replaces only the supporting set, without duplicating conclusions. Content validation checks every reference, exact-set ambiguity, monotonic reachability and independently circular alternative proofs. Full hint-led journeys complete all three cases without demanding optional canonical evidence once another route is available. Every conditional interview retains its dependency tests; all 24 distinct conservatory event orders still have exactly one supported answer.

Version 3 stores the actual proof used for each conclusion. Valid v1 museum and v2 partial/completed saves migrate using the former canonical requirements, including correct and incorrect submitted accounts for every v2 case. Newly added alternatives cannot make a malformed older save valid. Missing, foreign, duplicate, unowned or inconsistent proof data rejects. Existing save namespaces and backup wrapper remain unchanged. Import/export round trips proof-bearing endings; existing browser tests use actual downloads/uploads and confirm review before replacement. Invalid, unsupported, oversized and foreign-case imports leave progress intact.

Independent cases retain notes, hints, pins, analysis and conclusions through switching, refresh, replay/reset and backup replacement. Tabs retain their own selected case using session storage, with a fallback to the original shared preference. Same-case edits still synchronize the latest saved snapshot, without merging concurrent changes. Denied/quota storage retains in-memory play and case switching; that unsaved session cannot survive refresh.

End review compares person/method/motive with the established conclusions and actual source titles. Overlooked search points appear only after a successful verdict and never auto-collect evidence or expose undiscovered file contents. Reopen clears only the submitted account; replay requires confirmation. Tests check cancellation, focus return, resumed proof preservation and fresh replay. Statement reviews require both a heard claim and the relevant records; tests distinguish a conflicting alibi, limited-scope alibi and corroborated statement. Narrow-screen tests open source files with the keyboard and return focus correctly.

## Issues addressed

- Exact canonical recipes rejected sufficient substitutes; three authored alternatives now use the same complete-set validation and conclusion.
- Hints and source summaries assumed canonical evidence. They now select an attainable route and show actual recorded support. The guided-walkthrough regression was updated to follow that route; no meaningful test was removed.
- Generic explanation failures did not identify the unsupported inference. Conservatory responses now point to the conflicting physical/timing fact, preserving the player's thread for revision.
- Recorded statements appeared without a corroboration distinction. Evidence-gated reviews separate claims from conflict, consistency and limited scope without treating motive as proof.
- Endings offered no review of the player's reasoning and replay immediately erased progress. Review, optional overlooked leads, reopening and confirmed replay now distinguish those intentions.
- A shared last-selected-case preference could open another tab's investigation after refresh. Per-tab restoration fixes this while preserving the old fallback.
- Visual review found that section changes could retain a long ending's bottom scroll position. Navigation now immediately returns to the top and focuses the new heading; the browser regression checks both position and focus. This does not add motion or change native board shortcuts.

## Browser setup and verification limits

The final production run enabled all four configured projects with `CASEZERO_CROSS_BROWSER=1 CASEZERO_PRODUCTION=1`. Browser binaries were installed under `/tmp/casezero-browsers`. WebKit's missing Debian libraries were SHA-verified and extracted into its local bundle without replacing existing files. Playwright's ldconfig-only check cannot see the supplied GLES library, so host validation was skipped after a successful launch probe. On a normal supported Linux machine, use `npx playwright install-deps` instead.

Firefox's initial profile error was environmental. Tracing identified read-only configuration and cache paths; assigning temporary `XDG_CONFIG_HOME` and `XDG_CACHE_HOME` fixed initialization. Its content process then failed writing `/proc/self/uid_map` in this container. The test-only `MOZ_DISABLE_CONTENT_SANDBOX=1` setting enabled actual rendering and gameplay testing inside the existing workspace isolation. No browser-security setting was added to the application or Playwright configuration. All 32 actual Firefox tests passed with this environment setup.

An initial matrix was intentionally stopped after 22 successful Firefox tests to fix the visually discovered scroll issue; two in-flight tests were interrupted and 104 had not run. Those results are not counted as a completed suite. The rebuilt production run completed all 128 tests without failures, retries or skips.

Screenshots of desktop review, the 320px reasoning review and the board were visually inspected. Monitored journeys report no application console/page errors. Browser emulation and Linux WebKit do not establish native Safari or physical-device support. No physical devices, manual screen-reader audit or human playtesting sessions were performed. Axe checks cover representative screens, not complete accessibility conformance.

## Handoff

No known blocking gameplay bug remains. Fixed narratives limit replay to exploring reasoning and missed context; alternate routes are authored, not unrestricted free-form deductions. Unsubmitted explanations, view position, filters and question focus remain temporary. Solutions remain inspectable in client source. No deployment was performed, and no remote is configured for a hosted pull request; REVIEW.md is the review summary.

The next priority is real human sessions using PLAYTESTING.md: assess discoverability, reasoning satisfaction, hint pacing and enjoyment, then tune repeated friction. Follow with physical phones, native Safari and screen-reader users. Do not infer those results from automated walkthroughs.
