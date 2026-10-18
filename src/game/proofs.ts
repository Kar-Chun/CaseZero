import type { CaseDefinition, Deduction, GameState } from "./types";
export const proofSets = (d: Deduction): string[][] => [
  d.evidence,
  ...(d.alternatives ?? []),
];
export const sameProof = (a: string[], b: string[]): boolean =>
  a.length === b.length &&
  new Set(a).size === a.length &&
  a.every((id) => b.includes(id));
export const supports = (d: Deduction, ids: string[]): boolean =>
  proofSets(d).some((path) => sameProof(path, ids));
export const maxPins = (c: CaseDefinition): number =>
  Math.max(
    0,
    ...c.deductions.flatMap((d) => proofSets(d).map((p) => p.length)),
  );
/** Prefer records already collected; ties retain the authored canonical path. */
export function preferredProof(state: GameState, d: Deduction): string[] {
  return proofSets(d).reduce((best, path) =>
    path.filter((id) => !state.evidence.includes(id)).length <
    best.filter((id) => !state.evidence.includes(id)).length
      ? path
      : best,
  );
}
