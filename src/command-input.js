/* Safe, explicit ElektroPlan commands in German, English and Arabic. */
(function(root){
'use strict';
const table=[
 {action:'save',phrases:['projekt speichern','speichern','save project','save','احفظ المشروع','حفظ المشروع','احفظ']},
 {action:'check',phrases:['struktur prüfen','plan prüfen','prüfen','check structure','check diagram','validate','افحص المخطط','فحص المخطط','افحص']},
 {action:'terminal',phrases:['klemmleiste hinzufügen','klemmleiste x hinzufügen','add terminal strip','add x terminal strip','أضف شريط بورنات','اضف شريط بورنات','إضافة شريط بورنات']},
 {action:'wire',phrases:['leitung verbinden','draht verbinden','connect wire','wire mode','وصل سلك','توصيل سلك','وصل الأسلاك']},
 {action:'undo',phrases:['rückgängig','undo','تراجع']},
 {action:'redo',phrases:['wiederholen','redo','إعادة']},
 {action:'exportSvg',phrases:['svg exportieren','export svg','تصدير svg']},
 {action:'exportTerminal',phrases:['klemmenplan csv','export terminal schedule','تصدير جدول البورنات']},
 {action:'addRcd',phrases:['fi hinzufügen','rcd hinzufügen','add rcd','أضف قاطع تفاضلي','اضف قاطع تفاضلي']},
 {action:'addLs',phrases:['ls hinzufügen','leitungsschutz hinzufügen','add circuit breaker','add ls','أضف قاطع ls','اضف قاطع ls']},
 {action:'addLamp',phrases:['leuchte hinzufügen','add lamp','أضف مصباح','اضف مصباح']}
];
function normalize(value){return String(value??'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ـ/g,'').replace(/[.,!?؟؛:]+/g,' ').replace(/\s+/g,' ').trim()}
function parse(value){const normalized=normalize(value);if(!normalized||normalized.length>120)return {action:null,reason:'unsupported'};for(const item of table)if(item.phrases.some(p=>normalize(p)===normalized))return {action:item.action};return {action:null,reason:'unsupported'}}
const api={parse,normalize,actions:table.map(x=>x.action)};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanCommands=api;
})(typeof globalThis!=='undefined'?globalThis:this);
