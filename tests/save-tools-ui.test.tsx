import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { SaveTools } from "../src/components/SaveTools";
import { exportBackup } from "../src/game/backup";
import { solveCase, solveRadio } from "./helpers";
it("validates a backup, focuses its review, and replaces only after an explicit review action", async () => {
  const original = solveCase(),
    incoming = { ...original, notes: "Restored field notes." };
  const restored: (typeof original)[] = [];
  const user = userEvent.setup();
  render(<SaveTools state={original} onImport={(s) => restored.push(s)} />);
  expect(
    screen.getByRole("link", { name: "Export investigation" }),
  ).toHaveAttribute("download", "casezero-quiet-hour.json");
  await user.click(
    screen.getByRole("button", { name: "Import investigation" }),
  );
  await user.click(screen.getByText("Paste a backup instead"));
  await user.type(
    screen.getByRole("textbox", { name: "Backup contents" }),
    "broken",
  );
  await user.click(screen.getByRole("button", { name: "Review backup" }));
  expect(screen.getByRole("status")).toHaveTextContent(/not a valid/);
  expect(restored).toEqual([]);
  const input = screen.getByRole("textbox", { name: "Backup contents" });
  await user.clear(input);
  await user.paste(exportBackup(solveRadio()));
  await user.click(screen.getByRole("button", { name: "Review backup" }));
  expect(screen.getByRole("status")).toHaveTextContent(/belongs to Dead Air/);
  await user.clear(input);
  await user.paste(exportBackup(incoming));
  await user.click(screen.getByRole("button", { name: "Review backup" }));
  expect(screen.getByRole("heading", { name: "The Quiet Hour" })).toHaveFocus();
  expect(restored).toEqual([]);
  await user.click(
    screen.getByRole("button", { name: "Replace this investigation" }),
  );
  expect(restored).toEqual([incoming]);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("ignores a slower previously selected file when a newer file has finished reading", async () => {
  const base = solveCase(),
    old = { ...base, notes: "Older file." },
    latest = { ...base, notes: "Newer selected file." };
  let finishOld: ((text: string) => void) | undefined;
  const first = new File(["{}"], "older.json", { type: "application/json" }),
    second = new File(["{}"], "newer.json", { type: "application/json" });
  Object.defineProperty(first, "text", {
    value: () =>
      new Promise<string>((resolve) => {
        finishOld = resolve;
      }),
  });
  Object.defineProperty(second, "text", {
    value: () => Promise.resolve(exportBackup(latest)),
  });
  const restored: (typeof base)[] = [];
  const user = userEvent.setup();
  render(<SaveTools state={base} onImport={(s) => restored.push(s)} />);
  await user.click(
    screen.getByRole("button", { name: "Import investigation" }),
  );
  const input = screen.getByLabelText("Choose a case backup");
  await user.upload(input, first);
  await user.upload(input, second);
  await act(async () => {
    finishOld?.(exportBackup(old));
  });
  await user.click(screen.getByRole("button", { name: "Review backup" }));
  await user.click(
    screen.getByRole("button", { name: "Replace this investigation" }),
  );
  expect(restored[0].notes).toBe("Newer selected file.");
});

it("announces a pending read, retries the same file and returns focus from review", async () => {
  const user = userEvent.setup();
  const state = solveCase();
  let fail: ((reason: Error) => void) | undefined;
  const file = new File(["{}"], "retry.json", { type: "application/json" });
  let reads = 0;
  Object.defineProperty(file, "text", {
    value: () =>
      ++reads === 1
        ? new Promise<string>((_, reject) => {
            fail = reject;
          })
        : Promise.resolve(exportBackup(state)),
  });
  render(<SaveTools state={state} onImport={() => {}} />);
  await user.click(
    screen.getByRole("button", { name: "Import investigation" }),
  );
  const input = screen.getByLabelText("Choose a case backup");
  await user.upload(input, file);
  expect(screen.getByRole("status")).toHaveTextContent("Reading your backup");
  expect(screen.getByRole("button", { name: "Review backup" })).toBeDisabled();
  await act(async () => fail?.(Error("Read failed")));
  expect(screen.getByRole("status")).toHaveTextContent("could not be read");
  await user.upload(input, file);
  await user.click(screen.getByRole("button", { name: "Review backup" }));
  await user.click(screen.getByRole("button", { name: "Back to file" }));
  expect(screen.getByLabelText("Choose a case backup")).toHaveFocus();
});
