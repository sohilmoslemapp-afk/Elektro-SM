/* ElektroPlan SM — schematic model validation. Structural checks only, not electrical approval. */
(function(root){
'use strict';
const TYPES=new Set(['RCD','LS','SW','LAMP','KLEMME','KM','MSS','MOTOR']);
function validate(project){
 const errors=[],warnings=[],symbols=project?.symbols,wires=project?.wires;
 if(!Array.isArray(symbols)||!Array.isArray(wires))return {valid:false,errors:['Projektstruktur ungültig'],warnings};
 if(symbols.length>10000||wires.length>50000)return {valid:false,errors:['Projekt überschreitet Sicherheitsgrenzen'],warnings};
 const ids=new Set(),normalizedIds=new Set();
 const unsafeId=/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u;
 symbols.forEach((s,i)=>{
  if(!s||typeof s.id!=='string'||!s.id.trim()||s.id.length>100||s.id!==s.id.trim()||unsafeId.test(s.id))errors.push('Symbol '+i+': Kennung fehlt');
  else if(ids.has(s.id)||normalizedIds.has(s.id.normalize('NFC')))errors.push('Doppelte Symbolkennung: '+s.id);
  else {ids.add(s.id);normalizedIds.add(s.id.normalize('NFC'));}
  if(s?.manualTerminals!==undefined){
   if(!Array.isArray(s.manualTerminals)||s.manualTerminals.length>8)errors.push('Symbol '+i+': ungültige Klemmenliste');
   else {
    const terminals=new Set();
    for(const terminal of s.manualTerminals){
     if(typeof terminal!=='string'||!terminal.trim()||terminal!==terminal.trim()||terminal.length>40||unsafeId.test(terminal))errors.push('Symbol '+i+': ungültige Klemmenkennung');
     else if(terminals.has(terminal))errors.push('Symbol '+i+': doppelte Klemme '+terminal);
     else terminals.add(terminal);
    }
   }
  }
  if(!TYPES.has(s?.type))errors.push('Symbol '+i+': unbekannter Typ');
  if(!Number.isFinite(s?.x)||!Number.isFinite(s?.y)||Math.abs(s.x)>100000||Math.abs(s.y)>100000)errors.push('Symbol '+i+': ungültige Position');
 });
 const symbolById=new Map(symbols.filter(s=>s&&typeof s.id==='string').map(s=>[s.id,s]));
 const seen=new Set(),degree=new Map(),terminalConnections=new Map();
 wires.forEach((w,i)=>{
  if(!w||!ids.has(w.a)||!ids.has(w.b)){errors.push('Leitung '+i+': Endpunkt fehlt');return}
  if(w.a===w.b){errors.push('Leitung '+i+': Selbstverbindung');return}
  const from=symbolById.get(w.a),to=symbolById.get(w.b);
  if(!w.fromTerminal||!w.toTerminal)warnings.push('Leitung '+i+': Klemmenzuordnung unvollständig');
  for(const [terminal,symbol,side] of [[w.fromTerminal,from,'Start'],[w.toTerminal,to,'Ziel']]){
   if(terminal!==undefined&&terminal!==null&&terminal!==''&&(!Array.isArray(symbol?.manualTerminals)||!symbol.manualTerminals.includes(terminal)))errors.push('Leitung '+i+': '+side+'klemme nicht am Symbol erfasst');
  }
  const key=w.fromTerminal&&w.toTerminal?JSON.stringify([[w.a,w.fromTerminal],[w.b,w.toTerminal]].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))):null;
  if(key!==null){if(seen.has(key))warnings.push('Leitung '+i+': doppelte Verbindung');seen.add(key)}
  if(w.fromTerminal&&w.toTerminal){
   for(const [symbol,terminal] of [[w.a,w.fromTerminal],[w.b,w.toTerminal]]){
    const point=JSON.stringify([symbol,terminal]);terminalConnections.set(point,(terminalConnections.get(point)||0)+1);
   }
  }
  degree.set(w.a,(degree.get(w.a)||0)+1);degree.set(w.b,(degree.get(w.b)||0)+1);
 });
 for(const [point,count] of terminalConnections){if(count>1){const [id,terminal]=JSON.parse(point);warnings.push('Mehrfachbelegung prüfen: '+id+' / '+terminal+' ('+count+' Leitungen)')}}
 symbols.forEach(s=>{if(s?.id&&ids.has(s.id)&&!degree.has(s.id))warnings.push('Nicht verbunden: '+s.id)});
 return {valid:errors.length===0,errors,warnings,checkedSymbols:symbols.length,checkedWires:wires.length,
 disclaimer:'Nur Strukturprüfung. Keine Prüfung von Strombelastbarkeit, Schutzmaßnahmen, Normkonformität oder Anschlussbelegung.'};
}
const api={validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanValidation=api;
})(typeof globalThis!=='undefined'?globalThis:this);
