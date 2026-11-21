const assert=require('node:assert/strict');
const lib=require('../src/device-templates.js');
const editor=require('../src/schematic-editor.js');
for(const [key,t] of Object.entries(lib.TEMPLATES)){
 const s=lib.instantiate(key,'X1',100,200);
 assert.equal(s.symbolKind,t.symbolKind);
 assert.deepEqual(s.manualTerminals,t.manualTerminals);
 assert.equal(s.terminalProvenance,'generic-unverified');
 assert.equal(new Set(s.manualTerminals).size,s.manualTerminals.length);
 assert.ok(s.manualTerminals.every(term=>s.terminalTypes[term]==='UNKNOWN'));
 assert.equal(editor.valid({version:1,symbols:[s],wires:[]}),true);
}
assert.throws(()=>lib.instantiate('missing','X1',0,0));
assert.throws(()=>lib.instantiate('mcb-1p','bad id',0,0));
console.log('Device template validation passed');
