/* ElektroPlan SM — geometric IEC-style symbol primitives.
 * Symbol shapes are preliminary representations, not certified manufacturer diagrams.
 * Each device has its own kind; terminals are explicit and never inferred.
 */
(function(root){
'use strict';
const KINDS=Object.freeze(['mcb','rcd','switch','fuse','relay-coil','contact-no','contact-nc','terminal']);
const ns='http://www.w3.org/2000/svg';
function make(doc,tag,attrs,parent){const el=doc.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));parent.appendChild(el);return el}
function draw(doc,parent,s){
 const kind=KINDS.includes(s.symbolKind)?s.symbolKind:null;
 if(!kind)return false;
 const x=s.x+30,y=s.y+36,g=make(doc,'g',{'data-symbol-kind':kind},parent);
 const line=(a,b,c,d)=>make(doc,'line',{x1:x+a,y1:y+b,x2:x+c,y2:y+d,stroke:'#13263f','stroke-width':2},g);
 const circle=(a,b,r)=>make(doc,'circle',{cx:x+a,cy:y+b,r,fill:'white',stroke:'#13263f','stroke-width':1.7},g);
 if(kind==='mcb'){line(0,-22,0,-11);line(0,11,0,22);make(doc,'rect',{x:x-13,y:y-11,width:26,height:22,fill:'white',stroke:'#13263f','stroke-width':1.7},g);line(-8,8,8,-8)}
 if(kind==='rcd'){line(0,-22,0,-12);line(0,12,0,22);make(doc,'rect',{x:x-16,y:y-12,width:32,height:24,fill:'white',stroke:'#13263f','stroke-width':1.7},g);make(doc,'ellipse',{cx:x,cy:y,rx:9,ry:6,fill:'none',stroke:'#13263f','stroke-width':1.6},g);line(0,-6,0,6)}
 if(kind==='switch'){line(0,-22,0,-9);line(0,9,0,22);circle(0,-9,2);circle(0,9,2);line(0,9,11,-8)}
 if(kind==='fuse'){line(0,-22,0,-12);line(0,12,0,22);make(doc,'rect',{x:x-7,y:y-12,width:14,height:24,fill:'white',stroke:'#13263f','stroke-width':1.7},g)}
 if(kind==='relay-coil'){line(0,-22,0,-12);line(0,12,0,22);make(doc,'rect',{x:x-17,y:y-12,width:34,height:24,rx:3,fill:'white',stroke:'#13263f','stroke-width':1.7},g)}
 if(kind==='contact-no'||kind==='contact-nc'){line(0,-22,0,-9);line(0,9,0,22);circle(0,-9,2);circle(0,9,2);line(0,9,kind==='contact-nc'?0:12,-9)}
 if(kind==='terminal'){circle(0,0,8);line(0,-22,0,-8);line(0,8,0,22)}
 return true;
}
const api={KINDS,draw};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanSymbols=api;
})(typeof globalThis!=='undefined'?globalThis:this);
