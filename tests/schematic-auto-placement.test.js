'use strict';
const assert=require('node:assert/strict');
const {place}=require('../src/schematic-auto-placement');
const {inspect}=require('../src/schematic-layout-audit');
const symbols=[];
for(let i=0;i<20;i++){
 const p=place(symbols);assert.ok(p,'A free slot must be available for first 20 components');
 symbols.push({id:'S'+i,...p});
 assert.equal(inspect({symbols}).warnings.length,0,'Automatic placement must not overlap');
}
assert.deepEqual(place([]),{x:100,y:100});
const all=[];for(let y=100;y<=355;y+=85)for(let x=100;x<=700;x+=125)all.push({x,y});
assert.equal(place(all),null,'Full drawing must reject insertion');
console.log('Safe schematic auto-placement and full-canvas handling passed');
