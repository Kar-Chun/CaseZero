# CaseZero implementation plan

One complete deterministic museum mystery. Isolated repository on `develop/casezero`. No external services or deployment.

| Milestone | Acceptance criteria | Status |
| --- | --- | --- |
| 1 Foundation | Next.js App Router, typed content/rules, reference and reachability validation; install, typecheck, tests, build | Complete |
| 2 Core interface | Home, case selection, briefing, navigation and responsive shell; navigation tests | Complete |
| 3 Evidence | Four locations, sixteen clues, locks, inventory, details and board; discovery tests | In progress |
| 4 Interviews | Four profiles, evidence/deduction branches and conversation history; condition tests | Pending |
| 5 Verdict | Four deductions, accusation prerequisites, two outcomes and replay; journey tests | Pending |
| 6 Persistence/polish | Versioned validated save, Continue/New Game/Reset, notebook, hints, accessibility; storage tests | Pending |
| 7 Final QA | Typecheck, lint, build, unit/component and supported browser tests; correct/incorrect journeys, refresh/reset/mobile; verification report | Pending |

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

## Handoff

Next: implement searchable locations, inventory and board. No Git remote configured; prepare local review material when finished.
