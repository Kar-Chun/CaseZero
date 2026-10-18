# CaseZero Phase 5 verification

Verified on 18 October 2026 in Linux, Node 24.19.0, npm 11.9.0, Next.js 16.4.0 and React 19.3.0. Milestone results and earlier phase history remain in PLAN.md.

| Check                    | Actual result                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Clean install            | Isolated `npm ci` succeeded with the final manifest/lockfile; 320 packages                                                                                                     |
| TypeScript               | `npm run typecheck` passed                                                                                                                                                     |
| ESLint                   | `npm run lint` passed without warnings                                                                                                                                         |
| Unit/component tests     | `npm test`: 126 passed in 28 files                                                                                                                                             |
| Production build/start   | `npm run build` passed; normal `npm start` served the reviewed game                                                                                                            |
| Production browser suite | 148 passed in 12.1 minutes: 37 each in Firefox, WebKit, desktop Chromium and mobile Chromium emulation                                                                         |
| Accessibility            | Zero axe WCAG 2/2.1 A/AA violations on audited states, including save warnings, reasoning, feedback and production recovery; keyboard/focus/reduced-motion/320px checks passed |
| Repository               | Existing develop/casezero branch; four verified milestone commits; clean tree and git diff --check                                                                             |

## Product and regression scope

All three authored mysteries, solutions, clue IDs, proof alternatives and deduction rules are unchanged. State remains v3, with existing v1/v2 migration and per-case keys. Production journeys cover every mystery from searches through interviews, deductions, final evidence and correct/unsupported accusations; original and alternate museum/radio paths, hint stages, case review and retry remain exercised. Existing meaningful tests were preserved. Incomplete/duplicate timeline events and insufficient/invalid proof sets still reject.

New investigation checks cover pinning from an open file, synchronized inventory pins, direct removal of a pin hidden by a filter, filter reset/focus, and the thread destination containing explanation choices. At 320px, source/order shortcuts retain an unfinished reconstruction, native inputs have 16px text, and selected-event captions show full labels without changing accessible field names. The mobile Chromium project performs an actual emulated `tap` on the file pin control. This is browser emulation, not a physical-phone result.

Save checks cover notes, pins, hints, completed analyses, proofs, endings, independent cases, reload, reset, replay and actual backup downloads/uploads. Invalid, unsupported, oversized, impossible and foreign-case imports preserve current progress. New tests simulate write failure, malformed/unreadable live updates, reset removal failure, failed-reset remounts and explicit retry of the latest snapshot. Active/cached investigations survive invalid updates; a fresh reset snapshot prevents old progress from returning when writing becomes available. Successful writes clear stale warnings. Import tests cover pending reads, stale requests, the same file being retried and focus returning from review.

Feedback tests verify an explicit context allowlist for all three cases: case/view/build and progress counts, plus voluntarily entered text. Notebook text, clue contents, raw saves and accusation choices are excluded. Successful clipboard API use is tested with a component stub; browser checks intentionally deny access and verify that a collapsed preview reopens, receives focus and permits manual selection. Actual downloaded text matches the reviewed report. No report is automatically sent, and feedback does not alter or persist game state. All report text in tests/screenshots is synthetic fixture input, not human feedback.

Production fault injection deliberately blocks a lazy ending JavaScript file. The real Next.js error boundary displays recovery guidance; restoring connectivity and reloading restores the submitted account. This test intentionally generates network/chunk errors. Regular monitored journeys assert no unexpected page/application console errors; the intentional failure is not presented as a normal clean-network journey.

## Issues found and fixed

- Write failures were easy to miss at a long page's footer. A prominent warning and explicit retry now keep recovery actionable.
- Invalid/unreadable live updates replaced a good in-memory investigation with fresh state. They now preserve live/cached snapshots and warn before a refresh could lose them.
- Failed resets could leave an old disk save without clear recovery. A fresh snapshot fallback, remount-aware warning and retry keep that intent consistent.
- Import reading, repeated-file retry and return from preview lacked clear feedback/focus. These now have meaningful states and regression coverage.
- The pinned-thread shortcut skipped explanation choices; hidden pins required finding cards again. The destination now includes reasoning controls, and each pin can be removed in place.
- Discovery-to-board pinning required unnecessary rediscovery in the inventory. Files now offer the same pin operation with limit feedback.
- Dialogs trapped keyboard focus but left background branches active for assistive navigation. Native inert isolation now blocks background focus and restores previous states on close.
- Visual review found truncated mobile timeline values and dismissal controls offscreen in long dialogs. Full captions and sticky dismissal address both. Existing tests caught a caption changing the field's label; moving it outside the label preserved the original accessible names.
- Clipboard denial after collapsing the report hid the manual fallback. A failing regression now verifies automatic reopening and selection.
- Production loading failures had generic recovery; the new error screen explains the saved-game recovery point without exposing error internals or promising recovery of unsaved memory.

## Hosting and repository readiness

The application builds and runs as a standard Next.js App Router project. Browser storage and local assets need no database, authentication, external API, persistent server disk or mandatory environment variables. Package engines now pin tested Node 24.x, matching the existing .nvmrc; dependency versions did not change. Optional Vercel commit metadata exposes only a validated seven-character revision in feedback. Local .vercel artifacts, environment files, node_modules, .next and test reports are ignored; none were found tracked.

DEPLOYMENT.md gives a phone-only GitHub/Vercel/Safari handoff, exact framework/root/build/runtime settings, stable-origin save guidance, Files import/export, access/protection caveats and a same-Wi-Fi computer alternative. Official Vercel documentation confirmed Node 24.x support. **No external repository was created, remote added, code pushed or app deployed. No live iPhone URL exists yet.** A hosted deployment remains a separately approved external action; local build/start verification does not claim a Vercel deployment ran.

## Browser environment and limits

The production matrix uses the configured Firefox, WebKit, desktop Chromium and mobile Chromium projects. Binaries live in /tmp/casezero-browsers. As in Phase 4, missing SHA-verified Debian WebKit libraries are supplied inside its local bundle; host validation is skipped after successful launch probes because ldconfig cannot see that local GLES library. Firefox uses temporary XDG_CONFIG_HOME/XDG_CACHE_HOME and the test-only MOZ_DISABLE_CONTENT_SANDBOX=1 setting because the container's profile/cache locations and user-namespace mapping are restricted. No browser-security override was added to application or Playwright configuration. All three engines successfully rendered launch probes before the matrix.

An initial final-matrix startup ran no tests because the visual-review server still occupied port 3000. The owned server was stopped and the production runner started fresh. An early run then exposed an old keyboard assertion that assumed the fourth timeline selector was last; the new source-return link now follows it. The test was extended to check that link and then the original selector. That run stopped with 39 passes, one outdated assertion failure, two interrupted tests and 106 not run; it is not reported as a completed matrix. The corrected focused Firefox regression passed both tests. The final complete matrix then passed all 148 checks without failures, retries or skips. Only that complete run is reported as final.

Screenshots of the 320px board thread, feedback report and timeline were reviewed, including the final sticky dismissal and full event captions. The first ad hoc screenshot fixture was rejected as invalid because it claimed an analysis without its reward; a valid engine-built fixture replaced it. This was fixture validation, not a gameplay dead end.

No human playtesting, physical devices, native Safari or manual screen-reader testing occurred. Linux WebKit and mobile Chromium do not establish those results. Axe scans cover representative states, not complete accessibility conformance. Actual iPhone clipboard/Files behavior and tester enjoyment still need human feedback. Unsaved memory cannot survive refresh when browser storage is unavailable; progress is scoped to each browser/origin, and concurrent tab edits use the latest saved snapshot rather than merging.

## Next priorities

Use PLAYTESTING.md with first-time players on the stable hosted address after deployment is approved. Record where help is needed, whether connections feel earned, how hints change reasoning and whether navigation interrupts flow. Prioritize repeated clarity, lost-progress or accessibility problems over new mechanics. Follow with actual iPhones, native Safari, zoom/VoiceOver and keyboard/screen-reader sessions. Do not infer human enjoyment or difficulty results from automated walkthroughs.
