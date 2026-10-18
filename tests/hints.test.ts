import { preferredProof } from "../src/game/proofs";
import { describe, it, expect } from "vitest";
import { cases, getCase } from "../src/game/cases";
import {
  freshState,
  startCase,
  discover,
  answer,
  combine,
  analyze,
  revealHint,
  pinEvidence,
  canAccuse,
} from "../src/game/engine";
import { progressiveHint, nextLead } from "../src/game/guidance";
import { deductionAnswers } from "../src/game/deduction-rules";
import { inspectionAnswers } from "../src/game/inspection-rules";
import { parseSave, saveGame, loadGame } from "../src/game/storage";
import { solveCase } from "./helpers";
describe("progressive assistance and board state", () => {
  it("reveals only one stage at a time and never grants clues or deductions", () => {
    const s = startCase(freshState()),
      hint = progressiveHint(s);
    expect(hint.level).toBe(0);
    expect(hint.stages[0]).not.toMatch(/Mara|Celia|display pedestal/i);
    let next = s;
    for (let level = 1; level <= 3; level++) {
      next = revealHint(next, hint.key!);
      expect(progressiveHint(next).level).toBe(level);
      expect(next.evidence).toBe(s.evidence);
      expect(next.answers).toBe(s.answers);
      expect(next.deductions).toBe(s.deductions);
    }
    expect(revealHint(next, hint.key!)).toBe(next);
    expect(revealHint(s, "unknown:secret")).toBe(s);
    expect(revealHint(freshState(), hint.key!)).toEqual(freshState());
  });
  it.each(cases)(
    "offers an actionable next step through the complete $title investigation",
    (c) => {
      let s = startCase(freshState(c.id));
      for (let n = 0; n < 100 && !canAccuse(s); n++) {
        const hint = progressiveHint(s);
        expect(hint.key).not.toBeNull();
        s = revealHint(s, hint.key!);
        const before = s,
          lead = nextLead(s);
        switch (lead.task) {
          case "evidence":
            s = discover(s, lead.id!);
            break;
          case "interview":
            s = answer(s, lead.id!);
            break;
          case "inspection":
            s = analyze(s, lead.id!, inspectionAnswers[c.id]![lead.id!]).state;
            break;
          case "deduction":
            s = combine(
              s,
              preferredProof(s, c.deductions.find((d) => d.id === lead.id)!),
              deductionAnswers[c.id]?.[lead.id!],
            ).state;
            break;
          default:
            throw Error("Unusable guidance");
        }
        expect(s).not.toBe(before);
      }
      expect(canAccuse(s)).toBe(true);
      expect(parseSave(JSON.stringify(s))).toEqual(s);
    },
  );
  it("follows a focused question into unmet time-analysis prerequisites", () => {
    let s = startCase(freshState("dead-air"));
    s = discover(discover(s, "E21"), "E22");
    const hint = progressiveHint(s, "D13");
    expect(hint.lead.task).toBe("inspection");
    expect(hint.lead.id).toBe("I11");
    expect(hint.stages[0]).not.toContain("22:06");
    expect(hint.stages[2]).toContain("Subtract");
  });
  it("persists valid pins and refuses duplicate, unknown, undiscovered or oversized threads", () => {
    const s = solveCase();
    const pinned = pinEvidence(s, ["E01", "E06"]);
    expect(pinned.pinned).toEqual(["E01", "E06"]);
    expect(pinEvidence(pinned, ["E01", "E06"])).toBe(pinned);
    for (const ids of [
      ["E01", "E01"],
      ["unknown"],
      ["E01", "E02", "E03", "E04"],
    ])
      expect(pinEvidence(s, ids)).toBe(s);
    expect(pinEvidence(startCase(freshState()), ["E01"]).pinned).toEqual([]);
    expect(parseSave(JSON.stringify(pinned))).toEqual(pinned);
  });
  it("stores hint stages independently for each case", () => {
    const a = revealHint(startCase(freshState()), "evidence:E01"),
      b = revealHint(startCase(freshState("dead-air")), "evidence:E24");
    saveGame(a);
    saveGame(b);
    expect(loadGame().state.hints).toEqual({ "evidence:E01": 1 });
    expect(loadGame(undefined, "dead-air").state.hints).toEqual({
      "evidence:E24": 1,
    });
    expect(getCase("dead-air").title).toBe("Dead Air");
  });
});
