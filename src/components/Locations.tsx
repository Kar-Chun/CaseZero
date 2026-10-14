"use client";
import { locations, evidence } from "@/game/content";
import { meets } from "@/game/engine";
import type { GameState } from "@/game/types";
import { Icon } from "./Icon";
import { RoomArt } from "./RoomArt";
export function Locations({
  active,
  onSelect,
  state,
  onDiscover,
  onInspect,
}: {
  active: string | null;
  onSelect: (id: string | null) => void;
  state: GameState;
  onDiscover: (id: string) => void;
  onInspect: (id: string) => void;
}) {
  const location = locations.find((l) => l.id === active);
  const count = (id: string) =>
    evidence.filter((e) => e.location === id && state.evidence.includes(e.id))
      .length;
  if (location)
    return (
      <section className="location-detail">
        <button className="text-link back-link" onClick={() => onSelect(null)}>
          <Icon name="back" size={16} />
          Museum map
        </button>
        <div className="location-banner">
          <RoomArt type={location.icon} />
          <div>
            <p className="eyebrow">
              HALCYON MUSEUM / LOCATION {location.id.slice(1)}
            </p>
            <h2>{location.name}</h2>
            <p>{location.atmosphere}</p>
          </div>
        </div>
        <p className="location-description">{location.description}</p>
        <div className="search-heading">
          <p className="eyebrow">EXAMINE THE ROOM</p>
          <span>{count(location.id)} / 4 evidence recorded</span>
        </div>
        <div className="search-grid">
          {evidence
            .filter((e) => e.location === location.id)
            .map((e) => {
              const found = state.evidence.includes(e.id),
                locked = !meets(state, e.requires);
              return (
                <article
                  key={e.id}
                  className={`search-point ${found ? "discovered" : locked ? "locked" : ""}`}
                >
                  <div className="search-point-top">
                    <Icon name={found ? "check" : locked ? "lock" : "search"} />
                    <span className="eyebrow">
                      {found
                        ? "RECORDED"
                        : locked
                          ? "REQUIRES A LEAD"
                          : "SEARCH POINT"}
                    </span>
                    <span className="clue-index">{e.id}</span>
                  </div>
                  <h3>{found ? e.title : e.point}</h3>
                  <p>
                    {found
                      ? e.summary
                      : locked
                        ? e.lockHint
                        : `Examine the ${e.point.toLowerCase()} for a trace of tonight’s events.`}
                  </p>
                  <button
                    className={
                      found ? "button outline" : "button search-button"
                    }
                    disabled={locked || (!!state.accusation && !found)}
                    onClick={() => (found ? onInspect(e.id) : onDiscover(e.id))}
                    aria-label={
                      found ? `Inspect ${e.title}` : `Search ${e.point}`
                    }
                  >
                    {found
                      ? "Read evidence"
                      : locked
                        ? "Awaiting a lead"
                        : "Examine"}
                    <Icon
                      name={found ? "file" : locked ? "lock" : "arrow"}
                      size={16}
                    />
                  </button>
                </article>
              );
            })}
        </div>
        <div className="field-note">
          <Icon name="interviews" />
          <p>
            <strong>Some doors open through conversation.</strong> If a record
            is locked, follow its lead. All locations remain available; return
            when you know more.
          </p>
        </div>
      </section>
    );
  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">FOLLOW THE TRAIL</p>
          <h2>The museum is yours to examine.</h2>
          <p>
            Four rooms. Sixteen traces. Start wherever your instinct takes you.
          </p>
        </div>
        <span className="tag">4 LOCATIONS</span>
      </div>
      <div className="location-grid">
        {locations.map((l, i) => (
          <button
            className="location-card"
            key={l.id}
            onClick={() => onSelect(l.id)}
          >
            <div className="location-image">
              <RoomArt type={l.icon} />
              <span className="location-number">0{i + 1}</span>
            </div>
            <div className="location-card-copy">
              <p className="eyebrow">{l.subtitle}</p>
              <h3>{l.name}</h3>
              <div className="location-card-bottom">
                <span>{count(l.id)} / 4 evidence · Explore location</span>
                <Icon name="arrow" size={18} />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="field-note">
        <Icon name="notebook" />
        <p>
          <strong>A detective’s first rule</strong> Separate what you know from
          what you think you know. Records, objects and accounts can tell
          different stories.
        </p>
      </div>
    </section>
  );
}
