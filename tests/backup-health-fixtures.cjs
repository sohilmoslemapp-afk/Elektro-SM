// Execute the real V97 backup-health handler against isolated mock data.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('prototypes/integrated-titleblock-schematic-v97.html','utf8');
const match=html.match(/\$\('checkBackupHealth'\)\.onclick=\(\)=>\{[\s\S]*?(?=\$\('runRegressionChecks'\)\.onclick=)/);
assert.ok(match,'Backup health handler missing');
function run(raw,parts=[],edges=[]){
 const elements={checkBackupHealth:{},backupHealthStatus:{textContent:''}};
 const context={AUTO_RECOVERY_KEY:'test-key',parts,edges,$:id=>elements[id],localStorage:{getItem:key=>{assert.equal(key,'test-key');return raw}}};
 vm.runInNewContext(match[0],context);
 assert.equal(typeof elements.checkBackupHealth.onclick,'function');
 elements.checkBackupHealth.onclick();
 return elements.backupHealthStatus.textContent;
}
const snapshot=schematic=>JSON.stringify({savedAt:'2026-11-19T20:00:00Z',schematic});
const valid={kind:'UNVERIFIED_SCHEMATIC_WITH_TITLEBLOCK',seq:1,parts:[{id:'A'}],edges:[]};
assert.match(run(null),/No autosave recovery/);
assert.match(run('{broken'),/Recovery unreadable/);
assert.match(run(snapshot({parts:[],edges:[],seq:1})),/Invalid recovery structure/);
assert.match(run(snapshot(valid),[{id:'A'}],[]),/Autosave/);
assert.doesNotMatch(run(snapshot(valid),[{id:'A'}],[]),/differs from current diagram/);
assert.match(run(snapshot(valid),[],[]),/differs from current diagram/);
assert.match(run(snapshot({...valid,parts:[{id:'A'},{id:'A'}]})),/duplicate IDs/);
console.log('PASS: 7 backup recovery scenarios; no actual project storage changed');
