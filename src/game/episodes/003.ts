import type { CaseDefinition } from "../types";
const events = [
  { id: "V1", label: "Tracer mixed into the reservoir" },
  { id: "V2", label: "High-water alarm sounds" },
  { id: "V3", label: "Clean-water test signed off" },
  { id: "V4", label: "Blue water runs through the bypass" },
];
export const afterTheFlood: CaseDefinition = {
  id: "after-the-flood",
  number: "003",
  title: "After the Flood",
  genre: "Conservatory sabotage",
  theme: "conservatory",
  duration: "30–45 min",
  summary:
    "A conservatory’s research beds are flooded before an independent audit. An accident would explain the water. It would not explain the order in which it arrived.",
  tagline: "A ruined trial. A convenient accident. The order matters.",
  venue: "Larkspur Conservatory",
  setting: "Larkspur Conservatory · 7 May 2026 · 19:20",
  arrival: "19:20",
  statusLine: "BEDS ISOLATED",
  mapLabel: "Conservatory map",
  locationHeading: "Follow the water. Read what survived.",
  enterLabel: "Enter the conservatory",
  briefing: {
    heading: "Some things cannot be washed away.",
    paragraphs: [
      "At 19:08, the high-water alarm sounded across Larkspur Conservatory. Its salt-tolerance trial beds were waterlogged before a patron preview. Nobody was hurt. The damage may have destroyed a year’s research, hours before an independent audit.",
      "The staff point to a clean-water test completed earlier in the evening. A sensor fault would be an easy explanation. But the water left a blue residue, and the automatic feed appears untouched. You have authority to examine the isolated beds, pump house, potting studio and director’s office.",
      "Only four staff had access to the service enclosure approach. Reconstruct what happened before deciding whose opportunity matters. On this case, a collection of records is not enough: on the board, choose the explanation those records support.",
    ],
    quote: "If this was an accident, the records should agree. Start there.",
    attribution: "Conservatory trustee",
    objectives: [
      "Trace the water’s route",
      "Reconstruct the sequence from original records",
      "Explain method, sequence, opportunity and motive",
      "Secure the surviving audit material",
    ],
  },
  accountEvidence: {
    suspect: ["D23"],
    method: ["D21", "D22"],
    motive: ["D24"],
  },
  resolution: {
    evidenceId: "E54",
    proofLabel: "Audit originals secured",
    searchLabel: "Secure the surviving audit set",
    question: "Who staged the accident?",
    methodLabel: "How was the flood caused?",
    motiveLabel: "Why destroy the trial?",
  },
  locations: [
    {
      id: "L21",
      name: "Propagation Hall",
      subtitle: "Water remembers its route",
      description:
        "The beds are isolated. A blue line marks their water level. Beyond the glass, patrons are being quietly sent home.",
      atmosphere: "Dripping leaves. A room waiting for an explanation.",
      icon: "glasshouse",
    },
    {
      id: "L22",
      name: "Pump House",
      subtitle: "Two flows, one evening",
      description:
        "A manual bypass branches downstream of the automatic controller. Witnessed records and a sealed mechanical counter survived the water.",
      atmosphere: "A stopped wheel. The last drops in a clear gauge.",
      icon: "pump",
    },
    {
      id: "L23",
      name: "Potting Studio",
      subtitle: "What careful hands preserve",
      description:
        "A dry workbench holds the camera archive and staff records. An audit cupboard is sealed pending a supported account of the damage.",
      atmosphere: "Damp coats beside dry paper. Somebody kept copies.",
      icon: "potting",
    },
    {
      id: "L24",
      name: "Director’s Office",
      subtitle: "The cost of a result",
      description:
        "A polished report waits beside the next morning’s audit notice. The plants outside tell a less comfortable story.",
      atmosphere: "A desk lamp still burns above a signed promise.",
      icon: "study",
    },
  ],
  evidence: [
    {
      id: "E41",
      location: "L21",
      point: "Alarm recorder",
      title: "The high-water alarm",
      kind: "System record",
      summary: "The alarm sounded at 19:08, after the beds had filled.",
      detail:
        "The synchronized high-water recorder logged 19:08. This detects water already at the bed limit, not the instant a valve opens. Staff isolated the reservoir and beds immediately. There is no evidence of injury or forced entry.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E42",
      location: "L21",
      point: "Blue waterline",
      title: "A color with a source",
      kind: "Physical trace",
      summary:
        "The beds, reservoir and bypass recess carry the same blue tracer.",
      detail:
        "Sealed samples match the harmless blue nutrient tracer in the reservoir. The same residue lies in the manual bypass wheel recess and across the flooded beds. The tracer identifies this water’s source; it did not injure the plants. Waterlogging caused the damage.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E43",
      location: "L21",
      point: "Automatic feed tray",
      title: "The dry automatic feed",
      kind: "Meter record",
      summary:
        "The automatic feed was dry and its independent totalizer stayed at zero.",
      detail:
        "The feed tray is dry. Its sealed independent totalizer records no automatic delivery after the clean-water test. The approved pipe diagram places the manual bypass downstream of the controller. A sensor error cannot turn that mechanical wheel. It must be held locally during flow; there is no latch, remote actuator or timer.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E44",
      location: "L22",
      point: "Test completion sheet",
      title: "A test that ended",
      kind: "Witnessed record",
      summary: "Tomas’s clean-water test was closed and witnessed at 18:46.",
      detail:
        "Tomas began the bypass pressure test at 18:40. At 18:46 he shut the wheel; Noor witnessed closure and the mechanical counter returning to zero. The signed sheet and counter strip agree. A sealed end-of-test sample is clear, with no blue tracer.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E45",
      location: "L22",
      point: "Mixing book",
      title: "The untimed blue batch",
      kind: "Batch record",
      summary:
        "The tracer was added after the witnessed test closure; this copy has no time.",
      detail:
        "Noor and Vera signed the mixing record: they checked the completed test sheet before adding blue tracer to the reservoir. The batch label matches the bed samples. No clock time was entered. Blue water could only leave the reservoir after the tracer had been added; the earlier test sample was clear.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E46",
      location: "L22",
      point: "Mechanical flow strip",
      title: "A fresh turn of the wheel",
      kind: "Flow record",
      summary:
        "A new bypass flow begins at 18:56. The service enclosure had a visitor.",
      detail:
        "The sealed mechanical counter records a new manual flow at 18:56, after a period of zero flow. A retained sample from that flow is blue. The approach register shows a single enclosure visit from 18:54–18:59. The numbered counterfoil and enclosure plan are held with the staff records; ask the trial director about that visit.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E47",
      location: "L22",
      point: "Reconstruction bench",
      title: "The second flow",
      kind: "Sequence analysis",
      summary:
        "The test ended, tracer was added, a new blue flow ran, then the alarm sounded.",
      detail:
        "The 18:46 closure precedes the untimed tracer addition. Blue flow at 18:56 must follow that addition. The 19:08 alarm comes last. This is a fresh operation after completed work, not the original clean-water test continuing. The alarm alone cannot tell you when the act began.",
      requires: { inspections: ["I21"] },
      lockHint:
        "Find the alarm record, test sheet, mixing book and flow strip, then reconstruct their order here.",
    },
    {
      id: "E48",
      location: "L23",
      point: "Camera archive",
      title: "Three continuous accounts",
      kind: "Video record",
      summary:
        "Noor, Tomas and Vera are continuously elsewhere during the new flow.",
      detail:
        "The same synchronized clock covers 18:52–19:02: Noor is continuously visible presenting seedlings in the public hall, Tomas continuously visible at the external monitor, Vera continuously visible at the donor desk. The entrance record admits only these four staff to the enclosure approach. No additional entrant appears. None of those three could hold the local bypass wheel at 18:56.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E49",
      location: "L23",
      point: "Enclosure counterfoil",
      title: "The label errand",
      kind: "Signed record",
      summary:
        "Elin signed into the valve enclosure. The approved plan shows no label storage.",
      detail:
        "Elin’s signed counterfoil covers 18:54–18:59. The single-access enclosure contains only the manual wheel and its gauge, with no other entrance or label cupboard. The continuous approach record shows no second visitor or handover. Her claimed label errand cannot explain the visit; together with the reconstructed flow and other alibis, the record establishes who could operate the wheel.",
      requires: { answers: ["T43"] },
      lockHint:
        "Ask Elin about the enclosure visit after examining the mechanical flow strip.",
    },
    {
      id: "E50",
      location: "L23",
      point: "Duplicate-set register",
      title: "Results before the water",
      kind: "Audit record",
      summary:
        "Authenticated pre-flood photographs show 20% treated survival and 60% untreated.",
      detail:
        "Under the standing audit protocol, Noor photographed and registered the original trial at 18:30 and retained a small duplicate set in the dry cupboard. The signed batch IDs and independent camera timestamps agree: treated survival 20%, untreated 60%. A bench amendment records that Noor retained the duplicate set dry rather than following the director’s earlier preview checklist, which would have moved both sets into the hall. These observations predate the flood and can be checked against the sealed duplicate register, not a later recollection.",
      requires: { answers: ["T44"] },
      lockHint:
        "Ask Noor about preserved trial records after examining the blue waterline.",
    },
    {
      id: "E51",
      location: "L24",
      point: "Donor correspondence",
      title: "A threat without a withdrawal",
      kind: "Correspondence",
      summary:
        "Vera argued about naming rights, but this year’s endowment cannot be revoked.",
      detail:
        "Vera’s sharp letter objects to selling naming rights to a commercial seed company. The executed endowment attached to it is non-revocable for this year. The argument was real, but destroying plants would not release the funds. Motive alone would not place her inside the enclosure.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E52",
      location: "L24",
      point: "Signed trial report",
      title: "The promised result",
      kind: "Signed report",
      summary:
        "Elin reported 95% treated survival. An independent audit was due the next morning.",
      detail:
        "At 18:35 Elin personally signed a 95% treated-survival claim explicitly certifying the final 18:30 evaluation for the same batch IDs. Her earlier preview checklist assigns both the main trial and duplicate set to the hall; the later potting-bench amendment is not in this file. The auditor’s notice confirms that living trial material and original registers would be inspected at 08:00 tomorrow. Flood damage would require rescheduling, according to the attached protocol. The reported figure is incompatible with the authenticated pre-flood observations.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E53",
      location: "L24",
      point: "Advance agreement",
      title: "The price of a false result",
      kind: "Financial terms",
      summary:
        "A substantiated false report would trigger Elin’s personal £18,000 repayment.",
      detail:
        "Elin’s signed advance agreement requires personal repayment of £18,000 and a review of her appointment if deliberate false reporting is substantiated. Genuine equipment or weather loss postpones verification without that finding. Destruction could delay discovery of the existing false result; it could not improve plant survival or protect anyone from dangerous weather.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E54",
      location: "L23",
      point: "Sealed audit cupboard",
      title: "The surviving audit set",
      kind: "Secured material",
      summary:
        "The dry duplicate set and original batch register are secured for independent review.",
      detail:
        "With the cause, sequence, operator and motive established, the trustee authorizes witnessed opening of the audit cupboard. You seal the registered duplicate set, original photographs, batch register and counterfoil. IDs match the signed report and pre-flood record. The false result can now be independently tested despite the destroyed beds; every handler is recorded.",
      requires: { deductions: ["D21", "D22", "D23", "D24"] },
      lockHint:
        "Establish all four conclusions before securing the audit originals.",
    },
  ],
  suspects: [
    {
      id: "S21",
      name: "Dr. Elin March",
      role: "The trial director",
      initials: "EM",
      quote: "“A year’s work. You cannot understand what that means.”",
      background:
        "Elin leads Larkspur’s salt-tolerance research. Her published result underpins a new appointment and a personal advance.",
      motive:
        "An unfavorable independent audit would threaten her position and claimed success.",
      alibi:
        "Says she briefly collected labels from the service enclosure before the alarm.",
    },
    {
      id: "S22",
      name: "Noor Hale",
      role: "The horticulturist",
      initials: "NH",
      quote: "“A living thing is not a number you can revise.”",
      background:
        "Noor tends the trials and argues against commercial control of the plants. Careful batch records are part of the job.",
      motive:
        "Publicly opposed the proposed commercial seed agreement and argued with Elin.",
      alibi:
        "Says the public seedling demonstration kept them in the hall throughout the new flow.",
    },
    {
      id: "S23",
      name: "Tomas Reed",
      role: "The engineer",
      initials: "TR",
      quote:
        "“There is a difference between something stopping and someone stopping it.”",
      background:
        "Tomas maintains the aging pipework. He ran the earlier pressure test and fears the damage will be blamed on his work.",
      motive:
        "His reputation depends on the clean-water test having been completed safely.",
      alibi: "Says he remained at the external pump monitor after the test.",
    },
    {
      id: "S24",
      name: "Vera Quinn",
      role: "The donor representative",
      initials: "VQ",
      quote:
        "“I threatened a difficult meeting. I did not threaten the plants.”",
      background:
        "Vera represents the foundation funding the conservatory. A naming-rights dispute put her at odds with the trial director.",
      motive:
        "Wants to stop the commercial naming agreement and protect the foundation’s reputation.",
      alibi:
        "Says she was at the continuously filmed donor desk during the later flow.",
    },
  ],
  dialogue: [
    {
      id: "T41",
      suspect: "S21",
      question: "What do you think caused the flood?",
      response:
        "The sensor, presumably. Tomas tested the system earlier. I collected labels from the service enclosure and returned before the alarm. There is no reason to turn an equipment fault into a scandal.",
      review: {
        evidence: ["E43", "E46"],
        finding: "conflict",
        text: "The dry automatic feed and fresh manual flow do not support the proposed sensor route. Establish the cause before assigning responsibility.",
      },
      requires: {},
      lockHint: "",
    },
    {
      id: "T42",
      suspect: "S23",
      question: "Did your test remain open?",
      response:
        "No. I shut it at 18:46; Noor witnessed it and the counter stopped. We tested with clear water. Read the completion sheet and the later mixing book before joining two different flows into one accident.",
      requires: {},
      lockHint: "",
    },
    {
      id: "T43",
      suspect: "S21",
      question: "Who visited the enclosure before the new flow?",
      response:
        "I signed in, from 18:54 to 18:59. It was a short errand for labels. The counterfoil and plan are with the staff records in the potting studio. Being near machinery is hardly proof that I touched it.",
      requires: { evidence: ["E46"] },
      lockHint: "Read the mechanical flow strip in the pump house.",
    },
    {
      id: "T44",
      suspect: "S22",
      question: "Did any trial records survive the blue water?",
      response:
        "Yes. The normal audit protocol requires a photographed register and a small dry duplicate set. I recorded them at 18:30, before any of this. The register is on the potting bench; the originals stay sealed until the trustee authorizes collection.",
      requires: { evidence: ["E42"] },
      lockHint: "Examine the blue waterline in the propagation hall.",
    },
    {
      id: "T45",
      suspect: "S22",
      question: "Why did you argue with Elin?",
      response:
        "I oppose selling exclusive rights to the seed line. That is a real disagreement. It is also why I insisted on preserving the audit samples. I was presenting seedlings in public from 18:52; the continuous camera shows it.",
      review: {
        evidence: ["E48"],
        finding: "consistent",
        text: "The continuous recording supports the claimed public presentation during the relevant window. Disagreement alone does not establish opportunity.",
      },
      requires: {},
      lockHint: "",
    },
    {
      id: "T46",
      suspect: "S24",
      question: "Did you threaten to withdraw the endowment?",
      response:
        "I said the foundation would challenge the naming deal. The executed endowment cannot be revoked this year. The letter and terms are in the office. At 18:56 I was at the donor desk, answering the preview guests.",
      requires: {},
      lockHint: "",
    },
    {
      id: "T47",
      suspect: "S23",
      question: "Can a sensor turn this bypass wheel?",
      response:
        "No. The wheel is downstream of the controller and has to be held locally. No latch, timer or remote actuator. The automatic feed has its own independent totalizer. A dry tray and a zero reading matter more than somebody saying ‘sensor’.",
      requires: { evidence: ["E43"] },
      lockHint: "Examine the automatic feed tray.",
    },
    {
      id: "T48",
      suspect: "S24",
      question: "Why is the mixing entry untimed?",
      response:
        "We checked Tomas’s signed completion before dosing the reservoir. I witnessed Noor add the blue batch; neither of us wrote a time. The earlier sample was clear. Whatever minute we missed on paper, blue flow must come after the mixing.",
      requires: { evidence: ["E45"] },
      lockHint: "Read the mixing book in the pump house.",
    },
    {
      id: "T49",
      suspect: "S21",
      question: "The flood was a fresh manual operation.",
      response:
        "You have ruled out one kind of fault. You still need to show who was there during that operation, rather than treating my job title as evidence.",
      requires: { deductions: ["D21"] },
      lockHint: "Establish the water’s route on the board.",
    },
    {
      id: "T50",
      suspect: "S23",
      question: "The completed test came before the blue batch.",
      response:
        "Then the blue flow was a later opening. Follow that window. The alarm was a consequence, not the start of the act.",
      requires: { deductions: ["D22"] },
      lockHint: "Reconstruct and explain the sequence.",
    },
    {
      id: "T51",
      suspect: "S22",
      question: "The signed report conflicts with your register.",
      response:
        "The batch IDs are the same. Do not take my word for the plants: secure the duplicate set and let the independent auditor compare the originals. That is why the protocol exists.",
      requires: { evidence: ["E50", "E52"] },
      lockHint: "Compare the pre-flood register and signed report.",
    },
    {
      id: "T52",
      suspect: "S24",
      question: "The flood could postpone tomorrow’s audit.",
      response:
        "It could. It could not make a false result true. Preserve what survived before anyone calls the remaining material inconclusive.",
      requires: { deductions: ["D24"] },
      lockHint: "Establish the audit motive on the board.",
    },
  ],
  deductions: [
    {
      id: "D21",
      category: "METHOD",
      title: "Which way did the water go?",
      prompt:
        "Compare the colored residue, the automatic feed and the fresh mechanical flow. Which physical route explains all three?",
      evidence: ["E42", "E43", "E46"],
      interpretations: [
        {
          id: "C1",
          challenge:
            "Check the automatic feed\u2019s independent totalizer and whether its pipe is wet.",
          label: "A sensor fault delivered water through the automatic feed.",
        },
        {
          id: "C2",
          label:
            "Someone operated the local manual bypass to deliver the blue water.",
        },
        {
          id: "C3",
          challenge:
            "Account for the tracer color and the fresh flow recorded at the local wheel.",
          label: "Rain entered through the roof and left unrelated residue.",
        },
      ],
      conclusion:
        "The blue reservoir water reached the beds through a fresh local manual-bypass flow. A dry automatic feed and zero independent totalizer exclude the claimed sensor route.",
    },
    {
      id: "D22",
      category: "SEQUENCE",
      title: "An accident that happened twice?",
      prompt:
        "Use the reconstruction and original test/mixing records. Did the first test continue, or did a second operation begin?",
      evidence: ["E44", "E45", "E47"],
      interpretations: [
        {
          id: "C1",
          challenge:
            "Compare the stopped test counter with when tracer was added.",
          label:
            "The clean-water test continued without interruption until the alarm.",
        },
        {
          id: "C2",
          challenge:
            "The alarm reports detected damage; compare it with the mechanical flow time.",
          label: "The 19:08 alarm proves the wheel was first opened at 19:08.",
        },
        {
          id: "C3",
          label:
            "A second opening followed the completed test and tracer addition.",
        },
      ],
      conclusion:
        "The test closed at 18:46, tracer was then added, and new blue flow ran at 18:56 before the 19:08 alarm. The damaging flow was a separate operation, not unfinished testing.",
    },
    {
      id: "D23",
      requires: { deductions: ["D22"] },
      category: "OPPORTUNITY",
      title: "Who could hold the wheel?",
      prompt:
        "Apply the reconstructed window to the continuous alibis, enclosure counterfoil and plan. Account for access, not just suspicion.",
      evidence: ["E48", "E49"],
      interpretations: [
        {
          id: "C1",
          label:
            "The sole enclosure visitor had the opportunity; the other three were continuously elsewhere.",
        },
        {
          id: "C2",
          challenge:
            "Technical skill is an assumption. Compare actual presence in the enclosure during the reconstructed window.",
          label:
            "Only an engineer could turn a manual wheel, regardless of the recordings.",
        },
        {
          id: "C3",
          challenge:
            "A disagreement can suggest motive; it cannot place someone at the wheel.",
          label:
            "The naming-rights argument establishes who operated the wheel.",
        },
      ],
      conclusion:
        "Elin was the sole enclosure visitor from 18:54–18:59. Noor, Tomas and Vera were continuously elsewhere at 18:56. The enclosure contains only the wheel and gauge, and the flow required local operation. Her label errand does not account for those facts.",
    },
    {
      id: "D24",
      category: "MOTIVE",
      title: "What would the water erase?",
      prompt:
        "Compare the pre-flood results, signed report and advance conditions. What could destroying the living trial postpone?",
      evidence: ["E50", "E52", "E53"],
      interpretations: [
        {
          id: "C1",
          challenge:
            "Compare the signed survival claim with the authenticated pre-flood results.",
          label: "The flood protected the trial from dangerous weather.",
        },
        {
          id: "C2",
          label:
            "Destroying contradictory material could delay exposure of a false report and personal repayment.",
        },
        {
          id: "C3",
          challenge:
            "Read the executed endowment terms separately from the personal advance conditions.",
          label:
            "Flood damage released the foundation from this year’s endowment.",
        },
      ],
      conclusion:
        "Authenticated 20% treated survival contradicts Elin’s signed 95% claim. Tomorrow’s audit would expose that false result and risk £18,000 personal repayment. A claimed equipment loss would postpone verification.",
    },
  ],
  methods: [
    {
      id: "M21",
      label: "Trigger the automatic controller with a faulty sensor",
    },
    {
      id: "M22",
      label: "Operate the local manual bypass after the completed test",
    },
    {
      id: "M23",
      label: "Leave the original clean-water test running continuously",
    },
  ],
  motives: [
    { id: "R21", label: "Protect the plants from dangerous weather" },
    { id: "R22", label: "Cancel the foundation’s irrevocable endowment" },
    {
      id: "R23",
      label: "Destroy contradictory trial evidence before the audit",
    },
  ],
  inspections: [
    {
      id: "I21",
      kind: "sequence",
      title: "Reconstruct the two flows",
      instruction:
        "Place all four events in order, earliest first. The mixing entry is untimed: use what must happen before blue water can flow. Each event belongs in exactly one position.",
      requires: { evidence: ["E41", "E44", "E45", "E46"] },
      evidenceId: "E47",
      panels: [
        {
          title: "Mixing book",
          text: "No time entered. Noor and Vera checked the completed test sheet, then added blue tracer to the reservoir. The earlier test sample was clear.",
          label: "Position 1",
          options: events,
        },
        {
          title: "Alarm recorder",
          text: "19:08: high-water alarm. It detects beds already full; it does not record a valve opening.",
          label: "Position 2",
          options: events,
        },
        {
          title: "Witnessed completion",
          text: "18:46: test wheel shut; independent counter returns to zero. Sealed water sample is clear.",
          label: "Position 3",
          options: events,
        },
        {
          title: "Mechanical counter",
          text: "18:56: a fresh manual-bypass flow. Its retained sample contains blue tracer.",
          label: "Position 4",
          options: events,
        },
      ],
      hints: [
        "A missing timestamp does not make an event unplaceable. Look for physical constraints in the samples.",
        "The test sample was clear. Mixing followed the signed closure; the later blue flow must follow mixing. The alarm comes after filling.",
        "Order the test closure, tracer mixing, new blue flow, then the high-water alarm. The second opening happened after the completed work.",
      ],
      failure:
        "That order conflicts with the original records. Use each event once: blue water requires earlier mixing, and the signed test closure came before that mixing.",
      success:
        "The sequence establishes a second operation after the clean-water test. Your reconstruction is recorded.",
    },
  ],
};
