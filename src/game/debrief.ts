import { getCase } from "./cases";
import type { Accusation, GameState } from "./types";
/** Receives the ending's evaluation; this module contains no authored solution. */
export function accountReview(
  state: GameState,
  matches: Record<keyof Accusation, boolean>,
) {
  const c = getCase(state.caseId);
  return (["suspect", "method", "motive"] as const).map((key) => ({
    key,
    label:
      key === "suspect" ? "Person" : key === "method" ? "Method" : "Motive",
    consistent: matches[key],
    conclusions: c.accountEvidence[key]
      .filter((id) => state.deductions.includes(id))
      .map((id) => {
        const d = c.deductions.find((d) => d.id === id)!;
        return {
          title: d.title,
          conclusion: d.conclusion,
          sources: (state.proofs[id] ?? d.evidence).map(
            (id) => c.evidence.find((e) => e.id === id)!.title,
          ),
        };
      }),
  }));
}
