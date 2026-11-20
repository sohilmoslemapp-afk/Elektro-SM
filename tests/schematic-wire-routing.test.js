'use strict';
const assert=require('node:assert/strict');
const {route}=require('../src/schematic-wire-routing');
assert.equal(route({x:10,y:20},{x:90,y:70}),'M10 20 H50 V70 H90');
assert.equal(route({x:10,y:20},{x:90,y:70},10),'M10 20 H60 V70 H90');
assert.equal(route({x:10,y:20},{x:10,y:70}),'M10 20 L10 70');
assert.equal(route({x:10,y:20},{x:90,y:20}),'M10 20 L90 20');
assert.equal(route({x:90,y:70},{x:10,y:20}),'M90 70 H50 V20 H10');
for(const [a,b] of [[{x:NaN,y:1},{x:3,y:2}],[{x:Infinity,y:1},{x:3,y:2}],[null,{x:3,y:2}]])assert.equal(route(a,b),null);
console.log('Orthogonal wire routing and invalid coordinate tests passed');

assert.equal(route({x:42,y:91},{x:42,y:91}),null,'Coincident terminal positions must not produce zero-length wire paths');
assert.equal(route({x:42,y:91},{x:42,y:91},5),null,'Routing offset cannot turn identical endpoints into a valid wire');
assert.equal(route({x:42,y:91},{x:42,y:92}),'M42 91 L42 92','A short nonzero wire must remain drawable');
