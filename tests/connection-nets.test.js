'use strict';
const assert=require('node:assert/strict');
const {analyze}=require('../src/connection-nets');
const project={symbols:[{id:'X1',manualTerminals:['1','2','N']},{id:'F1',manualTerminals:['1','2']},{id:'L1',manualTerminals:['1']}],wires:[{a:'X1',fromTerminal:'1',b:'F1',toTerminal:'1'},{a:'F1',fromTerminal:'1',b:'L1',toTerminal:'1'},{a:'X1',fromTerminal:'2',b:'F1',toTerminal:'2'},{a:'X1',b:'L1'}]};
const result=analyze(project);
assert.equal(result.nets.length,2);
assert.deepEqual(result.nets.map(n=>n.terminals.length).sort(),[2,3]);
assert.equal(result.pending.length,1);
assert.equal(result.electricallyApproved,false);
assert.equal(result.reviewRequired,true);
assert.equal(analyze({symbols:[],wires:[]}).nets.length,0);
assert.equal(analyze({symbols:[{id:'A',manualTerminals:['1']}],wires:[{a:'A',fromTerminal:'1',b:'Z',toTerminal:'1'}]}).pending.length,1);
const duplicate=analyze({symbols:[{id:'X',manualTerminals:['1']},{id:'X',manualTerminals:['1']},{id:'Y',manualTerminals:['1']}],wires:[{a:'X',fromTerminal:'1',b:'Y',toTerminal:'1'}]});
assert.equal(duplicate.nets.length,0,'ambiguous component identity must not create a net');
assert.match(duplicate.pending[0].reason,/Mehrdeutige/);
const self=analyze({symbols:[{id:'X',manualTerminals:['1','2']}],wires:[{a:'X',fromTerminal:'1',b:'X',toTerminal:'2'}]});
assert.equal(self.nets.length,0,'self-wire must not create a misleading net');
assert.match(self.pending[0].reason,/Selbstverbindung/);
for(const bad of [['1','1'],['1',''],Array.from({length:9},(_,i)=>String(i+1))]){
 const result=analyze({symbols:[{id:'A',manualTerminals:bad},{id:'B',manualTerminals:['1']}],wires:[{a:'A',fromTerminal:'1',b:'B',toTerminal:'1'}]});
 assert.equal(result.nets.length,0,'invalid terminal lists must not produce apparent connectivity');
 assert.equal(result.pending.length,1);
}
for(const badId of [' X','X\u200b','X\n']){
 const check=analyze({symbols:[{id:badId,manualTerminals:['1']},{id:'B',manualTerminals:['1']}],wires:[{a:badId,fromTerminal:'1',b:'B',toTerminal:'1'}]});
 assert.equal(check.nets.length,0);
 assert.match(check.pending[0].reason,/Ungültige Symbolkennung/);
}
const hiddenTerminal=analyze({symbols:[{id:'A',manualTerminals:['1\u200b']},{id:'B',manualTerminals:['1']}],wires:[{a:'A',fromTerminal:'1\u200b',b:'B',toTerminal:'1'}]});
assert.equal(hiddenTerminal.nets.length,0);
assert.equal(hiddenTerminal.pending.length,1);
const unicodeAliases=analyze({symbols:[{id:'é',manualTerminals:['1']},{id:'e\u0301',manualTerminals:['1']},{id:'B',manualTerminals:['1']}],wires:[{a:'é',fromTerminal:'1',b:'B',toTerminal:'1'},{a:'e\u0301',fromTerminal:'1',b:'B',toTerminal:'1'}]});
assert.equal(unicodeAliases.nets.length,0,'NFC-equivalent symbol identifiers must not produce nets');
assert.equal(unicodeAliases.pending.length,2);
assert.ok(unicodeAliases.pending.every(x=>/Mehrdeutige/.test(x.reason)));
console.log('Explicit terminal connectivity grouping regression passed');
