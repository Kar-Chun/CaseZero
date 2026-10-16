"use client";
import { getCase } from "@/game/cases";
import { type Lead } from "@/game/guidance";
import type { GameState } from "@/game/types";
import { SaveTools } from "./SaveTools";
import { HintPanel } from "./HintPanel";
import { Icon } from "./Icon";
export function Notebook({
  state,
  onNotes,
  onBriefing,
  onInspect,
  onLead,
  onReset,
  available,
  onRevealHint,
  onImport,
}: {
  state: GameState;
  onNotes: (text: string) => void;
  onBriefing: () => void;
  onInspect: (id: string) => void;
  onLead: (lead: Lead) => void;
  onReset: () => void;
  available: boolean;
  onRevealHint: (key: string) => void;
  onImport: (state: GameState) => void;
}) {
  const { evidence, deductions, dialogue, suspects, locations } = getCase(
    state.caseId,
  );
  const interviewed = suspects.filter((s) =>
    dialogue.some((t) => t.suspect === s.id && state.answers.includes(t.id)),
  ).length;
  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR CASE FILE</p>
          <h2>A place to think.</h2>
          <p>
            Keep your observations. Review the facts. Find your next question.
          </p>
        </div>
        <button className="text-link" onClick={onBriefing}>
          Read briefing
          <Icon name="file" size={16} />
        </button>
      </div>
      <div className="notebook-grid">
        <div className="notes-page">
          <div className="notes-header">
            <p className="eyebrow">DETECTIVE’S NOTES</p>
            <Icon name="notebook" />
          </div>
          <label className="notes-label" htmlFor="case-notes">
            Your working theory
          </label>
          <textarea
            id="case-notes"
            aria-label="Case notes"
            aria-describedby="notes-help"
            maxLength={6000}
            value={state.notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="What do the records establish? Whose account conflicts with a fact? Write down your observations…"
          />
          <div className="notes-footer">
            <span id="notes-help">
              {available
                ? "Saved automatically on this device."
                : "Kept in memory for this session."}
            </span>
            <span>{state.notes.length} / 6000</span>
          </div>
        </div>
        <aside className="case-progress">
          <p className="eyebrow">INVESTIGATION STATUS</p>
          <div className="progress-stats">
            <span>
              <strong>
                {state.evidence.length}
                <small>/{evidence.length}</small>
              </strong>
              Evidence
            </span>
            <span>
              <strong>
                {interviewed}
                <small>/{suspects.length}</small>
              </strong>
              People heard
            </span>
            <span>
              <strong>
                {state.deductions.length}
                <small>/{deductions.length}</small>
              </strong>
              Conclusions
            </span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Evidence collected"
            aria-valuenow={state.evidence.length}
            aria-valuemin={0}
            aria-valuemax={evidence.length}
          >
            <span
              style={{
                width: `${(state.evidence.length / evidence.length) * 100}%`,
              }}
            />
          </div>
          <HintPanel state={state} onReveal={onRevealHint} onFollow={onLead} />
          <p className="small-note">
            Motive is a starting point. Opportunity, method and the object’s
            route are what make a case.
          </p>
        </aside>
      </div>
      <div className="notebook-records">
        <article className="record-list">
          <p className="eyebrow">EVIDENCE TRAIL</p>
          {state.evidence.length === 0 ? (
            <p className="small-note">
              Your first discovery will be recorded here.
            </p>
          ) : (
            state.evidence.map((id) => {
              const e = evidence.find((e) => e.id === id)!;
              return (
                <button
                  key={id}
                  className="record-button"
                  onClick={() => onInspect(id)}
                >
                  <span>{id}</span>
                  <div>
                    <strong>{e.title}</strong>
                    <small>
                      {locations.find((l) => l.id === e.location)?.name}
                    </small>
                  </div>
                  <Icon name="file" size={16} />
                </button>
              );
            })
          )}
        </article>
        <article className="record-list">
          <p className="eyebrow">ESTABLISHED CONCLUSIONS</p>
          {deductions.map((d) => (
            <div key={d.id} className="notebook-deduction">
              <h3>
                <Icon
                  name={state.deductions.includes(d.id) ? "check" : "lock"}
                  size={16}
                />
                {d.title}
              </h3>
              <p>
                {state.deductions.includes(d.id)
                  ? d.conclusion
                  : "Not yet established. Follow this question on the evidence board."}
              </p>
            </div>
          ))}
          <details className="notebook-interviews">
            <summary>Interview records ({state.answers.length} topics)</summary>
            {state.answers.map((id) => {
              const t = dialogue.find((t) => t.id === id)!;
              return (
                <article key={id}>
                  <p className="eyebrow">
                    {suspects.find((s) => s.id === t.suspect)?.name}
                  </p>
                  <h3>{t.question}</h3>
                  <p>{t.response}</p>
                </article>
              );
            })}
            {state.answers.length === 0 && (
              <p className="small-note">No interviews recorded yet.</p>
            )}
          </details>
        </article>
      </div>
      <SaveTools state={state} onImport={onImport} />
      <div className="reset-area">
        <div>
          <p>Start with a clean case file.</p>
          <span>
            Reset removes this case’s evidence, interviews, deductions and notes
            from this device.
          </span>
        </div>
        <button className="button outline" onClick={onReset}>
          Reset progress
          <Icon name="reset" size={16} />
        </button>
      </div>
    </section>
  );
}
