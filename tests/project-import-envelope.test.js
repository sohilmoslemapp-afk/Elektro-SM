const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
const valid={format:'ElektroPlan-SM-1',data:{name:'Project',symbols:[],wires:[],parts:[]}};
assert.equal(validateImport(valid).ok,true);
const arrayEnvelope=Object.assign([],{format:valid.format,data:valid.data});
const arrayData=Object.assign([],{name:'Project',symbols:[],wires:[],parts:[]});
assert.equal(validateImport(arrayEnvelope).ok,false);
assert.equal(validateImport({...valid,data:arrayData}).ok,false);
console.log('Malformed project container shapes rejected');
