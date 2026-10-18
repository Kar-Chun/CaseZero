import { proofSets } from "./proofs";
import { deductionAnswers } from "./deduction-rules";
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
    for (const path of proofSets(d)) {
      const signature = [...path].sort().join("|");
      if (recipes.has(signature)) issues.push(`${d.id}: ambiguous recipe`);
      recipes.add(signature);
      check(d.id, { evidence: path });
      if (path.length < 2 || new Set(path).size !== path.length)
        issues.push(`${d.id}: invalid recipe`);
    }
    check(d.id, d.requires ?? {});
  }
  for (const i of content.inspections ?? []) {
    check(i.id, i.requires);
    if (!content.evidence.some((e) => e.id === i.evidenceId))
      issues.push(`${i.id}: unknown evidence reward`);
  }
  function closure(exclude?: string) {
    const reached = {
      evidence: new Set<string>(),
      deductions: new Set<string>(),
      answers: new Set<string>(),
      inspections: new Set<string>(),
    };
    const ready = (req: Requirement) =>
      (["evidence", "deductions", "answers", "inspections"] as const).every(
        (k) => (req[k] ?? []).every((id) => reached[k].has(id)),
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
        if (
          d.id !== exclude &&
          proofSets(d).some((path) => ready({ evidence: path })) &&
          ready(d.requires ?? {})
        )
          add("deductions", d.id);
    }
    return reached;
  }
  const reached = closure();
  for (const d of content.deductions) {
    const without = closure(d.id);
    for (const path of proofSets(d))
      if (!path.every((id) => without.evidence.has(id)))
        issues.push(`${d.id}: circular or unreachable proof`);
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
  for (const d of definition.deductions) {
    if (
      d.interpretations &&
      (d.interpretations.length < 2 ||
        new Set(d.interpretations.map((o) => o.id)).size !==
          d.interpretations.length ||
        !d.interpretations.some(
          (o) => o.id === deductionAnswers[definition.id]?.[d.id],
        ))
    )
      issues.push(`${d.id}: invalid deduction explanations`);
  }
  const rewards = new Set<string>();
  for (const i of definition.inspections) {
    if (rewards.has(i.evidenceId))
      issues.push(`${i.id}: ambiguous analysis reward`);
    rewards.add(i.evidenceId);
    const answer = inspectionAnswers[definition.id]?.[i.id];
    const solution = answer?.split(":");
    if (
      i.kind === "clock"
        ? !answer || !/^([01]\d|2[0-3]):[0-5]\d$/.test(answer)
        : !solution ||
          solution.length !== i.panels.length ||
          (i.kind === "sequence" &&
            new Set(solution).size !== solution.length) ||
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
      i.panels.length !==
        (i.kind === "clock" ? 1 : i.kind === "comparison" ? 2 : 4) ||
      i.panels.some(
        (p) =>
          (i.kind !== "clock" && p.options.length < 2) ||
          new Set(p.options.map((o) => o.id)).size !== p.options.length,
      )
    )
      issues.push(`${i.id}: invalid activity options`);
    if (
      i.kind === "sequence" &&
      i.panels.some(
        (p) =>
          p.options.length !== i.panels.length ||
          !i.panels.every((other) =>
            other.options.every((o) =>
              p.options.some((candidate) => candidate.id === o.id),
            ),
          ),
      )
    )
      issues.push(`${i.id}: inconsistent sequence events`);
    const reward = definition.evidence.find((e) => e.id === i.evidenceId);
    if (
      reward &&
      (["evidence", "deductions", "answers", "inspections"] as const).some(
        (key) =>
          (reward.requires[key] ?? []).some(
            (id) =>
              !(key === "inspections" && id === i.id) &&
              !i.requires[key]?.includes(id),
          ),
      )
    )
      issues.push(`${i.id}: reward has unsupported prerequisites`);
  }
  return issues;
}
