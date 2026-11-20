'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('prototypes/ElektroPlan-SM-integriert.html','utf8');
const ids=['drawing','symbols','wires','projectName','wireMode','deleteSelected','checkDiagram','checkPlan','savePlan','exportSvg','exportPng','exportBom','exportWireList','undoEdit','redoEdit','addPart','partList','searchParts','partResults','takePhoto','choosePhoto','preview','exportJson','importJson'];
for(const id of ids)assert.match(html,new RegExp('\\bid="'+id+'"'), 'Missing required UI element '+id);
for(const path of ['../src/schematic-validation.js','../src/project-import-validation.js','../src/terminal-graph.js']){
 assert.ok(html.includes('src="'+path+'"'),'Missing dependency '+path);
 assert.ok(fs.existsSync('prototypes/'+path),'Dependency does not exist '+path);
}
const scripts=html.split('<script>').slice(1).map(block=>block.split('</script>')[0]);
assert.equal(scripts.length,1,'Exactly one inline application script expected');
new vm.Script(scripts[0],{filename:'ElektroPlan-SM-integriert.html'});
for(const id of ids.filter(x=>!['drawing','symbols','wires','projectName','preview','partList','partResults'].includes(x))){
 assert.ok(scripts[0].includes("'"+id+"'"),'UI action not referenced in application '+id);
}
assert.match(scripts[0],/undoStack\.length=0;redoStack\.length=0;lastSnapshot=JSON\.stringify\(data\)/,'Import must reset undo history');
assert.match(scripts[0],/wireStart=null;wireMode=false;drag=null/,'Import must reset connection and drag state');
assert.match(html,/Keine automatische Bilderkennung/,'Do not falsely advertise image recognition');
assert.match(html,/keine realen Ger[aä]teklemmen/,'Schematic terminal disclaimer required');
assert.match(html,/keine verifizierten Anschlussklemmen/,'CSV export disclaimer required');
console.log('Integrated UI contract: element/dependency/action/safety checks passed (static; not a browser run).');
