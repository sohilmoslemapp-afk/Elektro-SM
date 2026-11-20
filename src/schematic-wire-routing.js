/* Orthogonal schematic wire routing with explicit, deterministic bend points. */
(function(root){'use strict';
function finitePoint(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<=100000&&Math.abs(p.y)<=100000}
function route(from,to,offset=0){
 if(!finitePoint(from)||!finitePoint(to)||!Number.isFinite(offset)||Math.abs(offset)>10000)return null;
 const x1=from.x,y1=from.y,x2=to.x,y2=to.y;
 if(x1===x2||y1===y2)return 'M'+x1+' '+y1+' L'+x2+' '+y2;
 const middle=Math.round((x1+x2)/2+offset);
 return 'M'+x1+' '+y1+' H'+middle+' V'+y2+' H'+x2;
}
const api={route};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanWireRouter=api;
})(typeof globalThis!=='undefined'?globalThis:this);
