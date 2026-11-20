/* ElektroPlan SM — manufacturer evidence gate.
   An image or OCR guess is never proof of electrical terminal assignments.
   No function in this module grants electrical safety approval. */
(function(root){
'use strict';
function nonempty(s){return typeof s==='string' && s.length<=2000 && s.trim().length>0 && s===s.trim();}
function validDocumentUrl(value){if(!nonempty(value))return false;try{const url=new URL(value);return url.protocol==='https:'&&!!url.hostname&&!url.username&&!url.password;}catch{return false;}}
function validReviewDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value;}
function assessManufacturerEvidence(record){
 const errors=[],warnings=[];
 if(!record||typeof record!=='object'||Array.isArray(record)){
  return {usableForTerminalReference:false,reviewRequired:true,electricallyApproved:false,errors:['Ungültiger Bauteildatensatz'],warnings};
 }
 const identity=record.identity||{}, evidence=record.evidence||{}, terminals=record.terminals;
 if(!nonempty(identity.manufacturer))errors.push('Hersteller fehlt');
 if(!nonempty(identity.model))errors.push('Modellbezeichnung fehlt');
 if(!nonempty(identity.partNumber))errors.push('Artikelnummer fehlt – eindeutige Zuordnung nicht möglich');
 if(nonempty(evidence.documentPartNumber)&&nonempty(identity.partNumber)&&evidence.documentPartNumber!==identity.partNumber)errors.push('Artikelnummer stimmt nicht mit dem Herstellerdokument überein');
 if(!nonempty(evidence.documentPartNumber))errors.push('Artikelnummer im Dokument nicht erfasst');
 if(!nonempty(evidence.documentTitle))errors.push('Herstellerdokument fehlt');
 if(!validDocumentUrl(evidence.documentUrl))errors.push('Gültiger HTTPS-Dokumentlink fehlt');
 if(!nonempty(evidence.documentRevision))errors.push('Dokumentversion fehlt');
 if(!nonempty(evidence.pageReference))errors.push('Seiten- oder Abschnittsreferenz fehlt');
 if(evidence.publisherVerified!==true)errors.push('Herausgeber nicht als Hersteller verifiziert');
 if(!nonempty(evidence.publisherReviewReference))errors.push('Nachweis der Herausgeberprüfung fehlt');
 if(evidence.modelMatchVerified!==true)errors.push('Modellzuordnung nicht verifiziert');
 if(!nonempty(evidence.modelReviewReference))errors.push('Nachweis der Modellzuordnung fehlt');
 if(evidence.terminalMappingReviewed!==true)errors.push('Anschlusszuordnung nicht fachlich geprüft');
 if(!nonempty(evidence.reviewer))errors.push('Fachprüfer fehlt');
 if(!validReviewDate(evidence.reviewDate))errors.push('Prüfdatum fehlt oder ist ungültig');
 if(!Array.isArray(terminals)||terminals.length===0)errors.push('Keine dokumentierten Anschlüsse');
 else if(terminals.length>256)errors.push('Zu viele dokumentierte Anschlüsse');
 else{
  const names=new Set();
  terminals.slice(0,256).forEach((t,i)=>{
   if(!t||!nonempty(t.name)||!nonempty(t.function)||!nonempty(t.sourceReference)){
    errors.push('Anschluss '+i+': Name, Funktion oder Quellenverweis fehlt');return;
   }
   const name=t.name.normalize('NFC');
   if(names.has(name))errors.push('Doppelter Anschluss: '+t.name);
   names.add(name);
  });
 }
 const usableForTerminalReference=errors.length===0;
 return {usableForTerminalReference,reviewRequired:!usableForTerminalReference||warnings.length>0,verificationMethod:'manual-record-only',manufacturerApiVerified:false,
  electricallyApproved:false,errors,warnings,
  disclaimer:'Prüfvermerke sind manuell erfasst und nicht automatisch bei Herstellern bestätigt. Keine elektrische Sicherheitsprüfung oder Freigabe.'};
}
const api={assessManufacturerEvidence,validDocumentUrl,validReviewDate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanManufacturerEvidence=api;
})(typeof globalThis!=='undefined'?globalThis:this);
