const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
function evidence(date){return {brand:'Example',model:'X1',documentUrl:'https://example.org/d.pdf',documentTitle:'Datasheet',documentRevision:'1',checkedBy:'Reviewer',checkedAt:date,sourceType:'manually-entered-unverified',terminalMapping:null,wiringApproved:false}}
function project(date){const r=evidence(date);return {format:'ElektroPlan-SM-1',data:{name:'Date check',symbols:[{id:'X1',type:'SW',x:0,y:0,partBrand:'Example',partModel:'X1',sourceRecord:r}],wires:[],parts:[{type:'SW',brand:'Example',model:'X1',docTitle:'Datasheet',docUrl:r.documentUrl,sourceRecord:r}]}}}
for(const date of ['2024-02-29','2026-11-20'])assert.equal(validateImport(project(date)).ok,true,date);
for(const date of ['2025-02-29','2026-02-30','2026-13-01','2026-00-12','2026-11-31']){
 const result=validateImport(project(date));assert.equal(result.ok,false,date);
 assert.ok(result.errors.some(e=>e.includes('Quellenbeleg')));
 assert.ok(result.errors.some(e=>e.includes('Quellendossier')));
}
console.log('Source evidence calendar date regression passed');
