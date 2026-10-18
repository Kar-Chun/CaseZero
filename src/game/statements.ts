import { getCase } from "./cases";
import type { GameState } from "./types";
/** Claims remain unverified until both the statement and its records are known. */
export function statementReview(state: GameState, topicId: string) {
  const topic = getCase(state.caseId).dialogue.find((t) => t.id === topicId);
  return state.answers.includes(topicId) &&
    topic?.review?.evidence.every((id) => state.evidence.includes(id))
    ? topic.review
    : null;
}
