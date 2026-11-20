const assert=require('node:assert/strict');
const {test}=require('node:test');
const {assessManufacturerEvidence}=require('../src/manufacturer-evidence');
const valid={
 identity:{manufacturer:'Example Manufacturer',model:'EX-1',partNumber:'EX-1-01'},
 evidence:{documentTitle:'EX-1 Datasheet',documentPartNumber:'EX-1-01',publisherReviewReference:'manual reviewer check',modelReviewReference:'manual model check',reviewer:'Example Reviewer',reviewDate:'2026-11-20',documentUrl:'https://example.invalid/ex-1.pdf',documentRevision:'Rev A',pageReference:'p. 3',publisherVerified:true,modelMatchVerified:true,terminalMappingReviewed:true},
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

test('missing article number blocks terminal reference',()=>{
 const x=copy();delete x.identity.partNumber;
 assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false);
});
test('different article number in document blocks terminal reference',()=>{
 const x=copy();x.evidence.documentPartNumber='EX-2-01';
 assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false);
});
test('review flags without reviewer provenance cannot authorize terminal reference',()=>{
 const x=copy();delete x.evidence.publisherReviewReference;delete x.evidence.reviewer;
 assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false);
});

test('invalid calendar review dates cannot authorize terminal references',()=>{
 for(const date of ['2026-02-30','2026-13-01','2026-00-10','2026-11-31']){
  const x=copy();x.evidence.reviewDate=date;
  assert.equal(assessManufacturerEvidence(x).usableForTerminalReference,false,date);
 }
});
test('manual reviewer evidence is never presented as verified by a manufacturer API',()=>{
 const result=assessManufacturerEvidence(copy());
 assert.equal(result.verificationMethod,'manual-record-only');
 assert.equal(result.manufacturerApiVerified,false);
 assert.equal(result.electricallyApproved,false);
});
