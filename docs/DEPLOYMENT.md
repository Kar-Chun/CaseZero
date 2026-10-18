# Play CaseZero on an iPhone

The app is ready for standard Next.js hosting. It has **not been published**. The code currently lives in `/workspace/casezero`, on `develop/casezero`, with no GitHub remote. That workspace path and `localhost:3000` are not public links your iPhone can open.

## Phone-only route: GitHub → Vercel → Safari

You can manage the account steps in Safari; a computer is not required for those steps. If a dashboard hides a setting, use Safari’s page menu → **Request Desktop Website**. Labels may vary slightly as dashboards change.

1. Sign in to [GitHub](https://github.com/new) and create an **empty private repository**, such as `casezero`. Do not initialize a README, `.gitignore` or license: those files/history already exist locally. Private source keeps the internal case bible out of public search.
2. Copy its HTTPS repository URL. Return to this workspace conversation with that URL and explicit approval to add the remote and push `develop/casezero`. **No creation, push or deployment has been performed by this task.** The GitHub iPhone app cannot upload the workspace folder directly; an approved push is the handoff that puts this existing code into your repository. Never paste a password or access token into chat.
3. Once the push is confirmed, open the repository in Safari. Check that `develop/casezero` contains the latest Phase 5 commit, `package.json` and `src` at the repository root. For a new repository dedicated to this game, make `develop/casezero` its default branch under repository Settings → Default branch if necessary. This makes Vercel’s initial import unambiguous.
4. Sign in to [Vercel](https://vercel.com/new), choose **Add New / Project**, and import that GitHub repository. Allow the GitHub integration access to this repository. Choose **Next.js**, root directory **`./`**, and keep framework build/output defaults. The build command is `npm run build`; an explicit install override, if needed, is `npm ci`. Use **Node.js 24.x** (also pinned by `package.json`). No environment variables, database, API keys or domain purchase are required. Do not choose “Other”, a custom server or a static-export preset.
5. When you choose to publish, tap **Deploy** yourself or explicitly authorize that external action in a later task. If the project Settings → Git / Environments shows a different **Production Branch**, set it to `develop/casezero` and redeploy that branch. Verify Node 24.x under Settings → Build and Deployment if a runtime warning appears. Vercel provides HTTPS automatically.
6. Copy the stable **Production** URL from the project’s Domains/Overview, usually `https://<project>.vercel.app`. Avoid using a different per-deployment preview URL each time. Open that URL in a regular **Safari** tab on your iPhone, choose a case, search a clue, then reload and choose **Continue investigation**. Bookmark the address using Safari’s Share menu. CaseZero is a browser game; an App Store install is unnecessary.
7. For a small tester group, send the same stable URL and the short checklist in [PLAYTESTING.md](PLAYTESTING.md). Check Vercel’s **Deployment Protection** and your plan’s access options before inviting testers. A private GitHub repository does not make a deployed website private; preview links may require a Vercel sign-in, while an unprotected production URL is accessible to anyone who has it. Choose the access arrangement you intend before sharing.

## Save continuity on a phone

Progress belongs to the **website address, browser profile and device**. A localhost/LAN save, a preview URL, a production domain, an in-app browser and another device do not automatically share it. Keep using the same Safari address and normal tab. Private browsing, clearing website data or changing domains can remove or separate saves. Do not promise cloud sync or offline play.

Before moving progress, open each case’s Notebook → **Export investigation**. Keep the JSON in Files. At the new address, choose the matching case, enter its Notebook → **Import investigation**, select that file, review and confirm replacement. Repeat for each case you want to transfer. This preserves existing v1/v2/v3 saves without replacing other cases. Safari may offer a download preview or Save to Files; retain the actual JSON file. On an unsupported download flow, the original browser’s save is unchanged.

To report a problem, scroll to **Playtest feedback**, describe the moment, then **Copy report** or **Download report**. Send the text/file back through the invitation’s channel, such as Messages. Clipboard denial leaves a selectable report for manual copying. Nothing is submitted to a service and no organizer account is required in the game. Investigation notes and clue contents are not automatically attached.

## If a computer is available

From a checked-out copy of this repository:

```sh
nvm use
npm ci
npm run build
npm start
```

Open `http://localhost:3000` on that computer. For temporary phone testing on the same Wi-Fi, use the computer’s LAN address, for example `http://192.168.1.20:3000`, and allow the local connection if its firewall asks. Use the computer’s actual address; `localhost` on the phone means the phone itself. This LAN route does not apply to the managed cloud workspace, and HTTP clipboard access may be unavailable; manual copy/download still works.

An approved publisher with GitHub access can push the existing branch to the empty repository using normal Git credentials. Do not force-push or rebuild the app in a new repository. No `.env` file or local `.vercel` folder belongs in Git.

## Hosting checks and troubleshooting

- This is a normal App Router application: browser storage holds progress, assets are local, and no persistent server filesystem or external service is required. Node build/start and the production browser matrix are verified locally; **a Vercel deployment itself has not been executed**.
- Build failure: confirm root `./`, Node 24.x, the committed lockfile and the selected branch. Do not use the dev server as a production build. Keep `.next` as the framework-managed output.
- Old or missing progress: check the exact URL, regular Safari versus Private/in-app browser, and the selected case before importing/resetting anything.
- Saving warning: use **Retry saving**. If it persists, export a backup before refreshing. Reload cannot restore changes that were never saved.
- “Case file could not open”: restore connectivity and use **Reload saved game**. The last successful local save remains the recovery point.
- Tester cannot enter: check deployment protection/invitations and whether you shared a preview rather than the intended production address.

Official references: [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying), [Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Vercel for GitHub](https://vercel.com/docs/deployments/git/vercel-for-github), [creating a GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository). Vercel’s Node 24.x support and these handoff steps were reviewed on 18 October 2026.
