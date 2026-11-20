'use strict';
const assert=require('node:assert/strict');
const {get,types}=require('../src/schematic-pictograms');
assert.deepEqual(types.sort(),['KLEMME','LAMP','LS','RCD','SW','KM','MSS'].sort());
for(const type of types){const shapes=get(type);assert.ok(shapes.length>0);for(const shape of shapes){assert.ok(['line','rect','circle'].includes(shape[0]));assert.ok(shape.slice(1).every(Number.isFinite))}}
const a=get('LS');a[0][1]=999;assert.notEqual(get('LS')[0][1],999);
assert.deepEqual(get('unknown'),[]);
console.log('Schematic pictogram geometry passed');
