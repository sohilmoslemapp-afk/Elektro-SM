'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('prototypes/ElektroPlan-SM-integriert.html','utf8');
assert.match(html,/id="previewDxfFile"/);
assert.match(html,/id="dxfPreviewResult"/);
assert.match(html,/src="\.\.\/src\/dxf-preview\.js"/);
assert.match(html,/ElektroPlanDxfPreview\.previewDxf\(await file\.text\(\)\)/);
assert.match(html,/Aktuelles Projekt unverändert/);
console.log('Read-only DXF preview UI integration passed');
