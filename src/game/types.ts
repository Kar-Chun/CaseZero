export type Requirement = {
  evidence?: string[];
  deductions?: string[];
  answers?: string[];
  inspections?: string[];
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
  category?: string;
  requires?: Requirement;
};
export type Accusation = { suspect: string; method: string; motive: string };
export type GameState = {
  version: 2;
  caseId: CaseId;
  started: boolean;
  evidence: string[];
  deductions: string[];
  answers: string[];
  notes: string;
  accusation: Accusation | null;
  inspections: string[];
  hints: Record<string, number>;
  pinned: string[];
};

export type CaseId = "quiet-hour" | "dead-air";
export type Inspection = {
  id: string;
  kind: "clock" | "comparison";
  title: string;
  instruction: string;
  requires: Requirement;
  evidenceId: string;
  panels: {
    title: string;
    text: string;
    label: string;
    options: { id: string; label: string }[];
  }[];
  hints: [string, string, string];
  success: string;
  failure: string;
};
export type CaseDefinition = {
  id: CaseId;
  number: string;
  title: string;
  genre: string;
  summary: string;
  tagline: string;
  duration: string;
  venue: string;
  setting: string;
  arrival: string;
  statusLine: string;
  theme: "museum" | "radio";
  mapLabel: string;
  locationHeading: string;
  enterLabel: string;
  briefing: {
    heading: string;
    paragraphs: string[];
    quote: string;
    attribution: string;
    objectives: string[];
  };
  resolution: {
    evidenceId: string;
    proofLabel: string;
    searchLabel: string;
    question: string;
    methodLabel: string;
    motiveLabel: string;
  };
  locations: Location[];
  evidence: Evidence[];
  suspects: Suspect[];
  dialogue: Dialogue[];
  deductions: Deduction[];
  methods: { id: string; label: string }[];
  motives: { id: string; label: string }[];
  inspections: Inspection[];
};
