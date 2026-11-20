'use strict';
const assert=require('node:assert/strict');
const {inspect}=require('../src/schematic-layout-audit');
const project={symbols:[{id:'K1',x:100,y:100},{id:'F1',x:150,y:110},{id:'H1',x:300,y:200},{id:'X1',x:800,y:300}]};
const result=inspect(project);
assert.equal(result.approved,false);
assert.ok(result.warnings.some(w=>w.kind==='symbol-overlap'&&w.first==='K1'&&w.second==='F1'));
assert.ok(result.warnings.some(w=>w.kind==='outside-editor'&&w.first==='X1'));
assert.ok(!result.warnings.some(w=>w.first==='H1'));
assert.deepEqual(inspect({symbols:[{id:'A',x:100,y:100},{id:'B',x:186,y:100}]}).warnings,[]);
assert.deepEqual(inspect({symbols:[]}).warnings,[]);
console.log('Schematic layout overlap and editor-bound checks passed');

const malformed=inspect({symbols:[{id:'BAD',x:NaN,y:120},{id:'GOOD',x:120,y:120},{id:'MISSING',x:100},{id:'INF',x:Infinity,y:150}]});
assert.deepEqual(malformed.warnings.filter(w=>w.kind==='invalid-position').map(w=>w.first),['BAD','MISSING','INF'],'Invalid coordinates must be reported deterministically');
assert.ok(!malformed.warnings.some(w=>w.kind==='symbol-overlap'),'Invalid positions must not produce false overlap warnings');
