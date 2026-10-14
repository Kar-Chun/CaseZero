export type Requirement = {
  evidence?: string[];
  deductions?: string[];
  answers?: string[];
};
export type Location = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  atmosphere: string;
  icon: string;
};
export type Evidence = {
  id: string;
  location: string;
  point: string;
  title: string;
  kind: string;
  summary: string;
  detail: string;
  requires: Requirement;
  lockHint: string;
};
export type Suspect = {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  background: string;
  motive: string;
  alibi: string;
};
export type Dialogue = {
  id: string;
  suspect: string;
  question: string;
  response: string;
  requires: Requirement;
  lockHint: string;
};
export type Deduction = {
  id: string;
  title: string;
  prompt: string;
  evidence: string[];
  conclusion: string;
};
export type Accusation = { suspect: string; method: string; motive: string };
export type GameState = {
  version: 1;
  caseId: "quiet-hour";
  started: boolean;
  evidence: string[];
  deductions: string[];
  answers: string[];
  notes: string;
  accusation: Accusation | null;
};
