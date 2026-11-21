/* ElektroPlan SM: generic device templates, not manufacturer terminal assignments.
 * Terminal names and pole counts are placeholders requiring verification.
 */
(function(root){
'use strict';
const TEMPLATES=Object.freeze({
 'mcb-1p':{symbolKind:'mcb',manualTerminals:['1','2'],description:'Generic single-pole MCB'},
 'mcb-3p':{symbolKind:'mcb',manualTerminals:['1','2','3','4','5','6'],description:'Generic three-pole MCB'},
 'rcd-2p':{symbolKind:'rcd',manualTerminals:['1','2','N_IN','N_OUT'],description:'Generic two-pole RCD; neutral terminals unverified'},
 'rcd-4p':{symbolKind:'rcd',manualTerminals:['1','2','3','4','5','6','N_IN','N_OUT'],description:'Generic four-pole RCD; neutral terminals unverified'},
 'relay-coil':{symbolKind:'relay-coil',manualTerminals:['A1','A2'],description:'Generic relay coil'},
 'contact-no':{symbolKind:'contact-no',manualTerminals:['13','14'],description:'Generic normally-open auxiliary contact'},
 'contact-nc':{symbolKind:'contact-nc',manualTerminals:['21','22'],description:'Generic normally-closed auxiliary contact'},
 'fuse':{symbolKind:'fuse',manualTerminals:['1','2'],description:'Generic fuse'},
 'terminal':{symbolKind:'terminal',manualTerminals:['1'],description:'Generic terminal'}
});
function instantiate(name,id,x,y){
 const t=TEMPLATES[name];if(!t)throw Error('UNKNOWN_TEMPLATE');
 if(typeof id!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(id))throw Error('INVALID_ID');
 if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('INVALID_POSITION');
 return {id,x,y,symbolKind:t.symbolKind,manualTerminals:[...t.manualTerminals],terminalTypes:Object.fromEntries(t.manualTerminals.map(k=>[k,'UNKNOWN'])),templateId:name,terminalProvenance:'generic-unverified',terminalEvidence:{status:'generic-unverified'}};
}
const api={TEMPLATES,instantiate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanDeviceTemplates=api;
})(typeof globalThis!=='undefined'?globalThis:this);
