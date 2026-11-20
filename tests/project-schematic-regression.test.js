'use strict';
const assert=require('node:assert/strict');
const {validate}=require('../src/schematic-validation.js');
const {validateImport}=require('../src/project-import-validation.js');
const symbol=(id,type='LS',x=100,y=100)=>({id,type,x,y});
const part={type:'LS-Schalter',brand:'Example',model:'X1',docTitle:'',docUrl:''};
const data={name:'Test',symbols:[symbol('Q1'),symbol('H1','LAMP',250,100)],wires:[{a:'Q1',b:'H1'}],parts:[part]};
const payload=d=>({format:'ElektroPlan-SM-1',data:d});
const cases=[
 ['valid base',data,true],
 ['duplicate ID',{...data,symbols:[symbol('Q1'),symbol('Q1')]},false],
 ['dangling wire',{...data,wires:[{a:'Q1',b:'missing'}]},false],
 ['self wire',{...data,wires:[{a:'Q1',b:'Q1'}]},false],
 ['unknown type',{...data,symbols:[symbol('Q1','INVALID')]},false],
 ['NaN coordinate',{...data,symbols:[symbol('Q1','LS',NaN,0)]},false],
 ['infinite coordinate',{...data,symbols:[symbol('Q1','LS',Infinity,0)]},false],
 ['missing parts',{...data,parts:undefined},false],
 ['bad project name',{...data,name:9},false],
 ['too long name',{...data,name:'x'.repeat(201)},false],
 ['unsafe doc url',{...data,parts:[{...part,docUrl:'javascript:alert(1)'}]},false],
 ['valid HTTPS doc url',{...data,parts:[{...part,docUrl:'https://example.org/manual.pdf'}]},true],
 ['invalid part',{...data,parts:[{type:'LS'}]},false],
 ['oversized coordinate',{...data,symbols:[symbol('Q1','LS',100001,0)]},false],
 ['empty schematic',{name:'Empty',symbols:[],wires:[],parts:[]},true]
];
for(const [label,d,expected] of cases){
 const imported=validateImport(payload(d));
 assert.equal(imported.ok,expected,'Import: '+label);
 if(Array.isArray(d.symbols)&&Array.isArray(d.wires)){
  const schematic=validate(d);
  if(['valid base','duplicate ID','dangling wire','self wire','unknown type','NaN coordinate','infinite coordinate','empty schematic'].includes(label))
   assert.equal(schematic.valid,expected,'Schematic: '+label);
  assert.match(schematic.disclaimer,/Keine Prüfung/);
 }
}
assert.equal(validateImport({format:'wrong',data}).ok,false);
assert.equal(validateImport(null).ok,false);
assert.equal(validate(null).valid,false);
const duplicates=validate({...data,symbols:data.symbols.map(s=>({...s,manualTerminals:['1']})),wires:[{a:'Q1',b:'H1',fromTerminal:'1',toTerminal:'1'},{a:'H1',b:'Q1',fromTerminal:'1',toTerminal:'1'}]});
assert.equal(duplicates.valid,true);
assert.ok(duplicates.warnings.some(w=>w.includes('doppelte')));
const disconnected=validate({...data,wires:[]});
assert.ok(disconnected.warnings.some(w=>w.includes('Q1')));
console.log('Schematic and project import regression: 15 scenarios plus invariants passed; structural checks only.');
