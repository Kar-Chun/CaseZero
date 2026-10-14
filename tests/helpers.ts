import {freshState,startCase,discover,answer,combine} from '../src/game/engine';
export function solveCase(){
 let s=startCase(freshState());
 for(const id of ['E01','E02','E03','E04','E05','E06','E07','E09','E10','E11','E13','E14'])s=discover(s,id);
 for(const id of ['T01','T05','T07','T09','T03','T04'])s=answer(s,id);
 for(const id of ['E08','E12'])s=discover(s,id);
 for(const ids of [['E01','E05','E06'],['E09','E10','E12'],['E04','E07','E08']])s=combine(s,ids).state;
 s=discover(s,'E15');s=combine(s,['E13','E14','E15']).state;s=discover(s,'E16');
 return s;
}
