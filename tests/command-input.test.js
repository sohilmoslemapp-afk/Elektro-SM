'use strict';
const assert=require('node:assert/strict');
const {parse}=require('../src/command-input');
for(const [phrase,action] of [['Projekt speichern','save'],['save project','save'],['احفظ المشروع','save'],['أضف شريط بورنات','terminal'],['add terminal strip','terminal'],['Klemmleiste hinzufügen','terminal'],['أضف قاطع LS','addLs'],['add circuit breaker','addLs'],['LS hinzufügen','addLs'],['تراجع','undo'],['undo','undo'],['rückgängig','undo']])assert.equal(parse(phrase).action,action,phrase);
for(const phrase of ['delete all projects','امسح كل شيء','save project and delete','<script>',''])assert.equal(parse(phrase).action,null,phrase);
console.log('German English Arabic command parsing and fail-closed cases passed');
