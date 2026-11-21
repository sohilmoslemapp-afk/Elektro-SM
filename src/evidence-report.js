/* ElektroPlan SM — evidence coverage report. User-supplied document references are not independently verified. */
(function(root){
'use strict';
function report(project){
 const symbols=Array.isArray(project?.symbols)?project.symbols:[];
 const devices=symbols.map(s=>{
  const e=s.terminalEvidence||{status:'generic-unverified'};
  const terminals=Array.isArray(s.manualTerminals)?s.manualTerminals:[];
  const typed=terminals.filter(t=>s.terminalTypes?.[t]&&s.terminalTypes[t].toUpperCase()!=='UNKNOWN');
  const documented=e.status==='manufacturer-documented'&&!!(e.manufacturer&&e.model&&e.documentTitle&&e.documentUrl);
  return {id:s.id||'',status:e.status||'generic-unverified',terminalCount:terminals.length,typedCount:typed.length,documentReferenceSupplied:documented,terminalMappingVerified:false,reviewRequired:true};
 });
 return {deviceCount:devices.length,documentReferencesSupplied:devices.filter(d=>d.documentReferenceSupplied).length,untypedTerminals:devices.reduce((n,d)=>n+d.terminalCount-d.typedCount,0),terminalMappingsVerified:0,electricallyApproved:false,devices};
}
const api={report};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanEvidenceReport=api;
})(typeof globalThis!=='undefined'?globalThis:this);
