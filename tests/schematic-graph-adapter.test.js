'use strict';
const assert=require('node:assert/strict');
const {fromSchematic}=require('../src/schematic-graph-adapter');
const {validateTerminalGraph}=require('../src/terminal-graph');
const project={symbols:[{id:'F3',manualTerminals:['1','2']},{id:'X1',manualTerminals:['3','N','PE']}],wires:[{a:'F3',b:'X1',fromTerminal:'2',toTerminal:'3'},{a:'F3',b:'X1'}]};
const graph=fromSchematic(project);
assert.equal(graph.components.length,2);
assert.equal(graph.connections.length,1);
assert.equal(graph.pending.length,1);
assert.equal(graph.connections[0].sourceWire,0);
assert.deepEqual(graph.connections[0].from,{component:'F3',terminal:'2'});
assert.equal(validateTerminalGraph(graph).valid,true);
assert.equal(graph.components[0].terminals.includes('N'),false,'No inferred manufacturer terminals');
const invalid=fromSchematic({...project,wires:[{a:'F3',b:'X1',fromTerminal:'99',toTerminal:'3'}]});
assert.deepEqual(invalid.pending,[{wire:0,reason:'Klemmenreferenz unbekannt'}],'Unknown terminal remains pending instead of entering graph');
assert.equal(invalid.connections.length,0,'Unknown terminal must not enter graph');
const reversed=fromSchematic({...project,wires:[project.wires[0],{a:'X1',b:'F3',fromTerminal:'3',toTerminal:'2'}]});
assert.equal(validateTerminalGraph(reversed).valid,false,'Reversed duplicate terminal edge rejected');
console.log('Schematic-to-terminal graph adapter checks passed');

const malformedSymbol=fromSchematic({symbols:[null,{id:'X1',manualTerminals:['1']}],wires:[]});
assert.equal(malformedSymbol.components.length,2,'Malformed symbols must not silently disappear');
assert.equal(validateTerminalGraph(malformedSymbol).valid,false,'Malformed symbols must fail terminal validation without throwing');
const malformedWire=fromSchematic({symbols:[{id:'X1',manualTerminals:['1']}],wires:[null]});
assert.deepEqual(malformedWire.pending.map(x=>x.wire),[0],'Null wires must remain explicitly pending');


const blankAndNonString=fromSchematic({...project,wires:[
 {a:'F3',b:'X1',fromTerminal:' ',toTerminal:'3'},
 {a:'F3',b:'X1',fromTerminal:2,toTerminal:'3'},
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'\t'},
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'3'}
]});
assert.deepEqual(blankAndNonString.pending.map(p=>p.wire),[0,1,2],'Whitespace and non-string terminal references remain pending');
assert.equal(blankAndNonString.connections.length,1,'Only complete terminal strings become graph edges');
assert.equal(blankAndNonString.connections[0].sourceWire,3,'Original wire index must survive filtering');

const emptyGraph=fromSchematic(null);
assert.deepEqual(emptyGraph,{components:[],connections:[],pending:[]},'Missing project must not crash graph conversion');
const untouched=JSON.stringify(project);
const independent=fromSchematic(project);
independent.components[0].terminals.push('TEST');
assert.equal(JSON.stringify(project),untouched,'Adapter output must not mutate original project terminals');
const absentIds=fromSchematic({symbols:[{id:'F3',manualTerminals:['1']},{id:'X1',manualTerminals:['2']}],wires:[{a:null,b:'X1',fromTerminal:'1',toTerminal:'2'}]});
assert.equal(absentIds.connections.length,0,'Missing component references must not enter the connection graph');
assert.deepEqual(absentIds.pending,[{wire:0,reason:'Bauteilzuordnung unvollständig'}],'Missing component references must remain visibly pending');

const blankIds=fromSchematic({...project,wires:[
 {a:' ',b:'X1',fromTerminal:'2',toTerminal:'3'},
 {a:'F3',b:17,fromTerminal:'2',toTerminal:'3'},
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'3'}
]});
assert.deepEqual(blankIds.pending.map(p=>p.wire),[0,1],'Blank and numeric component identifiers remain pending');
assert.equal(blankIds.connections.length,1,'Only complete component references enter graph');
assert.equal(blankIds.connections[0].sourceWire,2,'Connection retains source wire index');

const orphanWires=fromSchematic({...project,wires:[
 {a:'UNKNOWN',b:'X1',fromTerminal:'1',toTerminal:'3'},
 {a:'F3',b:'MISSING',fromTerminal:'2',toTerminal:'3'},
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'3'}
]});
assert.deepEqual(orphanWires.pending,[{wire:0,reason:'Bauteilreferenz unbekannt'},{wire:1,reason:'Bauteilreferenz unbekannt'}],'Orphan symbol references must remain pending');
assert.equal(orphanWires.connections.length,1,'Only existing schematic symbol references become graph connections');
assert.equal(orphanWires.connections[0].sourceWire,2,'Valid edge must retain original index after orphan filtering');

const manySymbols=Array.from({length:250},(_,i)=>({id:'K'+i,manualTerminals:['1','2']}));
const manyWires=Array.from({length:249},(_,i)=>({a:'K'+i,b:'K'+(i+1),fromTerminal:'2',toTerminal:'1'}));
manyWires.splice(100,0,{a:'K0',b:'GONE',fromTerminal:'1',toTerminal:'2'});
const indexed=fromSchematic({symbols:manySymbols,wires:manyWires});
assert.equal(indexed.connections.length,249,'Large schematic keeps all valid connections');
assert.deepEqual(indexed.pending,[{wire:100,reason:'Bauteilreferenz unbekannt'}],'Orphan detection remains deterministic in large schematics');
assert.equal(indexed.connections[100].sourceWire,101,'Original wire indices remain stable after pending entries');

const missingTerminals=fromSchematic({...project,wires:[
 {a:'F3',b:'X1',fromTerminal:'99',toTerminal:'3'},
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'GONE'},
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'3'}
]});
assert.deepEqual(missingTerminals.pending.map(x=>x.wire),[0,1],'Both ends of unknown terminal references are flagged');
assert.ok(missingTerminals.pending.every(x=>x.reason==='Klemmenreferenz unbekannt'));
assert.equal(missingTerminals.connections.length,1);
assert.equal(missingTerminals.connections[0].sourceWire,2);

const duplicateSymbols=fromSchematic({symbols:[
 {id:'F3',manualTerminals:['1','2']},
 {id:'F3',manualTerminals:['1','2']},
 {id:'X1',manualTerminals:['3']},
 {id:'Y1',manualTerminals:['1']}
],wires:[
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'3'},
 {a:'X1',b:'Y1',fromTerminal:'3',toTerminal:'1'},
 {a:'Y1',b:'F3',fromTerminal:'1',toTerminal:'1'}
]});
assert.deepEqual(duplicateSymbols.pending,[{wire:0,reason:'Bauteilreferenz mehrdeutig'},{wire:2,reason:'Bauteilreferenz mehrdeutig'}],'Ambiguous duplicate symbol identifiers must remain pending');
assert.equal(duplicateSymbols.connections.length,1,'Unambiguous wires must still be converted');
assert.equal(duplicateSymbols.connections[0].sourceWire,1,'Unambiguous wire source index remains unchanged');

const unicodeId=fromSchematic({symbols:[
 {id:'Café',manualTerminals:['1']},
 {id:'Cafe\u0301',manualTerminals:['1']},
 {id:'X1',manualTerminals:['2']}
],wires:[{a:'Café',b:'X1',fromTerminal:'1',toTerminal:'2'}]});
assert.deepEqual(unicodeId.pending,[{wire:0,reason:'Bauteilreferenz mehrdeutig'}],'Canonically equivalent symbol identifiers must be treated as ambiguous');
assert.equal(unicodeId.connections.length,0);
const unicodeTerminal=fromSchematic({symbols:[
 {id:'F3',manualTerminals:['é','e\u0301']},
 {id:'X1',manualTerminals:['2']}
],wires:[{a:'F3',b:'X1',fromTerminal:'é',toTerminal:'2'}]});
assert.deepEqual(unicodeTerminal.pending,[{wire:0,reason:'Klemmenreferenz mehrdeutig'}],'Canonically equivalent terminal names must be treated as ambiguous');
assert.equal(unicodeTerminal.connections.length,0);

const unsafeReferences=fromSchematic({symbols:[
 {id:'F3 ',manualTerminals:['1']},
 {id:'X1',manualTerminals:[' 2','3','N\u200b']}
],wires:[
 {a:'F3 ',b:'X1',fromTerminal:'1',toTerminal:'3'},
 {a:'X1',b:'X1',fromTerminal:' 2',toTerminal:'3'},
 {a:'X1',b:'X1',fromTerminal:'N\u200b',toTerminal:'3'}
]});
assert.deepEqual(unsafeReferences.pending,[
 {wire:0,reason:'Bauteilreferenz ungültig'},
 {wire:1,reason:'Klemmenreferenz ungültig'},
 {wire:2,reason:'Klemmenreferenz ungültig'}
],'Padded and invisible control-character references must never enter the graph');
assert.equal(unsafeReferences.connections.length,0);

const pendingGraphReview=validateTerminalGraph(fromSchematic(project));
assert.equal(pendingGraphReview.valid,true,'Known graph edges remain structurally valid');
assert.equal(pendingGraphReview.reviewRequired,true,'Pending wires must always require human review');
assert.ok(pendingGraphReview.warnings.includes('Nicht zugeordnete Leitungen: 1'),'Terminal graph review must disclose pending wire count');
const completeGraphReview=validateTerminalGraph(fromSchematic({...project,wires:[project.wires[0]]}));
assert.equal(completeGraphReview.warnings.some(x=>x.startsWith('Nicht zugeordnete Leitungen:')),false,'Fully assigned wires must not create a pending-wire warning');

const malformedPending=validateTerminalGraph({components:graph.components,connections:graph.connections,pending:'broken'});
assert.equal(malformedPending.valid,false,'Malformed pending list must fail closed');
assert.ok(malformedPending.errors.includes('Ungültige Liste nicht zugeordneter Leitungen'));

for(const entry of [null,{}, {wire:-1,reason:'Fehlt'}, {wire:1.5,reason:'Fehlt'}, {wire:0,reason:''},{wire:0,reason:5}]){
 const malformed=validateTerminalGraph({components:graph.components,connections:graph.connections,pending:[entry]});
 assert.equal(malformed.valid,false,'Malformed pending entry must fail closed: '+JSON.stringify(entry));
 assert.ok(malformed.errors.some(x=>x.startsWith('Ungültige offene Leitungsreferenz')));
}

const graphWith=(connections,pending)=>validateTerminalGraph({components:graph.components,connections,pending});
const duplicatePending=graphWith(graph.connections,[{wire:1,reason:'Offen'},{wire:1,reason:'Noch offen'}]);
assert.equal(duplicatePending.valid,false,'Same wire cannot appear twice in pending diagnostics');
assert.ok(duplicatePending.errors.includes('Doppelte offene Leitungsreferenz 1'));
const collision=graphWith(graph.connections,[{wire:0,reason:'Offen'}]);
assert.equal(collision.valid,false,'A wire cannot be both connected and pending');
assert.ok(collision.errors.includes('Leitung gleichzeitig offen und verbunden: 0'));
const duplicateSource=graphWith([...graph.connections,{...graph.connections[0],sourceWire:0}],[]);
assert.ok(duplicateSource.errors.includes('Doppelter Quellleitungsindex 0'));
for(const bad of [-1,1.5,NaN,'0']){
 const result=graphWith([{...graph.connections[0],sourceWire:bad}],[]);
 assert.equal(result.valid,false,'Invalid source wire index must fail closed');
 assert.ok(result.errors.includes('Ungültiger Quellleitungsindex 0'));
}
const noSourceIndex=graphWith([{from:graph.connections[0].from,to:graph.connections[0].to}],[]);
assert.equal(noSourceIndex.errors.some(x=>x.includes('Quellleitungsindex')),false,'Standalone graph edges need not carry schematic source indexes');
