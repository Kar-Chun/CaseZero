import { getCase } from "./cases";
import type { GameState } from "./types";
export const feedbackKinds = [
  "Confusing interaction",
  "Bug",
  "Difficulty",
  "Enjoyment",
] as const;
export type FeedbackDetails = {
  kind: (typeof feedbackKinds)[number];
  description: string;
  expected: string;
  device: string;
};
/** Explicit allowlist: never serialize the investigation or include notebook/evidence text. */
export function feedbackContext(state: GameState, view: string) {
  const c = getCase(state.caseId);
  return {
    build: process.env.NEXT_PUBLIC_CASEZERO_BUILD || "local",
    caseTitle: c.title,
    view,
    evidence: `${state.evidence.length}/${c.evidence.length}`,
    conclusions: `${state.deductions.length}/${c.deductions.length}`,
    hints: Object.values(state.hints).reduce(
      (total, level) => total + level,
      0,
    ),
    submitted: state.accusation !== null,
  };
}
export function feedbackReport(
  context: ReturnType<typeof feedbackContext>,
  details: FeedbackDetails,
): string {
  return [
    "CaseZero playtest feedback",
    `Build: ${context.build}`,
    `Case: ${context.caseTitle}`,
    `View: ${context.view}`,
    `Progress: ${context.evidence} records; ${context.conclusions} conclusions; ${context.hints} hint stages revealed`,
    `Account submitted: ${context.submitted ? "yes" : "no"}`,
    `Topic: ${details.kind}`,
    `Browser/device: ${details.device.trim().slice(0, 100) || "Not supplied"}`,
    "",
    "What happened / how it felt:",
    details.description.trim().slice(0, 2000),
    "",
    "What I expected:",
    details.expected.trim().slice(0, 1000) || "Not supplied",
  ].join("\n");
}
