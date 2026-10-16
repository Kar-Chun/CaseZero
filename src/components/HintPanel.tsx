"use client";
import { useId } from "react";
import type { GameState } from "@/game/types";
import { progressiveHint, type Lead } from "@/game/guidance";
import { Icon } from "./Icon";
export function HintPanel({
  state,
  onReveal,
  onFollow,
  goalId,
}: {
  state: GameState;
  onReveal: (key: string) => void;
  onFollow: (lead: Lead) => void;
  goalId?: string;
}) {
  const hint = progressiveHint(state, goalId),
    id = useId();
  return (
    <details className="lead-hint hint-panel">
      <summary>Need a lead?</summary>
      {hint.key ? (
        <>
          <p className="hint-intro">
            Choose how much help you want. Hints never collect evidence or solve
            a question for you.
          </p>
          <div id={id} aria-live="polite">
            <ol className="hint-ladder">
              {hint.stages.slice(0, hint.level).map((text, index) => (
                <li key={`${hint.key}-${index}`}>
                  <span>0{index + 1}</span>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="hint-actions">
            {hint.level < 3 ? (
              <button
                className="button outline"
                aria-controls={id}
                onClick={() => onReveal(hint.key!)}
                disabled={!!state.accusation}
              >
                {
                  [
                    "Reveal a gentle hint",
                    "Make it clearer",
                    "Show a specific lead",
                  ][hint.level]
                }
                <Icon name="search" size={15} />
              </button>
            ) : (
              <span className="small-note">
                All three hints revealed for this step.
              </span>
            )}
            <span className="hint-count">{hint.level}/3 revealed</span>
          </div>
          {hint.level === 3 && (
            <button className="text-link" onClick={() => onFollow(hint.lead)}>
              Follow this lead
              <Icon name="arrow" size={15} />
            </button>
          )}
        </>
      ) : (
        <p>{hint.lead.text}</p>
      )}
    </details>
  );
}
