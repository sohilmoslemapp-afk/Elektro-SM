const assert=require('node:assert/strict');
const {readImageText}=require('../src/image-text-recognition');
(async()=>{
 const blocks=Array.from({length:500},(_,i)=>({rawValue:'  '+('A'.repeat(500))+i+'  '}));
 const env={TextDetector:class{async detect(){return [null,{},...blocks]}}};
 const result=await readImageText({},env);
 assert.equal(result.status,'review_required');
 assert.equal(result.verified,false);
 assert.equal(result.lines.length,98);
 assert.ok(result.lines.every(line=>line.length<=300));
 const empty=await readImageText({}, {TextDetector:class{async detect(){return [null,{}, {rawValue:42}]}}});
 assert.equal(empty.status,'no_text');
 console.log('Bounded experimental OCR output regression passed');
})().catch(e=>{console.error(e);process.exitCode=1});
