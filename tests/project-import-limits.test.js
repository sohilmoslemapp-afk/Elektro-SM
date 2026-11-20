const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
const payload={format:'ElektroPlan-SM-1',data:{name:'Large',symbols:Array(10001).fill(null),wires:[],parts:[]}};
const result=validateImport(payload);
assert.equal(result.ok,false);
assert.deepEqual(result.errors,['Projekt überschreitet Sicherheitsgrenzen']);
console.log('Oversized project import rejected before per-item validation');
