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
            "search",
            "Analyze",
            "Some records need analysis. All source material stays visible. Reconstruct sequences or compare documents using their stated facts, with no timer or penalty for revision.",
          ],
          [
            "board",
            "Connect",
            "Focus a question, read the sources and pin related evidence. More than one set of records may support a question; optional clues need not all be collected. Test the connection; some cases also ask you to choose the explanation those facts support.",
          ],
          [
            "verdict",
            "Conclude",
            "Build all four conclusions and secure the final proof. Then identify the person, method and motive. Unsupported accounts can be revised without losing progress.",
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
