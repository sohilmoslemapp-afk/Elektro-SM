/* ElektroPlan SM — terminal-strip metadata, not manufacturer-certified.
   Names are explicit project labels, not verified electrical pin assignments. */
(function(root){
'use strict';
const unsafe=/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/u;
function createStrip(id,terminals,x,y){
 if(typeof id!=='string'||!/^X[1-9][0-9]{0,3}$/.test(id)||!Array.isArray(terminals)||terminals.length<1||terminals.length>8)throw Error('Ungültige Klemmleiste');
 if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>100000||Math.abs(y)>100000)throw Error('Ungültige Position');
 const names=new Set();
 for(const t of terminals){if(typeof t!=='string'||!t.trim()||t!==t.trim()||t.length>40||unsafe.test(t)||names.has(t.normalize('NFC')))throw Error('Ungültige Klemmenbezeichnung');names.add(t.normalize('NFC'))}
 return {id,type:'KLEMME',x,y,manualTerminals:terminals.slice(),stripLabel:id};
}
const api={createStrip};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanTerminalStrip=api;
})(typeof globalThis!=='undefined'?globalThis:this);
