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
  const [available, setAvailable] = useState(loaded.available);
  const [notice, setNotice] = useState(loaded.notice);
  useEffect(() => {
    // Keep per-case progress through keyed UI remounts, including denied/quota storage.
    session?.set(caseId, state);
    if (!state.started) return;
    const result = saveGame(state);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Surface the result of synchronizing with external browser storage.
    setAvailable(result);
  }, [state, caseId, session]);
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key !== null && !cases.some((c) => saveKey(c.id) === event.key))
        return;
      if (event.key === null) session?.clear();
      else
        for (const c of cases)
          if (saveKey(c.id) === event.key) session?.delete(c.id);
      refreshLibrary();
      if (event.key !== null && event.key !== saveKey(caseId)) return;
      const saved = loadGame(undefined, caseId);
      setState(saved.state);
      setAvailable(saved.available);
      setNotice(saved.notice);
    };
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, [caseId, session]);
  const reset = useCallback(() => {
    const result = clearGame(undefined, caseId);
    setState(freshState(caseId));
    setAvailable(result);
    setNotice(null);
  }, [caseId]);
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
  };
}
