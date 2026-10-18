import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { it, expect } from "vitest";
import { GameApp } from "../src/components/GameApp";
import { Board } from "../src/components/Board";
import {
  freshState,
  startCase,
  discover,
  pinEvidence,
} from "../src/game/engine";
import { saveGame, saveKey } from "../src/game/storage";
import { solveConservatory } from "./helpers";
it("pins directly from a recorded file without rediscovering it", async () => {
  const user = userEvent.setup();
  saveGame(discover(startCase(freshState()), "E01"));
  render(<GameApp />);
  await user.click(
    screen.getByRole("button", { name: "Continue investigation" }),
  );
  await user.click(
    screen.getByRole("button", { name: /Where the silence began/ }),
  );
  await user.click(
    screen.getByRole("button", { name: "Inspect Maintenance slip" }),
  );
  await user.click(screen.getByRole("button", { name: "Pin for comparison" }));
  expect(
    screen.getByRole("button", { name: "Unpin evidence" }),
  ).toHaveAttribute("aria-pressed", "true");
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Evidence board" }));
  expect(
    screen.getByRole("button", { name: "Unpin Maintenance slip" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(JSON.parse(localStorage.getItem(saveKey())!).evidence).toEqual([
    "E01",
  ]);
});
it("keeps explanations within the thread destination and removes pins hidden by search", async () => {
  function Harness() {
    const [state, set] = useState(() =>
      pinEvidence({ ...solveConservatory(), deductions: [], proofs: {} }, [
        "E42",
        "E43",
        "E46",
      ]),
    );
    return (
      <Board
        state={state}
        onInspect={() => {}}
        onExplore={() => {}}
        onPinChange={(ids) => set((s) => pinEvidence(s, ids))}
        onRevealHint={() => {}}
        onFollow={() => {}}
      />
    );
  }
  const user = userEvent.setup();
  const { container } = render(<Harness />);
  expect(
    within(container.querySelector("#board-thread") as HTMLElement).getByRole(
      "group",
      { name: "What do these records establish?" },
    ),
  ).toBeVisible();
  await user.type(screen.getByRole("searchbox"), "nothing matches this");
  await user.click(
    screen.getByRole("button", {
      name: "Remove A color with a source from thread",
    }),
  );
  expect(
    screen.queryByRole("button", {
      name: "Remove A color with a source from thread",
    }),
  ).not.toBeInTheDocument();
  expect(container.querySelector("#board-thread")).toHaveFocus();
  await user.click(
    screen.getByRole("button", { name: "Reset evidence filters" }),
  );
  expect(screen.getByRole("searchbox")).toHaveFocus();
  expect(
    screen.getByRole("button", { name: "Pin A color with a source" }),
  ).toBeEnabled();
});
