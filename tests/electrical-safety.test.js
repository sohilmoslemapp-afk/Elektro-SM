/* Run with: node tests/electrical-safety.test.js */
const assert=require('node:assert/strict');
const safety=require('../src/electrical-safety.js');
assert.equal(safety.terminalType('PE1'),'PE');
assert.equal(safety.terminalType('N-2'),'N');
assert.equal(safety.checkConductor('N','PE').valid,false);
assert.equal(safety.checkConductor('PE','N').issues[0].code,'N_PE_MISMATCH');
assert.equal(safety.checkConductor('L1','PE').valid,false);
assert.equal(safety.checkConductor('L1','N').valid,false);
assert.equal(safety.checkConductor('N','N').valid,true);
assert.equal(safety.checkConductor('PE','PE').valid,true);
assert.equal(safety.checkConductor('PEN','PE').valid,true);
assert.ok(safety.checkConductor('PEN','PE').issues.some(i=>i.code==='SPECIAL_EARTHING_REVIEW'));
assert.ok(safety.checkConductor('1','2').issues.some(i=>i.code==='UNVERIFIED_TERMINAL'));
assert.equal(safety.validateConnections([{fromType:'N',toType:'PE'}]).valid,false);
assert.equal(safety.validateConnections([{fromType:'PE',toType:'PE'}]).valid,true);
console.log('Electrical safety unit tests passed (12 checks)');
