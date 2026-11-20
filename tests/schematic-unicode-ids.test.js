const assert=require('node:assert/strict');
const {validate}=require('../src/schematic-validation');
const project=ids=>({symbols:ids.map((id,i)=>({id,type:'SW',x:i,y:0})),wires:[]});
assert.equal(validate(project(['A','B'])).valid,true);
for(const ids of [['A','A'],['é','e\u0301'],['A\u200b'],[' A'],['A\u202e']])assert.equal(validate(project(ids)).valid,false,JSON.stringify(ids));
console.log('Schematic identifier safety regression passed');
