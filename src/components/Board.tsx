"use client";
import { useCallback, useState, useRef, useEffect } from "react";
import { getCase } from "@/game/cases";
import { type CombinationResult, meets, threadDeduction } from "@/game/engine";
import type { GameState } from "@/game/types";
import type { Lead } from "@/game/guidance";
import { FollowUpLinks } from "./FollowUpLinks";
import { ExplanationChoice } from "./ExplanationChoice";
import { HintPanel } from "./HintPanel";
import { Icon } from "./Icon";
import { EvidenceMark, EvidenceFile } from "./EvidenceFile";
import { Modal } from "./Modal";
export function Board({
  state,
  onInspect,
  onExplore,
  onConnect,
  onPinChange,
  onRevealHint,
  onFollow,
}: {
  state: GameState;
  onInspect: (id: string) => void;
  onExplore: () => void;
  onConnect?: (ids: string[], interpretation?: string) => CombinationResult;
  onPinChange: (ids: string[]) => void;
  onRevealHint: (key: string) => void;
  onFollow: (lead: Lead) => void;
}) {
  const { evidence, deductions, locations } = getCase(state.caseId);
  const maxPins = Math.max(...deductions.map((d) => d.evidence.length));
  const sizes = [...new Set(deductions.map((d) => d.evidence.length))].sort();
  const selected = state.pinned;
  const thread = threadDeduction(state, selected);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string>("");
  const focusedQuestion = deductions.find((d) => d.id === focused);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [compare, setCompare] = useState(false);
  const [message, setMessage] = useState("");
  const [established, setEstablished] = useState("");
  const revelation = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (established) revelation.current?.focus();
  }, [established]);
  const closeCompare = useCallback(() => setCompare(false), []);
  const collected = evidence.filter((e) => state.evidence.includes(e.id));
  const visible = collected.filter(
    (e) =>
      (filter === "all" || e.location === filter) &&
      `${e.title} ${e.summary} ${e.kind}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const toggle = (id: string) => {
    setMessage("");
    onPinChange(
      selected.includes(id)
        ? selected.filter((v) => v !== id)
        : selected.length < maxPins
          ? [...selected, id]
          : selected,
    );
  };
  return (
    <section className="board-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MAKE THE CONNECTION</p>
          <h2>Your investigation board</h2>
          <p>
            Select {sizes.join(" or ")} related clues. Establish a chain of
            facts, one conclusion at a time.
          </p>
        </div>
        <span className="tag">
          {state.evidence.length} / {evidence.length} COLLECTED
        </span>
      </div>
      {collected.length > 0 && (
        <nav className="board-shortcuts" aria-label="Board shortcuts">
          <a href="#board-inventory">
            Jump to evidence <Icon name="arrow" size={14} />
          </a>
          <a href="#board-thread">
            Go to pinned thread ({selected.length}){" "}
            <Icon name="board" size={14} />
          </a>
        </nav>
      )}
      <div className="deduction-board" id="board-questions" tabIndex={-1}>
        <div className="board-caption">
          <Icon name="board" size={16} />
          <span>
            THE {deductions.length === 4 ? "FOUR" : deductions.length} QUESTIONS
          </span>
          <span>
            {state.deductions.length} / {deductions.length} established
          </span>
        </div>
        <div className="deduction-grid">
          {deductions.map((d, i) => {
            const solved = state.deductions.includes(d.id);
            return (
              <article
                key={d.id}
                className={`${solved ? "deduction-node established" : "deduction-node"} ${focused === d.id ? "focused-question" : ""}`}
              >
                <span className="pin" />
                <div className="deduction-label">
                  <span>
                    0{i + 1} /{" "}
                    {d.category ??
                      ["METHOD", "ROUTE", "OPPORTUNITY", "MOTIVE"][i]}
                  </span>
                  <Icon name={solved ? "check" : "lock"} size={15} />
                </div>
                <h3>{d.title}</h3>
                <p>{solved ? d.conclusion : d.prompt}</p>
                <div className="node-footer">
                  {solved
                    ? "CONCLUSION ESTABLISHED"
                    : !meets(state, d.requires ?? {})
                      ? "Waiting for an earlier conclusion"
                      : `${d.evidence.filter((id) => state.evidence.includes(id)).length} / ${d.evidence.length} related clues found`}
                </div>
                {solved && (
                  <details className="conclusion-sources">
                    <summary>Review supporting records</summary>
                    <ul>
                      {d.evidence.map((id) => (
                        <li key={id}>
                          <button
                            className="text-link"
                            onClick={() => onInspect(id)}
                          >
                            {evidence.find((e) => e.id === id)!.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                {!solved && (
                  <button
                    className="text-link focus-question"
                    aria-label={`Focus ${d.title}`}
                    aria-pressed={focused === d.id}
                    onClick={() => setFocused(d.id)}
                  >
                    Work on this question
                    <Icon name="arrow" size={14} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
      {focusedQuestion && (
        <div className="question-focus">
          <div>
            <p className="eyebrow">WORKING QUESTION</p>
            <h3>{focusedQuestion.title}</h3>
            <p>
              {focusedQuestion.prompt} This question uses{" "}
              {focusedQuestion.evidence.length} clues.
            </p>
          </div>
          <button className="text-link" onClick={() => setFocused("")}>
            Show all questions
          </button>
        </div>
      )}
      <HintPanel
        state={state}
        goalId={focused || undefined}
        onReveal={onRevealHint}
        onFollow={onFollow}
      />
      {collected.length === 0 ? (
        <div className="empty-state">
          <Icon name="search" size={38} />
          <h3>The first thread begins with a clue.</h3>
          <p>Examine the locations to begin filling your evidence inventory.</p>
          <button className="button primary" onClick={onExplore}>
            Explore locations
            <Icon name="arrow" />
          </button>
        </div>
      ) : (
        <>
          <div className="inventory-heading" id="board-inventory" tabIndex={-1}>
            <div>
              <p className="eyebrow">EVIDENCE INVENTORY</p>
              <p>Read a file to inspect it. Pin a card to compare its facts.</p>
            </div>
            <label className="filter-label">
              Location
              <select
                aria-label="Filter evidence by location"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All locations</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="inventory-search">
            Search collected evidence
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, facts or evidence types…"
            />
          </label>
          <div className="evidence-grid">
            {visible.map((e) => (
              <article
                className={
                  selected.includes(e.id)
                    ? "evidence-card pinned"
                    : "evidence-card"
                }
                key={e.id}
              >
                <EvidenceMark clue={e} />
                <div className="evidence-card-copy">
                  <div className="evidence-card-label">
                    <span>
                      {e.id} / {e.kind}
                    </span>
                    <Icon name="check" size={12} />
                  </div>
                  <h3>{e.title}</h3>
                  <p>{e.summary}</p>
                  <div className="evidence-card-actions">
                    <button
                      className="text-link"
                      onClick={() => onInspect(e.id)}
                      aria-label={`Read ${e.title}`}
                    >
                      Read file
                      <Icon name="file" size={14} />
                    </button>
                    <button
                      className="pin-button"
                      aria-label={`${selected.includes(e.id) ? "Unpin" : "Pin"} ${e.title}`}
                      aria-pressed={selected.includes(e.id)}
                      disabled={
                        !selected.includes(e.id) && selected.length === maxPins
                      }
                      onClick={() => toggle(e.id)}
                    >
                      {selected.includes(e.id) ? (
                        <Icon name="check" size={14} />
                      ) : (
                        <Icon name="board" size={14} />
                      )}
                      <span>{selected.includes(e.id) ? "Pinned" : "Pin"}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <p className="filter-empty">
              {query.trim()
                ? "No evidence matches this search. Try a different term or location."
                : "No evidence from this location yet. Explore it, or choose another filter."}
            </p>
          )}
          {thread?.interpretations &&
            meets(state, thread.requires ?? {}) &&
            !state.deductions.includes(thread.id) && (
              <ExplanationChoice
                question={thread}
                value={explanations[thread.id] ?? ""}
                disabled={!!state.accusation}
                onChange={(value) => {
                  setExplanations((old) => ({ ...old, [thread.id]: value }));
                  setMessage("");
                }}
              />
            )}
          <div
            className={`connection-tray ${selected.length ? "has-thread" : ""}`}
            id="board-thread"
            tabIndex={-1}
          >
            <div>
              <p className="eyebrow">
                PINNED THREAD / {selected.length} OF {maxPins}
              </p>
              <div className="pinned-titles">
                {selected.length ? (
                  selected.map((id) => (
                    <span key={id}>
                      {evidence.find((e) => e.id === id)?.title}
                    </span>
                  ))
                ) : (
                  <span>Choose evidence cards to start a thread.</span>
                )}
              </div>
            </div>
            <div className="tray-actions">
              <button
                className="text-link"
                disabled={!selected.length}
                onClick={() => {
                  onPinChange([]);
                  setMessage("");
                }}
              >
                Clear
              </button>
              <button
                className="button outline"
                disabled={selected.length < 2}
                onClick={() => setCompare(true)}
              >
                Compare evidence
                <Icon name="board" size={16} />
              </button>
              {onConnect && (
                <button
                  className="button primary"
                  disabled={
                    !sizes.includes(selected.length) || !!state.accusation
                  }
                  onClick={() => {
                    const result = onConnect(
                      selected,
                      thread ? explanations[thread.id] : undefined,
                    );
                    setMessage(result.message);
                    setEstablished(
                      result.deductionId &&
                        !state.deductions.includes(result.deductionId)
                        ? result.deductionId
                        : "",
                    );
                    if (result.deductionId) onPinChange([]);
                  }}
                >
                  Test connection
                  <Icon name="spark" size={16} />
                </button>
              )}
            </div>
          </div>
          <div
            className={established && message ? "conclusion-revelation" : ""}
          >
            {established && message && (
              <h3 ref={revelation} tabIndex={-1}>
                Conclusion established:{" "}
                {deductions.find((d) => d.id === established)!.title}
              </h3>
            )}
            <p className="connection-message" role="status">
              {message}
            </p>
            {established && message && (
              <FollowUpLinks
                state={state}
                kind="deductions"
                sourceId={established}
                onFollow={onFollow}
              />
            )}
          </div>
          <a href="#board-questions" className="text-link board-return">
            Back to board questions <Icon name="back" size={14} />
          </a>
        </>
      )}
      {compare && (
        <Modal title="Compare your thread" onClose={closeCompare}>
          <div className="compare-files">
            {selected.map((id) => {
              const e = evidence.find((e) => e.id === id)!;
              return (
                <article key={id}>
                  <h3>{e.title}</h3>
                  <EvidenceFile clue={e} caseId={state.caseId} />
                </article>
              );
            })}
          </div>
          <button className="button primary" onClick={closeCompare}>
            Return to board
            <Icon name="back" size={16} />
          </button>
        </Modal>
      )}
    </section>
  );
}
