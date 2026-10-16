import { parseSave } from "./storage";
import { getCase } from "./cases";
import type { GameState, CaseId } from "./types";
export const MAX_BACKUP_SIZE = 64 * 1024;
export function exportBackup(state: GameState): string {
  return JSON.stringify(
    { format: "casezero-investigation", version: 1, state },
    null,
    2,
  );
}
export function importBackup(
  raw: string,
  expectedCase: CaseId,
): { state: GameState | null; error: string | null } {
  if (raw.length > MAX_BACKUP_SIZE)
    return {
      state: null,
      error:
        "That backup is too large. Choose a CaseZero investigation export.",
    };
  try {
    const value: unknown = JSON.parse(raw);
    let state: GameState | null;
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      "format" in value
    ) {
      if (
        value.format !== "casezero-investigation" ||
        !("version" in value) ||
        value.version !== 1 ||
        !("state" in value)
      )
        return {
          state: null,
          error: "This is not a supported CaseZero backup.",
        };
      state = parseSave(JSON.stringify(value.state));
    } else state = parseSave(raw);
    if (!state)
      return {
        state: null,
        error:
          "This backup is invalid or from an unsupported version. Your progress has not changed.",
      };
    if (state.caseId !== expectedCase)
      return {
        state: null,
        error: `This backup belongs to ${getCase(state.caseId).title}. Open that case before importing it.`,
      };
    return { state, error: null };
  } catch {
    return {
      state: null,
      error:
        "This is not a valid CaseZero backup. Choose an exported investigation file.",
    };
  }
}
