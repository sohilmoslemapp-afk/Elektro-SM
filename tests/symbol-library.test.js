const assert=require('node:assert/strict');
const lib=require('../src/symbol-library.js');
assert.deepEqual(lib.KINDS,['mcb','rcd','switch','fuse','relay-coil','contact-no','contact-nc','terminal']);
const mk=()=>({tagName:'',attrs:{},children:[],setAttribute(k,v){this.attrs[k]=v},appendChild(c){this.children.push(c)}});
const doc={createElementNS(_ns,tag){const e=mk();e.tagName=tag;return e}};
for(const kind of lib.KINDS){
 const host=mk();
 assert.equal(lib.draw(doc,host,{symbolKind:kind,x:100,y:100}),true);
 assert.ok(host.children.length>0);
 assert.equal(host.children[0].attrs['data-symbol-kind'],kind);
 assert.ok(host.children[0].children.length>0);
}
assert.equal(lib.draw(doc,mk(),{symbolKind:'unknown',x:0,y:0}),false);
console.log('Symbol primitive tests passed');
