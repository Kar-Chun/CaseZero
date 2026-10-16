# CaseZero Phase 2 verification

Verified on 16 October 2026 in Linux with Node 24.19.0, npm 11.9.0, Next.js 16.4.0 and React 19.3.0. Original MVP verification and the six Phase 2 milestone results are preserved in PLAN.md.

| Check                 | Actual result                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean installation    | `npm ci` succeeded in an isolated directory using the final manifest/lockfile; 320 packages installed                                                                   |
| TypeScript            | `npm run typecheck` passed                                                                                                                                              |
| ESLint                | `npm run lint` passed                                                                                                                                                   |
| Unit/component tests  | `npm test`: 81 tests passed in 20 files                                                                                                                                 |
| Production build      | `npm run build` passed; App Router pages prerendered successfully                                                                                                       |
| Production Playwright | 44 passed against the production server: 22 desktop and 22 mobile Chromium tests (2.2 minutes)                                                                          |
| Accessibility         | axe WCAG 2/2.1 A/AA scans report zero violations on audited entry, original investigation, new analyses and import screens; keyboard/focus/reduced-motion checks passed |
| Responsive            | Desktop, 390px mobile and 320px narrow investigation layouts checked without document overflow                                                                          |
| Repository            | Existing `develop/casezero` branch; six completed milestone commits; `git diff --check` passed; no deployment                                                           |

## Verified behavior

Both authored cases have complete reference/reachability validation, explicit engine solution paths, every dialogue dependency and correct/unsupported verdict tests. The new case has fourteen clues, four suspects, four locations, twelve interview branches and four conclusions. Clock calibration and document comparison produce evidence only after their prerequisites and correct analysis; failed attempts cannot consume evidence or block progress. Identity reasoning explicitly requires the corrected insertion window.

Production journeys complete The Quiet Hour and Dead Air through actual UI searches, interviews, analyses, board combinations and final evidence. They exercise unsupported accusations, retry, ending restoration and replay. The original sixteen-clue mystery remains intact. Optional three-stage guidance is tested through both complete required paths; requesting hints never discovers clues or establishes conclusions automatically.

Save checks cover original version 1 partial/ending migration, independently restored case progress, notes, hints, analysis and pins, reset/replay isolation, invalid/impossible/unsupported data, denied storage and quota errors. Portable backups round-trip all fields. Browser checks download a real JSON file, upload it, review without writing, then restore it; foreign-case and oversized files leave current progress unchanged. Cross-tab checks cover same-case synchronization and different-case isolation. Simultaneous edits use the latest saved snapshot and are not merged.

Desktop archive/radio-room and narrow-board screenshots were visually reviewed. Monitored journeys reported no page or application console errors. An additional desktop check confirmed room-heading focus and the skip link staying outside the viewport after navigation.

## Issues resolved

- Added the missing time-window dependency before the new identity conclusion; custody alone cannot establish who had opportunity at the corrected time.
- Pinned threads now survive navigation and refresh; unsuccessful connections retain the selected evidence for revision.
- Hidden controls and dynamically replaced dialog content no longer let keyboard focus escape. Ending and backup-review headings receive focus.
- Increased the save-size guard to accommodate valid 6,000-character notes containing JSON-escaped characters. Export/import round-trip coverage verifies this boundary.
- Canceled stale asynchronous file reads so an earlier upload cannot replace a later selection or pasted backup.
- Preserved per-case session progress through case switching when storage is denied or full; incoming storage events invalidate cached snapshots.
- Corrected ambiguous clock wording and made the final recording's witnessed transfer explicit during narrative review.

Final QA initially used a fresh-game helper in a tab with an existing investigation. The helper expected “Explore” where “Continue” was shown; the test now opens the archive directly. Its focused rerun passed. No tests were removed to pass checks.

## Limits and handoff

No known blocking gameplay issue remains. Browser coverage uses Chromium desktop and mobile emulation. Safari, Firefox, physical devices and a manual screen-reader audit were not run. Automated scans cover representative screens and do not establish complete accessibility conformance. Browser and test-runner environment warnings are not application console errors.

Saves are local, with portable export/import available. When storage fails, case progress survives switching within the current session, but a refresh still loses unsaved changes. View position, filters and question focus are temporary; pinned threads are saved. Solutions are authored and fixed, and client source remains inspectable. Optional audio is deferred.

No remote repository is configured; a hosted pull request has not been opened. Review material is in REVIEW.md. No public deployment was performed. See README.md to run/play. Future work could add another authored case, optional ambient sound, and testing on additional browser engines and physical devices.
