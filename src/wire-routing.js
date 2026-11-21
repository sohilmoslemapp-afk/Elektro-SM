/* ElektroPlan SM — conservative orthogonal wire routing, visual only.
 * Intersections never imply electrical junctions; graph edges remain explicit.
 */
(function(root){
'use strict';
const GRID=10;
const snap=n=>Math.round(n/GRID)*GRID;
function route(a,b,mode='horizontal-first'){
 if(!a||!b||![a.x,a.y,b.x,b.y].every(Number.isFinite))throw Error('invalid_point');
 if(!['horizontal-first','vertical-first'].includes(mode))throw Error('invalid_route_mode');
 const start={x:a.x,y:a.y},end={x:b.x,y:b.y};
 const corner=mode==='horizontal-first'?{x:end.x,y:start.y}:{x:start.x,y:end.y};
 const points=[start,corner,end].filter((p,i,arr)=>i===0||p.x!==arr[i-1].x||p.y!==arr[i-1].y);
 return points;
}
function toPath(points){
 if(!Array.isArray(points)||points.length<1)throw Error('invalid_points');
 return points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
}
function intersections(a,b){
 const segments=pts=>pts.slice(1).map((p,i)=>({a:pts[i],b:p}));
 const found=[];
 for(const x of segments(a))for(const y of segments(b)){
  const xh=x.a.y===x.b.y,yh=y.a.y===y.b.y;
  if(xh===yh)continue;
  const h=xh?x:y,v=xh?y:x,px=v.a.x,py=h.a.y;
  if(px>=Math.min(h.a.x,h.b.x)&&px<=Math.max(h.a.x,h.b.x)&&py>=Math.min(v.a.y,v.b.y)&&py<=Math.max(v.a.y,v.b.y))found.push({x:px,y:py,connected:false});
 }
 return found;
}
const api={GRID,snap,route,toPath,intersections};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanWireRouting=api;
})(typeof globalThis!=='undefined'?globalThis:this);
