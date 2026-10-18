import { accountReview } from "@/game/debrief";
import { getCase } from "@/game/cases";
import type { CaseOutcome } from "@/game/outcome";
import type { GameState } from "@/game/types";
export function CaseDebrief({
  state,
  result,
}: {
  state: GameState;
  result: CaseOutcome;
}) {
  const c = getCase(state.caseId);
  const overlooked = c.evidence.filter((e) => !state.evidence.includes(e.id));
  return (
    <div className="case-debrief">
      <details>
        <summary>Review your reasoning</summary>
        <p className="small-note">
          Compare your submitted account with the conclusions you established.
          This review follows the records you used to establish each conclusion.
        </p>
        {accountReview(state, result.matches).map((part) => (
          <article key={part.key}>
            <h3>
              {part.label}{" "}
              <span className="review-status">
                {part.consistent ? "Consistent" : "Revisit this part"}
              </span>
            </h3>
            {part.conclusions.map((d) => (
              <div key={d.title}>
                <h4>{d.title}</h4>
                <p>{d.conclusion}</p>
                <p className="small-note">
                  Supported by: {d.sources.join(" · ")}
                </p>
              </div>
            ))}
          </article>
        ))}
      </details>
      {result.correct && (
        <details>
          <summary>Overlooked leads ({overlooked.length})</summary>
          <p className="small-note">
            Your proof was sufficient. These search points offer more context;
            you do not need them to close the case. Reopen to investigate, or
            replay to compare a different route.
          </p>
          {overlooked.length ? (
            <ul>
              {overlooked.map((e) => (
                <li key={e.id}>
                  {e.point} ·{" "}
                  {c.locations.find((l) => l.id === e.location)!.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>You examined every search point in this case.</p>
          )}
        </details>
      )}
    </div>
  );
}
