"use client";
import {
  useCallback,
  useState,
  useSyncExternalStore,
  useRef,
  useEffect,
} from "react";
import {
  startCase,
  discover,
  answer,
  combine,
  accuse,
  resumeInvestigation,
  notebook,
} from "@/game/engine";
import { useGame } from "@/game/useGame";
import type { Lead } from "@/game/guidance";
import { evidence } from "@/game/content";
import { Intro, Brand, type Screen } from "./Intro";
import { Locations } from "./Locations";
import { Notebook } from "./Notebook";
import { FieldGuide } from "./FieldGuide";
import { Verdict } from "./Verdict";
import { Interviews } from "./Interviews";
import { Board } from "./Board";
import { EvidenceFile } from "./EvidenceFile";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
type Tab = "locations" | "board" | "interviews" | "notebook" | "verdict";
const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "locations", label: "Locations", icon: "gallery" },
  { id: "board", label: "Evidence board", icon: "board" },
  { id: "interviews", label: "Interviews", icon: "interviews" },
  { id: "notebook", label: "Notebook", icon: "notebook" },
  { id: "verdict", label: "Accusation", icon: "verdict" },
];
const subscribe = () => () => {};
export function GameApp() {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return ready ? (
    <GameExperience />
  ) : (
    <div aria-busy="true">
      <fieldset className="boot-screen" disabled>
        <Intro
          screen="home"
          setScreen={() => {}}
          onBegin={() => {}}
          onGuide={() => {}}
          hasProgress={false}
        />
      </fieldset>
    </div>
  );
}
function GameExperience() {
  const initialFocus = useRef(true);
  const [screen, setScreen] = useState<Screen>("home");
  const { state, setState, available, notice, dismissNotice, reset } =
    useGame();
  const [tab, setTab] = useState<Tab>("locations");
  const [location, setLocation] = useState<string | null>(null);
  const [guide, setGuide] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState<"new" | "reset" | null>(null);
  const closeReset = useCallback(() => setResetMode(null), []);
  const closeFile = useCallback(() => setFile(null), []);
  const closeGuide = useCallback(() => setGuide(false), []);
  const selectedClue = evidence.find(
    (e) => e.id === file && state.evidence.includes(e.id),
  );
  const collect = (id: string) => {
    setState((s) => discover(s, id));
    setFile(id);
  };
  const connect = (ids: string[]) => {
    const result = combine(state, ids);
    setState(result.state);
    return result.message;
  };
  const replay = () => {
    reset();
    setTab("locations");
    setLocation(null);
    setScreen("briefing");
  };
  const navigateScreen = (next: Screen) => {
    if (next === "investigation" && state.accusation) setTab("verdict");
    setScreen(next);
  };
  const follow = (lead: Lead) => {
    if (lead.kind === "location") {
      setLocation(lead.target ?? null);
      setTab("locations");
    } else
      setTab(
        lead.kind === "interview"
          ? "interviews"
          : lead.kind === "board"
            ? "board"
            : "verdict",
      );
  };
  const effectiveScreen =
    screen === "investigation" && !state.started ? "home" : screen;
  useEffect(() => {
    if (initialFocus.current) {
      initialFocus.current = false;
      return;
    }
    const heading = document
      .getElementById("main-content")
      ?.querySelector<HTMLElement>("h1,h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }, [screen, tab, location]);
  const begin = () => {
    setState((s) => startCase(s));
    navigateScreen("investigation");
  };
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {notice && (
        <div className="save-notice" role="status">
          <p>{notice}</p>
          <button
            className="icon-button"
            aria-label="Dismiss save notice"
            onClick={dismissNotice}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      {effectiveScreen !== "investigation" ? (
        <div className="intro-stage">
          <Intro
            screen={effectiveScreen}
            setScreen={navigateScreen}
            onBegin={begin}
            hasProgress={state.started}
            onGuide={() => setGuide(true)}
            onNew={() => setResetMode("new")}
          />
        </div>
      ) : (
        <div className="investigation">
          <header className="game-header">
            <Brand onClick={() => setScreen("home")} />
            <div className="case-heading">
              <span className="eyebrow">
                CASE 001 /{" "}
                {state.accusation ? "CASE SUBMITTED" : "ACTIVE INVESTIGATION"}
              </span>
              <h1>The Quiet Hour</h1>
            </div>
            <button className="text-link" onClick={() => setGuide(true)}>
              <Icon name="search" size={16} />
              Field guide
            </button>
          </header>
          <div className="investigation-status">
            <span>
              <span className="status-dot" />
              HALCYON MUSEUM <small>21:25 · EXITS SEALED</small>
            </span>
            <div>
              <span>
                {state.evidence.length}
                <small>/ 16 EVIDENCE</small>
              </span>
              <span>
                {state.deductions.length}
                <small>/ 4 CONCLUSIONS</small>
              </span>
            </div>
          </div>
          <nav className="game-nav" aria-label="Investigation navigation">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "nav-item selected" : "nav-item"}
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => setTab(t.id)}
              >
                <Icon name={t.icon} />
                {t.label}
              </button>
            ))}
          </nav>
          <main id="main-content" className="game-main" tabIndex={-1}>
            {tab === "locations" ? (
              <Locations
                active={location}
                onSelect={setLocation}
                state={state}
                onDiscover={collect}
                onInspect={setFile}
              />
            ) : tab === "board" ? (
              <Board
                state={state}
                onInspect={setFile}
                onExplore={() => setTab("locations")}
                onConnect={connect}
              />
            ) : tab === "interviews" ? (
              <Interviews
                state={state}
                onAnswer={(id) => setState((s) => answer(s, id))}
                onFollow={(id) => {
                  setLocation(id);
                  setTab("locations");
                }}
              />
            ) : tab === "notebook" ? (
              <Notebook
                state={state}
                onNotes={(text) => setState((s) => notebook(s, text))}
                onBriefing={() => setScreen("briefing")}
                onInspect={setFile}
                onLead={follow}
                onReset={() => setResetMode("reset")}
                available={available}
              />
            ) : (
              <Verdict
                state={state}
                onSubmit={(value) => setState((s) => accuse(s, value))}
                onBoard={() => setTab("board")}
                onRecover={() => {
                  setLocation("L03");
                  setTab("locations");
                }}
                onRetry={() => {
                  setState((s) => resumeInvestigation(s));
                  setTab("board");
                }}
                onReplay={replay}
                onReview={() => setTab("notebook")}
              />
            )}
          </main>
          <footer className="game-footer">
            <span>CASEZERO / THE QUIET HOUR</span>
            <span
              className={
                available ? "save-indicator" : "save-indicator unavailable"
              }
            >
              <Icon name={available ? "save" : "lock"} size={12} />
              {available
                ? "Saved on this device"
                : "Saving unavailable · session only"}
            </span>
          </footer>
        </div>
      )}
      {selectedClue && (
        <Modal title={selectedClue.title} onClose={closeFile}>
          <EvidenceFile clue={selectedClue} />
          <button
            className="button primary"
            onClick={() => {
              closeFile();
              setTab("board");
            }}
          >
            View evidence board
            <Icon name="board" size={16} />
          </button>
        </Modal>
      )}
      {guide && <FieldGuide onClose={closeGuide} />}
      {resetMode && (
        <Modal
          title={
            resetMode === "new"
              ? "Start a new investigation?"
              : "Reset this case?"
          }
          onClose={closeReset}
        >
          <p>
            This clears your evidence, interviews, deductions and notes for The
            Quiet Hour on this device.
          </p>
          <div className="ending-actions">
            <button
              className="button primary"
              onClick={() => {
                const mode = resetMode;
                closeReset();
                reset();
                setTab("locations");
                setLocation(null);
                setFile(null);
                setScreen(mode === "new" ? "briefing" : "home");
              }}
            >
              {resetMode === "new" ? "Start new game" : "Reset case"}
              <Icon name="reset" size={16} />
            </button>
            <button className="button outline" onClick={closeReset}>
              Keep investigating
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
