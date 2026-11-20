/* ElektroPlan SM V134: provenance records; never infer electrical terminals. */
(function(root){
'use strict';
function clean(v){return typeof v==='string'?v.trim():'';}
function validHttps(url){try{const u=new URL(url);return u.protocol==='https:'&&!!u.hostname;}catch{return false;}}
function createReference(input){
 const brand=clean(input?.brand),model=clean(input?.model),documentUrl=clean(input?.documentUrl);
 const documentTitle=clean(input?.documentTitle),documentRevision=clean(input?.documentRevision);
 const checkedBy=clean(input?.checkedBy),checkedAt=clean(input?.checkedAt);
 const errors=[];
 if(!brand||!model)errors.push('Hersteller und Modell sind erforderlich');
 if(!validHttps(documentUrl))errors.push('Gültige HTTPS-Quelle erforderlich');
 if(!documentTitle)errors.push('Dokumenttitel fehlt');
 if(!checkedBy||!/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)||Number.isNaN(Date.parse(checkedAt+'T00:00:00Z')))errors.push('Prüfer und Prüfdatum erforderlich');
 const record={brand,model,documentUrl,documentTitle,documentRevision,checkedBy,checkedAt,
 sourceType:'manually-entered-unverified',terminalMapping:null,wiringApproved:false,
 note:'Quellenangabe ist keine Prüfung der Herstelleridentität oder Anschlussbelegung.'};
 return {valid:errors.length===0,errors,record};
}
const api={createReference,validHttps};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanV134=api;
})(typeof globalThis!=='undefined'?globalThis:this);
