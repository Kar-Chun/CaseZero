import type { Accusation } from "./types";
export type CaseOutcome = {
  correct: boolean;
  title: string;
  subtitle: string;
  paragraphs: string[];
  epilogue: string;
};
/** Loaded with the ending UI. This authored solution is inspectable in client source. */
export function evaluate(value: Accusation): CaseOutcome {
  const correct =
    value.suspect === "S01" && value.method === "M02" && value.motive === "R03";
  if (!correct)
    return {
      correct: false,
      title: "Not yet proven.",
      subtitle: "A suspicion is not a complete case.",
      paragraphs: [
        "The museum liaison reviews your account against the records. The proposed suspect, method and motive do not form a chain consistent with the evidence. Your accusation is not accepted.",
        "The recovered seal remains safe. Nobody is charged on an unsupported theory. Revisit the continuous alibis, the maintenance credential, the trolley’s route and the dispatch destination.",
      ],
      epilogue:
        "Your evidence and interview records remain intact. Return to the investigation and revise your account.",
    };
  return {
    correct: true,
    title: "Case closed.",
    subtitle: "The quiet hour finally has a voice.",
    paragraphs: [
      "Faced with the maintenance log, her card receipt and the route to K17, Mara Voss stops disputing the minutes. She opened the display at 21:12, carried the seal into the store on the conservation trolley, and hid it beneath the crate’s packing base.",
      "“I asked them to hear my grandmother,” she says. “They heard only the cost.” Her plan was an unauthorized transfer to the Neris restitution escrow at eight the next morning. The patron’s offer and the conservator’s debt were real pressures, but neither accounted for the theft.",
      "You document Mara’s admission and the seal’s secured recovery. The museum suspends the dispatch and refers the provenance records for an independent review. Responsibility for the theft and ownership of the artifact will be considered separately.",
    ],
    epilogue:
      "You found the object, reconstructed the act, and gave a buried history a hearing. Not every truth is simple. This one is no longer hidden.",
  };
}
