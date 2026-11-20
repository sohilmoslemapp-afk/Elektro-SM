/* ElektroPlan SM — terminal-aware graph model. Terminals are user-defined,
   never inferred from manufacturer or component appearance. */
(function(root){
'use strict';
function validateTerminalGraph(project){
 const errors=[],warnings=[],parts=project?.components,edges=project?.connections;
 if(!Array.isArray(parts)||!Array.isArray(edges))return {valid:false,reviewRequired:true,electricallyApproved:false,errors:['Ungültiges Anschlussmodell'],warnings};
 const ids=new Set(),normalizedIds=new Set(),ports=new Map(),used=new Map(),edgeKeys=new Set(),connectedComponents=new Set();
 if(parts.length===0){warnings.push('Keine Bauteile vorhanden');if(edges.length>0)errors.push('Verbindungen ohne Bauteile sind unzulässig')}
 if(edges.length===0)warnings.push('Keine Verbindungen vorhanden');
 parts.forEach((part,i)=>{
  if(!part||typeof part.id!=='string'||!part.id.trim()||part.id!==part.id.trim()||/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u.test(part.id)||ids.has(part.id)||normalizedIds.has(part.id.normalize('NFC'))){errors.push('Bauteil '+i+': fehlende oder doppelte Kennung');return}
  ids.add(part.id);normalizedIds.add(part.id.normalize('NFC'));
  if(!Array.isArray(part.terminals)){errors.push('Bauteil '+part.id+': Anschlussliste fehlt');return}
  const names=new Set(),normalizedNames=new Set();
  part.terminals.forEach((term,j)=>{
   if(typeof term!=='string'||!term.trim()||term!==term.trim()||/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u.test(term)||names.has(term)||normalizedNames.has(term.normalize('NFC'))){errors.push('Bauteil '+part.id+': ungültiger oder doppelter Anschluss '+j);return}
   names.add(term);normalizedNames.add(term.normalize('NFC'));
  });
  if(part.terminals.length===0)warnings.push('Bauteil ohne erfasste Anschlüsse: '+part.id);
  ports.set(part.id,names);
 });
 edges.forEach((edge,i)=>{
  const a=edge?.from,b=edge?.to;
  if(!a||!b||typeof a.component!=='string'||typeof b.component!=='string'||!ids.has(a.component)||!ids.has(b.component)){errors.push('Verbindung '+i+': Bauteil fehlt');return}
  if(typeof a.terminal!=='string'||typeof b.terminal!=='string'||!ports.get(a.component)?.has(a.terminal)||!ports.get(b.component)?.has(b.terminal)){errors.push('Verbindung '+i+': Anschluss fehlt');return}
  const ak=JSON.stringify([a.component,a.terminal]),bk=JSON.stringify([b.component,b.terminal]);
  if(ak===bk){errors.push('Verbindung '+i+': Selbstverbindung desselben Anschlusses');return}
  const key=[ak,bk].sort().join('|');
  if(edgeKeys.has(key)){errors.push('Verbindung '+i+': doppelte Anschlussverbindung');return}edgeKeys.add(key);
  if(a.component===b.component)warnings.push('Verbindung '+i+': Zwei Anschlüsse desselben Bauteils verbunden – fachlich prüfen');
  used.set(ak,(used.get(ak)||0)+1);used.set(bk,(used.get(bk)||0)+1);connectedComponents.add(a.component);connectedComponents.add(b.component);
 });
 if(edges.length>0)for(const id of ids){if(!connectedComponents.has(id))warnings.push('Bauteil ohne Verbindung: '+id)}
 for(const [key,count] of used){if(count>1){const [component,terminal]=JSON.parse(key);warnings.push('Mehrfachbelegung prüfen: '+component+'/'+terminal+' ('+count+' Verbindungen)')}}
 parts.forEach(part=>{if(!part||!ports.has(part.id))return;for(const t of ports.get(part.id)){const key=JSON.stringify([part.id,t]);if(!used.has(key))warnings.push('Offener Anschluss: '+part.id+'/'+t)}});
 return {valid:errors.length===0,reviewRequired:errors.length>0||warnings.length>0,electricallyApproved:false,errors,warnings,checkedComponents:parts.length,checkedConnections:edges.length,
 disclaimer:'Nur grafische Anschlussreferenzen. Keine Herstellerprüfung, keine elektrische Sicherheitsprüfung oder Freigabe.'};
}
const api={validateTerminalGraph};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanTerminals=api;
})(typeof globalThis!=='undefined'?globalThis:this);
