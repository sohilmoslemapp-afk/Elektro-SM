'use strict';
const assert=require('node:assert/strict');
const {validateTerminalGraph:check}=require('../src/terminal-graph.js');
const a={components:[{id:'Q1',terminals:['1','2']},{id:'H1',terminals:['A1','A2']}],connections:[{from:{component:'Q1',terminal:'2'},to:{component:'H1',terminal:'A1'}}]};
assert.equal(check(a).valid,true);
assert.equal(check(a).reviewRequired,true);
assert.equal(check(a).electricallyApproved,false);
assert.equal(check(a).warnings.length,2);
assert.equal(check({}).valid,false);
assert.equal(check({}).reviewRequired,true);
assert.equal(check({}).electricallyApproved,false);
assert.equal(check({...a,components:[{id:'Q1',terminals:['2']},{id:'H1',terminals:['A1']}]}).reviewRequired,false);
assert.equal(check({...a,components:[{id:'Q1',terminals:['2']},{id:'H1',terminals:['A1']}]}).electricallyApproved,false);
assert.equal(check({...a,connections:[{from:{component:'Q1',terminal:'3'},to:{component:'H1',terminal:'A1'}}]}).valid,false);
assert.equal(check({...a,connections:[{from:{component:'Q1',terminal:'2'},to:{component:'Q1',terminal:'2'}}]}).valid,false);
assert.equal(check({...a,components:[a.components[0],a.components[0]]}).valid,false);
assert.equal(check({...a,components:[{id:'Q1',terminals:['1','1']}]}).valid,false);
assert.equal(check({...a,connections:[a.connections[0],a.connections[0]]}).valid,false);
assert.equal(check({...a,connections:[a.connections[0],a.connections[0]]}).errors.some(x=>x.includes('doppelte Anschlussverbindung')),true);
assert.equal(check({...a,connections:[{from:{component:'Q1',terminal:'2'},to:{component:'missing',terminal:'A1'}}]}).valid,false);
assert.equal(check({...a,connections:[{from:{component:'Q1',terminal:'2'},to:{component:'H1',terminal:'A1'}},{from:{component:'H1',terminal:'A1'},to:{component:'Q1',terminal:'2'}}]}).errors.some(x=>x.includes('doppelte Anschlussverbindung')),true);
assert.equal(check({...a,components:[{id:'Q1',terminals:['1','2']},{id:'H1',terminals:['A1','A2']},{id:'X1',terminals:['L']}]}).warnings.some(x=>x.includes('X1/L')),true);
assert.equal(check({...a,connections:[{from:{component:'Q1',terminal:'2'},to:{component:'Q1',terminal:'1'}}]}).valid,true);
console.log('Terminal graph: 12 structural assertions passed; electrical correctness not assessed.');

assert.equal(check({components:[],connections:[]}).valid,true);
assert.equal(check({components:[],connections:[]}).reviewRequired,true);
assert.equal(check({components:[],connections:[]}).warnings.some(x=>x.includes('Keine Bauteile')),true);
assert.equal(check({components:a.components,connections:[]}).reviewRequired,true);
assert.equal(check({components:a.components,connections:[]}).warnings.some(x=>x.includes('Keine Verbindungen')),true);

const orphanGraph=check({components:[],connections:[{from:{component:'X',terminal:'1'},to:{component:'Y',terminal:'2'}}]});
assert.equal(orphanGraph.valid,false);
assert.equal(orphanGraph.reviewRequired,true);
assert.equal(orphanGraph.electricallyApproved,false);
assert.equal(orphanGraph.errors.some(x=>x.includes('ohne Bauteile')),true);

for(const badTerminal of [' A1','A1 ','\tA1','A1\n']){
 const checked=check({components:[{id:'H1',terminals:['A1',badTerminal]}],connections:[]});
 assert.equal(checked.valid,false,'Terminal with outer whitespace must be rejected');
 assert.equal(checked.reviewRequired,true);
 assert.equal(checked.electricallyApproved,false);
}

for(const invisible of ['A\u200b1','A\u202e1','A\u20661','A\u00001','A\u007f1']){
 const result=check({components:[{id:'X1',terminals:[invisible]}],connections:[]});
 assert.equal(result.valid,false,'Invisible formatting and control characters must be rejected');
 assert.equal(result.reviewRequired,true);
}
assert.equal(check({components:[{id:'X1',terminals:['A1','A2']}],connections:[]}).valid,true);

for(const invalidId of [' Q1','Q1 ','Q\u200b1','Q\u202e1','Q\u00001']){
 const result=check({components:[{id:invalidId,terminals:['1']}],connections:[]});
 assert.equal(result.valid,false,'Invalid component identifier must be rejected');
 assert.equal(result.reviewRequired,true);
}
assert.equal(check({components:[{id:'Q1',terminals:['1']}],connections:[]}).valid,true);

const isolated=check({components:[...a.components,{id:'K9',terminals:['A1']}],connections:a.connections});
assert.equal(isolated.valid,true,'Isolated components are a review warning, not an automatic wiring error');
assert.equal(isolated.reviewRequired,true);
assert.ok(isolated.warnings.some(w=>w.includes('Bauteil ohne Verbindung: K9')));
assert.ok(!check(a).warnings.some(w=>w.includes('Bauteil ohne Verbindung')));

const samePart=check({components:[{id:'K1',terminals:['A1','A2']}],connections:[{from:{component:'K1',terminal:'A1'},to:{component:'K1',terminal:'A2'}}]});
assert.equal(samePart.valid,true,'Two distinct terminals of the same component are not automatically structurally invalid');
assert.equal(samePart.reviewRequired,true);
assert.equal(samePart.electricallyApproved,false);
assert.ok(samePart.warnings.some(w=>w.includes('Zwei Anschlüsse desselben Bauteils')));
assert.ok(!check(a).warnings.some(w=>w.includes('Zwei Anschlüsse desselben Bauteils')));

const noTerminals=check({components:[{id:'K2',terminals:[]}],connections:[]});
assert.equal(noTerminals.valid,true,'No terminals is incomplete, not a malformed component');
assert.equal(noTerminals.reviewRequired,true);
assert.ok(noTerminals.warnings.some(w=>w.includes('Bauteil ohne erfasste Anschlüsse: K2')));
assert.ok(!check(a).warnings.some(w=>w.includes('Bauteil ohne erfasste Anschlüsse')));

const invalidOnly=check({components:[{id:'K3',terminals:[' bad ']}],connections:[]});
assert.equal(invalidOnly.valid,false);
assert.ok(!invalidOnly.warnings.some(w=>w.includes('Bauteil ohne erfasste Anschlüsse')),'Invalid terminal entry must not be misreported as an empty list');
const duplicateInternal=check({components:[{id:'K4',terminals:['1','2']}],connections:[{from:{component:'K4',terminal:'1'},to:{component:'K4',terminal:'2'}},{from:{component:'K4',terminal:'2'},to:{component:'K4',terminal:'1'}}]});
assert.equal(duplicateInternal.valid,false);
assert.equal(duplicateInternal.warnings.filter(w=>w.includes('Zwei Anschlüsse desselben Bauteils')).length,1,'Duplicate internal wire must not produce a second review warning');

const equivalentNames=check({components:[{id:'X9',terminals:['é','e\u0301']}],connections:[]});
assert.equal(equivalentNames.valid,false,'Canonically equivalent terminal labels must not coexist');
assert.ok(equivalentNames.errors.some(e=>e.includes('doppelter Anschluss')));
const distinctUnicode=check({components:[{id:'X9',terminals:['é','è']}],connections:[]});
assert.equal(distinctUnicode.valid,true,'Distinct terminal names must remain accepted');

const equivalentIds=check({components:[{id:'Café',terminals:['1']},{id:'Cafe\u0301',terminals:['2']}],connections:[]});
assert.equal(equivalentIds.valid,false,'Canonically equivalent component IDs must not coexist');
assert.ok(equivalentIds.errors.some(e=>e.includes('doppelte Kennung')));
const distinctIds=check({components:[{id:'Café',terminals:['1']},{id:'Cafe',terminals:['2']}],connections:[]});
assert.equal(distinctIds.valid,true,'Distinct component IDs must remain accepted');

// Edge identity remains unambiguous with punctuation in user-defined labels.
const punctuationGraph={components:[{id:'A|B',terminals:['1|2','3']},{id:'C',terminals:['x|y','z']}],connections:[{from:{component:'A|B',terminal:'1|2'},to:{component:'C',terminal:'x|y'}},{from:{component:'A|B',terminal:'3'},to:{component:'C',terminal:'z'}}]};
assert.equal(check(punctuationGraph).valid,true);
assert.equal(check({...punctuationGraph,connections:[...punctuationGraph.connections,{from:punctuationGraph.connections[0].to,to:punctuationGraph.connections[0].from}]}).errors.filter(x=>x.includes('doppelte Anschlussverbindung')).length,1);
