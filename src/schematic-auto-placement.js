/* Find an unoccupied diagram position without altering existing symbols. */
(function(root){'use strict';
function place(symbols,options={}){
 const existing=Array.isArray(symbols)?symbols:[];
 const positions=[];
 for(let y=100;y<=355;y+=85)for(let x=100;x<=700;x+=125)positions.push({x,y});
 const valid=existing.filter(s=>s&&Number.isFinite(s.x)&&Number.isFinite(s.y));
 const free=positions.find(p=>valid.every(s=>Math.abs(s.x-p.x)>=96||Math.abs(s.y-p.y)>=60));
 return free||null;
}
const api={place};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanAutoPlacement=api;
})(typeof globalThis!=='undefined'?globalThis:this);
