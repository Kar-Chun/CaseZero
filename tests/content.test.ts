import { describe, it, expect } from "vitest";
import { caseContent, validateContent } from "../src/game/validation";
import { freshState, meets } from "../src/game/engine";
const copy = () => structuredClone(caseContent);
describe("case integrity", () => {
  it("has four suspects, four locations and sixteen reachable clues with no broken references", () => {
    expect(caseContent.suspects).toHaveLength(4);
    expect(caseContent.locations).toHaveLength(4);
    expect(caseContent.evidence).toHaveLength(16);
    expect(validateContent()).toEqual([]);
  });
  it("rejects invalid references, duplicate IDs and invalid recipes", () => {
    const c = copy();
    c.evidence[0].requires = { evidence: ["missing"] };
    c.evidence[1].id = c.evidence[0].id;
    c.deductions[0].evidence = ["E01", "E01"];
    expect(validateContent(c).join(" ")).toMatch(/unknown evidence/);
    expect(validateContent(c).join(" ")).toMatch(/Duplicate ID/);
    expect(validateContent(c).join(" ")).toMatch(/invalid recipe/);
  });
  it("detects circular interview/evidence gates and unreachable required deductions", () => {
    const c = copy();
    c.dialogue.find((t) => t.id === "T04")!.requires = { evidence: ["E08"] };
    expect(validateContent(c)).toContain("Unreachable evidence: E08");
    expect(validateContent(c)).toContain("Unreachable deductions: D03");
    expect(validateContent(c)).toContain("Unreachable evidence: E16");
  });
  it("requires every dependency and starts without spoilers or progress", () => {
    const state = freshState();
    expect(meets(state, {})).toBe(true);
    expect(meets(state, { evidence: ["E01"] })).toBe(false);
    expect(state.evidence).toEqual([]);
    expect(state.accusation).toBeNull();
  });
});
