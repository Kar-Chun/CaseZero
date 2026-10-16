import type { CaseDefinition } from "../types";
export const deadAir: CaseDefinition = {
  id: "dead-air",
  number: "002",
  title: "Dead Air",
  genre: "Coastal radio mystery",
  summary:
    "A false harbor-closure bulletin interrupts a live fundraiser. Every suspect can account for the moment it aired. Perhaps that is the wrong moment to investigate.",
  tagline: "A false warning. A perfect alibi. Eight missing minutes.",
  duration: "25–40 min",
  venue: "Breakwater Radio",
  setting: "Breakwater Radio · 18 February 2026 · 22:26",
  arrival: "22:26",
  statusLine: "TRANSMISSION HELD",
  theme: "radio",
  mapLabel: "Station map",
  locationHeading: "Listen to what the station remembers.",
  enterLabel: "Enter the station",
  briefing: {
    heading: "A voice on the water. A lie on the air.",
    paragraphs: [
      "At 22:14, Breakwater Radio interrupted its fundraising broadcast with an urgent harbor-closure warning. The public ferry paused its 22:20 trial departure under its safety rules. By the time the harbor master confirmed the channel was open, the sailing had been canceled.",
      "Nobody was hurt. But the failed trial may decide who controls Breakwater’s next ferry contract. The warning used the station’s familiar bulletin voice. The genuine weather desk says it never issued it.",
      "The station stopped transmission and retained the equipment and original media. Only four people could enter its work area tonight. Every one of them claims an alibi for 22:14. Your access covers the control room, equipment room, donor lounge and newsroom. Start with the records; do not assume the moment of broadcast was the moment of the crime.",
    ],
    quote:
      "Find out when the lie entered the system. Then tell me who put it there.",
    attribution: "Harbor investigator",
    objectives: [
      "Trace the warning through the station",
      "Test the clock and compare original documents",
      "Establish method, window, identity and motive",
      "Secure the original recording and submit your account",
    ],
  },
  resolution: {
    evidenceId: "E34",
    proofLabel: "Original recording secured",
    searchLabel: "Secure the original cartridge",
    question: "Who planted the bulletin?",
    methodLabel: "How was it done?",
    motiveLabel: "Why was it done?",
  },
  locations: [
    {
      id: "L11",
      name: "Control Room",
      subtitle: "A voice without a speaker",
      description:
        "The red transmission lamp is dark. A queue terminal, a wall clock and a printed script disagree about what this room was supposed to say.",
      atmosphere: "The microphones are silent. The paper keeps talking.",
      icon: "studio",
    },
    {
      id: "L12",
      name: "Equipment Room",
      subtitle: "The route behind the voice",
      description:
        "Patch cables cross the rack like a second nervous system. Original cartridges have been isolated where they were found; nothing moves without witnessed authority.",
      atmosphere: "Warm circuitry. A reel slowing to a stop.",
      icon: "rack",
    },
    {
      id: "L13",
      name: "Donor Lounge",
      subtitle: "Good intentions, on paper",
      description:
        "Pledge cards sit beside a telephone and a folder of ferry-trial terms. Civic pride makes an excellent backdrop for a private interest.",
      atmosphere: "Cold tea beside a telephone that has stopped ringing.",
      icon: "lounge",
    },
    {
      id: "L14",
      name: "Newsroom",
      subtitle: "Read past the headline",
      description:
        "A reporter has laid out weather records and contract copies. Statements are easy to repeat. Conditions are harder to read.",
      atmosphere: "Rain on the window. Pencil marks in the margins.",
      icon: "newsroom",
    },
  ],
  evidence: [
    {
      id: "E21",
      location: "L11",
      point: "Queue printer",
      title: "The queue print",
      kind: "System record",
      summary:
        "Cartridge U4 entered the reserve queue at 22:13—on this terminal.",
      detail:
        "The paper roll logs “22:13 LOCAL — U4 — reserve queue accepted; scheduled playout 22:14 NETWORK.” The insertion time comes from the terminal’s own clock; the playout time comes from the independent broadcast clock. These are explicitly different time sources.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E22",
      location: "L11",
      point: "Calibration card",
      title: "Two clocks, one pulse",
      kind: "Calibration record",
      summary: "A network time pulse reveals a seven-minute discrepancy.",
      detail:
        "At the 22:00 network time pulse, the queue terminal printed 22:07 LOCAL. A battery replacement left that terminal seven minutes fast; it has not been adjusted since. The on-air wall clock and synchronized camera recordings use network time and remain correct.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E23",
      location: "L11",
      point: "Clock comparison desk",
      title: "The corrected insertion",
      kind: "Time analysis",
      summary:
        "The cartridge was queued at 22:06, eight minutes before it aired.",
      detail:
        "Subtracting the terminal’s seven-minute advance from its 22:13 insertion print gives 22:06 network time. The scheduled 22:14 playout remains unchanged. A person elsewhere at 22:14 could still have loaded the recording eight minutes earlier.",
      requires: { inspections: ["I11"] },
      lockHint:
        "Find the queue print and calibration card, then correct the insertion time here.",
    },
    {
      id: "E24",
      location: "L11",
      point: "Broadcast transcript",
      title: "The false warning",
      kind: "Transcript",
      summary:
        "A recorded voice announced a closure that had never been ordered.",
      detail:
        "The warning says “Breakwater channel closed: suspend the 22:20 public trial departure.” An acoustic repeat in the recording identifies an old station bulletin voice, not one of tonight’s live speakers. The harbor master confirms no closure order existed. Ferry safety rules required a pause until the warning was checked.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E25",
      location: "L12",
      point: "Reserve input rack",
      title: "The selected input",
      kind: "Routing record",
      summary:
        "The reserve cartridge played; the microphone and external line did not.",
      detail:
        "The sealed relay trace shows cartridge U4 on the RESERVE input at 22:14. The live microphone and external telephone line were not selected. A cartridge must be inserted physically at the queue terminal beforehand; remote loading and live-line substitution are not possible on this system.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E26",
      location: "L12",
      point: "Isolated cartridge tray",
      title: "The U4 splice",
      kind: "Physical trace",
      summary: "A broken sponsor seal surrounds a replaced recording.",
      detail:
        "The cartridge in the isolated tray bears serial U4 on both its internal hub and outer shell. Its tamper seal has been cut and rejoined; a fresh splice introduces the false bulletin before the remaining sponsor ident. U1–U3 are still sealed in the locked cabinet. The first response team photographed the tray before anyone handled it.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E27",
      location: "L12",
      point: "Cartridge custody folder",
      title: "A sponsor’s cartridge",
      kind: "Signed record",
      summary: "U4 was handed to Celia before the broadcast.",
      detail:
        "At 22:01 Iris issued sealed U4 to Celia Ward for a sponsor ident. Iris signed and Celia countersigned the numbered receipt. The work area admitted only Iris, Owen, Celia and Kit tonight; the visitor log and continuous entrance recording show no additional entrant. The other three original cartridges stayed locked away.",
      requires: { answers: ["T23"] },
      lockHint:
        "Ask Iris about cartridge custody after identifying the reserve input.",
    },
    {
      id: "E28",
      location: "L12",
      point: "Synchronized recorder",
      title: "The earlier alibis",
      kind: "Video record",
      summary:
        "Three people are continuously accounted for during the insertion window.",
      detail:
        "Network-time recordings show Iris reading pledges in the public studio from 22:04–22:08. Owen remains on the mast stair camera from 22:03–22:09. Kit answers continuous two-way questions live in the booth from 22:02–22:09; a separate receiver records the same exchange. Each remains continuously visible or engaged in the recorded exchange throughout those intervals. The recordings do not account for Celia before 22:10.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E29",
      location: "L13",
      point: "Telephone receipt",
      title: "A genuine, late alibi",
      kind: "Call record",
      summary: "Celia’s external call began at 22:10.",
      detail:
        "The external carrier receipt confirms Celia’s lounge call from 22:10–22:18 network time. The caller at the other end independently confirms her uninterrupted presence. It is a strong alibi for a live act at 22:14. It establishes nothing about where she was before 22:10.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E30",
      location: "L13",
      point: "Trial contract folder",
      title: "The canceled trial",
      kind: "Public terms",
      summary: "The failed 22:20 departure changes the berth award.",
      detail:
        "A successful public ferry trial would preserve the council’s berth option. If that departure is canceled, rival Cedarline Ferries receives first consideration of the berth lease. Celia Ward directs Cedarline. A separate standby-credit rider determines whether the cancellation also releases money.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E31",
      location: "L13",
      point: "Repair notice",
      title: "An engineer’s warning",
      kind: "Correspondence",
      summary: "Owen was reprimanded for an earlier equipment fault.",
      detail:
        "Last month’s notice reprimands Owen Pike for a faulty live-line relay. He has reason to fear another incident. The dated notice concerns the live line, not the reserve cartridge, and it does not place him at the queue terminal tonight.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E32",
      location: "L14",
      point: "Weather desk copy",
      title: "The channel-open original",
      kind: "Weather record",
      summary: "The authorized bulletin contradicts the broadcast.",
      detail:
        "Iris’s 21:55 signed bulletin and the independent harbor weather desk agree: channel open, conditions within the trial’s limits. Harbor staff issued no closure between that recording and the canceled departure. A closure script was deliberately substituted, not read in error from the current weather report.",
      requires: {},
      lockHint: "",
    },
    {
      id: "E33",
      location: "L14",
      point: "Contract comparison table",
      title: "The rider’s real trigger",
      kind: "Document comparison",
      summary:
        "Celia’s assurance hides a payment that does not depend on the weather.",
      detail:
        "Celia’s written assurance says payment needs an independent harbor-master closure. The signed rider says £80,000 is payable to Cedarline for any canceled 22:20 public trial, whatever its cause. Paired with the berth terms, this supplies a direct financial benefit from a fabricated warning. Both originals are authenticated copies retained by the reporter.",
      requires: { inspections: ["I12"] },
      lockHint:
        "Ask Kit for the contract rider after reading the public trial terms, then compare the originals here.",
    },
    {
      id: "E34",
      location: "L14",
      point: "Original media custody station",
      title: "The preserved original",
      kind: "Secured recording",
      summary: "The original cartridge and its splice are secured as evidence.",
      detail:
        "With method, timing, identity and benefit established, the harbor investigator authorizes a witnessed transfer of the photographed tray from the equipment room to the newsroom custody station, followed by a forensic capture of U4. The cartridge’s internal serial matches the tray photographs and custody receipt; its spliced warning matches the transmitted recording. You seal the original medium, retain an unaltered capture and record every handler. The case no longer rests on a transcript alone.",
      requires: { deductions: ["D11", "D12", "D13", "D14"] },
      lockHint:
        "Establish all four conclusions before securing the original recording for the final case.",
    },
  ],
  suspects: [
    {
      id: "S11",
      name: "Iris Bell",
      role: "The producer",
      initials: "IB",
      quote:
        "“I checked the words. I should have checked the silence before them.”",
      background:
        "Breakwater’s producer built tonight’s fundraiser to keep the station alive. She recorded the legitimate bulletin and controls cartridge issue.",
      motive:
        "The station’s funding depends on the sponsors and a successful evening.",
      alibi:
        "Says she was reading donor pledges in the public studio before returning to the console.",
    },
    {
      id: "S12",
      name: "Owen Pike",
      role: "The engineer",
      initials: "OP",
      quote: "“A machine can be wrong without lying.”",
      background:
        "A practical broadcast engineer who knows the aging station by its faults. A recent reprimand makes him wary of another technical scandal.",
      motive: "Another equipment failure could cost him his job.",
      alibi:
        "Says he repaired the mast connection on the camera-covered stair.",
    },
    {
      id: "S13",
      name: "Celia Ward",
      role: "The sponsor",
      initials: "CW",
      quote: "“I was on the telephone. Your records will prove it.”",
      background:
        "Director of Cedarline Ferries, a polished local employer and tonight’s largest donor. Her public language is all about service to the town.",
      motive:
        "Her rival ferry company has an interest in the outcome of the public trial.",
      alibi: "Claims an uninterrupted lounge call from 22:10 to 22:18.",
    },
    {
      id: "S14",
      name: "Kit Mercer",
      role: "The reporter",
      initials: "KM",
      quote: "“Read the conditions. That is where people put the truth.”",
      background:
        "A harbor reporter who has publicly criticized the trial contract. Kit keeps copies of documents that other people consider settled.",
      motive:
        "Opposes the trial’s financial terms and wants the arrangement investigated.",
      alibi:
        "Says a live, recorded interview kept them in the booth until 22:09.",
    },
  ],
  dialogue: [
    {
      id: "T21",
      suspect: "S11",
      question: "What was supposed to air at 22:14?",
      response:
        "The channel-open bulletin I signed at 21:55. I read pledges from four past until eight past, then returned to the console. The fundraiser recording will cover that. I did not speak the closure warning.",
      requires: {},
      lockHint: "",
    },
    {
      id: "T22",
      suspect: "S12",
      question: "Could the live line have carried the warning?",
      response:
        "That was my first fear. I was on the mast stair from three past until nine past fixing its connection. Read the routing trace rather than assuming an old fault happened twice.",
      requires: {},
      lockHint: "",
    },
    {
      id: "T23",
      suspect: "S11",
      question: "Who had access to the reserve cartridge?",
      response:
        "U4 was Celia’s sponsor ident. I handed it to her sealed at one past. Only four of us could enter the work area. The numbered custody receipt is in the equipment-room folder; take it and compare the internal serial, not just a paper label.",
      requires: { evidence: ["E25"] },
      lockHint: "Trace the selected input in the equipment room first.",
    },
    {
      id: "T24",
      suspect: "S14",
      question: "May I compare the standby rider with the assurance?",
      response:
        "Now you have the trial terms, yes. Celia sent this written assurance to the council; this is the authenticated signed rider. They are on the newsroom comparison table. Find a specific contradiction, not merely a clause that sounds unpleasant.",
      requires: { evidence: ["E30"] },
      lockHint: "Read the trial contract folder in the donor lounge.",
    },
    {
      id: "T25",
      suspect: "S12",
      question: "Why does the queue clock disagree with network time?",
      response:
        "A replacement battery reset its clock incorrectly. The calibration card preserves the error. The terminal was fast; subtract that advance from its insertion print. Do not adjust the network-timed broadcast itself.",
      requires: { evidence: ["E22"] },
      lockHint: "Find the calibration card in the control room.",
    },
    {
      id: "T26",
      suspect: "S13",
      question: "Where were you when the warning aired?",
      response:
        "On a call to our office from ten past until eighteen past. The carrier can confirm it. I donated money, not my time to a criminal broadcast. I was not at a microphone at fourteen past.",
      requires: {},
      lockHint: "",
    },
    {
      id: "T27",
      suspect: "S13",
      question: "The queue was loaded before your call.",
      response:
        "Then you have widened your window. That is not the same as proving who touched the terminal. A correct clock calculation cannot stand in for custody evidence.",
      requires: { evidence: ["E23", "E29"] },
      lockHint: "Correct the queue timestamp and verify the telephone receipt.",
    },
    {
      id: "T28",
      suspect: "S14",
      question: "Why did you criticize the ferry trial?",
      response:
        "Because a public service should not be judged by a contract nobody has read. I said that live in the booth between two past and nine past. The two-way interview and receiver recording will tell you exactly where I was.",
      requires: {},
      lockHint: "",
    },
    {
      id: "T29",
      suspect: "S11",
      question: "The warning came from the reserve queue.",
      response:
        "Then my live console never selected it. Someone prepared a recording and let the schedule do the rest. An alibi for the instant it played is not enough. Preserve the original medium once your account is complete.",
      requires: { deductions: ["D11"] },
      lockHint: "Establish the transmission method on the board.",
    },
    {
      id: "T30",
      suspect: "S12",
      question: "Your reprimand mentions a relay failure.",
      response:
        "A real mistake, last month. The live-line relay failed; I repaired it. Tonight’s reserve input is a separate path. Check the routing and the mast recording before making my personnel file your explanation.",
      requires: { evidence: ["E31"] },
      lockHint: "Read the repair notice in the donor lounge.",
    },
    {
      id: "T31",
      suspect: "S13",
      question: "Would a canceled trial benefit Cedarline?",
      response:
        "First consideration is not a guaranteed lease. As for the standby credit, our assurance says it would take an independent harbor-master closure. I suggest you read it carefully before calling a donation a motive.",
      requires: { evidence: ["E30"] },
      lockHint: "Read the public trial and berth terms.",
    },
    {
      id: "T32",
      suspect: "S14",
      question: "Why keep the original rider?",
      response:
        "Because the assurance was easier to circulate than the conditions. Keep both. A finding about the broadcast should survive independent review, not just tonight’s argument in this newsroom.",
      requires: { deductions: ["D14"] },
      lockHint: "Establish the cancellation benefit on the board.",
    },
  ],
  deductions: [
    {
      id: "D11",
      category: "METHOD",
      title: "A voice on a timer",
      prompt:
        "Was the warning spoken live or played from a prepared source? Compare the transmitted voice with the selected input.",
      evidence: ["E24", "E25"],
      conclusion:
        "The false warning was a prepared recording on the reserve cartridge. Neither a live microphone nor an external call carried it.",
    },
    {
      id: "D12",
      category: "WINDOW",
      title: "Before the telephone rang",
      prompt:
        "Does the sponsor’s call account for the moment the recording was planted? Compare the corrected insertion with the independent call record.",
      evidence: ["E23", "E29"],
      conclusion:
        "U4 was inserted at 22:06, before Celia’s genuine 22:10–22:18 call. Her alibi for the 22:14 broadcast does not cover the earlier act.",
    },
    {
      id: "D13",
      requires: { deductions: ["D12"] },
      category: "IDENTITY",
      title: "Who held the recording?",
      prompt:
        "Who received the altered cartridge and could reach the queue during the earlier window? Connect the physical serial, signed issue and synchronized alibis.",
      evidence: ["E26", "E27", "E28"],
      conclusion:
        "The altered internal hub is U4, issued to Celia. The station admitted only these four people; Iris, Owen and Kit are continuously accounted for at 22:06. Celia had the cartridge and the unaccounted opportunity.",
    },
    {
      id: "D14",
      category: "MOTIVE",
      title: "A profitable interruption",
      prompt:
        "Who gains from a canceled sailing even when the channel is open? Connect the public trial terms, genuine weather and tested rider.",
      evidence: ["E30", "E32", "E33"],
      conclusion:
        "A false warning could cancel the public trial despite safe conditions. Celia’s Cedarline firm would receive £80,000 and first consideration of the berth; the rider applies regardless of the cause of cancellation.",
    },
  ],
  methods: [
    { id: "M11", label: "Speak through the live microphone at 22:14" },
    {
      id: "M12",
      label: "Preload a false bulletin into the reserve cartridge queue",
    },
    {
      id: "M13",
      label: "Send a harbor order over the external telephone line",
    },
  ],
  motives: [
    { id: "R11", label: "Publicize a genuine dangerous-weather warning" },
    {
      id: "R12",
      label:
        "Trigger the rival ferry’s cancellation benefit and berth advantage",
    },
    { id: "R13", label: "Conceal an accidental live-line equipment failure" },
  ],
  inspections: [
    {
      id: "I11",
      kind: "clock",
      title: "Calibrate the missing minutes",
      instruction:
        "Correct the queue’s 22:13 LOCAL insertion print. Use the independent calibration, not the time the bulletin aired.",
      requires: { evidence: ["E21", "E22"] },
      evidenceId: "E23",
      panels: [
        {
          title: "Independent records",
          text: "QUEUE: insertion 22:13 LOCAL; playout 22:14 NETWORK. CALIBRATION: at 22:00 NETWORK the queue read 22:07 LOCAL. Its error remained constant.",
          label: "Insertion in network time",
          options: [],
        },
      ],
      hints: [
        "The insertion and the broadcast use different clocks. Find which one is wrong.",
        "At network time 22:00, the queue was already reading 22:07. It is ahead, not behind.",
        "Subtract the seven-minute advance from 22:13. The scheduled 22:14 playout time does not change.",
      ],
      success:
        "The insertion was at 22:06 network time. A new time-analysis record is ready.",
      failure:
        "That correction does not match the calibration. Work out whether the terminal was ahead or behind network time; correct the insertion print only.",
    },
    {
      id: "I12",
      kind: "comparison",
      title: "Read the condition, not the assurance",
      instruction:
        "Pair the assurance’s claim with the rider clause that directly contradicts it. Other passages may both be true.",
      requires: { evidence: ["E30"], answers: ["T24"] },
      evidenceId: "E33",
      panels: [
        {
          title: "Celia’s written assurance",
          text: "Authenticated copy supplied to the council before the broadcast. Select the claim you want to test.",
          label: "Claim to test",
          options: [
            {
              id: "A1",
              label:
                "The standby payment requires an independent harbor-master closure.",
            },
            { id: "A2", label: "The inspection fee is a fixed £850." },
          ],
        },
        {
          title: "Signed standby rider",
          text: "Authenticated executed appendix, clause 4 and fee schedule. Select the passage that tests the selected claim.",
          label: "Contradicting record",
          options: [
            { id: "B1", label: "Inspection fee: £850, payable monthly." },
            {
              id: "B2",
              label:
                "£80,000 credit on any canceled 22:20 public trial, whatever the cause.",
            },
          ],
        },
      ],
      hints: [
        "A useful contradiction concerns the trigger, not the size of a routine fee.",
        "Compare the assurance’s requirement of an official closure with the rider’s wording about cancellation.",
        "Pair “requires an independent harbor-master closure” with “any canceled trial, whatever the cause.”",
      ],
      success:
        "The rider contradicts the assurance: a cancellation pays regardless of its cause.",
      failure:
        "Those passages do not directly contradict one another. Test the condition that triggers the standby payment, rather than an unrelated fee.",
    },
  ],
};
