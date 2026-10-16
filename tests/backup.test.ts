import { describe, it, expect } from "vitest";
import {
  exportBackup,
  importBackup,
  MAX_BACKUP_SIZE,
} from "../src/game/backup";
import { saveGame, loadGame, parseSave, saveKey } from "../src/game/storage";
import { notebook, pinEvidence, revealHint } from "../src/game/engine";
import { solveCase, solveRadio } from "./helpers";
describe("portable case saves", () => {
  it("round trips both cases including notes, analysis, hints and pinned evidence", () => {
    for (const s of [solveCase(), solveRadio()]) {
      const state = pinEvidence(
        revealHint(
          notebook(s, "A working theory, with punctuation & unicode: café ☂."),
          `evidence:${s.evidence[0]}`,
        ),
        s.evidence.slice(0, 2),
      );
      expect(importBackup(exportBackup(state), s.caseId)).toEqual({
        state,
        error: null,
      });
    }
  });
  it("rejects malformed, unsupported, oversized and impossible backups without writing progress", () => {
    const original = solveCase();
    saveGame(original);
    const malformed = [
      "{",
      JSON.stringify({ format: "other", version: 1, state: original }),
      JSON.stringify({
        format: "casezero-investigation",
        version: 99,
        state: original,
      }),
      JSON.stringify({ ...original, evidence: ["E16"] }),
      "x".repeat(MAX_BACKUP_SIZE + 1),
    ];
    for (const raw of malformed)
      expect(importBackup(raw, "quiet-hour").state).toBeNull();
    expect(loadGame().state).toEqual(original);
  });
  it("does not accept another case or silently overwrite its storage", () => {
    const a = solveCase(),
      b = solveRadio();
    saveGame(a);
    saveGame(b);
    const before = localStorage.getItem(saveKey("dead-air"));
    const result = importBackup(exportBackup(b), "quiet-hour");
    expect(result.state).toBeNull();
    expect(result.error).toContain("Dead Air");
    expect(localStorage.getItem(saveKey("dead-air"))).toBe(before);
    expect(loadGame().state).toEqual(a);
  });
  it("accepts an original raw version 1 save and normalizes it", () => {
    const s = solveCase();
    const { inspections, hints, pinned, ...legacy } = s;
    void inspections;
    void hints;
    void pinned;
    expect(
      importBackup(JSON.stringify({ ...legacy, version: 1 }), "quiet-hour")
        .state,
    ).toEqual({ ...s, inspections: [], hints: {}, pinned: [] });
  });
  it("restores a maximum-length note even when JSON needs six characters per control character", () => {
    const state = notebook(solveRadio(), "\u0001".repeat(6000)),
      raw = exportBackup(state);
    expect(raw.length).toBeGreaterThan(20000);
    expect(raw.length).toBeLessThan(MAX_BACKUP_SIZE);
    expect(importBackup(raw, "dead-air").state).toEqual(state);
    expect(parseSave(JSON.stringify(state))).toEqual(state);
  });
});
