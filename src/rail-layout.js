/* ElektroPlan SM — default rail geometry, not a wiring/netlist generator. */
(function(root){
'use strict';
const RAILS=Object.freeze([
 Object.freeze({id:'L1',y:36,color:'#222222',position:'top'}),
 Object.freeze({id:'L2',y:64,color:'#222222',position:'top'}),
 Object.freeze({id:'L3',y:92,color:'#222222',position:'top'}),
 Object.freeze({id:'N',y:120,color:'#2366db',position:'top'}),
 Object.freeze({id:'PE',y:540,color:'#169b45',stripe:'#f1d400',position:'bottom'})
]);
function layout(width=960,height=580){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<320||height<300)throw Error('invalid_canvas_size');
 const scale=height/580;
 return RAILS.map(r=>({...r,x1:70,x2:width-30,y:r.y*scale}));
}
function render(svg,doc,width=960,height=580){
 const ns='http://www.w3.org/2000/svg',g=doc.createElementNS(ns,'g');
 g.setAttribute('data-layer','conductor-rail-guides');
 for(const r of layout(width,height)){
  const line=doc.createElementNS(ns,'line');
  for(const [k,v] of Object.entries({x1:r.x1,x2:r.x2,y1:r.y,y2:r.y,stroke:r.color,'stroke-width':r.id==='PE'?4:2}))line.setAttribute(k,v);
  g.appendChild(line);
  if(r.id==='PE'){
   const stripe=doc.createElementNS(ns,'line');
   for(const [k,v] of Object.entries({x1:r.x1,x2:r.x2,y1:r.y,y2:r.y,stroke:r.stripe,'stroke-width':2,'stroke-dasharray':'10 8'}))stripe.setAttribute(k,v);
   g.appendChild(stripe);
  }
  const label=doc.createElementNS(ns,'text');
  label.setAttribute('x','15');label.setAttribute('y',String(r.y+5));label.setAttribute('font-size','16');label.setAttribute('font-weight','bold');label.setAttribute('fill',r.color);label.textContent=r.id;g.appendChild(label);
 }
 svg.appendChild(g);return g;
}
const api={RAILS,layout,render};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanRailLayout=api;
})(typeof globalThis!=='undefined'?globalThis:this);
