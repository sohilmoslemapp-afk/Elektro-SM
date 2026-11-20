/* ElektroPlan SM — lossless adapter from drawn schematic terminal references to graph model.
   No manufacturer terminals are inferred. Incomplete wires remain explicitly pending. */
(function(root){
'use strict';
function fromSchematic(project){
 const symbols=Array.isArray(project?.symbols)?project.symbols:[];
 const wires=Array.isArray(project?.wires)?project.wires:[];
 const components=symbols.map(s=>({id:s?.id,terminals:Array.isArray(s?.manualTerminals)?s.manualTerminals.slice():[]}));
 const connections=[],pending=[];
 const knownIds=new Set(components.map(c=>c.id));
 const idCounts=new Map();
 components.forEach(c=>idCounts.set(c.id,(idCounts.get(c.id)||0)+1));
 const terminalSets=new Map(components.filter(c=>typeof c.id==='string').map(c=>[c.id,new Set(c.terminals)]));
 const normalizedIdCounts=new Map();
 components.forEach(c=>{if(typeof c.id==='string'){const key=c.id.normalize('NFC');normalizedIdCounts.set(key,(normalizedIdCounts.get(key)||0)+1)}});
 const normalizedTerminalCounts=new Map();
 components.forEach(c=>{if(typeof c.id!=='string')return;const counts=new Map();c.terminals.forEach(t=>{if(typeof t==='string'){const key=t.normalize('NFC');counts.set(key,(counts.get(key)||0)+1)}});normalizedTerminalCounts.set(c.id,counts)});
 wires.forEach((w,index)=>{
  if(typeof w?.fromTerminal!=='string'||!w.fromTerminal.trim()||typeof w?.toTerminal!=='string'||!w.toTerminal.trim()){pending.push({wire:index,reason:'Klemmenzuordnung unvollständig'});return}
  if(typeof w.a!=='string'||!w.a.trim()||typeof w.b!=='string'||!w.b.trim()){pending.push({wire:index,reason:'Bauteilzuordnung unvollständig'});return}
  if(!knownIds.has(w.a)||!knownIds.has(w.b)){pending.push({wire:index,reason:'Bauteilreferenz unbekannt'});return}
  if(idCounts.get(w.a)!==1||idCounts.get(w.b)!==1||normalizedIdCounts.get(w.a.normalize('NFC'))!==1||normalizedIdCounts.get(w.b.normalize('NFC'))!==1){pending.push({wire:index,reason:'Bauteilreferenz mehrdeutig'});return}
  if(!terminalSets.get(w.a)?.has(w.fromTerminal)||!terminalSets.get(w.b)?.has(w.toTerminal)){pending.push({wire:index,reason:'Klemmenreferenz unbekannt'});return}
  if(normalizedTerminalCounts.get(w.a)?.get(w.fromTerminal.normalize('NFC'))!==1||normalizedTerminalCounts.get(w.b)?.get(w.toTerminal.normalize('NFC'))!==1){pending.push({wire:index,reason:'Klemmenreferenz mehrdeutig'});return}
  connections.push({from:{component:w.a,terminal:w.fromTerminal},to:{component:w.b,terminal:w.toTerminal},sourceWire:index});
 });
 return {components,connections,pending};
}
const api={fromSchematic};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanGraphAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this);
