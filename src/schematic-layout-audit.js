/* Schematic geometry audit: purely visual overlaps, not electrical continuity. */
(function(root){'use strict';
function inspect(project){
 const symbols=Array.isArray(project?.symbols)?project.symbols:[];
 const warnings=[];
 for(let i=0;i<symbols.length;i++){
  const a=symbols[i];if(!a)continue;
  if(!Number.isFinite(a.x)||!Number.isFinite(a.y)){warnings.push({kind:'invalid-position',first:a.id});continue;}
  for(let j=i+1;j<symbols.length;j++){
   const b=symbols[j];if(!b||!Number.isFinite(b.x)||!Number.isFinite(b.y))continue;
   if(Math.abs(a.x-b.x)<86&&Math.abs(a.y-b.y)<50)warnings.push({kind:'symbol-overlap',first:a.id,second:b.id});
  }
  if(a.x<45||a.x>755||a.y<30||a.y>390)warnings.push({kind:'outside-editor',first:a.id});
 }
 return {warnings,approved:false,disclaimer:'Nur grafische Plausibilitätsprüfung – keine elektrische Freigabe.'};
}
const api={inspect};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElektroPlanLayoutAudit=api;
})(typeof globalThis!=='undefined'?globalThis:this);
