import type { Accusation } from "../types";
import type { CaseOutcome } from "../outcome";
export function evaluateRadio(value: Accusation): CaseOutcome {
  const correct =
    value.suspect === "S13" && value.method === "M12" && value.motive === "R12";
  if (!correct)
    return {
      correct: false,
      title: "Not yet proven.",
      subtitle: "The right question has to survive the records.",
      paragraphs: [
        "The harbor investigator compares your account with the corrected queue time, selected input, custody register and signed rider. Your proposed person, method and motive do not hold together. The account is not accepted.",
        "The original recording remains safe. Nobody is charged on a theory that conflicts with the evidence. The time of broadcast and the time of preparation are different events; a genuine alibi may answer only one of them.",
      ],
      epilogue:
        "Every record and conclusion stays in your case file. Return to the investigation and test your account again.",
    };
  return {
    correct: true,
    title: "Case closed.",
    subtitle: "The lie was recorded. So was the truth.",
    paragraphs: [
      "Celia Ward’s telephone alibi is genuine. It is also irrelevant to the eight minutes before the warning aired. Confronted with the corrected 22:06 insertion, U4’s internal serial and her signed receipt, she admits preparing the cartridge and placing it in the reserve queue.",
      "She counted on the station’s familiar bulletin voice to halt the public trial. The cancellation—not bad weather—would release Cedarline’s £80,000 credit and strengthen its berth claim. Iris’s funding pressure, Owen’s reprimand and Kit’s public criticism supplied plausible distractions, but none put them at the terminal when the recording was planted.",
      "The investigator retains your forensic capture and the sealed original. The standby credit is frozen for review, the false broadcast is formally corrected, and the public trial is rebooked. A careful clock comparison has changed whose account the town believes.",
    ],
    epilogue:
      "You separated the moment a lie was heard from the moment it was made. Breakwater can finally listen again.",
  };
}
