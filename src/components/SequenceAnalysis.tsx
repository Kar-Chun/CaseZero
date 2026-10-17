"use client";
import { useId, useState } from "react";
import type { Inspection } from "@/game/types";
import { Icon } from "./Icon";
export function SequenceAnalysis({
  activity,
  onSubmit,
}: {
  activity: Inspection;
  onSubmit: (selection: string) => string;
}) {
  const [order, setOrder] = useState(activity.panels.map(() => ""));
  const [message, setMessage] = useState("");
  const helpId = useId();
  const filled = order.filter(Boolean);
  const repeated = new Set(filled).size !== filled.length;
  return (
    <form
      className="analysis-panel sequence-analysis"
      onSubmit={(e) => {
        e.preventDefault();
        if (!repeated && order.every(Boolean))
          setMessage(onSubmit(order.join(":")));
      }}
    >
      <p className="analysis-instruction" id={helpId}>
        {activity.instruction}
      </p>
      <div className="sequence-sources">
        {activity.panels.map((p, i) => (
          <article className="analysis-document" key={p.title}>
            <p className="eyebrow">
              ORIGINAL RECORD / {String(i + 1).padStart(2, "0")}
            </p>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
      <fieldset className="sequence-order" aria-describedby={helpId}>
        <legend>Your reconstruction · earliest to latest</legend>
        <ol>
          {activity.panels.map((panel, index) => (
            <li key={panel.label}>
              <span className="sequence-step" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <label>
                {panel.label}
                <select
                  value={order[index]}
                  onChange={(e) => {
                    setOrder((old) =>
                      old.map((value, i) =>
                        i === index ? e.target.value : value,
                      ),
                    );
                    setMessage("");
                  }}
                >
                  <option value="">Choose an event…</option>
                  {panel.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </li>
          ))}
        </ol>
      </fieldset>
      <p className="analysis-message" role="status">
        {repeated
          ? "An event is used more than once. Give each event a different position."
          : message}
      </p>
      <div className="sequence-actions">
        <button
          className="button primary"
          type="submit"
          disabled={repeated || !order.every(Boolean)}
        >
          Test reconstruction
          <Icon name="search" size={17} />
        </button>
        <button
          className="text-link"
          type="button"
          disabled={!filled.length}
          onClick={() => {
            setOrder(activity.panels.map(() => ""));
            setMessage("");
          }}
        >
          Clear sequence
        </button>
      </div>
      <p className="small-note">
        No timer or penalty. Test your order against every source, including the
        untimed record.
      </p>
    </form>
  );
}
