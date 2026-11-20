'use strict';
const assert=require('node:assert/strict');
const norm=s=>String(s||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('de');
function rank(qb,qm,b,m){
 const eb=norm(b)===norm(qb), em=norm(m)===norm(qm);
 if(eb&&em)return {score:0,label:'Hersteller und Modell stimmen exakt überein',difference:'Keine Abweichung in den eingegebenen Bezeichnungen'};
 if(em)return {score:1,label:'Modell gleich – Hersteller abweichend',difference:'Hersteller stimmt nicht überein: '+b};
 if(eb&&(norm(m).includes(norm(qm))||norm(qm).includes(norm(m))))return {score:2,label:'Hersteller gleich – Modell nur teilweise ähnlich',difference:'Modell abweichend: '+m};
 if(eb)return {score:3,label:'Hersteller gleich – Modell abweichend',difference:'Modell stimmt nicht überein: '+m};
 if(norm(b).includes(norm(qb))||norm(m).includes(norm(qm)))return {score:4,label:'Teilweise Textübereinstimmung',difference:'Hersteller/Modell nicht exakt bestätigt'};
 return null;
}
const tests=[['exact','ABB','F202 A','ABB','F202 A',0],['case-insensitive','abb','f202 a','ABB','F202 A',0],['wrong manufacturer','ABB','F202 A','Hager','F202 A',1],['partial model','ABB','F202','ABB','F202 A',2],['wrong model','ABB','F202 A','ABB','S201',3],['partial manufacturer','ABB','F202 A','ABB GmbH','X999',4],['no match','ABB','F202 A','Siemens','5SY',null]];
for(const [name,qb,qm,b,m,expected] of tests){assert.equal(rank(qb,qm,b,m)?.score??null,expected,name);console.log('PASS',name)}
console.log('7/7 ranking cases passed; UI and integration untested');
