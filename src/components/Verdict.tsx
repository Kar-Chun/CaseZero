"use client";
import { lazy, Suspense, useState } from "react";
import { canAccuse, validAccusation } from "@/game/engine";
import { getCase } from "@/game/cases";
import type { GameState, Accusation } from "@/game/types";
import { Icon } from "./Icon";
const Outcome = lazy(() => import("./Outcome"));
export function Verdict({
  state,
  onSubmit,
  onBoard,
  onRecover,
  onRetry,
  onReplay,
  onReview,
}: {
  state: GameState;
  onSubmit: (value: Accusation) => void;
  onBoard: () => void;
  onRecover: () => void;
  onRetry: () => void;
  onReplay: () => void;
  onReview: () => void;
}) {
  const c = getCase(state.caseId);
  const { suspects, methods, motives, deductions } = c;
  const [draft, setDraft] = useState<Accusation>({
    suspect: "",
    method: "",
    motive: "",
  });
  const [review, setReview] = useState(false);
  if (state.accusation)
    return (
      <Suspense fallback={<p role="status">Reviewing your case…</p>}>
        <Outcome
          accusation={state.accusation}
          caseId={state.caseId}
          onRetry={onRetry}
          onReplay={onReplay}
          onReview={onReview}
        />
      </Suspense>
    );
  const ready = canAccuse(state),
    concluded = deductions.every((d) => state.deductions.includes(d.id));
  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE FINAL ACCOUNT</p>
          <h2>A theory needs a chain of proof.</h2>
          <p>
            Identify a person, a method, and a motive. Let your evidence support
            all three.
          </p>
        </div>
        <span className="tag">
          {ready ? "READY TO SUBMIT" : "CASE STILL OPEN"}
        </span>
      </div>
      <div className="verdict-grid">
        <aside className="proof-checklist">
          <p className="eyebrow">THE CHAIN OF PROOF</p>
          {[
            ...deductions.map((d) => ({
              title: d.title,
              done: state.deductions.includes(d.id),
            })),
            {
              title: c.resolution.proofLabel,
              done: state.evidence.includes(c.resolution.evidenceId),
            },
          ].map((p) => (
            <div
              className={p.done ? "proof-item done" : "proof-item"}
              key={p.title}
            >
              <Icon name={p.done ? "check" : "lock"} size={17} />
              <span>{p.title}</span>
            </div>
          ))}
          <button className="text-link" onClick={onBoard}>
            Review evidence board
            <Icon name="arrow" size={16} />
          </button>
        </aside>
        <div className="verdict-form">
          {!ready ? (
            <>
              <div className="verdict-intro">
                <Icon name="verdict" size={40} />
                <h3>Your case is still open.</h3>
                <p>
                  Establish all {deductions.length} conclusions and{" "}
                  {c.resolution.proofLabel.toLowerCase()} before submitting an
                  accusation.
                </p>
              </div>
              {concluded ? (
                <button className="button primary" onClick={onRecover}>
                  {c.resolution.searchLabel}
                  <Icon name="search" />
                </button>
              ) : (
                <button className="button primary" onClick={onBoard}>
                  Follow the four questions
                  <Icon name="board" />
                </button>
              )}
            </>
          ) : review ? (
            <>
              <p className="eyebrow">REVIEW YOUR ACCOUNT</p>
              <h3>Check your reasoning.</h3>
              <div className="accusation-summary">
                <p>
                  <span>PERSON</span>
                  {suspects.find((s) => s.id === draft.suspect)?.name}
                </p>
                <p>
                  <span>METHOD</span>
                  {methods.find((m) => m.id === draft.method)?.label}
                </p>
                <p>
                  <span>MOTIVE</span>
                  {motives.find((m) => m.id === draft.motive)?.label}
                </p>
              </div>
              <p className="small-note">
                The case will be evaluated against the established facts. You
                can return to the investigation if your account is unsupported.
              </p>
              <div className="ending-actions">
                <button
                  className="button primary"
                  onClick={() => onSubmit(draft)}
                >
                  Submit accusation
                  <Icon name="verdict" size={18} />
                </button>
                <button className="text-link" onClick={() => setReview(false)}>
                  Edit account
                </button>
              </div>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validAccusation(draft, state.caseId)) setReview(true);
              }}
            >
              <p className="eyebrow">YOUR DEDUCTION</p>
              <h3>{c.resolution.question}</h3>
              <label>
                Person of interest
                <select
                  required
                  value={draft.suspect}
                  onChange={(e) =>
                    setDraft({ ...draft, suspect: e.target.value })
                  }
                >
                  <option value="">Choose a suspect</option>
                  {suspects.map((s) => (
                    <option value={s.id} key={s.id}>
                      {s.name} — {s.role}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {c.resolution.methodLabel}
                <select
                  required
                  value={draft.method}
                  onChange={(e) =>
                    setDraft({ ...draft, method: e.target.value })
                  }
                >
                  <option value="">Choose the method</option>
                  {methods.map((m) => (
                    <option value={m.id} key={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {c.resolution.motiveLabel}
                <select
                  required
                  value={draft.motive}
                  onChange={(e) =>
                    setDraft({ ...draft, motive: e.target.value })
                  }
                >
                  <option value="">Choose the motive</option>
                  {motives.map((m) => (
                    <option value={m.id} key={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="button primary"
                disabled={!validAccusation(draft, state.caseId)}
                type="submit"
              >
                Review accusation
                <Icon name="arrow" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
