# CaseZero

A cinematic browser detective game. In **The Quiet Hour**, an artifact disappears during a private evening at the Halcyon Museum. Investigate four rooms, collect sixteen clues, interview four suspects and build a supported accusation.

## Run

Use Node.js 24 LTS and npm. No credentials or environment variables are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production run:

```sh
npm run build
npm start
```

## Play

Open the case file, read the briefing and enter the museum. Examine search points, revisit suspects as evidence opens new questions, and select three related clues on the evidence board to **Test connection**. Establish all four conclusions and recover the artifact before choosing a suspect, method and motive.

Locked items explain their prerequisites. The notebook offers a next lead when needed. An unsupported accusation lets you return and revise your case. Replay uses the same authored solution.

Evidence, interviews, conclusions, notes and submitted endings save automatically in this browser. **Continue investigation** restores them. **New game**, **Play again**, and **Reset progress** clear this case’s save. Other browser data is preserved. If storage is unavailable, the game explains that progress lasts only for the current session. Multiple tabs synchronize the latest save. Board selections and view positions are temporary.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright starts a local server and tests desktop and mobile Chromium. To test an existing production build on macOS/Linux, use `CASEZERO_PRODUCTION=1 npm run test:e2e` after building. A browser installation may need operating-system dependencies on a fresh Linux machine.

## Source

Next.js App Router, React, TypeScript and Tailwind CSS. Authored content is in `src/game/content.ts`; progression rules are pure functions in `engine.ts`; `storage.ts` validates versioned browser saves. Vitest and React Testing Library cover content, rules and components. Playwright covers player journeys and accessibility with axe.

The ending evaluator is loaded with the ending screen. This is a client-side game, so its source remains inspectable; solution data is not secure. **`docs/CASE_BIBLE.md` contains spoilers.** See `docs/PLAN.md` for milestone history and `docs/VERIFICATION.md` for actual QA results.
