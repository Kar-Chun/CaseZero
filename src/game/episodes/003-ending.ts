import type { Accusation } from "../types";
import type { CaseOutcome } from "../outcome";
export function evaluateConservatory(value: Accusation): CaseOutcome {
  const correct =
    value.suspect === "S21" && value.method === "M22" && value.motive === "R23";
  if (!correct)
    return {
      correct: false,
      title: "Not yet proven.",
      subtitle: "An accident is not disproved by suspicion alone.",
      paragraphs: [
        "The trustee checks your account against the pipe diagram, reconstructed sequence, enclosure visit and audit records. The proposed person, method and motive do not form a supported explanation. Your account is not accepted.",
        "The surviving audit set remains secure. Nobody is charged on an unsupported account. Separate the earlier clear-water test from the later blue flow, then apply the new window to access and the cost of the false report.",
      ],
      epilogue:
        "Every record, interview and conclusion remains in your file. Return to the investigation and revise your account.",
    };
  return {
    correct: true,
    title: "Case closed.",
    subtitle: "The water could not erase the order of events.",
    paragraphs: [
      "Elin March cannot reconcile her label errand with an enclosure containing only the manual wheel, the fresh blue flow and three continuous alibis. Confronted with the authenticated pre-flood record and her signed 95% claim, she admits staging an equipment accident to postpone the morning’s audit. She had relied on her earlier checklist: both sets were supposed to be in the hall. Noor’s dry-set amendment had preserved the material she thought the water would destroy.",
      "Tomas’s clean-water test really had ended. Noor’s argument and Vera’s naming-rights threat were real disagreements, but neither explained local operation at 18:56. The untimed mixing entry was enough: blue water had to follow blue tracer, and the tracer followed the witnessed closure.",
      "You place the surviving duplicate set and original records in independent custody. The advance is frozen for review and the audit proceeds on preserved material. Elin’s false result will not become the conservatory’s scientific record. The damaged beds will be replanted under new supervision.",
    ],
    epilogue:
      "You proved a second act behind a convenient accident. What survived can finally be allowed to speak.",
  };
}
