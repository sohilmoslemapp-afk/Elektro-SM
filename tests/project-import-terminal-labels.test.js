const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
function payload(terminals){return {format:'ElektroPlan-SM-1',data:{name:'Terminal import',symbols:[{id:'X1',type:'KLEMME',x:0,y:0,manualTerminals:terminals}],wires:[],parts:[]}}}
assert.equal(validateImport(payload(['A1','A2'])).ok,true);
for(const terminals of [['A1',' A1'],['A1','A1 '],['A1','A\\u200b1'],['A1','A\\u202e1'],['é','e\\u0301']]){
 const actual=terminals.map(x=>x.replace(/\\\\u([0-9a-f]{4})/gi,(_,n)=>String.fromCharCode(parseInt(n,16))));
 const result=validateImport(payload(actual));
 assert.equal(result.ok,false,JSON.stringify(actual));
 assert.ok(result.errors.some(e=>e.includes('Klemmenbezeichnungen')));
}
console.log('Manual terminal import safety regression passed');
