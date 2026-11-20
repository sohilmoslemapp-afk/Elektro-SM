const assert=require('node:assert/strict');
const {test}=require('node:test');
const {support,readImageText}=require('../src/image-text-recognition');
test('unsupported browser returns manual fallback',async()=>{
 assert.equal(support({}),false);
 const r=await readImageText({},{});assert.equal(r.status,'unsupported');assert.equal(r.verified,false);
});
test('detected image text remains unverified',async()=>{
 class TextDetector{async detect(){return [{rawValue:'Siemens'},{rawValue:'  3RT  '}]}}
 const r=await readImageText({}, {TextDetector});
 assert.deepEqual(r.lines,['Siemens','3RT']);assert.equal(r.status,'review_required');assert.equal(r.verified,false);
});
test('detector failures do not crash workflow',async()=>{
 class TextDetector{async detect(){throw Error('failure')}}
 const r=await readImageText({}, {TextDetector});assert.equal(r.status,'error');assert.equal(r.verified,false);
});
test('empty image is rejected',async()=>{
 class TextDetector{async detect(){return []}}
 const r=await readImageText(null,{TextDetector});assert.equal(r.status,'invalid_image');
});
