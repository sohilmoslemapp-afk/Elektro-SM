const assert=require('node:assert/strict');
const {validate}=require('../src/schematic-validation');
const project=ids=>({symbols:ids.map((id,i)=>({id,type:'SW',x:i,y:0,manualTerminals:['1']})),wires:[]});
assert.equal(validate(project(['A','B'])).valid,true);
for(const ids of [['A','A'],['é','e\u0301'],['A\u200b'],[' A'],['A\u202e']])assert.equal(validate(project(ids)).valid,false,JSON.stringify(ids));

// Distinct wires must not collide when an identifier contains the separator character.
const graph={symbols:['a|b','c','a','b|c'].map((id,i)=>({id,type:'SW',x:i,y:0,manualTerminals:['1']})),wires:[{a:'a|b',b:'c',fromTerminal:'1',toTerminal:'1'},{a:'a',b:'b|c',fromTerminal:'1',toTerminal:'1'}]};
const distinct=validate(graph);
assert.equal(distinct.valid,true);
assert.equal(distinct.warnings.some(w=>w.includes('doppelte Verbindung')),false);
const reversed=validate({...graph,wires:[...graph.wires,{a:'c',b:'a|b',fromTerminal:'1',toTerminal:'1'}]});
assert.equal(reversed.warnings.filter(w=>w.includes('doppelte Verbindung')).length,1);
console.log('Schematic identifier safety regression passed');
