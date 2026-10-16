import type { CaseId } from "./types";
/** Deterministic activity answers; never rendered as labels or debug output. Client source is inspectable. */
export const inspectionAnswers: Partial<
  Record<CaseId, Record<string, string>>
> = {
  "dead-air": { I11: "22:06", I12: "A1:B2" },
};
