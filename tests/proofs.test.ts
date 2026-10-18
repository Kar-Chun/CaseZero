import { it, expect } from "vitest";
import { getCase } from "../src/game/cases";
import {
  combine,
  discover,
  startCase,
  freshState,
  answer,
  canAccuse,
  accuse,
} from "../src/game/engine";
import { parseSave } from "../src/game/storage";
import { validateCase } from "../src/game/validation";
import { solveCase, solveRadio, solveConservatory } from "./helpers";
it("supports both museum opportunity routes and completes without the usher record", () => {
  let s = startCase(freshState());
  for (const id of [
    "E01",
    "E02",
    "E05",
    "E06",
    "E07",
    "E09",
    "E10",
    "E13",
    "E14",
  ])
    s = discover(s, id);
  s = answer(answer(s, "T03"), "T04");
  s = discover(discover(s, "E08"), "E12");
  for (const path of [
    ["E02", "E05", "E06"],
    ["E09", "E10", "E12"],
    ["E05", "E07", "E08"],
  ])
    s = combine(s, path).state;
  s = discover(s, "E15");
  s = combine(s, ["E13", "E14", "E15"]).state;
  s = discover(s, "E16");
  expect(canAccuse(s)).toBe(true);
  expect(s.evidence).not.toContain("E04");
  expect(s.proofs.D03).toEqual(["E05", "E07", "E08"]);
  expect(parseSave(JSON.stringify(s))).toEqual(s);
  const canonical = solveCase();
  expect(canonical.proofs.D03).toEqual(["E04", "E07", "E08"]);
});
it("rejects every insufficient subset, duplicate and unrelated extra card", () => {
  const complete = solveCase();
  for (const route of [
    ["E04", "E07", "E08"],
    ["E05", "E07", "E08"],
  ]) {
    const { D03: ignored, ...proofs } = complete.proofs;
    void ignored;
    const s = {
      ...complete,
      deductions: complete.deductions.filter((id) => id !== "D03"),
      proofs,
    };
    for (const missing of route)
      expect(
        combine(
          s,
          route.filter((id) => id !== missing),
        ).state,
      ).toBe(s);
    expect(combine(s, [...route, "E03"]).state).toBe(s);
    expect(combine(s, [route[0], route[0], route[2]]).state).toBe(s);
  }
});
it("can revise a supported proof without duplicating a conclusion", () => {
  const canonical = solveCase();
  const alternative = combine(canonical, ["E05", "E07", "E08"]).state;
  expect(alternative.deductions).toEqual(canonical.deductions);
  expect(alternative.proofs.D03).toEqual(["E05", "E07", "E08"]);
  expect(canonical.proofs.D03).toEqual(["E04", "E07", "E08"]);
  expect(combine(alternative, ["E08", "E05", "E07"]).state).toBe(alternative);
});
it("migrates valid v2 partial/completed saves in every case with their original canonical proof", () => {
  for (const s of [
    discover(startCase(freshState()), "E01"),
    solveCase(),
    solveRadio(),
    solveConservatory(),
  ]) {
    const { proofs, ...old } = s;
    expect(parseSave(JSON.stringify({ ...old, version: 2 }))).toEqual({
      ...s,
      proofs,
    });
  }
  const complete = solveCase();
  const { proofs, ...old } = complete;
  void proofs;
  // This old-format state was never valid before alternatives existed.
  expect(
    parseSave(
      JSON.stringify({
        ...old,
        version: 2,
        evidence: old.evidence.filter((id) => id !== "E04"),
      }),
    ),
  ).toBeNull();
});
it("rejects malformed, missing, unowned or foreign proof records and circular alternatives", () => {
  const s = solveCase();
  for (const proofs of [
    {},
    { ...s.proofs, D03: ["E04", "E07"] },
    { ...s.proofs, unknown: ["E01", "E02"] },
    { ...s.proofs, D03: ["E21", "E27", "E28"] },
  ])
    expect(parseSave(JSON.stringify({ ...s, proofs }))).toBeNull();
  const c = structuredClone(getCase());
  c.deductions[2].alternatives = [["E16", "E07"]];
  expect(validateCase(c)).toContain("D03: circular or unreachable proof");
  c.deductions[2].alternatives = [["E01", "E05", "E06"]];
  expect(validateCase(c)).toContain("D03: ambiguous recipe");
});

it("migrates v2 correct and incorrect submitted accounts for every case without changing their evidence", () => {
  for (const [state, value] of [
    [solveCase(), { suspect: "S01", method: "M02", motive: "R03" }],
    [solveRadio(), { suspect: "S13", method: "M12", motive: "R12" }],
    [solveConservatory(), { suspect: "S21", method: "M22", motive: "R23" }],
  ] as const) {
    for (const submitted of [
      value,
      {
        ...value,
        suspect: getCase(state.caseId).suspects.find(
          (s) => s.id !== value.suspect,
        )!.id,
      },
    ]) {
      const ending = accuse(state, submitted);
      const { proofs, ...legacy } = ending;
      expect(parseSave(JSON.stringify({ ...legacy, version: 2 }))).toEqual({
        ...ending,
        proofs,
      });
    }
  }
});
