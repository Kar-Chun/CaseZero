import { Icon } from "./Icon";
import type { IntroProps } from "./Intro";
export function CaseSelection({
  setScreen,
  hasProgress,
  onNew,
}: Pick<IntroProps, "setScreen" | "hasProgress" | "onNew">) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="page-content case-selection"
    >
      <p className="eyebrow">THE CASE ARCHIVE / 001</p>
      <h1>
        Every case begins
        <br />
        with a <em>question.</em>
      </h1>
      <p className="lede">Choose a file. Leave your assumptions at the door.</p>
      <article className="selection-card">
        <div className="selection-art">
          <span className="tag">AVAILABLE TO INVESTIGATE</span>
          <span className="selection-number">01</span>
        </div>
        <div className="selection-copy">
          <p className="eyebrow">MUSEUM MYSTERY · CASE 001</p>
          <h2>The Quiet Hour</h2>
          <p>
            The Asterion Seal has vanished from a locked display during
            Halcyon’s most exclusive evening. The doors are sealed. The answers
            are inside.
          </p>
          <div className="selection-facts">
            <span>4 suspects</span>
            <span>4 locations</span>
            <span>30–45 min</span>
          </div>
          <button
            className="button primary"
            onClick={() => setScreen("briefing")}
          >
            {hasProgress ? "Read briefing" : "Begin investigation"}
            <Icon name="arrow" />
          </button>
          {hasProgress && (
            <button
              className="text-link continue-link"
              onClick={() => setScreen("investigation")}
            >
              Continue saved investigation
            </button>
          )}
          {hasProgress && (
            <button className="text-link new-game-link" onClick={onNew}>
              New game
              <Icon name="reset" size={14} />
            </button>
          )}
        </div>
      </article>
      <p className="small-note">
        One complete, authored mystery. Explore at your own pace.
      </p>
    </main>
  );
}
