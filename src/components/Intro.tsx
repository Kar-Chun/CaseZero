"use client";
import type { CaseDefinition, CaseId, GameState } from "@/game/types";
import { Home } from "./Home";
import { CaseSelection } from "./CaseSelection";
import { Briefing } from "./Briefing";
export type Screen = "home" | "cases" | "briefing" | "investigation";
export type IntroProps = {
  screen: Screen;
  setScreen: (s: Screen) => void;
  onBegin: () => void;
  onGuide: () => void;
  hasProgress: boolean;
  onNew?: () => void;
  caseData?: CaseDefinition;
  progress?: GameState[];
  onChooseCase?: (id: CaseId, screen: "briefing" | "investigation") => void;
  onResetCase?: (id: CaseId) => void;
};
export function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand" onClick={onClick} aria-label="CaseZero home">
      <span className="brand-mark">
        C<span>0</span>
      </span>
      <span>
        CASE<span className="brand-zero">ZERO</span>
        <small>AN INVESTIGATION AWAITS</small>
      </span>
    </button>
  );
}
export function Intro(props: IntroProps) {
  const { screen, setScreen, onGuide } = props;
  return (
    <div className="intro-page">
      <header className="site-header">
        <Brand onClick={() => setScreen("home")} />
        <nav aria-label="Main navigation">
          <button
            className={screen === "cases" ? "text-link active" : "text-link"}
            onClick={() => setScreen("cases")}
          >
            Case files
          </button>
          <button className="text-link" onClick={onGuide}>
            How to play
          </button>
        </nav>
        <span className="header-status">
          <span className="status-dot" />
          INDEPENDENT DETECTIVE BUREAU
        </span>
      </header>
      {screen === "home" ? (
        <Home {...props} />
      ) : screen === "cases" ? (
        <CaseSelection {...props} />
      ) : (
        <Briefing {...props} />
      )}
    </div>
  );
}
