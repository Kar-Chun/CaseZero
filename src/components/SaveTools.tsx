"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { exportBackup, importBackup, MAX_BACKUP_SIZE } from "@/game/backup";
import { getCase } from "@/game/cases";
import type { GameState } from "@/game/types";
import { Modal } from "./Modal";
import { Icon } from "./Icon";
export function SaveTools({
  state,
  onImport,
}: {
  state: GameState;
  onImport: (state: GameState) => void;
}) {
  const [open, setOpen] = useState(false),
    [raw, setRaw] = useState(""),
    [error, setError] = useState(""),
    [preview, setPreview] = useState<GameState | null>(null);
  const fileRequest = useRef(0);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (preview) reviewTitle.current?.focus();
  }, [preview]);
  const close = useCallback(() => {
    fileRequest.current++;
    setOpen(false);
  }, [setOpen]);
  const c = getCase(state.caseId);
  const resetEditor = () => {
    fileRequest.current++;
    setRaw("");
    setError("");
    setPreview(null);
    setOpen(true);
  };
  const readFile = async (file: File | undefined) => {
    const request = ++fileRequest.current;
    setRaw("");
    setPreview(null);
    setError("");
    if (!file) return;
    if (file.size > MAX_BACKUP_SIZE) {
      setError(
        "That backup is too large. Choose a CaseZero investigation export.",
      );
      return;
    }
    try {
      const contents = await file.text();
      if (request === fileRequest.current) setRaw(contents);
    } catch {
      if (request !== fileRequest.current) return;
      setError(
        "The file could not be read. Choose it again, or paste a backup below.",
      );
    }
  };
  return (
    <>
      <div className="save-tools">
        <div>
          <p className="eyebrow">TAKE YOUR CASE WITH YOU</p>
          <h3>A portable case file.</h3>
          <p>
            Export this investigation’s progress, notes, hints and pinned
            thread. Import replaces only this case, after review.
          </p>
        </div>
        <div className="save-tools-actions">
          <a
            className="button outline"
            href={`data:application/json;charset=utf-8,${encodeURIComponent(exportBackup(state))}`}
            download={`casezero-${state.caseId}.json`}
          >
            Export investigation
            <Icon name="file" size={16} />
          </a>
          <button className="button outline" onClick={resetEditor}>
            Import investigation
            <Icon name="save" size={16} />
          </button>
        </div>
      </div>
      {open && (
        <Modal title="Restore a case backup" onClose={close}>
          {preview ? (
            <>
              <p className="eyebrow">REVIEW BEFORE REPLACING</p>
              <h3 ref={reviewTitle} tabIndex={-1}>
                {c.title}
              </h3>
              <div className="backup-review">
                <p>
                  <span>Evidence</span>
                  <strong>
                    {preview.evidence.length} / {c.evidence.length}
                  </strong>
                </p>
                <p>
                  <span>Conclusions</span>
                  <strong>
                    {preview.deductions.length} / {c.deductions.length}
                  </strong>
                </p>
                <p>
                  <span>Interview topics</span>
                  <strong>{preview.answers.length}</strong>
                </p>
                <p>
                  <span>Notes</span>
                  <strong>{preview.notes.length} characters</strong>
                </p>
                <p>
                  <span>Ending</span>
                  <strong>
                    {preview.accusation
                      ? "Submitted account included"
                      : "Investigation open"}
                  </strong>
                </p>
              </div>
              <p>
                Your current {c.title} progress will be replaced. Your other
                investigations will stay exactly as they are.
              </p>
              <div className="ending-actions">
                <button
                  className="button primary"
                  onClick={() => {
                    onImport(preview);
                    close();
                  }}
                >
                  Replace this investigation
                  <Icon name="check" size={16} />
                </button>
                <button
                  className="button outline"
                  onClick={() => setPreview(null)}
                >
                  Back to file
                </button>
              </div>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const result = importBackup(raw, state.caseId);
                setError(result.error ?? "");
                setPreview(result.state);
              }}
            >
              <label className="backup-file-label">
                Choose a case backup
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => void readFile(e.target.files?.[0])}
                />
              </label>
              <p className="small-note">
                {raw
                  ? "A backup is ready to validate."
                  : "Choose a file exported by CaseZero. No changes are made until you review and confirm."}
              </p>
              <details className="paste-backup">
                <summary>Paste a backup instead</summary>
                <label>
                  Backup contents
                  <textarea
                    aria-label="Backup contents"
                    value={raw}
                    maxLength={MAX_BACKUP_SIZE + 1}
                    onChange={(e) => {
                      fileRequest.current++;
                      setRaw(e.target.value);
                      setError("");
                    }}
                    spellCheck={false}
                  />
                </label>
              </details>
              <p className="backup-error" role="status">
                {error}
              </p>
              <button
                className="button primary"
                type="submit"
                disabled={!raw.trim()}
              >
                Review backup
                <Icon name="arrow" size={16} />
              </button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
