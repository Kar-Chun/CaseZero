# CaseZero human playtest

Phase 4 is ready for human feedback. No human sessions or enjoyment results are claimed. Automated walkthroughs check engineering behavior; they cannot establish whether deduction feels satisfying.

## Run a session

Use the README to run the game locally. Allow 30–45 minutes, with permission to stop earlier. Recruit first-time players with different levels of mystery-game experience. Assign one of the three cases; spread sessions across all three. Keep the case bible, source and walkthroughs out of sight. Use a fresh investigation or a separate browser profile; export any investigation you want to keep before resetting it.

Ask the player to investigate at their own pace and say what they are thinking if comfortable. Do not teach the controls ahead of time or suggest the culprit. Record the point at which help becomes necessary. Let the player try the optional hint ladder; note which stage helped and whether it revealed too much. If they remain stuck, record the blocker before offering help. Do not treat a facilitator-assisted ending as an unaided completion.

Observe without leading:

- **First five minutes:** Can they explain the objective and find a search point? Do they understand returning to suspects and using the board?
- **Discovery and pacing:** Which records are overlooked? Are locked leads understandable? Does navigation interrupt a promising line of thought?
- **Reasoning:** Ask “What does this establish?” rather than “Who did it?” Can they distinguish a claim, a motive and a proven opportunity? What do they expect a failed connection to explain?
- **Deductions:** Do connections feel earned or like finding an exact recipe? In the museum/radio cases, let different valid proofs emerge naturally. Do not prescribe a route. In the conservatory, watch the sequence and explanation choices.
- **Conclusion and replay:** Can they justify person, method and motive? Does the reasoning review explain a rejected account? Are overlooked leads useful? Is reopening versus starting over clear?
- **Comfort and enjoyment:** Where do they disengage, reread, backtrack or lose confidence? What moment would they describe to a friend?

Run additional sessions on an actual phone and with keyboard-only input; do not describe desktop emulation as physical-device testing. Check reading, touch targets, long-board navigation, modal dismissal, focus return, zoom and reduced motion. Invite screen-reader users if possible; automated accessibility scans are only a starting point.

After the case, ask for difficulty, clarity and enjoyment in the player's own words. Ask what they believed immediately before the decisive deduction and what changed their mind. A quick replay can test another proof route, but is not evidence about first-time difficulty because the solution is already known.

## Feedback to keep

Use this blank template in a local text file or your normal feedback channel. No telemetry or external service is built into the game. Ask before recording a session; do not request personal details, full exports or private notebook text. Share only what the player agrees to share.

```text
Case / build commit:
First time with this case? / mystery-game experience:
Browser / operating system / screen or device / input method:
Completed, stopped, or assisted? / approximate duration:
First confusing moment (screen and action):
Missed clue or unclear lock:
Connection attempted / expected result / actual feedback:
Hint stage used / helped or revealed too much:
What proved the conclusion to you?
Most satisfying moment:
Most frustrating moment:
Difficulty / clarity / enjoyment, in your own words:
Mobile, keyboard, reading or accessibility issue:
One change you would most want:
Optional bug reproduction (steps / expected / actual):
```

Triaging: fix lost progress, dead ends and inaccessible controls first. Then compare repeated clarity/difficulty issues across independent sessions. Preserve logically sufficient proof and narrative consistency when tuning copy or hints. Do not add mechanics merely because a player lists feature ideas; identify the underlying friction and test the smallest change. Record observations separately from engineering checks in VERIFICATION.md when real sessions occur.
