import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { it, expect } from "vitest";
import { HintPanel } from "../src/components/HintPanel";
import { freshState, startCase, revealHint } from "../src/game/engine";
it("keeps specific guidance hidden until deliberately revealed and exposes a real follow action", async () => {
  let followed = "";
  function Harness() {
    const [s, set] = useState(() => startCase(freshState()));
    return (
      <HintPanel
        state={s}
        onReveal={(key) => set((old) => revealHint(old, key))}
        onFollow={(lead) => {
          followed = lead.target ?? "";
        }}
      />
    );
  }
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByText("Need a lead?"));
  expect(screen.queryByText(/display pedestal/i)).not.toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Reveal a gentle hint" }),
  );
  expect(
    within(screen.getByRole("list")).getAllByRole("listitem"),
  ).toHaveLength(1);
  expect(
    screen.queryByRole("button", { name: "Follow this lead" }),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Make it clearer" }));
  await user.click(
    screen.getByRole("button", { name: "Show a specific lead" }),
  );
  expect(
    within(screen.getByRole("list")).getAllByRole("listitem"),
  ).toHaveLength(3);
  await user.click(screen.getByRole("button", { name: "Follow this lead" }));
  expect(followed).toBe("L01");
});
