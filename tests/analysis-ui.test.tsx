import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { it, expect } from "vitest";
import { getCase } from "../src/game/cases";
import { freshState, startCase, discover, analyze } from "../src/game/engine";
import { InspectionPanel } from "../src/components/InspectionPanel";
it("keeps the sources visible and gives useful feedback for wrong then correct clock work", async () => {
  const c = getCase("dead-air");
  function Harness() {
    const [state, setState] = useState(() =>
      discover(discover(startCase(freshState("dead-air")), "E21"), "E22"),
    );
    return (
      <>
        <InspectionPanel
          activity={c.inspections[0]}
          onSubmit={(value) => {
            const result = analyze(state, "I11", value);
            setState(result.state);
            return result.message;
          }}
        />
        <p>Recorded: {state.inspections.length}</p>
      </>
    );
  }
  const user = userEvent.setup();
  render(<Harness />);
  const input = screen.getByLabelText("Insertion in network time");
  expect(
    screen.getByRole("button", { name: "Check corrected time" }),
  ).toBeDisabled();
  await user.type(input, "22:20");
  await user.click(
    screen.getByRole("button", { name: "Check corrected time" }),
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    /does not match the calibration/,
  );
  await user.clear(input);
  await user.type(input, "22:06");
  await user.click(
    screen.getByRole("button", { name: "Check corrected time" }),
  );
  expect(screen.getByText("Recorded: 1")).toBeVisible();
});
