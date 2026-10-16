# CaseZero

A cinematic browser detective game with two complete, original mysteries. Explore locations, question suspects, connect evidence and build an accusation that survives the facts.

| Case               | Investigation                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **The Quiet Hour** | A museum artifact disappears during a private evening. Four suspects, four locations and sixteen clues.                             |
| **Dead Air**       | A forged coastal-radio warning cancels a ferry trial. Four new suspects, fourteen clues, clock calibration and document comparison. |

## Run

Use Node.js 24 LTS and npm. No credentials or environment variables are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` and `npm start`.

## Play

Choose a case, read its briefing and enter the investigation. Examine search points and return to suspects as evidence unlocks new questions. Dead Air also asks you to correct a recorded time and compare original documents; all necessary information is shown, with no audio listening or outside knowledge required.

On the board, focus a question, search your inventory and pin related evidence. Connections use two or three clues, as indicated by the question. **Test connection** forms a supported conclusion; unsuccessful threads stay pinned for revision. Establish all four conclusions and secure the final evidence before selecting a person, method and motive. Unsupported accusations let you return and try again.

Optional hints in the board and notebook unfold in three deliberate stages. There is no timer or penalty for asking for help. Both cases have fixed solutions; replay starts the same authored mystery afresh.

## Your case files

Each case saves its evidence, interviews, analysis, conclusions, notes, hints, pinned thread and submitted ending independently in this browser. Use **Case files** to switch investigations or replay one; the others stay intact. Existing version 1 Quiet Hour saves migrate automatically. View position and question focus are temporary.

The notebook’s **Export investigation** downloads a portable backup. **Import investigation** accepts an exported file, shows a review and replaces only the matching selected case after confirmation. Original raw version 1 saves are also accepted. Backups include your notes; store them somewhere appropriate.

If browser storage is unavailable, you can play and export, but progress lasts only for that session. Multiple tabs receive the latest saved state; simultaneous edits are not merged. Reset clears only the selected case.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright starts a local server and tests desktop and mobile Chromium. To test a production build on macOS/Linux, run `CASEZERO_PRODUCTION=1 npm run test:e2e` after building. A fresh Linux machine may need browser operating-system dependencies.

## Source

Next.js App Router, React, TypeScript and Tailwind CSS. The case registry is in `src/game/cases.ts`; original content remains in `content.ts`, with additional cases under `episodes/`. Progression, analysis and guidance use deterministic, testable functions. Versioned storage and backup import validate case references and progression invariants.

Ending data loads with submitted accounts. This client-side game’s source remains inspectable; its solutions are not secure against inspection. **`docs/CASE_BIBLE.md` contains spoilers.** See `docs/PLAN.md` for milestones and `docs/VERIFICATION.md` for actual QA scope and results.
