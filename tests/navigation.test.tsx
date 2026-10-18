import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { GameApp } from "../src/components/GameApp";
describe("entry and investigation navigation", () => {
  it("opens case selection, briefing, museum and every investigation section", async () => {
    const user = userEvent.setup();
    render(<GameApp />);
    expect(screen.getByRole("heading", { name: /truth hides/ })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Explore the case" }));
    await user.click(
      screen.getByRole("button", { name: "Begin investigation" }),
    );
    expect(
      screen.getByRole("heading", { name: "The Quiet Hour" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Enter the museum" }));
    const nav = screen.getByRole("navigation", {
      name: "Investigation navigation",
    });
    await user.click(
      screen.getByRole("button", { name: /Where the silence began/ }),
    );
    expect(
      screen.getByRole("heading", { name: "The Grand Gallery" }),
    ).toBeVisible();
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    await user.click(screen.getByRole("button", { name: "Museum map" }));
    for (const label of [
      "Evidence board",
      "Interviews",
      "Notebook",
      "Accusation",
    ]) {
      await user.click(within(nav).getByRole("button", { name: label }));
      expect(within(nav).getByRole("button", { name: label })).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
    await user.click(within(nav).getByRole("button", { name: "Interviews" }));
    await user.click(screen.getByRole("button", { name: /Anton Vale/ }));
    expect(screen.getByRole("heading", { name: "Anton Vale" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "CaseZero home" }));
    await user.click(
      screen.getByRole("button", { name: "Continue investigation" }),
    );
    expect(nav).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Investigation navigation" }),
    ).toBeVisible();
  });
  it("opens a focus-managed guide and supports Escape", async () => {
    const user = userEvent.setup();
    render(<GameApp />);
    const trigger = screen.getByRole("button", { name: "How to play" });
    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: "Your field guide" }),
    ).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
