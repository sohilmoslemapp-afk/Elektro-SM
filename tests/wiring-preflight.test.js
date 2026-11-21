const assert=require('node:assert/strict');
const safety=require('../src/net-safety.js');
const p={version:1,symbols:[
 {id:'X1',manualTerminals:['1'],terminalTypes:{'1':'PE'}},
 {id:'X2',manualTerminals:['1'],terminalTypes:{'1':'N'}},
 {id:'X3',manualTerminals:['1'],terminalTypes:{'1':'PE'}},
 {id:'X4',manualTerminals:['1'],terminalTypes:{'1':'UNKNOWN'}}],wires:[]};
const wire=(a,b)=>({a,fromTerminal:'1',b,toTerminal:'1'});
assert.equal(safety.proposeWire(p,wire('X1','X2')).accepted,false);
assert.equal(safety.proposeWire(p,wire('X1','X2')).reason,'N_PE_NET_CONFLICT');
assert.equal(safety.proposeWire(p,wire('X1','X3')).accepted,true);
assert.equal(safety.proposeWire(p,wire('X1','X4')).accepted,true);
assert.equal(safety.proposeWire(p,wire('X1','X1')).accepted,false);
assert.equal(safety.proposeWire(p,wire('X1','UNKNOWN')).accepted,false);
assert.equal(p.wires.length,0);
const chained={...p,wires:[wire('X1','X4')]};
assert.equal(safety.proposeWire(chained,wire('X4','X2')).accepted,false);
assert.equal(safety.proposeWire(chained,wire('X4','X3')).accepted,true);
console.log('Preflight wiring tests passed');
