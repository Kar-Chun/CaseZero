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

it("preserves good active and inactive snapshots when a live save becomes malformed, and repairs on retry", () => {
  const first = notebook(startCase(freshState()), "Keep my active notes");
  const other = notebook(
    startCase(freshState("dead-air")),
    "Keep my cached notes",
  );
  saveGame(first);
  saveGame(other);
  const session = new Map<CaseId, GameState>([["dead-air", other]]);
  const h = renderHook(() => useGame("quiet-hour", session));
  for (const id of ["quiet-hour", "dead-air"] as const) {
    localStorage.setItem(saveKey(id), "{broken");
    act(() =>
      window.dispatchEvent(new StorageEvent("storage", { key: saveKey(id) })),
    );
  }
  expect(h.result.current.state).toEqual(first);
  expect(h.result.current.library.find((c) => c.caseId === "dead-air")).toEqual(
    other,
  );
  expect(h.result.current.available).toBe(false);
  act(() => h.result.current.retrySave());
  expect(h.result.current.available).toBe(true);
  expect(JSON.parse(localStorage.getItem(saveKey())!)).toEqual(first);
  const denied = vi
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation(() => {
      throw Error("Read denied");
    });
  try {
    act(() =>
      window.dispatchEvent(new StorageEvent("storage", { key: saveKey() })),
    );
    expect(h.result.current.state).toEqual(first);
    expect(h.result.current.available).toBe(false);
  } finally {
    denied.mockRestore();
  }
  act(() => h.result.current.retrySave());
  expect(h.result.current.notice).toBeNull();
});
it("keeps a failed reset through case remounts and retries a fresh snapshot instead of resurrecting the old case", () => {
  const old = startCase(freshState());
  saveGame(old);
  const session = new Map<CaseId, GameState>();
  const h = renderHook(() => useGame("quiet-hour", session));
  const remove = vi
    .spyOn(Storage.prototype, "removeItem")
    .mockImplementation(() => {
      throw Error("Denied");
    });
  const write = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw Error("Full");
    });
  try {
    act(() => h.result.current.reset());
    expect(h.result.current.state.started).toBe(false);
    expect(h.result.current.available).toBe(false);
    expect(h.result.current.notice).toMatch(/previous saved case/);
    h.unmount();
    const restored = renderHook(() => useGame("quiet-hour", session));
    expect(restored.result.current.available).toBe(false);
    expect(restored.result.current.state.started).toBe(false);
    write.mockRestore();
    act(() => restored.result.current.retrySave());
    expect(restored.result.current.available).toBe(true);
    expect(JSON.parse(localStorage.getItem(saveKey())!)).toEqual(freshState());
    restored.unmount();
  } finally {
    write.mockRestore();
    remove.mockRestore();
  }
});
it("records a fresh reset snapshot if removal is denied but writing succeeds", () => {
  saveGame(startCase(freshState()));
  const h = renderHook(() => useGame());
  const remove = vi
    .spyOn(Storage.prototype, "removeItem")
    .mockImplementation(() => {
      throw Error("Denied");
    });
  try {
    act(() => h.result.current.reset());
    expect(h.result.current.available).toBe(true);
    expect(JSON.parse(localStorage.getItem(saveKey())!)).toEqual(freshState());
  } finally {
    remove.mockRestore();
  }
});
