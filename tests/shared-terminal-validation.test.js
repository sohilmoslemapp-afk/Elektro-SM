'use strict';
const assert=require('node:assert/strict');
const {validate}=require('../src/schematic-validation');
const symbols=[
 {id:'X1',type:'KLEMME',x:100,y:100,manualTerminals:['1','2']},
 {id:'K1',type:'KM',x:200,y:100,manualTerminals:['A1','A2']},
 {id:'F1',type:'LS',x:300,y:100,manualTerminals:['1','2']}
];
const project=wires=>({symbols,wires});
const one=validate(project([{a:'X1',fromTerminal:'1',b:'K1',toTerminal:'A1'}]));
assert.equal(one.valid,true);assert.ok(!one.warnings.some(w=>w.includes('Mehrfachbelegung')));
const two=validate(project([{a:'X1',fromTerminal:'1',b:'K1',toTerminal:'A1'},{a:'X1',fromTerminal:'1',b:'F1',toTerminal:'1'}]));
assert.equal(two.valid,true);assert.ok(two.warnings.some(w=>w.includes('X1 / 1')));
const invalid=validate(project([{a:'X1',fromTerminal:'9',b:'K1',toTerminal:'A1'}]));
assert.equal(invalid.valid,false);
console.log('Shared-terminal warnings and invalid terminal validation passed');
