import {describe,it,expect} from 'vitest';
import {dialogue} from '../src/game/content';
import {freshState,startCase,discover,answer,combine} from '../src/game/engine';
describe('branching interviews',()=>{
 it.each(dialogue.filter(t=>Object.keys(t.requires).length>0))('$id remains locked until every dependency is present',t=>{
  const initial=startCase(freshState());expect(answer(initial,t.id)).toBe(initial);
  const complete={...initial,evidence:t.requires.evidence??[],deductions:t.requires.deductions??[],answers:t.requires.answers??[]};
  expect(answer(complete,t.id).answers).toContain(t.id);
  for(const key of ['evidence','deductions','answers'] as const){const needed=t.requires[key]??[];for(const missing of needed){const incomplete={...complete,[key]:complete[key].filter(id=>id!==missing)};expect(answer(incomplete,t.id)).toBe(incomplete);}}
 });
 it('records basic answers once and rejects invalid/inactive requests',()=>{const initial=freshState();expect(answer(initial,'T01')).toBe(initial);const active=startCase(initial);expect(answer(active,'missing')).toBe(active);const heard=answer(active,'T01');expect(answer(heard,'T01')).toBe(heard);expect(heard.answers).toEqual(['T01']);});
 it('opens both required evidence paths through earned interview branches',()=>{let state=startCase(freshState());state=discover(state,'E05');state=answer(state,'T04');state=discover(state,'E08');expect(state.evidence).toContain('E08');state=discover(state,'E09');state=discover(state,'E10');state=answer(state,'T03');state=discover(state,'E12');expect(state.evidence).toContain('E12');state=combine(state,['E09','E10','E12']).state;state=discover(state,'E15');expect(state.evidence).toContain('E15');});
});
