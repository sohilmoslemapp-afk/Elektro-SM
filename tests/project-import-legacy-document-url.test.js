const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
function project(url){return {format:'ElektroPlan-SM-1',data:{name:'Legacy part URL',symbols:[],wires:[],parts:[{type:'SW',brand:'Example',model:'X',docTitle:'Manual',docUrl:url}]}}}
for(const url of ['', 'https://example.org/manual.pdf'])assert.equal(validateImport(project(url)).ok,true,url);
for(const url of ['https://user:password@example.org/manual','https://user@example.org/manual','https://','http://example.org/manual','javascript:alert(1)']){
 const result=validateImport(project(url));assert.equal(result.ok,false,url);
 assert.ok(result.errors.some(e=>e.includes('Dokument-URL')));
}
console.log('Legacy part document URL regression passed');
