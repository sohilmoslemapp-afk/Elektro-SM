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
assert.equal(validateTerminalGraph(invalid).valid,false,'Unknown terminal fails closed');
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
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'\\t'},
 {a:'F3',b:'X1',fromTerminal:'2',toTerminal:'3'}
]});
assert.deepEqual(blankAndNonString.pending.map(p=>p.wire),[0,1,2],'Whitespace and non-string terminal references remain pending');
assert.equal(blankAndNonString.connections.length,1,'Only complete terminal strings become graph edges');
assert.equal(blankAndNonString.connections[0].sourceWire,3,'Original wire index must survive filtering');
