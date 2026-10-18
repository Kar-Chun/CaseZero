"use client";
import { useEffect, useRef } from "react";
export default function ErrorPage() {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus();
  }, []);
  return (
    <main className="recovery-screen">
      <p className="eyebrow">CASEZERO / RECOVERY</p>
      <h1 tabIndex={-1} ref={title}>
        The case file could not open.
      </h1>
      <p>
        Check your connection, then reload to reopen your most recent browser
        save. Reloading does not reset your investigations.
      </p>
      <p className="small-note">
        If browser saving was unavailable, unsaved session changes may not
        return. Keep using the same browser and website address for your saved
        cases.
      </p>
      <button
        className="button primary"
        onClick={() => window.location.reload()}
      >
        Reload saved game
      </button>
    </main>
  );
}
