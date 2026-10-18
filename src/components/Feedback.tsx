"use client";
import { useRef, useState } from "react";
import {
  feedbackContext,
  feedbackKinds,
  feedbackReport,
  type FeedbackDetails,
} from "@/game/feedback";
import type { GameState } from "@/game/types";
import { Modal } from "./Modal";
export function Feedback({
  state,
  view,
  onClose,
}: {
  state: GameState;
  view: string;
  onClose: () => void;
}) {
  // Capture where the report began; incoming tab updates must not change its context mid-draft.
  const [context] = useState(() => feedbackContext(state, view));
  const [details, setDetails] = useState<FeedbackDetails>({
    kind: "Confusing interaction",
    description: "",
    expected: "",
    device: "",
  });
  const [status, setStatus] = useState<{
    report: string;
    copied: boolean;
  } | null>(null);
  const preview = useRef<HTMLTextAreaElement>(null);
  const review = useRef<HTMLDetailsElement>(null);
  const report = feedbackReport(context, details);
  const ready = !!details.description.trim();
  const update = <K extends keyof FeedbackDetails>(
    key: K,
    value: FeedbackDetails[K],
  ) => setDetails((old) => ({ ...old, [key]: value }));
  const copy = async () => {
    if (!ready) return;
    try {
      if (!navigator.clipboard?.writeText) throw Error("Clipboard unavailable");
      await navigator.clipboard.writeText(report);
      setStatus({ report, copied: true });
    } catch {
      if (review.current) review.current.open = true;
      preview.current?.focus();
      preview.current?.select();
      setStatus({ report, copied: false });
    }
  };
  return (
    <Modal title="Playtest feedback" onClose={onClose}>
      <p>
        Something unclear, frustrating or satisfying? Leave a report for the
        person who invited you.
      </p>
      <p className="small-note">
        Nothing is sent automatically. Your notes, clue contents and accusation
        choices are excluded. Only the text you enter and the case/view/progress
        shown below are included. This draft lasts until you close the form.
      </p>
      <form
        className="feedback-form"
        onSubmit={(e) => {
          e.preventDefault();
          void copy();
        }}
      >
        <label>
          Topic
          <select
            value={details.kind}
            onChange={(e) =>
              update("kind", e.target.value as FeedbackDetails["kind"])
            }
          >
            {feedbackKinds.map((kind) => (
              <option key={kind}>{kind}</option>
            ))}
          </select>
        </label>
        <label>
          What happened or how did it feel?
          <textarea
            required
            maxLength={2000}
            rows={4}
            value={details.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Which action or question? What was confusing or enjoyable?"
          />
        </label>
        <label>
          What did you expect? (optional)
          <textarea
            maxLength={1000}
            rows={2}
            value={details.expected}
            onChange={(e) => update("expected", e.target.value)}
          />
        </label>
        <label>
          Browser or device (optional)
          <input
            maxLength={100}
            value={details.device}
            onChange={(e) => update("device", e.target.value)}
            placeholder="For example: iPhone, Safari"
          />
        </label>
        <details className="feedback-preview" ref={review} open>
          <summary>Review the report</summary>
          <textarea
            ref={preview}
            aria-label="Feedback report"
            readOnly
            rows={9}
            value={report}
          />
        </details>
        <p className="analysis-message" role="status">
          {status
            ? status.report !== report
              ? "The report changed. Copy it again to share the latest version."
              : status.copied
                ? "Report copied. Paste it into a message to your playtest organizer."
                : "Clipboard access is unavailable. The report is selected; use your device’s Copy command, or download it below."
            : ""}
        </p>
        <div className="ending-actions">
          <button className="button primary" type="submit" disabled={!ready}>
            Copy report
          </button>
          {ready && (
            <a
              className="button outline"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(report)}`}
              download="casezero-feedback.txt"
            >
              Download report
            </a>
          )}
        </div>
        <p className="small-note">
          Share the copied text or downloaded file through the channel your
          organizer provided. Closing this form does not send it or change your
          investigation.
        </p>
      </form>
    </Modal>
  );
}
