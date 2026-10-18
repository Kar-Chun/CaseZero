import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";
import { CaseDebrief } from "../src/components/CaseDebrief";
import { accountReview } from "../src/game/debrief";
import { evaluate } from "../src/game/outcome";
import { combine, accuse, resumeInvestigation } from "../src/game/engine";
import { importBackup, exportBackup } from "../src/game/backup";
import {
  selectedCase,
  selectCase,
  SELECTED_CASE_KEY,
} from "../src/game/storage";
import { solveCase, solveRadio, solveConservatory } from "./helpers";
it("reviews each dimension against actual proof and round trips alternative endings", () => {
  const museum = combine(solveCase(), ["E05", "E07", "E08"]).state;
  for (const [state, account] of [
    [museum, { suspect: "S01", method: "M02", motive: "R03" }],
    [solveRadio(), { suspect: "S13", method: "M12", motive: "R12" }],
    [solveConservatory(), { suspect: "S21", method: "M22", motive: "R23" }],
  ] as const) {
    const outcome = evaluate(account, state.caseId);
    expect(
      accountReview(state, outcome.matches).every(
        (part) => part.consistent && part.conclusions.length,
      ),
    ).toBe(true);
    const c = accuse(state, account);
    expect(importBackup(exportBackup(c), state.caseId).state).toEqual(c);
    expect(resumeInvestigation(c)).toEqual({ ...c, accusation: null });
    for (const key of ["suspect", "method", "motive"] as const) {
      const wrong = evaluate(
        { ...account, [key]: "unsupported" },
        state.caseId,
      );
      expect(
        accountReview(state, wrong.matches)
          .filter((p) => !p.consistent)
          .map((p) => p.key),
      ).toEqual([key]);
    }
  }
  const sources = accountReview(
    museum,
    evaluate({ suspect: "S01", method: "M02", motive: "R03" }).matches,
  )[0].conclusions[0].sources;
  expect(sources).toContain("Credential trail");
  expect(sources).not.toContain("Atrium attendance");
});
it("shows optional search leads only after a supported account, without discovering them", async () => {
  const user = userEvent.setup();
  const state = {
    ...solveCase(),
    evidence: solveCase().evidence.filter((id) => id !== "E03"),
  };
  const good = evaluate({ suspect: "S01", method: "M02", motive: "R03" });
  const { rerender } = render(
    <CaseDebrief
      state={state}
      result={evaluate({ suspect: "S02", method: "M02", motive: "R03" })}
    />,
  );
  expect(screen.queryByText(/Overlooked leads/)).not.toBeInTheDocument();
  rerender(<CaseDebrief state={state} result={good} />);
  await user.click(screen.getByText("Overlooked leads (1)"));
  expect(screen.getByText(/Abandoned champagne table/)).toBeVisible();
  expect(screen.queryByText("A patron’s offer")).not.toBeInTheDocument();
  expect(state.evidence).not.toContain("E03");
});
it("restores a tab's own case despite another tab changing the shared preference", () => {
  selectCase("quiet-hour");
  window.localStorage.setItem(SELECTED_CASE_KEY, "dead-air");
  expect(selectedCase()).toBe("quiet-hour");
  window.sessionStorage.clear();
  expect(selectedCase()).toBe("dead-air");
  window.sessionStorage.setItem(SELECTED_CASE_KEY, "unknown");
  expect(selectedCase()).toBe("dead-air");
  const get = vi
    .spyOn(window, "sessionStorage", "get")
    .mockImplementation(() => {
      throw new DOMException("Denied", "SecurityError");
    });
  try {
    selectCase("after-the-flood");
    expect(selectedCase()).toBe("after-the-flood");
  } finally {
    get.mockRestore();
  }
});
