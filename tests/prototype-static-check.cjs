// ElektroPlan SM: static prototype checks. No browser or electrical safety certification.
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const path='prototypes/integrated-titleblock-schematic-v97.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
assert.equal(scripts.length,1,'Expected one inline application script');
new vm.Script(scripts[0],{filename:path});
for(const id of ['checkBackupHealth','runSelfDiagnostics','runRegressionChecks','exportDeviceReviewReport','recordDeviceReview','exportDeviceLibrary','importDeviceLibrary'])assert.ok(html.includes('id="'+id+'"'),'Missing UI control '+id);
assert.ok(html.includes('UNVERIFIED_USER_ENTRY'),'Missing unverified provenance marker');
assert.ok(html.includes('NOT an electrical safety certification'),'Missing safety disclaimer');

const structuralSource=scripts[0].match(/function structuralFixtureCheck\([\s\S]*?return warnings\}/);
assert.ok(structuralSource,'Structural diagnostic helper missing');
const csvSource=scripts[0].match(/function bomCsvCell\([\s\S]*?return '"'[\s\S]*?\}/);
assert.ok(csvSource,'CSV escaping helper missing');
const structural=vm.runInNewContext('('+structuralSource[0]+')');
const csv=vm.runInNewContext('('+csvSource[0]+')');
const check=(parts,edges)=>Array.from(structural(parts,edges));
assert.deepEqual(check([{id:'A',x:0,y:0},{id:'B',x:1,y:1}],[{a:{id:'A'},b:{id:'B'}}]),[]);
assert.ok(check([{id:'A',x:0,y:0},{id:'A',x:1,y:1}],[]).includes('duplicate-id'));
assert.ok(check([{id:'A',x:NaN,y:0}],[]).includes('invalid-coordinate'));
assert.ok(check([{id:'A',x:0,y:0}],[{a:{id:'A'},b:{id:'MISSING'}}]).includes('missing-endpoint'));
assert.ok(check([], [null]).includes('invalid-edge'));
assert.equal(csv('a;"b"'),'"a;""b"""');
console.log('PASS: Six executable regression fixture checks');
assert.ok(scripts[0].includes("localStorage.getItem(AUTO_RECOVERY_KEY)"),'Backup health check must read autosave');
assert.ok(scripts[0].includes("d.kind!=='UNVERIFIED_SCHEMATIC_WITH_TITLEBLOCK'"),'Backup check must validate schema kind');
assert.ok(scripts[0].includes("Array.isArray(d.parts)")&&scripts[0].includes("Array.isArray(d.edges)"),'Backup check must validate arrays');
assert.ok(scripts[0].includes("read-only; no restore performed"),'Backup check must not claim recovery');
console.log('PASS: Autosave recovery check presence and structure guards');

console.log('PASS: JavaScript syntax, required UI controls and provenance disclaimers');
