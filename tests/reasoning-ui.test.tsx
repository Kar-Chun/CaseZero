import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { it, expect, vi } from "vitest";
import type { GameState } from "../src/game/types";
import { getCase } from "../src/game/cases";
import { InspectionPanel } from "../src/components/InspectionPanel";
import { Board } from "../src/components/Board";
import { combine, pinEvidence } from "../src/game/engine";
import { solveConservatory } from "./helpers";
it("keeps sources visible, rejects repeated events and lets players revise a failed reconstruction", async () => {
  const user = userEvent.setup(),
    submit = vi.fn(() => "Reconsider the untimed mixing record.");
  render(
    <InspectionPanel
      activity={getCase("after-the-flood").inspections[0]}
      onSubmit={submit}
    />,
  );
  expect(screen.getByRole("heading", { name: "Mixing book" })).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Test reconstruction" }),
  ).toBeDisabled();
  for (const [i, id] of ["V3", "V3", "V1", "V2"].entries())
    await user.selectOptions(screen.getByLabelText(`Position ${i + 1}`), id);
  expect(screen.getByRole("status")).toHaveTextContent("more than once");
  expect(
    screen.getByRole("button", { name: "Test reconstruction" }),
  ).toBeDisabled();
  expect(submit).not.toHaveBeenCalled();
  await user.selectOptions(screen.getByLabelText("Position 2"), "V4");
  await user.click(screen.getByRole("button", { name: "Test reconstruction" }));
  expect(submit).toHaveBeenLastCalledWith("V3:V4:V1:V2");
  expect(screen.getByRole("status")).toHaveTextContent("Reconsider");
  await user.selectOptions(screen.getByLabelText("Position 2"), "V1");
  await user.selectOptions(screen.getByLabelText("Position 3"), "V4");
  await user.click(screen.getByRole("button", { name: "Test reconstruction" }));
  expect(submit).toHaveBeenLastCalledWith("V3:V1:V4:V2");
  await user.click(screen.getByRole("button", { name: "Clear sequence" }));
  expect(screen.getByLabelText("Position 1")).toHaveValue("");
  expect(
    screen.getByRole("button", { name: "Test reconstruction" }),
  ).toBeDisabled();
});
it("asks for an explanation only for a related thread and preserves wrong reasoning for revision", async () => {
  const user = userEvent.setup();
  function Example() {
    const [state, setState] = useState<GameState>(() => ({
      ...solveConservatory(),
      deductions: [],
      pinned: ["E42", "E43"],
    }));
    return (
      <Board
        state={state}
        onInspect={() => {}}
        onExplore={() => {}}
        onRevealHint={() => {}}
        onFollow={() => {}}
        onPinChange={(ids) => setState((s) => pinEvidence(s, ids))}
        onConnect={(ids, explanation) => {
          const result = combine(state, ids, explanation);
          setState(result.state);
          return result;
        }}
      />
    );
  }
  render(<Example />);
  expect(
    screen.queryByRole("group", { name: "What do these records establish?" }),
  ).not.toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Pin A fresh turn of the wheel" }),
  );
  expect(
    screen.getByRole("group", { name: "What do these records establish?" }),
  ).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Test connection" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Choose the explanation",
  );
  await user.click(
    screen.getByRole("radio", {
      name: "A sensor fault delivered water through the automatic feed.",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Test connection" }));
  expect(screen.getByRole("status")).toHaveTextContent("does not account");
  expect(
    screen.getByRole("button", { name: "Unpin A fresh turn of the wheel" }),
  ).toBeEnabled();
  await user.click(
    screen.getByRole("radio", {
      name: "Someone operated the local manual bypass to deliver the blue water.",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Test connection" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "fresh local manual-bypass flow",
  );
  expect(
    screen.queryByRole("group", { name: "What do these records establish?" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Pin A fresh turn of the wheel" }),
  ).toBeEnabled();
});
