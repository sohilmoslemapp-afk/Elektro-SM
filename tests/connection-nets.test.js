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
// Editing a bridge wire must split and rejoin terminal groups deterministically.
const chainSymbols=[{id:'A',manualTerminals:['1']},{id:'B',manualTerminals:['1']},{id:'C',manualTerminals:['1']},{id:'D',manualTerminals:['1']}];
const chainWires=[{a:'A',fromTerminal:'1',b:'B',toTerminal:'1'},{a:'B',fromTerminal:'1',b:'C',toTerminal:'1'},{a:'C',fromTerminal:'1',b:'D',toTerminal:'1'}];
const chain=analyze({symbols:chainSymbols,wires:chainWires});
assert.equal(chain.nets.length,1,'three linked wires form one net');
assert.equal(chain.nets[0].terminals.length,4,'net must contain all four component terminals');
assert.equal(chain.pending.length,0);
const withoutBridge=analyze({symbols:chainSymbols,wires:[chainWires[0],chainWires[2]]});
assert.equal(withoutBridge.nets.length,2,'removing the middle wire must split the network');
assert.deepEqual(withoutBridge.nets.map(n=>n.terminals.length),[2,2]);
assert.equal(withoutBridge.pending.length,0);
const missingEndpoint=analyze({symbols:chainSymbols,wires:[chainWires[0],{...chainWires[1],toTerminal:undefined},chainWires[2]]});
assert.equal(missingEndpoint.nets.length,2,'incomplete bridge must not merge networks');
assert.equal(missingEndpoint.pending.length,1,'incomplete bridge must be flagged');
const restored=analyze({symbols:chainSymbols,wires:chainWires});
assert.deepEqual(restored.nets,chain.nets,'reassigning the bridge must restore identical net groups');
const duplicateBridge=analyze({symbols:chainSymbols,wires:[...chainWires,chainWires[1]]});
assert.equal(duplicateBridge.nets.length,1,'parallel duplicate links must not create phantom networks');
assert.equal(duplicateBridge.nets[0].terminals.length,4);
assert.equal(duplicateBridge.electricallyApproved,false,'topological analysis is never electrical approval');
for(const badTerminal of [' 1','1 ','1\\u200b','1\\n','x'.repeat(41)]){
 const unsafeWire=analyze({symbols:[{id:'A',manualTerminals:['1']},{id:'B',manualTerminals:['1']}],wires:[{a:'A',fromTerminal:badTerminal,b:'B',toTerminal:'1'}]});
 assert.equal(unsafeWire.nets.length,0,'invalid wire terminal must not create connectivity');
 assert.equal(unsafeWire.pending.length,1,'invalid wire terminal must be reported');
}
// A shared component must not electrically bridge its distinct terminal pins.
const distinctPins={symbols:[{id:'Q1',manualTerminals:['1','2']},{id:'X1',manualTerminals:['1']},{id:'X2',manualTerminals:['1']}],wires:[{a:'Q1',fromTerminal:'1',b:'X1',toTerminal:'1'},{a:'Q1',fromTerminal:'2',b:'X2',toTerminal:'1'}]};
const isolated=analyze(distinctPins);
assert.equal(isolated.nets.length,2,'different pins on one device must remain separate networks');
assert.deepEqual(isolated.nets.map(n=>n.terminals.length),[2,2]);
assert.equal(isolated.pending.length,0);
const reassigned=analyze({symbols:distinctPins.symbols,wires:[distinctPins.wires[0],{...distinctPins.wires[1],fromTerminal:'1'}]});
assert.equal(reassigned.nets.length,1,'reassigning both wires to the same pin must merge networks');
assert.equal(reassigned.nets[0].terminals.length,3);
assert.equal(reassigned.pending.length,0);
const invalidReassignment=analyze({symbols:distinctPins.symbols,wires:[distinctPins.wires[0],{...distinctPins.wires[1],fromTerminal:'3'}]});
assert.equal(invalidReassignment.nets.length,1,'unknown pin must not merge separate networks');
assert.equal(invalidReassignment.pending.length,1,'unknown pin must require manual review');
assert.deepEqual(invalidReassignment.nets[0].terminals.map(t=>t.component),['Q1','X1']);
// A branched net can have three endpoints while another pin of the same device stays isolated.
const branchProject={symbols:[{id:'Q',manualTerminals:['A1','A2']},{id:'X',manualTerminals:['1']},{id:'Y',manualTerminals:['1']},{id:'Z',manualTerminals:['1']}],wires:[{a:'Q',fromTerminal:'A1',b:'X',toTerminal:'1'},{a:'Q',fromTerminal:'A1',b:'Y',toTerminal:'1'},{a:'Q',fromTerminal:'A2',b:'Z',toTerminal:'1'}]};
const branched=analyze(branchProject);
assert.equal(branched.nets.length,2,'branched pin and separate pin must remain two nets');
assert.deepEqual(branched.nets.map(n=>n.terminals.length).sort(),[2,3]);
assert.equal(branched.pending.length,0);
const removedBranch=analyze({symbols:branchProject.symbols,wires:branchProject.wires.slice(1)});
assert.equal(removedBranch.nets.length,2,'removing a branch must not connect previously separate pins');
assert.deepEqual(removedBranch.nets.map(n=>n.terminals.length).sort(),[2,2]);
const reversedWires=analyze({symbols:branchProject.symbols,wires:[...branchProject.wires].reverse()});
assert.deepEqual(reversedWires.nets,branched.nets,'wire ordering must not change net grouping');
console.log('Explicit terminal connectivity grouping regression passed');
