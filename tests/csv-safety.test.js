'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('prototypes/ElektroPlan-SM-integriert.html','utf8');
const script=html.split('<script>').slice(1).map(x=>x.split('</script>')[0]).join('\n');
const match=script.match(/const csvCell=v=>\{[^\n]+\};/);
assert.ok(match,'CSV escaping helper must exist');
const csvCell=vm.runInNewContext(match[0]+';csvCell');
for(const value of ['=1+1','+SUM(1,2)','-2+3','@SUM(A1)','  =HYPERLINK("https://example.invalid")','\t=2+2','\n+1']){
 const encoded=csvCell(value);
 assert.ok(encoded.startsWith('"\''),'Formula-like CSV content must be neutralized: '+JSON.stringify(value));
 assert.ok(encoded.endsWith('"'),'CSV must remain quoted');
}
assert.equal(csvCell('Schneider Electric'),'"Schneider Electric"');
assert.equal(csvCell('A"1'),'"A""1"');
assert.equal(csvCell('A1'),'"A1"');
assert.equal(csvCell('A;B'),'"A;B"');
assert.equal(csvCell('Änderung'),'"Änderung"');
assert.equal(csvCell(''),'""');
assert.equal(csvCell(null),'""');
const documentMatch=script.match(/const csvDocument=rows=>[^\n]+;/);
assert.ok(documentMatch,'Both exports must use shared CSV document serializer');
const csvDocument=vm.runInNewContext(match[0]+'\n'+documentMatch[0]+'\ncsvDocument');
const document=csvDocument([['Name','Value'],['=1+1','A;B']]);
assert.equal(document,'\uFEFF"Name";"Value"\r\n"\'=1+1";"A;B"');
assert.ok(script.includes('csvDocument(lines)')&&script.includes('csvDocument(rows)'),'BOM and wire exports must share safe serializer');
console.log('CSV formula-injection and quoting regression passed');
