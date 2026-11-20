'use strict';
const assert=require('node:assert/strict');
const m=require('../prototypes/V133-safe-matching.js');
const cases=[
 [{brand:'ABB',model:'F202 A'},{brand:'ABB',model:'F202 A'},'exact-text-match',true],
 [{brand:'abb',model:'f202 a'},{brand:'ABB',model:'F202 A'},'exact-text-match',true],
 [{brand:'ABB',model:'F202 A'},{brand:'Hager',model:'F202 A'},'manufacturer-conflict',false],
 [{brand:'ABB',model:'F202'},{brand:'ABB',model:'F202 A'},'partial-model',false],
 [{brand:'ABB',model:'F202 A'},{brand:'ABB',model:'S201'},'different-model',false],
 [{brand:'ABB',model:'F202 A'},{brand:'ABB GmbH',model:'F202 A'},'manufacturer-conflict',false],
 [{brand:'',model:'F202 A'},{brand:'ABB',model:'F202 A'},'incomplete',false],
 [{brand:'ABB',model:'F202 A'},{brand:'',model:'F202 A'},'incomplete',false]
];
for(const [q,c,category,selectable] of cases){const r=m.compare(q,c);assert.equal(r.category,category);assert.equal(r.selectable,selectable)}
const sorted=m.search({brand:'ABB',model:'F202 A'},[{brand:'Hager',model:'F202 A'},{brand:'ABB',model:'F202'},{brand:'ABB',model:'F202 A'}]);
assert.deepEqual(sorted.map(x=>x.category),['exact-text-match','partial-model','manufacturer-conflict']);
assert.equal(sorted.filter(x=>x.selectable).length,1);
console.log('V133: 10 assertions passed. No browser or electrical verification performed.');
