const assert=require('node:assert/strict');
const {validate}=require('../src/schematic-validation');
const base={symbols:[{id:'S1',type:'SW',x:0,y:0}],wires:[]};
assert.equal(validate(base).valid,true);
for(const bad of [{...base,symbols:[{...base.symbols[0],id:'x'.repeat(101)}]},{...base,symbols:[{...base.symbols[0],x:100001}]},{...base,symbols:[{...base.symbols[0],y:-100001}]}])assert.equal(validate(bad).valid,false);
const tooManySymbols={symbols:Array(10001).fill(base.symbols[0]),wires:[]};
const tooManyWires={symbols:base.symbols,wires:Array(50001).fill({a:'S1',b:'S1'})};
for(const oversized of [tooManySymbols,tooManyWires]){
 const result=validate(oversized);
 assert.equal(result.valid,false);
 assert.ok(result.errors.some(e=>e.includes('Sicherheitsgrenzen')));
}
console.log('Schematic bounds and early rejection regression passed');
