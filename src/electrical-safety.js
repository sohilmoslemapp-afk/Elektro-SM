/* ElektroPlan SM — conservative conductor/terminal safety validation.
   No electrical installation approval. Pure logic, works in browsers and Node. */
(function(root){
'use strict';
const TYPES=['L1','L2','L3','N','PE','PEN','PA','UNKNOWN'];
function normalize(x){return typeof x==='string'?x.trim().toUpperCase():'UNKNOWN'}
function terminalType(x){const v=normalize(x);if(TYPES.includes(v))return v;if(/^(PE|PE[-_ ]?[0-9]+)$/.test(v))return 'PE';if(/^(N|N[-_ ]?[0-9]+)$/.test(v))return 'N';if(/^L[123]([_-][0-9]+)?$/.test(v))return v.slice(0,2);return 'UNKNOWN'}
function checkConductor(a,b,options){
 const left=terminalType(a),right=terminalType(b),issues=[];
 if(left==='UNKNOWN'||right==='UNKNOWN')issues.push({code:'UNVERIFIED_TERMINAL',severity:'review',message:'Terminal function unknown; verify documentation'});
 if((left==='N'&&right==='PE')||(left==='PE'&&right==='N'))issues.push({code:'N_PE_MISMATCH',severity:'error',message:'Neutral N and protective earth PE must not be interchanged'});
 if((left==='PE'&&['L1','L2','L3'].includes(right))||(right==='PE'&&['L1','L2','L3'].includes(left)))issues.push({code:'PHASE_PE_MISMATCH',severity:'error',message:'Phase conductor cannot be connected to PE'});
 if((left==='N'&&['L1','L2','L3'].includes(right))||(right==='N'&&['L1','L2','L3'].includes(left)))issues.push({code:'PHASE_N_MISMATCH',severity:'error',message:'Phase conductor cannot be directly connected to N'});
 if((left==='PEN'||right==='PEN'||left==='PA'||right==='PA'))issues.push({code:'SPECIAL_EARTHING_REVIEW',severity:'review',message:'PEN/PA requires system-specific review'});
 return {valid:!issues.some(x=>x.severity==='error'),left,right,issues};
}
function validateConnections(connections){
 if(!Array.isArray(connections))throw Error('connections_must_be_array');
 const issues=[];
 connections.forEach((edge,index)=>{if(!edge||typeof edge!=='object')throw Error('invalid_connection');const r=checkConductor(edge.fromType,edge.toType);r.issues.forEach(issue=>issues.push({...issue,index}))});
 return {valid:!issues.some(x=>x.severity==='error'),issues};
}
const api={terminalType,checkConductor,validateConnections};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanElectricalSafety=api;
})(typeof globalThis!=='undefined'?globalThis:this);
