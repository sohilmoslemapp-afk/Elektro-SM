const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
function record(url){return {brand:'Example',model:'X1',documentUrl:url,documentTitle:'Datasheet',documentRevision:'1',checkedBy:'manual',checkedAt:'2026-11-20',sourceType:'manually-entered-unverified',terminalMapping:null,wiringApproved:false}}
function project(url){return {format:'ElektroPlan-SM-1',data:{name:'Source URL',symbols:[{id:'S1',type:'SW',x:0,y:0,partBrand:'Example',partModel:'X1',sourceRecord:record(url)}],wires:[],parts:[{type:'SW',brand:'Example',model:'X1',docTitle:'Datasheet',docUrl:url,sourceRecord:record(url)}]}}}
assert.equal(validateImport(project('https://example.org/datasheet.pdf')).ok,true);
for(const url of ['https://','https:// user','https://user:password@example.org/a','http://example.org/a','javascript:alert(1)','https://%']){
 const result=validateImport(project(url));
 assert.equal(result.ok,false,url);
 assert.ok(result.errors.length>0);
}
console.log('Imported evidence URL safety regression passed');
