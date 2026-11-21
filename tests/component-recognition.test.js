const assert=require('node:assert/strict');
const {test}=require('node:test');
const {prepareIdentification,reviewCandidate}=require('../src/component-recognition');
const candidate={manufacturer:'Example',model:'M1',partNumber:'P1',origin:'ocr',confidence:0.99};
const record={identity:{manufacturer:'Example',model:'M1',partNumber:'P1'},evidence:{documentTitle:'Datasheet',documentUrl:'https://example.invalid/d.pdf',documentRevision:'1',pageReference:'2',documentPartNumber:'P1',publisherVerified:true,publisherReviewReference:'manufacturer-domain-review',modelMatchVerified:true,modelReviewReference:'datasheet-model-check',terminalMappingReviewed:true,reviewer:'qualified-reviewer',reviewDate:'2026-11-21'},terminals:[{name:'A1',function:'Documented',sourceReference:'2'}]};
test('OCR confidence cannot authorize terminals',()=>{
 const x=prepareIdentification({candidates:[candidate]});
 assert.equal(x.terminalMappingAllowed,false);
 assert.equal(x.status,'identity_review_required');
});
test('matching reviewed manufacturer record allows reference, not approval',()=>{
 const x=reviewCandidate(candidate,record);
 assert.equal(x.terminalMappingAllowed,true);
 assert.equal(x.electricallyApproved,false);
});
test('mismatched model blocks mapping',()=>{
 const x=reviewCandidate({...candidate,model:'M2'},record);
 assert.equal(x.terminalMappingAllowed,false);
 assert.equal(x.status,'identity_mismatch');
});
test('unverified manufacturer record blocks mapping',()=>{
 const x=reviewCandidate(candidate,{...record,evidence:{...record.evidence,publisherVerified:false}});
 assert.equal(x.terminalMappingAllowed,false);
});
test('missing identity is not accepted',()=>{
 assert.equal(reviewCandidate({},record).terminalMappingAllowed,false);
});

test('missing document part number blocks terminal mapping',()=>{
 const x=reviewCandidate(candidate,{...record,evidence:{...record.evidence,documentPartNumber:undefined}});
 assert.equal(x.terminalMappingAllowed,false);
 assert.equal(x.electricallyApproved,false);
});
test('missing professional reviewer blocks terminal mapping',()=>{
 const x=reviewCandidate(candidate,{...record,evidence:{...record.evidence,reviewer:''}});
 assert.equal(x.terminalMappingAllowed,false);
});
