"use client";
import { useState, useEffect, useCallback, useReducer } from "react";
import { loadGame, saveGame, clearGame, saveKey } from "./storage";
import { cases } from "./cases";
import type { CaseId, GameState } from "./types";
import { freshState } from "./engine";
export function useGame(
  caseId: CaseId = "quiet-hour",
  session?: Map<CaseId, GameState>,
) {
  const [, refreshLibrary] = useReducer((n) => n + 1, 0);
  const [loaded] = useState(() => loadGame(undefined, caseId));
  const [state, setState] = useState(
    () => session?.get(caseId) ?? loaded.state,
  );
  const pendingReset =
    session?.get(caseId)?.started === false && loaded.state.started;
  const [available, setAvailable] = useState(loaded.available && !pendingReset);
  const [notice, setNotice] = useState(
    pendingReset
      ? "This tab’s reset has not reached browser storage. Retry saving before leaving."
      : loaded.notice,
  );
  useEffect(() => {
    // Keep per-case progress through keyed UI remounts, including denied/quota storage.
    session?.set(caseId, state);
    if (!state.started) return;
    const result = saveGame(state);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Surface the result of synchronizing with external browser storage.
    setAvailable(result);
    if (result) setNotice(null);
  }, [state, caseId, session]);
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key !== null && !cases.some((c) => saveKey(c.id) === event.key))
        return;
      for (const c of cases) {
        if (event.key !== null && event.key !== saveKey(c.id)) continue;
        const saved = loadGame(undefined, c.id);
        if (saved.invalid || !saved.available) {
          if (c.id === caseId) {
            setAvailable(false);
            setNotice(
              "A browser save update could not be read. Your current investigation is still in this tab. Retry saving or export a backup before leaving.",
            );
          }
          // Never discard a good in-memory snapshot for an unreadable update.
          continue;
        }
        session?.delete(c.id);
        if (c.id === caseId) {
          setState(saved.state);
          setAvailable(saved.available);
          setNotice(saved.notice);
        }
      }
      refreshLibrary();
    };
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, [caseId, session]);
  const reset = useCallback(() => {
    const clean = freshState(caseId);
    // A fresh snapshot also records reset if a browser refuses removal but permits writes.
    const result = clearGame(undefined, caseId) || saveGame(clean);
    setState(clean);
    setAvailable(result);
    setNotice(
      result
        ? null
        : "This reset is only in this tab. The previous saved case may return after refresh. Retry saving before leaving.",
    );
  }, [caseId]);
  const retrySave = useCallback(() => {
    const result = saveGame(state);
    setAvailable(result);
    if (result) setNotice(null);
  }, [state]);
  return {
    state,
    library: cases.map((c) =>
      c.id === caseId
        ? state
        : (session?.get(c.id) ?? loadGame(undefined, c.id).state),
    ),
    setState,
    available,
    notice,
    dismissNotice: () => setNotice(null),
    reset,
    retrySave,
  };
}
