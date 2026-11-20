/* ElektroPlan SM: defensive import validation for locally stored projects. */
(function(root){'use strict';
const types=new Set(['RCD','LS','SW','LAMP','KLEMME']);
function validateImport(payload){
 const errors=[];
 if(!payload||payload.format!=='ElektroPlan-SM-1'||!payload.data||typeof payload.data!=='object')return {ok:false,errors:['Unbekanntes Projektformat']};
 const d=payload.data;
 if(!Array.isArray(d.symbols)||!Array.isArray(d.wires)||!Array.isArray(d.parts))return {ok:false,errors:['Projektlisten fehlen']};
 if(d.symbols.length>10000||d.wires.length>50000||d.parts.length>10000)errors.push('Projekt überschreitet Sicherheitsgrenzen');
 if(typeof d.name!=='string'||d.name.length>200)errors.push('Ungültiger Projektname');
 const ids=new Set();
 d.symbols.forEach((s,i)=>{
  if(!s||typeof s.id!=='string'||s.id.length>100||!s.id||ids.has(s.id))errors.push('Symbol '+i+': ungültige Kennung');
  else ids.add(s.id);
  if(!types.has(s?.type)||!Number.isFinite(s?.x)||!Number.isFinite(s?.y)||Math.abs(s.x)>100000||Math.abs(s.y)>100000)errors.push('Symbol '+i+': ungültige Daten');
 });
 d.wires.forEach((w,i)=>{if(!w||!ids.has(w.a)||!ids.has(w.b)||w.a===w.b)errors.push('Leitung '+i+': ungültige Endpunkte')});
 d.parts.forEach((p,i)=>{if(!p||!['type','brand','model','docTitle','docUrl'].every(k=>typeof p[k]==='string'&&p[k].length<=2000))errors.push('Bauteil '+i+': ungültige Daten');else if(p.docUrl){try{const u=new URL(p.docUrl);if(u.protocol!=='https:')throw Error()}catch{errors.push('Bauteil '+i+': ungültige Dokument-URL')}}});
 return {ok:errors.length===0,errors};
}
const api={validateImport};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanImport=api;
})(typeof globalThis!=='undefined'?globalThis:this);
