'use strict';
const assert=require('node:assert/strict');
const {validate}=require('../src/schematic-validation');
const base=terminals=>({symbols:[{id:'S1',type:'KM',x:100,y:100,manualTerminals:terminals}],wires:[]});
assert.equal(validate(base(['1','2','3','4','5','6','A1','A2'])).valid,true);
for(const bad of [['1','1'],['1',''],['1',' 2'],['1','2\n3'],Array.from({length:9},(_,i)=>String(i))]){
 const result=validate(base(bad));assert.equal(result.valid,false,JSON.stringify(bad));
}
assert.equal(validate(base('1,2')).valid,false);
assert.equal(validate(base(['1',42])).valid,false);
console.log('Schematic manual terminal validation passed');
