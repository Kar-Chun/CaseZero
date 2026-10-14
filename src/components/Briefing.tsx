import { Icon } from "./Icon";
import type { IntroProps } from "./Intro";
export function Briefing({
  setScreen,
  hasProgress,
  onBegin,
}: Pick<IntroProps, "setScreen" | "hasProgress" | "onBegin">) {
  return (
    <main id="main-content" tabIndex={-1} className="page-content briefing">
      <button
        className="text-link back-link"
        onClick={() => setScreen("cases")}
      >
        <Icon name="back" size={16} />
        Case files
      </button>
      <div className="briefing-header">
        <div>
          <p className="eyebrow">CONFIDENTIAL / CASE 001</p>
          <h1>The Quiet Hour</h1>
          <p className="lede">The Halcyon Museum · 14 November 2025 · 21:25</p>
        </div>
        <span className="file-stamp">
          OPEN
          <br />
          INVESTIGATION
        </span>
      </div>
      <div className="briefing-grid">
        <article className="briefing-paper">
          <p className="eyebrow">YOUR BRIEFING</p>
          <h2>
            History has a way
            <br />
            of going missing.
          </h2>
          <p>
            At 21:18, the host of Halcyon’s private patron evening found the
            Asterion Seal’s display empty. No broken glass. No alarm. No one
            admitting they saw a thing.
          </p>
          <p>
            The ninth-century seal is the centerpiece of the museum’s new
            collection. Its disappearance could destroy the institution’s
            reputation—and the careers of those gathered here tonight.
          </p>
          <p>
            The exits were sealed immediately. Four people had reason to want
            the seal gone. You have unrestricted access to the gallery, security
            office, conservation workshop and archive.
          </p>
          <blockquote>
            “Find the object. Establish the facts.
            <br />
            Let the evidence tell you the rest.”<cite>— Museum liaison</cite>
          </blockquote>
        </article>
        <aside className="objectives">
          <p className="eyebrow">YOUR OBJECTIVES</p>
          {[
            "Examine the museum and collect evidence",
            "Interview all four persons of interest",
            "Connect clues into four conclusions",
            "Recover the seal and submit your case",
          ].map((v, i) => (
            <div className="objective" key={v}>
              <span>0{i + 1}</span>
              <p>{v}</p>
            </div>
          ))}
          <div className="briefing-note">
            <Icon name="notebook" />
            <p>
              No timer. No penalties for exploring. Your notebook is yours;
              conclusions must be supported by evidence.
            </p>
          </div>
          <button className="button primary full-width" onClick={onBegin}>
            {hasProgress ? "Return to investigation" : "Enter the museum"}
            <Icon name="arrow" />
          </button>
        </aside>
      </div>
    </main>
  );
}
