/* ElektroPlan SM: optional on-device text extraction.
   Browser TextDetector is experimental and not universally available.
   OCR output is unverified and MUST NOT authorize terminal assignments. */
(function(root){
'use strict';
function support(environment){
 const Detector=environment&&environment.TextDetector;
 return typeof Detector==='function';
}
async function readImageText(image,environment){
 const env=environment||root;
 if(!support(env))return {status:'unsupported',lines:[],verified:false,
  message:'Automatische Texterkennung in diesem Browser nicht verfügbar. Hersteller und Modell manuell eingeben.'};
 if(!image)return {status:'invalid_image',lines:[],verified:false,
  message:'Kein Bild zur Texterkennung vorhanden.'};
 try{
  const detector=new env.TextDetector();
  const blocks=await detector.detect(image);
  const lines=Array.isArray(blocks)?blocks.map(b=>typeof b.rawValue==='string'?b.rawValue.trim():'').filter(Boolean):[];
  return {status:lines.length?'review_required':'no_text',lines,verified:false,
   message:lines.length?'Bildtext erkannt – Hersteller und Modell manuell prüfen. Keine Anschlussfreigabe.':'Kein lesbarer Bildtext erkannt.'};
 }catch(e){
  return {status:'error',lines:[],verified:false,
   message:'Texterkennung fehlgeschlagen – bitte manuell eingeben.'};
 }
}
const api={support,readImageText};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanImageText=api;
})(typeof globalThis!=='undefined'?globalThis:this);
