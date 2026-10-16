import { Modal } from "./Modal";
import { Icon } from "./Icon";
export function FieldGuide({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Your field guide" onClose={onClose}>
      <div className="guide-steps">
        {[
          [
            "search",
            "Explore",
            "Search points in each location reveal evidence. Some records need a related clue or a conversation first.",
          ],
          [
            "interviews",
            "Ask",
            "Interview everyone. New evidence unlocks more precise questions; you can return to any conversation.",
          ],
          [
            "board",
            "Connect",
            "Focus a question and select its related evidence cards. Different connections can use two or three clues; four questions guide the case.",
          ],
          [
            "verdict",
            "Conclude",
            "Build all four conclusions, recover the object, then identify a suspect, method and motive.",
          ],
        ].map(([icon, title, copy]) => (
          <div key={title}>
            <Icon name={icon} />
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="small-note">
        Fictional people and events. No time limit. Incorrect theories never end
        your investigation. Progress saves on this browser and device when
        storage is available.
      </p>
      <button className="button primary" onClick={onClose}>
        Understood
        <Icon name="check" />
      </button>
    </Modal>
  );
}
