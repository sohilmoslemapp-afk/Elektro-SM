/* ElektroPlan SM — source-aware terminal metadata. Never infer verified pinout from a generic template. */
(function(root){
'use strict';
const statuses=Object.freeze(['generic-unverified','user-entered-unverified','manufacturer-documented']);
function safeUrl(url){try{const u=new URL(url);return u.protocol==='https:'&&!!u.hostname&&u.username===''&&u.password===''}catch(_){return false}}
function validate(metadata){
 const errors=[];
 if(!metadata||typeof metadata!=='object'||Array.isArray(metadata))return {valid:false,errors:['INVALID_METADATA']};
 if(!statuses.includes(metadata.status))errors.push('INVALID_STATUS');
 for(const k of ['manufacturer','model','articleNumber','documentTitle'])if(metadata[k]!==undefined&&(typeof metadata[k]!=='string'||metadata[k].length>180))errors.push('INVALID_'+k.toUpperCase());
 if(metadata.documentUrl!==undefined&&!safeUrl(metadata.documentUrl))errors.push('INVALID_DOCUMENT_URL');
 if(metadata.status==='manufacturer-documented'&&(!metadata.manufacturer?.trim()||!metadata.model?.trim()||!metadata.documentUrl||!metadata.documentTitle?.trim()))errors.push('MISSING_MANUFACTURER_EVIDENCE');
 return {valid:errors.length===0,errors};
}
function createGeneric(){return {status:'generic-unverified'}}
function apply(symbol,metadata){
 const result=validate(metadata);if(!result.valid)throw Error(result.errors.join(','));
 return {...symbol,terminalEvidence:{...metadata}};
}
const api={statuses,safeUrl,validate,createGeneric,apply};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanTerminalEvidence=api;
})(typeof globalThis!=='undefined'?globalThis:this);
