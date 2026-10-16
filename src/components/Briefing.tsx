import { getCase } from "@/game/cases";
import { Icon } from "./Icon";
import type { IntroProps } from "./Intro";
export function Briefing({
  setScreen,
  hasProgress,
  onBegin,
  caseData = getCase(),
}: Pick<IntroProps, "setScreen" | "hasProgress" | "onBegin" | "caseData">) {
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
          <p className="eyebrow">CONFIDENTIAL / CASE {caseData.number}</p>
          <h1>{caseData.title}</h1>
          <p className="lede">{caseData.setting}</p>
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
          <h2>{caseData.briefing.heading}</h2>
          {caseData.briefing.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <blockquote>
            “{caseData.briefing.quote}”
            <cite>— {caseData.briefing.attribution}</cite>
          </blockquote>
        </article>
        <aside className="objectives">
          <p className="eyebrow">YOUR OBJECTIVES</p>
          {caseData.briefing.objectives.map((v, i) => (
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
            {hasProgress ? "Return to investigation" : caseData.enterLabel}
            <Icon name="arrow" />
          </button>
        </aside>
      </div>
    </main>
  );
}
