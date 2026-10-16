import type { Evidence } from "@/game/types";
import { getCase } from "@/game/cases";
import type { CaseId } from "@/game/types";
import { Icon } from "./Icon";
export function EvidenceMark({ clue }: { clue: Evidence }) {
  const icon =
    clue.kind.includes("record") || clue.kind.includes("log")
      ? "file"
      : clue.kind.includes("trace")
        ? "search"
        : clue.kind === "Recovered object"
          ? "spark"
          : "notebook";
  return (
    <div className={`evidence-mark mark-${icon}`} aria-hidden="true">
      <span className="mark-ring" />
      <Icon name={icon} size={34} />
      <span className="mark-code">{clue.id.replace("E", "EXHIBIT ")}</span>
    </div>
  );
}
export function EvidenceFile({
  clue,
  caseId = "quiet-hour",
}: {
  clue: Evidence;
  caseId?: CaseId;
}) {
  const { locations } = getCase(caseId);
  return (
    <div className="evidence-file">
      <EvidenceMark clue={clue} />
      <div className="evidence-file-meta">
        <span className="eyebrow">{clue.kind}</span>
        <span>{locations.find((l) => l.id === clue.location)?.name}</span>
      </div>
      <p className="file-summary">{clue.summary}</p>
      <p className="file-detail">{clue.detail}</p>
      <div className="chain-of-custody">
        <Icon name="check" size={15} />
        <span>Recorded in your evidence inventory · {clue.id}</span>
      </div>
    </div>
  );
}
