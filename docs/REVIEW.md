# Proposed pull request: Deepen CaseZero with After the Flood and supported reasoning

CaseZero’s existing board supplied conclusions as soon as the correct cards were selected. Phase 3 adds After the Flood, a complete conservatory sabotage case in which players reconstruct a sequence containing an untimed event and choose what their evidence actually establishes. Four new suspects, fourteen clues, branching interviews and supported correct/incorrect endings form a logically provable investigation.

The existing content/rules/UI architecture remains intact. Optional explanation rules and sequence analysis extend it without changing the saved-state shape or old-case behavior. Reference, answer and reachability checks validate the new mechanics. All three saves remain independent, original v1 migration and v2 backups work, and no runtime dependencies or services were added.

Discovery files now surface available follow-up questions. Conclusions retain links to their supporting records, mobile board shortcuts reduce scrolling, and first-room guidance introduces the investigation naturally. Local conservatory artwork, focused revelation feedback and reduced-motion support preserve the cinematic interface. Wrong explanations and reconstructions cost no evidence and cannot block progress.

Validation: 102 unit/component tests and 81 production browser tests passed (27 each in desktop Chromium, mobile Chromium and Linux WebKit), plus typecheck, lint, production build and clean installation. Firefox launch was attempted but blocked during environment profile initialization; no Firefox gameplay result is claimed. Exact scope, setup and limits are in [VERIFICATION.md](VERIFICATION.md).

Five milestones are committed on `develop/casezero`; history and acceptance criteria are in PLAN.md. CASE_BIBLE.md contains exact solutions and spoilers. No remote is configured, so no hosted PR was opened. No deployment was performed.
