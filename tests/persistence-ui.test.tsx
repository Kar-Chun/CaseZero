import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { GameApp } from "../src/components/GameApp";
import { SAVE_KEY } from "../src/game/storage";
it("restores evidence and notes, continues, and resets only the case save", async () => {
  const user = userEvent.setup();
  const first = render(<GameApp />);
  await user.click(screen.getByRole("button", { name: "Explore the case" }));
  await user.click(screen.getByRole("button", { name: "Begin investigation" }));
  await user.click(screen.getByRole("button", { name: "Enter the museum" }));
  await user.click(
    screen.getByRole("button", { name: /Where the silence began/ }),
  );
  await user.click(
    screen.getByRole("button", { name: "Search Display pedestal" }),
  );
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Notebook" }));
  await user.type(
    screen.getByRole("textbox", { name: "Case notes" }),
    "Check the maintenance window.",
  );
  first.unmount();
  render(<GameApp />);
  await user.click(
    screen.getByRole("button", { name: "Continue investigation" }),
  );
  await user.click(screen.getByRole("button", { name: "Notebook" }));
  expect(screen.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Check the maintenance window.",
  );
  expect(
    screen.getByRole("button", { name: /E01 Maintenance slip/ }),
  ).toBeVisible();
  window.localStorage.setItem("unrelated", "keep");
  await user.click(screen.getByRole("button", { name: "Reset progress" }));
  await user.click(screen.getByRole("button", { name: "Keep investigating" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Reset progress" }));
  await user.click(screen.getByRole("button", { name: "Reset case" }));
  expect(
    screen.getByRole("button", { name: "Explore the case" }),
  ).toBeVisible();
  expect(window.localStorage.getItem(SAVE_KEY)).toBeNull();
  expect(window.localStorage.getItem("unrelated")).toBe("keep");
});
it("explains incompatible saves and permits a fresh investigation", async () => {
  window.localStorage.setItem(SAVE_KEY, '{"version":0}');
  render(<GameApp />);
  expect(screen.getByRole("status")).toHaveTextContent(/unsupported version/);
  expect(
    screen.queryByRole("button", { name: "Continue investigation" }),
  ).not.toBeInTheDocument();
});

it("makes a failed save visible and retries the latest in-memory notes", async () => {
  const { vi } = await import("vitest");
  const { solveCase } = await import("./helpers");
  localStorage.setItem(SAVE_KEY, JSON.stringify(solveCase()));
  const user = userEvent.setup();
  render(<GameApp />);
  await user.click(
    screen.getByRole("button", { name: "Continue investigation" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Notebook" }),
  );
  const writes = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw Error("Full");
    });
  try {
    await user.type(
      screen.getByRole("textbox", { name: "Case notes" }),
      "Keep this new note.",
    );
    expect(
      screen.getByRole("alert", { name: "Progress needs saving" }),
    ).toBeVisible();
    writes.mockRestore();
    await user.click(screen.getByRole("button", { name: "Retry saving" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).notes).toBe(
      "Keep this new note.",
    );
  } finally {
    writes.mockRestore();
  }
});
