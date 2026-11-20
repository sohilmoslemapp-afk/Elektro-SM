const assert=require('node:assert/strict');
const {assessManufacturerEvidence}=require('../src/manufacturer-evidence');
function record(){return {identity:{manufacturer:'Maker',model:'M1',partNumber:'P1'},evidence:{documentPartNumber:'P1',documentTitle:'Manual',documentUrl:'https://example.org/doc',documentRevision:'1',pageReference:'2',publisherVerified:true,publisherReviewReference:'manual check',modelMatchVerified:true,modelReviewReference:'manual check',terminalMappingReviewed:true,reviewer:'Reviewer',reviewDate:'2026-11-20'},terminals:[{name:'A1',function:'Coil',sourceReference:'page 2'}]}}
assert.equal(assessManufacturerEvidence(record()).usableForTerminalReference,true);
const tooMany=record();tooMany.terminals=Array.from({length:257},(_,i)=>({name:'T'+i,function:'Terminal',sourceReference:'page 2'}));
assert.equal(assessManufacturerEvidence(tooMany).usableForTerminalReference,false);
assert.ok(assessManufacturerEvidence(tooMany).errors.some(e=>e.includes('Zu viele')));
const tooLong=record();tooLong.identity.manufacturer='M'.repeat(2001);
assert.equal(assessManufacturerEvidence(tooLong).usableForTerminalReference,false);
const hugeName=record();hugeName.terminals[0].name='T'.repeat(2001);
assert.equal(assessManufacturerEvidence(hugeName).usableForTerminalReference,false);
assert.equal(assessManufacturerEvidence(record()).electricallyApproved,false);
console.log('Manufacturer evidence bounds regression passed');
