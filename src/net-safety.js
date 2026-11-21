/* ElektroPlan SM: explicit typed terminal-net checks.
   Labels such as 1, 2, A1, A2 are NOT conductor types. No certification. */
(function(root){
'use strict';
const allowed=new Set(['L1','L2','L3','N','PE','PEN','PA','UNKNOWN']);
const norm=v=>typeof v==='string'?v.trim().toUpperCase():'UNKNOWN';
function validate(project){
 const errors=[],warnings=[],symbols=Array.isArray(project?.symbols)?project.symbols:[],wires=Array.isArray(project?.wires)?project.wires:[];
 const byId=new Map(symbols.map(s=>[s.id,s]));
 const parent=new Map(),types=new Map();
 const key=(id,t)=>JSON.stringify([id,t]);
 const find=x=>{if(!parent.has(x))parent.set(x,x);let p=parent.get(x);if(p!==x){p=find(p);parent.set(x,p)}return p};
 const join=(a,b)=>{const x=find(a),y=find(b);if(x!==y)parent.set(y,x)};
 const explicit=(s,t)=>s?.terminalTypes&&Object.prototype.hasOwnProperty.call(s.terminalTypes,t)?norm(s.terminalTypes[t]):'UNKNOWN';
 for(const s of symbols){if(!s||!Array.isArray(s.manualTerminals))continue;for(const t of s.manualTerminals){const k=key(s.id,t),type=explicit(s,t);find(k);if(!allowed.has(type))errors.push({code:'INVALID_CONDUCTOR_TYPE',terminal:k,type});else if(type!=='UNKNOWN')types.set(k,type)}}
 for(const [i,w] of wires.entries()){
  const a=byId.get(w.a),b=byId.get(w.b);
  if(!a?.manualTerminals?.includes(w.fromTerminal)||!b?.manualTerminals?.includes(w.toTerminal)){errors.push({code:'INVALID_WIRE_REFERENCE',wire:i});continue}
  join(key(w.a,w.fromTerminal),key(w.b,w.toTerminal));
 }
 const nets=new Map();
 for(const k of parent.keys()){const root=find(k);if(!nets.has(root))nets.set(root,{terminals:[],types:new Set()});const net=nets.get(root);net.terminals.push(JSON.parse(k));if(types.has(k))net.types.add(types.get(k))}
 for(const net of nets.values()){
  const t=[...net.types],members=net.terminals;
  if(t.length>1){
   const has=(a,b)=>t.includes(a)&&t.includes(b);
   if(has('N','PE'))errors.push({code:'N_PE_NET_CONFLICT',terminals:members});
   if(t.includes('PE')&&t.some(x=>/^L[123]$/.test(x)))errors.push({code:'PHASE_PE_NET_CONFLICT',terminals:members});
   if(t.includes('N')&&t.some(x=>/^L[123]$/.test(x)))errors.push({code:'PHASE_N_NET_CONFLICT',terminals:members});
   if(t.filter(x=>/^L[123]$/.test(x)).length>1)errors.push({code:'PHASE_PHASE_NET_CONFLICT',terminals:members});
  }
  if(t.includes('PEN')||t.includes('PA'))warnings.push({code:'EARTHING_SYSTEM_REVIEW',terminals:members});
  if(!t.length&&members.length>1)warnings.push({code:'UNTYPED_NET_REVIEW',terminals:members});
 }
 return {valid:errors.length===0,reviewRequired:errors.length>0||warnings.length>0,electricallyApproved:false,errors,warnings,netCount:nets.size};
}
const api={validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanNetSafety=api;
})(typeof globalThis!=='undefined'?globalThis:this);
