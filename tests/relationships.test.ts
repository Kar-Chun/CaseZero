import { it, expect } from "vitest";
import { followUps } from "../src/game/relationships";
import { freshState, startCase, discover, answer } from "../src/game/engine";
import { solveCase } from "./helpers";
it("surfaces only reachable follow-up questions and removes answered topics", () => {
  let s = discover(startCase(freshState("after-the-flood")), "E42");
  expect(followUps(s, "evidence", "E42")).toEqual([
    expect.objectContaining({ kind: "interview", id: "T44", target: "S22" }),
  ]);
  s = answer(s, "T44");
  expect(followUps(s, "evidence", "E42")).toEqual([]);
  expect(followUps(s, "evidence", "E46")).toEqual([]);
  expect(followUps(freshState(), "evidence", "E01")).toEqual([]);
});
it("keeps locked analyses hidden until every original record is present", () => {
  let s = discover(startCase(freshState("after-the-flood")), "E46");
  expect(followUps(s, "evidence", "E46").map((l) => l.id)).toEqual(["T43"]);
  for (const id of ["E41", "E44", "E45"]) s = discover(s, id);
  expect(followUps(s, "evidence", "E46").map((l) => l.id)).toEqual([
    "T43",
    "I21",
  ]);
});
it("uses original-case evidence and deduction relationships without granting any progress", () => {
  const s = discover(startCase(freshState()), "E01");
  expect(followUps(s, "evidence", "E01")).toContainEqual(
    expect.objectContaining({ kind: "location", id: "E02", target: "L01" }),
  );
  const complete = solveCase();
  const beforeDispatch = {
    ...complete,
    evidence: complete.evidence.filter((id) => id !== "E15" && id !== "E16"),
    deductions: complete.deductions.filter((id) => id !== "D04"),
  };
  expect(followUps(beforeDispatch, "deductions", "D02")).toContainEqual(
    expect.objectContaining({ kind: "location", id: "E15", target: "L04" }),
  );
  expect(beforeDispatch.evidence).not.toContain("E15");
  expect(
    followUps(
      discover(startCase(freshState("dead-air")), "E25"),
      "evidence",
      "E25",
    ),
  ).toContainEqual(
    expect.objectContaining({ kind: "interview", id: "T23", target: "S11" }),
  );
});
