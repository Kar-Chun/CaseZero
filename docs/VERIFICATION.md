# CaseZero final verification

Verified on 14 October 2026 in Linux with Node 24.19.0, npm 11.9.0, Next.js 16.4.0 and React 19.3.0. All seven milestones are complete.

| Check                          | Actual result                                                                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean installation             | `npm ci` succeeded in an isolated directory using the final manifest and lockfile                                                                   |
| TypeScript                     | `npm run typecheck` passed                                                                                                                          |
| ESLint                         | `npm run lint` passed, no reported issues                                                                                                           |
| Production build               | `npm run build` passed; App Router page prerendered successfully                                                                                    |
| Vitest / React Testing Library | 41 tests passed in 10 files: 34 rule/content/storage tests and 7 component tests                                                                    |
| Production Playwright          | 20 tests passed: 10 desktop and 10 mobile Chromium checks                                                                                           |
| Accessibility                  | axe WCAG 2 A/AA and 2.1 A/AA scans reported zero violations on audited screens; keyboard, focus, Escape, skip link and reduced-motion checks passed |
| Responsive                     | Desktop, 390px mobile and 320px narrow layouts checked; no document overflow in tested investigation sections                                       |
| Repository                     | Dedicated `develop/casezero` branch; passing milestone commits; `git diff --check` passed                                                           |

## Verified behaviors

The complete production journey discovers all sixteen clues, interviews all four suspects, uses both interview-dependent records, rejects an unrelated evidence combination, establishes four conclusions, recovers the object, reviews an accusation and reaches the correct ending. Desktop and mobile runs also test an incorrect suspect, return to the same investigation and reach a successful retry. Unit tests reject a correct suspect with an incorrect method or motive.

Tests cover duplicate prevention, unknown IDs, missing dependencies, cyclic/unreachable content, locked search points, inventory filtering, pinning, comparison, every conditional dialogue branch, exact deduction recipes, accusation prerequisites and end-state freezing. Save tests cover partial progress, notes, completed endings, malformed/outdated data, impossible state, unavailable storage and reset preserving unrelated browser data.

Browser checks verify refresh during play and at an ending, Continue, New Game, replay, reset, two-tab synchronization, mobile interactions, focus-managed dialogs and keyboard entry. No page or console errors were observed in monitored journeys. Screenshots were visually reviewed; the empty tray was adjusted so it does not obscure the mobile deduction board.

## Failures investigated and resolved

- Sandbox restrictions initially prevented dependency networking and Turbopack worker binding. Using permitted network access allowed installation and builds; no policy bypass was used.
- The Next development server initially blocked loopback HMR, preventing hydration. The explicit local development origin fixes it.
- A component test matched both an answer and its transcript; its query now targets the live response.
- A development hot reload interrupted one replay check; a stable rerun and production runs pass.
- The Next lint preset declared incompatible ESLint 10 peers. Compatible Next, React Hooks and TypeScript plugins now run directly; a clean install passes.
- An accessibility scan measured the entrance animation partway through its fade. Scans now use the stable reduced-motion layout; all audited screens pass.

## Limits and handoff

No known blocking gameplay issues remain. Browser tests use Chromium with mobile emulation; Safari, Firefox, physical devices and a manual screen-reader audit have not been tested. Automated accessibility scans cover representative screens and do not establish complete conformance.

Saves are local to the browser/device, and board selection/view positions are temporary. The authored solution remains inspectable in client source; its evaluator is loaded with the ending UI, but no client-side secrecy is claimed.

No remote repository is configured, so no hosted pull request was opened. Review material is in `docs/REVIEW.md`. No public deployment was performed. Run and play instructions are in README.md.

Possible next additions: more authored cases, optional atmospheric audio, and save export/import.
