import {
  freshState,
  startCase,
  discover,
  answer,
  combine,
  analyze,
} from "../src/game/engine";
export function solveCase() {
  let s = startCase(freshState());
  for (const id of [
    "E01",
    "E02",
    "E03",
    "E04",
    "E05",
    "E06",
    "E07",
    "E09",
    "E10",
    "E11",
    "E13",
    "E14",
  ])
    s = discover(s, id);
  for (const id of ["T01", "T05", "T07", "T09", "T03", "T04"])
    s = answer(s, id);
  for (const id of ["E08", "E12"]) s = discover(s, id);
  for (const ids of [
    ["E01", "E05", "E06"],
    ["E09", "E10", "E12"],
    ["E04", "E07", "E08"],
  ])
    s = combine(s, ids).state;
  s = discover(s, "E15");
  s = combine(s, ["E13", "E14", "E15"]).state;
  s = discover(s, "E16");
  return s;
}

export function solveRadio() {
  let state = startCase(freshState("dead-air"));
  for (const id of [
    "E21",
    "E22",
    "E24",
    "E25",
    "E26",
    "E28",
    "E29",
    "E30",
    "E31",
    "E32",
  ])
    state = discover(state, id);
  state = analyze(state, "I11", "22:06").state;
  for (const id of ["T21", "T22", "T26", "T28", "T23", "T24"])
    state = answer(state, id);
  state = discover(state, "E27");
  state = analyze(state, "I12", "A1:B2").state;
  for (const ids of [
    ["E24", "E25"],
    ["E23", "E29"],
    ["E26", "E27", "E28"],
    ["E30", "E32", "E33"],
  ])
    state = combine(state, ids).state;
  return discover(state, "E34");
}

export function solveConservatory(includeOptional = true) {
  let s = startCase(freshState("after-the-flood"));
  for (const id of [
    "E41",
    "E42",
    "E43",
    "E44",
    "E45",
    "E46",
    "E48",
    "E52",
    "E53",
  ])
    s = discover(s, id);
  if (includeOptional) s = discover(s, "E51");
  s = analyze(s, "I21", "V3:V1:V4:V2").state;
  for (const id of ["T43", "T44"]) s = answer(s, id);
  for (const id of ["E49", "E50"]) s = discover(s, id);
  for (const [ids, explanation] of [
    [["E42", "E43", "E46"], "C2"],
    [["E44", "E45", "E47"], "C3"],
    [["E48", "E49"], "C1"],
    [["E50", "E52", "E53"], "C2"],
  ] as [string[], string][])
    s = combine(s, ids, explanation).state;
  return discover(s, "E54");
}
