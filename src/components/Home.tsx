import { Icon } from "./Icon";
import type { IntroProps } from "./Intro";
export function Home({
  setScreen,
  hasProgress,
  onNew,
}: Pick<IntroProps, "setScreen" | "hasProgress" | "onNew">) {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section className="hero">
          <div className="hero-art" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="gold-line" /> OBSERVE. CONNECT. UNCOVER.
            </p>
            <h1>
              The truth hides
              <br />
              in <em>plain sight.</em>
            </h1>
            <p className="hero-description">
              Nothing disappears without a trace.
              <br />
              Step into the story. Follow the evidence.
              <br />
              Find what everyone else missed.
            </p>
            <button
              className="button primary"
              onClick={() => setScreen(hasProgress ? "investigation" : "cases")}
            >
              {hasProgress ? "Continue investigation" : "Explore the case"}
              <Icon name="arrow" />
            </button>
            {hasProgress && (
              <button className="text-link new-game-link" onClick={onNew}>
                New game
                <Icon name="reset" size={14} />
              </button>
            )}
            <p className="hero-caption">A BROWSER-BASED DETECTIVE EXPERIENCE</p>
          </div>
          <div className="hero-stamp">
            <span>H</span>
            <p>
              HALCYON MUSEUM
              <br />
              <small>EST. 1894</small>
            </p>
          </div>
          <div className="hero-bottom">
            <p>
              ONE MISSING ARTIFACT.
              <br />
              <strong>Four stories. One truth.</strong>
            </p>
            <span className="scroll-cue">
              YOUR FIRST CASE <Icon name="arrow" size={16} />
            </span>
          </div>
        </section>
        <section className="featured-case">
          <div className="case-number">
            001<small>CASE FILE</small>
          </div>
          <div>
            <p className="eyebrow">THE HALCYON COLLECTION</p>
            <h2>The Quiet Hour</h2>
            <p>
              An exclusive evening. An empty display. A room full of secrets.
            </p>
          </div>
          <div className="case-meta">
            <span>
              <Icon name="interviews" size={16} />4 suspects
            </span>
            <span>
              <Icon name="search" size={16} />
              16 evidence items
            </span>
          </div>
          <button className="button outline" onClick={() => setScreen("cases")}>
            Open case file
            <Icon name="arrow" size={18} />
          </button>
        </section>
      </main>
      <footer className="site-footer">
        <span>CASEZERO — LOOK A LITTLE CLOSER.</span>
        <span>Original fiction · No account required</span>
      </footer>
    </>
  );
}
