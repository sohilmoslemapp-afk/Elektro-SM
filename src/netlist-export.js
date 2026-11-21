/* ElektroPlan SM — deterministic netlist from explicit terminal wires only.
 * Geometric crossings do not connect. No internal device conductivity inferred.
 */
(function(root){
'use strict';
const key=(id,terminal)=>JSON.stringify([id,terminal]);
function build(project){
 if(!Array.isArray(project?.symbols)||!Array.isArray(project?.wires))throw Error('INVALID_PROJECT');
 const parent=new Map(),find=x=>{if(!parent.has(x))parent.set(x,x);const p=parent.get(x);if(p!==x)parent.set(x,find(p));return parent.get(x)};
 const join=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent.set(b,a)};
 for(const s of project.symbols){if(!s||!Array.isArray(s.manualTerminals))throw Error('INVALID_SYMBOL');for(const t of s.manualTerminals)find(key(s.id,t))}
 for(const w of project.wires){
  const a=project.symbols.find(s=>s.id===w.a),b=project.symbols.find(s=>s.id===w.b);
  if(!a?.manualTerminals.includes(w.fromTerminal)||!b?.manualTerminals.includes(w.toTerminal))throw Error('INVALID_WIRE');
  join(key(w.a,w.fromTerminal),key(w.b,w.toTerminal));
 }
 const nets=new Map();
 for(const k of parent.keys()){const rootKey=find(k);if(!nets.has(rootKey))nets.set(rootKey,[]);const [device,terminal]=JSON.parse(k);nets.get(rootKey).push({device,terminal})}
 const ordered=[...nets.values()].map(terms=>terms.sort((a,b)=>a.device.localeCompare(b.device)||a.terminal.localeCompare(b.terminal))).sort((a,b)=>JSON.stringify(a[0]).localeCompare(JSON.stringify(b[0])));
 return {format:'elektroplan-explicit-netlist-v1',nets:ordered.map((terminals,i)=>({id:'NET'+String(i+1).padStart(3,'0'),terminals})),connectionPolicy:'explicit-wires-only',electricallyApproved:false};
}
const api={build};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanNetlistExport=api;
})(typeof globalThis!=='undefined'?globalThis:this);
