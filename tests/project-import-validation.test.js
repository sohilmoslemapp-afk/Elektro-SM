'use strict';
const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation.js');
const valid={format:'ElektroPlan-SM-1',data:{name:'Test',symbols:[{id:'a',type:'LS',x:10,y:20},{id:'b',type:'LAMP',x:20,y:30}],wires:[{a:'a',b:'b'}],parts:[]}};
assert.equal(validateImport(valid).ok,true);
assert.equal(validateImport({}).ok,false);
assert.equal(validateImport({...valid,data:{...valid.data,symbols:[valid.data.symbols[0],valid.data.symbols[0]]}}).ok,false);
assert.equal(validateImport({...valid,data:{...valid.data,wires:[{a:'a',b:'missing'}]}}).ok,false);
assert.equal(validateImport({...valid,data:{...valid.data,symbols:[{id:'a',type:'LS',x:Infinity,y:0}]}}).ok,false);
assert.equal(validateImport({...valid,data:{...valid.data,parts:[{type:'LS',brand:'A',model:'B',docTitle:'',docUrl:'javascript:alert(1)'}]}}).ok,false);
assert.equal(validateImport({...valid,data:{...valid.data,symbols:Array(10001).fill({id:'x',type:'LS',x:0,y:0})}}).ok,false);
const withManualReference={...valid,data:{...valid.data,symbols:[{...valid.data.symbols[0],partBrand:'Test Hersteller',partModel:'TEST-123'},valid.data.symbols[1]]}};
assert.equal(validateImport(withManualReference).ok,true,'manual manufacturer and model metadata should import');
for(const invalid of [{partBrand:42},{partModel:null},{partBrand:'X'.repeat(201)},{partModel:'Y'.repeat(201)}]){
 const payload={...valid,data:{...valid.data,symbols:[{...valid.data.symbols[0],...invalid},valid.data.symbols[1]]}};
 assert.equal(validateImport(payload).ok,false,'malformed manual component metadata should be rejected');
}
const withManualTerminals={...valid,data:{...valid.data,symbols:[{...valid.data.symbols[0],manualTerminals:['1','2','A1','A2']},valid.data.symbols[1]]}};
assert.equal(validateImport(withManualTerminals).ok,true,'manually entered terminals should import');
for(const terminals of [['A1','A1'],[''],['x'.repeat(41)],Array(65).fill('A1'),'A1', [123]]){
 const payload={...valid,data:{...valid.data,symbols:[{...valid.data.symbols[0],manualTerminals:terminals},valid.data.symbols[1]]}};
 assert.equal(validateImport(payload).ok,false,'invalid manual terminal labels must be rejected');
}
console.log('Project import validation: 7 assertions passed.');
