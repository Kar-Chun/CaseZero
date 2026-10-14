"use client";
import { useState } from "react";
import { suspects, dialogue, evidence, locations } from "@/game/content";
import { meets } from "@/game/engine";
import type { GameState } from "@/game/types";
import { Icon } from "./Icon";
export function Interviews({
  state,
  onAnswer,
  onFollow,
}: {
  state: GameState;
  onAnswer: (id: string) => void;
  onFollow: (id: string) => void;
}) {
  const [person, setPerson] = useState("S01");
  const [topic, setTopic] = useState<string | null>(null);
  const suspect = suspects.find((s) => s.id === person)!;
  const lines = dialogue.filter((t) => t.suspect === person);
  const recorded = lines.filter((t) => state.answers.includes(t.id));
  const active = lines.find(
    (t) => t.id === topic && state.answers.includes(t.id),
  );
  const interviewed = suspects.filter((s) =>
    dialogue.some((t) => t.suspect === s.id && state.answers.includes(t.id)),
  ).length;
  const leads = active
    ? evidence.filter(
        (e) =>
          e.requires.answers?.includes(active.id) &&
          !state.evidence.includes(e.id),
      )
    : [];
  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">PERSONS OF INTEREST</p>
          <h2>Everyone has a version of the truth.</h2>
          <p>
            Listen to their account. Return with evidence. Ask a better
            question.
          </p>
        </div>
        <span className="tag">{interviewed} / 4 INTERVIEWED</span>
      </div>
      <div className="suspect-tabs">
        {suspects.map((s) => {
          const heard = dialogue.some(
            (t) => t.suspect === s.id && state.answers.includes(t.id),
          );
          return (
            <button
              key={s.id}
              className={person === s.id ? "suspect-tab chosen" : "suspect-tab"}
              aria-pressed={person === s.id}
              onClick={() => {
                setPerson(s.id);
                setTopic(null);
              }}
            >
              <span className={`avatar avatar-${s.id}`}>{s.initials}</span>
              <span>
                <strong>{s.name}</strong>
                <small>
                  {s.role}
                  {heard ? " · Interviewed" : ""}
                </small>
              </span>
            </button>
          );
        })}
      </div>
      <div className="interview-layout">
        <article className="profile">
          <div className={`portrait portrait-${suspect.id}`} aria-hidden="true">
            <span>{suspect.initials}</span>
            <span className="portrait-lines" />
            <p>PERSON OF INTEREST / {suspect.id.slice(1)}</p>
          </div>
          <p className="eyebrow">{suspect.role}</p>
          <h3>{suspect.name}</h3>
          <blockquote>{suspect.quote}</blockquote>
          <p>{suspect.background}</p>
          <div className="profile-facts">
            <div>
              <span className="eyebrow">POSSIBLE MOTIVE</span>
              <p>{suspect.motive}</p>
            </div>
            <div>
              <span className="eyebrow">STATED ALIBI</span>
              <p>{suspect.alibi}</p>
            </div>
          </div>
        </article>
        <div className="conversation">
          <div className="conversation-header">
            <p className="eyebrow">INTERVIEW ROOM</p>
            <span>
              {recorded.length} / {lines.length} topics recorded
            </span>
          </div>
          <h3>Choose your question.</h3>
          <div className="question-list">
            {lines.map((t) => {
              const locked = !meets(state, t.requires),
                heard = state.answers.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={locked ? "question locked-question" : "question"}
                >
                  <button
                    disabled={locked || (!!state.accusation && !heard)}
                    className={
                      topic === t.id
                        ? "question-button active-question"
                        : "question-button"
                    }
                    aria-pressed={topic === t.id}
                    onClick={() => {
                      onAnswer(t.id);
                      setTopic(t.id);
                    }}
                  >
                    <span>{t.question}</span>
                    <Icon
                      name={locked ? "lock" : heard ? "check" : "arrow"}
                      size={16}
                    />
                  </button>
                  {locked && <p>{t.lockHint}</p>}
                </div>
              );
            })}
          </div>
          <div className="response" aria-live="polite" aria-atomic="true">
            {active ? (
              <>
                <p className="eyebrow">{suspect.name} / ON THE RECORD</p>
                <blockquote>“{active.response}”</blockquote>
                {leads.map((e) => (
                  <div className="interview-lead" key={e.id}>
                    <Icon name="search" size={18} />
                    <div>
                      <p>A new lead: {e.point}</p>
                      <button
                        className="text-link"
                        onClick={() => onFollow(e.location)}
                      >
                        Visit {locations.find((l) => l.id === e.location)?.name}
                        <Icon name="arrow" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="response-placeholder">
                <Icon name="interviews" size={25} />
                <p>
                  Select a question to hear their account.
                  <br />
                  Evidence unlocks more precise lines of inquiry.
                </p>
              </div>
            )}
          </div>
          {recorded.length > 0 && (
            <details className="transcript">
              <summary>Interview record ({recorded.length})</summary>
              {recorded.map((t) => (
                <article key={t.id}>
                  <p className="transcript-question">{t.question}</p>
                  <p>{t.response}</p>
                </article>
              ))}
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
