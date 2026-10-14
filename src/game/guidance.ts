import {evidence,deductions,locations} from './content';
import type {GameState} from './types';
export type Lead={kind:'location'|'interview'|'board'|'verdict';target?:string;text:string};
export function nextLead(s:GameState):Lead {
 const locationLead=(id:string):Lead=>{const clue=evidence.find(e=>e.id===id)!;return {kind:'location',target:clue.location,text:`Examine the ${clue.point.toLowerCase()} in ${locations.find(l=>l.id===clue.location)!.name}.`};};
 for(const id of ['E01','E05','E06','E04','E07','E09','E10','E13','E14'])if(!s.evidence.includes(id))return locationLead(id);
 if(!s.answers.includes('T04'))return {kind:'interview',text:'Ask Theo who held credential C3. The access terminal gives you a specific question.'};
 if(!s.evidence.includes('E08'))return locationLead('E08');
 if(!s.answers.includes('T03'))return {kind:'interview',text:'Ask Elise where the damaged trolley went. The photograph and wheel trail support that question.'};
 if(!s.evidence.includes('E12'))return locationLead('E12');
 for(const d of deductions){
  if(d.id==='D04'&&!s.evidence.includes('E15'))return locationLead('E15');
  if(!s.deductions.includes(d.id))return {kind:'board',text:d.prompt};
 }
 if(!s.evidence.includes('E16'))return locationLead('E16');
 return {kind:'verdict',text:'Your chain of proof is complete. Review the suspect, method and motive, then submit your account.'};
}
