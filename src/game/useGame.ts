"use client";
import { useState, useEffect, useCallback, useReducer } from "react";
import { loadGame, saveGame, clearGame, saveKey } from "./storage";
import { cases } from "./cases";
import type { CaseId } from "./types";
import { freshState } from "./engine";
export function useGame(caseId: CaseId = "quiet-hour") {
  const [, refreshLibrary] = useReducer((n) => n + 1, 0);
  const [loaded] = useState(() => loadGame(undefined, caseId));
  const [state, setState] = useState(loaded.state);
  const [available, setAvailable] = useState(loaded.available);
  const [notice, setNotice] = useState(loaded.notice);
  useEffect(() => {
    if (!state.started) return;
    const result = saveGame(state);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Surface the result of synchronizing with external browser storage.
    setAvailable(result);
  }, [state]);
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key !== null && !cases.some((c) => saveKey(c.id) === event.key))
        return;
      refreshLibrary();
      if (event.key !== null && event.key !== saveKey(caseId)) return;
      const saved = loadGame(undefined, caseId);
      setState(saved.state);
      setAvailable(saved.available);
      setNotice(saved.notice);
    };
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, [caseId]);
  const reset = useCallback(() => {
    const result = clearGame(undefined, caseId);
    setState(freshState(caseId));
    setAvailable(result);
    setNotice(null);
  }, [caseId]);
  return {
    state,
    library: cases.map((c) =>
      c.id === caseId ? state : loadGame(undefined, c.id).state,
    ),
    setState,
    available,
    notice,
    dismissNotice: () => setNotice(null),
    reset,
  };
}
