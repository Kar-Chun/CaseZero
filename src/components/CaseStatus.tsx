import { evaluate } from "@/game/outcome";
import type { CaseId, Accusation } from "@/game/types";
/** Only mounted for a previously submitted account; ending data stays out of early case labels. */
export default function CaseStatus({
  caseId,
  accusation,
}: {
  caseId: CaseId;
  accusation: Accusation;
}) {
  return (
    <>
      {evaluate(accusation, caseId).correct ? "CASE CLOSED" : "REVIEW REQUIRED"}
    </>
  );
}
