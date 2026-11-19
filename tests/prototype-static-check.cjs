// ElektroPlan SM: static prototype checks. No browser or electrical safety certification.
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const path='prototypes/integrated-titleblock-schematic-v96.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
assert.equal(scripts.length,1,'Expected one inline application script');
new vm.Script(scripts[0],{filename:path});
for(const id of ['runSelfDiagnostics','runRegressionChecks','exportDeviceReviewReport','recordDeviceReview','exportDeviceLibrary','importDeviceLibrary'])assert.ok(html.includes('id="'+id+'"'),'Missing UI control '+id);
assert.ok(html.includes('UNVERIFIED_USER_ENTRY'),'Missing unverified provenance marker');
assert.ok(html.includes('NOT an electrical safety certification'),'Missing safety disclaimer');
console.log('PASS: JavaScript syntax, required UI controls and provenance disclaimers');
