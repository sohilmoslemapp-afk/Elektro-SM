const assert=require('node:assert/strict');
const {test}=require('node:test');
const {assessManufacturerEvidence}=require('../src/manufacturer-evidence');
const valid={
 identity:{manufacturer:'Example Manufacturer',model:'EX-1',partNumber:'EX-1-01'},
 evidence:{documentTitle:'EX-1 Datasheet',documentUrl:'https://example.invalid/ex-1.pdf',documentRevision:'Rev A',pageReference:'p. 3',publisherVerified:true,modelMatchVerified:true,terminalMappingReviewed:true},
 terminals:[{name:'A1',function:'Documented function',sourceReference:'p. 3'}]
};
function copy(){return JSON.parse(JSON.stringify(valid))}
test('documented and reviewed reference is usable but never electrically approved',()=>{
 const result=assessManufacturerEvidence(copy());
 assert.equal(result.usableForTerminalReference,true);
 assert.equal(result.electricallyApproved,false);
});
test('unverified publisher blocks terminal reference',()=>{
 const x=copy();x.evidence.publisherVerified=false;
 assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false);
});
test('unverified model match blocks terminal reference',()=>{
 const x=copy();x.evidence.modelMatchVerified=false;
 assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false);
});
test('missing source on terminal blocks reference',()=>{
 const x=copy();delete x.terminals[0].sourceReference;
 assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false);
});
test('duplicate normalized terminal names block reference',()=>{
 const x=copy();x.terminals.push({name:'A1',function:'Other',sourceReference:'p. 3'});
 assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false);
});
test('OCR-only guesses without documentation cannot be used',()=>{
 const result=assessManufacturerEvidence({identity:{manufacturer:'Guess',model:'Unknown'},terminals:[{name:'A1'}]});
 assert.equal(result.usableForTerminalReference,false);
 assert.equal(result.electricallyApproved,false);
});

test('manufacturer document URL must be a valid HTTPS URL without embedded credentials',()=>{
 for(const url of ['https://','https://user:pass@example.com/manual.pdf','javascript:alert(1)','http://example.com/manual.pdf','https://example.com@evil.test/manual.pdf']) {
  const x=copy();x.evidence.documentUrl=url;
  assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false,url);
 }
});
