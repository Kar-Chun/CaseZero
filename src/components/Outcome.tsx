import {evaluate} from '@/game/outcome';
import {suspects,methods,motives} from '@/game/content';
import type {Accusation} from '@/game/types';
import {Icon} from './Icon';
export default function Outcome({accusation,onRetry,onReplay,onReview}:{accusation:Accusation;onRetry:()=>void;onReplay:()=>void;onReview:()=>void}){
 const result=evaluate(accusation);
 return <section className={`outcome ${result.correct?'outcome-closed':'outcome-open'}`}><div className="outcome-emblem"><Icon name={result.correct?'check':'verdict'} size={38}/></div><p className="eyebrow">CASE 001 / {result.correct?'RESOLVED':'REVIEW REQUIRED'}</p><h2>{result.title}</h2><p className="outcome-subtitle">{result.subtitle}</p><div className="ending-story">{result.paragraphs.map(p=><p key={p}>{p}</p>)}</div><div className="submitted-account"><p className="eyebrow">YOUR SUBMITTED ACCOUNT</p><p><strong>{suspects.find(s=>s.id===accusation.suspect)?.name}</strong> · {methods.find(m=>m.id===accusation.method)?.label} · {motives.find(m=>m.id===accusation.motive)?.label}</p></div><blockquote>{result.epilogue}</blockquote><div className="ending-actions">{!result.correct&&<button className="button primary" onClick={onRetry}>Return to investigation<Icon name="back"/></button>}{result.correct&&<button className="button primary" onClick={onReview}>Review case file<Icon name="notebook"/></button>}<button className="button outline" onClick={onReplay}>Play again<Icon name="reset" size={18}/></button></div><p className="small-note">Replay starts a fresh investigation of the same authored mystery.</p></section>;
}
