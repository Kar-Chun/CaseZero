import { describe, it, expect } from "vitest";
import { freshState, startCase, discover, meets } from "../src/game/engine";
import { evidence } from "../src/game/content";
describe("evidence discovery", () => {
  it("requires an active investigation, known clue, and met prerequisites", () => {
    const initial = freshState();
    expect(discover(initial, "E01")).toBe(initial);
    const state = startCase(initial);
    expect(discover(state, "unknown")).toBe(state);
    expect(discover(state, "E02")).toBe(state);
    expect(discover(state, "E08")).toBe(state);
    expect(discover(state, "E16")).toBe(state);
  });
  it("records once and unlocks a related clue without mutating earlier state", () => {
    const initial = startCase(freshState());
    const one = discover(initial, "E01");
    expect(initial.evidence).toEqual([]);
    expect(one.evidence).toEqual(["E01"]);
    expect(discover(one, "E01")).toBe(one);
    expect(discover(one, "E02").evidence).toEqual(["E01", "E02"]);
  });
  it("keeps inventory consistent with available search points and locks", () => {
    let state = startCase(freshState());
    for (const e of evidence)
      if (meets(state, e.requires)) state = discover(state, e.id);
    expect(state.evidence).toHaveLength(12);
    expect(new Set(state.evidence).size).toBe(12);
    expect(state.evidence).not.toContain("E08");
    expect(state.evidence).not.toContain("E12");
    expect(state.evidence).not.toContain("E15");
    expect(state.evidence).not.toContain("E16");
  });
});
