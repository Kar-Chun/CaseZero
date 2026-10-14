# CaseZero coding guidance

- Keep game content in `src/game/content.ts` and pure rules in `src/game/engine.ts`.
- Read `docs/CASE_BIBLE.md` before changing story or progression. It contains spoilers; never import it into the app.
- Neutral IDs must stay stable. Do not expose the solution in early UI, metadata, asset names, or logs.
- Every interactive control must work with a keyboard. Preserve mobile layouts, contrast, focus handling and reduced-motion support.
- Validate content references/reachability and saved-state dependencies. No required path may rely on a wrong verdict or optional evidence.
- Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e` for relevant changes. Record actual outcomes and limitations in docs/PLAN.md.
- Bump save version if state compatibility changes. Keep dependencies minimal. Do not deploy without authorization.
