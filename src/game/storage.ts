import { evidence, dialogue, deductions } from "./content";
import { freshState, meets, canAccuse, validAccusation } from "./engine";
import type { GameState, Accusation } from "./types";
export const SAVE_KEY = "casezero:progress:v1";
export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type LoadResult = {
  state: GameState;
  available: boolean;
  notice: string | null;
};
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
function ids(value: unknown, known: { id: string }[]): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= known.length &&
    value.every(
      (id) => typeof id === "string" && known.some((n) => n.id === id),
    ) &&
    new Set(value).size === value.length
  );
}
export function parseSave(raw: string): GameState | null {
  try {
    if (raw.length > 20000) return null;
    const s: unknown = JSON.parse(raw);
    if (
      !object(s) ||
      s.version !== 1 ||
      s.caseId !== "quiet-hour" ||
      typeof s.started !== "boolean" ||
      !ids(s.evidence, evidence) ||
      !ids(s.deductions, deductions) ||
      !ids(s.answers, dialogue) ||
      typeof s.notes !== "string" ||
      s.notes.length > 6000
    )
      return null;
    if (s.accusation !== null) {
      if (
        !object(s.accusation) ||
        typeof s.accusation.suspect !== "string" ||
        typeof s.accusation.method !== "string" ||
        typeof s.accusation.motive !== "string" ||
        !validAccusation(s.accusation as Accusation)
      )
        return null;
    }
    const state: GameState = {
      version: 1,
      caseId: "quiet-hour",
      started: s.started,
      evidence: [...s.evidence],
      deductions: [...s.deductions],
      answers: [...s.answers],
      notes: s.notes,
      accusation:
        s.accusation === null
          ? null
          : {
              suspect: (s.accusation as Accusation).suspect,
              method: (s.accusation as Accusation).method,
              motive: (s.accusation as Accusation).motive,
            },
    };
    if (
      !state.started &&
      (state.evidence.length ||
        state.deductions.length ||
        state.answers.length ||
        state.notes ||
        state.accusation)
    )
      return null;
    if (
      !evidence
        .filter((e) => state.evidence.includes(e.id))
        .every((e) => meets(state, e.requires))
    )
      return null;
    if (
      !dialogue
        .filter((t) => state.answers.includes(t.id))
        .every((t) => meets(state, t.requires))
    )
      return null;
    if (
      !deductions
        .filter((d) => state.deductions.includes(d.id))
        .every((d) => meets(state, { evidence: d.evidence }))
    )
      return null;
    if (state.accusation && !canAccuse(state)) return null;
    return state;
  } catch {
    return null;
  }
}
export function loadGame(storage?: StoragePort): LoadResult {
  try {
    const port = storage ?? window.localStorage,
      raw = port.getItem(SAVE_KEY);
    if (raw === null)
      return { state: freshState(), available: true, notice: null };
    const state = parseSave(raw);
    return state
      ? { state, available: true, notice: null }
      : {
          state: freshState(),
          available: true,
          notice:
            "The saved case is invalid or from an unsupported version. Start a new investigation to create a fresh save.",
        };
  } catch {
    return {
      state: freshState(),
      available: false,
      notice:
        "Browser saving is unavailable. You can play, but this session will not survive a refresh.",
    };
  }
}
export function saveGame(state: GameState, storage?: StoragePort): boolean {
  try {
    (storage ?? window.localStorage).setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
export function clearGame(storage?: StoragePort): boolean {
  try {
    (storage ?? window.localStorage).removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}
