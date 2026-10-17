import { describe, it, expect } from "vitest";
import { getCase } from "../src/game/cases";
import { validateCase } from "../src/game/validation";
import {
  freshState,
  startCase,
  discover,
  answer,
  analyze,
  combine,
  canAccuse,
  accuse,
  resumeInvestigation,
} from "../src/game/engine";
import { parseSave, saveGame, loadGame, clearGame } from "../src/game/storage";
import { evaluate } from "../src/game/outcome";
import { solveCase, solveRadio, solveConservatory } from "./helpers";
const c = getCase("after-the-flood");
const ready = () =>
  ["E41", "E44", "E45", "E46"].reduce(discover, startCase(freshState(c.id)));
const permutations = (ids: string[]): string[][] =>
  ids.length
    ? ids.flatMap((id, i) =>
        permutations(ids.filter((_, j) => j !== i)).map((tail) => [
          id,
          ...tail,
        ]),
      )
    : [[]];
describe("After the Flood reasoning", () => {
  it("has one supported chronology out of every distinct event permutation", () => {
    expect(validateCase(c)).toEqual([]);
    const s = ready();
    const orders = permutations(["V1", "V2", "V3", "V4"]);
    expect(orders).toHaveLength(24);
    const accepted = orders.filter(
      (ids) => analyze(s, "I21", ids.join(":")).solved,
    );
    expect(accepted).toEqual([["V3", "V1", "V4", "V2"]]);
    const solved = analyze(s, "I21", accepted[0].join(":")).state;
    expect(solved.inspections).toEqual(["I21"]);
    expect(solved.evidence).toContain("E47");
    expect(parseSave(JSON.stringify(solved))).toEqual(solved);
    expect(analyze(solved, "I21", "V3:V1:V4:V2").state).toBe(solved);
  });
  it("rejects locked, duplicate, unknown and missing sequence events without side effects", () => {
    const s = ready();
    for (const missing of c.inspections[0].requires.evidence!) {
      const incomplete = {
        ...s,
        evidence: s.evidence.filter((id) => id !== missing),
      };
      expect(analyze(incomplete, "I21", "V3:V1:V4:V2").state).toBe(incomplete);
    }
    for (const order of [
      "V3:V3:V4:V2",
      "V3:V1:V4",
      "V3:V1:V4:unknown",
      "V3:V1:V4:V2:V2",
      "",
    ])
      expect(analyze(s, "I21", order).state).toBe(s);
    expect(discover(s, "E47")).toBe(s);
  });
  it("requires evidence AND a supported explanation; unrelated or duplicate clues cannot form a conclusion", () => {
    const complete = solveConservatory();
    for (const d of c.deductions) {
      const s = {
        ...complete,
        evidence: complete.evidence.filter((id) => id !== "E54"),
        deductions: complete.deductions.filter((id) => id !== d.id),
      };
      expect(combine(s, d.evidence).state).toBe(s);
      expect(combine(s, d.evidence, "unknown").state).toBe(s);
      const successes = d.interpretations!.filter(
        (option) => combine(s, d.evidence, option.id).deductionId,
      );
      expect(successes).toHaveLength(1);
      for (const missing of d.evidence)
        expect(
          combine(
            s,
            d.evidence.filter((id) => id !== missing),
            successes[0].id,
          ).state,
        ).toBe(s);
    }
    expect(
      combine(startCase(freshState(c.id)), ["E01", "E05"], "C1").state
        .deductions,
    ).toEqual([]);
    expect(combine(complete, ["E48", "E48"], "C1").deductionId).toBeUndefined();
  });
  it("requires the reconstructed window before identifying opportunity and rejects premature saves", () => {
    const complete = solveConservatory();
    const s = {
      ...complete,
      evidence: complete.evidence.filter((id) => id !== "E54"),
      deductions: ["D21", "D24"],
    };
    expect(combine(s, ["E48", "E49"], "C1").message).toMatch(
      /earlier conclusion/,
    );
    expect(
      parseSave(JSON.stringify({ ...s, deductions: [...s.deductions, "D23"] })),
    ).toBeNull();
    expect(
      parseSave(JSON.stringify({ ...complete, inspections: [] })),
    ).toBeNull();
  });
  it.each(c.dialogue.filter((t) => Object.keys(t.requires).length))(
    "enforces every dependency of $id",
    (t) => {
      const solved = solveConservatory();
      expect(answer(solved, t.id).answers).toContain(t.id);
      for (const key of ["evidence", "deductions"] as const)
        for (const id of t.requires[key] ?? []) {
          const incomplete = {
            ...solved,
            [key]: solved[key].filter((value) => value !== id),
            answers: [],
          };
          expect(answer(incomplete, t.id)).toBe(incomplete);
        }
    },
  );
  it("reaches final proof without optional red herrings and supports both endings and retry", () => {
    const s = solveConservatory(false);
    expect(s.evidence).toHaveLength(13);
    expect(s.evidence).not.toContain("E51");
    expect(canAccuse(s)).toBe(true);
    for (const value of [
      { suspect: "S21", method: "M22", motive: "R23" },
      { suspect: "S23", method: "M22", motive: "R23" },
      { suspect: "S21", method: "M21", motive: "R23" },
      { suspect: "S21", method: "M22", motive: "R22" },
    ]) {
      const ending = accuse(s, value);
      expect(evaluate(value, c.id).correct).toBe(
        value.suspect === "S21" &&
          value.method === "M22" &&
          value.motive === "R23",
      );
      expect(parseSave(JSON.stringify(ending))).toEqual(ending);
      expect(analyze(ending, "I21", "V3:V1:V4:V2").state).toBe(ending);
      expect(combine(ending, ["E48", "E49"], "C1").state).toBe(ending);
      expect(resumeInvestigation(ending)).toEqual(s);
    }
  });
  it("keeps all three saved investigations independent, including reset", () => {
    const a = solveCase(),
      b = solveRadio(),
      third = solveConservatory();
    for (const state of [a, b, third]) saveGame(state);
    clearGame(undefined, c.id);
    expect(loadGame().state).toEqual(a);
    expect(loadGame(undefined, b.caseId).state).toEqual(b);
    expect(loadGame(undefined, c.id).state.started).toBe(false);
  });
  it("detects broken sequence/explanation answers, ambiguous rewards and unreachable activity gates", () => {
    const invalid = structuredClone(c);
    invalid.inspections[0].panels[0].options = [
      { id: "unknown", label: "Unknown event" },
    ];
    invalid.deductions[0].interpretations = [
      { id: "unknown", label: "Unsupported" },
    ];
    invalid.inspections[0].requires.evidence = ["E47"];
    invalid.inspections.push({ ...invalid.inspections[0], id: "I22" });
    const issues = validateCase(invalid);
    expect(issues).toContain("I21: invalid analysis solution");
    expect(issues).toContain("I21: inconsistent sequence events");
    expect(issues).toContain("D21: invalid deduction explanations");
    expect(issues).toContain("I22: ambiguous analysis reward");
    expect(issues).toContain("Unreachable evidence: E54");
  });
});
