const assert=require('node:assert/strict');
const lib=require('../src/evidence-report.js');
const project={symbols:[
 {id:'Q1',manualTerminals:['1','2'],terminalTypes:{'1':'L1','2':'UNKNOWN'},terminalEvidence:{status:'generic-unverified'}},
 {id:'F1',manualTerminals:['1','2'],terminalTypes:{'1':'N','2':'N'},terminalEvidence:{status:'manufacturer-documented',manufacturer:'Example',model:'Model',documentTitle:'Manual',documentUrl:'https://example.com/manual.pdf'}}
]};
const r=lib.report(project);
assert.equal(r.deviceCount,2);
assert.equal(r.documentReferencesSupplied,1);
assert.equal(r.untypedTerminals,1);
assert.equal(r.terminalMappingsVerified,0);
assert.equal(r.electricallyApproved,false);
assert.ok(r.devices.every(x=>x.reviewRequired&&x.terminalMappingVerified===false));
assert.equal(lib.report({symbols:[]}).deviceCount,0);
console.log('Evidence report tests passed');
