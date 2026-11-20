/* ElektroPlan SM — topology-only connected terminal groups.
   This is not a protective conductor, short-circuit, or electrical safety test. */
(function(root){
'use strict';
function analyze(project){
 const symbols=Array.isArray(project?.symbols)?project.symbols:[];
 const wires=Array.isArray(project?.wires)?project.wires:[];
 const byId=new Map(),duplicateIds=new Set();
 for(const symbol of symbols){if(!symbol||typeof symbol.id!=='string'||!symbol.id.trim())continue;if(byId.has(symbol.id))duplicateIds.add(symbol.id);else byId.set(symbol.id,symbol)}
 const parent=new Map(),groups=new Map(),pending=[];
 const validTerminals=s=>Array.isArray(s?.manualTerminals)&&s.manualTerminals.length<=8&&s.manualTerminals.every(t=>typeof t==='string'&&t.trim()===t&&t.length>0&&t.length<=40)&&new Set(s.manualTerminals).size===s.manualTerminals.length;
 const key=(id,t)=>JSON.stringify([id,t]);
 function find(k){if(!parent.has(k))parent.set(k,k);const p=parent.get(k);if(p!==k)parent.set(k,find(p));return parent.get(k)}
 function join(a,b){const x=find(a),y=find(b);if(x!==y)parent.set(y,x)}
 wires.forEach((w,i)=>{
  const a=byId.get(w?.a),b=byId.get(w?.b);
  if(duplicateIds.has(w?.a)||duplicateIds.has(w?.b)){pending.push({wire:i,reason:'Mehrdeutige Symbolkennung'});return}
  if(w?.a===w?.b){pending.push({wire:i,reason:'Selbstverbindung'});return}
  if(!a||!b||!validTerminals(a)||!validTerminals(b)||typeof w.fromTerminal!=='string'||typeof w.toTerminal!=='string'||!a.manualTerminals.includes(w.fromTerminal)||!b.manualTerminals.includes(w.toTerminal)){
   pending.push({wire:i,reason:'Fehlende oder ungültige Anschlussreferenz'});return;
  }
  join(key(w.a,w.fromTerminal),key(w.b,w.toTerminal));
 });
 for(const k of parent.keys()){const rootKey=find(k);if(!groups.has(rootKey))groups.set(rootKey,[]);groups.get(rootKey).push(JSON.parse(k))}
 const nets=Array.from(groups.values()).map(ports=>ports.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))).map((ports,i)=>({id:'N'+(i+1),terminals:ports.map(([component,terminal])=>({component,terminal}))}));
 return {nets,pending,reviewRequired:true,electricallyApproved:false,disclaimer:'Nur grafische Verbindungsgruppen; keine Durchgangs-, Kurzschluss-, PE- oder Schutzprüfung.'};
}
const api={analyze};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanNets=api;
})(typeof globalThis!=='undefined'?globalThis:this);
