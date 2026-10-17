"use client";
import { useState } from "react";
import type { Inspection } from "@/game/types";
import { SequenceAnalysis } from "./SequenceAnalysis";
import { Icon } from "./Icon";
export function InspectionPanel({
  activity,
  onSubmit,
}: {
  activity: Inspection;
  onSubmit: (selection: string) => string;
}) {
  const [time, setTime] = useState("");
  const [choices, setChoices] = useState<string[]>(
    activity.panels.map(() => ""),
  );
  const [message, setMessage] = useState("");
  const ready = activity.kind === "clock" ? !!time : choices.every(Boolean);
  if (activity.kind === "sequence")
    return <SequenceAnalysis activity={activity} onSubmit={onSubmit} />;
  return (
    <form
      className="analysis-panel"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready)
          setMessage(
            onSubmit(activity.kind === "clock" ? time : choices.join(":")),
          );
      }}
    >
      <p className="analysis-instruction">{activity.instruction}</p>
      <div className={`analysis-documents analysis-${activity.kind}`}>
        {activity.panels.map((panel, index) => (
          <section className="analysis-document" key={panel.title}>
            <p className="eyebrow">SOURCE {index + 1}</p>
            <h3>{panel.title}</h3>
            <p>{panel.text}</p>
            {activity.kind === "clock" ? (
              <label className="clock-entry">
                {panel.label}
                <input
                  required
                  type="time"
                  step="60"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setMessage("");
                  }}
                />
              </label>
            ) : (
              <fieldset>
                <legend>{panel.label}</legend>
                {panel.options.map((option) => (
                  <label
                    className={
                      choices[index] === option.id
                        ? "comparison-choice chosen-choice"
                        : "comparison-choice"
                    }
                    key={option.id}
                  >
                    <input
                      type="radio"
                      name={`panel-${index}`}
                      value={option.id}
                      checked={choices[index] === option.id}
                      onChange={() => {
                        setChoices((old) =>
                          old.map((v, i) => (i === index ? option.id : v)),
                        );
                        setMessage("");
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
            )}
          </section>
        ))}
      </div>
      <p role="status" className="analysis-message">
        {message}
      </p>
      <button className="button primary" type="submit" disabled={!ready}>
        {activity.kind === "clock"
          ? "Check corrected time"
          : "Test contradiction"}
        <Icon name="search" size={17} />
      </button>
      <p className="small-note">
        No penalty for testing a theory. The records remain available if you
        need to reconsider.
      </p>
    </form>
  );
}
