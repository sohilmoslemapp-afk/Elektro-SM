/* ElektroPlan SM — topology-only connected terminal groups.
   This is not a protective conductor, short-circuit, or electrical safety test. */
(function(root){
'use strict';
function analyze(project){
 const symbols=Array.isArray(project?.symbols)?project.symbols:[];
 const wires=Array.isArray(project?.wires)?project.wires:[];
 const byId=new Map(symbols.filter(s=>s&&typeof s.id==='string').map(s=>[s.id,s]));
 const parent=new Map(),groups=new Map(),pending=[];
 const key=(id,t)=>JSON.stringify([id,t]);
 function find(k){if(!parent.has(k))parent.set(k,k);const p=parent.get(k);if(p!==k)parent.set(k,find(p));return parent.get(k)}
 function join(a,b){const x=find(a),y=find(b);if(x!==y)parent.set(y,x)}
 wires.forEach((w,i)=>{
  const a=byId.get(w?.a),b=byId.get(w?.b);
  if(!a||!b||!w.fromTerminal||!w.toTerminal||!a.manualTerminals?.includes(w.fromTerminal)||!b.manualTerminals?.includes(w.toTerminal)){
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
