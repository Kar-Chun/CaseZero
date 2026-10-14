import {locations, evidence, suspects, dialogue, deductions} from './content';
import type {Location, Evidence, Suspect, Dialogue, Deduction, Requirement} from './types';
export type CaseContent={locations:Location[];evidence:Evidence[];suspects:Suspect[];dialogue:Dialogue[];deductions:Deduction[]};
export const caseContent:CaseContent={locations,evidence,suspects,dialogue,deductions};
/** Reference checks plus monotonic closure: every node must be obtainable from a fresh case. */
export function validateContent(content:CaseContent=caseContent):string[] {
  const issues:string[]=[];
  const groups={evidence:content.evidence,deductions:content.deductions,answers:content.dialogue};
  const nodes=[...content.locations,...content.evidence,...content.suspects,...content.dialogue,...content.deductions];
  const seen=new Set<string>();
  for(const n of nodes) {if(seen.has(n.id)) issues.push(`Duplicate ID: ${n.id}`);seen.add(n.id);}
  const check=(id:string,req:Requirement)=>{
    for(const key of ['evidence','deductions','answers'] as const) for(const ref of req[key]??[]) if(!groups[key].some(n=>n.id===ref)) issues.push(`${id}: unknown ${key} ${ref}`);
  };
  for(const e of content.evidence){if(!content.locations.some(l=>l.id===e.location)) issues.push(`${e.id}: unknown location`);check(e.id,e.requires);}
  for(const t of content.dialogue){if(!content.suspects.some(s=>s.id===t.suspect)) issues.push(`${t.id}: unknown suspect`);check(t.id,t.requires);}
  for(const d of content.deductions){check(d.id,{evidence:d.evidence});if(d.evidence.length<2 || new Set(d.evidence).size!==d.evidence.length) issues.push(`${d.id}: invalid recipe`);}
  const reached={evidence:new Set<string>(),deductions:new Set<string>(),answers:new Set<string>()};
  const ready=(req:Requirement)=>(['evidence','deductions','answers'] as const).every(k=>(req[k]??[]).every(id=>reached[k].has(id)));
  let changed=true;
  while(changed){
    changed=false;
    const add=(kind:keyof typeof reached,id:string)=>{if(!reached[kind].has(id)){reached[kind].add(id);changed=true;}};
    for(const e of content.evidence) if(ready(e.requires)) add('evidence',e.id);
    for(const t of content.dialogue) if(ready(t.requires)) add('answers',t.id);
    for(const d of content.deductions) if(ready({evidence:d.evidence})) add('deductions',d.id);
  }
  for(const key of ['evidence','deductions','answers'] as const) for(const n of groups[key]) if(!reached[key].has(n.id)) issues.push(`Unreachable ${key}: ${n.id}`);
  return issues;
}
