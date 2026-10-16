import { lazy, Suspense } from "react";
import { cases } from "@/game/cases";
import { Icon } from "./Icon";
import type { IntroProps } from "./Intro";
const CaseStatus = lazy(() => import("./CaseStatus"));
export function CaseSelection({
  setScreen,
  progress = [],
  onChooseCase,
  onResetCase,
  onNew,
}: Pick<
  IntroProps,
  "setScreen" | "progress" | "onChooseCase" | "onResetCase" | "onNew"
>) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="page-content case-selection"
    >
      <p className="eyebrow">
        THE CASE ARCHIVE / {String(cases.length).padStart(3, "0")}
      </p>
      <h1>
        Every case begins
        <br />
        with a <em>question.</em>
      </h1>
      <p className="lede">
        Choose a file. Leave your assumptions at the door. Each investigation
        keeps its own progress.
      </p>
      {cases.map((c) => {
        const saved = progress.find((s) => s.caseId === c.id),
          started = !!saved?.started;
        const open = (screen: "briefing" | "investigation") =>
          onChooseCase ? onChooseCase(c.id, screen) : setScreen(screen);
        return (
          <article
            className={`selection-card selection-${c.theme}`}
            key={c.id}
            aria-label={`${c.title} case file`}
          >
            <div className="selection-art">
              <span className="tag">
                {saved?.accusation ? (
                  <Suspense fallback="VERDICT SUBMITTED">
                    <CaseStatus caseId={c.id} accusation={saved.accusation} />
                  </Suspense>
                ) : started ? (
                  "INVESTIGATION IN PROGRESS"
                ) : (
                  "AVAILABLE TO INVESTIGATE"
                )}
              </span>
              <span className="selection-number">{c.number.slice(1)}</span>
            </div>
            <div className="selection-copy">
              <p className="eyebrow">
                {c.genre} · CASE {c.number}
              </p>
              <h2>{c.title}</h2>
              <p>{c.summary}</p>
              <div className="selection-facts">
                <span>{c.suspects.length} suspects</span>
                <span>{c.locations.length} locations</span>
                <span>{c.duration}</span>
              </div>
              {started && (
                <p className="case-progress-line">
                  {saved.evidence.length}/{c.evidence.length} evidence ·{" "}
                  {saved.deductions.length}/{c.deductions.length} conclusions ·{" "}
                  {saved.notes ? "Notes saved" : "Notebook ready"}
                </p>
              )}
              <button
                className="button primary"
                onClick={() => open("briefing")}
              >
                {c.id === "quiet-hour"
                  ? started
                    ? "Read briefing"
                    : "Begin investigation"
                  : started
                    ? `Read ${c.title} briefing`
                    : `Investigate ${c.title}`}
                <Icon name="arrow" />
              </button>
              {started && (
                <>
                  <button
                    className="text-link continue-link"
                    onClick={() => open("investigation")}
                  >
                    {c.id === "quiet-hour"
                      ? "Continue saved investigation"
                      : `Continue ${c.title}`}
                  </button>
                  <button
                    className="text-link new-game-link"
                    aria-label={`Replay ${c.title}`}
                    onClick={() =>
                      onResetCase ? onResetCase(c.id) : onNew?.()
                    }
                  >
                    Replay this case
                    <Icon name="reset" size={14} />
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
      <p className="small-note">
        Original, authored mysteries. No timer. No shared progress between
        cases.
      </p>
    </main>
  );
}
