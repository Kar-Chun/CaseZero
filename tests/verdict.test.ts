import {describe,it,expect} from 'vitest';
import {freshState,startCase,combine,canAccuse,accuse,resumeInvestigation,discover,answer} from '../src/game/engine';
import {evaluate} from '../src/game/outcome';
import {deductions} from '../src/game/content';
import {solveCase} from './helpers';
const correct={suspect:'S01',method:'M02',motive:'R03'};
describe('deductions and verdict',()=>{
 it.each(deductions)('forms $id with the exact recipe, regardless of order',d=>{const initial={...startCase(freshState()),evidence:[...d.evidence]};const result=combine(initial,[...d.evidence].reverse());expect(result.state.deductions).toEqual([d.id]);expect(initial.deductions).toEqual([]);expect(combine(result.state,d.evidence).state).toBe(result.state);});
 it('rejects duplicate, undiscovered, incomplete and unrelated combinations',()=>{const s=solveCase();for(const ids of [['E01','E01','E05'],['unknown'],['E01','E05'],['E03','E06','E11']])expect(combine(s,ids).state).toBe(s);expect(combine(startCase(freshState()),['E01','E05','E06']).state.deductions).toEqual([]);});
 it('executes the full investigation with every evidence item and no soft lock',()=>{const s=solveCase();expect(s.evidence).toHaveLength(16);expect(s.deductions).toHaveLength(4);expect(canAccuse(s)).toBe(true);expect(evaluate(accuse(s,correct).accusation!).correct).toBe(true);});
 it('requires every conclusion and object recovery, then freezes changes until return',()=>{const s=solveCase();expect(canAccuse({...s,evidence:s.evidence.filter(e=>e!=='E16')})).toBe(false);for(const d of deductions)expect(canAccuse({...s,deductions:s.deductions.filter(id=>id!==d.id)})).toBe(false);expect(accuse(freshState(),correct).accusation).toBeNull();expect(accuse(s,{...correct,suspect:'missing'})).toBe(s);const final=accuse(s,correct);expect(accuse(final,correct)).toBe(final);expect(discover(final,'E01')).toBe(final);expect(answer(final,'T11')).toBe(final);expect(combine(final,['E01','E05','E06']).state).toBe(final);});
 it.each([{...correct,suspect:'S02'},{...correct,method:'M01'},{...correct,motive:'R02'}])('rejects an unsupported account and permits a preserved retry: %j',value=>{const s=solveCase();const rejected=accuse(s,value);expect(evaluate(value).correct).toBe(false);const resumed=resumeInvestigation(rejected);expect(resumed.evidence).toEqual(s.evidence);expect(resumed.answers).toEqual(s.answers);expect(resumed.accusation).toBeNull();expect(evaluate(accuse(resumed,correct).accusation!).correct).toBe(true);});
});
