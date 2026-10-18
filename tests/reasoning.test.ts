import { it, expect } from "vitest";
import {
  combine,
  startCase,
  freshState,
  discover,
  answer,
  canAccuse,
} from "../src/game/engine";
import { nextLead, progressiveHint } from "../src/game/guidance";
import { statementReview } from "../src/game/statements";
import { parseSave } from "../src/game/storage";
import { solveCase, solveRadio, solveConservatory } from "./helpers";
it("guides an available alternative rather than demanding an optional canonical clue", () => {
  const s = {
    ...solveCase(),
    evidence: solveCase().evidence.filter((id) => id !== "E04"),
    deductions: ["D01", "D02"],
    proofs: { D01: ["E01", "E05", "E06"], D02: ["E09", "E10", "E12"] },
  };
  expect(nextLead(s, "D03")).toMatchObject({ task: "deduction", id: "D03" });
  const hints = progressiveHint(s, "D03");
  expect(hints.stages[0]).not.toContain("Mara");
  expect(hints.stages[2]).toContain("Credential trail");
  expect(hints.stages[2]).not.toContain("Atrium attendance");
});
it("completes the radio case through physical records without its acoustic transcript", () => {
  const full = solveRadio();
  let s = {
    ...full,
    evidence: full.evidence.filter((id) => id !== "E24"),
    deductions: full.deductions.filter((id) => id !== "D11"),
    proofs: Object.fromEntries(
      Object.entries(full.proofs).filter(([id]) => id !== "D11"),
    ),
  };
  expect(nextLead(s, "D11").task).toBe("deduction");
  expect(combine(s, ["E25"]).state).toBe(s);
  expect(combine(s, ["E26", "E29"]).state).toBe(s);
  s = combine(s, ["E25", "E26"]).state;
  expect(canAccuse(s)).toBe(true);
  expect(parseSave(JSON.stringify(s))).toEqual(s);
});
it("checks statements only when heard and corroborating records are owned", () => {
  for (const [caseId, topic, records] of [
    ["quiet-hour", "T01", ["E04"]],
    ["dead-air", "T26", ["E23", "E29"]],
    ["after-the-flood", "T41", ["E43", "E46"]],
  ] as const) {
    const s = startCase(freshState(caseId));
    expect(statementReview({ ...s, evidence: [...records] }, topic)).toBeNull();
    let heard = answer(s, topic);
    expect(statementReview(heard, topic)).toBeNull();
    heard = { ...heard, evidence: [...records] };
    expect(statementReview(heard, topic)?.evidence).toEqual(records);
    expect(statementReview({ ...heard, evidence: [] }, topic)).toBeNull();
  }
  let s = answer(startCase(freshState()), "T01");
  s = discover(s, "E04");
  expect(statementReview(s, "T01")?.finding).toBe("conflict");
});
it("gives reasoning feedback without changing evidence, proofs or pins", () => {
  const s = solveConservatory();
  const wrong = combine(s, ["E42", "E43", "E46"], "C1");
  // An existing exact proof is already established, so test the unsolved question.
  const open = {
    ...s,
    deductions: [],
    proofs: {},
    pinned: ["E42", "E43", "E46"],
  };
  const failed = combine(open, open.pinned, "C1");
  expect(failed.state).toBe(open);
  expect(failed.message).toContain("totalizer");
  expect(combine(open, ["E41", "E42"], undefined, "D21").message).toContain(
    "Which physical route",
  );
  expect(wrong.state).toBe(s);
});
