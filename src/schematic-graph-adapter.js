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
 const terminalSets=new Map(components.filter(c=>typeof c.id==='string').map(c=>[c.id,new Set(c.terminals)]));
 wires.forEach((w,index)=>{
  if(typeof w?.fromTerminal!=='string'||!w.fromTerminal.trim()||typeof w?.toTerminal!=='string'||!w.toTerminal.trim()){pending.push({wire:index,reason:'Klemmenzuordnung unvollständig'});return}
  if(typeof w.a!=='string'||!w.a.trim()||typeof w.b!=='string'||!w.b.trim()){pending.push({wire:index,reason:'Bauteilzuordnung unvollständig'});return}
  if(!knownIds.has(w.a)||!knownIds.has(w.b)){pending.push({wire:index,reason:'Bauteilreferenz unbekannt'});return}
  if(!terminalSets.get(w.a)?.has(w.fromTerminal)||!terminalSets.get(w.b)?.has(w.toTerminal)){pending.push({wire:index,reason:'Klemmenreferenz unbekannt'});return}
  connections.push({from:{component:w.a,terminal:w.fromTerminal},to:{component:w.b,terminal:w.toTerminal},sourceWire:index});
 });
 return {components,connections,pending};
}
const api={fromSchematic};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanGraphAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this);
