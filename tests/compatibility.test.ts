import { describe, it, expect } from "vitest";
import { freshState, discover, startCase } from "../src/game/engine";
import { getCase, cases, isCaseId } from "../src/game/cases";
import { parseSave } from "../src/game/storage";
import {
  validateCase,
  validateContent,
  caseContent,
} from "../src/game/validation";
import { solveCase } from "./helpers";
describe("case model and legacy migration", () => {
  it("keeps registry metadata and original content references consistent", () => {
    expect(getCase().id).toBe("quiet-hour");
    expect(isCaseId("missing")).toBe(false);
    for (const c of cases) expect(validateCase(c)).toEqual([]);
    expect(getCase().evidence).toBe(caseContent.evidence);
  });
  it("migrates original partial and ending v1 saves without losing progress", () => {
    for (const state of [
      discover(startCase(freshState()), "E01"),
      {
        ...solveCase(),
        accusation: { suspect: "S01", method: "M02", motive: "R03" },
        notes: "Preserve my original notes.",
      },
    ]) {
      const { inspections, hints, pinned, ...legacy } = state;
      void inspections;
      void hints;
      void pinned;
      const restored = parseSave(JSON.stringify({ ...legacy, version: 1 }));
      expect(restored).toEqual({
        ...state,
        version: 3,
        inspections: [],
        hints: {},
        pinned: [],
      });
    }
  });
  it("rejects malformed new state fields and hints without granting progress", () => {
    const state = discover(startCase(freshState()), "E01");
    for (const patch of [
      { inspections: ["missing"] },
      { pinned: ["E02"] },
      { pinned: ["E01", "E01"] },
      { hints: { "evidence:E01": 4 } },
      { hints: { "evidence:missing": 1 } },
      { hints: { "evidence:E01": 1.5 } },
    ])
      expect(parseSave(JSON.stringify({ ...state, ...patch }))).toBeNull();
    expect(
      parseSave(
        JSON.stringify({
          ...state,
          pinned: ["E01"],
          hints: { "evidence:E01": 2 },
        }),
      )?.pinned,
    ).toEqual(["E01"]);
  });
  it("detects ambiguous combinations instead of silently making a conclusion unreachable", () => {
    const data = structuredClone(caseContent);
    data.deductions[1].evidence = [...data.deductions[0].evidence].reverse();
    expect(validateContent(data).join(" ")).toMatch(/ambiguous recipe/);
  });
});
