'use strict';
const assert = require('node:assert/strict');
const {fromSchematic} = require('../src/schematic-graph-adapter');
const {validateTerminalGraph} = require('../src/terminal-graph');

const schematic = {
  symbols: [
    {id:'F1',manualTerminals:['1','2']},
    {id:'X1',manualTerminals:['3','4']}
  ],
  wires:[
    {a:'F1',b:'X1',fromTerminal:'2',toTerminal:'3'},
    {a:'F1',b:'X1',fromTerminal:'',toTerminal:'4'}
  ]
};
const before = JSON.stringify(schematic);
const graph = fromSchematic(schematic);
assert.equal(JSON.stringify(schematic),before,'Conversion must not change original drawing');
assert.deepEqual(graph.connections.map(e=>e.sourceWire),[0]);
assert.deepEqual(graph.pending.map(e=>e.wire),[1]);
const review = validateTerminalGraph(graph);
assert.equal(review.valid,true,'A valid connection remains structurally valid');
assert.equal(review.reviewRequired,true,'An unresolved wire requires review');
assert.equal(review.electricallyApproved,false,'Structural checks never approve electrical safety');
assert.ok(review.warnings.includes('Nicht zugeordnete Leitungen: 1'));

const approvedLooking = fromSchematic({...schematic,wires:[schematic.wires[0]]});
const checked = validateTerminalGraph(approvedLooking);
assert.equal(checked.valid,true);
assert.equal(checked.electricallyApproved,false,'Even a complete graph is not an electrical approval');
assert.equal(typeof checked.disclaimer,'string');
assert.ok(checked.disclaimer.includes('Keine Herstellerprüfung'));

const reversed = validateTerminalGraph({
  ...approvedLooking,
  connections:[...approvedLooking.connections,{
    from:approvedLooking.connections[0].to,
    to:approvedLooking.connections[0].from,
    sourceWire:1
  }]
});
assert.equal(reversed.valid,false,'Reversed duplicate must fail');

for (const invalid of [null,{},'bad',{forEach(){throw Error('Untrusted collection invoked')}}]) {
  const result=validateTerminalGraph({components:approvedLooking.components,connections:invalid,pending:graph.pending});
  assert.equal(result.valid,false);
  assert.equal(result.reviewRequired,true);
  assert.equal(result.electricallyApproved,false);
}
console.log('Connection package safety regression checks passed');
