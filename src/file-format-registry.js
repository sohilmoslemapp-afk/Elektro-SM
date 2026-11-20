/* File compatibility registry. Detection is not proof of parse/export support. */
(function(root){'use strict';
const entries=[
 {id:'native',extensions:['.epsm.json'],kind:'project',import:'supported',export:'supported'},
 {id:'json',extensions:['.json'],kind:'data',import:'conditional',export:'conditional'},
 {id:'svg',extensions:['.svg'],kind:'vector',import:'unsupported',export:'supported'},
 {id:'csv',extensions:['.csv'],kind:'data',import:'unsupported',export:'supported'},
 {id:'pdf',extensions:['.pdf'],kind:'document',import:'unsupported',export:'conditional'},
 {id:'dxf',extensions:['.dxf'],kind:'cad',import:'planned',export:'planned'},
 {id:'dwg',extensions:['.dwg'],kind:'cad',import:'planned',export:'planned'},
 {id:'dgn',extensions:['.dgn'],kind:'cad',import:'planned',export:'planned'},
 {id:'aml',extensions:['.aml'],kind:'engineering',import:'planned',export:'planned'},
 {id:'edz',extensions:['.edz'],kind:'vendor',import:'planned',export:'planned'},
 {id:'unknown',extensions:[],kind:'unknown',import:'unsupported',export:'unsupported'}
];
function detect(name){
 if(typeof name!=='string'||!name.trim())return entries[entries.length-1];
 const clean=name.trim().split(/[\\/]/).pop().toLowerCase().split(/[?#]/)[0];
 return entries.slice(0,-1).find(e=>e.extensions.some(ext=>clean.endsWith(ext)))||entries[entries.length-1];
}
function capabilities(name){const e=detect(name);return {format:e.id,kind:e.kind,import:e.import,export:e.export,detected:e.id!=='unknown',note:'Dateiendung allein bestätigt weder Dateiinhalt noch sichere Konvertierung.'};}
const api={detect,capabilities,entries:entries.map(e=>({...e,extensions:[...e.extensions]}))};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanFormatRegistry=api;
})(typeof globalThis!=='undefined'?globalThis:this);
