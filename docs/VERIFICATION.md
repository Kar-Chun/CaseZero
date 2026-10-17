# CaseZero Phase 3 verification

Verified on 17 October 2026 in Linux with Node 24.19.0, npm 11.9.0, Next.js 16.4.0 and React 19.3.0. Prior milestone results remain in PLAN.md.

| Check                    | Actual result                                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Clean install            | Isolated `npm ci` succeeded with the final manifest/lockfile; 320 packages installed                                    |
| TypeScript               | `npm run typecheck` passed                                                                                              |
| ESLint                   | `npm run lint` passed                                                                                                   |
| Unit/component tests     | `npm test`: 102 passed in 23 files                                                                                      |
| Production build         | `npm run build` passed; App Router pages prerendered                                                                    |
| Production browser suite | 81 passed in 7.8 minutes: 27 desktop Chromium, 27 mobile Chromium, 27 desktop WebKit                                    |
| Accessibility            | Zero axe WCAG 2/2.1 A/AA violations on audited screens; tested keyboard, focus, reduced motion and 320px layouts passed |
| Repository               | Existing `develop/casezero` branch; five verified milestone commits; `git diff --check` passed                          |

## Gameplay and compatibility

All three cases complete through actual UI searches, interviews, analysis, deductions and final evidence. Browser journeys cover correct and unsupported verdicts, successful retry, refresh at an ending and independent case progress. The original two cases and their original meaningful tests remain intact.

After the Flood adds fourteen clues, four suspects, four rooms, twelve interview topics, one reconstruction and four explanation-dependent deductions. All 24 distinct event orders were tested; exactly one satisfies the authored records. Duplicate/missing/foreign events and unsupported explanations grant no progress. Opportunity requires the reconstructed window. The required path also completes without the optional red-herring correspondence. Every conditional interview is checked with its complete requirements and each missing dependency. Content checks cover reference integrity, reachability, analysis rewards and valid explanation choices.

Version 2 save shape and existing keys are unchanged. Original version 1 partial/ending saves migrate; original version 2 saves and backups restore. Tests exercise all three independent saves, replay/reset, real JSON downloads and file uploads, review before replacement, notes, hints, pins and completed reconstruction. Invalid, unsupported, oversized, foreign-case and impossible imports leave progress unchanged. Storage denial/quota and same-/different-case tab behavior remain covered. Simultaneous edits use the latest snapshot, without merging.

Discovery links select the relevant suspect or location without collecting evidence. Answered topics disappear. Board shortcuts focus their destinations; conclusion feedback receives focus and supporting records reopen correctly. New reconstruction, explanation, revelation and backup-review screens have narrow-layout and axe checks. Monitored journeys reported no page or application console errors. Archive, conservatory hall, reconstruction source/order and narrow-board screenshots were visually reviewed.

## Issues addressed

- Explanation selection is enforced alongside evidence; correct cards alone cannot establish a new-case conclusion.
- Sequence validation rejects repeated events and preserves progress after unsuccessful attempts.
- Narrative review aligned the report and preserved observations to the same evaluation time and explained the director’s mistaken assumption about the surviving material. Exact narrative review details are in CASE_BIBLE.md (spoilers).
- Removed object-recovery assumptions from the general field guide and notebook; all cases now use accurate final-proof guidance.
- Added actionable discovery relationships and source review to reduce repeated navigation and lost context.
- Corrected an overly narrow inferred state type in the new component-test harness. No meaningful tests were removed to pass checks.

## Browser environment and limits

The production run selected `desktop`, `mobile` and `webkit` with `CASEZERO_CROSS_BROWSER=1 CASEZERO_PRODUCTION=1`. WebKit's missing Debian libraries were extracted under `/tmp` and supplied to its local bundle without replacing existing files. Playwright’s ldconfig-only check cannot see the supplied GLES library; host validation was skipped after launch verification, and all 27 real WebKit tests passed. A normal Linux machine can use `npx playwright install-deps`.

Firefox binaries downloaded, but repeated launch attempts failed with “Could not find profile folder”; tracing showed a read-only home configuration path during initialization. No Firefox gameplay tests ran. Opt-in Firefox/WebKit projects are included for environments that support them. Linux WebKit testing does not establish native Safari or physical iOS coverage. Physical devices and a manual screen-reader audit were not tested. Automated scans cover representative screens, not complete conformance.

No known blocking gameplay issue remains. View position, filters, question focus and unsubmitted analysis/explanation selections are temporary; completed analyses, conclusions and pins save. Solutions are fixed authored narratives and remain inspectable in client source. Audio is deferred. Unsaved session progress cannot survive refresh if storage fails.

No deployment was performed. No remote is configured, so a hosted PR was not opened. REVIEW.md contains the review summary; README.md explains installation and play. Phase 4 priorities: human playtesting to tune difficulty, Firefox/native Safari/device/screen-reader coverage, and carefully authored alternate proof paths before more systems.
