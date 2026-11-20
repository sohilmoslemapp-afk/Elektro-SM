const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
function payload(terminals){return {format:'ElektroPlan-SM-1',data:{name:'Terminal import',symbols:[{id:'X1',type:'KLEMME',x:0,y:0,manualTerminals:terminals}],wires:[],parts:[]}}}
assert.equal(validateImport(payload(['A1','A2'])).ok,true);
const cases=[['A1',' A1'],['A1','A1 '],['A1','A'+String.fromCharCode(0x200b)+'1'],['A1','A'+String.fromCharCode(0x202e)+'1'],['é','e'+String.fromCharCode(0x0301)]];
for(const terminals of cases){
 const result=validateImport(payload(terminals));
 assert.equal(result.ok,false,JSON.stringify(terminals));
 assert.ok(result.errors.some(e=>e.includes('Klemmenbezeichnungen')));
}
console.log('Manual terminal import safety regression passed');
