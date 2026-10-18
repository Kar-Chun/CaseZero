import type {
  Location,
  Evidence,
  Suspect,
  Dialogue,
  Deduction,
  CaseDefinition,
} from "./types";
export const CASE_ID = "quiet-hour";
export const locations: Location[] = [
  {
    id: "L01",
    name: "The Grand Gallery",
    subtitle: "Where the silence began",
    description:
      "Champagne glasses stand abandoned beneath the vaulted ceiling. At the center of the room, a spotlight illuminates an empty display.",
    atmosphere: "The gala has ended. The questions have not.",
    icon: "gallery",
  },
  {
    id: "L02",
    name: "Security Office",
    subtitle: "Every second leaves a trace",
    description:
      "Four monitors cast a cold light over the desk. The museum’s doors are sealed; its systems remember what people would rather forget.",
    atmosphere: "A low hum. A clock that never stops.",
    icon: "security",
  },
  {
    id: "L03",
    name: "Conservation Workshop",
    subtitle: "Behind the perfect surface",
    description:
      "Tissue, pigments and packing crates line the workbenches. Here, history is handled carefully. Tonight, something else was handled too.",
    atmosphere: "The faint scent of varnish and old wood.",
    icon: "workshop",
  },
  {
    id: "L04",
    name: "Museum Archive",
    subtitle: "The past is never quite past",
    description:
      "The public story is written on the gallery walls. The rest is filed here, in minutes, letters and voices preserved on tape.",
    atmosphere: "Dust suspended in a narrow beam of light.",
    icon: "archive",
  },
];
export const evidence: Evidence[] = [
  {
    id: "E01",
    location: "L01",
    point: "Display pedestal",
    title: "Maintenance slip",
    kind: "System record",
    summary: "The case entered maintenance mode at 21:12.",
    detail:
      "The pedestal printer records a scheduled 90-second maintenance session from 21:12:00 to 21:13:30. During this mode the authorized credential opens the lock and suppresses the lift sensor. The lock and glass are undamaged.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E02",
    location: "L01",
    point: "Sensor housing",
    title: "Silent sensor",
    kind: "Physical trace",
    summary: "The alarm was suspended, not broken.",
    detail:
      "The sensor diagnostic confirms credential C3 suppressed the lift alarm during the recorded maintenance window. There are no tool marks or damaged wires. The seal could have been lifted normally with the case open.",
    requires: { evidence: ["E01"] },
    lockHint: "Read the display pedestal record before checking the sensor.",
  },
  {
    id: "E03",
    location: "L01",
    point: "Abandoned champagne table",
    title: "A patron’s offer",
    kind: "Correspondence",
    summary: "A valuable offer, with an uncomfortable condition.",
    detail:
      "Anton Vale offered to buy the seal for his private collection. His handwritten postscript: “If the board refuses, do not expect another year of my funding.” The offer was rejected that afternoon.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E04",
    location: "L01",
    point: "Usher’s station",
    title: "Atrium attendance",
    kind: "Witness record",
    summary: "One claimed alibi is missing from the register.",
    detail:
      "The atrium usher’s continuous entry register records Elise’s demonstration from 21:10 to 21:17. Mara Voss was not in the atrium between 21:10 and 21:16. The usher confirms there was only one entrance, kept in view throughout.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E05",
    location: "L02",
    point: "Access terminal",
    title: "Credential trail",
    kind: "Access log",
    summary: "C3 links the display to the restricted store.",
    detail:
      "21:12:00 — credential C3, exhibit maintenance. 21:14:06 — credential C3, conservation store. C3 is the evening’s curator-only credential. Credentials cannot be copied remotely; a physical card is required. Who held it is recorded separately.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E06",
    location: "L02",
    point: "Power meter",
    title: "Unbroken power",
    kind: "System record",
    summary: "The museum never lost electricity.",
    detail:
      "The independent supply meter shows uninterrupted voltage from 21:00 to 21:20. The 21:11 warning was a low battery in the service panel, unrelated to the exhibit. It drew the security lead away but did not disable the display.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E07",
    location: "L02",
    point: "Video archive",
    title: "Three verified alibis",
    kind: "Video record",
    summary: "Continuous footage accounts for three suspects.",
    detail:
      "All cameras use the access system’s clock. Anton remains in the donor lounge 21:08–21:16. Elise’s hands remain in the live demonstration frame 21:10–21:17. Theo enters the power room at 21:11 and leaves at 21:15; the only door stays on camera. None could reach the display at 21:12. A separate 21:13 corridor frame shows a gloved figure pushing a trolley; the face is obscured.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E08",
    location: "L02",
    point: "Custody envelope",
    title: "Card custody receipt",
    kind: "Signed record",
    summary: "C3 was signed out and never transferred.",
    detail:
      "Mara Voss signed for C3 at 21:05. The card remained attached to her personal badge; the custody record and the security lead’s witnessed checks show no transfer before its return at 21:20. Nobody reported a missing badge.",
    requires: { answers: ["T04"] },
    lockHint: "Ask Theo who held C3 after finding the credential trail.",
  },
  {
    id: "E09",
    location: "L03",
    point: "Dust beside the store",
    title: "A broken-wheel trail",
    kind: "Physical trace",
    summary: "A repeating notch leads from gallery to store.",
    detail:
      "Fresh rubber tracks run from the gallery service door into the conservation store. One wheel leaves a distinctive notch on each revolution. The trail ends beside the packing bench, not the loading exit.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E10",
    location: "L03",
    point: "Workbench photograph",
    title: "The prepared trolley",
    kind: "Photograph",
    summary: "A 20:50 photograph shows the same damaged wheel.",
    detail:
      "Elise’s routine work photograph, timestamped 20:50, shows a padded conservation trolley beside the store. The right wheel has a crack matching the notched trail. It was prepared for tomorrow’s routine packing work; staff could take it from the corridor.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E11",
    location: "L03",
    point: "Unopened envelope",
    title: "Overdue balance",
    kind: "Correspondence",
    summary: "The conservator has a debt to settle.",
    detail:
      "A lender requests repayment from Elise Ren by Friday. The amount is significant to her but far below the seal’s value. This establishes financial pressure; it does not establish that she was at the display.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E12",
    location: "L03",
    point: "Store inventory drawer",
    title: "Crate K17 entry",
    kind: "Inventory record",
    summary: "A crate received an unplanned addition at 21:14.",
    detail:
      "The store ledger records K17 at 21:14, initialled M.V. A strip of blue exhibit tissue is caught in the lid. The seal’s display uses that tissue. K17 is kept inside the locked store until its morning dispatch; the crate is still here.",
    requires: { answers: ["T03"] },
    lockHint:
      "Ask Elise about the trolley after finding its trail and photograph.",
  },
  {
    id: "E13",
    location: "L04",
    point: "Trustee minutes",
    title: "A suppressed history",
    kind: "Board record",
    summary: "The board refused to revisit the seal’s origins.",
    detail:
      "Mara Voss asked trustees to investigate the seal’s removal from Neris in 1968. The board rejected review to avoid scandal during the patron event. A marginal note in Mara’s hand reads: “A label is not consent.”",
    requires: {},
    lockHint: "",
  },
  {
    id: "E14",
    location: "L04",
    point: "Oral-history collection",
    title: "A remembered seal",
    kind: "Recorded testimony",
    summary: "A family connection reaches back to Neris.",
    detail:
      "An authenticated 1994 recording by Iona Voss, Mara’s grandmother, describes the seal’s unique star-shaped fracture and its removal from her community in 1968. Archival photographs match. Mara inherited her grandmother’s request for its return.",
    requires: {},
    lockHint: "",
  },
  {
    id: "E15",
    location: "L04",
    point: "Sealed dispatch copy",
    title: "The morning destination",
    kind: "Dispatch record",
    summary: "K17 was booked for a restitution escrow.",
    detail:
      "Matching K17’s route reveals its dispatch copy: 08:00 collection, recipient Neris Heritage Restitution Escrow, provisional custody pending title review. Curator-authorized instruction, absent from the trustees’ approved schedule. This was an attempted return, not a private sale.",
    requires: { deductions: ["D02"] },
    lockHint:
      "Establish the trolley’s route on the investigation board to identify the dispatch copy.",
  },
  {
    id: "E16",
    location: "L03",
    point: "Crate K17",
    title: "The recovered seal",
    kind: "Recovered object",
    summary: "The artifact was never taken out of the museum.",
    detail:
      "With the route, access, opportunity and destination established, you inspect K17 under witnessed museum authority. Beneath a false packing base lies the Asterion Seal. Its exhibit number and star-shaped fracture match the catalog. You document recovery and place it in secured custody.",
    requires: { deductions: ["D01", "D02", "D03", "D04"] },
    lockHint:
      "Establish all four conclusions on the board before authorizing a search of K17.",
  },
];
export const suspects: Suspect[] = [
  {
    id: "S01",
    name: "Mara Voss",
    role: "The curator",
    initials: "MV",
    quote: "“Some things belong to more than a museum.”",
    background:
      "A meticulous historian who built the museum’s celebrated antiquities collection. Tonight’s exhibition was meant to secure her future.",
    motive:
      "A bitter disagreement with the trustees over the seal’s provenance.",
    alibi: "Claims she watched the atrium demonstration from 21:10 to 21:16.",
  },
  {
    id: "S02",
    name: "Anton Vale",
    role: "The patron",
    initials: "AV",
    quote: "“Everything has a price. Even principles.”",
    background:
      "A collector whose generosity has kept the museum’s doors open. He expects access, influence, and usually an answer of yes.",
    motive: "His offer to acquire the seal was refused earlier today.",
    alibi: "Says he took a private call in the donor lounge.",
  },
  {
    id: "S03",
    name: "Elise Ren",
    role: "The conservator",
    initials: "ER",
    quote: "“My work is to preserve things. Remember that.”",
    background:
      "An exacting restorer trusted with the museum’s most fragile objects. She knows every service passage and packing procedure.",
    motive: "Financial pressure and ready access to conservation equipment.",
    alibi: "Says she led the live demonstration in the atrium.",
  },
  {
    id: "S04",
    name: "Theo Shaw",
    role: "The security lead",
    initials: "TS",
    quote: "“A system only tells you what you ask it.”",
    background:
      "A former investigator now responsible for keeping history safe. A recent reprimand has left him defensive about tonight’s alarm.",
    motive: "A security failure could cost him his position.",
    alibi: "Says a service warning sent him to the power room.",
  },
];
export const dialogue: Dialogue[] = [
  {
    id: "T01",
    suspect: "S01",
    question: "Where were you when the seal vanished?",
    response:
      "In the atrium, watching Elise work. Ten past nine until sixteen past, perhaps. I returned to the gallery afterward. You can ask the usher.",
    review: {
      evidence: ["E04"],
      finding: "conflict",
      text: "The usher\u2019s attendance record does not support this claimed continuous presence. A conflicting alibi is a lead, not proof of theft.",
    },
    requires: {},
    lockHint: "",
  },
  {
    id: "T02",
    suspect: "S01",
    question: "The usher did not see you in the atrium.",
    response:
      "Then my recollection is less exact than I thought. I was moving between rooms. I will not invent a minute-by-minute account to make you comfortable.",
    requires: { evidence: ["E04"] },
    lockHint: "Find a record of atrium attendance.",
  },
  {
    id: "T03",
    suspect: "S03",
    question: "Where did the damaged trolley go?",
    response:
      "That crack is unmistakable. I left it in the corridor after the photograph. Anyone on staff could take it. Here is the store inventory key—check the drawer. I was on a live camera when it moved.",
    requires: { evidence: ["E09", "E10"] },
    lockHint: "Find the wheel trail and workbench photograph.",
  },
  {
    id: "T04",
    suspect: "S04",
    question: "Who held credential C3 tonight?",
    response:
      "Mara signed for it at five past. I watched her attach it to her badge. It stayed with her; no transfer was requested or witnessed. The signed custody receipt is in the envelope on my desk. Take a look.",
    requires: { evidence: ["E05"] },
    lockHint: "Read the access terminal first.",
  },
  {
    id: "T05",
    suspect: "S02",
    question: "Tell me about your evening.",
    response:
      "The board rejected my offer. I made my displeasure clear, then called my office from the donor lounge. The camera was pointed directly at me. It is rather difficult to steal something from another room.",
    requires: {},
    lockHint: "",
  },
  {
    id: "T06",
    suspect: "S02",
    question: "Was the funding threat serious?",
    response:
      "Entirely. But a threat is not a theft. I wanted a legal purchase, prominently displayed with my name. Hiding it in a crate would do very little for my reputation.",
    requires: { evidence: ["E03"] },
    lockHint: "Find the patron’s written offer.",
  },
  {
    id: "T07",
    suspect: "S03",
    question: "What were you doing at 21:12?",
    response:
      "Demonstrating pigment consolidation in the atrium, live on the event feed. My hands never left the frame. The trolley was already outside the workshop; I had no need of it for the demonstration.",
    requires: {},
    lockHint: "",
  },
  {
    id: "T08",
    suspect: "S03",
    question: "Could the debt have tempted you?",
    response:
      "The letter is real. So is the debt. I earn my living preserving objects, not selling them. Check the footage before you decide that a bill tells you where I was.",
    requires: { evidence: ["E11"] },
    lockHint: "Find the envelope in the workshop.",
  },
  {
    id: "T09",
    suspect: "S04",
    question: "Why did you leave your post?",
    response:
      "A low-battery warning at eleven past. I went to the power room and returned at fifteen past. At first I thought the display might have suffered a power fault. The meter will tell you whether that holds up.",
    requires: {},
    lockHint: "",
  },
  {
    id: "T10",
    suspect: "S04",
    question: "The power never failed.",
    response:
      "Then my first theory was wrong. The warning affected only the service panel. Whoever opened the display used normal maintenance access. Focus on the physical credential, not the power supply.",
    requires: { deductions: ["D01"] },
    lockHint: "Establish the maintenance window on the board.",
  },
  {
    id: "T11",
    suspect: "S01",
    question: "Why did you challenge the trustees?",
    response:
      "Because they knew the Neris history and chose silence. My grandmother spent her life asking for a hearing. I asked for the same thing. The board saw a reputational problem where I saw a responsibility.",
    requires: { evidence: ["E13", "E14"] },
    lockHint: "Read the trustee minutes and oral-history record.",
  },
  {
    id: "T12",
    suspect: "S01",
    question: "The access and alibis leave you unaccounted for.",
    response:
      "You have made your case about opportunity. If you mean to accuse me, account for the object’s route and destination as carefully. I will answer a complete case, not a guess.",
    requires: { deductions: ["D03"] },
    lockHint: "Establish exclusive opportunity on the board.",
  },
];
export const deductions: Deduction[] = [
  {
    id: "D01",
    title: "The silent window",
    prompt:
      "What opened the display while the alarm stayed silent? Connect the maintenance timing, access and power records.",
    evidence: ["E01", "E05", "E06"],
    alternatives: [["E02", "E05", "E06"]],
    conclusion:
      "C3 opened the display during the 21:12 maintenance window. Electricity never failed; the alarm was deliberately suppressed by authorized access.",
  },
  {
    id: "D02",
    title: "The hidden route",
    prompt:
      "Which equipment carried the seal, and where did it end up? Connect the wheel trace, preparation and store record.",
    evidence: ["E09", "E10", "E12"],
    conclusion:
      "The damaged conservation trolley carried the seal from the gallery into the store. Crate K17 received an unplanned addition at 21:14. Its dispatch copy can now be identified in the archive.",
  },
  {
    id: "D03",
    title: "The missing minutes",
    prompt:
      "Who had both the credential and the opportunity? Compare independent timing or attendance with continuous alibis and card custody.",
    evidence: ["E04", "E07", "E08"],
    alternatives: [["E05", "E07", "E08"]],
    conclusion:
      "Mara’s atrium alibi fails; the other three suspects are continuously accounted for at 21:12. C3 remained in Mara’s custody. She alone had the documented opportunity and access.",
  },
  {
    id: "D04",
    title: "A debt to the past",
    prompt:
      "Why this object, and why tonight? Connect the suppressed history, family testimony and intended destination.",
    evidence: ["E13", "E14", "E15"],
    conclusion:
      "The planned destination was a restitution escrow for Neris. The curator’s suppressed provenance challenge and family testimony explain an unauthorized return rather than a sale.",
  },
];
export const methods = [
  { id: "M01", label: "Force the case during a blackout" },
  {
    id: "M02",
    label: "Use maintenance access, then divert the seal in a trolley",
  },
  { id: "M03", label: "Replace the seal during the public demonstration" },
];
export const motives = [
  { id: "R01", label: "Sell it to settle a personal debt" },
  { id: "R02", label: "Secure it for a private collection" },
  { id: "R03", label: "Arrange an unauthorized restitution to Neris" },
];

/** Original exports remain stable for existing content consumers. */
export const quietHour: CaseDefinition = {
  id: "quiet-hour",
  number: "001",
  title: "The Quiet Hour",
  genre: "Museum mystery",
  summary:
    "The Asterion Seal has vanished from a locked display during Halcyon’s most exclusive evening. The doors are sealed. The answers are inside.",
  tagline: "An exclusive evening. An empty display. A room full of secrets.",
  duration: "30–45 min",
  venue: "Halcyon Museum",
  setting: "The Halcyon Museum · 14 November 2025 · 21:25",
  arrival: "21:25",
  statusLine: "EXITS SEALED",
  theme: "museum",
  mapLabel: "Museum map",
  locationHeading: "The museum is yours to examine.",
  enterLabel: "Enter the museum",
  briefing: {
    heading: "History has a way of going missing.",
    paragraphs: [
      "At 21:18, the host of Halcyon’s private patron evening found the Asterion Seal’s display empty. No broken glass. No alarm. No one admitting they saw a thing.",
      "The ninth-century seal is the centerpiece of the museum’s new collection. Its disappearance could destroy the institution’s reputation—and the careers of those gathered here tonight.",
      "The exits were sealed immediately. Four people had reason to want the seal gone. You have unrestricted access to the gallery, security office, conservation workshop and archive.",
    ],
    quote:
      "Find the object. Establish the facts. Let the evidence tell you the rest.",
    attribution: "Museum liaison",
    objectives: [
      "Examine the museum and collect evidence",
      "Interview all four persons of interest",
      "Connect clues into four conclusions",
      "Recover the seal and submit your case",
    ],
  },
  accountEvidence: {
    suspect: ["D03"],
    method: ["D01", "D02"],
    motive: ["D04"],
  },
  resolution: {
    evidenceId: "E16",
    proofLabel: "The seal recovered",
    searchLabel: "Search the conservation store",
    question: "Who took the seal?",
    methodLabel: "How was it taken?",
    motiveLabel: "Why was it taken?",
  },
  locations,
  evidence,
  suspects,
  dialogue,
  deductions,
  methods,
  motives,
  inspections: [],
};
