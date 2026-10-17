import { describe, it, expect } from "vitest";
import { cases, getCase } from "../src/game/cases";
import { validateCase, validateContent } from "../src/game/validation";
import {
  freshState,
  startCase,
  discover,
  answer,
  combine,
  analyze,
  canAccuse,
  accuse,
} from "../src/game/engine";
import { parseSave } from "../src/game/storage";
import { evaluate } from "../src/game/outcome";
import { solveRadio } from "./helpers";
const radio = getCase("dead-air");
describe("Dead Air", () => {
  it("authors complete reachable cases with different settings and deduction sizes", () => {
    expect(cases).toHaveLength(3);
    expect(radio.evidence).toHaveLength(14);
    expect(radio.locations).toHaveLength(4);
    expect(radio.suspects).toHaveLength(4);
    for (const c of cases) expect(validateCase(c)).toEqual([]);
    expect(new Set(radio.deductions.map((d) => d.evidence.length))).toEqual(
      new Set([2, 3]),
    );
  });
  it("requires original records before clock analysis, rejects bad corrections and records the result once", () => {
    let s = startCase(freshState("dead-air"));
    expect(discover(s, "E23")).toBe(s);
    expect(analyze(s, "I11", "22:06").state).toBe(s);
    s = discover(discover(s, "E21"), "E22");
    for (const time of ["22:20", "22:13", "not-time", "25:00"])
      expect(analyze(s, "I11", time).state).toBe(s);
    const next = analyze(s, "I11", "22:06");
    expect(next.solved).toBe(true);
    expect(next.state.inspections).toEqual(["I11"]);
    expect(next.state.evidence).toContain("E23");
    expect(s.evidence).not.toContain("E23");
    expect(analyze(next.state, "I11", "22:06").state).toBe(next.state);
  });
  it("requires the rider interview and a specific contradictory pair", () => {
    let s = discover(startCase(freshState("dead-air")), "E30");
    expect(analyze(s, "I12", "A1:B2").solved).toBe(false);
    s = answer(s, "T24");
    for (const pair of ["A1:B1", "A2:B1", "A2:B2", "A1:missing"])
      expect(analyze(s, "I12", pair).state).toBe(s);
    const result = analyze(s, "I12", "A1:B2");
    expect(result.state.evidence).toContain("E33");
    expect(result.state.inspections).toContain("I12");
  });
  it("finds activity dependency cycles and rejects inconsistent saved activity rewards", () => {
    const broken = structuredClone(radio);
    broken.inspections[0].requires = { evidence: ["E23"] };
    expect(validateContent(broken)).toContain("Unreachable inspections: I11");
    expect(validateContent(broken)).toContain("Unreachable evidence: E34");
    const solved = solveRadio();
    expect(parseSave(JSON.stringify(solved))).toEqual(solved);
    expect(
      parseSave(
        JSON.stringify({
          ...solved,
          evidence: solved.evidence.filter((e) => e !== "E23"),
        }),
      ),
    ).toBeNull();
  });
  it.each(radio.dialogue.filter((t) => Object.keys(t.requires).length))(
    "enforces the full $id interview branch",
    (t) => {
      const s = startCase(freshState("dead-air"));
      expect(answer(s, t.id)).toBe(s);
      const ready = {
        ...s,
        evidence: t.requires.evidence ?? [],
        deductions: t.requires.deductions ?? [],
      };
      expect(answer(ready, t.id).answers).toContain(t.id);
      for (const key of ["evidence", "deductions"] as const)
        for (const missing of t.requires[key] ?? []) {
          const incomplete = {
            ...ready,
            [key]: ready[key].filter((id) => id !== missing),
          };
          expect(answer(incomplete, t.id)).toBe(incomplete);
        }
    },
  );
  it("completes all fourteen clues, both analyses and four conclusions without an original-case clue", () => {
    const s = solveRadio();
    expect(s.evidence).toHaveLength(14);
    expect(s.inspections).toHaveLength(2);
    expect(s.deductions).toHaveLength(4);
    expect(canAccuse(s)).toBe(true);
    expect(discover(s, "E01")).toBe(s);
    expect(combine(s, ["E01", "E05", "E06"]).state).toBe(s);
    expect(
      evaluate(
        accuse(s, { suspect: "S13", method: "M12", motive: "R12" }).accusation!,
        "dead-air",
      ).correct,
    ).toBe(true);
  });
  it("rejects an innocent suspect and correct-suspect incorrect reasoning", () => {
    for (const a of [
      { suspect: "S11", method: "M12", motive: "R12" },
      { suspect: "S13", method: "M11", motive: "R12" },
      { suspect: "S13", method: "M12", motive: "R11" },
    ])
      expect(evaluate(a, "dead-air").correct).toBe(false);
    expect(
      analyze(
        accuse(solveRadio(), { suspect: "S13", method: "M12", motive: "R12" }),
        "I11",
        "22:06",
      ).solved,
    ).toBe(false);
  });
});

it("requires the corrected window before identifying opportunity, including in restored saves", () => {
  const solved = solveRadio(),
    premature = {
      ...solved,
      deductions: solved.deductions.filter(
        (id) => id !== "D12" && id !== "D13",
      ),
      evidence: solved.evidence.filter((id) => id !== "E34"),
    };
  expect(combine(premature, ["E26", "E27", "E28"]).message).toMatch(
    /earlier conclusion/,
  );
  expect(combine(premature, ["E26", "E27", "E28"]).state).toBe(premature);
  expect(
    parseSave(
      JSON.stringify({
        ...premature,
        deductions: [...premature.deductions, "D13"],
      }),
    ),
  ).toBeNull();
});
