const assert=require('node:assert/strict');
const {assessManufacturerEvidence:check}=require('../src/manufacturer-evidence');
function record(name){return {identity:{manufacturer:'Maker',model:'M1',partNumber:'P1'},evidence:{documentPartNumber:'P1',documentTitle:'Manual',documentUrl:'https://example.org/doc',documentRevision:'1',pageReference:'2',publisherVerified:true,publisherReviewReference:'manual',modelMatchVerified:true,modelReviewReference:'manual',terminalMappingReviewed:true,reviewer:'Reviewer',reviewDate:'2026-11-20'},terminals:[{name,function:'Input',sourceReference:'page 2'}]}}
assert.equal(check(record('A1')).usableForTerminalReference,true);
for(const name of [' A1','A1 ', 'A'.repeat(41),'A'+String.fromCharCode(0x200b)+'1','A'+String.fromCharCode(0x202e)+'1','A'+String.fromCharCode(0x0000)+'1']){
 const result=check(record(name));assert.equal(result.usableForTerminalReference,false,JSON.stringify(name));assert.equal(result.electricallyApproved,false);
}
console.log('Manufacturer terminal label safety regression passed');
