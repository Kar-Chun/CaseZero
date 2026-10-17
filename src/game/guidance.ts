import { deductionAnswers } from "./deduction-rules";
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
export function nextLead(state: GameState, goalId?: string): Lead {
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
  if (goalId) {
    const goal = c.deductions.find((d) => d.id === goalId);
    if (goal)
      return state.deductions.includes(goal.id)
        ? {
            kind: "board",
            task: "verdict",
            text: "This conclusion is already established. Review its facts on the board.",
          }
        : deduction(goal.id);
  }
  for (const d of c.deductions)
    if (!state.deductions.includes(d.id)) return deduction(d.id);
  if (!state.evidence.includes(c.resolution.evidenceId))
    return clue(c.resolution.evidenceId);
  return final;
}

export function progressiveHint(
  state: GameState,
  goalId?: string,
): { lead: Lead; key: string | null; stages: string[]; level: number } {
  const c = getCase(state.caseId),
    lead = nextLead(state, goalId);
  if (!lead.id || !lead.task || lead.task === "verdict")
    return { lead, key: null, stages: [], level: 0 };
  const key = `${lead.task}:${lead.id}`;
  let stages: string[];
  switch (lead.task) {
    case "evidence": {
      const clue = c.evidence.find((e) => e.id === lead.id)!;
      const room = c.locations.find((l) => l.id === clue.location)!;
      stages = [
        `Start with the physical records in ${room.name}. Establish a fact before judging a person.`,
        `The ${clue.point.toLowerCase()} is worth examining for the next piece of the chain.`,
        lead.text,
      ];
      break;
    }
    case "interview": {
      const line = c.dialogue.find((t) => t.id === lead.id)!;
      const person = c.suspects.find((s) => s.id === line.suspect)!;
      stages = [
        "Someone can explain one of the records you have already found. Return to the interview room.",
        `Speak to ${person.name}. Your evidence makes a more precise question possible.`,
        lead.text,
      ];
      break;
    }
    case "deduction": {
      const deduction = c.deductions.find((d) => d.id === lead.id)!;
      stages = [
        `You have the recorded facts needed for “${deduction.title}”. Think about what they establish together.`,
        deduction.prompt,
        `Pin ${deduction.evidence.map((id) => `“${c.evidence.find((e) => e.id === id)!.title}”`).join(", ")}.${deduction.interpretations ? ` Choose the explanation: “${deduction.interpretations.find((o) => o.id === deductionAnswers[c.id]?.[deduction.id])!.label}”` : ""} Then test the connection.`,
      ];
      break;
    }
    case "inspection":
      stages = c.inspections.find((i) => i.id === lead.id)!.hints;
      break;
  }
  return { lead, key, stages, level: state.hints[key] ?? 0 };
}
