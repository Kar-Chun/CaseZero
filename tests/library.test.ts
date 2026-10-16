import { beforeEach, afterEach, describe, it, expect } from "vitest";
import { cases, getCase } from "../src/game/cases";
import {
  loadGame,
  saveGame,
  clearGame,
  saveKey,
  parseSave,
} from "../src/game/storage";
import { freshState, startCase, discover, notebook } from "../src/game/engine";
import { nextLead } from "../src/game/guidance";
let temporary = false;
beforeEach(() => {
  if (!cases.some((c) => c.id === "dead-air")) {
    cases.push({
      ...getCase(),
      id: "dead-air",
      number: "002",
      title: "Test fixture",
    });
    temporary = true;
  }
});
afterEach(() => {
  if (temporary) {
    cases.splice(
      cases.findIndex((c) => c.id === "dead-air"),
      1,
    );
    temporary = false;
  }
});
describe("independent investigations", () => {
  it("saves, restores and resets only the selected case", () => {
    const a = notebook(
      discover(startCase(freshState()), "E01"),
      "Original case notes",
    );
    const b = notebook(
      discover(
        startCase(freshState("dead-air")),
        getCase("dead-air").evidence[0].id,
      ),
      "Radio notes",
    );
    saveGame(a);
    saveGame(b);
    expect(saveKey(a.caseId)).not.toBe(saveKey(b.caseId));
    expect(loadGame(undefined, "quiet-hour").state).toEqual(a);
    expect(loadGame(undefined, "dead-air").state).toEqual(b);
    clearGame(undefined, "dead-air");
    expect(loadGame(undefined, "dead-air").state.started).toBe(false);
    expect(loadGame().state).toEqual(a);
  });
  it("rejects a different case snapshot stored under the active case key", () => {
    const a = startCase(freshState());
    window.localStorage.setItem(saveKey("dead-air"), JSON.stringify(a));
    expect(loadGame(undefined, "dead-air").state).toEqual(
      freshState("dead-air"),
    );
    expect(parseSave(JSON.stringify({ ...a, caseId: "unknown" }))).toBeNull();
  });
  it("gives a reachable first lead using case content, not museum-specific IDs", () => {
    for (const c of cases) {
      const lead = nextLead(startCase(freshState(c.id)));
      expect(lead.kind).toBe("location");
      expect(c.locations.some((l) => l.id === lead.target)).toBe(true);
    }
  });
});
