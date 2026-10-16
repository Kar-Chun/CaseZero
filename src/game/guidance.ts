import { getCase } from "./cases";
import type { GameState, Requirement } from "./types";
export type Lead = {
  kind: "location" | "interview" | "board" | "verdict";
  target?: string;
  text: string;
  task?: "evidence" | "interview" | "deduction" | "inspection" | "verdict";
  id?: string;
};
/** Follow unmet prerequisites instead of pointing players at a still-locked record. */
export function nextLead(state: GameState): Lead {
  const c = getCase(state.caseId),
    visited = new Set<string>();
  const final: Lead = {
    kind: "verdict",
    task: "verdict",
    text: "Your chain of proof is complete. Review the person, method and motive, then submit your account.",
  };
  function prerequisites(req: Requirement): Lead | null {
    for (const id of req.evidence ?? [])
      if (!state.evidence.includes(id)) return clue(id);
    for (const id of req.answers ?? [])
      if (!state.answers.includes(id)) return interview(id);
    for (const id of req.deductions ?? [])
      if (!state.deductions.includes(id)) return deduction(id);
    for (const id of req.inspections ?? [])
      if (!state.inspections.includes(id)) return inspection(id);
    return null;
  }
  function clue(id: string): Lead {
    const item = c.evidence.find((e) => e.id === id)!;
    if (visited.has(`e${id}`)) return final;
    visited.add(`e${id}`);
    return (
      prerequisites(item.requires) ?? {
        kind: "location",
        task: "evidence",
        id,
        target: item.location,
        text: `Examine the ${item.point.toLowerCase()} in ${c.locations.find((l) => l.id === item.location)!.name}.`,
      }
    );
  }
  function interview(id: string): Lead {
    const line = c.dialogue.find((t) => t.id === id)!;
    if (visited.has(`t${id}`)) return final;
    visited.add(`t${id}`);
    return (
      prerequisites(line.requires) ?? {
        kind: "interview",
        task: "interview",
        id,
        target: line.suspect,
        text: `Ask ${c.suspects.find((s) => s.id === line.suspect)!.name}: “${line.question}”`,
      }
    );
  }
  function deduction(id: string): Lead {
    const item = c.deductions.find((d) => d.id === id)!;
    if (visited.has(`d${id}`)) return final;
    visited.add(`d${id}`);
    return (
      prerequisites(item.requires ?? {}) ??
      prerequisites({ evidence: item.evidence }) ?? {
        kind: "board",
        task: "deduction",
        id,
        text: item.prompt,
      }
    );
  }
  function inspection(id: string): Lead {
    const item = c.inspections.find((i) => i.id === id)!;
    if (visited.has(`i${id}`)) return final;
    visited.add(`i${id}`);
    return (
      prerequisites(item.requires) ?? {
        kind: "location",
        task: "inspection",
        id,
        target: c.evidence.find((e) => e.id === item.evidenceId)!.location,
        text: item.instruction,
      }
    );
  }
  for (const d of c.deductions)
    if (!state.deductions.includes(d.id)) return deduction(d.id);
  if (!state.evidence.includes(c.resolution.evidenceId))
    return clue(c.resolution.evidenceId);
  return final;
}
