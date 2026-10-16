import { deadAir } from "./episodes/002";
import { quietHour } from "./content";
import type { CaseId, CaseDefinition } from "./types";
export const cases: CaseDefinition[] = [quietHour, deadAir];
export function isCaseId(value: unknown): value is CaseId {
  return typeof value === "string" && cases.some((c) => c.id === value);
}
export function getCase(id: CaseId = "quiet-hour"): CaseDefinition {
  const definition = cases.find((c) => c.id === id);
  if (!definition) throw new Error("Unknown case");
  return definition;
}
