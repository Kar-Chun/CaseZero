import type { CaseId } from "./types";
/** Rules are separate from option labels. As with all client logic, source is inspectable. */
export const deductionAnswers: Partial<Record<CaseId, Record<string, string>>> =
  {
    "after-the-flood": { D21: "C2", D22: "C3", D23: "C1", D24: "C2" },
  };
