import {
  evidence,
  dialogue,
  deductions,
  suspects,
  methods,
  motives,
} from "./content";
import type { GameState, Requirement, Accusation } from "./types";
export const freshState = (): GameState => ({
  version: 1,
  caseId: "quiet-hour",
  started: false,
  evidence: [],
  deductions: [],
  answers: [],
  notes: "",
  accusation: null,
});
export function meets(state: GameState, req: Requirement): boolean {
  return (
    (req.evidence ?? []).every((id) => state.evidence.includes(id)) &&
    (req.deductions ?? []).every((id) => state.deductions.includes(id)) &&
    (req.answers ?? []).every((id) => state.answers.includes(id))
  );
}
export function startCase(state: GameState): GameState {
  return { ...state, started: true };
}
export function discover(state: GameState, id: string): GameState {
  const clue = evidence.find((item) => item.id === id);
  if (
    !state.started ||
    state.accusation ||
    !clue ||
    state.evidence.includes(id) ||
    !meets(state, clue.requires)
  )
    return state;
  return { ...state, evidence: [...state.evidence, id] };
}
export function answer(state: GameState, id: string): GameState {
  const line = dialogue.find((item) => item.id === id);
  if (
    !state.started ||
    state.accusation ||
    !line ||
    state.answers.includes(id) ||
    !meets(state, line.requires)
  )
    return state;
  return { ...state, answers: [...state.answers, id] };
}
export type CombinationResult = {
  state: GameState;
  message: string;
  deductionId?: string;
};
export function combine(state: GameState, ids: string[]): CombinationResult {
  if (
    !state.started ||
    state.accusation ||
    new Set(ids).size !== ids.length ||
    !ids.every((id) => state.evidence.includes(id))
  )
    return { state, message: "Select distinct evidence from your inventory." };
  const match = deductions.find(
    (d) =>
      d.evidence.length === ids.length &&
      d.evidence.every((id) => ids.includes(id)),
  );
  if (!match)
    return {
      state,
      message:
        "These clues do not establish a complete conclusion. Compare the board’s questions and try another connection.",
    };
  if (state.deductions.includes(match.id))
    return {
      state,
      message: "This conclusion is already on your board.",
      deductionId: match.id,
    };
  return {
    state: { ...state, deductions: [...state.deductions, match.id] },
    message: match.conclusion,
    deductionId: match.id,
  };
}
export function canAccuse(state: GameState): boolean {
  return (
    state.started &&
    deductions.every((d) => state.deductions.includes(d.id)) &&
    state.evidence.includes("E16")
  );
}
export function validAccusation(value: Accusation): boolean {
  return (
    suspects.some((s) => s.id === value.suspect) &&
    methods.some((m) => m.id === value.method) &&
    motives.some((m) => m.id === value.motive)
  );
}
export function accuse(state: GameState, value: Accusation): GameState {
  if (!canAccuse(state) || state.accusation || !validAccusation(value))
    return state;
  return { ...state, accusation: value };
}
export function resumeInvestigation(state: GameState): GameState {
  return { ...state, accusation: null };
}
export function notebook(state: GameState, notes: string): GameState {
  return { ...state, notes: notes.slice(0, 6000) };
}
