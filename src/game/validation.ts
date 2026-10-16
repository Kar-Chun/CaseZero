import { inspectionAnswers } from "./inspection-rules";
import { locations, evidence, suspects, dialogue, deductions } from "./content";
import type {
  Location,
  Evidence,
  Suspect,
  Dialogue,
  Deduction,
  Requirement,
  Inspection,
  CaseDefinition,
} from "./types";
export type CaseContent = {
  locations: Location[];
  evidence: Evidence[];
  suspects: Suspect[];
  dialogue: Dialogue[];
  deductions: Deduction[];
  inspections?: Inspection[];
};
export const caseContent: CaseContent = {
  locations,
  evidence,
  suspects,
  dialogue,
  deductions,
};
/** Reference checks plus monotonic closure: every node must be obtainable from a fresh case. */
export function validateContent(content: CaseContent = caseContent): string[] {
  const issues: string[] = [];
  const groups = {
    evidence: content.evidence,
    deductions: content.deductions,
    answers: content.dialogue,
    inspections: content.inspections ?? [],
  };
  const nodes = [
    ...content.locations,
    ...content.evidence,
    ...content.suspects,
    ...content.dialogue,
    ...content.deductions,
    ...(content.inspections ?? []),
  ];
  const seen = new Set<string>();
  for (const n of nodes) {
    if (seen.has(n.id)) issues.push(`Duplicate ID: ${n.id}`);
    seen.add(n.id);
  }
  const check = (id: string, req: Requirement) => {
    for (const key of [
      "evidence",
      "deductions",
      "answers",
      "inspections",
    ] as const)
      for (const ref of req[key] ?? [])
        if (!groups[key].some((n) => n.id === ref))
          issues.push(`${id}: unknown ${key} ${ref}`);
  };
  for (const e of content.evidence) {
    if (!content.locations.some((l) => l.id === e.location))
      issues.push(`${e.id}: unknown location`);
    check(e.id, e.requires);
  }
  for (const t of content.dialogue) {
    if (!content.suspects.some((s) => s.id === t.suspect))
      issues.push(`${t.id}: unknown suspect`);
    check(t.id, t.requires);
  }
  const recipes = new Set<string>();
  for (const d of content.deductions) {
    const signature = [...d.evidence].sort().join("|");
    if (recipes.has(signature)) issues.push(`${d.id}: ambiguous recipe`);
    recipes.add(signature);
    check(d.id, { evidence: d.evidence });
    check(d.id, d.requires ?? {});
    if (d.evidence.length < 2 || new Set(d.evidence).size !== d.evidence.length)
      issues.push(`${d.id}: invalid recipe`);
  }
  for (const i of content.inspections ?? []) {
    check(i.id, i.requires);
    if (!content.evidence.some((e) => e.id === i.evidenceId))
      issues.push(`${i.id}: unknown evidence reward`);
  }
  const reached = {
    evidence: new Set<string>(),
    deductions: new Set<string>(),
    answers: new Set<string>(),
    inspections: new Set<string>(),
  };
  const ready = (req: Requirement) =>
    (["evidence", "deductions", "answers", "inspections"] as const).every((k) =>
      (req[k] ?? []).every((id) => reached[k].has(id)),
    );
  let changed = true;
  while (changed) {
    changed = false;
    const add = (kind: keyof typeof reached, id: string) => {
      if (!reached[kind].has(id)) {
        reached[kind].add(id);
        changed = true;
      }
    };
    for (const e of content.evidence)
      if (ready(e.requires)) add("evidence", e.id);
    for (const t of content.dialogue)
      if (ready(t.requires)) add("answers", t.id);
    for (const i of content.inspections ?? [])
      if (ready(i.requires)) add("inspections", i.id);
    for (const d of content.deductions)
      if (ready({ evidence: d.evidence }) && ready(d.requires ?? {}))
        add("deductions", d.id);
  }
  for (const key of [
    "evidence",
    "deductions",
    "answers",
    "inspections",
  ] as const)
    for (const n of groups[key])
      if (!reached[key].has(n.id)) issues.push(`Unreachable ${key}: ${n.id}`);
  return issues;
}

export function validateCase(definition: CaseDefinition): string[] {
  const issues = validateContent(definition);
  if (
    !definition.evidence.some((e) => e.id === definition.resolution.evidenceId)
  )
    issues.push("Unknown final evidence");
  for (const i of definition.inspections) {
    const answer = inspectionAnswers[definition.id]?.[i.id];
    const solution = answer?.split(":");
    if (
      i.kind === "clock"
        ? !answer || !/^([01]\d|2[0-3]):[0-5]\d$/.test(answer)
        : !solution ||
          solution.length !== i.panels.length ||
          !i.panels.every((p, index) =>
            p.options.some((o) => o.id === solution[index]),
          )
    )
      issues.push(`${i.id}: invalid analysis solution`);
    if (
      !definition.evidence
        .find((e) => e.id === i.evidenceId)
        ?.requires.inspections?.includes(i.id)
    )
      issues.push(`${i.id}: reward must require analysis`);
    if (
      i.panels.length !== (i.kind === "clock" ? 1 : 2) ||
      i.panels.some(
        (p) =>
          (i.kind === "comparison" && p.options.length < 2) ||
          new Set(p.options.map((o) => o.id)).size !== p.options.length,
      )
    )
      issues.push(`${i.id}: invalid activity options`);
  }
  return issues;
}
