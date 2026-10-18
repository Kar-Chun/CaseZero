import { useRef, useEffect } from "react";
import { evaluate } from "@/game/outcome";
import { getCase } from "@/game/cases";
import { CaseDebrief } from "./CaseDebrief";
import type { GameState, Accusation, CaseId } from "@/game/types";
import { Icon } from "./Icon";
export default function Outcome({
  accusation,
  state,
  caseId = "quiet-hour",
  onRetry,
  onReplay,
  onReview,
}: {
  accusation: Accusation;
  state: GameState;
  caseId?: CaseId;
  onRetry: () => void;
  onReplay: () => void;
  onReview: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const { suspects, methods, motives, number } = getCase(caseId);
  const result = evaluate(accusation, caseId);
  return (
    <section
      className={`outcome ${result.correct ? "outcome-closed" : "outcome-open"}`}
    >
      <div className="outcome-emblem">
        <Icon name={result.correct ? "check" : "verdict"} size={38} />
      </div>
      <p className="eyebrow">
        CASE {number} / {result.correct ? "RESOLVED" : "REVIEW REQUIRED"}
      </p>
      <h2 ref={heading} tabIndex={-1}>
        {result.title}
      </h2>
      <p className="outcome-subtitle">{result.subtitle}</p>
      <div className="ending-story">
        {result.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="submitted-account">
        <p className="eyebrow">YOUR SUBMITTED ACCOUNT</p>
        <p>
          <strong>
            {suspects.find((s) => s.id === accusation.suspect)?.name}
          </strong>{" "}
          · {methods.find((m) => m.id === accusation.method)?.label} ·{" "}
          {motives.find((m) => m.id === accusation.motive)?.label}
        </p>
      </div>
      <CaseDebrief state={state} result={result} />
      <blockquote>{result.epilogue}</blockquote>
      <div className="ending-actions">
        {!result.correct && (
          <button className="button primary" onClick={onRetry}>
            Return to investigation
            <Icon name="back" />
          </button>
        )}
        {result.correct && (
          <button className="button primary" onClick={onReview}>
            Review case file
            <Icon name="notebook" />
          </button>
        )}
        {result.correct && (
          <button className="button outline" onClick={onRetry}>
            Reopen investigation
            <Icon name="search" size={18} />
          </button>
        )}
        <button className="button outline" onClick={onReplay}>
          Play again
          <Icon name="reset" size={18} />
        </button>
      </div>
      <p className="small-note">
        Reopen keeps your discoveries and clears the submitted account. Replay
        starts the same authored mystery again after confirmation; export a
        backup first to preserve this investigation.
      </p>
    </section>
  );
}
