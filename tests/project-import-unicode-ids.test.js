const assert=require('node:assert/strict');
const {validateImport}=require('../src/project-import-validation');
const payload=(ids)=>({format:'ElektroPlan-SM-1',data:{name:'Test',symbols:ids.map((id,i)=>({id,type:'SW',x:i,y:0})),wires:[],parts:[]}});
assert.equal(validateImport(payload(['A','B'])).ok,true);
for(const ids of [['A','A'],['é','e\u0301'],['A\u200b'],[' A'],['A\u202e']])assert.equal(validateImport(payload(ids)).ok,false,JSON.stringify(ids));
console.log('Unicode symbol ID import regression passed');
