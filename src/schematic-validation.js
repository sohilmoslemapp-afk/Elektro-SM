/* ElektroPlan SM — schematic model validation. Structural checks only, not electrical approval. */
(function(root){
'use strict';
const TYPES=new Set(['RCD','LS','SW','LAMP','KLEMME']);
function validate(project){
 const errors=[],warnings=[],symbols=project?.symbols,wires=project?.wires;
 if(!Array.isArray(symbols)||!Array.isArray(wires))return {valid:false,errors:['Projektstruktur ungültig'],warnings};
 const ids=new Set(),normalizedIds=new Set();
 const unsafeId=/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u;
 symbols.forEach((s,i)=>{
  if(!s||typeof s.id!=='string'||!s.id.trim()||s.id!==s.id.trim()||unsafeId.test(s.id))errors.push('Symbol '+i+': Kennung fehlt');
  else if(ids.has(s.id)||normalizedIds.has(s.id.normalize('NFC')))errors.push('Doppelte Symbolkennung: '+s.id);
  else {ids.add(s.id);normalizedIds.add(s.id.normalize('NFC'));}
  if(!TYPES.has(s?.type))errors.push('Symbol '+i+': unbekannter Typ');
  if(!Number.isFinite(s?.x)||!Number.isFinite(s?.y))errors.push('Symbol '+i+': ungültige Position');
 });
 const seen=new Set(),degree=new Map();
 wires.forEach((w,i)=>{
  if(!w||!ids.has(w.a)||!ids.has(w.b)){errors.push('Leitung '+i+': Endpunkt fehlt');return}
  if(w.a===w.b){errors.push('Leitung '+i+': Selbstverbindung');return}
  const key=JSON.stringify([w.a,w.b].sort());
  if(seen.has(key))warnings.push('Leitung '+i+': doppelte Verbindung');
  seen.add(key);degree.set(w.a,(degree.get(w.a)||0)+1);degree.set(w.b,(degree.get(w.b)||0)+1);
 });
 symbols.forEach(s=>{if(s?.id&&ids.has(s.id)&&!degree.has(s.id))warnings.push('Nicht verbunden: '+s.id)});
 return {valid:errors.length===0,errors,warnings,checkedSymbols:symbols.length,checkedWires:wires.length,
 disclaimer:'Nur Strukturprüfung. Keine Prüfung von Strombelastbarkeit, Schutzmaßnahmen, Normkonformität oder Anschlussbelegung.'};
}
const api={validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanValidation=api;
})(typeof globalThis!=='undefined'?globalThis:this);
