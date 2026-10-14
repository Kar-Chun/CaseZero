import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { GameApp } from "../src/components/GameApp";
it("discovers a clue, unlocks its neighbor, opens inventory and pins evidence for comparison", async () => {
  const user = userEvent.setup();
  render(<GameApp />);
  await user.click(screen.getByRole("button", { name: "Explore the case" }));
  await user.click(screen.getByRole("button", { name: "Begin investigation" }));
  await user.click(screen.getByRole("button", { name: "Enter the museum" }));
  await user.click(
    screen.getByRole("button", { name: /Where the silence began/ }),
  );
  expect(
    screen.getByRole("button", { name: "Search Sensor housing" }),
  ).toBeDisabled();
  await user.click(
    screen.getByRole("button", { name: "Search Display pedestal" }),
  );
  expect(
    screen.getByRole("dialog", { name: "Maintenance slip" }),
  ).toBeVisible();
  await user.keyboard("{Escape}");
  expect(
    screen.getByRole("button", { name: "Search Sensor housing" }),
  ).toBeEnabled();
  await user.click(
    screen.getByRole("button", { name: "Search Sensor housing" }),
  );
  await user.click(screen.getByRole("button", { name: "View evidence board" }));
  await user.click(
    screen.getByRole("button", { name: "Pin Maintenance slip" }),
  );
  await user.click(screen.getByRole("button", { name: "Pin Silent sensor" }));
  await user.click(screen.getByRole("button", { name: "Compare evidence" }));
  expect(
    screen.getByRole("dialog", { name: "Compare your thread" }),
  ).toBeVisible();
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Clear" }));
  expect(
    screen.getByRole("button", { name: "Pin Maintenance slip" }),
  ).toHaveAttribute("aria-pressed", "false");
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Filter evidence by location" }),
    "L04",
  );
  expect(screen.getByText(/No evidence from this location yet/)).toBeVisible();
});
