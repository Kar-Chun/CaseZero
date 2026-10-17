import { getCase } from "./cases";
import { meets } from "./engine";
import type { GameState, Requirement } from "./types";
import type { Lead } from "./guidance";
/** Surface only actionable consequences of a fact; never reveal a locked record's contents. */
export function followUps(
  state: GameState,
  kind: "evidence" | "deductions",
  id: string,
): Lead[] {
  if (!state.started || state.accusation || !state[kind].includes(id))
    return [];
  const c = getCase(state.caseId);
  const ready = (req: Requirement) =>
    !!req[kind]?.includes(id) && meets(state, req);
  const leads: Lead[] = [];
  for (const t of c.dialogue)
    if (!state.answers.includes(t.id) && ready(t.requires))
      leads.push({
        kind: "interview",
        task: "interview",
        id: t.id,
        target: t.suspect,
        text: `Ask ${c.suspects.find((s) => s.id === t.suspect)!.name}: “${t.question}”`,
      });
  for (const i of c.inspections)
    if (!state.inspections.includes(i.id) && ready(i.requires)) {
      const e = c.evidence.find((e) => e.id === i.evidenceId)!;
      leads.push({
        kind: "location",
        task: "inspection",
        id: i.id,
        target: e.location,
        text: `Analyze ${e.point} in ${c.locations.find((l) => l.id === e.location)!.name}.`,
      });
    }
  for (const e of c.evidence)
    if (!state.evidence.includes(e.id) && ready(e.requires))
      leads.push({
        kind: "location",
        task: "evidence",
        id: e.id,
        target: e.location,
        text: `Examine ${e.point} in ${c.locations.find((l) => l.id === e.location)!.name}.`,
      });
  return leads;
}
