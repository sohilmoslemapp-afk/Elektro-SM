'use strict';
const assert=require('node:assert/strict');
const {validateTerminalGraph}=require('../src/terminal-graph.js');
function part(id,terminals){return {id,terminals};}
function edge(a,at,b,bt){return {from:{component:a,terminal:at},to:{component:b,terminal:bt}};}
const cases=[
 ['single valid wire', {components:[part('Q1',['1','2']),part('H1',['A1','A2'])],connections:[edge('Q1','2','H1','A1')]},true],
 ['empty project', {components:[],connections:[]},true],
 ['missing components', {connections:[]},false],
 ['missing connections', {components:[]},false],
 ['duplicate component IDs', {components:[part('Q1',['1']),part('Q1',['2'])],connections:[]},false],
 ['empty component ID', {components:[part('',['1'])],connections:[]},false],
 ['duplicate terminal', {components:[part('Q1',['1','1'])],connections:[]},false],
 ['empty terminal', {components:[part('Q1',[''])],connections:[]},false],
 ['unknown source terminal', {components:[part('Q1',['1']),part('H1',['A1'])],connections:[edge('Q1','2','H1','A1')]},false],
 ['unknown target terminal', {components:[part('Q1',['1']),part('H1',['A1'])],connections:[edge('Q1','1','H1','A2')]},false],
 ['unknown source component', {components:[part('Q1',['1'])],connections:[edge('MISSING','1','Q1','1')]},false],
 ['unknown target component', {components:[part('Q1',['1'])],connections:[edge('Q1','1','MISSING','1')]},false],
 ['same terminal loop', {components:[part('Q1',['1'])],connections:[edge('Q1','1','Q1','1')]},false],
 ['different terminals on same component', {components:[part('Q1',['1','2'])],connections:[edge('Q1','1','Q1','2')]},true]
];
for(const [name,input,expected] of cases){const result=validateTerminalGraph(input);assert.equal(result.valid,expected,name);assert.ok(Array.isArray(result.errors),name);assert.ok(Array.isArray(result.warnings),name);assert.ok(result.disclaimer||!expected,name);}
const sample={components:[part('Q1',['1','2']),part('H1',['A1','A2'])],connections:[edge('Q1','2','H1','A1')]};
const duplicate=validateTerminalGraph({...sample,connections:[sample.connections[0],edge('H1','A1','Q1','2')]});
assert.equal(duplicate.valid,true);
assert.ok(duplicate.warnings.some(w=>w.includes('doppelt')),'reverse duplicate must be flagged');
const open=validateTerminalGraph(sample);
assert.ok(open.warnings.some(w=>w.includes('Q1/1')),'open source terminal');
assert.ok(open.warnings.some(w=>w.includes('H1/A2')),'open target terminal');
assert.equal(open.checkedComponents,2);
assert.equal(open.checkedConnections,1);
assert.match(open.disclaimer,/Keine Herstellerprüfung/);
const shared=validateTerminalGraph({components:[part('X1',['1']),part('X2',['1']),part('X3',['1'])],connections:[edge('X1','1','X2','1'),edge('X1','1','X3','1')]});
assert.equal(shared.valid,true,'multiple connections are not automatically electrically invalid');
assert.ok(shared.warnings.some(w=>w.includes('Mehrfachbelegung')&&w.includes('X1/1')),'multiple connection must require review');
const separate=validateTerminalGraph({components:[part('X1',['1','2']),part('X2',['1']),part('X3',['1'])],connections:[edge('X1','1','X2','1'),edge('X1','2','X3','1')]});
assert.ok(!separate.warnings.some(w=>w.includes('Mehrfachbelegung')),'separate terminals must not be flagged');
const malformed=validateTerminalGraph({components:[part('X1',['1']),part('X2',['2'])],connections:[{from:{component:'X1',terminal:1},to:{component:'X2',terminal:'2'}}]});
assert.equal(malformed.valid,false,'numeric terminal references must be rejected');
assert.ok(malformed.errors.some(e=>e.includes('Anschluss fehlt')),'malformed terminal should produce a clear error');
console.log('ElektroPlan terminal graph: 20 structural assertions passed; NO electrical safety approval.');
