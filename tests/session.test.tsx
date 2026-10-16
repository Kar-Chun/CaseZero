import { act, renderHook } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { useGame } from "../src/game/useGame";
import { freshState, startCase, notebook } from "../src/game/engine";
import { saveGame, saveKey } from "../src/game/storage";
import type { CaseId, GameState } from "../src/game/types";

it("keeps the latest per-case session across remounts when writes fail with a quota error", () => {
  const old = notebook(startCase(freshState()), "Older disk notes");
  saveGame(old);
  const session = new Map<CaseId, GameState>();
  const writes = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new DOMException("Quota full", "QuotaExceededError");
    });
  try {
    const first = renderHook(() => useGame("quiet-hour", session));
    act(() =>
      first.result.current.setState(notebook(old, "Newer session notes")),
    );
    expect(first.result.current.available).toBe(false);
    first.unmount();
    const other = renderHook(() => useGame("dead-air", session));
    act(() =>
      other.result.current.setState(
        notebook(startCase(freshState("dead-air")), "Radio notes"),
      ),
    );
    other.unmount();
    const restored = renderHook(() => useGame("quiet-hour", session));
    expect(restored.result.current.state.notes).toBe("Newer session notes");
    expect(
      restored.result.current.library.find((c) => c.caseId === "dead-air")
        ?.notes,
    ).toBe("Radio notes");
    expect(JSON.parse(localStorage.getItem(saveKey())!).notes).toBe(
      "Older disk notes",
    );
    restored.unmount();
  } finally {
    writes.mockRestore();
  }
});

it("invalidates inactive cached progress when another tab saves or resets that case", () => {
  const session = new Map<CaseId, GameState>([
    ["dead-air", notebook(startCase(freshState("dead-air")), "Cached notes")],
  ]);
  const active = renderHook(() => useGame("quiet-hour", session));
  const incoming = notebook(
    startCase(freshState("dead-air")),
    "Updated by another tab",
  );
  saveGame(incoming);
  act(() =>
    window.dispatchEvent(
      new StorageEvent("storage", { key: saveKey("dead-air") }),
    ),
  );
  expect(active.result.current.state.caseId).toBe("quiet-hour");
  expect(
    active.result.current.library.find((c) => c.caseId === "dead-air")?.notes,
  ).toBe(incoming.notes);
  localStorage.removeItem(saveKey("dead-air"));
  act(() =>
    window.dispatchEvent(
      new StorageEvent("storage", { key: saveKey("dead-air") }),
    ),
  );
  expect(
    active.result.current.library.find((c) => c.caseId === "dead-air")?.started,
  ).toBe(false);
});
