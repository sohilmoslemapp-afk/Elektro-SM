'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../prototypes/ElektroPlan-SM-integriert.html'),'utf8');
assert.match(html,/const label=node\('text',\{x:side\*49,y:ty\+3,[^}]*'data-terminal':terminal\},g\)/,'Number labels must be selectable');
assert.match(html,/if\(wireStart===s\.id\)\{wireStart=null;wireStartTerminal=null;msg\('Startauswahl aufgehoben'\);return\}/,'Second tap on same symbol cancels start selection');
assert.match(html,/Boolean\(wireStartTerminal\)!==Boolean\(picked\)/,'Half-assigned connections remain forbidden');
console.log('Terminal label touch targets and cancel selection contract passed');
