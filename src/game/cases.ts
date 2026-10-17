import { afterTheFlood } from "./episodes/003";
import { deadAir } from "./episodes/002";
import { quietHour } from "./content";
import type { CaseId, CaseDefinition } from "./types";
export const cases: CaseDefinition[] = [quietHour, deadAir, afterTheFlood];
export function isCaseId(value: unknown): value is CaseId {
  return typeof value === "string" && cases.some((c) => c.id === value);
}
export function getCase(id: CaseId = "quiet-hour"): CaseDefinition {
  const definition = cases.find((c) => c.id === id);
  if (!definition) throw new Error("Unknown case");
  return definition;
}

export function isHintKey(definition: CaseDefinition, key: string): boolean {
  const [kind, id, extra] = key.split(":");
  if (!id || extra) return false;
  switch (kind) {
    case "evidence":
      return definition.evidence.some((e) => e.id === id);
    case "deduction":
      return definition.deductions.some((d) => d.id === id);
    case "interview":
      return definition.dialogue.some((t) => t.id === id);
    case "inspection":
      return definition.inspections.some((i) => i.id === id);
    default:
      return false;
  }
}
