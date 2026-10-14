import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { it, expect } from "vitest";
import { Verdict } from "../src/components/Verdict";
import { accuse } from "../src/game/engine";
import { solveCase } from "./helpers";
it("requires a complete form, allows review/edit and renders the correct ending", async () => {
  function Harness() {
    const [state, setState] = useState(solveCase());
    return (
      <Verdict
        state={state}
        onSubmit={(a) => setState((s) => accuse(s, a))}
        onBoard={() => {}}
        onRecover={() => {}}
        onRetry={() => {}}
        onReplay={() => {}}
        onReview={() => {}}
      />
    );
  }
  const user = userEvent.setup();
  render(<Harness />);
  expect(
    screen.getByRole("button", { name: "Review accusation" }),
  ).toBeDisabled();
  await user.selectOptions(screen.getByLabelText("Person of interest"), "S01");
  await user.selectOptions(screen.getByLabelText("How was it taken?"), "M02");
  await user.selectOptions(screen.getByLabelText("Why was it taken?"), "R03");
  await user.click(screen.getByRole("button", { name: "Review accusation" }));
  await user.click(screen.getByRole("button", { name: "Edit account" }));
  expect(screen.getByLabelText("Person of interest")).toHaveValue("S01");
  await user.click(screen.getByRole("button", { name: "Review accusation" }));
  await user.click(screen.getByRole("button", { name: "Submit accusation" }));
  expect(
    await screen.findByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
});
