'use strict';
const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
const base=()=>({format:'ElektroPlan-SM-1',data:{name:'Schaltplan',symbols:[{id:'X1',type:'KLEMME',x:100,y:120,stripLabel:'X1',manualTerminals:['1','2','N','PE']}],wires:[],parts:[]}});
assert.equal(validateImport(base()).ok,true);
for(const change of [
 s=>s.stripLabel='X2',
 s=>s.stripLabel='x1',
 s=>s.stripLabel='X0',
 s=>s.stripLabel='X1\u202e',
 s=>s.type='LS',
 s=>s.stripLabel=22
]){const p=base();change(p.data.symbols[0]);assert.equal(validateImport(p).ok,false,JSON.stringify(p.data.symbols[0]))}
const legacy=base();delete legacy.data.symbols[0].stripLabel;assert.equal(validateImport(legacy).ok,true);
const duplicate=base();duplicate.data.symbols.push({id:'Y2',type:'KLEMME',x:300,y:120,stripLabel:'X1',manualTerminals:['1']});assert.equal(validateImport(duplicate).ok,false);
console.log('Terminal-strip import validation and legacy compatibility passed');
