# CaseZero coding guidance

- Keep original content in `src/game/content.ts`, additional cases in `src/game/episodes/`, the registry in `src/game/cases.ts`, and pure rules in `src/game/engine.ts`.
- Read `docs/CASE_BIBLE.md` before changing story or progression. It contains spoilers; never import it into the app.
- Neutral IDs must stay stable. Do not expose the solution in early UI, metadata, asset names, or logs.
- Every interactive control must work with a keyboard. Preserve mobile layouts, contrast, focus handling and reduced-motion support.
- Validate content references/reachability and saved-state dependencies. No required path may rely on a wrong verdict or optional evidence.
- Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e` for relevant changes. Record actual outcomes and limitations in docs/PLAN.md.
- Preserve v1 Quiet Hour save migration, stable case IDs and independent save keys. Bump save version if state compatibility changes. Keep dependencies minimal. Do not deploy without authorization.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
