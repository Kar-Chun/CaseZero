"use client";
import { useState, useEffect, useCallback } from "react";
import { loadGame, saveGame, clearGame, SAVE_KEY } from "./storage";
import { freshState } from "./engine";
export function useGame() {
  const [loaded] = useState(() => loadGame());
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
      if (
        event.storageArea !== window.localStorage ||
        (event.key !== SAVE_KEY && event.key !== null)
      )
        return;
      const saved = loadGame();
      setState(saved.state);
      setAvailable(saved.available);
      setNotice(saved.notice);
    };
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  const reset = useCallback(() => {
    const result = clearGame();
    setState(freshState());
    setAvailable(result);
    setNotice(null);
  }, []);
  return {
    state,
    setState,
    available,
    notice,
    dismissNotice: () => setNotice(null),
    reset,
  };
}
