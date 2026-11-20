/* ElektroPlan SM — topology-only connected terminal groups.
   This is not a protective conductor, short-circuit, or electrical safety test. */
(function(root){
'use strict';
function analyze(project){
 const symbols=Array.isArray(project?.symbols)?project.symbols:[];
 const wires=Array.isArray(project?.wires)?project.wires:[];
 const byId=new Map(),duplicateIds=new Set(),normalizedIds=new Map();
 const unsafe=/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u;
 for(const symbol of symbols){
  if(!symbol||typeof symbol.id!=='string'||!symbol.id.trim())continue;
  const id=symbol.id,normalized=id.normalize('NFC');
  if(byId.has(id))duplicateIds.add(id);else byId.set(id,symbol);
  if(normalizedIds.has(normalized)){duplicateIds.add(id);duplicateIds.add(normalizedIds.get(normalized))}
  else normalizedIds.set(normalized,id);
 }
 const parent=new Map(),groups=new Map(),pending=[],seenEdges=new Map();
 const validTerminals=s=>Array.isArray(s?.manualTerminals)&&s.manualTerminals.length<=8&&s.manualTerminals.every(t=>typeof t==='string'&&t.trim()===t&&t.length>0&&t.length<=40&&!unsafe.test(t))&&new Set(s.manualTerminals).size===s.manualTerminals.length;
 const validId=id=>typeof id==='string'&&id.trim()===id&&id.length>0&&id.length<=100&&!unsafe.test(id);
 const validEndpoint=t=>typeof t==='string'&&t.trim()===t&&t.length>0&&t.length<=40&&!unsafe.test(t);
 const key=(id,t)=>JSON.stringify([id,t]);
 function find(k){if(!parent.has(k))parent.set(k,k);const p=parent.get(k);if(p!==k)parent.set(k,find(p));return parent.get(k)}
 function join(a,b){const x=find(a),y=find(b);if(x!==y)parent.set(y,x)}
 wires.forEach((w,i)=>{
  const a=byId.get(w?.a),b=byId.get(w?.b);
  if(!validId(w?.a)||!validId(w?.b)){pending.push({wire:i,reason:'Ungültige Symbolkennung'});return}
  if(duplicateIds.has(w?.a)||duplicateIds.has(w?.b)){pending.push({wire:i,reason:'Mehrdeutige Symbolkennung'});return}
  if(w?.a===w?.b){pending.push({wire:i,reason:'Selbstverbindung'});return}
  if(!a||!b||!validTerminals(a)||!validTerminals(b)||!validEndpoint(w.fromTerminal)||!validEndpoint(w.toTerminal)||!a.manualTerminals.includes(w.fromTerminal)||!b.manualTerminals.includes(w.toTerminal)){
   pending.push({wire:i,reason:'Fehlende oder ungültige Anschlussreferenz'});return;
  }
  const endpoints=[key(w.a,w.fromTerminal),key(w.b,w.toTerminal)].sort();
  const edgeKey=JSON.stringify(endpoints);
  if(seenEdges.has(edgeKey)){
   pending.push({wire:i,duplicateOf:seenEdges.get(edgeKey),reason:'Doppelte Anschlussverbindung – fachlich prüfen'});
   return;
  }
  seenEdges.set(edgeKey,i);
  join(endpoints[0],endpoints[1]);
 });
 for(const k of parent.keys()){const rootKey=find(k);if(!groups.has(rootKey))groups.set(rootKey,[]);groups.get(rootKey).push(JSON.parse(k))}
 const nets=Array.from(groups.values()).map(ports=>ports.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))).map((ports,i)=>({id:'N'+(i+1),terminals:ports.map(([component,terminal])=>({component,terminal}))}));
 return {nets,pending,reviewRequired:true,electricallyApproved:false,disclaimer:'Nur grafische Verbindungsgruppen; keine Durchgangs-, Kurzschluss-, PE- oder Schutzprüfung.'};
}
const api={analyze};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanNets=api;
})(typeof globalThis!=='undefined'?globalThis:this);
