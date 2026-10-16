import { getCase, isCaseId } from "./cases";
import { freshState, meets, canAccuse, validAccusation } from "./engine";
import type { GameState, Accusation, CaseId } from "./types";
export const SAVE_KEY = "casezero:progress:v1";
export const SELECTED_CASE_KEY = "casezero:selected-case";
export function saveKey(caseId: CaseId = "quiet-hour"): string {
  return caseId === "quiet-hour" ? SAVE_KEY : `casezero:progress:${caseId}:v2`;
}
export function selectedCase(): CaseId {
  try {
    const id = window.localStorage.getItem(SELECTED_CASE_KEY);
    return isCaseId(id) ? id : "quiet-hour";
  } catch {
    return "quiet-hour";
  }
}
export function selectCase(caseId: CaseId): void {
  try {
    window.localStorage.setItem(SELECTED_CASE_KEY, caseId);
  } catch {
    /* In-memory case switching still works. */
  }
}
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
      ![1, 2].includes(s.version as number) ||
      !isCaseId(s.caseId) ||
      (s.version === 1 && s.caseId !== "quiet-hour") ||
      typeof s.started !== "boolean" ||
      typeof s.notes !== "string" ||
      s.notes.length > 6000
    )
      return null;
    const definition = getCase(s.caseId);
    const { evidence, dialogue, deductions, inspections } = definition;
    if (
      !ids(s.evidence, evidence) ||
      !ids(s.deductions, deductions) ||
      !ids(s.answers, dialogue)
    )
      return null;
    const completed = s.version === 1 ? [] : s.inspections,
      hints = s.version === 1 ? {} : s.hints,
      pinned = s.version === 1 ? [] : s.pinned;
    if (
      !ids(completed, inspections) ||
      !ids(pinned, evidence) ||
      pinned.length > Math.max(...deductions.map((d) => d.evidence.length)) ||
      !pinned.every(
        (id) => s.evidence instanceof Array && s.evidence.includes(id),
      ) ||
      !object(hints)
    )
      return null;
    const hintKeys = [
      ...evidence.map((e) => `evidence:${e.id}`),
      ...dialogue.map((t) => `interview:${t.id}`),
      ...deductions.map((d) => `deduction:${d.id}`),
      ...inspections.map((i) => `inspection:${i.id}`),
    ];
    if (
      Object.entries(hints).some(
        ([key, value]) =>
          !hintKeys.includes(key) ||
          typeof value !== "number" ||
          !Number.isInteger(value) ||
          value < 1 ||
          value > 3,
      )
    )
      return null;
    if (s.accusation !== null) {
      if (
        !object(s.accusation) ||
        typeof s.accusation.suspect !== "string" ||
        typeof s.accusation.method !== "string" ||
        typeof s.accusation.motive !== "string" ||
        !validAccusation(s.accusation as Accusation, s.caseId)
      )
        return null;
    }
    const state: GameState = {
      version: 2,
      caseId: s.caseId,
      inspections: [...completed],
      hints: { ...hints } as Record<string, number>,
      pinned: [...pinned],
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
        state.accusation ||
        state.inspections.length ||
        state.pinned.length ||
        Object.keys(state.hints).length)
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
    if (
      !inspections
        .filter((i) => state.inspections.includes(i.id))
        .every((i) => meets(state, i.requires))
    )
      return null;
    if (state.accusation && !canAccuse(state)) return null;
    return state;
  } catch {
    return null;
  }
}
export function loadGame(
  storage?: StoragePort,
  caseId: CaseId = "quiet-hour",
): LoadResult {
  try {
    const port = storage ?? window.localStorage,
      raw = port.getItem(saveKey(caseId));
    if (raw === null)
      return { state: freshState(caseId), available: true, notice: null };
    const state = parseSave(raw);
    return state && state.caseId === caseId
      ? { state, available: true, notice: null }
      : {
          state: freshState(caseId),
          available: true,
          notice:
            "The saved case is invalid or from an unsupported version. Start a new investigation to create a fresh save.",
        };
  } catch {
    return {
      state: freshState(caseId),
      available: false,
      notice:
        "Browser saving is unavailable. You can play, but this session will not survive a refresh.",
    };
  }
}
export function saveGame(state: GameState, storage?: StoragePort): boolean {
  try {
    (storage ?? window.localStorage).setItem(
      saveKey(state.caseId),
      JSON.stringify(state),
    );
    return true;
  } catch {
    return false;
  }
}
export function clearGame(
  storage?: StoragePort,
  caseId: CaseId = "quiet-hour",
): boolean {
  try {
    (storage ?? window.localStorage).removeItem(saveKey(caseId));
    return true;
  } catch {
    return false;
  }
}
