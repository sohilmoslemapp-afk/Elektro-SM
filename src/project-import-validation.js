/* ElektroPlan SM: defensive import validation for locally stored projects. */
(function(root){'use strict';
const types=new Set(['RCD','LS','SW','LAMP','KLEMME']);
function validSource(r,brand,model){return r===null||!!(r&&typeof r==='object'&&['brand','model','documentUrl','documentTitle','documentRevision','checkedBy','checkedAt'].every(k=>typeof r[k]==='string'&&r[k].length<=2000)&&r.brand===brand&&r.model===model&&r.sourceType==='manually-entered-unverified'&&r.terminalMapping===null&&r.wiringApproved===false&&/^\d{4}-\d{2}-\d{2}$/.test(r.checkedAt)&&r.checkedBy.trim()&&r.documentUrl.startsWith('https://'))}

function validateImport(payload){
 const errors=[];
 if(!payload||payload.format!=='ElektroPlan-SM-1'||!payload.data||typeof payload.data!=='object')return {ok:false,errors:['Unbekanntes Projektformat']};
 const d=payload.data;
 if(!Array.isArray(d.symbols)||!Array.isArray(d.wires)||!Array.isArray(d.parts))return {ok:false,errors:['Projektlisten fehlen']};
 if(d.symbols.length>10000||d.wires.length>50000||d.parts.length>10000)errors.push('Projekt überschreitet Sicherheitsgrenzen');
 if(typeof d.name!=='string'||d.name.length>200)errors.push('Ungültiger Projektname');
 const ids=new Set(),normalizedIds=new Set();
 const unsafeId=/[\\u0000-\\u001f\\u007f-\\u009f\\u200b-\\u200f\\u202a-\\u202e\\u2060-\\u2069\\ufeff]/u;
 d.symbols.forEach((s,i)=>{
  if(!s||typeof s.id!=='string'||s.id.length>100||!s.id||s.id!==s.id.trim()||unsafeId.test(s.id)||ids.has(s.id)||normalizedIds.has(s.id.normalize('NFC')))errors.push('Symbol '+i+': ungültige Kennung');
  else {ids.add(s.id);normalizedIds.add(s.id.normalize('NFC'));}
  if(!types.has(s?.type)||!Number.isFinite(s?.x)||!Number.isFinite(s?.y)||Math.abs(s.x)>100000||Math.abs(s.y)>100000)errors.push('Symbol '+i+': ungültige Daten');
  if(['partBrand','partModel'].some(k=>s?.[k]!==undefined&&(typeof s[k]!=='string'||s[k].length>200)))errors.push('Symbol '+i+': ungültige Bauteilreferenz');
  if(s?.sourceRecord!==undefined&&!validSource(s.sourceRecord,s.partBrand,s.partModel))errors.push('Symbol '+i+': ungültiger Quellenbeleg');
  if(s?.manualTerminals!==undefined&&(!Array.isArray(s.manualTerminals)||s.manualTerminals.length>64||s.manualTerminals.some(t=>typeof t!=='string'||!t.trim()||t.length>40)||new Set(s.manualTerminals).size!==s.manualTerminals.length))errors.push('Symbol '+i+': ungültige manuelle Klemmenbezeichnungen');
 });
 d.wires.forEach((w,i)=>{if(!w||!ids.has(w.a)||!ids.has(w.b)||w.a===w.b)errors.push('Leitung '+i+': ungültige Endpunkte');if(w&&(w.fromTerminal!==undefined||w.toTerminal!==undefined)){const source=d.symbols.find(s=>s.id===w.a),target=d.symbols.find(s=>s.id===w.b);if(typeof w.fromTerminal!=='string'||typeof w.toTerminal!=='string'||!source?.manualTerminals?.includes(w.fromTerminal)||!target?.manualTerminals?.includes(w.toTerminal))errors.push('Leitung '+i+': Klemmenbezeichnung nicht im Bauteil vorhanden')}});
 d.parts.forEach((p,i)=>{if(!p||!['type','brand','model','docTitle','docUrl'].every(k=>typeof p[k]==='string'&&p[k].length<=2000))errors.push('Bauteil '+i+': ungültige Daten');if(p?.sourceRecord!==undefined){const r=p.sourceRecord;if(!r||typeof r!=='object'||!['brand','model','documentUrl','documentTitle','documentRevision','checkedBy','checkedAt'].every(k=>typeof r[k]==='string'&&r[k].length<=2000)||r.brand!==p.brand||r.model!==p.model||r.documentUrl!==p.docUrl||r.documentTitle!==p.docTitle||r.sourceType!=='manually-entered-unverified'||r.terminalMapping!==null||r.wiringApproved!==false||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(r.checkedAt)||!r.checkedBy.trim())errors.push('Bauteil '+i+': ungültiges oder nicht verifiziertes Quellendossier')}else if(p.docUrl){try{const u=new URL(p.docUrl);if(u.protocol!=='https:')throw Error()}catch{errors.push('Bauteil '+i+': ungültige Dokument-URL')}}});
 return {ok:errors.length===0,errors};
}
const api={validateImport};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanImport=api;
})(typeof globalThis!=='undefined'?globalThis:this);
