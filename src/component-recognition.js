/* ElektroPlan SM — component recognition workflow.
   Candidate labels are untrusted OCR/manual input, not manufacturer facts.
   A verified, reviewed source is required for terminal references. */
(function(root){
'use strict';
const evidence=(typeof module!=='undefined'&&module.exports)
 ? require('./manufacturer-evidence')
 : root.ElektroPlanManufacturerEvidence;
function clean(s){return typeof s==='string'?s.trim():''}
function prepareIdentification(input){
 const candidates=Array.isArray(input?.candidates)?input.candidates:[];
 const safe=candidates.filter(c=>c&&typeof c==='object').map(c=>({
  manufacturer:clean(c.manufacturer),model:clean(c.model),
  partNumber:clean(c.partNumber),origin:c.origin==='manual'?'manual':'ocr',
  confidence:Number.isFinite(c.confidence)&&c.confidence>=0&&c.confidence<=1?c.confidence:null
 })).filter(c=>c.manufacturer||c.model||c.partNumber);
 return {candidates:safe,status:safe.length?'identity_review_required':'identity_missing',
  terminalMappingAllowed:false,electricallyApproved:false};
}
function reviewCandidate(candidate,record){
 const identification=prepareIdentification({candidates:[candidate]});
 if(!identification.candidates.length)return {status:'identity_missing',terminalMappingAllowed:false,electricallyApproved:false};
 const c=identification.candidates[0],identity=record?.identity||{};
 const matches=c.manufacturer&&c.model&&c.partNumber
  &&c.manufacturer===identity.manufacturer&&c.model===identity.model
  &&c.partNumber===identity.partNumber;
 if(!matches)return {status:'identity_mismatch',terminalMappingAllowed:false,electricallyApproved:false};
 const result=evidence.assessManufacturerEvidence(record);
 return {status:result.usableForTerminalReference?'document_reviewed':'evidence_review_required',
  terminalMappingAllowed:result.usableForTerminalReference,electricallyApproved:false,
  errors:result.errors,warnings:result.warnings};
}
const api={prepareIdentification,reviewCandidate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.ElektroPlanRecognition=api;
})(typeof globalThis!=='undefined'?globalThis:this);
