/* ElektroPlan SM — manufacturer evidence gate.
   An image or OCR guess is never proof of electrical terminal assignments.
   No function in this module grants electrical safety approval. */
(function(root){
'use strict';
function nonempty(s){return typeof s==='string' && s.trim().length>0 && s===s.trim();}
function validDocumentUrl(value){if(!nonempty(value))return false;try{const url=new URL(value);return url.protocol==='https:'&&!!url.hostname&&!url.username&&!url.password;}catch{return false;}}
function assessManufacturerEvidence(record){
 const errors=[],warnings=[];
 if(!record||typeof record!=='object'||Array.isArray(record)){
  return {usableForTerminalReference:false,reviewRequired:true,electricallyApproved:false,errors:['Ungültiger Bauteildatensatz'],warnings};
 }
 const identity=record.identity||{}, evidence=record.evidence||{}, terminals=record.terminals;
 if(!nonempty(identity.manufacturer))errors.push('Hersteller fehlt');
 if(!nonempty(identity.model))errors.push('Modellbezeichnung fehlt');
 if(!nonempty(identity.partNumber))warnings.push('Artikelnummer fehlt – Identität fachlich prüfen');
 if(!nonempty(evidence.documentTitle))errors.push('Herstellerdokument fehlt');
 if(!validDocumentUrl(evidence.documentUrl))errors.push('Gültiger HTTPS-Dokumentlink fehlt');
 if(!nonempty(evidence.documentRevision))errors.push('Dokumentversion fehlt');
 if(!nonempty(evidence.pageReference))errors.push('Seiten- oder Abschnittsreferenz fehlt');
 if(evidence.publisherVerified!==true)errors.push('Herausgeber nicht als Hersteller verifiziert');
 if(evidence.modelMatchVerified!==true)errors.push('Modellzuordnung nicht verifiziert');
 if(evidence.terminalMappingReviewed!==true)errors.push('Anschlusszuordnung nicht fachlich geprüft');
 if(!Array.isArray(terminals)||terminals.length===0)errors.push('Keine dokumentierten Anschlüsse');
 else{
  const names=new Set();
  terminals.forEach((t,i)=>{
   if(!t||!nonempty(t.name)||!nonempty(t.function)||!nonempty(t.sourceReference)){
    errors.push('Anschluss '+i+': Name, Funktion oder Quellenverweis fehlt');return;
   }
   const name=t.name.normalize('NFC');
   if(names.has(name))errors.push('Doppelter Anschluss: '+t.name);
   names.add(name);
  });
 }
 const usableForTerminalReference=errors.length===0;
 return {usableForTerminalReference,reviewRequired:!usableForTerminalReference||warnings.length>0,
  electricallyApproved:false,errors,warnings,
  disclaimer:'Dokumentierte Anschlussreferenz, keine elektrische Sicherheitsprüfung oder Freigabe.'};
}
const api={assessManufacturerEvidence,validDocumentUrl};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanManufacturerEvidence=api;
})(typeof globalThis!=='undefined'?globalThis:this);
